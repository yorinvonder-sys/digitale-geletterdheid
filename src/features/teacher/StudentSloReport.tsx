/**
 * StudentSloReport — Individueel SLO-leerlingrapport voor docenten.
 *
 * Toont per leerling:
 *  - Header met leerlinggegevens (naam, klas, leerjaar, VSO-profiel, datum)
 *  - Samenvatting: aantal afgeronde missies, SLO-dekking percentage
 *  - Per SLO-kerndoel (regulier en VSO): voortgangsbalk + voltooide/open missies
 *  - Didactische opmerking en legenda
 *
 * Ondersteunt:
 *  - Print/opslaan-als-PDF via `window.print()` (print-CSS verbergt header + buttons)
 *  - CSV-export per leerling (één rij per SLO-kerndoel)
 *
 * Data-veiligheid:
 *  - Leest uitsluitend uit de meegegeven `student`-prop (RLS geldt al op
 *    `students`-fetch niveau in parent component).
 *  - Geen netwerkcalls, geen nieuwe PII, geen localStorage.
 */
import React, { useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, FileDown, GraduationCap } from 'lucide-react';
import { StudentData } from '@/types';
import { SLO_KERNDOELEN, type SloKerndoelCode } from '@/config/sloKerndoelen';
import { calculateStudentKerndoelStats, getMissionMeta, KERNDOEL_CODES } from '@/config/slo-kerndoelen-mapping';
import { downloadCsv } from '@/utils/csvExport';

export interface StudentSloReportProps {
    student: StudentData;
    /** Beperk de rapportage tot één leerjaar. Als `undefined` worden alle leerjaren meegenomen. */
    yearGroup?: number;
    onClose: () => void;
}

function sanitizeFilenameFragment(input: string): string {
    return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 64) || 'leerling';
}

export const StudentSloReport: React.FC<StudentSloReportProps> = ({ student, yearGroup, onClose }) => {
    const stats = useMemo(() => calculateStudentKerndoelStats(student, yearGroup), [student, yearGroup]);

    const displayName = student.displayName || 'Onbekend';
    const identifier = student.identifier || '—';
    const studentClass = student.studentClass || student.stats?.studentClass || '—';
    const vsoProfile = student.stats?.vsoProfile || null;
    const isVsoStudent = !!vsoProfile;

    // Codes die voor deze leerling relevant zijn (minimaal 1 toepasbare missie).
    const applicableCodes = useMemo(
        () => KERNDOEL_CODES.filter((code) => {
            const isVsoCode = SLO_KERNDOELEN[code].isVso;
            // VSO-leerling ziet alleen VSO-codes; regulier ziet alleen niet-VSO-codes.
            if (isVsoStudent && !isVsoCode) return false;
            if (!isVsoStudent && isVsoCode) return false;
            return stats[code] && stats[code].total > 0;
        }),
        [stats, isVsoStudent],
    );

    const totalMissions = student.stats?.missionsCompleted?.length || 0;

    const coverage = useMemo(() => {
        if (applicableCodes.length === 0) return { average: 0, fullyCovered: 0 };
        let sum = 0;
        let full = 0;
        for (const code of applicableCodes) {
            const s = stats[code];
            sum += s.percentage;
            if (s.total > 0 && s.completed === s.total) full += 1;
        }
        return {
            average: Math.round(sum / applicableCodes.length),
            fullyCovered: full,
        };
    }, [applicableCodes, stats]);

    const generatedAt = useMemo(
        () => new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' }),
        [],
    );

    const handlePrint = useCallback(() => {
        if (typeof window !== 'undefined') window.print();
    }, []);

    const handleExportCsv = useCallback(() => {
        const headers = [
            'Leerling',
            'Leerlingnummer',
            'Klas',
            'Leerjaar',
            'VSO profiel',
            'Kerndoel code',
            'Kerndoel label',
            'Domein',
            'Voltooid',
            'Totaal',
            'Percentage',
            'Voltooide missies',
            'Nog open missies',
        ];

        const yearLabel = yearGroup != null ? String(yearGroup) : 'Alle leerjaren';
        const rows = applicableCodes.map((code) => {
            const s = stats[code];
            const kd = SLO_KERNDOELEN[code];
            const openMissions = s.totalMissions.filter((m) => !s.completedMissions.includes(m));
            const completedLabels = s.completedMissions
                .map((id) => getMissionMeta(id)?.title || id)
                .join('; ');
            const openLabels = openMissions
                .map((id) => getMissionMeta(id)?.title || id)
                .join('; ');

            return [
                displayName,
                identifier,
                studentClass,
                yearLabel,
                vsoProfile || 'Regulier',
                code,
                kd.label,
                kd.domein,
                s.completed,
                s.total,
                s.percentage,
                completedLabels,
                openLabels,
            ];
        });

        const date = new Date().toISOString().slice(0, 10);
        const nameFragment = sanitizeFilenameFragment(displayName);
        downloadCsv(`SLO_leerlingrapport_${nameFragment}_${date}.csv`, [headers, ...rows]);
    }, [applicableCodes, stats, displayName, identifier, studentClass, vsoProfile, yearGroup]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="print-section fixed inset-0 z-[90] bg-lab-ink/60 backdrop-blur-sm flex items-start justify-center p-0 md:p-6 overflow-y-auto print:static print:inset-auto print:bg-white print:backdrop-blur-none print:p-0 print:overflow-visible"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-slo-report-title"
        >
            <div className="relative bg-white w-full max-w-4xl rounded-none md:rounded-2xl shadow-2xl my-0 md:my-4 print:shadow-none print:max-w-none print:rounded-none print:my-0">
                {/* Toolbar — hidden in print */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 md:p-5 bg-white border-b border-lab-line rounded-t-2xl print:hidden">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-lab-coral text-white flex items-center justify-center flex-shrink-0">
                            <GraduationCap size={20} />
                        </div>
                        <div className="min-w-0">
                            <h2 id="student-slo-report-title" className="text-sm md:text-base font-bold text-lab-ink truncate">
                                SLO-leerlingrapport — {displayName}
                            </h2>
                            <p className="text-xs text-lab-muted truncate">
                                Klas {studentClass}
                                {yearGroup != null && ` · Leerjaar ${yearGroup}`}
                                {vsoProfile && ` · VSO (${vsoProfile})`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-lab-line text-lab-muted hover:border-lab-coral hover:text-lab-coral rounded-lg text-xs font-semibold transition-colors"
                            aria-label="Exporteer als CSV"
                        >
                            <FileDown size={14} />
                            <span className="hidden sm:inline">CSV</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-lab-coral text-white hover:bg-lab-coral hover:text-white rounded-lg text-xs font-semibold transition-colors"
                            aria-label="Print of opslaan als PDF"
                        >
                            <Printer size={14} />
                            <span className="hidden sm:inline">Print / PDF</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-lab-muted hover:text-lab-muted transition-colors rounded-lg hover:bg-lab-cream"
                            aria-label="Sluit rapport"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Printbaar rapport */}
                <article className="p-6 md:p-10 print:p-8 text-lab-ink">
                    {/* School-achtige briefkop */}
                    <header className="border-b-2 border-lab-line pb-4 mb-8 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black tracking-widest uppercase text-lab-coral">DGSkills — SLO-leerlingrapport</p>
                            <h1 className="text-2xl md:text-3xl font-bold mt-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                {displayName}
                            </h1>
                        </div>
                        <div className="text-right text-xs text-lab-muted">
                            <p>Gegenereerd op {generatedAt}</p>
                            <p className="mt-0.5">
                                SLO Definitieve Conceptkerndoelen (sept. 2025)
                                {isVsoStudent && ' + Functionele Kerndoelen VSO (nov. 2025)'}
                            </p>
                        </div>
                    </header>

                    {/* Leerling-metadata */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <MetaBlock label="Leerlingnummer" value={identifier} />
                        <MetaBlock label="Klas" value={studentClass} />
                        <MetaBlock label="Leerjaar" value={yearGroup != null ? String(yearGroup) : 'Alle leerjaren'} />
                        <MetaBlock label="Profiel" value={vsoProfile ? `VSO · ${vsoProfile}` : 'Regulier'} />
                    </section>

                    {/* Samenvattingsstats */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                        <StatBlock label="Afgeronde missies" value={totalMissions} />
                        <StatBlock label="Toepasbare kerndoelen" value={applicableCodes.length} />
                        <StatBlock label="Volledig gedekt" value={`${coverage.fullyCovered} / ${applicableCodes.length}`} />
                        <StatBlock label="Gem. dekking" value={`${coverage.average}%`} tone={coverage.average >= 75 ? 'success' : coverage.average >= 50 ? 'warn' : 'neutral'} />
                    </section>

                    {/* Detail per kerndoel */}
                    {applicableCodes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-lab-line bg-lab-cream p-8 text-center">
                            <p className="text-sm text-lab-muted">Nog geen voltooide missies om te rapporteren.</p>
                            <p className="text-xs text-lab-muted mt-2">Zodra de leerling de eerste missie afrondt, verschijnt hier automatisch een SLO-dekkingsoverzicht.</p>
                        </div>
                    ) : (
                        <section>
                            <h2 className="text-xs font-black tracking-widest uppercase text-lab-muted mb-4">
                                Dekking per SLO-kerndoel
                            </h2>
                            <ul className="list-none p-0 m-0 space-y-6">
                                {applicableCodes.map((code) => (
                                    <KerndoelRow
                                        key={code}
                                        code={code}
                                        completed={stats[code].completed}
                                        total={stats[code].total}
                                        percentage={stats[code].percentage}
                                        completedMissions={stats[code].completedMissions}
                                        totalMissions={stats[code].totalMissions}
                                    />
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Legenda + didactische noot */}
                    <footer className="mt-10 pt-6 border-t border-lab-line text-xs text-lab-muted space-y-3">
                        <div>
                            <p className="font-bold text-lab-muted mb-1">Over dit rapport</p>
                            <p className="leading-relaxed">
                                Dit rapport toont de dekking van SLO-kerndoelen voor Digitale Geletterdheid op basis van de door de leerling voltooide DGSkills-missies.
                                De percentages zijn afgeleid van missie-afronding en dekking, niet van beoordelingscijfers.
                                Het rapport is een docent-hulpmiddel en geen formele beoordeling.
                            </p>
                        </div>
                        <p className="text-[10px] text-lab-muted">
                            DGSkills.app · © {new Date().getFullYear()} · Dit rapport is alleen bedoeld voor intern schoolgebruik.
                        </p>
                    </footer>
                </article>
            </div>
        </div>,
        document.body,
    );
};

// ============================================================================
// Sub-components
// ============================================================================

const MetaBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-lab-muted mb-1">{label}</p>
        <p className="text-sm font-semibold text-lab-ink">{value}</p>
    </div>
);

type StatTone = 'neutral' | 'success' | 'warn';

const StatBlock: React.FC<{ label: string; value: React.ReactNode; tone?: StatTone }> = ({ label, value, tone = 'neutral' }) => {
    const toneClass =
        tone === 'success' ? 'text-lab-sage'
            : tone === 'warn' ? 'text-lab-gold'
                : 'text-lab-ink';
    return (
        <div className="rounded-xl bg-lab-cream border border-lab-line px-4 py-3 print:border-lab-line">
            <p className="text-[10px] font-bold uppercase tracking-wider text-lab-muted mb-1">{label}</p>
            <p className={`text-xl font-bold ${toneClass}`}>{value}</p>
        </div>
    );
};

interface KerndoelRowProps {
    code: SloKerndoelCode;
    completed: number;
    total: number;
    percentage: number;
    completedMissions: string[];
    totalMissions: string[];
}

const KerndoelRow: React.FC<KerndoelRowProps> = ({ code, completed, total, percentage, completedMissions, totalMissions }) => {
    const kd = SLO_KERNDOELEN[code];
    const openMissions = totalMissions.filter((m) => !completedMissions.includes(m));

    const barClass = kd.kleur === 'blue'
        ? 'bg-lab-coral'
        : kd.kleur === 'purple'
            ? 'bg-lab-coral'
            : 'bg-lab-coral';

    const badgeClass = kd.kleur === 'blue'
        ? 'bg-lab-teal text-white border-lab-teal'
        : kd.kleur === 'purple'
            ? 'bg-lab-teal text-white border-lab-teal'
            : 'bg-lab-gold text-lab-ink border-lab-gold';

    const statusLabel = percentage === 100 ? 'Volledig gedekt'
        : percentage >= 75 ? 'Grotendeels gedekt'
            : percentage >= 50 ? 'Deels gedekt'
                : percentage >= 25 ? 'Beginnend'
                    : 'Nog open';

    return (
        <li className="border border-lab-line rounded-xl p-5 print:border-lab-line print:break-inside-avoid">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-block px-2 py-0.5 border rounded text-[11px] font-bold ${badgeClass}`}>{code}</span>
                        <h3 className="text-base font-bold text-lab-ink">{kd.label}</h3>
                        {kd.isVso && (
                            <span className="text-[10px] font-bold text-white bg-lab-sage border border-lab-sage px-1.5 py-0.5 rounded uppercase tracking-wider">VSO</span>
                        )}
                    </div>
                    <p className="text-xs text-lab-muted max-w-xl">{kd.omschrijving}</p>
                    <p className="text-[11px] text-lab-muted mt-1">Domein: {kd.domein}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-lab-ink">{percentage}%</p>
                    <p className="text-[11px] text-lab-muted">{completed} van {total} missies</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-lab-muted mt-1">{statusLabel}</p>
                </div>
            </div>

            {/* Voortgangsbalk */}
            <div className="h-2 bg-lab-cream rounded-full overflow-hidden mb-4 print:border print:border-lab-line" aria-hidden="true">
                <div className={`h-full ${barClass} transition-all`} style={{ width: `${percentage}%` }} />
            </div>

            {/* Missie-lijsten */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                    <p className="font-bold text-lab-sage mb-1.5 text-[11px] uppercase tracking-wider">
                        Afgeronde missies ({completedMissions.length})
                    </p>
                    {completedMissions.length === 0 ? (
                        <p className="text-lab-muted italic">Nog geen.</p>
                    ) : (
                        <ul className="list-disc list-inside space-y-1 text-lab-muted">
                            {completedMissions.map((id) => (
                                <li key={id}>{getMissionMeta(id)?.title || id}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <p className="font-bold text-lab-muted mb-1.5 text-[11px] uppercase tracking-wider">
                        Nog open missies ({openMissions.length})
                    </p>
                    {openMissions.length === 0 ? (
                        <p className="text-lab-sage font-medium">Alle toepasbare missies voltooid.</p>
                    ) : (
                        <ul className="list-disc list-inside space-y-1 text-lab-muted">
                            {openMissions.map((id) => (
                                <li key={id}>{getMissionMeta(id)?.title || id}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
    );
};
