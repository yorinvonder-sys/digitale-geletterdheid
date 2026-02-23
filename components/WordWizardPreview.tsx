import React, { useState, useRef, useEffect } from 'react';
import { Type, Image as ImageIcon, LayoutList, Plus, Trash2, Heading1, AlignLeft, GripVertical, CheckCircle2, ChevronDown } from 'lucide-react';

interface TextBlock {
    id: string;
    type: 'p' | 'h1';
    text: string;
    image?: string; // Optional image URL
    textWrap?: boolean; // For image text wrap
}

interface WordWizardPreviewProps {
    onTaskComplete?: (task: string) => void;
}

export const WordWizardPreview: React.FC<WordWizardPreviewProps> = ({ onTaskComplete }) => {
    const [blocks, setBlocks] = useState<TextBlock[]>([
        { id: '1', type: 'h1', text: 'Mijn Spreekbeurt' },
        { id: '2', type: 'p', text: 'Dit is de inleiding van mijn verslag. Hier vertel ik waar het over gaat.' },
        { id: '3', type: 'h1', text: 'Hoofdstuk 1: De Start' },
        { id: '4', type: 'p', text: 'Hier begin ik met het echte verhaal. Het is heel spannend.' }
    ]);

    const [activeTab, setActiveTab] = useState<'start' | 'invoegen'>('start');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [showToC, setShowToC] = useState(false);
    const [tocItems, setTocItems] = useState<{ id: string; text: string; page: number }[]>([]);

    // Simulate "pages" by just generating random page numbers for ToC
    const generateToC = () => {
        const headings = blocks.filter(b => b.type === 'h1');
        const items = headings.map((h, index) => ({
            id: h.id,
            text: h.text || '(Geen titel)',
            page: Math.floor(index / 2) + 1
        }));
        setTocItems(items);
        setShowToC(true);
        if (onTaskComplete) onTaskComplete('toc_generated');
    };

    const addBlock = (type: 'p' | 'h1' = 'p', afterId?: string) => {
        const newBlock: TextBlock = {
            id: Date.now().toString(),
            type,
            text: ''
        };

        setBlocks(prev => {
            const index = afterId ? prev.findIndex(b => b.id === afterId) : prev.length - 1;
            const newBlocks = [...prev];
            newBlocks.splice(index + 1, 0, newBlock);
            return newBlocks;
        });
        setSelectedBlockId(newBlock.id);
    };

    const updateBlock = (id: string, updates: Partial<TextBlock>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const deleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const handleStyleChange = (type: 'p' | 'h1') => {
        if (selectedBlockId) {
            updateBlock(selectedBlockId, { type });
            if (type === 'h1' && onTaskComplete) onTaskComplete('style_header');
        }
    };

    const handleInsertImage = () => {
        if (selectedBlockId) {
            // Add image to current block or create new one
            const imgUrl = "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&q=80&w=300&h=200";
            updateBlock(selectedBlockId, { image: imgUrl, textWrap: true });
            if (onTaskComplete) onTaskComplete('insert_image');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBlock('p', id);
        }
        if (e.key === 'Backspace' && (e.target as HTMLTextAreaElement).value === '') {
            e.preventDefault();
            // Only delete if it's not the last block
            if (blocks.length > 1) {
                deleteBlock(id);
                // Focus previous block logic would be nice here but keeping it simple
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-100 font-sans">
            {/* WORD UI HEADER */}
            <div className="bg-[#2b579a] text-white shrink-0">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-blue-400/30">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <AlignLeft size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs opacity-70 font-bold uppercase tracking-wider">Word Wizard</span>
                            <span className="font-bold text-sm">Mijn Verslag.docx</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <div className="w-6 h-6 rounded-full bg-yellow-400 text-[#2b579a] font-bold flex items-center justify-center text-xs">JS</div>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-2 pt-2 gap-1">
                    <button
                        onClick={() => setActiveTab('start')}
                        className={`px-6 py-2 rounded-t-lg text-sm font-bold transition-colors ${activeTab === 'start' ? 'bg-[#f3f4f6] text-[#2b579a]' : 'text-white/70 hover:bg-white/10'}`}
                    >
                        Start
                    </button>
                    <button
                        onClick={() => setActiveTab('invoegen')}
                        className={`px-6 py-2 rounded-t-lg text-sm font-bold transition-colors ${activeTab === 'invoegen' ? 'bg-[#f3f4f6] text-[#2b579a]' : 'text-white/70 hover:bg-white/10'}`}
                    >
                        Invoegen
                    </button>
                </div>

                {/* Ribbon / Toolbar */}
                <div className="bg-[#f3f4f6] text-slate-700 px-4 py-3 h-24 flex gap-4 shadow-sm border-b border-slate-300 overflow-x-auto">

                    {activeTab === 'start' && (
                        <>
                            {/* STYLES SECTION */}
                            <div className="flex flex-col justify-between gap-1 pr-4 border-r border-slate-300 min-w-[200px]">
                                <span className="text-[10px] text-slate-400 font-bold uppercase text-center w-full">Stijlen</span>
                                <div className="flex gap-2 h-full items-center">
                                    <button
                                        onClick={() => handleStyleChange('p')}
                                        className={`flex flex-col items-center justify-center h-16 w-20 bg-white border rounded hover:bg-blue-50 transition-all ${selectedBlockId && blocks.find(b => b.id === selectedBlockId)?.type === 'p' ? 'ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200'}`}
                                    >
                                        <span className="text-xs">AaBbCc</span>
                                        <span className="text-[10px] font-medium mt-1">Normaal</span>
                                    </button>
                                    <button
                                        onClick={() => handleStyleChange('h1')}
                                        className={`flex flex-col items-center justify-center h-16 w-20 bg-white border rounded hover:bg-blue-50 transition-all ${selectedBlockId && blocks.find(b => b.id === selectedBlockId)?.type === 'h1' ? 'ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200'}`}
                                    >
                                        <span className="text-base font-bold text-[#2b579a]">AaBbCc</span>
                                        <span className="text-[10px] font-medium mt-1">Kop 1</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'invoegen' && (
                        <>
                            {/* INSERT IMAGE */}
                            <div className="flex flex-col justify-between gap-1 pr-4 border-r border-slate-300">
                                <span className="text-[10px] text-slate-400 font-bold uppercase text-center w-full">Media</span>
                                <button
                                    onClick={handleInsertImage}
                                    className="flex flex-col items-center justify-center h-full px-4 hover:bg-slate-200 rounded transition-colors gap-1"
                                >
                                    <ImageIcon size={24} className="text-slate-600" />
                                    <span className="text-xs font-medium">Afbeelding</span>
                                </button>
                            </div>

                            {/* INSERT TOC */}
                            <div className="flex flex-col justify-between gap-1 pr-4 border-r border-slate-300">
                                <span className="text-[10px] text-slate-400 font-bold uppercase text-center w-full">Referenties</span>
                                <button
                                    onClick={generateToC}
                                    className="flex flex-col items-center justify-center h-full px-4 hover:bg-slate-200 rounded transition-colors gap-1"
                                >
                                    <LayoutList size={24} className="text-slate-600" />
                                    <span className="text-xs font-medium">Inhoudsopgave</span>
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* DOCUMENT CANVAS */}
            <div className="flex-1 overflow-y-auto bg-slate-200 p-4 md:p-8 flex justify-center">
                <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-xl p-8 md:p-16 flex flex-col gap-4 relative animate-in zoom-in-95 duration-300">

                    {/* GENERATED TABLE OF CONTENTS */}
                    {showToC && (
                        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top-4">
                            <h2 className="text-lg font-bold text-[#2b579a] mb-4 uppercase tracking-wider border-b-2 border-[#2b579a] pb-2">Inhoudsopgave</h2>
                            {tocItems.length === 0 ? (
                                <p className="text-slate-400 italic text-sm">Geen koppen gevonden. Gebruik 'Kop 1' om hoofdstukken te maken!</p>
                            ) : (
                                <div className="space-y-2">
                                    {tocItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-end border-b border-dotted border-slate-300 pb-1">
                                            <span className="font-medium text-slate-700">{item.text}</span>
                                            <span className="text-slate-500 text-sm font-mono">{item.page}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* EDITABLE BLOCKS */}
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            className={`group relative transition-all rounded-md ${selectedBlockId === block.id ? 'ring-1 ring-blue-300 bg-blue-50/20' : ''}`}
                            onClick={() => setSelectedBlockId(block.id)}
                        >
                            {/* Hover Controls (Delete) */}
                            <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                <button onClick={() => deleteBlock(block.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white shadow-sm border rounded-md">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className={`
                        flex items-start gap-4 
                        ${block.textWrap ? 'flex-row' : 'flex-col'}
                    `}>
                                {block.image && (
                                    <div className={`relative group/img ${block.textWrap ? 'w-1/3 float-right ml-4 mb-2' : 'w-full mb-4'}`}>
                                        <img src={block.image} alt="Inserted" className="w-full rounded shadow-sm border border-slate-200" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateBlock(block.id, { textWrap: !block.textWrap });
                                            }}
                                            className="absolute top-2 right-2 bg-white/90 p-1 rounded shadow text-xs font-bold text-slate-600 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                        >
                                            {block.textWrap ? 'Regel: In Tekst' : 'Regel: Omloop'}
                                        </button>
                                    </div>
                                )}

                                <textarea
                                    value={block.text}
                                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                                    onFocus={() => setSelectedBlockId(block.id)}
                                    placeholder={block.type === 'h1' ? "Hoofdstuk Titel..." : "Typ hier je tekst..."}
                                    className={`
                                w-full bg-transparent resize-none outline-none overflow-hidden
                                ${block.type === 'h1' ? 'text-3xl font-bold text-[#2b579a] mb-4' : 'text-base leading-relaxed text-slate-800'}
                            `}
                                    rows={1}
                                    style={{ minHeight: '1.5em', height: 'auto' }}
                                    onInput={(e) => {
                                        (e.target as HTMLTextAreaElement).style.height = 'auto';
                                        (e.target as HTMLTextAreaElement).style.height = (e.target as HTMLTextAreaElement).scrollHeight + 'px';
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add Button at bottom */}
                    <div
                        className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-400 cursor-pointer transition-colors mt-4"
                        onClick={() => addBlock('p')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Plus size={24} />
                            <span className="text-sm font-medium">Klik om verder te schrijven</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
