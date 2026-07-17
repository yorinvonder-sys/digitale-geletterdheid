import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
    INITIAL_MINI_MISSION_STATE,
    isWinningProgram,
    miniMissionReducer,
} from './miniMissionState.ts';

test('accepts at most three commands in selection order', () => {
    let state = miniMissionReducer(INITIAL_MINI_MISSION_STATE, { type: 'add', command: 'boost' });
    state = miniMissionReducer(state, { type: 'add', command: 'jump' });
    state = miniMissionReducer(state, { type: 'add', command: 'collect' });
    state = miniMissionReducer(state, { type: 'add', command: 'boost' });

    assert.deepEqual(state.commands, ['boost', 'jump', 'collect']);
});

test('marks the required program as successful when it runs', () => {
    const state = miniMissionReducer(
        { ...INITIAL_MINI_MISSION_STATE, commands: ['boost', 'jump', 'collect'] },
        { type: 'run' },
    );

    assert.equal(isWinningProgram(state.commands), true);
    assert.equal(state.result, 'success');
});

test('preserves an incorrect program for a retry and supports undo', () => {
    const failed = miniMissionReducer(
        { ...INITIAL_MINI_MISSION_STATE, commands: ['jump', 'boost', 'collect'] },
        { type: 'run' },
    );

    assert.equal(failed.result, 'retry');

    const corrected = miniMissionReducer(failed, { type: 'undo' });
    assert.deepEqual(corrected.commands, ['jump', 'boost']);
    assert.equal(corrected.result, 'idle');
});

test('mini mission exposes accessible controls and teacher evidence', async () => {
    const source = await readFile(
        new URL('./MiniMissionBuilder.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'Test mijn game',
        'Programma wissen',
        'aria-live="polite"',
        'Computational thinking',
        'SLO',
    ]) {
        assert.match(source, new RegExp(expected));
    }
});

test('story landing keeps the complete lesson journey and public destinations', async () => {
    const source = await readFile(
        new URL('../ScholenLandingStory.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'id="lesverhaal"',
        '<MiniMissionBuilder',
        'id="leerlingwerk"',
        'id="docentbewijs"',
        'id="schoolpilot"',
        "@/components/brand/DuckMark",
        'href="/pilot"',
        'href="/leerlingdemo"',
        'href="/docentdemo"',
        'reduceMotion',
    ]) {
        assert.match(source, new RegExp(expected));
    }
});

test('second preview integrates human classroom visuals and the guided mission route', async () => {
    const source = await readFile(
        new URL('../ScholenLandingStory.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'KeesNarrator',
        'MissionWalkthrough',
        '/assets/story/students-coding-dgskills.webp',
        '/assets/story/teacher-coaching-dgskills.webp',
        '/assets/story/students-presenting-dgskills.webp',
        'href="#missies"',
    ]) {
        assert.match(source, new RegExp(expected));
    }

    assert.doesNotMatch(source, /bottom-\[0\.06em\]/);
});

test('public route and critical shell render the new story homepage', async () => {
    const [router, shell] = await Promise.all([
        readFile(new URL('../../../app/AppRouter.tsx', import.meta.url), 'utf8'),
        readFile(new URL('../../../../index.html', import.meta.url), 'utf8'),
    ]);

    assert.match(router, /import \{ ScholenLandingStory \}/);
    assert.match(router, /<ScholenLandingStory \/>/);
    assert.match(shell, /Eén les\. Van eerste klik tot zichtbaar bewijs\./);
});
