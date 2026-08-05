import assert from 'node:assert/strict';
import test from 'node:test';

import {
    getFilmRenderKey,
    LEADER_DURATION,
    FRUSTRATION_DURATION,
    PUZZLE_DURATION,
    ANSWER_DURATION,
    PROOF_DURATION,
    REWARD_DURATION,
    FRUSTRATION_LINES,
} from '../../src/features/public-site/verhaal/film/timeline.ts';

/*
 * De duren komen uit timeline.ts en staan hier bewust niet nogmaals uitgeschreven.
 * Deze tests hebben eerder maandenlang gefaald doordat ze een filmleader van 3,6
 * seconden hardcodeerden nadat die in de bron naar 1 seconde was teruggebracht —
 * precies de dubbele bron die timeline.ts zelf zegt te willen vermijden.
 */
const TOTAL =
    LEADER_DURATION +
    FRUSTRATION_DURATION +
    PUZZLE_DURATION +
    ANSWER_DURATION +
    PROOF_DURATION +
    REWARD_DURATION;

const LEADER_FPS = 24;
const CLOCK_HZ = 120;

/** Unieke render-sleutels tussen twee tijdstippen, bemonsterd op `CLOCK_HZ`. */
function renderKeysBetween(from: number, to: number): number {
    const keys = new Set<string>();
    for (let frame = Math.round(from * CLOCK_HZ); frame < Math.round(to * CLOCK_HZ); frame += 1) {
        keys.add(getFilmRenderKey(frame / CLOCK_HZ));
    }
    return keys.size;
}

test('begrensd React-renders bij een 120 Hz filmklok', () => {
    const frames = TOTAL * CLOCK_HZ;
    const renders = renderKeysBetween(0, TOTAL);

    // De kern van de throttle: veel minder renders dan frames. Zou getFilmRenderKey
    // per frame een nieuwe sleutel teruggeven, dan werden dit er `frames`.
    assert.ok(
        renders < frames / 20,
        `verwacht ruim onder ${Math.round(frames / 20)} renders, kreeg ${renders} van ${frames} frames`,
    );
    // En genoeg om de scènes daadwerkelijk te animeren.
    assert.ok(renders > 100, `verwacht meer dan 100 betekenisvolle updates, kreeg ${renders}`);
});

test('behoudt de 24-fps filmleader zonder de schermfrequentie te volgen', () => {
    const renders = renderKeysBetween(0, LEADER_DURATION);

    assert.equal(renders, Math.ceil(LEADER_DURATION * LEADER_FPS));
});

test('geeft elke scène een eigen render-sleutel', () => {
    /*
     * De stille fout die dit afvangt: wie een scène aan Film.tsx toevoegt maar
     * de bijbehorende tak in getFilmRenderKey vergeet, krijgt daar `done` terug.
     * De film speelt dan gewoon door, maar React tekent die scène nooit opnieuw —
     * hij staat stil zonder dat er iets zichtbaar faalt.
     */
    const duren = [
        LEADER_DURATION,
        FRUSTRATION_DURATION,
        PUZZLE_DURATION,
        ANSWER_DURATION,
        PROOF_DURATION,
        REWARD_DURATION,
    ];

    const prefixen: string[] = [];
    let start = 0;
    for (const duur of duren) {
        const sleutel = getFilmRenderKey(start + duur / 2);
        assert.notEqual(
            sleutel,
            'done',
            `scène die op ${start}s begint heeft geen eigen tak in getFilmRenderKey`,
        );
        prefixen.push(sleutel.split(':')[0]);
        start += duur;
    }

    assert.equal(
        new Set(prefixen).size,
        duren.length,
        `elke scène hoort een eigen sleutelprefix te hebben, kreeg ${prefixen.join(', ')}`,
    );
});

test('ververst exact wanneer de eerste getypte letter zichtbaar wordt', () => {
    const [eersteRegel] = FRUSTRATION_LINES;
    const firstLineStartsAt = LEADER_DURATION + eersteRegel.from;
    const firstCharacterAt = firstLineStartsAt + 1 / eersteRegel.speed;

    assert.equal(
        getFilmRenderKey(firstCharacterAt - 0.001),
        getFilmRenderKey(firstLineStartsAt),
    );
    assert.notEqual(
        getFilmRenderKey(firstCharacterAt + 0.001),
        getFilmRenderKey(firstLineStartsAt),
    );
});
