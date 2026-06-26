import { readFileSync } from 'node:fs';

const coverage = readFileSync('docs/compliance/gdpr-rights-table-coverage.md', 'utf8');
const exportFn = readFileSync('supabase/functions/exportMyData/index.ts', 'utf8');
const deleteFn = readFileSync('supabase/functions/deleteMyAccount/index.ts', 'utf8');
const restrictFn = readFileSync('supabase/functions/restrictProcessing/index.ts', 'utf8');

const failures = [];
const requiredTables = [
  'users',
  'mission_progress',
  'xp_transactions',
  'shared_projects',
  'shared_games',
  'feedback',
  'student_activities',
  'audit_logs',
  'ai_beleid_surveys',
  'ai_beleid_feedback',
  'teacher_messages',
  'library_items',
  'duel_challenges',
  'developer_tasks',
  'developer_milestones',
  'developer_plans',
  'developer_settings',
  'student_consents',
  'parental_consent_requests',
  'peer_feedback',
  'wellbeing_alerts',
  'nulmeting_results',
  'teacher_step_overrides',
];

for (const table of requiredTables) {
  if (!coverage.includes(`| ${table} |`)) failures.push(`coverage register missing ${table}`);
  if (!exportFn.includes(`from('${table}')`) && !exportFn.includes(`from("${table}")`)) {
    failures.push(`exportMyData missing ${table}`);
  }
}

for (const [label, source] of [
  ['exportMyData', exportFn],
  ['deleteMyAccount', deleteFn],
  ['restrictProcessing', restrictFn],
]) {
  if (/\b(all personal data|ALL associated data|alle persoonlijke gegevens|alle bijbehorende gegevens)\b/i.test(source)) {
    failures.push(`${label} contains absolute all-data wording`);
  }
}

if (!deleteFn.includes('hoofdgegevens') || !/back-?ups?/i.test(deleteFn) || !deleteFn.includes('audit')) {
  failures.push('deleteMyAccount response must mention hoofdgegevens plus backup/audit caveat');
}

if (!restrictFn.includes('processing_restricted') || !restrictFn.includes('audit_logs')) {
  failures.push('restrictProcessing must keep flag and audit-log evidence');
}

if (failures.length) {
  console.error(`GDPR rights coverage check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('GDPR rights coverage passed');
