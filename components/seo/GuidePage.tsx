import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '../../services/analyticsService';

const IconChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

export const GuidePage: React.FC<{ guideId: string }> = ({ guideId }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                // In a real build, these would be pre-loaded or fetched from an API.
                // For this demo/static approach, we'll try to find the guide in our guides folder.
                const response = await fetch(`/guides/${guideId}.md`);
                if (response.ok) {
                    const text = await response.text();
                    setContent(text);
                } else {
                    setContent('# Gids niet gevonden\nExcuses, de opgevraagde gids kon niet worden geladen.');
                }
            } catch (err) {
                setContent('# Fout bij laden\nEr is een probleem opgetreden bij het laden van de gids.');
            } finally {
                setLoading(false);
            }
        };

        fetchGuide();

        // SEO Title Management
        const formattedTitle = guideId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        document.title = `${formattedTitle} | DGSkills Gidsen`;

        trackEvent('seo_page_view', { cluster: 'gids', page: guideId });
    }, [guideId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" />
                        <span className="font-bold text-slate-900">DGSkills</span>
                    </a>
                    <a href="/" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        <IconChevronLeft />
                        Terug
                    </a>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <article className="max-w-3xl mx-auto prose prose-slate prose-indigo">
                    <ReactMarkdown>{content}</ReactMarkdown>
                    
                    <div className="mt-16 pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4">Wil je meer weten over DGSkills?</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="/digitale-geletterdheid-vo" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                Ontdek de Lesmethode
                            </a>
                            <a href="/scholen" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Bekijk Features
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            <footer className="py-12 bg-slate-50 border-t border-slate-100 text-slate-400 text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Digitale Geletterdheid Gidsen</p>
            </footer>
        </div>
    );
};
