import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { trackEvent } from '../services/analyticsService';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Inline SVG icons (avoid lucide bundle for LCP)
   ───────────────────────────────────────────── */
const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
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
const IconChevronDown = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/* ─────────────────────────────────────────────
   Shared animation variants
   ───────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

/* ─────────────────────────────────────────────
   Counter stat component
   ───────────────────────────────────────────── */
function CounterStat({ value, suffix = '', label, description }: {
    value: number; suffix?: string; label: string; description: string;
}) {
    const { count, ref } = useAnimatedCounter(value);
    return (
        <div ref={ref} className="text-center">
            <p className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight tabular-nums">
                {count}{suffix}
            </p>
            <p className="text-lg md:text-xl font-bold text-slate-700 mt-3">{label}</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">{description}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Feature card for progressive reveal
   ───────────────────────────────────────────── */
function FeatureRow({ title, subtitle, description, screenshot, alt, reverse, index }: {
    title: string; subtitle: string; description: string;
    screenshot: string; alt: string; reverse: boolean; index: number;
}) {
    const { ref, isVisible } = useScrollReveal(0.2);
    return (
        <div
            ref={ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 md:py-32 ${reverse ? 'lg:direction-rtl' : ''}`}
        >
            {/* Text */}
            <div className={`${reverse ? 'lg:order-2 lg:direction-ltr' : ''} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide uppercase">{subtitle}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-5 leading-tight">
                    {title}
                </h3>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">{description}</p>
            </div>

            {/* Screenshot */}
            <div
                className={`${reverse ? 'lg:order-1 lg:direction-ltr' : ''} transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.97]'}`}
            >
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        <span className="ml-3 text-[10px] text-slate-400 font-medium">dgskills.app</span>
                    </div>
                    <img
                        src={screenshot}
                        alt={alt}
                        className="w-full"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                    />
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Timeline step
   ───────────────────────────────────────────── */
function TimelineStep({ step, title, description, icon, isLast }: {
    step: string; title: string; description: string;
    icon: React.ReactNode; isLast: boolean;
}) {
    const { ref, isVisible } = useScrollReveal(0.3);
    return (
        <div ref={ref} className="relative flex gap-6 md:gap-8">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isVisible
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-100'
                    : 'bg-slate-100 text-slate-400 scale-90'
                    }`}>
                    {icon}
                </div>
                {!isLast && (
                    <div className={`w-px flex-1 mt-3 transition-all duration-700 ${isVisible ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                )}
            </div>

            {/* Content */}
            <div className={`pb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Stap {step}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-base text-slate-500 leading-relaxed max-w-md">{description}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   JSON-LD structured data
   ───────────────────────────────────────────── */
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SoftwareApplication",
            name: "DGSkills",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description: "Interactief platform voor digitale geletterdheid in het voortgezet onderwijs met AI-missies, gamification en SLO Kerndoelen 2025.",
            url: "https://dgskills.app/scholen",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: "Gratis pilot van 3 maanden voor scholen" },
            audience: { "@type": "EducationalAudience", educationalRole: "student", audienceType: "Voortgezet onderwijs (MAVO, HAVO, VWO)" },
        },
        {
            "@type": "FAQPage",
            mainEntity: [
                { "@type": "Question", name: "Wat is digitale geletterdheid en waarom wordt het verplicht?", acceptedAnswer: { "@type": "Answer", text: "Kennis en vaardigheden om veilig en effectief te functioneren in een digitale samenleving. SLO-kerndoelen worden per 2027 wettelijk verplicht." } },
                { "@type": "Question", name: "Is DGSkills AVG-compliant en veilig?", acceptedAnswer: { "@type": "Answer", text: "Ja. Data wordt opgeslagen in een beveiligde Europese database. Verwerkersovereenkomst en DPIA beschikbaar." } },
                { "@type": "Question", name: "Wat kost DGSkills?", acceptedAnswer: { "@type": "Answer", text: "Gratis pilot van 3 maanden met volledige toegang. Daarna schoollicentie vanaf €2.000 per jaar." } },
            ],
        },
        { "@type": "WebPage", name: "Digitale Geletterdheid voor Scholen — DGSkills", url: "https://dgskills.app/scholen", description: "DGSkills: interactief platform met AI-missies en gamification voor digitale geletterdheid in het voortgezet onderwijs.", inLanguage: "nl" },
    ],
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export const ScholenLandingV2: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showFloatingCta, setShowFloatingCta] = useState(false);
    const [email, setEmail] = useState('');
    const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Smooth scroll
    useSmoothScroll();

    // Hero parallax
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroImageY = useTransform(heroProgress, [0, 1], [0, 120]);
    const heroImageScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

    // SEO meta
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills';
        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
            el.setAttribute('content', content);
        };
        setMeta('name', 'description', 'DGSkills is het interactieve platform voor digitale geletterdheid in het voortgezet onderwijs. AI-missies, gamification en SLO Kerndoelen 2025.');
        setMeta('property', 'og:title', 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills');
        setMeta('property', 'og:description', 'AI-missies, gamification en SLO Kerndoelen 2025 in één platform. Start een gratis pilot van 3 maanden.');

        const scriptRef = { current: null as HTMLScriptElement | null };
        const idleCb = () => {
            setMeta('property', 'og:url', 'https://dgskills.app/scholen');
            try {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(structuredData);
                document.head.appendChild(script);
                scriptRef.current = script;
            } catch { /* CSP Trusted Types may block */ }
        };
        const useIdle = typeof requestIdleCallback !== 'undefined';
        const idleId = useIdle ? requestIdleCallback(idleCb, { timeout: 2000 }) : setTimeout(idleCb, 0);
        return () => {
            document.title = originalTitle;
            useIdle ? cancelIdleCallback(idleId as number) : clearTimeout(idleId as ReturnType<typeof setTimeout>);
            scriptRef.current?.remove();
        };
    }, []);

    // Scroll listener for nav + floating CTA
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
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { mounted = false; window.removeEventListener('scroll', handleScroll); if (rafId) cancelAnimationFrame(rafId); };
    }, []);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
    }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitState('loading');
        trackEvent('cta_email_submit', { location: 'footer' });
        try {
            // Navigate to contact section with email pre-filled
            const contactSection = document.getElementById('gratis-pilot');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Dispatch a custom event with the email for the contact form to pick up
                window.dispatchEvent(new CustomEvent('prefill-email', { detail: email }));
            }
            setSubmitState('success');
        } catch {
            setSubmitState('error');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
            {/* ── Navigation ── */}
            <nav
                aria-label="Hoofdnavigatie"
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5" aria-label="DGSkills homepage">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" width={32} height={32} fetchPriority="high" decoding="async" />
                        <span className="font-bold text-[15px] text-slate-900 tracking-tight">DGSkills</span>
                    </a>

                    <div className="hidden lg:flex items-center gap-8">
                        <button onClick={() => scrollTo('features')} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</button>
                        <button onClick={() => scrollTo('hoe-het-werkt')} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Hoe het werkt</button>
                        <button onClick={() => scrollTo('gratis-pilot')} className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Gratis pilot</button>
                        <a href="/compliance-hub" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Compliance</a>
                        <div className="h-4 w-px bg-slate-200" aria-hidden="true" />
                        <a href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Inloggen</a>
                        <button
                            onClick={() => scrollTo('gratis-pilot')}
                            className="text-[13px] font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all hover:shadow-lg"
                        >
                            Start gratis pilot
                        </button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100">
                        <div className="px-6 py-4 space-y-1">
                            <button onClick={() => scrollTo('features')} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Features</button>
                            <button onClick={() => scrollTo('hoe-het-werkt')} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Hoe het werkt</button>
                            <button onClick={() => scrollTo('gratis-pilot')} className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Gratis pilot</button>
                            <a href="/compliance-hub" className="block w-full text-left px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Compliance</a>
                            <div className="pt-4 space-y-2">
                                <a href="/login" className="block w-full text-center py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full">Inloggen</a>
                                <button onClick={() => scrollTo('gratis-pilot')} className="block w-full text-center py-3 text-sm font-semibold text-white bg-slate-900 rounded-full">
                                    Start gratis pilot
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {/* ═══════════════════════════════════════════
                    SECTIE 1: HERO — Fullscreen statement
                    ═══════════════════════════════════════════ */}
                <section ref={heroRef} className="relative min-h-screen flex items-center px-6 overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40" aria-hidden="true" />
                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px]" aria-hidden="true" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-100/20 rounded-full blur-[100px]" aria-hidden="true" />

                    <motion.div
                        className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-24 pb-16"
                        style={{ opacity: heroOpacity }}
                    >
                        {/* Left: text */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.p variants={fadeUp} custom={0} className="text-indigo-600 font-semibold text-sm mb-6 tracking-wide">
                                Voor het voortgezet onderwijs
                            </motion.p>

                            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] leading-[1.06] font-extrabold text-slate-900 tracking-tight mb-7">
                                Digitale geletterdheid{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    waar leerlingen enthousiast van worden
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mb-10">
                                AI-missies, gamification en SLO Kerndoelen 2025 in één platform.
                                Geen werkbladen — leerlingen leren door te doen.
                            </motion.p>

                            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <button
                                    onClick={() => { scrollTo('gratis-pilot'); trackEvent('hero_cta_click', { type: 'pilot' }); }}
                                    className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-base font-semibold transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
                                >
                                    Start gratis pilot
                                    <span className="group-hover:translate-x-1 transition-transform inline-block"><IconArrowRight /></span>
                                </button>
                                <button
                                    onClick={() => { scrollTo('features'); trackEvent('hero_cta_click', { type: 'features' }); }}
                                    className="text-slate-500 hover:text-slate-900 px-6 py-4 text-base font-medium transition-colors flex items-center gap-2"
                                >
                                    Ontdek het platform
                                    <IconChevronDown />
                                </button>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center gap-5 mt-10 text-xs text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    AVG-compliant
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                    SLO Kerndoelen 2025
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                    Geen installatie nodig
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Right: device mockup with parallax */}
                        <motion.div
                            className="relative hidden lg:block"
                            style={{ y: heroImageY, scale: heroImageScale }}
                            aria-hidden="true"
                        >
                            <div className="absolute -inset-6 bg-gradient-to-br from-indigo-100/40 via-transparent to-purple-100/20 rounded-[3rem] blur-2xl" />
                            <div className="relative">
                                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15 border border-slate-200/50 bg-white">
                                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
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

                                {/* Floating card: XP */}
                                <div className="absolute -left-10 bottom-20 z-10 animate-hero-float">
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
                                <div className="absolute -right-6 top-24 z-10 animate-hero-float" style={{ animationDelay: '1.5s' }}>
                                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/10 border border-slate-200/50 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Kerndoel behaald</p>
                                            <p className="text-[10px] text-emerald-600 font-medium">DV-2: Cloud beheer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => scrollTo('het-probleem')}
                            className="text-slate-300 hover:text-indigo-500 transition-colors p-2 animate-bounce"
                            aria-label="Scroll naar beneden"
                        >
                            <IconChevronDown />
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTIE 2: HET PROBLEEM — Animated counters
                    ═══════════════════════════════════════════ */}
                <section id="het-probleem" className="py-24 md:py-40 px-6 bg-slate-50 border-y border-slate-100/80 scroll-mt-16">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            className="text-center mb-20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-red-500 font-semibold text-sm mb-3 tracking-wide uppercase">De uitdaging</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
                                Digitale geletterdheid in het VO staat onder druk
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                            <CounterStat
                                value={47}
                                suffix="%"
                                label="scoort onvoldoende"
                                description="Bijna de helft van de leerlingen haalt de basisnorm voor digitale vaardigheden niet."
                            />
                            <CounterStat
                                value={2027}
                                label="deadline SLO"
                                description="De SLO Kerndoelen worden wettelijk verplicht. Scholen moeten nu beginnen."
                            />
                            <CounterStat
                                value={3800}
                                suffix="+"
                                label="FTE tekort"
                                description="Het lerarentekort groeit. Er is geen capaciteit voor nóg een vak erbij."
                            />
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTIE 3: FEATURES — Progressive reveal
                    ═══════════════════════════════════════════ */}
                <section id="features" className="px-6 scroll-mt-16">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center pt-24 md:pt-40 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide uppercase">De oplossing</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight max-w-3xl mx-auto">
                                Eén platform. Alles wat je nodig hebt.
                            </h2>
                        </motion.div>

                        <FeatureRow
                            index={0}
                            title="AI-missies die écht boeien"
                            subtitle="Interactief leren"
                            description="Elke leerling krijgt gepersonaliseerde missies met AI-feedback. Van prompt engineering tot deepfake-detectie — relevante uitdagingen die aansluiten bij hun leefwereld."
                            screenshot="/screenshots/student-mission-detail.png"
                            alt="DGSkills AI missie interface"
                            reverse={false}
                        />
                        <FeatureRow
                            index={1}
                            title="Automatisch gekoppeld aan SLO Kerndoelen"
                            subtitle="Curriculum-aligned"
                            description="Alle 9 SLO Kerndoelen 2025 zijn ingebouwd. Elke missie, elk niveau, elke badge is direct gekoppeld aan de wettelijke eisen. Geen losse eindjes."
                            screenshot="/screenshots/student-progress-xp.png"
                            alt="DGSkills SLO kerndoelen koppeling"
                            reverse={true}
                        />
                        <FeatureRow
                            index={2}
                            title="Real-time inzicht voor docenten"
                            subtitle="Docent dashboard"
                            description="Volg voortgang per leerling, klas of kerndoel. Zie wie vastloopt, wie excelleert, en stuur bij — zonder nakijkwerk."
                            screenshot="/screenshots/student-dashboard.png"
                            alt="DGSkills docent dashboard"
                            reverse={false}
                        />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTIE 4: SOCIAL PROOF
                    ═══════════════════════════════════════════ */}
                <section className="py-24 md:py-40 px-6 bg-slate-50 border-y border-slate-100/80">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Large quote */}
                            <div className="relative mb-12">
                                <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 text-indigo-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                                    Eindelijk een platform waar leerlingen niet om 5 minuten vragen of het al klaar is
                                </blockquote>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    AC
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-700">Almere College</p>
                                    <p className="text-xs text-slate-400">Pilotschool 2025-2026</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-200">
                            <div>
                                <CounterStat value={20} suffix="+" label="Interactieve missies" description="" />
                            </div>
                            <div>
                                <CounterStat value={9} label="SLO Kerndoelen" description="" />
                            </div>
                            <div>
                                <CounterStat value={3} label="Domeinen afgedekt" description="" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTIE 5: HOE HET WERKT — Verticale timeline
                    ═══════════════════════════════════════════ */}
                <section id="hoe-het-werkt" className="py-24 md:py-40 px-6 scroll-mt-16">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            className="text-center mb-20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide uppercase">Eenvoudig starten</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                                In 3 stappen aan de slag
                            </h2>
                            <p className="text-lg text-slate-500 mt-5 max-w-xl mx-auto">
                                Van aanvraag tot actieve leerlingen. Geen technische installatie, geen gedoe.
                            </p>
                        </motion.div>

                        <div className="space-y-0">
                            <TimelineStep
                                step="01"
                                title="Pilot aanvragen"
                                description="Vul het formulier in. Wij nemen binnen 2 werkdagen contact op voor een korte kennismaking."
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>}
                                isLast={false}
                            />
                            <TimelineStep
                                step="02"
                                title="Onboarding (30 min)"
                                description="Een korte sessie met docenten: account aanmaken, dashboard uitleg en eerste missies klaarzetten."
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                                isLast={false}
                            />
                            <TimelineStep
                                step="03"
                                title="Leerlingen starten"
                                description="Leerlingen loggen in en beginnen direct met hun eerste AI-missie. Jij volgt de voortgang live."
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                                isLast={true}
                            />
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTIE 6: CTA — Krachtige afsluiter
                    ═══════════════════════════════════════════ */}
                <section id="gratis-pilot" className="relative py-24 md:py-40 px-6 overflow-hidden scroll-mt-16">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" aria-hidden="true" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" aria-hidden="true" />

                    <div className="relative max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                                Klaar om digitale geletterdheid{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    écht leuk
                                </span>{' '}
                                te maken?
                            </h2>
                            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                                Start een gratis pilot van 3 maanden. Volledige toegang, persoonlijke onboarding, geen verplichtingen.
                            </p>

                            {/* Email form */}
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jouw@school.nl"
                                    className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                                    required
                                    disabled={submitState === 'loading' || submitState === 'success'}
                                />
                                <button
                                    type="submit"
                                    disabled={submitState === 'loading' || submitState === 'success'}
                                    className="px-8 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitState === 'success' ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            Verzonden
                                        </>
                                    ) : submitState === 'loading' ? (
                                        'Bezig...'
                                    ) : (
                                        <>Start pilot <IconArrowRight /></>
                                    )}
                                </button>
                            </form>

                            {/* Trust badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    AVG &amp; DPIA compliant
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                    SLO Kerndoelen 2025
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    EU Data (Nederland)
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Floating CTA */}
            <div
                className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${showFloatingCta ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
                    }`}
            >
                <button
                    onClick={() => scrollTo('gratis-pilot')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-full font-semibold shadow-xl shadow-slate-900/20 flex items-center gap-2 text-sm transition-all hover:shadow-2xl"
                >
                    Start pilot
                    <IconArrowRight />
                </button>
            </div>

            {/* ── Footer ── */}
            <footer className="py-12 px-6 bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.svg" alt="" className="w-6 h-6 opacity-60 invert" width={24} height={24} loading="lazy" decoding="async" />
                            <span className="text-sm font-bold text-slate-300">DGSkills</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
                            <a href="/ict/privacy/policy" className="hover:text-slate-300 transition-colors">Privacy</a>
                            <a href="/ict/privacy/cookies" className="hover:text-slate-300 transition-colors">Cookies</a>
                            <a href="/ict/privacy/ai" className="hover:text-slate-300 transition-colors">AI Act</a>
                            <a href="/compliance-hub" className="hover:text-slate-300 transition-colors">Compliance Hub</a>
                            <a href="/ict" className="hover:text-slate-300 transition-colors">Voor ICT</a>
                            <span className="text-slate-800">·</span>
                            <a href="/login" className="hover:text-slate-300 transition-colors">Inloggen</a>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-600">
                            © {new Date().getFullYear()} DGSkills — Digitale geletterdheid voor het voortgezet onderwijs
                        </p>
                        <a href="mailto:info@dgskills.app" className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            info@dgskills.app
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
