/**
 * Mission Data Types
 * Proper TypeScript interfaces for mission state persistence
 */

// ============================================================================
// CHATBOT TRAINER STATE
// ============================================================================

export interface ChatbotIntent {
    id: string;
    name: string;
    examples: string[];
    response: string;
}

export interface ChatbotScenario {
    id: string;
    name: string;
    context: string;
    icon: string;
    intents: ChatbotIntent[];
    testQuestions: string[];
}

export interface ChatbotState {
    mode: 'intro' | 'training' | 'testing';
    activeScenario: ChatbotScenario;
    intents: ChatbotIntent[];
    customName?: string;
    customContext?: string;
    customIcon?: string;
    customTestQuestions?: string[];
}

// ============================================================================
// DRAWING GAME STATE
// ============================================================================

export interface DrawingPrompt {
    label: string;
    emoji: string;
}

export interface DrawingGameState {
    hasStarted: boolean;
    currentRound: number;
    score: number;
    gamePrompts: DrawingPrompt[];
}

// ============================================================================
// ASSESSMENT STATE
// ============================================================================

export interface TaskResult {
    id: string;
    success: boolean;
    score: number;
}

export interface AssessmentState {
    score: number;
    taskResults: TaskResult[];
    currentTaskIndex: number;
    view: 'intro' | 'task' | 'summary';
}

// ============================================================================
// UNION TYPE FOR ALL MISSION DATA
// ============================================================================

export type MissionDataState = ChatbotState | DrawingGameState | AssessmentState | Record<string, unknown>;

// ============================================================================
// MISSION SAVE CALLBACK TYPE
// ============================================================================

export type MissionSaveCallback<T = MissionDataState> = (data: T) => void;
