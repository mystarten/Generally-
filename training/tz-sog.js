/* =============================================================================
   tz-sog.js — module « Culture SOG » de la Zone d'entraînement.

   Isolation, en deux phrases : ce fichier ne lit et n'écrit que des clés
   localStorage préfixées « training_sog_ », et ne connaît ni la banque de
   questions du quiz, ni les scores des épreuves cognitives, ni le profil
   radar. Supprimer tz-sog.js, tz-sog.css, tz-sog-data.js et sog.html laisse
   le jeu et la Zone d'entraînement intacts.

   Il ne dépend pas de training/moteur.js, ni d'aucun fichier du jeu. Il a en
   revanche besoin de deux fichiers à lui, chargés avant lui :

       tz-sog-data.js      les cartes, produites depuis culture-sog.md
       tz-sog-valider.js   les fiches de validation et leur notation

   Les outils de comparaison de texte viennent du second : la saisie du milieu
   de l'échelle et la fiche écrite du haut doivent juger avec exactement la
   même indulgence sur les accents et les fautes de frappe, sinon une même
   réponse serait acceptée à un étage et refusée à l'autre.
   ============================================================================= */
(function (global) {
  'use strict';

  var DATA = global.TZ_SOG_DATA;
  var V = global.TZ_SOG_VALIDER;

  /* Sans le module de validation, rien ne marche : la moitié des outils de
     comparaison vient de lui. On le dit à l'écran plutôt que de laisser la
     page mourir sur une erreur de console que personne ne lira. */
  if (!V) {
    document.addEventListener('DOMContentLoaded', function () {
      var h = document.querySelector('#sog-accueil');
      if (h) {
        h.textContent = 'training/tz-sog-valider.js n’est pas chargé. ' +
          'Vérifie l’ordre des balises <script> dans sog.html.';
      }
    });
    return;
  }

  /* ========================================================= petits outils */
  function el(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte != null) n.textContent = texte;
    return n;
  }
  function q(sel) { return document.querySelector(sel); }
  function vide(n) { while (n && n.firstChild) n.removeChild(n.firstChild); return n; }
  function melanger(t) {
    var a = t.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }
  /* Empruntés à tz-sog-valider.js : voir l'en-tête du fichier. */
  var sansAccents = V.sansAccents;
  var normaliser = V.normaliser;
  var reponseJuste = V.reponseJuste;

  /* Date du jour en heure locale. toISOString donnerait la date UTC, ce qui
     décale les révisions d'un jour une partie de la soirée. */
  function jour(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1), j = String(d.getDate());
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (j.length < 2 ? '0' + j : j);
  }
  function jourPlus(n, base) {
    var d = base ? new Date(base + 'T12:00:00') : new Date();
    d.setDate(d.getDate() + n);
    return jour(d);
  }
  function ecart(a, b) {   /* nombre de jours de a à b */
    return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
  }

  /* ============================================================= stockage */
  var PREFIXE = 'training_sog_';
  function lire(cle, defaut) {
    try {
      var v = localStorage.getItem(PREFIXE + cle);
      return v == null ? defaut : JSON.parse(v);
    } catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur)); return true; }
    catch (e) { return false; }
  }
  /* N'efface que ce module : les clés des épreuves cognitives, qui commencent
     par « training_ » sans « sog_ », ne sont pas touchées. */
  function toutEffacer() {
    var aRetirer = [];
    for (var i = 0; i < localStorage.length; i++) {
      var c = localStorage.key(i);
      if (c && c.indexOf(PREFIXE) === 0) aRetirer.push(c);
    }
    aRetirer.forEach(function (c) { localStorage.removeItem(c); });
    return aRetirer.length;
  }

  /* ======================================================= état et réglages */
  var INTERVALLE = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 20 };
  var REGLAGES_PAR_DEFAUT = { taille: 20, nouvellesMax: 8, chrono: false };

  var cartes = (DATA && DATA.cartes) || [];
  var parId = {};
  cartes.forEach(function (c) { parId[c.id] = c; });

  var reglages = Object.assign({}, REGLAGES_PAR_DEFAUT, lire('reglages', {}));
  var progres = lire('progres', {});

  /* ------------------------------------- reprise des boîtes auto-évaluées
     Avant la fiche écrite, les boîtes 4 et 5 s'atteignaient en révélant la
     réponse et en se notant « je savais ». Les afficher aujourd'hui comme
     « validées » serait mentir sur ce qui est su : on les ramène une fois en
     boîte 3, prêtes pour la fiche.

     Rien n'est perdu — ni les erreurs, ni les réussites, ni le nombre de
     passages : il reste à les écrire une fois pour de bon. L'opération n'a
     lieu qu'une seule fois, et le nombre de cartes concernées est annoncé sur
     l'accueil tant qu'on ne l'a pas lu. */
  (function reprendreAnciennesBoites() {
    if (lire('reprise-fiches', false)) return;
    var n = 0;
    Object.keys(progres).forEach(function (id) {
      var e = progres[id];
      if (!e || typeof e.fiches === 'number') return;   /* déjà au nouveau format */
      e.fiches = 0;
      if (e.boite >= 4) { e.boite = 3; n++; }
    });
    ecrire('progres', progres);
    ecrire('reprise-fiches', true);
    if (n) ecrire('reprise-combien', n);
  })();

  /* Une régénération des données peut faire disparaître des cartes : on garde
     leur progression de côté sans la lire, plutôt que de la jeter. */
  function etat(id) {
    /* « fiches » compte les restitutions écrites complètes réussies. Une
       carte validée en a au moins une ; deux, et elle a été reprouvée des
       jours plus tard, ce qui n'est plus de la mémoire courte. */
    return progres[id] || { boite: 0, du: null, erreurs: 0, reussites: 0,
                            vues: 0, fiches: 0, dernier: null };
  }
  function poserEtat(id, e) { progres[id] = e; ecrire('progres', progres); }

  function connues() { return cartes.filter(function (c) { return etat(c.id).boite > 0; }); }
  /* Les cartes que le document met en gras passent devant dans la file des
     nouveautes : ce sont celles qu'il dit de connaitre absolument. */
  function nouvelles() {
    return cartes.filter(function (c) { return etat(c.id).boite === 0; })
                 .sort(function (a, b) { return (b.priorite ? 1 : 0) - (a.priorite ? 1 : 0); });
  }
  function dues(date) {
    date = date || jour();
    return cartes.filter(function (c) {
      var e = etat(c.id);
      return e.boite > 0 && e.du && e.du <= date;
    });
  }
  /* Ce que je rate. L'ancienne définition demandait d'être en boîte 1 ou 2 ET
     d'avoir deux erreurs : elle affichait « 0 point faible » à quelqu'un qui
     venait d'en rater six, et ne répétait donc rien. Une seule erreur suffit
     désormais, et une carte y reste tant qu'elle n'est pas validée.

     Triée : le plus raté d'abord. C'est le moteur de la répétition. */
  function faibles() {
    return cartes.filter(function (c) {
      var e = etat(c.id);
      return (e.erreurs || 0) >= 1 && e.boite < 5;
    }).sort(function (a, b) {
      var ea = etat(a.id), eb = etat(b.id);
      if (eb.erreurs !== ea.erreurs) return eb.erreurs - ea.erreurs;
      return (ea.boite || 0) - (eb.boite || 0);
    });
  }
  /* Le haut de l'échelle, en trois états — et « validée » ne se décrète plus
     soi-même : il faut avoir écrit la fiche en entier, deux fois, à quatre
     jours d'intervalle au moins (les boîtes 3 et 4 reviennent à 4 et 8 jours).

     L'ancien compteur appelait « solide » toute carte en boîte 4 ou 5, celles
     qu'on s'était notées soi-même. Le compte est plus bas depuis, et c'est
     tout l'intérêt : il dit ce qu'on sait écrire. */
  function validees() {
    return cartes.filter(function (c) { return etat(c.id).boite >= 5; });
  }
  function confirmees() {
    return cartes.filter(function (c) {
      var e = etat(c.id);
      return e.boite >= 5 && (e.fiches || 0) >= 2;
    });
  }
  /* Prêtes pour l'épreuve écrite : la fiche leur est posée. */
  function aValider() {
    return cartes.filter(function (c) {
      var b = etat(c.id).boite;
      return b >= 3 && b < 5;
    });
  }

  /* ================================================ les cinq états d'une carte
     Tout le tableau de bord se lit avec ce seul vocabulaire. « Point faible »
     ne voulait rien dire ; ces cinq mots disent exactement où en est chaque
     référence, et ils veulent dire la même chose partout dans la page. */
  var ETATS = [
    { id: 'jamais', nom: 'jamais vue' },
    { id: 'route', nom: 'commencée' },
    { id: 'prete', nom: 'prête pour la fiche' },
    { id: 'validee', nom: 'validée' },
    { id: 'confirmee', nom: 'confirmée' }
  ];
  function etatDe(carte) {
    var e = etat(carte.id), b = e.boite || 0;
    if (!b) return 'jamais';
    if (b < 3) return 'route';
    if (b < 5) return 'prete';
    return (e.fiches || 0) >= 2 ? 'confirmee' : 'validee';
  }
  /* Compte les cinq états sur un lot. « acquises » regroupe validées et
     confirmées : c'est ce qui est réellement su. */
  function compter(lot) {
    var n = { jamais: 0, route: 0, prete: 0, validee: 0, confirmee: 0,
              total: lot.length, acquises: 0, erreurs: 0 };
    lot.forEach(function (c) {
      n[etatDe(c)]++;
      if ((etat(c.id).erreurs || 0) >= 1) n.erreurs++;
    });
    n.acquises = n.validee + n.confirmee;
    return n;
  }

  /* Le socle : les dates que le document marque « à placer en dissertation ».
     Ce sont celles dont l'utilisateur a dit lui-même qu'il devait les savoir ;
     le reste est du complément. */
  function socle() {
    return cartes.filter(function (c) { return c.priorite; });
  }

  /* ------------------------------------------------- l'index par sujet
     Un même sujet s'écrit « Liberté » ici et « libertés » là : on regroupe
     sur la forme normalisée, et on affiche l'orthographe la plus fréquente. */
  /* La clé d'un sujet : normalisée, et au singulier mot à mot. Sans cela
     « liberté » et « libertés », « science » et « sciences » comptaient pour
     deux sujets différents, chacun avec la moitié des références. */
  function cleSujet(t) {
    return normaliser(t).split(' ').map(function (m) {
      return m.length > 3 ? m.replace(/s$/, '') : m;
    }).join(' ');
  }

  function sujets(mini) {
    var index = {};
    cartes.forEach(function (c) {
      c.tags.forEach(function (t) {
        var k = cleSujet(t);
        if (!k || k.length < 3) return;
        if (!index[k]) index[k] = { cle: k, noms: {}, cartes: [] };
        index[k].noms[t] = (index[k].noms[t] || 0) + 1;
        if (index[k].cartes.indexOf(c) < 0) index[k].cartes.push(c);
      });
    });
    return Object.keys(index).map(function (k) {
      var s = index[k];
      var nom = Object.keys(s.noms).sort(function (a, b) { return s.noms[b] - s.noms[a]; })[0];
      return { cle: k, nom: nom, cartes: s.cartes, compte: compter(s.cartes) };
    }).filter(function (s) {
      return s.cartes.length >= (mini || 3);
    }).sort(function (a, b) {
      if (b.cartes.length !== a.cartes.length) return b.cartes.length - a.cartes.length;
      return a.nom.localeCompare(b.nom);
    });
  }

  /* ------------------------------------------------ l'index par auteur
     Le document conseille d'avoir au moins une référence par auteur : on ne
     peut le vérifier que si les auteurs sont comptés un par un. Citations et
     penseurs se rejoignent ici — Montesquieu cité et Montesquieu penseur sont
     le même homme dans une copie. */
  function auteurs() {
    var index = {};
    cartes.forEach(function (c) {
      var s = c.contenu.source;
      if (!s || !s.nom) return;
      var k = normaliser(s.nom);
      if (!index[k]) index[k] = { cle: k, nom: s.nom, cartes: [] };
      /* le nom le plus complet l'emporte : « Albert Camus » plutôt que « Camus » */
      if (s.nom.length > index[k].nom.length) index[k].nom = s.nom;
      index[k].cartes.push(c);
    });
    return Object.keys(index).map(function (k) {
      return { cle: k, nom: index[k].nom, cartes: index[k].cartes,
               compte: compter(index[k].cartes) };
    }).sort(function (a, b) {
      /* ceux dont on ne sait rien d'abord : c'est là qu'est le travail */
      if ((a.compte.acquises > 0) !== (b.compte.acquises > 0)) return a.compte.acquises ? 1 : -1;
      if (b.cartes.length !== a.cartes.length) return b.cartes.length - a.cartes.length;
      return a.nom.localeCompare(b.nom);
    });
  }

  /* -------------------------------------------------------------- journal */
  function journal() { return lire('journal', {}); }
  function noterJournee(repondues) {
    var j = journal(), d = jour();
    var e = j[d] || { repondues: 0, maitrisees: 0 };
    e.repondues += repondues;
    e.maitrisees = validees().length;
    j[d] = e;
    /* on ne garde que 120 jours : le graphique en montre 30 */
    var cles = Object.keys(j).sort();
    while (cles.length > 120) { delete j[cles.shift()]; }
    ecrire('journal', j);
  }
  function serie() {
    var j = journal(), n = 0, d = jour();
    if (!j[d]) d = jourPlus(-1);          /* la série survit à la journée en cours */
    while (j[d]) { n++; d = jourPlus(-1, d); }
    return n;
  }

  /* ==================================================== choix des réponses
     Les mauvaises réponses viennent toujours d'autres cartes : jamais une
     valeur inventée. On privilégie le même type et le même thème, pour que le
     choix se joue sur le savoir et non sur l'allure de la réponse. */
  function leurres(carte, champ, nb) {
    var vraie = normaliser(champ(carte));
    var memeTheme = [], autres = [];
    cartes.forEach(function (c) {
      if (c.id === carte.id || c.type !== carte.type) return;
      var v = champ(c);
      if (!v || normaliser(v) === vraie) return;
      (c.theme === carte.theme ? memeTheme : autres).push(v);
    });
    /* On resserre aussi les longueurs. Une bonne réponse trois fois plus
       longue que les leurres se repère sans rien connaître : le QCM ne mesure
       alors plus que la ruse. On garde un vivier large, puis on y pioche au
       hasard pour que les mêmes leurres ne reviennent pas à chaque fois. */
    var cible = String(champ(carte)).length;
    function proche(liste, penalite) {
      return liste.map(function (v) {
        return { v: v, score: penalite + Math.abs(String(v).length - cible) };
      });
    }
    var pioche = proche(memeTheme, 0).concat(proche(autres, 40))
      .sort(function (a, b) { return a.score - b.score; })
      .slice(0, Math.max(nb * 4, 12));

    var vus = {}, sortie = [];
    melanger(pioche).forEach(function (p) {
      if (sortie.length >= nb) return;
      var k = normaliser(p.v);
      if (vus[k]) return;
      vus[k] = 1; sortie.push(p.v);
    });
    return sortie;
  }

  /* ======================================================= les questions
     Le format de réponse dépend de la maîtrise (la boîte), le contenu dépend
     du type de carte. Une question n'affiche jamais rien qui ne vienne du
     document. */
  /* L'échelle est ce qui empêche d'avancer en devinant.

         boîte 0   on lit la carte, on ne l'interroge pas
         boîte 1   QCM : reconnaître
         boîte 2   saisie : écrire la réponse
         boîte 3   fiche écrite : tout restituer — c'est la validation
         boîte 4   fiche écrite de nouveau, huit jours plus tard
         boîte 5   validée ; recontrôlée à vingt jours par la même fiche

     Le haut de l'échelle se jouait avant en auto-évaluation : on révélait la
     réponse et on se notait « je savais ». Ça ne prouvait rien, et ça faisait
     grimper des cartes qu'on n'aurait pas su écrire. Depuis la boîte 3, c'est
     la fiche de tz-sog-valider.js qui décide, et elle ne laisse rien passer
     en silence : elle dit champ par champ ce qui manquait. */
  function format(boite) {
    if (!boite) return 'decouverte';
    if (boite === 1) return 'qcm';
    if (boite === 2) return 'saisie';
    return 'fiche';
  }

  /* ------------------------------------------------- produire une référence
     Le sujet est donné, la référence est à trouver — de mémoire, sans rien à
     l'écran. C'est le geste même de la copie, et le seul exercice de placement
     qui apprenne quelque chose.

     Le sens inverse, « dans quel type de sujet placer cette référence ? », a
     été retiré : c'était un QCM sur quatre étiquettes, où la bonne réponse se
     devinait sans rien connaître, et où plusieurs réponses étaient de toute
     façon défendables. Il faisait monter des cartes sans rien prouver.

     Ce mode ne touche pas aux boîtes : il travaille l'emploi des références,
     pas leur restitution. */
  function questionPlacement(carte) {
    function enonceDe(c) { return c.contenu.valeur || c.contenu.citation || c.contenu.question; }

    /* Il faut un sujet que plusieurs références portent, sinon la question n'a
       qu'une seule réponse possible et ce n'est plus un exercice. On essaie
       tous les sujets de la carte avant de renoncer. */
    var sujets = melanger(carte.tags);
    for (var s = 0; s < sujets.length; s++) {
      var sujet = sujets[s];
      var memeTag = cartes.filter(function (c) {
        return c.tags.some(function (t) { return normaliser(t) === normaliser(sujet); });
      });
      if (memeTag.length < 2) continue;
      return {
        genre: 'placementLibre', format: 'production',
        masquerCarte: true,
        enonce: 'Quelle référence placerais-tu dans un sujet « ' + sujet + ' » ?',
        consigne: 'Une date, une citation, un penseur, une notion ou un chiffre. ' +
                  'Écris-la de mémoire : c\u2019est exactement ce qu\u2019on te demande en copie.',
        acceptees: memeTag,
        bonne: enonceDe(carte),
        aide: memeTag.length + ' références du document portent ce sujet.'
      };
    }
    return null;
  }

  function questionAttribuee(carte) {
    var a = carte.contenu.auteurCourt;
    if (!a) return null;
    var vrai = Math.random() < 0.5;
    var autre = a;
    if (!vrai) {
      var candidats = cartes.filter(function (c) {
        return c.type === 'citation' && c.contenu.auteurCourt &&
               normaliser(c.contenu.auteurCourt) !== normaliser(a);
      });
      if (!candidats.length) vrai = true;
      else autre = candidats[Math.floor(Math.random() * candidats.length)].contenu.auteurCourt;
    }
    var nom = vrai ? a : autre;
    return {
      genre: 'attribuee',
      format: 'qcm',
      enonce: 'Cette phrase est-elle bien de ' + nom + ' ?',
      support: '« ' + carte.contenu.citation +' »',
      bonne: vrai ? 'Oui, mais la formule lui est seulement attribuée' : 'Non',
      options: melanger(['Oui, mais la formule lui est seulement attribuée', 'Non']),
      aide: 'Dans la copie, écris « selon une formule attribuée à ' + a + ' ».'
    };
  }

  /* Les indices : trois paliers, tirés de la carte et de rien d'autre. Demander
     un indice n'est pas tricher, mais la carte ne montera pas pour autant —
     elle sera comptée « presque » au mieux. */
  function indices(carte, qst) {
    var c = carte.contenu, liste = [];

    /* La production libre accepte TOUTE référence portant le sujet : un indice
       qui décrit une carte précise induirait en erreur. On parle du stock. */
    if (qst.genre === 'placementLibre') {
      var types = {};
      qst.acceptees.forEach(function (x) { types[x.type] = (types[x.type] || 0) + 1; });
      liste.push(qst.acceptees.length + ' références du document portent ce sujet.');
      liste.push('Il y a ' + Object.keys(types).sort().map(function (t) {
        return types[t] + ' ' + t + (types[t] > 1 ? 's' : '');
      }).join(', ') + '.');
      var ex = qst.acceptees[Math.floor(Math.random() * qst.acceptees.length)];
      liste.push('L’une d’elles commence par « ' +
                 String(ex.contenu.question).slice(0, 18) + '… ».');
      return liste;
    }

    liste.push(carte.type === 'citation'
      ? 'Une citation du thème « ' + carte.theme + ' ».'
      : 'Une carte « ' + carte.type + ' » du thème « ' + carte.theme + ' ».');

    var rep = String(qst.bonne || '');
    var an = rep.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
    if (an) {
      var siecle = Math.floor(parseInt(an[1], 10) / 100) + 1;
      liste.push('C’est le ' + siecle + 'e siècle, années ' +
                 (Math.floor(parseInt(an[1], 10) / 10) * 10) + '.');
    } else {
      var mots = rep.split(/\s+/).filter(Boolean);
      liste.push('La réponse fait ' + mots.length + ' mot' + (mots.length > 1 ? 's' : '') +
                 ' et commence par « ' + rep.slice(0, 2).trim() + '… ».');
    }

    if (carte.tags.length) liste.push('À placer dans : ' + carte.tags.join(', ') + '.');
    else if (c.valeur && normaliser(c.valeur) !== normaliser(rep)) liste.push(c.valeur);
    else liste.push('Dernier indice : ' + rep.slice(0, Math.ceil(rep.length / 2)) + '…');

    return liste;
  }

  function questionCarte(carte, boite, formatImpose) {
    var c = carte.contenu;

    /* Une carte jamais vue ne se devine pas : on la montre, puis elle revient
       dans la séance sous forme de question. Interroger d'abord, c'était
       demander de choisir au hasard entre quatre inconnues. */
    if (!boite && !formatImpose) {
      return {
        genre: 'decouverte', format: 'decouverte',
        enonce: c.question,
        bonne: c.reponse
      };
    }

    var f = formatImpose || format(boite);

    /* Le piège de la formule attribuée ne vaut qu'en bas de l'échelle : c'est
       une question à deux cases, donc une pièce à pile ou face. Plus haut,
       c'est la carte elle-même, et elle entière. En défi non plus, où le
       format est imposé : tout le monde doit lire le même énoncé. */
    if (!formatImpose && (f === 'qcm' || f === 'saisie') &&
        carte.attribuee && carte.type === 'citation' && Math.random() < 0.34) {
      var at = questionAttribuee(carte);
      if (at) return at;
    }

    /* ------------------------------------------------- la fiche, boîtes 3 à 5 */
    if (f === 'fiche') {
      var fi = V.fiche(carte);
      if (fi && fi.champs.length) {
        return {
          genre: 'fiche', format: 'fiche', fiche: fi,
          enonce: fi.enonce, support: fi.support, consigne: fi.consigne,
          bonne: c.reponse
        };
      }
      /* Aucune carte n'est censée tomber ici : scripts/verifier-sog-valider.js
         vérifie que les 328 produisent une fiche. Si le document change et
         qu'une carte devient invalidable, on redescend d'un étage plutôt que
         de la bloquer tout en haut de l'échelle. */
      f = 'saisie';
    }

    var inverse = !formatImpose && (carte.type === 'date' || carte.type === 'penseur') &&
                  c.inverse && Math.random() < 0.4;
    var enonce = inverse ? c.inverse.question : c.question;
    var bonne = inverse ? c.inverse.reponse : c.reponse;

    /* trou de citation : dès qu'on passe à la saisie, en alternance avec la
       question « qui a dit ? », pour ne pas toujours travailler le même bout */
    if (f === 'saisie' && carte.type === 'citation' && c.trou && Math.random() < 0.6) {
      return {
        genre: 'trou', format: 'saisie',
        enonce: 'Complète la citation',
        support: '« ' + c.trou.texte + ' »',
        bonne: c.trou.manquant,
        aide: c.auteur
      };
    }

    if (f === 'qcm') {
      var champ = inverse
        ? function (x) { return x.contenu.inverse ? x.contenu.inverse.reponse : null; }
        : function (x) { return x.contenu.reponse; };
      var faux = leurres(carte, champ, 3);
      if (faux.length < 2) f = 'libre';       /* pas assez de matière : on bascule */
      else return {
        genre: 'qcm', format: 'qcm',
        enonce: enonce,
        bonne: bonne,
        options: melanger([bonne].concat(faux)),
        aide: carte.volatile ? 'Ordre de grandeur, à vérifier dans l’actu.' : null
      };
    }

    if (f === 'saisie') {
      return { genre: 'saisie', format: 'saisie', enonce: enonce, bonne: bonne,
               aide: carte.volatile ? 'Ordre de grandeur, à vérifier dans l’actu.' : null };
    }
    return { genre: 'libre', format: 'libre', enonce: enonce, bonne: bonne,
             aide: carte.volatile ? 'Ordre de grandeur, à vérifier dans l’actu.' : null };
  }

  /* ============================================== composition d'une session */
  function composer(mode, filtre) {
    var taille = reglages.taille;
    var d = jour();


    /* « Valider » : les cartes prêtes pour l'épreuve écrite, celles qui sont
       en boîte 3 ou 4. Pas de tirage au sort ici — c'est une file d'attente,
       on prend d'abord ce que le calendrier réclame, puis le plus bas étage,
       parce qu'une carte en boîte 3 a plus besoin d'être validée qu'une
       carte en boîte 4 qui attend son contrôle. */
    if (mode === 'valider') {
      var prets = cartes.filter(function (c) {
        if (filtre && c.type !== filtre) return false;
        var b = etat(c.id).boite;
        return b >= 3 && b < 5;
      });
      prets.sort(function (a, b) {
        var ea = etat(a.id), eb = etat(b.id);
        var da = (ea.du && ea.du <= d) ? 0 : 1, db = (eb.du && eb.du <= d) ? 0 : 1;
        if (da !== db) return da - db;
        return (ea.boite || 0) - (eb.boite || 0);
      });
      return prets.slice(0, taille);
    }

    /* Mes erreurs : le moteur de la répétition. Le plus raté d'abord, et sans
       condition de boîte — ce qu'on se trompe doit revenir, point. */
    if (mode === 'erreurs') return faibles().slice(0, taille);

    /* Le socle : les dates à placer en dissertation, celles dont le document
       dit qu'elles sont indispensables. Ce qui n'est pas encore su passe
       devant. */
    if (mode === 'socle') {
      var noyau = socle().slice();
      noyau.sort(function (a, b) {
        return (etat(a.id).boite || 0) - (etat(b.id).boite || 0);
      });
      return noyau.slice(0, taille);
    }

    /* Un sujet de dissertation : toutes les références qui s'y placent, tous
       types confondus. C'est la révision de la veille d'un concours. */
    if (mode === 'sujet') {
      return melanger(cartes.filter(function (c) {
        return c.tags.some(function (t) { return cleSujet(t) === filtre; });
      })).slice(0, taille);
    }

    /* Un auteur : ses citations et son idée clé d'un seul tenant. */
    if (mode === 'auteur') {
      return melanger(cartes.filter(function (c) {
        var s = c.contenu.source;
        return s && s.nom && normaliser(s.nom) === filtre;
      })).slice(0, taille);
    }

    /* « Placement » : l'exercice de la copie, trouver soi-même la référence
       qui sert le sujet. Il faut au moins deux sujets attachés à la carte
       pour qu'il y ait quelque chose à chercher. */
    if (mode === 'placement') {
      var combien = {};
      cartes.forEach(function (c) {
        c.tags.forEach(function (t) {
          var k = normaliser(t);
          if (k) combien[k] = (combien[k] || 0) + 1;
        });
      });
      return melanger(cartes.filter(function (c) {
        return c.tags.some(function (t) { return combien[normaliser(t)] >= 2; });
      })).slice(0, taille);
    }

    if (mode === 'theme')   return melanger(cartes.filter(function (c) { return c.theme === filtre; })).slice(0, taille);
    if (mode === 'type')    return melanger(cartes.filter(function (c) {
                               return filtre === 'attribuee' ? c.attribuee : c.type === filtre; })).slice(0, taille);
    if (mode === 'libre')   return melanger(cartes).slice(0, taille);

    /* session du jour : moitié de cartes arrivées à échéance, un tiers de
       cartes ratées, le reste en nouveautés, dans la limite du quota
       quotidien. Les ratées passent avant les nouvelles : apprendre une
       référence de plus vaut moins que réparer celle qu'on vient de manquer. */
    var nouvellesAujourdhui = (journal()[d] || {}).nouvelles || 0;
    var quota = Math.max(0, reglages.nouvellesMax - nouvellesAujourdhui);

    var lot = [], pris = {};
    function ajouter(liste, combien, garderOrdre) {
      var m = garderOrdre ? liste.slice() : melanger(liste);
      for (var i = 0; i < m.length && combien > 0 && lot.length < taille; i++) {
        if (pris[m[i].id]) continue;
        pris[m[i].id] = 1; lot.push(m[i]); combien--;
      }
    }
    function nouvellesPrises() {
      return lot.filter(function (c) { return etat(c.id).boite === 0; }).length;
    }
    ajouter(dues(d), Math.round(taille * 0.5));
    ajouter(faibles(), Math.round(taille * 0.3), true);   /* déjà trié : le plus raté d'abord */
    ajouter(nouvelles(), Math.min(quota, Math.round(taille * 0.2)), true);
    /* On complète avec ce qui est dû, puis avec des nouvelles — sans jamais
       dépasser le quota du jour, qui compte aussi les sessions précédentes. */
    ajouter(dues(d), taille);
    ajouter(nouvelles(), quota - nouvellesPrises(), true);
    return melanger(lot);
  }

  /* ================================================== le lecteur de session */
  var session = null;

  function demarrer(mode, filtre, titre, surFin) {
    var lot = composer(mode, filtre);
    if (!lot.length) { ecranRienAFaire(mode); return; }
    lancerLot(lot, titre || 'Session du jour', surFin,
              mode === 'placement' ? { placement: true } : null);
  }

  /* Le cœur de « demarrer », séparé pour qu'une session puisse aussi être
     lancée sur un lot DÉJÀ composé — c'est ce dont le multijoueur a besoin :
     tout le monde doit réviser exactement les mêmes cartes. */
  function lancerLot(lot, titre, surFin, opts) {
    opts = opts || {};
    session = {
      titre: titre,
      file: lot.map(function (c) {
        return { carte: c, suite: 0, horsBoite: !!opts.placement };
      }),
      total: lot.length, faits: 0, justes: 0, presque: 0, rates: 0,
      fiches: 0, validees: 0,
      /* Un défi ne consomme pas le quota de nouvelles cartes du jour : il ne
         les fait pas découvrir, il les met en jeu. */
      nouvelles: opts.defi ? 0
        : lot.filter(function (c) { return etat(c.id).boite === 0; }).length,
      defi: !!opts.defi,
      placement: !!opts.placement,
      formatImpose: opts.format || null,
      surFin: surFin || null,
      chrono: null
    };
    ecran('session');
    suivante();
  }

  function suivante() {
    if (session.chrono) { clearTimeout(session.chrono); session.chrono = null; }
    if (!session.file.length) { terminerSession(); return; }
    var item = session.file.shift();
    poserQuestion(item);
  }

  function poserQuestion(item) {
    var carte = item.carte, e = etat(carte.id);
    /* boîte 0 assumée : une carte jamais vue passe par la découverte, elle
       n'est pas traitée comme si elle était déjà en boîte 1. */
    var boite = e.boite || 0;
    var qst = item.forcerQuestion ||
      (session.placement ? questionPlacement(carte) : null) ||
      questionCarte(carte, boite, session.formatImpose);
    item.forcerQuestion = null;

    var hote = vide(q('#sog-scene'));
    barre();

    var haut = el('div', 'sog-haut');
    if (!qst.masquerCarte) {
      haut.appendChild(el('span', 'sog-pastille sog-' + carte.type, carte.type));
      haut.appendChild(el('span', 'sog-theme', carte.theme));
    }
    haut.appendChild(el('span', 'sog-boite', boite ? 'boîte ' + boite : 'nouvelle'));
    if (!qst.masquerCarte) {
      if (carte.priorite) haut.appendChild(el('span', 'sog-cle', 'à connaître'));
      if (carte.volatile) haut.appendChild(el('span', 'sog-alerte', 'ordre de grandeur'));
      if (carte.attribuee) haut.appendChild(el('span', 'sog-alerte', 'formule attribuée'));
    }
    hote.appendChild(haut);

    hote.appendChild(el('p', 'sog-enonce', qst.enonce));
    if (qst.support) hote.appendChild(el('blockquote', 'sog-support', qst.support));

    var zone = el('div', 'sog-zone');
    hote.appendChild(zone);

    var repondu = false;
    function conclure(verdict, donnee) {
      if (repondu) return;
      repondu = true;
      if (session.chrono) { clearTimeout(session.chrono); session.chrono = null; }
      /* Un indice demandé plafonne à « presque » : la carte ne monte pas,
         mais on n'est pas puni d'avoir cherché. */
      if (item.indicesPris && verdict === 'juste') verdict = 'presque';
      appliquer(item, qst, verdict, donnee);
    }

    /* ------------------------------------------------- découverte d'une carte
       Pas de question : on lit la carte. Elle repart dans la file et sera
       posée plus loin dans la séance, en QCM. */
    if (qst.format === 'decouverte') {
      zone.appendChild(el('p', 'sog-consigne',
        'Nouvelle carte. Lis-la : elle reviendra en question dans cette séance.'));
      zone.appendChild(reponseAffichee(carte, qst));
      var lu = el('button', 'sog-btn sog-suite', 'J’ai lu');
      lu.type = 'button';
      lu.addEventListener('click', function () { conclure('decouverte'); });
      var rLu = el('div', 'sog-rangee');
      rLu.appendChild(lu);
      zone.appendChild(rLu);
      setTimeout(function () { lu.focus(); }, 20);
      session.clavier = null;
      return;
    }

    /* ------------------------------------------------------------- QCM */
    if (qst.format === 'qcm') {
      var boutons = [];
      qst.options.forEach(function (opt, k) {
        var b = el('button', 'sog-option');
        b.type = 'button';
        b.appendChild(el('span', 'sog-touche', String(k + 1)));
        b.appendChild(el('span', null, opt));
        b.addEventListener('click', function () {
          conclure(normaliser(opt) === normaliser(qst.bonne) ? 'juste' : 'rate', opt);
        });
        boutons.push(b); zone.appendChild(b);
      });
      session.clavier = function (ev) {
        var n = parseInt(ev.key, 10);
        if (n >= 1 && n <= boutons.length) { boutons[n - 1].click(); return true; }
        return false;
      };
    }

    /* ---------------------------------------------------------- saisie */
    if (qst.format === 'saisie') {
      var champ = el('input', 'sog-saisie');
      champ.type = 'text';
      champ.setAttribute('autocomplete', 'off');
      champ.placeholder = 'Ta réponse';
      zone.appendChild(champ);
      var valider = el('button', 'sog-btn', 'Valider');
      valider.type = 'button';
      valider.addEventListener('click', function () {
        conclure(reponseJuste(champ.value, qst.bonne) ? 'juste' : 'rate', champ.value);
      });
      zone.appendChild(valider);
      champ.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); valider.click(); }
      });
      setTimeout(function () { champ.focus(); }, 30);
      session.clavier = null;
    }

    /* ----------------------------------------------- fiche de validation
       Deux à quatre champs, tous écrits de mémoire : le contenu, l'auteur,
       l'œuvre, l'année. Rien n'est soufflé, aucun indice n'est proposé — c'est
       l'épreuve, pas l'entraînement. La correction qui suit dit champ par
       champ ce qui était juste et ce qui manquait. */
    if (qst.format === 'fiche') {
      zone.appendChild(el('p', 'sog-consigne', qst.consigne ||
        'Écris la fiche de mémoire. Tous les champs comptent.'));

      var entrees = [];
      qst.fiche.champs.forEach(function (ch) {
        var bloc = el('div', 'sog-champ');
        var etiq = el('label', 'sog-champ-nom', ch.label);
        bloc.appendChild(etiq);
        var entree;
        if (ch.court) {
          entree = el('input', 'sog-saisie sog-court');
          entree.type = 'text';
          entree.setAttribute('autocomplete', 'off');
        } else {
          entree = el('textarea', 'sog-note');
          entree.rows = 2;
        }
        entree.id = 'sog-ch-' + ch.cle;
        etiq.setAttribute('for', entree.id);
        bloc.appendChild(entree);
        if (ch.aide) bloc.appendChild(el('span', 'sog-champ-aide', ch.aide));
        zone.appendChild(bloc);
        entrees.push({ cle: ch.cle, noeud: entree });
      });

      var validerFiche = el('button', 'sog-btn', 'Valider la fiche');
      validerFiche.type = 'button';
      validerFiche.addEventListener('click', function () {
        var reponses = {};
        entrees.forEach(function (e) { reponses[e.cle] = e.noeud.value; });
        qst.correction = V.corriger(qst.fiche, reponses);
        conclure(qst.correction.verdict, reponses);
      });
      zone.appendChild(validerFiche);

      /* Entrée passe au champ suivant, et valide depuis le dernier : on
         remplit une fiche au clavier sans quitter les touches. */
      entrees.forEach(function (e, k) {
        e.noeud.addEventListener('keydown', function (ev) {
          if (ev.key !== 'Enter' || ev.shiftKey) return;
          if (e.noeud.tagName === 'TEXTAREA' && !ev.ctrlKey && !ev.metaKey) return;
          ev.preventDefault();
          if (k + 1 < entrees.length) entrees[k + 1].noeud.focus();
          else validerFiche.click();
        });
      });
      setTimeout(function () { if (entrees[0]) entrees[0].noeud.focus(); }, 30);
      session.clavier = null;
    }

    /* --------------------------------------------------- production libre
       On ne choisit pas une référence, on en produit une. Toute carte du
       document portant ce sujet est acceptée : c'est l'exercice de la copie. */
    if (qst.format === 'production') {
      if (qst.consigne) zone.appendChild(el('p', 'sog-consigne', qst.consigne));
      var zoneProd = el('textarea', 'sog-note');
      zoneProd.rows = 2;
      zoneProd.placeholder = 'Ta référence';
      zone.appendChild(zoneProd);
      var validerProd = el('button', 'sog-btn', 'Valider');
      validerProd.type = 'button';
      validerProd.addEventListener('click', function () {
        var saisi = zoneProd.value;
        var trouvee = null;
        qst.acceptees.some(function (c) {
          var cibles = [c.contenu.reponse, c.contenu.valeur, c.contenu.citation,
                        c.contenu.cle, c.contenu.auteurCourt];
          return cibles.some(function (t) {
            if (!t || String(t).length < 4) return false;
            if (reponseJuste(saisi, t) ||
                (normaliser(saisi).length > 5 &&
                 normaliser(t).indexOf(normaliser(saisi)) >= 0)) { trouvee = c; return true; }
            return false;
          });
        });
        qst.trouvee = trouvee;
        conclure(trouvee ? 'juste' : 'rate', saisi);
      });
      zone.appendChild(validerProd);
      setTimeout(function () { zoneProd.focus(); }, 30);
      session.clavier = null;
    }

    /* ----------------------------------------------------- rappel libre */
    if (qst.format === 'libre') {
      zone.appendChild(el('p', 'sog-consigne',
        'Réponds dans ta tête ou écris-la, puis révèle (Espace).'));
      var note = el('textarea', 'sog-note');
      note.rows = 2;
      note.placeholder = 'Facultatif';
      zone.appendChild(note);
      var reveler = el('button', 'sog-btn', 'Révéler la réponse');
      reveler.type = 'button';
      reveler.addEventListener('click', function () { autoEvaluer(item, qst); });
      zone.appendChild(reveler);
      session.clavier = function (ev) {
        if (ev.key === ' ' && document.activeElement !== note) { reveler.click(); return true; }
        return false;
      };
    }

    /* -------------------------------------------- indices, puis l'aveu
       L'indice n'existe que là où il faut produire la réponse : sur un QCM
       il reviendrait à barrer des cases. */
    var rangee = el('div', 'sog-rangee');

    if (qst.format !== 'qcm' && qst.format !== 'fiche') {
      var paliers = indices(carte, qst);
      item.indicesPris = 0;
      /* La boîte se place avant la rangée de boutons : on l'ajoute donc
         maintenant, la rangée étant ajoutée à la fin. */
      var boiteIndices = el('div', 'sog-indices');
      hote.appendChild(boiteIndices);

      var btnIndice = el('button', 'sog-btn sog-fantome', 'Un indice');
      btnIndice.type = 'button';
      btnIndice.addEventListener('click', function () {
        if (item.indicesPris >= paliers.length) return;
        boiteIndices.appendChild(el('p', 'sog-indice', paliers[item.indicesPris]));
        item.indicesPris++;
        btnIndice.textContent = item.indicesPris >= paliers.length
          ? 'Plus d’indice' : 'Un autre indice (' + item.indicesPris + '/' + paliers.length + ')';
        btnIndice.disabled = item.indicesPris >= paliers.length;
      });
      rangee.appendChild(btnIndice);
    }

    var sais = el('button', 'sog-btn sog-fantome', 'Je ne sais pas');
    sais.type = 'button';
    sais.addEventListener('click', function () { conclure('ignore'); });
    rangee.appendChild(sais);
    hote.appendChild(rangee);

    /* ------------------------------------------------------- chrono 15 s
       Jamais sur une fiche : remplir quatre champs de mémoire n'est pas un
       exercice de vitesse, et un chrono y transformerait la validation en
       loterie. Le réglage le dit. */
    if (reglages.chrono && qst.format !== 'fiche') {
      var jauge = el('div', 'sog-chrono');
      var barreChrono = el('i');
      jauge.appendChild(barreChrono);
      hote.insertBefore(jauge, haut.nextSibling);
      requestAnimationFrame(function () { barreChrono.style.width = '0%'; });
      session.chrono = setTimeout(function () { conclure('rate', null); }, 15000);
    }
  }

  /* Le rappel libre : on montre la réponse, l'utilisateur se juge. */
  function autoEvaluer(item, qst) {
    var carte = item.carte;
    var zone = vide(q('#sog-scene .sog-zone'));
    zone.appendChild(reponseAffichee(carte, qst));
    var r = el('div', 'sog-rangee');
    [['Je savais', 'juste'], ['Presque', 'presque'], ['Non', 'rate']].forEach(function (p) {
      var b = el('button', 'sog-btn' + (p[1] === 'juste' ? '' : ' sog-fantome'), p[0]);
      b.type = 'button';
      b.addEventListener('click', function () { appliquer(item, qst, p[1]); });
      r.appendChild(b);
    });
    zone.appendChild(r);
    session.clavier = function (ev) {
      var n = parseInt(ev.key, 10);
      if (n >= 1 && n <= 3) { r.children[n - 1].click(); return true; }
      return false;
    };
  }

  /* Le bloc de correction : la bonne réponse, puis « À placer dans ». */
  function reponseAffichee(carte, qst) {
    var c = carte.contenu;
    var b = el('div', 'sog-correction');

    /* ------------------------------------------- correction d'une fiche
       Champ par champ : ce qui a été écrit, ce qu'il fallait, et pourquoi.
       Une note sans explication n'apprend rien ; sur les définitions, on
       montre même quels mots-clés manquaient. */
    if (qst.genre === 'fiche') {
      var lignes = qst.correction ? qst.correction.champs
        : qst.fiche.champs.map(function (ch) {
            return { label: ch.label, saisie: '', verdict: 'ignore',
                     attendu: V.texteAttendu(ch), detail: null,
                     trouves: null, manquants: null };
          });

      var table = el('div', 'sog-corr');
      lignes.forEach(function (l) {
        var r = el('div', 'sog-corr-ligne sog-corr-' + l.verdict);
        r.appendChild(el('span', 'sog-corr-label', l.label));
        var droite = el('div', 'sog-corr-val');
        if (l.verdict === 'juste' && !l.detail) {
          droite.appendChild(el('span', 'sog-corr-ok', l.attendu));
        } else {
          droite.appendChild(el('span', 'sog-corr-bonne', l.attendu));
          if (normaliser(l.saisie)) {
            droite.appendChild(el('span', 'sog-corr-ecrit', 'tu as écrit : ' + l.saisie));
          } else if (l.verdict !== 'ignore') {
            droite.appendChild(el('span', 'sog-corr-ecrit', 'laissé vide'));
          }
        }
        if (l.detail) droite.appendChild(el('span', 'sog-corr-detail', l.detail));
        if (l.manquants && l.manquants.length) {
          droite.appendChild(el('span', 'sog-corr-detail',
            'mots-clés oubliés : ' + l.manquants.join(', ')));
        }
        r.appendChild(droite);
        table.appendChild(r);
      });
      b.appendChild(table);

      /* La référence rédigée, prête à recopier. C'est l'objet de tout ce
         travail : une ligne qui tient dans une copie. */
      if (qst.fiche.modele) {
        var copie = el('div', 'sog-copie');
        copie.appendChild(el('span', 'sog-etiquette', 'Pour ta copie'));
        copie.appendChild(el('p', 'sog-copie-txt', qst.fiche.modele));
        b.appendChild(copie);
      }
      if (carte.attribuee && c.auteurCourt) {
        b.appendChild(el('p', 'sog-avertit',
          'Formule attribuée : écris « selon une formule attribuée à ' + c.auteurCourt + ' ».'));
      }
      if (carte.volatile) {
        b.appendChild(el('p', 'sog-avertit', 'Ordre de grandeur, à vérifier dans l’actu.'));
      }
      if (carte.tags.length) {
        b.appendChild(el('p', 'sog-tags', 'À placer dans : ' + carte.tags.join(', ')));
      }
      return b;
    }

    /* Production libre : la réponse n'est pas « la » carte mais l'une des
       références du document qui portent ce sujet. On montre celle qui a été
       reconnue, puis quelques autres, parce que c'est le stock qui compte. */
    if (qst.genre === 'placementLibre') {
      if (qst.trouvee) {
        b.appendChild(el('div', 'sog-bonne',
          qst.trouvee.contenu.question + ' — ' + qst.trouvee.contenu.reponse));
        b.appendChild(el('p', 'sog-aide', 'Reconnue dans le document.'));
      } else {
        b.appendChild(el('div', 'sog-bonne', 'Par exemple :'));
      }
      var liste = el('ul', 'sog-puces');
      melanger(qst.acceptees).slice(0, 5).forEach(function (x) {
        if (qst.trouvee && x.id === qst.trouvee.id) return;
        liste.appendChild(el('li', null, x.contenu.question + ' — ' + x.contenu.reponse));
      });
      b.appendChild(liste);
      return b;
    }

    b.appendChild(el('div', 'sog-bonne', qst.bonne));
    if (qst.aide) b.appendChild(el('p', 'sog-aide', qst.aide));

    if (carte.type === 'citation') {
      var ligne = [];
      if (c.auteur) ligne.push(c.auteur);
      b.appendChild(el('p', 'sog-source', ligne.join(' · ')));
      if (carte.attribuee && c.auteurCourt) {
        b.appendChild(el('p', 'sog-avertit',
          'Formule attribuée : écris « selon une formule attribuée à ' + c.auteurCourt + ' ».'));
      }
    }
    if (carte.type !== 'citation' && c.valeur && normaliser(c.valeur) !== normaliser(qst.bonne)) {
      b.appendChild(el('p', 'sog-source', c.valeur));
    }
    if (carte.volatile) {
      b.appendChild(el('p', 'sog-avertit', 'Ordre de grandeur, à vérifier dans l’actu.'));
    }
    if (carte.tags.length) {
      b.appendChild(el('p', 'sog-tags', 'À placer dans : ' + carte.tags.join(', ')));
    }
    return b;
  }

  /* --------------------------------------- application du verdict Leitner */
  function appliquer(item, qst, verdict, donnee) {
    var carte = item.carte;

    /* Deux situations ne doivent rien écrire dans les boîtes :

         — le défi, parce que réviser à plusieurs ne doit pas fausser son
           propre calendrier : le salon impose la même question à tout le
           monde, sans égard pour l'étage où chacun en est ;
         — le mode Placement, qui travaille l'emploi d'une référence et non sa
           restitution. Une carte ne doit pas pouvoir monter sans avoir été
           écrite.

       La séance continue de compter les réponses dans les deux cas : c'est le
       calendrier de révision qu'on protège, pas le décompte de la séance. */
    var enregistre = !session.defi && !item.horsBoite;
    /* etat() rend l'objet stocké lui-même quand la carte a déjà une
       progression : le modifier suffirait à la salir, même sans écrire. On
       travaille donc sur une copie quand rien ne doit être retenu. */
    var e = etat(carte.id);
    if (!enregistre) e = Object.assign({}, e);

    /* La découverte n'est pas une réponse : on a seulement lu la carte. Elle
       ne change pas de boîte et ne compte dans aucun total ; elle repart dans
       la file pour être posée plus loin, en question. */
    if (verdict === 'decouverte') {
      if (enregistre) {
        e.vues++;
        e.dernier = jour();
        poserEtat(carte.id, e);
      }
      item.indicesPris = 0;
      item.forcerQuestion = questionCarte(carte, 1);
      replacer(item);
      suivante();
      return;
    }

    /* Seule la premiere rencontre de la seance deplace la carte dans les
       boites. Les passages suivants sont du retravail immediat : les compter
       ferait grimper une carte de trois boites en un quart d'heure, ce que la
       repetition espacee cherche justement a eviter. */
    var premiere = !item.vue;
    item.vue = true;

    e.vues++;
    e.dernier = jour();
    if (verdict === 'juste') { e.reussites++; item.suite++; }
    else {
      /* « Je ne sais pas » renvoie en boite 1 comme une erreur, mais ne
         compte pas comme une erreur : il sert a avouer, pas a se punir. */
      if (verdict === 'rate') e.erreurs++;
      item.suite = 0;
    }

    /* Une fiche réussie se compte à part : c'est la preuve écrite. Deux
       fiches, et la carte a été restituée à plusieurs jours d'intervalle. */
    if (enregistre && premiere && verdict === 'juste' && qst.genre === 'fiche') {
      e.fiches = (e.fiches || 0) + 1;
      session.fiches++;
    }

    var avant = e.boite || 0;
    if (premiere) {
      if (verdict === 'juste') e.boite = Math.min(5, (e.boite || 0) + 1);
      else if (verdict === 'presque') e.boite = Math.max(1, e.boite || 1);
      else e.boite = 1;
      e.du = jourPlus(INTERVALLE[e.boite] || 1);
    }
    if (enregistre && avant < 5 && e.boite >= 5) session.validees++;
    if (enregistre) poserEtat(carte.id, e);

    session.faits++;
    if (verdict === 'juste') session.justes++;
    else if (verdict === 'presque') session.presque++;
    else session.rates++;

    /* Une carte ratée revient dans la session, 3 à 5 cartes plus loin, tant
       qu'elle n'a pas été donnée juste deux fois de suite. */
    if (verdict !== 'juste') item.rate = true;
    /* Trois reprises au plus : sans ce plafond, une carte qu'on n'arrive pas
       a retenir ferait tourner la seance indefiniment. */
    item.reprises = item.reprises || 0;
    if (item.rate && item.suite < 2 && item.reprises < 3) {
      item.reprises++;
      replacer(item);
    }

    montrerCorrection(item, qst, verdict);
  }

  function replacer(item) {
    var ou = Math.min(session.file.length, 2 + Math.floor(Math.random() * 3));
    session.file.splice(ou, 0, item);
  }

  /* L'état d'une carte en une phrase : l'étage, ce qu'il reste à faire pour
     la valider, et la date du prochain passage. */
  function etatEnMots(e) {
    var b = e.boite || 0;
    var jours = e.du ? ecart(jour(), e.du) : 0;
    var quand = jours <= 0 ? 'revue aujourd’hui'
              : jours === 1 ? 'revue demain'
              : 'revue dans ' + jours + ' jours';
    if (b >= 5) {
      return 'Validée' + ((e.fiches || 0) >= 2 ? ' et confirmée' : '') +
             ' · contrôle : ' + quand;
    }
    if (b >= 3) {
      var reste = 5 - b;
      return 'Boîte ' + b + ' sur 5 · ' + reste + ' fiche' + (reste > 1 ? 's' : '') +
             ' juste' + (reste > 1 ? 's' : '') + ' et elle est validée · ' + quand;
    }
    return 'Boîte ' + b + ' sur 5 · ' + quand;
  }

  function montrerCorrection(item, qst, verdict) {
    var carte = item.carte;
    var hote = q('#sog-scene');
    var zone = vide(hote.querySelector('.sog-zone'));
    var r = hote.querySelector('.sog-rangee');
    if (r) r.remove();

    var etiquettes = { juste: 'Juste', presque: 'Presque', rate: 'Raté', ignore: 'Réponse' };
    var titre = etiquettes[verdict] || 'Réponse';
    var e = etat(carte.id);
    if (qst.genre === 'fiche') {
      titre = verdict === 'juste' ? (e.boite >= 5 ? 'Carte validée' : 'Fiche juste')
            : verdict === 'presque' ? 'Fiche incomplète'
            : 'Fiche à revoir';
    }
    var bandeau = el('div', 'sog-verdict sog-v-' + verdict, titre);
    zone.appendChild(bandeau);

    /* Où en est cette carte, et quand elle revient. Sans cette ligne, on ne
       sait jamais ce qu'une bonne réponse vient de changer. */
    zone.appendChild(el('p', 'sog-etat-carte',
      session.defi ? 'Défi : ta progression personnelle n’est pas modifiée.'
      : item.horsBoite ? 'Mode Placement : les boîtes ne bougent pas, c’est l’emploi des références qu’on travaille.'
      : etatEnMots(e)));

    zone.appendChild(reponseAffichee(carte, qst));

    var suite = el('button', 'sog-btn sog-suite', session.file.length ? 'Suivante' : 'Terminer');
    suite.type = 'button';
    suite.addEventListener('click', suivante);
    var rr = el('div', 'sog-rangee');
    rr.appendChild(suite);
    zone.appendChild(rr);
    setTimeout(function () { suite.focus(); }, 20);
    session.clavier = null;
  }

  /* Les cartes ratées sont remises en file : le dénominateur bouge, et la
     barre doit suivre le travail réellement restant, pas le lot de départ. */
  function barre() {
    var restant = session.file.length + 1;
    var part = session.faits / (session.faits + restant);
    var b = q('#sog-barre i');
    if (b) b.style.width = Math.round(part * 100) + '%';
    var t = q('#sog-compte');
    if (t) t.textContent = (session.faits + 1) + ' / ' + (session.faits + restant);
  }

  function terminerSession() {
    noterJournee(session.faits);
    var j = journal(), d = jour();
    j[d] = j[d] || { repondues: 0, maitrisees: 0 };
    j[d].nouvelles = (j[d].nouvelles || 0) + session.nouvelles;
    ecrire('journal', j);

    var hote = vide(q('#sog-bilan'));
    hote.appendChild(el('span', 'sog-etiquette', session.titre));
    hote.appendChild(el('h2', null, 'Session terminée'));

    var g = el('div', 'sog-grille-chiffres');
    [[session.justes, 'justes'], [session.presque, 'presque'],
     [session.rates, 'ratées'], [session.faits, 'réponses']].forEach(function (p) {
      var c = el('div', 'sog-chiffre');
      c.appendChild(el('b', null, String(p[0])));
      c.appendChild(el('span', null, p[1]));
      g.appendChild(c);
    });
    hote.appendChild(g);

    /* Ce qui a été prouvé par écrit dans cette séance. C'est le seul chiffre
       qui dit quelque chose : le reste mesure l'activité, pas le savoir. */
    if (session.fiches || session.validees) {
      hote.appendChild(el('p', 'sog-bilan-fiches',
        session.fiches + ' fiche' + (session.fiches > 1 ? 's' : '') + ' écrite' +
        (session.fiches > 1 ? 's' : '') + ' juste' + (session.fiches > 1 ? 's' : '') +
        (session.validees
          ? ' · ' + session.validees + ' carte' + (session.validees > 1 ? 's' : '') +
            ' validée' + (session.validees > 1 ? 's' : '')
          : '')));
    }
    if (session.defi) {
      hote.appendChild(el('p', 'sog-sous',
        'Défi : les scores se comparent dans le salon, ta progression personnelle n’a pas bougé.'));
    }
    if (session.placement) {
      hote.appendChild(el('p', 'sog-sous',
        'Mode Placement : rien n’a bougé dans les boîtes, c’est l’emploi des références qui a été travaillé.'));
    }

    var restantes = dues().length;
    hote.appendChild(el('p', 'sog-sous', restantes
      ? restantes + ' carte(s) encore à revoir aujourd’hui.'
      : 'Plus rien à revoir aujourd’hui. Reviens demain.'));

    /* En défi, c'est le salon qui reprend la main : proposer « nouvelle
       session » enverrait le joueur réviser seul au milieu d'une partie. */
    if (session.surFin) {
      var rappel = session.surFin;
      var note = session.faits
        ? Math.round(100 * (session.justes + 0.5 * session.presque) / session.faits) : 0;
      var bilan = { note: note, justes: session.justes, presque: session.presque,
                    rates: session.rates, faits: session.faits, total: session.total };
      ecran('bilan');
      rappel(bilan, hote);
      return;
    }

    actions(hote, [
      { texte: 'Nouvelle session', action: function () { demarrer('jour'); } },
      { texte: 'Tableau de bord', fantome: true, action: ecranBord },
      { texte: 'Retour', fantome: true, action: ecranAccueil }
    ]);
    ecran('bilan');
  }

  function ecranRienAFaire(mode) {
    var hote = vide(q('#sog-bilan'));
    hote.appendChild(el('h2', null, 'Rien à réviser'));
    hote.appendChild(el('p', 'sog-sous', mode === 'erreurs'
      ? 'Aucune erreur enregistrée. Il n’y a rien à repasser — reviens quand tu en auras.'
      : mode === 'socle'
      ? 'Le document ne marque encore aucune date « à placer en dissertation ».'
      : mode === 'sujet' || mode === 'auteur'
      ? 'Aucune référence ne correspond.'
      : mode === 'valider'
      ? 'Aucune carte n’est prête pour la fiche écrite. Une carte y arrive quand ' +
        'elle a passé le QCM puis la saisie : fais d’abord une session du jour.'
      : mode === 'placement'
      ? 'Aucune carte ne porte assez de sujets pour cet exercice.'
      : 'Aucune carte n’est due aujourd’hui et le quota de nouvelles cartes est atteint.'));
    actions(hote, [
      { texte: 'Révision libre', action: function () { demarrer('libre', null, 'Révision libre'); } },
      { texte: 'Retour', fantome: true, action: ecranAccueil }
    ]);
    ecran('bilan');
  }

  /* ============================================================== écrans */
  var ECRANS = ['accueil', 'session', 'bilan', 'bord', 'fiches', 'methode', 'sujet', 'frise'];
  function ecran(nom) {
    ECRANS.forEach(function (n) {
      var s = q('#sog-ecran-' + n);
      if (s) s.hidden = (n !== nom);
    });
    global.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function actions(hote, boutons) {
    var r = el('div', 'sog-rangee');
    boutons.forEach(function (b) {
      var n = el('button', 'sog-btn' + (b.fantome ? ' sog-fantome' : ''), b.texte);
      n.type = 'button';
      n.addEventListener('click', b.action);
      r.appendChild(n);
    });
    hote.appendChild(r);
    return r;
  }

  /* ------------------------------------------------------------- accueil */
  function ecranAccueil() {
    var hote = vide(q('#sog-accueil'));

    var d = dues().length, f = faibles().length;
    var pretes = aValider().length;

    /* L'avis de reprise : il explique une seule fois pourquoi des cartes
       sont redescendues d'un étage le jour de la mise à jour. */
    var repris = lire('reprise-combien', 0);
    if (repris) {
      var avis = el('div', 'sog-avis');
      avis.appendChild(el('p', null,
        repris + ' carte' + (repris > 1 ? 's' : '') + ' étai' + (repris > 1 ? 'ent' : 't') +
        ' montée' + (repris > 1 ? 's' : '') + ' en boîte 4 ou 5 à l’auto-évaluation, ' +
        'quand il suffisait de se noter « je savais ». ' +
        'Elle' + (repris > 1 ? 's sont redescendues' : ' est redescendue') +
        ' en boîte 3, prête' + (repris > 1 ? 's' : '') + ' pour la fiche écrite. ' +
        'Rien n’est perdu : il reste à l’écrire une fois pour qu’elle compte comme validée.'));
      var vu = el('button', 'sog-btn sog-fantome sog-mini', 'J’ai compris');
      vu.type = 'button';
      vu.addEventListener('click', function () {
        ecrire('reprise-combien', 0);
        ecranAccueil();
      });
      avis.appendChild(vu);
      hote.appendChild(avis);
    }

    /* --------------------------------------------- comment ça marche
       Première chose sur la page tant que rien n'est acquis : personne ne
       peut suivre une progression dont il ne connaît pas la règle. Le bloc
       se replie de lui-même dès la première carte acquise, et se rouvre
       d'un clic. */
    var n5 = compter(cartes);
    var regle = el('details', 'sog-regle');
    if (!n5.acquises) regle.open = true;
    var som = el('summary', null, 'Comment marche la progression');
    regle.appendChild(som);
    var ul = el('ul', 'sog-puces');
    [
      'Une carte jamais vue : tu la lis d’abord, on ne t’interroge pas dessus.',
      'Boîte 1, elle revient en QCM. Boîte 2, tu écris la réponse.',
      'Boîtes 3 et 4, tu écris la fiche entière de mémoire : la date, l’auteur, ' +
        'l’œuvre, l’argument. C’est ça, valider.',
      'Deux fiches justes et la carte est acquise. Elle revient quand même en ' +
        'contrôle vingt jours plus tard.',
      'Une erreur, à n’importe quel étage, renvoie la carte en boîte 1 — et elle ' +
        'passe en tête de « mes erreurs », donc elle reviendra vite.',
      'Les délais doublent à chaque étage : 1, 2, 4, 8, puis 20 jours. C’est ce ' +
        'qui fait tenir une préparation sur des mois sans tout revoir chaque soir.'
    ].forEach(function (t) { ul.appendChild(el('li', null, t)); });
    regle.appendChild(ul);
    hote.appendChild(regle);

    var tete = el('div', 'sog-bloc-principal');
    tete.appendChild(el('span', 'sog-etiquette', 'Recommandé'));
    tete.appendChild(el('h2', null, 'Session du jour'));
    /* Les chiffres de l'accueil disent des états, pas un jugement. L'ancienne
       ligne annonçait « 0 point faible » à quelqu'un qui n'avait encore rien
       vu : exact, et parfaitement inutile. */
    var compteurs = [n5.acquises + ' acquise(s)', n5.route + ' commencée(s)',
                     n5.jamais + ' jamais vue(s)'];
    if (d) compteurs.unshift(d + ' à revoir aujourd’hui');
    if (f) compteurs.push(f + ' à repasser');
    tete.appendChild(el('p', 'sog-sous', compteurs.join(' · ')));
    actions(tete, [
      { texte: 'Commencer', action: function () { demarrer('jour'); } },
      { texte: 'Tableau de bord', fantome: true, action: ecranBord }
    ]);
    hote.appendChild(tete);

    /* Le bloc de validation ne s'affiche que quand il y a quelque chose à
       valider : proposer une épreuve vide le premier jour ne dirait rien. */
    if (pretes) {
      var bv = el('div', 'sog-bloc-valider');
      bv.appendChild(el('span', 'sog-etiquette', 'Validation écrite'));
      bv.appendChild(el('h2', null, pretes + ' carte' + (pretes > 1 ? 's' : '') +
                                    ' prête' + (pretes > 1 ? 's' : '') + ' pour la fiche'));
      bv.appendChild(el('p', 'sog-sous',
        'Tout écrire de mémoire : la date, l’auteur, l’œuvre, la définition. ' +
        'Deux fiches justes à plusieurs jours d’écart, et la carte est validée.'));
      actions(bv, [
        { texte: 'Passer les fiches', action: function () {
            demarrer('valider', null, 'Validation écrite'); } },
        { texte: 'Tableau de bord', fantome: true, action: ecranBord }
      ]);
      hote.appendChild(bv);
    }

    /* réglages de session */
    var reg = el('div', 'sog-reglages');
    reg.appendChild(el('span', 'sog-etiquette', 'Réglages'));
    reg.appendChild(segment('Cartes par session', [10, 20, 30], reglages.taille, function (v) {
      reglages.taille = v; ecrire('reglages', reglages);
    }));
    reg.appendChild(segment('Nouvelles par jour', [4, 8, 15], reglages.nouvellesMax, function (v) {
      reglages.nouvellesMax = v; ecrire('reglages', reglages);
    }));
    reg.appendChild(segment('Chrono 15 s (hors fiches)', ['Non', 'Oui'], reglages.chrono ? 'Oui' : 'Non', function (v) {
      reglages.chrono = (v === 'Oui'); ecrire('reglages', reglages);
    }));
    hote.appendChild(reg);

    /* les autres modes. Le socle n'apparaît que si le document en désigne un :
       une entrée « 0 date » n'apprendrait rien à personne. */
    var modes = el('div', 'sog-modes');
    var entrees = [
      ['Tableau de bord', 'où j’en suis, et par quoi continuer', ecranBord],
      ['Mes erreurs', f ? f + ' carte(s) à repasser' : 'rien à repasser',
        function () { demarrer('erreurs', null, 'Mes erreurs'); }]
    ];
    if (socle().length) {
      entrees.push(['Le socle', socle().length + ' dates à placer en dissertation',
        function () { demarrer('socle', null, 'Le socle'); }]);
    }
    entrees = entrees.concat([
      ['Par catégorie', 'dates, citations, auteurs…', choisirType],
      ['Par thème', '12 thèmes', choisirTheme],
      ['Placement', 'trouver la référence d’un sujet',
        function () { demarrer('placement', null, 'Placement'); }],
      ['Frise chronologique', 'remettre dans l’ordre', ecranFrise],
      ['Mode Sujet', '3 minutes de brouillon', ecranSujet],
      ['Mes fiches', 'lecture et recherche', ecranFiches],
      ['Méthode', 'les règles du document', ecranMethode]
    ]);
    entrees.forEach(function (m) {
      var b = el('button', 'sog-carte');
      b.type = 'button';
      b.appendChild(el('b', null, m[0]));
      b.appendChild(el('span', null, m[1]));
      b.addEventListener('click', m[2]);
      modes.appendChild(b);
    });
    hote.appendChild(modes);

    /* remise à zéro */
    var bas = el('div', 'sog-bas');
    var raz = el('button', 'sog-btn sog-fantome sog-mini', 'Réinitialiser ma progression Culture SOG');
    raz.type = 'button';
    raz.addEventListener('click', function () {
      if (!global.confirm('Effacer toute la progression Culture SOG ?\n\n' +
          'Les boîtes, l’historique et les réglages de ce module seront perdus.\n' +
          'Le quiz et les épreuves cognitives ne sont pas touchés.')) return;
      var n = toutEffacer();
      progres = {}; reglages = Object.assign({}, REGLAGES_PAR_DEFAUT);
      global.alert(n + ' clé(s) effacée(s). Progression Culture SOG remise à zéro.');
      ecranAccueil();
    });
    bas.appendChild(raz);
    hote.appendChild(bas);

    ecran('accueil');
  }

  function segment(titre, valeurs, courante, surChoix) {
    var b = el('div', 'sog-segment-bloc');
    b.appendChild(el('span', 'sog-segment-titre', titre));
    var s = el('div', 'sog-segment');
    valeurs.forEach(function (v) {
      var n = el('button', null, String(v));
      n.type = 'button';
      n.setAttribute('aria-pressed', String(v) === String(courante));
      n.addEventListener('click', function () {
        Array.prototype.forEach.call(s.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
        n.setAttribute('aria-pressed', 'true');
        surChoix(v);
      });
      s.appendChild(n);
    });
    b.appendChild(s);
    return b;
  }

  function listeChoix(titre, entrees, surChoix) {
    var hote = vide(q('#sog-bilan'));
    hote.appendChild(el('h2', null, titre));
    var l = el('div', 'sog-modes');
    entrees.forEach(function (e) {
      var b = el('button', 'sog-carte');
      b.type = 'button';
      b.appendChild(el('b', null, e[0]));
      b.appendChild(el('span', null, e[1]));
      b.addEventListener('click', function () { surChoix(e[2]); });
      l.appendChild(b);
    });
    hote.appendChild(l);
    actions(hote, [{ texte: 'Retour', fantome: true, action: ecranAccueil }]);
    ecran('bilan');
  }

  function themes() {
    var vus = [];
    cartes.forEach(function (c) { if (vus.indexOf(c.theme) < 0) vus.push(c.theme); });
    return vus.sort();
  }

  function choisirTheme() {
    listeChoix('Par thème', themes().map(function (t) {
      var n = cartes.filter(function (c) { return c.theme === t; }).length;
      var s = validees().filter(function (c) { return c.theme === t; }).length;
      return [t, n + ' cartes · ' + s + ' solides', t];
    }), function (t) { demarrer('theme', t, t); });
  }

  /* Les catégories viennent du module de validation : une seule liste pour
     l'écran de progression et pour le choix d'une session. */
  function choisirType() {
    var entrees = V.CATEGORIES.map(function (cat) {
      var n = cartesDe(cat.type).length;
      var v = cartesDe(cat.type).filter(function (c) { return etat(c.id).boite >= 5; }).length;
      return [cat.nom, v + ' validée(s) sur ' + n, cat.type];
    });
    entrees.push(['Citations attribuées',
                  cartes.filter(function (c) { return c.attribuee; }).length + ' cartes',
                  'attribuee']);
    listeChoix('Par catégorie', entrees, function (t) {
      demarrer('type', t, 'Par catégorie');
    });
  }

  function cartesDe(type) {
    return cartes.filter(function (c) { return c.type === type; });
  }

  /* ----------------------------------------------------- Ma progression */
  /* =========================================================== tableau de bord
     Une seule page pour répondre à « où j'en suis et par quoi je continue ».
     Elle est faite de blocs qui disent tous la même chose sous un angle
     différent : par état, par erreur, par catégorie, par sujet de
     dissertation, par auteur, par thème.

     Règle de l'écran : aucune ligne n'est un cul-de-sac. Chaque bloc se
     termine par un bouton qui lance exactement la session dont il parle,
     sinon ce n'est pas un tableau de bord, c'est un bulletin. */
  function ecranBord() {
    var hote = vide(q('#sog-bord'));
    hote.appendChild(el('h2', null, 'Tableau de bord'));
    hote.appendChild(el('p', 'sog-sous',
      'Tout part d’une seule règle : une référence est acquise quand tu sais ' +
      'l’écrire de mémoire, deux fois, à plusieurs jours d’écart. Le reste de ' +
      'cette page dit ce qui l’est, ce qui ne l’est pas, et par quoi commencer.'));

    sommaire(hote, [
      ['etats', 'Où j’en suis'],
      ['erreurs', 'Mes erreurs'],
      ['cats', 'Par catégorie'],
      ['sujets', 'Par sujet'],
      ['auteurs', 'Par auteur'],
      ['themes', 'Par thème']
    ]);

    peindreEtats(hote);
    peindreErreurs(hote);
    peindreCategories(hote);
    peindreSujets(hote);
    peindreAuteurs(hote);
    peindreGrille(hote);
    peindreCourbe(hote);

    actions(hote, [
      { texte: 'Session du jour', action: function () { demarrer('jour'); } },
      { texte: 'Retour', fantome: true, action: ecranAccueil }
    ]);
    ecran('bord');
  }

  /* Une rangée de pastilles qui mènent aux blocs. La page est longue par
     nature — elle couvre six angles — et une table des matières coûte moins
     cher que de la raccourcir en cachant des chiffres. */
  function sommaire(hote, entrees) {
    var r = el('nav', 'sog-sommaire');
    r.setAttribute('aria-label', 'Sections du tableau de bord');
    entrees.forEach(function (e) {
      var b = el('button', null, e[1]);
      b.type = 'button';
      b.addEventListener('click', function () {
        var cible = q('#sog-bloc-' + e[0]);
        if (cible) cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      r.appendChild(b);
    });
    hote.appendChild(r);
  }

  /* Les listes longues s'arrêtent à ce qui tient à l'écran et disent combien
     elles cachent. Soixante-huit sujets déroulés d'un coup font une page de
     dix-huit mille pixels, que personne ne lit jusqu'en bas. Rien n'est
     supprimé pour autant : le bouton annonce le nombre exact. */
  function plier(hote, noeuds, visibles, motAutres) {
    if (noeuds.length <= visibles) return;
    noeuds.forEach(function (n, i) { if (i >= visibles) n.hidden = true; });
    var b = el('button', 'sog-btn sog-mini sog-fantome',
      'Afficher les ' + (noeuds.length - visibles) + ' ' + motAutres);
    b.type = 'button';
    b.addEventListener('click', function () {
      noeuds.forEach(function (n) { n.hidden = false; });
      b.parentNode.remove();
    });
    var r = el('div', 'sog-rangee');
    r.appendChild(b);
    hote.appendChild(r);
  }

  function bloc(hote, id, titre, sous) {
    var b = el('div', 'sog-bloc-bord');
    b.id = 'sog-bloc-' + id;
    b.appendChild(el('span', 'sog-etiquette', titre));
    if (sous) b.appendChild(el('p', 'sog-sous', sous));
    hote.appendChild(b);
    return b;
  }

  /* Une barre en cinq parts, la même partout : jamais vue, commencée, prête,
     validée, confirmée. Lue une fois, elle se lit partout. */
  function barreEtats(n) {
    var piste = el('div', 'sog-cat-piste');
    [['sog-part-confirmee', n.confirmee], ['sog-part-valide', n.validee],
     ['sog-part-prete', n.prete], ['sog-part-route', n.route]].forEach(function (p) {
      if (!p[1] || !n.total) return;
      var i = el('i', p[0]);
      i.style.width = (p[1] / n.total * 100) + '%';
      piste.appendChild(i);
    });
    return piste;
  }
  function motsEtats(n) {
    var bouts = [];
    if (n.confirmee) bouts.push(n.confirmee + ' confirmée' + (n.confirmee > 1 ? 's' : ''));
    if (n.validee) bouts.push(n.validee + ' validée' + (n.validee > 1 ? 's' : ''));
    if (n.prete) bouts.push(n.prete + ' prête' + (n.prete > 1 ? 's' : '') + ' pour la fiche');
    if (n.route) bouts.push(n.route + ' commencée' + (n.route > 1 ? 's' : ''));
    if (n.jamais) bouts.push(n.jamais + ' jamais vue' + (n.jamais > 1 ? 's' : ''));
    return bouts.join(' · ');
  }

  /* ------------------------------------------------------------ où j'en suis */
  function peindreEtats(hote) {
    var n = compter(cartes);
    var b = bloc(hote, 'etats', 'Où j’en suis',
      'Les cinq états d’une référence. Une carte monte d’un cran à chaque ' +
      'bonne réponse et retombe à « commencée » dès qu’on la rate.');

    var g = el('div', 'sog-grille-chiffres');
    [[n.jamais, 'jamais vues'], [n.route, 'commencées'], [n.prete, 'prêtes pour la fiche'],
     [n.validee + n.confirmee, 'acquises'], [serie(), 'jours d’affilée']].forEach(function (p) {
      var c = el('div', 'sog-chiffre');
      c.appendChild(el('b', null, String(p[0])));
      c.appendChild(el('span', null, p[1]));
      g.appendChild(c);
    });
    b.appendChild(g);
    b.appendChild(barreEtats(n));

    var duJour = dues().length;
    b.appendChild(el('p', 'sog-cat-chiffres',
      duJour ? duJour + ' carte(s) arrivent à échéance aujourd’hui.'
             : 'Rien n’arrive à échéance aujourd’hui : la suite, ce sont des cartes neuves.'));

    /* Le socle : ce que le document dit indispensable. */
    var noyau = socle();
    if (noyau.length) {
      var ns = compter(noyau);
      b.appendChild(el('p', 'sog-cat-chiffres',
        'Socle du concours — les dates à placer en dissertation : ' +
        ns.acquises + ' acquise(s) sur ' + ns.total + '.'));
    }

    var boutons = [{ texte: 'Session du jour', action: function () { demarrer('jour'); } }];
    if (noyau.length) {
      boutons.push({ texte: 'Travailler le socle', fantome: true, action: function () {
        demarrer('socle', null, 'Le socle');
      } });
    }
    actions(b, boutons);
  }

  /* --------------------------------------------------------------- mes erreurs
     Le bloc que l'ancien « 0 point faible » remplaçait par rien. */
  function peindreErreurs(hote) {
    var rates = faibles();
    var b = bloc(hote, 'erreurs', 'Mes erreurs',
      'Ce que tu rates revient plus souvent, et d’abord ce que tu rates le plus. ' +
      'Une carte sort de cette liste le jour où elle est validée.');

    if (!rates.length) {
      var vus = cartes.filter(function (c) { return etat(c.id).vues > 0; }).length;
      b.appendChild(el('p', 'sog-sous', vus
        ? 'Aucune erreur enregistrée sur les ' + vus + ' cartes déjà vues. ' +
          'Rien à repasser pour l’instant.'
        : 'Rien encore : tu n’as pas commencé. La liste se remplira toute seule, ' +
          'et c’est elle qui vaudra le plus de points.'));
      return;
    }

    b.appendChild(el('p', 'sog-cat-chiffres',
      rates.length + ' carte(s) à repasser, ' +
      rates.reduce(function (n, c) { return n + etat(c.id).erreurs; }, 0) + ' erreurs en tout.'));

    var l = el('div', 'sog-liste');
    rates.slice(0, 12).forEach(function (c) {
      var r = el('div', 'sog-ligne');
      r.appendChild(el('span', 'sog-pastille sog-' + c.type, c.type));
      r.appendChild(el('span', 'sog-ligne-txt', c.contenu.cle || c.contenu.question));
      var n = etat(c.id).erreurs;
      r.appendChild(el('span', 'sog-ligne-val', n + (n > 1 ? ' erreurs' : ' erreur')));
      l.appendChild(r);
    });
    if (rates.length > 12) {
      l.appendChild(el('p', 'sog-sous', 'et ' + (rates.length - 12) + ' autre(s).'));
    }
    b.appendChild(l);
    actions(b, [{ texte: 'Reprendre mes erreurs', action: function () {
      demarrer('erreurs', null, 'Mes erreurs');
    } }]);
  }

  /* ------------------------------------------- les paliers par catégorie */
  function peindreCategories(hote) {
    var b = bloc(hote, 'cats', 'Par catégorie',
      'Six familles de références. Le palier se calcule sur la part de la ' +
      'famille que tu as acquise ; le compte brut est toujours à côté.');

    V.CATEGORIES.forEach(function (cat) {
      var lot = cartesDe(cat.type);
      if (!lot.length) return;
      var n = compter(lot);
      var p = V.palier(n.acquises, n.total);

      var ligne = el('div', 'sog-cat');
      var tete = el('div', 'sog-cat-tete');
      tete.appendChild(el('b', null, cat.nom + ' · ' + n.total));
      tete.appendChild(el('span', 'sog-cat-palier',
        'Palier ' + p.rang + '/' + p.haut + ' · ' + p.nom));
      ligne.appendChild(tete);
      ligne.appendChild(el('p', 'sog-cat-quoi', 'À écrire de mémoire : ' + cat.ecrire + '.'));
      ligne.appendChild(barreEtats(n));

      var dit = motsEtats(n);
      var noyau = lot.filter(function (c) { return c.priorite; });
      if (noyau.length) {
        dit += ' · socle : ' + compter(noyau).acquises + '/' + noyau.length;
      }
      if (p.suivant) dit += ' · encore ' + p.suivant.manque + ' pour « ' + p.suivant.nom + ' »';
      ligne.appendChild(el('p', 'sog-cat-chiffres', dit));

      var boutons = [];
      if (n.prete) {
        boutons.push({ texte: 'Valider', action: function () {
          demarrer('valider', cat.type, 'Validation · ' + cat.nom);
        } });
      }
      boutons.push({ texte: 'Réviser', fantome: !!n.prete, action: function () {
        demarrer('type', cat.type, cat.nom);
      } });
      actions(ligne, boutons);
      b.appendChild(ligne);
    });
  }

  /* --------------------------------------------- par sujet de dissertation
     C'est la vue qui sert la veille d'un concours : « sur un sujet Travail,
     qu'est-ce que j'ai sous la main, et qu'est-ce que je sais vraiment ? » */
  function peindreSujets(hote) {
    var liste = sujets(3);
    var b = bloc(hote, 'sujets', 'Par sujet de dissertation',
      'Les ' + liste.length + ' sujets portés par au moins trois références du ' +
      'document. Le détail dit de quoi ton arsenal est fait : des dates sans ' +
      'citation, ou l’inverse, c’est une copie bancale.');

    var corps = el('div', 'sog-sujets');
    liste.forEach(function (s) {
      var ligne = el('div', 'sog-sujet');
      var tete = el('div', 'sog-cat-tete');
      tete.appendChild(el('b', null, s.nom));
      tete.appendChild(el('span', 'sog-cat-palier',
        s.compte.acquises + ' / ' + s.compte.total + ' acquises'));
      ligne.appendChild(tete);

      /* le détail par type : c'est là qu'on voit ce qui manque */
      var detail = V.CATEGORIES.map(function (cat) {
        var n = s.cartes.filter(function (c) { return c.type === cat.type; }).length;
        return n ? n + ' ' + (n > 1 ? pluriel(cat) : singulier(cat)) : null;
      }).filter(Boolean).join(' · ');
      ligne.appendChild(el('p', 'sog-cat-quoi', detail));
      ligne.appendChild(barreEtats(s.compte));

      var bouton = el('button', 'sog-btn sog-mini sog-fantome', 'Réviser ce sujet');
      bouton.type = 'button';
      bouton.addEventListener('click', function () {
        demarrer('sujet', s.cle, 'Sujet · ' + s.nom);
      });
      var r = el('div', 'sog-rangee');
      r.appendChild(bouton);
      ligne.appendChild(r);
      corps.appendChild(ligne);
    });
    b.appendChild(corps);
    plier(b, Array.prototype.slice.call(corps.children), 12, 'autres sujets');
  }

  function singulier(cat) {
    return { date: 'date', citation: 'citation', penseur: 'auteur',
             notion: 'notion', repere: 'repère', chiffre: 'chiffre' }[cat.type] || cat.type;
  }
  function pluriel(cat) { return singulier(cat) + 's'; }

  /* ------------------------------------------------------------ par auteur
     « Au moins une référence par auteur » : un auteur dont on ne sait rien
     est un auteur qu'on ne citera pas. Ils passent donc en tête. */
  function peindreAuteurs(hote) {
    var liste = auteurs();
    var inconnus = liste.filter(function (a) { return !a.compte.acquises; }).length;
    var b = bloc(hote, 'auteurs', 'Par auteur',
      liste.length + ' auteurs dans le document. L’objectif est d’en avoir au moins ' +
      'une référence solide pour chacun : un auteur dont tu ne sais rien est un ' +
      'auteur que tu ne citeras pas.' +
      (inconnus ? ' Il t’en reste ' + inconnus + ' dans ce cas, en tête de liste.' : ''));

    var corps = el('div', 'sog-auteurs');
    liste.forEach(function (a) {
      var ligne = el('button', 'sog-auteur' + (a.compte.acquises ? '' : ' sog-auteur-vide'));
      ligne.type = 'button';
      ligne.appendChild(el('b', null, a.nom));
      ligne.appendChild(el('span', null,
        a.cartes.length + ' référence' + (a.cartes.length > 1 ? 's' : '') +
        ' · ' + (a.compte.acquises ? a.compte.acquises + ' acquise' + (a.compte.acquises > 1 ? 's' : '')
                                   : 'aucune acquise')));
      ligne.addEventListener('click', function () {
        demarrer('auteur', a.cle, 'Auteur · ' + a.nom);
      });
      corps.appendChild(ligne);
    });
    b.appendChild(corps);
    plier(b, Array.prototype.slice.call(corps.children), 18, 'autres auteurs');
  }

  /* ------------------------------------- la grille thème × catégorie
     Une case vide dit quoi travailler ce soir. La dernière colonne reprend
     l'objectif du document : 5 à 8 références solides par thème. */
  function peindreGrille(hote) {
    var b = bloc(hote, 'themes', 'Par thème',
      'Chaque case : acquises sur total. La dernière colonne est l’objectif du ' +
      'document, 5 à 8 références solides par thème.');

    var cadre = el('div', 'sog-table-cadre');
    var table = el('table', 'sog-table');
    var thead = el('thead');
    var hr = el('tr');
    hr.appendChild(el('th', 'sog-th-theme', 'Thème'));
    V.CATEGORIES.forEach(function (cat) { hr.appendChild(el('th', null, cat.court)); });
    hr.appendChild(el('th', 'sog-th-obj', 'Objectif'));
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el('tbody');
    themes().forEach(function (t) {
      var duTheme = cartes.filter(function (c) { return c.theme === t; });
      var tr = el('tr');
      var th = el('th', 'sog-th-theme');
      var lien = el('button', 'sog-lien-theme', t);
      lien.type = 'button';
      lien.addEventListener('click', function () { demarrer('theme', t, t); });
      th.appendChild(lien);
      tr.appendChild(th);

      V.CATEGORIES.forEach(function (cat) {
        var lot = duTheme.filter(function (c) { return c.type === cat.type; });
        var v = compter(lot).acquises;
        var td = el('td');
        if (!lot.length) {
          td.className = 'sog-c-vide';
          td.textContent = '—';
          td.setAttribute('aria-label', 'aucune carte');
        } else {
          td.className = v === lot.length ? 'sog-c-plein' : v ? 'sog-c-part' : 'sog-c-zero';
          td.appendChild(el('b', null, String(v)));
          td.appendChild(el('span', null, '/' + lot.length));
          td.setAttribute('aria-label', v + ' acquise(s) sur ' + lot.length +
                                        ' — ' + cat.nom + ', ' + t);
        }
        tr.appendChild(td);
      });

      var vTheme = compter(duTheme).acquises;
      var objectif = Math.min(8, duTheme.length);
      var tdo = el('td', vTheme >= objectif ? 'sog-c-plein' : vTheme ? 'sog-c-part' : 'sog-c-zero');
      tdo.appendChild(el('b', null, String(vTheme)));
      tdo.appendChild(el('span', null, '/' + objectif));
      tr.appendChild(tdo);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    cadre.appendChild(table);
    b.appendChild(cadre);
  }

  /* ------------------------------------------------------- la courbe */
  function peindreCourbe(hote) {
    var cadre = el('div', 'sog-courbe');
    cadre.appendChild(el('span', 'sog-etiquette', 'Cartes acquises, 30 derniers jours'));
    var toile = el('canvas');
    toile.width = 900; toile.height = 220;
    cadre.appendChild(toile);
    hote.appendChild(cadre);
    dessinerCourbe(toile);
    /* Le compteur a changé de sens le jour de la validation écrite : avant, il
       comptait aussi les cartes auto-évaluées. */
    cadre.appendChild(el('p', 'sog-sous',
      'Avant la validation écrite, ce compteur incluait les cartes auto-évaluées. ' +
      'Une marche descendante vient de ce changement de mesure, pas d’un oubli.'));
  }

  function dessinerCourbe(toile) {
    var ctx = toile.getContext('2d');
    var L = toile.width, H = toile.height, m = 28;
    var css = getComputedStyle(document.documentElement);
    var trait = (css.getPropertyValue('--tz-ac') || '#F5A623').trim();
    var faible = (css.getPropertyValue('--tz-bord') || '#ECE0D2').trim();
    var texte = (css.getPropertyValue('--tz-txt-2') || '#857D95').trim();

    var j = journal(), pts = [], dernier = 0;
    for (var k = 29; k >= 0; k--) {
      var d = jourPlus(-k);
      if (j[d] && typeof j[d].maitrisees === 'number') dernier = j[d].maitrisees;
      pts.push(dernier);
    }
    var max = Math.max(8, Math.max.apply(null, pts));

    ctx.clearRect(0, 0, L, H);
    ctx.strokeStyle = faible; ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var y = m + (H - 2 * m) * g / 4;
      ctx.beginPath(); ctx.moveTo(m, y); ctx.lineTo(L - m, y); ctx.stroke();
    }
    ctx.fillStyle = texte; ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(String(max), 4, m + 4);
    ctx.fillText('0', 4, H - m + 4);

    ctx.strokeStyle = trait; ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round'; ctx.beginPath();
    pts.forEach(function (v, i) {
      var x = m + (L - 2 * m) * i / (pts.length - 1);
      var y = H - m - (H - 2 * m) * (v / max);
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = texte;
    ctx.fillText('il y a 30 jours', m, H - 6);
    ctx.fillText('aujourd’hui', L - m - 80, H - 6);
  }

  /* ---------------------------------------------------------- les fiches */
  function ecranFiches() {
    var hote = vide(q('#sog-fiches'));
    hote.appendChild(el('h2', null, 'Fiches'));
    hote.appendChild(el('p', 'sog-sous', 'Lecture seule : rien n’est compté ici.'));

    var barreF = el('div', 'sog-filtres');
    var recherche = el('input', 'sog-saisie');
    recherche.type = 'search';
    recherche.placeholder = 'Rechercher…';
    barreF.appendChild(recherche);

    var selTheme = el('select', 'sog-select');
    selTheme.appendChild(new Option('Tous les thèmes', ''));
    themes().forEach(function (t) { selTheme.appendChild(new Option(t, t)); });
    barreF.appendChild(selTheme);

    var selType = el('select', 'sog-select');
    selType.appendChild(new Option('Tous les types', ''));
    ['date', 'citation', 'notion', 'chiffre', 'repere'].forEach(function (t) {
      selType.appendChild(new Option(t, t));
    });
    barreF.appendChild(selType);
    hote.appendChild(barreF);

    var liste = el('div', 'sog-liste');
    hote.appendChild(liste);

    function peindre() {
      var r = normaliser(recherche.value);
      var t = selTheme.value, ty = selType.value;
      var vus = cartes.filter(function (c) {
        if (t && c.theme !== t) return false;
        if (ty && c.type !== ty) return false;
        if (!r) return true;
        return normaliser(c.contenu.question + ' ' + c.contenu.reponse + ' ' + c.tags.join(' ')).indexOf(r) >= 0;
      });
      vide(liste);
      liste.appendChild(el('span', 'sog-etiquette', vus.length + ' carte(s)'));
      vus.slice(0, 300).forEach(function (c) {
        var f = el('div', 'sog-fiche');
        var h = el('div', 'sog-haut');
        h.appendChild(el('span', 'sog-pastille sog-' + c.type, c.type));
        h.appendChild(el('span', 'sog-theme', c.theme));
        h.appendChild(el('span', 'sog-boite', 'boîte ' + (etat(c.id).boite || 0)));
        f.appendChild(h);
        f.appendChild(el('p', 'sog-fiche-q', c.contenu.question));
        f.appendChild(el('p', 'sog-fiche-r', c.contenu.reponse));
        if (c.priorite) h.appendChild(el('span', 'sog-cle', 'à connaître'));
        if (c.attribuee) f.appendChild(el('p', 'sog-avertit', 'Formule attribuée.'));
        if (c.volatile) f.appendChild(el('p', 'sog-avertit', 'Ordre de grandeur, à vérifier dans l’actu.'));
        if (c.tags.length) f.appendChild(el('p', 'sog-tags', 'À placer dans : ' + c.tags.join(', ')));
        liste.appendChild(f);
      });
      if (vus.length > 300) liste.appendChild(el('p', 'sog-sous', 'Affichage limité à 300 fiches ; affine la recherche.'));
    }
    recherche.addEventListener('input', peindre);
    selTheme.addEventListener('change', peindre);
    selType.addEventListener('change', peindre);
    peindre();

    actions(hote, [{ texte: 'Retour', fantome: true, action: ecranAccueil }]);
    ecran('fiches');
  }

  /* --------------------------------------------------------- la méthode */
  function ecranMethode() {
    var m = (DATA && DATA.methode) || { regles: [], orCitations: [], reflexe: [] };
    var hote = vide(q('#sog-methode'));
    hote.appendChild(el('h2', null, 'Méthode'));
    hote.appendChild(el('p', 'sog-sous', 'Repris tel quel du document.'));

    function bloc(titre, items, ordonne) {
      if (!items.length) return;
      var b = el('div', 'sog-bloc');
      b.appendChild(el('span', 'sog-etiquette', titre));
      var l = el(ordonne ? 'ol' : 'ul', 'sog-puces');
      items.forEach(function (t) { l.appendChild(el('li', null, t)); });
      b.appendChild(l);
      hote.appendChild(b);
    }
    bloc('Les 4 règles pour placer une référence', m.regles, true);
    bloc('Les règles d’or sur les citations', m.orCitations, false);
    bloc('Le réflexe final', m.reflexe, false);

    actions(hote, [{ texte: 'Retour', fantome: true, action: ecranAccueil }]);
    ecran('methode');
  }

  /* -------------------------------------------------------- le Mode Sujet */
  function tagsFrequents(mini) {
    var compte = {};
    cartes.forEach(function (c) {
      c.tags.forEach(function (t) {
        var k = normaliser(t);
        if (!k) return;
        compte[k] = compte[k] || { nom: t, n: 0 };
        compte[k].n++;
      });
    });
    return Object.keys(compte).map(function (k) { return compte[k]; })
      .filter(function (x) { return x.n >= (mini || 4); })
      .sort(function (a, b) { return b.n - a.n; });
  }

  function ecranSujet() {
    var choix = tagsFrequents(4);
    if (!choix.length) { ecranAccueil(); return; }
    var sujet = choix[Math.floor(Math.random() * Math.min(choix.length, 25))];

    var hote = vide(q('#sog-sujet'));
    hote.appendChild(el('span', 'sog-etiquette', 'Mode Sujet'));
    hote.appendChild(el('h2', null, sujet.nom));
    hote.appendChild(el('p', 'sog-sous',
      'Trois minutes pour noter les références que tu placerais. Aucune n’est comptée : ' +
      'c’est le brouillon d’une copie.'));

    var compteur = el('div', 'sog-compteur', '3:00');
    hote.appendChild(compteur);

    var zone = el('textarea', 'sog-brouillon');
    zone.rows = 10;
    zone.placeholder = 'Une référence par ligne : date, citation, notion, chiffre…';
    hote.appendChild(zone);

    var fini = false;
    var reste = 180;
    var minuteur = setInterval(function () {
      reste--;
      compteur.textContent = Math.floor(reste / 60) + ':' + ('0' + (reste % 60)).slice(-2);
      if (reste <= 0) { clearInterval(minuteur); devoiler(); }
    }, 1000);

    function devoiler() {
      if (fini) return;
      fini = true;
      clearInterval(minuteur);
      var lot = cartes.filter(function (c) {
        return c.tags.some(function (t) { return normaliser(t) === normaliser(sujet.nom); });
      });
      var res = vide(q('#sog-sujet-res'));
      res.hidden = false;
      res.appendChild(el('span', 'sog-etiquette', lot.length + ' référence(s) pour « ' + sujet.nom + ' »'));
      res.appendChild(el('p', 'sog-sous', 'Coche celles auxquelles tu avais pensé.'));

      ['date', 'citation', 'notion', 'chiffre', 'repere'].forEach(function (ty) {
        var g = lot.filter(function (c) { return c.type === ty; });
        if (!g.length) return;
        var b = el('div', 'sog-bloc');
        b.appendChild(el('span', 'sog-etiquette', ty + ' · ' + g.length));
        g.forEach(function (c) {
          var l = el('label', 'sog-coche');
          var i = el('input');
          i.type = 'checkbox';
          l.appendChild(i);
          l.appendChild(el('span', null, c.contenu.question + ' — ' + c.contenu.reponse));
          b.appendChild(l);
        });
        res.appendChild(b);
      });
      actions(res, [
        { texte: 'Un autre sujet', action: ecranSujet },
        { texte: 'Retour', fantome: true, action: ecranAccueil }
      ]);
    }

    actions(hote, [
      { texte: 'J’ai fini, montrer les références', action: devoiler },
      { texte: 'Retour', fantome: true, action: function () { clearInterval(minuteur); ecranAccueil(); } }
    ]);
    var res = q('#sog-sujet-res');
    vide(res).hidden = true;
    ecran('sujet');
  }

  /* ------------------------------------------------------------ la frise */
  function ecranFrise() {
    var datables = cartes.filter(function (c) {
      return c.contenu.annee && (c.type === 'date' || c.type === 'repere');
    });
    if (datables.length < 6) { ecranAccueil(); return; }

    var nb = 4 + Math.floor(Math.random() * 3);
    var lot = [], vusAnnees = {};
    melanger(datables).some(function (c) {
      if (vusAnnees[c.contenu.annee]) return false;   /* deux fois la même année : insoluble */
      vusAnnees[c.contenu.annee] = 1;
      lot.push(c);
      return lot.length >= nb;
    });
    var ordre = lot.slice().sort(function (a, b) { return a.contenu.annee - b.contenu.annee; });

    var hote = vide(q('#sog-frise'));
    hote.appendChild(el('span', 'sog-etiquette', 'Frise chronologique'));
    hote.appendChild(el('h2', null, 'Du plus ancien au plus récent'));
    hote.appendChild(el('p', 'sog-sous', 'Clique les événements dans l’ordre. ' + nb + ' à replacer.'));

    var choisis = [];
    var pose = el('div', 'sog-frise-pose');
    hote.appendChild(pose);
    var banc = el('div', 'sog-frise-banc');
    hote.appendChild(banc);

    melanger(lot).forEach(function (c) {
      var b = el('button', 'sog-frise-item');
      b.type = 'button';
      b.textContent = c.contenu.valeur || c.contenu.question;
      b.addEventListener('click', function () {
        if (b.disabled) return;
        b.disabled = true;
        choisis.push(c);
        var p = el('div', 'sog-frise-place');
        p.appendChild(el('span', 'sog-frise-rang', String(choisis.length)));
        p.appendChild(el('span', null, b.textContent));
        pose.appendChild(p);
        if (choisis.length === lot.length) corriger();
      });
      banc.appendChild(b);
    });

    function corriger() {
      var justes = 0;
      Array.prototype.forEach.call(pose.children, function (p, i) {
        var ok = choisis[i].id === ordre[i].id;
        if (ok) justes++;
        p.className = 'sog-frise-place ' + (ok ? 'sog-ok' : 'sog-ko');
        p.appendChild(el('span', 'sog-frise-an', String(choisis[i].contenu.annee)));
      });
      var bilan = el('div', 'sog-correction');
      bilan.appendChild(el('div', 'sog-bonne', justes + ' / ' + lot.length + ' bien placés'));
      var l = el('ol', 'sog-puces');
      ordre.forEach(function (c) {
        l.appendChild(el('li', null, c.contenu.annee + ' — ' + (c.contenu.valeur || c.contenu.question)));
      });
      bilan.appendChild(l);
      hote.appendChild(bilan);
      actions(hote, [
        { texte: 'Une autre frise', action: ecranFrise },
        { texte: 'Retour', fantome: true, action: ecranAccueil }
      ]);
    }

    actions(hote, [{ texte: 'Retour', fantome: true, action: ecranAccueil }]);
    ecran('frise');
  }

  /* ============================================================= clavier */
  document.addEventListener('keydown', function (ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var ecranSession = q('#sog-ecran-session');
    if (!ecranSession || ecranSession.hidden) return;
    var cible = ev.target;
    var dansChamp = cible && (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA');

    if (session && session.clavier && session.clavier(ev)) { ev.preventDefault(); return; }
    if (ev.key === 'Enter' && !dansChamp) {
      var suite = q('#sog-scene .sog-suite');
      if (suite) { suite.click(); ev.preventDefault(); }
    }
  });

  /* ============================================================ démarrage */
  function demarrage() {
    if (!DATA || !cartes.length) {
      var h = q('#sog-accueil');
      if (h) {
        vide(h).appendChild(el('h2', null, 'Données absentes'));
        h.appendChild(el('p', 'sog-sous',
          'training/tz-sog-data.js est introuvable ou vide. Lance : node scripts/build-sog-data.js'));
      }
      return;
    }
    var q2 = q('#sog-quitter');
    if (q2) q2.addEventListener('click', function () {
      if (global.confirm('Abandonner la session en cours ?')) ecranAccueil();
    });
    ecranAccueil();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrage);
  } else { demarrage(); }

  /* ========================================================= API multijoueur
     Le strict nécessaire pour qu'un salon puisse faire réviser les mêmes
     cartes à tout le monde. Rien d'autre n'est exposé : la révision espacée,
     le journal et les réglages restent privés et personnels.

     Un défi ne touche à aucune boîte, désormais pour de bon : il impose la
     même question à tout le monde, donc un format qui ne tient pas compte de
     l'étage où chacun en est. Le compter serait faire monter ou tomber des
     cartes sur un exercice qui n'était pas le leur. */
  global.TZ_SOG = {
    nbCartes: function () { return cartes.length; },

    /* Les cartes d'un défi : tirées au hasard, mais sous graine commune, donc
       identiques chez tous les joueurs. On passe par le melanger du module
       pour que l'ordre le soit aussi. */
    lotDefi: function (taille) {
      return melanger(cartes).slice(0, Math.max(1, Math.min(taille, cartes.length)))
        .map(function (c) { return c.id; });
    },

    lancerDefi: function (ids, titre, surFin) {
      var parIdentifiant = {};
      cartes.forEach(function (c) { parIdentifiant[c.id] = c; });
      var lot = (ids || []).map(function (id) { return parIdentifiant[id]; })
                           .filter(Boolean);
      if (!lot.length) return false;
      /* Tout le monde la même question, et rien d'écrit dans les boîtes.
         Sans format imposé, le salon aurait posé un QCM à l'un, une fiche de
         quatre champs à l'autre et une simple lecture au troisième, selon
         l'étage où chacun en est : ce n'est pas une course comparable. Le QCM
         est le format d'une course ; la validation, elle, se joue en solo. */
      lancerLot(lot, titre || 'Défi', surFin, { defi: true, format: 'qcm' });
      return true;
    },

    accueil: ecranAccueil
  };

})(window);
