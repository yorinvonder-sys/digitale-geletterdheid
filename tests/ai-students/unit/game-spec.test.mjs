import assert from 'node:assert/strict';
import test from 'node:test';

const {
    DEFAULT_GAME_SPEC,
    MAX_SPEC_BLOCK_CHARS,
    parseGameSpec,
    stripGameStateBlock,
    describeSpec,
    specSummary,
    specToPromptJson,
} = await import('../../../src/features/public-site/game-lab/gameSpec.js');

/** Bouwt een modelantwoord met een GAME_STATE-blok. */
const reply = (obj, prose = 'Top! Ik heb het aangepast.') =>
    `${prose}\n<GAME_STATE>\n${typeof obj === 'string' ? obj : JSON.stringify(obj)}\n</GAME_STATE>`;

/* ── Blok herkennen ───────────────────────────────────────────────── */

test('zonder GAME_STATE-blok blijft de vorige spec staan', () => {
    const result = parseGameSpec('Leuk idee! Welke kleur wil je?', DEFAULT_GAME_SPEC);
    assert.equal(result.applied, false);
    assert.equal(result.reason, 'no_block');
    assert.deepEqual(result.spec, structuredClone(DEFAULT_GAME_SPEC));
});

test('lege of niet-string invoer valt terug zonder te gooien', () => {
    assert.equal(parseGameSpec('', DEFAULT_GAME_SPEC).reason, 'no_block');
    assert.equal(parseGameSpec(undefined, DEFAULT_GAME_SPEC).reason, 'no_block');
    assert.equal(parseGameSpec(null, DEFAULT_GAME_SPEC).reason, 'no_block');
});

test('kapotte JSON levert invalid_json en behoudt de vorige spec', () => {
    const result = parseGameSpec(reply('{ "theme": "Ruimte", }'), DEFAULT_GAME_SPEC);
    assert.equal(result.applied, false);
    assert.equal(result.reason, 'invalid_json');
    assert.equal(result.spec.theme, DEFAULT_GAME_SPEC.theme);
});

test('een array of primitief in het blok is geen geldige spec', () => {
    assert.equal(parseGameSpec(reply('[1,2,3]'), DEFAULT_GAME_SPEC).reason, 'not_object');
    assert.equal(parseGameSpec(reply('"ruimte"'), DEFAULT_GAME_SPEC).reason, 'not_object');
    assert.equal(parseGameSpec(reply('null'), DEFAULT_GAME_SPEC).reason, 'not_object');
});

test('een te groot blok wordt geweigerd zonder te parsen', () => {
    const huge = JSON.stringify({ theme: 'x'.repeat(MAX_SPEC_BLOCK_CHARS + 200) });
    const result = parseGameSpec(reply(huge), DEFAULT_GAME_SPEC);
    assert.equal(result.applied, false);
    assert.equal(result.reason, 'too_large');
});

test('bij twee blokken wint het laatste', () => {
    const text = `${reply({ theme: 'Eerste' })}\n${reply({ theme: 'Tweede' })}`;
    assert.equal(parseGameSpec(text, DEFAULT_GAME_SPEC).spec.theme, 'Tweede');
});

/* ── Prototype pollution ──────────────────────────────────────────── */

test('een __proto__-payload vervuilt Object.prototype niet', () => {
    const payload = '{"theme":"Hack","__proto__":{"polluted":"ja"},"constructor":{"x":1}}';
    const result = parseGameSpec(reply(payload), DEFAULT_GAME_SPEC);

    assert.equal(({}).polluted, undefined);
    assert.equal(DEFAULT_GAME_SPEC.polluted, undefined);
    assert.equal(result.spec.polluted, undefined);
    assert.equal(result.spec.theme, 'Hack');
});

test('onbekende velden komen niet in de spec terecht', () => {
    const result = parseGameSpec(reply({ theme: 'Ruimte', onError: 'alert(1)', script: '<img>' }), DEFAULT_GAME_SPEC);
    assert.equal(result.spec.onError, undefined);
    assert.equal(result.spec.script, undefined);
    assert.deepEqual(
        Object.keys(result.spec).sort(),
        Object.keys(DEFAULT_GAME_SPEC).sort()
    );
});

/* ── Clampen en whitelisten ───────────────────────────────────────── */

test('getallen buiten bereik worden geclamped', () => {
    const result = parseGameSpec(
        reply({ obstacleCount: 999, collectibleCount: -4, gravity: -5, jumpHeight: 1000, speed: 42 }),
        DEFAULT_GAME_SPEC
    );
    assert.equal(result.spec.obstacleCount, 6);
    assert.equal(result.spec.collectibleCount, 0);
    assert.equal(result.spec.gravity, 0.4);
    assert.equal(result.spec.jumpHeight, 16);
    assert.equal(result.spec.speed, 5);
});

test('NaN, Infinity en numerieke strings vallen terug op de vorige waarde', () => {
    const result = parseGameSpec(
        reply('{"gravity":null,"speed":"3","jumpHeight":1e999,"obstacleCount":"veel"}'),
        DEFAULT_GAME_SPEC
    );
    assert.equal(result.spec.gravity, DEFAULT_GAME_SPEC.gravity);
    assert.equal(result.spec.speed, DEFAULT_GAME_SPEC.speed);
    assert.equal(result.spec.jumpHeight, DEFAULT_GAME_SPEC.jumpHeight);
    assert.equal(result.spec.obstacleCount, DEFAULT_GAME_SPEC.obstacleCount);
});

test('obstakel- en itemaantallen worden hele getallen', () => {
    const result = parseGameSpec(reply({ obstacleCount: 3.7, collectibleCount: 2.2 }), DEFAULT_GAME_SPEC);
    assert.equal(result.spec.obstacleCount, 4);
    assert.equal(result.spec.collectibleCount, 2);
});

test('een onbekende enum houdt de vorige waarde', () => {
    const previous = { ...structuredClone(DEFAULT_GAME_SPEC), characterType: 'draak' };
    const result = parseGameSpec(reply({ characterType: 'tyrannosaurus', powerup: 'onsterfelijk' }), previous);
    assert.equal(result.spec.characterType, 'draak');
    assert.equal(result.spec.powerup, DEFAULT_GAME_SPEC.powerup);
});

test('enums zijn hoofdletterongevoelig', () => {
    const result = parseGameSpec(reply({ characterType: 'Draak', obstacleType: '  VUUR ' }), DEFAULT_GAME_SPEC);
    assert.equal(result.spec.characterType, 'draak');
    assert.equal(result.spec.obstacleType, 'vuur');
});

/* ── Kleuren: de enige route naar een canvas-sink ─────────────────── */

test('vijandige kleurwaarden halen de spec niet', () => {
    const hostile = ['javascript:alert(1)', 'red; url(x)', '#ff0000aa', 'url(#x)', '#12345', 'rgb(1,2,3)', ''];
    for (const value of hostile) {
        const result = parseGameSpec(reply({ sky: value }), DEFAULT_GAME_SPEC);
        assert.equal(result.spec.sky, DEFAULT_GAME_SPEC.sky, `kleur "${value}" had geweigerd moeten worden`);
    }
});

test('korte hex wordt uitgeschreven en genormaliseerd naar kleine letters', () => {
    assert.equal(parseGameSpec(reply({ sky: '#F00' }), DEFAULT_GAME_SPEC).spec.sky, '#ff0000');
    assert.equal(parseGameSpec(reply({ sky: '#AABBCC' }), DEFAULT_GAME_SPEC).spec.sky, '#aabbcc');
});

test('Nederlandse kleurnamen worden vertaald naar hex', () => {
    const result = parseGameSpec(reply({ sky: 'rood', ground: 'GROEN' }), DEFAULT_GAME_SPEC);
    assert.match(result.spec.sky, /^#[0-9a-f]{6}$/);
    assert.match(result.spec.ground, /^#[0-9a-f]{6}$/);
    assert.notEqual(result.spec.sky, DEFAULT_GAME_SPEC.sky);
});

/* ── Thema ────────────────────────────────────────────────────────── */

test('thema wordt gestript en afgekapt op 24 tekens', () => {
    const result = parseGameSpec(reply({ theme: '<script>Ruimte\nbasis</script>' }), DEFAULT_GAME_SPEC);
    assert.ok(!result.spec.theme.includes('<'));
    assert.ok(!result.spec.theme.includes('\n'));
    assert.ok(result.spec.theme.length <= 24);
});

test('een thema dat volledig wordt weggestript valt terug', () => {
    const result = parseGameSpec(reply({ theme: '<<>>' }), DEFAULT_GAME_SPEC);
    assert.equal(result.spec.theme, DEFAULT_GAME_SPEC.theme);
});

/* ── Partiële patch: de kern van de UX ────────────────────────────── */

test('een patch met één veld laat de rest ongemoeid', () => {
    const previous = {
        ...structuredClone(DEFAULT_GAME_SPEC),
        theme: 'Jungle',
        characterType: 'draak',
        obstacleCount: 5,
        background: { clouds: false, stars: true, mountains: false, trees: true, moon: true },
    };
    const result = parseGameSpec(reply({ sky: '#ff0000' }), previous);

    assert.equal(result.spec.sky, '#ff0000');
    assert.equal(result.spec.theme, 'Jungle');
    assert.equal(result.spec.characterType, 'draak');
    assert.equal(result.spec.obstacleCount, 5);
    assert.deepEqual(result.spec.background, previous.background);
});

test('parseGameSpec muteert de vorige spec niet', () => {
    const previous = structuredClone(DEFAULT_GAME_SPEC);
    const snapshot = structuredClone(previous);
    parseGameSpec(reply({ theme: 'Ruimte', background: { stars: true } }), previous);
    assert.deepEqual(previous, snapshot);
});

/* ── Geneste objecten ─────────────────────────────────────────────── */

test('achtergrondvlaggen mengen met de vorige waarden', () => {
    const previous = {
        ...structuredClone(DEFAULT_GAME_SPEC),
        background: { clouds: true, stars: false, mountains: true, trees: false, moon: false },
    };
    const result = parseGameSpec(reply({ background: { stars: true, moon: true } }), previous);
    assert.deepEqual(result.spec.background, {
        clouds: true, stars: true, mountains: true, trees: false, moon: true,
    });
});

test('winvoorwaarde clampt binnen het bereik van het gekozen type', () => {
    const score = parseGameSpec(reply({ winCondition: { type: 'score', target: 500 } }), DEFAULT_GAME_SPEC);
    assert.deepEqual(score.spec.winCondition, { type: 'score', target: 20 });

    const survive = parseGameSpec(reply({ winCondition: { type: 'survive', target: 3 } }), DEFAULT_GAME_SPEC);
    assert.deepEqual(survive.spec.winCondition, { type: 'survive', target: 10 });
});

test('wisselen naar overleven zonder target geeft een bruikbare standaard', () => {
    const result = parseGameSpec(reply({ winCondition: { type: 'survive' } }), DEFAULT_GAME_SPEC);
    assert.equal(result.spec.winCondition.type, 'survive');
    assert.ok(result.spec.winCondition.target >= 10 && result.spec.winCondition.target <= 60);
});

/* ── Legacy-aliassen ──────────────────────────────────────────────── */

test('het oude speed/obstacles/clouds-formaat wordt vertaald', () => {
    const result = parseGameSpec(
        reply({ speed: 'fast', obstacles: 4, clouds: false, stars: true }),
        DEFAULT_GAME_SPEC
    );
    assert.equal(result.spec.speed, 4);
    assert.equal(result.spec.obstacleCount, 4);
    assert.equal(result.spec.background.clouds, false);
    assert.equal(result.spec.background.stars, true);
});

/* ── Hulpfuncties ─────────────────────────────────────────────────── */

test('stripGameStateBlock verwijdert het blok en houdt het proza', () => {
    const text = reply({ theme: 'Ruimte' }, 'Gaaf, een ruimtewereld!');
    assert.equal(stripGameStateBlock(text), 'Gaaf, een ruimtewereld!');
});

test('stripGameStateBlock ruimt een afgekapt blok zonder sluittag op', () => {
    const text = 'Hier komt ie!\n<GAME_STATE>\n{"theme":"Ruim';
    assert.equal(stripGameStateBlock(text), 'Hier komt ie!');
});

test('stripGameStateBlock geeft nooit een lege bubbel terug', () => {
    assert.ok(stripGameStateBlock(reply({ theme: 'X' }, '')).length > 0);
    assert.ok(stripGameStateBlock('').length > 0);
});

test('specToPromptJson blijft onder de 500 tekens', () => {
    const maximal = {
        ...structuredClone(DEFAULT_GAME_SPEC),
        theme: 'W'.repeat(24),
        characterType: 'eenhoorn',
        obstacleType: 'robotarm',
        collectibleType: 'diamant',
        powerup: 'dubbelsprong',
    };
    assert.ok(specToPromptJson(maximal).length < 500, 'spec-JSON moet compact blijven voor de prompt');
});

test('specToPromptJson levert een spec die zichzelf ongewijzigd terugleest', () => {
    const json = specToPromptJson(DEFAULT_GAME_SPEC);
    const round = parseGameSpec(`<GAME_STATE>${json}</GAME_STATE>`, DEFAULT_GAME_SPEC);
    assert.equal(round.applied, true);
    assert.deepEqual(round.spec, structuredClone(DEFAULT_GAME_SPEC));
});

test('describeSpec en specSummary beschrijven de spec zonder te gooien', () => {
    const description = describeSpec(DEFAULT_GAME_SPEC);
    assert.ok(description.includes(DEFAULT_GAME_SPEC.theme));
    assert.ok(description.includes(DEFAULT_GAME_SPEC.characterType));

    const summary = specSummary(DEFAULT_GAME_SPEC);
    assert.ok(summary.length >= 8);
    for (const row of summary) {
        assert.equal(typeof row.label, 'string');
        assert.equal(typeof row.value, 'string');
        assert.ok(row.value.length > 0);
    }
});
