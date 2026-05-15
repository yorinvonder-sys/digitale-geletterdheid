import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/features/public-site/ScholenLanding.tsx'), 'utf8');

const requiredSnippets = [
    "routeCoachTip: 'Kies een leerlijn en zie meteen waar je klas start.'",
    "routeCoachTip: 'Elke missie geeft directe feedback, dus leerlingen blijven bezig.'",
    "routeCoachTip: 'Hier wordt het concreet: games, robots, prompts, projecten.'",
    "routeCoachTip: 'Alles eindigt in zichtbaar portfolio- of voortgangsbewijs.'",
    "data-inline-routecoach-tip",
    "{chapter.routeCoachTip}",
    "alt=\"\"",
    "aria-hidden=\"true\"",
];

const missing = requiredSnippets.filter((snippet) => !source.includes(snippet));

if (missing.length) {
    console.error('Journey routecoach check failed. Missing snippets:');
    for (const snippet of missing) {
        console.error(`- ${snippet}`);
    }
    process.exit(1);
}

const oldFloatingHeaderBeaver = /<div className="relative max-w-\[430px\] pr-24">[\s\S]*?Bevermentor wijst naar de route[\s\S]*?<\/div>/m;

if (oldFloatingHeaderBeaver.test(source)) {
    console.error('Journey routecoach check failed. Header beaver is still decorative instead of being tied to the route.');
    process.exit(1);
}

if (source.includes('data-journey-routecoach') || source.includes('function JourneyRouteCoach')) {
    console.error('Journey routecoach check failed. Desktop beaver should live inside the active card, not beside the card.');
    process.exit(1);
}

const inlineRouteCoach = source.match(/<div data-inline-routecoach-tip[\s\S]*?<\/div>\n\s*<\/div>/);

if (!inlineRouteCoach?.[0].includes('/assets/storytelling/beaver-storyteller.webp')) {
    console.error('Journey routecoach check failed. Inline routecoach should include the beaver image inside the box.');
    process.exit(1);
}

if (inlineRouteCoach[0].includes('lg:hidden')) {
    console.error('Journey routecoach check failed. Inline routecoach beaver must be visible on desktop.');
    process.exit(1);
}
