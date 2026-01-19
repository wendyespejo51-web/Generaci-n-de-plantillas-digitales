const CACHE_VERSION = '1.0.7';
const CACHE_NAME = `mi-app-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/Generaci-n-de-plantillas-digitales/index.css',
  '/Generaci-n-de-plantillas-digitales/index.js'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {

  // HTML → SIEMPRE red (esto garantiza versión nueva)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  // CSS / JS → cache con respaldo
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});