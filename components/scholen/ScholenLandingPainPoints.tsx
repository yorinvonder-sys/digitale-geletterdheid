/**
 * Pain Points section — data-driven urgency cards that set up the problem
 * before the features section presents the solution.
 *
 * Design: empathetic, factual, backed by research data.
 * Tone: "we begrijpen de uitdaging" — not fear-mongering.
 */
import React from 'react';

/* ── Inline SVG icons (avoid lucide chunk) ── */

const IconAlertTriangle = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconClock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconUsers = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconTrendingDown = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
    </svg>
);

const painPoints = [
    {
        stat: '4,7',
        statLabel: 'Rapportcijfer',
        title: 'Leerlingen scoren onvoldoende op digitale geletterdheid',
        description: 'ICILS 2023 toont aan: 1 op de 3 Nederlandse leerlingen kan niet goed een computer bedienen. De scores voor computational thinking liggen significant onder het internationale gemiddelde.',
        source: 'ICILS 2023, Kohnstamm Instituut',
        icon: <IconTrendingDown />,
        accentBg: 'bg-red-50',
        accentBorder: 'border-red-100',
        accentIcon: 'bg-red-100 text-red-600',
        accentStat: 'text-red-600',
    },
    {
        stat: '2027',
        statLabel: 'Deadline',
        title: 'SLO Kerndoelen worden wettelijk verplicht',
        description: 'Alle VO-scholen moeten digitale geletterdheid implementeren. 50% van de docenten kent de kerndoelen nog niet en slechts 25% werkt er regelmatig mee.',
        source: 'SLO / PO-Raad, 2025',
        icon: <IconClock />,
        accentBg: 'bg-amber-50',
        accentBorder: 'border-amber-100',
        accentIcon: 'bg-amber-100 text-amber-600',
        accentStat: 'text-amber-600',
    },
    {
        stat: '3.800',
        statLabel: 'FTE tekort',
        title: 'Geen vakdocent beschikbaar voor digitale geletterdheid',
        description: 'Het lerarentekort in het VO groeit. Informatica kent een tekort van 117 FTE — precies de docenten die DG zouden moeten geven. 59% van de docenten heeft geen leerlijn.',
        source: 'VO-raad Sectorrapportage, 2025',
        icon: <IconUsers />,
        accentBg: 'bg-orange-50',
        accentBorder: 'border-orange-100',
        accentIcon: 'bg-orange-100 text-orange-600',
        accentStat: 'text-orange-600',
    },
    {
        stat: '0',
        statLabel: 'AI-platforms',
        title: 'Geen enkel platform biedt hands-on AI-geletterdheid',
        description: 'Kerndoel 21D vereist dat leerlingen AI leren trainen, herkennen en kritisch evalueren. Bestaande methodes leren over AI met theorie — niet met AI.',
        source: 'Monitor Digitalisering Onderwijs, 2025',
        icon: <IconAlertTriangle />,
        accentBg: 'bg-violet-50',
        accentBorder: 'border-violet-100',
        accentIcon: 'bg-violet-100 text-violet-600',
        accentStat: 'text-violet-600',
    },
];

export const ScholenLandingPainPoints: React.FC = () => (
    <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
            <p className="text-red-500 font-semibold text-sm mb-3 tracking-wide">De uitdaging</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                Digitale geletterdheid staat onder druk
            </h2>
            <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
                De kerndoelen worden verplicht, maar scholen missen de middelen, de mensen en het materiaal.
                Dit zijn de feiten.
            </p>
        </div>

        {/* Pain point cards — 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {painPoints.map((point) => (
                <div
                    key={point.title}
                    className={`${point.accentBg} ${point.accentBorder} border rounded-2xl p-7 transition-all hover:shadow-lg group`}
                >
                    <div className="flex items-start gap-5">
                        {/* Stat block */}
                        <div className="flex-shrink-0 text-center min-w-[72px]">
                            <div className={`text-3xl font-black ${point.accentStat} leading-none`}>
                                {point.stat}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {point.statLabel}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className={`w-9 h-9 ${point.accentIcon} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    {point.icon}
                                </div>
                                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                                    {point.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-2.5">
                                {point.description}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium italic">
                                Bron: {point.source}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Transition statement — bridges to the solution */}
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-full px-6 py-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-indigo-700">
                    DGSkills is ontworpen om precies deze problemen op te lossen
                </p>
            </div>
        </div>
    </div>
);
