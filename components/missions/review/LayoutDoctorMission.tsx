import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CheckCircle, Type, Image as ImageIcon, Layout, Bold, Italic,
    AlignLeft, AlignCenter, AlignRight, Play, FileText, Save, Printer,
    Table, Square, Palette, Droplet, LayoutTemplate, Columns, FilePlus,
    List, BookOpen, ChevronDown, ChevronUp, Info, X, Lightbulb
} from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

interface LayoutDoctorProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
}

interface LayoutDoctorState {
    titleStyle: string;
    imageAlign: string;
    bodyFont: string;
    fontSize: number;
    isImageRight: boolean;
}

// Opdrachtcriteria
const ASSIGNMENT_CRITERIA = [
    { id: 'title', label: 'Verander de titel naar stijl "Kop 1"', check: (s: LayoutDoctorState) => s.titleStyle === 'modern' },
    { id: 'font', label: 'Zet het lettertype op Arial', check: (s: LayoutDoctorState) => s.bodyFont === 'sans' },
    { id: 'image', label: 'Stel tekstterugloop in voor de afbeelding', check: (s: LayoutDoctorState) => s.imageAlign === 'wrap' },
    { id: 'imagepos', label: 'Sleep de afbeelding naar rechts', check: (s: LayoutDoctorState) => s.isImageRight },
    { id: 'fontsize', label: 'Gebruik minimaal lettergrootte 12', check: (s: LayoutDoctorState) => s.fontSize >= 12 },
];

// Uitleg per wijziging
const CHANGE_EXPLANATIONS: Record<string, string> = {
    titleStyle: 'Kopstijlen zorgen voor een duidelijke structuur. Een lezer ziet direct wat de titel is en kan het document snel scannen.',
    bodyFont: 'Sans-serif lettertypen zoals Arial zijn beter leesbaar op schermen. Comic Sans wordt als onprofessioneel gezien.',
    imageAlign: 'Tekstterugloop laat tekst om een afbeelding heen lopen. Dit maakt het document compacter en professioneler.',
    isImageRight: 'Afbeeldingen rechts plaatsen is een veelgebruikte conventie die de leesbaarheid verbetert.',
    fontSize: 'Lettergrootte 12 of hoger is de standaard voor goed leesbare documenten. Kleiner is vermoeiend voor de ogen.',
};

type BlockType = 'paragraph' | 'heading' | 'image' | 'table' | 'shape' | 'toc' | 'pagebreak';

interface ContentBlock {
    id: string;
    type: BlockType;
    content?: string;
    style?: any; // For text styles, alignment, etc.
}

export const LayoutDoctorMission: React.FC<LayoutDoctorProps> = ({ onComplete, onBack }) => {
    const { state: savedState, setState: setSavedState, clearSave } = useMissionAutoSave<LayoutDoctorState>(
        'layout-doctor',
        {
            titleStyle: 'comic',
            imageAlign: 'overlap',
            bodyFont: 'comic',
            fontSize: 11,
            isImageRight: false,
        }
    );

    const { titleStyle, imageAlign, bodyFont, fontSize, isImageRight } = savedState;

    // Wrapper setters that update auto-save state
    const setTitleStyle = (v: string) => {
        setSavedState(prev => ({ ...prev, titleStyle: v }));
        if (v === 'modern') setChangeExplanation('titleStyle');
    };
    const setImageAlign = (v: string) => {
        setSavedState(prev => ({ ...prev, imageAlign: v }));
        if (v === 'wrap') setChangeExplanation('imageAlign');
    };
    const setBodyFont = (v: string) => {
        setSavedState(prev => ({ ...prev, bodyFont: v }));
        if (v === 'sans') setChangeExplanation('bodyFont');
    };
    const setFontSize = (v: number) => {
        setSavedState(prev => ({ ...prev, fontSize: v }));
        if (v >= 12) setChangeExplanation('fontSize');
    };
    const setIsImageRight = (v: boolean) => {
        setSavedState(prev => ({ ...prev, isImageRight: v }));
        if (v) setChangeExplanation('isImageRight');
    };

    // Transient UI state
    const [showAssignment, setShowAssignment] = useState(true);
    const [changeExplanation, setChangeExplanation] = useState<string | null>(null);
    const [inlineMessage, setInlineMessage] = useState<string | null>(null);

    // Page Settings (not saved - cosmetic)
    const [pageColor, setPageColor] = useState('white');
    const [showWatermark, setShowWatermark] = useState(false);
    const [layout, setLayout] = useState({
        columns: 1,
        orientation: 'portrait',
        margins: 'normal',
    });

    // Auto-hide change explanation
    useEffect(() => {
        if (changeExplanation) {
            const timer = setTimeout(() => setChangeExplanation(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [changeExplanation]);

    // Auto-hide inline message
    useEffect(() => {
        if (inlineMessage) {
            const timer = setTimeout(() => setInlineMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [inlineMessage]);

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
                    <div className="px-4 py-2 flex items-center gap-4 overflow-x-auto h-24 bg-[#C46849] text-white w-full absolute top-[88px] left-0 z-50">
                        <button onClick={() => setInlineMessage('Nieuw document wordt gesimuleerd')} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg min-w-[60px] transition-all duration-300">
                            <FilePlus size={24} /> <span className="text-xs">Nieuw</span>
                        </button>
                        <button onClick={() => setInlineMessage('Document opgeslagen!')} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg min-w-[60px] transition-all duration-300">
                            <Save size={24} /> <span className="text-xs">Opslaan</span>
                        </button>
                    </div>
                );
            case 'Start':
                return (
                    <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto h-24">
                        {/* Font & Title Styles logic similar to before but generalized */}
                        <div className="flex flex-col px-2 border-r border-[#E8E6DF] h-full justify-between pb-1">
                            <div className="flex gap-1 mb-1">
                                <select
                                    className="w-32 text-xs border border-[#E8E6DF] rounded focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                    value={bodyFont === 'comic' ? 'Comic Sans MS' : 'Arial'}
                                    onChange={(e) => setBodyFont(e.target.value === 'Arial' ? 'sans' : 'comic')}
                                >
                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                    <option value="Arial">Arial</option>
                                </select>
                                <div className="flex bg-[#FAF9F0] rounded">
                                    <button onClick={() => setIsBold(!isBold)} className={`p-1 ${isBold ? 'bg-[#E8E6DF]' : ''} rounded hover:bg-[#E8E6DF] transition-all duration-300`}><Bold size={14} /></button>
                                    <button onClick={() => setIsItalic(!isItalic)} className={`p-1 ${isItalic ? 'bg-[#E8E6DF]' : ''} rounded hover:bg-[#E8E6DF] transition-all duration-300`}><Italic size={14} /></button>
                                    <button onClick={() => setIsUnderlined(!isUnderlined)} className={`p-1 ${isUnderlined ? 'bg-[#E8E6DF]' : ''} rounded hover:bg-[#E8E6DF] transition-all duration-300`}><div className="underline text-[10px] font-bold">U</div></button>
                                </div>
                            </div>
                            <span className="text-[10px] text-center text-[#6B6B66]">Lettertype</span>
                        </div>
                        <div className="flex flex-col px-2 border-r border-[#E8E6DF] h-full justify-between pb-1">
                            <div className="flex gap-2">
                                <button onClick={() => setTitleStyle('comic')} className={`p-2 border rounded-lg transition-all duration-300 ${titleStyle === 'comic' ? 'bg-[#D97757]/10 border-[#D97757]' : 'border-[#E8E6DF]'} w-20`}>
                                    <span className="font-[Comic_Sans_MS] text-xs">Normaal</span>
                                </button>
                                <button onClick={() => setTitleStyle('modern')} className={`p-2 border rounded-lg transition-all duration-300 ${titleStyle === 'modern' ? 'bg-[#D97757]/10 border-[#D97757]' : 'border-[#E8E6DF]'} w-20`}>
                                    <span className="font-sans font-bold text-lg">Kop 1</span>
                                </button>
                            </div>
                            <span className="text-[10px] text-center text-[#6B6B66]">Stijlen</span>
                        </div>
                        {selection === 'image' && (
                            <div className="flex flex-col px-2 border-r border-[#E8E6DF] h-full justify-between pb-1 animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => setImageAlign('wrap')} className={`flex flex-col items-center p-1 rounded-lg transition-all duration-300 ${imageAlign === 'wrap' ? 'bg-[#E8E6DF]' : ''}`}>
                                    <AlignLeft size={20} /> <span className="text-[10px]">Tekstterugloop</span>
                                </button>
                                <span className="text-[10px] text-center text-[#8B6F9E] font-bold">Afbeelding</span>
                            </div>
                        )}
                    </div>
                );
            case 'Invoegen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => addBlock('pagebreak')} className="flex flex-col items-center gap-1 hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <FilePlus size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Pagina-einde</span>
                        </button>
                        <button onClick={() => addBlock('table')} className="flex flex-col items-center gap-1 hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <Table size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Tabel</span>
                        </button>
                        <button onClick={() => addBlock('shape')} className="flex flex-col items-center gap-1 hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <Square size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Vormen</span>
                        </button>
                    </div>
                );
            case 'Ontwerpen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => { setBodyFont('comic'); setPageColor('white'); }} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <span className="font-[Comic_Sans_MS] text-lg text-[#3D3D38]">Aa</span> <span className="text-[10px] text-[#6B6B66]">Basis</span>
                        </button>
                        <button onClick={() => { setBodyFont('sans'); setPageColor('#fdf6e3'); }} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <span className="font-sans font-bold text-lg text-[#D97757]">Aa</span> <span className="text-[10px] text-[#6B6B66]">Retro</span>
                        </button>
                        <div className="h-full w-px bg-[#E8E6DF] mx-2"></div>
                        <button onClick={() => setShowWatermark(!showWatermark)} className={`flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300 ${showWatermark ? 'bg-[#E8E6DF]' : ''}`}>
                            <Type size={20} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Watermerk</span>
                        </button>
                        <button onClick={() => setPageColor(pageColor === 'white' ? '#FDF5F0' : 'white')} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <Droplet size={20} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Paginakleur</span>
                        </button>
                    </div>
                );
            case 'Indeling':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={() => setLayout({ ...layout, margins: layout.margins === 'normal' ? 'narrow' : 'normal' })} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <LayoutTemplate size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">{layout.margins === 'normal' ? 'Normaal' : 'Smal'}</span>
                        </button>
                        <button onClick={() => setLayout({ ...layout, orientation: layout.orientation === 'portrait' ? 'landscape' : 'portrait' })} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <Layout size={24} className={`text-[#3D3D38] ${layout.orientation === 'landscape' ? 'rotate-90' : ''}`} /> <span className="text-[10px] text-[#6B6B66]">Afdrukstand</span>
                        </button>
                        <button onClick={() => setLayout({ ...layout, columns: layout.columns === 1 ? 2 : 1 })} className="flex flex-col items-center hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <Columns size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Kolommen</span>
                        </button>
                    </div>
                );
            case 'Verwijzingen':
                return (
                    <div className="px-4 py-2 flex items-center gap-4 h-24">
                        <button onClick={generateTOC} className="flex flex-col items-center gap-1 hover:bg-[#FAF9F0] p-2 rounded-lg transition-all duration-300">
                            <List size={24} className="text-[#3D3D38]" /> <span className="text-[10px] text-[#6B6B66]">Inhoudsopgave</span>
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F0] flex flex-col text-[#1A1A19]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }} onClick={() => setSelection('none')}>
            {/* Header */}
            <header className="bg-[#C46849] text-white px-4 py-2 flex items-center justify-between shadow-md relative z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft size={20} /></button>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Document1 - Word</span>
                        <div className="flex gap-2 lg:gap-4 text-[11px] text-white/80 overflow-x-auto">
                            {['Bestand', 'Start', 'Invoegen', 'Ontwerpen', 'Indeling', 'Verwijzingen'].map(tab => (
                                <span key={tab} onClick={() => setActiveTab(tab)} className={`cursor-pointer px-1 whitespace-nowrap transition-all duration-300 ${activeTab === tab ? 'font-bold border-b-2 border-white pb-0.5' : 'hover:text-white'}`}>{tab}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => { if (isComplete) { clearSave(); onComplete(true); } else { setInlineMessage('Nog niet klaar! Check de opdrachtkaart bovenaan.'); setShowAssignment(true); } }}
                    className={`px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white ${isComplete ? 'bg-[#10B981] hover:bg-emerald-600' : 'bg-white/20'}`}
                >
                    <CheckCircle size={16} /> {isComplete ? 'Inleveren' : 'Nog Bezig'}
                </button>
            </header>

            {/* Ribbon */}
            <div className="bg-white border-b border-[#E8E6DF] shadow-sm relative z-10 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                <div className="min-w-max">
                    {renderRibbon()}
                </div>
            </div>

            {/* Inline Message Toast */}
            <AnimatePresence>
                {inlineMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A19] text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-2"
                    >
                        <Info size={16} />
                        {inlineMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Explanation Toast */}
            <AnimatePresence>
                {changeExplanation && CHANGE_EXPLANATIONS[changeExplanation] && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2A9D8F] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium max-w-md flex items-start gap-3"
                    >
                        <Lightbulb size={18} className="shrink-0 mt-0.5" />
                        <span>{CHANGE_EXPLANATIONS[changeExplanation]}</span>
                        <button onClick={() => setChangeExplanation(null)} className="shrink-0 hover:bg-white/10 rounded-full p-0.5 transition-colors">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Workspace */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col items-center bg-[#FAF9F0] perspective-[1000px]">
                {/* Opdrachtkaart */}
                <div className={`w-full max-w-4xl mb-4 transition-all duration-300 ${showAssignment ? '' : 'mb-2'}`}>
                    <button
                        onClick={() => setShowAssignment(!showAssignment)}
                        className="w-full flex items-center justify-between bg-white border border-[#E8E6DF] rounded-t-2xl px-4 py-3 text-left shadow-sm hover:bg-[#FAF9F0] transition-colors"
                    >
                        <span className="font-bold text-sm text-[#D97757] flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            <FileText size={16} /> Opdracht: Maak dit document professioneel
                        </span>
                        {showAssignment ? <ChevronUp size={16} className="text-[#6B6B66]" /> : <ChevronDown size={16} className="text-[#6B6B66]" />}
                    </button>
                    {showAssignment && (
                        <div className="bg-white border border-t-0 border-[#E8E6DF] rounded-b-2xl px-4 py-4 shadow-sm">
                            <p className="text-sm text-[#3D3D38] mb-3">Voer alle stappen uit om het document op te knappen:</p>
                            <ul className="space-y-2">
                                {ASSIGNMENT_CRITERIA.map((criterion) => {
                                    const done = criterion.check(savedState);
                                    return (
                                        <li key={criterion.id} className={`flex items-center gap-3 text-sm transition-all duration-300 ${done ? 'text-[#10B981]' : 'text-[#3D3D38]'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${done ? 'bg-[#10B981] text-white' : 'border-2 border-[#E8E6DF]'}`}>
                                                {done && <CheckCircle size={12} />}
                                            </div>
                                            <span className={done ? 'line-through' : ''}>{criterion.label}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="mt-3 h-2 bg-[#E8E6DF] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                                    style={{ width: `${(ASSIGNMENT_CRITERIA.filter(c => c.check(savedState)).length / ASSIGNMENT_CRITERIA.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="bg-white shadow-xl relative transition-all duration-500 ease-in-out w-full max-w-full lg:max-w-none"
                    style={{
                        width: layout.orientation === 'portrait' ? 'min(21cm, 100%)' : 'min(29.7cm, 100%)',
                        minHeight: layout.orientation === 'portrait' ? '29.7cm' : '21cm',
                        padding: layout.margins === 'normal' ? 'clamp(1rem, 4vw, 2.5cm)' : 'clamp(0.5rem, 2vw, 1.27cm)',
                        backgroundColor: pageColor
                    }}
                >
                    {/* Watermark */}
                    {showWatermark && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden text-[#E8E6DF]/50 font-black text-[120px] -rotate-45 select-none">
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
                        className={`absolute w-32 h-24 lg:w-48 lg:h-32 bg-[#E8E6DF] z-20 cursor-move ${selection === 'image' ? 'ring-2 ring-[#D97757]' : ''}`}
                        style={{ top: 150, left: 100 }}
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 1 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
                            alt="Voorbeeldafbeelding voor opmaakopdracht"
                            className="w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute bottom-0 right-0 bg-[#1A1A19]/50 text-white text-[9px] px-1">{imageAlign}</div>
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
                                        className={`cursor-text ${titleStyle === 'comic' ? 'text-2xl text-green-600 text-center font-[Comic_Sans_MS]' : 'text-4xl font-bold border-b-2 border-[#1A1A19] pb-2 text-left font-sans'} ${selection === block.id ? 'bg-[#D97757]/10' : ''}`}
                                    >
                                        {block.content}
                                    </h1>
                                )}
                                {block.type === 'paragraph' && (
                                    <p
                                        onClick={(e) => handleSelection(e, block.id, 'paragraph')}
                                        className={`text-justify leading-relaxed cursor-text p-1 rounded ${selection === block.id ? 'bg-[#D97757]/10' : ''} ${isBold && selection === block.id ? 'font-bold' : ''} ${isItalic && selection === block.id ? 'italic' : ''} ${isUnderlined && selection === block.id ? 'underline' : ''} ${imageAlign === 'wrap' && isImageRight ? 'w-[65%]' : ''}`}
                                        style={{ fontSize: `${fontSize}px` }}
                                    >
                                        {block.content}
                                    </p>
                                )}
                                {block.type === 'toc' && (
                                    <div className="bg-[#FAF9F0] p-4 rounded-2xl border border-[#E8E6DF] mb-6 font-sans">
                                        <h2 className="font-bold text-lg mb-2 text-[#3D3D38]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Inhoudsopgave</h2>
                                        <ul className="list-decimal pl-4 space-y-1 text-[#2A9D8F] text-sm">
                                            {blocks.filter(b => b.type === 'heading').map(h => (
                                                <li key={'toc-' + h.id} className="hover:underline cursor-pointer">{h.content}</li>
                                            ))}
                                            <li>Conclusie</li>
                                        </ul>
                                    </div>
                                )}
                                {block.type === 'table' && (
                                    <table className="w-full border-collapse border border-[#E8E6DF] mb-4">
                                        <tbody>
                                            {[1, 2, 3].map(row => (
                                                <tr key={row}>
                                                    {[1, 2, 3].map(col => (
                                                        <td key={col} className="border border-[#E8E6DF] p-2 text-sm text-[#6B6B66]">Cel {row},{col}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {block.type === 'shape' && (
                                    <div className="w-32 h-32 bg-[#8B6F9E] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold opacity-80">
                                        Vorm
                                    </div>
                                )}
                                {block.type === 'pagebreak' && (
                                    <div className="w-full h-8 flex items-center justify-center my-4">
                                        <div className="h-px bg-[#E8E6DF] w-full relative">
                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-[#6B6B66]">Pagina-einde</span>
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
