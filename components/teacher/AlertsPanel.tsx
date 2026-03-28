import React, { useMemo } from 'react';
import { ChevronRight, Clock, AlertTriangle, Target } from 'lucide-react';
import { StudentData } from '../../types';
import { buildSpotlightProgress, filterSpotlightsByYear, getActionableSpotlightSignals } from './spotlightSignals';

interface AlertsPanelProps {
    students: StudentData[];
    onSelectStudent: (student: StudentData) => void;
    yearGroup?: number;
    onNavigateToSlo?: () => void;
    onMessageClass?: (classId: string, messageText: string) => void;
    classFilter?: string;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ students, onSelectStudent, yearGroup = 1, onNavigateToSlo, onMessageClass, classFilter = 'all' }) => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    const lowXPStudents = students.filter(s => (s.stats?.xp || 0) < 50);
    const inactiveStudents = students.filter(s => {
        const lastActive = s.lastActive?.toDate?.()?.getTime() || 0;
        return now - lastActive > oneWeek && (s.stats?.xp || 0) >= 50;
    });

    const curriculumAlerts = useMemo(
        () => getActionableSpotlightSignals(buildSpotlightProgress(filterSpotlightsByYear(yearGroup), students)),
        [students, yearGroup]
    );

    if (lowXPStudents.length === 0 && inactiveStudents.length === 0 && curriculumAlerts.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-5 space-y-4">
            {curriculumAlerts.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Target size={12} />
                        Curriculum Signalen ({curriculumAlerts.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {curriculumAlerts.map(({ progress, signal }) => {
                            const suggestedClassId = signal.targetClasses.length === 1
                                ? signal.targetClasses[0]
                                : classFilter !== 'all' && signal.targetClasses.includes(classFilter)
                                    ? classFilter
                                    : signal.targetClasses[0];
                            const toneClasses = signal.tone === 'attention'
                                ? {
                                    panel: 'bg-amber-50 hover:bg-amber-100 border-amber-100',
                                    text: 'text-amber-700',
                                    chip: 'bg-white text-amber-700 border-amber-200',
                                }
                                : {
                                    panel: 'bg-rose-50 hover:bg-rose-100 border-rose-100',
                                    text: 'text-rose-700',
                                    chip: 'bg-white text-rose-700 border-rose-200',
                                };

                            return (
                                <div
                                    key={signal.id}
                                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-colors text-left ${toneClasses.panel}`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="font-bold text-slate-900 text-xs">{signal.title}</div>
                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${toneClasses.chip}`}>
                                                J{progress.spotlight.yearGroup} • {progress.spotlight.periodLabel}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1">{progress.spotlight.title}</div>
                                        <div className={`text-[10px] mt-2 ${toneClasses.text}`}>{signal.summary}</div>
                                        <div className="mt-2 text-[10px] text-slate-600">
                                            Nudge: {signal.nudge}
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-white">
                                                Gestart {progress.startedStudents}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-white">
                                                Nog bezig {progress.inProgressStudents}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-white">
                                                Afgerond {progress.completedStudents}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {onMessageClass && suggestedClassId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onMessageClass(suggestedClassId, signal.studentMessage);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:bg-slate-800 transition-colors"
                                                >
                                                    Herinner {suggestedClassId}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onNavigateToSlo?.();
                                                }}
                                                className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                                            >
                                                Bekijk detail
                                            </button>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className={`flex-shrink-0 ${toneClasses.text}`} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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
