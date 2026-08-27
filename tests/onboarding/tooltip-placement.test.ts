import assert from 'node:assert/strict';
import test from 'node:test';

import {
    VIEWPORT_MARGIN,
    computeTooltipStyle,
    type Rect,
    type Size,
} from '../../src/features/onboarding/core/placement.ts';

const desktop: Size = { width: 1440, height: 900 };
/** Gemeten afmeting van de echte ballon in het docentdashboard. */
const ballon: Size = { width: 208, height: 219 };

const valtBinnenBeeld = (style: { top: number; left: number }, box: Size, viewport: Size) =>
    style.left >= 0
    && style.top >= 0
    && style.left + box.width <= viewport.width
    && style.top + box.height <= viewport.height;

test('bij de Presentatie-knop rechtsboven blijft de ballon volledig zichtbaar', () => {
    // De echte positie uit het docentdashboard op 1440px breed.
    const knopRechtsboven: Rect = { top: 57, left: 1203, width: 141, height: 44 };
    const style = computeTooltipStyle(knopRechtsboven, 'bottom', desktop, ballon);

    assert.ok(
        valtBinnenBeeld(style, ballon, desktop),
        `ballon loopt tot ${Math.round(style.left + ballon.width)}px bij een venster van ${desktop.width}px — de helft van de tekst is dan onleesbaar`,
    );
    assert.ok(style.left + ballon.width <= desktop.width - VIEWPORT_MARGIN);
});

test('bij een knop uiterst links blijft de ballon volledig zichtbaar', () => {
    const knopLinks: Rect = { top: 100, left: 0, width: 40, height: 40 };
    const style = computeTooltipStyle(knopLinks, 'bottom', desktop, ballon);

    assert.ok(valtBinnenBeeld(style, ballon, desktop));
    assert.ok(style.left >= VIEWPORT_MARGIN);
});

test('past de ballon onderin niet, dan kantelt hij naar boven', () => {
    const knopOnderin: Rect = { top: 820, left: 700, width: 100, height: 40 };
    const style = computeTooltipStyle(knopOnderin, 'bottom', desktop, ballon);

    assert.ok(style.top < knopOnderin.top, 'ballon hoort boven het element te staan');
    assert.ok(valtBinnenBeeld(style, ballon, desktop));
});

test('past de ballon bovenin niet, dan kantelt hij naar onderen', () => {
    const knopBovenin: Rect = { top: 4, left: 700, width: 100, height: 40 };
    const style = computeTooltipStyle(knopBovenin, 'top', desktop, ballon);

    assert.ok(style.top > knopBovenin.top, 'ballon hoort onder het element te staan');
    assert.ok(valtBinnenBeeld(style, ballon, desktop));
});

test('zijwaartse plaatsing zet de ballon naast het element en binnen beeld', () => {
    const links = computeTooltipStyle({ top: 300, left: 1200, width: 60, height: 40 }, 'left', desktop, ballon);
    assert.ok(links.left + ballon.width <= 1200, 'ballon hoort links van het element te staan');
    assert.ok(valtBinnenBeeld(links, ballon, desktop));

    const rechts = computeTooltipStyle({ top: 300, left: 40, width: 60, height: 40 }, 'right', desktop, ballon);
    assert.ok(rechts.left >= 100, 'ballon hoort rechts van het element te staan');
    assert.ok(valtBinnenBeeld(rechts, ballon, desktop));
});

test('op elk schermformaat blijft de ballon binnen beeld', () => {
    const formaten: Size[] = [
        { width: 375, height: 812 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
    ];
    const hoeken: Rect[] = [
        { top: 0, left: 0, width: 40, height: 40 },
        { top: 0, left: 300, width: 40, height: 40 },
        { top: 700, left: 0, width: 40, height: 40 },
    ];

    for (const viewport of formaten) {
        for (const doel of hoeken) {
            for (const kant of ['top', 'bottom', 'left', 'right'] as const) {
                const style = computeTooltipStyle(doel, kant, viewport, ballon);
                const past = viewport.width >= ballon.width + 2 * VIEWPORT_MARGIN
                    && viewport.height >= ballon.height + 2 * VIEWPORT_MARGIN;
                if (!past) continue; // te klein scherm: gecentreerd is het beste dat kan
                assert.ok(
                    valtBinnenBeeld(style, ballon, viewport),
                    `${kant} bij ${viewport.width}x${viewport.height} valt buiten beeld`,
                );
            }
        }
    }
});

test('op een scherm dat smaller is dan de ballon wordt hij gecentreerd', () => {
    const smal: Size = { width: 200, height: 640 };
    const style = computeTooltipStyle({ top: 100, left: 160, width: 40, height: 40 }, 'bottom', smal, ballon);

    assert.equal(style.left, 0, 'gecentreerd op een scherm smaller dan de ballon');
});
