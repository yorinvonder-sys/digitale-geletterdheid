/**
 * Stap 3: beeld, geluid en ondertitels samenvoegen tot één mp4.
 *
 * De ondertitels komen uit dezelfde beat-teksten en dezelfde gemeten duren als de
 * voice-over, dus ze kunnen per definitie niet uit de pas lopen met wat je hoort.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { duurVanBestand } from './narrate.mjs';

const draai = promisify(execFile);

/** Hoeveel beeld en geluid maximaal mogen verschillen voordat we het afkeuren. */
const MAX_DRIFT_S = 0.5;

const ffmpeg = (args) => draai('ffmpeg', ['-y', '-loglevel', 'error', ...args]);

const tijdstempel = (ms) => {
    const totaal = Math.max(0, ms);
    const u = String(Math.floor(totaal / 3_600_000)).padStart(2, '0');
    const m = String(Math.floor(totaal / 60_000) % 60).padStart(2, '0');
    const s = String(Math.floor(totaal / 1000) % 60).padStart(2, '0');
    const mss = String(Math.floor(totaal) % 1000).padStart(3, '0');
    return `${u}:${m}:${s}.${mss}`;
};

const schrijfOndertitels = async (pad, tijdlijn) => {
    const blokken = tijdlijn.map((beat, i) => {
        const eind = beat.startMs + beat.duurMs;
        return `${i + 1}\n${tijdstempel(beat.startMs)} --> ${tijdstempel(eind)}\n${beat.tekst}\n`;
    });
    await writeFile(pad, `WEBVTT\n\n${blokken.join('\n')}`);
};

/** Plakt de losse fragmenten achter elkaar, met de stiltes uit het draaiboek ertussen. */
const bouwGeluidsspoor = async (fragmenten, tijdlijn, werkMap, naloopMs = 0) => {
    const lijst = join(werkMap, 'concat.txt');
    const regels = [];
    for (const [i, fragment] of fragmenten.entries()) {
        regels.push(`file '${fragment.bestand.replace(/'/g, "'\\''")}'`);
        // Stilte tot aan het begin van de volgende beat.
        const volgende = tijdlijn[i + 1];
        if (volgende) {
            const gatMs = volgende.startMs - (tijdlijn[i].startMs + tijdlijn[i].duurMs);
            if (gatMs > 20) {
                const stiltePad = join(werkMap, `stilte-${i}.mp3`);
                await ffmpeg(['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
                    '-t', (gatMs / 1000).toFixed(3), '-q:a', '9', stiltePad]);
                regels.push(`file '${stiltePad.replace(/'/g, "'\\''")}'`);
            }
        }
    }
    // De rustige uitloop van de opname bevat geen spraak, maar wel beeld.
    if (naloopMs > 20) {
        const staartPad = join(werkMap, 'stilte-staart.mp3');
        await ffmpeg(['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
            '-t', (naloopMs / 1000).toFixed(3), '-q:a', '9', staartPad]);
        regels.push(`file '${staartPad.replace(/'/g, "'\\''")}'`);
    }
    await writeFile(lijst, regels.join('\n'));

    const spoor = join(werkMap, 'stem.mp3');
    await ffmpeg(['-f', 'concat', '-safe', '0', '-i', lijst, '-c', 'copy', spoor]);
    return spoor;
};

export const voegSamen = async ({ videoPad, fragmenten, tijdlijn, voorloopMs, naloopMs = 0, doelBasis, log = console.log }) => {
    const werkMap = dirname(videoPad);
    await mkdir(dirname(doelBasis), { recursive: true });

    const geluid = await bouwGeluidsspoor(fragmenten, tijdlijn, werkMap, naloopMs);
    const geluidDuur = await duurVanBestand(geluid);
    const beeldDuur = await duurVanBestand(videoPad);
    const bruikbaarBeeld = beeldDuur - voorloopMs / 1000;

    log(`  beeld ${bruikbaarBeeld.toFixed(1)}s (na ${(voorloopMs / 1000).toFixed(1)}s aanloop), geluid ${geluidDuur.toFixed(1)}s`);

    const drift = Math.abs(bruikbaarBeeld - geluidDuur);
    if (drift > MAX_DRIFT_S) {
        throw new Error(
            `[montage] beeld en geluid lopen ${drift.toFixed(2)}s uiteen (grens ${MAX_DRIFT_S}s). `
            + 'Liever geen scheve video dan een stille fout — draai de opname opnieuw.',
        );
    }

    const mp4 = `${doelBasis}.mp4`;
    await ffmpeg([
        '-ss', (voorloopMs / 1000).toFixed(3), '-i', videoPad,
        '-i', geluid,
        '-map', '0:v:0', '-map', '1:a:0',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
        '-vf', 'scale=1280:-2,fps=30', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '96k',
        '-movflags', '+faststart',
        '-shortest', mp4,
    ]);

    const poster = `${doelBasis}.jpg`;
    await ffmpeg(['-ss', '0.5', '-i', mp4, '-frames:v', '1', '-q:v', '4', poster]);

    const vtt = `${doelBasis}.vtt`;
    await schrijfOndertitels(vtt, tijdlijn);

    return { mp4, poster, vtt, duur: await duurVanBestand(mp4) };
};
