import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';
import { PilotRequestForm } from '../scholen/PilotRequestForm';

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconShield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconSparkles = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
);

interface BenefitProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Benefit: React.FC<BenefitProps> = ({ icon, title, description }) => (
    <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#D97757]/10 text-[#D97757] flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
    </div>
);

interface FaqItemProps {
    q: string;
    a: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ q, a }) => (
    <details className="group border-b border-slate-100 last:border-0 py-4">
        <summary className="cursor-pointer font-medium text-slate-900 text-sm flex items-center justify-between list-none">
            <span>{q}</span>
            <span className="text-slate-400 text-xs group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{a}</p>
    </details>
);

export const PilotAanmelden: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Aanmelden voor de gratis pilot | DGSkills';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Meld je school aan voor de gratis pilot van DGSkills — 3 maanden digitale geletterdheid voor VO, AVG-compliant, live binnen 10 werkdagen.');
        setMeta('name', 'robots', 'index,follow');
        setMeta('property', 'og:title', 'Start een gratis pilot | DGSkills');
        setMeta('property', 'og:description', 'Drie maanden gratis digitale geletterdheid voor je school. AVG-compliant, SLO-gekoppeld, live binnen 10 werkdagen.');
        setMeta('property', 'og:type', 'website');

        trackEvent('seo_page_view', { cluster: 'conversion', page: 'pilot-aanmelden' });

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
                    <div className="flex items-center gap-5 text-sm">
                        <a href="/compliance-hub" className="text-slate-500 hover:text-indigo-600 transition-colors hidden sm:inline">Compliance</a>
                        <a href="/scholen" className="text-slate-500 hover:text-indigo-600 transition-colors hidden sm:inline">Voor scholen</a>
                        <a href="mailto:info@dgskills.app" className="text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-14 max-w-3xl mx-auto">
                        <span className="inline-block px-3 py-1 bg-[#D97757]/10 text-[#D97757] text-[11px] font-bold uppercase tracking-wider rounded-full mb-4">
                            Gratis pilot — schooljaar 2025/2026
                        </span>
                        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-900 mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Start binnen 10 werkdagen met digitale geletterdheid op jouw school
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                            Drie maanden gratis, max. 250 leerlingen, volledige SLO-koppeling (21A–23C + VSO 18A–20B), AVG-compliant,
                            en een dossier dat het schoolbestuur en de FG direct kunnen toetsen.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        {/* Left: benefits + trust */}
                        <div>
                            <div className="space-y-7 mb-10">
                                <Benefit
                                    icon={<IconSparkles />}
                                    title="Geen inhoud bouwen — alles staat klaar"
                                    description="20+ AI-missies, automatische SLO-rapportage, docenten-dashboard en klasmanagement. Jij kiest wanneer je start."
                                />
                                <Benefit
                                    icon={<IconClock />}
                                    title="Livegang binnen 10 werkdagen na akkoord"
                                    description="Kennismakingsgesprek (15 min), onboarding voor docenten (30 min), en daarna kunnen leerlingen direct aan de slag."
                                />
                                <Benefit
                                    icon={<IconShield />}
                                    title="AVG-compliant en EU AI Act hoog-risico-klaar"
                                    description="Verwerkersovereenkomst Model 4.0, DPIA, Annex IV technische documentatie, risicoregister — allemaal al opgesteld."
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
                                <h2 className="text-sm font-bold text-slate-900 mb-3">Wat krijg je tijdens de pilot?</h2>
                                <ul className="space-y-2.5">
                                    {[
                                        '3 maanden volledige toegang tot het platform',
                                        'Max. 250 leerlingen per schoollocatie',
                                        '20+ AI-missies gekoppeld aan SLO-kerndoelen',
                                        'Docenten-dashboard met SLO-rapportage',
                                        'Privacy Officer support tijdens onboarding',
                                        'Wekelijkse feedbackloop — jij stuurt mee',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                                <IconCheck />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-2">Eerst het compliance-dossier bekijken?</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Onze volledige privacy- en AI Act-documentatie staat open op de Compliance Hub — inclusief DPA, DPIA,
                                    Annex IV en het risicoregister.
                                </p>
                                <a href="/compliance-hub" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline">
                                    Naar Compliance Hub →
                                </a>
                            </div>
                        </div>

                        {/* Right: form */}
                        <div className="lg:sticky lg:top-24">
                            <PilotRequestForm
                                source="pilot-aanmelden-page"
                                variant="inline"
                                introTitle="Meld je school aan"
                                introSubtitle="Reactie binnen 2 werkdagen"
                            />
                        </div>
                    </div>

                    {/* FAQ */}
                    <section className="max-w-3xl mx-auto mt-20">
                        <h2 className="text-2xl font-medium tracking-tight text-slate-900 mb-6 text-center" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Veelgestelde vragen
                        </h2>
                        <div className="bg-white rounded-2xl border border-slate-100 px-6">
                            <FaqItem
                                q="Wat kost de pilot?"
                                a="De pilot is volledig gratis gedurende 3 maanden, met een limiet van 250 leerlingen per schoollocatie. Geen creditcard nodig, geen verplichting tot doorzetten na de pilot."
                            />
                            <FaqItem
                                q="Hoe lang duurt de onboarding?"
                                a="Kennismakingsgesprek van 15 minuten, gevolgd door een onboarding van 30 minuten voor docenten. Daarna kunnen leerlingen direct starten. Totale tijdlijn: live binnen 10 werkdagen na akkoord."
                            />
                            <FaqItem
                                q="Voldoet DGSkills aan AVG en EU AI Act?"
                                a="Ja. We hebben een volledige DPIA, Verwerkersovereenkomst Model 4.0 voor funderend onderwijs, sub-verwerkerslijst en technische documentatie (Annex IV) conform EU AI Act Art. 11. DGSkills is geclassificeerd als hoog risico onder Annex III punt 3(b). Alle 21 compliance-documenten zijn opvraagbaar via de Compliance Hub."
                            />
                            <FaqItem
                                q="Waar staat onze data?"
                                a="Alle data wordt opgeslagen binnen de Europese Economische Ruimte (europe-west4 — Nederland). AI-verwerking via Google Vertex AI in dezelfde regio. Geen data wordt gebruikt voor het trainen van AI-modellen."
                            />
                            <FaqItem
                                q="Kunnen we onze klassen koppelen aan Magister / Cumlaude / Zermelo?"
                                a="SSO via Microsoft en Google Workspace is standaard beschikbaar. Koppeling met LAS-systemen zoals Magister verloopt via SAML/OIDC — tijdens onboarding bekijken we samen welke integratie het beste past bij jouw school."
                            />
                            <FaqItem
                                q="Wat gebeurt er na de pilot?"
                                a="Na 3 maanden kan je kiezen: stoppen (alle data wordt op verzoek verwijderd binnen 30 dagen), verlengen, of overstappen naar een licentie vanaf €2.000 per schoollocatie per jaar (&lt;&nbsp;€7 per leerling per jaar). Geen automatische verlenging."
                            />
                        </div>
                    </section>

                    {/* Final CTA */}
                    <div className="max-w-3xl mx-auto mt-20 text-center bg-white rounded-2xl border border-slate-100 p-10">
                        <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Vragen beantwoord? Vul het formulier in.
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Of mail Yorin direct op <a href="mailto:info@dgskills.app" className="text-[#D97757] font-semibold hover:underline">info@dgskills.app</a>.
                        </p>
                        <a
                            href="#pilot-form"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('form[aria-label="Pilot aanvraagformulier"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-full text-sm transition-colors"
                            style={{ backgroundColor: '#D97757' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D97757')}
                        >
                            Ga naar het formulier
                        </a>
                    </div>
                </div>
            </main>

            <footer className="py-10 text-slate-400 text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Digitale Geletterdheid voor het Voortgezet Onderwijs</p>
                <p className="mt-1">
                    <a href="/compliance-hub" className="hover:text-slate-600">Compliance Hub</a>
                    {' · '}
                    <a href="/ict/privacy/policy" className="hover:text-slate-600">Privacyverklaring</a>
                    {' · '}
                    <a href="mailto:privacy@dgskills.app" className="hover:text-slate-600">Privacy Officer</a>
                </p>
            </footer>
        </div>
    );
};
