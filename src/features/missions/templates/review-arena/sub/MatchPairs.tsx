import React, { useState } from 'react';
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
    maxScore,
}) => {
    const [leftItems] = useState(() => pairs.map((p, i) => ({ id: i, label: p.left })));
    const [rightItems] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, label: p.right }))));

    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);

    const handleLeftClick = (id: number) => {
        if (matched.has(id) || done) return;
        setSelectedLeft(id);
        setSelectedRight(null);
    };

    const handleRightClick = (id: number) => {
        if (done) return;
        // Check if this right item is already matched
        if (matched.has(id)) return;

        if (selectedLeft === null) {
            // Highlight it so user knows to pick a left first
            return;
        }

        if (selectedLeft === id) {
            // Correct match!
            const newMatched = new Set(matched);
            newMatched.add(id);
            setMatched(newMatched);
            setSelectedLeft(null);
            setSelectedRight(null);

            if (newMatched.size === pairs.length) {
                const penalty = Math.min(wrongAttempts, pairs.length);
                const earned = Math.max(0, Math.round(((pairs.length - penalty) / pairs.length) * maxScore));
                setScore(earned);
                setDone(true);
            }
        } else {
            // Wrong — flash red briefly
            setWrongAttempts((count) => count + 1);
            setSelectedRight(id);
            setWrongFlash(id);
            setTimeout(() => {
                setSelectedRight(null);
                setWrongFlash(null);
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

            {!done && (
                <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Klik een item links aan, dan het bijpassende item rechts.
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
                                key={item.id}
                                onClick={() => handleLeftClick(item.id)}
                                data-qa="review-match-left"
                                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                                    ${isMatched
                                        ? 'bg-[#5F947D]/10 border-[#5F947D] text-[#5F947D] opacity-60 cursor-default'
                                        : isSelected
                                            ? 'bg-[#D97848]/10 border-[#D97848] text-[#D97848]'
                                            : 'bg-white border-[#E7D8BD] text-[#445865] hover:border-[#D97848]/40'
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
                                key={item.id}
                                onClick={() => handleRightClick(item.id)}
                                data-qa="review-match-right"
                                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                                    ${isMatched
                                        ? 'bg-[#5F947D]/10 border-[#5F947D] text-[#5F947D] opacity-60 cursor-default'
                                        : isFlashing
                                            ? 'bg-[#D97848]/10 border-[#D97848] text-[#D97848]'
                                            : selectedLeft !== null
                                                ? 'bg-white border-[#E7D8BD] text-[#445865] hover:border-[#D97848]/40 cursor-pointer'
                                                : 'bg-white border-[#E7D8BD] text-[#445865]'
                                    }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                animate={isFlashing ? { x: [0, -4, 4, -4, 0] } : { x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {item.label}
                                {isMatched && <span className="ml-1">✓</span>}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#E7D8BD] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#5F947D] rounded-full"
                        animate={{ width: `${(matched.size / pairs.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
                            className="p-3 rounded-xl bg-[#5F947D]/10 text-[#5F947D] text-sm font-medium"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Alle koppels gevonden! <span className="font-black">{score}/{maxScore} punten</span>
                        </div>
                        <button
                            onClick={handleContinue}
                            data-qa="review-next"
                            className="w-full py-3 bg-gradient-to-r from-[#5F947D] to-[#5F947D] hover:from-[#5F947D] hover:to-[#5F947D] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
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
