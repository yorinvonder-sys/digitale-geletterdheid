import assert from 'node:assert/strict';
import test from 'node:test';

async function loadTarget() {
  try {
    return await import('../browser/safety-guard.mjs');
  } catch (error) {
    assert.fail(`safety-guard.mjs ontbreekt: ${error.message}`);
  }
}

const validStagingConfig = {
  environment: 'staging',
  origin: 'https://dgskills-feature-example.vercel.app',
  allowedOrigins: ['https://dgskills-feature-example.vercel.app'],
  expectedSupabaseProjectRef: 'stagingprojectref',
  supabaseUrl: 'https://stagingprojectref.supabase.co',
  mode: 'authenticated',
  credentials: {
    schoolId: 'dgskills-qa-ai-students',
    accounts: [
      { alias: 'snelle-sam', email: 'snelle-sam@example.test' },
    ],
  },
};

test('accepts an explicitly allowlisted Vercel staging target with fictional accounts', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.equal(assertSafeTarget(validStagingConfig), true);
});

test('accepts localhost preview mode without credentials or Supabase writes', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.equal(assertSafeTarget({
    environment: 'test',
    origin: 'http://127.0.0.1:4173',
    allowedOrigins: ['http://127.0.0.1:4173'],
    mode: 'preview',
  }), true);
});

test('rejects the production DGSkills origin', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.throws(
    () => assertSafeTarget({ ...validStagingConfig, origin: 'https://dgskills.app', allowedOrigins: ['https://dgskills.app'] }),
    /productie-origin/i,
  );
});

test('rejects a target that is not explicitly allowlisted', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.throws(
    () => assertSafeTarget({ ...validStagingConfig, allowedOrigins: [] }),
    /allowlist/i,
  );
});

test('rejects a mismatched Supabase project ref', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.throws(
    () => assertSafeTarget({ ...validStagingConfig, supabaseUrl: 'https://differentproject.supabase.co' }),
    /Supabase-project/i,
  );
});

test('rejects real-looking account domains and non-QA schools', async () => {
  const { assertSafeTarget } = await loadTarget();
  assert.throws(
    () => assertSafeTarget({
      ...validStagingConfig,
      credentials: {
        schoolId: 'school-real',
        accounts: [{ alias: 'leerling', email: 'leerling@school.nl' }],
      },
    }),
    /fictief|QA-school/i,
  );
});
