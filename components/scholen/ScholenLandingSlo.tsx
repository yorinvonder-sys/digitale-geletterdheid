/**
 * SLO Kerndoelen section — visually rich with expandable domains.
 */
import React, { useState } from 'react';

interface SloKerndoel {
    id: string;
    title: string;
}

interface SloDomain {
    name: string;
    description: string;
    accent: string;
    accentBg: string;
    accentLight: string;
    color: string;
    icon: React.ReactNode;
    kerndoelen: SloKerndoel[];
}

const IconChevronDown = ({ className = '' }: { className?: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const domains: SloDomain[] = [
    {
        name: 'Digitale systemen, media, data en AI',
        description: 'Functioneel inzetten van digitale systemen, media, data en kunstmatige intelligentie',
        accent: 'bg-indigo-600',
        accentBg: 'bg-indigo-50',
        accentLight: 'bg-indigo-100',
        color: 'text-indigo-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><line x1="6" y1="8" x2="12" y2="16"/><line x1="18" y1="8" x2="12" y2="16"/><line x1="8" y1="6" x2="16" y2="6"/><path d="M12 12l-2-1.5"/><path d="M12 12l2-1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
        kerndoelen: [
            { id: '21A', title: 'De leerling zet digitale systemen functioneel in' },
            { id: '21B', title: 'De leerling navigeert doelgericht in het digitale media- en informatielandschap' },
            { id: '21C', title: 'De leerling verkent het gebruik van data en dataverwerking' },
            { id: '21D', title: 'De leerling verkent mogelijkheden en beperkingen van AI' },
        ],
    },
    {
        name: 'Digitale producten en programmeren',
        description: 'Ontwerpen, maken en programmeren van digitale producten',
        accent: 'bg-emerald-600',
        accentBg: 'bg-emerald-50',
        accentLight: 'bg-emerald-100',
        color: 'text-emerald-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><path d="M11 12h2"/><path d="M5 12H2"/><path d="M22 12h-3"/><path d="M8 9V4l-2 2"/><path d="M16 15v5l2-2"/></svg>,
        kerndoelen: [
            { id: '22A', title: 'De leerling gebruikt passende werkwijzen bij het creëren van digitale producten' },
            { id: '22B', title: 'De leerling programmeert met behulp van computationele denkstrategieën' },
        ],
    },
    {
        name: 'Veiligheid, welzijn en maatschappij',
        description: 'Veilig, verantwoord en bewust omgaan met digitale technologie in de samenleving',
        accent: 'bg-amber-600',
        accentBg: 'bg-amber-50',
        accentLight: 'bg-amber-100',
        color: 'text-amber-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2.5"/><path d="M9.5 11c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" /><line x1="12" y1="13.5" x2="12" y2="15"/></svg>,
        kerndoelen: [
            { id: '23A', title: 'De leerling gaat veilig om met digitale systemen, data en privacy' },
            { id: '23B', title: 'De leerling maakt weloverwogen keuzes bij het gebruik van digitale technologie' },
            { id: '23C', title: 'De leerling analyseert hoe digitale technologie en de samenleving elkaar beïnvloeden' },
        ],
    },
];

const totalKerndoelen = domains.reduce((sum, d) => sum + d.kerndoelen.length, 0);

export const ScholenLandingSlo: React.FC = () => {
    const [expandedDomain, setExpandedDomain] = useState<number | null>(null);

    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <div className="md:flex md:items-start md:justify-between md:gap-16 mb-14">
                    <div className="max-w-lg mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                            Afgestemd op de SLO-conceptkerndoelen 2025
                        </h2>
                        <p className="text-base text-slate-500 leading-relaxed">
                            DGSkills dekt alle drie de domeinen van de SLO-leerlijn Digitale Geletterdheid af.
                            Docenten exporteren voortgangsrapporten voor verantwoording aan inspectie en schoolleiding.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex flex-wrap gap-2">
                            {['MAVO', 'HAVO', 'VWO'].map(level => (
                                <span key={level} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md">{level}</span>
                            ))}
                        </div>
                        {/* Progress indicator */}
                        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-4 shadow-sm">
                            <div className="relative w-12 h-12" role="img" aria-label="100% van alle kerndoelen gedekt">
                                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                    <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                    <circle cx="24" cy="24" r="20" fill="none" stroke="#4f46e5" strokeWidth="4"
                                        strokeDasharray={`${2 * Math.PI * 20}`}
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-indigo-600">100%</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{totalKerndoelen} van {totalKerndoelen}</p>
                                <p className="text-[11px] text-slate-400">Kerndoelen gedekt</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Domain cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    {domains.map((domain, idx) => {
                        const isExpanded = expandedDomain === idx;
                        return (
                            <div
                                key={domain.name}
                                className={`rounded-2xl border transition-[background-color,box-shadow,border-color] duration-300 overflow-hidden ${isExpanded
                                    ? `${domain.accentBg} border-slate-200 shadow-lg`
                                    : 'bg-white border-slate-200/80 hover:shadow-md hover:border-slate-300'
                                    }`}
                            >
                                <button
                                    onClick={() => setExpandedDomain(isExpanded ? null : idx)}
                                    className="w-full p-6 flex items-start gap-4 text-left"
                                    aria-expanded={isExpanded}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${domain.accentLight} ${domain.color} flex items-center justify-center flex-shrink-0`}>
                                        {domain.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-1.5 h-4 rounded-full ${domain.accent}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${domain.color}`}>Domein {idx === 0 ? '21' : idx === 1 ? '22' : '23'}</span>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 mb-1">{domain.name}</p>
                                        <p className="text-sm text-slate-500">{domain.description}</p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">{domain.kerndoelen.length} kerndoelen</p>
                                    </div>
                                    <IconChevronDown className={`text-slate-400 flex-shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {isExpanded && (
                                    <div id={`domain-panel-${idx}`} className="px-6 pb-6 pt-0">
                                        <div className="border-t border-slate-200/60 pt-4 space-y-2.5">
                                            {domain.kerndoelen.map(kd => (
                                                <div key={kd.id} className="flex items-start gap-3 bg-white/80 rounded-xl px-4 py-3 border border-slate-100">
                                                    <div className={`w-5 h-5 rounded-full ${domain.accentLight} ${domain.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                        <IconCheck />
                                                    </div>
                                                    <div>
                                                        <span className={`text-[10px] font-bold ${domain.color} uppercase tracking-widest`}>{kd.id}</span>
                                                        <p className="text-sm text-slate-700 font-medium leading-snug">{kd.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-slate-400 mt-6 text-center">De kerndoelen zijn gebaseerd op de SLO-conceptkerndoelen (september 2025). Definitieve vaststelling volgt via een AMvB.</p>
            </div>
        </div>
    );
};
