import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, ClipboardCheck, FileSearch, Target } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { PhaseCard } from '../shared/PhaseCard';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { MissionGoalBanner } from '../shared/MissionGoalBanner';
import { ConfidenceRating, confidenceMultiplier } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { getMissionGoal } from '@/config/missionGoals';
import type { MissionExperienceDesign, TemplateMissionProps } from '../shared/types';
import type {
    ScenarioEngineConfig,
    ScenarioEngineState,
    ScenarioRound,
    RoundState,
    ScenarioIntroChoiceOption,
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
    // 60% of maxScore is considered correct
    const correct = base >= (round.maxScore * 0.6);
    
    let multiplied = 0;
    if (correct) {
        multiplied = Math.round(base * confidenceMultiplier(rs.confidence, true));
    } else {
        const penaltyMultiplier = confidenceMultiplier(rs.confidence, false);
        if (penaltyMultiplier < 0) {
            // Apply overconfidence penalty based on round maxScore
            multiplied = Math.round(round.maxScore * penaltyMultiplier);
        } else {
            // "Gok" gets no penalty, keeps their minor base score
            multiplied = base;
        }
    }

    const withBonus = rs.followUpAnswered && rs.followUpCorrect && round.followUp
        ? multiplied + round.followUp.bonusPoints
        : multiplied;
    return Math.max(0, Math.min(withBonus, round.maxScore));
}

function getRoundTypeLabel(round: ScenarioRound): string {
    switch (round.type) {
        case 'select-correct':
            return 'Bewijs kiezen';
        case 'order-priority':
            return 'Prioriteit bepalen';
        case 'binary-choice':
            return round.acceptLabel && round.rejectLabel ? `${round.acceptLabel} / ${round.rejectLabel}` : 'Dilemma beslissen';
        default:
            return 'Case oplossen';
    }
}

function getScenarioAction(round: ScenarioRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.primaryInteraction === 'prioritize-case') {
        return round.type === 'order-priority'
            ? 'Zet de cases in volgorde van urgentie.'
            : 'Kies welke signalen direct actie vragen.';
    }
    if (experienceDesign?.primaryInteraction === 'choose-with-consequence') {
        return round.type === 'binary-choice'
            ? 'Neem per case een keuze en check de consequentie.'
            : 'Selecteer je keuze alsof iemand op jouw advies wacht.';
    }
    if (experienceDesign?.primaryInteraction === 'pin-evidence') {
        return 'Pin alleen het bewijs dat je keuze echt ondersteunt.';
    }
    return round.type === 'order-priority'
        ? 'Rangschik de cases en verdedig je volgorde.'
        : 'Kies je bewijs en controleer de feedback.';
}

function getScenarioEvidence(round: ScenarioRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.evidenceMoment) return experienceDesign.evidenceMoment;
    return round.type === 'order-priority'
        ? 'Je bewijs is je volgorde plus de uitleg per case.'
        : 'Je bewijs is je selectie en de feedback op gemiste of fout gekozen items.';
}

function getScenarioFeedback(round: ScenarioRound, experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.feedbackMoment) return experienceDesign.feedbackMoment;
    return round.followUp
        ? 'Na feedback volgt een korte bonuscheck.'
        : 'Feedback toont direct welke signalen kloppen en welke je mist.';
}

const ScenarioRoundBrief: React.FC<{
    round: ScenarioRound;
    experienceDesign?: MissionExperienceDesign;
}> = ({ round, experienceDesign }) => (
    <section
        className="mb-3 grid gap-2 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] p-2 sm:grid-cols-[0.8fr_1fr_1fr]"
        data-qa="scenario-round-brief"
    >
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#D97848]">
                <FileSearch size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">{getRoundTypeLabel(round)}</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getScenarioAction(round, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#0B453F]">
                <Target size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">Bewijs</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getScenarioEvidence(round, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-white p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[#5F947D]">
                <ClipboardCheck size={13} />
                <p className="text-[10px] font-black uppercase tracking-widest">Feedback</p>
            </div>
            <p className="text-[11px] font-semibold leading-snug text-[#445865]">
                {getScenarioFeedback(round, experienceDesign)}
            </p>
        </div>
    </section>
);

interface ScenarioTriageRoute {
    id: string;
    label: string;
    description: string;
    feedback: string;
    tag: string;
}

function buildScenarioTriageRoutes(config: ScenarioEngineConfig): ScenarioTriageRoute[] {
    if (config.introChoice) {
        return config.introChoice.options.map((option: ScenarioIntroChoiceOption) => ({
            ...option,
            tag: 'Hypothese',
        }));
    }

    return config.rounds.slice(0, 3).map((round, index) => ({
        id: round.id,
        label: round.title,
        description: getScenarioAction(round, config.experienceDesign),
        tag: getRoundTypeLabel(round),
        feedback: index === 0
            ? (config.experienceDesign?.feedbackMoment ?? 'Goede route: je begint met bewijs voordat je conclusies trekt.')
            : 'Slimme route: je kiest eerst welke case aandacht vraagt en bouwt daarna bewijs op.',
    }));
}

const ScenarioTriageIntro: React.FC<{
    config: ScenarioEngineConfig;
    missionGoal?: ReturnType<typeof getMissionGoal>;
    selectedRouteId?: string;
    onSelectRoute: (routeId: string) => void;
    onStart: () => void;
}> = ({ config, missionGoal, selectedRouteId, onSelectRoute, onStart }) => {
    const routes = buildScenarioTriageRoutes(config);
    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    const prompt = config.introChoice?.prompt ?? 'Kies je eerste route voordat je de case opent.';
    const scenario = config.introChoice?.scenario ?? (config.experienceDesign?.firstTenSeconds ?? config.introDescription);

    return (
        <div
            className="flex min-h-dvh items-start justify-center overflow-y-auto bg-[#FCF6EA] px-4 py-4 sm:py-6"
            data-qa="scenario-triage-console"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            <div className="w-full max-w-3xl pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="mb-4 rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] p-4 text-center shadow-sm sm:p-5">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-[#08283B] text-3xl text-white shadow-sm sm:size-16 sm:text-4xl">
                        <span aria-hidden="true">{config.introEmoji}</span>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#D97848]">
                        Case Triage
                    </p>
                    <h1
                        className="mt-1 text-xl font-black text-[#08283B] sm:text-2xl"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {config.introTitle}
                    </h1>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#445865]">
                        {config.introDescription}
                    </p>
                </div>

                {missionGoal && <MissionGoalBanner goal={missionGoal} compact className="mb-4" />}

                <section className="rounded-2xl border border-[#E7D8BD] bg-white p-4 shadow-sm" data-qa="scenario-intro-choice">
                    <div className="mb-3 rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D97848]">
                            Eerste actie
                        </p>
                        <p className="mt-1 text-sm font-black leading-relaxed text-[#08283B]">
                            {scenario}
                        </p>
                    </div>

                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#445865]">
                                {config.introChoice?.title ?? 'Kies je triageroute'}
                            </p>
                            <p className="mt-1 text-sm font-black leading-relaxed text-[#08283B]">
                                {prompt}
                            </p>
                        </div>
                        <span className="hidden shrink-0 rounded-lg bg-[#08283B] px-2.5 py-1 text-[10px] font-black text-white sm:inline-flex">
                            {config.rounds.length} rondes
                        </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Kies je eerste caseroute">
                        {routes.map((route) => {
                            const selected = selectedRouteId === route.id;
                            return (
                                <button
                                    key={route.id}
                                    type="button"
                                    onClick={() => onSelectRoute(route.id)}
                                    aria-pressed={selected}
                                    data-qa="scenario-triage-route"
                                    className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97848]/50 ${
                                        selected
                                            ? 'border-[#D97848] bg-[#D97848]/10 shadow-sm'
                                            : 'border-[#E7D8BD] bg-[#FFFDF7] hover:border-[#D97848]/50 hover:bg-white'
                                    }`}
                                >
                                    <span className="flex items-start justify-between gap-3">
                                        <span className="min-w-0">
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-[#5F947D]">
                                                {route.tag}
                                            </span>
                                            <span className="mt-1 block text-sm font-black leading-tight text-[#08283B]">
                                                {route.label}
                                            </span>
                                            <span className="mt-1 block text-xs font-semibold leading-relaxed text-[#445865]">
                                                {route.description}
                                            </span>
                                        </span>
                                        {selected && <CheckCircle2 size={18} className="shrink-0 text-[#D97848]" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className={`mt-3 rounded-xl border p-3 text-xs font-bold leading-snug ${
                            selectedRoute
                                ? 'border-[#5F947D]/30 bg-[#5F947D]/10 text-[#08283B]'
                                : 'border-[#E7D8BD] bg-[#FCF6EA] text-[#445865]'
                        }`}
                        data-qa="scenario-triage-feedback"
                        aria-live="polite"
                    >
                        {selectedRoute
                            ? selectedRoute.feedback
                            : (config.experienceDesign?.antiBoringRule ?? 'Kies eerst hoe je deze case aanpakt. Daarna verzamel je bewijs in de rondes.')}
                    </div>
                </section>

                <button
                    onClick={onStart}
                    disabled={!selectedRouteId}
                    data-qa="scenario-triage-start"
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2 active:scale-[0.98] ${
                        selectedRouteId
                            ? 'bg-[#D7C95F] text-[#08283B] shadow-[#D7C95F]/25 hover:bg-[#CBC04F]'
                            : 'cursor-not-allowed bg-[#E7D8BD] text-[#445865] shadow-none'
                    }`}
                >
                    {selectedRouteId ? 'Open de case' : 'Kies eerst je route'}
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};


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
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    const configuredThreshold = missionGoal?.criteria.threshold;
    const completionThreshold = typeof configuredThreshold === 'number'
        ? configuredThreshold <= 1 ? Math.round(config.maxScore * configuredThreshold) : configuredThreshold
        : Math.round(config.maxScore * 0.4);
    const submittedRounds = config.rounds.filter((round) => state.roundStates[round.id]?.submitted).length;
    const requiredRounds = missionGoal?.criteria.type === 'rounds-complete'
        ? missionGoal.criteria.min ?? config.rounds.length
        : config.rounds.length;
    const isMissionComplete = missionGoal?.criteria.type === 'rounds-complete'
        ? submittedRounds >= requiredRounds
        : submittedRounds >= config.rounds.length && totalScore >= completionThreshold;
    const completionStatus = {
        isComplete: isMissionComplete,
        title: isMissionComplete ? 'Bewijs compleet' : 'Nog niet voltooid',
        description: isMissionComplete
            ? missionGoal?.criteria.type === 'rounds-complete'
                ? `Je rondes zijn afgerond: ${submittedRounds}/${config.rounds.length} case-acties zijn ingediend.`
                : `Je rondes zijn afgerond en je score is minimaal ${completionThreshold}/${config.maxScore}.`
            : missionGoal?.criteria.type === 'rounds-complete'
              ? `Voor voltooiing moet je ${requiredRounds}/${config.rounds.length} case-acties indienen.`
              : `Voor voltooiing moet je alle rondes afronden en minimaal ${completionThreshold}/${config.maxScore} punten halen.`,
    };

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
        onComplete(isMissionComplete);
    };

    // ── Intro phase ──
    if (state.phase === 'intro') {
        if (config.experienceDesign || config.introChoice) {
            return (
                <ScenarioTriageIntro
                    config={config}
                    missionGoal={missionGoal}
                    selectedRouteId={state.introChoiceId}
                    onSelectRoute={(routeId) => setState(prev => ({ ...prev, introChoiceId: routeId }))}
                    onStart={() => setState((prev) => ({ ...prev, phase: 'active' }))}
                />
            );
        }

        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={[
                    ...(config.experienceDesign?.firstTenSeconds ? [config.experienceDesign.firstTenSeconds] : []),
                    ...(config.introFeatures ?? []),
                ]}
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
                evidence={missionGoal?.evidence}
                completionStatus={completionStatus}
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
    const feedbackReady = roundState.submitted && (currentRound.showConfidence ? roundState.confidence !== undefined : true);

    return (
        <div className="min-h-dvh overflow-y-auto bg-[#FCF6EA] p-3 sm:p-4" data-qa="scenario-engine-active">
            <div className="mx-auto max-w-3xl pb-[max(1rem,env(safe-area-inset-bottom))]">
                <PhaseHeader
                    currentPhase={state.currentRound}
                    totalPhases={config.rounds.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <ScenarioRoundBrief round={currentRound} experienceDesign={config.experienceDesign} />

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

                    {feedbackReady && (
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

                {feedbackReady && !followUpPending && (
                    <div
                        className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] p-2 shadow-lg shadow-[#08283B]/10"
                        data-qa="scenario-fixed-progress"
                    >
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#D97848]">
                                Ronde klaar
                            </p>
                            <p className="truncate text-xs font-bold text-[#445865]">
                                Score {scoreRound(currentRound, roundState.selections)}/25
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextRound}
                            className="min-h-[40px] shrink-0 rounded-lg bg-[#D97848] px-4 text-xs font-black text-white transition-colors hover:brightness-95"
                            data-qa="scenario-fixed-next"
                        >
                            {state.currentRound === config.rounds.length - 1 ? 'Resultaat' : 'Volgende'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
