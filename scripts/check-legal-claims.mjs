import { spawnSync } from 'node:child_process';

const commands = [
  ['node', ['scripts/check-ai-provider-docs.mjs']],
  ['node', ['scripts/check-legal-evidence.mjs']],
  ['node', ['scripts/check-gdpr-rights-coverage.mjs']],
  ['node', ['scripts/check-retention-policy.mjs']],
  ['node', ['scripts/check-processing-restriction-enforcement.mjs']],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Legal claim hardening checks passed');
