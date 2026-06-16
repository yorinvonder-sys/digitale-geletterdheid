import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';

interface RapidFireQuestion {
    question: string;
    answer: boolean;
    explanation: string;
}

interface RapidFireProps {
    title: string;
    description: string;
    questions: RapidFireQuestion[];
    timePerQuestion?: number;
    onComplete: (score: number, maxScore: number) => void;
    maxScore: number;
    trueLabel?: string;
    falseLabel?: string;
}

export const RapidFire: React.FC<RapidFireProps> = ({
    title,
    description,
    questions,
    timePerQuestion,
    onComplete,
    maxScore,
    trueLabel = 'WAAR',
    falseLabel = 'ONWAAR',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<Array<{ correct: boolean; timeLeft: number }>>([]);
    const [answered, setAnswered] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timePerQuestion ?? null);
    const [done, setDone] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentQuestion = questions[currentIndex];
    const hasTimer = timePerQuestion !== null && timePerQuestion !== undefined;

    useEffect(() => {
        if (!hasTimer || answered !== null || done) return;
        setTimeLeft(timePerQuestion!);
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t === null || t <= 1) {
                    clearInterval(timerRef.current!);
                    handleAnswer(null, 0);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, done]);

    const handleAnswer = (choice: boolean | null, remainingTime?: number) => {
        if (answered !== null) return;
        if (timerRef.current) clearInterval(timerRef.current);

        const correct = choice === currentQuestion.answer;
        const currentStreak = correct ? streak + 1 : 0;
        setStreak(currentStreak);
        setAnswered(choice);

        const newResults = [...results, { correct, timeLeft: remainingTime ?? timeLeft ?? 0 }];
        setResults(newResults);

        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= questions.length) {
                const correctCount = newResults.filter((r) => r.correct).length;
                const streakBonus = Math.floor(currentStreak / 3);
                const baseScore = Math.round((correctCount / questions.length) * maxScore);
                const bonusScore = Math.min(streakBonus * 2, 10);
                const total = Math.min(baseScore + bonusScore, maxScore);
                setFinalScore(total);
                setDone(true);
            } else {
                setCurrentIndex(nextIndex);
                setAnswered(null);
                if (hasTimer) setTimeLeft(timePerQuestion!);
            }
        }, 900);
    };

    const handleContinue = () => {
        onComplete(finalScore ?? 0, maxScore);
    };

    const correctCount = results.filter((r) => r.correct).length;

    if (done && finalScore !== null) {
        return (
            <div className="space-y-4">
                <div>
                    <h3
                        className="text-lg font-black text-[#08283B] mb-1"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {title} — Resultaat
                    </h3>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {results.map((r, i) => (
                        <div
                            key={i}
                            className={`h-8 rounded-lg flex items-center justify-center text-sm
                                ${r.correct ? 'bg-[#5F947D]/15 text-[#5F947D]' : 'bg-[#D97848]/15 text-[#D97848]'}`}
                        >
                            {r.correct ? '✓' : '✗'}
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-[#E7D8BD] rounded-2xl p-4 space-y-2">
                    {questions.map((q, i) => {
                        const result = results[i];
                        if (!result) return null;
                        return (
                            <div
                                key={i}
                                className={`text-xs p-2 rounded-lg ${
                                    result.correct
                                        ? 'bg-[#5F947D]/10 text-[#445865]'
                                        : 'bg-[#D97848]/10 text-[#445865]'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className={`font-bold ${result.correct ? 'text-[#5F947D]' : 'text-[#D97848]'}`}>
                                    {result.correct ? '✓' : '✗'}
                                </span>{' '}
                                <span className="font-medium">{q.question}</span>
                                {!result.correct && (
                                    <div className="mt-1 text-[#445865]">{q.explanation}</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div
                    className={`p-3 rounded-xl text-sm font-medium ${
                        correctCount === questions.length
                            ? 'bg-[#5F947D]/10 text-[#5F947D]'
                            : 'bg-[#D97848]/10 text-[#D97848]'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {correctCount}/{questions.length} goed
                    {streak >= 3 && <span className="ml-2 text-[#D7C95F]">🔥 Streak bonus!</span>}
                    <span className="font-black ml-2">{finalScore}/{maxScore} punten</span>
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-[#5F947D] to-[#5F947D] hover:from-[#5F947D] hover:to-[#047857] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Afronden
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h3
                        className="text-lg font-black text-[#08283B] mb-1"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {title}
                    </h3>
                    <p
                        className="text-sm text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {description}
                    </p>
                </div>
                {streak >= 2 && (
                    <div className="flex items-center gap-1 bg-[#D7C95F]/15 px-2 py-1 rounded-full">
                        <Zap size={12} className="text-[#D7C95F]" />
                        <span className="text-xs font-black text-[#D7C95F]">{streak}x</span>
                    </div>
                )}
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
                {questions.map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                            i < currentIndex
                                ? results[i]?.correct
                                    ? 'bg-[#5F947D]'
                                    : 'bg-[#D97848]'
                                : i === currentIndex
                                    ? 'bg-[#D97848]'
                                    : 'bg-[#E7D8BD]'
                        }`}
                    />
                ))}
            </div>

            {/* Timer */}
            {hasTimer && timeLeft !== null && answered === null && (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#E7D8BD] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: timeLeft > timePerQuestion! * 0.5
                                    ? '#5F947D'
                                    : timeLeft > timePerQuestion! * 0.25
                                        ? '#D7C95F'
                                        : '#D97848',
                            }}
                            animate={{ width: `${(timeLeft / timePerQuestion!) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-xs font-black text-[#445865] w-6 text-right"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {timeLeft}s
                    </span>
                </div>
            )}

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`p-5 rounded-2xl border-2 min-h-[100px] flex items-center justify-center transition-colors duration-300 ${
                        answered === null
                            ? 'bg-white border-[#E7D8BD]'
                            : answered === currentQuestion.answer
                                ? 'bg-[#5F947D]/10 border-[#5F947D]'
                                : answered === null
                                    ? 'bg-[#D7C95F]/10 border-[#D7C95F]'
                                    : 'bg-[#D97848]/10 border-[#D97848]/60'
                    }`}
                >
                    <p
                        className="text-base font-bold text-[#08283B] text-center leading-snug"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {currentQuestion.question}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Feedback */}
            <AnimatePresence>
                {answered !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs px-3 py-2 rounded-xl ${
                            answered === currentQuestion.answer
                                ? 'bg-[#5F947D]/10 text-[#5F947D]'
                                : 'bg-[#D97848]/10 text-[#D97848]'
                        }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {answered === currentQuestion.answer
                            ? 'Correct!'
                            : `Fout — ${currentQuestion.explanation}`
                        }
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleAnswer(true)}
                    disabled={answered !== null}
                    className={`py-4 rounded-xl font-black text-sm transition-all duration-200 active:scale-[0.97]
                        ${answered === null
                            ? 'bg-[#5F947D] hover:bg-[#5F947D] text-white'
                            : answered === true
                                ? currentQuestion.answer === true
                                    ? 'bg-[#5F947D] text-white'
                                    : 'bg-[#D97848] text-white'
                                : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {trueLabel}
                </button>
                <button
                    onClick={() => handleAnswer(false)}
                    disabled={answered !== null}
                    className={`py-4 rounded-xl font-black text-sm transition-all duration-200 active:scale-[0.97]
                        ${answered === null
                            ? 'bg-[#D97848] hover:bg-[#D97848] text-white'
                            : answered === false
                                ? currentQuestion.answer === false
                                    ? 'bg-[#5F947D] text-white'
                                    : 'bg-[#D97848] text-white'
                                : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {falseLabel}
                </button>
            </div>

            <div
                className="text-center text-xs text-[#445865]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Vraag {currentIndex + 1} van {questions.length}
            </div>
        </div>
    );
};
