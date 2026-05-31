import type { BadgeConfig, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';

export type { BadgeConfig, FollowUpQuestion };

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
    /** Optional override-feedback for incorrect answers (used by phishing-fighter etc.) */
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
    /** Optional minimum selected items before a select-correct round can be submitted. */
    minSelections?: number;
    /** Optional helper text for select-correct rounds. */
    selectionInstruction?: string;
    /** Optional helper text for order-priority rounds. */
    orderInstruction?: string;
    /** When true, prompt learner to rate confidence (1-3) before submission */
    showConfidence?: boolean;
    /** Optional labels for binary-choice rounds. Defaults remain generic for older missions. */
    acceptLabel?: string;
    rejectLabel?: string;
    /** Optional follow-up question after the main round */
    followUp?: FollowUpQuestion;
}

export interface ScenarioIntroChoiceOption {
    id: string;
    label: string;
    description: string;
    feedback: string;
}

export interface ScenarioIntroChoice {
    title: string;
    scenario: string;
    prompt: string;
    options: ScenarioIntroChoiceOption[];
}

export interface ScenarioEngineConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    /** Optional first-minute hypothesis/choice before the normal rounds start. */
    introChoice?: ScenarioIntroChoice;
    /** Optional explicit, measurable learning objectives — preferred over implicit `introFeatures` for SLO-rapportage. Format: action verb + measurable outcome. */
    learningObjectives?: string[];
    rounds: ScenarioRound[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

export interface RoundState {
    selections: number[];
    submitted: boolean;
    /** Learner's self-reported confidence (1=low, 2=medium, 3=high), set when showConfidence is true */
    confidence?: 1 | 2 | 3;
    /** Whether the follow-up question has been answered */
    followUpAnswered?: boolean;
    /** Whether the follow-up answer was correct */
    followUpCorrect?: boolean;
}

export interface ScenarioEngineState {
    phase: 'intro' | 'active' | 'results';
    currentRound: number;
    roundStates: Record<string, RoundState>;
    introChoiceId?: string;
}
