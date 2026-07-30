import assert from 'node:assert/strict';
import test from 'node:test';

test('maakt desktop- en iPad-contexten met de juiste invoermodus', async () => {
  const { buildContextOptions } = await import('../browser/create-context.mjs');
  const desktop = buildContextOptions('desktop');
  const portrait = buildContextOptions('ipad-portrait');
  const landscape = buildContextOptions('ipad-landscape');

  assert.deepEqual(desktop.viewport, { width: 1440, height: 900 });
  assert.equal(desktop.hasTouch, false);
  assert.equal(portrait.hasTouch, true);
  assert.equal(portrait.isMobile, true);
  assert.deepEqual(portrait.viewport, { width: 820, height: 1180 });
  assert.deepEqual(landscape.viewport, { width: 1180, height: 820 });
  assert.match(portrait.userAgent, /iPad/);
});
