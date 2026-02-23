import React from 'react';
import { Home, BookOpen, User, Trophy, Gamepad2 } from 'lucide-react';

interface BottomNavProps {
    activeTab: 'dashboard' | 'library' | 'profile' | 'trophies' | 'games';
    onNavigate: (tab: 'dashboard' | 'library' | 'profile' | 'trophies' | 'games') => void;
    gamesEnabled?: boolean;
}

const NAV_ITEMS: { id: BottomNavProps['activeTab']; label: string; icon: React.ReactNode; requiresGames?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'library', label: 'Bibliotheek', icon: <BookOpen size={20} /> },
    { id: 'trophies', label: 'Trofeeën', icon: <Trophy size={20} /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 size={20} />, requiresGames: true },
    { id: 'profile', label: 'Profiel', icon: <User size={20} /> },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, gamesEnabled = false }) => {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe sm:hidden"
            role="navigation"
            aria-label="Hoofdnavigatie"
        >
            <div className="flex items-center justify-around px-2 py-1">
                {NAV_ITEMS.map((item) => {
                    if (item.requiresGames && !gamesEnabled) return null;

                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`
                                flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px] min-h-[48px]
                                rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-400 hover:text-slate-600 active:bg-slate-50'
                                }
                            `}
                        >
                            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-bold tracking-tight leading-none ${isActive ? 'font-extrabold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
