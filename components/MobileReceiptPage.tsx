/**
 * MobileReceiptPage — Standalone mobiele webapp voor bonnetjes scannen
 *
 * Toegankelijk via /bonnetje (auth-protected)
 * Geoptimaliseerd voor één-hand gebruik op telefoon:
 * - Grote camera-knop (opent direct de camera)
 * - Drag-drop of gallerij-keuze
 * - AI-scan via Gemini Vision
 * - Formulier invullen en opslaan
 * - Recente bonnetjes lijst
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Camera, Upload, Sparkles, Check, AlertCircle, X,
    ChevronLeft, Plus, Loader, Receipt, ArrowRight,
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
    getReceipts,
    formatEuro,
    formatDate,
} from '../services/accountantService';

interface MobileReceiptPageProps {
    userId: string;
    onNavigateHome?: () => void;
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

type Screen = 'home' | 'scan' | 'form' | 'success';

const emptyForm = (): ReceiptForm => ({
    supplier:    '',
    date:        new Date().toISOString().split('T')[0],
    amount:      '',
    vatAmount:   '',
    vatRate:     21,
    description: '',
    category:    'overig',
});

const CURRENT_YEAR = new Date().getFullYear();

export function MobileReceiptPage({ userId, onNavigateHome }: MobileReceiptPageProps) {
    const [screen,       setScreen]       = useState<Screen>('home');
    const [scanning,     setScanning]     = useState(false);
    const [saving,       setSaving]       = useState(false);
    const [error,        setError]        = useState('');
    const [form,         setForm]         = useState<ReceiptForm | null>(null);
    const [previewUrl,   setPreviewUrl]   = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [recentList,   setRecentList]   = useState<AccountantReceipt[]>([]);
    const [loadingList,  setLoadingList]  = useState(true);

    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    // Revoke object URL on cleanup
    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const loadRecent = useCallback(async () => {
        setLoadingList(true);
        try {
            const data = await getReceipts(userId, CURRENT_YEAR);
            setRecentList(data.slice(0, 10));
        } catch {
            // silent fail
        } finally {
            setLoadingList(false);
        }
    }, [userId]);

    useEffect(() => { loadRecent(); }, [loadRecent]);

    function handleFile(file: File) {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Alleen afbeeldingen en PDF zijn toegestaan.');
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setUploadedFile(file);
        setForm(emptyForm());
        setError('');
        setScreen('scan');
        handleScan(file);
    }

    async function handleScan(file: File) {
        setScanning(true);
        setError('');
        try {
            const data: ScannedReceiptData = await uploadAndScanReceipt(file, userId);
            setForm({
                supplier:    data.supplier,
                date:        data.date,
                amount:      data.amount.toString(),
                vatAmount:   data.vatAmount.toString(),
                vatRate:     data.vatRate,
                description: data.description,
                category:    data.category,
            });
            setScreen('form');
        } catch (e: unknown) {
            // Scan mislukt — toch formulier tonen zodat gebruiker handmatig kan invullen
            setError('AI-scan niet gelukt. Vul zelf in.');
            setForm(emptyForm());
            setScreen('form');
        } finally {
            setScanning(false);
        }
    }

    async function handleSave() {
        if (!form) return;
        setSaving(true);
        setError('');
        try {
            let imageUrl: string | undefined;
            if (uploadedFile) {
                imageUrl = await uploadReceiptImage(uploadedFile, userId);
            }
            await saveReceipt({
                user_id:    userId,
                image_url:  imageUrl,
                supplier:   form.supplier || undefined,
                date:       form.date,
                amount:     parseFloat(form.amount) || 0,
                vat_amount: parseFloat(form.vatAmount) || 0,
                vat_rate:   form.vatRate,
                description: form.description || undefined,
                category:   form.category,
                ai_scanned: !!(uploadedFile),
            });
            // Reset en terug naar home
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setUploadedFile(null);
            setForm(null);
            setScreen('success');
            await loadRecent();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setUploadedFile(null);
        setForm(null);
        setError('');
        setScreen('home');
    }

    // =========================================================================
    // SCREENS
    // =========================================================================

    if (screen === 'success') {
        return (
            <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} className="text-emerald-600" />
                </div>
                <h1 className="text-2xl font-black text-emerald-900 mb-2">Bonnetje opgeslagen!</h1>
                <p className="text-emerald-700 mb-8">Je bonnetje is succesvol gescand en opgeslagen in je boekhouding.</p>
                <button
                    onClick={handleReset}
                    className="w-full max-w-xs py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
                >
                    Nog een bonnetje
                </button>
                {onNavigateHome && (
                    <button
                        onClick={onNavigateHome}
                        className="mt-4 text-sm text-emerald-600 font-bold"
                    >
                        Naar dashboard
                    </button>
                )}
            </div>
        );
    }

    if (screen === 'scan') {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                {previewUrl && (
                    <div className="w-full max-w-sm mb-6 rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-2xl">
                        <img src={previewUrl} alt="Bonnetje preview" className="w-full object-contain max-h-64" />
                    </div>
                )}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <div>
                        <p className="text-white font-black text-xl">AI scant bonnetje...</p>
                        <p className="text-slate-400 text-sm mt-1">Gemini Vision analyseert je bonnetje</p>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'form' && form) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 z-10">
                    <button onClick={handleReset} className="p-2 rounded-xl hover:bg-slate-100">
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-black text-slate-900">Bonnetje controleren</h1>
                        {!scanning && !error && (
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={10} /> AI gescand — controleer de gegevens
                            </p>
                        )}
                        {error && (
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{error}</p>
                        )}
                    </div>
                    {previewUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                    {/* Leverancier */}
                    <FieldGroup label="Leverancier">
                        <input
                            type="text"
                            value={form.supplier}
                            onChange={e => setForm(f => f ? { ...f, supplier: e.target.value } : f)}
                            placeholder="Naam winkel / bedrijf"
                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </FieldGroup>

                    {/* Datum */}
                    <FieldGroup label="Datum">
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => setForm(f => f ? { ...f, date: e.target.value } : f)}
                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </FieldGroup>

                    {/* Bedragen */}
                    <div className="grid grid-cols-2 gap-3">
                        <FieldGroup label="Totaal (incl. BTW)">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.amount}
                                onChange={e => setForm(f => f ? { ...f, amount: e.target.value } : f)}
                                placeholder="0.00"
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                        </FieldGroup>
                        <FieldGroup label="BTW-tarief">
                            <select
                                value={form.vatRate}
                                onChange={e => setForm(f => f ? { ...f, vatRate: Number(e.target.value) as 0 | 9 | 21 } : f)}
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white appearance-none"
                            >
                                <option value={21}>21%</option>
                                <option value={9}>9%</option>
                                <option value={0}>0%</option>
                            </select>
                        </FieldGroup>
                    </div>

                    {/* BTW-bedrag */}
                    <FieldGroup label="BTW-bedrag">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.vatAmount}
                            onChange={e => setForm(f => f ? { ...f, vatAmount: e.target.value } : f)}
                            placeholder="0.00"
                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </FieldGroup>

                    {/* Categorie */}
                    <FieldGroup label="Categorie">
                        <select
                            value={form.category}
                            onChange={e => setForm(f => f ? { ...f, category: e.target.value as TransactionCategory } : f)}
                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white appearance-none"
                        >
                            {EXPENSE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                            ))}
                        </select>
                    </FieldGroup>

                    {/* Omschrijving */}
                    <FieldGroup label="Omschrijving (optioneel)">
                        <input
                            type="text"
                            value={form.description}
                            onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)}
                            placeholder="Korte omschrijving"
                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </FieldGroup>
                </div>

                {/* Sticky Save Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 safe-area-inset-bottom">
                    {error && !scanning && (
                        <p className="text-xs text-red-600 text-center mb-2 font-medium">{error}</p>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.amount || !form.date}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <><Loader size={20} className="animate-spin" /> Opslaan...</>
                        ) : (
                            <><Check size={20} /> Bonnetje opslaan</>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // HOME SCREEN
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-5 pt-12 pb-8 safe-area-inset-top">
                <div className="flex items-center justify-between mb-2">
                    {onNavigateHome && (
                        <button onClick={onNavigateHome} className="p-2 rounded-xl bg-white/10 active:bg-white/20">
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <div className={onNavigateHome ? '' : 'flex-1'}>
                        <div className="flex items-center gap-2">
                            <Receipt size={22} />
                            <span className="font-black text-xl">Bonnetje scanner</span>
                        </div>
                        <p className="text-indigo-200 text-sm mt-0.5">Scan direct vanuit je camera</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-5 space-y-5">
                {/* Hidden file inputs */}
                <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <input
                    ref={galleryRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                {/* Camera button — primaire actie */}
                <button
                    onClick={() => cameraRef.current?.click()}
                    className="w-full bg-indigo-600 text-white rounded-[2rem] p-8 flex flex-col items-center gap-4 shadow-lg active:scale-95 transition-transform"
                >
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Camera size={40} />
                    </div>
                    <div className="text-center">
                        <p className="font-black text-2xl">Camera</p>
                        <p className="text-indigo-200 text-sm mt-1">Foto maken van je bonnetje</p>
                    </div>
                </button>

                {/* Gallerij / upload */}
                <button
                    onClick={() => galleryRef.current?.click()}
                    className="w-full bg-white border-2 border-dashed border-slate-300 text-slate-600 rounded-[2rem] p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform active:bg-slate-50"
                >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Upload size={24} className="text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-black text-slate-800">Uit gallerij / bestanden</p>
                        <p className="text-slate-400 text-sm mt-0.5">Afbeelding of PDF uploaden</p>
                    </div>
                </button>

                {/* AI badge */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                    <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Gemini AI</strong> leest automatisch de leverancier, datum, bedrag en BTW van je bonnetje. Je kunt daarna alles controleren en aanpassen.
                    </p>
                </div>

                {/* Recente bonnetjes */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent ({CURRENT_YEAR})</p>
                        <span className="text-[10px] text-slate-400 font-bold">{recentList.length} bonnetjes</span>
                    </div>

                    {loadingList ? (
                        <div className="flex justify-center py-8">
                            <Loader size={24} className="animate-spin text-slate-300" />
                        </div>
                    ) : recentList.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                            <p className="text-slate-400 text-sm">Nog geen bonnetjes dit jaar</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentList.map(receipt => (
                                <div
                                    key={receipt.id}
                                    className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Receipt size={16} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">
                                            {receipt.supplier || receipt.description || 'Onbekend'}
                                        </p>
                                        <p className="text-xs text-slate-400">{formatDate(receipt.date)}</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm shrink-0">
                                        {formatEuro(receipt.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tip */}
                <p className="text-center text-xs text-slate-400 pb-6">
                    Voeg deze pagina toe aan je startscherm voor snelle toegang
                </p>
            </div>
        </div>
    );
}

// Helper component
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}
