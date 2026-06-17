import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FollowUpQuestion } from './types';

interface FollowUpCardProps {
    followUp: FollowUpQuestion;
    onComplete: (correct: boolean) => void;
    /** Visueel thema — 'light' voor ScenarioEngine, 'dark' voor PuzzleLab */
    theme?: 'light' | 'dark';
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({ followUp, onComplete, theme = 'light' }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const answered = selected !== null;
    const correct = selected === followUp.correctIndex;

    const isLight = theme === 'light';
    const bg = isLight ? 'bg-duck-bg' : 'bg-duck-ink';
    const border = isLight ? 'border-duck-acid' : 'border-duck-acid/40';
    const textMain = isLight ? 'text-duck-ink' : 'text-white';
    const textSub = isLight ? 'text-duck-ink/60' : 'text-duck-ink/60';
    const fontMain = isLight
        ? { fontFamily: "'Newsreader', Georgia, serif" }
        : { fontFamily: "'Newsreader', Georgia, serif" };
    const fontBody = isLight
        ? { fontFamily: "'Outfit', system-ui, sans-serif" }
        : {};

    const handleSelect = (index: number) => {
        if (answered) return;
        setSelected(index);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bg} rounded-2xl border-2 ${border} p-4 mt-4`}
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🧠</span>
                <span className={`text-xs font-black ${textMain}`} style={fontBody}>
                    Verdiepingsvraag
                    {followUp.bonusPoints > 0 && (
                        <span className={`ml-1.5 font-bold ${isLight ? 'text-duck-ink' : 'text-duck-acid'}`}>
                            +{followUp.bonusPoints} bonus
                        </span>
                    )}
                </span>
            </div>

            <p className={`text-sm font-bold ${textMain} mb-3`} style={fontMain}>
                {followUp.question}
            </p>

            <div className="space-y-2 mb-3">
                {followUp.options.map((opt, i) => {
                    let optStyle = isLight
                        ? 'bg-white border-duck-gray hover:border-duck-acid'
                        : 'bg-duck-ink border-[#08283B] hover:border-duck-acid/40';

                    if (answered && i === followUp.correctIndex) {
                        optStyle = isLight
                            ? 'bg-duck-ink/10 border-duck-ink'
                            : 'bg-duck-ink/10 border-duck-acid';
                    } else if (answered && i === selected && !correct) {
                        optStyle = isLight
                            ? 'bg-duck-error border-duck-error'
                            : 'bg-duck-error/30 border-duck-error';
                    } else if (answered) {
                        optStyle = isLight
                            ? 'bg-duck-gray border-duck-gray'
                            : 'bg-duck-ink border-[#08283B]';
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            disabled={answered}
                            className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-xs transition-all duration-200 ${optStyle} ${textMain}`}
                            style={fontBody}
                        >
                            <span className={textSub}>{String.fromCharCode(65 + i)}. </span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {answered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                >
                    <div
                        className={`text-xs px-3 py-2 rounded-xl ${
                            correct
                                ? isLight ? 'bg-duck-ink/10 text-duck-ink' : 'bg-duck-ink/20 text-duck-acid'
                                : isLight ? 'bg-duck-acid/10 text-duck-ink' : 'bg-duck-error/30 text-duck-error'
                        }`}
                        style={fontBody}
                    >
                        {correct ? '✓ Goed!' : '✕ Niet helemaal.'} {followUp.explanation}
                    </div>
                    <button
                        onClick={() => onComplete(correct)}
                        className={`w-full py-2.5 rounded-full font-black text-sm transition-all duration-200 ${
                            isLight
                                ? 'bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink'
                                : 'bg-duck-ink hover:bg-duck-ink hover:text-duck-acid text-duck-acid font-mono'
                        }`}
                        style={fontBody}
                    >
                        {isLight ? 'Doorgaan →' : 'DOORGAAN →'}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};
