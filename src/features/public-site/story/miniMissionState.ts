export type MissionCommand = 'boost' | 'jump' | 'collect';
export type MissionResult = 'idle' | 'success' | 'retry';

export interface MiniMissionState {
    commands: MissionCommand[];
    result: MissionResult;
    runId: number;
}

export const INITIAL_MINI_MISSION_STATE: MiniMissionState = {
    commands: [],
    result: 'idle',
    runId: 0,
};

export type MiniMissionAction =
    | { type: 'add'; command: MissionCommand }
    | { type: 'undo' }
    | { type: 'reset' }
    | { type: 'run' };

const WINNING_PROGRAM: MissionCommand[] = ['boost', 'jump', 'collect'];

export function isWinningProgram(commands: MissionCommand[]): boolean {
    return commands.length === WINNING_PROGRAM.length
        && commands.every((command, index) => command === WINNING_PROGRAM[index]);
}

export function miniMissionReducer(
    state: MiniMissionState,
    action: MiniMissionAction,
): MiniMissionState {
    if (action.type === 'reset') {
        return { ...INITIAL_MINI_MISSION_STATE };
    }

    if (action.type === 'undo') {
        return {
            ...state,
            commands: state.commands.slice(0, -1),
            result: 'idle',
        };
    }

    if (action.type === 'add') {
        if (state.commands.length >= 3) return state;
        return {
            ...state,
            commands: [...state.commands, action.command],
            result: 'idle',
        };
    }

    return {
        ...state,
        result: isWinningProgram(state.commands) ? 'success' : 'retry',
        runId: state.runId + 1,
    };
}
