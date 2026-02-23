
import React from 'react';

export interface SimulatorState {
    zoom: number;
    margins: 'normal' | 'narrow' | 'wide';
    orientation: 'portrait' | 'landscape';
    activeTab: string;
    showGrid: boolean;
    paperSize: 'A4';
}

export interface DragItem {
    id: string;
    type: 'image' | 'shape';
    src?: string; // for images
    x: number;
    y: number;
    width: number;
    height: number;
    wrapMode: 'square' | 'tight' | 'none' | 'behind' | 'front';
    content?: string; // for shapes text
}

export interface LevelConfig {
    id: string;
    title: string;
    sender: string;
    avatar: string;
    complaint: string;
    hint: string;
    instruction: string;
    initialContent: string; // HTML string
    initialImages: DragItem[];
    checkSuccess: (content: string, images: DragItem[]) => boolean;
}
