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
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-4">
            <div className="grid gap-2">
                {leaderboard.map((student, index) => (
                    <div
                        key={student.uid}
                        className={`flex items-center gap-3 p-3 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200' :
                            index === 1 ? 'bg-slate-50 border border-slate-200' :
                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                    'bg-white border border-slate-100'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-slate-300 text-slate-700' :
                                index === 2 ? 'bg-orange-400 text-orange-900' :
                                    'bg-slate-100 text-slate-500'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900 text-sm">{student.displayName}</div>
                            <div className="text-[10px] text-slate-400">{student.identifier}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-slate-900">{student.stats?.xp || 0} XP</div>
                        </div>
                        {index < 3 && <div className="text-xl">{['🥇', '🥈', '🥉'][index]}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
