import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/services/analyticsService';

const PRIVACY_EMAIL = 'privacy@dgskills.app';

const IconFileText = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lab-coral">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const IconMail = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lab-muted">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

type DocAccess =
    | { type: 'link'; href: string; cta?: string; external?: boolean }
    | { type: 'request'; subject: string };

interface ComplianceDoc {
    id: string;
    title: string;
    description: string;
    badge: string;
    access: DocAccess;
}

interface ComplianceSection {
    id: string;
    title: string;
    intro: string;
    icon: React.ReactNode;
    docs: ComplianceDoc[];
}

const SECTIONS: ComplianceSection[] = [
    {
        id: 'juridisch',
        title: 'Juridisch & Privacy',
        intro: 'Documenten die voor elke school beschikbaar moeten zijn voor DPIA-processen en inkoop.',
        icon: <IconFileText />,
        docs: [
            {
                id: 'privacyverklaring',
                title: 'Privacyverklaring',
                description: 'Hoe DGSkills persoonsgegevens van leerlingen en docenten verwerkt, op welke grondslag en hoe lang.',
                badge: 'Actueel',
                access: { type: 'link', href: '/ict/privacy/policy' },
            },
            {
                id: 'cookies',
                title: 'Cookiestatement',
                description: 'Welke cookies en vergelijkbare technieken DGSkills gebruikt en waarom.',
                badge: 'Actueel',
                access: { type: 'link', href: '/ict/privacy/cookies' },
            },
            {
                id: 'ai-transparantie',
                title: 'AI Act Transparantieverklaring',
                description: 'Uitleg over AI-gebruik, datastromen, menselijke controle en logging (Art. 50 + Art. 13 EU AI Act).',
                badge: 'Nieuw',
                access: { type: 'link', href: '/ict/privacy/ai' },
            },
            {
                id: 'dpa',
                title: 'Model Verwerkersovereenkomst (DPA)',
                description: 'Standaardmodel 4.0 voor het funderend onderwijs, specifiek ingevuld voor DGSkills.',
                badge: 'v4.0',
                access: { type: 'link', href: '/compliance/dpa-dgskills-v4.html', external: true },
            },
            {
                id: 'algemene-voorwaarden',
                title: 'Algemene Voorwaarden',
                description: 'Algemene leveringsvoorwaarden DGSkills. Concept — wordt momenteel door jurist beoordeeld voordat hij publiek gepubliceerd wordt.',
                badge: 'Concept',
                access: { type: 'request', subject: 'Aanvraag: Algemene Voorwaarden (concept)' },
            },
        ],
    },
    {
        id: 'technisch',
        title: 'Technisch & Security',
        intro: 'Architectuur, databeveiliging, DPIA-ondersteuning en SLA voor ICT-beheer en FG.',
        icon: <IconFileText />,
        docs: [
            {
                id: 'technische-whitepaper',
                title: 'Technische Whitepaper',
                description: 'Architectuur, SSO-integraties, data-opslag in europe-west4 en beveiligingsprotocollen.',
                badge: 'v1.0',
                access: { type: 'link', href: '/ict/technisch' },
            },
            {
                id: 'sla',
                title: 'SLA & Support Overzicht',
                description: 'Gegarandeerde responstijden, uptime-doelen en escalatieprocedures.',
                badge: 'SLA',
                access: { type: 'link', href: '/ict/support' },
            },
            {
                id: 'school-compliance-guide',
                title: 'Compliance-gids voor scholen',
                description: 'Praktische gids die stap voor stap uitlegt wat een school zelf moet regelen bij ingebruikname van DGSkills.',
                badge: 'Gids',
                access: { type: 'link', href: '/compliance/school-compliance-guide.html', external: true },
            },
            {
                id: 'dpia-support',
                title: 'DPIA Support Document',
                description: 'Ondersteunende informatie voor de school-DPIA: datacategorieën, verwerkingsdoelen en risico-inschattingen.',
                badge: 'PDF',
                access: { type: 'link', href: '/compliance/dpia-support-dgskills-v1.html', external: true },
            },
        ],
    },
    {
        id: 'onderwijs',
        title: 'Onderwijs & Verantwoording',
        intro: 'Middelen voor curriculumverantwoording en compliance-zelfcontrole.',
        icon: <IconFileText />,
        docs: [
            {
                id: 'checklist',
                title: 'AI-Compliance Checklist',
                description: 'Praktische checklist om te controleren of jouw school voldoet aan de AVG en EU AI Act bij gebruik van DGSkills.',
                badge: 'Handig',
                access: { type: 'link', href: '/compliance/checklist' },
            },
            {
                id: 'slo-rapport',
                title: 'SLO-Dekkingsrapport (voorbeeld)',
                description: 'Hoe een geautomatiseerd curriculumrapport eruit ziet voor verantwoording aan inspectie en schoolleiding.',
                badge: 'Demo',
                access: { type: 'link', href: '/compliance/slo-rapport' },
            },
        ],
    },
    {
        id: 'op-aanvraag',
        title: 'Op aanvraag voor ICT-coördinatoren & FG',
        intro: 'Deze documenten bevatten interne beoordelingen of gedetailleerde risico-informatie. Ze worden op aanvraag gedeeld met ICT-coördinatoren, FG’s en schoolbestuurders, onder geheimhouding.',
        icon: <IconMail />,
        docs: [
            {
                id: 'legal-matrix',
                title: 'Legal Matrix (AVG + AI Act)',
                description: 'Toetsmatrix per verplichting uit de AVG en EU AI Act, met de invulling die DGSkills daaraan geeft.',
                badge: 'Matrix',
                access: { type: 'request', subject: 'Aanvraag: Legal Matrix (AVG + AI Act)' },
            },
            {
                id: 'conformiteitsplan',
                title: 'EU AI Act Conformiteitsplan',
                description: 'Plan hoe DGSkills toewerkt naar volledige naleving van de hoog-risico verplichtingen per 2 augustus 2026.',
                badge: 'AI Act',
                access: { type: 'request', subject: 'Aanvraag: EU AI Act Conformiteitsplan' },
            },
            {
                id: 'annex-iv',
                title: 'Annex IV — Technische Documentatie',
                description: 'Technische documentatie zoals vereist door EU AI Act Annex IV voor hoog-risico AI-systemen in het onderwijs.',
                badge: 'Annex IV',
                access: { type: 'request', subject: 'Aanvraag: Annex IV technische documentatie' },
            },
            {
                id: 'verwerkingsregister',
                title: 'Verwerkingsregister (Art. 30 AVG)',
                description: 'Register van verwerkingsactiviteiten: welke gegevens, waarvoor, hoe lang, met welke subverwerkers.',
                badge: 'Art. 30',
                access: { type: 'request', subject: 'Aanvraag: Verwerkingsregister' },
            },
            {
                id: 'risicoregister',
                title: 'Risicoregister EU AI Act (Art. 9)',
                description: 'Geïdentificeerde risico’s voor leerlingen, de genomen maatregelen en het proces voor periodieke herbeoordeling.',
                badge: 'Risk',
                access: { type: 'request', subject: 'Aanvraag: Risicoregister AI Act' },
            },
            {
                id: 'beveiligingsbijlage',
                title: 'Beveiligingsbijlage bij DPA',
                description: 'Bijlage B bij de Verwerkersovereenkomst met concrete technische en organisatorische maatregelen.',
                badge: 'Annex B',
                access: { type: 'request', subject: 'Aanvraag: Beveiligingsbijlage DPA' },
            },
            {
                id: 'subverwerkers',
                title: 'Sub-verwerkerslijst',
                description: 'Actueel overzicht van subverwerkers die DGSkills inzet, inclusief doel en vestigingsland.',
                badge: 'Annex C',
                access: { type: 'request', subject: 'Aanvraag: Sub-verwerkerslijst' },
            },
            {
                id: 'dpa-handleiding',
                title: 'Handleiding Verwerkersovereenkomst',
                description: 'Toelichting voor scholen bij het ondertekenen van de DPA: welke keuzes je maakt en wat ze betekenen.',
                badge: 'Gids',
                access: { type: 'request', subject: 'Aanvraag: DPA-handleiding' },
            },
            {
                id: 'privacybijsluiter',
                title: 'Privacybijsluiter',
                description: 'Beknopte bijsluiter met alle PII-categorieën en bewaartermijnen voor ouders en leerlingen.',
                badge: 'Bijsluiter',
                access: { type: 'request', subject: 'Aanvraag: Privacybijsluiter' },
            },
            {
                id: 'fg-dpo-advies',
                title: 'FG/DPO Adviesrapport',
                description: 'Advies vanuit de functionaris gegevensbescherming met aanbevelingen en opvolging.',
                badge: 'Advies',
                access: { type: 'request', subject: 'Aanvraag: FG/DPO Adviesrapport' },
            },
            {
                id: 'audit-rapport',
                title: 'Compliance Audit Rapport',
                description: 'Meest recente interne audit van het platform op AVG- en AI Act-naleving, inclusief actiepunten.',
                badge: '2026',
                access: { type: 'request', subject: 'Aanvraag: Audit Rapport 2026' },
            },
            {
                id: 'dpia-compleet',
                title: 'DPIA DGSkills (volledig)',
                description: 'Volledige Data Protection Impact Assessment voor het DGSkills-platform.',
                badge: 'DPIA',
                access: { type: 'request', subject: 'Aanvraag: Volledige DPIA DGSkills' },
            },
        ],
    },
];

const buildRequestHref = (subject: string): string =>
    `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent(subject)}`;

const TOTAL_DOCS = SECTIONS.reduce((acc, s) => acc + s.docs.length, 0);

const DocRow: React.FC<{ doc: ComplianceDoc; sectionId: string }> = ({ doc, sectionId }) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        };
    }, []);

    const handleClick = () => {
        trackEvent('ict_document_download', {
            page: 'compliance-hub',
            cta: `${sectionId}:${doc.id}`,
            type: doc.access.type,
        });
    };

    const handleCopyEmail = async () => {
        trackEvent('ict_document_download', {
            page: 'compliance-hub',
            cta: `${sectionId}:${doc.id}:copy`,
            type: 'email-copy',
        });
        try {
            await navigator.clipboard.writeText(PRIVACY_EMAIL);
            if (timerRef.current !== null) clearTimeout(timerRef.current);
            setCopied(true);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard not available — email address is still visible
        }
    };

    const baseWrapperClasses =
        'flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border border-lab-line hover:border-lab-coral/30 transition-colors bg-lab-paper';

    const baseButtonClasses =
        'inline-flex items-center justify-center px-5 py-2.5 bg-lab-paper border border-lab-line text-lab-muted font-semibold text-sm rounded-lg hover:bg-lab-cream transition-colors whitespace-nowrap';

    let href: string;
    let cta: string;
    let externalProps: { target?: '_blank'; rel?: 'noopener noreferrer' } = {};

    switch (doc.access.type) {
        case 'link':
            href = doc.access.href;
            cta = doc.access.cta ?? 'Bekijk document';
            if (doc.access.external) {
                externalProps = { target: '_blank', rel: 'noopener noreferrer' };
            }
            break;
        case 'request':
            href = buildRequestHref(doc.access.subject);
            cta = 'Vraag aan via e-mail';
            break;
        default:
            href = '#';
            cta = '';
    }

    return (
        <div className={baseWrapperClasses}>
            <div className="flex gap-5 items-start">
                <div className="mt-1 p-3 bg-lab-coral/10 rounded-xl">
                    <IconFileText />
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-bold text-lab-ink">{doc.title}</h3>
                        <span className="px-2 py-0.5 bg-lab-coral/10 text-lab-coral text-[10px] font-bold rounded uppercase">
                            {doc.badge}
                        </span>
                    </div>
                    <p className="text-sm text-lab-muted max-w-xl">{doc.description}</p>
                </div>
            </div>
            <div className="flex flex-col md:items-end gap-1">
                <a href={href} className={baseButtonClasses} onClick={handleClick} {...externalProps}>
                    {cta}
                </a>
                {doc.access.type === 'request' && (
                    <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label={copied ? 'E-mailadres gekopieerd' : 'Kopieer e-mailadres'}
                        className="text-[11px] text-lab-mutedSoft hover:text-lab-coral transition-colors min-h-[24px] px-1 py-1"
                    >
                        <span aria-live="polite">{copied ? 'Gekopieerd!' : PRIVACY_EMAIL}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const Section: React.FC<{ section: ComplianceSection; index: number }> = ({ section, index }) => (
    <Reveal delay={index * 0.05}>
        <section id={section.id} className="mb-14">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-lab-coral/10 rounded-lg">{section.icon}</div>
                <h2 className="text-xl font-black text-lab-ink">{section.title}</h2>
            </div>
            <p className="text-sm text-lab-muted mb-5 max-w-2xl">{section.intro}</p>
            <div className="grid gap-4">
                {section.docs.map((doc) => (
                    <DocRow key={doc.id} doc={doc} sectionId={section.id} />
                ))}
            </div>
        </section>
    </Reveal>
);

export const ComplianceHub: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Compliance Hub & Privacy Dossier | DGSkills';

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
            'Centrale hub voor alle compliance-assets van DGSkills. Privacyverklaring, Verwerkersovereenkomst, AI Act transparantie, DPIA ondersteuning en documenten op aanvraag voor ICT-coördinatoren.',
        );

        trackEvent('seo_page_view', { cluster: 'compliance', page: 'compliance-hub' });

        return () => {
            document.title = originalTitle;
            if (originalDescription !== null) {
                descriptionEl.setAttribute('content', originalDescription);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-lab-cream text-lab-ink font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-lab-paper/95 backdrop-blur border-b border-lab-line">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center" aria-label="DGSkills homepage">
                        <img src="/logo-lockup.webp" alt="DGSkills" className="h-10 w-auto max-w-[180px] sm:h-12 sm:max-w-[200px] object-contain" />
                    </a>
                    <div className="flex items-center gap-5 text-sm">
                        <a href="/scholen" className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline">Voor scholen</a>
                        <a href="/pilot" className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline">Pilot</a>
                        <a href="mailto:info@dgskills.app" className="text-lab-muted hover:text-lab-coral transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <Reveal delay={0}>
                        <div className="mb-10">
                            <span className="inline-block px-3 py-1 bg-lab-coral/10 text-lab-coral text-[11px] font-bold rounded-full uppercase tracking-[0.14em] mb-4">
                                {TOTAL_DOCS} documenten · bijgewerkt {new Date().getFullYear()}
                            </span>
                            <h1 className="font-black text-balance text-3xl sm:text-4xl md:text-5xl text-lab-ink mb-4">
                                Compliance Hub
                            </h1>
                            <p className="text-lab-muted max-w-2xl font-sans text-base leading-relaxed">
                                Alle juridische, technische en didactische documentatie voor
                                schoolbesturen, functionarissen gegevensbescherming en ICT-coördinatoren
                                op één plek. Publieke documenten zijn direct beschikbaar; gevoelige
                                interne rapporten delen we op aanvraag onder geheimhouding.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={0.04}>
                        <nav aria-label="Snelnavigatie compliance" className="mb-12 p-4 bg-lab-paper rounded-2xl border border-lab-line">
                            <p className="text-[11px] font-bold uppercase text-lab-mutedSoft mb-3">Snel naar</p>
                            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                                {SECTIONS.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className="text-lab-muted hover:text-lab-coral font-medium transition-colors"
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Reveal>

                    {SECTIONS.map((section, index) => (
                        <Section key={section.id} section={section} index={index} />
                    ))}

                    <Reveal delay={0.05}>
                        <div className="bg-lab-paper p-8 rounded-2xl border border-lab-line shadow-[0_24px_60px_-30px_rgba(8,40,59,0.10)] text-center">
                            <h2 className="font-black text-2xl md:text-3xl text-lab-ink mb-4">Vragen voor onze Privacy Officer?</h2>
                            <p className="text-lab-muted text-sm mb-6 max-w-xl mx-auto leading-relaxed">
                                Heb je specifieke vragen over de AVG, de EU AI Act of integratie met
                                jouw school-LVS? Onze FG/privacy officer reageert binnen twee
                                werkdagen.
                            </p>
                            <a
                                href={`mailto:${PRIVACY_EMAIL}`}
                                className="text-lab-coral hover:text-lab-coral/80 font-bold"
                            >
                                {PRIVACY_EMAIL}
                            </a>
                        </div>
                    </Reveal>
                </div>
            </main>

            <footer className="py-12 text-lab-mutedSoft text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Privacy &amp; Compliance</p>
            </footer>
        </div>
    );
};

// ─── Inline animation utilities ───────────────────────────────────────────────

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
