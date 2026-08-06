import React, { Suspense, lazy } from 'react';
import '@/styles/app.css';
import '@/styles/authenticated.css';

import { DEFAULT_AVATAR_CONFIG, ParentUser, UserStats } from '@/types';

const ProjectZeroDashboard = lazy(() =>
    import('@/features/student/ProjectZeroDashboard').then(m => ({ default: m.ProjectZeroDashboard }))
);
const UserProfile = lazy(() =>
    import('@/features/profile/UserProfile').then(m => ({ default: m.UserProfile }))
);
const StudentOnboarding = lazy(() =>
    import('@/features/student/StudentOnboarding').then(m => ({ default: m.StudentOnboarding }))
);
const AvatarSetup = lazy(() =>
    import('@/features/profile/avatar/AvatarSetup').then(m => ({ default: m.AvatarSetup }))
);

const fixtureStats: UserStats = {
    xp: 840,
    level: 3,
    missionsCompleted: ['prompt-master', 'game-director', 'deepfake-detector'],
    inventory: ['badge_prompt', 'badge_game'],
    avatarConfig: DEFAULT_AVATAR_CONFIG,
    hasCompletedOnboarding: true,
    hasCompletedAvatarSetup: true,
};

const fixtureUser: ParentUser = {
    uid: 'dev-shell-preview-user',
    displayName: 'Jamie Dev',
    email: 'jamie@dgskills.local',
    photoURL: null,
    role: 'student',
    identifier: 'DEV',
    schoolId: 'dev-school',
    studentClass: 'MH1A',
    yearGroup: 1,
    educationLevel: 'mavo',
    stats: fixtureStats,
};

const SCREENS = ['dashboard', 'profile', 'library', 'onboarding', 'avatar'] as const;
type Screen = typeof SCREENS[number];

const Loading = () => (
    <div className="flex min-h-screen items-center justify-center bg-lab-cream">
        <p className="text-lab-muted font-medium">Laden...</p>
    </div>
);

const Unsupported = ({ screen }: { screen: string }) => (
    <main className="min-h-screen bg-lab-cream p-6 text-lab-ink">
        <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-lab-paper p-6">
            <h2 className="text-xl font-black">Scherm: {screen}</h2>
            <p className="mt-3 text-lab-muted">
                Dit scherm hangt te diep aan live Supabase-data (libraryService) en kan niet
                zonder echte authenticatie gerenderd worden. Start de app normaal en log in om
                dit scherm te bekijken.
            </p>
        </div>
    </main>
);

const NAV_LINKS: Record<Screen, string> = {
    dashboard: '?screen=dashboard',
    profile: '?screen=profile',
    library: '?screen=library',
    onboarding: '?screen=onboarding',
    avatar: '?screen=avatar',
};

const Nav = ({ active }: { active: Screen }) => (
    <nav className="sticky top-0 z-50 flex gap-2 border-b border-lab-line bg-lab-cream/95 px-4 py-2 text-xs font-bold backdrop-blur">
        <span className="text-lab-muted mr-2 self-center">DEV shell:</span>
        {SCREENS.map(s => (
            <a
                key={s}
                href={NAV_LINKS[s]}
                className={`rounded-full px-3 py-1 transition-colors ${s === active ? 'bg-lab-coral text-white' : 'bg-lab-paper text-lab-ink hover:bg-lab-cream'}`}
            >
                {s}
            </a>
        ))}
    </nav>
);

const DevShellPreview: React.FC = () => {
    if (!import.meta.env.DEV) return null;

    const searchParams = new URLSearchParams(window.location.search);
    const screen = (searchParams.get('screen') ?? 'dashboard') as Screen;

    const [activeWeek, setActiveWeek] = React.useState(1);

    return (
        <>
            <Nav active={screen} />
            <Suspense fallback={<Loading />}>
                {screen === 'dashboard' && (
                    <ProjectZeroDashboard
                        onSelectModule={() => undefined}
                        onOpenProfile={() => undefined}
                        activeWeek={activeWeek}
                        setActiveWeek={setActiveWeek}
                        userDisplayName={fixtureUser.displayName}
                        userUid={fixtureUser.uid}
                        stats={fixtureStats}
                        userRole="student"
                    />
                )}
                {screen === 'profile' && (
                    <UserProfile
                        user={fixtureUser}
                        onBack={() => undefined}
                        onUpdateProfile={() => undefined}
                    />
                )}
                {screen === 'library' && (
                    <Unsupported screen="library" />
                )}
                {screen === 'onboarding' && (
                    <StudentOnboarding
                        onComplete={() => undefined}
                        userName={fixtureUser.displayName ?? 'Jamie'}
                    />
                )}
                {screen === 'avatar' && (
                    <main className="min-h-screen bg-lab-cream p-6">
                        <AvatarSetup
                            initialConfig={DEFAULT_AVATAR_CONFIG}
                            onComplete={() => undefined}
                        />
                    </main>
                )}
            </Suspense>
        </>
    );
};

export default DevShellPreview;
