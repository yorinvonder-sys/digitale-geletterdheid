import { useReducer } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowUp, Check, Code2, Gauge, Palette, Play, RotateCcw } from 'lucide-react';
import { PlatformGame } from './PlatformGame';
import { AssignmentGuide } from './AssignmentGuide';
import {
    INITIAL_GAME_PROGRAMMER_STATE,
    MODIFICATION_DETAILS,
    gameProgrammerReducer,
    gameSettingsFor,
    type GameModification,
} from './gameProgrammerState';

const MODIFICATION_ICONS = {
    color: Palette,
    jump: ArrowUp,
    speed: Gauge,
} satisfies Record<GameModification, typeof Palette>;

const MODIFICATIONS: ReadonlyArray<GameModification> = ['color', 'jump', 'speed'];

export function GameProgrammerDemo() {
    const [state, dispatch] = useReducer(gameProgrammerReducer, INITIAL_GAME_PROGRAMMER_STATE);
    const settings = gameSettingsFor(state.modification);
    const detail = state.modification ? MODIFICATION_DETAILS[state.modification] : null;

    return (
        <section id="probeer-het" className="scroll-mt-24 overflow-hidden bg-duck-acid px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="grid min-w-0 gap-7 lg:grid-cols-[0.78fr_minmax(0,1.22fr)] lg:items-end">
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-duck-ink/55">09:20 · nu ben jij de leerling</p>
                        <h2 className="mt-4 max-w-[12ch] text-balance font-display text-[clamp(2.6rem,6vw,5.8rem)] leading-[1.02] tracking-[-0.022em] text-duck-ink lg:leading-[0.96] lg:tracking-[-0.04em]">Remix een echte game.</h2>
                    </div>
                    <p className="min-w-0 max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/68 md:text-lg md:leading-8 lg:justify-self-end">Dit is de bestaande opdracht Game Programmeur in het klein: pas een variabele aan, speel direct en ervaar wat jouw codewijziging doet.</p>
                </div>

                <div className="mt-10 min-w-0 overflow-hidden rounded-[2rem] border-2 border-duck-ink bg-duck-bgLight shadow-[8px_10px_0_#202023] md:mt-14">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-duck-ink bg-white px-4 py-3 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-duck-ink text-duck-acid"><Code2 className="size-4" aria-hidden="true" /></span>
                            <div className="min-w-0">
                                <p className="text-sm font-extrabold text-duck-ink">Game Programmeur</p>
                                <p className="text-xs font-semibold text-duck-ink/50">Echte opdracht · compacte demo</p>
                            </div>
                        </div>
                        <span className="rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink">SLO 22B</span>
                    </div>

                    <div className="grid min-w-0 lg:grid-cols-[0.78fr_minmax(0,1.22fr)]">
                        <div className="min-w-0 border-b-2 border-duck-ink p-4 sm:p-6 lg:border-b-0 lg:border-r-2">
                            <AnimatePresence initial={false}>
                                {state.modification === null && (
                                    <AssignmentGuide instruction="Kies één codewijziging. Speel daarna direct het verschil." />
                                )}
                            </AnimatePresence>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-error">Jouw opdracht</p>
                            <h3 className="mt-2 text-xl font-extrabold leading-7 text-duck-ink">Kies één codewijziging.</h3>
                            <p className="mt-2 text-sm font-semibold leading-6 text-duck-ink/58">Je verandert een echte variabele uit de missie. Speel daarna direct het verschil.</p>

                            <div className="mt-5 grid gap-2" aria-label="Kies een codewijziging">
                                {MODIFICATIONS.map((modification) => {
                                    const item = MODIFICATION_DETAILS[modification];
                                    const Icon = MODIFICATION_ICONS[modification];
                                    const selected = state.modification === modification;
                                    return (
                                        <button
                                            key={modification}
                                            type="button"
                                            onClick={() => dispatch({ type: 'select', modification })}
                                            disabled={state.status === 'playing'}
                                            aria-pressed={selected}
                                            className={`flex min-h-[68px] min-w-0 items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30 disabled:cursor-not-allowed disabled:opacity-55 ${selected ? 'border-duck-ink bg-duck-acid shadow-[3px_4px_0_#202023]' : 'border-duck-ink/15 bg-white hover:border-duck-ink'}`}
                                        >
                                            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${selected ? 'bg-duck-ink text-duck-acid' : 'bg-duck-bg text-duck-ink'}`}><Icon className="size-5" aria-hidden="true" /></span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-extrabold text-duck-ink">{item.label}</span>
                                                <span className="mt-0.5 block font-mono text-[11px] font-bold text-duck-ink/48">{item.variable} = {item.value}</span>
                                            </span>
                                            {selected && <Check className="ml-auto size-5 shrink-0 text-duck-ink" strokeWidth={3} aria-hidden="true" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 min-h-[92px] rounded-2xl bg-duck-ink p-4 text-white" aria-live="polite">
                                {detail ? (
                                    <>
                                        <p className="font-mono text-xs font-bold text-duck-acid">{detail.variable} = {detail.value}</p>
                                        <p className="mt-2 text-xs font-semibold leading-5 text-white/65">{detail.effect}</p>
                                    </>
                                ) : (
                                    <p className="text-xs font-semibold leading-5 text-white/55">Kies een wijziging. Hier zie je welke codevariabele verandert en wat het effect is.</p>
                                )}
                            </div>

                            {state.status === 'ready' && (
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'start' })}
                                    disabled={!state.modification}
                                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-duck-ink px-5 text-sm font-black text-duck-acid transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30"
                                >
                                    <Play className="size-4 fill-current" aria-hidden="true" /> Start mijn game
                                </button>
                            )}

                            {state.status === 'game-over' && (
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'reset' })}
                                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white px-5 text-sm font-black text-duck-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30"
                                >
                                    <RotateCcw className="size-4" aria-hidden="true" /> Kies andere wijziging
                                </button>
                            )}
                        </div>

                        <div className="min-w-0 bg-duck-bg p-4 sm:p-6">
                            <PlatformGame
                                settings={settings}
                                status={state.status}
                                runId={state.runId}
                                onGameOver={(score) => dispatch({ type: 'game-over', score })}
                                onRestart={() => dispatch({ type: 'restart' })}
                            />

                            {state.status === 'game-over' && (
                                <div className="mt-5 rounded-2xl bg-duck-ink p-4 text-white" aria-live="polite">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-acid/65">Zichtbaar bij de docent</p>
                                            <p className="mt-1 text-sm font-extrabold">Variabele aangepast en getest</p>
                                            <p className="mt-1 text-xs font-semibold text-white/52">Score {state.score} · Computational thinking · SLO 22B</p>
                                        </div>
                                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-duck-acid text-duck-ink"><Check className="size-5" strokeWidth={3} aria-hidden="true" /></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
