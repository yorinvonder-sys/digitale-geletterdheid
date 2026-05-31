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
    const bg = isLight ? 'bg-[#FCF6EA]' : 'bg-[#08283B]';
    const border = isLight ? 'border-[#D97848]' : 'border-lab-coral/40';
    const textMain = isLight ? 'text-[#08283B]' : 'text-white';
    const textSub = isLight ? 'text-[#445865]' : 'text-[#445865]';
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
                        <span className={`ml-1.5 font-bold ${isLight ? 'text-[#D97848]' : 'text-lab-gold'}`}>
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
                        ? 'bg-white border-[#E7D8BD] hover:border-[#D97848]'
                        : 'bg-[#08283B] border-[#08283B] hover:border-lab-coral/40';

                    if (answered && i === followUp.correctIndex) {
                        optStyle = isLight
                            ? 'bg-[#5F947D]/10 border-[#5F947D]'
                            : 'bg-lab-sage/30 border-lab-coral';
                    } else if (answered && i === selected && !correct) {
                        optStyle = isLight
                            ? 'bg-lab-coral border-lab-coral'
                            : 'bg-lab-coral/30 border-lab-coral';
                    } else if (answered) {
                        optStyle = isLight
                            ? 'bg-[#E7D8BD] border-[#E7D8BD]'
                            : 'bg-[#08283B] border-[#08283B]';
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            disabled={answered}
                            data-qa={`followup-option-${i}`}
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
                                ? isLight ? 'bg-[#5F947D]/10 text-[#5F947D]' : 'bg-lab-sage/30 text-lab-sage'
                                : isLight ? 'bg-[#D97848]/10 text-[#D97848]' : 'bg-lab-coral/30 text-lab-coral'
                        }`}
                        style={fontBody}
                    >
                        {correct ? '✓ Goed!' : '✕ Niet helemaal.'} {followUp.explanation}
                    </div>
                    <button
                        onClick={() => onComplete(correct)}
                        data-qa="followup-submit"
                        className={`w-full py-2.5 rounded-full font-black text-sm transition-all duration-200 ${
                            isLight
                                ? 'bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white'
                                : 'bg-lab-sage hover:bg-lab-sage hover:text-white text-[#08283B] font-mono'
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
