import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Terminal, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { CompletionScreen } from '../shared/CompletionScreen';
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
            className="inline-block w-2 h-4 bg-green-400 ml-0.5 align-middle"
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
                    ? 'bg-green-900/40 border-green-500/60 text-green-400'
                    : 'bg-red-900/40 border-red-500/60 text-red-400'
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

    // Config not found — show fallback
    if (!config) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="font-mono text-xs text-red-400 text-center">
                    <div className="mb-2">ERROR: config not found for &quot;{missionId}&quot;</div>
                    <button onClick={onBack} className="text-[#4a4a58] hover:text-[#9a9ab0]">← back</button>
                </div>
            </div>
        );
    }


    const { state, setState, clearSave } = useMissionAutoSave<PuzzleLabState>(
        config.missionId,
        makeInitialState()
    );

    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<FeedbackType>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [shake, setShake] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Terminal header bar */}
                    <div className="bg-[#1a1a24] rounded-t-2xl border border-[#2a2a38] px-4 py-2.5 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                        <span className="ml-2 font-mono text-xs text-[#4a4a58]">
                            puzzle-lab — {config.missionId}
                        </span>
                    </div>

                    <div className="bg-[#0d0d14] rounded-b-2xl border border-t-0 border-[#2a2a38] p-6">
                        {/* Boot sequence */}
                        <div className="font-mono text-xs text-green-500/60 mb-5 space-y-0.5">
                            <div>$ initializing puzzle-lab v2.4...</div>
                            <div>$ loading mission: {config.missionId}</div>
                            <div>$ {config.puzzles.length} puzzles queued</div>
                            <div className="text-green-400">$ ready.</div>
                        </div>

                        <div className="text-4xl mb-3 text-center">{config.introEmoji}</div>
                        <h1
                            className="text-xl font-black text-white mb-3 text-center"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            {config.introTitle}
                        </h1>
                        <p className="font-mono text-xs text-[#9a9ab0] leading-relaxed mb-5 text-center">
                            {config.introDescription}
                        </p>

                        {config.introFeatures && config.introFeatures.length > 0 && (
                            <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a38] p-4 mb-5 space-y-2">
                                {config.introFeatures.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2 font-mono text-xs text-[#7a7a90]">
                                        <span className="text-green-500 shrink-0">&gt;</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-5 font-mono text-xs text-[#5a5a70]">
                            <Terminal size={12} className="text-green-500 shrink-0" />
                            <span>{config.puzzles.length} puzzels — max {config.maxScore} punten</span>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, phase: 'puzzle' }))}
                            className="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-mono font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            $ START_MISSION
                            <ChevronRight size={15} />
                        </button>

                        <button
                            onClick={onBack}
                            className="w-full mt-3 py-2 font-mono text-xs text-[#4a4a58] hover:text-[#7a7a90] transition-colors flex items-center justify-center gap-1"
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
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Terminal chrome */}
                <div className="bg-[#1a1a24] rounded-t-2xl border border-[#2a2a38] px-4 py-2.5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="ml-2 font-mono text-xs text-[#4a4a58] flex-1">
                        puzzle-lab — {puzzle.id}
                    </span>
                    <button
                        onClick={onBack}
                        className="text-[#4a4a58] hover:text-[#9a9ab0] transition-colors"
                        aria-label="Terug"
                    >
                        <ArrowLeft size={14} />
                    </button>
                </div>

                <div
                    className={`bg-[#0d0d14] rounded-b-2xl border border-t-0 border-[#2a2a38] p-5 transition-transform ${
                        shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
                    style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
                >
                    {/* Progress bar */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] text-[#4a4a58]">
                            PUZZEL {state.currentPuzzle + 1}/{config.puzzles.length}
                        </span>
                        <div className="flex gap-1">
                            {config.puzzles.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        state.solved.includes(p.id)
                                            ? 'bg-green-500 w-6'
                                            : i === state.currentPuzzle
                                              ? 'bg-amber-400 w-6'
                                              : 'bg-[#2a2a38] w-4'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="font-mono text-[11px] text-amber-400 font-bold">
                            +{pointsForPuzzle} pts
                        </div>
                    </div>

                    {/* Puzzle title */}
                    <div className="mb-4">
                        <div className="font-mono text-[10px] text-green-500/70 mb-1 uppercase tracking-widest">
                            [ {puzzle.type === 'multiple-choice' ? 'MULTIPLE CHOICE' : puzzle.type === 'code-crack' ? 'CODE KRAKEN' : 'TEKST INVOER'} ]
                        </div>
                        <h2
                            className="text-lg font-black text-white mb-2"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            {puzzle.title}
                        </h2>
                        <p className="font-mono text-xs text-[#9a9ab0] leading-relaxed">
                            {puzzle.description}
                        </p>
                    </div>

                    {/* Clues */}
                    <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a38] p-4 mb-4 space-y-2">
                        <div className="font-mono text-[10px] text-[#4a4a58] uppercase tracking-widest mb-2">
                            AANWIJZINGEN
                        </div>
                        {visibleClues.slice(0, puzzle.clues.length + hintsUsed).map((clue, i) => (
                            <div key={i} className="flex items-start gap-2 font-mono text-xs text-[#c8c8e0]">
                                <span className="text-green-500 shrink-0 mt-0.5">&gt;</span>
                                <span>{clue}</span>
                            </div>
                        ))}
                        {visibleClues.length > puzzle.clues.length + hintsUsed && (
                            <div className="flex items-center gap-2 font-mono text-[10px] text-[#4a4a58]">
                                <EyeOff size={10} />
                                <span>{visibleClues.length - puzzle.clues.length - hintsUsed} aanwijzing(en) verborgen</span>
                            </div>
                        )}
                        {extraRevealed && puzzle.extraClues && puzzle.extraClues.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-[#2a2a38]">
                                <div className="font-mono text-[10px] text-amber-500/70 uppercase tracking-widest mb-1.5">
                                    EXTRA AANWIJZINGEN (ontgrendeld)
                                </div>
                                {puzzle.extraClues.map((clue, i) => (
                                    <div key={i} className="flex items-start gap-2 font-mono text-xs text-amber-300/80 mb-1">
                                        <span className="text-amber-500 shrink-0 mt-0.5">!</span>
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
                                            className="w-full text-left px-4 py-3 bg-[#1a1a24] hover:bg-[#252530] border border-[#2a2a38] hover:border-green-500/40 rounded-xl font-mono text-xs text-[#c8c8e0] transition-all duration-150 flex items-center gap-3"
                                        >
                                            <span className="text-[#4a4a58] w-5">{String.fromCharCode(65 + i)}.</span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="flex items-center bg-[#1a1a24] border border-[#2a2a38] focus-within:border-green-500/60 rounded-xl px-3 py-2.5 gap-2 transition-colors">
                                        <span className="font-mono text-xs text-green-500 shrink-0">$</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={e => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={celebrating}
                                            placeholder="antwoord..."
                                            className="flex-1 bg-transparent font-mono text-xs text-green-300 placeholder:text-[#3a3a4a] outline-none"
                                        />
                                        <BlinkingCursor />
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!inputValue.trim() || celebrating}
                                        className="w-full mt-2 py-2.5 bg-green-700 hover:bg-green-600 disabled:bg-[#1a1a24] disabled:text-[#3a3a4a] text-black disabled:cursor-not-allowed font-mono font-bold text-xs rounded-xl transition-all duration-150"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            )}

                            {/* Hint + attempts row */}
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-[10px] text-[#3a3a4a]">
                                    {attempts > 0 && (
                                        <span className={attempts >= puzzle.maxAttempts - 1 ? 'text-red-500/70' : ''}>
                                            {attempts}/{puzzle.maxAttempts} pogingen
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {visibleClues.length > puzzle.clues.length + hintsUsed && (
                                        <button
                                            onClick={handleHint}
                                            className="flex items-center gap-1 font-mono text-[10px] text-amber-500/70 hover:text-amber-400 transition-colors"
                                        >
                                            <Eye size={10} />
                                            hint (-{puzzle.hintCost} pts)
                                        </button>
                                    )}
                                    {attempts >= 2 && (
                                        <button
                                            onClick={handleSkip}
                                            className="font-mono text-[10px] text-[#3a3a4a] hover:text-[#5a5a70] transition-colors"
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
                            <div className="font-mono text-xs text-red-400/80 bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                                Max pogingen bereikt. Je kunt doorgaan naar de volgende puzzel.
                            </div>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 bg-[#1a1a24] hover:bg-[#252530] border border-[#2a2a38] font-mono font-bold text-xs text-[#9a9ab0] rounded-xl transition-all duration-150"
                            >
                                VOLGENDE PUZZEL →
                            </button>
                        </div>
                    )}

                    {/* Solved state */}
                    {isSolved && !celebrating && (
                        <div className="space-y-3">
                            <div className="font-mono text-xs text-green-400/80 bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-center">
                                ✓ opgelost
                            </div>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 bg-green-700 hover:bg-green-600 font-mono font-bold text-xs text-black rounded-xl transition-all duration-150"
                            >
                                VOLGENDE PUZZEL →
                            </button>
                        </div>
                    )}

                    {/* Score footer */}
                    <div className="mt-5 pt-4 border-t border-[#1a1a24] flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#3a3a4a]">TOTAAL SCORE</span>
                        <span className="font-mono text-xs font-bold text-amber-400">{totalScore} pts</span>
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
