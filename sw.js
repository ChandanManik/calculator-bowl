/**
 * CalculatorBowl Service Worker - Lightning Fast Offline Caching
 * Cache-First for Static Assets (CSS, JS, Fonts)
 * Network-First for Navigation
 */

const CACHE_NAME = 'calculatorbowl-v1.0.0';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/calculator-content.js',
  '/js/clusters.js',
  '/js/calculators/basic-calculator.js',
  '/js/calculators/financial-loan.js',
  '/js/calculators/financial-compound.js',
  '/js/calculators/financial-simple-tax.js',
  '/js/calculators/financial-business.js',
  '/js/calculators/financial-gold.js',
  '/js/calculators/financial-bitcoin.js',
  '/js/calculators/math-fractions.js',
  '/js/calculators/math-fractions-advanced.js',
  '/js/calculators/math-percentage.js',
  '/js/calculators/math-statistics.js',
  '/js/calculators/conversion-temperature.js',
  '/js/calculators/datetime-weight.js',
  '/js/calculators/datetime-weather.js',
  '/js/calculators/tech-network.js',
  '/js/i18n.js',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Service worker precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and external tracking/analytics
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Google Fonts caching
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch (err) {
          return cached;
        }
      })
    );
    return;
  }

  // Same-origin static assets: Cache-First
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch update in background (Stale-While-Revalidate)
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
  }
});
