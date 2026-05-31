import type { BadgeConfig, MissionGoal, MissionExperienceDesign } from '../shared/types';

export interface Puzzle {
    id: string;
    title: string;
    description: string;
    type: 'text-input' | 'multiple-choice' | 'code-crack';
    clues: string[];
    extraClues?: string[];
    revealExtraAfterAttempts: number;
    answer: string | string[];
    caseSensitive: boolean;
    options?: string[];
    maxAttempts: number;
    points: number;
    successMessage: string;
    hintCost: number;
    /** For password-like practice inputs: mask the field and never persist the raw answer. */
    sensitiveAnswer?: boolean;
    /** Optional custom validator — if provided, overrides answer-string comparison */
    validator?: (input: string) => boolean;
}

export interface PuzzleLabConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    puzzles: Puzzle[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}
