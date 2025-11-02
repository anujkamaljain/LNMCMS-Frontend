import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./utils/appStore.js";

// Register Service Worker for PWA (non-blocking - website works even if it fails)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope);
          
          // Check for updates every hour (non-blocking)
          try {
            setInterval(() => {
              try {
                registration.update();
              } catch (updateError) {
                console.warn('[PWA] Update check failed:', updateError);
                // Continue - don't block anything
              }
            }, 3600000); // 1 hour
          } catch (intervalError) {
            console.warn('[PWA] Failed to set up update interval:', intervalError);
            // Continue - don't block anything
          }

          // Listen for updates (non-blocking)
          try {
            registration.addEventListener('updatefound', () => {
              try {
                const newWorker = registration.installing;
                if (newWorker) {
                  newWorker.addEventListener('statechange', () => {
                    try {
                      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        console.log('[PWA] New version available');
                        // You can show a notification here to prompt user to reload
                        if (window.confirm('A new version is available. Reload to update?')) {
                          window.location.reload();
                        }
                      }
                    } catch (stateError) {
                      console.warn('[PWA] State change handler error:', stateError);
                      // Continue - don't block anything
                    }
                  });
                }
              } catch (updateError) {
                console.warn('[PWA] Update found handler error:', updateError);
                // Continue - don't block anything
              }
            });
          } catch (listenerError) {
            console.warn('[PWA] Failed to add update listener:', listenerError);
            // Continue - don't block anything
          }
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed (website will work normally):', error);
          // Website continues to work normally without PWA features
        });

      // Listen for messages from service worker (non-blocking)
      try {
        navigator.serviceWorker.addEventListener('message', (event) => {
          try {
            if (event.data && event.data.type === 'CACHE_CLEARED') {
              console.log('[PWA] Cache cleared');
            }
          } catch (messageError) {
            console.warn('[PWA] Message handler error:', messageError);
            // Continue - don't block anything
          }
        });
      } catch (messageListenerError) {
        console.warn('[PWA] Failed to add message listener:', messageListenerError);
        // Continue - don't block anything
      }
    } catch (error) {
      console.warn('[PWA] Service Worker setup failed (website will work normally):', error);
      // Website continues to work normally without PWA features
    }
  });
}

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
    </Provider>
);
