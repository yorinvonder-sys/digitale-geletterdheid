import React, { useEffect } from 'react';
import { ScholenLandingSlo } from '../scholen/ScholenLandingSlo';
import { ScholenLandingContact } from '../scholen/ScholenLandingContact';
import { trackEvent } from '../../services/analyticsService';

const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export const SloKerndoelen: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'SLO Kerndoelen Digitale Geletterdheid 2025 | DGSkills';
        
        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Hoe voldoe je aan de SLO kerndoelen digitale geletterdheid? DGSkills biedt een tool met volledige kerndoeldekking voor het VO. Bekijk de matrix en start je pilot.');
        
        trackEvent('seo_page_view', { cluster: 'curriculum', page: 'slo-kerndoelen' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" />
                        <span className="font-bold text-slate-900">DGSkills</span>
                    </a>
                    <a href="/login" className="text-sm font-medium text-slate-600">Inloggen</a>
                </div>
            </nav>

            <main className="pt-32">
                <section className="px-6 mb-20">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            Voldoe aan de SLO-conceptkerndoelen (september 2025) Digitale Geletterdheid
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            De nieuwe SLO-conceptkerndoelen (september 2025) omvatten 9 kerndoelen (21A t/m 23C) verdeeld over 3 domeinen. DGSkills heeft ze direct vertaald naar meetbare missies. Zo heb je altijd inzicht in welke doelen jouw leerlingen al hebben behaald.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#matrix" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                                Bekijk de dekkingsmatrix
                                <IconArrowRight />
                            </a>
                            <a href="#pilot" className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                Gratis pilot aanvragen
                            </a>
                        </div>
                    </div>
                </section>

                <section id="matrix" className="py-20 bg-slate-50 border-y border-slate-100 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16">Volledige dekking van alle 3 de domeinen</h2>
                        <ScholenLandingSlo />
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Klaar voor de onderwijsinspectie</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Met ons ingebouwde dashboard genereer je met één klik voortgangsrapportages die direct gekoppeld zijn aan de SLO-doelen. Geen handmatige administratie meer, maar datagedreven inzicht voor de schoolleiding en de inspectie.
                        </p>
                        <ul className="space-y-4 text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <span>Real-time monitoring per leerling, klas en leerjaar.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <span>Automatische koppeling aan de 9 SLO-conceptkerndoelen (september 2025).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <span>Exporteerbare rapporten voor Magister, SOMtoday en LVS.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section id="pilot" className="py-20 bg-slate-900 text-white px-6">
                    <ScholenLandingContact />
                </section>
            </main>

            <footer className="py-12 bg-slate-950 text-slate-500 text-center text-xs">
                <div className="max-w-5xl mx-auto px-6">
                    <p>© {new Date().getFullYear()} DGSkills — SLO Kerndoelen Digitale Geletterdheid</p>
                </div>
            </footer>
        </div>
    );
};
