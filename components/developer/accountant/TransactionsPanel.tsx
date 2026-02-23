import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    Plus, Upload, Trash2, ChevronDown, ChevronUp, X, Check, AlertCircle, Briefcase
} from 'lucide-react';
import {
    AccountantTransaction,
    TransactionCategory,
    CATEGORY_LABELS,
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    importBankCSV,
    formatEuro,
    formatDate,
} from '../../../services/accountantService';

interface TransactionsPanelProps {
    transactions: AccountantTransaction[];
    userId: string;
    year: number;
    onRefresh: () => void;
}

type SortKey = 'date' | 'amount' | 'category';
type BankType = 'ing' | 'rabobank' | 'abn' | 'generic';
type FilterPrivacy = 'alle' | 'zakelijk' | 'prive';

const BANK_OPTIONS: { id: BankType; label: string }[] = [
    { id: 'ing',      label: 'ING Bank' },
    { id: 'rabobank', label: 'Rabobank' },
    { id: 'abn',      label: 'ABN AMRO' },
    { id: 'generic',  label: 'Overige bank (CSV)' },
];

export function TransactionsPanel({ transactions, userId, year, onRefresh }: TransactionsPanelProps) {
    const [showAddModal, setShowAddModal]   = useState(false);
    const [showImport, setShowImport]       = useState(false);
    const [sortKey, setSortKey]             = useState<SortKey>('date');
    const [sortAsc, setSortAsc]             = useState(false);
    const [filterCat, setFilterCat]         = useState<string>('alle');
    const [filterType, setFilterType]       = useState<'alle' | 'inkomst' | 'uitgave'>('alle');
    const [filterPrivacy, setFilterPrivacy] = useState<FilterPrivacy>('alle');
    const [saving, setSaving]               = useState(false);
    const [error, setError]                 = useState('');
    const [importBank, setImportBank]       = useState<BankType>('ing');
    const [importing, setImporting]         = useState(false);
    const [importResult, setImportResult]   = useState<{ imported: number; skipped: number } | null>(null);
    const [importError, setImportError]     = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    // ESC sluit de modal
    useEffect(() => {
        if (!showAddModal) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') { setShowAddModal(false); setError(''); }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showAddModal]);

    // Formulier state
    const [form, setForm] = useState({
        date:        new Date().toISOString().split('T')[0],
        amount:      '',
        type:        'uitgave' as 'inkomst' | 'uitgave',
        description: '',
        category:    'overig' as TransactionCategory,
        is_private:  false,
        km_distance: '',
    });

    // Filteren en sorteren (useMemo voorkomt overbodige herberekeningen)
    const filtered = useMemo(() => transactions
        .filter(t => filterCat === 'alle' || t.category === filterCat)
        .filter(t => {
            if (filterType === 'inkomst') return t.amount > 0;
            if (filterType === 'uitgave') return t.amount < 0;
            return true;
        })
        .filter(t => {
            if (filterPrivacy === 'zakelijk') return t.is_private === false || t.is_private === undefined;
            if (filterPrivacy === 'prive')    return t.is_private === true;
            return true;
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortKey === 'date')     cmp = a.date.localeCompare(b.date);
            if (sortKey === 'amount')   cmp = Math.abs(a.amount) - Math.abs(b.amount);
            if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
            return sortAsc ? cmp : -cmp;
        }), [transactions, filterCat, filterType, filterPrivacy, sortKey, sortAsc]);

    function toggleSort(key: SortKey) {
        if (sortKey === key) setSortAsc(!sortAsc);
        else { setSortKey(key); setSortAsc(false); }
    }

    async function handleAdd() {
        if (!form.date || !form.amount || !form.description) {
            setError('Vul alle verplichte velden in.');
            return;
        }
        const rawAmount = parseFloat(form.amount.replace(',', '.'));
        if (isNaN(rawAmount) || rawAmount <= 0) {
            setError('Voer een geldig bedrag in.');
            return;
        }

        const kmRaw = form.km_distance !== '' ? parseFloat(form.km_distance) : undefined;
        const km_distance = kmRaw !== undefined && !isNaN(kmRaw) && kmRaw >= 0 ? kmRaw : undefined;

        setSaving(true);
        setError('');
        try {
            await createTransaction({
                user_id:       userId,
                date:          form.date,
                amount:        form.type === 'uitgave' ? -rawAmount : rawAmount,
                description:   form.description,
                category:      form.category,
                imported_from: 'manual',
                is_private:    form.is_private,
                ...(km_distance !== undefined ? { km_distance } : {}),
            } as Omit<AccountantTransaction, 'id' | 'created_at'>);
            setShowAddModal(false);
            setForm({
                date:        new Date().toISOString().split('T')[0],
                amount:      '',
                type:        'uitgave',
                description: '',
                category:    'overig',
                is_private:  false,
                km_distance: '',
            });
            onRefresh();
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message || 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Transactie verwijderen?')) return;
        try {
            await deleteTransaction(id);
            onRefresh();
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message || 'Verwijderen mislukt.');
            setShowAddModal(false);
        }
    }

    async function handleTogglePrivacy(tx: AccountantTransaction) {
        if (!tx.id) return;
        try {
            await updateTransaction(tx.id, { is_private: !tx.is_private });
            onRefresh();
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message || 'Bijwerken mislukt.');
        }
    }

    async function handleImport(file: File) {
        setImporting(true);
        setImportResult(null);
        setImportError('');
        try {
            const result = await importBankCSV(file, importBank, userId);
            setImportResult(result);
            onRefresh();
        } catch (e: unknown) {
            const err = e as Error;
            setImportError(err.message || 'Importeren mislukt.');
        } finally {
            setImporting(false);
        }
    }

    const categories = ['alle', ...Object.keys(CATEGORY_LABELS)];

    return (
        <div className="space-y-6">
            {/* Foutmelding buiten modal (bijv. verwijder-fout of privacy-fout) */}
            {error && !showAddModal && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={16} />
                    {error}
                    <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Toevoegen
                </button>
                <button
                    onClick={() => setShowImport(!showImport)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                    <Upload size={16} />
                    CSV Importeren
                </button>

                {/* Filters */}
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value as 'alle' | 'inkomst' | 'uitgave')}
                    className="ml-auto px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    <option value="alle">Alle types</option>
                    <option value="inkomst">Inkomsten</option>
                    <option value="uitgave">Uitgaven</option>
                </select>

                <select
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>
                            {c === 'alle' ? 'Alle categorieën' : CATEGORY_LABELS[c as TransactionCategory]}
                        </option>
                    ))}
                </select>

                <select
                    value={filterPrivacy}
                    onChange={e => setFilterPrivacy(e.target.value as FilterPrivacy)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    <option value="alle">Zakelijk & Privé</option>
                    <option value="zakelijk">Alleen Zakelijk</option>
                    <option value="prive">Alleen Privé</option>
                </select>
            </div>

            {/* CSV Import panel */}
            {showImport && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-slate-800">Bankafschrift importeren</h4>
                    <div className="flex flex-wrap gap-2">
                        {BANK_OPTIONS.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setImportBank(b.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${importBank === b.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>
                    <div
                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleImport(file);
                        }}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".csv,.txt"
                            className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
                        />
                        {importing ? (
                            <p className="text-indigo-600 font-bold animate-pulse">Importeren...</p>
                        ) : (
                            <>
                                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-600 font-medium">
                                    Sleep je CSV-bestand hierheen of klik om te selecteren
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Download het bestand via Mijn {BANK_OPTIONS.find(b => b.id === importBank)?.label} → Transacties exporteren
                                </p>
                            </>
                        )}
                    </div>
                    {importResult && (
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
                            <Check size={16} />
                            <span className="text-sm font-bold">
                                {importResult.imported} transacties geïmporteerd
                                {importResult.skipped > 0 && ` (${importResult.skipped} overgeslagen als duplicaat)`}
                            </span>
                        </div>
                    )}
                    {importError && (
                        <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-4 py-3">
                            <AlertCircle size={16} />
                            <span className="text-sm font-bold">{importError}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Tabel */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-400 text-sm italic">Geen transacties gevonden voor {year}.</p>
                        <p className="text-slate-400 text-xs mt-1">Voeg een transactie toe of importeer een bankafschrift.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th
                                        className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort('date')}
                                    >
                                        <span className="flex items-center gap-1">
                                            Datum {sortKey === 'date' && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Omschrijving
                                    </th>
                                    <th
                                        className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort('category')}
                                    >
                                        <span className="flex items-center gap-1">
                                            Categorie {sortKey === 'category' && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Type
                                    </th>
                                    <th
                                        className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort('amount')}
                                    >
                                        <span className="flex items-center justify-end gap-1">
                                            Bedrag {sortKey === 'amount' && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th className="px-4 py-4 w-10" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(tx => {
                                    const isPrivate = tx.is_private === true;
                                    return (
                                        <tr
                                            key={tx.id}
                                            className={`hover:bg-slate-50 transition-colors group ${isPrivate ? 'opacity-60' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                                                {formatDate(tx.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-800 text-xs">{tx.description}</span>
                                                {tx.imported_from && tx.imported_from !== 'manual' && (
                                                    <span className="ml-2 text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase font-bold">
                                                        {tx.imported_from}
                                                    </span>
                                                )}
                                                {tx.km_distance !== undefined && tx.km_distance !== null && (
                                                    <span className="ml-2 text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">
                                                        {tx.km_distance} km
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold">
                                                    {CATEGORY_LABELS[tx.category] || tx.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleTogglePrivacy(tx)}
                                                    title={isPrivate ? 'Klik om zakelijk te maken' : 'Klik om privé te maken'}
                                                    className="focus:outline-none"
                                                >
                                                    {isPrivate ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                                                            privé
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                                                            <Briefcase size={10} />
                                                            zakelijk
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-black text-sm whitespace-nowrap ${tx.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {tx.amount >= 0 ? '+' : ''}{formatEuro(tx.amount)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => tx.id && handleDelete(tx.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
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
                    <span className="text-slate-400">{filtered.length} transacties</span>
                    <span className={filtered.reduce((s, t) => s + t.amount, 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                        Saldo: {formatEuro(filtered.reduce((s, t) => s + t.amount, 0))}
                    </span>
                </div>
            )}

            {/* Modal: transactie toevoegen */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Transactie Toevoegen</h3>
                            <button onClick={() => { setShowAddModal(false); setError(''); }} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-4 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Type */}
                            <div className="flex rounded-xl overflow-hidden border border-slate-200">
                                {(['inkomst', 'uitgave'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setForm(f => ({
                                                ...f,
                                                type,
                                                category: type === 'inkomst' ? 'omzet' : 'overig'
                                            }));
                                        }}
                                        className={`flex-1 py-2.5 text-sm font-bold capitalize transition-colors ${form.type === type
                                            ? type === 'inkomst' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                            : 'bg-white text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Datum */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Datum</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Bedrag */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bedrag (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0,00"
                                    value={form.amount}
                                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Omschrijving */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Omschrijving</label>
                                <input
                                    type="text"
                                    placeholder="Bijv. Factuur #001, Kantoorbenodigdheden..."
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Categorie */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categorie</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value as TransactionCategory }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    {(form.type === 'inkomst' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Kilometerveld (alleen bij reiskosten) */}
                            {form.category === 'reiskosten' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                                        Kilometers (km)
                                    </label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        placeholder="Bijv. 42"
                                        value={form.km_distance}
                                        onChange={e => setForm(f => ({ ...f, km_distance: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                        €0,23/km aftrekbaar. Vul in voor administratie.
                                    </p>
                                </div>
                            )}

                            {/* Privé toggle */}
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${form.is_private
                                ? 'bg-slate-50 border-slate-200 border-dashed'
                                : 'bg-blue-50 border-blue-100'
                                }`}>
                                <div>
                                    <p className={`text-sm font-bold ${form.is_private ? 'text-slate-400 line-through decoration-dotted' : 'text-blue-700'}`}>
                                        {form.is_private ? 'Privé transactie' : 'Zakelijke transactie'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        {form.is_private
                                            ? 'Niet aftrekbaar voor de belasting'
                                            : 'Telt mee als zakelijke kosten of omzet'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={form.is_private}
                                        onChange={e => setForm(f => ({ ...f, is_private: e.target.checked }))}
                                    />
                                    <div className="w-10 h-6 bg-blue-500 peer-checked:bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowAddModal(false); setError(''); }}
                                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={saving}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? 'Opslaan...' : 'Opslaan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
