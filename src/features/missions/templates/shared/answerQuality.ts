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
/**
 * Drie in plaats van vier: een raak kort antwoord als "Eerst toestemming vragen."
 * haalt de twintig tekens ruim, maar telt maar drie woorden. Vier woorden eisen
 * blokkeerde zulke antwoorden bij de doorgaan-knop, en een leerling die onterecht
 * vastloopt is erger dan een leerling die onterecht punten krijgt.
 */
const MIN_WORDS = 3;
/** Echte tekst gebruikt veel verschillende tekens; "aaaa bbbb cccc" niet. */
const MIN_DISTINCT_LETTERS = 6;

/** Een woord dat uit één herhaald teken bestaat ("aaaa", "1111") is geen woord. */
const isFillerWord = (word: string): boolean => /^(.)\1*$/u.test(word);

/**
 * Telt woorden van minstens twee tekens.
 * Splitst op alles wat geen letter, cijfer of apostrof is, zodat "2FA + pincode
 * + backup." als drie woorden telt en niet als één brok met plustekens.
 * Vulwoorden tellen niet mee: anders haalt "aaaa bbbb cccc dddd" de drempel op
 * woordaantal én op tekenvariatie, terwijl er niets staat.
 */
const countWords = (text: string): number =>
    text
        .trim()
        .split(/[^\p{L}\p{N}'’]+/u)
        .filter((w) => w.length >= 2 && !isFillerWord(w)).length;

/**
 * Telt unieke letters én cijfers, hoofdletterongevoelig.
 * Bewust Unicode-breed: de oude `[^a-zà-ÿ]`-filter gooide cijfers weg en zag
 * niet-Latijnse schriften als leeg, waardoor "2024: 55% vóór; 45% tegen." en elk
 * Arabisch of Cyrillisch antwoord op nul uitkwam en werd geweigerd.
 */
const countDistinctLetters = (text: string): number =>
    new Set(text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')).size;

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
    if (trimmed.length < 6) return false;
    // Eén woord mag: "phishing" of "2FA/MFA" is een compleet en correct antwoord
    // op een vraag. De tekenvariatie weert het geramte dat we hier bedoelen.
    if (countWords(trimmed) < 1) return false;
    return countDistinctLetters(trimmed) >= 4;
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
