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
        const { logConsentGiven, logConsentWithdrawn } = await import('../services/auditService');
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
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:max-w-sm z-[60] p-4 animate-fade-in-up">
            <div className="bg-lab-paper rounded-2xl shadow-xl border border-lab-line overflow-hidden">
                {/* Main Banner */}
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-lab-creamDeep rounded-xl flex items-center justify-center shrink-0">
                            <IconCookie className="text-lab-sage" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-bold text-lab-ink mb-1">Cookies & Privacy</h2>
                            <p className="text-sm text-lab-muted leading-relaxed">
                                Wij gebruiken cookies om je ervaring te verbeteren en anonieme statistieken bij te houden.
                                <a href="/ict/privacy/cookies" className="text-lab-sage hover:text-lab-tealDark underline ml-1">Lees ons cookiebeleid</a>.
                            </p>

                            {/* Expandable Details */}
                            {showDetails && (
                                <div className="mt-4 p-4 bg-lab-cream rounded-xl text-sm space-y-2 border border-lab-line">
                                    <p className="font-medium text-lab-ink">Welke cookies gebruiken wij?</p>
                                    <ul className="space-y-1.5 text-lab-muted">
                                        <li className="flex items-center gap-2">
                                            <IconCheck size={14} className="text-lab-sage" />
                                            <span><strong>Essentieel</strong> – Nodig voor inloggen en authenticatie</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <IconSettings size={14} className="text-lab-muted" />
                                            <span><strong>Analytics</strong> – Interne klik-analyse voor productverbetering</span>
                                        </li>
                                    </ul>
                                    <p className="text-xs text-lab-muted mt-2">
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
                            className="text-sm text-lab-muted hover:text-lab-ink underline underline-offset-2 order-3 sm:order-1 transition-colors"
                        >
                            {showDetails ? 'Minder info' : 'Meer informatie'}
                        </button>
                        <div className="flex-1 hidden sm:block order-2" />
                        <button
                            onClick={handleDecline}
                            className="px-5 py-2.5 text-sm font-medium text-lab-ink bg-lab-cream hover:bg-lab-line rounded-xl transition-colors order-2 sm:order-3"
                        >
                            Alleen essentieel
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2.5 text-sm font-bold text-lab-ink bg-lab-gold hover:bg-lab-oliveDeep rounded-xl transition-colors order-1 sm:order-4"
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
