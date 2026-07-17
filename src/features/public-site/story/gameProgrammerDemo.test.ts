import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('game programmer demo represents the authentic assignment and is replayable', async () => {
    const [componentSource, stateSource, playfieldSource] = await Promise.all([
        readFile(new URL('./GameProgrammerDemo.tsx', import.meta.url), 'utf8'),
        readFile(new URL('./gameProgrammerState.ts', import.meta.url), 'utf8'),
        readFile(new URL('./PlatformGame.tsx', import.meta.url), 'utf8'),
    ]);
    const source = `${componentSource}\n${stateSource}\n${playfieldSource}`;

    for (const expected of [
        'Speler groen',
        'Hoger springen',
        'Snellere obstakels',
        'Start mijn game',
        'Speel opnieuw',
        'Kies andere wijziging',
        'Game Programmeur',
        '<PlatformGame',
    ]) {
        assert.ok(source.includes(expected), `expected GameProgrammerDemo to include ${expected}`);
    }

    assert.doesNotMatch(source, /game_programmeur_new\.webp|CODEWERELD|DuckMark/);
});

test('platform game supports touch, click and focused space controls', async () => {
    const source = await readFile(new URL('./PlatformGame.tsx', import.meta.url), 'utf8');

    for (const expected of [
        'Tik of druk op spatie om te springen',
        'aria-keyshortcuts="Space"',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'Game over',
        'onPointerDown',
        'onKeyDown',
        '<svg',
    ]) {
        assert.ok(source.includes(expected), `expected PlatformGame to include ${expected}`);
    }
});

test('story page renders the new game programmer demo instead of the command sequence mini mission', async () => {
    const source = await readFile(new URL('../ScholenLandingStory.tsx', import.meta.url), 'utf8');

    assert.match(source, /import \{ GameProgrammerDemo \}/);
    assert.match(source, /<GameProgrammerDemo \/>/);
    assert.doesNotMatch(source, /MiniMissionBuilder/);
});
