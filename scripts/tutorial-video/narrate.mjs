/**
 * Stap 1 van de pipeline: de stem, VOOR de opname.
 *
 * Waarom eerst: de video wordt op de gemeten audioduur getimed. Andersom — eerst
 * filmen en er dan spraak overheen leggen — loopt onvermijdelijk uit de pas.
 *
 * Zonder `ELEVENLABS_API_KEY` maakt dit script stille fragmenten met een geschatte
 * duur. De rest van de pipeline draait dan volledig; alleen het geluid ontbreekt.
 * Zodra de sleutel er is, levert dezelfde aanroep echte spraak op.
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const draai = promisify(execFile);

/** Meertalig model; nodig voor natuurlijk klinkend Nederlands. */
const MODEL = 'eleven_multilingual_v2';
/** Kant-en-klare stem uit de ElevenLabs-bibliotheek; te wijzigen via ELEVENLABS_VOICE_ID. */
const STANDAARD_STEM = 'pNInz6obpgDQGcFmaJgB';

/** Rustig voorleestempo in het Nederlands, in woorden per seconde. */
const WOORDEN_PER_SECONDE = 2.4;

const schatDuur = (tekst) => {
    const woorden = tekst.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1.2, woorden / WOORDEN_PER_SECONDE);
};

export const duurVanBestand = async (pad) => {
    const { stdout } = await draai('ffprobe', [
        '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', pad,
    ]);
    const seconden = Number.parseFloat(stdout.trim());
    if (!Number.isFinite(seconden)) throw new Error(`kon duur niet lezen van ${pad}`);
    return seconden;
};

const maakStilte = async (pad, seconden) => {
    await draai('ffmpeg', [
        '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
        '-t', seconden.toFixed(3), '-q:a', '9', pad,
    ]);
};

const haalSpraak = async (tekst, pad, sleutel, stemId) => {
    const antwoord = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${stemId}`,
        {
            method: 'POST',
            headers: {
                'xi-api-key': sleutel,
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
                text: tekst,
                model_id: MODEL,
                // Iets hogere stability + style dan standaard: rustiger en minder
                // wisselend van toon, wat beter past bij instructie.
                voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
            }),
        },
    );
    if (!antwoord.ok) {
        throw new Error(`ElevenLabs gaf ${antwoord.status}: ${(await antwoord.text()).slice(0, 200)}`);
    }
    await writeFile(pad, Buffer.from(await antwoord.arrayBuffer()));
};

/**
 * Levert per beat een audiobestand plus de gemeten duur.
 * @returns {Promise<{stem: 'elevenlabs'|'stil', fragmenten: {id: string, bestand: string, duur: number, tekst: string}[]}>}
 */
export const spreekIn = async ({ beats, uitvoerMap, log = console.log }) => {
    await mkdir(uitvoerMap, { recursive: true });

    const sleutel = process.env.ELEVENLABS_API_KEY;
    const stemId = process.env.ELEVENLABS_VOICE_ID || STANDAARD_STEM;
    const stem = sleutel ? 'elevenlabs' : 'stil';

    if (!sleutel) {
        log('  Geen ELEVENLABS_API_KEY gevonden — er komen stille fragmenten met een');
        log('  geschatte duur. De video klopt qua timing, alleen de stem ontbreekt nog.');
    }

    const fragmenten = [];
    for (const [index, beat] of beats.entries()) {
        const naam = `${String(index + 1).padStart(2, '0')}-${beat.id}.mp3`;
        const bestand = join(uitvoerMap, naam);

        if (sleutel) {
            if (existsSync(bestand)) {
                log(`  ${naam} bestaat al — hergebruikt`);
            } else {
                await haalSpraak(beat.narration, bestand, sleutel, stemId);
                log(`  ${naam} ingesproken`);
            }
        } else {
            await maakStilte(bestand, schatDuur(beat.narration));
        }

        fragmenten.push({
            id: beat.id,
            bestand,
            duur: await duurVanBestand(bestand),
            tekst: beat.narration,
        });
    }

    await writeFile(
        join(uitvoerMap, 'fragmenten.json'),
        JSON.stringify({ stem, fragmenten }, null, 2),
    );
    return { stem, fragmenten };
};

export const leesFragmenten = async (uitvoerMap) =>
    JSON.parse(await readFile(join(uitvoerMap, 'fragmenten.json'), 'utf8'));
