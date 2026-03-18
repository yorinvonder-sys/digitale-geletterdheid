import React from 'react';

export const ScholenLandingExpertise: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: '#D97757' }}>Over de oprichter</p>
                <h2 className="text-2xl md:text-3xl font-medium mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>Gebouwd door een docent, voor docenten</h2>
                <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6B66' }}>
                    DGSkills is ontwikkeld vanuit de lespraktijk — door iemand die zelf
                    voor de klas staat en weet wat er speelt.
                </p>
            </div>

            <div className="max-w-lg mx-auto">
                <div className="relative bg-white rounded-2xl border p-8 hover:shadow-lg transition-[box-shadow] group overflow-hidden" style={{ borderColor: '#E8E6DF' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#F5F3EC' }} />
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 overflow-hidden" style={{ backgroundColor: '#D9775712' }}>
                            <img src="/illustrations/expertise-founder.webp" alt="" className="w-10 h-10 object-contain" loading="lazy" decoding="async" aria-hidden="true" />
                        </div>
                        <h3 className="font-medium text-lg mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>Yorin Vonder</h3>
                        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#D97757' }}>Oprichter & Docent</p>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B66' }}>
                            Als docent geschiedenis, informatievaardigheden en coördinator digitale
                            geletterdheid zag Yorin dat bestaande lesmethodes niet meer aansluiten
                            bij deze generatie: te weinig uitdaging, nauwelijks differentiatie en
                            leerlingen die afhaken. DGSkills is zijn oplossing — een methodiek die
                            leerlingen activeert en docenten ontzorgt.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] font-medium border px-2 py-0.5 rounded-full" style={{ color: '#9C9C95', borderColor: '#E8E6DF' }}>Digitale Geletterdheid</span>
                            <span className="text-[10px] font-medium border px-2 py-0.5 rounded-full" style={{ color: '#9C9C95', borderColor: '#E8E6DF' }}>Geschiedenis</span>
                            <span className="text-[10px] font-medium border px-2 py-0.5 rounded-full" style={{ color: '#9C9C95', borderColor: '#E8E6DF' }}>EdTech</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pilot school banner */}
            <div className="mt-10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative" style={{ background: 'linear-gradient(to right, #D97757, #C46849)', boxShadow: '0 20px 25px -5px #D9775725' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="flex items-center gap-5 relative">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0 overflow-hidden" aria-hidden="true">
                        <img src="/illustrations/expertise-pilot.webp" alt="" className="w-10 h-10 object-contain" loading="lazy" decoding="async" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-base font-medium text-white mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Actieve samenwerking met pilotscholen</p>
                        <p className="text-sm" style={{ color: '#FFFFFF99' }}>
                            Het Almere College en toekomstige pilotscholen testen elke feature
                            in de praktijk — door docenten én leerlingen.
                        </p>
                    </div>
                </div>
                <a href="/ict/privacy" className="relative text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 inline-flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Compliance-belofte
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    );
};
