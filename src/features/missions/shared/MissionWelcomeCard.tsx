import React from 'react';
import { Target, BookOpen, Lightbulb, ChevronDown } from 'lucide-react';
import { AgentRole } from '@/types';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from '@/features/missions/templates/shared/MissionGoalBanner';

interface MissionWelcomeCardProps {
    role: AgentRole;
}

const difficultyLabel: Record<string, { text: string; bg: string }> = {
    Easy: { text: 'Makkelijk', bg: 'bg-duck-ink/10 text-duck-ink' },
    Medium: { text: 'Gemiddeld', bg: 'bg-duck-acid text-duck-ink' },
    Hard: { text: 'Uitdagend', bg: 'bg-duck-acid text-duck-ink' },
};

const MissionWelcomeCard: React.FC<MissionWelcomeCardProps> = ({ role }) => {
    const diff = difficultyLabel[role.difficulty] ?? difficultyLabel.Medium;
    const firstStep = role.steps?.[0];
    const isGameProgrammer = role.id === 'game-programmeur';
    const isCompactBriefing = isGameProgrammer || role.id === 'ai-trainer';
    const missionGoal = getMissionGoal(role.id);

    return (
        <div className={`${isCompactBriefing ? 'max-w-[96%] md:max-w-[92%]' : 'max-w-[92%] md:max-w-[80%]'} w-full animate-fade-in-up`}>
            <div className="rounded-[1.6rem] overflow-hidden shadow-lg border border-duck-ink/15 bg-white">
                {/* ── Gradient Header ── */}
                <div
                    className={`${isCompactBriefing ? 'px-4 py-3' : 'px-5 py-4'} flex items-center gap-3`}
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
                        <h2 className={`${isCompactBriefing ? 'text-base' : 'text-lg'} font-bold text-white font-serif truncate`}>
                            {role.title}
                        </h2>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${diff.bg}`}>
                        {diff.text}
                    </span>
                </div>

                <div className={`${isCompactBriefing ? 'p-3 md:p-4 space-y-3' : 'p-4 md:p-5 space-y-4'}`}>
                    {/* ── Scenario ── */}
                    <div
                        className={`${isCompactBriefing ? 'rounded-xl p-3' : 'rounded-xl p-3.5'} bg-duck-bg border-l-4`}
                        style={{ borderLeftColor: role.color }}
                    >
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <BookOpen size={14} className="text-duck-ink/60" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">
                                De situatie
                            </span>
                        </div>
                        <p className={`${isCompactBriefing ? 'text-[13px] leading-snug' : 'text-sm leading-relaxed'} text-duck-ink`}>
                            {role.problemScenario}
                        </p>
                    </div>

                    {/* ── Objective ── */}
                    <div className={`${isCompactBriefing ? 'px-3 py-2.5' : 'px-3.5 py-3'} flex items-start gap-2.5 rounded-xl bg-duck-bg border border-duck-ink/15`}>
                        <Target size={16} className="mt-0.5 shrink-0" style={{ color: role.color }} />
                        <p className={`${isCompactBriefing ? 'text-[13px]' : 'text-sm'} font-semibold text-duck-ink leading-snug`}>
                            {role.missionObjective}
                        </p>
                    </div>

                    {missionGoal && (
                        <MissionGoalBanner goal={missionGoal} compact />
                    )}

                    {/* ── First Step ── */}
                    {firstStep && (
                        <div className={`${isCompactBriefing ? 'p-3' : 'p-3.5'} rounded-xl border-2 border-duck-ink/15`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60 mb-1">
                                Stap 1: {firstStep.title}
                            </p>
                            <p className={`${isCompactBriefing ? 'text-[13px] mb-2' : 'text-sm mb-2.5'} text-duck-ink`}>
                                {firstStep.description}
                            </p>
                            <div
                                className="flex items-start gap-2 rounded-lg px-3 py-2"
                                style={{ backgroundColor: role.color, border: `1px solid ${role.color}` }}
                            >
                                <Lightbulb size={14} className="mt-0.5 shrink-0 text-white" />
                                <p className="text-xs italic text-white">
                                    {firstStep.example}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── CTA ── */}
                    <div className="flex items-center justify-center gap-1.5 pt-1 pb-0.5">
                        <p className="text-xs text-duck-ink/60 font-medium">
                            Typ je eerste bericht om te beginnen
                        </p>
                        <ChevronDown size={14} className="text-duck-ink/60 animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionWelcomeCard;
