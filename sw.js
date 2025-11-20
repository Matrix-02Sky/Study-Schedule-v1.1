const CACHE_NAME = 'study-schedule-v2';

// Assets to pre-cache immediately during installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Critical external style
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We attempt to pre-cache known assets. 
      // If some fail (like dynamic CDNs), we rely on runtime caching in 'fetch'.
      return Promise.all(
        PRECACHE_URLS.map(url => 
          cache.add(url).catch(err => console.warn('Pre-cache skipped for:', url))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-http requests (like chrome-extension://)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Fetch from network if not in cache
      return fetch(event.request).then((response) => {
        // Validate response
        // IMPORTANT: We accept 'cors' type here to allow caching of CDN scripts (React, Tailwind, etc.)
        if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }

        // 3. Clone and cache the response for future offline use
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Network failed (Offline)
        // If we had a custom offline.html, we would return it here.
        // For now, we rely on the cache having the assets.
        console.log('Fetch failed (Offline):', event.request.url);
      });
    })
  );
});