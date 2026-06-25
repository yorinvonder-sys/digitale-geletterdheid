/**
 * ScholenLandingProductBento — illustration-driven product bento grid.
 * Phase 2 homepage visuals. Shows 6 product tiles with feature illustrations.
 */
import React, { useEffect, useRef, useState } from 'react';
import { AiDisclosureBadge } from '@/features/ai-chat/AiDisclosureBadge';

// ─── tile data ───────────────────────────────────────────────────────────────

interface BentoTile {
    illustration: string;
    alt: string;
    heading: string;
    body: string;
    bg: 'ink' | 'white' | 'acid';
    colSpan: string; // md grid col span class
    rowSpan?: string; // md grid row span class (optional)
}

const tiles: BentoTile[] = [
    {
        illustration: '/illustrations/feature-mission.webp',
        alt: 'Leerling werkt aan een AI-missie op een laptop',
        heading: 'Echte AI-missies',
        body: 'Leerlingen maken iets echts — een prompt, een website, een game. Geen invuloefening.',
        bg: 'ink',
        colSpan: 'md:col-span-3',
        rowSpan: 'md:row-span-2',
    },
    {
        illustration: '/illustrations/feature-dashboard.webp',
        alt: 'Docent-dashboard met leerlingvoortgang',
        heading: 'Docent-dashboard',
        body: 'Zie wie vastzit, zonder spreadsheet.',
        bg: 'white',
        colSpan: 'md:col-span-3',
    },
    {
        illustration: '/illustrations/feature-curriculum.webp',
        alt: 'SLO-kerndoelen gekoppeld aan leeractiviteiten',
        heading: 'SLO-kerndoelen',
        body: 'Aan elke missie gekoppeld.',
        bg: 'acid',
        colSpan: 'md:col-span-3',
    },
    {
        illustration: '/illustrations/feature-gamification.webp',
        alt: 'Leerling scoort punten en stijgt in levels',
        heading: 'Punten & levels',
        body: 'Motivatie die werkt.',
        bg: 'white',
        colSpan: 'md:col-span-2',
    },
    {
        illustration: '/illustrations/feature-privacy.webp',
        alt: 'Privacyschild symboliseert veilige gegevensverwerking',
        heading: 'Privacy by design',
        body: 'AVG-bewust, te toetsen door ICT.',
        bg: 'white',
        colSpan: 'md:col-span-2',
    },
    {
        illustration: '/illustrations/feature-devices.webp',
        alt: 'DGSkills op laptop, tablet en telefoon',
        heading: 'Werkt overal',
        body: 'Elk apparaat, elke browser.',
        bg: 'ink',
        colSpan: 'md:col-span-2',
    },
];

// ─── bg helpers ──────────────────────────────────────────────────────────────

function tileBase(bg: BentoTile['bg']) {
    switch (bg) {
        case 'ink':
            return 'bg-duck-ink text-white';
        case 'acid':
            return 'bg-duck-acid text-duck-ink';
        case 'white':
        default:
            return 'bg-white text-duck-ink shadow-duck-soft';
    }
}

function headingColor(bg: BentoTile['bg']) {
    return bg === 'ink' ? 'text-white' : 'text-duck-ink';
}

function bodyColor(bg: BentoTile['bg']) {
    return bg === 'ink' ? 'text-white/70' : 'text-duck-ink/65';
}

// ─── single tile ─────────────────────────────────────────────────────────────

interface TileProps {
    tile: BentoTile;
    visible: boolean;
    delay: number;
}

const BentoCard: React.FC<TileProps> = ({ tile, visible, delay }) => {
    return (
        <div
            className={[
                'rounded-[1.5rem] p-6 flex flex-col gap-4 overflow-hidden',
                tileBase(tile.bg),
                tile.colSpan,
                tile.rowSpan ?? '',
                'opacity-0 translate-y-6 transition-all duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100',
                visible ? 'opacity-100 translate-y-0' : '',
            ]
                .filter(Boolean)
                .join(' ')}
            style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
        >
            {/* illustration */}
            <div className="aspect-[4/3] overflow-hidden rounded-xl flex-none">
                <img
                    src={tile.illustration}
                    alt={tile.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            {/* text */}
            <div className="mt-auto">
                <p className={`font-display text-xl leading-snug ${headingColor(tile.bg)}`}>
                    {tile.heading}
                </p>
                <p className={`mt-1 text-sm font-semibold leading-relaxed ${bodyColor(tile.bg)}`}>
                    {tile.body}
                </p>
            </div>
        </div>
    );
};

// ─── section ─────────────────────────────────────────────────────────────────

export const ScholenLandingProductBento: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.08 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-duck-bg px-5 py-20 md:px-10 md:py-28"
        >
            <div className="mx-auto max-w-6xl">
                {/* header */}
                <header>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-duck-ink/45">
                        Zo ziet DGSkills eruit
                    </p>
                    <h2 className="mt-4 font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05] text-duck-ink">
                        Alles wat je nodig hebt. In één omgeving.
                    </h2>
                </header>

                {/* bento grid */}
                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6 md:[grid-auto-rows:minmax(0,1fr)]">
                    {tiles.map((tile, i) => (
                        <BentoCard
                            key={tile.heading}
                            tile={tile}
                            visible={visible}
                            delay={i * 60}
                        />
                    ))}
                </div>

                {/* AI disclosure */}
                <div className="mt-4 flex justify-end">
                    <AiDisclosureBadge
                        compact
                        tone="duck"
                        text="Illustraties zijn AI-gegenereerd"
                    />
                </div>
            </div>
        </section>
    );
};
