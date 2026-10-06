/* =============================================================================
   build-sog-data.js — fabrique les cartes du module Culture SOG.

       node scripts/build-sog-data.js

   Lit culture-sog.md et écrit training/tz-sog-data.js. Rien d'autre n'est
   touché : ni le jeu, ni les épreuves cognitives, ni la progression, qui vit
   dans le localStorage du navigateur.

   Règle d'or : aucune invention. Tout ce qui finit dans une carte est copié
   du document. Quand une ligne ne se laisse pas lire, le script ne devine
   pas : il l'inscrit dans sog-a-verifier.txt et passe à la suivante.

   L'identifiant d'une carte est un condensé de son contenu SOURCE (les
   cellules du tableau), jamais de la question fabriquée. On peut donc
   reformuler une question sans que la progression soit perdue.
   ============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RACINE = path.join(__dirname, '..');
const SOURCE = path.join(RACINE, 'culture-sog.md');
const SORTIE = path.join(RACINE, 'training', 'tz-sog-data.js');
const DOUTES = path.join(RACINE, 'sog-a-verifier.txt');

/* ------------------------------------------------------------------ thèmes
   Les titres de niveau 2 du document, ramenés aux douze thèmes du module. */
const THEMES = [
  [/grandes dates de l.histoire de France/i, 'Histoire de France'],
  [/République et ses institutions/i,        'République et institutions'],
  [/Gendarmerie, sécurité, justice/i,        'Gendarmerie, sécurité, justice, défense'],
  [/Libertés, démocratie et philosophie/i,   'Libertés et philosophie politique'],
  [/Numérique, IA et médias/i,               'Numérique, IA, médias'],
  [/Écologie, climat et énergie/i,           'Écologie, climat, énergie'],
  [/Économie, travail et protection/i,       'Économie, travail, protection sociale'],
  [/^Société/i,                              'Société'],
  [/Europe et géopolitique/i,                'Europe et géopolitique'],
  [/Sciences, culture et sport/i,            'Sciences, culture, sport'],
  [/chiffres clés de la France/i,            'Chiffres clés'],
  [/citations passe-partout/i,               'Citations passe-partout']
];

/* Les parties qui ne produisent pas de cartes mais nourrissent la page Méthode. */
const HORS_CARTES = [/^Mode d.emploi/i, /^Le réflexe final/i];

const doutes = [];
function douter(ligne, raison) {
  doutes.push(raison + '\n    ' + ligne.trim());
}

/* ------------------------------------------------------------------ outils */
function sansAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function normaliser(s) {
  return sansAccents(String(s || '').toLowerCase())
    .replace(/[«»"'’“”.,;:!?()\[\]…—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function identifiant(type, ...morceaux) {
  const graine = type + '|' + morceaux.map(normaliser).join('|');
  return crypto.createHash('sha1').update(graine, 'utf8').digest('hex').slice(0, 10);
}
/* Enlève les guillemets français qui encadrent une citation entière. */
function deguillemeter(s) {
  const t = s.trim();
  const m = t.match(/^«\s*([\s\S]*?)\s*»\s*$/);
  return m ? m[1].trim() : t;
}
function tagsDe(cellule) {
  return String(cellule || '')
    .split(/[;,]/)
    .map(t => t.trim())
    .filter(t => t.length > 1);
}
/* Première année à quatre chiffres : sert à la frise. */
function anneeDe(texte) {
  const m = String(texte).match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}
const RE_ATTRIBUEE = /attribu[ée]e?\b/i;

/* Le document dit : « Les dates en gras sont à connaître absolument ». On
   marque donc prioritaire toute ligne écrite en gras, ou qui porte une mention
   explicite. Le drapeau est posé en lisant la ligne, puis consommé par la
   carte qu'elle produit. */
const RE_GRAS = /\*\*[^*]+\*\*|__[^_]+__/;
const RE_INCONTOURNABLE = /\b(?:a connaitre absolument|a savoir absolument|incontournable)\b/i;
let prioriteCourante = false;

function demarquer(cellule) {
  const t = String(cellule || '');
  if (RE_GRAS.test(t) || RE_INCONTOURNABLE.test(sansAccents(t))) prioriteCourante = true;
  return t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/__([^_]+)__/g, '$1').trim();
}
function auteurAttribue(cellule) {
  const m = cellule.match(/attribu[ée]e?\s+à\s+([^(,.;:]+)/i);
  return m ? m[1].trim() : null;
}

/* Un trou dans une phrase : on retire le mot le plus long, qui est aussi le
   plus porteur de sens. Le mot vient de la phrase, rien n'est inventé. */
function creuser(phrase) {
  const mots = phrase.match(/[\p{L}’'-]+/gu) || [];
  let choisi = null;
  for (const mot of mots) {
    const nu = mot.replace(/^['’-]+|['’-]+$/g, '');
    if (nu.length < 5) continue;
    if (!choisi || nu.length >= choisi.length) choisi = nu;
  }
  if (!choisi) return null;
  const re = new RegExp('(^|[^\\p{L}])(' + choisi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![\\p{L}])', 'u');
  if (!re.test(phrase)) return null;
  return { texte: phrase.replace(re, (t, avant) => avant + '______'), manquant: choisi };
}

/* ------------------------------------------------- lecture du document brut */
if (!fs.existsSync(SOURCE)) {
  console.error('Document introuvable : ' + SOURCE);
  console.error('Place culture-sog.md à la racine du projet, puis relance.');
  process.exit(1);
}
const lignes = fs.readFileSync(SOURCE, 'utf8').split(/\r?\n/);

const cartes = [];
const methode = { regles: [], orCitations: [], reflexe: [] };

let theme = null;        /* thème courant, ou null hors cartes */
let titreH2 = '';
let section = '';
let sousTitre = '';      /* le dernier ### rencontré, pour la Méthode */

function themeDe(titre) {
  for (const [re, nom] of THEMES) if (re.test(titre)) return nom;
  return null;
}
function horsCartes(titre) {
  return HORS_CARTES.some(re => re.test(titre));
}

/* ------------------------------------------------------- analyse des blocs */
let i = 0;
while (i < lignes.length) {
  const ligne = lignes[i];

  const h2 = ligne.match(/^##\s+(.*\S)\s*$/);
  if (h2) {
    titreH2 = h2[1];
    theme = themeDe(titreH2);
    section = titreH2;
    sousTitre = '';
    if (!theme && !horsCartes(titreH2) && !/^#/.test(titreH2)) {
      douter(titreH2, 'Titre de niveau 2 rattaché à aucun thème, ses lignes sont ignorées :');
    }
    i++; continue;
  }
  const h3 = ligne.match(/^###\s+(.*\S)\s*$/);
  if (h3) { sousTitre = h3[1]; section = h3[1]; i++; continue; }

  /* ---------------------------------------------------- page Méthode */
  if (horsCartes(titreH2)) {
    const puce = ligne.match(/^\s*(?:[-*]|\d+\.)\s+(.*\S)\s*$/);
    if (puce) {
      if (/4 règles/i.test(sousTitre)) methode.regles.push(puce[1]);
      else if (/règles d.or/i.test(sousTitre)) methode.orCitations.push(puce[1]);
    }
    if (/^Le réflexe final/i.test(titreH2) && ligne.trim() && !/^#/.test(ligne)) {
      methode.reflexe.push(ligne.trim());
    }
    i++; continue;
  }

  if (!theme) { i++; continue; }

  /* ------------------------------------------------------- un tableau */
  if (/^\s*\|/.test(ligne) && /^\s*\|[\s:|-]+\|\s*$/.test(lignes[i + 1] || '')) {
    const entete = decouper(ligne, true);
    i += 2;
    const rangs = [];
    while (i < lignes.length && /^\s*\|/.test(lignes[i])) { rangs.push(decouper(lignes[i])); i++; }
    rangs.forEach(r => traiterRang(entete, r));
    continue;
  }

  /* --------------------------------------------------------- une puce */
  const puce = ligne.match(/^\s*[-*]\s+(.*\S)\s*$/);
  if (puce) { prioriteCourante = false; traiterPuce(demarquer(puce[1])); i++; continue; }

  i++;
}

function decouper(ligne, estEntete) {
  if (!estEntete) prioriteCourante = false;
  const cellules = ligne.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
    .map(c => estEntete ? c.trim() : demarquer(c));
  /* Les rangs sont tous découpés avant d'être traités : le drapeau doit
     voyager avec son rang, sinon seul le dernier compterait. */
  cellules.gras = prioriteCourante;
  return cellules;
}

/* ------------------------------------------------- un rang de tableau */
function traiterRang(entete, cellules) {
  prioriteCourante = !!cellules.gras;
  if (cellules.length !== entete.length) {
    douter(cellules.join(' | '), 'Rang dont le nombre de colonnes ne suit pas l’en-tête :');
    return;
  }
  if (cellules.every(c => !c)) return;

  const col = {};
  entete.forEach((nom, k) => { col[normaliser(nom)] = cellules[k]; });
  const iTags = entete.findIndex(n => /^à placer dans$/i.test(n.trim()));
  const tags = iTags >= 0 ? tagsDe(cellules[iTags]) : [];

  const e0 = normaliser(entete[0]);
  const a = cellules[0], b = cellules[1], c = cellules[2];

  /* Citation | Auteur et source | À placer dans */
  if (e0 === 'citation') return carteCitation(a, b, tags);

  /* Date | Événement | À placer dans */
  if (e0 === 'date' && /evenement/.test(normaliser(entete[1]))) return carteDate(a, b, tags);

  /* Penseur | Idée clé... | À placer dans */
  if (e0 === 'penseur') return carteNotion(a, b, tags, 'Idée clé de : ');

  /* Domaine | Chiffre (ordre de grandeur) | À placer dans */
  if (e0 === 'domaine' && /chiffre/.test(normaliser(entete[1]))) return carteChiffre(a, b, tags);

  /* Repère | Date ou notion | Date ou repère | Institution | Texte | Date  */
  if (['repere', 'date ou notion', 'date ou repere', 'institution', 'texte', 'date'].includes(e0)) {
    return carteRepere(a, b, c, entete, tags);
  }

  douter(cellules.join(' | '), 'Tableau dont l’en-tête n’est pas reconnu (' + entete.join(' / ') + ') :');
}

/* ----------------------------------------------------------- les cartes */
function pousser(carte) {
  if (cartes.some(x => x.id === carte.id)) return;   /* même source, une seule carte */
  cartes.push(carte);
}

function carteDate(date, evenement, tags) {
  if (!date || !evenement) { douter(date + ' | ' + evenement, 'Ligne de date incomplète :'); return; }
  pousser({
    id: identifiant('date', date, evenement),
    type: 'date', theme, section,
    contenu: {
      /* l'événement est recopié tel quel : le mettre en minuscule casserait
         « La Marseillaise », « Front populaire », etc. */
      question: 'En quelle année : ' + evenement + ' ?',
      reponse: date,
      cle: date,
      valeur: evenement,
      inverse: { question: 'Que s’est-il passé en ' + date + ' ?', reponse: evenement },
      annee: anneeDe(date)
    },
    tags, attribuee: false, volatile: false, priorite: prioriteCourante
  });
}

function carteCitation(citation, source, tags, contexte) {
  if (!citation || !source) { douter(citation + ' | ' + source, 'Citation sans auteur ou sans texte :'); return; }
  const texte = deguillemeter(citation);
  /* « La « banalite du mal » » : on n'ajoute pas de guillemets a un texte qui
     en porte deja, sinon la question devient illisible. */
  const cite = /[«»]/.test(texte) ? texte : '« ' + texte + ' »';
  /* le contexte est la puce entiere : la mention « attribuee » s'y trouve
     parfois apres la citation, hors des morceaux retenus. */
  const attribuee = RE_ATTRIBUEE.test(source) || RE_ATTRIBUEE.test(citation)
                 || RE_ATTRIBUEE.test(contexte || '');
  /* « attribuee a X » donne le nom directement ; sinon, une source qui tient
     en un nom sans ponctuation est ce nom (« Lavoisier », « Jean Monnet »). */
  let auteur = attribuee ? (auteurAttribue(source) || auteurAttribue(contexte || '')) : null;
  if (attribuee && !auteur && source.length <= 40 && !/[,;:(]/.test(source)) auteur = source.trim();
  if (attribuee && !auteur) {
    douter(source, 'Citation marquée « attribuée » dont l’auteur ne se laisse pas isoler :');
  }
  pousser({
    id: identifiant('citation', texte, source),
    type: 'citation', theme, section,
    contenu: {
      question: 'Qui a écrit ou dit : ' + cite + ' ?',
      reponse: source,
      citation: texte,
      auteur: source,
      auteurCourt: auteur,
      trou: creuser(texte)
    },
    tags, attribuee, volatile: false, priorite: prioriteCourante
  });
}

function carteNotion(terme, definition, tags, amorce) {
  if (!terme || !definition) { douter(terme + ' | ' + definition, 'Notion sans terme ou sans définition :'); return; }
  pousser({
    id: identifiant('notion', terme, definition),
    type: 'notion', theme, section,
    contenu: {
      question: (amorce || 'Qu’est-ce que : ') + terme + ' ?',
      reponse: definition,
      cle: terme,
      valeur: definition
    },
    tags, attribuee: RE_ATTRIBUEE.test(definition), volatile: false, priorite: prioriteCourante
  });
}

function carteChiffre(domaine, chiffre, tags) {
  if (!domaine || !chiffre) { douter(domaine + ' | ' + chiffre, 'Chiffre incomplet :'); return; }
  pousser({
    id: identifiant('chiffre', domaine, chiffre),
    type: 'chiffre', theme, section,
    contenu: {
      question: domaine + ' : quel ordre de grandeur ?',
      reponse: chiffre,
      cle: domaine,
      valeur: chiffre
    },
    tags, attribuee: false, volatile: true, priorite: prioriteCourante
  });
}

function carteRepere(a, b, c, entete, tags) {
  const detail = [b, c].filter((x, k) => x && !/^à placer dans$/i.test(entete[k + 1] || '')).join(' — ');
  if (!a || !detail) { douter([a, b, c].join(' | '), 'Repère incomplet :'); return; }
  const annee = anneeDe(a);
  pousser({
    id: identifiant('repere', a, detail),
    type: 'repere', theme, section,
    contenu: {
      question: annee ? 'Que faut-il retenir de ' + a + ' ?' : 'Que faut-il savoir sur ' + a + ' ?',
      reponse: detail,
      cle: a,
      valeur: detail,
      annee
    },
    tags, attribuee: RE_ATTRIBUEE.test(detail), volatile: false, priorite: prioriteCourante
  });
}

/* ------------------------------------------------------------ les puces */
function traiterPuce(texte) {
  const estCitations = /citation/i.test(sousTitre);
  const estChiffres = /chiffre/i.test(sousTitre);

  /* « 1885 : Pasteur réussit… » → une date */
  const date = texte.match(/^((?:\d{1,2}\s+\w+\s+)?\d{4}(?:\s*[-–/]\s*\d{4})?)\s*:\s*(.+)$/);
  if (date) { carteDate(date[1].trim(), date[2].trim(), []); return; }

  const deuxTemps = texte.match(/^([^:]{2,70}?)\s*:\s*(.+)$/);

  if (estCitations) {
    const guillemets = texte.match(/«\s*([\s\S]+?)\s*»/);
    if (guillemets && deuxTemps) { carteCitation(guillemets[1], deuxTemps[1].trim(), [], texte); return; }
    if (guillemets) {
      const apres = texte.slice(texte.indexOf('»') + 1).replace(/^[\s.,]*/, '');
      if (apres) { carteCitation(guillemets[1], apres.replace(/\.$/, ''), [], texte); return; }
      douter(texte, 'Citation en puce sans source identifiable :'); return;
    }
    if (deuxTemps) { carteNotion(deuxTemps[1].trim(), deuxTemps[2].trim(), []); return; }
    douter(texte, 'Puce de la section « citations » sans citation ni définition :'); return;
  }

  if (estChiffres) {
    const trou = creuserChiffre(texte);
    if (!trou) { douter(texte, 'Puce de chiffres sans valeur repérable :'); return; }
    pousser({
      id: identifiant('chiffre', texte),
      type: 'chiffre', theme, section,
      contenu: { question: trou.texte, reponse: trou.manquant, cle: trou.texte, valeur: trou.manquant },
      tags: [], attribuee: false, volatile: true, priorite: prioriteCourante
    });
    return;
  }

  if (deuxTemps) { carteNotion(deuxTemps[1].trim(), deuxTemps[2].trim(), []); return; }
  douter(texte, 'Puce qui n’est ni « terme : définition » ni datée :');
}

/* Dans une phrase de chiffres, on masque la valeur elle-même. */
function creuserChiffre(phrase) {
  const re = /(?:environ|près de|plus de|autour de)?\s*\d[\d   ,.]*\s*(?:%|°C|millions?|milliards?|milliers?|réacteurs?|ans?|tiers)?/i;
  const m = phrase.match(/\b(?:les deux tiers|un tiers|la moitié)\b/i) || phrase.match(re);
  if (!m || !String(m[0]).trim()) return null;
  const valeur = String(m[0]).trim();
  if (!/\d|tiers|moitié/i.test(valeur)) return null;
  return { texte: phrase.replace(valeur, '______'), manquant: valeur };
}

/* ---------------------------------------------------------------- écriture */
const parType = {}, parTheme = {};
cartes.forEach(c => {
  parType[c.type] = (parType[c.type] || 0) + 1;
  parTheme[c.theme] = (parTheme[c.theme] || 0) + 1;
});

const entete = `/* =============================================================================
   tz-sog-data.js — GÉNÉRÉ, NE PAS ÉDITER À LA MAIN.

   Produit par scripts/build-sog-data.js à partir de culture-sog.md.
   Pour mettre à jour : modifie le document, puis relance

       node scripts/build-sog-data.js

   Les identifiants sont des condensés du contenu source : régénérer ne fait
   pas perdre la progression, qui vit dans localStorage sous « training_sog_ ».
   ============================================================================= */
`;

fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
fs.writeFileSync(SORTIE,
  entete + 'window.TZ_SOG_DATA = ' + JSON.stringify({
    source: 'culture-sog.md',
    genere: new Date().toISOString().slice(0, 10),
    methode,
    cartes
  }, null, 1) + ';\n', 'utf8');

fs.writeFileSync(DOUTES,
  doutes.length
    ? 'Lignes que le script n’a pas su lire sans deviner.\n' +
      'Corrige-les dans culture-sog.md puis relance l’extraction.\n\n' +
      doutes.map((d, k) => (k + 1) + '. ' + d).join('\n\n') + '\n'
    : 'Aucune ligne douteuse : tout le document a été lu sans deviner.\n', 'utf8');

/* ------------------------------------------------------------- le rapport */
console.log('\n' + cartes.length + ' cartes écrites dans training/tz-sog-data.js\n');
console.log('Par type');
Object.keys(parType).sort().forEach(t => console.log('   ' + t.padEnd(10) + parType[t]));
console.log('\nPar thème');
Object.keys(parTheme).sort().forEach(t => console.log('   ' + t.padEnd(42) + parTheme[t]));

const extras = [];
if (cartes.some(c => c.attribuee)) extras.push(cartes.filter(c => c.attribuee).length + ' citations « attribuée »');
if (cartes.some(c => c.volatile)) extras.push(cartes.filter(c => c.volatile).length + ' chiffres volatils');
if (cartes.some(c => c.priorite)) extras.push(cartes.filter(c => c.priorite).length + ' marquées prioritaires');
if (extras.length) console.log('\nDont ' + extras.join(', ') + '.');

console.log('\n10 cartes au hasard, à vérifier\n');
const melange = cartes.slice();
for (let k = melange.length - 1; k > 0; k--) {
  const j = Math.floor(Math.random() * (k + 1));
  [melange[k], melange[j]] = [melange[j], melange[k]];
}
melange.slice(0, 10).forEach((c, k) => {
  console.log(' ' + (k + 1) + '. [' + c.type + '] ' + c.theme);
  console.log('    Q : ' + c.contenu.question);
  console.log('    R : ' + c.contenu.reponse);
  if (c.tags.length) console.log('    À placer dans : ' + c.tags.join(', '));
  console.log('');
});

console.log(doutes.length
  ? doutes.length + ' ligne(s) à vérifier : voir sog-a-verifier.txt'
  : 'Aucune ligne douteuse.');
