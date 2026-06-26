import React, { useEffect } from 'react';
import { ScholenLandingContact } from '../public-site/ScholenLandingContact';
import { trackEvent } from '@/services/analyticsService';
import { DuckMark } from '@/components/brand/DuckMark';

const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const ComplianceCard = ({ title, description, badge }: { title: string; description: string; badge: string }) => (
    <div className="bg-white p-8 rounded-2xl border border-lab-line shadow-sm hover:shadow-md transition-shadow">
        <span className="inline-block px-3 py-1 bg-lab-coral text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">{badge}</span>
        <h3 className="text-xl font-bold text-lab-ink mb-3">{title}</h3>
        <p className="text-lab-muted leading-relaxed text-[15px]">{description}</p>
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

        setMeta('name', 'description', 'Sinds februari 2025 geldt AI-geletterdheid onder de EU AI Act. Ontdek hoe DGSkills jouw school ondersteunt met veilige AI-missies, privacy-by-design en een AVG-bewust dossier.');
        
        trackEvent('seo_page_view', { cluster: 'compliance', page: 'ai-geletterdheid' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-lab-line">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <DuckMark className="size-8" />
                        <span className="font-bold text-lab-ink">DGSkills</span>
                    </a>
                    <a href="/login" className="text-sm font-medium text-lab-muted">Inloggen</a>
                </div>
            </nav>

            <main className="pt-32">
                <section className="px-6 mb-20">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lab-coral font-bold text-sm mb-4 tracking-wide uppercase">AI Act voorbereiding</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-lab-ink leading-tight mb-6">
                            AI-geletterdheid op school: verplicht én verantwoord
                        </h1>
                        <p className="text-xl text-lab-muted mb-10 leading-relaxed">
                            Sinds 2 februari 2025 stelt de Europese AI Act eisen aan AI-geletterdheid binnen organisaties, inclusief scholen. DGSkills biedt een verantwoorde route om aan deze verplichting te voldoen.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#compliance" className="bg-lab-coral text-white px-8 py-4 rounded-xl font-bold hover:bg-lab-coral hover:text-white transition-all flex items-center gap-2">
                                Bekijk compliance details
                                <IconArrowRight />
                            </a>
                            <a href="/ict/privacy" className="bg-white border border-lab-line text-lab-muted px-8 py-4 rounded-xl font-bold hover:bg-lab-cream transition-all">
                                Privacyverklaring
                            </a>
                        </div>
                    </div>
                </section>

                <section id="compliance" className="py-20 bg-lab-cream border-y border-lab-line px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Bereid je school voor op de EU AI Act</h2>
                            <p className="text-lab-muted">Wij ondersteunen scholen met documentatie, governance en technische maatregelen; juridische toetsing blijft nodig.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ComplianceCard 
                                badge="Wetgeving"
                                title="AI Act Artikel 50"
                                description="DGSkills behandelt school-facing AI als hoog-risico onderwijs-AI (Annex III). We werken aan aantoonbare high-risk governance; Art. 50-transparantie geldt vanaf augustus 2026 en de actuele Commissiepagina noemt 2 december 2027 voor high-risk onderwijsverplichtingen."
                            />
                            <ComplianceCard 
                                badge="Privacy"
                                title="AVG & GDPR"
                                description="Opslag en verwerking worden ingericht binnen de EER/EU-projectregio zoals contractueel vastgelegd. Wij verwerken geen BSN en gebruiken privacy-by-design maatregelen."
                            />
                            <ComplianceCard 
                                badge="Veiligheid"
                                title="Providertraining beperkt"
                                description="Leerlinginput wordt niet voor provider-modeltraining gebruikt waar dit door providerafspraken en instellingen is gedekt. Schooldata blijft onder schoolafspraken."
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 italic">"AI is geen hype, het is een basisvaardigheid."</h2>
                        <p className="text-lg text-lab-muted mb-8 leading-relaxed">
                            Binnen DGSkills leren leerlingen niet alleen hoe ze AI gebruiken (prompten), maar ook hoe het werkt, wat de risico's zijn (bias, deepfakes) en hoe ze ethisch omgaan met deze technologie. 
                        </p>
                        <div className="bg-lab-coral border-l-4 border-lab-coral p-8 rounded-r-2xl">
                            <h4 className="font-bold text-lab-coral mb-2">Voor ICT-beheerders</h4>
                            <p className="text-lab-coral text-sm">
                                Onze AI-integratie verloopt via enterprise-grade API's met actieve safety filtering. Geen losse ChatGPT-accounts nodig, maar een gecontroleerde leeromgeving binnen de school-SSO.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="pilot" className="py-20 bg-lab-ink text-white px-6">
                    <ScholenLandingContact />
                </section>
            </main>

            <footer className="py-12 bg-lab-ink text-white/75 text-center text-xs">
                <div className="max-w-5xl mx-auto px-6">
                    <p>© {new Date().getFullYear()} DGSkills — AI-geletterdheid & verantwoorde AI</p>
                </div>
            </footer>
        </div>
    );
};
