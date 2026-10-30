#!/usr/bin/env node
'use strict';

/*
 * Hook Stop : rappelle a Claude de verifier s'il reste une information
 * durable a ecrire dans brain/.
 *
 * Un hook Stop ne parle a Claude QUE par du JSON sur stdout
 * ({"decision":"block","reason":...}) ou par stderr + code 2.
 * Un simple echo avec un code 0 part dans le journal de debug et n'atteint
 * jamais Claude.
 *
 * Deux verifications, dans cet ordre :
 *   1. des changements du cerveau ne sont pas sur GitHub (non commites, ou
 *      commites mais pas pousses) -> on bloque : il faut publier ;
 *   2. sinon, rappel de noter une info durable, volontairement silencieux
 *      quand il n'a rien a dire, pour ne pas couter un tour a chaque « ok » :
 *        - deja en train de continuer a cause d'un hook  -> on laisse passer
 *        - Claude vient de parler du cerveau             -> c'est deja fait
 *        - un fichier de brain/ a bouge il y a moins     -> c'est deja fait
 *          de 2 minutes
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const BRAIN = path.join(ROOT, 'brain');
const RECENT_MS = 120000;

function newestMtime(dir) {
  let newest = 0;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return 0; }
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) newest = Math.max(newest, newestMtime(abs));
    else if (e.isFile() && e.name.endsWith('.md')) {
      try { newest = Math.max(newest, fs.statSync(abs).mtimeMs); } catch (_) {}
    }
  }
  return newest;
}

/** Ce qui, dans le cerveau, n'est pas encore sur GitHub. Silencieux hors depot git. */
function unpublished() {
  const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    if (git('status', '--porcelain', '--', 'brain', 'cerveau/data.json')) return 'des fiches du cerveau ne sont pas commitees';
    try {
      const ahead = Number(git('rev-list', '--count', '@{u}..HEAD', '--', 'brain', 'cerveau/data.json'));
      if (ahead > 0) return ahead + ' commit(s) du cerveau pas encore pousse(s)';
    } catch (_) {
      // pas de branche amont : rien a comparer
    }
  } catch (_) {
    return null;
  }
  return null;
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

function pass() { process.exit(0); }

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => { raw += d; });
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw || '{}'); } catch (_) { pass(); }

  // On continue deja a cause d'un hook : ne pas boucler.
  if (input.stop_hook_active) pass();

  // 1. Tout ce qui est ecrit doit etre en ligne.
  const pending = unpublished();
  if (pending) {
    block('Cerveau non publie : ' + pending + '. Lance « node brain.js publish » maintenant, '
      + 'verifie que la sortie dit « publie sur ... + main (page en ligne) », puis annonce-le en une ligne. '
      + 'Si le push echoue, dis-le clairement a Mats au lieu de l\'ignorer.');
  }

  // 2. Rappel de noter. Claude vient de dire qu'il a ecrit dans le cerveau.
  const last = String(input.last_assistant_message || '');
  if (/brain\.js|brain\/|cerveau/i.test(last)) pass();

  // Le cerveau a bouge a l'instant : c'est deja fait.
  if (Date.now() - newestMtime(BRAIN) < RECENT_MS) pass();

  block([
    'Verification cerveau (hook Stop, une seule fois) : dans ce tour, Mats a-t-il donne une',
    'information durable — objectif, decision, projet, personne, outil, agent IA, record, date ?',
    '',
    'Si OUI : ecris-la maintenant avec',
    '  node brain.js add --type <hub|area|project|person|topic|agent> --name <nom> --axis <axe> --fact "..." --link a,b',
    'uniquement ses propres mots, sans deduction, relie aux elements deja presents.',
    'La commande publie toute seule : verifie qu\'elle affiche « publie sur ... ».',
    'Annonce-le en UNE ligne. Jamais de carte, d\'identifiant, d\'e-mail ni de mot de passe.',
    '',
    'Si NON : ne fais rien, reponds simplement « rien a ajouter au cerveau » et arrete-toi.'
  ].join('\n'));
});
