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
const IconPlay: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const IconClock: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconBarChart: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const IconGrid: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

// AnimateOnScroll — zelfde patroon als in ScholenLanding.tsx
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
        icon: IconPlay,
        title: 'Probeer een missie zelf',
        body: 'Open een AI-chatmissie direct op de pagina. Geen account nodig.',
    },
    {
        icon: IconClock,
        title: '45 minuten en je eerste les staat',
        body: 'Draaiboek, leerlingkaarten en een uitlegblad voor in je map.',
    },
    {
        icon: IconBarChart,
        title: 'Jij ziet wat ze leren',
        body: 'Per leerling zie je voortgang, missies en punten. Eenvoudig bijsturen waar nodig.',
    },
    {
        icon: IconGrid,
        title: '20+ missies klaar',
        body: 'Game Programmeur, Prompt Master, Data Detective en meer. Live op het platform.',
    },
];

interface DocentenBewijsProps {
    /** Optionele override voor de contact-sectie scroll-target; standaard 'contact' */
    contactSectionId?: string;
}

export const DocentenBewijs: React.FC<DocentenBewijsProps> = ({ contactSectionId = 'contact' }) => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    function scrollTo(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }

    function handleDemoClick() {
        void import('../../services/analyticsService')
            .then(({ trackEvent }) => trackEvent('dual_cta_click', { persona: 'docent', cta: 'demo' }))
            .catch(() => undefined);
        scrollTo('probeer-het');
    }

    function handleContactClick() {
        void import('../../services/analyticsService')
            .then(({ trackEvent }) => trackEvent('dual_cta_click', { persona: 'docent', cta: 'teacher_call' }))
            .catch(() => undefined);
        scrollTo(contactSectionId);
    }

    return (
        <section
            aria-label="Bewijs voor docenten"
            className="scroll-mt-16"
            style={{ backgroundColor: C.bg, fontFamily: SANS }}
        >
            <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 lg:py-24">
                {/* Label */}
                <p
                    className="text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: C.accent, fontFamily: SANS }}
                >
                    Voor de docent
                </p>

                {/* Titel */}
                <h2
                    className="text-3xl md:text-4xl font-normal mb-4 max-w-2xl"
                    style={{ fontFamily: SERIF, color: C.text, lineHeight: 1.25 }}
                >
                    Minder voorbereiding, meer betrokken leerlingen
                </h2>

                {/* Sub-paragraph */}
                <p
                    className="text-lg mb-10 max-w-xl"
                    style={{ color: C.textMuted, lineHeight: 1.6 }}
                >
                    Klassikale AI-missies die zelfstandig draaien. Jij begeleidt, het platform meet voortgang per kerndoel.
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
                        onClick={handleDemoClick}
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
                        Probeer een missie &rarr;
                    </button>

                    {/* Secondary (teal border per design.md) */}
                    <button
                        onClick={handleContactClick}
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
                        Plan een belletje
                    </button>
                </div>
            </div>
        </section>
    );
};
