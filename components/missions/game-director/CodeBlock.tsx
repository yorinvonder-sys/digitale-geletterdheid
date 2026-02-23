import React from 'react';
import { BlockDefinition, PlacedBlock, getBlockById } from './BlockTypes';
import { GripVertical, X, ChevronDown } from 'lucide-react';

interface CodeBlockProps {
    block: PlacedBlock;
    definition: BlockDefinition;
    onInputChange: (blockId: string, inputName: string, value: any) => void;
    onRemove: (blockId: string) => void;
    isDragging?: boolean;
    isInPalette?: boolean;
    isReordering?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onChildDrop?: (e: React.DragEvent, parentId: string) => void;
    children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
    block,
    definition,
    onInputChange,
    onRemove,
    isDragging = false,
    isInPalette = false,
    isReordering = false,
    onDragStart,
    onDragEnd,
    onChildDrop,
    children
}) => {
    // Parse label and replace {inputName} with actual inputs
    const renderLabel = () => {
        const parts = definition.label.split(/(\{[^}]+\})/);
        return parts.map((part, idx) => {
            const match = part.match(/\{([^}]+)\}/);
            if (match) {
                const inputName = match[1];
                const inputDef = definition.inputs.find(i => i.name === inputName);
                if (!inputDef) return part;

                const value = block.inputs[inputName] ?? inputDef.default;

                if (inputDef.type === 'dropdown') {
                    return (
                        <select
                            key={idx}
                            value={value}
                            onChange={(e) => onInputChange(block.id, inputName, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="mx-1 px-2 py-0.5 bg-white/20 border border-white/30 rounded text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                            disabled={isInPalette}
                        >
                            {inputDef.options?.map(opt => (
                                <option key={opt.value} value={opt.value} className="text-slate-900">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    );
                }

                return (
                    <input
                        key={idx}
                        type="number"
                        value={value}
                        min={inputDef.min}
                        max={inputDef.max}
                        onChange={(e) => onInputChange(block.id, inputName, parseFloat(e.target.value) || inputDef.default)}
                        onClick={(e) => e.stopPropagation()}
                        className="mx-1 w-12 px-2 py-0.5 bg-white/20 border border-white/30 rounded text-white text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                        disabled={isInPalette}
                    />
                );
            }
            return <span key={idx}>{part}</span>;
        });
    };

    return (
        <div
            draggable={!isInPalette}
            onDragStart={(e) => {
                if (!isInPalette && onDragStart) {
                    e.dataTransfer.setData('reorderBlockId', block.id);
                    e.dataTransfer.effectAllowed = 'move';
                    onDragStart();
                }
            }}
            onDragEnd={() => {
                if (!isInPalette && onDragEnd) {
                    onDragEnd();
                }
            }}
            className={`
                relative group
                ${isDragging || isReordering ? 'opacity-50 scale-105' : ''}
                ${isInPalette ? 'cursor-grab active:cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}
            `}
        >
            {/* Main block */}
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border-2 border-black/20 text-white font-bold text-sm select-none transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: definition.color }}
            >
                {/* Drag handle */}
                <GripVertical size={14} className="opacity-50 flex-shrink-0" />

                {/* Label with inputs */}
                <div className="flex items-center flex-wrap gap-0.5">
                    {renderLabel()}
                </div>

                {/* Remove button (only in workspace) */}
                {!isInPalette && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(block.id);
                        }}
                        className="ml-auto p-2 min-w-[36px] min-h-[36px] rounded hover:bg-black/20 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Body for control blocks */}
            {definition.hasBody && !isInPalette && (
                <div className="ml-4 mt-1 relative">
                    {/* Connector line */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        style={{ backgroundColor: definition.color }}
                    />

                    {/* Children container */}
                    <div
                        className="pl-4 py-2 min-h-[40px] border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChildDrop?.(e, block.id);
                        }}
                    >
                        {children || (
                            <div className="text-xs text-slate-400 italic text-center py-2">
                                Sleep blokken hierheen
                            </div>
                        )}
                    </div>

                    {/* End cap */}
                    <div
                        className="mt-1 px-3 py-1 rounded-lg text-white/70 text-xs font-bold flex items-center gap-1"
                        style={{ backgroundColor: definition.color }}
                    >
                        <ChevronDown size={12} /> einde
                    </div>
                </div>
            )}
        </div>
    );
};

// Draggable wrapper for palette blocks
interface DraggableBlockProps {
    definition: BlockDefinition;
    onDragStart: (definition: BlockDefinition) => void;
}

export const DraggablePaletteBlock: React.FC<DraggableBlockProps> = ({ definition, onDragStart }) => {
    // Create a temporary PlacedBlock for display
    const tempBlock: PlacedBlock = {
        id: `palette-${definition.id}`,
        definitionId: definition.id,
        inputs: definition.inputs.reduce((acc, input) => {
            acc[input.name] = input.default;
            return acc;
        }, {} as Record<string, any>)
    };

    // Touch support for iPad
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];

        // Create a visual clone for dragging
        const target = e.currentTarget as HTMLElement;
        const clone = target.cloneNode(true) as HTMLElement;
        clone.id = 'touch-drag-clone';
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.9';
        clone.style.transform = 'scale(1.05)';
        clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        clone.style.left = `${touch.clientX - target.offsetWidth / 2}px`;
        clone.style.top = `${touch.clientY - target.offsetHeight / 2}px`;
        document.body.appendChild(clone);

        // Store definition on window for the drop handler
        (window as any).__touchDragBlockDefinition = definition;

        // Notify parent
        onDragStart(definition);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const clone = document.getElementById('touch-drag-clone');
        if (clone) {
            clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
            clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;
        }

        // Highlight drop zones
        const dropZones = document.querySelectorAll('[data-drop-zone]');
        dropZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            const isOver = touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom;
            if (isOver) {
                zone.classList.add('touch-drag-over');
            } else {
                zone.classList.remove('touch-drag-over');
            }
        });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const clone = document.getElementById('touch-drag-clone');
        if (clone) {
            clone.remove();
        }

        const touch = e.changedTouches[0];

        // Find the drop zone under the touch point
        const dropZones = document.querySelectorAll('[data-drop-zone]');
        dropZones.forEach(zone => {
            zone.classList.remove('touch-drag-over');
            const rect = zone.getBoundingClientRect();
            const isOver = touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom;

            if (isOver) {
                // Dispatch a custom event to handle the drop
                const customEvent = new CustomEvent('touchdrop', {
                    detail: { definition: (window as any).__touchDragBlockDefinition }
                });
                zone.dispatchEvent(customEvent);
            }
        });

        // Cleanup
        delete (window as any).__touchDragBlockDefinition;
    };

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('blockDefinitionId', definition.id);
                e.dataTransfer.effectAllowed = 'copy';
                onDragStart(definition);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="cursor-grab active:cursor-grabbing touch-none"
        >
            <CodeBlock
                block={tempBlock}
                definition={definition}
                onInputChange={() => { }}
                onRemove={() => { }}
                isInPalette={true}
            />
        </div>
    );
};
