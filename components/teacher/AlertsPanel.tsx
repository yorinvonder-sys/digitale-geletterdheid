import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StudentData } from '../../types';

interface AlertsPanelProps {
    students: StudentData[];
    onSelectStudent: (student: StudentData) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ students, onSelectStudent }) => {
    const lowXPStudents = students.filter(s => (s.stats?.xp || 0) < 50);

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6">
            <div>
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Weinig Voortgang ({lowXPStudents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lowXPStudents.map(student => (
                        <button
                            key={student.uid}
                            onClick={() => onSelectStudent(student)}
                            className="flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-100 transition-colors text-left"
                        >
                            <div>
                                <div className="font-bold text-slate-900 text-xs">{student.displayName}</div>
                                <div className="text-[10px] text-amber-600">Minder dan 50 XP</div>
                            </div>
                            <ChevronRight size={14} className="text-amber-300" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
