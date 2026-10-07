/* =============================================================================
   Zone d'entraînement — épreuves de savoirs professionnels.

   Trois épreuves, construites par TZ.quizz.creer() sur la banque de
   fdo-savoirs.js. Ce sont trois exercices différents, pas trois habillages
   du même :

     — Quiz métier     : la connaissance posée franchement, quatre réponses.
     — Vrai ou faux    : la décision rapide. Pas de nuance possible, peu de
                         temps : c'est l'exercice qui révèle ce qu'on croit
                         savoir.
     — Situation       : un contexte, puis la décision. Celui qui se rapproche
                         le plus de l'entretien et du terrain.

   Toutes trois suivent la FORCE choisie (police ou gendarmerie) et le PALIER
   de carrière, et évitent de reposer ce qui vient d'être posé. Ce qui est
   raté revient plus souvent, séance après séance.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ;

  /* ------------------------------------------------- normalisation d'une question
     La banque et la fabrique ne parlent pas le même langage : la banque dit
     « choix » et « reponse », la fabrique attend des « options » marquées.
     Cette fonction fait la traduction, et c'est le seul endroit où elle a
     lieu. */
  function tzVersOption(q) {
    var base = {
      cle: q.id,
      enonce: q.question,
      contexte: q.contexte || null,
      explication: q.explication,
      source: q.source,
      theme: q.theme
    };

    if (q.genre === 'vf') {
      /* L'ordre est fixe, et c'est voulu : déplacer « Vrai » et « Faux » d'une
         question à l'autre ferait perdre du temps de lecture sur une épreuve
         dont tout l'intérêt est la vitesse. */
      base.options = [
        { texte: 'Vrai', juste: q.reponse === true },
        { texte: 'Faux', juste: q.reponse === false }
      ];
      return base;
    }

    base.options = TZ.melanger(q.choix.map(function (c, i) {
      return { texte: c, juste: i === q.reponse };
    }));
    return base;
  }

  /* Le tirage commun : la force courante, le palier atteint, le genre voulu,
     et les thèmes retenus par le candidat. */
  /* Le bassin réellement disponible, aux réglages du moment. Sert au tirage,
     et à l'écran de préparation pour annoncer la longueur de la séance. */
  function tzBassin(genre, niveau) {
    return TZ.fdo.banque({
      force: TZ.fdo.force(),
      niveau: niveau,
      genre: genre,
      themes: TZ.fdo.filtreThemes()
    });
  }

  /* IL N'Y A PLUS DE REPLI SILENCIEUX.

     Avant, un bassin de moins de quatre questions faisait retomber le tirage
     sur TOUS les thèmes, sans rien dire. Comme neuf thèmes sur douze passent
     sous ce seuil dans au moins un genre, choisir « Secours à personne » et
     lancer Vrai ou faux servait des questions de procédure pénale : le filtre
     paraissait cassé, et il l'était.

     Désormais la séance fait la taille du bassin choisi, et l'écran de
     préparation l'annonce avant de commencer. Une séance de six questions sur
     le thème qu'on voulait vaut mieux qu'une séance de dix-huit sur autre
     chose. */
  function tzTirage(genre) {
    return function (niveau, nb) {
      return TZ.fdo.tirer(tzBassin(genre, niveau), nb).map(tzVersOption);
    };
  }

  function tzLibelleRate(q) { return TZ.fdo.nomTheme(q.theme); }

  /* Vignette d'exemple pour les tutoriels : une question réelle de la banque,
     figée, avec sa bonne réponse montrée. Mieux qu'une consigne écrite — on
     voit ce qu'on va avoir sous les yeux. */
  function tzVignette(hote, q, legende) {
    var cas = TZ.el('div', 'tz-apercu');
    if (q.contexte) cas.appendChild(TZ.el('p', 'tz-apercu-contexte', q.contexte));
    cas.appendChild(TZ.el('p', 'tz-apercu-enonce', q.question));
    var l = TZ.el('div', 'tz-apercu-choix');
    (q.genre === 'vf' ? ['Vrai', 'Faux'] : q.choix).forEach(function (c, i) {
      var juste = q.genre === 'vf'
        ? (i === 0) === (q.reponse === true)
        : i === q.reponse;
      l.appendChild(TZ.el('span', 'tz-apercu-item' + (juste ? ' tz-juste' : ''), c));
    });
    cas.appendChild(l);
    cas.appendChild(TZ.el('p', 'tz-apercu-expli', q.explication));
    if (legende) cas.appendChild(TZ.el('p', 'tz-apercu-legende', legende));
    hote.appendChild(cas);
  }

  /* Prend une question de la banque par son identifiant, pour les tutoriels.
     Si elle a été renommée ou retirée, on ne casse rien : on renvoie null et
     l'appelant s'en passe. */
  function tzExemple(id) {
    var tout = global.TZ_FDO_SAVOIRS || [];
    for (var i = 0; i < tout.length; i++) if (tout[i].id === id) return tout[i];
    return null;
  }

  function tzMontrerExemples(hote, ids, legende) {
    var montre = 0;
    ids.forEach(function (id) {
      var q = tzExemple(id);
      if (!q) return;
      tzVignette(hote, q, montre === 0 ? legende : null);
      montre++;
    });
    if (!montre) hote.appendChild(TZ.el('p', 'tz-vide', 'Exemple indisponible.'));
  }

  /* ================================================== 13. Quiz métier */
  TZ.epreuves.push(TZ.quizz.creer({
    id: 'savoirs',
    nom: 'Quiz métier',
    categorie: 'savoirs',
    axe: 'connaissances',
    force: 'commun',
    but: 'Les connaissances professionnelles attendues, de l’école à la spécialisation.',
    comment: 'Une question, quatre réponses. L’explication et l’article de référence s’affichent après chaque réponse.',
    etiquettes: TZ.fdo.etiquettes(),

    tuto: {
      regle: 'Une question de connaissance professionnelle, quatre propositions, une seule juste. '
           + 'Le palier choisi commande le programme : au palier École, seuls les fondamentaux ; '
           + 'aux paliers suivants, le bassin s’élargit sans rien retirer. Ce que vous ratez '
           + 'revient plus souvent lors des séances suivantes.',
      exemple: function (hote) {
        tzMontrerExemples(hote, ['pro-04', 'for-01'],
          'La bonne réponse est signalée en vert, et l’explication dit pourquoi.');
        hote.appendChild(TZ.el('p', null,
          'Les questions suivent la force choisie : le socle commun aux deux maisons '
          + 'est posé à tout le monde, les grades, unités et statuts propres à une '
          + 'force ne sont posés qu’à ses candidats.'));
      },
      pourquoi: 'C’est le fond du métier : cadre légal, procédure, déontologie, usage de la force, '
              + 'organisation, sécurité routière, secourisme. Un QCM de concours ne demande rien '
              + 'd’autre, et une intervention non plus — sauf qu’elle ne laisse pas le temps de réfléchir.'
    },

    reglages: {
      decouverte: { essais: 12, limite: 22000 },
      standard:   { essais: 16, limite: 19000 },
      confirme:   { essais: 20, limite: 16000 },
      expert:     { essais: 20, limite: 13000 }
    },

    tirage: tzTirage('qcm'),
    disponibles: function (niveau) { return tzBassin('qcm', niveau).length; },
    libelleRate: tzLibelleRate,
    difficulte: 0.7
  }));

  /* ================================================== 14. Vrai ou faux */
  TZ.epreuves.push(TZ.quizz.creer({
    id: 'vraifaux',
    nom: 'Vrai ou faux',
    categorie: 'savoirs',
    axe: 'vitesse',
    force: 'commun',
    but: 'Trancher vite sur une affirmation de métier, sans hésiter.',
    comment: 'Une affirmation s’affiche. Vrai ou faux, et le temps est court.',
    etiquettes: TZ.fdo.etiquettes(),

    tuto: {
      regle: 'Une affirmation, deux réponses, peu de temps. Il n’y a pas de demi-vérité : '
           + 'une affirmation presque juste est fausse. C’est l’exercice qui sépare ce qu’on '
           + 'sait de ce qu’on croit savoir.',
      exemple: function (hote) {
        tzMontrerExemples(hote, ['vf-05', 'for-12'],
          'Les deux sont fausses, et pour la même raison : une condition manque.');
        hote.appendChild(TZ.el('p', null,
          'Les affirmations fausses le sont rarement en bloc : il leur manque une '
          + 'condition, ou elles généralisent une règle qui ne vaut que dans certains cas. '
          + 'C’est exactement le piège des questionnaires de concours.'));
      },
      pourquoi: 'Sur le terrain, la question n’est pas « quelle est la règle » mais « est-ce que '
              + 'j’ai le droit, là, maintenant ». S’entraîner à trancher vite, c’est éviter '
              + 'l’hésitation au mauvais moment — et l’erreur qui va avec.'
    },

    reglages: {
      decouverte: { essais: 14, limite: 12000 },
      standard:   { essais: 18, limite: 9000 },
      confirme:   { essais: 22, limite: 7000 },
      expert:     { essais: 24, limite: 5500 }
    },

    tirage: tzTirage('vf'),
    disponibles: function (niveau) { return tzBassin('vf', niveau).length; },
    libelleRate: tzLibelleRate,
    difficulte: 0.6
  }));

  /* ================================================ 15. Situation d'intervention */
  TZ.epreuves.push(TZ.quizz.creer({
    id: 'situation',
    nom: 'Situation d’intervention',
    categorie: 'savoirs',
    axe: 'connaissances',
    force: 'commun',
    but: 'Décider juste quand la scène est posée : ce que le droit permet, et ce qu’il interdit.',
    comment: 'Une scène, puis une décision à prendre. Lisez le contexte avant de choisir.',
    etiquettes: TZ.fdo.etiquettes(),

    tuto: {
      regle: 'Un contexte s’affiche, puis une question. Choisissez la décision conforme au droit '
           + 'et à la déontologie. La réponse qui vient d’abord à l’esprit n’est pas toujours la '
           + 'bonne : chaque situation renvoie au texte qui la tranche.',
      exemple: function (hote) {
        tzMontrerExemples(hote, ['sit-02', 'sit-05'],
          'Dans les deux cas, le réflexe est faux et le texte est clair.');
        hote.appendChild(TZ.el('p', null,
          'Les situations ne cherchent pas à piéger sur un cas d’école : elles portent '
          + 'sur ce qui arrive tous les jours — un contrôle sans motif, une plainte hors '
          + 'secteur, un menottage automatique, un ordre qui ne devrait pas être donné.'));
      },
      pourquoi: 'C’est le format de l’épreuve de mise en situation des concours, et celui de '
              + 'l’entretien avec le jury. C’est surtout la seule façon de vérifier qu’on sait '
              + 'appliquer une règle, et pas seulement la réciter.'
    },

    reglages: {
      decouverte: { essais: 8,  limite: 35000 },
      standard:   { essais: 10, limite: 30000 },
      confirme:   { essais: 12, limite: 26000 },
      expert:     { essais: 14, limite: 22000 }
    },

    tirage: tzTirage('situation'),
    disponibles: function (niveau) { return tzBassin('situation', niveau).length; },
    libelleRate: tzLibelleRate,
    difficulte: 0.75
  }));

  /* ================================================ 16. Révision du jour
     L'épreuve adossée aux boîtes de révision espacée. Elle ne suit ni le
     palier ni les thèmes : elle pose ce qui est DÛ, tous genres mêlés — QCM,
     vrai-faux et situations à la suite, comme une vraie séance de révision.

     Le niveau n'y règle donc pas le programme mais la LONGUEUR de la séance,
     et les libellés le disent : « Courte », « Normale », « Longue ». Appeler
     « École » un réglage qui ne change que le nombre de fiches tromperait. */
  TZ.epreuves.push(TZ.quizz.creer({
    id: 'revision',
    nom: 'Révision du jour',
    categorie: 'savoirs',
    axe: 'connaissances',
    force: 'commun',
    but: 'Ce que vos boîtes de révision ramènent aujourd’hui : ce qui est dû, ce que vous ratez, puis du neuf.',
    comment: 'Tous genres mêlés. Ce que vous réussissez espace son retour, ce que vous ratez revient dès demain.',
    etiquettes: {
      decouverte: 'Courte', standard: 'Normale',
      confirme: 'Longue', expert: 'Très longue'
    },

    tuto: {
      regle: 'Cette séance ne tire pas au hasard : elle pose d’abord les fiches arrivées à '
           + 'échéance, puis celles que vous ratez le plus, puis des fiches jamais vues. '
           + 'Une bonne réponse fait monter la fiche d’une boîte et espace son retour ; une '
           + 'erreur la renvoie à la première boîte, et elle revient dès demain.',
      exemple: function (hote) {
        var ul = TZ.el('ul', 'tz-regles');
        [ 'Boîte 1 — revue demain.',
          'Boîte 2 — dans 2 jours.',
          'Boîte 3 — dans 4 jours.',
          'Boîte 4 — dans 8 jours.',
          'Boîte 5 — dans 16 jours : la fiche est acquise.'
        ].forEach(function (t) { ul.appendChild(TZ.el('li', null, t)); });
        hote.appendChild(ul);
        hote.appendChild(TZ.el('p', null,
          'C’est le principe des boîtes de Leitner, celui qu’utilise déjà le module '
          + 'Culture SOG. L’intérêt n’apparaît qu’avec le temps : au bout de quelques '
          + 'semaines, vous ne repassez plus votre temps sur ce que vous savez déjà.'));
        hote.appendChild(TZ.el('p', 'tz-vide',
          'Le réglage de difficulté ne change ici que la LONGUEUR de la séance : '
          + 'le programme, lui, est décidé par vos échéances.'));
      },
      pourquoi: 'Sans échéance, rien ne ramène une fiche qu’on croyait sue il y a trois '
              + 'semaines — et c’est précisément celle-là qu’on ratera le jour de l’épreuve. '
              + 'La révision espacée est la seule méthode qui tienne sur six mois.'
    },

    reglages: {
      decouverte: { essais: 10, limite: 22000 },
      standard:   { essais: 16, limite: 20000 },
      confirme:   { essais: 22, limite: 18000 },
      expert:     { essais: 30, limite: 16000 }
    },

    tirage: function (niveau, nb) {
      return TZ.fdo.composerRevision(TZ.fdo.force(), nb).map(tzVersOption);
    },
    disponibles: function () {
      var f = TZ.fdo.force();
      return TZ.fdo.dues(f).length + TZ.fdo.nouvelles(f).length;
    },
    /* Ce que la séance contiendra vraiment, et dans quel ordre — plutôt
       qu'un « tirées parmi 251 » qui laisserait croire à un tirage au sort. */
    resumeBassin: function (niveau, seance) {
      var f = TZ.fdo.force();
      var dues = TZ.fdo.dues(f).length;
      var neuves = TZ.fdo.nouvelles(f).length;
      if (!dues && !neuves) {
        return 'Rien à revoir et plus aucune fiche nouvelle : vos boîtes sont à jour.';
      }
      var bouts = [];
      var nDues = Math.min(dues, seance);
      if (nDues) bouts.push(nDues + (nDues > 1 ? ' arrivées' : ' arrivée') + ' à échéance');
      var place = seance - nDues;
      var nNeuves = Math.min(neuves, place);
      if (place > 0 && nNeuves) bouts.push(nNeuves + (nNeuves > 1 ? ' jamais vues' : ' jamais vue'));
      return 'Séance de ' + seance + ' fiches : ' + bouts.join(', puis ')
        + '. Les échéances passent toujours en premier.';
    },
    libelleRate: tzLibelleRate,
    difficulte: 0.7
  }));

})(window);
