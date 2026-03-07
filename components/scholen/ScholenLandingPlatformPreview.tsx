import React, { useState, useEffect, useRef, useCallback } from 'react';

interface JourneyStep {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
    description: string;
    stepLabel: string;
    icon: React.ReactNode;
    objectPosition?: string;
}

const journeySteps: JourneyStep[] = [
    {
        src: '/screenshots/student-mission-overview-1200.jpg',
        alt: 'Missie Overzicht — kies een missie en begin je reis',
        title: 'Kies je missie',
        subtitle: 'START JE REIS',
        description: 'Leerlingen starten hun reis door een missie te kiezen. Elke missie brengt ze dichter bij het certificaat Digitale Expert.',
        stepLabel: 'Stap 1',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        src: '/screenshots/avatar-customization-1200.jpg',
        alt: 'Avatar aanpassen — maak je eigen 3D-karakter',
        title: 'Maak je avatar',
        subtitle: 'JOUW DIGITALE IK',
        description: 'Personaliseer je eigen 3D-avatar. Jouw digitale ik in het digitale lab — dat maakt het persoonlijk en leuk.',
        stepLabel: 'Stap 2',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        objectPosition: 'center',
    },
    {
        src: '/screenshots/prompt-master.png',
        alt: 'Prompt Master — leer de juiste prompts schrijven voor AI',
        title: 'Speel AI games',
        subtitle: 'LEER DOOR TE SPELEN',
        description: 'Van Prompt Master tot AI Tekengame — leerlingen leren over AI door interactieve, uitdagende games te spelen.',
        stepLabel: 'Stap 3',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 12h4m4 0h4M6 12a6 6 0 0 0 12 0M6 12a6 6 0 0 1 12 0" />
                <rect x="2" y="6" width="20" height="12" rx="6" />
            </svg>
        ),
        objectPosition: 'center',
    },
    {
        src: '/screenshots/student-progress-xp-1200.jpg',
        alt: 'Level up — verdien XP en stijg in level',
        title: 'Level up!',
        subtitle: 'VERDIEN BELONINGEN',
        description: 'Verdien XP bij elke opdracht, stijg in level en werk toe naar het certificaat. Gamification houdt leerlingen gemotiveerd.',
        stepLabel: 'Stap 4',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7m11-1.5A2.5 2.5 0 0 0 15.5 4H18c0 3-2 3-2 3" />
                <path d="M12 2v5" />
                <path d="M6 9h12l-1.5 8a2 2 0 0 1-2 1.5H9.5a2 2 0 0 1-2-1.5Z" />
                <path d="M9 22v-3m6 3v-3" />
            </svg>
        ),
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
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: '#D97757' }}>Bekijk het platform</p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    De leerlingreis in 4 stappen
                </h2>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: '#6B6B66' }}>
                    Van eerste missie tot certificaat — zo ervaren leerlingen DGSkills.
                </p>
            </div>

            {/* Main showcase */}
            <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Showcase card */}
                <div className="rounded-3xl border p-6 md:p-10 lg:p-12" style={{ borderColor: '#E8E6DF', backgroundColor: '#FAF9F0' }}>
                    <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-center md:min-h-[400px]">
                        {/* Content — left */}
                        <div className="md:col-span-2 order-2 md:order-1 flex flex-col">
                            {/* Step badge */}
                            <span
                                className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                                style={{ backgroundColor: '#F5F3EC', color: '#D97757' }}
                            >
                                {active.icon}
                                {active.stepLabel}
                            </span>

                            {/* Subtitle */}
                            <p className="text-[11px] font-medium tracking-[0.15em] mb-2 opacity-60" style={{ color: '#D97757' }}>
                                {active.subtitle}
                            </p>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-medium mb-3 tracking-tight" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                                {active.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: '#6B6B66' }}>
                                {active.description}
                            </p>

                            {/* Dots + pause */}
                            <div className="flex items-center gap-2 mt-auto">
                                {journeySteps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors"
                                        style={{ backgroundColor: 'transparent' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F3EC')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        aria-label={`Ga naar stap ${i + 1}`}
                                        aria-current={i === activeIndex ? 'true' : undefined}
                                    >
                                        <span
                                            className="h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: i === activeIndex ? '2rem' : '0.5rem',
                                                backgroundColor: i === activeIndex ? '#D97757' : '#9C9C95',
                                            }}
                                            aria-hidden="true"
                                        />
                                    </button>
                                ))}
                                <button
                                    onClick={() => setIsPaused(p => !p)}
                                    className="ml-1 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors"
                                    style={{ color: '#6B6B66' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1A1A19'; e.currentTarget.style.backgroundColor = '#F5F3EC'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6B66'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    aria-label={isPaused ? 'Afspelen' : 'Pauzeren'}
                                >
                                    {isPaused ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Image — right */}
                        <div className="md:col-span-3 order-1 md:order-2 relative">
                            {/* Decorative glow */}
                            <div className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none" style={{ backgroundColor: 'rgba(232, 230, 223, 0.4)' }} />

                            {/* Image frame */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 bg-slate-900">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/80 border-b border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-white/15" />
                                    <div className="w-2 h-2 rounded-full bg-white/15" />
                                    <div className="w-2 h-2 rounded-full bg-white/15" />
                                    <div className="flex-1 mx-6">
                                        <div className="h-5 rounded-md bg-white/[0.07] max-w-[180px] mx-auto flex items-center justify-center">
                                            <span className="text-[10px] text-white/25 font-mono">dgskills.app</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot */}
                                <div className="aspect-[16/10]">
                                    <img
                                        key={active.src}
                                        src={active.src}
                                        alt={active.alt}
                                        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
                                            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
                                        }`}
                                        style={{ objectPosition: active.objectPosition || 'top' }}
                                        width={960}
                                        height={600}
                                        loading="lazy"
                                        fetchPriority="auto"
                                        decoding="async"
                                        onLoad={() => setIsImageLoaded(true)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step navigation */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {journeySteps.map((step, i) => {
                        const isActive = i === activeIndex;
                        return (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className="group relative text-left p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden"
                                style={{
                                    borderColor: isActive ? '#D97757' : '#E8E6DF',
                                    backgroundColor: isActive ? '#FAF9F0' : '#FFFFFF',
                                    boxShadow: isActive ? '0 10px 15px -3px rgba(217, 119, 87, 0.1)' : undefined,
                                }}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                                        style={{
                                            backgroundColor: isActive ? '#F5F3EC' : '#F5F3EC',
                                            color: isActive ? '#D97757' : '#9C9C95',
                                        }}
                                    >
                                        {step.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <span
                                            className="text-[10px] font-medium uppercase tracking-wider block"
                                            style={{ color: isActive ? '#D97757' : '#6B6B66' }}
                                        >
                                            {step.stepLabel}
                                        </span>
                                        <span
                                            className="font-medium text-sm block truncate"
                                            style={{ color: isActive ? '#1A1A19' : '#6B6B66' }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {isActive && !isPaused && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#F0EEE8' }}>
                                        <div
                                            key={progressKey}
                                            className="h-full animate-carousel-progress"
                                            style={{ backgroundColor: '#D97757' }}
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
