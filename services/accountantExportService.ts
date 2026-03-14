/**
 * Accountant Export Service — CSV & PDF exports voor ZZP boekhouding
 *
 * Biedt functies voor:
 * - CSV export van transacties, bonnetjes, abonnementen
 * - BTW-kwartaaloverzicht met verlegde BTW
 * - Jaaroverzicht PDF met winst-en-verlies, aftrekposten en belasting
 */

import {
    AccountantTransaction,
    AccountantReceipt,
    CATEGORY_LABELS,
    INCOME_CATEGORIES,
    TransactionCategory,
    getTransactions,
    getReceipts,
    getYearSummary,
    calculateTax,
    formatEuro,
    YearSummary,
    TaxCalculation,
    AccountantSettings,
} from './accountantService';
import {
    Subscription,
    FREQUENCY_LABELS,
    getSubscriptions,
} from './accountantSubscriptionsService';

// ===========================================================================
// Types
// ===========================================================================

export interface BTWQuarterResult {
    quarter: number;
    label: string;
    months: string;
    vatCollected: number;
    vatPaid: number;
    vatReversed: number;
    vatBalance: number;
}

export interface BTWQuarterlyOverview {
    year: number;
    quarters: BTWQuarterResult[];
    totals: {
        vatCollected: number;
        vatPaid: number;
        vatReversed: number;
        vatBalance: number;
    };
}

// ===========================================================================
// Helpers
// ===========================================================================

function getQuarterFromDate(isoDate: string): number {
    const month = parseInt(isoDate.split('-')[1], 10);
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
}

function escapeCsvField(value: string): string {
    if (value.includes(';') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function formatAmountCSV(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
}

function downloadCSV(content: string, filename: string): void {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const QUARTER_META = [
    { label: 'Q1', months: 'Januari t/m Maart', startMonth: 1, endMonth: 3 },
    { label: 'Q2', months: 'April t/m Juni', startMonth: 4, endMonth: 6 },
    { label: 'Q3', months: 'Juli t/m September', startMonth: 7, endMonth: 9 },
    { label: 'Q4', months: 'Oktober t/m December', startMonth: 10, endMonth: 12 },
] as const;

// ===========================================================================
// CSV Export: Transacties
// ===========================================================================

export async function exportTransactionsCSV(userId: string, year: number): Promise<void> {
    const transactions = await getTransactions(userId, year);

    const header = 'Datum;Omschrijving;Bedrag;BTW;Categorie;Type';
    const rows = transactions.map(tx => {
        const type = tx.amount >= 0 ? 'Inkomst' : 'Uitgave';
        const categoryLabel = CATEGORY_LABELS[tx.category] || tx.category;
        return [
            tx.date,
            escapeCsvField(tx.description),
            formatAmountCSV(tx.amount),
            formatAmountCSV(0),
            escapeCsvField(categoryLabel),
            type,
        ].join(';');
    });

    const content = [header, ...rows].join('\n');
    downloadCSV(content, `transacties_${year}.csv`);
}

// ===========================================================================
// CSV Export: Bonnetjes
// ===========================================================================

export async function exportReceiptsCSV(userId: string, year: number): Promise<void> {
    const receipts = await getReceipts(userId, year);

    const header = 'Datum;Leverancier;Omschrijving;Bedrag excl. BTW;BTW-bedrag;BTW-tarief;Categorie';
    const rows = receipts.map(r => {
        const categoryLabel = CATEGORY_LABELS[r.category] || r.category;
        return [
            r.date,
            escapeCsvField(r.supplier || ''),
            escapeCsvField(r.description || ''),
            formatAmountCSV(r.amount),
            formatAmountCSV(r.vat_amount),
            `${r.vat_rate}%`,
            escapeCsvField(categoryLabel),
        ].join(';');
    });

    const content = [header, ...rows].join('\n');
    downloadCSV(content, `bonnetjes_${year}.csv`);
}

// ===========================================================================
// CSV Export: Abonnementen
// ===========================================================================

export async function exportSubscriptionsCSV(userId: string): Promise<void> {
    const subs = await getSubscriptions(userId);

    const header = 'Naam;Leverancier;Bedrag excl. BTW;BTW-bedrag;BTW-tarief;Frequentie;Categorie;Startdatum;Status';
    const rows = subs.map(s => {
        const categoryLabel = CATEGORY_LABELS[s.category] || s.category;
        const frequencyLabel = FREQUENCY_LABELS[s.frequency];
        return [
            escapeCsvField(s.name),
            escapeCsvField(s.supplier || ''),
            formatAmountCSV(s.amount),
            formatAmountCSV(s.vat_amount),
            `${s.vat_rate}%`,
            frequencyLabel,
            escapeCsvField(categoryLabel),
            s.start_date,
            s.is_active ? 'Actief' : 'Gepauzeerd',
        ].join(';');
    });

    const content = [header, ...rows].join('\n');
    downloadCSV(content, `abonnementen.csv`);
}

// ===========================================================================
// BTW Kwartaaloverzicht
// ===========================================================================

export async function getBTWQuarterlyOverview(userId: string, year: number): Promise<BTWQuarterlyOverview> {
    const [receipts, transactions] = await Promise.all([
        getReceipts(userId, year),
        getTransactions(userId, year),
    ]);

    const quarters: BTWQuarterResult[] = QUARTER_META.map((q, i) => {
        const quarterNum = i + 1;

        const quarterReceipts = receipts.filter(r => {
            const month = parseInt(r.date.split('-')[1], 10);
            return month >= q.startMonth && month <= q.endMonth;
        });

        const quarterTransactions = transactions.filter(tx => {
            const month = parseInt(tx.date.split('-')[1], 10);
            return month >= q.startMonth && month <= q.endMonth;
        });

        // BTW ontvangen: geschat op basis van inkomsttransacties (21/121)
        const quarterIncome = quarterTransactions
            .filter(tx => tx.amount > 0)
            .reduce((sum, tx) => sum + tx.amount, 0);
        const vatCollected = quarterIncome * (21 / 121);

        // BTW betaald: via bonnetjes (excl. verlegd)
        const vatPaid = quarterReceipts
            .filter(r => r.vat_rate > 0)
            .reduce((sum, r) => sum + r.vat_amount, 0);

        // BTW verlegd: bonnetjes met vat_rate=0 (buitenlandse SaaS)
        const vatReversed = quarterReceipts
            .filter(r => r.vat_rate === 0)
            .reduce((sum, r) => sum + r.amount, 0) * 0.21;

        const vatBalance = vatCollected - vatPaid;

        return {
            quarter: quarterNum,
            label: q.label,
            months: q.months,
            vatCollected,
            vatPaid,
            vatReversed,
            vatBalance,
        };
    });

    const totals = quarters.reduce(
        (acc, q) => ({
            vatCollected: acc.vatCollected + q.vatCollected,
            vatPaid: acc.vatPaid + q.vatPaid,
            vatReversed: acc.vatReversed + q.vatReversed,
            vatBalance: acc.vatBalance + q.vatBalance,
        }),
        { vatCollected: 0, vatPaid: 0, vatReversed: 0, vatBalance: 0 }
    );

    return { year, quarters, totals };
}

// ===========================================================================
// CSV Export: BTW-overzicht
// ===========================================================================

export async function exportBTWOverzichtCSV(userId: string, year: number, quarter?: number): Promise<void> {
    const overview = await getBTWQuarterlyOverview(userId, year);

    const header = 'Kwartaal;Periode;BTW ontvangen;BTW betaald;BTW verlegd;BTW saldo';

    const quartersToExport = quarter
        ? overview.quarters.filter(q => q.quarter === quarter)
        : overview.quarters;

    const rows = quartersToExport.map(q => [
        q.label,
        q.months,
        formatAmountCSV(q.vatCollected),
        formatAmountCSV(q.vatPaid),
        formatAmountCSV(q.vatReversed),
        formatAmountCSV(q.vatBalance),
    ].join(';'));

    if (!quarter) {
        rows.push([
            'Totaal',
            `Heel ${year}`,
            formatAmountCSV(overview.totals.vatCollected),
            formatAmountCSV(overview.totals.vatPaid),
            formatAmountCSV(overview.totals.vatReversed),
            formatAmountCSV(overview.totals.vatBalance),
        ].join(';'));
    }

    const content = [header, ...rows].join('\n');
    const suffix = quarter ? `_Q${quarter}` : '';
    downloadCSV(content, `btw_overzicht_${year}${suffix}.csv`);
}

// ===========================================================================
// PDF Jaaroverzicht
// ===========================================================================

export async function generateAnnualReportPDF(
    userId: string,
    year: number,
    settings?: AccountantSettings | null,
    starterAftrek?: boolean,
): Promise<void> {
    const [summary, btwOverview] = await Promise.all([
        getYearSummary(userId, year),
        getBTWQuarterlyOverview(userId, year),
    ]);

    const tax = calculateTax(summary, starterAftrek ?? settings?.starter_aftrek ?? false);

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const name = settings?.business_name || 'ZZP-er';
    const kvk = settings?.kvk_number ? `KvK: ${settings.kvk_number}` : '';

    const euro = (v: number) =>
        `\u20AC ${Math.abs(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    let y = 20;

    function checkPageBreak(needed: number) {
        if (y + needed > 280) {
            doc.addPage();
            y = 20;
        }
    }

    function sectionTitle(title: string) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(title, 20, y);
        y += 8;
    }

    function row(label: string, value: number | string, bold = false) {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(bold ? 30 : 80, bold ? 30 : 80, bold ? 30 : 80);
        doc.text(label, 24, y);
        const displayValue = typeof value === 'number' ? euro(value) : value;
        doc.text(displayValue, 180, y, { align: 'right' });
        y += 7;
    }

    function divider() {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, y, 190, y);
        y += 5;
    }

    // === Header ===
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`Jaaroverzicht ${year}`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(name, 20, y);
    if (kvk) { y += 5; doc.text(kvk, 20, y); }
    y += 5;
    doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`, 20, y);
    y += 12;
    divider();
    y += 3;

    // === Winst-en-verliesrekening ===
    sectionTitle('Winst- en Verliesrekening');
    row('Bruto-omzet', summary.totalIncome);
    row('Zakelijke kosten', -summary.totalExpenses);
    divider();
    row('Winst uit onderneming', summary.profit, true);
    y += 6;

    // === Kosten per categorie ===
    sectionTitle('Kosten per Categorie');
    const expenseCategories = Object.entries(summary.byCategory)
        .filter(([cat]) => !INCOME_CATEGORIES.includes(cat as TransactionCategory))
        .sort(([, a], [, b]) => b - a);

    for (const [cat, amount] of expenseCategories) {
        const label = CATEGORY_LABELS[cat as TransactionCategory] || cat;
        row(label, amount);
    }
    divider();
    row('Totaal kosten', summary.totalExpenses, true);
    y += 6;

    // === BTW-overzicht per kwartaal ===
    sectionTitle('BTW-overzicht per Kwartaal');

    checkPageBreak(60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    const colX = [24, 65, 100, 135, 160];
    doc.text('Kwartaal', colX[0], y);
    doc.text('Ontvangen', colX[1], y);
    doc.text('Betaald', colX[2], y);
    doc.text('Verlegd', colX[3], y);
    doc.text('Saldo', colX[4], y);
    y += 6;
    divider();

    doc.setFont('helvetica', 'normal');
    for (const q of btwOverview.quarters) {
        checkPageBreak(10);
        doc.text(q.label, colX[0], y);
        doc.text(euro(q.vatCollected), colX[1], y);
        doc.text(euro(q.vatPaid), colX[2], y);
        doc.text(euro(q.vatReversed), colX[3], y);
        doc.text(euro(q.vatBalance), colX[4], y);
        y += 7;
    }
    divider();
    doc.setFont('helvetica', 'bold');
    doc.text('Totaal', colX[0], y);
    doc.text(euro(btwOverview.totals.vatCollected), colX[1], y);
    doc.text(euro(btwOverview.totals.vatPaid), colX[2], y);
    doc.text(euro(btwOverview.totals.vatReversed), colX[3], y);
    doc.text(euro(btwOverview.totals.vatBalance), colX[4], y);
    y += 10;

    // === Ondernemersaftrekken ===
    sectionTitle('Ondernemersaftrekken');
    row('Zelfstandigenaftrek', -tax.zelfstandigenaftrek);
    if (tax.startersaftrek > 0) {
        row('Startersaftrek', -tax.startersaftrek);
    }
    row('MKB-winstvrijstelling (12,7%)', -tax.mkbWinstvrijstelling);
    divider();
    row('Belastbaar inkomen Box 1', tax.taxableIncome, true);
    y += 6;

    // === Belastingberekening ===
    sectionTitle('Geschatte Inkomstenbelasting');
    const in1 = Math.min(tax.taxableIncome, 76814);
    const in2 = Math.max(0, tax.taxableIncome - 76814);
    row(`Schijf 1 (t/m \u20AC76.814 x 36,97%)`, in1 * 0.3697);
    if (in2 > 0) {
        row(`Schijf 2 (boven \u20AC76.814 x 49,50%)`, in2 * 0.495);
    }
    divider();
    row('Geschatte inkomstenbelasting', tax.estimatedTax, true);
    y += 3;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`Effectief tarief: ${tax.effectiveRate.toFixed(1)}%`, 24, y);
    y += 12;

    // === Disclaimer ===
    checkPageBreak(20);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(
        'Dit overzicht is indicatief en dient als voorbereiding op je belastingaangifte.',
        20, y,
    );
    y += 4;
    doc.text(
        'Raadpleeg een belastingadviseur voor je definitieve aangifte.',
        20, y,
    );

    doc.save(`jaaroverzicht_${year}.pdf`);
}
