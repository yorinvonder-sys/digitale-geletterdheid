import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { StudentAIChat } from '@/components/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion } from '../shared/types';
import { MilestoneToast } from './sub/MilestoneToast';
import { MobileTabBar, type MobileTab } from './sub/MobileTabBar';
import { PreviewPanel } from './sub/PreviewPanel';
import { StepInstructionPanel } from './sub/StepInstructionPanel';
import type { BuilderCanvasState } from './sub/types';

// ─── Config types ────────────────────────────────────────────────────────────

export interface BuilderStep {
    id: string;
    title: string;
    description: string;
    instruction: string;
    tip?: string;
    checklistItems: Array<{ id: string; label: string }>;
    textPrompt?: string;
    reflectionQuestion?: FollowUpQuestion;
}

export interface BuilderCanvasConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    enableChat: boolean;
    chatRoleId?: string;
    previewType: 'markdown' | 'checklist-only' | 'text-preview';
    steps: BuilderStep[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface BuilderCanvasProps extends TemplateMissionProps {
    config: BuilderCanvasConfig;
}

const BuilderCanvasInner: React.FC<BuilderCanvasProps> = ({
    config,
    onBack,
    onComplete,
}) => {
    const initialState: BuilderCanvasState = {
        phase: 'intro',
        currentStep: 0,
        checklist: {},
        textEntries: {},
        completedSteps: [],
        reflectionAnswered: {},
        reflectionCorrect: {},
        showMilestone: false,
    };

    const { state, setState, clearSave } = useMissionAutoSave<BuilderCanvasState>(
        config.missionId,
        initialState
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<MobileTab>('instructies');

    const currentStepData = config.steps[state.currentStep];
    const pointsPerStep = Math.floor(config.maxScore / config.steps.length);

    // ─── Helpers ─────────────────────────────────────────────────────────

    const isStepComplete = useCallback(
        (stepId: string, step: BuilderStep): boolean => {
            return step.checklistItems.every((item) => state.checklist[`${stepId}-${item.id}`]);
        },
        [state.checklist]
    );

    const currentStepComplete = currentStepData
        ? isStepComplete(currentStepData.id, currentStepData)
        : false;

    const bonusScore = config.steps.reduce((acc, step) => {
        if (state.reflectionCorrect[step.id] && step.reflectionQuestion) {
            return acc + step.reflectionQuestion.bonusPoints;
        }
        return acc;
    }, 0);

    const totalScore = state.completedSteps.length * pointsPerStep + bonusScore;

    // ─── Handlers ────────────────────────────────────────────────────────

    const handleStart = () => {
        setState((prev) => ({ ...prev, phase: 'building' }));
    };

    const handleChecklistToggle = (itemKey: string) => {
        setState((prev) => ({
            ...prev,
            checklist: {
                ...prev.checklist,
                [itemKey]: !prev.checklist[itemKey],
            },
        }));
    };

    const handleTextChange = (stepId: string, value: string) => {
        setState((prev) => ({
            ...prev,
            textEntries: { ...prev.textEntries, [stepId]: value },
        }));
    };

    const handleNextStep = () => {
        if (!currentStepData) return;

        const updatedCompleted = state.completedSteps.includes(currentStepData.id)
            ? state.completedSteps
            : [...state.completedSteps, currentStepData.id];

        const isLastStep = state.currentStep === config.steps.length - 1;

        if (isLastStep) {
            setState((prev) => ({
                ...prev,
                completedSteps: updatedCompleted,
                phase: 'results',
            }));
        } else {
            setState((prev) => ({
                ...prev,
                completedSteps: updatedCompleted,
                currentStep: prev.currentStep + 1,
                showMilestone: true,
            }));
            setMobileTab('instructies');
            setTimeout(() => {
                setState((prev) => ({ ...prev, showMilestone: false }));
            }, 2000);
        }
    };

    const handleReflectionComplete = (stepId: string, correct: boolean) => {
        setState((prev) => ({
            ...prev,
            reflectionAnswered: { ...prev.reflectionAnswered, [stepId]: true },
            reflectionCorrect: { ...prev.reflectionCorrect, [stepId]: correct },
        }));
    };

    const handleComplete = () => {
        clearSave();
        onComplete(true);
    };

    // ─── Phase: Intro ─────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                onStart={handleStart}
            />
        );
    }

    // ─── Phase: Results ───────────────────────────────────────────────────

    if (state.phase === 'results') {
        const phaseBreakdown = config.steps.map((step, i) => ({
            icon: i === 0 ? '🎯' : i === 1 ? '🗂️' : i === 2 ? '✍️' : '💬',
            title: step.title,
            score: state.completedSteps.includes(step.id) ? pointsPerStep : 0,
            max: pointsPerStep,
        }));

        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phaseBreakdown}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // ─── Phase: Building ──────────────────────────────────────────────────

    const userId = (() => {
        try {
            const key = Object.keys(localStorage).find((k) =>
                /^sb-[a-z0-9_-]+-auth-token$/i.test(k)
            );
            if (!key) return null;
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw)?.user?.id : null;
        } catch {
            return null;
        }
    })();

    const completedStepIndex = state.completedSteps.length;
    const totalSteps = config.steps.length;

    return (
        <div className="min-h-screen bg-[#FCF6EA] flex flex-col">
            <MilestoneToast
                show={state.showMilestone}
                completedCount={completedStepIndex}
                totalCount={totalSteps}
            />

            {/* Header */}
            <div className="px-4 pt-4 pb-2 shrink-0">
                <PhaseHeader
                    currentPhase={state.currentStep}
                    totalPhases={config.steps.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />
            </div>

            <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

            {/* Main split layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left panel — instructions */}
                <div
                    className={`md:w-[45%] border-r border-[#E7D8BD] overflow-y-auto flex flex-col ${
                        mobileTab !== 'instructies' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    <StepInstructionPanel
                        stepData={currentStepData}
                        stepIndex={state.currentStep}
                        totalSteps={config.steps.length}
                        state={state}
                        isStepComplete={currentStepComplete}
                        onChecklistToggle={handleChecklistToggle}
                        onTextChange={handleTextChange}
                        onReflectionComplete={handleReflectionComplete}
                        onNextStep={handleNextStep}
                    />
                </div>

                {/* Right panel — preview */}
                <div
                    className={`md:w-[55%] overflow-hidden bg-white ${
                        mobileTab !== 'preview' ? 'hidden md:block' : 'block'
                    }`}
                >
                    <PreviewPanel config={config} state={state} />
                </div>
            </div>

            {/* AI Chat overlay */}
            {config.enableChat && (
                <>
                    <StudentAIChat
                        roleId={config.chatRoleId ?? 'student-assistant'}
                        userIdentifier={userId ?? 'anonymous'}
                        isOpen={isChatOpen}
                        onOpenChange={setIsChatOpen}
                        context={{
                            currentStep: {
                                title: currentStepData?.title,
                                instruction: currentStepData?.instruction,
                                tip: currentStepData?.tip,
                            },
                            progress: {
                                step: state.currentStep + 1,
                                total: config.steps.length,
                                completedSteps: state.completedSteps.length,
                            },
                            textEntry: currentStepData
                                ? state.textEntries[currentStepData.id] ?? ''
                                : '',
                        }}
                    />

                    {/* Floating chat button — only visible when chat is closed */}
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-gradient-to-br from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
                            aria-label="Open AI-assistent"
                        >
                            <MessageCircle size={22} />
                        </button>
                    )}
                </>
            )}

            {/* Back button for mobile preview */}
            {mobileTab === 'preview' && (
                <div className="md:hidden fixed bottom-20 left-4 z-30">
                    <button
                        onClick={() => setMobileTab('instructies')}
                        className="flex items-center gap-2 bg-white border border-[#E7D8BD] rounded-full px-4 py-2 shadow-sm text-sm font-bold text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ArrowLeft size={14} />
                        Instructies
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97848] border-t-transparent" />
    </div>
);

export const BuilderCanvas: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<BuilderCanvasConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is BuilderCanvasConfig => v && typeof v === 'object' && 'missionId' in v);
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

    return <BuilderCanvasInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
