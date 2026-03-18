/**
 * Features section — pencil-drawn illustration cards.
 * Anthropic-inspired layout with DGSkills' own identity:
 * education-themed illustrations, warm varied palette, mission-driven language.
 */
import React from 'react';

const SERIF = "'Newsreader', Georgia, serif";
const C = {
    text: '#1A1A19',
    textMuted: '#6B6B66',
    accent: '#D97757',
    border: '#E8E6DF',
};

// Illustration container background colors — DGSkills eigen palet
const BG = {
    coral: '#EACED0',   // warm roze — missies & avontuur
    sage: '#C8DCC4',    // zacht groen — groei & curriculum
    lavender: '#D6CEE0',// lavendel — creativiteit & gamification
    wheat: '#E6DBC8',   // tarwe — inzicht & dashboards
    sky: '#C8DAE8',     // zacht blauw — vertrouwen & privacy
    clay: '#DCCFC0',    // klei — praktisch & toegankelijk
};

// ============================================================
// FEATURE ILLUSTRATION IMAGES
// Generated via Gemini 2.5 Flash Image API
// ============================================================

function FeatureImage({ src, alt }: { src: string; alt: string }) {
    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            decoding="async"
        />
    );
}

// ============================================================
// FEATURE CARDS DATA
// ============================================================

const features = [
    {
        illustration: <FeatureImage src="/illustrations/feature-mission.webp" alt="AI-gestuurde missies illustratie" />,
        bgColor: BG.coral,
        label: 'Leerervaring',
        title: 'AI-gestuurde missies',
        description: 'Leerlingen lossen uitdagingen op met Google Gemini AI. Van deepfakes herkennen tot een AI-beleidsplan schrijven. Elke missie past zich aan het niveau aan.',
    },
    {
        illustration: <FeatureImage src="/illustrations/feature-curriculum.webp" alt="SLO Kerndoelen illustratie" />,
        bgColor: BG.sage,
        label: 'Curriculum',
        title: 'SLO Kerndoelen 2025',
        description: 'Elke missie is gekoppeld aan officiele SLO-kerndoelen. Je ziet in een oogopslag welke doelen behaald zijn per leerling en per klas.',
    },
    {
        illustration: <FeatureImage src="/illustrations/feature-gamification.webp" alt="Gamification illustratie" />,
        bgColor: BG.lavender,
        label: 'Motivatie',
        title: 'Gamification die werkt',
        description: 'XP, badges, leaderboards en 3D-avatars. Leerlingen willen verder — niet omdat het moet, maar omdat het leuk is.',
    },
    {
        illustration: <FeatureImage src="/illustrations/feature-dashboard.webp" alt="Dashboard voor docenten illustratie" />,
        bgColor: BG.wheat,
        label: 'Regie',
        title: 'Dashboard voor docenten',
        description: 'Real-time inzicht per leerling en per klas. SLO-voortgang, activiteit, resultaten en wie extra aandacht nodig heeft.',
    },
    {
        illustration: <FeatureImage src="/illustrations/feature-privacy.webp" alt="AVG-compliant privacy illustratie" />,
        bgColor: BG.sky,
        label: 'Privacy',
        title: 'AVG-compliant by design',
        description: 'Data in Europa, verwerkersovereenkomst en DPIA beschikbaar. Ontworpen voor de EU AI Act.',
    },
    {
        illustration: <FeatureImage src="/illustrations/feature-devices.webp" alt="Werkt op elk apparaat illustratie" />,
        bgColor: BG.clay,
        label: 'Toegang',
        title: 'Werkt op elk apparaat',
        description: 'iPad, Chromebook, laptop, telefoon. Geen installatie, geen IT-afdeling nodig. Open de link en ga aan de slag.',
    },
];

// ============================================================
// COMPONENT
// ============================================================

export const ScholenLandingFeatures: React.FC = () => (
    <div>
        <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: C.accent }}>
                    Waarom DGSkills
                </p>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: SERIF, color: C.text }}>
                    Doordacht ontworpen voor het onderwijs
                </h2>
                <p className="text-base leading-relaxed" style={{ color: C.textMuted }}>
                    Digitale geletterdheid wordt wettelijk verplicht, maar bestaand lesmateriaal weet
                    leerlingen niet te boeien. DGSkills pakt dat anders aan met AI-missies,
                    gamification en real-time voortgangsinzicht.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map(f => (
                    <div key={f.title} className="group cursor-default">
                        <div
                            className="aspect-square rounded-2xl mb-5 p-10 transition-transform duration-300 group-hover:scale-[1.02]"
                            style={{ backgroundColor: f.bgColor }}
                        >
                            {f.illustration}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.accent }}>
                            {f.label}
                        </p>
                        <h3 className="text-lg font-medium mb-2" style={{ fontFamily: SERIF, color: C.text }}>
                            {f.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed" style={{ color: C.textMuted }}>
                            {f.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
