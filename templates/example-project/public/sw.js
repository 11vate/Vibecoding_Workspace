/**
 * Service Worker
 * 
 * Enables offline capability and PWA functionality.
 * 
 * Cache Strategy:
 * - Static assets: Cache first
 * - API calls: Network first, fallback to cache
 * - HTML: Network first
 */

const CACHE_NAME = 'simple-fusion-game-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/app.ts',
  '/src/core/loop.ts',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('📦 Serving from cache:', event.request.url);
        return response;
      }
      console.log('🌐 Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
});


