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
    /**
     * Uitkomst per al beantwoorde vraag van een rapid-fire-ronde, in volgorde.
     * Hiermee hervat een herladen ronde waar de leerling gebleven was. De
     * rondescore zelf komt pas in `lockedRoundScores` als álle vragen gehad zijn:
     * een tussenstand vastleggen zette de ronde op 0 en sloot de rest af.
     */
    rapidFireProgress: Record<string, boolean[]>;
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

/**
 * Toetst herstelde voortgang tegen de huidige config, per fase. `roundScores`
 * groeit gelijk op met `currentRound` (advanceRound doet beide in één update),
 * dus een langere lijst betekent beschadigde opslag. De vastgelegde scores staan
 * in `lockedRoundScores` en tellen niet mee in die telling: die worden vastgelegd
 * vóórdat `currentRound` opschuift, dus een net ingediende ronde mag daar niet op
 * afgekeurd worden.
 *
 * De fasecheck is bewust strikt: bij `phase: 'round'` moet `currentRound` een
 * bestaande ronde aanwijzen. Stond daar de lengte van de rondelijst, dan bestond
 * `config.rounds[currentRound]` niet en kwam de leerling op een leeg scherm zonder
 * uitweg terecht.
 *
 * De bovengrenzen op scores vangen corrupte of knullig bewerkte opslag af. Ze
 * sluiten manipulatie niet uit — daarvoor is server-side registratie nodig.
 */
function isStateValidForConfig(s: ReviewArenaState, config: ReviewArenaConfig): boolean {
    if (!s || typeof s !== 'object') return false;
    if (!['intro', 'round', 'complete'].includes(s.phase)) return false;
    if (!Number.isInteger(s.currentRound) || s.currentRound < 0) return false;
    if (s.currentRound > config.rounds.length) return false;

    if (!Array.isArray(s.roundScores)) return false;
    if (s.roundScores.length > config.rounds.length) return false;
    const scoresValid = s.roundScores.every((n, i) => {
        const max = config.rounds[i]?.maxScore;
        return (
            typeof n === 'number' &&
            Number.isFinite(n) &&
            n >= 0 &&
            typeof max === 'number' &&
            n <= max
        );
    });
    if (!scoresValid) return false;

    const locked = s.lockedRoundScores ?? {};
    if (typeof locked !== 'object') return false;
    const lockedValid = Object.entries(locked).every(([id, value]) => {
        const round = config.rounds.find((r) => r.id === id);
        if (!round) return false;
        return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= round.maxScore;
    });
    if (!lockedValid) return false;

    const rapidProgress = s.rapidFireProgress ?? {};
    if (typeof rapidProgress !== 'object' || rapidProgress === null) return false;
    const rapidValid = Object.entries(rapidProgress).every(([id, values]) => {
        const round = config.rounds.find((r) => r.id === id);
        if (!round || round.type !== 'rapid-fire') return false;
        return (
            Array.isArray(values) &&
            values.length <= round.questions.length &&
            values.every((v) => typeof v === 'boolean')
        );
    });
    if (!rapidValid) return false;

    const followUps = s.followUpResults ?? {};
    if (typeof followUps !== 'object') return false;
    if (Object.keys(followUps).some((id) => !config.rounds.some((r) => r.id === id))) return false;

    if (s.phase === 'intro') return s.currentRound === 0 && s.roundScores.length === 0;
    if (s.phase === 'round') {
        return s.currentRound < config.rounds.length && s.roundScores.length <= s.currentRound;
    }
    // complete: alle rondes gespeeld en een samenhangende scorelijst.
    return (
        s.currentRound === config.rounds.length && s.roundScores.length === config.rounds.length
    );
}

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
        rapidFireProgress: {},
        followUpResults: {},
        configMissionId: config.missionId,
    };

    const { state, setState, clearSave } = useMissionAutoSave<ReviewArenaState>(
        missionId,
        initialState,
        {
            validate: (s) => isStateValidForConfig(s, config),
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
    // React-state guards are not synchronous: a double click can invoke the same
    // callback twice before showFollowUp/currentRound has re-rendered. These refs
    // close that small window so one learner action can advance at most one round.
    const completedRoundTransitions = useRef<Set<string>>(new Set());
    const completedFollowUpTransitions = useRef<Set<string>>(new Set());

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

    /**
     * Bewaart de losse uitkomsten van een rapid-fire-ronde. Alleen aangroeien:
     * een kortere reeks zou een al gegeven antwoord kunnen wissen.
     */
    const handleRapidProgress = useCallback(
        (roundId: string, outcomes: boolean[]) => {
            setState((s) => {
                const prev = s.rapidFireProgress[roundId] ?? [];
                if (outcomes.length <= prev.length) return s;
                return {
                    ...s,
                    rapidFireProgress: { ...s.rapidFireProgress, [roundId]: outcomes },
                };
            });
        },
        [setState]
    );

    const withFollowUpBonus = useCallback(
        (base: number, correct: boolean, round: ReviewRound) => {
            const bonus = correct ? (round.followUp?.bonusPoints ?? 0) : 0;
            return Math.min(base + bonus, round.maxScore);
        },
        []
    );

    /**
     * Legt het eerste antwoord op de verdiepingsvraag vast op het moment van
     * kiezen — dus vóór 'Doorgaan' en vóór de uitleg met het juiste antwoord in
     * beeld komt. Zonder dit kon een leerling fout kiezen, het antwoord lezen,
     * herladen en de vraag alsnog goed beantwoorden voor de bonus.
     */
    const handleFollowUpAnswer = useCallback(
        (correct: boolean) => {
            const round = config.rounds[state.currentRound];
            if (!round) return;
            setState((s) =>
                s.followUpResults[round.id]?.answered
                    ? s
                    : {
                          ...s,
                          followUpResults: {
                              ...s.followUpResults,
                              [round.id]: { answered: true, correct },
                          },
                      }
            );
        },
        [config.rounds, setState, state.currentRound]
    );

    const handleRoundComplete = useCallback(
        (score: number) => {
            const round = config.rounds[state.currentRound];
            if (!round) return;
            if (showFollowUp || completedRoundTransitions.current.has(round.id)) return;
            completedRoundTransitions.current.add(round.id);
            // De vastgelegde score wint van wat het subcomponent bij het doorklikken
            // meegeeft; die twee zijn gelijk bij normaal spelen.
            const locked = state.lockedRoundScores[round.id];
            const finalScore = locked ?? score;

            if (!round.followUp || finalScore <= round.maxScore * 0.5) {
                advanceRound(finalScore);
                return;
            }

            // Al beantwoord in een eerdere sessie: niet opnieuw tonen, maar het
            // vastgelegde resultaat verrekenen.
            const prior = state.followUpResults[round.id];
            if (prior?.answered) {
                advanceRound(withFollowUpBonus(finalScore, prior.correct, round));
                return;
            }

            setPendingScore(finalScore);
            setShowFollowUp(true);
        },
        [
            advanceRound,
            config.rounds,
            showFollowUp,
            state.currentRound,
            state.followUpResults,
            state.lockedRoundScores,
            withFollowUpBonus,
        ]
    );

    const handleFollowUpComplete = useCallback(
        (correct: boolean) => {
            const round = config.rounds[state.currentRound];
            if (!round) return;
            if (!showFollowUp || completedFollowUpTransitions.current.has(round.id)) return;
            completedFollowUpTransitions.current.add(round.id);
            // Het vastgelegde antwoord wint: 'Doorgaan' mag geen tweede kans zijn.
            const settled = state.followUpResults[round.id]?.correct ?? correct;
            const finalScore = withFollowUpBonus(pendingScore ?? 0, settled, round);

            setState((s) => ({
                ...s,
                followUpResults: {
                    ...s.followUpResults,
                    [round.id]: { answered: true, correct: settled },
                },
            }));

            setShowFollowUp(false);
            setPendingScore(null);
            advanceRound(finalScore);
        },
        [
            advanceRound,
            config.rounds,
            pendingScore,
            setState,
            showFollowUp,
            state.currentRound,
            state.followUpResults,
            withFollowUpBonus,
        ]
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

    // Vangnet: wijst de herstelde index buiten de huidige rondelijst, toon een
    // herstart in plaats van een leeg scherm zonder uitweg.
    if (!round) {
        return (
            <div
                data-qa="review-arena-recovery"
                className="min-h-screen bg-duck-bg flex items-center justify-center p-4"
            >
                <div className="text-center max-w-sm">
                    <div className="text-4xl mb-4">🔄</div>
                    <p
                        className="text-sm text-duck-ink/75 mb-4 leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Deze missie is bijgewerkt sinds je laatste bezoek, dus je oude voortgang past
                        er niet meer op. Je begint opnieuw.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button
                            data-qa="review-arena-restart"
                            onClick={() => {
                                clearSave();
                                submittedThisSession.current.clear();
                                setState(initialState);
                            }}
                            className="min-h-[44px] px-4 py-2.5 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Opnieuw beginnen
                        </button>
                        <button
                            onClick={onBack}
                            className="min-h-[44px] px-4 py-2.5 border-2 border-duck-gray text-duck-ink rounded-xl text-sm font-bold"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Terug
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        // Terwijl de verdiepingsvraag in beeld staat mag de ronde er niet
                        // nog eens doorheen geklikt worden.
                        <div className={showFollowUp ? 'pointer-events-none opacity-50 transition-opacity duration-200' : ''}>
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
                                initialResults={state.rapidFireProgress[round.id]}
                                onProgress={(outcomes) => handleRapidProgress(round.id, outcomes)}
                                onSubmit={handleRoundSubmit}
                                onComplete={(score) => handleRoundComplete(score)}
                            />
                        )}
                        </div>
                        )}

                        {showFollowUp && round.followUp && (
                            <FollowUpCard
                                followUp={round.followUp}
                                onAnswer={handleFollowUpAnswer}
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
