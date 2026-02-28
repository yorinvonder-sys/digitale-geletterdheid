
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from './ui/PageTransition';
import { supabase } from '../services/supabase';
import { ParentUser, UserStats, StudentData, GamificationEvent, ClassroomConfig, HybridAssessmentRecord } from '../types';
import {
    Users, Search, GraduationCap, Zap, Award, BarChart3, Download, Send,
    RotateCcw, Stars, Sparkles
} from 'lucide-react';
import { GoudenPromptGallery } from './teacher/GoudenPromptGallery';
import {
    sendMessage, resetStudentProgress, awardBadge, awardXP,
    getClassSettings, updateClassSettings, createEvent, getActiveEvents, endEvent,
    getClassroomConfig, updateClassroomConfig, highlightWork, deleteStudent
} from '../services/teacherService';
import { getMissionsForYear } from '../config/missions';
import { CURRICULUM } from '../config/curriculum';
import { MetricsOverview } from './teacher/MetricsOverview';
import { StudentList } from './teacher/StudentList';
import { EventsPanel } from './teacher/EventsPanel';
import { Leaderboard } from './teacher/Leaderboard';
import { AlertsPanel } from './teacher/AlertsPanel';
import { SettingsPanel } from './teacher/SettingsPanel';
import { AiBeleidFeedbackPanel } from './teacher/AiBeleidFeedbackPanel';
import { GamesPanel } from './teacher/GamesPanel';
import { FeedbackPanel } from './teacher/FeedbackPanel';
import { MissionProgressPanel } from './teacher/MissionProgressPanel';
import { SLOClassOverview } from './teacher/SLOClassOverview';
import { HybridAssessmentPanel } from './teacher/HybridAssessmentPanel';
import { TutorialProvider } from '../contexts/TutorialContext';
import TutorialSpotlight, { TutorialRestartButton } from './teacher/TutorialSpotlight';

// Sub-components
import { TeacherHeader } from './teacher/dashboard/TeacherHeader';
import { TeacherNavigation } from './teacher/dashboard/TeacherNavigation';
import { TeacherModals } from './teacher/dashboard/TeacherModals';
import { TeacherDocumentsPanel } from './teacher/TeacherDocumentsPanel';

// Tab type definitions
type MainTab = 'overview' | 'students' | 'gamification' | 'games' | 'settings' | 'activity' | 'ai-beleid' | 'feedback' | 'progress' | 'slo' | 'documenten';
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
    const [classFilter, setClassFilter] = useState<string>('all');
    const [yearGroupFilter, setYearGroupFilter] = useState<number>(1);

    // Modals
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showHighlightModal, setShowHighlightModal] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [showFocusMissionModal, setShowFocusMissionModal] = useState(false);
    const [classRoomConfig, setClassRoomConfig] = useState<ClassroomConfig | null>(null);
    const [conceptFilter, setConceptFilter] = useState<string | null>(null);
    const [selectedStudentIdFilter, setSelectedStudentIdFilter] = useState<string | null>(null);
    const [showLiveModal, setShowLiveModal] = useState(false);

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

    const yearMissions = useMemo(() => getMissionsForYear(yearGroupFilter), [yearGroupFilter]);
    const selectedClassId = classFilter === 'all' ? 'MH1A' : classFilter;

    const [retryCount, setRetryCount] = useState(0);

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
            setLoading(false);
            if (retryCount > 0) setRetryCount(0);
        };

        fetchStudents();

        const channel = supabase
            .channel('teacher-students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: 'role=eq.student' }, () => {
                fetchStudents();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
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
                fetchAssessments();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    useEffect(() => {
        // Load per-class settings when a class is selected.
        if (classFilter === 'all') {
            setEnabledMissions(yearMissions.map(m => m.id));
            return;
        }

        let active = true;
        getClassSettings(classFilter)
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
    }, [classFilter, yearMissions]);

    useEffect(() => {
        // Keep dashboard config aligned with the selected class (used by SettingsPanel).
        getClassroomConfig(selectedClassId)
            .then((config) => config && setClassRoomConfig(config))
            .catch(console.error);
    }, [selectedClassId]);

    // Config & Onboarding
    useEffect(() => {
        getClassroomConfig('MH1A').then(config => {
            if (config) {
                setClassRoomConfig(config);
                // Force focus mode OFF by default when teacher enters dashboard
                if (config.focusMode) {
                    void updateClassroomConfig('MH1A', { focusMode: false, schoolId: user?.schoolId });
                    setFocusMode(false);
                } else {
                    setFocusMode(false);
                }
            }
        });
    }, [user?.schoolId]);

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
                await updateClassroomConfig('MH1A', { focusMode: false, schoolId: user?.schoolId });
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
    }, [focusMode, user?.schoolId]);

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
        const ok = await updateClassSettings(classFilter, { enabled_missions: next, schoolId: user?.schoolId });
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
            await updateClassroomConfig('MH1A', { focusMode: false, schoolId: user?.schoolId });
        } else {
            setShowFocusMissionModal(true);
        }
    };

    const handleFocusMissionSelect = async (missionId: string, missionTitle: string, selectedClass?: string) => {
        setFocusMode(true);
        focusStartTimeRef.current = Date.now();
        await updateClassroomConfig(selectedClass || 'MH1A', {
            focusMode: true,
            focusMissionId: missionId,
            focusMissionTitle: missionTitle,
            schoolId: user?.schoolId
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
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

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
            <div className="min-h-screen bg-slate-50 p-4 md:p-8">
                {/* Toasts */}
                <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map(t => (
                            <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-xl bg-white border border-slate-100 flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${t.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}><Stars size={20} /></div>
                                <div><h4 className="font-bold text-slate-900 text-sm">{t.title}</h4><p className="text-slate-500 text-xs mt-0.5">{t.message}</p></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {error && <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

                <TeacherHeader
                    focusMode={focusMode}
                    handleToggleFocusMode={handleToggleFocusMode}
                    focusModeRemaining={focusModeRemaining}
                    setShowPresentation={setShowPresentation}
                    onViewAssignments={onViewAssignments}
                    onLogout={onLogout}
                />

                <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                    <TeacherNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Year Group Selector */}
                    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm p-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Leerjaar</span>
                        <div className="flex gap-1">
                            {Object.entries(CURRICULUM.yearGroups).map(([year, config]) => (
                                <button
                                    key={year}
                                    onClick={() => setYearGroupFilter(Number(year))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                        yearGroupFilter === Number(year)
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {year} — {config.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <PageTransition key="overview" className="space-y-6">
                                <MetricsOverview
                                    students={students}
                                    activeEvents={activeEvents}
                                    onNavigate={(tab) => {
                                        if (tab === 'events' || tab === 'leaderboard') {
                                            setActiveTab('gamification');
                                            setGamificationSubTab(tab);
                                        } else {
                                            setActiveTab(tab as any);
                                        }
                                    }}
                                    loading={loading}
                                    conceptFilter={conceptFilter}
                                    onFilterConcept={setConceptFilter}
                                    onResetFilters={() => setConceptFilter(null)}
                                    onSelectStudent={setSelectedStudent}
                                    selectedStudentId={selectedStudentIdFilter}
                                    onSelectStudentFilter={setSelectedStudentIdFilter}
                                    yearGroup={yearGroupFilter}
                                />
                                {students.some(s => (s.stats?.xp || 0) < 50) && <AlertsPanel students={students} onSelectStudent={setSelectedStudent} />}
                            </PageTransition>
                        )}

                        {activeTab === 'students' && (
                            <PageTransition key="students" className="space-y-4">
                                <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setRetryCount(prev => prev + 1)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><RotateCcw size={16} /></button>
                                        <button onClick={exportCSV} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Download size={16} /></button>
                                    </div>
                                    <button data-tutorial="students-message-btn" onClick={() => setShowMessageModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Send size={14} /> Bericht</button>
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
                                />
                            </PageTransition>
                        )}

                        {activeTab === 'gamification' && (
                            <PageTransition key="gamification" className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        {[
                                            { id: 'leaderboard', label: 'Ranglijst', icon: Award },
                                            { id: 'gallery', label: 'Gallery', icon: Stars },
                                            { id: 'events', label: 'Events', icon: Sparkles },
                                        ].map(sub => (
                                            <button key={sub.id} onClick={() => setGamificationSubTab(sub.id as any)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${gamificationSubTab === sub.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><sub.icon size={14} /> {sub.label}</button>
                                        ))}
                                    </div>
                                    <button data-tutorial="xp-boost-btn" onClick={() => setShowEventModal(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2"><Zap size={14} /> XP Boost</button>
                                </div>
                                {gamificationSubTab === 'leaderboard' && <Leaderboard students={students} />}
                                {gamificationSubTab === 'gallery' && <GoudenPromptGallery schoolId={user?.schoolId} />}
                                {gamificationSubTab === 'events' && <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden"><EventsPanel activeEvents={activeEvents} onShowModal={() => setShowEventModal(true)} onEndEvent={async id => { await endEvent(id); getActiveEvents(user?.schoolId).then(setActiveEvents); }} /></div>}
                            </PageTransition>
                        )}

                        {activeTab === 'settings' && <PageTransition key="settings" className="space-y-6"><SettingsPanel classFilter={classFilter} onClassFilterChange={setClassFilter} availableClasses={classGroups} enabledMissions={enabledMissions} onToggleMission={handleToggleMission} onTestGame={onOpenGames} yearGroup={yearGroupFilter} classroomConfig={classRoomConfig} onUpdateConfig={async u => { await updateClassroomConfig(selectedClassId, { ...u, schoolId: user?.schoolId }); setClassRoomConfig(p => p ? { ...p, ...u } : null); }} />{onLogout && <button onClick={onLogout} className="w-full py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50"><RotateCcw size={18} /> Uitloggen</button>}</PageTransition>}
                        {activeTab === 'games' && <PageTransition key="games"><GamesPanel onOpenGame={onOpenGames || (() => { })} /></PageTransition>}
                        {activeTab === 'ai-beleid' && <PageTransition key="ai-beleid"><div className="bg-white rounded-[2rem] border border-slate-100 p-6"><AiBeleidFeedbackPanel classFilter={classFilter !== 'all' ? classFilter : undefined} schoolId={user?.schoolId} /></div></PageTransition>}
                        {activeTab === 'feedback' && <PageTransition key="feedback"><FeedbackPanel schoolId={user?.schoolId} /></PageTransition>}
                        {activeTab === 'progress' && <PageTransition key="progress" className="space-y-6"><MissionProgressPanel students={students} classFilter={classFilter} availableClasses={classGroups} onClassFilterChange={setClassFilter} onSelectStudent={setSelectedStudent} yearGroup={yearGroupFilter} /><HybridAssessmentPanel records={hybridAssessments} classFilter={classFilter} /></PageTransition>}
                        {activeTab === 'slo' && <PageTransition key="slo"><SLOClassOverview students={students} schoolId={user?.schoolId} /></PageTransition>}
                        {activeTab === 'documenten' && <PageTransition key="documenten"><TeacherDocumentsPanel /></PageTransition>}
                    </AnimatePresence>
                </main>

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
                    showPresentation={showPresentation} setShowPresentation={setShowPresentation}
                    setSelectedStudent={setSelectedStudent} awardXP={awardXP}
                    showLiveModal={showLiveModal} setShowLiveModal={setShowLiveModal}
                    handleDeleteStudent={handleDeleteStudent}
                />

                <TutorialRestartButton />
            </div>
        </TutorialProvider>
    );
};
