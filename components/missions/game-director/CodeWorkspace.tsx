import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PlacedBlock, BlockDefinition, getBlockById } from './BlockTypes';
import { CodeBlock } from './CodeBlock';
import { Trash2, Play, RotateCcw, Plus } from 'lucide-react';

interface CodeWorkspaceProps {
    blocks: PlacedBlock[];
    onBlocksChange: (blocks: PlacedBlock[]) => void;
    onRun: () => void;
    onReset: () => void;
    isRunning: boolean;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
    blocks,
    onBlocksChange,
    onRun,
    onReset,
    isRunning
}) => {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [reorderingBlockId, setReorderingBlockId] = useState<string | null>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // Generate unique ID for new blocks
    const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Recursive helper to update a block in the tree
    const updateBlockInTree = useCallback((currentBlocks: PlacedBlock[], blockId: string, updater: (block: PlacedBlock) => PlacedBlock): PlacedBlock[] => {
        return currentBlocks.map(block => {
            if (block.id === blockId) {
                return updater(block);
            }
            if (block.children) {
                return {
                    ...block,
                    children: updateBlockInTree(block.children, blockId, updater)
                };
            }
            return block;
        });
    }, []);

    // Recursive helper to remove a block from the tree
    const removeBlockFromTree = useCallback((currentBlocks: PlacedBlock[], blockId: string): PlacedBlock[] => {
        return currentBlocks
            .filter(block => block.id !== blockId)
            .map(block => ({
                ...block,
                children: block.children ? removeBlockFromTree(block.children, blockId) : undefined
            }));
    }, []);

    // Recursive helper to find a block by ID
    const findBlockInTree = (currentBlocks: PlacedBlock[], blockId: string): PlacedBlock | undefined => {
        for (const block of currentBlocks) {
            if (block.id === blockId) return block;
            if (block.children) {
                const found = findBlockInTree(block.children, blockId);
                if (found) return found;
            }
        }
        return undefined;
    };

    // Add block from definition (used for touch events)
    const addBlockFromDefinition = useCallback((definition: BlockDefinition) => {
        const blockToPlace: PlacedBlock = {
            id: generateId(),
            definitionId: definition.id,
            inputs: definition.inputs.reduce((acc, input) => {
                acc[input.name] = input.default;
                return acc;
            }, {} as Record<string, any>)
        };
        onBlocksChange([...blocks, blockToPlace]);
    }, [blocks, onBlocksChange]);

    // Listen for custom touchdrop events (for iPad support)
    useEffect(() => {
        const handleTouchDrop = (e: Event) => {
            const customEvent = e as CustomEvent;
            const definition = customEvent.detail?.definition as BlockDefinition;
            if (definition) {
                addBlockFromDefinition(definition);
                setIsDraggingOver(false);
            }
        };

        const dropZone = dropZoneRef.current;
        if (dropZone) {
            dropZone.addEventListener('touchdrop', handleTouchDrop);
        }

        return () => {
            if (dropZone) {
                dropZone.removeEventListener('touchdrop', handleTouchDrop);
            }
        };
    }, [addBlockFromDefinition]);

    // Handle drop from palette OR reorder
    const handleDrop = useCallback((e: React.DragEvent, parentId: string | null = null, insertIndex?: number) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        setDragOverIndex(null);

        const reorderBlockId = e.dataTransfer.getData('reorderBlockId');
        const definitionId = e.dataTransfer.getData('blockDefinitionId');

        let blockToPlace: PlacedBlock | null = null;

        if (reorderBlockId) {
            const found = findBlockInTree(blocks, reorderBlockId);
            if (!found) return;
            blockToPlace = found;
            // Remove from old position first
            const cleanedBlocks = removeBlockFromTree(blocks, reorderBlockId);

            // Now place it at the new position
            if (parentId === null) {
                const newBlocks = [...cleanedBlocks];
                const targetIdx = insertIndex ?? newBlocks.length;
                newBlocks.splice(targetIdx, 0, blockToPlace);
                onBlocksChange(newBlocks);
            } else {
                const newBlocks = updateBlockInTree(cleanedBlocks, parentId, (parent) => ({
                    ...parent,
                    children: [...(parent.children || []), blockToPlace!]
                }));
                onBlocksChange(newBlocks);
            }
        } else if (definitionId) {
            const definition = getBlockById(definitionId);
            if (!definition) return;

            blockToPlace = {
                id: generateId(),
                definitionId: definition.id,
                inputs: definition.inputs.reduce((acc, input) => {
                    acc[input.name] = input.default;
                    return acc;
                }, {} as Record<string, any>)
            };

            if (parentId === null) {
                const newBlocks = [...blocks];
                const targetIdx = insertIndex ?? newBlocks.length;
                newBlocks.splice(targetIdx, 0, blockToPlace);
                onBlocksChange(newBlocks);
            } else {
                const newBlocks = updateBlockInTree(blocks, parentId, (parent) => ({
                    ...parent,
                    children: [...(parent.children || []), blockToPlace!]
                }));
                onBlocksChange(newBlocks);
            }
        }

        setReorderingBlockId(null);
    }, [blocks, onBlocksChange, updateBlockInTree, removeBlockFromTree]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDraggingOver(false);
        setDragOverIndex(null);
    }, []);

    const handleInputChange = useCallback((blockId: string, inputName: string, value: any) => {
        onBlocksChange(updateBlockInTree(blocks, blockId, (block) => ({
            ...block,
            inputs: { ...block.inputs, [inputName]: value }
        })));
    }, [blocks, onBlocksChange, updateBlockInTree]);

    const handleRemove = useCallback((blockId: string) => {
        onBlocksChange(removeBlockFromTree(blocks, blockId));
    }, [blocks, onBlocksChange, removeBlockFromTree]);

    const handleClearAll = () => {
        if (blocks.length > 0 && confirm('Weet je zeker dat je alle blokken wilt verwijderen?')) {
            onBlocksChange([]);
        }
    };

    // Sub-component for rendering a list of blocks recursively
    const BlockList: React.FC<{ currentBlocks: PlacedBlock[], parentId: string | null }> = ({ currentBlocks, parentId }) => {
        return (
            <div className="space-y-2">
                {currentBlocks.map((block, index) => {
                    const definition = getBlockById(block.definitionId);
                    if (!definition) return null;

                    return (
                        <div key={block.id}>
                            {/* Drop indicator between blocks */}
                            {parentId === null && (
                                <div
                                    className={`h-3 rounded-full mb-1 transition-all ${dragOverIndex === index
                                        ? 'bg-indigo-400 h-4'
                                        : reorderingBlockId ? 'bg-slate-200 hover:bg-white' : 'bg-transparent'
                                        }`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDragOverIndex(index);
                                    }}
                                    onDragLeave={() => setDragOverIndex(null)}
                                    onDrop={(e) => handleDrop(e, null, index)}
                                />
                            )}
                            <CodeBlock
                                block={block}
                                definition={definition}
                                onInputChange={handleInputChange}
                                onRemove={handleRemove}
                                isReordering={reorderingBlockId === block.id}
                                onDragStart={() => setReorderingBlockId(block.id)}
                                onDragEnd={() => setReorderingBlockId(null)}
                                onChildDrop={(e, id) => handleDrop(e, id)}
                            >
                                {block.children && block.children.length > 0 && (
                                    <BlockList currentBlocks={block.children} parentId={block.id} />
                                )}
                            </CodeBlock>
                        </div>
                    );
                })}

                {parentId === null && (
                    <div
                        className={`h-12 rounded-lg border-2 border-dashed mt-2 transition-all flex items-center justify-center ${dragOverIndex === currentBlocks.length ? 'border-indigo-400 bg-indigo-100' : 'border-transparent'
                            }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverIndex(currentBlocks.length);
                        }}
                        onDrop={(e) => handleDrop(e, null, currentBlocks.length)}
                    >
                        {dragOverIndex === currentBlocks.length && <span className="text-indigo-500 font-bold text-xs">Drop hier</span>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            {/* Header with controls */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">📝 Jouw Code</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{blocks.length} stack{blocks.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClearAll}
                        disabled={blocks.length === 0}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Verwijder alles"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={onReset}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Reset game"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={onRun}
                        disabled={blocks.length === 0}
                        className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isRunning
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed'
                            }`}
                    >
                        <Play size={14} fill="currentColor" />
                        {isRunning ? 'STOP' : 'START'}
                    </button>
                </div>
            </div>

            {/* Workspace area */}
            <div
                ref={dropZoneRef}
                data-drop-zone="main"
                className={`flex-1 p-4 overflow-y-auto transition-colors ${isDraggingOver ? 'bg-indigo-50' : 'bg-slate-50'
                    }`}
                onDrop={(e) => handleDrop(e)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {blocks.length === 0 ? (
                    <div className={`h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl transition-all ${isDraggingOver ? 'border-indigo-400 bg-indigo-100/50 scale-[1.02]' : 'border-slate-300'
                        }`}>
                        {/* Placeholder box for visual guidance */}
                        <div className={`w-48 h-16 mb-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-all ${isDraggingOver ? 'border-indigo-500 bg-indigo-200/50' : 'border-slate-300 bg-slate-100'}`}>
                            <Plus size={24} className={`${isDraggingOver ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="text-5xl mb-4">🧩</div>
                        <h4 className="font-bold text-slate-700 mb-2">Sleep blokken hierheen</h4>
                        <p className="text-sm text-slate-400 max-w-xs">
                            Begin met een <span className="text-amber-600 font-bold">gele gebeurtenis</span> blok en voeg daarna andere blokken toe.
                        </p>
                        {/* iPad hint */}
                        <p className="text-xs text-slate-400 mt-4 bg-slate-100 px-3 py-1.5 rounded-full">
                            📱 Op iPad: Houd een blok ingedrukt en sleep naar hier
                        </p>
                    </div>
                ) : (
                    <BlockList currentBlocks={blocks} parentId={null} />
                )}
            </div>

            {/* Touch drag CSS */}
            <style>{`
                .touch-drag-over {
                    background-color: rgba(99, 102, 241, 0.2) !important;
                    border-color: rgb(99, 102, 241) !important;
                }
            `}</style>
        </div>
    );
};
