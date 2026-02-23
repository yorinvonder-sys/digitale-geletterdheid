/**
 * FAQ section — lazy-loaded. openFaq state init is null; handlers run on interaction only.
 * Inline SVGs avoid lucide chunk load; icons render on interaction.
 */
import React, { useState } from 'react';

const IconArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const IconChevronDown = ({ className = '' }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const FAQ_ITEMS: { category?: string; q: string; a: string }[] = [
    { category: 'Over het platform', q: 'Wat is digitale geletterdheid en waarom wordt het verplicht?', a: 'Kennis en vaardigheden om veilig en effectief te functioneren in een digitale samenleving. SLO-kerndoelen worden per 2027 wettelijk verplicht; scholen kunnen al vanaf 2025/2026 starten.' },
    { category: 'Over het platform', q: 'Hoe verschilt DGSkills van DIGIT-vo of Basicly?', a: 'DGSkills combineert AI-missies, gamification (XP, badges, leaderboards) én volledige SLO-koppeling. Leerlingen leren door te doen — geen werkbladen.' },
    { category: 'Over het platform', q: 'Welke SLO Kerndoelen dekt DGSkills af?', a: 'Alle vier domeinen: Digitale vaardigheden, Informatievaardigheden, Mediawijsheid en Computational Thinking. Elke missie is gekoppeld aan specifieke kerndoelen.' },
    { category: 'Technisch & privacy', q: 'Is DGSkills AVG-compliant en veilig?', a: 'Ja. Data wordt opgeslagen in een beveiligde Europese database. Verwerkersovereenkomst en DPIA beschikbaar. Voldoet aan AVG en onderwijseisen.' },
    { category: 'Technisch & privacy', q: 'Op welke apparaten werkt DGSkills?', a: 'Elk apparaat met browser: iPad, Chromebook, laptop, telefoon. Geen installatie, geen IT-configuratie.' },
    { category: 'Kosten & licentie', q: 'Wat kost DGSkills en is er een gratis proefperiode?', a: 'Gratis pilot van 3 maanden met volledige toegang. Daarna schoollicentie vanaf €2.000 per jaar.' }
];

interface ScholenLandingFaqProps {
    scrollToContact: () => void;
}

export const ScholenLandingFaq: React.FC<ScholenLandingFaqProps> = ({ scrollToContact }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div>
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                    Veelgestelde vragen
                </h2>
                <p className="text-base text-slate-500 leading-relaxed mb-10">
                    Over DGSkills, SLO-kerndoelen en de gratis pilot.
                </p>

                <div className="space-y-8">
                    {(['Over het platform', 'Technisch & privacy', 'Kosten & licentie'] as const).map(cat => {
                        const items = FAQ_ITEMS.filter(f => f.category === cat);
                        if (items.length === 0) return null;
                        return (
                            <div key={cat}>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{cat}</h3>
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const i = FAQ_ITEMS.indexOf(item);
                                        const isOpen = openFaq === i;
                                        const showCta = item.category === 'Kosten & licentie';
                                        return (
                                            <div key={i} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className="text-[15px] font-medium text-slate-900 pr-4 leading-snug">{item.q}</span>
                                                    <IconChevronDown className={`text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 pt-0">
                                                        <p className="text-[15px] text-slate-600 leading-relaxed">{item.a}</p>
                                                        {showCta && (
                                                            <button
                                                                onClick={scrollToContact}
                                                                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                                                            >
                                                                Pilot aanvragen
                                                                <IconArrowRight />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200/80 text-center">
                    <p className="text-sm text-slate-500 mb-4">Nog vragen? We staan voor je klaar.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToContact}
                            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                        >
                            Pilot aanvragen
                            <IconArrowRight />
                        </button>
                        <a
                            href="mailto:info@dgskills.app"
                            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            info@dgskills.app
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
