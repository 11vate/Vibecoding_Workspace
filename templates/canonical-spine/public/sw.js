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

const CACHE_NAME = '[project-name]-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  // Add static assets to cache
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


