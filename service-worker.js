const CACHE_NAME = 'v1_static_cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/css-setup.js',     // Pokud má příponu .js (podle ikony editoru)
  '/script.js',        // Váš hlavní skript
  '/jszip.min.js',     // Externí knihovna pro práci se ZIP soubory
  '/papaparse.min.js', // Externí knihovna pro parsování CSV
  '/manifest.json',    // Manifest pro PWA aplikaci
  '/favicon.ico',      // Ikona webu (případně .png/.svg podle vašeho souboru)
  '/icon-192.png'      // Ikona pro instalaci PWA (případně .jpg podle formátu)
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