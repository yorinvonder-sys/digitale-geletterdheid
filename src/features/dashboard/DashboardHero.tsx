import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Flame } from 'lucide-react';
import type { Mission } from '@/utils/missionBuilder';
import { DuckMascot } from '@/components/brand/DuckMascot';

interface DashboardHeroProps {
    userDisplayName: string;
    dailyStreak: number;
    level: number;
    progressPercentage: number;
    xpToNext: number;
    featuredMission?: Mission;
    canOpenFeaturedMission: boolean;
    allMissionsDone: boolean;
    onSelectModule: (moduleId: string) => void;
}

function getTimeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
    userDisplayName,
    dailyStreak,
    level,
    progressPercentage,
    xpToNext,
    featuredMission,
    canOpenFeaturedMission,
    allMissionsDone,
    onSelectModule,
}) => {
    const greeting = getTimeGreeting();
    const name = userDisplayName || 'Mila';

    return (
        <section className="mb-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="font-display text-2xl font-black leading-tight text-duck-ink md:text-3xl">
                        {greeting} {name}!
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        {dailyStreak > 0 && (
                            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black
                                ${dailyStreak >= 7 ? 'bg-[#D97848] text-white shadow-lg shadow-[#D97848]/25' :
                                  dailyStreak >= 3 ? 'bg-[#D97848]/10 text-[#D97848]' :
                                  'bg-duck-ink/10 text-duck-ink/65'}`}
                            >
                                <Flame size={16} className={dailyStreak >= 7 ? 'animate-pulse' : ''} />
                                <span>{dailyStreak}</span>
                                <span className="text-xs font-bold opacity-70">
                                    {dailyStreak === 1 ? 'dag' : 'dagen'}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wide text-duck-ink/65">
                                Lvl {level}
                            </span>
                            <div className="h-2.5 w-24 overflow-hidden rounded-full border border-duck-ink/10 bg-duck-ink/10 p-px sm:w-32">
                                <div
                                    className="h-full rounded-full bg-duck-acid ring-1 ring-duck-ink/15 transition-all duration-700"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-duck-ink/65">{xpToNext} XP</span>
                        </div>
                    </div>
                </div>

                <DuckMascot className="hidden h-14 w-14 shrink-0 sm:block" />
            </div>

            {!allMissionsDone && featuredMission ? (
                <motion.div
                    className="mt-4 flex items-center gap-4 rounded-[1.5rem] border border-duck-ink/10 bg-white p-4 shadow-duck-soft"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-duck-ink/10 bg-duck-bg text-duck-ink"
                    >
                        {React.isValidElement(featuredMission.icon)
                            ? React.cloneElement(featuredMission.icon as React.ReactElement<{ size?: number }>, { size: 22 })
                            : featuredMission.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-duck-ink/65">Volgende missie</p>
                        <p className="truncate font-black text-duck-ink">{featuredMission.title}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => canOpenFeaturedMission && onSelectModule(featuredMission.id)}
                        disabled={!canOpenFeaturedMission}
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-duck-ink bg-duck-acid px-5 text-sm font-black text-duck-ink transition-all hover:-translate-y-0.5 disabled:bg-duck-ink/10 disabled:text-duck-ink/65 disabled:border-duck-ink/10"
                    >
                        Ga verder <ChevronRight size={16} />
                    </button>
                </motion.div>
            ) : allMissionsDone ? (
                <motion.div
                    className="mt-4 flex items-center gap-4 rounded-[1.5rem] border border-duck-ink/10 bg-white p-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <DuckMascot className="h-16 w-16 shrink-0" />
                    <div>
                        <p className="font-black text-duck-ink">Alle missies gedaan — lekker bezig!</p>
                        <p className="text-sm text-duck-ink/65">Je docent opent binnenkort nieuwe missies.</p>
                    </div>
                </motion.div>
            ) : null}
        </section>
    );
};
