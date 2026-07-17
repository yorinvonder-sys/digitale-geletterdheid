import assert from 'node:assert/strict';
import test from 'node:test';
import { gameSettingsFor } from './gameProgrammerState.ts';
import {
    GROUND_Y,
    OBSTACLE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_X,
    advancePlatformFrame,
    createInitialPlatformFrame,
    jumpPlatformPlayer,
    type PlatformFrame,
} from './platformGameEngine.ts';

test('the player jumps only while standing on the ground', () => {
    const frame = createInitialPlatformFrame();
    const jumped = jumpPlatformPlayer(frame, -500);
    const doubleJump = jumpPlatformPlayer(jumped, -500);

    assert.equal(jumped.velocityY, -500);
    assert.equal(doubleJump.velocityY, -500);
});

test('advancing a frame moves obstacles left and applies gravity', () => {
    const frame = jumpPlatformPlayer(createInitialPlatformFrame(), -500);
    const next = advancePlatformFrame(frame, 0.1, gameSettingsFor(null));

    assert.ok(next.obstacles[0].x < frame.obstacles[0].x);
    assert.ok(next.playerY < frame.playerY);
    assert.ok(next.velocityY > frame.velocityY);
});

test('passing an obstacle increments score only once', () => {
    const frame: PlatformFrame = {
        ...createInitialPlatformFrame(),
        obstacles: [{ id: 1, x: PLAYER_X - OBSTACLE_WIDTH - 2, height: 60, scored: false }],
    };
    const scored = advancePlatformFrame(frame, 0.01, gameSettingsFor(null));
    const repeated = advancePlatformFrame(scored, 0.01, gameSettingsFor(null));

    assert.equal(scored.score, 10);
    assert.equal(repeated.score, 10);
});

test('overlapping the player and an obstacle reports collision', () => {
    const frame: PlatformFrame = {
        ...createInitialPlatformFrame(),
        playerY: GROUND_Y - PLAYER_HEIGHT,
        obstacles: [{ id: 1, x: PLAYER_X + 4, height: 70, scored: false }],
    };
    const next = advancePlatformFrame(frame, 0.01, gameSettingsFor(null));

    assert.equal(next.collision, true);
});
