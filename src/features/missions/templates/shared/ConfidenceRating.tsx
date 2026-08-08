import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceRatingProps {
    onSelect: (level: 1 | 2 | 3) => void;
    /** Reeds gekozen niveau, zodat de keuze zichtbaar blijft. */
    selected?: 1 | 2 | 3;
}

const levels = [
    { value: 1 as const, label: 'Gok', emoji: '🎲', color: 'bg-duck-acid/10 text-duck-ink border-duck-acid/30 hover:border-duck-acid' },
    { value: 2 as const, label: 'Redelijk zeker', emoji: '🤔', color: 'bg-duck-ink/10 text-duck-ink border-duck-ink/30 hover:border-duck-ink' },
    { value: 3 as const, label: 'Heel zeker', emoji: '💪', color: 'bg-duck-ink/10 text-duck-ink border-duck-ink/30 hover:border-duck-ink' },
];

/**
 * Zelfinschatting: puur didactisch. De keuze wordt alleen geregistreerd via
 * onSelect zodat de engine hem kan opslaan en na het antwoord terugkoppelen —
 * hij telt niet mee voor de score en is niet verplicht.
 */
export const ConfidenceRating: React.FC<ConfidenceRatingProps> = ({ onSelect, selected }) => (
    <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
    >
        <p
            className="text-xs font-bold text-duck-ink/75 text-center"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            Hoe zeker ben je van je keuze? <span className="font-normal">(mag je overslaan)</span>
        </p>
        <div className="flex gap-2" role="group" aria-label="Hoe zeker ben je van je keuze?">
            {levels.map((l) => (
                <button
                    key={l.value}
                    type="button"
                    data-qa="confidence-option"
                    data-confidence-level={l.value}
                    aria-pressed={selected === l.value}
                    onClick={() => onSelect(l.value)}
                    className={`min-h-[44px] flex-1 py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 active:scale-[0.97] ${l.color} ${
                        selected === l.value ? 'border-duck-ink ring-2 ring-duck-ink/30' : ''
                    }`}
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <div className="text-base mb-0.5">{l.emoji}</div>
                    <div className="text-[10px] font-bold leading-tight">{l.label}</div>
                </button>
            ))}
        </div>
    </motion.div>
);

/**
 * Kalibratie-terugkoppeling: laat de leerling zien of zijn inschatting klopte.
 * Retourneert null als er geen inschatting is gemaakt.
 */
export function confidenceFeedback(
    confidence: 1 | 2 | 3 | undefined,
    correct: boolean
): string | null {
    if (!confidence) return null;
    if (correct) {
        if (confidence === 3) return 'Je was heel zeker — en het klopte. Mooi ingeschat.';
        if (confidence === 2) return 'Je was redelijk zeker, en het was goed. Je inschatting klopt.';
        return 'Je noemde het een gok, maar het was goed. Je weet meer dan je denkt.';
    }
    if (confidence === 3) return 'Je was heel zeker, maar het was net niet goed. Handig om te weten.';
    if (confidence === 2) return 'Je twijfelde een beetje — terecht, dit was er eentje om na te lezen.';
    return 'Je noemde het een gok en het was niet goed. Eerlijk ingeschat.';
}

interface ConfidenceFeedbackProps {
    confidence: 1 | 2 | 3 | undefined;
    correct: boolean;
    className?: string;
}

/** Toont de kalibratie-terugkoppeling ná het antwoord. Telt niet mee voor de score. */
export const ConfidenceFeedback: React.FC<ConfidenceFeedbackProps> = ({
    confidence,
    correct,
    className = '',
}) => {
    const message = confidenceFeedback(confidence, correct);
    if (!message) return null;

    return (
        <p
            data-qa="confidence-feedback"
            className={`text-xs text-duck-ink/75 ${className}`}
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {message}
        </p>
    );
};
