#!/usr/bin/env node
/**
 * Maakt een instructievideo: stem inspreken, scherm opnemen, samenvoegen.
 *
 *   npm run tutorial:video -- --rol=student
 *   npm run tutorial:video -- --rol=teacher --url=http://localhost:3142
 *
 * Vereist een DRAAIENDE dev-server (de opname gebruikt `/dev/shell-preview`, dat
 * alleen in de dev-build bestaat) en `ffmpeg` op je PATH.
 *
 * Zonder `ELEVENLABS_API_KEY` levert dit een complete video op met stille
 * fragmenten van de juiste lengte — handig om de beeldkant te controleren
 * voordat er geld aan spraak opgaat.
 */

import { mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { spreekIn } from './narrate.mjs';
import { neemOp } from './record.mjs';
import { voegSamen } from './assemble.mjs';

const draai = promisify(execFile);
const WORTEL = new URL('../../', import.meta.url).pathname;

const leesArgument = (naam, standaard) => {
    const treffer = process.argv.find((a) => a.startsWith(`--${naam}=`));
    return treffer ? treffer.split('=').slice(1).join('=') : standaard;
};

const controleerFfmpeg = async () => {
    try {
        await draai('ffmpeg', ['-version']);
        await draai('ffprobe', ['-version']);
    } catch {
        throw new Error('ffmpeg/ffprobe niet gevonden. Installeer met:  brew install ffmpeg');
    }
};

const controleerServer = async (url) => {
    try {
        const antwoord = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (!antwoord.ok) throw new Error(String(antwoord.status));
    } catch (fout) {
        throw new Error(
            `Geen dev-server op ${url} (${fout.message}).\n`
            + 'Start er een vanuit de worktree en geef de poort mee met --url=http://localhost:<poort>',
        );
    }
};

const MANIFEST = join(WORTEL, 'src/features/onboarding/tutorialVideos.json');

/**
 * Legt vast welke video's klaar zijn om te tonen.
 *
 * `heeftStem` is de poort: een stille placeholder blijft wel op schijf staan om
 * de beeldkant te kunnen controleren, maar de app biedt hem niet aan. Zo kan een
 * leerling nooit per ongeluk naar een geluidloze film zitten kijken.
 */
const schrijfManifest = async ({ rol, stem, duur, titel }) => {
    let huidig = {};
    try {
        huidig = JSON.parse(await readFile(MANIFEST, 'utf8'));
    } catch { /* eerste keer */ }

    huidig[rol] = {
        titel,
        bestand: `/tutorials/${rol}-intro.mp4`,
        poster: `/tutorials/${rol}-intro.jpg`,
        ondertitels: `/tutorials/${rol}-intro.vtt`,
        durationSeconden: Math.round(duur),
        heeftStem: stem === 'elevenlabs',
    };
    await writeFile(MANIFEST, `${JSON.stringify(huidig, null, 4)}\n`);
};

const main = async () => {
    const rol = leesArgument('rol');
    if (!['student', 'teacher'].includes(rol)) {
        console.error('Gebruik: --rol=student of --rol=teacher');
        process.exit(1);
    }
    const basisUrl = leesArgument('url', 'http://localhost:3142').replace(/\/$/, '');
    const opnieuwInspreken = process.argv.includes('--opnieuw-inspreken');

    await controleerFfmpeg();
    await controleerServer(basisUrl);

    const draaiboek = await import(`./beats/${rol}.mjs`);
    const werkMap = join(WORTEL, '.tmp-tutorial-video', rol);
    const stemMap = join(werkMap, 'stem');
    const doelBasis = join(WORTEL, 'public', 'tutorials', `${rol}-intro`);

    if (opnieuwInspreken) await rm(stemMap, { recursive: true, force: true });
    await rm(join(werkMap, 'ruw.webm'), { force: true });
    await mkdir(werkMap, { recursive: true });

    console.log(`\n${draaiboek.titel} — ${draaiboek.beats.length} beats\n`);

    console.log('1/3  Stem');
    const { stem, fragmenten } = await spreekIn({ beats: draaiboek.beats, uitvoerMap: stemMap });

    console.log('2/3  Scherm opnemen');
    const opname = await neemOp({ draaiboek, fragmenten, basisUrl, uitvoerMap: werkMap });

    console.log('3/3  Samenvoegen');
    const uit = await voegSamen({
        videoPad: opname.videoPad,
        fragmenten,
        tijdlijn: opname.tijdlijn,
        voorloopMs: opname.voorloopMs,
        naloopMs: opname.naloopMs,
        doelBasis,
    });

    await schrijfManifest({ rol, stem, duur: uit.duur, titel: draaiboek.titel });

    const relatief = (p) => p.replace(WORTEL, '');
    console.log(`\nKlaar — ${uit.duur.toFixed(1)}s`);
    console.log(`  ${relatief(uit.mp4)}`);
    console.log(`  ${relatief(uit.poster)}`);
    console.log(`  ${relatief(uit.vtt)}`);
    if (stem === 'stil') {
        console.log('\n  LET OP: nog zonder stem. Zet ELEVENLABS_API_KEY en draai opnieuw');
        console.log('  met --opnieuw-inspreken voor de definitieve versie.');
    }
};

main().catch((fout) => {
    console.error(`\n${fout.message}`);
    process.exit(1);
});
