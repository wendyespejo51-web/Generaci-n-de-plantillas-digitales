// 1. Usa una variable y cámbiala (por ejemplo, de 'v1' a 'v2')
const CACHE_NAME = 'mi-app-cache-v4'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './index.css',
  './index.js'
];

// Evento INSTALL: Usa el nombre de caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento ACTIVATE: Limpia lo que no sea el nombre de caché actual
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; 
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Elimina cachés v1, v0, etc.
          }
        })
      );
    })
  );
});

// Evento FETCH: Se mantiene igual
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
