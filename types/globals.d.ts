declare const __APP_BUILD_ID__: string;

// Vite injects import.meta.env at build time.
// Declaring the interface here avoids `(import.meta as any).env` casts across the codebase.
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly SSR: boolean;
    // Allow additional VITE_* vars without breaking strict typing
    readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
