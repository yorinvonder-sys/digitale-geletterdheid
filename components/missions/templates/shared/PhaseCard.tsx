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
    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#D97757]/10 rounded-xl flex items-center justify-center text-[#D97757]">
                {icon}
            </div>
            <div>
                <span
                    className="text-[10px] font-black text-[#D97757] uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Fase {phaseNumber}/{totalPhases}
                </span>
                <h3
                    className="text-lg font-black text-[#1A1A19]"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                    {title}
                </h3>
            </div>
        </div>
        <p
            className="text-sm text-[#3D3D38] leading-relaxed mb-4"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {description}
        </p>
        {children}
    </div>
);
