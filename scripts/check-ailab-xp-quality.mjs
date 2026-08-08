// Gedragstest voor de XP-drempels van chatberichten in het AI Lab.
//
// Eerder gold `inputText.length > 20 ? 10 : 5`, waarmee twintig willekeurige
// letters de volle 10 XP opleverden. Deze check draait de echte helpers, zodat
// hij zakt zodra de beloning weer puur op lengte gaat kijken.
//
// Draaien vanuit de projectroot: node scripts/check-ailab-xp-quality.mjs

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const HELPER = 'src/features/missions/templates/shared/answerQuality.ts';
const { isMeaningfulAnswer, isRealMessage } = await import(pathToFileURL(HELPER).href);

// De beloningsladder zoals AiLab hem toepast.
const xpVoor = (tekst) => (isMeaningfulAnswer(tekst) ? 10 : isRealMessage(tekst) ? 5 : 0);

const GEVALLEN = [
    // Onzin levert niets op. Alle drie haalden onder de oude regel 10 XP.
    ['23 keer dezelfde letter', 'a'.repeat(23), 0],
    ['vulwoorden van herhaalde tekens', 'aaaa bbbb cccc dddd', 0],
    ['een woord eindeloos herhaald', 'ja ja ja ja ja ja ja ja', 0],
    ['losse leestekens', '!!!!!!!!!!!!!!!!!!!!!!', 0],
    ['een enkel woord', 'ja', 0],

    // Korte maar echte vraag: wel belonen, niet vol.
    ['korte echte vraag', 'Wat is een prompt?', 5],
    ['korte vervolgvraag', 'Hoe werkt dat?', 5],

    // Uitgeschreven bericht: volle beloning.
    ['uitgeschreven vraag', 'Ik snap niet hoe ik de speler blauw maak in de code.', 10],
    ['eigen redenering', 'Volgens mij moet de kleur bij de speler staan en niet bij de achtergrond.', 10],
];

let gezakt = 0;
for (const [naam, invoer, verwacht] of GEVALLEN) {
    const werkelijk = xpVoor(invoer);
    if (werkelijk !== verwacht) {
        gezakt++;
        console.error(`FAIL  ${naam}: verwacht ${verwacht} XP, kreeg ${werkelijk} XP`);
    }
}

// De bron moet de helpers ook echt gebruiken; anders test dit script niets.
const ailab = fs.readFileSync('src/features/ai-lab/AiLab.tsx', 'utf8');
assert.match(
    ailab,
    /isMeaningfulAnswer\(inputText\)[\s\S]*isRealMessage\(inputText\)/,
    'AiLab moet de XP-beloning op inhoud baseren, niet op berichtlengte',
);
assert.doesNotMatch(
    ailab,
    /inputText\.length > 20 \? 10 : 5/,
    'De oude lengte-gebaseerde XP-regel mag niet terugkomen',
);

if (gezakt > 0) {
    console.error(`\nAI Lab XP-contract failed: ${gezakt} geval(len).`);
    process.exit(1);
}
console.log(`AI Lab XP-contract OK (${GEVALLEN.length} gevallen).`);
