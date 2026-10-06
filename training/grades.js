/* =============================================================================
   Zone d'entraînement — grades de la gendarmerie nationale.

   Ce fichier ne contient que des données et un dessin : la hiérarchie des
   grades, l'appellation réglementaire de chacun, et un galon schématique.
   Les épreuves qui s'en servent vivent dans epreuves-grades.js.

   SOURCE. Les appellations proviennent de la colonne « Appellation » des
   tableaux de l'article « Grades de la Gendarmerie nationale française » de
   Wikipédia. Les galons ont été relevés directement sur les planches
   d'insignes du même article (Gav_*.svg, Gend_*.svg, Adj_gd.svg, Adc_gd.svg,
   Major_gd.svg, Slt_gd.svg … Col_gd.svg), couleurs lues dans le code SVG
   plutôt qu'estimées à l'œil.

   PÉRIMÈTRE. Les galons représentés sont ceux de la GENDARMERIE
   DÉPARTEMENTALE, dont la couleur dominante est l'argent. La gendarmerie
   mobile et la garde républicaine portent les mêmes figures en OR : c'est la
   couleur qui change, ni le nombre ni la forme.

   Le dessin est un schéma de révision, pas une reproduction réglementaire :
   il retient ce qui se demande à un examen — la figure (chevron, barre,
   étoile), le nombre et la couleur.
   ============================================================================= */
(function (global) {
  'use strict';

  var TZ = global.TZ;

  /* --------------------------------------------------------------- couleurs */
  var TEINTES = {
    argent: '#E6ECF5',
    or:     '#F0C421',
    bleu:   '#3A49DC',   /* chevrons des gendarmes adjoints volontaires */
    rouge:  '#B2380C'
  };

  /* ----------------------------------------------------------------- groupes */
  var GROUPES = [
    { id: 'rang',       nom: 'Militaires du rang',
      note: 'Gendarmes adjoints volontaires. Chevrons bleus.' },
    { id: 'sousoff',    nom: 'Sous-officiers de gendarmerie',
      note: 'Chevrons argent jusqu’au maréchal des logis-chef, barres droites à partir de l’adjudant.' },
    { id: 'subalterne', nom: 'Officiers subalternes',
      note: 'Barres droites. Le nombre suit le grade.' },
    { id: 'superieur',  nom: 'Officiers supérieurs',
      note: 'Barres droites, jusqu’à cinq.' },
    { id: 'general',    nom: 'Officiers généraux',
      note: 'Plus de barres : des étoiles. On commence à deux.' }
  ];

  /* ------------------------------------------------------------------ grades
     galon : { figure: 'aucune' | 'chevron' | 'barre' | 'etoile',
               nb, teinte, opposees (barres d'une autre couleur), lisere }  */
  var GRADES = [
    /* ---------------------------------------------- militaires du rang (GAV) */
    { id: 'ga2', nom: 'Gendarme adjoint de 2e classe', abrev: 'GA2', otan: 'OR-1',
      groupe: 'rang', appellation: 'Seconde classe', mon: false,
      galon: { figure: 'aucune' },
      note: 'Aucun galon : c’est le seul grade qui n’en porte pas.' },

    { id: 'ga1', nom: 'Gendarme adjoint de 1re classe', abrev: 'GA1', otan: 'OR-2',
      groupe: 'rang', appellation: 'Première classe', mon: false,
      galon: { figure: 'chevron', nb: 1, teinte: 'bleu' } },

    { id: 'bri', nom: 'Brigadier', abrev: 'BRI', otan: 'OR-3',
      groupe: 'rang', appellation: 'Brigadier', mon: false,
      galon: { figure: 'chevron', nb: 2, teinte: 'bleu' } },

    { id: 'brc', nom: 'Brigadier-chef', abrev: 'BRC', otan: 'OR-4',
      groupe: 'rang', appellation: 'Brigadier-chef', mon: false,
      galon: { figure: 'chevron', nb: 3, teinte: 'bleu' } },

    /* --------------------------------------------------------- sous-officiers */
    { id: 'elg', nom: 'Élève-gendarme', abrev: 'ELG', otan: 'OR-4',
      groupe: 'sousoff', appellation: 'Par le nom', mon: false,
      galon: { figure: 'aucune' },
      note: 'On l’appelle par son nom, pas par un grade.' },

    { id: 'gnd', nom: 'Gendarme', abrev: 'GND', otan: 'OR-5',
      groupe: 'sousoff', appellation: 'Gendarme', mon: false,
      galon: { figure: 'chevron', nb: 2, teinte: 'argent' },
      note: 'Deux chevrons de carrière, un seul sous contrat. Les gendarmes adjoints lui disent « chef ».' },

    { id: 'mdc', nom: 'Maréchal des logis-chef', abrev: 'MDC', otan: 'OR-6',
      groupe: 'sousoff', appellation: 'Chef', mon: false,
      galon: { figure: 'chevron', nb: 3, teinte: 'argent' },
      note: 'En principe « maréchal des logis-chef », en pratique « chef ».' },

    { id: 'adj', nom: 'Adjudant', abrev: 'ADJ', otan: 'OR-8',
      groupe: 'sousoff', appellation: 'Mon adjudant', mon: true,
      galon: { figure: 'barre', nb: 1, teinte: 'or', lisere: true },
      note: 'Premier grade à quitter le chevron pour la barre droite. Barre OR, liseré rouge.' },

    { id: 'adc', nom: 'Adjudant-chef', abrev: 'ADC', otan: 'OR-9',
      groupe: 'sousoff', appellation: 'Mon adjudant-chef', mon: true,
      galon: { figure: 'barre', nb: 1, teinte: 'argent', lisere: true },
      note: 'Même barre que l’adjudant, mais ARGENT. La couleur suffit à les séparer.' },

    { id: 'maj', nom: 'Major', abrev: 'MAJ', otan: 'OR-9',
      groupe: 'sousoff', appellation: 'Major', mon: false,
      galon: { figure: 'barre', nb: 2, teinte: 'argent', lisere: true },
      note: 'Le piège : c’est le plus haut sous-officier, et pourtant on ne dit PAS « mon major ».' },

    /* --------------------------------------------------- officiers subalternes */
    { id: 'asp', nom: 'Aspirant', abrev: 'ASP', otan: 'OF(D)',
      groupe: 'subalterne', appellation: 'Mon lieutenant', mon: true,
      galon: { figure: 'barre', nb: 1, teinte: 'or' },
      note: 'Une barre or, là où le sous-lieutenant en porte une argent.' },

    { id: 'slt', nom: 'Sous-lieutenant', abrev: 'SLT', otan: 'OF-1',
      groupe: 'subalterne', appellation: 'Mon lieutenant', mon: true,
      galon: { figure: 'barre', nb: 1, teinte: 'argent' },
      note: 'On ne dit jamais « mon sous-lieutenant » : c’est « mon lieutenant ».' },

    { id: 'ltn', nom: 'Lieutenant', abrev: 'LTN', otan: 'OF-1',
      groupe: 'subalterne', appellation: 'Mon lieutenant', mon: true,
      galon: { figure: 'barre', nb: 2, teinte: 'argent' } },

    { id: 'cne', nom: 'Capitaine', abrev: 'CNE', otan: 'OF-2',
      groupe: 'subalterne', appellation: 'Mon capitaine', mon: true,
      galon: { figure: 'barre', nb: 3, teinte: 'argent' } },

    /* ---------------------------------------------------- officiers supérieurs */
    { id: 'cen', nom: 'Chef d’escadron', abrev: 'CEN', otan: 'OF-3',
      groupe: 'superieur', appellation: 'Mon commandant', mon: true,
      galon: { figure: 'barre', nb: 4, teinte: 'argent' },
      note: 'Le grade s’appelle « chef d’escadron », l’appellation est « mon commandant ».' },

    { id: 'lcl', nom: 'Lieutenant-colonel', abrev: 'LCL', otan: 'OF-4',
      groupe: 'superieur', appellation: 'Mon colonel', mon: true,
      galon: { figure: 'barre', nb: 5, teinte: 'argent', opposees: 2 },
      note: 'Cinq barres dont deux de la couleur opposée. On l’appelle « mon colonel ».' },

    { id: 'col', nom: 'Colonel', abrev: 'COL', otan: 'OF-5',
      groupe: 'superieur', appellation: 'Mon colonel', mon: true,
      galon: { figure: 'barre', nb: 5, teinte: 'argent' },
      note: 'Cinq barres de la même couleur : c’est ce qui le distingue du lieutenant-colonel.' },

    /* ------------------------------------------------------ officiers généraux */
    { id: 'gbr', nom: 'Général de brigade', abrev: 'GBR', otan: 'OF-6',
      groupe: 'general', appellation: 'Mon général', mon: true,
      galon: { figure: 'etoile', nb: 2 },
      note: 'En France, un général commence à deux étoiles.' },

    { id: 'gdi', nom: 'Général de division', abrev: 'GDI', otan: 'OF-7',
      groupe: 'general', appellation: 'Mon général', mon: true,
      galon: { figure: 'etoile', nb: 3 } },

    { id: 'gca', nom: 'Général de corps d’armée', abrev: 'GCA', otan: 'OF-8',
      groupe: 'general', appellation: 'Mon général', mon: true,
      galon: { figure: 'etoile', nb: 4 } },

    { id: 'gar', nom: 'Général d’armée', abrev: 'GAR', otan: 'OF-9',
      groupe: 'general', appellation: 'Mon général', mon: true,
      galon: { figure: 'etoile', nb: 5 },
      note: 'Sommet de la hiérarchie : le directeur général de la Gendarmerie nationale.' }
  ];

  /* ============================================================ dessin du galon
     On représente un fourreau d'épaule vu de face. La pointe est à gauche,
     côté col ; les figures se lisent depuis cette pointe. */
  var NS = 'http://www.w3.org/2000/svg';

  function tzEtoile(cx, cy, r, couleur) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rayon = i % 2 ? r * 0.42 : r;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((cx + rayon * Math.cos(a)).toFixed(1) + ',' +
               (cy + rayon * Math.sin(a)).toFixed(1));
    }
    var p = document.createElementNS(NS, 'polygon');
    p.setAttribute('points', pts.join(' '));
    p.setAttribute('fill', couleur);
    return p;
  }

  function tzGalon(grade, hauteur) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 76');
    svg.setAttribute('height', String(hauteur || 62));
    svg.setAttribute('class', 'tz-galon');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Galon : ' + tzDecrire(grade));

    var fond = document.createElementNS(NS, 'path');
    fond.setAttribute('d', 'M4,38 L34,10 L196,10 L196,66 L34,66 Z');
    fond.setAttribute('class', 'tz-galon-fond');
    svg.appendChild(fond);

    var g = grade.galon || { figure: 'aucune' };
    var teinte = TEINTES[g.teinte] || TEINTES.argent;

    if (g.figure === 'chevron') {
      for (var i = 0; i < g.nb; i++) {
        var x = 176 - i * 26;
        var c = document.createElementNS(NS, 'path');
        c.setAttribute('d', 'M' + x + ',14 L' + (x - 26) + ',38 L' + x + ',62');
        c.setAttribute('fill', 'none');
        c.setAttribute('stroke', teinte);
        c.setAttribute('stroke-width', '9');
        svg.appendChild(c);
      }

    } else if (g.figure === 'barre') {
      var ecart = 15;
      var debut = 184 - (g.nb - 1) * ecart;
      var premiereOpposee = Math.floor((g.nb - (g.opposees || 0)) / 2);
      for (var j = 0; j < g.nb; j++) {
        var opposee = !!g.opposees &&
                      j >= premiereOpposee && j < premiereOpposee + g.opposees;
        var b = document.createElementNS(NS, 'rect');
        b.setAttribute('x', String(debut + j * ecart));
        b.setAttribute('y', '12');
        b.setAttribute('width', '9');
        b.setAttribute('height', '52');
        b.setAttribute('fill', opposee
          ? (g.teinte === 'or' ? TEINTES.argent : TEINTES.or)
          : teinte);
        svg.appendChild(b);
      }
      if (g.lisere) {
        var l = document.createElementNS(NS, 'rect');
        l.setAttribute('x', String(debut - 11));
        l.setAttribute('y', '12');
        l.setAttribute('width', '5');
        l.setAttribute('height', '52');
        l.setAttribute('fill', TEINTES.rouge);
        svg.appendChild(l);
      }

    } else if (g.figure === 'etoile') {
      /* au-delà de trois, les étoiles se rangent sur deux lignes */
      if (g.nb >= 4) {
        var haut = Math.ceil(g.nb / 2);
        for (var k = 0; k < g.nb; k++) {
          if (k < haut) svg.appendChild(tzEtoile(168 - k * 30, 26, 13, TEINTES.argent));
          else          svg.appendChild(tzEtoile(153 - (k - haut) * 30, 54, 13, TEINTES.argent));
        }
      } else {
        for (var m = 0; m < g.nb; m++) {
          svg.appendChild(tzEtoile(168 - m * 30, 38, 13, TEINTES.argent));
        }
      }
    }

    return svg;
  }

  /* Description textuelle du galon — alternative accessible, et réponse
     attendue dans l'épreuve « Lire un galon ». */
  function tzDecrire(grade) {
    var g = grade.galon || { figure: 'aucune' };
    if (g.figure === 'aucune') return 'aucun galon';
    var nom = { argent: 'argent', or: 'or', bleu: 'bleu' }[g.teinte] || '';
    if (g.figure === 'chevron') {
      return g.nb + (g.nb > 1 ? ' chevrons ' : ' chevron ') + nom;
    }
    if (g.figure === 'barre') {
      var t = g.nb + (g.nb > 1 ? ' barres droites ' : ' barre droite ') + nom;
      if (g.opposees) t += ', dont ' + g.opposees + ' de la couleur opposée';
      if (g.lisere) t += ', liseré rouge';
      return t;
    }
    return g.nb + (g.nb > 1 ? ' étoiles' : ' étoile');
  }

  function tzParId(id) {
    for (var i = 0; i < GRADES.length; i++) if (GRADES[i].id === id) return GRADES[i];
    return null;
  }

  function tzDuGroupe(ids) {
    return GRADES.filter(function (g) { return ids.indexOf(g.groupe) >= 0; });
  }

  function tzNomGroupe(id) {
    for (var i = 0; i < GROUPES.length; i++) if (GROUPES[i].id === id) return GROUPES[i].nom;
    return id;
  }

  /* ================================================================ mémento
     Un écran de révision, pas une épreuve : tous les grades dans l'ordre,
     avec le galon, l'appellation et le piège éventuel. C'est ce qu'on relit
     avant de se tester. */
  function tzMemento(hote) {
    TZ.vide(hote);

    var intro = TZ.el('div', 'tz-panneau');
    intro.appendChild(TZ.el('span', 'tz-etiquette', 'La regle du « mon »'));
    var ul = TZ.el('ul', 'tz-regles');
    [ 'Le « mon » n’est pas un possessif : c’est l’abréviation de « monsieur ».',
      'Chez les sous-officiers, seuls l’adjudant et l’adjudant-chef le prennent. Ni le major, ni le maréchal des logis-chef, ni le gendarme.',
      'Tous les officiers le prennent, du lieutenant au général.',
      'L’appellation ne suit pas toujours le nom du grade : sous-lieutenant → « mon lieutenant », chef d’escadron → « mon commandant », lieutenant-colonel → « mon colonel ».',
      'Devant une femme, le « mon » tombe : « colonel », « général ».',
      'Un civil ne dit pas « mon ». Un supérieur ne le dit pas à son subordonné.'
    ].forEach(function (t) { ul.appendChild(TZ.el('li', null, t)); });
    intro.appendChild(ul);
    hote.appendChild(intro);

    GROUPES.forEach(function (gr) {
      var lot = GRADES.filter(function (g) { return g.groupe === gr.id; });
      if (!lot.length) return;
      var bloc = TZ.el('section', 'tz-panneau');
      bloc.appendChild(TZ.el('span', 'tz-etiquette', gr.nom));
      bloc.appendChild(TZ.el('p', 'tz-memento-note', gr.note));

      lot.forEach(function (g) {
        var l = TZ.el('div', 'tz-memento-ligne');

        var vis = TZ.el('div', 'tz-memento-galon');
        vis.appendChild(tzGalon(g, 48));
        l.appendChild(vis);

        var txt = TZ.el('div', 'tz-memento-texte');
        var t = TZ.el('div', 'tz-memento-titre');
        t.appendChild(TZ.el('b', null, g.nom));
        t.appendChild(TZ.el('span', 'tz-memento-abrev', g.abrev + ' · ' + g.otan));
        txt.appendChild(t);

        var ap = TZ.el('div', 'tz-memento-appel');
        ap.appendChild(TZ.el('span', 'tz-pastille-mon' + (g.mon ? ' tz-oui' : ' tz-non'),
                             g.mon ? 'mon' : 'sans mon'));
        ap.appendChild(document.createTextNode(' ' + g.appellation));
        txt.appendChild(ap);

        txt.appendChild(TZ.el('div', 'tz-memento-galon-txt', tzDecrire(g)));
        if (g.note) txt.appendChild(TZ.el('div', 'tz-memento-piege', g.note));
        l.appendChild(txt);
        bloc.appendChild(l);
      });
      hote.appendChild(bloc);
    });

    var src = TZ.el('p', 'tz-memento-source',
      'Galons de la gendarmerie départementale (couleur argent). En gendarmerie '
      + 'mobile et à la garde républicaine, mêmes figures en or. Schémas de '
      + 'révision relevés sur les planches d’insignes de l’article Wikipédia '
      + '« Grades de la Gendarmerie nationale française » ; vérifiez toujours sur '
      + 'le texte officiel avant un examen.');
    hote.appendChild(src);
  }

  TZ.grades = {
    teintes: TEINTES,
    groupes: GROUPES,
    liste: GRADES,
    galon: tzGalon,
    decrire: tzDecrire,
    parId: tzParId,
    duGroupe: tzDuGroupe,
    nomGroupe: tzNomGroupe,
    memento: tzMemento
  };

})(window);
