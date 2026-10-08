/* =============================================================================
   tz-sog-valider.js — la validation écrite du module Culture SOG.

   Pourquoi ce fichier existe
   --------------------------
   Jusqu'ici, le haut de l'échelle de révision se jouait en auto-évaluation :
   on révélait la réponse et on se notait soi-même « je savais ». C'est
   confortable et c'est faux. Une référence n'est utilisable dans une copie que
   si on sait l'écrire : le texte, l'auteur, l'œuvre et l'année.

   Ce module fabrique donc, pour chaque carte, une FICHE DE VALIDATION : deux à
   quatre champs à remplir de mémoire, et une notation champ par champ. Il ne
   touche ni au DOM ni au localStorage : il reçoit une carte, il rend une fiche
   et un verdict. C'est ce qui le rend vérifiable hors du navigateur, par
   scripts/verifier-sog-valider.js.

   Règle d'or, héritée du script d'extraction : on ne demande jamais un champ
   qu'on n'a pas dans les données. Une fiche courte vaut mieux qu'une fiche qui
   réclame une année que le document ne donne pas.

   tz-sog.js attend ce fichier et lui emprunte aussi ses outils de comparaison,
   pour que la saisie du milieu de l'échelle et la fiche du haut jugent avec la
   même indulgence sur les accents et les fautes de frappe.
   ============================================================================= */
(function (global) {
  'use strict';

  /* ========================================================== outils texte */
  function sansAccents(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function normaliser(s) {
    return sansAccents(String(s || '').toLowerCase())
      .replace(/[«»"'’“”.,;:!?()\[\]…—–\-]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  /* Distance de Levenshtein : une faute de frappe ne doit pas coûter une carte
     qu'on connaît. Au-delà de deux caractères, ce n'est plus une frappe. */
  function distance(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1,
                         d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }
  function reponseJuste(saisie, attendue) {
    var a = normaliser(saisie), b = normaliser(attendue);
    if (!a) return false;
    if (a === b) return true;
    /* Une réponse qui porte une année se juge sur l'année, et sur rien
       d'autre : tolérer un caractère d'écart ferait passer 1892 pour 1792. */
    var an = String(attendue).match(/\b(1[5-9]\d{2}|20\d{2})\b/);
    if (an) return new RegExp('(^|\\D)' + an[1] + '(\\D|$)').test(saisie);
    if (b.length <= 6) return false;
    if (b.length > 12 && a.indexOf(b) >= 0) return true;
    return distance(a, b) <= Math.max(1, Math.floor(b.length / 8));
  }

  function mots(texte) {
    return normaliser(texte).split(' ').filter(Boolean);
  }
  /* Racine grossière : de quoi faire tomber les pluriels et les accords sans
     prétendre analyser le français. « libertés » et « liberté » ont la même ;
     « nécessaire » et « nécessité » n'en partagent que les sept premières
     lettres, donc non — et c'est voulu : un mot-clé doit être le bon mot. */
  function racine(mot) {
    var m = normaliser(mot).replace(/s$/, '');
    return m.length > 7 ? m.slice(0, 7) : m;
  }

  /* Mots trop courants pour prouver quoi que ce soit. Liste volontairement
     courte : ce sont les mots de liaison du document, pas un dictionnaire. */
  var VIDES = ('dans pour avec sans sous cette celui celle ceux celles comme plus moins ' +
    'entre leur leurs elle elles etre avoir faire tout tous toute toutes mais donc alors ' +
    'quand parce selon depuis chaque autre autres ainsi aussi encore jamais toujours ' +
    'peut peuvent doit doivent sont etait etaient avait avaient fait faut tres deux trois ' +
    'notamment surtout exemple partie certains certaines quelque quelques plusieurs ' +
    'lorsque pendant apres avant meme memes quoi dont lequel laquelle afin').split(' ');

  /* Les mots-clés d'une définition : ce qu'une copie doit contenir pour qu'on
     puisse dire que la notion est sue. On garde les mots longs — porteurs de
     sens — et les années, puis on plafonne : une fiche qui réclame douze mots
     exacts n'est plus une fiche, c'est une dictée. */
  function motsCles(texte, plafond) {
    var vus = {}, gardes = [];
    mots(texte).forEach(function (m, rang) {
      if (!/^\d{4}$/.test(m) && (m.length < 5 || VIDES.indexOf(m) >= 0)) return;
      var r = racine(m);
      if (vus[r]) return;
      vus[r] = 1;
      gardes.push({ mot: m, racine: r, rang: rang, poids: /^\d{4}$/.test(m) ? 99 : m.length });
    });
    gardes.sort(function (a, b) { return b.poids - a.poids; });
    var choisis = gardes.slice(0, plafond || 8);
    choisis.sort(function (a, b) { return a.rang - b.rang; });
    return choisis;
  }
  /* Deux mots-clés sur trois, trois sur quatre, quatre sur six : assez pour
     prouver qu'on a la notion, assez peu pour laisser le droit de reformuler.
     Le document le dit lui-même : si tu n'es pas sûr des mots, reformule. */
  function requisDe(n) { return Math.max(1, Math.min(n, 5, Math.ceil(0.65 * n))); }

  /* =============================================================== les dates
     Un découpage jour / mois / année, pour pouvoir dire « l'année est bonne,
     il manque le jour » au lieu d'un « faux » sans explication. */
  var MOIS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet',
              'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

  function anneesDe(texte) {
    var vues = [];
    (String(texte || '').match(/\b(1[2-9]\d{2}|20\d{2})\b/g) || []).forEach(function (a) {
      var n = parseInt(a, 10);
      if (vues.indexOf(n) < 0) vues.push(n);
    });
    return vues;
  }

  function morceauxDate(texte) {
    var sa = sansAccents(String(texte || '')).toLowerCase();
    var out = { annees: anneesDe(sa), jour: null, mois: null };
    var num = sa.match(/\b(\d{1,2})\s*[\/.]\s*(\d{1,2})\s*[\/.]\s*\d{4}\b/);
    if (num) {
      out.jour = parseInt(num[1], 10);
      out.mois = parseInt(num[2], 10);
      return out;
    }
    for (var i = 0; i < MOIS.length; i++) {
      var m = sa.match(new RegExp('(?:\\b(\\d{1,2})\\s*(?:er)?\\s+)?\\b' + MOIS[i] + '\\b'));
      if (m) {
        out.mois = i + 1;
        if (m[1]) out.jour = parseInt(m[1], 10);
        return out;
      }
    }
    return out;
  }
  function nomDuMois(n) { return MOIS[n - 1] || ''; }

  /* ========================================================== les catégories
     Ce sont les six familles dans lesquelles la progression se compte. Elles
     suivent les types de cartes produits par l'extraction, et « ce qu'il faut
     écrire » dit, en une ligne, ce que valider veut dire dans cette famille. */
  var CATEGORIES = [
    { id: 'date', nom: 'Dates', court: 'Dates', type: 'date',
      ecrire: 'la date exacte, et le type de sujet où tu la places' },
    { id: 'citation', nom: 'Citations', court: 'Citations', type: 'citation',
      ecrire: 'le mot manquant, l’auteur, l’œuvre et l’année' },
    { id: 'penseur', nom: 'Auteurs et penseurs', court: 'Auteurs', type: 'penseur',
      ecrire: 'son idée clé, son œuvre et son année' },
    { id: 'notion', nom: 'Notions', court: 'Notions', type: 'notion',
      ecrire: 'la définition, avec ses mots-clés' },
    { id: 'repere', nom: 'Repères', court: 'Repères', type: 'repere',
      ecrire: 'ce qu’il faut en retenir' },
    { id: 'chiffre', nom: 'Chiffres', court: 'Chiffres', type: 'chiffre',
      ecrire: 'l’ordre de grandeur' }
  ];
  function categorieDe(carte) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].type === carte.type) return CATEGORIES[i];
    }
    return null;
  }

  /* ============================================================= les paliers
     Une progression par catégorie, en part du stock : on ne décrète pas qu'il
     faut « vingt dates », on dit où on en est dans les cent vingt-sept que le
     document contient. Le compte brut est toujours affiché à côté : un palier
     ne doit jamais cacher le chiffre qu'il résume. */
  var PALIERS = [
    { part: 0, nom: 'À commencer' },
    { part: 0.10, nom: 'Premiers repères' },
    { part: 0.25, nom: 'Bases posées' },
    { part: 0.50, nom: 'Solide' },
    { part: 0.75, nom: 'Avancé' },
    { part: 0.90, nom: 'Maîtrise' },
    { part: 1, nom: 'Catégorie complète' }
  ];
  function palier(valides, total) {
    if (!total) return { rang: 0, nom: PALIERS[0].nom, part: 0, suivant: null, haut: PALIERS.length - 1 };
    var rang = 0;
    for (var i = 0; i < PALIERS.length; i++) {
      if (valides >= Math.ceil(PALIERS[i].part * total)) rang = i;
    }
    var suivant = null;
    if (rang < PALIERS.length - 1) {
      var seuil = Math.ceil(PALIERS[rang + 1].part * total);
      suivant = { nom: PALIERS[rang + 1].nom, seuil: seuil, manque: Math.max(1, seuil - valides) };
    }
    return {
      rang: rang, nom: PALIERS[rang].nom, haut: PALIERS.length - 1,
      part: valides / total, suivant: suivant
    };
  }

  /* ========================================================= la fiche
     Un champ par chose à savoir écrire. L'ordre suit celui d'une copie :
     le contenu d'abord, puis l'auteur, l'œuvre et l'année. */
  function champ(cle, label, controle, attendu, options) {
    var c = { cle: cle, label: label, controle: controle, attendu: attendu,
              aide: null, court: false };
    if (options) {
      if (options.aide) c.aide = options.aide;
      if (options.court) c.court = true;
    }
    return c;
  }

  function champNom(src, brut, label) {
    if (src && src.nom) {
      return champ('nom', label || 'L’auteur', 'nom',
                   { nom: src.nom, brut: brut }, { court: true });
    }
    /* Pas de nom isolé : on demande la source telle que le document l'écrit,
       et on la juge sur ses mots-clés plutôt que mot pour mot. */
    var cles = motsCles(brut, 3);
    return champ('nom', 'L’auteur ou la source', 'mots',
                 { texte: brut, cles: cles, requis: requisDe(cles.length) });
  }
  function champAnnee(src) {
    return champ('annee', 'L’année', 'annee',
                 { annees: src.annees.slice(), texte: src.anneeTexte }, { court: true });
  }
  function champOeuvre(src) {
    return champ('oeuvre', 'L’œuvre ou la source', 'texte',
                 { texte: src.oeuvre }, { court: true });
  }
  function champMots(cle, label, texte, plafond, aide) {
    var cles = motsCles(texte, plafond);
    return champ(cle, label, 'mots',
                 { texte: texte, cles: cles, requis: requisDe(cles.length) },
                 { aide: aide || null });
  }

  /* fiche(carte) → { enonce, support, consigne, champs, modele }
     « support » est ce qui reste affiché pendant qu'on écrit ; il ne contient
     jamais une réponse demandée. */
  function fiche(carte) {
    var c = carte.contenu, src = c.source || null;
    var f = { enonce: '', support: null, consigne: null, champs: [], modele: null };

    if (carte.type === 'citation') {
      f.enonce = 'Restitue cette référence au complet';
      if (c.trou) {
        f.support = '« ' + c.trou.texte + ' »';
        f.champs.push(champ('mot', 'Le mot manquant', 'texte',
                            { texte: c.trou.manquant }, { court: true }));
      } else {
        f.support = '« ' + c.citation + ' »';
      }
      f.champs.push(champNom(src, c.auteur));
      if (src && src.oeuvre) f.champs.push(champOeuvre(src));
      if (src && src.annees.length) f.champs.push(champAnnee(src));
      f.consigne = carte.attribuee
        ? 'Formule attribuée : c’est justement l’auteur qu’il faut savoir nommer avec prudence.'
        : null;

    } else if (carte.type === 'penseur') {
      f.enonce = (src && src.nom) ? src.nom : c.cle;
      f.consigne = 'Son idée clé, puis ce qui l’accompagne dans une copie.';
      f.champs.push(champMots('idee', 'Son idée clé', c.valeur));
      if (src && src.oeuvre) f.champs.push(champOeuvre(src));
      if (src && src.annees.length) f.champs.push(champAnnee(src));

    } else if (carte.type === 'date') {
      f.enonce = c.valeur;
      var cle = String(c.cle || '');
      if (anneesDe(cle).length) {
        var mor = morceauxDate(cle);
        f.champs.push(champ('date', 'La date exacte', 'date',
                            { texte: cle, morceaux: mor }, {
          court: true,
          aide: mor.jour ? 'Jour, mois et année.'
              : mor.annees.length > 1 ? 'Le document en donne deux.' : null
        }));
      } else {
        /* « Aujourd'hui », « Mai 1968 » sans année : rien à découper, on juge
           la réponse telle quelle. */
        f.champs.push(champ('date', 'La date', 'texte', { texte: cle }, { court: true }));
      }
      /* Savoir la date ne suffit pas : en copie, une date sans argument ne
         rapporte rien. Le second champ demande donc ce qu'elle DÉMONTRE,
         jugé sur les mots-clés de l'argument que porte le document. */
      if (c.preuve) {
        f.champs.push(champMots('preuve', 'Ce que cette date prouve', c.preuve, null,
                                'En une phrase, l’argument qu’elle sert.'));
      }

    } else if (carte.type === 'chiffre') {
      f.enonce = c.question;
      f.champs.push(champ('valeur', 'L’ordre de grandeur', 'texte',
                          { texte: c.valeur }, { court: true,
                            aide: 'À vérifier dans l’actu avant le concours.' }));

    } else {
      /* notion et repère : une définition, jugée sur ses mots-clés */
      f.enonce = c.cle;
      f.consigne = carte.type === 'notion'
        ? 'Définis-la comme tu l’écrirais dans une copie.'
        : 'Ce qu’il faut en retenir.';
      f.champs.push(champMots('definition',
        carte.type === 'notion' ? 'Ta définition' : 'Ce que tu en retiens',
        c.valeur));
    }

    f.modele = pourLaCopie(carte);
    return f;
  }

  /* Ce qu'on écrirait dans une copie. Assemblé à partir des champs du
     document et de ses propres tournures — « Cite l'auteur, l'œuvre et la
     date quand tu les connais : Montesquieu, dans De l'esprit des lois
     (1748)… », « selon une formule attribuée à… ». Aucun mot de contenu n'est
     ajouté : seulement la ponctuation et ces deux liaisons. */
  function pourLaCopie(carte) {
    var c = carte.contenu, s = c.source || null;
    var nom = (s && s.nom) ? s.nom : null;

    if (carte.type === 'citation') {
      if (carte.attribuee && nom) {
        return 'Selon une formule attribuée à ' + nom +
               ' : « ' + c.citation + ' »';
      }
      var tete = nom || c.auteur;
      if (s && s.oeuvre) tete += ', dans ' + s.oeuvre;
      if (s && s.anneeTexte) tete += ' (' + s.anneeTexte + ')';
      return tete + ' : « ' + c.citation + ' »';
    }
    if (carte.type === 'penseur') {
      var t = nom || c.cle;
      if (s && s.oeuvre) t += ', ' + s.oeuvre;
      if (s && s.anneeTexte) t += ' (' + s.anneeTexte + ')';
      return t + ' — ' + c.valeur;
    }
    if (carte.type === 'date') {
      var ligne = c.cle + ' — ' + c.valeur;
      if (c.preuve) ligne += (/[.!?]$/.test(ligne) ? ' ' : '. ') + c.preuve;
      return ligne;
    }
    if (carte.type === 'chiffre') return String(c.question).replace('______', c.valeur);
    return c.cle + ' — ' + c.valeur;
  }

  /* ============================================================ la notation
     Trois verdicts par champ, et un pour la fiche : « juste » fait monter la
     carte, « presque » la laisse où elle est, « raté » la renvoie en boîte 1.
     Chaque verdict vient avec sa raison, parce qu'une note sans explication
     n'apprend rien. */
  function verdictTexte(saisie, attendu) {
    if (reponseJuste(saisie, attendu.texte)) {
      return { verdict: 'juste', detail: null };
    }
    var a = normaliser(saisie), b = normaliser(attendu.texte);
    if (a && b.length > 6 && distance(a, b) <= Math.max(2, Math.floor(b.length / 5))) {
      return { verdict: 'presque', detail: 'Presque : écrit exactement, c’est « ' + attendu.texte + ' ».' };
    }
    return { verdict: 'rate', detail: null };
  }

  function verdictNom(saisie, attendu) {
    var a = normaliser(saisie), b = normaliser(attendu.nom);
    if (!a) return { verdict: 'rate', detail: null };
    if (a === b) return { verdict: 'juste', detail: null };
    /* Le nom de famille suffit : dans une copie on écrit « Weber », pas
       « Max Weber », et « de Gaulle » plutôt que « Général de Gaulle ».

       C'est bien le dernier mot qu'on cherche, et pas n'importe quel morceau
       du nom : accepter tout fragment contenu dans la réponse attendue ferait
       passer « esqui » pour Montesquieu. Le prénom seul ne suffit pas non
       plus — « Jean » ne désigne pas Monnet. */
    var motsNom = b.split(' ').filter(function (m) { return m.length >= 4; });
    var dernier = motsNom.length ? motsNom[motsNom.length - 1] : b;
    if (dernier.length >= 4 && a.indexOf(dernier) >= 0) {
      return { verdict: 'juste', detail: null };
    }
    /* une faute de frappe sur un nom long : juste, mais on redonne l'orthographe */
    if (b.length >= 8 && distance(a, b) <= 2) {
      return { verdict: 'juste', detail: 'Orthographe exacte : ' + attendu.nom + '.' };
    }
    /* Deux caractères d'écart sur le nom de famille : on le dit, sans valider.
       Encore faut-il que la réponse ait la longueur d'un nom — « ebe » est à
       deux insertions de « Weber » et n'est pourtant pas une faute de frappe,
       c'est une réponse au hasard. */
    var motA = a.split(' ').pop();
    if (dernier.length >= 5 && motA.length >= 4 && motA.length >= dernier.length - 2 &&
        distance(motA, dernier) <= 2) {
      return { verdict: 'presque', detail: 'Orthographe exacte : ' + attendu.nom + '.' };
    }
    return { verdict: 'rate', detail: null };
  }

  function verdictAnnee(saisie, attendu) {
    var trouvees = anneesDe(saisie);
    if (!trouvees.length) {
      /* « 1748 » écrit « dix-sept cent quarante-huit » n'arrive pas ; une
         case vide ou un hors-sujet, si. */
      return { verdict: 'rate', detail: null };
    }
    for (var i = 0; i < trouvees.length; i++) {
      if (attendu.annees.indexOf(trouvees[i]) >= 0) return { verdict: 'juste', detail: null };
    }
    var ecart = Math.min.apply(null, trouvees.map(function (t) {
      return Math.min.apply(null, attendu.annees.map(function (a) { return Math.abs(a - t); }));
    }));
    if (ecart <= 10) {
      return { verdict: 'presque', detail: 'Tu n’es pas loin : ' + attendu.texte + '.' };
    }
    return { verdict: 'rate', detail: null };
  }

  function verdictDate(saisie, attendu) {
    var a = morceauxDate(saisie), e = attendu.morceaux;
    if (!a.annees.length) return { verdict: 'rate', detail: null };
    var premiere = a.annees.indexOf(e.annees[0]) >= 0;
    var toutes = e.annees.every(function (y) { return a.annees.indexOf(y) >= 0; });
    var jourOk = !e.jour || a.jour === e.jour;
    var moisOk = !e.mois || a.mois === e.mois;
    if (toutes && jourOk && moisOk) return { verdict: 'juste', detail: null };
    if (premiere || toutes) {
      var manque = [];
      if (!toutes) manque.push('le document en donne deux : ' + attendu.texte);
      if (!moisOk) manque.push('le mois (' + nomDuMois(e.mois) + ')');
      if (!jourOk) manque.push('le jour (' + e.jour + ')');
      return { verdict: 'presque', detail: 'Il manque ' + manque.join(' et ') + '.' };
    }
    return { verdict: 'rate', detail: null };
  }

  function verdictMots(saisie, attendu) {
    var dits = {};
    mots(saisie).forEach(function (m) { dits[racine(m)] = 1; });
    var trouves = [], manquants = [];
    attendu.cles.forEach(function (k) {
      (dits[k.racine] ? trouves : manquants).push(k.mot);
    });
    var sortie = { trouves: trouves, manquants: manquants, requis: attendu.requis,
                   total: attendu.cles.length };
    if (!normaliser(saisie)) { sortie.verdict = 'rate'; return sortie; }
    if (trouves.length >= attendu.requis) sortie.verdict = 'juste';
    else if (trouves.length >= Math.ceil(attendu.requis / 2)) sortie.verdict = 'presque';
    else sortie.verdict = 'rate';
    sortie.detail = trouves.length + ' mot' + (trouves.length > 1 ? 's' : '') + '-clé' +
      (trouves.length > 1 ? 's' : '') + ' sur ' + attendu.cles.length +
      ' (il en faut ' + attendu.requis + ')';
    return sortie;
  }

  var JUGES = { texte: verdictTexte, nom: verdictNom, annee: verdictAnnee,
                date: verdictDate, mots: verdictMots };

  /* corriger(fiche, reponses) → { verdict, champs }
     « reponses » est un objet { cléDuChamp: ce qui a été écrit }.
     Un seul champ raté fait rater la fiche : dans une copie, une citation
     attribuée au mauvais auteur fait plus de mal que pas de citation. */
  function corriger(f, reponses) {
    var pire = 'juste';
    var details = f.champs.map(function (ch) {
      var saisie = (reponses && reponses[ch.cle] != null) ? String(reponses[ch.cle]) : '';
      var r = normaliser(saisie)
        ? JUGES[ch.controle](saisie, ch.attendu)
        : { verdict: 'rate', detail: 'Laissé vide.' };
      if (r.verdict === 'rate') pire = 'rate';
      else if (r.verdict === 'presque' && pire !== 'rate') pire = 'presque';
      return {
        cle: ch.cle, label: ch.label, controle: ch.controle,
        saisie: saisie, verdict: r.verdict, detail: r.detail || null,
        attendu: texteAttendu(ch),
        trouves: r.trouves || null, manquants: r.manquants || null
      };
    });
    return { verdict: pire, champs: details };
  }

  /* Ce qu'il fallait écrire, en une ligne affichable. */
  function texteAttendu(ch) {
    var a = ch.attendu;
    if (ch.controle === 'nom') return a.nom;
    if (ch.controle === 'annee') return a.texte;
    return a.texte;
  }

  global.TZ_SOG_VALIDER = {
    /* outils partagés avec tz-sog.js, pour juger partout de la même façon */
    sansAccents: sansAccents, normaliser: normaliser,
    distance: distance, reponseJuste: reponseJuste,
    anneesDe: anneesDe, morceauxDate: morceauxDate,

    CATEGORIES: CATEGORIES, categorieDe: categorieDe,
    PALIERS: PALIERS, palier: palier,
    motsCles: motsCles, requisDe: requisDe,
    fiche: fiche, corriger: corriger, pourLaCopie: pourLaCopie,
    texteAttendu: texteAttendu
  };

})(typeof window !== 'undefined' ? window : globalThis);
