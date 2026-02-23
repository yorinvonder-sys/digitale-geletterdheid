import { Search, Filter, GraduationCap, ChevronRight, KeyRound, RotateCcw } from 'lucide-react';
import { StudentData } from '../../types';
import { ALL_MISSIONS } from '../../config/missions';
import { AVAILABLE_BADGES } from '../../config/badges';
import { TableRowSkeleton } from './Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ResetPasswordModal } from './ResetPasswordModal';
import { useState, useEffect } from 'react';

interface StudentListProps {
    students: StudentData[];
    loading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    classFilter: string;
    onClassFilterChange: (cls: string) => void;
    onSelectStudent: (student: StudentData) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
    students,
    loading,
    searchTerm,
    onSearchChange,
    classFilter,
    onClassFilterChange,
    onSelectStudent
}) => {
    const classGroups = ['MH1A', 'MH1B', 'HV1A', 'HV1B', 'HV1C'];
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

    const getMissionStatus = (student: StudentData, missionId: string) => {
        const completed = student.stats?.missionsCompleted || [];
        if (completed.includes(missionId)) return 'completed';
        return 'not-started';
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            {/* Search & Filter */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Zoek leerling..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={12} className="text-slate-400" />
                    <select
                        value={classFilter}
                        onChange={(e) => onClassFilterChange(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none hover:bg-slate-50"
                    >
                        <option value="all">Alle Klassen</option>
                        {classGroups.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>

                        <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-4 py-3">Leerling</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">XP</th>
                            <th className="px-4 py-3 hidden md:table-cell">Missies</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Badges</th>
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
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Geen leerlingen gevonden</td>
                                </motion.tr>
                            ) : students.map((student) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={student.uid}
                                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => onSelectStudent(student)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                                <GraduationCap size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{student.displayName || 'Naamloos'}</div>
                                                <div className="text-[10px] text-slate-400">{student.identifier}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${now - (student.lastActive?.toDate().getTime() || 0) < fiveMinutes
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${now - (student.lastActive?.toDate().getTime() || 0) < fiveMinutes ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                {now - (student.lastActive?.toDate().getTime() || 0) < fiveMinutes ? 'Online' : 'Offline'}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNow(new Date().getTime());
                                                }}
                                                className="p-1 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                title="Ververs status"
                                            >
                                                <RotateCcw size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="font-black text-slate-900">{student.stats?.xp || 0}</span>
                                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">L{student.stats?.level || 1}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <div className="flex gap-0.5">
                                            {ALL_MISSIONS.map(m => (
                                                <div
                                                    key={m.id}
                                                    title={m.name}
                                                    className={`w-6 h-6 rounded flex items-center justify-center text-[8px] font-black ${getMissionStatus(student, m.id) === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                                        }`}
                                                >
                                                    {getMissionStatus(student, m.id) === 'completed' ? '✓' : m.short[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex gap-0.5">
                                            {(student.stats?.badges || []).slice(0, 3).map(b => {
                                                const badge = AVAILABLE_BADGES.find(ab => ab.id === b);
                                                return badge ? <span key={b} title={badge.name}>{badge.emoji}</span> : null;
                                            })}
                                            {(student.stats?.badges?.length || 0) > 3 && (
                                                <span className="text-[10px] text-slate-400">+{(student.stats?.badges?.length || 0) - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => handleResetPasswordClick(e, student)}
                                                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="Reset Wachtwoord"
                                            >
                                                <KeyRound size={16} />
                                            </button>
                                            <ChevronRight size={16} className="text-slate-300" />
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
