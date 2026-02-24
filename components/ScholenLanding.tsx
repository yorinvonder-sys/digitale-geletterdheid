import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { trackEvent } from '../services/analyticsService';

/** Renders children only when section enters viewport — defers chunk load until scroll */
function DeferredSection({ children, minHeight }: { children: React.ReactNode; minHeight: string }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { rootMargin: '200px', threshold: 0 }
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
            className={`transition-all duration-700 ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
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
const IconChevronDown = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 1s ease 3' }} aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

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
                        "text": "DGSkills combineert AI-missies, gamification (XP, badges, leaderboards) én volledige SLO-koppeling. Leerlingen leren door te doen — geen werkbladen."
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
                        "text": "Gratis pilot van 3 maanden met volledige toegang. Daarna schoollicentie vanaf €2.000 per jaar."
                    }
                }
            ]
        },
        {
            "@type": "WebPage",
            "name": "Digitale Geletterdheid voor Scholen — DGSkills",
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

    // Preload the first platform screenshot — LCP candidate
    useEffect(() => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = '/screenshots/student-mission-overview.png';
        preloadLink.fetchPriority = 'high';
        document.head.appendChild(preloadLink);
        return () => { preloadLink.remove(); };
    }, []);

    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills';

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
        setMeta('property', 'og:title', 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills');
        setMeta('property', 'og:description', 'AI-missies, gamification en SLO Kerndoelen 2025 in één platform. Start een gratis pilot van 3 maanden.');

        const scriptRef = { current: null as HTMLScriptElement | null };
        const idleCb = () => {
            setMeta('property', 'og:url', 'https://dgskills.app/scholen');
            let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonical && window.location.pathname === '/scholen') {
                canonical.href = 'https://dgskills.app/scholen';
            } else if (canonical && window.location.pathname === '/') {
                canonical.href = 'https://dgskills.app/';
            }
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
            scriptRef.current = script;
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
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Nav */}
            <nav aria-label="Hoofdnavigatie" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
                : 'bg-transparent'
                }`}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5" aria-label="DGSkills homepage">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" width={32} height={32} fetchPriority="high" decoding="async" />
                        <span className="font-bold text-[15px] text-slate-900 tracking-tight">DGSkills</span>
                    </a>

                    <div className="hidden lg:flex items-center gap-6">
                        <button onClick={() => scrollTo(SECTION_IDS.features)} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Waarom DGSkills</button>
                        <button onClick={() => scrollTo(SECTION_IDS.customization)} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Op maat</button>
                        <button onClick={() => scrollTo(SECTION_IDS.slo)} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Kerndoelen</button>
                        <button onClick={() => scrollTo(SECTION_IDS.faq)} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Veelgestelde vragen</button>
                        <button onClick={() => scrollTo(SECTION_IDS.contact)} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Gratis pilot</button>
                        <a href="/compliance-hub" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Compliance Hub</a>
                        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />
                        <a href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Inloggen</a>
                        <button
                            onClick={() => scrollTo(SECTION_IDS.contact)}
                            className="text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Pilot aanvragen
                        </button>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'} aria-expanded={mobileMenuOpen}>
                        {mobileMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 animate-fade-in-up">
                        <div className="px-6 py-4 space-y-1">
                            <button onClick={() => scrollTo(SECTION_IDS.features)} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Waarom DGSkills</button>
                            <button onClick={() => scrollTo(SECTION_IDS.customization)} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Op maat</button>
                            <button onClick={() => scrollTo(SECTION_IDS.slo)} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Kerndoelen</button>
                            <button onClick={() => scrollTo(SECTION_IDS.faq)} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Veelgestelde vragen</button>
                            <button onClick={() => scrollTo(SECTION_IDS.contact)} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Gratis pilot</button>
                            <a href="/compliance-hub" className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Compliance Hub</a>
                            <div className="pt-4 space-y-2">
                                <a
                                    href="/login"
                                    className="block w-full text-center py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm"
                                >
                                    Inloggen
                                </a>
                                <button
                                    onClick={() => scrollTo(SECTION_IDS.contact)}
                                    className="block w-full text-center py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm"
                                >
                                    Pilot aanvragen
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {/* Hero — with floating screenshot composition */}
                <section className="pt-32 pb-12 md:pt-40 md:pb-20 px-6 overflow-hidden">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left: text */}
                            <div>
                                <p className="text-indigo-600 font-semibold text-sm mb-5 tracking-wide">Voor het voortgezet onderwijs</p>

                                <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] leading-[1.08] font-extrabold text-slate-900 tracking-tight mb-6">
                                    Digitale Geletterdheid<br className="hidden sm:inline" />
                                    {' '}waar leerlingen <span className="text-indigo-600">wél</span><br className="hidden sm:inline" />
                                    {' '}enthousiast van worden
                                </h1>

                                <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-10">
                                    DGSkills is een interactief platform dat AI-missies, gamification en de
                                    SLO Kerndoelen 2025 combineert tot een complete lesmethode voor digitale geletterdheid.
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <button
                                        onClick={() => {
                                            scrollTo(SECTION_IDS.contact);
                                            trackEvent('dual_cta_click', { type: 'pilot' });
                                        }}
                                        className="group bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-lg text-base font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5"
                                    >
                                        Gratis pilot aanvragen
                                        <span className="group-hover:translate-x-0.5 transition-transform inline-block"><IconArrowRight /></span>
                                    </button>
                                    <a
                                        href="/ict"
                                        onClick={() => {
                                            trackEvent('dual_cta_click', { type: 'ict' });
                                        }}
                                        className="group bg-white border border-slate-200 hover:border-slate-300 text-slate-600 px-7 py-3.5 rounded-lg text-base font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                    >
                                        Voor ICT-coördinatoren
                                        <span className="text-slate-400"><IconArrowRight /></span>
                                    </a>
                                </div>

                                {/* Trust badges */}
                                <div className="flex flex-wrap items-center gap-4 mt-8 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                        AVG-compliant
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                        SLO 2025
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                        Geen installatie
                                    </span>
                                </div>
                            </div>

                            {/* Right: floating screenshot composition */}
                            <div className="relative hidden md:block" aria-hidden="true">
                                {/* Background glow */}
                                <div className="absolute -inset-8 bg-gradient-to-br from-indigo-100/50 via-transparent to-purple-100/30 rounded-[3rem] blur-2xl" />

                                {/* Main screenshot */}
                                <div className="relative animate-hero-float">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/15 border border-slate-200/50 bg-white">
                                        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                            <span className="ml-3 text-[10px] text-slate-400 font-medium">dgskills.app</span>
                                        </div>
                                        <img
                                            src="/screenshots/student-mission-overview.png"
                                            alt="DGSkills missie overzicht"
                                            className="w-full"
                                            loading="eager"
                                            fetchPriority="high"
                                            decoding="async"
                                        />
                                    </div>
                                </div>

                                {/* Floating card: XP badge */}
                                <div className="absolute -left-8 bottom-16 animate-hero-float-delayed z-10">
                                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/10 border border-slate-200/50 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                            XP
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">+250 XP verdiend!</p>
                                            <p className="text-[10px] text-slate-400">Level 5 bereikt</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating card: SLO check */}
                                <div className="absolute -right-4 top-20 animate-hero-float z-10" style={{ animationDelay: '1s' }}>
                                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/10 border border-slate-200/50 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Kerndoel behaald</p>
                                            <p className="text-[10px] text-emerald-600 font-medium">DV-2: Cloud beheer</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Small avatar preview */}
                                <div className="absolute -left-2 top-8 animate-hero-float-delayed z-10" style={{ animationDelay: '3s' }}>
                                    <div className="bg-white rounded-xl shadow-lg shadow-purple-900/10 border border-slate-200/50 p-2.5">
                                        <img
                                            src="/screenshots/avatar-customization.png"
                                            alt=""
                                            className="w-16 h-16 rounded-lg object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        <div className="flex justify-center mt-12 md:mt-16">
                            <button
                                onClick={() => scrollTo(SECTION_IDS.painPoints)}
                                className="text-slate-300 hover:text-indigo-500 transition-colors p-2"
                                aria-label="Scroll naar beneden"
                            >
                                <IconChevronDown />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Social proof strip with Almere College */}
                <section className="border-y border-slate-100 py-10 px-6 bg-slate-50/50 [content-visibility:auto] [contain-intrinsic-size:auto_120px]" aria-label="Feiten en cijfers">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 items-center">
                            <div>
                                <p className="text-2xl font-bold text-slate-900">20+</p>
                                <p className="text-sm text-slate-500 mt-0.5">Interactieve missies</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">9</p>
                                <p className="text-sm text-slate-500 mt-0.5">SLO Kerndoelen gedekt</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">3</p>
                                <p className="text-sm text-slate-500 mt-0.5">Domeinen afgedekt</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">Pilot</p>
                                <p className="text-sm text-slate-500 mt-0.5">Actief in VO-scholen</p>
                            </div>
                            <div className="col-span-2 md:col-span-1 flex items-center gap-3 md:justify-end">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">Almere College</p>
                                    <p className="text-[10px] text-slate-400">Pilotschool 2025-2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pain Points — problem statement before solution */}
                <section id={SECTION_IDS.painPoints} className="py-14 md:py-20 lg:py-28 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]" aria-label="De uitdaging">
                    <DeferredSection minHeight="min-h-[500px]">
                        <Suspense fallback={<div className="min-h-[500px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingPainPoints />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* Features */}
                <section id={SECTION_IDS.features} className="py-14 md:py-20 lg:py-28 px-6 bg-slate-50 border-y border-slate-100 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_600px]">
                    <DeferredSection minHeight="min-h-[600px]">
                        <Suspense fallback={<div className="min-h-[600px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingFeatures />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* Customization USP — key differentiator */}
                <section id={SECTION_IDS.customization} className="py-14 md:py-20 lg:py-28 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_600px]" aria-label="Aanpasbaar aan jouw school">
                    <DeferredSection minHeight="min-h-[600px]">
                        <Suspense fallback={<div className="min-h-[600px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingCustomization />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* How it works - 3-step */}
                <section className="py-14 md:py-20 lg:py-28 px-6 bg-slate-50 border-y border-slate-100 [content-visibility:auto] [contain-intrinsic-size:auto_400px]" aria-label="Hoe het werkt">
                    <DeferredSection minHeight="min-h-[400px]">
                        <AnimateOnScroll>
                            <div className="max-w-5xl mx-auto">
                                <div className="text-center mb-16">
                                    <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Eenvoudig starten</p>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                                        In 3 stappen aan de slag
                                    </h2>
                                    <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
                                        Van aanvraag tot actieve leerlingen in minder dan 10 werkdagen.
                                        Geen technische installatie, geen gedoe.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                                    {/* Connector line */}
                                    <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200" aria-hidden="true" />

                                    {[
                                        {
                                            step: '01',
                                            title: 'Pilot aanvragen',
                                            description: 'Vul het formulier in. Wij nemen binnen 2 werkdagen contact op voor een korte kennismaking.',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
                                            color: 'bg-indigo-100 text-indigo-600',
                                        },
                                        {
                                            step: '02',
                                            title: 'Onboarding (30 min)',
                                            description: 'Een korte sessie met docenten: account aanmaken, dashboard uitleg en eerste missies klaarzetten.',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                                            color: 'bg-emerald-100 text-emerald-600',
                                        },
                                        {
                                            step: '03',
                                            title: 'Leerlingen starten',
                                            description: 'Leerlingen loggen in en beginnen direct met hun eerste AI-missie. Jij volgt de voortgang live.',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                                            color: 'bg-amber-100 text-amber-600',
                                        },
                                    ].map((item, i) => (
                                        <AnimateOnScroll key={item.step} delay={`delay-${(i + 1) * 100}`}>
                                            <div className="relative bg-white rounded-2xl border border-slate-200 p-8 text-center hover:shadow-lg transition-all group">
                                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                                                    {item.icon}
                                                </div>
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Stap {item.step}</p>
                                                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                                            </div>
                                        </AnimateOnScroll>
                                    ))}
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </DeferredSection>
                </section>

                {/* Platform preview — NOT deferred: contains the first visible image (LCP) */}
                <section id={SECTION_IDS.platform} className="py-14 md:py-20 lg:py-28 px-6 border-b border-slate-100 scroll-mt-16" aria-label="Platform preview">
                    <Suspense fallback={<div className="min-h-[700px]" aria-hidden="true" />}>
                        <ScholenLandingPlatformPreview />
                    </Suspense>
                </section>

                {/* SLO Kerndoelen */}
                <section id={SECTION_IDS.slo} className="py-14 md:py-20 lg:py-28 px-6 bg-slate-50 border-y border-slate-100 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_500px]">
                    <DeferredSection minHeight="min-h-[500px]">
                        <Suspense fallback={<div className="min-h-[500px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingSlo />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* Testimonial — Almere College */}
                <section className="py-20 md:py-24 px-6 [content-visibility:auto] [contain-intrinsic-size:auto_300px]" aria-label="Testimonial">
                    <DeferredSection minHeight="min-h-[300px]">
                        <AnimateOnScroll>
                            <div className="max-w-4xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                    Pilotschool
                                </div>

                                <blockquote className="mb-8">
                                    <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-6">
                                        "DGSkills maakt digitale geletterdheid concreet en toegankelijk.
                                        De AI-missies sluiten aan bij de belevingswereld van onze leerlingen
                                        en de SLO-koppeling geeft ons de verantwoording die we nodig hebben."
                                    </p>
                                </blockquote>

                                {/* TODO: Vervang "R. de Vries" door de echte naam van de ICT-coördinator van Almere College */}
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        RV
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900">R. de Vries</p>
                                        <p className="text-sm text-slate-500">ICT-coördinator, Almere College</p>
                                    </div>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </DeferredSection>
                </section>

                {/* FAQ */}
                <section id={SECTION_IDS.faq} className="py-14 md:py-20 lg:py-28 px-6 bg-slate-50 border-y border-slate-100 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_600px]">
                    <DeferredSection minHeight="min-h-[600px]">
                        <Suspense fallback={<div className="min-h-[600px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingFaq scrollToContact={() => scrollTo(SECTION_IDS.contact)} />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* ICT Section */}
                <section id={SECTION_IDS.ict} className="py-14 md:py-20 lg:py-28 px-6 scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_400px]">
                    <AnimateOnScroll>
                        <div className="max-w-5xl mx-auto text-center">
                            <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Technisch</p>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Voor ICT & Informatiemanagers</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                                DGSkills is ontworpen voor beheersbaarheid, veiligheid en snelle adoptie.
                                Ontdek alles over onze SSO-integraties, AVG-compliance en technische architectuur.
                            </p>
                            <a
                                href="/ict"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/10"
                            >
                                Bekijk technische details
                                <IconArrowRight />
                            </a>
                        </div>
                    </AnimateOnScroll>
                </section>

                {/* Expertise */}
                <section className="py-20 md:py-24 px-6 [content-visibility:auto] [contain-intrinsic-size:auto_200px]" aria-label="Expertise">
                    <DeferredSection minHeight="min-h-[400px]">
                        <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
                            <AnimateOnScroll>
                                <ScholenLandingExpertise />
                            </AnimateOnScroll>
                        </Suspense>
                    </DeferredSection>
                </section>

                {/* Contact / Pricing */}
                <section id={SECTION_IDS.contact} className="py-14 md:py-20 lg:py-28 px-6 bg-slate-900 text-white scroll-mt-16 [content-visibility:auto] [contain-intrinsic-size:auto_700px]">
                    <DeferredSection minHeight="min-h-[700px]">
                        <Suspense fallback={<div className="min-h-[700px]" aria-hidden="true" />}>
                            <ScholenLandingContact />
                        </Suspense>
                    </DeferredSection>
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-full font-semibold shadow-xl shadow-indigo-600/30 flex items-center gap-2 text-sm"
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-colors"
                >
                    Gratis pilot starten &rarr;
                </button>
            </div>

            {/* Footer */}
            <footer className="py-10 px-6 bg-slate-950">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.svg" alt="" className="w-6 h-6 opacity-60 invert" width={24} height={24} loading="lazy" decoding="async" />
                            <span className="text-sm font-bold text-slate-300">DGSkills</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
                            <a href="/ict/privacy/policy" className="hover:text-slate-300 transition-colors">Privacy</a>
                            <a href="/ict/privacy/cookies" className="hover:text-slate-300 transition-colors">Cookies</a>
                            <a href="/ict/privacy/ai" className="hover:text-slate-300 transition-colors">AI Act</a>
                            <a href="/compliance-hub" className="hover:text-slate-300 transition-colors">Compliance Hub</a>
                            <span className="text-slate-800">·</span>
                            <a href="/login" className="hover:text-slate-300 transition-colors">Inloggen</a>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-600">
                            © {new Date().getFullYear()} DGSkills — Digitale geletterdheid voor het voortgezet onderwijs
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="mailto:info@dgskills.app" className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1.5">
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
