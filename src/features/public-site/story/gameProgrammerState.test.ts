import assert from 'node:assert/strict';
import test from 'node:test';
import {
    INITIAL_GAME_PROGRAMMER_STATE,
    gameProgrammerReducer,
    gameSettingsFor,
} from './gameProgrammerState.ts';

test('each authentic modification exposes the changed game variable', () => {
    const baseline = gameSettingsFor(null);

    assert.equal(gameSettingsFor('color').playerColor, '#5F947D');
    assert.ok(gameSettingsFor('jump').jumpForce < baseline.jumpForce);
    assert.ok(gameSettingsFor('speed').obstacleSpeed > baseline.obstacleSpeed);
});

test('selecting a modification resets a previous attempt', () => {
    const previous = {
        modification: 'color' as const,
        status: 'game-over' as const,
        score: 20,
        runId: 2,
    };
    const next = gameProgrammerReducer(previous, { type: 'select', modification: 'jump' });

    assert.equal(next.modification, 'jump');
    assert.equal(next.status, 'ready');
    assert.equal(next.score, 0);
});

test('start, game over and restart form a replayable flow', () => {
    const selected = gameProgrammerReducer(INITIAL_GAME_PROGRAMMER_STATE, {
        type: 'select',
        modification: 'speed',
    });
    const started = gameProgrammerReducer(selected, { type: 'start' });
    const ended = gameProgrammerReducer(started, { type: 'game-over', score: 30 });
    const restarted = gameProgrammerReducer(ended, { type: 'restart' });

    assert.equal(started.status, 'playing');
    assert.equal(ended.status, 'game-over');
    assert.equal(ended.score, 30);
    assert.equal(restarted.status, 'playing');
    assert.equal(restarted.score, 0);
    assert.equal(restarted.runId, started.runId + 1);
});
