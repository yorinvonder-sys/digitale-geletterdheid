import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('story landing keeps the complete lesson journey and public destinations', async () => {
    const source = await readFile(
        new URL('../ScholenLandingStory.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'id="lesverhaal"',
        '<GameProgrammerDemo',
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
        'GameProgrammerDemo',
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

test('mobile story content stays inside the viewport and dashboard controls are real buttons', async () => {
    const source = await readFile(
        new URL('../ScholenLandingStory.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'data-testid="hero-story-grid"',
        'data-testid="hero-proof-badge"',
        'left-3 right-3',
        '<TeacherActionDemo',
        'Bekijk leerling 14',
        'Help leerling 19',
        'aria-live="polite"',
    ]) {
        assert.ok(source.includes(expected), `expected story source to include ${expected}`);
    }

    assert.doesNotMatch(source, /border-b-\[0\.09em\]/);
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
