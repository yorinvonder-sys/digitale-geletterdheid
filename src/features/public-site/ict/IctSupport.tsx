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
        <div className="min-h-screen bg-lab-cream py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-lab-muted hover:text-lab-coral font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-lab-ink mb-6">Service & Support SLA</h1>
                <p className="text-lg text-lab-muted mb-12 max-w-2xl">
                    Wij staan voor betrouwbaarheid. Onze Service Level Agreement (SLA) garandeert dat scholen 
                    altijd kunnen rekenen op snelle ondersteuning en een stabiel platform.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-lab-line">
                        <div className="flex items-center gap-3 text-lab-coral mb-4">
                            <IconClock />
                            <h3 className="font-bold text-lab-ink">Supporturen</h3>
                        </div>
                        <p className="text-sm text-lab-muted leading-relaxed">
                            Onze helpdesk is bereikbaar op werkdagen (maandag t/m vrijdag) van <strong>08:30 tot 17:00</strong>. 
                            Tijdens examenperiodes bieden wij uitgebreide standby-support.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-lab-line">
                        <div className="flex items-center gap-3 text-lab-sage mb-4">
                            <IconClock />
                            <h3 className="font-bold text-lab-ink">Uptime Garantie</h3>
                        </div>
                        <p className="text-sm text-lab-muted leading-relaxed">
                            Wij garanderen een platform-beschikbaarheid van <strong>99,5%</strong> per kwartaal. 
                            Gepland onderhoud vindt altijd buiten schooluren (na 18:00 of in weekenden) plaats.
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-sm border border-lab-line overflow-hidden mb-16">
                    <div className="p-6 border-b border-lab-line bg-lab-cream/50">
                        <h2 className="font-bold text-lab-ink">Responstijden & Prioriteiten</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-lab-muted uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-lab-line">Prioriteit</th>
                                    <th className="px-6 py-4 border-b border-lab-line">Omschrijving</th>
                                    <th className="px-6 py-4 border-b border-lab-line">Eerste Reactie</th>
                                    <th className="px-6 py-4 border-b border-lab-line">Streef-oplossing</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-lab-coral/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-lab-line"><span className="text-lab-coral font-bold">P1 - Kritiek</span></td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">Platform volledig onbereikbaar voor alle gebruikers.</td>
                                    <td className="px-6 py-4 border-b border-lab-line font-medium text-lab-ink">binnen 2-4 uur</td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">8 uur</td>
                                </tr>
                                <tr className="hover:bg-lab-gold/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-lab-line"><span className="text-lab-gold font-bold">P2 - Hoog</span></td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">Kernfunctionaliteit werkt niet (bijv. inloggen faalt).</td>
                                    <td className="px-6 py-4 border-b border-lab-line font-medium text-lab-ink">binnen 8 uur</td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">1 werkdag</td>
                                </tr>
                                <tr className="hover:bg-lab-teal/30 transition-colors">
                                    <td className="px-6 py-4 border-b border-lab-line"><span className="text-lab-teal font-bold">P3 - Normaal</span></td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">Vragen over gebruik, kleine bugs of wensen.</td>
                                    <td className="px-6 py-4 border-b border-lab-line font-medium text-lab-ink">binnen 2 werkdagen</td>
                                    <td className="px-6 py-4 border-b border-lab-line text-lab-muted">volgende release</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="bg-lab-ink rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-4">Escalatiepad</h3>
                    <p className="text-lab-muted text-sm mb-6 leading-relaxed">
                        Mocht een incident niet naar tevredenheid worden opgelost binnen de SLA-termijnen, 
                        dan beschikken wij over een vastgelegd escalatiepad naar onze Customer Success Manager en Technisch Directeur.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-lab-coral uppercase mb-1">Eerstelijns</p>
                            <p className="text-sm font-bold">Support Desk</p>
                            <p className="text-xs text-lab-muted">support@dgskills.app</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-lab-coral uppercase mb-1">Tweedelijns</p>
                            <p className="text-sm font-bold">Account Management</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-lab-coral uppercase mb-1">Eindverantwoordelijk</p>
                            <p className="text-sm font-bold">CTO / Directie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
