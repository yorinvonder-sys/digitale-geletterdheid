
import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { SimulatorState, DragItem } from './types';
import { DraggableImage } from './DraggableImage';

interface DocumentCanvasProps {
    state: SimulatorState;
    content: string;
    images: DragItem[];
    selectedImageId: string | null;
    onContentChange: (html: string) => void;
    onImagesChange: (items: DragItem[]) => void;
    onSelectImage: (id: string | null) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
    state, content, images, selectedImageId, onContentChange, onImagesChange, onSelectImage
}) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Initial content load
    useEffect(() => {
        if (editorRef.current && content && editorRef.current.innerHTML !== content) {
            // We only set innerHTML if it's significantly different to check for initial load
            // Real formatted text syncing is hard, so we assume 'content' prop is only updated on level switch
            // or we use a more robust sync if needed. For now, we trust the parent to push initial content.
            // But we don't want to overwrite user typing on every render.
            // So we only set if empty? No, level switch.
            // Simple approach: Key the component by Level ID in parent to force remount on level change.
            editorRef.current.innerHTML = DOMPurify.sanitize(content);
        }
    }, [content]); // Warning: this might overwrite typing if parent updates 'content' frequently. 
    // Parent currently only updates content on Level Change (useEffect).

    const handleInput = () => {
        if (editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    // Margins logic - Refactored to get values
    const getPaddingValues = () => {
        let baseFn = () => {
            switch (state.margins) {
                case 'narrow': return 20;
                case 'wide': return 80;
                case 'normal': default: return 50;
            }
        };
        const base = baseFn();

        let extraRight = 0;
        let extraLeft = 0;

        images.forEach(img => {
            if (img.wrapMode === 'square') {
                const docWidth = 794;
                const imgCenter = img.x + (img.width / 2);

                if (imgCenter > docWidth / 2) {
                    const requiredPadding = docWidth - img.x;
                    if (requiredPadding > extraRight) extraRight = requiredPadding + 10;
                }

                if (imgCenter < docWidth / 2) {
                    const requiredPadding = img.x + img.width;
                    if (requiredPadding > extraLeft) extraLeft = requiredPadding + 10;
                }
            }
        });

        return {
            top: base,
            bottom: base,
            left: Math.max(base, extraLeft),
            right: Math.max(base, extraRight)
        };
    };

    const padding = getPaddingValues();

    // Height tracking for pagination
    const [scrollHeight, setScrollHeight] = React.useState(1123);

    useEffect(() => {
        if (!editorRef.current) return;
        const observer = new ResizeObserver(() => {
            if (editorRef.current) {
                setScrollHeight(Math.max(1123, editorRef.current.scrollHeight));
            }
        });
        observer.observe(editorRef.current);
        return () => observer.disconnect();
    }, []);

    const pageCount = Math.ceil(scrollHeight / 1123);

    const handleImageUpdate = (id: string, updates: Partial<DragItem>) => {
        onImagesChange(images.map(img => img.id === id ? { ...img, ...updates } : img));
    };

    return (
        <div
            className="transition-all duration-300 relative flex flex-col items-center"
            style={{
                width: '794px', // A4 pixels at 96 DPI
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
            }}
            onClick={() => onSelectImage(null)} // Deselect image when clicking "background" (wrapper)
        >
            {/* VISUAL LAYERS (The "Paper Sheets") */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {Array.from({ length: pageCount }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white shadow-xl relative"
                        style={{
                            width: '100%',
                            height: '1123px',
                            position: 'absolute',
                            top: i * 1123,
                            left: 0,
                            borderBottom: i < pageCount - 1 ? '20px solid #e2e8f0' : 'none', // Thick gray border acts as "gap"
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Visual Margin Box */}
                        <div
                            style={{
                                position: 'absolute',
                                top: padding.top,
                                left: padding.left,
                                right: padding.right,
                                bottom: padding.bottom, // Visual border stops here
                                border: '1px solid rgba(139, 92, 246, 0.4)',
                            }}
                        />
                        {/* Page Break Visual (The Gap) */}
                        {i < pageCount - 1 && (
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '20px',
                                background: '#e2e8f0', // Slate-200 gap color matches app bg
                                borderTop: '1px solid #cbd5e1',
                                borderBottom: '1px solid #cbd5e1',
                                zIndex: 10
                            }} />
                        )}

                        <div className="absolute bottom-6 right-8 text-xs text-slate-400 font-medium">
                            Pagina {i + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* TEXT EDITOR - Transparent Layout */}
            <div
                id="sim-editor"
                ref={editorRef}
                contentEditable
                className="outline-none min-h-[1123px] font-serif text-slate-900 leading-relaxed cursor-text relative w-full"
                onInput={handleInput}
                suppressContentEditableWarning
                style={{
                    zIndex: 10,
                    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
                }}
            />

            {/* IMAGE LAYER */}
            {images.map(img => (
                <DraggableImage
                    key={img.id}
                    item={img}
                    isSelected={selectedImageId === img.id}
                    onSelect={() => onSelectImage(img.id)}
                    onUpdate={(u) => handleImageUpdate(img.id, u)}
                    zoom={state.zoom}
                />
            ))}
        </div>
    );
};
