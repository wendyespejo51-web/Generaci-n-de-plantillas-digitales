const CACHE_VERSION = '1.2.5'; //Aumentar el ultimo digito en cada actualización del codigo HTML, CSS y JavaScript (JS)
const CACHE_NAME = `mi-app-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/Generaci-n-de-plantillas-digitales/index.css',
  '/Generaci-n-de-plantillas-digitales/js/index.js',
  '/Generaci-n-de-plantillas-digitales/js/config/datalist.js',
  '/Generaci-n-de-plantillas-digitales/js/config/endpoints.js',
  '/Generaci-n-de-plantillas-digitales/js/config/formfields.js'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Intentar cachear todos, pero no fallar si uno no está disponible
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => cache.add(asset).catch(() => null))
      );
    })
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. HTML → SIEMPRE red
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 2. JS/CSS → NETWORK FIRST
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Recurso no disponible', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // 3. Otros (imágenes, fonts, etc) → CACHE FIRST
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        
        return fetch(request)
          .then(response => {
            // No cachear respuestas de error
            if (!response || response.status !== 200) {
              return response;
            }
            
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clonedResponse);
            });
            return response;
          })
          .catch(() => new Response('Offline', { status: 503 }));
      })
  );
});

// Mensaje de actualización
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});