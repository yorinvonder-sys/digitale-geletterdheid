// Gedragstest voor de antwoordkwaliteit-gate van de debat-arena.
//
// Draait de ECHTE helper in plaats van de broncode te regexen, zodat deze check
// zakt zodra de gate weer puur op lengte gaat kijken. Node stript de types zelf
// (Node 22.18+ / 23+), dus er is geen bouwstap nodig.
//
// Draaien vanuit de projectroot: node scripts/check-debate-arena-answer-quality.mjs

import { pathToFileURL } from 'node:url';

const SRC = 'src/features/missions/templates/debate-arena/answerQuality.ts';
const { getAnswerStatus, isSubstantiveAnswer } = await import(pathToFileURL(SRC).href);

// [omschrijving, invoer, verwacht]
const CASES = [
    // Moet ZAKKEN. Elk van deze haalde de oude lengte-drempel van 20 tekens wel.
    ['25 keer dezelfde letter', 'a'.repeat(25), false],
    ['losse vulwoorden van herhaalde tekens', 'aaaa bbbb cccc dddd eeee', false],
    ['een woord eindeloos herhaald', 'ja ja ja ja ja ja ja ja ja', false],
    ['leestekens als vulling', '!!!!! ????? ..... ///// #####', false],
    ['te kort', 'Ouders.', false],
    ['leeg', '   ', false],

    // Moet SLAGEN. Echte leerlingantwoorden mogen niet sneuvelen.
    ['kort maar echt argument', 'Ouders zijn verantwoordelijk want zij kopen de telefoon.', true],
    ['antwoord met herhaald kernwoord', 'Ouders moeten grenzen stellen, want ouders kennen hun kind het best.', true],
    ['precies op de ondergrens', 'Scholen moeten leerlingen leren omgaan met schermtijd.', true],
    ['langer verhaal met cijfers', 'Ik denk dat 2 uur per dag genoeg is voor sociale media op een schooldag.', true],
];

let failed = 0;
for (const [naam, invoer, verwacht] of CASES) {
    const werkelijk = isSubstantiveAnswer(invoer);
    if (werkelijk !== verwacht) {
        failed++;
        console.error(
            `FAIL  ${naam}\n      verwacht ${verwacht}, kreeg ${werkelijk}\n` +
            `      hint: "${getAnswerStatus(invoer).hint}"`
        );
    }
}

// De hint moet altijd iets bruikbaars zeggen, anders snapt de leerling de gate niet.
for (const [naam, invoer] of CASES.map((c) => [c[0], c[1]])) {
    const { hint } = getAnswerStatus(invoer);
    if (typeof hint !== 'string' || hint.trim() === '') {
        failed++;
        console.error(`FAIL  lege hint bij: ${naam}`);
    }
}

if (failed > 0) {
    console.error(`\nDebate arena answer-quality contract failed: ${failed} geval(len).`);
    process.exit(1);
}
console.log(`Debate arena answer-quality contract OK (${CASES.length} gevallen).`);
