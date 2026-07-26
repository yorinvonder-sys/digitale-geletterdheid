import { useMemo, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

import { MISSION_QUALITY_DATA_RESULT } from './missionQualityData';
import { MissionQualityDetail } from './MissionQualityDetail';
import { MissionQualityFilters } from './MissionQualityFilters';
import { MissionQualityKpis } from './MissionQualityKpis';
import { MissionQualityList } from './MissionQualityList';
import {
    filterMissionQuality,
    resolveSelectedMissionId,
    sortMissionQuality,
    summarizeMissionQuality,
    type MissionQualityFilters as Filters,
} from './missionQualityModel';
import { useMissionQualityDecisions } from './useMissionQualityDecisions';

interface MissionQualityDashboardProps {
    userId?: string;
    previewMode?: boolean;
}

export function MissionQualityDashboard({
    userId,
    previewMode = false,
}: MissionQualityDashboardProps) {
    const [filters, setFilters] = useState<Filters>({});
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const {
        decisions,
        canEdit: canEditDecisions,
        loading: decisionsLoading,
        saving: decisionsSaving,
        error: decisionsError,
        lastSavedAt,
        updateDecision,
    } = useMissionQualityDecisions({ userId, previewMode });

    const quality = MISSION_QUALITY_DATA_RESULT.data;
    const visibleMissions = useMemo(() => {
        if (!quality) return [];
        return sortMissionQuality(filterMissionQuality(quality.missions, filters));
    }, [filters, quality]);
    const activeMissionId = resolveSelectedMissionId(visibleMissions, selectedMissionId);
    const selectedMission = visibleMissions.find(mission => mission.id === activeMissionId) || null;

    if (!quality) {
        return (
            <div className="rounded-3xl border border-duck-error/30 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-duck-error text-white">
                        <AlertTriangle size={22} aria-hidden="true" />
                    </span>
                    <div>
                        <h3 className="text-xl font-black text-duck-ink">Kwaliteitsbron kon niet worden geladen</h3>
                        <p className="mt-2 text-sm text-duck-ink/70">
                            {MISSION_QUALITY_DATA_RESULT.error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const summary = summarizeMissionQuality(quality, decisions);

    return (
        <div
            data-qa="mission-quality-dashboard"
            className="space-y-6 animate-in fade-in duration-300"
        >
            <section className="overflow-hidden rounded-3xl bg-duck-ink p-6 text-white shadow-sm md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-duck-acid">
                            Kwaliteitssysteem · {quality.missions.length} actuele missies
                        </p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                            Van losse audits naar beslisbaar bewijs
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                            Statische review, browserbewijs en jouw didactische keuzes blijven afzonderlijk zichtbaar. Een akkoord voert nooit stil een codewijziging uit.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                        <ShieldCheck size={24} aria-hidden="true" className="shrink-0 text-duck-acid" />
                        <div>
                            <p className="text-sm font-black">Menselijke goedkeuring actief</p>
                            <p className="text-xs font-bold text-white/60">Geen automatische didactische fixes</p>
                        </div>
                    </div>
                </div>
            </section>

            <div
                role={decisionsError ? 'alert' : 'status'}
                className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
                    decisionsError
                        ? 'border-duck-error/30 bg-duck-error/10 text-duck-error'
                        : 'border-duck-ink/15 bg-white text-duck-ink/60'
                }`}
            >
                {decisionsError
                    || (previewMode
                        ? 'Previewmodus: keuzes blijven alleen in deze browsertab.'
                        : decisionsLoading
                            ? 'Eerder genomen besluiten laden...'
                            : decisionsSaving
                                ? 'Besluit opslaan...'
                                : lastSavedAt
                                    ? `Besluiten opgeslagen om ${new Date(lastSavedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}.`
                                    : 'Een keuze wordt per beslispunt opgeslagen.')}
            </div>

            <MissionQualityKpis summary={summary} />

            {quality.sourceWarnings.length > 0 && (
                <section
                    aria-label="Bronwaarschuwingen"
                    className="rounded-3xl border border-duck-error/25 bg-duck-error/10 p-5"
                >
                    <h3 className="flex items-center gap-2 font-black text-duck-error">
                        <AlertTriangle size={19} aria-hidden="true" />
                        Bronverschillen — niet stil gecorrigeerd
                    </h3>
                    <ul className="mt-3 space-y-2">
                        {quality.sourceWarnings.map(warning => (
                            <li key={warning} className="flex items-start gap-2 text-sm leading-relaxed text-duck-ink/75">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-duck-error" />
                                <span>{warning}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <MissionQualityFilters
                filters={filters}
                resultCount={visibleMissions.length}
                totalCount={quality.missions.length}
                onChange={setFilters}
            />

            <section className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.6fr)]">
                <MissionQualityList
                    missions={visibleMissions}
                    selectedMissionId={activeMissionId}
                    onSelect={setSelectedMissionId}
                />
                {selectedMission ? (
                    <MissionQualityDetail
                        mission={selectedMission}
                        decisions={decisions}
                        decisionControlsDisabled={!canEditDecisions}
                        onDecisionChange={updateDecision}
                    />
                ) : (
                    <div className="rounded-3xl border border-dashed border-duck-ink/25 bg-white p-10 text-center">
                        <p className="font-black text-duck-ink">Geen missiedetail beschikbaar</p>
                        <p className="mt-1 text-sm text-duck-ink/60">Pas de filters aan om een missie te kiezen.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
