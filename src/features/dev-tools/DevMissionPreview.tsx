import React, { Suspense, lazy } from 'react';
import '@/styles/app.css';
import '@/styles/authenticated.css';

import { isAgentRoleId } from '@/config/agentRoleIds';
import { ROLES } from '@/config/agents';
import { isTemplateMission } from '@/config/templateRegistry';
import type { EducationLevel, ParentUser, RoleId, UserStats } from '@/types';
import { AiLab } from '@/features/ai-lab/AiLab';
import { MissionBriefing } from '@/features/missions/shared/MissionBriefing';
import { PromptMasterMission } from '@/features/missions/PromptMasterMission';
import { TemplateMissionRouter } from '@/features/missions/templates/TemplateMissionRouter';
import { supabase } from '@/services/supabase';

const GameDirectorMission = lazy(() => import('@/features/missions/GameDirectorMission').then(m => ({ default: m.GameDirectorMission })));
const DataDetectiveMission = lazy(() => import('@/features/missions/DataDetectiveMission').then(m => ({ default: m.DataDetectiveMission })));
const DeepfakeDetectorMission = lazy(() => import('@/features/missions/DeepfakeDetectorMission').then(m => ({ default: m.DeepfakeDetectorMission })));
const FilterBubbleBreakerMission = lazy(() => import('@/features/missions/FilterBubbleBreakerMission').then(m => ({ default: m.FilterBubbleBreakerMission })));
const DatalekkenRampenplanMission = lazy(() => import('@/features/missions/DatalekkenRampenplanMission').then(m => ({ default: m.DatalekkenRampenplanMission })));
const DataVoorDataMission = lazy(() => import('@/features/missions/DataVoorDataMission').then(m => ({ default: m.DataVoorDataMission })));
const AccessControlEngineerMission = lazy(() => import('@/features/missions/AccessControlEngineerMission').then(m => ({ default: m.AccessControlEngineerMission })));
const PrintInstructiesMission = lazy(() => import('@/features/missions/PrintInstructiesMission').then(m => ({ default: m.PrintInstructiesMission })));
const CloudCleanerMission = lazy(() => import('@/features/missions/review/CloudCleanerMission').then(m => ({ default: m.CloudCleanerMission })));
const PitchPoliceMission = lazy(() => import('@/features/missions/review/PitchPoliceMission').then(m => ({ default: m.PitchPoliceMission })));
const WordSimulator = lazy(() => import('@/features/word-simulator').then(m => ({ default: m.WordSimulator })));

const previewUser: ParentUser = {
    uid: 'dev-mission-preview-user',
    displayName: 'Dev Preview',
    email: 'preview@dgskills.local',
    photoURL: null,
    role: 'student',
    identifier: 'DEV',
    schoolId: 'dev-school',
    studentClass: 'MH1A',
    yearGroup: 1,
    educationLevel: 'mavo',
    stats: {
        xp: 0,
        level: 1,
        missionsCompleted: [],
        inventory: [],
        hasCompletedStudentTutorial: true,
        studentClass: 'MH1A',
        yearGroup: 1,
        educationLevel: 'mavo',
        missionProgress: {},
    },
};

const EDUCATION_LEVELS: EducationLevel[] = ['mavo', 'havo', 'vwo'];

function toEducationLevel(value: unknown, fallback: EducationLevel): EducationLevel {
    return typeof value === 'string' && EDUCATION_LEVELS.includes(value as EducationLevel)
        ? value as EducationLevel
        : fallback;
}

function buildAgentQaStats(missionId: string, qaState: string, baseStats: UserStats): UserStats {
    if (qaState !== 'active' && qaState !== 'complete') return baseStats;

    const role = ROLES.find((item) => item.id === missionId);
    const stepCount = missionId === 'game-programmeur'
        ? Math.max(5, role?.steps?.length ?? 5)
        : Math.max(1, role?.steps?.length ?? 3);
    const completedSteps = qaState === 'complete'
        ? Array.from({ length: stepCount }, (_, index) => index)
        : [0];
    const data: Record<string, unknown> = {};

    if (missionId === 'game-programmeur') {
        data.activeGameCode = role?.initialCode || '';
    }

    if (missionId === 'ai-trainer') {
        data.activeTrainerData = qaState === 'complete'
            ? {
                classALabel: 'Plastic',
                classBLabel: 'Papier',
                classAItems: ['plastic flesje', 'lege chipszak', 'shampoo fles'],
                classBItems: ['oude krant', 'kartonnen doos', 'eierdoos'],
                testItem: { name: 'eierdoos', predictedClass: 'B', confidence: 0.86 },
            }
            : {
                classALabel: 'Plastic',
                classBLabel: 'Papier',
                classAItems: ['plastic flesje', 'lege chipszak'],
                classBItems: ['oude krant'],
            };
    }

    if (missionId === 'verhalen-ontwerper') {
        data.activeBookData = {
            title: 'De App die Waarschuwde',
            pages: [
                {
                    text: 'Mila ontdekt dat de schoolapp ineens geheimzinnige meldingen stuurt over een vergeten lokaal.',
                },
                {
                    text: 'Ze kiest bewijs boven paniek en vraagt de AI om drie mogelijke verklaringen te vergelijken.',
                },
                {
                    text: 'Aan het eind blijkt de AI geen vijand, maar een waarschuwer die om betere regels vraagt.',
                },
            ],
        };
    }

    return {
        ...baseStats,
        missionsCompleted: qaState === 'complete'
            ? [...new Set([...(baseStats.missionsCompleted || []), missionId])]
            : baseStats.missionsCompleted,
        missionProgress: {
            ...(baseStats.missionProgress || {}),
            [missionId]: {
                completedSteps,
                lastActive: new Date(),
                data,
            },
        },
    };
}

const PreviewLoading = () => (
    <main className="min-h-screen bg-lab-cream p-6 text-lab-ink">
        <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-lab-paper p-6">
            Missie laden...
        </div>
    </main>
);

const DevMissionPreview: React.FC = () => {
    if (!import.meta.env.DEV) return null;

    const searchParams = new URLSearchParams(window.location.search);
    const missionId = searchParams.get('mission') ?? 'prompt-master';
    const resetPreview = searchParams.get('reset') === '1';
    const startedParam = searchParams.get('started') === '1';
    const qaState = searchParams.get('qaState') ?? '';
    const qaAuth = searchParams.get('qaAuth') === '1';
    const shouldAutoStartAgent = qaState === 'active' || qaState === 'complete';
    const [agentRoleStarted, setAgentRoleStarted] = React.useState(startedParam || shouldAutoStartAgent);
    const [authPreviewUser, setAuthPreviewUser] = React.useState<ParentUser | null>(null);
    const [authPreviewError, setAuthPreviewError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!resetPreview) return;

        const directKey = `dgskills_mission_${missionId}`;
        Object.keys(window.localStorage)
            .filter((key) => key === directKey || key.endsWith(`_${missionId}`))
            .forEach((key) => window.localStorage.removeItem(key));
    }, [missionId, resetPreview]);

    React.useEffect(() => {
        setAgentRoleStarted(startedParam || shouldAutoStartAgent);
    }, [missionId, startedParam, shouldAutoStartAgent]);

    React.useEffect(() => {
        if (!qaAuth) return;
        let cancelled = false;

        const loadQaUser = async () => {
            setAuthPreviewError(null);
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            const sessionUser = sessionData.session?.user;
            if (sessionError || !sessionUser) {
                if (!cancelled) setAuthPreviewError(sessionError?.message || 'Geen QA-authsessie gevonden.');
                return;
            }

            const { data: profile } = await supabase
                .from('users')
                .select('display_name,email,role,school_id,student_class,stats,year_group,education_level')
                .eq('id', sessionUser.id)
                .maybeSingle();

            const appRole = sessionUser.app_metadata?.role as ParentUser['role'] | undefined;
            const role = (profile?.role as ParentUser['role'] | undefined) || appRole || 'student';
            const schoolId = profile?.school_id || (sessionUser.app_metadata?.schoolId as string | undefined) || undefined;
            const profileStats = profile?.stats && typeof profile.stats === 'object' && !Array.isArray(profile.stats)
                ? profile.stats as unknown as Partial<UserStats>
                : {};
            const stats: UserStats = { ...previewUser.stats!, ...profileStats };
            const studentClass = profile?.student_class || stats.studentClass || previewUser.studentClass;
            const educationLevel = toEducationLevel(profile?.education_level ?? stats.educationLevel, previewUser.educationLevel ?? 'mavo');

            if (!cancelled) {
                setAuthPreviewUser({
                    uid: sessionUser.id,
                    displayName: profile?.display_name || sessionUser.user_metadata?.display_name || sessionUser.email || 'QA Student',
                    email: profile?.email || sessionUser.email || null,
                    photoURL: sessionUser.user_metadata?.avatar_url || null,
                    role,
                    identifier: sessionUser.email?.split('@')[0] || sessionUser.id,
                    schoolId,
                    studentClass,
                    yearGroup: profile?.year_group || stats.yearGroup || previewUser.yearGroup,
                    educationLevel,
                    stats: {
                        ...previewUser.stats,
                        ...stats,
                        studentClass,
                        yearGroup: profile?.year_group || stats.yearGroup || previewUser.yearGroup,
                        educationLevel,
                    },
                });
            }
        };

        loadQaUser().catch((error) => {
            if (!cancelled) setAuthPreviewError(error instanceof Error ? error.message : 'QA-authsessie laden mislukt.');
        });

        return () => {
            cancelled = true;
        };
    }, [qaAuth]);

    const completionHandler = () => undefined;
    const qaPreviewStats = React.useMemo(
        () => buildAgentQaStats(missionId, qaState, previewUser.stats!),
        [missionId, qaState]
    );
    const qaPreviewUser: ParentUser = React.useMemo(
        () => ({ ...previewUser, stats: qaPreviewStats }),
        [qaPreviewStats]
    );
    const activePreviewUser = authPreviewUser || qaPreviewUser;
    const startAgentRole = () => {
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set('mission', missionId);
        nextParams.set('started', '1');
        window.history.replaceState(null, '', `${window.location.pathname}?${nextParams.toString()}`);
        setAgentRoleStarted(true);
    };

    const content = (() => {
        if (missionId === 'prompt-master') {
            return (
                <PromptMasterMission
                    onBack={() => undefined}
                    onComplete={() => undefined}
                    qaMode
                    qaInitialPhase={qaState === 'complete' ? 'result' : qaState === 'active' ? 'challenge' : undefined}
                />
            );
        }

        if (missionId === 'game-director') {
            return <Suspense fallback={<PreviewLoading />}><GameDirectorMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} qaInitialConclusion={qaState === 'complete'} /></Suspense>;
        }

        if (missionId === 'data-detective') {
            return <Suspense fallback={<PreviewLoading />}><DataDetectiveMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'deepfake-detector') {
            return <Suspense fallback={<PreviewLoading />}><DeepfakeDetectorMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} userId={previewUser.uid} /></Suspense>;
        }

        if (missionId === 'filter-bubble-breaker') {
            return <Suspense fallback={<PreviewLoading />}><FilterBubbleBreakerMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'datalekken-rampenplan') {
            return <Suspense fallback={<PreviewLoading />}><DatalekkenRampenplanMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'data-voor-data') {
            return <Suspense fallback={<PreviewLoading />}><DataVoorDataMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'access-control-engineer') {
            return <Suspense fallback={<PreviewLoading />}><AccessControlEngineerMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'ipad-print-instructies') {
            return <Suspense fallback={<PreviewLoading />}><PrintInstructiesMission onBack={() => undefined} onComplete={completionHandler} /></Suspense>;
        }

        if (missionId === 'cloud-cleaner') {
            return <Suspense fallback={<PreviewLoading />}><CloudCleanerMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
        }

        if (missionId === 'layout-doctor') {
            return <Suspense fallback={<PreviewLoading />}><WordSimulator onExit={() => undefined} onLevelComplete={() => undefined} initialShowConclusion={qaState === 'complete'} /></Suspense>;
        }

        if (missionId === 'pitch-police') {
            return <Suspense fallback={<PreviewLoading />}><PitchPoliceMission onBack={() => undefined} onComplete={completionHandler} /></Suspense>;
        }

        if (missionId !== 'prompt-master' && !isTemplateMission(missionId) && !isAgentRoleId(missionId)) {
            return (
                <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-lab-paper p-6 my-6">
                    <h1 className="text-2xl font-black">Mission preview niet beschikbaar</h1>
                    <p className="mt-3 text-lab-muted">
                        Deze lokale preview ondersteunt `prompt-master` en template-missies.
                    </p>
                </div>
            );
        }

        if (isTemplateMission(missionId)) {
            return (
                <TemplateMissionRouter
                    missionId={missionId}
                    onBack={() => undefined}
                    onComplete={() => undefined}
                    stats={previewUser.stats}
                />
            );
        }

        if (isAgentRoleId(missionId)) {
            const role = ROLES.find((r) => r.id === missionId);
            if (!role) return null;

            if (!agentRoleStarted) {
                return (
                    <div className="bg-lab-cream text-lab-ink flex-1 flex flex-col">
                        <MissionBriefing
                            role={role}
                            onStart={startAgentRole}
                            onBack={() => undefined}
                        />
                    </div>
                );
            }

            return (
                <AiLab
                    user={activePreviewUser}
                    onExit={() => undefined}
                    saveProgress={() => undefined}
                    initialRole={missionId as RoleId}
                    devPreviewMode
                    qaState={qaState}
                />
            );
        }

        return null;
    })();

    if (qaAuth && authPreviewError) {
        return (
            <main className="min-h-screen bg-lab-cream p-6 text-lab-ink">
                <div className="mx-auto max-w-xl rounded-2xl border border-lab-coral bg-lab-paper p-6">
                    QA-authsessie mislukt: {authPreviewError}
                </div>
            </main>
        );
    }

    if (qaAuth && !authPreviewUser) {
        return (
            <main className="min-h-screen bg-lab-cream p-6 text-lab-ink">
                <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-lab-paper p-6">
                    QA-authsessie laden...
                </div>
            </main>
        );
    }

    if (!content) return null;

    return (
        <div className="w-full min-h-screen bg-[#FCF6EA] pb-safe flex flex-col relative">
            <main id="main-content" className="flex-1 flex flex-col min-h-0" tabIndex={-1}>
                {content}
            </main>
        </div>
    );
};

export default DevMissionPreview;
