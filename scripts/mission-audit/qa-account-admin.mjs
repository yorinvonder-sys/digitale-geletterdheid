#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import {
  access,
  chmod,
  mkdir,
  open,
  readFile,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const EXPECTED_PROJECT_REF = 'tdaylulsnbhhjuufmdzk';
const PROJECT_URL = `https://${EXPECTED_PROJECT_REF}.supabase.co`;
const SYNTHETIC_SCHOOL_ID = 'qa-mission-audit';

const VIEWPORTS = [
  {
    key: 'desktop',
    name: 'Desktop',
    sessionName: 'DGSkills QA Desktop',
    viewport: '1440x900',
    browserIdOption: '--desktop-browser-id',
  },
  {
    key: 'ipad-portrait',
    name: 'iPad Portret',
    sessionName: 'DGSkills QA iPad Portret',
    viewport: '820x1180',
    browserIdOption: '--ipad-portrait-browser-id',
  },
  {
    key: 'ipad-landscape',
    name: 'iPad Landschap',
    sessionName: 'DGSkills QA iPad Landschap',
    viewport: '1180x820',
    browserIdOption: '--ipad-landscape-browser-id',
  },
  {
    key: 'mobile',
    name: 'Mobiel',
    sessionName: 'DGSkills QA Mobiel',
    viewport: '390x844',
    browserIdOption: '--mobile-browser-id',
  },
];

function usage() {
  return `
DGSkills mission-audit QA account helper

Commands:
  self-test Run local fail-closed identity and not-found checks without Supabase access.
  canary   Create, authenticate, globally sign out, delete, and verify one synthetic user.
  prepare  Create four synthetic havo accounts bound to the four QA browser sessions.
  verify   Verify that the four users and profiles in the credentials file still exist.
  cleanup  Globally revoke sessions, delete exact recorded UUIDs, and verify zero profile rows.

Required safety options:
  --confirm-project ${EXPECTED_PROJECT_REF}
  --supabase-cli /absolute/path/to/supabase

Command options:
  canary:
    --evidence /absolute/path/to/safe-canary-evidence.json

  prepare:
    --credentials /absolute/path/to/qa-accounts-credentials.json
    --batch-id dgs-59
    --desktop-browser-id <opaque-id>
    --ipad-portrait-browser-id <opaque-id>
    --ipad-landscape-browser-id <opaque-id>
    --mobile-browser-id <opaque-id>

  verify:
    --credentials /absolute/path/to/qa-accounts-credentials.json

  cleanup:
    --credentials /absolute/path/to/qa-accounts-credentials.json
    --evidence /absolute/path/to/safe-cleanup-evidence.json
    --delete-credentials

The script never reads project secrets from .env files and never prints keys,
passwords, refresh tokens, or synthetic email addresses.
`.trim();
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = new Map();

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const next = rest[index + 1];
    if (!next || next.startsWith('--')) {
      options.set(token, true);
      continue;
    }
    options.set(token, next);
    index += 1;
  }

  return { command, options };
}

function requireOption(options, name) {
  const value = options.get(name);
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required option ${name}`);
  }
  return value;
}

function assertSafetyGate(options) {
  const projectRef = requireOption(options, '--confirm-project');
  if (projectRef !== EXPECTED_PROJECT_REF) {
    throw new Error(`Refusing project ${projectRef}; expected ${EXPECTED_PROJECT_REF}`);
  }

  const cliPath = resolve(requireOption(options, '--supabase-cli'));
  if (!cliPath.endsWith('/supabase')) {
    throw new Error('The --supabase-cli path must point to a supabase executable');
  }
  return cliPath;
}

function loadProjectKeys(cliPath) {
  let raw;
  try {
    raw = execFileSync(
      cliPath,
      [
        'projects',
        'api-keys',
        '--project-ref',
        EXPECTED_PROJECT_REF,
        '--reveal',
        '--output',
        'json',
      ],
      {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
  } catch {
    throw new Error('Supabase CLI could not retrieve project API keys');
  }

  let keys;
  try {
    keys = JSON.parse(raw);
  } catch {
    throw new Error('Supabase CLI returned unreadable API-key metadata');
  }

  if (!Array.isArray(keys)) {
    throw new Error('Supabase CLI returned an unexpected API-key shape');
  }

  const secret =
    keys.find((key) => key.type === 'secret' && !key.disabled)?.api_key ??
    keys.find((key) => key.name === 'service_role' && !key.disabled)?.api_key;
  const publishable =
    keys.find((key) => key.type === 'publishable' && !key.disabled)?.api_key ??
    keys.find((key) => key.name === 'anon' && !key.disabled)?.api_key;

  if (!secret || !publishable) {
    throw new Error('Active secret and publishable project keys are required');
  }

  return { secret, publishable };
}

function makeClients(keys) {
  const authOptions = {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  };
  return {
    admin: createClient(PROJECT_URL, keys.secret, { auth: authOptions }),
    publicClient: () =>
      createClient(PROJECT_URL, keys.publishable, { auth: authOptions }),
  };
}

function makePassword() {
  return `Aa1!${randomBytes(24).toString('base64url')}`;
}

function makeEmail(batchId, role) {
  const suffix = randomBytes(6).toString('hex');
  return `dgs-qa-${batchId}-${role}-${suffix}@example.invalid`;
}

function sanitizeErrorMessage(message) {
  return String(message)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[synthetic-email]')
    .replace(/(?:sb_secret_|eyJ)[A-Za-z0-9._-]+/g, '[redacted-secret]');
}

function safeIdDigest(userId) {
  return createHash('sha256').update(userId).digest('hex');
}

function isCanonicalUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isConfirmedUserNotFound(error) {
  return Boolean(
    error &&
      error.status === 404 &&
      (error.code === 'user_not_found' ||
        /user(?:\s+with.*)?\s+not\s+found/i.test(error.message ?? '')),
  );
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeJsonExclusive(path, value, mode = 0o600) {
  const absolutePath = resolve(path);
  await mkdir(dirname(absolutePath), { recursive: true });
  const handle = await open(absolutePath, 'wx', mode);
  try {
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
  } finally {
    await handle.close();
  }
  await chmod(absolutePath, mode);
}

async function writeSafeEvidence(path, value) {
  const absolutePath = resolve(path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  await chmod(absolutePath, 0o600);
}

async function createSyntheticUser({
  admin,
  batchId,
  role,
  displayName,
  password,
}) {
  const email = makeEmail(batchId, role);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      synthetic_qa: true,
      qa_run_id: batchId,
    },
    app_metadata: {
      role: 'student',
      schoolId: SYNTHETIC_SCHOOL_ID,
      synthetic_qa: true,
      qa_run_id: batchId,
    },
  });
  if (error || !data.user) {
    throw new Error(`Auth Admin createUser failed: ${error?.message ?? 'missing user'}`);
  }

  const userId = data.user.id;
  const { error: profileError } = await admin.from('users').insert({
    id: userId,
    uid: userId,
    display_name: displayName,
    email,
    role: 'student',
    school_id: SYNTHETIC_SCHOOL_ID,
    student_class: 'QA-J1P1',
    year_group: 1,
    education_level: 'havo',
    must_change_password: false,
  });

  if (profileError) {
    const { error: rollbackError } = await admin.auth.admin.deleteUser(userId, false);
    if (rollbackError) {
      throw new Error(
        `Synthetic profile insert failed and Auth rollback failed: ${profileError.message}; ${rollbackError.message}`,
      );
    }
    await assertAuthUserMissing(admin, userId);
    throw new Error(`Synthetic profile insert failed: ${profileError.message}`);
  }

  return { batchId, email, password, userId };
}

function assertSyntheticAuthRecord(user, account) {
  if (
    user.id !== account.userId ||
    user.email !== account.email ||
    !user.email.startsWith('dgs-qa-') ||
    !user.email.endsWith('@example.invalid') ||
    user.app_metadata?.synthetic_qa !== true ||
    user.app_metadata?.qa_run_id !== account.batchId ||
    user.app_metadata?.role !== 'student' ||
    user.app_metadata?.schoolId !== SYNTHETIC_SCHOOL_ID ||
    user.user_metadata?.synthetic_qa !== true ||
    user.user_metadata?.qa_run_id !== account.batchId
  ) {
    throw new Error('Auth user failed the synthetic identity safety contract');
  }
}

function assertSyntheticProfileRecord(profile, account) {
  if (
    profile.id !== account.userId ||
    profile.uid !== account.userId ||
    profile.email !== account.email ||
    !profile.email.startsWith('dgs-qa-') ||
    !profile.email.endsWith('@example.invalid') ||
    profile.role !== 'student' ||
    profile.school_id !== SYNTHETIC_SCHOOL_ID ||
    profile.student_class !== 'QA-J1P1' ||
    profile.year_group !== 1 ||
    profile.education_level !== 'havo'
  ) {
    throw new Error('Profile failed the synthetic identity safety contract');
  }
}

async function getProfile(admin, userId) {
  const { data, error } = await admin
    .from('users')
    .select('id,uid,email,role,school_id,student_class,year_group,education_level')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    throw new Error(`Profile verification failed: ${error.message}`);
  }
  return data;
}

async function assertSyntheticAccountExists(admin, account) {
  const { data, error } = await admin.auth.admin.getUserById(account.userId);
  if (error || !data.user) {
    throw new Error('Exact synthetic Auth user was not found');
  }
  assertSyntheticAuthRecord(data.user, account);

  const profile = await getProfile(admin, account.userId);
  if (!profile) {
    throw new Error('Exact synthetic profile was not found');
  }
  assertSyntheticProfileRecord(profile, account);
}

async function assertAuthUserMissing(admin, userId) {
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (!error || data.user) {
    throw new Error('Synthetic Auth user still exists after deletion');
  }
  if (!isConfirmedUserNotFound(error)) {
    throw new Error(`Auth absence check failed: ${error.message}`);
  }
}

async function globallyRevokeSessions({
  admin,
  publicClient,
  account,
}) {
  const loginClient = publicClient();
  const { data, error } = await loginClient.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });
  if (error || !data.session || !data.user) {
    throw new Error(`Synthetic login failed: ${error?.message ?? 'missing session'}`);
  }
  assertSyntheticAuthRecord(data.user, account);

  const accessToken = data.session.access_token;
  const refreshToken = data.session.refresh_token;
  const { error: signOutError } = await admin.auth.admin.signOut(
    accessToken,
    'global',
  );
  if (signOutError) {
    throw new Error(`Global session revocation failed: ${signOutError.message}`);
  }

  const probe = publicClient();
  const { data: refreshData, error: refreshError } = await probe.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (!refreshError || refreshData.session) {
    throw new Error('Revoked refresh token unexpectedly produced a session');
  }

  return {
    globalRefreshRevocationRequested: true,
    capturedRefreshTokenRejected: true,
    accessTokensMayRemainValidUntilExpiry: true,
  };
}

async function deleteExactSyntheticUser({
  admin,
  publicClient,
  account,
  tolerateMissingAuth = false,
}) {
  const current = await admin.auth.admin.getUserById(account.userId);
  let authWasPresent = false;
  let revocation = null;
  if (!current.error && current.data.user) {
    authWasPresent = true;
    assertSyntheticAuthRecord(current.data.user, account);
    const profile = await getProfile(admin, account.userId);
    if (!profile) {
      throw new Error('Refusing cleanup because the synthetic profile is missing');
    }
    assertSyntheticProfileRecord(profile, account);
    revocation = await globallyRevokeSessions({
      admin,
      publicClient,
      account,
    });
    const { error: deleteError } = await admin.auth.admin.deleteUser(
      account.userId,
      false,
    );
    if (deleteError) {
      throw new Error(`Auth Admin deleteUser failed: ${deleteError.message}`);
    }
  } else if (isConfirmedUserNotFound(current.error)) {
    if (!tolerateMissingAuth) {
      throw new Error('Exact synthetic Auth user was missing before cleanup');
    }
  } else {
    throw new Error(
      `Auth lookup failed before cleanup: ${current.error?.message ?? 'missing user response'}`,
    );
  }

  // A normally deleted Auth user cascades into public.users. This exact-UUID
  // fallback removes only a possible orphan created by an interrupted run.
  const orphan = await getProfile(admin, account.userId);
  if (orphan) {
    assertSyntheticProfileRecord(orphan, account);
  }
  const { error: orphanError } = await admin
    .from('users')
    .delete()
    .eq('id', account.userId);
  if (orphanError) {
    throw new Error(`Exact synthetic profile cleanup failed: ${orphanError.message}`);
  }

  await assertAuthUserMissing(admin, account.userId);
  if (await getProfile(admin, account.userId)) {
    throw new Error('Synthetic profile still exists after deletion');
  }
  return {
    userIdSha256: safeIdDigest(account.userId),
    authWasPresent,
    authAlreadyMissing: !authWasPresent,
    authUserDeleted: authWasPresent,
    profileRowsRemaining: 0,
    ...revocation,
  };
}

async function runCanary(options, clients) {
  const evidencePath = requireOption(options, '--evidence');
  if (await pathExists(evidencePath)) {
    throw new Error(`Refusing to overwrite evidence file ${resolve(evidencePath)}`);
  }

  const password = makePassword();
  const account = await createSyntheticUser({
    admin: clients.admin,
    batchId: 'dgs-59-canary',
    role: 'canary',
    displayName: 'DGSkills QA Canary',
    password,
  });

  let cleaned = false;
  let operationError = null;
  let cleanupError = null;
  let cleanupResult = null;
  try {
    await assertSyntheticAccountExists(clients.admin, account);
    cleanupResult = await deleteExactSyntheticUser({
      admin: clients.admin,
      publicClient: clients.publicClient,
      account,
    });
    cleaned = true;
    await writeSafeEvidence(evidencePath, {
      schemaVersion: 1,
      projectRef: EXPECTED_PROJECT_REF,
      completedAt: new Date().toISOString(),
      userIdSha256: safeIdDigest(account.userId),
      authAdminCreateUser: true,
      emailConfirmedAtCreation: true,
      profileCreated: true,
      globalRefreshRevocationRequested:
        cleanupResult.globalRefreshRevocationRequested === true,
      capturedRefreshTokenRejected:
        cleanupResult.capturedRefreshTokenRejected === true,
      accessTokensMayRemainValidUntilExpiry: true,
      authUserDeleted: cleanupResult.authUserDeleted === true,
      remainingProfileRows: 0,
    });
  } catch (error) {
    operationError = error;
  } finally {
    if (!cleaned) {
      try {
        await deleteExactSyntheticUser({
          admin: clients.admin,
          publicClient: clients.publicClient,
          account,
          tolerateMissingAuth: true,
        });
      } catch (error) {
        cleanupError = error;
      }
    }
  }

  if (operationError || cleanupError) {
    throw new Error(
      [
        operationError ? `canary operation: ${operationError.message}` : null,
        cleanupError ? `canary rollback: ${cleanupError.message}` : null,
      ]
        .filter(Boolean)
        .join('; '),
    );
  }

  console.log(`Canary PASS; safe evidence: ${resolve(evidencePath)}`);
}

async function runPrepare(options, clients) {
  const credentialsPath = requireOption(options, '--credentials');
  const batchId = requireOption(options, '--batch-id')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
  if (!batchId.replaceAll('-', '')) {
    throw new Error('--batch-id must contain at least one letter or number');
  }

  if (await pathExists(credentialsPath)) {
    throw new Error(`Refusing to overwrite credentials file ${resolve(credentialsPath)}`);
  }

  const bindings = VIEWPORTS.map((viewport) => ({
    ...viewport,
    browserId: requireOption(options, viewport.browserIdOption),
  }));
  if (new Set(bindings.map((binding) => binding.browserId)).size !== 4) {
    throw new Error('All four browser IDs must be unique');
  }

  const created = [];
  try {
    for (const binding of bindings) {
      const account = await createSyntheticUser({
        admin: clients.admin,
        batchId,
        role: binding.key,
        displayName: `DGSkills QA ${binding.name}`,
        password: makePassword(),
      });
      created.push({ ...binding, ...account });
      await assertSyntheticAccountExists(clients.admin, account);
    }

    await writeJsonExclusive(credentialsPath, {
      schemaVersion: 1,
      projectRef: EXPECTED_PROJECT_REF,
      purpose: 'DGSkills learner-mission audit',
      syntheticOnly: true,
      createdAt: new Date().toISOString(),
      batchId,
      accounts: created.map((account) => ({
        role: account.key,
        sessionName: account.sessionName,
        browserId: account.browserId,
        viewport: account.viewport,
        batchId: account.batchId,
        userId: account.userId,
        email: account.email,
        password: account.password,
      })),
    });
  } catch (error) {
    const rollbackErrors = [];
    for (const account of created.reverse()) {
      try {
        await deleteExactSyntheticUser({
          admin: clients.admin,
          publicClient: clients.publicClient,
          account,
          tolerateMissingAuth: true,
        });
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError.message);
      }
    }
    if (rollbackErrors.length > 0) {
      throw new Error(
        `${error.message}; rollback failed for ${rollbackErrors.length} account(s): ${rollbackErrors.join('; ')}`,
      );
    }
    throw error;
  }

  console.log(
    `Prepared ${created.length} synthetic accounts; credentials mode 0600: ${resolve(credentialsPath)}`,
  );
}

async function readCredentials(options) {
  const credentialsPath = resolve(requireOption(options, '--credentials'));
  const parsed = JSON.parse(await readFile(credentialsPath, 'utf8'));
  if (
    parsed?.projectRef !== EXPECTED_PROJECT_REF ||
    parsed?.syntheticOnly !== true ||
    !Array.isArray(parsed.accounts) ||
    parsed.accounts.length !== 4
  ) {
    throw new Error('Credentials file failed the synthetic-project safety contract');
  }
  for (const account of parsed.accounts) {
    account.batchId ??= parsed.batchId;
  }
  if (new Set(parsed.accounts.map((account) => account.userId)).size !== 4) {
    throw new Error('Credentials file does not contain four unique user UUIDs');
  }
  if (
    new Set(parsed.accounts.map((account) => account.browserId)).size !== 4 ||
    new Set(parsed.accounts.map((account) => account.role)).size !== 4 ||
    !VIEWPORTS.every((viewport) =>
      parsed.accounts.some(
        (account) =>
          account.role === viewport.key &&
          account.sessionName === viewport.sessionName &&
          account.viewport === viewport.viewport &&
          account.batchId === parsed.batchId,
      ),
    ) ||
    !parsed.accounts.every(
      (account) =>
        isCanonicalUuid(account.userId) &&
        typeof account.browserId === 'string' &&
        account.browserId.length > 0 &&
        typeof account.email === 'string' &&
        account.email.startsWith(`dgs-qa-${parsed.batchId}-${account.role}-`) &&
        account.email.endsWith('@example.invalid') &&
        typeof account.password === 'string' &&
        account.password.length >= 20,
    )
  ) {
    throw new Error('Credentials file failed the four-session identity contract');
  }
  await chmod(credentialsPath, 0o600);
  return { credentialsPath, parsed };
}

async function runVerify(options, clients) {
  const { credentialsPath, parsed } = await readCredentials(options);
  for (const account of parsed.accounts) {
    await assertSyntheticAccountExists(clients.admin, account);
  }
  console.log(
    `Verification PASS for ${parsed.accounts.length} synthetic accounts: ${credentialsPath}`,
  );
}

async function runCleanup(options, clients) {
  if (options.get('--delete-credentials') !== true) {
    throw new Error('cleanup requires the explicit --delete-credentials flag');
  }
  const evidencePath = requireOption(options, '--evidence');
  if (await pathExists(evidencePath)) {
    throw new Error(`Refusing to overwrite evidence file ${resolve(evidencePath)}`);
  }

  const { credentialsPath, parsed } = await readCredentials(options);
  // Preflight every identity before the first destructive action.
  for (const account of parsed.accounts) {
    const current = await clients.admin.auth.admin.getUserById(account.userId);
    if (!current.error && current.data.user) {
      await assertSyntheticAccountExists(clients.admin, account);
    } else if (isConfirmedUserNotFound(current.error)) {
      const profile = await getProfile(clients.admin, account.userId);
      if (profile) {
        assertSyntheticProfileRecord(profile, account);
      }
    } else {
      throw new Error(
        `Auth preflight lookup failed: ${current.error?.message ?? 'missing user response'}`,
      );
    }
  }

  const results = [];
  for (const account of parsed.accounts) {
    results.push(
      await deleteExactSyntheticUser({
        admin: clients.admin,
        publicClient: clients.publicClient,
        account,
        tolerateMissingAuth: true,
      }),
    );
  }

  await unlink(credentialsPath);
  await writeSafeEvidence(evidencePath, {
    schemaVersion: 1,
    projectRef: EXPECTED_PROJECT_REF,
    completedAt: new Date().toISOString(),
    deletedAccountCount: parsed.accounts.length,
    accounts: results,
    globalRefreshRevocationRequestedCount: results.filter(
      (result) => result.globalRefreshRevocationRequested,
    ).length,
    authUsersDeletedCount: results.filter((result) => result.authUserDeleted).length,
    authUsersAlreadyMissingCount: results.filter(
      (result) => result.authAlreadyMissing,
    ).length,
    accessTokensMayRemainValidUntilExpiry: true,
    remainingProfileRows: 0,
    credentialsFileDeleted: true,
  });
  console.log(
    `Cleanup PASS for ${parsed.accounts.length} synthetic accounts; credentials deleted`,
  );
}

function runSelfTest() {
  const account = {
    batchId: 'dgs-59',
    userId: '123e4567-e89b-42d3-a456-426614174000',
    email: 'dgs-qa-dgs-59-desktop-a1b2c3@example.invalid',
  };
  const authUser = {
    id: account.userId,
    email: account.email,
    app_metadata: {
      role: 'student',
      schoolId: SYNTHETIC_SCHOOL_ID,
      synthetic_qa: true,
      qa_run_id: account.batchId,
    },
    user_metadata: {
      synthetic_qa: true,
      qa_run_id: account.batchId,
    },
  };
  const profile = {
    id: account.userId,
    uid: account.userId,
    email: account.email,
    role: 'student',
    school_id: SYNTHETIC_SCHOOL_ID,
    student_class: 'QA-J1P1',
    year_group: 1,
    education_level: 'havo',
  };

  if (
    !isCanonicalUuid(account.userId) ||
    isCanonicalUuid('not-a-uuid') ||
    !isConfirmedUserNotFound({
      status: 404,
      code: 'user_not_found',
      message: 'User not found',
    }) ||
    isConfirmedUserNotFound({
      status: 500,
      code: 'unexpected_failure',
      message: 'Database unavailable',
    })
  ) {
    throw new Error('Pure safety predicate self-test failed');
  }

  assertSyntheticAuthRecord(authUser, account);
  assertSyntheticProfileRecord(profile, account);

  let mismatchRejected = false;
  try {
    assertSyntheticAuthRecord(
      { ...authUser, id: '123e4567-e89b-42d3-a456-426614174001' },
      account,
    );
  } catch {
    mismatchRejected = true;
  }
  if (!mismatchRejected) {
    throw new Error('Mismatched login identity was not rejected');
  }

  console.log('Self-test PASS: destructive identity checks fail closed');
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === 'help' || options.get('--help') === true) {
    console.log(usage());
    return;
  }
  if (command === 'self-test') {
    runSelfTest();
    return;
  }
  if (!['canary', 'prepare', 'verify', 'cleanup'].includes(command)) {
    throw new Error(`Unknown command ${command}`);
  }

  const cliPath = assertSafetyGate(options);
  const clients = makeClients(loadProjectKeys(cliPath));

  if (command === 'canary') {
    await runCanary(options, clients);
  } else if (command === 'prepare') {
    await runPrepare(options, clients);
  } else if (command === 'verify') {
    await runVerify(options, clients);
  } else {
    await runCleanup(options, clients);
  }
}

main().catch((error) => {
  console.error(`QA account helper failed: ${sanitizeErrorMessage(error.message)}`);
  process.exitCode = 1;
});
