import React from 'react';
import { extractDomeinScores, getDomeinLabel, getDomeinKleur, type DomeinKey } from '@/utils/growthCalculation';
import type { NulmetingResult } from '@/features/assessment/escaperoom/types';

interface ProgressStripProps {
    level: number;
    progressPercentage: number;
    completedCount: number;
    totalMissions: number;
    nulmetingResult?: NulmetingResult;
}

const DOMAIN_KEYS: DomeinKey[] = [
    'digitaleSystemen',
    'mediaEnAI',
    'programmeren',
    'veiligheidPrivacy',
    'welzijnMaatschappij',
];

const RING_COLORS: Record<string, string> = {
    indigo: '#D97848',
    emerald: '#5F947D',
    violet: '#99984D',
    rose: '#D97848',
    sky: '#0B453F',
};

const DomainRing: React.FC<{ score: number; color: string; label: string; size?: number }> = ({
    score,
    color,
    label,
    size = 36,
}) => {
    const radius = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1" title={`${label}: ${score}%`}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E7D8BD"
                    strokeWidth={3}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                />
            </svg>
            <span className="text-[9px] font-bold text-[#445865] leading-none text-center max-w-[48px] truncate">
                {label.split(' ')[0]}
            </span>
        </div>
    );
};

export const ProgressStrip: React.FC<ProgressStripProps> = ({
    level,
    progressPercentage,
    completedCount,
    totalMissions,
    nulmetingResult,
}) => {
    const domainScores = nulmetingResult ? extractDomeinScores(nulmetingResult) : null;

    return (
        <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-[#FFFDF7] px-5 py-3.5 shadow-sm" style={{ borderColor: '#E7D8BD' }}>
            <div className="flex items-center gap-3 border-r border-[#E7D8BD] pr-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#445865]">Level</p>
                    <p className="text-lg font-black tabular-nums text-[#08283B]">{level}</p>
                </div>
                <div className="h-8 w-1.5 overflow-hidden rounded-full bg-[#E7D8BD]">
                    <div
                        className="w-full rounded-full bg-[#5F947D] transition-all duration-700"
                        style={{ height: `${progressPercentage}%`, marginTop: `${100 - progressPercentage}%` }}
                    />
                </div>
            </div>

            <div className="border-r border-[#E7D8BD] pr-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#445865]">Missies</p>
                <p className="text-lg font-black tabular-nums text-[#08283B]">
                    {completedCount}<span className="text-sm font-bold text-[#445865]">/{totalMissions}</span>
                </p>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto">
                {DOMAIN_KEYS.map((key) => {
                    const score = domainScores?.[key] ?? 0;
                    const colorName = getDomeinKleur(key);
                    const color = domainScores ? (RING_COLORS[colorName] || '#99984D') : '#E7D8BD';
                    return (
                        <DomainRing
                            key={key}
                            score={domainScores ? score : 0}
                            color={color}
                            label={getDomeinLabel(key)}
                        />
                    );
                })}
            </div>
        </section>
    );
};
