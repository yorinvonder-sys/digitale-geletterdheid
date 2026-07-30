import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

function runScript(script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

test('registration preflight recognizes the ethics-council engine', () => {
  const result = runScript('scripts/mission-registration-preflight.mjs', ['review-week-3']);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS.*review-week-3/s);
});

test('mission goal check accepts a shared IntroScreen goal banner', () => {
  const result = runScript('scripts/check-mission-goals.mjs');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Mission goal contract check passed/);
});
