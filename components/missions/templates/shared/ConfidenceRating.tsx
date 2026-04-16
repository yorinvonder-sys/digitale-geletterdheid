import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceRatingProps {
    onSelect: (level: 1 | 2 | 3) => void;
}

const levels = [
    { value: 1 as const, label: 'Gok', emoji: '🎲', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:border-[#F59E0B]' },
    { value: 2 as const, label: 'Redelijk zeker', emoji: '🤔', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 hover:border-[#3B82F6]' },
    { value: 3 as const, label: 'Heel zeker', emoji: '💪', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:border-[#10B981]' },
];

export const ConfidenceRating: React.FC<ConfidenceRatingProps> = ({ onSelect }) => (
    <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
    >
        <p
            className="text-xs font-bold text-[#6B6B66] text-center"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            Hoe zeker ben je van je keuze?
        </p>
        <div className="flex gap-2">
            {levels.map((l) => (
                <button
                    key={l.value}
                    onClick={() => onSelect(l.value)}
                    className={`flex-1 py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 active:scale-[0.97] ${l.color}`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <div className="text-base mb-0.5">{l.emoji}</div>
                    <div className="text-[10px] font-bold leading-tight">{l.label}</div>
                </button>
            ))}
        </div>
    </motion.div>
);

/** Score multiplier op basis van confidence + correctheid */
export function confidenceMultiplier(confidence: 1 | 2 | 3 | undefined, correct: boolean): number {
    if (!confidence) return 1;
    if (correct) {
        return confidence === 3 ? 1.2 : confidence === 2 ? 1.1 : 1.0;
    }
    // Fout: hoe zekerder, hoe meer straf
    return confidence === 3 ? 0.8 : 1.0;
}
