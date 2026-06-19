import { Search, Filter, GraduationCap, ChevronRight, KeyRound, RotateCcw, Radio, Focus, Clock, BookOpen } from 'lucide-react';
import { StudentData, ClassroomConfig } from '@/types';
import { getMissionsForYear } from '@/config/missions';
import { AVAILABLE_BADGES } from '@/config/badges';
import { TableRowSkeleton } from './TeacherSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ResetPasswordModal } from './ResetPasswordModal';
import { useState, useEffect, useMemo } from 'react';

const getTimestampMs = (value: unknown): number => {
    if (!value) return 0;
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return new Date(value).getTime();
    if (typeof value === 'object' && value !== null && typeof (value as { toDate?: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().getTime();
    }
    return 0;
};

interface StudentListProps {
    students: StudentData[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    classFilter: string;
    onClassFilterChange: (cls: string) => void;
    onSelectStudent: (student: StudentData) => void;
    yearGroup?: number;
    lastUpdated?: Date | null;
    classroomConfig?: ClassroomConfig | null;
}

export const StudentList: React.FC<StudentListProps> = ({
    students,
    loading,
    searchTerm,
    onSearchChange,
    classFilter,
    onClassFilterChange,
    onSelectStudent,
    yearGroup = 1,
    lastUpdated,
    classroomConfig
}) => {
    const classGroups = useMemo(() => {
        const groups = new Set<string>();
        students.forEach(s => {
            const cls = s.studentClass || s.stats?.studentClass;
            if (cls) groups.add(cls);
        });
        return Array.from(groups).sort();
    }, [students]);
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    const [now, setNow] = useState(new Date().getTime());
    const fiveMinutes = 5 * 60 * 1000;
    const [passwordResetStudent, setPasswordResetStudent] = useState<StudentData | null>(null);

    // Auto-refresh the 'now' timestamp every 30 seconds to keep online/offline status current
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, []);

    const handleResetPasswordClick = (e: React.MouseEvent, student: StudentData) => {
        e.stopPropagation(); // Prevent row click
        setPasswordResetStudent(student);
    };

    const getMissionStatus = (student: StudentData, missionId: string): 'completed' | 'in-progress' | 'not-started' => {
        const completed = student.stats?.missionsCompleted || [];
        if (completed.includes(missionId)) return 'completed';
        const progress = student.stats?.missionProgress?.[missionId];
        if (progress && ((progress.completedSteps?.length ?? 0) > 0 || (progress.chatHistory?.length ?? 0) > 0)) return 'in-progress';
        if (student.stats?.activeMission === missionId) return 'in-progress';
        return 'not-started';
    };

    // Count mission statuses for inline summary
    const getMissionCounts = (student: StudentData) => {
        let completed = 0, inProgress = 0;
        yearMissions.forEach(m => {
            const status = getMissionStatus(student, m.id);
            if (status === 'completed') completed++;
            else if (status === 'in-progress') inProgress++;
        });
        return { completed, inProgress, total: yearMissions.length };
    };

    // Get the last active mission name for a student
    const getActiveMissionName = (student: StudentData): string | null => {
        const activeId = student.stats?.activeMission;
        if (!activeId) return null;
        const mission = yearMissions.find(m => m.id === activeId);
        return mission?.short || mission?.name || null;
    };

    const getLastActiveMs = (student: StudentData) => getTimestampMs(student.lastActive);

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-lab-line overflow-hidden">
            {/* Search & Filter */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lab-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Zoek leerling..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 min-h-[44px] bg-lab-cream border-none rounded-xl outline-none focus:ring-2 focus:ring-lab-line transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <div className="flex items-center gap-1.5 text-[10px] text-lab-muted font-medium">
                            <Radio size={10} className="text-lab-muted animate-pulse" />
                            <span>Live — {lastUpdated.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                    )}
                    <Filter size={12} className="text-lab-muted" />
                    <select
                        value={classFilter}
                        onChange={(e) => onClassFilterChange(e.target.value)}
                        className="px-3 py-2 min-h-[44px] bg-white border border-lab-line rounded-xl text-xs font-bold text-lab-muted outline-none hover:bg-lab-cream"
                    >
                        <option value="all">Alle Klassen</option>
                        {classGroups.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full">
                    <thead>

                        <tr className="text-left text-[9px] font-black text-lab-muted uppercase tracking-widest border-b border-lab-line">
                            <th className="px-4 py-3">Leerling</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">XP</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Voortgang</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Missies</th>
                            <th className="px-4 py-3 hidden xl:table-cell">Badges</th>
                            {classroomConfig?.focusMode && <th className="px-4 py-3 hidden md:table-cell">Focus</th>}
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <>
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                </>
                            ) : students.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan={6} className="px-4 py-8 text-center text-lab-muted">Geen leerlingen gevonden</td>
                                </motion.tr>
                            ) : students.map((student) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={student.uid}
                                    className="hover:bg-lab-cream/50 active:bg-lab-coral/50 transition-colors cursor-pointer select-none"
                                    onClick={() => onSelectStudent(student)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStudent(student); } }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-lab-creamDeep rounded-lg flex items-center justify-center text-lab-muted">
                                                <GraduationCap size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lab-ink text-sm">{student.displayName || 'Naamloos'}</div>
                                                <div className="text-[10px] text-lab-muted">{student.identifier}</div>
                                                {getActiveMissionName(student) && (
                                                    <div className="text-[9px] text-lab-muted font-medium flex items-center gap-1 mt-0.5">
                                                        <BookOpen size={9} />
                                                        {getActiveMissionName(student)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${now - getLastActiveMs(student) < fiveMinutes
                                                ? 'bg-lab-sage text-white'
                                                : 'bg-lab-cream text-lab-muted'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${now - getLastActiveMs(student) < fiveMinutes ? 'bg-lab-coral animate-pulse' : 'bg-lab-muted'}`}></span>
                                                {now - getLastActiveMs(student) < fiveMinutes ? 'Online' : 'Offline'}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNow(new Date().getTime());
                                                }}
                                                className="p-1 text-lab-muted hover:text-lab-sage hover:bg-lab-sage hover:text-white rounded-md transition-colors"
                                                title="Ververs status"
                                            >
                                                <RotateCcw size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="font-black text-lab-ink">{student.stats?.xp || 0}</span>
                                            <span className="text-[9px] font-bold text-white bg-lab-coral px-1 py-0.5 rounded">L{student.stats?.level || 1}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        {(() => {
                                            const counts = getMissionCounts(student);
                                            const pct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 max-w-[80px]">
                                                        <div className="h-1.5 bg-lab-cream rounded-full overflow-hidden">
                                                            <div className="h-full bg-lab-coral rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-lab-muted">{counts.completed}/{counts.total}</span>
                                                    {counts.inProgress > 0 && (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-lab-gold" title={`${counts.inProgress} missie(s) bezig`}>
                                                            <Clock size={9} />
                                                            {counts.inProgress}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex gap-0.5 flex-wrap max-w-[200px]">
                                            {yearMissions.map(m => {
                                                const status = getMissionStatus(student, m.id);
                                                return (
                                                    <div
                                                        key={m.id}
                                                        title={`${m.name}${status === 'in-progress' ? ' (bezig)' : status === 'completed' ? ' (klaar)' : ''}`}
                                                        className={`w-5 h-5 rounded flex items-center justify-center text-[7px] font-black ${status === 'completed' ? 'bg-lab-sage text-white' : status === 'in-progress' ? 'bg-lab-gold text-lab-ink' : 'bg-lab-cream text-lab-muted'
                                                            }`}
                                                    >
                                                        {status === 'completed' ? '✓' : status === 'in-progress' ? '⏳' : m.short[0]}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden xl:table-cell">
                                        <div className="flex gap-0.5">
                                            {(student.stats?.badges || []).slice(0, 3).map(b => {
                                                const badge = AVAILABLE_BADGES.find(ab => ab.id === b);
                                                return badge ? <span key={b} title={badge.name}>{badge.emoji}</span> : null;
                                            })}
                                            {(student.stats?.badges?.length || 0) > 3 && (
                                                <span className="text-[10px] text-lab-muted">+{(student.stats?.badges?.length || 0) - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    {classroomConfig?.focusMode && (
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {(() => {
                                                const focusMissionId = classroomConfig.focusMissionId;
                                                if (!focusMissionId) return <span className="text-lab-muted">-</span>;
                                                const isOnFocusMission = student.stats?.activeMission === focusMissionId;
                                                const hasCompleted = (student.stats?.missionsCompleted || []).includes(focusMissionId);
                                                if (hasCompleted) {
                                                    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-lab-sage text-white">Klaar</span>;
                                                }
                                                if (isOnFocusMission) {
                                                    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-lab-sage text-white"><Focus size={10} /> Actief</span>;
                                                }
                                                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-lab-coral text-white">Niet actief</span>;
                                            })()}
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => handleResetPasswordClick(e, student)}
                                                className="p-2 text-lab-muted hover:text-lab-coral hover:bg-lab-coral hover:text-white rounded-full transition-colors"
                                                title="Reset Wachtwoord"
                                            >
                                                <KeyRound size={16} />
                                            </button>
                                            <ChevronRight size={16} className="text-lab-muted" />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Password Reset Modal */}
            <ResetPasswordModal
                student={passwordResetStudent}
                onClose={() => setPasswordResetStudent(null)}
            />
        </div>
    );
};
