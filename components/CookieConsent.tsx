import React, { useState, useEffect } from 'react';
import { Cookie, Check, Settings } from 'lucide-react';
import { logConsentGiven, logConsentWithdrawn } from '../services/auditService';

interface CookieConsentProps {
    onAccept?: () => void;
    onDecline?: () => void;
    schoolId?: string;
}

const CONSENT_KEY = 'cookie-consent-status';

export const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline, schoolId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'accepted', timestamp: new Date().toISOString(), version: '2.0' }));
        setIsVisible(false);
        onAccept?.();
        logConsentGiven('analytics', schoolId).catch(() => { /* audit resilient when unauthenticated */ });
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'declined', timestamp: new Date().toISOString(), version: '2.0' }));
        setIsVisible(false);
        onDecline?.();
        logConsentWithdrawn('analytics', schoolId).catch(() => { /* audit resilient when unauthenticated */ });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:max-w-sm z-50 p-4 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
                {/* Main Banner */}
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Cookie className="text-slate-500" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-bold text-slate-900 mb-1">Cookies & Privacy</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Wij gebruiken cookies om je ervaring te verbeteren en anonieme statistieken bij te houden.
                                <a href="/ict/privacy/cookies" className="text-indigo-700 hover:text-indigo-800 underline ml-1">Lees ons cookiebeleid</a>.
                            </p>

                            {/* Expandable Details */}
                            {showDetails && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm space-y-2 border border-slate-100">
                                    <p className="font-medium text-slate-700">Welke cookies gebruiken wij?</p>
                                    <ul className="space-y-1.5 text-slate-600">
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-emerald-500" />
                                            <span><strong>Essentieel</strong> – Nodig voor inloggen en authenticatie</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Settings size={14} className="text-slate-500" />
                                            <span><strong>Analytics</strong> – Interne klik-analyse voor productverbetering</span>
                                        </li>
                                    </ul>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Essentiële cookies zijn altijd actief en nodig voor de werking van de app.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-2 order-3 sm:order-1 transition-colors"
                        >
                            {showDetails ? 'Minder info' : 'Meer informatie'}
                        </button>
                        <div className="flex-1 hidden sm:block order-2" />
                        <button
                            onClick={handleDecline}
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors order-2 sm:order-3"
                        >
                            Alleen essentieel
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors order-1 sm:order-4"
                        >
                            Alles accepteren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Check if user has given consent
 */
export const hasAnalyticsConsent = (): boolean => {
    if (typeof window === 'undefined') return false;
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    // Backward compat: support old 'accepted' string AND new JSON format
    if (raw === 'accepted') return true;
    try {
        const parsed = JSON.parse(raw);
        return parsed?.status === 'accepted';
    } catch {
        return false;
    }
};

/**
 * Reset consent (for testing or privacy modal)
 */
export const resetConsent = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CONSENT_KEY);
};
