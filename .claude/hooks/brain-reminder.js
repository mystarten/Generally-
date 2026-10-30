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
 * Le rappel est volontairement silencieux quand il n'a rien a dire, pour ne
 * pas couter un tour de modele a chaque « ok merci » :
 *   - deja en train de continuer a cause d'un hook  -> on laisse passer
 *   - Claude vient de parler du cerveau             -> c'est deja fait
 *   - un fichier de brain/ a bouge il y a moins     -> c'est deja fait
 *     de 2 minutes
 */

const fs = require('fs');
const path = require('path');

const BRAIN = path.join(__dirname, '..', '..', 'brain');
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

function pass() { process.exit(0); }

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => { raw += d; });
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw || '{}'); } catch (_) { pass(); }

  // 1. On continue deja a cause d'un hook : ne pas boucler.
  if (input.stop_hook_active) pass();

  // 2. Claude vient de dire qu'il a ecrit dans le cerveau.
  const last = String(input.last_assistant_message || '');
  if (/brain\.js|brain\/|cerveau/i.test(last)) pass();

  // 3. Le cerveau a bouge a l'instant : c'est deja fait.
  if (Date.now() - newestMtime(BRAIN) < RECENT_MS) pass();

  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: [
      'Verification cerveau (hook Stop, une seule fois) : dans ce tour, Mats a-t-il donne une',
      'information durable — objectif, decision, projet, personne, outil, agent IA ?',
      '',
      'Si OUI : ecris-la maintenant avec',
      '  node brain.js add --type <profile|area|person|topic|agent> --name <nom> --fact "..." [--link a,b]',
      'uniquement ses propres mots, sans deduction, en ajoutant les liens [[...]] vers',
      'les elements deja presents, puis annonce-le en UNE ligne.',
      'Jamais de numero de carte, d\'identifiant ni de mot de passe.',
      '',
      'Si NON : ne fais rien, reponds simplement « rien a ajouter au cerveau » et arrete-toi.'
    ].join('\n')
  }));
  process.exit(0);
});
