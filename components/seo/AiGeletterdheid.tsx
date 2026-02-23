import React, { useEffect } from 'react';
import { ScholenLandingContact } from '../scholen/ScholenLandingContact';
import { trackEvent } from '../../services/analyticsService';

const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const ComplianceCard = ({ title, description, badge }: { title: string; description: string; badge: string }) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">{badge}</span>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-[15px]">{description}</p>
    </div>
);

export const AiGeletterdheid: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'AI-geletterdheid in het Onderwijs & EU AI Act | DGSkills';
        
        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Sinds februari 2025 is AI-geletterdheid verplicht onder de EU AI Act. Ontdek hoe DGSkills jouw school helpt met veilige AI-missies en volledige AVG-compliance.');
        
        trackEvent('seo_page_view', { cluster: 'compliance', page: 'ai-geletterdheid' });

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
                        <p className="text-indigo-600 font-bold text-sm mb-4 tracking-wide uppercase">AI Act Compliance</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            AI-geletterdheid op school: verplicht én verantwoord
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Sinds 2 februari 2025 stelt de Europese AI Act eisen aan AI-geletterdheid binnen organisaties, inclusief scholen. DGSkills biedt de veiligste route om aan deze verplichting te voldoen.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#compliance" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                                Bekijk compliance details
                                <IconArrowRight />
                            </a>
                            <a href="/ict/privacy" className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                Privacyverklaring
                            </a>
                        </div>
                    </div>
                </section>

                <section id="compliance" className="py-20 bg-slate-50 border-y border-slate-100 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Voldoe aan de EU AI Act</h2>
                            <p className="text-slate-600">Wij ontzorgen de school op juridisch en technisch vlak.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ComplianceCard 
                                badge="Wetgeving"
                                title="AI Act Artikel 50"
                                description="DGSkills valt onder 'Limited Risk' AI. Wij voldoen aan alle transparantie-eisen en borgen de verplichte AI-geletterdheid voor docenten en leerlingen."
                            />
                            <ComplianceCard 
                                badge="Privacy"
                                title="AVG & GDPR"
                                description="Alle data-opslag vindt plaats binnen de EU (Eemshaven/België). Wij verwerken geen BSN of gevoelige leerlingdata — Privacy by Design."
                            />
                            <ComplianceCard 
                                badge="Veiligheid"
                                title="Zero-Training Guarantee"
                                description="De invoer van leerlingen wordt NOOIT gebruikt om AI-modellen van derden te trainen. Jouw school-data blijft jouw data."
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 italic">"AI is geen hype, het is een basisvaardigheid."</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Binnen DGSkills leren leerlingen niet alleen hoe ze AI gebruiken (prompten), maar ook hoe het werkt, wat de risico's zijn (bias, deepfakes) en hoe ze ethisch omgaan met deze technologie. 
                        </p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-8 rounded-r-2xl">
                            <h4 className="font-bold text-indigo-900 mb-2">Voor ICT-beheerders</h4>
                            <p className="text-indigo-800 text-sm">
                                Onze AI-integratie verloopt via enterprise-grade API's met actieve safety filtering. Geen losse ChatGPT-accounts nodig, maar een gecontroleerde leeromgeving binnen de school-SSO.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="pilot" className="py-20 bg-slate-900 text-white px-6">
                    <ScholenLandingContact />
                </section>
            </main>

            <footer className="py-12 bg-slate-950 text-slate-500 text-center text-xs">
                <div className="max-w-5xl mx-auto px-6">
                    <p>© {new Date().getFullYear()} DGSkills — AI-geletterdheid & Compliance</p>
                </div>
            </footer>
        </div>
    );
};
