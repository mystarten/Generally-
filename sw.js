/* =============================================================================
   Service worker de Generally — rend le jeu installable et utilisable sans réseau.

   Deux stratégies, pour deux besoins contradictoires :
   - la page elle-même part du réseau et retombe sur le cache. Ainsi une mise
     en ligne est visible tout de suite, sans attendre l'expiration d'un cache ;
   - tout le reste (librairies, banque de questions, carte, polices, icônes)
     part du cache. Ces fichiers sont volumineux et changent rarement.

   À chaque publication, incrémenter VERSION : les anciens caches sont alors
   supprimés à l'activation.

   Ce n'est pas une formalité. Les fichiers de training/ ne sont pas
   préchargés, mais ils tombent dans le cache dès la première visite, et ils
   en ressortent EN PRIORITÉ. Publier une nouvelle zone d'entraînement sans
   incrémenter ici sert donc un mélange : la page neuve, et les anciens
   scripts — ce qui est pire qu'une version entièrement ancienne, parce que
   les deux moitiés ne s'accordent pas.
   ============================================================================= */
const VERSION = 'generally-v8';

/* Ce qui est telecharge des l'installation, pour que le site fonctionne sans
   reseau meme sur une page jamais ouverte.

   La zone d'entrainement y figure desormais en entier. Elle pese, mais c'est
   precisement ce qu'on vient y chercher : reviser dans un vehicule, dans un
   sous-sol, en zone blanche. Un entrainement qui exige du reseau n'est pas un
   entrainement de terrain. */
const COQUILLE = [
  './',
  './index.html',
  './manifest.json',
  './training.html',
  './sog.html',
  './training/style.css',
  './training/tz-sog.css',
  './training/moteur.js',
  './training/ui.js',
  './training/carte.js',
  './training/fdo-savoirs.js',
  './training/fdo.js',
  './training/quizz.js',
  './training/grades.js',
  './training/grades-police.js',
  './training/epreuves-memoire.js',
  './training/epreuves-attention.js',
  './training/epreuves-grades.js',
  './training/epreuves-police.js',
  './training/epreuves-savoirs.js',
  './training/epreuves-terrain.js',
  './training/salon.js',
  './training/app.js',
  './training/tz-sog-data.js',
  './training/tz-sog.js',
  './lib/d3.min.js',
  './lib/topojson-client.min.js',
  './data/monde.js',
  './data/geographie.js',
  './data/geopolitique.js',
  './data/politique.js',
  './data/histoire.js',
  './data/astronomie.js',
  './data/sciences.js',
  './data/arts.js',
  './data/sport.js',
  './pages.css',
  './polices/polices.css',
  './polices/fredoka-500-latin.woff2',
  './polices/fredoka-500-latin-ext.woff2',
  './polices/nunito-400-latin.woff2',
  './polices/nunito-400-latin-ext.woff2',
  './icones/icone-192.png',
  './icones/icone-512.png'
];

self.addEventListener('install', (e) => {
  /* addAll échoue en bloc si un seul fichier manque : on ajoute un par un
     pour qu'une police absente n'empêche pas toute l'installation */
  e.waitUntil(
    caches.open(VERSION).then((c) =>
      Promise.all(COQUILLE.map((u) => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // on ne touche pas à l'extérieur

  const estPage = req.mode === 'navigate' ||
                  (req.headers.get('accept') || '').includes('text/html');

  if (estPage) {
    /* Réseau d'abord : une nouvelle version se voit immédiatement.

       CHAQUE page est remise en cache SOUS SA PROPRE CLÉ, et le repli hors
       ligne cherche d'abord la page demandée.

       Avant, tout était rangé sous './index.html' et le repli y renvoyait
       quelle que soit la page : sans réseau, la zone d'entraînement et le
       module Culture SOG affichaient le quiz de culture générale. Promettre
       un entraînement hors ligne et servir autre chose est pire que ne rien
       promettre — c'est au moment où l'on n'a pas de réseau qu'on découvrait
       la panne.

       Ranger chaque page sous sa clé supprime du même coup la crainte qui
       avait motivé l'ancien montage : une page ne peut plus prendre la place
       d'une autre. */
    e.respondWith(
      fetch(req)
        .then((rep) => {
          if (rep && rep.ok) {
            const copie = rep.clone();
            caches.open(VERSION).then((c) => c.put(req, copie));
          }
          return rep;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true })
            .then((r) => r || caches.match('./index.html'))
            .then((r) => r || caches.match('./'))
        )
    );
    return;
  }

  /* cache d'abord pour tout le reste */
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((rep) => {
      if (rep && rep.status === 200 && rep.type === 'basic') {
        const copie = rep.clone();
        caches.open(VERSION).then((c) => c.put(req, copie));
      }
      return rep;
    }).catch(() => hit))
  );
});
