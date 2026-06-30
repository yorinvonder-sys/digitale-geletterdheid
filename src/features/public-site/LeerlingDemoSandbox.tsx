import React, { lazy, Suspense, useState } from 'react';
import '@/styles/app.css';
import '@/styles/authenticated.css';
import { CURRICULUM, getPeriodConfig } from '@/config/curriculum';
import { DemoMissionHost } from '@/features/public-site/demo/DemoMissionHost';
import { DEMO_STUDENT_STATS, DEMO_STUDENTS } from '@/features/public-site/demo/demoFixtures';

const ProjectZeroDashboard = lazy(() =>
    import('@/features/student/ProjectZeroDashboard').then(m => ({ default: m.ProjectZeroDashboard }))
);
const TeacherDashboard = lazy(() =>
    import('@/features/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard }))
);

const DEMO_USER_NAME = 'Demo-leerling';
// 'capture-student' skips the 3D avatar loader (isVisualCapture check in ProjectZeroDashboard)
// which would crash without a Supabase session due to the @react-three/fiber ESM mismatch.
const DEMO_UID = 'capture-student';
const DEFAULT_DEMO_YEAR_GROUP = 1;
const DEFAULT_DEMO_PERIOD = 1;

const Loading = () => (
    <div className="flex min-h-screen items-center justify-center bg-duck-bg">
        <p className="font-medium text-duck-muted">Laden...</p>
    </div>
);

function navigateTo(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pathchange'));
}

type SandboxView = 'student' | 'teacher';

interface LeerlingDemoSandboxProps {
    initialView?: SandboxView;
}

function parseDemoParam(value: string | null): number | null {
    if (!value || !/^\d+$/.test(value)) return null;
    return Number(value);
}

function getInitialDemoSelection() {
    const fallback = {
        yearGroup: DEFAULT_DEMO_YEAR_GROUP,
        period: DEFAULT_DEMO_PERIOD,
    };

    if (typeof window === 'undefined') return fallback;

    const params = new URLSearchParams(window.location.search);
    const yearGroup = parseDemoParam(params.get('year')) ?? fallback.yearGroup;
    const period = parseDemoParam(params.get('period')) ?? fallback.period;

    if (!CURRICULUM.yearGroups[yearGroup] || !getPeriodConfig(yearGroup, period)) {
        return fallback;
    }

    return { yearGroup, period };
}

export const LeerlingDemoSandbox: React.FC<LeerlingDemoSandboxProps> = ({ initialView = 'student' }) => {
    const initialSelection = getInitialDemoSelection();
    const [sandboxView, setSandboxView] = useState<SandboxView>(initialView);
    const [activeDemoMission, setActiveDemoMission] = useState<string | null>(null);
    const [activeWeek, setActiveWeek] = useState(initialSelection.period);
    const [activeYearGroup, setActiveYearGroup] = useState(initialSelection.yearGroup);

    if (activeDemoMission) {
        return (
            <DemoMissionHost
                missionId={activeDemoMission}
                onBack={() => setActiveDemoMission(null)}
            />
        );
    }

    return (
        <div className="relative min-h-screen bg-duck-bg">
            {/* Demo banner */}
            <div className="sticky top-0 z-50 border-b border-duck-ink/10 bg-duck-ink px-4 py-2.5">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-duck-acid px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-duck-ink">
                            Demo
                        </span>
                        <span className="text-sm font-semibold text-white/70">
                            Fictieve data — geen echte leerlinggegevens
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View toggle */}
                        <div className="flex rounded-full border border-white/15 bg-white/5 p-0.5">
                            <button
                                onClick={() => setSandboxView('student')}
                                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid ${
                                    sandboxView === 'student'
                                        ? 'bg-duck-acid text-duck-ink shadow-sm'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                Leerling
                            </button>
                            <button
                                onClick={() => setSandboxView('teacher')}
                                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid ${
                                    sandboxView === 'teacher'
                                        ? 'bg-duck-acid text-duck-ink shadow-sm'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                Docent
                            </button>
                        </div>

                        <button
                            onClick={() => navigateTo('/')}
                            className="text-xs font-bold text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                        >
                            ← Terug naar site
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard content */}
            <Suspense fallback={<Loading />}>
                {sandboxView === 'student' && (
                    <ProjectZeroDashboard
                        onSelectModule={(missionId) => setActiveDemoMission(missionId)}
                        onOpenProfile={() => setActiveDemoMission('__account_cta__')}
                        onLogout={() => navigateTo('/')}
                        onOpenGames={() => setActiveDemoMission('__account_cta__')}
                        gamesEnabled={false}
                        userDisplayName={DEMO_USER_NAME}
                        userUid={DEMO_UID}
                        activeWeek={activeWeek}
                        setActiveWeek={setActiveWeek}
                        activeYearGroup={activeYearGroup}
                        setActiveYearGroup={setActiveYearGroup}
                        stats={DEMO_STUDENT_STATS}
                        userRole="student"
                        containers={[]}
                        onGoHome={() => navigateTo('/')}
                    />
                )}
                {sandboxView === 'teacher' && (
                    <TeacherDashboard
                        demoMode
                        demoStudents={DEMO_STUDENTS}
                        onLogout={() => navigateTo('/')}
                    />
                )}
            </Suspense>
        </div>
    );
};
