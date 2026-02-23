import React, { useState, useEffect } from 'react';
import {
    Clock, Plus, Trash2, CheckCircle, XCircle, AlertCircle, TrendingUp,
} from 'lucide-react';
import {
    HourEntry,
    getHourEntries,
    createHourEntry,
    deleteHourEntry,
    getYearHoursTotal,
    getHoursByMonth,
    URENCRITERIUM,
} from '../../../services/accountantHoursService';

interface HoursPanelProps {
    userId: string;
    year: number;
}

const MAAND_AFKORTINGEN = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

const today = new Date().toISOString().split('T')[0];

interface HourForm {
    date: string;
    hours: string;
    client: string;
    description: string;
    billable: boolean;
}

const emptyForm = (): HourForm => ({
    date:        today,
    hours:       '',
    client:      '',
    description: '',
    billable:    true,
});

export function HoursPanel({ userId, year }: HoursPanelProps) {
    const [entries,  setEntries]  = useState<HourEntry[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [saving,   setSaving]   = useState(false);
    const [formError, setFormError] = useState('');
    const [form,     setForm]     = useState<HourForm>(emptyForm());
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    async function loadEntries() {
        setLoading(true);
        setError('');
        try {
            const data = await getHourEntries(userId, year);
            setEntries(data);
        } catch (e: any) {
            setError(e.message || 'Uren laden mislukt.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEntries();
    }, [userId, year]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSave() {
        setFormError('');
        if (!form.date) {
            setFormError('Datum is verplicht.');
            return;
        }
        const hoursNum = parseFloat(form.hours.replace(',', '.'));
        if (!form.hours || isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
            setFormError('Voer een geldig aantal uren in (0,5 – 24).');
            return;
        }
        if (!form.description.trim()) {
            setFormError('Omschrijving is verplicht.');
            return;
        }

        setSaving(true);
        try {
            await createHourEntry({
                user_id:     userId,
                date:        form.date,
                hours:       hoursNum,
                description: form.description.trim(),
                client:      form.client.trim() || undefined,
                billable:    form.billable,
            });
            setForm(emptyForm());
            await loadEntries();
        } catch (e: any) {
            setFormError(e.message || 'Opslaan mislukt.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Urenregistratie verwijderen?')) return;
        try {
            await deleteHourEntry(id);
            setEntries(prev => prev.filter(e => e.id !== id));
        } catch (e: any) {
            setError(e.message || 'Verwijderen mislukt.');
        }
    }

    const totalHours    = getYearHoursTotal(entries);
    const byMonth       = getHoursByMonth(entries);
    const progress      = Math.min((totalHours / URENCRITERIUM) * 100, 100);
    const criteriumHaald = totalHours >= URENCRITERIUM;
    const billableHours  = entries.filter(e => e.billable).reduce((s, e) => s + e.hours, 0);
    const nonBillable    = totalHours - billableHours;
    const maxMonthHours  = Math.max(...byMonth.map(m => m.hours), 1);

    function formatDate(isoDate: string): string {
        return new Date(isoDate + 'T00:00:00').toLocaleDateString('nl-NL', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">Uren laden...</p>
                </div>
            </div>
        );
    }

    if (error && entries.length === 0) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-700 font-bold">{error}</p>
                <button
                    onClick={loadEntries}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
                >
                    Opnieuw proberen
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* ===== SECTIE 1: Voortgang urencriterium ===== */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                            Urencriterium {year}
                        </h3>
                        <p className="text-2xl font-black text-white tabular-nums">
                            {totalHours.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} / {URENCRITERIUM.toLocaleString('nl-NL')} uur
                        </p>
                    </div>
                    {criteriumHaald && (
                        <div className="ml-auto flex items-center gap-2 bg-emerald-500/20 text-emerald-400 rounded-xl px-4 py-2">
                            <CheckCircle size={16} />
                            <span className="text-xs font-black uppercase tracking-wide">Gehaald</span>
                        </div>
                    )}
                    {!criteriumHaald && totalHours > 0 && (
                        <div className="ml-auto flex items-center gap-2 bg-amber-500/20 text-amber-400 rounded-xl px-4 py-2">
                            <AlertCircle size={16} />
                            <span className="text-xs font-black uppercase tracking-wide">
                                Nog {(URENCRITERIUM - totalHours).toLocaleString('nl-NL', { maximumFractionDigits: 1 })} uur
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${criteriumHaald ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {progress.toFixed(1)}% van urencriterium
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Min. 1.225 uur voor zelfstandigenaftrek (€5.030)
                        </span>
                    </div>
                </div>

                {/* 3 stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Totaal uren</p>
                        <p className="text-xl font-black text-white tabular-nums">
                            {totalHours.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}
                        </p>
                    </div>
                    <div className="text-center border-x border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Declarabel</p>
                        <p className="text-xl font-black text-emerald-400 tabular-nums">
                            {billableHours.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Niet declarabel</p>
                        <p className="text-xl font-black text-slate-400 tabular-nums">
                            {nonBillable.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== SECTIE 2: Snelle toevoeg-kaart ===== */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Plus size={20} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Uren registreren</h3>
                </div>

                {formError && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm mb-5">
                        <AlertCircle size={14} />
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Datum */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Datum *
                        </label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* Uren */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Uren *
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="24"
                            value={form.hours}
                            onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                            placeholder="8"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* Opdrachtgever */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Opdrachtgever
                        </label>
                        <input
                            type="text"
                            value={form.client}
                            onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                            placeholder="Bedrijf BV (optioneel)"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {/* Omschrijving */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Omschrijving *
                        </label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Frontend ontwikkeling"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                    {/* Billable toggle */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                            onClick={() => setForm(f => ({ ...f, billable: !f.billable }))}
                            className={`relative w-11 h-6 rounded-full transition-colors ${form.billable ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.billable ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                            {form.billable ? 'Declarabel' : 'Niet declarabel'}
                        </span>
                    </label>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        <Clock size={16} />
                        {saving ? 'Opslaan...' : 'Uren opslaan'}
                    </button>
                </div>
            </div>

            {/* ===== SECTIE 3: Uren per maand (mini bar chart) ===== */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    Uren per maand — {year}
                </h3>

                <div className="flex items-end gap-2 sm:gap-3">
                    {byMonth.map(({ month, hours }) => {
                        const barHeight = maxMonthHours > 0
                            ? Math.max(Math.round((hours / maxMonthHours) * 64), hours > 0 ? 4 : 0)
                            : 0;
                        const isCurrentMonth = new Date().getMonth() + 1 === month && new Date().getFullYear() === year;

                        return (
                            <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                {/* Maandafkorting */}
                                <span className={`text-[9px] font-black uppercase tracking-wide ${isCurrentMonth ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {MAAND_AFKORTINGEN[month - 1]}
                                </span>
                                {/* Bar container */}
                                <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-300 ${hours > 0 ? (isCurrentMonth ? 'bg-indigo-500' : 'bg-indigo-200') : 'bg-slate-100'}`}
                                        style={{ height: `${barHeight}px` }}
                                    />
                                </div>
                                {/* Urenteller */}
                                <span className={`text-[9px] font-black tabular-nums ${hours > 0 ? 'text-slate-700' : 'text-slate-300'}`}>
                                    {hours > 0 ? hours.toLocaleString('nl-NL', { maximumFractionDigits: 1 }) : '—'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ===== SECTIE 4: Urentabel ===== */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Urenregistraties ({entries.length})
                    </h3>
                    {error && (
                        <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                            <AlertCircle size={12} />
                            {error}
                        </span>
                    )}
                </div>

                {entries.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock size={28} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Nog geen uren geregistreerd</p>
                        <p className="text-slate-300 text-xs mt-1">
                            Gebruik het formulier hierboven om uren toe te voegen.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">
                                        Datum
                                    </th>
                                    <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">
                                        Omschrijving
                                    </th>
                                    <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">
                                        Opdrachtgever
                                    </th>
                                    <th className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">
                                        Uren
                                    </th>
                                    <th className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">
                                        Declarabel
                                    </th>
                                    <th className="px-6 py-4 w-12" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {entries.map(entry => (
                                    <tr
                                        key={entry.id}
                                        className="hover:bg-slate-50 transition-colors group"
                                        onMouseEnter={() => setHoveredRow(entry.id || null)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-slate-700">
                                                {formatDate(entry.date)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 line-clamp-1">
                                                {entry.description}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {entry.client ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                                                    {entry.client}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-slate-900 tabular-nums">
                                                {entry.hours.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {entry.billable ? (
                                                <CheckCircle size={18} className="text-emerald-500 mx-auto" />
                                            ) : (
                                                <XCircle size={18} className="text-slate-300 mx-auto" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => entry.id && handleDelete(entry.id)}
                                                className={`p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all ${hoveredRow === entry.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                title="Verwijderen"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {entries.length > 0 && (
                                <tfoot>
                                    <tr className="border-t-2 border-slate-100 bg-slate-50">
                                        <td colSpan={3} className="px-6 py-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Totaal {year}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-slate-900 tabular-nums">
                                                {totalHours.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                            </span>
                                        </td>
                                        <td colSpan={2} />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// === TAXREPORTPANEL INTEGRATIE ===
//
// Wat toe te voegen aan TaxReportPanel.tsx voor een urencriterium-sectie:
//
// 1. IMPORTS (toevoegen bovenaan TaxReportPanel.tsx):
//    import {
//        HourEntry,
//        getHourEntries,
//        getYearHoursTotal,
//        URENCRITERIUM,
//    } from '../../../services/accountantHoursService';
//
// 2. PROPS (TaxReportPanel ontvangt al userId en summary.year):
//    - userId is al beschikbaar als prop
//    - summary.year levert het belastingjaar op
//
// 3. STATE + EFFECT (toevoegen in TaxReportPanel component body):
//    const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
//    useEffect(() => {
//        getHourEntries(userId, summary.year)
//            .then(setHourEntries)
//            .catch(() => {}); // stil falen: urendata is optioneel voor dit paneel
//    }, [userId, summary.year]);
//    const totalHours = getYearHoursTotal(hourEntries);
//    const criteriumHaald = totalHours >= URENCRITERIUM;
//    const hoursProgress = Math.min((totalHours / URENCRITERIUM) * 100, 100);
//
// 4. JSX-SECTIE (invoegen vóór de BTW-sectie, na de IB-berekening grid):
//    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
//        <div className="flex items-center gap-3 mb-6">
//            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
//                <Clock size={20} className="text-amber-600" />
//            </div>
//            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
//                Urenregistratie & Zelfstandigenaftrek
//            </h3>
//        </div>
//        <div className="mb-4">
//            <div className="flex justify-between mb-2">
//                <span className="text-sm font-bold text-slate-700">
//                    {totalHours.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} / {URENCRITERIUM} uur geregistreerd
//                </span>
//                <span className={`text-sm font-black ${criteriumHaald ? 'text-emerald-600' : 'text-amber-600'}`}>
//                    {hoursProgress.toFixed(1)}%
//                </span>
//            </div>
//            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
//                <div
//                    className={`h-full rounded-full transition-all ${criteriumHaald ? 'bg-emerald-500' : 'bg-amber-400'}`}
//                    style={{ width: `${hoursProgress}%` }}
//                />
//            </div>
//        </div>
//        {!criteriumHaald && (
//            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
//                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
//                <div>
//                    <p className="text-sm font-black text-amber-800">
//                        Urencriterium nog niet gehaald
//                    </p>
//                    <p className="text-xs text-amber-700 mt-0.5">
//                        Je hebt minimaal 1.225 uur per jaar nodig voor de zelfstandigenaftrek (€5.030).
//                        Nog {(URENCRITERIUM - totalHours).toLocaleString('nl-NL', { maximumFractionDigits: 1 })} uur te gaan.
//                        Registreer uren via het tabblad "Uren".
//                    </p>
//                </div>
//            </div>
//        )}
//        {criteriumHaald && (
//            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
//                <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
//                <div>
//                    <p className="text-sm font-black text-emerald-800">
//                        Urencriterium gehaald — zelfstandigenaftrek van toepassing
//                    </p>
//                    <p className="text-xs text-emerald-700 mt-0.5">
//                        Je hebt {totalHours.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} uur geregistreerd.
//                        De zelfstandigenaftrek van €5.030 is verwerkt in de IB-berekening hierboven.
//                    </p>
//                </div>
//            </div>
//        )}
//    </div>
//
// 5. BENODIGDE IMPORT voor het uren-icoon in TaxReportPanel:
//    Voeg 'Clock' toe aan de lucide-react import bovenaan TaxReportPanel.tsx.
//    CheckCircle en AlertCircle zijn daar al beschikbaar.
