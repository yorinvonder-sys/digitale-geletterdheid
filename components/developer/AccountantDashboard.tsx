import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LayoutDashboard, ArrowLeftRight, Receipt, FileText, ChevronDown, Clock, Percent, Euro } from 'lucide-react';
import { OverviewPanel } from './accountant/OverviewPanel';
import { TransactionsPanel } from './accountant/TransactionsPanel';
import { ReceiptsPanel } from './accountant/ReceiptsPanel';
import { TaxReportPanel } from './accountant/TaxReportPanel';
import { HoursPanel } from './accountant/HoursPanel';
import { InvoicesPanel } from './accountant/InvoicesPanel';
import { VATPanel } from './accountant/VATPanel';
import {
    AccountantTransaction,
    AccountantReceipt,
    AccountantSettings,
    YearSummary,
    TaxCalculation,
    getTransactions,
    getReceipts,
    getSettings,
    getYearSummary,
    calculateTax,
} from '../../services/accountantService';
import { Invoice, getInvoices } from '../../services/accountantInvoicesService';

interface AccountantDashboardProps {
    userId: string;
}

type SubTab = 'overzicht' | 'transacties' | 'bonnetjes' | 'uren' | 'facturen' | 'btw' | 'aangifte';

const SUB_TABS: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overzicht',    label: 'Overzicht',    icon: <LayoutDashboard size={16} /> },
    { id: 'transacties',  label: 'Transacties',  icon: <ArrowLeftRight size={16} /> },
    { id: 'bonnetjes',    label: 'Bonnetjes',    icon: <Receipt size={16} /> },
    { id: 'uren',         label: 'Uren',         icon: <Clock size={16} /> },
    { id: 'facturen',     label: 'Facturen',     icon: <FileText size={16} /> },
    { id: 'btw',          label: 'BTW',          icon: <Percent size={16} /> },
    { id: 'aangifte',     label: 'Aangifte',     icon: <Euro size={16} /> },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export function AccountantDashboard({ userId }: AccountantDashboardProps) {
    const [activeTab,    setActiveTab]    = useState<SubTab>('overzicht');
    const [year,         setYear]         = useState(CURRENT_YEAR);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState('');

    const [transactions, setTransactions] = useState<AccountantTransaction[]>([]);
    const [receipts,     setReceipts]     = useState<AccountantReceipt[]>([]);
    const [invoices,     setInvoices]     = useState<Invoice[]>([]);
    const [settings,     setSettings]     = useState<AccountantSettings | null>(null);
    const [summary,      setSummary]      = useState<YearSummary | null>(null);
    const [tax,          setTax]          = useState<TaxCalculation | null>(null);

    // Versie-counter om race conditions bij snelle jaar-wisseling te voorkomen
    const requestIdRef = useRef(0);

    const loadData = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);
        setError('');
        try {
            const [txs, recs, cfg, invs] = await Promise.all([
                getTransactions(userId, year),
                getReceipts(userId, year),
                getSettings(userId),
                getInvoices(userId, year),
            ]);
            if (reqId !== requestIdRef.current) return; // Verouderd verzoek, negeren

            setTransactions(txs);
            setReceipts(recs);
            setSettings(cfg);
            setInvoices(invs);

            const yearSummary = await getYearSummary(userId, year);
            if (reqId !== requestIdRef.current) return;

            setSummary(yearSummary);
            setTax(calculateTax(yearSummary, cfg?.starter_aftrek ?? false));
        } catch (e: any) {
            if (reqId !== requestIdRef.current) return;
            setError(e.message || 'Laden mislukt.');
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [userId, year]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Herbereken belasting als instellingen wijzigen (zonder data-reload)
    useEffect(() => {
        if (summary && settings !== undefined) {
            setTax(calculateTax(summary, settings?.starter_aftrek ?? false));
        }
    }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleSettingsChange(newSettings: AccountantSettings) {
        setSettings(newSettings);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 text-sm font-medium">Boekhouddata laden...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-700 font-bold">{error}</p>
                <button
                    onClick={loadData}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
                >
                    Opnieuw proberen
                </button>
            </div>
        );
    }

    if (!summary || !tax) return null;

    return (
        <div className="space-y-6">
            {/* Header met jaar-selector en sub-tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Sub-tabs */}
                <div className="flex bg-white border border-slate-200 rounded-2xl p-1 gap-1 overflow-x-auto">
                    {SUB_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Jaar-selector */}
                <div className="relative ml-auto">
                    <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className="appearance-none pl-4 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                    >
                        {YEAR_OPTIONS.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Snelle statistieken */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transacties</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{transactions.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bonnetjes</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{receipts.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Facturen</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{invoices.length}</p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-center ${summary.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Winst {year}</p>
                    <p className={`text-xl font-black mt-0.5 ${summary.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(summary.profit)}
                    </p>
                </div>
            </div>

            {/* Tab inhoud */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'overzicht' && (
                    <OverviewPanel summary={summary} tax={tax} year={year} />
                )}
                {activeTab === 'transacties' && (
                    <TransactionsPanel
                        transactions={transactions}
                        userId={userId}
                        year={year}
                        onRefresh={loadData}
                    />
                )}
                {activeTab === 'bonnetjes' && (
                    <ReceiptsPanel
                        receipts={receipts}
                        userId={userId}
                        onRefresh={loadData}
                    />
                )}
                {activeTab === 'uren' && (
                    <HoursPanel userId={userId} year={year} />
                )}
                {activeTab === 'facturen' && (
                    <InvoicesPanel userId={userId} year={year} onRefresh={loadData} />
                )}
                {activeTab === 'btw' && (
                    <VATPanel
                        receipts={receipts}
                        transactions={transactions}
                        invoices={invoices}
                        year={year}
                    />
                )}
                {activeTab === 'aangifte' && (
                    <TaxReportPanel
                        summary={summary}
                        tax={tax}
                        settings={settings}
                        userId={userId}
                        onSettingsChange={handleSettingsChange}
                    />
                )}
            </div>
        </div>
    );
}
