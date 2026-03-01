import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

function docSyncPlugin() {
  const syncDocs = () => {
    try {
      console.log('[Vite] Running document sync...');
      execSync('node scripts/sync-dev-docs.mjs', { stdio: 'inherit' });
    } catch (err) {
      console.error('[Vite] Document sync failed:', err);
    }
  };

  return {
    name: 'doc-sync-plugin',
    buildStart() {
      syncDocs();
    },
    configureServer(server) {
      syncDocs();

      // Watch source folders
      const foldersToWatch = [
        path.resolve(__dirname, 'business/nl-vo/export'),
        path.resolve(__dirname, 'business/nl-vo/compliance'),
        path.resolve(__dirname, 'public/compliance')
      ];

      foldersToWatch.forEach(folder => {
        server.watcher.add(folder);
      });

      server.watcher.on('all', (event, filePath) => {
        const isDoc = ['.pdf', '.docx', '.html', '.md'].some(ext => filePath.endsWith(ext));
        if (isDoc && (event === 'add' || event === 'change' || event === 'unlink')) {
          console.log(`[Vite] Document ${event}: ${path.basename(filePath)}`);
          syncDocs();
          server.ws.send({ type: 'full-reload' });
        }
      });
    }
  };
}

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
  return {
    server: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
      watch: {
        usePolling: false, // Use native fsevents on Mac (M1 friendly)
        interval: 100, // Debounce delay
        ignored: ['**/node_modules/**', '**/.git/**', '**/.agent/**']
      }
    },
    plugins: [react(), docSyncPlugin(), asyncCssPlugin()],
    // SECURITY: API keys removed from client bundle - all AI calls go through Supabase Edge Functions proxy
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Keep lazy routes lazy: avoid eager modulepreload chains on public landing routes.
      modulePreload: false,
      rollupOptions: {
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
            if (pkg === 'three' || pkg.startsWith('@react-three')) return 'vendor-three';
            if (pkg === 'framer-motion') return 'vendor-framer';
            if (pkg === 'lucide-react') return 'vendor-lucide';
            if (pkg.startsWith('@google/')) return 'vendor-genai';
            if (pkg === 'xlsx') return 'vendor-xlsx';
            if (pkg === 'dompurify') return 'vendor-dompurify';
            // jspdf: NOT in manualChunks — stays with PDF export flow (BookPreview), avoids preload on landing
            if (pkg.startsWith('html2canvas')) return 'vendor-html2canvas';
            if (pkg === 'react-markdown') return 'vendor-react-markdown';
          }
        }
      },
      chunkSizeWarningLimit: 600
    },
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId)
    }
  };
});
