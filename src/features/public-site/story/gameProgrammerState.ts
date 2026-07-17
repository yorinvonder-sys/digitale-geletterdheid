export type GameModification = 'color' | 'jump' | 'speed';
export type GameStatus = 'ready' | 'playing' | 'game-over';

export interface GameSettings {
    playerColor: string;
    jumpForce: number;
    obstacleSpeed: number;
}

export interface GameProgrammerState {
    modification: GameModification | null;
    status: GameStatus;
    score: number;
    runId: number;
}

export type GameProgrammerAction =
    | { type: 'select'; modification: GameModification }
    | { type: 'start' }
    | { type: 'game-over'; score: number }
    | { type: 'restart' }
    | { type: 'reset' };

export const INITIAL_GAME_PROGRAMMER_STATE: GameProgrammerState = {
    modification: null,
    status: 'ready',
    score: 0,
    runId: 0,
};

const BASE_SETTINGS: GameSettings = {
    playerColor: '#FF3C21',
    jumpForce: -500,
    obstacleSpeed: 150,
};

export const MODIFICATION_DETAILS: Record<GameModification, {
    label: string;
    variable: 'playerColor' | 'jumpForce' | 'obstacleSpeed';
    value: string;
    effect: string;
}> = {
    color: {
        label: 'Speler groen',
        variable: 'playerColor',
        value: "'#5F947D'",
        effect: 'De speler verandert direct van rood naar groen.',
    },
    jump: {
        label: 'Hoger springen',
        variable: 'jumpForce',
        value: '-620',
        effect: 'Een krachtigere negatieve waarde laat de speler hoger springen.',
    },
    speed: {
        label: 'Snellere obstakels',
        variable: 'obstacleSpeed',
        value: '220',
        effect: 'De pijpen bewegen sneller en maken het spel moeilijker.',
    },
};

export function gameSettingsFor(modification: GameModification | null): GameSettings {
    if (modification === 'color') return { ...BASE_SETTINGS, playerColor: '#5F947D' };
    if (modification === 'jump') return { ...BASE_SETTINGS, jumpForce: -620 };
    if (modification === 'speed') return { ...BASE_SETTINGS, obstacleSpeed: 220 };
    return { ...BASE_SETTINGS };
}

export function gameProgrammerReducer(
    state: GameProgrammerState,
    action: GameProgrammerAction,
): GameProgrammerState {
    switch (action.type) {
        case 'select':
            return {
                modification: action.modification,
                status: 'ready',
                score: 0,
                runId: state.runId,
            };
        case 'start':
            if (!state.modification) return state;
            return { ...state, status: 'playing', score: 0, runId: state.runId + 1 };
        case 'game-over':
            if (state.status !== 'playing') return state;
            return { ...state, status: 'game-over', score: action.score };
        case 'restart':
            if (!state.modification) return state;
            return { ...state, status: 'playing', score: 0, runId: state.runId + 1 };
        case 'reset':
            return { ...INITIAL_GAME_PROGRAMMER_STATE, runId: state.runId };
        default:
            return state;
    }
}
