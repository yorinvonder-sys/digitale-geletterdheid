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
// PENCIL-DRAWN SVG ILLUSTRATIONS
// Stijl: organische lijnen, ronde line-caps, geen fill,
// lichte imperfecties voor authentiek handgetekend gevoel.
// Thema: onderwijs, missies, leerlingen, ontdekking.
// ============================================================

/** Papieren vliegtuig gelanceerd door een hand — missiegedreven leren */
function IllustrationMission() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Hand */}
            <path d="M55 155c0-8 5-14 12-14h8c2-5 7-8 13-8s11 3 13 8h8c7 0 12 6 12 14v16c0 10-10 18-33 18S55 181 55 171v-16z"
                stroke={C.text} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M75 141v-12M93 133v-8M111 141v-12"
                stroke={C.text} strokeWidth="2" strokeLinecap="round"/>
            {/* Paper airplane launching from hand */}
            <path d="M88 120l-15-28 52-42-37 48z"
                stroke={C.text} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M88 120l12-22"
                stroke={C.text} strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M125 50l-37 48"
                stroke={C.text} strokeWidth="1.8" strokeLinecap="round"/>
            {/* Motion lines */}
            <path d="M72 82c-8-3-16-2-22 1" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            <path d="M68 72c-6-5-14-6-20-4" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
            {/* Sparkles / stars */}
            <path d="M135 38l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={C.accent} stroke="none"/>
            <path d="M148 62l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill={C.accent} stroke="none"/>
            <path d="M118 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={C.accent} stroke="none" opacity="0.7"/>
            {/* Trail dots */}
            <circle cx="70" cy="94" r="1.5" fill={C.text} opacity="0.2"/>
            <circle cx="62" cy="98" r="1" fill={C.text} opacity="0.15"/>
            <circle cx="56" cy="96" r="1.5" fill={C.text} opacity="0.1"/>
        </svg>
    );
}

/** Kompas met kronkelend pad naar een vlag — kerndoelen & leerpad */
function IllustrationCurriculum() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Winding path */}
            <path d="M40 170c10-5 20-30 35-30s15 25 30 25 15-20 30-20 20 10 25 10"
                stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.35"/>
            {/* Flag at end */}
            <line x1="155" y1="145" x2="155" y2="118" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M155 118c5-2 10 0 15-2s8-5 12-4v16c-4-1-7 2-12 4s-10 0-15 2z"
                stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Compass */}
            <circle cx="85" cy="85" r="42" stroke={C.text} strokeWidth="2.2"/>
            <circle cx="85" cy="85" r="36" stroke={C.border} strokeWidth="1.2"/>
            {/* Cardinal ticks */}
            <line x1="85" y1="46" x2="85" y2="40" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="85" y1="130" x2="85" y2="124" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="46" y1="85" x2="40" y2="85" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="130" y1="85" x2="124" y2="85" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            {/* Needle */}
            <polygon points="85,52 80,85 85,92 90,85" fill={C.accent} stroke={C.accent} strokeWidth="0.8" strokeLinejoin="round"/>
            <polygon points="85,118 80,85 85,78 90,85" fill={C.text} stroke={C.text} strokeWidth="0.8" strokeLinejoin="round" opacity="0.2"/>
            <circle cx="85" cy="85" r="3.5" fill="#FAF9F0" stroke={C.text} strokeWidth="1.8"/>
            {/* N label */}
            <text x="85" y="36" textAnchor="middle" fill={C.accent} fontSize="11" fontWeight="600" style={{ fontFamily: SERIF }}>N</text>
            {/* Milestone dots on path */}
            <circle cx="58" cy="165" r="3" fill="none" stroke={C.accent} strokeWidth="1.5"/>
            <circle cx="92" cy="140" r="3" fill={C.accent} stroke="none" opacity="0.6"/>
            <circle cx="125" cy="165" r="3" fill="none" stroke={C.accent} strokeWidth="1.5"/>
        </svg>
    );
}

/** Trofee met sterren en badge — gamification & motivatie */
function IllustrationGamification() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Trophy cup */}
            <path d="M72 60h56v8c0 22-12 40-28 46-16-6-28-24-28-46v-8z"
                stroke={C.text} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Handles */}
            <path d="M72 68c-10 0-18 8-18 18s8 16 18 16"
                stroke={C.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M128 68c10 0 18 8 18 18s-8 16-18 16"
                stroke={C.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Stem */}
            <line x1="100" y1="114" x2="100" y2="130" stroke={C.text} strokeWidth="2.2" strokeLinecap="round"/>
            {/* Base */}
            <path d="M80 130h40v6c0 3-3 6-6 6H86c-3 0-6-3-6-6v-6z"
                stroke={C.text} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Star on trophy */}
            <path d="M100 72l4 8 9 1.5-6.5 6.5 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6.5 9-1.5z"
                stroke={C.accent} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            {/* Sparkle effects */}
            <path d="M60 48l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={C.accent} stroke="none"/>
            <path d="M145 42l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill={C.accent} stroke="none"/>
            <path d="M52 100l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={C.accent} stroke="none" opacity="0.6"/>
            <path d="M155 90l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={C.accent} stroke="none" opacity="0.6"/>
            {/* Badge ribbon */}
            <circle cx="100" cy="155" r="10" stroke={C.text} strokeWidth="1.8" fill="none"/>
            <path d="M92 163l-4 12 12-6 12 6-4-12" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <text x="100" y="159" textAnchor="middle" fill={C.accent} fontSize="10" fontWeight="700">XP</text>
        </svg>
    );
}

/** Grafiek met vergrootglas en hand — docenten dashboard & inzicht */
function IllustrationDashboard() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Screen/card frame */}
            <rect x="30" y="35" width="120" height="85" rx="8" stroke={C.text} strokeWidth="2.2"/>
            {/* Screen top bar */}
            <line x1="30" y1="50" x2="150" y2="50" stroke={C.text} strokeWidth="1.2" opacity="0.3"/>
            <circle cx="42" cy="43" r="2.5" fill={C.text} opacity="0.2"/>
            <circle cx="52" cy="43" r="2.5" fill={C.text} opacity="0.2"/>
            <circle cx="62" cy="43" r="2.5" fill={C.text} opacity="0.2"/>
            {/* Bar chart */}
            <rect x="46" y="90" width="12" height="20" rx="2" stroke={C.text} strokeWidth="1.8" fill="none"/>
            <rect x="66" y="75" width="12" height="35" rx="2" stroke={C.text} strokeWidth="1.8" fill="none"/>
            <rect x="86" y="82" width="12" height="28" rx="2" stroke={C.accent} strokeWidth="1.8" fill={`${C.accent}30`}/>
            <rect x="106" y="68" width="12" height="42" rx="2" stroke={C.text} strokeWidth="1.8" fill="none"/>
            <rect x="126" y="78" width="12" height="32" rx="2" stroke={C.text} strokeWidth="1.8" fill="none"/>
            {/* Trend line */}
            <path d="M52 88 72 72 92 80 112 64 132 74" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="92" cy="80" r="3" fill={C.accent}/>
            {/* Magnifying glass */}
            <circle cx="155" cy="130" r="22" stroke={C.text} strokeWidth="2.2" fill="#FAF9F010"/>
            <line x1="170" y1="147" x2="185" y2="165" stroke={C.text} strokeWidth="3" strokeLinecap="round"/>
            {/* Inside magnifier - detail view */}
            <path d="M145 125l5 8 10-12" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Small labels */}
            <line x1="46" y1="60" x2="75" y2="60" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
            <line x1="46" y1="66" x2="65" y2="66" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
        </svg>
    );
}

/** Schild met hart en sleutelgat — privacy & veiligheid */
function IllustrationPrivacy() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Shield */}
            <path d="M100 30l55 22v45c0 38-22 60-55 76C67 157 45 135 45 97V52l55-22z"
                stroke={C.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Inner shield line */}
            <path d="M100 42l44 18v36c0 30-18 48-44 62-26-14-44-32-44-62V60l44-18z"
                stroke={C.border} strokeWidth="1.2" fill="none"/>
            {/* Lock body */}
            <rect x="85" y="88" width="30" height="24" rx="4" stroke={C.text} strokeWidth="2.2"/>
            {/* Lock shackle */}
            <path d="M90 88V78a10 10 0 0 1 20 0v10" stroke={C.text} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            {/* Keyhole */}
            <circle cx="100" cy="97" r="4" fill={C.accent}/>
            <path d="M100 101v5" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round"/>
            {/* Checkmark in circle above */}
            <circle cx="100" cy="58" r="10" stroke={C.accent} strokeWidth="1.8" fill="none"/>
            <path d="M94 58l4 4 8-8" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Decorative lines on shield */}
            <path d="M62 70l8-3" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>
            <path d="M130 70l-8-3" stroke={C.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>
            {/* EU stars hint */}
            <circle cx="72" cy="130" r="1.5" fill={C.accent} opacity="0.4"/>
            <circle cx="80" cy="140" r="1.5" fill={C.accent} opacity="0.4"/>
            <circle cx="120" cy="140" r="1.5" fill={C.accent} opacity="0.4"/>
            <circle cx="128" cy="130" r="1.5" fill={C.accent} opacity="0.4"/>
        </svg>
    );
}

/** Laptop, tablet en telefoon verbonden — werkt overal */
function IllustrationDevices() {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Laptop */}
            <rect x="20" y="55" width="95" height="62" rx="5" stroke={C.text} strokeWidth="2.2"/>
            <line x1="20" y1="67" x2="115" y2="67" stroke={C.text} strokeWidth="1" opacity="0.3"/>
            <path d="M12 117h111c0 6-4 10-10 10H22c-6 0-10-4-10-10z"
                stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Content lines on laptop */}
            <line x1="32" y1="78" x2="62" y2="78" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
            <line x1="32" y1="86" x2="55" y2="86" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
            <rect x="32" y="92" width="30" height="16" rx="2" stroke={C.accent} strokeWidth="1.5" opacity="0.4"/>
            {/* Tablet */}
            <rect x="130" y="40" width="50" height="70" rx="5" stroke={C.text} strokeWidth="2.2"/>
            <circle cx="155" cy="103" r="2.5" stroke={C.text} strokeWidth="1.5" fill="none"/>
            {/* Content on tablet */}
            <rect x="137" y="50" width="36" height="22" rx="2" stroke={C.text} strokeWidth="1.2" opacity="0.2"/>
            <line x1="137" y1="80" x2="165" y2="80" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
            <line x1="137" y1="87" x2="158" y2="87" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.12"/>
            {/* Phone */}
            <rect x="145" y="125" width="32" height="52" rx="4" stroke={C.text} strokeWidth="2.2"/>
            <line x1="155" y1="170" x2="167" y2="170" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
            {/* Connection arcs */}
            <path d="M110 85c12-10 25-20 35-30" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" opacity="0.6"/>
            <path d="M110 100c15 8 28 22 38 40" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" opacity="0.6"/>
            {/* Connection dots */}
            <circle cx="110" cy="85" r="3" fill={C.accent} opacity="0.5"/>
            <circle cx="110" cy="100" r="3" fill={C.accent} opacity="0.5"/>
            <circle cx="145" cy="55" r="3" fill={C.accent} opacity="0.5"/>
            <circle cx="148" cy="140" r="3" fill={C.accent} opacity="0.5"/>
            {/* Wifi signal */}
            <path d="M85 45c5-5 15-5 20 0" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
            <path d="M80 38c8-8 22-8 30 0" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
        </svg>
    );
}

// ============================================================
// FEATURE CARDS DATA
// ============================================================

const features = [
    {
        illustration: <IllustrationMission />,
        bgColor: BG.coral,
        label: 'Leerervaring',
        title: 'AI-gestuurde missies',
        description: 'Leerlingen lossen uitdagingen op met Google Gemini AI. Van deepfakes herkennen tot een AI-beleidsplan schrijven. Elke missie past zich aan het niveau aan.',
    },
    {
        illustration: <IllustrationCurriculum />,
        bgColor: BG.sage,
        label: 'Curriculum',
        title: 'SLO Kerndoelen 2025',
        description: 'Elke missie is gekoppeld aan officiele SLO-kerndoelen. Je ziet in een oogopslag welke doelen behaald zijn per leerling en per klas.',
    },
    {
        illustration: <IllustrationGamification />,
        bgColor: BG.lavender,
        label: 'Motivatie',
        title: 'Gamification die werkt',
        description: 'XP, badges, leaderboards en 3D-avatars. Leerlingen willen verder — niet omdat het moet, maar omdat het leuk is.',
    },
    {
        illustration: <IllustrationDashboard />,
        bgColor: BG.wheat,
        label: 'Regie',
        title: 'Dashboard voor docenten',
        description: 'Real-time inzicht per leerling en per klas. SLO-voortgang, activiteit, resultaten en wie extra aandacht nodig heeft.',
    },
    {
        illustration: <IllustrationPrivacy />,
        bgColor: BG.sky,
        label: 'Privacy',
        title: 'AVG-compliant by design',
        description: 'Data in Europa, verwerkersovereenkomst en DPIA beschikbaar. Ontworpen voor de EU AI Act.',
    },
    {
        illustration: <IllustrationDevices />,
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
