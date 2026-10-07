/* =============================================================================
   Zone d'entraînement — épreuves d'attention et de charge mentale.
   Même contrat que les épreuves de mémoire : init, start, update, end, getScore.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  /* ================================================================ 6. N-back */
  TZ.epreuves.push({
    id: 'nback',
    nom: 'N-back',
    categorie: 'attention',
    axe: 'memoireTravail',
    but: 'Maintenir et rafraîchir en continu une information en mémoire de travail.',
    comment: 'Des lettres défilent. Signalez quand la lettre est la même que N positions plus tôt. Le N augmente à chaque palier réussi.',
    tuto: {
      regle: 'Des lettres défilent une par une. Appuyez sur Espace quand la lettre affichée est identique à celle vue N positions plus tôt. Rien à faire sinon.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var suite = ['B','K','B','M','M'];
        [['oui', 2, 'En 2-back', 'Le 3ᵉ B répète celui d’il y a 2 → on signale'],
         ['non', 1, 'En 1-back', 'Le 2ᵉ M répète le précédent → on signale']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          suite.forEach(function (L, i) {
            var o = TZ.el('div', null, L);
            var cible = (c[1] === 2 && i === 2) || (c[1] === 1 && i === 4);
            o.style.cssText = 'font-family:var(--tz-titre);font-weight:700;width:28px;height:30px;' +
              'display:grid;place-items:center;border-radius:7px;background:' +
              (cible ? 'var(--tz-ok-pale);color:var(--tz-ok)' : 'var(--tz-creux)');
            v.appendChild(o);
          });
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
      },
      pourquoi: 'Le N-back oblige à tenir une fenêtre glissante en mémoire et à la rafraîchir à chaque lettre. C’est l’une des tâches les plus exigeantes pour la mémoire de travail, et l’une des plus utilisées en recherche.'
    },

    reglages: {
      decouverte: { depart: 1, max: 2, essais: 16, cadence: 3000, seuil: 0.6 },
      standard:   { depart: 1, max: 3, essais: 20, cadence: 2500, seuil: 0.7 },
      confirme:   { depart: 2, max: 4, essais: 24, cadence: 2100, seuil: 0.72 },
      expert:     { depart: 2, max: 4, essais: 28, cadence: 1800, seuil: 0.78 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.n = this.r.depart;
      this.nMax = this.r.depart;
      this.lettres = ['B', 'C', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'P'];
      this.ESSAIS = this.r.essais;
      this.touches = 0; this.manques = 0; this.faussesAlertes = 0; this.cibles = 0;
      this.serieOk = 0;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.palier(); });
    },

    palier: function () {
      var self = this, ctx = this.ctx;
      if (this.n > this.r.max) { ctx.terminer(); return; }

      this.suite = [];
      for (var i = 0; i < this.ESSAIS; i++) {
        /* on force environ 30 % de cibles, sinon le hasard en produit trop peu */
        if (i >= this.n && Math.random() < 0.3) this.suite.push(this.suite[i - this.n]);
        else this.suite.push(this.lettres[TZ.hasard(this.lettres.length)]);
      }
      this.idx = -1;
      this.reponduCeTour = false;
      this.toucheslocal = 0; this.manqueslocal = 0; this.fauxlocal = 0; this.cibleslocal = 0;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.n + '-back');
      this.affiche = TZ.el('div', 'tz-grand', '');
      scene.appendChild(this.affiche);
      UI.indice(scene, 'Appuyez sur Espace, ou cliquez le bouton, quand la lettre répète celle d’il y a ' + this.n + ' position' + (this.n > 1 ? 's' : '') + '.');
      var self2 = this;
      UI.actions(scene, [{ texte: 'Répétition', action: function () { self2.signaler(); } }]);

      this.surTouche = function (ev) {
        if (ev.code === 'Space' || ev.key === ' ') { ev.preventDefault(); self.signaler(); }
      };
      document.addEventListener('keydown', this.surTouche);

      ctx.bandeau.info('niveau', this.n + '-back', '');
      this.boucle();
    },

    boucle: function () {
      var self = this, ctx = this.ctx;
      var cadence = Math.max(1400, this.r.cadence - this.n * 220) * TZ.STRESS[TZ.etat.stress].chrono;

      this.minuteur = TZ.chaque(cadence, function () {
        /* bilan de l'essai qui vient de s'écouler */
        if (self.idx >= 0) {
          var etaitCible = self.idx >= self.n && self.suite[self.idx] === self.suite[self.idx - self.n];
          if (etaitCible) { self.cibleslocal++; if (!self.reponduCeTour) self.manqueslocal++; }
        }
        self.idx++;
        self.reponduCeTour = false;

        if (self.idx >= self.suite.length) {
          clearInterval(self.minuteur);
          self.finPalier();
          return;
        }
        self.affiche.textContent = self.suite[self.idx];
        self.affiche.style.animation = 'none'; void self.affiche.offsetWidth;
        self.affiche.style.animation = '';
        ctx.bandeau.jauge(1 - self.idx / self.suite.length);
      });
    },

    signaler: function () {
      if (this.idx < 0 || this.reponduCeTour) return;
      this.reponduCeTour = true;
      var cible = this.idx >= this.n && this.suite[this.idx] === this.suite[this.idx - this.n];
      if (cible) { this.toucheslocal++; TZ.son.bip(); }
      else { this.fauxlocal++; TZ.son.faux(); }
    },

    finPalier: function () {
      var self = this, ctx = this.ctx;
      document.removeEventListener('keydown', this.surTouche);
      this.touches += this.toucheslocal;
      this.manques += this.manqueslocal;
      this.faussesAlertes += this.fauxlocal;
      this.cibles += this.cibleslocal;

      var taux = this.cibleslocal ? this.toucheslocal / this.cibleslocal : 0;
      var propre = taux >= this.r.seuil && this.fauxlocal <= 2;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, propre ? 'Palier validé' : 'Palier manqué');
      UI.message(scene,
        this.toucheslocal + ' répétitions sur ' + this.cibleslocal +
        ' · ' + this.fauxlocal + ' fausses alertes', propre ? 'ok' : 'ko');

      if (propre) { this.n++; this.nMax = Math.max(this.nMax, this.n - 1); TZ.son.juste(); }
      else { TZ.son.faux(); }

      TZ.apres(1700, function () {
        if (propre) self.palier();
        else ctx.terminer();
      });
    },

    update: function () {},
    end: function () {
      if (this.minuteur) clearInterval(this.minuteur);
      if (this.surTouche) document.removeEventListener('keydown', this.surTouche);
    },

    getScore: function () {
      var rappel = this.cibles ? this.touches / this.cibles : 0;
      var precision = TZ.borne(rappel - this.faussesAlertes * 0.04, 0, 1);
      return {
        precision: precision, vitesse: 0.5,
        difficulte: TZ.borne(this.nMax / 4, 0, 1),
        details: { 'Palier atteint': this.nMax + '-back',
                   'Détections': this.touches + ' / ' + this.cibles,
                   'Fausses alertes': this.faussesAlertes }
      };
    }
  });

  /* ================================================================ 7. Stroop */
  var COULEURS_STROOP = [
    { nom: 'ROUGE', css: '#DC3A4B' }, { nom: 'BLEU', css: '#3E86E0' },
    { nom: 'VERT', css: '#2FA86B' },  { nom: 'ORANGE', css: '#E87F22' },
    { nom: 'VIOLET', css: '#8257C8' }
  ];

  TZ.epreuves.push({
    id: 'stroop',
    nom: 'Stroop',
    categorie: 'attention',
    axe: 'inhibition',
    but: 'Inhiber une réponse automatique — lire — au profit d’une autre.',
    comment: 'Un mot de couleur s’affiche dans une encre différente. Donnez la couleur de l’ENCRE, jamais le mot. Touches 1 à 5, ou clic.',
    tuto: {
      regle: 'Un mot de couleur s’affiche, écrit dans une encre d’une autre couleur. Désignez la COULEUR DE L’ENCRE, pas le mot. Les touches 1 à 5 correspondent aux cinq boutons, dans l’ordre : c’est beaucoup plus rapide que viser à la souris.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'ROUGE', '#3E86E0', 'BLEU', 'Bonne réponse', 'L’encre est bleue'],
         ['non', 'ROUGE', '#3E86E0', 'ROUGE', 'Erreur', 'C’est le mot, pas l’encre']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.style.flexDirection = 'column';
          var m = TZ.el('div', null, c[1]);
          m.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1.5rem;color:' + c[2];
          var r = TZ.el('div', null, '→ ' + c[3]);
          r.style.cssText = 'font-size:.85rem;font-weight:700;margin-top:4px';
          v.appendChild(m); v.appendChild(r);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[4]));
          b.appendChild(TZ.el('em', null, c[5]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
      },
      pourquoi: 'Lire est devenu automatique : le mot s’impose avant la couleur. Réussir demande d’inhiber cette réponse automatique. C’est la mesure classique du contrôle inhibiteur.'
    },

    /* Un essai Stroop incongruent se résout en 700 à 1100 ms chez un adulte
       entraîné. Les planchers d'avant (820 ms, ramenés à 476 ms par le
       coefficient Intense) étaient donc hors d'atteinte, même au clavier. */
    reglages: {
      decouverte: { essais: 16, base: 4200, retrait: 25, plancher: 2600, incongru: 0.55 },
      standard:   { essais: 24, base: 3400, retrait: 40, plancher: 2000, incongru: 0.75 },
      confirme:   { essais: 30, base: 2900, retrait: 45, plancher: 1700, incongru: 0.85 },
      expert:     { essais: 34, base: 2500, retrait: 45, plancher: 1500, incongru: 0.92 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.justes = 0;
      this.temps = [];
      this.enCours = false;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.preparer(); });
    },

    preparer: function () {
      var self = this, ctx = this.ctx;
      var scene = TZ.vide(ctx.scene);
      this.mot = TZ.el('div', 'tz-grand', '');
      scene.appendChild(this.mot);
      var rangee = TZ.el('div', 'tz-couleurs');
      /* L'ordre des couleurs ne change jamais d'un essai à l'autre : les
         touches 1 à 5 restent donc au même endroit, et la réponse devient
         un réflexe au lieu d'une visée. */
      COULEURS_STROOP.forEach(function (c, i) {
        var b = TZ.el('button', 'tz-couleur');
        b.type = 'button';
        b.style.background = c.css;
        b.appendChild(TZ.el('span', 'tz-touche', String(i + 1)));
        b.appendChild(TZ.el('span', null, c.nom));
        b.addEventListener('click', function () { self.repondre(c.nom); });
        rangee.appendChild(b);
      });
      scene.appendChild(rangee);
      UI.indice(scene, 'Touches 1 à 5 pour répondre, ou clic sur la couleur.');

      this.surTouche = function (ev) {
        var n = parseInt(ev.key, 10);
        if (!n || n < 1 || n > COULEURS_STROOP.length) return;
        ev.preventDefault();
        self.repondre(COULEURS_STROOP[n - 1].nom);
      };
      document.addEventListener('keydown', this.surTouche);

      this.suivant();
    },

    suivant: function () {
      var self = this, ctx = this.ctx;
      if (this.essai >= this.ESSAIS) { ctx.terminer(); return; }
      this.essai++;

      var motIdx = TZ.hasard(COULEURS_STROOP.length);
      var encreIdx = TZ.hasard(COULEURS_STROOP.length);
      /* 75 % d'essais incongruents : c'est là que se joue l'inhibition */
      if (encreIdx === motIdx && Math.random() < this.r.incongru) {
        encreIdx = (encreIdx + 1 + TZ.hasard(COULEURS_STROOP.length - 1)) % COULEURS_STROOP.length;
      }
      this.encre = COULEURS_STROOP[encreIdx];
      this.mot.textContent = COULEURS_STROOP[motIdx].nom;
      this.mot.style.color = this.encre.css;
      this.debut = performance.now();
      this.enCours = true;

      ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'essai');
      ctx.bandeau.info('justes', this.justes, 'justes');

      /* le temps imparti se resserre à mesure que l'on avance */
      var limite = Math.max(this.r.plancher, this.r.base - this.essai * this.r.retrait)
                 * TZ.STRESS[TZ.etat.stress].chrono;
      if (this.chrono) this.chrono.arreter();
      this.chrono = TZ.chrono(limite, function (f) { ctx.bandeau.jauge(f); }, function () {
        if (!self.enCours) return;
        self.enCours = false;
        TZ.son.faux();
        TZ.apres(260, function () { self.suivant(); });
      });
    },

    repondre: function (nom) {
      if (!this.enCours) return;
      this.enCours = false;
      if (this.chrono) this.chrono.arreter();
      var ms = performance.now() - this.debut;
      var ok = nom === this.encre.nom;
      if (ok) { this.justes++; this.temps.push(ms); TZ.son.bip(); }
      else { TZ.son.faux(); TZ.distracteur(this.ctx.scene); }
      var self = this;
      TZ.apres(ok ? 160 : 420, function () { self.suivant(); });
    },

    update: function () {},
    end: function () {
      if (this.chrono) this.chrono.arreter();
      if (this.surTouche) document.removeEventListener('keydown', this.surTouche);
    },

    getScore: function () {
      var precision = this.essai ? this.justes / this.essai : 0;
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      return {
        /* constante : le niveau est déjà pris en compte par le moteur */
        precision: precision, vitesse: TZ.noteVitesse(moy), difficulte: 0.65,
        details: { 'Justes': this.justes + ' / ' + this.essai,
                   'Temps moyen': moy ? Math.round(moy) + ' ms' : '—' }
      };
    }
  });

  /* ============================================================ 8. Go / No-Go */
  TZ.epreuves.push({
    id: 'gonogo',
    nom: 'Go / No-Go',
    categorie: 'attention',
    axe: 'vitesse',
    but: 'Décider vite, et surtout savoir ne pas agir.',
    comment: 'Des silhouettes apparaissent. Appuyez sur Espace pour les cibles hostiles, rien pour les civils. On mesure votre temps de réaction et vos fausses alertes.',
    tuto: {
      regle: 'Une silhouette apparaît brièvement. Appuyez sur Espace si elle est hostile. Ne touchez à rien si c’est un civil : ne rien faire est une réponse. Le clic sur la silhouette marche aussi, mais la touche est bien plus rapide.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var self = this;
        [['oui', true, 'Hostile', 'Orange, un objet tendu → cliquez'],
         ['non', false, 'Civil', 'Bleu, mains levées → ne cliquez pas']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          var f = self.dessinerSilhouette(c[1]);
          f.setAttribute('width', '48'); f.setAttribute('height', '80');
          v.appendChild(f);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Répondre sur un civil compte comme une fausse alerte, et pèse plus lourd qu’une cible manquée.'));
      },
      pourquoi: 'Le Go / No-Go mesure deux choses à la fois : la vitesse de décision et la capacité à retenir un geste déjà lancé. Dans les métiers concernés, la seconde compte davantage que la première.'
    },

    /* La difficulté d'un Go/No-Go tient à l'inhibition, pas à la vitesse du
       bras : ce qui discrimine, ce sont les fausses alertes. Les anciens
       planchers (450 ms, soit 261 ms une fois le coefficient Intense
       appliqué) passaient sous le temps de réaction visuel simple — la
       cible était manquée même quand la décision était juste. */
    reglages: {
      decouverte: { essais: 18, fenetre: 2000, retrait: 8,  plancher: 1500, partGo: 0.75 },
      standard:   { essais: 26, fenetre: 1600, retrait: 12, plancher: 1150, partGo: 0.65 },
      confirme:   { essais: 32, fenetre: 1350, retrait: 14, plancher: 1000, partGo: 0.58 },
      expert:     { essais: 36, fenetre: 1200, retrait: 14, plancher: 880,  partGo: 0.52 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.touches = 0; this.cibles = 0;
      this.faussesAlertes = 0; this.manques = 0;
      this.temps = [];
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.preparer(); });
    },

    preparer: function () {
      var self = this, ctx = this.ctx;
      var scene = TZ.vide(ctx.scene);
      UI.indice(scene, 'Hostile : silhouette orange avec objet — Espace. Civil : silhouette bleue, mains levées — ne rien faire.');

      /* La touche est la vraie voie de réponse : viser une silhouette à la
         souris mesurerait le déplacement du curseur, pas la décision. */
      this.surTouche = function (ev) {
        if (ev.code !== 'Space' && ev.key !== ' ' && ev.key !== 'Enter') return;
        ev.preventDefault();
        self.cliquer();
      };
      document.addEventListener('keydown', this.surTouche);

      this.zone = TZ.el('div');
      this.zone.style.cssText = 'display:grid;place-items:center;height:190px;width:100%';
      scene.insertBefore(this.zone, scene.firstChild);
      this.suivant();
    },

    dessinerSilhouette: function (hostile) {
      var NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 60 100');
      svg.setAttribute('width', '96'); svg.setAttribute('height', '160');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', hostile ? 'cible hostile' : 'civil');
      var teinte = hostile ? '#E8875A' : '#4EA3F5';
      function p(d) {
        var n = document.createElementNS(NS, 'path');
        n.setAttribute('d', d); n.setAttribute('fill', teinte);
        svg.appendChild(n);
      }
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 30); c.setAttribute('cy', 14); c.setAttribute('r', 9);
      c.setAttribute('fill', teinte);
      svg.appendChild(c);
      p('M20 26h20l5 34H15z');                                   // tronc
      if (hostile) {
        p('M43 32h14v7H43z');                                    // objet tenu, bras tendu
        p('M40 30h6v9h-6z');
        p('M14 30h6v16h-6z');
      } else {
        p('M14 30l-6-14 5-2 7 14z');                             // bras levés
        p('M46 30l6-14-5-2-7 14z');
      }
      p('M22 60h6v30h-6z'); p('M32 60h6v30h-6z');                // jambes
      return svg;
    },

    suivant: function () {
      var self = this, ctx = this.ctx;
      if (this.essai >= this.ESSAIS) { ctx.terminer(); return; }
      this.essai++;

      TZ.vide(this.zone);
      ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'essai');
      ctx.bandeau.info('fausses', this.faussesAlertes, 'fausses alertes');

      /* un délai variable empêche d'anticiper le rythme */
      var attente = 450 + TZ.hasard(900);
      TZ.apres(attente, function () {
        self.hostile = Math.random() < self.r.partGo;   // la part de Go décroît avec le niveau
        if (self.hostile) self.cibles++;
        var fig = self.dessinerSilhouette(self.hostile);
        var bouton = TZ.el('button');
        bouton.type = 'button';
        bouton.style.cssText = 'background:none;border:none;cursor:pointer;padding:0';
        bouton.appendChild(fig);
        bouton.addEventListener('click', function () { self.cliquer(); });
        TZ.vide(self.zone).appendChild(bouton);
        self.debut = performance.now();
        self.ouvert = true;

        var fenetre = Math.max(self.r.plancher, self.r.fenetre - self.essai * self.r.retrait)
                    * TZ.STRESS[TZ.etat.stress].chrono;
        self.chrono = TZ.chrono(fenetre, function (f) { ctx.bandeau.jauge(f); }, function () {
          if (!self.ouvert) return;
          self.ouvert = false;
          if (self.hostile) { self.manques++; TZ.son.faux(); }
          TZ.vide(self.zone);
          TZ.apres(180, function () { self.suivant(); });
        });
      });
    },

    cliquer: function () {
      if (!this.ouvert) return;
      this.ouvert = false;
      if (this.chrono) this.chrono.arreter();
      var ms = performance.now() - this.debut;
      if (this.hostile) { this.touches++; this.temps.push(ms); TZ.son.bip(); }
      else { this.faussesAlertes++; TZ.son.faux(); TZ.distracteur(this.ctx.scene); }
      TZ.vide(this.zone);
      var self = this;
      TZ.apres(220, function () { self.suivant(); });
    },

    update: function () {},
    end: function () {
      if (this.chrono) this.chrono.arreter();
      if (this.surTouche) document.removeEventListener('keydown', this.surTouche);
    },

    getScore: function () {
      var rappel = this.cibles ? this.touches / this.cibles : 0;
      var precision = TZ.borne(rappel - this.faussesAlertes * 0.07, 0, 1);
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      return {
        precision: precision, vitesse: TZ.noteVitesse(moy), difficulte: 0.65,
        details: { 'Cibles touchées': this.touches + ' / ' + this.cibles,
                   'Fausses alertes': this.faussesAlertes,
                   'Temps moyen': moy ? Math.round(moy) + ' ms' : '—' }
      };
    }
  });

  /* =========================================================== 9. Double tâche */
  TZ.epreuves.push({
    id: 'double',
    nom: 'Double tâche',
    categorie: 'attention',
    axe: 'attention',
    but: 'Partager son attention entre une tâche motrice et une tâche mentale.',
    comment: 'Gardez la souris sur la cible mobile pendant que vous répondez aux questions.',
    tuto: {
      regle: 'Une cible se déplace dans le cadre du haut : gardez le curseur dessus. En même temps, répondez aux questions qui apparaissent en dessous.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'var(--tz-ac)', 'Curseur sur la cible', 'La pastille reste orange'],
         ['non', 'var(--tz-ko)', 'Cible perdue', 'Elle vire au rouge']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          var d = TZ.el('div');
          d.style.cssText = 'width:38px;height:38px;border-radius:50%;background:' + c[1];
          v.appendChild(d);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Les deux tâches comptent autant l’une que l’autre : répondre juste en lâchant la cible ne vaut pas mieux que l’inverse.'));
      },
      pourquoi: 'Faire deux choses à la fois dégrade toujours les deux. L’épreuve mesure l’ampleur de cette dégradation — et c’est elle, plus que la performance brute, qui distingue les profils.'
    },

    reglages: {
      decouverte: { essais: 5,  vitesse: 0.55, rayon: 62 },
      standard:   { essais: 8,  vitesse: 1.00, rayon: 48 },
      confirme:   { essais: 10, vitesse: 1.40, rayon: 40 },
      expert:     { essais: 12, vitesse: 1.85, rayon: 34 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.justes = 0;
      this.imagesSuivi = 0;
      this.imagesTotal = 0;
      this.banque = this.construireBanque();
    },

    /* Les questions du jeu sont lues si elles sont là, sinon on calcule.
       Dans les deux cas, aucune réponse donnée ici ne touche aux stats du quiz. */
    construireBanque: function () {
      var lot = [];
      var Q = global.QUESTIONS;
      if (Q && Q.length) {
        Q.filter(function (q) {
          return q.type === 'qcm' && q.choix && q.choix.length === 4 && q.niveau <= 2;
        }).slice(0, 400).forEach(function (q) {
          lot.push({ enonce: q.question, choix: q.choix, bonne: q.choix[q.reponse] });
        });
      }
      if (lot.length < 20) {
        for (var i = 0; i < 40; i++) {
          var a = 7 + TZ.hasard(40), b = 3 + TZ.hasard(18);
          var r = a + b;
          lot.push({
            enonce: a + ' + ' + b + ' = ?',
            choix: TZ.melanger([String(r), String(r + 1 + TZ.hasard(4)),
                                String(r - 1 - TZ.hasard(4)), String(r + 10)]),
            bonne: String(r)
          });
        }
      }
      return TZ.melanger(lot);
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.preparer(); });
    },

    preparer: function () {
      var self = this, ctx = this.ctx;
      var scene = TZ.vide(ctx.scene);

      this.zoneSuivi = TZ.el('div', 'tz-zone-suivi');
      this.cible = TZ.el('div', 'tz-cible');
      this.zoneSuivi.appendChild(this.cible);
      scene.appendChild(this.zoneSuivi);

      this.zoneQuestion = TZ.el('div');
      this.zoneQuestion.style.cssText = 'width:100%;text-align:center';
      scene.appendChild(this.zoneQuestion);

      this.souris = { x: 0, y: 0, dedans: false };
      this.surSouris = function (ev) {
        var r = self.zoneSuivi.getBoundingClientRect();
        self.souris.x = ev.clientX - r.left;
        self.souris.y = ev.clientY - r.top;
        self.souris.dedans = true;
      };
      this.zoneSuivi.addEventListener('mousemove', this.surSouris);
      this.zoneSuivi.addEventListener('mouseleave', function () { self.souris.dedans = false; });

      this.pos = { x: 60, y: 60 };
      this.vit = { x: 1.9, y: 1.4 };
      this.anim = 0;
      this.boucleSuivi();
      this.question();
    },

    boucleSuivi: function () {
      var self = this;
      function pas() {
        var r = self.zoneSuivi ? self.zoneSuivi.getBoundingClientRect() : null;
        if (!r || !r.width) { self.anim = requestAnimationFrame(pas); return; }
        var marge = 23;
        var vitesse = self.r.vitesse * (1 + (TZ.STRESS[TZ.etat.stress].facteur - 1) * 1.8);
        self.pos.x += self.vit.x * vitesse;
        self.pos.y += self.vit.y * vitesse;
        if (self.pos.x < marge || self.pos.x > r.width - marge) {
          self.vit.x *= -1; self.pos.x = TZ.borne(self.pos.x, marge, r.width - marge);
          self.vit.y += (Math.random() - 0.5) * 0.7;
        }
        if (self.pos.y < marge || self.pos.y > r.height - marge) {
          self.vit.y *= -1; self.pos.y = TZ.borne(self.pos.y, marge, r.height - marge);
          self.vit.x += (Math.random() - 0.5) * 0.7;
        }
        self.cible.style.left = (self.pos.x - 23) + 'px';
        self.cible.style.top = (self.pos.y - 23) + 'px';

        var d = Math.hypot(self.souris.x - self.pos.x, self.souris.y - self.pos.y);
        var dessus = self.souris.dedans && d < self.r.rayon;
        self.cible.classList.toggle('tz-perdue', !dessus);
        self.imagesTotal++;
        if (dessus) self.imagesSuivi++;

        self.anim = requestAnimationFrame(pas);
      }
      this.anim = requestAnimationFrame(pas);
    },

    question: function () {
      var self = this, ctx = this.ctx;
      if (this.essai >= this.ESSAIS) { ctx.terminer(); return; }
      var it = this.banque[this.essai % this.banque.length];
      this.essai++;

      ctx.bandeau.info('question', this.essai + ' / ' + this.ESSAIS, 'question');
      ctx.bandeau.info('suivi', Math.round(this.imagesTotal ? this.imagesSuivi / this.imagesTotal * 100 : 0) + ' %', 'sur cible');

      var z = TZ.vide(this.zoneQuestion);
      z.appendChild(TZ.el('p', 'tz-consigne', it.enonce));
      var r = TZ.el('div', 'tz-rangee');
      r.style.justifyContent = 'center';
      TZ.melanger(it.choix).forEach(function (c) {
        var b = TZ.el('button', 'tz-btn tz-fantome tz-mini', c);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (c === it.bonne) { self.justes++; TZ.son.bip(); }
          else { TZ.son.faux(); }
          self.question();
        });
        r.appendChild(b);
      });
      z.appendChild(r);
      ctx.bandeau.jauge(1 - this.essai / this.ESSAIS);
    },

    update: function () {},
    end: function () {
      if (this.anim) cancelAnimationFrame(this.anim);
      if (this.zoneSuivi && this.surSouris) {
        this.zoneSuivi.removeEventListener('mousemove', this.surSouris);
      }
    },

    getScore: function () {
      var bonnes = this.essai ? this.justes / this.essai : 0;
      var suivi = this.imagesTotal ? this.imagesSuivi / this.imagesTotal : 0;
      /* les deux tâches comptent autant : réussir l'une en lâchant l'autre
         n'est pas une réussite */
      return {
        precision: (bonnes * 0.5 + suivi * 0.5), vitesse: suivi, difficulte: 0.65,
        details: { 'Réponses justes': this.justes + ' / ' + this.essai,
                   'Temps sur cible': Math.round(suivi * 100) + ' %' }
      };
    }
  });

  /* ======================================================= 10. Rotation mentale */
  TZ.epreuves.push({
    id: 'rotation',
    nom: 'Rotation mentale',
    categorie: 'attention',
    axe: 'memoireVisuelle',
    but: 'Manipuler mentalement une forme dans l’espace.',
    comment: 'Deux formes. Dites si la seconde est la première tournée, ou son reflet.',
    tuto: {
      regle: 'Deux formes côte à côte. La seconde est soit la première simplement TOURNÉE, soit son REFLET dans un miroir. Dites laquelle. Le point orange marque le départ du tracé : suivez-le pour comparer.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var pts = [[0,0],[3,0],[3,2],[1,2],[1,4]];
        var self = this;
        [['oui', 90, false, 'Même forme', 'Tournée d’un quart de tour'],
         ['non', 90, true, 'Reflet', 'Tournée ET retournée']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.appendChild(self.dessinerForme(pts, 0, false, 70));
          var fl = TZ.el('span', null, '→');
          fl.style.color = 'var(--tz-txt-3)';
          v.appendChild(fl);
          v.appendChild(self.dessinerForme(pts, c[1], c[2], 70));
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[3]));
          b.appendChild(TZ.el('em', null, c[4]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Astuce : suivez le tracé depuis le point orange. Si les virages se succèdent dans le même sens, c’est la même forme ; s’ils sont inversés, c’est un reflet.'));
      },
      pourquoi: 'Comparer deux formes orientées différemment oblige à en faire pivoter une mentalement. Les formes proposées sont toutes vérifiées : aucune n’est symétrique, car une forme symétrique serait à la fois sa rotation et son reflet — la question n’aurait alors pas de réponse.'
    },

    reglages: {
      decouverte: { essais: 10, segments: 4, limite: 11000 },
      standard:   { essais: 16, segments: 5, limite: 8000 },
      confirme:   { essais: 20, segments: 6, limite: 6200 },
      expert:     { essais: 24, segments: 7, limite: 5000 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.justes = 0;
      this.temps = [];
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.suivant(); });
    },

    /* Une forme symétrique est superposable à son reflet : la question
       n'aurait alors pas de réponse. On rejette ces formes.

       Critère : le reflet est superposable si et seulement si la suite des
       longueurs est un palindrome ET celle des virages égale son inverse
       négatif. */
    estAmbigue: function (longueurs, virages) {
      for (var i = 0; i < longueurs.length; i++) {
        if (longueurs[i] !== longueurs[longueurs.length - 1 - i]) return false;
      }
      for (var j = 0; j < virages.length; j++) {
        if (virages[j] !== -virages[virages.length - 1 - j]) return false;
      }
      return true;
    },

    formeAleatoire: function () {
      var pas = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      for (var essai = 0; essai < 60; essai++) {
        var pts = [[0, 0]], x = 0, y = 0, dir = 0;
        var longueurs = [], virages = [];
        for (var i = 0; i < this.r.segments; i++) {
          var suivant = (dir + 1 + TZ.hasard(2)) % 4;
          if (i > 0) virages.push(((suivant - dir + 4) % 4) === 1 ? 1 : -1);
          dir = suivant;
          var n = 1 + TZ.hasard(2);
          longueurs.push(n);
          x += pas[dir][0] * n; y += pas[dir][1] * n;
          pts.push([x, y]);
        }
        if (!this.estAmbigue(longueurs, virages)) return pts;
      }
      /* garde-fou : une forme en L, chirale par construction */
      return [[0, 0], [2, 0], [2, 3], [1, 3], [1, 2]];
    },

    dessinerForme: function (pts, angle, miroir, taille) {
      var NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '-10 -10 20 20');
      var t = taille || 170;
      svg.setAttribute('width', String(t)); svg.setAttribute('height', String(t));
      var xs = pts.map(function (p) { return p[0]; });
      var ys = pts.map(function (p) { return p[1]; });
      var cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
      var cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;

      /* mise à l'échelle : une forme de trois unités dans un cadre de vingt
         se lirait comme une tache. On la ramène à la taille du cadre, en
         gardant de la marge pour que la rotation ne la fasse pas déborder. */
      var etendue = Math.max(
        Math.max.apply(null, xs) - Math.min.apply(null, xs),
        Math.max.apply(null, ys) - Math.min.apply(null, ys), 1);
      var k = 11 / etendue;

      var a = angle * Math.PI / 180;
      function projeter(p) {
        var px = (p[0] - cx) * k, py = (p[1] - cy) * k;
        if (miroir) px = -px;
        return [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)];
      }

      var d = pts.map(function (p, i) {
        var q = projeter(p);
        return (i ? 'L' : 'M') + q[0].toFixed(2) + ',' + q[1].toFixed(2);
      }).join('');
      var n = document.createElementNS(NS, 'path');
      n.setAttribute('d', d);
      n.setAttribute('fill', 'none');
      n.setAttribute('stroke', '#F5A623');
      n.setAttribute('stroke-width', '2');
      n.setAttribute('stroke-linecap', 'round');
      n.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(n);

      /* Point de départ : sans repère, l'œil ne sait pas par quel bout lire
         la forme, et la comparaison devient pénible même quand elle est
         parfaitement légitime. */
      var q0 = projeter(pts[0]);
      var c0 = document.createElementNS(NS, 'circle');
      c0.setAttribute('cx', q0[0].toFixed(2)); c0.setAttribute('cy', q0[1].toFixed(2));
      c0.setAttribute('r', '1.9');
      c0.setAttribute('fill', '#F5A623');
      svg.appendChild(c0);
      return svg;
    },

    suivant: function () {
      var self = this, ctx = this.ctx;
      if (this.essai >= this.ESSAIS) { ctx.terminer(); return; }
      this.essai++;

      var pts = this.formeAleatoire();
      /* en Découverte, des quarts de tour : la comparaison reste franche.
         Au-delà, des huitièmes de tour, qui obligent à vraiment pivoter. */
      var angle = (this.ctx.niveau === 'decouverte')
        ? 90 * (1 + TZ.hasard(3))
        : 45 * (1 + TZ.hasard(6));
      this.identique = Math.random() < 0.5;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Même forme, ou reflet ?');
      var paire = TZ.el('div');
      paire.style.cssText = 'display:flex;gap:26px;align-items:center;justify-content:center';
      paire.appendChild(this.dessinerForme(pts, 0, false));
      paire.appendChild(this.dessinerForme(pts, angle, !this.identique));
      scene.appendChild(paire);

      ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'essai');
      ctx.bandeau.info('justes', this.justes, 'justes');

      this.debut = performance.now();
      this.ouvert = true;

      UI.actions(scene, [
        { texte: 'Même forme', action: function () { self.repondre(true); } },
        { texte: 'Reflet', fantome: true, action: function () { self.repondre(false); } }
      ]);

      var limite = this.r.limite * TZ.STRESS[TZ.etat.stress].chrono;
      if (this.chrono) this.chrono.arreter();
      this.chrono = TZ.chrono(limite, function (f) { ctx.bandeau.jauge(f); }, function () {
        if (!self.ouvert) return;
        self.ouvert = false;
        TZ.son.faux();
        TZ.apres(300, function () { self.suivant(); });
      });
    },

    repondre: function (dit) {
      if (!this.ouvert) return;
      this.ouvert = false;
      if (this.chrono) this.chrono.arreter();
      var ok = dit === this.identique;
      if (ok) { this.justes++; this.temps.push(performance.now() - this.debut); TZ.son.bip(); }
      else { TZ.son.faux(); TZ.distracteur(this.ctx.scene); }
      var self = this;
      TZ.apres(ok ? 220 : 500, function () { self.suivant(); });
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var precision = this.essai ? this.justes / this.essai : 0;
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      return {
        precision: precision, vitesse: TZ.borne((4500 - moy) / 3500, 0, 1),
        difficulte: 0.65,
        details: { 'Justes': this.justes + ' / ' + this.essai,
                   'Temps moyen': moy ? (moy / 1000).toFixed(1) + ' s' : '—' }
      };
    }
  });

})(window);
