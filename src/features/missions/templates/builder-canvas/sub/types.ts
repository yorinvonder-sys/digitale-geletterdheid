import { isMeaningfulAnswer } from '../../shared/answerQuality.ts';

/**
 * Versie van het checklist-schema. Elke checklist-interactie stempelt deze
 * versie in de opslag; een save zónder stempel dateert aantoonbaar van vóór de
 * introductie ervan en komt daarmee in aanmerking voor de grandfather-migratie
 * van later toegevoegde items.
 */
export const CHECKLIST_SCHEMA_VERSION = 2;

export interface BuilderCanvasState {
    phase: 'intro' | 'building' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    /** Zie CHECKLIST_SCHEMA_VERSION; afwezig = save van vóór de versiestempel. */
    checklistVersion?: number;
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

interface ChecklistStepLike {
    id: string;
    checklistItems: ReadonlyArray<{ id: string; addedLater?: boolean }>;
}

/**
 * Grandfathert checklistitems die ná een opgeslagen sessie aan een stap zijn
 * toegevoegd (zoals de portretrecht-regel). Alleen items die in de config
 * expliciet als `addedLater` gemarkeerd staan komen in aanmerking — een
 * ontbrekende sleutel alléén is niet genoeg, want die betekent bij oude items
 * gewoon 'nog niet aangevinkt'. Het late item wordt uitsluitend afgevinkt
 * wanneer álle oorspronkelijke items van de stap in de opslag al afgevinkt
 * waren: de leerling had de checklist onder de oude regels dus volledig af.
 * Half-ingevulde stappen en verse runs blijven ongemoeid, en een expliciet
 * uitgevinkt item (sleutel met false) wordt nooit overschreven.
 */
export function migrateBuilderChecklistState(
    state: BuilderCanvasState,
    steps: ReadonlyArray<ChecklistStepLike>,
): BuilderCanvasState {
    // Een save mét versiestempel is ná de introductie van addedLater ontstaan:
    // een ontbrekend late item betekent daar 'bewust (nog) niet aangevinkt' en
    // mag nooit automatisch goedgekeurd worden — anders kan een huidige
    // leerling het item omzeilen door alles aan te vinken en te herladen.
    if (state.checklistVersion !== undefined) return state;
    const checklist = state.checklist ?? {};
    // Bewerkte of corrupte opslag kan hier elk type bevatten; `in` op een
    // niet-object gooit een TypeError en zou de hele missie laten crashen.
    if (typeof checklist !== 'object' || checklist === null || Array.isArray(checklist)) {
        return state;
    }
    const patch: Record<string, boolean> = {};
    for (const step of steps) {
        const lateKeys = step.checklistItems
            .filter((item) => item.addedLater)
            .map((item) => `${step.id}-${item.id}`);
        if (lateKeys.length === 0) continue;
        const missingLate = lateKeys.filter((key) => !(key in checklist));
        if (missingLate.length === 0) continue;
        const baseKeys = step.checklistItems
            .filter((item) => !item.addedLater)
            .map((item) => `${step.id}-${item.id}`);
        if (baseKeys.length === 0) continue;
        const baseComplete = baseKeys.every((key) => checklist[key] === true);
        if (!baseComplete) continue;
        for (const key of missingLate) patch[key] = true;
    }
    if (Object.keys(patch).length === 0) return state;
    // Stempel de versie mee: de grandfather geldt één keer, daarna is de save
    // een gewone actuele save.
    return {
        ...state,
        checklistVersion: CHECKLIST_SCHEMA_VERSION,
        checklist: { ...checklist, ...patch },
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
