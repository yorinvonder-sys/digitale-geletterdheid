import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { confidenceMultiplier } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal } from '../shared/types';
import { SimulationVisual } from './sub/SimulationVisuals';
import { ParameterControl } from './sub/ParameterControl';
import { QuestionCard } from './sub/QuestionCard';

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
    type: 'prediction' | 'observation' | 'multiple-choice';
    options?: string[];
    correctAnswer: string | number;
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

function clampScore(score: number, maxScore: number): number {
    return Math.min(Math.max(score, 0), maxScore);
}

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

    const currentSimData = config.simulations[state.currentSim];

    const currentParams = state.parameterValues[currentSimData?.id] ?? {};

    const visualData = useMemo(() => {
        if (!currentSimData) return null;
        return config.computeVisuals(currentSimData.id, currentParams);
    }, [config, currentSimData, currentParams]);

    const scoreQuestion = useCallback(
        (q: SimQuestion): number => {
            if (!state.questionSubmitted[q.id]) return 0;

            const correct = state.questionAnswers[q.id] === q.correctAnswer;
            if (!correct && !(q.showConfidence && state.confidences[q.id])) return 0;

            const base = correct ? q.points : 0;
            const multiplier = q.showConfidence
                ? confidenceMultiplier(state.confidences[q.id], correct)
                : 1;

            return clampScore(Math.round(base * multiplier), q.points);
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

    const handleNextSim = () => {
        const next = state.currentSim + 1;
        if (next >= config.simulations.length) {
            setState((prev) => ({ ...prev, phase: 'results' }));
        } else {
            setState((prev) => ({ ...prev, currentSim: next }));
        }
    };

    const handleComplete = () => {
        clearSave();
        onComplete(true);
    };

    // ─── Phases ───────────────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                features={config.introFeatures}
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
        <div className="min-h-screen bg-duck-bg p-4">
            <div className="max-w-2xl mx-auto">
                <PhaseHeader
                    currentPhase={state.currentSim + 1}
                    totalPhases={config.simulations.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                {/* Sim header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className="text-xs font-black text-duck-ink uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Simulatie {state.currentSim + 1} / {config.simulations.length}
                        </span>
                    </div>
                    <h2
                        className="text-xl font-black text-duck-ink"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {currentSimData.title}
                    </h2>
                    <p
                        className="text-sm text-duck-ink/60 mt-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {currentSimData.description}
                    </p>
                </div>

                {/* "Probeer het!" prompt when not yet interacted */}
                {!hasInteracted && (
                    <div className="bg-duck-acid/8 border border-duck-acid/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                        <span className="text-lg">🔬</span>
                        <p
                            className="text-xs text-duck-ink font-bold"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Probeer het! Speel met de instellingen en kijk wat er gebeurt.
                        </p>
                    </div>
                )}

                {/* Main sim layout: parameters left, visual right */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Parameters panel */}
                    <div className="flex-1 bg-white rounded-2xl border border-duck-gray p-4 space-y-4">
                        <span
                            className="text-xs font-black text-duck-ink/60 uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Instellingen
                        </span>
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

                    {/* Visual panel */}
                    <div className="flex-1 bg-white rounded-2xl border border-duck-gray p-4 flex flex-col items-center justify-center min-h-[220px]">
                        <span
                            className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 self-start"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Live resultaat
                        </span>
                        {visualData && <SimulationVisual visualData={visualData} />}
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-3 mb-6">
                    <span
                        className="text-xs font-black text-duck-ink/60 uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Vragen
                    </span>
                    {currentSimData.questions.map((q) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            answer={state.questionAnswers[q.id]}
                            submitted={!!state.questionSubmitted[q.id]}
                            confidence={state.confidences[q.id]}
                            onAnswer={(val) => handleAnswer(q.id, val)}
                            onSetConfidence={(level) => handleSetConfidence(q.id, level)}
                            onSubmit={() => handleSubmitQuestion(q.id)}
                        />
                    ))}
                </div>

                {/* Follow-up card after all questions are answered */}
                {allQuestionsSubmitted && currentSimData.followUp && !state.followUpAnswered[currentSimData.id] && (
                    <FollowUpCard
                        followUp={currentSimData.followUp}
                        onComplete={(correct) => handleFollowUpComplete(currentSimData.id, correct)}
                        theme="light"
                    />
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6">
                    {state.currentSim > 0 ? (
                        <button
                            onClick={() => setState((prev) => ({ ...prev, currentSim: prev.currentSim - 1 }))}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-duck-ink/60 hover:text-duck-ink transition-colors"
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
                        className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                            canAdvance
                                ? 'bg-gradient-to-r from-duck-acid to-duck-acid text-duck-ink hover:from-duck-acid hover:to-duck-acid'
                                : 'bg-duck-gray text-duck-ink/60 cursor-not-allowed'
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
                        className="text-center text-xs text-duck-ink/60 mt-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Beantwoord alle vragen om verder te gaan.
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_SIMULATION_LAB_IDS: ReadonlySet<string> = new Set([
    'ai-spiegel',
    'algorithm-architect',
    'bug-hunter',
    'code-reviewer',
    'privacy-by-design',
]);

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

export const SimulationLab: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<SimulationLabConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_SIMULATION_LAB_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is SimulationLabConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-duck-ink/60 mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <SimulationLabInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
