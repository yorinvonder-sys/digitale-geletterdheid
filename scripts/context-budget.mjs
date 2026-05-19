import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { extname, join } from 'node:path';

const isCheckMode = process.argv.includes('--check');

const run = (cmd, args, options = {}) => execFileSync(cmd, args, {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  ...options,
}).trim();

const safeRun = (cmd, args, fallback = '') => {
  try {
    return run(cmd, args);
  } catch {
    return fallback;
  }
};

const splitLines = (text) => String(text)
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const bytesToHuman = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};

const dirSize = (path) => {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  if (!stat.isDirectory()) return stat.size;
  let total = 0;
  for (const entry of readdirSync(path)) {
    total += dirSize(join(path, entry));
  }
  return total;
};

const trackedFiles = splitLines(safeRun('git', ['ls-files'], ''));
const dirtyCount = splitLines(safeRun('git', ['status', '--short'], '')).length;
const trackedCount = trackedFiles.length;

const trackedBytes = trackedFiles.reduce((total, file) => {
  try {
    return total + statSync(file).size;
  } catch {
    return total;
  }
}, 0);

const hotspots = [
  '.claude/worktrees',
  '.playwright-mcp',
  'dist',
  'node_modules',
  'public',
  'components',
  'supabase',
].map((path) => ({ path, size: dirSize(path) }))
  .filter((entry) => entry.size > 0)
  .sort((a, b) => b.size - a.size);

const criticalArtifactPrefixes = [
  '.agent/skills/',
  '.claude/worktrees/',
  '.playwright-mcp/',
  '.tmp-context/',
  'dist/',
  'dist-ssr/',
  'lighthouse-reports/',
  'node_modules/',
  'playwright-report/',
  'screenshots/',
  'test-results/',
];

const binaryExtensions = new Set([
  '.gif',
  '.jpg',
  '.jpeg',
  '.mov',
  '.mp4',
  '.pdf',
  '.png',
  '.webp',
  '.zip',
]);

const textExtensions = new Set([
  '.json',
  '.md',
  '.toml',
  '.txt',
  '.yaml',
  '.yml',
]);

const trackedCriticalArtifacts = trackedFiles
  .filter((file) => criticalArtifactPrefixes.some((prefix) => file.startsWith(prefix)));

const trackedIgnoredFiles = getTrackedIgnoredFiles(trackedFiles);
const largestTrackedArtifacts = trackedFiles
  .map((file) => {
    try {
      return { file, size: statSync(file).size };
    } catch {
      return { file, size: 0 };
    }
  })
  .filter((entry) => isLikelyArtifact(entry.file))
  .sort((a, b) => b.size - a.size)
  .slice(0, 10);

const contextFootprint = [
  fileFootprint('AGENTS.md'),
  fileFootprint('CLAUDE.md'),
  directoryFootprint('.claude', { immediateMarkdownOnly: true }),
  directoryFootprint('.agent', { excludedPrefixes: ['.agent/skills'] }),
  directoryFootprint('.agents'),
].filter(Boolean);

const warnings = [
  trackedCriticalArtifacts.length > 0
    ? `${trackedCriticalArtifacts.length} tracked generated/artifact files under ignored context paths`
    : null,
  trackedFiles.some((file) => file.startsWith('.playwright-mcp/'))
    ? 'Browser screenshots are still tracked under .playwright-mcp/'
    : null,
  existsSync('.agent/skills') && existsSync('.agents/skills')
    ? 'Both .agent/skills and .agents/skills exist; keep .agents/skills canonical'
    : null,
].filter(Boolean);

console.log('Context budget snapshot');
console.log(`- Dirty worktree entries: ${dirtyCount}`);
console.log(`- Tracked files: ${trackedCount}`);
console.log(`- Tracked bytes present locally: ${bytesToHuman(trackedBytes)}`);
console.log('- Largest local paths:');
for (const entry of hotspots.slice(0, 8)) {
  console.log(`  ${bytesToHuman(entry.size).padStart(8)}  ${entry.path}`);
}

console.log('');
console.log('AI context risk');
console.log(`- Tracked ignored files: ${trackedIgnoredFiles.length}`);
for (const entry of trackedIgnoredFiles.slice(0, 8)) {
  console.log(`  ${entry.path} (${entry.rule})`);
}
if (trackedIgnoredFiles.length > 8) {
  console.log(`  ... ${trackedIgnoredFiles.length - 8} more`);
}

console.log('- Largest tracked artifacts/assets:');
for (const entry of largestTrackedArtifacts) {
  console.log(`  ${bytesToHuman(entry.size).padStart(8)}  ${entry.file}`);
}

console.log('- Instruction/context footprint:');
for (const entry of contextFootprint) {
  console.log(`  ${String(entry.lines).padStart(5)} lines  ${bytesToHuman(entry.bytes).padStart(8)}  ${entry.path}`);
}

console.log('- Warnings:');
if (warnings.length === 0) {
  console.log('  none');
} else {
  for (const warning of warnings) {
    console.log(`  ${warning}`);
  }
}

console.log('');
console.log('Agent guidance: use path-scoped git diff/status and rg with explicit globs; avoid broad reads of the large paths above.');

if (isCheckMode && trackedCriticalArtifacts.length > 0) {
  console.error('');
  console.error('context:check failed: generated/artifact files are still tracked in AI-noisy paths.');
  process.exit(1);
}

function getTrackedIgnoredFiles(files) {
  if (files.length === 0) {
    return [];
  }

  const result = spawnSync(
    'git',
    ['check-ignore', '--no-index', '-v', '--stdin'],
    {
      input: `${files.join('\n')}\n`,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 8,
    },
  );

  if (![0, 1].includes(result.status)) {
    return [];
  }

  return splitLines(result.stdout).map((line) => {
    const tabIndex = line.lastIndexOf('\t');
    if (tabIndex === -1) {
      return { path: line, rule: 'ignored' };
    }

    return {
      path: line.slice(tabIndex + 1),
      rule: line.slice(0, tabIndex),
    };
  }).filter((entry) => !String(entry.rule).split(':').pop()?.startsWith('!'));
}

function isLikelyArtifact(file) {
  return binaryExtensions.has(extname(file).toLowerCase())
    || criticalArtifactPrefixes.some((prefix) => file.startsWith(prefix));
}

function fileFootprint(path) {
  if (!existsSync(path)) {
    return null;
  }

  const text = readFileSync(path, 'utf8');
  return {
    path,
    bytes: statSync(path).size,
    lines: text.split('\n').length,
  };
}

function directoryFootprint(path, options = {}) {
  if (!existsSync(path)) {
    return null;
  }

  const files = listFiles(path, options);
  let bytes = 0;
  let lines = 0;

  for (const file of files) {
    try {
      const stat = statSync(file);
      bytes += stat.size;

      if (textExtensions.has(extname(file).toLowerCase())) {
        lines += readFileSync(file, 'utf8').split('\n').length;
      }
    } catch {
      // Ignore files that disappear during local cleanup.
    }
  }

  return { path, bytes, lines };
}

function listFiles(path, options = {}) {
  const files = [];

  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);

    if (options.immediateMarkdownOnly) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(child);
      }
      continue;
    }

    if (child.startsWith('.claude/worktrees')) {
      continue;
    }

    if (options.excludedPrefixes?.some((prefix) => child === prefix || child.startsWith(`${prefix}/`))) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...listFiles(child));
    } else {
      files.push(child);
    }
  }

  return files;
}
