import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (path) => readFileSync(path, 'utf8');

const planPath = 'docs/compliance/post-market-monitoring-plan.md';
const templatePath = 'docs/compliance/post-market-review-template.md';
const generatorPath = 'scripts/generate-post-market-review.mjs';
const packagePath = 'package.json';
const matrixPath = 'docs/compliance/ai-act-control-matrix.md';

for (const path of [planPath, templatePath, generatorPath, packagePath, matrixPath]) {
  assert(existsSync(path), `Missing required post-market monitoring artifact: ${path}`);
}

const plan = existsSync(planPath) ? read(planPath) : '';
const template = existsSync(templatePath) ? read(templatePath) : '';
const generator = existsSync(generatorPath) ? read(generatorPath) : '';
const packageJson = existsSync(packagePath) ? JSON.parse(read(packagePath)) : { scripts: {} };
const matrix = existsSync(matrixPath) ? read(matrixPath) : '';

for (const section of [
  '## Scope',
  '## Sources',
  '## Usage summary',
  '## Oversight events',
  '## Incidents and anomalies',
  '## Review decisions',
  '## Actions',
  '## Next review date',
]) {
  assert(template.includes(section), `Template missing fixed section: ${section}`);
}

for (const token of [
  'not a declaration of conformity',
  'not legal advice',
  'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  'https://artificialintelligenceact.eu/article/72/',
  'ai_usage_events',
  'ai_oversight_events',
  'audit_logs',
  'web_vitals_events',
]) {
  assert(plan.includes(token), `Plan missing required token: ${token}`);
}

assert(plan.includes('No new database table or migration'), 'Plan must keep v1 out of schema changes.');
assert(plan.includes('No raw prompts'), 'Plan must explicitly forbid raw prompts.');
assert(plan.includes('No new teacher-facing dashboard'), 'Plan must keep v1 out of teacher-facing UI.');
assert(matrix.includes('post-market-monitoring-plan.md'), 'Control matrix must link the post-market plan.');
assert(packageJson.scripts?.['postmarket:review'] === 'node scripts/generate-post-market-review.mjs', 'package.json missing postmarket:review script.');
assert(packageJson.scripts?.['check:postmarket'] === 'node scripts/check-post-market-monitoring.mjs', 'package.json missing check:postmarket script.');

for (const token of ['--from', '--to', '--out', 'SUPABASE_POSTMARKET_READ_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'assertPrivacySafe']) {
  assert(generator.includes(token), `Generator missing safety or interface token: ${token}`);
}

const workDir = mkdtempSync(join(tmpdir(), 'dgskills-postmarket-'));
const inputPath = join(workDir, 'fixture.json');
const outPath = join(workDir, 'report.md');
writeFileSync(inputPath, JSON.stringify({
  ai_usage_events: [
    {
      created_at: '2026-04-10T10:00:00Z',
      endpoint: 'chat',
      provider: 'mistral',
      model: 'mistral-small-latest',
      status: 'ok',
      input_chars: 120,
      output_chars: 180,
      total_tokens: 75,
      fallback_used: false,
      user_id: '11111111-1111-4111-8111-111111111111',
      prompt_text: 'raw prompt should not appear',
      response_text: 'raw response should not appear',
      email: 'learner@example.com'
    },
    {
      created_at: '2026-04-11T10:00:00Z',
      endpoint: 'chatStream',
      provider: 'mistral',
      model: 'mistral-small-latest',
      status: 'blocked',
      input_chars: 100,
      output_chars: 0,
      total_tokens: 20,
      retry_count: 1,
      fallback_used: true
    }
  ],
  ai_oversight_events: [
    {
      created_at: '2026-04-12T10:00:00Z',
      event_type: 'teacher_override',
      mission_id: 'ai-bias-detective',
      slo_code: '23A',
      teacher_uid: '22222222-2222-4222-8222-222222222222',
      student_uid: '33333333-3333-4333-8333-333333333333',
      reasoning: 'private teacher note should not appear'
    }
  ],
  audit_logs: [
    {
      timestamp: '2026-04-13T10:00:00Z',
      action: 'consent_given',
      uid: '44444444-4444-4444-8444-444444444444'
    }
  ],
  web_vitals_events: [
    {
      created_at: '2026-04-14T10:00:00Z',
      route: '/student/55555555-5555-4555-8555-555555555555?token=secret',
      metric_name: 'LCP',
      metric_rating: 'poor',
      metric_value: 4100
    }
  ]
}, null, 2), 'utf8');

execFileSync(process.execPath, [generatorPath, '--from=2026-04-01', '--to=2026-07-01', `--input=${inputPath}`, `--out=${outPath}`], {
  stdio: 'pipe',
});

const report = readFileSync(outPath, 'utf8');
for (const section of [
  '## Scope',
  '## Sources',
  '## Usage summary',
  '## Oversight events',
  '## Incidents and anomalies',
  '## Review decisions',
  '## Actions',
  '## Next review date',
]) {
  assert(report.includes(section), `Generated report missing section: ${section}`);
}

for (const forbidden of [
  'raw prompt should not appear',
  'raw response should not appear',
  'learner@example.com',
  'private teacher note should not appear',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
  'token=secret',
]) {
  assert(!report.includes(forbidden), `Generated report leaked forbidden value: ${forbidden}`);
}

assert(report.includes('Total AI usage events: 2'), 'Generated report should aggregate usage events.');
assert(report.includes('Teacher override events: 1'), 'Generated report should aggregate oversight events.');
assert(report.includes('Poor web-vital events: 1'), 'Generated report should aggregate web vitals.');

if (failures.length) {
  console.error(`Post-market monitoring contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Post-market monitoring contract passed');

