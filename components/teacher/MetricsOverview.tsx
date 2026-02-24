import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Target, Activity, AlertTriangle, Flame, Sparkles, GraduationCap, ChevronRight, Filter, X, Search, ChevronDown, Shield, Cpu, Database, Palette, Bot, Code, Globe, User, MonitorSmartphone, BarChart3 } from 'lucide-react';
import { StudentData, GamificationEvent } from '../../types';
import { getMissionsForYear } from '../../config/missions';
import { SLO_GOALS, SLO_DOMAINS } from '../../config/slo-goals';
import { calculateStudentSLOStats } from '../../config/slo-mapping';
import { StatCardSkeleton, Skeleton } from './Skeleton';

interface MetricsOverviewProps {
    students: StudentData[];
    activeEvents: GamificationEvent[];
    loading?: boolean;
    onNavigate?: (tab: 'overview' | 'leaderboard' | 'alerts' | 'messages' | 'settings' | 'events') => void;
    onFilterConcept?: (concept: string) => void;
    onResetFilters?: () => void;
    conceptFilter?: string | null;
    onSelectStudent?: (student: StudentData) => void;
    selectedStudentId?: string | null;
    onSelectStudentFilter?: (studentId: string | null) => void;
    yearGroup?: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ students, activeEvents, onNavigate, loading, onFilterConcept, onResetFilters, conceptFilter, onSelectStudent, selectedStudentId, onSelectStudentFilter, yearGroup = 1 }) => {
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);

    // Student filter dropdown state
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');

    // Filter students based on search
    const filteredStudentOptions = useMemo(() => {
        if (!studentSearch) return students;
        const search = studentSearch.toLowerCase();
        return students.filter(s =>
            s.displayName?.toLowerCase().includes(search) ||
            s.identifier?.toLowerCase().includes(search)
        );
    }, [students, studentSearch]);

    // Get selected student object
    const selectedStudent = selectedStudentId ? students.find(s => s.uid === selectedStudentId) : null;

    // Apply student filter to displayed data
    const displayedStudents = selectedStudentId ? students.filter(s => s.uid === selectedStudentId) : students;

    // Derived data
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    const activeToday = displayedStudents.filter(s => now - (s.lastActive?.toDate().getTime() || 0) < oneDay).length;
    const activeNow = displayedStudents.filter(s => now - (s.lastActive?.toDate().getTime() || 0) < fiveMinutes).length;
    const avgXP = displayedStudents.length > 0 ? Math.round(displayedStudents.reduce((sum, s) => sum + (s.stats?.xp || 0), 0) / displayedStudents.length) : 0;
    const totalXP = displayedStudents.reduce((sum, s) => sum + (s.stats?.xp || 0), 0);
    const inactiveStudents = displayedStudents.filter(s => now - (s.lastActive?.toDate().getTime() || 0) > oneWeek);
    const lowXPStudents = displayedStudents.filter(s => (s.stats?.xp || 0) < 50);

    const popularMission = useMemo(() => {
        const missionCounts: Record<string, number> = {};
        displayedStudents.forEach(s => {
            (s.stats?.missionsCompleted || []).forEach(m => {
                missionCounts[m] = (missionCounts[m] || 0) + 1;
            });
        });
        return Object.entries(missionCounts).sort((a, b) => b[1] - a[1])[0];
    }, [displayedStudents]);

    // Class stats for comparison (only show when not filtering individual student)
    const classGroups = useMemo(() => {
        const groups = new Set<string>();
        students.forEach(s => {
            const cls = (s as any).studentClass || s.stats?.studentClass || s.identifier?.replace(/\d{3,}$/, '');
            if (cls) groups.add(cls);
        });
        return Array.from(groups).sort();
    }, [students]);
    const classStats = classGroups.map(g => {
        const classStudents = students.filter(s =>
            (s as any).studentClass === g || s.stats?.studentClass === g || s.identifier?.startsWith(g)
        );
        return {
            name: g,
            count: classStudents.length,
            avgXP: classStudents.length > 0 ? Math.round(classStudents.reduce((sum, s) => sum + (s.stats?.xp || 0), 0) / classStudents.length) : 0,
            totalMissions: classStudents.reduce((sum, s) => sum + (s.stats?.missionsCompleted?.length || 0), 0)
        };
    });

    // Calculate SLO progress for displayed students
    const sloProgress = useMemo(() => {
        // Icon mapping for all 9 SLO goals
        const iconMap: Record<string, React.ElementType> = {
            // Domein 1: Praktische Kennis
            'systems': MonitorSmartphone,
            'media-info': Database,
            'data': BarChart3,
            'ai': Bot,
            // Domein 2: Ontwerpen & Maken
            'create': Palette,
            'programming': Code,
            // Domein 3: Gedigitaliseerde Wereld
            'safety': Shield,
            'self-other': User,
            'society': Globe
        };

        // Calculate average percentage per SLO goal for displayed students
        const sloStats: { id: string; title: string; description: string; score: number; icon: any; domainId: string; domainColor: string }[] = [];

        SLO_DOMAINS.forEach(domain => {
            domain.goals.forEach(goal => {
                let totalPercentage = 0;
                let studentCountWithApplicableGoals = 0;

                displayedStudents.forEach(student => {
                    const studentStats = calculateStudentSLOStats(student);
                    const stat = studentStats[goal.id];

                    // Alleen meetellen als er voor deze leerling een doel gesteld is (totalWeight > 0)
                    if (stat && stat.totalWeight > 0) {
                        totalPercentage += stat.percentage;
                        studentCountWithApplicableGoals++;
                    }
                });

                const avgPercentage = studentCountWithApplicableGoals > 0
                    ? Math.round(totalPercentage / studentCountWithApplicableGoals)
                    : 0;

                sloStats.push({
                    id: goal.id,
                    title: goal.title,
                    description: goal.description,
                    score: avgPercentage,
                    icon: iconMap[goal.id] || Target,
                    domainId: domain.id,
                    domainColor: domain.color
                });
            });
        });

        return sloStats;
    }, [displayedStudents]);

    const [expandedSlo, setExpandedSlo] = useState(false);
    const [expandedSignaling, setExpandedSignaling] = useState(true);
    const [expandedComparison, setExpandedComparison] = useState(false);

    return (
        <div className="space-y-6">
            {/* STUDENT FILTER BAR */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <button
                        onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${selectedStudentId
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                    >
                        <Filter size={16} />
                        <span className="font-bold text-sm">
                            {selectedStudent ? selectedStudent.displayName : 'Filter Leerling'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${showStudentDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {showStudentDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-slate-100">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Zoek leerling..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="max-h-64 overflow-y-auto">
                                {/* All Students Option */}
                                <button
                                    onClick={() => {
                                        onSelectStudentFilter?.(null);
                                        setShowStudentDropdown(false);
                                        setStudentSearch('');
                                    }}
                                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 ${!selectedStudentId ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                                        }`}
                                >
                                    <Users size={14} />
                                    <span className="font-bold text-sm">Alle Leerlingen</span>
                                    <span className="ml-auto text-xs text-slate-400">{students.length}</span>
                                </button>

                                {/* Divider */}
                                <div className="border-t border-slate-100 my-1" />

                                {/* Student List */}
                                {filteredStudentOptions.map(student => (
                                    <button
                                        key={student.uid}
                                        onClick={() => {
                                            onSelectStudentFilter?.(student.uid);
                                            setShowStudentDropdown(false);
                                            setStudentSearch('');
                                        }}
                                        className={`w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 ${selectedStudentId === student.uid ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                                            }`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                            {student.displayName?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{student.displayName}</div>
                                            <div className="text-[10px] text-slate-400">{student.identifier}</div>
                                        </div>
                                        <span className="text-xs text-amber-600 font-bold">{student.stats?.xp || 0} XP</span>
                                    </button>
                                ))}

                                {filteredStudentOptions.length === 0 && (
                                    <div className="px-3 py-4 text-center text-slate-400 text-sm">Geen leerlingen gevonden</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Clear Filter Button */}
                {selectedStudentId && (
                    <button
                        onClick={() => onSelectStudentFilter?.(null)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <X size={14} />
                        Reset
                    </button>
                )}

                {/* Selected student indicator */}
                {selectedStudent && (
                    <div className="ml-auto flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                        <span className="text-xs font-bold text-indigo-700">Bekijk data van:</span>
                        <span className="text-xs font-black text-indigo-900">{selectedStudent.displayName}</span>
                    </div>
                )}
            </div>
            {/* OVERVIEW CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {loading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <div
                            onClick={() => onNavigate?.('overview')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <Users size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Leerlingen</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{students.length}</div>
                            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                {activeNow} online
                            </div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('leaderboard')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                    <Zap size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Totaal XP</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{totalXP.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400 font-medium">Ø {avgXP} per leerling</div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('overview')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-pink-300 hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                                    <Target size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Populair</div>
                            </div>
                            <div className="text-lg font-black text-slate-900 truncate">
                                {popularMission ? yearMissions.find(m => m.id === popularMission[0])?.short || '?' : '-'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium truncate">
                                {popularMission ? `${popularMission[1]}x voltooid` : 'Geen data'}
                            </div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('overview')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <Activity size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Vandaag</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{activeToday}</div>
                            <div className="text-[10px] text-slate-400 font-medium">actief vandaag</div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('alerts')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:border-red-300 hover:shadow-md transition-all active:scale-95"
                            title="Leerlingen die al even niet actief zijn of weinig voortgang boeken."
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Aandacht</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{inactiveStudents.length + lowXPStudents.length}</div>
                            <div className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Hulp nodig</div>
                        </div>
                    </>
                )}
            </div>

            {/* VROEGE SIGNALERING - Collapsible */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <button
                    onClick={() => setExpandedSignaling(!expandedSignaling)}
                    className="w-full p-6 text-left flex items-center justify-between relative z-10"
                >
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-400" />
                        Vroege Signalering
                    </h3>
                    <ChevronDown size={20} className={`text-white/40 transition-transform ${expandedSignaling ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expandedSignaling && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 space-y-3 relative z-10"
                        >
                            {students.filter(s => (s.stats?.xp || 0) < 100).slice(0, 3).map(student => (
                                <div
                                    key={student.uid}
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                                    onClick={() => onSelectStudent?.(student)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/40">
                                            <GraduationCap size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{student.displayName}</div>
                                            <div className="text-[10px] text-slate-400">Vertoont lage activiteit in week 2</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-400/30 px-2 py-1 rounded-lg">
                                            Intervenieer
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                            {students.filter(s => (s.stats?.xp || 0) < 100).length === 0 && (
                                <div className="text-slate-500 text-xs italic py-4 text-center">Iedereen ligt op koers! 🎉</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SLO KERNDOELEN DIGITALE GELETTERDHEID - Collapsible */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <button
                    onClick={() => setExpandedSlo(!expandedSlo)}
                    className="w-full p-6 text-left flex items-center justify-between"
                >
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        SLO Kerndoelen Digitale Geletterdheid
                    </h3>
                    <div className="flex items-center gap-4">
                        {!expandedSlo && (
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Moeite</span>
                                <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded ml-2"></div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Beheerst</span>
                            </div>
                        )}
                        <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedSlo ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                <AnimatePresence>
                    {expandedSlo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6"
                        >
                            {/* EXPLANATION FOR NEW TEACHERS */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    <strong>📚 SLO Kerndoelen</strong> Dit overzicht toont de voortgang per officieel kerndoel Digitale Geletterdheid (SLO 2025).
                                    Georganiseerd in <strong>3 domeinen</strong> met <strong>9 leerdoelen</strong>. <span className="text-indigo-600 font-bold">Rood = extra aandacht nodig</span>.
                                </p>
                            </div>

                            {conceptFilter && (
                                <div className="mb-4 flex items-center justify-between bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                                    <span className="text-xs font-bold text-indigo-700">Filter actief: {conceptFilter}</span>
                                    <button onClick={onResetFilters} className="text-[9px] font-black text-indigo-600 uppercase border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors">Reset Filter</button>
                                </div>
                            )}

                            {/* DOMAIN-GROUPED GOALS */}
                            <div className="space-y-6">
                                {SLO_DOMAINS.map(domain => {
                                    const domainGoals = sloProgress.filter(g => g.domainId === domain.id);
                                    const avgDomainScore = domainGoals.length > 0
                                        ? Math.round(domainGoals.reduce((sum, g) => sum + g.score, 0) / domainGoals.length)
                                        : 0;

                                    const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
                                        'indigo': { bg: 'bg-indigo-500', border: 'border-indigo-200', text: 'text-indigo-700', light: 'bg-indigo-50' },
                                        'emerald': { bg: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-50' },
                                        'amber': { bg: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', light: 'bg-amber-50' }
                                    };
                                    const colors = colorClasses[domain.color] || colorClasses['indigo'];

                                    return (
                                        <div key={domain.id} className={`rounded-2xl border ${colors.border} overflow-hidden`}>
                                            {/* Domain Header */}
                                            <div className={`${colors.light} px-4 py-3 flex items-center justify-between`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 ${colors.bg} rounded-full`}></div>
                                                    <div>
                                                        <h4 className={`text-xs font-black uppercase tracking-wider ${colors.text}`}>{domain.title}</h4>
                                                        <p className="text-[10px] text-slate-500">{domain.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-black ${avgDomainScore < 50 ? 'text-red-600' : avgDomainScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {avgDomainScore}%
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">gemiddeld</span>
                                                </div>
                                            </div>

                                            {/* Goals Grid */}
                                            <div className="p-4 bg-white">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {domainGoals.map(item => {
                                                        const Icon = item.icon;
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => onFilterConcept?.(item.title)}
                                                                className={`p-3 rounded-xl bg-slate-50 border transition-all cursor-pointer active:scale-95 ${conceptFilter === item.title ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-100 hover:border-slate-200'}`}
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.score < 50 ? 'bg-red-100 text-red-600' : item.score >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                                        <Icon size={14} />
                                                                    </div>
                                                                    <span className={`text-lg font-black ${item.score < 50 ? 'text-red-600' : item.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                                        {item.score}%
                                                                    </span>
                                                                </div>
                                                                <div className="text-[10px] font-bold text-slate-700 mb-0.5 line-clamp-1">{item.title}</div>
                                                                <div className="text-[9px] text-slate-400 line-clamp-1">{item.description}</div>
                                                                {item.score < 50 && (
                                                                    <div className="mt-2 text-[8px] font-bold text-red-600 flex items-center gap-1">
                                                                        <AlertTriangle size={8} />
                                                                        Aandacht nodig
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CLASS COMPARISON CHART - Collapsible */}
            {classStats.length > 1 && (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <button
                        onClick={() => setExpandedComparison(!expandedComparison)}
                        className="w-full p-6 text-left flex items-center justify-between"
                    >
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Klas Vergelijking (Gem. XP)</h3>
                        <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedComparison ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {expandedComparison && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6"
                            >
                                <div className="flex items-end gap-3 h-32 px-4">
                                    {classStats.map((cls, i) => {
                                        const maxXP = Math.max(...classStats.map(c => c.avgXP));
                                        const height = maxXP > 0 ? (cls.avgXP / maxXP) * 100 : 0;
                                        return (
                                            <div key={cls.name} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded mb-1">{cls.avgXP} XP</div>
                                                <div
                                                    className={`w-full rounded-t-xl transition-all ${i % 3 === 0 ? 'bg-indigo-500' : i % 3 === 1 ? 'bg-emerald-500' : 'bg-amber-500'
                                                        } hover:brightness-110 shadow-sm`}
                                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                                ></div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase">{cls.name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
