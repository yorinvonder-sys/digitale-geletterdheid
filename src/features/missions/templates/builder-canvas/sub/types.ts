export interface BuilderCanvasState {
    phase: 'intro' | 'launch' | 'building' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    textEntries: Record<string, string>;
    completedSteps: string[];
    reflectionAnswered: Record<string, boolean>;
    reflectionCorrect: Record<string, boolean>;
    showMilestone: boolean;
    launchChoiceId?: string;
    testLensId?: string;
    testedSteps: Record<string, boolean>;
}
