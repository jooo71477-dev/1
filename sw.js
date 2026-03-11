const CACHE_NAME = 'icloth-dashboard-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/main.css',
  '/firebase-config.js',
  '/main.js'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Push Notification
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'Notification', body: 'New update' };
  const options = {
    body: data.body,
    icon: '/logo/logo2..png',
    badge: '/logo/logo2..png',
    vibrate: [200, 100, 200],
    data: { url: data.url }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
