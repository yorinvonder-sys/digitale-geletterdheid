/**
 * Impact Report PDF Service — DGSkills Pilotrapport Generator
 *
 * Genereert een branded PDF impactrapport op basis van pilotdata.
 * Hergebruikt pdfBrandingService.ts voor consistente huisstijl.
 */

import {
    BRAND,
    createBrandedPdf,
    sectionTitle,
    subSectionTitle,
    paragraph,
    bulletPoint,
    spacer,
    drawTable,
    highlightBox,
    finalizePdf,
    labelValueRow,
    divider,
    type TableColumn,
} from './pdfBrandingService';

// ============================================================================
// Types
// ============================================================================

export interface ImpactReportData {
    schoolName: string;
    period: string;
    totalStudents: number;
    totalTeachers: number;
    yearGroup: number;

    // KPIs
    teacherActivation: number;
    weeklyActiveStudents: number;
    taskCompletionRate: number;
    teacherSatisfaction?: number;
    studentSatisfaction?: number;

    // SLO Coverage
    sloProgress: Array<{
        code: string;
        label: string;
        percentage: number;
    }>;

    // Top missions
    topMissions: Array<{
        name: string;
        completionCount: number;
        totalStudents: number;
    }>;

    // Optional growth data
    baselineMeasurement?: number;
    currentMeasurement?: number;
}

// ============================================================================
// KPI Thresholds (from pilot playbook)
// ============================================================================

const KPI_TARGETS = {
    teacherActivation: 70,
    weeklyActiveStudents: 60,
    taskCompletionRate: 55,
    teacherSatisfaction: 7.5,
    studentSatisfaction: 7.0,
} as const;

function kpiStatus(value: number, target: number): string {
    return value >= target ? '✓' : '✗';
}

function countKpisMet(data: ImpactReportData): number {
    let met = 0;
    if (data.teacherActivation >= KPI_TARGETS.teacherActivation) met++;
    if (data.weeklyActiveStudents >= KPI_TARGETS.weeklyActiveStudents) met++;
    if (data.taskCompletionRate >= KPI_TARGETS.taskCompletionRate) met++;
    if (data.teacherSatisfaction != null && data.teacherSatisfaction >= KPI_TARGETS.teacherSatisfaction) met++;
    if (data.studentSatisfaction != null && data.studentSatisfaction >= KPI_TARGETS.studentSatisfaction) met++;
    return met;
}

function totalKpis(data: ImpactReportData): number {
    let total = 3;
    if (data.teacherSatisfaction != null) total++;
    if (data.studentSatisfaction != null) total++;
    return total;
}

// ============================================================================
// Main Export
// ============================================================================

export async function generateImpactReport(data: ImpactReportData): Promise<void> {
    const { jsPDF } = await import('jspdf');

    const ctx = createBrandedPdf(jsPDF, {
        title: 'Impactrapport',
        subtitle: `${data.schoolName} — ${data.period}`,
        author: 'DGSkills.app',
        date: new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' }),
    });

    // ── Section 1: Samenvatting ──────────────────────────────────────────

    sectionTitle(ctx, 'Samenvatting');

    highlightBox(ctx, `${data.schoolName} — Pilotperiode: ${data.period}`, { type: 'info' });
    spacer(ctx, 4);

    labelValueRow(ctx, 'Aantal leerlingen', String(data.totalStudents));
    labelValueRow(ctx, 'Aantal docenten', String(data.totalTeachers));
    labelValueRow(ctx, 'Leerjaar', String(data.yearGroup));

    spacer(ctx, 6);
    divider(ctx);
    spacer(ctx, 4);

    // ── Section 2: KPI Resultaten ────────────────────────────────────────

    sectionTitle(ctx, 'Kernprestatie-indicatoren');

    const kpiColumns: TableColumn[] = [
        { header: 'KPI', width: 40 },
        { header: 'Resultaat', width: 20, align: 'right' },
        { header: 'Streefwaarde', width: 20, align: 'right' },
        { header: 'Status', width: 20, align: 'center' },
    ];

    const kpiRows: string[][] = [
        [
            'Docentactivatie',
            `${data.teacherActivation}%`,
            `≥${KPI_TARGETS.teacherActivation}%`,
            kpiStatus(data.teacherActivation, KPI_TARGETS.teacherActivation),
        ],
        [
            'Actieve leerlingen/week',
            `${data.weeklyActiveStudents}%`,
            `≥${KPI_TARGETS.weeklyActiveStudents}%`,
            kpiStatus(data.weeklyActiveStudents, KPI_TARGETS.weeklyActiveStudents),
        ],
        [
            'Opdrachtafmaakratio',
            `${data.taskCompletionRate}%`,
            `≥${KPI_TARGETS.taskCompletionRate}%`,
            kpiStatus(data.taskCompletionRate, KPI_TARGETS.taskCompletionRate),
        ],
    ];

    if (data.teacherSatisfaction != null) {
        kpiRows.push([
            'Docenttevredenheid',
            `${data.teacherSatisfaction}/10`,
            `≥${KPI_TARGETS.teacherSatisfaction}`,
            kpiStatus(data.teacherSatisfaction, KPI_TARGETS.teacherSatisfaction),
        ]);
    }

    if (data.studentSatisfaction != null) {
        kpiRows.push([
            'Leerlingtevredenheid',
            `${data.studentSatisfaction}/10`,
            `≥${KPI_TARGETS.studentSatisfaction}`,
            kpiStatus(data.studentSatisfaction, KPI_TARGETS.studentSatisfaction),
        ]);
    }

    drawTable(ctx, kpiColumns, kpiRows);

    const met = countKpisMet(data);
    const total = totalKpis(data);
    const kpiType = met >= 3 ? 'success' : met >= 2 ? 'warning' : 'info';
    highlightBox(ctx, `${met} van ${total} KPI's voldoen aan de streefwaarde.`, { type: kpiType });

    spacer(ctx, 6);
    divider(ctx);
    spacer(ctx, 4);

    // ── Section 3: SLO-Kerndoeldekking ──────────────────────────────────

    sectionTitle(ctx, 'SLO-Kerndoeldekking');

    if (data.sloProgress.length > 0) {
        const sloColumns: TableColumn[] = [
            { header: 'Code', width: 15 },
            { header: 'Kerndoel', width: 55 },
            { header: 'Dekking', width: 30, align: 'right' },
        ];

        const sloRows = data.sloProgress.map(s => [s.code, s.label, `${s.percentage}%`]);
        drawTable(ctx, sloColumns, sloRows);

        const avgCoverage = Math.round(data.sloProgress.reduce((sum, s) => sum + s.percentage, 0) / data.sloProgress.length);
        paragraph(ctx, `Gemiddelde kerndoeldekking: ${avgCoverage}%. Dit percentage geeft aan welk deel van de kerndoelen aantoonbaar is behandeld in de pilotperiode.`);
    } else {
        paragraph(ctx, 'Geen SLO-voortgangsdata beschikbaar voor deze pilotperiode.');
    }

    spacer(ctx, 6);
    divider(ctx);
    spacer(ctx, 4);

    // ── Section 4: Populairste Missies ──────────────────────────────────

    sectionTitle(ctx, 'Populairste Missies');

    if (data.topMissions.length > 0) {
        const missionColumns: TableColumn[] = [
            { header: 'Missie', width: 50 },
            { header: 'Voltooid', width: 25, align: 'right' },
            { header: 'Percentage', width: 25, align: 'right' },
        ];

        const missionRows = data.topMissions.slice(0, 5).map(m => [
            m.name,
            `${m.completionCount}`,
            `${m.totalStudents > 0 ? Math.round((m.completionCount / m.totalStudents) * 100) : 0}%`,
        ]);

        drawTable(ctx, missionColumns, missionRows);
    } else {
        paragraph(ctx, 'Geen missiedata beschikbaar voor deze pilotperiode.');
    }

    spacer(ctx, 6);
    divider(ctx);
    spacer(ctx, 4);

    // ── Section 5: Groei (optioneel) ────────────────────────────────────

    if (data.baselineMeasurement != null && data.currentMeasurement != null) {
        sectionTitle(ctx, 'Groei: Nulmeting vs. Huidige Stand');

        const delta = data.currentMeasurement - data.baselineMeasurement;
        labelValueRow(ctx, 'Nulmeting', `${data.baselineMeasurement}%`);
        labelValueRow(ctx, 'Huidige stand', `${data.currentMeasurement}%`);
        labelValueRow(ctx, 'Groei', `${delta >= 0 ? '+' : ''}${delta} procentpunt`, {
            bold: true,
            color: delta >= 0 ? BRAND.accent : BRAND.primary,
        });

        spacer(ctx, 4);

        const growthType = delta >= 10 ? 'success' : delta >= 0 ? 'info' : 'warning';
        highlightBox(ctx, `De gemiddelde score is gestegen met ${delta} procentpunt ten opzichte van de nulmeting.`, { type: growthType });

        spacer(ctx, 6);
        divider(ctx);
        spacer(ctx, 4);
    }

    // ── Section 6: Aanbeveling ──────────────────────────────────────────

    sectionTitle(ctx, 'Aanbeveling');

    if (met >= 3) {
        highlightBox(ctx, 'Positief advies — doorzetten naar jaarlicentie. De pilot laat zien dat het platform effectief wordt ingezet en aan de gestelde doelen voldoet.', { type: 'success' });
    } else if (met >= 2) {
        highlightBox(ctx, 'Voorwaardelijk advies — optimalisaties aanbevolen. De pilot toont potentie, maar niet alle KPI\'s worden gehaald. Gerichte interventies kunnen de resultaten verbeteren.', { type: 'warning' });
    } else {
        highlightBox(ctx, 'Aanvullende pilot aanbevolen. De resultaten blijven achter bij de streefwaarden. Een verlengde of aangepaste pilot kan uitwijzen of het platform past bij deze school.', { type: 'info' });
    }

    spacer(ctx, 4);
    subSectionTitle(ctx, 'Aandachtspunten');

    if (data.teacherActivation < KPI_TARGETS.teacherActivation) {
        bulletPoint(ctx, `Docentactivatie (${data.teacherActivation}%) ligt onder de streefwaarde. Overweeg extra docententraining of een wekelijks vast moment in het rooster.`);
    }
    if (data.weeklyActiveStudents < KPI_TARGETS.weeklyActiveStudents) {
        bulletPoint(ctx, `Wekelijks actieve leerlingen (${data.weeklyActiveStudents}%) ligt onder de streefwaarde. Controleer of alle klassen actief zijn toegewezen en of de missies aansluiten bij het niveau.`);
    }
    if (data.taskCompletionRate < KPI_TARGETS.taskCompletionRate) {
        bulletPoint(ctx, `Opdrachtafmaakratio (${data.taskCompletionRate}%) ligt onder de streefwaarde. Mogelijk zijn opdrachten te lang of te moeilijk voor de doelgroep.`);
    }
    if (data.teacherSatisfaction != null && data.teacherSatisfaction < KPI_TARGETS.teacherSatisfaction) {
        bulletPoint(ctx, `Docenttevredenheid (${data.teacherSatisfaction}/10) ligt onder de streefwaarde. Verzamel kwalitatieve feedback om te begrijpen waar verbeteringen nodig zijn.`);
    }
    if (data.studentSatisfaction != null && data.studentSatisfaction < KPI_TARGETS.studentSatisfaction) {
        bulletPoint(ctx, `Leerlingtevredenheid (${data.studentSatisfaction}/10) ligt onder de streefwaarde. Evalueer of de moeilijkheidsgraad en het tempo aansluiten bij de doelgroep.`);
    }

    if (met >= totalKpis(data)) {
        bulletPoint(ctx, 'Alle KPI\'s voldoen aan de streefwaarde. Het platform kan worden uitgerold naar meer klassen of leerjaren.');
    }

    // Finalize
    const safeSchoolName = data.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    finalizePdf(ctx, `dgskills-impactrapport-${safeSchoolName}.pdf`);
}
