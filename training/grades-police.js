/* =============================================================================
   Zone d'entraînement — corps et grades de la police nationale.

   Pendant de grades.js, qui tient la gendarmerie. Données et mémento
   seulement : les épreuves vivent dans epreuves-police.js.

   ------------------------------------------------- POURQUOI PAS D'INSIGNE ICI
   Le module gendarmerie dessine les insignes de poitrine, parce que figures,
   nombres et couleurs ont pu être relevés sur des planches d'insignes et non
   estimés. Pour la police nationale, les sources consultables décrivent les
   galons par leur TISSAGE — « quatre galons bride de 7 mm, deux espacements
   de 2 mm, chaîne coton blanc, trame cellophane argent » — et non par des
   figures dénombrables ; et elles se contredisent d'un grade à l'autre.

   On ne dessine donc rien. Un insigne inventé serait pire qu'un insigne
   absent : il s'apprendrait, et il serait faux le jour de l'examen. Ce que ce
   module enseigne à la place est entièrement vérifiable : les trois corps,
   l'ordre des grades, la catégorie, et l'appellation.

   Le jour où une planche fiable est disponible, il suffit d'ajouter un champ
   « galon » aux entrées ci-dessous et une fonction de dessin : les épreuves
   n'auront pas à changer.

   ----------------------------------------------------- LA RÈGLE À NE PAS RATER
   La police nationale est un corps CIVIL. On n'y dit JAMAIS « mon ». « Mon
   capitaine » s'adresse à un militaire, donc à un gendarme. C'est la
   confusion la plus fréquente chez qui prépare les deux concours, et elle
   s'entend immédiatement.
   ============================================================================= */
(function (global) {
  'use strict';

  var TZ = global.TZ;

  /* ------------------------------------------------------------------ corps */
  var CORPS = [
    { id: 'adjoint', nom: 'Hors corps actifs', categorie: 'Contractuel',
      note: 'Le policier adjoint n’appartient à aucun corps actif : c’est un '
          + 'contractuel, agent de police judiciaire adjoint.' },
    { id: 'cea', nom: 'Corps d’encadrement et d’application', categorie: 'Catégorie B',
      note: 'Le corps le plus nombreux. Du gardien de la paix au major, '
          + 'c’est lui qui tient la voie publique.' },
    { id: 'commandement', nom: 'Corps de commandement', categorie: 'Catégorie A',
      note: 'Les officiers de police : lieutenant, capitaine, commandant.' },
    { id: 'direction', nom: 'Corps de conception et de direction', categorie: 'Catégorie A+',
      note: 'Les commissaires. Le préfet de police, lui, n’est pas un grade '
          + 'de la police nationale mais une autorité préfectorale.' }
  ];

  /* ----------------------------------------------------------------- grades
     « rang » donne l'ordre hiérarchique, et sert aux épreuves de classement.
     « appellation » est l'appellation d'usage ; aucune ne prend « mon ». */
  var GRADES = [
    { id: 'pa', nom: 'Policier adjoint', abrev: 'PA', rang: 0,
      corps: 'adjoint', appellation: 'Par le nom', pj: 'APJA',
      note: 'Anciennement adjoint de sécurité. Contractuel, il constate '
          + 'certaines infractions et rend compte, sans diriger d’acte de contrainte.' },

    { id: 'egp', nom: 'Élève gardien de la paix', abrev: 'EGP', rang: 1,
      corps: 'cea', appellation: 'Par le nom', pj: '—',
      note: 'En formation initiale en école de police.' },

    { id: 'gpx', nom: 'Gardien de la paix', abrev: 'GPX', rang: 2,
      corps: 'cea', appellation: 'Gardien', pj: 'APJ',
      note: 'Le grade le plus représenté de la police nationale. Au 6e échelon, '
          + 'l’appellation devient « sous-brigadier ».' },

    { id: 'bri', nom: 'Brigadier de police', abrev: 'BRI', rang: 3,
      corps: 'cea', appellation: 'Brigadier', pj: 'APJ' },

    { id: 'brc', nom: 'Brigadier-chef de police', abrev: 'BRC', rang: 4,
      corps: 'cea', appellation: 'Brigadier-chef', pj: 'APJ' },

    { id: 'maj', nom: 'Major de police', abrev: 'MAJ', rang: 5,
      corps: 'cea', appellation: 'Major', pj: 'APJ',
      note: 'Le grade le plus élevé du corps d’encadrement et d’application. '
          + 'À son sommet se trouve l’emploi de responsable d’unité locale de police.' },

    { id: 'ltn', nom: 'Lieutenant de police', abrev: 'LTN', rang: 6,
      corps: 'commandement', appellation: 'Lieutenant', pj: 'OPJ',
      note: 'Premier grade du corps de commandement : on entre chez les officiers.' },

    { id: 'cne', nom: 'Capitaine de police', abrev: 'CNE', rang: 7,
      corps: 'commandement', appellation: 'Capitaine', pj: 'OPJ',
      note: 'Jamais « mon capitaine » : la police est un corps civil.' },

    { id: 'cdt', nom: 'Commandant de police', abrev: 'CDT', rang: 8,
      corps: 'commandement', appellation: 'Commandant', pj: 'OPJ',
      note: 'Grade le plus élevé du corps de commandement. Il comporte des '
          + 'échelons fonctionnels, dont celui de commandant divisionnaire.' },

    { id: 'cp', nom: 'Commissaire de police', abrev: 'CP', rang: 9,
      corps: 'direction', appellation: 'Monsieur le commissaire', pj: 'OPJ',
      note: 'Entrée dans le corps de conception et de direction. L’appellation '
          + 'est « monsieur le commissaire » ou « madame le commissaire » — '
          + 'jamais « mon commissaire ».' },

    { id: 'cdv', nom: 'Commissaire divisionnaire de police', abrev: 'CDV', rang: 10,
      corps: 'direction', appellation: 'Monsieur le commissaire', pj: 'OPJ' },

    { id: 'cg', nom: 'Commissaire général de police', abrev: 'CG', rang: 11,
      corps: 'direction', appellation: 'Monsieur le commissaire général', pj: 'OPJ',
      note: 'Sommet du corps de conception et de direction.' }
  ];

  /* ------------------------------------------------------------- utilitaires */
  function tzParId(id) {
    for (var i = 0; i < GRADES.length; i++) if (GRADES[i].id === id) return GRADES[i];
    return null;
  }

  function tzLeCorps(id) {
    for (var i = 0; i < CORPS.length; i++) if (CORPS[i].id === id) return CORPS[i];
    return CORPS[0];
  }

  function tzDuCorps(ids) {
    return GRADES.filter(function (g) { return ids.indexOf(g.corps) >= 0; });
  }

  /* Les grades, dans l'ordre hiérarchique. */
  function tzOrdonnes() {
    return GRADES.slice().sort(function (a, b) { return a.rang - b.rang; });
  }

  /* ================================================================ mémento */
  function tzMemento(hote) {
    TZ.vide(hote);

    var intro = TZ.el('div', 'tz-panneau');
    intro.appendChild(TZ.el('span', 'tz-etiquette', 'La règle des appellations'));
    var ul = TZ.el('ul', 'tz-regles');
    [ 'La police nationale est un corps CIVIL : on n’y dit jamais « mon ». '
      + '« Mon capitaine » s’adresse à un militaire, donc à un gendarme.',
      'On emploie le grade seul : « brigadier », « major », « capitaine », « commandant ».',
      'Les commissaires font exception par la forme, pas par le « mon » : '
      + '« monsieur le commissaire », « madame le commissaire ».',
      'Un élève et un policier adjoint sont appelés par leur nom.',
      'Au 6e échelon de son grade, le gardien de la paix reçoit l’appellation '
      + 'de « sous-brigadier ».'
    ].forEach(function (t) { ul.appendChild(TZ.el('li', null, t)); });
    intro.appendChild(ul);
    hote.appendChild(intro);

    CORPS.forEach(function (c) {
      var lot = GRADES.filter(function (g) { return g.corps === c.id; })
                      .sort(function (a, b) { return a.rang - b.rang; });
      if (!lot.length) return;

      var bloc = TZ.el('section', 'tz-panneau');
      var et = TZ.el('span', 'tz-etiquette', c.nom);
      bloc.appendChild(et);
      bloc.appendChild(TZ.el('p', 'tz-memento-note', c.categorie + ' — ' + c.note));

      lot.forEach(function (g) {
        var l = TZ.el('div', 'tz-memento-ligne');

        /* Pas d'insigne dessiné : à la place, le rang dans la hiérarchie,
           qui est ce que les épreuves demandent. */
        var vis = TZ.el('div', 'tz-memento-rang');
        vis.appendChild(TZ.el('b', null, String(g.rang + 1)));
        vis.appendChild(TZ.el('span', null, 'rang'));
        l.appendChild(vis);

        var txt = TZ.el('div', 'tz-memento-texte');
        var t = TZ.el('div', 'tz-memento-titre');
        t.appendChild(TZ.el('b', null, g.nom));
        t.appendChild(TZ.el('span', 'tz-memento-abrev', g.abrev + ' · ' + g.pj));
        txt.appendChild(t);

        var ap = TZ.el('div', 'tz-memento-appel');
        ap.appendChild(TZ.el('span', 'tz-pastille-mon tz-non', 'sans mon'));
        ap.appendChild(document.createTextNode(' ' + g.appellation));
        txt.appendChild(ap);

        if (g.note) txt.appendChild(TZ.el('div', 'tz-memento-piege', g.note));
        l.appendChild(txt);
        bloc.appendChild(l);
      });
      hote.appendChild(bloc);
    });

    var src = TZ.el('p', 'tz-memento-source',
      'Corps, grades et catégories relevés sur le règlement général d’emploi '
      + 'de la police nationale (arrêté du 6 juin 2006) et les décrets '
      + 'statutaires. Les INSIGNES ne sont volontairement pas représentés : '
      + 'les sources consultables décrivent les galons par leur tissage et se '
      + 'contredisent d’un grade à l’autre, et un insigne inventé serait pire '
      + 'qu’un insigne absent. Vérifiez toujours sur le texte officiel avant '
      + 'un examen.');
    hote.appendChild(src);
  }

  TZ.gradesPolice = {
    corps: CORPS,
    liste: GRADES,
    parId: tzParId,
    leCorps: tzLeCorps,
    duCorps: tzDuCorps,
    ordonnes: tzOrdonnes,
    memento: tzMemento
  };

})(window);
