
import React from 'react';
import {
    Layout, Type, Image as ImageIcon, FileText,
    ChevronDown, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
    List, Heading, Scissors, Copy, ZoomIn, Search, Eye,
    BookOpen, Hash, Square, BringToFront, SendToBack, Trash2
} from 'lucide-react';
import { SimulatorState } from './types';

interface RibbonProps {
    state: SimulatorState;
    onAction: (action: string, payload?: any) => void;
    onTabChange: (tab: string) => void;
    hasSelection: boolean;
    selectedImageWrapMode?: 'square' | 'front' | 'behind';
}

export const Ribbon: React.FC<RibbonProps> = ({ state, onAction, onTabChange, hasSelection, selectedImageWrapMode }) => {

    const RibbonButton = ({
        icon: Icon, label, action, payload, disabled = false
    }: {
        icon: any, label: string, action: string, payload?: any, disabled?: boolean
    }) => (
        <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onAction(action, payload)}
            disabled={disabled}
            className={`
                flex flex-col items-center justify-center p-2 rounded h-20 w-16 hover:bg-slate-200 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            <Icon size={24} className="mb-1 text-slate-700" />
            <span className="text-[10px] text-center leading-tight text-slate-600">{label}</span>
        </button>
    );

    return (
        <div className="bg-white border-b border-slate-300 shrink-0 z-30 relative shadow-sm">
            {/* TABS */}
            <div className="flex px-2 pt-1">
                {['Start', 'Invoegen', 'Indeling', 'Verwijzingen', 'Beeld'].map(tab => {
                    const id = tab.toLowerCase();
                    const isActive = state.activeTab === id;
                    return (
                        <button
                            key={id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onTabChange(id)}
                            className={`
                                    px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative
                                    ${isActive ? 'text-[#2b579a] bg-slate-100' : 'text-slate-600 hover:bg-slate-50'}
                                `}
                        >
                            {tab}
                            {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2b579a] rounded-t-md"></div>}
                        </button>
                    );
                })}
            </div>

            {/* TOOLBAR CONTENT */}
            <div className="bg-slate-100 h-28 px-2 py-1 flex items-start gap-1 overflow-x-auto">

                {state.activeTab === 'start' && (
                    <>
                        <div className="flex items-center px-4 gap-2 border-r border-slate-300">
                            <div className="flex bg-white border border-slate-300 rounded overflow-hidden">
                                <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('bold')} className="p-2 hover:bg-slate-200"><Bold size={16} /></button>
                                <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('italic')} className="p-2 hover:bg-slate-200"><Italic size={16} /></button>
                                <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('underline')} className="p-2 hover:bg-slate-200"><Underline size={16} /></button>
                            </div>
                        </div>
                        <div className="flex items-center px-4 gap-2 border-r border-slate-300">
                            <RibbonButton icon={Heading} label="Titel" action="title" />
                            <RibbonButton icon={Heading} label="Kop 1" action="heading1" />
                            <RibbonButton icon={Type} label="Normaal" action="normal" />
                        </div>
                        <div className="flex items-center px-4 gap-1">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('alignLeft')} className="p-2 hover:bg-white rounded" title="Links uitlijnen"><AlignLeft size={20} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('alignCenter')} className="p-2 hover:bg-white rounded" title="Centreren"><AlignCenter size={20} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('alignRight')} className="p-2 hover:bg-white rounded" title="Rechts uitlijnen"><AlignRight size={20} /></button>
                            <div className="w-px h-8 bg-slate-300 mx-2"></div>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('bulletList')} className="p-2 hover:bg-white rounded" title="Opsommingsteken"><List size={20} /></button>
                        </div>
                    </>
                )}

                {state.activeTab === 'invoegen' && (
                    <>
                        <div className="flex items-center px-4 gap-2">
                            <RibbonButton icon={ImageIcon} label="Afbeelding" action="insertImage" />
                            <RibbonButton icon={Hash} label="Pagina nummer" action="pageNumber" />
                        </div>
                    </>
                )}

                {state.activeTab === 'indeling' && (
                    <>
                        <div className="flex items-center px-4 gap-2 border-r border-slate-300">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-500 mb-1">Marges</span>
                                <div className="flex gap-1">
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('margins', 'normal')} className={`text-xs px-2 py-1 rounded border ${state.margins === 'normal' ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>Normaal</button>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => onAction('margins', 'narrow')} className={`text-xs px-2 py-1 rounded border ${state.margins === 'narrow' ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}>Smal</button>
                                </div>
                            </div>
                        </div>

                        {/* Image Tools - Only active if selection */}
                        <div className={`flex items-center px-4 gap-2 ${!hasSelection ? 'opacity-50 grayscale' : ''}`}>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-500 mb-1">Tekstomloop</span>
                                <div className="flex gap-1">
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => onAction('wrapMode', 'square')}
                                        disabled={!hasSelection}
                                        className={`flex flex-col items-center justify-center w-16 h-16 rounded border transition-colors ${selectedImageWrapMode === 'square' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                        title="Vierkant"
                                    >
                                        <Square size={20} className="mb-1" />
                                        <span className="text-[10px]">Vierkant</span>
                                    </button>
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => onAction('wrapMode', 'front')}
                                        disabled={!hasSelection}
                                        className={`flex flex-col items-center justify-center w-16 h-16 rounded border transition-colors ${selectedImageWrapMode === 'front' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                        title="Voor tekst"
                                    >
                                        <BringToFront size={20} className="mb-1" />
                                        <span className="text-[10px]">Voor</span>
                                    </button>
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => onAction('wrapMode', 'behind')}
                                        disabled={!hasSelection}
                                        className={`flex flex-col items-center justify-center w-16 h-16 rounded border transition-colors ${selectedImageWrapMode === 'behind' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                        title="Achter tekst"
                                    >
                                        <SendToBack size={20} className="mb-1" />
                                        <span className="text-[10px]">Achter</span>
                                    </button>
                                </div>
                            </div>
                            {/* Delete Action */}
                            <div className={`flex items-center px-4 gap-2 border-l border-slate-300 ${!hasSelection ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-slate-500 mb-1">Acties</span>
                                    <button
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => onAction('deleteImage')}
                                        disabled={!hasSelection}
                                        className="flex flex-col items-center justify-center w-16 h-16 rounded border bg-white border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 transition-colors"
                                        title="Verwijder afbeelding"
                                    >
                                        <Trash2 size={20} className="mb-1" />
                                        <span className="text-[10px]">Verwijder</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {
                    state.activeTab === 'verwijzingen' && (
                        <>
                            <div className="flex items-center px-4 gap-2">
                                <RibbonButton icon={BookOpen} label="Inhoudsopgave" action="toc" />
                            </div>
                        </>
                    )
                }

                {
                    state.activeTab === 'beeld' && (
                        <>
                            <div className="flex items-center px-4 gap-2">
                                <RibbonButton icon={ZoomIn} label="Zoom In" action="zoomIn" />
                                <RibbonButton icon={Search} label="Zoom Uit" action="zoomOut" />
                            </div>
                        </>
                    )
                }

            </div >
        </div >
    );
};
