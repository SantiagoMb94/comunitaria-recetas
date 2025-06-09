const CACHE_NAME = 'recetas-gourmet-v1';
const OFFLINE_URL = 'offline.html';

const ARCHIVOS_A_CACHEAR = [
  '/',
  '/index.html',
  '/agregar.html',
  '/receta.html',
  '/categorias.html',
  '/css/styles.css',
  '/css/variables.css',
  '/js/main.js',
  '/js/recetas.js',
  '/js/categorias.js',
  '/js/validaciones.js',
  '/js/utils.js',
  '/data/recetas.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/maskable-icon.png'
];

// ✅ Instalar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_A_CACHEAR);
    })
  );
  self.skipWaiting();
});

// 🔁 Activar y limpiar versiones viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 📦 Interceptar requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respuesta) => {
      return (
        respuesta ||
        fetch(event.request).catch(() => caches.match(OFFLINE_URL))
      );
    })
  );
});
