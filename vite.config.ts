import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Make Vite's injected CSS non-render-blocking.
 * Converts <link rel="stylesheet" href="/assets/index-*.css"> to media="print"
 * and adds data-async-css so csp-bootstrap.js can activate it once loaded.
 * critical.css still loads synchronously for the loading spinner.
 */
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Only transform the Vite-generated CSS link (in /assets/), not critical.css
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" data-async-css>'
      );
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const buildId = (env.VITE_APP_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || 'dev').slice(0, 64);
  const supabaseProxyTarget = env.VITE_SUPABASE_URL?.trim();
  const proxyOrigin = 'https://dgskills.app';
  return {
    server: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: ['.loca.lt'],
      proxy: supabaseProxyTarget ? {
        '/functions/v1': {
          target: supabaseProxyTarget,
          changeOrigin: true,
          secure: true,
          configure(proxy) {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', proxyOrigin);
              proxyReq.setHeader('Referer', `${proxyOrigin}/`);
            });
          },
        }
      } : undefined,
      watch: {
        usePolling: false, // Use native fsevents on Mac (M1 friendly)
        interval: 100, // Debounce delay
        ignored: ['**/node_modules/**', '**/.git/**', '**/.agent/**']
      }
    },
    plugins: [react(), asyncCssPlugin()],
    optimizeDeps: {
      exclude: [
        // Keep heavy, lazy feature dependencies out of dev prebundles so the
        // production bundler can split their real dependency graphs.
        'exceljs',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
      ],
      // REGEL: elk CJS-only pakket binnen de hierboven uitgesloten three/R3F-boom
      // moet hier apart staan. Vite bundelt uitgesloten pakketten niet voor, serveert
      // hun CJS-afhankelijkheden rauw via /@fs/, en dan faalt de ES-module-import met
      // "does not provide an export named 'default'". In dev crasht daardoor het hele
      // leerlingdashboard (dat de 3D-avatar laadt); de docentkant heeft er geen last van.
      // Nieuwe crash van dit type? Zoek het pakket in de boom op en zet het erbij.
      include: [
        // Beide schrijfwijzen zijn nodig: Vite sleutelt prebundles op de letterlijke
        // specifier, en zustand's ESM-build (die de browser laadt) importeert de
        // variant MET extensie — `zustand/esm/traditional.mjs`:
        //   import … from 'use-sync-external-store/shim/with-selector.js'
        'use-sync-external-store/shim/with-selector',
        'use-sync-external-store/shim/with-selector.js',
        // Directe CJS-afhankelijkheden van @react-three/fiber.
        'scheduler',
        'buffer',
        'base64-js',
        'ieee754',
        // CJS-afhankelijkheden van @react-three/drei.
        'stats.js',
        'draco3d',
        'glsl-noise',
        'promise-worker-transferable',
      ],
    },
    // SECURITY: API keys removed from client bundle - all AI calls go through Supabase Edge Functions proxy
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      // Keep lazy routes lazy: avoid eager modulepreload chains on public landing routes.
      modulePreload: false,
      rolldownOptions: {
        // html2canvas is an optional jsPDF dep — never used, don't bundle it
        external: ['html2canvas'],
        output: {
          manualChunks(id) {
            // Keep Vite's preload runtime in its own tiny chunk so it never drags
            // large vendor chunks (e.g. three.js) onto public entry routes.
            if (id.includes('vite/preload-helper')) return 'vendor-preload-runtime';
            if (!id.includes('node_modules')) return;

            const isViteDeps = id.includes('.vite/deps');
            const pkgMatch = isViteDeps
              ? id.match(/\.vite\/deps\/([^/]+?)(?:\.js)?(?:\?|$)/)
              : id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);

            const pkg = pkgMatch ? pkgMatch[1].replace(/\.js$/, '') : '';
            if (!pkg) return;

            if (pkg === 'react' || pkg === 'react-dom' || pkg.startsWith('react_')) return 'vendor-react';
            if (pkg === 'three') return 'vendor-three-core';
            if (pkg.startsWith('@react-three')) return 'vendor-react-three';
            if (pkg === 'lucide-react') return 'vendor-lucide';
            if (pkg === 'exceljs') return 'vendor-exceljs';
            if (pkg === 'dompurify') return 'vendor-dompurify';
            // jspdf: NOT in manualChunks — stays with PDF export flow (BookPreview), avoids preload on landing

            if (pkg === 'react-markdown') return 'vendor-react-markdown';
            if (pkg.startsWith('@supabase') || pkg === 'supabase') return 'vendor-supabase';
          }
        }
      },
      // Large lazy feature vendors are explicitly budgeted in
      // config/performance-budgets.json. Keep Vite's warning aligned with that
      // budget so unexpected >1MB chunks still fail visibly.
      chunkSizeWarningLimit: 1000
    },
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId)
    }
  };
});
