/* =============================================================================
   Zone d'entraînement — briques d'interface communes aux épreuves.

   Chaque épreuve reçoit un « contexte » qui lui donne ces outils. Elle n'a
   donc jamais à manipuler le squelette de la page, ce qui garde les modules
   courts et interchangeables.
   ============================================================================= */
(function (global) {
  'use strict';
  var TZ = global.TZ;

  /* Compte à rebours d'entrée. Toutes les épreuves démarrent pareil : le
     joueur a besoin d'une seconde pour poser les yeux au bon endroit.

     Le décompte est volontairement gris et plus petit que le contenu des
     épreuves. Il le faut : dans l'empan, « 3 2 1 » s'affichait exactement
     comme les chiffres à mémoriser, au même endroit, et on ne savait plus
     lesquels comptaient. Les épreuves dont le contenu est chiffré passent en
     plus par un décompte en points, qui ne peut pas se confondre. */
  function tzDepart(scene, surFin, options) {
    var sansChiffres = options && options.sansChiffres;
    var suite = sansChiffres ? ['•', '• •', '• • •', 'Go'] : ['3', '2', '1', 'Go'];
    var i = 0;
    var n = TZ.el('div', 'tz-grand tz-decompte');
    TZ.vide(scene).appendChild(n);
    (function pas() {
      if (i >= suite.length) { surFin(); return; }
      n.textContent = suite[i];
      n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
      if (i < 3) TZ.son.tic(); else TZ.son.depart();
      i++;
      TZ.apres(560, pas);
    })();
  }

  function tzConsigne(scene, texte) {
    var p = TZ.el('p', 'tz-consigne', texte);
    scene.appendChild(p);
    return p;
  }

  function tzIndice(scene, texte) {
    var p = TZ.el('p', 'tz-indice', texte);
    scene.appendChild(p);
    return p;
  }

  function tzMessage(scene, texte, genre) {
    var p = TZ.el('div', 'tz-message tz-' + (genre || 'neutre'), texte);
    scene.appendChild(p);
    return p;
  }

  /* Bandeau d'état : essai en cours, score provisoire, barre de chrono. */
  function tzBandeau(hote) {
    var b = TZ.vide(hote);
    b.className = 'tz-bandeau';
    var infos = {};
    var jauge = null;
    return {
      info: function (cle, valeur, libelle) {
        if (!infos[cle]) {
          var d = TZ.el('span', 'tz-info');
          d.appendChild(document.createTextNode(''));
          d.appendChild(TZ.el('span', null, ' ' + (libelle || cle)));
          b.appendChild(d);
          infos[cle] = d;
        }
        infos[cle].firstChild.nodeValue = String(valeur);
      },
      jauge: function (fraction) {
        if (!jauge) {
          var j = TZ.el('div', 'tz-jauge');
          var i = TZ.el('i');
          j.appendChild(i);
          b.appendChild(j);
          jauge = { boite: j, barre: i };
        }
        jauge.barre.style.width = Math.round(TZ.borne(fraction, 0, 1) * 100) + '%';
        jauge.boite.classList.toggle('tz-alerte', fraction < 0.25);
      },
      vider: function () { TZ.vide(b); infos = {}; jauge = null; }
    };
  }

  /* Grille d'objets cliquables, utilisée par le Jeu de Kim. */
  function tzGrilleObjets(scene, items, colonnes, surClic) {
    var g = TZ.el('div', 'tz-objets');
    g.style.gridTemplateColumns = 'repeat(' + colonnes + ', auto)';
    var noeuds = items.map(function (it, idx) {
      var d = TZ.el('div', 'tz-objet', it);
      if (surClic) {
        d.setAttribute('role', 'button');
        d.setAttribute('tabindex', '0');
        d.addEventListener('click', function () { surClic(idx, d); });
        d.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); surClic(idx, d); }
        });
      } else {
        d.classList.add('tz-fige');
      }
      g.appendChild(d);
      return d;
    });
    scene.appendChild(g);
    return { boite: g, noeuds: noeuds };
  }

  /* Rangée de boutons d'action sous la scène. */
  function tzActions(scene, boutons) {
    var r = TZ.el('div', 'tz-rangee');
    boutons.forEach(function (b) {
      var n = TZ.el('button', 'tz-btn' + (b.fantome ? ' tz-fantome' : ''), b.texte);
      n.type = 'button';
      if (b.desactive) n.disabled = true;
      n.addEventListener('click', function () { b.action(n); });
      r.appendChild(n);
      b.noeud = n;
    });
    scene.appendChild(r);
    return r;
  }

  TZ.ui = {
    depart: tzDepart, consigne: tzConsigne, indice: tzIndice,
    message: tzMessage, bandeau: tzBandeau,
    grilleObjets: tzGrilleObjets, actions: tzActions
  };

})(window);
