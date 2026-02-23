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
        <div className="h-full flex flex-col bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-800 text-white">
                <h3 className="font-black text-sm uppercase tracking-widest">🧩 Blokken</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Sleep blokken naar rechts</p>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {categories.map(category => {
                    const info = CATEGORY_INFO[category];
                    const blocks = BLOCK_DEFINITIONS.filter(b => b.category === category);
                    const isExpanded = expandedCategories[category];

                    return (
                        <div key={category} className="rounded-xl overflow-hidden bg-white shadow-sm">
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors"
                                style={{ borderLeft: `4px solid ${info.color}` }}
                            >
                                <span className="text-lg">{info.icon}</span>
                                <span className="font-bold text-slate-700 text-sm flex-1 text-left">
                                    {info.label}
                                </span>
                                <span className="text-xs text-slate-400 mr-1">{blocks.length}</span>
                                {isExpanded ? (
                                    <ChevronDown size={16} className="text-slate-400" />
                                ) : (
                                    <ChevronRight size={16} className="text-slate-400" />
                                )}
                            </button>

                            {/* Blocks */}
                            {isExpanded && (
                                <div className="p-2 space-y-2 bg-slate-50/50">
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
            <div className="p-3 bg-indigo-50 border-t border-indigo-100">
                <p className="text-[10px] text-indigo-600 font-medium text-center">
                    💡 Tip: Begin met een gele <strong>gebeurtenis</strong> blok!
                </p>
            </div>
        </div>
    );
};
