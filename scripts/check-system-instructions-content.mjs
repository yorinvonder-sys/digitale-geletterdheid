// Laadt het gegenereerde serverbestand écht en controleert wat er per rol uitkomt.
//
// Waarom apart van check-system-instructions-generated.mjs: die vergelijkt tekst
// met de generator en bewijst dus niets over de inhoud. Deze test importeert
// supabase/functions/_shared/systemInstructions.ts zoals de edge function dat
// doet, en toetst per rol wat de leerling werkelijk zou krijgen. Het bestand valt
// buiten tsconfig.app.json en wordt dus niet meegetypecheckt; zonder deze stap
// zou een kapot of leeg bestand pas in productie opvallen.
//
// Draaien vanuit de projectroot:
//     node --experimental-strip-types scripts/check-system-instructions-content.mjs

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BESTAND = join(ROOT, 'supabase/functions/_shared/systemInstructions.ts');

const { getSystemInstruction, isValidRoleId } = await import(pathToFileURL(BESTAND).href);

// De rol-id's uit het bestand zelf, zodat een rol die stilletjes wegvalt hier
// niet ongemerkt buiten de controle blijft.
const bron = readFileSync(BESTAND, 'utf8');
const rolIds = [...bron.matchAll(/^ {2}"([^"]+)": "/gm)].map((m) => m[1]);

assert.ok(rolIds.length >= 90, `verwacht minstens 90 rollen, gevonden ${rolIds.length}`);
assert.equal(new Set(rolIds).size, rolIds.length, 'geen enkel rol-id mag dubbel voorkomen');

// Het welzijnsprotocol vertelt de AI wat te doen bij signalen van
// zelfbeschadiging, huiselijk geweld of ernstig pesten. Dat hoort bij elke rol.
const WELZIJN_KOP = '### WELZIJNSPROTOCOL (KRITIEK!)';
const HULPLIJNEN = ['Kindertelefoon: 0800-0432', '113 Zelfmoordpreventie', 'Veilig Thuis: 0800-2000'];

for (const rolId of rolIds) {
    const instructie = getSystemInstruction(rolId);
    assert.equal(typeof instructie, 'string', `${rolId}: geen instructie gevonden`);
    assert.ok(instructie.trim().length > 0, `${rolId}: lege instructie`);
    assert.ok(isValidRoleId(rolId), `${rolId}: wordt niet als geldige rol herkend`);

    // Meer dan alleen de staart: er moet een eigen rolinstructie vóór staan.
    const kopIndex = instructie.indexOf(WELZIJN_KOP);
    assert.notEqual(kopIndex, -1, `${rolId}: mist het welzijnsprotocol`);
    for (const hulplijn of HULPLIJNEN) {
        assert.ok(instructie.includes(hulplijn), `${rolId}: welzijnsprotocol mist "${hulplijn}"`);
    }

    const eigenTekst = instructie.slice(0, instructie.indexOf('\n\nALGEMENE REGELS:') === -1 ? kopIndex : instructie.indexOf('\n\nALGEMENE REGELS:'));
    assert.ok(eigenTekst.trim().length > 100, `${rolId}: eigen rolinstructie is verdacht kort (${eigenTekst.trim().length} tekens)`);

    // Elke rol krijgt de algemene regels en de XP-farmingdetectie.
    assert.match(instructie, /ALGEMENE REGELS:/, `${rolId}: mist de algemene regels`);
    assert.match(instructie, /XP FARMING DETECTIE/, `${rolId}: mist de XP-farmingdetectie`);
}

// De terugvalrol van elke sjabloonchat moet bestaan, anders valt de AI-hulp in
// DataViewer, BuilderCanvas en ReviewArena stil.
assert.ok(isValidRoleId('student-assistant'), 'student-assistant is de terugvalrol en moet bestaan');
assert.equal(getSystemInstruction('bestaat-niet-12345'), null, 'een onbekend rol-id hoort null te geven');

console.log(`Systeeminstructies: ${rolIds.length} rollen leveren een geldige instructie met welzijnsprotocol.`);
