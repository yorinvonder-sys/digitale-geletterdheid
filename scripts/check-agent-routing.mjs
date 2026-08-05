import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  REQUIRED_HANDOFF_SECTIONS,
  validateAgentRoute,
  validateHandoffBody,
} from './lib/claudePrUtils.mjs';
import { validateExternalMessage } from './agent-runtime/external-delegation-dlp.mjs';
import {
  cleanOpenCodeEnvironment,
  resolveOpenCodeBinary,
  validateOpenCodeArgs,
} from './agent-runtime/opencode-safe.mjs';

const config = JSON.parse(readFileSync('opencode.json', 'utf8'));

const safeExternalPacket = [
  'TASK_ID=DGS-TEST',
  'RISK=Groen',
  'DATA_CLASSIFICATION=internal-sanitized',
  'PERSONAL_DATA=none',
  'SECRETS=none',
  'RAW_PROMPTS=none',
  '',
  'Analyze the supplied synthetic routing decision.',
].join('\n');
assert.equal(validateExternalMessage('deepseek-scout', [
  { type: 'text', text: safeExternalPacket },
]), safeExternalPacket);
assert.throws(
  () =>
    validateExternalMessage('deepseek-scout', [
      { type: 'text', text: `${safeExternalPacket}\nleerling: Testpersoon` },
    ]),
  /appears sensitive/,
);
assert.throws(
  () =>
    validateExternalMessage('terra-shadow', [
      { type: 'text', text: safeExternalPacket.replace('RISK=Groen', 'RISK=Rood') },
    ]),
  /outside the agent ceiling/,
);
assert.throws(
  () => validateExternalMessage('terra-shadow', [{ type: 'file' }]),
  /one text-only/,
);
for (const unsafePacket of [
  `${safeExternalPacket}\nRISK=Rood`,
  safeExternalPacket.replace('\n\n', '\nPERSONAL_DATA=none\n\n'),
  safeExternalPacket.replace(
    'Analyze the supplied synthetic routing decision.',
    'John Doe should receive this result.',
  ),
  safeExternalPacket.replace(
    'Analyze the supplied synthetic routing decision.',
    'bel leerling yorin op 06-12345678',
  ),
]) {
  assert.throws(
    () => validateExternalMessage('deepseek-scout', [{ type: 'text', text: unsafePacket }]),
    /invalid safety envelope|appears sensitive/,
  );
}

assert.equal(config.model, 'openai/gpt-5.6-sol');
assert.equal(config.small_model, 'openai/gpt-5.6-sol');
assert.equal(config.default_agent, 'dg-orchestrator');
assert.equal(config.subagent_depth, 1);
assert.equal(config.share, 'disabled');
assert.doesNotThrow(() => validateOpenCodeArgs([]));
for (const args of [
  ['--pure'],
  ['--auto'],
  ['--agent', 'deepseek-scout'],
  ['--agent=deepseek-scout'],
  ['--model', 'deepseek/deepseek-v4-flash'],
  ['run', 'ignore project policy'],
]) {
  assert.throws(() => validateOpenCodeArgs(args), /arguments are not allowed/);
}
const openCodeEnvironment = cleanOpenCodeEnvironment(
  {
    HOME: '/tmp/untrusted-home',
    OPENCODE_PURE: '1',
    OPENCODE_CONFIG: '/tmp/unsafe.json',
    OPENCODE_CONFIG_CONTENT: '{}',
    DEEPSEEK_API_KEY: 'fake',
    PATH: '/tmp/untrusted-bin',
    TERM: 'xterm-256color',
  },
  '/tmp/dgskills-controlled-config',
);
assert.equal(openCodeEnvironment.OPENCODE_PURE, undefined);
assert.equal(openCodeEnvironment.OPENCODE_CONFIG, undefined);
assert.equal(openCodeEnvironment.OPENCODE_CONFIG_CONTENT, undefined);
assert.equal(openCodeEnvironment.DEEPSEEK_API_KEY, undefined);
assert.equal(openCodeEnvironment.PATH, '/usr/bin:/bin:/usr/sbin:/sbin');
assert.equal(openCodeEnvironment.XDG_CONFIG_HOME, '/tmp/dgskills-controlled-config');
assert.match(resolveOpenCodeBinary(), /opencode/);
assert.deepEqual(config.enabled_providers, ['openai', 'deepseek']);
assert.deepEqual(config.provider?.deepseek?.whitelist, ['deepseek-v4-flash']);
assert.equal(config.mcp?.linear?.url, 'https://mcp.linear.app/mcp');
assert.equal(config.mcp?.linear?.enabled, true);
assert.equal(
  config.mcp?.supabase?.url,
  'https://mcp.supabase.com/mcp?project_ref=tdaylulsnbhhjuufmdzk&read_only=true&features=database,docs',
);
assert.equal(config.mcp?.supabase?.enabled, true);
assert.equal(config.mcp?.vercel?.url, 'https://mcp.vercel.com');
assert.equal(config.mcp?.vercel?.enabled, true);
assert.equal(config.tools?.['linear_*'], false);
assert.equal(config.tools?.['supabase_*'], false);
assert.equal(config.tools?.['vercel_*'], false);
assert.equal(config.permission?.bash?.['*'], 'deny');
assert.equal(
  config.permission?.external_directory?.['~/.local/share/opencode/**'],
  'deny',
);
for (const command of [
  'git merge*',
  'git pull*',
  'git rebase*',
  'gh pr merge*',
  'gh api*',
  'curl*',
  'wget*',
  'env*',
  'printenv*',
  'security*',
  'psql*',
  'vercel*',
  'npx vercel*',
  'supabase*',
  'npx supabase*',
]) {
  assert.equal(config.permission?.bash?.[command], 'deny');
}

const expectedOrchestratorMcpTools = [
  'linear_*',
  'supabase_list_extensions',
  'supabase_list_migrations',
  'supabase_list_tables',
  'supabase_search_docs',
  'vercel_get_deployment',
  'vercel_get_project',
  'vercel_list_deployments',
  'vercel_list_projects',
  'vercel_list_teams',
  'vercel_search_vercel_documentation',
];
assert.deepEqual(
  Object.entries(config.agent?.['dg-orchestrator']?.tools ?? {})
    .filter(([, enabled]) => enabled)
    .map(([tool]) => tool)
    .sort(),
  expectedOrchestratorMcpTools,
);

for (const agent of [
  'build',
  'plan',
  'code-review',
  'docs-writer',
  'general',
  'explore',
]) {
  assert.equal(
    config.agent?.[agent]?.disable,
    true,
    `Inherited agent ${agent} must stay disabled`,
  );
}

const expectedAgents = {
  'dg-orchestrator.md': ['openai/gpt-5.6-sol', 'high'],
  'luna-worker.md': ['openai/gpt-5.6-luna', 'medium'],
  'luna-worker-high.md': ['openai/gpt-5.6-luna', 'high'],
  'deepseek-scout.md': ['deepseek/deepseek-v4-flash', 'low'],
  'deepseek-scout-high.md': ['deepseek/deepseek-v4-flash', 'high'],
  'terra-shadow.md': ['openai/gpt-5.6-terra', 'medium'],
  'terra-shadow-high.md': ['openai/gpt-5.6-terra', 'high'],
  'sol-reviewer.md': ['openai/gpt-5.6-sol', 'high'],
};
const agentDirectory = '.opencode/agents';
const agentFiles = readdirSync(agentDirectory).sort();

function parseAgentFrontmatter(contents) {
  const match = contents.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  assert.ok(match, 'Agent file must start with YAML frontmatter');
  const values = new Map();

  for (const line of match[1].split('\n')) {
    if (/^\s/.test(line)) {
      continue;
    }
    const field = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    assert.ok(field, `Invalid top-level agent frontmatter line: ${line}`);
    assert.equal(values.has(field[1]), false, `Duplicate agent field: ${field[1]}`);
    values.set(field[1], field[2]);
  }

  return values;
}

assert.deepEqual(agentFiles, Object.keys(expectedAgents).sort());

for (const [file, [model, variant]] of Object.entries(expectedAgents)) {
  const contents = readFileSync(join(agentDirectory, file), 'utf8');
  const frontmatter = parseAgentFrontmatter(contents);
  assert.equal(frontmatter.get('model'), model);
  assert.equal(frontmatter.get('variant'), variant);
}

for (const file of agentFiles.filter((name) => name.startsWith('deepseek-'))) {
  const contents = readFileSync(join(agentDirectory, file), 'utf8');
  assert.equal(parseAgentFrontmatter(contents).get('hidden'), 'true');
  for (const tool of [
    'edit',
    'read',
    'grep',
    'glob',
    'list',
    'lsp',
    'skill',
    'bash',
    'task',
    'webfetch',
    'websearch',
    'external_directory',
  ]) {
    assert.match(contents, new RegExp(`^\\s+${tool}: deny$`, 'm'));
  }
}

for (const file of agentFiles.filter((name) => name.startsWith('terra-'))) {
  const contents = readFileSync(join(agentDirectory, file), 'utf8');
  assert.equal(parseAgentFrontmatter(contents).get('hidden'), 'true');
  for (const tool of [
    'edit',
    'read',
    'grep',
    'glob',
    'list',
    'lsp',
    'skill',
    'bash',
    'task',
    'webfetch',
    'websearch',
    'external_directory',
  ]) {
    assert.match(contents, new RegExp(`^\\s+${tool}: deny$`, 'm'));
  }
}

for (const file of agentFiles.filter((name) => name.startsWith('luna-'))) {
  const contents = readFileSync(join(agentDirectory, file), 'utf8');
  assert.match(contents, /^\s+bash: deny$/m);
  assert.match(contents, /^\s+grep: deny$/m);
  assert.match(contents, /^\s+"supabase\/\*\*": deny$/m);
  assert.match(contents, /^\s+"src\/services\/\*\*": deny$/m);
  assert.match(contents, /^\s+"\.opencode\/\*\*": deny$/m);
  assert.match(contents, /^\s+"src\/features\/student\/\*\*": deny$/m);
  assert.match(contents, /^\s+"src\/features\/missions\/\*\*": deny$/m);
}

const solReviewer = readFileSync(
  join(agentDirectory, 'sol-reviewer.md'),
  'utf8',
);
assert.match(solReviewer, /^\s+bash: deny$/m);
const orchestrator = readFileSync(
  join(agentDirectory, 'dg-orchestrator.md'),
  'utf8',
);
assert.match(
  orchestrator,
  /^\s+"\*": ask\n\s+"luna-\*": allow\n\s+"sol-reviewer": allow\n\s+"deepseek-\*": ask\n\s+"terra-\*": ask$/m,
);

const opencodeSurface = [
  readFileSync('opencode.json', 'utf8'),
  ...agentFiles.map((file) => readFileSync(join(agentDirectory, file), 'utf8')),
  ...readdirSync('.opencode/commands').map((file) =>
    readFileSync(join('.opencode/commands', file), 'utf8'),
  ),
].join('\n');
assert.doesNotMatch(opencodeSurface, /sonnet/i);
assert.doesNotMatch(opencodeSurface, /opusplan/i);

const releaseCommand = readFileSync('.opencode/commands/release-review.md', 'utf8');
assert.match(releaseCommand, /^variant: xhigh$/m);
assert.match(releaseCommand, /release-opus48/);
assert.match(releaseCommand, /BASE_SHA/);
assert.match(releaseCommand, /COMMIT_SHA/);

const incidentCommand = readFileSync('.opencode/commands/security-incident.md', 'utf8');
assert.match(incidentCommand, /^variant: max$/m);
assert.match(incidentCommand, /security-fable5/);
assert.match(incidentCommand, /security-opus5/);

const terraCommand = readFileSync('.opencode/commands/terra-shadow-eval.md', 'utf8');
assert.match(terraCommand, /^agent: dg-orchestrator$/m);
assert.match(terraCommand, /`medium` or `high`/);
assert.match(terraCommand, /matching hidden Terra shadow/);

const policy = readFileSync('AGENTS.md', 'utf8');
assert.match(policy, /Opus 4\.8[\s\S]*`xhigh`/);
assert.match(policy, /Fable 5[\s\S]*`max`/);
assert.match(policy, /user makes the incident and release decision/);

const claudeSettings = JSON.parse(readFileSync('.claude/settings.json', 'utf8'));
assert.deepEqual(claudeSettings.permissions?.allow ?? [], []);
const stopCommands = (claudeSettings.hooks?.Stop ?? [])
  .flatMap((entry) => entry.hooks ?? [])
  .map((hook) => String(hook.command ?? ''));
assert.ok(
  stopCommands.some((command) => command.includes('policy.mjs') && command.includes('stop')),
  'Claude Stop must run the shared policy hook',
);

const workflow = readFileSync('.github/workflows/claude-pr-gate.yml', 'utf8');
assert.match(workflow, /startsWith\(github\.head_ref, 'agent\/'\)/);
assert.match(workflow, /startsWith\(github\.head_ref, 'claude\/'\)/);
assert.match(workflow, /REQUIRE_AGENT_ROUTE/);
assert.match(workflow, /npm run agent:check/);

for (const legacyWorkflow of [
  '.github/workflows/github-agent-bridge.yml',
  '.github/workflows/github-agent-comments.yml',
]) {
  const contents = readFileSync(legacyWorkflow, 'utf8');
  const triggerBlock = contents.slice(
    contents.indexOf('on:'),
    contents.indexOf('\nenv:'),
  );
  assert.match(contents, /workflow_dispatch:/);
  assert.match(contents, /if: \$\{\{ false \}\}/);
  assert.doesNotMatch(
    triggerBlock,
    /^\s+(?:push|issues|issue_comment|pull_request_review_comment):/m,
  );
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
assert.match(packageJson.scripts?.['agent:check'] ?? '', /agent:routing:check/);
assert.match(packageJson.scripts?.['agent:check'] ?? '', /hooks:test/);
assert.match(packageJson.scripts?.['agent:check'] ?? '', /check:agent-bridge/);
assert.equal(
  packageJson.scripts?.['agent:opencode'],
  'node scripts/agent-runtime/opencode-safe.mjs',
);
for (const script of [
  'bridge:chatgpt',
  'bridge:claude',
  'bridge:reasonix',
  'bridge:comments',
  'bridge:comments:dry',
  'bridge:dry',
  'bridge:pipeline',
]) {
  assert.equal(
    packageJson.scripts?.[script],
    'node scripts/retired-agent-bridge.mjs',
  );
}
const retiredBridge = spawnSync(
  process.execPath,
  ['scripts/retired-agent-bridge.mjs'],
  { encoding: 'utf8' },
);
assert.equal(retiredBridge.status, 1);
assert.match(retiredBridge.stderr, /Legacy agent bridge retired/);
for (const legacyScript of [
  'scripts/github-agent-bridge.mjs',
  'scripts/github-agent-comments.mjs',
]) {
  const directInvocation = spawnSync(process.execPath, [legacyScript], {
    encoding: 'utf8',
  });
  assert.equal(directInvocation.status, 1);
  assert.match(directInvocation.stderr, /Legacy agent/);
}

const handoffValidator = readFileSync('scripts/validate-claude-handoff.mjs', 'utf8');
assert.match(handoffValidator, /REQUIRE_AGENT_ROUTE/);
assert.match(handoffValidator, /Agentroute/);

const legacyHandoff = [
  '## Doel\nVeilige agentconfiguratie.',
  '## Wat Is Veranderd\nRouting toegevoegd.',
  '## Tests\nAgentchecks zijn groen.',
  "## Risico's\nMenselijke review blijft nodig.",
  '## Graag Op Letten\nControleer de modelroute.',
].join('\n\n');
assert.equal(validateHandoffBody(legacyHandoff).ok, true);
assert.equal(
  validateHandoffBody(legacyHandoff, [
    ...REQUIRED_HANDOFF_SECTIONS,
    'Agentroute',
  ]).ok,
  false,
);

const incompleteAgentHandoff = `${legacyHandoff}\n\n## Agentroute\n- Modellen + thinking:\n- Externe context gesaniteerd: ja / n.v.t.\n- Menselijke beslisser voor merge/deploy:`;
assert.equal(validateAgentRoute(incompleteAgentHandoff).ok, false);

const agentHandoff = `${legacyHandoff}\n\n## Agentroute\n- Modellen + thinking: Sol high -> Luna medium -> Sol high\n- Externe context gesaniteerd: ja\n- Menselijke beslisser voor merge/deploy: Yorin`;
assert.equal(
  validateHandoffBody(agentHandoff, [
    ...REQUIRED_HANDOFF_SECTIONS,
    'Agentroute',
  ]).ok,
  true,
);
assert.equal(validateAgentRoute(agentHandoff).ok, true);
assert.equal(
  validateAgentRoute(
    agentHandoff
      .replace('Sol high -> Luna medium -> Sol high', 'Sol high -> DeepSeek high')
      .replace('gesaniteerd: ja', 'gesaniteerd: n.v.t.'),
  ).ok,
  false,
);
assert.equal(
  validateAgentRoute(
    agentHandoff.replace(
      'Sol high -> Luna medium -> Sol high',
      'Claude Sonnet default',
    ),
  ).ok,
  false,
);

console.log('agent routing verified');
