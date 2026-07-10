import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

async function loadWriter() {
  try {
    return await import('../reporting/write-report.mjs');
  } catch (error) {
    assert.fail(`write-report.mjs ontbreekt: ${error.message}`);
  }
}

async function loadRouting() {
  try {
    return await import('../config/model-routing.mjs');
  } catch (error) {
    assert.fail(`model-routing.mjs ontbreekt: ${error.message}`);
  }
}

const issue = {
  mission: 'mail-detective',
  persona: 'snelle-sam',
  pageOrStep: 'ronde-1',
  category: 'LANGUAGE',
  severity: 'MEDIUM',
  description: 'De instructie is te lang voor oppervlakkig leesgedrag.',
  expectedBehavior: 'De kernactie blijft herkenbaar na scannen.',
  actualBehavior: 'De persona kiest zonder de uitzondering te lezen.',
  learnerImpact: 'De leerling maakt een taalfout in plaats van een DG-fout.',
  reproductionSteps: ['Open de missie', 'Lees alleen de eerste zin', 'Kies de eerste optie'],
  evidenceReferences: ['snelle-sam/screenshots/ronde-1.png'],
  recommendedFix: 'Splits de instructie in twee korte zinnen.',
  confidence: 0.82,
  evidenceType: 'SIMULATION',
  requiresHumanValidation: true,
  pedagogicalImpact: true,
};

test('report schema contains required issue fields and severity levels', async () => {
  const schemaPath = path.resolve('tests/ai-students/reporting/report.schema.json');
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  const issueSchema = schema.$defs.issue;
  for (const field of Object.keys(issue)) assert.ok(issueSchema.required.includes(field), `schema vereist ${field}`);
  assert.deepEqual(issueSchema.properties.severity.enum, ['BLOCKER', 'HIGH', 'MEDIUM', 'LOW', 'OBSERVATION']);
});

test('writes summary and per-persona JSON/Markdown with screenshot directories', async () => {
  const { createRunDirectory, writeRunReports } = await loadWriter();
  const root = await mkdtemp(path.join(tmpdir(), 'dgskills-reports-'));
  const runDir = await createRunDirectory(root, new Date('2026-07-10T12:34:56.000Z'));
  await writeRunReports({
    runDir,
    run: {
      runId: 'pilot-1',
      startedAt: '2026-07-10T12:34:56.000Z',
      finishedAt: '2026-07-10T12:40:00.000Z',
      origin: 'http://127.0.0.1:4173',
      missions: ['mail-detective'],
      personas: ['snelle-sam'],
      devices: ['desktop'],
    },
    personaReports: [{
      personaId: 'snelle-sam',
      displayName: 'Snelle Sam',
      results: [{ missionId: 'mail-detective', deviceId: 'desktop', status: 'completed', finalScore: 62, finalStatus: 'passed' }],
      issues: [issue],
    }],
  });

  for (const relative of [
    'summary.json',
    'summary.md',
    'snelle-sam/report.json',
    'snelle-sam/report.md',
    'snelle-sam/screenshots',
  ]) {
    assert.ok(await stat(path.join(runDir, relative)));
  }
  const markdown = await readFile(path.join(runDir, 'summary.md'), 'utf8');
  assert.match(markdown, /Probleem \| Missie \| Persona's \| Ernst \| Aanbeveling/);
  assert.match(markdown, /Snelle Sam/);
  assert.match(markdown, /menselijke validatie/i);
  const personaMarkdown = await readFile(path.join(runDir, 'snelle-sam/report.md'), 'utf8');
  assert.match(personaMarkdown, /Apparaat/);
  assert.match(personaMarkdown, /desktop/);
});

test('marks one shared issue as multi-persona priority', async () => {
  const { aggregateRun } = await import('../reporting/aggregate.mjs').catch((error) => {
    assert.fail(`aggregate.mjs ontbreekt: ${error.message}`);
  });
  const shared = { ...issue, persona: 'taalzwakke-tess' };
  const summary = aggregateRun([
    { personaId: 'snelle-sam', displayName: 'Snelle Sam', results: [], issues: [issue] },
    { personaId: 'taalzwakke-tess', displayName: 'Taalzwakke Tess', results: [], issues: [shared] },
  ]);
  assert.equal(summary.problems.length, 1);
  assert.deepEqual(summary.problems[0].personas.sort(), ['snelle-sam', 'taalzwakke-tess']);
  assert.equal(summary.problems[0].multiPersonaPriority, true);
});

test('model-routing output redacts emails and token-shaped secrets', async () => {
  const { recordModelRouting } = await loadRouting();
  const root = await mkdtemp(path.join(tmpdir(), 'dgskills-routing-'));
  const syntheticToken = ['eyJhbGciOiJIUzI1NiJ9', 'abcdefghijk', 'abcdefghijklmnop'].join('.');
  const filePath = await recordModelRouting({
    task: 'Playwright pilot voor leerling@example.test',
    complexity: 'gemiddeld',
    risk: 'gemiddeld',
    chosenModel: 'Terra',
    thinkingLevel: 'gemiddeld',
    reason: `Test met synthetisch token ${syntheticToken}`,
    fallback: 'Codex met medium reasoning',
  }, root);
  await recordModelRouting({
    task: 'Playwright pilot voor leerling@example.test',
    complexity: 'gemiddeld',
    risk: 'gemiddeld',
    chosenModel: 'Terra',
    thinkingLevel: 'gemiddeld',
    reason: `Test met synthetisch token ${syntheticToken}`,
    fallback: 'Codex met medium reasoning',
  }, root);
  const contents = await readFile(filePath, 'utf8');
  assert.doesNotMatch(contents, /leerling@example\.test/);
  assert.doesNotMatch(contents, /eyJhbGci/);
  assert.match(contents, /\[REDACTED_EMAIL\]/);
  assert.match(contents, /\[REDACTED_TOKEN\]/);
  assert.equal(contents.match(/## Taak:/g)?.length, 1);
});
