import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import type { BadgeConfig } from './types';

interface PhaseScore {
    icon: string;
    title: string;
    score: number;
    max: number;
}

interface CompletionStatus {
    isComplete: boolean;
    title?: string;
    description?: string;
}

interface CompletionScreenProps {
    score: number;
    maxScore: number;
    badges: BadgeConfig[];
    phases?: PhaseScore[];
    evidence?: string;
    completionStatus?: CompletionStatus;
    takeaways: string[];
    onComplete: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    score,
    maxScore,
    badges,
    phases,
    evidence,
    completionStatus,
    takeaways,
    onComplete,
}) => {
    const badge = [...badges]
        .sort((a, b) => b.minScore - a.minScore)
        .find((b) => score >= b.minScore) || badges[badges.length - 1];

    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div className="min-h-screen overflow-y-auto bg-[#FCF6EA] flex items-start justify-center px-4 py-6 sm:py-8">
            <div className="w-full max-w-lg">
                {/* Badge */}
                <div
                    className="text-center mb-6 p-6 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}08)` }}
                >
                    <div className="text-5xl mb-3">{badge.emoji}</div>
                    <h2
                        className="text-2xl font-black text-[#08283B] mb-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {badge.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Trophy size={16} className="text-[#D97848]" />
                        <span className="text-lg font-black text-[#D97848]">
                            {score}/{maxScore} punten ({percentage}%)
                        </span>
                    </div>
                </div>

                {completionStatus && (
                    <div
                        data-qa="completion-status"
                        className={`mb-4 rounded-2xl border p-4 ${
                            completionStatus.isComplete
                                ? 'border-[#5F947D]/30 bg-[#5F947D]/10'
                                : 'border-[#D97848]/30 bg-[#D97848]/10'
                        }`}
                    >
                        <p
                            className={`text-sm font-black ${
                                completionStatus.isComplete ? 'text-[#0B453F]' : 'text-[#8A4A2B]'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {completionStatus.title ?? (completionStatus.isComplete ? 'Bewijs compleet' : 'Nog niet voltooid')}
                        </p>
                        {completionStatus.description && (
                            <p
                                className="mt-1 text-sm leading-relaxed text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {completionStatus.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Phase breakdown */}
                {phases && phases.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-4">
                        {phases.map((phase, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between py-2 ${
                                    i < phases.length - 1 ? 'border-b border-[#E7D8BD]' : ''
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{phase.icon}</span>
                                    <span
                                        className="text-sm text-[#445865]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {phase.title}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-[#D97848]">
                                    {phase.score}/{phase.max}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Complete button */}
                <button
                    onClick={onComplete}
                    data-qa="completion-complete"
                    className="mb-4 w-full py-3.5 bg-lab-secondary hover:brightness-95 text-white rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-lab-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-secondary focus-visible:ring-offset-2"
                    style={{
                        backgroundColor: '#0B453F',
                        color: '#FFFFFF',
                        fontFamily: "'Outfit', system-ui, sans-serif",
                    }}
                >
                    {completionStatus && !completionStatus.isComplete ? 'Oefening afsluiten' : 'Missie voltooid! 🎉'}
                </button>

                {evidence && (
                    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-4" data-qa="completion-evidence">
                        <div
                            className="text-xs font-black text-[#D97848] uppercase tracking-widest mb-3"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Leerlingbewijs / docentbewijs
                        </div>
                        <div
                            className="space-y-2 text-sm leading-relaxed text-[#445865]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <p>
                                <strong className="text-[#08283B]">Leerlingbewijs:</strong> score en fase-overzicht hierboven.
                            </p>
                            <p>
                                <strong className="text-[#08283B]">Docentbewijs:</strong> {evidence}
                            </p>
                        </div>
                    </div>
                )}

                {/* Takeaways */}
                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-[#D97848]" />
                        <span
                            className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Wat je hebt geleerd
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {takeaways.map((t, i) => (
                            <li
                                key={i}
                                className="text-sm text-[#445865] flex items-start gap-2"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="text-[#5F947D] mt-0.5">✓</span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
