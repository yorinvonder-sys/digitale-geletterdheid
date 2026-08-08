import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const USER_PROMPT_GATE = 'Vóór een edit';

const CONFIG_FILES = [
  '.codex/hooks.json',
  '.claude/settings.json',
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function collectHookCommands(hooks = []) {
  return hooks
    .flatMap((entry) => entry?.hooks ?? [])
    .map((hook) => String(hook?.command ?? ''))
    .filter(Boolean);
}

for (const configPath of CONFIG_FILES) {
  const config = readJson(configPath);
  const commands = collectHookCommands(config.hooks?.UserPromptSubmit);

  assert.ok(
    commands.some(
      (command) =>
        command.includes('scripts/agent-hooks/policy.mjs') &&
        command.includes('user-prompt'),
    ),
    `${configPath} must wire UserPromptSubmit to policy.mjs user-prompt`,
  );

  const stopCommands = collectHookCommands(config.hooks?.Stop);
  assert.ok(
    stopCommands.some(
      (command) =>
        command.includes('scripts/agent-hooks/policy.mjs') &&
        command.includes('stop'),
    ),
    `${configPath} must wire Stop to policy.mjs stop`,
  );
  assert.ok(
    stopCommands.every((command) => !command.includes('user-prompt')),
    `${configPath} must not defer the user-prompt gate to Stop hooks`,
  );

  const postMatchers = (config.hooks?.PostToolUse ?? [])
    .map((entry) => String(entry?.matcher ?? ''))
    .join('|');
  assert.match(
    postMatchers,
    /Bash/,
    `${configPath} must record Bash use for fail-closed verification`,
  );

  const stopTimeouts = (config.hooks?.Stop ?? [])
    .flatMap((entry) => entry?.hooks ?? [])
    .map((hook) => Number(hook?.timeout ?? 0));
  assert.ok(
    stopTimeouts.every((timeout) => timeout >= 420),
    `${configPath} Stop hooks must cover agent check plus doctor timeouts`,
  );
}

const codexConfig = readFileSync('.codex/config.toml', 'utf8');
assert.match(
  codexConfig,
  /^\s*codex_hooks\s*=\s*true\s*$/m,
  '.codex/config.toml must enable codex_hooks',
);

const smoke = spawnSync(
  process.execPath,
  ['scripts/agent-hooks/policy.mjs', 'user-prompt'],
  {
    input: JSON.stringify({ prompt: 'Fix de login flow' }),
    encoding: 'utf8',
  },
);

assert.equal(smoke.status, 0, smoke.stderr);

const output = JSON.parse(smoke.stdout);
assert.equal(output.hookSpecificOutput?.hookEventName, 'UserPromptSubmit');

const context = String(output.hookSpecificOutput?.additionalContext ?? '');
assert.ok(context.startsWith('DGSkills safety gate'));
assert.ok(
  context.indexOf(USER_PROMPT_GATE) < context.indexOf('Plan:'),
  'De edit-instructie moet vóór Plan/Risico/Bewijs staan',
);
assert.match(context, /Risico: Groen\/Geel\/Rood/);
assert.match(context, /leerlinggegevens/);
// De injectie blijft bewust kort; de volledige werkwijze staat in AGENTS.md.
assert.ok(
  context.split(/\s+/).length < 60,
  'De safety-gate-injectie moet kort blijven (< 60 woorden)',
);

console.log('agent hook wiring verified');
