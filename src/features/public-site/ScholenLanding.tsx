import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    DEFAULT_GAME_CONFIG,
    applyDelta,
    tweakGameDemo,
    type GameConfig,
} from '@/services/gameDemoService';
import { DuckMark } from '@/components/brand/DuckMark';
import { DuckMascot } from '@/components/brand/DuckMascot';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type NavItem = { label: string; target: string };
type SkillTone = 'paper' | 'acid';
type Skill = {
    title: string;
    letter: string;
    tone: SkillTone;
    art: SkillArtVariant;
    image?: string;
    icon: React.ReactNode;
    bullets: string[];
    projects: string;
    coachTip: string;
    bestFor: string;
};
type JourneyChapter = {
    step: string;
    title: string;
    eyebrow: string;
    copy: string;
    routeCoachTip: string;
    screen: React.ReactNode;
    icon: React.ReactNode;
    stat: string;
    statLabel: string;
};

const NAV_ITEMS: NavItem[] = [
    { label: 'Hoe het werkt', target: 'journey' },
    { label: 'Skills', target: 'skills' },
    { label: 'Game demo', target: 'projecten' },
    { label: 'Portfolio', target: 'portfolio' },
];

const MARQUEE_WORDS = [
    'AI-geletterdheid',
    'Mediawijsheid',
    'Computational thinking',
    'Informatievaardigheden',
    'Online veiligheid',
    'Digitale vaardigheden',
    'Portfolio-bewijs',
    'SLO-kerndoelen',
] as const;

const skills: Skill[] = [
    {
        title: 'AI & Data',
        letter: 'A',
        tone: 'paper',
        art: 'ai',
        image: '/brand-duck/skill-ai-data.webp',
        icon: <BrainIcon />,
        bullets: ['AI-tools gebruiken', 'Data analyseren', 'Slimme apps bouwen'],
        projects: '12 projecten',
        coachTip: 'Start hier als je klas AI wil gebruiken en kritisch wil leren kijken.',
        bestFor: 'brugklas, onderzoeksopdrachten en AI-basis',
    },
    {
        title: 'Design & Create',
        letter: 'D',
        tone: 'acid',
        art: 'create',
        image: '/brand-duck/skill-design-create.webp',
        icon: <PencilIcon />,
        bullets: ['Grafisch ontwerp', 'UI/UX design', 'Animatie & video'],
        projects: '18 projecten',
        coachTip: 'Goed voor makers: ontwerpen, testen en verbeteren met zichtbaar resultaat.',
        bestFor: 'projectweek, kunstvakken en creatieve keuzeuren',
    },
    {
        title: 'Code & Bouw',
        letter: 'C',
        tone: 'paper',
        art: 'code',
        image: '/brand-duck/skill-code-bouw.webp',
        icon: <CodeIcon />,
        bullets: ['Web development', 'App development', 'Games maken'],
        projects: '24 projecten',
        coachTip: 'Perfect voor leerlingen die willen snappen hoe apps, games en logica werken.',
        bestFor: 'programmeren, technologie en plusopdrachten',
    },
    {
        title: 'Media & Verhaal',
        letter: 'M',
        tone: 'acid',
        art: 'media',
        image: '/brand-duck/skill-media-verhaal.webp',
        icon: <CameraIcon />,
        bullets: ['Video editen', 'Podcast maken', 'Storytelling'],
        projects: '16 projecten',
        coachTip: 'Sterk voor creatievelingen: video, verhaal, presentatie en digitale identiteit.',
        bestFor: 'Nederlands, mediawijsheid en presentaties',
    },
    {
        title: 'Online veiligheid',
        letter: 'V',
        tone: 'paper',
        art: 'safe',
        image: '/brand-duck/skill-veiligheid.webp',
        icon: <LockIcon />,
        bullets: ['Privacy & security', 'Cyber awareness', 'Verantwoord online'],
        projects: '8 projecten',
        coachTip: 'Ideaal als startpunt voor mentoraat, privacy, phishing en veilig gedrag.',
        bestFor: 'mentorles, burgerschap en schoolbrede veiligheid',
    },
];

const HOMEPAGE_SEO = {
    title: 'Digitale Geletterdheid voor VO en VSO | DGSkills schoolpilot',
    description: 'DGSkills maakt digitale geletterdheid tastbaar voor VO en VSO. AI-missies, SLO-rapportage, docentdashboard, AVG-bewuste AI en een schoolpilot op maat.',
    image: 'https://dgskills.app/og-image.png',
};

const heroProofItems = [
    { label: 'SLO-ready', value: 'Kerndoelen zichtbaar per missie' },
    { label: 'Docentproof', value: 'Dashboard voor voortgang en signalen' },
    { label: 'Samen ingericht', value: 'Schoolpilot op maat met je team' },
    { label: 'Veilig', value: 'AVG-bewust en AI Act-roadmap 2026' },
] as const;

const trustChips = [
    { label: '20+ AI-missies', tone: 'acid', pos: 'left-[4%] top-[20%] xl:left-[6%]', rotate: '-rotate-[9deg]' },
    { label: 'SLO-mapping', tone: 'paper', pos: 'left-[2%] top-[46%] xl:left-[4%]', rotate: 'rotate-[7deg]' },
    { label: 'Microsoft 365', tone: 'paper', pos: 'left-[7%] top-[68%] xl:left-[10%]', rotate: 'rotate-[4deg]' },
    { label: 'AVG-bewust', tone: 'paper', pos: 'right-[4%] top-[18%] xl:right-[7%]', rotate: 'rotate-[8deg]' },
    { label: 'AI Act-roadmap 2026', tone: 'ink', pos: 'right-[1%] top-[44%] xl:right-[3%]', rotate: '-rotate-[7deg]' },
    { label: 'Pilot binnen 10 werkdagen', tone: 'ink', pos: 'right-[6%] top-[66%] xl:right-[9%]', rotate: '-rotate-[4deg]' },
    { label: 'Geen creditcard', tone: 'acid', pos: 'left-[40%] top-[78%]', rotate: 'rotate-[3deg]' },
] as const;

const lessonSteps = [
    {
        step: '01',
        title: 'Start missie',
        copy: 'De docent kiest een missie die past bij de les, periode of leerlijn. Leerlingen zien meteen wat ze gaan maken.',
    },
    {
        step: '02',
        title: 'Leerlingen werken zelfstandig',
        copy: 'Korte opdrachten, echte DGSkills-schermen en directe feedback houden de klas actief zonder lange instructieronde.',
    },
    {
        step: '03',
        title: 'Docent ziet signalen',
        copy: 'Voortgang, antwoorden en leervragen worden zichtbaar, zodat hulp terechtkomt bij leerlingen die die nodig hebben.',
    },
    {
        step: '04',
        title: 'Portfolio/reflectie',
        copy: 'Elke missie eindigt met bewijs: wat is gemaakt, welke keuze is uitgelegd en welke skill is gegroeid.',
    },
] as const;

const leaderReasons = [
    { title: 'Curriculum zichtbaar', copy: 'Missies worden gekoppeld aan digitale geletterdheid, SLO-domeinen en portfolio-bewijs.' },
    { title: 'Minder voorbereiding', copy: 'Docenten starten vanuit kant-en-klare routes in plaats van losse lessen en werkbladen.' },
    { title: 'Pilotrapport', copy: 'De schoolpilot levert signalen op over deelname, voortgang en vervolgstappen voor het team.' },
    { title: 'Schoolbreed inzetbaar', copy: 'Geschikt voor mentorles, projectweek, keuzeuur of een doorlopende leerlijn.' },
] as const;

const sloRows = [
    { domain: 'Digitale vaardigheden', missions: 'Prompt Perfectionist, Website Bouwer', proof: 'Toolgebruik, workflow en uitleg bij keuzes' },
    { domain: 'Informatievaardigheden', missions: 'Data Journalist, Factchecker', proof: 'Bronnen beoordelen, data lezen en conclusies trekken' },
    { domain: 'Mediawijsheid', missions: 'Deepfake Detector, Scroll Stopper', proof: 'Kritisch kijken naar media, identiteit en online gedrag' },
    { domain: 'Computational thinking', missions: 'Game Programmeur, Robot Bestuurder', proof: 'Logica, testen, debuggen en iteratief verbeteren' },
] as const;

const sloIcons = [
    <svg key="digital" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="1" y="2" width="14" height="10" rx="1.5" /><path d="M5.5 15h5M8 12v3" /></svg>,
    <svg key="info" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="7" cy="7" r="5" /><path d="m13 13-2.5-2.5" /></svg>,
    <svg key="media" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" /><circle cx="8" cy="8" r="2" /></svg>,
    <svg key="ct" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="4,5 1,8 4,11" /><polyline points="12,5 15,8 12,11" /><path d="M9 3l-2 10" /></svg>,
];

const ictTrustItems = [
    { title: 'Microsoft 365', copy: 'Inloggen en klasbeheer worden besproken vanuit de bestaande schoolomgeving.' },
    { title: 'Verwerkersovereenkomst', copy: 'Voor privacyteams is er ruimte om afspraken en verantwoordelijkheden vooraf te beoordelen.' },
    { title: 'DPIA support', copy: 'DGSkills helpt scholen met informatie die nodig is voor een zorgvuldige DPIA-check.' },
    { title: 'AI-transparantie', copy: 'AI-gebruik wordt uitlegbaar gemaakt voor leerlingen, docenten en schoolbeleid.' },
    { title: 'Support/contact', copy: 'Tijdens de pilot is er een helder aanspreekpunt voor docent, schoolleiding en ICT.' },
] as const;

const screenshotProofPanels = [
    {
        label: 'Leerlingmissie',
        title: 'Leerlingen leren door te doen',
        copy: 'Leerlingen kiezen uit echte missies — Prompt Perfectionist, Game Programmeur, AI Trainer — en starten direct vanuit hun eigen niveau.',
        screen: <ScreenMissieDetail />,
    },
    {
        label: 'Docentdashboard',
        title: 'Voortgang in een oogopslag',
        copy: 'Docenten zien routes, periodes, leerdoelen en missiekaarten zonder eigen spreadsheets bij te houden.',
        screen: <ScreenDocent />,
    },
    {
        label: 'SLO-voortgang',
        title: 'Bewijs per leerdoel',
        copy: 'Voortgang en XP worden gekoppeld aan zichtbare groei, zodat de opbrengst bespreekbaar wordt.',
        screen: <ScreenVoortgang />,
    },
    {
        label: 'Portfolio-bewijs',
        title: 'Een verhaal achter de score',
        copy: 'Leerlingen bouwen een portfolio dat laat zien wat ze maken, uitleggen en verbeteren.',
        screen: <ScreenPortfolio />,
    },
    {
        label: 'Privacy/ICT',
        title: 'Beoordeelbaar voor schoolteams',
        copy: 'Privacy, AI-transparantie en implementatievragen krijgen een eigen plek in de pilot.',
        screen: <ScreenPrivacy />,
    },
] as const;

const pilotItems = [
    'Onboarding call met schoolteam',
    'Docent startguide voor de eerste les',
    '20+ AI-missies om direct te proberen',
    'Klas- en route-inrichting voor de pilot',
    'Pilotrapport na 6 weken',
    'Geen creditcard nodig',
    'Binnen 10 werkdagen live',
] as const;

const roleFaqs = [
    { role: 'Docenten', question: 'Moet ik zelf AI-lessen ontwerpen?', answer: 'Nee. Je start met missies, voorbeeldroutes en korte opdrachten die je in je eigen les kunt gebruiken.' },
    { role: 'Schoolleiding', question: 'Wat levert een pilot op?', answer: 'Een concreet beeld van deelname, voortgang, SLO-koppeling en wat er nodig is voor bredere invoering.' },
    { role: 'ICT & privacy', question: 'Kunnen we privacy en AI vooraf beoordelen?', answer: 'Ja. De pilot is bedoeld om ook verwerkersafspraken, DPIA-informatie en AI-transparantie zorgvuldig door te nemen.' },
    { role: 'Pilot', question: 'Hoe snel kan een school starten?', answer: 'De pilot is ingericht op een compacte start: meestal binnen 10 werkdagen nadat scope en accounts zijn afgestemd.' },
] as const;

const journeyChapters: JourneyChapter[] = [
    {
        step: '01',
        title: 'Ontdek',
        eyebrow: 'Start je route',
        copy: 'Leerlingen kiezen een leerlijn, zien meteen de AI-missies en starten op hun eigen niveau.',
        routeCoachTip: 'Kies een leerlijn en zie meteen waar je klas start.',
        screen: <ScreenMissies />,
        icon: <SearchIcon />,
        stat: '20+',
        statLabel: 'AI-missies klaar',
    },
    {
        step: '02',
        title: 'Leer',
        eyebrow: 'Korte challenges',
        copy: 'Elke opdracht draait in echte DGSkills-schermen, dus leerlingen leren door te doen, niet door te lezen.',
        routeCoachTip: 'Elke missie geeft directe feedback, dus leerlingen blijven bezig.',
        screen: <ScreenMissieDetail />,
        icon: <BookIcon />,
        stat: 'SLO',
        statLabel: 'gekoppeld',
    },
    {
        step: '03',
        title: 'Maak',
        eyebrow: 'Projectmodus',
        copy: 'Bouw een platformer, ontwerp een robotroute, laat AI je tekening raden en remix challenges tot iets eigens.',
        routeCoachTip: 'Hier wordt het concreet: games, robots, prompts, projecten.',
        screen: <ScreenBouwen />,
        icon: <PencilIcon />,
        stat: '24',
        statLabel: 'bouwprojecten',
    },
    {
        step: '04',
        title: 'Bewijs',
        eyebrow: 'Trofeeën en XP',
        copy: 'Voortgang wordt zichtbaar met levels, trofeeën en XP, zonder dat het voelt als een saai volgsysteem.',
        routeCoachTip: 'Alles eindigt in zichtbaar portfolio- of voortgangsbewijs.',
        screen: <ScreenVoortgang />,
        icon: <BadgeIcon />,
        stat: 'XP',
        statLabel: 'groeit mee',
    },
    {
        step: '05',
        title: 'Groei',
        eyebrow: 'Portfolio groei',
        copy: 'Leerlingen krijgen feedback, bouwen bewijs op en zien hun groei in een portfolio dat met ze meegroeit.',
        routeCoachTip: 'Maak groei zichtbaar per leerling, klas en route.',
        screen: <ScreenPortfolio />,
        icon: <GrowthIcon />,
        stat: '1',
        statLabel: 'groeiroute',
    },
];

function trackLandingEvent(event: string, data?: Record<string, unknown>) {
    void import('@/services/analyticsService')
        .then(({ trackEvent }) => trackEvent(event as Parameters<typeof trackEvent>[0], data))
        .catch(() => {
            // Analytics should never block interaction.
        });
}

export const ScholenLanding: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [introReady, setIntroReady] = useState(false);
    const reduceMotion = usePrefersReducedMotion();
    const { hidden: headerHidden, scrolled: headerScrolled } = useHeaderChrome(mobileMenuOpen);

    useHomepageGsapEffects(reduceMotion);

    useEffect(() => {
        let seen = true;
        try {
            seen = sessionStorage.getItem('dg-intro-seen') === '1';
        } catch {
            seen = true;
        }
        const prefersReduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (seen || prefersReduce) {
            setIntroReady(true);
            return;
        }
        try {
            sessionStorage.setItem('dg-intro-seen', '1');
        } catch {
            // sessionStorage onbeschikbaar — intro toont dan vaker; acceptabel.
        }
        setShowLoader(true);
    }, []);

    const finishIntro = useCallback(() => {
        setShowLoader(false);
        setIntroReady(true);
    }, []);

    useEffect(() => {
        const originalTitle = document.title;
        document.title = HOMEPAGE_SEO.title;

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        const path = window.location.pathname === '/scholen' ? '/scholen' : '/';
        const canonicalUrl = `https://dgskills.app${path === '/' ? '/' : path}`;
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

        setMeta('name', 'description', HOMEPAGE_SEO.description);
        setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setMeta('property', 'og:title', HOMEPAGE_SEO.title);
        setMeta('property', 'og:description', HOMEPAGE_SEO.description);
        setMeta('property', 'og:url', canonicalUrl);
        setMeta('property', 'og:image', HOMEPAGE_SEO.image);
        setMeta('name', 'twitter:title', HOMEPAGE_SEO.title);
        setMeta('name', 'twitter:description', HOMEPAGE_SEO.description);
        setMeta('name', 'twitter:image', HOMEPAGE_SEO.image);

        return () => {
            document.title = originalTitle;
        };
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [mobileMenuOpen]);

    const scrollTo = (target: string) => {
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() => {
            const element = document.getElementById(target);
            if (!element) return;
            const top = element.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({
                top: Math.max(0, top),
                behavior: reduceMotion ? 'auto' : 'smooth',
            });
        });
    };

    const startPilot = () => {
        trackLandingEvent('dual_cta_click', { type: 'plan_schoolpilot' });
    };

    return (
        <div className="min-h-screen overflow-x-clip bg-duck-bg font-sans text-duck-ink antialiased selection:bg-duck-acid selection:text-duck-ink">
            {showLoader && <PageLoader onDone={finishIntro} />}
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ${headerHidden ? '-translate-y-full' : 'translate-y-0'} ${mobileMenuOpen ? 'bg-duck-acid' : headerScrolled ? 'bg-duck-bg/95 shadow-[0_1px_0_rgba(32,32,35,0.10)] backdrop-blur-md' : 'bg-transparent'}`}
            >
                <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10" aria-label="Hoofdnavigatie">
                    <a href="/" className="flex min-h-[44px] items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2" aria-label="DGSkills homepage">
                        <DuckMark className="size-9" />
                        <span className="text-xl font-extrabold tracking-tight">DGSkills</span>
                    </a>

                    <div className="hidden items-center gap-8 lg:flex">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => scrollTo(item.target)}
                                className="group relative min-h-[44px] px-1 text-sm font-bold text-duck-ink transition-transform duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                {item.label}
                                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-duck-ink transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                            </button>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <a href="/login" className="group relative inline-flex min-h-[44px] items-center px-2 text-sm font-bold text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2">
                            Inloggen
                            <span className="absolute bottom-1.5 left-2 h-0.5 w-[calc(100%-1rem)] origin-left scale-x-0 bg-duck-ink transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                        </a>
                        <a
                            href="/pilot"
                            onClick={startPilot}
                            className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            Plan schoolpilot
                            <ArrowRightIcon />
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="grid size-11 place-items-center rounded-full border border-duck-ink bg-duck-bgLight text-duck-ink lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </nav>
            </header>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-duck-acid px-6 pb-10 pt-28 lg:hidden">
                    <nav aria-label="Mobiel menu" className="flex-1">
                        {NAV_ITEMS.map((item, index) => (
                            <button
                                key={item.target}
                                onClick={() => scrollTo(item.target)}
                                className={`block w-full border-b border-duck-ink/10 py-4 text-left font-display text-4xl text-duck-ink opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${['animate-fade-in-up', 'animate-fade-in-up-delay-1', 'animate-fade-in-up-delay-2', 'animate-fade-in-up-delay-3'][index] ?? 'animate-fade-in-up-delay-3'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-10 grid grid-cols-2 gap-3">
                        <a href="/login" className="grid min-h-[52px] place-items-center rounded-full border border-duck-ink text-sm font-extrabold text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink">
                            Inloggen
                        </a>
                        <a href="/pilot" onClick={startPilot} className="grid min-h-[52px] place-items-center rounded-full bg-duck-ink text-sm font-extrabold text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink">
                            Plan pilot
                        </a>
                    </div>
                </div>
            )}

            <main>
                <section data-home-hero className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-40">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
                        {trustChips.map((chip) => (
                            <span key={chip.label} data-chip-pop className={`absolute ${chip.pos}`}>
                                <span className={`inline-flex items-center whitespace-nowrap rounded-full border border-duck-ink px-4 py-2 text-xs font-bold ${chip.rotate} ${chip.tone === 'acid' ? 'bg-duck-acid text-duck-ink' : chip.tone === 'ink' ? 'bg-duck-ink text-duck-acid' : 'bg-duck-bgLight text-duck-ink'}`}>
                                    {chip.label}
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className="relative z-10 mx-auto max-w-5xl text-center">
                        <p className={`inline-flex items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up' : ''}`}>
                            Digitale geletterdheid voor VO &amp; VSO
                        </p>
                        <HeroHeadline introReady={introReady} />
                        <p className={`mx-auto mt-7 max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/70 sm:text-lg sm:leading-8 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up-delay-2' : ''}`}>
                            De missiegedreven leeromgeving voor VO en VSO, gekoppeld aan de SLO-kerndoelen. Van AI-geletterdheid tot online veiligheid: leerlingen leren door te doen, docenten zien voortgang per kerndoel.
                        </p>
                        <div className={`mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up-delay-3' : ''}`}>
                            <a
                                href="/pilot"
                                onClick={startPilot}
                                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-duck-ink bg-duck-acid px-8 py-3.5 text-base font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                Plan schoolpilot
                                <ArrowRightIcon />
                            </a>
                            <button
                                onClick={() => scrollTo('projecten')}
                                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-duck-ink/20 bg-duck-bgLight px-8 py-3.5 text-base font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-duck-ink sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                Bekijk de leerlingdemo
                                <span className="transition-transform duration-300 group-hover:translate-y-0.5"><ArrowDownIcon /></span>
                            </button>
                        </div>
                        <p className={`mx-auto mt-6 max-w-xl text-pretty text-sm font-bold leading-6 text-duck-ink/60 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up-delay-3' : ''}`}>
                            Voor VO en VSO: AI-missies, SLO-voortgang en portfolio-bewijs in een veilige leeromgeving.
                        </p>

                        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 lg:sr-only">
                            {trustChips.map((chip) => (
                                <li key={chip.label} className={`rounded-full border border-duck-ink px-3.5 py-1.5 text-xs font-bold ${chip.tone === 'acid' ? 'bg-duck-acid text-duck-ink' : chip.tone === 'ink' ? 'bg-duck-ink text-duck-acid' : 'bg-duck-bgLight text-duck-ink'}`}>
                                    {chip.label}
                                </li>
                            ))}
                        </ul>

                        <div className="pointer-events-none absolute -top-12 right-[6%] hidden rotate-6 md:block lg:-top-16 lg:right-[4%]" aria-hidden="true">
                            <DuckMascot className="size-16 lg:size-20 animate-duck-float motion-reduce:animate-none" />
                        </div>
                    </div>

                    <div className={`relative z-10 mx-auto mt-14 max-w-5xl opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 md:mt-16 ${introReady ? 'animate-fade-in-up-delay-3' : ''}`}>
                        <div data-hero-mockup className="relative mx-auto w-full max-w-[980px] lg:-rotate-1">
                            <BrowserFrame url="dgskills.app/missies">
                                <ScreenMissies />
                            </BrowserFrame>
                        </div>
                        <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-6 border-t border-duck-ink/10 pt-7 text-left lg:grid-cols-4">
                            {heroProofItems.map((item) => (
                                <div key={item.label}>
                                    <dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-duck-ink/50">{item.label}</dt>
                                    <dd className="mt-1.5 text-sm font-bold leading-snug">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <SkillMarquee reduceMotion={reduceMotion} />

                <JourneySection />

                <SkillsSection scrollTo={scrollTo} />

                <section id="projecten" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <Reveal>
                                <SectionLabel>Game demo</SectionLabel>
                                <h2 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Laat AI een game mee bouwen</h2>
                            </Reveal>
                            <Reveal delay={0.1} className="max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                Leerlingen schrijven zelf een prompt en zien meteen hun mini-game veranderen. De demo stopt na vijf prompts.
                            </Reveal>
                        </div>
                        <AiGameBuilderDemo reduceMotion={reduceMotion} />
                    </div>
                </section>

                <PortfolioStorySection startPilot={startPilot} />

                <section id="docent-les" className="relative scroll-mt-24 bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <Reveal className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div>
                                <SectionLabel>Voor docenten</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Zo werkt een DGSkills-les</h2>
                                <p className="mt-5 max-w-xl text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                    Een les hoeft geen losse uitleg over AI of mediawijsheid te zijn. DGSkills maakt er een maakmoment van, met zichtbare voortgang voor leerling en docent.
                                </p>
                                <ol className="mt-9">
                                    {lessonSteps.map((item) => (
                                        <li key={item.step} className="grid grid-cols-[4.5rem_1fr] items-start gap-4 border-t border-duck-ink/10 py-5 last:border-b">
                                            <span className="font-display text-4xl leading-none text-duck-ink/25" aria-hidden="true">{item.step}</span>
                                            <div>
                                                <h3 className="text-lg font-extrabold leading-tight">{item.title}</h3>
                                                <p className="mt-1.5 text-sm font-semibold leading-6 text-duck-ink/65">{item.copy}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <ProductProofFrame
                                label="Leerlingmissie"
                                title="Prompt Perfectionist"
                                screen={<ScreenMissieDetail />}
                                caption="Leerlingen maken, testen en leggen uit wat ze aanpassen."
                            />
                        </Reveal>
                    </div>
                </section>

                <section id="voor-schoolleiding" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl space-y-16">
                        <Reveal y={30} className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div>
                                <SectionLabel>Voor schoolleiding</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Waarom schoolleiders kiezen voor DGSkills</h2>
                                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                    De pilot laat zien dat leerlingen gemotiveerd raken én hoe digitale geletterdheid structureel in de school landt.
                                </p>
                                <a
                                    href="/pilot"
                                    onClick={startPilot}
                                    className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full border border-duck-ink bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                                >
                                    Plan pilotgesprek
                                    <ArrowRightIcon />
                                </a>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {leaderReasons.map((reason, index) => (
                                    <article key={reason.title} className={`rounded-[1.5rem] p-6 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] ${index % 3 === 0 ? 'bg-duck-acid' : 'bg-white'}`}>
                                        <p className="font-display text-3xl leading-none text-duck-ink/30" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                                        <h3 className="mt-4 text-xl font-extrabold leading-tight">{reason.title}</h3>
                                        <p className="mt-2.5 text-sm font-semibold leading-6 text-duck-ink/65">{reason.copy}</p>
                                    </article>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal y={30} className="space-y-5">
                            <div>
                                <SectionLabel>SLO &amp; curriculum proof</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-3xl leading-[1.08] md:text-4xl">Van losse activiteit naar aantoonbare leerlijn</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {sloRows.map((row, i) => (
                                    <article key={row.domain} className="rounded-[1.5rem] bg-white p-6 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] md:p-7">
                                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-duck-ink text-duck-acid">
                                            {sloIcons[i]}
                                        </div>
                                        <h3 className="text-base font-extrabold">{row.domain}</h3>
                                        <p className="mt-1 text-sm font-semibold text-duck-ink/65">{row.missions}</p>
                                        <p className="mt-3 text-xs font-bold leading-5 text-duck-ink/50">{row.proof}</p>
                                    </article>
                                ))}
                            </div>
                            <div className="rounded-[1.5rem] bg-duck-ink p-6 md:p-8">
                                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-acid">Voor ICT en privacy</p>
                                        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">Veilig te beoordelen door ICT</h2>
                                    </div>
                                    <p className="max-w-xs text-sm font-semibold leading-6 text-white/60">
                                        DGSkills is geen zwarte doos. De pilot geeft scholen tijd om privacy, AI en beheer concreet te toetsen.
                                    </p>
                                </div>
                                <div className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-5">
                                    {ictTrustItems.map((item) => (
                                        <div key={item.title}>
                                            <span className="mb-2 inline-block h-1.5 w-1.5 rounded-full bg-duck-acid" aria-hidden="true" />
                                            <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                                            <p className="mt-1 text-xs font-semibold leading-5 text-white/55">{item.copy}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section id="productbewijs" className="relative scroll-mt-24 bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <Reveal y={30}>
                            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                                <div>
                                    <SectionLabel>Product in beeld</SectionLabel>
                                    <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Schermen die de aankoopvraag beantwoorden</h2>
                                </div>
                                <p className="max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                    Elk scherm laat een ander beslispunt zien: motivatie voor leerlingen, grip voor docenten en vertrouwen voor schoolteams.
                                </p>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                {screenshotProofPanels.map((panel, index) => (
                                    <ProductProofFrame
                                        key={panel.label}
                                        label={panel.label}
                                        title={panel.title}
                                        screen={panel.screen}
                                        caption={panel.copy}
                                        featured={index === 1}
                                    />
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section id="schoolpilot" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <Reveal y={30} className="grid gap-10 rounded-[2rem] bg-duck-acid px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                            <div>
                                <p className="inline-flex rounded-full border border-duck-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]">Schoolpilot</p>
                                <h2 className="mt-5 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Wat krijg je in de schoolpilot?</h2>
                                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-duck-ink/70">
                                    Gebouwd vanuit de VO/VSO-praktijk en doorlopend getest met docenten. Klein genoeg om te starten, concreet genoeg voor een schoolbesluit.
                                </p>
                            </div>
                            <div>
                                <ul className="grid gap-x-6 sm:grid-cols-2">
                                    {pilotItems.map((item) => (
                                        <li key={item} className="flex gap-3 border-b border-duck-ink/10 py-3.5 text-sm font-extrabold leading-6">
                                            <CheckIcon />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/pilot"
                                    onClick={startPilot}
                                    className="mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-full bg-duck-ink px-8 py-3.5 text-sm font-extrabold text-duck-acid transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 focus-visible:ring-offset-duck-acid"
                                >
                                    Plan mijn schoolpilot
                                    <ArrowRightIcon />
                                </a>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <FaqSection />

                <FooterCta startPilot={startPilot} scrollTo={scrollTo} />
            </main>
        </div>
    );
};

function useHeaderChrome(menuOpen: boolean) {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuOpenRef = useRef(menuOpen);

    useEffect(() => {
        menuOpenRef.current = menuOpen;
        if (menuOpen) setHidden(false);
    }, [menuOpen]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let lastY = window.scrollY;
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                const y = window.scrollY;
                setScrolled(y > 24);
                if (menuOpenRef.current) {
                    setHidden(false);
                } else if (y > lastY + 6 && y > 160) {
                    setHidden(true);
                } else if (y < lastY - 6) {
                    setHidden(false);
                }
                lastY = y;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, []);

    return { hidden, scrolled };
}

function useHomepageGsapEffects(reduceMotion: boolean) {
    useEffect(() => {
        if (reduceMotion || typeof window === 'undefined') return;

        let cancelled = false;
        let ctx: { revert: () => void } | undefined;
        let matched: { revert: () => void } | undefined;

        void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
            .then(([gsapModule, scrollTriggerModule]) => {
                if (cancelled) return;
                const { gsap } = gsapModule;
                const { ScrollTrigger } = scrollTriggerModule;
                gsap.registerPlugin(ScrollTrigger);

                ctx = gsap.context(() => {
                    gsap.fromTo(
                        '[data-chip-pop]',
                        { autoAlpha: 0, scale: 0.6, y: 16 },
                        { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.09, delay: 0.5, ease: 'back.out(2.2)' }
                    );

                    const mm = gsap.matchMedia();
                    matched = mm;
                    mm.add('(min-width: 1024px)', () => {
                        gsap.to('[data-hero-mockup]', {
                            yPercent: -6,
                            rotation: -2.4,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: '[data-home-hero]',
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 0.8,
                            },
                        });

                        const track = document.querySelector<HTMLElement>('[data-skills-track]');
                        const stage = document.querySelector<HTMLElement>('[data-skills-stage]');
                        if (track && stage) {
                            const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
                            gsap.to(track, {
                                x: () => -getAmount(),
                                ease: 'none',
                                scrollTrigger: {
                                    trigger: stage,
                                    start: 'top top',
                                    end: () => `+=${getAmount()}`,
                                    pin: true,
                                    scrub: 0.6,
                                    anticipatePin: 1,
                                    invalidateOnRefresh: true,
                                },
                            });
                        }
                    });
                }, document.body);

                window.setTimeout(() => ScrollTrigger.refresh(), 200);
            })
            .catch(() => {
                // Motion enhancement should never block the landing page.
            });

        return () => {
            cancelled = true;
            matched?.revert();
            ctx?.revert();
        };
    }, [reduceMotion]);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="inline-flex items-center gap-2 rounded-full border border-duck-ink bg-duck-bgLight px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink">
            <span className="size-1.5 rounded-full bg-duck-ink" aria-hidden="true" />
            {children}
        </p>
    );
}

function SkillMarquee({ reduceMotion }: { reduceMotion: boolean }) {
    const row = (
        <div className="flex w-max shrink-0 items-center">
            {MARQUEE_WORDS.map((word) => (
                <span key={word} className="flex items-center gap-8 px-8 text-sm font-extrabold uppercase tracking-[0.22em] text-duck-ink">
                    {word}
                    <span className="text-base" aria-hidden="true">✦</span>
                </span>
            ))}
        </div>
    );

    return (
        <div className="overflow-hidden border-y border-duck-ink/10 bg-duck-acid py-4" aria-hidden="true">
            <div className={`flex w-max ${reduceMotion ? '' : 'animate-duck-marquee'}`}>
                {row}
                {row}
            </div>
        </div>
    );
}

function JourneySection() {
    const [active, setActive] = useState(0);
    const chapterRefs = useRef<Array<HTMLLIElement | null>>([]);
    const activeRef = useRef(0);
    const manualActiveUntilRef = useRef(0);

    const setActiveChapter = (index: number, fromUser = false) => {
        const next = Math.max(0, Math.min(journeyChapters.length - 1, index));
        if (fromUser) manualActiveUntilRef.current = Date.now() + 1600;
        if (activeRef.current === next) return;
        activeRef.current = next;
        setActive(next);
    };

    useEffect(() => {
        const elements = chapterRefs.current.filter(Boolean) as HTMLLIElement[];
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!visible) return;
                if (Date.now() < manualActiveUntilRef.current) return;
                const index = Number((visible.target as HTMLElement).dataset.chapterIndex ?? 0);
                setActiveChapter(index);
            },
            { rootMargin: '-34% 0px -42% 0px', threshold: [0.28, 0.5, 0.72] }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="journey" className="relative scroll-mt-24 overflow-x-clip bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
            <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
                    <Reveal>
                        <SectionLabel>Hoe het werkt</SectionLabel>
                        <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">
                            Jouw <em className="italic">skill journey</em>
                        </h2>
                        <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65 md:text-lg">
                            Van startniveau naar zichtbaar portfolio. Leerlingen zien steeds waar ze staan, wat de volgende stap is en welk bewijs ze opbouwen.
                        </p>
                        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-duck-acid px-4 py-2 text-sm font-extrabold">
                            <span className="size-2 rounded-full bg-duck-ink" aria-hidden="true" />
                            Heldere route, zichtbare groei
                        </p>
                    </Reveal>
                </div>

                <ol className="min-w-0">
                    {journeyChapters.map((chapter, index) => {
                        const isActive = active === index;
                        return (
                            <li
                                key={chapter.title}
                                ref={(node) => {
                                    chapterRefs.current[index] = node;
                                }}
                                data-chapter-index={index}
                                className="border-t border-duck-ink/10 last:border-b"
                            >
                                <button
                                    type="button"
                                    aria-current={isActive ? 'step' : undefined}
                                    aria-expanded={isActive}
                                    onClick={() => setActiveChapter(index, true)}
                                    onFocus={() => setActiveChapter(index, true)}
                                    className="grid w-full grid-cols-[5rem_1fr_2.5rem] items-baseline gap-4 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 focus-visible:ring-offset-duck-bgLight md:grid-cols-[6.5rem_1fr_2.75rem]"
                                >
                                    <span className={`font-display text-5xl leading-none transition-colors duration-300 md:text-6xl ${isActive ? 'text-duck-ink' : 'text-duck-ink/20'}`} aria-hidden="true">
                                        {chapter.step}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex flex-wrap items-center gap-2.5">
                                            <span className={`font-display text-2xl leading-tight md:text-3xl ${isActive ? 'text-duck-ink' : 'text-duck-ink/70'}`}>{chapter.title}</span>
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] transition-colors duration-300 ${isActive ? 'bg-duck-acid text-duck-ink' : 'bg-duck-ink/5 text-duck-ink/50'}`}>
                                                {chapter.eyebrow}
                                            </span>
                                        </span>
                                        <span className="mt-2 block max-w-xl text-pretty text-sm font-semibold leading-6 text-duck-ink/65 md:text-base md:leading-7">{chapter.copy}</span>
                                    </span>
                                    <span className={`grid size-10 place-items-center justify-self-end rounded-full border transition-all duration-300 ${isActive ? 'rotate-45 border-duck-ink bg-duck-ink text-duck-acid' : 'border-duck-ink/20 text-duck-ink'}`} aria-hidden="true">
                                        <PlusIcon />
                                    </span>
                                </button>
                                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="grid gap-4 pb-7 md:grid-cols-[1.25fr_0.75fr] md:items-end">
                                            <BrowserFrame url={`dgskills.app/${chapter.title.toLowerCase()}`}>
                                                {chapter.screen}
                                            </BrowserFrame>
                                            <div>
                                                <div className="rounded-[1.25rem] bg-duck-ink p-5 text-white">
                                                    <p className="font-display text-4xl text-duck-acid">{chapter.stat}</p>
                                                    <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white/60">{chapter.statLabel}</p>
                                                </div>
                                                <p className="mt-4 rounded-[1.25rem] bg-duck-acid px-5 py-4 text-sm font-extrabold leading-5">
                                                    {chapter.routeCoachTip}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

function SkillsSection({ scrollTo }: { scrollTo: (target: string) => void }) {
    return (
        <section id="skills" className="relative scroll-mt-24 overflow-hidden bg-duck-bg">
            <div data-skills-stage className="py-16 md:py-24 lg:flex lg:h-svh lg:min-h-[640px] lg:flex-col lg:justify-center lg:py-0">
                <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
                    <Reveal className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                        <div>
                            <SectionLabel>Skills</SectionLabel>
                            <h2 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Ontdek jouw favoriete skills</h2>
                        </div>
                        <p className="max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                            Elke skill krijgt een zichtbaar voorbeeld: een AI-tool bouwen, een game ontwerpen of veilig online werken. <span className="hidden lg:inline">Scroll verder om ze allemaal te zien.</span>
                        </p>
                    </Reveal>
                </div>

                <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-12 lg:overflow-visible lg:pb-0">
                    <div data-skills-track className="flex w-max snap-x snap-mandatory gap-5 px-5 md:px-10 lg:snap-none lg:will-change-transform">
                        {skills.map((skill) => (
                            <article
                                key={skill.title}
                                className={`relative flex h-[500px] w-[80vw] max-w-[400px] shrink-0 snap-center flex-col overflow-hidden rounded-[1.6rem] p-7 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] sm:h-[540px] ${skill.tone === 'acid' ? 'bg-duck-acid' : 'bg-white'}`}
                                aria-label={`${skill.title}. ${skill.coachTip}`}
                            >
                                <span className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[11rem] leading-none text-duck-ink/10" aria-hidden="true">
                                    {skill.letter}
                                </span>
                                <div className="relative flex items-center justify-between gap-3">
                                    <span className={`grid size-12 place-items-center rounded-full border border-duck-ink ${skill.tone === 'acid' ? 'bg-white/60' : 'bg-duck-acid'}`} aria-hidden="true">
                                        {skill.icon}
                                    </span>
                                    <span className="rounded-full border border-duck-ink px-3.5 py-1.5 text-xs font-extrabold">{skill.projects}</span>
                                </div>
                                <SkillVisual skill={skill} />
                                <h3 className="font-display text-3xl leading-tight">{skill.title}</h3>
                                <ul className="mt-4 space-y-1.5">
                                    {skill.bullets.map((bullet) => (
                                        <li key={bullet} className="flex gap-2.5 text-sm font-bold text-duck-ink/80">
                                            <CheckIcon />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className={`mt-auto rounded-[1rem] px-4 py-3 text-xs font-extrabold leading-5 ${skill.tone === 'acid' ? 'bg-white/60' : 'bg-duck-bg'}`}>
                                    Past goed bij: {skill.bestFor}.
                                </p>
                            </article>
                        ))}

                        <article className="relative flex h-[500px] w-[80vw] max-w-[400px] shrink-0 snap-center flex-col items-start justify-center overflow-hidden rounded-[1.6rem] bg-duck-ink p-9 text-white sm:h-[540px]">
                            <DuckMark className="size-14" />
                            <h3 className="mt-6 text-balance font-display text-4xl leading-[1.08]">
                                Zien hoe leerlingen <em className="italic text-duck-acid">bouwen</em>?
                            </h3>
                            <p className="mt-4 text-pretty text-sm font-semibold leading-6 text-white/65">
                                Probeer de live game-demo en laat AI meebouwen aan een mini-game.
                            </p>
                            <button
                                onClick={() => scrollTo('projecten')}
                                className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                Bekijk hoe leerlingen bouwen
                                <ArrowRightIcon />
                            </button>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}

const gameTheme = {
    name: 'Level 01 — Flow',
    sky: '#f8f8f5',
    pipe: '#202023',
    sprite: '#e1ff01',
} as const;

const QUICK_PROMPTS = [
    'Maak de game sneller en het gat kleiner',
    'Geef de lucht een avondkleur en maak de eend wit',
    'Maak de zwaartekracht lager zodat ik zachter val',
] as const;

const CONFIG_LABELS: Partial<Record<keyof GameConfig, string>> = {
    skyColor: 'luchtkleur',
    pipeColor: 'poortkleur',
    beaverColor: 'eend-kleur',
    gravity: 'zwaartekracht',
    flapVelocity: 'vleugelkracht',
    scrollSpeed: 'snelheid',
    gateGap: 'gat-grootte',
    gateInterval: 'poort-afstand',
};

function diffConfigLabels(prev: GameConfig, next: GameConfig): string[] {
    return (Object.keys(CONFIG_LABELS) as Array<keyof GameConfig>)
        .filter((key) => prev[key] !== next[key])
        .map((key) => CONFIG_LABELS[key] as string);
}

function AiGameBuilderDemo({ reduceMotion }: { reduceMotion: boolean }) {
    const [promptsUsed, setPromptsUsed] = useState(0);
    const [customPrompt, setCustomPrompt] = useState('');
    const [lastPrompt, setLastPrompt] = useState<string>('Nog geen prompt geschreven. Begin makkelijk: "maak het gat groter" of "maak de eend sneller".');
    const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [honeypot, setHoneypot] = useState('');
    const [changedLabels, setChangedLabels] = useState<string[]>([]);
    const promptLimitReached = promptsUsed >= 5;
    const inputDisabled = promptLimitReached || isLoading;

    const submitCustomPrompt = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = customPrompt.trim();
        if (!trimmed || inputDisabled) return;

        setIsLoading(true);
        setErrorText(null);
        setLastPrompt('Gemini denkt na…');

        const result = await tweakGameDemo(trimmed, gameConfig, honeypot);

        if (result.ok === true) {
            const next = applyDelta(gameConfig, result.delta);
            setChangedLabels(diffConfigLabels(gameConfig, next));
            setGameConfig(next);
            setLastPrompt(result.reply);
            setPromptsUsed((count) => Math.min(5, count + 1));
            setCustomPrompt('');
            if (typeof result.remaining === 'number' && result.remaining <= 0) {
                setPromptsUsed(5);
            }
        } else {
            setChangedLabels([]);
            setLastPrompt('Probeer het nog eens met een ander verzoek.');
            setErrorText(result.error.message);
            if (result.error.code === 'rate_limit') {
                setPromptsUsed(5);
            }
        }
        setIsLoading(false);
    };

    return (
        <Reveal y={34} className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] lg:grid-cols-[0.82fr_1.18fr] lg:p-5">
            <div className="flex min-h-[430px] flex-col rounded-[1.6rem] bg-duck-ink p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-acid">Gemini coach</p>
                        <h3 className="mt-1.5 font-display text-3xl">Schrijf je eigen prompt</h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-extrabold">{promptsUsed}/5 prompts</span>
                </div>

                <div className="mt-7 rounded-[1.25rem] bg-white/10 p-4" aria-live="polite">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">Laatste idee</p>
                    <p className="mt-2 text-base font-bold leading-7 text-white">{lastPrompt}</p>
                    {changedLabels.length > 0 && (
                        <p className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">Aangepast:</span>
                            {changedLabels.map((label) => (
                                <span key={label} className="rounded-full bg-duck-acid px-2.5 py-1 text-[10px] font-extrabold text-duck-ink">{label}</span>
                            ))}
                        </p>
                    )}
                    {errorText && (
                        <p className="mt-2 text-xs font-bold text-duck-error" role="alert">{errorText}</p>
                    )}
                </div>

                <form onSubmit={submitCustomPrompt} className="mt-auto pt-6">
                    <label htmlFor="game-prompt" className="text-sm font-extrabold text-white">Wat moet de game doen?</label>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                disabled={inputDisabled}
                                onClick={() => setCustomPrompt(prompt)}
                                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-bold text-white/80 transition-colors hover:border-duck-acid hover:text-duck-acid disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <textarea
                        id="game-prompt"
                        value={customPrompt}
                        onChange={(event) => setCustomPrompt(event.target.value)}
                        disabled={inputDisabled}
                        maxLength={500}
                        placeholder={promptLimitReached ? 'Promptlimiet bereikt' : 'Bijvoorbeeld: maak de eend sneller en het gat groter.'}
                        className="mt-3 min-h-[112px] w-full resize-none rounded-[1.25rem] border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/50 focus:border-duck-acid disabled:opacity-50"
                    />
                    {/* Honeypot — visually hidden, only bots fill this in */}
                    <input
                        type="text"
                        name="hp_field"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                        {promptLimitReached ? (
                            <a
                                href="/pilot"
                                onClick={() => trackLandingEvent('dual_cta_click', { type: 'plan_schoolpilot' })}
                                className="text-xs font-extrabold text-duck-acid underline decoration-duck-acid/50 underline-offset-4 hover:decoration-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                            >
                                Promptlimiet bereikt — leerlingen bouwen verder in de missie Game Programmeur. Plan een pilot →
                            </a>
                        ) : (
                            <p className="text-xs font-semibold text-white/55">Maximaal vijf prompts per demo.</p>
                        )}
                        <button
                            type="submit"
                            disabled={inputDisabled || !customPrompt.trim()}
                            className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-duck-acid px-6 py-2 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                        >
                            {isLoading ? 'Bezig…' : 'Pas aan'}
                            {!isLoading && <ArrowRightIcon />}
                        </button>
                    </div>
                </form>
            </div>

            <div className="relative min-h-[430px] rounded-[1.6rem] bg-duck-bgLight p-4">
                <div className="mb-4 flex items-center justify-between gap-3 px-1">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/50">Live preview</p>
                        <h3 className="font-display text-xl">{gameTheme.name}</h3>
                    </div>
                    <span className="rounded-full border border-duck-ink bg-duck-acid px-3.5 py-1.5 text-xs font-extrabold">Game Programmeur</span>
                </div>
                <PlayableSpriteStream reduceMotion={reduceMotion} config={gameConfig} />
            </div>
        </Reveal>
    );
}

function SpriteGlider({ color, reduceMotion, yPercent, domRef }: { color: string; reduceMotion: boolean; yPercent?: number; domRef?: React.Ref<HTMLDivElement> }) {
    return (
        <div
            ref={domRef}
            className={`absolute left-[8%] z-30 ${yPercent === undefined && !reduceMotion ? 'animate-duck-float' : ''}`}
            style={{ top: yPercent !== undefined ? `${yPercent}%` : '41%' }}
            aria-hidden="true"
        >
            {!reduceMotion && (
                <div className="absolute -left-10 top-[42%] flex flex-col gap-[4px]">
                    <span className="block h-[3px] w-8 rounded-full bg-duck-ink/20" />
                    <span className="block h-[3px] w-5 rounded-full bg-duck-ink/15" />
                    <span className="block h-[3px] w-3 rounded-full bg-duck-ink/10" />
                </div>
            )}
            <svg viewBox="0 0 64 64" width="58" height="58" xmlns="http://www.w3.org/2000/svg" className="-rotate-[5deg]" aria-hidden="true">
                <path d="M34 5c-3-1.3-6.4.3-7.5 3.4" fill="none" stroke="#202023" strokeWidth="3.6" strokeLinecap="round" />
                <circle cx="32" cy="34" r="24.5" fill={color} stroke="#202023" strokeWidth="4" />
                <ellipse cx="25" cy="31" rx="5" ry="8.4" fill="#202023" />
                <ellipse cx="41" cy="31" rx="5" ry="8.4" fill="#202023" />
                <rect x="24" y="44" width="17" height="8.5" rx="4.25" fill="#ffffff" stroke="#202023" strokeWidth="3.4" />
            </svg>
        </div>
    );
}

// Static physical sprite sizes (tuning happens via GameConfig)
const SPRITE_W = 8;
const SPRITE_H = 10;

type GameState = 'idle' | 'playing' | 'over';
interface Gate { id: number; x: number; gapTop: number; passed: boolean; }

function createGate(config: GameConfig, x: number): Gate {
    const maxGapTop = Math.max(8, 88 - config.gateGap - SPRITE_H);
    const minGapTop = 8;

    return {
        id: Date.now() + Math.random(),
        x,
        gapTop: minGapTop + Math.random() * Math.max(0, maxGapTop - minGapTop),
        passed: false,
    };
}

function createInitialGates(config: GameConfig): Gate[] {
    const firstVisibleGateX = 86;

    return [
        createGate(config, firstVisibleGateX),
        createGate(config, firstVisibleGateX + config.gateInterval),
    ];
}

function PlayableSpriteStream({ reduceMotion, config }: { reduceMotion: boolean; config: GameConfig }) {
    const gateColor = config.pipeColor ?? gameTheme.pipe;
    const spriteColor = config.beaverColor ?? gameTheme.sprite;
    const skyColor = config.skyColor ?? gameTheme.sky;
    const [gameState, setGameState] = useState<GameState>('idle');
    const [displayScore, setDisplayScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [renderTick, setRenderTick] = useState(0);

    const spriteY = useRef(50);
    const velocity = useRef(0);
    const gatesRef = useRef<Gate[]>([]);
    const scoreRef = useRef(0);
    const spriteDomRef = useRef<HTMLDivElement>(null);
    const animId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const frameCount = useRef(0);
    const gameStateRef = useRef<GameState>('idle');
    const configRef = useRef(config);

    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { configRef.current = config; }, [config]);
    useEffect(() => {
        if (gameState === 'over') {
            setBestScore((best) => Math.max(best, scoreRef.current));
        }
    }, [gameState]);

    const handleFlap = useCallback(() => {
        if (gameStateRef.current === 'idle') {
            spriteY.current = 50;
            velocity.current = configRef.current.flapVelocity;
            gatesRef.current = createInitialGates(configRef.current);
            scoreRef.current = 0;
            frameCount.current = 0;
            setDisplayScore(0);
            setRenderTick(t => t + 1);
            setGameState('playing');
        } else if (gameStateRef.current === 'playing') {
            velocity.current = configRef.current.flapVelocity;
        } else if (gameStateRef.current === 'over') {
            setGameState('idle');
        }
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code !== 'Space' && e.code !== 'Enter') return;
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'BUTTON')) return;
            e.preventDefault();
            handleFlap();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleFlap]);

    useEffect(() => {
        if (reduceMotion) return;
        if (gameState !== 'playing') {
            cancelAnimationFrame(animId.current);
            lastTime.current = 0;
            return;
        }

        const tick = (now: number) => {
            const dt = lastTime.current ? Math.min(2, (now - lastTime.current) / 16.67) : 1;
            lastTime.current = now;
            frameCount.current += 1;

            const cfg = configRef.current;

            velocity.current += cfg.gravity * dt;
            spriteY.current += velocity.current * dt;

            if (spriteY.current < 0 || spriteY.current > 88) {
                setGameState('over');
                return;
            }

            gatesRef.current = gatesRef.current
                .map(g => ({ ...g, x: g.x - cfg.scrollSpeed * dt }))
                .filter(g => g.x > -12);

            const last = gatesRef.current[gatesRef.current.length - 1];
            if (!last || last.x < 100 - cfg.gateInterval) {
                gatesRef.current.push(createGate(cfg, last ? last.x + cfg.gateInterval : 86));
            }

            const bL = 8;
            const bR = 8 + SPRITE_W;
            for (const g of gatesRef.current) {
                const gR = g.x + 10;
                if (g.x < bR && gR > bL) {
                    if (spriteY.current < g.gapTop || spriteY.current > g.gapTop + cfg.gateGap - SPRITE_H) {
                        setGameState('over');
                        return;
                    }
                }
                if (!g.passed && gR < bL) {
                    g.passed = true;
                    scoreRef.current += 1;
                    setDisplayScore(scoreRef.current);
                }
            }

            if (spriteDomRef.current) {
                spriteDomRef.current.style.top = `${spriteY.current}%`;
            }

            if (frameCount.current % 3 === 0) {
                setRenderTick(t => t + 1);
            }

            animId.current = requestAnimationFrame(tick);
        };

        animId.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId.current);
    }, [gameState, reduceMotion]);

    const staticGates: Gate[] = [
        { id: 1, x: 35, gapTop: 28, passed: false },
        { id: 2, x: 65, gapTop: 20, passed: false },
    ];
    const visibleGates = reduceMotion ? staticGates : gatesRef.current;

    void renderTick;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Speel mini-game — klik of druk op spatie om te starten"
            onClick={handleFlap}
            onTouchStart={(e) => { e.preventDefault(); handleFlap(); }}
            className="relative h-[390px] cursor-pointer touch-none select-none overflow-hidden rounded-[1.25rem] border border-duck-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
            style={{ backgroundColor: skyColor }}
        >
            <div className="absolute left-8 top-8 h-6 w-28 rounded-full bg-white/80" aria-hidden="true" />
            <div className="absolute right-16 top-16 h-5 w-24 rounded-full bg-white/60" aria-hidden="true" />
            <div className="absolute left-[46%] top-12 h-4 w-16 rounded-full bg-white/70" aria-hidden="true" />

            <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-duck-ink" aria-hidden="true">
                <div className="absolute left-0 right-0 top-0 h-2.5 bg-duck-acid" />
            </div>

            {visibleGates.map((gate) => (
                <div
                    key={gate.id}
                    className="absolute top-0 z-20 w-[10%]"
                    style={{ left: `${gate.x}%`, height: '100%' }}
                >
                    <div
                        className="absolute inset-x-0 top-0 rounded-b-[14px]"
                        style={{ height: `${gate.gapTop}%`, backgroundColor: gateColor }}
                    >
                        <div className="absolute bottom-4 left-1/2 h-[70%] w-[3px] -translate-x-1/2 rounded-full bg-white/15" />
                    </div>
                    <div
                        className="absolute inset-x-0 bottom-[72px] rounded-t-[14px]"
                        style={{ height: `${Math.max(0, 100 - gate.gapTop - config.gateGap)}%`, backgroundColor: gateColor }}
                    >
                        <div className="absolute left-1/2 top-4 h-[70%] w-[3px] -translate-x-1/2 rounded-full bg-white/15" />
                    </div>
                </div>
            ))}

            <SpriteGlider
                color={spriteColor}
                reduceMotion={reduceMotion}
                yPercent={gameState === 'idle' && !reduceMotion ? undefined : spriteY.current}
                domRef={spriteDomRef}
            />

            {gameState !== 'idle' && (
                <div className="absolute left-5 top-5 flex items-center gap-2">
                    <span className="flex items-center gap-2 rounded-full border border-duck-ink bg-white px-4 py-2">
                        <span className="size-2 rounded-full bg-duck-acid" aria-hidden="true" />
                        <span className="text-xs font-extrabold text-duck-ink">{displayScore} poorten</span>
                    </span>
                    {bestScore > 0 && (
                        <span className="rounded-full border border-duck-ink bg-duck-acid px-3.5 py-2 text-xs font-extrabold text-duck-ink">Beste: {bestScore}</span>
                    )}
                </div>
            )}

            {gameState === 'idle' && !reduceMotion && (
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6" aria-hidden="true">
                    <div className="flex flex-col items-center gap-2.5 rounded-[1.5rem] border border-duck-ink/10 bg-white/95 px-7 py-6 text-center shadow-[2px_4px_24px_rgba(32,32,35,0.15)] backdrop-blur-[2px]">
                        <p className="font-display text-2xl text-duck-ink">Probeer &rsquo;m zelf</p>
                        <p className="max-w-[250px] text-xs font-bold leading-5 text-duck-ink/60">Vlieg langs de poorten — en bouw de game daarna om met je eigen prompts.</p>
                        <span className="mt-1 inline-flex animate-pulse-soft items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-5 py-2.5 text-sm font-extrabold text-duck-ink motion-reduce:animate-none">
                            Klik of druk op spatie
                        </span>
                        {bestScore > 0 && (
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/40">Beste score: {bestScore} poorten</p>
                        )}
                    </div>
                </div>
            )}

            <div className="absolute right-5 top-5 rounded-full bg-duck-ink px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-duck-acid">
                Eigen side-scroller
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-start gap-3 rounded-[1.25rem] border border-duck-ink/10 bg-white/95 p-3.5">
                <span className="mt-1 size-2.5 flex-none rounded-full bg-duck-acid ring-1 ring-duck-ink" aria-hidden="true" />
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/50">Leerdoel</p>
                    <p className="mt-0.5 text-xs font-extrabold leading-snug text-duck-ink">Testen, aanpassen en uitleggen waarom de game beter wordt.</p>
                </div>
            </div>

            {gameState === 'over' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-duck-ink/40 backdrop-blur-[2px]">
                    <div className="rounded-[1.5rem] bg-white px-8 py-6 text-center shadow-[2px_4px_24px_rgba(32,32,35,0.20)]">
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/50">Game over</p>
                        <p className="mt-1 font-display text-5xl text-duck-ink">{displayScore}</p>
                        <p className="text-xs font-semibold text-duck-ink/60">poorten gehaald</p>
                        {displayScore > 0 && displayScore >= bestScore && (
                            <p className="mx-auto mt-2 w-fit rounded-full bg-duck-acid px-3.5 py-1 text-[11px] font-extrabold text-duck-ink">Nieuw record!</p>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleFlap(); }}
                            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-6 py-2 text-sm font-extrabold text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        >
                            Opnieuw
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PortfolioStorySection({ startPilot }: { startPilot: () => void }) {
    const reduceMotion = usePrefersReducedMotion();
    const sectionRef = useRef<HTMLElement | null>(null);
    const [progress, setProgress] = useState(0);
    const panels = [
        {
            kicker: 'Avatar',
            title: 'Een leerling bouwt een herkenbare identiteit.',
            copy: 'Niet alleen punten, maar een profiel dat laat zien welke rol iemand pakt: maker, onderzoeker, ontwerper of programmeur.',
            screen: <ScreenAvatar />,
            url: 'dgskills.app/avatar',
            statLabel: 'Mila — eigen identiteit',
            stat: 'Level 1 · Architect',
        },
        {
            kicker: 'Trofeeën',
            title: 'Trofeeën maken groei zichtbaar.',
            copy: 'Leerlingen zien wat ze al beheersen en welke volgende stap logisch is.',
            screen: <ScreenVoortgang />,
            url: 'dgskills.app/voortgang',
            statLabel: 'Streak — week 12',
            stat: '12 dagen · 4 badges',
        },
        {
            kicker: 'Portfolio',
            title: 'Projecten worden bewijsstukken.',
            copy: 'Een portfolio vertelt wat iemand gemaakt heeft, welke keuzes zijn gemaakt en welke skills daarbij horen.',
            screen: <ScreenPortfolio />,
            url: 'dgskills.app/portfolio',
            statLabel: 'Mila — Level 6 Creator',
            stat: '1.840 XP · 4 projecten',
        },
        {
            kicker: 'Docent',
            title: 'De docent ziet waar groei zit.',
            copy: 'Voor scholen wordt zichtbaar waar een leerling sterk op scoort, waar extra uitleg nodig is en welke SLO-doelen geraakt worden.',
            screen: <ScreenDocent />,
            url: 'dgskills.app/docent',
            statLabel: 'Klas 3D · Periode 1',
            stat: '9 SLO-kerndoelen zichtbaar',
        },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let frame = 0;
        let last = 0;
        const update = () => {
            frame = 0;
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const travel = Math.max(1, rect.height - window.innerHeight);
            const next = Math.min(1, Math.max(0, -rect.top / travel));
            if (Math.abs(next - last) > 0.005) {
                last = next;
                setProgress(next);
            }
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeInCubic = (x: number) => x * x * x;
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    const segmentProgress = (offset: number, start: number, end: number) => clamp01((offset - start) / (end - start));

    const getCardStyle = (index: number): React.CSSProperties => {
        const N = panels.length;
        const t = progress * (N - 1);

        if (reduceMotion) {
            const active = Math.round(t) === index;
            return {
                opacity: active ? 1 : 0,
                transform: 'none',
                zIndex: active ? N : 0,
                pointerEvents: active ? 'auto' : 'none',
                transition: 'opacity 240ms ease',
            };
        }

        const offset = t - index; // <0 = nog in dek, 0 = actief, >0 = aan het wegvliegen
        let txValue: number, txUnit: 'px' | '%';
        let ty: number, rot: number, sc: number, op: number;
        let shakeX = 0;
        let shakeY = 0;
        let shakeRot = 0;

        if (offset <= 0) {
            // incoming: kaart staat in het dek erachter, fan-stack zichtbaar
            const depth = Math.min(-offset, 3);
            const pull = easeOutCubic(clamp01(1 + offset));
            txValue = depth * -10 + pull * 10;
            txUnit = 'px';
            ty = depth * 16 - pull * 10;
            rot = depth * -2.6 + pull * 2.4;
            sc = Math.max(0.8, 1 - depth * 0.055 + pull * 0.035);
            op = -offset > 3.1 ? 0 : 1;
        } else {
            const settle = segmentProgress(offset, 0, 0.16);
            const shuffle = segmentProgress(offset, 0.16, 0.58);
            const leave = segmentProgress(offset, 0.58, 1);
            const shuffleWave = Math.sin(shuffle * Math.PI * 3);
            const leaveEase = easeInCubic(leave);

            shakeX = shuffleWave * 10 * (1 - shuffle * 0.35);
            shakeY = Math.sin(shuffle * Math.PI * 2) * 6 * (1 - shuffle * 0.45);
            shakeRot = shuffleWave * 3.2 * (1 - shuffle * 0.35);

            txValue = shakeX - 118 * leaveEase;
            txUnit = '%';
            ty = -6 * settle + shakeY - 46 * leaveEase;
            rot = shakeRot - 19 * leaveEase;
            sc = 1 + 0.012 * (1 - settle) - 0.075 * leaveEase;
            op = clamp01(1 - leave * 1.25);
        }

        const distFromActive = Math.abs(offset);
        return {
            zIndex: N - Math.round(distFromActive * 2),
            opacity: op,
            transform: `translate3d(${txValue}${txUnit}, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`,
            transition: 'transform 90ms linear, opacity 160ms ease',
            pointerEvents: distFromActive < 0.5 ? 'auto' : 'none',
            willChange: 'transform, opacity',
        };
    };

    return (
        <section
            id="portfolio"
            ref={sectionRef}
            className={`relative scroll-mt-24 bg-duck-bgLight px-5 py-20 md:px-10 ${reduceMotion ? '' : 'lg:min-h-[420svh] lg:py-0'}`}
        >
            <div className={`mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.72fr_1.28fr] ${reduceMotion ? 'lg:items-start' : 'lg:sticky lg:top-20 lg:h-[calc(100svh-80px)] lg:items-center'}`}>
                <Reveal className="lg:h-fit lg:self-center">
                    <SectionLabel>Portfolio</SectionLabel>
                    <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">
                        Jouw portfolio. <em className="italic">Jouw verhaal.</em>
                    </h2>
                    <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                        Scroll door een portfolio dat echt iets vertelt: wie je bent, wat je maakt, welke trofeeën je haalt en waar je nog groeit.
                    </p>
                    <a
                        href="/pilot"
                        onClick={startPilot}
                        className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full border border-duck-ink bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    >
                        Plan pilot met portfolio-route
                        <ArrowRightIcon />
                    </a>
                </Reveal>

                <div className={`${reduceMotion ? 'hidden' : 'relative hidden h-[min(68svh,560px)] min-h-[440px] overflow-visible lg:block'}`}>
                    <div className="absolute inset-0 translate-x-9 translate-y-10 rotate-3 rounded-[1.6rem] bg-duck-acid/60" aria-hidden="true" />
                    <div className="absolute inset-0 translate-x-5 translate-y-5 -rotate-2 rounded-[1.6rem] bg-white/70" aria-hidden="true" />
                    {panels.map((panel, index) => (
                        <article
                            key={panel.title}
                            className="absolute inset-0 grid overflow-hidden rounded-[1.6rem] bg-white shadow-[2px_4px_24px_rgba(199,197,188,0.40)] md:grid-cols-[0.8fr_1.2fr]"
                            style={getCardStyle(index)}
                            aria-hidden={Math.abs(progress * (panels.length - 1) - index) >= 0.5}
                        >
                            <div className="flex flex-col justify-center p-9 md:p-10">
                                <p className="w-fit rounded-full bg-duck-acid px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em]">{panel.kicker}</p>
                                <h3 className="mt-4 font-display text-3xl leading-[1.1]">{panel.title}</h3>
                                <p className="mt-4 text-base font-semibold leading-7 text-duck-ink/65">{panel.copy}</p>
                                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/40">
                                    Stap {String(index + 1).padStart(2, '0')} van {String(panels.length).padStart(2, '0')}
                                </p>
                            </div>
                            <div className="relative bg-duck-bg p-6 md:p-7">
                                <BrowserFrame url={panel.url}>
                                    {panel.screen}
                                </BrowserFrame>
                                <div className="absolute -bottom-3 right-5 max-w-[78%] rounded-[1rem] bg-duck-ink px-4 py-3 text-white">
                                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-duck-acid">{panel.statLabel}</p>
                                    <p className="mt-0.5 text-sm font-extrabold">{panel.stat}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={`space-y-7 ${reduceMotion ? '' : 'lg:hidden'}`}>
                    {panels.map((panel, index) => (
                        <Reveal key={panel.title} delay={index * 0.05} y={34} className="overflow-hidden rounded-[1.6rem] bg-white shadow-[2px_4px_24px_rgba(199,197,188,0.30)]">
                            <div className="p-7">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="rounded-full bg-duck-acid px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em]">{panel.kicker}</p>
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/40">
                                        Stap {String(index + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="mt-4 font-display text-2xl leading-[1.1]">{panel.title}</h3>
                                <p className="mt-3 text-base font-semibold leading-7 text-duck-ink/65">{panel.copy}</p>
                            </div>
                            <div className="relative bg-duck-bg px-5 pb-9 pt-2">
                                <BrowserFrame url={panel.url}>
                                    {panel.screen}
                                </BrowserFrame>
                                <div className="absolute -bottom-3 right-4 max-w-[80%] rounded-[0.9rem] bg-duck-ink px-3.5 py-2.5 text-white">
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-duck-acid">{panel.statLabel}</p>
                                    <p className="mt-0.5 text-xs font-extrabold">{panel.stat}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <section id="faq" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
            <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <Reveal y={30} className="lg:sticky lg:top-32 lg:self-start">
                    <SectionLabel>FAQ per rol</SectionLabel>
                    <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">De vragen die in een schoolteam op tafel komen</h2>
                </Reveal>
                <Reveal y={30}>
                    <div role="list">
                        {roleFaqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={faq.role} role="listitem" className="border-t border-duck-ink/10 last:border-b">
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                                    >
                                        <span>
                                            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/45">{faq.role}</span>
                                            <span className="mt-1.5 block font-display text-xl leading-snug md:text-2xl">{faq.question}</span>
                                        </span>
                                        <span className={`grid size-10 flex-none place-items-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-45 border-duck-ink bg-duck-acid' : 'border-duck-ink/20'}`} aria-hidden="true">
                                            <PlusIcon />
                                        </span>
                                    </button>
                                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <p className="max-w-xl pb-6 text-base font-semibold leading-7 text-duck-ink/65">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function FooterCta({ startPilot, scrollTo }: { startPilot: () => void; scrollTo: (target: string) => void }) {
    return (
        <section className="relative bg-duck-ink px-5 pb-12 pt-24 text-white md:px-10 md:pt-32">
            <Reveal className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="relative grid size-40 place-items-center md:size-44" aria-hidden="true">
                    <svg viewBox="0 0 200 200" className="absolute inset-0 animate-duck-spin-slow motion-reduce:animate-none">
                        <defs>
                            <path id="dg-cta-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
                        </defs>
                        <text className="fill-duck-acid text-[13.5px] font-extrabold uppercase tracking-[0.34em]">
                            <textPath href="#dg-cta-circle">Plan een schoolpilot • Samen starten • </textPath>
                        </text>
                    </svg>
                    <DuckMascot className="size-16 md:size-[4.5rem]" />
                </div>
                <h2 className="mt-8 text-balance font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.04]">
                    Klaar om iets{' '}
                    <span className="relative inline-block whitespace-nowrap">
                        <span aria-hidden="true" className="absolute inset-x-[-4%] inset-y-[8%] -rotate-1 rounded-[0.5em] bg-duck-acid" />
                        <em className="relative italic text-duck-ink">tofs</em>
                    </span>{' '}
                    te maken?
                </h2>
                <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-white/65">
                    Plan een schoolpilot en ontdek welke route past bij jouw leerlingen.
                </p>
                <a
                    href="/pilot"
                    onClick={startPilot}
                    className="mt-9 inline-flex min-h-[56px] items-center gap-3 rounded-full bg-duck-acid px-9 py-4 text-base font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                >
                    Plan mijn pilot
                    <ArrowRightIcon />
                </a>
            </Reveal>

            <footer className="relative z-10 mx-auto mt-20 max-w-6xl border-t border-white/10 pt-8 text-sm font-semibold text-white/65">
                <div className="grid gap-8 md:grid-cols-3 md:items-center">
                    <a href="/" className="inline-flex min-h-[44px] w-fit items-center rounded font-extrabold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">
                        dgskills.app
                    </a>
                    <div className="flex items-center gap-3 md:justify-center">
                        <DuckMark className="size-9" />
                        <span className="text-lg font-extrabold tracking-tight text-white">DGSkills</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
                        <button onClick={() => scrollTo('journey')} className="min-h-[44px] rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">Hoe het werkt</button>
                        <a href="/ict/privacy/cookies" className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">Cookies</a>
                        <a href="/ict/privacy/policy" className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">Privacy</a>
                        <a href="/ict/privacy/ai" className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">AI-transparantie</a>
                        <a href="mailto:info@dgskills.app" className="inline-flex min-h-[44px] items-center rounded transition-colors hover:text-duck-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink">Contact</a>
                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
                    <p>Eenmanszaak Yorin Vonder · KvK 81819889 · info@dgskills.app</p>
                    <p>Zin om samen te werken?</p>
                </div>
            </footer>
        </section>
    );
}

function Reveal({
    children,
    className,
    delay = 0,
    y = 24,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    style?: React.CSSProperties;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (reduceMotion) {
            setInView(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.16 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [reduceMotion]);

    if (reduceMotion) {
        return <div className={className} style={style}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                opacity: inView ? 1 : 0.92,
                transform: inView ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
                transition: `opacity 680ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 680ms cubic-bezier(.22,1,.36,1) ${delay}s`,
                willChange: inView ? 'auto' : 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-[1.25rem] bg-duck-ink shadow-[2px_4px_24px_rgba(199,197,188,0.40)]">
            <div className="flex h-10 items-center gap-1.5 px-4">
                <span className="size-2.5 rounded-full bg-white/25" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-white/25" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-duck-acid" aria-hidden="true" />
                <span className="ml-3 truncate rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-extrabold text-white/65">{url}</span>
            </div>
            <div className="overflow-hidden rounded-t-[0.9rem] bg-white">{children}</div>
        </div>
    );
}

/* ---- Mock-productschermen in DUCK-stijl (productimpressies, geen screenshots) ---- */

function ScreenMissies() {
    const missions = [
        { title: 'Prompt Perfectionist', domain: 'Digitale vaardigheden', pct: 72, tone: 'acid' },
        { title: 'Deepfake Detector', domain: 'Mediawijsheid', pct: 38, tone: 'paper' },
        { title: 'Game Programmeur', domain: 'Computational thinking', pct: 12, tone: 'ink' },
    ] as const;

    return (
        <div className="flex aspect-[16/10] bg-duck-bgLight text-duck-ink">
            <aside className="hidden w-[24%] flex-col gap-1.5 border-r border-duck-ink/10 bg-white p-[4%] sm:flex">
                <div className="mb-2 flex items-center gap-1.5">
                    <DuckMark className="w-[22%] min-w-4" />
                    <span className="text-[0.5em] font-extrabold sm:text-[10px]">DGSkills</span>
                </div>
                {['Missies', 'Routes', 'Portfolio', 'Badges'].map((item, index) => (
                    <span key={item} className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${index === 0 ? 'bg-duck-acid' : 'text-duck-ink/45'}`}>{item}</span>
                ))}
            </aside>
            <div className="min-w-0 flex-1 p-[4%]">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/40">Mijn route</p>
                        <p className="font-display text-[15px] leading-tight">Goedemorgen Jamie</p>
                    </div>
                    <span className="rounded-full bg-duck-ink px-2.5 py-1 text-[9px] font-extrabold text-duck-acid">1.840 XP</span>
                </div>
                <div className="mt-[4%] grid gap-[3%]">
                    {missions.map((mission) => (
                        <div key={mission.title} className={`rounded-xl p-2.5 ${mission.tone === 'acid' ? 'bg-duck-acid' : mission.tone === 'ink' ? 'bg-duck-ink text-white' : 'bg-white'}`}>
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-[10px] font-extrabold">{mission.title}</p>
                                <span className={`hidden whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-extrabold sm:inline ${mission.tone === 'ink' ? 'bg-white/10 text-duck-acid' : 'bg-duck-ink text-duck-acid'}`}>{mission.domain}</span>
                            </div>
                            <div className={`mt-2 h-1.5 overflow-hidden rounded-full ${mission.tone === 'ink' ? 'bg-white/15' : 'bg-duck-ink/10'}`}>
                                <div className={`h-full rounded-full ${mission.tone === 'acid' ? 'bg-duck-ink' : 'bg-duck-acid'}`} style={{ width: `${mission.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ScreenMissieDetail() {
    return (
        <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-lg bg-duck-acid text-[10px] font-extrabold">01</span>
                    <p className="font-display text-[14px] leading-tight">Prompt Perfectionist</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-duck-ink/60">Digitale vaardigheden</span>
            </div>
            <div className="mt-[3.5%] rounded-xl bg-white p-3">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/40">Opdracht</p>
                <p className="mt-1 text-[10px] font-bold leading-snug">Schrijf een prompt die de AI een spannend verhaal laat vertellen voor groep 2.</p>
            </div>
            <div className="mt-[3%] rounded-xl border-2 border-duck-ink bg-white p-3">
                <p className="text-[10px] font-semibold leading-snug text-duck-ink/80">
                    Vertel een spannend verhaal over een robot die leert fietsen, met een grappig einde<span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse-soft bg-duck-ink align-baseline" />
                </p>
            </div>
            <div className="mt-[3%] flex items-center justify-between gap-2">
                <span className="rounded-full bg-duck-acid px-2.5 py-1 text-[9px] font-extrabold">Sterke prompt! +25 XP</span>
                <span className="rounded-full bg-duck-ink px-3 py-1.5 text-[9px] font-extrabold text-duck-acid">Volgende stap →</span>
            </div>
        </div>
    );
}

function ScreenBouwen() {
    return (
        <div className="flex aspect-[16/10] gap-[3%] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="relative w-[58%] overflow-hidden rounded-xl border-2 border-duck-ink bg-white">
                <div className="absolute left-[12%] top-[38%]">
                    <svg viewBox="0 0 64 64" className="w-7 -rotate-[5deg]" aria-hidden="true">
                        <circle cx="32" cy="34" r="24.5" fill="#e1ff01" stroke="#202023" strokeWidth="4" />
                        <ellipse cx="25" cy="31" rx="5" ry="8.4" fill="#202023" />
                        <ellipse cx="41" cy="31" rx="5" ry="8.4" fill="#202023" />
                        <rect x="24" y="44" width="17" height="8.5" rx="4.25" fill="#ffffff" stroke="#202023" strokeWidth="3.4" />
                    </svg>
                </div>
                <div className="absolute right-[28%] top-0 h-[32%] w-[12%] rounded-b-md bg-duck-ink" />
                <div className="absolute bottom-[14%] right-[28%] h-[30%] w-[12%] rounded-t-md bg-duck-ink" />
                <div className="absolute bottom-0 inset-x-0 h-[14%] bg-duck-ink">
                    <div className="h-[22%] bg-duck-acid" />
                </div>
                <span className="absolute left-2 top-2 rounded-full bg-duck-bgLight px-2 py-0.5 text-[8px] font-extrabold text-duck-ink/60">Live test</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[4%]">
                <p className="font-display text-[13px] leading-tight">Bouw je game</p>
                {[{ label: 'Snelheid', pct: 65 }, { label: 'Gat-grootte', pct: 40 }].map((slider) => (
                    <div key={slider.label} className="rounded-xl bg-white p-2.5">
                        <div className="flex justify-between text-[8px] font-extrabold uppercase tracking-[0.12em] text-duck-ink/50">
                            <span>{slider.label}</span><span>{slider.pct}</span>
                        </div>
                        <div className="relative mt-1.5 h-1.5 rounded-full bg-duck-ink/10">
                            <div className="h-full rounded-full bg-duck-acid ring-1 ring-duck-ink/20" style={{ width: `${slider.pct}%` }} />
                            <span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-duck-ink bg-duck-acid" style={{ left: `calc(${slider.pct}% - 6px)` }} />
                        </div>
                    </div>
                ))}
                <span className="mt-auto rounded-full bg-duck-ink px-3 py-2 text-center text-[9px] font-extrabold text-duck-acid">Test je game ▶</span>
            </div>
        </div>
    );
}

function ScreenVoortgang() {
    const RADIUS = 15.9155;
    const CIRC = 2 * Math.PI * RADIUS;
    return (
        <div className="flex aspect-[16/10] items-center gap-[5%] bg-duck-bgLight p-[5%] text-duck-ink">
            <div className="relative w-[34%] shrink-0">
                <svg viewBox="0 0 42 42" className="w-full -rotate-90">
                    <circle cx="21" cy="21" r={RADIUS} fill="none" stroke="#202023" strokeOpacity="0.1" strokeWidth="5" />
                    <circle cx="21" cy="21" r={RADIUS} fill="none" stroke="#e1ff01" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${CIRC * 0.72} ${CIRC}`} />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                        <p className="font-display text-[16px] leading-none">72%</p>
                        <p className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-duck-ink/40">Periode 1</p>
                    </div>
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-display text-[14px] leading-tight">Mila</p>
                    <span className="rounded-full bg-duck-ink px-2 py-0.5 text-[8px] font-extrabold text-duck-acid">Level 6 · Creator</span>
                </div>
                <div className="mt-[4%] grid grid-cols-3 gap-[3%]">
                    {[{ name: 'Doorzetter', tone: 'acid' }, { name: 'Maker', tone: 'ink' }, { name: 'Factchecker', tone: 'paper' }].map((badge) => (
                        <div key={badge.name} className={`rounded-xl p-2 text-center ${badge.tone === 'acid' ? 'bg-duck-acid' : badge.tone === 'ink' ? 'bg-duck-ink text-duck-acid' : 'bg-white'}`}>
                            <p className="font-display text-[12px] leading-none">★</p>
                            <p className="mt-1 truncate text-[7px] font-extrabold">{badge.name}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-[4%] w-fit rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold text-duck-ink/70">🔥 12 dagen streak · 4 badges</p>
            </div>
        </div>
    );
}

function ScreenPortfolio() {
    return (
        <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-duck-acid ring-2 ring-duck-ink">
                    <DuckMark className="size-5" />
                </span>
                <div>
                    <p className="font-display text-[14px] leading-tight">Mila — portfolio</p>
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-duck-ink/40">Level 6 Creator · 1.840 XP · 4 projecten</p>
                </div>
            </div>
            <div className="mt-[4%] grid grid-cols-2 gap-[3%]">
                {[
                    { title: 'Mijn eigen mini-game', tags: ['Code & Bouw', '+120 XP'], tone: 'acid' },
                    { title: 'Deepfake-checklist', tags: ['Mediawijsheid', '+90 XP'], tone: 'paper' },
                ].map((project) => (
                    <div key={project.title} className={`rounded-xl p-2.5 ${project.tone === 'acid' ? 'bg-duck-acid' : 'bg-white'}`}>
                        <div className={`h-9 rounded-lg ${project.tone === 'acid' ? 'bg-white/55' : 'bg-duck-bgLight'}`} />
                        <p className="mt-2 truncate text-[10px] font-extrabold">{project.title}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-duck-ink px-1.5 py-0.5 text-[7px] font-extrabold text-duck-acid">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-[4%] rounded-xl bg-white px-2.5 py-2 text-[9px] font-bold leading-snug text-duck-ink/70">"Ik heb mijn game drie keer verbeterd na feedback — de besturing is nu veel soepeler."</p>
        </div>
    );
}

function ScreenDocent() {
    const rows = [
        { name: 'Mila V.', pct: 82 },
        { name: 'Noah K.', pct: 64 },
        { name: 'Sara B.', pct: 47 },
        { name: 'Liam J.', pct: 29 },
    ] as const;
    return (
        <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[14px] leading-tight">Klas 3D · Periode 1</p>
                <span className="rounded-full bg-duck-acid px-2.5 py-1 text-[8px] font-extrabold">2 hulpvragen</span>
            </div>
            <div className="mt-[3.5%] overflow-hidden rounded-xl bg-white">
                {rows.map((row, index) => (
                    <div key={row.name} className={`flex items-center gap-2.5 px-2.5 py-2 ${index > 0 ? 'border-t border-duck-ink/5' : ''}`}>
                        <span className="w-[22%] truncate text-[9px] font-extrabold">{row.name}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-duck-ink/10">
                            <span className="block h-full rounded-full bg-duck-acid ring-1 ring-duck-ink/15" style={{ width: `${row.pct}%` }} />
                        </span>
                        <span className="flex gap-0.5">
                            {[0, 1, 2].map((dot) => (
                                <span key={dot} className={`size-1.5 rounded-full ${dot < Math.round(row.pct / 34) ? 'bg-duck-ink' : 'bg-duck-ink/15'}`} />
                            ))}
                        </span>
                        <span className="text-[8px] font-extrabold text-duck-ink/45">{row.pct}%</span>
                    </div>
                ))}
            </div>
            <p className="mt-[3.5%] w-fit rounded-full bg-duck-ink px-2.5 py-1 text-[8px] font-extrabold text-duck-acid">9 SLO-kerndoelen zichtbaar</p>
        </div>
    );
}

function ScreenPrivacy() {
    const docs = ['Verwerkersovereenkomst', 'DPIA-informatie', 'AI-transparantie'] as const;
    return (
        <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[14px] leading-tight">Privacy & ICT</p>
                <span className="rounded-full bg-duck-ink px-2.5 py-1 text-[8px] font-extrabold text-duck-acid">Data in de EU</span>
            </div>
            <div className="mt-[3.5%] grid gap-[3%]">
                {docs.map((doc) => (
                    <div key={doc} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                        <span className="text-[10px] font-extrabold">{doc}</span>
                        <span className="grid size-4 place-items-center rounded-full bg-duck-acid ring-1 ring-duck-ink">
                            <svg viewBox="0 0 20 20" className="size-2.5" fill="none" stroke="#202023" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10 4 4 8-8" /></svg>
                        </span>
                    </div>
                ))}
            </div>
            <p className="mt-[3.5%] rounded-xl bg-white px-3 py-2 text-[9px] font-bold leading-snug text-duck-ink/70">Beoordeelbaar vóór de pilot start — samen met ICT en privacy-team.</p>
        </div>
    );
}

function ScreenAvatar() {
    return (
        <div className="flex aspect-[16/10] items-center gap-[5%] bg-duck-bgLight p-[5%] text-duck-ink">
            <div className="grid w-[38%] shrink-0 place-items-center">
                <div className="grid aspect-square w-full place-items-center rounded-[28%] bg-duck-acid ring-2 ring-duck-ink">
                    <DuckMark className="w-[58%]" />
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] leading-tight">Kies je look, Mila</p>
                <div className="mt-[4%] flex gap-1.5">
                    {['#e1ff01', '#ffffff', '#202023', '#c2c1bd'].map((swatch, index) => (
                        <span key={swatch} className={`size-5 rounded-full border-2 ${index === 0 ? 'border-duck-ink' : 'border-duck-ink/20'}`} style={{ backgroundColor: swatch }} />
                    ))}
                </div>
                <div className="mt-[4%] flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-duck-ink px-2.5 py-1 text-[8px] font-extrabold text-duck-acid">Level 1 · Architect</span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold text-duck-ink/60">Maker</span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-extrabold text-duck-ink/60">Onderzoeker</span>
                </div>
                <p className="mt-[4%] w-fit rounded-full bg-duck-acid px-2.5 py-1 text-[8px] font-extrabold">Profiel opgeslagen ✓</p>
            </div>
        </div>
    );
}

function ProductProofFrame({
    label,
    title,
    screen,
    caption,
    featured = false,
}: {
    label: string;
    title: string;
    screen: React.ReactNode;
    caption: string;
    featured?: boolean;
}) {
    return (
        <article className={`overflow-hidden rounded-[1.6rem] bg-white shadow-[2px_4px_24px_rgba(199,197,188,0.30)] ${featured ? 'md:col-span-2 lg:grid lg:grid-cols-[0.72fr_1.28fr]' : ''}`}>
            <div className="flex flex-col justify-center p-6 md:p-7">
                <span className="w-fit rounded-full bg-duck-acid px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]">{label}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight md:text-3xl">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-duck-ink/65">{caption}</p>
            </div>
            <div className="bg-duck-bg p-4 md:p-5">
                <BrowserFrame url="dgskills.app">
                    {screen}
                </BrowserFrame>
            </div>
        </article>
    );
}

function PageLoader({ onDone }: { onDone: () => void }) {
    const [pct, setPct] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        let raf = 0;
        let exitTimer = 0;
        const start = performance.now();
        const DURATION = 1100;
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / DURATION);
            setPct(Math.round(progress * 100));
            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setLeaving(true);
                exitTimer = window.setTimeout(onDone, 700);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(exitTimer);
        };
    }, [onDone]);

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-duck-acid transition-[transform,border-radius] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${leaving ? '-translate-y-full rounded-b-[44%]' : ''}`}
        >
            <DuckMascot className="size-20 md:size-24" />
            <p className="font-display text-7xl tabular-nums text-duck-ink md:text-8xl">{pct}%</p>
        </div>
    );
}

function HeroHeadline({ introReady }: { introReady: boolean }) {
    const rise = (index: number, child: React.ReactNode) => (
        <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.06em] align-bottom -mb-[0.14em] -mr-[0.06em]">
            <span
                className={`inline-block motion-reduce:translate-y-0 motion-reduce:animate-none ${introReady ? 'animate-duck-rise' : 'translate-y-[115%]'}`}
                style={{ animationDelay: `${0.1 + index * 0.07}s` }}
            >
                {child}
            </span>
        </span>
    );

    return (
        <h1
            aria-label="Maak digitale geletterdheid tastbaar, motiverend en aantoonbaar."
            className="mx-auto mt-7 max-w-[20ch] text-balance font-display text-[clamp(2.6rem,7vw,6.4rem)] font-normal leading-[1.04] tracking-[-0.01em]"
        >
            {rise(0, 'Maak')} {rise(1, 'digitale')} {rise(2, 'geletterdheid')} {rise(3, <em className="italic">tastbaar,</em>)}{' '}
            {rise(4, <em className="italic">motiverend</em>)} {rise(5, 'en')}{' '}
            {rise(6, (
                <span className="relative inline-block whitespace-nowrap">
                    <span aria-hidden="true" className="absolute inset-x-[-3%] inset-y-[8%] -rotate-1 rounded-[0.5em] bg-duck-acid" />
                    <span className="relative">aantoonbaar.</span>
                </span>
            ))}
        </h1>
    );
}

// Toont de ChatGPT-illustratie zodra die bestaat; valt anders terug op de inline vector-art.
function SkillVisual({ skill }: { skill: Skill }) {
    const [failed, setFailed] = useState(false);

    if (!skill.image || failed) {
        return <SkillArt variant={skill.art} tone={skill.tone} className="mx-auto my-5 h-36 sm:h-40" />;
    }

    return (
        <img
            src={skill.image}
            alt=""
            aria-hidden="true"
            width={400}
            height={400}
            className="mx-auto my-5 h-36 w-auto object-contain sm:h-40"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}

type SkillArtVariant = 'ai' | 'create' | 'code' | 'media' | 'safe';

function SkillArt({ variant, tone, className }: { variant: SkillArtVariant; tone: SkillTone; className?: string }) {
    const accent = tone === 'acid' ? '#ffffff' : '#e1ff01';
    const ink = '#202023';
    const common = { stroke: ink, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

    if (variant === 'ai') {
        return (
            <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
                <circle cx="38" cy="44" r="13" fill={accent} {...common} />
                <circle cx="168" cy="58" r="10" fill="#ffffff" {...common} />
                <circle cx="156" cy="160" r="11" fill="#ffffff" {...common} />
                <path d="M50 52 76 74M158 66l-26 22M148 152l-22-24" fill="none" {...common} />
                <rect x="62" y="66" width="84" height="76" rx="22" fill={accent} {...common} />
                <ellipse cx="90" cy="100" rx="7" ry="12" fill={ink} />
                <ellipse cx="118" cy="100" rx="7" ry="12" fill={ink} />
                <path d="M92 124c5 4 19 4 24 0" fill="none" {...common} />
                <path d="M104 66V46" fill="none" {...common} />
                <circle cx="104" cy="38" r="8" fill={ink} />
            </svg>
        );
    }
    if (variant === 'create') {
        return (
            <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
                <path d="M36 36l30 74 14-28 28-12z" fill="#ffffff" {...common} />
                <path d="M84 96c30 28 44 6 68 18" fill="none" strokeDasharray="2 16" {...common} />
                <path d="M152 86l7 18 18 7-18 7-7 18-7-18-18-7 18-7z" fill={accent} {...common} />
                <circle cx="56" cy="156" r="10" fill={accent} {...common} />
                <circle cx="88" cy="166" r="10" fill="#ffffff" {...common} />
                <circle cx="120" cy="156" r="10" fill={ink} />
            </svg>
        );
    }
    if (variant === 'code') {
        return (
            <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
                <rect x="56" y="36" width="88" height="40" rx="14" fill={accent} {...common} />
                <rect x="44" y="80" width="112" height="40" rx="14" fill="#ffffff" {...common} />
                <path d="M86 90l-12 10 12 10M114 90l12 10-12 10" fill="none" {...common} />
                <rect x="56" y="124" width="88" height="40" rx="14" fill="#ffffff" {...common} />
                <path d="M160 128l16 16m0-16l-16 16" fill="none" {...common} />
                <circle cx="168" cy="136" r="14" fill={accent} {...common} />
            </svg>
        );
    }
    if (variant === 'media') {
        return (
            <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
                <path d="M40 52h88c12 0 22 10 22 22v22c0 12-10 22-22 22H84l-24 24v-24h-20c-12 0-22-10-22-22V74c0-12 10-22 22-22z" fill={accent} {...common} transform="translate(8 0)" />
                <path d="M86 76v44l36-22z" fill={ink} />
                <path d="M134 134l34 14-6 14-34-14" fill="#ffffff" {...common} />
                <circle cx="58" cy="158" r="12" fill="#ffffff" {...common} />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
            <path d="M100 28l56 18v44c0 36-22 62-56 78-34-16-56-42-56-78V46z" fill={accent} {...common} />
            <ellipse cx="84" cy="84" rx="7" ry="12" fill={ink} />
            <ellipse cx="116" cy="84" rx="7" ry="12" fill={ink} />
            <rect x="82" y="112" width="36" height="28" rx="9" fill="#ffffff" {...common} />
            <path d="M91 112v-7a9 9 0 0 1 18 0v7" fill="none" {...common} />
        </svg>
    );
}

function IconBase({ children }: { children: React.ReactNode }) {
    return <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function ArrowRightIcon() { return <IconBase><path d="M5 12h14M13 5l7 7-7 7" /></IconBase>; }
function ArrowDownIcon() { return <IconBase><path d="M12 5v14M5 13l7 7 7-7" /></IconBase>; }
function MenuIcon() { return <IconBase><path d="M4 7h16M4 12h16M4 17h16" /></IconBase>; }
function XIcon() { return <IconBase><path d="M18 6 6 18M6 6l12 12" /></IconBase>; }
function PlusIcon() { return <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16" /></svg>; }
function SearchIcon() { return <IconBase><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>; }
function BookIcon() { return <IconBase><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z" /></IconBase>; }
function PencilIcon() { return <IconBase><path d="m18 2 4 4-13 13-5 1 1-5Z" /><path d="M15 5 19 9" /></IconBase>; }
function BadgeIcon() { return <IconBase><path d="M12 3 15 9l6 1-4.5 4.5 1 6.5L12 18l-5.5 3 1-6.5L3 10l6-1Z" /></IconBase>; }
function GrowthIcon() { return <IconBase><path d="M4 16 9 11l4 4 7-8" /><path d="M15 7h5v5" /></IconBase>; }
function BrainIcon() { return <IconBase><path d="M9 9a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3" /><path d="M15 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3" /></IconBase>; }
function CodeIcon() { return <IconBase><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></IconBase>; }
function CameraIcon() { return <IconBase><path d="M15 10 20 7v10l-5-3Z" /><rect x="3" y="6" width="12" height="12" rx="2" /></IconBase>; }
function LockIcon() { return <IconBase><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></IconBase>; }
function CheckIcon() { return <svg className="mt-1 size-4 flex-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>; }
