/**
 * Pain Points section — illustration-driven urgency cards.
 * Each card has a Gemini-generated pencil-drawn illustration showing the problem visually.
 */
import React from 'react';

const SERIF = "'Newsreader', Georgia, serif";
const C = {
    text: '#1A1A19',
    textMuted: '#6B6B66',
    textLight: '#9C9C95',
    accent: '#D97757',
    border: '#E8E6DF',
};

// Warm background colors for illustration containers
const BG = {
    rose: '#F0D5D0',
    amber: '#EDE0C8',
    slate: '#D8DDE4',
    mint: '#D0E0D4',
};

const painPoints = [
    {
        illustration: '/illustrations/pain-point-low-scores.webp',
        alt: 'Docent houdt rapport vast met cijfer 4,7 omcirkeld in rood, met dalende grafiek en een rood kruisteken',
        bgColor: BG.rose,
        stat: '4,7',
        statLabel: 'Rapportcijfer',
        title: 'Leerlingen scoren onvoldoende op digitale geletterdheid',
        description: 'Nederlandse docenten gaven hun leerlingen gemiddeld een 4,7 voor digitale geletterdheid. ICILS 2023 bevestigt: 1 op de 3 leerlingen scoort onder basisniveau.',
        source: 'Monitor Digitale Geletterdheid 2023, DUO/ECP; ICILS 2023',
    },
    {
        illustration: '/illustrations/pain-point-deadline.webp',
        alt: 'Wandkalender met 2027, wekker op bijna middernacht, en een map Digitale Geletterdheid op een rommelig bureau',
        bgColor: BG.amber,
        stat: '2027',
        statLabel: 'Verplicht',
        title: 'SLO Kerndoelen worden wettelijk verplicht',
        description: 'Per 1 augustus 2027 zijn de kerndoelen wettelijk verplicht. 52% van de VO-docenten werkt nu zonder leerlijn en zonder leerdoelen.',
        source: 'ECP Monitor Digitale Geletterdheid VO; Kamerbrief OCW 2025',
    },
    {
        illustration: '/illustrations/pain-point-teacher-shortage.webp',
        alt: 'Leeg docentenbureau met VACATURE op het whiteboard, verwarde leerlingen kijken om zich heen',
        bgColor: BG.slate,
        stat: '3.800',
        statLabel: 'FTE tekort',
        title: 'Geen vakdocent beschikbaar',
        description: 'Het lerarentekort bedraagt 3.800 FTE. Informatica heeft het hoogste relatieve tekort: 10% onvervuld.',
        source: 'Trendrapportage Arbeidsmarkt Leraren 2024, OCW',
    },
    {
        illustration: '/illustrations/pain-point-no-platform.webp',
        alt: 'Verveelde leerling leest saai AI-theorieboek, met een gedachtewolk van een interactief scherm met hands-on activiteiten',
        bgColor: BG.mint,
        stat: '1e',
        statLabel: 'In Nederland',
        title: 'Er is nog geen hands-on AI-platform voor leerlingen',
        description: 'Kerndoel 21D vereist dat leerlingen AI verkennen. Bestaande methodes behandelen AI alleen theoretisch. DGSkills is het eerste hands-on platform.',
        source: 'SLO Conceptkerndoelen Digitale Geletterdheid 2025',
    },
];

export const ScholenLandingPainPoints: React.FC = () => (
    <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
            <p className="text-sm font-medium tracking-wide mb-3" style={{ color: C.accent }}>De uitdaging</p>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: SERIF, color: C.text }}>
                Digitale geletterdheid staat onder druk
            </h2>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: C.textMuted }}>
                De kerndoelen worden per 2027 verplicht, maar scholen missen de middelen, de mensen en het materiaal.
            </p>
        </div>

        {/* Pain point cards — 2x2 grid with illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((point) => (
                <div
                    key={point.title}
                    className="group rounded-2xl border p-6 transition-all hover:shadow-md"
                    style={{ borderColor: C.border, backgroundColor: '#FFFFFF' }}
                >
                    <div className="flex items-start gap-5">
                        {/* Illustration — small, contained */}
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: point.bgColor }}
                        >
                            <img
                                src={point.illustration}
                                alt={point.alt}
                                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                                loading="lazy"
                            />
                        </div>
                        {/* Stat badge */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-black leading-none" style={{ color: C.accent, fontFamily: SERIF }}>
                                    {point.stat}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textLight }}>
                                    {point.statLabel}
                                </span>
                            </div>
                            <h3 className="text-[15px] font-medium leading-snug mb-1.5" style={{ fontFamily: SERIF, color: C.text }}>
                                {point.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-1.5" style={{ color: C.textMuted }}>
                                {point.description}
                            </p>
                            <p className="text-[11px] font-medium italic" style={{ color: C.textLight }}>
                                Bron: {point.source}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Transition statement */}
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 rounded-full px-6 py-3" style={{ backgroundColor: `${C.accent}08`, border: `1px solid ${C.accent}18` }}>
                <div className="w-2 h-2 rounded-full motion-safe:animate-pulse" style={{ backgroundColor: C.accent }} />
                <p className="text-sm font-medium" style={{ color: C.accent }}>
                    DGSkills is ontworpen om precies deze problemen op te lossen
                </p>
            </div>
        </div>
    </div>
);
