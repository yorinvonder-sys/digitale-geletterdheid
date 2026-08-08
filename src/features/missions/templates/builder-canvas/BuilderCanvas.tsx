import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal } from '../shared/types';
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

    // De bonuspunten van de verdiepingsvragen zijn onderdeel van maxScore, niet iets
    // erbovenop: het budget voor de stappen is wat er ná aftrek van de maximale bonus
    // overblijft. Zo betekent 100% precies "alle stappen én alle verdiepingsvragen
    // goed" en kan de score nooit boven maxScore uitkomen. De rest van de deling gaat
    // naar de eerste stappen, zodat een perfecte run exact op maxScore uitkomt.
    const maxBonusScore = config.steps.reduce(
        (acc, step) => acc + (step.reflectionQuestion?.bonusPoints ?? 0),
        0
    );
    const stepBudget = Math.max(0, config.maxScore - maxBonusScore);
    const basePointsPerStep = Math.floor(stepBudget / config.steps.length);
    const stepRemainder = stepBudget - basePointsPerStep * config.steps.length;
    const pointsForStep = (index: number) => basePointsPerStep + (index < stepRemainder ? 1 : 0);

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

    const stepScore = config.steps.reduce(
        (acc, step, i) => (state.completedSteps.includes(step.id) ? acc + pointsForStep(i) : acc),
        0
    );

    const totalScore = Math.min(stepScore + bonusScore, config.maxScore);

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

    // Het eerste antwoord telt: eenmaal onthuld mag een refresh of hermount de uitslag
    // niet meer verbeteren.
    const handleReflectionAnswer = (stepId: string, correct: boolean) => {
        setState((prev) =>
            prev.reflectionCorrect[stepId] !== undefined
                ? prev
                : { ...prev, reflectionCorrect: { ...prev.reflectionCorrect, [stepId]: correct } }
        );
    };

    const handleReflectionComplete = (stepId: string, correct: boolean) => {
        setState((prev) => ({
            ...prev,
            reflectionAnswered: { ...prev.reflectionAnswered, [stepId]: true },
            reflectionCorrect:
                prev.reflectionCorrect[stepId] !== undefined
                    ? prev.reflectionCorrect
                    : { ...prev.reflectionCorrect, [stepId]: correct },
        }));
    };

    const handleComplete = async () => {
        // Pas wissen als de server de voltooiing bevestigd heeft: andersom raakt
        // een leerling zijn hele bouwwerk kwijt zodra het opslaan mislukt.
        const completed = await onComplete(totalScore >= config.maxScore * 0.4);
        if (completed !== false) {
            clearSave();
        }
    };

    // ─── Phase: Intro ─────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                features={config.introFeatures}
                onStart={handleStart}
            />
        );
    }

    // ─── Phase: Results ───────────────────────────────────────────────────

    if (state.phase === 'results') {
        const phaseBreakdown = config.steps.map((step, i) => {
            const stepBonus = step.reflectionQuestion?.bonusPoints ?? 0;
            return {
                icon: i === 0 ? '🎯' : i === 1 ? '🗂️' : i === 2 ? '✍️' : '💬',
                title: step.title,
                score:
                    (state.completedSteps.includes(step.id) ? pointsForStep(i) : 0) +
                    (state.reflectionCorrect[step.id] ? stepBonus : 0),
                max: pointsForStep(i) + stepBonus,
            };
        });

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
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-duck-bg">
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

            <MobileTabBar
                activeTab={mobileTab}
                onTabChange={setMobileTab}
                onOpenChat={config.enableChat && !isChatOpen ? () => setIsChatOpen(true) : undefined}
            />

            {/* Main split layout */}
            <div className="min-h-0 flex-1 flex flex-col overflow-hidden md:flex-row">
                {/* Left panel — instructions */}
                <div
                    className={`min-h-0 border-r border-duck-gray flex flex-col overflow-y-auto md:w-[45%] ${
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
                        onReflectionAnswer={handleReflectionAnswer}
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
                            // Bij Website Bouwer gaat de ruwe opdrachttekst van de leerling
                            // NIET mee naar de AI-coach; die krijgt alleen of er iets staat
                            // en hoe lang het is. De coach heeft de inhoud niet nodig om te
                            // helpen, en zo verlaat het schrijfwerk van de leerling de
                            // vertrouwensgrens niet.
                            textEntry: config.missionId === 'website-bouwer'
                                ? undefined
                                : currentStepData
                                  ? state.textEntries[currentStepData.id] ?? ''
                                  : '',
                            textEntryStatus: config.missionId === 'website-bouwer'
                                ? {
                                      hasContent: Boolean(currentStepData && state.textEntries[currentStepData.id]?.trim()),
                                      characterCount: currentStepData
                                          ? state.textEntries[currentStepData.id]?.trim().length ?? 0
                                          : 0,
                                  }
                                : undefined,
                        }}
                    />

                    {/* Floating chat button — only visible when chat is closed */}
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-duck-acid to-duck-acid text-duck-ink shadow-lg transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 active:scale-95 md:flex"
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
                        className="flex min-h-[44px] items-center gap-2 rounded-full border border-duck-gray bg-white px-4 text-sm font-bold text-duck-ink/70 shadow-sm"
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

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_BUILDER_CANVAS_IDS: ReadonlySet<string> = new Set([
    'api-architect',
    'app-prototyper',
    'automation-engineer',
    'brand-builder',
    'digital-storyteller',
    'innovation-lab',
    'meesterproef',
    'meme-machine',
    'mission-blueprint',
    'mission-vision',
    'open-source-contributor',
    'pitch-perfect',
    'podcast-producer',
    'portfolio-builder',
    'prototype-developer',
    'startup-simulator',
    'video-editor',
    'web-developer',
    'website-bouwer',
]);

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

export const BuilderCanvas: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<BuilderCanvasConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_BUILDER_CANVAS_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is BuilderCanvasConfig => !!v && typeof v === 'object' && 'missionId' in v);
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
                <button onClick={onBack} className="px-4 py-2 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <BuilderCanvasInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
