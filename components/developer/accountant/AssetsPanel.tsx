import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Trash2, X, AlertCircle, Monitor, Armchair, Code2, Car, Package, Ban, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    Asset,
    AssetCategory,
    ASSET_CATEGORY_LABELS,
    DEFAULT_USEFUL_LIFE,
    DepreciationMethod,
    getAssets,
    createAsset,
    deleteAsset,
    disposeAsset,
    calculateDepreciation,
    calculateCurrentBookValue,
    getDepreciationSchedule,
    calculateKIA,
    DepreciationResult,
} from '../../../services/accountantAssetService';
import { formatEuro, formatDate } from '../../../services/accountantService';

interface AssetsPanelProps {
    userId: string;
    year: number;
    onRefresh: () => void;
}

interface AssetForm {
    name: string;
    purchaseDate: string;
    purchasePrice: string;
    residualValue: string;
    usefulLifeYears: string;
    depreciationMethod: DepreciationMethod;
    category: AssetCategory;
    notes: string;
}

const emptyForm = (): AssetForm => ({
    name: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    residualValue: '0',
    usefulLifeYears: '5',
    depreciationMethod: 'linear',
    category: 'overig',
    notes: '',
});

const CATEGORY_ICONS: Record<AssetCategory, React.ReactNode> = {
    computer:  <Monitor size={18} />,
    meubilair: <Armchair size={18} />,
    software:  <Code2 size={18} />,
    vervoer:   <Car size={18} />,
    overig:    <Package size={18} />,
};

export function AssetsPanel({ userId, year, onRefresh }: AssetsPanelProps) {
    const [assets, setAssets]           = useState<Asset[]>([]);
    const [loading, setLoading]         = useState(true);
    const [showForm, setShowForm]       = useState(false);
    const [saving, setSaving]           = useState(false);
    const [error, setError]             = useState('');
    const [form, setForm]               = useState<AssetForm>(emptyForm());
    const [kiaData, setKiaData]         = useState<{ totalInvestment: number; kiaAmount: number } | null>(null);
    const [showDispose, setShowDispose] = useState<string | null>(null);
    const [disposeForm, setDisposeForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '' });
    const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

    const loadAssets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAssets(userId);
            setAssets(data);
            const kia = await calculateKIA(userId, year);
            setKiaData({ totalInvestment: kia.totalInvestment, kiaAmount: kia.kiaAmount });
        } catch (e: any) {
            setError(e.message || 'Laden mislukt.');
        } finally {
            setLoading(false);
        }
    }, [userId, year]);

    useEffect(() => { loadAssets(); }, [loadAssets]);

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
        if (!form.name || !form.purchasePrice || !form.purchaseDate) {
            setError('Naam, aanschafprijs en datum zijn verplicht.');
            return;
        }
        const price = parseFloat(form.purchasePrice.replace(',', '.'));
        if (isNaN(price) || price <= 0) {
            setError('Voer een geldige aanschafprijs in.');
            return;
        }
        const residual = parseFloat(form.residualValue.replace(',', '.')) || 0;
        if (residual >= price) {
            setError('Restwaarde moet lager zijn dan de aanschafprijs.');
            return;
        }
        const lifeYears = parseInt(form.usefulLifeYears);
        if (isNaN(lifeYears) || lifeYears < 1) {
            setError('Voer een geldige levensduur in (minimaal 1 jaar).');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await createAsset({
                user_id: userId,
                name: form.name,
                purchase_date: form.purchaseDate,
                purchase_price: price,
                residual_value: residual,
                useful_life_years: lifeYears,
                depreciation_method: form.depreciationMethod,
                category: form.category,
                notes: form.notes || undefined,
                is_disposed: false,
            });
            setShowForm(false);
            setForm(emptyForm());
            loadAssets();
            onRefresh();
        } catch (e: any) {
            setError(e.message || 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bedrijfsmiddel verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;
        try {
            await deleteAsset(id);
            loadAssets();
            onRefresh();
        } catch (e: any) {
            setError(e.message || 'Verwijderen mislukt.');
        }
    }

    async function handleDispose(id: string) {
        const amount = parseFloat(disposeForm.amount.replace(',', '.')) || 0;
        try {
            await disposeAsset(id, disposeForm.date, amount);
            setShowDispose(null);
            setDisposeForm({ date: new Date().toISOString().split('T')[0], amount: '' });
            loadAssets();
            onRefresh();
        } catch (e: any) {
            setError(e.message || 'Afstoten mislukt.');
        }
    }

    // Totale afschrijving dit jaar
    const totalDepreciation = assets.reduce((sum, asset) => {
        const dep = calculateDepreciation(asset, year);
        return sum + dep.depreciationAmount;
    }, 0);

    // Totale boekwaarde
    const totalBookValue = assets
        .filter(a => !a.is_disposed)
        .reduce((sum, a) => sum + calculateCurrentBookValue(a), 0);

    const activeAssets = assets.filter(a => !a.is_disposed);
    const disposedAssets = assets.filter(a => a.is_disposed);

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

            {/* KIA melding */}
            {kiaData && kiaData.kiaAmount > 0 && (
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-emerald-700 font-black text-xs">KIA</span>
                    </div>
                    <div>
                        <p className="font-bold text-emerald-800">Kleinschaligheidsinvesteringsaftrek {year}</p>
                        <p className="text-emerald-700 text-xs mt-0.5">
                            Totale investering: {formatEuro(kiaData.totalInvestment)} — KIA-aftrek: <strong>{formatEuro(kiaData.kiaAmount)}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Bedrijfsmiddel toevoegen
                </button>

                {/* Totalen */}
                {activeAssets.length > 0 && (
                    <div className="ml-auto flex gap-4 text-sm">
                        <span className="text-slate-400">
                            Boekwaarde: <span className="font-bold text-slate-600">{formatEuro(totalBookValue)}</span>
                        </span>
                        <span className="text-slate-400">
                            Afschrijving {year}: <span className="font-bold text-slate-600">{formatEuro(totalDepreciation)}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Lijst */}
            {assets.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-200 py-16 text-center">
                    <Package size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm italic">Nog geen bedrijfsmiddelen toegevoegd.</p>
                    <p className="text-slate-400 text-xs mt-1">
                        Voeg bedrijfsmiddelen toe zoals laptop, bureau, software licenties, etc.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeAssets.map(asset => (
                        <AssetCard
                            key={asset.id}
                            asset={asset}
                            year={year}
                            expanded={expandedAsset === asset.id}
                            onToggleExpand={() => setExpandedAsset(expandedAsset === asset.id ? null : asset.id!)}
                            onDispose={() => setShowDispose(asset.id!)}
                            onDelete={() => asset.id && handleDelete(asset.id)}
                        />
                    ))}
                    {disposedAssets.length > 0 && (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">
                                Afgestoten ({disposedAssets.length})
                            </p>
                            {disposedAssets.map(asset => (
                                <AssetCard
                                    key={asset.id}
                                    asset={asset}
                                    year={year}
                                    expanded={expandedAsset === asset.id}
                                    onToggleExpand={() => setExpandedAsset(expandedAsset === asset.id ? null : asset.id!)}
                                    onDelete={() => asset.id && handleDelete(asset.id)}
                                />
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Modal: afstoten */}
            {showDispose && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Afstoten / Verkopen</h3>
                            <button onClick={() => setShowDispose(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Datum afstoting *</label>
                                <input
                                    type="date"
                                    value={disposeForm.date}
                                    onChange={e => setDisposeForm(f => ({ ...f, date: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Verkoopprijs</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={disposeForm.amount}
                                    onChange={e => setDisposeForm(f => ({ ...f, amount: e.target.value }))}
                                    placeholder="0.00 (bij weggooien)"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowDispose(null)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={() => handleDispose(showDispose)}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                            >
                                Afstoten
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: bedrijfsmiddel toevoegen */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Bedrijfsmiddel Toevoegen</h3>
                            <button onClick={() => { setShowForm(false); setError(''); }} className="p-2 hover:bg-slate-100 rounded-xl">
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
                            {/* Naam */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Naam *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="MacBook Pro, Bureau, Adobe licentie..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Categorie */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Categorie</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {(Object.keys(ASSET_CATEGORY_LABELS) as AssetCategory[]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setForm(f => ({
                                                ...f,
                                                category: cat,
                                                usefulLifeYears: String(DEFAULT_USEFUL_LIFE[cat]),
                                            }))}
                                            className={`flex flex-col items-center gap-1 py-2.5 px-1 text-[10px] font-bold rounded-xl transition-colors ${form.category === cat
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {CATEGORY_ICONS[cat]}
                                            <span className="truncate w-full text-center">{ASSET_CATEGORY_LABELS[cat].split(' / ')[0].split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Aanschafdatum */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aanschafdatum *</label>
                                <input
                                    type="date"
                                    value={form.purchaseDate}
                                    onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            {/* Aanschafprijs + Restwaarde */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aanschafprijs *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.purchasePrice}
                                        onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Restwaarde</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.residualValue}
                                        onChange={e => setForm(f => ({ ...f, residualValue: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                            </div>

                            {/* Levensduur + Methode */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Levensduur (jaren)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={form.usefulLifeYears}
                                        onChange={e => setForm(f => ({ ...f, usefulLifeYears: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Methode</label>
                                    <div className="flex gap-2">
                                        {(['linear', 'declining'] as const).map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setForm(f => ({ ...f, depreciationMethod: method }))}
                                                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors ${form.depreciationMethod === method
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {method === 'linear' ? 'Lineair' : 'Degressief'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Notities */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Notities</label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Serienummer, factuurverwijzing..."
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
// Subcomponent: kaart per bedrijfsmiddel
// ===========================================================================

function AssetCard({
    asset,
    year,
    expanded,
    onToggleExpand,
    onDispose,
    onDelete,
}: {
    asset: Asset;
    year: number;
    expanded: boolean;
    onToggleExpand: () => void;
    onDispose?: () => void;
    onDelete: () => void;
}) {
    const depreciation = calculateDepreciation(asset, year);
    const bookValue = calculateCurrentBookValue(asset);
    const schedule = expanded ? getDepreciationSchedule(asset) : [];

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm group transition-opacity ${asset.is_disposed ? 'opacity-50' : ''}`}>
            <div className="p-5 flex items-center gap-4">
                {/* Icoon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${asset.is_disposed ? 'bg-slate-100' : 'bg-indigo-100'}`}>
                    <span className={asset.is_disposed ? 'text-slate-400' : 'text-indigo-600'}>
                        {CATEGORY_ICONS[asset.category]}
                    </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm truncate">{asset.name}</p>
                        {asset.is_disposed && (
                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-lg font-bold">Afgestoten</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-bold">
                            {ASSET_CATEGORY_LABELS[asset.category]}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {formatDate(asset.purchase_date)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {asset.useful_life_years} jaar {asset.depreciation_method === 'linear' ? 'lineair' : 'degressief'}
                        </span>
                    </div>
                </div>

                {/* Waarden */}
                <div className="text-right shrink-0">
                    <p className="font-black text-slate-900 text-sm">{formatEuro(bookValue)}</p>
                    <p className="text-[10px] text-slate-400">
                        {depreciation.depreciationAmount > 0
                            ? `${formatEuro(depreciation.depreciationAmount)} afschr. ${year}`
                            : 'volledig afgeschreven'
                        }
                    </p>
                </div>

                {/* Acties */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={onToggleExpand}
                        title="Afschrijvingsschema"
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {!asset.is_disposed && onDispose && (
                        <button
                            onClick={onDispose}
                            title="Afstoten"
                            className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                            <Ban size={14} />
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Uitklapbaar afschrijvingsschema */}
            {expanded && schedule.length > 0 && (
                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Afschrijvingsschema</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-slate-400 text-left">
                                    <th className="pb-2 font-bold">Jaar</th>
                                    <th className="pb-2 font-bold text-right">Boekwaarde begin</th>
                                    <th className="pb-2 font-bold text-right">Afschrijving</th>
                                    <th className="pb-2 font-bold text-right">Boekwaarde eind</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map(row => (
                                    <tr
                                        key={row.year}
                                        className={`border-t border-slate-50 ${row.year === year ? 'bg-indigo-50/50 font-bold' : ''}`}
                                    >
                                        <td className="py-1.5 text-slate-700">{row.year}</td>
                                        <td className="py-1.5 text-right text-slate-600">{formatEuro(row.bookValueStart)}</td>
                                        <td className="py-1.5 text-right text-slate-600">{formatEuro(row.depreciationAmount)}</td>
                                        <td className="py-1.5 text-right text-slate-600">{formatEuro(row.bookValueEnd)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-slate-200 font-bold">
                                    <td className="py-2 text-slate-700">Totaal</td>
                                    <td className="py-2 text-right text-slate-600">{formatEuro(asset.purchase_price)}</td>
                                    <td className="py-2 text-right text-slate-600">
                                        {formatEuro(schedule.reduce((s, r) => s + r.depreciationAmount, 0))}
                                    </td>
                                    <td className="py-2 text-right text-slate-600">{formatEuro(asset.residual_value)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="flex gap-4 mt-3 text-[10px] text-slate-400">
                        <span>Aanschafwaarde: {formatEuro(asset.purchase_price)}</span>
                        <span>Restwaarde: {formatEuro(asset.residual_value)}</span>
                        <span>Afschrijfbaar: {formatEuro(asset.purchase_price - asset.residual_value)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
