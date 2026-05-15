import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContainerConfig } from '@/config/containerTypes';
import { SLO_KERNDOELEN, SloKerndoelCode } from '@/config/sloKerndoelen';
import { KERNDOEL_MISSIONS } from '@/config/slo-kerndoelen-mapping';

// Reguliere VO kerndoelen (geen VSO)
const REGULIER_CODES: SloKerndoelCode[] = ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'];

interface SLOCoverageIndicatorProps {
    containers: ContainerConfig[];
    yearGroup: number;
    compact?: boolean;
}

interface CoverageResult {
    covered: SloKerndoelCode[];
    missing: SloKerndoelCode[];
    percentage: number;
}

function computeCoverage(containers: ContainerConfig[], yearGroup: number): CoverageResult {
    // Collect all mission IDs across containers
    const missionIds = new Set<string>();
    for (const container of containers) {
        for (const m of container.missions) {
            missionIds.add(m.missionId);
        }
    }

    // Gather all SLO codes touched by those missions (filtered to this yearGroup)
    const coveredCodes = new Set<SloKerndoelCode>();
    for (const mission of KERNDOEL_MISSIONS) {
        if (mission.yearGroup !== yearGroup) continue;
        if (!missionIds.has(mission.id)) continue;
        for (const code of mission.sloKerndoelen) {
            if ((REGULIER_CODES as string[]).includes(code)) {
                coveredCodes.add(code);
            }
        }
    }

    const covered = REGULIER_CODES.filter((c) => coveredCodes.has(c));
    const missing = REGULIER_CODES.filter((c) => !coveredCodes.has(c));
    const percentage = Math.round((covered.length / REGULIER_CODES.length) * 100);

    return { covered, missing, percentage };
}

const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    blue:   { bg: 'bg-lab-teal',   text: 'text-lab-teal',   border: 'border-lab-teal' },
    purple: { bg: 'bg-lab-teal', text: 'text-lab-teal', border: 'border-lab-teal' },
    amber:  { bg: 'bg-lab-gold',  text: 'text-lab-gold',  border: 'border-lab-gold' },
};

export const SLOCoverageIndicator: React.FC<SLOCoverageIndicatorProps> = ({
    containers,
    yearGroup,
    compact = false,
}) => {
    const [expanded, setExpanded] = useState(false);
    const { covered, missing, percentage } = useMemo(
        () => computeCoverage(containers, yearGroup),
        [containers, yearGroup]
    );

    const isComplete = percentage === 100;
    const barColor = isComplete ? 'bg-lab-coral' : percentage >= 75 ? 'bg-lab-gold' : 'bg-lab-coral';

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <div className="w-24 h-2 rounded-full bg-lab-cream overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${percentage}%` }} />
                </div>
                <span className="font-medium text-lab-muted tabular-nums">{percentage}%</span>
                <span className="text-lab-muted text-xs">kerndoelen</span>
                {!isComplete && (
                    <AlertTriangle size={14} className="text-lab-muted shrink-0" aria-label={`${missing.length} kerndoel(en) niet gedekt`} />
                )}
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-lab-line bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-lab-cream transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-36 h-2.5 rounded-full bg-lab-cream overflow-hidden shrink-0">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="font-semibold text-lab-ink tabular-nums">{percentage}%</span>
                    <span className="text-lab-muted text-sm truncate">
                        kerndoelen gedekt
                        {!isComplete && (
                            <span className="ml-1 text-lab-gold">
                                ({missing.length} ontbrekend)
                            </span>
                        )}
                    </span>
                </div>
                <span className="text-lab-muted ml-2 shrink-0">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
            </button>

            {/* Expandable details */}
            {expanded && (
                <div className="border-t border-lab-line px-4 py-4 space-y-4">
                    {/* Covered */}
                    {covered.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-lab-muted uppercase tracking-wider mb-2">
                                Gedekt ({covered.length})
                            </p>
                            <ul className="space-y-1.5">
                                {covered.map((code) => {
                                    const kd = SLO_KERNDOELEN[code];
                                    const colors = DOMAIN_COLORS[kd.kleur];
                                    return (
                                        <li key={code} className="flex items-start gap-2">
                                            <CheckCircle size={15} className="text-lab-muted shrink-0 mt-0.5" />
                                            <span className={`inline-flex items-center gap-1.5 text-sm leading-snug`}>
                                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                                                    {code}
                                                </span>
                                                <span className="text-lab-muted font-medium">{kd.label}</span>
                                                <span className="text-lab-muted text-xs hidden sm:inline">— {kd.omschrijving}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Missing */}
                    {missing.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-lab-muted uppercase tracking-wider mb-2">
                                Ontbrekend ({missing.length})
                            </p>
                            <ul className="space-y-1.5">
                                {missing.map((code) => {
                                    const kd = SLO_KERNDOELEN[code];
                                    const colors = DOMAIN_COLORS[kd.kleur];
                                    return (
                                        <li key={code} className="flex items-start gap-2">
                                            <XCircle size={15} className="text-lab-coral shrink-0 mt-0.5" />
                                            <span className="inline-flex items-center gap-1.5 text-sm leading-snug">
                                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border} opacity-60`}>
                                                    {code}
                                                </span>
                                                <span className="text-lab-muted font-medium">{kd.label}</span>
                                                <span className="text-lab-muted text-xs hidden sm:inline">— {kd.omschrijving}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {isComplete && (
                        <p className="flex items-center gap-2 text-sm text-lab-sage font-medium">
                            <CheckCircle size={15} />
                            Alle kerndoelen zijn gedekt voor leerjaar {yearGroup}.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
