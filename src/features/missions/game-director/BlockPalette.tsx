import React, { useState } from 'react';
import { BLOCK_DEFINITIONS, CATEGORY_INFO, BlockCategory, BlockDefinition } from './BlockTypes';
import { DraggablePaletteBlock } from './CodeBlock';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface BlockPaletteProps {
    onDragStart: (definition: BlockDefinition) => void;
    onAddBlock?: (definition: BlockDefinition) => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onDragStart, onAddBlock }) => {
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
        <div className="h-full flex flex-col bg-duck-bg rounded-2xl overflow-hidden border border-duck-line">
            {/* Header */}
            <div className="px-4 py-3 bg-white border-b border-duck-line">
                <h3 className="font-black text-sm uppercase tracking-widest text-duck-ink font-['Newsreader',Georgia,serif]">🧩 Blokken</h3>
                <p className="text-[10px] text-duck-muted mt-0.5">Sleep blokken naar rechts</p>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2" role="list" aria-label="Beschikbare code blokken">
                {categories.map(category => {
                    const info = CATEGORY_INFO[category];
                    const blocks = BLOCK_DEFINITIONS.filter(b => b.category === category);
                    const isExpanded = expandedCategories[category];

                    return (
                        <div key={category} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-duck-line">
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-duck-bg transition-all duration-300"
                                style={{ borderLeft: `4px solid ${info.color}` }}
                            >
                                <span className="text-lg">{info.icon}</span>
                                <span className="font-bold text-duck-ink text-sm flex-1 text-left">
                                    {info.label}
                                </span>
                                <span className="text-xs text-duck-muted mr-1">{blocks.length}</span>
                                {isExpanded ? (
                                    <ChevronDown size={16} className="text-duck-muted" />
                                ) : (
                                    <ChevronRight size={16} className="text-duck-muted" />
                                )}
                            </button>

                            {/* Blocks */}
                            {isExpanded && (
                                <div className="p-2 space-y-2 bg-duck-bg/50">
                                    {blocks.map(block => (
                                        <div key={block.id} className="flex items-center gap-1">
                                            <div
                                                className="flex-1 min-w-0"
                                                role="listitem"
                                                aria-label={`${block.label.replace(/[{}]/g, '')} blok - sleep naar werkgebied of klik plus om toe te voegen`}
                                            >
                                                <DraggablePaletteBlock
                                                    definition={block}
                                                    onDragStart={onDragStart}
                                                />
                                            </div>
                                            {onAddBlock && (
                                                <button
                                                    onClick={() => onAddBlock(block)}
                                                    className="p-1.5 rounded-lg bg-white border border-duck-line text-duck-muted hover:text-duck-coral hover:border-duck-coral/30 hover:bg-duck-coral/5 transition-all duration-300 shrink-0"
                                                    aria-label={`Voeg ${block.label.replace(/[{}]/g, '')} toe aan werkgebied`}
                                                    title="Toevoegen"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Help footer */}
            <div className="p-3 bg-duck-coral/5 border-t border-duck-coral/10">
                <p className="text-[10px] text-duck-coral font-medium text-center">
                    💡 Tip: Begin met een gele <strong>gebeurtenis</strong> blok!
                </p>
            </div>
        </div>
    );
};
