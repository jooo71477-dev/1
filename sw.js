// ICLOTH Service Worker
const CACHE_NAME = 'icloth-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './index.css',
    './product.html',
    './manifest.json',
    './logo/logo2..png',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500&display=swap'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE.map(url => {
                return new Request(url, { cache: 'reload' });
            })).catch(() => {
                // If some assets fail, still install
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and Firebase requests
    if (event.request.method !== 'GET' ||
        event.request.url.includes('firebaseio') ||
        event.request.url.includes('googleapis.com/identitytoolkit') ||
        event.request.url.includes('securetoken')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
