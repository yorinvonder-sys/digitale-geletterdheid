import React from 'react';
import { Layers, Eye } from 'lucide-react';

export type MobileTab = 'instructies' | 'preview';

interface MobileTabBarProps {
    activeTab: MobileTab;
    onTabChange: (tab: MobileTab) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeTab, onTabChange }) => (
    <div className="md:hidden flex border-b border-[#E7D8BD] bg-white shrink-0">
        {(['instructies', 'preview'] as MobileTab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab
                        ? 'text-[#D97848] border-b-2 border-[#D97848] bg-[#D97848]/5'
                        : 'text-[#445865] hover:text-[#08283B]'
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
);
