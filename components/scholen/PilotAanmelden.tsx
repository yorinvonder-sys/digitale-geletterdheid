import React, { useEffect, useState } from 'react';
import { trackEvent } from '../../services/analyticsService';

const PILOT_ENDPOINT =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:54321/functions/v1/submitPilotRequest'
        : `${(import.meta as any).env.VITE_SUPABASE_URL ?? ''}/functions/v1/submitPilotRequest`;

interface PilotFormData {
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

const HIGHLIGHTS: Array<{ title: string; description: string }> = [
    {
        title: '3 maanden gratis',
        description:
            'Volledige toegang tot missies en docent-dashboard. Geen creditcard, geen verborgen kosten, geen automatische verlenging.',
    },
    {
        title: 'Max. 250 leerlingen',
        description:
            'De pilot dekt één schoollocatie tot 250 leerlingen. Groter? We bespreken dat in het kennismakingsgesprek.',
    },
    {
        title: 'AVG-compliant',
        description:
            'Model 4.0 Verwerkersovereenkomst, DPIA-ondersteuning en dataopslag binnen de EER (Nederland).',
    },
    {
        title: 'Live binnen 10 werkdagen',
        description:
            'Korte kennismaking (15 min), docent-onboarding (30 min), daarna starten leerlingen. Wij regelen de set-up.',
    },
];

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

const IconShield = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const PilotAanmelden: React.FC = () => {
    const [formData, setFormData] = useState<PilotFormData>(INITIAL_FORM);
    const [formStartedAt] = useState(() => Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Start een gratis pilot | DGSkills';

        const description = document.querySelector(
            'meta[name="description"]',
        ) as HTMLMetaElement | null;
        const originalDescription = description?.getAttribute('content') ?? null;
        const descriptionEl =
            description ??
            (() => {
                const el = document.createElement('meta');
                el.setAttribute('name', 'description');
                document.head.appendChild(el);
                return el;
            })();
        descriptionEl.setAttribute(
            'content',
            'Vraag een gratis pilot aan voor je school. 3 maanden volledige toegang tot DGSkills, AVG-compliant, live binnen 10 werkdagen. Reactie binnen 2 werkdagen.',
        );

        trackEvent('seo_page_view', { cluster: 'conversion', page: 'pilot-aanmelden' });

        return () => {
            document.title = originalTitle;
            if (originalDescription !== null) {
                descriptionEl.setAttribute('content', originalDescription);
            }
        };
    }, []);

    const handleChange = <K extends keyof PilotFormData>(key: K, value: PilotFormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            trackEvent('pilot_request_start', { rol: formData.rol || 'onbekend' });
            const response = await fetch(PILOT_ENDPOINT, {
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
            const message =
                err instanceof Error && err.message ? err.message : 'Er ging iets mis.';
            setSubmitError(`${message} Probeer het opnieuw of mail ons op info@dgskills.app.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img
                            src="/mascot/pip-logo.webp"
                            alt="DGSkills logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-slate-900">DGSkills</span>
                    </a>
                    <a
                        href="/scholen"
                        className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        Voor scholen
                    </a>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wide mb-4">
                            Gratis pilot · schooljaar 2025-2026
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Start een pilot met DGSkills
                        </h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Drie maanden volledige toegang, AVG-compliant, live binnen tien
                            werkdagen. Vul het formulier in en we nemen binnen twee werkdagen
                            contact met je op.
                        </p>
                    </header>

                    <section aria-label="Belangrijkste pilotvoorwaarden" className="grid gap-4 md:grid-cols-2 mb-12">
                        {HIGHLIGHTS.map((item) => (
                            <div
                                key={item.title}
                                className="flex gap-3 p-5 bg-white rounded-2xl border border-slate-100"
                            >
                                <div className="mt-0.5 text-indigo-600 shrink-0">
                                    <IconCheck />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section
                        id="aanvraagformulier"
                        aria-label="Pilot aanvraagformulier"
                        className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10"
                    >
                        {isSubmitted ? (
                            <div className="text-center py-8">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <IconCheck />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    Aanvraag ontvangen
                                </h2>
                                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                                    We nemen binnen twee werkdagen contact met je op om de pilot in
                                    te plannen. Je ontvangt ook een bevestiging per e-mail.
                                </p>
                                <div className="bg-slate-50 rounded-2xl p-5 text-left max-w-md mx-auto">
                                    <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">
                                        Wat kun je verwachten?
                                    </p>
                                    <ol className="space-y-1 text-sm text-slate-600 list-decimal list-inside">
                                        <li>Kennismakingsgesprek (15 minuten)</li>
                                        <li>Onboarding voor docenten (30 minuten)</li>
                                        <li>Leerlingen starten binnen tien werkdagen</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                aria-busy={isSubmitting}
                            >
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                />

                                <div className="mb-2">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Pilot aanvragen
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Reactie binnen twee werkdagen.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="schoolNaam"
                                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                                    >
                                        Schoolnaam
                                    </label>
                                    <input
                                        id="schoolNaam"
                                        type="text"
                                        required
                                        value={formData.schoolNaam}
                                        onChange={(e) => handleChange('schoolNaam', e.target.value)}
                                        placeholder="Naam van je school"
                                        autoComplete="organization"
                                        className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contactPersoon"
                                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                                    >
                                        Naam
                                    </label>
                                    <input
                                        id="contactPersoon"
                                        type="text"
                                        required
                                        value={formData.contactPersoon}
                                        onChange={(e) =>
                                            handleChange('contactPersoon', e.target.value)
                                        }
                                        placeholder="Je volledige naam"
                                        autoComplete="name"
                                        className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                                    >
                                        E-mail
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="naam@school.nl"
                                        autoComplete="email"
                                        spellCheck={false}
                                        className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="rol"
                                            className="block text-xs font-semibold text-slate-600 mb-1.5"
                                        >
                                            Rol
                                        </label>
                                        <select
                                            id="rol"
                                            value={formData.rol}
                                            onChange={(e) => handleChange('rol', e.target.value)}
                                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 appearance-none"
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
                                        <label
                                            htmlFor="aantalLeerlingen"
                                            className="block text-xs font-semibold text-slate-600 mb-1.5"
                                        >
                                            Leerlingen
                                        </label>
                                        <select
                                            id="aantalLeerlingen"
                                            value={formData.aantalLeerlingen}
                                            onChange={(e) =>
                                                handleChange('aantalLeerlingen', e.target.value)
                                            }
                                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 appearance-none"
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
                                    <label
                                        htmlFor="bericht"
                                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                                    >
                                        Bericht{' '}
                                        <span className="text-slate-400 font-normal">
                                            (optioneel)
                                        </span>
                                    </label>
                                    <textarea
                                        id="bericht"
                                        value={formData.bericht}
                                        onChange={(e) => handleChange('bericht', e.target.value)}
                                        placeholder="Specifieke wensen, tijdlijn of vragen"
                                        rows={3}
                                        maxLength={2000}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400 resize-none min-h-[96px]"
                                    />
                                </div>

                                {submitError && (
                                    <p
                                        role="alert"
                                        className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                                    >
                                        {submitError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold min-h-[48px] rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                                Aanvraag wordt verzonden…
                                            </span>
                                        </>
                                    ) : (
                                        'Pilot aanvragen'
                                    )}
                                </button>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Je gegevens worden verwerkt op grond van precontractueel
                                    contact. Verwerking vindt plaats binnen de EER met passende
                                    AVG-overeenkomsten. Zie de{' '}
                                    <a
                                        href="/ict/privacy/policy"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        privacyverklaring
                                    </a>{' '}
                                    en de{' '}
                                    <a
                                        href="/compliance-hub"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Compliance Hub
                                    </a>
                                    .
                                </p>
                            </form>
                        )}
                    </section>

                    <aside className="mt-12 flex flex-col sm:flex-row items-center gap-3 justify-center text-xs text-slate-500">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                            <IconShield />
                            Geen creditcard nodig
                        </span>
                        <span className="hidden sm:inline text-slate-300">·</span>
                        <span>Reactie binnen twee werkdagen</span>
                        <span className="hidden sm:inline text-slate-300">·</span>
                        <span>Data binnen de EER</span>
                    </aside>
                </div>
            </main>

            <footer className="py-12 text-slate-400 text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Vragen? info@dgskills.app</p>
            </footer>
        </div>
    );
};
