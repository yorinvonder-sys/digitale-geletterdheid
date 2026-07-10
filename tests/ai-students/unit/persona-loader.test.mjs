import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const PERSONA_DIR = path.resolve('tests/ai-students/personas');
const EXPECTED_IDS = [
  'snelle-sam',
  'onzekere-noor',
  'letterlijke-luca',
  'afgeleide-amir',
  'digisterke-dani',
  'taalzwakke-tess',
  'ipad-iris',
  'creatieve-cheater',
];

async function loadTarget() {
  try {
    return await import('../persona/load-personas.mjs');
  } catch (error) {
    assert.fail(`load-personas.mjs ontbreekt: ${error.message}`);
  }
}

const validExtraPersona = {
  schemaVersion: 1,
  id: 'rustige-ravi',
  displayName: 'Rustige Ravi',
  age: 13,
  readingLevel: 'average',
  digitalSkill: 'average',
  deviceProfile: 'desktop',
  readingBehavior: ['reads-all'],
  decisionBehavior: ['deliberate'],
  errorBehavior: ['rare-misclick'],
  helpBehavior: ['uses-feedback'],
  testGoals: ['controleer uitbreidbaarheid'],
  preferredViewports: ['desktop'],
  behaviorWeights: {
    readingCoverage: 0.9,
    decisionSpeed: 0.3,
    uncertainty: 0.2,
    errorRate: 0.1,
    hintUsage: 0.4,
    backtrackRate: 0.1,
    shortcutSeeking: 0.1,
    manipulationAttempt: 0,
    touchReliance: 0,
  },
  seedSalt: 'rustige-ravi-v1',
};

test('loads exactly the eight required built-in personas', async () => {
  const { loadPersonas } = await loadTarget();
  const personas = await loadPersonas(PERSONA_DIR);
  assert.deepEqual(personas.map((persona) => persona.id).sort(), [...EXPECTED_IDS].sort());
});

test('every built-in persona contains the required schema fields and bounded weights', async () => {
  const { loadPersonas } = await loadTarget();
  const personas = await loadPersonas(PERSONA_DIR);
  for (const persona of personas) {
    assert.equal(persona.schemaVersion, 1);
    assert.equal(typeof persona.displayName, 'string');
    assert.ok(Number.isInteger(persona.age));
    for (const field of ['readingBehavior', 'decisionBehavior', 'errorBehavior', 'helpBehavior', 'testGoals']) {
      assert.ok(Array.isArray(persona[field]) && persona[field].length > 0, `${persona.id}.${field}`);
    }
    for (const [key, value] of Object.entries(persona.behaviorWeights)) {
      assert.ok(value >= 0 && value <= 1, `${persona.id}.behaviorWeights.${key}`);
    }
  }
});

test('discovers a ninth schema-valid persona without code changes', async () => {
  const { loadPersonas } = await loadTarget();
  const directory = await mkdtemp(path.join(tmpdir(), 'dgskills-personas-'));
  await writeFile(path.join(directory, 'rustige-ravi.json'), JSON.stringify(validExtraPersona));
  const personas = await loadPersonas(directory);
  assert.deepEqual(personas.map((persona) => persona.id), ['rustige-ravi']);
});

test('rejects an invalid behavior weight with a precise field path', async () => {
  const { loadPersonas } = await loadTarget();
  const directory = await mkdtemp(path.join(tmpdir(), 'dgskills-personas-'));
  const invalid = structuredClone(validExtraPersona);
  invalid.behaviorWeights.errorRate = 1.5;
  await writeFile(path.join(directory, 'invalid.json'), JSON.stringify(invalid));
  await assert.rejects(() => loadPersonas(directory), /behaviorWeights\.errorRate/);
});

test('persona schema declares all user-required fields', async () => {
  const schema = JSON.parse(await readFile(path.join(PERSONA_DIR, 'persona.schema.json'), 'utf8'));
  const required = new Set(schema.required);
  for (const field of [
    'id', 'displayName', 'age', 'readingLevel', 'digitalSkill', 'deviceProfile',
    'readingBehavior', 'decisionBehavior', 'errorBehavior', 'helpBehavior', 'testGoals',
  ]) {
    assert.ok(required.has(field), `schema vereist ${field}`);
  }
});
