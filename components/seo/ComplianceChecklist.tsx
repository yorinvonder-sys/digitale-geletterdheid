import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const CheckItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
        <div className="mt-1 w-5 h-5 border-2 border-indigo-200 rounded flex items-center justify-center text-transparent hover:text-indigo-600 cursor-pointer transition-colors">
            ✓
        </div>
        <span className="text-slate-700 text-sm">{children}</span>
    </li>
);

export const ComplianceChecklist: React.FC = () => {
    useEffect(() => {
        document.title = 'AI-Compliance Checklist voor VO Scholen | DGSkills';
        trackEvent('seo_asset_view', { asset: 'compliance-checklist' });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">AI-Compliance Checklist VO</h1>
                        <p className="text-slate-500 text-sm">Versie 2026.1 — DGSkills Resource</p>
                    </div>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors no-print">
                        Print / Opslaan als PDF
                    </button>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">1. Juridische Basis</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Is er een geldige Verwerkersovereenkomst (DPA) getekend met de leverancier?</CheckItem>
                            <CheckItem>Is de software opgenomen in het verwerkingsregister van de school?</CheckItem>
                            <CheckItem>Is er een DPIA uitgevoerd voor het gebruik van AI in de klas?</CheckItem>
                            <CheckItem>Voldoet de tool aan de transparantie-eisen van de EU AI Act (Art. 50)?</CheckItem>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">2. Data & Privacy</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Wordt alle data opgeslagen binnen de Europese Economische Ruimte (EER)?</CheckItem>
                            <CheckItem>Is er een 'Zero-Training Guarantee' (data wordt niet gebruikt voor model-training)?</CheckItem>
                            <CheckItem>Worden persoonsgegevens geminimaliseerd (geen BSN, geen medische data)?</CheckItem>
                            <CheckItem>Is SSO (Single Sign-On) via Microsoft/Google correct geconfigureerd?</CheckItem>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">3. Didactiek & Toezicht</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Wordt AI duidelijk gemarkeerd als zodanig voor leerlingen?</CheckItem>
                            <CheckItem>Heeft de docent real-time inzicht in de AI-interacties van leerlingen?</CheckItem>
                            <CheckItem>Zijn er safety filters actief op schadelijke content?</CheckItem>
                            <CheckItem>Is de leerlijn gekoppeld aan de SLO-kerndoelen digitale geletterdheid?</CheckItem>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 mb-4 italic">Deze checklist is een hulpmiddel en vervangt geen juridisch advies van je FG.</p>
                    <a href="/" className="text-indigo-600 font-bold text-sm">dgskills.app</a>
                </div>
            </div>
        </div>
    );
};
