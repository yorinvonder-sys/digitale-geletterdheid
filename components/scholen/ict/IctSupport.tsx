import React from 'react';

const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export const IctSupport: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-slate-900 mb-6">Service & Support SLA</h1>
                <p className="text-lg text-slate-600 mb-12 max-w-2xl">
                    Wij staan voor betrouwbaarheid. Onze Service Level Agreement (SLA) garandeert dat scholen 
                    altijd kunnen rekenen op snelle ondersteuning en een stabiel platform.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 text-indigo-600 mb-4">
                            <IconClock />
                            <h3 className="font-bold text-slate-900">Supporturen</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Onze helpdesk is bereikbaar op werkdagen (maandag t/m vrijdag) van <strong>08:30 tot 17:00</strong>. 
                            Tijdens examenperiodes bieden wij uitgebreide standby-support.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 text-emerald-600 mb-4">
                            <IconClock />
                            <h3 className="font-bold text-slate-900">Uptime Garantie</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Wij garanderen een platform-beschikbaarheid van <strong>99,5%</strong> per kwartaal. 
                            Gepland onderhoud vindt altijd buiten schooluren (na 18:00 of in weekenden) plaats.
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-16">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-900">Responstijden & Prioriteiten</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-slate-100">Prioriteit</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Omschrijving</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Eerste Reactie</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Streef-oplossing</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-red-50/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100"><span className="text-red-600 font-bold">P1 - Kritiek</span></td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">Platform volledig onbereikbaar voor alle gebruikers.</td>
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">binnen 2-4 uur</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">8 uur</td>
                                </tr>
                                <tr className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100"><span className="text-amber-600 font-bold">P2 - Hoog</span></td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">Kernfunctionaliteit werkt niet (bijv. inloggen faalt).</td>
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">binnen 8 uur</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">1 werkdag</td>
                                </tr>
                                <tr className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100"><span className="text-blue-600 font-bold">P3 - Normaal</span></td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">Vragen over gebruik, kleine bugs of wensen.</td>
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">binnen 2 werkdagen</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">volgende release</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="bg-slate-900 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-4">Escalatiepad</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Mocht een incident niet naar tevredenheid worden opgelost binnen de SLA-termijnen, 
                        dan beschikken wij over een vastgelegd escalatiepad naar onze Customer Success Manager en Technisch Directeur.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px] p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Eerstelijns</p>
                            <p className="text-sm font-bold">Support Desk</p>
                            <p className="text-xs text-slate-500">support@dgskills.app</p>
                        </div>
                        <div className="flex-1 min-w-[200px] p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Tweedelijns</p>
                            <p className="text-sm font-bold">Account Management</p>
                        </div>
                        <div className="flex-1 min-w-[200px] p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Eindverantwoordelijk</p>
                            <p className="text-sm font-bold">CTO / Directie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
