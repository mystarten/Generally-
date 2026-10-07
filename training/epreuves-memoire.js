/* =============================================================================
   Zone d'entraînement — épreuves de mémoire.

   Contrat commun à toutes les épreuves :
       init(ctx)   prépare l'état et l'affichage ; ctx fournit la scène,
                   le bandeau, le niveau de difficulté, le stress et terminer().
       start()     lance l'épreuve
       update()    appelée à chaque image si l'épreuve en a besoin
       end()       nettoie (minuteurs, écouteurs)
       getScore()  renvoie { score, precision, vitesse, difficulte, details }

   Chaque épreuve déclare une table « reglages » : un jeu de paramètres par
   niveau de difficulté. C'est le seul endroit à toucher pour rééquilibrer.

   Note sur le temps : les durées sont exprimées au niveau Calme. Le moteur
   les raccourcit ensuite selon le stress (×0,78 en Modéré, ×0,58 en Intense),
   elles doivent donc rester confortables ici.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  var SYMBOLES = ['▲','●','■','◆','★','✦','✚','⬟','◗','◖','◢','◣','⬢','✸','❖','⬣',
                  '◉','◧','◨','⯂','⬤','▰','▱','⯁'];

  /* ========================================================= 1. Jeu de Kim */
  TZ.epreuves.push({
    id: 'kim',
    nom: 'Jeu de Kim',
    categorie: 'memoire',
    axe: 'memoireVisuelle',
    but: 'Mémoriser une scène d’un seul regard, puis repérer ce qui a changé.',
    comment: 'Des symboles s’affichent. Ils disparaissent, puis reviennent : certains ont changé. Cliquez ceux qui ont changé.',
    tuto: {
      regle: 'Une grille de symboles s’affiche. Elle disparaît, puis revient — mais deux ou trois symboles ont été remplacés. Cliquez uniquement ceux qui ont changé, puis validez.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', ['▲','●','■','◆'], 'Au départ', 'Mémorisez la grille'],
         ['non', ['▲','★','■','✚'], 'Au retour', '2 symboles ont changé']].forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          c[1].forEach(function (sy, i) {
            var o = TZ.el('div', null, sy);
            o.style.cssText = 'font-size:1.6rem;width:34px;height:34px;display:grid;place-items:center;border-radius:8px;background:var(--tz-creux)';
            if (c[0] === 'non' && (i === 1 || i === 3)) o.style.background = 'var(--tz-ko-pale)';
            v.appendChild(o);
          });
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Ici, il fallait cliquer le deuxième et le quatrième symbole.'));
      },
      pourquoi: 'C’est l’exercice d’observation des unités de reconnaissance : relever une scène d’un coup d’œil, puis détecter ce qui a bougé. Le temps accordé grandit avec le nombre de symboles — il n’est jamais question de lire plus vite que l’œil ne peut.'
    },

    /* Le temps est proportionnel au nombre de symboles : c'est ce qui manquait.
       Afficher seize symboles deux secondes n'entraîne rien, cela décourage. */
    reglages: {
      decouverte: { base: 4, pas: 1,   msParSymbole: 950, changes: 2, manches: 4 },
      standard:   { base: 5, pas: 1.5, msParSymbole: 680, changes: 2, manches: 5 },
      confirme:   { base: 6, pas: 2,   msParSymbole: 500, changes: 3, manches: 5 },
      expert:     { base: 8, pas: 2,   msParSymbole: 380, changes: 3, manches: 6 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.manche = 0;
      this.justes = 0;
      this.total = 0;
      this.fautes = 0;
      this.MANCHES = this.r.manches;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.manchePresentation(); });
    },

    manchePresentation: function () {
      var self = this, ctx = this.ctx;
      this.manche++;
      if (this.manche > this.MANCHES) { ctx.terminer(); return; }

      var nb = Math.round(this.r.base + this.manche * this.r.pas);
      /* plancher de 3,5 s : même peu de symboles demandent un temps de pose */
      var duree = Math.max(3500, nb * this.r.msParSymbole);
      this.items = TZ.melanger(SYMBOLES).slice(0, nb);
      this.colonnes = Math.ceil(Math.sqrt(nb));

      ctx.bandeau.info('manche', this.manche + ' / ' + this.MANCHES, 'manche');
      ctx.bandeau.info('symboles', nb, 'symboles');

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Mémorisez cette scène');
      UI.grilleObjets(scene, this.items, this.colonnes, null);

      this.chrono = TZ.chrono(duree, function (f) { ctx.bandeau.jauge(f); }, function () {
        self.mancheRappel();
      });
    },

    mancheRappel: function () {
      var self = this, ctx = this.ctx;
      var nbChange = Math.min(this.r.changes + Math.floor(this.manche / 3), 4);
      var libres = SYMBOLES.filter(function (s) { return self.items.indexOf(s) < 0; });
      var positions = TZ.melanger(this.items.map(function (_, i) { return i; })).slice(0, nbChange);
      this.changes = positions.slice();
      var nouveaux = this.items.slice();
      positions.forEach(function (p, k) { nouveaux[p] = libres[k % libres.length]; });

      this.choisis = {};
      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Cliquez les ' + nbChange + ' symboles qui ont changé');
      var grille = UI.grilleObjets(scene, nouveaux, this.colonnes, function (idx, noeud) {
        if (self.choisis[idx]) { delete self.choisis[idx]; noeud.classList.remove('tz-choisi'); }
        else { self.choisis[idx] = true; noeud.classList.add('tz-choisi'); }
        TZ.son.bip();
      });

      UI.actions(scene, [{ texte: 'Valider', action: function () { self.valider(grille); } }]);
      ctx.bandeau.jauge(1);
    },

    valider: function (grille) {
      var self = this;
      if (this.chrono) this.chrono.arreter();
      var choisis = Object.keys(this.choisis).map(Number);
      var bons = choisis.filter(function (i) { return self.changes.indexOf(i) >= 0; });
      var mauvais = choisis.filter(function (i) { return self.changes.indexOf(i) < 0; });

      this.justes += bons.length;
      this.total += this.changes.length;
      this.fautes += mauvais.length;

      grille.noeuds.forEach(function (n, i) {
        n.classList.remove('tz-choisi');
        if (self.changes.indexOf(i) >= 0) n.classList.add('tz-juste');
        else if (choisis.indexOf(i) >= 0) n.classList.add('tz-faux');
      });

      if (bons.length === this.changes.length && !mauvais.length) TZ.son.juste();
      else TZ.son.faux();

      TZ.apres(1300, function () { self.manchePresentation(); });
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var precision = this.total ? TZ.borne((this.justes - this.fautes * 0.5) / this.total, 0, 1) : 0;
      return {
        precision: precision, vitesse: 0.5,
        difficulte: TZ.borne((this.manche - 1) / this.MANCHES, 0, 1),
        details: { 'Repérés': this.justes + ' / ' + this.total, 'Fausses alertes': this.fautes }
      };
    }
  });

  /* ================================================ 2. Blocs de Corsi (carte) */
  TZ.epreuves.push({
    id: 'corsi',
    nom: 'Blocs de Corsi',
    categorie: 'memoire',
    axe: 'memoireTravail',
    but: 'Retenir une séquence spatiale de plus en plus longue.',
    comment: 'Des pays s’allument dans un ordre précis. Reproduisez-le. Au-delà d’un certain palier, l’ordre devient inverse.',
    tuto: {
      regle: 'Des pastilles s’allument une par une sur la carte. Rejouez la même séquence en cliquant les pastilles dans le même ordre. La séquence s’allonge à chaque réussite.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', '1 → 2 → 3', 'Ordre direct', 'Vous rejouez tel quel'],
         ['non', '3 → 2 → 1', 'Ordre inverse', 'Annoncé avant la séquence']].forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          var t = TZ.el('div', null, c[1]);
          t.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1.3rem';
          v.appendChild(t);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'On clique les pastilles, pas les pays : viser un pays au pixel près relèverait de l’adresse, pas de la mémoire.'));
      },
      pourquoi: 'Le test de Corsi mesure l’empan spatial — combien de positions vous tenez en mémoire d’un coup. L’ordre inverse ajoute une manipulation : il ne suffit plus de retenir, il faut retourner la séquence dans sa tête.'
    },
    requiert: 'carte',

    reglages: {
      decouverte: { depart: 2, max: 6,  inverseA: 99, ms: 980, viesMax: 3 },
      standard:   { depart: 2, max: 8,  inverseA: 5,  ms: 780, viesMax: 2 },
      confirme:   { depart: 3, max: 9,  inverseA: 4,  ms: 640, viesMax: 2 },
      expert:     { depart: 4, max: 10, inverseA: 3,  ms: 520, viesMax: 2 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.longueur = this.r.depart;
      this.meilleure = 0;
      this.essais = 0;
      this.reussites = 0;
      this.echecs = 0;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.mancheSequence(); });
    },

    mancheSequence: function () {
      var self = this, ctx = this.ctx;
      if (this.echecs >= this.r.viesMax || this.longueur > this.r.max) { ctx.terminer(); return; }

      this.inverse = this.longueur >= this.r.inverseA;
      this.sequence = TZ.melanger(TZ.carte.pays).slice(0, this.longueur)
                        .map(function (p) { return p.id; });

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.inverse ? 'Mémorisez, puis cliquez dans l’ordre INVERSE'
                                      : 'Mémorisez l’ordre');
      var hote = TZ.el('div');
      scene.appendChild(hote);
      this.carte = TZ.carte.dessiner(hote, null);
      if (!this.carte) { ctx.terminer(); return; }

      ctx.bandeau.info('longueur', this.longueur, 'pays');
      ctx.bandeau.info('erreurs', this.echecs + ' / ' + this.r.viesMax, 'erreurs');

      var i = 0;
      (function allumer() {
        if (i > 0) self.carte.etat(self.sequence[i - 1], null);
        if (i >= self.sequence.length) { TZ.apres(420, function () { self.mancheRappel(); }); return; }
        self.carte.etat(self.sequence[i], 'tz-actif');
        TZ.son.bip();
        i++;
        TZ.apres(self.r.ms, allumer);
      })();
    },

    mancheRappel: function () {
      var self = this, ctx = this.ctx;
      var attendu = this.inverse ? this.sequence.slice().reverse() : this.sequence.slice();
      var pos = 0;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.inverse ? 'À vous — ordre inverse' : 'À vous — même ordre');
      var hote = TZ.el('div');
      scene.appendChild(hote);

      this.carte = TZ.carte.dessiner(hote, function (code) {
        if (code === attendu[pos]) {
          self.carte.etat(code, 'tz-juste');
          TZ.son.bip();
          pos++;
          if (pos >= attendu.length) {
            self.reussites++;
            self.meilleure = Math.max(self.meilleure, self.longueur);
            self.essais++;
            TZ.son.juste();
            self.longueur++;
            TZ.apres(900, function () { self.mancheSequence(); });
          }
        } else {
          self.carte.etat(code, 'tz-faux');
          TZ.son.faux();
          self.echecs++;
          self.essais++;
          TZ.apres(900, function () { self.mancheSequence(); });
        }
      });
      this.carte.cliquables(TZ.carte.pays.map(function (p) { return p.id; }));
      ctx.bandeau.jauge(1);
    },

    update: function () {},
    end: function () {},

    getScore: function () {
      var precision = this.essais ? this.reussites / this.essais : 0;
      var etendue = Math.max(1, this.r.max - this.r.depart);
      return {
        precision: precision, vitesse: 0.5,
        difficulte: TZ.borne((this.meilleure - this.r.depart) / etendue, 0, 1),
        details: { 'Séquence max': this.meilleure, 'Réussites': this.reussites }
      };
    }
  });

  /* ==================================================== 3. Empan de chiffres */
  TZ.epreuves.push({
    id: 'empan',
    nom: 'Empan de chiffres',
    categorie: 'memoire',
    axe: 'memoireTravail',
    but: 'Mesurer la capacité de la mémoire de travail verbale.',
    comment: 'Des chiffres défilent un par un. Retapez-les, à l’endroit puis à l’envers.',
    tuto: {
      regle: 'Des chiffres défilent un par un, puis disparaissent. Tapez-les au clavier. Dans la seconde moitié de l’épreuve, tapez-les à l’envers.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', '4 7 1', '471', 'Sens direct', 'Vous tapez dans l’ordre'],
         ['non', '4 7 1', '174', 'Sens inverse', 'Vous tapez en partant de la fin']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.style.flexDirection = 'column';
          var a = TZ.el('div', null, 'affiché : ' + c[1]);
          a.style.cssText = 'font-size:.84rem;color:var(--tz-txt-2)';
          var r = TZ.el('div', null, c[2]);
          r.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1.5rem;letter-spacing:.1em';
          v.appendChild(a); v.appendChild(r);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[3]));
          b.appendChild(TZ.el('em', null, c[4]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
      },
      pourquoi: 'L’empan de chiffres est la mesure la plus ancienne de la mémoire de travail. Le rappel inversé est nettement plus exigeant : il faut garder la suite ET la manipuler, ce qui est précisément ce qu’on fait en situation.'
    },

    reglages: {
      decouverte: { depart: 3, max: 6,  ms: 1050, viesMax: 3, inverse: false },
      standard:   { depart: 3, max: 8,  ms: 840,  viesMax: 2, inverse: true },
      confirme:   { depart: 4, max: 9,  ms: 700,  viesMax: 2, inverse: true },
      expert:     { depart: 5, max: 10, ms: 580,  viesMax: 2, inverse: true }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.longueur = this.r.depart;
      this.meilleure = 0;
      this.phaseInverse = false;
      this.essais = 0;
      this.reussites = 0;
      this.echecs = 0;
    },

    start: function () {
      var self = this;
      /* Décompte en points : « 3 2 1 » s'affichait comme les chiffres à
         mémoriser, au même endroit et plus vite qu'eux. On ne savait plus
         où commençait la suite. */
      UI.depart(this.ctx.scene, function () { self.manchePresentation(); },
                { sansChiffres: true });
    },

    manchePresentation: function () {
      var self = this, ctx = this.ctx;
      if (this.echecs >= this.r.viesMax || this.longueur > this.r.max) {
        /* on bascule en rappel inversé plutôt que d'arrêter tout de suite */
        if (!this.phaseInverse && this.r.inverse) {
          this.phaseInverse = true; this.echecs = 0; this.longueur = this.r.depart;
        } else { ctx.terminer(); return; }
      }

      this.suite = [];
      for (var i = 0; i < this.longueur; i++) this.suite.push(TZ.hasard(10));

      ctx.bandeau.info('longueur', this.longueur, 'chiffres');
      ctx.bandeau.info('sens', this.phaseInverse ? 'inverse' : 'direct', '');
      ctx.bandeau.info('erreurs', this.echecs + ' / ' + this.r.viesMax, 'erreurs');

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.phaseInverse ? 'Retenez — à retaper à l’envers'
                                           : 'Retenez — à retaper dans l’ordre');
      var n = TZ.el('div', 'tz-grand', '');
      scene.appendChild(n);

      /* Un temps d'arrêt avant le premier chiffre : la consigne doit être lue
         avant que la suite commence, sinon on rate le début en la lisant. */
      n.textContent = '·';
      n.classList.add('tz-decompte');

      var k = 0;
      TZ.apres(700, function () { n.classList.remove('tz-decompte'); afficher(); });

      function afficher() {
        if (k >= self.suite.length) {
          n.textContent = '';
          TZ.apres(320, function () { self.mancheRappel(); });
          return;
        }
        n.textContent = String(self.suite[k]);
        n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
        TZ.son.tic();
        k++;
        /* 280 ms de blanc, pas 180 : quand la suite contient deux fois le même
           chiffre d'affilée, une coupure trop brève les fait lire comme un
           seul. */
        TZ.apres(self.r.ms, function () { n.textContent = ''; TZ.apres(280, afficher); });
      }
    },

    mancheRappel: function () {
      var self = this, ctx = this.ctx;
      var attendu = (this.phaseInverse ? this.suite.slice().reverse() : this.suite).join('');

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, this.phaseInverse ? 'Tapez la suite à l’envers' : 'Tapez la suite');
      var champ = TZ.el('input', 'tz-saisie');
      champ.type = 'text';
      champ.inputMode = 'numeric';
      champ.autocomplete = 'off';
      champ.maxLength = 12;
      scene.appendChild(champ);
      champ.focus();

      function valider() {
        var donne = (champ.value || '').replace(/\D/g, '');
        self.essais++;
        var ok = donne === attendu;
        if (ok) {
          self.reussites++;
          self.meilleure = Math.max(self.meilleure, self.longueur);
          self.longueur++;
          TZ.son.juste();
        } else {
          self.echecs++;
          TZ.son.faux();
        }
        UI.message(scene, ok ? 'Juste' : 'Attendu : ' + attendu, ok ? 'ok' : 'ko');
        champ.disabled = true;
        TZ.apres(1200, function () { self.manchePresentation(); });
      }

      champ.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); valider(); }
      });
      UI.actions(scene, [{ texte: 'Valider', action: valider }]);
      ctx.bandeau.jauge(1);
    },

    update: function () {},
    end: function () {},

    getScore: function () {
      var precision = this.essais ? this.reussites / this.essais : 0;
      var etendue = Math.max(1, this.r.max - this.r.depart);
      return {
        precision: precision, vitesse: 0.5,
        difficulte: TZ.borne((this.meilleure - this.r.depart) / etendue, 0, 1),
        details: { 'Empan max': this.meilleure, 'Réussites': this.reussites }
      };
    }
  });

  /* ================================================ 4. Mémoire de signalement */
  var DESC = {
    taille: ['1 m 65', '1 m 72', '1 m 78', '1 m 85', '1 m 90'],
    corpulence: ['mince', 'athlétique', 'corpulent', 'moyen'],
    haut: ['blouson noir', 'veste beige', 'sweat gris', 'parka verte', 'chemise bleue'],
    bas: ['jean clair', 'pantalon noir', 'treillis kaki', 'jogging gris'],
    signe: ['barbe courte', 'crâne rasé', 'lunettes rondes', 'casquette rouge', 'cicatrice au menton'],
    vehicule: ['berline', 'break', 'utilitaire', 'citadine', 'monospace'],
    couleurV: ['grise', 'blanche', 'noire', 'bleu nuit', 'rouge sombre'],
    direction: ['vers le nord', 'vers le sud', 'vers l’est', 'vers l’ouest']
  };

  function tzPlaque() {
    var L = 'ABCDEFGHJKLMNPQRSTVWXYZ';
    function l() { return L[TZ.hasard(L.length)]; }
    return l() + l() + '-' + (100 + TZ.hasard(900)) + '-' + l() + l();
  }

  TZ.epreuves.push({
    id: 'signalement',
    nom: 'Mémoire de signalement',
    categorie: 'memoire',
    axe: 'memoireVisuelle',
    but: 'Retenir un signalement complet sous contrainte de temps.',
    comment: 'Un signalement s’affiche. Il disparaît, puis on vous interroge sur les détails.',
    tuto: {
      regle: 'Une fiche de signalement s’affiche quelques secondes : individu, vêtements, véhicule, plaque, direction. Elle disparaît, puis on vous pose des questions précises à choix multiple.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var b = TZ.el('div', 'tz-cas');
        var v = TZ.el('div', 'tz-vignette');
        v.style.flexDirection = 'column';
        v.style.alignItems = 'flex-start';
        [['Véhicule', 'berline grise'], ['Plaque', 'DK-482-RT']].forEach(function (l) {
          var d = TZ.el('div');
          d.style.cssText = 'font-size:.84rem';
          d.appendChild(TZ.el('span', null, l[0] + ' : '));
          d.appendChild(TZ.el('b', null, l[1]));
          v.appendChild(d);
        });
        b.appendChild(v);
        b.appendChild(TZ.el('b', null, 'La fiche'));
        b.appendChild(TZ.el('em', null, 'À mémoriser'));
        ex.appendChild(b);
        var q = TZ.el('div', 'tz-cas tz-oui');
        var w = TZ.el('div', 'tz-vignette');
        w.style.flexDirection = 'column';
        var t = TZ.el('div', null, 'Couleur du véhicule ?');
        t.style.cssText = 'font-size:.86rem;font-weight:700;margin-bottom:5px';
        var a = TZ.el('div', null, 'grise');
        a.style.cssText = 'font-family:var(--tz-titre);font-weight:700;color:var(--tz-ok)';
        w.appendChild(t); w.appendChild(a);
        q.appendChild(w);
        q.appendChild(TZ.el('b', null, 'La question'));
        q.appendChild(TZ.el('em', null, 'Après disparition'));
        ex.appendChild(q);
        hote.appendChild(ex);
      },
      pourquoi: 'Retenir un signalement complet mobilise la mémoire pour des détails arbitraires, sans logique à laquelle se raccrocher — une plaque ne se déduit pas. C’est l’exercice qui ressemble le plus à une situation réelle de témoignage.'
    },

    reglages: {
      decouverte: { base: 15000, retrait: 1500, questions: 3, manches: 3 },
      standard:   { base: 12000, retrait: 1800, questions: 4, manches: 3 },
      confirme:   { base:  9000, retrait: 1800, questions: 5, manches: 4 },
      expert:     { base:  7000, retrait: 1500, questions: 5, manches: 4 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.manche = 0;
      this.MANCHES = this.r.manches;
      this.justes = 0;
      this.total = 0;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.manchePresentation(); });
    },

    manchePresentation: function () {
      var self = this, ctx = this.ctx;
      this.manche++;
      if (this.manche > this.MANCHES) { ctx.terminer(); return; }

      function pioche(cle) { return DESC[cle][TZ.hasard(DESC[cle].length)]; }
      this.fiche = {
        taille: pioche('taille'), corpulence: pioche('corpulence'),
        haut: pioche('haut'), bas: pioche('bas'), signe: pioche('signe'),
        vehicule: pioche('vehicule'), couleurV: pioche('couleurV'),
        plaque: tzPlaque(), direction: pioche('direction')
      };

      ctx.bandeau.info('manche', this.manche + ' / ' + this.MANCHES, 'manche');

      var f = this.fiche;
      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Signalement — mémorisez');
      var bloc = TZ.el('div', 'tz-panneau');
      bloc.style.maxWidth = '420px';
      [
        ['Individu', f.taille + ', ' + f.corpulence],
        ['Vêtements', f.haut + ', ' + f.bas],
        ['Signe particulier', f.signe],
        ['Véhicule', f.vehicule + ' ' + f.couleurV],
        ['Plaque', f.plaque],
        ['Direction', f.direction]
      ].forEach(function (p) {
        var l = TZ.el('div');
        l.style.marginBottom = '6px';
        l.appendChild(TZ.el('span', 'tz-etiquette', p[0]));
        l.appendChild(TZ.el('b', null, p[1]));
        bloc.appendChild(l);
      });
      scene.appendChild(bloc);

      var duree = Math.max(5500, this.r.base - this.manche * this.r.retrait);
      this.chrono = TZ.chrono(duree, function (fr) { ctx.bandeau.jauge(fr); },
                              function () { self.mancheQuestions(); });
    },

    mancheQuestions: function () {
      var self = this, ctx = this.ctx;
      var f = this.fiche;
      var questions = TZ.melanger([
        { q: 'Couleur du véhicule ?', bonne: f.couleurV, lot: DESC.couleurV },
        { q: 'Signe particulier ?',   bonne: f.signe,    lot: DESC.signe },
        { q: 'Plaque d’immatriculation ?', bonne: f.plaque,
          lot: [f.plaque, tzPlaque(), tzPlaque(), tzPlaque()] },
        { q: 'Direction de fuite ?',  bonne: f.direction, lot: DESC.direction },
        { q: 'Haut porté ?',          bonne: f.haut,     lot: DESC.haut },
        { q: 'Type de véhicule ?',    bonne: f.vehicule, lot: DESC.vehicule }
      ]).slice(0, this.r.questions);

      var k = 0;
      function poser() {
        if (k >= questions.length) {
          TZ.apres(600, function () { self.manchePresentation(); });
          return;
        }
        var it = questions[k];
        var choix = TZ.melanger(
          [it.bonne].concat(it.lot.filter(function (x) { return x !== it.bonne; }).slice(0, 3))
        );
        var scene = TZ.vide(ctx.scene);
        UI.consigne(scene, it.q);
        var r = TZ.el('div', 'tz-rangee');
        r.style.flexDirection = 'column';
        r.style.alignItems = 'stretch';
        choix.forEach(function (c) {
          var b = TZ.el('button', 'tz-btn tz-fantome', c);
          b.type = 'button';
          b.addEventListener('click', function () {
            self.total++;
            var ok = c === it.bonne;
            if (ok) { self.justes++; TZ.son.juste(); }
            else { TZ.son.faux(); }
            UI.message(scene, ok ? 'Juste' : 'C’était : ' + it.bonne, ok ? 'ok' : 'ko');
            k++;
            TZ.apres(950, poser);
          });
          r.appendChild(b);
        });
        scene.appendChild(r);
        ctx.bandeau.jauge(1 - k / questions.length);
      }
      poser();
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      return {
        precision: this.total ? this.justes / this.total : 0, vitesse: 0.5,
        difficulte: TZ.borne((this.manche - 1) / this.MANCHES, 0, 1),
        details: { 'Bonnes réponses': this.justes + ' / ' + this.total }
      };
    }
  });

  /* =================================================== 5. Mémoire d'itinéraire */
  TZ.epreuves.push({
    id: 'itineraire',
    nom: 'Mémoire d’itinéraire',
    categorie: 'memoire',
    axe: 'memoireVisuelle',
    but: 'Retenir un trajet et le reproduire de mémoire.',
    comment: 'Un itinéraire se trace sur la carte. Reproduisez-le en cliquant les étapes dans l’ordre.',
    tuto: {
      regle: 'Un trajet numéroté se trace sur la carte. Il disparaît. Recliquez les étapes dans le même ordre.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var b = TZ.el('div', 'tz-cas tz-oui');
        var v = TZ.el('div', 'tz-vignette');
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 140 70');
        svg.setAttribute('width', '160'); svg.setAttribute('height', '80');
        var l = document.createElementNS(NS, 'path');
        l.setAttribute('d', 'M20,50 L65,20 L118,45');
        l.setAttribute('fill', 'none'); l.setAttribute('stroke', '#F5A623');
        l.setAttribute('stroke-width', '3'); l.setAttribute('stroke-dasharray', '7 5');
        svg.appendChild(l);
        [[20,50,'1'],[65,20,'2'],[118,45,'3']].forEach(function (p) {
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 8);
          c.setAttribute('fill', '#F5A623');
          svg.appendChild(c);
          var t = document.createElementNS(NS, 'text');
          t.setAttribute('x', p[0]); t.setAttribute('y', p[1] + 4);
          t.setAttribute('text-anchor', 'middle');
          t.setAttribute('fill', '#fff');
          t.setAttribute('font-size', '11'); t.setAttribute('font-weight', '700');
          t.textContent = p[2];
          svg.appendChild(t);
        });
        v.appendChild(svg);
        b.appendChild(v);
        b.appendChild(TZ.el('b', null, 'Le trajet montré'));
        b.appendChild(TZ.el('em', null, 'Les numéros donnent l’ordre'));
        ex.appendChild(b);
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Ici, vous cliqueriez la pastille 1, puis la 2, puis la 3.'));
      },
      pourquoi: 'Mémoriser un itinéraire, c’est retenir une suite de lieux ET leur ordre. C’est exactement ce qu’on demande à quelqu’un qui doit rejoindre un point sans carte sous les yeux.'
    },
    requiert: 'carte',

    reglages: {
      decouverte: { depart: 2, base: 9000, retrait: 700,  manches: 3 },
      standard:   { depart: 3, base: 8000, retrait: 900,  manches: 4 },
      confirme:   { depart: 4, base: 6500, retrait: 900,  manches: 4 },
      expert:     { depart: 5, base: 5500, retrait: 800,  manches: 5 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.etapes = this.r.depart;
      this.manche = 0;
      this.MANCHES = this.r.manches;
      this.justes = 0;
      this.total = 0;
      this.meilleure = 0;
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.manchePresentation(); });
    },

    manchePresentation: function () {
      var self = this, ctx = this.ctx;
      this.manche++;
      if (this.manche > this.MANCHES) { ctx.terminer(); return; }

      this.trajet = TZ.melanger(TZ.carte.pays).slice(0, this.etapes)
                      .map(function (p) { return p.id; });

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Mémorisez l’itinéraire — ' + this.etapes + ' étapes');
      var hote = TZ.el('div');
      scene.appendChild(hote);
      this.carte = TZ.carte.dessiner(hote, null);
      if (!this.carte) { ctx.terminer(); return; }
      this.carte.tracer(this.trajet);

      ctx.bandeau.info('manche', this.manche + ' / ' + this.MANCHES, 'manche');
      ctx.bandeau.info('etapes', this.etapes, 'étapes');

      var duree = Math.max(4000, this.r.base - this.manche * this.r.retrait);
      this.chrono = TZ.chrono(duree, function (fr) { ctx.bandeau.jauge(fr); },
                              function () { self.mancheRappel(); });
    },

    mancheRappel: function () {
      var self = this, ctx = this.ctx;
      var pos = 0, faitesJustes = 0;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Reproduisez l’itinéraire');
      var hote = TZ.el('div');
      scene.appendChild(hote);
      this.carte = TZ.carte.dessiner(hote, function (code) {
        if (pos >= self.trajet.length) return;
        var ok = code === self.trajet[pos];
        self.total++;
        if (ok) { faitesJustes++; self.justes++; self.carte.etat(code, 'tz-juste'); TZ.son.bip(); }
        else { self.carte.etat(code, 'tz-faux'); TZ.son.faux(); }
        pos++;
        if (pos >= self.trajet.length) {
          self.carte.tracer(self.trajet);
          if (faitesJustes === self.trajet.length) {
            TZ.son.juste();
            self.meilleure = Math.max(self.meilleure, self.etapes);
            self.etapes++;
          }
          TZ.apres(1400, function () { self.manchePresentation(); });
        }
      });
      this.carte.cliquables(TZ.carte.pays.map(function (p) { return p.id; }));
      ctx.bandeau.jauge(1);
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      return {
        precision: this.total ? this.justes / this.total : 0, vitesse: 0.5,
        difficulte: TZ.borne((this.meilleure - this.r.depart) / 4, 0, 1),
        details: { 'Étapes retenues': this.justes + ' / ' + this.total,
                   'Itinéraire max': this.meilleure || '—' }
      };
    }
  });

})(window);
