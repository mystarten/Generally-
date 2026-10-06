/* =============================================================================
   Zone d'entraînement — moteur.

   Isolation stricte vis-à-vis du jeu :
   - toutes les clés de stockage sont préfixées « training_ » ;
   - toutes les fonctions publiques sont préfixées « tz » ;
   - rien de ce fichier n'écrit ailleurs que dans ces clés.

   Le moteur ne connaît pas les épreuves : il leur fournit un contrat
   (init, start, update, end, getScore) et des services communs — chrono,
   stress, son, affichage. Ajouter une épreuve ne demande donc aucune
   modification ici.
   ============================================================================= */
(function (global) {
  'use strict';

  /* ======================================================= petits utilitaires */
  function tzEl(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte != null) n.textContent = texte;
    return n;
  }
  function tzVide(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function tzQ(sel) { return document.querySelector(sel); }
  function tzBorne(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function tzHasard(n) { return Math.floor(Math.random() * n); }
  function tzMelanger(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = tzHasard(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ============================================================== stockage
     Un seul point d'entrée, et un seul préfixe. Si un jour il faut tout
     effacer, il suffit de balayer les clés qui commencent par PREFIXE. */
  var PREFIXE = 'training_';

  function tzLire(cle, defaut) {
    try {
      var v = localStorage.getItem(PREFIXE + cle);
      return v == null ? defaut : JSON.parse(v);
    } catch (e) { return defaut; }
  }
  function tzEcrire(cle, valeur) {
    try { localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur)); return true; }
    catch (e) { return false; }
  }
  function tzEffacerTout() {
    try {
      var aSupprimer = [];
      for (var i = 0; i < localStorage.length; i++) {
        var c = localStorage.key(i);
        if (c && c.indexOf(PREFIXE) === 0) aSupprimer.push(c);
      }
      aSupprimer.forEach(function (c) { localStorage.removeItem(c); });
      return aSupprimer.length;
    } catch (e) { return 0; }
  }

  /* ==================================================================== son
     Web Audio uniquement : aucun fichier externe. Les sons sont courts et
     volontairement discrets — il s'agit d'un espace de concentration. */
  var ctxAudio = null;
  function tzAudio() {
    if (!ctxAudio) {
      var C = global.AudioContext || global.webkitAudioContext;
      if (!C) return null;
      ctxAudio = new C();
    }
    if (ctxAudio.state === 'suspended') { try { ctxAudio.resume(); } catch (e) {} }
    return ctxAudio;
  }
  function tzTon(freq, duree, forme, vol, delai) {
    if (!tzEtat.son) return;
    try {
      var c = tzAudio(); if (!c) return;
      var o = c.createOscillator(), g = c.createGain();
      o.type = forme || 'sine';
      o.frequency.value = freq;
      var t0 = c.currentTime + (delai || 0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol || 0.1, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + duree + 0.03);
    } catch (e) {}
  }
  var tzSon = {
    juste:   function () { tzTon(660, .09, 'triangle', .11, 0); tzTon(880, .13, 'triangle', .10, .07); },
    faux:    function () { tzTon(300, .14, 'triangle', .11, 0); tzTon(220, .2, 'triangle', .09, .1); },
    bip:     function () { tzTon(880, .05, 'sine', .08, 0); },
    tic:     function () { tzTon(1200, .035, 'sine', .05, 0); },
    depart:  function () { tzTon(523, .1, 'triangle', .1, 0); tzTon(784, .18, 'triangle', .1, .1); },
    fin:     function () { [523, 659, 784, 1046].forEach(function (f, i) {
               tzTon(f, i === 3 ? .35 : .11, 'triangle', .1, i * .1); }); },
    /* bruit parasite du mode Intense : court, sourd, désagréable sans être agressif */
    parasite: function () {
      if (!tzEtat.son) return;
      try {
        var c = tzAudio(); if (!c) return;
        var n = c.sampleRate * 0.12;
        var tampon = c.createBuffer(1, n, c.sampleRate);
        var d = tampon.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var src = c.createBufferSource(); src.buffer = tampon;
        var g = c.createGain(); g.gain.value = 0.045;
        var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900;
        src.connect(f); f.connect(g); g.connect(c.destination);
        src.start();
      } catch (e) {}
    }
  };

  /* ================================================================ stress
     Trois niveaux. Chaque niveau est un jeu de réglages que les épreuves
     consultent ; aucune épreuve n'a besoin de connaître leur détail. */
  var TZ_STRESS = {
    calme:   { id: 'calme',   nom: 'Calme',   facteur: 1,
               chrono: 1.0, interruptions: false, distracteurs: false, penalite: 0 },
    modere:  { id: 'modere',  nom: 'Modéré',  facteur: 1.15,
               chrono: 0.78, interruptions: true,  distracteurs: false, penalite: 0.5 },
    intense: { id: 'intense', nom: 'Intense', facteur: 1.3,
               chrono: 0.58, interruptions: true,  distracteurs: true,  penalite: 1 }
  };

  /* =============================================================== niveaux
     Chaque épreuve interprète le niveau à sa façon : plus d'objets, moins de
     temps, une séquence plus longue. Le moteur ne fixe que le facteur de
     score et l'ordre de progression. */
  var TZ_NIVEAUX = [
    { id: 'decouverte', nom: 'Découverte', facteur: 0.90,
      resume: 'Pour prendre la main. Temps large, peu d’éléments.' },
    { id: 'standard',   nom: 'Standard',   facteur: 1.00,
      resume: 'Le réglage de référence.' },
    { id: 'confirme',   nom: 'Confirmé',   facteur: 1.08,
      resume: 'Plus d’éléments, moins de temps.' },
    { id: 'expert',     nom: 'Expert',     facteur: 1.15,
      resume: 'Marge d’erreur très faible.' }
  ];
  function tzNiveau(id) {
    return TZ_NIVEAUX.filter(function (n) { return n.id === id; })[0] || TZ_NIVEAUX[1];
  }
  function tzNiveauSuivant(id) {
    var i = TZ_NIVEAUX.map(function (n) { return n.id; }).indexOf(id);
    return (i >= 0 && i < TZ_NIVEAUX.length - 1) ? TZ_NIVEAUX[i + 1] : null;
  }
  function tzNiveauPrecedent(id) {
    var i = TZ_NIVEAUX.map(function (n) { return n.id; }).indexOf(id);
    return i > 0 ? TZ_NIVEAUX[i - 1] : null;
  }
  /* niveau retenu pour une épreuve donnée ; chacune garde le sien */
  function tzNiveauDe(idEpreuve) {
    var carte = tzLire('niveaux', {});
    return carte[idEpreuve] || 'standard';
  }
  function tzFixerNiveau(idEpreuve, idNiveau) {
    var carte = tzLire('niveaux', {});
    carte[idEpreuve] = idNiveau;
    tzEcrire('niveaux', carte);
  }

  var TZ_INTERRUPTIONS = [
    { titre: 'Message', corps: 'Signal reçu. Ignorez cette alerte et poursuivez.' },
    { titre: 'Contrôle', corps: 'Vérification en cours. Ne vous arrêtez pas.' },
    { titre: 'Consigne', corps: 'La consigne reste inchangée. Continuez.' },
    { titre: 'Radio', corps: 'Transmission parasite. Aucune action requise.' },
    { titre: 'Alerte', corps: 'Fausse alerte. Restez sur votre tâche.' }
  ];

  /* ================================================================== état */
  var tzEtat = {
    son: tzLire('son', true),
    stress: tzLire('stress', 'calme'),
    epreuve: null,       // module en cours
    minuteurs: [],       // tout ce qui doit être nettoyé en quittant
    session: null        // suite d'épreuves en cours, le cas échéant
  };

  /* Les épreuves passent par là pour tout minuteur : le moteur garantit
     qu'aucun ne survit à la fin d'une épreuve. */
  function tzApres(ms, fn) {
    var id = setTimeout(function () { tzRetirer(id); fn(); }, ms);
    tzEtat.minuteurs.push({ id: id, type: 'timeout' });
    return id;
  }
  function tzChaque(ms, fn) {
    var id = setInterval(fn, ms);
    tzEtat.minuteurs.push({ id: id, type: 'interval' });
    return id;
  }
  function tzRetirer(id) {
    tzEtat.minuteurs = tzEtat.minuteurs.filter(function (m) { return m.id !== id; });
  }
  function tzToutArreter() {
    tzEtat.minuteurs.forEach(function (m) {
      if (m.type === 'interval') clearInterval(m.id); else clearTimeout(m.id);
    });
    tzEtat.minuteurs = [];
  }

  /* ============================================================= scoring
     Un score sur 100 pour toutes les épreuves, calculé de la même façon :
     la précision pèse le plus, la vitesse et la difficulté atteinte
     complètent. Le niveau de stress applique ensuite un facteur, car la
     même performance sous contrainte vaut davantage. */
  function tzCalculerScore(opts) {
    var precision = tzBorne(opts.precision == null ? 1 : opts.precision, 0, 1);
    var vitesse   = tzBorne(opts.vitesse == null ? 0.5 : opts.vitesse, 0, 1);
    var difficulte = tzBorne(opts.difficulte == null ? 0.5 : opts.difficulte, 0, 1);
    var brut = 100 * (0.55 * precision + 0.20 * vitesse + 0.25 * difficulte);
    var facteur = (TZ_STRESS[opts.stress] || TZ_STRESS.calme).facteur
                * tzNiveau(opts.niveau).facteur;
    return Math.round(tzBorne(brut * facteur, 0, 100));
  }

  /* Convertit un temps de réaction en note de vitesse entre 0 et 1.
     250 ms ou moins vaut 1, 900 ms ou plus vaut 0. */
  function tzNoteVitesse(msMoyen) {
    if (!isFinite(msMoyen) || msMoyen <= 0) return 0;
    return tzBorne((900 - msMoyen) / 650, 0, 1);
  }

  /* =============================================== enregistrement d'un résultat */
  function tzEnregistrer(idEpreuve, score, infos, idNiveau) {
    var niveau = idNiveau || tzNiveauDe(idEpreuve);
    var records = tzLire('records', {});
    var cle = idEpreuve + ':' + niveau + ':' + tzEtat.stress;
    if (!records[cle] || score > records[cle]) records[cle] = score;
    tzEcrire('records', records);

    var hist = tzLire('historique', []);
    hist.push({
      e: idEpreuve, s: score, st: tzEtat.stress, n: niveau,
      d: Date.now(), i: infos || {}
    });
    tzEcrire('historique', hist.slice(-300));
  }

  /* Sans argument : le meilleur score toutes difficultés et tous stress
     confondus. Avec niveau et stress : la combinaison exacte. */
  function tzRecord(idEpreuve, idNiveau, stress) {
    var records = tzLire('records', {});
    if (idNiveau && stress) return records[idEpreuve + ':' + idNiveau + ':' + stress] || 0;
    var meilleur = 0;
    Object.keys(records).forEach(function (c) {
      var m = c.split(':');
      if (m[0] !== idEpreuve) return;
      if (idNiveau && m[1] !== idNiveau) return;
      if (stress && m[2] !== stress) return;
      if (records[c] > meilleur) meilleur = records[c];
    });
    return meilleur;
  }

  /* Indice de résistance : ce que l'on conserve de sa performance une fois
     sous contrainte. 100 signifie aucune dégradation. */
  function tzIndiceResistance(idEpreuve) {
    /* on compare au même niveau, sinon on mesurerait la difficulté et non
       la résistance. On retient le niveau le plus élevé où les deux existent. */
    var ordre = TZ_NIVEAUX.map(function (n) { return n.id; }).slice().reverse();
    for (var i = 0; i < ordre.length; i++) {
      var calme = tzRecord(idEpreuve, ordre[i], 'calme');
      var intense = tzRecord(idEpreuve, ordre[i], 'intense');
      if (calme && intense) return Math.round(intense / calme * 100);
    }
    return null;
  }

  /* ===================================================== interruptions et bruit */
  function tzDeclencherDistracteur(scene) {
    var reglage = TZ_STRESS[tzEtat.stress];
    if (!reglage.distracteurs || !scene) return;
    var tirage = Math.random();
    if (tirage < 0.34) {
      scene.classList.add('tz-flash');
      tzApres(220, function () { scene.classList.remove('tz-flash'); });
    } else if (tirage < 0.67) {
      scene.classList.add('tz-secousse');
      tzApres(420, function () { scene.classList.remove('tz-secousse'); });
    } else {
      tzSon.parasite();
    }
  }

  function tzDeclencherInterruption(scene) {
    var reglage = TZ_STRESS[tzEtat.stress];
    if (!reglage.interruptions || !scene) return;
    var m = TZ_INTERRUPTIONS[tzHasard(TZ_INTERRUPTIONS.length)];
    var boite = tzEl('div', 'tz-interruption');
    boite.appendChild(tzEl('b', null, m.titre));
    boite.appendChild(tzEl('span', null, m.corps));
    scene.appendChild(boite);
    tzSon.bip();
    tzApres(2600, function () { if (boite.parentNode) boite.parentNode.removeChild(boite); });
  }

  /* Programme le harcèlement pendant toute la durée d'une épreuve.
     Renvoie une fonction d'arrêt. */
  function tzLancerPerturbations(scene) {
    var reglage = TZ_STRESS[tzEtat.stress];
    if (!reglage.interruptions && !reglage.distracteurs) return function () {};
    var idA = tzChaque(reglage.distracteurs ? 4200 : 9000, function () {
      tzDeclencherDistracteur(scene);
    });
    var idB = tzChaque(reglage.interruptions ? 11000 : 99999, function () {
      tzDeclencherInterruption(scene);
    });
    return function () { clearInterval(idA); clearInterval(idB); tzRetirer(idA); tzRetirer(idB); };
  }

  /* ================================================================= chrono
     Barre qui se vide. La durée de base est multipliée par le réglage de
     stress : la même épreuve laisse moins de temps en Intense. */
  function tzChrono(dureeMs, surJauge, surFin) {
    var duree = dureeMs * TZ_STRESS[tzEtat.stress].chrono;
    var debut = performance.now();
    var fini = false;
    var raf = 0;

    /* requestAnimationFrame est suspendu dès que la fenêtre n’est plus peinte.
       Il peint la jauge, il ne porte pas l’échéance : celle-ci tient sur un
       minuteur, sinon un simple Alt-Tab figerait le chrono — et les records
       enregistrés ici ne voudraient plus rien dire. */
    function terminer() {
      if (fini) return;
      fini = true;
      clearTimeout(echeance);
      cancelAnimationFrame(raf);
      if (surJauge) surJauge(0);
      if (surFin) surFin();
    }
    /* passe par tzApres pour que toutArreter() le coupe aussi, si une
       épreuve quittait la scène sans appeler arreter() */
    var echeance = tzApres(duree, terminer);

    function boucle() {
      if (fini) return;
      var reste = duree - (performance.now() - debut);
      if (reste <= 0) { terminer(); return; }
      if (surJauge) surJauge(reste / duree);
      raf = requestAnimationFrame(boucle);
    }
    raf = requestAnimationFrame(boucle);

    return {
      duree: duree,
      reste: function () { return Math.max(0, duree - (performance.now() - debut)); },
      ecoule: function () { return performance.now() - debut; },
      arreter: function () {
        fini = true;
        clearTimeout(echeance);
        cancelAnimationFrame(raf);
      }
    };
  }

  /* ================================================== exposition du moteur */
  global.TZ = {
    el: tzEl, vide: tzVide, q: tzQ, borne: tzBorne,
    hasard: tzHasard, melanger: tzMelanger,
    lire: tzLire, ecrire: tzEcrire, effacerTout: tzEffacerTout,
    son: tzSon, audio: tzAudio,
    STRESS: TZ_STRESS, etat: tzEtat,
    apres: tzApres, chaque: tzChaque, toutArreter: tzToutArreter,
    NIVEAUX: TZ_NIVEAUX, niveau: tzNiveau,
    niveauSuivant: tzNiveauSuivant, niveauPrecedent: tzNiveauPrecedent,
    niveauDe: tzNiveauDe, fixerNiveau: tzFixerNiveau,
    calculerScore: tzCalculerScore, noteVitesse: tzNoteVitesse,
    enregistrer: tzEnregistrer, record: tzRecord, indiceResistance: tzIndiceResistance,
    perturbations: tzLancerPerturbations, chrono: tzChrono,
    distracteur: tzDeclencherDistracteur, interruption: tzDeclencherInterruption,
    /* registre des épreuves : chaque module s'y inscrit lui-même */
    epreuves: []
  };

})(window);
