import assert from 'node:assert/strict';
import test from 'node:test';

import {
    migrateBuilderChecklistState,
    type BuilderCanvasState,
} from '../src/features/missions/templates/builder-canvas/sub/types.ts';

/**
 * Contract: checklistitems die ná een opgeslagen sessie aan een stap zijn
 * toegevoegd (zoals de portretrecht-regel in mission-vision, meme-machine en
 * video-editor) mogen bestaande voortgang niet blokkeren. Wie onder de oude
 * regels alles had afgevinkt, krijgt het nieuwe item bij herstel aangevinkt;
 * al het andere blijft exact zoals de leerling het achterliet.
 */

const STEPS = [
    {
        id: 'moodboard',
        checklistItems: [
            { id: 'beelden' },
            { id: 'kleuren' },
            { id: 'gevoel' },
            { id: 'link-geplakt' },
            { id: 'portretrecht', addedLater: true }, // toegevoegd ná bestaande saves
        ],
    },
];

function makeState(checklist: Record<string, boolean>): BuilderCanvasState {
    return {
        phase: 'building',
        currentStep: 0,
        checklist,
        textEntries: {},
        evidenceEntries: {},
        completedSteps: [],
        reflectionAnswered: {},
        reflectionCorrect: {},
        showMilestone: false,
    };
}

test('oude save met alle toenmalige items afgevinkt krijgt het nieuwe item cadeau', () => {
    const state = makeState({
        'moodboard-beelden': true,
        'moodboard-kleuren': true,
        'moodboard-gevoel': true,
        'moodboard-link-geplakt': true,
        // 'moodboard-portretrecht' bestond nog niet toen deze save werd gemaakt
    });
    const migrated = migrateBuilderChecklistState(state, STEPS);
    assert.equal(migrated.checklist['moodboard-portretrecht'], true);
});

test('half-ingevulde save blijft ongemoeid', () => {
    const state = makeState({
        'moodboard-beelden': true,
        'moodboard-kleuren': true,
        // gevoel en link-geplakt nooit aangeraakt, portretrecht ook niet
    });
    const migrated = migrateBuilderChecklistState(state, STEPS);
    assert.equal(migrated, state);
});

test('verse run zonder enige vink blijft ongemoeid', () => {
    const state = makeState({});
    const migrated = migrateBuilderChecklistState(state, STEPS);
    assert.equal(migrated, state);
});

test('een expliciet uitgevinkt item wordt nooit automatisch aangevinkt', () => {
    const state = makeState({
        'moodboard-beelden': true,
        'moodboard-kleuren': true,
        'moodboard-gevoel': true,
        'moodboard-link-geplakt': true,
        'moodboard-portretrecht': false, // leerling vinkte hem bewust uit
    });
    const migrated = migrateBuilderChecklistState(state, STEPS);
    assert.equal(migrated.checklist['moodboard-portretrecht'], false);
});
