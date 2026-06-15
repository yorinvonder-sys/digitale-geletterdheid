import React, { useMemo } from 'react';
import { StudentData } from '@/types';

interface LeaderboardProps {
    students: StudentData[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
    const leaderboard = useMemo(() => {
        return [...students].sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0)).slice(0, 10);
    }, [students]);

    return (
        <div className="bg-white rounded-[2rem] shadow-duck-soft border border-duck-ink/15 overflow-hidden p-4">
            <div className="grid gap-2">
                {leaderboard.map((student, index) => (
                    <div
                        key={student.uid}
                        className={`flex items-center gap-3 p-3 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-duck-acid to-duck-acid border-2 border-duck-acid' :
                            index === 1 ? 'bg-duck-bg border border-duck-ink/15' :
                                index === 2 ? 'bg-duck-acid border border-duck-acid' :
                                    'bg-white border border-duck-ink/15'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${index === 0 ? 'bg-duck-acid text-duck-ink' :
                            index === 1 ? 'bg-duck-bg text-duck-ink/60' :
                                index === 2 ? 'bg-duck-acid text-duck-ink' :
                                    'bg-duck-bg text-duck-ink/60'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-duck-ink text-sm">{student.displayName}</div>
                            <div className="text-[10px] text-duck-ink/60">{student.identifier}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-duck-ink">{student.stats?.xp || 0} XP</div>
                        </div>
                        {index < 3 && <div className="text-xl">{['🥇', '🥈', '🥉'][index]}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
