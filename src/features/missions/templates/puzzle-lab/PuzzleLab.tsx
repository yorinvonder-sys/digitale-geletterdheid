import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Terminal, Eye, EyeOff, ChevronRight, CheckCircle2, KeyRound, Target, Zap } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { CompletionScreen } from '../shared/CompletionScreen';
import { MissionGoalBanner } from '../shared/MissionGoalBanner';
import { getMissionGoal } from '@/config/missionGoals';
import type { MissionExperienceDesign, TemplateMissionProps } from '../shared/types';
import { PUZZLE_LAB_CONFIGS } from './puzzleLabRegistry';
import type { PuzzleLabConfig } from './puzzleLabTypes';
export type { Puzzle, PuzzleLabConfig } from './puzzleLabTypes';

// === State ===

interface PuzzleLabState {
    phase: 'intro' | 'puzzle' | 'results';
    currentPuzzle: number;
    attempts: Record<string, number>;
    hintsUsed: Record<string, number>;
    solved: string[];
    answers: Record<string, string>;
    extraCluesRevealed: Record<string, boolean>;
}

const makeInitialState = (): PuzzleLabState => ({
    phase: 'intro',
    currentPuzzle: 0,
    attempts: {},
    hintsUsed: {},
    solved: [],
    answers: {},
    extraCluesRevealed: {},
});

// === Sub-components ===

const BlinkingCursor: React.FC = () => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setVisible(v => !v), 530);
        return () => clearInterval(t);
    }, []);
    return (
        <span
            className="inline-block w-2 h-4 bg-lab-sage ml-0.5 align-middle"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.05s' }}
        />
    );
};

type FeedbackType = 'granted' | 'denied' | null;

interface FeedbackBannerProps {
    type: FeedbackType;
    message?: string;
}

interface PuzzleClueRoute {
    id: string;
    title: string;
    description: string;
    tag: string;
    feedback: string;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message }) => {
    if (!type) return null;
    const isGranted = type === 'granted';
    return (
        <div
            data-qa="puzzle-feedback"
            className={`rounded-lg border px-3 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-widest animate-pulse ${
                isGranted
                    ? 'bg-lab-sage/40 border-lab-coral/60 text-lab-sage'
                    : 'bg-lab-coral/40 border-lab-coral/60 text-lab-coral'
            }`}
        >
            {isGranted ? '>> ACCESS GRANTED <<' : '>> ACCESS DENIED <<'}
            {message && (
                <div className="mt-1 text-[10px] font-normal normal-case tracking-normal opacity-80">
                    {message}
                </div>
            )}
        </div>
    );
};

function getPuzzleTypeLabel(puzzle: { type: PuzzleLabConfig['puzzles'][number]['type'] }): string {
    switch (puzzle.type) {
        case 'multiple-choice':
            return 'Keuze kraken';
        case 'code-crack':
            return 'Code kraken';
        case 'text-input':
            return 'Antwoord invoeren';
        default:
            return 'Puzzel oplossen';
    }
}

function buildPuzzleClueRoutes(puzzles: PuzzleLabConfig['puzzles']): PuzzleClueRoute[] {
    return puzzles.slice(0, 3).map((puzzle, index) => ({
        id: puzzle.id,
        title: puzzle.title,
        description: getPuzzleAction(puzzle),
        tag: `${index + 1} · ${getPuzzleTypeLabel(puzzle)}`,
        feedback: index === 0
            ? 'Goed spoor: je begint met het eerste bewijsstuk en bouwt daarna verder.'
            : 'Slimme route: je kiest een puzzeltype en weet meteen waar je bewijs zit.',
    }));
}

function getPuzzleAction(puzzle: PuzzleLabConfig['puzzles'][number], experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.primaryInteraction === 'solve-puzzle') return 'Los de puzzel op met aanwijzingen';
    if (experienceDesign?.primaryInteraction === 'pin-evidence') return 'Pin het juiste bewijs uit de hints';

    switch (puzzle.type) {
        case 'multiple-choice':
            return 'Kies de beste verklaring en check de feedback';
        case 'code-crack':
            return 'Ontcijfer de code voordat hints punten kosten';
        case 'text-input':
            return 'Typ het bewijsantwoord in de terminal';
        default:
            return 'Gebruik aanwijzingen om het slot te openen';
    }
}

function getPuzzleEvidence(puzzle: PuzzleLabConfig['puzzles'][number], experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.evidenceMoment) return experienceDesign.evidenceMoment;
    return puzzle.type === 'multiple-choice'
        ? 'Je bewijs is je gekozen verklaring plus de feedback.'
        : 'Je bewijs is het antwoord dat toegang geeft tot de volgende puzzel.';
}

function getPuzzleFeedback(puzzle: PuzzleLabConfig['puzzles'][number], experienceDesign?: MissionExperienceDesign): string {
    if (experienceDesign?.feedbackMoment) return experienceDesign.feedbackMoment;
    return puzzle.hintCost > 0
        ? `Hints helpen, maar kosten ${puzzle.hintCost} punt(en).`
        : 'Feedback verschijnt direct na je poging.';
}

interface PuzzleBriefProps {
    puzzle: PuzzleLabConfig['puzzles'][number];
    experienceDesign?: MissionExperienceDesign;
}

const PuzzleBrief: React.FC<PuzzleBriefProps> = ({ puzzle, experienceDesign }) => (
    <section
        className="mb-3 grid shrink-0 gap-2 rounded-xl border border-[#E7D8BD]/30 bg-[#08283B]/35 p-2 sm:grid-cols-3"
        data-qa="puzzle-brief"
    >
        <div className="rounded-lg bg-[#0B453F] p-2">
            <div className="mb-1 flex items-center gap-1.5 text-lab-line">
                <Zap size={12} />
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Actie</p>
            </div>
            <p className="font-mono text-[10px] leading-snug text-[#E7D8BD]">
                {getPuzzleAction(puzzle, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-[#0B453F] p-2">
            <div className="mb-1 flex items-center gap-1.5 text-lab-line">
                <Target size={12} />
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Bewijs</p>
            </div>
            <p className="font-mono text-[10px] leading-snug text-[#E7D8BD]">
                {getPuzzleEvidence(puzzle, experienceDesign)}
            </p>
        </div>
        <div className="rounded-lg bg-[#0B453F] p-2">
            <div className="mb-1 flex items-center gap-1.5 text-lab-line">
                <KeyRound size={12} />
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Feedback</p>
            </div>
            <p className="font-mono text-[10px] leading-snug text-[#E7D8BD]">
                {getPuzzleFeedback(puzzle, experienceDesign)}
            </p>
        </div>
    </section>
);

interface PuzzleLabIntroProps {
    config: PuzzleLabConfig;
    missionGoal?: ReturnType<typeof getMissionGoal>;
    selectedRouteId: string | null;
    onSelectRoute: (routeId: string) => void;
    onStart: () => void;
    onBack: () => void;
}

const PuzzleLabIntro: React.FC<PuzzleLabIntroProps> = ({
    config,
    missionGoal,
    selectedRouteId,
    onSelectRoute,
    onStart,
    onBack,
}) => {
    const routes = buildPuzzleClueRoutes(config.puzzles);
    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    const threshold = missionGoal?.criteria.threshold;
    const thresholdLabel = typeof threshold === 'number'
        ? `${threshold <= 1 ? Math.round(config.maxScore * threshold) : threshold}/${config.maxScore}`
        : `${config.puzzles.length} puzzels`;

    return (
        <div
            className="min-h-dvh overflow-y-auto bg-[#08283B] px-3 py-4 sm:px-4 sm:py-6"
            data-qa="puzzle-clue-sprint"
        >
            <div className="mx-auto grid w-full max-w-4xl gap-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:grid-cols-[1fr_0.84fr]">
                <section className="rounded-2xl border border-[#E7D8BD]/30 bg-[#0B453F] p-4 shadow-2xl shadow-black/15 sm:p-5">
                    <div className="mb-4 flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#08283B] text-2xl text-white">
                            <span aria-hidden="true">{config.introEmoji}</span>
                        </div>
                        <div>
                            <p className="font-mono text-[11px] font-black uppercase tracking-widest text-lab-line">
                                Clue Sprint
                            </p>
                            <h1
                                className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl"
                                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                            >
                                {config.introTitle}
                            </h1>
                            <p className="mt-2 font-mono text-xs leading-relaxed text-[#E7D8BD]">
                                {config.experienceDesign?.firstTenSeconds ?? config.introDescription}
                            </p>
                        </div>
                    </div>

                    {missionGoal && <MissionGoalBanner goal={missionGoal} compact className="mb-4" />}

                    <div className="mb-3 flex items-center gap-2 text-[#E7D8BD]">
                        <KeyRound size={15} className="text-lab-line" />
                        <h2 className="font-mono text-xs font-black uppercase tracking-widest">
                            Kies je eerste spoor
                        </h2>
                    </div>

                    <div className="grid gap-2" role="group" aria-label="Kies je eerste puzzelspoor">
                        {routes.map((route) => {
                            const isSelected = selectedRouteId === route.id;
                            return (
                                <button
                                    key={route.id}
                                    type="button"
                                    onClick={() => onSelectRoute(route.id)}
                                    data-qa="puzzle-clue-route"
                                    aria-pressed={isSelected}
                                    className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-line/70 ${
                                        isSelected
                                            ? 'border-lab-line bg-lab-line/15 shadow-sm'
                                            : 'border-[#E7D8BD]/30 bg-[#08283B]/35 hover:border-lab-line/60'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-lab-gold">
                                                {route.tag}
                                            </p>
                                            <h3 className="mt-1 text-sm font-black leading-tight text-white">
                                                {route.title}
                                            </h3>
                                            <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#E7D8BD]">
                                                {route.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="mt-0.5 shrink-0 text-lab-sage" size={18} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className={`mt-3 rounded-xl border p-3 font-mono text-[11px] leading-relaxed ${
                            selectedRoute
                                ? 'border-lab-sage/40 bg-lab-sage/15 text-[#E7D8BD]'
                                : 'border-[#E7D8BD]/30 bg-[#08283B]/35 text-[#E7D8BD]'
                        }`}
                        data-qa="puzzle-clue-feedback"
                        aria-live="polite"
                    >
                        {selectedRoute
                            ? selectedRoute.feedback
                            : 'Maak eerst één spoor actief. Daarna open je direct het eerste puzzelbewijs.'}
                    </div>

                    <button
                        type="button"
                        onClick={onStart}
                        disabled={!selectedRoute}
                        data-qa="puzzle-clue-start"
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7D8BD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B453F] ${
                            selectedRoute
                                ? 'bg-lab-sage text-[#08283B] hover:bg-lab-coral hover:text-white'
                                : 'cursor-not-allowed bg-[#E7D8BD]/20 text-[#E7D8BD]/55'
                        }`}
                    >
                        $ START_CLUE_SPRINT
                        <ChevronRight size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-3 flex w-full items-center justify-center gap-1 py-2 font-mono text-xs text-[#E7D8BD] transition-colors hover:text-[#FCF6EA]"
                    >
                        <ArrowLeft size={12} /> back
                    </button>
                </section>

                <aside className="grid gap-3">
                    <section className="rounded-2xl border border-[#E7D8BD]/30 bg-[#0B453F] p-3" data-qa="puzzle-clue-queue">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-[#E7D8BD]">
                                Puzzelrij
                            </h2>
                            <span className="rounded-lg bg-[#08283B] px-2 py-1 font-mono text-[10px] font-black text-lab-gold">
                                max {config.maxScore} pts
                            </span>
                        </div>
                        <div className="grid gap-2">
                            {config.puzzles.map((puzzle, index) => (
                                <div key={puzzle.id} className="rounded-xl border border-[#E7D8BD]/20 bg-[#08283B]/35 p-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-lab-line">
                                                {index + 1} · {getPuzzleTypeLabel(puzzle)}
                                            </p>
                                            <p className="truncate text-xs font-bold text-white">
                                                {puzzle.title}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-[#E7D8BD]/10 px-2 py-1 font-mono text-[10px] text-[#E7D8BD]">
                                            {puzzle.points}p
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#E7D8BD]/30 bg-[#FCF6EA] p-3 text-[#08283B]" data-qa="puzzle-clue-safe-panel">
                        <div className="mb-2 flex items-center gap-2">
                            <Target size={15} className="text-[#D97848]" />
                            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D97848]">
                                Bewijspoort
                            </p>
                        </div>
                        <p className="text-sm font-black">
                            Doel: {thresholdLabel}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#445865]">
                            {config.experienceDesign?.evidenceMoment ?? missionGoal?.evidence ?? 'Je bewijs zit in opgeloste puzzels, hints en feedback.'}
                        </p>
                        <div className="mt-3 rounded-xl border border-[#D3C5AB] bg-white p-2 font-mono text-[10px] leading-relaxed text-[#445865]">
                            Hints kosten punten, maar houden de puzzel eerlijk. Na meerdere pogingen kun je veilig verder zonder vast te lopen.
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

// === Main component ===

export const PuzzleLab: React.FC<TemplateMissionProps> = ({
    missionId,
    onBack,
    onComplete,
}) => {
    const config = PUZZLE_LAB_CONFIGS[missionId];

    const { state, setState, clearSave } = useMissionAutoSave<PuzzleLabState>(
        config?.missionId ?? missionId,
        makeInitialState()
    );

    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<FeedbackType>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [shake, setShake] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const [selectedPuzzleRoute, setSelectedPuzzleRoute] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSelectedPuzzleRoute(null);
    }, [config?.missionId]);

    // Config not found — show fallback
    if (!config) {
        return (
            <div className="min-h-screen bg-[#08283B] flex items-center justify-center p-4">
                <div className="font-mono text-xs text-lab-coral text-center">
                    <div className="mb-2">ERROR: config not found for &quot;{missionId}&quot;</div>
                    <button onClick={onBack} className="text-[#E7D8BD] hover:text-[#FCF6EA]">← back</button>
                </div>
            </div>
        );
    }

    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);

    const puzzle = config.puzzles[state.currentPuzzle];
    const puzzleId = puzzle?.id ?? '';

    const attempts = state.attempts[puzzleId] ?? 0;
    const hintsUsed = state.hintsUsed[puzzleId] ?? 0;
    const isSolved = state.solved.includes(puzzleId);
    const extraRevealed =
        state.extraCluesRevealed[puzzleId] ||
        attempts >= puzzle?.revealExtraAfterAttempts;

    // Visible clues = base clues + extra if unlocked, sliced to hints used + base
    const visibleClues = puzzle
        ? [
              ...puzzle.clues,
              ...(extraRevealed && puzzle.extraClues ? puzzle.extraClues : []),
          ]
        : [];

    const totalScore = config.puzzles.reduce((acc, p) => {
        if (!state.solved.includes(p.id)) return acc;
        const hCost = (state.hintsUsed[p.id] ?? 0) * p.hintCost;
        return acc + Math.max(0, p.points - hCost);
    }, 0);
    const configuredThreshold = missionGoal?.criteria.threshold;
    const completionThreshold = typeof configuredThreshold === 'number'
        ? configuredThreshold <= 1 ? Math.round(config.maxScore * configuredThreshold) : configuredThreshold
        : 0;
    const solvedCount = state.solved.length;
    const requiredSolvedCount = missionGoal?.criteria.type === 'rounds-complete'
        ? missionGoal.criteria.min ?? config.puzzles.length
        : 0;
    const isMissionComplete = missionGoal?.criteria.type === 'rounds-complete'
        ? solvedCount >= requiredSolvedCount
        : typeof configuredThreshold === 'number'
          ? totalScore >= completionThreshold
          : solvedCount >= config.puzzles.length;
    const completionStatus = missionGoal ? {
        isComplete: isMissionComplete,
        title: isMissionComplete ? 'Bewijs compleet' : 'Nog niet voltooid',
        description: isMissionComplete
            ? missionGoal.criteria.type === 'rounds-complete'
                ? `Je puzzelbewijs is compleet: ${solvedCount}/${config.puzzles.length} puzzels zijn opgelost.`
                : typeof configuredThreshold === 'number'
                ? `Je puzzelbewijs is compleet en je score is minimaal ${completionThreshold}/${config.maxScore}.`
                : missionGoal.criteria.description || 'Je puzzelbewijs is compleet.'
            : missionGoal.criteria.type === 'rounds-complete'
              ? `Voor voltooiing moet je ${requiredSolvedCount}/${config.puzzles.length} puzzels oplossen.`
              : typeof configuredThreshold === 'number'
              ? `Voor voltooiing moet je minimaal ${completionThreshold}/${config.maxScore} punten halen. Gebruik hints of probeer gemiste puzzels opnieuw in overleg met je docent.`
              : missionGoal.criteria.description || 'Werk de gevraagde puzzelstappen af om je bewijs compleet te maken.',
    } : undefined;

    const clearFeedback = useCallback(() => {
        setTimeout(() => setFeedback(null), 2200);
    }, []);

    const checkAnswer = useCallback(
        (raw: string) => {
            if (!puzzle || isSolved || celebrating) return;

            const normalize = (s: string) =>
                puzzle.caseSensitive ? s.trim() : s.trim().toLowerCase();

            const answers = Array.isArray(puzzle.answer)
                ? puzzle.answer
                : [puzzle.answer];

            const correct = puzzle.validator
                ? puzzle.validator(raw)
                : answers.length > 0
                  ? answers.some(a => normalize(raw) === normalize(a))
                  : false;

            if (correct) {
                const storedAnswer = puzzle.sensitiveAnswer
                    ? '[sensitive practice answer not stored]'
                    : raw;
                setFeedback('granted');
                setFeedbackMessage(puzzle.successMessage);
                setCelebrating(true);
                setState(prev => ({
                    ...prev,
                    solved: [...prev.solved, puzzleId],
                    answers: { ...prev.answers, [puzzleId]: storedAnswer },
                }));
                clearFeedback();
                setTimeout(() => {
                    setCelebrating(false);
                    setFeedback(null);
                    setInputValue('');
                    // advance or finish
                    if (state.currentPuzzle < config.puzzles.length - 1) {
                        setState(prev => ({
                            ...prev,
                            currentPuzzle: prev.currentPuzzle + 1,
                        }));
                    } else {
                        setState(prev => ({ ...prev, phase: 'results' }));
                    }
                }, 2000);
            } else {
                const newAttempts = attempts + 1;
                setFeedback('denied');
                setFeedbackMessage(
                    newAttempts >= puzzle.maxAttempts
                        ? 'Max pogingen bereikt. Lees de uitleg en ga door naar de volgende puzzel.'
                        : newAttempts >= 2
                          ? 'Nog niet. Gebruik de extra aanwijzingen of sla deze puzzel over en ga verder.'
                          : 'Nog niet. Lees de aanwijzingen nog eens; na twee pogingen kun je ook overslaan.'
                );
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setState(prev => ({
                    ...prev,
                    attempts: { ...prev.attempts, [puzzleId]: newAttempts },
                    extraCluesRevealed:
                        newAttempts >= puzzle.revealExtraAfterAttempts
                            ? { ...prev.extraCluesRevealed, [puzzleId]: true }
                            : prev.extraCluesRevealed,
                }));
                clearFeedback();
            }
        },
        [puzzle, puzzleId, isSolved, celebrating, attempts, state.currentPuzzle, config.puzzles.length, setState, clearFeedback]
    );

    const handleSubmit = () => {
        if (puzzle?.type === 'multiple-choice') return; // handled inline
        checkAnswer(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    const handleHint = () => {
        if (!puzzle) return;
        setState(prev => ({
            ...prev,
            hintsUsed: {
                ...prev.hintsUsed,
                [puzzleId]: (prev.hintsUsed[puzzleId] ?? 0) + 1,
            },
        }));
    };

    const handleSkip = () => {
        if (state.currentPuzzle < config.puzzles.length - 1) {
            setInputValue('');
            setFeedback(null);
            setState(prev => ({
                ...prev,
                currentPuzzle: prev.currentPuzzle + 1,
            }));
        } else {
            setState(prev => ({ ...prev, phase: 'results' }));
        }
    };

    // Auto-focus input
    useEffect(() => {
        if (state.phase === 'puzzle' && inputRef.current && puzzle?.type !== 'multiple-choice') {
            inputRef.current.focus();
        }
    }, [state.phase, state.currentPuzzle, puzzle?.type]);

    // === INTRO ===
    if (state.phase === 'intro') {
        if (config.experienceDesign) {
            return (
                <PuzzleLabIntro
                    config={config}
                    missionGoal={missionGoal}
                    selectedRouteId={selectedPuzzleRoute}
                    onSelectRoute={setSelectedPuzzleRoute}
                    onStart={() => setState(prev => ({ ...prev, phase: 'puzzle' }))}
                    onBack={onBack}
                />
            );
        }

        return (
            <div className="min-h-screen bg-[#08283B] flex items-center justify-center p-4 pb-24 sm:pb-4">
                <div className="w-full max-w-md">
                    {/* Terminal header bar */}
                    <div className="bg-[#0B453F] rounded-t-2xl border border-[#E7D8BD]/30 px-4 py-2.5 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                        <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                        <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                        <span className="ml-2 font-mono text-xs text-[#E7D8BD]">
                            puzzle-lab — {config.missionId}
                        </span>
                    </div>

                    <div className="bg-[#0B453F] rounded-b-2xl border border-t-0 border-[#E7D8BD]/30 p-6">
                        {/* Boot sequence */}
                        <div className="font-mono text-xs text-lab-line/60 mb-5 space-y-0.5">
                            <div>$ initializing puzzle-lab v2.4...</div>
                            <div>$ loading mission: {config.missionId}</div>
                            <div>$ {config.puzzles.length} puzzles queued</div>
                            <div className="text-lab-sage">$ ready.</div>
                        </div>

                        <div className="text-4xl mb-3 text-center">{config.introEmoji}</div>
                        <h1
                            className="text-xl font-black text-white mb-3 text-center"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            {config.introTitle}
                        </h1>
                        <p className="font-mono text-xs text-[#E7D8BD] leading-relaxed mb-5 text-center">
                            {config.introDescription}
                        </p>

                        {missionGoal && (
                            <MissionGoalBanner goal={missionGoal} className="mb-5" />
                        )}

                        {config.introFeatures && config.introFeatures.length > 0 && (
                            <div className="bg-[#0B453F] rounded-xl border border-[#E7D8BD]/30 p-4 mb-5 space-y-2">
                                {config.introFeatures.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2 font-mono text-xs text-[#E7D8BD]">
                                        <span className="text-lab-line shrink-0">&gt;</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-5 font-mono text-xs text-[#E7D8BD]">
                            <Terminal size={12} className="text-lab-line shrink-0" />
                            <span>{config.puzzles.length} puzzels — max {config.maxScore} punten</span>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, phase: 'puzzle' }))}
                            data-qa="puzzle-start"
                            className="fixed inset-x-4 bottom-4 z-30 py-3 bg-lab-sage hover:bg-lab-coral hover:text-white text-[#08283B] font-mono font-bold text-sm rounded-xl shadow-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 sm:static sm:w-full sm:shadow-none"
                        >
                            $ START_MISSION
                            <ChevronRight size={15} />
                        </button>

                        <button
                            onClick={onBack}
                            className="w-full mt-3 py-2 font-mono text-xs text-[#E7D8BD] hover:text-[#FCF6EA] transition-colors flex items-center justify-center gap-1"
                        >
                            <ArrowLeft size={12} /> back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === RESULTS ===
    if (state.phase === 'results') {
        const phases = config.puzzles.map(p => ({
            icon: '🔐',
            title: p.title,
            score: state.solved.includes(p.id)
                ? Math.max(0, p.points - (state.hintsUsed[p.id] ?? 0) * p.hintCost)
                : 0,
            max: p.points,
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
                onComplete={() => {
                    clearSave();
                    onComplete(isMissionComplete);
                }}
            />
        );
    }

    // === PUZZLE ===
    if (!puzzle) return null;

    const maxAttemptsReached = attempts >= puzzle.maxAttempts;
    const pointsForPuzzle = Math.max(0, puzzle.points - hintsUsed * puzzle.hintCost);

    return (
        <div className="flex min-h-dvh items-center justify-center overflow-hidden bg-[#08283B] p-2 sm:p-4" data-qa="puzzle-lab-active">
            <div className="flex h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col sm:h-[calc(100dvh-2rem)]">
                {/* Terminal chrome */}
                <div className="flex shrink-0 items-center gap-2 rounded-t-2xl border border-[#E7D8BD]/30 bg-[#0B453F] px-3 py-2">
                    <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                    <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                    <div className="w-3 h-3 rounded-full bg-lab-coral/70" />
                    <span className="ml-2 font-mono text-xs text-[#E7D8BD] flex-1">
                        puzzle-lab — {puzzle.id}
                    </span>
                    <button
                        onClick={onBack}
                        className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#E7D8BD] transition-colors hover:bg-[#E7D8BD]/10 hover:text-[#FCF6EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7D8BD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B453F]"
                        aria-label="Terug"
                    >
                        <ArrowLeft size={14} />
                    </button>
                </div>

                <div
                    className={`flex min-h-0 flex-1 flex-col rounded-b-2xl border border-t-0 border-[#E7D8BD]/30 bg-[#0B453F] p-3 transition-transform sm:p-4 ${
                        shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
                    style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
                >
                    {/* Progress bar */}
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                        <span className="font-mono text-[11px] text-[#E7D8BD]">
                            PUZZEL {state.currentPuzzle + 1}/{config.puzzles.length}
                        </span>
                        <div className="flex gap-1">
                            {config.puzzles.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        state.solved.includes(p.id)
                                            ? 'bg-lab-coral w-6'
                                            : i === state.currentPuzzle
                                              ? 'bg-lab-gold w-6'
                                              : 'bg-[#E7D8BD]/30 w-4'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="font-mono text-[11px] text-lab-gold font-bold">
                            +{pointsForPuzzle} pts
                        </div>
                    </div>

                    <PuzzleBrief puzzle={puzzle} experienceDesign={config.experienceDesign} />

                    <div className="grid min-h-0 flex-1 gap-3 overflow-hidden md:grid-cols-[0.95fr_1.05fr]">
                        <div className="min-h-0 rounded-xl border border-[#E7D8BD]/30 bg-[#08283B]/25 p-3">
                            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-lab-line/70">
                                [ {getPuzzleTypeLabel(puzzle)} ]
                            </div>
                            <h2
                                className="mb-2 text-base font-black text-white sm:text-lg"
                                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                            >
                                {puzzle.title}
                            </h2>
                            <p className="max-h-28 overflow-y-auto pr-1 font-mono text-[11px] leading-relaxed text-[#E7D8BD] sm:max-h-36 sm:text-xs">
                                {puzzle.description}
                            </p>

                            <div className="mt-3 max-h-32 overflow-y-auto rounded-xl border border-[#E7D8BD]/30 bg-[#0B453F] p-3">
                                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#E7D8BD]">
                                    AANWIJZINGEN
                                </div>
                                <div className="space-y-1.5">
                                    {visibleClues.slice(0, puzzle.clues.length + hintsUsed).map((clue, i) => (
                                        <div key={i} className="flex items-start gap-2 font-mono text-[11px] leading-snug text-[#E7D8BD]">
                                            <span className="mt-0.5 shrink-0 text-lab-line">&gt;</span>
                                            <span>{clue}</span>
                                        </div>
                                    ))}
                                    {visibleClues.length > puzzle.clues.length + hintsUsed && (
                                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#E7D8BD]">
                                            <EyeOff size={10} />
                                            <span>{visibleClues.length - puzzle.clues.length - hintsUsed} aanwijzing(en) verborgen</span>
                                        </div>
                                    )}
                                    {extraRevealed && puzzle.extraClues && puzzle.extraClues.length > 0 && (
                                        <div className="mt-2 border-t border-[#E7D8BD]/30 pt-2">
                                            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-lab-line/70">
                                                EXTRA AANWIJZINGEN
                                            </div>
                                            {puzzle.extraClues.map((clue, i) => (
                                                <div key={i} className="mb-1 flex items-start gap-2 font-mono text-[11px] leading-snug text-lab-gold/80">
                                                    <span className="mt-0.5 shrink-0 text-lab-line">!</span>
                                                    <span>{clue}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-col">
                            {/* Feedback banner */}
                            {feedback && (
                                <div className="mb-2 shrink-0">
                                    <FeedbackBanner type={feedback} message={feedbackMessage} />
                                </div>
                            )}

                            {/* Input area */}
                            {!isSolved && !maxAttemptsReached && (
                                <>
                                    {puzzle.type === 'multiple-choice' && puzzle.options ? (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {puzzle.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => checkAnswer(opt)}
                                                    disabled={celebrating}
                                                    data-qa={`puzzle-option-${i}`}
                                                    className="flex min-h-[52px] w-full items-start gap-2 rounded-xl border border-[#E7D8BD]/30 bg-[#0B453F] px-3 py-2.5 text-left font-mono text-[11px] leading-snug text-[#E7D8BD] transition-all duration-150 hover:border-lab-coral/40 hover:bg-[#0B453F]"
                                                >
                                                    <span className="w-5 shrink-0 text-[#E7D8BD]">{String.fromCharCode(65 + i)}.</span>
                                                    <span>{opt}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2 rounded-xl border border-[#E7D8BD]/30 bg-[#08283B] px-3 py-2.5 transition-colors focus-within:border-lab-coral/60">
                                                <span className="shrink-0 font-mono text-xs text-lab-line">$</span>
                                                <input
                                                    ref={inputRef}
                                                    type={puzzle.sensitiveAnswer ? 'password' : 'text'}
                                                    value={inputValue}
                                                    onChange={e => setInputValue(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    disabled={celebrating}
                                                    placeholder={puzzle.sensitiveAnswer ? 'fictieve oefen-passphrase...' : 'antwoord...'}
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    autoCapitalize="none"
                                                    spellCheck={false}
                                                    data-qa="puzzle-answer"
                                                    className="flex-1 bg-transparent font-mono text-xs text-lab-sage outline-none placeholder:text-[#E7D8BD]/50"
                                                />
                                                <BlinkingCursor />
                                            </div>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!inputValue.trim() || celebrating}
                                                data-qa="puzzle-submit"
                                                className="mt-2 w-full rounded-xl bg-lab-sage py-2.5 font-mono text-xs font-bold text-[#08283B] transition-all duration-150 hover:bg-lab-sage hover:text-white disabled:cursor-not-allowed disabled:bg-[#E7D8BD]/30 disabled:text-[#E7D8BD]/60"
                                            >
                                                SUBMIT
                                            </button>
                                        </div>
                                    )}

                                    {attempts > 0 && (
                                        <div
                                            data-qa="puzzle-recovery"
                                            className="mt-2 rounded-xl border border-[#E7D8BD]/30 bg-[#08283B]/50 p-2.5 font-mono text-[11px] text-[#E7D8BD]"
                                        >
                                            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-lab-line/80">
                                                Nog nodig
                                            </div>
                                            <p className="leading-snug">
                                                {attempts >= 2
                                                    ? 'Vraag een hint, verbeter je antwoord of ga door.'
                                                    : `Probeer nog ${2 - attempts} keer of gebruik een hint.`}
                                            </p>
                                        </div>
                                    )}

                                    {/* Hint + attempts row */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="font-mono text-[10px] text-[#E7D8BD]">
                                            {attempts > 0 && (
                                                <span className={attempts >= puzzle.maxAttempts - 1 ? 'text-lab-line/70' : ''}>
                                                    {attempts}/{puzzle.maxAttempts} pogingen
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {visibleClues.length > puzzle.clues.length + hintsUsed && (
                                                <button
                                                    onClick={handleHint}
                                                    data-qa="puzzle-hint"
                                                    className="flex min-h-[32px] items-center gap-1 font-mono text-[10px] text-lab-line/70 transition-colors hover:text-lab-gold"
                                                >
                                                    <Eye size={10} />
                                                    hint (-{puzzle.hintCost} pts)
                                                </button>
                                            )}
                                            {attempts >= 2 && (
                                                <button
                                                    onClick={handleSkip}
                                                    data-qa="puzzle-skip"
                                                    className="min-h-[32px] font-mono text-[10px] text-[#E7D8BD] transition-colors hover:text-[#FCF6EA]"
                                                >
                                                    overslaan →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Max attempts reached */}
                            {maxAttemptsReached && !isSolved && (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-lab-coral/30 bg-lab-coral/20 p-3 font-mono text-xs text-lab-coral/80">
                                        Max pogingen bereikt. Je kunt doorgaan naar de volgende puzzel.
                                    </div>
                                    <button
                                        onClick={handleSkip}
                                        data-qa="puzzle-skip"
                                        className="w-full rounded-xl border border-[#E7D8BD]/30 bg-[#0B453F] py-2.5 font-mono text-xs font-bold text-[#E7D8BD] transition-all duration-150 hover:bg-[#0B453F]"
                                    >
                                        VOLGENDE PUZZEL →
                                    </button>
                                </div>
                            )}

                            {/* Solved state */}
                            {isSolved && !celebrating && (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-lab-coral/30 bg-lab-sage/20 p-3 text-center font-mono text-xs text-lab-sage/80">
                                        ✓ opgelost
                                    </div>
                                    <button
                                        onClick={handleSkip}
                                        data-qa="puzzle-next"
                                        className="w-full rounded-xl bg-lab-sage py-2.5 font-mono text-xs font-bold text-[#08283B] transition-all duration-150 hover:bg-lab-sage hover:text-white"
                                    >
                                        VOLGENDE PUZZEL →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Score footer */}
                    <div className="mt-3 flex shrink-0 items-center justify-between border-t border-[#E7D8BD]/30 pt-3">
                        <span className="font-mono text-[10px] text-[#E7D8BD]">TOTAAL SCORE</span>
                        <span className="font-mono text-xs font-bold text-lab-gold">{totalScore} pts</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-6px); }
                    30% { transform: translateX(6px); }
                    45% { transform: translateX(-4px); }
                    60% { transform: translateX(4px); }
                    75% { transform: translateX(-2px); }
                    90% { transform: translateX(2px); }
                }
            `}</style>
        </div>
    );
};
