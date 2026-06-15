import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DuckMark } from '@/components/brand/DuckMark';
import { DuckMascot } from '@/components/brand/DuckMascot';
import { HeroEyes } from '@/components/brand/HeroEyes';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useHomepageAnalytics } from '@/hooks/useHomepageAnalytics';

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
    { label: 'Leerlingdemo', target: 'game-demo' },
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
        coachTip: 'Voor de klas die AI wil gebruiken — en ook wil snappen wat er eigenlijk gebeurt.',
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
        coachTip: 'Voor leerlingen die liever iets bouwen dan erover lezen.',
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
        coachTip: 'Voor wie wil snappen hoe apps, games en logica werken. En waarom ze soms niet doen wat je wil.',
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
        coachTip: 'Voor wie iets te zeggen heeft. En weet hoe dat overkomt.',
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
        coachTip: "Privacy, phishing, veilig gedrag. Klinkt saai — tot iemand z'n account kwijt is.",
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

const lessonSteps = [
    {
        step: '01',
        title: 'Jij kiest een missie',
        copy: 'Een paar klikken en de klas is gestart. Leerlingen zien direct wat ze gaan maken — geen tien minuten uitleg vooraf.',
    },
    {
        step: '02',
        title: 'De klas werkt',
        copy: 'Echte tools, directe feedback. Leerlingen hoeven niet te raden of ze op de goede weg zitten. Jij ook niet.',
    },
    {
        step: '03',
        title: 'Jij ziet wie vastzit',
        copy: 'Voortgang en leervragen zijn zichtbaar in je dashboard. Je helpt gericht — in plaats van 29 keer dezelfde vraag beantwoorden.',
    },
    {
        step: '04',
        title: 'Bewijs, geen rapport',
        copy: 'Elke missie sluit af met iets wat leerlingen kunnen laten zien. Niet een bladzijde aantekeningen. Iets echts.',
    },
] as const;

const leaderReasons = [
    { title: 'SLO zit erin, niet ernaast', copy: 'Kerndoelen zijn standaard onderdeel van de missies. Na de les kun je aanwijzen wat er geleerd is — niet reconstrueren.' },
    { title: 'Geen zondagsvoorbereiding', copy: 'Docenten starten met wat er al ligt. Geen werkbladen ontwerpen, geen AI-cursus volgen voor de eerste les.' },
    { title: 'Rapport na zes weken', copy: 'Deelname, voortgang en SLO-koppeling op papier. Iets om op te baseren als het breder ingevoerd moet worden.' },
    { title: 'Past bijna overal', copy: 'Mentorles, projectweek, keuzeuur of gewone les. Als het maar niet de 47e Teams-vergadering is.' },
] as const;

const sloRows = [
    { domain: 'Digitale vaardigheden', missions: 'Prompt Perfectionist, Website Bouwer', proof: 'Toolgebruik, workflow en uitleg bij keuzes' },
    { domain: 'Informatievaardigheden', missions: 'Data Journalist, Factchecker', proof: 'Bronnen beoordelen, data lezen en conclusies trekken' },
    { domain: 'Mediawijsheid', missions: 'Deepfake Detector, Scroll Stopper', proof: 'Kritisch kijken naar media, identiteit en online gedrag' },
    { domain: 'Computational thinking', missions: 'Game Programmeur, Robot Bestuurder', proof: 'Logica, testen, debuggen en iteratief verbeteren' },
] as const;

const ictTrustItems = [
    { title: 'Microsoft 365', copy: 'Inloggen via de schoolomgeving die je al hebt. ICT hoeft niets nieuws in te richten.' },
    { title: 'Verwerkersovereenkomst', copy: 'Privacyteam wil eerst de afspraken zien? Goed plan. Dat kan.' },
    { title: 'DPIA support', copy: 'DGSkills levert wat je nodig hebt voor de DPIA-check. Scholen beoordelen zelf — zo hoort het.' },
    { title: 'AI-transparantie', copy: 'Hoe de AI werkt, is uitlegbaar voor leerlingen, docenten en het schoolbeleid. Geen zwarte doos.' },
    { title: 'Support/contact', copy: 'Eén aanspreekpunt. Geen ticketnummer, geen wachtrij van drie dagen.' },
] as const;

const screenshotProofPanels = [
    {
        label: 'Leerlingmissie',
        title: 'Leerlingen die gewoon beginnen',
        copy: 'Prompt Perfectionist, Game Programmeur, AI Trainer — missies met een concreet eindproduct. Leerlingen starten zelfstandig, vanuit hun eigen niveau.',
        screen: <ScreenMissieDetail />,
    },
    {
        label: 'Docentdashboard',
        title: 'Alles op één plek',
        copy: 'Routes, periodes, leerdoelen en missiekaarten in één scherm. Jij houdt bij wie vastzit. Niet in een spreadsheet.',
        screen: <ScreenDocent />,
    },
    {
        label: 'SLO-voortgang',
        title: 'Bewijs per kerndoel',
        copy: 'Voortgang is gekoppeld aan leerdoelen. Het gesprek met de schoolleiding wordt een stuk makkelijker als je kunt aanwijzen wat waar zit.',
        screen: <ScreenVoortgang />,
    },
    {
        label: 'Portfolio-bewijs',
        title: 'Meer dan een cijfer',
        copy: 'Wat leerlingen gemaakt hebben, welke keuzes ze uitleggen, welke skills erbij horen. Een portfolio dat ze zelf willen laten zien.',
        screen: <ScreenPortfolio />,
    },
    {
        label: 'Privacy/ICT',
        title: 'Controleerbaar van tevoren',
        copy: 'Privacy, AI en beheer zijn standaard onderdeel van de pilot — niet als bijlage achteraf.',
        screen: <ScreenPrivacy />,
    },
] as const;

const pilotItems = [
    'Kickoff-call — wij bereiden ons voor, niet alleen jij',
    'Startgids voor de eerste les (voor de docent, niet de ICT-er)',
    '20+ missies die leerlingen direct kunnen starten',
    'Klas en route ingericht vóór les één',
    'Pilotrapport na 6 weken — met vervolgadvies',
    'Geen creditcard. Echt niet.',
    'Live binnen 10 werkdagen',
] as const;

const roleFaqs = [
    { role: 'Docenten', question: 'Moet ik zelf AI-lessen ontwerpen?', answer: 'Nee. Je start met kant-en-klare missies en routes. Als je later wil aanpassen, kan dat ook — maar het hoeft echt niet.' },
    { role: 'Schoolleiding', question: 'Wat levert een pilot op?', answer: 'Deelname, voortgang en SLO-koppeling op papier. Plus advies over wat nodig is als je verder wil. Niet alleen: "de leerlingen waren enthousiast".' },
    { role: 'ICT & privacy', question: 'Kunnen we privacy en AI vooraf beoordelen?', answer: 'Ja — en dat is precies de bedoeling. Verwerkersafspraken, DPIA-ondersteuning en AI-transparantie zitten standaard in de pilot. Neem de tijd die je nodig hebt.' },
    { role: 'Pilot', question: 'Hoe snel kan een school starten?', answer: 'Binnen 10 werkdagen na de eerste afstemming. Geen projectplan van tien pagina\'s, geen maanden aanlooptijd.' },
] as const;

const journeyChapters: JourneyChapter[] = [
    {
        step: '01',
        title: 'Ontdek',
        eyebrow: 'Start je route',
        copy: 'Leerlingen kiezen een leerlijn en zien direct hun missies. Geen rondleiding, geen uitlegscherm.',
        routeCoachTip: 'Route gekozen. Dat was al het lastigste.',
        screen: <ScreenMissies />,
        icon: <SearchIcon />,
        stat: '20+',
        statLabel: 'AI-missies klaar',
    },
    {
        step: '02',
        title: 'Leer',
        eyebrow: 'Korte challenges',
        copy: 'Echte tools, directe feedback. Leerlingen hoeven niet te raden of ze iets goed doen.',
        routeCoachTip: 'De klas werkt zelfstandig. Dat geeft jou een kopje koffie. Of tien minuten nakijken.',
        screen: <ScreenMissieDetail />,
        icon: <BookIcon />,
        stat: 'SLO',
        statLabel: 'gekoppeld',
    },
    {
        step: '03',
        title: 'Maak',
        eyebrow: 'Projectmodus',
        copy: 'Een platformer bouwen, een robotroute ontwerpen, AI laten raden wat je tekende. Echte projecten, geen nagebootste oefeningen.',
        routeCoachTip: 'Hier willen leerlingen mee thuiskomen.',
        screen: <ScreenBouwen />,
        icon: <PencilIcon />,
        stat: '24',
        statLabel: 'bouwprojecten',
    },
    {
        step: '04',
        title: 'Bewijs',
        eyebrow: 'Trofeeën en XP',
        copy: 'Levels, trofeeën en XP. Voortgang die leerlingen zelf willen laten zien — dat scheelt een hoop uitleg.',
        routeCoachTip: 'Bewijs dat leerlingen zelf willen delen. Rare bijkomstigheid.',
        screen: <ScreenVoortgang />,
        icon: <BadgeIcon />,
        stat: 'XP',
        statLabel: 'groeit mee',
    },
    {
        step: '05',
        title: 'Groei',
        eyebrow: 'Portfolio groei',
        copy: 'Wat gemaakt is, welke keuzes zijn gemaakt — zichtbaar in een portfolio. Niet in een excelbestand van de docent.',
        routeCoachTip: 'Groei per leerling, klas en route. Zonder achteraf te reconstrueren.',
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
    useHomepageAnalytics();

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
                <section data-home-hero data-section="hero" className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-40">
                    <div className="relative z-10 mx-auto max-w-5xl text-center">
                        <p className={`inline-flex items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 mt-6 md:mt-8 ${introReady ? 'animate-fade-in-up' : ''}`}>
                            Digitale geletterdheid voor VO &amp; VSO
                        </p>
                        <HeroHeadline introReady={introReady} />
                        <p className={`mx-auto mt-7 max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/70 sm:text-lg sm:leading-8 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up-delay-2' : ''}`}>
                            Kant-en-klare AI-missies voor VO en VSO, gekoppeld aan de SLO-kerndoelen. Leerlingen werken zelfstandig, jij volgt de voortgang. De spreadsheet mag met pensioen.
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
                                onClick={() => scrollTo('game-demo')}
                                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border border-duck-ink/20 bg-duck-bgLight px-8 py-3.5 text-base font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-duck-ink sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                            >
                                Bekijk de leerlingdemo
                                <span className="transition-transform duration-300 group-hover:translate-y-0.5"><ArrowDownIcon /></span>
                            </button>
                        </div>
                        <p className={`mx-auto mt-6 max-w-xl text-pretty text-sm font-bold leading-6 text-duck-ink/60 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 ${introReady ? 'animate-fade-in-up-delay-3' : ''}`}>
                            Voor VO en VSO: AI-missies, SLO-voortgang en portfolio-bewijs in een veilige leeromgeving.
                        </p>

                        <div className="pointer-events-none absolute inset-x-0 -top-14 hidden justify-center md:flex lg:-top-16" aria-hidden="true">
                            <HeroEyes />
                        </div>
                    </div>

                    <div className={`relative z-10 mx-auto mt-14 max-w-[1120px] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 md:mt-16 ${introReady ? 'animate-fade-in-up-delay-3' : ''}`}>
                        <div data-hero-mockup id="game-demo" className="relative grid scroll-mt-24 gap-4 lg:grid-cols-2 lg:items-start">
                            {/* Leerling-kaart */}
                            <div className="flex flex-col gap-5 overflow-hidden rounded-[1.5rem] bg-duck-ink p-6 lg:-rotate-1">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-duck-acid/60">Voor de leerling</p>
                                    <p className="mt-1 font-display text-5xl leading-none text-duck-acid">Leerling</p>
                                    <p className="mt-2 text-sm font-bold text-white/45">Bouwt. Prompts. Leert.</p>
                                </div>
                                <div className="overflow-hidden rounded-[1.1rem]">
                                    <ScreenLeerling reduceMotion={reduceMotion} />
                                </div>
                            </div>
                            {/* Docent-kaart */}
                            <div className="flex flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-duck-ink/10 bg-duck-bgLight p-6 lg:translate-y-6 lg:rotate-1">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-duck-ink/40">Voor de docent</p>
                                    <p className="mt-1 font-display text-5xl leading-none text-duck-ink">Docent</p>
                                    <p className="mt-2 text-sm font-bold text-duck-ink/45">Volgt. Ziet. Stuurt.</p>
                                </div>
                                <div className="relative overflow-hidden rounded-[1.1rem]">
                                    <ScreenDocent />
                                    <span className="absolute -right-2 -top-2 rounded-full bg-duck-ink px-3 py-1.5 text-[11px] font-extrabold text-duck-acid">
                                        24/28 actief
                                    </span>
                                </div>
                            </div>
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


                <PortfolioStorySection startPilot={startPilot} />

                <section id="docent-les" data-section="docent-les" className="relative scroll-mt-24 bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <Reveal className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div>
                                <SectionLabel>Voor docenten</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Zo werkt een DGSkills-les. Niet ingewikkeld.</h2>
                                <p className="mt-5 max-w-xl text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                    Een les AI of mediawijsheid hoeft geen college te zijn. Leerlingen beginnen direct, werken zelfstandig en eindigen met iets wat ze kunnen laten zien.
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

                <section id="voor-schoolleiding" data-section="schoolleiding" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl space-y-16">
                        <Reveal y={30} className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                            <div>
                                <SectionLabel>Voor schoolleiding</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Voor schoolleiders die meer willen dan 'de leerlingen waren enthousiast'.</h2>
                                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                                    De pilot levert deelname, voortgang en SLO-koppeling op papier. Iets om een schoolbesluit op te baseren — geen PowerPoint vol beloften.
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

                        <Reveal y={30} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                            <div className="rounded-[1.5rem] bg-white p-6 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] md:p-8">
                                <SectionLabel>SLO &amp; curriculum proof</SectionLabel>
                                <h2 className="mt-4 text-balance font-display text-3xl leading-[1.08] md:text-4xl">Van losse activiteit naar aantoonbare leerlijn</h2>
                                <div className="mt-7">
                                    {sloRows.map((row) => (
                                        <div key={row.domain} className="grid gap-2 border-t border-duck-ink/10 py-4 last:border-b md:grid-cols-[0.8fr_1fr_1fr] md:items-center md:gap-4">
                                            <p className="text-sm font-extrabold">{row.domain}</p>
                                            <p className="text-sm font-semibold leading-6 text-duck-ink/65">{row.missions}</p>
                                            <p className="text-xs font-bold leading-5 text-duck-ink/80">{row.proof}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-[1.5rem] bg-duck-ink p-6 text-white md:p-8">
                                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-acid">Voor ICT en privacy</p>
                                <h2 className="mt-4 text-balance font-display text-3xl leading-[1.08] md:text-4xl">Veilig te beoordelen door ICT</h2>
                                <p className="mt-4 text-pretty text-sm font-semibold leading-7 text-white/70">
                                    DGSkills is geen zwarte doos. De pilot geeft scholen tijd om privacy, AI en beheer concreet te toetsen.
                                </p>
                                <div className="mt-6">
                                    {ictTrustItems.map((item) => (
                                        <article key={item.title} className="border-t border-white/10 py-4 last:pb-0">
                                            <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                                            <p className="mt-1 text-sm font-semibold leading-6 text-white/65">{item.copy}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section id="productbewijs" data-section="productbewijs" className="scroll-mt-24 bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
                    <Reveal y={24} className="mx-auto max-w-6xl">
                        <p className="mb-10 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/35">Voor de hele school</p>
                        <div className="grid gap-5 lg:grid-cols-3">

                            {/* Kaart 1 — Leerlingen */}
                            <div className="relative overflow-hidden rounded-[1.6rem] bg-duck-bg">
                                <div
                                    className="absolute inset-0 bg-duck-acid"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 56%)' }}
                                    aria-hidden="true"
                                />
                                <div className="relative z-10 flex h-full flex-col p-7">
                                    <div>
                                        <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-duck-ink/50">
                                            <span>01</span>
                                            <span className="h-px w-5 bg-duck-ink/25" />
                                            <span>Voor leerlingen</span>
                                        </p>
                                        <span className="mt-4 inline-block rounded-full bg-duck-ink px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-duck-acid">Leerlingmissie</span>
                                        <h2 className="mt-3 font-display text-2xl leading-[1.1] text-duck-ink">Gewoon beginnen.</h2>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-duck-ink/60">
                                            Stappen zijn duidelijk, eindproduct concreet. Motivatie hoef je niet af te dwingen.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <div className="rounded-xl bg-duck-bgLight p-3">
                                            <BrowserFrame url="dgskills.app">
                                                <ScreenMissieDetail />
                                            </BrowserFrame>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kaart 2 — Docenten */}
                            <div className="relative overflow-hidden rounded-[1.6rem] bg-duck-bg">
                                <div
                                    className="absolute inset-0 bg-duck-ink"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 56%)' }}
                                    aria-hidden="true"
                                />
                                <div className="relative z-10 flex h-full flex-col p-7">
                                    <div>
                                        <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/50">
                                            <span>02</span>
                                            <span className="h-px w-5 bg-white/20" />
                                            <span>Voor docenten</span>
                                        </p>
                                        <span className="mt-4 inline-block rounded-full bg-duck-acid px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-duck-ink">Docentdashboard</span>
                                        <h2 className="mt-3 font-display text-2xl leading-[1.1] text-white">Grip op de klas.</h2>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-white/65">
                                            Je ziet wie vastzit en wie klaar is. Geen Excel, geen rondje langs alle tafels.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <div className="rounded-xl bg-duck-bgLight p-3">
                                            <BrowserFrame url="dgskills.app/klas">
                                                <ScreenDocent />
                                            </BrowserFrame>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kaart 3 — Schoolteams */}
                            <div className="relative overflow-hidden rounded-[1.6rem] bg-duck-bg">
                                <div
                                    className="absolute inset-0 bg-duck-acid"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 56%)' }}
                                    aria-hidden="true"
                                />
                                <div className="relative z-10 flex h-full flex-col p-7">
                                    <div>
                                        <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-duck-ink/50">
                                            <span>03</span>
                                            <span className="h-px w-5 bg-duck-ink/25" />
                                            <span>Voor schoolteams</span>
                                        </p>
                                        <span className="mt-4 inline-block rounded-full bg-duck-ink px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-duck-acid">SLO-bewijs</span>
                                        <h2 className="mt-3 font-display text-2xl leading-[1.1] text-duck-ink">Aantonen dat het werkt.</h2>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-duck-ink/60">
                                            Schoolteams zien wat er schoolbreed geleerd wordt. Klaar voor het directieoverleg.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <div className="rounded-xl bg-duck-bgLight p-3">
                                            <BrowserFrame url="dgskills.app/voortgang">
                                                <ScreenVoortgang />
                                            </BrowserFrame>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Reveal>
                </section>

                <section id="schoolpilot" data-section="schoolpilot" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
                    <div className="relative z-10 mx-auto max-w-6xl">
                        <Reveal y={30} className="grid gap-10 rounded-[2rem] bg-duck-acid px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                            <div>
                                <p className="inline-flex rounded-full border border-duck-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]">Schoolpilot</p>
                                <h2 className="mt-5 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">Wat er in de schoolpilot zit. Zonder reclametaal.</h2>
                                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-duck-ink/70">
                                    Gebouwd vanuit de VO/VSO-praktijk. Klein genoeg om dit semester te starten — concreet genoeg om een schoolbesluit op te baseren.
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
        <section id="journey" data-section="journey" className="relative scroll-mt-24 overflow-x-clip bg-duck-bgLight px-5 py-20 md:px-10 md:py-28">
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
        <section id="skills" data-section="skills" className="relative scroll-mt-24 overflow-x-clip bg-duck-bg">
            <div data-skills-stage className="py-16 md:py-24 lg:flex lg:flex-col lg:justify-center lg:py-12 lg:min-h-[100svh]">
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

                <div className="mt-10 overflow-x-auto pb-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-12 lg:overflow-visible lg:pb-20">
                    <div data-skills-track className="flex w-max snap-x snap-mandatory gap-5 px-5 md:px-10 lg:snap-none lg:will-change-transform">
                        {skills.map((skill) => (
                            <article
                                key={skill.title}
                                className={`relative flex h-[500px] w-[80vw] max-w-[400px] shrink-0 snap-center flex-col overflow-hidden rounded-[1.6rem] p-7 shadow-[2px_4px_24px_rgba(199,197,188,0.30)] sm:h-[540px] lg:h-[420px] ${skill.tone === 'acid' ? 'bg-duck-acid' : 'bg-white'}`}
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

                        <article className="relative flex h-[500px] w-[80vw] max-w-[400px] shrink-0 snap-center flex-col items-start justify-center overflow-hidden rounded-[1.6rem] bg-duck-ink p-9 text-white sm:h-[540px] lg:h-[420px]">
                            <DuckMark className="size-14 brightness-0 invert" />
                            <h3 className="mt-6 text-balance font-display text-4xl leading-[1.08]">
                                Zien hoe een leerling <em className="italic text-duck-acid">werkt</em>?
                            </h3>
                            <p className="mt-4 text-pretty text-sm font-semibold leading-6 text-white/65">
                                Bekijk het interactieve leerling-dashboard: XP, missies, voortgang en badges — zoals leerlingen het zien.
                            </p>
                            <button
                                onClick={() => scrollTo('game-demo')}
                                className="mt-8 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                Bekijk de leerlingdemo
                                <ArrowRightIcon />
                            </button>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---- ScreenLeerling: interactive student dashboard mock (replaces HeroGameDemo) ---- */

const LEERLING_WEEKS = [
    {
        label: 'Week 1',
        missions: [
            { title: 'Prompt Perfectionist', slo: 'Digitale vaardigheden', pct: 100, status: 'done' as const },
            { title: 'Factchecker', slo: 'Mediawijsheid', pct: 58, status: 'active' as const },
            { title: 'Data Journalist', slo: 'Informatievaardigheden', pct: 0, status: 'open' as const },
        ],
    },
    {
        label: 'Week 2',
        missions: [
            { title: 'Deepfake Detector', slo: 'Mediawijsheid', pct: 100, status: 'done' as const },
            { title: 'Algoritmische Assistent', slo: 'Probleemoplossend vermogen', pct: 34, status: 'active' as const },
            { title: 'Web Developer', slo: 'Ontwerpen & maken', pct: 0, status: 'open' as const },
        ],
    },
    {
        label: 'Week 3',
        missions: [
            { title: 'Privacy Detective', slo: 'Digitale veiligheid', pct: 100, status: 'done' as const },
            { title: 'Spreadsheet Specialist', slo: 'Informatievaardigheden', pct: 71, status: 'active' as const },
            { title: 'AI Bias Detective', slo: 'Probleemoplossend vermogen', pct: 0, status: 'open' as const },
        ],
    },
    {
        label: 'Week 4',
        missions: [
            { title: 'Game Programmeur', slo: 'Ontwerpen & maken', pct: 100, status: 'done' as const },
            { title: 'Dashboard Designer', slo: 'Digitale vaardigheden', pct: 22, status: 'active' as const },
            { title: 'App Prototyper', slo: 'Ontwerpen & maken', pct: 0, status: 'open' as const },
        ],
    },
] as const;

function ScreenLeerling({ reduceMotion }: { reduceMotion: boolean }) {
    const [activeWeek, setActiveWeek] = useState(0);
    const [startedMissions, setStartedMissions] = useState<Set<string>>(new Set());
    const [fillingMission, setFillingMission] = useState<string | null>(null);
    const [fillPct, setFillPct] = useState(0);
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const toggle = (key: string) => setActivePanel(p => p === key ? null : key);
    const missionXP: Record<string, number> = {
        'Prompt Perfectionist': 120, 'Factchecker': 80, 'Data Journalist': 150,
        'Deepfake Detector': 140, 'Algoritmische Assistent': 90, 'Web Developer': 200,
        'Privacy Detective': 110, 'Spreadsheet Specialist': 85, 'AI Bias Detective': 130,
        'Game Programmeur': 175, 'Dashboard Designer': 160, 'App Prototyper': 195,
    };

    const week = LEERLING_WEEKS[activeWeek];

    const handleStart = (title: string, currentPct: number) => {
        if (startedMissions.has(title) || currentPct > 0) return;
        setFillingMission(title);
        setFillPct(0);
        // Animate progress fill over ~1.2s
        const steps = reduceMotion ? 1 : 20;
        const target = 18;
        let step = 0;
        const interval = window.setInterval(() => {
            step += 1;
            setFillPct(Math.round((step / steps) * target));
            if (step >= steps) {
                window.clearInterval(interval);
                setStartedMissions((prev) => new Set([...prev, title]));
                setFillingMission(null);
                setFillPct(0);
            }
        }, reduceMotion ? 0 : 60);
    };

    const xp = 1240;
    const streak = 7;
    const level = 4;
    const badges = 3;
    const xpToNext = 400;
    const xpProgress = Math.round((xp % xpToNext) / xpToNext * 100);

    return (
        <div className="bg-duck-bgLight text-duck-ink">
            {/* App header bar */}
            <div className="flex items-center justify-between gap-2 bg-white px-4 py-3 border-b border-duck-ink/8">
                <div className="flex items-center gap-2">
                    <DuckMark className="size-5" />
                    <span className="text-xs font-extrabold">DGSkills</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-full bg-duck-ink px-2.5 py-1 text-[10px] font-extrabold text-duck-acid">
                        <FlameIcon />
                        {streak} dagen
                    </span>
                    <span className="rounded-full bg-duck-bgLight px-2.5 py-1 text-[10px] font-extrabold text-duck-ink/70">
                        {xp} XP
                    </span>
                </div>
            </div>

            {/* Stat chips row — klikbaar voor meer uitleg */}
            <div className="bg-duck-bgLight px-4 py-3">
                <div className="grid grid-cols-4 gap-2">
                    {([
                        { key: 'stat:xp' as const, label: String(xp), sub: 'XP punten', cls: 'bg-white' },
                        { key: 'stat:streak' as const, label: String(streak), sub: 'dag streak', cls: 'bg-duck-acid' },
                        { key: 'stat:level' as const, label: `Lvl ${level}`, sub: 'Creator', cls: 'bg-white' },
                        { key: 'stat:badges' as const, label: String(badges), sub: 'badges', cls: 'bg-white' },
                    ]).map((chip) => (
                        <button
                            key={chip.key}
                            type="button"
                            aria-pressed={activePanel === chip.key}
                            aria-label={`Meer info over ${chip.sub}`}
                            onClick={() => toggle(chip.key)}
                            className={`flex flex-col items-center rounded-xl ${chip.cls} px-1.5 py-2 text-center transition-shadow duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink hover:ring-1 hover:ring-duck-ink/20 ${activePanel === chip.key ? 'ring-1 ring-duck-ink/30 shadow-[0_2px_6px_rgba(32,32,35,0.12)]' : ''}`}
                        >
                            <span className="text-[10px] font-extrabold text-duck-ink">{chip.label}</span>
                            <span className="mt-0.5 text-[8px] font-bold text-duck-ink/50 leading-none">{chip.sub}</span>
                        </button>
                    ))}
                </div>
                {activePanel === 'stat:xp' && (
                    <div className="mt-2 rounded-xl bg-duck-ink px-3 py-2.5">
                        <p className="text-[9px] font-bold leading-snug text-white/85">Elke missie levert 50–250 XP op. Je bent 62% op weg naar level 5 (Specialist) — nog 160 XP te gaan!</p>
                    </div>
                )}
                {activePanel === 'stat:streak' && (
                    <div className="mt-2 rounded-xl bg-duck-ink px-3 py-2.5">
                        <p className="text-[9px] font-bold leading-snug text-white/85">7 dagen op rij actief! DGSkills telt elke dag dat je inlogt en werkt. Bij 14 dagen ontvang je een bonus-badge.</p>
                    </div>
                )}
                {activePanel === 'stat:level' && (
                    <div className="mt-2 rounded-xl bg-duck-ink px-3 py-2.5">
                        <p className="text-[9px] font-bold leading-snug text-white/85">Level 4 · Creator — je hebt 3+ missies afgerond. Volgende: Level 5 · Specialist (bij 1.400 XP).</p>
                    </div>
                )}
                {activePanel === 'stat:badges' && (
                    <div className="mt-2 rounded-xl bg-duck-ink px-3 py-2.5">
                        <div className="flex flex-col gap-1">
                            {['Prompt Expert', 'AI Analyst', 'Mediawijsheid Basis'].map((badge) => (
                                <div key={badge} className="flex items-center gap-1.5">
                                    <span className="size-2 shrink-0 rounded-full bg-duck-acid" />
                                    <span className="text-[9px] font-bold text-white/85">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* XP to next level bar */}
            <div className="px-4 pb-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-extrabold text-duck-ink/50 uppercase tracking-[0.12em]">XP naar level {level + 1}</span>
                    <span className="text-[8px] font-extrabold text-duck-ink/50">{xp % xpToNext}/{xpToNext}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-duck-ink/10">
                    <div
                        className="h-full rounded-full bg-duck-acid ring-1 ring-duck-ink/15 motion-reduce:transition-none transition-[width] duration-700"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
            </div>

            {/* Week selector tabs */}
            <div className="flex gap-1 px-4 pb-3" role="tablist" aria-label="Week selecteren">
                {LEERLING_WEEKS.map((w, index) => (
                    <button
                        key={w.label}
                        role="tab"
                        aria-selected={activeWeek === index}
                        aria-label={`Selecteer ${w.label}`}
                        onClick={() => setActiveWeek(index)}
                        className={`flex-1 rounded-full py-1.5 text-[9px] font-extrabold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-1 ${activeWeek === index ? 'bg-duck-ink text-duck-acid' : 'bg-white text-duck-ink/60 hover:text-duck-ink'}`}
                    >
                        {w.label}
                    </button>
                ))}
            </div>

            {/* Mission rows */}
            <div className="space-y-1.5 px-4 pb-4" role="tabpanel" aria-label={`Missies voor ${week.label}`}>
                {week.missions.map((mission) => {
                    const isStarted = startedMissions.has(mission.title);
                    const isFilling = fillingMission === mission.title;
                    const effectivePct = isFilling ? fillPct : (isStarted ? 18 : mission.pct);
                    const isDone = mission.status === 'done';
                    const isActive = mission.status === 'active' || isStarted || isFilling;

                    return (
                        <div
                            key={mission.title}
                            className={`rounded-xl bg-white p-2.5 transition-shadow duration-200 ${isActive && !isDone ? 'shadow-[0_2px_8px_rgba(32,32,35,0.08)]' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[9px] font-extrabold leading-tight">{mission.title}</p>
                                    <span className="mt-0.5 inline-block rounded-full bg-duck-bgLight px-1.5 py-0.5 text-[7px] font-bold text-duck-ink/60">{mission.slo}</span>
                                </div>
                                {isDone ? (
                                    <button
                                        type="button"
                                        aria-pressed={activePanel === `mission:${mission.title}`}
                                        aria-label={`Details voor ${mission.title}`}
                                        onClick={() => toggle(`mission:${mission.title}`)}
                                        className="shrink-0 rounded-full bg-duck-acid px-2 py-1 text-[8px] font-extrabold text-duck-ink transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-1"
                                    >
                                        Voltooid ✓
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        aria-label={`${isStarted || isActive ? 'Doorgaan met' : 'Start missie'} ${mission.title}`}
                                        disabled={isFilling}
                                        onClick={() => handleStart(mission.title, mission.pct)}
                                        className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-extrabold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-1 disabled:opacity-60 ${isActive ? 'bg-duck-ink text-duck-acid' : 'border border-duck-ink/20 bg-duck-bgLight text-duck-ink hover:border-duck-ink hover:bg-duck-ink/5'}`}
                                    >
                                        {isFilling ? '…' : isActive ? 'Doorgaan' : 'Start missie'}
                                    </button>
                                )}
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-duck-ink/8">
                                <div
                                    className={`h-full rounded-full ring-1 ring-duck-ink/10 motion-reduce:transition-none transition-[width] duration-500 ${isDone ? 'bg-duck-acid' : 'bg-duck-acid/70'}`}
                                    style={{ width: `${effectivePct}%` }}
                                />
                            </div>
                            {isDone && activePanel === `mission:${mission.title}` && (
                                <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-duck-bgLight px-2 py-1.5">
                                    <span className="text-[8px] font-extrabold text-duck-ink">＋{missionXP[mission.title] ?? 100} XP</span>
                                    <span className="h-2.5 w-px bg-duck-ink/15" />
                                    <span className="text-[8px] font-bold text-duck-ink/60">{mission.slo} · afgerond</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
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
            copy: 'Geen anoniem schoolaccount. Een profiel dat zegt wie je bent: maker, onderzoeker, ontwerper of programmeur.',
            screen: <ScreenAvatar />,
            url: 'dgskills.app/avatar',
            statLabel: 'Mila — eigen identiteit',
            stat: 'Level 1 · Architect',
        },
        {
            kicker: 'Trofeeën',
            title: 'Trofeeën maken groei zichtbaar.',
            copy: 'Leerlingen zien wat ze al kunnen en wat daarna logisch is. Geen verrassing bij de eindbespreking.',
            screen: <ScreenVoortgang />,
            url: 'dgskills.app/voortgang',
            statLabel: 'Streak — week 12',
            stat: '12 dagen · 4 badges',
        },
        {
            kicker: 'Portfolio',
            title: 'Projecten worden bewijsstukken.',
            copy: 'Projecten als bewijsstukken: wat gemaakt is, welke keuzes zijn gemaakt, welke skills daarbij horen.',
            screen: <ScreenPortfolio />,
            url: 'dgskills.app/portfolio',
            statLabel: 'Mila — Level 6 Creator',
            stat: '1.840 XP · 4 projecten',
        },
        {
            kicker: 'Docent',
            title: 'De docent ziet waar groei zit.',
            copy: 'Per leerling: sterk in, aandachtspunten, SLO-kerndoelen. Zonder spreadsheet erbij.',
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
            data-section="portfolio"
            ref={sectionRef}
            className={`relative scroll-mt-24 overflow-x-clip bg-duck-bgLight px-5 py-20 md:px-10 ${reduceMotion ? '' : 'lg:min-h-[420svh] lg:py-0'}`}
        >
            <div className={`mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.72fr_1.28fr] ${reduceMotion ? 'lg:items-start' : 'lg:sticky lg:top-20 lg:h-[calc(100svh-80px)] lg:items-center'}`}>
                <Reveal className="lg:h-fit lg:self-center">
                    <SectionLabel>Portfolio</SectionLabel>
                    <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">
                        Jouw portfolio. <em className="italic">Jouw verhaal.</em>
                    </h2>
                    <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-duck-ink/65">
                        Wie je bent, wat je maakt, welke trofeeën je hebt gehaald. En waar je nog in groeit — dat ook.
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
        <section id="faq" data-section="faq" className="relative scroll-mt-24 bg-duck-bg px-5 py-20 md:px-10 md:py-28">
            <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <Reveal y={30} className="lg:sticky lg:top-32 lg:self-start">
                    <SectionLabel>FAQ per rol</SectionLabel>
                    <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.05]">De vragen die in elk schoolteam op tafel komen. En dan beantwoord.</h2>
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
                    <span className="relative grid size-[5.6rem] place-items-center rounded-full bg-duck-acid p-1.5 shadow-[0_0_0_8px_rgba(225,255,1,0.08),0_18px_50px_rgba(0,0,0,0.35)] md:size-24">
                        <span className="absolute inset-0 rounded-full border border-duck-acid/70" />
                        <DuckMark className="relative size-full rounded-full bg-duck-ink object-cover drop-shadow-[0_0_14px_rgba(225,255,1,0.35)]" />
                    </span>
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
                    Plan een pilot. De eend heeft zijn agenda al vrijgehouden.
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
                        <DuckMark className="size-9 brightness-0 invert" />
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
        { title: 'Prompt Perfectionist', domain: 'Digitale vaardigheden', pct: 72, tone: 'acid', tip: 'Kees: start klein. Eén goede prompt is al werk genoeg.' },
        { title: 'Deepfake Detector', domain: 'Mediawijsheid', pct: 38, tone: 'paper', tip: 'Kees: eerst kijken, dan geloven. Scheelt gedoe.' },
        { title: 'Game Programmeur', domain: 'Computational thinking', pct: 12, tone: 'ink', tip: 'Kees: test vroeg. Bugs wachten niet beleefd.' },
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
                    {missions.map((mission, index) => (
                        <div key={mission.title} className={`rounded-xl p-2.5 ${mission.tone === 'acid' ? 'bg-duck-acid' : mission.tone === 'ink' ? 'bg-duck-ink text-white' : 'bg-white'}`}>
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-[10px] font-extrabold">{mission.title}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`hidden whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-extrabold sm:inline ${mission.tone === 'ink' ? 'bg-white/10 text-duck-acid' : 'bg-duck-ink text-duck-acid'}`}>{mission.domain}</span>
                                    <span className="relative">
                                        <button
                                            type="button"
                                            aria-label={`Tip van Kees over ${mission.title}`}
                                            aria-describedby={`screen-mission-tip-${index}`}
                                            className={`peer grid size-4 place-items-center rounded-full border text-[8px] font-black transition-colors focus-visible:outline-none focus-visible:ring-2 ${mission.tone === 'ink' ? 'border-white/20 bg-white/10 text-duck-acid focus-visible:ring-duck-acid/50' : 'border-duck-ink/15 bg-white/70 text-duck-ink/70 focus-visible:ring-duck-ink/25'}`}
                                        >
                                            i
                                        </button>
                                        <span
                                            id={`screen-mission-tip-${index}`}
                                            role="tooltip"
                                            className="pointer-events-none absolute right-0 top-5 z-20 w-36 rounded-lg bg-duck-ink px-2 py-1.5 text-left text-[8px] font-bold leading-3 text-white opacity-0 shadow-[2px_4px_14px_rgba(32,32,35,0.22)] transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
                                        >
                                            {mission.tip}
                                        </span>
                                    </span>
                                </div>
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
    const [view, setView] = useState<string>('overview');

    const rows = [
        { name: 'Mila V.', initials: 'MV', pct: 82, status: 'ok' as const },
        { name: 'Noah K.', initials: 'NK', pct: 64, status: 'ok' as const },
        { name: 'Sara B.', initials: 'SB', pct: 47, status: 'help' as const },
        { name: 'Liam J.', initials: 'LJ', pct: 29, status: 'inactive' as const },
    ] as const;

    const sloDomains = [
        { label: 'Inform.vaardigh.', fullLabel: 'Informatievaardigheden', pct: 68, codes: ['21A', '21B', '21C'] },
        { label: 'Digitale veiligheid', fullLabel: 'Digitale veiligheid', pct: 51, codes: ['23A', '23B'] },
        { label: 'Creatie & maken', fullLabel: 'Creatie & maken', pct: 84, codes: ['22.1A', '22.1B'] },
    ] as const;

    const studentInfo: Record<string, { missions: { title: string; status: 'done' | 'active' | 'open'; pct: number }[]; note: string }> = {
        MV: {
            missions: [
                { title: 'Prompt Perfectionist', status: 'done', pct: 100 },
                { title: 'Factchecker', status: 'done', pct: 100 },
                { title: 'Data Journalist', status: 'done', pct: 100 },
                { title: 'Deepfake Detector', status: 'done', pct: 100 },
            ],
            note: 'Periode 1 volledig afgerond',
        },
        NK: {
            missions: [
                { title: 'Prompt Perfectionist', status: 'done', pct: 100 },
                { title: 'Factchecker', status: 'done', pct: 100 },
                { title: 'Data Journalist', status: 'done', pct: 100 },
                { title: 'Deepfake Detector', status: 'active', pct: 64 },
            ],
            note: 'Bezig met Deepfake Detector',
        },
        SB: {
            missions: [
                { title: 'Prompt Perfectionist', status: 'done', pct: 100 },
                { title: 'Factchecker', status: 'active', pct: 47 },
                { title: 'Data Journalist', status: 'open', pct: 0 },
                { title: 'Deepfake Detector', status: 'open', pct: 0 },
            ],
            note: '2 hulpvragen open · aandacht nodig',
        },
        LJ: {
            missions: [
                { title: 'Prompt Perfectionist', status: 'active', pct: 29 },
                { title: 'Factchecker', status: 'open', pct: 0 },
                { title: 'Data Journalist', status: 'open', pct: 0 },
                { title: 'Deepfake Detector', status: 'open', pct: 0 },
            ],
            note: 'Inactief — 5 dagen geleden actief',
        },
    };

    const BackButton = () => (
        <button
            type="button"
            onClick={() => setView('overview')}
            className="flex items-center gap-1 text-[8px] font-extrabold text-duck-ink/55 transition-colors hover:text-duck-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-duck-ink"
            aria-label="Terug naar overzicht"
        >
            <svg viewBox="0 0 20 20" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4 6 10l6 6" />
            </svg>
            Terug
        </button>
    );

    // Hulpvragen detail view
    if (view === 'help') {
        return (
            <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
                <div className="mb-[3%] flex items-center justify-between gap-2">
                    <BackButton />
                    <span className="rounded-full bg-duck-acid px-2.5 py-1 text-[8px] font-extrabold">2 hulpvragen</span>
                </div>
                <div className="space-y-2">
                    {[
                        { initials: 'SB', name: 'Sara B.', question: 'Hoe zorg ik dat mijn prompt elke keer een ander antwoord geeft?' },
                        { initials: 'LJ', name: 'Liam J.', question: 'Mijn code werkt niet — wat is precies een variabele?' },
                    ].map((q) => (
                        <div key={q.name} className="rounded-xl bg-white p-2.5">
                            <div className="mb-1 flex items-center gap-1.5">
                                <span className="flex size-4 items-center justify-center rounded-full bg-duck-acid text-[7px] font-extrabold ring-1 ring-duck-ink">{q.initials}</span>
                                <span className="text-[9px] font-extrabold">{q.name}</span>
                            </div>
                            <p className="text-[8px] font-bold italic leading-snug text-duck-ink/65">"{q.question}"</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Leerling detail view
    const studentInitials = view.startsWith('student:') ? view.replace('student:', '') : '';
    if (view.startsWith('student:') && studentInfo[studentInitials]) {
        const info = studentInfo[studentInitials];
        const row = rows.find((r) => r.initials === studentInitials);
        return (
            <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
                <div className="mb-[2%] flex items-center justify-between gap-2">
                    <BackButton />
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold ${row?.status === 'help' ? 'bg-duck-acid text-duck-ink' : 'bg-duck-ink/10 text-duck-ink/60'}`}>
                        {row?.pct}%
                    </span>
                </div>
                <p className="mb-[2%] font-display text-[12px]">{row?.name ?? studentInitials}</p>
                <div className="overflow-hidden rounded-xl bg-white">
                    {info.missions.map((m, i) => (
                        <div key={m.title} className={`flex items-center gap-2 px-2.5 py-1 ${i > 0 ? 'border-t border-duck-ink/5' : ''}`}>
                            <span className={`w-2 shrink-0 text-[7px] font-extrabold ${m.status === 'done' ? 'text-duck-ink' : m.status === 'active' ? 'text-duck-ink/55' : 'text-duck-ink/20'}`}>
                                {m.status === 'done' ? '✓' : m.status === 'active' ? '→' : '○'}
                            </span>
                            <span className="flex-1 truncate text-[8px] font-bold text-duck-ink/80">{m.title}</span>
                            <span className="text-[7px] font-extrabold text-duck-ink/40">{m.status === 'done' ? '100%' : m.pct > 0 ? `${m.pct}%` : ''}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-[2%] text-[8px] font-bold text-duck-ink/50">{info.note}</p>
            </div>
        );
    }

    // SLO detail view
    if (view === 'slo') {
        return (
            <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
                <div className="mb-[3%] flex items-center justify-between gap-2">
                    <BackButton />
                    <span className="rounded-full bg-duck-ink px-2.5 py-1 text-[8px] font-extrabold text-duck-acid">9 kerndoelen</span>
                </div>
                <div className="space-y-2">
                    {sloDomains.map((domain) => (
                        <div key={domain.label} className="rounded-xl bg-white p-2">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[8px] font-extrabold">{domain.fullLabel}</span>
                                <span className="text-[7px] font-extrabold text-duck-ink/45">{domain.pct}%</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {domain.codes.map((code) => (
                                    <span key={code} className="rounded-full bg-duck-acid px-1.5 py-0.5 text-[7px] font-extrabold text-duck-ink">{code}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Overzicht (default)
    return (
        <div className="aspect-[16/10] bg-duck-bgLight p-[4%] text-duck-ink">
            <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[14px] leading-tight">Klas 3D · Periode 1</p>
                <button
                    type="button"
                    aria-label="Bekijk hulpvragen"
                    onClick={() => setView('help')}
                    className="rounded-full bg-duck-acid px-2.5 py-1 text-[8px] font-extrabold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                >
                    2 hulpvragen
                </button>
            </div>

            {/* Roster — klikbaar per leerling */}
            <div className="mt-[3%] overflow-hidden rounded-xl bg-white">
                {rows.map((row, index) => (
                    <button
                        key={row.name}
                        type="button"
                        aria-label={`Bekijk details van ${row.name}`}
                        onClick={() => setView(`student:${row.initials}`)}
                        className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors hover:bg-duck-bgLight/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-duck-ink ${index > 0 ? 'border-t border-duck-ink/5' : ''}`}
                    >
                        <span
                            className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[7px] font-extrabold leading-none ${row.status === 'help' ? 'bg-duck-acid text-duck-ink ring-1 ring-duck-ink' : row.status === 'inactive' ? 'bg-duck-ink/15 text-duck-ink/60' : 'bg-duck-bgLight text-duck-ink/70'}`}
                            aria-hidden="true"
                        >
                            {row.initials}
                        </span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-duck-ink/10">
                            <span className="block h-full rounded-full bg-duck-acid ring-1 ring-duck-ink/15" style={{ width: `${row.pct}%` }} />
                        </span>
                        <span className="text-[8px] font-extrabold text-duck-ink/45">{row.pct}%</span>
                        {row.status === 'help' && (
                            <span className="shrink-0 rounded-full bg-duck-acid px-1.5 py-0.5 text-[7px] font-extrabold text-duck-ink">Hulp</span>
                        )}
                    </button>
                ))}
            </div>

            {/* SLO dekking strip — klikbaar voor kerndoelen */}
            <button
                type="button"
                aria-label="Bekijk SLO-kerndoelen"
                onClick={() => setView('slo')}
                className="mt-[3%] w-full rounded-xl bg-white p-2 text-left transition-colors hover:bg-duck-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
            >
                <p className="mb-1.5 text-[7px] font-extrabold uppercase tracking-[0.12em] text-duck-ink/40">SLO dekking</p>
                <div className="space-y-1.5">
                    {sloDomains.map((domain) => (
                        <div key={domain.label} className="flex items-center gap-2">
                            <span className="w-[42%] shrink-0 truncate text-[7px] font-bold text-duck-ink/70">{domain.label}</span>
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-duck-ink/8">
                                <span className="block h-full rounded-full bg-duck-ink/60" style={{ width: `${domain.pct}%` }} />
                            </span>
                            <span className="text-[7px] font-extrabold text-duck-ink/45">{domain.pct}%</span>
                        </div>
                    ))}
                </div>
            </button>

            <button
                type="button"
                aria-label="Bekijk alle SLO-kerndoelen"
                onClick={() => setView('slo')}
                className="mt-[3%] w-fit rounded-full bg-duck-ink px-2.5 py-1 text-[8px] font-extrabold text-duck-acid transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-1"
            >
                9 SLO-kerndoelen zichtbaar
            </button>
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
            aria-label="Weer een tool voor de klas. Deze keer werkt 'ie."
            className="mx-auto mt-7 max-w-[20ch] text-balance font-display text-[clamp(2.6rem,7vw,6.4rem)] font-normal leading-[1.04] tracking-[-0.01em]"
        >
            {rise(0, 'Weer')} {rise(1, 'een')} {rise(2, 'tool')} {rise(3, 'voor')} {rise(4, 'de')} {rise(5, 'klas.')}{' '}
            {rise(6, 'Deze')} {rise(7, 'keer')} {rise(8, 'werkt')}{' '}
            {rise(9, (
                <span className="relative inline-block whitespace-nowrap">
                    <span aria-hidden="true" className="absolute inset-x-[-3%] inset-y-[8%] -rotate-1 rounded-[0.5em] bg-duck-acid" />
                    <span className="relative">'ie.</span>
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
function FlameIcon() { return <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C9 7 6 9.5 6 13a6 6 0 0 0 12 0c0-3.5-3-6-6-11Zm0 16a4 4 0 0 1-4-4c0-2 1.5-3.5 3-5 1.5 1.5 3 3 3 5a4 4 0 0 1-2 3.46V18Z" /></svg>; }
