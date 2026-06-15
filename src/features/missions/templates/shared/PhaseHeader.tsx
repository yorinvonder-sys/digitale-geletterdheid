import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PhaseHeaderProps {
    currentPhase: number;
    totalPhases: number;
    totalScore: number;
    onBack: () => void;
    scoreLabel?: string;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
    currentPhase,
    totalPhases,
    totalScore,
    onBack,
    scoreLabel = 'pts',
}) => (
    <div className="flex items-center justify-between mb-6">
        <button
            onClick={onBack}
            className="-ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-duck-ink/60 transition-all duration-300 hover:bg-duck-gray/60 hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
            aria-label="Terug"
        >
            <ArrowLeft size={18} />
        </button>
        <div className="flex gap-1.5">
            {Array.from({ length: totalPhases }).map((_, i) => (
                <div
                    key={i}
                    className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                        i < currentPhase
                            ? 'bg-duck-ink'
                            : i === currentPhase
                              ? 'bg-gradient-to-r from-duck-acid to-duck-acid'
                              : 'bg-duck-gray'
                    }`}
                />
            ))}
        </div>
        <div className="bg-duck-acid/10 px-3 py-1 rounded-full border border-duck-acid/20">
            <span className="text-xs font-black text-duck-acid">
                {totalScore} {scoreLabel}
            </span>
        </div>
    </div>
);
