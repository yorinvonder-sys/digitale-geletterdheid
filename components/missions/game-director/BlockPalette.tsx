import React, { useState } from 'react';
import { BLOCK_DEFINITIONS, CATEGORY_INFO, BlockCategory, BlockDefinition } from './BlockTypes';
import { DraggablePaletteBlock } from './CodeBlock';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface BlockPaletteProps {
    onDragStart: (definition: BlockDefinition) => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onDragStart }) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<BlockCategory, boolean>>({
        event: true,
        motion: true,
        control: true,
        variable: true,
    });

    const toggleCategory = (category: BlockCategory) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const categories: BlockCategory[] = ['event', 'motion', 'control', 'variable'];

    return (
        <div className="h-full flex flex-col bg-[#FCF6EA] rounded-2xl overflow-hidden border border-[#E7D8BD]">
            {/* Header */}
            <div className="px-4 py-3 bg-white border-b border-[#E7D8BD]">
                <h3 className="font-black text-sm uppercase tracking-widest text-[#08283B] font-['Newsreader',Georgia,serif]">🧩 Blokken</h3>
                <p className="text-[10px] text-[#445865] mt-0.5">Sleep blokken naar rechts</p>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {categories.map(category => {
                    const info = CATEGORY_INFO[category];
                    const blocks = BLOCK_DEFINITIONS.filter(b => b.category === category);
                    const isExpanded = expandedCategories[category];

                    return (
                        <div key={category} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#FCF6EA]">
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FCF6EA] transition-all duration-300"
                                style={{ borderLeft: `4px solid ${info.color}` }}
                            >
                                <span className="text-lg">{info.icon}</span>
                                <span className="font-bold text-[#08283B] text-sm flex-1 text-left">
                                    {info.label}
                                </span>
                                <span className="text-xs text-[#445865] mr-1">{blocks.length}</span>
                                {isExpanded ? (
                                    <ChevronDown size={16} className="text-[#445865]" />
                                ) : (
                                    <ChevronRight size={16} className="text-[#445865]" />
                                )}
                            </button>

                            {/* Blocks */}
                            {isExpanded && (
                                <div className="p-2 space-y-2 bg-[#FCF6EA]/50">
                                    {blocks.map(block => (
                                        <DraggablePaletteBlock
                                            key={block.id}
                                            definition={block}
                                            onDragStart={onDragStart}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Help footer */}
            <div className="p-3 bg-[#D97848]/5 border-t border-[#D97848]/10">
                <p className="text-[10px] text-[#D97848] font-medium text-center">
                    💡 Tip: Begin met een gele <strong>gebeurtenis</strong> blok!
                </p>
            </div>
        </div>
    );
};
