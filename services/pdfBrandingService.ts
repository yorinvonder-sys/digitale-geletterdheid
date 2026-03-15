/**
 * PDF Branding Service — DGSkills huisstijl voor alle PDF-documenten
 *
 * Gedeelde utilities voor consistente branding in jsPDF-documenten:
 * - Kleurenpalet (lab-* tokens)
 * - Branded header met logo-accent
 * - Gestileerde secties, tabellen en footers
 */

import type { jsPDF } from 'jspdf';

// ============================================================================
// Brand Colors (RGB tuples voor jsPDF)
// ============================================================================

export const BRAND = {
    primary:      [217, 119, 87]  as [number, number, number],  // #D97757
    primaryDark:  [196, 104, 73]  as [number, number, number],  // #C46849
    accent:       [42, 157, 143]  as [number, number, number],  // #2A9D8F
    secondary:    [139, 111, 158] as [number, number, number],  // #8B6F9E
    dark:         [26, 26, 25]    as [number, number, number],  // #1A1A19
    text:         [61, 61, 56]    as [number, number, number],  // #3D3D38
    textLight:    [107, 107, 102] as [number, number, number],  // #6B6B66
    muted:        [156, 156, 149] as [number, number, number],  // #9C9C95
    bg:           [250, 249, 240] as [number, number, number],  // #FAF9F0
    surface:      [255, 255, 255] as [number, number, number],  // #FFFFFF
    border:       [232, 230, 223] as [number, number, number],  // #E8E6DF
    primaryLight: [217, 119, 87, 0.08] as [number, number, number, number], // #D97757 12%
} as const;

// ============================================================================
// Branded PDF Context
// ============================================================================

export interface BrandedPdfOptions {
    title: string;
    subtitle?: string;
    author?: string;
    date?: string;
    showFooter?: boolean;
    footerText?: string;
}

export interface PdfContext {
    doc: jsPDF;
    y: number;
    pageW: number;
    pageH: number;
    marginL: number;
    marginR: number;
    contentW: number;
    rightX: number;
    pageNum: number;
}

/**
 * Initialiseer een branded PDF met header
 */
export function createBrandedPdf(
    jsPDFClass: typeof jsPDF,
    options: BrandedPdfOptions,
): PdfContext {
    const doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const ctx: PdfContext = {
        doc,
        y: 0,
        pageW: 210,
        pageH: 297,
        marginL: 20,
        marginR: 20,
        contentW: 170,
        rightX: 190,
        pageNum: 1,
    };

    drawHeader(ctx, options);
    return ctx;
}

/**
 * Teken de branded header bovenaan de eerste pagina
 */
function drawHeader(ctx: PdfContext, options: BrandedPdfOptions): void {
    const { doc, marginL, rightX, contentW } = ctx;

    // Terracotta accent balk bovenaan
    doc.setFillColor(...BRAND.primary);
    doc.rect(0, 0, 210, 4, 'F');

    // Subtiele warme achtergrond voor header-area
    doc.setFillColor(250, 249, 244);
    doc.rect(0, 4, 210, 42, 'F');

    ctx.y = 18;

    // Logo-accent: klein terracotta vierkant als brand mark
    doc.setFillColor(...BRAND.primary);
    doc.roundedRect(marginL, ctx.y - 6, 8, 8, 1.5, 1.5, 'F');

    // "DG" in het vierkantje
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DG', marginL + 4, ctx.y - 1.2, { align: 'center' });

    // Titel
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.dark);
    doc.text(options.title, marginL + 12, ctx.y);
    ctx.y += 7;

    // Subtitle
    if (options.subtitle) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...BRAND.textLight);
        doc.text(options.subtitle, marginL + 12, ctx.y);
        ctx.y += 6;
    }

    // Metadata regel: auteur + datum
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);

    const metaParts: string[] = [];
    if (options.author) metaParts.push(options.author);
    if (options.date) metaParts.push(options.date);
    if (metaParts.length > 0) {
        doc.text(metaParts.join('  |  '), marginL + 12, ctx.y);
        ctx.y += 4;
    }

    // DGSkills.app rechts
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.primary);
    doc.text('DGSkills.app', rightX, 18, { align: 'right' });

    // Scheidingslijn onder header
    ctx.y = 48;
    doc.setDrawColor(...BRAND.primary);
    doc.setLineWidth(0.5);
    doc.line(marginL, ctx.y, rightX, ctx.y);

    ctx.y += 10;
}

// ============================================================================
// Page Management
// ============================================================================

/**
 * Controleer of er genoeg ruimte is, anders nieuwe pagina
 */
export function checkPageBreak(ctx: PdfContext, needed: number): void {
    if (ctx.y + needed > ctx.pageH - 25) {
        addNewPage(ctx);
    }
}

/**
 * Voeg een nieuwe pagina toe met branded footer en header-accent
 */
export function addNewPage(ctx: PdfContext): void {
    drawPageFooter(ctx);
    ctx.doc.addPage();
    ctx.pageNum++;
    ctx.y = 14;

    // Dunne terracotta lijn bovenaan vervolgpagina's
    ctx.doc.setDrawColor(...BRAND.primary);
    ctx.doc.setLineWidth(0.3);
    ctx.doc.line(ctx.marginL, 10, ctx.rightX, 10);

    ctx.y = 18;
}

/**
 * Teken footer op huidige pagina
 */
export function drawPageFooter(ctx: PdfContext): void {
    const { doc, marginL, rightX, pageH } = ctx;
    const footerY = pageH - 12;

    doc.setDrawColor(...BRAND.border);
    doc.setLineWidth(0.3);
    doc.line(marginL, footerY - 3, rightX, footerY - 3);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text('DGSkills.app — Digitale Geletterdheid voor het VO', marginL, footerY);
    doc.text(`${ctx.pageNum}`, rightX, footerY, { align: 'right' });
}

// ============================================================================
// Content Primitives
// ============================================================================

/**
 * Sectietitel met terracotta accent
 */
export function sectionTitle(ctx: PdfContext, title: string): void {
    checkPageBreak(ctx, 16);

    const { doc, marginL } = ctx;

    // Terracotta accent blokje
    doc.setFillColor(...BRAND.primary);
    doc.roundedRect(marginL, ctx.y - 3.5, 3, 5, 0.8, 0.8, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.dark);
    doc.text(title, marginL + 6, ctx.y);
    ctx.y += 8;
}

/**
 * Subsectietitel
 */
export function subSectionTitle(ctx: PdfContext, title: string): void {
    checkPageBreak(ctx, 12);

    const { doc, marginL } = ctx;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.text);
    doc.text(title, marginL, ctx.y);
    ctx.y += 6;
}

/**
 * Paragraaf tekst met automatische wrapping
 */
export function paragraph(ctx: PdfContext, text: string, options?: { bold?: boolean; italic?: boolean; fontSize?: number; color?: [number, number, number] }): void {
    const { doc, marginL, contentW } = ctx;
    const fontSize = options?.fontSize ?? 9;
    const style = options?.bold ? 'bold' : options?.italic ? 'italic' : 'normal';

    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    doc.setTextColor(...(options?.color ?? BRAND.text));

    const lines = doc.splitTextToSize(text, contentW) as string[];
    const lineHeight = fontSize * 0.45;

    for (const line of lines) {
        checkPageBreak(ctx, lineHeight + 2);
        doc.text(line, marginL, ctx.y);
        ctx.y += lineHeight;
    }
    ctx.y += 2;
}

/**
 * Bullet point
 */
export function bulletPoint(ctx: PdfContext, text: string, options?: { indent?: number; bold?: boolean }): void {
    const { doc, marginL, contentW } = ctx;
    const indent = options?.indent ?? 4;

    checkPageBreak(ctx, 6);

    // Terracotta bullet
    doc.setFillColor(...BRAND.primary);
    doc.circle(marginL + indent - 1, ctx.y - 1, 0.8, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', options?.bold ? 'bold' : 'normal');
    doc.setTextColor(...BRAND.text);

    const availableW = contentW - indent - 2;
    const lines = doc.splitTextToSize(text, availableW) as string[];

    for (let i = 0; i < lines.length; i++) {
        if (i > 0) checkPageBreak(ctx, 4.5);
        doc.text(lines[i], marginL + indent + 1, ctx.y);
        ctx.y += 4.2;
    }
    ctx.y += 1;
}

/**
 * Label-value rij (voor financiële overzichten)
 */
export function labelValueRow(ctx: PdfContext, label: string, value: string, options?: { bold?: boolean; color?: [number, number, number] }): void {
    checkPageBreak(ctx, 8);

    const { doc, marginL, rightX } = ctx;
    const isBold = options?.bold ?? false;

    doc.setFontSize(9);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(...(options?.color ?? (isBold ? BRAND.dark : BRAND.text)));
    doc.text(label, marginL + 4, ctx.y);
    doc.text(value, rightX, ctx.y, { align: 'right' });
    ctx.y += 6;
}

/**
 * Horizontale scheidingslijn
 */
export function divider(ctx: PdfContext, options?: { color?: [number, number, number]; thick?: boolean }): void {
    const { doc, marginL, rightX } = ctx;
    doc.setDrawColor(...(options?.color ?? BRAND.border));
    doc.setLineWidth(options?.thick ? 0.5 : 0.2);
    doc.line(marginL, ctx.y, rightX, ctx.y);
    ctx.y += 4;
}

/**
 * Verticale ruimte
 */
export function spacer(ctx: PdfContext, mm: number = 4): void {
    ctx.y += mm;
}

// ============================================================================
// Table
// ============================================================================

export interface TableColumn {
    header: string;
    width: number; // als percentage van contentW
    align?: 'left' | 'right' | 'center';
}

export function drawTable(ctx: PdfContext, columns: TableColumn[], rows: string[][]): void {
    const { doc, marginL, contentW } = ctx;

    // Bereken kolom-posities
    const colPositions: number[] = [];
    const colWidths: number[] = [];
    let xPos = marginL;
    for (const col of columns) {
        colPositions.push(xPos);
        const w = (col.width / 100) * contentW;
        colWidths.push(w);
        xPos += w;
    }

    checkPageBreak(ctx, 14);

    // Header achtergrond
    doc.setFillColor(250, 248, 242);
    doc.rect(marginL, ctx.y - 4, contentW, 7, 'F');

    // Header tekst
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.textLight);

    columns.forEach((col, i) => {
        const align = col.align ?? 'left';
        const x = align === 'right' ? colPositions[i] + colWidths[i] : colPositions[i] + 1;
        doc.text(col.header, x, ctx.y, { align: align === 'right' ? 'right' : undefined });
    });
    ctx.y += 5;

    // Header lijn
    doc.setDrawColor(...BRAND.primary);
    doc.setLineWidth(0.3);
    doc.line(marginL, ctx.y, marginL + contentW, ctx.y);
    ctx.y += 4;

    // Rijen
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    for (let r = 0; r < rows.length; r++) {
        checkPageBreak(ctx, 8);

        // Alternerende achtergrond
        if (r % 2 === 0) {
            doc.setFillColor(253, 252, 248);
            doc.rect(marginL, ctx.y - 3.5, contentW, 6, 'F');
        }

        doc.setTextColor(...BRAND.text);
        rows[r].forEach((cell, i) => {
            const align = columns[i]?.align ?? 'left';
            const x = align === 'right' ? colPositions[i] + colWidths[i] : colPositions[i] + 1;

            // Truncate als tekst te lang is
            const maxW = colWidths[i] - 2;
            const truncated = doc.splitTextToSize(cell, maxW)[0] as string;
            doc.text(truncated, x, ctx.y, { align: align === 'right' ? 'right' : undefined });
        });
        ctx.y += 5.5;
    }

    ctx.y += 3;
}

// ============================================================================
// Highlight Box
// ============================================================================

/**
 * Gekleurde box voor belangrijke informatie
 */
export function highlightBox(ctx: PdfContext, text: string, options?: { type?: 'info' | 'success' | 'warning' }): void {
    const { doc, marginL, contentW } = ctx;
    const type = options?.type ?? 'info';

    const colors = {
        info: { bg: [245, 243, 255] as [number, number, number], border: BRAND.secondary, text: [100, 80, 120] as [number, number, number] },
        success: { bg: [240, 253, 250] as [number, number, number], border: BRAND.accent, text: [30, 120, 110] as [number, number, number] },
        warning: { bg: [255, 248, 240] as [number, number, number], border: BRAND.primary, text: [180, 90, 60] as [number, number, number] },
    };

    const c = colors[type];
    const lines = doc.splitTextToSize(text, contentW - 10) as string[];
    const boxH = lines.length * 4.5 + 6;

    checkPageBreak(ctx, boxH + 4);

    // Box achtergrond
    doc.setFillColor(...c.bg);
    doc.roundedRect(marginL, ctx.y - 3, contentW, boxH, 2, 2, 'F');

    // Accent lijn links
    doc.setFillColor(...c.border);
    doc.roundedRect(marginL, ctx.y - 3, 2.5, boxH, 1, 1, 'F');

    // Tekst
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...c.text);

    for (const line of lines) {
        doc.text(line, marginL + 6, ctx.y);
        ctx.y += 4.5;
    }
    ctx.y += 4;
}

// ============================================================================
// Finalize
// ============================================================================

/**
 * Finaliseer het document: teken footer op laatste pagina en sla op
 */
export function finalizePdf(ctx: PdfContext, filename: string): void {
    drawPageFooter(ctx);
    ctx.doc.save(filename);
}
