import React, { Component, ErrorInfo, ReactNode } from 'react';

/** Inline SVGs for critical path — avoids loading lucide in initial bundle */
const IconRefreshCw = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 24} height={props.size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
);
const IconAlertTriangle = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 24} height={props.size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
);
const IconLoader2 = (props: { size?: number; className?: string }) => (
    <svg width={props.size ?? 48} height={props.size ?? 48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    isChunkError: boolean;
    isReloading: boolean;
}

// Helper to detect chunk loading errors — only true dynamic‑import / chunk errors.
// Generic network errors ("failed to fetch", "load failed", "cancelled") are
// intentionally excluded because they match Supabase Auth, API calls, etc.
// and cause false‑positive "Update Beschikbaar" loops.
const isChunkLoadError = (error: Error): boolean => {
    const message = error.message?.toLowerCase() || '';
    const name = error.name || '';

    return (
        // Vite / ES dynamic import errors
        message.includes('failed to fetch dynamically imported module') ||
        message.includes('error loading dynamically imported module') ||
        message.includes('importing a module script failed') ||
        // Webpack chunk errors
        message.includes('loading chunk') ||
        message.includes('loading css chunk') ||
        message.includes('chunkloaderror') ||
        name === 'ChunkLoadError' ||
        // MIME type mismatch (server returns HTML 404 for a .js chunk)
        message.includes('is not a valid javascript mime type')
    );
};

// Storage key for tracking reload attempts (ErrorBoundary‑owned)
const CHUNK_ERROR_RELOAD_KEY = 'chunk_error_reload_timestamp';
// Maximum manual reloads before we stop showing the chunk‑error UI
// and fall through to the generic error screen.
const MAX_MANUAL_RELOADS = 2;
const MANUAL_RELOAD_COUNT_KEY = 'eb_manual_reload_count';
const MANUAL_RELOAD_TS_KEY = 'eb_manual_reload_ts';
const MANUAL_RELOAD_WINDOW_MS = 3 * 60 * 1000; // 3 minutes

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
        isChunkError: false,
        isReloading: false
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        const isChunk = isChunkLoadError(error);
        return {
            hasError: true,
            error,
            errorInfo: null,
            isChunkError: isChunk
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });

        // If it's a chunk error, try to auto-reload once
        if (isChunkLoadError(error)) {
            this.handleChunkError();
        }
    }

    private handleChunkError = () => {
        // Do not auto-reload here; repeated chunk errors can cause reload loops.
        // We keep the UI actionable and let the user trigger a hard refresh.
        console.log('Chunk error detected, awaiting manual refresh');
    };

    private clearClientCache = async () => {
        // Best-effort cleanup for stale chunks before reloading.
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map((registration) => registration.unregister()));
            } catch (error) {
                console.warn('Failed to unregister service workers:', error);
            }
        }

        if ('caches' in window) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            } catch (error) {
                console.warn('Failed to clear caches:', error);
            }
        }
    };

    /** Check whether the user has already manually reloaded too many times recently. */
    private hasExceededManualReloads = (): boolean => {
        try {
            const ts = parseInt(sessionStorage.getItem(MANUAL_RELOAD_TS_KEY) || '0', 10);
            const count = parseInt(sessionStorage.getItem(MANUAL_RELOAD_COUNT_KEY) || '0', 10);
            if (!ts || Date.now() - ts > MANUAL_RELOAD_WINDOW_MS) return false;
            return count >= MAX_MANUAL_RELOADS;
        } catch {
            return false;
        }
    };

    private handleManualReload = async () => {
        this.setState({ isReloading: true });

        // Track manual reloads so we can break the loop if the error persists.
        // NOTE: we intentionally do NOT clear the csp‑bootstrap guard keys
        // ('chunk_reload' / 'chunk_reload_count') because that resets the
        // auto‑reload guard and creates an infinite reload loop.
        try {
            const now = Date.now();
            const ts = parseInt(sessionStorage.getItem(MANUAL_RELOAD_TS_KEY) || '0', 10);
            if (!ts || now - ts > MANUAL_RELOAD_WINDOW_MS) {
                sessionStorage.setItem(MANUAL_RELOAD_TS_KEY, String(now));
                sessionStorage.setItem(MANUAL_RELOAD_COUNT_KEY, '1');
            } else {
                const prev = parseInt(sessionStorage.getItem(MANUAL_RELOAD_COUNT_KEY) || '0', 10);
                sessionStorage.setItem(MANUAL_RELOAD_COUNT_KEY, String(prev + 1));
            }
        } catch {
            // Ignore storage errors
        }

        await this.clearClientCache();
        window.location.replace(window.location.href);
    };

    public render() {
        const { hasError, error, errorInfo, isChunkError, isReloading } = this.state;

        if (hasError) {
            // Show a friendly loading state while auto-reloading
            if (isReloading) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 font-sans">
                        <div className="flex flex-col items-center gap-4">
                            <IconLoader2 size={48} className="animate-spin text-indigo-600" />
                            <p className="text-slate-600 font-medium">Nieuwe versie laden...</p>
                        </div>
                    </div>
                );
            }

            // Chunk error specific UI - more friendly and action-oriented.
            // If the user has already retried too many times, fall through
            // to the generic error screen to avoid an infinite loop.
            if (isChunkError && !this.hasExceededManualReloads()) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-8 font-sans">
                        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-indigo-100 text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <IconRefreshCw size={32} className="text-indigo-600" />
                            </div>

                            <h1 className="text-2xl font-black text-slate-800 mb-3">
                                Update Beschikbaar! 🚀
                            </h1>

                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Er is een nieuwe versie van de app uitgebracht.
                                Klik op de knop hieronder om de nieuwste versie te laden.
                            </p>

                            <button
                                onClick={this.handleManualReload}
                                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <IconRefreshCw size={20} />
                                Pagina Verversen
                            </button>

                            <p className="text-[11px] text-slate-400 mt-4">
                                Dit gebeurt wanneer er een update is uitgebracht terwijl je de app gebruikte.
                            </p>
                        </div>
                    </div>
                );
            }

            // Regular error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-8 font-sans">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <IconAlertTriangle size={24} className="text-red-600" />
                            </div>
                            <h1 className="text-2xl font-black text-red-600">Er is iets misgegaan 😔</h1>
                        </div>

                        <p className="text-slate-600 mb-6">
                            De applicatie is vastgelopen. Maak een screenshot van dit bericht en stuur het naar de ontwikkelaar.
                        </p>

                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-96 text-left">
                            <p className="text-red-400 font-mono text-sm font-bold mb-2">
                                {error && error.toString()}
                            </p>
                            <pre className="text-slate-500 font-mono text-xs whitespace-pre-wrap">
                                {errorInfo && errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <IconRefreshCw size={18} />
                            Pagina Verversen
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
