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
const SYNTHETIC_EMAIL_PATTERN =
  /^dgs-qa-[a-z0-9-]+-[a-z0-9-]+-[a-f0-9]{12}@example\.invalid$/;
const EXPECTED_AUDIT_BASELINE = { xp: 75, completions: 3 };

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
const RECOVERABLE_AUTH_ROLES = new Set(VIEWPORTS.map((viewport) => viewport.key));

function usage() {
  return `
DGSkills mission-audit QA account helper

Commands:
  self-test Run local fail-closed identity and not-found checks without Supabase access.
  canary   Create, authenticate, globally sign out, delete, and verify one synthetic user.
  prepare  Create four synthetic havo accounts bound to the four QA browser sessions.
  prepare-single  Create one synthetic J1P1 production-lead account for the internal browser.
  verify   Verify that all users and profiles in the credentials file still exist.
  cleanup  Globally revoke sessions, delete exact recorded UUIDs, and verify zero profile rows.
  cleanup-orphans  Delete strictly matched synthetic accounts without a credentials file.

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

  prepare-single:
    --credentials /absolute/path/to/qa-account-credentials.json
    --batch-id j1p1-audit

  verify:
    --credentials /absolute/path/to/qa-accounts-credentials.json

  cleanup:
    --credentials /absolute/path/to/qa-accounts-credentials.json
    --evidence /absolute/path/to/safe-cleanup-evidence.json
    --delete-credentials

  cleanup-orphans:
    --candidate-ids-file /absolute/private/path/to/synthetic-auth-ids.json
    --confirm-delete-count 7
    --evidence /absolute/path/to/safe-orphan-cleanup-evidence.json
    --allow-delete-progress
    --retain-baseline 75:3
    --retained-credentials /absolute/private/path/to/retained-account.json

cleanup-orphans fails before its first mutation when any namespaced Auth/profile
identity is malformed or unmatched. Retention mode requires exactly one expected
75 XP / 3-completion audit baseline and deletes only the other seven accounts.
The private candidate file must be generated from the strict read-only Supabase
SQL inventory contract and is deleted separately after the audit.

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
  const commonArgs = [
    'projects',
    'api-keys',
    '--project-ref',
    EXPECTED_PROJECT_REF,
    '--output',
    'json',
  ];
  let raw = null;
  for (const args of [
    [...commonArgs.slice(0, 4), '--reveal', ...commonArgs.slice(4)],
    commonArgs,
  ]) {
    try {
      raw = execFileSync(cliPath, args, {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      break;
    } catch {
      // Supabase CLI <2.111 has no --reveal flag; its api-keys JSON already
      // contains the legacy anon/service_role keys. Never print either form.
    }
  }
  if (raw === null) {
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
    keys.find((key) => key.name === 'service_role' && !key.disabled)?.api_key ??
    keys.find((key) => key.type === 'secret' && !key.disabled)?.api_key;
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

function isSyntheticEmail(value) {
  return typeof value === 'string' && SYNTHETIC_EMAIL_PATTERN.test(value);
}

function parseExactNonNegativeInteger(value, optionName) {
  if (!/^(0|[1-9][0-9]*)$/.test(String(value))) {
    throw new Error(`${optionName} must be an exact non-negative integer`);
  }
  return Number(value);
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
    !isSyntheticEmail(user.email) ||
    !user.email.startsWith(`dgs-qa-${account.batchId}-`) ||
    user.app_metadata?.synthetic_qa !== true ||
    user.app_metadata?.qa_run_id !== account.batchId ||
    user.app_metadata?.role !== 'student' ||
    ![undefined, null, SYNTHETIC_SCHOOL_ID].includes(user.app_metadata?.schoolId) ||
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
    !isSyntheticEmail(profile.email) ||
    !profile.email.startsWith(`dgs-qa-${account.batchId}-`) ||
    profile.role !== 'student' ||
    ![null, SYNTHETIC_SCHOOL_ID].includes(profile.school_id) ||
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
    .select('id,uid,email,role,school_id,student_class,year_group,education_level,stats')
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

async function runPrepareSingle(options, clients) {
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

  const password = makePassword();
  const account = await createSyntheticUser({
    admin: clients.admin,
    batchId,
    role: 'production-lead',
    displayName: 'DGSkills QA J1P1',
    password,
  });
  const credentialAccount = {
    role: 'production-lead',
    sessionName: 'DGSkills QA J1P1',
    viewport: '390x844',
    batchId,
    userId: account.userId,
    email: account.email,
    password,
  };

  try {
    await assertSyntheticAccountExists(clients.admin, credentialAccount);
    const payload = {
      schemaVersion: 2,
      accountMode: 'single-production-lead',
      projectRef: EXPECTED_PROJECT_REF,
      purpose: 'DGSkills J1P1 learner-mission audit',
      syntheticOnly: true,
      createdAt: new Date().toISOString(),
      batchId,
      accounts: [credentialAccount],
    };
    validateCredentialsPayload(payload);
    await writeJsonExclusive(credentialsPath, payload);
  } catch (error) {
    try {
      await deleteExactSyntheticUser({
        admin: clients.admin,
        publicClient: clients.publicClient,
        account: credentialAccount,
        tolerateMissingAuth: true,
      });
    } catch (rollbackError) {
      throw new Error(`${error.message}; single-account rollback failed: ${rollbackError.message}`);
    }
    throw error;
  }

  console.log(
    `Prepared one synthetic production-lead account; credentials mode 0600: ${resolve(credentialsPath)}`,
  );
}

function validateCredentialsPayload(parsed) {
  if (
    parsed?.projectRef !== EXPECTED_PROJECT_REF ||
    parsed?.syntheticOnly !== true ||
    !Array.isArray(parsed.accounts)
  ) {
    throw new Error('Credentials file failed the synthetic-project safety contract');
  }

  for (const account of parsed.accounts) {
    account.batchId ??= parsed.batchId;
  }

  const isLegacyFourSession = parsed.schemaVersion === 1;
  const isSingleProductionLead =
    parsed.schemaVersion === 2 &&
    parsed.accountMode === 'single-production-lead';
  if (!isLegacyFourSession && !isSingleProductionLead) {
    throw new Error('Credentials file has an unsupported account mode');
  }

  const expectedCount = isLegacyFourSession ? 4 : 1;
  if (
    parsed.accounts.length !== expectedCount ||
    new Set(parsed.accounts.map((account) => account.userId)).size !== expectedCount ||
    new Set(parsed.accounts.map((account) => account.role)).size !== expectedCount
  ) {
    throw new Error('Credentials file has an invalid account count or duplicate identity');
  }

  const commonIdentityValid = parsed.accounts.every(
    (account) =>
      isCanonicalUuid(account.userId) &&
      typeof account.email === 'string' &&
      isSyntheticEmail(account.email) &&
      account.email.startsWith(`dgs-qa-${parsed.batchId}-`) &&
      typeof account.password === 'string' &&
      account.password.length >= 20 &&
      account.batchId === parsed.batchId,
  );
  if (!commonIdentityValid) {
    throw new Error('Credentials file failed the synthetic identity contract');
  }

  if (isLegacyFourSession) {
    const legacyValid =
      new Set(parsed.accounts.map((account) => account.browserId)).size === 4 &&
      VIEWPORTS.every((viewport) =>
        parsed.accounts.some(
          (account) =>
            account.role === viewport.key &&
            account.email.startsWith(
              `dgs-qa-${parsed.batchId}-${account.role}-`,
            ) &&
            account.sessionName === viewport.sessionName &&
            account.viewport === viewport.viewport &&
            typeof account.browserId === 'string' &&
            account.browserId.length > 0,
        ),
      );
    if (!legacyValid) {
      throw new Error('Credentials file failed the four-session identity contract');
    }
  } else {
    const [account] = parsed.accounts;
    const isRecoveredBaseline =
      account.recoveredBaseline?.xp === EXPECTED_AUDIT_BASELINE.xp &&
      account.recoveredBaseline?.completions ===
        EXPECTED_AUDIT_BASELINE.completions &&
      RECOVERABLE_AUTH_ROLES.has(account.authRole) &&
      account.email.startsWith(
        `dgs-qa-${parsed.batchId}-${account.authRole}-`,
      );
    const isNewSingleAccount =
      account.recoveredBaseline === undefined &&
      account.authRole === undefined &&
      account.email.startsWith(
        `dgs-qa-${parsed.batchId}-production-lead-`,
      );
    if (
      account.role !== 'production-lead' ||
      account.sessionName !== 'DGSkills QA J1P1' ||
      account.viewport !== '390x844' ||
      Object.hasOwn(account, 'browserId') ||
      (!isRecoveredBaseline && !isNewSingleAccount)
    ) {
      throw new Error('Credentials file failed the single-account identity contract');
    }
  }

  return parsed;
}

async function readCredentials(options) {
  const credentialsPath = resolve(requireOption(options, '--credentials'));
  const parsed = validateCredentialsPayload(
    JSON.parse(await readFile(credentialsPath, 'utf8')),
  );
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

function readProgressSnapshot(profile) {
  const stats = profile?.stats ?? {};
  const xp = Number(stats.xp ?? 0);
  const missions = stats.missionsCompleted ?? [];
  if (!Number.isInteger(xp) || xp < 0 || !Array.isArray(missions)) {
    throw new Error('Synthetic profile has an invalid progress shape');
  }
  return { xp, completions: missions.length };
}

async function listNamespacedProfiles(admin) {
  const profiles = [];
  for (let from = 0; from < 100000; from += 1000) {
    const { data, error } = await admin
      .from('users')
      .select('id,uid,email,role,school_id,student_class,year_group,education_level,stats')
      .like('email', 'dgs-qa-%@example.invalid')
      .range(from, from + 999);
    if (error || !Array.isArray(data)) {
      throw new Error(`Synthetic profile inventory failed: ${error?.message ?? 'invalid response'}`);
    }
    profiles.push(...data);
    if (data.length < 1000) return profiles;
  }
  throw new Error('Profile inventory exceeded the fail-closed pagination limit');
}

function validateCandidateIdsPayload(parsed) {
  if (
    parsed?.schemaVersion !== 1 ||
    parsed?.projectRef !== EXPECTED_PROJECT_REF ||
    parsed?.syntheticOnly !== true ||
    parsed?.sourceContract !== 'strict-synthetic-auth-v1' ||
    !Array.isArray(parsed.authUserIds) ||
    parsed.authUserIds.length === 0 ||
    parsed.authUserIds.some((userId) => !isCanonicalUuid(userId)) ||
    new Set(parsed.authUserIds).size !== parsed.authUserIds.length
  ) {
    throw new Error('Candidate IDs file failed the strict synthetic inventory contract');
  }
  return parsed;
}

async function readCandidateIdsFile(options) {
  const candidatePath = resolve(requireOption(options, '--candidate-ids-file'));
  const raw = await readFile(candidatePath, 'utf8');
  const parsed = validateCandidateIdsPayload(JSON.parse(raw));
  await chmod(candidatePath, 0o600);
  return {
    candidatePath,
    candidateManifestSha256: createHash('sha256').update(raw).digest('hex'),
    authUserIds: parsed.authUserIds,
  };
}

function matchStrictSyntheticCandidates(authUsers, profiles) {
  if (
    authUsers.some((user) => !isSyntheticEmail(user.email)) ||
    profiles.some((profile) => !isSyntheticEmail(profile.email))
  ) {
    throw new Error('A namespaced record failed the canonical synthetic email contract');
  }

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  if (profileById.size !== profiles.length) {
    throw new Error('Duplicate synthetic profile UUID detected');
  }

  const candidates = authUsers.map((user) => {
    const batchId = user.app_metadata?.qa_run_id;
    const account = {
      batchId,
      userId: user.id,
      email: user.email,
    };
    assertSyntheticAuthRecord(user, account);
    const profile = profileById.get(user.id);
    if (!profile) {
      throw new Error('Namespaced Auth user has no exact synthetic profile');
    }
    assertSyntheticProfileRecord(profile, account);
    return { account, progress: readProgressSnapshot(profile) };
  });

  const authIds = new Set(authUsers.map((user) => user.id));
  if (authIds.size !== authUsers.length) {
    throw new Error('Duplicate synthetic Auth UUID detected');
  }
  if (profiles.some((profile) => !authIds.has(profile.id))) {
    throw new Error('Namespaced synthetic profile has no exact Auth user');
  }
  if (candidates.length !== profiles.length) {
    throw new Error('Synthetic Auth/profile candidate sets are not equal');
  }
  return candidates;
}

async function collectStrictSyntheticCandidates(admin, authUserIds) {
  const authUsers = [];
  for (const userId of authUserIds) {
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data.user) {
      throw new Error(
        `Exact candidate Auth lookup failed: ${error?.message ?? 'missing user response'}`,
      );
    }
    authUsers.push(data.user);
  }
  const profiles = await listNamespacedProfiles(admin);
  return matchStrictSyntheticCandidates(authUsers, profiles);
}

function summarizeProgress(candidates) {
  const groups = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.progress.xp}:${candidate.progress.completions}`;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'en', { numeric: true }))
    .map(([key, count]) => {
      const [xp, completions] = key.split(':').map(Number);
      return { xp, completions, count };
    });
}

function selectRetainedBaseline(options, candidates) {
  const retention = options.get('--retain-baseline');
  if (retention !== '75:3') {
    throw new Error('cleanup-orphans requires --retain-baseline 75:3');
  }
  if (options.has('--allow-delete-baseline')) {
    throw new Error('Retention mode forbids --allow-delete-baseline');
  }
  const matches = candidates.filter(
    ({ progress }) =>
      progress.xp === EXPECTED_AUDIT_BASELINE.xp &&
      progress.completions === EXPECTED_AUDIT_BASELINE.completions,
  );
  if (matches.length !== 1) {
    throw new Error(
      `Retention requires exactly one 75:3 baseline account; found ${matches.length}`,
    );
  }
  return {
    retained: matches[0],
    deletions: candidates.filter(
      (candidate) => candidate.account.userId !== matches[0].account.userId,
    ),
  };
}

function inferRecoverableAuthRole(account) {
  const matches = [...RECOVERABLE_AUTH_ROLES].filter((role) =>
    account.email.startsWith(`dgs-qa-${account.batchId}-${role}-`),
  );
  if (matches.length !== 1) {
    throw new Error('Retained account email has no unique recoverable Auth role');
  }
  return matches[0];
}

function makeRetainedCredentialsPayload(candidate, password) {
  const authRole = inferRecoverableAuthRole(candidate.account);
  const credentialAccount = {
    ...candidate.account,
    password,
    role: 'production-lead',
    authRole,
    sessionName: 'DGSkills QA J1P1',
    viewport: '390x844',
    recoveredBaseline: { ...EXPECTED_AUDIT_BASELINE },
  };
  const payload = {
    schemaVersion: 2,
    accountMode: 'single-production-lead',
    projectRef: EXPECTED_PROJECT_REF,
    purpose: 'DGSkills J1P1 learner-mission audit',
    syntheticOnly: true,
    createdAt: new Date().toISOString(),
    batchId: candidate.account.batchId,
    accounts: [credentialAccount],
  };
  validateCredentialsPayload(payload);
  return { credentialAccount, payload };
}

function assertOrphanCleanupAcknowledgements(options, candidates) {
  const expectedCount = parseExactNonNegativeInteger(
    requireOption(options, '--confirm-delete-count'),
    '--confirm-delete-count',
  );
  if (candidates.length !== expectedCount) {
    throw new Error(
      `Refusing orphan cleanup because discovered count ${candidates.length} differs from confirmed count ${expectedCount}`,
    );
  }

  const progressed = candidates.filter(
    ({ progress }) => progress.xp > 0 || progress.completions > 0,
  );
  if (progressed.length > 0 && options.get('--allow-delete-progress') !== true) {
    throw new Error(
      `Refusing to delete ${progressed.length} progressed synthetic account(s) without --allow-delete-progress`,
    );
  }

  if (
    candidates.some(
      ({ progress }) =>
        progress.xp === EXPECTED_AUDIT_BASELINE.xp &&
        progress.completions === EXPECTED_AUDIT_BASELINE.completions,
    )
  ) {
    throw new Error('Refusing deletion set that still contains the retained 75:3 baseline');
  }
}

async function runCleanupOrphans(options, clients) {
  const evidencePath = requireOption(options, '--evidence');
  if (await pathExists(evidencePath)) {
    throw new Error(`Refusing to overwrite evidence file ${resolve(evidencePath)}`);
  }
  const retainedCredentialsPath = resolve(
    requireOption(options, '--retained-credentials'),
  );
  if (await pathExists(retainedCredentialsPath)) {
    throw new Error(
      `Refusing to overwrite credentials file ${retainedCredentialsPath}`,
    );
  }

  const candidateManifest = await readCandidateIdsFile(options);
  const candidates = await collectStrictSyntheticCandidates(
    clients.admin,
    candidateManifest.authUserIds,
  );
  const { retained, deletions } = selectRetainedBaseline(options, candidates);
  assertOrphanCleanupAcknowledgements(options, deletions);
  const progressBefore = summarizeProgress(candidates);
  const results = [];
  const retainedPassword = makePassword();
  const { credentialAccount, payload: retainedCredentials } =
    makeRetainedCredentialsPayload(retained, retainedPassword);
  let retainedCredentialsWritten = false;
  let retainedPasswordChanged = false;
  let retainedRevocation = null;

  try {
    // Persist the future credential first. If the process is interrupted after
    // the password mutation, the retained synthetic account remains recoverable.
    await writeJsonExclusive(retainedCredentialsPath, retainedCredentials);
    retainedCredentialsWritten = true;
    const { error: retainedPasswordError } =
      await clients.admin.auth.admin.updateUserById(
        credentialAccount.userId,
        { password: retainedPassword },
      );
    if (retainedPasswordError) {
      await unlink(retainedCredentialsPath);
      retainedCredentialsWritten = false;
      throw new Error(
        `Retained synthetic password reset failed: ${retainedPasswordError.message}`,
      );
    }
    retainedPasswordChanged = true;
    retainedRevocation = await globallyRevokeSessions({
      admin: clients.admin,
      publicClient: clients.publicClient,
      account: credentialAccount,
    });
    await assertSyntheticAccountExists(clients.admin, credentialAccount);
    const retainedProfileBeforeDeletion = await getProfile(
      clients.admin,
      credentialAccount.userId,
    );
    const retainedProgressBeforeDeletion = readProgressSnapshot(
      retainedProfileBeforeDeletion,
    );
    if (
      retainedProgressBeforeDeletion.xp !== EXPECTED_AUDIT_BASELINE.xp ||
      retainedProgressBeforeDeletion.completions !==
        EXPECTED_AUDIT_BASELINE.completions
    ) {
      throw new Error('Retained account progress changed during credential recovery');
    }

    for (const candidate of deletions) {
      const account = { ...candidate.account, password: makePassword() };
      const { error: passwordError } = await clients.admin.auth.admin.updateUserById(
        account.userId,
        { password: account.password },
      );
      if (passwordError) {
        throw new Error(`Temporary synthetic password reset failed: ${passwordError.message}`);
      }
      results.push(
        await deleteExactSyntheticUser({
          admin: clients.admin,
          publicClient: clients.publicClient,
          account,
        }),
      );
    }

    for (const userId of deletions.map(({ account }) => account.userId)) {
      await assertAuthUserMissing(clients.admin, userId);
    }
    const remaining = await collectStrictSyntheticCandidates(
      clients.admin,
      [credentialAccount.userId],
    );
    if (
      remaining.length !== 1 ||
      remaining[0].account.userId !== credentialAccount.userId ||
      remaining[0].progress.xp !== EXPECTED_AUDIT_BASELINE.xp ||
      remaining[0].progress.completions !==
        EXPECTED_AUDIT_BASELINE.completions
    ) {
      throw new Error('Retained baseline postcondition failed after orphan cleanup');
    }
    await writeSafeEvidence(evidencePath, {
      schemaVersion: 1,
      projectRef: EXPECTED_PROJECT_REF,
      status: 'complete',
      completedAt: new Date().toISOString(),
      discoveredAccountCount: candidates.length,
      deletedAccountCount: results.length,
      retainedAccountCount: 1,
      progressBefore,
      candidateManifestSha256: candidateManifest.candidateManifestSha256,
      accountIdSha256: results.map((result) => result.userIdSha256).sort(),
      retainedAccountIdSha256: safeIdDigest(credentialAccount.userId),
      retainedBaseline: { ...EXPECTED_AUDIT_BASELINE },
      retainedCredentialsWritten,
      retainedGlobalRefreshRevocationRequested:
        retainedRevocation.globalRefreshRevocationRequested === true,
      retainedCapturedRefreshTokenRejected:
        retainedRevocation.capturedRefreshTokenRejected === true,
      globalRefreshRevocationRequestedCount: results.filter(
        (result) => result.globalRefreshRevocationRequested,
      ).length,
      capturedRefreshTokenRejectedCount: results.filter(
        (result) => result.capturedRefreshTokenRejected,
      ).length,
      accessTokensMayRemainValidUntilExpiry: true,
      remainingStrictSyntheticAccounts: 1,
      remainingProfileRows: 1,
    });
  } catch (error) {
    await writeSafeEvidence(evidencePath, {
      schemaVersion: 1,
      projectRef: EXPECTED_PROJECT_REF,
      status: 'incomplete',
      failedAt: new Date().toISOString(),
      discoveredAccountCount: candidates.length,
      deletedAccountCount: results.length,
      retainedAccountCount: 1,
      progressBefore,
      candidateManifestSha256: candidateManifest.candidateManifestSha256,
      retainedAccountIdSha256: safeIdDigest(credentialAccount.userId),
      retainedCredentialsWritten,
      retainedPasswordChanged,
      retainedGlobalRefreshRevocationRequested:
        retainedRevocation?.globalRefreshRevocationRequested === true,
      retainedCapturedRefreshTokenRejected:
        retainedRevocation?.capturedRefreshTokenRejected === true,
      deletedAccountIdSha256: results
        .map((result) => result.userIdSha256)
        .sort(),
      error: sanitizeErrorMessage(error.message),
      manualReviewRequired: true,
    });
    throw error;
  }

  console.log(
    `Orphan cleanup PASS: retained one 75:3 baseline and deleted ${results.length} strictly matched synthetic accounts`,
  );
}

function runSelfTest() {
  const account = {
    batchId: 'dgs-59',
    userId: '123e4567-e89b-42d3-a456-426614174000',
    email: 'dgs-qa-dgs-59-desktop-a1b2c3d4e5f6@example.invalid',
    password: 'Aa1!test-only-password-value',
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
    stats: { xp: 75, missionsCompleted: ['one', 'two', 'three'] },
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

  const candidates = matchStrictSyntheticCandidates([authUser], [profile]);
  const zeroProgressCandidate = {
    account: {
      batchId: 'dgs-59',
      userId: '123e4567-e89b-42d3-a456-426614174001',
      email: 'dgs-qa-dgs-59-mobile-b1b2c3d4e5f6@example.invalid',
    },
    progress: { xp: 0, completions: 0 },
  };
  const retentionOptions = new Map([['--retain-baseline', '75:3']]);
  const retention = selectRetainedBaseline(retentionOptions, [
    ...candidates,
    zeroProgressCandidate,
  ]);
  if (
    retention.retained.account.userId !== account.userId ||
    retention.deletions.length !== 1
  ) {
    throw new Error('Unique retained-baseline selection failed');
  }
  const positiveOptions = new Map([
    ['--confirm-delete-count', '1'],
  ]);
  assertOrphanCleanupAcknowledgements(positiveOptions, retention.deletions);

  let duplicateBaselineRejected = false;
  try {
    selectRetainedBaseline(retentionOptions, [...candidates, ...candidates]);
  } catch {
    duplicateBaselineRejected = true;
  }
  if (!duplicateBaselineRejected) {
    throw new Error('Multiple retained baselines were not rejected');
  }

  let missingBaselineRejected = false;
  try {
    selectRetainedBaseline(retentionOptions, [zeroProgressCandidate]);
  } catch {
    missingBaselineRejected = true;
  }
  if (!missingBaselineRejected) {
    throw new Error('Missing retained baseline was not rejected');
  }

  let profileMismatchRejected = false;
  try {
    matchStrictSyntheticCandidates([authUser], [
      { ...profile, student_class: 'real-student-class' },
    ]);
  } catch {
    profileMismatchRejected = true;
  }
  if (!profileMismatchRejected) {
    throw new Error('Mismatched synthetic profile was not rejected');
  }

  let countMismatchRejected = false;
  try {
    assertOrphanCleanupAcknowledgements(
      new Map([
        ['--confirm-delete-count', '2'],
      ]),
      retention.deletions,
    );
  } catch {
    countMismatchRejected = true;
  }
  if (!countMismatchRejected) {
    throw new Error('Orphan delete-count mismatch was not rejected');
  }

  validateCredentialsPayload({
    schemaVersion: 2,
    accountMode: 'single-production-lead',
    projectRef: EXPECTED_PROJECT_REF,
    syntheticOnly: true,
    batchId: account.batchId,
    accounts: [
      {
        ...account,
        role: 'production-lead',
        sessionName: 'DGSkills QA J1P1',
        viewport: '390x844',
        email: 'dgs-qa-dgs-59-production-lead-a1b2c3d4e5f6@example.invalid',
      },
    ],
  });
  makeRetainedCredentialsPayload(
    candidates[0],
    'Aa1!retained-test-only-password-value',
  );
  validateCandidateIdsPayload({
    schemaVersion: 1,
    projectRef: EXPECTED_PROJECT_REF,
    syntheticOnly: true,
    sourceContract: 'strict-synthetic-auth-v1',
    authUserIds: [account.userId],
  });

  console.log('Self-test PASS: identity, orphan cleanup, and credential checks fail closed');
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
  if (
    ![
      'canary',
      'prepare',
      'prepare-single',
      'verify',
      'cleanup',
      'cleanup-orphans',
    ].includes(command)
  ) {
    throw new Error(`Unknown command ${command}`);
  }

  const cliPath = assertSafetyGate(options);
  const clients = makeClients(loadProjectKeys(cliPath));

  if (command === 'canary') {
    await runCanary(options, clients);
  } else if (command === 'prepare') {
    await runPrepare(options, clients);
  } else if (command === 'prepare-single') {
    await runPrepareSingle(options, clients);
  } else if (command === 'verify') {
    await runVerify(options, clients);
  } else if (command === 'cleanup') {
    await runCleanup(options, clients);
  } else {
    await runCleanupOrphans(options, clients);
  }
}

main().catch((error) => {
  console.error(`QA account helper failed: ${sanitizeErrorMessage(error.message)}`);
  process.exitCode = 1;
});
