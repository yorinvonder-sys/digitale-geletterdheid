import React, { useState, useRef, useEffect } from 'react';
import {
    Upload, Sparkles, X, Check, AlertCircle, Trash2, ImageIcon, FileText
} from 'lucide-react';
import {
    AccountantReceipt,
    ScannedReceiptData,
    TransactionCategory,
    CATEGORY_LABELS,
    EXPENSE_CATEGORIES,
    uploadAndScanReceipt,
    uploadReceiptImage,
    saveReceipt,
    deleteReceipt,
    formatEuro,
    formatDate,
} from '../../../services/accountantService';

interface ReceiptsPanelProps {
    receipts: AccountantReceipt[];
    userId: string;
    onRefresh: () => void;
}

interface ReceiptForm {
    supplier: string;
    date: string;
    amount: string;
    vatAmount: string;
    vatRate: 0 | 9 | 21;
    description: string;
    category: TransactionCategory;
}

const emptyForm = (): ReceiptForm => ({
    supplier:    '',
    date:        new Date().toISOString().split('T')[0],
    amount:      '',
    vatAmount:   '',
    vatRate:     21,
    description: '',
    category:    'overig',
});

export function ReceiptsPanel({ receipts, userId, onRefresh }: ReceiptsPanelProps) {
    const [scanning,    setScanning]    = useState(false);
    const [saving,      setSaving]      = useState(false);
    const [error,       setError]       = useState('');
    const [form,        setForm]        = useState<ReceiptForm | null>(null);
    const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [scanSuccess, setScanSuccess] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Revoke object URL bij wisselen of unmount om memory-leak te voorkomen
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function handleFile(file: File) {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Alleen afbeeldingen (JPG, PNG, WEBP) zijn toegestaan.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Bestand te groot (max 10 MB).');
            return;
        }
        setError('');
        setUploadedFile(file);
        if (file.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
        setForm(emptyForm());
        scanFile(file);
    }

    async function scanFile(file: File) {
        setScanning(true);
        setScanSuccess(false);
        setError('');
        try {
            const data: ScannedReceiptData = await uploadAndScanReceipt(file, userId);
            setScanSuccess(true);
            setForm({
                supplier:    data.supplier,
                date:        data.date,
                amount:      data.amount > 0 ? String(data.amount) : '',
                vatAmount:   data.vatAmount > 0 ? String(data.vatAmount) : '',
                vatRate:     data.vatRate,
                description: data.description,
                category:    data.category as TransactionCategory || 'overig',
            });
        } catch (e: any) {
            setError(e.message || 'Scannen mislukt. Vul de gegevens handmatig in.');
            setForm(emptyForm());
        } finally {
            setScanning(false);
        }
    }

    async function handleSave() {
        if (!form) return;
        if (!form.date || !form.amount) {
            setError('Datum en bedrag zijn verplicht.');
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
            let imageUrl: string | undefined;
            if (uploadedFile && uploadedFile.type.startsWith('image/')) {
                imageUrl = await uploadReceiptImage(uploadedFile, userId);
            }

            await saveReceipt({
                user_id:     userId,
                image_url:   imageUrl,
                supplier:    form.supplier || undefined,
                date:        form.date,
                amount,
                vat_amount:  parseFloat(form.vatAmount.replace(',', '.')) || 0,
                vat_rate:    form.vatRate,
                description: form.description || undefined,
                category:    form.category,
                ai_scanned:  scanSuccess,
            });

            setForm(null);
            setPreviewUrl(null);
            setUploadedFile(null);
            setScanSuccess(false);
            onRefresh();
        } catch (e: any) {
            setError(e.message || 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string, imageUrl?: string) {
        if (!confirm('Bonnetje verwijderen?')) return;
        try {
            await deleteReceipt(id, imageUrl);
            onRefresh();
        } catch (e: any) {
            setError(e.message || 'Verwijderen mislukt.');
        }
    }

    function handleReset() {
        setForm(null);
        setPreviewUrl(null);
        setUploadedFile(null);
        setScanSuccess(false);
        setError('');
        if (fileRef.current) fileRef.current.value = '';
    }

    return (
        <div className="space-y-8">
            {/* Foutmelding buiten formulier (bijv. van handleDelete) */}
            {error && !form && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}
            {/* Upload zone OF formulier */}
            {!form ? (
                <div
                    ref={dropRef}
                    className="border-2 border-dashed border-slate-300 rounded-[2rem] p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleFile(file);
                    }}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    />
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                        <Upload size={28} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Bonnetje uploaden</h3>
                    <p className="text-sm text-slate-500">
                        Sleep een foto van je bonnetje hierheen of klik om te selecteren
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        JPG, PNG, WEBP — max 10 MB — Gemini AI scant automatisch
                    </p>
                </div>
            ) : (
                /* Scan resultaat + formulier */
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Preview */}
                        <div className="bg-slate-50 p-8 flex flex-col items-center justify-center min-h-64">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Bonnetje preview"
                                    className="max-h-80 object-contain rounded-xl shadow-md"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <FileText size={48} className="text-slate-300" />
                                    <p className="text-sm text-slate-400">{uploadedFile?.name}</p>
                                </div>
                            )}
                            {scanning && (
                                <div className="mt-4 flex items-center gap-2 text-indigo-600 bg-indigo-50 rounded-xl px-4 py-2">
                                    <Sparkles size={16} className="animate-pulse" />
                                    <span className="text-xs font-bold animate-pulse">AI scant bonnetje...</span>
                                </div>
                            )}
                            {scanSuccess && !scanning && (
                                <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-xl px-4 py-2">
                                    <Check size={16} />
                                    <span className="text-xs font-bold">Automatisch uitgelezen</span>
                                </div>
                            )}
                        </div>

                        {/* Formulier */}
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">Gegevens controleren</h3>
                                <button onClick={handleReset} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X size={18} className="text-slate-400" />
                                </button>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-3 py-2 text-xs">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}

                            {/* Leverancier */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leverancier</label>
                                <input
                                    type="text"
                                    value={form.supplier}
                                    onChange={e => setForm(f => f ? { ...f, supplier: e.target.value } : f)}
                                    placeholder="Albert Heijn, Coolblue..."
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Datum */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Datum *</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => f ? { ...f, date: e.target.value } : f)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Bedrag + BTW */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Totaalbedrag (€) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.amount}
                                        onChange={e => setForm(f => f ? { ...f, amount: e.target.value } : f)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BTW-bedrag (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.vatAmount}
                                        onChange={e => setForm(f => f ? { ...f, vatAmount: e.target.value } : f)}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                            </div>

                            {/* BTW-tarief */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BTW-tarief</label>
                                <div className="flex gap-2">
                                    {([0, 9, 21] as const).map(rate => (
                                        <button
                                            key={rate}
                                            onClick={() => setForm(f => f ? { ...f, vatRate: rate } : f)}
                                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${form.vatRate === rate
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categorie */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categorie</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => f ? { ...f, category: e.target.value as TransactionCategory } : f)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    {EXPENSE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Omschrijving */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Omschrijving</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)}
                                    placeholder="Korte omschrijving van de aankoop"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Annuleren
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || scanning}
                                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {saving ? 'Opslaan...' : 'Opslaan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Galerij */}
            <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    Gescande Bonnetjes ({receipts.length})
                </h3>

                {receipts.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-slate-200 py-12 text-center">
                        <ImageIcon size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm italic">Nog geen bonnetjes opgeslagen.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {receipts.map(r => (
                            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                                {r.image_url ? (
                                    <div className="h-32 bg-slate-50 overflow-hidden">
                                        <img
                                            src={r.image_url}
                                            alt={r.supplier || 'Bonnetje'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-32 bg-slate-50 flex items-center justify-center">
                                        <FileText size={32} className="text-slate-300" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">
                                                {r.supplier || r.description || 'Onbekende leverancier'}
                                            </p>
                                            <p className="text-xs text-slate-400">{formatDate(r.date)}</p>
                                        </div>
                                        <button
                                            onClick={() => r.id && handleDelete(r.id, r.image_url)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold">
                                            {CATEGORY_LABELS[r.category] || r.category}
                                        </span>
                                        <span className="font-black text-slate-900 text-sm">
                                            {formatEuro(r.amount)}
                                        </span>
                                    </div>
                                    {r.ai_scanned && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Sparkles size={10} className="text-indigo-400" />
                                            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wide">AI gescand</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
