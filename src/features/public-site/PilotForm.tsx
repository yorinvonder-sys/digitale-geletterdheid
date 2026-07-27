import React, { useState } from 'react';
import { trackEvent } from '@/services/analyticsService';
import { getEdgeFunctionUrl } from '@/services/supabase';

/*
 * Bewust geen module-constante: getEdgeFunctionUrl() gooit als de Supabase-
 * configuratie ontbreekt, en op moduleniveau zou die throw elke pagina slopen
 * die dit formulier importeert — /pilot én de verhaalpagina. Daarom pas
 * oplossen bij het versturen.
 */
const pilotEndpoint = () => `${getEdgeFunctionUrl()}/submitPilotRequest`;

export interface PilotFormData {
    schoolNaam: string;
    contactPersoon: string;
    email: string;
    rol: string;
    bericht: string;
    aantalLeerlingen: string;
    website: string; // honeypot
}

const INITIAL_FORM: PilotFormData = {
    schoolNaam: '',
    contactPersoon: '',
    email: '',
    rol: '',
    bericht: '',
    aantalLeerlingen: '',
    website: '',
};

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'docent', label: 'Docent' },
    { value: 'ict-coordinator', label: 'ICT-coördinator' },
    { value: 'teamleider', label: 'Teamleider' },
    { value: 'directie', label: 'Directie' },
    { value: 'anders', label: 'Anders' },
];

const STUDENT_RANGE_OPTIONS: Array<{ value: string; label: string }> = [
    { value: '1-50', label: '1 – 50' },
    { value: '50-150', label: '50 – 150' },
    { value: '150-300', label: '150 – 300' },
    { value: '300+', label: '300+' },
];

const FIELD_CLASS =
    'w-full px-3.5 min-h-[44px] bg-duck-bg border border-duck-ink/15 rounded-lg outline-none focus:ring-2 focus:ring-duck-acid/30 focus:border-duck-acid transition-all text-sm text-duck-ink placeholder:text-duck-ink/30';

const LABEL_CLASS = 'block text-xs font-semibold text-duck-ink/60 mb-1.5';

const IconCheck = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * Het aanvraagformulier voor een schoolpilot.
 *
 * Gedeeld door `/pilot` (PilotAanmelden) en de epiloog van de verhaalpagina,
 * zodat de endpoint, de honeypot en de validatie maar op één plek bestaan.
 * De omliggende kaart komt van de aanroepende pagina; deze component levert
 * alleen de inhoud.
 */
export const PilotForm: React.FC<{ idPrefix?: string }> = ({ idPrefix = 'pilot' }) => {
    const [formData, setFormData] = useState<PilotFormData>(INITIAL_FORM);
    const [formStartedAt] = useState(() => Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleChange = <K extends keyof PilotFormData>(key: K, value: PilotFormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            trackEvent('pilot_request_start', { rol: formData.rol || 'onbekend' });
            const response = await fetch(pilotEndpoint(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, submittedAt: formStartedAt }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || 'Versturen mislukt.');
            }

            trackEvent('pilot_request_success', { rol: formData.rol });
            setIsSubmitted(true);
        } catch (err) {
            const message = err instanceof Error && err.message ? err.message : 'Er ging iets mis.';
            setSubmitError(`${message} Probeer het opnieuw of mail ons op info@dgskills.app.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-duck-ink/10 text-duck-ink/60">
                    <IconCheck />
                </div>
                <h2 className="mb-2 text-xl font-bold text-duck-ink">Aanvraag ontvangen</h2>
                <p className="mx-auto mb-6 max-w-md text-sm text-duck-ink/60">
                    We nemen binnen twee werkdagen contact met je op om de pilot in te plannen. Je
                    ontvangt ook een bevestiging per e-mail.
                </p>
                <div className="mx-auto max-w-md rounded-2xl bg-duck-bg p-5 text-left">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-duck-ink">
                        Wat kun je verwachten?
                    </p>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-duck-ink/60">
                        <li>Kennismakingsgesprek (15 minuten)</li>
                        <li>Onboarding voor docenten (30 minuten)</li>
                        <li>Leerlingen starten binnen tien werkdagen</li>
                    </ol>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
            {/* Honeypot */}
            <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            <div className="mb-2">
                <h2 className="text-lg font-bold text-duck-ink">Pilot aanvragen</h2>
                <p className="text-sm text-duck-ink/60">Reactie binnen twee werkdagen.</p>
            </div>

            <div>
                <label htmlFor={`${idPrefix}-schoolNaam`} className={LABEL_CLASS}>
                    Schoolnaam
                </label>
                <input
                    id={`${idPrefix}-schoolNaam`}
                    type="text"
                    required
                    value={formData.schoolNaam}
                    onChange={(e) => handleChange('schoolNaam', e.target.value)}
                    placeholder="Naam van je school"
                    autoComplete="organization"
                    className={FIELD_CLASS}
                />
            </div>

            <div>
                <label htmlFor={`${idPrefix}-contactPersoon`} className={LABEL_CLASS}>
                    Naam
                </label>
                <input
                    id={`${idPrefix}-contactPersoon`}
                    type="text"
                    required
                    value={formData.contactPersoon}
                    onChange={(e) => handleChange('contactPersoon', e.target.value)}
                    placeholder="Je volledige naam"
                    autoComplete="name"
                    className={FIELD_CLASS}
                />
            </div>

            <div>
                <label htmlFor={`${idPrefix}-email`} className={LABEL_CLASS}>
                    E-mail
                </label>
                <input
                    id={`${idPrefix}-email`}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="naam@school.nl"
                    autoComplete="email"
                    spellCheck={false}
                    className={FIELD_CLASS}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor={`${idPrefix}-rol`} className={LABEL_CLASS}>
                        Rol
                    </label>
                    <select
                        id={`${idPrefix}-rol`}
                        value={formData.rol}
                        onChange={(e) => handleChange('rol', e.target.value)}
                        className={`${FIELD_CLASS} appearance-none`}
                    >
                        <option value="">Selecteer</option>
                        {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor={`${idPrefix}-aantalLeerlingen`} className={LABEL_CLASS}>
                        Leerlingen
                    </label>
                    <select
                        id={`${idPrefix}-aantalLeerlingen`}
                        value={formData.aantalLeerlingen}
                        onChange={(e) => handleChange('aantalLeerlingen', e.target.value)}
                        className={`${FIELD_CLASS} appearance-none`}
                    >
                        <option value="">Aantal</option>
                        {STUDENT_RANGE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor={`${idPrefix}-bericht`} className={LABEL_CLASS}>
                    Bericht <span className="font-normal text-duck-ink/30">(optioneel)</span>
                </label>
                <textarea
                    id={`${idPrefix}-bericht`}
                    value={formData.bericht}
                    onChange={(e) => handleChange('bericht', e.target.value)}
                    placeholder="Specifieke wensen, tijdlijn of vragen"
                    rows={3}
                    maxLength={2000}
                    className={`${FIELD_CLASS} min-h-[96px] resize-none py-3`}
                />
            </div>

            {submitError && (
                <p
                    role="alert"
                    className="rounded-lg border border-duck-error bg-duck-error px-3 py-2 text-sm text-white"
                >
                    {submitError}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-duck-acid text-sm font-black text-duck-ink transition-colors hover:bg-duck-acid/80 focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 disabled:opacity-60"
            >
                {isSubmitting ? (
                    <>
                        <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-duck-ink/30 border-t-duck-ink"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Aanvraag wordt verzonden…</span>
                    </>
                ) : (
                    'Pilot aanvragen'
                )}
            </button>

            <p className="text-xs leading-relaxed text-duck-ink/60">
                Je gegevens worden verwerkt op grond van precontractueel contact. Verwerking vindt
                plaats binnen de EER met passende AVG-overeenkomsten. Zie de{' '}
                <a href="/ict/privacy/policy" className="underline hover:no-underline">
                    privacyverklaring
                </a>{' '}
                en de{' '}
                <a href="/compliance-hub" className="underline hover:no-underline">
                    Compliance Hub
                </a>
                .
            </p>
        </form>
    );
};
