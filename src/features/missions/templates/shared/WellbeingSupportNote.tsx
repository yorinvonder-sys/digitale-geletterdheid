import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { HULPLIJNEN } from '@/hooks/useWellbeingMonitor';

const FONT = { fontFamily: "'Outfit', system-ui, sans-serif" } as const;

// Vaste, korte doorverwijzing voor missies met een zwaar thema. De nummers
// komen uit de canonieke HULPLIJNEN-bron zodat er geen tweede lijst ontstaat.
const KERNHULPLIJNEN = HULPLIJNEN.filter(
    (h) => h.naam === 'Kindertelefoon' || h.naam === '113 Zelfmoordpreventie',
);

export const WellbeingSupportNote: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        data-qa="wellbeing-support-note"
        role="note"
        className={`rounded-2xl border border-duck-ink/10 bg-white p-3 text-left shadow-duck-soft ${className}`}
        style={FONT}
    >
        <p className="flex items-start gap-2 text-[12px] font-semibold leading-relaxed text-duck-ink">
            <HeartHandshake size={16} className="mt-0.5 shrink-0 text-duck-ink/60" aria-hidden="true" />
            <span>Raakt dit onderwerp je? Praat erover met je mentor of vertrouwenspersoon op school.</span>
        </p>
        <p className="mt-1.5 pl-6 text-[11px] leading-relaxed text-duck-ink/75">
            {KERNHULPLIJNEN.map((h, i) => (
                <span key={h.naam}>
                    {i > 0 && ' · '}
                    {h.naam}: {h.nummer}
                </span>
            ))}
            {' — gratis en anoniem.'}
        </p>
    </div>
);
