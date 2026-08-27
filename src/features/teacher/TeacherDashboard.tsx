
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DuckMark } from '@/components/brand/DuckMark';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/services/supabase';
import { ParentUser, UserStats, StudentData, GamificationEvent, ClassroomConfig, HybridAssessmentRecord, TeacherDashboardTab } from '@/types';
import {
    Award, BarChart3, BookOpen, Check, ChevronDown, ChevronRight,
    Download, Presentation, RotateCcw, Send,
    ShieldCheck, Sparkles, Stars, Upload, Users, Zap
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
import { RosterImportModal } from '@/features/teacher/RosterImportModal';
import { useTourActions, useTourBlocker, useTutorialOptional, type TourActions } from '@/contexts/TutorialContext';

import { TeacherModals } from '@/features/teacher/dashboard/TeacherModals';
import { TeacherCommandCenter } from '@/features/teacher/dashboard/TeacherCommandCenter';
import { TeacherEvidence } from '@/features/teacher/dashboard/TeacherEvidence';
import { TeacherMobileNav, type TeacherNavItem } from '@/features/teacher/dashboard/TeacherMobileNav';
import { TeacherAccountMenu } from '@/features/teacher/dashboard/TeacherAccountMenu';
import { TeacherDocumentsPanel } from '@/features/teacher/TeacherDocumentsPanel';
import { SchedulingConfigurator } from '@/features/coordinator/SchedulingConfigurator';
import { downloadCsv } from '@/utils/csvExport';

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
    demoMode?: boolean;
    demoStudents?: StudentData[];
    /** Ingebed in een geschaalde preview: onderdrukt de mobiele navigatiebalk. */
    embedded?: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onUpdateStats, onViewAssignments, onLogout, onOpenGames, demoMode = false, demoStudents, embedded = false }) => {
    const [students, setStudents] = useState<StudentData[]>(demoMode && demoStudents ? demoStudents : []);
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
    // BEKEND PROBLEEM (buiten scope van deze UI-wijziging): `setYearGroupFilter`
    // wordt nergens aangeroepen — er is geen leerjaarkeuze in de UI, dus dit
    // staat vast op 1. Klassen in leerjaar 2 zien daardoor de missielijst van
    // leerjaar 1 en dus overal 0%.
    // Een leerjaarkeuze toevoegen legt een bestaande inconsistentie bloot in
    // SLOClassOverview.exportToExcel: het detailblad roept
    // calculateStudentKerndoelStats(student, selectedYear) aan, het cumulatieve
    // blad diezelfde functie zónder jaar. Zolang het jaar op 1 vastzit valt dat
    // niet op. Dit raakt inspectiebewijs en hoort daarom in een eigen wijziging
    // met onafhankelijke review, niet in een navigatie-/stijlaanpassing.
    const [yearGroupFilter] = useState<number>(() => {
        try { const v = sessionStorage.getItem('dgskills_teacher_yearGroup'); return v ? Number(v) : 1; } catch { return 1; }
    });

    // Modals
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showRosterImport, setShowRosterImport] = useState(false);
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
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
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
        if (demoMode) {
            setLoading(false);
            return;
        }

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
    }, [retryCount, demoMode]);

    useEffect(() => {
        if (demoMode) return;

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
    }, [demoMode]);

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

    // Drie items, één per docenttaak: monitoren, ingrijpen, verantwoorden.
    // Alles wat niet dagelijks is, staat in het accountmenu in de header.
    const sideNavItems: TeacherNavItem[] = [
        { id: 'overview', label: 'Vandaag', icon: BarChart3, badge: attentionCount },
        { id: 'students', label: 'Leerlingen', icon: Users },
        { id: 'progress', label: 'Bewijs', icon: ShieldCheck },
    ];

    // Panelen uit het accountmenu horen bij geen enkel nav-item: dan is er
    // bewust niets actief in plaats van een item dat je niet gekozen hebt.
    const MENU_TABS: MainTab[] = ['settings', 'games', 'gamification', 'ai-beleid', 'feedback', 'documenten'];
    const navActiveTab: MainTab | null = MENU_TABS.includes(activeTab) ? null : activeTab;

    // De rondleiding stuurt het dashboard aan via deze acties, in plaats van
    // zelf knoppen uit de DOM te vissen en aan te klikken. Die oude aanpak was
    // gekoppeld aan klassenamen die na de duck-migratie niet meer bestonden.
    const tourActions = useMemo<TourActions>(() => ({
        goTo: (area) => {
            const navigable: readonly MainTab[] = ['overview', 'students', 'progress'];
            if (!navigable.includes(area as MainTab)) {
                console.warn(`[rondleiding] onbekend gebied "${area}" — navigatie overgeslagen`);
                return;
            }
            setActiveTab(area as MainTab);
        },
        closeOverlays: () => {
            setShowMessageModal(false);
            setShowEventModal(false);
            setShowBadgeModal(false);
            setShowHighlightModal(false);
            setShowRosterImport(false);
            setShowFocusMissionModal(false);
            setShowLiveModal(false);
            setShowPresentation(false);
            setAccountMenuOpen(false);
            setClassDropdownOpen(false);
            setSelectedStudent(null);
        },
    }), []);
    useTourActions(tourActions);

    // Buiten de app-shell (publieke demo) is er geen rondleiding; dan verdwijnt
    // het menu-item vanzelf omdat `onStartTour` undefined blijft.
    const rondleiding = useTutorialOptional();

    // Zolang een van deze het scherm bezit, verbergt de rondleiding zich en
    // onthoudt hij de stap. Zonder dit bleef de spotlight (z-[9999]) wijzen naar
    // elementen achter een schermvullende presentatie.
    useTourBlocker(
        'teacher-overlay',
        showPresentation || showMessageModal || showEventModal || showBadgeModal
        || showHighlightModal || showRosterImport || showFocusMissionModal
        || showLiveModal || showSchedulingConfig || showResetConfirm
        || selectedStudent !== null || studentToDelete !== null,
    );

    return (
        <>
            <div className="min-h-screen overflow-x-hidden bg-duck-bg text-duck-ink">
                {/* Toasts */}
                <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map(t => (
                            <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-xl bg-white border border-duck-ink/15 flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${t.type === 'error' ? 'bg-duck-error/10 text-duck-error' : 'bg-duck-bg text-duck-error'}`}><Stars size={20} /></div>
                                <div><h4 className="font-bold text-duck-ink text-sm">{t.title}</h4><p className="text-duck-ink/60 text-xs mt-0.5">{t.message}</p></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="min-h-screen lg:grid lg:grid-cols-[216px_minmax(0,1fr)]">
                    <aside className="hidden border-r border-duck-ink/15 bg-duck-bgLight lg:flex lg:flex-col">
                        <div className="flex h-[76px] items-center gap-3 border-b border-duck-ink/15 px-5">
                            <DuckMark className="size-11 shrink-0" />
                            <span className="text-2xl font-black text-duck-ink">DGSkills</span>
                        </div>
                        <nav className="flex-1 space-y-2 px-4 py-5">
                            {sideNavItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = navActiveTab === item.id;
                                return (
                                    <button
                                        key={`${item.label}-${index}`}
                                        data-tutorial={`teacher-nav-${item.id}`}
                                        onClick={() => navigateTo(item.id)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                                            isActive
                                                ? 'bg-duck-acid/20 text-duck-ink'
                                                : 'text-duck-ink/60 hover:bg-duck-bg'
                                        }`}
                                    >
                                        <Icon size={19} />
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge ? (
                                            <span className="rounded-full bg-duck-acid px-2 py-0.5 text-[10px] font-black text-duck-ink">{item.badge}</span>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="px-4 pb-5">
                            <button
                                onClick={() => navigateTo('documenten')}
                                className="flex w-full items-center gap-3 rounded-xl border border-duck-ink/15 bg-duck-bg/60 px-3 py-3 text-left text-xs font-bold text-duck-ink/60 transition hover:bg-duck-bg"
                            >
                                <BookOpen size={20} />
                                <span className="flex-1">DGSkills<br />Kennisbank</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <header className="sticky top-0 z-40 border-b border-duck-ink/15 bg-duck-bgLight/95 backdrop-blur">
                            <div className="flex min-h-[76px] min-w-0 flex-wrap items-center gap-2 px-4 py-3 sm:flex-nowrap lg:px-7 lg:py-0">
                                <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
                                    <DuckMark className="size-10 shrink-0" />
                                    <span className="truncate text-xl font-black text-duck-ink">DGSkills</span>
                                </div>

                                <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                                    <div ref={classDropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setClassDropdownOpen((open) => !open)}
                                            className="flex h-11 min-w-[142px] max-w-[172px] items-center justify-between gap-2 rounded-xl border border-duck-ink/15 bg-duck-bg px-3 text-left text-sm font-black text-duck-ink outline-none transition hover:border-duck-gray sm:h-12 sm:min-w-[172px] sm:px-4"
                                            aria-haspopup="listbox"
                                            aria-expanded={classDropdownOpen}
                                            aria-label="Selecteer klas"
                                            data-tutorial="teacher-class-filter"
                                        >
                                            <span className="truncate">{selectedClassLabel}</span>
                                            <ChevronDown size={17} className={`shrink-0 text-duck-ink/60 transition-transform ${classDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {classDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    transition={{ duration: 0.12 }}
                                                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-duck-ink/15 bg-duck-bgLight p-1 shadow-lg"
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
                                                                        ? 'bg-duck-acid/20 text-duck-ink'
                                                                        : 'text-duck-ink/60 hover:bg-duck-bg hover:text-duck-ink'
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
                                    {/* Geen belicoon: het aantal aandachtspunten staat al op het
                                        Overzicht-navigatie-item én bovenaan het overzicht zelf. */}
                                    <button
                                        data-tutorial="teacher-presentation"
                                        onClick={() => setShowPresentation(true)}
                                        className="hidden h-11 items-center gap-2 rounded-xl bg-duck-acid px-4 text-sm font-black text-duck-ink transition hover:bg-duck-ink hover:text-duck-acid md:flex"
                                    >
                                        <Presentation size={17} />
                                        Presentatie
                                    </button>
                                    {/* Uitloggen zit nu in het accountmenu; één plek in plaats van twee. */}
                                    <TeacherAccountMenu
                                        open={accountMenuOpen}
                                        onToggle={() => setAccountMenuOpen(o => !o)}
                                        onClose={() => setAccountMenuOpen(false)}
                                        initial={user?.displayName?.charAt(0)?.toUpperCase() || 'D'}
                                        displayName={user?.displayName ?? undefined}
                                        onNavigate={navigateTo}
                                        onOpenRosterImport={() => setShowRosterImport(true)}
                                        onOpenPresentation={() => setShowPresentation(true)}
                                        onStartTour={rondleiding?.startTutorial}
                                        onLogout={onLogout}
                                    />
                                </div>
                            </div>
                        </header>

                        {error && <div className="m-4 rounded-xl border border-duck-error bg-duck-error/10 p-4 text-sm text-duck-error">{error}</div>}

                        <main className="min-w-0 p-4 pb-28 lg:p-6 lg:pb-6">
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
                                            onNavigate={navigateTo}
                                            onSelectStudent={setSelectedStudent}
                                            onSendMessage={() => setShowMessageModal(true)}
                                        />
                                    </PageTransition>
                                )}

                        {activeTab === 'students' && (
                            <PageTransition key="students" className="space-y-4">
                                <div className="bg-duck-bgLight rounded-xl border border-duck-ink/15 p-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setRetryCount(prev => prev + 1)} aria-label="Ververs leerlinggegevens" title="Ververs leerlinggegevens" className="p-2 text-duck-ink/60 hover:bg-duck-bg rounded-lg"><RotateCcw size={16} /></button>
                                        <button onClick={exportCSV} aria-label="Exporteer leerlingen als CSV" title="Exporteer leerlingen als CSV" className="p-2 text-duck-ink/60 hover:bg-duck-bg rounded-lg"><Download size={16} /></button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button data-tutorial="teacher-students-import" onClick={() => setShowRosterImport(true)} className="px-4 py-2 bg-duck-bgLight border border-duck-ink/15 text-duck-ink rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-duck-bg"><Upload size={14} /> Importeren</button>
                                        <button data-tutorial="teacher-students-message" onClick={() => setShowMessageModal(true)} className="px-4 py-2 bg-duck-ink text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-duck-ink"><Send size={14} /> Bericht</button>
                                    </div>
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
                                    <div className="flex bg-duck-bg p-1 rounded-lg">
                                        {[
                                            { id: 'leaderboard', label: 'Ranglijst', icon: Award },
                                            { id: 'gallery', label: 'Gallery', icon: Stars },
                                            { id: 'events', label: 'Events', icon: Sparkles },
                                        ].map(sub => (
                                            <button key={sub.id} onClick={() => setGamificationSubTab(sub.id as any)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${gamificationSubTab === sub.id ? 'bg-white text-duck-ink shadow-sm' : 'text-duck-ink/60 hover:text-duck-ink/60'}`}><sub.icon size={14} /> {sub.label}</button>
                                        ))}
                                    </div>
                                    <button data-tutorial="teacher-xp-boost" onClick={() => setShowEventModal(true)} className="px-4 py-2 bg-duck-ink text-white rounded-xl text-xs font-bold flex items-center gap-2"><Zap size={14} /> XP Boost</button>
                                </div>
                                {gamificationSubTab === 'leaderboard' && <Leaderboard students={students} />}
                                {gamificationSubTab === 'gallery' && <GoudenPromptGallery schoolId={user?.schoolId} />}
                                {gamificationSubTab === 'events' && <div className="bg-white rounded-[2rem] border border-duck-ink/15 overflow-hidden"><EventsPanel activeEvents={activeEvents} onShowModal={() => setShowEventModal(true)} onEndEvent={async id => { await endEvent(id); getActiveEvents(user?.schoolId).then(setActiveEvents); }} /></div>}
                            </PageTransition>
                        )}

                        {activeTab === 'settings' && <PageTransition key="settings" className="space-y-6"><SettingsPanel classFilter={classFilter} enabledMissions={enabledMissions} onToggleMission={handleToggleMission} onTestGame={onOpenGames} yearGroup={yearGroupFilter} classroomConfig={classRoomConfig} onUpdateConfig={async u => {
                            if (!selectedClassId || !user?.schoolId) {
                                addToast('Selecteer een klas', 'Klasconfiguratie kan niet voor alle klassen tegelijk worden opgeslagen.', 'warning');
                                return;
                            }
                            await updateClassroomConfig(user.schoolId, selectedClassId, u);
                            setClassRoomConfig(p => p ? { ...p, ...u } : null);
                        }} onOpenSchedulingConfig={(user?.role === 'admin' || user?.role === 'developer') ? () => setShowSchedulingConfig(true) : undefined} /></PageTransition>}
                        {activeTab === 'games' && <PageTransition key="games"><GamesPanel onOpenGame={onOpenGames || (() => { })} availableClasses={classGroups} /></PageTransition>}
                        {activeTab === 'ai-beleid' && <PageTransition key="ai-beleid"><div className="bg-white rounded-[2rem] border border-duck-ink/15 p-6"><AiBeleidFeedbackPanel classFilter={classFilter !== 'all' ? classFilter : undefined} schoolId={user?.schoolId} /></div></PageTransition>}
                        {activeTab === 'feedback' && <PageTransition key="feedback"><FeedbackPanel schoolId={user?.schoolId} /></PageTransition>}
                        {activeTab === 'progress' && (
                            <PageTransition key="progress">
                                <TeacherEvidence
                                    students={students}
                                    classFilter={classFilter}
                                    availableClasses={classGroups}
                                    yearGroup={yearGroupFilter}
                                    schoolId={user?.schoolId}
                                    hybridAssessments={hybridAssessments}
                                    onSelectStudent={setSelectedStudent}
                                />
                            </PageTransition>
                        )}
                        {/* 'documenten' blijft bereikbaar via het accountmenu (Kennisbank). */}
                        {activeTab === 'documenten' && <PageTransition key="documenten"><TeacherDocumentsPanel /></PageTransition>}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>

                {!embedded && (
                    <TeacherMobileNav items={sideNavItems} activeTab={navActiveTab ?? 'overview'} onNavigate={navigateTo} />
                )}

                <RosterImportModal open={showRosterImport} onClose={() => setShowRosterImport(false)} />
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

                {showSchedulingConfig && user?.schoolId && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 pt-12">
                        <div className="bg-duck-bg rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <SchedulingConfigurator
                                schoolId={user.schoolId}
                                yearGroup={yearGroupFilter}
                                onClose={() => setShowSchedulingConfig(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
