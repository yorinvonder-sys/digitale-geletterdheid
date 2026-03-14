import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dagen

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [show, setShow] = useState(false);
    const [installing, setInstalling] = useState(false);

    // Check of de gebruiker al eerder heeft weggeklikt
    const wasDismissed = useCallback(() => {
        try {
            const ts = localStorage.getItem(DISMISS_KEY);
            if (!ts) return false;
            return Date.now() - Number(ts) < DISMISS_DURATION_MS;
        } catch { return false; }
    }, []);

    useEffect(() => {
        // Niet tonen als al geïnstalleerd (standalone modus)
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (wasDismissed()) return;

        function handleBeforeInstall(e: Event) {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Toon na korte vertraging zodat de pagina eerst laadt
            setTimeout(() => setShow(true), 3000);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }, [wasDismissed]);

    async function handleInstall() {
        if (!deferredPrompt) return;
        setInstalling(true);
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShow(false);
            }
        } catch { /* user cancelled */ }
        setInstalling(false);
        setDeferredPrompt(null);
    }

    function handleDismiss() {
        setShow(false);
        try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    }

    if (!show) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 sm:left-auto sm:right-4 sm:max-w-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <Smartphone size={24} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm">
                        DGSkills installeren
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Installeer als app voor snelle toegang tot je boekhouding en bonnetje-scanner.
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleInstall}
                            disabled={installing}
                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <Download size={14} />
                            {installing ? 'Installeren...' : 'Installeren'}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
