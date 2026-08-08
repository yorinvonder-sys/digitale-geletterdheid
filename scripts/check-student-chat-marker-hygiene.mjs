// Gedragstest: interne stap-markeringen horen niet in beeld bij de leerling,
// en de sjabloon-opdrachten mogen er niet meer om vragen.
//
// De gedeelde systeeminstructie droeg het model op `---STEP_COMPLETE:X---` te
// sturen, met de belofte "De marker is ONZICHTBAAR voor de leerling (wordt later
// verwijderd)". Dat gold voor de oude AiLab-route en voor ChatBubble, maar niet
// voor StudentAIChat: die rendert het modelantwoord rechtstreeks. Een leerling
// kon de markering dus letterlijk in zijn chat zien staan.
//
// Draaien vanuit de projectroot: node scripts/check-student-chat-marker-hygiene.mjs

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const { stripInternalMarkers, cleanInstructionText } = await import(
    pathToFileURL('src/features/ai-chat/instructionText.ts').href
);

// 1. De filter doet wat hij moet doen.
const metMarker = 'Goed gedaan! Je pagina staat.\n---STEP_COMPLETE:2---\nZullen we de kleuren doen?';
const zichtbaar = stripInternalMarkers(metMarker);

assert.doesNotMatch(zichtbaar, /STEP_COMPLETE/, 'de markering mag niet in beeld blijven');
assert.doesNotMatch(zichtbaar, /---/, 'er mag geen streepjesrestant achterblijven');
assert.match(zichtbaar, /Goed gedaan! Je pagina staat\./, 'de tekst vóór de markering blijft');
assert.match(zichtbaar, /Zullen we de kleuren doen\?/, 'de tekst ná de markering blijft');
assert.doesNotMatch(zichtbaar, /\n{3,}/, 'geen gat van lege regels waar de markering stond');

// Meerdere markeringen in één bericht mogen ook allemaal weg.
assert.doesNotMatch(
    stripInternalMarkers('Stap een klaar ---STEP_COMPLETE:1--- en stap twee ook ---STEP_COMPLETE:2--- top!'),
    /STEP_COMPLETE/,
    'ook meerdere markeringen in één bericht moeten verdwijnen'
);

// 2. De filter is bewust SMALLER dan cleanInstructionText: die verwijdert ook
// [TITLE]- en [PAGE]-tags, en juist de webbouw-opdrachten leren leerlingen wat
// zulke tags zijn. Zou StudentAIChat de brede opschoner gebruiken, dan poetst hij
// lesinhoud weg.
const lesinhoud = 'In HTML zet je een kop tussen [TITLE] en [/TITLE].';
assert.match(stripInternalMarkers(lesinhoud), /\[TITLE\]/, 'de smalle filter laat lesinhoud staan');
assert.doesNotMatch(cleanInstructionText(lesinhoud), /\[TITLE\]/, 'de brede opschoner zou die juist weghalen');

// 2b. De TIPS-markering hoort ook niet in beeld. In de oude AiLab-route knipt
// useAgentLogic hem eruit en toont de tips als klikbare suggesties; deze chat doet
// dat niet, dus stond hij bij ELK bericht letterlijk op het scherm. De tips zelf
// zijn wel voor de leerling bedoeld en blijven staan.
const metTips = 'Je pagina staat goed!\n---TIPS---\nMaak de kop groter\nKies een kleur\nTest je knop';
const naTips = stripInternalMarkers(metTips);
assert.doesNotMatch(naTips, /---TIPS---/, 'de TIPS-markering mag niet in beeld blijven');
assert.match(naTips, /Maak de kop groter/, 'de tips zelf blijven staan');
assert.match(naTips, /\*\*Tips\*\*/, 'de tips krijgen een leesbare kop in plaats van de markering');

// 3. De leerlingchat gebruikt de filter daadwerkelijk.
const chat = await readFile('src/features/ai-chat/StudentAIChat.tsx', 'utf8');
assert.match(chat, /stripInternalMarkers\(msg\.text\)/, 'StudentAIChat moet het modelantwoord filteren vóór weergave');

// 4. De bouwopdrachten vragen er niet meer om. Dit zijn de enige sjabloon-
// opdrachten met chat aan, dus de enige waar de instructie een leerling bereikt.
const BOUWOPDRACHTEN = [
    'api-architect', 'app-prototyper', 'automation-engineer', 'brand-builder',
    'digital-storyteller', 'innovation-lab', 'meesterproef', 'meme-machine',
    'mission-blueprint', 'mission-vision', 'open-source-contributor', 'pitch-perfect',
    'podcast-producer', 'portfolio-builder', 'prototype-developer', 'startup-simulator',
    'video-editor', 'web-developer', 'website-bouwer',
];

const instructies = await readFile('supabase/functions/_shared/systemInstructions.ts', 'utf8');
const rolBlok = (rol) => {
    const start = instructies.indexOf(`\n  "${rol}": "`);
    assert.notEqual(start, -1, `rol ${rol} moet in de systeeminstructies staan`);
    const eind = instructies.indexOf('\n  "', start + 5);
    return instructies.slice(start, eind === -1 ? undefined : eind);
};

for (const rol of BOUWOPDRACHTEN) {
    const blok = rolBlok(rol);
    assert.doesNotMatch(blok, /STEP_COMPLETE/,
        `${rol}: de bouwmotor leest geen stap-markeringen, dus de instructie mag er niet om vragen`);
    assert.doesNotMatch(blok, /STAP VOLTOOIING/,
        `${rol}: het blok STAP VOLTOOIING beschrijft gedrag dat dit sjabloon niet heeft`);
}

// 5. De aanname onder punt 4 mag niet stilzwijgend verschuiven: leest een sjabloon
// ooit tóch stap-markeringen, dan is deze hele test aan herziening toe.
const { execSync } = await import('node:child_process');
const treffers = execSync(
    'grep -rl "STEP_COMPLETE" src/features/missions/templates/ || true',
    { encoding: 'utf8' }
).trim();
assert.equal(treffers, '',
    `geen enkel sjabloon hoort stap-markeringen te lezen, maar gevonden in:\n${treffers}`);

console.log('Chat-markeringen: geen enkele bouwopdracht vraagt nog om stap-markeringen, en de leerlingchat filtert ze weg.');
