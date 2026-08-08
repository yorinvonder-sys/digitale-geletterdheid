import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    CircleHelp,
    MonitorCheck,
} from 'lucide-react';

import {
    getEvidenceLabel,
    type MissionQualityRecord,
} from './missionQualityModel';

interface MissionQualityListProps {
    missions: MissionQualityRecord[];
    selectedMissionId: string | null;
    onSelect: (missionId: string) => void;
}

const STATUS_STYLES = {
    blocked: {
        label: 'Geblokkeerd',
        className: 'bg-duck-error/10 text-duck-error border-duck-error/25',
        icon: AlertCircle,
    },
    fixed: {
        label: 'Fixed',
        className: 'bg-duck-acid/30 text-duck-ink border-duck-ink/10',
        icon: CheckCircle2,
    },
    missing: {
        label: 'Audit ontbreekt',
        className: 'bg-duck-ink/10 text-duck-ink border-duck-ink/15',
        icon: CircleHelp,
    },
} as const;

export function MissionQualityList({
    missions,
    selectedMissionId,
    onSelect,
}: MissionQualityListProps) {
    if (missions.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-duck-ink/25 bg-white p-10 text-center">
                <p className="font-black text-duck-ink">Geen missies gevonden</p>
                <p className="mt-1 text-sm text-duck-ink/60">Pas de filters aan.</p>
            </div>
        );
    }

    return (
        <div
            data-qa="mission-quality-list"
            className="space-y-2 xl:max-h-[72vh] xl:overflow-y-auto xl:pr-2"
            aria-label="Missies"
        >
            {missions.map(mission => {
                const status = STATUS_STYLES[mission.auditStatus];
                const StatusIcon = status.icon;
                const isSelected = selectedMissionId === mission.id;
                const openDecisions = mission.audit?.openEscalations.length || 0;
                const reviewedOn = mission.audit?.lastReviewed
                    ? new Date(mission.audit.lastReviewed).toLocaleDateString('nl-NL')
                    : 'geen reviewdatum';
                const uiuxScore = mission.audit?.reviewScores?.uiux;

                return (
                    <button
                        key={mission.id}
                        type="button"
                        data-qa={`mission-quality-row-${mission.id}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(mission.id)}
                        className={`min-h-[88px] w-full rounded-2xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-duck-ink/30 ${
                            isSelected
                                ? 'border-duck-ink bg-duck-ink text-white shadow-duck-soft'
                                : 'border-duck-ink/15 bg-white text-duck-ink hover:border-duck-ink/35 hover:bg-duck-bgLight'
                        }`}
                    >
                        <span className="flex items-start gap-3">
                            <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                                isSelected ? 'bg-duck-acid text-duck-ink' : 'bg-duck-bg text-duck-ink'
                            }`}>
                                <StatusIcon size={18} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-start justify-between gap-2">
                                    <span>
                                        <span className="block text-sm font-black leading-tight">
                                            {mission.title}
                                        </span>
                                        <span className={`mt-1 block text-[10px] font-bold uppercase tracking-wider ${
                                            isSelected ? 'text-white/65' : 'text-duck-ink/55'
                                        }`}>
                                        {mission.id} · J{mission.yearGroup} P{mission.period}
                                    </span>
                                    <span className={`mt-1 block text-[10px] font-bold ${
                                        isSelected ? 'text-white/65' : 'text-duck-ink/55'
                                    }`}>
                                        {mission.audit?.templateType || 'type onbekend'} · {reviewedOn} · UI/UX {typeof uiuxScore === 'number' ? uiuxScore : '—'}
                                    </span>
                                </span>
                                    <ChevronRight
                                        size={18}
                                        aria-hidden="true"
                                        className={isSelected ? 'text-duck-acid' : 'text-duck-ink/35'}
                                    />
                                </span>
                                <span className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                                        isSelected
                                            ? 'border-white/20 bg-white/10 text-white'
                                            : status.className
                                    }`}>
                                        {status.label}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                                        isSelected ? 'text-white/70' : 'text-duck-ink/55'
                                    }`}>
                                        <MonitorCheck size={12} aria-hidden="true" />
                                        {getEvidenceLabel(mission)}
                                    </span>
                                    {openDecisions > 0 && (
                                        <span className={`text-[10px] font-black ${
                                            isSelected ? 'text-duck-acid' : 'text-duck-error'
                                        }`}>
                                            {openDecisions} besluit{openDecisions === 1 ? '' : 'en'}
                                        </span>
                                    )}
                                </span>
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
