import React, { useReducer } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUp,
    Check,
    CheckCircle2,
    Play,
    Rocket,
    RotateCcw,
    Sparkles,
    Star,
    Trophy,
    Undo2,
} from 'lucide-react';
import { DuckMark } from '@/components/brand/DuckMark';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
    INITIAL_MINI_MISSION_STATE,
    miniMissionReducer,
    type MissionCommand,
} from './miniMissionState';

const COMMANDS: ReadonlyArray<{
    command: MissionCommand;
    label: string;
    helper: string;
    icon: React.ReactNode;
}> = [
    {
        command: 'boost',
        label: 'Boost',
        helper: 'pak snelheid',
        icon: <Rocket className="size-4" aria-hidden="true" />,
    },
    {
        command: 'jump',
        label: 'Spring',
        helper: 'over het wiel',
        icon: <ArrowUp className="size-4" aria-hidden="true" />,
    },
    {
        command: 'collect',
        label: 'Pak ster',
        helper: 'rond de missie af',
        icon: <Star className="size-4" aria-hidden="true" />,
    },
];

const commandById = Object.fromEntries(
    COMMANDS.map((item) => [item.command, item]),
) as Record<MissionCommand, (typeof COMMANDS)[number]>;

function ResultMessage({ result }: { result: 'idle' | 'success' | 'retry' }) {
    if (result === 'success') {
        return (
            <span className="inline-flex items-center gap-2 font-extrabold text-duck-ink">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                Gelukt — Kees heeft de ster!
            </span>
        );
    }

    if (result === 'retry') {
        return (
            <span className="font-bold text-duck-error">
                Bijna. Lees de route van links naar rechts en pas je volgorde aan.
            </span>
        );
    }

    return (
        <span className="font-semibold text-duck-ink/55">
            Vul drie stappen en test daarna je programma.
        </span>
    );
}

export function MiniMissionBuilder() {
    const [state, dispatch] = useReducer(miniMissionReducer, INITIAL_MINI_MISSION_STATE);
    const reduceMotion = usePrefersReducedMotion();
    const isReady = state.commands.length === 3;

    return (
        <section
            id="probeer-het"
            data-testid="mini-mission"
            className="scroll-mt-24 bg-duck-acid px-4 py-20 sm:px-6 md:py-28 lg:px-10"
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                    <div className="max-w-xl">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-duck-ink/55">
                            09:20 · nu ben jij de leerling
                        </p>
                        <h2 className="mt-4 max-w-[12ch] text-balance font-display text-[clamp(2.6rem,6vw,5.8rem)] leading-[1.02] tracking-[-0.022em] text-duck-ink lg:leading-[0.96] lg:tracking-[-0.04em]">
                            Bouw iets dat meteen werkt.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/70 md:text-lg md:leading-8 lg:justify-self-end">
                        Geen video om af te kijken. Programmeer zelf de route van Kees: kies drie commando&apos;s, test je game en zie wat de docent terugkrijgt.
                    </p>
                </div>

                <div className="mt-10 overflow-hidden rounded-[2rem] border-2 border-duck-ink bg-duck-bgLight shadow-[8px_10px_0_#202023] md:mt-14">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-duck-ink bg-white px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="grid size-9 place-items-center rounded-full bg-duck-ink text-xs font-black text-duck-acid">04</span>
                            <div>
                                <p className="text-sm font-extrabold text-duck-ink">Game Programmeur</p>
                                <p className="text-xs font-semibold text-duck-ink/50">Mini-missie · ± 45 seconden</p>
                            </div>
                        </div>
                        <span className="rounded-full border border-duck-ink/15 bg-duck-bg px-3 py-1.5 text-xs font-extrabold text-duck-ink">
                            Geen account nodig
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                        <div className="border-b-2 border-duck-ink p-4 sm:p-6 lg:border-b-0 lg:border-r-2">
                            <div className="rounded-[1.5rem] bg-duck-ink p-5 text-white sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-acid/65">Opdracht</p>
                                        <h3 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">Help Kees door de codewereld</h3>
                                    </div>
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
                                        <Trophy className="size-5 text-duck-acid" aria-hidden="true" />
                                    </span>
                                </div>

                                <ol className="mt-5 grid gap-2 text-sm font-bold text-white/75 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                    <li className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5"><span className="text-duck-acid">1</span> Snelheid</li>
                                    <li className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5"><span className="text-duck-acid">2</span> Obstakel</li>
                                    <li className="flex items-center gap-2 rounded-xl bg-white/[0.07] px-3 py-2.5"><span className="text-duck-acid">3</span> Ster</li>
                                </ol>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/45">1. Kies je commando&apos;s</p>
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {COMMANDS.map((item) => (
                                        <button
                                            key={item.command}
                                            type="button"
                                            onClick={() => dispatch({ type: 'add', command: item.command })}
                                            disabled={state.commands.length >= 3}
                                            className="group min-h-[76px] rounded-2xl border-2 border-duck-ink bg-white px-2 py-3 text-left transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/35 sm:px-3"
                                            aria-label={`${item.label}: ${item.helper}`}
                                        >
                                            <span className="flex items-center gap-1.5 text-sm font-extrabold text-duck-ink">
                                                {item.icon}
                                                {item.label}
                                            </span>
                                            <span className="mt-1 block text-[11px] font-semibold leading-tight text-duck-ink/50">{item.helper}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/45">2. Jouw programma</p>
                                    <button
                                        type="button"
                                        onClick={() => dispatch({ type: 'reset' })}
                                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold text-duck-ink/60 hover:bg-duck-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                                    >
                                        <RotateCcw className="size-3.5" aria-hidden="true" />
                                        Programma wissen
                                    </button>
                                </div>
                                <ol className="mt-2 grid grid-cols-3 gap-2" aria-label="Gekozen programma">
                                    {[0, 1, 2].map((index) => {
                                        const command = state.commands[index];
                                        return (
                                            <li
                                                key={index}
                                                className={`flex min-h-[58px] items-center gap-2 rounded-xl border-2 border-dashed px-2.5 text-sm font-extrabold ${command ? 'border-duck-ink bg-duck-acid' : 'border-duck-ink/20 bg-white/60 text-duck-ink/30'}`}
                                            >
                                                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-duck-ink text-[10px] text-white">{index + 1}</span>
                                                {command ? commandById[command].label : 'Leeg'}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'undo' })}
                                    disabled={state.commands.length === 0}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white px-5 text-sm font-extrabold text-duck-ink transition-colors hover:bg-duck-bg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/35"
                                >
                                    <Undo2 className="size-4" aria-hidden="true" />
                                    Stap terug
                                </button>
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'run' })}
                                    disabled={!isReady}
                                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-duck-ink px-6 text-sm font-extrabold text-duck-acid transition-all hover:-translate-y-0.5 hover:bg-duck-error hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-duck-ink disabled:hover:text-duck-acid focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/35"
                                >
                                    <Play className="size-4 fill-current" aria-hidden="true" />
                                    Test mijn game
                                </button>
                            </div>
                        </div>

                        <div className="flex min-h-[520px] flex-col bg-duck-bg p-4 sm:p-6">
                            <div className="relative min-h-[310px] flex-1 overflow-hidden rounded-[1.5rem] border-2 border-duck-ink bg-duck-ink sm:min-h-[360px]">
                                <img
                                    src="/assets/agents/game_programmeur_new.webp"
                                    alt="Een groene pixelwereld uit de missie Game Programmeur"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-duck-ink/80 via-duck-ink/5 to-transparent" aria-hidden="true" />

                                <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                                    <span className="rounded-full border border-white/20 bg-duck-ink/75 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">
                                        LEVEL 04 · CODEWERELD
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink">
                                        <Star className="size-3.5 fill-current" aria-hidden="true" /> 0/1
                                    </span>
                                </div>

                                <div className="absolute inset-x-[8%] bottom-[18%] flex items-end justify-between" aria-hidden="true">
                                    {[Rocket, ArrowUp, Star].map((Icon, index) => (
                                        <span key={index} className="grid size-9 place-items-center rounded-full border-2 border-white/70 bg-duck-ink/75 text-white shadow-lg">
                                            <Icon className="size-4" />
                                        </span>
                                    ))}
                                </div>

                                <motion.div
                                    key={`runner-${state.runId}`}
                                    className="absolute bottom-[8%] left-[8%] z-10 grid size-14 place-items-center rounded-2xl border-2 border-duck-ink bg-white shadow-xl [--run-distance:13rem] [--run-step-one:4rem] [--run-step-two:8rem] sm:[--run-distance:24rem] sm:[--run-step-one:8rem] sm:[--run-step-two:16rem] lg:[--run-distance:18rem] lg:[--run-step-one:6rem] lg:[--run-step-two:12rem] xl:[--run-distance:24rem] xl:[--run-step-one:8rem] xl:[--run-step-two:16rem]"
                                    initial={{ x: 0, y: 0, rotate: 0 }}
                                    animate={state.result === 'success' && !reduceMotion
                                        ? {
                                            x: ['0rem', 'var(--run-step-one)', 'var(--run-step-two)', 'var(--run-distance)'],
                                            y: [0, -20, -92, 0],
                                            rotate: [0, -4, 8, 0],
                                        }
                                        : state.result === 'retry' && !reduceMotion
                                            ? { x: [0, 10, -8, 6, 0], rotate: [0, 3, -3, 0] }
                                            : { x: 0, y: 0, rotate: 0 }}
                                    transition={{ duration: state.result === 'success' ? 1.8 : 0.45, ease: 'easeInOut' }}
                                >
                                    <DuckMark className="size-10 object-contain" />
                                </motion.div>

                                <AnimatePresence>
                                    {state.result === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: reduceMotion ? 0 : 1.2 }}
                                            className="absolute inset-0 z-20 grid place-items-center bg-duck-ink/35 px-6 backdrop-blur-[2px]"
                                        >
                                            <div className="rounded-2xl border-2 border-duck-ink bg-duck-acid px-6 py-5 text-center shadow-[6px_7px_0_#202023]">
                                                <Sparkles className="mx-auto size-6 text-duck-ink" aria-hidden="true" />
                                                <p className="mt-2 font-display text-3xl leading-none text-duck-ink">Level gehaald!</p>
                                                <p className="mt-2 text-sm font-extrabold text-duck-ink/65">Je programma werkt.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-4 min-h-[52px] rounded-2xl border border-duck-ink/10 bg-white px-4 py-3 text-sm" aria-live="polite">
                                <ResultMessage result={state.result} />
                            </div>

                            <AnimatePresence initial={false}>
                                {state.result === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: reduceMotion ? 0 : 1.45 }}
                                        className="mt-3 rounded-2xl bg-duck-ink p-4 text-white"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-acid/60">Zichtbaar bij de docent</p>
                                                <p className="mt-1 text-sm font-extrabold">Computational thinking aangetoond</p>
                                            </div>
                                            <span className="grid size-9 place-items-center rounded-full bg-duck-acid text-duck-ink">
                                                <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-white/65">
                                            <span className="rounded-full bg-white/10 px-3 py-1.5">SLO 22B</span>
                                            <span className="rounded-full bg-white/10 px-3 py-1.5">Project opgeslagen</span>
                                            <span className="rounded-full bg-white/10 px-3 py-1.5">3 stappen getest</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
