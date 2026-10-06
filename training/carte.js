/* =============================================================================
   Zone d'entraînement — carte du monde.

   Le jeu possède déjà une carte, mais son code est inséré dans index.html :
   impossible à réutiliser sans coupler les deux. On redessine donc une carte
   ici, à partir des mêmes fichiers lus en LECTURE SEULE :
       lib/d3.min.js, lib/topojson-client.min.js, data/monde.js

   Choix de conception important : on ne clique pas les pays, on clique des
   pastilles posées sur eux. Viser la France ou le Japon sur une carte du monde
   relève de l'adresse au pixel, pas de la mémoire — et c'est la mémoire qu'on
   entraîne ici. Les pastilles font 26 px, se visent sans effort, et le pays
   s'allume avec elles pour garder la lecture géographique.
   ============================================================================= */
(function (global) {
  'use strict';

  var TZ = global.TZ;

  /* Pays bien répartis et reconnaissables. Codes ISO 3166-1 numériques,
     identiques à ceux du jeu. */
  var TZ_PAYS = [
    { id: '250', nom: 'France' },        { id: '724', nom: 'Espagne' },
    { id: '380', nom: 'Italie' },        { id: '276', nom: 'Allemagne' },
    { id: '826', nom: 'Royaume-Uni' },   { id: '578', nom: 'Norvège' },
    { id: '643', nom: 'Russie' },        { id: '792', nom: 'Turquie' },
    { id: '818', nom: 'Égypte' },        { id: '710', nom: 'Afrique du Sud' },
    { id: '566', nom: 'Nigéria' },       { id: '012', nom: 'Algérie' },
    { id: '356', nom: 'Inde' },          { id: '156', nom: 'Chine' },
    { id: '392', nom: 'Japon' },         { id: '036', nom: 'Australie' },
    { id: '840', nom: 'États-Unis' },    { id: '124', nom: 'Canada' },
    { id: '076', nom: 'Brésil' },        { id: '032', nom: 'Argentine' },
    { id: '484', nom: 'Mexique' },       { id: '604', nom: 'Pérou' },
    { id: '682', nom: 'Arabie saoudite' }, { id: '364', nom: 'Iran' }
  ];

  var pret = false;
  var geo = null;
  var LARGEUR = 980, HAUTEUR = 510;     /* viewBox : la boîte s'étire ensuite */

  function tzCarteDisponible() { return pret; }

  function tzPreparerCarte() {
    if (pret) return true;
    if (!global.d3 || !global.topojson || !global.WORLD_TOPO) return false;
    try {
      var topo = global.WORLD_TOPO;
      var fc = global.topojson.feature(topo, topo.objects.countries);
      geo = {};
      fc.features.forEach(function (f) {
        var code = String(f.id == null ? '' : f.id);
        while (code.length < 3) code = '0' + code;
        geo[code] = f;
      });
      pret = true;
      return true;
    } catch (e) { return false; }
  }

  /* Dessine la carte et renvoie une petite API.
     onPays(code) est appelé au clic sur une pastille rendue cliquable. */
  function tzDessinerCarte(hote, onPays) {
    if (!tzPreparerCarte()) return null;

    var d3 = global.d3;
    var projection = d3.geoNaturalEarth1()
      .fitExtent([[8, 8], [LARGEUR - 8, HAUTEUR - 8]],
                 { type: 'FeatureCollection',
                   features: Object.keys(geo).map(function (k) { return geo[k]; }) });
    var chemin = d3.geoPath(projection);

    var boite = TZ.el('div', 'tz-carte-boite');
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + LARGEUR + ' ' + HAUTEUR);
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Carte du monde');

    /* --- fond : tous les pays --- */
    var gPays = document.createElementNS(NS, 'g');
    var noeuds = {};
    Object.keys(geo).forEach(function (code) {
      var d = chemin(geo[code]);
      if (!d) return;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'tz-pays');
      gPays.appendChild(p);
      noeuds[code] = p;
    });
    svg.appendChild(gPays);

    var gTrace = document.createElementNS(NS, 'g');
    svg.appendChild(gTrace);

    /* --- pastilles : les vraies cibles de clic --- */
    var gPastilles = document.createElementNS(NS, 'g');
    var pastilles = {};
    var centres = {};
    TZ_PAYS.forEach(function (p) {
      if (!geo[p.id]) return;
      var c = chemin.centroid(geo[p.id]);
      if (!c || !isFinite(c[0])) return;
      centres[p.id] = c;

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'tz-pastille-carte');
      g.dataset.code = p.id;

      var halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', c[0]); halo.setAttribute('cy', c[1]);
      halo.setAttribute('r', 19);
      halo.setAttribute('class', 'tz-halo');

      var d = document.createElementNS(NS, 'circle');
      d.setAttribute('cx', c[0]); d.setAttribute('cy', c[1]);
      d.setAttribute('r', 11);
      d.setAttribute('class', 'tz-disque');

      var t = document.createElementNS(NS, 'title');
      t.textContent = p.nom;

      g.appendChild(halo); g.appendChild(d); g.appendChild(t);
      gPastilles.appendChild(g);
      pastilles[p.id] = g;
    });
    svg.appendChild(gPastilles);

    boite.appendChild(svg);
    /* La scène est une colonne flex centrée : sans cette largeur explicite,
       l'hôte se réduit à sa largeur intrinsèque et la carte devient minuscule. */
    hote.style.width = '100%';
    hote.style.alignSelf = 'stretch';
    TZ.vide(hote).appendChild(boite);

    if (onPays) {
      svg.addEventListener('click', function (ev) {
        var g = ev.target.closest ? ev.target.closest('.tz-pastille-carte') : null;
        if (g && g.classList.contains('tz-cliquable')) onPays(g.dataset.code);
      });
    }

    function appliquer(code, classe) {
      [noeuds[code], pastilles[code]].forEach(function (n) {
        if (!n) return;
        n.classList.remove('tz-actif', 'tz-juste', 'tz-faux');
        if (classe) n.classList.add(classe);
      });
    }

    return {
      cliquables: function (codes) {
        Object.keys(pastilles).forEach(function (c) {
          pastilles[c].classList.toggle('tz-cliquable', codes.indexOf(c) >= 0);
        });
      },
      etat: appliquer,
      effacerEtats: function () {
        Object.keys(pastilles).forEach(function (c) { appliquer(c, null); });
      },
      /* relie une suite de pays par leurs pastilles */
      tracer: function (codes) {
        TZ.vide(gTrace);
        if (!codes || codes.length < 2) return;
        var pts = codes.map(function (c) { return centres[c]; })
                       .filter(function (p) { return p; });
        if (pts.length < 2) return;
        var d = 'M' + pts.map(function (p) {
          return p[0].toFixed(1) + ',' + p[1].toFixed(1);
        }).join('L');
        var ligne = document.createElementNS(NS, 'path');
        ligne.setAttribute('d', d);
        ligne.setAttribute('class', 'tz-trace');
        gTrace.appendChild(ligne);
        /* numéros d'étape : l'ordre doit se lire, pas se deviner */
        pts.forEach(function (p, i) {
          var n = document.createElementNS(NS, 'text');
          n.setAttribute('x', p[0]); n.setAttribute('y', p[1] - 19);
          n.setAttribute('class', 'tz-num');
          n.setAttribute('text-anchor', 'middle');
          n.textContent = String(i + 1);
          gTrace.appendChild(n);
        });
      },
      effacerTrace: function () { TZ.vide(gTrace); },
      nomDe: function (code) {
        var p = TZ_PAYS.filter(function (x) { return x.id === code; })[0];
        return p ? p.nom : code;
      }
    };
  }

  TZ.carte = {
    pays: TZ_PAYS,
    disponible: tzCarteDisponible,
    preparer: tzPreparerCarte,
    dessiner: tzDessinerCarte
  };

})(window);
