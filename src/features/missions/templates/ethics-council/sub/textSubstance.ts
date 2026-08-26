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

/**
 * Geeft 1 zodra minstens één kernbegrip in de tekst voorkomt, anders
 * `weakFactor`.
 *
 * De vergelijking is hoofdletterongevoelig en werkt op substring, zodat stammen
 * meetellen: 'toestemming' matcht ook 'toestemmingen' en 'gegeven' ook
 * 'persoonsgegevens'. Een lege lijst betekent "dit dossier heeft geen
 * kernbegrippen" en geeft altijd 1 — zo blijven dossiers zonder lijst
 * ongemoeid.
 */
export const relevanceFactor = (
    raw: string,
    keywords: readonly string[],
    weakFactor = OFF_TOPIC_FACTOR
): number => {
    if (keywords.length === 0) return 1;

    const text = raw.toLowerCase();
    const hit = keywords.some((keyword) => {
        const needle = keyword.trim().toLowerCase();
        return needle.length > 0 && text.includes(needle);
    });

    return hit ? 1 : weakFactor;
};
