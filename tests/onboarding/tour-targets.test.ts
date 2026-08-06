import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Vangt het stille breken van de rondleiding af.
 *
 * De stappen verwijzen naar `data-tutorial`-sleutels in de componenten. Hernoemt
 * iemand zo'n knop, dan blijft alles compileren en slagen alle andere tests —
 * maar wijst de rondleiding bij de volgende docent naar niets. Precies zo is de
 * verouderde `bg-lab-ink`-selector ontstaan die na de duck-migratie niets meer
 * matchte. Deze test leest beide kanten uit de bronbestanden en vergelijkt ze.
 */

const WORTEL = new URL('../../', import.meta.url).pathname;

const verzamelBestanden = (map: string, uitkomst: string[] = []): string[] => {
    for (const item of readdirSync(map, { withFileTypes: true })) {
        const pad = join(map, item.name);
        if (item.isDirectory()) verzamelBestanden(pad, uitkomst);
        else if (item.name.endsWith('.tsx')) uitkomst.push(pad);
    }
    return uitkomst;
};

/** Alle sleutels die ergens in de app op een element gezet worden. */
const sleutelsInApp = (): Set<string> => {
    const sleutels = new Set<string>();
    for (const bestand of verzamelBestanden(join(WORTEL, 'src'))) {
        const inhoud = readFileSync(bestand, 'utf8');
        // Letterlijke waarden: data-tutorial="student-xp"
        for (const m of inhoud.matchAll(/data-tutorial="([^"]+)"/g)) sleutels.add(m[1]);
        // Sjabloonvorm: data-tutorial={`teacher-nav-${item.id}`} -> voorvoegsel bewaren
        for (const m of inhoud.matchAll(/data-tutorial=\{`([^`$]*)\$\{/g)) sleutels.add(`${m[1]}*`);
        // Voorwaardelijke vorm: { 'data-tutorial': 'student-first-mission' }
        for (const m of inhoud.matchAll(/'data-tutorial':\s*'([^']+)'/g)) sleutels.add(m[1]);
        // Doorgegeven via een prop: tutorial: 'student-profile-btn'
        for (const m of inhoud.matchAll(/\btutorial:\s*'([^']+)'/g)) sleutels.add(m[1]);
        // Via een ankerprop op een component: tutorialAnchor={x ? 'student-first-mission' : undefined}
        for (const m of inhoud.matchAll(/tutorialAnchor=\{[^}]*?'([^']+)'/g)) sleutels.add(m[1]);
    }
    return sleutels;
};

/** Alle sleutels waar de staplijsten naar verwijzen. */
const sleutelsInStappen = (): { stap: string; sleutel: string }[] => {
    const inhoud = readFileSync(join(WORTEL, 'src/contexts/TutorialContext.tsx'), 'utf8');
    const gevonden: { stap: string; sleutel: string }[] = [];

    // Blokken van de vorm: id: 'x', ... target: doel('y')
    for (const m of inhoud.matchAll(/id:\s*'([^']+)',[\s\S]{0,120}?target:\s*(?:doel\('([^']+)'\)|navTarget\('([^']+)'\))/g)) {
        const [, stap, viaDoel, viaNav] = m;
        gevonden.push({ stap, sleutel: viaDoel ?? `teacher-nav-${viaNav}` });
    }
    return gevonden;
};

const dekt = (aanwezig: Set<string>, sleutel: string): boolean => {
    if (aanwezig.has(sleutel)) return true;
    // Sjabloonsleutels: 'teacher-nav-*' dekt 'teacher-nav-students'
    for (const kandidaat of aanwezig) {
        if (kandidaat.endsWith('*') && sleutel.startsWith(kandidaat.slice(0, -1))) return true;
    }
    return false;
};

test('elke rondleidingsstap verwijst naar een sleutel die in de app bestaat', () => {
    const aanwezig = sleutelsInApp();
    const stappen = sleutelsInStappen();

    assert.ok(stappen.length >= 15, `verwacht minstens 15 stappen met een doel, gevonden ${stappen.length}`);

    const ontbreekt = stappen.filter(({ sleutel }) => !dekt(aanwezig, sleutel));
    assert.deepEqual(
        ontbreekt,
        [],
        `deze stappen wijzen naar een data-tutorial-sleutel die nergens in src/ staat:\n`
        + ontbreekt.map((o) => `  stap "${o.stap}" → ${o.sleutel}`).join('\n'),
    );
});

test('de docent- en leerlingrondleiding hebben allebei stappen', () => {
    const inhoud = readFileSync(join(WORTEL, 'src/contexts/TutorialContext.tsx'), 'utf8');
    for (const lijst of ['TEACHER_TUTORIAL_STEPS', 'STUDENT_TUTORIAL_STEPS']) {
        const blok = inhoud.split(`export const ${lijst}`)[1]?.split('\n];')[0] ?? '';
        const aantal = [...blok.matchAll(/^\s{4}\{$/gm)].length;
        assert.ok(aantal >= 5, `${lijst} heeft maar ${aantal} stappen`);
        assert.ok(aantal <= 12, `${lijst} heeft ${aantal} stappen; boven ~10 hoort uitleg in de kennisbank`);
    }
});

test('data-tutorial-mobile is uitgefaseerd — één sleutel dekt beide schermformaten', () => {
    // Op het gebruik als attribuut zoeken, niet op de term in een toelichting.
    const treffers = verzamelBestanden(join(WORTEL, 'src'))
        .filter((b) => /data-tutorial-mobile\s*=/.test(readFileSync(b, 'utf8')));

    assert.deepEqual(
        treffers.map((t) => t.replace(WORTEL, '')),
        [],
        'de spotlight kiest zelf het zichtbare element; een apart mobiel attribuut leidt tot twee waarheden',
    );
});
