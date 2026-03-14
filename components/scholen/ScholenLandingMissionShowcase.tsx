import React, { useState } from 'react';

// Static mission data to keep landing page lightweight (no heavy agents.tsx import)
interface ShowcaseMission {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    color: string;
    iconLabel: string; // emoji as lightweight icon
}

interface ShowcasePeriod {
    title: string;
    missions: ShowcaseMission[];
}

interface ShowcaseYear {
    label: string;
    subtitle: string;
    themeColor: string;
    themeBg: string;
    themeBorder: string;
    periods: ShowcasePeriod[];
}

const YEARS: ShowcaseYear[] = [
    {
        label: 'Leerjaar 1',
        subtitle: 'Digitale Basis',
        themeColor: '#4F46E5',
        themeBg: '#EEF2FF',
        themeBorder: '#C7D2FE',
        periods: [
            {
                title: 'Digitale Basisvaardigheden',
                missions: [
                    { title: 'Magister Meester', description: 'Word de baas over je rooster en cijfers', difficulty: 'Easy', color: '#3B82F6', iconLabel: '🛡️' },
                    { title: 'Cloud Commander', description: 'Organiseer je bestanden als een pro', difficulty: 'Easy', color: '#6366F1', iconLabel: '☁️' },
                    { title: 'Word Wizard', description: 'Maak documenten die indruk maken', difficulty: 'Easy', color: '#8B5CF6', iconLabel: '✏️' },
                    { title: 'Slide Specialist', description: 'Bouw presentaties die overtuigen', difficulty: 'Easy', color: '#EC4899', iconLabel: '🎬' },
                    { title: 'Print Pro', description: 'Print perfect, elke keer', difficulty: 'Easy', color: '#06B6D4', iconLabel: '🖨️' },
                ],
            },
            {
                title: 'AI & Creatie',
                missions: [
                    { title: 'Prompt Master', description: 'Leer de perfecte prompt schrijven', difficulty: 'Medium', color: '#D97757', iconLabel: '✨' },
                    { title: 'Game Programmeur', description: 'Hack games met echte code', difficulty: 'Hard', color: '#10B981', iconLabel: '🎮' },
                    { title: 'AI Trainer', description: 'Train een AI om afval te sorteren', difficulty: 'Medium', color: '#D97757', iconLabel: '🤖' },
                    { title: 'Chatbot Trainer', description: 'Bouw en train je eigen chatbot', difficulty: 'Medium', color: '#8B5CF6', iconLabel: '💬' },
                    { title: 'Verhalen Ontwerper', description: 'Schrijf interactieve verhalen met AI', difficulty: 'Medium', color: '#EC4899', iconLabel: '📖' },
                    { title: 'Game Director', description: 'Ontwerp en regisseer je eigen game', difficulty: 'Hard', color: '#10B981', iconLabel: '🎯' },
                    { title: 'AI Tekengame', description: 'Teken en laat AI raden wat het is', difficulty: 'Easy', color: '#F59E0B', iconLabel: '🎨' },
                    { title: 'AI Beleid Brainstorm', description: 'Bedenk regels voor AI op school', difficulty: 'Medium', color: '#6366F1', iconLabel: '📋' },
                ],
            },
            {
                title: 'Digitaal Burgerschap',
                missions: [
                    { title: 'Data Detective', description: 'Ontdek welke data bedrijven verzamelen', difficulty: 'Medium', color: '#3B82F6', iconLabel: '🔍' },
                    { title: 'Deepfake Detector', description: 'Herken nep van echt', difficulty: 'Hard', color: '#EF4444', iconLabel: '⚠️' },
                    { title: 'AI Spiegel', description: 'Ontdek hoe AI jou ziet', difficulty: 'Medium', color: '#8B5CF6', iconLabel: '🪞' },
                    { title: 'Social Safeguard', description: 'Bescherm je online identiteit', difficulty: 'Medium', color: '#F59E0B', iconLabel: '🛡️' },
                    { title: 'Cookie Crusher', description: 'Begrijp en beheer cookies', difficulty: 'Easy', color: '#10B981', iconLabel: '🍪' },
                    { title: 'Data Handelaar', description: 'Ontdek de waarde van jouw data', difficulty: 'Medium', color: '#D97757', iconLabel: '💰' },
                    { title: 'Privacy Profiel Spiegel', description: 'Zie je digitale voetafdruk', difficulty: 'Medium', color: '#6366F1', iconLabel: '👤' },
                    { title: 'Filter Bubble Breaker', description: 'Doorbreek je online bubbel', difficulty: 'Hard', color: '#EC4899', iconLabel: '🫧' },
                    { title: 'Datalekken Rampenplan', description: 'Maak een plan voor als het misgaat', difficulty: 'Hard', color: '#EF4444', iconLabel: '🚨' },
                    { title: 'Data voor Data', description: 'Onderhandel over je privacy', difficulty: 'Medium', color: '#3B82F6', iconLabel: '⚖️' },
                ],
            },
            {
                title: 'Eindproject',
                missions: [
                    { title: 'De Blauwdruk', description: 'Ontwerp je eigen missie', difficulty: 'Medium', color: '#4F46E5', iconLabel: '📐' },
                    { title: 'De Visie', description: 'Presenteer je creatieve visie', difficulty: 'Medium', color: '#7C3AED', iconLabel: '💡' },
                    { title: 'De Lancering', description: 'Lanceer je eindproject', difficulty: 'Hard', color: '#10B981', iconLabel: '🚀' },
                ],
            },
        ],
    },
    {
        label: 'Leerjaar 2',
        subtitle: 'Digitale Verdieping',
        themeColor: '#059669',
        themeBg: '#ECFDF5',
        themeBorder: '#A7F3D0',
        periods: [
            {
                title: 'Data & Informatie',
                missions: [
                    { title: 'Data Journalist', description: 'Vertel verhalen met data', difficulty: 'Medium', color: '#3B82F6', iconLabel: '📊' },
                    { title: 'Spreadsheet Specialist', description: 'Word een Excel-expert', difficulty: 'Medium', color: '#10B981', iconLabel: '📈' },
                    { title: 'Factchecker', description: 'Scheid feiten van fictie', difficulty: 'Medium', color: '#EF4444', iconLabel: '✅' },
                    { title: 'API Verkenner', description: 'Ontdek hoe apps met elkaar praten', difficulty: 'Hard', color: '#6366F1', iconLabel: '🔗' },
                    { title: 'Dashboard Designer', description: 'Visualiseer data als een pro', difficulty: 'Medium', color: '#8B5CF6', iconLabel: '📉' },
                    { title: 'AI Bias Detective', description: 'Ontdek vooroordelen in AI', difficulty: 'Hard', color: '#D97757', iconLabel: '⚖️' },
                ],
            },
            {
                title: 'Programmeren & Computational Thinking',
                missions: [
                    { title: 'Algorithm Architect', description: 'Ontwerp slimme algoritmes', difficulty: 'Hard', color: '#4F46E5', iconLabel: '🧩' },
                    { title: 'Web Developer', description: 'Bouw je eerste website', difficulty: 'Medium', color: '#3B82F6', iconLabel: '🌐' },
                    { title: 'App Prototyper', description: 'Ontwerp een app-prototype', difficulty: 'Medium', color: '#EC4899', iconLabel: '📱' },
                    { title: 'Bug Hunter', description: 'Vind en fix bugs in code', difficulty: 'Hard', color: '#EF4444', iconLabel: '🐛' },
                    { title: 'Automation Engineer', description: 'Automatiseer saaie taken', difficulty: 'Medium', color: '#F59E0B', iconLabel: '⚡' },
                    { title: 'Code Reviewer', description: 'Beoordeel code als een senior dev', difficulty: 'Hard', color: '#10B981', iconLabel: '👨‍💻' },
                ],
            },
            {
                title: 'Digitale Media & Creatie',
                missions: [
                    { title: 'UX Detective', description: 'Ontdek wat gebruikers echt willen', difficulty: 'Medium', color: '#8B5CF6', iconLabel: '🕵️' },
                    { title: 'Podcast Producer', description: 'Maak je eigen podcast', difficulty: 'Medium', color: '#EC4899', iconLabel: '🎙️' },
                    { title: 'Meme Machine', description: 'Maak memes met een boodschap', difficulty: 'Easy', color: '#F59E0B', iconLabel: '😂' },
                    { title: 'Digital Storyteller', description: 'Vertel digitale verhalen', difficulty: 'Medium', color: '#D97757', iconLabel: '📚' },
                    { title: 'Brand Builder', description: 'Bouw een sterk merk', difficulty: 'Medium', color: '#6366F1', iconLabel: '🏷️' },
                    { title: 'Video Editor', description: 'Maak professionele videos', difficulty: 'Hard', color: '#EF4444', iconLabel: '🎥' },
                ],
            },
            {
                title: 'Ethiek & Eindproject',
                missions: [
                    { title: 'AI Ethicus', description: 'Debatteer over AI-dilemmas', difficulty: 'Hard', color: '#7C3AED', iconLabel: '🧠' },
                    { title: 'Digital Rights Defender', description: 'Verdedig digitale rechten', difficulty: 'Medium', color: '#3B82F6', iconLabel: '⚔️' },
                    { title: 'Tech Court', description: 'Voer een tech-rechtszaak', difficulty: 'Hard', color: '#1F2937', iconLabel: '⚖️' },
                    { title: 'Future Forecaster', description: 'Voorspel de digitale toekomst', difficulty: 'Medium', color: '#6366F1', iconLabel: '🔮' },
                    { title: 'Sustainability Scanner', description: 'Meet de impact van tech op het milieu', difficulty: 'Medium', color: '#10B981', iconLabel: '🌱' },
                    { title: 'Eindproject Jaar 2', description: 'Toon al je vaardigheden', difficulty: 'Hard', color: '#D97757', iconLabel: '🏆' },
                ],
            },
        ],
    },
    {
        label: 'Leerjaar 3',
        subtitle: 'Digitale Meesterschap',
        themeColor: '#7C3AED',
        themeBg: '#F5F3FF',
        themeBorder: '#C4B5FD',
        periods: [
            {
                title: 'Geavanceerd Programmeren & AI',
                missions: [
                    { title: 'ML Trainer', description: 'Train machine learning modellen', difficulty: 'Hard', color: '#4F46E5', iconLabel: '🧬' },
                    { title: 'API Architect', description: 'Ontwerp professionele APIs', difficulty: 'Hard', color: '#3B82F6', iconLabel: '🏗️' },
                    { title: 'Neural Navigator', description: 'Verken neurale netwerken', difficulty: 'Hard', color: '#8B5CF6', iconLabel: '🧠' },
                    { title: 'Data Pipeline', description: 'Bouw datastromen die werken', difficulty: 'Hard', color: '#10B981', iconLabel: '🔄' },
                    { title: 'Open Source Contributor', description: 'Draag bij aan echte projecten', difficulty: 'Hard', color: '#1F2937', iconLabel: '🌍' },
                ],
            },
            {
                title: 'Cybersecurity & Privacy',
                missions: [
                    { title: 'Cyber Detective', description: 'Los digitale misdaden op', difficulty: 'Hard', color: '#EF4444', iconLabel: '🔐' },
                    { title: 'Encryption Expert', description: 'Leer de kunst van versleuteling', difficulty: 'Hard', color: '#6366F1', iconLabel: '🔑' },
                    { title: 'Phishing Fighter', description: 'Herken en bestrijk phishing', difficulty: 'Medium', color: '#F59E0B', iconLabel: '🎣' },
                    { title: 'Security Auditor', description: 'Audit systemen op zwakke plekken', difficulty: 'Hard', color: '#1F2937', iconLabel: '🛡️' },
                    { title: 'Digital Forensics', description: 'Onderzoek digitale sporen', difficulty: 'Hard', color: '#7C3AED', iconLabel: '🔬' },
                ],
            },
            {
                title: 'Maatschappelijke Impact & Innovatie',
                missions: [
                    { title: 'Startup Simulator', description: 'Start je eigen tech-bedrijf', difficulty: 'Hard', color: '#10B981', iconLabel: '🚀' },
                    { title: 'Policy Maker', description: 'Schrijf tech-beleid voor de toekomst', difficulty: 'Hard', color: '#3B82F6', iconLabel: '📜' },
                    { title: 'Innovation Lab', description: 'Innoveer met nieuwe technologie', difficulty: 'Hard', color: '#EC4899', iconLabel: '💡' },
                    { title: 'Digital Divide Researcher', description: 'Onderzoek de digitale kloof', difficulty: 'Medium', color: '#D97757', iconLabel: '🔍' },
                    { title: 'Tech Impact Analyst', description: 'Analyseer de impact van tech', difficulty: 'Hard', color: '#6366F1', iconLabel: '📊' },
                ],
            },
            {
                title: 'Meesterproef',
                missions: [
                    { title: 'Portfolio Builder', description: 'Bouw je digitale portfolio', difficulty: 'Medium', color: '#8B5CF6', iconLabel: '📁' },
                    { title: 'Research Project', description: 'Voer zelfstandig onderzoek uit', difficulty: 'Hard', color: '#3B82F6', iconLabel: '🔬' },
                    { title: 'Prototype Developer', description: 'Bouw een werkend prototype', difficulty: 'Hard', color: '#10B981', iconLabel: '⚙️' },
                    { title: 'Pitch Perfect', description: 'Presenteer als een TED-spreker', difficulty: 'Hard', color: '#EC4899', iconLabel: '🎤' },
                    { title: 'Meesterproef', description: 'Jouw digitale meesterwerk', difficulty: 'Hard', color: '#7C3AED', iconLabel: '🏆' },
                ],
            },
        ],
    },
];

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    Easy: { bg: '#DCFCE7', text: '#166534', label: 'Makkelijk' },
    Medium: { bg: '#FEF3C7', text: '#92400E', label: 'Gemiddeld' },
    Hard: { bg: '#FEE2E2', text: '#991B1B', label: 'Uitdagend' },
};

export const ScholenLandingMissionShowcase: React.FC = () => {
    const [activeYear, setActiveYear] = useState(0);
    const year = YEARS[activeYear];

    const totalMissions = YEARS.reduce(
        (sum, y) => sum + y.periods.reduce((s, p) => s + p.missions.length, 0),
        0
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: '#D97757' }}>
                    {totalMissions}+ missies
                </p>
                <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#1A1A19' }}
                >
                    Ontdek alle missies
                </h2>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: '#6B6B66' }}>
                    Van basisvaardigheden tot AI-meesterschap — een compleet leerpad van 3 jaar
                    digitale geletterdheid, afgestemd op de SLO-kerndoelen.
                </p>
            </div>

            {/* Year tabs */}
            <div className="flex justify-center gap-2 mb-8">
                {YEARS.map((y, i) => {
                    const isActive = i === activeYear;
                    return (
                        <button
                            key={i}
                            onClick={() => setActiveYear(i)}
                            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                            style={{
                                backgroundColor: isActive ? y.themeColor : '#F5F3EC',
                                color: isActive ? '#FFFFFF' : '#6B6B66',
                            }}
                        >
                            <span className="hidden sm:inline">{y.label} — </span>
                            {y.subtitle}
                        </button>
                    );
                })}
            </div>

            {/* Periods grid */}
            <div className="space-y-6">
                {year.periods.map((period, pi) => (
                    <div key={pi}>
                        {/* Period header */}
                        <div className="flex items-center gap-3 mb-3">
                            <span
                                className="text-xs font-bold px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: year.themeBg, color: year.themeColor, border: `1px solid ${year.themeBorder}` }}
                            >
                                Periode {pi + 1}
                            </span>
                            <h3 className="text-sm font-medium" style={{ color: '#1A1A19' }}>
                                {period.title}
                            </h3>
                            <span className="text-xs" style={{ color: '#9C9C95' }}>
                                {period.missions.length} missies
                            </span>
                        </div>

                        {/* Mission cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                            {period.missions.map((mission, mi) => {
                                const diff = DIFFICULTY_STYLES[mission.difficulty];
                                return (
                                    <div
                                        key={mi}
                                        className="group relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                        style={{ borderColor: '#E8E6DF', backgroundColor: '#FFFFFF' }}
                                    >
                                        {/* Icon */}
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                                            style={{ backgroundColor: `${mission.color}12` }}
                                        >
                                            {mission.iconLabel}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-medium text-sm truncate" style={{ color: '#1A1A19' }}>
                                                    {mission.title}
                                                </span>
                                            </div>
                                            <p className="text-xs leading-relaxed mb-1.5 line-clamp-1" style={{ color: '#6B6B66' }}>
                                                {mission.description}
                                            </p>
                                            <span
                                                className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                style={{ backgroundColor: diff.bg, color: diff.text }}
                                            >
                                                {diff.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom stat */}
            <div className="mt-10 text-center">
                <p className="text-sm" style={{ color: '#9C9C95' }}>
                    {YEARS[activeYear].periods.reduce((s, p) => s + p.missions.length, 0)} missies in {YEARS[activeYear].label.toLowerCase()} ·{' '}
                    {totalMissions} missies totaal over 3 leerjaren
                </p>
            </div>
        </div>
    );
};
