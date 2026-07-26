import assert from 'node:assert/strict';
import test from 'node:test';

import { getFilmRenderKey } from '../../src/features/public-site/verhaal/film/timeline.ts';

test('begrensd React-renders bij een 120 Hz filmklok', () => {
    const renderKeys = new Set<string>();

    for (let frame = 0; frame <= 42.6 * 120; frame += 1) {
        renderKeys.add(getFilmRenderKey(frame / 120));
    }

    assert.ok(
        renderKeys.size >= 200 && renderKeys.size < 300,
        `verwacht 200–299 betekenisvolle updates, kreeg ${renderKeys.size}`,
    );
});

test('behoudt de 24-fps filmleader zonder de schermfrequentie te volgen', () => {
    const renderKeys = new Set<string>();

    for (let frame = 0; frame < 3.6 * 120; frame += 1) {
        renderKeys.add(getFilmRenderKey(frame / 120));
    }

    assert.equal(renderKeys.size, 87);
});

test('ververst exact wanneer de eerste getypte letter zichtbaar wordt', () => {
    const firstLineStartsAt = 3.6 + 0.8;
    const firstCharacterAt = firstLineStartsAt + 1 / 38;

    assert.equal(
        getFilmRenderKey(firstCharacterAt - 0.001),
        getFilmRenderKey(firstLineStartsAt),
    );
    assert.notEqual(
        getFilmRenderKey(firstCharacterAt + 0.001),
        getFilmRenderKey(firstLineStartsAt),
    );
});
