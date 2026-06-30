import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { DuckMascot } from '@/components/brand/DuckMascot';
import { MissionGoalBanner } from '../../shared/MissionGoalBanner';
import type { MissionGoal } from '../../shared/types';

interface IntroDuckProps {
    title: string;
    description: string;
    features?: string[];
    goal?: MissionGoal | string;
    onStart: () => void;
}

/**
 * Council-chair intro screen.
 * Shows Kees as the council chair, 3 empty seal placeholders,
 * the mission goal (via MissionGoalBanner), and a start button.
 */
export const IntroDuck: React.FC<IntroDuckProps> = ({
    title,
    description,
    features,
    goal,
    onStart,
}) => (
    <div
        className="min-h-screen overflow-y-auto bg-duck-bg flex items-start justify-center px-4 py-6 sm:py-8"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
        <div className="w-full max-w-lg text-center">
            {/* Council chair duck */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col items-center mb-4"
            >
                <DuckMascot className="h-16 w-16 mb-2" mood="cheer" />
                <span
                    className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Raadsvoorzitter Kees
                </span>
            </motion.div>

            <h1
                className="text-2xl font-black text-duck-ink mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {title}
            </h1>
            <p
                className="text-sm text-duck-ink/60 leading-relaxed mb-5"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {description}
            </p>

            {/* Empty seal row — becomes filled on VonnisClimax */}
            <div className="flex justify-center gap-4 mb-5">
                {(['Legaal', 'Eerlijk', 'Transparant'] as const).map((label) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-duck-gray bg-duck-gray/10 flex items-center justify-center">
                            <span className="text-duck-ink/30 text-xs font-black">?</span>
                        </div>
                        <span
                            className="text-[9px] font-black text-duck-ink/40 uppercase tracking-wider"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {goal && <MissionGoalBanner goal={goal} className="mb-5" />}

            <button
                onClick={onStart}
                className="mb-5 w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Betreed de raadszaal
                <ChevronRight size={16} />
            </button>

            {features && features.length > 0 && (
                <div className="bg-white rounded-2xl border border-duck-gray p-4 text-left shadow-sm">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 py-2.5 ${
                                i < features.length - 1 ? 'border-b border-duck-gray' : ''
                            }`}
                        >
                            <div className="w-6 h-6 bg-duck-acid/10 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-xs font-black text-duck-ink">{i + 1}</span>
                            </div>
                            <span
                                className="text-sm font-semibold text-duck-ink/60"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {f}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
