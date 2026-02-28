import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { ProjectZeroDashboard } from './components/ProjectZeroDashboard';
import { Footer } from './components/Footer';
import { ParentUser, UserStats, RoleId, AvatarConfig } from './types';
import { ROLES } from './config/agents';
import { subscribeToAuthChanges, logout } from './services/authService';
import { supabase } from './services/supabase';
import { Rocket, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { logger } from './utils/logger';
import { ClassroomConfig } from './types';
import { logActivity, updateClassroomConfig } from './services/teacherService';
import { CookieConsent } from './components/CookieConsent';
import { TutorialProvider, STUDENT_TUTORIAL_STEPS, STUDENT_STORAGE_KEY, TutorialStep } from './contexts/TutorialContext';
import TutorialSpotlight, { TutorialRestartButton } from './components/teacher/TutorialSpotlight';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { useTeacherMessages } from './hooks/useTeacherMessages';
import { TeacherMessagePopup } from './components/TeacherMessagePopup';
import { ExitConfirmDialog } from './components/ExitConfirmDialog';
import { Toast } from './components/Toast';
import { MfaGate } from './components/MfaGate';

// Code splitting: Lazy load heavy components with automatic retry on failure
const AiLab = lazyWithRetry(() => import('./components/AiLab').then(m => ({ default: m.AiLab })));
const TeacherDashboard = lazyWithRetry(() => import('./components/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const UserProfile = lazyWithRetry(() => import('./components/UserProfile').then(m => ({ default: m.UserProfile })));
const GamesSection = lazyWithRetry(() => import('./components/GamesSection').then(m => ({ default: m.GamesSection })));
const GameDirectorMission = lazyWithRetry(() => import('./components/missions/GameDirectorMission').then(m => ({ default: m.GameDirectorMission })));
const StudentOnboarding = lazyWithRetry(() => import('./components/StudentOnboarding').then(m => ({ default: m.StudentOnboarding })));
const AvatarSetup = lazyWithRetry(() => import('./components/AvatarSetup').then(m => ({ default: m.AvatarSetup })));
const PromptMasterMission = lazyWithRetry(() => import('./components/missions/PromptMasterMission').then(m => ({ default: m.PromptMasterMission })));
const DataDetectiveMission = lazyWithRetry(() => import('./components/missions/DataDetectiveMission').then(m => ({ default: m.DataDetectiveMission })));
const DeepfakeDetectorMission = lazyWithRetry(() => import('./components/missions/DeepfakeDetectorMission').then(m => ({ default: m.DeepfakeDetectorMission })));
const ChangePassword = lazyWithRetry(() => import('./components/ChangePassword').then(m => ({ default: m.ChangePassword })));
const CloudCleanerMission = lazyWithRetry(() => import('./components/missions/review/CloudCleanerMission').then(m => ({ default: m.CloudCleanerMission })));
const WordSimulator = lazyWithRetry(() => import('./components/WordSimulator').then(m => ({ default: m.WordSimulator })));
const PitchPoliceMission = lazyWithRetry(() => import('./components/missions/review/PitchPoliceMission').then(m => ({ default: m.PitchPoliceMission })));
const PrintInstructiesMission = lazyWithRetry(() => import('./components/missions/PrintInstructiesMission').then(m => ({ default: m.PrintInstructiesMission })));
const DeveloperDashboard = lazyWithRetry(() => import('./components/developer/DeveloperDashboard').then(m => ({ default: m.DeveloperDashboard })));
const FilterBubbleBreakerMission = lazyWithRetry(() => import('./components/missions/FilterBubbleBreakerMission').then(m => ({ default: m.FilterBubbleBreakerMission })));
const DatalekkenRampenplanMission = lazyWithRetry(() => import('./components/missions/DatalekkenRampenplanMission').then(m => ({ default: m.DatalekkenRampenplanMission })));
const DataVoorDataMission = lazyWithRetry(() => import('./components/missions/DataVoorDataMission').then(m => ({ default: m.DataVoorDataMission })));

const LoadingFallback = () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-indigo-600" aria-hidden="true" />
            <p className="text-slate-500 font-medium">Laden...</p>
        </div>
    </div>
);

/** Authenticated app shell — only loaded for private/authenticated flows. Public routes use AppRouter. */
export function AuthenticatedApp() {
    logger.log("AuthenticatedApp Component Mounting...");
    const [user, setUser] = useState<ParentUser | null>(null);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [pendingLibraryItem, setPendingLibraryItem] = useState<any | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [initialProfileTab, setInitialProfileTab] = useState<'profile' | 'shop' | 'trophies'>('profile');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'assignments' | 'monitoring'>('monitoring');
    const [activeWeek, setActiveWeek] = useState(2);
    const [showGames, setShowGames] = useState(false);
    const [initialGameId, setInitialGameId] = useState<string | null>(null);
    const [gamesEnabled, setGamesEnabled] = useState(true);
    const [activeYearGroup, setActiveYearGroup] = useState<number>(1);
    const [focusMode, setFocusMode] = useState(false);
    const [focusMissionId, setFocusMissionId] = useState<string | null>(null);
    const [focusMissionTitle, setFocusMissionTitle] = useState<string | null>(null);
    const [focusModeAcknowledged, setFocusModeAcknowledged] = useState(false);
    // NEW: Robust tracking of focus state to prevent reset loops
    const lastProcessedFocusMissionId = React.useRef<string | null>(null);
    const lastProcessedFocusMode = React.useRef<boolean>(false);

    // NEW: Session storage key for focus intent persistence
    const FOCUS_INTENT_KEY = 'dgskills_focus_intent';
    const FOCUS_INTENT_TTL = 5 * 60 * 1000; // 5 minutes
    const [showStudentOnboarding, setShowStudentOnboarding] = useState(false);
    const [showAvatarSetup, setShowAvatarSetup] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const studentClass = user?.stats?.studentClass || user?.studentClass || '';
    const {
        latestMessage,
        showPopup: showTeacherMessage,
        dismissMessage,
        dismissPopup: dismissTeacherMessage
    } = useTeacherMessages({
        userId: user?.uid || '',
        classId: studentClass,
        enabled: !!user && user.role === 'student' && !!studentClass
    });

    useEffect(() => {
        if (!user || user.role !== 'student') return;
        const cls = user.stats?.studentClass || user.studentClass;
        if (!cls) return;

        const channel = supabase
            .channel(`classroom-config-${cls}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'classroom_configs',
                filter: `id=eq.${cls}`
            }, (payload) => {
                const config = (payload.new || {}) as ClassroomConfig;

                // Only reset acknowledgement if focus mode changed or mission ID changed
                const focusModeChanged = config.focusMode !== lastProcessedFocusMode.current;
                const missionChanged = config.focusMissionId !== lastProcessedFocusMissionId.current;

                if (focusModeChanged || missionChanged) {
                    // But don't reset if we are RESTORING from session storage
                    const stored = sessionStorage.getItem(FOCUS_INTENT_KEY);
                    let isRestoring = false;
                    if (stored) {
                        try {
                            const { missionId } = JSON.parse(stored);
                            if (missionId === config.focusMissionId) isRestoring = true;
                        } catch (e) { }
                    }

                    if (!isRestoring) {
                        setFocusModeAcknowledged(false);
                    }
                }

                lastProcessedFocusMode.current = !!config.focusMode;
                lastProcessedFocusMissionId.current = config.focusMissionId || null;

                setFocusMode(config.focusMode);
                setFocusMissionId(config.focusMissionId || null);
                setFocusMissionTitle(config.focusMissionTitle || null);

                if (config.focusMode) {
                    logActivity({
                        uid: user.uid,
                        schoolId: user.schoolId,
                        studentName: user.displayName || 'Naamloos',
                        type: 'focus_lost',
                        data: config.focusMissionId
                            ? `Focus Modus: ${config.focusMissionTitle}`
                            : 'Focus Modus geactiveerd door docent'
                    });
                }
            })
            .subscribe();

        // Initial fetch
        supabase
            .from('classroom_configs')
            .select('*')
            .eq('id', cls)
            .single()
            .then(({ data }) => {
                if (data) {
                    const config = data as ClassroomConfig;
                    lastProcessedFocusMode.current = !!config.focusMode;
                    lastProcessedFocusMissionId.current = config.focusMissionId || null;
                    setFocusMode(config.focusMode);
                    setFocusMissionId(config.focusMissionId || null);
                    setFocusMissionTitle(config.focusMissionTitle || null);
                }
            });

        return () => { supabase.removeChannel(channel); };
    }, [user, focusMissionId]);

    useEffect(() => {
        if (!user || user.role !== 'student' || activeModule || !focusMode || !focusMissionId) return;

        // Check for pending focus intent after reload
        try {
            const stored = sessionStorage.getItem(FOCUS_INTENT_KEY);
            if (stored) {
                const { missionId, timestamp } = JSON.parse(stored);
                const isStillValid = Date.now() - timestamp < FOCUS_INTENT_TTL;
                const isSameMission = missionId === focusMissionId;

                if (isStillValid && isSameMission) {
                    logger.log("[FocusPersistence] Restoring focus mission after reload:", missionId);
                    setFocusModeAcknowledged(true);
                    handleSelectModule(missionId);
                } else {
                    // Stale or different mission, clean up
                    sessionStorage.removeItem(FOCUS_INTENT_KEY);
                }
            }
        } catch (e) {
            console.error("Failed to restore focus intent:", e);
            sessionStorage.removeItem(FOCUS_INTENT_KEY);
        }
    }, [user, focusMode, focusMissionId, activeModule]);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((u) => {
            setUser(u);
            setLoading(false);
            if (u?.role === 'teacher') {
                setViewMode('monitoring');
            } else if (u?.role === 'developer') {
                setViewMode('monitoring'); // Developers default to dashboard view
            } else {
                setViewMode('assignments');
            }
            if (u && u.role === 'student') {
                logActivity({
                    uid: u.uid,
                    schoolId: u.schoolId,
                    studentName: u.displayName || 'Naamloos',
                    type: 'login',
                    data: 'App geopend'
                });
            }
        });
        return () => unsubscribe();
    }, []);

    // IMPORTANT: useMemo MUST be called before any early returns to satisfy Rules of Hooks.
    // (Moving this after early returns caused React error #310 — "Rendered more hooks than
    // during the previous render" — because the hook count changed between loading/loaded states.)
    const studentTutorialSteps = useMemo((): TutorialStep[] =>
        STUDENT_TUTORIAL_STEPS,
    []);

    const handleExitModule = () => {
        setActiveModule(null);
        setPendingLibraryItem(null);
        setShowExitConfirm(false);

        // Clear focus intent when explicitly exiting a module
        sessionStorage.removeItem(FOCUS_INTENT_KEY);
    };

    const handleRequestExitModule = () => {
        if (user?.role === 'student' && activeModule) {
            setShowExitConfirm(true);
        } else {
            handleExitModule();
        }
    };

    const handleSelectModule = (moduleId: string, libraryItemData?: any) => {
        setActiveModule(moduleId);
        setPendingLibraryItem(libraryItemData || null);

        if (user && user.role === 'student') {
            logActivity({
                uid: user.uid,
                schoolId: user.schoolId,
                studentName: user.displayName || 'Naamloos',
                type: 'mission_start',
                data: `Missie gestart: ${moduleId}`,
                missionId: moduleId
            });
        }
    };

    const handleSaveProgress = async (stats: UserStats) => {
        if (!user) return;
        try {
            const sanitizeForDb = (obj: any): any => {
                if (obj === null || obj === undefined) return null;
                if (obj instanceof Date) return obj.toISOString();
                if (typeof obj === 'number') {
                    if (Number.isNaN(obj) || !Number.isFinite(obj)) return null;
                    return obj;
                }
                if (typeof obj === 'string') {
                    if (obj === 'loading') return null;
                    return obj;
                }
                if (typeof obj === 'boolean') return obj;
                if (Array.isArray(obj)) {
                    return obj
                        .map(item => sanitizeForDb(item))
                        .filter(item => item !== null && item !== undefined);
                }
                if (typeof obj === 'object') {
                    const result: any = {};
                    for (const [key, value] of Object.entries(obj)) {
                        if (value === undefined) continue;
                        if (typeof value === 'function') continue;
                        if (typeof value === 'symbol') continue;
                        const sanitizedValue = sanitizeForDb(value);
                        if (sanitizedValue !== null && sanitizedValue !== undefined) {
                            result[key] = sanitizedValue;
                        }
                    }
                    return result;
                }
                return null;
            };
            const cleanStats = sanitizeForDb(stats);
            const { error } = await supabase
                .rpc('update_student_stats', { p_stats: cleanStats });
            if (error) throw error;
        } catch (error) {
            console.error("Error saving progress to Supabase:", error);
            setToast({ message: 'Voortgang kon niet worden opgeslagen. Probeer het opnieuw.', type: 'error' });
        }
    };

    const handleUpdateProfile = async (data: Partial<ParentUser>) => {
        if (!user) return;
        try {
            // Stats updates must go through the RPC to bypass protect_stats_column trigger
            if (data.stats) {
                const sanitizeForDb = (obj: any): any => {
                    if (obj === undefined) return null;
                    if (obj === null || typeof obj !== 'object') return obj;
                    if (Array.isArray(obj)) return obj.map(sanitizeForDb);
                    const result: any = {};
                    for (const [key, value] of Object.entries(obj)) {
                        if (value !== undefined) result[key] = sanitizeForDb(value);
                    }
                    return result;
                };
                const cleanStats = sanitizeForDb(data.stats);
                const { error: rpcError } = await supabase
                    .rpc('update_student_stats', { p_stats: cleanStats });
                if (rpcError) throw rpcError;
            }

            // Non-stats fields can be updated directly
            const nonStatsData = { ...data };
            delete nonStatsData.stats;
            if (Object.keys(nonStatsData).length > 0) {
                const { error } = await supabase
                    .from('users')
                    .update(nonStatsData as any)
                    .eq('uid', user.uid);
                if (error) throw error;
            }

            setUser({ ...user, ...data });
        } catch (error) {
            console.error("Error updating profile:", error);
            setToast({ message: 'Profiel kon niet worden bijgewerkt. Probeer het opnieuw.', type: 'error' });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setActiveModule(null);
            setIsProfileOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="animate-spin text-indigo-600" aria-hidden="true" />
                <span className="sr-only">Laden...</span>
                <p className="text-slate-500 font-medium">Laden...</p>
            </div>
        );
    }

    if (!user) {
        // Gebruik geen harde reload/replace hier, laat de AppRouter de staat afhandelen.
        // Als we hier komen zonder user, tonen we even de loader tot de AppRouter ingrijpt.
        return <LoadingFallback />;
    }

    if (user.mustChangePassword) {
        return (
            <Suspense fallback={<LoadingFallback />}>
                <ChangePassword onComplete={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        // Session is already refreshed by Supabase client
                    }
                    if (user) {
                        setUser({ ...user, mustChangePassword: false });
                    }
                }} />
            </Suspense>
        );
    }

    // M-05: MFA gate — privileged roles must verify AAL2 before accessing the app
    if (user.mfaPending) {
        return (
            <MfaGate onVerified={() => {
                setUser({ ...user, mfaPending: false });
            }} />
        );
    }

    const hasCompletedAvatarSetup = user.stats?.hasCompletedAvatarSetup === true;

    // Streamlined onboarding: skip text-heavy StudentOnboarding, go straight to avatar creation.
    // The dashboard tutorial handles feature discovery interactively.
    if (user.role === 'student' && !hasCompletedAvatarSetup && !showAvatarSetup) {
        setTimeout(() => setShowAvatarSetup(true), 100);
    }

    if (showAvatarSetup && user.role === 'student') {
        const handleAvatarComplete = async (avatarConfig: AvatarConfig) => {
            if (user) {
                const newStats = {
                    ...user.stats,
                    avatarConfig: avatarConfig,
                    hasCompletedAvatarSetup: true,
                    hasCompletedOnboarding: true,
                };
                await handleSaveProgress(newStats);
                setUser({ ...user, stats: newStats });
            }
            setShowAvatarSetup(false);
        };
        return (
            <Suspense fallback={<LoadingFallback />}>
                <AvatarSetup
                    onComplete={handleAvatarComplete}
                    userName={user.displayName || undefined}
                    initialConfig={user.stats?.avatarConfig}
                />
            </Suspense>
        );
    }

    const hasCompletedFocusMission = focusMissionId && user?.stats?.missionsCompleted?.includes(focusMissionId);

    if (user.role === 'student' && focusMode && !activeModule && !focusModeAcknowledged && !hasCompletedFocusMission) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent animate-pulse"></div>
                </div>
                <div className="max-w-md w-full text-center space-y-8 relative z-10">
                    <div className="relative inline-block">
                        <div className={`w-24 h-24 ${focusMissionId ? 'bg-emerald-600' : 'bg-indigo-600'} rounded-[2.5rem] flex items-center justify-center shadow-2xl ${focusMissionId ? 'shadow-emerald-500/40' : 'shadow-indigo-500/40'} animate-bounce`}>
                            <Lock size={48} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {focusMissionId && focusMissionTitle ? (
                            <>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Opdracht Verplicht</h1>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    De docent heeft een specifieke opdracht geselecteerd die je <span className="text-emerald-400 font-bold">nu moet maken</span>.
                                </p>
                                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Je opdracht</p>
                                    <h2 className="text-xl font-black text-white">{focusMissionTitle}</h2>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Ogen op de docent!</h1>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    De docent heeft de <span className="text-indigo-400 font-bold">Focus Modus</span> geactiveerd.
                                    {focusMissionTitle ? (
                                        <> Tijd voor de opdracht: <span className="text-white font-bold">{focusMissionTitle}</span>.</>
                                    ) : (
                                        <> Tijd voor instructie of een gezamenlijk moment.</>
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                    {focusMissionId ? (
                        <button
                            onClick={() => {
                                // Persist intent to survive reloads/updates
                                try {
                                    sessionStorage.setItem(FOCUS_INTENT_KEY, JSON.stringify({
                                        missionId: focusMissionId,
                                        timestamp: Date.now()
                                    }));
                                } catch (e) {
                                    console.error("Failed to save focus intent:", e);
                                }

                                setFocusModeAcknowledged(true);
                                handleSelectModule(focusMissionId);
                            }}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Bekijk Opdracht
                            <Rocket size={20} />
                        </button>
                    ) : (
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                                Wachten op vrijgave...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const handleGoHome = () => {
        setIsProfileOpen(false);
        setActiveModule(null);
    };

    const renderContent = () => {
        // Build mission-to-role map dynamically from ROLES config (covers Y1, Y2, Y3)
        const missionToRoleMap: Record<string, RoleId> = {};
        ROLES.forEach(role => { missionToRoleMap[role.id] = role.id; });

        const role = activeModule ? missionToRoleMap[activeModule] : undefined;

        if (role) {
            return (
                <AiLab
                    user={user}
                    onExit={handleRequestExitModule}
                    saveProgress={handleSaveProgress}
                    initialRole={role}
                    libraryData={pendingLibraryItem}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'game-director') {
            return (
                <GameDirectorMission
                    onBack={handleRequestExitModule}
                    onComplete={() => handleExitModule()}
                    stats={user?.stats}
                />
            );
        }

        const handleMissionComplete = async (missionId: string) => {
            if (user && user.stats) {
                const currentCompleted = user.stats.missionsCompleted || [];
                if (!currentCompleted.includes(missionId)) {
                    const newStats = {
                        ...user.stats,
                        missionsCompleted: [...currentCompleted, missionId],
                        xp: (user.stats.xp || 0) + 50
                    };
                    setUser({ ...user, stats: newStats });
                    await handleSaveProgress(newStats);
                    logActivity({
                        uid: user.uid,
                        schoolId: user.schoolId,
                        studentName: user.displayName || 'Naamloos',
                        type: 'mission_complete',
                        data: `Missie voltooid: ${missionId} (+50 XP)`,
                        missionId
                    });
                    if (focusMissionId && missionId === focusMissionId) {
                        const cls = user.stats?.studentClass || user.studentClass;
                        if (cls) {
                            await updateClassroomConfig(cls, {
                                focusMode: false,
                                focusMissionId: undefined,
                                focusMissionTitle: undefined
                            });
                            setFocusMode(false);
                            setFocusMissionId(null);
                            setFocusMissionTitle(null);
                        }
                    }
                }
            }
            handleExitModule();
        };

        if (activeModule === 'cloud-cleaner') {
            return (
                <CloudCleanerMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('cloud-cleaner');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'layout-doctor') {
            return (
                <WordSimulator
                    onLevelComplete={() => handleMissionComplete('layout-doctor')}
                    onExit={handleRequestExitModule}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'pitch-police') {
            return (
                <PitchPoliceMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('pitch-police');
                        else handleExitModule();
                    }}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'prompt-master') {
            return (
                <PromptMasterMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('prompt-master');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'data-detective') {
            return (
                <DataDetectiveMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('data-detective');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'deepfake-detector') {
            return (
                <DeepfakeDetectorMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('deepfake-detector');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'ipad-print-instructies') {
            return (
                <PrintInstructiesMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('ipad-print-instructies');
                        else handleExitModule();
                    }}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'filter-bubble-breaker') {
            return (
                <FilterBubbleBreakerMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('filter-bubble-breaker');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'datalekken-rampenplan') {
            return (
                <DatalekkenRampenplanMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('datalekken-rampenplan');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }

        if (activeModule === 'data-voor-data') {
            return (
                <DataVoorDataMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('data-voor-data');
                        else handleExitModule();
                    }}
                    stats={user?.stats}
                    vsoProfile={user?.stats?.vsoProfile}
                />
            );
        }


        if (isProfileOpen) {
            return (
                <UserProfile
                    user={user}
                    onBack={() => {
                        setIsProfileOpen(false);
                        setInitialProfileTab('profile');
                    }}
                    onUpdateProfile={handleUpdateProfile}
                    initialTab={initialProfileTab}
                />
            );
        }

        if (showGames) {
            return (
                <div className="flex-1 w-full flex flex-col font-sans text-slate-900 pb-safe relative">
                    <GamesSection
                        userRole={user?.role || 'student'}
                        avatarConfig={user?.stats?.avatarConfig}
                        onXPEarned={() => { }}
                        onBack={() => {
                            setShowGames(false);
                            setInitialGameId(null);
                        }}
                        initialGameId={initialGameId}
                        userId={user?.uid}
                        userClass={user?.studentClass}
                    />
                </div>
            );
        }

        if (user.role === 'teacher' && viewMode === 'monitoring') {
            return (
                <TeacherDashboard
                    user={user}
                    onUpdateStats={handleSaveProgress}
                    onViewAssignments={() => setViewMode('assignments')}
                    onLogout={handleLogout}
                    onOpenGames={(gameId) => {
                        setInitialGameId(gameId || null);
                        setShowGames(true);
                    }}
                />
            );
        }

        if (user.role === 'developer') {
            return (
                <DeveloperDashboard
                    user={user}
                    onLogout={handleLogout}
                />
            );
        }

        return (
            <ProjectZeroDashboard
                onSelectModule={handleSelectModule}
                userDisplayName={user?.displayName}
                userUid={user?.uid}
                onOpenProfile={(tab?: 'profile' | 'shop' | 'trophies') => {
                    setInitialProfileTab(tab || 'profile');
                    setIsProfileOpen(true);
                }}
                onLogout={handleLogout}
                onOpenGames={() => setShowGames(true)}
                gamesEnabled={gamesEnabled}
                activeWeek={activeWeek}
                setActiveWeek={setActiveWeek}
                onGoHome={handleGoHome}
                stats={user?.stats}
                focusMode={focusMode && !hasCompletedFocusMission}
                userRole={user?.role}
                activeYearGroup={activeYearGroup}
                setActiveYearGroup={setActiveYearGroup}
            />
        );
    };

    const showFooter = !activeModule && !isProfileOpen && !showGames && viewMode !== 'monitoring';

    const appShell = (
        <div className="w-full min-h-screen bg-[#f8fafc] pb-safe flex flex-col relative">
            <a href="#main-content" className="skip-link">Naar hoofdinhoud</a>

            {/* Offline indicator */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 text-center shadow-md animate-in slide-in-from-top duration-300">
                    Je bent offline. Sommige functies (zoals AI) werken mogelijk niet.
                </div>
            )}

            <main id="main-content" className={`flex-1 flex flex-col${showFooter ? '' : ' min-h-0'}`} tabIndex={-1}>
                {user.role === 'student' && (
                    <>
                        <TutorialSpotlight />
                        <TutorialRestartButton />
                    </>
                )}
                <Suspense fallback={<LoadingFallback />}>
                    {renderContent()}
                </Suspense>
            </main>
            <div className="fixed top-4 right-4 pr-safe pt-safe flex items-center gap-3 z-50" />
            {user.role === 'teacher' && viewMode === 'assignments' && (
                <div className="fixed bottom-8 left-8 pointer-events-auto z-50 flex flex-col items-start gap-2">
                    <div className="bg-purple-600/10 backdrop-blur-md border border-purple-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm mb-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Docent Mode Actief</span>
                    </div>
                    {!activeModule && !isProfileOpen && (
                        <button
                            onClick={() => setViewMode('monitoring')}
                            className="group bg-slate-900 text-white pl-3 pr-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2.5 active:scale-95"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            Terug naar Dashboard
                        </button>
                    )}
                </div>
            )}
            {showFooter && (
                <Footer
                    onAccountDeleted={handleLogout}
                    schoolId={user.schoolId}
                />
            )}
            <CookieConsent schoolId={user.schoolId} />
            {user.role === 'student' && (
                <TeacherMessagePopup
                    message={latestMessage}
                    show={showTeacherMessage}
                    onDismiss={dismissTeacherMessage}
                    onMarkRead={dismissMessage}
                />
            )}
            <ExitConfirmDialog
                isOpen={showExitConfirm}
                onConfirm={handleExitModule}
                onCancel={() => setShowExitConfirm(false)}
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );

    return user.role === 'student' ? (
        <TutorialProvider steps={studentTutorialSteps} storageKey={STUDENT_STORAGE_KEY} autoStart={true}>
            {appShell}
        </TutorialProvider>
    ) : appShell;
}
