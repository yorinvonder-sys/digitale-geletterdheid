import React from 'react';
import { Target, BookOpen, Lightbulb, ChevronDown } from 'lucide-react';
import { AgentRole } from '../types';

interface MissionWelcomeCardProps {
    role: AgentRole;
}

const difficultyLabel: Record<string, { text: string; bg: string }> = {
    Easy: { text: 'Makkelijk', bg: 'bg-green-100 text-green-700' },
    Medium: { text: 'Gemiddeld', bg: 'bg-lab-gold text-lab-gold' },
    Hard: { text: 'Uitdagend', bg: 'bg-red-100 text-red-700' },
};

const MissionWelcomeCard: React.FC<MissionWelcomeCardProps> = ({ role }) => {
    const diff = difficultyLabel[role.difficulty] ?? difficultyLabel.Medium;
    const firstStep = role.steps?.[0];

    return (
        <div className="max-w-[92%] md:max-w-[80%] w-full animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-lab-muted bg-white">
                {/* ── Gradient Header ── */}
                <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{
                        background: `linear-gradient(135deg, ${role.color}, ${role.color}CC)`,
                    }}
                >
                    <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shrink-0">
                        {role.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                            Missie Briefing
                        </p>
                        <h2 className="text-lg font-bold text-white font-serif truncate">
                            {role.title}
                        </h2>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${diff.bg}`}>
                        {diff.text}
                    </span>
                </div>

                <div className="p-4 md:p-5 space-y-4">
                    {/* ── Scenario ── */}
                    <div
                        className="rounded-xl p-3.5 bg-lab-bg border-l-4"
                        style={{ borderLeftColor: role.color }}
                    >
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <BookOpen size={14} className="text-lab-textLight" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-lab-textLight">
                                De situatie
                            </span>
                        </div>
                        <p className="text-sm text-lab-text leading-relaxed">
                            {role.problemScenario}
                        </p>
                    </div>

                    {/* ── Objective ── */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-lab-muted px-3.5 py-3 border border-lab-muted">
                        <Target size={16} className="text-lab-primary mt-0.5 shrink-0" />
                        <p className="text-sm font-semibold text-lab-dark leading-snug">
                            {role.missionObjective}
                        </p>
                    </div>

                    {/* ── First Step ── */}
                    {firstStep && (
                        <div className="rounded-xl border-2 border-lab-muted p-3.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-lab-textLight mb-1">
                                Stap 1: {firstStep.title}
                            </p>
                            <p className="text-sm text-lab-text mb-2.5">
                                {firstStep.description}
                            </p>
                            <div className="flex items-start gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                                <Lightbulb size={14} className="text-green-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-green-700 italic">
                                    {firstStep.example}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── CTA ── */}
                    <div className="flex items-center justify-center gap-1.5 pt-1 pb-0.5">
                        <p className="text-xs text-lab-textLight font-medium">
                            Typ je eerste bericht om te beginnen
                        </p>
                        <ChevronDown size={14} className="text-lab-textLight animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionWelcomeCard;
