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
        <div className="min-h-screen bg-duck-bg py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-duck-ink/60 hover:text-duck-acid font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-duck-ink mb-6">Service & Support SLA</h1>
                <p className="text-lg text-duck-ink/60 mb-12 max-w-2xl">
                    Wij staan voor betrouwbaarheid. Onze Service Level Agreement (SLA) garandeert dat scholen 
                    altijd kunnen rekenen op snelle ondersteuning en een stabiel platform.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-duck-ink/15">
                        <div className="flex items-center gap-3 text-duck-acid mb-4">
                            <IconClock />
                            <h3 className="font-bold text-duck-ink">Supporturen</h3>
                        </div>
                        <p className="text-sm text-duck-ink/60 leading-relaxed">
                            Onze helpdesk is bereikbaar op werkdagen (maandag t/m vrijdag) van <strong>08:30 tot 17:00</strong>.
                            Tijdens examenperiodes bieden wij uitgebreide standby-support.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-duck-ink/15">
                        <div className="flex items-center gap-3 text-duck-ink mb-4">
                            <IconClock />
                            <h3 className="font-bold text-duck-ink">Uptime Garantie</h3>
                        </div>
                        <p className="text-sm text-duck-ink/60 leading-relaxed">
                            Wij garanderen een platform-beschikbaarheid van <strong>99,5%</strong> per kwartaal. 
                            Gepland onderhoud vindt altijd buiten schooluren (na 18:00 of in weekenden) plaats.
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-sm border border-duck-ink/15 overflow-hidden mb-16">
                    <div className="p-6 border-b border-duck-ink/15 bg-duck-bg/50">
                        <h2 className="font-bold text-duck-ink">Responstijden & Prioriteiten</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-duck-ink/60 uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Prioriteit</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Omschrijving</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Eerste Reactie</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Streef-oplossing</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-duck-error/10 transition-colors">
                                    <td className="px-6 py-4 border-b border-duck-ink/15"><span className="text-duck-error font-bold">P1 - Kritiek</span></td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">Platform volledig onbereikbaar voor alle gebruikers.</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 font-medium text-duck-ink">binnen 2-4 uur</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">8 uur</td>
                                </tr>
                                <tr className="hover:bg-duck-acid/20 transition-colors">
                                    <td className="px-6 py-4 border-b border-duck-ink/15"><span className="text-duck-acid font-bold">P2 - Hoog</span></td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">Kernfunctionaliteit werkt niet (bijv. inloggen faalt).</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 font-medium text-duck-ink">binnen 8 uur</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">1 werkdag</td>
                                </tr>
                                <tr className="hover:bg-duck-bg transition-colors">
                                    <td className="px-6 py-4 border-b border-duck-ink/15"><span className="text-duck-ink font-bold">P3 - Normaal</span></td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">Vragen over gebruik, kleine bugs of wensen.</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 font-medium text-duck-ink">binnen 2 werkdagen</td>
                                    <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">volgende release</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="bg-duck-ink rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-4">Escalatiepad</h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                        Mocht een incident niet naar tevredenheid worden opgelost binnen de SLA-termijnen,
                        dan beschikken wij over een vastgelegd escalatiepad naar onze Customer Success Manager en Technisch Directeur.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-duck-acid uppercase mb-1">Eerstelijns</p>
                            <p className="text-sm font-bold">Support Desk</p>
                            <p className="text-xs text-white/60">support@dgskills.app</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-duck-acid uppercase mb-1">Tweedelijns</p>
                            <p className="text-sm font-bold">Account Management</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-duck-acid uppercase mb-1">Eindverantwoordelijk</p>
                            <p className="text-sm font-bold">CTO / Directie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
