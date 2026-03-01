import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
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
scheduleVitals(async () => {
  // Delay vitals bootstrap slightly to keep the critical route quiet during first paint.
  setTimeout(async () => {
    const { initWebVitals } = await import('./utils/webVitals');
    initWebVitals();
  }, 2500);
});

function scheduleLoginServiceWorkerCleanup() {
  if (typeof window === 'undefined') return;
  if (!window.location.pathname.startsWith('/login')) return;
  if (!('serviceWorker' in navigator)) return;

  let hasRun = false;
  let idleId: number | ReturnType<typeof setTimeout> | undefined;
  let idleKind: 'ric' | 'timeout' | null = null;
  const interactionEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart'];

  const cleanupListeners = () => {
    interactionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, onInteraction);
    });
    if (typeof idleId !== 'undefined') {
      if (idleKind === 'ric' && typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as ReturnType<typeof setTimeout>);
      }
    }
  };

  const runCleanup = async () => {
    if (hasRun) return;
    hasRun = true;
    cleanupListeners();

    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length === 0) return;
      await Promise.all(regs.map((reg) => reg.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith('ai-lab-shell-')).map((k) => caches.delete(k)));
      }
    } catch {
      // Ignore SW cleanup failures; app continues normally.
    }
  };

  const onInteraction = () => { void runCleanup(); };
  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, onInteraction, { once: true, passive: true });
  });

  if (typeof requestIdleCallback !== 'undefined') {
    idleId = requestIdleCallback(() => { void runCleanup(); }, { timeout: 5000 });
    idleKind = 'ric';
  } else {
    idleId = setTimeout(() => { void runCleanup(); }, 5000);
    idleKind = 'timeout';
  }
}

scheduleLoginServiceWorkerCleanup();
