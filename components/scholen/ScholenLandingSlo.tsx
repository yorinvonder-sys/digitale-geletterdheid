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
        name: 'Digitale vaardigheden',
        description: 'Veilig en effectief omgaan met digitale technologie',
        accent: 'bg-blue-600',
        accentBg: 'bg-blue-50',
        accentLight: 'bg-blue-100',
        color: 'text-blue-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
        kerndoelen: [
            { id: 'DV-1', title: 'Digitale apparaten en software doelgericht gebruiken' },
            { id: 'DV-2', title: 'Bestanden organiseren en beheren in de cloud' },
            { id: 'DV-3', title: 'Veilig online communiceren en samenwerken' },
            { id: 'DV-4', title: 'Problemen met digitale technologie oplossen' },
        ],
    },
    {
        name: 'Informatievaardigheden',
        description: 'Informatie zoeken, evalueren en verantwoord gebruiken',
        accent: 'bg-emerald-600',
        accentBg: 'bg-emerald-50',
        accentLight: 'bg-emerald-100',
        color: 'text-emerald-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        kerndoelen: [
            { id: 'IV-1', title: 'Zoekstrategieën inzetten om informatie te vinden' },
            { id: 'IV-2', title: 'Betrouwbaarheid van bronnen beoordelen' },
            { id: 'IV-3', title: 'Informatie verwerken en verantwoord hergebruiken' },
        ],
    },
    {
        name: 'Mediawijsheid',
        description: 'Kritisch en bewust omgaan met media en online content',
        accent: 'bg-violet-600',
        accentBg: 'bg-violet-50',
        accentLight: 'bg-violet-100',
        color: 'text-violet-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
        kerndoelen: [
            { id: 'MW-1', title: 'Media-uitingen analyseren en beoordelen' },
            { id: 'MW-2', title: 'Bewust omgaan met eigen digitale identiteit' },
            { id: 'MW-3', title: 'Herkennen van manipulatie en desinformatie' },
            { id: 'MW-4', title: 'Ethische keuzes maken bij mediaproductie' },
        ],
    },
    {
        name: 'Computational Thinking',
        description: 'Problemen gestructureerd oplossen met technologie',
        accent: 'bg-amber-600',
        accentBg: 'bg-amber-50',
        accentLight: 'bg-amber-100',
        color: 'text-amber-600',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
        kerndoelen: [
            { id: 'CT-1', title: 'Problemen ontleden in kleinere deelproblemen' },
            { id: 'CT-2', title: 'Patronen herkennen en algoritmen formuleren' },
            { id: 'CT-3', title: 'Oplossingen modelleren en testen' },
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
                            Volledig afgestemd op de SLO Kerndoelen 2025
                        </h2>
                        <p className="text-base text-slate-500 leading-relaxed">
                            DGSkills dekt alle vier de domeinen van de SLO-leerlijn Digitale Geletterdheid af.
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
                            <div className="relative w-12 h-12">
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
                <div className="grid md:grid-cols-2 gap-4">
                    {domains.map((domain, idx) => {
                        const isExpanded = expandedDomain === idx;
                        return (
                            <div
                                key={domain.name}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded
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
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${domain.color}`}>Domein</span>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 mb-1">{domain.name}</p>
                                        <p className="text-sm text-slate-500">{domain.description}</p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">{domain.kerndoelen.length} kerndoelen</p>
                                    </div>
                                    <IconChevronDown className={`text-slate-400 flex-shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-0">
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
            </div>
        </div>
    );
};
