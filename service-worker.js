const CACHE_NAME = 'v1.3_static_cache';

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
    '/MUO-V1/icon-192.png',

    '/MUO-V1/icons/arrow-left-solid-full.svg',
    '/MUO-V1/icons/box-archive-solid-full.svg',
    '/MUO-V1/icons/chevron-left-solid-full.svg',
    '/MUO-V1/icons/chevron-right-solid-full.svg',
    '/MUO-V1/icons/circle-check-regular-full.svg',
    '/MUO-V1/icons/delete-left-solid-full.svg',
    '/MUO-V1/icons/file-export-solid-full.svg',
    '/MUO-V1/icons/file-import-solid-full.svg',
    '/MUO-V1/icons/folder-plus-solid-full.svg',
    '/MUO-V1/icons/moon-solid-full.svg',
    '/MUO-V1/icons/question-solid-full.svg',
    '/MUO-V1/icons/star-regular-full.svg',
    '/MUO-V1/icons/star-solid-full.svg',
    '/MUO-V1/icons/sun-solid-full.svg',
    '/MUO-V1/icons/trash-solid-full.svg',
    '/MUO-V1/icons/triangle-exclamation-solid-full.svg'
];


// INSTALL
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] App shell cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Failed to cache app shell:', error);
                throw error;
            })
    );
});


// ACTIVATE
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});


// FETCH
self.addEventListener('fetch', event => {

    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request, {
            // This makes script.js and script.js?v=1.1
            // match the same cached file.
            ignoreSearch: true
        })
        .then(cachedResponse => {

            // We have it cached → use it.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Not cached → try the network.
            return fetch(event.request);
        })
        .catch(error => {

            console.warn(
                '[SW] Offline request failed:',
                event.request.url
            );

            // If the user is opening/reloading the PWA
            // while offline, return index.html.
            if (event.request.mode === 'navigate') {
                return caches.match('/MUO-V1/index.html');
            }

            throw error;
        })
    );
});
