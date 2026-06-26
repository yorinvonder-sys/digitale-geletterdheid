import { readFileSync } from 'node:fs';

const sourceTruth = readFileSync('docs/compliance/legal-claim-source-of-truth.md', 'utf8');
const retentionMigration = readFileSync('supabase/migrations/20260221_add_data_retention_policies.sql', 'utf8');
const auditFix = readFileSync('supabase/migrations/20260505121000_fix_audit_log_cleanup_timestamp.sql', 'utf8');
const securityRemediation = readFileSync('scripts/security-remediation.sh', 'utf8');

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(sourceTruth.includes('operational activity, feedback and shared work are kept for up to 1 year'), 'source truth missing 1-year operational retention');
assert(sourceTruth.includes('audit/compliance logs for up to 3 years'), 'source truth missing 3-year audit retention');

for (const [table, column] of [
  ['student_activities', 'timestamp'],
  ['feedback', 'created_at'],
  ['shared_games', 'created_at'],
]) {
  const pattern = new RegExp(`DELETE FROM public\\.${table} WHERE ${column} < NOW\\(\\) - INTERVAL '1 year'`);
  assert(pattern.test(retentionMigration), `${table} must have 1-year retention cleanup`);
}

assert(/DELETE FROM public\.audit_logs WHERE created_at < NOW\(\) - INTERVAL '3 years'/.test(retentionMigration), 'audit_logs cron migration should document 3-year retention');
assert(/DELETE FROM public\.audit_logs WHERE "timestamp" < NOW\(\) - INTERVAL '3 years'/.test(auditFix), 'audit_logs timestamp cleanup must preserve 3-year retention');
assert(!/\b90[- ]day purge\b|\b90 dagen\b|\b90 days\b/i.test(securityRemediation), 'security remediation must not retain stale 90-day retention language');

if (failures.length) {
  console.error(`Retention policy check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Retention policy check passed');
