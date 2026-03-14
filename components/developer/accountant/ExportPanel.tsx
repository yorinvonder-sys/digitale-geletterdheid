import React, { useState, useEffect } from 'react';
import {
    Download, FileText, FileSpreadsheet, Table2, Loader2,
    TrendingUp, TrendingDown, AlertCircle, CreditCard, Receipt,
} from 'lucide-react';
import {
    exportTransactionsCSV,
    exportReceiptsCSV,
    exportSubscriptionsCSV,
    exportBTWOverzichtCSV,
    getBTWQuarterlyOverview,
    generateAnnualReportPDF,
    BTWQuarterlyOverview,
} from '../../../services/accountantExportService';
import {
    formatEuro,
    AccountantSettings,
} from '../../../services/accountantService';

interface ExportPanelProps {
    userId: string;
    year: number;
    settings: AccountantSettings | null;
}

type ExportAction = 'transactions' | 'receipts' | 'subscriptions' | 'btw' | 'pdf';

export function ExportPanel({ userId, year, settings }: ExportPanelProps) {
    const [btwOverview, setBtwOverview] = useState<BTWQuarterlyOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState<ExportAction | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBTW();
    }, [userId, year]);

    async function loadBTW() {
        setLoading(true);
        setError('');
        try {
            const data = await getBTWQuarterlyOverview(userId, year);
            setBtwOverview(data);
        } catch (e: any) {
            setError(e.message || 'BTW-overzicht laden mislukt.');
        } finally {
            setLoading(false);
        }
    }

    async function handleExport(action: ExportAction) {
        setExporting(action);
        setError('');
        try {
            switch (action) {
                case 'transactions':
                    await exportTransactionsCSV(userId, year);
                    break;
                case 'receipts':
                    await exportReceiptsCSV(userId, year);
                    break;
                case 'subscriptions':
                    await exportSubscriptionsCSV(userId);
                    break;
                case 'btw':
                    await exportBTWOverzichtCSV(userId, year);
                    break;
                case 'pdf':
                    await generateAnnualReportPDF(userId, year, settings);
                    break;
            }
        } catch (e: any) {
            setError(e.message || 'Exporteren mislukt.');
        } finally {
            setExporting(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* BTW Kwartaaloverzicht */}
            {btwOverview && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Table2 size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                BTW Kwartaaloverzicht {year}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Inclusief verlegde BTW (buitenlandse SaaS)
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kwartaal</th>
                                    <th className="text-right py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ontvangen</th>
                                    <th className="text-right py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Betaald</th>
                                    <th className="text-right py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verlegd</th>
                                    <th className="text-right py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {btwOverview.quarters.map(q => (
                                    <tr key={q.quarter} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <span className="font-bold text-slate-800">{q.label}</span>
                                            <span className="text-xs text-slate-400 ml-2">{q.months}</span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-bold text-emerald-600 tabular-nums">{formatEuro(q.vatCollected)}</span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-bold text-red-500 tabular-nums">{formatEuro(q.vatPaid)}</span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-bold text-amber-600 tabular-nums">{formatEuro(q.vatReversed)}</span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <span className={`font-black tabular-nums ${q.vatBalance >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                {q.vatBalance >= 0 ? '' : '-'}{formatEuro(Math.abs(q.vatBalance))}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-300">
                                    <td className="py-3 px-3 font-black text-slate-900">Totaal</td>
                                    <td className="py-3 px-3 text-right font-black text-emerald-700 tabular-nums">
                                        {formatEuro(btwOverview.totals.vatCollected)}
                                    </td>
                                    <td className="py-3 px-3 text-right font-black text-red-600 tabular-nums">
                                        {formatEuro(btwOverview.totals.vatPaid)}
                                    </td>
                                    <td className="py-3 px-3 text-right font-black text-amber-700 tabular-nums">
                                        {formatEuro(btwOverview.totals.vatReversed)}
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <span className={`font-black tabular-nums ${btwOverview.totals.vatBalance >= 0 ? 'text-orange-700' : 'text-green-700'}`}>
                                            {btwOverview.totals.vatBalance >= 0
                                                ? `Af te dragen ${formatEuro(btwOverview.totals.vatBalance)}`
                                                : `Te vorderen ${formatEuro(Math.abs(btwOverview.totals.vatBalance))}`
                                            }
                                        </span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-4">
                        BTW ontvangen is geschat op basis van inkomsttransacties (21% standaardtarief).
                        Verlegd = 21% over buitenlandse SaaS-diensten met 0% BTW-tarief.
                    </p>
                </div>
            )}

            {/* Export knoppen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CSV Transacties */}
                <ExportCard
                    icon={<FileSpreadsheet size={20} className="text-indigo-600" />}
                    iconBg="bg-indigo-100"
                    title="Transacties CSV"
                    description={`Alle transacties van ${year} als CSV-bestand (puntkomma-gescheiden, klaar voor Excel).`}
                    buttonLabel="Download CSV"
                    loading={exporting === 'transactions'}
                    onClick={() => handleExport('transactions')}
                />

                {/* CSV Bonnetjes */}
                <ExportCard
                    icon={<Receipt size={20} className="text-emerald-600" />}
                    iconBg="bg-emerald-100"
                    title="Bonnetjes CSV"
                    description={`Alle bonnetjes van ${year} inclusief BTW-bedragen en categorisering.`}
                    buttonLabel="Download CSV"
                    loading={exporting === 'receipts'}
                    onClick={() => handleExport('receipts')}
                />

                {/* CSV Abonnementen */}
                <ExportCard
                    icon={<CreditCard size={20} className="text-violet-600" />}
                    iconBg="bg-violet-100"
                    title="Abonnementen CSV"
                    description="Overzicht van alle actieve en gepauzeerde abonnementen."
                    buttonLabel="Download CSV"
                    loading={exporting === 'subscriptions'}
                    onClick={() => handleExport('subscriptions')}
                />

                {/* CSV BTW-overzicht */}
                <ExportCard
                    icon={<TrendingUp size={20} className="text-amber-600" />}
                    iconBg="bg-amber-100"
                    title="BTW-overzicht CSV"
                    description={`BTW per kwartaal voor ${year} inclusief verlegde BTW. Voor de kwartaalaangifte.`}
                    buttonLabel="Download CSV"
                    loading={exporting === 'btw'}
                    onClick={() => handleExport('btw')}
                />
            </div>

            {/* PDF Jaaroverzicht */}
            <div className="bg-indigo-50 rounded-[2rem] border border-indigo-100 p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-indigo-900 uppercase tracking-tight">PDF Jaaroverzicht</h3>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                            Compleet overzicht {year} voor belastingaangifte
                        </p>
                    </div>
                </div>
                <p className="text-xs text-indigo-700 mb-5 leading-relaxed">
                    Genereer een volledig jaaroverzicht met winst-en-verliesrekening, kosten per categorie,
                    BTW-overzicht per kwartaal, ondernemersaftrekken en geschatte inkomstenbelasting.
                </p>
                <button
                    onClick={() => handleExport('pdf')}
                    disabled={exporting === 'pdf'}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {exporting === 'pdf' ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            PDF genereren...
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Download PDF Jaaroverzicht
                        </>
                    )}
                </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-slate-700">Let op:</strong> Alle exports zijn indicatief en dienen als voorbereiding
                    op je belastingaangifte. CSV-bestanden gebruiken puntkomma als scheidingsteken (Nederlands Excel-formaat).
                    Raadpleeg bij twijfel een belastingadviseur.
                </p>
            </div>
        </div>
    );
}

// ===========================================================================
// Subcomponent: Export kaart
// ===========================================================================

function ExportCard({
    icon,
    iconBg,
    title,
    description,
    buttonLabel,
    loading,
    onClick,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    buttonLabel: string;
    loading: boolean;
    onClick: () => void;
}) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{title}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{description}</p>
            <button
                onClick={onClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
                {loading ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        Exporteren...
                    </>
                ) : (
                    <>
                        <Download size={14} />
                        {buttonLabel}
                    </>
                )}
            </button>
        </div>
    );
}
