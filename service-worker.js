const CACHE_VERSION = '1.1.6'; // Cambiar el ultimo digito despues de cada actualización
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

  // JS → NETWORK FIRST (clave para iOS)
  if (event.request.destination === 'script') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CSS → cache con respaldo
  if (event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
    return;
  }

  // Otros
  event.respondWith(fetch(event.request));

});







