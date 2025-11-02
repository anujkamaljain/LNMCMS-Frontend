// Service Worker for LNMCMS PWA
const CACHE_NAME = 'lnmcms-v1';
const RUNTIME_CACHE = 'lnmcms-runtime-v1';
const OFFLINE_PAGE = '/index.html';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// Install event - cache static assets (non-blocking)
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  try {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn('[Service Worker] Some assets failed to cache:', error);
          // Continue even if some assets fail - don't block installation
          return Promise.resolve();
        });
      }).catch((error) => {
        console.warn('[Service Worker] Cache open failed (continuing):', error);
        // Continue installation even if cache fails
        return Promise.resolve();
      })
    );
    self.skipWaiting(); // Activate immediately
  } catch (error) {
    console.error('[Service Worker] Install event error:', error);
    // Don't block - skip waiting to activate anyway
    self.skipWaiting();
  }
});

// Activate event - clean up old caches (non-blocking)
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  try {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              try {
                console.log('[Service Worker] Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              } catch (deleteError) {
                console.warn('[Service Worker] Failed to delete cache:', cacheName, deleteError);
                return Promise.resolve(); // Continue even if deletion fails
              }
            }
            return Promise.resolve();
          })
        );
      }).catch((error) => {
        console.warn('[Service Worker] Cache keys retrieval failed (continuing):', error);
        return Promise.resolve(); // Continue activation even if cleanup fails
      })
    );
    // Claim clients but don't block if it fails
    self.clients.claim().catch((error) => {
      console.warn('[Service Worker] Client claim failed:', error);
      // Continue - don't block activation
    });
  } catch (error) {
    console.error('[Service Worker] Activate event error:', error);
    // Continue activation anyway
    self.clients.claim().catch(() => {});
  }
});

// Fetch event - serve from cache, fallback to network (non-blocking)
self.addEventListener('fetch', (event) => {
  try {
    const { request } = event;
    
    // Skip non-GET requests - let browser handle them normally
    if (request.method !== 'GET') {
      return; // Don't intercept - browser handles normally
    }

    // Skip cross-origin requests - let browser handle them normally
    try {
      const url = new URL(request.url);
      if (url.origin !== location.origin) {
        return; // Don't intercept - browser handles normally
      }

      // Skip API calls - always use network for API (but don't block if it fails)
      if (url.pathname.startsWith('/api') || 
          url.pathname.includes('api') ||
          url.pathname.includes('auth')) {
        // Network only for API calls - but if service worker fails, let browser handle
        try {
          event.respondWith(
            fetch(request).catch(() => {
              return new Response(
                JSON.stringify({ 
                  error: 'Network error. Please check your connection.',
                  offline: true 
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            })
          );
        } catch (apiError) {
          console.warn('[Service Worker] API fetch handler failed, letting browser handle:', apiError);
          // Don't call respondWith - browser will handle request normally
          return;
        }
        return;
      }

      // For static assets and pages - cache first, network fallback
      // If anything fails, don't call respondWith so browser handles it normally
      try {
        event.respondWith(
          caches.match(request).then((cachedResponse) => {
            // Return cached version if available
            if (cachedResponse) {
              // Update cache in background (stale-while-revalidate strategy)
              fetch(request).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                  try {
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                      cache.put(request, responseToCache).catch((cacheError) => {
                        console.warn('[Service Worker] Cache put failed:', cacheError);
                        // Continue - caching failure doesn't block the response
                      });
                    }).catch((openError) => {
                      console.warn('[Service Worker] Cache open failed:', openError);
                      // Continue - caching failure doesn't block the response
                    });
                  } catch (cloneError) {
                    console.warn('[Service Worker] Response clone failed:', cloneError);
                    // Continue - cloning failure doesn't block the response
                  }
                }
              }).catch(() => {
                // Network failed, use cached version - this is expected
              });
              return cachedResponse;
            }

            // Fetch from network
            return fetch(request).then((response) => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              try {
                const responseToCache = response.clone();

                // Cache the fetched response (non-blocking)
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseToCache).catch((cacheError) => {
                    console.warn('[Service Worker] Cache put failed:', cacheError);
                    // Continue - caching failure doesn't block the response
                  });
                }).catch((openError) => {
                  console.warn('[Service Worker] Cache open failed:', openError);
                  // Continue - caching failure doesn't block the response
                });
              } catch (cloneError) {
                console.warn('[Service Worker] Response clone failed:', cloneError);
                // Continue - return response even if caching fails
              }

              return response;
            }).catch(() => {
              // If offline and request is for a page, return cached index.html
              try {
                if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
                  return caches.match(OFFLINE_PAGE).then((offlinePage) => {
                    if (offlinePage) {
                      return offlinePage;
                    }
                    // If no offline page, let browser handle it (don't block)
                    throw new Error('No offline page available');
                  });
                }
              } catch (offlineError) {
                // Fall through to error response
              }
              // For other requests, return a proper error response
              return new Response('Offline - content not available', {
                status: 503,
                headers: { 
                  'Content-Type': 'text/plain',
                  'Cache-Control': 'no-cache'
                }
              });
            });
          }).catch((cacheMatchError) => {
            console.warn('[Service Worker] Cache match failed, fetching from network:', cacheMatchError);
            // If cache matching fails, try network directly
            return fetch(request).catch(() => {
              // If network also fails, return error
              return new Response('Service unavailable', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
          })
        );
      } catch (respondError) {
        console.warn('[Service Worker] RespondWith failed, letting browser handle request:', respondError);
        // Don't call respondWith - browser will handle request normally
        return;
      }
    } catch (urlError) {
      console.warn('[Service Worker] URL parsing failed, letting browser handle:', urlError);
      // Don't intercept - browser handles normally
      return;
    }
  } catch (error) {
    console.error('[Service Worker] Fetch event error (letting browser handle):', error);
    // Don't call respondWith - browser will handle request normally
    // This ensures website works even if service worker completely fails
    return;
  }
});

// Handle messages from the app (for cache updates, etc.) - non-blocking
self.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      try {
        self.skipWaiting();
      } catch (skipError) {
        console.warn('[Service Worker] Skip waiting failed:', skipError);
        // Continue - don't block
      }
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
      try {
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                try {
                  return caches.delete(cacheName);
                } catch (deleteError) {
                  console.warn('[Service Worker] Cache delete failed:', cacheName, deleteError);
                  return Promise.resolve(); // Continue even if deletion fails
                }
              })
            );
          }).then(() => {
            return self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                try {
                  client.postMessage({ type: 'CACHE_CLEARED' });
                } catch (messageError) {
                  console.warn('[Service Worker] Post message failed:', messageError);
                  // Continue - don't block
                }
              });
            });
          }).catch((error) => {
            console.warn('[Service Worker] Cache clear failed:', error);
            // Continue - don't block message handling
            return Promise.resolve();
          })
        );
      } catch (clearError) {
        console.warn('[Service Worker] Clear cache handler failed:', clearError);
        // Continue - don't block
      }
    }
  } catch (error) {
    console.error('[Service Worker] Message handler error:', error);
    // Continue - don't block message handling
  }
});

