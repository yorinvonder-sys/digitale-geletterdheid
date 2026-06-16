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
            className="text-[#445865] hover:text-[#08283B] transition-all duration-300"
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
                            ? 'bg-[#5F947D]'
                            : i === currentPhase
                              ? 'bg-gradient-to-r from-[#D97848] to-[#D97848]'
                              : 'bg-[#E7D8BD]'
                    }`}
                />
            ))}
        </div>
        <div className="bg-[#D97848]/10 px-3 py-1 rounded-full border border-[#D97848]/20">
            <span className="text-xs font-black text-[#D97848]">
                {totalScore} {scoreLabel}
            </span>
        </div>
    </div>
);
