import React, { Suspense, lazy } from 'react';
import '@/styles/app.css';
import '@/styles/authenticated.css';

import { isAgentRoleId } from '@/config/agentRoleIds';
import { ROLES } from '@/config/agents';
import { isTemplateMission } from '@/config/templateRegistry';
import type { ParentUser, RoleId } from '@/types';
import { AiLab } from '@/features/ai-lab/AiLab';
import { MissionBriefing } from '@/features/missions/shared/MissionBriefing';
import { PromptMasterMission } from '@/features/missions/PromptMasterMission';
import { TemplateMissionRouter } from '@/features/missions/templates/TemplateMissionRouter';

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
    const [agentRoleStarted, setAgentRoleStarted] = React.useState(startedParam);

    React.useEffect(() => {
        if (!resetPreview) return;

        const directKey = `dgskills_mission_${missionId}`;
        Object.keys(window.localStorage)
            .filter((key) => key === directKey || key.endsWith(`_${missionId}`))
            .forEach((key) => window.localStorage.removeItem(key));
    }, [missionId, resetPreview]);

    React.useEffect(() => {
        setAgentRoleStarted(startedParam);
    }, [missionId, startedParam]);

    const completionHandler = () => undefined;
    const startAgentRole = () => {
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set('mission', missionId);
        nextParams.set('started', '1');
        window.history.replaceState(null, '', `${window.location.pathname}?${nextParams.toString()}`);
        setAgentRoleStarted(true);
    };

    if (missionId === 'prompt-master') {
        return (
            <PromptMasterMission
                onBack={() => undefined}
                onComplete={() => undefined}
                qaMode
            />
        );
    }

    if (missionId === 'game-director') {
        return <Suspense fallback={<PreviewLoading />}><GameDirectorMission onBack={() => undefined} onComplete={completionHandler} stats={previewUser.stats} /></Suspense>;
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
        return <Suspense fallback={<PreviewLoading />}><WordSimulator onExit={() => undefined} onLevelComplete={() => undefined} /></Suspense>;
    }

    if (missionId === 'pitch-police') {
        return <Suspense fallback={<PreviewLoading />}><PitchPoliceMission onBack={() => undefined} onComplete={completionHandler} /></Suspense>;
    }

    if (missionId !== 'prompt-master' && !isTemplateMission(missionId) && !isAgentRoleId(missionId)) {
        return (
            <main
                data-qa="mission-preview-unsupported"
                className="min-h-screen bg-lab-cream p-6 text-lab-ink"
            >
                <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-lab-paper p-6">
                    <h1 className="text-2xl font-black">Mission preview niet beschikbaar</h1>
                    <p className="mt-3 text-lab-muted">
                        Deze lokale preview ondersteunt `prompt-master` en template-missies.
                    </p>
                </div>
            </main>
        );
    }

    if (isTemplateMission(missionId)) {
        return (
            <TemplateMissionRouter
                missionId={missionId}
                onBack={() => undefined}
                onComplete={() => undefined}
            />
        );
    }

    if (isAgentRoleId(missionId)) {
        const role = ROLES.find((r) => r.id === missionId);
        if (!role) return null;

        if (!agentRoleStarted) {
            return (
                <main className="min-h-screen bg-lab-cream text-lab-ink">
                    <MissionBriefing
                        role={role}
                        onStart={startAgentRole}
                        onBack={() => undefined}
                    />
                </main>
            );
        }

        return (
            <AiLab
                user={previewUser}
                onExit={() => undefined}
                saveProgress={() => undefined}
                initialRole={missionId as RoleId}
                devPreviewMode
            />
        );
    }

    return null;
};

export default DevMissionPreview;
