import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const dataViewerConfigs = [
    'ml-trainer',
    'neural-navigator',
    'data-pipeline',
    'digital-divide-researcher',
    'tech-impact-analyst',
    'research-project',
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
    assert.match(preview, /<textarea/);
    assert.match(preview, /onEvidenceChange/);
});

test('Alle acht toegewezen Builder-configs hebben minimaal één evidence gate', () => {
    for (const mission of builderConfigs) {
        const source = read(`src/features/missions/templates/builder-canvas/configs/${mission}.ts`);
        assert.match(source, /evidence:\s*\{/, `${mission} is niet op evidence aangesloten`);
    }
});
