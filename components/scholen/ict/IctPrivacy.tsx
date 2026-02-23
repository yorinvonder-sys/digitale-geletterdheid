import React from 'react';

const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconFileText = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);

export const IctPrivacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-slate-900 mb-6">Security & Privacy</h1>
                <p className="text-lg text-slate-600 mb-12 max-w-2xl">
                    Veiligheid en privacy zijn de basis van DGSkills. Wij voldoen aan de strengste AVG-normen voor het onderwijs en bieden volledige transparantie over onze datastromen.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                        <div className="text-indigo-600 mb-4"><IconFileText /></div>
                        <h3 className="font-bold text-slate-900 mb-2 text-sm">AVG-compliant</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Onze verwerkingen zijn volledig in lijn met de Algemene Verordening Gegevensbescherming (AVG).
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="text-emerald-600 mb-4"><IconFileText /></div>
                        <h3 className="font-bold text-slate-900 mb-2 text-sm">EU Data Residency</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Alle persoonlijke data van leerlingen en docenten wordt opgeslagen in de EER in een beveiligde Europese database (regio: Ierland).
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                        <div className="text-amber-600 mb-4"><IconFileText /></div>
                        <h3 className="font-bold text-slate-900 mb-2 text-sm">Inkoop Dossier</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Standaard Verwerkersovereenkomst (DPA) en DPIA-beoordeling beschikbaar voor ICT/FG.
                        </p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Onze Privacy Belofte</h2>
                    <ul className="space-y-4 text-slate-600">
                        <li><strong>Geen verkoop van data:</strong> Wij verkopen nooit leerling- of docentgegevens aan derden.</li>
                        <li><strong>Geen profilering:</strong> We gebruiken leerlingdata niet voor commerciële profilering of advertenties.</li>
                        <li><strong>Minimale datacollectie:</strong> We vragen alleen de gegevens die strikt noodzakelijk zijn voor het leerproces.</li>
                        <li><strong>Transparantie over AI:</strong> Onze AI-missies maken gebruik van API-modellen waarbij data niet wordt gebruikt om het model te trainen. <a href="/ict/privacy/ai" className="text-indigo-600 underline">Lees onze AI-Transparantieverklaring</a>.</li>
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href="/ict/privacy/policy" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">→ Volledige Privacyverklaring</a>
                        <a href="/ict/privacy/cookies" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">→ Cookiebeleid</a>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Downloads voor Functionarissen Gegevensbescherming</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group" onClick={() => window.open('/compliance/school-compliance-guide.html', '_blank')}>
                            <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-indigo-500"><IconFileText /></div>
                                <span className="text-sm font-medium text-slate-700">Privacy & Compliance Dossier (Volledig overzicht)</span>
                            </div>
                            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Bekijk</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group" onClick={() => window.open('/compliance/dpa-dgskills-v4.html', '_blank')}>
                            <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-indigo-500"><IconFileText /></div>
                                <span className="text-sm font-medium text-slate-700">Model Verwerkersovereenkomst (V4.0 - Pre-filled)</span>
                            </div>
                            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Bekijk</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group" onClick={() => window.open('/compliance/dpia-support-dgskills-v1.html', '_blank')}>
                            <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-indigo-500"><IconFileText /></div>
                                <span className="text-sm font-medium text-slate-700">Privacy Impact Assessment (DPIA) Support Document</span>
                            </div>
                            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Bekijk</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group" onClick={() => window.open('/ict/technisch', '_blank')}>
                            <div className="flex items-center gap-3">
                                <div className="text-slate-400 group-hover:text-indigo-500"><IconFileText /></div>
                                <span className="text-sm font-medium text-slate-700">Technisch Security Overzicht (Architecture & Encryption)</span>
                            </div>
                            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Bekijk</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
