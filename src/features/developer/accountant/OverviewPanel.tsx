import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Euro,
    Receipt,
    BarChart3,
} from 'lucide-react';
import {
    YearSummary,
    TaxCalculation,
    CATEGORY_LABELS,
    formatEuro,
    TransactionCategory,
} from '@/services/accountantService';

interface OverviewPanelProps {
    summary: YearSummary;
    tax: TaxCalculation;
    year: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

export function OverviewPanel({ summary, tax, year }: OverviewPanelProps) {
    const maxMonthValue = Math.max(
        ...summary.byMonth.map(m => Math.max(m.income, m.expenses)),
        1
    );

    // Top 5 kostenposten (alleen uitgaven)
    const expenseCategories = Object.entries(summary.byCategory)
        .filter(([cat]) => !['omzet', 'subsidie', 'overig-inkomen'].includes(cat))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Omzet */}
                <div className="bg-white p-6 rounded-3xl border border-duck-ink/15 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-duck-ink rounded-xl flex items-center justify-center">
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <p className="text-[10px] font-black text-duck-ink/60 uppercase tracking-widest">Totaal Omzet</p>
                    </div>
                    <h3 className="text-2xl font-black text-duck-ink">{formatEuro(summary.totalIncome)}</h3>
                    <p className="text-[10px] text-duck-ink/60 mt-1 font-medium">{year}</p>
                </div>

                {/* Kosten */}
                <div className="bg-white p-6 rounded-3xl border border-duck-ink/15 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-duck-acid rounded-xl flex items-center justify-center">
                            <TrendingDown size={16} className="text-duck-ink/60" />
                        </div>
                        <p className="text-[10px] font-black text-duck-ink/60 uppercase tracking-widest">Totaal Kosten</p>
                    </div>
                    <h3 className="text-2xl font-black text-duck-ink">{formatEuro(summary.totalExpenses)}</h3>
                    <p className="text-[10px] text-duck-ink/60 mt-1 font-medium">{year}</p>
                </div>

                {/* Winst */}
                <div className={`p-6 rounded-3xl border shadow-sm ${summary.profit >= 0 ? 'bg-duck-ink border-duck-ink' : 'bg-duck-error border-duck-error'}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${summary.profit >= 0 ? 'bg-duck-ink' : 'bg-duck-error'}`}>
                            <Euro size={16} className={summary.profit >= 0 ? 'text-white' : 'text-white/70'} />
                        </div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Winst</p>
                    </div>
                    <h3 className={`text-2xl font-black ${summary.profit >= 0 ? 'text-white' : 'text-white'}`}>
                        {formatEuro(summary.profit)}
                    </h3>
                    <p className="text-[10px] text-white/60 mt-1 font-medium">Vóór aftrekposten</p>
                </div>

                {/* Geschatte belasting */}
                <div className="bg-duck-acid/30 p-6 rounded-3xl border border-duck-ink/15 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-duck-acid rounded-xl flex items-center justify-center">
                            <Receipt size={16} className="text-duck-ink" />
                        </div>
                        <p className="text-[10px] font-black text-duck-ink uppercase tracking-widest">Gesch. Belasting</p>
                    </div>
                    <h3 className="text-2xl font-black text-duck-ink">{formatEuro(tax.estimatedTax)}</h3>
                    <p className="text-[10px] text-duck-ink/60 mt-1 font-medium">IB Box 1 {year}</p>
                </div>
            </div>

            {/* Grafiek + categorieën */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Maandgrafiek */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-duck-ink/15 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-duck-bg rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-duck-ink/60" />
                        </div>
                        <h3 className="text-lg font-black text-duck-ink uppercase tracking-tight">Inkomsten vs Kosten</h3>
                    </div>

                    {/* Bar chart */}
                    <div className="flex items-end gap-1.5 h-40">
                        {summary.byMonth.map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                <div className="w-full flex gap-0.5 items-end" style={{ height: '128px' }}>
                                    {/* Inkomsten bar */}
                                    <div
                                        className="flex-1 bg-duck-ink rounded-t-sm transition-all duration-500"
                                        style={{ height: `${Math.max(2, (m.income / maxMonthValue) * 100)}%` }}
                                        title={`Inkomsten: ${formatEuro(m.income)}`}
                                    />
                                    {/* Kosten bar */}
                                    <div
                                        className="flex-1 bg-duck-acid rounded-t-sm transition-all duration-500"
                                        style={{ height: `${Math.max(2, (m.expenses / maxMonthValue) * 100)}%` }}
                                        title={`Kosten: ${formatEuro(m.expenses)}`}
                                    />
                                </div>
                                <span className="text-[8px] text-duck-ink/60 font-bold uppercase">
                                    {MONTH_LABELS[i]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Legenda */}
                    <div className="flex gap-4 mt-4 justify-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-duck-ink" />
                            <span className="text-xs text-duck-ink/60 font-medium">Inkomsten</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-duck-acid" />
                            <span className="text-xs text-duck-ink/60 font-medium">Kosten</span>
                        </div>
                    </div>
                </div>

                {/* Top 5 kosten */}
                <div className="bg-white p-8 rounded-[2rem] border border-duck-ink/15 shadow-sm">
                    <h3 className="text-lg font-black text-duck-ink uppercase tracking-tight mb-6">Top Kostenposten</h3>

                    {expenseCategories.length === 0 ? (
                        <p className="text-sm text-duck-ink/60 italic text-center py-8">Nog geen kosten geboekt</p>
                    ) : (
                        <div className="space-y-4">
                            {expenseCategories.map(([cat, amount]) => {
                                const maxAmount = expenseCategories[0][1];
                                const pct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                                return (
                                    <div key={cat}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-duck-ink/60 truncate">
                                                {CATEGORY_LABELS[cat as TransactionCategory] || cat}
                                            </span>
                                            <span className="text-xs font-black text-duck-ink ml-2 shrink-0">
                                                {formatEuro(amount)}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-duck-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-duck-acid rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* BTW-saldo */}
            <div className="bg-duck-ink rounded-[2rem] p-8 text-white">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6">BTW Overzicht {year}</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">BTW Ontvangen</p>
                        <p className="text-xl font-black text-white">{formatEuro(summary.vatCollected)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">BTW Betaald</p>
                        <p className="text-xl font-black text-duck-acid">{formatEuro(summary.vatPaid)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">BTW Saldo</p>
                        <p className={`text-xl font-black ${summary.vatBalance >= 0 ? 'text-white' : 'text-duck-acid'}`}>
                            {formatEuro(summary.vatBalance)}
                        </p>
                        <p className="text-[10px] text-white/60 mt-1">
                            {summary.vatBalance >= 0 ? 'Afdragen aan Belastingdienst' : 'Te vorderen'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
