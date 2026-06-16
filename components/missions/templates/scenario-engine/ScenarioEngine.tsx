import React, { useEffect, useState } from 'react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { PhaseCard } from '../shared/PhaseCard';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { ConfidenceRating, confidenceMultiplier } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import type { TemplateMissionProps } from '../shared/types';
import type {
    ScenarioEngineConfig,
    ScenarioEngineState,
    ScenarioRound,
    RoundState,
} from './types';
import { SelectCorrectRound } from './sub/SelectCorrectRound';
import { OrderPriorityRound } from './sub/OrderPriorityRound';
import { BinaryChoiceRound } from './sub/BinaryChoiceRound';
import { FeedbackBanner, scoreRound } from './sub/FeedbackBanner';

// ── Scoring ───────────────────────────────────────────────────────────────────

/** Berekent de gecorrigeerde score voor een ronde inclusief confidence multiplier en followUp bonus. */
function adjustedScoreRound(round: ScenarioRound, rs: RoundState): number {
    if (!rs.submitted) return 0;
    const base = scoreRound(round, rs.selections);
    const multiplied = Math.round(base * confidenceMultiplier(rs.confidence, base >= 15));
    const withBonus = rs.followUpAnswered && rs.followUpCorrect && round.followUp
        ? multiplied + round.followUp.bonusPoints
        : multiplied;
    return Math.min(withBonus, round.maxScore);
}

// ── Loading / error screens ───────────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
        <div className="text-center">
            <div
                className="w-8 h-8 border-2 border-[#D97848] border-t-transparent rounded-full animate-spin mx-auto mb-3"
                aria-label="Laden..."
            />
            <p
                className="text-sm text-[#445865]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Missie laden…
            </p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ missionId: string; onBack: () => void }> = ({ missionId, onBack }) => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2
                className="text-lg font-black text-[#08283B] mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                Missie niet gevonden
            </h2>
            <p
                className="text-sm text-[#445865] mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                De configuratie voor <code>{missionId}</code> kon niet worden geladen.
            </p>
            <button
                onClick={onBack}
                className="px-5 py-2.5 bg-[#D97848] text-white rounded-xl text-sm font-bold"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Terug
            </button>
        </div>
    </div>
);

// ── State helpers ─────────────────────────────────────────────────────────────

function buildInitialState(config: ScenarioEngineConfig): ScenarioEngineState {
    const roundStates: ScenarioEngineState['roundStates'] = {};
    for (const round of config.rounds) {
        roundStates[round.id] = { selections: [], submitted: false };
    }
    return { phase: 'intro', currentRound: 0, roundStates };
}

// ── Public entry point ────────────────────────────────────────────────────────

export const ScenarioEngine: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<ScenarioEngineConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}`)
            .then((mod) => setConfig(mod.default as ScenarioEngineConfig))
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return <ErrorScreen missionId={missionId} onBack={onBack} />;
    if (!config) return <LoadingScreen />;

    return <ScenarioEngineInner config={config} onBack={onBack} onComplete={onComplete} />;
};

// ── Inner (config loaded, autosave active) ────────────────────────────────────

const ScenarioEngineInner: React.FC<{
    config: ScenarioEngineConfig;
    onBack: () => void;
    onComplete: (success: boolean) => void;
}> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<ScenarioEngineState>(
        config.missionId,
        buildInitialState(config)
    );

    const currentRound = config.rounds[state.currentRound];
    const roundState = currentRound ? state.roundStates[currentRound.id] : null;

    const totalScore = config.rounds.reduce((acc, round) => {
        const rs = state.roundStates[round.id];
        if (!rs?.submitted) return acc;
        return acc + adjustedScoreRound(round, rs);
    }, 0);

    const updateRoundState = (roundId: string, patch: Partial<RoundState>) => {
        setState((prev) => ({
            ...prev,
            roundStates: {
                ...prev.roundStates,
                [roundId]: { ...prev.roundStates[roundId], ...patch },
            },
        }));
    };

    const handleToggle = (id: number) => {
        if (!roundState || roundState.submitted || !currentRound) return;
        const prev = roundState.selections;
        updateRoundState(currentRound.id, {
            selections: prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        });
    };

    const handleAddToOrder = (id: number) => {
        if (!roundState || roundState.submitted || !currentRound) return;
        updateRoundState(currentRound.id, { selections: [...roundState.selections, id] });
    };

    const handleResetOrder = () => {
        if (!roundState || roundState.submitted || !currentRound) return;
        updateRoundState(currentRound.id, { selections: [] });
    };

    const handleBinaryChoice = (id: number, accepted: boolean) => {
        if (!roundState || roundState.submitted || !currentRound) return;
        const prev = roundState.selections.filter((x) => Math.abs(x) !== id);
        updateRoundState(currentRound.id, { selections: [...prev, accepted ? id : -id] });
    };

    const handleSubmit = () => {
        if (!currentRound) return;
        updateRoundState(currentRound.id, { submitted: true });
    };

    const handleNextRound = () => {
        const nextIndex = state.currentRound + 1;
        if (nextIndex >= config.rounds.length) {
            setState((prev) => ({ ...prev, phase: 'results' }));
        } else {
            setState((prev) => ({ ...prev, currentRound: nextIndex }));
        }
    };

    const handleComplete = () => {
        clearSave();
        onComplete(totalScore >= config.maxScore * 0.4);
    };

    // ── Intro phase ──
    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                onStart={() => setState((prev) => ({ ...prev, phase: 'active' }))}
            />
        );
    }

    // ── Results phase ──
    if (state.phase === 'results') {
        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={config.rounds.map((round) => ({
                    icon: round.emoji,
                    title: round.title,
                    score: adjustedScoreRound(round, state.roundStates[round.id] ?? { selections: [], submitted: false }),
                    max: round.maxScore,
                }))}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // ── Active phase ──
    if (!currentRound || !roundState) return null;

    const baseScore = scoreRound(currentRound, roundState.selections);
    const roundIsCorrect = roundState.submitted && baseScore >= 15;
    const hasFollowUp = !!currentRound.followUp;
    const followUpPending = roundIsCorrect && hasFollowUp && !roundState.followUpAnswered;

    return (
        <div className="min-h-screen bg-[#FCF6EA] p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={state.currentRound}
                    totalPhases={config.rounds.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <PhaseCard
                    icon={<span className="text-lg">{currentRound.emoji}</span>}
                    phaseNumber={state.currentRound + 1}
                    totalPhases={config.rounds.length}
                    title={currentRound.title}
                    description={currentRound.description}
                >
                    {currentRound.type === 'select-correct' && (
                        <SelectCorrectRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onToggle={handleToggle}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {currentRound.type === 'order-priority' && (
                        <OrderPriorityRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onAdd={handleAddToOrder}
                            onReset={handleResetOrder}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {currentRound.type === 'binary-choice' && (
                        <BinaryChoiceRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onChoice={handleBinaryChoice}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {roundState.submitted && currentRound.showConfidence && roundState.confidence === undefined && (
                        <div className="mt-4">
                            <ConfidenceRating
                                onSelect={(level) => updateRoundState(currentRound.id, { confidence: level })}
                            />
                        </div>
                    )}

                    {roundState.submitted && (currentRound.showConfidence ? roundState.confidence !== undefined : true) && (
                        <>
                            <FeedbackBanner
                                round={currentRound}
                                selections={roundState.selections}
                                onNext={handleNextRound}
                                isLast={state.currentRound === config.rounds.length - 1}
                                hideButton={followUpPending}
                            />

                            {followUpPending && currentRound.followUp && (
                                <FollowUpCard
                                    followUp={currentRound.followUp}
                                    onComplete={(correct) => {
                                        updateRoundState(currentRound.id, {
                                            followUpAnswered: true,
                                            followUpCorrect: correct,
                                        });
                                        handleNextRound();
                                    }}
                                    theme="light"
                                />
                            )}
                        </>
                    )}
                </PhaseCard>
            </div>
        </div>
    );
};
