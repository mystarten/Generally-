/* =============================================================================
   Zone d'entraînement — socle « forces de l'ordre ».

   Ce fichier ne contient ni épreuve ni question : il tient le VOCABULAIRE
   commun à tout le volet métier, et l'état « sur quel parcours suis-je ».

     — les deux FORCES, police nationale et gendarmerie nationale ;
     — les quatre PALIERS de carrière, de l'école à la spécialisation ;
     — les THÈMES du programme ;
     — l'accès filtré à la banque de savoirs (fdo-savoirs.js) ;
     — le mémento métier, qui rend la banque relisible avant de se tester.

   POURQUOI SÉPARER LES DEUX FORCES. Police et gendarmerie partagent un socle
   large : code de procédure pénale, code de déontologie commun depuis 2014,
   mêmes règles d'usage des armes depuis la loi du 28 février 2017. Mais elles
   ne se superposent pas : la gendarmerie est une force ARMÉE, avec des grades
   militaires, une compétence sur la majeure partie du territoire et des
   unités propres ; la police est un corps CIVIL, urbain, avec sa propre
   hiérarchie et ses propres services. Mélanger les deux produirait des
   questions fausses pour l'un comme pour l'autre. Chaque question porte donc
   une force : « commun », « pn » ou « gn ».

   POURQUOI DES PALIERS PLUTÔT QUE DES DIFFICULTÉS. « Expert » ne veut rien
   dire sur une connaissance professionnelle ; « ce qu'on attend en sortie
   d'école » en veut un. Les quatre paliers remplacent donc les quatre
   niveaux du moteur dans tout le volet métier, et le bassin de questions est
   CUMULATIF : au palier Confirmé, on révise aussi ce qui s'apprend à l'école.

   AVERTISSEMENT PORTÉ À L'ÉCRAN. Rien ici ne remplace un texte officiel. Les
   questions renvoient à leur source (article de code, texte d'origine) pour
   qu'elles soient vérifiables, et le mémento le redit en clair.
   ============================================================================= */
(function (global) {
  'use strict';

  var TZ = global.TZ;

  /* ================================================================= forces */
  var FORCES = [
    { id: 'pn', nom: 'Police nationale', court: 'Police', adjectif: 'policier',
      couleur: 'var(--tz-police)',
      resume: 'Force civile, compétente sur les zones urbaines. Hiérarchie en '
            + 'trois corps, du gardien de la paix au commissaire.' },
    { id: 'gn', nom: 'Gendarmerie nationale', court: 'Gendarmerie', adjectif: 'gendarme',
      couleur: 'var(--tz-gendarmerie)',
      resume: 'Force armée, statut militaire, compétente sur la majeure partie '
            + 'du territoire. Grades militaires, du gendarme adjoint au général.' }
  ];

  function tzForces() { return FORCES; }

  function tzLaForce(id) {
    for (var i = 0; i < FORCES.length; i++) if (FORCES[i].id === id) return FORCES[i];
    return FORCES[0];
  }

  /* Parcours courant. Aucune valeur par défaut imposée : tant que rien n'est
     choisi, l'accueil pose la question. On ne devine pas à la place du
     candidat, et personne n'a envie de réviser la hiérarchie de l'autre
     maison. */
  function tzForce() { return TZ.lire('fdo_force', null); }

  function tzFixerForce(id) { TZ.ecrire('fdo_force', tzLaForce(id).id); }

  /* ================================================================ paliers
     Quatre paliers, dans l'ordre d'une carrière. Les identifiants sont ceux
     des niveaux du moteur : une épreuve métier n'a ainsi rien à traduire,
     elle lit ctx.niveau et demande le bassin correspondant. */
  var PALIERS = [
    { id: 'decouverte', rang: 1, nom: 'École',
      resume: 'Les fondamentaux enseignés en école : ce qui ne se discute pas.' },
    { id: 'standard', rang: 2, nom: 'Terrain',
      resume: 'Ce qu’on applique dès les premières patrouilles.' },
    { id: 'confirme', rang: 3, nom: 'Confirmé',
      resume: 'Les cas moins fréquents, les limites, les pièges de procédure.' },
    { id: 'expert', rang: 4, nom: 'Spécialisation',
      resume: 'Régimes dérogatoires, encadrement, unités spécialisées.' }
  ];

  function tzPaliers() { return PALIERS; }

  function tzPalier(id) {
    for (var i = 0; i < PALIERS.length; i++) if (PALIERS[i].id === id) return PALIERS[i];
    return PALIERS[1];
  }

  /* Libellés à passer à une épreuve métier, pour que l'écran de préparation
     affiche « École » là où une épreuve cognitive affiche « Découverte ». */
  function tzEtiquettes() {
    var m = {};
    PALIERS.forEach(function (p) { m[p.id] = p.nom; });
    return m;
  }

  /* Rang atteint par un niveau du moteur : sert au filtrage cumulatif. */
  function tzRang(idNiveau) { return tzPalier(idNiveau).rang; }

  /* ================================================================= thèmes */
  var THEMES = [
    { id: 'cadre',          nom: 'Cadre légal et libertés' },
    { id: 'procedure',      nom: 'Procédure pénale' },
    { id: 'penal',          nom: 'Qualifications pénales' },
    { id: 'force',          nom: 'Usage de la force et des armes' },
    { id: 'deonto',         nom: 'Déontologie' },
    { id: 'organisation',   nom: 'Organisation et hiérarchie' },
    { id: 'unites',         nom: 'Unités et spécialités' },
    { id: 'intervention',   nom: 'Intervention et tactique' },
    { id: 'routiere',       nom: 'Sécurité routière' },
    { id: 'identification', nom: 'Identification et signalement' },
    { id: 'transmissions',  nom: 'Transmissions' },
    { id: 'secours',        nom: 'Secours à personne' }
  ];

  function tzThemes() { return THEMES; }

  function tzNomTheme(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i].nom;
    return id;
  }

  /* ================================================================= banque
     La banque vit dans fdo-savoirs.js et n'est jamais modifiée ici.

     tzBanque({ force, niveau, genre, themes })
       force  : 'pn' | 'gn' — garde « commun » plus la force demandée
       niveau : niveau du moteur — garde tous les paliers jusqu'à celui-là
       genre  : 'qcm' | 'vf' | 'situation'
       themes : tableau d'identifiants, facultatif */
  function tzBanque(opts) {
    var tout = global.TZ_FDO_SAVOIRS || [];
    var o = opts || {};
    var rangMax = o.niveau ? tzRang(o.niveau) : 4;
    var force = o.force;
    return tout.filter(function (q) {
      if (o.genre && q.genre !== o.genre) return false;
      if (force && q.force !== 'commun' && q.force !== force) return false;
      if (tzRang(q.palier) > rangMax) return false;
      if (o.themes && o.themes.length && o.themes.indexOf(q.theme) < 0) return false;
      return true;
    });
  }

  /* Combien de questions disponibles, pour afficher un compteur honnête. */
  function tzCompte(opts) { return tzBanque(opts).length; }

  /* ======================================================== thèmes retenus
     On peut vouloir ne réviser que la procédure, ou tout sauf le secourisme.
     Le choix est global au volet métier — pas par épreuve : un candidat
     travaille un thème, pas un thème par exercice.

     Liste vide = tous les thèmes. C'est le seul état qui garantisse qu'on ne
     se retrouve jamais avec un bassin vide après avoir tout décoché. */
  function tzThemesChoisis() { return TZ.lire('fdo_themes', []); }

  function tzBasculerTheme(id) {
    var l = tzThemesChoisis();
    var i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1); else l.push(id);
    /* tout cocher revient à ne rien filtrer : on normalise */
    if (l.length === THEMES.length) l = [];
    TZ.ecrire('fdo_themes', l);
  }

  function tzTousThemes() { TZ.ecrire('fdo_themes', []); }

  /* Le filtre à passer à tzBanque : undefined quand rien n'est restreint. */
  function tzFiltreThemes() {
    var l = tzThemesChoisis();
    return l.length ? l : null;
  }

  /* ========================================================= suivi des ratés
     Ce qu'on rate doit revenir. On ne construit pas ici une révision espacée
     complète — le module Culture SOG en a déjà une — mais on retient le
     nombre d'échecs par question, et le tirage s'en sert pour revenir plus
     souvent sur ce qui résiste. C'est trois lignes, et ça change tout sur la
     durée d'un entraînement. */
  function tzFaiblesses() { return TZ.lire('fdo_ratees', {}); }

  function tzNoter(idQuestion, juste) {
    var m = tzFaiblesses();
    var n = m[idQuestion] || 0;
    m[idQuestion] = juste ? Math.max(0, n - 1) : Math.min(6, n + 2);
    if (!m[idQuestion]) delete m[idQuestion];
    TZ.ecrire('fdo_ratees', m);
  }

  /* Tirage pondéré sans répétition : une question ratée pèse plus lourd.
     On renvoie exactement « nb » questions, ou tout le bassin s'il est plus
     petit — une épreuve ne doit jamais poser deux fois la même question. */
  function tzTirer(bassin, nb) {
    var poids = tzFaiblesses();
    var reste = bassin.slice();
    var sortie = [];
    while (sortie.length < nb && reste.length) {
      var total = 0, i;
      for (i = 0; i < reste.length; i++) total += 1 + (poids[reste[i].id] || 0);
      var tirage = Math.random() * total;
      var choisi = reste.length - 1;
      for (i = 0; i < reste.length; i++) {
        tirage -= 1 + (poids[reste[i].id] || 0);
        if (tirage <= 0) { choisi = i; break; }
      }
      sortie.push(reste.splice(choisi, 1)[0]);
    }
    return sortie;
  }

  /* ================================================================ mémento
     Un écran de révision, pas une épreuve : la banque relue à plat, groupée
     par thème, question et réponse côte à côte. C'est le pendant du mémento
     des grades, et ce qu'on ouvre avant de se tester.

     Il n'y a pas de contenu propre ici : tout vient de la banque, pour qu'une
     question corrigée le soit partout à la fois. */
  function tzMemento(hote, force) {
    TZ.vide(hote);
    var f = tzLaForce(force);
    var etat = { recherche: '', ratees: false };

    /* --- en-tête et commandes ---------------------------------------- */
    var intro = TZ.el('div', 'tz-panneau');
    intro.appendChild(TZ.el('span', 'tz-etiquette', 'Mémento métier · ' + f.nom));
    intro.appendChild(TZ.el('p', null,
      'Tout ce que les quiz peuvent demander, réponse donnée d’emblée. '
      + 'Chaque fiche porte sa source : c’est ce qui permet de la vérifier.'));

    /* Le mémento faisait soixante écrans de défilement : illisible sur un
       téléphone, et inutilisable pour retrouver une règle précise avant une
       prise de service. Une recherche, des thèmes repliés et un filtre sur
       ce qu'on rate le transforment en mémento de poche. */
    var champ = TZ.el('input', 'tz-salon-champ tz-memento-recherche');
    champ.type = 'search';
    champ.placeholder = 'Rechercher une règle, un mot, un article…';
    champ.setAttribute('aria-label', 'Rechercher dans le mémento');
    intro.appendChild(champ);

    var ligne = TZ.el('div', 'tz-puces');
    var bRatees = TZ.el('button', 'tz-puce', 'Seulement mes fiches ratées');
    bRatees.type = 'button';
    bRatees.setAttribute('aria-pressed', 'false');
    ligne.appendChild(bRatees);
    var bTout = TZ.el('button', 'tz-puce', 'Tout déplier');
    bTout.type = 'button';
    ligne.appendChild(bTout);
    intro.appendChild(ligne);

    var compteur = TZ.el('p', 'tz-vide', '');
    intro.appendChild(compteur);
    hote.appendChild(intro);

    var corps = TZ.el('div');
    hote.appendChild(corps);

    /* --- rendu, rejoué à chaque changement de filtre ------------------- */
    function correspond(q) {
      if (etat.ratees && !tzFaiblesses()[q.id]) return false;
      if (!etat.recherche) return true;
      var m = etat.recherche;
      return [q.question, q.explication, q.source, tzReponseLisible(q),
              tzNomTheme(q.theme)]
        .concat(q.choix || [])
        .some(function (t) { return t && tzSansAccent(t).indexOf(m) >= 0; });
    }

    function peindre(toutDeplier) {
      TZ.vide(corps);
      var total = 0;

      THEMES.forEach(function (th) {
        var lot = tzBanque({ force: f.id, themes: [th.id] }).filter(correspond);
        if (!lot.length) return;
        total += lot.length;

        /* <details> plutôt qu'un bouton : le repli est natif, il fonctionne
           sans script, et la recherche du navigateur le déplie toute seule. */
        var bloc = TZ.el('details', 'tz-panneau tz-memento-theme');
        bloc.open = !!toutDeplier || !!etat.recherche || etat.ratees;
        var titre = TZ.el('summary', 'tz-memento-sommaire');
        titre.appendChild(TZ.el('b', null, th.nom));
        titre.appendChild(TZ.el('span', 'tz-memento-compte', String(lot.length)));
        bloc.appendChild(titre);

        PALIERS.forEach(function (p) {
          var fiches = lot.filter(function (q) { return q.palier === p.id; });
          if (!fiches.length) return;
          bloc.appendChild(TZ.el('p', 'tz-memento-note', p.nom + ' — ' + p.resume));

          fiches.forEach(function (q) {
            var l = TZ.el('div', 'tz-fiche-savoir');
            var t = TZ.el('div', 'tz-fiche-titre');
            t.appendChild(TZ.el('b', null, q.question));
            if (q.force !== 'commun') {
              t.appendChild(TZ.el('span', 'tz-jeton tz-jeton-' + q.force,
                                  tzLaForce(q.force).court));
            } else {
              t.appendChild(TZ.el('span', 'tz-jeton', 'Commun'));
            }
            if (tzFaiblesses()[q.id]) {
              t.appendChild(TZ.el('span', 'tz-jeton tz-jeton-ratee', 'à revoir'));
            }
            l.appendChild(t);
            l.appendChild(TZ.el('div', 'tz-fiche-reponse', tzReponseLisible(q)));
            if (q.explication) l.appendChild(TZ.el('div', 'tz-fiche-expli', q.explication));
            if (q.source) l.appendChild(TZ.el('div', 'tz-fiche-source', q.source));
            bloc.appendChild(l);
          });
        });
        corps.appendChild(bloc);
      });

      if (!total) {
        var vide = TZ.el('div', 'tz-panneau');
        vide.appendChild(TZ.el('p', 'tz-vide', etat.ratees
          ? 'Aucune fiche ratée pour l’instant — rien à revoir de ce côté.'
          : 'Aucune fiche ne correspond à cette recherche.'));
        corps.appendChild(vide);
      }

      var tout = tzBanque({ force: f.id }).length;
      compteur.textContent = (etat.recherche || etat.ratees)
        ? total + ' fiche(s) sur ' + tout
        : tout + ' fiches pour le parcours ' + f.nom.toLowerCase()
          + ', socle commun aux deux forces inclus.';

      corps.appendChild(TZ.el('p', 'tz-memento-source',
        'Ces fiches sont un support de révision, pas une source de droit. Les '
        + 'textes bougent : avant un examen ou une épreuve, vérifiez l’article '
        + 'cité sur Légifrance ou dans votre documentation de service.'));
    }

    var minuteur = null;
    champ.addEventListener('input', function () {
      /* On attend une respiration : repeindre à chaque frappe sur deux cent
         quatre-vingts fiches hache la saisie sur un téléphone. */
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        etat.recherche = tzSansAccent(champ.value.trim());
        peindre(false);
      }, 180);
    });
    bRatees.addEventListener('click', function () {
      etat.ratees = !etat.ratees;
      bRatees.setAttribute('aria-pressed', etat.ratees ? 'true' : 'false');
      peindre(false);
    });
    bTout.addEventListener('click', function () {
      var deplie = corps.querySelectorAll('details[open]').length === 0;
      bTout.textContent = deplie ? 'Tout replier' : 'Tout déplier';
      peindre(deplie);
    });

    peindre(false);
  }

  /* Recherche insensible à la casse ET aux accents : personne ne tape
     « légitime » avec son accent dans un champ de recherche en urgence. */
  function tzSansAccent(t) {
    return String(t).toLowerCase()
      .normalize ? String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                 : String(t).toLowerCase();
  }

  /* La réponse, telle qu'on la lit dans un mémento — donc en clair, et non
     sous forme d'indice dans une liste de propositions. */
  function tzReponseLisible(q) {
    if (q.genre === 'vf') return q.reponse ? 'Vrai.' : 'Faux.';
    return q.choix[q.reponse];
  }

  /* ========================================================== exposition */
  TZ.fdo = {
    FORCES: FORCES, forces: tzForces, laForce: tzLaForce,
    force: tzForce, fixerForce: tzFixerForce,
    PALIERS: PALIERS, paliers: tzPaliers, palier: tzPalier,
    etiquettes: tzEtiquettes, rang: tzRang,
    THEMES: THEMES, themes: tzThemes, nomTheme: tzNomTheme,
    banque: tzBanque, compte: tzCompte, tirer: tzTirer,
    themesChoisis: tzThemesChoisis, basculerTheme: tzBasculerTheme,
    tousThemes: tzTousThemes, filtreThemes: tzFiltreThemes,
    faiblesses: tzFaiblesses, noter: tzNoter,
    reponseLisible: tzReponseLisible,
    memento: tzMemento
  };

})(window);
