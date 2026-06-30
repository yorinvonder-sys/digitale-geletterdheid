import React from 'react';
import { motion } from 'framer-motion';

export interface Seal {
    label: string;
    passed: boolean;
    emoji: string;
}

interface SealRowProps {
    seals: Seal[];
}

/**
 * Three circular seals that show ✓ (passed) or ⚠ (needs work).
 * Used in VonnisClimax to give the final verdict a visual stamp feel.
 */
export const SealRow: React.FC<SealRowProps> = ({ seals }) => (
    <div className="flex justify-center gap-4 my-6">
        {seals.map((seal, i) => (
            <motion.div
                key={seal.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                className="flex flex-col items-center gap-1.5"
            >
                <div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl shadow-md
                        ${seal.passed
                            ? 'bg-duck-ink/10 border-duck-ink'
                            : 'bg-duck-acid/10 border-duck-acid/60'
                        }`}
                >
                    {seal.passed ? '✓' : '⚠'}
                </div>
                <span
                    className="text-[10px] font-black text-duck-ink uppercase tracking-widest text-center leading-tight"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {seal.label}
                </span>
                <span className="text-base">{seal.emoji}</span>
            </motion.div>
        ))}
    </div>
);
