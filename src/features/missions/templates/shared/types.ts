import type { ReactNode } from 'react';

// === Shared /goal contract ===
export type MissionGoalCriteriaType =
    | 'steps-complete'
    | 'rounds-complete'
    | 'score-threshold'
    | 'component-complete';

export interface MissionGoalCriteria {
    type: MissionGoalCriteriaType;
    min?: number;
    threshold?: number;
    description?: string;
}

export interface MissionGoal {
    primaryGoal: string;
    criteria: MissionGoalCriteria;
    evidence?: string;
}

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
    missionGoal?: MissionGoal;
    enableChat?: boolean;
    chatRoleId?: string;
}

// === Badge tiers for completion screen ===
export interface BadgeConfig {
    minScore: number;
    emoji: string;
    title: string;
    color: string; // tailwind-compatible color like '#202023'
}

// === Follow-up multiple-choice question (used by FollowUpCard in ScenarioEngine, PuzzleLab, etc.) ===
export interface FollowUpQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    bonusPoints: number;
    explanation: string;
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
