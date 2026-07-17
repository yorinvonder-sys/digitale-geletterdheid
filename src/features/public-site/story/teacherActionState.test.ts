import assert from 'node:assert/strict';
import test from 'node:test';
import {
    INITIAL_TEACHER_ACTION_STATE,
    teacherActionReducer,
    teacherActiveCount,
} from './teacherActionState.ts';

test('selects a stalled student who needs teacher attention', () => {
    const selected = teacherActionReducer(INITIAL_TEACHER_ACTION_STATE, {
        type: 'select',
        student: 25,
    });

    assert.equal(selected.selectedStudent, 25);
    assert.equal(selected.helpedStudent, null);
});

test('sends one hint and increments the active count only once', () => {
    const selected = teacherActionReducer(INITIAL_TEACHER_ACTION_STATE, {
        type: 'select',
        student: 25,
    });
    const helped = teacherActionReducer(selected, { type: 'send-hint' });
    const repeated = teacherActionReducer(helped, { type: 'send-hint' });

    assert.equal(helped.helpedStudent, 25);
    assert.equal(teacherActiveCount(helped), 25);
    assert.equal(teacherActiveCount(repeated), 25);
});

test('selecting another stalled student after helping keeps the completed action', () => {
    const helped = teacherActionReducer(
        { selectedStudent: 25, helpedStudent: null },
        { type: 'send-hint' },
    );
    const selected = teacherActionReducer(helped, { type: 'select', student: 26 });

    assert.equal(selected.selectedStudent, 26);
    assert.equal(selected.helpedStudent, 25);
});

test('reset restores the 24 of 28 starting state', () => {
    const reset = teacherActionReducer(
        { selectedStudent: 25, helpedStudent: 25 },
        { type: 'reset' },
    );

    assert.deepEqual(reset, INITIAL_TEACHER_ACTION_STATE);
    assert.equal(teacherActiveCount(reset), 24);
});
