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
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
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
    const barColor = isComplete ? 'bg-lab-sage' : percentage >= 75 ? 'bg-lab-gold' : 'bg-red-400';

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${percentage}%` }} />
                </div>
                <span className="font-medium text-gray-700 tabular-nums">{percentage}%</span>
                <span className="text-gray-400 text-xs">kerndoelen</span>
                {!isComplete && (
                    <AlertTriangle size={14} className="text-lab-gold shrink-0" aria-label={`${missing.length} kerndoel(en) niet gedekt`} />
                )}
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-36 h-2.5 rounded-full bg-gray-100 overflow-hidden shrink-0">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="font-semibold text-gray-800 tabular-nums">{percentage}%</span>
                    <span className="text-gray-500 text-sm truncate">
                        kerndoelen gedekt
                        {!isComplete && (
                            <span className="ml-1 text-lab-gold">
                                ({missing.length} ontbrekend)
                            </span>
                        )}
                    </span>
                </div>
                <span className="text-gray-400 ml-2 shrink-0">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
            </button>

            {/* Expandable details */}
            {expanded && (
                <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                    {/* Covered */}
                    {covered.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Gedekt ({covered.length})
                            </p>
                            <ul className="space-y-1.5">
                                {covered.map((code) => {
                                    const kd = SLO_KERNDOELEN[code];
                                    const colors = DOMAIN_COLORS[kd.kleur];
                                    return (
                                        <li key={code} className="flex items-start gap-2">
                                            <CheckCircle size={15} className="text-lab-sage shrink-0 mt-0.5" />
                                            <span className={`inline-flex items-center gap-1.5 text-sm leading-snug`}>
                                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                                                    {code}
                                                </span>
                                                <span className="text-gray-700 font-medium">{kd.label}</span>
                                                <span className="text-gray-400 text-xs hidden sm:inline">— {kd.omschrijving}</span>
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
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Ontbrekend ({missing.length})
                            </p>
                            <ul className="space-y-1.5">
                                {missing.map((code) => {
                                    const kd = SLO_KERNDOELEN[code];
                                    const colors = DOMAIN_COLORS[kd.kleur];
                                    return (
                                        <li key={code} className="flex items-start gap-2">
                                            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                                            <span className="inline-flex items-center gap-1.5 text-sm leading-snug">
                                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border} opacity-60`}>
                                                    {code}
                                                </span>
                                                <span className="text-gray-500 font-medium">{kd.label}</span>
                                                <span className="text-gray-400 text-xs hidden sm:inline">— {kd.omschrijving}</span>
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
