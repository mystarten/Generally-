/* =============================================================================
   Zone d'entraînement — épreuves de terrain.

   Trois exercices qui ne sont pas des quiz : ils entraînent des gestes
   d'observation, et ce sont ceux dont un policier ou un gendarme se sert
   plusieurs fois par service.

     — Signalement à vue : un individu apparaît EN IMAGE quelques secondes,
       puis disparaît. On répond ensuite sur ce qu'on a vu. C'est exactement la
       situation d'un témoin, ou la sienne après un refus d'obtempérer.

       À ne pas confondre avec « Mémoire de signalement », qui existait déjà
       dans epreuves-memoire.js : celle-là fait LIRE une fiche de signalement
       rédigée, celle-ci fait REGARDER une personne. Lire et voir ne sollicitent
       pas la même mémoire, et c'est la seconde qu'on exerce sur le terrain —
       personne ne tend une fiche au moment d'un refus d'obtempérer. Les deux se
       complètent donc, et gardent chacune son identifiant et ses records.

     — Plaques recherchées : on mémorise des plaques, puis un flux défile et
       il faut réagir sur les bonnes, sans réagir sur les autres. Mémoire,
       attention soutenue et inhibition dans le même exercice.

     — Transmissions : épeler en alphabet OTAN, dans les deux sens, contre le
       chrono.

   Rien ici ne demande de connaissance juridique : ce sont des aptitudes, et
   elles se travaillent. D'où la place dans une catégorie à part.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;
  var NS = 'http://www.w3.org/2000/svg';

  /* =========================================================================
     1. RELEVER UN SIGNALEMENT
     ========================================================================= */

  /* Les traits possibles. Chacun est un attribut qu'on pourra interroger :
     la valeur montrée devient la bonne réponse, les autres valeurs du même
     attribut deviennent les distracteurs. C'est ce qui rend les questions
     automatiquement cohérentes — on ne demande jamais une couleur de veste
     parmi des coupes de cheveux. */
  var COULEURS = [
    { nom: 'rouge',  hex: '#C0392B' },
    { nom: 'bleu',   hex: '#2C5BA8' },
    { nom: 'vert',   hex: '#2E7D4F' },
    { nom: 'noir',   hex: '#2B2B33' },
    { nom: 'blanc',  hex: '#ECECEC' },
    { nom: 'gris',   hex: '#8A8A93' },
    { nom: 'jaune',  hex: '#D8A62A' },
    { nom: 'orange', hex: '#D4762B' },
    { nom: 'violet', hex: '#6B4C9A' },
    { nom: 'beige',  hex: '#C9B291' }
  ];

  var TRAITS = {
    sexe:       { libelle: 'Sexe apparent', valeurs: ['homme', 'femme'] },
    age:        { libelle: 'Âge apparent',
                  valeurs: ['15-20 ans', '20-30 ans', '30-40 ans', '40-50 ans', 'plus de 50 ans'] },
    corpulence: { libelle: 'Corpulence', valeurs: ['mince', 'moyenne', 'forte', 'athlétique'] },
    taille:     { libelle: 'Taille', valeurs: ['petite', 'moyenne', 'grande'] },
    cheveux:    { libelle: 'Cheveux',
                  valeurs: ['bruns courts', 'bruns longs', 'blonds courts', 'blonds longs',
                            'châtains courts', 'roux courts', 'gris courts', 'crâne rasé'] },
    couvreChef: { libelle: 'Couvre-chef',
                  valeurs: ['aucun', 'casquette', 'bonnet', 'capuche relevée'] },
    haut:       { libelle: 'Vêtement du haut',
                  valeurs: ['sweat à capuche', 'blouson', 'veste', 'tee-shirt', 'chemise', 'doudoune'] },
    bas:        { libelle: 'Vêtement du bas',
                  valeurs: ['jean', 'pantalon de survêtement', 'pantalon de toile', 'short'] },
    chaussures: { libelle: 'Chaussures',
                  valeurs: ['baskets claires', 'baskets foncées', 'chaussures de ville', 'bottes'] },
    signe:      { libelle: 'Signe particulier',
                  valeurs: ['aucun', 'barbe fournie', 'lunettes', 'cicatrice à la joue',
                            'tatouage au cou', 'boiterie', 'sac à dos'] }
  };

  /* Tire un individu complet. Les couleurs du haut et du bas sont tirées à
     part, pour pouvoir les interroger séparément. */
  function tzTirerIndividu() {
    function une(liste) { return liste[TZ.hasard(liste.length)]; }
    var i = {};
    Object.keys(TRAITS).forEach(function (k) { i[k] = une(TRAITS[k].valeurs); });
    i.couleurHaut = une(COULEURS);
    /* Un bas de la même couleur que le haut rendrait la question « couleur du
       bas » indiscernable de « couleur du haut » dans le souvenir. */
    do { i.couleurBas = une(COULEURS); } while (i.couleurBas.nom === i.couleurHaut.nom);
    /* La capuche relevée suppose un vêtement à capuche : sinon l'image est
       incohérente, et un candidat attentif aurait raison de protester. */
    if (i.couvreChef === 'capuche relevée') i.haut = 'sweat à capuche';
    return i;
  }

  /* --------------------------------------------------- dessin de l'individu
     Un schéma, assumé comme tel : silhouette, blocs de vêtements colorés,
     cheveux, couvre-chef, signe particulier. On ne cherche pas la
     ressemblance mais la LISIBILITÉ des attributs — ce sont eux qu'on
     relève sur un signalement, et eux qu'on va demander. */
  function tzRect(svg, x, y, l, h, remplissage, rx) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', String(x)); r.setAttribute('y', String(y));
    r.setAttribute('width', String(l)); r.setAttribute('height', String(h));
    if (rx) r.setAttribute('rx', String(rx));
    r.setAttribute('fill', remplissage);
    svg.appendChild(r);
    return r;
  }

  function tzCercle(svg, cx, cy, r, remplissage) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy));
    c.setAttribute('r', String(r)); c.setAttribute('fill', remplissage);
    svg.appendChild(c);
    return c;
  }

  var TEINTE_CHEVEUX = {
    bruns: '#4A3524', blonds: '#C9A253', châtains: '#6B4B2F',
    roux: '#A8502A', gris: '#9A9AA2'
  };

  function tzFigure(ind, hauteur) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 200');
    svg.setAttribute('height', String(hauteur || 240));
    svg.setAttribute('class', 'tz-figure');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', tzDecrireIndividu(ind));

    var largeur = ind.corpulence === 'forte' ? 1.22
                : ind.corpulence === 'mince' ? 0.84
                : ind.corpulence === 'athlétique' ? 1.08 : 1;
    var cx = 60;
    var torseL = 40 * largeur;
    var peau = '#D9A878';

    /* jambes */
    var basCourt = ind.bas === 'short';
    var jambeH = basCourt ? 34 : 62;
    tzRect(svg, cx - torseL / 2 + 2, 118, torseL / 2 - 3, jambeH, ind.couleurBas.hex, 4);
    tzRect(svg, cx + 1, 118, torseL / 2 - 3, jambeH, ind.couleurBas.hex, 4);
    if (basCourt) {
      tzRect(svg, cx - torseL / 2 + 4, 152, torseL / 2 - 7, 26, peau, 4);
      tzRect(svg, cx + 3, 152, torseL / 2 - 7, 26, peau, 4);
    }

    /* chaussures */
    var teinteCh = ind.chaussures === 'baskets claires' ? '#E8E4DC'
                 : ind.chaussures === 'baskets foncées' ? '#33333B'
                 : ind.chaussures === 'bottes' ? '#4A3524' : '#23232A';
    var hCh = ind.chaussures === 'bottes' ? 16 : 9;
    tzRect(svg, cx - torseL / 2, 180 - hCh + 9, torseL / 2 + 1, hCh, teinteCh, 3);
    tzRect(svg, cx - 1, 180 - hCh + 9, torseL / 2 + 1, hCh, teinteCh, 3);

    /* torse et manches */
    var manchesCourtes = ind.haut === 'tee-shirt';
    tzRect(svg, cx - torseL / 2 - 9, 62, 9, manchesCourtes ? 22 : 48, ind.couleurHaut.hex, 4);
    tzRect(svg, cx + torseL / 2, 62, 9, manchesCourtes ? 22 : 48, ind.couleurHaut.hex, 4);
    if (manchesCourtes) {
      tzRect(svg, cx - torseL / 2 - 8, 84, 7, 26, peau, 3);
      tzRect(svg, cx + torseL / 2 + 1, 84, 7, 26, peau, 3);
    }
    tzRect(svg, cx - torseL / 2, 58, torseL, 62, ind.couleurHaut.hex, 7);

    /* le vêtement se lit aussi à sa fermeture : une veste et une chemise
       s'ouvrent, un sweat non */
    if (ind.haut === 'veste' || ind.haut === 'blouson' || ind.haut === 'chemise') {
      var trait = document.createElementNS(NS, 'line');
      trait.setAttribute('x1', String(cx)); trait.setAttribute('y1', '60');
      trait.setAttribute('x2', String(cx)); trait.setAttribute('y2', '118');
      trait.setAttribute('stroke', 'rgba(0,0,0,.35)');
      trait.setAttribute('stroke-width', '2');
      svg.appendChild(trait);
    }
    if (ind.haut === 'doudoune') {
      [72, 86, 100].forEach(function (y) {
        var l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', String(cx - torseL / 2 + 3)); l.setAttribute('y1', String(y));
        l.setAttribute('x2', String(cx + torseL / 2 - 3)); l.setAttribute('y2', String(y));
        l.setAttribute('stroke', 'rgba(0,0,0,.22)');
        l.setAttribute('stroke-width', '2');
        svg.appendChild(l);
      });
    }

    /* cou et tête */
    tzRect(svg, cx - 6, 50, 12, 12, peau, 3);
    tzCercle(svg, cx, 38, 17, peau);

    /* cheveux : la teinte vient du premier mot, la longueur du second */
    if (ind.cheveux !== 'crâne rasé') {
      var mots = ind.cheveux.split(' ');
      var teinte = TEINTE_CHEVEUX[mots[0]] || '#4A3524';
      var longs = mots[1] === 'longs';
      var cap = document.createElementNS(NS, 'path');
      cap.setAttribute('d', 'M' + (cx - 17) + ',36 a17,17 0 0 1 34,0 z');
      cap.setAttribute('fill', teinte);
      svg.appendChild(cap);
      if (longs) {
        tzRect(svg, cx - 19, 34, 7, 26, teinte, 3);
        tzRect(svg, cx + 12, 34, 7, 26, teinte, 3);
      }
    }

    /* signe particulier : il doit SE VOIR, c'est tout son intérêt */
    if (ind.signe === 'barbe fournie') {
      var barbe = document.createElementNS(NS, 'path');
      barbe.setAttribute('d', 'M' + (cx - 13) + ',42 a13,14 0 0 0 26,0 a13,20 0 0 1 -26,0 z');
      barbe.setAttribute('fill', '#3B2A1C');
      svg.appendChild(barbe);
    } else if (ind.signe === 'lunettes') {
      tzCercle(svg, cx - 6, 37, 5, 'rgba(255,255,255,.55)');
      tzCercle(svg, cx + 6, 37, 5, 'rgba(255,255,255,.55)');
      var pont = document.createElementNS(NS, 'line');
      pont.setAttribute('x1', String(cx - 1)); pont.setAttribute('y1', '37');
      pont.setAttribute('x2', String(cx + 1)); pont.setAttribute('y2', '37');
      pont.setAttribute('stroke', '#2B2B33'); pont.setAttribute('stroke-width', '2');
      svg.appendChild(pont);
      [cx - 6, cx + 6].forEach(function (x) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', String(x)); c.setAttribute('cy', '37');
        c.setAttribute('r', '5'); c.setAttribute('fill', 'none');
        c.setAttribute('stroke', '#2B2B33'); c.setAttribute('stroke-width', '2');
        svg.appendChild(c);
      });
    } else if (ind.signe === 'cicatrice à la joue') {
      var cic = document.createElementNS(NS, 'line');
      cic.setAttribute('x1', String(cx + 8)); cic.setAttribute('y1', '38');
      cic.setAttribute('x2', String(cx + 12)); cic.setAttribute('y2', '47');
      cic.setAttribute('stroke', '#A8402A'); cic.setAttribute('stroke-width', '2.4');
      cic.setAttribute('stroke-linecap', 'round');
      svg.appendChild(cic);
    } else if (ind.signe === 'tatouage au cou') {
      tzRect(svg, cx - 5, 52, 10, 7, '#2E4A7A', 2);
    } else if (ind.signe === 'sac à dos') {
      tzRect(svg, cx + torseL / 2 + 8, 66, 13, 34, '#4A4A55', 4);
      var bret = document.createElementNS(NS, 'line');
      bret.setAttribute('x1', String(cx + torseL / 2 - 2)); bret.setAttribute('y1', '62');
      bret.setAttribute('x2', String(cx + torseL / 2 + 9)); bret.setAttribute('y2', '70');
      bret.setAttribute('stroke', '#4A4A55'); bret.setAttribute('stroke-width', '3');
      svg.appendChild(bret);
    } else if (ind.signe === 'boiterie') {
      /* une boiterie ne se dessine pas : on la signale par un appui marqué */
      var canne = document.createElementNS(NS, 'line');
      canne.setAttribute('x1', String(cx + torseL / 2 + 12)); canne.setAttribute('y1', '96');
      canne.setAttribute('x2', String(cx + torseL / 2 + 12)); canne.setAttribute('y2', '186');
      canne.setAttribute('stroke', '#6B5B47'); canne.setAttribute('stroke-width', '3');
      canne.setAttribute('stroke-linecap', 'round');
      svg.appendChild(canne);
    }

    /* couvre-chef, dessiné après les cheveux puisqu'il les recouvre */
    if (ind.couvreChef === 'casquette') {
      tzRect(svg, cx - 17, 26, 34, 10, '#33333B', 4);
      tzRect(svg, cx - 25, 33, 20, 5, '#33333B', 2);
    } else if (ind.couvreChef === 'bonnet') {
      var bon = document.createElementNS(NS, 'path');
      bon.setAttribute('d', 'M' + (cx - 17) + ',34 a17,17 0 0 1 34,0 z');
      bon.setAttribute('fill', '#2E5BA8');
      svg.appendChild(bon);
      tzRect(svg, cx - 18, 32, 36, 6, '#24467F', 2);
    } else if (ind.couvreChef === 'capuche relevée') {
      var cap2 = document.createElementNS(NS, 'path');
      cap2.setAttribute('d', 'M' + (cx - 22) + ',44 a22,24 0 0 1 44,0 q-10,-8 -22,-8 t-22,8 z');
      cap2.setAttribute('fill', ind.couleurHaut.hex);
      svg.appendChild(cap2);
    }

    return svg;
  }

  /* Le signalement en une phrase : alternative accessible, et ce qu'on
     affiche à la correction. L'ordre est celui du message radio — du plus
     stable au plus fugace. */
  function tzDecrireIndividu(i) {
    return i.sexe + ', ' + i.age + ', taille ' + i.taille + ', corpulence ' + i.corpulence
         + ', cheveux ' + i.cheveux
         + (i.couvreChef === 'aucun' ? ', sans couvre-chef' : ', ' + i.couvreChef)
         + ', ' + i.haut + ' ' + i.couleurHaut.nom
         + ', ' + i.bas + ' ' + i.couleurBas.nom
         + ', ' + i.chaussures
         + (i.signe === 'aucun' ? ', aucun signe particulier' : ', ' + i.signe);
  }

  /* Les attributs interrogeables, et comment lire la réponse sur l'individu. */
  var QUESTIONS_SIGNALEMENT = [
    { cle: 'couleurHaut', enonce: 'De quelle couleur était le vêtement du haut ?',
      lire: function (i) { return i.couleurHaut.nom; },
      valeurs: function () { return COULEURS.map(function (c) { return c.nom; }); } },
    { cle: 'couleurBas', enonce: 'De quelle couleur était le vêtement du bas ?',
      lire: function (i) { return i.couleurBas.nom; },
      valeurs: function () { return COULEURS.map(function (c) { return c.nom; }); } },
    { cle: 'haut', enonce: 'Quel vêtement du haut portait-il ?' },
    { cle: 'bas', enonce: 'Quel vêtement du bas portait-il ?' },
    { cle: 'couvreChef', enonce: 'Que portait-il sur la tête ?' },
    { cle: 'cheveux', enonce: 'Comment étaient ses cheveux ?' },
    { cle: 'chaussures', enonce: 'Quelles chaussures portait-il ?' },
    { cle: 'signe', enonce: 'Quel signe particulier présentait-il ?' },
    { cle: 'corpulence', enonce: 'Quelle était sa corpulence ?' },
    { cle: 'age', enonce: 'Quel âge paraissait-il avoir ?' },
    { cle: 'taille', enonce: 'Quelle était sa taille apparente ?' }
  ];

  TZ.epreuves.push({
    id: 'signalement-visuel',
    nom: 'Signalement à vue',
    categorie: 'terrain',
    axe: 'memoireVisuelle',
    force: 'commun',
    but: 'Retenir ce qu’il faut d’un individu VU quelques secondes, et le restituer juste.',
    comment: 'Un individu apparaît en image, puis disparaît. Répondez ensuite sur ce que vous avez vu.',

    tuto: {
      regle: 'Un individu s’affiche quelques secondes, puis l’écran se vide. On vous '
           + 'interroge alors sur ce que vous avez vu. Ne cherchez pas à tout retenir : '
           + 'prenez d’abord ce qui ne change pas — silhouette, cheveux, signe '
           + 'particulier — puis les vêtements du haut vers le bas.',
      exemple: function (hote) {
        var ind = tzTirerIndividu();
        var boite = TZ.el('div', 'tz-signalement-apercu');
        boite.appendChild(tzFigure(ind, 190));
        var txt = TZ.el('div');
        txt.appendChild(TZ.el('b', null, 'Ce qu’on en dit par radio'));
        txt.appendChild(TZ.el('p', null, tzDecrireIndividu(ind) + '.'));
        boite.appendChild(txt);
        hote.appendChild(boite);
        hote.appendChild(TZ.el('p', null,
          'C’est l’ordre du message : sexe et âge apparent, silhouette, cheveux, '
          + 'couvre-chef, puis le haut, le bas, les chaussures — et le signe '
          + 'particulier pour finir, parce que c’est lui qui permettra la levée de doute.'));
        hote.appendChild(TZ.el('p', 'tz-vide',
          'Les figures sont des schémas : ce qui compte est la lisibilité des '
          + 'attributs, pas la ressemblance.'));
      },
      pourquoi: 'C’est le relevé de signalement, et c’est une compétence qui se travaille — '
              + 'la méthode du portrait parlé s’enseigne aux policiers depuis 1895 et aux '
              + 'gendarmes depuis 1902. Un témoin oublie en trente secondes ; un '
              + 'professionnel entraîné retient l’essentiel et le transmet dans le bon ordre.'
    },

    reglages: {
      decouverte: { vue: 7000, questions: 3, manches: 4, limite: 16000, individus: 1 },
      standard:   { vue: 5000, questions: 4, manches: 5, limite: 14000, individus: 1 },
      confirme:   { vue: 3800, questions: 5, manches: 5, limite: 12000, individus: 1 },
      expert:     { vue: 3200, questions: 4, manches: 5, limite: 11000, individus: 2 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.manche = 0;
      this.posees = 0;
      this.justes = 0;
      this.temps = [];
      this.ratees = [];
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.manchesuivante(); },
                { sansChiffres: true });
    },

    manchesuivante: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      this.manche++;
      if (this.manche > this.r.manches) { ctx.terminer(); return; }

      /* Au palier le plus haut, deux individus : il faut non seulement
         retenir, mais savoir DE QUI on parle. */
      this.individus = [];
      for (var k = 0; k < this.r.individus; k++) {
        this.individus.push(tzTirerIndividu());
      }

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.r.individus > 1
        ? 'Observez ces individus. Ils vont disparaître.'
        : 'Observez cet individu. Il va disparaître.');

      ctx.bandeau.info('manche', this.manche + ' / ' + this.r.manches, 'manche');
      ctx.bandeau.info('justes', this.justes, 'justes');

      var rangee = TZ.el('div', 'tz-signalement-scene');
      this.individus.forEach(function (ind, n) {
        var bloc = TZ.el('div', 'tz-signalement-bloc');
        if (self.r.individus > 1) {
          bloc.appendChild(TZ.el('span', 'tz-signalement-no', 'Individu ' + (n + 1)));
        }
        bloc.appendChild(tzFigure(ind, self.r.individus > 1 ? 200 : 250));
        rangee.appendChild(bloc);
      });
      scene.appendChild(rangee);

      /* La jauge sert ici de compte à rebours d'observation : on voit le
         temps qui reste pour regarder, ce qui change la façon de regarder. */
      this.chrono = TZ.chrono(this.r.vue,
        function (f) { ctx.bandeau.jauge(f); },
        function () { self.interroger(); });
    },

    interroger: function () {
      var self = this;
      /* On tire les attributs à interroger sans répétition dans la manche. */
      this.file = TZ.melanger(QUESTIONS_SIGNALEMENT).slice(0, this.r.questions);
      this.quelIndividu = this.r.individus > 1 ? TZ.hasard(this.r.individus) : 0;
      this.rang = 0;
      this.question();
    },

    question: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      if (this.rang >= this.file.length) {
        this.corriger();
        return;
      }

      var q = this.file[this.rang];
      this.rang++;
      /* Avec deux individus, on change celui dont on parle d'une question à
         l'autre : c'est là que l'exercice devient vraiment exigeant. */
      var n = this.r.individus > 1 ? TZ.hasard(this.r.individus) : 0;
      var ind = this.individus[n];

      var attendu = q.lire ? q.lire(ind) : ind[q.cle];
      var univers = q.valeurs ? q.valeurs() : TRAITS[q.cle].valeurs;
      var distracteurs = TZ.melanger(univers.filter(function (v) {
        return v !== attendu;
      })).slice(0, 3);
      var options = TZ.melanger([{ texte: attendu, juste: true }].concat(
        distracteurs.map(function (v) { return { texte: v, juste: false }; })));

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.r.individus > 1
        ? 'Individu ' + (n + 1) + ' — ' + q.enonce.charAt(0).toLowerCase() + q.enonce.slice(1)
        : q.enonce);
      ctx.bandeau.info('question', this.rang + ' / ' + this.file.length, 'question');

      var depart = performance.now();
      var repondu = false;
      this.posees++;

      var noeuds = TZ.quizz.reponses(scene, options, function (o, b, tous) {
        if (repondu) return;
        repondu = true;
        self.temps.push(performance.now() - depart);
        if (self.chrono) self.chrono.arreter();
        TZ.quizz.figer(tous);
        b.classList.add(o.juste ? 'tz-juste' : 'tz-faux');
        if (o.juste) { self.justes++; TZ.son.juste(); }
        else {
          TZ.quizz.revelerJuste(tous);
          self.ratees.push(q.cle === 'couleurHaut' || q.cle === 'couleurBas'
            ? 'couleurs' : (TRAITS[q.cle] ? TRAITS[q.cle].libelle.toLowerCase() : q.cle));
          TZ.son.faux();
        }
        TZ.apres(o.juste ? 650 : 1500, function () { self.question(); });
      });

      this.chrono = TZ.chrono(this.r.limite,
        function (f) { ctx.bandeau.jauge(f); },
        function () {
          if (repondu) return;
          repondu = true;
          TZ.quizz.figer(noeuds);
          TZ.quizz.revelerJuste(noeuds);
          self.ratees.push('temps');
          TZ.son.faux();
          TZ.apres(1500, function () { self.question(); });
        });
    },

    /* Fin de manche : on remontre l'individu avec son signalement écrit.
       Sans ce retour, on ne sait pas ce qu'on a mal vu — et l'épreuve
       n'apprendrait rien. */
    corriger: function () {
      var self = this;
      var scene = TZ.vide(this.ctx.scene);
      UI.consigne(scene, 'Le signalement exact');
      var rangee = TZ.el('div', 'tz-signalement-scene');
      this.individus.forEach(function (ind, n) {
        var bloc = TZ.el('div', 'tz-signalement-bloc');
        if (self.r.individus > 1) {
          bloc.appendChild(TZ.el('span', 'tz-signalement-no', 'Individu ' + (n + 1)));
        }
        bloc.appendChild(tzFigure(ind, 160));
        bloc.appendChild(TZ.el('p', 'tz-signalement-texte', tzDecrireIndividu(ind) + '.'));
        rangee.appendChild(bloc);
      });
      scene.appendChild(rangee);
      TZ.apres(this.r.individus > 1 ? 4200 : 3000, function () { self.manchesuivante(); });
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var posees = Math.max(1, this.posees);
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      var details = {
        'Justes': this.justes + ' / ' + posees,
        'Temps d’observation': (this.r.vue / 1000).toFixed(1) + ' s'
      };
      if (moy) details['Temps de réponse'] = (moy / 1000).toFixed(1) + ' s';
      if (this.ratees.length) {
        var uniques = this.ratees.filter(function (v, i, a) { return a.indexOf(v) === i; });
        details['À travailler'] = uniques.slice(0, 3).join(', ');
      }
      return {
        precision: this.justes / posees,
        vitesse: moy ? TZ.borne((this.r.limite - moy) / Math.max(1, this.r.limite * 0.7), 0, 1) : 0,
        difficulte: this.r.individus > 1 ? 0.85 : 0.6,
        details: details
      };
    }
  });


  /* =========================================================================
     2. PLAQUES RECHERCHÉES

     On mémorise des plaques, puis un flux défile. Il faut réagir sur les
     plaques recherchées et NE PAS réagir sur les autres — c'est une tâche de
     go / no-go, et c'est exactement ce qui se passe quand on tient un point
     de contrôle avec une liste en tête.

     Le soin est mis sur les leurres : une plaque qui ne ressemble à rien
     n'apprend rien. Les leurres diffèrent d'UN caractère de la plaque
     recherchée, ce qui force à lire au lieu de reconnaître une forme.
     ========================================================================= */

  var LETTRES = 'ABCDEFGHJKLMNPQRSTVWXYZ'; /* I, O et U sont écartées du SIV */

  function tzBloc(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += LETTRES.charAt(TZ.hasard(LETTRES.length));
    return s;
  }

  function tzChiffres(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += String(TZ.hasard(10));
    return s;
  }

  /* Format SIV : AA-123-AA. */
  function tzPlaque() {
    return tzBloc(2) + '-' + tzChiffres(3) + '-' + tzBloc(2);
  }

  /* Un leurre à un caractère près. C'est la seule façon d'entraîner la
     lecture plutôt que la reconnaissance de silhouette. */
  function tzLeurre(plaque) {
    var cars = plaque.split('');
    var positions = [];
    for (var i = 0; i < cars.length; i++) if (cars[i] !== '-') positions.push(i);
    var p = positions[TZ.hasard(positions.length)];
    var ancien = cars[p];
    if (/[0-9]/.test(ancien)) {
      do { cars[p] = String(TZ.hasard(10)); } while (cars[p] === ancien);
    } else {
      do { cars[p] = LETTRES.charAt(TZ.hasard(LETTRES.length)); } while (cars[p] === ancien);
    }
    return cars.join('');
  }

  function tzPlaqueNoeud(texte, classe) {
    var n = TZ.el('div', 'tz-plaque' + (classe ? ' ' + classe : ''));
    n.appendChild(TZ.el('span', 'tz-plaque-bande', 'F'));
    n.appendChild(TZ.el('b', null, texte));
    return n;
  }

  TZ.epreuves.push({
    id: 'plaques',
    nom: 'Plaques recherchées',
    categorie: 'terrain',
    axe: 'inhibition',
    force: 'commun',
    but: 'Retenir des plaques, puis les repérer dans un flux sans se tromper.',
    comment: 'Mémorisez les plaques recherchées, puis réagissez quand l’une d’elles passe — et seulement celles-là.',

    tuto: {
      regle: 'Des plaques recherchées s’affichent le temps de les apprendre. Ensuite, '
           + 'des plaques défilent une par une. Cliquez « Recherchée » quand c’en est '
           + 'une, « Passer » sinon. Les leurres ne diffèrent que d’UN caractère : '
           + 'il faut lire, pas reconnaître.',
      exemple: function (hote) {
        var vraie = tzPlaque();
        var faux = tzLeurre(vraie);
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', vraie, 'Recherchée', 'Celle qu’il faut signaler'],
         ['non', faux, 'Passer', 'Un seul caractère change']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.appendChild(tzPlaqueNoeud(c[1]));
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Le format est celui du système d’immatriculation des véhicules en vigueur '
          + 'depuis 2009 : deux lettres, trois chiffres, deux lettres. Les lettres I, O '
          + 'et U n’y sont pas employées, pour éviter la confusion avec 1, 0 et V.'));
      },
      pourquoi: 'Signaler une plaque qui n’est pas la bonne mobilise des moyens pour rien '
              + 'et met en cause un innocent ; laisser passer la bonne perd l’affaire. '
              + 'L’exercice travaille les deux erreurs à la fois — réagir quand il faut, '
              + 'et surtout retenir sa réaction quand il ne faut pas.'
    },

    reglages: {
      decouverte: { recherchees: 2, memo: 9000,  passages: 14, vue: 3000, leurres: 0.45 },
      standard:   { recherchees: 3, memo: 9000,  passages: 18, vue: 2300, leurres: 0.55 },
      confirme:   { recherchees: 4, memo: 10000, passages: 22, vue: 1800, leurres: 0.6 },
      expert:     { recherchees: 5, memo: 10000, passages: 26, vue: 1450, leurres: 0.65 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;

      this.recherchees = [];
      while (this.recherchees.length < this.r.recherchees) {
        var p = tzPlaque();
        if (this.recherchees.indexOf(p) < 0) this.recherchees.push(p);
      }

      /* Le flux : environ un tiers de plaques recherchées, le reste en
         leurres proches et en plaques quelconques. Trop de cibles et il n'y a
         plus d'inhibition à exercer ; trop peu et l'attention décroche. */
      var self = this;
      this.flux = [];
      for (var i = 0; i < this.r.passages; i++) {
        var tirage = Math.random();
        if (tirage < 0.34) {
          var cible = this.recherchees[TZ.hasard(this.recherchees.length)];
          this.flux.push({ texte: cible, cible: true });
        } else if (tirage < 0.34 + this.r.leurres * 0.66) {
          var base = this.recherchees[TZ.hasard(this.recherchees.length)];
          this.flux.push({ texte: tzLeurre(base), cible: false, proche: true });
        } else {
          this.flux.push({ texte: tzPlaque(), cible: false });
        }
      }
      this.flux = TZ.melanger(this.flux);

      this.rang = 0;
      this.bonnes = 0;       /* cibles signalées */
      this.manquees = 0;     /* cibles laissées passer */
      this.faussesAlertes = 0;
      this.temps = [];
    },

    start: function () {
      var self = this, ctx = this.ctx;
      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.r.recherchees > 1
        ? 'Apprenez ces ' + this.r.recherchees + ' plaques recherchées.'
        : 'Apprenez cette plaque recherchée.');

      var grille = TZ.el('div', 'tz-plaques-memo');
      this.recherchees.forEach(function (p) {
        grille.appendChild(tzPlaqueNoeud(p, 'tz-plaque-cible'));
      });
      scene.appendChild(grille);
      UI.indice(scene, 'Elles disparaîtront. Vous ne les reverrez qu’à la correction.');

      this.chrono = TZ.chrono(this.r.memo,
        function (f) { ctx.bandeau.jauge(f); },
        function () { self.passage(); });
    },

    passage: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      if (this.rang >= this.flux.length) { ctx.terminer(); return; }

      var item = this.flux[this.rang];
      this.rang++;

      var scene = TZ.vide(ctx.scene);
      ctx.bandeau.info('passage', this.rang + ' / ' + this.flux.length, 'passage');
      ctx.bandeau.info('bonnes', this.bonnes, 'signalées');

      var boite = TZ.el('div', 'tz-plaques-flux');
      boite.appendChild(tzPlaqueNoeud(item.texte));
      scene.appendChild(boite);

      var depart = performance.now();
      var repondu = false;

      function conclure(signale) {
        if (repondu) return;
        repondu = true;
        if (self.chrono) self.chrono.arreter();
        self.temps.push(performance.now() - depart);

        var correct = signale === item.cible;
        if (correct) {
          if (item.cible) self.bonnes++;
          TZ.son.juste();
        } else {
          if (item.cible) self.manquees++; else self.faussesAlertes++;
          TZ.distracteur(scene);
          TZ.son.faux();
        }

        /* On dit toujours ce qu'il en était : sans ce retour, on ne sait pas
           si on a laissé passer une cible ou évité un leurre. */
        var msg = item.cible
          ? (correct ? 'Bien vu : plaque recherchée.' : 'Manquée : c’était une plaque recherchée.')
          : (correct ? (item.proche ? 'Bien retenu : le leurre ne diffère que d’un caractère.' : 'Correct : plaque quelconque.')
                     : 'Fausse alerte : cette plaque n’était pas recherchée.');
        UI.message(scene, msg, correct ? 'ok' : 'ko');

        TZ.apres(correct ? 600 : 1500, function () { self.passage(); });
      }

      UI.actions(scene, [
        { texte: 'Recherchée', action: function () { conclure(true); } },
        { texte: 'Passer', fantome: true, action: function () { conclure(false); } }
      ]);

      /* Ne rien faire revient à laisser passer : c'est aussi une décision. */
      this.chrono = TZ.chrono(this.r.vue,
        function (f) { ctx.bandeau.jauge(f); },
        function () { conclure(false); });
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var cibles = this.flux.filter(function (f) { return f.cible; }).length;
      var autres = this.flux.length - cibles;
      var vues = Math.max(1, this.rang);

      /* Deux erreurs de nature différente, qu'il serait faux de confondre :
         manquer une cible et déclencher à tort. On les pèse à égalité, et on
         rapporte chacune à son propre total. */
      var rappel = cibles ? this.bonnes / cibles : 1;
      var justesse = autres ? (autres - this.faussesAlertes) / autres : 1;
      var precision = TZ.borne((rappel + justesse) / 2, 0, 1);

      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;

      return {
        precision: precision,
        vitesse: moy ? TZ.borne((this.r.vue - moy) / Math.max(1, this.r.vue * 0.8), 0, 1) : 0,
        difficulte: 0.7,
        details: {
          'Signalées': this.bonnes + ' / ' + cibles,
          'Manquées': this.manquees,
          'Fausses alertes': this.faussesAlertes,
          'Plaques vues': vues,
          'Recherchées': this.recherchees.join('  ·  ')
        }
      };
    }
  });

  /* =========================================================================
     3. TRANSMISSIONS

     L'alphabet OTAN dans les deux sens, contre le chrono. C'est l'alphabet
     des forces de sécurité intérieure et des services de secours — à ne pas
     confondre avec l'alphabet militaire français (Anatole, Berthe,
     Célestine), qui est celui des armées.
     ========================================================================= */

  var OTAN = [
    ['A', 'Alpha'], ['B', 'Bravo'], ['C', 'Charlie'], ['D', 'Delta'],
    ['E', 'Echo'], ['F', 'Foxtrot'], ['G', 'Golf'], ['H', 'Hotel'],
    ['I', 'India'], ['J', 'Juliett'], ['K', 'Kilo'], ['L', 'Lima'],
    ['M', 'Mike'], ['N', 'November'], ['O', 'Oscar'], ['P', 'Papa'],
    ['Q', 'Quebec'], ['R', 'Romeo'], ['S', 'Sierra'], ['T', 'Tango'],
    ['U', 'Uniform'], ['V', 'Victor'], ['W', 'Whiskey'], ['X', 'X-ray'],
    ['Y', 'Yankee'], ['Z', 'Zulu']
  ];

  /* L'alphabet militaire français : jamais une bonne réponse ici, mais un
     excellent distracteur, parce que c'est LA confusion à lever. */
  var MILITAIRE = {
    A: 'Anatole', B: 'Berthe', C: 'Célestine', D: 'Désiré', E: 'Eugène',
    F: 'François', G: 'Gaston', H: 'Henri', I: 'Irma', J: 'Joseph',
    K: 'Kléber', L: 'Louis', M: 'Marcel', N: 'Nicolas', O: 'Oscar',
    P: 'Pierre', Q: 'Quintal', R: 'Raoul', S: 'Suzanne', T: 'Thérèse',
    U: 'Ursule', V: 'Victor', W: 'William', X: 'Xavier', Y: 'Yvonne', Z: 'Zoé'
  };

  function tzMotOtan(lettre) {
    for (var i = 0; i < OTAN.length; i++) if (OTAN[i][0] === lettre) return OTAN[i][1];
    return null;
  }

  TZ.epreuves.push(TZ.quizz.creer({
    id: 'transmissions',
    nom: 'Transmissions',
    categorie: 'terrain',
    axe: 'vitesse',
    force: 'commun',
    but: 'Épeler et lire l’alphabet OTAN sans hésiter, dans les deux sens.',
    comment: 'Une lettre, un mot ou une plaque s’affiche. Donnez la correspondance en alphabet OTAN.',

    tuto: {
      regle: 'Trois formes de question : la lettre vers le mot, le mot vers la lettre, '
           + 'et une plaque entière à épeler. Le temps est court — en transmission, '
           + 'chercher ses mots occupe la fréquence.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'J → Juliett', 'Alphabet OTAN : celui des forces de sécurité intérieure'],
         ['non', 'J → Joseph', 'Alphabet militaire français : celui des armées']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          var t = TZ.el('div', null, c[1]);
          t.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1.05rem';
          v.appendChild(t);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[0] === 'oui' ? 'Correct' : 'Erreur'));
          b.appendChild(TZ.el('em', null, c[2]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);

        var grille = TZ.el('div', 'tz-otan');
        OTAN.forEach(function (p) {
          var c = TZ.el('div', 'tz-otan-case');
          c.appendChild(TZ.el('b', null, p[0]));
          c.appendChild(TZ.el('span', null, p[1]));
          grille.appendChild(c);
        });
        hote.appendChild(grille);
        hote.appendChild(TZ.el('p', null,
          'Les pièges sont toujours les mêmes : J = Juliett et non Juliet, '
          + 'Q = Quebec, X = X-ray, Y = Yankee, Z = Zulu. Et Oscar et Victor sont '
          + 'communs aux deux alphabets — ce sont les seuls.'));
      },
      pourquoi: 'Une plaque mal épelée est une plaque perdue, et une interpellation ratée. '
              + 'L’alphabet s’apprend en une heure et se perd en un mois : il se révise.'
    },

    reglages: {
      decouverte: { essais: 14, limite: 11000 },
      standard:   { essais: 18, limite: 8000 },
      confirme:   { essais: 22, limite: 6000 },
      expert:     { essais: 26, limite: 4800 }
    },

    tirage: function (niveau, nb) {
      var sortie = [];
      var formesMax = niveau === 'decouverte' ? 2 : 3;
      for (var i = 0; i < nb; i++) {
        var forme = TZ.hasard(formesMax);
        var paire = OTAN[TZ.hasard(OTAN.length)];

        if (forme === 0) {
          /* lettre → mot, avec le mot militaire en distracteur quand il
             diffère : c'est la confusion la plus utile à lever */
          var faux = [];
          var mil = MILITAIRE[paire[0]];
          if (mil && mil !== paire[1]) faux.push(mil);
          TZ.melanger(OTAN).forEach(function (p) {
            if (faux.length >= 3 || p[1] === paire[1] || faux.indexOf(p[1]) >= 0) return;
            faux.push(p[1]);
          });
          sortie.push({
            cle: 'otan-' + paire[0],
            enonce: 'Comment transmettez-vous la lettre « ' + paire[0] + '  » ?',
            options: TZ.melanger([{ texte: paire[1], juste: true }].concat(
              faux.slice(0, 3).map(function (t) { return { texte: t, juste: false }; }))),
            explication: paire[0] + ' = ' + paire[1] + ', en alphabet OTAN.'
              + (mil && mil !== paire[1]
                 ? ' « ' + mil + ' » appartient à l’alphabet militaire français, '
                   + 'qui n’est pas celui des forces de sécurité intérieure.' : ''),
            source: 'alphabet phonétique de l’OTAN',
            theme: 'Alphabet OTAN'
          });

        } else if (forme === 1) {
          /* mot → lettre */
          var lettresFausses = [];
          TZ.melanger(OTAN).forEach(function (p) {
            if (lettresFausses.length >= 3 || p[0] === paire[0]) return;
            lettresFausses.push(p[0]);
          });
          sortie.push({
            cle: 'otan-mot-' + paire[0],
            enonce: 'À quelle lettre correspond « ' + paire[1] + ' » ?',
            options: TZ.melanger([{ texte: paire[0], juste: true }].concat(
              lettresFausses.map(function (t) { return { texte: t, juste: false }; }))),
            explication: paire[1] + ' = ' + paire[0] + '.',
            source: 'alphabet phonétique de l’OTAN',
            theme: 'Alphabet OTAN'
          });

        } else {
          /* une plaque entière : c'est l'usage réel */
          var plaque = tzPlaque();
          var cars = plaque.split('-');
          function epeler(bloc) {
            return bloc.split('').map(function (c) {
              return /[0-9]/.test(c) ? c : tzMotOtan(c);
            }).join(' ');
          }
          var bonne = epeler(cars[0]) + ', ' + cars[1] + ', ' + epeler(cars[2]);

          /* Les mauvaises réponses sont construites, pas tirées au hasard :
             une lettre voisine, l'alphabet militaire, un ordre inversé. */
          var variante = tzLeurre(plaque).split('-');
          var faussesOptions = [
            epeler(variante[0]) + ', ' + variante[1] + ', ' + epeler(variante[2]),
            cars[0].split('').map(function (c) {
              return MILITAIRE[c] || c;
            }).join(' ') + ', ' + cars[1] + ', ' + epeler(cars[2]),
            epeler(cars[2]) + ', ' + cars[1] + ', ' + epeler(cars[0])
          ].filter(function (t) { return t !== bonne; });

          sortie.push({
            cle: 'otan-plaque-' + i,
            enonce: 'Comment épelez-vous la plaque ' + plaque + ' ?',
            options: TZ.melanger([{ texte: bonne, juste: true }].concat(
              faussesOptions.slice(0, 3).map(function (t) {
                return { texte: t, juste: false };
              }))),
            explication: plaque + ' se transmet : ' + bonne + '. On épelle les lettres '
              + 'et on annonce les chiffres groupés, dans l’ordre de lecture de la plaque.',
            source: 'alphabet phonétique de l’OTAN ; format SIV',
            theme: 'Épellation de plaque'
          });
        }
      }
      return sortie;
    },
    libelleRate: function (q) { return q.theme; },
    difficulte: 0.55
  }));

})(window);
