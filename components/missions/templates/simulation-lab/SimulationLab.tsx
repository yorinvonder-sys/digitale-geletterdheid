import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import type { TemplateMissionProps, BadgeConfig } from '../shared/types';

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
}

export interface Simulation {
    id: string;
    title: string;
    description: string;
    parameters: Parameter[];
    visualType: 'bar-chart' | 'meter' | 'comparison';
    questions: SimQuestion[];
    maxScore: number;
}

export interface SimulationLabConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
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
}

// ─── Inline visual components ─────────────────────────────────────────────────

const BarChartVis: React.FC<{ data: BarChartData }> = ({ data }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="flex items-end gap-2 h-36 w-full px-2">
            {data.map((bar) => {
                const heightPct = Math.max((bar.value / max) * 100, 2);
                return (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                        <span
                            className="text-xs font-bold"
                            style={{ color: bar.color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {bar.value}
                        </span>
                        <div
                            className="w-full rounded-t-lg transition-all duration-500"
                            style={{
                                height: `${heightPct}%`,
                                backgroundColor: bar.color,
                                minHeight: 4,
                            }}
                        />
                        <span
                            className="text-[10px] text-[#6B6B66] text-center leading-tight"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {bar.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const MeterVis: React.FC<{ data: MeterData }> = ({ data }) => {
    const clamped = Math.max(0, Math.min(100, data.value));
    // HSL: 0 = red, 120 = green — but we want red = low privacy (0), green = high privacy (100)
    const hue = Math.round((clamped / 100) * 120);
    const color = `hsl(${hue}, 70%, 45%)`;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#E8E6DF" strokeWidth="10" />
                <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                />
                <text
                    x="60"
                    y="64"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="900"
                    fill="#1A1A19"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {clamped}
                </text>
            </svg>
            <span
                className="text-sm font-bold text-[#1A1A19]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {data.label}
            </span>
            {data.sublabel && (
                <span
                    className="text-xs text-[#6B6B66] text-center"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {data.sublabel}
                </span>
            )}
        </div>
    );
};

const ComparisonVis: React.FC<{ data: ComparisonData }> = ({ data }) => (
    <div className="flex gap-2 w-full">
        {[
            { title: data.leftTitle, items: data.leftItems, accent: '#D97757' },
            { title: data.rightTitle, items: data.rightItems, accent: '#10B981' },
        ].map((panel) => (
            <div
                key={panel.title}
                className="flex-1 rounded-xl border border-[#E8E6DF] overflow-hidden"
            >
                <div
                    className="px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white"
                    style={{
                        background: panel.accent,
                        fontFamily: "'Outfit', system-ui, sans-serif",
                    }}
                >
                    {panel.title}
                </div>
                <div className="p-2 space-y-1.5 bg-white">
                    {panel.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-sm">{item.icon}</span>
                            <span
                                className="text-xs text-[#3D3D38] leading-tight"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// ─── Parameter controls ───────────────────────────────────────────────────────

const ParameterControl: React.FC<{
    param: Parameter;
    value: number | string | boolean;
    onChange: (val: number | string | boolean) => void;
}> = ({ param, value, onChange }) => {
    if (param.type === 'slider') {
        const v = value as number;
        return (
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label
                        className="text-xs font-bold text-[#3D3D38]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {param.label}
                    </label>
                    <span
                        className="text-xs font-black text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {v}
                    </span>
                </div>
                <input
                    type="range"
                    min={param.min ?? 0}
                    max={param.max ?? 100}
                    step={param.step ?? 1}
                    value={v}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full accent-[#D97757]"
                />
                <div className="flex justify-between text-[10px] text-[#6B6B66]">
                    <span>{param.min ?? 0}</span>
                    <span>{param.max ?? 100}</span>
                </div>
            </div>
        );
    }

    if (param.type === 'toggle') {
        const v = value as boolean;
        return (
            <div className="flex items-center justify-between">
                <label
                    className="text-xs font-bold text-[#3D3D38]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <button
                    onClick={() => onChange(!v)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                        v ? 'bg-[#D97757]' : 'bg-[#E8E6DF]'
                    }`}
                >
                    <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                            v ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        );
    }

    if (param.type === 'select') {
        const v = value as string;
        return (
            <div className="space-y-1">
                <label
                    className="text-xs font-bold text-[#3D3D38] block"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <div className="flex flex-col gap-1">
                    {(param.options ?? []).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                                v === opt
                                    ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                    : 'bg-white border-[#E8E6DF] text-[#3D3D38] hover:border-[#D97757]/50'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

// ─── Question component ───────────────────────────────────────────────────────

const QuestionCard: React.FC<{
    question: SimQuestion;
    answer: string | number | undefined;
    submitted: boolean;
    onAnswer: (val: string | number) => void;
    onSubmit: () => void;
}> = ({ question, answer, submitted, onAnswer, onSubmit }) => {
    const isCorrect = submitted && answer === question.correctAnswer;
    const isWrong = submitted && answer !== question.correctAnswer;

    return (
        <div
            className={`rounded-2xl border p-4 transition-all duration-300 ${
                isCorrect
                    ? 'border-[#10B981] bg-[#10B981]/5'
                    : isWrong
                    ? 'border-[#D97757] bg-[#D97757]/5'
                    : 'border-[#E8E6DF] bg-white'
            }`}
        >
            <div className="flex items-start gap-2 mb-3">
                <Lightbulb size={14} className="text-[#D97757] mt-0.5 flex-shrink-0" />
                <p
                    className="text-sm font-bold text-[#1A1A19]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {question.question}
                </p>
            </div>

            {/* Options */}
            {question.options && (
                <div className="space-y-1.5 mb-3">
                    {question.options.map((opt) => {
                        const isSelected = answer === opt;
                        const isThisCorrect = submitted && opt === question.correctAnswer;
                        const isThisWrong = submitted && isSelected && opt !== question.correctAnswer;
                        return (
                            <button
                                key={opt}
                                disabled={submitted}
                                onClick={() => onAnswer(opt)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 border flex items-center gap-2 ${
                                    isThisCorrect
                                        ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-bold'
                                        : isThisWrong
                                        ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                        : isSelected
                                        ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                        : 'bg-white border-[#E8E6DF] text-[#3D3D38] hover:border-[#D97757]/40 disabled:opacity-70'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {isThisCorrect && <CheckCircle size={12} />}
                                {isThisWrong && <XCircle size={12} />}
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Submit button */}
            {!submitted && answer !== undefined && (
                <button
                    onClick={onSubmit}
                    className="w-full py-2 bg-gradient-to-r from-[#D97757] to-[#C46849] text-white rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer antwoord
                </button>
            )}

            {/* Feedback */}
            {submitted && (
                <div
                    className={`flex items-start gap-2 mt-2 p-2 rounded-lg text-xs ${
                        isCorrect ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#D97757]/10 text-[#D97757]'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {isCorrect ? (
                        <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle size={12} className="mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <span className="font-bold">{isCorrect ? 'Goed! ' : 'Niet helemaal. '}</span>
                        {question.explanation}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface SimulationLabProps extends TemplateMissionProps {
    config: SimulationLabConfig;
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

    // Compute total score
    const totalScore = useMemo(() => {
        let score = 0;
        for (const sim of config.simulations) {
            for (const q of sim.questions) {
                if (state.questionSubmitted[q.id] && state.questionAnswers[q.id] === q.correctAnswer) {
                    score += q.points;
                }
            }
        }
        return score;
    }, [config.simulations, state.questionAnswers, state.questionSubmitted]);

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
                features={config.introFeatures}
                onStart={() => setState((prev) => ({ ...prev, phase: 'simulate' }))}
            />
        );
    }

    if (state.phase === 'results') {
        const phases = config.simulations.map((sim) => {
            const simScore = sim.questions.reduce((acc, q) => {
                if (state.questionSubmitted[q.id] && state.questionAnswers[q.id] === q.correctAnswer) {
                    return acc + q.points;
                }
                return acc;
            }, 0);
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

    return (
        <div className="min-h-screen bg-[#FAF9F0] p-4">
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
                            className="text-xs font-black text-[#D97757] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Simulatie {state.currentSim + 1} / {config.simulations.length}
                        </span>
                    </div>
                    <h2
                        className="text-xl font-black text-[#1A1A19]"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {currentSimData.title}
                    </h2>
                    <p
                        className="text-sm text-[#6B6B66] mt-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {currentSimData.description}
                    </p>
                </div>

                {/* "Probeer het!" prompt when not yet interacted */}
                {!hasInteracted && (
                    <div className="bg-[#D97757]/8 border border-[#D97757]/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                        <span className="text-lg">🔬</span>
                        <p
                            className="text-xs text-[#D97757] font-bold"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Probeer het! Speel met de instellingen en kijk wat er gebeurt.
                        </p>
                    </div>
                )}

                {/* Main sim layout: parameters left, visual right */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Parameters panel */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#E8E6DF] p-4 space-y-4">
                        <span
                            className="text-xs font-black text-[#6B6B66] uppercase tracking-widest"
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
                    <div className="flex-1 bg-white rounded-2xl border border-[#E8E6DF] p-4 flex flex-col items-center justify-center min-h-[220px]">
                        <span
                            className="text-xs font-black text-[#6B6B66] uppercase tracking-widest mb-4 self-start"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Live resultaat
                        </span>
                        {visualData?.type === 'bar-chart' && <BarChartVis data={visualData.data} />}
                        {visualData?.type === 'meter' && <MeterVis data={visualData.data} />}
                        {visualData?.type === 'comparison' && <ComparisonVis data={visualData.data} />}
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-3 mb-6">
                    <span
                        className="text-xs font-black text-[#6B6B66] uppercase tracking-widest"
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
                            onAnswer={(val) => handleAnswer(q.id, val)}
                            onSubmit={() => handleSubmitQuestion(q.id)}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    {state.currentSim > 0 ? (
                        <button
                            onClick={() => setState((prev) => ({ ...prev, currentSim: prev.currentSim - 1 }))}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-[#6B6B66] hover:text-[#1A1A19] transition-colors"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <ChevronLeft size={16} />
                            Vorige
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        disabled={!allQuestionsSubmitted}
                        onClick={handleNextSim}
                        className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                            allQuestionsSubmitted
                                ? 'bg-gradient-to-r from-[#D97757] to-[#C46849] text-white hover:from-[#C46849] hover:to-[#B05A3C]'
                                : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
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
                        className="text-center text-xs text-[#6B6B66] mt-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Beantwoord alle vragen om verder te gaan.
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97757] border-t-transparent" />
    </div>
);

export const SimulationLab: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<SimulationLabConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is SimulationLabConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-[#6B6B66] mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-[#D97757] text-white rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <SimulationLabInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
