import type { BadgeConfig } from '../shared/types';

export type { BadgeConfig };

export interface ScenarioItem {
    id: number;
    icon: string;
    title: string;
    description: string;
    /** For select-correct and binary-choice rounds */
    correct?: boolean;
    /** For order-priority rounds: 0-indexed correct position */
    correctPosition?: number;
    explanation: string;
    /** Feedback shown when this item is answered incorrectly */
    wrongFeedback?: string;
}

export interface ScenarioRound {
    id: string;
    emoji: string;
    title: string;
    description: string;
    type: 'select-correct' | 'order-priority' | 'binary-choice';
    items: ScenarioItem[];
    maxScore: number;
    feedbackCorrect?: string;
    feedbackIncorrect?: string;
}

export interface ScenarioEngineConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    rounds: ScenarioRound[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

export interface RoundState {
    selections: number[];
    submitted: boolean;
    confidence?: number;
    followUpAnswered?: boolean;
    followUpCorrect?: boolean;
}

export interface ScenarioEngineState {
    phase: 'intro' | 'active' | 'results';
    currentRound: number;
    roundStates: Record<string, RoundState>;
}
