import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const IconFileText = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const IconMail = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

type ResourceItemProps = {
    title: string;
    description: string;
    link: string;
    badge: string;
    ctaLabel?: string;
};

const ResourceItem: React.FC<ResourceItemProps> = ({ title, description, link, badge, ctaLabel = 'Bekijk Document' }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors bg-white">
        <div className="flex gap-5 items-start">
            <div className="mt-1 p-3 bg-indigo-50 rounded-xl">
                <IconFileText />
            </div>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{badge}</span>
                </div>
                <p className="text-sm text-slate-500 max-w-md">{description}</p>
            </div>
        </div>
        <a
            href={link}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
            {ctaLabel}
        </a>
    </div>
);

type DocItemProps = {
    id: string;
    title: string;
    description: string;
    reference?: string;
};

const DocItem: React.FC<DocItemProps> = ({ id, title, description, reference }) => {
    const subject = encodeURIComponent(`Compliance-document opvragen: ${title}`);
    const body = encodeURIComponent(
        `Hallo DGSkills-team,\n\nGraag ontvang ik het volgende compliance-document:\n- ${title} (${id})\n\nSchool / organisatie:\nRol:\nDoel (bv. aanbesteding, DPIA-review):\n\nMet vriendelijke groet,`
    );
    const mailto = `mailto:privacy@dgskills.app?subject=${subject}&body=${body}`;

    return (
        <li className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">{id}</span>
                    <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
                </div>
                <p className="text-xs text-slate-500">{description}</p>
                {reference && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">{reference}</p>
                )}
            </div>
            <a
                href={mailto}
                className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                aria-label={`Document ${title} opvragen via e-mail`}
            >
                <IconMail />
                Opvragen
            </a>
        </li>
    );
};

type DocCategoryProps = {
    title: string;
    intro: string;
    docs: DocItemProps[];
};

const DocCategory: React.FC<DocCategoryProps> = ({ title, intro, docs }) => (
    <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{intro}</p>
        <ul className="list-none p-0 m-0">
            {docs.map((d) => (
                <DocItem key={d.id} {...d} />
            ))}
        </ul>
    </section>
);

// === Source-of-truth documentenbibliotheek (21 docs in business/nl-vo/compliance/) ===
const DOC_CATEGORIES: DocCategoryProps[] = [
    {
        title: 'Verwerkersovereenkomst (DPA) & AVG-bijlagen',
        intro: 'Model 4.0 voor funderend onderwijs, inclusief alle bijlagen voor schoolbestuur en FG.',
        docs: [
            {
                id: 'A',
                title: 'Model Verwerkersovereenkomst 4.0 — DGSkills',
                description: 'Standaardmodel van het Privacyconvenant Onderwijs (april 2022), specifiek ingevuld voor DGSkills.',
                reference: 'Gebaseerd op Model Verwerkersovereenkomst Digitale Onderwijsmiddelen en Privacy 4.0',
            },
            {
                id: 'B',
                title: 'Beveiligingsbijlage (Bijlage 2 DPA)',
                description: 'Technische en organisatorische beveiligingsmaatregelen conform Art. 32 AVG.',
            },
            {
                id: 'C',
                title: 'Sub-verwerkerslijst (Bijlage 4 DPA)',
                description: 'Volledig overzicht van sub-verwerkers, data residency en rechtsgrondslag.',
            },
            {
                id: 'D',
                title: 'Handleiding Verwerkersovereenkomst — voor scholen',
                description: 'Stap-voor-stap toelichting voor schoolbestuur, ICT-coordinator, privacy-contactpersoon en inkoop.',
            },
            {
                id: 'E',
                title: 'Privacybijsluiter (Bijlage 1 DPA)',
                description: 'Begrijpelijke uitleg voor docenten, schoolleiding en ouders/verzorgers.',
            },
            {
                id: 'DPIA',
                title: 'DPIA DGSkills — volledig rapport',
                description: 'Data Protection Impact Assessment conform Art. 35 AVG.',
                reference: 'Verordening EU 2016/679',
            },
            {
                id: 'DPIA-T',
                title: 'DPIA Support Template (schoolinvulling)',
                description: 'Invulmodel voor scholen die een eigen DPIA-aanvulling willen opstellen.',
            },
            {
                id: 'DPA-T',
                title: 'DPA Template Outline (invulmodel)',
                description: 'Schoolzijdig invulmodel voor partijen, looptijd en reikwijdte.',
            },
            {
                id: 'DFO',
                title: 'Datastroomoverzicht Template',
                description: 'Inzichtelijk maken welke gegevens worden verwerkt, waarom, hoe lang en met welke beveiliging.',
            },
        ],
    },
    {
        title: 'EU AI Act — HIGH RISK (Annex III 3b)',
        intro: 'Documentatie voor de hoog-risico classificatie. Deadline hoog-risico verplichtingen: 2 augustus 2026.',
        docs: [
            {
                id: 'ANNEX-IV',
                title: 'Annex IV — Technische documentatie',
                description: 'Technische documentatie conform Verordening (EU) 2024/1689 Art. 11 + Bijlage IV.',
            },
            {
                id: 'CONF',
                title: 'Conformiteitsbeoordelingsplan EU AI Act',
                description: 'Plan voor de conformiteitsbeoordeling richting de 2 augustus 2026 deadline.',
            },
            {
                id: 'RISK-9',
                title: 'Risicoregister (Art. 9 AI Act)',
                description: 'Risk management system conform Art. 9 — geïdentificeerde risico’s en mitigaties.',
            },
            {
                id: 'MATRIX',
                title: 'Toetsmatrix AVG & AI Act',
                description: 'Bevestigt de hoog-risico classificatie (Annex III punt 3b — beoordeling leerresultaten).',
                reference: 'Correctie 15-03-2026: van “beperkt risico” naar hoog risico',
            },
        ],
    },
    {
        title: 'Verwerkingen, audit & rapportage',
        intro: 'Wat we verwerken, wat de laatste audit vond en hoe we dat rapporteren.',
        docs: [
            {
                id: 'VR',
                title: 'Verwerkingsregister (Art. 30 AVG)',
                description: 'Register van verwerkingsactiviteiten. Vertrouwelijk — intern & toezichthouder.',
            },
            {
                id: 'VO-R',
                title: 'Verwerkersovereenkomsten-rapport',
                description: 'Inventarisatie en analyse van DPA’s voor alle verwerkers (incl. Vertex AI migratie).',
            },
            {
                id: 'AUDIT',
                title: 'Compliance Audit Rapport — DGSkills',
                description: 'Statusoverzicht van de compliance-audit op basis van de actuele productie-implementatie.',
            },
        ],
    },
    {
        title: 'Privacy & leesbare uitleg',
        intro: 'De formele verklaring plus een toegankelijke variant voor schoolteams.',
        docs: [
            {
                id: 'PV',
                title: 'Privacyverklaring DGSkills.app',
                description: 'Formele privacyverklaring conform Art. 13/14 AVG.',
            },
            {
                id: 'PXS',
                title: 'Privacy-uitleg voor scholen (begrijpelijke versie)',
                description: 'Korte, klare uitleg voor schoolleiding, docenten en inkoop.',
            },
        ],
    },
    {
        title: 'Governance, juridisch & didactiek',
        intro: 'Governance-setup, algemene voorwaarden en didactische onderbouwing.',
        docs: [
            {
                id: 'FG',
                title: 'FG / DPO Adviesrapport',
                description: 'Analyse van de FG-verplichting en aanbevelingen voor DGSkills. Conceptadvies — geen juridisch advies.',
            },
            {
                id: 'AV',
                title: 'Algemene Voorwaarden DGSkills',
                description: 'AV van toepassing op het gebruik van dgskills.app (versie 1.0, 28 maart 2026).',
            },
            {
                id: 'SLO-J1',
                title: 'SLO Kerndoelen Mapping — Leerjaar 1',
                description: 'Mapping van alle missies naar de SLO Definitieve Conceptkerndoelen Digitale Geletterdheid (sept. 2025).',
            },
        ],
    },
];

export const ComplianceHub: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Compliance Hub & Privacy Dossier | DGSkills';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Centrale hub voor alle compliance-assets van DGSkills. Download of vraag de Verwerkersovereenkomst (DPA), DPIA, EU AI Act Annex IV, verwerkingsregister en alle privacy-documentatie op.');

        trackEvent('seo_page_view', { cluster: 'compliance', page: 'compliance-hub' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/mascot/pip-logo.webp" alt="DGSkills logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-slate-900">DGSkills</span>
                    </a>
                    <a href="/ict" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">ICT Dashboard</a>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Compliance Hub</h1>
                        <p className="text-slate-600 mb-2">Alle juridische en technische documentatie voor schoolbesturen, FG’s en ICT-coordinatoren op één plek.</p>
                        <p className="text-sm text-slate-500">
                            <strong>Classificatie:</strong> DGSkills is een hoog-risico AI-systeem conform EU AI Act Annex III punt 3(b) — AI voor beoordeling van leerresultaten. Deadline hoog-risico verplichtingen: 2 augustus 2026.
                        </p>
                    </div>

                    {/* === Portal tiles (directe pagina's) === */}
                    <section className="mb-16">
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Directe toegang</h2>
                        <div className="grid gap-4">
                            <ResourceItem
                                title="AI-Compliance Checklist"
                                description="Praktische checklist met AVG, AI Act (incl. hoog-risico verplichtingen) en didactische eisen voor VO-scholen."
                                link="/compliance/checklist"
                                badge="Handig"
                            />
                            <ResourceItem
                                title="SLO-Dekkingsrapport (Voorbeeld)"
                                description="Voorbeeld van een geautomatiseerd rapport per kerndoel (21A–23C en VSO 18A–20B) voor verantwoording aan de inspectie."
                                link="/compliance/slo-rapport"
                                badge="Demo"
                            />
                            <ResourceItem
                                title="Verwerkersovereenkomst (DPA)"
                                description="Het standaardmodel 4.0 voor het funderend onderwijs, specifiek ingevuld voor DGSkills."
                                link="/ict/privacy/policy"
                                badge="v4.1"
                            />
                            <ResourceItem
                                title="DPIA Support Document"
                                description="Ondersteuning bij het uitvoeren van een Data Protection Impact Assessment voor jouw school."
                                link="/ict/privacy"
                                badge="PDF"
                            />
                            <ResourceItem
                                title="AI Act Transparantie Rapport"
                                description="Gedetailleerde uitleg over AI-gebruik, datastromen en menselijke controle (Art. 13 + 50 compliance)."
                                link="/ict/privacy/ai"
                                badge="Nieuw"
                            />
                            <ResourceItem
                                title="Technische Whitepaper"
                                description="Inzicht in architectuur, SSO-integraties, data-opslag in de EER en beveiligingsprotocollen."
                                link="/ict/technisch"
                                badge="v1.0"
                            />
                            <ResourceItem
                                title="SLA & Support Overzicht"
                                description="Gegarandeerde responstijden, uptime-garanties en escalatie-procedures."
                                link="/ict/support"
                                badge="SLA"
                            />
                        </div>
                    </section>

                    {/* === Volledige documentatiebibliotheek === */}
                    <section className="mb-16">
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Volledige documentatiebibliotheek</h2>
                            <p className="text-slate-600 text-sm">
                                Alle 21 bronddocumenten uit ons privacy-dossier. Vraag een specifiek document per e-mail op via de knop ernaast. Voor formele DPA-tekening of aanbestedingen: raadpleeg altijd onze Privacy Officer.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            {DOC_CATEGORIES.map((cat) => (
                                <DocCategory key={cat.title} {...cat} />
                            ))}
                        </div>
                    </section>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                        <h2 className="text-xl font-bold mb-4">Vragen voor onze Privacy Officer?</h2>
                        <p className="text-slate-500 text-sm mb-6">Heb je specifieke vragen over de AVG, AI Act of integratie met jouw school-LVS? Ons team staat klaar om te helpen.</p>
                        <a href="mailto:privacy@dgskills.app" className="text-indigo-600 font-bold hover:underline">privacy@dgskills.app</a>
                    </div>
                </div>
            </main>

            <footer className="py-12 text-slate-400 text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Privacy & Compliance</p>
            </footer>
        </div>
    );
};
