import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { TeacherDashboardTab } from '@/types';

export interface TeacherNavItem {
    id: TeacherDashboardTab;
    label: string;
    icon: LucideIcon;
    badge?: number;
}

interface TeacherMobileNavProps {
    items: TeacherNavItem[];
    activeTab: TeacherDashboardTab;
    onNavigate: (tab: TeacherDashboardTab) => void;
}

/**
 * De sidebar is `lg:flex`; daaronder had de docent geen navigatie en zat vast
 * op het overzicht. Deze balk vult exact dat gat — `lg:hidden`, dus ook op
 * tablet (768px) waar een `sm:hidden`-variant nog steeds niets zou tonen.
 *
 * z-30 blijft bewust onder de header (z-40) en de modals (z-50).
 */
export const TeacherMobileNav: React.FC<TeacherMobileNavProps> = ({ items, activeTab, onNavigate }) => (
    <nav
        aria-label="Hoofdnavigatie docent"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-duck-ink/15 bg-duck-bgLight/95 pb-safe backdrop-blur lg:hidden"
    >
        <div className="flex items-stretch">
            {items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        data-tutorial-mobile={`${item.id}-tab`}
                        onClick={() => onNavigate(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-bold transition ${
                            isActive ? 'text-duck-ink' : 'text-duck-ink/50'
                        }`}
                    >
                        <span
                            className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
                                isActive ? 'bg-duck-acid/40' : ''
                            }`}
                        >
                            <Icon size={20} />
                        </span>
                        <span>{item.label}</span>
                        {item.badge ? (
                            <span
                                aria-label={`${item.badge} aandachtspunten`}
                                className="absolute right-[calc(50%-1.75rem)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-duck-ink px-1 text-[10px] font-black text-white"
                            >
                                {item.badge}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    </nav>
);
