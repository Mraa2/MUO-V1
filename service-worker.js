const CACHE_NAME = 'v1.71_static_cache';

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
            .then(async cache => {

                console.log('[SW] Installing:', CACHE_NAME);

                for (const asset of ASSETS_TO_CACHE) {
                    try {
                        await cache.add(asset);
                        console.log('[SW] Cached:', asset);
                    } catch (error) {
                        console.error('[SW] FAILED to cache:', asset, error);
                    }
                }

            })
            .then(() => self.skipWaiting())
    );
});


// ACTIVATE
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});


// FETCH
self.addEventListener('fetch', event => {

    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request, {
            ignoreSearch: true
        })
        .then(cachedResponse => {

            if (cachedResponse) {
                console.log('[SW] Cache:', event.request.url);
                return cachedResponse;
            }

            console.log('[SW] Network:', event.request.url);

            return fetch(event.request);
        })
        .catch(error => {

            console.warn(
                '[SW] Offline request failed:',
                event.request.url
            );

            if (event.request.mode === 'navigate') {

                return caches.match('/MUO-V1/index.html')
                    .then(indexResponse => {

                        if (indexResponse) {
                            return indexResponse;
                        }

                        // IMPORTANT:
                        // Never let respondWith() receive undefined.
                        return new Response(
                            '<h1>Offline</h1><p>The application is not cached yet.</p>',
                            {
                                status: 503,
                                headers: {
                                    'Content-Type': 'text/html'
                                }
                            }
                        );
                    });
            }

            return new Response('', {
                status: 503
            });
        })
    );
});
