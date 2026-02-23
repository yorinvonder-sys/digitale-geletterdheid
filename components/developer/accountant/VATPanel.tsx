import React from 'react';
import {
    AlertCircle,
    CheckCircle,
    Calendar,
    ExternalLink,
    Info,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import {
    formatEuro,
    AccountantReceipt,
    AccountantTransaction,
} from '../../../services/accountantService';

interface InvoiceEntry {
    vat_amount: number;
    issue_date: string;
    status: string;
}

interface VATPanelProps {
    receipts: AccountantReceipt[];
    transactions: AccountantTransaction[];
    invoices?: InvoiceEntry[];
    year: number;
}

interface QuarterData {
    label: string;
    months: string;
    startMonth: number; // 1-indexed
    endMonth: number;   // 1-indexed
    deadline: string;
    deadlineDate: Date;
}

const QUARTERS: QuarterData[] = [
    {
        label: 'Q1',
        months: 'Januari t/m Maart',
        startMonth: 1,
        endMonth: 3,
        deadline: '30 april',
        deadlineDate: new Date(0), // wordt per jaar ingesteld
    },
    {
        label: 'Q2',
        months: 'April t/m Juni',
        startMonth: 4,
        endMonth: 6,
        deadline: '31 juli',
        deadlineDate: new Date(0),
    },
    {
        label: 'Q3',
        months: 'Juli t/m September',
        startMonth: 7,
        endMonth: 9,
        deadline: '31 oktober',
        deadlineDate: new Date(0),
    },
    {
        label: 'Q4',
        months: 'Oktober t/m December',
        startMonth: 10,
        endMonth: 12,
        deadline: '31 januari volgend jaar',
        deadlineDate: new Date(0),
    },
];

function getQuarterDeadline(quarterIndex: number, year: number): Date {
    // Q1: 30 april year, Q2: 31 juli year, Q3: 31 okt year, Q4: 31 jan year+1
    const deadlines = [
        new Date(year, 3, 30),   // 30 april (maand 3 = april, 0-indexed)
        new Date(year, 6, 31),   // 31 juli
        new Date(year, 9, 31),   // 31 oktober
        new Date(year + 1, 0, 31), // 31 januari volgend jaar
    ];
    return deadlines[quarterIndex];
}

function getCurrentQuarter(today: Date): number {
    const month = today.getMonth() + 1; // 1-indexed
    if (month <= 3) return 0;
    if (month <= 6) return 1;
    if (month <= 9) return 2;
    return 3;
}

function getMonthFromDate(isoDate: string): number {
    return parseInt(isoDate.split('-')[1], 10); // 1-indexed
}

function getYearFromDate(isoDate: string): number {
    return parseInt(isoDate.split('-')[0], 10);
}

export function VATPanel({ receipts, transactions, invoices, year }: VATPanelProps) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentQuarterIndex = year === currentYear ? getCurrentQuarter(today) : -1;
    const hasInvoices = invoices && invoices.length > 0;

    // Bereken BTW per kwartaal
    const quarterResults = QUARTERS.map((q, i) => {
        const deadlineDate = getQuarterDeadline(i, year);
        const isDeadlinePassed = today > deadlineDate;
        const isCurrentQuarter = i === currentQuarterIndex;

        // BTW ontvangen
        let vatCollected = 0;
        if (hasInvoices && invoices) {
            // Gebruik betaalde facturen voor dat kwartaal
            vatCollected = invoices
                .filter(inv => {
                    if (inv.status !== 'betaald') return false;
                    const invYear = getYearFromDate(inv.issue_date);
                    if (invYear !== year) return false;
                    const invMonth = getMonthFromDate(inv.issue_date);
                    return invMonth >= q.startMonth && invMonth <= q.endMonth;
                })
                .reduce((sum, inv) => sum + (inv.vat_amount || 0), 0);
        } else {
            // Schatting: positieve transacties × (21/121) als approximatie
            const quarterIncome = transactions
                .filter(tx => {
                    const txYear = getYearFromDate(tx.date);
                    if (txYear !== year) return false;
                    const txMonth = getMonthFromDate(tx.date);
                    return tx.amount > 0 && txMonth >= q.startMonth && txMonth <= q.endMonth;
                })
                .reduce((sum, tx) => sum + tx.amount, 0);
            vatCollected = quarterIncome * (21 / 121);
        }

        // BTW betaald (via bonnetjes)
        const vatPaid = receipts
            .filter(r => {
                const rYear = getYearFromDate(r.date);
                if (rYear !== year) return false;
                const rMonth = getMonthFromDate(r.date);
                return rMonth >= q.startMonth && rMonth <= q.endMonth;
            })
            .reduce((sum, r) => sum + (r.vat_amount || 0), 0);

        const saldo = vatCollected - vatPaid;

        return {
            ...q,
            deadlineDate,
            isDeadlinePassed,
            isCurrentQuarter,
            vatCollected,
            vatPaid,
            saldo,
        };
    });

    // Jaarotalen
    const totalVatCollected = quarterResults.reduce((s, q) => s + q.vatCollected, 0);
    const totalVatPaid = quarterResults.reduce((s, q) => s + q.vatPaid, 0);
    const totalSaldo = totalVatCollected - totalVatPaid;

    return (
        <div className="space-y-6">
            {/* Jaaroverzicht kaart */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            BTW Jaaroverzicht {year}
                        </h3>
                        {!hasInvoices && (
                            <p className="text-xs text-amber-600 font-medium mt-0.5">
                                Schattingen — koppel facturen voor exacte cijfers
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                            BTW Ontvangen
                        </p>
                        <p className="text-2xl font-black text-emerald-700">
                            {formatEuro(totalVatCollected)}
                        </p>
                        <p className="text-[10px] text-emerald-500 mt-1">
                            {hasInvoices ? 'Betaalde facturen' : 'Geschatte BTW 21%'}
                        </p>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">
                            BTW Betaald
                        </p>
                        <p className="text-2xl font-black text-red-700">
                            {formatEuro(totalVatPaid)}
                        </p>
                        <p className="text-[10px] text-red-500 mt-1">Via bonnetjes</p>
                    </div>

                    <div className={`rounded-2xl p-5 border ${totalSaldo >= 0
                        ? 'bg-orange-50 border-orange-100'
                        : 'bg-green-50 border-green-100'
                        }`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${totalSaldo >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {totalSaldo >= 0 ? 'Af te Dragen' : 'Te Vorderen'}
                        </p>
                        <p className={`text-2xl font-black ${totalSaldo >= 0 ? 'text-orange-700' : 'text-green-700'}`}>
                            {formatEuro(Math.abs(totalSaldo))}
                        </p>
                        <p className={`text-[10px] mt-1 ${totalSaldo >= 0 ? 'text-orange-500' : 'text-green-500'}`}>
                            Jaarssaldo
                        </p>
                    </div>
                </div>
            </div>

            {/* Kwartaalsecties */}
            {quarterResults.map((q, i) => (
                <div
                    key={i}
                    className={`bg-white rounded-[2rem] border shadow-sm overflow-hidden ${q.isCurrentQuarter
                        ? 'border-indigo-300 ring-2 ring-indigo-100'
                        : 'border-slate-200'
                        }`}
                >
                    {/* Header */}
                    <div className={`px-8 py-5 flex flex-wrap items-center justify-between gap-3 ${q.isCurrentQuarter ? 'bg-indigo-50' : 'bg-slate-50'
                        } border-b ${q.isCurrentQuarter ? 'border-indigo-100' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className={q.isCurrentQuarter ? 'text-indigo-500' : 'text-slate-400'} />
                            <div>
                                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">
                                    {q.label} — {q.months}
                                </h4>
                                <p className={`text-xs font-medium mt-0.5 flex items-center gap-1 ${q.isDeadlinePassed && q.saldo > 0
                                    ? 'text-red-500'
                                    : 'text-slate-400'
                                    }`}>
                                    <span>Deadline aangifte: {q.deadline}</span>
                                    {q.isDeadlinePassed && q.saldo > 0 && (
                                        <AlertCircle size={12} />
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {q.isCurrentQuarter && (
                                <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    Huidig kwartaal
                                </span>
                            )}
                            {!q.isCurrentQuarter && q.isDeadlinePassed && (
                                <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    Verstreken
                                </span>
                            )}
                            {!q.isCurrentQuarter && !q.isDeadlinePassed && (
                                <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    Aankomend
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-6">
                        {/* 3-koloms BTW overzicht */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                    BTW Ontvangen
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-lg font-black text-emerald-600">
                                        {formatEuro(q.vatCollected)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                    BTW Betaald
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <TrendingDown size={14} className="text-red-400 shrink-0" />
                                    <span className="text-lg font-black text-red-500">
                                        {formatEuro(q.vatPaid)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                    Saldo
                                </p>
                                {q.saldo >= 0 ? (
                                    <div className="flex items-center gap-1.5">
                                        <AlertCircle size={14} className="text-orange-500 shrink-0" />
                                        <span className="text-lg font-black text-orange-600">
                                            Af te dragen {formatEuro(q.saldo)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                                        <span className="text-lg font-black text-green-600">
                                            Te vorderen {formatEuro(Math.abs(q.saldo))}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Waarschuwing te laat */}
                        {q.saldo > 0 && q.isDeadlinePassed && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                                <AlertCircle size={16} className="text-red-500 shrink-0" />
                                <p className="text-sm font-bold text-red-700">
                                    Aangifte mogelijk te laat! De deadline van {q.deadline} is verstreken.
                                    Dien zo snel mogelijk aangifte in om boetes te vermijden.
                                </p>
                            </div>
                        )}

                        {/* Aangifte doen knop */}
                        <a
                            href="https://www.belastingdienst.nl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${q.saldo > 0 && q.isDeadlinePassed
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            <ExternalLink size={14} />
                            Aangifte doen via Belastingdienst
                        </a>
                    </div>
                </div>
            ))}

            {/* Voetnoot-kaart */}
            <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8">
                <div className="flex items-start gap-3">
                    <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h4 className="font-black text-slate-700 text-sm uppercase tracking-tight">
                            Hoe werkt BTW-aangifte als ZZP'er?
                        </h4>
                        <ul className="space-y-1.5 text-sm text-slate-500">
                            <li>
                                <span className="font-bold text-slate-600">Kwartaalaangifte:</span>{' '}
                                Als ZZP'er doe je in de meeste gevallen elk kwartaal BTW-aangifte bij de Belastingdienst.
                            </li>
                            <li>
                                <span className="font-bold text-slate-600">Deadlines:</span>{' '}
                                Q1 → 30 april, Q2 → 31 juli, Q3 → 31 oktober, Q4 → 31 januari volgend jaar.
                            </li>
                            <li>
                                <span className="font-bold text-slate-600">BTW betalen:</span>{' '}
                                Als het saldo positief is, draag je dit af. Bij negatief saldo kun je BTW terugvragen.
                            </li>
                            <li>
                                <span className="font-bold text-slate-600">Bonnetjes:</span>{' '}
                                Sla al je bonnetjes op via het tabblad "Bonnetjes" — de BTW hierop wordt automatisch verrekend.
                            </li>
                        </ul>
                        {!hasInvoices && (
                            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 font-medium">
                                    <span className="font-black">Disclaimer:</span>{' '}
                                    De weergegeven BTW-ontvangen bedragen zijn schattingen op basis van je inkomsttransacties
                                    (21% BTW-tarief toegepast). Koppel je facturen of voer ze in voor exacte BTW-berekeningen.
                                    Raadpleeg altijd een boekhouder voor je definitieve aangifte.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
