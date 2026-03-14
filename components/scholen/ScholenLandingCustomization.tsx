/**
 * Customization USP section — highlights that DGSkills adapts to each school's needs.
 * This is a key differentiator: no two schools are the same, so no two setups should be either.
 *
 * Design: central visual metaphor with surrounding customization pillars.
 * Uses violet/purple accent to stand apart from the indigo features section.
 */
import React, { useState } from 'react';

/* ── Inline SVG icons ── */

/** Schakelaar met sterretje — missies aan/uit zetten */
const IconToggleStar = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="8" width="16" height="8" rx="4"/><circle cx="13" cy="12" r="2.5"/><path d="M20 5l.7 1.5L22.2 7l-1.5.7L20 9.2l-.7-1.5L17.8 7l1.5-.7z"/>
    </svg>
);

/** Trappetje met 3 niveaus — MAVO/HAVO/VWO differentiatie */
const IconSteps = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 18h6v-4h6v-4h6v-4"/><line x1="2" y1="18" x2="2" y2="22"/><line x1="8" y1="14" x2="8" y2="22"/><line x1="14" y1="10" x2="14" y2="22"/><line x1="20" y1="6" x2="20" y2="22"/><line x1="2" y1="22" x2="20" y2="22"/>
    </svg>
);

/** Verrekijker — focus/regie over leerlingen */
const IconBinoculars = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/><path d="M6 13V6a2 2 0 0 1 2-2h1"/><path d="M18 13V6a2 2 0 0 0-2-2h-1"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="9" y1="5" x2="15" y2="5"/>
    </svg>
);

/** Bouwblokken — modulaire opbouw stap voor stap */
const IconBuildingBlocks = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/><rect x="8" y="6" width="8" height="8" rx="1"/><rect x="10" y="2" width="4" height="4" rx="0.5"/>
    </svg>
);

/** Handdruk — persoonlijke relatie met scholen */
const IconHandshake = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 17l-1.5 1.5a2.12 2.12 0 0 1-3 0L4 16a2.12 2.12 0 0 1 0-3L7 10"/><path d="M13 7l1.5-1.5a2.12 2.12 0 0 1 3 0L20 8a2.12 2.12 0 0 1 0 3l-3 3"/><path d="M7 10l5 5"/><path d="M12 15l5-5"/><line x1="2" y1="20" x2="5" y2="17"/><line x1="19" y1="7" x2="22" y2="4"/>
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const customizationPillars = [
    {
        icon: <IconToggleStar />,
        illustration: '/illustrations/custom-toggle.png',
        illustrationAlt: 'Hand die toggle-schakelaars bedient op een dashboard met missie-iconen',
        title: 'Missies op maat',
        description: 'Kies zelf welke missies je aanbiedt. Zet specifieke modules aan of uit op basis van jullie jaarplanning en schoolvisie.',
        highlights: ['Eigen missie-selectie', 'Per vak of periode inplanbaar'],
    },
    {
        icon: <IconSteps />,
        illustration: '/illustrations/custom-levels.png',
        illustrationAlt: 'Drie trappen met MAVO, HAVO en VWO labels, elk met een blije leerling bovenaan',
        title: 'Niveaudifferentiatie',
        description: 'Stel per klas het niveau in: MAVO, HAVO of VWO. DGSkills past de moeilijkheidsgraad automatisch aan per leerling.',
        highlights: ['Per klas instelbaar', 'Adaptief per leerling'],
    },
    {
        icon: <IconBinoculars />,
        illustration: '/illustrations/custom-focus.png',
        illustrationAlt: 'Docent plaatst leermissie-blokken in een weekrooster op een smartboard',
        title: 'Focus Mode voor docenten',
        description: 'Bepaal precies wanneer leerlingen aan welke missie werken. Ideaal voor gestructureerde lessen of open keuzemomenten.',
        highlights: ['Lesuurplanning', 'Klassikaal of individueel'],
    },
    {
        icon: <IconBuildingBlocks />,
        illustration: '/illustrations/custom-modular.png',
        illustrationAlt: 'Handen stapelen bouwblokken met AI, data en code iconen, plantje groeit uit de top',
        title: 'Modulaire opbouw',
        description: 'Start met de domeinen die bij jullie school prioriteit hebben. Breid later uit wanneer jullie er klaar voor zijn.',
        highlights: ['Stap voor stap implementeren', 'Geen alles-of-niets'],
    },
    {
        icon: <IconHandshake />,
        illustration: '/illustrations/custom-contact.png',
        illustrationAlt: 'Docent en platformmaker in gesprek aan een cafétafel met koffie en een roodborstje',
        title: 'Persoonlijk contact',
        description: 'Geen standaard helpdesk. Wij denken actief mee over hoe DGSkills het beste past bij jouw school, curriculum en planning.',
        highlights: ['Onboarding op maat', 'Korte lijnen met de maker'],
    },
];

export const ScholenLandingCustomization: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = customizationPillars[activeIndex];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 text-sm font-medium tracking-wide px-4 py-2 rounded-full mb-5 border" style={{ color: '#D97757', backgroundColor: '#FAF9F0', borderColor: '#E8E6DF' }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#D97757' }} />
                    Ons verschil
                </div>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    Volledig afgestemd op <span style={{ color: '#D97757' }}>jouw school</span>
                </h2>
                <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#6B6B66' }}>
                    Geen twee scholen zijn hetzelfde. Daarom past DGSkills zich aan op jullie visie,
                    planning en curriculum — niet andersom. Jullie bepalen hoe het platform werkt.
                </p>
            </div>

            {/* Interactive showcase — desktop: tabs left + detail right, mobile: accordion */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
                {/* Left: pillar tabs */}
                <div className="md:col-span-1 lg:col-span-2 space-y-3">
                    {customizationPillars.map((pillar, i) => (
                        <button
                            key={pillar.title}
                            onClick={() => setActiveIndex(i)}
                            className={`w-full text-left rounded-2xl p-5 transition-all duration-300 border group ${
                                activeIndex === i
                                    ? 'shadow-lg'
                                    : 'hover:shadow-md'
                            }`}
                            style={{
                                backgroundColor: activeIndex === i ? '#FAF9F0' : '#FFFFFF',
                                borderColor: activeIndex === i ? '#E8E6DF' : '#F0EEE8',
                            }}
                        >
                            <div className="flex items-center gap-3.5">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{
                                        backgroundColor: activeIndex === i ? '#F5F3EC' : '#F5F3EC',
                                        color: activeIndex === i ? '#D97757' : '#9C9C95',
                                    }}
                                >
                                    {pillar.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="text-[15px] font-medium transition-colors"
                                        style={{ color: activeIndex === i ? '#1A1A19' : '#6B6B66' }}
                                    >
                                        {pillar.title}
                                    </h3>
                                    {activeIndex !== i && (
                                        <p className="text-xs mt-0.5 truncate" style={{ color: '#9C9C95' }}>{pillar.description}</p>
                                    )}
                                </div>
                                <div
                                    className="w-2 h-2 rounded-full transition-all flex-shrink-0"
                                    style={{ backgroundColor: activeIndex === i ? '#D97757' : '#E8E6DF' }}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right: detail panel */}
                <div className="md:col-span-2 lg:col-span-3">
                    <div className="rounded-3xl border overflow-hidden h-full flex flex-col justify-center p-8 md:p-10 transition-all duration-300" style={{ backgroundColor: 'transparent', borderColor: '#E8E6DF' }}>
                        {/* Title row with illustration */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                                <img
                                    src={active.illustration}
                                    alt={active.illustrationAlt}
                                    className="w-[3.25rem] h-[3.25rem] object-contain"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-2xl font-medium" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-base leading-relaxed mb-6" style={{ color: '#6B6B66' }}>
                            {active.description}
                        </p>

                        <div className="space-y-3">
                            {active.highlights.map((h) => (
                                <div key={h} className="flex items-center gap-3">
                                    <div
                                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: '#F0EEE8', color: '#D97757' }}
                                    >
                                        <IconCheck />
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#1A1A19' }}>{h}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="mt-14 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl px-8 py-6 border" style={{ backgroundColor: '#FAF9F0', borderColor: '#E8E6DF' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A19' }}>
                        Benieuwd hoe DGSkills past bij jullie school?
                    </p>
                    <a
                        href="#gratis-pilot"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('gratis-pilot')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 flex items-center gap-2"
                        style={{ backgroundColor: '#D97757' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C46849')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D97757')}
                    >
                        Plan een gesprek
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
