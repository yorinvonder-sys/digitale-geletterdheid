import React from 'react';
import { trackEvent } from '../../services/analyticsService';

const FeatureMarker: React.FC<{ label: string; colorClass: string; barClass: string }> = ({ label, colorClass, barClass }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className={`w-1 h-3.5 rounded-full ${barClass}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
            {label}
        </span>
    </div>
);

export const ScholenLandingIct: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Voor ICT & Informatiemanagers
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    We begrijpen dat een nieuwe tool moet passen in de bestaande architectuur. 
                    DGSkills is ontworpen voor beheersbaarheid, veiligheid en snelle adoptie.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                    <FeatureMarker label="Identiteit" colorClass="text-indigo-600" barClass="bg-indigo-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">SSO & Identiteit</h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                        Geen gedoe met losse accounts. SSO via Microsoft 365. Google Workspace en SURFconext op de roadmap. 
                        Veilige authenticatie via bestaande schoolaccounts.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">Microsoft 365</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">Google Workspace</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">SURFconext</span>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                    <FeatureMarker label="Security" colorClass="text-emerald-600" barClass="bg-emerald-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Security & Privacy</h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                        Volledig AVG-compliant. Data-opslag in een beveiligde Europese database. 
                        Standaard verwerkersovereenkomst (DPA) en DPIA-support beschikbaar voor inkoop.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">AVG / GDPR</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">EU Data</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">DPA Ready</span>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                    <FeatureMarker label="Integratie" colorClass="text-amber-600" barClass="bg-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Integraties & Export</h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                        Koppel voortgang aan je LVS of ELO. Ondersteuning voor CSV-exports naar Magister en SOMtoday. 
                        LTI-koppelingen gepland voor naadloze integratie.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">Magister</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">SOMtoday</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">LTI / API</span>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                    <FeatureMarker label="Support" colorClass="text-blue-600" barClass="bg-blue-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Service & Support</h3>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                        Gegarandeerde responstijden via onze SLA. Persoonlijke support voor ICT-beheerders bij uitrol en configuratie. 
                        Streefdoel: 99,5% beschikbaarheid.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">SLA Inbegrepen</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">99,5% Streefdoel</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tight">NL Support</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Klaar voor de ICT-check?</h3>
                            <p className="text-slate-400 max-w-lg mb-0">
                                Download onze technische whitepaper met alle details over security, 
                                architectuur en privacy, of plan een korte call met onze technisch lead.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                            <a 
                                href="/ict/technisch" 
                                onClick={() => trackEvent('ict_subpage_view', { page: 'technisch' })}
                                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors text-center"
                            >
                                Technische Details
                            </a>
                            <a 
                                href="/ict/privacy" 
                                onClick={() => trackEvent('ict_subpage_view', { page: 'privacy' })}
                                className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-center"
                            >
                                Privacy & Security
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
                        <a 
                            href="/ict/technisch" 
                            onClick={() => trackEvent('ict_subpage_view', { page: 'technisch_bottom' })}
                            className="group"
                        >
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-300 transition-colors">Browsers & Eisen</p>
                            <p className="text-sm text-slate-300">Chrome, Edge, Safari. Geen plugins nodig.</p>
                        </a>
                        <a 
                            href="/ict/integraties" 
                            onClick={() => trackEvent('ict_subpage_view', { page: 'integraties' })}
                            className="group"
                        >
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-300 transition-colors">Integraties & SSO</p>
                            <p className="text-sm text-slate-300">Microsoft 365, Google, SURFconext.</p>
                        </a>
                        <a 
                            href="/ict/privacy" 
                            onClick={() => trackEvent('ict_subpage_view', { page: 'privacy_bottom' })}
                            className="group"
                        >
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-300 transition-colors">Privacy & Compliance</p>
                            <p className="text-sm text-slate-300">AVG compliant. Data opslag in EU.</p>
                        </a>
                        <a 
                            href="/ict/support" 
                            onClick={() => trackEvent('ict_subpage_view', { page: 'support' })}
                            className="group"
                        >
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-300 transition-colors">Support & SLA</p>
                            <p className="text-sm text-slate-300">Streefdoel: 99,5% beschikbaarheid. NL support desk.</p>
                        </a>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Neem contact op</h3>
                    <p className="text-sm text-slate-500">Heb je vragen over implementatie, privacy of een demo? We helpen je graag.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                    <a
                        href="mailto:info@dgskills.app"
                        onClick={() => trackEvent('contact_click', { method: 'email', source: 'ict_page' })}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                    >
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600" aria-hidden="true">
                                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Mail ons</p>
                            <p className="text-xs text-slate-500">info@dgskills.app</p>
                        </div>
                    </a>
                    <a
                        href="/#gratis-pilot"
                        onClick={() => trackEvent('contact_click', { method: 'form', source: 'ict_page' })}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                    >
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600" aria-hidden="true">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Pilot aanvragen</p>
                            <p className="text-xs text-slate-500">Gratis, binnen 2 werkdagen reactie</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};
