/**
 * Accountant Invoices Service — Facturen module voor ZZP boekhoudapp
 *
 * Biedt functies voor:
 * - Facturen CRUD (aanmaken, ophalen, bijwerken, verwijderen)
 * - Factuurregels beheer
 * - Berekening van subtotalen, BTW en totalen
 * - PDF generatie van professionele Nederlandse facturen
 * - Factuurnummer generatie via PostgreSQL functie
 */

import { supabase } from './supabase';

// De nieuwe accountant-tabellen zitten nog niet in de auto-gegenereerde database.types.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ============================================================================
// Types
// ============================================================================

export interface InvoiceLine {
    id?: string;
    invoice_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: 0 | 9 | 21;
    vat_amount: number;
    line_total: number;
    sort_order?: number;
}

export interface Invoice {
    id?: string;
    user_id: string;
    invoice_number: string;
    client_name: string;
    client_address?: string;
    client_vat_number?: string;
    client_email?: string;
    issue_date: string;
    due_date?: string;
    status: 'concept' | 'verzonden' | 'betaald' | 'vervallen';
    subtotal: number;
    vat_amount: number;
    total: number;
    notes?: string;
    created_at?: string;
    lines?: InvoiceLine[];
}

export interface InvoiceSummary {
    total: number;
    paid: number;
    unpaid: number;
    overdue: number;
    vatCollected: number;
    count: number;
}

// ============================================================================
// Helpers
// ============================================================================

export function isOverdue(invoice: Invoice): boolean {
    if (invoice.status === 'betaald') return false;
    if (!invoice.due_date) return false;
    return invoice.due_date < new Date().toISOString().split('T')[0];
}

export function getInvoiceSummary(invoices: Invoice[]): InvoiceSummary {
    let total = 0;
    let paid = 0;
    let unpaid = 0;
    let overdue = 0;
    let vatCollected = 0;

    for (const inv of invoices) {
        total += inv.total;
        if (inv.status === 'betaald') {
            paid += inv.total;
            vatCollected += inv.vat_amount;
        } else {
            unpaid += inv.total;
            if (isOverdue(inv)) {
                overdue += inv.total;
            }
        }
    }

    return {
        total,
        paid,
        unpaid,
        overdue,
        vatCollected,
        count: invoices.length,
    };
}

export function calculateInvoiceTotals(
    lines: Omit<InvoiceLine, 'id' | 'invoice_id'>[]
): { subtotal: number; vat_amount: number; total: number; lines: InvoiceLine[] } {
    let subtotal = 0;
    let vat_amount = 0;

    const computedLines: InvoiceLine[] = lines.map((line, idx) => {
        const lineSubtotal = line.quantity * line.unit_price;
        const lineVat = lineSubtotal * (line.vat_rate / 100);
        const lineTotal = lineSubtotal + lineVat;

        subtotal += lineSubtotal;
        vat_amount += lineVat;

        return {
            ...line,
            vat_amount: Math.round(lineVat * 100) / 100,
            line_total: Math.round(lineTotal * 100) / 100,
            sort_order: line.sort_order ?? idx,
        };
    });

    subtotal = Math.round(subtotal * 100) / 100;
    vat_amount = Math.round(vat_amount * 100) / 100;
    const total = Math.round((subtotal + vat_amount) * 100) / 100;

    return { subtotal, vat_amount, total, lines: computedLines };
}

// ============================================================================
// Database functies
// ============================================================================

export async function getInvoices(userId: string, year: number): Promise<Invoice[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data: invoicesData, error: invoicesError } = await db
        .from('accountant_invoices')
        .select('*')
        .eq('user_id', userId)
        .gte('issue_date', startDate)
        .lte('issue_date', endDate)
        .order('issue_date', { ascending: false });

    if (invoicesError) throw new Error(`Facturen ophalen mislukt: ${invoicesError.message}`);
    const invoices = (invoicesData || []) as Invoice[];

    if (invoices.length === 0) return [];

    const invoiceIds = invoices.map((inv: Invoice) => inv.id).filter(Boolean);

    const { data: linesData, error: linesError } = await db
        .from('accountant_invoice_lines')
        .select('*')
        .in('invoice_id', invoiceIds)
        .order('sort_order', { ascending: true });

    if (linesError) throw new Error(`Factuurregels ophalen mislukt: ${linesError.message}`);
    const lines = (linesData || []) as InvoiceLine[];

    return invoices.map((inv: Invoice) => ({
        ...inv,
        lines: lines.filter((l: InvoiceLine) => l.invoice_id === inv.id),
    }));
}

export async function getInvoice(id: string): Promise<Invoice> {
    const { data: invoiceData, error: invoiceError } = await db
        .from('accountant_invoices')
        .select('*')
        .eq('id', id)
        .single();

    if (invoiceError) throw new Error(`Factuur ophalen mislukt: ${invoiceError.message}`);

    const { data: linesData, error: linesError } = await db
        .from('accountant_invoice_lines')
        .select('*')
        .eq('invoice_id', id)
        .order('sort_order', { ascending: true });

    if (linesError) throw new Error(`Factuurregels ophalen mislukt: ${linesError.message}`);

    return {
        ...(invoiceData as Invoice),
        lines: (linesData || []) as InvoiceLine[],
    };
}

export async function createInvoice(
    invoice: Omit<Invoice, 'id' | 'created_at' | 'lines'>,
    lines: Omit<InvoiceLine, 'id' | 'invoice_id'>[]
): Promise<Invoice> {
    const { subtotal, vat_amount, total, lines: computedLines } = calculateInvoiceTotals(lines);

    const invoicePayload = {
        ...invoice,
        subtotal,
        vat_amount,
        total,
    };

    const { data: invoiceData, error: invoiceError } = await db
        .from('accountant_invoices')
        .insert(invoicePayload)
        .select()
        .single();

    if (invoiceError) throw new Error(`Factuur aanmaken mislukt: ${invoiceError.message}`);

    const createdInvoice = invoiceData as Invoice;

    if (computedLines.length > 0) {
        const linePayloads = computedLines.map((line, idx) => ({
            invoice_id: createdInvoice.id,
            description: line.description,
            quantity: line.quantity,
            unit_price: line.unit_price,
            vat_rate: line.vat_rate,
            vat_amount: line.vat_amount,
            line_total: line.line_total,
            sort_order: line.sort_order ?? idx,
        }));

        const { data: linesData, error: linesError } = await db
            .from('accountant_invoice_lines')
            .insert(linePayloads)
            .select();

        if (linesError) throw new Error(`Factuurregels aanmaken mislukt: ${linesError.message}`);

        return {
            ...createdInvoice,
            lines: (linesData || []) as InvoiceLine[],
        };
    }

    return { ...createdInvoice, lines: [] };
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
    // Verwijder velden die niet in de tabel horen
    const { lines: _lines, id: _id, created_at: _created_at, ...dbUpdates } = updates as Invoice & { lines?: InvoiceLine[] };

    const { error } = await db
        .from('accountant_invoices')
        .update(dbUpdates)
        .eq('id', id);

    if (error) throw new Error(`Factuur bijwerken mislukt: ${error.message}`);
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']): Promise<void> {
    const { error } = await db
        .from('accountant_invoices')
        .update({ status })
        .eq('id', id);

    if (error) throw new Error(`Factuurstatus bijwerken mislukt: ${error.message}`);
}

export async function deleteInvoice(id: string): Promise<void> {
    // Haal de factuur op om de status te controleren
    const { data, error: fetchError } = await db
        .from('accountant_invoices')
        .select('status')
        .eq('id', id)
        .single();

    if (fetchError) throw new Error(`Factuur ophalen mislukt: ${fetchError.message}`);

    if (data.status !== 'concept') {
        throw new Error('Alleen facturen met status "concept" kunnen worden verwijderd.');
    }

    const { error } = await db
        .from('accountant_invoices')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Factuur verwijderen mislukt: ${error.message}`);
}

export async function getNextInvoiceNumber(userId: string): Promise<string> {
    const currentYear = new Date().getFullYear();

    const { data, error } = await db.rpc('get_next_invoice_number', {
        p_user_id: userId,
        p_year: currentYear,
    });

    if (error) throw new Error(`Factuurnummer ophalen mislukt: ${error.message}`);
    return data as string;
}

// ============================================================================
// PDF Generatie
// ============================================================================

export async function generateInvoicePDF(
    invoice: Invoice,
    businessSettings?: {
        business_name?: string;
        kvk_number?: string;
        iban?: string;
        btw_number?: string;
    }
): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW = 210;
    const marginL = 20;
    const marginR = 20;
    const contentW = pageW - marginL - marginR;
    const rightX = pageW - marginR;

    const euro = (v: number): string =>
        new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v);

    const formatDate = (iso: string): string =>
        new Date(iso).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' });

    let y = 20;

    // ── Header: Bedrijfsnaam links, KvK/BTW/IBAN rechts ──────────────────────
    const businessName = businessSettings?.business_name || 'Uw bedrijf';

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(businessName, marginL, y);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    let rightY = y - 6;
    const rightLines: string[] = [];
    if (businessSettings?.kvk_number) rightLines.push(`KvK: ${businessSettings.kvk_number}`);
    if (businessSettings?.btw_number) rightLines.push(`BTW: ${businessSettings.btw_number}`);
    if (businessSettings?.iban) rightLines.push(`IBAN: ${businessSettings.iban}`);

    for (const rl of rightLines) {
        rightY += 5;
        doc.text(rl, rightX, rightY, { align: 'right' });
    }

    y += 8;

    // ── Horizontale scheidingslijn ─────────────────────────────────────────
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, rightX, y);
    y += 10;

    // ── Factuurgegevens (links) + Klantgegevens (rechts) ──────────────────
    const col2X = marginL + contentW / 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('FACTUUR', marginL, y);
    doc.text('KLANT', col2X, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8.5);

    // Factuurgegevens links
    const labelW = 32;
    const valueX = marginL + labelW;

    function labelValue(label: string, value: string, yPos: number): void {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(label, marginL, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(value, valueX, yPos);
    }

    labelValue('Nummer:', invoice.invoice_number, y);
    labelValue('Datum:', formatDate(invoice.issue_date), y + 5);
    if (invoice.due_date) {
        labelValue('Vervaldatum:', formatDate(invoice.due_date), y + 10);
    }

    // Klantgegevens rechts
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.text(invoice.client_name, col2X, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);

    let clientY = y + 5;
    if (invoice.client_address) {
        const addressLines = doc.splitTextToSize(invoice.client_address, 80) as string[];
        for (const al of addressLines) {
            doc.text(al, col2X, clientY);
            clientY += 4.5;
        }
    }
    if (invoice.client_vat_number) {
        doc.text(`BTW: ${invoice.client_vat_number}`, col2X, clientY);
        clientY += 4.5;
    }
    if (invoice.client_email) {
        doc.text(invoice.client_email, col2X, clientY);
    }

    y += 22;

    // ── Factuurregels tabel ────────────────────────────────────────────────
    doc.setDrawColor(220, 220, 220);
    doc.line(marginL, y, rightX, y);
    y += 5;

    // Kolombreedtes (mm)
    const colDesc = marginL;
    const colQty  = marginL + 82;
    const colPrice = marginL + 102;
    const colVatPct = marginL + 122;
    const colVatAmt = marginL + 138;
    const colTotal = rightX;

    // Header rij
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Omschrijving', colDesc, y);
    doc.text('Aantal', colQty, y, { align: 'right' });
    doc.text('Prijs', colPrice, y, { align: 'right' });
    doc.text('BTW%', colVatPct, y, { align: 'right' });
    doc.text('BTW', colVatAmt, y, { align: 'right' });
    doc.text('Totaal', colTotal, y, { align: 'right' });
    y += 3;

    doc.setDrawColor(220, 220, 220);
    doc.line(marginL, y, rightX, y);
    y += 5;

    // Regels
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);

    const lines = invoice.lines || [];
    for (const line of lines) {
        const descLines = doc.splitTextToSize(line.description, 78) as string[];
        const lineH = Math.max(descLines.length * 4.5, 6);

        // Controleer of er nog genoeg ruimte is op de pagina
        if (y + lineH > 260) {
            doc.addPage();
            y = 20;
        }

        doc.text(descLines, colDesc, y);
        doc.text(String(line.quantity), colQty, y, { align: 'right' });
        doc.text(euro(line.unit_price), colPrice, y, { align: 'right' });
        doc.text(`${line.vat_rate}%`, colVatPct, y, { align: 'right' });
        doc.text(euro(line.vat_amount), colVatAmt, y, { align: 'right' });
        doc.text(euro(line.line_total), colTotal, y, { align: 'right' });

        y += lineH + 1;

        doc.setDrawColor(240, 240, 240);
        doc.line(marginL, y - 1, rightX, y - 1);
    }

    y += 4;

    // ── Totaalblok rechts ─────────────────────────────────────────────────
    const totLabelX = rightX - 60;
    const totValueX = rightX;

    function totaalRij(label: string, value: string, bold = false): void {
        if (bold) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
        }
        doc.setFontSize(8.5);
        doc.text(label, totLabelX, y);
        doc.text(value, totValueX, y, { align: 'right' });
        y += 5.5;
    }

    totaalRij('Subtotaal (excl. BTW)', euro(invoice.subtotal));
    totaalRij('BTW', euro(invoice.vat_amount));

    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.5);
    doc.line(totLabelX, y, rightX, y);
    y += 4;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Totaal incl. BTW', totLabelX, y);
    doc.text(euro(invoice.total), totValueX, y, { align: 'right' });
    y += 10;

    // ── Notities ─────────────────────────────────────────────────────────
    if (invoice.notes) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(80, 80, 80);
        doc.text('Opmerkingen:', marginL, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(invoice.notes, contentW) as string[];
        doc.text(noteLines, marginL, y);
        y += noteLines.length * 4.5 + 4;
    }

    // ── Voetnoot / Betalingsinfo ──────────────────────────────────────────
    const footerY = 275;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(marginL, footerY - 4, rightX, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);

    const ibanText = businessSettings?.iban
        ? `Graag betalen binnen 30 dagen op rekening ${businessSettings.iban} o.v.v. factuurnummer ${invoice.invoice_number}.`
        : `Graag betalen binnen 30 dagen o.v.v. factuurnummer ${invoice.invoice_number}.`;

    doc.text(ibanText, marginL, footerY);

    // ── Opslaan ───────────────────────────────────────────────────────────
    const filename = `factuur_${invoice.invoice_number.replace('-', '_')}.pdf`;
    doc.save(filename);
}
