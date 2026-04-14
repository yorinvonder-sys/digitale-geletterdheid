import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';
import { SLO_KERNDOELEN, getKerndoelBadgeClasses, type SloKerndoelCode } from '../../config/sloKerndoelen';

type RowStatus = 'Gedekt' | 'Deels gedekt' | 'Niet gedekt';

const SloRow: React.FC<{ code: SloKerndoelCode; status: RowStatus }> = ({ code, status }) => {
    const kd = SLO_KERNDOELEN[code];
    if (!kd) return null;

    const statusClasses =
        status === 'Gedekt' ? 'bg-emerald-50 text-emerald-600'
            : status === 'Deels gedekt' ? 'bg-amber-50 text-amber-600'
                : 'bg-rose-50 text-rose-600';

    return (
        <tr className="border-b border-slate-50 text-sm">
            <td className="py-4">
                <span className={`inline-block px-2 py-0.5 border rounded text-[11px] font-bold mr-2 ${getKerndoelBadgeClasses(code)}`}>
                    {code}
                </span>
                <span className="font-medium text-slate-900">{kd.label}</span>
                <span className="block text-xs text-slate-500 mt-1 max-w-xl">{kd.omschrijving}</span>
            </td>
            <td className="py-4 text-slate-500 align-top">{kd.domein}</td>
            <td className="py-4 align-top">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusClasses}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
};

const REGULIER_ROWS: Array<{ code: SloKerndoelCode; status: RowStatus }> = [
    { code: '21A', status: 'Gedekt' },
    { code: '21B', status: 'Gedekt' },
    { code: '21C', status: 'Gedekt' },
    { code: '21D', status: 'Gedekt' },
    { code: '22A', status: 'Gedekt' },
    { code: '22B', status: 'Deels gedekt' },
    { code: '23A', status: 'Gedekt' },
    { code: '23B', status: 'Gedekt' },
    { code: '23C', status: 'Deels gedekt' },
];

const VSO_ROWS: Array<{ code: SloKerndoelCode; status: RowStatus }> = [
    { code: '18A', status: 'Gedekt' },
    { code: '18B', status: 'Gedekt' },
    { code: '18C', status: 'Gedekt' },
    { code: '19A', status: 'Gedekt' },
    { code: '20A', status: 'Gedekt' },
    { code: '20B', status: 'Gedekt' },
];

export const SloRapport: React.FC = () => {
    useEffect(() => {
        document.title = 'Voorbeeld SLO-Dekkingsrapport | DGSkills';
        trackEvent('seo_asset_view', { asset: 'slo-rapport-voorbeeld' });
    }, []);

    const totaalKerndoelen = REGULIER_ROWS.length + VSO_ROWS.length;
    const volledigGedekt = [...REGULIER_ROWS, ...VSO_ROWS].filter((r) => r.status === 'Gedekt').length;

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">SLO-Dekkingsrapport (Voorbeeld)</h1>
                        <p className="text-slate-500 text-sm">
                            Gegenereerd voor: Voorbeeldschool VO — Leerjaar 1 — Periode 1 &amp; 2
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                            SLO Definitieve Conceptkerndoelen Digitale Geletterdheid (sept. 2025) + Functionele Kerndoelen VSO (nov. 2025)
                        </p>
                    </div>
                    <img src="/mascot/pip-logo.webp" alt="DGSkills" className="w-10 h-10 object-contain opacity-20" />
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Missies Voltooid</div>
                        <div className="text-xl font-bold text-slate-900">1.240</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Kerndoelen</div>
                        <div className="text-xl font-bold text-slate-900">{volledigGedekt} / {totaalKerndoelen}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Gem. Score</div>
                        <div className="text-xl font-bold text-slate-900">84%</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Status</div>
                        <div className="text-xl font-bold text-emerald-600">Inspectie-proof</div>
                    </div>
                </div>

                <section className="mb-10">
                    <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Regulier VO — Kerndoelen 21A–23C</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-4 w-1/2">SLO Kerndoel</th>
                                <th className="pb-4">Domein</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {REGULIER_ROWS.map((row) => (
                                <SloRow key={row.code} code={row.code} status={row.status} />
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mb-10">
                    <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">VSO Functioneel — Kerndoelen 18A–20B</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-4 w-1/2">SLO Kerndoel</th>
                                <th className="pb-4">Domein</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {VSO_ROWS.map((row) => (
                                <SloRow key={row.code} code={row.code} status={row.status} />
                            ))}
                        </tbody>
                    </table>
                </section>

                <p className="text-xs text-slate-400 italic mb-8">
                    Voorbeeldrapport — de echte rapportage wordt per klas, leerjaar en periode automatisch gegenereerd op basis van voltooide missies en beoordelingsresultaten.
                </p>

                <div className="mt-4 p-6 bg-indigo-50 rounded-2xl flex items-center justify-between no-print">
                    <p className="text-sm text-indigo-900 font-medium">Wil je dit rapport ook voor jouw school?</p>
                    <a href="/digitale-geletterdheid-vo" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm">Start Gratis Pilot</a>
                </div>
            </div>
        </div>
    );
};
