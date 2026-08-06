// Antwoordkwaliteit voor de debat-arena.
//
// De fasegates en de score keken eerder alleen naar `trim().length >= 20`.
// Twintig willekeurige tekens haalden daarmee de volle punten en brachten een
// leerling door alle fases heen. Dat botst met de missieregel dat oppervlakkige
// interactie niet beloond mag worden, dus er komt een deterministische
// woordcheck bij. Bewust geen AI: deze gate moet offline en voorspelbaar zijn.

export const MIN_ANSWER_CHARS = 20;
export const MIN_ANSWER_WORDS = 5;

/** Een woord dat uit één herhaald teken bestaat ("aaaa", "!!!!") telt niet mee. */
const isFillerWord = (word: string): boolean => /^(.)\1*$/u.test(word);

const meaningfulWords = (text: string): string[] =>
    text
        .toLowerCase()
        .split(/[^\p{L}\p{N}']+/u)
        .filter((word) => word.length >= 2 && !isFillerWord(word));

export interface AnswerStatus {
    /** Telt dit antwoord als inhoudelijk genoeg voor gate en score? */
    ok: boolean;
    /** Korte hint onder het invoerveld, zodat de leerling weet wat er nog mist. */
    hint: string;
}

export function getAnswerStatus(raw: string): AnswerStatus {
    const text = (raw ?? '').trim();

    if (text.length < MIN_ANSWER_CHARS) {
        return { ok: false, hint: `${text.length}/${MIN_ANSWER_CHARS} tekens` };
    }

    const words = meaningfulWords(text);
    if (words.length < MIN_ANSWER_WORDS) {
        return { ok: false, hint: `Schrijf een hele zin (min. ${MIN_ANSWER_WORDS} woorden)` };
    }

    // "ja ja ja ja ja" haalt de woordentelling wel, maar zegt niets.
    const distinct = new Set(words);
    if (distinct.size < 3) {
        return { ok: false, hint: 'Gebruik meer verschillende woorden' };
    }

    return { ok: true, hint: `${text.length} tekens ✓` };
}

export const isSubstantiveAnswer = (raw: string): boolean => getAnswerStatus(raw).ok;
