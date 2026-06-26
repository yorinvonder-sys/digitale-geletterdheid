import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Target, Activity, AlertTriangle, Flame, Sparkles, GraduationCap, ChevronRight, Filter, X, Search, ChevronDown, Shield, Cpu, Database, Palette, Bot, Code, Globe, User, MonitorSmartphone, BarChart3, Clock, CheckCircle2, ArrowRight, MessageSquare, Send } from 'lucide-react';
import { StudentData, GamificationEvent } from '@/types';
import { getMissionsForYear } from '@/config/missions';
import { SLO_KERNDOELEN, SloKerndoelCode } from '@/config/sloKerndoelen';
import { calculateStudentKerndoelStats, KERNDOEL_CODES } from '@/config/slo-kerndoelen-mapping';
import { StatCardSkeleton, Skeleton } from './TeacherSkeleton';
import { buildSpotlightProgress, filterSpotlightsByYear, getTopSpotlightSignal } from './spotlightSignals';

interface MetricsOverviewProps {
    students: StudentData[];
    activeEvents: GamificationEvent[];
    loading?: boolean;
    onNavigate?: (tab: 'overview' | 'leaderboard' | 'alerts' | 'messages' | 'settings' | 'events' | 'slo' | 'progress' | 'students') => void;
    onFilterConcept?: (concept: string) => void;
    onResetFilters?: () => void;
    conceptFilter?: string | null;
    onSelectStudent?: (student: StudentData) => void;
    selectedStudentId?: string | null;
    onSelectStudentFilter?: (studentId: string | null) => void;
    yearGroup?: number;
    onSendMessage?: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ students, activeEvents, onNavigate, loading, onFilterConcept, onResetFilters, conceptFilter, onSelectStudent, selectedStudentId, onSelectStudentFilter, yearGroup = 1, onSendMessage }) => {
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

    const curriculumSpotlights = useMemo(
        () => buildSpotlightProgress(filterSpotlightsByYear(yearGroup), students),
        [students, yearGroup]
    );

    const topCurriculumSignal = useMemo(
        () => getTopSpotlightSignal(curriculumSpotlights),
        [curriculumSpotlights]
    );

    const curriculumFocus = topCurriculumSignal?.progress || curriculumSpotlights[0] || null;
    const curriculumSignal = topCurriculumSignal?.signal || null;

    const curriculumStyles = !curriculumSignal
        ? {
            panel: 'border-duck-error bg-duck-error/80 hover:border-duck-error',
            icon: 'bg-duck-error text-white',
            label: 'text-duck-error',
            badge: 'bg-white text-duck-error border-duck-error',
        }
        : curriculumSignal.tone === 'success'
        ? {
            panel: 'border-duck-ink bg-duck-ink/80 hover:border-duck-ink',
            icon: 'bg-duck-ink text-white',
            label: 'text-duck-ink',
            badge: 'bg-white text-duck-ink border-duck-ink',
        }
        : curriculumSignal.tone === 'attention'
            ? {
                panel: 'border-duck-acid bg-duck-acid/80 hover:border-duck-acid',
                icon: 'bg-duck-acid text-duck-ink',
                label: 'text-duck-ink',
                badge: 'bg-white text-duck-ink border-duck-acid',
            }
            : {
                panel: 'border-duck-error bg-duck-error/80 hover:border-duck-error',
                icon: 'bg-duck-error text-white',
                label: 'text-duck-error',
                badge: 'bg-white text-duck-error border-duck-error',
            };

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
        // Icon mapping for all 9 regulier kerndoel codes
        const iconMap: Record<string, React.ElementType> = {
            // Domein 21: Praktische kennis & vaardigheden
            '21A': MonitorSmartphone,
            '21B': Database,
            '21C': BarChart3,
            '21D': Bot,
            // Domein 22: Ontwerpen & maken
            '22A': Palette,
            '22B': Code,
            // Domein 23: De gedigitaliseerde wereld
            '23A': Shield,
            '23B': User,
            '23C': Globe
        };

        // Domain metadata derived from kerndoel numbers
        const domainMeta: Record<number, { id: string; color: string }> = {
            21: { id: 'practical', color: 'indigo' },
            22: { id: 'creation', color: 'emerald' },
            23: { id: 'digital-world', color: 'amber' },
        };

        // Calculate average percentage per kerndoel code for displayed students
        const regulierCodes = KERNDOEL_CODES.filter(c => ['21A','21B','21C','21D','22A','22B','23A','23B','23C'].includes(c)) as SloKerndoelCode[];
        const sloStats: { id: string; title: string; description: string; score: number; icon: any; domainId: string; domainColor: string }[] = [];

        regulierCodes.forEach(code => {
            const kerndoel = SLO_KERNDOELEN[code];
            if (!kerndoel) return;

            let totalPercentage = 0;
            let studentCountWithApplicableGoals = 0;

            displayedStudents.forEach(student => {
                const studentStats = calculateStudentKerndoelStats(student);
                const stat = studentStats[code];

                // Alleen meetellen als er voor deze leerling missies zijn voor dit kerndoel
                if (stat && stat.total > 0) {
                    totalPercentage += stat.percentage;
                    studentCountWithApplicableGoals++;
                }
            });

            const avgPercentage = studentCountWithApplicableGoals > 0
                ? Math.round(totalPercentage / studentCountWithApplicableGoals)
                : 0;

            const domain = domainMeta[kerndoel.domeinNummer] || { id: 'practical', color: 'indigo' };

            sloStats.push({
                id: code,
                title: kerndoel.label,
                description: kerndoel.omschrijving,
                score: avgPercentage,
                icon: iconMap[code] || Target,
                domainId: domain.id,
                domainColor: domain.color
            });
        });

        return sloStats;
    }, [displayedStudents]);

    // Action queue: prioritized list of students needing attention
    const actionQueue = useMemo(() => {
        const actions: { student: StudentData; reason: string; priority: 'high' | 'medium'; icon: React.FC<{ size?: number; className?: string }>; action: string }[] = [];

        displayedStudents.forEach(student => {
            const xp = student.stats?.xp || 0;
            const lastActive = student.lastActive?.toDate?.()?.getTime() || 0;
            const completedCount = student.stats?.missionsCompleted?.length || 0;

            // High priority: inactive > 1 week with low completion
            if (now - lastActive > oneWeek && completedCount < 3) {
                actions.push({ student, reason: 'Inactief + weinig voortgang', priority: 'high', icon: AlertTriangle, action: 'Gesprek starten' });
            }
            // Medium: very low XP (< 50) but recently active
            else if (xp < 50 && now - lastActive < oneWeek) {
                actions.push({ student, reason: 'Actief maar weinig XP', priority: 'medium', icon: Clock, action: 'Voortgang bekijken' });
            }
            // Medium: inactive > 3 days
            else if (now - lastActive > 3 * oneDay && completedCount > 0) {
                actions.push({ student, reason: `${Math.floor((now - lastActive) / oneDay)}d inactief`, priority: 'medium', icon: Activity, action: 'Bericht sturen' });
            }
        });

        // Sort: high first, then by XP ascending
        return actions
            .sort((a, b) => {
                if (a.priority !== b.priority) return a.priority === 'high' ? -1 : 1;
                return (a.student.stats?.xp || 0) - (b.student.stats?.xp || 0);
            })
            .slice(0, 5);
    }, [displayedStudents, now]);

    // Recent completions
    const recentCompletions = useMemo(() => {
        const completions: { student: StudentData; missionName: string }[] = [];
        displayedStudents.forEach(student => {
            const completed = student.stats?.missionsCompleted || [];
            completed.forEach(missionId => {
                const mission = yearMissions.find(m => m.id === missionId);
                if (mission) {
                    completions.push({ student, missionName: mission.short || mission.name });
                }
            });
        });
        // We can't sort by completion time (not tracked per-mission), so just take recent students
        return completions.slice(0, 5);
    }, [displayedStudents, yearMissions]);

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
                            ? 'bg-duck-error border-duck-error text-duck-error'
                            : 'bg-white border-duck-ink/15 text-duck-ink/60 hover:border-duck-error'
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
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-duck-ink/15 z-50 overflow-hidden">
                            {/* Search */}
                            <div className="p-2 border-b border-duck-ink/15">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-duck-ink/60" />
                                    <input
                                        type="text"
                                        placeholder="Zoek leerling..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-duck-ink/15 rounded-lg focus:outline-none focus:border-duck-error"
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
                                    className={`w-full px-3 py-2 text-left hover:bg-duck-bg transition-colors flex items-center gap-2 ${!selectedStudentId ? 'bg-duck-error text-white' : 'text-duck-ink/60'
                                        }`}
                                >
                                    <Users size={14} />
                                    <span className="font-bold text-sm">Alle Leerlingen</span>
                                    <span className="ml-auto text-xs text-duck-ink/60">{students.length}</span>
                                </button>

                                {/* Divider */}
                                <div className="border-t border-duck-ink/15 my-1" />

                                {/* Student List */}
                                {filteredStudentOptions.map(student => (
                                    <button
                                        key={student.uid}
                                        onClick={() => {
                                            onSelectStudentFilter?.(student.uid);
                                            setShowStudentDropdown(false);
                                            setStudentSearch('');
                                        }}
                                        className={`w-full px-3 py-2 text-left hover:bg-duck-bg transition-colors flex items-center gap-2 ${selectedStudentId === student.uid ? 'bg-duck-error text-white' : 'text-duck-ink/60'
                                            }`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-duck-error to-duck-error flex items-center justify-center text-white text-[10px] font-bold">
                                            {student.displayName?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{student.displayName}</div>
                                            <div className="text-[10px] text-duck-ink/60">{student.identifier}</div>
                                        </div>
                                        <span className="text-xs text-duck-ink font-bold">{student.stats?.xp || 0} XP</span>
                                    </button>
                                ))}

                                {filteredStudentOptions.length === 0 && (
                                    <div className="px-3 py-4 text-center text-duck-ink/60 text-sm">Geen leerlingen gevonden</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Clear Filter Button */}
                {selectedStudentId && (
                    <button
                        onClick={() => onSelectStudentFilter?.(null)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-duck-error hover:bg-duck-error hover:text-white rounded-lg transition-colors"
                    >
                        <X size={14} />
                        Reset
                    </button>
                )}

                {/* Selected student indicator */}
                {selectedStudent && (
                    <div className="ml-auto flex items-center gap-2 bg-duck-error px-3 py-1.5 rounded-lg border border-duck-error">
                        <span className="text-xs font-bold text-duck-error">Bekijk data van:</span>
                        <span className="text-xs font-black text-duck-error">{selectedStudent.displayName}</span>
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
                            className="bg-white rounded-2xl p-4 shadow-sm border border-duck-ink/15 cursor-pointer hover:border-duck-error hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-duck-error text-white rounded-lg flex items-center justify-center">
                                    <Users size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-duck-ink/60 uppercase">Leerlingen</div>
                            </div>
                            <div className="text-2xl font-black text-duck-ink">{students.length}</div>
                            <div className="text-[10px] text-duck-ink font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-duck-error rounded-full animate-pulse"></span>
                                {activeNow} online
                            </div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('leaderboard')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-duck-ink/15 cursor-pointer hover:border-duck-acid hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-duck-acid text-duck-ink rounded-lg flex items-center justify-center">
                                    <Zap size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-duck-ink/60 uppercase">Totaal XP</div>
                            </div>
                            <div className="text-2xl font-black text-duck-ink">{totalXP.toLocaleString()}</div>
                            <div className="text-[10px] text-duck-ink/60 font-medium">Ø {avgXP} per leerling</div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('overview')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-duck-ink/15 cursor-pointer hover:border-duck-error hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-duck-error text-white rounded-lg flex items-center justify-center">
                                    <Target size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-duck-ink/60 uppercase">Populair</div>
                            </div>
                            <div className="text-lg font-black text-duck-ink truncate">
                                {popularMission ? yearMissions.find(m => m.id === popularMission[0])?.short || '?' : '-'}
                            </div>
                            <div className="text-[10px] text-duck-ink/60 font-medium truncate">
                                {popularMission ? `${popularMission[1]}x voltooid` : 'Geen data'}
                            </div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('overview')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-duck-ink/15 cursor-pointer hover:border-duck-ink hover:shadow-md transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-duck-ink text-white rounded-lg flex items-center justify-center">
                                    <Activity size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-duck-ink/60 uppercase">Vandaag</div>
                            </div>
                            <div className="text-2xl font-black text-duck-ink">{activeToday}</div>
                            <div className="text-[10px] text-duck-ink/60 font-medium">actief vandaag</div>
                        </div>

                        <div
                            onClick={() => onNavigate?.('alerts')}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-duck-ink/15 cursor-pointer hover:border-duck-error hover:shadow-md transition-all active:scale-95"
                            title="Leerlingen die al even niet actief zijn of weinig voortgang boeken."
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-duck-error text-white rounded-lg flex items-center justify-center">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="text-[9px] font-bold text-duck-ink/60 uppercase">Aandacht</div>
                            </div>
                            <div className="text-2xl font-black text-duck-ink">{inactiveStudents.length + lowXPStudents.length}</div>
                            <div className="text-[10px] text-duck-ink/60 font-bold uppercase tracking-tight">Hulp nodig</div>
                        </div>
                    </>
                )}
            </div>

            {!loading && curriculumFocus && (
                <button
                    type="button"
                    onClick={() => onNavigate?.('slo')}
                    className={`w-full rounded-[2rem] border p-5 text-left transition-all shadow-sm hover:shadow-md active:scale-[0.99] ${curriculumStyles.panel}`}
                >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${curriculumStyles.icon}`}>
                                    <Target size={22} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${curriculumStyles.label}`}>Curriculum Signaal</p>
                                        <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${curriculumStyles.badge}`}>
                                            J{curriculumFocus.spotlight.yearGroup} • {curriculumFocus.spotlight.periodLabel}
                                        </span>
                                        {selectedStudentId && (
                                            <span className="inline-flex items-center rounded-full border border-duck-ink/15 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">
                                                Schoolbreed
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-black text-duck-ink mt-1">
                                        {curriculumSignal?.title || curriculumFocus.spotlight.title}
                                    </h3>
                                    <p className="text-sm text-duck-ink/60 mt-1 max-w-3xl">
                                        {curriculumSignal?.summary || `${curriculumFocus.spotlight.title}: ${curriculumFocus.startedPercentage}% gestart en ${curriculumFocus.completedPercentage}% afgerond in deze jaarlaag.`}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {curriculumFocus.spotlight.kerndoelen.map(code => (
                                    <span key={code} className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-duck-ink/60 border border-white">
                                        {code}
                                    </span>
                                ))}
                                <span className="inline-flex items-center gap-1 rounded-full bg-duck-ink px-3 py-1 text-[11px] font-black text-white">
                                    Open SLO-rapportage <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 xl:min-w-[340px]">
                            <div className="rounded-2xl border border-white bg-white/90 px-3 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">Gestart</p>
                                <p className="text-2xl font-black text-duck-error mt-1">{curriculumFocus.startedStudents}</p>
                                <p className="text-[10px] text-duck-ink/60 mt-1">{curriculumFocus.startedPercentage}% van leerlingen</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white/90 px-3 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">Nog Bezig</p>
                                <p className="text-2xl font-black text-duck-ink mt-1">{curriculumFocus.inProgressStudents}</p>
                                <p className="text-[10px] text-duck-ink/60 mt-1">Wel gestart, nog niet af</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white/90 px-3 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">Afgerond</p>
                                <p className="text-2xl font-black text-duck-ink mt-1">{curriculumFocus.completedStudents}</p>
                                <p className="text-[10px] text-duck-ink/60 mt-1">{curriculumFocus.completedPercentage}% van leerlingen</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white bg-white/85 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-duck-ink/60">Docentnudge</p>
                        <p className="text-sm text-duck-ink/60 mt-1">
                            {curriculumSignal?.nudge || 'Open de SLO-rapportage om per klas te zien waar leerlingen starten, blijven hangen of juist al sterk afronden.'}
                        </p>
                    </div>
                </button>
            )}

            {/* ACTION QUEUE — Wat moet je nu doen? */}
            {!loading && actionQueue.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-duck-ink/15 overflow-hidden">
                    <div className="px-5 py-4 border-b border-duck-ink/15 flex items-center justify-between">
                        <h3 className="text-sm font-black text-duck-ink flex items-center gap-2">
                            <div className="w-2 h-2 bg-duck-error rounded-full animate-pulse" />
                            Acties voor jou
                            <span className="text-[10px] font-bold text-duck-ink/60 bg-duck-bg px-2 py-0.5 rounded-full">{actionQueue.length}</span>
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onNavigate?.('students')}
                                className="text-[10px] font-bold text-duck-error hover:text-duck-error flex items-center gap-1"
                            >
                                Alle leerlingen <ArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {actionQueue.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.student.uid}
                                    onClick={() => onSelectStudent?.(item.student)}
                                    className="w-full px-5 py-3 flex items-center gap-4 hover:bg-duck-bg transition-colors text-left group"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.priority === 'high' ? 'bg-duck-error text-white' : 'bg-duck-acid text-duck-ink'}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-duck-ink truncate">{item.student.displayName}</span>
                                            <span className="text-[9px] text-duck-ink/60">{item.student.identifier}</span>
                                        </div>
                                        <div className="text-[10px] text-duck-ink/60">{item.reason}</div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-duck-ink/60">{item.student.stats?.xp || 0} XP</span>
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${item.priority === 'high' ? 'text-white bg-duck-error border border-duck-error' : 'text-duck-ink bg-duck-acid border border-duck-acid'}`}>
                                            {item.action}
                                        </span>
                                        <ChevronRight size={14} className="text-duck-ink/60 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quick Actions Bar */}
            {!loading && (
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => onNavigate?.('progress')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-duck-ink/15 rounded-xl text-sm font-bold text-duck-ink/60 hover:border-duck-error hover:text-duck-error transition-all"
                    >
                        <BarChart3 size={14} /> Missie-voortgang
                    </button>
                    <button
                        onClick={() => onNavigate?.('slo')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-duck-ink/15 rounded-xl text-sm font-bold text-duck-ink/60 hover:border-duck-error hover:text-duck-error transition-all"
                    >
                        <Target size={14} /> SLO Rapportage
                    </button>
                    {onSendMessage && (
                        <button
                            onClick={onSendMessage}
                            className="flex items-center gap-2 px-4 py-2.5 bg-duck-error text-white rounded-xl text-sm font-bold hover:bg-duck-error hover:text-white transition-all shadow-sm"
                        >
                            <Send size={14} /> Bericht aan klas
                        </button>
                    )}
                    {activeEvents.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-duck-acid border border-duck-acid rounded-xl">
                            <Flame size={14} className="text-duck-ink" />
                            <span className="text-[10px] font-bold text-duck-ink">{activeEvents.length} actief event</span>
                        </div>
                    )}
                </div>
            )}

            {/* VROEGE SIGNALERING - Collapsible */}
            {(() => {
                const signalStudents = displayedStudents
                    .map(s => {
                        const xp = s.stats?.xp || 0;
                        const lastActiveMs = s.lastActive?.toDate?.()?.getTime() || 0;
                        const daysSinceActive = lastActiveMs > 0 ? Math.floor((now - lastActiveMs) / oneDay) : null;
                        const missionsCompleted = s.stats?.missionsCompleted?.length || 0;

                        // Determine reason for signal
                        if (xp < 50) return { student: s, reason: `${xp} XP — nog niet op gang`, tone: 'warning' as const };
                        if (daysSinceActive !== null && daysSinceActive > 7 && xp >= 50)
                            return { student: s, reason: `${daysSinceActive} dagen inactief — ${missionsCompleted} missie${missionsCompleted !== 1 ? 's' : ''} afgerond`, tone: 'attention' as const };
                        if (xp < 100 && missionsCompleted === 0)
                            return { student: s, reason: `${xp} XP — nog geen missie afgerond`, tone: 'attention' as const };
                        return null;
                    })
                    .filter((x): x is NonNullable<typeof x> => x !== null)
                    .sort((a, b) => (a.tone === 'warning' ? -1 : 1) - (b.tone === 'warning' ? -1 : 1))
                    .slice(0, 5);

                const hasSignals = signalStudents.length > 0;

                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-duck-ink/15 overflow-hidden">
                        <button
                            onClick={() => setExpandedSignaling(!expandedSignaling)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-lg flex items-center justify-center ${hasSignals ? 'bg-duck-acid' : 'bg-duck-ink'}`}>
                                    {hasSignals
                                        ? <AlertTriangle size={16} className="text-duck-ink" />
                                        : <CheckCircle2 size={16} className="text-duck-ink" />
                                    }
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-duck-ink uppercase tracking-widest text-balance">
                                        Vroege Signalering
                                    </h3>
                                    {!expandedSignaling && (
                                        <p className="text-[10px] text-duck-ink/60 mt-0.5">
                                            {hasSignals ? `${signalStudents.length} leerling${signalStudents.length !== 1 ? 'en' : ''} verdien${signalStudents.length !== 1 ? 'en' : 't'} aandacht` : 'Iedereen ligt op koers'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {hasSignals && (
                                    <span className="inline-flex items-center justify-center size-5 rounded-full bg-duck-error text-[10px] font-black text-white tabular-nums">
                                        {signalStudents.length}
                                    </span>
                                )}
                                <ChevronDown size={18} className={`text-duck-ink/60 transition-transform ${expandedSignaling ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedSignaling && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-5 pb-5 space-y-2"
                                >
                                    {signalStudents.map(({ student, reason, tone }) => (
                                        <button
                                            key={student.uid}
                                            type="button"
                                            className={`w-full p-3 rounded-xl flex items-center justify-between group transition-colors text-left ${
                                                tone === 'warning'
                                                    ? 'bg-duck-acid border border-duck-acid hover:bg-duck-acid hover:text-duck-ink'
                                                    : 'bg-duck-bg border border-duck-ink/15 hover:bg-duck-bg'
                                            }`}
                                            onClick={() => onSelectStudent?.(student)}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`size-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    tone === 'warning' ? 'bg-duck-acid text-duck-ink' : 'bg-duck-bg text-duck-ink/60'
                                                }`}>
                                                    <GraduationCap size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-duck-ink truncate">{student.displayName}</div>
                                                    <div className={`text-[10px] mt-0.5 ${tone === 'warning' ? 'text-duck-ink' : 'text-duck-ink/60'}`}>{reason}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${
                                                    tone === 'warning'
                                                        ? 'text-duck-ink bg-white border-duck-acid'
                                                        : 'text-duck-ink/60 bg-white border-duck-ink/15'
                                                }`}>
                                                    Begeleid
                                                </span>
                                                <ChevronRight size={14} className="text-duck-ink/60 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </button>
                                    ))}
                                    {!hasSignals && (
                                        <div className="flex flex-col items-center py-6 gap-2">
                                            <div className="size-10 rounded-full bg-duck-ink flex items-center justify-center">
                                                <CheckCircle2 size={20} className="text-duck-ink" />
                                            </div>
                                            <p className="text-sm font-bold text-duck-ink/60 text-balance text-center">Iedereen ligt op koers</p>
                                            <p className="text-[11px] text-duck-ink/60 text-center text-pretty max-w-xs">Geen leerlingen die extra aandacht nodig hebben op dit moment.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })()}

            {/* SLO KERNDOELEN DIGITALE GELETTERDHEID - Collapsible */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-duck-ink/15/50 border border-duck-ink/15 overflow-hidden">
                <button
                    onClick={() => setExpandedSlo(!expandedSlo)}
                    className="w-full p-6 text-left flex items-center justify-between"
                >
                    <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-duck-error rounded-full"></div>
                        SLO Kerndoelen Digitale Geletterdheid
                    </h3>
                    <div className="flex items-center gap-4">
                        {!expandedSlo && (
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-3 h-3 bg-duck-error border border-duck-error rounded"></div>
                                <span className="text-[9px] font-bold text-duck-ink/60 uppercase">Moeite</span>
                                <div className="w-3 h-3 bg-duck-ink border border-duck-ink rounded ml-2"></div>
                                <span className="text-[9px] font-bold text-duck-ink/60 uppercase">Beheerst</span>
                            </div>
                        )}
                        <ChevronDown size={20} className={`text-duck-ink/60 transition-transform ${expandedSlo ? 'rotate-180' : ''}`} />
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
                            <div className="bg-duck-error border border-duck-error rounded-xl p-4 mb-6">
                                <p className="text-sm text-duck-error leading-relaxed">
                                    <strong>📚 SLO Kerndoelen</strong> Dit overzicht toont de voortgang per officieel kerndoel Digitale Geletterdheid (SLO 2025).
                                    Georganiseerd in <strong>3 domeinen</strong> met <strong>9 leerdoelen</strong>. <span className="text-duck-error font-bold">Rood = extra aandacht nodig</span>.
                                </p>
                            </div>

                            {conceptFilter && (
                                <div className="mb-4 flex items-center justify-between bg-duck-error p-2 rounded-xl border border-duck-error">
                                    <span className="text-xs font-bold text-duck-error">Filter actief: {conceptFilter}</span>
                                    <button onClick={onResetFilters} className="text-[9px] font-black text-duck-error uppercase border border-duck-error px-2 py-1 rounded-lg hover:bg-duck-error hover:text-white transition-colors">Reset Filter</button>
                                </div>
                            )}

                            {/* DOMAIN-GROUPED GOALS */}
                            <div className="space-y-6">
                                {[
                                    { id: 'practical', title: 'Praktische kennis & vaardigheden', description: 'Hoe leerlingen digitale technologie en digitale media functioneel inzetten', color: 'indigo' },
                                    { id: 'creation', title: 'Ontwerpen & maken', description: 'Digitale producten creëren en programmeren', color: 'emerald' },
                                    { id: 'digital-world', title: 'De gedigitaliseerde wereld', description: 'Participeren in de gedigitaliseerde wereld met kritisch bewustzijn', color: 'amber' },
                                ].map(domain => {
                                    const domainGoals = sloProgress.filter(g => g.domainId === domain.id);
                                    const avgDomainScore = domainGoals.length > 0
                                        ? Math.round(domainGoals.reduce((sum, g) => sum + g.score, 0) / domainGoals.length)
                                        : 0;

                                    const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
                                        'indigo': { bg: 'bg-duck-error', border: 'border-duck-error', text: 'text-duck-error', light: 'bg-duck-error' },
                                        'emerald': { bg: 'bg-duck-error', border: 'border-duck-ink', text: 'text-duck-ink', light: 'bg-duck-ink' },
                                        'amber': { bg: 'bg-duck-error', border: 'border-duck-acid', text: 'text-duck-ink', light: 'bg-duck-acid' }
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
                                                        <p className="text-[10px] text-duck-ink/60">{domain.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-black ${avgDomainScore < 50 ? 'text-duck-error' : avgDomainScore >= 75 ? 'text-duck-ink' : 'text-duck-ink'}`}>
                                                        {avgDomainScore}%
                                                    </span>
                                                    <span className="text-[9px] font-bold text-duck-ink/60 uppercase">gemiddeld</span>
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
                                                                className={`p-3 rounded-xl bg-duck-bg border transition-all cursor-pointer active:scale-95 ${conceptFilter === item.title ? 'border-duck-error ring-2 ring-duck-error/20' : 'border-duck-ink/15 hover:border-duck-ink/15'}`}
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.score < 50 ? 'bg-duck-error text-white' : item.score >= 75 ? 'bg-duck-ink text-white' : 'bg-duck-acid text-duck-ink'}`}>
                                                                        <Icon size={14} />
                                                                    </div>
                                                                    <span className={`text-lg font-black ${item.score < 50 ? 'text-duck-error' : item.score >= 75 ? 'text-duck-ink' : 'text-duck-ink'}`}>
                                                                        {item.score}%
                                                                    </span>
                                                                </div>
                                                                <div className="text-[10px] font-bold text-duck-ink/60 mb-0.5 line-clamp-1">{item.title}</div>
                                                                <div className="text-[9px] text-duck-ink/60 line-clamp-1">{item.description}</div>
                                                                {item.score < 50 && (
                                                                    <div className="mt-2 text-[8px] font-bold text-duck-error flex items-center gap-1">
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
                <div className="bg-white rounded-[2rem] shadow-xl shadow-duck-ink/15/50 border border-duck-ink/15 overflow-hidden">
                    <button
                        onClick={() => setExpandedComparison(!expandedComparison)}
                        className="w-full p-6 text-left flex items-center justify-between"
                    >
                        <h3 className="text-sm font-black text-duck-ink/60 uppercase tracking-widest">Klas Vergelijking (Gem. XP)</h3>
                        <ChevronDown size={20} className={`text-duck-ink/60 transition-transform ${expandedComparison ? 'rotate-180' : ''}`} />
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
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-duck-ink text-white text-[10px] font-bold px-2 py-1 rounded mb-1">{cls.avgXP} XP</div>
                                                <div
                                                    className={`w-full rounded-t-xl transition-all ${i % 3 === 0 ? 'bg-duck-error' : i % 3 === 1 ? 'bg-duck-error' : 'bg-duck-error'
                                                        } hover:brightness-110 shadow-sm`}
                                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                                ></div>
                                                <div className="text-[10px] font-black text-duck-ink/60 uppercase">{cls.name}</div>
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
