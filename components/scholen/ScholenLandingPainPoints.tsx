/**
 * Pain Points section — data-driven urgency cards that set up the problem
 * before the features section presents the solution.
 *
 * Design: empathetic, factual, backed by research data.
 * Tone: "we begrijpen de uitdaging" — not fear-mongering.
 */
import React from 'react';

/* ── Inline SVG icons (avoid lucide chunk) ── */

/** Gebroken meetlat — leerlingen scoren onvoldoende */
const IconBrokenRuler = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 20 L9 13 L11 15 L13 11 L22 4"/><line x1="3" y1="4" x2="3" y2="7"/><line x1="7" y1="4" x2="7" y2="6"/><line x1="11" y1="4" x2="11" y2="7"/><line x1="15" y1="4" x2="15" y2="6"/><line x1="19" y1="4" x2="19" y2="7"/><line x1="2" y1="4" x2="21" y2="4"/>
    </svg>
);

/** Zandloper — deadline raakt op */
const IconHourglass = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
    </svg>
);

/** Leeg katheder — docent ontbreekt */
const IconEmptyDesk = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="10" width="18" height="2" rx="1"/><line x1="6" y1="12" x2="6" y2="20"/><line x1="18" y1="12" x2="18" y2="20"/><circle cx="12" cy="5" r="2.5" strokeDasharray="3 2"/><line x1="10" y1="4" x2="14" y2="6" />
    </svg>
);

/** Ontbrekend puzzelstuk — geen AI-platform beschikbaar */
const IconMissingPiece = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h6v2.5a2 2 0 1 0 4 0V4h6v6h-2.5a2 2 0 1 0 0 4H20v6H4V4z"/><path d="M15 15l4 4M15 19l4-4" strokeWidth="2"/>
    </svg>
);

const painPoints = [
    {
        stat: '4,7',
        statLabel: 'Rapportcijfer',
        title: 'Leerlingen scoren onvoldoende op digitale geletterdheid',
        description: 'Nederlandse docenten gaven hun leerlingen gemiddeld een 4,7 voor digitale geletterdheid. ICILS 2023 bevestigt: 1 op de 3 leerlingen scoort onder basisniveau op computergebruik; CT-scores liggen significant onder het internationaal gemiddelde.',
        source: 'Monitor Digitale Geletterdheid 2023, DUO/ECP; ICILS 2023, Kohnstamm Instituut',
        icon: <IconBrokenRuler />,
        accentBg: 'bg-red-50',
        accentBorder: 'border-red-100',
        accentIcon: 'bg-red-100 text-red-600',
        accentStat: 'text-red-600',
    },
    {
        stat: '2027',
        statLabel: 'Verplicht',
        title: 'SLO Kerndoelen worden wettelijk verplicht',
        description: 'Per 1 augustus 2027 zijn de kerndoelen digitale geletterdheid wettelijk verplicht voor alle VO-scholen, met implementatieperiode tot 2031. 52% van de VO-docenten werkt nu zonder leerlijn én zonder leerdoelen. Slechts 11% hanteert een formele leerlijn.',
        source: 'ECP Monitor Digitale Geletterdheid VO, 2021; Kamerbrief OCW, september 2025',
        icon: <IconHourglass />,
        accentBg: 'bg-amber-50',
        accentBorder: 'border-amber-100',
        accentIcon: 'bg-amber-100 text-amber-600',
        accentStat: 'text-amber-600',
    },
    {
        stat: '3.800',
        statLabel: 'FTE tekort',
        title: 'Geen vakdocent beschikbaar voor digitale geletterdheid',
        description: 'Het lerarentekort in het VO bedraagt 3.800 FTE. Informatica heeft het hoogste relatieve tekort: 10% van de werkgelegenheid is onvervuld (prognose: 117 FTE in 2029). 52% van de VO-docenten heeft geen leerlijn voor digitale geletterdheid.',
        source: 'Trendrapportage Arbeidsmarkt Leraren 2024, Centerdata/OCW; ECP Monitor VO, 2021',
        icon: <IconEmptyDesk />,
        accentBg: 'bg-orange-50',
        accentBorder: 'border-orange-100',
        accentIcon: 'bg-orange-100 text-orange-600',
        accentStat: 'text-orange-600',
    },
    {
        stat: '1e',
        statLabel: 'In Nederland',
        title: 'Bestaande platforms bieden geen hands-on AI-omgeving voor leerlingen',
        description: 'Kerndoel 21D vereist dat leerlingen mogelijkheden en beperkingen van AI verkennen. Bestaande methodes (DIGIT-vo, Basicly) behandelen AI theoretisch. DGSkills is het eerste platform met een eigen hands-on AI-omgeving geïntegreerd in het curriculum.',
        source: 'SLO Conceptkerndoelen Digitale Geletterdheid, juli 2025; eigen marktonderzoek',
        icon: <IconMissingPiece />,
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
                De kerndoelen worden naar verwachting per 2027 verplicht, maar scholen missen de middelen, de mensen en het materiaal.
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
