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
