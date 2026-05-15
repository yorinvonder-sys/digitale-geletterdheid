import React, { useState, useEffect, Suspense, useMemo } from 'react';


import { ParentUser, UserStats, RoleId, AvatarConfig } from '@/types';
import type { NulmetingResult } from '@/features/assessment/escaperoom/types';
import { isAgentRoleId } from '@/config/agentRoleIds';
import { isTemplateMission } from '@/config/templateRegistry';
import { supabase } from '@/services/supabase';
import { Rocket, Loader2, ArrowLeft, Lock, GraduationCap, Users, Code2 } from 'lucide-react';
import { sanitizeForDb } from '@/utils/sanitizeForDb';
import { logActivity, updateClassroomConfig } from '@/services/teacherService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useFocusMode } from '@/hooks/useFocusMode';
import { awardXP } from '@/services/XPService';
import { TutorialProvider, STUDENT_TUTORIAL_STEPS, STUDENT_STORAGE_KEY, TutorialStep } from '@/contexts/TutorialContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { SecureErrorBoundary } from '@/components/app-shell/SecureErrorBoundary';
import { useTeacherMessages } from '@/hooks/useTeacherMessages';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { TeacherMessagePopup } from '@/features/student/TeacherMessagePopup';
import { ExitConfirmDialog } from '@/components/app-shell/ExitConfirmDialog';
import { Toast } from '@/components/app-shell/Toast';
import { useSchoolContainers } from '@/hooks/useSchoolContainers';
import { ContainerConfig } from '@/config/containerTypes';


import '@/styles/app.css';
import '@/styles/authenticated.css';
import '@/styles/accessibility.css';

// Code splitting: Lazy load heavy components with automatic retry on failure
const ProjectZeroDashboard = lazyWithRetry(() => import('@/features/student/ProjectZeroDashboard').then(m => ({ default: m.ProjectZeroDashboard })));
const Footer = lazyWithRetry(() => import('@/components/app-shell/Footer').then(m => ({ default: m.Footer })));
const CookieConsent = lazyWithRetry(() => import('@/components/app-shell/CookieConsent').then(m => ({ default: m.CookieConsent })));
const TutorialSpotlight = lazyWithRetry(() => import('@/features/teacher/TutorialSpotlight').then(m => ({ default: m.default })));
const TutorialRestartButton = lazyWithRetry(() => import('@/features/teacher/TutorialSpotlight').then(m => ({ default: m.TutorialRestartButton })));
const MfaGate = lazyWithRetry(() => import('@/features/auth/MfaGate').then(m => ({ default: m.MfaGate })));
const AiLab = lazyWithRetry(() => import('@/features/ai-lab/AiLab').then(m => ({ default: m.AiLab })));
const TeacherDashboard = lazyWithRetry(() => import('@/features/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const TeacherFirstLoginWizard = lazyWithRetry(() => import('@/features/teacher/TeacherFirstLoginWizard').then(m => ({ default: m.TeacherFirstLoginWizard })));
const UserProfile = lazyWithRetry(() => import('@/features/profile/UserProfile').then(m => ({ default: m.UserProfile })));
const GamesSection = lazyWithRetry(() => import('@/features/games/GamesSection').then(m => ({ default: m.GamesSection })));
const GameDirectorMission = lazyWithRetry(() => import('@/features/missions/GameDirectorMission').then(m => ({ default: m.GameDirectorMission })));
const StudentOnboarding = lazyWithRetry(() => import('@/features/student/StudentOnboarding').then(m => ({ default: m.StudentOnboarding })));
const AvatarSetup = lazyWithRetry(() => import('@/features/profile/avatar/AvatarSetup').then(m => ({ default: m.AvatarSetup })));
const PromptMasterMission = lazyWithRetry(() => import('@/features/missions/PromptMasterMission').then(m => ({ default: m.PromptMasterMission })));
const DataDetectiveMission = lazyWithRetry(() => import('@/features/missions/DataDetectiveMission').then(m => ({ default: m.DataDetectiveMission })));
const DeepfakeDetectorMission = lazyWithRetry(() => import('@/features/missions/DeepfakeDetectorMission').then(m => ({ default: m.DeepfakeDetectorMission })));
const ChangePassword = lazyWithRetry(() => import('@/features/auth/ChangePassword').then(m => ({ default: m.ChangePassword })));
const CloudCleanerMission = lazyWithRetry(() => import('@/features/missions/review/CloudCleanerMission').then(m => ({ default: m.CloudCleanerMission })));
const WordSimulator = lazyWithRetry(() => import('@/features/word-simulator').then(m => ({ default: m.WordSimulator })));
const PitchPoliceMission = lazyWithRetry(() => import('@/features/missions/review/PitchPoliceMission').then(m => ({ default: m.PitchPoliceMission })));
const PrintInstructiesMission = lazyWithRetry(() => import('@/features/missions/PrintInstructiesMission').then(m => ({ default: m.PrintInstructiesMission })));
const DeveloperDashboard = lazyWithRetry(() => import('@/features/developer/DeveloperDashboard').then(m => ({ default: m.DeveloperDashboard })));
const FilterBubbleBreakerMission = lazyWithRetry(() => import('@/features/missions/FilterBubbleBreakerMission').then(m => ({ default: m.FilterBubbleBreakerMission })));
const DatalekkenRampenplanMission = lazyWithRetry(() => import('@/features/missions/DatalekkenRampenplanMission').then(m => ({ default: m.DatalekkenRampenplanMission })));
const AccessControlEngineerMission = lazyWithRetry(() => import('@/features/missions/AccessControlEngineerMission').then(m => ({ default: m.AccessControlEngineerMission })));
const DataVoorDataMission = lazyWithRetry(() => import('@/features/missions/DataVoorDataMission').then(m => ({ default: m.DataVoorDataMission })));
const PeerFeedbackPanel = lazyWithRetry(() => import('@/features/missions/PeerFeedbackPanel').then(m => ({ default: m.PeerFeedbackPanel })));
const NulmetingFlow = lazyWithRetry(() => import('@/features/assessment/escaperoom/NulmetingFlow').then(m => ({ default: m.NulmetingFlow })));
const EindmetingFlow = lazyWithRetry(() => import('@/features/assessment/escaperoom/EindmetingFlow').then(m => ({ default: m.EindmetingFlow })));
const TemplateMissionRouter = lazyWithRetry(() => import('@/features/missions/templates/TemplateMissionRouter').then(m => ({ default: m.TemplateMissionRouter })));

const LoadingFallback = () => (
    <div className="flex-1 flex items-center justify-center bg-lab-cream" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-lab-coral" aria-hidden="true" />
            <p className="text-lab-muted font-medium">Laden...</p>
        </div>
    </div>
);

const DEDICATED_MISSIONS = new Set([
    'prompt-master',
    'game-director',
    'cloud-cleaner',
    'layout-doctor',
    'pitch-police',
    'data-detective',
    'deepfake-detector',
    'ipad-print-instructies',
    'filter-bubble-breaker',
    'datalekken-rampenplan',
    'data-voor-data',
    'access-control-engineer',
]);

/** Authenticated app shell — only loaded for private/authenticated flows. Public routes use AppRouter. */
export function AuthenticatedApp() {
    const { user, setUser, loading, handleLogout } = useAuth();
    const {
        activeModule, setActiveModule,
        pendingLibraryItem, setPendingLibraryItem,
        isProfileOpen, setIsProfileOpen,
        initialProfileTab, setInitialProfileTab,
        viewMode, setViewMode,
        activeWeek, setActiveWeek,
        showGames, setShowGames,
        initialGameId, setInitialGameId,
        gamesEnabled, setGamesEnabled,
        activeYearGroup, setActiveYearGroup,
        devViewOverride, setDevViewOverride,
        showExitConfirm, setShowExitConfirm,
        peerFeedbackMissionId, setPeerFeedbackMissionId,
        handleExitModule,
        handleRequestExitModule,
        handleSelectModule,
    } = useNavigation({ user });
    const {
        focusMode, setFocusMode,
        focusMissionId, setFocusMissionId,
        focusMissionTitle, setFocusMissionTitle,
        focusModeAcknowledged, setFocusModeAcknowledged,
        FOCUS_INTENT_KEY,
    } = useFocusMode({ user, activeModule, handleSelectModule });

    const { showWarning: showInactivityWarning, secondsLeft, dismissWarning } = useInactivityTimeout();

    // Initialize viewMode based on user role
    useEffect(() => {
        if (user?.role === 'teacher' || user?.role === 'developer') setViewMode('monitoring');
        else if (user?.role === 'student') setViewMode('assignments');
    }, [user?.role]);

    // Guard against double mission completion (race condition on rapid clicks)
    const completingMissionRef = React.useRef<Set<string>>(new Set());

    // Flexible scheduling: load containers for the current school + year group
    const { containers, loading: containersLoading } = useSchoolContainers(user?.schoolId, activeYearGroup);
    const [showStudentOnboarding, setShowStudentOnboarding] = useState(false);
    const [showAvatarSetup, setShowAvatarSetup] = useState(false);
    const [showNulmeting, setShowNulmeting] = useState(false);
    const [showEindmeting, setShowEindmeting] = useState(false);
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

    // IMPORTANT: useMemo MUST be called before any early returns to satisfy Rules of Hooks.
    // (Moving this after early returns caused React error #310 — "Rendered more hooks than
    // during the previous render" — because the hook count changed between loading/loaded states.)
    const studentTutorialSteps = useMemo((): TutorialStep[] =>
        STUDENT_TUTORIAL_STEPS,
    []);

    // Redirect naar login als er geen user is na auth-check.
    // MOET in useEffect: dispatchEvent triggert setState in AppRouter,
    // en React 19 gooit een error als setState wordt aangeroepen tijdens render van een ander component.
    useEffect(() => {
        if (!loading && !user) {
            window.history.replaceState({}, '', '/login');
            window.dispatchEvent(new Event('pathchange'));
        }
    }, [loading, user]);

    // Onboarding triggers: useEffect i.p.v. setTimeout-in-render (React 19 compatibiliteit).
    // Moeten vóór early returns staan om Rules of Hooks te respecteren.
    useEffect(() => {
        if (user?.role === 'student' && !user.stats?.hasCompletedAvatarSetup && !showAvatarSetup) {
            const id = setTimeout(() => setShowAvatarSetup(true), 100);
            return () => clearTimeout(id);
        }
    }, [user?.role, user?.stats?.hasCompletedAvatarSetup, showAvatarSetup]);

    useEffect(() => {
        if (user?.role === 'student' && !user.stats?.hasCompletedNulmeting && !showNulmeting) {
            const id = setTimeout(() => setShowNulmeting(true), 100);
            return () => clearTimeout(id);
        }
    }, [user?.role, user?.stats?.hasCompletedNulmeting, showNulmeting]);

    // Eindmeting: check of de docent de eindmeting heeft vrijgegeven voor deze klas
    useEffect(() => {
        if (user?.role !== 'student' || !user.stats?.hasCompletedNulmeting || !user.schoolId || !user.stats?.studentClass) return;
        let cancelled = false;
        (async () => {
            try {
                const { getCurrentSchoolYear, hasCompletedAssessment } = await import('@/services/assessmentService');
                const schoolYear = getCurrentSchoolYear();
                // Al afgerond? Niet opnieuw tonen
                const done = await hasCompletedAssessment(user.uid, 'eindmeting', schoolYear);
                if (done || cancelled) return;
                // Check of de docent de klas heeft vrijgegeven
                const { data, error } = await (supabase as any).from('eindmeting_releases')
                    .select('id')
                    .eq('school_id', user.schoolId)
                    .eq('school_year', schoolYear)
                    .eq('student_class', user.stats.studentClass)
                    .maybeSingle();
                if (error || cancelled) return; // Tabel bestaat nog niet of query faalde — stil falen
                if (data) setShowEindmeting(true);
            } catch { /* stil falen — tabellen bestaan nog niet */ }
        })();
        return () => { cancelled = true; };
    }, [user?.uid, user?.role, user?.schoolId, user?.stats?.studentClass, user?.stats?.hasCompletedNulmeting]);

    const handleSaveProgress = async (stats: UserStats) => {
        if (!user) return;
        try {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FCF6EA] flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="animate-spin text-lab-coral" aria-hidden="true" />
                <span className="sr-only">Laden...</span>
                <p className="text-lab-muted font-medium">Laden...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect wordt afgehandeld door de useEffect hierboven.
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
            <Suspense fallback={<LoadingFallback />}>
                <MfaGate onVerified={() => {
                    setUser({ ...user, mfaPending: false });
                }} />
            </Suspense>
        );
    }

    // Teacher first-login gate — verplichte mini-wizard voor docenten die voor het eerst inloggen.
    // Zet `stats.hasCompletedTeacherOnboarding` op true. Developers die via devViewOverride als
    // teacher previewen blijven user.role === 'developer', dus die slaan we hier automatisch over.
    if (user.role === 'teacher' && !user.stats?.hasCompletedTeacherOnboarding) {
        return (
            <Suspense fallback={<LoadingFallback />}>
                <TeacherFirstLoginWizard
                    user={user}
                    onComplete={(updates) => setUser({ ...user, ...updates })}
                />
            </Suspense>
        );
    }

    const hasCompletedAvatarSetup = user.stats?.hasCompletedAvatarSetup === true;

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

    // Nulmeting escaperoom: na avatar setup, voor het dashboard
    const hasCompletedNulmeting = user.stats?.hasCompletedNulmeting === true;

    if (showNulmeting && user.role === 'student' && !hasCompletedNulmeting) {
        const handleNulmetingComplete = async (result: NulmetingResult) => {
            if (user) {
                const newStats = {
                    ...user.stats,
                    hasCompletedNulmeting: true,
                    nulmetingResult: result,
                };
                await handleSaveProgress(newStats);
                setUser({ ...user, stats: newStats });
            }
            setShowNulmeting(false);
        };
        return (
            <Suspense fallback={<LoadingFallback />}>
                <NulmetingFlow
                    onComplete={handleNulmetingComplete}
                    onBack={handleLogout}
                />
            </Suspense>
        );
    }

    if (showEindmeting && user?.role === 'student' && user.stats?.nulmetingResult) {
        const handleEindmetingComplete = async (eindmetingResult: NulmetingResult) => {
            if (user) {
                // Save via assessmentService
                const { saveAssessmentResult, getCurrentSchoolYear } = await import('@/services/assessmentService');
                await saveAssessmentResult(
                    user.uid,
                    eindmetingResult,
                    'eindmeting',
                    getCurrentSchoolYear(),
                    user.schoolId
                );
                setShowEindmeting(false);
            }
        };

        return (
            <Suspense fallback={<LoadingFallback />}>
                <EindmetingFlow
                    nulmetingResult={user.stats.nulmetingResult}
                    onComplete={handleEindmetingComplete}
                    onBack={() => setShowEindmeting(false)}
                />
            </Suspense>
        );
    }

    const hasCompletedFocusMission = focusMissionId && user?.stats?.missionsCompleted?.includes(focusMissionId);

    if (user.role === 'student' && focusMode && !activeModule && !focusModeAcknowledged && !hasCompletedFocusMission) {
        return (
            <div className="min-h-screen bg-lab-ink flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lab-coral/20 via-transparent to-transparent animate-pulse"></div>
                </div>
                <div className="max-w-md w-full text-center space-y-8 relative z-10">
                    <div className="relative inline-block">
                        <div className={`w-24 h-24 ${focusMissionId ? 'bg-lab-sage' : 'bg-lab-coral'} rounded-[2.5rem] flex items-center justify-center shadow-2xl ${focusMissionId ? 'shadow-lab-coral/40' : 'shadow-lab-coral/40'} animate-bounce`}>
                            <Lock size={48} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lab-coral rounded-full border-4 border-lab-line flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {focusMissionId && focusMissionTitle ? (
                            <>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Opdracht Verplicht</h1>
                                <p className="text-lab-muted font-medium leading-relaxed">
                                    De docent heeft een specifieke opdracht geselecteerd die je <span className="text-lab-sage font-bold">nu moet maken</span>.
                                </p>
                                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-xs text-lab-muted uppercase tracking-widest font-bold mb-2">Je opdracht</p>
                                    <h2 className="text-xl font-black text-white">{focusMissionTitle}</h2>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Ogen op de docent!</h1>
                                <p className="text-lab-muted font-medium leading-relaxed">
                                    De docent heeft de <span className="text-lab-coral font-bold">Focus Modus</span> geactiveerd.
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
                            className="w-full py-4 bg-gradient-to-r from-lab-coral to-lab-teal text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-lab-coral/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Bekijk Opdracht
                            <Rocket size={20} />
                        </button>
                    ) : (
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-lab-coral uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-lab-coral rounded-full animate-pulse"></div>
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
        const role =
            activeModule && !DEDICATED_MISSIONS.has(activeModule) && !isTemplateMission(activeModule) && isAgentRoleId(activeModule)
                ? activeModule as RoleId
                : undefined;

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
	                    onComplete={(success) => {
	                        if (success) handleMissionComplete('game-director');
	                        else handleExitModule();
	                    }}
	                    stats={user?.stats}
	                />
	            );
	        }

	        async function handleMissionComplete(missionId: string) {
            // Idempotency guard: prevent double completion from rapid clicks or re-renders
            if (completingMissionRef.current.has(missionId)) return;

            if (user && user.stats) {
                const currentCompleted = user.stats.missionsCompleted || [];
                if (!currentCompleted.includes(missionId)) {
                    completingMissionRef.current.add(missionId);
                    try {
                        const newStats = {
                            ...user.stats,
                            missionsCompleted: [...currentCompleted, missionId],
	        }
                        setUser({ ...user, stats: newStats });
                        await handleSaveProgress(newStats);

                        // Award XP via server-side RPC (enforces rate limiting + daily cap)
                        const xpResult = await awardXP(user.uid, 50, 'Missie Voltooid', missionId);
                        if (xpResult.awarded && xpResult.newXP !== undefined) {
                            setUser(prev => prev ? {
                                ...prev,
                                stats: { ...prev.stats, xp: xpResult.newXP!, level: xpResult.newLevel ?? prev.stats.level }
                            } : prev);
                        }

                        logActivity({
                            uid: user.uid,
                            schoolId: user.schoolId,
                            studentName: user.displayName || 'Naamloos',
                            type: 'mission_complete',
                            data: `Missie voltooid: ${missionId} (+50 XP)`,
                            missionId
                        });
                        if (focusMissionId && missionId === focusMissionId) {
                            setFocusMode(false);
                            setFocusMissionId(null);
                            setFocusMissionTitle(null);
                        }
                    } finally {
                        completingMissionRef.current.delete(missionId);
                    }
                }
            }
            // Show peer feedback panel instead of immediately exiting
            setPeerFeedbackMissionId(missionId);
        };

        // Peer feedback overlay after mission completion
        if (peerFeedbackMissionId && user) {
            const cls = user.stats?.studentClass || user.studentClass || '';
            return (
                <div className="min-h-screen bg-[#FCF6EA] flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-4">
                        <Suspense fallback={<LoadingFallback />}>
                            <PeerFeedbackPanel
                                missionId={peerFeedbackMissionId}
                                studentId={user.uid}
                                schoolId={user.schoolId || ''}
                                classId={cls}
                            />
                        </Suspense>
                        <button
                            onClick={() => {
                                setPeerFeedbackMissionId(null);
                                handleExitModule();
                            }}
                            className="w-full py-3 bg-[#445865] hover:bg-[#08283B] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Terug naar dashboard
                        </button>
                    </div>
                </div>
            );
        }

        // Template-based missions: route to the unified TemplateMissionRouter
        if (activeModule && isTemplateMission(activeModule)) {
            const tmId = activeModule;
            return (
                <Suspense fallback={<LoadingFallback />}>
                    <TemplateMissionRouter
                        missionId={tmId}
                        onBack={handleRequestExitModule}
                        onComplete={(success) => {
                            if (success) handleMissionComplete(tmId);
                            else handleExitModule();
                        }}
                        stats={user?.stats}
                        vsoProfile={user?.stats?.vsoProfile}
                    />
                </Suspense>
            );
        }

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

        if (activeModule === 'access-control-engineer') {
            return (
                <AccessControlEngineerMission
                    onBack={handleRequestExitModule}
                    onComplete={(success) => {
                        if (success) handleMissionComplete('access-control-engineer');
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
                <div className="flex-1 w-full flex flex-col font-sans text-lab-ink pb-safe relative">
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
            if (devViewOverride === 'teacher') {
                return (
                    <div className="relative">
                        <button
                            onClick={() => setDevViewOverride('developer')}
                            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-lab-teal text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-lab-teal/25 hover:bg-lab-teal hover:text-white transition-colors"
                        >
                            <Code2 size={16} />
                            <span className="hidden sm:inline">Terug naar Developer</span>
                            <span className="sm:hidden">Dev</span>
                        </button>
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
                    </div>
                );
            }
            if (devViewOverride === 'student') {
                return (
                    <div className="relative">
                        <button
                            onClick={() => setDevViewOverride('developer')}
                            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-lab-teal text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-lab-teal/25 hover:bg-lab-teal hover:text-white transition-colors"
                        >
                            <Code2 size={16} />
                            <span className="hidden sm:inline">Terug naar Developer</span>
                            <span className="sm:hidden">Dev</span>
                        </button>
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
                            userRole={user.role}
                            activeYearGroup={activeYearGroup}
                            setActiveYearGroup={setActiveYearGroup}
                            containers={containers}
                        />
                    </div>
                );
            }
            return (
                <DeveloperDashboard
                    user={user}
                    onLogout={handleLogout}
                    onSwitchView={setDevViewOverride}
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
                containers={containers}
            />
        );
    };

    const showFooter = !activeModule && !isProfileOpen && !showGames && viewMode !== 'monitoring';

    const appShell = (
        <div className="w-full min-h-screen bg-[#FCF6EA] pb-safe flex flex-col relative">
            <a href="#main-content" className="skip-link">Naar hoofdinhoud</a>

            {/* Offline indicator */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-[100] bg-lab-coral text-white text-[10px] font-black uppercase tracking-widest py-1.5 text-center shadow-md animate-in slide-in-from-top duration-300">
                    Je bent offline. Sommige functies (zoals AI) werken mogelijk niet.
                </div>
            )}

            <main id="main-content" className={`flex-1 flex flex-col${showFooter ? '' : ' min-h-0'}`} tabIndex={-1}>
                {user.role === 'student' && (
                    <Suspense fallback={null}>
                        <TutorialSpotlight />
                        <TutorialRestartButton />
                    </Suspense>
                )}
                <SecureErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                        {renderContent()}
                    </Suspense>
                </SecureErrorBoundary>
            </main>
            <div className="fixed top-4 right-4 pr-safe pt-safe flex items-center gap-3 z-50" />
            {user.role === 'teacher' && viewMode === 'assignments' && (
                <div className="fixed bottom-8 left-8 pointer-events-auto z-50 flex flex-col items-start gap-2">
                    <div className="bg-lab-teal/10 backdrop-blur-md border border-lab-teal px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm mb-1">
                        <div className="w-2 h-2 rounded-full bg-lab-coral animate-pulse"></div>
                        <span className="text-[10px] font-black text-lab-teal uppercase tracking-widest">Docent Mode Actief</span>
                    </div>
                    {!activeModule && !isProfileOpen && (
                        <button
                            onClick={() => setViewMode('monitoring')}
                            className="group bg-lab-ink text-white pl-3 pr-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-lab-coral hover:text-white transition-all shadow-xl hover:shadow-lab-coral/30 flex items-center gap-2.5 active:scale-95"
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
                <Suspense fallback={null}>
                    <Footer
                        onAccountDeleted={handleLogout}
                        schoolId={user.schoolId}
                    />
                </Suspense>
            )}
            <Suspense fallback={null}>
                <CookieConsent schoolId={user.schoolId} />
            </Suspense>
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
            {showInactivityWarning && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label="Inactiviteits-waarschuwing">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                        <div className="w-14 h-14 bg-lab-gold rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={28} className="text-lab-gold" />
                        </div>
                        <h2 className="text-lg font-black text-lab-ink mb-2">Ben je er nog?</h2>
                        <p className="text-lab-muted text-sm mb-4">
                            Je wordt automatisch uitgelogd over <span className="font-bold text-lab-gold">{Math.ceil(secondsLeft / 60)} min</span> wegens inactiviteit.
                        </p>
                        <button
                            onClick={dismissWarning}
                            className="w-full px-4 py-3 bg-lab-coral text-white font-bold rounded-xl hover:bg-lab-coral hover:text-white transition-colors"
                        >
                            Ik ben er nog
                        </button>
                    </div>
                </div>
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );

    const wrapped = user.role === 'student' ? (
        <TutorialProvider
            steps={studentTutorialSteps}
            storageKey={STUDENT_STORAGE_KEY}
            autoStart={true}
            isCompleted={user?.stats?.hasCompletedStudentTutorial}
            onComplete={async () => {
                if (user) {
                    const newStats = { ...user.stats, hasCompletedStudentTutorial: true };
                    setUser({ ...user, stats: newStats });
                    await handleSaveProgress(newStats);
                }
            }}
        >
            {appShell}
        </TutorialProvider>
    ) : appShell;

    return (
        <AccessibilityProvider>
            {wrapped}
        </AccessibilityProvider>
    );
}
