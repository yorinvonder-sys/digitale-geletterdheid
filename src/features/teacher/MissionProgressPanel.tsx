import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight, CheckCircle2, Clock, AlertTriangle, BarChart3, X } from 'lucide-react';
import { StudentData } from '@/types';
import { getMissionsForYear } from '@/config/missions';

interface MissionProgressPanelProps {
    students: StudentData[];
    classFilter: string;
    availableClasses: string[];
    onClassFilterChange: (cls: string) => void;
    onSelectStudent?: (student: StudentData) => void;
    yearGroup?: number;
}

interface MissionStats {
    missionId: string;
    missionName: string;
    missionShort: string;
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
    percentage: number;
    studentsCompleted: StudentData[];
    studentsInProgress: StudentData[];
    studentsNotStarted: StudentData[];
}

export const MissionProgressPanel: React.FC<MissionProgressPanelProps> = ({
    students,
    classFilter,
    availableClasses,
    onClassFilterChange,
    onSelectStudent,
    yearGroup = 1
}) => {
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    const [expandedMission, setExpandedMission] = useState<string | null>(null);
    const [showStudentList, setShowStudentList] = useState<{ mission: string; type: 'completed' | 'inProgress' | 'notStarted' } | null>(null);

    // Filter students by class
    const filteredStudents = useMemo(() => {
        if (classFilter === 'all') return students;
        return students.filter(s =>
            s.studentClass === classFilter ||
            s.stats?.studentClass === classFilter ||
            s.identifier?.startsWith(classFilter)
        );
    }, [students, classFilter]);

    // Calculate mission stats
    const missionStats: MissionStats[] = useMemo(() => {
        return yearMissions.map(mission => {
            const completed = filteredStudents.filter(s =>
                s.stats?.missionsCompleted?.includes(mission.id)
            );

            const inProgress = filteredStudents.filter(s =>
                !s.stats?.missionsCompleted?.includes(mission.id) &&
                s.stats?.missionProgress?.[mission.id]
            );

            const notStarted = filteredStudents.filter(s =>
                !s.stats?.missionsCompleted?.includes(mission.id) &&
                !s.stats?.missionProgress?.[mission.id]
            );

            const total = filteredStudents.length;
            const percentage = total > 0 ? Math.round((completed.length / total) * 100) : 0;

            return {
                missionId: mission.id,
                missionName: mission.name,
                missionShort: mission.short,
                completed: completed.length,
                inProgress: inProgress.length,
                notStarted: notStarted.length,
                total,
                percentage,
                studentsCompleted: completed,
                studentsInProgress: inProgress,
                studentsNotStarted: notStarted
            };
        });
    }, [filteredStudents, yearMissions]);

    // Overall class progress (only count missions belonging to the selected year)
    const overallProgress = useMemo(() => {
        const yearMissionIds = new Set(yearMissions.map(m => m.id));
        const totalMissions = yearMissions.length * filteredStudents.length;
        const completedMissions = filteredStudents.reduce((sum, s) =>
            sum + (s.stats?.missionsCompleted?.filter(id => yearMissionIds.has(id)).length || 0), 0
        );
        return totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    }, [filteredStudents, yearMissions]);

    const getProgressColor = (percentage: number) => {
        if (percentage >= 70) return 'bg-duck-ink';
        if (percentage >= 30) return 'bg-duck-acid';
        return 'bg-duck-error';
    };

    const getProgressTextColor = (percentage: number) => {
        if (percentage >= 70) return 'text-duck-ink';
        if (percentage >= 30) return 'text-duck-ink/60';
        return 'text-duck-error';
    };

    const currentList = showStudentList ?
        missionStats.find(m => m.missionId === showStudentList.mission)?.[
        showStudentList.type === 'completed' ? 'studentsCompleted' :
            showStudentList.type === 'inProgress' ? 'studentsInProgress' : 'studentsNotStarted'
        ] || [] : [];

    return (
        <div className="space-y-6">
            {/* Header with Class Selector */}
            <div className="overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bgLight shadow-sm">
                <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-xl border border-duck-ink/15 bg-duck-bg text-duck-ink">
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-duck-ink text-balance">Missie Voortgang</h2>
                            <p className="text-sm font-medium text-duck-ink/60 text-pretty">Bekijk de voortgang per missie in compacte tegels</p>
                        </div>
                    </div>

                    {/* Class Selector */}
                    <div className="flex min-h-[44px] items-center gap-3 rounded-xl border border-duck-ink/15 bg-duck-bg px-3 text-duck-ink/60">
                        <Users size={18} className="text-duck-ink" />
                        <select
                            value={classFilter}
                            onChange={(e) => onClassFilterChange(e.target.value)}
                            className="min-h-[44px] cursor-pointer bg-transparent py-2 text-sm font-bold text-duck-ink focus:outline-none focus:ring-2 focus:ring-duck-ink/15"
                        >
                            <option value="all">Alle klassen</option>
                            {availableClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Overall Progress Ring */}
                <div className="grid gap-3 border-t border-duck-ink/15 bg-duck-bg px-5 py-4 sm:grid-cols-3 md:px-6">
                    <div className="flex items-center gap-4">
                        <div className="relative size-16">
                            <svg className="h-full w-full -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="25"
                                    className="stroke-duck-ink/15"
                                    strokeWidth="6"
                                    fill="none"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="25"
                                    className="stroke-duck-ink transition-all duration-200"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${overallProgress * 1.57} 157`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-black text-duck-ink tabular-nums">{overallProgress}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase text-duck-ink/60">Klasvoortgang</div>
                            <div className="text-xl font-black text-duck-ink tabular-nums">{overallProgress}%</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-duck-ink/15 bg-duck-bgLight px-4 py-3">
                        <div className="text-xs font-black uppercase text-duck-ink/60">Leerlingen</div>
                        <div className="text-xl font-black text-duck-ink tabular-nums">{filteredStudents.length}</div>
                        <div className="text-xs font-medium text-duck-ink/60 truncate">
                            {classFilter === 'all' ? 'totaal' : `in ${classFilter}`}
                        </div>
                    </div>
                    <div className="rounded-xl border border-duck-ink/15 bg-duck-bgLight px-4 py-3">
                        <div className="text-xs font-black uppercase text-duck-ink/60">Missies</div>
                        <div className="text-xl font-black text-duck-ink tabular-nums">{yearMissions.length}</div>
                        <div className="text-xs font-medium text-duck-ink/60">in leerjaar {yearGroup}</div>
                    </div>
                </div>
            </div>

            {/* Mission Progress Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {missionStats.map((mission) => (
                    <motion.div
                        key={mission.missionId}
                        layout
                        className="overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bgLight shadow-sm transition-shadow hover:shadow-md"
                    >
                        {/* Main Row */}
                        <button
                            type="button"
                            className="block min-h-[228px] w-full cursor-pointer p-4 text-left"
                            onClick={() => setExpandedMission(
                                expandedMission === mission.missionId ? null : mission.missionId
                            )}
                            aria-expanded={expandedMission === mission.missionId}
                        >
                            <div className="flex h-full flex-col gap-4">
                                {/* Mission Icon */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className={`flex size-12 items-center justify-center rounded-xl ${getProgressColor(mission.percentage)} text-base font-black text-white shadow-sm`}>
                                        {mission.missionShort}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-black tabular-nums ${getProgressTextColor(mission.percentage)}`}>
                                            {mission.percentage}%
                                        </span>
                                        <motion.div
                                            animate={{ rotate: expandedMission === mission.missionId ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-duck-ink/60"
                                        >
                                            <ChevronRight size={18} />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Mission Info */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-black leading-tight text-duck-ink text-balance">{mission.missionName}</h3>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-duck-bg">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${mission.percentage}%` }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${getProgressColor(mission.percentage)}`}
                                        />
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                                    <span className="flex min-w-0 items-center gap-1 rounded-lg bg-duck-ink/10 px-2 py-2 text-duck-ink">
                                        <CheckCircle2 size={12} className="shrink-0" />
                                        <span className="truncate tabular-nums">{mission.completed}</span>
                                    </span>
                                    <span className="flex min-w-0 items-center gap-1 rounded-lg bg-duck-acid/20 px-2 py-2 text-duck-ink/60">
                                        <Clock size={12} className="shrink-0" />
                                        <span className="truncate tabular-nums">{mission.inProgress}</span>
                                    </span>
                                    <span className="flex min-w-0 items-center gap-1 rounded-lg bg-duck-bg px-2 py-2 text-duck-ink/60">
                                        <AlertTriangle size={12} className="shrink-0" />
                                        <span className="truncate tabular-nums">{mission.notStarted}</span>
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                            {expandedMission === mission.missionId && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-duck-ink/15 bg-duck-bg"
                                >
                                    <div className="grid grid-cols-3 gap-2 p-3">
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'completed' })}
                                            className="min-h-[44px] rounded-lg border border-duck-ink/20 bg-duck-bgLight p-2 text-center transition-colors hover:bg-duck-ink/10"
                                        >
                                            <div className="text-lg font-black text-duck-ink tabular-nums">{mission.completed}</div>
                                            <div className="text-[11px] font-bold text-duck-ink/60">Voltooid</div>
                                        </button>
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'inProgress' })}
                                            className="min-h-[44px] rounded-lg border border-duck-acid/30 bg-duck-bgLight p-2 text-center transition-colors hover:bg-duck-acid/20"
                                        >
                                            <div className="text-lg font-black text-duck-ink/60 tabular-nums">{mission.inProgress}</div>
                                            <div className="text-[11px] font-bold text-duck-ink/60">Bezig</div>
                                        </button>
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'notStarted' })}
                                            className="min-h-[44px] rounded-lg border border-duck-ink/15 bg-duck-bgLight p-2 text-center transition-colors hover:bg-duck-bg"
                                        >
                                            <div className="text-lg font-black text-duck-ink tabular-nums">{mission.notStarted}</div>
                                            <div className="text-[11px] font-bold text-duck-ink/60">Niet gestart</div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Student List Modal */}
            <AnimatePresence>
                {showStudentList && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-duck-ink/50 p-4"
                        onClick={() => setShowStudentList(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bgLight shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-duck-ink/15 p-4">
                                <div>
                                    <h3 className="font-bold text-duck-ink">
                                        {missionStats.find(m => m.missionId === showStudentList.mission)?.missionName}
                                    </h3>
                                    <p className="text-xs text-duck-ink/60">
                                        {showStudentList.type === 'completed' && 'Leerlingen die deze missie hebben voltooid'}
                                        {showStudentList.type === 'inProgress' && 'Leerlingen die bezig zijn met deze missie'}
                                        {showStudentList.type === 'notStarted' && 'Leerlingen die deze missie nog moeten starten'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowStudentList(null)}
                                    className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-duck-ink/60 hover:bg-duck-bg"
                                    aria-label="Leerlingenlijst sluiten"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[50vh]">
                                {currentList.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-duck-ink/60">
                                        Geen leerlingen in deze categorie
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {currentList.map(student => (
                                            <button
                                                key={student.uid}
                                                onClick={() => {
                                                    onSelectStudent?.(student);
                                                    setShowStudentList(null);
                                                }}
                                                className="flex min-h-[44px] w-full items-center justify-between rounded-xl bg-duck-bg p-3 text-left transition-colors hover:bg-duck-bg"
                                            >
                                                <div className="min-w-0">
                                                    <div className="truncate font-bold text-duck-ink">{student.displayName}</div>
                                                    <div className="truncate text-xs text-duck-ink/60">{student.identifier}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-lg bg-duck-acid/20 px-2 py-1 text-xs font-bold text-duck-ink tabular-nums">
                                                        {student.stats?.xp || 0} XP
                                                    </span>
                                                    <ChevronRight size={16} className="text-duck-ink/60" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
