
import React, { useState } from 'react';
import {
    Type, Image as ImageIcon,
    ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Heading, Scissors, Copy, Clipboard,
    ZoomIn, ZoomOut, Search, Eye,
    BookOpen, Hash, Square, BringToFront, SendToBack, Trash2,
    Table, Link2, Minus, FileText, Columns, LayoutGrid,
    Paintbrush, Highlighter, Subscript, Superscript,
    IndentIncrease, IndentDecrease, Pilcrow, ArrowUpDown,
    Ruler, SeparatorHorizontal, Image, Shapes,
    MessageSquare, SpellCheck, Languages, GitCompare,
    Maximize, PanelLeft, BookOpenCheck, Grid3X3,
    RotateCcw
} from 'lucide-react';
import { SimulatorState } from './types';

interface RibbonProps {
    state: SimulatorState;
    onAction: (action: string, payload?: any) => void;
    onTabChange: (tab: string) => void;
    hasSelection: boolean;
    selectedImageWrapMode?: 'square' | 'front' | 'behind';
}

// Reusable group separator
const GroupSeparator = () => (
    <div className="w-px bg-[#d1d1d1] mx-1 self-stretch my-1" />
);

// Group label at the bottom
const GroupLabel = ({ label }: { label: string }) => (
    <div className="text-[10px] text-[#6b6b6b] text-center mt-auto pt-0.5 border-t border-[#e0e0e0] w-full font-normal tracking-wide">
        {label}
    </div>
);

// Large ribbon button (icon on top, label below)
const RibbonButtonLarge = ({
    icon: Icon, label, action, payload, disabled = false, onClick, active = false
}: {
    icon: any, label: string, action?: string, payload?: any, disabled?: boolean,
    onClick?: () => void, active?: boolean
}) => (
    <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick || undefined}
        disabled={disabled}
        className={`
            flex flex-col items-center justify-center px-2 py-1 rounded-sm min-w-[52px]
            transition-colors select-none
            ${active ? 'bg-[#c8e0f9] border border-[#98c6f7]' : 'hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2]'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-default'}
        `}
    >
        <Icon size={22} className="mb-0.5 text-[#404040]" strokeWidth={1.5} />
        <span className="text-[10px] text-center leading-tight text-[#404040] whitespace-nowrap">{label}</span>
    </button>
);

// Small ribbon button (icon only or icon + label inline)
const RibbonButtonSmall = ({
    icon: Icon, label, title, action, disabled = false, onClick, active = false, size = 14
}: {
    icon: any, label?: string, title?: string, action?: string, disabled?: boolean,
    onClick?: () => void, active?: boolean, size?: number
}) => (
    <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick || undefined}
        disabled={disabled}
        title={title || label}
        className={`
            flex items-center justify-center p-1 rounded-sm transition-colors select-none
            ${active ? 'bg-[#c8e0f9] border border-[#98c6f7]' : 'hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2]'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-default'}
        `}
    >
        <Icon size={size} className="text-[#404040]" strokeWidth={1.5} />
    </button>
);

// Split button (main action + dropdown arrow)
const SplitButton = ({
    icon: Icon, label, onClick, disabled = false
}: {
    icon: any, label: string, onClick?: () => void, disabled?: boolean
}) => (
    <div className={`flex flex-col items-center ${disabled ? 'opacity-40' : ''}`}>
        <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            disabled={disabled}
            className="flex flex-col items-center px-3 py-1 rounded-t-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default transition-colors"
        >
            <Icon size={28} className="text-[#404040]" strokeWidth={1.5} />
        </button>
        <button
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-b-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default transition-colors"
        >
            <span className="text-[10px] text-[#404040]">{label}</span>
            <ChevronDown size={8} className="text-[#404040]" />
        </button>
    </div>
);

// Font dropdown (decorative)
const FontDropdown = ({ value }: { value: string }) => (
    <div className="flex items-center bg-white border border-[#c0c0c0] rounded-sm h-[22px] px-2 min-w-[130px] cursor-default hover:border-[#3c7fb1]">
        <span className="text-[12px] text-[#404040] flex-1 truncate" style={{ fontFamily: value }}>{value}</span>
        <ChevronDown size={10} className="text-[#808080] ml-1 shrink-0" />
    </div>
);

// Font size dropdown (decorative)
const FontSizeDropdown = ({ value }: { value: number }) => (
    <div className="flex items-center bg-white border border-[#c0c0c0] rounded-sm h-[22px] px-2 w-[42px] cursor-default hover:border-[#3c7fb1]">
        <span className="text-[12px] text-[#404040] flex-1 text-center">{value}</span>
        <ChevronDown size={10} className="text-[#808080] ml-0.5 shrink-0" />
    </div>
);

// Style gallery card
const StyleCard = ({
    label, fontSize, fontWeight, color, active, onClick
}: {
    label: string, fontSize: string, fontWeight: string, color: string,
    active?: boolean, onClick?: () => void
}) => (
    <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={`
            flex items-end px-2 py-1 border rounded-sm min-w-[60px] h-[56px] cursor-default transition-colors
            ${active
                ? 'border-[#4e9bd5] bg-[#e5f0fb] shadow-sm'
                : 'border-[#d5d5d5] bg-white hover:border-[#91c4e9] hover:bg-[#f5f9fc]'
            }
        `}
    >
        <span
            className="leading-none truncate w-full"
            style={{ fontSize, fontWeight, color }}
        >
            {label}
        </span>
    </button>
);

export const Ribbon: React.FC<RibbonProps> = ({ state, onAction, onTabChange, hasSelection, selectedImageWrapMode }) => {

    const tabs = [
        { id: 'bestand', label: 'Bestand' },
        { id: 'start', label: 'Start' },
        { id: 'invoegen', label: 'Invoegen' },
        { id: 'ontwerp', label: 'Ontwerp' },
        { id: 'indeling', label: 'Indeling' },
        { id: 'verwijzingen', label: 'Verwijzingen' },
        { id: 'verzendlijsten', label: 'Verzendlijsten' },
        { id: 'controleren', label: 'Controleren' },
        { id: 'beeld', label: 'Beeld' },
    ];

    return (
        <div className="bg-[#f3f3f3] border-b border-[#d1d1d1] shrink-0 z-30 relative select-none">
            {/* TABS ROW */}
            <div className="flex items-end px-1 bg-[#f3f3f3]">
                {tabs.map(tab => {
                    const isActive = state.activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                px-3 py-[5px] text-[12px] transition-colors relative cursor-default
                                ${isActive
                                    ? 'bg-[#fdfdfd] text-[#1a1a1a] border-t border-l border-r border-[#d1d1d1] border-b-0 -mb-px z-10 rounded-t-[3px] font-medium'
                                    : 'text-[#444] hover:bg-[#e8e8e8] border border-transparent'
                                }
                                ${tab.id === 'bestand' ? 'bg-[#185abd] text-white hover:bg-[#1a4fa0] rounded-[3px] font-medium mr-1 border-none' : ''}
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* RIBBON CONTENT */}
            <div className="bg-[#fdfdfd] border-t border-[#d1d1d1] min-h-[90px] px-2 py-1 flex items-stretch gap-0 overflow-x-auto">

                {/* ===== START TAB ===== */}
                {state.activeTab === 'start' && (
                    <>
                        {/* --- Klembord Group --- */}
                        <div className="flex flex-col items-center pr-1">
                            <div className="flex items-start gap-0 flex-1">
                                <SplitButton icon={Clipboard} label="Plakken" />
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <RibbonButtonSmall icon={Scissors} title="Knippen" />
                                    <RibbonButtonSmall icon={Copy} title="Kopiëren" />
                                    <RibbonButtonSmall icon={Paintbrush} title="Opmaak kopiëren/plakken" />
                                </div>
                            </div>
                            <GroupLabel label="Klembord" />
                        </div>
                        <GroupSeparator />

                        {/* --- Lettertype Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex flex-col gap-1 flex-1 py-0.5">
                                {/* Row 1: Font name + size */}
                                <div className="flex items-center gap-1">
                                    <FontDropdown value="Calibri" />
                                    <FontSizeDropdown value={11} />
                                    {/* Grow/Shrink font */}
                                    <RibbonButtonSmall icon={Type} title="Lettergrootte vergroten" size={12} />
                                    <RibbonButtonSmall icon={Type} title="Lettergrootte verkleinen" size={10} />
                                </div>
                                {/* Row 2: Formatting buttons */}
                                <div className="flex items-center gap-0">
                                    <RibbonButtonSmall icon={Bold} title="Vet" onClick={() => onAction('bold')} />
                                    <RibbonButtonSmall icon={Italic} title="Cursief" onClick={() => onAction('italic')} />
                                    <RibbonButtonSmall icon={Underline} title="Onderstrepen" onClick={() => onAction('underline')} />
                                    <RibbonButtonSmall icon={Strikethrough} title="Doorhalen" />
                                    <RibbonButtonSmall icon={Subscript} title="Subscript" />
                                    <RibbonButtonSmall icon={Superscript} title="Superscript" />
                                    <div className="w-px h-4 bg-[#d1d1d1] mx-0.5" />
                                    {/* Text highlight color */}
                                    <div className="flex items-center">
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            className="flex items-center p-1 rounded-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default"
                                            title="Markeerstiftkleur"
                                        >
                                            <Highlighter size={14} className="text-[#404040]" strokeWidth={1.5} />
                                            <div className="w-3.5 h-1 bg-yellow-300 mt-0.5 -ml-0.5" />
                                        </button>
                                    </div>
                                    {/* Font color */}
                                    <div className="flex items-center">
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            className="flex items-center p-1 rounded-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default"
                                            title="Tekenkleur"
                                        >
                                            <Type size={14} className="text-[#404040]" strokeWidth={1.5} />
                                            <div className="w-3.5 h-1 bg-red-500 mt-0.5 -ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <GroupLabel label="Lettertype" />
                        </div>
                        <GroupSeparator />

                        {/* --- Alinea Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex flex-col gap-1 flex-1 py-0.5">
                                {/* Row 1: Lists + indent + sort */}
                                <div className="flex items-center gap-0">
                                    <RibbonButtonSmall icon={List} title="Opsommingstekens" onClick={() => onAction('bulletList')} />
                                    <RibbonButtonSmall icon={ListOrdered} title="Nummering" />
                                    <div className="w-px h-4 bg-[#d1d1d1] mx-0.5" />
                                    <RibbonButtonSmall icon={IndentDecrease} title="Inspringing verkleinen" />
                                    <RibbonButtonSmall icon={IndentIncrease} title="Inspringing vergroten" />
                                    <div className="w-px h-4 bg-[#d1d1d1] mx-0.5" />
                                    <RibbonButtonSmall icon={ArrowUpDown} title="Sorteren" />
                                    <RibbonButtonSmall icon={Pilcrow} title="Alles weergeven" />
                                </div>
                                {/* Row 2: Alignment + spacing */}
                                <div className="flex items-center gap-0">
                                    <RibbonButtonSmall icon={AlignLeft} title="Links uitlijnen" onClick={() => onAction('alignLeft')} />
                                    <RibbonButtonSmall icon={AlignCenter} title="Centreren" onClick={() => onAction('alignCenter')} />
                                    <RibbonButtonSmall icon={AlignRight} title="Rechts uitlijnen" onClick={() => onAction('alignRight')} />
                                    <RibbonButtonSmall icon={AlignJustify} title="Uitvullen" />
                                    <div className="w-px h-4 bg-[#d1d1d1] mx-0.5" />
                                    <RibbonButtonSmall icon={SeparatorHorizontal} title="Regelafstand" />
                                    {/* Shading */}
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="flex items-center p-1 rounded-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default"
                                        title="Arcering"
                                    >
                                        <div className="w-3.5 h-3.5 border border-[#808080] bg-white" />
                                    </button>
                                    {/* Border */}
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="flex items-center gap-0.5 p-1 rounded-sm hover:bg-[#e5f0fb] border border-transparent hover:border-[#c8ddf2] cursor-default"
                                        title="Randen"
                                    >
                                        <Grid3X3 size={14} className="text-[#404040]" strokeWidth={1.5} />
                                        <ChevronDown size={8} className="text-[#808080]" />
                                    </button>
                                </div>
                            </div>
                            <GroupLabel label="Alinea" />
                        </div>
                        <GroupSeparator />

                        {/* --- Stijlen Group (Gallery) --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-1 flex-1 py-0.5">
                                <StyleCard
                                    label="Normaal"
                                    fontSize="11px"
                                    fontWeight="normal"
                                    color="#404040"
                                    onClick={() => onAction('normal')}
                                />
                                <StyleCard
                                    label="Geen af..."
                                    fontSize="11px"
                                    fontWeight="normal"
                                    color="#404040"
                                />
                                <StyleCard
                                    label="Kop 1"
                                    fontSize="15px"
                                    fontWeight="600"
                                    color="#2e74b5"
                                    onClick={() => onAction('heading1')}
                                />
                                <StyleCard
                                    label="Kop 2"
                                    fontSize="13px"
                                    fontWeight="600"
                                    color="#2e74b5"
                                />
                                <StyleCard
                                    label="Titel"
                                    fontSize="18px"
                                    fontWeight="300"
                                    color="#404040"
                                    onClick={() => onAction('title')}
                                />
                                <StyleCard
                                    label="Ondertitel"
                                    fontSize="12px"
                                    fontWeight="normal"
                                    color="#808080"
                                />
                                {/* Scroll arrow */}
                                <div className="flex flex-col gap-0 ml-0.5">
                                    <button className="p-0.5 hover:bg-[#e5f0fb] border border-[#d5d5d5] rounded-t-sm cursor-default">
                                        <ChevronDown size={10} className="text-[#808080] rotate-180" />
                                    </button>
                                    <button className="p-0.5 hover:bg-[#e5f0fb] border border-[#d5d5d5] border-t-0 rounded-b-sm cursor-default">
                                        <ChevronDown size={10} className="text-[#808080]" />
                                    </button>
                                </div>
                            </div>
                            <GroupLabel label="Stijlen" />
                        </div>
                        <GroupSeparator />

                        {/* --- Bewerken Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex flex-col gap-0.5 flex-1 py-0.5">
                                <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm hover:bg-[#e5f0fb] cursor-default">
                                    <Search size={14} className="text-[#404040]" strokeWidth={1.5} />
                                    <span className="text-[11px] text-[#404040]">Zoeken</span>
                                </div>
                                <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm hover:bg-[#e5f0fb] cursor-default">
                                    <GitCompare size={14} className="text-[#404040]" strokeWidth={1.5} />
                                    <span className="text-[11px] text-[#404040]">Vervangen</span>
                                </div>
                                <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm hover:bg-[#e5f0fb] cursor-default">
                                    <LayoutGrid size={14} className="text-[#404040]" strokeWidth={1.5} />
                                    <span className="text-[11px] text-[#404040]">Selecteren</span>
                                    <ChevronDown size={8} className="text-[#808080]" />
                                </div>
                            </div>
                            <GroupLabel label="Bewerken" />
                        </div>
                    </>
                )}

                {/* ===== INVOEGEN TAB ===== */}
                {state.activeTab === 'invoegen' && (
                    <>
                        {/* --- Pagina's Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={FileText} label="Voorblad" />
                                <RibbonButtonLarge icon={Minus} label="Lege pagina" />
                                <RibbonButtonLarge icon={SeparatorHorizontal} label="Pagina-einde" />
                            </div>
                            <GroupLabel label="Pagina's" />
                        </div>
                        <GroupSeparator />

                        {/* --- Tabellen Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <SplitButton icon={Table} label="Tabel" />
                            </div>
                            <GroupLabel label="Tabellen" />
                        </div>
                        <GroupSeparator />

                        {/* --- Illustraties Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={Image} label="Afbeelding" onClick={() => onAction('insertImage')} />
                                <RibbonButtonLarge icon={Shapes} label="Vormen" />
                            </div>
                            <GroupLabel label="Illustraties" />
                        </div>
                        <GroupSeparator />

                        {/* --- Koptekst en voettekst Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={FileText} label="Koptekst" />
                                <RibbonButtonLarge icon={FileText} label="Voettekst" />
                                <RibbonButtonLarge icon={Hash} label="Pagina-nummer" onClick={() => onAction('pageNumber')} />
                            </div>
                            <GroupLabel label="Koptekst en voettekst" />
                        </div>
                        <GroupSeparator />

                        {/* --- Koppelingen Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={Link2} label="Hyperlink" />
                            </div>
                            <GroupLabel label="Koppelingen" />
                        </div>
                    </>
                )}

                {/* ===== ONTWERP TAB ===== */}
                {state.activeTab === 'ontwerp' && (
                    <>
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-2 flex-1 py-1">
                                {/* Theme thumbnails */}
                                {['Office', 'Facet', 'Integraal', 'Ion', 'Terugblik'].map((theme, i) => (
                                    <button
                                        key={theme}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className={`
                                            w-[62px] h-[56px] rounded border text-[10px] flex flex-col items-center justify-end pb-1 cursor-default transition-colors
                                            ${i === 0 ? 'border-[#4e9bd5] bg-[#e5f0fb]' : 'border-[#d5d5d5] bg-white hover:border-[#91c4e9]'}
                                        `}
                                    >
                                        {/* Mini document preview */}
                                        <div className="w-[46px] h-[32px] bg-gradient-to-b from-[#f0f0f0] to-white border border-[#e0e0e0] rounded-sm mb-1 flex flex-col items-start justify-center px-1">
                                            <div className={`h-[3px] w-[30px] rounded-full mb-0.5 ${i === 0 ? 'bg-[#2e74b5]' : i === 1 ? 'bg-[#c75b12]' : i === 2 ? 'bg-[#1b7734]' : i === 3 ? 'bg-[#7030a0]' : 'bg-[#444]'}`} />
                                            <div className="h-[2px] w-[38px] bg-[#d0d0d0] rounded-full mb-0.5" />
                                            <div className="h-[2px] w-[34px] bg-[#d0d0d0] rounded-full" />
                                        </div>
                                        <span className="text-[#606060]">{theme}</span>
                                    </button>
                                ))}
                            </div>
                            <GroupLabel label="Documentopmaak" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-1 flex-1 py-0.5">
                                {/* Color swatches */}
                                {['#2e74b5', '#c75b12', '#1b7734', '#7030a0'].map((color) => (
                                    <button
                                        key={color}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="w-7 h-7 rounded border border-[#d5d5d5] hover:border-[#91c4e9] cursor-default"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <GroupLabel label="Kleuren" />
                        </div>
                    </>
                )}

                {/* ===== INDELING TAB ===== */}
                {state.activeTab === 'indeling' && (
                    <>
                        {/* --- Pagina-instelling Group --- */}
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <div className="flex flex-col items-center">
                                    <RibbonButtonLarge
                                        icon={FileText}
                                        label="Marges"
                                    />
                                    {/* Margin options dropdown */}
                                    <div className="flex gap-0.5 -mt-1">
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onAction('margins', 'normal')}
                                            className={`text-[9px] px-1.5 py-0.5 rounded-sm border cursor-default transition-colors ${state.margins === 'normal'
                                                ? 'bg-[#c8e0f9] border-[#98c6f7] text-[#1a4fa0]'
                                                : 'bg-white border-[#d1d1d1] hover:bg-[#e5f0fb] text-[#404040]'
                                                }`}
                                        >
                                            Normaal
                                        </button>
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onAction('margins', 'narrow')}
                                            className={`text-[9px] px-1.5 py-0.5 rounded-sm border cursor-default transition-colors ${state.margins === 'narrow'
                                                ? 'bg-[#c8e0f9] border-[#98c6f7] text-[#1a4fa0]'
                                                : 'bg-white border-[#d1d1d1] hover:bg-[#e5f0fb] text-[#404040]'
                                                }`}
                                        >
                                            Smal
                                        </button>
                                    </div>
                                </div>
                                <RibbonButtonLarge icon={RotateCcw} label="Afdrukstand" />
                                <RibbonButtonLarge icon={FileText} label="Formaat" />
                                <RibbonButtonLarge icon={Columns} label="Kolommen" />
                            </div>
                            <GroupLabel label="Pagina-instelling" />
                        </div>
                        <GroupSeparator />

                        {/* --- Tekstomloop Group (Image tools) --- */}
                        <div className={`flex flex-col items-center px-1 ${!hasSelection ? 'opacity-40' : ''}`}>
                            <div className="flex items-center gap-1 flex-1 py-0.5">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] text-[#6b6b6b] font-medium px-1">Tekstomloop</span>
                                    <div className="flex gap-0.5">
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onAction('wrapMode', 'square')}
                                            disabled={!hasSelection}
                                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-sm border cursor-default transition-colors
                                                ${selectedImageWrapMode === 'square'
                                                    ? 'bg-[#c8e0f9] border-[#98c6f7]'
                                                    : 'bg-white border-[#d5d5d5] hover:bg-[#e5f0fb] hover:border-[#91c4e9]'
                                                }`}
                                            title="Vierkant"
                                        >
                                            <Square size={18} className="mb-0.5 text-[#404040]" strokeWidth={1.5} />
                                            <span className="text-[9px] text-[#404040]">Vierkant</span>
                                        </button>
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onAction('wrapMode', 'front')}
                                            disabled={!hasSelection}
                                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-sm border cursor-default transition-colors
                                                ${selectedImageWrapMode === 'front'
                                                    ? 'bg-[#c8e0f9] border-[#98c6f7]'
                                                    : 'bg-white border-[#d5d5d5] hover:bg-[#e5f0fb] hover:border-[#91c4e9]'
                                                }`}
                                            title="Voor tekst"
                                        >
                                            <BringToFront size={18} className="mb-0.5 text-[#404040]" strokeWidth={1.5} />
                                            <span className="text-[9px] text-[#404040]">Voor</span>
                                        </button>
                                        <button
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onAction('wrapMode', 'behind')}
                                            disabled={!hasSelection}
                                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-sm border cursor-default transition-colors
                                                ${selectedImageWrapMode === 'behind'
                                                    ? 'bg-[#c8e0f9] border-[#98c6f7]'
                                                    : 'bg-white border-[#d5d5d5] hover:bg-[#e5f0fb] hover:border-[#91c4e9]'
                                                }`}
                                            title="Achter tekst"
                                        >
                                            <SendToBack size={18} className="mb-0.5 text-[#404040]" strokeWidth={1.5} />
                                            <span className="text-[9px] text-[#404040]">Achter</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <GroupLabel label="Schikken" />
                        </div>
                        <GroupSeparator />

                        {/* --- Acties Group (Delete) --- */}
                        <div className={`flex flex-col items-center px-1 ${!hasSelection ? 'opacity-40' : ''}`}>
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <button
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => onAction('deleteImage')}
                                    disabled={!hasSelection}
                                    className="flex flex-col items-center justify-center px-3 py-1 rounded-sm min-w-[52px] hover:bg-red-50 border border-transparent hover:border-red-200 cursor-default transition-colors"
                                    title="Verwijder afbeelding"
                                >
                                    <Trash2 size={22} className="mb-0.5 text-[#404040]" strokeWidth={1.5} />
                                    <span className="text-[10px] text-[#404040]">Verwijder</span>
                                </button>
                            </div>
                            <GroupLabel label="Acties" />
                        </div>
                    </>
                )}

                {/* ===== VERWIJZINGEN TAB ===== */}
                {state.activeTab === 'verwijzingen' && (
                    <>
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={BookOpen} label="Inhouds-opgave" onClick={() => onAction('toc')} />
                                <RibbonButtonLarge icon={FileText} label="Voetnoot" />
                                <RibbonButtonLarge icon={BookOpenCheck} label="Citaat" />
                            </div>
                            <GroupLabel label="Inhoudsopgave" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={FileText} label="Bibliografie" />
                            </div>
                            <GroupLabel label="Citaten en bibliografie" />
                        </div>
                    </>
                )}

                {/* ===== VERZENDLIJSTEN TAB ===== */}
                {state.activeTab === 'verzendlijsten' && (
                    <>
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={FileText} label="Enveloppen" />
                                <RibbonButtonLarge icon={FileText} label="Etiketten" />
                            </div>
                            <GroupLabel label="Maken" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={FileText} label="Afdruk samenvoegen starten" />
                            </div>
                            <GroupLabel label="Afdruk samenvoegen starten" />
                        </div>
                    </>
                )}

                {/* ===== CONTROLEREN TAB ===== */}
                {state.activeTab === 'controleren' && (
                    <>
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={SpellCheck} label="Spelling" />
                                <RibbonButtonLarge icon={Languages} label="Taal" />
                            </div>
                            <GroupLabel label="Controle" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={MessageSquare} label="Opmerking" />
                            </div>
                            <GroupLabel label="Opmerkingen" />
                        </div>
                    </>
                )}

                {/* ===== BEELD TAB ===== */}
                {state.activeTab === 'beeld' && (
                    <>
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={Eye} label="Lees-modus" />
                                <RibbonButtonLarge icon={FileText} label="Afdruk-weergave" />
                                <RibbonButtonLarge icon={PanelLeft} label="Overzicht" />
                            </div>
                            <GroupLabel label="Weergaven" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={ZoomIn} label="Inzoomen" onClick={() => onAction('zoomIn')} />
                                <RibbonButtonLarge icon={ZoomOut} label="Uitzoomen" onClick={() => onAction('zoomOut')} />
                                <RibbonButtonLarge icon={Maximize} label="100%" onClick={() => onAction('zoom100')} />
                            </div>
                            <GroupLabel label="In-/uitzoomen" />
                        </div>
                        <GroupSeparator />
                        <div className="flex flex-col items-center px-1">
                            <div className="flex items-center gap-0.5 flex-1 py-0.5">
                                <RibbonButtonLarge icon={Ruler} label="Liniaal" />
                                <RibbonButtonLarge icon={LayoutGrid} label="Rasterlijnen" />
                            </div>
                            <GroupLabel label="Weergeven" />
                        </div>
                    </>
                )}

                {/* ===== BESTAND TAB (backstage placeholder) ===== */}
                {state.activeTab === 'bestand' && (
                    <div className="flex items-center justify-center flex-1 py-4">
                        <div className="text-[#808080] text-sm">
                            <div className="flex flex-col gap-3 pl-4">
                                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#e5f0fb] cursor-default">
                                    <FileText size={18} className="text-[#404040]" />
                                    <span className="text-[#404040]">Nieuw</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#e5f0fb] cursor-default">
                                    <FileText size={18} className="text-[#404040]" />
                                    <span className="text-[#404040]">Openen</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#e5f0fb] cursor-default">
                                    <FileText size={18} className="text-[#404040]" />
                                    <span className="text-[#404040]">Opslaan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
