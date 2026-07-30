/**
 * Game-spec contract voor het publieke AI Game Lab.
 *
 * DIT BESTAND IS DE VEILIGHEIDSGRENS TUSSEN MODELUITVOER EN DE CANVAS-RENDERER.
 *
 * De AI stuurt nooit code — alleen een <GAME_STATE>-JSON-blok. `parseGameSpec`
 * bouwt daaruit een vers object veld-voor-veld: elke enum is gewhitelist, elk
 * getal geclamped, elke kleur regex-gevalideerd. Onbekende sleutels (denk aan
 * `__proto__`) kunnen er structureel niet doorheen, want er wordt nooit
 * gespreid of ge-assign'd op de bestaande spec.
 *
 * Plain ESM (geen TypeScript) zodat `node --test` het rechtstreeks kan
 * importeren; de typen staan in het gelijknamige `gameSpec.d.ts`.
 */

export const MAX_SPEC_BLOCK_CHARS = 2000;

const GAME_STATE_BLOCK = /<GAME_STATE>([\s\S]*?)<\/GAME_STATE>/gi;

export const CHARACTER_TYPES = ['robot', 'astronaut', 'kat', 'draak', 'ninja', 'eenhoorn'];
export const OBSTACLE_TYPES = ['cactus', 'rots', 'krat', 'ijspegel', 'vuur', 'robotarm'];
export const COLLECTIBLE_TYPES = ['munt', 'ster', 'kristal', 'appel', 'diamant'];
export const POWERUPS = ['geen', 'dubbelsprong', 'schild', 'magneet', 'turbo'];
export const WIN_TYPES = ['score', 'survive'];

/** Nederlandse kleurnamen — het model schrijft "rood" vaker dan "#ff0000". */
const COLOR_NAMES = {
    rood: '#e2463c',
    blauw: '#2f6fd0',
    lichtblauw: '#7cc4f2',
    donkerblauw: '#12305c',
    groen: '#3f9e5c',
    lichtgroen: '#7fd18f',
    donkergroen: '#1f5f38',
    geel: '#f2ce3a',
    paars: '#8452c4',
    oranje: '#e88a3c',
    roze: '#ee85b5',
    wit: '#f7f7f2',
    zwart: '#141417',
    grijs: '#9a9a95',
    bruin: '#8a5a3b',
    goud: '#d7c95f',
    zilver: '#c9ccd1',
    turquoise: '#3fb8ae',
};

const SHORT_HEX = /^#([0-9a-f]{3})$/i;
const LONG_HEX = /^#([0-9a-f]{6})$/i;
const THEME_ALLOWED = /[^\p{L}\p{N} \-!]/gu;

export const DEFAULT_GAME_SPEC = Object.freeze({
    theme: 'Startwereld',
    sky: '#08283b',
    ground: '#5f947d',
    character: '#d7c95f',
    accent: '#e1ff01',
    characterType: 'robot',
    gravity: 1,
    jumpHeight: 11,
    speed: 3,
    obstacleCount: 2,
    obstacleType: 'rots',
    collectibleCount: 5,
    collectibleType: 'munt',
    powerup: 'geen',
    winCondition: Object.freeze({ type: 'score', target: 8 }),
    background: Object.freeze({ clouds: true, stars: false, mountains: true, trees: false, moon: false }),
});

/* ── Veldnormalisatie ─────────────────────────────────────────────── */

function normalizeHex(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();

    // hasOwnProperty, niet een gewone lookup: anders levert "constructor" of
    // "__proto__" een waarde uit de prototypeketen op in plaats van een kleur,
    // en dan is niet langer waar dat elke kleur regex-gevalideerd is.
    const key = trimmed.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(COLOR_NAMES, key)) return COLOR_NAMES[key];

    const short = trimmed.match(SHORT_HEX);
    if (short) {
        const [r, g, b] = short[1].toLowerCase();
        return `#${r}${r}${g}${g}${b}${b}`;
    }

    const long = trimmed.match(LONG_HEX);
    if (long) return `#${long[1].toLowerCase()}`;

    return fallback;
}

function clampNumber(value, min, max, fallback, { int = false } = {}) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
    const clamped = Math.min(max, Math.max(min, value));
    return int ? Math.round(clamped) : clamped;
}

function pickEnum(value, allowed, fallback) {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim().toLowerCase();
    return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeBoolean(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
}

function normalizeTheme(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const cleaned = value.replace(THEME_ALLOWED, '').trim().slice(0, 24).trim();
    return cleaned.length > 0 ? cleaned : fallback;
}

function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Oudere modelgewoontes (en de vorige demo) gebruiken andere veldnamen.
 * Zonder deze vertaling levert zo'n antwoord een stille no-op op, en dat kost
 * de bezoeker een van zijn tien prompts.
 */
function applyLegacyAliases(raw) {
    const aliased = { ...raw };

    if (typeof raw.speed === 'string') {
        const legacySpeed = { slow: 2, normal: 3, fast: 4 }[raw.speed.trim().toLowerCase()];
        if (legacySpeed !== undefined) aliased.speed = legacySpeed;
    }
    if (aliased.obstacleCount === undefined && typeof raw.obstacles === 'number') {
        aliased.obstacleCount = raw.obstacles;
    }
    if (aliased.collectibleCount === undefined && typeof raw.coins === 'number') {
        aliased.collectibleCount = raw.coins;
    }

    const legacyBackground = {};
    if (typeof raw.clouds === 'boolean') legacyBackground.clouds = raw.clouds;
    if (typeof raw.stars === 'boolean') legacyBackground.stars = raw.stars;
    if (Object.keys(legacyBackground).length > 0) {
        aliased.background = isPlainObject(raw.background)
            ? { ...legacyBackground, ...raw.background }
            : legacyBackground;
    }

    return aliased;
}

/* ── Publieke API ─────────────────────────────────────────────────── */

/**
 * Bouwt een nieuwe spec uit een modelantwoord.
 *
 * De fallback per veld is `previous[veld]`, niet de default. Daardoor is
 * `{"sky":"#ff0000"}` een geldige, minimale patch: de lucht kleurt rood en al
 * het andere blijft staan zoals de bezoeker het had.
 *
 * @param {string} text ruw modelantwoord
 * @param {object} [previous] laatst geldige spec
 * @returns {{spec: object, applied: boolean, reason: string}}
 */
export function parseGameSpec(text, previous = DEFAULT_GAME_SPEC) {
    const base = isPlainObject(previous) ? previous : DEFAULT_GAME_SPEC;
    const fail = (reason) => ({ spec: cloneSpec(base), applied: false, reason });

    if (typeof text !== 'string' || text.length === 0) return fail('no_block');

    // Modellen sturen soms twee blokken; het laatste is de bedoelde eindstaat.
    GAME_STATE_BLOCK.lastIndex = 0;
    let lastBlock = null;
    let match;
    while ((match = GAME_STATE_BLOCK.exec(text)) !== null) {
        lastBlock = match[1];
    }
    if (lastBlock === null) return fail('no_block');

    const rawJson = lastBlock.trim();
    // Lengtecheck vóór JSON.parse: een megablok mag geen parser-tijd kosten.
    if (rawJson.length > MAX_SPEC_BLOCK_CHARS) return fail('too_large');

    let parsed;
    try {
        parsed = JSON.parse(rawJson);
    } catch {
        return fail('invalid_json');
    }
    if (!isPlainObject(parsed)) return fail('not_object');

    const raw = applyLegacyAliases(parsed);
    const prevWin = isPlainObject(base.winCondition) ? base.winCondition : DEFAULT_GAME_SPEC.winCondition;
    const prevBg = isPlainObject(base.background) ? base.background : DEFAULT_GAME_SPEC.background;
    const rawWin = isPlainObject(raw.winCondition) ? raw.winCondition : {};
    const rawBg = isPlainObject(raw.background) ? raw.background : {};

    const winType = pickEnum(rawWin.type, WIN_TYPES, prevWin.type);
    // Score en overleeftijd hebben verschillende zinnige bereiken; het bereik
    // volgt het gekozen type, niet het vorige.
    const winBounds = winType === 'survive' ? { min: 10, max: 60 } : { min: 3, max: 20 };
    const winFallback = winType === prevWin.type ? prevWin.target : (winType === 'survive' ? 20 : 8);

    return {
        spec: {
            theme: normalizeTheme(raw.theme, base.theme),
            sky: normalizeHex(raw.sky, base.sky),
            ground: normalizeHex(raw.ground, base.ground),
            character: normalizeHex(raw.character, base.character),
            accent: normalizeHex(raw.accent, base.accent),
            characterType: pickEnum(raw.characterType, CHARACTER_TYPES, base.characterType),
            gravity: clampNumber(raw.gravity, 0.4, 2, base.gravity),
            jumpHeight: clampNumber(raw.jumpHeight, 6, 16, base.jumpHeight),
            speed: clampNumber(raw.speed, 1, 5, base.speed),
            obstacleCount: clampNumber(raw.obstacleCount, 0, 6, base.obstacleCount, { int: true }),
            obstacleType: pickEnum(raw.obstacleType, OBSTACLE_TYPES, base.obstacleType),
            collectibleCount: clampNumber(raw.collectibleCount, 0, 12, base.collectibleCount, { int: true }),
            collectibleType: pickEnum(raw.collectibleType, COLLECTIBLE_TYPES, base.collectibleType),
            powerup: pickEnum(raw.powerup, POWERUPS, base.powerup),
            winCondition: {
                type: winType,
                target: clampNumber(rawWin.target, winBounds.min, winBounds.max, winFallback, { int: true }),
            },
            background: {
                clouds: normalizeBoolean(rawBg.clouds, prevBg.clouds),
                stars: normalizeBoolean(rawBg.stars, prevBg.stars),
                mountains: normalizeBoolean(rawBg.mountains, prevBg.mountains),
                trees: normalizeBoolean(rawBg.trees, prevBg.trees),
                moon: normalizeBoolean(rawBg.moon, prevBg.moon),
            },
        },
        applied: true,
        reason: 'ok',
    };
}

function cloneSpec(spec) {
    return {
        ...spec,
        winCondition: { ...spec.winCondition },
        background: { ...spec.background },
    };
}

/** Haalt het GAME_STATE-blok uit de tekst die de bezoeker te zien krijgt. */
export function stripGameStateBlock(text) {
    if (typeof text !== 'string') return '';
    const stripped = text
        .replace(/<GAME_STATE>[\s\S]*?<\/GAME_STATE>/gi, '')
        // Een afgekapt antwoord laat een openings-tag zonder sluiting achter.
        .replace(/<GAME_STATE>[\s\S]*$/i, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    return stripped.length > 0 ? stripped : 'Klaar! Je game is aangepast.';
}

/** Eén Nederlandse zin die de spec beschrijft — voor `aria-label`. */
export function describeSpec(spec) {
    const goal = spec.winCondition.type === 'survive'
        ? `overleef ${spec.winCondition.target} seconden`
        : `verzamel ${spec.winCondition.target} ${spec.collectibleType}s`;
    const powerup = spec.powerup === 'geen' ? 'geen power-up' : `power-up ${spec.powerup}`;
    return `Thema ${spec.theme}. Je speelt een ${spec.characterType} met ${powerup}. `
        + `${spec.obstacleCount} ${spec.obstacleType}-obstakels. Doel: ${goal}.`;
}

/** Zichtbare instellingenlijst — ook de toegankelijke weergave van de game. */
export function specSummary(spec) {
    return [
        { label: 'Thema', value: spec.theme },
        { label: 'Karakter', value: spec.characterType },
        { label: 'Obstakels', value: `${spec.obstacleCount} × ${spec.obstacleType}` },
        { label: 'Te pakken', value: `${spec.collectibleCount} × ${spec.collectibleType}` },
        { label: 'Power-up', value: spec.powerup },
        { label: 'Snelheid', value: `${spec.speed} van 5` },
        { label: 'Zwaartekracht', value: spec.gravity.toFixed(1) },
        { label: 'Springkracht', value: String(spec.jumpHeight) },
        {
            label: 'Winnen',
            value: spec.winCondition.type === 'survive'
                ? `${spec.winCondition.target} sec overleven`
                : `${spec.winCondition.target} punten`,
        },
    ];
}

/**
 * Compacte JSON met vaste sleutelvolgorde. Gaat mee als data-turn naar de edge
 * function zodat het model weet wat de huidige staat is, ook nadat de
 * gesprekshistorie op de server is afgekapt.
 */
export function specToPromptJson(spec) {
    return JSON.stringify({
        theme: spec.theme,
        sky: spec.sky,
        ground: spec.ground,
        character: spec.character,
        accent: spec.accent,
        characterType: spec.characterType,
        gravity: spec.gravity,
        jumpHeight: spec.jumpHeight,
        speed: spec.speed,
        obstacleCount: spec.obstacleCount,
        obstacleType: spec.obstacleType,
        collectibleCount: spec.collectibleCount,
        collectibleType: spec.collectibleType,
        powerup: spec.powerup,
        winCondition: { type: spec.winCondition.type, target: spec.winCondition.target },
        background: {
            clouds: spec.background.clouds,
            stars: spec.background.stars,
            mountains: spec.background.mountains,
            trees: spec.background.trees,
            moon: spec.background.moon,
        },
    });
}
