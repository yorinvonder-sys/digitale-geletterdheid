import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

class FakePage extends EventEmitter {}

test('telemetry classificeert browser- en netwerkfouten en redigeert secrets', async () => {
  const { attachTelemetry } = await import('../browser/telemetry.mjs');
  const page = new FakePage();
  const telemetry = attachTelemetry(page);

  page.emit('console', {
    type: () => 'error',
    text: () => 'Login leerling@example.test password=supersecret',
    location: () => ({ url: 'https://staging.test/app?token=secret-token', lineNumber: 4 }),
  });
  page.emit('pageerror', new Error('kapotte component'));
  page.emit('requestfailed', {
    url: () => 'https://api.test/progress?apikey=abc123',
    method: () => 'POST',
    failure: () => ({ errorText: 'net::ERR_FAILED' }),
  });
  page.emit('response', {
    status: () => 503,
    url: () => 'https://api.test/result?access_token=abc123',
    request: () => ({ method: () => 'GET', resourceType: () => 'fetch' }),
  });

  assert.equal(telemetry.consoleErrors.length, 1);
  assert.equal(telemetry.pageErrors.length, 1);
  assert.equal(telemetry.failedRequests.length, 1);
  assert.equal(telemetry.httpErrors.length, 1);
  assert.doesNotMatch(JSON.stringify(telemetry), /leerling@example|supersecret|secret-token|abc123/);
  assert.match(JSON.stringify(telemetry), /REDACTED/);
});

test('telemetry negeert succesvolle responses en gewone consoleberichten', async () => {
  const { attachTelemetry } = await import('../browser/telemetry.mjs');
  const page = new FakePage();
  const telemetry = attachTelemetry(page);
  page.emit('console', { type: () => 'log', text: () => 'ok', location: () => ({}) });
  page.emit('response', {
    status: () => 200,
    url: () => 'https://api.test/ok',
    request: () => ({ method: () => 'GET', resourceType: () => 'fetch' }),
  });
  assert.deepEqual(telemetry.consoleErrors, []);
  assert.deepEqual(telemetry.httpErrors, []);
});

test('DOM-telemetry dedupliceert externe links en kapotte media met redactie', async () => {
  const { addDomTelemetry } = await import('../browser/telemetry.mjs');
  const telemetry = { externalLinks: [], mediaErrors: [] };
  const snapshot = {
    externalLinks: ['https://extern.test/page?token=secret', 'https://extern.test/page?token=secret'],
    mediaErrors: [{ type: 'img', url: 'https://cdn.test/broken.png?apikey=abc123' }],
  };
  addDomTelemetry(telemetry, snapshot);
  addDomTelemetry(telemetry, snapshot);
  assert.equal(telemetry.externalLinks.length, 1);
  assert.equal(telemetry.mediaErrors.length, 1);
  assert.doesNotMatch(JSON.stringify(telemetry), /secret|abc123/);
});
