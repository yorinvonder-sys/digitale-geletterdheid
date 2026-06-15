import React from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import type { MissionGoal } from './types';

interface MissionGoalBannerProps {
    goal: MissionGoal | string;
    completed?: boolean;
    compact?: boolean;
    className?: string;
}

export const MissionGoalBanner: React.FC<MissionGoalBannerProps> = ({
    goal,
    completed = false,
    compact = false,
    className = '',
}) => {
    const primaryGoal = typeof goal === 'string' ? goal : goal.primaryGoal;
    const evidence = typeof goal === 'string' ? undefined : goal.evidence;

    return (
        <section
            className={`rounded-2xl border px-4 py-3 text-left ${
                completed
                    ? 'border-duck-ink/30 bg-duck-ink/10'
                    : 'border-duck-acid/40 bg-white'
            } ${className}`}
            aria-label="/goal"
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl ${
                        completed ? 'bg-duck-ink text-white' : 'bg-duck-acid/25 text-duck-ink'
                    }`}
                >
                    {completed ? <CheckCircle2 size={16} /> : <Target size={16} />}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-duck-coral">
                        /goal
                    </p>
                    <p className={`font-bold leading-snug text-duck-ink ${compact ? 'text-sm' : 'text-base'}`}>
                        {primaryGoal}
                    </p>
                    {evidence && !compact && (
                        <p className="mt-1 text-xs leading-relaxed text-duck-muted">
                            Bewijs: {evidence}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
