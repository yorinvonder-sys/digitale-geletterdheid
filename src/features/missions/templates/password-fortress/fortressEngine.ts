import type { AttackId } from './passwordFortressTypes';

/**
 * Deterministische, puur client-side simulatie van wachtwoordaanvallen.
 * Dit is GEEN echte kraaktool: het is een rekenmodel voor educatie.
 * Er verlaat niets de browser en er wordt geen echt wachtwoord opgeslagen.
 */

// === Model-constanten ===

/** Gesimuleerde kraaksnelheid: 1 miljard pogingen per seconde (zelfde verhaal als Wachtwoord Warrior). */
export const GUESSES_PER_SECOND = 1_000_000_000;

/** Sentinel voor "deze aanval vindt niets" (bv. niet in gelekte lijsten). */
export const SAFE_SECONDS = Number.POSITIVE_INFINITY;

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_DAY = 86_400;
const SECONDS_PER_MONTH = 2_592_000; // 30 dagen
const SECONDS_PER_YEAR = 31_536_000;

/**
 * Kleine, illustratieve lijst van wereldwijd bekende gelekte wachtwoorden.
 * Bewust hardcoded en kort — dit is GEEN live breach-database.
 */
export const KNOWN_BREACHED: ReadonlySet<string> = new Set([
    '123456',
    '123456789',
    '12345678',
    '12345',
    'password',
    'password1',
    'qwerty',
    'qwerty123',
    'abc123',
    '111111',
    '123123',
    '000000',
    'iloveyou',
    'dragon',
    'monkey',
    'letmein',
    'welkom01',
    'welkom123',
    'wachtwoord',
    'geheim',
    'voetbal',
    'ajax1900',
    'hallo123',
    'zomer2024',
]);

/**
 * Compacte woordenlijst (NL + EN) voor de gesimuleerde woordenboekaanval.
 * Alleen woorden van ≥ 4 tekens; bewust klein en herkenbaar voor leerlingen.
 */
const WORDLIST: readonly string[] = [
    // Nederlands — alledaags
    'wachtwoord', 'geheim', 'welkom', 'school', 'fiets', 'voetbal', 'hallo',
    'liefde', 'zomer', 'winter', 'lente', 'herfst', 'appel', 'banaan',
    'nederland', 'amsterdam', 'rotterdam', 'utrecht', 'oranje', 'muziek',
    'gitaar', 'piano', 'konijn', 'paard', 'hond', 'poes', 'bloem', 'maan',
    'ster', 'regen', 'wolk', 'vuur', 'water', 'aarde', 'blauw', 'groen',
    'rood', 'geel', 'paars', 'roze', 'zwart', 'tafel', 'stoel', 'brood',
    'kaas', 'pizza', 'patat', 'snoep', 'koekje', 'vakantie', 'strand',
    'ajax', 'feyenoord', 'gamer', 'mobiel', 'telefoon', 'laptop', 'computer',
    // Engels — klassiekers uit echte aanvalslijsten
    'password', 'dragon', 'monkey', 'princess', 'sunshine', 'flower',
    'soccer', 'master', 'killer', 'superman', 'batman', 'pokemon',
    'pikachu', 'minecraft', 'fortnite', 'roblox', 'tiktok', 'insta',
    'letmein', 'iloveyou', 'football', 'baseball', 'qwerty', 'azerty',
    'admin', 'login', 'secret', 'shadow', 'ninja', 'angel', 'happy',
];

/** Toetsenbordrijen (QWERTY) waaruit voorspelbare 3+-reeksen worden afgeleid. */
const KEYBOARD_ROWS: readonly string[] = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

const buildKeyboardSequences = (): string[] => {
    const seqs = new Set<string>();
    for (const row of KEYBOARD_ROWS) {
        for (let i = 0; i <= row.length - 3; i++) {
            const fwd = row.slice(i, i + 3);
            seqs.add(fwd);
            seqs.add([...fwd].reverse().join(''));
        }
    }
    return [...seqs];
};

/** Voorspelbare toetsenbordreeksen van 3+ tekens, bv. "qwerty", "asdf", "zxcvbn". */
const KEYBOARD_SEQUENCES: readonly string[] = buildKeyboardSequences();

/** Leetspeak-substituties die aanvallers standaard terugvertalen. */
const LEET_MAP: Record<string, string> = {
    '@': 'a',
    '4': 'a',
    '8': 'b',
    '3': 'e',
    '€': 'e',
    '1': 'i',
    '!': 'i',
    '0': 'o',
    '$': 's',
    '5': 's',
    '7': 't',
    '+': 't',
};

// === Types ===

export interface AttackResult {
    attackId: AttackId;
    /** Gesimuleerde tijd die déze aanval nodig heeft (SAFE_SECONDS = vindt niets). */
    crackSeconds: number;
    /** Leesbaar tijdslabel, bv. "2 seconden" of "veilig voor deze aanval". */
    timeLabel: string;
    /** Of deze aanval het rondedoel breekt (sneller kraakt dan targetSeconds). */
    broken: boolean;
    /** Korte uitleg van wat de aanval vond. */
    detail: string;
    /** Gevonden woorden/patronen (voor weergave). */
    found: string[];
}

export interface CharClasses {
    lower: boolean;
    upper: boolean;
    digit: boolean;
    symbol: boolean;
}

export interface FortressReport {
    results: AttackResult[];
    /** Zwakste schakel over alle actieve aanvallen. */
    crackSeconds: number;
    timeLabel: string;
    /** Fort houdt stand: geen enkele actieve aanval haalt het rondedoel. */
    holds: boolean;
    /** 0–4 schild-segmenten voor de meter. */
    shieldLevel: number;
    length: number;
    classes: CharClasses;
}

interface ScanResult {
    /** Effectieve lengte nadat gevonden woorden/patronen zijn ingekort. */
    effectiveLength: number;
    foundWords: string[];
    foundPatterns: string[];
}

// === Basishelpers ===

export const getCharClasses = (pw: string): CharClasses => ({
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^a-zA-Z0-9]/.test(pw),
});

const charsetSize = (classes: CharClasses): number =>
    (classes.lower ? 26 : 0) +
    (classes.upper ? 26 : 0) +
    (classes.digit ? 10 : 0) +
    (classes.symbol ? 33 : 0);

/** Brute-force: gemiddeld de helft van alle combinaties proberen. */
const bruteSeconds = (length: number, classes: CharClasses): number => {
    if (length <= 0) return 0;
    const size = Math.max(charsetSize(classes), 1);
    return Math.pow(size, length) / 2 / GUESSES_PER_SECOND;
};

/** Vertaal leetspeak terug naar letters (zoals echte aanvalslijsten doen). */
export const deLeet = (pw: string): string =>
    pw
        .toLowerCase()
        .split('')
        .map(ch => LEET_MAP[ch] ?? ch)
        .join('');

/**
 * Scan een (lowercase) string op woordenlijst-woorden, jaartallen en cijferreeksen.
 * Elk gevonden woord telt nog maar als ~3 tekens, elk jaartal/cijferpatroon als 1.
 * Greedy: langste woorden eerst, zonder overlap.
 */
const scanForPatterns = (lowered: string): ScanResult => {
    const consumed = new Array<boolean>(lowered.length).fill(false);
    const foundWords: string[] = [];
    const foundPatterns: string[] = [];
    let effectiveLength = lowered.length;

    const claim = (start: number, len: number): boolean => {
        for (let i = start; i < start + len; i++) {
            if (consumed[i]) return false;
        }
        for (let i = start; i < start + len; i++) consumed[i] = true;
        return true;
    };

    // 1) Woordenlijst — langste woorden eerst
    const sorted = [...WORDLIST].sort((a, b) => b.length - a.length);
    for (const word of sorted) {
        let from = 0;
        while (true) {
            const idx = lowered.indexOf(word, from);
            if (idx === -1) break;
            if (claim(idx, word.length)) {
                foundWords.push(word);
                effectiveLength -= word.length - 3; // woord ≈ 3 tekens
            }
            from = idx + 1;
        }
    }

    // 2) Jaartallen 1950–2039 — aanvallers proberen die als eerste
    const yearRe = /(19[5-9][0-9]|20[0-3][0-9])/g;
    let m: RegExpExecArray | null;
    while ((m = yearRe.exec(lowered)) !== null) {
        if (claim(m.index, 4)) {
            foundPatterns.push(`jaartal ${m[0]}`);
            effectiveLength -= 3; // jaartal ≈ 1 teken
        }
    }

    // 3) Herhaalde tekens (3+, ook letters — bv. "aaaa") en cijferreeksen (123, abc) op de rest
    const seqRe = /(.)\1{2,}|012|123|234|345|456|567|678|789|abc|xyz/g;
    while ((m = seqRe.exec(lowered)) !== null) {
        const len = m[0].length;
        if (claim(m.index, len)) {
            foundPatterns.push(`reeks ${m[0]}`);
            effectiveLength -= len - 1; // reeks ≈ 1 teken
        }
    }

    // 4) Toetsenbordreeksen van 3+ (qwerty, asdf, zxcvbn…) op de rest
    for (const seq of KEYBOARD_SEQUENCES) {
        let from = 0;
        while (true) {
            const idx = lowered.indexOf(seq, from);
            if (idx === -1) break;
            if (claim(idx, seq.length)) {
                foundPatterns.push(`toetsenbordreeks ${seq}`);
                effectiveLength -= seq.length - 1;
            }
            from = idx + 1;
        }
    }

    return { effectiveLength: Math.max(effectiveLength, 1), foundWords, foundPatterns };
};

// === Tijdslabels ===

const plural = (n: number, singular: string, pluralWord: string): string =>
    `${n.toLocaleString('nl-NL')} ${n === 1 ? singular : pluralWord}`;

export const formatSeconds = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return 'veilig voor deze aanval';
    if (seconds < 1) return 'minder dan 1 seconde';
    if (seconds < SECONDS_PER_MINUTE) return plural(Math.round(seconds), 'seconde', 'seconden');
    if (seconds < SECONDS_PER_HOUR) return plural(Math.round(seconds / SECONDS_PER_MINUTE), 'minuut', 'minuten');
    if (seconds < SECONDS_PER_DAY) return plural(Math.round(seconds / SECONDS_PER_HOUR), 'uur', 'uur');
    if (seconds < SECONDS_PER_MONTH) return plural(Math.round(seconds / SECONDS_PER_DAY), 'dag', 'dagen');
    if (seconds < SECONDS_PER_YEAR) return plural(Math.round(seconds / SECONDS_PER_MONTH), 'maand', 'maanden');
    const years = seconds / SECONDS_PER_YEAR;
    if (years > 1_000_000) return 'miljoenen jaren';
    if (years > 1_000) {
        const thousands = Math.round(years / 1_000);
        return thousands === 1 ? 'ruim duizend jaar' : `${thousands.toLocaleString('nl-NL')} duizend jaar`;
    }
    return plural(Math.round(years), 'jaar', 'jaar');
};

// === De vier aanvallen ===

const runBruteForce = (pw: string): Omit<AttackResult, 'broken'> => {
    const classes = getCharClasses(pw);
    // Herhaalde tekens en toetsenbordreeksen leveren geen extra combinaties op,
    // ook al tellen ze wél mee in de ruwe lengte — begrens de entropie daarom
    // op de werkelijke variatie in het wachtwoord.
    const { effectiveLength } = scanForPatterns(pw.toLowerCase());
    const seconds = bruteSeconds(effectiveLength, classes);
    return {
        attackId: 'brute-force',
        crackSeconds: seconds,
        timeLabel: formatSeconds(seconds),
        detail: `Probeert álle combinaties: ${pw.length} tekens, tekenset van ${charsetSize(classes)}.`,
        found: [],
    };
};

const runDictionary = (pw: string): Omit<AttackResult, 'broken'> => {
    const lowered = pw.toLowerCase();
    const scan = scanForPatterns(lowered);
    const hits = [...scan.foundWords, ...scan.foundPatterns];
    if (hits.length === 0) {
        return {
            attackId: 'dictionary',
            crackSeconds: SAFE_SECONDS,
            timeLabel: formatSeconds(SAFE_SECONDS),
            detail: 'Geen bekende woorden of patronen gevonden.',
            found: [],
        };
    }
    const seconds = bruteSeconds(scan.effectiveLength, getCharClasses(pw));
    return {
        attackId: 'dictionary',
        crackSeconds: seconds,
        timeLabel: formatSeconds(seconds),
        detail: `Gevonden: ${hits.map(h => `"${h}"`).join(', ')} — een heel woord telt maar als ±3 tekens.`,
        found: hits,
    };
};

const runLeet = (pw: string): Omit<AttackResult, 'broken'> => {
    const plain = pw.toLowerCase();
    const translated = deLeet(pw);
    if (translated === plain) {
        return {
            attackId: 'leet',
            crackSeconds: SAFE_SECONDS,
            timeLabel: formatSeconds(SAFE_SECONDS),
            detail: 'Geen leetspeak-substituties gevonden om terug te vertalen.',
            found: [],
        };
    }
    const scanPlain = scanForPatterns(plain);
    const scanLeet = scanForPatterns(translated);
    const newWords = scanLeet.foundWords.filter(w => !scanPlain.foundWords.includes(w));
    const newPatterns = scanLeet.foundPatterns.filter(p => !scanPlain.foundPatterns.includes(p));
    const hits = [...newWords, ...newPatterns];
    if (hits.length === 0) {
        return {
            attackId: 'leet',
            crackSeconds: SAFE_SECONDS,
            timeLabel: formatSeconds(SAFE_SECONDS),
            detail: 'Substituties teruggedraaid, maar er kwam geen bekend woord tevoorschijn.',
            found: [],
        };
    }
    const seconds = bruteSeconds(scanLeet.effectiveLength, getCharClasses(translated));
    return {
        attackId: 'leet',
        crackSeconds: seconds,
        timeLabel: formatSeconds(seconds),
        detail: `Vertaalde je trucs terug (@→a, 0→o, 3→e…) en herkende: ${hits.map(h => `"${h}"`).join(', ')}.`,
        found: hits,
    };
};

const runBreached = (pw: string): Omit<AttackResult, 'broken'> => {
    const lowered = pw.toLowerCase().trim();
    const translated = deLeet(pw).trim();
    const hit = KNOWN_BREACHED.has(lowered)
        ? lowered
        : KNOWN_BREACHED.has(translated)
          ? translated
          : null;
    if (hit) {
        return {
            attackId: 'breached',
            crackSeconds: 0.5,
            timeLabel: 'direct — staat in gelekte lijsten',
            detail: `"${hit}" staat in bekende datalekken en wordt als állereerste geprobeerd.`,
            found: [hit],
        };
    }
    return {
        attackId: 'breached',
        crackSeconds: SAFE_SECONDS,
        timeLabel: formatSeconds(SAFE_SECONDS),
        detail: 'Niet gevonden in de lijst met bekende gelekte wachtwoorden.',
        found: [],
    };
};

const ATTACK_RUNNERS: Record<AttackId, (pw: string) => Omit<AttackResult, 'broken'>> = {
    'brute-force': runBruteForce,
    dictionary: runDictionary,
    leet: runLeet,
    breached: runBreached,
};

// === Weergave-metadata per aanval ===

export const ATTACK_META: Record<AttackId, { name: string; emoji: string; description: string }> = {
    'brute-force': {
        name: 'Brute-force',
        emoji: '🔨',
        description: 'Probeert alle mogelijke combinaties, één voor één.',
    },
    dictionary: {
        name: 'Woordenboekaanval',
        emoji: '📖',
        description: 'Probeert bekende woorden, namen, jaartallen en reeksen.',
    },
    leet: {
        name: 'Leetspeak-variaties',
        emoji: '🔁',
        description: 'Vertaalt trucs als @→a en 0→o terug naar gewone woorden.',
    },
    breached: {
        name: 'Credential stuffing',
        emoji: '🗄️',
        description: 'Probeert wachtwoorden die al eens gelekt zijn bij datalekken.',
    },
};

// === Hoofdfunctie ===

export const shieldLevelFor = (seconds: number): number => {
    if (seconds >= 100 * SECONDS_PER_YEAR) return 4;
    if (seconds >= SECONDS_PER_YEAR) return 3;
    if (seconds >= SECONDS_PER_MONTH) return 2;
    if (seconds >= SECONDS_PER_DAY) return 1;
    return 0;
};

/**
 * Voer alle actieve aanvallen uit tegen het wachtwoord.
 * Volledig deterministisch en synchroon — geen netwerk, geen AI.
 */
export const runAttacks = (
    pw: string,
    attacks: AttackId[],
    targetSeconds: number
): FortressReport => {
    const results: AttackResult[] = attacks.map(id => {
        const base = ATTACK_RUNNERS[id](pw);
        return { ...base, broken: base.crackSeconds < targetSeconds };
    });

    const crackSeconds = results.reduce(
        (min, r) => Math.min(min, r.crackSeconds),
        SAFE_SECONDS
    );

    return {
        results,
        crackSeconds,
        timeLabel: Number.isFinite(crackSeconds)
            ? formatSeconds(crackSeconds)
            : 'onbekend',
        holds: results.every(r => !r.broken),
        shieldLevel: shieldLevelFor(crackSeconds),
        length: pw.length,
        classes: getCharClasses(pw),
    };
};
