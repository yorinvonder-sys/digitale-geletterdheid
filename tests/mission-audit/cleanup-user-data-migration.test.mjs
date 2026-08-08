import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const migrationPath = path.resolve(
  'supabase/migrations/20260806115613_preserve_audit_logs_on_user_cleanup.sql',
);
const migration = fs.readFileSync(migrationPath, 'utf8');

test('preserves immutable audit logs while retaining user cleanup invariants', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.cleanup_user_data\(\)/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /SET search_path TO 'public'/);
  assert.doesNotMatch(migration, /DELETE\s+FROM\s+public\.audit_logs\s+WHERE\s+uid\s*=\s*v_uid\s*;/i);
  assert.match(migration, /COMMENT ON FUNCTION public\.cleanup_user_data\(\)/);
  assert.match(migration, /immutable audit logs remain under retention procedures/i);

  for (const table of [
    'student_activities',
    'ai_beleid_surveys',
    'ai_beleid_feedback',
    'hybrid_assessments',
    'xp_suspicious_logs',
    'student_feedback',
    'developer_tasks',
    'developer_timeline',
    'developer_plans',
    'teacher_messages',
    'user_blocks',
    'shared_games',
    'bomberman_rooms',
    'drawing_challenges',
  ]) {
    assert.match(migration, new RegExp(`DELETE\\s+FROM\\s+public\\.${table}\\b`, 'i'));
  }

  assert.match(migration, /SET gestemde_uids = array_remove\(gestemde_uids, v_uid\)/);
  assert.match(migration, /RAISE NOTICE 'AVG Art\. 17: All data for user % has been cleaned up'/);
  assert.match(migration, /RETURN OLD/);
});
