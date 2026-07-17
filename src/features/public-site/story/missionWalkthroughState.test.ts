import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
    INITIAL_WALKTHROUGH_STATE,
    missionWalkthroughReducer,
} from './missionWalkthroughState.ts';

test('selecting a mission opens its briefing', () => {
    const state = missionWalkthroughReducer(INITIAL_WALKTHROUGH_STATE, {
        type: 'select-mission',
        mission: 'website',
    });

    assert.deepEqual(state, {
        mission: 'website',
        step: 'briefing',
        choices: {},
    });
});

test('next and previous stay within the walkthrough bounds', () => {
    const selected = missionWalkthroughReducer(INITIAL_WALKTHROUGH_STATE, {
        type: 'select-mission',
        mission: 'game',
    });
    const build = missionWalkthroughReducer(selected, { type: 'next' });
    const proof = missionWalkthroughReducer(build, { type: 'next' });
    const afterProof = missionWalkthroughReducer(proof, { type: 'next' });

    assert.equal(build.step, 'build');
    assert.equal(proof.step, 'proof');
    assert.equal(afterProof.step, 'proof');

    const backToBuild = missionWalkthroughReducer(proof, { type: 'previous' });
    const backToBriefing = missionWalkthroughReducer(backToBuild, { type: 'previous' });
    const beforeBriefing = missionWalkthroughReducer(backToBriefing, { type: 'previous' });

    assert.equal(backToBuild.step, 'build');
    assert.equal(backToBriefing.step, 'briefing');
    assert.equal(beforeBriefing.step, 'briefing');
});

test('direct step navigation requires a selected mission', () => {
    const ignored = missionWalkthroughReducer(INITIAL_WALKTHROUGH_STATE, {
        type: 'go-to-step',
        step: 'proof',
    });
    assert.equal(ignored.step, 'choose');

    const selected = missionWalkthroughReducer(INITIAL_WALKTHROUGH_STATE, {
        type: 'select-mission',
        mission: 'deepfake',
    });
    const proof = missionWalkthroughReducer(selected, {
        type: 'go-to-step',
        step: 'proof',
    });
    assert.equal(proof.step, 'proof');
});

test('selecting another mission resets its stage and choices', () => {
    let state = missionWalkthroughReducer(INITIAL_WALKTHROUGH_STATE, {
        type: 'select-mission',
        mission: 'game',
    });
    state = missionWalkthroughReducer(state, {
        type: 'set-choice',
        key: 'route',
        value: 'boost',
    });
    state = missionWalkthroughReducer(state, { type: 'next' });
    state = missionWalkthroughReducer(state, {
        type: 'select-mission',
        mission: 'website',
    });

    assert.deepEqual(state, {
        mission: 'website',
        step: 'briefing',
        choices: {},
    });
});

test('mascot is limited to the two official logos and one purposeful assignment guide', async () => {
    const [story, walkthrough, guide, game] = await Promise.all([
        readFile(new URL('../ScholenLandingStory.tsx', import.meta.url), 'utf8'),
        readFile(new URL('./MissionWalkthrough.tsx', import.meta.url), 'utf8'),
        readFile(new URL('./AssignmentGuide.tsx', import.meta.url), 'utf8'),
        readFile(new URL('./GameProgrammerDemo.tsx', import.meta.url), 'utf8'),
    ]);

    assert.equal((story.match(/<DuckMark/g) ?? []).length, 2);
    assert.doesNotMatch(story, /KeesNarrator/);
    assert.doesNotMatch(walkthrough, /KeesNarrator|DuckMark/);
    assert.match(guide, /\/assets\/story\/assignment-guide-kees\.webp/);
    assert.match(guide, /aria-live=/);
    assert.equal((game.match(/<AssignmentGuide/g) ?? []).length, 1);
});

test('mission walkthrough exposes three missions and explicit step navigation', async () => {
    const source = await readFile(
        new URL('./MissionWalkthrough.tsx', import.meta.url),
        'utf8',
    );

    for (const expected of [
        'Game Programmeur',
        'Website Bouwer',
        'Deepfake Detector',
        'aria-current',
        'aria-live',
        'Vorige stap',
        'Volgende stap',
        'href="#probeer-het"',
    ]) {
        assert.match(source, new RegExp(expected));
    }

    assert.doesNotMatch(source, /localStorage|fetch\(|generated_images/);
});
