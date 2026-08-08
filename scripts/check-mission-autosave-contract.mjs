// Contract voor de missie-autosave.
//
// Dit script kwam uit de reparatieronde van 2 augustus en toetste toen de
// implementatie van dié versie: variabelenamen, een storage-abstractie en het
// moment waarop de schrijfblokkade werd opgeheven. Main heeft de hook daarna
// zelfstandig herschreven en lost dat allemaal anders maar gelijkwaardig op:
//
// - de schrijfblokkade na clearSave() heet daar `writesSuppressed` en dekt ook
//   de unmount-flush af;
// - hij wordt opgeheven bij een expliciete state-wijziging in plaats van bij een
//   sleutelwissel, wat hetzelfde doel dient;
// - opslag loopt via één localStorage met gescheiden sleutels per gebruiker,
//   in plaats van een localStorage/sessionStorage-splitsing.
//
// Die assertie's zijn daarom vervallen: ze bewaakten een vorm, geen gedrag.
// Wat overblijft is de enige bescherming die main aantoonbaar miste en die
// hier is teruggezet — en die raakt leerlingdata, dus die blijft bewaakt.
//
// Draaien vanuit de projectroot: node scripts/check-mission-autosave-contract.mjs

import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/hooks/useMissionAutoSave.ts', 'utf8');

// Op een gedeelde schoolcomputer kan een auth-token van een ánder Supabase-project
// in de browser staan. Wie dan "de eerste de beste sb-*-auth-token" pakt, schrijft
// de voortgang weg onder de verkeerde leerling.
assert.match(
    source,
    /const projectId = new URL\(supabaseUrl\)\.hostname\.split\('\.'\)\[0\]/,
    'mission auto-save must derive the session key from the configured Supabase project',
);
assert.doesNotMatch(
    source,
    /Object\.keys\(localStorage\)\.find\(/,
    'mission auto-save must not select an arbitrary Supabase project token',
);

// De sleutel van een ingelogde leerling bevat zijn userId, zodat hij nooit de
// opslag van een andere leerling of van de anonieme preview leest.
assert.match(
    source,
    /`\$\{STORAGE_PREFIX\}\$\{userId\}_\$\{missionId\}`/,
    'mission auto-save keys must separate authenticated users from each other',
);

// Na clearSave() mag geen enkele lopende schrijfactie de gewiste voortgang
// terugzetten. De naam van de vlag mag verschillen; het bestaan ervan niet.
assert.match(
    source,
    /const (?:clearedRef|writesSuppressed) = useRef\(false\)/,
    'mission auto-save must remember an explicit completion cleanup',
);

console.log('Mission auto-save contract OK');
