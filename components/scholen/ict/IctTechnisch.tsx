import React from 'react';

const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const IctTechnisch: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-slate-900 mb-6">Technische Vereisten & Implementatie</h1>
                <p className="text-lg text-slate-600 mb-12 max-w-2xl">
                    DGSkills is een web-based platform. Dit betekent: geen installatie, 
                    geen plugins en minimale configuratie voor de ICT-afdeling.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">1</span>
                            Systeemvereisten
                        </h2>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Ondersteunde Browsers</p>
                                        <p className="text-slate-500 text-xs">Recentste 2 versies van Chrome, Edge, Safari en Firefox.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Devices</p>
                                        <p className="text-slate-500 text-xs">Chromebooks, iPads (iPadOS 15+), Windows 10/11 en macOS.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Geen installatie</p>
                                        <p className="text-slate-500 text-xs">Werkt volledig in de browser. Geen MSI-pakketten of App Store downloads nodig.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">2</span>
                            Netwerk & Firewall
                        </h2>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Protocol</p>
                                        <p className="text-slate-500 text-xs">HTTPS over poort 443. Al het verkeer is versleuteld via TLS 1.3.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Domeinen op de allowlist</p>
                                        <p className="text-slate-500 text-xs">*.dgskills.app, *.supabase.co, *.googleapis.com.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500"><IconCheck /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Bandbreedte</p>
                                        <p className="text-slate-500 text-xs">Geoptimaliseerd voor gemiddelde schoolverbindingen. Laag verbruik per leerling.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white">
                    <h2 className="text-2xl font-bold mb-8">Implementatie stappenplan voor ICT</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden sm:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-indigo-500/30 -z-0"></div>
                        
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-indigo-900 text-white flex items-center justify-center font-bold mx-auto mb-4">1</div>
                            <h4 className="font-bold text-sm mb-2">Checklist</h4>
                            <p className="text-xs text-indigo-200">Doorloop de technische vereisten en allowlist.</p>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-indigo-900 text-white flex items-center justify-center font-bold mx-auto mb-4">2</div>
                            <h4 className="font-bold text-sm mb-2">SSO Koppeling</h4>
                            <p className="text-xs text-indigo-200">Activeer login via Microsoft of Google (5 min).</p>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-indigo-900 text-white flex items-center justify-center font-bold mx-auto mb-4">3</div>
                            <h4 className="font-bold text-sm mb-2">Test Run</h4>
                            <p className="text-xs text-indigo-200">Korte validatie met een test-account of kleine groep.</p>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-indigo-900 text-white flex items-center justify-center font-bold mx-auto mb-4">4</div>
                            <h4 className="font-bold text-sm mb-2">Go-Live</h4>
                            <p className="text-xs text-indigo-200">Volledige toegang voor docenten en leerlingen.</p>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <a
                            href="/#gratis-pilot"
                            className="inline-block px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-colors"
                        >
                            Vraag ICT Implementatie-gids aan
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
