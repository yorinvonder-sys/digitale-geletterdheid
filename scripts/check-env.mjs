/**
 * Controleert tijdens de build of de vereiste clientconfiguratie aanwezig is.
 *
 * Op Vercel Production is ontbrekende Supabase-configuratie fataal: een groene
 * deploy met kapotte auth, database en AI-endpoints mag niet mogelijk zijn.
 * Preview- en lokale builds blijven waarschuwen, zodat publieke pagina's zonder
 * Supabase-configuratie nog getest kunnen worden.
 *
 * Gebruik: node scripts/check-env.mjs [mode]
 */

import { loadEnv } from 'vite';

// Vite's eigen loader, zodat we exact zien wat de build ziet: zowel de
// .env-bestanden (lokale ontwikkeling) als process.env (CI en Vercel).
// Zonder dit zou een lokale .env.local ten onrechte als "ontbrekend" gelden.
const mode = process.argv[2] || 'production';
const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
const isVercelProduction = process.env.VERCEL_ENV === 'production';

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
        `  ${isVercelProduction ? '❌' : '⚠️'}  ONTBREKENDE OMGEVINGSVARIABELEN`,
        '',
        ...missing.map(({ name, why }) => `     • ${name} — ${why}`),
        '',
        ...(isVercelProduction
            ? [
                '     Productionbuild afgebroken: zonder deze configuratie zijn auth,',
                '     database en AI-endpoints niet bruikbaar.',
            ]
            : [
                '     De build gaat door, maar in de resulterende bundel is Supabase niet',
                '     geconfigureerd. Publieke contentpagina\'s blijven werken; inloggen en',
                '     alles wat een edge function aanroept faalt met een SupabaseConfigError.',
            ]),
        '',
        '     Vercel: Settings → Environment Variables, en vink de juiste scope aan',
        '     (Production én Preview) — een variabele die alleen op Production staat,',
        '     ontbreekt in elke preview-deployment.',
        '',
    ];
    const message = lines.join('\n');
    if (isVercelProduction) {
        console.error(message);
        process.exitCode = 1;
    } else {
        console.warn(message);
    }
} else {
    console.log('✓ Omgevingsvariabelen aanwezig');
}
