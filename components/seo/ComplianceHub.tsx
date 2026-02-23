import React, { useEffect } from 'react';
import { trackEvent } from '../../services/analyticsService';

const IconFileText = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const ResourceItem = ({ title, description, link, badge }: { title: string; description: string; link: string; badge: string }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors bg-white">
        <div className="flex gap-5 items-start">
            <div className="mt-1 p-3 bg-indigo-50 rounded-xl">
                <IconFileText />
            </div>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{badge}</span>
                </div>
                <p className="text-sm text-slate-500 max-w-md">{description}</p>
            </div>
        </div>
        <a 
            href={link}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
        >
            Bekijk Document
        </a>
    </div>
);

export const ComplianceHub: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Compliance Hub & Privacy Dossier | DGSkills';
        
        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Centrale hub voor alle compliance-assets van DGSkills. Download de Verwerkersovereenkomst (DPA), DPIA Support documenten en AI Act transparantie-rapporten.');
        
        trackEvent('seo_page_view', { cluster: 'compliance', page: 'compliance-hub' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" />
                        <span className="font-bold text-slate-900">DGSkills</span>
                    </a>
                    <a href="/ict" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">ICT Dashboard</a>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Compliance Hub</h1>
                        <p className="text-slate-600">Alle juridische en technische documentatie voor schoolbesturen, FG's en ICT-managers op één plek.</p>
                    </div>

                    <div className="grid gap-4 mb-16">
                        <ResourceItem 
                            title="AI-Compliance Checklist"
                            description="Een praktische checklist om te controleren of jouw school voldoet aan de AI Act en AVG."
                            link="/compliance/checklist"
                            badge="Handig"
                        />
                        <ResourceItem 
                            title="SLO-Dekkingsrapport (Voorbeeld)"
                            description="Bekijk hoe een geautomatiseerd rapport eruit ziet voor verantwoording aan de inspectie."
                            link="/compliance/slo-rapport"
                            badge="Demo"
                        />
                        <ResourceItem 
                            title="Verwerkersovereenkomst (DPA)"
                            description="Het standaardmodel 4.0 voor het funderend onderwijs, specifiek ingevuld voor DGSkills."
                            link="/ict/privacy/policy"
                            badge="v4.1"
                        />
                        <ResourceItem 
                            title="DPIA Support Document"
                            description="Ondersteuning bij het uitvoeren van een Data Protection Impact Assessment voor jouw school."
                            link="/ict/privacy"
                            badge="PDF"
                        />
                        <ResourceItem 
                            title="AI Act Transparantie Rapport"
                            description="Gedetailleerde uitleg over AI-gebruik, datastromen en menselijke controle (Art. 50 compliance)."
                            link="/ict/privacy/ai"
                            badge="Nieuw"
                        />
                        <ResourceItem 
                            title="Technische Whitepaper"
                            description="Inzicht in architectuur, SSO-integraties, data-opslag en beveiligingsprotocollen."
                            link="/ict/technisch"
                            badge="v1.0"
                        />
                        <ResourceItem 
                            title="SLA & Support Overzicht"
                            description="Gegarandeerde responstijden, uptime-garanties en escalatie-procedures."
                            link="/ict/support"
                            badge="SLA"
                        />
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                        <h2 className="text-xl font-bold mb-4">Vragen voor onze Privacy Officer?</h2>
                        <p className="text-slate-500 text-sm mb-6">Heb je specifieke vragen over de AVG, AI Act of integratie met jouw school-LVS? Ons team staat klaar om te helpen.</p>
                        <a href="mailto:privacy@dgskills.app" className="text-indigo-600 font-bold hover:underline">privacy@dgskills.app</a>
                    </div>
                </div>
            </main>

            <footer className="py-12 text-slate-400 text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Privacy & Compliance</p>
            </footer>
        </div>
    );
};
