/* =============================================================================
   Zone d'entraînement — application.

   Assemble le moteur et les épreuves : menu, lancement d'une épreuve, bilan,
   session complète, profil radar et suivi dans le temps.

   Aucune dépendance au jeu principal. Les seuls fichiers partagés (d3,
   topojson, la carte, éventuellement la banque de questions) sont lus et
   jamais écrits.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  /* Les catégories, dans l'ordre où elles apparaissent à l'accueil. Le métier
     d'abord, le cognitif ensuite : c'est ce qu'on vient chercher. */
  var CATEGORIES = [
    { id: 'savoirs',    nom: 'Savoirs métier',         couleur: 'var(--tz-savoirs)',
      resume: 'Cadre légal, procédure, déontologie, usage de la force, '
            + 'organisation, sécurité routière, secourisme.' },
    { id: 'terrain',    nom: 'Terrain et observation', couleur: 'var(--tz-terrain)',
      resume: 'Relever un signalement, lire une plaque, transmettre juste.' },
    { id: 'hierarchie', nom: 'Hiérarchie et grades',   couleur: 'var(--tz-hierarchie)',
      resume: 'Reconnaître, nommer et classer les grades de sa force.' },
    { id: 'memoire',    nom: 'Mémoire',                couleur: 'var(--tz-memoire)',
      resume: 'Les épreuves cognitives de mémoire, inspirées des tests de sélection.' },
    { id: 'attention',  nom: 'Attention',              couleur: 'var(--tz-attention)',
      resume: 'Vigilance, inhibition, vitesse de décision sous contrainte.' }
  ];

  /* Les épreuves du parcours courant. Une épreuve marquée « pn » ou « gn »
     n'est pas désactivée pour l'autre force : elle est ABSENTE. Montrer
     grisée la hiérarchie de l'autre maison n'apprendrait rien et chargerait
     l'écran. */
  function tzEpreuvesVisibles() {
    var force = TZ.fdo ? TZ.fdo.force() : null;
    return TZ.epreuves.filter(function (e) {
      if (!e.force || e.force === 'commun') return true;
      return e.force === force;
    });
  }

  /* Le libellé d'un niveau pour une épreuve donnée. Les épreuves métier
     parlent de paliers de carrière — « École », « Terrain » — là où les
     épreuves cognitives parlent de difficulté. Un seul réglage, deux
     vocabulaires, parce que « expert » ne veut rien dire sur une
     connaissance professionnelle. */
  function tzResumeNiveau(ep, idNiveau) {
    if (ep && ep.etiquettes && TZ.fdo) return TZ.fdo.palier(idNiveau).resume;
    return TZ.niveau(idNiveau).resume;
  }

  function tzNomNiveau(ep, idNiveau) {
    if (ep && ep.etiquettes && ep.etiquettes[idNiveau]) return ep.etiquettes[idNiveau];
    return TZ.niveau(idNiveau).nom;
  }

  var AXES = [
    { id: 'memoireVisuelle', nom: 'Mémoire visuelle' },
    { id: 'memoireTravail',  nom: 'Mémoire de travail' },
    { id: 'attention',       nom: 'Attention' },
    { id: 'inhibition',      nom: 'Inhibition' },
    { id: 'vitesse',         nom: 'Vitesse de décision' },
    { id: 'resistance',      nom: 'Résistance au stress' },
    { id: 'connaissances',   nom: 'Connaissances' }
  ];

  /* ============================================================== écrans */
  var SEUIL_MONTER = 78;    /* au-dessus, le niveau courant est maîtrisé */
  var SEUIL_DESCENDRE = 40; /* en dessous, insister n'apprend rien */

  function tzEcran(nom) {
    ['accueil', 'tuto', 'preparation', 'epreuve', 'resultat', 'progression',
     'memento'].forEach(function (n) {
      var s = TZ.q('#tz-ecran-' + n);
      if (s) s.hidden = (n !== nom);
    });
    global.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ========================================================== accueil
     Trois temps, dans cet ordre :
       1. si aucune force n'est choisie, on ne montre QUE ce choix. Il oriente
          les grades, les unités et une partie des questions : le poser plus
          tard obligerait à tout repeindre ;
       2. le parcours courant, rappelé avec de quoi basculer ;
       3. les catégories d'épreuves, les mémentos, la session, les réglages. */
  function tzPeindreAccueil() {
    var hote = TZ.vide(TZ.q('#tz-categories'));
    if (TZ.fdo && !TZ.fdo.force()) { tzChoisirForce(hote); return; }
    tzBandeauForce(hote);

    CATEGORIES.forEach(function (cat) {
      var lot = tzEpreuvesVisibles().filter(function (e) {
        return e.categorie === cat.id;
      });
      if (!lot.length) return;
      var bloc = TZ.el('section', 'tz-panneau');
      bloc.appendChild(TZ.el('span', 'tz-etiquette', cat.nom));
      if (cat.resume) bloc.appendChild(TZ.el('p', 'tz-vide', cat.resume));
      /* Le filtre de thème ne vaut que pour les savoirs : c'est la seule
         catégorie adossée à la banque. */
      if (cat.id === 'savoirs' && TZ.fdo) tzFiltresThemes(bloc);
      var grille = TZ.el('div', 'tz-grille');
      lot.forEach(function (ep) { grille.appendChild(tzFiche(ep, cat.couleur)); });
      bloc.appendChild(grille);
      hote.appendChild(bloc);
    });

    tzMementos(hote);
    /* Le multijoueur est un module à part : absent, l'accueil ne change pas. */
    if (TZ.salon) TZ.salon.panneau(hote, tzPeindreAccueil);

    /* session complète */
    var bloc = TZ.el('section', 'tz-panneau');
    bloc.appendChild(TZ.el('span', 'tz-etiquette', 'Session complète'));
    bloc.appendChild(TZ.el('p', null,
      'Cinq épreuves tirées au hasard dans votre parcours, difficulté et stress '
      + 'croissants, bilan à la fin.'));
    UI.actions(bloc, [
      { texte: 'Lancer une session', action: function () { tzDemarrerSession(); } },
      { texte: 'Ma progression', fantome: true, action: function () { tzPeindreProgression(); } }
    ]);
    hote.appendChild(bloc);

    /* réglages — difficulté et stress se choisissent épreuve par épreuve,
       juste avant de commencer ; il ne reste ici que le général */
    var reg = TZ.el('section', 'tz-panneau');
    reg.appendChild(TZ.el('span', 'tz-etiquette', 'Réglages'));
    reg.appendChild(TZ.el('p', 'tz-vide',
      'La difficulté et le niveau de stress se choisissent au lancement de chaque épreuve.'));

    var l2 = TZ.el('div', 'tz-rangee');
    var bSon = TZ.el('button', 'tz-btn tz-fantome tz-mini',
                     TZ.etat.son ? 'Sons activés' : 'Sons coupés');
    bSon.type = 'button';
    bSon.addEventListener('click', function () {
      TZ.etat.son = !TZ.etat.son; TZ.ecrire('son', TZ.etat.son); tzPeindreAccueil();
    });
    l2.appendChild(bSon);
    var bRaz = TZ.el('button', 'tz-btn tz-danger tz-mini', 'Réinitialiser mes données');
    bRaz.type = 'button';
    bRaz.addEventListener('click', tzReinitialiser);
    l2.appendChild(bRaz);
    reg.appendChild(l2);
    hote.appendChild(reg);
  }

  /* ---------------------------------------------------- choix de la force */
  function tzChoisirForce(hote) {
    var bloc = TZ.el('section', 'tz-panneau');
    bloc.appendChild(TZ.el('span', 'tz-etiquette', 'Votre parcours'));
    var h = TZ.el('h2', null, 'Police ou gendarmerie ?');
    h.style.cssText = 'font-family:var(--tz-titre);margin:0 0 6px';
    bloc.appendChild(h);
    bloc.appendChild(TZ.el('p', null,
      'Les deux forces partagent un socle large — même code de procédure pénale, '
      + 'même code de déontologie depuis 2014, mêmes règles d’usage des armes depuis '
      + '2017. Mais elles ne se superposent pas : grades, unités, statut et compétence '
      + 'territoriale diffèrent. Choisissez votre parcours ; vous pourrez changer à tout moment.'));

    var grille = TZ.el('div', 'tz-forces');
    TZ.fdo.FORCES.forEach(function (f) {
      var b = TZ.el('button', 'tz-force-carte');
      b.type = 'button';
      b.style.setProperty('--tz-c', f.couleur);
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(TZ.el('b', null, f.nom));
      b.appendChild(TZ.el('span', null, f.resume));
      b.addEventListener('click', function () {
        TZ.fdo.fixerForce(f.id);
        tzPeindreAccueil();
      });
      grille.appendChild(b);
    });
    bloc.appendChild(grille);
    hote.appendChild(bloc);

    var note = TZ.el('section', 'tz-panneau');
    note.appendChild(TZ.el('span', 'tz-etiquette', 'Les épreuves cognitives'));
    note.appendChild(TZ.el('p', 'tz-vide',
      'Mémoire, attention, résistance au stress : elles ne dépendent d’aucune force '
      + 'et restent disponibles dans les deux parcours.'));
    hote.appendChild(note);
  }

  function tzBandeauForce(hote) {
    var f = TZ.fdo.laForce(TZ.fdo.force());
    var autre = TZ.fdo.FORCES.filter(function (x) { return x.id !== f.id; })[0];
    var bande = TZ.el('div', 'tz-force-active');
    bande.style.setProperty('--tz-c', f.couleur);
    bande.appendChild(TZ.el('b', null, f.nom));
    bande.appendChild(TZ.el('span', 'tz-force-note',
      TZ.fdo.compte({ force: f.id }) + ' fiches de savoirs pour ce parcours, '
      + 'socle commun compris.'));
    var b = TZ.el('button', 'tz-btn tz-fantome tz-mini', 'Passer en ' + autre.court);
    b.type = 'button';
    b.addEventListener('click', function () {
      TZ.fdo.fixerForce(autre.id);
      tzPeindreAccueil();
    });
    bande.appendChild(b);
    hote.appendChild(bande);
  }

  /* ------------------------------------------------- filtres de thème
     Tout coché revient à ne rien filtrer : c'est le seul état qui garantisse
     qu'on ne se retrouve jamais avec un bassin vide. */
  function tzFiltresThemes(hote) {
    var choisis = TZ.fdo.themesChoisis();
    var puces = TZ.el('div', 'tz-puces');

    var tous = TZ.el('button', 'tz-puce', 'Tous les thèmes');
    tous.type = 'button';
    tous.setAttribute('aria-pressed', choisis.length ? 'false' : 'true');
    tous.addEventListener('click', function () { TZ.fdo.tousThemes(); tzPeindreAccueil(); });
    puces.appendChild(tous);

    TZ.fdo.THEMES.forEach(function (t) {
      var n = TZ.fdo.compte({ force: TZ.fdo.force(), themes: [t.id] });
      if (!n) return;
      var b = TZ.el('button', 'tz-puce', t.nom + ' · ' + n);
      b.type = 'button';
      b.setAttribute('aria-pressed', choisis.indexOf(t.id) >= 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        TZ.fdo.basculerTheme(t.id); tzPeindreAccueil();
      });
      puces.appendChild(b);
    });
    hote.appendChild(puces);

    if (choisis.length) {
      hote.appendChild(TZ.el('p', 'tz-vide',
        choisis.length + ' thème(s) retenu(s) pour les quiz. '
        + 'Si un thème ne contient pas assez de questions, l’épreuve élargit d’elle-même.'));
    }
  }

  /* ------------------------------------------------------------ mémentos
     Les écrans de révision, groupés : c'est ce qu'on ouvre AVANT de se
     tester, et il faut pouvoir y aller sans chercher. Chaque bouton est
     conditionné à la présence de son module, pour qu'en supprimer un ne
     casse rien. */
  function tzMementos(hote) {
    var force = TZ.fdo ? TZ.fdo.force() : null;
    var boutons = [];

    if (TZ.fdo) {
      boutons.push({ texte: 'Mémento métier', action: function () {
        TZ.fdo.memento(TZ.q('#tz-memento'), force);
        tzEcran('memento');
      } });
    }
    if (force === 'gn' && TZ.grades) {
      boutons.push({ texte: 'Grades de la gendarmerie', fantome: true, action: function () {
        TZ.grades.memento(TZ.q('#tz-memento'));
        tzEcran('memento');
      } });
    }
    if (force === 'pn' && TZ.gradesPolice) {
      boutons.push({ texte: 'Grades de la police', fantome: true, action: function () {
        TZ.gradesPolice.memento(TZ.q('#tz-memento'));
        tzEcran('memento');
      } });
    }
    if (!boutons.length) return;

    var bloc = TZ.el('section', 'tz-panneau');
    bloc.appendChild(TZ.el('span', 'tz-etiquette', 'Mémentos'));
    bloc.appendChild(TZ.el('p', null,
      'Les fiches à plat, avec leur source : la réponse y est donnée d’emblée. '
      + 'C’est le support de révision — à relire avant de se tester.'));
    UI.actions(bloc, boutons);
    hote.appendChild(bloc);
  }

  function tzFiche(ep, couleur) {
    var dispo = !ep.requiert || ep.requiert !== 'carte' || TZ.carte.preparer();
    var f = TZ.el('button', 'tz-fiche');
    f.type = 'button';
    f.style.setProperty('--tz-c', couleur);
    var p = TZ.el('span', 'tz-pastille', ep.nom.charAt(0));
    f.appendChild(p);
    f.appendChild(TZ.el('b', null, ep.nom));
    f.appendChild(TZ.el('span', 'tz-but', ep.but));
    var record = TZ.record(ep.id);
    var niv = { nom: tzNomNiveau(ep, TZ.niveauDe(ep.id)) };
    var r = TZ.el('span', 'tz-record' + (record ? '' : ' tz-vide'),
      dispo ? (record ? 'Meilleur : ' + record + ' / 100  ·  ' + niv.nom
                      : 'Jamais tenté  ·  ' + niv.nom)
            : 'Carte indisponible');
    f.appendChild(r);
    if (!dispo) { f.disabled = true; f.style.opacity = '.5'; }
    else f.addEventListener('click', function () { tzPreparer(ep); });
    return f;
  }

  function tzReinitialiser() {
    if (!global.confirm(
      'Effacer toutes vos données d’entraînement ?\n\n' +
      'Meilleurs scores, historique et réglages seront perdus. ' +
      'Le jeu de culture générale n’est pas concerné.')) return;
    var n = TZ.effacerTout();
    TZ.etat.stress = 'calme';
    TZ.etat.son = true;
    tzPeindreAccueil();
    global.alert(n + ' entrée(s) effacée(s). Le jeu principal est intact.');
  }

  /* ======================================================= tutoriel
     Trois parties : la règle, un exemple montré, et ce que l'épreuve
     entraîne. L'exemple est le cœur : une consigne écrite peut se lire de
     travers, une vignette ne laisse pas de place au doute. */
  function tzTutoVu(id) { return !!(TZ.lire('tutos', {})[id]); }
  function tzMarquerTutoVu(id) {
    var v = TZ.lire('tutos', {});
    v[id] = true;
    TZ.ecrire('tutos', v);
  }

  function tzTuto(ep, surSuite) {
    if (!ep.tuto) { surSuite(); return; }
    tzEcran('tuto');
    var hote = TZ.vide(TZ.q('#tz-tuto'));
    var boite = TZ.el('div', 'tz-tuto');

    boite.appendChild(TZ.el('span', 'tz-etiquette', 'Comment ça marche'));
    var h = TZ.el('h2', null, ep.nom);
    h.style.cssText = 'font-family:var(--tz-titre);margin:0 0 10px';
    boite.appendChild(h);

    boite.appendChild(TZ.el('p', null, ep.tuto.regle));

    boite.appendChild(TZ.el('h3', null, 'Exemple'));
    try { ep.tuto.exemple.call(ep, boite); }
    catch (e) { boite.appendChild(TZ.el('p', 'tz-vide', 'Exemple indisponible.')); }

    var pq = TZ.el('div', 'tz-pourquoi');
    pq.appendChild(TZ.el('b', null, 'Ce que ça entraîne — '));
    pq.appendChild(document.createTextNode(ep.tuto.pourquoi));
    boite.appendChild(pq);

    UI.actions(boite, [
      { texte: 'J’ai compris, commencer', action: function () {
          tzMarquerTutoVu(ep.id); surSuite(); } },
      { texte: 'Passer', fantome: true, action: function () {
          tzMarquerTutoVu(ep.id); surSuite(); } },
      { texte: 'Retour', fantome: true, action: function () { tzPreparer(ep); } }
    ]);

    hote.appendChild(boite);
  }

  /* ============================================ préparation avant une épreuve */
  function tzPreparer(ep) {
    tzEcran('preparation');
    var hote = TZ.vide(TZ.q('#tz-preparation'));

    var cat = CATEGORIES.filter(function (c) { return c.id === ep.categorie; })[0];
    hote.appendChild(TZ.el('span', 'tz-etiquette', cat ? cat.nom : ep.categorie));
    var h = TZ.el('h2', null, ep.nom);
    h.style.cssText = 'font-family:var(--tz-titre);margin:0 0 6px';
    hote.appendChild(h);
    hote.appendChild(TZ.el('p', null, ep.but));
    var c = TZ.el('p', null, ep.comment);
    c.style.color = 'var(--tz-txt-2)';
    hote.appendChild(c);

    /* --- difficulté --- */
    var courant = TZ.niveauDe(ep.id);
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Difficulté'));
    var segN = TZ.el('div', 'tz-segment');
    TZ.NIVEAUX.forEach(function (n) {
      var b = TZ.el('button', null, tzNomNiveau(ep, n.id));
      b.type = 'button';
      b.setAttribute('aria-pressed', n.id === courant ? 'true' : 'false');
      b.addEventListener('click', function () { TZ.fixerNiveau(ep.id, n.id); tzPreparer(ep); });
      segN.appendChild(b);
    });
    hote.appendChild(segN);
    var resume = TZ.el('p', 'tz-vide', tzResumeNiveau(ep, courant));
    resume.style.margin = '8px 0 4px';
    hote.appendChild(resume);

    /* --- stress --- */
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Niveau de stress'));
    var segS = TZ.el('div', 'tz-segment');
    ['calme', 'modere', 'intense'].forEach(function (id) {
      var b = TZ.el('button', null, TZ.STRESS[id].nom);
      b.type = 'button';
      b.setAttribute('aria-pressed', TZ.etat.stress === id ? 'true' : 'false');
      b.addEventListener('click', function () {
        TZ.etat.stress = id; TZ.ecrire('stress', id); tzPreparer(ep);
      });
      segS.appendChild(b);
    });
    hote.appendChild(segS);

    /* --- distractions ---
       Séparées du stress : on peut vouloir du bruit visuel sans pression
       temporelle, ou l'inverse. Elles ne changent pas le score. */
    var dCourant = TZ.distractionDe(ep.id);
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Distractions'));
    var segD = TZ.el('div', 'tz-segment');
    TZ.DISTRACTIONS.forEach(function (d) {
      var b = TZ.el('button', null, d.nom);
      b.type = 'button';
      b.setAttribute('aria-pressed', d.id === dCourant ? 'true' : 'false');
      b.addEventListener('click', function () {
        TZ.fixerDistraction(ep.id, d.id); tzPreparer(ep);
      });
      segD.appendChild(b);
    });
    hote.appendChild(segD);
    var rd = TZ.el('p', 'tz-vide', TZ.distraction(dCourant).resume
      + ' Visuel uniquement, et sans effet sur le score.');
    rd.style.margin = '8px 0 4px';
    hote.appendChild(rd);

    /* --- record sur cette combinaison précise --- */
    var rec = TZ.record(ep.id, courant, TZ.etat.stress);
    var info = TZ.el('p', rec ? null : 'tz-vide',
      rec ? 'Votre meilleur score en ' + tzNomNiveau(ep, courant) + ' · ' +
            TZ.STRESS[TZ.etat.stress].nom + ' : ' + rec + ' / 100'
          : 'Jamais tenté à ce réglage.');
    info.style.marginTop = '14px';
    hote.appendChild(info);

    var actions = [
      { texte: 'Commencer', action: function () {
          /* la première fois, on passe par le tutoriel */
          if (ep.tuto && !tzTutoVu(ep.id)) tzTuto(ep, function () { tzLancer(ep); });
          else tzLancer(ep);
        } }
    ];
    if (ep.tuto) {
      actions.push({ texte: 'Revoir les règles', fantome: true,
        action: function () { tzTuto(ep, function () { tzLancer(ep); }); } });
    }
    actions.push({ texte: 'Retour', fantome: true, action: function () {
      tzPeindreAccueil(); tzEcran('accueil'); } });
    UI.actions(hote, actions);
  }

  /* ================================================== lancement d'une épreuve */
  var enCours = null;

  function tzLancer(ep, suite) {
    TZ.toutArreter();
    enCours = ep;
    tzEcran('epreuve');

    var idNiveau = suite ? (suite.niveau || TZ.niveauDe(ep.id)) : TZ.niveauDe(ep.id);

    TZ.q('#tz-titre-epreuve').textContent = ep.nom;
    TZ.q('#tz-stress-epreuve').textContent =
      tzNomNiveau(ep, idNiveau) + ' · ' + TZ.STRESS[TZ.etat.stress].nom +
      (suite ? ' · épreuve ' + suite.rang + ' sur ' + suite.total : '');
    TZ.q('#tz-comment').textContent = ep.comment;

    var scene = TZ.q('#tz-scene');
    var bandeau = UI.bandeau(TZ.q('#tz-bandeau'));
    TZ.vide(scene);

    var idDistraction = TZ.distractionDe(ep.id);
    var arretPerturbations = TZ.perturbations(scene, idDistraction);

    /* En défi, tout le monde joue la même chose : on sème le tirage avant
       que l'épreuve ne s'initialise, puisque c'est init() qui tire. */
    var enDefi = !!(suite && suite.defi);
    if (enDefi) TZ.semer(suite.defi.graine);

    var ctx = {
      scene: scene,
      bandeau: bandeau,
      stress: TZ.etat.stress,
      niveau: idNiveau,
      terminer: function () {
        arretPerturbations();
        TZ.toutArreter();
        /* On rend Math.random au plus tôt : le calcul du score et le bilan
           n'ont aucune raison d'être déterministes, et laisser le détournement
           en place déborderait sur l'épreuve suivante. */
        if (enDefi) TZ.liberer();
        var brut = ep.getScore();
        var score = TZ.calculerScore({
          precision: brut.precision, vitesse: brut.vitesse,
          difficulte: brut.difficulte, stress: TZ.etat.stress, niveau: idNiveau
        });
        try { ep.end(); } catch (e) {}
        /* La distraction n'entre pas dans la clé du record : elle ne change
           pas le score, et la découper par réglage émietterait l'historique.
           On la note dans le détail pour qu'elle reste lisible. */
        if (brut.details && idDistraction !== 'aucune') {
          brut.details['Distractions'] = TZ.distraction(idDistraction).nom;
        }
        TZ.enregistrer(ep.id, score, brut.details, idNiveau);
        TZ.son.fin();
        tzBilan(ep, score, brut, suite, idNiveau);
      }
    };

    try {
      ep.init(ctx);
      ep.start();
    } catch (e) {
      if (enDefi) TZ.liberer();
      arretPerturbations();
      TZ.vide(scene);
      UI.message(scene, 'Cette épreuve n’a pas pu démarrer.', 'ko');
    }
  }

  function tzQuitterEpreuve() {
    TZ.toutArreter();
    if (enCours) { try { enCours.end(); } catch (e) {} }
    enCours = null;
    sessionEnCours = null;
    tzPeindreAccueil();
    tzEcran('accueil');
  }

  /* ========================================================== bilan d'épreuve */
  function tzBilan(ep, score, brut, suite, idNiveau) {
    tzEcran('resultat');
    var hote = TZ.vide(TZ.q('#tz-resultat'));

    hote.appendChild(TZ.el('span', 'tz-etiquette',
      ep.nom + ' · ' + tzNomNiveau(ep, idNiveau) + ' · ' + TZ.STRESS[TZ.etat.stress].nom));
    var grand = TZ.el('div', 'tz-score-grand', String(score));
    var sup = TZ.el('sup', null, ' / 100');
    grand.appendChild(sup);
    hote.appendChild(grand);

    var record = TZ.record(ep.id, idNiveau, TZ.etat.stress);
    if (score >= record && score > 0) {
      hote.appendChild(TZ.el('p', null, 'Nouveau record personnel à ce niveau de stress.'));
    }

    var detail = TZ.el('div', 'tz-detail');
    Object.keys(brut.details || {}).forEach(function (k) {
      var d = TZ.el('div');
      d.appendChild(TZ.el('b', null, String(brut.details[k])));
      d.appendChild(TZ.el('span', null, k));
      detail.appendChild(d);
    });
    hote.appendChild(detail);

    var ir = TZ.indiceResistance(ep.id);
    if (ir != null) {
      hote.appendChild(TZ.el('p', null,
        'Indice de résistance au stress sur cette épreuve : ' + ir +
        ' (score en Intense rapporté au score en Calme).'));
    } else {
      hote.appendChild(TZ.el('p', 'tz-vide',
        'Jouez la même épreuve en Calme puis en Intense pour obtenir votre indice de résistance.'));
    }

    /* proposition de progression : seulement hors session, pour ne pas
       interrompre un enchaînement déjà calibré */
    if (!suite) {
      var sup = TZ.niveauSuivant(idNiveau);
      var inf = TZ.niveauPrecedent(idNiveau);
      if (score >= SEUIL_MONTER && sup) {
        var p = TZ.el('div', 'tz-message tz-ok');
        p.textContent = 'Ce niveau vous est acquis. Passer en '
          + tzNomNiveau(ep, sup.id) + ' ?';
        p.style.margin = '18px auto 4px';
        hote.appendChild(p);
        UI.actions(hote, [
          { texte: 'Passer en ' + tzNomNiveau(ep, sup.id), action: function () {
              TZ.fixerNiveau(ep.id, sup.id); tzLancer(ep); } },
          { texte: 'Rester en ' + tzNomNiveau(ep, idNiveau), fantome: true,
            action: function () { tzLancer(ep); } }
        ]);
      } else if (score < SEUIL_DESCENDRE && inf) {
        var q = TZ.el('div', 'tz-message tz-neutre');
        q.textContent = 'Réglage trop exigeant pour l’instant. Essayer en '
          + tzNomNiveau(ep, inf.id) + ' ?';
        q.style.margin = '18px auto 4px';
        hote.appendChild(q);
        UI.actions(hote, [
          { texte: 'Essayer en ' + tzNomNiveau(ep, inf.id), action: function () {
              TZ.fixerNiveau(ep.id, inf.id); tzLancer(ep); } },
          { texte: 'Réessayer en ' + tzNomNiveau(ep, idNiveau), fantome: true,
            action: function () { tzLancer(ep); } }
        ]);
      }
    }

    /* En défi, c'est le salon qui reprend la main : « rejouer » enverrait le
       joueur refaire l'épreuve seul au milieu d'une partie. */
    if (suite && suite.defi) {
      suite.defi.surFin(score, brut, hote);
      return;
    }

    if (suite && suite.rang < suite.total) {
      UI.actions(hote, [
        { texte: 'Épreuve suivante', action: function () { tzSessionSuivante(); } },
        { texte: 'Abandonner la session', fantome: true, action: tzQuitterEpreuve }
      ]);
    } else if (suite) {
      tzBilanSession(hote);
    } else {
      UI.actions(hote, [
        { texte: 'Rejouer', fantome: true, action: function () { tzLancer(ep); } },
        { texte: 'Changer de réglage', fantome: true, action: function () { tzPreparer(ep); } },
        { texte: 'Retour au menu', fantome: true, action: tzQuitterEpreuve },
        { texte: 'Ma progression', fantome: true, action: function () { tzPeindreProgression(); } }
      ]);
    }
  }

  /* ======================================================== session complète */
  var sessionEnCours = null;

  function tzDemarrerSession() {
    /* Les épreuves du parcours seulement : une session ne doit pas tirer la
       hiérarchie de l'autre force. */
    var dispo = tzEpreuvesVisibles().filter(function (e) {
      return !e.requiert || e.requiert !== 'carte' || TZ.carte.preparer();
    });
    if (dispo.length < 3) { global.alert('Pas assez d’épreuves disponibles.'); return; }
    sessionEnCours = {
      lot: TZ.melanger(dispo).slice(0, 5),
      rang: 0,
      scores: [],
      stressDepart: TZ.etat.stress
    };
    tzSessionSuivante();
  }

  function tzSessionSuivante() {
    if (!sessionEnCours) return;
    var s = sessionEnCours;
    if (s.rang > 0) {
      var dernier = TZ.lire('historique', []).slice(-1)[0];
      if (dernier) s.scores.push({ e: dernier.e, s: dernier.s });
    }
    if (s.rang >= s.lot.length) { sessionEnCours = null; return; }

    /* stress et difficulté montent ensemble au fil de la session */
    var paliersStress = ['calme', 'calme', 'modere', 'modere', 'intense'];
    var paliersNiveau = ['decouverte', 'standard', 'standard', 'confirme', 'confirme'];
    TZ.etat.stress = paliersStress[Math.min(s.rang, paliersStress.length - 1)];

    var ep = s.lot[s.rang];
    var niveau = paliersNiveau[Math.min(s.rang, paliersNiveau.length - 1)];
    s.rang++;
    var suite = { rang: s.rang, total: s.lot.length, niveau: niveau };
    if (ep.tuto && !tzTutoVu(ep.id)) tzTuto(ep, function () { tzLancer(ep, suite); });
    else tzLancer(ep, suite);
  }

  function tzBilanSession(hote) {
    var s = sessionEnCours;
    if (!s) return;
    var dernier = TZ.lire('historique', []).slice(-1)[0];
    if (dernier) s.scores.push({ e: dernier.e, s: dernier.s });

    var moyenne = s.scores.length
      ? Math.round(s.scores.reduce(function (a, b) { return a + b.s; }, 0) / s.scores.length) : 0;

    hote.appendChild(TZ.el('h3', null, 'Bilan de session'));
    var liste = TZ.el('ul', 'tz-liste');
    s.scores.forEach(function (x) {
      var ep = TZ.epreuves.filter(function (e) { return e.id === x.e; })[0];
      var li = TZ.el('li');
      li.appendChild(TZ.el('span', null, ep ? ep.nom : x.e));
      li.appendChild(TZ.el('span', 'tz-pts', x.s));
      li.appendChild(TZ.el('span', 'tz-quand', '/ 100'));
      liste.appendChild(li);
    });
    hote.appendChild(liste);
    hote.appendChild(TZ.el('p', null, 'Moyenne de la session : ' + moyenne + ' / 100.'));

    var sessions = TZ.lire('sessions', []);
    sessions.push({ d: Date.now(), moyenne: moyenne, n: s.scores.length });
    TZ.ecrire('sessions', sessions.slice(-100));

    TZ.etat.stress = s.stressDepart;
    sessionEnCours = null;

    hote.appendChild(tzRadar());
    UI.actions(hote, [
      { texte: 'Retour au menu', action: tzQuitterEpreuve },
      { texte: 'Ma progression', fantome: true, action: function () { tzPeindreProgression(); } }
    ]);
  }

  /* =============================================================== profil radar
     Chaque axe est la moyenne des meilleurs scores des épreuves qui s'y
     rattachent. L'axe « résistance » agrège les indices Calme / Intense. */
  function tzProfil() {
    var somme = {}, compte = {};
    AXES.forEach(function (a) { somme[a.id] = 0; compte[a.id] = 0; });

    TZ.epreuves.forEach(function (ep) {
      var r = TZ.record(ep.id);
      if (!r || !somme.hasOwnProperty(ep.axe)) return;
      somme[ep.axe] += r; compte[ep.axe]++;
    });

    var indices = [];
    TZ.epreuves.forEach(function (ep) {
      var ir = TZ.indiceResistance(ep.id);
      if (ir != null) indices.push(Math.min(100, ir));
    });
    if (indices.length) {
      somme.resistance = indices.reduce(function (a, b) { return a + b; }, 0);
      compte.resistance = indices.length;
    }

    return AXES.map(function (a) {
      return { nom: a.nom, valeur: compte[a.id] ? Math.round(somme[a.id] / compte[a.id]) : 0 };
    });
  }

  function tzRadar() {
    var profil = tzProfil();
    var T = 320, C = T / 2, R = T / 2 - 54;
    var cv = TZ.el('canvas', 'tz-radar');
    var ratio = global.devicePixelRatio || 1;
    cv.width = T * ratio; cv.height = T * ratio;
    cv.style.width = T + 'px'; cv.style.height = T + 'px';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label',
      'Profil : ' + profil.map(function (p) { return p.nom + ' ' + p.valeur; }).join(', '));

    var g = cv.getContext('2d');
    g.scale(ratio, ratio);
    var styles = getComputedStyle(document.body);
    var trait = styles.getPropertyValue('--tz-bord').trim() || '#ECE0D2';
    var texte = styles.getPropertyValue('--tz-txt-2').trim() || '#857D95';
    var accent = styles.getPropertyValue('--tz-ac').trim() || '#F5A623';
    var n = profil.length;

    function pt(i, f) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [C + Math.cos(a) * R * f, C + Math.sin(a) * R * f];
    }

    /* toile */
    g.strokeStyle = trait; g.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      g.beginPath();
      for (var i = 0; i <= n; i++) {
        var p = pt(i % n, f);
        if (i === 0) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]);
      }
      g.stroke();
    });
    for (var i = 0; i < n; i++) {
      var p = pt(i, 1);
      g.beginPath(); g.moveTo(C, C); g.lineTo(p[0], p[1]); g.stroke();
    }

    /* valeurs */
    g.beginPath();
    profil.forEach(function (v, i) {
      var p = pt(i, Math.max(0.03, v.valeur / 100));
      if (i === 0) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]);
    });
    g.closePath();
    g.fillStyle = accent + '44';
    g.strokeStyle = accent; g.lineWidth = 2;
    g.fill(); g.stroke();

    profil.forEach(function (v, i) {
      var p = pt(i, Math.max(0.03, v.valeur / 100));
      g.beginPath(); g.arc(p[0], p[1], 3.4, 0, Math.PI * 2);
      g.fillStyle = accent; g.fill();
    });

    /* libellés */
    g.fillStyle = texte;
    g.font = '600 11px "Nunito", system-ui, sans-serif';
    profil.forEach(function (v, i) {
      var p = pt(i, 1.2);
      g.textAlign = Math.abs(p[0] - C) < 12 ? 'center' : (p[0] > C ? 'left' : 'right');
      g.textBaseline = p[1] > C ? 'top' : 'bottom';
      g.fillText(v.nom, p[0], p[1]);
      g.fillStyle = accent;
      g.fillText(String(v.valeur), p[0], p[1] + (p[1] > C ? 13 : -13));
      g.fillStyle = texte;
    });

    var boite = TZ.el('div');
    boite.style.cssText = 'margin:20px 0';
    boite.appendChild(cv);
    return boite;
  }

  /* ============================================================ progression */
  function tzPeindreProgression() {
    tzEcran('progression');
    var hote = TZ.vide(TZ.q('#tz-progression'));

    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Profil'));
    hote.appendChild(tzRadar());

    /* évolution dans le temps */
    var hist = TZ.lire('historique', []);
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Évolution'));
    if (hist.length < 2) {
      hote.appendChild(TZ.el('p', 'tz-vide',
        'Pas encore assez de séances. La courbe apparaîtra après quelques épreuves.'));
    } else {
      hote.appendChild(tzCourbe(hist.slice(-40)));
    }

    /* meilleurs scores par épreuve */
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Meilleurs scores'));
    var liste = TZ.el('ul', 'tz-liste');
    var vide = true;
    TZ.epreuves.forEach(function (ep) {
      var r = TZ.record(ep.id);
      if (!r) return;
      vide = false;
      var ir = TZ.indiceResistance(ep.id);
      var li = TZ.el('li');
      li.appendChild(TZ.el('span', null, ep.nom));
      li.appendChild(TZ.el('span', 'tz-quand', ir != null ? 'résistance ' + ir : ''));
      li.appendChild(TZ.el('span', 'tz-pts', r));
      liste.appendChild(li);
    });
    if (vide) hote.appendChild(TZ.el('p', 'tz-vide', 'Aucune épreuve terminée pour l’instant.'));
    else hote.appendChild(liste);

    /* dernières séances */
    hote.appendChild(TZ.el('span', 'tz-etiquette', 'Dernières séances'));
    if (!hist.length) {
      hote.appendChild(TZ.el('p', 'tz-vide', 'Aucune séance enregistrée.'));
    } else {
      var l2 = TZ.el('ul', 'tz-liste');
      hist.slice(-12).reverse().forEach(function (h) {
        var ep = TZ.epreuves.filter(function (e) { return e.id === h.e; })[0];
        var li = TZ.el('li');
        li.appendChild(TZ.el('span', null, (ep ? ep.nom : h.e) + ' · ' + (TZ.STRESS[h.st] || {}).nom));
        li.appendChild(TZ.el('span', 'tz-quand', new Date(h.d).toLocaleDateString('fr-FR')));
        li.appendChild(TZ.el('span', 'tz-pts', h.s));
        l2.appendChild(li);
      });
      hote.appendChild(l2);
    }

    UI.actions(hote, [{ texte: 'Retour au menu', action: function () {
      tzPeindreAccueil(); tzEcran('accueil');
    } }]);
  }

  function tzCourbe(hist) {
    var L = 520, H = 170, m = 26;
    var cv = TZ.el('canvas', 'tz-radar');
    var ratio = global.devicePixelRatio || 1;
    cv.width = L * ratio; cv.height = H * ratio;
    cv.style.width = '100%'; cv.style.maxWidth = L + 'px'; cv.style.height = 'auto';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'Évolution des scores sur les ' + hist.length + ' dernières épreuves');
    var g = cv.getContext('2d');
    g.scale(ratio, ratio);

    var styles = getComputedStyle(document.body);
    var trait = styles.getPropertyValue('--tz-bord').trim() || '#ECE0D2';
    var texte = styles.getPropertyValue('--tz-txt-3').trim() || '#ABA3B8';
    var accent = styles.getPropertyValue('--tz-ac').trim() || '#F5A623';

    g.strokeStyle = trait; g.lineWidth = 1;
    [0, 50, 100].forEach(function (v) {
      var y = H - m - (v / 100) * (H - m * 2);
      g.beginPath(); g.moveTo(m, y); g.lineTo(L - m, y); g.stroke();
      g.fillStyle = texte; g.font = '600 10px "Nunito", system-ui, sans-serif';
      g.textAlign = 'right'; g.textBaseline = 'middle';
      g.fillText(String(v), m - 6, y);
    });

    var pas = hist.length > 1 ? (L - m * 2) / (hist.length - 1) : 0;
    g.beginPath();
    hist.forEach(function (h, i) {
      var x = m + i * pas;
      var y = H - m - (h.s / 100) * (H - m * 2);
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    });
    g.strokeStyle = accent; g.lineWidth = 2.2;
    g.lineJoin = 'round'; g.stroke();

    hist.forEach(function (h, i) {
      var x = m + i * pas;
      var y = H - m - (h.s / 100) * (H - m * 2);
      g.beginPath(); g.arc(x, y, 2.6, 0, Math.PI * 2);
      g.fillStyle = accent; g.fill();
    });

    var boite = TZ.el('div');
    boite.style.cssText = 'margin:10px 0 22px';
    boite.appendChild(cv);
    return boite;
  }

  /* ================================================================ départ */
  function tzDemarrer() {
    TZ.carte.preparer();
    tzPeindreAccueil();
    tzEcran('accueil');

    var q = TZ.q('#tz-quitter');
    if (q) q.addEventListener('click', tzQuitterEpreuve);
    var p = TZ.q('#tz-vers-progression');
    if (p) p.addEventListener('click', function () { tzPeindreProgression(); });
    var m = TZ.q('#tz-memento-retour');
    if (m) m.addEventListener('click', function () {
      tzPeindreAccueil(); tzEcran('accueil');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tzDemarrer);
  } else {
    tzDemarrer();
  }

  /* Lancer une épreuve dans les conditions d'un salon : réglages imposés par
     l'hôte, tirage semé, et la main rendue au salon à la fin. Le stress du
     joueur est restitué ensuite — un défi ne doit pas modifier ses réglages. */
  function tzLancerDefi(idEpreuve, opts, surFin) {
    var ep = TZ.epreuves.filter(function (e) { return e.id === idEpreuve; })[0];
    if (!ep) return false;
    var stressAvant = TZ.etat.stress;
    TZ.etat.stress = opts.stress || 'calme';
    tzLancer(ep, {
      rang: 1, total: 1, niveau: opts.niveau || 'standard',
      defi: {
        graine: opts.graine,
        surFin: function (score, brut, hote) {
          TZ.etat.stress = stressAvant;
          surFin(score, brut, hote, ep);
        }
      }
    });
    return true;
  }

  /* Le libellé d'un niveau, pour que le salon annonce « École » et non
     « Découverte » sur une épreuve métier. */
  function tzLibelleNiveau(idEpreuve, idNiveau) {
    var ep = TZ.epreuves.filter(function (e) { return e.id === idEpreuve; })[0];
    return tzNomNiveau(ep, idNiveau);
  }

  TZ.app = {
    ecran: tzEcran, accueil: tzPeindreAccueil, progression: tzPeindreProgression,
    epreuvesVisibles: tzEpreuvesVisibles,
    lancerDefi: tzLancerDefi, libelleNiveau: tzLibelleNiveau,
    CATEGORIES: CATEGORIES
  };

})(window);
