/* =============================================================================
   Service worker de Generally — rend le jeu installable et utilisable sans réseau.

   Deux stratégies, pour deux besoins contradictoires :
   - la page elle-même part du réseau et retombe sur le cache. Ainsi une mise
     en ligne est visible tout de suite, sans attendre l'expiration d'un cache ;
   - tout le reste (librairies, banque de questions, carte, polices, icônes)
     part du cache. Ces fichiers sont volumineux et changent rarement.

   À chaque publication, incrémenter VERSION : les anciens caches sont alors
   supprimés à l'activation.
   ============================================================================= */
const VERSION = 'generally-v4';

const COQUILLE = [
  './',
  './index.html',
  './manifest.json',
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

       Seule la page du jeu est remise en cache sous la clé index.html. Toute
       autre page — contenu éditorial, zone d'entraînement, module SOG — y
       prendrait sa place, et le mode hors ligne servirait autre chose que le
       jeu. */
    const base = new URL(self.registration.scope).pathname;
    const estLeJeu = url.pathname === base || url.pathname === base + 'index.html';
    e.respondWith(
      fetch(req)
        .then((rep) => {
          if (estLeJeu && rep && rep.ok) {
            const copie = rep.clone();
            caches.open(VERSION).then((c) => c.put('./index.html', copie));
          }
          return rep;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
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
