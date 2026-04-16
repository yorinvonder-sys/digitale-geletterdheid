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
    const bg = isLight ? 'bg-[#FAF9F0]' : 'bg-[#1a1a24]';
    const border = isLight ? 'border-[#D97757]' : 'border-green-500/40';
    const textMain = isLight ? 'text-[#1A1A19]' : 'text-white';
    const textSub = isLight ? 'text-[#6B6B66]' : 'text-[#9a9ab0]';
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
                        <span className={`ml-1.5 font-bold ${isLight ? 'text-[#D97757]' : 'text-amber-400'}`}>
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
                        ? 'bg-white border-[#E8E6DF] hover:border-[#D97757]'
                        : 'bg-[#0d0d14] border-[#2a2a38] hover:border-green-500/40';

                    if (answered && i === followUp.correctIndex) {
                        optStyle = isLight
                            ? 'bg-[#10B981]/10 border-[#10B981]'
                            : 'bg-green-900/30 border-green-500';
                    } else if (answered && i === selected && !correct) {
                        optStyle = isLight
                            ? 'bg-red-50 border-red-400'
                            : 'bg-red-900/30 border-red-500';
                    } else if (answered) {
                        optStyle = isLight
                            ? 'bg-[#F0EEE8] border-[#E8E6DF]'
                            : 'bg-[#0d0d14] border-[#1a1a24]';
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
                                ? isLight ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-green-900/30 text-green-400'
                                : isLight ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-red-900/30 text-red-400'
                        }`}
                        style={fontBody}
                    >
                        {correct ? '✓ Goed!' : '✕ Niet helemaal.'} {followUp.explanation}
                    </div>
                    <button
                        onClick={() => onComplete(correct)}
                        className={`w-full py-2.5 rounded-full font-black text-sm transition-all duration-200 ${
                            isLight
                                ? 'bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white'
                                : 'bg-green-700 hover:bg-green-600 text-black font-mono'
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
