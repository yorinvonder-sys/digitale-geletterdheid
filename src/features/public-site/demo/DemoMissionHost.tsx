import React, { lazy, Suspense } from 'react';
import { PLAYABLE_MISSION_IDS } from './demoGalleryConfig';

const GameLabExperience = lazy(() => import('@/features/public-site/game-lab/GameLabExperience'));

const CloudCleanerMission = lazy(() =>
    import('@/features/missions/review/CloudCleanerMission').then(m => ({ default: m.CloudCleanerMission }))
);
const DataDetectiveMission = lazy(() =>
    import('@/features/missions/DataDetectiveMission').then(m => ({ default: m.DataDetectiveMission }))
);
const FilterBubbleBreakerMission = lazy(() =>
    import('@/features/missions/FilterBubbleBreakerMission').then(m => ({ default: m.FilterBubbleBreakerMission }))
);
const DatalekkenRampenplanMission = lazy(() =>
    import('@/features/missions/DatalekkenRampenplanMission').then(m => ({ default: m.DatalekkenRampenplanMission }))
);
const AccessControlEngineerMission = lazy(() =>
    import('@/features/missions/AccessControlEngineerMission').then(m => ({ default: m.AccessControlEngineerMission }))
);

const AI_MISSION_ID = 'game-director';

interface Props {
    missionId: string;
    onBack: () => void;
}

const Loading = () => (
    <div className="flex min-h-screen items-center justify-center bg-duck-bg">
        <p className="text-duck-ink/65 font-medium">Missie laden...</p>
    </div>
);

const AccountCta: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-duck-bg px-6 text-center">
        <p className="text-5xl">🔒</p>
        <h2 className="max-w-sm font-display text-3xl text-duck-ink">
            Deze missie is alleen beschikbaar voor leerlingen met een account
        </h2>
        <p className="max-w-sm text-base font-semibold text-duck-ink/65">
            Meld je school aan voor een pilot om toegang te krijgen tot alle missies.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
            <a
                href="/pilot"
                className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
            >
                Schoolpilot aanmelden
            </a>
            <button
                onClick={onBack}
                className="inline-flex min-h-[50px] items-center gap-2 rounded-full border border-duck-ink/20 px-7 py-3 text-sm font-extrabold text-duck-ink transition-all hover:border-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
            >
                Terug naar demo
            </button>
        </div>
    </div>
);

export const DemoMissionHost: React.FC<Props> = ({ missionId, onBack }) => {
    if (missionId === '__account_cta__') {
        return <AccountCta onBack={onBack} />;
    }

    if (missionId === AI_MISSION_ID) {
        return (
            <div className="min-h-screen bg-duck-ink">
                <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <button
                        onClick={onBack}
                        className="text-sm font-bold text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid"
                    >
                        ← Terug naar demo
                    </button>
                    <span className="text-sm font-semibold text-white/55">
                        AI Game Builder — demo (max. 10 prompts per dag)
                    </span>
                </div>
                <div className="mx-auto max-w-6xl px-5 py-10 text-white md:px-10">
                    <Suspense fallback={<Loading />}>
                        <GameLabExperience />
                    </Suspense>
                </div>
            </div>
        );
    }

    if (!PLAYABLE_MISSION_IDS.has(missionId)) {
        return <AccountCta onBack={onBack} />;
    }

    const missionProps = { onBack, onComplete: onBack };

    return (
        <Suspense fallback={<Loading />}>
            {missionId === 'cloud-cleaner' && <CloudCleanerMission {...missionProps} />}
            {missionId === 'data-detective' && <DataDetectiveMission {...missionProps} />}
            {missionId === 'filter-bubble-breaker' && <FilterBubbleBreakerMission {...missionProps} />}
            {missionId === 'datalekken-rampenplan' && <DatalekkenRampenplanMission {...missionProps} />}
            {missionId === 'access-control-engineer' && <AccessControlEngineerMission {...missionProps} />}
        </Suspense>
    );
};
