import type { BadgeConfig, FollowUpQuestion, MissionGoal } from '../shared/types';

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
    /** For spot-the-flags rounds: waar dit onderdeel in de nagebootste mail staat. */
    flagSlot?: 'from' | 'subject' | 'meta' | 'body' | 'link' | 'attachment';
}

/**
 * Nagebootste mail-omlijsting voor een `spot-the-flags`-ronde. De leerling ziet
 * een echt ogend bericht in plaats van een lijst kaartjes; de items uit de ronde
 * worden als aanklikbare onderdelen ín dat bericht getekend.
 */
export interface EmailFrame {
    fromName: string;
    subject: string;
    receivedLabel: string;
    /** Alinea's van de mailtekst, getoond boven de aanklikbare onderdelen. */
    body: string[];
}

export interface ScenarioRound {
    id: string;
    emoji: string;
    title: string;
    description: string;
    /**
     * De drie klassieke types zijn keuzelijsten. De drie `-`-varianten daarnaast
     * tonen dezelfde opgave als handeling (mail doorzoeken, slepen, sorteren) en
     * gebruiken bewust dezelfde opslag en dezelfde scoreformule als hun klassieke
     * tegenhanger — zie `SCORING_KIND` in sub/FeedbackBanner.tsx.
     */
    type:
        | 'select-correct'
        | 'order-priority'
        | 'binary-choice'
        | 'spot-the-flags'
        | 'order-drag'
        | 'inbox-triage';
    items: ScenarioItem[];
    /** Verplicht bij `spot-the-flags`: de mail waarin de leerling zoekt. */
    emailFrame?: EmailFrame;
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
    /**
     * Punten binnen `maxScore` die gereserveerd zijn voor de followUp-vraag.
     * Bij > 0 telt de followUp mee in de zichtbare score: de itemscore wordt
     * geschaald naar `maxScore - followUpWeight`, en een goed followUp-antwoord
     * levert de resterende punten op. Weggelaten of 0 = ongewijzigd gedrag.
     */
    followUpWeight?: number;
}

export interface ScenarioEngineConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    /** Optional explicit, measurable learning objectives — preferred over implicit `introFeatures` for SLO-rapportage. Format: action verb + measurable outcome. */
    learningObjectives?: string[];
    attribution?: {
        source: string;
        author?: string;
        license?: string;
        licenseUrl?: string;
        sourceUrl?: string;
    };
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
}
