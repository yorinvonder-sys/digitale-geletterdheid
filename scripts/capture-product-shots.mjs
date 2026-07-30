/**
 * Legt productschermen vast die achter een login zitten en dus niet live op de
 * publieke site kunnen worden ingebed.
 *
 * Nu: het trofeeën-/avatarscherm voor het blok "En zo ziet het er echt uit" op
 * /verhaal (`src/features/public-site/verhaal/sections/EchtProduct.tsx`).
 *
 * Draai dit LOKAAL, nooit in CI. Het script logt geen credentials en schrijft
 * niets naar de console behalve voortgang.
 *
 *   CAPTURE_EMAIL=... CAPTURE_PASSWORD=... node scripts/capture-product-shots.mjs
 *
 * Opties via omgeving:
 *   BASE_URL   standaard http://localhost:3000
 *   OUT_DIR    standaard public/assets/product
 *   HEADED=1   toont de browser, handig als het inloggen vastloopt
 *
 * Uitvoer belandt onder public/assets/ en niet onder public/screenshots/, omdat
 * vercel.json alleen /assets/(.*) een jaar immutable caching geeft.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = resolve(process.env.OUT_DIR || 'public/assets/product');
const EMAIL = process.env.CAPTURE_EMAIL;
const PASSWORD = process.env.CAPTURE_PASSWORD;
const HEADED = process.env.HEADED === '1';

const VIEWPORT = { width: 1280, height: 800 };

if (!EMAIL || !PASSWORD) {
    console.error(
        'CAPTURE_EMAIL en CAPTURE_PASSWORD zijn verplicht.\n' +
        'Gebruik een testaccount met genoeg voortgang, zodat er zowel behaalde als\n' +
        'nog te verdienen badges in beeld staan.'
    );
    process.exit(1);
}

async function toWebp(pngBuffer, outPath) {
    await sharp(pngBuffer).webp({ quality: 85 }).toFile(outPath);
}

async function main() {
    await mkdir(OUT_DIR, { recursive: true });

    const browser = await chromium.launch({
        headless: !HEADED,
        ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    });
    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
    const page = await context.newPage();

    try {
        console.log('Inloggen...');
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
        await page.getByLabel(/e-?mail/i).fill(EMAIL);
        await page.getByLabel(/wachtwoord/i).fill(PASSWORD);
        await page.getByRole('button', { name: /inloggen|aanmelden/i }).click();
        await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });

        console.log('Naar het profiel...');
        // Het profiel is bereikbaar via de avatarknop in de dashboardheader.
        await page.getByRole('button', { name: /profiel|mijn portfolio|avatar/i }).first().click();
        await page.getByRole('tab', { name: /trofee|shop|winkel/i }).first().click();

        // De 3D-avatarviewer heeft een moment nodig voordat hij staat.
        await page.waitForTimeout(2500);

        const png = await page.screenshot({ type: 'png' });
        const outPath = join(OUT_DIR, 'leerling-trofeeen.webp');
        await toWebp(png, outPath);
        console.log(`Opgeslagen: ${outPath}`);
        console.log(
            'Controleer vóór commit dat er GEEN echte naam of e-mailadres in beeld staat.\n' +
            'Het blok verwacht het bestand op /assets/product/leerling-trofeeen.webp.'
        );
    } finally {
        await browser.close();
    }
}

main().catch((error) => {
    // Geen credentials in de foutmelding.
    console.error('Vastleggen mislukt:', error?.message ?? error);
    process.exit(1);
});
