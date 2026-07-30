import React, { useState } from 'react';
import '@/styles/app.css';
import '@/styles/authenticated.css';
import { NulmetingFlow } from '@/features/assessment/escaperoom/NulmetingFlow';
import { EindmetingFlow } from '@/features/assessment/escaperoom/EindmetingFlow';
import type { NulmetingResult } from '@/features/assessment/escaperoom/types';

// Fixture-nulmeting als vergelijkingsinput voor de eindmeting-variant.
const FIXTURE_NULMETING: NulmetingResult = {
    completedAt: '2026-01-01T00:00:00.000Z',
    totalTimeSeconds: 600,
    kamers: {
        digitaleSystemen: { score: 50, timeSeconds: 120, details: {} },
        mediaEnAI: { score: 40, timeSeconds: 120, details: {} },
        programmeren: { score: 30, timeSeconds: 120, details: {} },
        veiligheidPrivacy: { score: 60, timeSeconds: 120, details: {} },
        welzijnMaatschappij: { score: 75, timeSeconds: 120, details: {} },
    },
    overallScore: 51,
    niveau: 'basis',
};

const DevNulmetingPreview: React.FC = () => {
    if (!import.meta.env.DEV) return null;

    const searchParams = new URLSearchParams(window.location.search);
    const variant = searchParams.get('variant') === 'eindmeting' ? 'eindmeting' : 'nulmeting';
    const [resultaat, setResultaat] = useState<NulmetingResult | null>(null);

    if (resultaat) {
        return (
            <main data-qa="nulmeting-preview-klaar" className="min-h-screen bg-lab-cream p-6 text-lab-ink">
                <div className="mx-auto max-w-xl rounded-2xl border border-lab-line bg-white p-6">
                    <h1 className="text-2xl font-black">Preview afgerond — er is niets opgeslagen</h1>
                    <p className="mt-2 text-lab-muted text-sm">Variant: {variant}</p>
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-lab-cream p-4 text-xs">{JSON.stringify(resultaat, null, 2)}</pre>
                </div>
            </main>
        );
    }

    if (variant === 'eindmeting') {
        return (
            <EindmetingFlow
                nulmetingResult={FIXTURE_NULMETING}
                onComplete={setResultaat}
                onBack={() => undefined}
            />
        );
    }

    return <NulmetingFlow onComplete={setResultaat} onBack={() => undefined} />;
};

export default DevNulmetingPreview;
