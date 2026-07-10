import assert from 'node:assert/strict';
import test from 'node:test';

async function loadTarget() {
  try {
    return await import('../config/run-config.mjs');
  } catch (error) {
    assert.fail(`run-config.mjs ontbreekt: ${error.message}`);
  }
}

test('parses mission, persona, device and deterministic seed filters', async () => {
  const { parseRunConfig } = await loadTarget();
  const config = parseRunConfig([
    '--mission=mail-detective',
    '--persona=snelle-sam,taalzwakke-tess',
    '--device=desktop,ipad-portrait',
    '--seed=pilot-1',
    '--dry-run',
  ], {
    AI_STUDENT_ENVIRONMENT: 'test',
    QA_ORIGIN: 'http://127.0.0.1:4173',
    AI_STUDENT_ALLOWED_ORIGINS: 'http://127.0.0.1:4173',
  });

  assert.deepEqual(config.missions, ['mail-detective']);
  assert.deepEqual(config.personas, ['snelle-sam', 'taalzwakke-tess']);
  assert.deepEqual(config.devices, ['desktop', 'ipad-portrait']);
  assert.equal(config.seed, 'pilot-1');
  assert.equal(config.dryRun, true);
  assert.equal(config.mode, 'preview');
});

test('requires an explicit test or staging environment marker', async () => {
  const { parseRunConfig } = await loadTarget();
  assert.throws(
    () => parseRunConfig(['--mission=mail-detective'], { QA_ORIGIN: 'http://127.0.0.1:4173' }),
    /AI_STUDENT_ENVIRONMENT/i,
  );
});

test('rejects unknown device profiles', async () => {
  const { parseRunConfig } = await loadTarget();
  assert.throws(
    () => parseRunConfig(['--device=smart-fridge'], {
      AI_STUDENT_ENVIRONMENT: 'test',
      QA_ORIGIN: 'http://127.0.0.1:4173',
      AI_STUDENT_ALLOWED_ORIGINS: 'http://127.0.0.1:4173',
    }),
    /device/i,
  );
});
