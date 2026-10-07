/* =============================================================================
   Zone d'entraînement — épreuves de révision des grades de gendarmerie.

   Même contrat que les autres épreuves : init, start, update, end, getScore.
   Les données viennent de grades.js, qui reste la seule source.

   Deux épreuves, parce que ce sont deux savoirs distincts :
     — « Lire un insigne » : voir l'insigne de poitrine et nommer le grade ;
     — « Appellations »  : savoir comment on s'adresse à ce grade, donc
       savoir quand on dit « mon » et quand on ne le dit pas.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  var TOUS = ['rang', 'sousoff', 'subalterne', 'superieur', 'general'];

  /* Panneau de réponses : quatre propositions en grille. Les boutons sont
     larges — on teste une connaissance, pas la précision du curseur. */
  function tzReponses(scene, options, surChoix) {
    var grille = TZ.el('div', 'tz-reponses');
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

  /* « Mon général » privé de son « mon » donne « général » : il faut
     relever la capitale, sinon la proposition a l’air d’une coquille. */
  function tzSansMon(appellation) {
    var t = appellation.replace(/^Mon /, '');
    return t === appellation ? t : t.charAt(0).toUpperCase() + t.slice(1);
  }

  function tzFiger(noeuds) {
    noeuds.forEach(function (n) { n.bouton.disabled = true; });
  }

  function tzRevelation(noeuds, estJuste) {
    noeuds.forEach(function (n) {
      if (n.option.juste) n.bouton.classList.add('tz-juste');
    });
    return estJuste;
  }

  /* Tire des distracteurs : « proches » les prend dans le même groupe
     hiérarchique, ce qui rend la question nettement plus dure. */
  function tzDistracteurs(bon, bassin, nb, proches) {
    var pool = bassin.filter(function (g) { return g.id !== bon.id; });
    if (proches) {
      var memeGroupe = pool.filter(function (g) { return g.groupe === bon.groupe; });
      if (memeGroupe.length >= nb) pool = memeGroupe;
    }
    return TZ.melanger(pool).slice(0, nb);
  }

  /* ================================================== 11. Lire un insigne */
  TZ.epreuves.push({
    id: 'galons',
    nom: 'Lire un insigne',
    categorie: 'gendarmerie',
    axe: 'connaissances',
    but: 'Reconnaître un grade de gendarmerie à son insigne de poitrine.',
    comment: 'Un insigne de poitrine s’affiche. Nommez le grade. Les insignes dessinés sont ceux de la gendarmerie départementale.',

    tuto: {
      regle: 'L’insigne de poitrine — le carré porté sur le polo et le gilet — s’affiche. Choisissez le grade qui lui correspond. Trois repères suffisent à s’y retrouver : la FIGURE, le NOMBRE, la COULEUR.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'gnd', 'Chevrons', 'Jusqu’au maréchal des logis-chef'],
         ['oui', 'cne', 'Barres droites', 'À partir de l’adjudant, et tous les officiers'],
         ['oui', 'gbr', 'Étoiles', 'Officiers généraux, à partir de deux']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.appendChild(TZ.grades.galon(TZ.grades.parId(c[1]), 70));
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[2]));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'La couleur tranche les cas voisins : l’adjudant porte une barre OR, ' +
          'l’adjudant-chef la même barre en ARGENT. Même figure, même nombre, ' +
          'grade différent.'));
        hote.appendChild(TZ.el('p', null,
          'En gendarmerie mobile et à la garde républicaine, les mêmes figures ' +
          'sont en or. Ici, tout est en gendarmerie départementale.'));
      },
      pourquoi: 'Identifier un grade d’un coup d’œil, c’est savoir à qui on parle et dans quel ordre. C’est la première chose qu’on attend d’un candidat, et ça se révise.'
    },

    reglages: {
      decouverte: { groupes: ['sousoff'],                           essais: 10, proches: false, limite: 14000 },
      standard:   { groupes: ['rang', 'sousoff', 'subalterne'],     essais: 14, proches: false, limite: 11000 },
      confirme:   { groupes: TOUS,                                  essais: 16, proches: true,  limite: 9000 },
      expert:     { groupes: TOUS,                                  essais: 20, proches: true,  limite: 6500 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.bassin = TZ.grades.duGroupe(this.r.groupes);
      /* Deux grades ne portent aucune figure : l’élève-gendarme et le gendarme
         adjoint de 2e classe. Montrer un carré vide et demander lequel des
         deux c’est n’aurait pas de réponse. Ils restent proposés comme
         distracteurs, mais ne sont jamais la bonne réponse. */
      this.aDeviner = this.bassin.filter(function (g) {
        return g.galon && g.galon.figure !== 'aucune';
      });
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.justes = 0;
      this.temps = [];
      this.rates = [];
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.suivant(); });
    },

    suivant: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      this.essai++;
      if (this.essai > this.ESSAIS) { ctx.terminer(); return; }

      var bon = this.aDeviner[TZ.hasard(this.aDeviner.length)];
      this.bon = bon;
      var options = TZ.melanger(
        [{ texte: bon.nom, juste: true, grade: bon }].concat(
          tzDistracteurs(bon, this.bassin, 3, this.r.proches).map(function (g) {
            return { texte: g.nom, juste: false, grade: g };
          })));

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Quel grade porte cet insigne ?');

      var boite = TZ.el('div', 'tz-galon-scene');
      boite.appendChild(TZ.grades.galon(bon, 150));
      scene.appendChild(boite);

      ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'essai');
      ctx.bandeau.info('justes', this.justes, 'justes');

      var depart = performance.now();
      var repondu = false;

      var noeuds = tzReponses(scene, options, function (o, b, tous) {
        if (repondu) return;
        repondu = true;
        self.chrono.arreter();
        self.temps.push(performance.now() - depart);
        tzFiger(tous);
        if (o.juste) {
          self.justes++;
          b.classList.add('tz-juste');
          TZ.son.juste();
        } else {
          b.classList.add('tz-faux');
          tzRevelation(tous, false);
          self.rates.push(bon.nom);
          TZ.son.faux();
        }
        self.expliquer(scene, bon);
        TZ.apres(o.juste ? 900 : 2100, function () { self.suivant(); });
      });

      this.chrono = TZ.chrono(this.r.limite,
        function (f) { ctx.bandeau.jauge(f); },
        function () {
          if (repondu) return;
          repondu = true;
          tzFiger(noeuds);
          tzRevelation(noeuds, false);
          self.rates.push(bon.nom);
          TZ.son.faux();
          self.expliquer(scene, bon);
          TZ.apres(2100, function () { self.suivant(); });
        });
    },

    expliquer: function (scene, grade) {
      var p = TZ.el('p', 'tz-indice',
        grade.nom + ' — ' + TZ.grades.decrire(grade) +
        (grade.note ? '. ' + grade.note : '.'));
      scene.appendChild(p);
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var faits = Math.max(1, this.essai - 1);
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      var details = {
        'Justes': this.justes + ' / ' + faits,
        'Temps moyen': moy ? (moy / 1000).toFixed(1) + ' s' : '—'
      };
      if (this.rates.length) {
        var uniques = this.rates.filter(function (v, i, a) { return a.indexOf(v) === i; });
        details['À revoir'] = uniques.slice(0, 4).join(', ');
      }
      return {
        precision: this.justes / faits,
        vitesse: TZ.borne((7000 - moy) / 5000, 0, 1),
        difficulte: 0.65,
        details: details
      };
    }
  });

  /* ==================================================== 12. Appellations */
  TZ.epreuves.push({
    id: 'appellations',
    nom: 'Appellations',
    categorie: 'gendarmerie',
    axe: 'connaissances',
    but: 'Savoir comment on s’adresse à chaque grade — et quand on dit « mon ».',
    comment: 'Un grade s’affiche. Choisissez l’appellation réglementaire. Attention au « mon » : il ne se met pas partout.',

    tuto: {
      regle: 'Un grade s’affiche. Dites comment un subordonné s’adresse à lui. Le « mon » n’est pas un possessif : c’est l’abréviation de « monsieur », et il ne se met que devant certains grades.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'adj', 'Mon adjudant', 'Adjudant et adjudant-chef prennent « mon »'],
         ['non', 'maj', 'Mon major', 'Faux : on dit simplement « major »']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.style.flexDirection = 'column';
          var g = TZ.el('div', null, TZ.grades.parId(c[1]).nom);
          g.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1rem';
          var r = TZ.el('div', null, '→ ' + c[2]);
          r.style.cssText = 'font-size:.86rem;font-weight:700;margin-top:4px';
          v.appendChild(g); v.appendChild(r);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[0] === 'oui' ? 'Correct' : 'Erreur'));
          b.appendChild(TZ.el('em', null, c[3]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);

        var regles = TZ.el('ul', 'tz-regles');
        [ 'Chez les sous-officiers, seuls l’adjudant et l’adjudant-chef prennent « mon ». Pas le major, pas le maréchal des logis-chef, pas le gendarme.',
          'Tous les officiers le prennent, du lieutenant au général.',
          'L’appellation ne suit pas toujours le nom du grade : un sous-lieutenant est « mon lieutenant », un chef d’escadron « mon commandant », un lieutenant-colonel « mon colonel ».',
          'Devant une femme, le « mon » tombe : on dit « colonel », « général ».',
          'Un civil ne dit pas « mon » non plus, et un supérieur ne le dit pas à son subordonné.'
        ].forEach(function (t) { regles.appendChild(TZ.el('li', null, t)); });
        hote.appendChild(regles);
      },
      pourquoi: 'C’est une question d’examen et de tenue : se tromper d’appellation s’entend tout de suite. La règle tient en quelques lignes, mais elle a assez d’exceptions pour qu’il faille l’avoir revue.'
    },

    reglages: {
      decouverte: { groupes: ['sousoff'],                        essais: 10, femmes: false, limite: 13000 },
      standard:   { groupes: ['sousoff', 'subalterne'],          essais: 14, femmes: false, limite: 10000 },
      confirme:   { groupes: TOUS,                               essais: 16, femmes: true,  limite: 9000 },
      expert:     { groupes: TOUS,                               essais: 20, femmes: true,  limite: 6500 }
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      /* un élève-gendarme s'appelle par son nom : pas d'appellation à deviner */
      this.bassin = TZ.grades.duGroupe(this.r.groupes).filter(function (g) {
        return g.id !== 'elg';
      });
      this.ESSAIS = this.r.essais;
      this.essai = 0;
      this.justes = 0;
      this.temps = [];
      this.rates = [];
    },

    start: function () {
      var self = this;
      UI.depart(this.ctx.scene, function () { self.suivant(); });
    },

    /* L'appellation au féminin, c'est la même sans le « mon ». */
    attendu: function (grade, femme) {
      if (!femme || !grade.mon) return grade.appellation;
      return tzSansMon(grade.appellation);
    },

    suivant: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      this.essai++;
      if (this.essai > this.ESSAIS) { ctx.terminer(); return; }

      var bon = this.bassin[TZ.hasard(this.bassin.length)];
      var femme = this.r.femmes && TZ.hasard(3) === 0;
      var reponse = this.attendu(bon, femme);

      /* Propositions : la bonne, son piège (« mon » ajouté ou retiré), et
         deux appellations voisines. Le piège est le cœur de l'épreuve. */
      var piege = bon.mon
        ? tzSansMon(bon.appellation)
        : 'Mon ' + bon.appellation.toLowerCase();
      if (femme) piege = bon.appellation;

      /* Trois grades s’appellent « mon lieutenant », quatre « mon général » :
         on déduplique sur le texte, sinon deux propositions identiques
         pourraient apparaître, dont une marquée fausse. */
      var vus = {};
      var textes = [];
      [reponse, piege].forEach(function (t) {
        if (vus[t]) return;
        vus[t] = 1; textes.push(t);
      });
      tzDistracteurs(bon, this.bassin, this.bassin.length, false)
        .forEach(function (g) {
          if (textes.length >= 4 || vus[g.appellation]) return;
          vus[g.appellation] = 1; textes.push(g.appellation);
        });

      var options = TZ.melanger(textes.map(function (t) {
        return { texte: t, juste: t === reponse };
      }));

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, femme
        ? 'Elle est ' + bon.nom.toLowerCase() + '. Comment vous adressez-vous à elle ?'
        : 'Comment vous adressez-vous à un ' + bon.nom.toLowerCase() + ' ?');

      var boite = TZ.el('div', 'tz-galon-scene');
      boite.appendChild(TZ.grades.galon(bon, 72));
      var nom = TZ.el('div', 'tz-galon-nom', bon.nom);
      boite.appendChild(nom);
      scene.appendChild(boite);

      ctx.bandeau.info('essai', this.essai + ' / ' + this.ESSAIS, 'essai');
      ctx.bandeau.info('justes', this.justes, 'justes');

      var depart = performance.now();
      var repondu = false;

      var noeuds = tzReponses(scene, options, function (o, b, tous) {
        if (repondu) return;
        repondu = true;
        self.chrono.arreter();
        self.temps.push(performance.now() - depart);
        tzFiger(tous);
        if (o.juste) {
          self.justes++;
          b.classList.add('tz-juste');
          TZ.son.juste();
        } else {
          b.classList.add('tz-faux');
          tzRevelation(tous, false);
          self.rates.push(bon.nom);
          TZ.son.faux();
        }
        self.expliquer(scene, bon, femme);
        TZ.apres(o.juste ? 900 : 2300, function () { self.suivant(); });
      });

      this.chrono = TZ.chrono(this.r.limite,
        function (f) { ctx.bandeau.jauge(f); },
        function () {
          if (repondu) return;
          repondu = true;
          tzFiger(noeuds);
          tzRevelation(noeuds, false);
          self.rates.push(bon.nom);
          TZ.son.faux();
          self.expliquer(scene, bon, femme);
          TZ.apres(2300, function () { self.suivant(); });
        });
    },

    expliquer: function (scene, grade, femme) {
      var t;
      if (femme) {
        t = 'Devant une femme, le « mon » tombe : ' + this.attendu(grade, true) + '.';
      } else if (grade.mon) {
        t = grade.appellation + '. ' + (grade.note || 'Ce grade prend « mon ».');
      } else {
        t = grade.appellation + ' — sans « mon ». ' + (grade.note || '');
      }
      scene.appendChild(TZ.el('p', 'tz-indice', t.trim()));
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var faits = Math.max(1, this.essai - 1);
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      var details = {
        'Justes': this.justes + ' / ' + faits,
        'Temps moyen': moy ? (moy / 1000).toFixed(1) + ' s' : '—'
      };
      if (this.rates.length) {
        var uniques = this.rates.filter(function (v, i, a) { return a.indexOf(v) === i; });
        details['À revoir'] = uniques.slice(0, 4).join(', ');
      }
      return {
        precision: this.justes / faits,
        vitesse: TZ.borne((7000 - moy) / 5000, 0, 1),
        difficulte: 0.65,
        details: details
      };
    }
  });

})(window);
