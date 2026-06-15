import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StreakIndicatorProps {
    streak: number;
    /** Minimaal aantal voor zichtbaarheid (default: 2) */
    threshold?: number;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({ streak, threshold = 2 }) => (
    <AnimatePresence>
        {streak >= threshold && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-duck-acid/10 border border-duck-acid/30"
            >
                <span className="text-sm">🔥</span>
                <span
                    className="text-xs font-black text-duck-ink"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {streak}× streak
                </span>
            </motion.div>
        )}
    </AnimatePresence>
);
