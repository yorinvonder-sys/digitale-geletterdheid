import { useReducer } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw, Send, UserRoundCheck } from 'lucide-react';
import {
    INITIAL_TEACHER_ACTION_STATE,
    teacherActionReducer,
    teacherActiveCount,
    type StalledStudent,
} from './teacherActionState';

const STALLED_STUDENTS: ReadonlyArray<StalledStudent> = [25, 26, 27, 28];

const SIGNALS: Record<StalledStudent, string> = {
    25: 'Leest stap 1 al drie minuten en heeft nog niets gebouwd.',
    26: 'Heeft de opdracht twee keer opnieuw geopend.',
    27: 'Bekijkt het voorbeeld, maar heeft nog geen keuze gemaakt.',
    28: 'Is gestopt bij de eerste programmeerstap.',
};

export function TeacherActionDemo({ reduceMotion }: { reduceMotion: boolean }) {
    const [state, dispatch] = useReducer(teacherActionReducer, INITIAL_TEACHER_ACTION_STATE);
    const activeCount = teacherActiveCount(state);
    const selectedSignal = state.selectedStudent ? SIGNALS[state.selectedStudent] : null;

    return (
        <div className="min-w-0 rounded-2xl bg-duck-bg p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-error">Probeer het dashboard</p>
                    <h3 className="mt-1 text-lg font-extrabold leading-6 text-duck-ink">Vier leerlingen zijn nog niet gestart.</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-duck-ink/55">Tik op een lichte tegel en help één leerling starten.</p>
                </div>
                <span className="shrink-0 rounded-full bg-duck-acid px-3 py-1.5 text-xs font-black text-duck-ink" aria-live="polite">
                    {activeCount}/28 actief
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-extrabold text-duck-ink/55" aria-label="Legenda leerlingstatus">
                <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-duck-ink" aria-hidden="true" /> Bouwen</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm border border-duck-ink/25 bg-white" aria-hidden="true" /> Leest uitleg</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm border border-duck-ink bg-duck-acid" aria-hidden="true" /> Hint gestuurd</span>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2" aria-label="Live klasoverzicht">
                {Array.from({ length: 24 }, (_, index) => (
                    <span
                        key={`active-${index + 1}`}
                        className="aspect-square min-h-8 rounded-md bg-duck-ink"
                        title={`Leerling ${index + 1} bouwt`}
                        aria-hidden="true"
                    />
                ))}
                {STALLED_STUDENTS.map((student) => {
                    const selected = state.selectedStudent === student;
                    const helped = state.helpedStudent === student;
                    return (
                        <motion.button
                            key={student}
                            type="button"
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => dispatch({ type: 'select', student })}
                            disabled={helped}
                            aria-pressed={selected}
                            aria-label={`Leerling ${student}: ${helped ? 'hint gestuurd' : 'leest uitleg'}`}
                            className={`relative aspect-square min-h-8 rounded-md border text-[10px] font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-error focus-visible:ring-offset-2 ${helped ? 'border-duck-ink bg-duck-acid text-duck-ink' : selected ? 'border-duck-error bg-white text-duck-error ring-2 ring-duck-error/20' : 'border-duck-ink/25 bg-white text-duck-ink/55 hover:border-duck-error hover:text-duck-error'}`}
                        >
                            {helped ? <Check className="mx-auto size-4" strokeWidth={3} aria-hidden="true" /> : student}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {state.selectedStudent ? (
                    <motion.div
                        key={`${state.selectedStudent}-${state.helpedStudent ?? 'open'}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                        className={`mt-4 rounded-xl border p-4 ${state.helpedStudent === state.selectedStudent ? 'border-duck-ink bg-duck-acid' : 'border-duck-error/35 bg-white'}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-duck-ink text-duck-acid">
                                <UserRoundCheck className="size-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-extrabold text-duck-ink">Leerling {state.selectedStudent}</p>
                                <p className="mt-1 text-xs font-semibold leading-5 text-duck-ink/58">
                                    {state.helpedStudent === state.selectedStudent
                                        ? 'De hint staat klaar. De leerling kan nu vanuit stap 1 verder bouwen.'
                                        : selectedSignal}
                                </p>
                            </div>
                        </div>

                        {state.helpedStudent === state.selectedStudent ? (
                            <button
                                type="button"
                                onClick={() => dispatch({ type: 'reset' })}
                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white px-4 text-xs font-black text-duck-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/25"
                            >
                                <RotateCcw className="size-4" aria-hidden="true" /> Opnieuw proberen
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => dispatch({ type: 'send-hint' })}
                                disabled={state.helpedStudent !== null}
                                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-duck-ink px-4 text-xs font-black text-duck-acid transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/25"
                            >
                                <Send className="size-4" aria-hidden="true" /> Stuur gerichte hint
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.p
                        key="instruction"
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 rounded-xl border border-dashed border-duck-ink/20 bg-white/60 px-4 py-3 text-center text-xs font-bold leading-5 text-duck-ink/48"
                    >
                        Kies leerling 25, 26, 27 of 28 om het signaal te bekijken.
                    </motion.p>
                )}
            </AnimatePresence>

            <p className="sr-only" aria-live="polite">
                {state.helpedStudent ? `Hint gestuurd naar leerling ${state.helpedStudent}. ${activeCount} van 28 leerlingen actief.` : ''}
            </p>
        </div>
    );
}
