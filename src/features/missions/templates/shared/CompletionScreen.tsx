import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { DuckMark } from '@/components/brand/DuckMark';
import type { BadgeConfig } from './types';

interface PhaseScore {
    icon: string;
    title: string;
    score: number;
    max: number;
}

interface CompletionScreenProps {
    score: number;
    maxScore: number;
    badges: BadgeConfig[];
    phases?: PhaseScore[];
    takeaways: string[];
    onComplete: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    score,
    maxScore,
    badges,
    phases,
    takeaways,
    onComplete,
}) => {
    const badge = [...badges]
        .sort((a, b) => b.minScore - a.minScore)
        .find((b) => score >= b.minScore) || badges[badges.length - 1];

    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div className="min-h-screen overflow-y-auto bg-duck-bg flex items-start justify-center px-4 py-6 sm:py-8">
            <div className="w-full max-w-lg">
                {/* Badge */}
                <div
                    className="text-center mb-6 p-6 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}08)` }}
                >
                    <DuckMark className="mx-auto mb-3 size-16" />
                    <h2
                        className="text-2xl font-black text-duck-ink mb-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {badge.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Trophy size={16} className="text-duck-coral" />
                        <span className="text-lg font-black text-duck-coral">
                            {score}/{maxScore} punten ({percentage}%)
                        </span>
                    </div>
                </div>

                {/* Phase breakdown */}
                {phases && phases.length > 0 && (
                    <div className="bg-white rounded-2xl border border-duck-line p-4 mb-4">
                        {phases.map((phase, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between py-2 ${
                                    i < phases.length - 1 ? 'border-b border-duck-line' : ''
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{phase.icon}</span>
                                    <span
                                        className="text-sm text-duck-muted"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {phase.title}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-duck-coral">
                                    {phase.score}/{phase.max}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Complete button */}
                <button
                    onClick={onComplete}
                    className="mb-4 w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Missie voltooid! 🎉
                </button>

                {/* Takeaways */}
                <div className="bg-white rounded-2xl border border-duck-line p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-duck-coral" />
                        <span
                            className="text-xs font-black text-duck-coral uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Wat je hebt geleerd
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {takeaways.map((t, i) => (
                            <li
                                key={i}
                                className="text-sm text-duck-muted flex items-start gap-2"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="text-duck-ink mt-0.5">✓</span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
