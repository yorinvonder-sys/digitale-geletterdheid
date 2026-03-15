import React, { useState, useEffect, Suspense, useRef, useCallback, Component } from 'react';

type LandingAnalyticsEvent = 'dual_cta_click' | 'contact_click';

function trackLandingEvent(event: LandingAnalyticsEvent, data?: Record<string, unknown>) {
    void import('../services/analyticsService')
        .then(({ trackEvent }) => trackEvent(event, data))
        .catch(() => {
            // Analytics should never block interaction.
        });
}

// Warm earth-tone palette (Anthropic-inspired)
const C = {
    bg: '#FAF9F0',
    bgAlt: '#F5F3EC',
    text: '#1A1A19',
    textMuted: '#6B6B66',
    textLight: '#9C9C95',
    accent: '#D97757',
    accentHover: '#C46849',
    border: '#E8E6DF',
    borderLight: '#F0EEE8',
    dark: '#1A1A19',
    darkDeep: '#141413',
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/** Prevents a single lazy section crash from killing the whole page */
class SectionErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) { console.error('[ScholenLanding] Section error:', error.message); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: C.textLight }}>Dit onderdeel kon niet worden geladen.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-3 text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:rounded-md"
                        style={{ color: C.accent }}
                    >
                        Opnieuw proberen
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/** Renders children only when section enters viewport — defers chunk load until scroll */
function DeferredSection({ children, minHeight }: { children: React.ReactNode; minHeight: string }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { rootMargin: '80px', threshold: 0 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    if (!visible) return <div ref={ref} className={minHeight} aria-hidden="true" />;
    return <>{children}</>;
}

/** Animate-in-on-scroll wrapper */
function AnimateOnScroll({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setIsVisible(true); io.disconnect(); } },
            { rootMargin: '0px', threshold: 0.1 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            className={`transition-[opacity,transform] duration-700 ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
        >
            {children}
        </div>
    );
}

/** Animated counter that counts up from 0 when in view */
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
    const [displayValue, setDisplayValue] = useState('0');
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || hasAnimated) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setHasAnimated(true);
                    io.disconnect();
                    const numericValue = parseInt(value.replace(/\D/g, ''), 10);
                    if (isNaN(numericValue)) { setDisplayValue(value); return; }
                    const duration = 1200;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(numericValue * eased);
                        setDisplayValue(value.includes('.') ? current.toLocaleString('nl-NL') : String(current));
                        if (progress < 1) requestAnimationFrame(animate);
                        else setDisplayValue(value);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [value, hasAnimated]);

    return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
}

/** Inline SVGs for critical path — avoids loading lucide (65kb) for LCP */
const IconMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);
const IconX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);
const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const IconChevronDown = () => {
    const noMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={noMotion ? undefined : { animation: 'bounce 1s ease 3' }} aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
};

// Lazy load below-the-fold sections
const ScholenLandingPainPoints = React.lazy(() => import('./scholen/ScholenLandingPainPoints').then(m => ({ default: m.ScholenLandingPainPoints })));
const ScholenLandingFeatures = React.lazy(() => import('./scholen/ScholenLandingFeatures').then(m => ({ default: m.ScholenLandingFeatures })));
const ScholenLandingSlo = React.lazy(() => import('./scholen/ScholenLandingSlo').then(m => ({ default: m.ScholenLandingSlo })));
const ScholenLandingFaq = React.lazy(() => import('./scholen/ScholenLandingFaq').then(m => ({ default: m.ScholenLandingFaq })));
const ScholenLandingIct = React.lazy(() => import('./scholen/ScholenLandingIct').then(m => ({ default: m.ScholenLandingIct })));
const ScholenLandingContact = React.lazy(() => import('./scholen/ScholenLandingContact').then(m => ({ default: m.ScholenLandingContact })));
const ScholenLandingExpertise = React.lazy(() => import('./scholen/ScholenLandingExpertise').then(m => ({ default: m.ScholenLandingExpertise })));
const ScholenLandingPlatformPreview = React.lazy(() => import('./scholen/ScholenLandingPlatformPreview').then(m => ({ default: m.ScholenLandingPlatformPreview })));
const ScholenLandingCustomization = React.lazy(() => import('./scholen/ScholenLandingCustomization').then(m => ({ default: m.ScholenLandingCustomization })));
const ScholenLandingGameDemo = React.lazy(() => import('./scholen/ScholenLandingGameDemo').then(m => ({ default: m.ScholenLandingGameDemo })));
const ScholenLandingDashboardDemo = React.lazy(() => import('./scholen/ScholenLandingDashboardDemo').then(m => ({ default: m.ScholenLandingDashboardDemo })));
const ScholenLandingMissionShowcase = React.lazy(() => import('./scholen/ScholenLandingMissionShowcase').then(m => ({ default: m.ScholenLandingMissionShowcase })));
const ScholenLandingDidactiek = React.lazy(() => import('./scholen/ScholenLandingDidactiek').then(m => ({ default: m.ScholenLandingDidactiek })));
const ScholenLandingLiveDemo = React.lazy(() => import('./scholen/ScholenLandingLiveDemo').then(m => ({ default: m.ScholenLandingLiveDemo })));

// Pip the Robin — lazy so it stays out of the landing page's main chunk
const PipGuideModule = React.lazy(() => import('./scholen/FlyingPip').then(m => ({ default: m.PipGuide })));
/** Wrapper that renders PipGuide only after idle, with Suspense fallback */
const PipGuide: React.FC<{ pose: string; tooltip: string; side: string; children: React.ReactNode }> = (props) => (
    <Suspense fallback={<>{props.children}</>}>
        <PipGuideModule {...props as any} />
    </Suspense>
);

// JSON-LD structured data for Google rich results
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SoftwareApplication",
            "name": "DGSkills",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "description": "Interactief platform voor digitale geletterdheid in het voortgezet onderwijs met AI-missies, gamification en SLO Kerndoelen 2025.",
            "url": "https://dgskills.app/scholen",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "description": "Gratis pilot van 3 maanden voor scholen"
            },
            "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student",
                "audienceType": "Voortgezet onderwijs (MAVO, HAVO, VWO)"
            }
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Wat is digitale geletterdheid en waarom wordt het verplicht?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kennis en vaardigheden om veilig en effectief te functioneren in een digitale samenleving. SLO-kerndoelen worden per 2027 wettelijk verplicht; scholen kunnen al vanaf 2025/2026 starten."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Hoe verschilt DGSkills van DIGIT-vo of Basicly?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "DGSkills combineert AI-missies, gamification (XP, badges, leaderboards) en volledige SLO-koppeling. Leerlingen leren door te doen — geen werkbladen."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Welke SLO Kerndoelen dekt DGSkills af?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Alle vier domeinen: Digitale vaardigheden, Informatievaardigheden, Mediawijsheid en Computational Thinking. Elke missie is gekoppeld aan specifieke kerndoelen."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is DGSkills AVG-compliant en veilig?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ja. Data wordt opgeslagen in een beveiligde Europese database. Verwerkersovereenkomst en DPIA beschikbaar. Voldoet aan AVG en onderwijseisen."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Op welke apparaten werkt DGSkills?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Elk apparaat met browser: iPad, Chromebook, laptop, telefoon. Geen installatie, geen IT-configuratie."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Wat kost DGSkills en is er een gratis proefperiode?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Gratis pilot van 3 maanden met volledige toegang. Daarna schoollicentie vanaf \u20ac2.000 per jaar."
                    }
                }
            ]
        },
        {
            "@type": "WebPage",
            "name": "Digitale Geletterdheid voor Scholen \u2014 DGSkills",
            "url": "https://dgskills.app/scholen",
            "description": "DGSkills: interactief platform met AI-missies en gamification voor digitale geletterdheid in het voortgezet onderwijs. Gratis pilot voor scholen.",
            "inLanguage": "nl"
        }
    ]
};

const SECTION_IDS = {
    painPoints: 'de-uitdaging',
    features: 'waarom-dgskills',
    customization: 'op-maat',
    howItWorks: 'hoe-het-werkt',
    platform: 'platform-preview',
    slo: 'slo-kerndoelen',
    ict: 'voor-ict',
    faq: 'veelgestelde-vragen',
    contact: 'gratis-pilot'
} as const;

export const ScholenLanding: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showFloatingCta, setShowFloatingCta] = useState(false);
    const [isDesktopHero, setIsDesktopHero] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.matchMedia('(min-width: 768px)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const update = () => setIsDesktopHero(mediaQuery.matches);
        update();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', update);
            return () => mediaQuery.removeEventListener('change', update);
        }

        mediaQuery.addListener(update);
        return () => mediaQuery.removeListener(update);
    }, []);

    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Digitale Geletterdheid voor Scholen \u2014 Gratis Pilot | DGSkills';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'DGSkills is het interactieve platform voor digitale geletterdheid in het voortgezet onderwijs. AI-missies, gamification en SLO Kerndoelen 2025. Start een gratis pilot voor jouw school.');
        setMeta('property', 'og:title', 'Digitale Geletterdheid voor Scholen \u2014 Gratis Pilot | DGSkills');
        setMeta('property', 'og:description', 'AI-missies, gamification en SLO Kerndoelen 2025 in \u00e9\u00e9n platform. Start een gratis pilot van 3 maanden.');

        const scriptRef = { current: null as HTMLScriptElement | null };
        const idleCb = () => {
            setMeta('property', 'og:url', 'https://dgskills.app/scholen');
            let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonical && window.location.pathname === '/scholen') {
                canonical.href = 'https://dgskills.app/scholen';
            } else if (canonical && window.location.pathname === '/') {
                canonical.href = 'https://dgskills.app/';
            }
            try {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(structuredData);
                document.head.appendChild(script);
                scriptRef.current = script;
            } catch { /* CSP Trusted Types may block textContent on <script> */ }
        };
        const useIdle = typeof requestIdleCallback !== 'undefined';
        const idleId = useIdle ? requestIdleCallback(idleCb, { timeout: 2000 }) : setTimeout(idleCb, 0);

        return () => {
            document.title = originalTitle;
            useIdle && typeof cancelIdleCallback !== 'undefined'
                ? cancelIdleCallback(idleId as number)
                : clearTimeout(idleId as ReturnType<typeof setTimeout>);
            scriptRef.current?.remove();
        };
    }, []);

    // Scroll listener for nav shadow + floating CTA
    useEffect(() => {
        let rafId: number;
        let mounted = true;
        const handleScroll = () => {
            if (!mounted) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 20);
                setShowFloatingCta(window.scrollY > 600);
            });
        };
        const schedule = typeof requestIdleCallback !== 'undefined'
            ? (cb: () => void) => requestIdleCallback(cb, { timeout: 1500 })
            : (cb: () => void) => setTimeout(cb, 0);
        const idleId = schedule(() => {
            if (mounted) window.addEventListener('scroll', handleScroll, { passive: true });
        });
        return () => {
            mounted = false;
            typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(idleId as number) : clearTimeout(idleId as ReturnType<typeof setTimeout>);
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const scrollTo = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen antialiased" style={{ backgroundColor: C.bg, fontFamily: SANS, color: C.text }}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-white focus:rounded-lg focus:font-semibold text-sm" style={{ backgroundColor: C.accent }}>Skip naar inhoud</a>

            {/* Nav */}
            <nav aria-label="Hoofdnavigatie" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
                : 'bg-transparent'
                }`} style={scrolled ? { backgroundColor: `${C.bg}ee` } : undefined}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/mascot/pip-logo.webp" alt="DGSkills" className="w-9 h-9 object-contain" width={36} height={36} decoding="async" />
                        <span className="font-semibold text-[15px] tracking-tight" style={{ color: C.text }}>DGSkills</span>
                    </a>

                    <div className="hidden lg:flex items-center gap-7">
                        {[
                            { label: 'Waarom DGSkills', section: SECTION_IDS.features },
                            { label: 'Op maat', section: SECTION_IDS.customization },
                            { label: 'Kerndoelen', section: SECTION_IDS.slo },
                            { label: 'Veelgestelde vragen', section: SECTION_IDS.faq },
                            { label: 'Gratis pilot', section: SECTION_IDS.contact },
                        ].map(item => (
                            <button key={item.label} onClick={() => scrollTo(item.section)} className="text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:rounded-md" style={{ color: C.textMuted }} onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{item.label}</button>
                        ))}
                        <a href="/compliance-hub" className="text-[13px] font-medium transition-colors" style={{ color: C.textMuted }} onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>Compliance Hub</a>
                        <div className="h-4 w-px mx-1" style={{ backgroundColor: C.border }} aria-hidden="true" />
                        <a href="/login" className="text-[13px] font-medium transition-colors" style={{ color: C.textMuted }} onMouseEnter={e => (e.currentTarget.style.color = C.text)} onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>Inloggen</a>
                        <button
                            onClick={() => scrollTo(SECTION_IDS.contact)}
                            className="text-[12px] font-semibold text-white px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap"
                            style={{ backgroundColor: C.accent }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
                        >
                            Pilot aanvragen
                        </button>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'} aria-expanded={mobileMenuOpen}>
                        {mobileMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden backdrop-blur-md animate-fade-in-up" style={{ backgroundColor: `${C.bg}f5`, borderTop: `1px solid ${C.borderLight}` }}>
                        <div className="px-6 py-4 space-y-1">
                            {[
                                { label: 'Waarom DGSkills', section: SECTION_IDS.features },
                                { label: 'Op maat', section: SECTION_IDS.customization },
                                { label: 'Kerndoelen', section: SECTION_IDS.slo },
                                { label: 'Veelgestelde vragen', section: SECTION_IDS.faq },
                                { label: 'Gratis pilot', section: SECTION_IDS.contact },
                            ].map(item => (
                                <button key={item.label} onClick={() => scrollTo(item.section)} className="block w-full text-left px-3 py-3 text-sm rounded-lg transition-colors" style={{ color: C.text }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.bgAlt)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>{item.label}</button>
                            ))}
                            <a href="/compliance-hub" className="block w-full text-left px-3 py-3 text-sm rounded-lg" style={{ color: C.text }}>Compliance Hub</a>
                            <div className="pt-4 space-y-2">
                                <a href="/login" className="block w-full text-center py-3 text-sm font-semibold rounded-full" style={{ color: C.text, border: `1.5px solid ${C.border}` }}>Inloggen</a>
                                <button onClick={() => scrollTo(SECTION_IDS.contact)} className="block w-full text-center py-3 text-sm font-semibold text-white rounded-full" style={{ backgroundColor: C.accent }}>Pilot aanvragen</button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>


            <main id="main-content">
                {/* Hero */}
                <section className="pt-32 pb-12 md:pt-40 md:pb-20 px-6 overflow-hidden" aria-labelledby="hero-heading">
                    <div className="max-w-5xl mx-auto">
                        {/* Heading — full width above grid so it never wraps */}
                        <p className="text-sm font-medium mb-4 tracking-wide" style={{ color: C.accent }}>
                            Voor het voortgezet onderwijs
                        </p>

                        <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl leading-snug font-medium tracking-tight mb-8" style={{ fontFamily: SERIF }}>
                            Digitale geletterdheid waar leerlingen <em className="not-italic" style={{ color: C.accent }}>wel</em> enthousiast van worden
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left: text */}
                            <div className="relative">
                                {/* Decorative pencil sketch — subtle background element */}
                                <svg className="absolute -top-8 -left-10 w-[320px] h-[320px] opacity-[0.06] pointer-events-none select-none hidden md:block" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    {/* Compass rose */}
                                    <circle cx="150" cy="150" r="120" stroke={C.text} strokeWidth="1.5"/>
                                    <circle cx="150" cy="150" r="105" stroke={C.text} strokeWidth="0.8"/>
                                    <polygon points="150,35 145,150 150,160 155,150" fill={C.text}/>
                                    <polygon points="150,265 145,150 150,140 155,150" fill={C.text} opacity="0.3"/>
                                    <polygon points="35,150 150,145 160,150 150,155" fill={C.text} opacity="0.3"/>
                                    <polygon points="265,150 150,145 140,150 150,155" fill={C.text} opacity="0.3"/>
                                    {/* Degree marks */}
                                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                                        <line key={deg} x1="150" y1="32" x2="150" y2="40" stroke={C.text} strokeWidth="1" transform={`rotate(${deg} 150 150)`}/>
                                    ))}
                                    <circle cx="150" cy="150" r="6" fill={C.text}/>
                                </svg>

                                <p className="text-base leading-relaxed max-w-xl mb-4" style={{ color: C.textMuted }}>
                                    DGSkills combineert AI-missies, gamification en de
                                    SLO Kerndoelen 2025 tot een complete lesmethode voor digitale geletterdheid.
                                    Gebouwd door een docent, voor docenten.
                                </p>
                                <p className="text-sm font-medium mb-8 px-3 py-1.5 rounded-full inline-flex items-center gap-2" style={{ backgroundColor: `${C.accent}10`, color: C.accent, border: `1px solid ${C.accent}25` }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Kerndoelen verplicht per 2027 — start nu met de gratis pilot
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <button
                                        onClick={() => {
                                            scrollTo(SECTION_IDS.contact);
                                            trackLandingEvent('dual_cta_click', { type: 'pilot' });
                                        }}
                                        className="group text-white px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                        style={{ backgroundColor: C.accent, boxShadow: `0 8px 24px ${C.accent}33` }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
                                    >
                                        Gratis pilot aanvragen
                                        <span className="group-hover:translate-x-0.5 transition-transform inline-block"><IconArrowRight /></span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            scrollTo(SECTION_IDS.features);
                                            trackLandingEvent('dual_cta_click', { type: 'demo' });
                                        }}
                                        className="group px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                        style={{ border: `1.5px solid ${C.border}`, color: C.text }}
                                    >
                                        Bekijk de demo
                                        <span style={{ color: C.textLight }}><IconArrowRight /></span>
                                    </button>
                                </div>

                                {/* Trust badges */}
                                <div className="flex flex-wrap items-center gap-4 mt-8 text-xs font-medium" style={{ color: C.textMuted }}>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                        AVG-compliant
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                        SLO Kerndoelen 2025
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                        Geen installatie
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                                        EU AI Act ready
                                    </span>
                                </div>
                            </div>

                            {/* Right: hero video */}
                            {isDesktopHero && (
                                <div className="relative hidden md:block" aria-hidden="true">
                                {/* Background glow — warm */}
                                <div
                                    className="absolute -inset-4 rounded-[2.5rem] opacity-80"
                                    style={{ background: `radial-gradient(circle at 30% 30%, ${C.accent}18, transparent 58%), linear-gradient(135deg, ${C.bgAlt}85, transparent)` }}
                                />

                                {/* Video container */}
                                <div className="relative">
                                    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 18px 34px ${C.text}12`, border: `1px solid ${C.border}` }}>
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className="w-full rounded-2xl"
                                            src="/videos/hero-hybrid.mp4"
                                        />
                                    </div>
                                </div>

                                {/* Pip — floating near the video */}
                                <div className="absolute -top-7 left-16 z-20">
                                    <img
                                        src="/mascot/pip-headset.webp"
                                        alt="Pip — DGSkills mascotte"
                                        className="w-10 h-10 object-contain"
                                        width={40}
                                        height={40}
                                        loading="lazy"
                                        fetchPriority="low"
                                        decoding="async"
                                    />
                                </div>
                                </div>
                            )}
                        </div>

                        {/* Scroll indicator with Pip */}
                        <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
                            <img
                                src="/mascot/pip-excited.webp"
                                alt=""
                                className="w-7 h-7 object-contain opacity-50 hidden sm:block"
                                width={28}
                                height={28}
                                loading="lazy"
                                aria-hidden="true"
                            />
                            <button
                                onClick={() => scrollTo(SECTION_IDS.painPoints)}
                                className="transition-colors p-2"
                                style={{ color: C.textLight }}
                                aria-label="Scroll naar beneden"
                            >
                                <IconChevronDown />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Social proof strip */}
                <section className="py-10 px-6 [content-visibility:auto] [contain-intrinsic-size:auto_120px]" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, backgroundColor: `${C.bgAlt}80` }} aria-label="Feiten en cijfers">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 items-center">
                            <div>
                                <p className="text-2xl font-semibold tabular-nums" style={{ color: C.text, fontFamily: SERIF }}><AnimatedCounter value="20" suffix="+" /></p>
                                <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Interactieve AI-missies</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums" style={{ color: C.text, fontFamily: SERIF }}><AnimatedCounter value="9" /></p>
                                <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>SLO Kerndoelen gedekt</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold tabular-nums" style={{ color: C.text, fontFamily: SERIF }}><AnimatedCounter value="10" /></p>
                                <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Werkdagen tot livegang</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold" style={{ color: C.text, fontFamily: SERIF }}><AnimatedCounter prefix="€" value="0" /></p>
                                <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Gratis pilot, 3 maanden</p>
                            </div>
                            <div className="col-span-2 md:col-span-1 flex items-center gap-3 md:justify-end">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.accent}18`, color: C.accent }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: C.text }}>Almere College</p>
                                    <p className="text-xs" style={{ color: C.textMuted }}>Pilotschool 2025-2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pain Points */}
                <PipGuide pose="concerned" tooltip="Leerlingen scoren een 4,7 voor digitale geletterdheid..." side="left">
                <section id={SECTION_IDS.painPoints} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" aria-label="De uitdaging">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[300px]">
                            <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingPainPoints />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>
                </PipGuide>

                {/* Features */}
                <PipGuide pose="excited" tooltip="AI-missies die echt werken!" side="right">
                <section id={SECTION_IDS.features} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingFeatures />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>
                </PipGuide>

                {/* Mid-page CTA */}
                <section className="py-10 px-6" aria-label="Pilot aanvragen">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg font-medium mb-4" style={{ fontFamily: SERIF, color: C.text }}>
                            Klaar om digitale geletterdheid concreet te maken?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                onClick={() => scrollTo(SECTION_IDS.contact)}
                                className="text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: C.accent, boxShadow: `0 8px 24px ${C.accent}33` }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
                            >
                                Start een gratis pilot
                            </button>
                            <span className="text-xs" style={{ color: C.textLight }}>Geen verplichtingen, live binnen 10 werkdagen</span>
                        </div>
                    </div>
                </section>

                {/* Customization USP */}
                <PipGuide pose="waving" tooltip="Jullie school, jullie regels!" side="left">
                <section id={SECTION_IDS.customization} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" aria-label="Aanpasbaar aan jouw school">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingCustomization />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>
                </PipGuide>

                {/* How it works - 3-step */}
                <PipGuide pose="thinking" tooltip="Makkelijker dan het lijkt!" side="left">
                <section id={SECTION_IDS.howItWorks} className="py-14 md:py-20 lg:py-24 px-6 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} aria-label="Hoe het werkt">
                    <DeferredSection minHeight="min-h-[400px]">
                        <AnimateOnScroll>
                            <div className="max-w-5xl mx-auto">
                                <div className="text-center mb-16">
                                    <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: C.accent }}>Eenvoudig starten</p>
                                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: SERIF, color: C.text }}>
                                        In 3 stappen aan de slag
                                    </h2>
                                    <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: C.textMuted }}>
                                        Van aanvraag tot actieve leerlingen in minder dan 10 werkdagen.
                                        Geen technische installatie, geen gedoe.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                                    {/* Connector line */}
                                    <div className="hidden md:block absolute top-[180px] left-[20%] right-[20%] h-px" style={{ background: `linear-gradient(to right, ${C.border}, ${C.accent}40, ${C.border})` }} aria-hidden="true" />

                                    {[
                                        {
                                            step: '01',
                                            title: 'Pilot aanvragen',
                                            description: 'Vul het formulier in. Wij nemen binnen 2 werkdagen contact op voor een korte kennismaking.',
                                            illustration: '/illustrations/how-it-works-pilot.webp',
                                            bgColor: '#F0D5D0',
                                        },
                                        {
                                            step: '02',
                                            title: 'Onboarding (30 min)',
                                            description: 'Een korte sessie met docenten: account aanmaken, dashboard uitleg en eerste missies klaarzetten.',
                                            illustration: '/illustrations/how-it-works-onboarding.webp',
                                            bgColor: '#EDE0C8',
                                        },
                                        {
                                            step: '03',
                                            title: 'Leerlingen starten',
                                            description: 'Leerlingen loggen in en beginnen direct met hun eerste AI-missie. Jij volgt de voortgang live.',
                                            illustration: '/illustrations/how-it-works-students.webp',
                                            bgColor: '#D0E0D4',
                                        },
                                    ].map((item, i) => (
                                        <AnimateOnScroll key={item.step} delay={`delay-${(i + 1) * 100}`}>
                                            <div className="relative bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group" style={{ border: `1px solid ${C.border}` }}>
                                                <div className="flex items-center justify-center py-8 px-6" style={{ backgroundColor: item.bgColor }}>
                                                    <img
                                                        src={item.illustration}
                                                        alt={item.title}
                                                        className="w-24 h-24 md:w-28 md:h-28 object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-6 text-center">
                                                    <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: C.accent }}>Stap {item.step}</p>
                                                    <h3 className="text-lg font-medium mb-3" style={{ color: C.text, fontFamily: SERIF }}>{item.title}</h3>
                                                    <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{item.description}</p>
                                                </div>
                                            </div>
                                        </AnimateOnScroll>
                                    ))}
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </DeferredSection>
                </section>
                </PipGuide>

                {/* Game Demo */}
                <PipGuide pose="excited" tooltip="Dit vinden leerlingen het leukst!" side="left">
                <section className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} aria-label="Game Programmeur demo">
                    <DeferredSection minHeight="min-h-[400px]">
                        <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingGameDemo />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>
                </PipGuide>


                {/* Live Interactive Demo — real AI chat + game builder */}
                <PipGuide pose="excited" tooltip="Probeer het zelf!" side="right">
                <section id="probeer-het" className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_600px]" aria-label="Interactieve AI demo">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingLiveDemo />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>
                </PipGuide>

                {/* Dashboard Demo */}
                <PipGuide pose="waving" tooltip="Altijd weten waar je leerlingen staan" side="left">
                <section className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} aria-label="Docenten dashboard demo">
                    <DeferredSection minHeight="min-h-[400px]">
                        <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingDashboardDemo />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>
                </PipGuide>

                {/* Platform preview */}
                <section id={SECTION_IDS.platform} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" style={{ borderBottom: `1px solid ${C.border}` }} aria-label="Platform preview">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingPlatformPreview />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* Mission Showcase */}
                <section className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_600px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} aria-label="Missie overzicht">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingMissionShowcase />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* Didactische Onderbouwing */}
                <section className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" aria-label="Didactische onderbouwing">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingDidactiek />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* SLO Kerndoelen */}
                <section id={SECTION_IDS.slo} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[300px]">
                            <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingSlo />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* FAQ */}
                <section id={SECTION_IDS.faq} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" style={{ backgroundColor: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[300px]">
                            <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingFaq scrollToContact={() => scrollTo(SECTION_IDS.contact)} />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* ICT Section */}
                <section id={SECTION_IDS.ict} className="py-14 md:py-20 lg:py-24 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_300px]">
                    <AnimateOnScroll>
                        <div className="max-w-5xl mx-auto text-center">
                            <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: C.accent }}>Technisch</p>
                            <h2 className="text-3xl font-medium mb-6" style={{ fontFamily: SERIF, color: C.text }}>Voor ICT & Informatiemanagers</h2>
                            <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: C.textMuted }}>
                                DGSkills is ontworpen voor beheersbaarheid, veiligheid en snelle adoptie.
                                Ontdek alles over onze SSO-integraties, AVG-compliance en technische architectuur.
                            </p>
                            <a
                                href="/ict"
                                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-medium hover:-translate-y-0.5 transition-all"
                                style={{ backgroundColor: C.dark, boxShadow: `0 8px 24px ${C.text}15` }}
                            >
                                Bekijk technische details
                                <IconArrowRight />
                            </a>
                        </div>
                    </AnimateOnScroll>
                </section>

                {/* Expertise */}
                <section className="py-14 md:py-20 px-6 [content-visibility:auto] [contain-intrinsic-size:auto_200px]" aria-label="Expertise">
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[200px]">
                            <Suspense fallback={<div className="min-h-[200px]" aria-hidden="true" />}>
                                <AnimateOnScroll>
                                    <ScholenLandingExpertise />
                                </AnimateOnScroll>
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>

                {/* Contact / Pricing */}
                <section id={SECTION_IDS.contact} className="py-14 md:py-20 lg:py-24 px-6 text-white scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" style={{ backgroundColor: C.dark }}>
                    <SectionErrorBoundary>
                        <DeferredSection minHeight="min-h-[400px]">
                            <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                                <ScholenLandingContact />
                            </Suspense>
                        </DeferredSection>
                    </SectionErrorBoundary>
                </section>
            </main>

            {/* Floating CTA — Mobile */}
            <div
                className={`fixed bottom-6 right-6 z-40 transition-all duration-300 lg:hidden ${
                    showFloatingCta ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                }`}
            >
                <button
                    onClick={() => scrollTo(SECTION_IDS.contact)}
                    className="text-white px-6 py-3.5 rounded-full font-medium flex items-center gap-2 text-sm"
                    style={{ backgroundColor: C.accent, boxShadow: `0 8px 24px ${C.accent}40` }}
                >
                    Pilot aanvragen
                    <IconArrowRight />
                </button>
            </div>

            {/* Floating CTA — Desktop */}
            <div
                className={`fixed bottom-6 right-6 z-40 transition-all duration-300 hidden lg:block ${
                    showFloatingCta ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                }`}
            >
                <button
                    onClick={() => scrollTo(SECTION_IDS.contact)}
                    className="text-white px-5 py-3 rounded-full text-sm font-medium transition-colors"
                    style={{ backgroundColor: C.accent, boxShadow: `0 4px 16px ${C.accent}30` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.accentHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.accent)}
                >
                    Gratis pilot starten &rarr;
                </button>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: C.darkDeep }}>
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-2.5">
                            <img src="/favicon.svg" alt="" className="w-7 h-7 object-contain opacity-60 brightness-200" width={28} height={28} loading="lazy" decoding="async" />
                            <span className="text-sm font-semibold" style={{ color: `${C.bg}cc` }}>DGSkills</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-xs" style={{ color: `${C.bg}88` }}>
                            <a href="/ict/privacy/policy" className="hover:text-white transition-colors">Privacy</a>
                            <a href="/ict/privacy/cookies" className="hover:text-white transition-colors">Cookies</a>
                            <a href="/ict/privacy/ai" className="hover:text-white transition-colors">AI Act</a>
                            <a href="/compliance-hub" className="hover:text-white transition-colors">Compliance Hub</a>
                            <span style={{ color: `${C.bg}22` }}>&middot;</span>
                            <a href="/login" className="hover:text-white transition-colors">Inloggen</a>
                        </div>
                    </div>
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${C.bg}11` }}>
                        <p className="text-xs" style={{ color: `${C.bg}55` }}>
                            &copy; {new Date().getFullYear()} DGSkills &mdash; Digitale geletterdheid voor het voortgezet onderwijs
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="mailto:info@dgskills.app" className="text-xs font-medium flex items-center gap-1.5 hover:text-white transition-colors" style={{ color: `${C.bg}88` }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                                info@dgskills.app
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
