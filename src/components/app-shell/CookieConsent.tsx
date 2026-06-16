import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
    onAccept?: () => void;
    onDecline?: () => void;
    schoolId?: string;
}

const CONSENT_KEY = 'cookie-consent-status';

/** Inline SVG icons keep cookie banner out of the lucide critical path. */
const IconCookie = (props: { className?: string; size?: number }) => (
    <svg
        width={props.size ?? 22}
        height={props.size ?? 22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
    >
        <path d="M12 2a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 1 2 2 8 8 0 1 1-8-8Z" />
        <circle cx="8.5" cy="8.5" r="1" />
        <circle cx="7" cy="13" r="1" />
        <circle cx="13" cy="13.5" r="1" />
    </svg>
);

const IconCheck = (props: { className?: string; size?: number }) => (
    <svg
        width={props.size ?? 14}
        height={props.size ?? 14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
    >
        <path d="m20 6-11 11-5-5" />
    </svg>
);

const IconSettings = (props: { className?: string; size?: number }) => (
    <svg
        width={props.size ?? 14}
        height={props.size ?? 14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 1-2 0 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 1 0-2 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 1 2 0 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 1 0 2 1.65 1.65 0 0 0-.6 1Z" />
    </svg>
);

async function logConsentAudit(action: 'accept' | 'decline', schoolId?: string): Promise<void> {
    try {
        const { logConsentGiven, logConsentWithdrawn } = await import('@/services/auditService');
        if (action === 'accept') {
            await logConsentGiven('analytics', schoolId);
            return;
        }
        await logConsentWithdrawn('analytics', schoolId);
    } catch {
        // Audit logging failures should never block UX.
    }
}

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
        void logConsentAudit('accept', schoolId);
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'declined', timestamp: new Date().toISOString(), version: '2.0' }));
        setIsVisible(false);
        onDecline?.();
        void logConsentAudit('decline', schoolId);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-3 left-3 right-3 md:bottom-4 md:left-auto md:right-4 md:max-w-xs z-[60] animate-fade-in-up">
            <div className="bg-white rounded-[1.25rem] shadow-xl border border-duck-ink/10 overflow-hidden">
                {/* Main Banner */}
                <div className="p-3.5 md:p-4">
                    <div className="flex items-start gap-2.5 md:gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-duck-bgLight rounded-xl flex items-center justify-center shrink-0">
                            <IconCookie className="text-duck-ink" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm md:text-base font-bold text-duck-ink mb-0.5 md:mb-1">Cookies & Privacy</h2>
                            <p className="text-xs md:text-sm text-duck-ink/65 leading-snug md:leading-relaxed">
                                <span className="sm:hidden">Essentieel voor werking, optioneel voor anonieme statistiek.</span>
                                <span className="hidden sm:inline">Wij gebruiken cookies om je ervaring te verbeteren en anonieme statistieken bij te houden.</span>
                                <a href="/ict/privacy/cookies" className="text-duck-ink hover:text-duck-ink/80 underline ml-1">Lees ons cookiebeleid</a>.
                            </p>

                            {/* Expandable Details */}
                            {showDetails && (
                                <div className="mt-3 p-3 bg-duck-bg rounded-xl text-sm space-y-2 border border-duck-ink/10">
                                    <p className="font-medium text-duck-ink">Welke cookies gebruiken wij?</p>
                                    <ul className="space-y-1.5 text-duck-ink/65">
                                        <li className="flex items-center gap-2">
                                            <IconCheck size={14} className="text-duck-ink" />
                                            <span><strong>Essentieel</strong> – Nodig voor inloggen en authenticatie</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <IconSettings size={14} className="text-duck-ink/65" />
                                            <span><strong>Analytics</strong> – Interne klik-analyse voor productverbetering</span>
                                        </li>
                                    </ul>
                                    <p className="text-xs text-duck-ink/65 mt-2">
                                        Essentiële cookies zijn altijd actief en nodig voor de werking van de app.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mt-3 md:mt-4">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="col-span-2 sm:col-span-1 text-xs md:text-sm text-duck-ink/65 hover:text-duck-ink underline underline-offset-2 order-3 sm:order-1 transition-colors"
                        >
                            {showDetails ? 'Minder info' : 'Meer informatie'}
                        </button>
                        <div className="flex-1 hidden sm:block order-2" />
                        <button
                            onClick={handleDecline}
                            className="px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium text-duck-ink bg-duck-bg hover:bg-duck-ink/10 rounded-xl transition-colors order-2 sm:order-3"
                        >
                            Alleen essentieel
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold text-duck-ink bg-duck-acid hover:bg-duck-acid/80 rounded-xl transition-colors order-1 sm:order-4"
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
