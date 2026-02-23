/**
 * Customization USP section — highlights that DGSkills adapts to each school's needs.
 * This is a key differentiator: no two schools are the same, so no two setups should be either.
 *
 * Design: central visual metaphor with surrounding customization pillars.
 * Uses violet/purple accent to stand apart from the indigo features section.
 */
import React, { useState } from 'react';

/* ── Inline SVG icons ── */

const IconSliders = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const IconLayers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
);

const IconUsers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconPuzzle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
    </svg>
);

const IconMessageCircle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const customizationPillars = [
    {
        icon: <IconSliders />,
        title: 'Missies op maat',
        description: 'Kies zelf welke missies je aanbiedt. Zet specifieke modules aan of uit op basis van jullie jaarplanning en schoolvisie.',
        highlights: ['Eigen missie-selectie', 'Per vak of periode inplanbaar'],
        color: 'violet',
        bgClass: 'from-violet-50 to-white',
        borderClass: 'border-violet-100/50',
        iconBg: 'bg-violet-100 text-violet-600',
        dotClass: 'bg-violet-500',
    },
    {
        icon: <IconLayers />,
        title: 'Niveaudifferentiatie',
        description: 'Stel per klas het niveau in: MAVO, HAVO of VWO. DGSkills past de moeilijkheidsgraad automatisch aan per leerling.',
        highlights: ['Per klas instelbaar', 'Adaptief per leerling'],
        color: 'fuchsia',
        bgClass: 'from-fuchsia-50 to-white',
        borderClass: 'border-fuchsia-100/50',
        iconBg: 'bg-fuchsia-100 text-fuchsia-600',
        dotClass: 'bg-fuchsia-500',
    },
    {
        icon: <IconUsers />,
        title: 'Focus Mode voor docenten',
        description: 'Bepaal precies wanneer leerlingen aan welke missie werken. Ideaal voor gestructureerde lessen of open keuzemomenten.',
        highlights: ['Lesuurplanning', 'Klassikaal of individueel'],
        color: 'purple',
        bgClass: 'from-purple-50 to-white',
        borderClass: 'border-purple-100/50',
        iconBg: 'bg-purple-100 text-purple-600',
        dotClass: 'bg-purple-500',
    },
    {
        icon: <IconPuzzle />,
        title: 'Modulaire opbouw',
        description: 'Start met de domeinen die bij jullie school prioriteit hebben. Breid later uit wanneer jullie er klaar voor zijn.',
        highlights: ['Stap voor stap implementeren', 'Geen alles-of-niets'],
        color: 'indigo',
        bgClass: 'from-indigo-50 to-white',
        borderClass: 'border-indigo-100/50',
        iconBg: 'bg-indigo-100 text-indigo-600',
        dotClass: 'bg-indigo-500',
    },
    {
        icon: <IconMessageCircle />,
        title: 'Persoonlijk contact',
        description: 'Geen standaard helpdesk. Wij denken actief mee over hoe DGSkills het beste past bij jouw school, curriculum en planning.',
        highlights: ['Onboarding op maat', 'Korte lijnen met de maker'],
        color: 'sky',
        bgClass: 'from-sky-50 to-white',
        borderClass: 'border-sky-100/50',
        iconBg: 'bg-sky-100 text-sky-600',
        dotClass: 'bg-sky-500',
    },
];

export const ScholenLandingCustomization: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = customizationPillars[activeIndex];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-violet-100">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                    Ons verschil
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Volledig afgestemd op <span className="text-violet-600">jouw school</span>
                </h2>
                <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
                    Geen twee scholen zijn hetzelfde. Daarom past DGSkills zich aan op jullie visie,
                    planning en curriculum — niet andersom. Jullie bepalen hoe het platform werkt.
                </p>
            </div>

            {/* Interactive showcase — desktop: tabs left + detail right, mobile: accordion */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
                {/* Left: pillar tabs */}
                <div className="lg:col-span-2 space-y-3">
                    {customizationPillars.map((pillar, i) => (
                        <button
                            key={pillar.title}
                            onClick={() => setActiveIndex(i)}
                            className={`w-full text-left rounded-2xl p-5 transition-all duration-300 border group ${
                                activeIndex === i
                                    ? `bg-gradient-to-br ${pillar.bgClass} ${pillar.borderClass} shadow-lg`
                                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                                    activeIndex === i ? pillar.iconBg : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {pillar.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-[15px] font-bold transition-colors ${
                                        activeIndex === i ? 'text-slate-900' : 'text-slate-600'
                                    }`}>
                                        {pillar.title}
                                    </h3>
                                    {activeIndex !== i && (
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{pillar.description}</p>
                                    )}
                                </div>
                                <div className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
                                    activeIndex === i ? pillar.dotClass : 'bg-slate-200'
                                }`} />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right: detail panel */}
                <div className="lg:col-span-3">
                    <div className={`bg-gradient-to-br ${active.bgClass} rounded-3xl border ${active.borderClass} p-8 md:p-10 h-full flex flex-col justify-center transition-all duration-300`}>
                        <div className={`w-16 h-16 ${active.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                            {active.icon}
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            {active.title}
                        </h3>

                        <p className="text-base text-slate-500 leading-relaxed mb-8">
                            {active.description}
                        </p>

                        <div className="space-y-3">
                            {active.highlights.map((h) => (
                                <div key={h} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg ${active.iconBg} flex items-center justify-center flex-shrink-0`}>
                                        <IconCheck />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{h}</span>
                                </div>
                            ))}
                        </div>

                        {/* Visual accent — mini mockup of customization */}
                        <div className="mt-8 pt-8 border-t border-slate-200/50">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-violet-600 text-[9px] font-bold">MA</div>
                                    <div className="w-7 h-7 rounded-full bg-fuchsia-200 border-2 border-white flex items-center justify-center text-fuchsia-600 text-[9px] font-bold">HA</div>
                                    <div className="w-7 h-7 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-indigo-600 text-[9px] font-bold">VW</div>
                                </div>
                                <span className="font-medium">Elk niveau, elke school, elk tempo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="mt-14 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-purple-50 border border-violet-100 rounded-2xl px-8 py-6">
                    <p className="text-sm font-semibold text-slate-700">
                        Benieuwd hoe DGSkills past bij jullie school?
                    </p>
                    <a
                        href="#gratis-pilot"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('gratis-pilot')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/30 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        Plan een gesprek
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
