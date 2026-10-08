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
/* Les sous-parties « Les dates à placer en dissertation » sont le socle : ce
   sont les dates que l'utilisateur a lui-même retenues comme devant être
   sues. Tout ce qui s'y trouve est prioritaire, sans avoir à mettre chaque
   ligne en gras dans le document. */
const RE_SECTION_SOCLE = /dates? a placer en dissertation/i;
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

/* ------------------------------------------- l'auteur, l'œuvre et l'année
   Le document écrit ses sources d'une seule façon : « Nom, Œuvre (année) »,
   l'œuvre et l'année étant facultatives. On en tire trois champs séparés,
   parce que la fiche de validation demande l'auteur ET l'année ET l'œuvre,
   et qu'on ne peut pas demander un champ qu'on n'a pas isolé.

   La règle d'or du script vaut ici aussi : rien n'est deviné. Un segment qui
   ne ressemble pas à ce qu'il devrait être reste vide, et la fiche ne le
   demande alors pas. Une fiche courte vaut mieux qu'une fiche fausse. */
const RE_PREFIXE_ATTRIBUEE = /^(?:(?:phrase|formule|citation)\s+)?attribu[ée]e?\s+à\s+/i;
/* Mots qui trahissent une parenthèse de commentaire plutôt que de datation :
   « (version populaire d'une phrase de 1755) » parle d'une autre phrase que
   celle de la carte — son année n'est pas celle de la citation. */
const RE_GLOSE = /\b(?:version|variante|variantes|r[ée]sum[ée]|reprise|reprises|formule|loi|phrase|d'une|sans source)\b/i;

function anneesDe(texte) {
  const vues = [];
  String(texte || '').replace(/\b(1[2-9]\d{2}|20\d{2})\b/g, function (m, a) {
    const n = parseInt(a, 10);
    if (vues.indexOf(n) < 0) vues.push(n);
    return m;
  });
  return vues;
}

/* Un nom d'auteur : court, sans ponctuation de phrase, et capitalisé. */
function nomPlausible(s) {
  if (!s || s.length < 3 || s.length > 40) return false;
  if (/[:;«»]/.test(s)) return false;
  if (s.split(/\s+/).length > 5) return false;
  return /^[A-ZÀ-ÖØ-Þ]/.test(s);
}
/* Un titre d'œuvre porte une majuscule dans le document ; un segment qui
   commence en minuscule est un contexte (« discours d'investiture », « appel
   du 18 juin 1940 »), pas un titre. On ne le demandera donc pas. */
function oeuvrePlausible(s) {
  if (!s || s.length < 2 || s.length > 70) return false;
  if (/[:;]/.test(s)) return false;
  if (/^\d{4}$/.test(s)) return true;              /* « 1984 », d'Orwell */
  return /^[A-ZÀ-ÖØ-Þ]/.test(s);
}

function analyserSource(brut, auteurCourt) {
  const t = String(brut || '').trim();
  const src = { brut: t, nom: null, oeuvre: null, annee: null, annees: [], periode: null };
  if (!t) return src;

  /* Les années se prennent hors parenthèses, et dans les parenthèses qui
     datent au lieu de commenter. */
  let horsPar = t, periode = null;
  t.replace(/\(([^)]{1,60})\)/g, function (tout, dedans) {
    horsPar = horsPar.replace(tout, ' ');
    const a = anneesDe(dedans);
    if (a.length && !RE_GLOSE.test(dedans)) src.annees = src.annees.concat(a);
    else if (!a.length && !periode && dedans.length <= 40 && !RE_GLOSE.test(dedans)) periode = dedans.trim();
    return tout;
  });
  src.periode = periode;
  anneesDe(horsPar).forEach(function (a) { if (src.annees.indexOf(a) < 0) src.annees.push(a); });
  src.annees.sort(function (x, y) { return x - y; });
  src.annee = src.annees.length ? src.annees[0] : null;

  /* le nom : tout ce qui précède la première virgule ou parenthèse */
  let tete = t.replace(RE_PREFIXE_ATTRIBUEE, '');
  const coupe = tete.search(/[,(]/);
  if (coupe >= 0) tete = tete.slice(0, coupe);
  tete = tete.replace(/[.\s]+$/, '').trim();
  if (auteurCourt) src.nom = auteurCourt;          /* déjà isolé par la ligne */
  else if (nomPlausible(tete)) src.nom = tete;

  /* l'œuvre : entre la première virgule et la parenthèse ou la fin */
  const vir = t.indexOf(',');
  if (vir >= 0) {
    let reste = t.slice(vir + 1);
    const p = reste.indexOf('(');
    if (p >= 0) reste = reste.slice(0, p);
    reste = reste.replace(/[.,;]\s*$/, '').trim();
    if (oeuvrePlausible(reste)) src.oeuvre = reste;
  }

  /* « George Orwell, 1984 (1949) » : le titre est un nombre à quatre chiffres,
     et il s'était glissé parmi les années acceptées. Accepter 1984 comme date
     de la citation, c'est valider une réponse fausse. */
  if (src.oeuvre && /^\d{4}$/.test(src.oeuvre)) {
    const titre = parseInt(src.oeuvre, 10);
    src.annees = src.annees.filter(function (a) { return a !== titre; });
    src.annee = src.annees.length ? src.annees[0] : null;
  }

  /* L'année telle qu'on l'écrit dans une copie : « 1748 », « 1835-1840 ». */
  src.anneeTexte = src.annees.length === 0 ? null
    : src.annees.length === 2 ? src.annees.join('-')
    : src.annees.join(' / ');
  return src;
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
  prioriteCourante = !!cellules.gras || RE_SECTION_SOCLE.test(sansAccents(section));
  if (cellules.length !== entete.length) {
    douter(cellules.join(' | '), 'Rang dont le nombre de colonnes ne suit pas l’en-tête :');
    return;
  }
  if (cellules.every(c => !c)) return;

  const col = {};
  entete.forEach((nom, k) => { col[normaliser(nom)] = cellules[k]; });
  const iTags = entete.findIndex(n => /^à placer dans$/i.test(n.trim()));
  const tags = iTags >= 0 ? tagsDe(cellules[iTags]) : [];
  /* Colonne facultative : l'argument que la date sert dans une copie. C'est
     elle qui transforme une date qu'on récite en une date qu'on place. */
  const iPreuve = entete.findIndex(n => /ce que ca prouve/.test(normaliser(n)));
  const preuve = iPreuve >= 0 ? cellules[iPreuve] : null;

  const e0 = normaliser(entete[0]);
  const a = cellules[0], b = cellules[1], c = cellules[2];

  /* Citation | Auteur et source | À placer dans */
  if (e0 === 'citation') return carteCitation(a, b, tags);

  /* Date | Événement | À placer dans */
  if (e0 === 'date' && /evenement/.test(normaliser(entete[1]))) return carteDate(a, b, tags, preuve);

  /* Penseur | Idée clé... | À placer dans */
  if (e0 === 'penseur') return cartePenseur(a, b, tags);

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

function carteDate(date, evenement, tags, preuve) {
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
      /* Ce que la date prouve : l'argument, pas le fait. La fiche de
         validation le demande par écrit — savoir la date sans savoir ce
         qu'elle démontre ne sert à rien dans une copie. */
      preuve: preuve || null,
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
      /* les trois champs que la fiche de validation demandera séparément */
      source: analyserSource(source, auteur),
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

/* Les penseurs : « Montesquieu, De l'esprit des lois (1748) | idée clé ».
   C'était une notion comme une autre ; c'est devenu un type à part, parce que
   dans une copie un penseur se cite avec son œuvre et sa date, et que c'est
   exactement ce que la fiche de validation réclame.

   L'identifiant garde la graine « notion » : le type change, pas la carte, et
   la progression déjà acquise sur ces dix-sept cartes survit au changement. */
function cartePenseur(penseur, idee, tags) {
  if (!penseur || !idee) { douter(penseur + ' | ' + idee, 'Penseur sans nom ou sans idée :'); return; }
  const src = analyserSource(penseur, null);
  /* La question ne nomme que l'auteur : afficher « Montesquieu, De l'esprit
     des lois (1748) » donnerait l'œuvre et l'année que la fiche demande. */
  const appel = src.nom || penseur;
  pousser({
    id: identifiant('notion', penseur, idee),
    type: 'penseur', theme, section,
    contenu: {
      question: 'Quelle est l’idée clé de ' + appel + ' ?',
      reponse: idee,
      cle: penseur,
      valeur: idee,
      source: src,
      /* l'autre sens, celui d'une copie : on a l'idée, il faut le nom */
      inverse: src.nom
        ? { question: 'Quel penseur défend cette idée : ' + idee, reponse: src.nom }
        : null,
      annee: src.annee
    },
    tags, attribuee: RE_ATTRIBUEE.test(idee), volatile: false, priorite: prioriteCourante
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

/* ------------------------------------------- l'audit des sources découpées
   La fiche de validation demande l'auteur, l'œuvre et l'année ; elle ne peut
   demander que ce qui a été isolé. Ce tableau est là pour être relu à l'œil :
   une ligne où le nom ou l'œuvre est faux se corrige dans culture-sog.md,
   pas dans le code. « — » signifie « non isolé, donc non demandé ». */
if (process.argv.indexOf('--sources') >= 0) {
  console.log('\nSources découpées (auteur · œuvre · année)\n');
  cartes.filter(c => c.contenu.source).forEach((c, k) => {
    const s = c.contenu.source;
    console.log(' ' + String(k + 1).padStart(3) + '. ' + s.brut);
    console.log('      nom    : ' + (s.nom || '—'));
    console.log('      œuvre  : ' + (s.oeuvre || '—'));
    console.log('      année  : ' + (s.annees.length ? s.annees.join(' / ') : '—') +
                (s.periode ? '   (période : ' + s.periode + ')' : ''));
  });
}
const avecSource = cartes.filter(c => c.contenu.source);
const sansNom = avecSource.filter(c => !c.contenu.source.nom);
console.log('\n' + avecSource.length + ' cartes à source (citations et penseurs) : ' +
            avecSource.filter(c => c.contenu.source.nom).length + ' avec auteur isolé, ' +
            avecSource.filter(c => c.contenu.source.oeuvre).length + ' avec œuvre, ' +
            avecSource.filter(c => c.contenu.source.annee).length + ' avec année.');
if (sansNom.length) {
  console.log('Sans auteur isolé (la fiche demandera la source entière) :');
  sansNom.forEach(c => console.log('   ' + c.contenu.source.brut));
}
console.log('Relis le découpage avec : node scripts/build-sog-data.js --sources');

console.log(doutes.length
  ? doutes.length + ' ligne(s) à vérifier : voir sog-a-verifier.txt'
  : 'Aucune ligne douteuse.');
