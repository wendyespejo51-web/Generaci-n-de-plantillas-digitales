self.addEventListener('install', () => {
  console.log('Service Worker instalado');
});

const CACHE_VERSION = 'v1.0.4'; // CAMBIA ESTO EN CADA PUBLICACION (RELEASE)
const CACHE_NAME = `mi-app-cache-${CACHE_VERSION}`;

const urlsToCache = [
  '/Generaci-n-de-plantillas-digitales/',
  '/Generaci-n-de-plantillas-digitales/index.html',
  '/Generaci-n-de-plantillas-digitales/manifest.json',
  '/Generaci-n-de-plantillas-digitales/index.css',
  '/Generaci-n-de-plantillas-digitales/index.js'
];

// INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 🔥 CLAVE
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    ).then(() => self.clients.claim()) // 🔥 CLAVE
  );
});

// FETCH (Network first para HTML)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});


  // Cache first para CSS / JS
 // event.respondWith(
  //  caches.match(event.request).then((response) => {
   //   return response || fetch(event.request);
   // })
  //);
//});