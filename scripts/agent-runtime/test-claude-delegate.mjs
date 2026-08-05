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
  cleanClaudeEnvironment,
  readEvidencePacket,
  resolveClaudeBinary,
  resolveGitBinary,
  resolveMode,
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

assert.equal(validateEvidencePacket(safePacket), safePacket);
assert.throws(
  () => validateEvidencePacket(`${safePacket}\nAuthorization: Bearer fake-secret-value`),
  /secret or personal data/,
);
assert.throws(
  () => validateEvidencePacket(`${safePacket}\naccess_token=abcdefghijklmnop`),
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
const buildArgs = buildClaudeArgs(
  buildMode,
  buildMode.effort,
  '/tmp/claude-worktree',
  ['src/components/Card.tsx', 'src/utils/**'],
).join(' ');
assert.match(buildArgs, /claude-opus-5/);
assert.match(buildArgs, /--disallowedTools Bash/);
assert.doesNotMatch(buildArgs, /Bash\(/);
assert.match(buildArgs, /Read\(\/tmp\/claude-worktree\/src\/components\/Card\.tsx\)/);
assert.match(buildArgs, /Read\(\/tmp\/claude-worktree\/src\/utils\/\*\*\)/);
assert.match(buildArgs, /--disallowedTools Bash,Grep/);
assert.doesNotMatch(buildArgs, /Grep\(\/tmp\/claude-worktree/);
assert.doesNotMatch(buildArgs, /--allowedTools Read,Grep/);
assert.doesNotMatch(buildArgs, /sonnet/i);
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
  ANTHROPIC_API_KEY: 'not-a-real-key',
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
validateCommitBinding(`COMMIT_SHA=${commit}`, { head: commit, status: '' }, true);
assert.throws(
  () =>
    validateCommitBinding(
      `COMMIT_SHA=${'b'.repeat(40)}`,
      { head: commit, status: '' },
      true,
    ),
  /clean current worktree commit/,
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
  safePacket,
  { root: '/tmp/project', head: commit },
  () => ({ status: 0, stdout: 'diff --git a/a b/a\n', stderr: '' }),
);
assert.match(canonicalPacket, /CANONICAL_COMMIT_DIFF/);
assert.match(canonicalPacket, /diff --git/);

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
      `COMMIT_SHA=${commit}`,
      { head: commit, status: ' M file' },
      true,
    ),
  /clean current worktree commit/,
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
