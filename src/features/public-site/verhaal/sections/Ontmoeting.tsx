import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ChapterMarker, Reveal, BrowserFrame, Marquee, HARD_SHADOW_LG } from '../components/storyBrand';
import { VERHAAL_STATS } from '../verhaalStats';

const PROMISES = [
    {
        title: 'SLO-ready',
        body: 'Elke missie is getagd met de SLO-conceptkerndoelen. Na de les wijs je aan wat er geleerd is — geen reconstructie achteraf.',
        icon: '◎',
    },
    {
        title: 'Docentproof',
        body: 'Een dashboard voor voortgang en signalen. Je ziet wie vastzit zonder rondje langs 29 tafels.',
        icon: '◉',
    },
    {
        title: 'Samen ingericht',
        body: 'Klas en route staan klaar vóór les één. De schoolpilot richten we op maat in met je team.',
        icon: '◈',
    },
    {
        title: 'Veilig',
        body: 'AVG-bewust, Microsoft 365-login en een AI Act-roadmap. ICT en privacy kunnen alles vooraf toetsen.',
        icon: '●',
    },
];

/**
 * Telt op naar `to` zodra het in beeld komt.
 *
 * Bewust lokaal en niet `@/components/brand/AnimatedCounter`: die component
 * rendert vast in `text-duck-ink` en is daarmee onleesbaar op dit donkere vlak.
 */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-10% 0px' });
    const reduceMotion = usePrefersReducedMotion();
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (reduceMotion) {
            setVal(to);
            return;
        }
        const controls = animate(0, to, {
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to, reduceMotion]);

    return (
        <span ref={ref} className="tabular-nums">
            {val}
            {suffix}
        </span>
    );
}

/*
 * Alle cijfers zijn afgeleid uit de productconfiguratie (zie verhaalStats.ts).
 * Uitzondering: "10 werkdagen tot je live bent" — dat is de bestaande
 * pilotbelofte uit PilotAanmelden.tsx, geen afgeleid getal.
 */
const STATS = [
    { to: VERHAAL_STATS.missies, suffix: '', label: 'kant-en-klare missies' },
    { to: VERHAAL_STATS.kerndoelen, suffix: '', label: 'SLO-kerndoelen in beeld' },
    { to: VERHAAL_STATS.leerjaren, suffix: '', label: 'leerjaren uitgewerkt' },
    { to: 10, suffix: '', label: 'werkdagen tot je live bent' },
];

const MISSIONS = [
    { name: 'Prompt Perfectionist', tag: 'Digitale vaardigheden', done: true },
    { name: 'Deepfake Detector', tag: 'Mediawijsheid', done: true },
    { name: 'Game Programmeur', tag: 'Computational thinking', done: false },
];

export function Ontmoeting() {
    return (
        <section id="ontmoeting" className="scroll-mt-24 relative bg-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                <ChapterMarker
                    kicker="Hoofdstuk 2 · De ontmoeting"
                    number="2"
                    title={<>En toen verscheen DGSkills.</>}
                />

                <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center">
                    <p className="text-lg leading-relaxed text-duck-ink/70 md:text-xl">
                        Geen cursus, geen werkbladen-fabriek.{' '}
                        <strong className="text-duck-ink">Kant-en-klare AI-missies</strong> gekoppeld aan
                        de SLO-kerndoelen. Leerlingen werken zelfstandig in een veilige leeromgeving —{' '}
                        <strong className="text-duck-ink">jij volgt de voortgang</strong>.
                    </p>
                </Reveal>

                <Reveal delay={0.2} className="mx-auto mt-12 max-w-3xl">
                    <img
                        src="/assets/storytelling/klas-aan-het-werk.webp"
                        width={1400}
                        height={788}
                        loading="lazy"
                        decoding="async"
                        alt="Drie leerlingen werken samen achter Chromebooks aan een tafel in een klaslokaal."
                        className={`w-full rounded-2xl border-[3px] border-duck-ink object-cover ${HARD_SHADOW_LG}`}
                    />
                </Reveal>

                {/* missiebibliotheek-mockup */}
                <Reveal delay={0.2} className="mt-14">
                    <BrowserFrame url="dgskills.app/missies" className="mx-auto max-w-3xl -rotate-1">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="font-display text-xl font-black">De missiebibliotheek</p>
                            <span className="shrink-0 rounded-full border-2 border-duck-ink bg-duck-acid px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                                Start in 1 klik
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {MISSIONS.map((m) => (
                                <div
                                    key={m.name}
                                    className={`flex items-center justify-between gap-3 rounded-xl border-2 border-duck-ink px-4 py-3 ${
                                        m.done ? 'bg-duck-acid/70' : 'bg-duck-bg'
                                    }`}
                                >
                                    <span className="text-sm font-bold md:text-base">{m.name}</span>
                                    <span className="flex shrink-0 items-center gap-2">
                                        <span className="hidden rounded-full bg-duck-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-duck-bg sm:inline">
                                            {m.tag}
                                        </span>
                                        <span className="text-xs font-bold text-duck-ink/60">
                                            {m.done ? '✓ geklaard' : '→ starten'}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs italic text-duck-ink/50">
                            “De AI-coach kijkt mee: start klein. Eén goede prompt is al werk genoeg.”
                        </p>
                    </BrowserFrame>
                </Reveal>

                {/* de vier beloftes */}
                <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {PROMISES.map((c, i) => (
                        <Reveal key={c.title} delay={0.08 * i}>
                            <div className="h-full rounded-2xl border-[3px] border-duck-ink bg-white p-5 shadow-[5px_5px_0_0_rgba(32,32,35,1)] transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg]">
                                <span
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-duck-ink bg-duck-acid text-xl"
                                    aria-hidden="true"
                                >
                                    {c.icon}
                                </span>
                                <h3 className="mt-4 font-display text-xl font-black">{c.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-duck-ink/65">{c.body}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* cijfers */}
                <Reveal delay={0.1} className="mt-16">
                    <div className="grid grid-cols-2 overflow-hidden rounded-3xl border-[3px] border-duck-ink bg-duck-ink text-duck-bg lg:grid-cols-4">
                        {STATS.map((s, i) => (
                            <div
                                key={s.label}
                                className={`p-6 md:p-8 ${i % 2 === 1 ? 'border-l-2 border-duck-bg/15' : ''} ${
                                    i > 1 ? 'border-t-2 border-duck-bg/15 lg:border-t-0' : ''
                                } ${i === 3 ? 'lg:border-l-2' : ''}`}
                            >
                                <p className="font-display text-5xl font-black text-duck-acid md:text-6xl">
                                    <Counter to={s.to} suffix={s.suffix} />
                                </p>
                                <p className="mt-2 text-sm text-duck-bg/65">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            <Marquee
                items={[
                    'AI-geletterdheid',
                    'Mediawijsheid',
                    'Computational thinking',
                    'Informatievaardigheden',
                    'Online veiligheid',
                    'Portfolio-bewijs',
                    'SLO-kerndoelen',
                ]}
            />
        </section>
    );
}
