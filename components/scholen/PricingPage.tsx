import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const C = {
    bg: '#FAF9F0',
    bgAlt: '#F5F3EC',
    text: '#1A1A19',
    textMuted: '#6B6B66',
    textLight: '#9C9C95',
    accent: '#D97757',
    accentHover: '#C46849',
    border: '#E8E6DF',
    borderLight: '#F0EEE8',
    dark: '#1A1A19',
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface TierProps {
    name: string;
    subtitle: string;
    price: string;
    priceNote?: string;
    features: string[];
    recommended?: boolean;
    ctaLabel: string;
}

const TierCard: React.FC<TierProps> = ({ name, subtitle, price, priceNote, features, recommended, ctaLabel }) => (
    <div
        className={`relative flex flex-col rounded-2xl p-6 md:p-8 transition-shadow ${recommended ? 'shadow-lg ring-2' : 'shadow-sm border'}`}
        style={{
            backgroundColor: '#FFFFFF',
            borderColor: recommended ? C.accent : C.border,
            ...(recommended ? { ringColor: C.accent } as React.CSSProperties : {}),
        }}
    >
        {recommended && (
            <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold tracking-wide uppercase"
                style={{ backgroundColor: C.accent }}
            >
                Aanbevolen
            </div>
        )}
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-1" style={{ color: C.text, fontFamily: SANS }}>{name}</h3>
            <p className="text-sm" style={{ color: C.textMuted }}>{subtitle}</p>
        </div>
        <div className="mb-6">
            <p className="text-3xl font-bold" style={{ color: C.text, fontFamily: SANS }}>{price}</p>
            {priceNote && <p className="text-xs mt-1" style={{ color: C.textLight }}>{priceNote}</p>}
        </div>
        <ul className="flex flex-col gap-3 mb-8 flex-1">
            {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: C.textMuted }}>
                    <CheckIcon />
                    <span>{f}</span>
                </li>
            ))}
        </ul>
        <a
            href="/scholen#contact"
            className="block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            style={{
                backgroundColor: recommended ? C.accent : 'transparent',
                color: recommended ? '#FFFFFF' : C.accent,
                border: recommended ? 'none' : `2px solid ${C.accent}`,
                fontFamily: SANS,
            }}
            aria-label={`${ctaLabel} — ${name}`}
            onMouseEnter={(e) => {
                if (recommended) (e.currentTarget.style.backgroundColor = C.accentHover);
            }}
            onMouseLeave={(e) => {
                if (recommended) (e.currentTarget.style.backgroundColor = C.accent);
            }}
        >
            {ctaLabel}
        </a>
    </div>
);

const tiers: TierProps[] = [
    {
        name: 'Pilot',
        subtitle: 'Bewijs de impact in 8–12 weken',
        price: 'Vanaf €1.500',
        priceNote: 'Eenmalig · max 150 leerlingen · 100% verrekend bij jaarcontract',
        features: [
            'Pilot Start (1 team): €1.500',
            'Pilot School (2-3 teams): €3.000',
            'Onboarding call (45 min)',
            'Baseline + impactrapport',
            'Alle missies + docentendashboard',
        ],
        recommended: true,
        ctaLabel: 'Start een pilot',
    },
    {
        name: 'Start',
        subtitle: '1 team of 1 jaarlaag',
        price: '€4.900',
        priceNote: 'Per jaar · max 250 leerlingen · max 8 docenten',
        features: [
            'Alle 94 missies',
            'Docentendashboard',
            'SLO-rapportages',
            'E-mail support',
            'P1 binnen 8 werkuren',
        ],
        ctaLabel: 'Offerte aanvragen',
    },
    {
        name: 'School',
        subtitle: 'Volledige VO-school',
        price: 'Vanaf €8.900',
        priceNote: 'Per jaar · S/M/L op basis van leerlingaantal',
        features: [
            'School-S (251–500): €8.900/jaar',
            'School-M (501–900): €12.900/jaar',
            'School-L (901–1400): €17.900/jaar',
            'Dedicated Customer Success',
            'P1 binnen 4 werkuren',
        ],
        ctaLabel: 'Offerte aanvragen',
    },
    {
        name: 'Bestuur',
        subtitle: '3+ VO-scholen, raamovereenkomst',
        price: 'Op aanvraag',
        priceNote: 'Richtprijs €11.500–€15.500 per school/jaar',
        features: [
            'Multi-school raamovereenkomst',
            'Bestuursdashboard',
            '4 trainingsdagen per jaar',
            'P1 binnen 2 werkuren',
            'Volume-korting',
        ],
        ctaLabel: 'Neem contact op',
    },
];

const addOns = [
    { name: 'Extra docenttraining (2u, online)', price: '€650' },
    { name: 'On-site trainingsdag', price: '€1.950 + reiskosten' },
    { name: 'Fast-track onboarding', price: '€1.200' },
    { name: 'Extra impactrapportage per semester', price: '€900' },
];

export const PricingPage: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Prijzen — DGSkills | Digitale Geletterdheid voor het VO';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Transparante prijzen voor DGSkills. Pilot vanaf €1.500, jaarlicentie vanaf €4.900. Alle 94 missies, docentendashboard en SLO-rapportages inbegrepen.');

        const breadcrumb = document.createElement('script');
        breadcrumb.type = 'application/ld+json';
        breadcrumb.id = 'pricing-breadcrumb-jsonld';
        breadcrumb.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dgskills.app' },
                { '@type': 'ListItem', position: 2, name: 'Prijzen', item: 'https://dgskills.app/pricing' },
            ],
        });
        document.head.appendChild(breadcrumb);

        trackEvent('seo_page_view', { cluster: 'pricing', page: 'pricing' });

        return () => {
            document.title = originalTitle;
            document.getElementById('pricing-breadcrumb-jsonld')?.remove();
        };
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5" aria-label="Terug naar homepage">
                        <img src="/mascot/pip-logo.webp" alt="DGSkills logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold" style={{ color: C.text, fontFamily: SANS }}>DGSkills</span>
                    </a>
                    <a
                        href="/"
                        className="text-sm font-medium transition-colors hover:underline focus-visible:ring-2 focus-visible:rounded-md focus-visible:outline-none"
                        style={{ color: C.textMuted }}
                        aria-label="Terug naar de homepage"
                    >
                        ← Terug
                    </a>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.text, fontFamily: SERIF }}>
                        Transparante prijzen voor elke school
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textMuted, fontFamily: SANS }}>
                        Geen verborgen kosten. Alle missies, het docentendashboard en SLO-rapportages zitten in elke licentie.
                        Start met een pilot en reken het pilotbedrag 100% af bij een jaarcontract.
                    </p>
                    <p className="text-sm mt-3" style={{ color: C.textLight }}>Alle prijzen zijn exclusief BTW.</p>
                </div>

                {/* Pricing cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
                    {tiers.map((tier) => (
                        <TierCard key={tier.name} {...tier} />
                    ))}
                </div>

                {/* Contract discounts */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl font-bold text-center mb-8" style={{ color: C.text, fontFamily: SERIF }}>
                        Meerjarenkorting
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { period: '12 maanden', discount: 'Standaard', highlight: false },
                            { period: '24 maanden', discount: '8% korting', highlight: false },
                            { period: '36 maanden', discount: '15% korting', highlight: true },
                        ].map((d) => (
                            <div
                                key={d.period}
                                className={`text-center p-5 rounded-xl ${d.highlight ? 'ring-2' : 'border'}`}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: d.highlight ? C.accent : C.border,
                                }}
                            >
                                <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>{d.period}</p>
                                <p className="text-lg font-bold" style={{ color: d.highlight ? C.accent : C.text }}>{d.discount}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-center mt-3" style={{ color: C.textLight }}>
                        Alle contracten worden jaarlijks vooruit gefactureerd.
                    </p>
                </div>

                {/* Add-ons */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl font-bold text-center mb-8" style={{ color: C.text, fontFamily: SERIF }}>
                        Optionele add-ons
                    </h2>
                    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border, backgroundColor: '#FFFFFF' }}>
                        {addOns.map((addon, i) => (
                            <div
                                key={addon.name}
                                className={`flex items-center justify-between px-6 py-4 ${i < addOns.length - 1 ? 'border-b' : ''}`}
                                style={{ borderColor: C.borderLight }}
                            >
                                <span className="text-sm" style={{ color: C.text }}>{addon.name}</span>
                                <span className="text-sm font-semibold whitespace-nowrap ml-4" style={{ color: C.text }}>{addon.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What's included */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl font-bold text-center mb-8" style={{ color: C.text, fontFamily: SERIF }}>
                        Altijd inbegrepen
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            'Alle 94 interactieve missies',
                            'Docentendashboard met voortgang',
                            'SLO Kerndoelen 2025 rapportages',
                            'AVG-compliant (DPIA beschikbaar)',
                            'AI-transparantieverklaring',
                            'Nulmeting + eindmeting',
                            'Gamificatie (XP, badges, leaderboard)',
                            'Automatische updates & nieuwe missies',
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: C.bgAlt }}>
                                <CheckIcon />
                                <span className="text-sm" style={{ color: C.text }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: C.text, fontFamily: SERIF }}>
                        Klaar om te starten?
                    </h2>
                    <p className="text-base mb-6" style={{ color: C.textMuted }}>
                        Begin met een risicovrije pilot. Het pilotbedrag wordt 100% verrekend bij een jaarcontract.
                    </p>
                    <a
                        href="/scholen#contact"
                        className="inline-block px-8 py-3.5 rounded-xl text-white font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        style={{ backgroundColor: C.accent, fontFamily: SANS }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.accentHover)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
                    >
                        Start een pilot →
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 px-6 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
                <p className="text-xs" style={{ color: C.textLight }}>
                    © {new Date().getFullYear()} DGSkills.app — KvK 81819889
                </p>
            </footer>
        </div>
    );
};
