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
            className="text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"
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
                            ? 'bg-[#10B981]'
                            : i === currentPhase
                              ? 'bg-gradient-to-r from-[#D97757] to-[#C46849]'
                              : 'bg-[#E8E6DF]'
                    }`}
                />
            ))}
        </div>
        <div className="bg-[#D97757]/10 px-3 py-1 rounded-full border border-[#D97757]/20">
            <span className="text-xs font-black text-[#D97757]">
                {totalScore} {scoreLabel}
            </span>
        </div>
    </div>
);
