/**
 * Waarschuwt tijdens de build als client-side omgevingsvariabelen ontbreken.
 *
 * Bewust NIET fataal: een ontbrekende variabele mag een deploy niet blokkeren,
 * maar moet wel zichtbaar zijn in de buildlogs. Zonder deze check merk je het
 * pas in de browser, en dan alleen als je de console opent.
 *
 * Gebruik: node scripts/check-env.mjs [mode]
 */

import { loadEnv } from 'vite';

// Vite's eigen loader, zodat we exact zien wat de build ziet: zowel de
// .env-bestanden (lokale ontwikkeling) als process.env (CI en Vercel).
// Zonder dit zou een lokale .env.local ten onrechte als "ontbrekend" gelden.
const mode = process.argv[2] || 'production';
const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };

const REQUIRED = [
    {
        name: 'VITE_SUPABASE_URL',
        why: 'Supabase-client en edge functions (auth, database, AI-endpoints)',
    },
    {
        name: 'VITE_SUPABASE_ANON_KEY',
        why: 'Supabase-client en edge functions (auth, database, AI-endpoints)',
    },
];

const missing = REQUIRED.filter(({ name }) => !env[name]?.trim());

if (missing.length > 0) {
    const lines = [
        '',
        '  ⚠️  ONTBREKENDE OMGEVINGSVARIABELEN',
        '',
        ...missing.map(({ name, why }) => `     • ${name} — ${why}`),
        '',
        '     De build gaat door, maar in de resulterende bundel is Supabase niet',
        '     geconfigureerd. Publieke contentpagina\'s blijven werken; inloggen en',
        '     alles wat een edge function aanroept faalt met een SupabaseConfigError.',
        '',
        '     Vercel: Settings → Environment Variables, en vink de juiste scope aan',
        '     (Production én Preview) — een variabele die alleen op Production staat,',
        '     ontbreekt in elke preview-deployment.',
        '',
    ];
    console.warn(lines.join('\n'));
} else {
    console.log('✓ Omgevingsvariabelen aanwezig');
}
