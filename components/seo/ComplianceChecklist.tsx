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
                        <p className="text-slate-500 text-sm">Versie 2026.2 — DGSkills Resource</p>
                        <p className="text-slate-400 text-xs mt-1">
                            Inclusief EU AI Act Annex III 3(b) — hoog-risico verplichtingen (deadline 2 aug 2026)
                        </p>
                    </div>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors no-print">
                        Print / Opslaan als PDF
                    </button>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">1. Juridische Basis</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Is er een geldige Verwerkersovereenkomst (DPA, Model 4.0) getekend met de leverancier?</CheckItem>
                            <CheckItem>Is de software opgenomen in het verwerkingsregister van de school (Art. 30 AVG)?</CheckItem>
                            <CheckItem>Is er een DPIA uitgevoerd voor het gebruik van AI in de klas (Art. 35 AVG)?</CheckItem>
                            <CheckItem>Is de classificatie onder de EU AI Act bekend? (DGSkills = hoog risico, Annex III punt 3b)</CheckItem>
                            <CheckItem>Voldoet de tool aan de transparantie-eisen van de EU AI Act (Art. 13 + 50)?</CheckItem>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">2. Data & Privacy</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Wordt alle data opgeslagen binnen de Europese Economische Ruimte (EER)?</CheckItem>
                            <CheckItem>Is er een &lsquo;Zero-Training Guarantee&rsquo; (data wordt niet gebruikt voor model-training)?</CheckItem>
                            <CheckItem>Worden persoonsgegevens geminimaliseerd (geen BSN, geen medische data)?</CheckItem>
                            <CheckItem>Is SSO (Single Sign-On) via Microsoft/Google correct geconfigureerd?</CheckItem>
                            <CheckItem>Is ouderlijke toestemming geregeld voor leerlingen &lt; 16 jaar (Art. 8 AVG)?</CheckItem>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">3. Didactiek & Toezicht</h2>
                        <ul className="list-none p-0">
                            <CheckItem>Wordt AI duidelijk gemarkeerd als zodanig voor leerlingen?</CheckItem>
                            <CheckItem>Heeft de docent real-time inzicht in de AI-interacties van leerlingen?</CheckItem>
                            <CheckItem>Zijn er safety filters actief op schadelijke content en prompt injection?</CheckItem>
                            <CheckItem>Is de leerlijn gekoppeld aan de SLO-kerndoelen digitale geletterdheid (21A–23C en VSO 18A–20B)?</CheckItem>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">
                            4. EU AI Act — Hoog Risico (Annex III 3b)
                        </h2>
                        <p className="text-xs text-slate-400 mb-4 italic">
                            Voor AI-systemen die leerresultaten beoordelen. Verplichtingen zijn afdwingbaar vanaf 2 augustus 2026.
                        </p>
                        <ul className="list-none p-0">
                            <CheckItem>Is er een risk management system ingericht conform Art. 9 (risicoregister, mitigaties, review-cyclus)?</CheckItem>
                            <CheckItem>Is er data governance en documentatie over trainingsdata en bias (Art. 10)?</CheckItem>
                            <CheckItem>Is er technische documentatie beschikbaar conform Art. 11 + Bijlage IV (Annex IV)?</CheckItem>
                            <CheckItem>Worden AI-interacties en beoordelingsresultaten audit-logged conform Art. 12?</CheckItem>
                            <CheckItem>Is er transparantie richting leerling en docent over AI-gebruik en AI-beslissingen (Art. 13)?</CheckItem>
                            <CheckItem>Heeft de docent human oversight / override-mogelijkheid voor AI-gegenereerde beoordelingen (Art. 14)?</CheckItem>
                            <CheckItem>Zijn accuraatheids- en cybersecurity-eisen aantoonbaar geborgd (Art. 15)?</CheckItem>
                            <CheckItem>Is er een conformiteitsbeoordelingsplan met tijdlijn naar 2 augustus 2026?</CheckItem>
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
