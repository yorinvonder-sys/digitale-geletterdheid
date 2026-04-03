import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { FollowUpCard } from '../shared/FollowUpCard';
import { DragSort } from './sub/DragSort';
import { MatchPairs } from './sub/MatchPairs';
import { Categorize } from './sub/Categorize';
import { RapidFire } from './sub/RapidFire';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

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
    introFeatures?: string[];
    rounds: ReviewRound[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

// === State ===

interface ReviewArenaState {
    phase: 'intro' | 'round' | 'complete';
    currentRound: number;
    roundScores: number[];
    followUpResults: Record<string, { answered: boolean; correct: boolean }>;
}

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
        followUpResults: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<ReviewArenaState>(
        missionId,
        initialState
    );

    // Local (non-persisted) follow-up UI state
    const [pendingScore, setPendingScore] = useState<number | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);

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

    const handleRoundComplete = useCallback(
        (score: number) => {
            const round = config.rounds[state.currentRound];
            if (round?.followUp && score > round.maxScore * 0.5) {
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
        onComplete(true);
    }, [clearSave, onComplete]);

    // === Intro ===
    if (state.phase === 'intro') {
        const features = config.introFeatures ?? config.rounds.map((r) => `${ROUND_ICONS[r.type]} ${r.title}`);
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                onStart={handleStart}
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

    return (
        <div className="min-h-screen bg-[#FAF9F0] p-4">
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
                        className="text-xs font-black text-[#D97757] uppercase tracking-widest"
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
                        className="bg-white rounded-2xl border border-[#E8E6DF] p-5"
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
        </div>
    );
};

// === Default export: stub-compatible wrapper that loads a config ===
// When used without a config prop, it falls back to the data-review config.
// Consumers can also import ReviewArenaWithConfig directly and pass their own config.

export { ReviewArenaWithConfig };

// Lazy-load the default config to keep bundle splits intact
import { dataReviewConfig } from './configs/data-review';

export const ReviewArena: React.FC<TemplateMissionProps> = (props) => (
    <ReviewArenaWithConfig {...props} config={dataReviewConfig} />
);
