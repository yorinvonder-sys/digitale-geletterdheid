import React, { useState } from 'react';
import { Shield, Heart } from 'lucide-react';
import { PrivacyModal } from './PrivacyModal';

interface FooterProps {
    onAccountDeleted?: () => void;
    schoolId?: string;
}

export const Footer: React.FC<FooterProps> = ({ onAccountDeleted, schoolId }) => {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <>
            <footer className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Left side - Branding */}
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span className="font-medium">Project 0 DG</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">AI Lab Experience</span>
                    </div>

                    {/* Center - Made with love */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <span>Gemaakt met</span>
                        <Heart size={12} className="text-rose-400 fill-rose-400" />
                        <span>voor het onderwijs</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="/ict/privacy/policy" className="hidden sm:inline text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-wider transition-colors">Privacy</a>
                        <a href="/ict/privacy/cookies" className="hidden sm:inline text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-wider transition-colors">Cookies</a>
                        <a href="/ict/privacy/ai" className="hidden sm:inline text-slate-400 hover:text-slate-600 text-[10px] uppercase tracking-wider transition-colors">AI Act</a>
                        <div className="hidden sm:block w-px h-3 bg-slate-200" />
                        <button
                            onClick={() => {
                                if (window.confirm('Wil je de app volledig verversen? Dit lost vaak problemen op met updates.')) {
                                    // 1. Unregister Service Workers
                                    if ('serviceWorker' in navigator) {
                                        navigator.serviceWorker.getRegistrations().then(registrations => {
                                            registrations.forEach(registration => registration.unregister());
                                        });
                                    }
                                    // 2. Clear Caches
                                    if ('caches' in window) {
                                        caches.keys().then(keys => {
                                            keys.forEach(key => caches.delete(key));
                                        });
                                    }
                                    // 3. Force Reload with timestamp to bust browser cache
                                    window.location.href = window.location.pathname + '?t=' + Date.now();
                                }
                            }}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-medium transition-colors group"
                            title="Gebruik dit als de app niet goed laadt of update"
                        >
                            {/* RefreshCw icon embedded directly or imported if preferred, using svg for zero-dep if needed, but we have lucide */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-700">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 16h5v5" />
                            </svg>
                            <span className="hidden sm:inline">Ververs App</span>
                        </button>

                        {/* Privacy link */}
                        <button
                            onClick={() => setIsPrivacyOpen(true)}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-medium transition-colors group"
                        >
                            <Shield size={14} className="group-hover:scale-110 transition-transform" />
                            <span>Privacy & Instellingen</span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* Privacy Modal */}
            <PrivacyModal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
                onAccountDeleted={onAccountDeleted}
                schoolId={schoolId}
            />
        </>
    );
};
