import '@/styles/app.css';
import '@/styles/authenticated.css';

import { MissionQualityDashboard } from '@/features/developer/mission-quality/MissionQualityDashboard';

export default function DevMissionQualityPreview() {
    if (!import.meta.env.DEV) return null;

    return (
        <main className="min-h-screen bg-duck-bg px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1600px]">
                <MissionQualityDashboard previewMode />
            </div>
        </main>
    );
}
