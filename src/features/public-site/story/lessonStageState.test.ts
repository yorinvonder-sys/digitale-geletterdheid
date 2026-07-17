import assert from 'node:assert/strict';
import test from 'node:test';
import {
    INITIAL_LESSON_STAGE_STATE,
    activeStudentCount,
    lessonStageReducer,
} from './lessonStageState.ts';

test('the live class starts with 24 of 28 active students', () => {
    assert.equal(activeStudentCount(INITIAL_LESSON_STAGE_STATE), 24);
});

test('a student tile can be toggled in the live dashboard', () => {
    const activated = lessonStageReducer(INITIAL_LESSON_STAGE_STATE, {
        type: 'toggle-student',
        index: 24,
    });
    assert.equal(activeStudentCount(activated), 25);

    const deactivated = lessonStageReducer(activated, {
        type: 'toggle-student',
        index: 24,
    });
    assert.equal(activeStudentCount(deactivated), 24);
});

test('coach signals can be opened and resolved', () => {
    const viewed = lessonStageReducer(INITIAL_LESSON_STAGE_STATE, {
        type: 'view-signal',
        student: '14',
    });
    assert.equal(viewed.selectedStudent, '14');

    const helped = lessonStageReducer(viewed, { type: 'help-student' });
    assert.equal(helped.selectedStudent, '19');
    assert.equal(helped.studentHelped, true);
});
