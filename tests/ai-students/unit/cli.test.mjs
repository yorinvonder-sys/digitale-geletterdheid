import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('dry-run validates target and resolves configured personas without opening a browser', () => {
  const result = spawnSync(process.execPath, [
    'tests/ai-students/cli.mjs',
    '--mission=mail-detective',
    '--persona=snelle-sam,taalzwakke-tess,ipad-iris',
    '--device=desktop,ipad-portrait',
    '--dry-run',
  ], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      AI_STUDENT_ENVIRONMENT: 'test',
      QA_ORIGIN: 'http://127.0.0.1:4173',
      AI_STUDENT_ALLOWED_ORIGINS: 'http://127.0.0.1:4173',
    },
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.mode, 'dry-run');
  assert.deepEqual(output.missions, ['mail-detective']);
  assert.deepEqual(output.personas, ['snelle-sam', 'taalzwakke-tess', 'ipad-iris']);
  assert.deepEqual(output.devices, ['desktop', 'ipad-portrait']);
  assert.equal(output.browserStarted, false);
});

test('package scripts expose config validation, unit tests and the future runner entrypoint', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.scripts['test:ai-students'], 'node tests/ai-students/cli.mjs');
  assert.equal(pkg.scripts['test:ai-students:unit'], 'node --test tests/ai-students/unit/*.test.mjs');
  assert.match(pkg.scripts['test:ai-students:pilot'], /mail-detective/);
});
