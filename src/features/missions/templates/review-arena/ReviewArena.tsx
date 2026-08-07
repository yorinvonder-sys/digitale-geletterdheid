import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion, MissionGoal } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { FollowUpCard } from '../shared/FollowUpCard';
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
    /**
     * Score per ronde-id, vastgelegd op het moment van INDIENEN — dus vóórdat de
     * correctie met de juiste antwoorden in beeld komt. Zonder dit leefde het
     * tussenresultaat alleen in lokale state en gaf herladen na het zien van de
     * antwoorden een verse, opnieuw scoorbare ronde.
     */
    lockedRoundScores: Record<string, number>;
    followUpResults: Record<string, { answered: boolean; correct: boolean }>;
    configMissionId?: string;
}

/** Mirrors the 40% pass threshold that CompletionScreen shows to the learner. */
const PASS_THRESHOLD = 0.4;

const ROUND_ICONS: Record<ReviewRound['type'], string> = {
    'drag-sort': '↕️',
    'match-pairs': '🔗',
    'categorize': '🗂️',
    'rapid-fire': '⚡',
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
        lockedRoundScores: {},
        followUpResults: {},
        configMissionId: config.missionId,
    };

    const { state, setState, clearSave } = useMissionAutoSave<ReviewArenaState>(
        missionId,
        initialState,
        {
            // Opslag van een oudere configversie mag niet blijven staan. `roundScores`
            // groeit precies gelijk op met `currentRound` (advanceRound doet beide in
            // één update), dus een langere lijst betekent beschadigde opslag. De
            // vastgelegde scores uit reparatie 1 staan in `lockedRoundScores` en tellen
            // hier bewust niet mee: die worden vastgelegd vóórdat `currentRound`
            // opschuift, dus een net ingediende ronde mag daar niet op afgekeurd worden.
            validate: (s) =>
                ['intro', 'round', 'complete'].includes(s.phase) &&
                Number.isInteger(s.currentRound) &&
                s.currentRound >= 0 &&
                s.currentRound <= config.rounds.length &&
                Array.isArray(s.roundScores) &&
                s.roundScores.length <= s.currentRound &&
                s.roundScores.every((n) => typeof n === 'number' && Number.isFinite(n)) &&
                Object.keys(s.lockedRoundScores ?? {}).every((id) =>
                    config.rounds.some((r) => r.id === id)
                ),
        }
    );

    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (state.configMissionId && state.configMissionId !== config.missionId) {
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

    // Ronde-id's die de leerling in DEZE sessie zelf heeft ingediend. Staat er een
    // vastgelegde score zonder dat de ronde hier is gespeeld, dan komt die uit
    // opslag: de ronde is dan al beantwoord en mag niet opnieuw scoren.
    const submittedThisSession = useRef<Set<string>>(new Set());

    const totalScore = state.roundScores.reduce((a, b) => a + b, 0);

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

    /**
     * Legt de score van de huidige ronde vast op het moment van indienen. Binnen
     * dezelfde sessie mag een ronde zijn eigen waarde nog bijstellen (rapid-fire
     * en match-pairs melden tussentijds); een score die uit opslag komt staat vast.
     */
    const handleRoundSubmit = useCallback(
        (score: number) => {
            const round = config.rounds[state.currentRound];
            if (!round) return;
            const firstSubmitThisSession = !submittedThisSession.current.has(round.id);
            submittedThisSession.current.add(round.id);

            setState((s) => {
                const alreadyLocked = s.lockedRoundScores[round.id] !== undefined;
                if (firstSubmitThisSession && alreadyLocked) return s;
                return {
                    ...s,
                    lockedRoundScores: { ...s.lockedRoundScores, [round.id]: score },
                };
            });
        },
        [config.rounds, setState, state.currentRound]
    );

    const handleRoundComplete = useCallback(
        (score: number) => {
            const round = config.rounds[state.currentRound];
            // De vastgelegde score wint van wat het subcomponent bij het doorklikken
            // meegeeft; die twee zijn gelijk bij normaal spelen.
            const locked = round ? state.lockedRoundScores[round.id] : undefined;
            const finalScore = locked ?? score;

            if (round?.followUp && finalScore > round.maxScore * 0.5) {
                setPendingScore(finalScore);
                setShowFollowUp(true);
            } else {
                advanceRound(finalScore);
            }
        },
        [advanceRound, config.rounds, state.currentRound, state.lockedRoundScores]
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
        // Slagen hangt aan de werkelijke score, niet aan het bereiken van het
        // eindscherm — dezelfde drempel die CompletionScreen toont.
        const passed = config.maxScore > 0 && totalScore / config.maxScore >= PASS_THRESHOLD;
        clearSave();
        onComplete(passed);
    }, [clearSave, config.maxScore, onComplete, totalScore]);

    // === Intro ===
    if (state.phase === 'intro') {
        const features = config.introFeatures ?? config.rounds.map((r) => `${ROUND_ICONS[r.type]} ${r.title}`);
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                onStart={handleStart}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
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
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // === Active round ===
    const round = config.rounds[state.currentRound];
    if (!round) return null;

    const resumedScore = state.lockedRoundScores[round.id];
    const isAlreadyScored =
        resumedScore !== undefined && !submittedThisSession.current.has(round.id);

    return (
        <div data-qa="review-arena" className="min-h-screen bg-duck-bg p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={state.currentRound}
                    totalPhases={config.rounds.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                {/* Round type badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{ROUND_ICONS[round.type]}</span>
                    <span
                        className="text-xs font-black text-duck-ink uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Ronde {state.currentRound + 1} — {
                            round.type === 'drag-sort' ? 'Sorteren' :
                            round.type === 'match-pairs' ? 'Koppelen' :
                            round.type === 'categorize' ? 'Categoriseren' :
                            'Snel beantwoorden'
                        }
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={round.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl border border-duck-gray p-5"
                    >
                        {isAlreadyScored ? (
                            <div className="space-y-4">
                                <h3
                                    className="text-lg font-black text-duck-ink"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {round.title}
                                </h3>
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className="p-3 rounded-xl bg-duck-acid/10 text-duck-ink text-sm font-medium"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Je had deze ronde al ingediend. Je score staat vast op{' '}
                                    <span className="font-black">{resumedScore}/{round.maxScore} punten</span>.
                                </div>
                                {!showFollowUp && (
                                <button
                                    data-qa="review-continue"
                                    onClick={() => handleRoundComplete(resumedScore ?? 0)}
                                    className="w-full py-3 bg-gradient-to-r from-duck-ink to-duck-ink text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Volgende ronde
                                </button>
                                )}
                            </div>
                        ) : (
                        <>
                        {round.type === 'drag-sort' && (
                            <DragSort
                                title={round.title}
                                description={round.description}
                                items={round.items}
                                maxScore={round.maxScore}
                                onSubmit={handleRoundSubmit}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        {round.type === 'match-pairs' && (
                            <MatchPairs
                                title={round.title}
                                description={round.description}
                                pairs={round.pairs}
                                maxScore={round.maxScore}
                                onSubmit={handleRoundSubmit}
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
                                onSubmit={handleRoundSubmit}
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
                                onSubmit={handleRoundSubmit}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        </>
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
                            className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-gradient-to-br from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
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
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_REVIEW_ARENA_IDS: ReadonlySet<string> = new Set([
    'advanced-code-review',
    'code-review-2',
    'data-review',
    'impact-review',
    'media-review',
    'review-week-2',
    'security-review',
]);

export const ReviewArena: React.FC<TemplateMissionProps> = (props) => {
    const { missionId, onBack } = props;
    const [config, setConfig] = useState<ReviewArenaConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        setConfig(null);
        setLoadError(false);

        if (!VALID_REVIEW_ARENA_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find(
                    (value): value is ReviewArenaConfig =>
                        value !== null && typeof value === 'object' && 'missionId' in value
                );

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

    return <ReviewArenaWithConfig {...props} config={config} />;
};
