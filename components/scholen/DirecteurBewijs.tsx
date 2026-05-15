import React, { useState, useEffect, useRef } from 'react';

// Palet en font-stacks gedupliceerd vanuit ScholenLanding.tsx
// (bewijs-blokken worden los geïmporteerd; geen gedeelde module voor de palet-consts)
const C = {
    bg: '#FCF6EA',
    bgAlt: '#F3E4CB',
    text: '#08283B',
    textMuted: '#445865',
    accent: '#D97848',
    accentHover: '#B85F36',
    border: '#E7D8BD',
    gold: '#D7C95F',
    goldHover: '#C9B94F',
    teal: '#0B453F',
    paper: '#FFFDF7',
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Inline SVG-iconen — geen lucide-react op de homepage (zie project-conventie)
const IconTarget: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const IconFile: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const IconGift: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
);

const IconCalendar: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// AnimateOnScroll — zelfde patroon als in ScholenLanding.tsx en DocentenBewijs.tsx
function AnimateOnScroll({ children, delay = '' }: { children: React.ReactNode; delay?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setIsVisible(true); io.disconnect(); } },
            { rootMargin: '0px', threshold: 0.1 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            className={`transition-[opacity,transform] duration-700 ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            {children}
        </div>
    );
}

interface BewijsCard {
    icon: React.FC;
    title: string;
    body: string;
}

const CARDS: BewijsCard[] = [
    {
        icon: IconTarget,
        title: 'Alle 9 SLO-kerndoelen gedekt',
        body: 'AI-missies in drie leerjaren, voor regulier én VSO. Aansluitend op de kerndoelen 2025.',
    },
    {
        icon: IconFile,
        title: 'Rapportage per leerling',
        body: 'Per leerling kerndoel-percentage in het docentdashboard. Bruikbaar voor LVS en voortgangsbesprekingen.',
    },
    {
        icon: IconGift,
        title: 'Gratis pilot, geen risico',
        body: '8 weken vrijblijvend met max 150 leerlingen. Geen kaart, geen verbintenis. Verrekening bij jaarcontract.',
    },
    {
        icon: IconCalendar,
        title: 'Voldoet aan AI-wet 2026',
        body: 'DGSkills volgt de nieuwe wet voor onderwijs-AI. Op tijd geregeld vóór 2 aug 2026.',
    },
];

// SECTION_IDS uit ScholenLanding.tsx: slo = 'slo-kerndoelen', contact = 'gratis-pilot'
const SLO_SECTION_ID = 'slo-kerndoelen';
const CONTACT_SECTION_ID = 'gratis-pilot';

export const DirecteurBewijs: React.FC = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    function scrollTo(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }

    function handlePilotClick() {
        void import('../../services/analyticsService')
            .then(({ trackEvent }) => trackEvent('dual_cta_click', { persona: 'directeur', cta: 'pilot' }))
            .catch(() => undefined);
        scrollTo(CONTACT_SECTION_ID);
    }

    function handleSloClick() {
        void import('../../services/analyticsService')
            .then(({ trackEvent }) => trackEvent('dual_cta_click', { persona: 'directeur', cta: 'slo' }))
            .catch(() => undefined);
        scrollTo(SLO_SECTION_ID);
    }

    return (
        <section
            aria-label="Bewijs voor schoolleiders"
            className="scroll-mt-16"
            style={{ backgroundColor: C.bg, fontFamily: SANS }}
        >
            <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 lg:py-24">
                {/* Label */}
                <p
                    className="text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: C.accent, fontFamily: SANS }}
                >
                    Voor schoolleiders
                </p>

                {/* Titel */}
                <h2
                    className="text-3xl md:text-4xl font-normal mb-4 max-w-2xl"
                    style={{ fontFamily: SERIF, color: C.text, lineHeight: 1.25 }}
                >
                    Volledige SLO-dekking. Gratis pilot. Geen verbintenis.
                </h2>

                {/* Sub-paragraph */}
                <p
                    className="text-lg mb-10 max-w-xl"
                    style={{ color: C.textMuted, lineHeight: 1.6 }}
                >
                    Alle 9 SLO-kerndoelen, voor regulier én VSO. Rapportage per leerling. Pilot in 10 werkdagen live.
                </p>

                {/* 2×2 grid van bewijs-cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {CARDS.map((card, i) => {
                        const Icon = card.icon;
                        const isHovered = hoveredCard === i;
                        return (
                            <AnimateOnScroll key={card.title} delay={i < 2 ? '' : 'delay-150'}>
                                <div
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        border: `1px solid ${isHovered ? C.accent : C.border}`,
                                        borderRadius: 12,
                                        padding: 24,
                                        boxShadow: isHovered
                                            ? '0 4px 12px rgba(0,0,0,0.08)'
                                            : '0 1px 2px rgba(0,0,0,0.04)',
                                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                                        transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                                    }}
                                >
                                    {/* Icoon */}
                                    <div
                                        className="mb-3"
                                        style={{ color: C.accent }}
                                    >
                                        <Icon />
                                    </div>
                                    {/* Titel */}
                                    <h3
                                        className="text-base font-semibold mb-1"
                                        style={{ color: C.text, fontFamily: SANS }}
                                    >
                                        {card.title}
                                    </h3>
                                    {/* Body */}
                                    <p
                                        className="text-sm"
                                        style={{ color: C.textMuted, lineHeight: 1.6 }}
                                    >
                                        {card.body}
                                    </p>
                                </div>
                            </AnimateOnScroll>
                        );
                    })}
                </div>

                {/* CTA-rij */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Primary (gold per design.md) */}
                    <button
                        onClick={handlePilotClick}
                        className="px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            backgroundColor: C.gold,
                            color: C.text,
                            border: 'none',
                            fontFamily: SANS,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.goldHover; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.gold; }}
                    >
                        Plan schoolpilot &rarr;
                    </button>

                    {/* Secondary (teal border per design.md) */}
                    <button
                        onClick={handleSloClick}
                        className="px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                            backgroundColor: 'transparent',
                            color: C.teal,
                            border: `1px solid ${C.teal}`,
                            fontFamily: SANS,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.teal; (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.teal; }}
                    >
                        Bekijk SLO-dekking
                    </button>
                </div>
            </div>
        </section>
    );
};
