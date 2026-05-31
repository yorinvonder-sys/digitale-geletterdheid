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

export type MissionBoringRisk = 'low' | 'medium' | 'high';

export type MissionPrimaryInteraction =
    | 'build'
    | 'choose-with-consequence'
    | 'pin-evidence'
    | 'operate-simulation'
    | 'solve-puzzle'
    | 'prioritize-case'
    | 'test-product'
    | 'defend-position'
    | 'review-and-improve';

export type MissionVisualKit =
    | 'tool-crisis'
    | 'data-room'
    | 'debate-dilemma'
    | 'maker-canvas'
    | 'evidence-badge'
    | 'review-puzzle-feedback'
    | 'simulation-control'
    | 'casefile';

export interface MissionExperienceDesign {
    boringRisk: MissionBoringRisk;
    firstTenSeconds: string;
    primaryInteraction: MissionPrimaryInteraction;
    feedbackMoment: string;
    visualKit: MissionVisualKit;
    evidenceMoment: string;
    antiBoringRule: string;
    chromeAcceptance: string;
}

// === Standard mission props (all templates receive these) ===
export interface TemplateMissionProps {
    missionId: string;
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: string;
    enableChat?: boolean;
    chatRoleId?: string;
}

// === Base config shared by all templates ===
export interface BaseTemplateConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    enableChat?: boolean;
    chatRoleId?: string;
}

// === Badge tiers for completion screen ===
export interface BadgeConfig {
    minScore: number;
    emoji: string;
    title: string;
    color: string; // tailwind-compatible color like '#5F947D'
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
