/**
 * Stap 2: het scherm opnemen, exact getimed op de audiofragmenten uit stap 1.
 *
 * Elke beat krijgt precies zoveel wandkloktijd als zijn audiofragment duurt. Zo
 * kunnen beeld en geluid niet uit de pas lopen, ook niet als een klik een keer
 * trager reageert — dan blijft er simpelweg minder stiltetijd over.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';

const VENSTER = { width: 1440, height: 900 };
/** Standaard rust tussen twee beats als het draaiboek niets voorschrijft. */
const PAUZE_STANDAARD = 350;

import { installeerOverlay, maakRegie } from './lib/scherm.mjs';

/**
 * Controleert dat er geen echte persoonsgegevens in beeld staan.
 *
 * De opname hoort tegen de demo-fixtures te draaien. Belandt er ooit een echte
 * klas voor de camera, dan is dat een datalek in een bestand dat we publiceren —
 * dus faalt het script liever hard.
 */
const controleerGeenEchteData = async (page, url) => {
    if (!/^https?:\/\/localhost[:/]/.test(url)) {
        throw new Error(`[opname] alleen tegen een lokale dev-server opnemen, niet ${url}`);
    }
    const tekst = await page.evaluate(() => document.body.innerText);
    const emails = tekst.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? [];
    const echteMails = emails.filter((m) => !/(dgskills\.local|example\.|demo)/i.test(m));
    if (echteMails.length > 0) {
        throw new Error(`[opname] e-mailadressen in beeld: ${echteMails.join(', ')}`);
    }
    return { emailsGezien: emails };
};

export const neemOp = async ({ draaiboek, fragmenten, basisUrl, uitvoerMap, log = console.log }) => {
    await mkdir(uitvoerMap, { recursive: true });
    // `kaal=1` haalt de DEV-navigatiebalk weg; die hoort niet in een video die
    // leerlingen en docenten te zien krijgen.
    const url = `${basisUrl}/dev/shell-preview?screen=${draaiboek.scherm}&kaal=1`;

    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: VENSTER,
        recordVideo: { dir: uitvoerMap, size: VENSTER },
        deviceScaleFactor: 1,
    });

    const contextGestart = Date.now();
    const page = await context.newPage();
    const tijdlijn = [];
    let voorloopMs = 0;
    let naloopMs = 0;

    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
        // De rondleiding hoort niet in beeld: de video is het alternatief ervoor.
        await page.evaluate(() => localStorage.setItem('dgskills.tour.disabled', 'true'));
        await page.waitForTimeout(1200);

        const privacy = await controleerGeenEchteData(page, url);
        log(`  privacycontrole ok${privacy.emailsGezien.length ? ` (demo-adressen: ${privacy.emailsGezien.length})` : ''}`);

        await installeerOverlay(page);
        const regie = maakRegie(page);
        await page.waitForTimeout(400);

        voorloopMs = Date.now() - contextGestart;

        for (const [index, beat] of draaiboek.beats.entries()) {
            const fragment = fragmenten[index];
            if (!fragment || fragment.id !== beat.id) {
                throw new Error(`[opname] fragment ${index} hoort niet bij beat "${beat.id}"`);
            }
            const beatStart = Date.now();
            const beschikbaar = fragment.duur * 1000 + (beat.pauzeNa ?? PAUZE_STANDAARD);

            tijdlijn.push({
                id: beat.id,
                tekst: beat.narration,
                startMs: beatStart - contextGestart - voorloopMs,
                duurMs: fragment.duur * 1000,
            });

            if (beat.action) await beat.action(regie);

            const resterend = beschikbaar - (Date.now() - beatStart);
            if (resterend > 0) await page.waitForTimeout(resterend);
            else log(`  let op: beat "${beat.id}" liep ${Math.round(-resterend)}ms uit`);
        }

        // Rustig uitlopen in plaats van abrupt afkappen. Deze staart bevat geen
        // spraak, dus de montage vult hem aan met evenveel stilte.
        const naloopStart = Date.now();
        await regie.ringWeg();
        await page.waitForTimeout(600);
        naloopMs = Date.now() - naloopStart;
    } finally {
        await context.close();
        await browser.close();
    }

    // Playwright schrijft de video pas weg bij het sluiten van de context.
    const ruwePad = await page.video()?.path();
    const doelPad = join(uitvoerMap, 'ruw.webm');
    if (ruwePad && ruwePad !== doelPad) await rename(ruwePad, doelPad);

    const manifest = { voorloopMs, naloopMs, tijdlijn };
    await writeFile(join(uitvoerMap, 'tijdlijn.json'), JSON.stringify(manifest, null, 2));
    log(`  opname klaar (${(tijdlijn.at(-1).startMs + tijdlijn.at(-1).duurMs) / 1000 | 0}s aan beats)`);

    return { videoPad: doelPad, ...manifest };
};
