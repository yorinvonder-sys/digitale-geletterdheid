import React, { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, MessageCircle, MessageSquare, Scale, Target } from 'lucide-react';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';
import { ExplorePhase } from './sub/ExplorePhase';
import { PositionPhase } from './sub/PositionPhase';
import { ArguePhase } from './sub/ArguePhase';
import { ChallengePhase } from './sub/ChallengePhase';
import { ReflectPhase } from './sub/ReflectPhase';

// ─── Config types ────────────────────────────────────────────────────────────

export interface Stakeholder {
    id: string;
    name: string;
    emoji: string;
    role: string;
    perspective: string;
    keyArgument: string;
}

export interface Position {
    id: string;
    label: string;
    description: string;
}

export interface OpeningChoiceOption {
    id: string;
    label: string;
    description: string;
    feedback: string;
    positionId?: string;
}

export interface OpeningChoice {
    title: string;
    description: string;
    prompt: string;
    options: OpeningChoiceOption[];
    continueLabel?: string;
}

export interface DebateArenaConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    enableChat?: boolean;
    chatRoleId?: string;
    topic: string;
    dilemma: string;
    stakeholders: Stakeholder[];
    positions: Position[];
    argumentPrompts: string[];
    reflectionQuestions: string[];
    counterArgument: string;
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    explorationQuiz?: FollowUpQuestion;
    argumentQualityIndicators?: boolean;
    openingChoice?: OpeningChoice;
}

// ─── State ───────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'opening' | 'explore' | 'position' | 'argue' | 'challenge' | 'reflect' | 'results';

export interface ArgumentEntry {
    claim: string;
    evidence: string;
    stakeholderId: string;
}

export interface DebateArenaState {
    phase: Phase;
    stakeholdersRead: string[];
    selectedPosition: string | null;
    arguments: ArgumentEntry[];
    counterResponse: string;
    reflectionAnswers: Record<string, string>;
    finalPosition: string | null;
    activeStakeholderIndex: number;
    activeArgumentIndex: number;
    openingChoiceId: string | null;
    explorationQuizAnswered?: boolean;
    explorationQuizCorrect?: boolean;
}

const buildInitialState = (): DebateArenaState => ({
    phase: 'intro',
    stakeholdersRead: [],
    selectedPosition: null,
    arguments: [
        { claim: '', evidence: '', stakeholderId: '' },
        { claim: '', evidence: '', stakeholderId: '' },
        { claim: '', evidence: '', stakeholderId: '' },
    ],
    counterResponse: '',
    reflectionAnswers: {},
    finalPosition: null,
    activeStakeholderIndex: 0,
    activeArgumentIndex: 0,
    openingChoiceId: null,
    explorationQuizAnswered: undefined,
    explorationQuizCorrect: undefined,
});

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(state: DebateArenaState, config: DebateArenaConfig): number {
    let score = 0;
    const argumentMax = 50;

    // All stakeholders read: 10 pts
    if (state.stakeholdersRead.length >= config.stakeholders.length) score += 10;

    // Exploration quiz bonus pts
    if (state.explorationQuizCorrect && config.explorationQuiz) {
        score += config.explorationQuiz.bonusPoints;
    }

    // Position chosen: 10 pts
    if (state.selectedPosition) score += 10;

    // Arguments: 20 pts each, max 3
    const validArgs = state.arguments.filter(
        (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
    );
    score += Math.round((Math.min(validArgs.length, 3) / 3) * argumentMax);

    // Counter-response: 10 pts
    if (state.counterResponse.trim().length >= 20) score += 10;

    // Reflection: 10 pts per question
    const reflectionScore = config.reflectionQuestions.filter((q) => {
        const answer = state.reflectionAnswers[q] ?? '';
        return answer.trim().length >= 20;
    }).length * 10;
    score += reflectionScore;

    return Math.min(score, config.maxScore);
}

function getOpeningChoice(
    config: DebateArenaConfig,
    openingChoiceId: string | null
): OpeningChoiceOption | undefined {
    if (!config.openingChoice || !openingChoiceId) return undefined;
    return config.openingChoice.options.find((option) => option.id === openingChoiceId);
}

function getOpeningPosition(
    config: DebateArenaConfig,
    openingChoice: OpeningChoiceOption | undefined
): Position | undefined {
    if (!openingChoice?.positionId) return undefined;
    return config.positions.find((position) => position.id === openingChoice.positionId);
}

function getDebateInteractionLabel(experienceDesign?: MissionExperienceDesign): string {
    switch (experienceDesign?.primaryInteraction) {
        case 'defend-position':
            return 'Standpunt verdedigen';
        case 'choose-with-consequence':
            return 'Kiezen met gevolg';
        case 'prioritize-case':
            return 'Case prioriteren';
        case 'pin-evidence':
            return 'Bewijs pinnen';
        case 'review-and-improve':
            return 'Reviewen en verbeteren';
        default:
            return 'Dilemma kiezen';
    }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DebateArenaProps extends TemplateMissionProps {
    config: DebateArenaConfig;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DebateArenaInner: React.FC<DebateArenaProps> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<DebateArenaState>(
        config.missionId,
        buildInitialState()
    );
    const [isChatOpen, setIsChatOpen] = useState(false);

    const score = useMemo(() => calcScore(state, config), [state, config]);
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
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

    const setPhase = (phase: Phase) => setState((s) => ({ ...s, phase }));
    const hasOpeningChoice = Boolean(config.openingChoice);
    const totalLearningPhases = hasOpeningChoice ? 7 : 6;

    useEffect(() => {
        const hasDebateProgress =
            state.stakeholdersRead.length > 0 ||
            state.selectedPosition !== null ||
            state.arguments.some((argument) => argument.claim.trim() || argument.evidence.trim()) ||
            state.counterResponse.trim().length > 0 ||
            Object.values(state.reflectionAnswers).some((answer) => answer.trim().length > 0) ||
            state.finalPosition !== null;

        if (hasOpeningChoice && state.phase === 'explore' && !state.openingChoiceId && !hasDebateProgress) {
            setState((s) => ({ ...s, phase: 'opening' }));
        }

        if (!hasOpeningChoice && state.phase === 'opening') {
            setState((s) => ({ ...s, phase: 'explore' }));
        }
    }, [
        hasOpeningChoice,
        state.arguments,
        state.counterResponse,
        state.finalPosition,
        state.openingChoiceId,
        state.phase,
        state.reflectionAnswers,
        state.selectedPosition,
        state.stakeholdersRead,
        setState,
    ]);

    const markStakeholderRead = (id: string) => {
        setState((s) => ({
            ...s,
            stakeholdersRead: s.stakeholdersRead.includes(id)
                ? s.stakeholdersRead
                : [...s.stakeholdersRead, id],
        }));
    };

    const phaseIndex: Record<Phase, number> = {
        intro: 0,
        opening: 1,
        explore: hasOpeningChoice ? 2 : 1,
        position: hasOpeningChoice ? 3 : 2,
        argue: hasOpeningChoice ? 4 : 3,
        challenge: hasOpeningChoice ? 5 : 4,
        reflect: hasOpeningChoice ? 6 : 5,
        results: hasOpeningChoice ? 7 : 6,
    };

    const currentPhaseIndex = phaseIndex[state.phase];
    const selectedPosition = config.positions.find((p) => p.id === state.selectedPosition);
    const activeStakeholder = config.stakeholders[state.activeStakeholderIndex];
    const chatOverlay = config.enableChat ? (
        <>
            <StudentAIChat
                roleId={config.chatRoleId ?? 'student-assistant'}
                userIdentifier={userId ?? 'anonymous'}
                isOpen={isChatOpen}
                onOpenChange={setIsChatOpen}
                hideMobileLauncher
                context={{
                    currentDebate: {
                        topic: config.topic,
                        dilemma: config.dilemma,
                        phase: state.phase,
                    },
                    activeStakeholder: activeStakeholder
                        ? {
                            name: activeStakeholder.name,
                            role: activeStakeholder.role,
                            perspective: activeStakeholder.perspective,
                        }
                        : null,
                    progress: {
                        phase: currentPhaseIndex,
                        total: totalLearningPhases,
                        score,
                        maxScore: config.maxScore,
                    },
                    selectedPosition: selectedPosition?.label ?? null,
                }}
            />
        </>
    ) : null;
    const mobileChatAction = config.enableChat ? (
        <div className="mb-3 flex justify-end sm:hidden">
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
    ) : null;
    const handleOpeningContinue = () => {
        const selectedOpening = getOpeningChoice(config, state.openingChoiceId);
        setState((s) => ({
            ...s,
            phase: 'explore',
            selectedPosition: s.selectedPosition ?? selectedOpening?.positionId ?? null,
        }));
    };

    // Phase: intro
    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={config.introFeatures}
                onStart={() => setPhase(hasOpeningChoice ? 'opening' : 'explore')}
            />
        );
    }

    // Phase: opening choice
    if (state.phase === 'opening' && config.openingChoice) {
        const selectedOpening = getOpeningChoice(config, state.openingChoiceId);
        const selectedOpeningPosition = getOpeningPosition(config, selectedOpening);
        const interactionLabel = getDebateInteractionLabel(config.experienceDesign);
        const openingStakeholders = config.stakeholders.slice(0, 4);
        const openingPositions = config.positions.slice(0, 4);

        return (
            <div className="min-h-dvh overflow-y-auto bg-[#FCF6EA] p-3 sm:p-4">
                <div className="mx-auto max-w-5xl pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <PhaseHeader
                        currentPhase={currentPhaseIndex}
                        totalPhases={totalLearningPhases}
                        totalScore={score}
                        onBack={onBack}
                    />
                    {mobileChatAction}

                    <section
                        className="grid overflow-hidden rounded-xl border border-[#D3C5AB] bg-white md:grid-cols-[0.9fr_1.1fr]"
                        data-qa="debate-opening-card"
                    >
                        <div className="bg-[#08283B] p-5 text-white md:p-6" data-qa="debate-opening-brief">
                            <div className="mb-5 flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F0B36A]">
                                    <Scale size={19} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#F0B36A]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Snelle positie
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black leading-tight text-white" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                        {config.openingChoice.title}
                                    </h2>
                                </div>
                            </div>

                            {config.experienceDesign?.firstTenSeconds && (
                                <div className="mb-4 rounded-lg border border-white/10 bg-white/8 p-3">
                                    <div className="mb-2 flex items-center gap-2 text-[#F0B36A]">
                                        <AlertTriangle size={15} />
                                        <p className="text-xs font-black" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Eerste zet
                                        </p>
                                    </div>
                                    <p className="text-sm leading-relaxed text-white" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {config.experienceDesign.firstTenSeconds}
                                    </p>
                                </div>
                            )}

                            <p className="text-sm leading-relaxed text-white/86" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {config.openingChoice.description}
                            </p>

                            <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-3">
                                <p className="mb-2 text-xs font-black text-[#F0B36A]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Dilemma
                                </p>
                                <p className="text-sm font-bold leading-relaxed text-white" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                    “{config.dilemma}”
                                </p>
                            </div>

                            <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                                <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                                    <p className="mb-1 text-xs font-black text-[#F0B36A]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Actie
                                    </p>
                                    <p className="text-sm font-black text-white" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {interactionLabel}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                                    <p className="mb-1 text-xs font-black text-[#F0B36A]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Bewijs
                                    </p>
                                    <p className="text-xs leading-relaxed text-white/86" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {config.experienceDesign?.evidenceMoment ?? 'Gebruik stakeholderargumenten om je positie aan te scherpen.'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-3" data-qa="debate-opening-route-strip">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-xs font-black text-[#F0B36A]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Route
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Nu → bewijs → standpunt
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Kies', 'Check', 'Verdedig'].map((label, index) => (
                                        <div key={label} className={`rounded-full px-2 py-1 text-center text-[10px] font-black ${
                                            index === 0 ? 'bg-[#F0B36A] text-[#08283B]' : 'bg-white/10 text-white/72'
                                        }`}>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-3 rounded-lg border border-[#0B453F]/20 bg-[#0B453F]/10 p-2">
                                <p className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {config.openingChoice.prompt}
                                </p>
                            </div>

                            <div
                                className="mb-3 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] p-3"
                                data-qa="debate-opening-visual-preview"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Eerste route
                                        </p>
                                        <p className="mt-0.5 text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Kies nu, toets straks met bewijs.
                                        </p>
                                    </div>
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08283B] text-sm font-black text-[#F0B36A]">
                                        10s
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                                    <div className="rounded-lg border border-[#E7D8BD] bg-white p-2">
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#D97848]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Gevolg
                                        </p>
                                        <div className="space-y-1.5">
                                            {['Keuze vastleggen', 'Bewijs zoeken'].map((label, index) => (
                                                <div key={label} className="grid grid-cols-[1.25rem,1fr] items-center gap-2">
                                                    <span className={`h-5 w-5 rounded-full ${index === 0 ? 'bg-[#5F947D]' : 'bg-[#F0B36A]'}`} />
                                                    <span>
                                                        <span className="mb-1 block text-[11px] font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                            {label}
                                                        </span>
                                                        <span className="block h-2 rounded-full bg-[#0B453F]/15">
                                                            <span className={`block h-2 rounded-full ${index === 0 ? 'w-3/4 bg-[#5F947D]' : 'w-1/2 bg-[#F0B36A]'}`} />
                                                        </span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-[#E7D8BD] bg-white p-2">
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Stakeholders
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {openingStakeholders.map((stakeholder) => (
                                                <span
                                                    key={stakeholder.id}
                                                    className="inline-flex min-h-[26px] items-center gap-1 rounded-full border border-[#E7D8BD] bg-[#FCF6EA] px-2 text-[11px] font-bold text-[#08283B]"
                                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                                >
                                                    <span aria-hidden="true">{stakeholder.emoji}</span>
                                                    {stakeholder.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 rounded-lg border border-[#E7D8BD] bg-white p-2">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            Standpunt
                                        </p>
                                        <p className="text-[10px] font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            voorlopig → bijgesteld
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {openingPositions.map((position) => {
                                            const active = selectedOpeningPosition?.id === position.id;
                                            return (
                                                <div
                                                    key={position.id}
                                                    className={`h-2 rounded-full ${active ? 'bg-[#D97848]' : 'bg-[#E7D8BD]'}`}
                                                    title={position.label}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                {config.openingChoice.options.map((option, index) => {
                                    const selected = state.openingChoiceId === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => setState((s) => ({ ...s, openingChoiceId: option.id }))}
                                            aria-pressed={selected}
                                            data-qa={`debate-opening-option-${option.id}`}
                                            className={`w-full rounded-lg border p-2.5 text-left transition-colors duration-150 ${
                                                selected
                                                    ? 'border-[#0B453F] bg-[#0B453F]/10'
                                                    : 'border-[#E7D8BD] bg-white hover:border-[#0B453F]/40'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                                    selected ? 'bg-[#0B453F] text-white' : 'bg-[#FCF6EA] text-[#D97848]'
                                                }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                                        {option.label}
                                                    </div>
                                                    <p className="mt-1 text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedOpening && (
                                <div className="mt-3 rounded-lg border border-[#5F947D]/30 bg-[#5F947D]/10 p-2" data-qa="debate-opening-feedback">
                                    <div className="flex items-start gap-2.5">
                                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#5F947D]" />
                                        <div>
                                            {selectedOpeningPosition && (
                                                <p className="mb-1 text-xs font-black text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                    Voorlopig standpunt: {selectedOpeningPosition.label}
                                                </p>
                                            )}
                                            <p className="text-xs font-bold leading-relaxed text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {selectedOpening.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleOpeningContinue}
                                disabled={!state.openingChoiceId}
                                data-qa="debate-opening-continue"
                                className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#D97848] px-4 py-3 text-sm font-bold text-white transition-colors duration-150 hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#E7D8BD] disabled:text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {config.openingChoice.continueLabel ?? 'Verken de perspectieven'}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </section>
                </div>
                {chatOverlay}
            </div>
        );
    }

    // Phase: results
    if (state.phase === 'results') {
        const openingOption = getOpeningChoice(config, state.openingChoiceId);
        const openingPosition = getOpeningPosition(config, openingOption);
        const initialPos = config.positions.find((p) => p.id === state.selectedPosition);
        const finalPos = config.positions.find((p) => p.id === (state.finalPosition ?? state.selectedPosition));
        const finalPositionId = finalPos?.id ?? initialPos?.id ?? null;
        const openingPositionId = openingPosition?.id ?? null;
        const shiftedFromOpening = Boolean(openingPositionId && finalPositionId && openingPositionId !== finalPositionId);
        const validArguments = state.arguments.filter(
            (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
        ).length;
        const allReflectionsComplete = config.reflectionQuestions.every(
            (q) => (state.reflectionAnswers[q] ?? '').trim().length >= 20
        );
        const isDebateComplete =
            state.stakeholdersRead.length >= config.stakeholders.length &&
            state.selectedPosition !== null &&
            (!hasOpeningChoice || state.openingChoiceId !== null || state.selectedPosition !== null) &&
            validArguments >= 2 &&
            state.counterResponse.trim().length >= 20 &&
            allReflectionsComplete;
        const completionStatus = {
            isComplete: isDebateComplete,
            title: isDebateComplete ? 'Debatbewijs compleet' : 'Debatbewijs mist nog onderdelen',
            description: isDebateComplete
                ? 'Je hebt perspectieven gelezen, positie gekozen, argumenten gebouwd, gereageerd en gereflecteerd.'
                : 'Voor voltooiing moeten alle debatfases afgerond zijn met minimaal twee onderbouwde argumenten.',
        };

        const phases = [
            { icon: '👥', title: 'Stakeholders gelezen', score: state.stakeholdersRead.length >= config.stakeholders.length ? 10 : 0, max: 10 },
            { icon: '📍', title: 'Positie gekozen', score: state.selectedPosition ? 10 : 0, max: 10 },
            { icon: '💬', title: 'Argumenten gebouwd', score: Math.round((Math.min(validArguments, 3) / 3) * 50), max: 50 },
            { icon: '⚡', title: 'Tegenargument beantwoord', score: state.counterResponse.trim().length >= 20 ? 10 : 0, max: 10 },
            { icon: '🪞', title: 'Gereflecteerd', score: config.reflectionQuestions.filter(q => (state.reflectionAnswers[q] ?? '').trim().length >= 20).length * 10, max: config.reflectionQuestions.length * 10 },
        ];

        return (
            <div className="min-h-dvh overflow-y-auto bg-[#FCF6EA] p-3 sm:p-4">
                <div className="max-w-md mx-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <PhaseHeader
                        currentPhase={totalLearningPhases}
                        totalPhases={totalLearningPhases}
                        totalScore={score}
                        onBack={onBack}
                    />
                    {mobileChatAction}

                    {/* Journey summary */}
                    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={16} className="text-[#0B453F]" />
                            <span className="text-xs font-black text-[#0B453F] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Jouw debattraject
                            </span>
                        </div>

                        <div className="mb-3 space-y-2" data-qa="debate-position-journey">
                            {[
                                ['Start', openingPosition?.label ?? openingOption?.label ?? initialPos?.label ?? '—'],
                                ['Na bewijs', initialPos?.label ?? '—'],
                                ['Einde', finalPos?.label ?? initialPos?.label ?? '—'],
                            ].map(([label, value], index) => (
                                <div
                                    key={label}
                                    className={`grid grid-cols-[5.5rem,1fr] items-center gap-3 rounded-xl border p-3 ${
                                        index === 2
                                            ? 'border-[#0B453F]/20 bg-[#0B453F]/10'
                                            : 'border-[#E7D8BD] bg-[#FCF6EA]'
                                    }`}
                                >
                                    <div className="text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{label}</div>
                                    <div className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {openingPositionId && finalPositionId && (
                            <div className="mb-3 rounded-xl border border-[#5F947D]/25 bg-[#5F947D]/10 p-3" data-qa="debate-position-shift">
                                <p className="text-xs font-bold leading-relaxed text-[#0B453F]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {shiftedFromOpening
                                        ? 'Je hebt je startpositie bijgesteld nadat je bewijs en tegenargumenten zag.'
                                        : 'Je bleef bij je startpositie en hebt die met argumenten aangescherpt.'}
                                </p>
                            </div>
                        )}

                        {state.arguments.filter(a => a.claim.trim().length > 0).map((arg, i) => (
                            <div key={i} className={`py-2.5 ${i < 2 ? 'border-b border-[#E7D8BD]' : ''}`}>
                                <div className="text-xs text-[#445865] mb-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Argument {i + 1}
                                </div>
                                <div className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {arg.claim.trim()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <CompletionScreen
                        score={score}
                        maxScore={config.maxScore}
                        badges={config.badges}
                        phases={phases}
                        evidence={missionGoal?.evidence}
                        completionStatus={completionStatus}
                        takeaways={config.takeaways}
                        onComplete={() => {
                            clearSave();
                            onComplete(isDebateComplete);
                        }}
                    />
                </div>
                {chatOverlay}
            </div>
        );
    }

    return (
        <div className="min-h-dvh overflow-y-auto bg-[#FCF6EA] p-3 sm:p-4">
            <div className="max-w-md mx-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
                <PhaseHeader
                    currentPhase={currentPhaseIndex}
                    totalPhases={totalLearningPhases}
                    totalScore={score}
                    onBack={onBack}
                />
                {mobileChatAction}

                {/* Dilemma banner */}
                <div className="bg-[#0B453F]/10 border border-[#0B453F]/20 rounded-2xl p-3 mb-5">
                    <div className="text-xs font-black text-[#0B453F] uppercase tracking-widest mb-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Stelling
                    </div>
                    <p className="text-sm text-[#445865] leading-relaxed italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        "{config.dilemma}"
                    </p>
                </div>

                {config.experienceDesign && (
                    <div
                        className="mb-4 rounded-xl border border-[#D3C5AB] bg-white p-3"
                        data-qa="debate-dilemma-rail"
                    >
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg bg-[#FCF6EA] p-3">
                                <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                                    <Scale size={14} />
                                    <p className="text-xs font-black" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Actie
                                    </p>
                                </div>
                                <p className="text-sm font-black leading-snug text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {getDebateInteractionLabel(config.experienceDesign)}
                                </p>
                            </div>
                            <div className="rounded-lg bg-[#FCF6EA] p-3">
                                <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                                    <Target size={14} />
                                    <p className="text-xs font-black" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Bewijs
                                    </p>
                                </div>
                                <p className="text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {config.experienceDesign.evidenceMoment}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {state.phase === 'explore' && (
                    <ExplorePhase
                        config={config}
                        state={state}
                        onMarkRead={markStakeholderRead}
                        onSetActiveIndex={(i) => setState((s) => ({ ...s, activeStakeholderIndex: i }))}
                        onNext={() => setPhase('position')}
                        onQuizComplete={(correct) => setState((s) => ({ ...s, explorationQuizAnswered: true, explorationQuizCorrect: correct }))}
                    />
                )}

                {state.phase === 'position' && (
                    <PositionPhase
                        config={config}
                        state={state}
                        onSelect={(id) => setState((s) => ({ ...s, selectedPosition: id }))}
                        onNext={() => setPhase('argue')}
                        onBack={() => setPhase('explore')}
                    />
                )}

                {state.phase === 'argue' && (
                    <ArguePhase
                        config={config}
                        state={state}
                        onUpdateArgument={(index, field, value) => {
                            setState((s) => {
                                const args = [...s.arguments];
                                args[index] = { ...args[index], [field]: value };
                                return { ...s, arguments: args };
                            });
                        }}
                        onSetActiveIndex={(i) => setState((s) => ({ ...s, activeArgumentIndex: i }))}
                        onNext={() => setPhase('challenge')}
                        onBack={() => setPhase('position')}
                    />
                )}

                {state.phase === 'challenge' && (
                    <ChallengePhase
                        config={config}
                        state={state}
                        onUpdateResponse={(val) => setState((s) => ({ ...s, counterResponse: val }))}
                        onNext={() => setPhase('reflect')}
                        onBack={() => setPhase('argue')}
                    />
                )}

                {state.phase === 'reflect' && (
                    <ReflectPhase
                        config={config}
                        state={state}
                        onUpdateAnswer={(q, val) =>
                            setState((s) => ({
                                ...s,
                                reflectionAnswers: { ...s.reflectionAnswers, [q]: val },
                            }))
                        }
                        onSelectFinalPosition={(id) => setState((s) => ({ ...s, finalPosition: id }))}
                        onNext={() => setPhase('results')}
                        onBack={() => setPhase('challenge')}
                    />
                )}
            </div>
            {chatOverlay}
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97848] border-t-transparent" />
    </div>
);

export const DebateArena: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete, enableChat, chatRoleId }) => {
    const [config, setConfig] = useState<DebateArenaConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is DebateArenaConfig => v && typeof v === 'object' && 'missionId' in v);
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

    return <DebateArenaInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
