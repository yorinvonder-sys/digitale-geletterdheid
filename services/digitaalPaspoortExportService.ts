/**
 * Digitaal Paspoort Export Service — PDF export voor nulmeting resultaten
 *
 * Genereert een branded PDF van een NulmetingResult met:
 * - Niveau-badge en totaalscore
 * - Domeinscores tabel (5 domeinen met SLO-codes)
 * - Afrondingsinformatie (datum + tijd)
 */

import type { NulmetingResult } from '../components/assessment/escaperoom/types';

// ============================================================================
// Helpers
// ============================================================================

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

function getNiveauLabel(niveau: NulmetingResult['niveau']): string {
    const labels: Record<NulmetingResult['niveau'], string> = {
        starter: 'Starter',
        basis: 'Basis',
        gevorderd: 'Gevorderd',
    };
    return labels[niveau];
}

// ============================================================================
// Export
// ============================================================================

/**
 * Exporteer een Digitaal Paspoort als branded PDF.
 *
 * @param result - Het NulmetingResult van de escaperoom
 * @param studentName - Optionele naam van de leerling voor de subtitel
 */
export async function exportDigitaalPaspoortPDF(result: NulmetingResult, studentName?: string): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const {
        createBrandedPdf,
        sectionTitle,
        labelValueRow,
        drawTable,
        highlightBox,
        spacer,
        finalizePdf,
        divider,
        paragraph,
        checkPageBreak,
        BRAND,
    } = await import('./pdfBrandingService');

    const datumVoltooid = new Date(result.completedAt).toLocaleDateString('nl-NL');

    const ctx = createBrandedPdf(jsPDF, {
        title: 'Digitaal Paspoort',
        subtitle: studentName ? `Resultaten van ${studentName}` : 'DGSkills Assessment Resultaten',
        date: `Voltooid op: ${datumVoltooid}`,
    });

    // -------------------------------------------------------------------------
    // Niveau sectie
    // -------------------------------------------------------------------------
    const niveauLabel = getNiveauLabel(result.niveau);
    const totaalScore = Math.round(result.overallScore);

    highlightBox(ctx, `Niveau: ${niveauLabel}  —  Totaalscore: ${totaalScore}%`, { type: 'success' });
    spacer(ctx, 6);

    // -------------------------------------------------------------------------
    // Domeinscores
    // -------------------------------------------------------------------------
    sectionTitle(ctx, 'Domeinscores');

    const kolommen = [
        { header: 'Domein', width: 38, align: 'left' as const },
        { header: 'SLO-code', width: 20, align: 'left' as const },
        { header: 'Score', width: 14, align: 'right' as const },
        { header: 'Tijd', width: 18, align: 'right' as const },
        { header: 'Feedback', width: 10, align: 'left' as const },
    ];

    function getDomeinFeedback(score: number): string {
        if (score >= 80) return 'Sterk';
        if (score >= 50) return 'Goed';
        return 'Groei';
    }

    const rijen = [
        [
            'Digitale Systemen',
            '21A',
            `${Math.round(result.kamers.digitaleSystemen.score)}%`,
            formatTime(result.kamers.digitaleSystemen.timeSeconds),
            getDomeinFeedback(result.kamers.digitaleSystemen.score),
        ],
        [
            'Media & AI',
            '21B/21D',
            `${Math.round(result.kamers.mediaEnAI.score)}%`,
            formatTime(result.kamers.mediaEnAI.timeSeconds),
            getDomeinFeedback(result.kamers.mediaEnAI.score),
        ],
        [
            'Programmeren',
            '22A/22B',
            `${Math.round(result.kamers.programmeren.score)}%`,
            formatTime(result.kamers.programmeren.timeSeconds),
            getDomeinFeedback(result.kamers.programmeren.score),
        ],
        [
            'Veiligheid & Privacy',
            '23A',
            `${Math.round(result.kamers.veiligheidPrivacy.score)}%`,
            formatTime(result.kamers.veiligheidPrivacy.timeSeconds),
            getDomeinFeedback(result.kamers.veiligheidPrivacy.score),
        ],
        [
            'Welzijn & Maatschappij',
            '23B/23C',
            `${Math.round(result.kamers.welzijnMaatschappij.score)}%`,
            formatTime(result.kamers.welzijnMaatschappij.timeSeconds),
            getDomeinFeedback(result.kamers.welzijnMaatschappij.score),
        ],
    ];

    drawTable(ctx, kolommen, rijen);
    spacer(ctx, 4);

    // -------------------------------------------------------------------------
    // Niveau toelichting
    // -------------------------------------------------------------------------
    sectionTitle(ctx, 'Wat betekent jouw niveau?');

    const niveauToelichting: Record<NulmetingResult['niveau'], string> = {
        starter: 'Als Starter ontdek je stap voor stap de digitale wereld. Er ligt een wereld voor je open en dit jaar ga je enorm veel leren over digitale geletterdheid.',
        basis: 'Je hebt een goede Basis. Je weet al het een en ander over digitale vaardigheden en dit jaar ga je je kennis verder uitbreiden en verdiepen.',
        gevorderd: 'Gevorderd — indrukwekkend! Je hebt al een sterke digitale basis. Je bent klaar voor uitdagende opdrachten en kunt anderen ook helpen.',
    };

    paragraph(ctx, niveauToelichting[result.niveau]);
    spacer(ctx, 4);

    // -------------------------------------------------------------------------
    // Afronding
    // -------------------------------------------------------------------------
    sectionTitle(ctx, 'Afronding');

    const datumLang = new Date(result.completedAt).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    labelValueRow(ctx, 'Voltooid op', datumLang);
    labelValueRow(ctx, 'Totale tijd', formatTime(result.totalTimeSeconds));
    labelValueRow(ctx, 'Niveau', niveauLabel);
    labelValueRow(ctx, 'Totaalscore', `${totaalScore}%`, { bold: true });

    spacer(ctx, 6);
    divider(ctx);
    spacer(ctx, 2);

    paragraph(ctx, 'Dit paspoort is gegenereerd via DGSkills.app — het digitale geletterdheidsplatform voor het voortgezet onderwijs.', {
        color: BRAND.muted,
        fontSize: 8,
        italic: true,
    });

    // -------------------------------------------------------------------------
    // Opslaan
    // -------------------------------------------------------------------------
    const datum = new Date().toISOString().slice(0, 10);
    finalizePdf(ctx, `digitaal-paspoort-${datum}.pdf`);
}
