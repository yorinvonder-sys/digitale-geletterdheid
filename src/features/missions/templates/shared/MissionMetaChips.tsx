import React from 'react';
import { Clock, Gauge, Star } from 'lucide-react';
import type { MissionChipMeta } from '@/config/missionMeta';

const DIFFICULTY_LABEL: Record<string, string> = {
    Easy: 'Makkelijk',
    Medium: 'Gemiddeld',
    Hard: 'Uitdagend',
};

interface MissionMetaChipsProps {
    meta: MissionChipMeta;
    className?: string;
}

const chipBase =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold';

/**
 * Renders the duration / difficulty / XP pills for a mission intro. Topic and
 * leerjaar live in the hero sublabel, so they are intentionally not repeated
 * here. Returns null when the mission has none of these three data points.
 */
export const MissionMetaChips: React.FC<MissionMetaChipsProps> = ({ meta, className = '' }) => {
    const chips: React.ReactNode[] = [];

    if (meta.durationLabel) {
        chips.push(
            <span key="duration" className={`${chipBase} border border-duck-gray bg-white text-duck-ink`}>
                <Clock size={12} aria-hidden="true" />
                {meta.durationLabel}
            </span>,
        );
    }

    if (meta.difficulty) {
        chips.push(
            <span key="difficulty" className={`${chipBase} border border-duck-gray bg-white text-duck-ink`}>
                <Gauge size={12} aria-hidden="true" />
                {DIFFICULTY_LABEL[meta.difficulty] ?? meta.difficulty}
            </span>,
        );
    }

    if (meta.xp != null) {
        chips.push(
            <span key="xp" className={`${chipBase} border border-duck-acid/40 bg-duck-ink text-duck-acid`}>
                <Star size={12} aria-hidden="true" />
                +{meta.xp} XP
            </span>,
        );
    }

    if (chips.length === 0) return null;

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {chips}
        </div>
    );
};
