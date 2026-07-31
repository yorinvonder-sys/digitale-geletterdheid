import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps } from '../shared/types';
import type { PasswordFortressConfig, FortressRound } from './passwordFortressTypes';
import { runAttacks, ATTACK_META, type FortressReport } from './fortressEngine';

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_PASSWORD_FORTRESS_IDS: ReadonlySet<string> = new Set([
    'wachtwoord-fortress',
]);

// ── Autosave-state ───────────────────────────────────────────────────────────
// Bevat bewust GEEN ingevoerde wachtwoorden — alleen voortgang en afgeleide,
// niet-gevoelige labels. Het wachtwoordveld zelf leeft in lokale state.

interface FortressState {
    phase: 'intro' | 'round' | 'results';
    currentRound: number;
    attempts: Record<string, number>;
    hintsUsed: Record<string, number>;
    cleared: string[];
    skipped: string[];
    bestTimeLabels: Record<string, string>;
}

const makeInitialState = (): FortressState => ({
    phase: 'intro',
    currentRound: 0,
    attempts: {},
    hintsUsed: {},
    cleared: [],
    skipped: [],
    bestTimeLabels: {},
});

// ── Loading / error screens ──────────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center">
            <div
                className="w-8 h-8 border-2 border-duck-acid border-t-transparent rounded-full animate-spin mx-auto mb-3"
                aria-label="Laden..."
            />
            <p
                className="text-sm text-duck-ink/60"
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
                className="text-sm text-duck-ink/60 mb-4"
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

// ── Fort-meter ───────────────────────────────────────────────────────────────

const FortressMeter: React.FC<{
    report: FortressReport | null;
    revealed: boolean;
}> = ({ report, revealed }) => {
    const level = revealed && report ? report.shieldLevel : 0;
    const fell = revealed && report ? !report.holds : false;
    return (
        <div className="flex items-center gap-3">
            <div className="text-2xl" aria-hidden="true">
                {revealed && report ? (fell ? '🔥' : '🏰') : '🏰'}
            </div>
            <div className="flex-1">
                <div className="font-mono text-[10px] text-duck-gray uppercase tracking-widest mb-1">
                    Fortsterkte
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(seg => (
                        <div
                            key={seg}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                revealed && report
                                    ? seg <= level
                                        ? 'bg-duck-acid'
                                        : fell
                                          ? 'bg-duck-error/50'
                                          : 'bg-duck-gray/30'
                                    : 'bg-duck-gray/30'
                            }`}
                        />
                    ))}
                </div>
            </div>
            {revealed && report && (
                <div
                    className={`font-mono text-[11px] font-bold ${
                        fell ? 'text-duck-error' : 'text-duck-acid'
                    }`}
                >
                    {report.timeLabel}
                </div>
            )}
        </div>
    );
};

// ── Aanval-rij ───────────────────────────────────────────────────────────────

const AttackRow: React.FC<{
    attackId: FortressRound['attacks'][number];
    result: FortressReport['results'][number] | null;
    state: 'idle' | 'running' | 'done';
}> = ({ attackId, result, state }) => {
    const meta = ATTACK_META[attackId];
    return (
        <div
            className={`rounded-xl border p-3 transition-all duration-300 ${
                state === 'done' && result
                    ? result.broken
                        ? 'border-duck-error/60 bg-duck-error/10'
                        : 'border-duck-acid/50 bg-duck-ink'
                    : 'border-duck-gray/30 bg-duck-ink'
            }`}
        >
            <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">{meta.emoji}</span>
                <span className="font-mono text-xs font-bold text-duck-bg flex-1">
                    {meta.name}
                </span>
                {state === 'running' && (
                    <span className="font-mono text-[10px] text-duck-acid animate-pulse">
                        AANVAL LOOPT…
                    </span>
                )}
                {state === 'done' && result && (
                    <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                            result.broken ? 'text-duck-error' : 'text-duck-acid'
                        }`}
                    >
                        {result.broken ? '>> DOORBROKEN <<' : 'houdt stand'}
                    </span>
                )}
            </div>
            {state === 'idle' && (
                <p className="font-mono text-[10px] text-duck-gray mt-1 ml-6">
                    {meta.description}
                </p>
            )}
            {state === 'done' && result && (
                <div className="mt-1 ml-6">
                    <p className="font-mono text-[10px] text-duck-gray">
                        Kraaktijd: <span className={result.broken ? 'text-duck-error font-bold' : 'text-duck-bg'}>{result.timeLabel}</span>
                    </p>
                    <p className="font-mono text-[10px] text-duck-gray/80 mt-0.5">{result.detail}</p>
                </div>
            )}
        </div>
    );
};

// ── Public entry point ───────────────────────────────────────────────────────

export const PasswordFortress: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<PasswordFortressConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_PASSWORD_FORTRESS_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => setConfig(mod.default as PasswordFortressConfig))
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return <ErrorScreen missionId={missionId} onBack={onBack} />;
    if (!config) return <LoadingScreen />;

    return <PasswordFortressInner config={config} onBack={onBack} onComplete={onComplete} />;
};

// ── Inner (config geladen, autosave actief) ──────────────────────────────────

const PasswordFortressInner: React.FC<{
    config: PasswordFortressConfig;
    onBack: () => void;
    onComplete: (success: boolean) => void;
}> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<FortressState>(
        config.missionId,
        makeInitialState()
    );

    // Lokale state — het wachtwoord wordt bewust NIET geautosaved.
    const [input, setInput] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [report, setReport] = useState<FortressReport | null>(null);
    const [revealCount, setRevealCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const round = config.rounds[state.currentRound];
    const roundId = round?.id ?? '';
    const attempts = state.attempts[roundId] ?? 0;
    const hintsUsed = state.hintsUsed[roundId] ?? 0;
    const isCleared = state.cleared.includes(roundId);

    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);

    const roundPoints = (id: string): number => {
        if (!state.cleared.includes(id)) return 0;
        return Math.max(0, config.pointsPerRound - (state.hintsUsed[id] ?? 0) * config.hintCost);
    };
    const totalScore = config.rounds.reduce((acc, r) => acc + roundPoints(r.id), 0);

    // Getrapte onthulling van aanvalsresultaten (puur presentatie, geen echte tool).
    useEffect(() => {
        if (!report || !round) return;
        if (revealCount >= round.attacks.length) return;
        const t = setTimeout(() => setRevealCount(c => c + 1), 850);
        return () => clearTimeout(t);
    }, [report, revealCount, round]);

    const revealing = report !== null && round !== undefined && revealCount < round.attacks.length;
    const revealed = report !== null && !revealing;

    const resetLocal = () => {
        setInput('');
        setReport(null);
        setRevealCount(0);
    };

    const handleTest = () => {
        if (!round || !input.trim() || revealing || isCleared) return;
        const rep = runAttacks(input, round.attacks, round.targetSeconds);
        setReport(rep);
        setRevealCount(0);
        setState(prev => {
            const next: FortressState = {
                ...prev,
                bestTimeLabels: { ...prev.bestTimeLabels, [roundId]: rep.timeLabel },
            };
            if (rep.holds) {
                next.cleared = prev.cleared.includes(roundId) ? prev.cleared : [...prev.cleared, roundId];
            } else {
                next.attempts = { ...prev.attempts, [roundId]: (prev.attempts[roundId] ?? 0) + 1 };
            }
            return next;
        });
    };

    const goNextRound = () => {
        resetLocal();
        if (state.currentRound < config.rounds.length - 1) {
            setState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
        } else {
            setState(prev => ({ ...prev, phase: 'results' }));
        }
    };

    const handleSkip = () => {
        setState(prev => ({
            ...prev,
            skipped: prev.skipped.includes(roundId) ? prev.skipped : [...prev.skipped, roundId],
        }));
        goNextRound();
    };

    const handleHint = () => {
        if (!round || hintsUsed >= round.hints.length) return;
        setState(prev => ({
            ...prev,
            hintsUsed: { ...prev.hintsUsed, [roundId]: (prev.hintsUsed[roundId] ?? 0) + 1 },
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleTest();
    };

    // ── INTRO ────────────────────────────────────────────────────────────────
    if (state.phase === 'intro') {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={config.introFeatures}
                tone="terminal"
                eyebrow={`> ${config.missionId}`}
                onStart={() => setState(prev => ({ ...prev, phase: 'round' }))}
            />
        );
    }

    // ── RESULTS ──────────────────────────────────────────────────────────────
    if (state.phase === 'results') {
        const phases = config.rounds.map(r => ({
            icon: '🏰',
            title: r.title,
            score: roundPoints(r.id),
            max: config.pointsPerRound,
        }));

        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phases}
                takeaways={config.takeaways}
                onComplete={() => {
                    clearSave();
                    onComplete(true);
                }}
            />
        );
    }

    // ── RONDE ────────────────────────────────────────────────────────────────
    if (!round) return null;

    const visibleHints = round.hints.slice(0, hintsUsed);
    const canHint = hintsUsed < round.hints.length && !isCleared;
    // De laatste ronde (credential stuffing) is de kernles en is nooit overslaanbaar;
    // eerdere rondes mogen na herhaald vastlopen wél worden overgeslagen als vangnet.
    const isFinalRound = state.currentRound === config.rounds.length - 1;
    const canSkip = attempts >= config.skipAfterAttempts && !isCleared && !isFinalRound;
    const pointsForRound = Math.max(0, config.pointsPerRound - hintsUsed * config.hintCost);

    return (
        <div data-qa="password-fortress" className="min-h-screen bg-duck-ink flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Terminal chrome */}
                <div className="bg-duck-ink rounded-t-2xl border border-duck-gray/30 px-4 py-2.5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <span className="ml-2 font-mono text-xs text-duck-gray flex-1">
                        password-fortress — {round.id}
                    </span>
                    <button
                        onClick={onBack}
                        className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-duck-gray transition-colors hover:bg-duck-gray/10 hover:text-duck-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-gray focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                        aria-label="Terug"
                    >
                        <ArrowLeft size={14} />
                    </button>
                </div>

                <div className="bg-duck-ink rounded-b-2xl border border-t-0 border-duck-gray/30 p-5">
                    {/* Voortgang */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] text-duck-gray">
                            RONDE {state.currentRound + 1}/{config.rounds.length}
                        </span>
                        <div className="flex gap-1">
                            {config.rounds.map((r, i) => (
                                <div
                                    key={r.id}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        state.cleared.includes(r.id)
                                            ? 'bg-duck-acid w-6'
                                            : i === state.currentRound
                                              ? 'bg-duck-acid w-6'
                                              : 'bg-duck-gray/30 w-4'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="font-mono text-[11px] text-duck-bg font-bold">
                            +{pointsForRound} pts
                        </div>
                    </div>

                    {/* Ronde-briefing */}
                    <div className="mb-4">
                        <div className="font-mono text-[10px] text-duck-gray/70 mb-1 uppercase tracking-widest">
                            [ AANVALSGOLF {state.currentRound + 1} ]
                        </div>
                        <h2
                            className="text-lg font-black text-white mb-2"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            {round.title}
                        </h2>
                        <p className="font-mono text-xs text-duck-gray leading-relaxed">
                            {round.story}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-duck-acid/40 bg-duck-ink px-3 py-1">
                            <span className="font-mono text-[10px] text-duck-acid font-bold uppercase tracking-widest">
                                Doel: houd {round.targetLabel} stand
                            </span>
                        </div>
                    </div>

                    {/* Fort-meter */}
                    <div className="bg-duck-ink rounded-xl border border-duck-gray/30 p-4 mb-4">
                        <FortressMeter report={report} revealed={revealed} />
                    </div>

                    {/* Aanvallen */}
                    <div className="space-y-2 mb-4">
                        <div className="font-mono text-[10px] text-duck-gray uppercase tracking-widest">
                            Actieve aanvallen
                        </div>
                        {round.attacks.map((attackId, i) => {
                            const rowState = !report
                                ? 'idle'
                                : i < revealCount
                                  ? 'done'
                                  : i === revealCount
                                    ? 'running'
                                    : 'idle';
                            return (
                                <AttackRow
                                    key={attackId}
                                    attackId={attackId}
                                    result={report?.results[i] ?? null}
                                    state={rowState as 'idle' | 'running' | 'done'}
                                />
                            );
                        })}
                    </div>

                    {/* Uitslag — gehaald (werkt ook na herladen, zonder lokaal rapport) */}
                    {isCleared && !revealing && (
                        <div className="mb-4 rounded-xl border border-duck-acid/60 bg-duck-ink/20 p-4">
                            <div className="font-mono text-xs font-bold text-duck-acid tracking-widest uppercase text-center mb-2">
                                &gt;&gt; FORT HOUDT STAND &lt;&lt;
                            </div>
                            <p className="font-mono text-[11px] text-duck-gray leading-relaxed">
                                {round.clearedLesson}
                            </p>
                        </div>
                    )}

                    {/* Uitslag — gevallen */}
                    {revealed && report && !report.holds && (
                        <div className="mb-4 rounded-xl border border-duck-error/60 bg-duck-error/20 p-4">
                            <div className="font-mono text-xs font-bold text-duck-error tracking-widest uppercase text-center mb-2">
                                &gt;&gt; FORT GEVALLEN &lt;&lt;
                            </div>
                            <p className="font-mono text-[11px] text-duck-gray leading-relaxed">
                                Zwakste schakel:{' '}
                                {(() => {
                                    const weakest = report.results.reduce((min, r) =>
                                        r.crackSeconds < min.crackSeconds ? r : min
                                    );
                                    return `${ATTACK_META[weakest.attackId].name} — ${weakest.timeLabel}. `;
                                })()}
                                Pas je wachtwoord aan en test opnieuw.
                            </p>
                        </div>
                    )}

                    {/* Invoer */}
                    {!isCleared && (
                        <div className="mb-4">
                            <label
                                htmlFor="fortress-input"
                                className="font-mono text-[10px] text-duck-gray uppercase tracking-widest block mb-1.5"
                            >
                                Jouw oefenwachtwoord
                            </label>
                            <div className="flex items-center bg-duck-ink border border-duck-gray/30 focus-within:border-duck-acid/60 rounded-xl px-3 py-2.5 gap-2 transition-colors">
                                <span className="font-mono text-xs text-duck-gray shrink-0">$</span>
                                <input
                                    data-qa="fortress-input"
                                    ref={inputRef}
                                    id="fortress-input"
                                    type={showPw ? 'text' : 'password'}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={revealing}
                                    maxLength={64}
                                    autoComplete="off"
                                    placeholder="verzin een oefenwachtwoord..."
                                    className="min-h-[44px] flex-1 bg-transparent font-mono text-xs text-duck-bg placeholder:text-duck-gray/50 outline-none"
                                />
                                <button
                                    data-qa="fortress-reveal"
                                    onClick={() => setShowPw(v => !v)}
                                    className="flex min-h-[44px] min-w-[44px] items-center justify-center text-duck-gray hover:text-duck-bg transition-colors"
                                    aria-label={showPw ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                                >
                                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            <p className="font-mono text-[10px] text-duck-gray/70 mt-1.5">
                                Gebruik nóóit je echte wachtwoord — verzin er een. Alles blijft in je browser.
                            </p>
                            <button
                                data-qa="fortress-test"
                                onClick={handleTest}
                                disabled={!input.trim() || revealing}
                                className="min-h-[44px] w-full mt-2 py-2.5 bg-duck-acid hover:bg-duck-acid hover:brightness-95 disabled:bg-duck-gray/30 disabled:text-duck-gray/60 text-duck-ink disabled:cursor-not-allowed font-mono font-bold text-xs rounded-xl transition-all duration-150"
                            >
                                {revealing ? 'AANVAL LOOPT…' : 'TEST MIJN FORT'}
                            </button>
                        </div>
                    )}

                    {/* Ronde gehaald → volgende */}
                    {isCleared && !revealing && (
                        <button
                            data-qa="fortress-next"
                            onClick={goNextRound}
                            className="min-h-[44px] w-full py-2.5 bg-duck-acid hover:bg-duck-acid hover:brightness-95 font-mono font-bold text-xs text-duck-ink rounded-xl transition-all duration-150 mb-4"
                        >
                            {state.currentRound < config.rounds.length - 1 ? 'VOLGENDE RONDE →' : 'BEKIJK RESULTAAT →'}
                        </button>
                    )}

                    {/* Hints */}
                    {visibleHints.length > 0 && (
                        <div className="bg-duck-ink rounded-xl border border-duck-gray/30 p-3 mb-4 space-y-1.5">
                            <div className="font-mono text-[10px] text-duck-gray uppercase tracking-widest">
                                Hints
                            </div>
                            {visibleHints.map((hint, i) => (
                                <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-duck-gray">
                                    <span className="text-duck-acid shrink-0 mt-0.5">!</span>
                                    <span>{hint}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hint + pogingen + overslaan */}
                    {!isCleared && (
                        <div className="flex items-center justify-between">
                            <div className="font-mono text-[10px] text-duck-gray">
                                {attempts > 0 && <span>{attempts} {attempts === 1 ? 'mislukte test' : 'mislukte testen'}</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                {canHint && (
                                    <button
                                        data-qa="fortress-hint"
                                        onClick={handleHint}
                                        className="flex min-h-[44px] items-center gap-1 px-2 font-mono text-[10px] text-duck-gray/70 hover:text-duck-bg transition-colors"
                                    >
                                        <Lightbulb size={10} />
                                        hint (-{config.hintCost} pts)
                                    </button>
                                )}
                                {canSkip && (
                                    <button
                                        data-qa="fortress-skip"
                                        onClick={handleSkip}
                                        className="min-h-[44px] px-2 font-mono text-[10px] text-duck-gray hover:text-duck-bg transition-colors"
                                    >
                                        overslaan →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Score footer */}
                    <div className="mt-5 pt-4 border-t border-duck-gray/30 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-duck-gray">TOTAAL SCORE</span>
                        <span className="font-mono text-xs font-bold text-duck-bg">{totalScore} pts</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
