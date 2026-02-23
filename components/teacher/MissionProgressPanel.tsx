import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, ChevronRight, CheckCircle2, Clock, AlertTriangle, BarChart3, X } from 'lucide-react';
import { StudentData } from '../../types';
import { ALL_MISSIONS } from '../../config/missions';

interface MissionProgressPanelProps {
    students: StudentData[];
    classFilter: string;
    availableClasses: string[];
    onClassFilterChange: (cls: string) => void;
    onSelectStudent?: (student: StudentData) => void;
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
    onSelectStudent
}) => {
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
        return ALL_MISSIONS.map(mission => {
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
    }, [filteredStudents]);

    // Overall class progress
    const overallProgress = useMemo(() => {
        const totalMissions = ALL_MISSIONS.length * filteredStudents.length;
        const completedMissions = filteredStudents.reduce((sum, s) =>
            sum + (s.stats?.missionsCompleted?.length || 0), 0
        );
        return totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    }, [filteredStudents]);

    const getProgressColor = (percentage: number) => {
        if (percentage >= 70) return 'bg-emerald-500';
        if (percentage >= 30) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getProgressBgColor = (percentage: number) => {
        if (percentage >= 70) return 'bg-emerald-50';
        if (percentage >= 30) return 'bg-amber-50';
        return 'bg-red-50';
    };

    const getProgressTextColor = (percentage: number) => {
        if (percentage >= 70) return 'text-emerald-600';
        if (percentage >= 30) return 'text-amber-600';
        return 'text-red-600';
    };

    const currentList = showStudentList ?
        missionStats.find(m => m.missionId === showStudentList.mission)?.[
        showStudentList.type === 'completed' ? 'studentsCompleted' :
            showStudentList.type === 'inProgress' ? 'studentsInProgress' : 'studentsNotStarted'
        ] || [] : [];

    return (
        <div className="space-y-6">
            {/* Header with Class Selector */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-6 md:p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Missie Voortgang</h2>
                            <p className="text-white/80">Bekijk de voortgang per missie</p>
                        </div>
                    </div>

                    {/* Class Selector */}
                    <div className="flex items-center gap-3">
                        <Users size={18} className="text-white/60" />
                        <select
                            value={classFilter}
                            onChange={(e) => onClassFilterChange(e.target.value)}
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                        >
                            <option value="all" className="text-slate-900">Alle klassen</option>
                            {availableClasses.map(cls => (
                                <option key={cls} value={cls} className="text-slate-900">{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Overall Progress Ring */}
                <div className="mt-6 flex items-center gap-6">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="white"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${overallProgress * 2.51} 251`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black">{overallProgress}%</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black">{filteredStudents.length}</div>
                        <div className="text-white/70 text-sm font-medium">
                            {classFilter === 'all' ? 'leerlingen totaal' : `leerlingen in ${classFilter}`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Progress Cards */}
            <div className="grid gap-4">
                {missionStats.map((mission) => (
                    <motion.div
                        key={mission.missionId}
                        layout
                        className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md ${getProgressBgColor(mission.percentage)}`}
                    >
                        {/* Main Row */}
                        <div
                            className="p-5 cursor-pointer"
                            onClick={() => setExpandedMission(
                                expandedMission === mission.missionId ? null : mission.missionId
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {/* Mission Icon */}
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getProgressColor(mission.percentage)} text-white font-black text-lg shadow-lg`}>
                                    {mission.missionShort}
                                </div>

                                {/* Mission Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-900 truncate">{mission.missionName}</h3>
                                        <span className={`text-2xl font-black ${getProgressTextColor(mission.percentage)}`}>
                                            {mission.percentage}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${mission.percentage}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full ${getProgressColor(mission.percentage)} rounded-full`}
                                        />
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex items-center gap-4 mt-2 text-xs font-medium">
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <CheckCircle2 size={12} />
                                            {mission.completed} voltooid
                                        </span>
                                        <span className="flex items-center gap-1 text-amber-600">
                                            <Clock size={12} />
                                            {mission.inProgress} bezig
                                        </span>
                                        <span className="flex items-center gap-1 text-slate-400">
                                            <AlertTriangle size={12} />
                                            {mission.notStarted} niet gestart
                                        </span>
                                    </div>
                                </div>

                                {/* Expand Arrow */}
                                <motion.div
                                    animate={{ rotate: expandedMission === mission.missionId ? 90 : 0 }}
                                    className="text-slate-400"
                                >
                                    <ChevronRight size={20} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                            {expandedMission === mission.missionId && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-slate-100"
                                >
                                    <div className="p-4 grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'completed' })}
                                            className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-center transition-colors"
                                        >
                                            <div className="text-2xl font-black text-emerald-600">{mission.completed}</div>
                                            <div className="text-xs font-bold text-emerald-500 uppercase">Voltooid</div>
                                        </button>
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'inProgress' })}
                                            className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition-colors"
                                        >
                                            <div className="text-2xl font-black text-amber-600">{mission.inProgress}</div>
                                            <div className="text-xs font-bold text-amber-500 uppercase">Bezig</div>
                                        </button>
                                        <button
                                            onClick={() => setShowStudentList({ mission: mission.missionId, type: 'notStarted' })}
                                            className="p-4 bg-red-50 hover:bg-red-100 rounded-xl text-center transition-colors"
                                        >
                                            <div className="text-2xl font-black text-red-600">{mission.notStarted}</div>
                                            <div className="text-xs font-bold text-red-500 uppercase">Niet gestart</div>
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
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowStudentList(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {missionStats.find(m => m.missionId === showStudentList.mission)?.missionName}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {showStudentList.type === 'completed' && 'Leerlingen die deze missie hebben voltooid'}
                                        {showStudentList.type === 'inProgress' && 'Leerlingen die bezig zijn met deze missie'}
                                        {showStudentList.type === 'notStarted' && 'Leerlingen die deze missie nog moeten starten'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowStudentList(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg"
                                >
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[50vh]">
                                {currentList.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400">
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
                                                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
                                            >
                                                <div>
                                                    <div className="font-bold text-slate-900">{student.displayName}</div>
                                                    <div className="text-xs text-slate-400">{student.identifier}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                                        {student.stats?.xp || 0} XP
                                                    </span>
                                                    <ChevronRight size={16} className="text-slate-300" />
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
