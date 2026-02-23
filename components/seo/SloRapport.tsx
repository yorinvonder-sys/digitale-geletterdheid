import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const SloRow = ({ goal, domein, status }: { goal: string; domein: string; status: string }) => (
    <tr className="border-b border-slate-50 text-sm">
        <td className="py-4 font-medium text-slate-900">{goal}</td>
        <td className="py-4 text-slate-500">{domein}</td>
        <td className="py-4">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                status === 'Gedekt' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
                {status}
            </span>
        </td>
    </tr>
);

export const SloRapport: React.FC = () => {
    useEffect(() => {
        document.title = 'Voorbeeld SLO-Dekkingsrapport | DGSkills';
        trackEvent('seo_asset_view', { asset: 'slo-rapport-voorbeeld' });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">SLO-Dekkingsrapport (Voorbeeld)</h1>
                        <p className="text-slate-500 text-sm">Gegenereerd voor: Voorbeeldschool VO — Datum: 14 feb 2026</p>
                    </div>
                    <img src="/logo.svg" alt="DGSkills" className="w-10 h-10 opacity-20" />
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Missies Voltooid</div>
                        <div className="text-xl font-bold text-slate-900">1.240</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Kerndoelen</div>
                        <div className="text-xl font-bold text-slate-900">14 / 14</div>
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

                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="pb-4">SLO Kerndoel 2025</th>
                            <th className="pb-4">Domein</th>
                            <th className="pb-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <SloRow goal="1. Digitale systemen & infrastructuur" domein="Digitale vaardigheden" status="Gedekt" />
                        <SloRow goal="2. Veiligheid en privacy online" domein="Digitale vaardigheden" status="Gedekt" />
                        <SloRow goal="3. Zoeken en selecteren van info" domein="Informatievaardigheden" status="Gedekt" />
                        <SloRow goal="4. Beoordelen van informatie (AI)" domein="Informatievaardigheden" status="Gedekt" />
                        <SloRow goal="5. Creëren met media" domein="Mediawijsheid" status="Gedekt" />
                        <SloRow goal="6. Kritische reflectie op AI" domein="Mediawijsheid" status="Gedekt" />
                        <SloRow goal="7. Decompositie en algoritmes" domein="Computational Thinking" status="Gedekt" />
                        <SloRow goal="8. Programmeren en logica" domein="Computational Thinking" status="Gedekt" />
                    </tbody>
                </table>

                <div className="mt-12 p-6 bg-indigo-50 rounded-2xl flex items-center justify-between no-print">
                    <p className="text-sm text-indigo-900 font-medium">Wil je dit rapport ook voor jouw school?</p>
                    <a href="/digitale-geletterdheid-vo" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm">Start Gratis Pilot</a>
                </div>
            </div>
        </div>
    );
};
