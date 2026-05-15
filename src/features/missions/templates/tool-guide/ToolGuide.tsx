import React, { useMemo, useState, useEffect } from 'react';
import { Check, ChevronRight, ClipboardCheck, Lightbulb } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, MissionGoal } from '../shared/types';

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
}

// ─── State ───────────────────────────────────────────────────────────────────

interface ToolGuideState {
    phase: 'intro' | 'steps' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    teacherChecks: Record<string, boolean>;
    verificationAnswers: Record<string, number>;
    verificationSubmitted: Record<string, boolean>;
}

// ─── Score helpers ────────────────────────────────────────────────────────────

const CHECKLIST_POINTS_PER_STEP = 10;
const QUESTION_BONUS = 5;

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
                score += QUESTION_BONUS;
            }
        }
    }
    return score;
}

// ─── Rich text renderer (marks **bold** sections) ────────────────────────────

function RichText({ text, className }: { text: string; className?: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={i} className="font-bold text-[#08283B]">
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
    onNext,
    isLastStep,
}) => {
    const allChecked = step.checklistItems.every(
        (item) => checklist[`${step.id}-${item.id}`]
    );

    const questionAnswered = !step.verificationQuestion || verificationSubmitted;
    const teacherApproved = !step.teacherCheck || !!teacherChecks[step.id];
    const canProceed = allChecked && questionAnswered && teacherApproved;

    const isCorrect =
        step.verificationQuestion &&
        verificationSubmitted &&
        verificationAnswer === step.verificationQuestion.correctIndex;

    const feedbackText =
        step.verificationQuestion && verificationSubmitted
            ? isCorrect
                ? step.verificationQuestion.explanation
                : `Nog niet. Het juiste antwoord is: ${
                      step.verificationQuestion.options[step.verificationQuestion.correctIndex]
                  }. ${step.verificationQuestion.explanation.replace(/^(Precies|Goed|Juist|Goed gedacht)!\s*/i, '')}`
            : '';

    return (
        <div className="w-full max-w-md">
            {/* Step counter */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#D97848] flex items-center justify-center">
                    <span
                        className="text-xs font-black text-white"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {stepIndex + 1}
                    </span>
                </div>
                <span
                    className="text-xs text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Stap {stepIndex + 1} van {totalSteps}
                </span>
                <span className="text-lg ml-auto">{toolIcon}</span>
            </div>

            {/* Title */}
            <h2
                className="text-xl font-black text-[#08283B] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {step.title}
            </h2>

            {/* Instruction */}
            <div className="bg-[#FFFDF7] rounded-2xl border border-[#E7D8BD] p-4 mb-3 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0B453F]">
                    <ClipboardCheck size={15} className="text-[#5F947D]" />
                    Doe dit nu
                </p>
                <p
                    className="text-base font-semibold text-[#08283B] leading-snug"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <RichText text={step.instruction} />
                </p>
            </div>

            {/* Tip */}
            {step.tip && (
                <div className="flex gap-2 bg-[#D97848]/8 border border-[#D97848]/20 rounded-xl p-3 mb-3">
                    <Lightbulb size={15} className="text-[#D97848] shrink-0 mt-0.5" />
                    <p
                        className="text-xs text-[#445865] leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {step.tip}
                    </p>
                </div>
            )}

            {/* Checklist */}
            <div className="bg-[#FFFDF7] rounded-2xl border border-[#E7D8BD] p-4 mb-3">
                <p
                    className="text-xs font-black text-[#D97848] uppercase tracking-widest mb-3"
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
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848] focus-visible:ring-offset-2 ${
                                    checked
                                        ? 'bg-[#5F947D]/8 border-[#5F947D]/30'
                                        : 'bg-[#FCF6EA] border-[#E7D8BD] hover:border-[#D97848]/40'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                        checked
                                            ? 'bg-[#5F947D] border-[#5F947D]'
                                            : 'border-[#E7D8BD]'
                                    }`}
                                >
                                    {checked && <Check size={11} className="text-white" strokeWidth={3} />}
                                </div>
                                <span
                                    className={`text-sm transition-all duration-200 ${
                                        checked ? 'text-[#5F947D] line-through' : 'text-[#445865]'
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
                <div className="bg-[#F3E4CB] rounded-2xl border border-[#E7D8BD] p-4 mb-3">
                    <p
                        className="text-xs font-black text-[#0B453F] uppercase tracking-widest mb-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Docentcheck
                    </p>
                    <p
                        className="text-sm text-[#445865] leading-relaxed mb-3"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {step.teacherCheck}
                    </p>
                    <button
                        onClick={() => onToggleTeacherCheck(step.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F947D] focus-visible:ring-offset-2 ${
                            teacherChecks[step.id]
                                ? 'bg-[#5F947D] border-[#5F947D] text-white'
                                : 'bg-[#FFFDF7] border-[#E7D8BD] text-[#08283B] hover:border-[#5F947D]/50'
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                teacherChecks[step.id]
                                    ? 'border-white bg-white/20'
                                    : 'border-[#E7D8BD]'
                            }`}
                        >
                            {teacherChecks[step.id] && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Mijn docent heeft dit gezien
                        </span>
                    </button>
                </div>
            )}

            {/* Verification question */}
            {step.verificationQuestion && allChecked && (
                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-3">
                    <p
                        className="text-xs font-black text-[#D97848] uppercase tracking-widest mb-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Checkpunt
                    </p>
                    <p
                        className="text-sm font-bold text-[#08283B] mb-3"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {step.verificationQuestion.question}
                    </p>
                    <div className="space-y-2 mb-3">
                        {step.verificationQuestion.options.map((option, i) => {
                            const selected = verificationAnswer === i;
                            let style = 'bg-[#FCF6EA] border-[#E7D8BD] hover:border-[#D97848]/40';
                            let textStyle = 'text-[#445865]';
                            if (verificationSubmitted) {
                                if (i === step.verificationQuestion!.correctIndex) {
                                    style = 'bg-[#5F947D]/8 border-[#5F947D]/40';
                                    textStyle = 'text-[#0B453F]';
                                } else if (selected) {
                                    style = 'bg-[#D97848]/15 border-[#D97848]/50';
                                    textStyle = 'text-[#08283B]';
                                }
                            } else if (selected) {
                                style = 'bg-[#D97848]/8 border-[#D97848]/40';
                                textStyle = 'text-[#08283B]';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() =>
                                        !verificationSubmitted && onSelectAnswer(step.id, i)
                                    }
                                    disabled={verificationSubmitted}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848] focus-visible:ring-offset-2 ${style}`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                            verificationSubmitted &&
                                            i === step.verificationQuestion!.correctIndex
                                                ? 'bg-[#5F947D] border-[#5F947D]'
                                                : selected && !verificationSubmitted
                                                  ? 'border-[#D97848] bg-[#D97848]'
                                                  : 'border-[#E7D8BD]'
                                        }`}
                                    >
                                        {((verificationSubmitted &&
                                            i === step.verificationQuestion!.correctIndex) ||
                                            (selected && !verificationSubmitted)) && (
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
                            className="w-full py-2.5 bg-[#D97848]/10 hover:bg-[#D97848]/20 text-[#D97848] rounded-xl text-sm font-bold transition-all duration-200 border border-[#D97848]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848] focus-visible:ring-offset-2"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Controleer antwoord
                        </button>
                    )}

                    {verificationSubmitted && (
                        <div
                            className={`flex gap-2 rounded-xl p-3 ${
                                isCorrect
                                    ? 'bg-[#5F947D]/8 border border-[#5F947D]/20'
                                    : 'bg-lab-gold/20 border border-lab-gold/50'
                            }`}
                        >
                            <span>{isCorrect ? '✓' : '!'}</span>
                            <p
                                className={`text-xs leading-relaxed ${
                                    isCorrect ? 'text-[#5F947D]' : 'text-[#08283B]'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {feedbackText}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Next button */}
            {canProceed && (
                <button
                    onClick={onNext}
                    className="w-full py-3.5 bg-[#D7C95F] hover:bg-[#CBC04F] text-[#08283B] rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#D7C95F]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {isLastStep ? 'Bekijk resultaten' : 'Volgende stap'}
                    <ChevronRight size={16} />
                </button>
            )}
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
    };

    const { state, setState, clearSave } = useMissionAutoSave<ToolGuideState>(
        config.missionId,
        initialState
    );

    const score = useMemo(() => computeScore(state, config.steps), [state, config.steps]);

    const currentStepData = config.steps[state.currentStep];

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
                        ? QUESTION_BONUS
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
        setState((prev) => ({
            ...prev,
            checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
        }));
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

    function handleNext() {
        const isLast = state.currentStep >= config.steps.length - 1;
        if (isLast) {
            setState((prev) => ({ ...prev, phase: 'results' }));
        } else {
            setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
        }
    }

    function handleComplete() {
        clearSave();
        onComplete(true);
    }

    if (state.phase === 'intro') {
        return (
            <IntroScreen
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
            />
        );
    }

    // steps phase
    return (
        <div className="min-h-screen bg-[#FCF6EA] p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={state.currentStep}
                    totalPhases={config.steps.length}
                    totalScore={score}
                    onBack={onBack}
                />
                <StepCard
                    step={currentStepData}
                    stepIndex={state.currentStep}
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
                    onNext={handleNext}
                    isLastStep={state.currentStep === config.steps.length - 1}
                />
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

export const ToolGuide: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<ToolGuideConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is ToolGuideConfig => v && typeof v === 'object' && 'missionId' in v);
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

    return <ToolGuideInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
