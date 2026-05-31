import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, FileCheck2, MessageCircle, Target, Zap } from 'lucide-react';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { FollowUpCard } from '../shared/FollowUpCard';
import { MissionGoalBanner } from '../shared/MissionGoalBanner';
import { DragSort } from './sub/DragSort';
import { MatchPairs } from './sub/MatchPairs';
import { Categorize } from './sub/Categorize';
import { RapidFire } from './sub/RapidFire';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { getMissionGoal } from '@/config/missionGoals';

// === Config types (exported for test configs) ===

export interface DragSortRound {
    id: string;
    title: string;
    description: string;
    type: 'drag-sort';
    items: Array<{ id: string; label: string; correctPosition: number }>;
    maxScore: number;
    showConfidence?: boolean;
    followUp?: FollowUpQuestion;
}

export interface MatchPairsRound {
    id: string;
    title: string;
    description: string;
    type: 'match-pairs';
    pairs: Array<{ left: string; right: string }>;
    maxScore: number;
    followUp?: FollowUpQuestion;
}

export interface CategorizeRound {
    id: string;
    title: string;
    description: string;
    type: 'categorize';
    categories: string[];
    items: Array<{ label: string; correctCategory: string }>;
    maxScore: number;
    showConfidence?: boolean;
    followUp?: FollowUpQuestion;
}

export interface RapidFireRound {
    id: string;
    title: string;
    description: string;
    type: 'rapid-fire';
    questions: Array<{ question: string; answer: boolean; explanation: string }>;
    timePerQuestion?: number;
    maxScore: number;
    followUp?: FollowUpQuestion;
}

export type ReviewRound = DragSortRound | MatchPairsRound | CategorizeRound | RapidFireRound;

export interface ReviewArenaConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    rounds: ReviewRound[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    enableChat?: boolean;
    chatRoleId?: string;
}

// === State ===

interface ReviewArenaState {
    phase: 'intro' | 'round' | 'complete';
    currentRound: number;
    roundScores: number[];
    followUpResults: Record<string, { answered: boolean; correct: boolean }>;
    configMissionId?: string;
}

interface ReviewSprintRoute {
    id: string;
    title: string;
    description: string;
    tag: string;
    feedback: string;
}

const ROUND_ICONS: Record<ReviewRound['type'], string> = {
    'drag-sort': '↕️',
    'match-pairs': '🔗',
    'categorize': '🗂️',
    'rapid-fire': '⚡',
};

function buildReviewSprintRoutes(rounds: ReviewRound[]): ReviewSprintRoute[] {
    const primaryRounds = rounds.filter((round) => round.type !== 'rapid-fire').slice(0, 3);
    const fallbackRounds = rounds.slice(0, 3);
    const routeRounds = primaryRounds.length >= 3 ? primaryRounds : fallbackRounds;

    return routeRounds.map((round, index) => ({
        id: round.id,
        title: round.title,
        description: getReviewAction(round),
        tag: `${ROUND_ICONS[round.type]} ${getRoundTypeLabel(round.type)}`,
        feedback: index === 0
            ? 'Goede keuze: je begint met ordenen voordat je snelheid maakt.'
            : 'Slimme route: je start met een scherp reviewpatroon en bouwt bewijs op.',
    }));
}

function getRoundTypeLabel(type: ReviewRound['type']): string {
    switch (type) {
        case 'drag-sort':
            return 'Sorteren';
        case 'match-pairs':
            return 'Koppelen';
        case 'categorize':
            return 'Categoriseren';
        case 'rapid-fire':
            return 'Snel beslissen';
        default:
            return 'Reviewen';
    }
}

function getReviewAction(round: ReviewRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.primaryInteraction === 'review-and-improve') return 'Reviewen en verbeteren';
    if (experienceDesign?.primaryInteraction === 'pin-evidence') return 'Bewijs pinnen';

    switch (round.type) {
        case 'drag-sort':
            return 'Zet keuzes in de juiste volgorde';
        case 'match-pairs':
            return 'Koppel oorzaak en bewijs';
        case 'categorize':
            return 'Plaats elk item in de juiste categorie';
        case 'rapid-fire':
            return 'Beslis snel, check daarna je uitleg';
        default:
            return 'Review je keuzes';
    }
}

function getReviewEvidence(round: ReviewRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.evidenceMoment) return experienceDesign.evidenceMoment;

    switch (round.type) {
        case 'drag-sort':
            return 'Je bewijs is de volgorde die je kiest en kunt verdedigen.';
        case 'match-pairs':
            return 'Je bewijs is welke verbanden je correct legt.';
        case 'categorize':
            return 'Je bewijs is hoe scherp je de voorbeelden indeelt.';
        case 'rapid-fire':
            return 'Je bewijs is je patroonherkenning onder lichte tijdsdruk.';
        default:
            return 'Je bewijs zit in je keuzes en de feedback erna.';
    }
}

function getReviewFeedback(round: ReviewRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.feedbackMoment) return experienceDesign.feedbackMoment;
    if (round.followUp) return 'Na je ronde krijg je een extra vraag waarmee je je score kunt aanscherpen.';
    return 'Na indienen zie je direct of je review scherp genoeg was voor de volgende ronde.';
}

interface ReviewBriefProps {
    round: ReviewRound;
    roundIndex: number;
    totalRounds: number;
    experienceDesign?: MissionExperienceDesign;
}

const ReviewBrief: React.FC<ReviewBriefProps> = ({
    round,
    roundIndex,
    totalRounds,
    experienceDesign,
}) => (
    <section
        className="mb-4 rounded-xl border border-[#D3C5AB] bg-white p-3"
        data-qa="review-arena-brief"
    >
        <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#08283B] text-white">
                    <span className="text-lg" aria-hidden="true">{ROUND_ICONS[round.type]}</span>
                </div>
                <div>
                    <p
                        className="text-xs font-black text-[#D97848]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Ronde {roundIndex + 1} van {totalRounds} · {getRoundTypeLabel(round.type)}
                    </p>
                    <h2
                        className="mt-1 text-lg font-black leading-tight text-[#08283B]"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {round.title}
                    </h2>
                </div>
            </div>
            <div
                className="shrink-0 rounded-lg border border-[#E7D8BD] bg-[#FCF6EA] px-2.5 py-1.5 text-xs font-black text-[#445865]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {round.maxScore} pt
            </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-[#FCF6EA] p-3">
                <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                    <Zap size={14} />
                    <p className="text-xs font-black" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Actie
                    </p>
                </div>
                <p className="text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {getReviewAction(round, experienceDesign)}
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
                    {getReviewEvidence(round, experienceDesign)}
                </p>
            </div>
            <div className="rounded-lg bg-[#FCF6EA] p-3">
                <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                    <FileCheck2 size={14} />
                    <p className="text-xs font-black" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Feedback
                    </p>
                </div>
                <p className="text-xs leading-relaxed text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {getReviewFeedback(round, experienceDesign)}
                </p>
            </div>
        </div>
    </section>
);

interface ReviewArenaIntroProps {
    config: ReviewArenaConfig;
    missionGoal?: MissionGoal;
    selectedRouteId: string | null;
    onSelectRoute: (routeId: string) => void;
    onStart: () => void;
}

const ReviewArenaIntro: React.FC<ReviewArenaIntroProps> = ({
    config,
    missionGoal,
    selectedRouteId,
    onSelectRoute,
    onStart,
}) => {
    const routes = buildReviewSprintRoutes(config.rounds);
    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    const threshold = missionGoal?.criteria.threshold;
    const thresholdLabel = typeof threshold === 'number'
        ? `${threshold <= 1 ? Math.round(config.maxScore * threshold) : threshold}/${config.maxScore}`
        : `alle rondes`;

    return (
        <div
            className="box-border min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#FCF6EA] px-3 py-4 sm:px-4 sm:py-6"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            <div className="mx-auto grid w-full max-w-[calc(100vw-1.5rem)] gap-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-[calc(100vw-2rem)] lg:max-w-4xl lg:grid-cols-[1fr_0.82fr]">
                <section
                    className="min-w-0 rounded-xl border border-[#D3C5AB] bg-[#FFFDF7] p-4 shadow-sm sm:p-5"
                    data-qa="review-sprint-console"
                >
                    <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08283B] text-2xl text-white">
                            <span aria-hidden="true">{config.introEmoji}</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-[#D97848]">
                                Review Sprint
                            </p>
                            <h1 className="mt-1 text-xl font-black leading-tight text-[#08283B] sm:text-2xl">
                                {config.introTitle}
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-[#445865]">
                                {config.introDescription}
                            </p>
                        </div>
                    </div>

                    {missionGoal && <MissionGoalBanner goal={missionGoal} compact className="mb-4" />}

                    <div className="mb-3 flex items-center gap-2 text-[#08283B]">
                        <Zap size={16} className="text-[#D97848]" />
                        <h2 className="text-sm font-black">
                            Kies je eerste kwaliteitsroute
                        </h2>
                    </div>

                    <div className="grid gap-2" role="group" aria-label="Kies je eerste reviewroute">
                        {routes.map((route) => {
                            const isSelected = route.id === selectedRouteId;
                            return (
                                <button
                                    key={route.id}
                                    type="button"
                                    onClick={() => onSelectRoute(route.id)}
                                    data-qa="review-sprint-route"
                                    aria-pressed={isSelected}
                                    className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/50 ${
                                        isSelected
                                            ? 'border-[#D97848] bg-[#D97848]/10 shadow-sm'
                                            : 'border-[#E7D8BD] bg-white hover:border-[#D97848]/70'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-[#5F947D]">
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
                                ? 'border-[#5F947D]/35 bg-[#5F947D]/10 text-[#0B453F]'
                                : 'border-[#E7D8BD] bg-[#FCF6EA] text-[#445865]'
                        }`}
                        data-qa="review-sprint-feedback"
                        aria-live="polite"
                    >
                        {selectedRoute
                            ? selectedRoute.feedback
                            : 'Maak eerst één routekeuze. Daarna start je direct met een actieve reviewronde.'}
                    </div>

                    <button
                        type="button"
                        onClick={onStart}
                        disabled={!selectedRoute}
                        data-qa="review-sprint-start"
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2 ${
                            selectedRoute
                                ? 'bg-[#D7C95F] text-[#08283B] shadow-lg shadow-[#D7C95F]/25 hover:bg-[#CBC04F]'
                                : 'cursor-not-allowed bg-[#E7D8BD] text-[#6E7C82]'
                        }`}
                    >
                        Start review sprint
                        <ChevronRight size={16} />
                    </button>
                </section>

                <aside className="grid min-w-0 gap-3">
                    <section className="min-w-0 rounded-xl border border-[#D3C5AB] bg-white p-3" data-qa="review-sprint-state">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-sm font-black text-[#08283B]">Rondedossier</h2>
                            <span className="rounded-lg bg-[#FCF6EA] px-2 py-1 text-xs font-black text-[#445865]">
                                {config.rounds.length} rondes
                            </span>
                        </div>
                        <div className="grid gap-2">
                            {config.rounds.map((round, index) => (
                                <div
                                    key={round.id}
                                    className="flex items-start gap-2 rounded-lg bg-[#FCF6EA] p-2"
                                >
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#08283B] text-sm text-white">
                                        <span aria-hidden="true">{ROUND_ICONS[round.type]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black uppercase text-[#D97848]">
                                            Ronde {index + 1} · {getRoundTypeLabel(round.type)}
                                        </p>
                                        <p className="truncate text-xs font-bold text-[#08283B]">
                                            {round.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid min-w-0 gap-2 rounded-xl border border-[#D3C5AB] bg-[#08283B] p-3 text-white">
                        <div className="flex items-center gap-2">
                            <Target size={15} className="text-[#D7C95F]" />
                            <p className="text-xs font-black uppercase text-[#D7C95F]">
                                Scorepoort
                            </p>
                        </div>
                        <p className="text-sm font-black">
                            Doel: {thresholdLabel}
                        </p>
                        <p className="text-xs leading-relaxed text-white/78">
                            {config.experienceDesign?.evidenceMoment ?? missionGoal?.evidence ?? 'Je bewijs bestaat uit de keuzes en feedback per ronde.'}
                        </p>
                    </section>
                </aside>
            </div>
        </div>
    );
};

// === Main component ===

interface ReviewArenaProps extends TemplateMissionProps {
    config: ReviewArenaConfig;
}

const ReviewArenaWithConfig: React.FC<ReviewArenaProps> = ({
    missionId,
    onBack,
    onComplete,
    config,
}) => {
    const initialState: ReviewArenaState = {
        phase: 'intro',
        currentRound: 0,
        roundScores: [],
        followUpResults: {},
        configMissionId: config.missionId,
    };

    const { state, setState, clearSave } = useMissionAutoSave<ReviewArenaState>(
        missionId,
        initialState
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedReviewRoute, setSelectedReviewRoute] = useState<string | null>(null);

    useEffect(() => {
        setSelectedReviewRoute(null);

        if (state.configMissionId && state.configMissionId !== config.missionId) {
            setState(initialState);
            return;
        }

        if (!state.configMissionId && config.missionId !== 'data-review') {
            setState(initialState);
        }
    }, [config.missionId, setState, state.configMissionId]);

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

    // Local (non-persisted) follow-up UI state
    const [pendingScore, setPendingScore] = useState<number | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);

    const totalScore = state.roundScores.reduce((a, b) => a + b, 0);
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    const configuredThreshold = missionGoal?.criteria.threshold;
    const completionThreshold = typeof configuredThreshold === 'number'
        ? configuredThreshold <= 1 ? Math.round(config.maxScore * configuredThreshold) : configuredThreshold
        : 0;
    const allRoundsComplete = state.roundScores.length >= config.rounds.length;
    const isMissionComplete = allRoundsComplete && totalScore >= completionThreshold;
    const completionStatus = {
        isComplete: isMissionComplete,
        title: isMissionComplete ? 'Bewijs compleet' : 'Nog niet voltooid',
        description: isMissionComplete
            ? `Alle reviewrondes zijn afgerond en je score is minimaal ${completionThreshold}/${config.maxScore}.`
            : `Voor voltooiing moet je alle reviewrondes afronden en minimaal ${completionThreshold}/${config.maxScore} punten halen.`,
    };

    const advanceRound = useCallback(
        (score: number) => {
            setState((s) => {
                const newScores = [...s.roundScores, score];
                const nextRound = s.currentRound + 1;
                const isLast = nextRound >= config.rounds.length;
                return {
                    ...s,
                    roundScores: newScores,
                    currentRound: nextRound,
                    phase: isLast ? 'complete' : 'round',
                };
            });
        },
        [setState, config.rounds.length]
    );

    const handleStart = useCallback(() => {
        setState((s) => ({ ...s, phase: 'round' }));
    }, [setState]);

    const handleRoundComplete = useCallback(
        (score: number) => {
            const round = config.rounds[state.currentRound];
            if (round?.followUp && score >= round.maxScore * 0.5) {
                setPendingScore(score);
                setShowFollowUp(true);
            } else {
                advanceRound(score);
            }
        },
        [advanceRound, config.rounds, state.currentRound]
    );

    const handleFollowUpComplete = useCallback(
        (correct: boolean) => {
            const round = config.rounds[state.currentRound];
            const bonus = correct ? (round?.followUp?.bonusPoints ?? 0) : 0;
            const base = pendingScore ?? 0;
            const maxScore = round?.maxScore ?? 0;
            const finalScore = Math.min(base + bonus, maxScore);

            setState((s) => ({
                ...s,
                followUpResults: {
                    ...s.followUpResults,
                    [round?.id ?? state.currentRound]: { answered: true, correct },
                },
            }));

            setShowFollowUp(false);
            setPendingScore(null);
            advanceRound(finalScore);
        },
        [advanceRound, config.rounds, pendingScore, setState, state.currentRound]
    );

    const handleComplete = useCallback(() => {
        clearSave();
        onComplete(isMissionComplete);
    }, [clearSave, isMissionComplete, onComplete]);

    // === Intro ===
    if (state.phase === 'intro') {
        const features = config.introFeatures ?? config.rounds.map((r) => `${ROUND_ICONS[r.type]} ${r.title}`);
        if (config.experienceDesign) {
            return (
                <ReviewArenaIntro
                    config={config}
                    missionGoal={missionGoal}
                    selectedRouteId={selectedReviewRoute}
                    onSelectRoute={setSelectedReviewRoute}
                    onStart={handleStart}
                />
            );
        }

        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                onStart={handleStart}
                goal={missionGoal}
                features={features}
            />
        );
    }

    // === Complete ===
    if (state.phase === 'complete') {
        const phases = config.rounds.map((round, i) => ({
            icon: ROUND_ICONS[round.type],
            title: round.title,
            score: state.roundScores[i] ?? 0,
            max: round.maxScore,
        }));

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

    // === Active round ===
    const round = config.rounds[state.currentRound];
    if (!round) return null;

    return (
        <div className="box-border min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#FCF6EA] p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[calc(100vw-2rem)] pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-3xl">
                <PhaseHeader
                    currentPhase={state.currentRound}
                    totalPhases={config.rounds.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <ReviewBrief
                    round={round}
                    roundIndex={state.currentRound}
                    totalRounds={config.rounds.length}
                    experienceDesign={config.experienceDesign}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={round.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: 'calc(100% - 0.5rem)' }}
                        className="mx-auto box-border min-w-0 max-w-full rounded-xl border border-[#E7D8BD] bg-white p-4 sm:p-5"
                        data-qa="review-round-card"
                    >
                        {round.type === 'drag-sort' && (
                            <DragSort
                                title={round.title}
                                description={round.description}
                                items={round.items}
                                maxScore={round.maxScore}
                                showConfidence={round.showConfidence}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        {round.type === 'match-pairs' && (
                            <MatchPairs
                                title={round.title}
                                description={round.description}
                                pairs={round.pairs}
                                maxScore={round.maxScore}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        {round.type === 'categorize' && (
                            <Categorize
                                title={round.title}
                                description={round.description}
                                categories={round.categories}
                                items={round.items}
                                maxScore={round.maxScore}
                                showConfidence={round.showConfidence}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        {round.type === 'rapid-fire' && (
                            <RapidFire
                                title={round.title}
                                description={round.description}
                                questions={round.questions}
                                timePerQuestion={round.timePerQuestion}
                                maxScore={round.maxScore}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}

                        {showFollowUp && round.followUp && (
                            <FollowUpCard
                                followUp={round.followUp}
                                onComplete={handleFollowUpComplete}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
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
                            currentRound: {
                                title: round.title,
                                description: round.description,
                                type: round.type,
                            },
                            progress: {
                                round: state.currentRound + 1,
                                total: config.rounds.length,
                                score: totalScore,
                                maxScore: config.maxScore,
                            },
                        }}
                    />
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
        </div>
    );
};

// === Public entry point: loads the requested review-arena config dynamically ===

export { ReviewArenaWithConfig };

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97848] border-t-transparent" />
    </div>
);

export const ReviewArena: React.FC<TemplateMissionProps> = (props) => {
    const { missionId, onBack, enableChat, chatRoleId } = props;
    const [config, setConfig] = useState<ReviewArenaConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        setConfig(null);
        setLoadError(false);

        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find(
                    (value): value is ReviewArenaConfig =>
                        Boolean(value) && typeof value === 'object' && 'missionId' in value
                );

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

    return <ReviewArenaWithConfig {...props} config={config} />;
};
