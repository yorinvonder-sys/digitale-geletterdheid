import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

/**
 * `src/config/slo-kerndoelen-mapping.ts` is de autoritatieve bron voor welke SLO-
 * kerndoelen bij een missie horen; het leerlingdashboard toont diezelfde codes.
 * Liepen ze uit elkaar, dan claimt het dashboard kerndoelen die de rapportage
 * niet kent. Beide bestanden worden als tekst gelezen — de mapping importeert
 * `@/types` en is daardoor niet rechtstreeks door de testrunner te laden.
 */
const mapping = readFileSync(new URL('../src/config/slo-kerndoelen-mapping.ts', import.meta.url), 'utf8');
const dashboard = readFileSync(new URL('../src/features/student/ProjectZeroDashboard.tsx', import.meta.url), 'utf8');

/** Leest de codes van één array-veld uit het stuk tekst dat bij deze missie hoort. */
function codes(block: string, field: 'sloKerndoelen' | 'sloVsoKerndoelen'): string[] {
    const match = new RegExp(`${field}: \\[([^\\]]*)\\]`).exec(block);
    if (!match) return [];
    return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/** De regel of het item waarin deze missie in dit bestand staat beschreven. */
function entry(source: string, missionId: string): string {
    const start = source.indexOf(`id: '${missionId}'`);
    assert.ok(start >= 0, `missie '${missionId}' niet gevonden`);
    const end = source.indexOf('\n', start);
    return source.slice(start, end === -1 ? undefined : end);
}

for (const missionId of ['data-detective', 'datalekken-rampenplan']) {
    test(`dashboard toont voor '${missionId}' exact de SLO-kerndoelen uit de mapping`, () => {
        const expected = entry(mapping, missionId);
        const actual = entry(dashboard, missionId);

        assert.deepEqual(codes(actual, 'sloKerndoelen'), codes(expected, 'sloKerndoelen'));
        assert.deepEqual(codes(actual, 'sloVsoKerndoelen'), codes(expected, 'sloVsoKerndoelen'));
        assert.ok(codes(expected, 'sloKerndoelen').length > 0, 'mapping mist reguliere kerndoelen');
        assert.ok(codes(expected, 'sloVsoKerndoelen').length > 0, 'mapping mist VSO-kerndoelen');
    });
}
