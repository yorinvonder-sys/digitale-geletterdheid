import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles, TestTube2 } from 'lucide-react';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';
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
    minTextLength?: number;
    reflectionQuestion?: FollowUpQuestion;
}

export interface BuilderCanvasConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
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

const launchChoices = [
    {
        id: 'core-test',
        label: 'Test de kern',
        description: 'Check eerst of de belangrijkste functie of boodschap werkt.',
    },
    {
        id: 'proof-first',
        label: 'Pin je bewijs',
        description: 'Kies welk bewijs straks laat zien dat je product klopt.',
    },
    {
        id: 'improve-loop',
        label: 'Verbeter na feedback',
        description: 'Maak ruimte voor een test, reactie en volgende versie.',
    },
];

interface BuilderLaunchChallengeProps {
    config: BuilderCanvasConfig;
    selectedChoiceId?: string;
    onSelect: (choiceId: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

const BuilderLaunchChallenge: React.FC<BuilderLaunchChallengeProps> = ({
    config,
    selectedChoiceId,
    onSelect,
    onContinue,
    onBack,
}) => {
    const experience = config.experienceDesign;
    const selectedChoice = launchChoices.find((choice) => choice.id === selectedChoiceId);

    return (
        <main
            className="min-h-dvh bg-[#FCF6EA] px-4 py-5 sm:px-6 lg:px-10"
            data-qa="builder-launch-challenge"
        >
            <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-6xl flex-col">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-4 inline-flex min-h-[40px] w-fit items-center gap-2 rounded-xl border border-[#E7D8BD] bg-white px-3 text-sm font-bold text-[#445865] shadow-sm transition-colors hover:border-[#D97848]/40 hover:text-[#08283B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                    Terug
                </button>

                <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                    <div className="flex flex-col justify-between rounded-2xl border border-[#E7D8BD] bg-white p-5 shadow-sm sm:p-6">
                        <div>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B453F] text-white">
                                    <TestTube2 size={22} />
                                </div>
                                <div>
                                    <p
                                        className="text-[11px] font-black uppercase tracking-widest text-[#D97848]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Maker test
                                    </p>
                                    <h1
                                        className="text-2xl font-black leading-tight text-[#08283B] sm:text-3xl"
                                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                    >
                                        {config.title}
                                    </h1>
                                </div>
                            </div>

                            <p
                                className="max-w-2xl text-base leading-relaxed text-[#445865] sm:text-lg"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {experience?.firstTenSeconds ?? 'Kies eerst hoe je jouw product gaat testen voordat je begint met bouwen.'}
                            </p>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            {launchChoices.map((choice) => {
                                const isSelected = choice.id === selectedChoiceId;

                                return (
                                    <button
                                        key={choice.id}
                                        type="button"
                                        onClick={() => onSelect(choice.id)}
                                        data-qa="builder-launch-choice"
                                        className={`min-h-[116px] rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2 ${
                                            isSelected
                                                ? 'border-[#0B453F] bg-[#0B453F] text-white shadow-md'
                                                : 'border-[#E7D8BD] bg-[#FFFDF7] text-[#445865] hover:border-[#D97848]/50 hover:bg-white'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-[#08283B]'}`}>
                                                {choice.label}
                                            </span>
                                            {isSelected ? <CheckCircle2 size={18} /> : <Sparkles size={16} className="text-[#D97848]" />}
                                        </div>
                                        <p className={`text-sm leading-snug ${isSelected ? 'text-white/85' : 'text-[#445865]'}`}>
                                            {choice.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside
                        className="flex min-h-[360px] flex-col justify-between rounded-2xl border border-[#E7D8BD] bg-[#08283B] p-5 text-white shadow-sm sm:p-6"
                        data-qa="builder-launch-feedback"
                    >
                        <div>
                            <p
                                className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#F3C766]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Testfeedback
                            </p>
                            <h2
                                className="text-xl font-black leading-tight sm:text-2xl"
                                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                            >
                                {selectedChoice ? selectedChoice.label : 'Kies je eerste test'}
                            </h2>
                            <p
                                className="mt-3 text-sm leading-relaxed text-white/78"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {selectedChoice
                                    ? experience?.feedbackMoment ?? 'Je keuze bepaalt waar je tijdens het bouwen extra op let.'
                                    : 'Maak eerst een keuze. Daarna zie je hoe deze missie je productbewijs scherper maakt.'}
                            </p>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                                <p
                                    className="text-[11px] font-black uppercase tracking-widest text-[#F3C766]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Bewijs dat telt
                                </p>
                                <p
                                    className="mt-2 text-sm leading-relaxed text-white/82"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {experience?.evidenceMoment ?? 'Je rondt deze missie af met zichtbaar productbewijs en een korte reflectie op je keuzes.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onContinue}
                                disabled={!selectedChoiceId}
                                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D97848] px-4 text-sm font-black text-white shadow-sm transition-all hover:bg-[#C5673A] disabled:cursor-not-allowed disabled:bg-white/18 disabled:text-white/50"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Start canvas
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
};

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
        testedSteps: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<BuilderCanvasState>(
        config.missionId,
        initialState
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<MobileTab>('instructies');

    const currentStepData = config.steps[state.currentStep];
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    const pointsPerStep = Math.floor(config.maxScore / config.steps.length);

    // ─── Helpers ─────────────────────────────────────────────────────────

    const isStepComplete = useCallback(
        (stepId: string, step: BuilderStep): boolean => {
            const checklistComplete = step.checklistItems.every((item) => state.checklist[`${stepId}-${item.id}`]);
            const requiredLength = step.textPrompt ? (step.minTextLength ?? 40) : 0;
            const textComplete = !requiredLength || (state.textEntries[stepId]?.trim().length ?? 0) >= requiredLength;
            return checklistComplete && textComplete;
        },
        [state.checklist, state.textEntries]
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
    const allStepsComplete = config.steps.every((step) => state.completedSteps.includes(step.id));
    const completionStatus = {
        isComplete: allStepsComplete,
        title: allStepsComplete ? 'Canvasbewijs compleet' : 'Nog niet voltooid',
        description: allStepsComplete
            ? `Alle ${config.steps.length} canvasstappen zijn uitgewerkt met checklist en tekstbewijs.`
            : 'Rond alle canvasstappen af met checklist en tekstbewijs voordat deze missie voltooid telt.',
    };

    // ─── Handlers ────────────────────────────────────────────────────────

    const handleStart = () => {
        setState((prev) => ({
            ...prev,
            phase: config.experienceDesign ? 'launch' : 'building',
        }));
    };

    const handleLaunchSelect = (choiceId: string) => {
        setState((prev) => ({ ...prev, launchChoiceId: choiceId }));
    };

    const handleLaunchContinue = () => {
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

    const handleTestLensSelect = (lensId: string) => {
        setState((prev) => ({ ...prev, testLensId: lensId }));
    };

    const handleMarkCurrentStepTested = () => {
        if (!currentStepData) return;
        setState((prev) => ({
            ...prev,
            testedSteps: {
                ...prev.testedSteps,
                [currentStepData.id]: true,
            },
        }));
    };

    const handleComplete = () => {
        clearSave();
        onComplete(allStepsComplete);
    };

    // ─── Phase: Intro ─────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={config.introFeatures}
                onStart={handleStart}
            />
        );
    }

    // ─── Phase: Launch challenge ─────────────────────────────────────────

    if (state.phase === 'launch') {
        return (
            <BuilderLaunchChallenge
                config={config}
                selectedChoiceId={state.launchChoiceId}
                onSelect={handleLaunchSelect}
                onContinue={handleLaunchContinue}
                onBack={() => setState((prev) => ({ ...prev, phase: 'intro' }))}
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
                evidence={missionGoal?.evidence}
                completionStatus={completionStatus}
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
        <div className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-[#FCF6EA]">
            <MilestoneToast
                show={state.showMilestone}
                completedCount={completedStepIndex}
                totalCount={totalSteps}
            />

            {/* Header */}
            <div className="px-3 pt-3 pb-2 shrink-0 md:px-4 md:pt-4">
                <PhaseHeader
                    currentPhase={state.currentStep}
                    totalPhases={config.steps.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />
            </div>

            <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

            {config.enableChat && (
                <div className="md:hidden flex justify-end border-b border-[#E7D8BD] bg-[#FCF6EA] px-3 py-2">
                    <button
                        type="button"
                        onClick={() => setIsChatOpen(true)}
                        className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[#E7D8BD] bg-white px-3 text-xs font-bold text-[#445865] shadow-sm transition-colors hover:border-[#D97848]/40 hover:text-[#08283B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        aria-label="Open AI Coach"
                    >
                        <MessageCircle size={14} />
                        AI Coach
                    </button>
                </div>
            )}

            {/* Main split layout */}
            <div className="min-h-0 flex-1 flex flex-col overflow-hidden md:flex-row">
                {/* Left panel — instructions */}
                <div
                    className={`min-h-0 border-r border-[#E7D8BD] flex flex-col overflow-y-auto md:w-[45%] ${
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
                    className={`min-h-0 overflow-hidden bg-white md:w-[55%] ${
                        mobileTab !== 'preview' ? 'hidden md:block' : 'block'
                    }`}
                >
                    <PreviewPanel
                        config={config}
                        state={state}
                        onTestLensSelect={handleTestLensSelect}
                        onMarkCurrentStepTested={handleMarkCurrentStepTested}
                    />
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
                        mobileDock="safe"
                        hideUntilCookieChoice
                        hideMobileLauncher
                        context={{
                            mission: {
                                id: config.missionId,
                                title: config.title,
                                goal: missionGoal?.primaryGoal ?? config.title,
                                evidence: missionGoal?.evidence,
                            },
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
                </>
            )}

            {/* Back button for mobile preview */}
            {mobileTab === 'preview' && (
                <div className="md:hidden fixed bottom-20 left-4 z-30">
                    <button
                        onClick={() => setMobileTab('instructies')}
                        className="flex min-h-[44px] items-center gap-2 rounded-full border border-[#E7D8BD] bg-white px-4 text-sm font-bold text-[#445865] shadow-sm"
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

export const BuilderCanvas: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete, enableChat, chatRoleId }) => {
    const [config, setConfig] = useState<BuilderCanvasConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is BuilderCanvasConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig({
                    ...cfg,
                    enableChat: enableChat ?? cfg.enableChat,
                    chatRoleId: chatRoleId ?? cfg.chatRoleId,
                });
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId, enableChat, chatRoleId]);

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
