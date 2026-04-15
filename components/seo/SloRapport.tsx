import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';
import { SLO_KERNDOELEN, SloKerndoelCode } from '../../config/sloKerndoelen';
import { getMissionsForKerndoel } from '../../config/slo-kerndoelen-mapping';

// Reguliere VO kerndoelen (domeinen 21-23) per officiële SLO september 2025 codes.
const REGULIER_VO_CODES: SloKerndoelCode[] = [
    '21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C',
];

type DomeinKleur = 'blue' | 'purple' | 'amber';

interface SloRow {
    code: SloKerndoelCode;
    label: string;
    domein: string;
    kleur: DomeinKleur;
    missionCount: number;
}

const DOMEIN_COLORS: Record<DomeinKleur, string> = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
};

const ROWS: SloRow[] = REGULIER_VO_CODES.map((code) => {
    const kerndoel = SLO_KERNDOELEN[code];
    return {
        code,
        label: kerndoel.label,
        domein: kerndoel.domein,
        kleur: kerndoel.kleur,
        missionCount: getMissionsForKerndoel(code).length,
    };
});

const DEKKING_COUNT = ROWS.filter((r) => r.missionCount > 0).length;
const TOTAL_MISSIONS = ROWS.reduce((acc, r) => acc + r.missionCount, 0);

export const SloRapport: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Voorbeeld SLO-Dekkingsrapport | DGSkills';
        trackEvent('seo_asset_view', { page: 'slo-rapport-voorbeeld' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full uppercase tracking-wide">
                                Voorbeeld · demorapport
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            SLO-Dekkingsrapport (Voorbeeld)
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Gegenereerd voor: Voorbeeldschool VO — fictieve data ter illustratie
                        </p>
                    </div>
                    <img
                        src="/mascot/pip-logo.webp"
                        alt="DGSkills"
                        className="w-10 h-10 object-contain opacity-20"
                    />
                </div>

                <div className="mb-10 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-600">
                    Dit rapport toont hoe een DGSkills-verantwoordingsrapport eruit ziet. De
                    leerling- en scoregegevens zijn fictief; de <strong>SLO-kerndoelen komen uit
                    het officiële SLO-conceptkader (september 2025)</strong> voor digitale
                    geletterdheid.
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                            Missies voltooid
                        </div>
                        <div className="text-xl font-bold text-slate-900">1.240</div>
                        <div className="text-[10px] text-slate-400 mt-1">voorbeeldwaarde</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                            Kerndoelen gedekt
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                            {DEKKING_COUNT} / {ROWS.length}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">regulier VO</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                            Missies in catalogus
                        </div>
                        <div className="text-xl font-bold text-slate-900">{TOTAL_MISSIONS}</div>
                        <div className="text-[10px] text-slate-400 mt-1">koppelingen totaal</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                            Gem. score
                        </div>
                        <div className="text-xl font-bold text-slate-900">84%</div>
                        <div className="text-[10px] text-slate-400 mt-1">voorbeeldwaarde</div>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="pb-4">Code</th>
                            <th className="pb-4">Kerndoel</th>
                            <th className="pb-4">Domein</th>
                            <th className="pb-4 text-right">Missies</th>
                            <th className="pb-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((row) => {
                            const colorClass = DOMEIN_COLORS[row.kleur];
                            const isCovered = row.missionCount > 0;
                            return (
                                <tr
                                    key={row.code}
                                    className="border-b border-slate-50 text-sm"
                                >
                                    <td className="py-4 font-mono font-bold text-slate-900">
                                        {row.code}
                                    </td>
                                    <td className="py-4 font-medium text-slate-900">
                                        {row.label}
                                    </td>
                                    <td className="py-4">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorClass}`}
                                        >
                                            {row.domein}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-slate-600 tabular-nums">
                                        {row.missionCount}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span
                                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                isCovered
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}
                                        >
                                            {isCovered ? 'Gedekt' : 'Nog niet'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="mt-8 p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                    <p className="mb-1">
                        <strong>Bron SLO-kerndoelen:</strong> SLO Definitieve conceptkerndoelen
                        digitale geletterdheid (september 2025). Missie-koppelingen worden
                        periodiek gevalideerd; laatste audit volgens projectnotities op 28 maart
                        2026.
                    </p>
                    <p>
                        Deze pagina is een demo van het rapport dat docenten en ICT-coördinatoren
                        binnen DGSkills zelf kunnen inzien voor hun eigen klassen.
                    </p>
                </div>

                <div className="mt-10 p-6 bg-indigo-50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                    <p className="text-sm text-indigo-900 font-medium">
                        Wil je dit rapport ook voor jouw school?
                    </p>
                    <a
                        href="/digitale-geletterdheid-vo"
                        className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                    >
                        Start gratis pilot
                    </a>
                </div>
            </div>
        </div>
    );
};
