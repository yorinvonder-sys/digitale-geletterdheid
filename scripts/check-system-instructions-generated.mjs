// Bewaakt dat supabase/functions/_shared/systemInstructions.ts nog gelijk is aan
// wat scripts/generate-system-instructions.mjs oplevert.
//
// Zonder deze stap kan iemand het gegenereerde bestand met de hand bijwerken —
// precies de situatie waar de duplicatie uit ontstond: de rolinstructie in
// src/config/agents/ en de tekst die de leerling werkelijk krijgt liepen uiteen,
// en niemand zag het.
//
// Draaien vanuit de projectroot: node scripts/check-system-instructions-generated.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSystemInstructionsFile, OUTPUT_PATH } from './generate-system-instructions.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const verwacht = buildSystemInstructionsFile();
const aanwezig = readFileSync(join(ROOT, OUTPUT_PATH), 'utf8');

if (verwacht === aanwezig) {
    const aantal = aanwezig.match(/^  "/gm)?.length ?? 0;
    console.log(`Systeeminstructies: ${OUTPUT_PATH} is gelijk aan de generator (${aantal} rollen).`);
    process.exit(0);
}

// Wijs de rollen aan die verschillen, anders staat de lezer voor een diff van
// een half megabyte zonder aanknopingspunt.
const rollen = (tekst) => {
    const kaart = new Map();
    for (const treffer of tekst.matchAll(/^ {2}"([^"]+)": ("(?:[^"\\]|\\.)*"),?$/gm)) {
        kaart.set(treffer[1], treffer[2]);
    }
    return kaart;
};
const a = rollen(aanwezig);
const b = rollen(verwacht);
const ontbreekt = [...b.keys()].filter((id) => !a.has(id));
const teveel = [...a.keys()].filter((id) => !b.has(id));
const anders = [...b.keys()].filter((id) => a.has(id) && a.get(id) !== b.get(id));

console.error(`${OUTPUT_PATH} loopt niet meer gelijk met src/config/agents/.`);
if (ontbreekt.length) console.error(`  ontbreekt in het bestand: ${ontbreekt.join(', ')}`);
if (teveel.length) console.error(`  staat er te veel in: ${teveel.join(', ')}`);
if (anders.length) console.error(`  andere instructie: ${anders.join(', ')}`);
if (!ontbreekt.length && !teveel.length && !anders.length) {
    console.error('  de rollen kloppen, maar de omliggende tekst van het bestand wijkt af.');
}
console.error('\nHerstel met: node scripts/generate-system-instructions.mjs');
console.error('Bewerk het gegenereerde bestand niet met de hand — pas de rolinstructie aan in src/config/agents/.');
process.exit(1);
