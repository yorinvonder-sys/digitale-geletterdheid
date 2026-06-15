import React from 'react';

interface PhaseCardProps {
    icon: React.ReactNode;
    phaseNumber: number;
    totalPhases: number;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
    icon,
    phaseNumber,
    totalPhases,
    title,
    description,
    children,
}) => (
    <div className="bg-white rounded-2xl border border-duck-gray p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-duck-acid/10 rounded-xl flex items-center justify-center text-duck-ink">
                {icon}
            </div>
            <div>
                <span
                    className="text-[10px] font-black text-duck-ink uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Fase {phaseNumber}/{totalPhases}
                </span>
                <h3
                    className="text-lg font-black text-duck-ink"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {title}
                </h3>
            </div>
        </div>
        <p
            className="text-sm text-duck-ink/60 leading-relaxed mb-4"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {description}
        </p>
        {children}
    </div>
);
