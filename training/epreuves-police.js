/* =============================================================================
   Zone d'entraînement — épreuves de hiérarchie.

     — « Grades de la police » : corps, catégorie et appellation. Réservée au
       parcours police, parce que poser la hiérarchie policière à un candidat
       gendarme ne lui apprendrait rien d'utile.
     — « Classer la hiérarchie » : ranger des grades du plus bas au plus haut.
       Celle-là sert aux DEUX forces : elle lit la liste de la force choisie.

   Sur le classement, un point de méthode. Deux grades de même niveau OTAN
   n'ont pas d'ordre à deviner : demander si le sous-lieutenant précède le
   lieutenant, ou l'adjudant-chef le major, serait une question sans réponse.
   Les listes ci-dessous ne retiennent donc que des grades STRICTEMENT
   ordonnés — les ex aequo sont écartés du tirage, et le mémento reste là
   pour les apprendre.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ, UI = TZ.ui;

  /* =========================================== 16. Grades de la police nationale
     Trois formes de question tirées des mêmes données : à quel corps
     appartient ce grade, comment on s'adresse à lui, et lequel est au-dessus
     de l'autre. C'est la même connaissance regardée sous trois angles, et
     c'est ce qui la fixe. */

  function tzQuestionPolice(niveau) {
    var P = TZ.gradesPolice;
    var ordonnes = P.ordonnes();
    /* Au premier palier on reste sur le corps d'encadrement et d'application
       et le corps de commandement : c'est ce qu'un élève côtoie. */
    var bassin = niveau === 'decouverte'
      ? P.duCorps(['adjoint', 'cea', 'commandement'])
      : ordonnes;

    var g = bassin[TZ.hasard(bassin.length)];
    var forme = TZ.hasard(niveau === 'decouverte' ? 2 : 3);

    /* --- à quel corps ce grade appartient-il ? --- */
    if (forme === 0) {
      var bonCorps = P.leCorps(g.corps);
      var autres = TZ.melanger(P.corps.filter(function (c) {
        return c.id !== g.corps;
      })).slice(0, 3);
      return {
        cle: 'pn-corps-' + g.id,
        enonce: 'À quel corps appartient le grade de ' + g.nom.toLowerCase() + ' ?',
        options: TZ.melanger([{ texte: bonCorps.nom, juste: true }].concat(
          autres.map(function (c) { return { texte: c.nom, juste: false }; }))),
        explication: g.nom + ' — ' + bonCorps.nom + ', ' + bonCorps.categorie.toLowerCase()
                   + '. ' + bonCorps.note,
        source: 'arrêté du 6 juin 2006 portant règlement général d’emploi de la police nationale',
        theme: 'Corps de la police nationale'
      };
    }

    /* --- comment s'adresse-t-on à lui ? --- */
    if (forme === 1) {
      /* Le piège est toujours le même, et c'est le bon : la version avec
         « mon », qui n'existe pas dans la police. */
      var piege = 'Mon ' + g.nom.split(' ')[0].toLowerCase();
      var textes = [g.appellation, piege];
      TZ.melanger(ordonnes).forEach(function (a) {
        if (textes.length >= 4 || textes.indexOf(a.appellation) >= 0) return;
        textes.push(a.appellation);
      });
      return {
        cle: 'pn-appel-' + g.id,
        enonce: 'Comment s’adresse-t-on à un ' + g.nom.toLowerCase() + ' ?',
        options: TZ.melanger(textes.slice(0, 4).map(function (t) {
          return { texte: t, juste: t === g.appellation };
        })),
        explication: g.appellation + '. La police nationale est un corps civil : '
                   + 'le « mon » n’y est jamais employé — il s’adresse à un militaire, '
                   + 'donc à un gendarme.' + (g.note ? ' ' + g.note : ''),
        source: 'usage réglementaire ; arrêté du 6 juin 2006 portant règlement général d’emploi de la police nationale',
        theme: 'Appellations de la police nationale'
      };
    }

    /* --- lequel est au-dessus ? --- */
    var autresG = TZ.melanger(ordonnes.filter(function (a) {
      return a.rang !== g.rang;
    })).slice(0, 3);
    var lot = [g].concat(autresG);
    var plusHaut = lot.slice().sort(function (a, b) { return b.rang - a.rang; })[0];
    return {
      cle: 'pn-rang-' + plusHaut.id,
      enonce: 'Parmi ces grades, lequel est le plus élevé ?',
      options: TZ.melanger(lot.map(function (a) {
        return { texte: a.nom, juste: a.id === plusHaut.id };
      })),
      explication: plusHaut.nom + ' — ' + P.leCorps(plusHaut.corps).nom + '. '
                 + 'L’ordre va du corps d’encadrement et d’application au corps de '
                 + 'commandement, puis au corps de conception et de direction.',
      source: 'arrêté du 6 juin 2006 portant règlement général d’emploi de la police nationale',
      theme: 'Hiérarchie de la police nationale'
    };
  }

  TZ.epreuves.push(TZ.quizz.creer({
    id: 'grades-police',
    nom: 'Grades de la police',
    categorie: 'hierarchie',
    axe: 'connaissances',
    force: 'pn',
    but: 'Corps, catégorie et appellation de chaque grade de la police nationale.',
    comment: 'Un grade s’affiche. Dites à quel corps il appartient, comment on s’adresse à lui, ou lequel est au-dessus.',
    etiquettes: TZ.fdo.etiquettes(),

    tuto: {
      regle: 'Trois formes de question, tirées au hasard : le corps d’appartenance, '
           + 'l’appellation, et la comparaison de deux grades. Retenez les trois corps '
           + 'dans l’ordre — encadrement et application, commandement, conception et '
           + 'direction — le reste s’en déduit.',
      exemple: function (hote) {
        var P = TZ.gradesPolice;
        var ex = TZ.el('div', 'tz-exemple');
        [['oui', 'Capitaine', 'On dit « capitaine »'],
         ['non', 'Mon capitaine', 'Faux : la police est un corps civil']]
        .forEach(function (c) {
          var b = TZ.el('div', 'tz-cas tz-' + c[0]);
          var v = TZ.el('div', 'tz-vignette');
          v.style.flexDirection = 'column';
          var g = TZ.el('div', null, '« ' + c[1] + ' »');
          g.style.cssText = 'font-family:var(--tz-titre);font-weight:700;font-size:1rem';
          v.appendChild(g);
          b.appendChild(v);
          b.appendChild(TZ.el('b', null, c[0] === 'oui' ? 'Correct' : 'Erreur'));
          b.appendChild(TZ.el('em', null, c[2]));
          ex.appendChild(b);
        });
        hote.appendChild(ex);

        var ul = TZ.el('ul', 'tz-regles');
        [ 'Corps d’encadrement et d’application, catégorie B : gardien de la paix, '
          + 'brigadier, brigadier-chef, major.',
          'Corps de commandement, catégorie A : lieutenant, capitaine, commandant.',
          'Corps de conception et de direction, catégorie A+ : commissaire, '
          + 'commissaire divisionnaire, commissaire général.',
          'Aucune appellation ne prend « mon ». Les commissaires prennent '
          + '« monsieur » ou « madame le ».'
        ].forEach(function (t) { ul.appendChild(TZ.el('li', null, t)); });
        hote.appendChild(ul);
        hote.appendChild(TZ.el('p', 'tz-vide',
          'Les insignes de grade ne sont pas représentés : les sources consultables '
          + 'les décrivent par leur tissage et se contredisent. Le mémento le dit aussi.'));
      },
      pourquoi: 'Savoir à qui on parle et dans quel ordre, c’est la première chose '
              + 'qu’on attend en arrivant dans un service. Et l’appellation est ce qui '
              + 's’entend le plus vite quand elle est fausse.'
    },

    reglages: {
      decouverte: { essais: 12, limite: 18000 },
      standard:   { essais: 14, limite: 15000 },
      confirme:   { essais: 16, limite: 12000 },
      expert:     { essais: 20, limite: 9000 }
    },

    tirage: function (niveau, nb) {
      var sortie = [], vus = {}, tentatives = 0;
      /* On tire au hasard, mais sans reposer deux fois la même question :
         d'où la clé, et une garde pour ne pas boucler si le bassin est petit. */
      while (sortie.length < nb && tentatives < nb * 25) {
        tentatives++;
        var q = tzQuestionPolice(niveau);
        if (vus[q.cle]) continue;
        vus[q.cle] = 1;
        sortie.push(q);
      }
      return sortie;
    },
    libelleRate: function (q) { return q.theme; },
    difficulte: 0.6
  }));

  /* ====================================================== 17. Classer la hiérarchie
     Épreuve propre, et non un QCM : on clique les grades du plus bas au plus
     haut. Ranger n'est pas reconnaître — c'est ce qui manquait aux deux
     épreuves de grades existantes. */

  /* Grades strictement ordonnés, par force. Les ex aequo sont écartés :
     sous-lieutenant et lieutenant sont tous deux OF-1, adjudant-chef et major
     tous deux OR-9, aspirant et sous-lieutenant indiscernables en rang. */
  var ORDONNABLES = {
    gn: ['ga2', 'ga1', 'bri', 'brc', 'gnd', 'mdc', 'adj', 'maj',
         'ltn', 'cne', 'cen', 'lcl', 'col', 'gbr', 'gdi', 'gca', 'gar'],
    pn: ['pa', 'egp', 'gpx', 'bri', 'brc', 'maj', 'ltn', 'cne', 'cdt',
         'cp', 'cdv', 'cg']
  };

  TZ.epreuves.push({
    id: 'classement',
    nom: 'Classer la hiérarchie',
    categorie: 'hierarchie',
    axe: 'connaissances',
    force: 'commun',
    but: 'Ranger les grades de sa force du plus bas au plus haut.',
    comment: 'Des grades s’affichent en désordre. Cliquez-les du plus bas au plus haut.',
    etiquettes: TZ.fdo.etiquettes(),

    tuto: {
      regle: 'Des grades apparaissent en désordre. Cliquez le plus bas, puis le suivant, '
           + 'jusqu’au plus haut. Une erreur est signalée et comptée, mais la manche '
           + 'continue : il faut trouver le bon.',
      exemple: function (hote) {
        var ex = TZ.el('div', 'tz-exemple');
        var b = TZ.el('div', 'tz-cas tz-oui');
        var v = TZ.el('div', 'tz-vignette');
        v.style.flexDirection = 'column';
        v.style.gap = '4px';
        ['1 · Gendarme', '2 · Maréchal des logis-chef', '3 · Adjudant', '4 · Major']
          .forEach(function (t) {
            var l = TZ.el('div', null, t);
            l.style.cssText = 'font-weight:700;font-size:.9rem';
            v.appendChild(l);
          });
        b.appendChild(v);
        b.appendChild(TZ.el('b', null, 'Du plus bas au plus haut'));
        b.appendChild(TZ.el('em', null, 'L’ordre d’apparition, lui, est tiré au hasard'));
        ex.appendChild(b);
        hote.appendChild(ex);
        hote.appendChild(TZ.el('p', null,
          'Les grades de même niveau ne sont jamais proposés ensemble : il n’y aurait '
          + 'pas de réponse. Sous-lieutenant et lieutenant sont tous deux OF-1, '
          + 'adjudant-chef et major tous deux OR-9 — on les apprend au mémento, pas ici.'));
      },
      pourquoi: 'Reconnaître un grade ne dit pas qui commande. En intervention conjointe, '
              + 'c’est l’ordre qui compte : qui donne l’ordre, qui rend compte à qui.'
    },

    reglages: {
      decouverte: { cartes: 4, manches: 5, limite: 30000 },
      standard:   { cartes: 5, manches: 6, limite: 28000 },
      confirme:   { cartes: 6, manches: 6, limite: 24000 },
      expert:     { cartes: 7, manches: 7, limite: 20000 }
    },

    /* Les grades de la force choisie, avec un rang exploitable. On passe par
       l'index dans la liste de référence : c'est lui qui porte l'ordre. */
    bassinDeLaForce: function () {
      var force = TZ.fdo.force() || 'gn';
      if (force === 'pn' && TZ.gradesPolice) {
        return ORDONNABLES.pn.map(function (id) {
          var g = TZ.gradesPolice.parId(id);
          return g ? { id: g.id, nom: g.nom, rang: g.rang } : null;
        }).filter(Boolean);
      }
      if (!TZ.grades) return [];
      var liste = TZ.grades.liste;
      var index = {};
      liste.forEach(function (g, i) { index[g.id] = i; });
      return ORDONNABLES.gn.map(function (id) {
        var g = TZ.grades.parId(id);
        return g ? { id: g.id, nom: g.nom, rang: index[g.id] } : null;
      }).filter(Boolean);
    },

    init: function (ctx) {
      this.ctx = ctx;
      this.r = this.reglages[ctx.niveau] || this.reglages.standard;
      this.bassin = this.bassinDeLaForce();
      this.manche = 0;
      this.places = 0;      /* cartes posées au bon moment */
      this.attendues = 0;   /* cartes à poser en tout */
      this.erreurs = 0;
      this.temps = [];
      this.ratees = [];
    },

    start: function () {
      var self = this;
      if (this.bassin.length < this.r.cartes) {
        UI.message(this.ctx.scene, 'Grades indisponibles pour cette force.', 'ko');
        TZ.apres(1400, function () { self.ctx.terminer(); });
        return;
      }
      UI.depart(this.ctx.scene, function () { self.suivante(); }, { sansChiffres: true });
    },

    suivante: function () {
      var self = this, ctx = this.ctx;
      if (this.chrono) this.chrono.arreter();
      this.manche++;
      if (this.manche > this.r.manches) { ctx.terminer(); return; }

      /* Une fenêtre contiguë de la hiérarchie, plutôt que des grades tirés au
         hasard dans toute l'échelle : classer « gendarme, colonel, général »
         est trivial, classer quatre grades voisins ne l'est pas. */
      var debut = TZ.hasard(this.bassin.length - this.r.cartes + 1);
      var lot = this.bassin.slice(debut, debut + this.r.cartes);
      var ordre = lot.slice().sort(function (a, b) { return a.rang - b.rang; });
      this.attendues += ordre.length;

      var scene = TZ.vide(ctx.scene);
      UI.consigne(scene, 'Cliquez ces grades du plus bas au plus haut.');

      ctx.bandeau.info('manche', this.manche + ' / ' + this.r.manches, 'manche');
      ctx.bandeau.info('erreurs', this.erreurs, 'erreurs');

      var grille = TZ.el('div', 'tz-classement');
      var attendu = 0;
      var fini = false;
      var depart = performance.now();
      var cartes = TZ.melanger(lot).map(function (g) {
        var b = TZ.el('button', 'tz-carte-grade');
        b.type = 'button';
        b.appendChild(TZ.el('span', 'tz-carte-ordre', ''));
        b.appendChild(TZ.el('b', null, g.nom));
        b.addEventListener('click', function () {
          if (fini || b.disabled) return;
          if (g.id === ordre[attendu].id) {
            attendu++;
            b.disabled = true;
            b.classList.add('tz-juste');
            b.firstChild.textContent = String(attendu);
            self.places++;
            TZ.son.juste();
            if (attendu >= ordre.length) {
              fini = true;
              self.temps.push(performance.now() - depart);
              if (self.chrono) self.chrono.arreter();
              TZ.apres(700, function () { self.suivante(); });
            }
          } else {
            self.erreurs++;
            self.ratees.push(ordre[attendu].nom);
            b.classList.add('tz-faux');
            TZ.apres(420, function () { b.classList.remove('tz-faux'); });
            TZ.distracteur(scene);
            TZ.son.faux();
            ctx.bandeau.info('erreurs', self.erreurs, 'erreurs');
          }
        });
        grille.appendChild(b);
        return b;
      });
      scene.appendChild(grille);

      this.chrono = TZ.chrono(this.r.limite,
        function (f) { ctx.bandeau.jauge(f); },
        function () {
          if (fini) return;
          fini = true;
          /* Temps écoulé : on révèle l'ordre restant, puis on enchaîne. */
          cartes.forEach(function (b) { b.disabled = true; });
          ordre.slice(attendu).forEach(function (g) {
            self.ratees.push(g.nom);
          });
          UI.message(scene, 'Temps écoulé — ordre attendu : '
            + ordre.map(function (g) { return g.nom; }).join(' → '), 'ko');
          TZ.son.faux();
          TZ.apres(3400, function () { self.suivante(); });
        });
    },

    update: function () {},
    end: function () { if (this.chrono) this.chrono.arreter(); },

    getScore: function () {
      var attendues = Math.max(1, this.attendues);
      var moy = this.temps.length
        ? this.temps.reduce(function (a, b) { return a + b; }, 0) / this.temps.length : 0;
      var details = {
        'Placés': this.places + ' / ' + attendues,
        'Erreurs': this.erreurs
      };
      if (moy) details['Temps par manche'] = (moy / 1000).toFixed(1) + ' s';
      if (this.ratees.length) {
        var uniques = this.ratees.filter(function (v, i, a) { return a.indexOf(v) === i; });
        details['À revoir'] = uniques.slice(0, 3).join(', ');
      }
      return {
        precision: this.places / attendues,
        vitesse: moy ? TZ.borne((this.r.limite - moy) / Math.max(1, this.r.limite * 0.7), 0, 1) : 0,
        difficulte: 0.65,
        details: details
      };
    }
  });

})(window);
