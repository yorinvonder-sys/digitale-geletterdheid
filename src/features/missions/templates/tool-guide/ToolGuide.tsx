import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Check, ChevronRight, ClipboardCheck, Lightbulb } from 'lucide-react';
import { DuckMark } from '@/components/brand/DuckMark';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, MissionGoal } from '../shared/types';
import { toScorePercent } from '../shared/scorePercent';

// ─── Config types ────────────────────────────────────────────────────────────

export interface ChecklistItem {
    id: string;
    label: string;
}

export interface VerificationQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    allowRetry?: boolean;
    retryHint?: string;
}

export interface ToolStep {
    id: string;
    title: string;
    instruction: string;
    tip?: string;
    checklistItems: ChecklistItem[];
    teacherCheck?: string;
    verificationQuestion?: VerificationQuestion;
}

export interface ToolGuideConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    toolName: string;
    toolIcon: string;
    steps: ToolStep[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    learningObjectives?: string[];
}

// ─── Allowlist ───────────────────────────────────────────────────────────────
const VALID_TOOL_GUIDE_IDS: ReadonlySet<string> = new Set([
    'cloud-commander',
    'magister-master',
    'mission-build',
    'mission-launch',
    'print-pro',
    'slide-specialist',
    'startup-pitch',
    'word-wizard',
]);

// ─── State ───────────────────────────────────────────────────────────────────

interface ToolGuideState {
    phase: 'intro' | 'steps' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    teacherChecks: Record<string, boolean>;
    verificationAnswers: Record<string, number>;
    verificationSubmitted: Record<string, boolean>;
    /** Optioneel: opslag van vóór deze telling heeft dit veld niet en houdt de
     *  volle kennisbonus. */
    verificationRetries?: Record<string, number>;
}

// ─── Score helpers ────────────────────────────────────────────────────────────

const CHECKLIST_POINTS_PER_STEP = 10;
const QUESTION_BONUS = 5;
const RETRY_PENALTY = 2;
const MIN_QUESTION_BONUS = 1;

/**
 * Bij een vraag met `allowRetry` kan een leerling opties blijven afgaan tot het
 * juiste antwoord eruit rolt; zonder aftrek levert dat dezelfde bonus op als het
 * meteen goed hebben. Elke herkansing kost daarom een deel van de bonus, met een
 * bodem zodat wie het na een paar pogingen alsnog snapt niet met lege handen
 * staat. Saves van vóór deze telling hebben geen herkansingen opgeslagen en
 * houden de volle bonus — de correctie werkt nooit terug op bestaand werk.
 */
function questionBonus(retries: number): number {
    return Math.max(MIN_QUESTION_BONUS, QUESTION_BONUS - retries * RETRY_PENALTY);
}

function computeScore(state: ToolGuideState, steps: ToolStep[]): number {
    let score = 0;
    for (const step of steps) {
        const allChecked = step.checklistItems.every(
            (item) => state.checklist[`${step.id}-${item.id}`]
        );
        if (allChecked) score += CHECKLIST_POINTS_PER_STEP;

        if (step.verificationQuestion && state.verificationSubmitted[step.id]) {
            const answered = state.verificationAnswers[step.id];
            if (answered === step.verificationQuestion.correctIndex) {
                score += questionBonus(state.verificationRetries?.[step.id] ?? 0);
            }
        }
    }
    return score;
}

/**
 * Toetst opgeslagen voortgang tegen de huidige config. Een `currentStep` buiten
 * bereik klemt de engine zelf (dan blijft afgevinkt bewijs behouden), maar een
 * record dat geen object meer is laat StepCard alsnog crashen op een wit scherm
 * dat na elke herlaad terugkomt. Faalt deze check, dan start de missie vers.
 */
function isStateValidForConfig(saved: ToolGuideState, config: ToolGuideConfig): boolean {
    if (!saved || typeof saved !== 'object') return false;
    if (saved.phase !== 'intro' && saved.phase !== 'steps' && saved.phase !== 'results') {
        return false;
    }
    if (!Number.isInteger(saved.currentStep) || saved.currentStep < 0) return false;

    const isRecord = (value: unknown) =>
        typeof value === 'object' && value !== null && !Array.isArray(value);
    const records = [
        saved.checklist,
        saved.teacherChecks,
        saved.verificationAnswers,
        saved.verificationSubmitted,
    ];
    if (records.some((record) => !isRecord(record))) return false;
    if (saved.verificationRetries !== undefined && !isRecord(saved.verificationRetries)) {
        return false;
    }

    // Een antwoordindex buiten de opties komt uit een andere config of uit
    // bewerkte opslag; die zou stil als 'fout' meetellen zonder dat de leerling
    // ziet waarom.
    return config.steps.every((step) => {
        const answer = saved.verificationAnswers[step.id];
        if (answer === undefined) return true;
        if (!Number.isInteger(answer)) return false;
        return answer >= 0 && answer < (step.verificationQuestion?.options.length ?? 0);
    });
}

// ─── Rich text renderer (marks **bold** sections) ────────────────────────────

function RichText({ text, className }: { text: string; className?: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={i} className="font-bold text-duck-ink">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </span>
    );
}

// ─── StepCard ────────────────────────────────────────────────────────────────

interface StepCardProps {
    step: ToolStep;
    stepIndex: number;
    totalSteps: number;
    toolIcon: string;
    checklist: Record<string, boolean>;
    teacherChecks: Record<string, boolean>;
    verificationAnswer: number | undefined;
    verificationSubmitted: boolean;
    onCheckItem: (stepId: string, itemId: string) => void;
    onToggleTeacherCheck: (stepId: string) => void;
    onSelectAnswer: (stepId: string, index: number) => void;
    onSubmitAnswer: (stepId: string) => void;
    onRetryAnswer: (stepId: string) => void;
    onNext: () => void;
    isLastStep: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
    step,
    stepIndex,
    totalSteps,
    toolIcon,
    checklist,
    teacherChecks,
    verificationAnswer,
    verificationSubmitted,
    onCheckItem,
    onToggleTeacherCheck,
    onSelectAnswer,
    onSubmitAnswer,
    onRetryAnswer,
    onNext,
    isLastStep,
}) => {
    const allChecked = step.checklistItems.every(
        (item) => checklist[`${step.id}-${item.id}`]
    );

    // Bij een stapwissel verandert alleen de inhoud van deze kaart. Zonder
    // focusverplaatsing blijft de focus achter op de verdwenen knop en hoort een
    // schermlezer niets over de nieuwe stap. De kaart krijgt een key op step.id,
    // dus deze effect draait per stap.
    const headingRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    const isCorrect =
        step.verificationQuestion &&
        verificationSubmitted &&
        verificationAnswer === step.verificationQuestion.correctIndex;

    const questionAnswered =
        !step.verificationQuestion ||
        (verificationSubmitted && (!step.verificationQuestion.allowRetry || isCorrect));
    const teacherApproved = !step.teacherCheck || !!teacherChecks[step.id];
    const canProceed = allChecked && questionAnswered && teacherApproved;

    const feedbackText =
        step.verificationQuestion && verificationSubmitted
            ? isCorrect
                ? step.verificationQuestion.explanation
                : step.verificationQuestion.allowRetry
                  ? step.verificationQuestion.retryHint ??
                    'Nog niet. Lees de vraag en de uitleg nog eens en kies opnieuw.'
                  : `Nog niet. Het juiste antwoord is: ${
                        step.verificationQuestion.options[step.verificationQuestion.correctIndex]
                    }. ${step.verificationQuestion.explanation.replace(/^(Precies|Goed|Juist|Goed gedacht)!\s*/i, '')}`
            : '';

    return (
        <div className="w-full max-w-md">
            {/* Step counter */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-duck-acid flex items-center justify-center">
                    <span
                        className="text-xs font-black text-duck-ink"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {stepIndex + 1}
                    </span>
                </div>
                <span
                    className="text-xs text-duck-ink/70"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Stap {stepIndex + 1} van {totalSteps}
                </span>
                <DuckMark className="size-6 ml-auto" />
            </div>

            {/* Title */}
            <h2
                ref={headingRef}
                tabIndex={-1}
                // De teller staat visueel al boven de kop; in de toegankelijke naam
                // hoort hij erbij, want bij focus wordt alleen de kop voorgelezen.
                aria-label={`Stap ${stepIndex + 1} van ${totalSteps}: ${step.title}`}
                className="text-xl font-black text-duck-ink mb-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {step.title}
            </h2>

            {/* Instruction */}
            <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-3 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-duck-ink">
                    <ClipboardCheck size={15} className="text-duck-ink" />
                    Doe dit nu
                </p>
                <p
                    className="text-base font-semibold text-duck-ink leading-snug"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <RichText text={step.instruction} />
                </p>
            </div>

            {/* Tip */}
            {step.tip && (
                <div className="flex gap-2 bg-duck-acid/10 border border-duck-acid/20 rounded-xl p-3 mb-3">
                    <Lightbulb size={15} className="text-duck-ink shrink-0 mt-0.5" />
                    <p
                        className="text-xs text-duck-ink/70 leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <RichText text={step.tip} />
                    </p>
                </div>
            )}

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-3">
                <p
                    className="text-xs font-black text-duck-ink uppercase tracking-widest mb-3"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bewijs voor jezelf
                </p>
                <div className="space-y-2">
                    {step.checklistItems.map((item) => {
                        const key = `${step.id}-${item.id}`;
                        const checked = !!checklist[key];
                        return (
                            <button
                                key={item.id}
                                onClick={() => onCheckItem(step.id, item.id)}
                                role="checkbox"
                                aria-checked={checked}
                                className={`w-full min-h-11 flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 ${
                                    checked
                                        ? 'bg-duck-ink/10 border-duck-ink/30'
                                        : 'bg-duck-bg border-duck-gray hover:border-duck-acid/40'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                        checked
                                            ? 'bg-duck-ink border-duck-ink'
                                            : 'border-duck-gray'
                                    }`}
                                >
                                    {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                                </div>
                                <span
                                    className={`text-sm transition-all duration-200 ${
                                        checked ? 'text-duck-ink line-through' : 'text-duck-ink/70'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Teacher check */}
            {step.teacherCheck && allChecked && (
                <div className="bg-duck-bgLight rounded-2xl border border-duck-gray p-4 mb-3">
                    <p
                        className="text-xs font-black text-duck-ink uppercase tracking-widest mb-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Docentcheck
                    </p>
                    <p
                        className="text-sm text-duck-ink/70 leading-relaxed mb-3"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {step.teacherCheck}
                    </p>
                    <button
                        onClick={() => onToggleTeacherCheck(step.id)}
                        className={`w-full min-h-11 flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 ${
                            teacherChecks[step.id]
                                ? 'bg-duck-ink border-duck-ink text-white'
                                : 'bg-white border-duck-gray text-duck-ink hover:border-duck-ink/50'
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                teacherChecks[step.id]
                                    ? 'border-white bg-white/20'
                                    : 'border-duck-gray'
                            }`}
                        >
                            {teacherChecks[step.id] && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        {/* De leerling vinkt dit zelf aan; er is geen docentbevestiging achter.
                            Formuleer het daarom als eigen handeling, niet als vaststelling over de docent. */}
                        <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Ik heb dit aan mijn docent laten zien
                        </span>
                    </button>
                </div>
            )}

            {/* Verification question */}
            {step.verificationQuestion && allChecked && (
                <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-3">
                    <p
                        className="text-xs font-black text-duck-ink uppercase tracking-widest mb-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Checkpunt
                    </p>
                    <p
                        className="text-sm font-bold text-duck-ink mb-3"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {step.verificationQuestion.question}
                    </p>
                    <div className="space-y-2 mb-3">
                        {step.verificationQuestion.options.map((option, i) => {
                            const selected = verificationAnswer === i;
                            const revealCorrectAnswer = Boolean(
                                verificationSubmitted &&
                                    i === step.verificationQuestion!.correctIndex &&
                                    (!step.verificationQuestion!.allowRetry || isCorrect)
                            );
                            let style = 'bg-duck-bg border-duck-gray hover:border-duck-acid/40';
                            let textStyle = 'text-duck-ink/70';
                            if (verificationSubmitted) {
                                if (revealCorrectAnswer) {
                                    style = 'bg-duck-ink/10 border-duck-ink/40';
                                    textStyle = 'text-duck-ink';
                                } else if (selected) {
                                    style = 'bg-duck-acid/15 border-duck-acid/50';
                                    textStyle = 'text-duck-ink';
                                }
                            } else if (selected) {
                                style = 'bg-duck-acid/10 border-duck-acid/40';
                                textStyle = 'text-duck-ink';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() =>
                                        !verificationSubmitted && onSelectAnswer(step.id, i)
                                    }
                                    disabled={verificationSubmitted}
                                    aria-pressed={verificationAnswer === i}
                                    className={`w-full min-h-11 flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 ${style}`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                            revealCorrectAnswer
                                                ? 'bg-duck-ink border-duck-ink'
                                                : selected
                                                  ? 'border-duck-acid bg-duck-acid'
                                                  : 'border-duck-gray'
                                        }`}
                                    >
                                        {(revealCorrectAnswer ||
                                            selected) && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm ${textStyle}`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {!verificationSubmitted && verificationAnswer !== undefined && (
                        <button
                            onClick={() => onSubmitAnswer(step.id)}
                            className="w-full min-h-11 py-2.5 bg-duck-acid/10 hover:bg-duck-acid/20 text-duck-ink rounded-xl text-sm font-bold transition-all duration-200 border border-duck-acid/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Controleer antwoord
                        </button>
                    )}

                    {verificationSubmitted && (
                        <>
                            <div
                                role="status"
                                aria-live="polite"
                                aria-atomic="true"
                                className={`flex gap-2 rounded-xl p-3 ${
                                    isCorrect
                                        ? 'bg-duck-ink/10 border border-duck-ink/20'
                                        : 'bg-duck-acid/20 border border-duck-acid/50'
                                }`}
                            >
                                <span>{isCorrect ? '✓' : '!'}</span>
                                <p
                                    className="text-xs leading-relaxed text-duck-ink"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {feedbackText}
                                </p>
                            </div>
                            {!isCorrect && step.verificationQuestion.allowRetry && (
                                <button
                                    onClick={() => onRetryAnswer(step.id)}
                                    className="mt-2 w-full min-h-11 rounded-xl border border-duck-ink/30 bg-white px-4 py-2.5 text-sm font-bold text-duck-ink transition-colors hover:bg-duck-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Opnieuw kiezen
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Next button — de knop verschijnt pas als de poort opengaat. De
                live-regio staat er vanaf het begin, zodat een schermlezer het
                verschijnen ervan meldt in plaats van het stil te laten gebeuren. */}
            <div role="status" aria-live="polite">
                {canProceed && (
                    <button
                        onClick={onNext}
                        className="w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {isLastStep ? 'Bekijk resultaten' : 'Volgende stap'}
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface ToolGuideProps extends TemplateMissionProps {
    config: ToolGuideConfig;
}

const ToolGuideInner: React.FC<ToolGuideProps> = ({
    onBack,
    onComplete,
    config,
}) => {
    const initialState: ToolGuideState = {
        phase: 'intro',
        currentStep: 0,
        checklist: {},
        teacherChecks: {},
        verificationAnswers: {},
        verificationSubmitted: {},
        verificationRetries: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<ToolGuideState>(
        config.missionId,
        initialState,
        { validate: (saved) => isStateValidForConfig(saved, config) }
    );

    const score = useMemo(() => computeScore(state, config.steps), [state, config.steps]);

    // Een opgeslagen currentStep kan na een configwijziging (stap verwijderd of
    // hernoemd) buiten bereik vallen; StepCard crashte dan meteen op een lege
    // stap. Klemmen in plaats van wissen: de leerling houdt zijn afgevinkte
    // bewijs en landt op een bestaande stap.
    const stepIndex = Math.min(
        Math.max(state.currentStep, 0),
        Math.max(config.steps.length - 1, 0)
    );
    const currentStepData = config.steps[stepIndex];

    const phaseScores = useMemo(
        () =>
            config.steps.map((step, i) => {
                const allChecked = step.checklistItems.every(
                    (item) => state.checklist[`${step.id}-${item.id}`]
                );
                const bonus =
                    step.verificationQuestion &&
                    state.verificationSubmitted[step.id] &&
                    state.verificationAnswers[step.id] === step.verificationQuestion.correctIndex
                        ? questionBonus(state.verificationRetries?.[step.id] ?? 0)
                        : 0;
                const stepScore = (allChecked ? CHECKLIST_POINTS_PER_STEP : 0) + bonus;
                const stepMax =
                    CHECKLIST_POINTS_PER_STEP + (step.verificationQuestion ? QUESTION_BONUS : 0);
                return {
                    icon: config.toolIcon,
                    title: `Stap ${i + 1}: ${step.title}`,
                    score: stepScore,
                    max: stepMax,
                };
            }),
        [state, config.steps, config.toolIcon]
    );

    function handleCheckItem(stepId: string, itemId: string) {
        const key = `${stepId}-${itemId}`;
        setState((prev) => {
            // Bewijs-item is een eenrichtings-bevestiging: alleen aanvinken, nooit
            // afvinken. Zo is de handler idempotent en dubbelklik-veilig — twee
            // snelle klikken heffen elkaar niet op en corrumperen de voortgang niet.
            if (prev.checklist[key]) return prev;
            return {
                ...prev,
                checklist: { ...prev.checklist, [key]: true },
            };
        });
    }

    function handleToggleTeacherCheck(stepId: string) {
        setState((prev) => ({
            ...prev,
            teacherChecks: { ...(prev.teacherChecks || {}), [stepId]: !prev.teacherChecks?.[stepId] },
        }));
    }

    function handleSelectAnswer(stepId: string, index: number) {
        setState((prev) => ({
            ...prev,
            verificationAnswers: { ...prev.verificationAnswers, [stepId]: index },
        }));
    }

    function handleSubmitAnswer(stepId: string) {
        setState((prev) => ({
            ...prev,
            verificationSubmitted: { ...prev.verificationSubmitted, [stepId]: true },
        }));
    }

    function handleRetryAnswer(stepId: string) {
        setState((prev) => {
            const verificationAnswers = { ...prev.verificationAnswers };
            delete verificationAnswers[stepId];
            const retries = prev.verificationRetries ?? {};

            return {
                ...prev,
                verificationAnswers,
                verificationSubmitted: { ...prev.verificationSubmitted, [stepId]: false },
                // De herkansknop verschijnt alleen ná een fout antwoord, dus elke
                // herkansing is precies één misser voor de kennisbonus.
                verificationRetries: { ...retries, [stepId]: (retries[stepId] ?? 0) + 1 },
            };
        });
    }

    function handleNext() {
        const isLast = stepIndex >= config.steps.length - 1;
        if (isLast) {
            setState((prev) => ({ ...prev, phase: 'results' }));
        } else {
            setState((prev) => ({ ...prev, currentStep: stepIndex + 1 }));
        }
    }

    async function handleComplete() {
        // Pas wissen als de host de voltooiing bevestigd heeft. Mislukt het
        // opslaan, dan houdt de leerling zijn voortgang en kan hij de knop
        // opnieuw gebruiken in plaats van met lege handen te staan.
        const completed = await onComplete(true, toScorePercent(score, config.maxScore));
        if (completed !== false) {
            clearSave();
        }
    }

    function handleRetryMission() {
        // Het resultatenscherm heeft geen eigen navigatie en staat in de
        // opgeslagen voortgang: zonder deze uitweg zit een leerling met een
        // herstelde deelscore onder de slaagdrempel vast, ook na herladen.
        // Terug naar de stappen mét behoud van afgevinkt bewijs — daar kan hij
        // de ontbrekende checkpunten alsnog doen of via Terug de missie verlaten.
        setState((prev) => ({ ...prev, phase: 'steps', currentStep: 0 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                onStart={() => setState((prev) => ({ ...prev, phase: 'steps' }))}
            />
        );
    }

    if (state.phase === 'results') {
        return (
            <CompletionScreen
                score={score}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phaseScores}
                takeaways={config.takeaways}
                onComplete={handleComplete}
                onRetry={handleRetryMission}
            />
        );
    }

    // steps phase
    return (
        <div className="min-h-screen bg-duck-bg p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={stepIndex}
                    totalPhases={config.steps.length}
                    totalScore={score}
                    onBack={onBack}
                />
                <StepCard
                    // Key op de stap-id: zonder remount blijft de focus achter op
                    // de verdwenen knop en hoort een schermlezer de nieuwe stap niet.
                    key={currentStepData.id}
                    step={currentStepData}
                    stepIndex={stepIndex}
                    totalSteps={config.steps.length}
                    toolIcon={config.toolIcon}
                    checklist={state.checklist}
                    teacherChecks={state.teacherChecks || {}}
                    verificationAnswer={state.verificationAnswers[currentStepData.id]}
                    verificationSubmitted={!!state.verificationSubmitted[currentStepData.id]}
                    onCheckItem={handleCheckItem}
                    onToggleTeacherCheck={handleToggleTeacherCheck}
                    onSelectAnswer={handleSelectAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                    onRetryAnswer={handleRetryAnswer}
                    onNext={handleNext}
                    isLastStep={stepIndex === config.steps.length - 1}
                />
            </div>
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

export const ToolGuide: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<ToolGuideConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_TOOL_GUIDE_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is ToolGuideConfig => !!v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-duck-ink/70 mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="min-h-11 min-w-11 px-4 py-2 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <ToolGuideInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
