import React, { useMemo } from 'react';
import { ChevronRight, Clock, AlertTriangle, Target } from 'lucide-react';
import { StudentData } from '@/types';
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
        <div className="bg-white rounded-2xl shadow-sm border border-duck-ink/15 overflow-hidden p-5 space-y-4">
            {curriculumAlerts.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-duck-acid uppercase tracking-widest mb-3 flex items-center gap-2">
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
                                    panel: 'bg-duck-acid hover:bg-duck-acid hover:text-duck-ink border-duck-acid',
                                    text: 'text-duck-acid',
                                    chip: 'bg-white text-duck-acid border-duck-acid',
                                }
                                : {
                                    panel: 'bg-duck-acid hover:bg-duck-acid hover:text-duck-ink border-duck-acid',
                                    text: 'text-duck-acid',
                                    chip: 'bg-white text-duck-acid border-duck-acid',
                                };

                            return (
                                <div
                                    key={signal.id}
                                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-colors text-left ${toneClasses.panel}`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="font-bold text-duck-ink text-xs">{signal.title}</div>
                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${toneClasses.chip}`}>
                                                J{progress.spotlight.yearGroup} • {progress.spotlight.periodLabel}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-duck-ink/60 mt-1">{progress.spotlight.title}</div>
                                        <div className={`text-[10px] mt-2 ${toneClasses.text}`}>{signal.summary}</div>
                                        <div className="mt-2 text-[10px] text-duck-ink/60">
                                            Nudge: {signal.nudge}
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="text-[9px] font-bold text-duck-ink/60 bg-white/80 px-2 py-1 rounded-lg border border-white">
                                                Gestart {progress.startedStudents}
                                            </span>
                                            <span className="text-[9px] font-bold text-duck-ink/60 bg-white/80 px-2 py-1 rounded-lg border border-white">
                                                Nog bezig {progress.inProgressStudents}
                                            </span>
                                            <span className="text-[9px] font-bold text-duck-ink/60 bg-white/80 px-2 py-1 rounded-lg border border-white">
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
                                                    className="inline-flex items-center gap-1 rounded-lg bg-duck-ink px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:bg-duck-ink transition-colors"
                                                >
                                                    Herinner {suggestedClassId}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onNavigateToSlo?.();
                                                }}
                                                className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wider text-duck-ink/60 border border-duck-ink/15 hover:bg-duck-bg transition-colors"
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
                    <h3 className="text-xs font-black text-duck-acid uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertTriangle size={12} />
                        Weinig Voortgang ({lowXPStudents.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {lowXPStudents.map(student => (
                            <button
                                key={student.uid}
                                onClick={() => onSelectStudent(student)}
                                className="flex items-center justify-between p-3 bg-duck-acid hover:bg-duck-acid hover:text-duck-ink rounded-xl border border-duck-acid transition-colors text-left"
                            >
                                <div className="min-w-0">
                                    <div className="font-bold text-duck-ink text-xs truncate">{student.displayName}</div>
                                    <div className="text-[10px] text-duck-acid">{student.stats?.xp || 0} XP — {student.stats?.missionsCompleted?.length || 0} missies</div>
                                </div>
                                <ChevronRight size={14} className="text-duck-acid flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {inactiveStudents.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-3 flex items-center gap-2">
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
                                    className="flex items-center justify-between p-3 bg-duck-bg hover:bg-duck-bg rounded-xl border border-duck-ink/15 transition-colors text-left"
                                >
                                    <div className="min-w-0">
                                        <div className="font-bold text-duck-ink text-xs truncate">{student.displayName}</div>
                                        <div className="text-[10px] text-duck-ink/60">{daysAgo}d geleden — {student.stats?.xp || 0} XP</div>
                                    </div>
                                    <ChevronRight size={14} className="text-duck-ink/60 flex-shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
