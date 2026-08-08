import React from 'react';
import { Layers, Eye, MessageCircle } from 'lucide-react';

export type MobileTab = 'instructies' | 'preview';

interface MobileTabBarProps {
    activeTab: MobileTab;
    onTabChange: (tab: MobileTab) => void;
    onOpenChat?: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeTab, onTabChange, onOpenChat }) => (
    <div className="md:hidden flex border-b border-duck-gray bg-white shrink-0">
        {/*
            De tabbladrol omvat alleen de twee echte tabs. De AI-hulpknop hoort daar
            niet in: die wisselt geen paneel en zou als tab worden aangekondigd.
        */}
        <div className="flex flex-1" role="tablist">
        {(['instructies', 'preview'] as MobileTab[]).map((tab) => (
            <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 flex min-h-[44px] items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab
                        ? 'text-duck-ink border-b-2 border-duck-acid bg-duck-acid/5'
                        : 'text-duck-ink/70 hover:text-duck-ink'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {tab === 'instructies' ? (
                    <>
                        <Layers size={14} />
                        Instructies
                    </>
                ) : (
                    <>
                        <Eye size={14} />
                        Preview
                    </>
                )}
            </button>
        ))}
        </div>
        {onOpenChat && (
            <button
                onClick={onOpenChat}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 border-l border-duck-gray py-3 text-xs font-bold uppercase tracking-wider text-duck-ink/70 transition-colors hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-duck-acid"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                aria-label="Open AI-assistent"
            >
                <MessageCircle size={14} />
                AI-hulp
            </button>
        )}
    </div>
);
