import {
    AlertCircle,
    Check,
    Clock3,
    ExternalLink,
    FileSearch,
    MessageSquareWarning,
    MonitorX,
    RotateCcw,
    Wrench,
} from 'lucide-react';

import { AnnotatedEvidence } from './AnnotatedEvidence';
import {
    getDecisionKey,
    getEvidenceLabel,
    getMissionDecisionProgress,
    type DecisionStatus,
    type MissionQualityDecisionMap,
    type MissionQualityRecord,
} from './missionQualityModel';

interface MissionQualityDetailProps {
    mission: MissionQualityRecord;
    decisions: MissionQualityDecisionMap;
    decisionControlsDisabled?: boolean;
    onDecisionChange: (
        decisionKey: string,
        status: DecisionStatus | null,
    ) => void;
}

const SCORE_LABELS = [
    { key: 'uiux', label: 'UI/UX' },
    { key: 'didactiek', label: 'Didactiek' },
    { key: 'tech', label: 'Tech' },
] as const;

const STATUS_COPY = {
    blocked: 'Geblokkeerd',
    fixed: 'Fixed',
    missing: 'Audit ontbreekt',
} as const;

export function MissionQualityDetail({
    mission,
    decisions,
    decisionControlsDisabled = false,
    onDecisionChange,
}: MissionQualityDetailProps) {
    const decisionProgress = getMissionDecisionProgress(mission.audit, decisions);
    const evidence = mission.evidence[0];

    return (
        <article
            data-qa="mission-quality-detail"
            className="min-w-0 space-y-5 rounded-3xl border border-duck-ink/15 bg-white p-5 shadow-sm md:p-7"
        >
            <header className="flex flex-col gap-4 border-b border-duck-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                            mission.auditStatus === 'blocked'
                                ? 'bg-duck-error/10 text-duck-error'
                                : mission.auditStatus === 'fixed'
                                    ? 'bg-duck-acid/35 text-duck-ink'
                                    : 'bg-duck-ink/10 text-duck-ink'
                        }`}>
                            {STATUS_COPY[mission.auditStatus]}
                        </span>
                        <span className="rounded-full bg-duck-bg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-duck-ink/65">
                            {mission.priorityBand === 'unknown' ? 'Prioriteit onbekend' : `${mission.priorityBand} prioriteit`}
                        </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black tracking-tight text-duck-ink">
                        {mission.title}
                    </h3>
                    <p className="mt-1 break-all text-xs font-bold text-duck-ink/55">
                        {mission.id} · Leerjaar {mission.yearGroup}, periode {mission.period}
                    </p>
                </div>

                <div className="rounded-2xl border border-duck-ink/15 bg-duck-bg px-4 py-3 text-sm">
                    <p className="font-black text-duck-ink">{getEvidenceLabel(mission)}</p>
                    <p className="mt-0.5 text-xs font-bold text-duck-ink/55">
                        {mission.audit?.lastReviewed
                            ? `Laatste review ${new Date(mission.audit.lastReviewed).toLocaleDateString('nl-NL')}`
                            : 'Geen reviewdatum'}
                    </p>
                </div>
            </header>

            {mission.audit ? (
                <>
                    <section aria-labelledby={`scores-${mission.id}`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h4 id={`scores-${mission.id}`} className="font-black text-duck-ink">
                                Kwaliteitsscores uit statische audit
                            </h4>
                            <span className="text-xs font-bold text-duck-ink/55">
                                Geen browsermeting
                            </span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                            {SCORE_LABELS.map(score => {
                                const value = mission.audit?.reviewScores?.[score.key];
                                return (
                                    <div key={score.key} className="rounded-2xl border border-duck-ink/10 bg-duck-bg p-3 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-duck-ink/50">
                                            {score.label}
                                        </p>
                                        <p className="mt-1 text-2xl font-black text-duck-ink">
                                            {typeof value === 'number' ? value : '—'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {mission.audit.topIssues && mission.audit.topIssues.length > 0 && (
                        <section className="rounded-2xl border border-duck-ink/15 bg-duck-bg p-4">
                            <h4 className="flex items-center gap-2 font-black text-duck-ink">
                                <AlertCircle size={18} aria-hidden="true" />
                                Kernbevindingen
                            </h4>
                            <ul className="mt-3 space-y-2">
                                {mission.audit.topIssues.map(issue => (
                                    <li key={issue} className="flex items-start gap-2 text-sm leading-relaxed text-duck-ink/75">
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-duck-error" />
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section aria-labelledby={`decisions-${mission.id}`}>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-duck-ink/50">
                                    Menselijke gate
                                </p>
                                <h4 id={`decisions-${mission.id}`} className="mt-1 text-lg font-black text-duck-ink">
                                    Beslispunten
                                </h4>
                            </div>
                            <span className="rounded-full bg-duck-ink px-3 py-1.5 text-xs font-black text-white">
                                {decisionProgress.reviewed}/{decisionProgress.total} beoordeeld
                            </span>
                        </div>

                        {mission.audit.openEscalations.length > 0 ? (
                            <ol className="mt-4 space-y-4">
                                {mission.audit.openEscalations.map((escalation, index) => {
                                    const decisionKey = getDecisionKey(mission.id, index);
                                    const decision = decisions[decisionKey];
                                    return (
                                        <li
                                            key={decisionKey}
                                            className="rounded-2xl border border-duck-ink/15 bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-duck-ink text-xs font-black text-white">
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold leading-relaxed text-duck-ink">
                                                        {escalation}
                                                    </p>
                                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-duck-ink/55">
                                                        <Wrench size={13} aria-hidden="true" />
                                                        Concept uit audit; nog geen codewijziging
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                <button
                                                    type="button"
                                                    data-qa={`quality-decision-${mission.id}-${index}-approve`}
                                                    aria-pressed={decision?.status === 'approved'}
                                                    onClick={() => onDecisionChange(decisionKey, 'approved')}
                                                    disabled={decisionControlsDisabled}
                                                    className={`min-h-11 rounded-xl border px-3 text-xs font-black transition-colors focus:outline-none focus:ring-2 focus:ring-duck-ink/25 ${
                                                        decision?.status === 'approved'
                                                            ? 'border-duck-ink bg-duck-acid text-duck-ink'
                                                            : 'border-duck-ink/20 bg-white text-duck-ink hover:bg-duck-acid/25'
                                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Check size={16} aria-hidden="true" />
                                                        Akkoord
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-pressed={decision?.status === 'changes_requested'}
                                                    onClick={() => onDecisionChange(decisionKey, 'changes_requested')}
                                                    disabled={decisionControlsDisabled}
                                                    className={`min-h-11 rounded-xl border px-3 text-xs font-black transition-colors focus:outline-none focus:ring-2 focus:ring-duck-ink/25 ${
                                                        decision?.status === 'changes_requested'
                                                            ? 'border-duck-error bg-duck-error text-white'
                                                            : 'border-duck-error/25 bg-white text-duck-error hover:bg-duck-error/10'
                                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <MessageSquareWarning size={16} aria-hidden="true" />
                                                        Aanpassen
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDecisionChange(decisionKey, null)}
                                                    disabled={!decision || decisionControlsDisabled}
                                                    className="min-h-11 rounded-xl border border-duck-ink/15 bg-white px-3 text-xs font-black text-duck-ink/60 transition-colors hover:bg-duck-bg disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-duck-ink/25"
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <RotateCcw size={15} aria-hidden="true" />
                                                        Open
                                                    </span>
                                                </button>
                                            </div>
                                            {decision && (
                                                <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-duck-ink/50">
                                                    <Clock3 size={12} aria-hidden="true" />
                                                    Vastgelegd {new Date(decision.decidedAt).toLocaleString('nl-NL')}
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        ) : (
                            <div className="mt-4 rounded-2xl border border-duck-ink/10 bg-duck-acid/20 p-4">
                                <p className="flex items-center gap-2 text-sm font-black text-duck-ink">
                                    <Check size={18} aria-hidden="true" />
                                    Geen open beslispunten in de auditbron
                                </p>
                            </div>
                        )}
                    </section>
                </>
            ) : (
                <section className="rounded-2xl border border-duck-error/25 bg-duck-error/10 p-5">
                    <h4 className="flex items-center gap-2 font-black text-duck-error">
                        <FileSearch size={19} aria-hidden="true" />
                        Statische audit ontbreekt
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-duck-ink/75">
                        Deze actuele curriculummissie staat niet in de levende auditbron. Er worden geen scores of conclusies ingevuld totdat een echte review is toegevoegd.
                    </p>
                </section>
            )}

            <section className="border-t border-duck-ink/10 pt-5">
                <h4 className="font-black text-duck-ink">Visueel bewijs</h4>
                {evidence ? (
                    <div className="mt-4">
                        <AnnotatedEvidence evidence={evidence} />
                    </div>
                ) : (
                    <div className="mt-3 flex items-start gap-3 rounded-2xl border border-dashed border-duck-ink/25 bg-duck-bg p-5">
                        <MonitorX size={22} aria-hidden="true" className="shrink-0 text-duck-ink/45" />
                        <div>
                            <p className="font-black text-duck-ink">Niet geverifieerd met browserbewijs</p>
                            <p className="mt-1 text-sm leading-relaxed text-duck-ink/60">
                                De statische audit bevat voor deze missie geen gekoppelde screenshot. Daarom toont dit dashboard geen visuele claim.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            <footer className="space-y-3 border-t border-duck-ink/10 pt-5 text-xs">
                {mission.audit?.reportPath && (
                    <div className="flex items-start gap-2">
                        <ExternalLink size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-duck-ink/45" />
                        <div className="min-w-0">
                            <p className="font-black uppercase tracking-wider text-duck-ink/45">Auditrapport</p>
                            <code className="mt-1 block break-all font-bold text-duck-ink">
                                {mission.audit.reportPath}
                            </code>
                        </div>
                    </div>
                )}
                {mission.audit?.statusNote && (
                    <p className="rounded-xl bg-duck-bg p-3 leading-relaxed text-duck-ink/65">
                        <strong className="text-duck-ink">Statusnotitie:</strong> {mission.audit.statusNote}
                    </p>
                )}
            </footer>
        </article>
    );
}
