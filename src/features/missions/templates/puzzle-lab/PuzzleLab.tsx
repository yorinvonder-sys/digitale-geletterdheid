import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { CompletionScreen } from '../shared/CompletionScreen';
import { IntroScreen } from '../shared/IntroScreen';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps } from '../shared/types';
import { PUZZLE_LAB_CONFIGS } from './puzzleLabRegistry';
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
            className="inline-block w-2 h-4 bg-duck-acid ml-0.5 align-middle"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.05s' }}
        />
    );
};

type FeedbackType = 'granted' | 'denied' | null;

interface FeedbackBannerProps {
    type: FeedbackType;
    message?: string;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message }) => {
    if (!type) return null;
    const isGranted = type === 'granted';
    return (
        <div
            className={`font-mono text-xs font-bold px-4 py-2 rounded-lg border text-center tracking-widest uppercase animate-pulse ${
                isGranted
                    ? 'bg-duck-ink/20 border-duck-acid/60 text-duck-acid'
                    : 'bg-duck-error/40 border-duck-error/60 text-duck-error'
            }`}
        >
            {isGranted ? '>> ACCESS GRANTED <<' : '>> ACCESS DENIED <<'}
            {message && (
                <div className="normal-case tracking-normal font-normal mt-1 text-[11px] opacity-80">
                    {message}
                </div>
            )}
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
    const inputRef = useRef<HTMLInputElement>(null);

    // Config not found — show fallback
    if (!config) {
        return (
            <div className="min-h-screen bg-duck-ink flex items-center justify-center p-4">
                <div className="font-mono text-xs text-duck-error text-center">
                    <div className="mb-2">ERROR: config not found for &quot;{missionId}&quot;</div>
                    <button onClick={onBack} className="text-duck-gray hover:text-duck-bg">← back</button>
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
                setFeedback('granted');
                setFeedbackMessage(puzzle.successMessage);
                setCelebrating(true);
                setState(prev => ({
                    ...prev,
                    solved: [...prev.solved, puzzleId],
                    answers: { ...prev.answers, [puzzleId]: raw },
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
                setFeedbackMessage('');
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
                onStart={() => setState(prev => ({ ...prev, phase: 'puzzle' }))}
            />
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
                takeaways={config.takeaways}
                onComplete={() => {
                    clearSave();
                    onComplete(true);
                }}
            />
        );
    }

    // === PUZZLE ===
    if (!puzzle) return null;

    const maxAttemptsReached = attempts >= puzzle.maxAttempts;
    const pointsForPuzzle = Math.max(0, puzzle.points - hintsUsed * puzzle.hintCost);

    return (
        <div className="min-h-screen bg-duck-ink flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Terminal chrome */}
                <div className="bg-duck-ink rounded-t-2xl border border-duck-gray/30 px-4 py-2.5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <div className="w-3 h-3 rounded-full bg-duck-error/70" />
                    <span className="ml-2 font-mono text-xs text-duck-gray flex-1">
                        puzzle-lab — {puzzle.id}
                    </span>
                    <button
                        onClick={onBack}
                        className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-duck-gray transition-colors hover:bg-duck-gray/10 hover:text-duck-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-gray focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                        aria-label="Terug"
                    >
                        <ArrowLeft size={14} />
                    </button>
                </div>

                <div
                    className={`bg-duck-ink rounded-b-2xl border border-t-0 border-duck-gray/30 p-5 transition-transform ${
                        shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
                    style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
                >
                    {/* Progress bar */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] text-duck-gray">
                            PUZZEL {state.currentPuzzle + 1}/{config.puzzles.length}
                        </span>
                        <div className="flex gap-1">
                            {config.puzzles.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        state.solved.includes(p.id)
                                            ? 'bg-duck-acid w-6'
                                            : i === state.currentPuzzle
                                              ? 'bg-duck-acid w-6'
                                              : 'bg-duck-gray/30 w-4'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="font-mono text-[11px] text-duck-ink font-bold">
                            +{pointsForPuzzle} pts
                        </div>
                    </div>

                    {/* Puzzle title */}
                    <div className="mb-4">
                        <div className="font-mono text-[10px] text-duck-gray/70 mb-1 uppercase tracking-widest">
                            [ {puzzle.type === 'multiple-choice' ? 'MULTIPLE CHOICE' : puzzle.type === 'code-crack' ? 'CODE KRAKEN' : 'TEKST INVOER'} ]
                        </div>
                        <h2
                            className="text-lg font-black text-white mb-2"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            {puzzle.title}
                        </h2>
                        <p className="font-mono text-xs text-duck-gray leading-relaxed">
                            {puzzle.description}
                        </p>
                    </div>

                    {/* Clues */}
                    <div className="bg-duck-ink rounded-xl border border-duck-gray/30 p-4 mb-4 space-y-2">
                        <div className="font-mono text-[10px] text-duck-gray uppercase tracking-widest mb-2">
                            AANWIJZINGEN
                        </div>
                        {visibleClues.slice(0, puzzle.clues.length + hintsUsed).map((clue, i) => (
                            <div key={i} className="flex items-start gap-2 font-mono text-xs text-duck-gray">
                                <span className="text-duck-gray shrink-0 mt-0.5">&gt;</span>
                                <span>{clue}</span>
                            </div>
                        ))}
                        {visibleClues.length > puzzle.clues.length + hintsUsed && (
                            <div className="flex items-center gap-2 font-mono text-[10px] text-duck-gray">
                                <EyeOff size={10} />
                                <span>{visibleClues.length - puzzle.clues.length - hintsUsed} aanwijzing(en) verborgen</span>
                            </div>
                        )}
                        {extraRevealed && puzzle.extraClues && puzzle.extraClues.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-duck-gray/30">
                                <div className="font-mono text-[10px] text-duck-gray/70 uppercase tracking-widest mb-1.5">
                                    EXTRA AANWIJZINGEN (ontgrendeld)
                                </div>
                                {puzzle.extraClues.map((clue, i) => (
                                    <div key={i} className="flex items-start gap-2 font-mono text-xs text-duck-ink/80 mb-1">
                                        <span className="text-duck-gray shrink-0 mt-0.5">!</span>
                                        <span>{clue}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Feedback banner */}
                    {feedback && (
                        <div className="mb-4">
                            <FeedbackBanner type={feedback} message={feedbackMessage} />
                        </div>
                    )}

                    {/* Input area */}
                    {!isSolved && !maxAttemptsReached && (
                        <>
                            {puzzle.type === 'multiple-choice' && puzzle.options ? (
                                <div className="space-y-2 mb-4">
                                    {puzzle.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => checkAnswer(opt)}
                                            disabled={celebrating}
                                            className="w-full text-left px-4 py-3 bg-duck-ink hover:bg-duck-ink border border-duck-gray/30 hover:border-duck-acid/40 rounded-xl font-mono text-xs text-duck-gray transition-all duration-150 flex items-center gap-3"
                                        >
                                            <span className="text-duck-gray w-5">{String.fromCharCode(65 + i)}.</span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="flex items-center bg-duck-ink border border-duck-gray/30 focus-within:border-duck-acid/60 rounded-xl px-3 py-2.5 gap-2 transition-colors">
                                        <span className="font-mono text-xs text-duck-gray shrink-0">$</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={celebrating}
                                            placeholder="antwoord..."
                                            className="flex-1 bg-transparent font-mono text-xs text-duck-ink placeholder:text-duck-gray/50 outline-none"
                                        />
                                        <BlinkingCursor />
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!inputValue.trim() || celebrating}
                                        className="w-full mt-2 py-2.5 bg-duck-acid hover:bg-duck-acid hover:brightness-95 hover:text-duck-ink disabled:bg-duck-gray/30 disabled:text-duck-gray/60 text-duck-ink disabled:cursor-not-allowed font-mono font-bold text-xs rounded-xl transition-all duration-150"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            )}

                            {/* Hint + attempts row */}
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-[10px] text-duck-gray">
                                    {attempts > 0 && (
                                        <span className={attempts >= puzzle.maxAttempts - 1 ? 'text-duck-gray/70' : ''}>
                                            {attempts}/{puzzle.maxAttempts} pogingen
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {visibleClues.length > puzzle.clues.length + hintsUsed && (
                                        <button
                                            onClick={handleHint}
                                            className="flex items-center gap-1 font-mono text-[10px] text-duck-gray/70 hover:text-duck-ink transition-colors"
                                        >
                                            <Eye size={10} />
                                            hint (-{puzzle.hintCost} pts)
                                        </button>
                                    )}
                                    {attempts >= 2 && (
                                        <button
                                            onClick={handleSkip}
                                            className="font-mono text-[10px] text-duck-gray hover:text-duck-bg transition-colors"
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
                            <div className="font-mono text-xs text-duck-error/80 bg-duck-error/20 border border-duck-error/30 rounded-xl p-3">
                                Max pogingen bereikt. Je kunt doorgaan naar de volgende puzzel.
                            </div>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 bg-duck-ink hover:bg-duck-ink border border-duck-gray/30 font-mono font-bold text-xs text-duck-gray rounded-xl transition-all duration-150"
                            >
                                VOLGENDE PUZZEL →
                            </button>
                        </div>
                    )}

                    {/* Solved state */}
                    {isSolved && !celebrating && (
                        <div className="space-y-3">
                            <div className="font-mono text-xs text-duck-acid/80 bg-duck-ink/20 border border-duck-acid/30 rounded-xl p-3 text-center">
                                ✓ opgelost
                            </div>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 bg-duck-acid hover:bg-duck-acid hover:brightness-95 font-mono font-bold text-xs text-duck-ink rounded-xl transition-all duration-150"
                            >
                                VOLGENDE PUZZEL →
                            </button>
                        </div>
                    )}

                    {/* Score footer */}
                    <div className="mt-5 pt-4 border-t border-duck-gray/30 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-duck-gray">TOTAAL SCORE</span>
                        <span className="font-mono text-xs font-bold text-duck-ink">{totalScore} pts</span>
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
