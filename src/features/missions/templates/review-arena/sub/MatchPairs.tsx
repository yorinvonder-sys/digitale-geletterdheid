import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Pair {
    left: string;
    right: string;
}

interface MatchPairsProps {
    title: string;
    description: string;
    pairs: Pair[];
    onComplete: (score: number, maxScore: number) => void;
    /** Called the moment the round is scored, before the correction is shown. */
    onSubmit?: (score: number) => void;
    maxScore: number;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
    title,
    description,
    pairs,
    onComplete,
    onSubmit,
    maxScore,
}) => {
    const [leftItems] = useState(() => pairs.map((p, i) => ({ id: i, label: p.left })));
    const [rightItems] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, label: p.right }))));

    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    // Rechts klikken zonder links een keuze deed niets — geen melding, geen flits.
    // Dat is niet van een kapotte ronde te onderscheiden, dus zeg wat er moet gebeuren.
    const [needsLeftFirst, setNeedsLeftFirst] = useState(false);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);

    // Een juiste koppeling schakelt de aangeklikte rechterknop uit, en de laatste
    // koppeling schakelt alles uit. Zonder overdracht valt de focus terug op <body>.
    const leftRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const resultRef = useRef<HTMLDivElement>(null);
    const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [pendingLeftFocus, setPendingLeftFocus] = useState<number | null>(null);

    useEffect(() => {
        if (pendingLeftFocus === null) return;
        leftRefs.current[pendingLeftFocus]?.focus();
        setPendingLeftFocus(null);
    }, [pendingLeftFocus]);

    useEffect(() => {
        if (done) resultRef.current?.focus();
    }, [done]);

    useEffect(() => () => {
        if (wrongTimer.current) clearTimeout(wrongTimer.current);
    }, []);

    const scoreFor = (wrong: number) =>
        Math.max(0, Math.round(((pairs.length - Math.min(wrong, pairs.length)) / pairs.length) * maxScore));

    const handleLeftClick = (id: number) => {
        if (matched.has(id) || done) return;
        setSelectedLeft(id);
        setSelectedRight(null);
        setNeedsLeftFirst(false);
        setStatusMessage(`${leftItems[id]?.label ?? ''} geselecteerd. Kies nu rechts het bijpassende item.`);
    };

    const handleRightClick = (id: number) => {
        if (done) return;
        // Check if this right item is already matched
        if (matched.has(id)) return;

        if (selectedLeft === null) {
            setNeedsLeftFirst(true);
            setStatusMessage('Kies eerst links een item, klik daarna het bijpassende item rechts.');
            return;
        }

        if (selectedLeft === id) {
            // Correct match! Een lopende fout-timer zou de flits van een vórige
            // poging over deze koppeling heen zetten — dus eerst opruimen.
            if (wrongTimer.current) {
                clearTimeout(wrongTimer.current);
                wrongTimer.current = null;
            }
            setWrongFlash(null);

            const newMatched = new Set(matched);
            newMatched.add(id);
            setMatched(newMatched);
            setSelectedLeft(null);
            setSelectedRight(null);
            setStatusMessage(`Goed gekoppeld: ${leftItems[id]?.label ?? ''}.`);

            if (newMatched.size === pairs.length) {
                const earned = scoreFor(wrongAttempts);
                setScore(earned);
                setDone(true);
                onSubmit?.(earned);
            } else {
                const next = leftItems.find((l) => !newMatched.has(l.id));
                if (next) setPendingLeftFocus(next.id);
            }
        } else {
            // Wrong — flash red briefly
            const attempts = wrongAttempts + 1;
            setWrongAttempts(attempts);
            setSelectedRight(id);
            setWrongFlash(id);
            setStatusMessage(`Fout gekoppeld. ${attempts} fout${attempts === 1 ? '' : 'en'} tot nu toe.`);
            // Leg de opgelopen aftrek meteen vast, zodat herladen na een fout de
            // strafpunten niet wist.
            onSubmit?.(scoreFor(attempts));
            if (wrongTimer.current) clearTimeout(wrongTimer.current);
            wrongTimer.current = setTimeout(() => {
                setSelectedRight(null);
                setWrongFlash(null);
                wrongTimer.current = null;
            }, 600);
        }
    };

    const handleContinue = () => {
        onComplete(score, maxScore);
    };

    return (
        <div className="space-y-4">
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

            {!done && (
                <p
                    data-qa="review-match-hint"
                    className={`text-xs ${needsLeftFirst ? 'font-bold text-duck-ink' : 'text-duck-ink/70'}`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {needsLeftFirst
                        ? 'Kies eerst links een item, klik daarna het bijpassende item rechts.'
                        : 'Klik een item links aan, dan het bijpassende item rechts.'}
                </p>
            )}

            <div className="grid grid-cols-2 gap-2">
                {/* Left column */}
                <div className="space-y-2">
                    {leftItems.map((item) => {
                        const isMatched = matched.has(item.id);
                        const isSelected = selectedLeft === item.id;

                        return (
                            <motion.button
                                data-qa="review-match-left"
                                data-matched={isMatched}
                                key={item.id}
                                ref={(el: HTMLButtonElement | null) => {
                                    leftRefs.current[item.id] = el;
                                }}
                                type="button"
                                onClick={() => handleLeftClick(item.id)}
                                disabled={isMatched || done}
                                aria-pressed={isSelected}
                                aria-label={
                                    isMatched
                                        ? `${item.label} — al gekoppeld`
                                        : `${item.label} selecteren`
                                }
                                className={`min-h-[44px] w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                                    ${isMatched
                                        ? 'bg-duck-ink/10 border-duck-ink text-duck-ink opacity-60 cursor-default'
                                        : isSelected
                                            ? 'bg-duck-acid/10 border-duck-acid text-duck-ink'
                                            : 'bg-white border-duck-gray text-duck-ink/70 hover:border-duck-acid/40'
                                    }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                            >
                                {item.label}
                                {isMatched && <span className="ml-1">✓</span>}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                    {rightItems.map((item) => {
                        const isMatched = matched.has(item.id);
                        const isFlashing = wrongFlash === item.id;

                        return (
                            <motion.button
                                data-qa="review-match-right"
                                data-matched={isMatched}
                                key={item.id}
                                type="button"
                                onClick={() => handleRightClick(item.id)}
                                disabled={isMatched || done}
                                aria-label={
                                    isMatched
                                        ? `${item.label} — al gekoppeld`
                                        : isFlashing
                                            ? `${item.label} — fout gekoppeld`
                                            : `${item.label} koppelen aan het geselecteerde item`
                                }
                                className={`min-h-[44px] w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                                    ${isMatched
                                        ? 'bg-duck-ink/10 border-duck-ink text-duck-ink opacity-60 cursor-default'
                                        : isFlashing
                                            ? 'bg-duck-acid/10 border-duck-acid text-duck-ink'
                                            : selectedLeft !== null
                                                ? 'bg-white border-duck-gray text-duck-ink/70 hover:border-duck-acid/40 cursor-pointer'
                                                : 'bg-white border-duck-gray text-duck-ink/70'
                                    }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                animate={isFlashing ? { x: [0, -4, 4, -4, 0] } : { x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.label}
                                {isMatched && <span className="ml-1" aria-hidden="true">✓</span>}
                                {/* Fout is niet alleen een kleurflits: het kruisje maakt het
                                    ook zonder kleurwaarneming zichtbaar. */}
                                {isFlashing && <span className="ml-1 font-black" aria-hidden="true">✗</span>}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Statusmelding voor schermlezers — koppelfeedback is anders alleen visueel */}
            <p role="status" aria-live="polite" className="sr-only">
                {statusMessage}
            </p>

            {/* Progress */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-duck-gray rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-duck-ink rounded-full"
                        animate={{ width: `${(matched.size / pairs.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="text-xs text-duck-ink/70" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {matched.size}/{pairs.length}
                    {wrongAttempts > 0 && ` · ${wrongAttempts} fout${wrongAttempts === 1 ? '' : 'en'}`}
                </span>
            </div>

            <AnimatePresence>
                {done && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div
                            ref={resultRef}
                            tabIndex={-1}
                            className="p-3 rounded-xl bg-duck-ink/10 text-duck-ink text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Alle koppels gevonden! <span className="font-black">{score}/{maxScore} punten</span>
                        </div>
                        <button
                            data-qa="review-continue"
                            onClick={handleContinue}
                            className="w-full py-3 bg-gradient-to-r from-duck-ink to-duck-ink hover:from-duck-ink hover:to-duck-ink text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Volgende ronde
                            <ChevronRight size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
