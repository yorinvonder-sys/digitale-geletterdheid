import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle, Type, Image as ImageIcon, Layout, Bold, Italic,
    AlignLeft, AlignCenter, AlignRight, Play, FileText, Save, Printer,
    Table, Square, Palette, Droplet, LayoutTemplate, Columns, FilePlus,
    List, BookOpen, ChevronDown
} from 'lucide-react';

interface LayoutDoctorProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
}

type BlockType = 'paragraph' | 'heading' | 'image' | 'table' | 'shape' | 'toc' | 'pagebreak';

interface ContentBlock {
    id: string;
    type: BlockType;
    content?: string;
    style?: any; // For text styles, alignment, etc.
}

export const LayoutDoctorMission: React.FC<LayoutDoctorProps> = ({ onComplete, onBack }) => {
    // Document Settings
    const [titleStyle, setTitleStyle] = useState('comic');
    const [imageAlign, setImageAlign] = useState('overlap');
    const [bodyFont, setBodyFont] = useState('comic');
    const [fontSize, setFontSize] = useState(11);

    // Page Settings
    const [pageColor, setPageColor] = useState('white');
    const [showWatermark, setShowWatermark] = useState(false);
    const [layout, setLayout] = useState({
        columns: 1,
        orientation: 'portrait', // portrait, landscape
        margins: 'normal', // normal, narrow
    });

    // Content State
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: '1', type: 'heading', content: 'Verslag: De Toekomst van AI' },
        { id: '2', type: 'paragraph', content: "Kunstmatige intelligentie (AI) verandert de wereld in een razendsnel tempo. Van zelfrijdende auto's tot slimme assistenten in onze telefoons, AI is overal. Maar wat betekent dit voor onze toekomst?" },
        { id: '3', type: 'paragraph', content: "In dit verslag onderzoek ik hoe AI ons leven makkelijker kan maken, maar ook welke gevaren er op de loer liggen. Denk bijvoorbeeld aan deepfakes en privacy. Het is belangrijk dat we leren hoe we veilig met deze technologie kunnen omgaan." },
        { id: '4', type: 'paragraph', content: "Conclusie: We moeten niet bang zijn voor AI, maar we moeten er wel slim mee omgaan." }
    ]);

    // Selection & UI State
    const [selection, setSelection] = useState<'none' | 'title' | 'body' | 'image' | string>('none');
    const [activeTab, setActiveTab] = useState('Start');

    // Formatting State (Visual sync)
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);

    // Image Drag State
    const [isImageRight, setIsImageRight] = useState(false);

    // Helpers
    const addBlock = (type: BlockType, content: string = '') => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content
        };
        // Add after selection or at end
        setBlocks(prev => [...prev, newBlock]);
    };

    const generateTOC = () => {
        // Remove existing TOC if any
        const filtered = blocks.filter(b => b.type !== 'toc');
        const tocBlock: ContentBlock = {
            id: 'toc-' + Date.now(),
            type: 'toc',
        };
        // Insert after title (index 0 usually)
        const newBlocks = [filtered[0], tocBlock, ...filtered.slice(1)];
        setBlocks(newBlocks);
    };

    const handleSelection = (e: React.MouseEvent, id: string, type: string) => {
        e.stopPropagation();
        setSelection(id);
    };

    // Check completion
    const isComplete = titleStyle === 'modern' && imageAlign === 'wrap' && bodyFont === 'sans' && fontSize >= 12 && isImageRight;

    // Render Ribbons
    const renderRibbon = () => {
        switch (activeTab) {
            case 'Bestand':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 overflow-x-auto h-24 bg-[#2B579A] text-white w-full absolute top-[88px] left-0 z-50">
                        <button onClick={() => alert("Nieuw document wordt gesimuleerd")} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg min-w-[60px]">
                            <FilePlus size={24} /> <span className="text-xs">Nieuw</span>
                        </button>
                        <button onClick={() => alert("Opslaan gesimuleerd")} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg min-w-[60px]">
                            <Save size={24} /> <span className="text-xs">Opslaan</span>
                        </button>
                    </div>
                );
            case 'Start':
                return (
                    <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto h-24">
                        {/* Font & Title Styles logic similar to before but generalized */}
                        <div className="flex flex-col px-2 border-r border-slate-200 h-full justify-between pb-1">
                            <div className="flex gap-1 mb-1">
                                <select
                                    className="w-32 text-xs border border-slate-300 rounded"
                                    value={bodyFont === 'comic' ? 'Comic Sans MS' : 'Arial'}
                                    onChange={(e) => setBodyFont(e.target.value === 'Arial' ? 'sans' : 'comic')}
                                >
                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                    <option value="Arial">Arial</option>
                                </select>
                                <div className="flex bg-slate-100 rounded">
                                    <button onClick={() => setIsBold(!isBold)} className={`p-1 ${isBold ? 'bg-slate-300' : ''} rounded hover:bg-slate-200`}><Bold size={14} /></button>
                                    <button onClick={() => setIsItalic(!isItalic)} className={`p-1 ${isItalic ? 'bg-slate-300' : ''} rounded hover:bg-slate-200`}><Italic size={14} /></button>
                                    <button onClick={() => setIsUnderlined(!isUnderlined)} className={`p-1 ${isUnderlined ? 'bg-slate-300' : ''} rounded hover:bg-slate-200`}><div className="underline text-[10px] font-bold">U</div></button>
                                </div>
                            </div>
                            <span className="text-[10px] text-center text-slate-500">Lettertype</span>
                        </div>
                        <div className="flex flex-col px-2 border-r border-slate-200 h-full justify-between pb-1">
                            <div className="flex gap-2">
                                <button onClick={() => setTitleStyle('comic')} className={`p-2 border ${titleStyle === 'comic' ? 'bg-blue-100 border-blue-300' : ''} w-20`}>
                                    <span className="font-[Comic_Sans_MS] text-xs">Normaal</span>
                                </button>
                                <button onClick={() => setTitleStyle('modern')} className={`p-2 border ${titleStyle === 'modern' ? 'bg-blue-100 border-blue-300' : ''} w-20`}>
                                    <span className="font-sans font-bold text-lg">Kop 1</span>
                                </button>
                            </div>
                            <span className="text-[10px] text-center text-slate-500">Stijlen</span>
                        </div>
                        {selection === 'image' && (
                            <div className="flex flex-col px-2 border-r border-slate-200 h-full justify-between pb-1 animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => setImageAlign('wrap')} className={`flex flex-col items-center p-1 ${imageAlign === 'wrap' ? 'bg-slate-200' : ''}`}>
                                    <AlignLeft size={20} /> <span className="text-[10px]">Tekstterugloop</span>
                                </button>
                                <span className="text-[10px] text-center text-purple-600 font-bold">Afbeelding</span>
                            </div>
                        )}
                    </div>
                );
            case 'Invoegen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => addBlock('pagebreak')} className="flex flex-col items-center gap-1 hover:bg-slate-100 p-2 rounded">
                            <FilePlus size={24} className="text-slate-600" /> <span className="text-[10px]">Pagina-einde</span>
                        </button>
                        <button onClick={() => addBlock('table')} className="flex flex-col items-center gap-1 hover:bg-slate-100 p-2 rounded">
                            <Table size={24} className="text-slate-600" /> <span className="text-[10px]">Tabel</span>
                        </button>
                        <button onClick={() => addBlock('shape')} className="flex flex-col items-center gap-1 hover:bg-slate-100 p-2 rounded">
                            <Square size={24} className="text-slate-600" /> <span className="text-[10px]">Vormen</span>
                        </button>
                    </div>
                );
            case 'Ontwerpen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => { setBodyFont('comic'); setPageColor('white'); }} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <span className="font-[Comic_Sans_MS] text-lg">Aa</span> <span className="text-[10px]">Basis</span>
                        </button>
                        <button onClick={() => { setBodyFont('sans'); setPageColor('#fdf6e3'); }} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <span className="font-sans font-bold text-lg text-orange-600">Aa</span> <span className="text-[10px]">Retro</span>
                        </button>
                        <div className="h-full w-px bg-slate-200 mx-2"></div>
                        <button onClick={() => setShowWatermark(!showWatermark)} className={`flex flex-col items-center hover:bg-slate-100 p-2 rounded ${showWatermark ? 'bg-slate-200' : ''}`}>
                            <Type size={20} /> <span className="text-[10px]">Watermerk</span>
                        </button>
                        <button onClick={() => setPageColor(pageColor === 'white' ? '#f0f9ff' : 'white')} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <Droplet size={20} /> <span className="text-[10px]">Paginakleur</span>
                        </button>
                    </div>
                );
            case 'Indeling':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => setLayout({ ...layout, margins: layout.margins === 'normal' ? 'narrow' : 'normal' })} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <LayoutTemplate size={24} /> <span className="text-[10px]">{layout.margins === 'normal' ? 'Normaal' : 'Smal'}</span>
                        </button>
                        <button onClick={() => setLayout({ ...layout, orientation: layout.orientation === 'portrait' ? 'landscape' : 'portrait' })} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <Layout size={24} className={layout.orientation === 'landscape' ? 'rotate-90' : ''} /> <span className="text-[10px]">Afdrukstand</span>
                        </button>
                        <button onClick={() => setLayout({ ...layout, columns: layout.columns === 1 ? 2 : 1 })} className="flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                            <Columns size={24} /> <span className="text-[10px]">Kolommen</span>
                        </button>
                    </div>
                );
            case 'Verwijzingen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={generateTOC} className="flex flex-col items-center gap-1 hover:bg-slate-100 p-2 rounded">
                            <List size={24} /> <span className="text-[10px]">Inhoudsopgave</span>
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-slate-900" onClick={() => setSelection('none')}>
            {/* Header */}
            <header className="bg-[#2B579A] text-white px-4 py-2 flex items-center justify-between shadow-md relative z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg"><ArrowLeft size={20} /></button>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Document1 - Word</span>
                        <div className="flex gap-4 text-[11px] text-white/80">
                            {['Bestand', 'Start', 'Invoegen', 'Ontwerpen', 'Indeling', 'Verwijzingen'].map(tab => (
                                <span key={tab} onClick={() => setActiveTab(tab)} className={`cursor-pointer px-1 ${activeTab === tab ? 'font-bold border-b-2 border-white pb-0.5' : 'hover:text-white'}`}>{tab}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => isComplete ? onComplete(true) : alert('Nog niet klaar! Check de opdracht.')}
                    className={`px-4 py-1.5 rounded-md font-bold text-sm flex items-center gap-2 ${isComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-white/20'}`}
                >
                    <CheckCircle size={16} /> {isComplete ? 'Inleveren' : 'Nog Bezig'}
                </button>
            </header>

            {/* Ribbon */}
            <div className="bg-white border-b border-slate-200 shadow-sm relative z-10" onClick={(e) => e.stopPropagation()}>
                {renderRibbon()}
            </div>

            {/* Workspace */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F3F4F6] perspective-[1000px]">
                <div
                    className={`bg-white shadow-xl relative transition-all duration-500 ease-in-out`}
                    style={{
                        width: layout.orientation === 'portrait' ? '21cm' : '29.7cm',
                        minHeight: layout.orientation === 'portrait' ? '29.7cm' : '21cm',
                        padding: layout.margins === 'normal' ? '2.5cm' : '1.27cm',
                        backgroundColor: pageColor
                    }}
                >
                    {/* Watermark */}
                    {showWatermark && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden text-slate-200/50 font-black text-[120px] -rotate-45 select-none">
                            VOORBEELD
                        </div>
                    )}

                    {/* Draggable Image */}
                    <motion.div
                        drag
                        dragMomentum={false}
                        onDragEnd={(e, info) => {
                            if (info.point.x > window.innerWidth / 2) setIsImageRight(true);
                        }}
                        onClick={(e) => handleSelection(e as unknown as React.MouseEvent, 'image', 'image')}
                        className={`absolute w-48 h-32 bg-slate-200 z-20 cursor-move ${selection === 'image' ? 'ring-2 ring-blue-500' : ''}`}
                        style={{ top: 150, left: 100 }}
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 1 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
                            alt="Voorbeeldafbeelding voor opmaakopdracht"
                            className="w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[9px] px-1">{imageAlign}</div>
                    </motion.div>

                    {/* Content Renderer */}
                    <div
                        className={`${layout.columns > 1 ? `columns-${layout.columns} gap-8` : ''}`}
                        style={{ fontFamily: bodyFont === 'comic' ? '"Comic Sans MS"' : 'Arial' }}
                    >
                        {blocks.map(block => (
                            <div key={block.id} className="mb-4 break-inside-avoid-column">
                                {block.type === 'heading' && (
                                    <h1
                                        onClick={(e) => handleSelection(e, block.id, 'heading')}
                                        className={`cursor-text ${titleStyle === 'comic' ? 'text-2xl text-green-600 text-center font-[Comic_Sans_MS]' : 'text-4xl font-bold border-b-2 border-black pb-2 text-left font-sans'} ${selection === block.id ? 'bg-blue-50' : ''}`}
                                    >
                                        {block.content}
                                    </h1>
                                )}
                                {block.type === 'paragraph' && (
                                    <p
                                        onClick={(e) => handleSelection(e, block.id, 'paragraph')}
                                        className={`text-justify leading-relaxed cursor-text p-1 rounded ${selection === block.id ? 'bg-blue-50' : ''} ${isBold && selection === block.id ? 'font-bold' : ''} ${isItalic && selection === block.id ? 'italic' : ''} ${isUnderlined && selection === block.id ? 'underline' : ''} ${imageAlign === 'wrap' && isImageRight ? 'w-[65%]' : ''}`}
                                        style={{ fontSize: `${fontSize}px` }}
                                    >
                                        {block.content}
                                    </p>
                                )}
                                {block.type === 'toc' && (
                                    <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-6 font-sans">
                                        <h2 className="font-bold text-lg mb-2 text-slate-700">Inhoudsopgave</h2>
                                        <ul className="list-decimal pl-4 space-y-1 text-blue-600 text-sm">
                                            {blocks.filter(b => b.type === 'heading').map(h => (
                                                <li key={'toc-' + h.id} className="hover:underline cursor-pointer">{h.content}</li>
                                            ))}
                                            <li>Conclusie</li>
                                        </ul>
                                    </div>
                                )}
                                {block.type === 'table' && (
                                    <table className="w-full border-collapse border border-slate-300 mb-4">
                                        <tbody>
                                            {[1, 2, 3].map(row => (
                                                <tr key={row}>
                                                    {[1, 2, 3].map(col => (
                                                        <td key={col} className="border border-slate-300 p-2 text-sm text-slate-500">Cel {row},{col}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {block.type === 'shape' && (
                                    <div className="w-32 h-32 bg-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold opacity-80">
                                        Vorm
                                    </div>
                                )}
                                {block.type === 'pagebreak' && (
                                    <div className="w-full h-8 flex items-center justify-center my-4">
                                        <div className="h-px bg-slate-300 w-full relative">
                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-slate-400">Pagina-einde</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
