import React from 'react';
import { ArrowLeft, Cookie, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict/privacy" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Terug naar Security & Privacy
                </a>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Cookie className="text-amber-600" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Cookiebeleid</h1>
                            <p className="text-slate-500">Versie 1.1 — Laatst bijgewerkt: 14 februari 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg leading-relaxed text-slate-600">
                            Wij gebruiken een minimale set aan cookies om het platform te laten werken en om het gebruik anoniem te analyseren. 
                            Wij gebruiken <strong>geen</strong> tracking cookies voor advertenties of profilering.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">1. Soorten Cookies</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-slate-200 my-6">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="border border-slate-200 p-3 text-left font-bold text-sm">Naam</th>
                                        <th className="border border-slate-200 p-3 text-left font-bold text-sm">Doel</th>
                                        <th className="border border-slate-200 p-3 text-left font-bold text-sm">Type</th>
                                        <th className="border border-slate-200 p-3 text-left font-bold text-sm">Duur</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr>
                                        <td className="border border-slate-200 p-3">sb-session</td>
                                        <td className="border border-slate-200 p-3">Inloggen en sessiebeheer.</td>
                                        <td className="border border-slate-200 p-3">Essentieel</td>
                                        <td className="border border-slate-200 p-3">Sessie</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-200 p-3">cookie-consent-status</td>
                                        <td className="border border-slate-200 p-3">Opslaan van jouw cookievoorkeuren. <em>(Opgeslagen in localStorage, geen cookie.)</em></td>
                                        <td className="border border-slate-200 p-3">Essentieel</td>
                                        <td className="border border-slate-200 p-3">Tot intrekking/verwijdering</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-200 p-3">Interne klik-analyse</td>
                                        <td className="border border-slate-200 p-3">Anonieme gebruiksstatistieken voor productverbetering (first-party).</td>
                                        <td className="border border-slate-200 p-3">Analytics</td>
                                        <td className="border border-slate-200 p-3">Sessie / Geaggregeerd</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">2. LocalStorage en SessionStorage</h2>
                        <p>
                            Naast cookies gebruikt de app <strong>localStorage</strong> en <strong>sessionStorage</strong> voor technische en beveiligingsdoeleinden (zoals sessiebeheer, voorkeuren en rate limiting). Deze gegevens blijven op uw apparaat en worden niet naar derden gestuurd.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">3. Toestemming beheren</h2>
                        <p>
                            Bij je eerste bezoek heb je een keuze gemaakt via de cookiebanner. Je kunt deze keuze op elk moment 
                            herzien of intrekken. Voor de volledigheid: wij slaan de status van uw toestemming op in uw browser (local storage) 
                            en loggen de actie anoniem in ons audit-systeem om te kunnen voldoen aan de AVG-bewijsplicht.
                        </p>
                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 my-6">
                            <ShieldAlert size={24} className="text-slate-400" />
                            <div>
                                <p className="font-bold text-slate-800 mb-1">Status: Beheer uw voorkeuren</p>
                                <button 
                                    onClick={() => {
                                        localStorage.removeItem('cookie-consent-status');
                                        window.location.reload();
                                    }}
                                    className="text-indigo-600 font-bold underline underline-offset-2 hover:text-indigo-800 transition-colors"
                                >
                                    Klik hier om de cookie-banner opnieuw te tonen
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mt-3">
                            <strong>Minderjarigen:</strong> DGSkills wordt gebruikt binnen de schoolcontext onder verantwoordelijkheid van het schoolbestuur.
                            Voor verwerkingen die juridisch op toestemming rusten, gelden de regels voor minderjarigen conform AVG/UAVG.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">4. Derden en Privacy-waarborgen</h2>
                        <p>
                            Wij maken <strong>geen</strong> gebruik van Google Analytics of andere analytics-diensten van derden. 
                            Onze analyse-tool is "first-party", wat betekent dat:
                        </p>
                        <ul>
                            <li><strong>Geen datadelen:</strong> Jouw klikgedrag wordt nooit gedeeld met Google, Facebook of andere partijen.</li>
                            <li><strong>Geen profilering:</strong> De data wordt uitsluitend op geaggregeerd niveau gebruikt om te zien welke functies veel gebruikt worden, niet om individuele leerlingen te volgen.</li>
                            <li><strong>Gehost in de EU:</strong> Alle data blijft binnen onze beveiligde infrastructuur in Europa.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
