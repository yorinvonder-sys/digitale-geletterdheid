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
    /**
     * Called once the LAST question is answered, with the definitive round score.
     * Not per question: a partial score would lock the round on the value it had
     * halfway through (0 after the first answer under the class-balanced formula).
     */
    onSubmit?: (score: number) => void;
    /**
     * Uitkomst per al beantwoorde vraag, in volgorde. Hiermee hervat een herladen
     * ronde op de eerstvolgende onbeantwoorde vraag in plaats van opnieuw te
     * beginnen — en houdt een eerder gegeven antwoord zijn oorspronkelijke waarde.
     */
    initialResults?: boolean[];
    /** Meldt de reeks uitkomsten na elk antwoord, zodat die bewaard kan worden. */
    onProgress?: (results: boolean[]) => void;
    maxScore: number;
    trueLabel?: string;
    falseLabel?: string;
}

type AnswerState = boolean | 'timeout' | null;

/**
 * Accuratesse afgezet tegen de beste gok-strategie, zoals de scenario-engine. De
 * ondergrens is het aandeel van de grootste klasse: precies wat je haalt door
 * overal dezelfde knop in te drukken. Dat levert dus 0 op, ook bij een scheve
 * verdeling — juist-minus-fout gaf bij `code-review-2` en `security-review` (elk
 * 5 waar, 3 onwaar) nog 6 van 25 voor achtmaal "WAAR".
 *
 * De eerder gebruikte klassegebalanceerde vorm (aandeel goed per klasse, min 1)
 * zette gokken ook op 0, maar woog de kleinste klasse veel zwaarder: één fout in
 * een klasse van drie kostte meer dan één fout in een klasse van vijf. Deze vorm
 * telt fouten gelijk, waar ze ook vallen.
 *
 * De reeksbonus telt de LANGSTE reeks, vervalt zodra de basisscore 0 is, en kan
 * een niet-foutloze ronde nooit naar de maximumscore tillen. `answers` bevat het
 * juiste antwoord per vraag, op index uitgelijnd met `results`; nog niet
 * beantwoorde vragen tellen als fout.
 */
export function scoreRapidFire(
    results: Array<{ correct: boolean }>,
    answers: boolean[],
    maxScore: number
): number {
    const total = answers.length;
    if (total <= 0 || maxScore <= 0) return 0;

    let trueTotal = 0;
    let trueRight = 0;
    let falseTotal = 0;
    let falseRight = 0;
    answers.forEach((expected, i) => {
        const right = results[i]?.correct === true;
        if (expected) {
            trueTotal++;
            if (right) trueRight++;
        } else {
            falseTotal++;
            if (right) falseRight++;
        }
    });
    const correctCount = trueRight + falseRight;

    const accuracy = correctCount / total;
    // Beste vaste strategie: altijd de grootste klasse kiezen. Bij één klasse valt
    // er niets te gokken en telt kale accuratesse.
    const guessBaseline = Math.max(trueTotal, falseTotal) / total;
    const ratio = guessBaseline >= 1
        ? accuracy
        : (accuracy - guessBaseline) / (1 - guessBaseline);
    const base = Math.max(0, Math.round(ratio * maxScore));

    let longestStreak = 0;
    let running = 0;
    for (const r of results) {
        running = r.correct ? running + 1 : 0;
        if (running > longestStreak) longestStreak = running;
    }
    // Zonder basisscore geen bonus: anders zou blind doorklikken via een toevallige
    // reeks alsnog punten opleveren.
    const bonus = base > 0 ? Math.min(Math.floor(longestStreak / 3) * 2, 10) : 0;

    // Alleen een foutloze ronde haalt het maximum; de bonus stopt één punt eronder.
    if (correctCount === total) return maxScore;
    return Math.max(0, Math.min(base + bonus, maxScore - 1));
}

export const RapidFire: React.FC<RapidFireProps> = ({
    title,
    description,
    questions,
    timePerQuestion,
    onComplete,
    onSubmit,
    initialResults,
    onProgress,
    maxScore,
    trueLabel = 'WAAR',
    falseLabel = 'ONWAAR',
}) => {
    // Hervat de ronde op de eerstvolgende onbeantwoorde vraag. De bewaarde
    // uitkomsten blijven staan: herladen levert nooit een tweede kans op een
    // vraag waarvan de uitleg al in beeld is geweest.
    const resumed = (initialResults ?? []).slice(0, questions.length);
    const [currentIndex, setCurrentIndex] = useState(resumed.length);
    const [results, setResults] = useState<Array<{ correct: boolean; timeLeft: number }>>(
        resumed.map((correct) => ({ correct, timeLeft: 0 }))
    );
    const [answered, setAnswered] = useState<AnswerState>(null);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timePerQuestion ?? null);
    const [done, setDone] = useState(resumed.length >= questions.length);
    const [finalScore, setFinalScore] = useState<number | null>(
        resumed.length >= questions.length
            ? scoreRapidFire(
                  resumed.map((correct) => ({ correct })),
                  questions.map((q) => q.answer),
                  maxScore
              )
            : null
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentQuestion = questions[currentIndex];
    const hasTimer = timePerQuestion !== null && timePerQuestion !== undefined;
    // Antwoordsleutel voor de klassegebalanceerde score; op index uitgelijnd met results.
    const answerKey = questions.map((q) => q.answer);

    useEffect(() => {
        if (!hasTimer || answered !== null || done) return;
        setTimeLeft(timePerQuestion!);
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t === null || t <= 1) {
                    clearInterval(timerRef.current!);
                    handleAnswer('timeout', 0);
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

    const handleAnswer = (choice: Exclude<AnswerState, null>, remainingTime?: number) => {
        if (answered !== null) return;
        if (timerRef.current) clearInterval(timerRef.current);

        const correct = choice === currentQuestion.answer;
        const currentStreak = correct ? streak + 1 : 0;
        setStreak(currentStreak);
        setAnswered(choice);

        const newResults = [...results, { correct, timeLeft: remainingTime ?? timeLeft ?? 0 }];
        setResults(newResults);

        // Bewaar de losse uitkomsten zodat herladen de reeks hervat in plaats van
        // hem opnieuw te laten beginnen. De RONDESCORE gaat pas vast bij de laatste
        // vraag: een tussenstand vastleggen zette de ronde op 0 (na één antwoord is
        // de andere klasse nog volledig onbeantwoord) en sloot de rest af.
        onProgress?.(newResults.map((r) => r.correct));

        const roundTotal = scoreRapidFire(newResults, answerKey, maxScore);
        // Alle vragen gehad: nu pas staat de rondescore vast — vóór het
        // resultatenscherm met de uitleg, zodat herladen niets meer verbetert.
        if (newResults.length >= questions.length) onSubmit?.(roundTotal);

        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= questions.length) {
                setFinalScore(roundTotal);
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
    const longestStreak = results.reduce(
        (acc, r) => {
            const running = r.correct ? acc.running + 1 : 0;
            return { running, best: Math.max(acc.best, running) };
        },
        { running: 0, best: 0 }
    ).best;

    if (done && finalScore !== null) {
        return (
            <div className="space-y-4">
                <div>
                    <h3
                        className="text-lg font-black text-duck-ink mb-1"
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
                                ${r.correct ? 'bg-duck-ink/15 text-duck-ink' : 'bg-duck-acid/15 text-duck-ink'}`}
                        >
                            {r.correct ? '✓' : '✗'}
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-duck-gray rounded-2xl p-4 space-y-2">
                    {questions.map((q, i) => {
                        const result = results[i];
                        if (!result) return null;
                        return (
                            <div
                                key={i}
                                className={`text-xs p-2 rounded-lg ${
                                    result.correct
                                        ? 'bg-duck-ink/10 text-duck-ink/70'
                                        : 'bg-duck-acid/10 text-duck-ink/70'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="font-bold text-duck-ink">
                                    {result.correct ? '✓' : '✗'}
                                </span>{' '}
                                <span className="font-medium">{q.question}</span>
                                {!result.correct && (
                                    <div className="mt-1 text-duck-ink/70">{q.explanation}</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div
                    role="status"
                    aria-live="polite"
                    className={`p-3 rounded-xl text-sm font-medium ${
                        correctCount === questions.length
                            ? 'bg-duck-ink/10 text-duck-ink'
                            : 'bg-duck-acid/10 text-duck-ink'
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {correctCount}/{questions.length} goed
                    {longestStreak >= 3 && <span className="ml-2 text-duck-ink">🔥 Streak bonus!</span>}
                    <span className="font-black ml-2">{finalScore}/{maxScore} punten</span>
                </div>

                <button
                    data-qa="review-continue"
                    onClick={handleContinue}
                    className="w-full py-3 bg-gradient-to-r from-duck-ink to-duck-ink hover:from-duck-ink hover:to-duck-ink text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
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
                        className="text-lg font-black text-duck-ink mb-1"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {title}
                    </h3>
                    <p
                        className="text-sm text-duck-ink/70"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {description}
                    </p>
                </div>
                {streak >= 2 && (
                    <div className="flex items-center gap-1 bg-duck-acid/15 px-2 py-1 rounded-full">
                        <Zap size={12} className="text-duck-ink" />
                        <span className="text-xs font-black text-duck-ink">{streak}x</span>
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
                                    ? 'bg-duck-ink'
                                    : 'bg-duck-acid'
                                : i === currentIndex
                                    ? 'bg-duck-acid'
                                    : 'bg-duck-gray'
                        }`}
                    />
                ))}
            </div>

            {/* Timer */}
            {hasTimer && timeLeft !== null && answered === null && (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-duck-gray rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: timeLeft > timePerQuestion! * 0.5
                                    ? '#202023'
                                    : timeLeft > timePerQuestion! * 0.25
                                        ? '#e1ff01'
                                        : '#ff3c21',
                            }}
                            animate={{ width: `${(timeLeft / timePerQuestion!) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-xs font-black text-duck-ink/70 w-6 text-right"
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
                            ? 'bg-white border-duck-gray'
                            : answered !== 'timeout' && answered === currentQuestion.answer
                                ? 'bg-duck-ink/10 border-duck-ink'
                                : answered === 'timeout'
                                    ? 'bg-duck-acid/10 border-duck-acid'
                                    : 'bg-duck-acid/10 border-duck-acid/60'
                    }`}
                >
                    <p
                        className="text-base font-bold text-duck-ink text-center leading-snug"
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
                        role="status"
                        aria-live="assertive"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs px-3 py-2 rounded-xl ${
                            answered !== 'timeout' && answered === currentQuestion.answer
                                ? 'bg-duck-ink/10 text-duck-ink'
                                : answered === 'timeout'
                                    ? 'bg-duck-acid/20 text-duck-ink'
                                : 'bg-duck-acid/10 text-duck-ink'
                        }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {answered === 'timeout'
                            ? `Tijd voorbij — ${currentQuestion.explanation}`
                            : answered === currentQuestion.answer
                            ? 'Correct!'
                            : `Fout — ${currentQuestion.explanation}`
                        }
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    data-qa="review-rapid-true"
                    onClick={() => handleAnswer(true)}
                    disabled={answered !== null}
                    className={`py-4 rounded-xl font-black text-sm transition-all duration-200 active:scale-[0.97]
                        ${answered === null
                            ? 'bg-duck-ink hover:bg-duck-ink text-white'
                            : answered === true
                                ? currentQuestion.answer === true
                                    ? 'bg-duck-ink text-white'
                                    : 'bg-duck-acid text-duck-ink'
                                : 'bg-duck-gray text-duck-ink/70 cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {trueLabel}
                </button>
                <button
                    data-qa="review-rapid-false"
                    onClick={() => handleAnswer(false)}
                    disabled={answered !== null}
                    className={`py-4 rounded-xl font-black text-sm transition-all duration-200 active:scale-[0.97]
                        ${answered === null
                            ? 'bg-duck-acid hover:bg-duck-acid text-duck-ink'
                            : answered === false
                                ? currentQuestion.answer === false
                                    ? 'bg-duck-ink text-white'
                                    : 'bg-duck-acid text-duck-ink'
                                : 'bg-duck-gray text-duck-ink/70 cursor-not-allowed'
                        }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {falseLabel}
                </button>
            </div>

            <div
                className="text-center text-xs text-duck-ink/70"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Vraag {currentIndex + 1} van {questions.length}
            </div>
        </div>
    );
};
