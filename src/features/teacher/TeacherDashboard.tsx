
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/services/supabase';
import { ParentUser, UserStats, StudentData, GamificationEvent, ClassroomConfig, HybridAssessmentRecord, TeacherDashboardTab } from '@/types';
import {
    Award, BarChart3, Bell, BookOpen, Check, ChevronDown, ChevronRight,
    Download, Folder, LogOut, Presentation, RotateCcw, Send,
    Settings, ShieldCheck, Sparkles, Stars, TrendingUp, Users, Zap
} from 'lucide-react';
import { GoudenPromptGallery } from '@/features/teacher/GoudenPromptGallery';
import {
    sendMessage, resetStudentProgress, awardBadge, awardXP,
    getClassSettings, updateClassSettings, createEvent, getActiveEvents, endEvent,
    getClassroomConfig, updateClassroomConfig, highlightWork, deleteStudent
} from '@/services/teacherService';
import { getMissionsForYear } from '@/config/missions';
import { StudentList } from '@/features/teacher/StudentList';
import { EventsPanel } from '@/features/teacher/EventsPanel';
import { Leaderboard } from '@/features/teacher/Leaderboard';
import { SettingsPanel } from '@/features/teacher/SettingsPanel';
import { AiBeleidFeedbackPanel } from '@/features/teacher/AiBeleidFeedbackPanel';
import { GamesPanel } from '@/features/teacher/GamesPanel';
import { FeedbackPanel } from '@/features/teacher/FeedbackPanel';
import { MissionProgressPanel } from '@/features/teacher/MissionProgressPanel';
import { SLOClassOverview } from '@/features/teacher/SLOClassOverview';
import { HybridAssessmentPanel } from '@/features/teacher/HybridAssessmentPanel';
import { GrowthOverviewPanel } from '@/features/teacher/GrowthOverviewPanel';
import { EindmetingReleaseButton } from '@/features/teacher/EindmetingReleaseButton';
import { TutorialProvider } from '@/contexts/TutorialContext';
import TutorialSpotlight, { TutorialRestartButton } from '@/features/teacher/TutorialSpotlight';

import { TeacherModals } from '@/features/teacher/dashboard/TeacherModals';
import { TeacherCommandCenter } from '@/features/teacher/dashboard/TeacherCommandCenter';
import { TeacherDocumentsPanel } from '@/features/teacher/TeacherDocumentsPanel';
import { SchedulingConfigurator } from '@/features/coordinator/SchedulingConfigurator';
import { downloadCsv } from '@/utils/csvExport';

// Lazy loaded panels
const LazyDigitaalPaspoortTeacher = lazy(() => import('@/features/assessment/escaperoom/DigitaalPaspoortTeacher').then(m => ({ default: m.DigitaalPaspoortTeacher })));
const LazySamenhangMatrix = lazy(() => import('@/features/teacher/SamenhangMatrix').then(m => ({ default: m.SamenhangMatrix })));

// Tab type definitions
type MainTab = TeacherDashboardTab;
type GamificationTab = 'leaderboard' | 'gallery' | 'events';
type MessageTargetType = 'student' | 'class' | 'all';

interface TeacherDashboardProps {
    user?: ParentUser | null;
    onUpdateStats?: (stats: UserStats) => void;
    onViewAssignments?: () => void;
    onLogout?: () => void;
    onOpenGames?: (gameId?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onUpdateStats, onViewAssignments, onLogout, onOpenGames }) => {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<MainTab>('overview');
    const [showPresentation, setShowPresentation] = useState(false);
    const [gamificationSubTab, setGamificationSubTab] = useState<GamificationTab>('leaderboard');
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [classFilter, setClassFilter] = useState<string>(() => {
        try { return sessionStorage.getItem('dgskills_teacher_classFilter') || 'all'; } catch { return 'all'; }
    });
    const [yearGroupFilter, setYearGroupFilter] = useState<number>(() => {
        try { const v = sessionStorage.getItem('dgskills_teacher_yearGroup'); return v ? Number(v) : 1; } catch { return 1; }
    });

    // Modals
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showHighlightModal, setShowHighlightModal] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [focusModeClassId, setFocusModeClassId] = useState<string | null>(null);
    const [showFocusMissionModal, setShowFocusMissionModal] = useState(false);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    const classDropdownRef = useRef<HTMLDivElement | null>(null);
    const [classRoomConfig, setClassRoomConfig] = useState<ClassroomConfig | null>(null);
    const [showLiveModal, setShowLiveModal] = useState(false);
    const [showSchedulingConfig, setShowSchedulingConfig] = useState(false);

    // Focus mode
    const [focusModeRemaining, setFocusModeRemaining] = useState<number>(0);
    const FOCUS_MODE_MAX_DURATION = 1 * 60 * 60; // Max 1 hour
    const focusStartTimeRef = useRef<number>(Date.now());
    const focusTimeoutHandledRef = useRef<boolean>(false);

    // Delete State
    const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast State
    const [toasts, setToasts] = useState<{ id: string; title: string; message: string; type: 'error' | 'success' | 'info' | 'warning'; studentUid?: string }[]>([]);

    // Form states
    const [messageText, setMessageText] = useState('');
    const [messageTarget, setMessageTarget] = useState<MessageTargetType>('all');
    const [messageTargetStudentId, setMessageTargetStudentId] = useState<string>('');
    const [messageTargetClassId, setMessageTargetClassId] = useState<string>('');
    const [selectedBadge, setSelectedBadge] = useState<string>('');
    const [eventName, setEventName] = useState('');
    const [eventMultiplier, setEventMultiplier] = useState(2);
    const [eventDuration, setEventDuration] = useState(60);
    const [highlightTitle, setHighlightTitle] = useState('');
    const [highlightContent, setHighlightContent] = useState('');
    const [highlightNote, setHighlightNote] = useState('');

    // Active data
    const [activeEvents, setActiveEvents] = useState<GamificationEvent[]>([]);
    const [hybridAssessments, setHybridAssessments] = useState<HybridAssessmentRecord[]>([]);
    const [enabledMissions, setEnabledMissions] = useState<string[]>([]);
    const classGroups = useMemo(() => {
        const groups = new Set<string>();
        students.forEach(s => {
            const cls = s.studentClass || s.stats?.studentClass;
            if (cls) groups.add(cls);
        });
        return Array.from(groups).sort();
    }, [students]);
    const classOptions = useMemo(() => ['all', ...classGroups], [classGroups]);

    const yearMissions = useMemo(() => getMissionsForYear(yearGroupFilter), [yearGroupFilter]);
    const selectedClassId = classFilter === 'all' ? null : classFilter;

    // Persist filter choices across page reloads
    useEffect(() => { try { sessionStorage.setItem('dgskills_teacher_classFilter', classFilter); } catch { /* noop */ } }, [classFilter]);
    useEffect(() => { try { sessionStorage.setItem('dgskills_teacher_yearGroup', String(yearGroupFilter)); } catch { /* noop */ } }, [yearGroupFilter]);

    useEffect(() => {
        if (!classDropdownOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!classDropdownRef.current?.contains(event.target as Node)) {
                setClassDropdownOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [classDropdownOpen]);

    const [retryCount, setRetryCount] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const refetchStudentsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const refetchAssessmentsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const addToast = (title: string, message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info', studentUid?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, title, message, type, studentUid }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    // Supabase Sync
    useEffect(() => {
        setLoading(true);
        if (retryCount === 0) setError(null);

        const fetchStudents = async () => {
            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'student');
            if (fetchError) {
                console.error(fetchError);
                if (retryCount < 3) {
                    setTimeout(() => setRetryCount(prev => prev + 1), 1500);
                    return;
                }
                setError('Fout bij laden gegevens.');
                setLoading(false);
                return;
            }
            const studentList = (data || []) as unknown as StudentData[];
            studentList.sort((a, b) => {
                const bTime = (b as any).last_login ? new Date((b as any).last_login).getTime() : 0;
                const aTime = (a as any).last_login ? new Date((a as any).last_login).getTime() : 0;
                return bTime - aTime;
            });
            setStudents(studentList);
            setLastUpdated(new Date());
            setLoading(false);
            if (retryCount > 0) setRetryCount(0);
        };

        fetchStudents();

        const channel = supabase
            .channel('teacher-students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: 'role=eq.student' }, () => {
                if (refetchStudentsTimeoutRef.current) clearTimeout(refetchStudentsTimeoutRef.current);
                refetchStudentsTimeoutRef.current = setTimeout(() => {
                    fetchStudents();
                }, 500);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (refetchStudentsTimeoutRef.current) clearTimeout(refetchStudentsTimeoutRef.current);
        };
    }, [retryCount]);

    useEffect(() => {
        getActiveEvents(user?.schoolId).then(setActiveEvents).catch(console.error);

        const fetchAssessments = async () => {
            const { data } = await supabase
                .from('hybrid_assessments')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(100);
            if (data) setHybridAssessments(data as unknown as HybridAssessmentRecord[]);
        };
        fetchAssessments();

        const channel = supabase
            .channel('teacher-assessments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hybrid_assessments' }, () => {
                if (refetchAssessmentsTimeoutRef.current) clearTimeout(refetchAssessmentsTimeoutRef.current);
                refetchAssessmentsTimeoutRef.current = setTimeout(() => {
                    fetchAssessments();
                }, 500);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (refetchAssessmentsTimeoutRef.current) clearTimeout(refetchAssessmentsTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        // Load per-class settings when a class is selected.
        if (!selectedClassId || !user?.schoolId) {
            setEnabledMissions(yearMissions.map(m => m.id));
            return;
        }

        let active = true;
        getClassSettings(user.schoolId, selectedClassId)
            .then((settings) => {
                if (!active) return;
                setEnabledMissions(settings?.enabled_missions?.length ? settings.enabled_missions : yearMissions.map(m => m.id));
            })
            .catch((err) => {
                console.error(err);
                if (active) setEnabledMissions(yearMissions.map(m => m.id));
            });

        return () => {
            active = false;
        };
    }, [selectedClassId, user?.schoolId, yearMissions]);

    useEffect(() => {
        // Keep dashboard config aligned with the selected class (used by SettingsPanel).
        if (!selectedClassId || !user?.schoolId) {
            setClassRoomConfig(null);
            setFocusMode(false);
            setFocusModeClassId(null);
            return;
        }

        let active = true;
        getClassroomConfig(user.schoolId, selectedClassId)
            .then((config) => {
                if (!active) return;
                setClassRoomConfig(config);
                if (config?.focusMode) {
                    void updateClassroomConfig(user.schoolId!, selectedClassId, { focusMode: false });
                }
                setFocusMode(false);
                setFocusModeClassId(null);
            })
            .catch(console.error);

        return () => {
            active = false;
        };
    }, [selectedClassId, user?.schoolId]);

    // Focus Mode Timer (Hard limit of 1 hour)
    useEffect(() => {
        if (!focusMode) {
            setFocusModeRemaining(0);
            focusTimeoutHandledRef.current = false;
            return;
        }

        focusTimeoutHandledRef.current = false;
        const checkDuration = async () => {
            const elapsed = Math.floor((Date.now() - focusStartTimeRef.current) / 1000);
            const remaining = FOCUS_MODE_MAX_DURATION - elapsed;

            if (remaining <= 0) {
                if (focusTimeoutHandledRef.current) return;
                focusTimeoutHandledRef.current = true;
                setFocusMode(false);
                setFocusModeRemaining(0);
                if (focusModeClassId && user?.schoolId) {
                    await updateClassroomConfig(user.schoolId, focusModeClassId, { focusMode: false });
                }
                addToast('Focus Modus', 'Automatisch uitgeschakeld na 1 uur.', 'info');
                return;
            }

            setFocusModeRemaining(remaining);
        };

        void checkDuration();
        const interval = setInterval(() => {
            void checkDuration();
        }, 1000);

        return () => clearInterval(interval);
    }, [focusMode, focusModeClassId, user?.schoolId]);

    // Handlers
    const handleToggleMission = async (missionId: string) => {
        if (classFilter === 'all') {
            addToast('Selecteer een klas', 'Kies eerst een klas om missies te beheren.', 'warning');
            return;
        }

        const next = enabledMissions.includes(missionId)
            ? enabledMissions.filter(id => id !== missionId)
            : [...enabledMissions, missionId];

        setEnabledMissions(next);
        if (!user?.schoolId) {
            addToast('School ontbreekt', 'Klasinstellingen kunnen niet zonder school worden opgeslagen.', 'error');
            return;
        }

        const ok = await updateClassSettings(user.schoolId, classFilter, { enabled_missions: next });
        if (!ok) addToast('Fout', 'Kon missie-instellingen niet opslaan.', 'error');
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        const targetId = messageTarget === 'student' ? messageTargetStudentId : (messageTarget === 'class' ? messageTargetClassId : 'all');
        const success = await sendMessage({
            target_type: messageTarget,
            target_id: targetId,
            sender_name: 'Docent',
            text: messageText,
            school_id: user?.schoolId
        });
        if (success) {
            setMessageText('');
            setShowMessageModal(false);
            addToast('Gelukt', 'Bericht verzonden.', 'success');
        }
    };

    const handleAwardBadge = async () => {
        if (!selectedStudent || !selectedBadge) return;
        if (await awardBadge(selectedStudent.uid, selectedBadge)) {
            setShowBadgeModal(false);
            addToast('Gelukt', 'Badge toegekend.', 'success');
        }
    };

    const handleResetStudent = async () => {
        if (!selectedStudent) return;
        if (await resetStudentProgress(selectedStudent.uid)) {
            setShowResetConfirm(false);
            setSelectedStudent(null);
            addToast('Gelukt', 'Voortgang gereset.', 'info');
        }
    };

    const handleCreateEvent = async () => {
        if (!eventName.trim()) return;
        const now = new Date();
        const end = new Date(now.getTime() + eventDuration * 60 * 1000);
        const success = await createEvent({
            type: 'xp_boost',
            name: eventName,
            multiplier: eventMultiplier,
            targetClass: classFilter !== 'all' ? classFilter : undefined,
            schoolId: user?.schoolId,
            startTime: { toMillis: () => now.getTime() } as any,
            endTime: { toMillis: () => end.getTime() } as any,
            active: true
        });
        if (success) {
            setShowEventModal(false);
            setEventName('');
            getActiveEvents(user?.schoolId).then(setActiveEvents);
            addToast('Event gestart', eventName, 'success');
        }
    };

    const handleHighlightWork = async () => {
        if (!selectedStudent) return;
        await highlightWork({
            uid: selectedStudent.uid,
            schoolId: user?.schoolId,
            studentName: selectedStudent.displayName || 'Naamloos',
            missionId: 'unknown',
            title: highlightTitle || 'Kroon op het Werk',
            content: highlightContent || 'Voorbeeldwerk',
            teacherNote: highlightNote || 'Top!'
        });
        setShowHighlightModal(false);
        addToast('Gelukt', 'Toegevoegd aan gallery.', 'success');
    };

    const handleDeleteStudent = (student: StudentData) => {
        setStudentToDelete(student);
        if (selectedStudent?.uid === student.uid) setSelectedStudent(null);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        setIsDeleting(true);
        if (await deleteStudent(studentToDelete.uid)) {
            addToast('Verwijderd', studentToDelete.displayName || '', 'info');
            setStudentToDelete(null);
        }
        setIsDeleting(false);
    };

    const handleToggleFocusMode = async () => {
        if (focusMode) {
            setFocusMode(false);
            setFocusModeRemaining(0);
            if (focusModeClassId && user?.schoolId) {
                await updateClassroomConfig(user.schoolId, focusModeClassId, { focusMode: false });
            }
            setFocusModeClassId(null);
        } else {
            setShowFocusMissionModal(true);
        }
    };

    const handleFocusMissionSelect = async (missionId: string, missionTitle: string, selectedClass?: string) => {
        if (!selectedClass) {
            addToast('Selecteer een klas', 'Focusmodus kan niet zonder klas worden geactiveerd.', 'warning');
            return;
        }
        if (!user?.schoolId) {
            addToast('School ontbreekt', 'Focusmodus kan niet zonder school worden opgeslagen.', 'error');
            return;
        }

        setFocusMode(true);
        setFocusModeClassId(selectedClass);
        focusStartTimeRef.current = Date.now();
        await updateClassroomConfig(user.schoolId, selectedClass, {
            focusMode: true,
            focusMissionId: missionId,
            focusMissionTitle: missionTitle
        });
        setShowFocusMissionModal(false);
        addToast('Focus Modus', missionTitle, 'info');
    };

    const exportCSV = () => {
        const headers = ['Naam', 'Leerlingnummer', 'XP', 'Level', 'Missies', 'Laatst'];
        const filtered = students.filter(s => {
            const matchesSearch = (s.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesClass = classFilter === 'all' || s.studentClass === classFilter || s.identifier?.startsWith(classFilter);
            return matchesSearch && matchesClass;
        });
        const rows = filtered.map(s => [s.displayName || '?', s.identifier, s.stats?.xp || 0, s.stats?.level || 1, s.stats?.missionsCompleted?.length || 0, (s as any).last_active ? new Date((s as any).last_active).toLocaleString() : '-']);
        downloadCsv(`export-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    };

    const dashboardStudents = students.filter(s => classFilter === 'all' || s.studentClass === classFilter || s.identifier?.startsWith(classFilter));
    const selectedClassLabel = classFilter === 'all' ? 'Alle klassen' : classFilter;
    const attentionCount = dashboardStudents.filter(s => {
        const lastActiveValue = s.lastActive || (s as any).last_active || (s as any).last_login;
        const lastActiveMs = typeof lastActiveValue === 'string'
            ? new Date(lastActiveValue).getTime()
            : typeof lastActiveValue?.toDate === 'function'
                ? lastActiveValue.toDate().getTime()
                : 0;
        const inactiveDays = lastActiveMs > 0 ? Math.floor((Date.now() - lastActiveMs) / (24 * 60 * 60 * 1000)) : 99;
        return inactiveDays > 7 || (s.stats?.xp || 0) < 50;
    }).length;

    const navigateTo = (tab: MainTab) => {
        setActiveTab(tab);
    };

    const sideNavItems: { id: MainTab; label: string; icon: typeof BarChart3; badge?: number }[] = [
        { id: 'overview', label: 'Overzicht', icon: BarChart3, badge: attentionCount },
        { id: 'students', label: 'Leerlingen', icon: Users },
        { id: 'games', label: 'Missies', icon: BookOpen },
        { id: 'slo', label: 'SLO-dekking', icon: ShieldCheck },
        { id: 'progress', label: 'Rapporten', icon: TrendingUp },
        { id: 'documenten', label: 'Documenten', icon: Folder },
        { id: 'settings', label: 'Beheer', icon: Settings },
    ];

    return (
        <TutorialProvider
            isCompleted={user?.stats?.hasCompletedTeacherTutorial}
            onComplete={() => {
                if (user && onUpdateStats) {
                    onUpdateStats({
                        ...user.stats,
                        hasCompletedTeacherTutorial: true
                    } as UserStats);
                }
            }}
        >
            <TutorialSpotlight />
            <div className="min-h-screen overflow-x-hidden bg-lab-cream text-lab-ink">
                {/* Toasts */}
                <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map(t => (
                            <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-xl bg-white border border-[#E7D8BD] flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${t.type === 'error' ? 'bg-lab-coral text-white' : 'bg-[#F3E4CB] text-[#D97848]'}`}><Stars size={20} /></div>
                                <div><h4 className="font-bold text-[#08283B] text-sm">{t.title}</h4><p className="text-[#445865] text-xs mt-0.5">{t.message}</p></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="min-h-screen lg:grid lg:grid-cols-[216px_minmax(0,1fr)]">
                    <aside className="hidden border-r border-lab-line bg-lab-paper lg:flex lg:flex-col">
                        <div className="flex h-[76px] items-center gap-3 border-b border-lab-line px-5">
                            <img src="/logo.webp" alt="" className="size-11 shrink-0 object-contain" width={44} height={44} decoding="async" />
                            <span className="text-2xl font-black text-lab-ink">DGSkills</span>
                        </div>
                        <nav className="flex-1 space-y-2 px-4 py-5">
                            {sideNavItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={`${item.label}-${index}`}
                                        onClick={() => navigateTo(item.id)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                                            isActive
                                                ? 'bg-lab-primary/15 text-lab-primary'
                                                : 'text-lab-muted hover:bg-lab-cream'
                                        }`}
                                    >
                                        <Icon size={19} />
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge ? (
                                            <span className="rounded-full bg-lab-primary px-2 py-0.5 text-[10px] font-black text-white">{item.badge}</span>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="px-4 pb-5">
                            <button
                                onClick={() => navigateTo('documenten')}
                                className="flex w-full items-center gap-3 rounded-xl border border-lab-line bg-lab-cream/60 px-3 py-3 text-left text-xs font-bold text-lab-muted transition hover:bg-lab-cream"
                            >
                                <BookOpen size={20} />
                                <span className="flex-1">DGSkills<br />Kennisbank</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <header className="sticky top-0 z-40 border-b border-lab-line bg-lab-paper/95 backdrop-blur">
                            <div className="flex min-h-[76px] min-w-0 flex-wrap items-center gap-2 px-4 py-3 sm:flex-nowrap lg:px-7 lg:py-0">
                                <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
                                    <img src="/logo.webp" alt="" className="size-10 shrink-0 object-contain" width={40} height={40} decoding="async" />
                                    <span className="truncate text-xl font-black text-lab-ink">DGSkills</span>
                                </div>

                                <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                                    <div ref={classDropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setClassDropdownOpen((open) => !open)}
                                            className="flex h-11 min-w-[142px] max-w-[172px] items-center justify-between gap-2 rounded-xl border border-lab-line bg-lab-cream px-3 text-left text-sm font-black text-lab-ink outline-none transition hover:border-lab-sage sm:h-12 sm:min-w-[172px] sm:px-4"
                                            aria-haspopup="listbox"
                                            aria-expanded={classDropdownOpen}
                                            aria-label="Selecteer klas"
                                        >
                                            <span className="truncate">{selectedClassLabel}</span>
                                            <ChevronDown size={17} className={`shrink-0 text-lab-muted transition-transform ${classDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {classDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    transition={{ duration: 0.12 }}
                                                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-lab-line bg-lab-paper p-1 shadow-lg"
                                                    role="listbox"
                                                >
                                                    {classOptions.map(option => {
                                                        const label = option === 'all' ? 'Alle klassen' : option;
                                                        const isSelected = option === classFilter;
                                                        return (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => {
                                                                    setClassFilter(option);
                                                                    setClassDropdownOpen(false);
                                                                }}
                                                                className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-bold transition ${
                                                                    isSelected
                                                                        ? 'bg-lab-primary/15 text-lab-primary'
                                                                        : 'text-lab-muted hover:bg-lab-cream hover:text-lab-ink'
                                                                }`}
                                                                role="option"
                                                                aria-selected={isSelected}
                                                            >
                                                                <span className="flex-1 truncate">{label}</span>
                                                                {isSelected && <Check size={16} />}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <button className="relative hidden h-11 w-11 items-center justify-center rounded-full text-lab-ink hover:bg-lab-cream sm:flex" aria-label="Meldingen">
                                        <Bell size={22} />
                                        {attentionCount > 0 && (
                                            <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lab-primary px-1 text-[10px] font-black text-white">
                                                {attentionCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowPresentation(true)}
                                        className="hidden h-11 items-center gap-2 rounded-xl bg-lab-primary px-4 text-sm font-black text-white transition hover:bg-lab-primaryDark md:flex"
                                    >
                                        <Presentation size={17} />
                                        Presentatie
                                    </button>
                                    {onLogout && (
                                        <button onClick={onLogout} className="flex h-11 w-11 items-center justify-center rounded-full bg-lab-cream text-lab-muted hover:text-lab-coral" aria-label="Uitloggen">
                                            <LogOut size={18} />
                                        </button>
                                    )}
                                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lab-gold/35 text-sm font-black text-lab-ink min-[430px]:flex">
                                        {user?.displayName?.charAt(0)?.toUpperCase() || 'D'}
                                    </div>
                                </div>
                            </div>
                        </header>

                        {error && <div className="m-4 rounded-xl border border-lab-coral bg-lab-coral p-4 text-sm text-lab-coral">{error}</div>}

                        <main className="min-w-0 p-4 lg:p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <PageTransition key="overview">
                                        <TeacherCommandCenter
                                            students={students}
                                            activeEvents={activeEvents}
                                            loading={loading}
                                            classFilter={classFilter}
                                            onClassFilterChange={setClassFilter}
                                            availableClasses={classGroups}
                                            yearGroup={yearGroupFilter}
                                            focusMode={focusMode}
                                            focusModeRemaining={focusModeRemaining}
                                            onToggleFocusMode={handleToggleFocusMode}
                                            onNavigate={(tab) => {
                                                if (tab === 'events' || tab === 'leaderboard') {
                                                    setActiveTab('gamification');
                                                    setGamificationSubTab(tab);
                                                } else {
                                                    setActiveTab(tab as MainTab);
                                                }
                                            }}
                                            onSelectStudent={setSelectedStudent}
                                            onSendMessage={() => setShowMessageModal(true)}
                                        />
                                    </PageTransition>
                                )}

                        {activeTab === 'students' && (
                            <PageTransition key="students" className="space-y-4">
                                <div className="bg-white rounded-xl border border-[#E7D8BD] p-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setRetryCount(prev => prev + 1)} className="p-2 text-[#445865] hover:bg-[#FCF6EA] rounded-lg"><RotateCcw size={16} /></button>
                                        <button onClick={exportCSV} className="p-2 text-[#445865] hover:bg-[#FCF6EA] rounded-lg"><Download size={16} /></button>
                                    </div>
                                    <button data-tutorial="students-message-btn" onClick={() => setShowMessageModal(true)} className="px-4 py-2 bg-[#D97848] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#D97848]"><Send size={14} /> Bericht</button>
                                </div>
                                <StudentList
                                    students={students.filter(s => {
                                        const mS = (s.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                                        const mC = classFilter === 'all' || s.studentClass === classFilter || s.identifier?.startsWith(classFilter);
                                        return mS && mC;
                                    })}
                                    loading={loading}
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    classFilter={classFilter}
                                    onClassFilterChange={setClassFilter}
                                    onSelectStudent={setSelectedStudent}
                                    yearGroup={yearGroupFilter}
                                    lastUpdated={lastUpdated}
                                    classroomConfig={classRoomConfig}
                                />
                            </PageTransition>
                        )}

                        {activeTab === 'gamification' && (
                            <PageTransition key="gamification" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex bg-lab-cream p-1 rounded-lg">
                                        {[
                                            { id: 'leaderboard', label: 'Ranglijst', icon: Award },
                                            { id: 'gallery', label: 'Gallery', icon: Stars },
                                            { id: 'events', label: 'Events', icon: Sparkles },
                                        ].map(sub => (
                                            <button key={sub.id} onClick={() => setGamificationSubTab(sub.id as any)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${gamificationSubTab === sub.id ? 'bg-white text-lab-ink shadow-sm' : 'text-lab-muted hover:text-lab-muted'}`}><sub.icon size={14} /> {sub.label}</button>
                                        ))}
                                    </div>
                                    <button data-tutorial="xp-boost-btn" onClick={() => setShowEventModal(true)} className="px-4 py-2 bg-lab-ink text-white rounded-xl text-xs font-bold flex items-center gap-2"><Zap size={14} /> XP Boost</button>
                                </div>
                                {gamificationSubTab === 'leaderboard' && <Leaderboard students={students} />}
                                {gamificationSubTab === 'gallery' && <GoudenPromptGallery schoolId={user?.schoolId} />}
                                {gamificationSubTab === 'events' && <div className="bg-white rounded-[2rem] border border-lab-line overflow-hidden"><EventsPanel activeEvents={activeEvents} onShowModal={() => setShowEventModal(true)} onEndEvent={async id => { await endEvent(id); getActiveEvents(user?.schoolId).then(setActiveEvents); }} /></div>}
                            </PageTransition>
                        )}

                        {activeTab === 'settings' && <PageTransition key="settings" className="space-y-6"><SettingsPanel classFilter={classFilter} onClassFilterChange={setClassFilter} availableClasses={classGroups} enabledMissions={enabledMissions} onToggleMission={handleToggleMission} onTestGame={onOpenGames} yearGroup={yearGroupFilter} classroomConfig={classRoomConfig} onUpdateConfig={async u => {
                            if (!selectedClassId || !user?.schoolId) {
                                addToast('Selecteer een klas', 'Klasconfiguratie kan niet voor alle klassen tegelijk worden opgeslagen.', 'warning');
                                return;
                            }
                            await updateClassroomConfig(user.schoolId, selectedClassId, u);
                            setClassRoomConfig(p => p ? { ...p, ...u } : null);
                        }} onOpenSchedulingConfig={(user?.role === 'admin' || user?.role === 'developer') ? () => setShowSchedulingConfig(true) : undefined} />{onLogout && <button onClick={onLogout} className="w-full py-4 border-2 border-lab-coral text-lab-coral rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lab-coral hover:text-white"><RotateCcw size={18} /> Uitloggen</button>}</PageTransition>}
                        {activeTab === 'games' && <PageTransition key="games"><GamesPanel onOpenGame={onOpenGames || (() => { })} /></PageTransition>}
                        {activeTab === 'ai-beleid' && <PageTransition key="ai-beleid"><div className="bg-white rounded-[2rem] border border-lab-line p-6"><AiBeleidFeedbackPanel classFilter={classFilter !== 'all' ? classFilter : undefined} schoolId={user?.schoolId} /></div></PageTransition>}
                        {activeTab === 'feedback' && <PageTransition key="feedback"><FeedbackPanel schoolId={user?.schoolId} /></PageTransition>}
                        {activeTab === 'progress' && <PageTransition key="progress" className="space-y-6"><MissionProgressPanel students={students} classFilter={classFilter} availableClasses={classGroups} onClassFilterChange={setClassFilter} onSelectStudent={setSelectedStudent} yearGroup={yearGroupFilter} /><HybridAssessmentPanel records={hybridAssessments} classFilter={classFilter} /><GrowthOverviewPanel studentIds={students.filter(s => classFilter === 'all' || s.studentClass === classFilter).map(s => s.uid)} /></PageTransition>}
                        {activeTab === 'slo' && <PageTransition key="slo"><SLOClassOverview students={students} schoolId={user?.schoolId} selectedYear={yearGroupFilter} /></PageTransition>}
                        {activeTab === 'nulmeting' && (
                            <PageTransition key="nulmeting" className="space-y-6">
                                <EindmetingReleaseButton classFilter={classFilter} schoolId={user?.schoolId} availableClasses={classGroups} />
                                <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0B453F]" /></div>}>
                                    <LazyDigitaalPaspoortTeacher
                                        klasResults={students
                                            .filter(s => {
                                                const mC = classFilter === 'all' || s.studentClass === classFilter || s.identifier?.startsWith(classFilter);
                                                return mC && s.stats?.nulmetingResult;
                                            })
                                            .map(s => ({
                                                studentName: s.displayName || 'Naamloos',
                                                studentId: s.uid,
                                                result: s.stats!.nulmetingResult!,
                                            }))}
                                    />
                                </Suspense>
                            </PageTransition>
                        )}
                        {activeTab === 'samenhang' && (
                            <PageTransition key="samenhang">
                                <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0B453F]" /></div>}>
                                    <LazySamenhangMatrix selectedYear={yearGroupFilter} schoolId={user?.schoolId} />
                                </Suspense>
                            </PageTransition>
                        )}
                        {activeTab === 'documenten' && <PageTransition key="documenten"><TeacherDocumentsPanel /></PageTransition>}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>

                <TeacherModals
                    showMessageModal={showMessageModal} setShowMessageModal={setShowMessageModal}
                    messageText={messageText} setMessageText={setMessageText}
                    messageTarget={messageTarget} setMessageTarget={setMessageTarget}
                    messageTargetClassId={messageTargetClassId} setMessageTargetClassId={setMessageTargetClassId}
                    messageTargetStudentId={messageTargetStudentId} setMessageTargetStudentId={setMessageTargetStudentId}
                    handleSendMessage={handleSendMessage} classGroups={classGroups} students={students}
                    showBadgeModal={showBadgeModal} setShowBadgeModal={setShowBadgeModal}
                    selectedBadge={selectedBadge} setSelectedBadge={setSelectedBadge}
                    handleAwardBadge={handleAwardBadge} selectedStudent={selectedStudent}
                    showResetConfirm={showResetConfirm} setShowResetConfirm={setShowResetConfirm}
                    handleResetStudent={handleResetStudent}
                    showHighlightModal={showHighlightModal} setShowHighlightModal={setShowHighlightModal}
                    highlightTitle={highlightTitle} setHighlightTitle={setHighlightTitle}
                    highlightContent={highlightContent} setHighlightContent={setHighlightContent}
                    highlightNote={highlightNote} setHighlightNote={setHighlightNote}
                    handleHighlightWork={handleHighlightWork}
                    showEventModal={showEventModal} setShowEventModal={setShowEventModal}
                    eventName={eventName} setEventName={setEventName}
                    eventMultiplier={eventMultiplier} setEventMultiplier={setEventMultiplier}
                    eventDuration={eventDuration} setEventDuration={setEventDuration}
                    handleCreateEvent={handleCreateEvent}
                    studentToDelete={studentToDelete} setStudentToDelete={setStudentToDelete}
                    isDeleting={isDeleting} confirmDelete={confirmDelete}
                    showFocusMissionModal={showFocusMissionModal} setShowFocusMissionModal={setShowFocusMissionModal}
                    handleFocusMissionSelect={handleFocusMissionSelect}
                    yearGroup={yearGroupFilter}
                    showPresentation={showPresentation} setShowPresentation={setShowPresentation}
                    setSelectedStudent={setSelectedStudent} awardXP={awardXP}
                    showLiveModal={showLiveModal} setShowLiveModal={setShowLiveModal}
                    handleDeleteStudent={handleDeleteStudent}
                />

                <TutorialRestartButton />

                {showSchedulingConfig && user?.schoolId && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 pt-12">
                        <div className="bg-[#FCF6EA] rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <SchedulingConfigurator
                                schoolId={user.schoolId}
                                yearGroup={yearGroupFilter}
                                onClose={() => setShowSchedulingConfig(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </TutorialProvider>
    );
};
