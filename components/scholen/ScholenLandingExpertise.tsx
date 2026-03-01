import React from 'react';

const IconBook = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
);

export const ScholenLandingExpertise: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Over de oprichter</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Gebouwd door een docent, voor docenten</h2>
                <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    DGSkills is ontwikkeld vanuit de lespraktijk — door iemand die zelf
                    voor de klas staat en weet wat er speelt.
                </p>
            </div>

            <div className="max-w-lg mx-auto">
                <div className="relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-[box-shadow] group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-5">
                            <IconBook />
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">Yorin Vonder</h4>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-4">Oprichter & Docent</p>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                            Als docent geschiedenis, informatievaardigheden en coördinator digitale
                            geletterdheid zag Yorin dat bestaande lesmethodes niet meer aansluiten
                            bij deze generatie: te weinig uitdaging, nauwelijks differentiatie en
                            leerlingen die afhaken. DGSkills is zijn oplossing — een methodiek die
                            leerlingen activeert en docenten ontzorgt.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">Digitale Geletterdheid</span>
                            <span className="text-[10px] font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">Geschiedenis</span>
                            <span className="text-[10px] font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">EdTech</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pilot school banner */}
            <div className="mt-10 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/15 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="flex items-center gap-5 relative">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10 flex-shrink-0" aria-hidden="true">
                        🎓
                    </div>
                    <div>
                        <p className="text-base font-bold text-white mb-1">Actieve samenwerking met pilotscholen</p>
                        <p className="text-sm text-indigo-200">
                            Het Almere College en toekomstige pilotscholen testen elke feature
                            in de praktijk — door docenten én leerlingen.
                        </p>
                    </div>
                </div>
                <a href="/ict/privacy" className="relative text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl transition-colors flex-shrink-0">
                    Compliance-belofte →
                </a>
            </div>
        </div>
    );
};
