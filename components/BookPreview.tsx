
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookData } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Image as ImageIcon, Sparkles, Star, Compass, Map, Printer, Loader2, X, Edit3, Wand2, Download, CheckCircle, AlertCircle, Share2, Check } from 'lucide-react';
import { MissionConclusion } from './MissionConclusion';
import { publishGame } from '../services/gameGalleryService';
import { saveToLibrary } from '../services/libraryService';

interface BookPreviewProps {
    data: BookData;
    onStart?: (customPrompt?: string) => void;
    onSendPrompt?: (prompt: string) => void; // NEW: Send prompt directly to chat
    hasStarted?: boolean; // When true, skip intro and show book directly
    readOnly?: boolean; // If true, disable editing and publishing
    user?: {
        uid: string;
        displayName: string;
        schoolId?: string;
        studentClass?: string;
    };
}

// Internal component for the Setup Form
const StorySetupForm = ({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (data: any) => void }) => {
    const [heroName, setHeroName] = useState('');
    const [heroType, setHeroType] = useState('Beer');
    const [setting, setSetting] = useState('Bos');
    const [theme, setTheme] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ heroName, heroType, setting, theme });
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-amber-100 max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-amber-400 to-pink-500 p-6 text-white text-center shrink-0">
                <Sparkles size={32} className="mx-auto mb-2 text-yellow-200" />
                <h3 className="text-xl font-black uppercase tracking-tight">Verhaal Setup</h3>
                <p className="text-white/80 text-sm font-medium">Vertel ons kort over je idee!</p>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Naam van de Held</label>
                        <input
                            type="text"
                            required
                            value={heroName}
                            onChange={e => setHeroName(e.target.value)}
                            placeholder="Bijv. Tim, Bello, Robo..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-bold text-slate-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Wat is het?</label>
                            <input
                                type="text"
                                required
                                value={heroType}
                                onChange={e => setHeroType(e.target.value)}
                                placeholder="Bijv. Een robot..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-bold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waar?</label>
                            <input
                                type="text"
                                required
                                value={setting}
                                onChange={e => setSetting(e.target.value)}
                                placeholder="Bijv. Op Mars..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waar gaat het over?</label>
                        <textarea
                            required
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                            placeholder="Bijv. Hij zoekt zijn verloren vlieger..."
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-bold text-slate-700 resize-none"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Terug
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Start Verhaal! 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================================
// PROMPT POPUP - For targeted editing of story elements
// ============================================================================
interface PromptPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    title: string;
    placeholder: string;
    context?: string; // Current text/context for reference
    type: 'text' | 'image' | 'title' | 'new-page';
}

const PromptPopup: React.FC<PromptPopupProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    placeholder,
    context,
    type
}) => {
    const [prompt, setPrompt] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setPrompt('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt.trim());
            setPrompt('');
            onClose();
        }
    };

    if (!isOpen) return null;

    const typeConfig = {
        text: { icon: <Edit3 size={16} />, color: 'from-blue-500 to-indigo-500' },
        image: { icon: <ImageIcon size={16} />, color: 'from-pink-500 to-rose-500' },
        title: { icon: <Wand2 size={16} />, color: 'from-amber-500 to-orange-500' },
        'new-page': { icon: <Sparkles size={16} />, color: 'from-emerald-500 to-green-500' }
    };

    const config = typeConfig[type];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${config.color} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2 text-white">
                        {config.icon}
                        <span className="font-bold text-sm">{title}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {context && (
                        <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Huidige inhoud:</span>
                            <span className="line-clamp-2">{context}</span>
                        </div>
                    )}

                    <textarea
                        ref={inputRef}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none font-medium text-slate-700 resize-none placeholder:text-slate-400"
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={!prompt.trim()}
                            className={`flex-[2] py-2.5 bg-gradient-to-r ${config.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-sm flex items-center justify-center gap-2`}
                        >
                            <Sparkles size={14} />
                            Verstuur naar AI
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Internal component to render a single page face
const PageContent = ({
    pageIndex,
    data,
    isBack = false,
    onTitleClick,
    onImageClick,
    onTextClick,
    isInteractive = false,
    onFinish
}: {
    pageIndex: number,
    data: BookData,
    isBack?: boolean,
    onTitleClick?: () => void,
    onImageClick?: (pageNum: number) => void,
    onTextClick?: (pageNum: number, currentText: string) => void,
    isInteractive?: boolean,
    onFinish?: () => void
}) => {
    const isCover = pageIndex === 0;

    // CHANGE: Use direct mapping so Page 0 (Left) uses data.pages[0]
    const page = data.pages[pageIndex];

    // Shared interactive styles
    const interactiveWrapperClass = isInteractive
        ? "cursor-pointer transition-all duration-200 hover:border-dashed hover:border-2 hover:border-pink-400 hover:bg-pink-50/30 group/edit"
        : "";
    // Only show edit hint tooltips if interactive
    const editHintClass = isInteractive
        ? "absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/edit:opacity-100 transition-opacity shadow-lg"
        : "hidden";

    // --- RENDER COVER (FRONT ONLY) ---
    // We only treat the layout as a "Cover" if it's the FRONT side of Index 0.
    // The BACK side of Index 0 (Left Page when open) should be a normal content page.
    if (isCover && !isBack) {
        // FRONT COVER
        return (
            <div className="w-full h-full bg-[#EAB308] flex flex-col items-center relative overflow-hidden shadow-inner select-none rounded-r-md border-r-4 border-[#854D0E] border-b-4">
                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay pointer-events-none"></div>

                {/* 1. BACKGROUND LAYER - Clickable for cover image */}
                <div
                    className={`absolute inset-0 z-0 m-4 rounded overflow-hidden shadow-inner border-[6px] transition-all group/edit 
                    ${isInteractive
                            ? 'border-amber-400/50 cursor-pointer hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                            : 'border-white/20'}`}
                    onClick={() => isInteractive && onImageClick?.(0)}
                >
                    {data.coverImage === 'loading' ? (
                        <div className="w-full h-full bg-amber-200/50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                                <span className="text-amber-800 font-bold text-xs uppercase tracking-widest">Kaft ontwerpen...</span>
                            </div>
                        </div>
                    ) : data.coverImage?.startsWith('error:') ? (
                        <div className="w-full h-full bg-amber-50 flex flex-col items-center justify-center text-amber-600 border-2 border-dashed border-amber-200 gap-2 p-4 text-center">
                            <AlertCircle size={36} className="text-amber-500" />
                            <span className="font-bold text-sm">Oeps! De AI kon dit niet tekenen 🎨</span>
                            <span className="text-xs text-amber-600 max-w-[85%] leading-relaxed">
                                De AI heeft regels over wat getekend mag worden. Probeer het opnieuw met andere woorden!
                            </span>
                            <div className="bg-white/80 rounded-lg p-2 mt-1 text-[10px] text-amber-700 max-w-[90%]">
                                💡 <strong>Tip:</strong> Vermijd enge, gewelddadige of ongepaste beschrijvingen. Denk aan een vriendelijk kinderboek!
                            </div>
                        </div>
                    ) : data.coverImage ? (
                        <>
                            <img
                                src={data.coverImage}
                                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                                alt="Map Art"
                            />
                            {isInteractive && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-center opacity-0 group-hover/edit:opacity-100 transition-opacity">
                                    <div className="bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                        <Edit3 size={12} /> Kaft Afbeelding Wijzigen
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-yellow-900/10 ${isInteractive ? 'hover:bg-pink-50/20' : ''}`}>
                            <div className="flex flex-col items-center gap-2">
                                <BookOpen size={60} className={isInteractive ? 'text-amber-400' : ''} />
                                <span className="text-amber-900/40 text-xs font-bold uppercase tracking-widest">Kaft Illustratie</span>
                                {isInteractive && (
                                    <span className="text-pink-500 text-xs font-bold bg-white/80 px-3 py-1 rounded-full shadow-sm">
                                        📸 Klik om illustratie te maken
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. CONTENT LAYER */}
                <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-between py-4 px-4 pointer-events-none">
                    {/* Title Area - Clickable - Now at top with less padding */}
                    <div
                        className={`w-full text-center relative p-2 rounded-lg bg-white/90 shadow-lg border-2 border-white backdrop-blur-sm transform -rotate-1 transition-all duration-300 pointer-events-auto ${isInteractive ? 'cursor-pointer hover:border-pink-300 hover:scale-[1.02] group/edit' : ''}`}
                        onClick={(e) => {
                            if (isInteractive) {
                                e.stopPropagation();
                                onTitleClick?.();
                            }
                        }}
                    >
                        <h1 className="text-lg md:text-xl font-black text-slate-900 font-sans leading-tight tracking-tight break-words line-clamp-2">
                            {data.title || "Mijn Verhaal"}
                        </h1>
                        {isInteractive && (
                            <div className={editHintClass}>
                                <Edit3 size={12} />
                            </div>
                        )}
                    </div>

                    {/* Author Label */}
                    <div className="mb-4 px-3 py-1.5 bg-yellow-900/20 rounded-full border border-yellow-900/10 backdrop-blur-md">
                        <span className="font-bold text-[9px] text-yellow-900 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={10} className="text-yellow-600" />
                            Geschreven door Jou
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER INNER PAGE (Left or Right) ---
    // Note: We removed the "Inside Front Cover" blank logic. 
    // Now even Page 0 (Left side) renders as a content page.

    // Determine layout classes based on side (Left/Back vs Right/Front)
    const containerClasses = isBack
        ? "rounded-l-md border-l border-b border-stone-200"
        : "rounded-r-md border-r border-b border-stone-200";

    const pageNumberPosition = isBack ? "left-3" : "right-3";
    const shadowGradient = isBack
        ? "left-0 bg-gradient-to-br" // Shadow on fold
        : "right-0 bg-gradient-to-bl";

    return (
        <div className={`w-full h-full bg-white flex flex-col relative overflow-hidden select-none ${containerClasses}`}>
            {/* Fold Shadow */}
            <div className={`absolute top-0 w-8 h-8 ${shadowGradient} from-stone-200/50 to-transparent pointer-events-none ${isBack ? 'right-0' : 'right-0'}`}></div>

            {/* Header / Page Number */}
            <div className={`absolute top-2 ${pageNumberPosition} text-stone-300 font-black text-[8px] tracking-widest uppercase z-10 font-mono`}>
                PAGINA {pageIndex + 1}
            </div>

            {/* Content Container - Improved Layout */}
            <div className="flex-1 flex flex-col z-0 p-4 md:p-5 gap-3 overflow-hidden">
                {/* Image Area - Clickable */}
                {/* REMOVED: bg-stone-50 and p-1.5 to remove the gray box/frame effect */}
                <div
                    className={`w-full max-h-[40%] shadow-sm rounded border transition-all duration-300 shrink-0 ${isInteractive
                        ? 'cursor-pointer border-dashed border-2 border-stone-300 hover:border-pink-400 hover:bg-pink-50/30 group/edit'
                        : 'border-stone-100 transform rotate-[0.5deg] hover:rotate-0'
                        }`}
                    onClick={() => isInteractive && onImageClick?.(pageIndex + 1)}
                >
                    {/* REMOVED: bg-stone-100 for proper white look */}
                    <div className="w-full h-full aspect-[4/3] overflow-hidden relative rounded flex items-center justify-center">
                        {page?.image === 'loading' ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                <span className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">Illustreren...</span>
                            </div>
                        ) : page?.image?.startsWith('error:') ? (
                            <div className="w-full h-full bg-amber-50 flex flex-col items-center justify-center text-amber-600 gap-2 p-4 text-center">
                                <AlertCircle size={28} className="text-amber-500" />
                                <span className="text-xs font-bold">
                                    Oeps! De AI kon dit niet tekenen 🎨
                                </span>
                                <span className="text-[10px] text-amber-600 max-w-[90%] leading-relaxed">
                                    De AI heeft regels over wat getekend mag worden. Probeer vriendelijke woorden!
                                </span>
                                <div className="bg-white/80 rounded-lg p-2 text-[9px] text-amber-700 max-w-[95%]">
                                    💡 <strong>Tip:</strong> Vermijd enge, gewelddadige of ongepaste beschrijvingen.
                                </div>
                                {isInteractive && (
                                    <button className="text-[10px] bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-amber-600 transition-colors mt-1 font-bold">
                                        ✏️ Opnieuw proberen
                                    </button>
                                )}
                            </div>
                        ) : page?.image ? (
                            <>
                                <img src={page.image} className="w-full h-full object-cover" alt={`Pagina ${pageIndex + 1}`} />
                                {isInteractive && (
                                    <div className="absolute inset-0 bg-pink-500/0 hover:bg-pink-500/10 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover/edit:opacity-100 bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-pink-600 shadow-lg transition-opacity">
                                            ✏️ Afbeelding wijzigen
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-1 bg-stone-50/50">
                                <ImageIcon size={20} className={isInteractive ? 'text-pink-400' : 'opacity-50'} />
                                <span className={`text-[9px] font-medium ${isInteractive ? 'text-pink-400' : ''}`}>
                                    {isInteractive ? 'Klik om illustratie toe te voegen' : 'Wacht op illustratie...'}
                                </span>
                            </div>
                        )}
                        {isInteractive && page?.image && (
                            <div className={editHintClass}>
                                <Edit3 size={12} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Area - Clickable */}
                <div
                    className={`flex-1 relative overflow-y-auto custom-scrollbar rounded-lg p-2 ${isInteractive
                        ? 'cursor-pointer border-2 border-dashed border-stone-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all group/edit'
                        : ''
                        }`}
                    onClick={(e) => {
                        if (isInteractive) {
                            e.stopPropagation();
                            onTextClick?.(pageIndex + 1, page?.text || '');
                        }
                    }}
                >
                    {/* Lined paper effect */}
                    <div className="absolute inset-0 flex flex-col justify-start pt-1 pointer-events-none opacity-15">
                        {[...Array(12)].map((_, i) => <div key={i} className="w-full h-5 border-b border-stone-300"></div>)}
                    </div>
                    <p className="font-serif text-stone-700 text-base md:text-lg leading-relaxed relative z-10 first-letter:text-2xl first-letter:font-black first-letter:text-amber-500 first-letter:mr-0.5 first-letter:float-left">
                        {page?.text || "Het verhaal gaat hier verder..."}
                    </p>
                    {isInteractive && (
                        <div className={editHintClass}>
                            <Edit3 size={12} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const BookPreview: React.FC<BookPreviewProps> = ({ data, onStart, onSendPrompt, hasStarted: externalHasStarted = false, readOnly = false, user }) => {
    const [internalHasStarted, setInternalHasStarted] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const hasStarted = externalHasStarted || internalHasStarted;

    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
    const [displayPage, setDisplayPage] = useState(0);
    const totalPages = data.pages.length;

    // New state for start button delay
    const [startTimer, setStartTimer] = useState(0);
    const [showConclusion, setShowConclusion] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Publish modal state
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishTitle, setPublishTitle] = useState(data.title || '');
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    // Initialise publish title when data changes
    useEffect(() => {
        if (data.title && data.title !== 'Nieuw Verhaal') {
            setPublishTitle(data.title);
        }
    }, [data.title]);

    // Library save state
    const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
    const [librarySaveSuccess, setLibrarySaveSuccess] = useState(false);

    // Handle saving book to personal library
    const handleSaveToLibrary = async () => {
        if (!user) return;

        setIsSavingToLibrary(true);
        try {
            const bookName = data.title || `Mijn Boek ${new Date().toLocaleDateString('nl-NL')}`;
            await saveToLibrary(user.uid, {
                type: 'book',
                name: bookName,
                data: { bookData: data },
                missionId: 'verhalen-ontwerper',
                missionName: 'Verhalen Ontwerper'
            });
            setLibrarySaveSuccess(true);
            setTimeout(() => setLibrarySaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save to library:', error);
        } finally {
            setIsSavingToLibrary(false);
        }
    };

    const handlePublish = async () => {
        if (!user || !publishTitle.trim()) return;

        setIsPublishing(true);
        setPublishError(null);
        try {
            await publishGame(
                user.uid,
                user.displayName,
                publishTitle.trim(),
                { bookData: data },
                undefined,
                user.studentClass,
                'verhalen-ontwerper',
                user.schoolId
            );
            setPublishSuccess(true);
            setTimeout(() => {
                setShowPublishModal(false);
                setPublishSuccess(false);
            }, 2000);
        } catch (error: any) {
            console.error('Failed to publish book:', error);
            setPublishError(error?.message || 'Er ging iets mis. Probeer opnieuw.');
        } finally {
            setIsPublishing(false);
        }
    };

    // Track previous page for correct animation content source
    const prevPageRef = useRef<number>(currentPage);


    // Timer effect
    /*
    useEffect(() => {
        if (startTimer > 0 && !hasStarted) {
            const timer = setTimeout(() => setStartTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [startTimer, hasStarted]);
    */

    // =====================================================================
    // POPUP STATE FOR INTERACTIVE EDITING
    // =====================================================================
    const [popupState, setPopupState] = useState<{
        isOpen: boolean;
        type: 'text' | 'image' | 'title' | 'new-page';
        title: string;
        placeholder: string;
        context?: string;
        pageNum?: number;
    }>({
        isOpen: false,
        type: 'text',
        title: '',
        placeholder: '',
    });

    const handleTitleClick = () => {
        if (readOnly) return; // Disable editing in read-only mode
        setPopupState({
            isOpen: true,
            type: 'title',
            title: 'Titel Aanpassen',
            placeholder: 'Beschrijf welke titel je wilt...',
            context: data.title !== 'Nieuw Verhaal' ? data.title : undefined
        });
    };

    const handleImageClick = (pageNum: number) => {
        if (readOnly) return; // Disable editing in read-only mode
        const iscover = pageNum === 0;

        // Filter out error messages from context to prevent contamination of new prompts
        const existingCoverImage = data.coverImage;
        const existingPageImage = pageNum > 0 ? data.pages[pageNum - 1]?.image : undefined;

        // Don't include error messages or loading state as context
        const hasValidCoverImage = existingCoverImage &&
            existingCoverImage !== 'loading' &&
            !existingCoverImage.startsWith('error:');
        const hasValidPageImage = existingPageImage &&
            existingPageImage !== 'loading' &&
            !existingPageImage.startsWith('error:');

        setPopupState({
            isOpen: true,
            type: 'image',
            title: iscover ? 'Kaft Illustratie' : `Illustratie Pagina ${pageNum}`,
            placeholder: iscover
                ? 'Beschrijf wat je op de kaft wilt zien...'
                : 'Beschrijf wat je wilt zien op deze illustratie...',
            context: iscover
                ? (hasValidCoverImage ? 'Huidige kaft heeft al een afbeelding' : undefined)
                : (hasValidPageImage ? 'Deze pagina heeft al een illustratie' : undefined),
            pageNum
        });
    };

    const handleTextClick = (pageNum: number, currentText: string) => {
        if (readOnly) return; // Disable editing in read-only mode
        setPopupState({
            isOpen: true,
            type: 'text',
            title: `Tekst Pagina ${pageNum}`,
            placeholder: 'Beschrijf hoe je de tekst wilt aanpassen...',
            context: currentText && currentText !== 'Het verhaal gaat hier verder...' ? currentText : undefined,
            pageNum
        });
    };

    const handlePlaceholderClick = () => {
        if (readOnly) return;
        setPopupState({
            isOpen: true,
            type: 'new-page',
            title: 'Nieuwe Pagina',
            placeholder: 'Beschrijf wat er nu gebeurt in het verhaal... (Bijv. "Ze vonden een verborgen deur")',
            pageNum: totalPages + 1
        });
    };

    const handlePopupSubmit = (prompt: string) => {
        // Build a contextual prompt based on what the user clicked
        // IMPORTANT: Be VERY explicit about what the AI should and should NOT do
        let fullPrompt = '';

        if (popupState.type === 'title') {
            fullPrompt = `INSTRUCTIE: Pas ALLEEN de titel aan. Genereer GEEN nieuwe afbeeldingen, verander GEEN paginateksten.
Nieuwe titel aanvraag: ${prompt}
Antwoord alleen met de nieuwe [TITLE]...[/TITLE] tag.`;
        } else if (popupState.type === 'image') {
            if (popupState.pageNum === 0) {
                fullPrompt = `INSTRUCTIE: Genereer ALLEEN een nieuwe KAFT-illustratie. Verander NIETS aan de titel of teksten.
Beschrijving voor de nieuwe kaft: ${prompt}
Antwoord alleen met de nieuwe [IMG target="cover"]...[/IMG] tag.`;
            } else {
                fullPrompt = `INSTRUCTIE: Genereer ALLEEN een nieuwe illustratie voor pagina ${popupState.pageNum}. Verander NIETS aan de tekst van deze pagina.
Beschrijving voor de nieuwe illustratie: ${prompt}
Antwoord alleen met de nieuwe [IMG target="${popupState.pageNum}"]...[/IMG] tag.`;
            }
        } else if (popupState.type === 'text') {
            fullPrompt = `INSTRUCTIE: Pas ALLEEN de tekst van pagina ${popupState.pageNum} aan. Genereer GEEN nieuwe afbeeldingen.
CONTEXT: De huidige tekst op deze pagina is: "${popupState.context || '(leeg)'}"
OPDRACHT: ${prompt}
BELANGRIJK: Antwoord ALLEEN met de nieuwe [PAGE target="${popupState.pageNum}"]...[/PAGE] tag. Verander GEEN andere pagina's.`;
        } else if (popupState.type === 'new-page') {
            fullPrompt = `INSTRUCTIE: Maak nieuwe pagina ${popupState.pageNum} aan met ALLEEN tekst. Genereer GEEN illustratie automatisch.
Inhoud: ${prompt}
Antwoord ALLEEN met de nieuwe [PAGE target="${popupState.pageNum}"]...[/PAGE] tag. De leerling vraagt later zelf om een illustratie.`;
        }

        // Send to chat
        if (onSendPrompt) {
            onSendPrompt(fullPrompt);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }

        setPopupState(prev => ({ ...prev, isOpen: false }));
    };

    // Auto-turn effect removed to allow manual control only

    // ... handlePageTurn and handlePrint remain same ...



    const handlePrint = () => {
        window.print();
    };

    const handleDownloadBooklet = async () => {
        // Dynamic import to keep bundle smaller
        const { jsPDF } = await import('jspdf');

        // A5 landscape for booklet pages (will fold to A6)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a5'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        // Helper to load image as base64
        const loadImage = (url: string): Promise<string | null> => {
            return new Promise((resolve) => {
                if (!url || url === 'loading') {
                    resolve(null);
                    return;
                }
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                    try {
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    } catch {
                        resolve(null);
                    }
                };
                img.onerror = () => resolve(null);
                img.src = url;
            });
        };

        // --- COVER PAGE ---
        pdf.setFillColor(255, 251, 235); // Warm cream
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Cover image
        if (data.coverImage && data.coverImage !== 'loading') {
            const imgData = await loadImage(data.coverImage);
            if (imgData) {
                const imgSize = Math.min(contentWidth * 0.7, contentHeight * 0.5);
                pdf.addImage(imgData, 'JPEG', (pageWidth - imgSize) / 2, margin + 10, imgSize, imgSize * 0.75);
            }
        }

        // Title
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(51, 51, 51);
        const title = data.title || 'Mijn Verhaal';
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - titleWidth) / 2, pageHeight - 30);

        // Author
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(128, 128, 128);
        pdf.text('Geschreven door jou', pageWidth / 2, pageHeight - 20, { align: 'center' });

        // --- CONTENT PAGES ---
        for (let i = 0; i < data.pages.length; i++) {
            const page = data.pages[i];
            pdf.addPage();

            // Background
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            // Page number
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(180, 180, 180);
            pdf.text(`- ${i + 1} -`, pageWidth / 2, pageHeight - 8, { align: 'center' });

            let yPos = margin;

            // Image
            if (page.image && page.image !== 'loading') {
                const imgData = await loadImage(page.image);
                if (imgData) {
                    const imgWidth = contentWidth * 0.8;
                    const imgHeight = contentHeight * 0.45;
                    pdf.addImage(imgData, 'JPEG', (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 8;
                }
            }

            // Text
            if (page.text) {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(60, 60, 60);
                const lines = pdf.splitTextToSize(page.text, contentWidth - 10);
                pdf.text(lines, margin + 5, yPos + 8);
            }
        }

        // Save
        const fileName = (data.title || 'Mijn-Verhaal').replace(/[^a-zA-Z0-9]/g, '-') + '.pdf';
        pdf.save(fileName);
    };

    const handleFormSubmit = (formData: any) => {
        const prompt = `Start mijn prentenboek!
Basisgegevens voor het verhaal:
- Hoofdpersoon: ${formData.heroName} (een ${formData.heroType})
- Locatie: ${formData.setting}
- Het verhaal gaat over: ${formData.theme}

Maak de titel en de tekst van de eerste pagina, plus een illustratie voor de kaft. Genereer nog GEEN illustratie voor de eerste pagina.`;

        setInternalHasStarted(true);
        setShowForm(false);
        if (onStart) {
            onStart(prompt);
        }
    };

    // INTRO SCREEN: Show when no story content exists yet AND has not started
    const isEmptyBook = data.title === "Nieuw Verhaal" && data.pages.length === 0 && !data.coverImage;

    if (isEmptyBook && !hasStarted) {
        return (
            <div className="w-full h-full bg-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#fcd34d20_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                <div className="z-10 w-full max-w-md">
                    {showForm ? (
                        <StorySetupForm
                            onCancel={() => setShowForm(false)}
                            onSubmit={handleFormSubmit}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 border border-stone-200 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg transform -rotate-3 hover:rotate-3 transition-transform">
                                <BookOpen size={40} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Verhalen Ontwerper</h1>
                            <p className="text-slate-500 font-medium mb-8">
                                Word een echte auteur! Samen met AI ga je je eigen prentenboek schrijven en illustreren.
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                            >
                                <Sparkles size={18} className="text-yellow-400 group-hover:animate-spin" />
                                Start Mijn Boek
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // =====================================================================
    // PRINT VIEW PORTAL
    // =====================================================================
    // =====================================================================
    // PRINT VIEW PORTAL - REFACTORED FOR BOOKLET/LANDSCAPE
    // =====================================================================
    const PrintView = () => {
        // Group pages into spreads (pairs of 2)
        const contentPages = data.pages;
        const spreads = [];

        for (let i = 0; i < contentPages.length; i += 2) {
            spreads.push({
                left: contentPages[i],
                right: contentPages[i + 1] || null, // Might be null if odd number of pages
                leftIndex: i,
                rightIndex: i + 1
            });
        }

        return (
            <div
                className="print-section bg-white text-black w-full"
                style={{ display: 'none' }} // Hidden on screen, CSS @media print overrides this
            >
                {/* Print styles injected safely as a static constant */}
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        
                        /* Hide everything by default - more robust selector */
                        body > *:not(.print-section) {
                            display: none !important;
                        }
                        
                        /* Ensure the print section is visible and positioned correctly */
                        .print-section {
                            display: block !important;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: auto;
                            z-index: 9999;
                            background-color: white;
                        }

                        /* Ensure specific page breaks */
                        .print-page {
                            break-after: page;
                            page-break-after: always;
                            width: 100vw;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 2cm;
                            box-sizing: border-box;
                        }
                         /* Cover specific styling */
                        .cover-page {
                            background-color: #fef3c7; /* Amber-50 */
                        }
                    }
                `}</style>

                {/* --- 1. FRONT COVER (Standalone Page) --- */}
                <div className="print-page cover-page flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Decorative border */}
                    <div className="absolute inset-4 border-4 border-amber-800/20 rounded-3xl"></div>

                    <div className="z-10 max-w-4xl w-full flex flex-col items-center gap-8">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 text-amber-600 font-bold uppercase tracking-[0.2em] text-sm mb-2">
                                <Sparkles size={16} />
                                <span>Een verhaal van de Toekomst</span>
                                <Sparkles size={16} />
                            </div>
                            <h1 className="text-6xl font-black text-slate-900 leading-tight mb-2">
                                {data.title || "Mijn Verhaal"}
                            </h1>
                            <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full"></div>
                        </div>

                        {data.coverImage && data.coverImage !== 'loading' && !data.coverImage.startsWith('error') ? (
                            <div className="w-[60%] aspect-[4/3] rounded-2xl overflow-hidden border-8 border-white shadow-xl rotate-1">
                                <img src={data.coverImage} className="w-full h-full object-cover" alt="Kaft" />
                            </div>
                        ) : (
                            <div className="w-[60%] aspect-[4/3] rounded-2xl border-4 border-dashed border-amber-300 bg-white/50 flex items-center justify-center">
                                <BookOpen size={64} className="text-amber-300" />
                            </div>
                        )}

                        <div className="mt-4">
                            <p className="text-2xl font-serif italic text-amber-900/60">Geschreven &amp; Geïllustreerd door</p>
                            <p className="text-3xl font-black text-amber-800 mt-2 uppercase tracking-wide">
                                {user?.displayName || "Een Jonge Schrijver"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- 2. SPREADS (Left + Right Pages) --- */}
                {spreads.map((spread, index) => (
                    <div key={index} className="print-page bg-white flex flex-row gap-0 items-stretch p-0 overflow-hidden">
                        {/* LEFT PAGE */}
                        <div className="flex-1 h-full border-r border-slate-200 p-12 flex flex-col relative">
                            {/* Page Number */}
                            <div className="absolute top-8 left-8 text-slate-300 font-mono text-xs">
                                PAGINA {spread.leftIndex + 1}
                            </div>

                            {/* Fold Shadow */}
                            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-100/50 to-transparent pointer-events-none"></div>

                            <div className="flex-1 flex flex-col gap-8 items-center justify-center">
                                {spread.left.image && spread.left.image !== 'loading' && !spread.left.image.startsWith('error') ? (
                                    <div className="w-full aspect-video rounded-xl overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50">
                                        <img src={spread.left.image} className="w-full h-full object-cover" alt={`Pagina ${spread.leftIndex + 1}`} />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 bg-slate-50/50">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="w-full">
                                    <div className="w-full h-px bg-slate-100 mb-6"></div>
                                    <p className="font-serif text-xl leading-loose text-slate-800 text-justify">
                                        {spread.left.text}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PAGE */}
                        <div className="flex-1 h-full p-12 flex flex-col relative">
                            {/* Page Number */}
                            <div className="absolute top-8 right-8 text-slate-300 font-mono text-xs">
                                PAGINA {spread.leftIndex + 2}
                            </div>

                            {/* Fold Shadow */}
                            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-100/50 to-transparent pointer-events-none"></div>

                            {spread.right ? (
                                <div className="flex-1 flex flex-col gap-8 items-center justify-center">
                                    {spread.right.image && spread.right.image !== 'loading' && !spread.right.image.startsWith('error') ? (
                                        <div className="w-full aspect-video rounded-xl overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50">
                                            <img src={spread.right.image} className="w-full h-full object-cover" alt={`Pagina ${spread.rightIndex + 1}`} />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 bg-slate-50/50">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <div className="w-full h-px bg-slate-100 mb-6"></div>
                                        <p className="font-serif text-xl leading-loose text-slate-800 text-justify">
                                            {spread.right.text}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Empty page if odd count */
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-30">
                                    <Sparkles size={48} className="mb-4" />
                                    <span className="font-bold uppercase tracking-widest text-sm">Einde van het verhaal</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handlePageTurn = (direction: 'next' | 'prev') => {
        if (isFlipping) return;

        const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
        if (newPage < 0 || newPage > totalPages) return;

        // Store current page as 'previous' before updating
        prevPageRef.current = currentPage;

        setFlipDirection(direction);
        setIsFlipping(true);
        setCurrentPage(newPage);

        setTimeout(() => {
            setIsFlipping(false);
            setFlipDirection(null);
        }, 800); // Matches CSS animation duration
    };

    return (
        <>
            {createPortal(<PrintView />, document.body)}
            <div className="w-full h-full flex flex-col bg-stone-100 relative overflow-hidden">
                {/* Book Container - Centered and Scaled to Fit - Added padding to prevent edge touching */}
                <div className="flex-1 flex items-center justify-center p-8 z-10 perspective-2000 overflow-hidden">
                    {/* ... Book Structure Wrappers ... */}
                    <div className={`relative transition-all duration-500 will-change-transform preserve-3d
                        ${isFlipping ? 'scale-[0.98]' : 'scale-100'}
                        /* Critical Fix: Sizing Logic 
                           - Cover (2/3 aspect): Constrain by HEIGHT first (max-h), allow width to auto-scale.
                           - Spread (3/2 aspect): Constrain by WIDTH first (max-w), check max-height.
                        */
                        ${currentPage === 0
                            ? 'h-[90%] max-h-[600px] aspect-[2/3] w-auto' // Cover: Height-driven sizing
                            : 'w-full max-w-4xl aspect-[3/2] max-h-[90%]' // Spread: Width-driven but capped height
                        }
                        flex shadow-2xl rounded-lg bg-stone-800
                    `}>

                        {/* --- LEFT PAGE (Page N-1) - HIDDEN on Cover --- */}
                        {currentPage > 0 && (
                            <div className="flex-1 h-full relative z-0 rounded-l-lg overflow-hidden bg-white origin-right">
                                <PageContent
                                    pageIndex={currentPage - 1}
                                    data={data}
                                    isBack={true}
                                    onImageClick={handleImageClick}
                                    onTextClick={handleTextClick}
                                    isInteractive={!readOnly}
                                />
                            </div>
                        )}

                        {/* --- RIGHT PAGE (Current Page) --- */}
                        <div className={`flex-1 h-full relative z-10 overflow-hidden bg-white origin-left ${currentPage === 0 ? 'rounded-lg' : 'rounded-r-lg'}`}>
                            {currentPage < totalPages ? (
                                <PageContent
                                    pageIndex={currentPage}
                                    data={data}
                                    isBack={false}
                                    onImageClick={handleImageClick}
                                    onTextClick={handleTextClick}
                                    onTitleClick={handleTitleClick}
                                    isInteractive={!readOnly}
                                />
                            ) : totalPages > 0 ? (
                                /* Placeholder for next page - MATCHING LEFT PAGE LAYOUT */
                                <div className="w-full h-full bg-white flex flex-col relative overflow-hidden rounded-r-md border-r border-b border-stone-200">
                                    {/* Fold Shadow */}
                                    <div className="absolute top-0 w-8 h-8 left-0 bg-gradient-to-br from-stone-200/50 to-transparent pointer-events-none"></div>

                                    <div className="absolute top-2 right-3 text-stone-300 font-black text-[8px] tracking-widest uppercase z-10 font-mono">
                                        PAGINA {totalPages + 1}
                                    </div>
                                    <div className="flex-1 flex flex-col z-0 p-4 md:p-5 gap-3 overflow-hidden">
                                        {/* Placeholder Image Area - Matching left page styling */}
                                        <div
                                            onClick={handlePlaceholderClick}
                                            className="w-full max-h-[40%] shadow-sm rounded border transition-all duration-300 shrink-0 cursor-pointer border-dashed border-2 border-stone-300 hover:border-pink-400 hover:bg-pink-50/30 group/edit"
                                        >
                                            <div className="w-full h-full aspect-[4/3] overflow-hidden relative rounded flex items-center justify-center bg-stone-50/50">
                                                <ImageIcon size={20} className="text-pink-400" />
                                                <span className="text-[9px] font-medium text-pink-400 ml-1">
                                                    Klik om illustratie toe te voegen
                                                </span>
                                            </div>
                                        </div>

                                        {/* Placeholder Text Area - Matching left page styling */}
                                        <div
                                            onClick={handlePlaceholderClick}
                                            className="flex-1 relative overflow-y-auto custom-scrollbar rounded-lg p-2 cursor-pointer border-2 border-dashed border-stone-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all group/edit"
                                        >
                                            {/* Lined paper effect */}
                                            <div className="absolute inset-0 flex flex-col justify-start pt-1 pointer-events-none opacity-15">
                                                {[...Array(12)].map((_, i) => <div key={i} className="w-full h-5 border-b border-stone-300"></div>)}
                                            </div>
                                            <p className="font-serif text-stone-400 text-base md:text-lg leading-relaxed relative z-10 italic">
                                                "Schrijf hier het volgende deel..."
                                            </p>
                                        </div>
                                    </div>


                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-4 bg-stone-50">
                                    {/* Empty book state - show loading/waiting indicator */}
                                    <Loader2 size={32} className="animate-spin text-amber-400" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-center">Verhaal aan het opbouwen...</span>
                                </div>
                            )}
                        </div>

                        {/* --- FLIPPING OVERLAY --- */}
                        {isFlipping && flipDirection && (
                            <div className={`absolute inset-y-0 w-1/2 z-50 backface-hidden shadow-xl
                                ${flipDirection === 'next'
                                    ? 'left-1/2 origin-left animate-page-flip' // Flipping from Right to Left
                                    : 'left-0 origin-right animate-page-flip-reverse' // Flipping from Left to Right
                                }`}
                            >
                                <div className="w-full h-full bg-white backface-hidden">
                                    {/* Front of flipping page (The page LEAVING) */}
                                    {flipDirection === 'next' ? (
                                        // Next: Showing OLD Right Page
                                        (prevPageRef.current === 0) ? (
                                            // Handle Cover specifically
                                            <div className="w-full h-full bg-[#EAB308] flex flex-col items-center relative overflow-hidden shadow-inner select-none rounded-r-md border-r-4 border-[#854D0E] border-b-4">
                                                <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                                                <div className="mt-8 md:mt-12 w-3/4 aspect-[3/4] bg-amber-100 shadow-lg rotate-1 transform transition-transform hover:rotate-0 duration-500 flex items-center justify-center overflow-hidden border-4 border-white relative">
                                                    {data.coverImage === 'loading' ? (
                                                        <Loader2 className="animate-spin text-amber-600" />
                                                    ) : data.coverImage ? (
                                                        <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-amber-800/30">
                                                            <BookOpen size={48} className="mb-2" />
                                                            <span className="font-black text-xs uppercase tracking-widest">Kaft Illustratie</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`w-full text-center relative p-2 rounded-xl bg-white/90 shadow-xl border-4 border-white backdrop-blur-sm transform -rotate-1 mt-4 max-w-[90%]`}>
                                                    <h1 className="text-lg md:text-xl font-black text-slate-900 font-sans leading-tight tracking-tight break-words line-clamp-2">
                                                        {data.title || "Mijn Verhaal"}
                                                    </h1>
                                                </div>
                                            </div>
                                        ) : (
                                            <PageContent
                                                pageIndex={prevPageRef.current} // Old Right Page
                                                data={data}
                                            />
                                        )
                                    ) : (
                                        // Prev: Showing OLD Left Page
                                        <PageContent
                                            pageIndex={prevPageRef.current - 1} // Old Left Page
                                            data={data}
                                            isBack={true}
                                        />
                                    )}
                                </div>
                                <div className="w-full h-full bg-stone-50 shadow-xl absolute inset-0 rotate-y-180 backface-hidden">
                                    {/* Back of flipping page (The page ARRIVING on the other side) */}
                                    {flipDirection === 'next' ? (
                                        // Next: Becomes NEW Left Page
                                        <PageContent
                                            pageIndex={currentPage - 1} // New Left Page
                                            data={data}
                                            isBack={true}
                                        />
                                    ) : (
                                        // Prev: Becomes NEW Right Page
                                        <PageContent
                                            pageIndex={currentPage} // New Right Page
                                            data={data}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls - Compact & Less Intrusive */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/50 scale-90 origin-bottom hover:scale-100 transition-transform duration-300">
                    <button
                        onClick={() => handlePageTurn('prev')}
                        disabled={currentPage === 0 || isFlipping}
                        className={`p-2 rounded-full transition-all ${currentPage === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 active:scale-95'
                            }`}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex flex-col items-center min-w-[80px]">
                        <span className="font-bold text-slate-600 font-mono text-[10px] tracking-wide">
                            {currentPage === 0 ? 'KAFT' : `PAG ${currentPage} / ${totalPages}`}
                        </span>
                        <div className="flex gap-1 mt-0.5">
                            {[...Array(totalPages + 1)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full transition-all ${i === currentPage ? 'bg-amber-500 scale-125' : 'bg-slate-300'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => handlePageTurn('next')}
                        disabled={currentPage >= totalPages || isFlipping}
                        className={`p-2 rounded-full transition-all ${currentPage >= totalPages
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:scale-110 active:scale-95'
                            }`}
                    >
                        <ChevronRight size={18} />
                    </button>

                    <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

                    <button
                        onClick={() => window.print()}
                        className="p-2 rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all hover:scale-105 active:scale-95"
                        title="Print Boekje"
                    >
                        <Printer size={16} />
                    </button>

                    <button
                        onClick={handleDownloadBooklet}
                        className="p-2 rounded-full text-slate-400 hover:bg-green-50 hover:text-green-500 transition-all hover:scale-105 active:scale-95"
                        title="Download PDF"
                    >
                        <Download size={16} />
                    </button>

                    {/* Save to Library Button */}
                    {user && (
                        <button
                            onClick={handleSaveToLibrary}
                            disabled={isSavingToLibrary}
                            className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${librarySaveSuccess
                                ? 'text-green-500 bg-green-50'
                                : 'text-slate-400 hover:bg-purple-50 hover:text-purple-500'
                                }`}
                            title={librarySaveSuccess ? 'Opgeslagen!' : 'Opslaan in Bibliotheek'}
                        >
                            {isSavingToLibrary ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : librarySaveSuccess ? (
                                <Check size={16} />
                            ) : (
                                <BookOpen size={16} />
                            )}
                        </button>
                    )}

                    {/* Publish Button - DISABLED: Students should not share books */}
                </div>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        {publishSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Gepubliceerd! 🎉</h3>
                                <p className="text-slate-500 text-sm">Je boek staat nu in de galerij!</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Share2 className="text-emerald-500" size={20} />
                                        Deel je Boek
                                    </h3>
                                    <button
                                        onClick={() => setShowPublishModal(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Titel van je boek
                                        </label>
                                        <input
                                            type="text"
                                            value={publishTitle}
                                            onChange={(e) => setPublishTitle(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                            maxLength={50}
                                        />
                                    </div>

                                    {publishError && (
                                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            {publishError}
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePublish}
                                        disabled={!publishTitle.trim() || isPublishing}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black text-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Publiceren...
                                            </>
                                        ) : (
                                            <>
                                                <Share2 size={20} />
                                                Publiceer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Feedback Toast */}
            {showToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <Sparkles size={16} className="text-pink-400" />
                    <span className="font-bold text-sm">Opdracht verstuurd aan AI!</span>
                </div>
            )}

            {/* Prompt Popup for Interactive Editing */}
            <PromptPopup
                isOpen={popupState.isOpen}
                onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
                onSubmit={handlePopupSubmit}
                title={popupState.title}
                placeholder={popupState.placeholder}
                context={popupState.context}
                type={popupState.type}
            />

        </>
    );
};

