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
    image: string;
    alt: string;
};
type CinematicChapter = {
    step: string;
    title: string;
    eyebrow: string;
    copy: string;
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
        image: '/screenshots/missions/ml-trainer.webp',
        alt: 'AI en data missievoorbeeld in DGSkills',
    },
    {
        title: 'Design & Create',
        icon: <PencilIcon />,
        color: '#E49A73',
        bullets: ['Grafisch ontwerp', 'UI/UX design', 'Animatie & video'],
        projects: '18 projecten',
        image: '/screenshots/missions/brand-builder.webp',
        alt: 'Design en creatie missievoorbeeld in DGSkills',
    },
    {
        title: 'Code & Bouw',
        icon: <CodeIcon />,
        color: '#9DCBBC',
        bullets: ['Web development', 'App development', 'Games maken'],
        projects: '24 projecten',
        image: '/screenshots/mission-game-programmeur.webp',
        alt: 'Game Programmeur missievoorbeeld in DGSkills',
    },
    {
        title: 'Media & Verhaal',
        icon: <CameraIcon />,
        color: '#C996A7',
        bullets: ['Video editen', 'Podcast maken', 'Storytelling'],
        projects: '16 projecten',
        image: '/screenshots/missions/digital-storyteller.webp',
        alt: 'Media en verhaal missievoorbeeld in DGSkills',
    },
    {
        title: 'Online veiligheid',
        icon: <LockIcon />,
        color: '#DBC95D',
        bullets: ['Privacy & security', 'Cyber awareness', 'Verantwoord online'],
        projects: '8 projecten',
        image: '/screenshots/ict-privacy.webp',
        alt: 'Online veiligheid en privacy voorbeeld in DGSkills',
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
    { label: 'Veilig', value: 'AVG-bewust en AI Act-bewust' },
] as const;

const cinematicChapters: CinematicChapter[] = [
    {
        step: '01',
        title: 'Ontdek',
        eyebrow: 'Start je route',
        copy: 'Leerlingen kiezen een leerlijn, zien direct de AI-missies en starten vanuit hun eigen niveau.',
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
        image: '/screenshots/student-progress-xp.webp',
        alt: 'DGSkills voortgangsscherm met XP, level en trofeeën',
        accent: '#5F947D',
        icon: <BadgeIcon />,
        stat: 'XP',
        statLabel: 'groeit mee',
    },
    {
        step: '05',
        title: 'Deel',
        eyebrow: 'Portfolio verhaal',
        copy: 'Aan het einde staat er geen losse score, maar een portfolio waarmee leerlingen laten zien wat ze kunnen.',
        image: '/screenshots/student-dashboard.webp',
        alt: 'DGSkills student dashboard als portfolio-overzicht',
        accent: '#08283B',
        icon: <SendIcon />,
        stat: '1',
        statLabel: 'eigen portfolio',
    },
];

function trackLandingEvent(event: string, data?: Record<string, unknown>) {
    void import('../services/analyticsService')
        .then(({ trackEvent }) => trackEvent(event, data))
        .catch(() => {
            // Analytics should never block interaction.
        });
}

export const ScholenLanding: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reduceMotion = usePrefersReducedMotion();

    useHomepageGsapEffects(reduceMotion);

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
                            <h1 className="w-full max-w-[22rem] text-[2.1rem] font-black leading-[1.06] text-lab-ink sm:max-w-[780px] sm:text-6xl lg:text-[4.45rem]">
                                <span className="block sm:hidden"><span className="relative inline-block"><TitleSpark />M</span>aak digitale</span>
                                <span className="block sm:hidden">geletterdheid</span>
                                <span className="hidden sm:block"><span className="relative inline-block"><TitleSpark />M</span>aak digitale geletterdheid</span>
                                <span className="block sm:hidden">tastbaar,</span>
                                <span className="block sm:hidden">motiverend</span>
                                <span className="block sm:hidden">en <span className="relative inline-block text-lab-oliveDeep">aantoonbaar<Underline /></span>.</span>
                                <span className="hidden sm:block">tastbaar, motiverend</span>
                                <span className="hidden sm:block">en <span className="relative inline-block text-lab-oliveDeep">aantoonbaar<Underline /></span>.</span>
                            </h1>
                            <p className="mt-7 w-full max-w-[22rem] break-words text-pretty text-base font-semibold leading-7 text-lab-mutedDeep sm:mt-8 sm:max-w-md sm:text-lg sm:leading-8 md:max-w-[640px]">
                                De missiegedreven leeromgeving voor VO en VSO die aansluit op de nieuwste SLO-kerndoelen. Van AI-geletterdheid tot online veiligheid — leerlingen leren door te doen, docenten zien voortgang per kerndoel.
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
                            <div className="mt-8 flex max-w-[420px] flex-wrap items-center gap-2 text-xs font-black text-lab-tealDark sm:max-w-none">
                                {['20+ AI-missies', 'SLO-proof', 'AVG-bewust', 'AI Act-bewust'].map((label) => (
                                    <span key={label} className="rounded-full border border-[#D7C95F] bg-white/72 px-3 py-2 shadow-sm shadow-lab-ink/5">
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <dl className="mt-7 grid max-w-[760px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {heroProofItems.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-lab-line bg-lab-paper/82 px-4 py-3 shadow-sm shadow-lab-ink/5">
                                        <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-lab-sage">{item.label}</dt>
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

                <CinematicSkillJourney reduceMotion={reduceMotion} />

                <section id="skills" className="relative scroll-mt-24 overflow-hidden bg-lab-paper px-5 py-20 md:px-10">
                    <Doodle className="right-4 top-8 hidden text-lab-sage/70 lg:block" variant="leaf" />

                    <div className="pointer-events-none absolute right-36 top-10 z-10 hidden lg:block xl:right-52">
                        <img
                            src="/assets/storytelling/beaver-storyteller.webp"
                            alt="Bevermentor wijst naar de skillvoorbeelden"
                            className="w-20 -rotate-6 opacity-90 drop-shadow-md xl:w-24"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="mx-auto max-w-5xl">
                        <div className="relative mb-10">
                            <Reveal>
                                <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Ontdek jouw favoriete skills</h2>
                                <Squiggle color={C.coral} />
                                <p className="mt-5 max-w-2xl text-pretty text-base font-semibold leading-7 text-lab-muted">
                                    Elke skill krijgt een zichtbaar voorbeeld: van een AI-tool bouwen tot een game ontwerpen of veilig online werken.
                                </p>
                            </Reveal>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                            {skills.map((skill, index) => (
                                <Reveal key={skill.title} delay={index * 0.06} y={30} className="skill-card-motion overflow-hidden rounded-[28px] bg-white shadow-lg shadow-lab-ink/8 ring-1 ring-lab-line/80">
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
                                    </div>
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

                <section className="relative bg-lab-tealDark px-5 pb-12 pt-20 text-white md:px-10 md:pt-24">
                    <WaveTop color={C.cream} dark />
                    <Reveal className="footer-cta-motion relative z-10 mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="hidden h-40 w-32 flex-none items-center justify-center md:flex" aria-hidden="true">
                            <img src="/assets/storytelling/beaver-storyteller.webp" alt="" className="max-h-36 w-auto object-contain opacity-90 drop-shadow-2xl" loading="lazy" decoding="async" />
                        </div>
                        <div className="relative">
                            <div>
                                <h2 className="text-balance text-4xl font-black leading-tight md:text-5xl">Klaar om iets <span className="text-lab-gold">tofs</span> te maken?</h2>
                                <p className="mt-3 text-sm font-semibold text-white/78">Plan een schoolpilot en ontdek welke route past bij jouw leerlingen.</p>
                            </div>
                        </div>
                        <a href="/pilot" onClick={startPilot} className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-lab-gold px-8 py-4 text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">
                            Plan mijn pilot
                            <ArrowRightIcon />
                        </a>
                    </Reveal>
                    <footer className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-col gap-6 border-t border-white/10 pt-7 text-sm font-semibold text-white/75">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <a href="/" className="inline-flex min-h-[44px] items-center rounded px-1 py-2 font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">dgskills.app</a>
                            <div className="flex flex-wrap gap-6">
                                <button onClick={() => scrollTo('journey')} className="rounded min-h-[44px] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Hoe het werkt</button>
                                <a href="/ict/privacy/cookies" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Cookies</a>
                                <a href="/ict/privacy/policy" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Privacy</a>
                                <a href="/ict/privacy/ai" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">AI-transparantie</a>
                                <a href="mailto:info@dgskills.app" className="inline-flex min-h-[44px] items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-gold focus-visible:ring-offset-lab-tealDark">Contact</a>
                            </div>
                            <p>Zin om samen te werken?</p>
                        </div>
                        <p className="text-sm text-white/70">Eenmanszaak Yorin Vonder · KvK 81819889 · info@dgskills.app</p>
                    </footer>
                </section>
            </main>
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

function CinematicSkillJourney({ reduceMotion }: { reduceMotion: boolean }) {
    const [active, setActive] = useState(0);
    const [isLgMotion, setIsLgMotion] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);
    const pinRef = useRef<HTMLDivElement | null>(null);
    const mockupRef = useRef<HTMLDivElement | null>(null);
    const orbitRef = useRef<HTMLDivElement | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const chapterRefs = useRef<Array<HTMLLIElement | null>>([]);
    const screenRefs = useRef<Array<HTMLElement | null>>([]);
    const floatRefs = useRef<Array<HTMLDivElement | null>>([]);
    const activeRef = useRef(0);

    const setActiveChapter = (index: number) => {
        const next = Math.max(0, Math.min(cinematicChapters.length - 1, index));
        if (activeRef.current === next) return;
        activeRef.current = next;
        setActive(next);
    };

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)');
        const update = () => setIsLgMotion(!reduceMotion && mql.matches);
        update();
        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, [reduceMotion]);

    useEffect(() => {
        if (!reduceMotion && typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) return;

        const elements = chapterRefs.current.filter(Boolean) as HTMLLIElement[];
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!visible) return;
                const index = Number((visible.target as HTMLElement).dataset.chapterIndex ?? 0);
                setActiveChapter(index);
            },
            { rootMargin: '-34% 0px -42% 0px', threshold: [0.28, 0.5, 0.72] }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [reduceMotion]);

    useEffect(() => {
        if (reduceMotion || typeof window === 'undefined') return;

        let cancelled = false;
        let ctx: { revert: () => void } | undefined;

        void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
            .then(([gsapModule, scrollTriggerModule]) => {
                if (cancelled || !sectionRef.current || !pinRef.current || !mockupRef.current) return;
                if (!window.matchMedia('(min-width: 1024px)').matches) return;

                const { gsap } = gsapModule;
                const { ScrollTrigger } = scrollTriggerModule;
                gsap.registerPlugin(ScrollTrigger);

                ctx = gsap.context(() => {
                    const screens = screenRefs.current.filter(Boolean) as HTMLElement[];
                    const floaters = floatRefs.current.filter(Boolean) as HTMLDivElement[];
                    const lastIndex = cinematicChapters.length - 1;

                    gsap.set(screens, {
                        autoAlpha: 0,
                        y: 46,
                        scale: 0.92,
                        rotation: 4,
                        transformOrigin: '50% 50%',
                    });
                    gsap.set(screens[0], { autoAlpha: 1, y: 0, scale: 1, rotation: 0 });
                    gsap.set(progressRef.current, { scaleY: 0.08, transformOrigin: 'center top' });
                    gsap.set(orbitRef.current, { rotation: -10, transformOrigin: '50% 50%' });
                    gsap.set(floaters, { transformOrigin: '50% 50%' });

                    const tl = gsap.timeline({
                        defaults: { ease: 'none' },
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 0.85,
                            pin: pinRef.current,
                            pinSpacing: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setActiveChapter(Math.round(self.progress * lastIndex));
                            },
                        },
                    });

                    tl.to(progressRef.current, { scaleY: 1, duration: lastIndex }, 0)
                        .to(orbitRef.current, { rotation: 48, duration: lastIndex }, 0)
                        .to(mockupRef.current, { y: -6, scale: 1.008, rotation: -0.5, duration: 0.75 }, 0);

                    for (let index = 1; index < cinematicChapters.length; index += 1) {
                        const position = index;
                        tl.to(screens[index - 1], { autoAlpha: 0, y: -42, scale: 0.94, rotation: -4, duration: 0.55, ease: 'power1.inOut' }, position - 0.28)
                            .fromTo(screens[index], { autoAlpha: 0, y: 48, scale: 0.92, rotation: 5 }, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.62, ease: 'power2.out' }, position - 0.18)
                            .to(mockupRef.current, { x: [-8, 10, -9, 11][index - 1] ?? 0, y: [-6, -2, -8, -4][index - 1] ?? 0, rotation: [-0.8, 0.7, -0.6, 0.7][index - 1] ?? 0, scale: [1.014, 1.008, 1.016, 1.01][index - 1] ?? 1, duration: 0.7, ease: 'power1.inOut' }, position - 0.28)
                            .to(floaters, { x: (floatIndex: number) => [18, -16, 10][floatIndex] ?? 0, y: (floatIndex: number) => [-18, 14, -10][floatIndex] ?? 0, rotation: (floatIndex: number) => [2.5, -2, 1.4][floatIndex] ?? 0, duration: 0.7, ease: 'power1.inOut' }, position - 0.25);
                    }
                }, sectionRef.current);

                window.setTimeout(() => ScrollTrigger.refresh(), 200);
            })
            .catch(() => {
                // Keep the static journey usable if the animation layer cannot load.
            });

        return () => {
            cancelled = true;
            ctx?.revert();
        };
    }, [reduceMotion]);

    return (
        <section
            id="journey"
            ref={sectionRef}
            className={`relative scroll-mt-24 overflow-x-clip bg-lab-paper px-5 md:px-10 ${reduceMotion ? 'py-20' : 'py-16 lg:min-h-[520vh] lg:py-0'}`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,201,95,0.16),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(95,148,125,0.16),transparent_28%),linear-gradient(180deg,#FFFDF7_0%,#FCF6EA_100%)]" aria-hidden="true" />
            <div ref={pinRef} className={`relative z-10 mx-auto grid max-w-5xl gap-10 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-center ${reduceMotion ? '' : 'lg:h-[100svh] lg:py-[clamp(24px,4svh,48px)]'}`}>
                <div className="order-2 lg:order-1 lg:grid lg:h-[calc(100svh-96px)] lg:grid-rows-[auto_minmax(0,1fr)] lg:self-center">
                    <Reveal>
                        <div className="relative max-w-[430px] pr-24">
                            <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl lg:text-[3.35rem]">
                                Jouw skill journey
                            </h2>
                            <img
                                src="/assets/storytelling/beaver-storyteller.webp"
                                alt="Bevermentor wijst naar de route"
                                className="hidden w-20 -rotate-6 drop-shadow-md lg:absolute lg:right-0 lg:top-1/2 lg:block lg:-translate-y-1/2"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="mt-3">
                                <Squiggle color={C.ink} />
                            </div>
                        </div>
                    </Reveal>

                    <ol className="relative mt-8 space-y-4 lg:mt-0 lg:h-full lg:min-h-[520px] lg:space-y-0">
                        <div className="absolute bottom-8 left-7 top-8 w-0.5 rounded-full bg-lab-line" aria-hidden="true" />
                        <div ref={progressRef} className="absolute bottom-8 left-7 top-8 w-0.5 rounded-full bg-lab-coral" aria-hidden="true" />
                        {cinematicChapters.map((chapter, index) => {
                            const isActive = active === index;
                            const iconIsLight = chapter.accent === C.ink;
                            const chapterOffset = index - active;
                            const absoluteChapterOffset = Math.abs(chapterOffset);
                            const isUpcomingPreview = chapterOffset === 1;
                            return (
                                <li
                                    key={chapter.title}
                                    ref={(node) => {
                                        chapterRefs.current[index] = node;
                                    }}
                                    data-chapter-index={index}
                                    aria-current={isActive ? 'step' : undefined}
                                    className={`relative grid grid-cols-[3.5rem_1fr] gap-4 rounded-[28px] p-3 transition-[background-color,box-shadow,opacity] duration-500 md:p-4 lg:absolute lg:left-0 lg:right-0 lg:top-1/2 lg:origin-center lg:[transform:translate3d(0,var(--journey-card-y),0)_translateY(-50%)_scale(var(--journey-card-scale))] lg:will-change-transform ${isActive ? 'z-20 bg-white shadow-xl shadow-lab-ink/10 ring-1 ring-lab-line' : isUpcomingPreview ? 'z-10 bg-white/45 lg:opacity-[0.5]' : 'z-0 bg-white/25 lg:pointer-events-none lg:opacity-0'}`}
                                    style={{
                                        '--journey-card-y': `calc(${chapterOffset * 176}px - clamp(72px, 7svh, 96px))`,
                                        '--journey-card-scale': isActive ? '1' : absoluteChapterOffset === 1 ? '0.94' : '0.88',
                                    } as React.CSSProperties}
                                >
                                    <div
                                        className="relative z-10 grid size-14 place-items-center rounded-full border-4 border-lab-paper shadow-md shadow-lab-ink/10 transition-transform duration-300"
                                        style={{ backgroundColor: isActive ? chapter.accent : '#FCF6EA', color: isActive && iconIsLight ? '#FFFFFF' : '#08283B', transform: isActive ? 'scale(1.06)' : 'scale(1)' }}
                                    >
                                        {chapter.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-xs font-black text-lab-oliveDeep">{chapter.step}</span>
                                            <span className="rounded-full bg-lab-cream px-3 py-1 text-xs font-black uppercase tracking-wide text-lab-sage">{chapter.eyebrow}</span>
                                        </div>
                                        <h3 className={`mt-2 font-black leading-tight text-lab-ink ${isActive ? 'text-2xl' : 'text-xl'}`}>{chapter.title}</h3>
                                        <p className={`mt-2 max-w-[460px] text-pretty text-sm font-semibold leading-6 text-lab-muted md:text-base md:leading-7 ${isActive ? 'lg:block' : 'lg:line-clamp-3'}`}>{chapter.copy}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="order-1 lg:order-2 lg:flex lg:h-[calc(100svh-96px)] lg:items-center lg:justify-center">
                    <div ref={mockupRef} data-cinematic-mockup className="relative mx-auto w-full max-w-[720px] lg:w-full lg:max-w-[820px] xl:max-w-[880px] 2xl:max-w-[930px]">
                        <div ref={orbitRef} className="absolute -inset-8 rounded-[38%_62%_46%_54%/52%_43%_57%_48%] border border-dashed border-lab-oliveDeep/45" aria-hidden="true" />
                        <div className="absolute -left-4 top-10 size-16 rounded-full bg-lab-gold/75 shadow-xl shadow-lab-ink/10" aria-hidden="true" />
                        <div className="absolute -right-3 bottom-12 size-20 rounded-[42%_58%_44%_56%] bg-[#5F947D]/70 shadow-xl shadow-lab-ink/10" aria-hidden="true" />
                        <div className="relative overflow-hidden rounded-[34px] bg-lab-ink p-3 shadow-2xl shadow-lab-ink/20">
                            <div className="overflow-hidden rounded-[24px] bg-lab-paper">
                                <div className="flex h-11 items-center gap-2 border-b border-lab-line bg-white px-4">
                                    <span className="size-3 rounded-full bg-lab-coral" />
                                    <span className="size-3 rounded-full bg-lab-gold" />
                                    <span className="size-3 rounded-full bg-lab-sage" />
                                    <span className="ml-4 rounded-full bg-lab-cream px-4 py-1 text-xs font-black text-lab-muted">dgskills.app/journey</span>
                                </div>
                                <div className="relative h-[250px] bg-[#FCF6EA] sm:h-[330px] lg:h-[42svh] lg:max-h-[460px] lg:min-h-[320px]">
                                    {cinematicChapters.map((chapter, index) => {
                                        const isGameStudio = chapter.title === 'Maak';
                                        return (
                                            <div
                                                key={chapter.title}
                                                ref={(node) => {
                                                    screenRefs.current[index] = node;
                                                }}
                                                aria-hidden={active !== index}
                                                className={`absolute inset-0 h-full w-full ${isLgMotion ? '' : `transition-opacity duration-300 ${active === index ? 'opacity-100' : 'opacity-0'}`}`}
                                            >
                                                {isGameStudio ? (
                                                    <GameStudioScreen reduceMotion={reduceMotion} ariaLabel={chapter.alt} />
                                                ) : (
                                                    <img
                                                        src={chapter.image}
                                                        alt={chapter.alt}
                                                        className="h-full w-full object-contain"
                                                        loading={index === 0 ? 'eager' : 'lazy'}
                                                        decoding="async"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div
                            ref={(node) => {
                                floatRefs.current[0] = node;
                            }}
                            className="absolute -left-2 bottom-8 rounded-3xl bg-white/95 p-4 shadow-xl shadow-lab-ink/14 ring-1 ring-lab-line sm:-left-7 sm:p-5"
                        >
                            <p className="text-xs font-black uppercase text-lab-sage">Nu actief</p>
                            <p className="mt-1 text-2xl font-black text-lab-ink">{cinematicChapters[active].title}</p>
                        </div>
                        <div
                            ref={(node) => {
                                floatRefs.current[1] = node;
                            }}
                            className="absolute -right-2 top-12 hidden rounded-3xl bg-white/95 p-5 shadow-xl shadow-lab-ink/14 ring-1 ring-lab-line sm:block"
                        >
                            <p className="text-xs font-black text-lab-muted">{cinematicChapters[active].statLabel}</p>
                            <p className="mt-1 text-3xl font-black text-lab-ink">{cinematicChapters[active].stat}</p>
                        </div>
                        <div
                            ref={(node) => {
                                floatRefs.current[2] = node;
                            }}
                            className="absolute bottom-[-22px] right-10 rounded-full px-5 py-3 text-sm font-black text-white shadow-xl shadow-lab-ink/15"
                            style={{ backgroundColor: cinematicChapters[active].accent }}
                        >
                            {cinematicChapters[active].eyebrow}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function GameStudioScreen({ reduceMotion, ariaLabel }: { reduceMotion: boolean; ariaLabel: string }) {
    const floatAnimation = reduceMotion ? undefined : 'dg-game-float 6s ease-in-out infinite';
    const pulseAnimation = reduceMotion ? undefined : 'dg-game-pulse 2.8s ease-in-out infinite';
    const driftAnimation = reduceMotion ? undefined : 'dg-game-drift 7s ease-in-out infinite';

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            className="relative h-full w-full overflow-hidden bg-[#08283B] text-white"
        >
            <style>
                {`
                    @keyframes dg-game-float {
                        0%, 100% { transform: translate3d(0, 0, 0); }
                        50% { transform: translate3d(0, -8px, 0); }
                    }
                    @keyframes dg-game-pulse {
                        0%, 100% { opacity: .68; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.08); }
                    }
                    @keyframes dg-game-drift {
                        0%, 100% { transform: translate3d(-4px, 0, 0); }
                        50% { transform: translate3d(8px, -4px, 0); }
                    }
                `}
            </style>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(217,120,72,0.45),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(215,201,95,0.34),transparent_24%),radial-gradient(circle_at_58%_88%,rgba(95,148,125,0.46),transparent_34%),linear-gradient(135deg,#102D43_0%,#081C2A_56%,#163D37_100%)]" />
            <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent)]" />
            <div className="absolute left-5 top-4 hidden items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#F3E4CB] ring-1 ring-white/14 sm:flex">
                <span className="size-2 rounded-full bg-lab-gold" style={{ animation: pulseAnimation }} />
                Live maker lab
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-lab-coral px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-lab-coral/30 sm:right-5">
                +180 XP
            </div>

            <div className="relative z-10 grid h-full grid-cols-1 gap-3 p-4 sm:grid-cols-[1.04fr_0.96fr] sm:gap-4 sm:p-5 lg:p-6">
                <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] bg-[#F9F4E8] text-lab-ink shadow-2xl shadow-black/25 ring-1 ring-white/20" style={{ animation: floatAnimation }}>
                        <div className="flex items-center justify-between border-b border-lab-line bg-white/82 px-4 py-2">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-lab-coral">Platformer</p>
                                <p className="text-sm font-black leading-tight sm:text-base">Maak je eigen game</p>
                            </div>
                            <div className="rounded-full bg-lab-ink px-2.5 py-1 text-[10px] font-black text-white">Score 420</div>
                        </div>
                        <div className="relative h-[calc(100%-54px)] overflow-hidden bg-[linear-gradient(180deg,#8ED5F2_0%,#DDF5F2_56%,#86C66B_57%,#5F947D_100%)]">
                            <div className="absolute left-5 top-7 h-6 w-16 rounded-full bg-white/72 blur-[1px]" style={{ animation: driftAnimation }} />
                            <div className="absolute right-10 top-10 h-5 w-20 rounded-full bg-white/58 blur-[1px]" />
                            <div className="absolute bottom-[30%] left-[44%] h-4 w-16 rounded-md bg-lab-oliveDeep shadow-md shadow-lab-ink/15" />
                            <div className="absolute bottom-[48%] right-[16%] h-4 w-20 rounded-md bg-lab-gold shadow-md shadow-lab-ink/15" />
                            <div className="absolute bottom-[20%] left-[13%] grid size-9 place-items-center rounded-lg bg-lab-coral shadow-xl shadow-lab-ink/20">
                                <span className="size-4 rounded-full bg-white" />
                            </div>
                            <div className="absolute bottom-[22%] right-[22%] size-8 rounded-md bg-lab-ink shadow-lg shadow-lab-ink/20">
                                <span className="absolute left-2 top-2 size-1.5 rounded-full bg-white" />
                                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 h-[18%] w-full bg-[#7A5A3D]" />
                            <div className="absolute bottom-[18%] left-0 h-3 w-full bg-lab-sage" />
                            <div className="absolute bottom-3 left-3 w-[42%] rounded-xl bg-white/94 p-2 shadow-xl shadow-lab-ink/18 ring-1 ring-lab-ink/10">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-lab-gold" />
                                    <p className="truncate text-[11px] font-black uppercase tracking-wide text-lab-ink">AI Tekengame</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg viewBox="0 0 48 34" className="h-8 w-11 flex-none" aria-hidden="true">
                                        <rect x="13" y="12" width="20" height="16" rx="6" fill="#5F947D" stroke="#08283B" strokeWidth="2.4" />
                                        <circle cx="20" cy="21" r="1.8" fill="#08283B" />
                                        <circle cx="27" cy="21" r="1.8" fill="#08283B" />
                                        <path d="M23 12V5" stroke="#08283B" strokeWidth="2.4" strokeLinecap="round" />
                                        <circle cx="23" cy="4" r="3" fill="#D97848" />
                                    </svg>
                                    <p className="min-w-0 text-[10px] font-black leading-tight text-lab-muted">AI raadt je tekening</p>
                                </div>
                            </div>
                            <div className="absolute bottom-3 right-3 w-[39%] rounded-xl bg-[#08283B]/94 p-2 text-white shadow-xl shadow-lab-ink/22 ring-1 ring-white/15">
                                <div className="mb-2 flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-[#D97848]" />
                                    <p className="truncate text-[11px] font-black uppercase tracking-wide">Prompt Boss</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full rounded-full bg-lab-gold" />
                                    <div className="h-1.5 w-4/5 rounded-full bg-white/35" />
                                    <div className="h-1.5 w-3/5 rounded-full bg-[#5F947D]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
                    <div className="min-h-0 flex-[0.95] rounded-[18px] bg-white/12 p-3 shadow-xl shadow-black/20 ring-1 ring-white/14 backdrop-blur" style={{ animation: reduceMotion ? undefined : 'dg-game-float 7s ease-in-out infinite 0.7s' }}>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-wide text-[#F3E4CB]">Robot route</p>
                            <span className="rounded-full bg-[#5F947D] px-2 py-1 text-[10px] font-black text-lab-ink">Level 3</span>
                        </div>
                        <div className="grid h-[calc(100%-30px)] grid-cols-5 gap-1 rounded-xl bg-[#071A26] p-2">
                            {Array.from({ length: 20 }).map((_, index) => {
                                const isPath = [0, 1, 6, 11, 12, 13, 18, 19].includes(index);
                                const isBot = index === 11;
                                const isGoal = index === 19;
                                return (
                                    <div key={index} className={`relative rounded-md ${isPath ? 'bg-lab-gold/80' : 'bg-white/10'}`}>
                                        {isBot && <span className="absolute inset-1 rounded-md bg-lab-coral shadow-lg shadow-lab-coral/40" />}
                                        {isGoal && <span className="absolute inset-1 rounded-full bg-[#5F947D] shadow-lg shadow-[#5F947D]/40" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] bg-lab-paper p-3 text-lab-ink shadow-2xl shadow-black/20 ring-1 ring-white/20">
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wide text-lab-sage">Game gallery</p>
                                <p className="text-sm font-black leading-tight sm:text-base">Remix je missie</p>
                            </div>
                            <span className="rounded-full bg-lab-cream px-2.5 py-1 text-[10px] font-black text-lab-coral">4 klaar</span>
                        </div>
                        <div className="grid h-[calc(100%-48px)] grid-cols-2 gap-2">
                            {[
                                ['Race', '#D97848'],
                                ['Maze', '#5F947D'],
                                ['Quiz', '#D7C95F'],
                                ['Story', '#C996A7'],
                            ].map(([name, color], index) => (
                                <div key={name} className="relative overflow-hidden rounded-xl bg-lab-creamDeep p-2">
                                    <div className="absolute -right-3 -top-3 size-10 rounded-full opacity-75" style={{ backgroundColor: color }} />
                                    <div className="relative flex h-full flex-col justify-end">
                                        <div className="mb-auto h-2 w-10 rounded-full bg-lab-ink/15" />
                                        <p className="text-xs font-black leading-none">{name}</p>
                                        <p className="mt-1 text-[9px] font-black uppercase tracking-wide text-lab-muted">playtest 0{index + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const gamePrompts = [
    {
        name: 'Stroomroute 01',
        sky: '#A8D8C8',
        pipe: '#6B4A2A',
        bird: '#D97848',
        accent: '#D7C95F',
    },
    {
        name: 'Snelle stroom',
        sky: '#8BCFBE',
        pipe: '#5A3E1C',
        bird: '#C9895B',
        accent: '#A7E8D4',
    },
    {
        name: 'Avondrivier',
        sky: '#173B55',
        pipe: '#2E1A08',
        bird: '#D7C95F',
        accent: '#D7C95F',
    },
    {
        name: 'Leerdoel-stroom',
        sky: '#C8E8D8',
        pipe: '#7B5234',
        bird: '#D97848',
        accent: '#0B453F',
    },
    {
        name: 'Eindbaas: rapids',
        sky: '#08283B',
        pipe: '#4A3010',
        bird: '#C9895B',
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

        if (result.ok) {
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
                        <p className="mt-2 text-xs font-bold text-lab-coral" role="alert">{errorText}</p>
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
                        <p className="text-xs font-black uppercase text-lab-sage">Live preview</p>
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

function PlayableBeaverStream({ active, reduceMotion, config }: { active: typeof gamePrompts[number]; reduceMotion: boolean; config: GameConfig }) {
    const gateColor = config.pipeColor ?? active.pipe;
    const beaverColor = config.beaverColor ?? active.bird;
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
            gatesRef.current = [];
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
                // Vary the gap-top within bounds that respect the configured gap size
                // so the gate always fits inside the playable area (0–88%).
                const maxGapTop = Math.max(8, 88 - cfg.gateGap - BEAVER_H);
                const minGapTop = 8;
                gatesRef.current.push({
                    id: Date.now() + Math.random(),
                    x: Math.max(110, (last?.x ?? 100) + cfg.gateInterval),
                    gapTop: minGapTop + Math.random() * Math.max(0, maxGapTop - minGapTop),
                    passed: false,
                });
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
                    <p className="text-[10px] font-black uppercase tracking-wide text-lab-coral">Leerdoel</p>
                    <p className="mt-0.5 text-xs font-black leading-snug text-lab-ink">Testen, aanpassen en uitleggen waarom de game beter wordt.</p>
                </div>
            </div>

            {gameState === 'over' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-lab-ink/40 backdrop-blur-[2px]">
                    <div className="rounded-2xl bg-lab-paper px-6 py-5 text-center shadow-2xl">
                        <p className="text-xs font-black uppercase tracking-wide text-lab-coral">Game over</p>
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
        },
        {
            kicker: 'Trofeeën',
            title: 'Trofeeën maken groei zichtbaar.',
            copy: 'Leerlingen zien wat ze al beheersen en welke volgende stap logisch is.',
            image: '/screenshots/student-progress-xp-1200.webp',
            alt: 'DGSkills voortgangsscherm met XP, level en trofeeën',
        },
        {
            kicker: 'Portfolio',
            title: 'Projecten worden bewijsstukken.',
            copy: 'Een portfolio vertelt wat iemand gemaakt heeft, welke keuzes zijn gemaakt en welke skills daarbij horen.',
            image: '/screenshots/student-dashboard.webp',
            alt: 'DGSkills leerlingdashboard als portfolio-overzicht',
        },
        {
            kicker: 'Docent',
            title: 'De docent ziet waar groei zit.',
            copy: 'Voor scholen wordt zichtbaar waar een leerling sterk op scoort, waar extra uitleg nodig is en welke SLO-doelen geraakt worden.',
            image: '/screenshots/ict-privacy.webp',
            alt: 'DGSkills school- en privacydashboard voor verantwoord gebruik',
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
            className={`relative scroll-mt-24 px-5 py-20 md:px-10 ${reduceMotion ? '' : 'lg:min-h-[420svh] lg:py-0'}`}
        >
            <div className={`mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.72fr_1.28fr] ${reduceMotion ? 'lg:items-start' : 'lg:sticky lg:top-20 lg:h-[calc(100svh-80px)] lg:items-center'}`}>
                <Reveal className="lg:h-fit lg:self-center">
                    <h2 className="text-balance text-4xl font-black leading-tight text-lab-ink md:text-5xl">Jouw portfolio. Jouw verhaal.</h2>
                    <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-7 text-lab-muted">
                        Scroll door een portfolio dat echt iets vertelt: wie je bent, wat je maakt, welke trofeeën je haalt en waar je nog in groeit.
                    </p>
                    <a href="/pilot" onClick={startPilot} className="mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-lab-gold px-7 py-3 text-sm font-black text-lab-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-ink">
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
                            <div className="flex flex-col justify-center p-7 md:p-9">
                                <p className="text-sm font-black uppercase text-lab-sage">{panel.kicker}</p>
                                <h3 className="mt-3 text-2xl font-black leading-tight text-lab-ink">{panel.title}</h3>
                                <p className="mt-4 text-sm font-semibold leading-7 text-lab-muted">{panel.copy}</p>
                            </div>
                            <div className="relative grid min-h-0 place-items-center overflow-hidden bg-lab-cream p-5">
                                <img src={panel.image} alt={panel.alt} className="max-h-full w-full object-contain" loading="lazy" decoding="async" />
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/92 px-4 py-2 text-xs font-black text-lab-ink shadow-lg shadow-lab-ink/12">
                                    Stap {String(index + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={`space-y-5 ${reduceMotion ? '' : 'lg:hidden'}`}>
                    {panels.map((panel, index) => (
                        <Reveal key={panel.title} delay={index * 0.05} y={34} className="portfolio-story-motion overflow-hidden rounded-[28px] bg-white shadow-xl shadow-lab-ink/8 ring-1 ring-lab-line">
                            <div className="p-6">
                                <p className="text-sm font-black uppercase text-lab-sage">{panel.kicker}</p>
                                <h3 className="mt-3 text-2xl font-black leading-tight text-lab-ink">{panel.title}</h3>
                                <p className="mt-4 text-sm font-semibold leading-7 text-lab-muted">{panel.copy}</p>
                            </div>
                            <div className="relative grid min-h-[220px] place-items-center bg-lab-cream p-4">
                                <img src={panel.image} alt={panel.alt} className="max-h-[280px] w-full object-contain" loading="lazy" decoding="async" />
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
            <div className="absolute inset-x-[18%] bottom-3 h-20 rounded-full bg-lab-ink/10 blur-2xl" aria-hidden="true" />
            <img
                src="/assets/storytelling/hero-students-gameprogrammeur-v3-transparent.webp"
                alt="Twee leerlingen werken achter een laptop aan Game Programmeur in DGSkills"
                className="mx-auto w-full object-contain drop-shadow-[0_30px_48px_rgba(6,31,45,0.16)]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
            />
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
function SendIcon() { return <IconBase><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4Z" /></IconBase>; }
function BrainIcon() { return <IconBase><path d="M9 9a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3" /><path d="M15 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3" /></IconBase>; }
function CodeIcon() { return <IconBase><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></IconBase>; }
function CameraIcon() { return <IconBase><path d="M15 10 20 7v10l-5-3Z" /><rect x="3" y="6" width="12" height="12" rx="2" /></IconBase>; }
function LockIcon() { return <IconBase><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></IconBase>; }
function CheckIcon() { return <svg className="mt-1 size-4 flex-none" viewBox="0 0 20 20" fill="none" stroke="#0B453F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>; }
