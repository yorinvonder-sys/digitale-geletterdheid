import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown,
    ArrowRight,
    BarChart3,
    BookOpenCheck,
    Check,
    CheckCircle2,
    Clock3,
    Code2,
    Eye,
    FileCheck2,
    Gamepad2,
    GraduationCap,
    LayoutDashboard,
    LockKeyhole,
    Menu,
    MousePointer2,
    Palette,
    Play,
    Route,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
    WandSparkles,
    X,
} from 'lucide-react';
import { DuckMark } from '@/components/brand/DuckMark';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MiniMissionBuilder } from '@/features/public-site/story/MiniMissionBuilder';

const LESSON_CHAPTERS = [
    {
        time: '09:00',
        eyebrow: 'Kies',
        title: 'Je les staat al klaar.',
        copy: 'Kies een missie die past bij je klas. Leerdoel, instructie en eindproduct staan op één plek — dus je kunt beginnen zonder zelf een AI-les te ontwerpen.',
        stat: 'Game Programmeur',
        detail: 'Klas 2B · 45 minuten',
    },
    {
        time: '09:05',
        eyebrow: 'Bouw',
        title: 'De klas begint meteen.',
        copy: 'Leerlingen krijgen een concreet doel en maken iets dat reageert. Niet eerst twintig minuten luisteren; leren gebeurt tijdens het bouwen en testen.',
        stat: '24 van 28 actief',
        detail: 'Vier leerlingen lezen de uitleg',
    },
    {
        time: '09:20',
        eyebrow: 'Coach',
        title: 'Jij ziet waar hulp telt.',
        copy: 'Het dashboard laat zien wie doorwerkt, wie opnieuw probeert en waar een denkstap vastloopt. Jij coacht gericht, zonder door dertig tabbladen te jagen.',
        stat: '3 signalen',
        detail: 'Eén leerling vraagt om hulp',
    },
    {
        time: '09:45',
        eyebrow: 'Bewijs',
        title: 'De les eindigt met iets echts.',
        copy: 'Een werkend project, een korte reflectie en zichtbaar bewijs bij het leerdoel. De leerling kan het laten zien; jij hoeft het achteraf niet te reconstrueren.',
        stat: '21 projecten klaar',
        detail: 'SLO 22B · bewijs opgeslagen',
    },
] as const;

const PROJECTS = [
    {
        title: 'Een eigen game',
        label: 'Code & bouw',
        output: 'Speelbaar level met zelfgekozen regels',
        image: '/assets/previews/project_game_programmeur.webp',
        color: '#e1ff01',
        icon: Gamepad2,
    },
    {
        title: 'Een echte website',
        label: 'Design & create',
        output: 'Responsive pagina van schets tot publicatie',
        image: '/assets/previews/project_website_bouwer.webp',
        color: '#f2f1ec',
        icon: LayoutDashboard,
    },
    {
        title: 'Een deepfake-onderzoek',
        label: 'Mediawijsheid',
        output: 'Onderbouwde analyse van beeld en bron',
        image: '/assets/previews/project_deepfake_detector.webp',
        color: '#ff3c21',
        icon: Eye,
    },
    {
        title: 'Een AI-illustratie',
        label: 'AI & data',
        output: 'Iteratief beeld met uitgelegde promptkeuzes',
        image: '/assets/previews/project_ai_tekengame.webp',
        color: '#ffffff',
        icon: WandSparkles,
    },
    {
        title: 'Een digitaal verhaal',
        label: 'Media & verhaal',
        output: 'Interactief verhaal met bewuste vertelkeuzes',
        image: '/assets/previews/project_digital_storyteller.webp',
        color: '#c2c1bd',
        icon: Palette,
    },
] as const;

const SCHOOL_PROOF = [
    {
        title: 'SLO in de missie',
        copy: 'Leerdoelen zijn gekoppeld aan wat leerlingen daadwerkelijk maken.',
        icon: Target,
    },
    {
        title: 'Portfolio als bewijs',
        copy: 'Project, keuzes en reflectie blijven samen zichtbaar.',
        icon: FileCheck2,
    },
    {
        title: 'Vooraf te beoordelen',
        copy: 'Privacy, AI-transparantie en beheer kunnen vóór de pilot langs ICT.',
        icon: ShieldCheck,
    },
    {
        title: 'Klein beginnen',
        copy: 'Start met één klas en bouw verder op wat in jouw school werkt.',
        icon: Route,
    },
] as const;

function useStorySeo() {
    useEffect(() => {
        document.title = 'Digitale geletterdheid die leerlingen bouwen | DGSkills';
        const description = 'Van kant-en-klare missie tot zichtbaar SLO-bewijs: ontdek hoe één DGSkills-les werkt en probeer zelf een mini-missie.';
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content = description;
    }, []);
}

function Reveal({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const reduceMotion = usePrefersReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

function StoryHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-duck-ink/10 bg-duck-bg/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
                <a href="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink">
                    <DuckMark className="size-10 object-contain" />
                    <span className="text-lg font-black tracking-[-0.03em] text-duck-ink">DGSkills</span>
                </a>

                <nav className="hidden items-center gap-7 lg:flex" aria-label="Hoofdnavigatie">
                    <a className="text-sm font-extrabold text-duck-ink/65 transition-colors hover:text-duck-ink" href="#lesverhaal">Zo werkt een les</a>
                    <a className="text-sm font-extrabold text-duck-ink/65 transition-colors hover:text-duck-ink" href="#probeer-het">Probeer het</a>
                    <a className="text-sm font-extrabold text-duck-ink/65 transition-colors hover:text-duck-ink" href="#leerlingwerk">Leerlingwerk</a>
                    <a className="text-sm font-extrabold text-duck-ink/65 transition-colors hover:text-duck-ink" href="#docentbewijs">Voor docenten</a>
                </nav>

                <div className="hidden items-center gap-2 sm:flex">
                    <a href="/login" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-extrabold text-duck-ink hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink">Inloggen</a>
                    <a href="/pilot" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-duck-ink px-5 text-sm font-extrabold text-duck-acid transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2">
                        Plan pilot <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                </div>

                <button
                    type="button"
                    className="grid size-11 place-items-center rounded-full border border-duck-ink/15 sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                    aria-expanded={open}
                    aria-label={open ? 'Menu sluiten' : 'Menu openen'}
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="border-t border-duck-ink/10 bg-duck-bg px-4 py-4 sm:hidden"
                        aria-label="Mobiele navigatie"
                    >
                        <div className="mx-auto grid max-w-7xl gap-1">
                            {[
                                ['Zo werkt een les', '#lesverhaal'],
                                ['Probeer het', '#probeer-het'],
                                ['Leerlingwerk', '#leerlingwerk'],
                                ['Voor docenten', '#docentbewijs'],
                            ].map(([label, href]) => (
                                <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-extrabold text-duck-ink hover:bg-white">{label}</a>
                            ))}
                            <a href="/pilot" className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-duck-ink px-5 text-sm font-extrabold text-duck-acid">Plan pilot</a>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}

function HeroLessonPreview({ reduceMotion }: { reduceMotion: boolean }) {
    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 34, rotate: 1.4 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[620px]"
        >
            <div className="overflow-hidden rounded-[2rem] border-2 border-duck-ink bg-white shadow-[10px_12px_0_#202023]">
                <div className="flex items-center justify-between border-b-2 border-duck-ink px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex size-3" aria-hidden="true">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-duck-error opacity-35 motion-reduce:animate-none" />
                            <span className="relative inline-flex size-3 rounded-full bg-duck-error" />
                        </span>
                        <p className="text-sm font-extrabold text-duck-ink">Live les · Klas 2B</p>
                    </div>
                    <p className="font-mono text-xs font-bold text-duck-ink/45">09:20</p>
                </div>

                <div className="grid gap-0 sm:grid-cols-[1.12fr_0.88fr]">
                    <div className="border-b-2 border-duck-ink bg-duck-ink p-4 sm:border-b-0 sm:border-r-2 sm:p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-acid/60">Wat de leerling ziet</p>
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/15 bg-white">
                            <img
                                src="/assets/agents/game_programmeur_new.webp"
                                alt="Pixelwereld van de missie Game Programmeur"
                                className="aspect-[4/3] w-full object-cover"
                                fetchPriority="high"
                                decoding="async"
                            />
                            <div className="p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-extrabold text-duck-ink">Bouw je eerste level</p>
                                    <span className="rounded-full bg-duck-acid px-2.5 py-1 text-[10px] font-black text-duck-ink">STAP 3/5</span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-duck-gray/35">
                                    <motion.div
                                        className="h-full rounded-full bg-duck-error"
                                        initial={{ width: reduceMotion ? '68%' : '8%' }}
                                        animate={{ width: '68%' }}
                                        transition={{ duration: reduceMotion ? 0 : 1.1, delay: 0.75 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-duck-bg p-4 sm:p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/40">Wat jij ziet</p>
                        <div className="mt-3 space-y-2">
                            {[
                                ['Actief', '24', '#e1ff01'],
                                ['Kijken uitleg', '3', '#ffffff'],
                                ['Hulp nodig', '1', '#ff3c21'],
                            ].map(([label, value, color]) => (
                                <div key={label} className="flex items-center justify-between rounded-xl border border-duck-ink/10 bg-white px-3 py-2.5">
                                    <span className="flex items-center gap-2 text-xs font-bold text-duck-ink/65"><span className="size-2 rounded-full" style={{ backgroundColor: color }} />{label}</span>
                                    <span className="font-display text-2xl leading-none text-duck-ink">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 rounded-xl bg-duck-acid p-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-ink/45">Nieuw signaal</p>
                            <p className="mt-1 text-xs font-extrabold leading-5 text-duck-ink">Leerling 14 probeert stap 2 opnieuw.</p>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.85, x: 14 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -bottom-7 right-3 flex items-center gap-3 rounded-2xl border-2 border-duck-ink bg-duck-acid px-4 py-3 shadow-[5px_6px_0_#202023] sm:-right-5 sm:px-5"
            >
                <span className="grid size-9 place-items-center rounded-full bg-duck-ink text-duck-acid"><Check className="size-5" strokeWidth={3} aria-hidden="true" /></span>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-duck-ink/45">Automatisch zichtbaar</p>
                    <p className="text-sm font-extrabold text-duck-ink">SLO 22B · bewijs</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

function HeroSection() {
    const reduceMotion = usePrefersReducedMotion();

    return (
        <section className="relative overflow-hidden bg-duck-bg px-4 pb-28 pt-32 sm:px-6 md:pb-36 md:pt-40 lg:px-10">
            <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-7xl bg-duck-ink/10" aria-hidden="true" />
            <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
                <div className="relative z-10">
                    <motion.p
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="inline-flex items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-duck-ink"
                    >
                        Digitale geletterdheid voor VO &amp; VSO
                    </motion.p>
                    <motion.h1
                        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-7 text-balance font-display text-[clamp(3.7rem,8.1vw,7.8rem)] leading-[0.88] tracking-[-0.05em] text-duck-ink"
                    >
                        Eén les.<br />Van eerste klik tot <span className="relative inline-block"><span className="relative z-10">zichtbaar bewijs.</span><span className="absolute inset-x-0 bottom-[0.06em] -z-0 h-[0.18em] bg-duck-acid" aria-hidden="true" /></span>
                    </motion.h1>
                    <motion.p
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.18 }}
                        className="mt-7 max-w-xl text-pretty text-base font-semibold leading-7 text-duck-ink/68 sm:text-lg sm:leading-8"
                    >
                        Leerlingen bouwen games, websites en AI-projecten. Jij ziet tijdens de les wie vooruitgaat, waar hulp nodig is en welk leerdoel zichtbaar wordt.
                    </motion.p>
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.28 }}
                        className="mt-9 flex flex-col gap-3 sm:flex-row"
                    >
                        <a href="/pilot" className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-duck-ink px-7 text-base font-extrabold text-duck-acid transition-all hover:-translate-y-0.5 hover:bg-duck-error hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">
                            Plan een schoolpilot <ArrowRight className="size-5" aria-hidden="true" />
                        </a>
                        <a href="#probeer-het" className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white px-7 text-base font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">
                            Probeer de mini-missie <Play className="size-4 fill-current" aria-hidden="true" />
                        </a>
                    </motion.div>
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={reduceMotion ? undefined : { opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-extrabold text-duck-ink/55"
                    >
                        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" aria-hidden="true" /> Kant-en-klare missies</span>
                        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" aria-hidden="true" /> SLO gekoppeld</span>
                        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" aria-hidden="true" /> Start met één klas</span>
                    </motion.div>
                </div>

                <HeroLessonPreview reduceMotion={reduceMotion} />
            </div>

            <a href="#lesverhaal" className="absolute bottom-9 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-duck-ink/45 hover:text-duck-ink md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink">
                Volg de les <ArrowDown className="size-4" aria-hidden="true" />
            </a>
        </section>
    );
}

function LessonStage({ active, compact = false }: { active: number; compact?: boolean }) {
    const chapter = LESSON_CHAPTERS[active];
    const reduceMotion = usePrefersReducedMotion();

    return (
        <div className={`overflow-hidden rounded-[1.8rem] border-2 border-duck-ink bg-white shadow-[7px_8px_0_#202023] ${compact ? 'mt-7' : ''}`}>
            <div className="flex items-center justify-between border-b-2 border-duck-ink px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-duck-error" aria-hidden="true" />
                    <span className="font-mono text-sm font-bold text-duck-ink">{chapter.time}</span>
                </div>
                <span className="rounded-full bg-duck-bg px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-duck-ink/55">Klas 2B · live</span>
            </div>
            <div className="p-4 sm:p-6">
                <div className="flex gap-1.5" aria-label={`Stap ${active + 1} van ${LESSON_CHAPTERS.length}`}>
                    {LESSON_CHAPTERS.map((item, index) => (
                        <span key={item.time} className={`h-1.5 flex-1 rounded-full ${index <= active ? 'bg-duck-error' : 'bg-duck-gray/35'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={chapter.time}
                        initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
                        transition={{ duration: reduceMotion ? 0 : 0.35 }}
                        className="mt-5"
                    >
                        {active === 0 && (
                            <div className="rounded-2xl bg-duck-ink p-5 text-white">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-acid/55">Geselecteerde missie</p>
                                        <h3 className="mt-2 font-display text-3xl leading-none">Game Programmeur</h3>
                                        <p className="mt-2 text-sm font-semibold text-white/55">Computational thinking · SLO 22B</p>
                                    </div>
                                    <span className="grid size-12 place-items-center rounded-xl bg-duck-acid text-duck-ink"><Gamepad2 className="size-6" aria-hidden="true" /></span>
                                </div>
                                <button type="button" tabIndex={-1} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-duck-acid text-sm font-extrabold text-duck-ink">Start met klas 2B <ArrowRight className="size-4" aria-hidden="true" /></button>
                            </div>
                        )}

                        {active === 1 && (
                            <div className="rounded-2xl bg-duck-bg p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/40">Live voortgang</p>
                                        <p className="mt-1 font-display text-4xl leading-none text-duck-ink">24/28</p>
                                    </div>
                                    <span className="rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink">Klas gestart</span>
                                </div>
                                <div className="mt-6 grid grid-cols-7 gap-2" aria-hidden="true">
                                    {Array.from({ length: 28 }, (_, index) => (
                                        <motion.span
                                            key={index}
                                            initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: reduceMotion ? 0 : index * 0.015 }}
                                            className={`aspect-square rounded-md ${index < 24 ? 'bg-duck-ink' : 'border border-duck-ink/15 bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {active === 2 && (
                            <div className="space-y-2.5">
                                {[
                                    ['Leerling 14', 'Probeert stap 2 opnieuw', 'Bekijk'],
                                    ['Leerling 07', 'Leest de uitleg', 'Volgt'],
                                    ['Leerling 19', 'Heeft om hulp gevraagd', 'Help'],
                                ].map(([student, signal, action], index) => (
                                    <div key={student} className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 ${index === 2 ? 'border-duck-error bg-duck-error/[0.07]' : 'border-duck-ink/10 bg-white'}`}>
                                        <div className="min-w-0">
                                            <p className="text-xs font-extrabold text-duck-ink">{student}</p>
                                            <p className="truncate text-[11px] font-semibold text-duck-ink/50">{signal}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${index === 2 ? 'bg-duck-error text-white' : 'bg-duck-bg text-duck-ink'}`}>{action}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {active === 3 && (
                            <div className="rounded-2xl bg-duck-acid p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="grid size-12 place-items-center rounded-full bg-duck-ink text-duck-acid"><Check className="size-6" strokeWidth={3} aria-hidden="true" /></span>
                                    <span className="rounded-full border border-duck-ink/20 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]">Opgeslagen</span>
                                </div>
                                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/45">Lesbewijs</p>
                                <h3 className="mt-1 font-display text-3xl leading-none text-duck-ink">Project + reflectie + SLO</h3>
                                <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-extrabold text-duck-ink">
                                    <span className="rounded-xl bg-white/65 px-3 py-2.5">21 projecten</span>
                                    <span className="rounded-xl bg-white/65 px-3 py-2.5">SLO 22B</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-duck-ink/10 pt-4">
                            <div>
                                <p className="text-sm font-extrabold text-duck-ink">{chapter.stat}</p>
                                <p className="text-xs font-semibold text-duck-ink/48">{chapter.detail}</p>
                            </div>
                            <span className="grid size-9 place-items-center rounded-full bg-duck-ink text-duck-acid"><CheckCircle2 className="size-4" aria-hidden="true" /></span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function LessonStory() {
    const [active, setActive] = useState(0);
    const refs = useRef<Array<HTMLElement | null>>([]);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!visible) return;
                const index = Number((visible.target as HTMLElement).dataset.chapter);
                if (!Number.isNaN(index)) setActive(index);
            },
            { rootMargin: '-30% 0px -42% 0px', threshold: [0.15, 0.35, 0.6] },
        );
        refs.current.forEach((element) => element && observer.observe(element));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="lesverhaal" className="scroll-mt-20 bg-duck-bgLight px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <Reveal className="max-w-4xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-duck-error">Eén doorlopend verhaal</p>
                    <h2 className="mt-4 text-balance font-display text-[clamp(3rem,7vw,6.7rem)] leading-[0.92] tracking-[-0.04em] text-duck-ink">Van lesstart tot bewijs. Zonder verhaalwissel.</h2>
                    <p className="mt-6 max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/65 md:text-lg md:leading-8">Dezelfde missie beweegt mee door de les. Zo ziet de docent niet vier losse functies, maar één werkbare routine.</p>
                </Reveal>

                <div className="mt-16 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
                    <div>
                        {LESSON_CHAPTERS.map((chapter, index) => (
                            <article
                                key={chapter.time}
                                ref={(element) => { refs.current[index] = element; }}
                                data-chapter={index}
                                className="flex min-h-[52vh] flex-col justify-center border-t border-duck-ink/12 py-12 first:border-t-0 lg:min-h-[68vh]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`grid size-10 place-items-center rounded-full text-xs font-black transition-colors ${active === index ? 'bg-duck-error text-white' : 'bg-duck-ink/7 text-duck-ink/50'}`}>{index + 1}</span>
                                    <p className="font-mono text-sm font-bold text-duck-ink/45">{chapter.time} · {chapter.eyebrow}</p>
                                </div>
                                <h3 className="mt-6 text-balance font-display text-[clamp(2.5rem,5vw,4.6rem)] leading-[0.96] tracking-[-0.035em] text-duck-ink">{chapter.title}</h3>
                                <p className="mt-5 max-w-xl text-pretty text-base font-semibold leading-7 text-duck-ink/62">{chapter.copy}</p>
                                <div className="lg:hidden"><LessonStage active={index} compact /></div>
                            </article>
                        ))}
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-28 flex h-[calc(100vh-9rem)] items-center">
                            <div className="w-full"><LessonStage active={active} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProjectGallery() {
    const reduceMotion = usePrefersReducedMotion();

    return (
        <section id="leerlingwerk" className="scroll-mt-20 overflow-hidden bg-duck-ink px-4 py-20 text-white sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
                    <Reveal>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-duck-acid">Wat leerlingen bouwen</p>
                        <h2 className="mt-4 text-balance font-display text-[clamp(3rem,7vw,6.6rem)] leading-[0.9] tracking-[-0.04em]">Geen werkblad. Iets van henzelf.</h2>
                    </Reveal>
                    <Reveal className="max-w-2xl lg:justify-self-end" delay={0.08}>
                        <p className="text-pretty text-base font-semibold leading-7 text-white/62 md:text-lg md:leading-8">Elke missie eindigt in een zichtbaar product. Dat maakt digitale geletterdheid concreet voor de leerling én bespreekbaar voor de docent.</p>
                        <a href="/leerlingdemo" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white px-5 text-sm font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid">Open de leerlingdemo <ArrowRight className="size-4" aria-hidden="true" /></a>
                    </Reveal>
                </div>

                <div className="mt-12 grid auto-cols-[84%] grid-flow-col gap-4 overflow-x-auto pb-5 pr-4 snap-x snap-mandatory md:auto-cols-[46%] lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible lg:pb-0 lg:pr-0">
                    {PROJECTS.map((project, index) => {
                        const Icon = project.icon;
                        return (
                            <motion.article
                                key={project.title}
                                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                whileHover={reduceMotion ? undefined : { y: -7, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.055 }}
                                className="group snap-center overflow-hidden rounded-[1.5rem] border border-white/15 bg-white text-duck-ink"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" loading="lazy" decoding="async" />
                                    <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full border border-duck-ink/15 text-duck-ink shadow-sm" style={{ backgroundColor: project.color }}><Icon className="size-4" aria-hidden="true" /></span>
                                    <span className="absolute bottom-3 left-3 rounded-full bg-duck-ink/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm">{project.label}</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-display text-2xl leading-none">{project.title}</h3>
                                    <p className="mt-2 text-xs font-semibold leading-5 text-duck-ink/55">{project.output}</p>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
                <p className="mt-3 text-xs font-bold text-white/35 lg:hidden">Veeg om meer leerlingwerk te zien →</p>
            </div>
        </section>
    );
}

function TeacherEvidence() {
    return (
        <section id="docentbewijs" className="scroll-mt-20 bg-duck-bg px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
                <Reveal>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-duck-error">09:45 · terug bij de docent</p>
                    <h2 className="mt-4 text-balance font-display text-[clamp(3rem,6.5vw,6rem)] leading-[0.92] tracking-[-0.04em] text-duck-ink">Wat de leerling maakt, wordt jouw overzicht.</h2>
                    <p className="mt-6 max-w-xl text-pretty text-base font-semibold leading-7 text-duck-ink/64 md:text-lg md:leading-8">Je ziet voortgang tijdens de les en ontvangt daarna bewijs dat je kunt bespreken. Geen extra spreadsheet en geen zondagavondadministratie.</p>
                    <ul className="mt-8 space-y-3">
                        {['Wie is gestart en wie loopt vast', 'Welk product is afgerond', 'Welk leerdoel zichtbaar is aangetoond'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm font-extrabold text-duck-ink"><span className="grid size-7 place-items-center rounded-full bg-duck-acid"><Check className="size-4" strokeWidth={3} aria-hidden="true" /></span>{item}</li>
                        ))}
                    </ul>
                    <a href="/docentdemo" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-duck-ink bg-white px-6 text-sm font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">Bekijk de docentdemo <ArrowRight className="size-4" aria-hidden="true" /></a>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="overflow-hidden rounded-[2rem] border-2 border-duck-ink bg-white shadow-[9px_10px_0_#202023]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-duck-ink px-4 py-3 sm:px-6">
                            <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-duck-ink text-duck-acid"><BarChart3 className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-extrabold text-duck-ink">Game Programmeur</p><p className="text-xs font-semibold text-duck-ink/45">Klas 2B · vandaag</p></div></div>
                            <span className="rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink">Les afgerond</span>
                        </div>

                        <div className="grid gap-3 bg-duck-bg p-4 sm:grid-cols-3 sm:p-6">
                            {[
                                ['21', 'projecten klaar', CheckCircle2],
                                ['4', 'nog bezig', Users],
                                ['3', 'gerichte signalen', MousePointer2],
                            ].map(([value, label, Icon]) => {
                                const MetricIcon = Icon as React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
                                return (
                                    <div key={String(label)} className="rounded-2xl border border-duck-ink/10 bg-white p-4">
                                        <MetricIcon className="size-4 text-duck-error" aria-hidden={true} />
                                        <p className="mt-4 font-display text-4xl leading-none text-duck-ink">{value as string}</p>
                                        <p className="mt-1 text-xs font-bold text-duck-ink/48">{label as string}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 sm:p-6 sm:pt-0">
                            <div className="rounded-2xl bg-duck-ink p-5 text-white">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-acid/58">Nieuw lesbewijs</p>
                                        <h3 className="mt-2 font-display text-3xl leading-none">Computational thinking</h3>
                                        <p className="mt-2 text-sm font-semibold text-white/52">Leerlingen ontwierpen, testten en verbeterden een werkende volgorde.</p>
                                    </div>
                                    <span className="rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink">SLO 22B</span>
                                </div>
                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-duck-acid" /></div>
                                <div className="mt-3 flex items-center justify-between text-xs font-bold text-white/48"><span>21 bewijzen opgeslagen</span><span>75%</span></div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function SchoolPilot() {
    return (
        <section id="schoolpilot" className="scroll-mt-20 bg-duck-bgLight px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <Reveal className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-duck-error">Van één les naar een leerlijn</p>
                    <h2 className="mx-auto mt-4 max-w-5xl text-balance font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.04em] text-duck-ink">Klein genoeg om te starten. Sterk genoeg om op te bouwen.</h2>
                </Reveal>

                <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {SCHOOL_PROOF.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Reveal key={item.title} delay={index * 0.07} className="h-full">
                                <article className={`h-full rounded-[1.5rem] border border-duck-ink/10 p-5 ${index === 0 ? 'bg-duck-acid' : 'bg-white'}`}>
                                    <span className="grid size-11 place-items-center rounded-xl bg-duck-ink text-duck-acid"><Icon className="size-5" aria-hidden="true" /></span>
                                    <h3 className="mt-6 font-display text-2xl leading-none text-duck-ink">{item.title}</h3>
                                    <p className="mt-3 text-sm font-semibold leading-6 text-duck-ink/58">{item.copy}</p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>

                <Reveal className="mt-12 overflow-hidden rounded-[2rem] border-2 border-duck-ink bg-duck-acid shadow-[9px_10px_0_#202023]" delay={0.1}>
                    <div className="grid items-center gap-8 px-5 py-9 sm:px-8 md:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
                        <div className="flex items-center gap-5">
                            <span className="hidden size-24 shrink-0 place-items-center rounded-full border-2 border-duck-ink bg-white sm:grid"><DuckMark className="size-17 object-contain" /></span>
                            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-duck-ink/45">Schoolpilot</p><h3 className="mt-2 font-display text-4xl leading-[0.95] text-duck-ink md:text-5xl">Zie het werken in jouw klas.</h3></div>
                        </div>
                        <div className="lg:justify-self-end">
                            <p className="max-w-xl text-sm font-semibold leading-6 text-duck-ink/65 md:text-base md:leading-7">We richten samen één klas, route en eerste les in. Zo beoordeel je DGSkills op wat leerlingen maken en wat docenten werkelijk nodig hebben.</p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <a href="/pilot" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-duck-ink px-7 text-sm font-extrabold text-duck-acid transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">Plan mijn schoolpilot <ArrowRight className="size-4" aria-hidden="true" /></a>
                                <a href="/ict" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white/70 px-6 text-sm font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30"><LockKeyhole className="size-4" aria-hidden="true" /> Voor ICT &amp; privacy</a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function StoryFooter() {
    return (
        <footer className="border-t border-white/10 bg-duck-ink px-4 py-10 text-white sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                    <a href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"><span className="grid size-12 place-items-center rounded-xl bg-white"><DuckMark className="size-10 object-contain" /></span><span className="text-xl font-black">DGSkills</span></a>
                    <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-white/48">Digitale geletterdheid waarin leerlingen bouwen, docenten gericht coachen en scholen zien wat er geleerd wordt.</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-extrabold text-white/58">
                    <a className="hover:text-white" href="/ict">ICT &amp; privacy</a>
                    <a className="hover:text-white" href="/ai-geletterdheid-onderwijs-ai-act">AI-transparantie</a>
                    <a className="hover:text-white" href="/pilot">Schoolpilot</a>
                    <a className="hover:text-white" href="/login">Inloggen</a>
                </div>
            </div>
            <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs font-semibold text-white/32 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} DGSkills</p><p>Gebouwd voor VO &amp; VSO.</p></div>
        </footer>
    );
}

export const ScholenLandingStory: React.FC = () => {
    useStorySeo();

    return (
        <div className="min-h-screen overflow-x-clip bg-duck-bg font-sans text-duck-ink selection:bg-duck-acid selection:text-duck-ink">
            <StoryHeader />
            <main>
                <HeroSection />
                <LessonStory />
                <MiniMissionBuilder />
                <ProjectGallery />
                <TeacherEvidence />
                <SchoolPilot />
            </main>
            <StoryFooter />
        </div>
    );
};
