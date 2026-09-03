import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

/**
 * Contract (gered uit PR #331): een debat-argument telt alleen mee wanneer de
 * leerling er een stakeholder-perspectief bij koos — argumenteren vanuit de
 * betrokkenen is de kern van de missie. De engine is een .tsx-bestand en dus
 * niet importeerbaar in deze runner; daarom pinnen we het criterium tekstueel,
 * op alle drie de plekken die hetzelfde moeten meten.
 */

test('de argumenttelling en de voortgangsindicator vereisen een gekozen stakeholder', async () => {
    const engine = await readFile(
        new URL('../src/features/missions/templates/debate-arena/DebateArena.tsx', import.meta.url),
        'utf8'
    );
    assert.match(
        engine,
        /!isMeaningfulAnswer\(arg\.claim\) \|\| !isMeaningfulAnswer\(arg\.evidence\) \|\| !arg\.stakeholderId/,
        'countDistinctArguments moet een stakeholder vereisen'
    );

    const arguePhase = await readFile(
        new URL('../src/features/missions/templates/debate-arena/sub/ArguePhase.tsx', import.meta.url),
        'utf8'
    );
    const eisen = arguePhase.match(/isMeaningfulAnswer\([a-zA-Z]+\.claim\) && isMeaningfulAnswer\([a-zA-Z]+\.evidence\) && Boolean\([a-zA-Z]+\.stakeholderId\)/g) ?? [];
    assert.ok(eisen.length >= 2, `teller én indicator moeten de stakeholder-eis dragen (gevonden: ${eisen.length})`);
});
