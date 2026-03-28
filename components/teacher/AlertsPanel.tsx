import React from 'react';
import { ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { StudentData } from '../../types';

interface AlertsPanelProps {
    students: StudentData[];
    onSelectStudent: (student: StudentData) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ students, onSelectStudent }) => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    const lowXPStudents = students.filter(s => (s.stats?.xp || 0) < 50);
    const inactiveStudents = students.filter(s => {
        const lastActive = s.lastActive?.toDate?.()?.getTime() || 0;
        return now - lastActive > oneWeek && (s.stats?.xp || 0) >= 50;
    });

    if (lowXPStudents.length === 0 && inactiveStudents.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-5 space-y-4">
            {lowXPStudents.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertTriangle size={12} />
                        Weinig Voortgang ({lowXPStudents.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {lowXPStudents.map(student => (
                            <button
                                key={student.uid}
                                onClick={() => onSelectStudent(student)}
                                className="flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-100 transition-colors text-left"
                            >
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-900 text-xs truncate">{student.displayName}</div>
                                    <div className="text-[10px] text-amber-600">{student.stats?.xp || 0} XP — {student.stats?.missionsCompleted?.length || 0} missies</div>
                                </div>
                                <ChevronRight size={14} className="text-amber-300 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {inactiveStudents.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock size={12} />
                        Lang Inactief ({inactiveStudents.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {inactiveStudents.map(student => {
                            const lastActive = student.lastActive?.toDate?.();
                            const daysAgo = lastActive ? Math.floor((now - lastActive.getTime()) / (24 * 60 * 60 * 1000)) : 0;
                            return (
                                <button
                                    key={student.uid}
                                    onClick={() => onSelectStudent(student)}
                                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors text-left"
                                >
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-900 text-xs truncate">{student.displayName}</div>
                                        <div className="text-[10px] text-slate-500">{daysAgo}d geleden — {student.stats?.xp || 0} XP</div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
