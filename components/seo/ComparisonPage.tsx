import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const FeatureRow = ({ feature, dgskills, other }: { feature: string; dgskills: boolean; other: boolean }) => (
    <tr className="border-b border-slate-100">
        <td className="py-4 text-sm font-medium text-slate-700">{feature}</td>
        <td className="py-4 text-center">
            {dgskills ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-slate-300">—</span>}
        </td>
        <td className="py-4 text-center">
            {other ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-slate-300">—</span>}
        </td>
    </tr>
);

export const ComparisonPage: React.FC<{ competitor: 'digit-vo' | 'basicly' }> = ({ competitor }) => {
    const competitorName = competitor === 'digit-vo' ? 'DIGIT-vo' : 'Basicly';

    useEffect(() => {
        document.title = `DGSkills vs ${competitorName} | Vergelijking Digitale Geletterdheid`;
        trackEvent('seo_page_view', { cluster: 'vergelijking', page: competitorName });
    }, [competitorName]);

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">DGSkills vs {competitorName}</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Een objectieve vergelijking tussen de twee meest gebruikte methodes voor digitale geletterdheid in het voortgezet onderwijs.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-16">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="p-6">Feature</th>
                                <th className="p-6 text-center text-indigo-600">DGSkills</th>
                                <th className="p-6 text-center">{competitorName}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <FeatureRow feature="Interactieve AI-Missies" dgskills={true} other={false} />
                            <FeatureRow feature="SLO Kerndoelen 2025 Dekking" dgskills={true} other={true} />
                            <FeatureRow feature="Gamification (XP, Badges, Avatars)" dgskills={true} other={competitor === 'basicly'} />
                            <FeatureRow feature="Real-time Docenten Dashboard" dgskills={true} other={true} />
                            <FeatureRow feature="AVG-compliant & EU Data Opslag" dgskills={true} other={true} />
                            <FeatureRow feature="Geen Installatie Nodig (Web-only)" dgskills={true} other={true} />
                            <FeatureRow feature="Focus op Praktijkonderwijs & VSO" dgskills={true} other={false} />
                            <FeatureRow feature="Geautomatiseerde Inspectie-Rapporten" dgskills={true} other={false} />
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-4">Wanneer kiezen voor DGSkills?</h3>
                        <p className="text-indigo-800 text-sm leading-relaxed">
                            DGSkills is de beste keuze als je een methode zoekt die leerlingen écht boeit door gamification en AI. Het is specifiek ontworpen om de werkdruk van docenten te verlagen door automatisering.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Wanneer kiezen voor {competitorName}?</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {competitorName} is een gevestigde naam met een brede basis. Als je school al jarenlang gebruikmaakt van hun ecosysteem en geen behoefte heeft aan nieuwe AI-gedreven didactiek, kan het een veilige keuze blijven.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <h4 className="text-xl font-bold mb-6">Zelf het verschil ervaren?</h4>
                    <a href="/digitale-geletterdheid-vo" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                        Start een Gratis Pilot
                    </a>
                </div>
            </div>
        </div>
    );
};
