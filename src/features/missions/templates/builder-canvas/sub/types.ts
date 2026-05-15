export interface BuilderCanvasState {
    phase: 'intro' | 'building' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    textEntries: Record<string, string>;
    completedSteps: string[];
    reflectionAnswered: Record<string, boolean>;
    reflectionCorrect: Record<string, boolean>;
    showMilestone: boolean;
}
