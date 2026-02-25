import React, { useState, useEffect } from 'react';
import { ScholenLandingIct } from './ScholenLandingIct';

const IconMenu = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);
const IconX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

export const IctLandingPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'ICT & Informatiemanagers — Veiligheid, Privacy & Integratie | DGSkills';

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', 'Ontdek hoe DGSkills past in jouw schoolarchitectuur. Alles over SSO (Microsoft/Google/SURFconext), AVG-compliance, LVS-koppelingen en technische support.');
        setMeta('property', 'og:title', 'ICT & Informatiemanagers — Veiligheid, Privacy & Integratie | DGSkills');
        setMeta('property', 'og:description', 'Veilige en beheersbare digitale geletterdheid voor het VO. AVG-compliant en naadloze integratie.');
        
        const idleCb = () => {
            setMeta('property', 'og:url', 'https://dgskills.app/ict');
            let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonical) canonical.href = 'https://dgskills.app/ict';
        };
        const useIdle = typeof requestIdleCallback !== 'undefined';
        const idleId = useIdle ? requestIdleCallback(idleCb, { timeout: 2000 }) : setTimeout(idleCb, 0);

        return () => {
            document.title = originalTitle;
            useIdle && typeof cancelIdleCallback !== 'undefined'
                ? cancelIdleCallback(idleId as number)
                : clearTimeout(idleId as ReturnType<typeof setTimeout>);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <img src="/logo.svg" alt="DGSkills logo" className="w-8 h-8" width={32} height={32} loading="lazy" decoding="async" />
                        <span className="font-bold text-[15px] text-slate-900 tracking-tight">DGSkills</span>
                    </a>
                    <div className="hidden lg:flex items-center gap-6">
                        <a href="/#waarom-dgskills" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Waarom DGSkills</a>
                        <a href="/#slo-kerndoelen" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Kerndoelen</a>
                        <a href="/ict" className="text-[13px] font-semibold text-indigo-600">Voor ICT</a>
                        <a href="/compliance-hub" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Compliance Hub</a>
                        <a href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Inloggen</a>
                        <a href="/#gratis-pilot" className="text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">Pilot aanvragen</a>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 -mr-2">
                        {mobileMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1">
                        <a href="/#waarom-dgskills" className="block py-3 text-sm text-slate-700">Waarom DGSkills</a>
                        <a href="/#slo-kerndoelen" className="block py-3 text-sm text-slate-700">Kerndoelen</a>
                        <a href="/ict" className="block py-3 text-sm text-indigo-600 font-semibold">Voor ICT</a>
                        <a href="/compliance-hub" className="block py-3 text-sm text-slate-700">Compliance Hub</a>
                        <a href="/login" className="block py-3 text-sm text-slate-700">Inloggen</a>
                        <a href="/#gratis-pilot" className="block py-3 text-sm font-semibold text-indigo-600">Pilot aanvragen</a>
                    </div>
                )}
            </nav>

            <main className="pt-32 pb-20 px-6">
                <ScholenLandingIct />
            </main>

            <footer className="py-8 px-6 bg-slate-950">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="" className="w-5 h-5 opacity-50 invert" width={20} height={20} loading="lazy" decoding="async" />
                        <span className="text-xs text-slate-500">DGSkills — Digitale geletterdheid voor het voortgezet onderwijs</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
                        <a href="mailto:info@dgskills.app" className="hover:text-slate-300 transition-colors font-medium">info@dgskills.app</a>
                        <span className="text-slate-700">·</span>
                        <a href="/ict/privacy/policy" className="hover:text-slate-300 transition-colors">Privacy</a>
                        <a href="/ict/privacy/cookies" className="hover:text-slate-300 transition-colors">Cookies</a>
                        <a href="/ict/privacy/ai" className="hover:text-slate-300 transition-colors">AI Act</a>
                        <a href="/compliance-hub" className="hover:text-slate-300 transition-colors">Compliance Hub</a>
                        <span className="text-slate-700">·</span>
                        <a href="/login" className="hover:text-slate-300 transition-colors">Inloggen</a>
                        <span className="text-slate-700">·</span>
                        <span>© {new Date().getFullYear()} DGSkills</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
