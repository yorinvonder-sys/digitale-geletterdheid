import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { registerInspectorHotspot } from '../src/features/assessment/inspectorProgress.ts';

const read = (path: string) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('inspector progress requires every distinct correct hotspot', () => {
    const task = {
        hotspots: [
            { id: 'first', correct: true },
            { id: 'second', correct: true },
            { id: 'wrong', correct: false },
        ],
    };
    const first = registerInspectorHotspot(task, [], task.hotspots[0]);
    assert.equal(first.correctCount, 1);
    assert.equal(first.isComplete, false);

    const duplicate = registerInspectorHotspot(task, first.foundCorrectIds, task.hotspots[0]);
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.correctCount, 1);
    assert.equal(duplicate.isComplete, false);

    const complete = registerInspectorHotspot(task, duplicate.foundCorrectIds, task.hotspots[1]);
    assert.equal(complete.correctCount, 2);
    assert.equal(complete.isComplete, true);
});

test('J3 inspector prompts name all required findings', () => {
    const p1 = read('src/features/assessment/data/j3p1Assessment.ts');
    const p2 = read('src/features/assessment/data/j3p2Assessment.ts');
    const p4 = read('src/features/assessment/data/j3p4Assessment.ts');
    assert.match(p1, /Klik op beide fouten/);
    assert.match(p2, /Klik op alle drie de rode vlaggen/);
    assert.match(p2, /Klik op alle drie de kwetsbaarheden/);
    assert.match(p4, /Klik op alle drie de problemen/);
});

test('inspector progress copy stays neutral across finding types', () => {
    const inspector = read('src/features/assessment/InspectorTask.tsx');
    assert.match(inspector, /Dit onderdeel had je al gevonden/);
    assert.match(inspector, /onderdeel\$\{progress\.requiredCorrect === 1 \? '' : 'en'\} gevonden/);
    assert.doesNotMatch(inspector, /progress\.correctCount[^\n]*fouten gevonden/);
});

test('J3 roles are registered in the correct year and once', () => {
    const year1 = read('src/config/agents/year1.tsx');
    const year3 = read('src/config/agents/year3.tsx');
    const ids = read('src/config/agentRoleIds.ts');
    const roleTypes = read('src/types.ts');
    assert.doesNotMatch(year1, /id: 'startup-pitch'/);
    assert.equal((year3.match(/id: 'startup-pitch'/g) ?? []).length, 1);
    assert.equal((year3.match(/id: 'welzijnsonderzoeker'/g) ?? []).length, 1);
    assert.equal((ids.match(/'welzijnsonderzoeker'/g) ?? []).length, 1);
    const j3p3 = roleTypes.split('// Leerjaar 3 - Periode 3: Maatschappelijke Impact')[1].split('// Leerjaar 3 - Periode 4')[0];
    assert.match(j3p3, /'startup-pitch'/);
    assert.match(j3p3, /'welzijnsonderzoeker'/);
    assert.match(year3, /14 jaar[\s\S]*synthetische, geanonimiseerde/);
});

test('mission builders put J3 reviews last and keep J1/J2 review-first', () => {
    const source = read('src/utils/missionBuilder.tsx');
    assert.match(source, /yearGroup === 3\s*\? \[\.\.\.periodConfig\.missions, \.\.\.reviewMissionIds\]/);
    assert.match(source, /yearGroup === 3\s*\? \[\.\.\.mainMissionIds, \.\.\.reviewMissionIds\]/);
    assert.match(source, /:\s*\[\.\.\.reviewMissionIds, \.\.\.periodConfig\.missions\]/);
    assert.match(source, /:\s*\[\.\.\.reviewMissionIds, \.\.\.mainMissionIds\]/);
    assert.match(source, /if \(!isReview\) missionNum\+\+/);
    assert.match(source, /number: isReview \? 'Review'/);
});
