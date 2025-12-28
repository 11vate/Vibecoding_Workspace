import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';
import './styles/global.css';

// Unregister any existing service workers in development to prevent WebSocket blocking
if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[ServiceWorker] Unregistered existing service worker for HMR compatibility');
          }
        });
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);















