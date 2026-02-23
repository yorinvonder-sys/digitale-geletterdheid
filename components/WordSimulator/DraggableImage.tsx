
import React, { useRef, useState, useEffect } from 'react';
import { DragItem } from './types';

interface DraggableImageProps {
    item: DragItem;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<DragItem>) => void;
    zoom: number;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({ item, isSelected, onSelect, onUpdate, zoom }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const startItemPosRef = useRef({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);
    const translateRef = useRef({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const onPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        // Don't preventDefault here as it might block selection logic if we change focus handling
        // e.preventDefault(); 

        if (!elementRef.current) return;

        elementRef.current.setPointerCapture(e.pointerId);

        draggingRef.current = true;
        setDragOffset({ x: 0, y: 0 });
        translateRef.current = { x: 0, y: 0 };

        setIsDraggingState(true);
        onSelect();

        startPosRef.current = { x: e.clientX, y: e.clientY };
        startItemPosRef.current = { x: item.x, y: item.y };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!draggingRef.current) return;

        const zoomScale = zoom / 100;
        const dx = (e.clientX - startPosRef.current.x) / zoomScale;
        const dy = (e.clientY - startPosRef.current.y) / zoomScale;

        translateRef.current = { x: dx, y: dy };
        setDragOffset({ x: dx, y: dy });
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!draggingRef.current) return;

        draggingRef.current = false;
        setIsDraggingState(false);

        if (elementRef.current) {
            elementRef.current.releasePointerCapture(e.pointerId);

            const finalX = startItemPosRef.current.x + translateRef.current.x;
            const finalY = startItemPosRef.current.y + translateRef.current.y;

            setDragOffset({ x: 0, y: 0 });
            onUpdate({ x: finalX, y: finalY });
        }
    };

    const getStyles = (): React.CSSProperties => {
        return {
            width: item.width,
            height: item.height,
            cursor: isDraggingState ? 'grabbing' : 'grab',
            border: isSelected ? '2px solid #2b579a' : '1px solid transparent',
            userSelect: 'none',
            touchAction: 'none',
            position: 'absolute',
            left: item.x,
            top: item.y,
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
            zIndex: item.wrapMode === 'behind' ? 5 : 50,
            backgroundColor: item.wrapMode === 'square' ? 'white' : 'transparent',
            boxShadow: item.wrapMode === 'square' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
            opacity: item.wrapMode === 'behind' ? 0.5 : 1,
        };
    };

    return (
        <div
            ref={elementRef}
            style={getStyles()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={(e) => {
                // Stop propagation to prevent DocumentCanvas from deselecting this image
                e.stopPropagation();
                // Ensure selection is maintained on click
                onSelect();
            }}
        >
            <img
                src={item.src}
                alt="Afbeelding"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none select-none"
                onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect fill="%23e2e8f0" width="300" height="200"/><text fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">📷 Afbeelding laden...</text></svg>');
                }}
            />
            {isSelected && (
                <div className="absolute -top-8 left-0 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                    Tekstomloop: {item.wrapMode === 'square' ? 'vierkant' : item.wrapMode === 'front' ? 'voor' : item.wrapMode === 'behind' ? 'achter' : item.wrapMode === 'tight' ? 'strak' : 'geen'}
                </div>
            )}
        </div>
    );
};
