import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const USER_PROMPT_GATE =
  'Begin elke assistant-reply met deze afstemmingscheck';

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
    stopCommands.every((command) => !command.includes('user-prompt')),
    `${configPath} must not defer the user-prompt gate to Stop hooks`,
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
assert.ok(context.startsWith('DGSkills UserPromptSubmit safety gate'));
assert.ok(
  context.indexOf(USER_PROMPT_GATE) < context.indexOf('Before editing'),
  'The user-question gate must appear before the edit plan block',
);
assert.ok(
  context.indexOf(USER_PROMPT_GATE) < context.indexOf('Plan:'),
  'The user-question gate must appear before Plan/Risico/Bewijs',
);
assert.match(context, /ask critical clarifying questions/i);
assert.match(context, /wait for the answer/i);

console.log('agent hook wiring verified');
