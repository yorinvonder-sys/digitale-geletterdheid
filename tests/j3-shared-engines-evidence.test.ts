import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { migrateBuilderEvidenceState } from '../src/features/missions/templates/builder-canvas/sub/types.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const dataViewerConfigs = [
    'ml-trainer',
    'neural-navigator',
    'data-pipeline',
    'digital-divide-researcher',
    'tech-impact-analyst',
    'research-project',
    'welzijnsonderzoeker',
];

const builderConfigs = [
    'api-architect',
    'open-source-contributor',
    'startup-simulator',
    'innovation-lab',
    'portfolio-builder',
    'prototype-developer',
    'pitch-perfect',
    'meesterproef',
];

test('J3 DataViewer-datasets hebben expliciete, eerlijke provenance', () => {
    for (const mission of dataViewerConfigs) {
        const source = read(`src/features/missions/templates/data-viewer/configs/${mission}.ts`);
        assert.equal((source.match(/source:\s*\{/g) ?? []).length, 3, `${mission} moet drie bronnen hebben`);
        assert.equal((source.match(/kind:\s*'(?:synthetic|external)'/g) ?? []).length, 3);
        assert.match(source, /methodNote:/, `${mission} beschrijft de beperking/methode`);
    }
});

test('DataViewer rendert provenance veilig en optioneel', () => {
    const source = read('src/features/missions/templates/data-viewer/DataViewer.tsx');
    assert.match(source, /export interface DatasetSource/);
    assert.match(source, /source\?: DatasetSource/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noopener noreferrer"/);
});

test('Builder evidence is apart opgeslagen, zichtbaar en blokkeert completion', () => {
    const engine = read('src/features/missions/templates/builder-canvas/BuilderCanvas.tsx');
    const state = read('src/features/missions/templates/builder-canvas/sub/types.ts');
    const panel = read('src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx');
    const preview = read('src/features/missions/templates/builder-canvas/sub/PreviewPanel.tsx');

    assert.match(state, /evidenceEntries: Record<string, string>/);
    assert.match(engine, /evidence\?:/);
    assert.match(engine, /evidenceComplete/);
    assert.match(engine, /evidenceEntries/);
    assert.match(panel, /evidence-\$\{stepData\.id\}/);
    assert.match(panel, /const evidenceQualityHint = evidenceRequirement \? answerQualityHint\(evidenceText\) : null/);
    assert.match(panel, /Vul geen namen, contactgegevens/);
    assert.match(preview, /Bewijs voortgang/);
});

test('Alle acht toegewezen Builder-configs hebben minimaal één evidence gate', () => {
    for (const mission of builderConfigs) {
        const source = read(`src/features/missions/templates/builder-canvas/configs/${mission}.ts`);
        assert.match(source, /evidence:\s*\{/, `${mission} is niet op evidence aangesloten`);
    }
});

test('Builder restore-migratie rolt alleen oude evidence-completion terug', () => {
    const state = {
        phase: 'results' as const,
        currentStep: 2,
        checklist: { 'step-a-check': true },
        textEntries: { 'step-a': 'bestaande uitwerking' },
        evidenceEntries: {},
        completedSteps: ['step-a', 'step-b', 'step-c'],
        reflectionAnswered: { 'step-b': true },
        reflectionCorrect: { 'step-b': true },
        showMilestone: false,
    };
    const migrated = migrateBuilderEvidenceState(state, [
        { id: 'step-a' },
        { id: 'step-b', evidence: { minLength: 40 } },
        { id: 'step-c', evidence: { minLength: 40 } },
    ]);

    assert.equal(migrated.phase, 'building');
    assert.equal(migrated.currentStep, 1);
    assert.deepEqual(migrated.completedSteps, ['step-a']);
    assert.deepEqual(migrated.textEntries, state.textEntries);
    assert.deepEqual(migrated.evidenceEntries, state.evidenceEntries);
    assert.deepEqual(migrated.reflectionAnswered, {});
    assert.deepEqual(migrated.reflectionCorrect, {});
});

test('Builder restore-migratie laat evidence-vrije J1/J2-stappen ongemoeid', () => {
    const state = {
        phase: 'results' as const,
        currentStep: 1,
        checklist: {},
        textEntries: {},
        evidenceEntries: {},
        completedSteps: ['legacy-step'],
        reflectionAnswered: {},
        reflectionCorrect: {},
        showMilestone: false,
    };
    assert.deepEqual(
        migrateBuilderEvidenceState(state, [{ id: 'legacy-step' }]),
        state,
    );
});
