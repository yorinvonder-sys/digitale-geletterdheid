import React, { useEffect, useState } from 'react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { PhaseCard } from '../shared/PhaseCard';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { ConfidenceRating, ConfidenceFeedback } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { getMissionGoal } from '@/config/missionGoals';
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
import { SpotTheFlagsRound } from './sub/SpotTheFlagsRound';
import { OrderDragRound } from './sub/OrderDragRound';
import { InboxTriageRound } from './sub/InboxTriageRound';
import { FeedbackBanner, followUpWeight, scaledItemScore, scoreRound } from './sub/FeedbackBanner';

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Berekent de gecorrigeerde score voor een ronde: de itemscore plus de followUp
 * bonus en — wanneer de ronde `followUpWeight` zet — de punten die voor de
 * followUp-vraag zijn gereserveerd. De zelfingeschatte zekerheid telt bewust
 * niet mee: die dient voor kalibratie-feedback, niet voor de score.
 */
function adjustedScoreRound(round: ScenarioRound, rs: RoundState): number {
    if (!rs.submitted) return 0;
    const items = scaledItemScore(round, rs.selections);
    const followUpEarned = rs.followUpAnswered && rs.followUpCorrect && round.followUp
        ? followUpWeight(round) + round.followUp.bonusPoints
        : 0;
    return Math.min(items + followUpEarned, round.maxScore);
}

// ── Loading / error screens ───────────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center">
            <div
                className="w-8 h-8 border-2 border-duck-acid border-t-transparent rounded-full animate-spin mx-auto mb-3"
                aria-label="Laden..."
            />
            <p
                className="text-sm text-duck-ink/70"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Missie laden…
            </p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ missionId: string; onBack: () => void }> = ({ missionId, onBack }) => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2
                className="text-lg font-black text-duck-ink mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                Missie niet gevonden
            </h2>
            <p
                className="text-sm text-duck-ink/70 mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                De configuratie voor <code>{missionId}</code> kon niet worden geladen.
            </p>
            <button
                onClick={onBack}
                className="px-5 py-2.5 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Terug
            </button>
        </div>
    </div>
);

const RecoveryScreen: React.FC<{ onRestart: () => void; onBack: () => void }> = ({ onRestart, onBack }) => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">🔄</div>
            <h2
                className="text-lg font-black text-duck-ink mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                Deze ronde bestaat niet meer
            </h2>
            <p
                className="text-sm text-duck-ink/70 mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                De missie is bijgewerkt sinds je opgeslagen voortgang. Begin opnieuw om verder te gaan.
            </p>
            <div className="flex gap-2 justify-center">
                <button
                    onClick={onRestart}
                    className="px-5 py-2.5 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Opnieuw beginnen
                </button>
                <button
                    onClick={onBack}
                    className="px-5 py-2.5 border-2 border-duck-gray text-duck-ink rounded-xl text-sm font-bold"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Terug
                </button>
            </div>
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

/**
 * Toetst herstelde voortgang tegen de huidige config. Is een ronde hernoemd of
 * verwijderd sinds het opslaan, dan wijst `currentRound` naar niets meer en
 * ontbreekt de bijbehorende roundState — de engine liet dan een leeg scherm zien
 * dat na elke herlaad terugkwam. Faalt deze check, dan start de missie vers.
 */
function isStateValidForConfig(saved: ScenarioEngineState, config: ScenarioEngineConfig): boolean {
    if (!saved || typeof saved !== 'object') return false;
    if (!saved.roundStates || typeof saved.roundStates !== 'object') return false;
    const knownIds = new Set(config.rounds.map((round) => round.id));
    // Elke opgeslagen ronde moet nog bestaan, en elke huidige ronde moet state hebben.
    if (Object.keys(saved.roundStates).some((id) => !knownIds.has(id))) return false;
    // Elke huidige ronde moet state hebben, en geen selectie mag naar een item
    // wijzen dat uit de config verdwenen is: de scoreberekening zoekt dat item op
    // en draait bij elke render over alle rondes heen.
    if (config.rounds.some((round) => {
        const rs = saved.roundStates[round.id];
        if (!rs || !Array.isArray(rs.selections)) return true;
        if (typeof rs.submitted !== 'boolean') return true;
        // Goedkope bovengrens: meer selecties dan items betekent bewerkte opslag.
        if (rs.selections.length > round.items.length) return true;
        if (rs.selections.some((id) => !Number.isInteger(id))) return true;
        // Elk item hoogstens één keer, en nooit als accepteren én weigeren tegelijk.
        // Zonder deze eis telde zevenmaal hetzelfde id zeven keer mee en gaf een
        // ronde met vijf juiste items 35 van de 25 punten.
        if (new Set(rs.selections).size !== rs.selections.length) return true;
        const chosen = new Set(rs.selections.map((id) => Math.abs(id)));
        if (chosen.size !== rs.selections.length) return true;
        return rs.selections.some((id) => !round.items.some((item) => item.id === Math.abs(id)));
    })) return false;
    // currentRound moet binnen de huidige rondelijst vallen.
    return (
        Number.isInteger(saved.currentRound) &&
        saved.currentRound >= 0 &&
        saved.currentRound < config.rounds.length
    );
}

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_SCENARIO_ENGINE_IDS: ReadonlySet<string> = new Set([
    'ai-bias-detective',
    'code-denker',
    'cookie-crusher',
    'data-speurder',
    'digital-forensics',
    'factchecker',
    'mail-detective',
    'notificatie-ninja',
    'online-helden',
    'phishing-fighter',
    'social-safeguard',
    'veilig-internet',
]);

// ── Public entry point ────────────────────────────────────────────────────────

export const ScenarioEngine: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<ScenarioEngineConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_SCENARIO_ENGINE_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
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
    onComplete: (success: boolean) => boolean | void | Promise<boolean | void>;
}> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<ScenarioEngineState>(
        config.missionId,
        buildInitialState(config),
        { validate: (saved) => isStateValidForConfig(saved, config) }
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
        if (roundState.selections.includes(id)) return;
        if (!currentRound.items.some((item) => item.id === id)) return;
        updateRoundState(currentRound.id, { selections: [...roundState.selections, id] });
    };

    const handleResetOrder = () => {
        if (!roundState || roundState.submitted || !currentRound) return;
        updateRoundState(currentRound.id, { selections: [] });
    };

    /**
     * Volledige herordening voor sleep-rondes. De ingestuurde volgorde wordt
     * gefilterd op items die echt in de ronde staan en ontdubbeld, zodat een
     * sleepcomponent nooit een selectielijst kan opleveren die de opslagvalidatie
     * of de scoreformule zou breken.
     */
    const handleReorder = (order: number[]) => {
        if (!roundState || roundState.submitted || !currentRound) return;
        const known = new Set(currentRound.items.map((item) => item.id));
        const seen = new Set<number>();
        const safe = order.filter((id) => {
            if (!known.has(id) || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
        updateRoundState(currentRound.id, { selections: safe });
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

    const handleComplete = async () => {
        const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
        const success = missionGoal?.criteria.type === 'score-threshold'
            ? totalScore >= (missionGoal.criteria.threshold ?? config.maxScore * 0.4)
            : true;
        const completed = await onComplete(success);
        if (completed !== false) {
            clearSave();
        }
    };

    // ── Intro phase ──
    if (state.phase === 'intro') {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                features={config.introFeatures}
                attribution={config.attribution}
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
                missionTitle={config.title}
                phases={config.rounds.map((round) => ({
                    icon: round.emoji,
                    title: round.title,
                    score: adjustedScoreRound(round, state.roundStates[round.id] ?? { selections: [], submitted: false }),
                    max: round.maxScore,
                }))}
                takeaways={config.takeaways}
                attribution={config.attribution}
                onComplete={handleComplete}
            />
        );
    }

    // ── Active phase ──
    // Vangnet: als de ronde of zijn state alsnog ontbreekt (bijvoorbeeld doordat
    // de config wijzigt terwijl de missie openstaat), toon een scherm mét uitweg
    // in plaats van een leeg scherm zonder terugknop.
    if (!currentRound || !roundState) {
        return (
            <RecoveryScreen
                onRestart={() => {
                    clearSave();
                    setState(buildInitialState(config));
                }}
                onBack={onBack}
            />
        );
    }

    const hasFollowUp = !!currentRound.followUp;
    // De verdiepingsvraag is niet langer voorbehouden aan wie de ronde al goed
    // had: bij `followUpWeight > 0` zijn die punten anders onbereikbaar voor
    // precies de leerling die de verdieping het hardst nodig heeft.
    const followUpPending = roundState.submitted && hasFollowUp && !roundState.followUpAnswered;
    // Alleen voor de kalibratie-terugkoppeling: klopte de inschatting van de leerling?
    const roundIsCorrect = roundState.submitted && scoreRound(currentRound, roundState.selections) >= 15;

    return (
        <div className="min-h-screen bg-duck-bg p-4">
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

                    {currentRound.type === 'spot-the-flags' && (
                        <SpotTheFlagsRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onToggle={handleToggle}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {currentRound.type === 'order-drag' && (
                        <OrderDragRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onReorder={handleReorder}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {currentRound.type === 'inbox-triage' && (
                        <InboxTriageRound
                            round={currentRound}
                            selections={roundState.selections}
                            submitted={roundState.submitted}
                            onChoice={handleBinaryChoice}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {roundState.submitted && currentRound.showConfidence && (
                        <div className="mt-4 space-y-2">
                            <ConfidenceRating
                                selected={roundState.confidence}
                                onSelect={(level) => updateRoundState(currentRound.id, { confidence: level })}
                            />
                            <ConfidenceFeedback
                                confidence={roundState.confidence}
                                correct={roundIsCorrect}
                            />
                        </div>
                    )}

                    {/* De zekerheidskeuze is optioneel: hij mag de feedback niet blokkeren. */}
                    {roundState.submitted && (
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
                                    scoreWeight={followUpWeight(currentRound)}
                                    onAnswer={(correct) => {
                                        if (roundState.followUpCorrect === undefined) {
                                            updateRoundState(currentRound.id, { followUpCorrect: correct });
                                        }
                                    }}
                                    onComplete={(correct) => {
                                        updateRoundState(currentRound.id, {
                                            followUpAnswered: true,
                                            followUpCorrect: roundState.followUpCorrect ?? correct,
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
