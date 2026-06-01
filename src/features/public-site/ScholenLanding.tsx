import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    DEFAULT_GAME_CONFIG,
    applyDelta,
    tweakGameDemo,
    type GameConfig,
} from '@/services/gameDemoService';

type NavItem = { label: string; target: string };
type Skill = {
    title: string;
    icon: React.ReactNode;
    color: string;
    bullets: string[];
    projects: string;
    coachTip: string;
    bestFor: string;
    image: string;
    alt: string;
};
type CinematicChapter = {
    step: string;
    title: string;
    eyebrow: string;
    copy: string;
    routeCoachTip: string;
    image: string;
    alt: string;
    accent: string;
    icon: React.ReactNode;
    stat: string;
    statLabel: string;
};

const C = {
    cream: '#FCF6EA',
    creamDeep: '#F3E4CB',
    paper: '#FFFDF7',
    ink: '#08283B',
    muted: '#445865',
    olive: '#99984D',
    gold: '#D7C95F',
    sage: '#5F947D',
    sageSoft: '#DCE9DD',
    coral: '#D97848',
    peach: '#D97848',
    teal: '#0B453F',
    line: '#E7D8BD',
} as const;

const NAV_ITEMS: NavItem[] = [
    { label: 'Hoe het werkt', target: 'journey' },
    { label: 'Skills', target: 'skills' },
    { label: 'Game demo', target: 'projecten' },
    { label: 'Portfolio', target: 'portfolio' },
];

const skills: Skill[] = [
    {
        title: 'AI & Data',
        icon: <BrainIcon />,
        color: '#7EAD94',
        bullets: ['AI-tools gebruiken', 'Data analyseren', 'Slimme apps bouwen'],
        projects: '12 projecten',
        coachTip: 'Start hier als je klas AI wil gebruiken en kritisch wil leren kijken.',
        bestFor: 'brugklas, onderzoeksopdrachten en AI-basis',
        image: '/assets/skill-cards/skill-ai-data-dgskills.webp',
        alt: 'DGSkills AI Trainer scherm waarin leerlingen een AI leren plastic en papier te herkennen',
    },
    {
        title: 'Design & Create',
        icon: <PencilIcon />,
        color: '#E49A73',
        bullets: ['Grafisch ontwerp', 'UI/UX design', 'Animatie & video'],
        projects: '18 projecten',
        coachTip: 'Goed voor makers: ontwerpen, testen en verbeteren met zichtbaar resultaat.',
        bestFor: 'projectweek, kunstvakken en creatieve keuzeuren',
        image: '/assets/skill-cards/skill-design-create-dgskills.webp',
        alt: 'DGSkills Brand Builder opdracht waarin leerlingen een merk en doelgroep bepalen',
    },
    {
        title: 'Code & Bouw',
        icon: <CodeIcon />,
        color: '#5F947D',
        bullets: ['Web development', 'App development', 'Games maken'],
        projects: '24 projecten',
        coachTip: 'Perfect voor leerlingen die willen snappen hoe apps, games en logica werken.',
        bestFor: 'programmeren, technologie en plusopdrachten',
        image: '/assets/skill-cards/skill-code-bouw-dgskills.webp',
        alt: 'DGSkills missiekaart voor Game Programmeur waarin leerlingen games met code repareren',
    },
    {
        title: 'Media & Verhaal',
        icon: <CameraIcon />,
        color: '#D97848',
        bullets: ['Video editen', 'Podcast maken', 'Storytelling'],
        projects: '16 projecten',
        coachTip: 'Sterk voor creatievelingen: video, verhaal, presentatie en digitale identiteit.',
        bestFor: 'Nederlands, mediawijsheid en presentaties',
        image: '/assets/skill-cards/skill-media-verhaal-dgskills.webp',
        alt: 'DGSkills Digital Storyteller opdracht waarin leerlingen verhaallidee en setting bepalen',
    },
    {
        title: 'Online veiligheid',
        icon: <LockIcon />,
        color: '#DBC95D',
        bullets: ['Privacy & security', 'Cyber awareness', 'Verantwoord online'],
        projects: '8 projecten',
        coachTip: 'Ideaal als startpunt voor mentoraat, privacy, phishing en veilig gedrag.',
        bestFor: 'mentorles, burgerschap en schoolbrede veiligheid',
        image: '/assets/skill-cards/skill-online-veiligheid-dgskills.webp',
        alt: 'DGSkills Security en Privacy pagina met AVG, EU data residency en inkoopdossier kaarten',
    },
];

const HOMEPAGE_SEO = {
    title: 'Digitale Geletterdheid voor VO en VSO — Lesmethode | DGSkills',
    description: 'DGSkills: lesmethode digitale geletterdheid voor VO en VSO (mavo, havo, vwo). AI-missies, SLO-rapportage en docentdashboard. Plan een schoolpilot, binnen 10 werkdagen live.',
    image: 'https://dgskills.app/og-image.png',
};

const heroProofItems = [
    { label: 'SLO-ready', value: 'Kerndoelen zichtbaar per missie' },
    { label: 'Docentproof', value: 'Dashboard voor voortgang en signalen' },
    { label: 'Samen ingericht', value: 'Schoolpilot op maat met je team' },
    { label: 'Veilig', value: 'AVG-compliant en AI Act-roadmap 2026' },
] as const;

const trustChips = [
    '20+ AI-missies',
    'SLO-mapping',
    'AVG-compliant',
    'AI Act-roadmap 2026',
    'Microsoft 365',
    'Pilot binnen 10 werkdagen',
    'Geen creditcard',
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
        image: '/screenshots/new-mission-cards.png',
        alt: 'DGSkills missiekaarten met Prompt Perfectionist, Game Programmeur en AI Trainer',
    },
    {
        label: 'Docentdashboard',
        title: 'Voortgang in een oogopslag',
        copy: 'Docenten zien routes, periodes, leerdoelen en missiekaarten zonder eigen spreadsheets bij te houden.',
        image: '/screenshots/new-dashboard-missions.png',
        alt: 'DGSkills docentdashboard met leerlijn, periodes en missiekaarten',
    },
    {
        label: 'SLO-voortgang',
        title: 'Bewijs per leerdoel',
        copy: 'Voortgang en XP worden gekoppeld aan zichtbare groei, zodat de opbrengst bespreekbaar wordt.',
        image: '/screenshots/student-progress-xp-1200.webp',
        alt: 'DGSkills voortgangsscherm met XP, levels en bewijs van groei',
    },
    {
        label: 'Portfolio-bewijs',
        title: 'Een verhaal achter de score',
        copy: 'Leerlingen bouwen een portfolio dat laat zien wat ze maken, uitleggen en verbeteren.',
        image: '/screenshots/student-dashboard.webp',
        alt: 'DGSkills leerlingdashboard als portfolio-overzicht',
    },
    {
        label: 'Privacy/ICT',
        title: 'Beoordeelbaar voor schoolteams',
        copy: 'Privacy, AI-transparantie en implementatievragen krijgen een eigen plek in de pilot.',
        image: '/screenshots/ict-privacy.webp',
        alt: 'DGSkills privacy- en ICT-informatiepagina',
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

const cinematicChapters: CinematicChapter[] = [
    {
        step: '01',
        title: 'Ontdek',
        eyebrow: 'Start je route',
        copy: 'Leerlingen kiezen een leerlijn, zien direct de AI-missies en starten vanuit hun eigen niveau.',
        routeCoachTip: 'Kies een leerlijn en zie meteen waar je klas start.',
        image: '/screenshots/new-dashboard-missions.png',
        alt: 'DGSkills dashboard met leerlijn, periodes, leerdoelen en missiekaarten',
        accent: '#D7C95F',
        icon: <SearchIcon />,
        stat: '20+',
        statLabel: 'AI-missies klaar',
    },
    {
        step: '02',
        title: 'Leer',
        eyebrow: 'Korte challenges',
        copy: 'Elke opdracht gebruikt echte DGSkills-schermen, zodat leerlingen leren door te doen in plaats van alleen te lezen.',
        routeCoachTip: 'Elke missie geeft directe feedback, dus leerlingen blijven bezig.',
        image: '/screenshots/prompt-master.webp',
        alt: 'DGSkills Prompt Perfectionist opdracht met invoerveld voor een AI-prompt',
        accent: '#5F947D',
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
        image: '/screenshots/mission-game-programmeur.webp',
        alt: 'DGSkills game studio met platformgame, robotroute, AI tekengame en prompt challenge voorbeelden',
        accent: '#D97848',
        icon: <PencilIcon />,
        stat: '24',
        statLabel: 'bouwprojecten',
    },
    {
        step: '04',
        title: 'Bewijs',
        eyebrow: 'Trofeeën en XP',
        copy: 'Voortgang wordt zichtbaar met levels, trofeeën en XP, zonder dat het voelt als een saai leerlingvolgsysteem.',
        routeCoachTip: 'Alles eindigt in zichtbaar portfolio- of voortgangsbewijs.',
        image: '/screenshots/student-progress-xp.webp',
        alt: 'DGSkills voortgangsscherm met XP, level en trofeeën',
        accent: '#5F947D',
        icon: <BadgeIcon />,
        stat: 'XP',
        statLabel: 'groeit mee',
    },
    {
        step: '05',
        title: 'Groei',
        eyebrow: 'Portfolio groei',
        copy: 'Leerlingen krijgen feedback, bouwen bewijs op en zien hun groei terug in een portfolio dat met ze meegroeit.',
        routeCoachTip: 'Maak groei zichtbaar per leerling, klas en route.',
        image: '/screenshots/student-dashboard.webp',
        alt: 'DGSkills student dashboard als portfolio-overzicht',
        accent: '#08283B',
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
    const [activeSkillIndex, setActiveSkillIndex] = useState(0);
    const [showFloatingCta, setShowFloatingCta] = useState(false);
    const reduceMotion = usePrefersReducedMotion();
    const activeSkill = skills[activeSkillIndex];

    useHomepageGsapEffects(reduceMotion);

    useEffect(() => {
        const onScroll = () => {
            const scrolled = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            // Toon na ~50% scroll, verberg vlak bij de footer (laatste ~12%) waar al een CTA staat.
            setShowFloatingCta(docHeight > 0 && scrolled > docHeight * 0.5 && scrolled < docHeight * 0.88);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
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
        <div className="min-h-screen overflow-x-clip antialiased" style={{ background: C.cream, color: C.ink, fontFamily: "'Outfit', system-ui, sans-serif" }}>
            <nav className="sticky top-0 z-50 border-b border-lab-line/50 bg-lab-cream/92 backdrop-blur-md" aria-label="Hoofdnavigatie">
                <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 md:px-10">
                    <a href="/" className="flex min-h-[44px] items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink" aria-label="DGSkills homepage">
                        <img src="/logo-lockup.svg" alt="" className="h-11 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[220px]" width={320} height={96} />
                    </a>

                    <div className="hidden items-center gap-9 lg:flex">
                        {NAV_ITEMS.map((item) => (
                            <button key={item.target} onClick={() => scrollTo(item.target)} className="min-h-[44px] rounded-full px-2 text-sm font-bold text-lab-ink transition-colors hover:text-lab-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        <a href="/login" className="inline-flex min-h-[44px] items-center rounded-full px-4 py-3 text-sm font-bold text-lab-ink transition-colors hover:text-lab-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                            Inloggen
                        </a>
                        <a href="/pilot" onClick={startPilot} className="group inline-flex min-h-[44px] items-center gap-3 rounded-full bg-lab-gold px-5 py-2 text-sm font-black text-lab-ink shadow-md shadow-lab-ink/10 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                            Plan schoolpilot
                            <span className="grid size-8 place-items-center rounded-full bg-lab-oliveDeep text-white transition-transform group-hover:translate-x-0.5">
                                <ArrowRightIcon />
                            </span>
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="grid size-11 place-items-center rounded-full border border-lab-line bg-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink"
                        aria-label={mobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-lab-line bg-lab-cream px-5 py-4 lg:hidden">
                        <div className="space-y-1">
                            {NAV_ITEMS.map((item) => (
                                <button key={item.target} onClick={() => scrollTo(item.target)} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-bold text-lab-ink hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <a href="/login" className="grid min-h-[44px] place-items-center rounded-full border border-lab-line bg-white text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                Inloggen
                            </a>
                            <a href="/pilot" onClick={startPilot} className="grid min-h-[44px] place-items-center rounded-full bg-lab-gold text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                Plan pilot
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                <section data-home-hero className="relative overflow-hidden px-5 pb-16 pt-14 md:px-10 md:pb-20 md:pt-20">
                    <div className="relative z-10 mx-auto grid min-w-0 max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:gap-6 xl:grid-cols-[minmax(0,58fr)_minmax(0,42fr)]">
                        <Reveal className="relative z-10 min-w-0" style={{ maxWidth: 'calc(100vw - 40px)' }}>
                            <h1
                                aria-label="Eindelijk digitale geletterdheid die leerlingen leuk vinden én die je kunt verantwoorden."
                                className="w-full max-w-[22rem] text-balance text-[1.85rem] font-black leading-[1.08] text-lab-ink sm:max-w-[780px] sm:text-5xl lg:text-[3.6rem]"
                            >
                                <span className="relative inline-block"><TitleSpark />E</span>indelijk digitale geletterdheid die leerlingen leuk vinden én die je kunt <span className="relative inline-block text-lab-oliveDeep">verantwoorden<Underline /></span>.
                            </h1>
                            <p className="mt-7 w-full max-w-[22rem] break-words text-pretty text-base font-semibold leading-7 text-lab-mutedDeep sm:mt-8 sm:max-w-md sm:text-lg sm:leading-8 md:max-w-[640px]">
                                AI-missies voor VO en VSO, gekoppeld aan de SLO-kerndoelen. Leerlingen leren door te doen, jij houdt overzicht zonder extra nakijkwerk.
                            </p>
                            <p className="mt-4 w-full max-w-[22rem] text-pretty text-sm font-black leading-6 text-lab-tealDark sm:max-w-[620px] sm:text-base">
                                Van AI-geletterdheid tot online veiligheid — met SLO-voortgang en portfolio-bewijs in één veilige leeromgeving.
                            </p>
                            <div className="mt-8 flex w-full max-w-[340px] flex-col gap-3 sm:max-w-full sm:flex-row">
                                <a href="/pilot" onClick={startPilot} className="group inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-lab-gold px-6 py-3 text-sm font-black text-lab-ink shadow-lg shadow-lab-ink/10 transition-transform hover:-translate-y-0.5 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                    Plan schoolpilot
                                    <ArrowRightIcon />
                                </a>
                                <button onClick={() => scrollTo('projecten')} className="group inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full border border-lab-mutedSoft bg-white/70 px-6 py-3 text-sm font-black text-lab-ink transition-transform hover:-translate-y-0.5 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                    Bekijk leerlingdemo
                                    <ArrowRightIcon />
                                </button>
                            </div>
                            <p className="mt-4 text-sm font-semibold text-lab-mutedDeep">
                                Wil je het eerst intern delen?{' '}
                                <a href="/slo-kerndoelen-digitale-geletterdheid" className="font-black text-lab-tealDark underline decoration-lab-gold decoration-2 underline-offset-4 hover:text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                    Bekijk de SLO-mapping per missie
                                </a>{' '}
                                — handig om door te sturen naar je team of schoolleiding.
                            </p>
                            <div className="mt-8 flex max-w-[620px] flex-wrap items-center gap-2 text-xs font-black text-lab-tealDark sm:max-w-none">
                                {trustChips.map((label) => (
                                    <span key={label} className="rounded-full border border-[#D7C95F] bg-white/72 px-3 py-2 shadow-sm shadow-lab-ink/5">
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-sm font-bold text-lab-coralDeep">
                                Digitale geletterdheid wordt per 2027 een verplicht SLO-kerndoel — plan tijdig een pilot, dan staat je leerlijn klaar vóór het nieuwe schooljaar.
                            </p>
                            <dl className="mt-7 grid max-w-[760px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {heroProofItems.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-lab-line bg-lab-paper/82 px-4 py-3 shadow-sm shadow-lab-ink/5">
                                        <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-lab-sageDeep">{item.label}</dt>
                                        <dd className="mt-1 text-sm font-bold leading-snug text-lab-ink">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>

                        <Reveal delay={0.12} y={34} className="relative flex min-h-[340px] min-w-0 items-center sm:min-h-[460px] lg:min-h-[600px] lg:justify-end" style={{ maxWidth: 'calc(100vw - 40px)' }}>
                            <div className="absolute -left-8 bottom-8 right-0 top-20 rounded-[42%_58%_45%_55%/50%_42%_58%_50%] bg-lab-creamWarm/70" aria-hidden="true" />
                            <ProductHeroMockup />
                            <Doodle className="-bottom-4 left-12 text-lab-oliveDeep" variant="dot" />
                        </Reveal>
                    </div>
                    <HeroJourneyBridge />
                </section>

                <section aria-label="Voor scholen in het kort" className="relative scroll-mt-24 border-y border-lab-line bg-lab-paper px-5 py-12 md:px-10 md:py-14">
                    <div className="mx-auto max-w-5xl">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-coralDeep">Voor scholen in het kort</p>
                        <h2 className="mt-2 max-w-2xl text-balance text-2xl font-black leading-tight text-lab-ink md:text-3xl">
                            Motiverend voor leerlingen, aantoonbaar voor je school.
                        </h2>
                        <div className="mt-7 grid gap-4 md:grid-cols-3">
                            <a href="#voor-schoolleiding" onClick={(e) => { e.preventDefault(); scrollTo('voor-schoolleiding'); }} className="group rounded-2xl border border-lab-line bg-lab-cream p-5 text-left shadow-sm shadow-lab-ink/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                <p className="text-sm font-black uppercase tracking-wide text-lab-sageDeep">Aantoonbaar</p>
                                <p className="mt-2 text-base font-bold leading-snug text-lab-ink">SLO-kerndoelen zichtbaar per missie, met portfolio-bewijs voor de inspectie.</p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-lab-tealDark group-hover:underline">Voor schoolleiding<ArrowRightIcon /></span>
                            </a>
                            <a href="#voor-schoolleiding" onClick={(e) => { e.preventDefault(); scrollTo('voor-schoolleiding'); }} className="group rounded-2xl border border-lab-line bg-lab-cream p-5 text-left shadow-sm shadow-lab-ink/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                <p className="text-sm font-black uppercase tracking-wide text-lab-sageDeep">Veilig</p>
                                <p className="mt-2 text-base font-bold leading-snug text-lab-ink">AVG-compliant, verwerkersovereenkomst en DPIA-ondersteuning — te beoordelen door ICT.</p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-lab-tealDark group-hover:underline">Veilig &amp; AVG<ArrowRightIcon /></span>
                            </a>
                            <a href="#schoolpilot" onClick={(e) => { e.preventDefault(); scrollTo('schoolpilot'); }} className="group rounded-2xl border border-lab-line bg-lab-cream p-5 text-left shadow-sm shadow-lab-ink/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                <p className="text-sm font-black uppercase tracking-wide text-lab-sageDeep">Snel live</p>
                                <p className="mt-2 text-base font-bold leading-snug text-lab-ink">Schoolpilot binnen 10 werkdagen ingericht, samen met je team.</p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-lab-tealDark group-hover:underline">Wat zit er in de pilot?<ArrowRightIcon /></span>
                            </a>
                        </div>
                    </div>
                </section>

                <CinematicSkillJourney />

                <section id="skills" className="relative scroll-mt-24 overflow-hidden bg-lab-paper px-5 py-20 md:px-10">
                    <Doodle className="right-4 top-8 hidden text-lab-sage/70 lg:block" variant="leaf" />

                    <div className="mx-auto max-w-5xl">
                        <div className="relative mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
                            <Reveal>
                                <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Ontdek jouw favoriete skills</h2>
                                <Squiggle color={C.coral} />
                                <p className="mt-5 max-w-2xl text-pretty text-base font-semibold leading-7 text-lab-muted">
                                    Elke skill krijgt een zichtbaar voorbeeld: van een AI-tool bouwen tot een game ontwerpen of veilig online werken.
                                </p>
                            </Reveal>
                            <Reveal delay={0.08} y={24} className="relative rounded-[28px] border border-lab-line bg-white p-4 shadow-xl shadow-lab-ink/8 lg:p-5">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/assets/storytelling/beaver-storyteller.webp"
                                        alt=""
                                        aria-hidden="true"
                                        className="size-16 shrink-0 -rotate-6 object-contain drop-shadow-md lg:size-[4.5rem] lg:translate-y-2"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="min-w-0" aria-live="polite">
                                        <p className="text-[11px] font-black uppercase tracking-wide text-lab-sageDeep">Beveradvies</p>
                                        <p className="mt-1 text-sm font-black leading-5 text-lab-ink">{activeSkill.coachTip}</p>
                                        <p className="mt-3 rounded-2xl bg-lab-cream px-3 py-2 text-xs font-black leading-5 text-lab-tealDark">
                                            Past goed bij: {activeSkill.bestFor}.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                            {skills.map((skill, index) => (
                                <Reveal key={skill.title} delay={index * 0.06} y={30} className={`skill-card-motion overflow-hidden rounded-[28px] bg-white shadow-lg shadow-lab-ink/8 ring-1 transition duration-300 ${activeSkillIndex === index ? 'ring-lab-coral/70 lg:-translate-y-1 lg:shadow-xl lg:shadow-lab-ink/12' : 'ring-lab-line/80'}`}>
                                    <article
                                        tabIndex={0}
                                        onMouseEnter={() => setActiveSkillIndex(index)}
                                        onFocus={() => setActiveSkillIndex(index)}
                                        aria-label={`${skill.title}. ${skill.coachTip}`}
                                        className="h-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lab-coral"
                                    >
                                    <div className="relative aspect-[1.35] overflow-hidden bg-lab-cream">
                                        <img src={skill.image} alt={skill.alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]" loading="lazy" decoding="async" />
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-5 grid size-16 place-items-center rounded-full text-lab-ink" style={{ backgroundColor: skill.color }}>
                                            {skill.icon}
                                        </div>
                                        <h3 className="text-lg font-black text-lab-ink">{skill.title}</h3>
                                        <ul className="mt-4 space-y-2">
                                            {skill.bullets.map((bullet) => (
                                                <li key={bullet} className="flex gap-2 text-sm font-semibold text-lab-bodyDark">
                                                    <CheckIcon />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-6 text-sm font-black text-lab-ink">{skill.projects}</p>
                                        <p className="mt-3 rounded-2xl bg-lab-cream px-3 py-2 text-xs font-black leading-5 text-lab-tealDark lg:hidden">
                                            Past goed bij: {skill.bestFor}.
                                        </p>
                                    </div>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => scrollTo('projecten')} className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-lab-tealDark px-7 py-3 text-sm font-black text-white shadow-lg shadow-lab-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                Bekijk hoe leerlingen bouwen
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </section>

                <section id="projecten" className="relative scroll-mt-24 px-5 py-20 md:px-10">
                    <div className="absolute inset-0 -z-10 bg-lab-creamWarm" aria-hidden="true" />
                    <WaveTop color={C.cream} />
                    <WaveBottom color={C.cream} />
                    <div className="relative z-10 mx-auto max-w-5xl">
                        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <Reveal>
                                <h2 className="max-w-xl text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Laat AI een game mee bouwen</h2>
                                <Squiggle color={C.ink} />
                            </Reveal>
                            <Reveal delay={0.1} className="max-w-lg text-pretty text-base font-semibold leading-7 text-lab-muted">
                                Leerlingen schrijven zelf een prompt en zien meteen hoe hun mini-game verandert. De demo stopt na vijf prompts.
                            </Reveal>
                        </div>
                        <AiGameBuilderDemo reduceMotion={reduceMotion} />
                    </div>
                </section>

                <PortfolioStorySection startPilot={startPilot} />

                <BuyerReadySchoolSections startPilot={startPilot} />

                <section className="relative bg-lab-tealDark px-5 pb-12 pt-20 text-white md:px-10 md:pt-24">
                    <WaveTop color={C.cream} dark />
                    <Reveal className="footer-cta-motion relative z-10 mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="hidden h-40 w-32 flex-none items-center justify-center md:flex" aria-hidden="true">
                            <img src="/assets/storytelling/beaver-storyteller.webp" alt="" className="max-h-36 w-auto object-contain opacity-90 drop-shadow-2xl" loading="lazy" decoding="async" />
                        </div>
                        <div className="relative">
                            <div>
                                <h2 className="text-balance text-4xl font-black leading-tight md:text-5xl">Klaar om digitale geletterdheid <span className="text-lab-gold">aantoonbaar</span> te maken?</h2>
                                <p className="mt-3 text-sm font-semibold text-white/78">Eén schoolpilot, binnen 10 werkdagen live — motiverend voor leerlingen, aantoonbaar voor je school.</p>
                            </div>
                        </div>
                        <a href="/pilot" onClick={startPilot} className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-lab-gold px-8 py-4 text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">
                            Plan mijn pilot
                            <ArrowRightIcon />
                        </a>
                    </Reveal>
                    <footer className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-col gap-6 border-t border-white/10 pt-7 text-sm font-semibold text-white/75">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <a href="/" className="inline-flex min-h-[44px] items-center rounded px-1 py-2 font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">dgskills.app</a>
                            <div className="flex flex-wrap gap-6">
                                <a href="/digitale-geletterdheid-vo" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Digitale geletterdheid VO</a>
                                <a href="/slo-kerndoelen-digitale-geletterdheid" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">SLO-kerndoelen</a>
                                <a href="/ai-geletterdheid-onderwijs-ai-act" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">AI-geletterdheid &amp; AI Act</a>
                                <a href="/ict/privacy/policy" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Privacy</a>
                                <a href="/ict/privacy/ai" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">AI-transparantie</a>
                                <a href="/ict/privacy/cookies" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Cookies</a>
                                <a href="mailto:info@dgskills.app" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Contact</a>
                            </div>
                            <p>Zin om samen te werken?</p>
                        </div>
                        <p className="text-sm text-white/70">Eenmanszaak Yorin Vonder · KvK 81819889 · info@dgskills.app</p>
                    </footer>
                </section>
            </main>

            <div
                className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 lg:hidden ${reduceMotion ? '' : 'transition-all duration-300'} ${showFloatingCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
                aria-hidden={!showFloatingCta}
            >
                <a
                    href="/pilot"
                    onClick={startPilot}
                    tabIndex={showFloatingCta ? 0 : -1}
                    className="mx-auto flex min-h-[52px] max-w-md items-center justify-center gap-2 rounded-full bg-lab-gold px-6 py-3 text-sm font-black text-lab-ink shadow-xl shadow-lab-ink/20 ring-1 ring-lab-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink"
                >
                    Plan een schoolpilot
                    <ArrowRightIcon />
                </a>
            </div>
        </div>
    );
};

function useHomepageGsapEffects(reduceMotion: boolean) {
    useEffect(() => {
        if (reduceMotion || typeof window === 'undefined') return;

        let cancelled = false;
        let ctx: { revert: () => void } | undefined;

        void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
            .then(([gsapModule, scrollTriggerModule]) => {
                if (cancelled) return;
                const { gsap } = gsapModule;
                const { ScrollTrigger } = scrollTriggerModule;
                gsap.registerPlugin(ScrollTrigger);

                ctx = gsap.context(() => {
                    gsap.to('[data-hero-mockup]', {
                        yPercent: -7,
                        rotation: -1.2,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '[data-home-hero]',
                            start: 'top top',
                            end: 'bottom top',
                            scrub: 0.8,
                        },
                    });

                    gsap.fromTo(
                        '.skill-card-motion',
                        {
                            autoAlpha: 0,
                            y: 92,
                            scale: 0.9,
                            rotation: (index: number) => [-5, 4, -3, 5, -4][index] ?? 0,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            duration: 0.85,
                            stagger: 0.08,
                            ease: 'back.out(1.35)',
                            scrollTrigger: {
                                trigger: '#skills',
                                start: 'top 72%',
                            },
                        }
                    );

                    gsap.fromTo(
                        '.project-card-motion',
                        {
                            autoAlpha: 0,
                            xPercent: (index: number) => [-36, -14, 14, 36][index] ?? 0,
                            y: 70,
                            scale: 0.9,
                            rotation: (index: number) => [-6, 3, -2, 6][index] ?? 0,
                        },
                        {
                            autoAlpha: 1,
                            xPercent: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            duration: 0.9,
                            stagger: 0.08,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: '#projecten',
                                start: 'top 68%',
                            },
                        }
                    );

                    gsap.fromTo(
                        '.footer-cta-motion',
                        { y: 42, scale: 0.98 },
                        {
                            y: 0,
                            scale: 1,
                            duration: 0.9,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: '.footer-cta-motion',
                                start: 'top 78%',
                            },
                        }
                    );

                }, document.body);

                window.setTimeout(() => ScrollTrigger.refresh(), 150);
            })
            .catch(() => {
                // Motion enhancement should never block the landing page.
            });

        return () => {
            cancelled = true;
            ctx?.revert();
        };
    }, [reduceMotion]);
}

function CinematicSkillJourney() {
    const [active, setActive] = useState(0);
    const chapterRefs = useRef<Array<HTMLLIElement | null>>([]);
    const activeRef = useRef(0);
    const manualActiveUntilRef = useRef(0);
    const progressScale = Math.max(0.12, (active + 1) / cinematicChapters.length);

    const setActiveChapter = (index: number, fromUser = false) => {
        const next = Math.max(0, Math.min(cinematicChapters.length - 1, index));
        if (fromUser) manualActiveUntilRef.current = Date.now() + 1600;
        if (activeRef.current === next) return;
        activeRef.current = next;
        setActive(next);
    };

    const handleUserSelectChapter = (index: number) => {
        setActiveChapter(index, true);
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
        <section
            id="journey"
            className="relative scroll-mt-24 overflow-x-clip bg-lab-paper px-5 py-20 md:px-10 lg:py-24"
        >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFDF7_0%,#FCF6EA_100%)]" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-px bg-lab-line" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-lab-line" aria-hidden="true" />

            <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,470px)_minmax(0,1fr)] lg:items-center xl:gap-14">
                <div className="min-w-0">
                    <Reveal>
                        <div className="relative max-w-[470px]">
                            <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl lg:text-[3.35rem]">
                                Jouw skill journey
                            </h2>
                            <div className="mt-3">
                                <Squiggle color={C.ink} />
                            </div>
                            <p className="mt-5 text-pretty text-base font-semibold leading-7 text-lab-muted md:text-lg">
                                Van startniveau naar zichtbaar portfolio. Leerlingen zien steeds waar ze staan, wat de volgende stap is en welk bewijs ze opbouwen.
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-lab-line bg-white px-4 py-2 text-sm font-black text-lab-teal shadow-sm shadow-lab-ink/5">
                                <span className="size-2 rounded-full bg-lab-sage" aria-hidden="true" />
                                Heldere route, zichtbare groei
                            </div>
                        </div>
                    </Reveal>

                    <ol className="relative mt-8 space-y-3 md:space-y-4">
                        <span className="absolute bottom-7 left-6 top-7 w-0.5 rounded-full bg-lab-line" aria-hidden="true" />
                        <span
                            className="absolute bottom-7 left-6 top-7 w-0.5 origin-top rounded-full bg-lab-coral transition-transform duration-500"
                            style={{ transform: `scaleY(${progressScale})` }}
                            aria-hidden="true"
                        />
                        {cinematicChapters.map((chapter, index) => {
                            const isActive = active === index;
                            const iconIsLight = chapter.accent === C.ink;
                            const chapterOffset = index - active;
                            const isUpcomingPreview = chapterOffset === 1;
                            return (
                                <li
                                    key={chapter.title}
                                    ref={(node) => {
                                        chapterRefs.current[index] = node;
                                    }}
                                    data-chapter-index={index}
                                    className="relative"
                                >
                                    <button
                                        type="button"
                                        aria-current={isActive ? 'step' : undefined}
                                        onClick={() => handleUserSelectChapter(index)}
                                        onFocus={() => handleUserSelectChapter(index)}
                                        className={`group grid w-full grid-cols-[3rem_1fr_1.75rem] items-center gap-4 rounded-[22px] border p-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-gold focus-visible:ring-offset-2 focus-visible:ring-offset-lab-paper md:p-4 ${isActive ? 'border-lab-gold bg-white shadow-xl shadow-lab-ink/10' : isUpcomingPreview ? 'border-lab-line bg-white/72 shadow-sm shadow-lab-ink/5 hover:-translate-y-0.5 hover:bg-white' : 'border-lab-line/75 bg-white/48 hover:-translate-y-0.5 hover:bg-white/82'}`}
                                    >
                                        <div
                                            className="relative z-10 grid size-12 place-items-center rounded-full border-4 border-lab-paper shadow-md shadow-lab-ink/10 transition-transform duration-300"
                                            style={{ backgroundColor: isActive ? chapter.accent : '#FFFDF7', color: isActive && iconIsLight ? '#FFFFFF' : '#08283B', transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                                        >
                                            {chapter.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-black text-lab-oliveDeep">{chapter.step}</span>
                                                <span className="rounded-full bg-lab-cream px-3 py-1 text-[11px] font-black uppercase text-lab-sageDeep">{chapter.eyebrow}</span>
                                            </div>
                                            <h3 className={`mt-2 font-black leading-tight text-lab-ink ${isActive ? 'text-2xl' : 'text-xl'}`}>{chapter.title}</h3>
                                            <p className="mt-1 max-w-[420px] text-pretty text-sm font-semibold leading-6 text-lab-muted md:text-base md:leading-7">{chapter.copy}</p>
                                            {isActive && (
                                                <p className="mt-3 rounded-xl bg-lab-cream px-3 py-2 text-sm font-black leading-5 text-lab-teal">
                                                    {chapter.routeCoachTip}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`grid size-9 place-items-center rounded-full transition-colors duration-300 ${isActive ? 'bg-lab-ink text-white' : 'bg-lab-paper text-lab-ink group-hover:bg-lab-gold'}`} aria-hidden="true">
                                            <ArrowRightIcon />
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="min-w-0 lg:flex lg:items-center lg:justify-center">
                    <JourneyDashboardPreview active={active} onSelect={handleUserSelectChapter} />
                </div>
            </div>
        </section>
    );
}

function JourneyDashboardPreview({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
    const chapter = cinematicChapters[active];
    const completion = Math.round(((active + 1) / cinematicChapters.length) * 100);
    const sidebarItems = ['Overzicht', 'Mijn missies', 'Portfolio', 'Badges', 'Voortgang'];
    const badgeItems = [
        { title: 'Doorzetter', meta: 'Level 1', color: C.gold },
        { title: 'Samenwerker', meta: 'Level 2', color: C.coral },
        { title: 'Routebouwer', meta: chapter.statLabel, color: chapter.accent },
    ];

    return (
        <div className="relative mx-auto w-full max-w-[760px]">
            <div className="overflow-hidden rounded-[28px] border border-lab-line bg-white shadow-2xl shadow-lab-ink/14">
                <div className="flex h-12 items-center gap-2 bg-lab-ink px-4 text-white">
                    <span className="size-3 rounded-full bg-lab-coral" aria-hidden="true" />
                    <span className="size-3 rounded-full bg-lab-gold" aria-hidden="true" />
                    <span className="size-3 rounded-full bg-lab-sage" aria-hidden="true" />
                    <span className="ml-3 truncate rounded-full bg-white/12 px-4 py-1 text-xs font-black text-white/82">dgskills.app/journey</span>
                </div>

                <div className="grid min-h-[430px] bg-lab-paper sm:grid-cols-[132px_minmax(0,1fr)]">
                    <aside className="hidden border-r border-lab-line bg-white/76 p-4 sm:block" aria-hidden="true">
                        <div className="text-lg font-black text-lab-ink">DGSkills</div>
                        <div className="mt-6 space-y-2">
                            {sidebarItems.map((item, index) => (
                                <div
                                    key={item}
                                    className={`rounded-xl px-3 py-2 text-[11px] font-black ${index === 0 ? 'bg-lab-gold/18 text-lab-ink' : 'text-lab-muted'}`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </aside>

                    <div className="min-w-0 p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-black uppercase text-lab-sageDeep">Mijn route</p>
                                <h3 className="mt-1 text-xl font-black leading-tight text-lab-ink md:text-2xl">Goedemorgen Jamie</h3>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-lab-line bg-white px-3 py-2 text-xs font-black text-lab-muted">
                                <span className="size-2 rounded-full bg-lab-gold" aria-hidden="true" />
                                {completion}% zichtbaar
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-lab-line bg-white p-4 shadow-sm shadow-lab-ink/5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-black text-lab-ink">Jouw leerlijn</p>
                                <span className="rounded-full bg-lab-cream px-3 py-1 text-[11px] font-black uppercase text-lab-sageDeep">{chapter.eyebrow}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-5 gap-2">
                                {cinematicChapters.map((item, index) => {
                                    const isActive = active === index;
                                    const isComplete = index < active;
                                    return (
                                        <button
                                            key={item.title}
                                            type="button"
                                            onClick={() => onSelect(index)}
                                            onFocus={() => onSelect(index)}
                                            className="group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-gold focus-visible:ring-offset-2"
                                            aria-label={`Toon stap ${item.step}: ${item.title}`}
                                            aria-current={isActive ? 'step' : undefined}
                                        >
                                            <span
                                                className={`mx-auto grid size-11 place-items-center rounded-full border text-lab-ink shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 ${isActive ? 'border-transparent text-white' : isComplete ? 'border-lab-sage bg-lab-sageSoft' : 'border-lab-line bg-lab-paper'}`}
                                                style={isActive ? { backgroundColor: item.accent } : undefined}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className={`mt-2 block truncate text-[10px] font-black ${isActive ? 'text-lab-ink' : 'text-lab-muted'}`}>
                                                {index + 1} {item.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="rounded-2xl border border-lab-line bg-white p-4 shadow-sm shadow-lab-ink/5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black uppercase text-lab-sageDeep">Ga verder met</p>
                                        <h4 className="mt-1 text-xl font-black leading-tight text-lab-ink">{chapter.title}</h4>
                                        <p className="mt-2 text-sm font-semibold leading-6 text-lab-muted">{chapter.copy}</p>
                                    </div>
                                    <div
                                        className="grid size-12 flex-none place-items-center rounded-2xl text-white shadow-md shadow-lab-ink/10"
                                        style={{ backgroundColor: chapter.accent }}
                                        aria-hidden="true"
                                    >
                                        {chapter.icon}
                                    </div>
                                </div>
                                <div className="mt-4 h-2 rounded-full bg-lab-cream">
                                    <div
                                        className="h-full rounded-full transition-[width] duration-500"
                                        style={{ width: `${completion}%`, backgroundColor: chapter.accent }}
                                    />
                                </div>
                                <div className="mt-4 inline-flex rounded-full bg-lab-ink px-4 py-2 text-xs font-black text-white">
                                    Ga verder
                                </div>
                            </div>

                            <div className="rounded-2xl border border-lab-line bg-white p-4 shadow-sm shadow-lab-ink/5">
                                <p className="text-[11px] font-black uppercase text-lab-sageDeep">Recente badges</p>
                                <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
                                    {badgeItems.map((badge) => (
                                        <div key={badge.title} className="min-w-0 rounded-xl bg-lab-paper px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="grid size-8 place-items-center rounded-full border border-lab-line bg-white">
                                                    <span className="size-3 rounded-full" style={{ backgroundColor: badge.color }} aria-hidden="true" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-[11px] font-black text-lab-ink">{badge.title}</p>
                                                    <p className="truncate text-[10px] font-bold text-lab-muted">{badge.meta}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-lab-sage/20 bg-lab-sageSoft px-4 py-3">
                            <p className="text-sm font-black text-lab-teal">Tip voor vandaag</p>
                            <p className="mt-1 text-sm font-semibold leading-6 text-lab-muted">{chapter.routeCoachTip}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BuyerReadySchoolSections({ startPilot }: { startPilot: () => void }) {
    return (
        <>
            <section id="docent-les" className="relative scroll-mt-24 overflow-hidden bg-lab-paper px-5 pt-20 pb-12 md:px-10 md:pt-24 md:pb-16">
                <WaveTop color={C.cream} />
                <Doodle className="right-5 top-20 hidden text-lab-sage/60 lg:block" variant="leaf" />

                <div className="relative z-10 mx-auto max-w-5xl">
                    <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-sageDeep">Voor docenten</p>
                            <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Zo werkt een DGSkills-les</h2>
                            <Squiggle color={C.coral} />
                            <p className="mt-5 max-w-xl text-pretty text-base font-semibold leading-7 text-lab-muted">
                                Een les hoeft geen losse uitleg over AI of mediawijsheid te zijn. DGSkills maakt er een maakmoment van, met zichtbare voortgang voor leerling en docent.
                            </p>
                            <ol className="mt-7 grid gap-3">
                                {lessonSteps.map((item) => (
                                    <li key={item.step} className="grid grid-cols-[3rem_1fr] gap-3 rounded-2xl border border-lab-line bg-white/78 p-4 shadow-sm shadow-lab-ink/5">
                                        <span className="grid size-12 place-items-center rounded-full bg-lab-gold text-sm font-black text-lab-ink">{item.step}</span>
                                        <div>
                                            <h3 className="text-lg font-black leading-tight text-lab-ink">{item.title}</h3>
                                            <p className="mt-1 text-sm font-semibold leading-6 text-lab-muted">{item.copy}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <ProductProofFrame
                            label="Leerlingmissie"
                            title="Prompt Perfectionist"
                            image="/screenshots/prompt-master.webp"
                            alt="DGSkills Prompt Perfectionist missie met promptinvoer en feedback"
                            caption="Leerlingen maken, testen en leggen uit wat ze aanpassen."
                        />
                    </Reveal>
                </div>
            </section>

            <section id="voor-schoolleiding" className="relative scroll-mt-24 bg-lab-paper px-5 py-12 md:px-10 md:py-16">
                <div className="relative z-10 mx-auto max-w-5xl space-y-12">
                    <Reveal y={30} className="rounded-[34px] bg-lab-creamDeep px-5 py-8 shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line md:px-8 lg:px-10">
                        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-coralDeep">Voor schoolleiding</p>
                                <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Waarom schoolleiders kiezen voor DGSkills</h2>
                                <p className="mt-5 text-pretty text-base font-semibold leading-7 text-lab-muted">
                                    De pilot laat niet alleen zien dat leerlingen gemotiveerd zijn, maar ook hoe digitale geletterdheid structureel in de school kan landen.
                                </p>
                                <a href="/pilot" onClick={startPilot} className="group mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-full border-2 border-lab-tealDark bg-transparent px-7 py-3 text-sm font-black text-lab-tealDark transition-colors hover:bg-lab-tealDark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                    Plan pilotgesprek
                                    <ArrowRightIcon />
                                </a>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {leaderReasons.map((reason, index) => (
                                    <article key={reason.title} className="rounded-[24px] bg-white p-5 shadow-md shadow-lab-ink/6 ring-1 ring-lab-line">
                                        <div className="mb-4 grid size-12 place-items-center rounded-full bg-lab-paper text-lg font-black text-lab-coralDeep">{String(index + 1).padStart(2, '0')}</div>
                                        <h3 className="text-xl font-black leading-tight text-lab-ink">{reason.title}</h3>
                                        <p className="mt-3 text-sm font-semibold leading-6 text-lab-muted">{reason.copy}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal y={30} className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                        <div className="rounded-[34px] bg-white p-5 shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line md:p-7">
                            <div className="mb-6">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-sageDeep">SLO & curriculum proof</p>
                                <h2 className="mt-3 text-balance text-3xl font-black leading-tight text-lab-ink md:text-4xl">Van losse activiteit naar aantoonbare leerlijn</h2>
                            </div>
                            <div className="overflow-hidden rounded-[24px] border border-lab-line">
                                {sloRows.map((row) => (
                                    <div key={row.domain} className="grid gap-3 border-b border-lab-line bg-lab-paper/75 p-4 last:border-b-0 md:grid-cols-[0.75fr_1fr_1fr] md:items-center">
                                        <p className="text-sm font-black text-lab-ink">{row.domain}</p>
                                        <p className="text-sm font-semibold leading-6 text-lab-muted">{row.missions}</p>
                                        <p className="text-xs font-black leading-5 text-lab-tealDark">{row.proof}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-[34px] bg-lab-tealDark p-6 text-white shadow-xl shadow-lab-ink/12">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-gold">Voor ICT en privacy</p>
                            <h2 className="mt-3 text-balance text-3xl font-black leading-tight md:text-4xl">Veilig te beoordelen door ICT</h2>
                            <p className="mt-4 text-pretty text-sm font-semibold leading-7 text-white/78">
                                DGSkills verkoopt geen zwarte doos. De pilot geeft scholen tijd om privacy, AI en beheer concreet te toetsen.
                            </p>
                            <div className="mt-6 grid gap-3">
                                {ictTrustItems.map((item) => (
                                    <article key={item.title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                                        <h3 className="text-base font-black text-white">{item.title}</h3>
                                        <p className="mt-1 text-sm font-semibold leading-6 text-white/72">{item.copy}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section id="productbewijs" className="relative scroll-mt-24 overflow-hidden bg-lab-paper px-5 py-12 md:px-10 md:py-16">
                <Doodle className="bottom-20 left-8 hidden text-lab-coral/70 lg:block" variant="spark" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <Reveal y={30}>
                        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-coralDeep">Productbewijs</p>
                                <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Screenshots die de aankoopvraag beantwoorden</h2>
                                <Squiggle color={C.ink} />
                            </div>
                            <p className="max-w-xl text-pretty text-base font-semibold leading-7 text-lab-muted">
                                Elk scherm laat een ander beslispunt zien: motivatie voor leerlingen, grip voor docenten en vertrouwen voor schoolteams.
                            </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            {screenshotProofPanels.map((panel, index) => (
                                <ProductProofFrame
                                    key={panel.label}
                                    label={panel.label}
                                    title={panel.title}
                                    image={panel.image}
                                    alt={panel.alt}
                                    caption={panel.copy}
                                    featured={index === 1}
                                />
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            <section id="schoolpilot" className="relative scroll-mt-24 bg-lab-paper px-5 py-12 md:px-10 md:py-16">
                <div className="relative z-10 mx-auto max-w-5xl">
                    <Reveal y={30} className="grid gap-8 rounded-[34px] bg-lab-cream px-5 py-8 shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-sageDeep">Schoolpilot</p>
                            <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Wat krijg je in de schoolpilot?</h2>
                            <p className="mt-5 text-pretty text-base font-semibold leading-7 text-lab-muted">
                                Gemaakt door een docent die DGSkills zelf in de eigen VO/VSO-klas gebruikt, en doorlopend getest met docenten. De pilot is klein genoeg om te starten, maar concreet genoeg om er een schoolbesluit op te baseren.
                            </p>
                        </div>
                        <div>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {pilotItems.map((item) => (
                                    <li key={item} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-black leading-6 text-lab-ink shadow-sm shadow-lab-ink/5 ring-1 ring-lab-line">
                                        <CheckIcon />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="/pilot" onClick={startPilot} className="group mt-6 inline-flex min-h-[48px] items-center gap-3 rounded-full border-2 border-lab-tealDark bg-transparent px-7 py-3 text-sm font-black text-lab-tealDark transition-colors hover:bg-lab-tealDark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                                Plan mijn schoolpilot
                                <ArrowRightIcon />
                            </a>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section id="faq" className="relative scroll-mt-24 bg-lab-paper px-5 py-12 md:px-10 md:pt-16 md:pb-24">
                <div className="relative z-10 mx-auto max-w-5xl">
                    <Reveal y={30}>
                        <div className="mb-8">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-sageDeep">Veelgestelde vragen per rol</p>
                            <h2 className="mt-3 text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">De vragen die in een schoolteam op tafel komen</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {roleFaqs.map((faq) => (
                                <article key={faq.role} className="rounded-[24px] bg-white p-5 shadow-md shadow-lab-ink/6 ring-1 ring-lab-line">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-lab-coralDeep">{faq.role}</p>
                                    <h3 className="mt-3 text-xl font-black leading-tight text-lab-ink">{faq.question}</h3>
                                    <p className="mt-3 text-sm font-semibold leading-6 text-lab-muted">{faq.answer}</p>
                                </article>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}

function ProductProofFrame({
    label,
    title,
    image,
    alt,
    caption,
    featured = false,
}: {
    label: string;
    title: string;
    image: string;
    alt: string;
    caption: string;
    featured?: boolean;
}) {
    return (
        <article className={`overflow-hidden rounded-[30px] bg-white shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line ${featured ? 'md:col-span-2 lg:grid lg:grid-cols-[0.72fr_1.28fr]' : ''}`}>
            <div className="flex flex-col justify-center p-5 md:p-6">
                <span className="w-fit rounded-full bg-lab-cream px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-lab-tealDark">{label}</span>
                <h3 className="mt-4 text-2xl font-black leading-tight text-lab-ink">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-lab-muted">{caption}</p>
            </div>
            <div className="bg-lab-cream p-4 md:p-5">
                <div className="overflow-hidden rounded-[22px] bg-lab-paper shadow-lg shadow-lab-ink/10 ring-1 ring-lab-line">
                    <div className="flex h-10 items-center gap-2 border-b border-lab-line bg-white px-4">
                        <span className="size-2.5 rounded-full bg-lab-coral" />
                        <span className="size-2.5 rounded-full bg-lab-gold" />
                        <span className="size-2.5 rounded-full bg-lab-sage" />
                        <span className="ml-3 truncate rounded-full bg-lab-cream px-3 py-1 text-[10px] font-black text-lab-muted">dgskills.app</span>
                    </div>
                    <div className="aspect-[16/10] bg-lab-paper">
                        <img src={image} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
                    </div>
                </div>
            </div>
        </article>
    );
}

const gamePrompts = [
    {
        name: 'Stroomroute 01',
        sky: '#5F947D',
        pipe: '#0B453F',
        beaver: '#D97848',
        accent: '#D7C95F',
    },
    {
        name: 'Snelle stroom',
        sky: '#5F947D',
        pipe: '#08283B',
        beaver: '#D97848',
        accent: '#F3E4CB',
    },
    {
        name: 'Avondrivier',
        sky: '#08283B',
        pipe: '#0B453F',
        beaver: '#D7C95F',
        accent: '#D7C95F',
    },
    {
        name: 'Leerdoel-stroom',
        sky: '#FCF6EA',
        pipe: '#5F947D',
        beaver: '#D97848',
        accent: '#0B453F',
    },
    {
        name: 'Eindbaas: rapids',
        sky: '#08283B',
        pipe: '#0B453F',
        beaver: '#D97848',
        accent: '#D7C95F',
    },
];

function AiGameBuilderDemo({ reduceMotion }: { reduceMotion: boolean }) {
    const [promptsUsed, setPromptsUsed] = useState(0);
    const [customPrompt, setCustomPrompt] = useState('');
    const [lastPrompt, setLastPrompt] = useState<string>('Nog geen prompt geschreven. Begin makkelijk: "maak het gat groter" of "maak de bever sneller".');
    const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [honeypot, setHoneypot] = useState('');
    const active = gamePrompts[1]; // Vaste 'Snelle stroom' theme als basis-palet
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
            setGameConfig((prev) => applyDelta(prev, result.delta));
            setLastPrompt(result.reply);
            setPromptsUsed((count) => Math.min(5, count + 1));
            setCustomPrompt('');
            if (typeof result.remaining === 'number' && result.remaining <= 0) {
                setPromptsUsed(5);
            }
        } else {
            setLastPrompt('Probeer het nog eens met een ander verzoek.');
            setErrorText(result.error.message);
            if (result.error.code === 'rate_limit') {
                setPromptsUsed(5);
            }
        }
        setIsLoading(false);
    };

    return (
        <Reveal y={34} className="project-card-motion grid gap-5 rounded-[36px] bg-lab-paper p-4 shadow-2xl shadow-lab-ink/12 ring-1 ring-lab-line lg:grid-cols-[0.82fr_1.18fr] lg:p-6">
            <div className="flex min-h-[430px] flex-col rounded-[28px] bg-lab-ink p-5 text-white shadow-xl shadow-lab-ink/18">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-wide text-lab-gold">Gemini coach</p>
                        <h3 className="mt-1 text-2xl font-black">Schrijf je eigen prompt</h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">{promptsUsed}/5 prompts</span>
                </div>

                <div className="mt-7 rounded-3xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-white/56">Laatste idee</p>
                    <p className="mt-2 text-base font-bold leading-7 text-white">{lastPrompt}</p>
                    {errorText && (
                        <p className="mt-2 text-xs font-bold text-lab-coralDeep" role="alert">{errorText}</p>
                    )}
                </div>

                <form onSubmit={submitCustomPrompt} className="mt-auto pt-6">
                    <label htmlFor="game-prompt" className="text-sm font-black text-white">Wat moet de game doen?</label>
                    <textarea
                        id="game-prompt"
                        value={customPrompt}
                        onChange={(event) => setCustomPrompt(event.target.value)}
                        disabled={inputDisabled}
                        maxLength={500}
                        placeholder={promptLimitReached ? 'Promptlimiet bereikt' : 'Bijvoorbeeld: maak de bever sneller en het gat groter.'}
                        className="mt-3 min-h-[112px] w-full resize-none rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/50 focus:border-lab-gold disabled:opacity-50"
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
                        <p className="text-xs font-semibold text-white/58">Maximaal vijf prompts per demo.</p>
                        <button
                            type="submit"
                            disabled={inputDisabled || !customPrompt.trim()}
                            className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-lab-gold px-5 py-2 text-sm font-black text-lab-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-ink"
                        >
                            {isLoading ? 'Bezig…' : 'Pas aan'}
                            {!isLoading && <ArrowRightIcon />}
                        </button>
                    </div>
                </form>
            </div>

            <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#08283B] p-4 shadow-xl shadow-lab-ink/18">
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 text-lab-ink">
                    <div>
                        <p className="text-xs font-black uppercase text-lab-sageDeep">Live preview</p>
                        <h3 className="text-lg font-black">{active.name}</h3>
                    </div>
                    <span className="rounded-full bg-lab-cream px-3 py-1 text-xs font-black">Game Programmeur</span>
                </div>
                <FlappyGamePreview active={active} reduceMotion={reduceMotion} config={gameConfig} />
            </div>
        </Reveal>
    );
}

function BeaverGlider({ color, reduceMotion, yPercent, domRef }: { color: string; reduceMotion: boolean; yPercent?: number; domRef?: React.Ref<HTMLDivElement> }) {
    const tailColor = '#8B5A3C';
    return (
        <div
            ref={domRef}
            className="absolute left-[8%] z-30"
            style={{
                top: yPercent !== undefined ? `${yPercent}%` : '41%',
                animation: yPercent === undefined && !reduceMotion ? 'dg-glider-bob 1.8s ease-in-out infinite' : undefined,
            }}
            aria-hidden="true"
        >
            {!reduceMotion && (
                <div className="absolute -left-10 top-[39%] flex flex-col gap-[4px]">
                    <span className="block h-[3px] w-8 rounded-full bg-white/60" />
                    <span className="block h-[3px] w-5 rounded-full bg-white/38" />
                    <span className="block h-[3px] w-3 rounded-full bg-white/22" />
                </div>
            )}
            <svg
                viewBox="0 0 92 64"
                width="86"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path d="M24 41 C10 37 8 25 21 20 C33 18 41 26 38 38 Z" fill="#FCF6EA" opacity="0.82" />
                <ellipse cx="15" cy="43" rx="14" ry="9" fill={tailColor} style={{ transform: 'rotate(-12deg)', transformOrigin: '18px 38px' }} />
                <ellipse cx="14" cy="44" rx="10" ry="6" fill="#6B3C1E" style={{ transform: 'rotate(-12deg)', transformOrigin: '18px 38px' }} />
                <ellipse cx="48" cy="37" rx="27" ry="17" fill={color} />
                <path d="M31 35 C42 24 57 22 69 32 C57 34 45 40 35 50 Z" fill="#F3E4CB" opacity="0.8" />
                <ellipse cx="69" cy="27" rx="14" ry="12" fill={color} />
                <ellipse cx="62" cy="17" rx="4.2" ry="5.2" fill={tailColor} />
                <ellipse cx="74" cy="16" rx="4.2" ry="5.2" fill={tailColor} />
                <circle cx="75" cy="23" r="4.1" fill="white" />
                <circle cx="76" cy="24" r="2" fill="#08283B" />
                <circle cx="77" cy="23" r="0.8" fill="white" />
                <ellipse cx="82" cy="30" rx="5.5" ry="3.7" fill={tailColor} />
                <ellipse cx="54" cy="51" rx="6" ry="3.5" fill={tailColor} />
                <ellipse cx="39" cy="52" rx="6" ry="3.5" fill={tailColor} />
            </svg>
        </div>
    );
}

// Static physical sprite sizes (tuning happens via GameConfig)
const BEAVER_W = 8;
const BEAVER_H = 10;

type GameState = 'idle' | 'playing' | 'over';
interface Gate { id: number; x: number; gapTop: number; passed: boolean; }

function createGate(config: GameConfig, x: number): Gate {
    const maxGapTop = Math.max(8, 88 - config.gateGap - BEAVER_H);
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

function PlayableBeaverStream({ active, reduceMotion, config }: { active: typeof gamePrompts[number]; reduceMotion: boolean; config: GameConfig }) {
    const gateColor = config.pipeColor ?? active.pipe;
    const beaverColor = config.beaverColor ?? active.beaver;
    const skyColor = config.skyColor ?? active.sky;
    const [gameState, setGameState] = useState<GameState>('idle');
    const [displayScore, setDisplayScore] = useState(0);
    const [renderTick, setRenderTick] = useState(0);

    const beaverY = useRef(50);
    const velocity = useRef(0);
    const gatesRef = useRef<Gate[]>([]);
    const scoreRef = useRef(0);
    const beaverDomRef = useRef<HTMLDivElement>(null);
    const animId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const frameCount = useRef(0);
    const gameStateRef = useRef<GameState>('idle');
    const configRef = useRef(config);

    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { configRef.current = config; }, [config]);

    const handleFlap = useCallback(() => {
        if (gameStateRef.current === 'idle') {
            beaverY.current = 50;
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
            beaverY.current += velocity.current * dt;

            if (beaverY.current < 0 || beaverY.current > 88) {
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
            const bR = 8 + BEAVER_W;
            for (const g of gatesRef.current) {
                const gR = g.x + 10;
                if (g.x < bR && gR > bL) {
                    if (beaverY.current < g.gapTop || beaverY.current > g.gapTop + cfg.gateGap - BEAVER_H) {
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

            if (beaverDomRef.current) {
                beaverDomRef.current.style.top = `${beaverY.current}%`;
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
            className="relative h-[390px] cursor-pointer overflow-hidden rounded-[24px] shadow-2xl shadow-black/24 ring-1 ring-white/15 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink"
            style={{ background: `linear-gradient(180deg, ${skyColor} 0%, #9FDAF2 42%, #B8E3CF 72%, #5F947D 100%)` }}
        >
            <div className="absolute left-0 right-0 top-[30%] h-14 bg-white/16 blur-[8px]" />
            <div className="absolute left-8 top-8 h-7 w-32 rounded-full bg-white/48 blur-[2px]" />
            <div className="absolute right-16 top-14 h-6 w-28 rounded-full bg-white/36 blur-[2px]" />
            <div className="absolute left-[45%] top-12 h-4 w-20 rounded-full bg-white/30 blur-[1px]" />

            <div className="absolute bottom-0 left-0 right-0 h-[82px] bg-gradient-to-b from-[#6CA47E] to-[#0B453F]">
                <div className="absolute left-0 right-0 top-0 h-3 bg-lab-gold/65" />
                <div className="absolute left-0 right-0 top-5 h-[2px] rounded-full bg-white/18" />
                <div className="absolute left-0 right-0 top-11 h-[1.5px] rounded-full bg-white/12" />
            </div>

            {visibleGates.map((gate) => (
                <div
                    key={gate.id}
                    className="absolute top-0 z-20 w-[10%]"
                    style={{ left: `${gate.x}%`, height: '100%' }}
                >
                    <div
                        className="absolute inset-x-0 top-0 rounded-b-[16px] shadow-xl shadow-lab-ink/20"
                        style={{ height: `${gate.gapTop}%`, backgroundColor: gateColor }}
                    >
                        <div className="absolute bottom-4 left-1/2 h-[70%] w-[3px] -translate-x-1/2 rounded-full bg-white/13" />
                    </div>
                    <div
                        className="absolute inset-x-0 bottom-[82px] rounded-t-[16px] shadow-xl shadow-lab-ink/20"
                        style={{ height: `${Math.max(0, 100 - gate.gapTop - config.gateGap)}%`, backgroundColor: gateColor }}
                    >
                        <div className="absolute left-1/2 top-4 h-[70%] w-[3px] -translate-x-1/2 rounded-full bg-white/13" />
                    </div>
                </div>
            ))}

            <BeaverGlider
                color={beaverColor}
                reduceMotion={reduceMotion}
                yPercent={gameState === 'idle' && !reduceMotion ? undefined : beaverY.current}
                domRef={beaverDomRef}
            />

            {gameState !== 'idle' && (
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-lab-paper/95 px-4 py-2 shadow-lg shadow-lab-ink/10">
                    <span className="size-2 rounded-full bg-lab-sage" />
                    <span className="text-xs font-black text-lab-ink">{displayScore} poorten</span>
                </div>
            )}

            <div className="absolute right-5 top-5 rounded-full bg-lab-cream/90 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-lab-tealDark shadow-md shadow-lab-ink/8">
                Eigen side-scroller
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-start gap-3 rounded-3xl bg-lab-paper/96 p-3 shadow-xl shadow-lab-ink/18">
                <div className="mt-0.5 flex size-7 flex-none items-center justify-center rounded-full bg-lab-coral/15">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="#D97848" strokeWidth="2" />
                        <circle cx="8" cy="8" r="3" fill="#D97848" />
                    </svg>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-lab-coralDeep">Leerdoel</p>
                    <p className="mt-0.5 text-xs font-black leading-snug text-lab-ink">Testen, aanpassen en uitleggen waarom de game beter wordt.</p>
                </div>
            </div>

            {gameState === 'over' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-lab-ink/40 backdrop-blur-[2px]">
                    <div className="rounded-2xl bg-lab-paper px-6 py-5 text-center shadow-2xl">
                        <p className="text-xs font-black uppercase tracking-wide text-lab-coralDeep">Game over</p>
                        <p className="mt-1 text-3xl font-black text-lab-ink">{displayScore}</p>
                        <p className="text-xs font-semibold text-lab-muted">poorten gehaald</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleFlap(); }}
                            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-lab-gold px-5 py-2 text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink"
                        >
                            Opnieuw
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes dg-glider-bob {
                    0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
                    50% { transform: translate3d(0, -14px, 0) rotate(3deg); }
                }
            `}</style>
        </div>
    );
}

function FlappyGamePreview({ active, reduceMotion, config }: { active: typeof gamePrompts[number]; reduceMotion: boolean; config: GameConfig }) {
    return <PlayableBeaverStream active={active} reduceMotion={reduceMotion} config={config} />;
}

function promptsUsedLabel(name: string) {
    return name.length * 17;
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
            image: '/screenshots/avatar-customization-1200.webp',
            alt: 'DGSkills avatar-aanpassing voor het leerlingportfolio',
            url: 'dgskills.app/avatar',
            statLabel: 'Mila — eigen identiteit',
            stat: 'Level 1 · Architect',
        },
        {
            kicker: 'Trofeeën',
            title: 'Trofeeën maken groei zichtbaar.',
            copy: 'Leerlingen zien wat ze al beheersen en welke volgende stap logisch is.',
            image: '/screenshots/student-progress-xp-1200.webp',
            alt: 'DGSkills voortgangsscherm met XP, level en trofeeën',
            url: 'dgskills.app/voortgang',
            statLabel: 'Streak — week 12',
            stat: '12 dagen · 4 badges',
        },
        {
            kicker: 'Portfolio',
            title: 'Projecten worden bewijsstukken.',
            copy: 'Een portfolio vertelt wat iemand gemaakt heeft, welke keuzes zijn gemaakt en welke skills daarbij horen.',
            image: '/screenshots/student-dashboard.webp',
            alt: 'DGSkills leerlingdashboard als portfolio-overzicht',
            url: 'dgskills.app/portfolio',
            statLabel: 'Mila — Level 6 Creator',
            stat: '1.840 XP · 4 projecten',
        },
        {
            kicker: 'Docent',
            title: 'De docent ziet waar groei zit.',
            copy: 'Voor scholen wordt zichtbaar waar een leerling sterk op scoort, waar extra uitleg nodig is en welke SLO-doelen geraakt worden.',
            image: '/screenshots/student-mission-overview-1200.webp',
            alt: 'DGSkills missie-overzicht met voortgang en SLO-koppeling per leerling',
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

    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeInOutCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const cardPose = (depth: number) => {
        const poses = [
            { x: 10, y: -10, rot: 2.4, scale: 1.035 },
            { x: -8, y: 16, rot: -2.6, scale: 0.945 },
            { x: -18, y: 32, rot: -5.2, scale: 0.89 },
            { x: -28, y: 50, rot: -7.8, scale: 0.835 },
        ];
        return poses[Math.min(depth, poses.length - 1)];
    };

    const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

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

        const activeIndex = Math.min(N - 1, Math.floor(t));
        const transition = activeIndex >= N - 1 ? 0 : clamp01(t - activeIndex);
        const depth = (index - activeIndex + N) % N;

        let pose = cardPose(depth);
        let zIndex = N - depth + 1;
        let pointerEvents: React.CSSProperties['pointerEvents'] = depth === 0 && transition < 0.5 ? 'auto' : 'none';

        if (transition > 0) {
            const shift = easeOutCubic(transition);

            if (depth === 0) {
                const under = easeInOutCubic(transition);
                const front = cardPose(0);
                const bottom = cardPose(N - 1);
                const arc = Math.sin(transition * Math.PI);
                pose = {
                    x: mix(front.x, bottom.x, under) + arc * 34,
                    y: mix(front.y, bottom.y, under) + arc * 56,
                    rot: mix(front.rot, bottom.rot, under) + arc * 8,
                    scale: mix(front.scale, bottom.scale, under),
                };
                zIndex = transition < 0.24 ? N + 3 : 1;
            } else {
                const from = cardPose(depth);
                const to = cardPose(depth - 1);
                pose = {
                    x: mix(from.x, to.x, shift),
                    y: mix(from.y, to.y, shift),
                    rot: mix(from.rot, to.rot, shift),
                    scale: mix(from.scale, to.scale, shift),
                };
                zIndex = depth === 1 && transition >= 0.24 ? N + 3 : N - depth + 2;
                pointerEvents = depth === 1 && transition >= 0.5 ? 'auto' : 'none';
            }
        }

        return {
            zIndex,
            opacity: 1,
            transform: `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rot}deg) scale(${pose.scale})`,
            transition: 'transform 90ms linear, opacity 160ms ease',
            pointerEvents,
            willChange: 'transform, opacity',
        };
    };

    return (
        <section
            id="portfolio"
            ref={sectionRef}
            className={`relative scroll-mt-24 px-5 py-20 md:px-10 ${reduceMotion ? '' : 'lg:min-h-[420svh] lg:py-0'}`}
        >
            <div className={`mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.72fr_1.28fr] ${reduceMotion ? 'lg:items-start' : 'lg:sticky lg:top-20 lg:h-[calc(100svh-80px)] lg:items-center'}`}>
                <Reveal className="lg:h-fit lg:self-center">
                    <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Jouw portfolio. Jouw verhaal.</h2>
                    <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-lab-muted">
                        Scroll door een portfolio dat echt iets vertelt: wie je bent, wat je maakt, welke trofeeën je haalt en waar je nog in groeit.
                    </p>
                    <a href="/pilot" onClick={startPilot} className="group mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-full border-2 border-lab-tealDark bg-transparent px-7 py-3 text-sm font-black text-lab-tealDark transition-colors hover:bg-lab-tealDark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
                        Plan pilot met portfolio-route
                        <ArrowRightIcon />
                    </a>
                </Reveal>

                <div className={`${reduceMotion ? 'hidden' : 'relative hidden h-[min(68svh,560px)] min-h-[440px] overflow-visible lg:block'}`}>
                    <div className="absolute inset-0 translate-x-9 translate-y-10 rotate-3 rounded-[34px] bg-lab-creamDeep/80 shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line" aria-hidden="true" />
                    <div className="absolute inset-0 translate-x-5 translate-y-5 -rotate-2 rounded-[34px] bg-white/75 shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line" aria-hidden="true" />
                    {panels.map((panel, index) => (
                        <article
                            key={panel.title}
                            className="portfolio-story-motion absolute inset-0 grid overflow-hidden rounded-[34px] bg-white shadow-2xl shadow-lab-ink/12 ring-1 ring-lab-line md:grid-cols-[0.8fr_1.2fr]"
                            style={getCardStyle(index)}
                            aria-hidden={Math.abs(progress * (panels.length - 1) - index) >= 0.5}
                        >
                            <div className="flex flex-col justify-center p-9 md:p-10">
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-lab-sageDeep">{panel.kicker}</p>
                                <h3 className="mt-3 text-3xl font-black leading-[1.1] text-lab-ink">{panel.title}</h3>
                                <p className="mt-5 text-base font-semibold leading-7 text-lab-muted">{panel.copy}</p>
                                <div className="mt-7">
                                    <span className="inline-flex rounded-full border border-lab-line bg-lab-paper px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-lab-tealDark">
                                        Stap {String(index + 1).padStart(2, '0')} van {String(panels.length).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                            <div className="relative bg-lab-cream p-6 md:p-7">
                                <div className="overflow-hidden rounded-[20px] bg-lab-paper shadow-xl shadow-lab-ink/10 ring-1 ring-lab-line">
                                    <div className="flex h-9 items-center gap-1.5 border-b border-lab-line bg-white px-3">
                                        <span className="size-2.5 rounded-full bg-lab-coral" />
                                        <span className="size-2.5 rounded-full bg-lab-gold" />
                                        <span className="size-2.5 rounded-full bg-lab-sage" />
                                        <span className="ml-3 truncate rounded-full bg-lab-cream px-3 py-0.5 text-[10px] font-black text-lab-muted">{panel.url}</span>
                                    </div>
                                    <div className="aspect-[16/11] bg-lab-paper">
                                        <img src={panel.image} alt={panel.alt} className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 right-5 max-w-[78%] rounded-2xl bg-white px-4 py-3 shadow-xl shadow-lab-ink/14 ring-1 ring-lab-line">
                                    <p className="text-[10px] font-black uppercase tracking-wide text-lab-sageDeep">{panel.statLabel}</p>
                                    <p className="mt-0.5 text-sm font-black text-lab-ink">{panel.stat}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={`space-y-7 ${reduceMotion ? '' : 'lg:hidden'}`}>
                    {panels.map((panel, index) => (
                        <Reveal key={panel.title} delay={index * 0.05} y={34} className="portfolio-story-motion overflow-hidden rounded-[28px] bg-white shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line">
                            <div className="p-7">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-black uppercase tracking-[0.14em] text-lab-sageDeep">{panel.kicker}</p>
                                    <span className="rounded-full border border-lab-line bg-lab-paper px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lab-tealDark">
                                        Stap {String(index + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-2xl font-black leading-[1.1] text-lab-ink">{panel.title}</h3>
                                <p className="mt-4 text-base font-semibold leading-7 text-lab-muted">{panel.copy}</p>
                            </div>
                            <div className="relative bg-lab-cream px-5 pb-9 pt-2">
                                <div className="overflow-hidden rounded-[18px] bg-lab-paper shadow-xl shadow-lab-ink/10 ring-1 ring-lab-line">
                                    <div className="flex h-8 items-center gap-1.5 border-b border-lab-line bg-white px-3">
                                        <span className="size-2 rounded-full bg-lab-coral" />
                                        <span className="size-2 rounded-full bg-lab-gold" />
                                        <span className="size-2 rounded-full bg-lab-sage" />
                                        <span className="ml-2 truncate rounded-full bg-lab-cream px-2.5 py-0.5 text-[9px] font-black text-lab-muted">{panel.url}</span>
                                    </div>
                                    <div className="aspect-[16/10] bg-lab-paper">
                                        <img src={panel.image} alt={panel.alt} className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 right-4 max-w-[80%] rounded-xl bg-white px-3 py-2 shadow-xl shadow-lab-ink/14 ring-1 ring-lab-line">
                                    <p className="text-[9px] font-black uppercase tracking-wide text-lab-sageDeep">{panel.statLabel}</p>
                                    <p className="mt-0.5 text-xs font-black text-lab-ink">{panel.stat}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
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

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    return reduced;
}

function HeroJourneyBridge() {
    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-0 h-52 bg-gradient-to-b from-transparent via-lab-paper/72 to-lab-paper md:h-64" aria-hidden="true">
            <div className="absolute inset-x-0 bottom-0 h-20 bg-lab-paper" />
        </div>
    );
}

function ProductHeroMockup() {
    return (
        <div data-hero-mockup className="relative z-10 mx-auto w-full max-w-[720px] pt-4 sm:pt-6 lg:ml-auto lg:mr-0 lg:w-[min(44vw,760px)] lg:max-w-none xl:w-[min(48vw,980px)]">
            <div className="absolute inset-x-[18%] -bottom-2 h-24 rounded-full bg-lab-ink/15 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[26px] bg-lab-ink p-2 shadow-[0_30px_60px_rgba(6,31,45,0.22)] md:rounded-[32px] md:p-3">
                <div className="overflow-hidden rounded-[18px] bg-lab-paper md:rounded-[24px]">
                    <div className="flex h-9 items-center gap-1.5 border-b border-lab-line bg-white px-3 md:h-11 md:gap-2 md:px-4">
                        <span className="size-2.5 rounded-full bg-lab-coral md:size-3" aria-hidden="true" />
                        <span className="size-2.5 rounded-full bg-lab-gold md:size-3" aria-hidden="true" />
                        <span className="size-2.5 rounded-full bg-lab-sage md:size-3" aria-hidden="true" />
                        <span className="ml-3 truncate rounded-full bg-lab-cream px-3 py-0.5 text-[10px] font-black text-lab-muted md:ml-4 md:px-4 md:py-1 md:text-xs">dgskills.app/missie</span>
                    </div>
                    <img
                        src="/screenshots/prompt-master.webp"
                        alt="Leerling werkt aan de DGSkills-missie Prompt Perfectionist en typt een AI-prompt om een hond te laten tekenen"
                        className="block w-full object-cover object-top"
                        width={960}
                        height={600}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                </div>
            </div>
        </div>
    );
}

function WaveTop({ color, dark = false }: { color: string; dark?: boolean }) {
    return (
        <svg className={`pointer-events-none absolute left-0 top-0 h-16 w-full -translate-y-[1px] ${dark ? 'text-lab-tealDark' : ''}`} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path fill={color} d="M0,44 C180,92 318,88 488,56 C680,20 812,16 992,54 C1164,90 1294,88 1440,40 L1440,0 L0,0 Z" />
        </svg>
    );
}

function WaveBottom({ color }: { color: string }) {
    return (
        <svg className="pointer-events-none absolute bottom-0 left-0 h-16 w-full translate-y-[1px]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path fill={color} d="M0,76 C154,34 310,32 474,66 C660,104 812,102 1000,64 C1176,28 1306,30 1440,78 L1440,120 L0,120 Z" />
        </svg>
    );
}

function Underline() {
    return (
        <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true">
            <path d="M3 11 C52 4 121 3 217 10" fill="none" stroke="#8F9148" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function TitleSpark() {
    return (
        <svg className="pointer-events-none absolute -top-5 left-[18%] h-7 w-12 -translate-x-1/2 -rotate-[22deg] sm:-top-7 sm:h-9 sm:w-16" viewBox="0 0 64 42" fill="none" aria-hidden="true">
            <path d="M32 4v22M4 12l16 18M60 12 44 30" stroke="#D97848" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function Squiggle({ color }: { color: string }) {
    return (
        <svg className="mt-4 h-6 w-28" viewBox="0 0 120 24" aria-hidden="true">
            <path d="M2 15 C16 2 27 25 41 12 C54 0 65 24 80 11 C94 -1 105 19 118 8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function Doodle({ variant, className }: { variant: 'spark' | 'arrow' | 'dot' | 'leaf'; className?: string }) {
    const common = `pointer-events-none absolute z-0 ${className ?? ''}`;
    if (variant === 'spark') {
        return <svg className={`${common} h-16 w-16`} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M31 6v18M12 16l12 13M52 16 40 29" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>;
    }
    if (variant === 'arrow') {
        return <svg className={`${common} h-28 w-28`} viewBox="0 0 112 112" fill="none" aria-hidden="true"><path d="M100 8C68 14 42 35 28 72" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" /><path d="m28 72 18-10M28 72l8-19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
    }
    if (variant === 'leaf') {
        return <svg className={`${common} h-32 w-32`} viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M14 100C40 72 55 37 103 20C97 62 76 91 38 101" stroke="currentColor" strokeWidth="3" /><path d="M31 92C47 70 64 51 88 33" stroke="currentColor" strokeWidth="2" /></svg>;
    }
    return <span className={`${common} size-10 rounded-full bg-lab-oliveDeep/80`} aria-hidden="true" />;
}

function IconBase({ children }: { children: React.ReactNode }) {
    return <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function ArrowRightIcon() { return <IconBase><path d="M5 12h14M13 5l7 7-7 7" /></IconBase>; }
function MenuIcon() { return <IconBase><path d="M4 7h16M4 12h16M4 17h16" /></IconBase>; }
function XIcon() { return <IconBase><path d="M18 6 6 18M6 6l12 12" /></IconBase>; }
function SearchIcon() { return <IconBase><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>; }
function BookIcon() { return <IconBase><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z" /></IconBase>; }
function PencilIcon() { return <IconBase><path d="m18 2 4 4-13 13-5 1 1-5Z" /><path d="M15 5 19 9" /></IconBase>; }
function BadgeIcon() { return <IconBase><path d="M12 3 15 9l6 1-4.5 4.5 1 6.5L12 18l-5.5 3 1-6.5L3 10l6-1Z" /></IconBase>; }
function GrowthIcon() { return <IconBase><path d="M4 16 9 11l4 4 7-8" /><path d="M15 7h5v5" /></IconBase>; }
function BrainIcon() { return <IconBase><path d="M9 9a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3" /><path d="M15 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3" /></IconBase>; }
function CodeIcon() { return <IconBase><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></IconBase>; }
function CameraIcon() { return <IconBase><path d="M15 10 20 7v10l-5-3Z" /><rect x="3" y="6" width="12" height="12" rx="2" /></IconBase>; }
function LockIcon() { return <IconBase><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></IconBase>; }
function CheckIcon() { return <svg className="mt-1 size-4 flex-none" viewBox="0 0 20 20" fill="none" stroke="#0B453F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>; }
