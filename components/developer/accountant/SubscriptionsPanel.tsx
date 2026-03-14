import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Plus, Trash2, X, AlertCircle, RefreshCw, Pause, Play, CreditCard, CalendarClock, Upload, Sparkles
} from 'lucide-react';
import {
    Subscription,
    SubscriptionFrequency,
    FREQUENCY_LABELS,
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    generateMissingTransactions,
    calculateMonthlyTotal,
    calculateYearlyTotal,
} from '../../../services/accountantSubscriptionsService';
import {
    TransactionCategory,
    EXPENSE_CATEGORIES,
    CATEGORY_LABELS,
    formatEuro,
    formatDate,
    scanSubscriptionWithClaude,
} from '../../../services/accountantService';

interface SubscriptionsPanelProps {
    userId: string;
    onRefresh: () => void;
}

interface SubForm {
    name: string;
    supplier: string;
    amount: string;
    vatAmount: string;
    vatRate: 0 | 9 | 21;
    category: TransactionCategory;
    frequency: SubscriptionFrequency;
    startDate: string;
    endDate: string;
    notes: string;
}

const emptyForm = (): SubForm => ({
    name:      '',
    supplier:  '',
    amount:    '',
    vatAmount: '',
    vatRate:   21,
    category:  'automatisering',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate:   '',
    notes:     '',
});

export function SubscriptionsPanel({ userId, onRefresh }: SubscriptionsPanelProps) {
    const [subs, setSubs]               = useState<Subscription[]>([]);
    const [loading, setLoading]         = useState(true);
    const [showForm, setShowForm]       = useState(false);
    const [saving, setSaving]           = useState(false);
    const [generating, setGenerating]   = useState(false);
    const [error, setError]             = useState('');
    const [genResult, setGenResult]     = useState<number | null>(null);
    const [form, setForm]               = useState<SubForm>(emptyForm());
    const [scanning, setScanning]       = useState(false);
    const fileInputRef                  = useRef<HTMLInputElement>(null);

    async function handleScanScreenshot(file: File) {
        setScanning(true);
        setError('');
        try {
            const result = await scanSubscriptionWithClaude(file);
            setForm(f => ({
                ...f,
                name:      result.name || f.name,
                supplier:  result.supplier || f.supplier,
                amount:    result.amount ? String(result.amount) : f.amount,
                vatAmount: result.vatAmount ? String(result.vatAmount) : f.vatAmount,
                vatRate:   result.vatRate ?? f.vatRate,
                category:  (EXPENSE_CATEGORIES.includes(result.category as TransactionCategory) ? result.category : f.category) as TransactionCategory,
                frequency: (['monthly', 'quarterly', 'yearly'].includes(result.frequency) ? result.frequency : f.frequency) as SubscriptionFrequency,
                startDate: result.startDate || f.startDate,
                notes:     result.notes || f.notes,
            }));
        } catch (e: any) {
            setError(e.message || 'Screenshot scannen mislukt.');
        } finally {
            setScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    const loadSubs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSubscriptions(userId);
            setSubs(data);
        } catch (e: any) {
            setError(e.message || 'Laden mislukt.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { loadSubs(); }, [loadSubs]);

    // ESC sluit formulier
    useEffect(() => {
        if (!showForm) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') { setShowForm(false); setError(''); }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showForm]);

    async function handleSave() {
        if (!form.name || !form.amount || !form.startDate) {
            setError('Naam, bedrag en startdatum zijn verplicht.');
            return;
        }
        const amount = parseFloat(form.amount.replace(',', '.'));
        if (isNaN(amount) || amount <= 0) {
            setError('Voer een geldig bedrag in.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await createSubscription({
                user_id:    userId,
                name:       form.name,
                supplier:   form.supplier || undefined,
                amount,
                vat_amount: parseFloat(form.vatAmount.replace(',', '.')) || 0,
                vat_rate:   form.vatRate,
                category:   form.category,
                frequency:  form.frequency,
                start_date: form.startDate,
                end_date:   form.endDate || null,
                is_active:  true,
                notes:      form.notes || undefined,
            });
            setShowForm(false);
            setForm(emptyForm());
            loadSubs();
        } catch (e: any) {
            setError(e.message || 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleActive(sub: Subscription) {
        if (!sub.id) return;
        try {
            await updateSubscription(sub.id, { is_active: !sub.is_active });
            loadSubs();
        } catch (e: any) {
            setError(e.message || 'Bijwerken mislukt.');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Abonnement verwijderen? Bestaande transacties blijven behouden.')) return;
        try {
            await deleteSubscription(id);
            loadSubs();
        } catch (e: any) {
            setError(e.message || 'Verwijderen mislukt.');
        }
    }

    async function handleGenerate() {
        setGenerating(true);
        setGenResult(null);
        setError('');
        try {
            const count = await generateMissingTransactions(userId);
            setGenResult(count);
            if (count > 0) onRefresh();
            loadSubs();
        } catch (e: any) {
            setError(e.message || 'Genereren mislukt.');
        } finally {
            setGenerating(false);
        }
    }

    const activeSubs = subs.filter(s => s.is_active);
    const inactiveSubs = subs.filter(s => !s.is_active);
    const monthlyTotal = calculateMonthlyTotal(subs);
    const yearlyTotal = calculateYearlyTotal(subs);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && !showForm && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={16} />
                    {error}
                    <button onClick={() => setError('')} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
                        <X size={12} />
                    </button>
                </div>
            )}

            {genResult !== null && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm">
                    <RefreshCw size={16} />
                    <span className="font-bold">
                        {genResult === 0
                            ? 'Alle transacties zijn up-to-date, niks te genereren.'
                            : `${genResult} transactie${genResult > 1 ? 's' : ''} automatisch aangemaakt.`}
                    </span>
                    <button onClick={() => setGenResult(null)} className="ml-auto p-1 hover:bg-emerald-100 rounded-lg">
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Abonnement toevoegen
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={generating || activeSubs.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
                    {generating ? 'Genereren...' : 'Transacties genereren'}
                </button>

                {/* Totalen */}
                {activeSubs.length > 0 && (
                    <div className="ml-auto flex gap-4 text-sm">
                        <span className="text-slate-400">
                            <span className="font-bold text-slate-600">{formatEuro(monthlyTotal)}</span>/maand
                        </span>
                        <span className="text-slate-400">
                            <span className="font-bold text-slate-600">{formatEuro(yearlyTotal)}</span>/jaar
                        </span>
                    </div>
                )}
            </div>

            {/* Lijst */}
            {subs.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-200 py-16 text-center">
                    <CreditCard size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm italic">Nog geen abonnementen toegevoegd.</p>
                    <p className="text-slate-400 text-xs mt-1">
                        Voeg abonnementen toe zoals Claude, Vercel, hosting, etc.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeSubs.map(sub => (
                        <SubscriptionCard
                            key={sub.id}
                            sub={sub}
                            onToggle={() => handleToggleActive(sub)}
                            onDelete={() => sub.id && handleDelete(sub.id)}
                        />
                    ))}
                    {inactiveSubs.length > 0 && (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">
                                Gepauzeerd ({inactiveSubs.length})
                            </p>
                            {inactiveSubs.map(sub => (
                                <SubscriptionCard
                                    key={sub.id}
                                    sub={sub}
                                    onToggle={() => handleToggleActive(sub)}
                                    onDelete={() => sub.id && handleDelete(sub.id)}
                                />
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Modal: abonnement toevoegen */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Abonnement Toevoegen</h3>
                            <button onClick={() => { setShowForm(false); setError(''); }} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* AI Screenshot Scanner */}
                        <div className="mb-5">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleScanScreenshot(file);
                                }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={scanning}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all disabled:opacity-60 disabled:cursor-wait"
                            >
                                {scanning ? (
                                    <>
                                        <Sparkles size={16} className="animate-pulse text-indigo-500" />
                                        <span className="text-indigo-600">Claude AI scant bestand...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Upload screenshot of PDF — Claude AI vult velden in
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-slate-400 mt-1 text-center">
                                JPEG, PNG, WebP, GIF of PDF — max 10 MB
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-4 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Naam */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Naam *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Claude Pro, Vercel Pro, Netlify..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Leverancier */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Leverancier</label>
                                <input
                                    type="text"
                                    value={form.supplier}
                                    onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}
                                    placeholder="Anthropic, Vercel Inc..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Bedrag + BTW */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bedrag excl. BTW *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.amount}
                                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">BTW-bedrag</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.vatAmount}
                                        onChange={e => setForm(f => ({ ...f, vatAmount: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                            </div>

                            {/* BTW-tarief */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">BTW-tarief</label>
                                <div className="flex gap-2">
                                    {([0, 9, 21] as const).map(rate => (
                                        <button
                                            key={rate}
                                            onClick={() => setForm(f => ({ ...f, vatRate: rate, vatAmount: rate === 0 ? '0' : f.vatAmount }))}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${form.vatRate === rate
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                                {form.vatRate === 0 && (
                                    <div className="flex items-start gap-2 mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                        <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-amber-700 leading-relaxed">
                                            <strong>BTW verlegd:</strong> Bij buitenlandse SaaS-diensten (Claude, Vercel, GitHub, AWS, Google) betaal je 0% BTW.
                                            De BTW wordt verlegd naar jou als afnemer — vermeld dit op je BTW-aangifte.
                                        </p>
                                    </div>
                                )}
                                {form.vatRate > 0 && (
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Nederlandse diensten: 21% standaard, 9% laag tarief. Buitenlandse SaaS = 0% verlegd.
                                    </p>
                                )}
                            </div>

                            {/* Frequentie */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Frequentie</label>
                                <div className="flex gap-2">
                                    {(['monthly', 'quarterly', 'yearly'] as const).map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setForm(f => ({ ...f, frequency: freq }))}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${form.frequency === freq
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {FREQUENCY_LABELS[freq]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categorie */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categorie</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value as TransactionCategory }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    {EXPENSE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Startdatum */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Startdatum *</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Einddatum</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Leeg = doorlopend</p>
                                </div>
                            </div>

                            {/* Notities */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Notities</label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Bijv. betaald via creditcard, jaarcontract..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowForm(false); setError(''); }}
                                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleSave}
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

// ===========================================================================
// Subcomponent: kaart per abonnement
// ===========================================================================

function SubscriptionCard({
    sub,
    onToggle,
    onDelete,
}: {
    sub: Subscription;
    onToggle: () => void;
    onDelete: () => void;
}) {
    const totalAmount = sub.amount + sub.vat_amount;

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 group transition-opacity ${!sub.is_active ? 'opacity-50' : ''}`}>
            {/* Icoon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sub.is_active ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <CreditCard size={18} className={sub.is_active ? 'text-indigo-600' : 'text-slate-400'} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 text-sm truncate">{sub.name}</p>
                    {sub.supplier && (
                        <span className="text-[10px] text-slate-400">{sub.supplier}</span>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-bold">
                        {CATEGORY_LABELS[sub.category] || sub.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CalendarClock size={10} />
                        {FREQUENCY_LABELS[sub.frequency]}
                    </span>
                    {sub.last_generated && (
                        <span className="text-[10px] text-slate-400">
                            Laatst: {formatDate(sub.last_generated)}
                        </span>
                    )}
                </div>
            </div>

            {/* Bedrag */}
            <div className="text-right shrink-0">
                <p className="font-black text-slate-900 text-sm">{formatEuro(totalAmount)}</p>
                {sub.vat_amount > 0 && (
                    <p className="text-[10px] text-slate-400">
                        {formatEuro(sub.vat_amount)} BTW ({sub.vat_rate}%)
                    </p>
                )}
            </div>

            {/* Acties */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={onToggle}
                    title={sub.is_active ? 'Pauzeren' : 'Heractiveren'}
                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                    {sub.is_active ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
