import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Plus, Download, Send, Check, Trash2, AlertCircle,
    ChevronDown, Eye, FileText, Euro, Clock,
} from 'lucide-react';
import {
    Invoice,
    InvoiceLine,
    InvoiceSummary,
    getInvoices,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    getNextInvoiceNumber,
    calculateInvoiceTotals,
    generateInvoicePDF,
    getInvoiceSummary,
    isOverdue,
} from '@/services/accountantInvoicesService';
import { getSettings } from '@/services/accountantService';

// ============================================================================
// Types en helpers
// ============================================================================

interface InvoicesPanelProps {
    userId: string;
    year: number;
    onRefresh?: () => void;
}

type StatusFilter = 'alle' | 'openstaand' | 'betaald' | 'vervallen';

function formatEuro(amount: number): string {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDateShort(iso: string): string {
    return new Date(iso).toLocaleDateString('nl-NL', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

const STATUS_LABELS: Record<Invoice['status'], string> = {
    concept: 'Concept',
    verzonden: 'Verzonden',
    betaald: 'Betaald',
    vervallen: 'Vervallen',
};

const STATUS_COLORS: Record<Invoice['status'], string> = {
    concept: 'bg-duck-bg text-duck-muted',
    verzonden: 'bg-duck-ink text-white',
    betaald: 'bg-duck-ink text-white',
    vervallen: 'bg-duck-coral text-white',
};

// ============================================================================
// Lege factuurregelrij
// ============================================================================

function emptyLine(idx: number): Omit<InvoiceLine, 'id' | 'invoice_id'> {
    return {
        description: '',
        quantity: 1,
        unit_price: 0,
        vat_rate: 21,
        vat_amount: 0,
        line_total: 0,
        sort_order: idx,
    };
}

// ============================================================================
// Stat Kaart
// ============================================================================

function StatCard({
    label,
    value,
    color,
    icon,
}: {
    label: string;
    value: string;
    color: string;
    icon: React.ReactNode;
}) {
    return (
        <div className={`rounded-2xl border p-5 ${color}`}>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
            </div>
            <p className="text-xl font-black tabular-nums">{value}</p>
        </div>
    );
}

// ============================================================================
// Factuur detail modal (preview)
// ============================================================================

function InvoiceDetailModal({
    invoice,
    onClose,
    onDownloadPDF,
}: {
    invoice: Invoice;
    onClose: () => void;
    onDownloadPDF: (inv: Invoice) => void;
}) {
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const lines = invoice.lines || [];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white rounded-t-3xl border-b border-duck-line px-8 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-duck-ink uppercase tracking-tight">
                            Factuur {invoice.invoice_number}
                        </h3>
                        <p className="text-xs text-duck-muted mt-0.5">{invoice.client_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDownloadPDF(invoice)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-duck-coral text-white rounded-xl text-xs font-bold hover:bg-duck-coral hover:text-white transition-colors"
                        >
                            <Download size={13} />
                            PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-duck-line rounded-xl text-xs font-bold text-duck-muted hover:bg-duck-bg transition-colors"
                        >
                            Sluiten
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Meta gegevens */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${STATUS_COLORS[invoice.status]}`}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">Factuurdatum</p>
                            <p className="font-bold text-duck-ink text-sm">{formatDateShort(invoice.issue_date)}</p>
                        </div>
                        {invoice.due_date && (
                            <div>
                                <p className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">Vervaldatum</p>
                                <p className={`font-bold text-sm ${isOverdue(invoice) ? 'text-duck-coral' : 'text-duck-ink'}`}>
                                    {formatDateShort(invoice.due_date)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Klantgegevens */}
                    <div className="bg-duck-bg rounded-2xl p-4">
                        <p className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-2">Klant</p>
                        <p className="font-bold text-duck-ink">{invoice.client_name}</p>
                        {invoice.client_address && (
                            <p className="text-sm text-duck-muted mt-1 whitespace-pre-wrap">{invoice.client_address}</p>
                        )}
                        {invoice.client_vat_number && (
                            <p className="text-xs text-duck-muted mt-1">BTW: {invoice.client_vat_number}</p>
                        )}
                        {invoice.client_email && (
                            <p className="text-xs text-duck-muted mt-1">{invoice.client_email}</p>
                        )}
                    </div>

                    {/* Factuurregels tabel */}
                    {lines.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-duck-line">
                                        <th className="text-left py-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">Omschrijving</th>
                                        <th className="text-right py-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">Aantal</th>
                                        <th className="text-right py-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">Tarief</th>
                                        <th className="text-right py-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">BTW%</th>
                                        <th className="text-right py-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">Totaal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {lines.map((line, idx) => (
                                        <tr key={line.id || idx}>
                                            <td className="py-2.5 text-duck-ink font-medium">{line.description}</td>
                                            <td className="py-2.5 text-right text-duck-muted">{line.quantity}</td>
                                            <td className="py-2.5 text-right text-duck-muted">{formatEuro(line.unit_price)}</td>
                                            <td className="py-2.5 text-right text-duck-muted">{line.vat_rate}%</td>
                                            <td className="py-2.5 text-right font-bold text-duck-ink">{formatEuro(line.line_total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Totaalblok */}
                    <div className="border-t border-duck-line pt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-duck-muted">Subtotaal (excl. BTW)</span>
                            <span className="font-medium text-duck-ink">{formatEuro(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-duck-muted">BTW</span>
                            <span className="font-medium text-duck-ink">{formatEuro(invoice.vat_amount)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black pt-2 border-t border-duck-line">
                            <span className="text-duck-ink">Totaal incl. BTW</span>
                            <span className="text-duck-ink">{formatEuro(invoice.total)}</span>
                        </div>
                    </div>

                    {/* Notities */}
                    {invoice.notes && (
                        <div className="bg-duck-acid border border-duck-acid rounded-xl px-4 py-3">
                            <p className="text-[10px] font-black text-duck-ink uppercase tracking-widest mb-1">Notities</p>
                            <p className="text-sm text-duck-ink whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Nieuwe Factuur Modal
// ============================================================================

interface NewInvoiceForm {
    client_name: string;
    client_address: string;
    client_vat_number: string;
    client_email: string;
    notes: string;
}

function NewInvoiceModal({
    userId,
    nextInvoiceNumber,
    onSave,
    onClose,
}: {
    userId: string;
    nextInvoiceNumber: string;
    onSave: (invoice: Omit<Invoice, 'id' | 'created_at' | 'lines'>, lines: Omit<InvoiceLine, 'id' | 'invoice_id'>[], status: Invoice['status']) => Promise<void>;
    onClose: () => void;
}) {
    const [step, setStep] = useState<1 | 2>(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState<NewInvoiceForm>({
        client_name: '',
        client_address: '',
        client_vat_number: '',
        client_email: '',
        notes: '',
    });

    const today = new Date().toISOString().split('T')[0];
    const defaultDueDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    })();

    const [issueDate, setIssueDate] = useState(today);
    const [dueDate, setDueDate] = useState(defaultDueDate);

    const [lines, setLines] = useState<Omit<InvoiceLine, 'id' | 'invoice_id'>[]>([emptyLine(0)]);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const totals = useMemo(() => calculateInvoiceTotals(lines), [lines]);

    function updateLine(idx: number, field: keyof Omit<InvoiceLine, 'id' | 'invoice_id'>, value: string | number) {
        setLines(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    }

    function addLine() {
        setLines(prev => [...prev, emptyLine(prev.length)]);
    }

    function removeLine(idx: number) {
        setLines(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, sort_order: i })));
    }

    function validateStep1(): boolean {
        if (!form.client_name.trim()) {
            setError('Klantnaam is verplicht.');
            return false;
        }
        setError('');
        return true;
    }

    function validateStep2(): boolean {
        for (const line of lines) {
            if (!line.description.trim()) {
                setError('Vul een omschrijving in voor alle regels.');
                return false;
            }
            if (line.quantity <= 0) {
                setError('Aantal moet groter zijn dan 0.');
                return false;
            }
            if (line.unit_price < 0) {
                setError('Tarief mag niet negatief zijn.');
                return false;
            }
        }
        if (lines.length === 0) {
            setError('Voeg minimaal één factuurregel toe.');
            return false;
        }
        setError('');
        return true;
    }

    async function handleSave(status: Invoice['status']) {
        if (!validateStep2()) return;

        setSaving(true);
        setError('');
        try {
            const invoicePayload: Omit<Invoice, 'id' | 'created_at' | 'lines'> = {
                user_id: userId,
                invoice_number: nextInvoiceNumber,
                client_name: form.client_name.trim(),
                client_address: form.client_address.trim() || undefined,
                client_vat_number: form.client_vat_number.trim() || undefined,
                client_email: form.client_email.trim() || undefined,
                issue_date: issueDate,
                due_date: dueDate || undefined,
                status,
                subtotal: totals.subtotal,
                vat_amount: totals.vat_amount,
                total: totals.total,
                notes: form.notes.trim() || undefined,
            };
            await onSave(invoicePayload, lines, status);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
                {/* Header */}
                <div className="border-b border-duck-line px-8 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-duck-ink uppercase tracking-tight">Nieuwe Factuur</h3>
                        <p className="text-xs text-duck-muted mt-0.5">
                            Factuurnummer: <span className="font-bold text-duck-coral">{nextInvoiceNumber}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-duck-bg rounded-xl transition-colors"
                        aria-label="Sluiten"
                    >
                        <ChevronDown size={20} className="text-duck-muted rotate-180" />
                    </button>
                </div>

                {/* Stap indicator */}
                <div className="flex border-b border-duck-line">
                    <button
                        onClick={() => setStep(1)}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                            step === 1
                                ? 'text-duck-coral border-b-2 border-duck-coral'
                                : 'text-duck-muted hover:text-duck-muted'
                        }`}
                    >
                        1. Klantgegevens
                    </button>
                    <button
                        onClick={() => {
                            if (validateStep1()) setStep(2);
                        }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                            step === 2
                                ? 'text-duck-coral border-b-2 border-duck-coral'
                                : 'text-duck-muted hover:text-duck-muted'
                        }`}
                    >
                        2. Factuurregels
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="flex items-center gap-2 text-white bg-duck-coral rounded-xl px-4 py-3 mb-5 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Stap 1: Klantgegevens */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                        Factuurdatum
                                    </label>
                                    <input
                                        type="date"
                                        value={issueDate}
                                        onChange={e => setIssueDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                        Vervaldatum
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                    Klantnaam <span className="text-duck-coral">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.client_name}
                                    onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                                    placeholder="Naam van de klant of het bedrijf"
                                    className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                    Adres
                                </label>
                                <textarea
                                    value={form.client_address}
                                    onChange={e => setForm(f => ({ ...f, client_address: e.target.value }))}
                                    placeholder="Straat en huisnummer&#10;Postcode en stad"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                        BTW-nummer klant
                                    </label>
                                    <input
                                        type="text"
                                        value={form.client_vat_number}
                                        onChange={e => setForm(f => ({ ...f, client_vat_number: e.target.value }))}
                                        placeholder="NL000000000B01"
                                        className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                        E-mailadres klant
                                    </label>
                                    <input
                                        type="email"
                                        value={form.client_email}
                                        onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))}
                                        placeholder="klant@bedrijf.nl"
                                        className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-duck-muted uppercase tracking-widest mb-1">
                                    Notities (optioneel)
                                </label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Extra informatie op de factuur..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-duck-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duck-coral resize-none"
                                />
                            </div>

                            <button
                                onClick={() => { if (validateStep1()) setStep(2); }}
                                className="w-full py-3 bg-duck-coral text-white rounded-xl text-sm font-bold hover:bg-duck-coral hover:text-white transition-colors"
                            >
                                Volgende: Factuurregels
                            </button>
                        </div>
                    )}

                    {/* Stap 2: Factuurregels */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Regels tabel */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-duck-line">
                                            <th className="text-left pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest">Omschrijving</th>
                                            <th className="text-right pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest w-16">Aantal</th>
                                            <th className="text-right pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest w-24">Tarief (€)</th>
                                            <th className="text-right pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest w-16">BTW%</th>
                                            <th className="text-right pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest w-24">BTW</th>
                                            <th className="text-right pb-2 text-[10px] font-black text-duck-muted uppercase tracking-widest w-24">Totaal</th>
                                            <th className="w-8" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {lines.map((line, idx) => {
                                            const lineSubtotal = line.quantity * line.unit_price;
                                            const lineVat = lineSubtotal * (line.vat_rate / 100);
                                            const lineTotal = lineSubtotal + lineVat;
                                            return (
                                                <tr key={idx}>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="text"
                                                            value={line.description}
                                                            onChange={e => updateLine(idx, 'description', e.target.value)}
                                                            placeholder="Omschrijving werkzaamheden"
                                                            className="w-full px-3 py-2 border border-duck-line rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.5"
                                                            value={line.quantity}
                                                            onChange={e => updateLine(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-2 py-2 border border-duck-line rounded-lg text-xs text-right focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={line.unit_price}
                                                            onChange={e => updateLine(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-2 py-2 border border-duck-line rounded-lg text-xs text-right focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                                        />
                                                    </td>
                                                    <td className="py-2 pr-2">
                                                        <select
                                                            value={line.vat_rate}
                                                            onChange={e => updateLine(idx, 'vat_rate', parseInt(e.target.value) as 0 | 9 | 21)}
                                                            className="w-full px-2 py-2 border border-duck-line rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-duck-coral"
                                                        >
                                                            <option value={0}>0%</option>
                                                            <option value={9}>9%</option>
                                                            <option value={21}>21%</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-2 pr-2 text-right text-xs text-duck-muted tabular-nums whitespace-nowrap">
                                                        {formatEuro(Math.round(lineVat * 100) / 100)}
                                                    </td>
                                                    <td className="py-2 pr-2 text-right text-xs font-bold text-duck-ink tabular-nums whitespace-nowrap">
                                                        {formatEuro(Math.round(lineTotal * 100) / 100)}
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            onClick={() => removeLine(idx)}
                                                            disabled={lines.length === 1}
                                                            className="p-1.5 text-duck-muted hover:text-duck-muted hover:bg-duck-coral hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                onClick={addLine}
                                className="flex items-center gap-1.5 text-xs font-bold text-duck-coral hover:text-duck-coral transition-colors"
                            >
                                <Plus size={14} />
                                Regel toevoegen
                            </button>

                            {/* Totaalblok */}
                            <div className="border-t border-duck-line pt-4 space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-duck-muted">Subtotaal (excl. BTW)</span>
                                    <span className="font-medium text-duck-ink tabular-nums">{formatEuro(totals.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-duck-muted">BTW</span>
                                    <span className="font-medium text-duck-ink tabular-nums">{formatEuro(totals.vat_amount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-black pt-2 border-t border-duck-line">
                                    <span className="text-duck-ink">Totaal incl. BTW</span>
                                    <span className="text-duck-coral tabular-nums">{formatEuro(totals.total)}</span>
                                </div>
                            </div>

                            {/* Opslaan knoppen */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-5 py-3 border border-duck-line rounded-xl text-sm font-bold text-duck-muted hover:bg-duck-bg transition-colors"
                                >
                                    Terug
                                </button>
                                <button
                                    onClick={() => handleSave('concept')}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-duck-line text-duck-muted rounded-xl text-sm font-bold hover:bg-duck-bg disabled:opacity-50 transition-colors"
                                >
                                    <FileText size={15} />
                                    {saving ? 'Opslaan...' : 'Opslaan als concept'}
                                </button>
                                <button
                                    onClick={() => handleSave('verzonden')}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-duck-coral text-white rounded-xl text-sm font-bold hover:bg-duck-coral hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    <Send size={15} />
                                    {saving ? 'Opslaan...' : 'Opslaan & Verzonden'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Hoofd component: InvoicesPanel
// ============================================================================

export function InvoicesPanel({ userId, year, onRefresh }: InvoicesPanelProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('alle');
    const [showNewModal, setShowNewModal] = useState(false);
    const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [businessSettings, setBusinessSettings] = useState<{
        business_name?: string;
        kvk_number?: string;
        iban?: string;
        btw_number?: string;
    }>({});

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [data, settings] = await Promise.all([
                getInvoices(userId, year),
                getSettings(userId).catch(() => null),
            ]);
            setInvoices(data);
            if (settings) {
                setBusinessSettings({
                    business_name: settings.business_name,
                    kvk_number: settings.kvk_number,
                });
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Laden mislukt.');
        } finally {
            setLoading(false);
        }
    }, [userId, year]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function openNewModal() {
        try {
            const num = await getNextInvoiceNumber(userId);
            setNextInvoiceNumber(num);
            setShowNewModal(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Factuurnummer ophalen mislukt.');
        }
    }

    async function handleSaveInvoice(
        invoice: Omit<Invoice, 'id' | 'created_at' | 'lines'>,
        lines: Omit<InvoiceLine, 'id' | 'invoice_id'>[],
        _status: Invoice['status']
    ) {
        await createInvoice(invoice, lines);
        setShowNewModal(false);
        await loadData();
        onRefresh?.();
    }

    async function handleMarkBetaald(invoice: Invoice) {
        if (!invoice.id) return;
        setActionLoading(invoice.id);
        try {
            await updateInvoiceStatus(invoice.id, 'betaald');
            await loadData();
            onRefresh?.();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Status bijwerken mislukt.');
        } finally {
            setActionLoading(null);
        }
    }

    async function handleMarkVerzonden(invoice: Invoice) {
        if (!invoice.id) return;
        setActionLoading(invoice.id);
        try {
            await updateInvoiceStatus(invoice.id, 'verzonden');
            await loadData();
            onRefresh?.();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Status bijwerken mislukt.');
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete(invoice: Invoice) {
        if (!invoice.id) return;
        if (!confirm(`Factuur ${invoice.invoice_number} verwijderen?`)) return;
        setActionLoading(invoice.id);
        try {
            await deleteInvoice(invoice.id);
            await loadData();
            onRefresh?.();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Verwijderen mislukt.');
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDownloadPDF(invoice: Invoice) {
        try {
            await generateInvoicePDF(invoice, businessSettings);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'PDF genereren mislukt.');
        }
    }

    // Gefilterde facturen
    const filtered = useMemo(() => {
        return invoices.filter(inv => {
            if (statusFilter === 'betaald') return inv.status === 'betaald';
            if (statusFilter === 'vervallen') return inv.status === 'vervallen' || isOverdue(inv);
            if (statusFilter === 'openstaand') return inv.status !== 'betaald' && !isOverdue(inv) && inv.status !== 'concept';
            return true;
        });
    }, [invoices, statusFilter]);

    const summary: InvoiceSummary = useMemo(() => getInvoiceSummary(invoices), [invoices]);

    const STATUS_FILTER_OPTIONS: { key: StatusFilter; label: string }[] = [
        { key: 'alle', label: 'Alle' },
        { key: 'openstaand', label: 'Openstaand' },
        { key: 'betaald', label: 'Betaald' },
        { key: 'vervallen', label: 'Vervallen' },
    ];

    if (loading) {
        return (
            <div className="py-20 text-center">
                <p className="text-duck-muted text-sm animate-pulse">Facturen laden...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Foutmelding */}
            {error && (
                <div className="flex items-center gap-2 text-white bg-duck-coral border border-duck-coral rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={16} />
                    {error}
                    <button
                        onClick={() => setError('')}
                        className="ml-auto text-duck-coral hover:text-duck-coral font-bold text-xs"
                    >
                        Sluiten
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Openstaand"
                    value={formatEuro(summary.unpaid - summary.overdue)}
                    color="bg-duck-acid border-duck-acid text-duck-ink"
                    icon={<Clock size={16} className="text-duck-muted" />}
                />
                <StatCard
                    label="Betaald dit jaar"
                    value={formatEuro(summary.paid)}
                    color="bg-duck-ink border-duck-ink text-duck-ink"
                    icon={<Check size={16} className="text-duck-muted" />}
                />
                <StatCard
                    label="Vervallen"
                    value={formatEuro(summary.overdue)}
                    color="bg-duck-coral border-duck-coral text-duck-coral"
                    icon={<AlertCircle size={16} className="text-duck-muted" />}
                />
                <StatCard
                    label="BTW ontvangen"
                    value={formatEuro(summary.vatCollected)}
                    color="bg-duck-coral border-duck-coral text-duck-coral"
                    icon={<Euro size={16} className="text-duck-muted" />}
                />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={openNewModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-duck-coral text-white rounded-xl font-bold text-sm hover:bg-duck-coral hover:text-white transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Nieuwe Factuur
                </button>

                {/* Status filter */}
                <div className="flex items-center gap-1 bg-duck-bg rounded-xl p-1">
                    {STATUS_FILTER_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setStatusFilter(opt.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                statusFilter === opt.key
                                    ? 'bg-white text-duck-coral shadow-sm'
                                    : 'text-duck-muted hover:text-duck-muted'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <span className="ml-auto text-xs text-duck-muted font-medium">
                    {filtered.length} factuur{filtered.length !== 1 ? 'en' : ''}
                </span>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-[2rem] border border-duck-line shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <FileText size={32} className="mx-auto text-duck-muted mb-3" />
                        <p className="text-duck-muted text-sm italic">
                            {invoices.length === 0
                                ? `Geen facturen gevonden voor ${year}.`
                                : 'Geen facturen voor dit filter.'}
                        </p>
                        {invoices.length === 0 && (
                            <p className="text-duck-muted text-xs mt-1">
                                Maak je eerste factuur aan via de knop hierboven.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-duck-line">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Nr</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Klant</th>
                                    <th className="text-left px-4 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Datum</th>
                                    <th className="text-left px-4 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Verval</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Bedrag</th>
                                    <th className="text-left px-4 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-duck-muted uppercase tracking-widest text-right">Acties</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(invoice => {
                                    const overdue = isOverdue(invoice);
                                    const isLoadingThis = actionLoading === invoice.id;

                                    return (
                                        <tr
                                            key={invoice.id}
                                            className="hover:bg-duck-bg transition-colors group cursor-pointer"
                                            onClick={() => setSelectedInvoice(invoice)}
                                        >
                                            {/* Factuurnummer */}
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-bold text-duck-coral">
                                                    {invoice.invoice_number}
                                                </span>
                                            </td>

                                            {/* Klant */}
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-duck-ink text-sm">{invoice.client_name}</p>
                                                {invoice.client_email && (
                                                    <p className="text-[10px] text-duck-muted">{invoice.client_email}</p>
                                                )}
                                            </td>

                                            {/* Datum */}
                                            <td className="px-4 py-4 text-xs text-duck-muted whitespace-nowrap">
                                                {formatDateShort(invoice.issue_date)}
                                            </td>

                                            {/* Verval */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {invoice.due_date ? (
                                                    <span className={`text-xs ${overdue ? 'text-duck-coral font-bold' : 'text-duck-muted'}`}>
                                                        {formatDateShort(invoice.due_date)}
                                                        {overdue && <span className="ml-1">(!)</span>}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-duck-muted">—</span>
                                                )}
                                            </td>

                                            {/* Bedrag */}
                                            <td className="px-6 py-4 text-right font-black text-sm whitespace-nowrap text-duck-ink">
                                                {formatEuro(invoice.total)}
                                            </td>

                                            {/* Status badge */}
                                            <td className="px-4 py-4">
                                                <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${STATUS_COLORS[invoice.status]}`}>
                                                    {STATUS_LABELS[invoice.status]}
                                                </span>
                                            </td>

                                            {/* Acties */}
                                            <td
                                                className="px-4 py-4"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Preview */}
                                                    <button
                                                        onClick={() => setSelectedInvoice(invoice)}
                                                        title="Bekijk factuur"
                                                        className="p-1.5 text-duck-muted hover:text-duck-coral hover:bg-duck-coral hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Eye size={14} />
                                                    </button>

                                                    {/* PDF download */}
                                                    <button
                                                        onClick={() => handleDownloadPDF(invoice)}
                                                        title="Download PDF"
                                                        className="p-1.5 text-duck-muted hover:text-duck-coral hover:bg-duck-coral hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Download size={14} />
                                                    </button>

                                                    {/* Markeer als verzonden (alleen concept) */}
                                                    {invoice.status === 'concept' && (
                                                        <button
                                                            onClick={() => handleMarkVerzonden(invoice)}
                                                            disabled={isLoadingThis}
                                                            title="Markeer als verzonden"
                                                            className="p-1.5 text-duck-muted hover:text-duck-ink hover:bg-duck-ink hover:text-white rounded-lg transition-all disabled:opacity-50"
                                                        >
                                                            <Send size={14} />
                                                        </button>
                                                    )}

                                                    {/* Markeer als betaald (alleen verzonden) */}
                                                    {invoice.status === 'verzonden' && (
                                                        <button
                                                            onClick={() => handleMarkBetaald(invoice)}
                                                            disabled={isLoadingThis}
                                                            title="Markeer als betaald"
                                                            className="p-1.5 text-duck-muted hover:text-duck-ink hover:bg-duck-ink hover:text-white rounded-lg transition-all disabled:opacity-50"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}

                                                    {/* Verwijderen (alleen concept) */}
                                                    {invoice.status === 'concept' && (
                                                        <button
                                                            onClick={() => handleDelete(invoice)}
                                                            disabled={isLoadingThis}
                                                            title="Verwijder factuur"
                                                            className="p-1.5 text-duck-muted hover:text-duck-muted hover:bg-duck-coral hover:text-white rounded-lg transition-all disabled:opacity-50"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Totaalregel */}
            {filtered.length > 0 && (
                <div className="flex justify-end gap-6 px-2 text-sm font-bold">
                    <span className="text-duck-muted">{filtered.length} facturen</span>
                    <span className="text-duck-muted">
                        Totaal: {formatEuro(filtered.reduce((s, inv) => s + inv.total, 0))}
                    </span>
                </div>
            )}

            {/* Nieuwe Factuur Modal */}
            {showNewModal && (
                <NewInvoiceModal
                    userId={userId}
                    nextInvoiceNumber={nextInvoiceNumber}
                    onSave={handleSaveInvoice}
                    onClose={() => setShowNewModal(false)}
                />
            )}

            {/* Factuur Detail Modal */}
            {selectedInvoice && (
                <InvoiceDetailModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                    onDownloadPDF={handleDownloadPDF}
                />
            )}
        </div>
    );
}
