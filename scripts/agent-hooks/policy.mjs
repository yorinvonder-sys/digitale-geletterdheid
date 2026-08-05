import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';

const CODE_EXTENSIONS = new Set([
  '.cjs',
  '.js',
  '.jsx',
  '.mjs',
  '.ts',
  '.tsx',
]);

const CODE_CONFIG_FILES = new Set([
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.critical.json',
  'vite.config.ts',
  'tailwind.config.js',
  'tailwind.app.config.js',
  'tailwind.public.config.js',
  'tailwind.shared.js',
  'postcss.config.js',
]);

const AGENT_CONFIG_PATTERNS = [
  /^AGENTS\.md$/,
  /^CLAUDE\.md$/,
  /^package(?:-lock)?\.json$/,
  /^opencode\.json$/,
  /^\.opencode\//,
  /^\.claude\/(?:settings\.json|model-selection\.md)$/,
  /^\.codex\//,
  /^\.github\/workflows\/claude-pr-gate\.yml$/,
  /^\.github\/workflows\/github-agent-(?:bridge|comments)\.yml$/,
  /^scripts\/(?:agent-hooks|agent-runtime)\//,
  /^scripts\/check-agent-routing\.mjs$/,
  /^scripts\/retired-agent-bridge\.mjs$/,
  /^scripts\/github-agent-(?:bridge|comments)\.mjs$/,
];

const PROTECTED_HOOK_PATTERNS = [
  /^scripts\/agent-hooks\//,
  /^\.claude\/settings\.json$/,
  /^\.codex\/hooks\.json$/,
];

const PROMPT_CHANGE_WORDS = [
  'aanpassen',
  'add',
  'bouw',
  'build',
  'code',
  'component',
  'fix',
  'hook',
  'implement',
  'inbouwen',
  'maak',
  'pas ',
  'repareer',
  'script',
  'update',
  'wijzig',
];

export function buildUserPromptContext(input = {}) {
  const prompt = String(input.prompt ?? input.user_prompt ?? '').toLowerCase();

  if (!PROMPT_CHANGE_WORDS.some((word) => prompt.includes(word))) {
    return null;
  }

  // Kort gehouden: de volledige werkwijze staat in AGENTS.md en is al bij
  // sessiestart geladen. Dit is alleen de herinnering op het moment zelf.
  return {
    additionalContext: [
      'DGSkills safety gate (code/config):',
      'Vóór een edit één kort blok — Plan: wat verandert. Risico: Groen/Geel/Rood + waarom. Waarschijnlijke bestanden. Bewijs: test, build of check.',
      'Rood = auth, admin, Supabase, AI-endpoints, secrets, betalingen, leerlinggegevens. Houd scope klein; ná de edit: wat veranderde + restrisico.',
    ].join('\n'),
  };
}

export function handleUserPromptSubmit(input = {}) {
  const context = buildUserPromptContext(input);

  if (!context) {
    return null;
  }

  return {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context.additionalContext,
    },
  };
}

export function extractTouchedPaths(input = {}) {
  const paths = new Set();
  const toolInput = input.tool_input ?? {};
  const cwd = input.cwd;

  addPath(paths, toolInput.file_path, cwd);
  addPath(paths, toolInput.path, cwd);
  addPath(paths, toolInput.notebook_path, cwd);

  if (Array.isArray(toolInput.edits)) {
    for (const edit of toolInput.edits) {
      addPath(paths, edit?.file_path, cwd);
      addPath(paths, edit?.path, cwd);
    }
  }

  const patchText = String(toolInput.command ?? toolInput.patch ?? '');
  const patchPathPattern = /^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm;
  let match;

  while ((match = patchPathPattern.exec(patchText)) !== null) {
    addPath(paths, match[1], cwd);
  }

  return [...paths];
}

export function handlePreToolUse(input = {}) {
  const toolName = String(input.tool_name ?? '');
  const toolInput = input.tool_input ?? {};
  const touchedPaths = extractTouchedPaths(input);
  const secretPath = touchedPaths.find(isSecretPath);

  if (secretPath) {
    return denyPreToolUse(
      `Blocked edit to ${secretPath}. Secret-bearing files must not be changed by an agent hook flow.`,
    );
  }

  const protectedPath = extractTouchedPaths(input).find(isProtectedHookPath);

  if (protectedPath) {
    return denyPreToolUse(
      `Automated edits to active hook enforcement are blocked: ${protectedPath}. Use a dedicated human-reviewed maintenance workflow.`,
    );
  }

  if (containsLikelySecret(toolInput)) {
    return denyPreToolUse(
      'Blocked tool call because it appears to contain an API key, token, private key, or service credential.',
    );
  }

  if (toolName === 'Bash') {
    const dangerousReason = getDangerousCommandReason(toolInput.command);

    if (dangerousReason) {
      return denyPreToolUse(dangerousReason);
    }
  }

  return null;
}

export function handlePostToolUse(input = {}, options = {}) {
  const toolInput = input.tool_input ?? {};

  if (containsLikelySecret(toolInput)) {
    return {
      decision: 'block',
      reason: [
        'DGSkills hook found a possible secret in the tool input.',
        'Remove the secret from code/history if it was written, rotate the credential if needed, and explain what was checked before continuing.',
      ].join(' '),
    };
  }

  const touchedPaths = extractTouchedPaths(input);
  const doctorPaths = touchedPaths.filter(isDoctorRelevantPath);
  const agentPaths = touchedPaths.filter(isAgentRelevantPath);
  const bashUsed = input.tool_name === 'Bash';

  if (doctorPaths.length > 0 || agentPaths.length > 0 || bashUsed) {
    markNeedsVerification(input, doctorPaths, agentPaths, options, {
      forceAll: bashUsed,
    });
  }

  return null;
}

export function handleStop(input = {}, options = {}) {
  if (input.stop_hook_active === true) {
    return null;
  }

  const statePath = getStatePath(input, options);

  if (!existsSync(statePath)) {
    return null;
  }

  const state = readJsonFile(statePath);

  if (!state) {
    return {
      decision: 'block',
      reason: `DGSkills verification state is malformed at ${statePath}. Treat verification as failed and recreate the state through a normal edit before continuing.`,
    };
  }

  if (!state?.needsDoctor && !state?.needsAgentCheck) {
    return null;
  }

  const riskNote = state.redRiskTouched
    ? '\n\nRed-risk area touched: review auth, Supabase, AI endpoints, admin, personal data, or money-related behavior before finalizing.'
    : '';

  if (state.needsAgentCheck) {
    const runAgentCheck = options.runAgentCheck ?? defaultRunAgentCheck;
    const agentResult = runAgentCheck(input.cwd ?? process.cwd());

    if (agentResult.status !== 0) {
      const output = formatCommandOutput(agentResult);
      return {
        decision: 'block',
        reason: [
          'DGSkills hook ran `npm run agent:check` because agent policy/config changed, and it failed.',
          'Fix the routing, hook, bridge, or handoff issue before continuing.',
          riskNote,
          output ? `\n\nOutput:\n${output}` : '',
        ].join(' ').trim(),
      };
    }
  }

  if (state.needsDoctor) {
    const runDoctor = options.runDoctor ?? defaultRunDoctor;
    const result = runDoctor(input.cwd ?? process.cwd());

    if (result.status !== 0) {
      const output = formatCommandOutput(result);
      return {
        decision: 'block',
        reason: [
          'DGSkills hook ran `npm run doctor` because code/config files changed, and it failed.',
          'Inspect the output, fix the issue or explain why it is unrelated, then continue.',
          riskNote,
          output ? `\n\nOutput:\n${output}` : '',
        ].join(' ').trim(),
      };
    }
  }

  rmSync(statePath, { force: true });
  return {
    continue: true,
    suppressOutput: true,
  };
}

export function containsLikelySecret(value) {
  const text = JSON.stringify(value ?? '');

  return [
    /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
    /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{20,}\b/,
    /\bsbp_[A-Za-z0-9]{30,}\b/,
    /\b(?:rk|sk)_(?:live|test)_[A-Za-z0-9]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
    /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
    /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
    /\bAIza[0-9A-Za-z_-]{35}\b/,
    /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/,
    /\bAuthorization:\s*Bearer\s+\S+/i,
  ].some((pattern) => pattern.test(text));
}

function denyPreToolUse(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

function addPath(paths, path, cwd) {
  if (!path || typeof path !== 'string') {
    return;
  }

  paths.add(normalizeProjectPath(path, cwd));
}

function normalizeProjectPath(path, cwd) {
  let normalized = path.replaceAll('\\', '/').trim();
  const normalizedCwd = String(cwd ?? '').replaceAll('\\', '/');

  if (normalizedCwd && normalized.startsWith(`${normalizedCwd}/`)) {
    normalized = normalized.slice(normalizedCwd.length + 1);
  }

  return posix.normalize(normalized.replace(/^\.\//, ''));
}

function isSecretPath(path) {
  const normalized = normalizeProjectPath(path).toLowerCase();
  const basename = normalized.split('/').pop() ?? normalized;

  if (
    /^\.env(?:$|\.(?:local|production|development|staging|test)$)/.test(
      basename,
    )
  ) {
    return true;
  }

  return [
    /serviceaccountkey\.json$/,
    /firebase-service-account\.json$/,
    /\.pem$/,
    /\.p12$/,
    /\.key$/,
    /\.cert$/,
  ].some((pattern) => pattern.test(basename));
}

function getDangerousCommandReason(commandValue) {
  const command = String(commandValue ?? '').replace(/\s+/g, ' ').trim();

  if (!command) {
    return null;
  }

  const checks = [
    {
      pattern: /\bgit\s+reset\s+--hard\b/,
      reason: '`git reset --hard` is blocked because it can erase user work.',
    },
    {
      pattern: /\bgit\s+checkout\s+--\s+/,
      reason: '`git checkout --` is blocked because it can erase user work.',
    },
    {
      pattern: /\bgit\s+clean\s+-[^\s]*[fd][^\s]*\b/,
      reason: '`git clean -fd` style commands are blocked because they can delete untracked user files.',
    },
    {
      pattern: /\brm\s+-[^\s]*r[^\s]*f[^\s]*\s+(?:\/|\.\.?|~|\$HOME|\*)/,
      reason: '`rm -rf` against broad paths is blocked because it can delete project or user files.',
    },
    {
      pattern:
        /\b(?:cat|less|more|sed|awk|grep|rg)\b.+(?:^|\s)\.env(?:\.local|\.production|\.development|\.staging|\.test)?\b/,
      reason: 'Reading secret-bearing .env files is blocked. Use templates or variable names instead.',
    },
    {
      pattern:
        /(?:scripts\/(?:[^/\s]+\/\.\.\/)*agent-hooks\/|\.claude\/settings\.json|\.codex\/hooks\.json)/,
      reason: 'Shell access to active hook enforcement is blocked. Use a dedicated human-reviewed maintenance workflow.',
    },
  ];

  const match = checks.find((check) => check.pattern.test(command));
  return match?.reason ?? null;
}

function isDoctorRelevantPath(path) {
  const normalized = normalizeProjectPath(path);
  const extension = normalized.match(/\.[^.]+$/)?.[0] ?? '';

  return CODE_EXTENSIONS.has(extension) || CODE_CONFIG_FILES.has(normalized);
}

function isAgentRelevantPath(path) {
  const normalized = normalizeProjectPath(path);
  return AGENT_CONFIG_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isProtectedHookPath(path) {
  const normalized = normalizeProjectPath(path);
  return PROTECTED_HOOK_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isRedRiskPath(path) {
  const normalized = normalizeProjectPath(path);

  return [
    /^supabase\//,
    /^src\/services\//,
    /^src\/contexts\//,
    /^src\/app\/AuthenticatedApp\.tsx$/,
    /^src\/app\/AppRouter\.tsx$/,
    /^src\/features\/(?:developer|consent|assessment|teacher|games)\//,
    /^src\/features\/auth\/(?:Login|ChangePassword|MfaGate)\.tsx$/,
    /^src\/features\/consent\/ParentConsentApproval\.tsx$/,
    /^src\/components\/app-shell\/PrivacyModal\.tsx$/,
    /^src\/features\/ai-chat\/StudentAIChat\.tsx$/,
    /^opencode\.json$/,
    /^\.opencode\/agents\//,
    /^scripts\/agent-runtime\//,
    /^scripts\/retired-agent-bridge\.mjs$/,
    /^scripts\/github-agent-(?:bridge|comments)\.mjs$/,
    /^\.github\/workflows\/github-agent-(?:bridge|comments)\.yml$/,
  ].some((pattern) => pattern.test(normalized));
}

function markNeedsVerification(
  input,
  doctorPaths,
  agentPaths,
  options,
  flags = {},
) {
  const statePath = getStatePath(input, options);
  const existing = readJsonFile(statePath) ?? {};
  const existingPaths = Array.isArray(existing.paths) ? existing.paths : [];
  const touchedPaths = [...doctorPaths, ...agentPaths];
  const mergedPaths = [...new Set([...existingPaths, ...touchedPaths])].sort();

  mkdirSync(join(statePath, '..'), { recursive: true });

  writeFileSync(
    statePath,
    JSON.stringify(
      {
        needsDoctor:
          Boolean(existing.needsDoctor) ||
          doctorPaths.length > 0 ||
          Boolean(flags.forceAll),
        needsAgentCheck:
          Boolean(existing.needsAgentCheck) ||
          agentPaths.length > 0 ||
          Boolean(flags.forceAll),
        cwd: input.cwd ?? process.cwd(),
        sessionId: input.session_id ?? null,
        paths: mergedPaths,
        redRiskTouched:
          Boolean(existing.redRiskTouched) ||
          touchedPaths.some(isRedRiskPath),
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

function getStatePath(input = {}, options = {}) {
  const stateDir =
    options.stateDir ?? join(tmpdir(), 'dgskills-agent-hooks-state');
  const key = `${input.cwd ?? process.cwd()}::${input.session_id ?? 'no-session'}`;
  const hash = createHash('sha256').update(key).digest('hex').slice(0, 24);

  return join(stateDir, `${hash}.json`);
}

function readJsonFile(path) {
  if (!existsSync(path)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function defaultRunDoctor(cwd) {
  return spawnSync('npm', ['run', 'doctor'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    timeout: 120000,
  });
}

function defaultRunAgentCheck(cwd) {
  return spawnSync('npm', ['run', 'agent:check'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
    timeout: 180000,
  });
}

function formatCommandOutput(result) {
  const text = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();

  if (!text) {
    return `Command exited with status ${result.status ?? 'unknown'}.`;
  }

  return text.split('\n').slice(-30).join('\n');
}

async function readStdinJson() {
  let raw = '';

  for await (const chunk of process.stdin) {
    raw += chunk;
  }

  return raw.trim() ? JSON.parse(raw) : {};
}

async function main() {
  const mode = process.argv[2];
  const input = await readStdinJson();
  let output = null;

  if (mode === 'user-prompt') {
    output = handleUserPromptSubmit(input);
  } else if (mode === 'pre-tool') {
    output = handlePreToolUse(input);
  } else if (mode === 'post-tool') {
    output = handlePostToolUse(input);
  } else if (mode === 'stop') {
    output = handleStop(input);
  } else {
    throw new Error(`Unknown agent hook mode: ${mode}`);
  }

  if (output) {
    process.stdout.write(`${JSON.stringify(output)}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.stack ?? error.message);
    process.exit(1);
  });
}
