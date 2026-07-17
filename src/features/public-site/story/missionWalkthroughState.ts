export type MissionId = 'game' | 'website' | 'deepfake';

export type WalkthroughStep = 'choose' | 'briefing' | 'build' | 'proof';

export interface MissionWalkthroughState {
    mission: MissionId | null;
    step: WalkthroughStep;
    choices: Record<string, string>;
}

export type MissionWalkthroughAction =
    | { type: 'select-mission'; mission: MissionId }
    | { type: 'next' }
    | { type: 'previous' }
    | { type: 'go-to-step'; step: WalkthroughStep }
    | { type: 'set-choice'; key: string; value: string }
    | { type: 'reset' };

export const INITIAL_WALKTHROUGH_STATE: MissionWalkthroughState = {
    mission: null,
    step: 'choose',
    choices: {},
};

const ACTIVE_STEPS: readonly WalkthroughStep[] = ['briefing', 'build', 'proof'];

function adjacentStep(
    current: WalkthroughStep,
    direction: -1 | 1,
): WalkthroughStep {
    const currentIndex = ACTIVE_STEPS.indexOf(current);
    if (currentIndex === -1) return 'briefing';
    const nextIndex = Math.min(
        ACTIVE_STEPS.length - 1,
        Math.max(0, currentIndex + direction),
    );
    return ACTIVE_STEPS[nextIndex];
}

export function missionWalkthroughReducer(
    state: MissionWalkthroughState,
    action: MissionWalkthroughAction,
): MissionWalkthroughState {
    if (action.type === 'reset') return INITIAL_WALKTHROUGH_STATE;

    if (action.type === 'select-mission') {
        return {
            mission: action.mission,
            step: 'briefing',
            choices: {},
        };
    }

    if (!state.mission) return state;

    if (action.type === 'next') {
        return { ...state, step: adjacentStep(state.step, 1) };
    }

    if (action.type === 'previous') {
        return { ...state, step: adjacentStep(state.step, -1) };
    }

    if (action.type === 'go-to-step') {
        if (action.step === 'choose') return state;
        return { ...state, step: action.step };
    }

    return {
        ...state,
        choices: {
            ...state.choices,
            [action.key]: action.value,
        },
    };
}
