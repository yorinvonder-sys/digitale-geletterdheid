import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  assertExpectedModel,
  appendCanonicalCommitDiff,
  buildClaudeArgs,
  buildClaudeScopeDenyRules,
  cleanClaudeEnvironment,
  readEvidencePacket,
  resolveClaudeBinary,
  resolveGitBinary,
  resolveMode,
  sanitizeCanonicalDiff,
  parseAllowedBuildPaths,
  validateBuildDiff,
  validateCommitBinding,
  validateEvidencePacket,
} from './claude-delegate.mjs';

const safePacket = [
  'TASK_ID=DGS-TEST',
  'RISK=Rood',
  'DATA_CLASSIFICATION=internal-sanitized',
  'PERSONAL_DATA=none',
  'SECRETS=none',
  'RAW_PROMPTS=none',
  '',
  'Review a synthetic authentication diff with no production data.',
].join('\n');
const fakeAuthorization = `${['Authorization', 'Bearer'].join(': ')} fake-secret-value`;
const fakeAccessToken = `${['access', 'token'].join('_')}=abcdefghijklmnop`;

assert.equal(validateEvidencePacket(safePacket), safePacket);
assert.throws(
  () => validateEvidencePacket(`${safePacket}\n${fakeAuthorization}`),
  /secret or personal data/,
);
assert.throws(
  () => validateEvidencePacket(`${safePacket}\n${fakeAccessToken}`),
  /secret or personal data/,
);
assert.throws(
  () => validateEvidencePacket(safePacket.replace('PERSONAL_DATA=none\n', '')),
  /required safety header/,
);

const releaseMode = resolveMode('release-opus48');
assert.equal(releaseMode.model, 'claude-opus-4-8');
assert.equal(releaseMode.effort, 'xhigh');
assert.equal(releaseMode.write, false);
assert.equal(releaseMode.requiresCleanCommit, true);

const incidentMode = resolveMode('security-fable5');
assert.equal(incidentMode.model, 'claude-fable-5');
assert.equal(incidentMode.effort, 'max');

const buildMode = resolveMode('build-opus5', 'xhigh');
const claudeArgsDirectory = mkdtempSync(join(tmpdir(), 'claude-args-test-'));
try {
  mkdirSync(join(claudeArgsDirectory, 'src', 'components'), { recursive: true });
  mkdirSync(join(claudeArgsDirectory, 'src', 'utils'), { recursive: true });
  writeFileSync(join(claudeArgsDirectory, 'package.json'), '{}');
  writeFileSync(join(claudeArgsDirectory, 'src', 'components', 'Card.tsx'), '');
  const buildArgsList = buildClaudeArgs(
    buildMode,
    buildMode.effort,
    claudeArgsDirectory,
    ['src/components/Card.tsx', 'src/utils/**'],
  );
  const buildArgs = buildArgsList.join(' ');
  const allowedTools = buildArgsList[buildArgsList.indexOf('--allowedTools') + 1];
  const settings = JSON.parse(
    buildArgsList[buildArgsList.indexOf('--settings') + 1],
  );
  const denyRules = buildClaudeScopeDenyRules(claudeArgsDirectory, [
    'src/components/Card.tsx',
    'src/utils/**',
  ]);

  assert.match(buildArgs, /claude-opus-5/);
  assert.match(buildArgs, /--disallowedTools Bash/);
  assert.doesNotMatch(buildArgs, /Bash\(/);
  assert.match(allowedTools, /Read\(\/src\/components\/Card\.tsx\)/);
  assert.match(allowedTools, /Read\(\/src\/utils\/\*\*\)/);
  assert.doesNotMatch(allowedTools, /Write\(/);
  assert.match(buildArgs, /--disallowedTools Bash,Grep/);
  assert.doesNotMatch(buildArgs, /--allowedTools Read,Grep/);
  assert.doesNotMatch(buildArgs, /sonnet/i);
  assert.ok(
    denyRules.some(
      (rule) => rule.startsWith('Read(//') && rule.endsWith('/package.json)'),
    ),
  );
  assert.ok(
    denyRules.some(
      (rule) => rule.startsWith('Edit(//') && rule.endsWith('/package.json)'),
    ),
  );
  assert.equal(denyRules.some((rule) => rule.includes('Card.tsx')), false);
  assert.equal(denyRules.some((rule) => rule.includes('/src/utils/')), false);
  assert.ok(
    denyRules.some((rule) => /^Read\(\/\/usr(?:\/\*\*)?\)$/.test(rule)),
  );
  assert.ok(
    settings.permissions.deny.some(
      (rule) => rule.startsWith('Read(//') && rule.endsWith('/package.json)'),
    ),
  );
  assert.ok(
    settings.permissions.deny.some((rule) =>
      /^Read\(\/\/usr(?:\/\*\*)?\)$/.test(rule),
    ),
  );
  assert.equal(settings.permissions.disableBypassPermissionsMode, 'disable');
  assert.equal(settings.permissions.disableAutoMode, 'disable');
} finally {
  rmSync(claudeArgsDirectory, { recursive: true, force: true });
}
assert.throws(
  () => buildClaudeArgs(buildMode, buildMode.effort),
  /worktree root/,
);

const reviewMode = resolveMode('review-opus5', 'low');
const reviewArgs = buildClaudeArgs(reviewMode, reviewMode.effort);
assert.equal(reviewArgs[reviewArgs.indexOf('--tools') + 1], '');
assert.equal(reviewArgs.includes('--allowedTools'), false);

assert.deepEqual(
  parseAllowedBuildPaths(
    `${safePacket}\nALLOWED_PATHS=src/components/Card.tsx,src/utils/**`,
    true,
  ),
  ['src/components/Card.tsx', 'src/utils/**'],
);
assert.throws(
  () => parseAllowedBuildPaths(`${safePacket}\nALLOWED_PATHS=src/services/**`, true),
  /not allowed/,
);
assert.throws(
  () => parseAllowedBuildPaths(`${safePacket}\nALLOWED_PATHS=.git/**`, true),
  /not allowed/,
);
for (const umbrella of ['scripts/**', 'src/**', 'src/features/**']) {
  assert.throws(
    () =>
      parseAllowedBuildPaths(
        `${safePacket}\nALLOWED_PATHS=${umbrella}`,
        true,
      ),
    /not allowed/,
  );
}
assert.throws(
  () => parseAllowedBuildPaths(safePacket, true),
  /requires 1-20/,
);

assert.deepEqual(
  assertExpectedModel(
    { modelUsage: { 'claude-opus-5': { inputTokens: 10 } } },
    'claude-opus-5',
  ),
  ['claude-opus-5'],
);
assert.throws(
  () =>
    assertExpectedModel(
      { modelUsage: { 'claude-opus-5-20260801': { inputTokens: 10 } } },
      'claude-opus-5',
    ),
  /unexpected model/,
);

const environment = cleanClaudeEnvironment({
  ANTHROPIC_API_KEY: 'fake',
  ANTHROPIC_BASE_URL: 'https://example.invalid',
  PATH: '/tmp/untrusted-bin',
  HTTPS_PROXY: 'https://proxy.invalid',
  SAFE_VALUE: 'removed',
});
assert.equal(environment.ANTHROPIC_API_KEY, undefined);
assert.equal(environment.ANTHROPIC_BASE_URL, undefined);
assert.equal(environment.PATH, '/usr/bin:/bin:/usr/sbin:/sbin');
assert.equal(environment.HTTPS_PROXY, undefined);
assert.equal(environment.SAFE_VALUE, undefined);

const packetDirectory = mkdtempSync(join(tmpdir(), 'claude-packet-test-'));
try {
  const packetPath = join(packetDirectory, 'packet.txt');
  const symlinkPath = join(packetDirectory, 'packet-link.txt');
  writeFileSync(packetPath, safePacket, { mode: 0o600 });
  symlinkSync(packetPath, symlinkPath);
  assert.equal(readEvidencePacket(packetPath), safePacket);
  assert.throws(() => readEvidencePacket(symlinkPath), /non-symlink/);
} finally {
  rmSync(packetDirectory, { recursive: true, force: true });
}

const commit = 'a'.repeat(40);
const baseCommit = 'b'.repeat(40);
const releaseBinding = `BASE_SHA=${baseCommit}\nCOMMIT_SHA=${commit}`;
const trustedMergeBase = () => ({
  status: 0,
  stdout: `${baseCommit}\n`,
  stderr: '',
});
validateCommitBinding(
  releaseBinding,
  { root: '/tmp/project', head: commit, status: '' },
  true,
  trustedMergeBase,
);
assert.throws(
  () =>
    validateCommitBinding(
      `BASE_SHA=${baseCommit}\nCOMMIT_SHA=${'c'.repeat(40)}`,
      { root: '/tmp/project', head: commit, status: '' },
      true,
    ),
  /exact base and clean current worktree commits/,
);
assert.throws(
  () =>
    validateCommitBinding(
      releaseBinding,
      { root: '/tmp/project', head: commit, status: '' },
      true,
      () => ({ status: 0, stdout: `${'c'.repeat(40)}\n`, stderr: '' }),
    ),
  /trusted target merge-base/,
);
assert.throws(
  () =>
    validateCommitBinding(
      `BASE_SHA=${commit}\nCOMMIT_SHA=${commit}`,
      { root: '/tmp/project', head: commit, status: '' },
      true,
      () => ({ status: 0, stdout: `${commit}\n`, stderr: '' }),
    ),
  /exact base and clean current worktree commits/,
);
assert.throws(
  () =>
    validateCommitBinding(
      `${releaseBinding}\nBASE_SHA=${baseCommit}`,
      { root: '/tmp/project', head: commit, status: '' },
      true,
      trustedMergeBase,
    ),
  /exact base and clean current worktree commits/,
);

const binaryDirectory = mkdtempSync(join(tmpdir(), 'claude-binary-test-'));
try {
  const binaryPath = join(binaryDirectory, 'claude');
  const gitPath = join(binaryDirectory, 'git');
  writeFileSync(binaryPath, '#!/bin/sh\n', { mode: 0o700 });
  writeFileSync(gitPath, '#!/bin/sh\n', { mode: 0o700 });
  assert.equal(resolveClaudeBinary([binaryPath]), realpathSync(binaryPath));
  assert.equal(resolveGitBinary([gitPath]), realpathSync(gitPath));
} finally {
  rmSync(binaryDirectory, { recursive: true, force: true });
}

const canonicalPacket = appendCanonicalCommitDiff(
  `${safePacket}\nBASE_SHA=${baseCommit}`,
  { root: '/tmp/project', head: commit },
  () => ({ status: 0, stdout: 'diff --git a/a b/a\n', stderr: '' }),
);
assert.match(canonicalPacket, /CANONICAL_BRANCH_DIFF/);
assert.match(canonicalPacket, new RegExp(`BASE ${baseCommit}`));
assert.match(canonicalPacket, new RegExp(`HEAD ${commit}`));
assert.match(canonicalPacket, /diff --git/);
assert.match(
  sanitizeCanonicalDiff(`-removed ${fakeAuthorization}`),
  /REDACTED_SENSITIVE_CONTENT/,
);
assert.throws(
  () => sanitizeCanonicalDiff(`@@ -1 +1 @@\n+added ${fakeAuthorization}`),
  /adds sensitive content/,
);
assert.throws(
  () => sanitizeCanonicalDiff(`@@ -1 +1 @@\n+++${fakeAuthorization}`),
  /adds sensitive content/,
);

const diffDirectory = mkdtempSync(join(tmpdir(), 'claude-diff-test-'));
try {
  assert.deepEqual(
    validateBuildDiff(
      diffDirectory,
      ['src/components/Card.tsx', 'src/utils/**'],
      (_command, args) => ({
        status: 0,
        stdout: args[0] === 'diff' ? 'src/components/Card.tsx\nsrc/utils/a.ts\n' : '',
        stderr: '',
      }),
    ),
    ['src/components/Card.tsx', 'src/utils/a.ts'],
  );
  assert.throws(
    () =>
      validateBuildDiff(diffDirectory, ['src/components/Card.tsx'], () => ({
        status: 0,
        stdout: 'src/services/supabase.ts\n',
        stderr: '',
      })),
    /outside the assigned slice/,
  );
} finally {
  rmSync(diffDirectory, { recursive: true, force: true });
}
assert.throws(
  () =>
    validateCommitBinding(
      releaseBinding,
      { root: '/tmp/project', head: commit, status: ' M file' },
      true,
      trustedMergeBase,
    ),
  /exact base and clean current worktree commits/,
);

const buildPathDirectory = mkdtempSync(join(tmpdir(), 'claude-build-path-test-'));
try {
  const outsideDirectory = mkdtempSync(join(tmpdir(), 'claude-build-outside-test-'));
  mkdirSync(join(buildPathDirectory, 'src'));
  symlinkSync(outsideDirectory, join(buildPathDirectory, 'src', 'linked'));
  assert.throws(
    () =>
      parseAllowedBuildPaths(
        `${safePacket}\nALLOWED_PATHS=src/linked/**`,
        true,
        buildPathDirectory,
      ),
    /symlink/,
  );
  rmSync(outsideDirectory, { recursive: true, force: true });
} finally {
  rmSync(buildPathDirectory, { recursive: true, force: true });
}

console.log('Claude delegate tests passed');
