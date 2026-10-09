/* =============================================================================
   verifier-sog-valider.js — contrôle de la validation écrite du module SOG.

       node scripts/verifier-sog-valider.js

   Ce que ce script prouve, carte par carte, sur les 328 du document :

     1. chaque carte sait produire une fiche, avec au moins un champ et un
        attendu non vide — autrement une carte serait bloquée en haut de
        l'échelle, impossible à valider ;
     2. la réponse exacte du document est acceptée. C'est l'invariant qui
        compte : si recopier le document ne valide pas, la notation est
        fausse, pas l'élève ;
     3. une fiche laissée vide est refusée — pas de validation par le silence ;
     4. une poignée de cas de bord jugés à la main : le nom de famille seul,
        l'année à côté, le jour oublié, les mots-clés à moitié.

   Aucun navigateur, aucun localStorage : le module de validation est pur,
   c'est précisément ce qui le rend vérifiable ici.
   ============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
global.window = global.window || global;
eval(fs.readFileSync(path.join(RACINE, 'training', 'tz-sog-data.js'), 'utf8'));
require(path.join(RACINE, 'training', 'tz-sog-valider.js'));

const V = global.window.TZ_SOG_VALIDER;
const cartes = global.window.TZ_SOG_DATA.cartes;

let echecs = 0;
function echec(quoi, detail) {
  echecs++;
  console.log('   ÉCHEC  ' + quoi + (detail ? '\n          ' + detail : ''));
}

/* La réponse que le document lui-même donne pour un champ. */
function reponseDuDocument(ch) {
  if (ch.controle === 'nom') return ch.attendu.nom;
  if (ch.controle === 'annee') return ch.attendu.texte;
  return ch.attendu.texte;
}

/* ------------------------------------------- 1 et 2 : toutes les cartes */
console.log('\n1. Chaque carte produit une fiche complète');
let champsTotal = 0;
const parType = {};
cartes.forEach(c => {
  const f = V.fiche(c);
  if (!f.champs.length) return echec('aucun champ : ' + c.id + ' [' + c.type + ']');
  if (!f.enonce) return echec('énoncé vide : ' + c.id + ' [' + c.type + ']');
  if (!f.modele) return echec('pas de ligne pour la copie : ' + c.id);
  champsTotal += f.champs.length;
  parType[c.type] = parType[c.type] || { n: 0, champs: 0, labels: {} };
  parType[c.type].n++;
  parType[c.type].champs += f.champs.length;
  f.champs.forEach(ch => {
    parType[c.type].labels[ch.label] = 1;
    if (!V.normaliser(reponseDuDocument(ch) || '')) {
      echec('attendu vide (' + ch.cle + ') : ' + c.id + ' [' + c.type + ']');
    }
  });
});
console.log('   ' + cartes.length + ' cartes, ' + champsTotal + ' champs, ' +
            (champsTotal / cartes.length).toFixed(2) + ' champ par fiche en moyenne');
Object.keys(parType).sort().forEach(t => {
  const p = parType[t];
  console.log('   ' + t.padEnd(9) + p.n.toString().padStart(4) + ' cartes · ' +
              (p.champs / p.n).toFixed(1) + ' champs · ' + Object.keys(p.labels).join(' / '));
});

console.log('\n2. La réponse du document est acceptée');
const refuses = [];
cartes.forEach(c => {
  const f = V.fiche(c);
  const reponses = {};
  f.champs.forEach(ch => { reponses[ch.cle] = reponseDuDocument(ch); });
  const r = V.corriger(f, reponses);
  if (r.verdict !== 'juste') {
    refuses.push({ c: c, r: r });
  }
});
if (refuses.length) {
  echec(refuses.length + ' carte(s) refusent la réponse du document');
  refuses.slice(0, 12).forEach(x => {
    console.log('          [' + x.c.type + '] ' + x.c.contenu.question);
    x.r.champs.filter(ch => ch.verdict !== 'juste').forEach(ch => {
      console.log('            ' + ch.verdict + ' · ' + ch.label + ' · écrit « ' +
                  ch.saisie + ' » · attendu « ' + ch.attendu + ' »' +
                  (ch.detail ? ' · ' + ch.detail : ''));
    });
  });
} else {
  console.log('   les 328 fiches sont validées par la réponse exacte du document');
}

console.log('\n3. Une fiche vide est refusée');
let videsAcceptees = 0;
cartes.forEach(c => {
  const r = V.corriger(V.fiche(c), {});
  if (r.verdict !== 'rate') videsAcceptees++;
});
if (videsAcceptees) echec(videsAcceptees + ' fiche(s) validées sans rien écrire');
else console.log('   aucune : les 328 sont refusées');

/* --------------------------------------------- 4 : les cas jugés à la main */
console.log('\n4. Cas de bord');
function trouver(predicat, quoi) {
  const c = cartes.find(predicat);
  if (!c) { echec('carte introuvable pour le test : ' + quoi); return null; }
  return c;
}
function attendre(nom, obtenu, voulu) {
  if (obtenu === voulu) console.log('   ok   ' + nom + ' → ' + obtenu);
  else echec(nom, 'attendu « ' + voulu +' », obtenu « ' + obtenu + ' »');
}
function verdictChamp(carte, cleChamp, saisie) {
  const f = V.fiche(carte);
  const ch = f.champs.find(x => x.cle === cleChamp);
  if (!ch) return 'champ-absent';
  const r = V.corriger(f, { [cleChamp]: saisie });
  return r.champs.find(x => x.cle === cleChamp).verdict;
}

const weber = trouver(c => c.type === 'citation' && /Max Weber/.test(c.contenu.auteur),
                      'citation de Max Weber');
if (weber) {
  attendre('nom de famille seul (« Weber »)', verdictChamp(weber, 'nom', 'Weber'), 'juste');
  attendre('nom complet', verdictChamp(weber, 'nom', 'Max Weber'), 'juste');
  attendre('sans majuscule ni accent', verdictChamp(weber, 'nom', 'max weber'), 'juste');
  attendre('faute de frappe (« Max Webber »)', verdictChamp(weber, 'nom', 'Max Webber'), 'juste');
  attendre('mauvais auteur (« Durkheim »)', verdictChamp(weber, 'nom', 'Durkheim'), 'rate');
  attendre('prénom seul (« Max »)', verdictChamp(weber, 'nom', 'Max'), 'rate');
  attendre('morceau du nom (« ebe »)', verdictChamp(weber, 'nom', 'ebe'), 'rate');
  attendre('champ vide', verdictChamp(weber, 'nom', ''), 'rate');
  attendre('bonne année', verdictChamp(weber, 'annee', '1919'), 'juste');
  attendre('année à deux ans près', verdictChamp(weber, 'annee', '1921'), 'presque');
  attendre('année très fausse', verdictChamp(weber, 'annee', '1848'), 'rate');
}

const orwell = trouver(c => c.contenu.source && /Orwell/.test(c.contenu.source.brut || ''),
                       'citation d’Orwell');
if (orwell) {
  attendre('le titre « 1984 » n’est pas l’année', verdictChamp(orwell, 'annee', '1984'), 'rate');
  attendre('l’année d’Orwell est 1949', verdictChamp(orwell, 'annee', '1949'), 'juste');
  attendre('le titre est accepté comme œuvre', verdictChamp(orwell, 'oeuvre', '1984'), 'juste');
}

const montesquieu = trouver(c => c.type === 'citation' && c.contenu.source &&
                                 /Montesquieu/.test(c.contenu.source.brut || ''),
                            'citation de Montesquieu');
if (montesquieu) {
  attendre('fragment interne (« esqui »)', verdictChamp(montesquieu, 'nom', 'esqui'), 'rate');
  attendre('nom entier', verdictChamp(montesquieu, 'nom', 'Montesquieu'), 'juste');
  attendre('faute de frappe (« Montesquieux »)',
           verdictChamp(montesquieu, 'nom', 'Montesquieux'), 'juste');
}

/* Le champ « date exacte » n'existe que sur une date qui porte un argument :
   sans lui, la fiche est retournée et c'est l'événement qu'on écrit. On teste
   donc le juge de date sur une carte fabriquée ici, pour que la vérification
   ne dépende pas de l'état du document. */
function dateAvecArgument(cle, valeur) {
  return { id: 'essai', type: 'date', theme: 'Essai', tags: [],
           attribuee: false, volatile: false, priorite: false,
           contenu: { question: 'En quelle année : ' + valeur + ' ?', reponse: cle,
                      cle: cle, valeur: valeur, preuve: 'Un argument de contrôle.',
                      annee: null } };
}
const bastille = dateAvecArgument('14 juillet 1789', 'Prise de la Bastille');
if (bastille) {
  attendre('la fiche d’une date à argument a deux champs', V.fiche(bastille).champs.length, 2);
  attendre('date complète', verdictChamp(bastille, 'date', '14 juillet 1789'), 'juste');
  attendre('date en chiffres', verdictChamp(bastille, 'date', '14/07/1789'), 'juste');
  attendre('année seule, jour et mois oubliés', verdictChamp(bastille, 'date', '1789'), 'presque');
  attendre('bon jour, mauvaise année', verdictChamp(bastille, 'date', '14 juillet 1889'), 'rate');
}

/* La fiche retournée : date donnée, événement à écrire. */
const sansArgument = trouver(c => c.type === 'date' && !c.contenu.preuve, 'date sans argument');
if (sansArgument) {
  const f = V.fiche(sansArgument);
  attendre('fiche retournée : l’énoncé est la date', f.enonce, sansArgument.contenu.cle);
  attendre('fiche retournée : un champ rédigé', f.champs[0].controle, 'mots');
  attendre('événement recopié',
           verdictChamp(sansArgument, 'evenement', sansArgument.contenu.valeur), 'juste');
  attendre('événement hors sujet',
           verdictChamp(sansArgument, 'evenement', 'je ne sais pas du tout'), 'rate');
}

/* La colonne « Ce que ça prouve » : l'argument que la date sert dans une copie.
   Elle ne vient que des lignes du document qui la portent — tant que le
   document n'en a pas, il n'y a rien à vérifier, et on le dit. */
const avecPreuve = cartes.filter(c => c.type === 'date' && c.contenu.preuve);
console.log('   ' + avecPreuve.length + ' date(s) sur ' +
            cartes.filter(c => c.type === 'date').length + ' portent un argument « ce que ça prouve »');
if (avecPreuve.length) {
  const d = avecPreuve[0];
  const cles = V.motsCles(d.contenu.preuve);
  attendre('argument recopié', verdictChamp(d, 'preuve', d.contenu.preuve), 'juste');
  attendre('argument hors sujet', verdictChamp(d, 'preuve', 'je ne sais pas du tout'), 'rate');
  attendre('une date à argument a deux champs', V.fiche(d).champs.length, 2);
  console.log('        (« ' + d.contenu.valeur.slice(0, 50) + '… » : ' +
              cles.map(k => k.mot).join(', ') + ')');
}

const tocqueville = trouver(c => c.contenu.source && /Tocqueville/.test(c.contenu.source.brut || ''),
                            'Tocqueville');
if (tocqueville) {
  attendre('première année d’un intervalle', verdictChamp(tocqueville, 'annee', '1835'), 'juste');
  attendre('seconde année d’un intervalle', verdictChamp(tocqueville, 'annee', '1840'), 'juste');
}

const deuxDates = dateAvecArgument('1811-1816', 'Révolte des luddites');
if (deuxDates) {
  const texte = deuxDates.contenu.cle;
  const premiere = String(V.anneesDe(texte)[0]);
  attendre('les deux années (' + texte + ')', verdictChamp(deuxDates, 'date', texte), 'juste');
  attendre('une seule des deux (' + premiere + ')', verdictChamp(deuxDates, 'date', premiere), 'presque');
}

const notion = trouver(c => c.type === 'notion' && V.motsCles(c.contenu.valeur).length >= 5,
                       'notion à quatre mots-clés');
if (notion) {
  const cles = V.motsCles(notion.contenu.valeur);
  const requis = V.requisDe(cles.length);
  attendre('définition recopiée', verdictChamp(notion, 'definition', notion.contenu.valeur), 'juste');
  attendre('les ' + requis + ' mots-clés requis seuls',
           verdictChamp(notion, 'definition', cles.slice(0, requis).map(k => k.mot).join(' ')), 'juste');
  attendre('un mot-clé de moins',
           verdictChamp(notion, 'definition', cles.slice(0, requis - 1).map(k => k.mot).join(' ')), 'presque');
  attendre('hors sujet complet', verdictChamp(notion, 'definition', 'je ne sais pas du tout'), 'rate');
  console.log('        (« ' + notion.contenu.cle + ' » : ' +
              cles.map(k => k.mot).join(', ') + ' — ' + requis + ' sur ' + cles.length + ' exigés)');
}

/* ------------------------------------------- l'invariant de l'échelle
   Une fiche doit demander PLUS que l'étage d'en dessous. La boîte 2 donne
   l'énoncé de la carte et réclame sa réponse ; une fiche qui se réduit à ce
   même échange ne prouve rien, et la carte monterait jusqu'à « acquise »
   sans que rien de neuf ait été écrit.

   Cette vérification manquait, et c'est ce qui a laissé passer une version où
   les cent vingt-sept dates se validaient sur la question de la boîte 2. */
console.log('\n5. Une fiche demande plus que la boîte 2');
const creuses = cartes.filter(c => {
  /* Un chiffre porte un seul fait : la valeur. Il n'y a rien d'autre à
     demander, et inventer un second champ reviendrait à poser une question
     dont la réponse est déjà écrite dans l'énoncé. Pour lui, ce qui change en
     haut de l'échelle est l'intervalle — vingt jours au lieu de deux — pas la
     question. C'est assumé, pas oublié. */
  if (c.type === 'chiffre') return false;
  const f = V.fiche(c);
  if (f.champs.length >= 2) return false;
  if (f.champs[0] && f.champs[0].controle === 'mots') return false;  /* rédaction */
  /* un seul champ, jugé à l'identique : la fiche rejoue-t-elle l'énoncé ? */
  return V.normaliser(f.enonce) === V.normaliser(c.contenu.question) ||
         V.normaliser(f.enonce) === V.normaliser(c.contenu.valeur || '');
});
if (creuses.length) {
  echec(creuses.length + ' fiche(s) ne demandent rien de plus que la boîte 2');
  creuses.slice(0, 6).forEach(c => console.log('          [' + c.type + '] ' + c.contenu.question));
} else {
  console.log('   aucune, hors les ' + cartes.filter(c => c.type === 'chiffre').length +
              ' chiffres, qui n’ont qu’un fait à savoir (exemption documentée)');
}

/* ------------------------------------------------------- les paliers */
console.log('\n6. Paliers par catégorie');
V.CATEGORIES.forEach(cat => {
  const total = cartes.filter(c => c.type === cat.type).length;
  const seuils = V.PALIERS.map(p => Math.ceil(p.part * total)).join(' · ');
  console.log('   ' + cat.nom.padEnd(21) + total.toString().padStart(4) + ' cartes · seuils ' + seuils);
});
const p0 = V.palier(0, 100), p50 = V.palier(50, 100), p100 = V.palier(100, 100);
attendre('palier à 0 %', p0.nom, V.PALIERS[0].nom);
attendre('palier à 50 %', p50.nom, 'Solide');
attendre('palier à 100 %', p100.nom, V.PALIERS[V.PALIERS.length - 1].nom);
attendre('rien après le dernier palier', String(p100.suivant), 'null');
attendre('il manque quelque chose au premier', p0.suivant.manque > 0, true);

/* ---------------------------------------------------------------- bilan */
console.log('');
if (echecs) {
  console.log(echecs + ' échec(s). Rien n’est bon à pousser en l’état.');
  process.exit(1);
}
console.log('Tout passe : ' + cartes.length + ' cartes validables, notation vérifiée.');
