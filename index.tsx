import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initWebVitals } from './utils/webVitals';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Defer Web Vitals init to idle — reduces main-thread blocking during LCP/FCP
const scheduleVitals = typeof requestIdleCallback !== 'undefined'
  ? requestIdleCallback
  : (cb: () => void) => setTimeout(cb, 0);
scheduleVitals(() => initWebVitals());

if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login') && 'serviceWorker' in navigator) {
  (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length === 0) return;
      await Promise.all(regs.map((reg) => reg.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith('ai-lab-shell-')).map((k) => caches.delete(k)));
      }
      const reloadKey = 'login_sw_reset_done';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    } catch {
      // Ignore SW cleanup failures; app continues normally.
    }
  })();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Temporarily disable SW caching to prevent stale app shells on login routes.
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
      .catch(() => { });
  });
}