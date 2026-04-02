import type { ReactNode } from 'react';

// === Standard mission props (all templates receive these) ===
export interface TemplateMissionProps {
    missionId: string;
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: string;
}

// === Base config shared by all templates ===
export interface BaseTemplateConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    enableChat?: boolean;
    chatRoleId?: string;
}

// === Badge tiers for completion screen ===
export interface BadgeConfig {
    minScore: number;
    emoji: string;
    title: string;
    color: string; // tailwind-compatible color like '#10B981'
}

// === Template type discriminator ===
export type TemplateType =
    | 'scenario-engine'
    | 'puzzle-lab'
    | 'simulation-lab'
    | 'review-arena'
    | 'builder-canvas'
    | 'data-viewer'
    | 'debate-arena'
    | 'tool-guide';

// === Template registry entry ===
export interface TemplateMissionEntry {
    missionId: string;
    templateType: TemplateType;
    enableChat?: boolean;
    chatRoleId?: string;
}
