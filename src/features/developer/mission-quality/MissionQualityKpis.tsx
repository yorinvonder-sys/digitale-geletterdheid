import {
    AlertTriangle,
    Bot,
    ClipboardCheck,
    ListChecks,
} from 'lucide-react';

import type { MissionQualitySummary } from './missionQualityModel';

interface MissionQualityKpisProps {
    summary: MissionQualitySummary;
}

const KPI_TONES = {
    ink: 'bg-duck-ink text-white',
    acid: 'bg-duck-acid text-duck-ink',
    error: 'bg-duck-error text-white',
    paper: 'bg-white text-duck-ink border border-duck-ink/15',
} as const;

export function MissionQualityKpis({ summary }: MissionQualityKpisProps) {
    const cards = [
        {
            id: 'curriculum',
            label: 'Actuele missies',
            value: summary.curriculumTotal,
            detail: 'Bron: curriculum',
            icon: ClipboardCheck,
            tone: 'ink',
        },
        {
            id: 'coverage',
            label: 'Statisch gematcht',
            value: `${summary.matchedAuditCount}/${summary.curriculumTotal}`,
            detail: summary.missingAuditCount === 1
                ? '1 actuele missie zonder audit'
                : `${summary.missingAuditCount} actuele missies zonder audit`,
            icon: ListChecks,
            tone: 'acid',
        },
        {
            id: 'blocked',
            label: 'Geblokkeerde records',
            value: summary.blockedAuditRecordCount,
            detail: `${summary.fixedAuditRecordCount} records fixed`,
            icon: AlertTriangle,
            tone: 'error',
        },
        {
            id: 'decisions',
            label: 'Open beslispunten',
            value: summary.openDecisionCount,
            detail: `${summary.currentOpenDecisionCount} actueel · ${summary.supplementalOpenDecisionCount} aanvullend`,
            icon: Bot,
            tone: 'paper',
        },
    ] as const;

    return (
        <section
            aria-label="Kwaliteitssamenvatting"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
        >
            {cards.map(card => {
                const Icon = card.icon;
                return (
                    <article
                        key={card.id}
                        data-qa={`quality-kpi-${card.id}`}
                        className={`rounded-3xl p-5 shadow-sm ${KPI_TONES[card.tone]}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">
                                    {card.label}
                                </p>
                                <p className="mt-2 text-3xl font-black tracking-tight">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-xs font-bold opacity-70">
                                    {card.detail}
                                </p>
                            </div>
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-current/10">
                                <Icon size={22} aria-hidden="true" />
                            </span>
                        </div>
                    </article>
                );
            })}

            <div className="sm:col-span-2 2xl:col-span-4 flex flex-col gap-2 rounded-2xl border border-duck-ink/15 bg-white px-4 py-3 text-sm text-duck-ink sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold">
                    Browserdekking: {summary.browserEvidenceMissionCount} van {summary.curriculumTotal} actuele missies
                </span>
                <span className="text-xs font-bold text-duck-ink/60">
                    {summary.reviewedDecisionCount} beslispunten menselijk beoordeeld · browserbewijs telt los van statische audit
                </span>
            </div>
        </section>
    );
}
