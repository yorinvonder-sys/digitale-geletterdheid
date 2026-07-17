export type CoachStudent = '14' | '19';

export interface LessonStageState {
    activeStudents: ReadonlyArray<boolean>;
    selectedStudent: CoachStudent | null;
    studentHelped: boolean;
}

export type LessonStageAction =
    | { type: 'toggle-student'; index: number }
    | { type: 'view-signal'; student: CoachStudent }
    | { type: 'help-student' };

export const INITIAL_LESSON_STAGE_STATE: LessonStageState = {
    activeStudents: Array.from({ length: 28 }, (_, index) => index < 24),
    selectedStudent: null,
    studentHelped: false,
};

export function activeStudentCount(state: LessonStageState) {
    return state.activeStudents.filter(Boolean).length;
}

export function lessonStageReducer(
    state: LessonStageState,
    action: LessonStageAction,
): LessonStageState {
    switch (action.type) {
        case 'toggle-student':
            if (action.index < 0 || action.index >= state.activeStudents.length) return state;
            return {
                ...state,
                activeStudents: state.activeStudents.map((isActive, index) => (
                    index === action.index ? !isActive : isActive
                )),
            };
        case 'view-signal':
            return { ...state, selectedStudent: action.student };
        case 'help-student':
            return { ...state, selectedStudent: '19', studentHelped: true };
        default:
            return state;
    }
}
