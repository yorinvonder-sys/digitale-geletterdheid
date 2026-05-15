import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/services/analyticsService';
import { EDGE_FUNCTION_URL } from '@/services/supabase';

const PILOT_ENDPOINT = `${EDGE_FUNCTION_URL}/submitPilotRequest`;

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

const TIJDLIJN: Array<{ dag: string; titel: string; omschrijving: string }> = [
    { dag: 'Dag 0', titel: 'Aanmelden', omschrijving: 'Jij vult het formulier in' },
    { dag: 'Dag 1-2', titel: 'Contact', omschrijving: 'Wij reageren binnen twee werkdagen' },
    { dag: 'Dag 3-5', titel: 'Kennismaking', omschrijving: '15 min videogesprek' },
    { dag: 'Dag 5-7', titel: 'Onboarding', omschrijving: '30 min met je docententeam' },
    { dag: 'Dag 8-10', titel: 'Live', omschrijving: 'Leerlingen starten' },
];

const CHECKLIST_ITEMS = [
    '3 maanden volledige toegang tot het platform',
    'Max. 250 leerlingen per schoollocatie',
    '20+ AI-missies gekoppeld aan SLO-kerndoelen',
    'Docenten-dashboard met SLO-rapportage',
    'Privacy Officer support tijdens onboarding',
    'Wekelijkse feedbackloop — jij stuurt mee',
];

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
    {
        q: 'Wat kost de pilot?',
        a: 'De pilot is volledig gratis gedurende 3 maanden, met een limiet van 250 leerlingen per schoollocatie. Geen creditcard nodig, geen verplichting tot doorzetten na de pilot.',
    },
    {
        q: 'Hoe lang duurt de onboarding?',
        a: 'Kennismakingsgesprek van 15 minuten, gevolgd door een onboarding van 30 minuten voor docenten. Daarna kunnen leerlingen direct starten. Totale tijdlijn: live binnen 10 werkdagen na akkoord.',
    },
    {
        q: 'Voldoet DGSkills aan AVG en EU AI Act?',
        a: 'Ja. We hebben een volledige DPIA, Verwerkersovereenkomst Model 4.0 voor funderend onderwijs, sub-verwerkerslijst en technische documentatie (Annex IV) conform EU AI Act Art. 11. DGSkills is geclassificeerd als hoog risico onder Annex III punt 3(b). Alle 21 compliance-documenten zijn opvraagbaar via de Compliance Hub.',
    },
    {
        q: 'Waar staat onze data?',
        a: 'Alle data wordt opgeslagen binnen de Europese Economische Ruimte (europe-west4 — Nederland). AI-verwerking via Google Vertex AI in dezelfde regio. Geen data wordt gebruikt voor het trainen van AI-modellen.',
    },
    {
        q: 'Kunnen we onze klassen koppelen aan Magister / Cumlaude / Zermelo?',
        a: 'SSO via Microsoft en Google Workspace is standaard beschikbaar. Koppeling met LAS-systemen zoals Magister verloopt via SAML/OIDC — tijdens onboarding bekijken we samen welke integratie het beste past bij jouw school.',
    },
    {
        q: 'Wat gebeurt er na de pilot?',
        a: 'Na 3 maanden kan je kiezen: stoppen (alle data wordt op verzoek verwijderd binnen 30 dagen), verlengen, of overstappen naar een licentie vanaf €2.000 per schoollocatie per jaar (< €7 per leerling per jaar). Geen automatische verlenging.',
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

        const existingDescription = document.querySelector(
            'meta[name="description"]',
        ) as HTMLMetaElement | null;
        const originalDescription = existingDescription?.getAttribute('content') ?? null;
        const wasCreated = existingDescription === null;
        const descriptionEl = existingDescription ?? document.createElement('meta');
        if (wasCreated) {
            descriptionEl.setAttribute('name', 'description');
            document.head.appendChild(descriptionEl);
        }
        descriptionEl.setAttribute(
            'content',
            'Vraag een gratis pilot aan voor je school. 3 maanden volledige toegang tot DGSkills, AVG-compliant, live binnen 10 werkdagen. Reactie binnen 2 werkdagen.',
        );

        trackEvent('seo_page_view', { cluster: 'conversion', page: 'pilot-aanmelden' });

        return () => {
            document.title = originalTitle;
            if (wasCreated) {
                descriptionEl.remove();
            } else if (originalDescription !== null) {
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

    const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.getElementById('aanvraagformulier')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-lab-cream">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-lab-paper/95 backdrop-blur border-b border-lab-line">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" aria-label="DGSkills homepage">
                        <img
                            src="/logo-lockup.svg"
                            alt="DGSkills"
                            className="h-10 w-auto max-w-[180px] sm:h-12 sm:max-w-[200px] object-contain"
                        />
                    </a>
                    <div className="flex items-center gap-5 text-sm">
                        <a
                            href="/compliance-hub"
                            className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline"
                        >
                            Compliance
                        </a>
                        <a
                            href="/scholen"
                            className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline"
                        >
                            Voor scholen
                        </a>
                        <a
                            href="mailto:info@dgskills.app"
                            className="text-lab-muted hover:text-lab-coral transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-24 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Hero */}
                    <Reveal delay={0}>
                        <header className="mb-12 text-center max-w-3xl mx-auto">
                            <span className="inline-block px-3 py-1 bg-lab-coral/10 text-lab-coral text-[11px] font-bold rounded-full uppercase tracking-wider mb-4">
                                Gratis pilot · schooljaar 2025-2026
                            </span>
                            <h1 className="font-black text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-lab-ink mb-5 leading-tight">
                                Je school live met digitale geletterdheid in{' '}
                                <span className="underline decoration-lab-coral decoration-4 underline-offset-4">
                                    10 werkdagen
                                </span>
                            </h1>
                            <p className="text-lab-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                                Drie maanden volledige toegang, AVG-compliant, max. 250 leerlingen, live binnen tien
                                werkdagen. Vul het formulier in en we nemen binnen twee werkdagen contact met je op.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <a
                                    href="#aanvraagformulier"
                                    onClick={scrollToForm}
                                    className="inline-flex items-center justify-center px-7 min-h-[44px] bg-lab-gold hover:bg-lab-oliveDeep text-lab-ink font-black rounded-full transition-colors text-sm"
                                >
                                    Vraag pilot aan
                                </a>
                                <a
                                    href="/compliance-hub"
                                    className="inline-flex items-center justify-center px-7 min-h-[44px] border border-lab-ink text-lab-ink hover:bg-lab-ink hover:text-lab-paper font-semibold rounded-full transition-colors text-sm"
                                >
                                    Bekijk compliance
                                </a>
                            </div>
                        </header>
                    </Reveal>

                    {/* Trust-row */}
                    <Reveal delay={0.06}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-xs text-lab-muted mb-14 flex-wrap">
                            {[
                                { icon: <IconShield />, label: 'KvK 81819889' },
                                { icon: <IconShield />, label: 'AVG-compliant' },
                                { icon: <IconShield />, label: 'EU AI Act conform' },
                                { icon: <IconShield />, label: 'Data binnen EER' },
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    {i > 0 && (
                                        <span className="hidden sm:inline mx-3 text-lab-line" aria-hidden="true">
                                            ·
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 font-medium">
                                        <span className="text-lab-sage">{item.icon}</span>
                                        {item.label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </Reveal>

                    {/* Two-column layout */}
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">

                        {/* Left column */}
                        <div className="space-y-10">

                            {/* Highlights grid */}
                            <Reveal delay={0.08}>
                                <section aria-label="Belangrijkste pilotvoorwaarden">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {HIGHLIGHTS.map((item) => (
                                            <div
                                                key={item.title}
                                                className="flex gap-3 p-5 bg-lab-paper rounded-2xl border border-lab-line"
                                            >
                                                <div className="mt-0.5 text-lab-sage shrink-0">
                                                    <IconCheck />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lab-ink text-sm mb-1">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-lab-muted">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </Reveal>

                            {/* Tijdlijn */}
                            <Reveal delay={0.10}>
                                <section aria-label="Tijdlijn van aanmelding tot livegang">
                                    <h2 className="text-lg font-black text-lab-ink mb-5">
                                        Van aanmelding tot live: 10 werkdagen
                                    </h2>
                                    {/* Mobile: vertical stack */}
                                    <ol className="md:hidden space-y-4">
                                        {TIJDLIJN.map((stap, i) => (
                                            <li key={stap.dag} className="flex gap-4 items-start">
                                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-lab-paper border border-lab-line flex items-center justify-center text-lab-ink font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-lab-coral mb-0.5">
                                                        {stap.dag}
                                                    </p>
                                                    <p className="font-bold text-lab-ink text-sm">{stap.titel}</p>
                                                    <p className="text-xs text-lab-muted">{stap.omschrijving}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                    {/* Desktop: horizontal with dotted connector */}
                                    <ol className="hidden md:flex items-start gap-0">
                                        {TIJDLIJN.map((stap, i) => (
                                            <li key={stap.dag} className="flex-1 flex flex-col items-center text-center relative">
                                                {i < TIJDLIJN.length - 1 && (
                                                    <div
                                                        className="absolute top-[18px] left-1/2 w-full border-t-2 border-dashed border-lab-line"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <div className="relative z-10 w-9 h-9 rounded-full bg-lab-paper border border-lab-line flex items-center justify-center text-lab-ink font-bold text-sm mb-2">
                                                    {i + 1}
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-lab-coral mb-0.5">
                                                    {stap.dag}
                                                </p>
                                                <p className="font-bold text-lab-ink text-xs">{stap.titel}</p>
                                                <p className="text-[11px] text-lab-muted leading-tight px-1">{stap.omschrijving}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            </Reveal>

                            {/* Checklist */}
                            <Reveal delay={0.12}>
                                <section aria-label="Wat krijg je tijdens de pilot" className="bg-lab-paper rounded-2xl border border-lab-line p-6">
                                    <h2 className="text-sm font-bold text-lab-ink mb-3">
                                        Wat krijg je tijdens de pilot?
                                    </h2>
                                    <ul className="space-y-2.5">
                                        {CHECKLIST_ITEMS.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2.5 text-sm text-lab-bodyDark"
                                            >
                                                <span className="flex-shrink-0 mt-0.5 w-4 h-4 bg-lab-sage/15 text-lab-sage rounded-full flex items-center justify-center">
                                                    <IconCheck />
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </Reveal>

                            {/* Founder-note */}
                            <Reveal delay={0.14}>
                                <div className="bg-lab-paper rounded-2xl border border-lab-line border-l-4 border-l-lab-coral p-6">
                                    <img
                                        src="/logo-lockup.svg"
                                        alt=""
                                        className="h-8 w-auto mb-4"
                                        aria-hidden="true"
                                    />
                                    <blockquote className="text-sm text-lab-bodyDark leading-relaxed mb-4 italic">
                                        "Ik bouw DGSkills als fulltime VO-docent omdat ik mijn eigen leerlingen kwalitatief
                                        AI-onderwijs en digitale geletterdheid wilde geven — en dat in geen enkel bestaand platform
                                        vond. Elke missie test ik eerst zelf in de klas. Dat doe ik liever met jouw leerlingen er
                                        ook bij."
                                    </blockquote>
                                    <p className="text-xs font-bold text-lab-muted">
                                        — Yorin Vonder, oprichter &amp; docent informatica
                                    </p>
                                </div>
                            </Reveal>

                            {/* Compliance callout */}
                            <Reveal delay={0.16}>
                                <div className="bg-lab-creamWarm rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-lab-ink mb-2">
                                        Eerst het compliance-dossier bekijken?
                                    </h3>
                                    <p className="text-sm text-lab-muted mb-4 leading-relaxed">
                                        Onze volledige privacy- en AI Act-documentatie staat open op de Compliance Hub —
                                        inclusief DPA, DPIA, Annex IV en het risicoregister.
                                    </p>
                                    <a
                                        href="/compliance-hub"
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-lab-coral hover:underline"
                                    >
                                        Naar Compliance Hub →
                                    </a>
                                </div>
                            </Reveal>
                        </div>

                        {/* Right column — sticky form */}
                        <div className="lg:sticky lg:top-24">
                            <Reveal delay={0.04}>
                                <section
                                    id="aanvraagformulier"
                                    aria-label="Pilot aanvraagformulier"
                                    className="bg-lab-paper rounded-3xl border border-lab-line p-8 md:p-10 shadow-[0_24px_60px_-30px_rgba(8,40,59,0.18)]"
                                >
                                    {isSubmitted ? (
                                        <div className="text-center py-8">
                                            <div className="w-14 h-14 bg-lab-sage/15 text-lab-sage rounded-full flex items-center justify-center mx-auto mb-5">
                                                <IconCheck />
                                            </div>
                                            <h2 className="text-xl font-bold text-lab-ink mb-2">
                                                Aanvraag ontvangen
                                            </h2>
                                            <p className="text-sm text-lab-muted mb-6 max-w-md mx-auto">
                                                We nemen binnen twee werkdagen contact met je op om de pilot in
                                                te plannen. Je ontvangt ook een bevestiging per e-mail.
                                            </p>
                                            <div className="bg-lab-cream rounded-2xl p-5 text-left max-w-md mx-auto">
                                                <p className="text-xs font-bold text-lab-ink mb-2 uppercase tracking-wide">
                                                    Wat kun je verwachten?
                                                </p>
                                                <ol className="space-y-1 text-sm text-lab-muted list-decimal list-inside">
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
                                            {/* Honeypot */}
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
                                                <h2 className="text-lg font-bold text-lab-ink">
                                                    Pilot aanvragen
                                                </h2>
                                                <p className="text-sm text-lab-muted">
                                                    Reactie binnen twee werkdagen.
                                                </p>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="schoolNaam"
                                                    className="block text-xs font-semibold text-lab-muted mb-1.5"
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
                                                    className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink placeholder:text-lab-mutedSoft"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="contactPersoon"
                                                    className="block text-xs font-semibold text-lab-muted mb-1.5"
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
                                                    className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink placeholder:text-lab-mutedSoft"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-xs font-semibold text-lab-muted mb-1.5"
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
                                                    className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink placeholder:text-lab-mutedSoft"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="rol"
                                                        className="block text-xs font-semibold text-lab-muted mb-1.5"
                                                    >
                                                        Rol
                                                    </label>
                                                    <select
                                                        id="rol"
                                                        value={formData.rol}
                                                        onChange={(e) => handleChange('rol', e.target.value)}
                                                        className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink appearance-none"
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
                                                        className="block text-xs font-semibold text-lab-muted mb-1.5"
                                                    >
                                                        Leerlingen
                                                    </label>
                                                    <select
                                                        id="aantalLeerlingen"
                                                        value={formData.aantalLeerlingen}
                                                        onChange={(e) =>
                                                            handleChange('aantalLeerlingen', e.target.value)
                                                        }
                                                        className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink appearance-none"
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
                                                    className="block text-xs font-semibold text-lab-muted mb-1.5"
                                                >
                                                    Bericht{' '}
                                                    <span className="text-lab-mutedSoft font-normal">
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
                                                    className="w-full px-3.5 py-3 bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-gold/30 focus:border-lab-gold transition-all text-sm text-lab-ink placeholder:text-lab-mutedSoft resize-none min-h-[96px]"
                                                />
                                            </div>

                                            {submitError && (
                                                <p
                                                    role="alert"
                                                    className="text-sm text-white bg-lab-coral border border-lab-coral rounded-lg px-3 py-2"
                                                >
                                                    {submitError}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                aria-busy={isSubmitting}
                                                className="w-full bg-lab-gold hover:bg-lab-oliveDeep text-lab-ink font-black min-h-[48px] rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span
                                                            className="w-4 h-4 border-2 border-lab-ink/30 border-t-lab-ink rounded-full animate-spin"
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

                                            <p className="text-xs text-lab-muted leading-relaxed">
                                                Je gegevens worden verwerkt op grond van precontractueel
                                                contact. Verwerking vindt plaats binnen de EER met passende
                                                AVG-overeenkomsten. Zie de{' '}
                                                <a
                                                    href="/ict/privacy/policy"
                                                    className="text-lab-coral hover:underline"
                                                >
                                                    privacyverklaring
                                                </a>{' '}
                                                en de{' '}
                                                <a
                                                    href="/compliance-hub"
                                                    className="text-lab-coral hover:underline"
                                                >
                                                    Compliance Hub
                                                </a>
                                                .
                                            </p>
                                        </form>
                                    )}
                                </section>
                            </Reveal>
                        </div>
                    </div>

                    {/* FAQ */}
                    <Reveal delay={0.05}>
                        <section className="max-w-3xl mx-auto mt-20" aria-label="Veelgestelde vragen">
                            <h2 className="text-2xl font-black text-lab-ink mb-6 text-center">
                                Veelgestelde vragen
                            </h2>
                            <div className="bg-lab-paper rounded-2xl border border-lab-line px-6">
                                {FAQ_ITEMS.map((item) => (
                                    <details
                                        key={item.q}
                                        className="group border-b border-lab-line last:border-0 py-4"
                                    >
                                        <summary className="cursor-pointer font-medium text-lab-ink text-sm flex items-center justify-between list-none">
                                            <span>{item.q}</span>
                                            <span className="text-lab-mutedSoft text-xs group-open:rotate-45 transition-transform flex-shrink-0 ml-3">
                                                +
                                            </span>
                                        </summary>
                                        <p className="text-sm text-lab-muted mt-2 leading-relaxed">{item.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Final CTA */}
                    <Reveal delay={0.05}>
                        <div className="max-w-3xl mx-auto mt-16 bg-lab-tealDark text-lab-paper rounded-3xl p-10 md:p-14 text-center">
                            <h2 className="text-xl md:text-2xl font-black mb-3">
                                Klaar om je school aan te melden?
                            </h2>
                            <p className="text-lab-paper/70 text-sm mb-8">
                                Of mail Yorin direct op{' '}
                                <a
                                    href="mailto:info@dgskills.app"
                                    className="text-lab-gold font-semibold hover:underline"
                                >
                                    info@dgskills.app
                                </a>
                            </p>
                            <a
                                href="#aanvraagformulier"
                                onClick={scrollToForm}
                                className="inline-flex items-center justify-center bg-lab-gold hover:bg-lab-oliveDeep text-lab-ink font-black px-7 min-h-[48px] rounded-full transition-colors text-sm"
                            >
                                Ga naar het formulier
                            </a>
                        </div>
                    </Reveal>
                </div>
            </main>

            <footer className="py-12 text-lab-mutedSoft text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Vragen? info@dgskills.app</p>
            </footer>
        </div>
    );
};

// ─── Inline animation utilities (copied from ScholenLanding.tsx) ───────────────

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    return reduced;
}

function Reveal({
    children,
    className,
    delay = 0,
    y = 24,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    style?: React.CSSProperties;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (reduceMotion) {
            setInView(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.16 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [reduceMotion]);

    if (reduceMotion) {
        return <div className={className} style={style}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                opacity: inView ? 1 : 0.92,
                transform: inView ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
                transition: `opacity 680ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 680ms cubic-bezier(.22,1,.36,1) ${delay}s`,
                willChange: inView ? 'auto' : 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
