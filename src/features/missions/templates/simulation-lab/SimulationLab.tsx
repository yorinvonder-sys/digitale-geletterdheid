import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Activity, ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, ClipboardCheck, SlidersHorizontal, Target, Zap } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { confidenceMultiplier } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { MissionGoalBanner } from '../shared/MissionGoalBanner';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';
import { SimulationVisual } from './sub/SimulationVisuals';
import { ParameterControl } from './sub/ParameterControl';
import { QuestionCard, isSimulationQuestionCorrect } from './sub/QuestionCard';

// ─── Config types ─────────────────────────────────────────────────────────────

export interface Parameter {
    id: string;
    label: string;
    type: 'slider' | 'toggle' | 'select';
    // slider
    min?: number;
    max?: number;
    step?: number;
    default?: number;
    // select
    options?: string[];
    defaultOption?: string;
    // toggle
    defaultToggle?: boolean;
}

export interface SimQuestion {
    id: string;
    question: string;
    type: 'prediction' | 'observation' | 'multiple-choice' | 'evidence-input';
    options?: string[];
    correctAnswer: string | number;
    requiredKeywords?: string[];
    minAnswerLength?: number;
    explanation: string;
    points: number;
    showConfidence?: boolean;
}

export interface Simulation {
    id: string;
    title: string;
    description: string;
    parameters: Parameter[];
    visualType: 'bar-chart' | 'meter' | 'comparison';
    questions: SimQuestion[];
    maxScore: number;
    followUp?: FollowUpQuestion;
}

export interface SimulationLabConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    simulations: Simulation[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    computeVisuals: (simId: string, params: Record<string, number | string | boolean>) => VisualData;
}

// ─── Visual data types ────────────────────────────────────────────────────────

export type BarChartData = { label: string; value: number; color: string }[];
export type MeterData = { value: number; label: string; sublabel?: string };
export type ComparisonData = {
    leftTitle: string;
    leftItems: { icon: string; label: string }[];
    rightTitle: string;
    rightItems: { icon: string; label: string }[];
};
export type VisualData =
    | { type: 'bar-chart'; data: BarChartData }
    | { type: 'meter'; data: MeterData }
    | { type: 'comparison'; data: ComparisonData };

// ─── State ────────────────────────────────────────────────────────────────────

interface SimulationLabState {
    phase: 'intro' | 'simulate' | 'results';
    currentSim: number;
    activeQuestionIndex?: Record<string, number>;
    parameterValues: Record<string, Record<string, number | string | boolean>>;
    questionAnswers: Record<string, string | number>;
    questionSubmitted: Record<string, boolean>;
    interacted: Record<string, boolean>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    followUpCorrect: Record<string, boolean>;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface SimulationLabProps extends TemplateMissionProps {
    config: SimulationLabConfig;
}

interface SimulationControlRoute {
    id: string;
    title: string;
    description: string;
    tag: string;
    feedback: string;
}

function clampScore(score: number, maxScore: number): number {
    return Math.min(Math.max(score, 0), maxScore);
}

function getVisualTypeLabel(type: Simulation['visualType']): string {
    switch (type) {
        case 'bar-chart':
            return 'grafiek';
        case 'comparison':
            return 'vergelijking';
        case 'meter':
        default:
            return 'meter';
    }
}

function buildSimulationControlRoutes(
    simulations: Simulation[],
    experienceDesign?: MissionExperienceDesign
): SimulationControlRoute[] {
    return simulations.slice(0, 3).map((sim, index) => ({
        id: sim.id,
        title: sim.title,
        description: index === 0
            ? getSimulationAction(sim, experienceDesign, true)
            : sim.description,
        tag: `${sim.parameters.length} controls · ${getVisualTypeLabel(sim.visualType)}`,
        feedback: index === 0
            ? 'Hypothese actief: begin met één instelling, kijk naar de live uitkomst en verklaar pas daarna je keuze.'
            : 'Goede route: je kiest eerst waar je effect verwacht, daarna bedien je de simulatie met bewijs.',
    }));
}

function getSimulationAction(
    sim: Simulation,
    experienceDesign?: MissionExperienceDesign,
    preferLaunchCopy = false
): string {
    if (preferLaunchCopy && experienceDesign?.firstTenSeconds) return experienceDesign.firstTenSeconds;
    return `Verander minimaal een instelling in "${sim.title}" en kijk wat de simulatie teruggeeft.`;
}

function getSimulationEvidence(sim: Simulation, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.evidenceMoment) return experienceDesign.evidenceMoment;
    return `Je bewijs is je gekozen instellingen, de live uitkomst en je antwoord op ${sim.questions.length} analysevraag/vragen.`;
}

function getSimulationFeedback(sim: Simulation, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.feedbackMoment) return experienceDesign.feedbackMoment;
    return sim.followUp
        ? 'Na de analysevraag krijg je feedback en daarna een bonuscheck.'
        : 'De meter of grafiek reageert live; je antwoordfeedback verklaart waarom.';
}

const SimulationBrief: React.FC<{
    sim: Simulation;
    experienceDesign?: MissionExperienceDesign;
}> = ({ sim, experienceDesign }) => (
    <section
        className="mb-3 grid shrink-0 gap-2 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] p-2 sm:grid-cols-3"
        data-qa="simulation-brief"
    >
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#D97848]">
                <Zap size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">Actie</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getSimulationAction(sim, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#0B453F]">
                <Target size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">Bewijs</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getSimulationEvidence(sim, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#5F947D]">
                <ClipboardCheck size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">Feedback</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getSimulationFeedback(sim, experienceDesign)}
            </p>
        </div>
    </section>
);

interface SimulationControlIntroProps {
    config: SimulationLabConfig;
    missionGoal?: MissionGoal;
    selectedRouteId: string | null;
    onSelectRoute: (routeId: string) => void;
    onStart: () => void;
    onBack: () => void;
}

const SimulationControlIntro: React.FC<SimulationControlIntroProps> = ({
    config,
    missionGoal,
    selectedRouteId,
    onSelectRoute,
    onStart,
    onBack,
}) => {
    const routes = buildSimulationControlRoutes(config.simulations, config.experienceDesign);
    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    const threshold = missionGoal?.criteria.threshold;
    const proofLabel = typeof threshold === 'number'
        ? `${threshold <= 1 ? Math.round(config.maxScore * threshold) : threshold}/${config.maxScore} punten`
        : `${missionGoal?.criteria.min ?? config.simulations.length} simulaties`;

    return (
        <div
            className="min-h-dvh overflow-y-auto bg-[#FCF6EA] px-3 py-4 sm:px-4 sm:py-6"
            data-qa="simulation-control-room"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            <div className="mx-auto grid w-full max-w-4xl gap-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:grid-cols-[1fr_0.84fr]">
                <section className="rounded-xl border border-[#D3C5AB] bg-[#FFFDF7] p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08283B] text-2xl text-white">
                            <span aria-hidden="true">{config.introEmoji}</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#D97848]">
                                Simulation Control Room
                            </p>
                            <h1
                                className="mt-1 text-xl font-black leading-tight text-[#08283B] sm:text-2xl"
                                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                            >
                                {config.introTitle}
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-[#445865]">
                                {config.introDescription}
                            </p>
                        </div>
                    </div>

                    {missionGoal && <MissionGoalBanner goal={missionGoal} compact className="mb-4" />}

                    <div className="mb-3 flex items-center gap-2 text-[#08283B]">
                        <SlidersHorizontal size={16} className="text-[#D97848]" />
                        <h2 className="text-sm font-black">
                            Kies eerst je simulatiehypothese
                        </h2>
                    </div>

                    <div className="grid gap-2" role="group" aria-label="Kies je eerste simulatiehypothese">
                        {routes.map((route) => {
                            const isSelected = route.id === selectedRouteId;
                            return (
                                <button
                                    key={route.id}
                                    type="button"
                                    onClick={() => onSelectRoute(route.id)}
                                    data-qa="simulation-control-route"
                                    aria-pressed={isSelected}
                                    className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/50 ${
                                        isSelected
                                            ? 'border-[#D97848] bg-[#D97848]/10 shadow-sm'
                                            : 'border-[#E7D8BD] bg-white hover:border-[#D97848]/70'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wide text-[#5F947D]">
                                                {route.tag}
                                            </p>
                                            <h3 className="mt-1 text-sm font-black leading-tight text-[#08283B]">
                                                {route.title}
                                            </h3>
                                            <p className="mt-1 text-xs leading-relaxed text-[#445865]">
                                                {route.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="mt-0.5 shrink-0 text-[#5F947D]" size={18} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed ${
                            selectedRoute
                                ? 'border-[#5F947D]/45 bg-[#5F947D]/10 text-[#0B453F]'
                                : 'border-[#E7D8BD] bg-white text-[#445865]'
                        }`}
                        data-qa="simulation-control-feedback"
                        aria-live="polite"
                    >
                        {selectedRoute
                            ? selectedRoute.feedback
                            : 'Maak eerst één hypothese actief. Daarna open je de live simulatie en verzamel je bewijs met controls.'}
                    </div>

                    <button
                        type="button"
                        onClick={onStart}
                        disabled={!selectedRoute}
                        data-qa="simulation-control-start"
                        className={`mt-4 flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/50 ${
                            selectedRoute
                                ? 'bg-[#08283B] text-white hover:bg-[#0B453F]'
                                : 'cursor-not-allowed bg-[#E7D8BD] text-[#445865]/60'
                        }`}
                    >
                        Start simulatiecontrole
                        <ChevronRight size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-3 flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-[#445865] transition-colors hover:text-[#08283B]"
                    >
                        <ArrowLeft size={13} />
                        Terug
                    </button>
                </section>

                <aside className="grid gap-3">
                    <section className="rounded-xl border border-[#D3C5AB] bg-white p-3" data-qa="simulation-control-queue">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-xs font-black uppercase tracking-widest text-[#08283B]">
                                Control stack
                            </h2>
                            <span className="rounded-lg bg-[#FCF6EA] px-2 py-1 text-[10px] font-black text-[#D97848]">
                                max {config.maxScore} pt
                            </span>
                        </div>
                        <div className="grid gap-2">
                            {config.simulations.map((sim, index) => (
                                <div key={sim.id} className="rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] p-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#5F947D]">
                                                {index + 1} · {getVisualTypeLabel(sim.visualType)}
                                            </p>
                                            <p className="truncate text-xs font-black text-[#08283B]">
                                                {sim.title}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-[#445865]">
                                            {sim.parameters.length} controls
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#D3C5AB] bg-[#FFFDF7] p-3" data-qa="simulation-control-safety">
                        <div className="mb-2 flex items-center gap-2">
                            <Target size={15} className="text-[#D97848]" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#D97848]">
                                Bewijspoort
                            </p>
                        </div>
                        <p className="text-sm font-black text-[#08283B]">
                            Doel: {proofLabel}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#445865]">
                            {config.experienceDesign?.evidenceMoment ?? missionGoal?.evidence ?? 'Je bewijs bestaat uit instellingen, live uitkomsten en analysefeedback.'}
                        </p>
                        <div className="mt-3 rounded-xl border border-[#E7D8BD] bg-white p-2 text-[11px] leading-relaxed text-[#445865]">
                            {config.experienceDesign?.antiBoringRule ?? 'Eerst bedienen, dan verklaren: de simulatie maakt je keuze zichtbaar voordat je antwoordt.'}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

const SimulationLabInner: React.FC<SimulationLabProps> = ({ onBack, onComplete, config }) => {
    const buildInitialParams = useCallback((): Record<string, Record<string, number | string | boolean>> => {
        const out: Record<string, Record<string, number | string | boolean>> = {};
        for (const sim of config.simulations) {
            out[sim.id] = {};
            for (const param of sim.parameters) {
                if (param.type === 'slider') out[sim.id][param.id] = param.default ?? param.min ?? 0;
                else if (param.type === 'toggle') out[sim.id][param.id] = param.defaultToggle ?? false;
                else if (param.type === 'select') out[sim.id][param.id] = param.defaultOption ?? (param.options?.[0] ?? '');
            }
        }
        return out;
    }, [config.simulations]);

    const INITIAL_STATE: SimulationLabState = {
        phase: 'intro',
        currentSim: 0,
        activeQuestionIndex: {},
        parameterValues: buildInitialParams(),
        questionAnswers: {},
        questionSubmitted: {},
        interacted: {},
        confidences: {},
        followUpAnswered: {},
        followUpCorrect: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<SimulationLabState>(
        config.missionId,
        INITIAL_STATE
    );
    const [selectedSimulationRoute, setSelectedSimulationRoute] = useState<string | null>(null);

    useEffect(() => {
        setSelectedSimulationRoute(null);
    }, [config.missionId]);

    const currentSimData = config.simulations[state.currentSim];
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    const activeQuestionIndex = Math.min(
        state.activeQuestionIndex?.[currentSimData?.id] ?? 0,
        Math.max(0, (currentSimData?.questions.length ?? 1) - 1)
    );
    const activeQuestion = currentSimData?.questions[activeQuestionIndex];

    const currentParams = state.parameterValues[currentSimData?.id] ?? {};

    const visualData = useMemo(() => {
        if (!currentSimData) return null;
        return config.computeVisuals(currentSimData.id, currentParams);
    }, [config, currentSimData, currentParams]);

    const scoreQuestion = useCallback(
        (q: SimQuestion): number => {
            if (!state.questionSubmitted[q.id]) return 0;

            const correct = isSimulationQuestionCorrect(q, state.questionAnswers[q.id]);

            if (correct) {
                const base = q.points;
                const multiplier = q.showConfidence
                    ? confidenceMultiplier(state.confidences[q.id], true)
                    : 1;
                return Math.round(base * multiplier);
            } else {
                if (q.showConfidence && state.confidences[q.id]) {
                    const penaltyMultiplier = confidenceMultiplier(state.confidences[q.id], false);
                    // penaltyMultiplier is negative, e.g. -0.5 or -0.2
                    return Math.round(q.points * penaltyMultiplier);
                }
                return 0;
            }
        },
        [state.questionAnswers, state.questionSubmitted, state.confidences]
    );

    // Compute total score
    const totalScore = useMemo(() => {
        let score = 0;
        for (const sim of config.simulations) {
            for (const q of sim.questions) {
                score += scoreQuestion(q);
            }
            if (state.followUpAnswered[sim.id] && state.followUpCorrect[sim.id] && sim.followUp) {
                score += sim.followUp.bonusPoints;
            }
        }
        return clampScore(score, config.maxScore);
    }, [config.simulations, config.maxScore, scoreQuestion, state.followUpAnswered, state.followUpCorrect]);
    const completedSimulations = config.simulations.filter((sim) => (
        sim.questions.every((q) => state.questionSubmitted[q.id])
        && (!sim.followUp || state.followUpAnswered[sim.id])
    )).length;
    const configuredThreshold = missionGoal?.criteria.threshold;
    const completionThreshold = typeof configuredThreshold === 'number'
        ? configuredThreshold <= 1 ? Math.round(config.maxScore * configuredThreshold) : configuredThreshold
        : 0;
    const requiredSimulations = missionGoal?.criteria.min ?? config.simulations.length;
    const isMissionComplete = completedSimulations >= requiredSimulations
        && (typeof configuredThreshold === 'number' ? totalScore >= completionThreshold : true);
    const completionStatus = {
        isComplete: isMissionComplete,
        title: isMissionComplete ? 'Simulatiebewijs compleet' : 'Nog niet voltooid',
        description: isMissionComplete
            ? `Je hebt ${completedSimulations}/${requiredSimulations} simulaties afgerond en je bewijs is opgeslagen.`
            : typeof configuredThreshold === 'number'
              ? `Rond minimaal ${requiredSimulations} simulaties af en haal ${completionThreshold}/${config.maxScore} punten.`
              : `Rond minimaal ${requiredSimulations} simulaties af inclusief analysevragen en eventuele bonuscheck.`,
    };

    // Check if all questions in current sim are submitted
    const allQuestionsSubmitted = currentSimData?.questions.every(
        (q) => state.questionSubmitted[q.id]
    ) ?? false;

    const handleParamChange = (simId: string, paramId: string, val: number | string | boolean) => {
        setState((prev) => ({
            ...prev,
            parameterValues: {
                ...prev.parameterValues,
                [simId]: {
                    ...prev.parameterValues[simId],
                    [paramId]: val,
                },
            },
            interacted: { ...prev.interacted, [simId]: true },
        }));
    };

    const handleAnswer = (questionId: string, val: string | number) => {
        if (state.questionSubmitted[questionId]) return;
        setState((prev) => ({
            ...prev,
            questionAnswers: { ...prev.questionAnswers, [questionId]: val },
        }));
    };

    const handleSubmitQuestion = (questionId: string) => {
        setState((prev) => ({
            ...prev,
            questionSubmitted: { ...prev.questionSubmitted, [questionId]: true },
        }));
    };

    const handleSetConfidence = (questionId: string, level: 1 | 2 | 3) => {
        setState((prev) => ({
            ...prev,
            confidences: { ...prev.confidences, [questionId]: level },
        }));
    };

    const handleFollowUpComplete = (simId: string, correct: boolean) => {
        setState((prev) => ({
            ...prev,
            followUpAnswered: { ...prev.followUpAnswered, [simId]: true },
            followUpCorrect: { ...prev.followUpCorrect, [simId]: correct },
        }));
    };

    const handleStartSelectedSimulation = () => {
        const selectedIndex = selectedSimulationRoute
            ? config.simulations.findIndex((sim) => sim.id === selectedSimulationRoute)
            : 0;

        setState((prev) => ({
            ...prev,
            phase: 'simulate',
            currentSim: selectedIndex >= 0 ? selectedIndex : 0,
        }));
    };

    const handleNextSim = () => {
        const next = state.currentSim + 1;
        if (next >= config.simulations.length) {
            setState((prev) => ({ ...prev, phase: 'results' }));
        } else {
            setState((prev) => ({ ...prev, currentSim: next }));
        }
    };

    const handleNextQuestion = () => {
        if (!currentSimData) return;
        setState((prev) => ({
            ...prev,
            activeQuestionIndex: {
                ...prev.activeQuestionIndex,
                [currentSimData.id]: Math.min(activeQuestionIndex + 1, currentSimData.questions.length - 1),
            },
        }));
    };

    const handleComplete = () => {
        clearSave();
        onComplete(isMissionComplete);
    };

    const simulationRoutes = buildSimulationControlRoutes(config.simulations, config.experienceDesign);
    const selectedRoute = simulationRoutes.find((route) => route.id === selectedSimulationRoute);
    const selectedRouteForCurrentSim = selectedRoute?.id === currentSimData?.id ? selectedRoute : null;

    // ─── Phases ───────────────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        if (config.experienceDesign) {
            return (
                <SimulationControlIntro
                    config={config}
                    missionGoal={missionGoal}
                    selectedRouteId={selectedSimulationRoute}
                    onSelectRoute={setSelectedSimulationRoute}
                    onStart={handleStartSelectedSimulation}
                    onBack={onBack}
                />
            );
        }

        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={[
                    ...(config.experienceDesign?.firstTenSeconds ? [config.experienceDesign.firstTenSeconds] : []),
                    ...(config.introFeatures ?? []),
                ]}
                onStart={() => setState((prev) => ({ ...prev, phase: 'simulate' }))}
            />
        );
    }

    if (state.phase === 'results') {
        const phases = config.simulations.map((sim) => {
            const questionScore = sim.questions.reduce((acc, q) => acc + scoreQuestion(q), 0);
            const followUpBonus = state.followUpAnswered[sim.id] && state.followUpCorrect[sim.id] && sim.followUp
                ? sim.followUp.bonusPoints
                : 0;
            const simScore = clampScore(questionScore + followUpBonus, sim.maxScore);
            return { icon: '🧪', title: sim.title, score: simScore, max: sim.maxScore };
        });

        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phases}
                evidence={missionGoal?.evidence}
                completionStatus={completionStatus}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // ─── Simulate phase ───────────────────────────────────────────────────────

    const hasInteracted = !!state.interacted[currentSimData.id];
    const followUpPending = allQuestionsSubmitted && !!currentSimData.followUp && !state.followUpAnswered[currentSimData.id];
    const canAdvance = allQuestionsSubmitted && !followUpPending;

    return (
        <div className="min-h-dvh overflow-hidden bg-[#FCF6EA] p-3 sm:p-4" data-qa="simulation-lab-active">
            <div className="mx-auto flex h-[calc(100dvh-1.5rem)] max-w-5xl flex-col overflow-hidden sm:h-[calc(100dvh-2rem)]">
                <PhaseHeader
                    currentPhase={state.currentSim + 1}
                    totalPhases={config.simulations.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                {/* Sim header */}
                <div className="mb-3 shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Simulatie {state.currentSim + 1} / {config.simulations.length}
                        </span>
                    </div>
                    <h2
                        className="text-lg font-black text-[#08283B] sm:text-xl"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {currentSimData.title}
                    </h2>
                    <p
                        className="mt-1 text-xs leading-snug text-[#445865] sm:text-sm"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {currentSimData.description}
                    </p>
                </div>

                {/* "Probeer het!" prompt when not yet interacted */}
                {!hasInteracted && (
                    <div className="mb-3 flex shrink-0 items-center gap-3 rounded-xl border border-[#D97848]/20 bg-[#D97848]/8 px-3 py-2">
                        <Activity size={17} className="shrink-0 text-[#D97848]" />
                        <p
                            className="text-xs text-[#D97848] font-bold"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {config.experienceDesign?.antiBoringRule ?? 'Probeer het! Speel met de instellingen en kijk wat er gebeurt.'}
                        </p>
                    </div>
                )}

                {selectedRouteForCurrentSim && (
                    <div
                        className="mb-3 flex shrink-0 items-start gap-3 rounded-xl border border-[#5F947D]/30 bg-[#5F947D]/10 px-3 py-2"
                        data-qa="simulation-selected-route"
                    >
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#5F947D]" />
                        <div>
                            <p
                                className="text-[10px] font-black uppercase tracking-widest text-[#0B453F]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Hypothese actief
                            </p>
                            <p
                                className="mt-0.5 text-xs font-bold leading-snug text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {selectedRouteForCurrentSim.title}: {selectedRouteForCurrentSim.description}
                            </p>
                        </div>
                    </div>
                )}

                <SimulationBrief sim={currentSimData} experienceDesign={config.experienceDesign} />

                <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="grid min-h-0 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <div className="min-h-0 overflow-y-auto rounded-2xl border border-[#E7D8BD] bg-white p-3">
                            <span
                                className="text-[10px] font-black uppercase tracking-widest text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Instellingen
                            </span>
                            <div className="mt-2 grid gap-2">
                                {currentSimData.parameters.map((param) => (
                                    <ParameterControl
                                        key={param.id}
                                        param={param}
                                        value={currentParams[param.id] ?? (
                                            param.type === 'slider' ? (param.default ?? param.min ?? 0)
                                            : param.type === 'toggle' ? (param.defaultToggle ?? false)
                                            : (param.defaultOption ?? param.options?.[0] ?? '')
                                        )}
                                        onChange={(val) => handleParamChange(currentSimData.id, param.id, val)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex min-h-[130px] flex-col items-center justify-center rounded-2xl border border-[#E7D8BD] bg-white p-3 sm:min-h-[170px] lg:min-h-0 xl:min-h-[130px]">
                            <span
                                className="mb-2 self-start text-[10px] font-black uppercase tracking-widest text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Live resultaat
                            </span>
                            <div className="flex max-h-[170px] w-full items-center justify-center overflow-hidden sm:max-h-[230px]">
                                {visualData && <SimulationVisual visualData={visualData} />}
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-col rounded-2xl border border-[#E7D8BD] bg-white p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span
                                className="text-[10px] font-black uppercase tracking-widest text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Vraag {activeQuestionIndex + 1}/{currentSimData.questions.length}
                            </span>
                            <span className="text-[10px] font-bold text-[#D97848]">
                                {currentSimData.questions.filter((q) => state.questionSubmitted[q.id]).length}/{currentSimData.questions.length} klaar
                            </span>
                        </div>

                        {activeQuestion && (
                            <QuestionCard
                                key={activeQuestion.id}
                                question={activeQuestion}
                                answer={state.questionAnswers[activeQuestion.id]}
                                submitted={!!state.questionSubmitted[activeQuestion.id]}
                                confidence={state.confidences[activeQuestion.id]}
                                onAnswer={(val) => handleAnswer(activeQuestion.id, val)}
                                onSetConfidence={(level) => handleSetConfidence(activeQuestion.id, level)}
                                onSubmit={() => handleSubmitQuestion(activeQuestion.id)}
                            />
                        )}

                        {activeQuestion && state.questionSubmitted[activeQuestion.id] && activeQuestionIndex < currentSimData.questions.length - 1 && (
                            <button
                                onClick={handleNextQuestion}
                                className="fixed inset-x-4 bottom-4 z-30 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#D97848] px-4 py-2 text-sm font-bold text-white shadow-2xl transition-all duration-200 active:scale-[0.98] sm:static sm:mt-3 sm:w-full sm:shadow-none"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Volgende vraag
                                <ChevronRight size={16} />
                            </button>
                        )}

                        {allQuestionsSubmitted && currentSimData.followUp && !state.followUpAnswered[currentSimData.id] && (
                            <div className="mt-3">
                                <FollowUpCard
                                    followUp={currentSimData.followUp}
                                    onComplete={(correct) => handleFollowUpComplete(currentSimData.id, correct)}
                                    theme="light"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-3 flex shrink-0 items-center justify-between">
                    {state.currentSim > 0 ? (
                        <button
                            onClick={() => setState((prev) => ({ ...prev, currentSim: prev.currentSim - 1 }))}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-[#445865] hover:text-[#08283B] transition-colors"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <ChevronLeft size={16} />
                            Vorige
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        disabled={!canAdvance}
                        onClick={handleNextSim}
                        className={`flex min-h-[40px] items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                            canAdvance
                                ? 'bg-gradient-to-r from-[#D97848] to-[#D97848] text-white hover:from-[#D97848] hover:to-[#D97848]'
                                : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                        }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {state.currentSim + 1 < config.simulations.length ? (
                            <>
                                Volgende simulatie
                                <ChevronRight size={16} />
                            </>
                        ) : (
                            <>
                                Bekijk resultaten
                                <ChevronRight size={16} />
                            </>
                        )}
                    </button>
                </div>

                {!allQuestionsSubmitted && (
                    <p
                        className="mt-1 text-center text-xs text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Beantwoord deze vraag en ga daarna door naar de volgende.
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97848] border-t-transparent" />
    </div>
);

export const SimulationLab: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<SimulationLabConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is SimulationLabConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-[#445865] mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-[#D97848] text-white rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <SimulationLabInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
