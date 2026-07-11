import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('bouwt Password Fortress-observaties zonder wachtwoord- of antwoordmetadata', async () => {
  const { buildFortressObservation } = await import('../missions/password-fortress.mjs');
  const observation = buildFortressObservation({
    heading: 'De kraakcomputer',
    instruction: 'Bouw een fort dat minstens één dag standhoudt.',
    scoreText: '0 pts',
    attemptCount: 2,
    flags: { input: true },
  });
  assert.equal(observation.phase, 'round');
  assert.equal(observation.roundType, 'password-entry');
  assert.equal(observation.attemptCount, 2);
  assert.equal('password' in observation, false);
  assert.equal('answer' in observation, false);
});

test('herkent intro, animatie, volgende ronde en voltooiing', async () => {
  const { buildFortressObservation } = await import('../missions/password-fortress.mjs');
  const base = { heading: '', instruction: '', scoreText: '', attemptCount: 0 };
  assert.equal(buildFortressObservation({ ...base, flags: { intro: true } }).phase, 'intro');
  assert.equal(buildFortressObservation({ ...base, flags: { revealing: true } }).phase, 'transition');
  assert.equal(buildFortressObservation({ ...base, flags: { root: true } }).phase, 'transition');
  assert.equal(buildFortressObservation({ ...base, flags: { next: true } }).roundType, 'fortress-next');
  assert.equal(buildFortressObservation({ ...base, flags: { completion: true } }).phase, 'completion');
});

test('alle Fortress-bedieningen hebben een touchhoogte van minimaal 44px', async () => {
  const source = await readFile('src/features/missions/templates/password-fortress/PasswordFortress.tsx', 'utf8');
  for (const qa of ['fortress-input', 'fortress-reveal', 'fortress-test', 'fortress-next', 'fortress-hint', 'fortress-skip']) {
    assert.match(source, new RegExp(`data-qa="${qa}"[\\s\\S]{0,800}min-h-\\[44px\\]`));
  }
});

test('adapter gebruikt stabiele selectors en bevat geen antwoordoracle', async () => {
  const source = await readFile('tests/ai-students/missions/password-fortress.mjs', 'utf8');
  assert.match(source, /getByLabel/);
  assert.match(source, /data-qa/);
  assert.doesNotMatch(source, /runAttacks|targetSeconds|holds|fortressEngine|correctAnswer/);
});

test('wachtwoordbeslissingen worden geredigeerd voor traces', async () => {
  const { redactFortressDecision, redactFortressVisibleText } = await import('../missions/password-fortress.mjs');
  const redacted = redactFortressDecision({ action: 'test-password', value: 'Fictief!9Wachtwoord', reason: 'test' });
  assert.equal(redacted.value, '[REDACTED_SYNTHETIC_PASSWORD]');
  assert.doesNotMatch(JSON.stringify(redacted), /Fictief/);
  assert.equal(
    redactFortressVisibleText('"abc123" staat in bekende datalekken.'),
    '"[REDACTED_SYNTHETIC_PASSWORD]" staat in bekende datalekken.',
  );
});

test('registry ondersteunt Wachtwoord Fortress', async () => {
  const { getMissionAdapter } = await import('../missions/registry.mjs');
  const adapter = getMissionAdapter('wachtwoord-fortress');
  assert.equal(adapter.id, 'password-fortress');
  assert.equal(typeof adapter.redactDecision, 'function');
});

test('product-autosave bevat bewust geen ingevoerd wachtwoord', async () => {
  const source = await readFile('src/features/missions/templates/password-fortress/PasswordFortress.tsx', 'utf8');
  const stateBlock = source.slice(source.indexOf('interface FortressState'), source.indexOf('const makeInitialState'));
  assert.doesNotMatch(stateBlock, /password|input/i);
  assert.match(source, /const \[input, setInput\] = useState\(''\)/);
});

test('runner controleert Password Fortress-voortgang na een stabiele rondewissel', async () => {
  const source = await readFile('tests/ai-students/browser/run-scenario-pilot.mjs', 'utf8');
  assert.match(source, /'password-fortress'/);
  assert.match(source, /verifyRefreshRecovery/);
});
