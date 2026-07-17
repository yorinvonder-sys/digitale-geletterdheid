export type StalledStudent = 25 | 26 | 27 | 28;

export interface TeacherActionState {
    selectedStudent: StalledStudent | null;
    helpedStudent: StalledStudent | null;
}

export type TeacherAction =
    | { type: 'select'; student: StalledStudent }
    | { type: 'send-hint' }
    | { type: 'reset' };

export const INITIAL_TEACHER_ACTION_STATE: TeacherActionState = {
    selectedStudent: null,
    helpedStudent: null,
};

export function teacherActiveCount(state: TeacherActionState) {
    return state.helpedStudent === null ? 24 : 25;
}

export function teacherActionReducer(
    state: TeacherActionState,
    action: TeacherAction,
): TeacherActionState {
    switch (action.type) {
        case 'select':
            return { ...state, selectedStudent: action.student };
        case 'send-hint':
            if (state.selectedStudent === null || state.helpedStudent !== null) return state;
            return { ...state, helpedStudent: state.selectedStudent };
        case 'reset':
            return INITIAL_TEACHER_ACTION_STATE;
        default:
            return state;
    }
}
