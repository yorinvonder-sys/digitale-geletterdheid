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
    { category: 'Over het platform', q: 'Wat is digitale geletterdheid en waarom wordt het verplicht?', a: 'Kennis en vaardigheden om veilig en effectief te functioneren in een digitale samenleving. SLO-kerndoelen worden per 1 augustus 2027 wettelijk verplicht voor alle VO-scholen, met een implementatieperiode tot 2031. Scholen kunnen al vanaf schooljaar 2025/2026 vrijwillig starten.' },
    { category: 'Over het platform', q: 'Hoe verschilt DGSkills van DIGIT-vo of Basicly?', a: 'DGSkills combineert AI-missies, gamification (XP, badges, leaderboards) én volledige SLO-koppeling. SSO is beschikbaar via Microsoft 365; Google Workspace en SURFconext staan op de roadmap. Leerlingen leren door te doen — geen werkbladen.' },
    { category: 'Over het platform', q: 'Welke SLO Kerndoelen dekt DGSkills af?', a: 'Alle drie domeinen van de nieuwe conceptkerndoelen: Digitale systemen, media, data en AI (21A–D); Digitale producten en programmeren (22A–B); Veiligheid, welzijn en maatschappij (23A–C). Elke missie is gekoppeld aan specifieke kerndoelen.' },
    { category: 'Technisch & privacy', q: 'Is DGSkills AVG-compliant en veilig?', a: 'Ja. Data wordt opgeslagen in een beveiligde Europese database. Verwerkersovereenkomst en DPIA beschikbaar. Voldoet aan AVG en onderwijseisen.' },
    { category: 'Technisch & privacy', q: 'Op welke apparaten werkt DGSkills?', a: 'Elk apparaat met browser: iPad, Chromebook, laptop, telefoon. Geen installatie, geen IT-configuratie.' },
    { category: 'Technisch & privacy', q: 'Hoe gaat DGSkills om met de EU AI Act?', a: 'DGSkills is geclassificeerd als hoog-risico AI-systeem onder de EU AI Act (Annex III, punt 3b). Wij werken actief aan volledige conformiteit v\u00f3\u00f3r de deadline van augustus 2026. Op dit moment voldoen wij aan de transparantie- en logging-eisen. Voor het volledige conformiteitsoverzicht, zie onze Compliance Hub.' },
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
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    Veelgestelde vragen
                </h2>
                <p className="text-base leading-relaxed mb-10" style={{ color: '#6B6B66' }}>
                    Over DGSkills, SLO-kerndoelen en de gratis pilot.
                </p>

                <div className="space-y-8">
                    {(['Over het platform', 'Technisch & privacy', 'Kosten & licentie'] as const).map(cat => {
                        const items = FAQ_ITEMS.filter(f => f.category === cat);
                        if (items.length === 0) return null;
                        return (
                            <div key={cat}>
                                <h3 className="text-sm font-medium uppercase tracking-wide mb-4" style={{ color: '#D97757' }}>{cat}</h3>
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const i = FAQ_ITEMS.indexOf(item);
                                        const isOpen = openFaq === i;
                                        const showCta = item.category === 'Kosten & licentie';
                                        return (
                                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E6DF' }}>
                                                <button
                                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F5F3EC]/50 transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D97757] focus-visible:rounded-xl"
                                                    aria-expanded={isOpen}
                                                    aria-controls={`faq-answer-${i}`}
                                                >
                                                    <span className="text-[15px] font-medium pr-4 leading-snug" style={{ color: '#1A1A19' }}>{item.q}</span>
                                                    <IconChevronDown className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#9C9C95' }} />
                                                </button>
                                                {isOpen && (
                                                    <div id={`faq-answer-${i}`} className="px-5 pb-5 pt-0">
                                                        <p className="text-[15px] leading-relaxed" style={{ color: '#6B6B66' }}>{item.a}</p>
                                                        {showCta && (
                                                            <button
                                                                onClick={scrollToContact}
                                                                className="mt-4 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                                                                style={{ color: '#D97757' }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.color = '#C46849')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.color = '#D97757')}
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

                <div className="mt-12 pt-8 text-center" style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: '#E8E6DF' }}>
                    <p className="text-sm mb-4" style={{ color: '#6B6B66' }}>Nog vragen? We staan voor je klaar.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToContact}
                            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D97757]"
                            style={{ backgroundColor: '#D97757' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D97757')}
                        >
                            Pilot aanvragen
                            <IconArrowRight />
                        </button>
                        <a
                            href="mailto:info@dgskills.app"
                            className="text-sm font-semibold inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors"
                            style={{ color: '#6B6B66', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E6DF' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#D97757'; e.currentTarget.style.borderColor = '#D97757'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6B66'; e.currentTarget.style.borderColor = '#E8E6DF'; }}
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
