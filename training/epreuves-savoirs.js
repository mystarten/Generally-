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
  function tzTirage(genre) {
    return function (niveau, nb) {
      var bassin = TZ.fdo.banque({
        force: TZ.fdo.force(),
        niveau: niveau,
        genre: genre,
        themes: TZ.fdo.filtreThemes()
      });
      /* Un thème trop étroit peut vider le bassin : plutôt que de rendre
         l'épreuve injouable, on retombe sur tous les thèmes. Le candidat
         préfère réviser large que voir un écran vide. */
      if (bassin.length < 4) {
        bassin = TZ.fdo.banque({
          force: TZ.fdo.force(), niveau: niveau, genre: genre
        });
      }
      return TZ.fdo.tirer(bassin, nb).map(tzVersOption);
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
    libelleRate: tzLibelleRate,
    difficulte: 0.75
  }));

})(window);
