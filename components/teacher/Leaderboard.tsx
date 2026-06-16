import React, { useMemo } from 'react';
import { StudentData } from '../../types';

interface LeaderboardProps {
    students: StudentData[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
    const leaderboard = useMemo(() => {
        return [...students].sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0)).slice(0, 10);
    }, [students]);

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-lab-muted overflow-hidden p-4">
            <div className="grid gap-2">
                {leaderboard.map((student, index) => (
                    <div
                        key={student.uid}
                        className={`flex items-center gap-3 p-3 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-lab-gold' :
                            index === 1 ? 'bg-lab-muted border border-lab-muted' :
                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                    'bg-white border border-lab-muted'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${index === 0 ? 'bg-lab-gold text-lab-gold' :
                            index === 1 ? 'bg-lab-muted text-lab-muted' :
                                index === 2 ? 'bg-orange-400 text-orange-900' :
                                    'bg-lab-muted text-lab-muted'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-lab-muted text-sm">{student.displayName}</div>
                            <div className="text-[10px] text-lab-muted">{student.identifier}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-lab-muted">{student.stats?.xp || 0} XP</div>
                        </div>
                        {index < 3 && <div className="text-xl">{['🥇', '🥈', '🥉'][index]}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
