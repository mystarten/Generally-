/* =============================================================================
   Zone d'entraînement — fabrique d'épreuves à questions.

   Cinq épreuves du volet métier font la même chose : poser un énoncé,
   proposer des réponses, révéler, expliquer, passer à la suivante. Écrire
   cinq fois cette boucle, c'est garantir que les cinq divergeront — l'une
   oubliera d'arrêter son chrono, l'autre de compter un abandon.

   D'où cette fabrique. TZ.quizz.creer() rend un objet d'épreuve complet, qui
   respecte le contrat du moteur (init, start, update, end, getScore). Ce qui
   distingue une épreuve d'une autre tient dans ses options, et surtout dans
   sa fonction « tirage », qui dit QUELLES questions poser.

   Ce fichier ne contient aucune question : il ne sait pas d'où elles
   viennent. On peut donc le réutiliser pour la banque métier, pour les
   grades, ou pour n'importe quelle autre source.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  /* --------------------------------------------------------- panneau de réponses
     Boutons larges : on teste une connaissance, pas la précision du curseur.
     Deux propositions passent en ligne, trois ou quatre en grille — c'est la
     feuille de style qui s'en charge, selon le nombre. */
  function tzReponses(scene, options, surChoix) {
    var grille = TZ.el('div', 'tz-reponses' + (options.length === 2 ? ' tz-reponses-duo' : ''));
    var noeuds = [];
    options.forEach(function (o) {
      var b = TZ.el('button', 'tz-reponse', o.texte);
      b.type = 'button';
      b.addEventListener('click', function () { surChoix(o, b, noeuds); });
      grille.appendChild(b);
      noeuds.push({ bouton: b, option: o });
    });
    scene.appendChild(grille);
    return noeuds;
  }

  function tzFiger(noeuds) {
    noeuds.forEach(function (n) { n.bouton.disabled = true; });
  }

  function tzRevelerJuste(noeuds) {
    noeuds.forEach(function (n) {
      if (n.option.juste) n.bouton.classList.add('tz-juste');
    });
  }

  /* L'explication et la source, sous la question. C'est la partie qui fait
     apprendre : un score sans explication n'enseigne rien. */
  function tzExpliquer(scene, q) {
    var boite = TZ.el('div', 'tz-explication');
    if (q.explication) boite.appendChild(TZ.el('p', 'tz-expli-texte', q.explication));
    if (q.source) boite.appendChild(TZ.el('p', 'tz-expli-source', q.source));
    scene.appendChild(boite);
    return boite;
  }

  /* ================================================================ fabrique */
  function tzCreer(spec) {

    return {
      id: spec.id,
      nom: spec.nom,
      categorie: spec.categorie,
      axe: spec.axe || 'connaissances',
      force: spec.force || 'commun',
      but: spec.but,
      comment: spec.comment,
      tuto: spec.tuto,
      etiquettes: spec.etiquettes,
      reglages: spec.reglages,
      /* Combien de questions le réglage courant rend réellement disponibles.
         L'écran de préparation s'en sert pour annoncer la longueur de la
         séance plutôt que de la découvrir en jouant. */
      disponibles: spec.disponibles,

      init: function (ctx) {
        this.ctx = ctx;
        this.r = this.reglages[ctx.niveau] || this.reglages.standard;
        /* Un lot imposé prime sur le tirage : c'est ce qui permet de rejouer
           exactement les questions ratées. Il ne sert qu'une fois, sinon
           « rejouer » enfermerait dans la même poignée de questions. */
        if (this.lotImpose && this.lotImpose.length) {
          this.lot = this.lotImpose.slice();
          this.lotImpose = null;
        } else {
          /* On tire tout le lot d'avance : une question déjà posée ne doit pas
             revenir dans la même séance, et le tirage est le seul endroit qui
             connaisse la source des questions. */
          this.lot = spec.tirage(ctx.niveau, this.r.essais) || [];
        }
        this.ESSAIS = this.lot.length;
        this.essai = 0;
        this.justes = 0;
        this.temps = [];
        this.rates = [];
      },

      start: function () {
        var self = this;
        if (!this.ESSAIS) {
          UI.message(this.ctx.scene,
            'Aucune question disponible à ce réglage.', 'ko');
          TZ.apres(1400, function () { self.ctx.terminer(); });
          return;
        }
        /* décompte en points : plusieurs épreuves posent des chiffres, et
           « 3 2 1 » au même endroit se confondrait avec l'énoncé */
        UI.depart(this.ctx.scene, function () { self.suivant(); }, { sansChiffres: true });
      },

      suivant: function () {
        var self = this, ctx = this.ctx;
        if (this.chrono) this.chrono.arreter();
        if (this.essai >= this.ESSAIS) { ctx.terminer(); return; }

        var q = this.lot[this.essai];
        this.essai++;

        var scene = TZ.vide(ctx.scene);

        /* Le contexte d'une mise en situation se lit avant la question, et
           dans un bloc distinct : ce n'est pas l'énoncé, c'est la scène. */
        if (q.contexte) {
          var ctxBoite = TZ.el('div', 'tz-situation');
          ctxBoite.appendChild(TZ.el('span', 'tz-etiquette', 'Situation'));
          ctxBoite.appendChild(TZ.el('p', null, q.contexte));
          scene.appendChild(ctxBoite);
        }

        UI.consigne(scene, q.enonce);
        if (q.sousTitre) {
          scene.appendChild(TZ.el('p', 'tz-indice', q.sousTitre));
        }

        ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'question');
        ctx.bandeau.info('justes', this.justes, 'justes');

        var depart = performance.now();
        var repondu = false;

        /* Fin de question, qu'on ait répondu ou laissé filer le chrono. */
        function conclure(juste, noeuds) {
          repondu = true;
          if (self.chrono) self.chrono.arreter();
          tzFiger(noeuds);
          if (!juste) {
            tzRevelerJuste(noeuds);
            self.rates.push(q);
            TZ.son.faux();
          } else {
            self.justes++;
            TZ.son.juste();
          }
          if (q.cle && TZ.fdo) TZ.fdo.noter(q.cle, juste);
          tzExpliquer(scene, q);

          /* Une bonne réponse n'a rien à relire : on enchaîne. Une erreur,
             si — et c'est précisément là qu'on apprend. L'explication
             défilait au bout de trois secondes, ce qui suffit rarement à
             lire trois lignes de droit : on rend la main au lecteur, qui
             passe quand il a fini. Entrée fonctionne aussi, pour ceux qui
             enchaînent vite. */
          if (juste) {
            TZ.apres(900, function () { self.suivant(); });
            return;
          }

          var passe = false;
          function passer() {
            if (passe) return;
            passe = true;
            document.removeEventListener('keydown', surTouche);
            self.suivant();
          }
          function surTouche(ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); passer(); }
          }
          document.addEventListener('keydown', surTouche);
          self.liberer = function () { document.removeEventListener('keydown', surTouche); };

          UI.actions(scene, [{
            texte: self.essai >= self.ESSAIS ? 'Voir le bilan' : 'Question suivante',
            action: passer
          }]);
        }

        var noeuds = tzReponses(scene, q.options, function (o, b, tous) {
          if (repondu) return;
          self.temps.push(performance.now() - depart);
          b.classList.add(o.juste ? 'tz-juste' : 'tz-faux');
          conclure(!!o.juste, tous);
        });

        this.chrono = TZ.chrono(this.r.limite,
          function (f) { ctx.bandeau.jauge(f); },
          function () {
            if (repondu) return;
            TZ.distracteur(scene);
            conclure(false, noeuds);
          });
      },

      update: function () {},
      end: function () {
        if (this.chrono) this.chrono.arreter();
        /* L'écouteur clavier du bouton « Question suivante » survivrait à
           l'épreuve et volerait la touche Entrée au reste de la page. */
        if (this.liberer) { this.liberer(); this.liberer = null; }
      },

      getScore: function () {
        var faits = Math.max(1, this.essai);
        var moy = this.temps.length
          ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;

        var details = {
          'Justes': this.justes + ' / ' + faits,
          'Temps moyen': moy ? (moy / 1000).toFixed(1) + ' s' : '—'
        };

        /* Ce qui reste à revoir, par thème : plus utile qu'une liste de
           questions ratées, parce que ça dit quoi relire. */
        if (this.rates.length && spec.libelleRate) {
          var vus = {}, noms = [];
          this.rates.forEach(function (q) {
            var t = spec.libelleRate(q);
            if (!t || vus[t]) return;
            vus[t] = 1; noms.push(t);
          });
          if (noms.length) details['À revoir'] = noms.slice(0, 4).join(', ');
        }

        return {
          precision: this.justes / faits,
          vitesse: TZ.borne((this.r.limite - moy) / Math.max(1, this.r.limite * 0.7), 0, 1),
          difficulte: spec.difficulte == null ? 0.65 : spec.difficulte,
          details: details,
          /* Les questions ratées, en entier : le bilan les réaffiche et
             permet de les rejouer. Un score ne dit pas ce qu'on a manqué. */
          erreurs: this.rates.slice(),
          themeDe: spec.libelleRate || null
        };
      }
    };
  }

  TZ.quizz = {
    creer: tzCreer,
    reponses: tzReponses,
    figer: tzFiger,
    revelerJuste: tzRevelerJuste,
    expliquer: tzExpliquer
  };

})(window);
