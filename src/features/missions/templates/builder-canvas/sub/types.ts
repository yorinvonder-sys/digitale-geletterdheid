import { isMeaningfulAnswer } from '../../shared/answerQuality.ts';

export interface BuilderCanvasState {
    phase: 'intro' | 'building' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    textEntries: Record<string, string>;
    evidenceEntries: Record<string, string>;
    completedSteps: string[];
    reflectionAnswered: Record<string, boolean>;
    reflectionCorrect: Record<string, boolean>;
    showMilestone: boolean;
}

interface EvidenceStepLike {
    id: string;
    evidence?: {
        minLength?: number;
    };
}

/**
 * Migrates a saved BuilderCanvas run after evidence gates are introduced.
 * Existing learner work is retained; only completion markers at and after the
 * first incomplete evidence-gated step are removed so the learner can supply
 * the missing proof instead of silently bypassing the new gate.
 */
export function migrateBuilderEvidenceState(
    state: BuilderCanvasState,
    steps: ReadonlyArray<EvidenceStepLike>,
): BuilderCanvasState {
    const evidenceEntries = state.evidenceEntries ?? {};
    const earliestAffectedIndex = steps.findIndex((step) => {
        if (!step.evidence || !state.completedSteps.includes(step.id)) return false;
        const value = evidenceEntries[step.id]?.trim() ?? '';
        const minLength = step.evidence.minLength ?? 40;
        return value.length < minLength || !isMeaningfulAnswer(value);
    });

    if (earliestAffectedIndex < 0) return state;

    const completedSteps = state.completedSteps.filter((id) => {
        const index = steps.findIndex((step) => step.id === id);
        return index < 0 || index < earliestAffectedIndex;
    });
    const reflectionAnswered = Object.fromEntries(
        Object.entries(state.reflectionAnswered).filter(([id]) => {
            const index = steps.findIndex((step) => step.id === id);
            return index < 0 || index < earliestAffectedIndex;
        }),
    );
    const reflectionCorrect = Object.fromEntries(
        Object.entries(state.reflectionCorrect).filter(([id]) => {
            const index = steps.findIndex((step) => step.id === id);
            return index < 0 || index < earliestAffectedIndex;
        }),
    );

    return {
        ...state,
        phase: 'building',
        currentStep: earliestAffectedIndex,
        completedSteps,
        reflectionAnswered,
        reflectionCorrect,
    };
}
