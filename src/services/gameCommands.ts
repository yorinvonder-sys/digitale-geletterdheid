// ============================================================================
// gameCommands.ts — Deterministic command parser for the "game-programmeur" mission.
//
// Maps a learner's typed request (e.g. "maak de speler blauw") to a targeted,
// SAFE edit of the game's HTML. Only known `let X = …;` declarations (and the
// jump-sound parameters) are swapped via regex, so the rest of the game stays
// untouched and can never break. Returns `null` when nothing is recognized, so
// the caller can fall back to a normal chat reply.
//
// The variable names below match the mission's initialCode in
// src/config/agents/year1.tsx (playerColor, jumpForce, gravity, obstacleSpeed,
// obstacleColor, skyColor1/2, groundColor, grassColor + playJumpSound()).
// ============================================================================

export interface GameCommandResult {
    /** Full updated game HTML. */
    code: string;
    /** Mission step that this change completes (1 Kleur … 5 Uiterlijk). */
    stepId: 1 | 2 | 3 | 4 | 5;
    /** Short, friendly coach line shown in the chat. Never contains code. */
    summary: string;
}

const COLOR_MAP: Record<string, string> = {
    rood: '#E5484D', red: '#E5484D',
    blauw: '#3B82F6', blue: '#3B82F6',
    groen: '#3DD68C', green: '#3DD68C',
    geel: '#FACC15', yellow: '#FACC15',
    oranje: '#F97316', orange: '#F97316',
    paars: '#A855F7', purple: '#A855F7',
    roze: '#EC4899', roos: '#EC4899', pink: '#EC4899',
    zwart: '#1A1A1A', black: '#1A1A1A',
    wit: '#FFFFFF', white: '#FFFFFF',
    grijs: '#9CA3AF', gray: '#9CA3AF', grey: '#9CA3AF',
    bruin: '#92400E', brown: '#92400E',
    cyaan: '#22D3EE', cyan: '#22D3EE', turquoise: '#22D3EE', turkoois: '#22D3EE',
};

const COLOR_LABEL_NL: Record<string, string> = {
    '#E5484D': 'rood', '#3B82F6': 'blauw', '#3DD68C': 'groen', '#FACC15': 'geel',
    '#F97316': 'oranje', '#A855F7': 'paars', '#EC4899': 'roze', '#1A1A1A': 'zwart',
    '#FFFFFF': 'wit', '#9CA3AF': 'grijs', '#92400E': 'bruin', '#22D3EE': 'cyaan',
};

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, ''); // strip accents (e.g. é -> e)
}

function findColor(text: string): string | null {
    for (const word of Object.keys(COLOR_MAP)) {
        if (new RegExp(`\\b${word}\\b`).test(text)) return COLOR_MAP[word];
    }
    return null;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/** Swap a quoted-string assignment: `let <name> = '...';`. No-op if not found. */
function replaceColorVar(code: string, name: string, hex: string): string {
    return code.replace(new RegExp(`(let\\s+${name}\\s*=\\s*)'[^']*'`), `$1'${hex}'`);
}

/** Recompute a numeric assignment: `let <name> = <num>;`. No-op if not found. */
function replaceNumberVar(code: string, name: string, compute: (old: number) => number): string {
    return code.replace(
        new RegExp(`(let\\s+${name}\\s*=\\s*)(-?\\d+(?:\\.\\d+)?)`),
        (_m, prefix: string, num: string) => {
            const next = compute(parseFloat(num));
            const formatted = Number.isInteger(next) ? String(next) : String(Math.round(next * 100) / 100);
            return `${prefix}${formatted}`;
        },
    );
}

interface SoundProfile { type: string; start: number; end: number; gain: number; }

/** Re-tune the existing playJumpSound() oscillator. No-op if the function is absent. */
function changeSound(code: string, p: SoundProfile): string {
    return code
        .replace(/(oscillator\.type\s*=\s*)'[^']*'/, `$1'${p.type}'`)
        .replace(/(oscillator\.frequency\.setValueAtTime\()\d+(?:\.\d+)?/, `$1${p.start}`)
        .replace(/(oscillator\.frequency\.exponentialRampToValueAtTime\()\d+(?:\.\d+)?/, `$1${p.end}`)
        .replace(/(gainNode\.gain\.setValueAtTime\()[\d.]+/, `$1${p.gain}`);
}

export function applyGameCommand(code: string, rawText: string): GameCommandResult | null {
    if (!code) return null;
    const text = normalize(rawText);
    const has = (...words: string[]) => words.some(w => text.includes(w));

    // --- STEP 4: Geluid ---------------------------------------------------
    if (has('geluid', 'sound', 'geluidje')) {
        let profile: SoundProfile;
        if (has('hard', 'hoog', 'hoger', 'luid', 'luider')) {
            profile = { type: 'triangle', start: 660, end: 1200, gain: 0.14 };
        } else if (has('zacht', 'laag', 'lager')) {
            profile = { type: 'sine', start: 200, end: 320, gain: 0.1 };
        } else {
            profile = { type: 'sawtooth', start: 440, end: 900, gain: 0.12 };
        }
        return {
            code: changeSound(code, profile),
            stepId: 4,
            summary: 'Het springgeluid klinkt nu anders 🔊 — spring eens (spatie of klik) en luister!',
        };
    }

    // --- STEP 2: Zwaartekracht (vallen) -----------------------------------
    if (has('zwaartekracht', 'gravity', 'vallen', 'valt', 'val ', 'zweef', 'zweven', 'maan', 'floaty')) {
        const lighter = has('lichter', 'minder', 'langzamer', 'zachter', 'zweef', 'zweven', 'maan', 'floaty', 'licht');
        return {
            code: replaceNumberVar(code, 'gravity', old => clamp(old * (lighter ? 0.7 : 1.3), 0.2, 2)),
            stepId: 2,
            summary: lighter
                ? 'De zwaartekracht is lichter — Robbie zweeft meer 🪶. Test het in de preview!'
                : 'De zwaartekracht is sterker — Robbie valt sneller 💪. Voelt het pittiger?',
        };
    }

    // --- STEP 2: Springen (alleen met richting) ---------------------------
    if (has('spring', 'jump', 'hoog') && has('hoog', 'hoger', 'laag', 'lager', 'meer', 'minder', 'dubbel', 'twee keer', 'verder', 'higher', 'lower')) {
        const lower = has('lager', 'laag', 'minder', 'lower');
        const big = has('dubbel', 'twee keer', 'veel');
        const factor = lower ? 0.75 : big ? 1.4 : 1.25;
        return {
            code: replaceNumberVar(code, 'jumpForce', old => clamp(old * factor, -40, -6)),
            stepId: 2,
            summary: lower
                ? 'Oké, Robbie springt nu lager — handig voor precisie. Wat verander je hierna?'
                : 'Boem! Robbie springt nu hoger 🚀 — test het even. Wil je ook de snelheid aanpassen?',
        };
    }

    // --- STEP 3: Snelheid -------------------------------------------------
    if (has('snel', 'sneller', 'langzaam', 'langzamer', 'traag', 'trager', 'speed', 'moeilijk', 'makkelijk', 'easy', 'rapper')) {
        const slower = has('langzaam', 'langzamer', 'traag', 'trager', 'makkelijk', 'easy', 'rustig');
        return {
            code: replaceNumberVar(code, 'obstacleSpeed', old => clamp(old * (slower ? 0.7 : 1.4), 2, 20)),
            stepId: 3,
            summary: slower
                ? 'De obstakels komen nu rustiger aan — wat makkelijker. Wat verander je hierna?'
                : 'De obstakels komen nu sneller — moeilijker! 🔥 Houd je het vol?',
        };
    }

    // --- STEP 1 / 5: Kleuren ----------------------------------------------
    const hex = findColor(text);
    if (hex) {
        const label = COLOR_LABEL_NL[hex] ?? 'die kleur';

        if (has('achtergrond', 'lucht', 'sky', 'background', 'hemel')) {
            const next = replaceColorVar(replaceColorVar(code, 'skyColor1', hex), 'skyColor2', hex);
            return { code: next, stepId: 5, summary: `De achtergrond is nu ${label} 🌈 — mooi! Probeer ook eens de speler of de snelheid.` };
        }
        if (has('obstakel', 'buis', 'pijp', 'paal', 'vijand', 'blok', 'muur', 'pipe', 'obstacle')) {
            return { code: replaceColorVar(code, 'obstacleColor', hex), stepId: 5, summary: `De obstakels zijn nu ${label} 🟫 — top! Wat wil je nog meer aanpassen?` };
        }
        if (has('gras', 'grass')) {
            return { code: replaceColorVar(code, 'grassColor', hex), stepId: 5, summary: `Het gras is nu ${label} 🌱 — top! Wat verander je hierna?` };
        }
        if (has('grond', 'vloer', 'ground', 'bodem')) {
            return { code: replaceColorVar(code, 'groundColor', hex), stepId: 5, summary: `De grond is nu ${label} — netjes! Probeer ook de achtergrond of het springen.` };
        }
        // Default target: the player (the primary "Kleur" step).
        return { code: replaceColorVar(code, 'playerColor', hex), stepId: 1, summary: `Top! De speler is nu ${label} 🎨 — zie je het in de preview? Wat verander je hierna?` };
    }

    return null;
}
