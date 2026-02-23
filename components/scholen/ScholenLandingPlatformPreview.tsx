import React, { useState, useEffect, useRef, useCallback } from 'react';

interface JourneyStep {
    src: string;
    alt: string;
    title: string;
    description: string;
    stepLabel: string;
    icon: React.ReactNode;
    accentColor: string;
    accentBg: string;
    /** Override object-fit for this step's image. Defaults to 'cover' */
    objectFit?: 'cover' | 'contain';
    /** Override object-position. Defaults to 'top' */
    objectPosition?: string;
}

const journeySteps: JourneyStep[] = [
    {
        src: '/screenshots/student-mission-overview.png',
        alt: 'Missie Overzicht — kies een missie en begin je reis',
        title: 'Kies je missie',
        description: 'Leerlingen starten hun reis door een missie te kiezen. Elke missie brengt ze dichter bij het certificaat Digitale Expert.',
        stepLabel: 'Stap 1',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        accentColor: 'text-indigo-600',
        accentBg: 'bg-indigo-50',
    },
    {
        src: '/screenshots/avatar-customization.png',
        alt: 'Avatar aanpassen — maak je eigen 3D-karakter',
        title: 'Maak je avatar',
        description: 'Personaliseer je eigen 3D-avatar. Jouw digitale ik in het digitale lab — dat maakt het persoonlijk en leuk.',
        stepLabel: 'Stap 2',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        accentColor: 'text-purple-600',
        accentBg: 'bg-purple-50',
        objectFit: 'contain',
        objectPosition: 'center',
    },
    {
        src: '/screenshots/prompt-master.png',
        alt: 'Prompt Master — leer de juiste prompts schrijven voor AI',
        title: 'Speel AI games',
        description: 'Van Prompt Master tot AI Tekengame — leerlingen leren over AI door interactieve, uitdagende games te spelen.',
        stepLabel: 'Stap 3',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 12h4m4 0h4M6 12a6 6 0 0 0 12 0M6 12a6 6 0 0 1 12 0" />
                <rect x="2" y="6" width="20" height="12" rx="6" />
            </svg>
        ),
        accentColor: 'text-amber-600',
        accentBg: 'bg-amber-50',
    },
    {
        src: '/screenshots/student-progress-xp.png',
        alt: 'Level up — verdien XP en stijg in level',
        title: 'Level up!',
        description: 'Verdien XP bij elke opdracht, stijg in level en werk toe naar het certificaat. Gamification houdt leerlingen gemotiveerd.',
        stepLabel: 'Stap 4',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7m11-1.5A2.5 2.5 0 0 0 15.5 4H18c0 3-2 3-2 3" />
                <path d="M12 2v5" />
                <path d="M6 9h12l-1.5 8a2 2 0 0 1-2 1.5H9.5a2 2 0 0 1-2-1.5Z" />
                <path d="M9 22v-3m6 3v-3" />
            </svg>
        ),
        accentColor: 'text-emerald-600',
        accentBg: 'bg-emerald-50',
    },
];

const AUTOPLAY_INTERVAL = 6000;

export const ScholenLandingPlatformPreview: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [progressKey, setProgressKey] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const goTo = useCallback((i: number) => {
        setIsImageLoaded(false);
        setActiveIndex(i);
        setProgressKey(k => k + 1);
    }, []);

    const goToNext = useCallback(() => {
        setIsImageLoaded(false);
        setActiveIndex(prev => (prev + 1) % journeySteps.length);
        setProgressKey(k => k + 1);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setTimeout(goToNext, AUTOPLAY_INTERVAL);
        return () => clearTimeout(timerRef.current);
    }, [activeIndex, isPaused, goToNext]);

    const active = journeySteps[activeIndex];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Bekijk het platform</p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                    De leerlingreis in 4 stappen
                </h2>
                <p className="text-base md:text-lg text-slate-500 leading-relaxed">
                    Van eerste missie tot certificaat — zo ervaren leerlingen DGSkills.
                </p>
            </div>

            {/* Main showcase */}
            <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Screenshot display */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 bg-slate-900 group">
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10">
                        <div
                            key={progressKey}
                            className={`h-full bg-indigo-500 ${isPaused ? '' : 'animate-carousel-progress'}`}
                            style={isPaused ? { width: '0%' } : undefined}
                        />
                    </div>

                    {/* Step badge - top left */}
                    <div className="absolute top-5 left-5 z-20">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-sm shadow-lg ${active.accentColor}`}>
                            {active.icon}
                            {active.stepLabel}
                        </span>
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={() => goTo((activeIndex - 1 + journeySteps.length) % journeySteps.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 shadow-lg"
                        aria-label="Vorige stap"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 shadow-lg"
                        aria-label="Volgende stap"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>

                    {/* Image */}
                    <div className="aspect-[16/9] md:aspect-[16/9]">
                        <img
                            key={active.src}
                            src={active.src}
                            alt={active.alt}
                            className={`w-full h-full transition-all duration-700 ease-out ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'}`}
                            style={{
                                objectFit: active.objectFit || 'cover',
                                objectPosition: active.objectPosition || 'top',
                            }}
                            loading={activeIndex === 0 ? 'eager' : 'lazy'}
                            fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
                            decoding={activeIndex === 0 ? 'sync' : 'async'}
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    </div>

                    {/* Bottom gradient with info */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent pt-20 pb-6 px-6 md:px-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                            <div>
                                <h3 className="text-white font-bold text-xl md:text-2xl mb-1">{active.title}</h3>
                                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-lg">{active.description}</p>
                            </div>
                            <button
                                onClick={() => setIsPaused(p => !p)}
                                className="self-start md:self-auto flex-shrink-0 text-white/50 hover:text-white/80 transition-colors"
                                aria-label={isPaused ? 'Afspelen' : 'Pauzeren'}
                            >
                                {isPaused ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step navigation */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {journeySteps.map((step, i) => {
                        const isActive = i === activeIndex;
                        const isPast = i < activeIndex;
                        return (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`group relative text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${isActive
                                    ? 'border-indigo-600 bg-white shadow-lg shadow-indigo-100/50 scale-[1.02]'
                                    : isPast
                                        ? 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                    }`}
                                aria-label={`${step.stepLabel}: ${step.title}`}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                {/* Step number + icon */}
                                <div className="flex items-center gap-3 mb-2.5">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive
                                        ? `${step.accentBg} ${step.accentColor}`
                                        : isPast
                                            ? 'bg-slate-100 text-slate-400'
                                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                        }`}>
                                        {isPast && !isActive ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? step.accentColor : 'text-slate-400'}`}>
                                        {step.stepLabel}
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className={`font-semibold text-sm md:text-base transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                    {step.title}
                                </h4>

                                {/* Active indicator line */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
