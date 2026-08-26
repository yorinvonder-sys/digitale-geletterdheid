/**
 * Anti-gok-factor voor de open tekstdossiers van de Ethische Raad.
 *
 * De drie tekstvelden schalen hun score met de lengte. Zonder deze factor levert
 * een reeks herhaalde tekens de volle punten op, terwijl een leerling die wél
 * nadenkt niet méér kan verdienen. De factor knijpt uitsluitend af wat
 * aantoonbaar geen antwoord is — letterbrij, één woord uitgesmeerd, of hetzelfde
 * woord herhaald. Elke echte zin, ook een korte, houdt factor 1 en scoort dus
 * precies zoals voorheen.
 */

const WORD_RE = /[\p{L}\p{N}]+/gu;

/**
 * Wat een niet-antwoord nog oplevert. Bewust niet 0: een leerling die onhandig
 * formuleert mag niet volledig worden weggeschreven.
 */
const FILLER_FACTOR = 0.25;

/** Onder deze lengte is herhaling niet te onderscheiden van een kort antwoord. */
const MIN_LENGTH_FOR_CHECK = 12;

export const substanceFactor = (raw: string): number => {
    const text = raw.trim();
    if (!text) return 0;

    const words = text.toLowerCase().match(WORD_RE) ?? [];
    if (words.length === 0) return 0;

    const uniqueWords = new Set(words).size;
    const uniqueChars = new Set(text.toLowerCase().replace(/\s+/g, '')).size;

    const isMash = text.length >= MIN_LENGTH_FOR_CHECK && uniqueChars < 5;
    const isStretchedWord = uniqueWords === 1 && text.length >= MIN_LENGTH_FOR_CHECK;
    const isRepetition = words.length >= 4 && uniqueWords / words.length < 0.4;

    return isMash || isStretchedWord || isRepetition ? FILLER_FACTOR : 1;
};

/**
 * Wat een tekst zonder één herkenbaar kernbegrip nog oplevert. Bewust hoog en
 * bewust géén blokkade: dit is een ZACHTE factor.
 *
 * `substanceFactor` herkent alleen tekst die vormelijk geen antwoord is. Een
 * leerling die keurig gevarieerde maar volstrekt onderwerploze zinnen typt
 * ("bananen fiets maandag zwembad") glipt daar doorheen en krijgt nu nog de
 * volle punten. Deze factor drukt dát gokwerk.
 *
 * Waarom zacht: een leerling mag het in eigen woorden of met synoniemen zeggen
 * zonder total loss te gaan. Wie het onderwerp wél raakt maar net andere
 * woorden kiest dan de lijst, verliest een randje — geen dossier. En de gate om
 * door te mogen (`canSubmit`/`canContinue`) blijft er volledig buiten: niemand
 * loopt vast omdat hij het "verkeerde" woord niet gebruikte.
 */
const OFF_TOPIC_FACTOR = 0.7;

/** T/m deze lengte moet een kernbegrip een héél woord zijn — zie hieronder. */
const WHOLE_WORD_MAX_LENGTH = 4;
/** T/m deze lengte moet een kernbegrip minstens aan een woordbegin staan. */
const WORD_START_MAX_LENGTH = 6;
/** Zoveel verschillende kernbegrippen moet een antwoord raken voor factor 1. */
const MIN_DISTINCT_HITS = 2;

/**
 * Geeft 1 zodra minstens MIN_DISTINCT_HITS verschillende kernbegrippen in de
 * tekst voorkomen, anders `weakFactor`. Hoofdletterongevoelig.
 *
 * Waarom twee en niet één: de lijsten bevatten bewust ook alledaagse woorden
 * ('mag', 'school', 'project') zodat eigen-woorden-antwoorden herkend worden —
 * maar één zo'n woord zegt niets. "Ik ging na school voetballen" gaat niet
 * over privacy. Een echt antwoord over het dilemma raakt vrijwel altijd
 * meerdere begrippen tegelijk ("je MAG iemands GEGEVENS niet zomaar
 * gebruiken"); losse toevalstreffers niet.
 *
 * Hoe specifieker een begrip, hoe vrijer het mag matchen — anders raakt een
 * kort fragment toevallig een doodgewoon woord:
 *
 * - t/m 4 letters ('mag', 'wet', 'app', 'zin'): alleen als heel woord. Eerder
 *   matchte 'app' in "boodschappen", 'open' in "kopen" en 'mag' in
 *   "magnetron".
 * - 5 t/m 6 letters ('regel', 'delen'): aan een woordbegin, zodat
 *   verbuigingen meetellen zonder treffers midden in een ander woord.
 * - 7 letters en langer ('gegeven', 'privacy', 'toestemming'): overal in het
 *   woord — nodig voor Nederlandse samenstellingen ('gegeven' hoort te
 *   matchen in "persoonsgegevens"), en lang genoeg om niet per ongeluk raak
 *   te zijn.
 *
 * Bewust tokenisatie en géén reguliere expressies per kernbegrip: de eerdere
 * regex-variant leunde op lookbehind, en dat gooit een SyntaxError op de
 * iPad-Safari-versies (iPadOS 15/16.3) die scholen nog gebruiken — de missie
 * crashte dan precies op het inleveren.
 *
 * Een lege lijst betekent "dit dossier heeft geen kernbegrippen" en geeft
 * altijd 1 — zo blijven dossiers zonder lijst ongemoeid.
 */
export const relevanceFactor = (
    raw: string,
    keywords: readonly string[],
    weakFactor = OFF_TOPIC_FACTOR
): number => {
    if (keywords.length === 0) return 1;

    const text = raw.toLowerCase();
    // Uniek per woord: één woord in het antwoord kan maar één treffer
    // opleveren, ook als het meerdere (overlappende) lijst-items raakt —
    // anders telde "persoonsgegevens" alleen al als twee begrippen doordat
    // zowel 'persoon' als 'gegeven' erin voorkomt.
    const words = new Set<string>(text.match(WORD_RE) ?? []);
    const needles = keywords
        .map((keyword) => keyword.trim().toLowerCase())
        .filter((needle) => needle.length > 0);
    // Bij een lijst met maar één begrip is één treffer vanzelfsprekend genoeg.
    const needed = Math.min(MIN_DISTINCT_HITS, needles.length);
    if (needed === 0) return 1;

    const matchesAnyNeedle = (word: string): boolean => needles.some((needle) =>
        needle.length <= WHOLE_WORD_MAX_LENGTH
            ? word === needle
            : needle.length <= WORD_START_MAX_LENGTH
                ? word.startsWith(needle)
                : word.includes(needle)
    );

    let hits = 0;
    for (const word of words) {
        if (matchesAnyNeedle(word)) {
            hits++;
            if (hits >= needed) return 1;
        }
    }

    return weakFactor;
};
