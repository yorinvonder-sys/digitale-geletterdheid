// CSP-safe bootstrap scripts moved out of index.html
(function () {
  var CHUNK_RELOAD_TS_KEY = 'chunk_reload';
  var CHUNK_RELOAD_COUNT_KEY = 'chunk_reload_count';
  var CHUNK_RELOAD_WINDOW_MS = 5 * 60 * 1000;
  var MAX_AUTO_RELOADS_PER_WINDOW = 1;

  // www redirect
  if (window.location.hostname === 'www.dgskills.app') {
    window.location.replace('https://dgskills.app' + window.location.pathname + window.location.search);
    return;
  }

  // Only match genuine chunk / dynamic‑import errors.
  // Generic patterns like "failed to fetch" or "text/html" were removed because
  // they also match Firebase Auth, API calls, etc. and cause false‑positive
  // reload loops.
  function isChunkErrorMessage(message) {
    var msg = String(message || '').toLowerCase();
    return (
      msg.indexOf('loading chunk') !== -1 ||
      msg.indexOf('dynamically imported module') !== -1 ||
      msg.indexOf('importing a module script failed') !== -1 ||
      msg.indexOf('is not a valid javascript mime type') !== -1
    );
  }

  function getReloadMeta() {
    var ts = parseInt(sessionStorage.getItem(CHUNK_RELOAD_TS_KEY) || '0', 10);
    var count = parseInt(sessionStorage.getItem(CHUNK_RELOAD_COUNT_KEY) || '0', 10);
    if (!Number.isFinite(ts)) ts = 0;
    if (!Number.isFinite(count)) count = 0;
    return { ts: ts, count: count };
  }

  function canAutoReload() {
    var now = Date.now();
    var meta = getReloadMeta();
    if (!meta.ts || now - meta.ts > CHUNK_RELOAD_WINDOW_MS) {
      return true;
    }
    return meta.count < MAX_AUTO_RELOADS_PER_WINDOW;
  }

  function markAutoReload() {
    var now = Date.now();
    var meta = getReloadMeta();
    if (!meta.ts || now - meta.ts > CHUNK_RELOAD_WINDOW_MS) {
      sessionStorage.setItem(CHUNK_RELOAD_TS_KEY, String(now));
      sessionStorage.setItem(CHUNK_RELOAD_COUNT_KEY, '1');
      return;
    }
    sessionStorage.setItem(CHUNK_RELOAD_COUNT_KEY, String(meta.count + 1));
  }

  // Soft chunk-reload guard
  function setupChunkGuard() {
    if (window.__DG_CHUNK_GUARD_READY__) return;
    window.__DG_CHUNK_GUARD_READY__ = true;

    window.addEventListener(
      'error',
      function (event) {
        var msg = '';
        if (event && event.message) msg = event.message;
        if ((!msg || !isChunkErrorMessage(msg)) && event && event.error && event.error.message) {
          msg = event.error.message;
        }
        if (!isChunkErrorMessage(msg)) return;
        if (!canAutoReload()) return;

        try {
          markAutoReload();
        } catch (_) {
          // If storage is unavailable, fail open and do not loop.
          return;
        }

        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        window.location.reload();
      },
      true
    );
  }

  // Route-specific font loading (after first paint)
  // Self-hosted Outfit font — no external Google Fonts dependency (SRI/CSP compliant)
  function setupRouteFontLoading() {
    var path = window.location.pathname;
    if (path !== '/' && path !== '/scholen') return;

    var fontUrl = '/fonts/outfit.css';
    function loadOutfit() {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      link.onload = function () {
        document.documentElement.classList.add('font-outfit-ready');
      };
      document.head.appendChild(link);
    }

    function schedule() {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(loadOutfit, { timeout: 2500 });
      } else {
        setTimeout(loadOutfit, 0);
      }
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(schedule);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupChunkGuard();
      setupRouteFontLoading();
    });
  } else {
    setTimeout(function () {
      setupChunkGuard();
      setupRouteFontLoading();
    }, 0);
  }
})();
