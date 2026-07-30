import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const CLASSROOM_DIR = path.resolve('tests/ai-students/classroom');
const EXPECTED_IDS = [
  'snelle-sam',
  'taalzwakke-tess',
  'ipad-iris',
  'afgeleide-amir',
  'creatieve-cheater',
  'digisterke-dani',
  'letterlijke-luca',
  'onzekere-noor',
  'gamer-gijs',
  'uitzit-umut',
  'kritische-vera',
  'concrete-milan',
];

async function loadTarget() {
  return import('../classroom/load-classroom.mjs');
}

const validProfile = {
  schemaVersion: 1,
  id: 'proef-pien',
  displayName: 'Proef-Pien',
  derivedFrom: null,
  age: 13,
  readingLevel: 'average',
  digitalSkill: 'average',
  deviceProfile: 'desktop',
  preferredViewports: ['desktop'],
  educationLevel: 'havo',
  yearGroupFocus: null,
  interests: ['sport'],
  motivation: 'meewerkend',
  persistence: 0.5,
  attentionSpan: 'gemiddeld',
  interruptionBehavior: ['stopt bij de bel'],
  engagesWhen: ['de eerste stap duidelijk is'],
  quitsWhen: ['ze moet raden wat de bedoeling is'],
  watchFor: ['onduidelijke instructies'],
  roleplayBrief:
    'Je bent Pien, dertien jaar. Dit profiel bestaat uitsluitend om te bewijzen dat een nieuw klaslid zonder codewijziging wordt opgepikt door de loader.',
};

test('de klas bestaat uit precies twaalf profielen', async () => {
  const { loadClassroom } = await loadTarget();
  const profiles = await loadClassroom(CLASSROOM_DIR);
  assert.deepEqual(profiles.map((profile) => profile.id).sort(), [...EXPECTED_IDS].sort());
});

test('elk profiel draagt de vier nieuwe dimensies', async () => {
  const { loadClassroom } = await loadTarget();
  const profiles = await loadClassroom(CLASSROOM_DIR);
  for (const profile of profiles) {
    assert.ok(profile.interests.length > 0, `${profile.id}.interests`);
    assert.ok(['mavo', 'havo', 'vwo'].includes(profile.educationLevel), `${profile.id}.educationLevel`);
    assert.ok(['gedreven', 'meewerkend', 'lauw', 'zit-het-uit'].includes(profile.motivation), `${profile.id}.motivation`);
    assert.ok(['kort', 'gemiddeld', 'lang'].includes(profile.attentionSpan), `${profile.id}.attentionSpan`);
    assert.ok(profile.persistence >= 0 && profile.persistence <= 1, `${profile.id}.persistence`);
  }
});

test('de vier dimensies zijn echt gespreid, niet allemaal dezelfde waarde', async () => {
  const { loadClassroom } = await loadTarget();
  const profiles = await loadClassroom(CLASSROOM_DIR);
  const distinct = (values) => new Set(values).size;
  assert.ok(distinct(profiles.map((p) => p.educationLevel)) === 3, 'alle drie de schoolniveaus moeten voorkomen');
  assert.ok(distinct(profiles.map((p) => p.motivation)) === 4, 'alle vier de motivatieniveaus moeten voorkomen');
  assert.ok(distinct(profiles.map((p) => p.attentionSpan)) === 3, 'alle drie de aandachtsspannes moeten voorkomen');
  assert.ok(distinct(profiles.flatMap((p) => p.interests)) >= 6, 'minimaal zes verschillende interesses');
});

test('afgeleide profielen spreken hun basispersona niet tegen', async () => {
  const { loadClassroom } = await loadTarget();
  const { loadPersonas } = await import('../persona/load-personas.mjs');
  const profiles = await loadClassroom(CLASSROOM_DIR);
  const personas = new Map((await loadPersonas()).map((persona) => [persona.id, persona]));

  const derived = profiles.filter((profile) => profile.derivedFrom !== null);
  assert.equal(derived.length, 8, 'de acht bestaande persona\'s moeten afgeleid blijven');
  for (const profile of derived) {
    const base = personas.get(profile.derivedFrom);
    assert.ok(base, `${profile.id} verwijst naar een bestaande persona`);
    for (const field of ['age', 'readingLevel', 'digitalSkill', 'deviceProfile']) {
      assert.equal(profile[field], base[field], `${profile.id}.${field} moet gelijk zijn aan personas/${base.id}.json`);
    }
    assert.deepEqual(profile.preferredViewports, base.preferredViewports, `${profile.id}.preferredViewports`);
  }
});

test('drift ten opzichte van de basispersona wordt geweigerd', async () => {
  const { assertNoDriftFromBase } = await loadTarget();
  const base = { id: 'snelle-sam', age: 12, readingLevel: 'average', digitalSkill: 'average', deviceProfile: 'desktop', preferredViewports: ['desktop'] };
  const drifted = { ...validProfile, derivedFrom: 'snelle-sam', age: 12, digitalSkill: 'high' };
  assert.throws(() => assertNoDriftFromBase(drifted, base, 'test'), /digitalSkill/);
});

test('een dertiende profiel wordt opgepikt zonder codewijziging', async () => {
  const { loadClassroom } = await loadTarget();
  const directory = await mkdtemp(path.join(tmpdir(), 'dgskills-classroom-'));
  await writeFile(path.join(directory, 'proef-pien.json'), JSON.stringify(validProfile));
  const profiles = await loadClassroom(directory);
  assert.deepEqual(profiles.map((profile) => profile.id), ['proef-pien']);
});

test('een ongeldige waarde wordt geweigerd met een precies veldpad', async () => {
  const { loadClassroom } = await loadTarget();
  const directory = await mkdtemp(path.join(tmpdir(), 'dgskills-classroom-'));
  const invalid = { ...structuredClone(validProfile), motivation: 'heel-erg-gemotiveerd' };
  await writeFile(path.join(directory, 'invalid.json'), JSON.stringify(invalid));
  await assert.rejects(() => loadClassroom(directory), /motivation/);
});

test('het bestaande persona-harnas blijft onaangeroerd op acht persona\'s', async () => {
  const { loadPersonas } = await import('../persona/load-personas.mjs');
  const personas = await loadPersonas();
  assert.equal(personas.length, 8, 'classroom/ mag de originele personas/-map niet vervuilen');
});
