import React, { useEffect, Suspense } from 'react';
import { ScholenLandingFeatures } from '../scholen/ScholenLandingFeatures';
import { ScholenLandingContact } from '../scholen/ScholenLandingContact';
import { trackEvent } from '../../services/analyticsService';

const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export const DigitaleGeletterdheidVo: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Digitale Geletterdheid VO: Dé Lesmethode voor 2027 | DGSkills';
        
        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Op zoek naar een lesmethode digitale geletterdheid voor het VO? Ontdek DGSkills: interactief platform met AI-missies, volledige SLO-dekking en gamification. Start een gratis pilot.');
        
        trackEvent('seo_page_view', { cluster: 'commercieel', page: 'digitale-geletterdheid-vo' });

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
                            Een complete lesmethode voor digitale geletterdheid in het VO
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Naar verwachting worden de kerndoelen digitale geletterdheid in 2027 verplicht. Met DGSkills bereid je jouw school nu al voor met een platform waar leerlingen wél enthousiast van worden.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#pilot" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                                Start een gratis pilot
                                <IconArrowRight />
                            </a>
                            <a href="/scholen" className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                Bekijk alle features
                            </a>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-slate-50 border-y border-slate-100 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
                            <div className="p-6">
                                <div className="text-3xl font-bold text-indigo-600 mb-2">SLO 2025</div>
                                <p className="text-slate-600">Volledig afgestemd op de nieuwste concept-kerndoelen.</p>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-indigo-600 mb-2">AI-Missies</div>
                                <p className="text-slate-600">Leerlingen leren prompten en kritisch denken met AI.</p>
                            </div>
                            <div className="p-6">
                                <div className="text-3xl font-bold text-indigo-600 mb-2">AVG-Safe</div>
                                <p className="text-slate-600">Privacy-proof en data-opslag binnen de EU.</p>
                            </div>
                        </div>
                        <ScholenLandingFeatures />
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Een doorlopende leerlijn voor onderbouw én bovenbouw</h2>
                        <p className="text-lg text-slate-600 mb-10">
                            Of je nu werkt met MAVO, HAVO of VWO leerlingen; DGSkills biedt adaptieve content die aansluit bij elk niveau. Van basisvaardigheden tot complexe computational thinking opdrachten.
                        </p>
                    </div>
                </section>

                <section id="pilot" className="py-20 bg-slate-900 text-white px-6">
                    <ScholenLandingContact />
                </section>
            </main>

            <footer className="py-12 bg-slate-950 text-slate-500 text-center text-xs">
                <div className="max-w-5xl mx-auto px-6">
                    <p>© {new Date().getFullYear()} DGSkills — Digitale Geletterdheid voor het Voortgezet Onderwijs</p>
                </div>
            </footer>
        </div>
    );
};
