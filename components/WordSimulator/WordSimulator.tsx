
import React, { useState, useCallback, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Ribbon } from './Ribbon';
import { DocumentCanvas } from './DocumentCanvas';
import { SimulatorState, DragItem, LevelConfig } from './types';
import { MissionConclusion } from '../MissionConclusion';
import { Check, Eye, Search, Undo, X } from 'lucide-react';
import type { VsoProfile } from '../../types';

export interface WordSimulatorProps {
    onLevelComplete?: (level: number) => void;
    onExit?: () => void;
    initialLevelIndex?: number;
    onProgressUpdate?: (levelIndex: number) => void;
    vsoProfile?: VsoProfile;
}

export const WordSimulator: React.FC<WordSimulatorProps> = ({
    onLevelComplete,
    onExit,
    initialLevelIndex = 0,
    onProgressUpdate
}) => {
    // Game State
    const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevelIndex);
    const [showConclusion, setShowConclusion] = useState(false);
    const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
    const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(3);

    // Editor State
    const [simState, setSimState] = useState<SimulatorState>({
        zoom: 100,
        margins: 'normal',
        orientation: 'portrait',
        activeTab: 'start',
        showGrid: false,
        paperSize: 'A4'
    });

    // Content State
    const [images, setImages] = useState<DragItem[]>([]);
    const [editorContent, setEditorContent] = useState<string>("");
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [hasPageNumbers, setHasPageNumbers] = useState(false);
    const [pageNumberPosition, setPageNumberPosition] = useState<{ vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' } | null>(null);
    const [showPageNumberDialog, setShowPageNumberDialog] = useState(false);

    const currentLevel = levels[currentLevelIndex];

    // Load Level
    useEffect(() => {
        setEditorContent(currentLevel.initialContent);
        setImages(currentLevel.initialImages);
        setSelectedImageId(null);
        setHasPageNumbers(false);
        setPageNumberPosition(null);
        setShowPageNumberDialog(false);
        setSimState(s => ({ ...s, margins: 'normal', zoom: 100, activeTab: 'start' }));
        setShowSuccessFeedback(false);
        setAutoRedirectCountdown(3);
    }, [currentLevel]);

    // Auto-switch to Layout tab when image is selected
    useEffect(() => {
        if (selectedImageId) {
            setSimState(s => ({ ...s, activeTab: 'indeling' }));
        }
    }, [selectedImageId]);

    // Auto-check success on any state change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            // Use current DOM content if possible, otherwise state
            const content = document.getElementById('sim-editor')?.innerHTML || editorContent;
            checkLevelSuccess(content, images, simState, hasPageNumbers, pageNumberPosition);
        }, 500);
        return () => clearTimeout(timer);
    }, [images, editorContent, simState, hasPageNumbers, pageNumberPosition]);

    // Auto-redirect countdown when success is shown
    useEffect(() => {
        if (showSuccessFeedback && autoRedirectCountdown > 0) {
            const timer = setTimeout(() => {
                setAutoRedirectCountdown(c => c - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (showSuccessFeedback && autoRedirectCountdown === 0) {
            handleNextLevel();
        }
    }, [showSuccessFeedback, autoRedirectCountdown]);

    // --- ACTIONS ---

    const handleSimulatorAction = (action: string, payload?: any) => {
        // Focus the editor before any text action to ensure execCommand works
        const editor = document.getElementById('sim-editor');

        // Text Actions
        if (action === 'bold') document.execCommand('bold');
        if (action === 'italic') document.execCommand('italic');
        if (action === 'underline') document.execCommand('underline');

        // Styles - Need special handling for heading1
        if (action === 'heading1') {
            if (editor) {
                // Ensure focus for mobile browsers
                editor.focus();

                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);

                    // Check if selection is inside our editor
                    if (editor.contains(range.commonAncestorContainer)) {

                        // Helper function to check if a node intersects with selection
                        // Works better on iOS than containsNode
                        const nodeIntersectsSelection = (node: Node): boolean => {
                            try {
                                const nodeRange = document.createRange();
                                nodeRange.selectNodeContents(node);

                                // Check if ranges overlap
                                const startsBeforeEnd = range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0;
                                const endsAfterStart = range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0;

                                return startsBeforeEnd && endsAfterStart;
                            } catch (e) {
                                return false;
                            }
                        };

                        // 1. Try handling multiple blocks (selection spans multiple elements)
                        let modified = false;
                        const blocks = Array.from(editor.children);

                        // Check if any top-level block is part of the selection
                        blocks.forEach(block => {
                            if (block instanceof HTMLElement && nodeIntersectsSelection(block)) {
                                const tagName = block.tagName.toLowerCase();
                                // Convert valid blocks to H1
                                if (['p', 'div', 'h2', 'h3'].includes(tagName)) {
                                    const h1 = document.createElement('h1');
                                    h1.innerHTML = DOMPurify.sanitize(block.innerHTML);
                                    h1.style.cssText = 'color: #2b579a; font-size: 24px; font-weight: bold; margin-bottom: 0.5em;';
                                    editor.replaceChild(h1, block);
                                    modified = true;
                                }
                            }
                        });

                        if (modified) {
                            const newContent = editor.innerHTML;
                            setEditorContent(newContent);
                            // Direct success check after modification
                            setTimeout(() => {
                                checkLevelSuccess(newContent, images, simState, hasPageNumbers, pageNumberPosition);
                            }, 100);
                            return;
                        }

                        // 2. Fallback: Cursor is just inside one block (collapsed selection or inside single text node)
                        // Find the block element (P, DIV, or text node's parent)
                        let node: Node | null = range.startContainer;

                        // If we're in a text node, get the parent element
                        if (node.nodeType === Node.TEXT_NODE) {
                            node = node.parentNode;
                        }

                        // Walk up to find the nearest block element (p, div, h1, etc.)
                        while (node && node !== editor) {
                            const el = node as HTMLElement;
                            const tagName = el.tagName?.toLowerCase();

                            if (tagName === 'p' || tagName === 'div' || tagName === 'h2' || tagName === 'h3') {
                                // Replace this element with an H1
                                const h1 = document.createElement('h1');
                                h1.innerHTML = DOMPurify.sanitize(el.innerHTML);
                                h1.style.cssText = 'color: #2b579a; font-size: 24px; font-weight: bold; margin-bottom: 0.5em;';
                                el.parentNode?.replaceChild(h1, el);

                                // Restore selection inside the new H1
                                const newRange = document.createRange();
                                newRange.selectNodeContents(h1);
                                selection.removeAllRanges();
                                selection.addRange(newRange);

                                // Update content state
                                const newContent = editor.innerHTML;
                                setEditorContent(newContent);
                                // Direct success check
                                setTimeout(() => {
                                    checkLevelSuccess(newContent, images, simState, hasPageNumbers, pageNumberPosition);
                                }, 100);
                                return;
                            } else if (tagName === 'h1') {
                                // Already H1, do nothing
                                return;
                            }

                            node = node.parentNode;
                        }

                        // Final Fallback: try execCommand if structure is weird
                        document.execCommand('formatBlock', false, 'H1');
                        setEditorContent(editor.innerHTML);
                    } else {
                        alert("Klik eerst ergens in de tekst die je wilt veranderen naar een Kop.");
                    }
                } else {
                    alert("Selecteer eerst de tekst die je wilt veranderen naar een Kop, of klik ergens in de tekst.");
                }
            }
        }

        if (action === 'title') {
            if (editor) {
                editor.focus();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);

                    if (editor.contains(range.commonAncestorContainer)) {
                        const nodeIntersectsSelection = (node: Node): boolean => {
                            try {
                                const nodeRange = document.createRange();
                                nodeRange.selectNodeContents(node);
                                const startsBeforeEnd = range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0;
                                const endsAfterStart = range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0;
                                return startsBeforeEnd && endsAfterStart;
                            } catch (e) {
                                return false;
                            }
                        };

                        let modified = false;
                        const blocks = Array.from(editor.children);

                        blocks.forEach(block => {
                            if (block instanceof HTMLElement && nodeIntersectsSelection(block)) {
                                const p = document.createElement('p');
                                p.innerHTML = DOMPurify.sanitize(block.innerHTML);
                                // Title style: Bigger, centered (optional but common for titles), distinctive color
                                p.style.cssText = 'font-size: 36px; font-weight: bold; color: #2c3e50; margin-bottom: 0.5em; line-height: 1.2;';
                                // Since we can't easily make a custom tag, we use P with styles, or H1 with distinct styles. 
                                // But heading1 uses H1. Let's use P with massive styling to differentiate from "Kop 1" (H1) as requested.
                                // Or use DIV. P is safer for text.

                                editor.replaceChild(p, block);
                                modified = true;
                            }
                        });

                        if (modified) {
                            setEditorContent(editor.innerHTML);
                            return;
                        }

                        let node: Node | null = range.startContainer;
                        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

                        while (node && node !== editor) {
                            const el = node as HTMLElement;
                            // Convert anything to Title
                            const p = document.createElement('p');
                            p.innerHTML = DOMPurify.sanitize(el.innerHTML);
                            p.style.cssText = 'font-size: 36px; font-weight: bold; color: #2c3e50; margin-bottom: 0.5em; line-height: 1.2;';
                            el.parentNode?.replaceChild(p, el);

                            const newRange = document.createRange();
                            newRange.selectNodeContents(p);
                            selection.removeAllRanges();
                            selection.addRange(newRange);

                            setEditorContent(editor.innerHTML);
                            return;

                            node = node.parentNode;
                        }
                    } else {
                        alert("Klik eerst ergens in de tekst die je een Titel wilt maken.");
                    }
                }
            }
        }
        if (action === 'normal') {
            if (editor) {
                editor.focus();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);

                    if (editor.contains(range.commonAncestorContainer)) {
                        // Helper function to check if a node intersects with selection
                        const nodeIntersectsSelection = (node: Node): boolean => {
                            try {
                                const nodeRange = document.createRange();
                                nodeRange.selectNodeContents(node);
                                const startsBeforeEnd = range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0;
                                const endsAfterStart = range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0;
                                return startsBeforeEnd && endsAfterStart;
                            } catch (e) {
                                return false;
                            }
                        };

                        // Try handling multiple blocks
                        let modified = false;
                        const blocks = Array.from(editor.children);

                        blocks.forEach(block => {
                            if (block instanceof HTMLElement && nodeIntersectsSelection(block)) {
                                const tagName = block.tagName.toLowerCase();
                                // Convert H1, H2, H3 to P
                                if (['h1', 'h2', 'h3'].includes(tagName)) {
                                    const p = document.createElement('p');
                                    p.innerHTML = DOMPurify.sanitize(block.innerHTML);
                                    editor.replaceChild(p, block);
                                    modified = true;
                                }
                            }
                        });

                        if (modified) {
                            const newContent = editor.innerHTML;
                            setEditorContent(newContent);
                            return;
                        }

                        // Fallback: Cursor is inside one block
                        let node: Node | null = range.startContainer;
                        if (node.nodeType === Node.TEXT_NODE) {
                            node = node.parentNode;
                        }

                        while (node && node !== editor) {
                            const el = node as HTMLElement;
                            const tagName = el.tagName?.toLowerCase();

                            if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
                                const p = document.createElement('p');
                                p.innerHTML = DOMPurify.sanitize(el.innerHTML);
                                el.parentNode?.replaceChild(p, el);

                                // Restore selection inside the new P
                                const newRange = document.createRange();
                                newRange.selectNodeContents(p);
                                selection.removeAllRanges();
                                selection.addRange(newRange);

                                setEditorContent(editor.innerHTML);
                                return;
                            } else if (tagName === 'p') {
                                // Already a paragraph, do nothing
                                return;
                            }

                            node = node.parentNode;
                        }

                        // Final fallback
                        document.execCommand('formatBlock', false, 'P');
                        setEditorContent(editor.innerHTML);
                    }
                }
            }
        }

        // Alignment
        if (action === 'alignLeft') document.execCommand('justifyLeft');
        if (action === 'alignCenter') document.execCommand('justifyCenter');
        if (action === 'alignRight') document.execCommand('justifyRight');

        // Lists
        if (action === 'bulletList') document.execCommand('insertUnorderedList');

        // Insert Image
        if (action === 'insertImage') {
            const newId = `img-${Date.now()}`;
            setImages(prev => [...prev, {
                id: newId,
                type: 'image',
                src: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80', // Book placeholder
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                wrapMode: 'front'
            }]);
            setSelectedImageId(newId);
        }

        // TOC
        if (action === 'toc') {
            const editor = document.getElementById('sim-editor');
            const h1s = (editor?.querySelectorAll('h1') || []);
            if (h1s.length === 0) {
                alert("Je hebt nog geen Koppen! Maak eerst tekst 'Kop 1'.");
                return;
            }

            let tocHtml = `
                <div style="margin: 0 0 30px 0; padding: 0; font-family: 'Calibri', sans-serif;">
                    <p style="color: #2b579a; font-size: 24px; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #2b579a; padding-bottom: 8px;">Inhoudsopgave</p>
            `;

            h1s.forEach((h1, index) => {
                const pageNum = index + 1;
                tocHtml += `
                    <div style="display: flex; align-items: baseline; margin: 8px 0; font-size: 14px;">
                        <span style="color: #2b579a; font-weight: 500;">${h1.innerText}</span>
                        <span style="flex: 1; border-bottom: 1px dotted #999; margin: 0 8px; min-width: 20px;"></span>
                        <span style="color: #333; font-weight: 500;">${pageNum}</span>
                    </div>
                `;
            });

            tocHtml += '<!-- TOC --></div>';

            // Insert TOC at cursor position
            if (editor) {
                editor.focus();

                // Generate full HTML
                const fullToc = `${tocHtml}<!-- TOC --></div>`;

                // Try inserting at cursor
                if (document.queryCommandSupported('insertHTML')) {
                    document.execCommand('insertHTML', false, fullToc);
                } else {
                    // Fallback: Append to end if no cursor support (unlikely on modern browser)
                    editor.innerHTML += DOMPurify.sanitize(fullToc);
                }

                // Update state
                setEditorContent(editor.innerHTML);
            }
        }

        // Page Numbers - Show dialog for position selection
        if (action === 'pageNumber') {
            setShowPageNumberDialog(true);
        }

        // View Actions
        if (action === 'zoomIn') setSimState(s => ({ ...s, zoom: Math.min(200, s.zoom + 10) }));
        if (action === 'zoomOut') setSimState(s => ({ ...s, zoom: Math.max(50, s.zoom - 10) }));

        // Image Actions
        if (action === 'wrapMode' && selectedImageId) {
            setImages(prev => prev.map(img =>
                img.id === selectedImageId
                    ? { ...img, wrapMode: payload }
                    : img
            ));
        }

        // Layout Actions
        if (action === 'margins') setSimState(s => ({ ...s, margins: payload }));

        // Delete Image Action
        if (action === 'deleteImage' && selectedImageId) {
            setImages(prev => prev.filter(img => img.id !== selectedImageId));
            setSelectedImageId(null);
            // Optionally switch back to start tab if no image selected, but staying on Layout is fine too
        }
    };

    // Keyboard listener for deletion
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedImageId) {
                // Prevent backspace from navigating back if focused on body/container
                // But allow if in a text input (though here images are selected via state, not focus)
                e.preventDefault();
                setImages(prev => prev.filter(img => img.id !== selectedImageId));
                setSelectedImageId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageId]);

    const checkLevelSuccess = (content: string, imgs: DragItem[], currentState: SimulatorState, hasIds?: boolean, pagePos?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' } | null) => {
        let isSuccess = false;

        // Always check the actual DOM content for the most up-to-date state
        const editorElement = document.getElementById('sim-editor');
        const actualContent = editorElement?.innerHTML || content;

        if (currentLevel.id === 'level-4-pagenums') {
            // Must have page numbers AND position set to bottom-center
            isSuccess = !!(hasIds && pagePos && pagePos.vertical === 'bottom' && pagePos.horizontal === 'center');
        } else if (currentLevel.id === 'level-5-final') {
            // Check for: 
            // 1. Page Numbers enabled (hasPageNum)
            // 2. "Inleiding" matches H1 style (or just presence)
            // 3. Title exists but relies on template (we check if they kept the structure generally)

            const hasPageNum = !!hasIds;

            // Loose check for content presence
            const hasInleiding = actualContent.toLowerCase().includes('inleiding');
            const hasTitle = actualContent.toLowerCase().includes('boekverslag');

            // Check HTML structure for H1
            // Use regex or parsing to ensure 'Inleiding' is likely inside an H1
            const hasInleidingH1 = /<h1[^>]*>.*?Inleiding.*?<\/h1>/i.test(actualContent) || actualContent.includes('<h1>Inleiding</h1>');

            isSuccess = hasPageNum && hasTitle && hasInleidingH1;
        } else if (currentLevel.id === 'level-3-margins') {
            isSuccess = currentState.margins === 'narrow';
        } else {
            isSuccess = currentLevel.checkSuccess(actualContent, imgs);
        }

        if (isSuccess && !showSuccessFeedback) {
            setShowSuccessFeedback(true);
        }
    };

    const handleNextLevel = () => {
        const nextIndex = currentLevelIndex + 1;
        if (nextIndex < levels.length) {
            setCurrentLevelIndex(nextIndex);
            if (onProgressUpdate) {
                onProgressUpdate(nextIndex);
            }
        } else {
            setShowConclusion(true);
            if (onLevelComplete) onLevelComplete(1);
        }
    };

    if (showConclusion) {
        return (
            <MissionConclusion
                title="Layout Doctor Diploma!"
                description="Fantastisch! Je hebt alle casussen opgelost met de echte Word-tools."
                aiConcept={{
                    title: "Professionele Skills",
                    text: "Je kunt nu omgaan met tekstomloop, koppen en marges. Dit zijn de basics voor elk goed verslag!"
                }}
                onExit={onExit || (() => { })}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col font-sans text-slate-900 overflow-hidden">
            {/* APP HEADER */}
            <div className="bg-[#2b579a] text-white px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    {onExit && (
                        <button
                            onClick={onExit}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-sm font-medium"
                        >
                            <Undo size={16} /> Dashboard
                        </button>
                    )}
                    <div className="h-6 w-px bg-white/20"></div>
                    <div className="font-medium flex items-center gap-2">
                        <span>Word Layout Doctor</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs bg-black/20 px-3 py-1 rounded-full">
                        Casus {currentLevelIndex + 1}/{levels.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">JD</div>
                    </div>
                </div>
            </div>

            {/* RIBBON */}
            <Ribbon
                state={simState}
                onAction={handleSimulatorAction}
                onTabChange={(tab: string) => setSimState(s => ({ ...s, activeTab: tab }))}
                hasSelection={!!selectedImageId}
                selectedImageWrapMode={images.find(i => i.id === selectedImageId)?.wrapMode as any}
            />

            {/* MAIN CONTENT SPLIT */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT SIDEBAR - Patient Info & Context */}
                <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
                    {/* Patient Profile */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl shadow-inner border border-indigo-200 shrink-0">
                                {currentLevel.avatar}
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Patiënt</div>
                                <div className="font-bold text-indigo-900 text-lg leading-tight">{currentLevel.sender}</div>
                            </div>
                        </div>

                        {/* Complaint */}
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-4">
                            <h4 className="font-bold text-amber-800 text-xs mb-2 flex items-center gap-2">
                                <Eye size={14} /> Klacht:
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                "{currentLevel.complaint}"
                            </p>
                        </div>

                        {/* Instruction */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-xs mb-2 flex items-center gap-2">
                                <Search size={14} /> Wat moet je doen?
                            </h4>
                            <div className="bg-white rounded-lg p-3 border-2 border-blue-300 mb-3">
                                <p className="text-base text-blue-900 font-bold leading-relaxed">
                                    👉 {currentLevel.instruction}
                                </p>
                            </div>

                            {/* Extra warning for headings level */}
                            {currentLevel.id === 'level-2-headings' && (
                                <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-3 mb-3">
                                    <p className="text-sm text-amber-900 font-bold flex items-start gap-2">
                                        <span className="text-lg">✋</span>
                                        <span>
                                            <strong>Zo doe je het:</strong><br />
                                            <span className="font-normal text-amber-800">
                                                1. Klik ergens IN het woord 'Inleiding'<br />
                                                2. Klik op de knop <strong>'Kop 1'</strong> bovenin<br />
                                                3. Herhaal voor de andere 2 titels
                                            </span>
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div className="text-xs text-slate-500 bg-white/50 p-2 rounded-lg border border-blue-100/50">
                                <span className="font-bold text-indigo-600">💡 Tip:</span> {currentLevel.hint}
                            </div>
                        </div>
                    </div>

                    {/* Success Feedback (Replaces sidebar content when successful) */}
                    {showSuccessFeedback && (
                        <div className="p-6 bg-emerald-50 border-t border-emerald-100 animate-in slide-in-from-left duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                                    <Check size={20} />
                                </div>
                                <h3 className="font-black text-emerald-800 text-lg">Genezen!</h3>
                            </div>
                            <p className="text-sm text-emerald-700 mb-6 leading-relaxed">
                                De patiënt is tevreden met het resultaat.
                            </p>
                            <button
                                onClick={handleNextLevel}
                                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                            >
                                Volgende Casus <Undo name="arrow-right" size={18} className="rotate-180" />
                            </button>
                        </div>
                    )}
                </div>

                {/* DOCUMENT CANVAS CONTAINER WITH FOOTER */}
                <div className="flex-1 bg-slate-200 overflow-auto p-8 relative flex justify-center shadow-inner">
                    <div className="relative">
                        <DocumentCanvas
                            state={simState}
                            content={editorContent}
                            images={images}
                            selectedImageId={selectedImageId}
                            onContentChange={setEditorContent}
                            onImagesChange={setImages}
                            onSelectImage={setSelectedImageId}
                        />
                        {/* PAGE NUMBER OVERLAY */}
                        {hasPageNumbers && pageNumberPosition && (
                            <>
                                {/* Page 1 */}
                                <div
                                    className={`absolute w-[794px] text-slate-400 text-xs pointer-events-none px-16 ${pageNumberPosition.horizontal === 'left' ? 'text-left' :
                                        pageNumberPosition.horizontal === 'right' ? 'text-right' : 'text-center'
                                        }`}
                                    style={{
                                        top: pageNumberPosition.vertical === 'top' ? '40px' : '1080px',
                                        transform: `scale(${simState.zoom / 100})`,
                                        transformOrigin: 'top center'
                                    }}
                                >
                                    - 1 -
                                </div>

                                {/* Multi-page support based on content markers */}
                                {(editorContent.includes('id="page-2"') || editorContent.length > 5000) && (
                                    <>
                                        <div
                                            className={`absolute w-[794px] text-slate-400 text-xs pointer-events-none px-16 ${pageNumberPosition.horizontal === 'left' ? 'text-left' :
                                                pageNumberPosition.horizontal === 'right' ? 'text-right' : 'text-center'
                                                }`}
                                            style={{
                                                top: pageNumberPosition.vertical === 'top' ? '1180px' : '2220px',
                                                transform: `scale(${simState.zoom / 100})`,
                                                transformOrigin: 'top center'
                                            }}
                                        >
                                            - 2 -
                                        </div>
                                        <div
                                            className={`absolute w-[794px] text-slate-400 text-xs pointer-events-none px-16 ${pageNumberPosition.horizontal === 'left' ? 'text-left' :
                                                pageNumberPosition.horizontal === 'right' ? 'text-right' : 'text-center'
                                                }`}
                                            style={{
                                                top: pageNumberPosition.vertical === 'top' ? '2320px' : '3360px',
                                                transform: `scale(${simState.zoom / 100})`,
                                                transformOrigin: 'top center'
                                            }}
                                        >
                                            - 3 -
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* PAGE NUMBER POSITION DIALOG */}
                    {showPageNumberDialog && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Paginanummer Positie</h3>
                                <p className="text-sm text-slate-600 mb-6">Waar wil je het paginanummer plaatsen?</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Verticaal</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setPageNumberPosition(p => ({ ...p!, vertical: 'top', horizontal: p?.horizontal || 'center' }))}
                                                className={`p-3 rounded-lg border-2 font-medium transition-all ${pageNumberPosition?.vertical === 'top'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                ⬆️ Bovenaan
                                            </button>
                                            <button
                                                onClick={() => setPageNumberPosition(p => ({ ...p!, vertical: 'bottom', horizontal: p?.horizontal || 'center' }))}
                                                className={`p-3 rounded-lg border-2 font-medium transition-all ${pageNumberPosition?.vertical === 'bottom'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                ⬇️ Onderaan
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Horizontaal</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => setPageNumberPosition(p => ({ vertical: p?.vertical || 'bottom', horizontal: 'left' }))}
                                                className={`p-3 rounded-lg border-2 font-medium transition-all ${pageNumberPosition?.horizontal === 'left'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                ◀️ Links
                                            </button>
                                            <button
                                                onClick={() => setPageNumberPosition(p => ({ vertical: p?.vertical || 'bottom', horizontal: 'center' }))}
                                                className={`p-3 rounded-lg border-2 font-medium transition-all ${pageNumberPosition?.horizontal === 'center'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                ⏺️ Midden
                                            </button>
                                            <button
                                                onClick={() => setPageNumberPosition(p => ({ vertical: p?.vertical || 'bottom', horizontal: 'right' }))}
                                                className={`p-3 rounded-lg border-2 font-medium transition-all ${pageNumberPosition?.horizontal === 'right'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                ▶️ Rechts
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowPageNumberDialog(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        Annuleren
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (pageNumberPosition?.vertical && pageNumberPosition?.horizontal) {
                                                setHasPageNumbers(true);
                                                setShowPageNumberDialog(false);
                                            } else {
                                                alert('Kies eerst een positie!');
                                            }
                                        }}
                                        disabled={!pageNumberPosition?.vertical || !pageNumberPosition?.horizontal}
                                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Toevoegen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* STATUS BAR */}
            <div className="bg-[#2b579a] text-white/80 text-[10px] px-2 py-0.5 flex justify-between shrink-0">
                <div className="flex gap-4">
                    <span>Pagina 1 van 1</span>
                    <span>{editorContent.split(' ').length} woorden</span>
                    <span>Nederlands (NL)</span>
                </div>
            </div>

            {/* FULLSCREEN SUCCESS OVERLAY */}
            {showSuccessFeedback && (
                <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-emerald-600 mb-2">Goed gedaan! 🎉</h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Je hebt de opdracht succesvol afgerond!
                        </p>
                        <div className="bg-slate-100 rounded-xl p-4 mb-6">
                            <p className="text-sm text-slate-500 mb-2">Volgende casus start over</p>
                            <div className="text-4xl font-black text-indigo-600">{autoRedirectCountdown}</div>
                            <p className="text-xs text-slate-400">seconden</p>
                        </div>
                        <button
                            onClick={handleNextLevel}
                            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Nu Doorgaan <Check size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- LEVELS DEFINITION ---
const levels: LevelConfig[] = [
    {
        id: 'level-1-romans',
        title: 'De Verdwenen Tekst',
        sender: 'Mevr. Jansen',
        avatar: '👩‍🏫',
        complaint: "Help! Ik heb een plaatje ingevoegd in mijn werkstuk, maar nu staat mijn tekst er dwars doorheen. Hoe krijg ik de tekst netjes *om* het plaatje heen?",
        hint: "Selecteer het plaatje en kijk bij 'Indeling' naar 'Tekstomloop'.",
        instruction: "Zet de tekstomloop op 'Vierkant' en sleep het plaatje naar rechts.",
        initialContent: `
                <h1 style="color: #2b579a; font-size: 24px; font-weight: bold; margin-bottom: 1em;">De Romeinse Tijd</h1>
                <p>De Romeinen waren een volk dat oorspronkelijk in de stad Rome leefde. Ze veroverden een enorm rijk dat zich uitstrekte van Engeland tot Egypte.</p>
                <p>Hun leger was super goed georganiseerd en ze bouwden overal wegen.</p>
                <p>In Nederland kwamen de Romeinen tot aan de Rijn. Ze bouwden forten, badhuizen en tempels.</p>
                <p>De lokale bevolking leerde schrijven en handelen van de Romeinen. Het Romeinse Rijk bleef honderden jaren bestaan.</p>
            `,
        initialImages: [
            {
                id: 'romans-img',
                type: 'image',
                src: '/assets/word-simulator/roman-casus.png',
                x: 60,
                y: 120,
                width: 250,
                height: 180,
                wrapMode: 'front'
            }
        ],
        checkSuccess: (content, imgs) => {
            const img = imgs.find(i => i.id === 'romans-img');
            // Check position > 250 (slightly lenient right side) AND wrap mode
            return !!(img && (img.wrapMode === 'square' || img.wrapMode === 'tight') && img.x > 250);
        }
    },
    {
        id: 'level-2-headings',
        title: 'Saaie Koppen',
        sender: 'Meester Bart',
        avatar: '👨‍🏫',
        complaint: "Mijn verslag ziet er zo saai uit. Ik heb titels getypt, maar het lijkt net gewone tekst. Kun jij er echte koppen van maken?",
        hint: "Klik ergens IN de tekst 'Inleiding' (niet selecteren, gewoon klikken). Klik dan bovenin op de knop 'Kop 1'. Herhaal dit voor de andere twee titels.",
        instruction: "Verander 3 regels naar 'Kop 1': klik IN de regel, klik dan op 'Kop 1' bovenin. Je typt NIETS!",
        initialContent: `
                <p>Inleiding</p>
                <p>Dit is de inleiding van mijn spreekbeurt over vulkanen.</p>
                
                <p>Wat is een vulkaan?</p>
                <p>Een vulkaan is een opening in de aardkorst waar magma uit komt.</p>
                
                <p>Soorten vulkanen</p>
                <p>Er zijn schildvulkanen en stratovulkanen.</p>
            `,
        initialImages: [],
        checkSuccess: (content, imgs) => {
            // Use DOM parser to properly count H1 elements regardless of attributes/styles
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const h1Count = doc.querySelectorAll('h1').length;
            return h1Count >= 3;
        }
    },
    {
        id: 'level-3-toc',
        title: 'Het Overzicht',
        sender: 'Juf Sarah',
        avatar: '📚',
        complaint: "Ik heb veel hoofdstukken, maar ik mis een overzicht aan het begin. Kun jij automatisch een lijstje maken van alle koppen?",
        hint: "Ga naar 'Verwijzingen' en kies 'Inhoudsopgave'. (Zorg wel dat er Koppen zijn!)",
        instruction: "Voeg een automatische inhoudsopgave in.",
        initialContent: `
                <h1>Hoofdstuk 1: De Start</h1>
                <p>Tekst over de start.</p>
                <h1>Hoofdstuk 2: Het Midden</h1>
                <p>Tekst over het midden.</p>
                <h1>Hoofdstuk 3: Het Einde</h1>
                <p>Tekst over het einde.</p>
            `,
        initialImages: [],
        checkSuccess: (content, imgs) => {
            // Check if Table of Contents (UL/LI structure with links or specific class) exists
            // The implementation of 'toc' creates a div with class 'toc-container' or similar
            return content.includes('<!-- TOC -->') || content.includes('Inhoudsopgave');
        }
    },
    {
        id: 'level-4-pagenums',
        title: 'De Finishing Touch',
        sender: 'Directeur De Vries',
        avatar: '👔',
        complaint: "Het document is bijna klaar, maar als ik het print weet ik niet welke pagina het is. Voeg alsjeblieft paginanummers toe.",
        hint: "Ga naar 'Invoegen' en kies 'Paginanummer'. Let op de positie!",
        instruction: "Voeg paginanummers toe ONDERAAN de pagina, in het MIDDEN.",
        initialContent: `
                <h1>Eindrapport</h1>
                <p>Dit is een heel belangrijk rapport.</p>
                <p>Het moet er professioneel uitzien.</p>
            `,
        initialImages: [],
        checkSuccess: (content, imgs) => {
            return false; // Handled by wrapper - checks pageNumberPosition
        }
    }
];
