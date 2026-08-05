import { spawnSync } from 'node:child_process';
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_PACKET_BYTES = 256 * 1024;
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024;
const MAX_ALLOWED_PATHS = 20;

const FORBIDDEN_BUILD_PATHS = [
  /^\.env(?:\.|$)/,
  /^\.git(?:\/|$)/,
  /^\.claude(?:\/|$)/,
  /^\.codex(?:\/|$)/,
  /^\.github(?:\/|$)/,
  /^\.opencode(?:\/|$)/,
  /^AGENTS\.md$/,
  /^CLAUDE\.md$/,
  /^opencode\.json$/,
  /^package(?:-lock)?\.json$/,
  /^scripts\/(?:agent-hooks|agent-runtime)(?:\/|$)/,
  /^scripts\/check-agent-routing\.mjs$/,
  /^supabase(?:\/|$)/,
  /^src\/(?:app|contexts|services)(?:\/|$)/,
  /^src\/features\/(?:ai-chat|assessment|auth|consent|dashboard|dev-tools|developer|games|missions|profile|seo|student|teacher)(?:\/|$)/,
];

export const CLAUDE_MODES = Object.freeze({
  'review-opus5': {
    model: 'claude-opus-5',
    expectedModel: 'claude-opus-5',
    defaultEffort: 'high',
    allowedEfforts: ['low', 'medium', 'high', 'xhigh', 'max'],
    write: false,
    maxTurns: 8,
  },
  'build-opus5': {
    model: 'claude-opus-5',
    expectedModel: 'claude-opus-5',
    defaultEffort: 'medium',
    allowedEfforts: ['low', 'medium', 'high', 'xhigh', 'max'],
    write: true,
    maxTurns: 16,
  },
  'release-opus48': {
    model: 'claude-opus-4-8',
    expectedModel: 'claude-opus-4-8',
    fixedEffort: 'xhigh',
    write: false,
    requiresCleanCommit: true,
    maxTurns: 10,
  },
  'security-fable5': {
    model: 'claude-fable-5',
    expectedModel: 'claude-fable-5',
    fixedEffort: 'max',
    write: false,
    maxTurns: 14,
  },
  'security-opus5': {
    model: 'claude-opus-5',
    expectedModel: 'claude-opus-5',
    fixedEffort: 'max',
    write: false,
    maxTurns: 14,
  },
});

const SENSITIVE_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{20,}\b/,
  /\bsbp_[A-Za-z0-9_-]{30,}\b/,
  /\b(?:rk|sk)_(?:live|test)_[A-Za-z0-9]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/,
  /\bAuthorization:\s*Bearer\s+\S+/i,
  /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|cookie|session)\s*[:=]\s*["']?[^\s"']{12,}/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

export function resolveMode(modeName, requestedEffort) {
  const mode = CLAUDE_MODES[modeName];

  if (!mode) {
    throw new Error(`Unknown Claude mode: ${modeName}`);
  }

  const effort = requestedEffort ?? mode.fixedEffort ?? mode.defaultEffort;

  if (mode.fixedEffort && effort !== mode.fixedEffort) {
    throw new Error(`${modeName} requires effort ${mode.fixedEffort}`);
  }

  if (mode.allowedEfforts && !mode.allowedEfforts.includes(effort)) {
    throw new Error(`Unsupported effort ${effort} for ${modeName}`);
  }

  return { ...mode, effort };
}

export function validateEvidencePacket(packet) {
  const text = String(packet ?? '');

  if (Buffer.byteLength(text, 'utf8') > MAX_PACKET_BYTES) {
    throw new Error('Evidence packet exceeds 256 KiB');
  }

  const requiredHeaders = [
    /^TASK_ID=[A-Za-z0-9._/-]+$/m,
    /^RISK=(Groen|Geel|Rood)$/m,
    /^DATA_CLASSIFICATION=(public|internal-sanitized)$/m,
    /^PERSONAL_DATA=none$/m,
    /^SECRETS=none$/m,
    /^RAW_PROMPTS=none$/m,
  ];

  if (requiredHeaders.some((pattern) => !pattern.test(text))) {
    throw new Error('Evidence packet is missing a required safety header');
  }

  if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(text))) {
    throw new Error('Evidence packet appears to contain a secret or personal data');
  }

  return text;
}

export function buildClaudeArgs(mode, effort, worktreeRoot, allowedPaths = []) {
  if (mode.write && !worktreeRoot) {
    throw new Error('Claude build mode requires a worktree root');
  }

  const tools = mode.write ? 'Read,Glob,Edit,Write' : '';
  const root = worktreeRoot ? resolve(worktreeRoot) : '';
  const scopedPaths = allowedPaths.map((path) => {
    const recursive = path.endsWith('/**');
    const relative = recursive ? path.slice(0, -3) : path;
    const absolute = resolve(root, relative);
    return recursive ? `${absolute}/**` : absolute;
  });
  const allowedTools = mode.write
    ? scopedPaths
        .flatMap((path) => [
          `Read(${path})`,
          `Glob(${path})`,
          `Edit(${path})`,
          `Write(${path})`,
        ])
        .join(',')
    : '';
  const disallowedTools = mode.write
    ? [
        'Bash',
        'Grep',
        'Agent',
        'mcp__*',
        `Read(${root}/.env*)`,
        `Read(${root}/**/.env*)`,
      ].join(',')
    : 'Bash,Read,Grep,Glob,Edit,Write,Agent,mcp__*';
  const settings = {
    model: mode.model,
    availableModels: [mode.model],
    enforceAvailableModels: true,
    fallbackModel: [],
    switchModelsOnFlag: false,
    disableAllHooks: true,
    autoMemoryEnabled: false,
  };

  return [
    '-p',
    '--model',
    mode.model,
    '--effort',
    effort,
    '--output-format',
    'json',
    '--max-turns',
    String(mode.maxTurns),
    '--no-session-persistence',
    '--permission-mode',
    'dontAsk',
    '--strict-mcp-config',
    '--disable-slash-commands',
    '--tools',
    tools,
    '--disallowedTools',
    disallowedTools,
    '--settings',
    JSON.stringify(settings),
    ...(allowedTools ? ['--allowedTools', allowedTools] : []),
  ];
}

export function assertExpectedModel(result, expectedModel) {
  const modelUsage = result?.modelUsage ?? result?.model_usage ?? {};
  const usedModels = Object.keys(modelUsage);

  if (usedModels.length === 0 && typeof result?.model === 'string') {
    usedModels.push(result.model);
  }

  if (usedModels.length === 0) {
    throw new Error('Claude result did not report model usage');
  }

  const unexpected = usedModels.filter((model) => model !== expectedModel);

  if (unexpected.length > 0) {
    throw new Error('Claude used an unexpected model; delegation failed closed');
  }

  return usedModels;
}

export function validateWorkingTree(cwd, write, run = spawnSync) {
  const requestedCwd = resolve(cwd);

  if (!existsSync(requestedCwd)) {
    throw new Error('Claude working directory does not exist');
  }

  const gitBinary = resolveGitBinary();
  const git = (args) => {
    const result = run(gitBinary, args, {
      cwd: requestedCwd,
      env: cleanGitEnvironment(),
      encoding: 'utf8',
      maxBuffer: MAX_OUTPUT_BYTES,
    });

    if (result.status !== 0) {
      throw new Error('Claude working directory is not a valid Git worktree');
    }

    return String(result.stdout).trim();
  };

  const root = resolve(git(['rev-parse', '--show-toplevel']));
  const branch = git(['branch', '--show-current']);
  const commonDirValue = git(['rev-parse', '--git-common-dir']);
  const commonDir = isAbsolute(commonDirValue)
    ? commonDirValue
    : resolve(root, commonDirValue);
  const head = git(['rev-parse', 'HEAD']);
  const status = git(['status', '--porcelain']);

  if (root !== requestedCwd) {
    throw new Error('Claude cwd must be the root of its worktree');
  }

  if (write) {
    const worktreeSegment = `${sep}.claude${sep}worktrees${sep}`;

    if (!root.includes(worktreeSegment) || !branch.startsWith('claude/')) {
      throw new Error('Claude build mode requires a disposable claude/** worktree');
    }

    if (status) {
      throw new Error('Claude build worktree must start clean');
    }
  }

  return { root, branch, commonDir, head, status };
}

export function cleanClaudeEnvironment(source = process.env) {
  const environment = {};
  const allowed = [
    'HOME',
    'SHELL',
    'TMPDIR',
    'USER',
    'LOGNAME',
    'LANG',
    'LC_ALL',
    'LC_CTYPE',
    'TERM',
    'COLORTERM',
  ];

  for (const key of allowed) {
    if (source[key] !== undefined) {
      environment[key] = source[key];
    }
  }

  environment.PATH = '/usr/bin:/bin:/usr/sbin:/sbin';
  environment.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = '1';
  environment.NO_COLOR = '1';
  return environment;
}

function cleanGitEnvironment() {
  return {
    ...cleanClaudeEnvironment(),
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_OPTIONAL_LOCKS: '0',
    GIT_PAGER: 'cat',
  };
}

export function readEvidencePacket(promptFile) {
  const packetPath = resolve(promptFile);
  let descriptor;

  try {
    descriptor = openSync(
      packetPath,
      constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
    );
  } catch {
    throw new Error('Evidence packet must be a regular non-symlink file');
  }

  try {
    const stats = fstatSync(descriptor);

    if (!stats.isFile()) {
      throw new Error('Evidence packet must be a regular non-symlink file');
    }

    if ((stats.mode & 0o777) !== 0o600) {
      throw new Error('Evidence packet permissions must be exactly 0600');
    }

    return validateEvidencePacket(readFileSync(descriptor, 'utf8'));
  } finally {
    closeSync(descriptor);
  }
}

export function resolveClaudeBinary(
  candidates = [
    join(homedir(), '.local/bin/claude'),
    join(homedir(), '.npm-global/bin/claude'),
    '/opt/homebrew/bin/claude',
    '/usr/local/bin/claude',
    '/usr/bin/claude',
  ],
) {
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const binary = realpathSync(candidate);
    const stats = statSync(binary);

    if (stats.isFile() && (stats.mode & 0o111) !== 0 && (stats.mode & 0o022) === 0) {
      return binary;
    }
  }

  throw new Error('No trusted Claude executable is installed');
}

export function resolveGitBinary(
  candidates = [
    '/usr/bin/git',
    '/opt/homebrew/bin/git',
    '/usr/local/bin/git',
  ],
) {
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const binary = realpathSync(candidate);
    const stats = statSync(binary);

    if (stats.isFile() && (stats.mode & 0o111) !== 0 && (stats.mode & 0o022) === 0) {
      return binary;
    }
  }

  throw new Error('No trusted Git executable is installed');
}

export function appendCanonicalCommitDiff(packet, worktree, run = spawnSync) {
  const result = run(
    resolveGitBinary(),
    [
      '--no-pager',
      'show',
      '--format=format:COMMIT %H%nDATE %aI%nSUBJECT %s',
      '--no-ext-diff',
      '--no-textconv',
      '--no-renames',
      worktree.head,
    ],
    {
      cwd: worktree.root,
      env: cleanGitEnvironment(),
      encoding: 'utf8',
      maxBuffer: MAX_OUTPUT_BYTES,
    },
  );

  if (result.status !== 0) {
    throw new Error('Unable to generate canonical release diff');
  }

  return validateEvidencePacket(
    `${packet}\n\nCANONICAL_COMMIT_DIFF (generated locally)\n${result.stdout}`,
  );
}

export function validateCommitBinding(packet, worktree, required) {
  if (!required) {
    return;
  }

  const commit = packet.match(/^COMMIT_SHA=([a-f0-9]{40})$/m)?.[1];

  if (!commit || commit !== worktree.head || worktree.status) {
    throw new Error(
      'Release evidence must match the clean current worktree commit',
    );
  }
}

function assertCanonicalBuildPath(root, path) {
  const canonicalRoot = realpathSync(resolve(root));
  const base = path.endsWith('/**') ? path.slice(0, -3) : path;
  let current = canonicalRoot;

  for (const segment of base.split('/')) {
    current = join(current, segment);
    if (!existsSync(current)) {
      break;
    }
    if (lstatSync(current).isSymbolicLink()) {
      throw new Error(`Claude build path may not traverse a symlink: ${path}`);
    }
    const canonicalCurrent = realpathSync(current);
    if (
      canonicalCurrent !== canonicalRoot &&
      !canonicalCurrent.startsWith(`${canonicalRoot}${sep}`)
    ) {
      throw new Error(`Claude build path escapes its worktree: ${path}`);
    }
  }
}

export function parseAllowedBuildPaths(packet, required, worktreeRoot) {
  if (!required) {
    return [];
  }

  const value = packet.match(/^ALLOWED_PATHS=(.+)$/m)?.[1] ?? '';
  const paths = [...new Set(value.split(',').map((path) => path.trim()))].filter(
    Boolean,
  );

  if (paths.length === 0 || paths.length > MAX_ALLOWED_PATHS) {
    throw new Error('Claude build mode requires 1-20 allowed paths');
  }

  for (const path of paths) {
    const base = path.endsWith('/**') ? path.slice(0, -3) : path;
    if (
      path.includes('\\') ||
      path.startsWith('/') ||
      base === '' ||
      base === '.' ||
      base.startsWith('./') ||
      base.split('/').includes('..') ||
      /[*?]/.test(base) ||
      FORBIDDEN_BUILD_PATHS.some((pattern) => pattern.test(base))
    ) {
      throw new Error(`Claude build path is not allowed: ${path}`);
    }

    if (worktreeRoot) {
      assertCanonicalBuildPath(worktreeRoot, path);
    }
  }

  return paths;
}

function pathMatchesAllowed(path, allowedPath) {
  if (allowedPath.endsWith('/**')) {
    const directory = allowedPath.slice(0, -3).replace(/\/$/, '');
    return path === directory || path.startsWith(`${directory}/`);
  }

  return path === allowedPath;
}

export function validateBuildDiff(cwd, allowedPaths, run = spawnSync) {
  const commands = [
    ['diff', '--name-only', 'HEAD', '--'],
    ['ls-files', '--others', '--exclude-standard'],
  ];
  const changedPaths = new Set();

  for (const args of commands) {
    const result = run(resolveGitBinary(), args, {
      cwd,
      env: cleanGitEnvironment(),
      encoding: 'utf8',
      maxBuffer: MAX_OUTPUT_BYTES,
    });

    if (result.status !== 0) {
      throw new Error('Unable to validate Claude build diff');
    }

    for (const path of String(result.stdout).split('\n').filter(Boolean)) {
      changedPaths.add(path);
    }
  }

  const outsideScope = [...changedPaths].filter(
    (path) => !allowedPaths.some((allowed) => pathMatchesAllowed(path, allowed)),
  );

  if (outsideScope.length > 0) {
    throw new Error('Claude build changed a path outside the assigned slice');
  }

  for (const path of changedPaths) {
    assertCanonicalBuildPath(cwd, path);
  }

  return [...changedPaths].sort();
}

function acquireWriterLease(commonDir, modeName) {
  const leasePath = join(commonDir, 'dgskills-agent-writer.lock');
  let descriptor;

  try {
    descriptor = openSync(leasePath, 'wx', 0o600);
    writeFileSync(
      descriptor,
      JSON.stringify({ mode: modeName, pid: process.pid, startedAt: new Date().toISOString() }),
    );
    closeSync(descriptor);
  } catch (error) {
    if (descriptor !== undefined) {
      closeSync(descriptor);
    }
    throw new Error('Another agent already holds the repository writer lease', {
      cause: error,
    });
  }

  return () => unlinkSync(leasePath);
}

export function runClaudeDelegate(options, run = spawnSync) {
  const mode = resolveMode(options.mode, options.effort);
  const packet = readEvidencePacket(options.promptFile);
  const worktree = validateWorkingTree(options.cwd, mode.write, run);
  const allowedPaths = parseAllowedBuildPaths(packet, mode.write, worktree.root);
  validateCommitBinding(packet, worktree, mode.requiresCleanCommit);
  const evidence = mode.requiresCleanCommit
    ? appendCanonicalCommitDiff(packet, worktree, run)
    : packet;
  const releaseLease = mode.write
    ? acquireWriterLease(worktree.commonDir, options.mode)
    : () => {};
  const instruction = mode.write
    ? 'Implement only the bounded task below. Never read secret files, commit, push, merge, deploy, or expand scope.'
    : 'Review the evidence below independently. Do not modify files. Findings first, with severity and file:line evidence.';

  try {
    const result = run(
      resolveClaudeBinary(),
      buildClaudeArgs(mode, mode.effort, worktree.root, allowedPaths),
      {
      cwd: worktree.root,
      env: cleanClaudeEnvironment(),
      input: `${instruction}\n\n${evidence}`,
      encoding: 'utf8',
      maxBuffer: MAX_OUTPUT_BYTES,
      timeout: 45 * 60 * 1000,
      killSignal: 'SIGTERM',
      },
    );

    if (result.status !== 0) {
      throw new Error('Claude delegation failed; stderr is intentionally suppressed');
    }

    if (mode.write) {
      validateBuildDiff(worktree.root, allowedPaths, run);
    }

    let parsed;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      throw new Error('Claude delegation returned invalid JSON');
    }

    const usedModels = assertExpectedModel(parsed, mode.expectedModel);

    return {
      mode: options.mode,
      model: mode.model,
      effort: mode.effort,
      usedModels,
      result: parsed.result ?? parsed.structured_output ?? null,
    };
  } finally {
    releaseLease();
  }
}

function parseCliArgs(argv) {
  const values = { mode: argv[0] };

  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (!['--cwd', '--prompt-file', '--effort'].includes(argument)) {
      throw new Error(`Unknown argument: ${argument}`);
    }

    if (!value) {
      throw new Error(`Missing value for ${argument}`);
    }

    const key = {
      '--cwd': 'cwd',
      '--prompt-file': 'promptFile',
      '--effort': 'effort',
    }[argument];
    values[key] = value;
    index += 1;
  }

  if (!values.mode || !values.cwd || !values.promptFile) {
    throw new Error(
      'Usage: claude-delegate.mjs <mode> --cwd <worktree> --prompt-file <packet> [--effort <level>]',
    );
  }

  return values;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const output = runClaudeDelegate(parseCliArgs(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
