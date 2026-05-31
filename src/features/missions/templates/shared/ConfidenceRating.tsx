import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceRatingProps {
    onSelect: (level: 1 | 2 | 3) => void;
}

const levels = [
    { value: 1 as const, label: 'Gok', emoji: '🎲', color: 'bg-[#D7C95F]/10 text-[#D7C95F] border-[#D7C95F]/30 hover:border-[#D7C95F]' },
    { value: 2 as const, label: 'Redelijk zeker', emoji: '🤔', color: 'bg-[#0B453F]/10 text-[#0B453F] border-[#0B453F]/30 hover:border-[#0B453F]' },
    { value: 3 as const, label: 'Heel zeker', emoji: '💪', color: 'bg-[#5F947D]/10 text-[#5F947D] border-[#5F947D]/30 hover:border-[#5F947D]' },
];

export const ConfidenceRating: React.FC<ConfidenceRatingProps> = ({ onSelect }) => (
    <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
    >
        <p
            className="text-xs font-bold text-[#445865] text-center"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            Hoe zeker ben je van je keuze?
        </p>
        <div className="flex gap-2">
            {levels.map((l) => (
                <button
                    key={l.value}
                    onClick={() => onSelect(l.value)}
                    data-qa={`confidence-level-${l.value}`}
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

/** Score multiplier op basis van confidence + correctheid (Asymmetrisch) */
export function confidenceMultiplier(confidence: 1 | 2 | 3 | undefined, correct: boolean): number {
    if (!confidence) return 1;
    if (correct) {
        // Correct: extra beloning voor terechte zelfverzekerdheid
        return confidence === 3 ? 1.5 : confidence === 2 ? 1.2 : 1.0;
    }
    // Fout: straf bij fout antwoord met hoog zelfvertrouwen
    return confidence === 3 ? -0.5 : confidence === 2 ? -0.2 : 0.0;
}

