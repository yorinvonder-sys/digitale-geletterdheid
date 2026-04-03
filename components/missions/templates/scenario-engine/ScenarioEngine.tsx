import React, { useEffect, useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { PhaseCard } from '../shared/PhaseCard';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import type { TemplateMissionProps } from '../shared/types';
import type {
    ScenarioEngineConfig,
    ScenarioEngineState,
    ScenarioItem,
    ScenarioRound,
} from './types';

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreSelectCorrect(items: ScenarioItem[], selections: number[]): number {
    const correctIds = items.filter((i) => i.correct).map((i) => i.id);
    const correctSelected = selections.filter((id) => correctIds.includes(id)).length;
    const incorrectSelected = selections.filter((id) => !correctIds.includes(id)).length;
    return Math.max(0, Math.round((correctSelected / correctIds.length) * 25 - incorrectSelected * 4));
}

function scoreOrderPriority(items: ScenarioItem[], order: number[]): number {
    if (order.length !== items.length) return 0;
    let correct = 0;
    for (let i = 0; i < order.length; i++) {
        const item = items.find((it) => it.id === order[i])!;
        if (item.correctPosition === i) correct++;
        else if (Math.abs((item.correctPosition ?? 0) - i) === 1) correct += 0.5;
    }
    return Math.round((correct / items.length) * 25);
}

// selections encodes binary choices: +id = accepted, -id = rejected
function scoreBinaryChoice(items: ScenarioItem[], selections: number[]): number {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    let correct = 0;
    for (const item of items) {
        if (item.correct === true && acceptedIds.has(item.id)) correct++;
        if (item.correct === false && rejectedIds.has(item.id)) correct++;
    }
    return Math.round((correct / items.length) * 25);
}

function scoreRound(round: ScenarioRound, selections: number[]): number {
    switch (round.type) {
        case 'select-correct': return scoreSelectCorrect(round.items, selections);
        case 'order-priority': return scoreOrderPriority(round.items, selections);
        case 'binary-choice': return scoreBinaryChoice(round.items, selections);
    }
}

// ── select-correct ────────────────────────────────────────────────────────────

const SelectCorrectRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onToggle, onSubmit }) => (
    <>
        <div className="grid gap-3 mb-4 mt-4">
            {round.items.map((item) => {
                const isSelected = selections.includes(item.id);
                let border = 'border-[#E8E6DF]';
                let bg = 'bg-white';

                if (isSelected && !submitted) { border = 'border-[#D97757] ring-1 ring-[#D97757]/20'; bg = 'bg-[#D97757]/5'; }
                if (submitted && isSelected && item.correct) { border = 'border-[#10B981]'; bg = 'bg-[#10B981]/5'; }
                if (submitted && isSelected && !item.correct) { border = 'border-red-400'; bg = 'bg-red-50'; }
                if (submitted && !isSelected && item.correct) { border = 'border-[#10B981]/40'; bg = 'bg-[#10B981]/5'; }
                if (submitted && !isSelected && !item.correct) { bg = 'bg-[#F0EEE8]'; }

                return (
                    <button
                        key={item.id}
                        onClick={() => !submitted && onToggle(item.id)}
                        disabled={submitted}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${border} ${bg}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-sm font-bold text-[#1A1A19]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </span>
                                    {isSelected && !submitted && (
                                        <span className="text-[10px] bg-[#D97757]/10 text-[#D97757] px-2 py-0.5 rounded-full font-bold">geselecteerd</span>
                                    )}
                                    {submitted && isSelected && (
                                        item.correct
                                            ? <Check size={14} className="text-[#10B981]" />
                                            : <X size={14} className="text-red-500" />
                                    )}
                                    {submitted && !isSelected && item.correct && (
                                        <span className="text-[10px] text-[#10B981] font-bold">gemist!</span>
                                    )}
                                </div>
                                <p
                                    className="text-xs text-[#6B6B66] leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                                {submitted && (isSelected || item.correct) && (
                                    <p
                                        className="text-[11px] text-[#3D3D38] mt-2 italic"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.explanation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
        {!submitted && selections.length > 0 && (
            <p
                className="text-center text-xs text-[#6B6B66] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {selections.length} item{selections.length !== 1 ? 's' : ''} geselecteerd
            </p>
        )}
        {!submitted && (
            <button
                onClick={onSubmit}
                disabled={selections.length === 0}
                className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                    selections.length > 0
                        ? 'bg-[#D97757] hover:bg-[#C46849] text-white'
                        : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Controleer mijn keuze
            </button>
        )}
    </>
);

// ── order-priority ────────────────────────────────────────────────────────────

const OrderPriorityRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onAdd: (id: number) => void;
    onReset: () => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onAdd, onReset, onSubmit }) => {
    const remaining = round.items.filter((it) => !selections.includes(it.id));

    return (
        <div className="mt-4">
            {selections.length > 0 && (
                <div className="bg-[#FAF9F0] rounded-xl p-3 mb-4 border border-[#E8E6DF]">
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Jouw volgorde
                        </span>
                        {!submitted && (
                            <button
                                onClick={onReset}
                                className="text-[#6B6B66] hover:text-[#D97757] transition-colors"
                                aria-label="Opnieuw beginnen"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {selections.map((id, i) => {
                            const item = round.items.find((it) => it.id === id)!;
                            const isCorrect = submitted && item.correctPosition === i;
                            const isClose = submitted && !isCorrect && Math.abs((item.correctPosition ?? 0) - i) === 1;
                            return (
                                <div
                                    key={id}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                        submitted
                                            ? isCorrect ? 'bg-[#10B981]/10 text-[#10B981]'
                                            : isClose ? 'bg-amber-50 text-amber-600'
                                            : 'bg-red-50 text-red-500'
                                            : 'bg-white text-[#3D3D38]'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                            submitted
                                                ? isCorrect ? 'bg-[#10B981] text-white'
                                                : isClose ? 'bg-amber-400 text-white'
                                                : 'bg-red-400 text-white'
                                                : 'bg-[#D97757]/20 text-[#D97757]'
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span>{item.icon}</span>
                                    <span className="flex-1">{item.title}</span>
                                    {submitted && isCorrect && <Check size={12} />}
                                    {submitted && !isCorrect && (
                                        <span className="text-[10px] opacity-70">
                                            (#{(item.correctPosition ?? 0) + 1})
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!submitted && remaining.length > 0 && (
                <div className="space-y-2 mb-4">
                    <p
                        className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Klik in volgorde (meest manipulatief eerst)
                    </p>
                    {remaining.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAdd(item.id)}
                            className="w-full p-3 rounded-xl border-2 border-[#E8E6DF] bg-white hover:border-[#D97757] hover:bg-[#D97757]/5 text-left transition-all duration-200 flex items-center gap-3"
                        >
                            <span className="text-lg">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold text-[#1A1A19]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.title}
                                </p>
                                <p
                                    className="text-xs text-[#6B6B66] truncate"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {submitted && (
                <div className="space-y-2 mb-4">
                    {selections.map((id) => {
                        const item = round.items.find((it) => it.id === id)!;
                        return (
                            <div
                                key={id}
                                className="p-3 rounded-xl bg-[#FAF9F0] border border-[#E8E6DF] text-xs text-[#3D3D38] italic"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="font-bold not-italic">{item.icon} {item.title}:</span>{' '}
                                {item.explanation}
                            </div>
                        );
                    })}
                </div>
            )}

            {!submitted && selections.length === round.items.length && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97757] hover:bg-[#C46849] text-white transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer volgorde
                </button>
            )}
        </div>
    );
};

// ── binary-choice ─────────────────────────────────────────────────────────────
// selections encodes: +id = user accepted, -id = user rejected

const BinaryChoiceRound: React.FC<{
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onChoice: (id: number, accepted: boolean) => void;
    onSubmit: () => void;
}> = ({ round, selections, submitted, onChoice, onSubmit }) => {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    const allAnswered = (acceptedIds.size + rejectedIds.size) === round.items.length;

    return (
        <>
            <div className="space-y-3 mb-4 mt-4">
                {round.items.map((item) => {
                    const isAccepted = acceptedIds.has(item.id);
                    const isRejected = rejectedIds.has(item.id);
                    const isAnswered = isAccepted || isRejected;
                    const isCorrectAnswer = item.correct === true ? isAccepted : isRejected;

                    return (
                        <div
                            key={item.id}
                            className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                                submitted && isAnswered
                                    ? isCorrectAnswer
                                        ? 'border-[#10B981] bg-[#10B981]/5'
                                        : 'border-red-400 bg-red-50'
                                    : 'border-[#E8E6DF] bg-white'
                            }`}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-xl mt-0.5">{item.icon}</span>
                                <div className="flex-1">
                                    <p
                                        className="text-sm font-bold text-[#1A1A19] mb-1"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.title}
                                    </p>
                                    <p
                                        className="text-xs text-[#6B6B66] leading-relaxed"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {!submitted && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onChoice(item.id, true)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                            isAccepted
                                                ? 'bg-[#D97757] text-white'
                                                : 'bg-[#FAF9F0] text-[#6B6B66] hover:bg-[#D97757]/10 hover:text-[#D97757] border border-[#E8E6DF]'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        ✓ Accepteren
                                    </button>
                                    <button
                                        onClick={() => onChoice(item.id, false)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                            isRejected
                                                ? 'bg-[#1A1A19] text-white'
                                                : 'bg-[#FAF9F0] text-[#6B6B66] hover:bg-[#1A1A19]/10 hover:text-[#1A1A19] border border-[#E8E6DF]'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        ✕ Weigeren
                                    </button>
                                </div>
                            )}

                            {submitted && isAnswered && (
                                <div
                                    className={`mt-2 text-[11px] italic leading-relaxed ${
                                        isCorrectAnswer ? 'text-[#10B981]' : 'text-red-600'
                                    }`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {isCorrectAnswer ? '✓ ' : '✕ '}
                                    {item.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!submitted && allAnswered && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97757] hover:bg-[#C46849] text-white transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer keuzes
                </button>
            )}
            {!submitted && !allAnswered && (
                <p
                    className="text-center text-xs text-[#6B6B66] mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Beantwoord alle scenario's om door te gaan
                </p>
            )}
        </>
    );
};

// ── Feedback banner after round submit ────────────────────────────────────────

const FeedbackBanner: React.FC<{
    round: ScenarioRound;
    selections: number[];
    onNext: () => void;
    isLast: boolean;
}> = ({ round, selections, onNext, isLast }) => {
    const score = scoreRound(round, selections);
    const good = score >= 15; // 60% of 25

    return (
        <div
            className={`rounded-2xl border-2 p-4 mt-4 ${
                good ? 'border-[#10B981] bg-[#10B981]/5' : 'border-[#D97757] bg-[#D97757]/5'
            }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{good ? '🎉' : '💡'}</span>
                <span
                    className="text-sm font-black text-[#1A1A19]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {good ? (round.feedbackCorrect ?? 'Goed gedaan!') : (round.feedbackIncorrect ?? 'Bijna!')}
                </span>
            </div>
            <p
                className="text-xs text-[#6B6B66] mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Ronde score:{' '}
                <strong className={good ? 'text-[#10B981]' : 'text-[#D97757]'}>{score}/25</strong>
            </p>
            <button
                onClick={onNext}
                className="w-full py-2.5 rounded-full font-black text-sm bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white transition-all duration-200"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {isLast ? 'Bekijk eindresultaat' : 'Volgende ronde →'}
            </button>
        </div>
    );
};

// ── Loading / error screens ───────────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4">
        <div className="text-center">
            <div
                className="w-8 h-8 border-2 border-[#D97757] border-t-transparent rounded-full animate-spin mx-auto mb-3"
                aria-label="Laden..."
            />
            <p
                className="text-sm text-[#6B6B66]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Missie laden…
            </p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ missionId: string; onBack: () => void }> = ({ missionId, onBack }) => (
    <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2
                className="text-lg font-black text-[#1A1A19] mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                Missie niet gevonden
            </h2>
            <p
                className="text-sm text-[#6B6B66] mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                De configuratie voor <code>{missionId}</code> kon niet worden geladen.
            </p>
            <button
                onClick={onBack}
                className="px-5 py-2.5 bg-[#D97757] text-white rounded-xl text-sm font-bold"
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

// ── Config loader (import.meta.glob ensures Vite bundles all configs) ────────

const configModules = import.meta.glob<{ default: ScenarioEngineConfig }>('./configs/*.ts');

// ── Public entry point ────────────────────────────────────────────────────────

export const ScenarioEngine: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<ScenarioEngineConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loader = configModules[`./configs/${missionId}.ts`];
        if (!loader) { setLoadError(true); return; }
        loader().then((mod) => setConfig(mod.default)).catch(() => setLoadError(true));
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
        return acc + scoreRound(round, rs.selections);
    }, 0);

    const updateRoundState = (roundId: string, patch: { selections?: number[]; submitted?: boolean }) => {
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
                    score: scoreRound(round, state.roundStates[round.id]?.selections ?? []),
                    max: round.maxScore,
                }))}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // ── Active phase ──
    if (!currentRound || !roundState) return null;

    return (
        <div className="min-h-screen bg-[#FAF9F0] p-4">
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

                    {roundState.submitted && (
                        <FeedbackBanner
                            round={currentRound}
                            selections={roundState.selections}
                            onNext={handleNextRound}
                            isLast={state.currentRound === config.rounds.length - 1}
                        />
                    )}
                </PhaseCard>
            </div>
        </div>
    );
};
