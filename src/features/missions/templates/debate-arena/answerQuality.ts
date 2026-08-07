/**
 * Inhoudscheck voor open leerlingantwoorden in DebateArena.
 *
 * Vervangt de eerdere kale `trim().length >= 20`-toets, waarmee 24 keer dezelfde
 * letter de volle 100 punten opleverde. De drempels zijn bewust mild: ze moeten
 * herhaalde tekens en toetsenbordgeramte weren zonder een echte, korte
 * leerlingzin af te wijzen ("Telefoons horen niet in de klas" haalt ze ruim).
 */

/** Minimale lengte — ongewijzigd t.o.v. het oude gedrag. */
const MIN_LENGTH = 20;
/** Een zin van 20+ tekens bevat in de praktijk minstens vier woorden. */
const MIN_WORDS = 4;
/** Echte tekst gebruikt veel verschillende letters; "aaaa bbbb cccc" niet. */
const MIN_DISTINCT_LETTERS = 8;

/** Telt woorden van minstens twee tekens. */
const countWords = (text: string): number =>
    text.trim().split(/\s+/).filter((w) => w.length >= 2).length;

/** Telt unieke letters, hoofdletterongevoelig en zonder leestekens of cijfers. */
const countDistinctLetters = (text: string): number =>
    new Set(text.toLowerCase().replace(/[^a-zà-ÿ]/g, '')).size;

/**
 * Bepaalt of een antwoord inhoudelijk meetelt voor poort en score.
 * Geeft `false` bij te kort, te weinig woorden, of te weinig letterafwisseling.
 */
export const isMeaningfulAnswer = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < MIN_LENGTH) return false;
    if (countWords(trimmed) < MIN_WORDS) return false;
    return countDistinctLetters(trimmed) >= MIN_DISTINCT_LETTERS;
};

/**
 * Lichtere drempel voor chatberichten, waar een korte maar echte vraag
 * ("Wat is een prompt?") niet als geramte mag gelden. Weert alleen wat evident
 * geen bericht is: te kort, één woord, of nauwelijks letterafwisseling.
 */
export const isRealMessage = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 8) return false;
    if (countWords(trimmed) < 2) return false;
    return countDistinctLetters(trimmed) >= 5;
};

/**
 * Uitleg voor de leerling wanneer een antwoord lang genoeg is maar niet meetelt.
 * `null` zodra het antwoord voldoet, of nog te kort is — dan volstaat de teller.
 */
export const answerQualityHint = (text: string): string | null => {
    const trimmed = text.trim();
    if (trimmed.length < MIN_LENGTH) return null;
    if (isMeaningfulAnswer(trimmed)) return null;
    if (countWords(trimmed) < MIN_WORDS) {
        return 'Schrijf je antwoord in een paar woorden, als een echte zin.';
    }
    return 'Dit lijkt nog geen echt antwoord. Schrijf in je eigen woorden wat je vindt.';
};
