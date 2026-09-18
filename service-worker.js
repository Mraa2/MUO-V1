const CACHE_NAME = 'v1_static_cache';
const ASSETS_TO_CACHE = [
    '/MUO-V1/',
    '/MUO-V1/index.html',
    '/MUO-V1/style.css',
    '/MUO-V1/css-setup.js',
    '/MUO-V1/script.js',
    '/MUO-V1/jszip.min.js',
    '/MUO-V1/papaparse.min.js',
    '/MUO-V1/manifest.json',
    '/MUO-V1/favicon.ico',
    '/MUO-V1/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Přeskočí čekání na aktivaci
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Mažu starou cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Okamžitě převezme kontrolu nad otevřenými stránkami
  );
});

// 3. Událost 'fetch' – zachytávání síťových požadavků (načítání z cache při offline režimu)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Pokud je soubor v cache, vrátíme ho. Jinak se stáhne ze sítě.
        return response || fetch(event.request);
      })
  );
});