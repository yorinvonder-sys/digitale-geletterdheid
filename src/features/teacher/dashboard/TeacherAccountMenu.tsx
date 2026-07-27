import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Sparkles, Award, ShieldCheck, MessageSquare,
    BookOpen, Upload, Presentation, LogOut,
} from 'lucide-react';
import type { TeacherDashboardTab } from '@/types';

interface MenuEntry {
    id: string;
    label: string;
    icon: typeof Settings;
    tab?: TeacherDashboardTab;
    action?: 'roster' | 'presentation' | 'logout';
    group: number;
}

const ENTRIES: MenuEntry[] = [
    { id: 'settings', label: 'Klas & missies', icon: Settings, tab: 'settings', group: 1 },
    { id: 'games', label: 'Games', icon: Sparkles, tab: 'games', group: 1 },
    { id: 'gamification', label: 'Beloningen', icon: Award, tab: 'gamification', group: 1 },
    { id: 'ai-beleid', label: 'AI-beleid', icon: ShieldCheck, tab: 'ai-beleid', group: 2 },
    { id: 'feedback', label: 'Feedback van leerlingen', icon: MessageSquare, tab: 'feedback', group: 2 },
    { id: 'documenten', label: 'Kennisbank', icon: BookOpen, tab: 'documenten', group: 2 },
    { id: 'roster', label: 'Leerlingen importeren', icon: Upload, action: 'roster', group: 3 },
    { id: 'presentation', label: 'Presentatiemodus', icon: Presentation, action: 'presentation', group: 3 },
];

interface TeacherAccountMenuProps {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    initial: string;
    displayName?: string;
    onNavigate: (tab: TeacherDashboardTab) => void;
    onOpenRosterImport: () => void;
    onOpenPresentation: () => void;
    onLogout?: () => void;
}

/**
 * Alles wat een docent niet dagelijks nodig heeft, staat hier in plaats van in
 * de hoofdnavigatie. Zo blijven er drie navigatie-items over die op elk scherm
 * — inclusief een mobiele balk — passen.
 */
export const TeacherAccountMenu: React.FC<TeacherAccountMenuProps> = ({
    open, onToggle, onClose, initial, displayName, onNavigate,
    onOpenRosterImport, onOpenPresentation, onLogout,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) onClose();
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open, onClose]);

    const handle = (entry: MenuEntry) => {
        onClose();
        if (entry.tab) return onNavigate(entry.tab);
        if (entry.action === 'roster') return onOpenRosterImport();
        if (entry.action === 'presentation') return onOpenPresentation();
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={onToggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Accountmenu en beheer"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-duck-ink transition ${
                    open ? 'bg-duck-acid' : 'bg-duck-acid/35 hover:bg-duck-acid/60'
                }`}
            >
                {initial}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        role="menu"
                        aria-label="Accountmenu"
                        className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-1.5 shadow-lg"
                    >
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-duck-acid/35 text-sm font-black text-duck-ink">
                                {initial}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-bold text-duck-ink">
                                {displayName || 'Docent'}
                            </span>
                        </div>

                        {[1, 2, 3].map(group => (
                            <div key={group} className="border-t border-duck-ink/10 pt-1">
                                {ENTRIES.filter(e => e.group === group).map(entry => {
                                    const Icon = entry.icon;
                                    return (
                                        <button
                                            key={entry.id}
                                            role="menuitem"
                                            onClick={() => handle(entry)}
                                            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-duck-ink/70 transition hover:bg-duck-bg hover:text-duck-ink"
                                        >
                                            <Icon size={17} className="shrink-0" />
                                            <span className="flex-1 truncate">{entry.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        {onLogout && (
                            <div className="border-t border-duck-ink/10 pt-1">
                                <button
                                    role="menuitem"
                                    onClick={() => { onClose(); onLogout(); }}
                                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-duck-ink/70 transition hover:bg-duck-error/10 hover:text-duck-error"
                                >
                                    <LogOut size={17} className="shrink-0" />
                                    <span className="flex-1">Uitloggen</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
