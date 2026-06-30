import React, { useState, useEffect } from 'react';
import { CompletionScreen } from '../../shared/CompletionScreen';
import { SealRow } from './SealRow';
import { Confetti } from './Confetti';
import type { BadgeConfig } from '../../shared/types';

interface PhaseScore {
    icon: string;
    title: string;
    score: number;
    max: number;
}

interface VonnisClimaxProps {
    score: number;
    maxScore: number;
    legaalScore: number;
    eerlijkScore: number;
    transparantScore: number;
    uitdagingScore: number;
    legaalMax: number;
    eerlijkMax: number;
    transparantMax: number;
    uitdagingMax: number;
    phases: PhaseScore[];
    badges: BadgeConfig[];
    takeaways: string[];
    onComplete: () => void;
}

// Pass threshold: ≥ 50% of the dossier's max
const PASS_THRESHOLD = 0.5;

/**
 * Vonnis (verdict) stage.
 * Animates 3 seals (Legaal / Eerlijk / Transparant) based on per-dossier
 * pass thresholds, fires confetti for ~2.5s, then shows the shared
 * CompletionScreen.
 */
export const VonnisClimax: React.FC<VonnisClimaxProps> = ({
    score,
    maxScore,
    legaalScore,
    eerlijkScore,
    transparantScore,
    legaalMax,
    eerlijkMax,
    transparantMax,
    phases,
    badges,
    takeaways,
    onComplete,
}) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowConfetti(false), 2_500);
        return () => clearTimeout(t);
    }, []);

    const seals = [
        {
            label: 'Legaal',
            passed: legaalScore >= legaalMax * PASS_THRESHOLD,
            emoji: '⚖️',
        },
        {
            label: 'Eerlijk',
            passed: eerlijkScore >= eerlijkMax * PASS_THRESHOLD,
            emoji: '🔍',
        },
        {
            label: 'Transparant',
            passed: transparantScore >= transparantMax * PASS_THRESHOLD,
            emoji: '🪟',
        },
    ];

    if (showCompletion) {
        return (
            <CompletionScreen
                score={score}
                maxScore={maxScore}
                badges={badges}
                phases={phases}
                takeaways={takeaways}
                onComplete={onComplete}
            />
        );
    }

    return (
        <div className="min-h-screen bg-duck-bg flex items-start justify-center px-4 py-8">
            {showConfetti && <Confetti durationMs={2000} />}

            <div className="w-full max-w-md text-center">
                <p
                    className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest mb-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Het vonnis
                </p>
                <h2
                    className="text-2xl font-black text-duck-ink mb-2"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    De Ethische Raad heeft gesproken
                </h2>
                <p
                    className="text-sm text-duck-ink/60 mb-6"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Drie zegels. Jouw project is beoordeeld.
                </p>

                <SealRow seals={seals} />

                <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-6 text-left">
                    {seals.map((seal) => (
                        <div
                            key={seal.label}
                            className="flex items-center gap-3 py-2 border-b last:border-b-0 border-duck-gray"
                        >
                            <span className="text-base">{seal.emoji}</span>
                            <span
                                className="text-sm text-duck-ink flex-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {seal.label}
                            </span>
                            <span
                                className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                    seal.passed
                                        ? 'bg-duck-ink/10 text-duck-ink'
                                        : 'bg-duck-acid/20 text-duck-ink'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {seal.passed ? 'Goedgekeurd' : 'Aandacht nodig'}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowCompletion(true)}
                    className="w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-duck-acid/25"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bekijk eindresultaat
                </button>
            </div>
        </div>
    );
};
