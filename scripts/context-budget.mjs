import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const run = (cmd, args) => execFileSync(cmd, args, {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

const safeRun = (cmd, args, fallback = '') => {
  try {
    return run(cmd, args);
  } catch {
    return fallback;
  }
};

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

const dirtyCount = Number(safeRun('git', ['status', '--short'], '')
  .split('\n')
  .filter(Boolean).length);
const trackedCount = Number(safeRun('git', ['ls-files'], '')
  .split('\n')
  .filter(Boolean).length);

const trackedBytes = Number(safeRun('git', ['ls-files', '-z'], '')
  .split('\0')
  .filter(Boolean)
  .reduce((total, file) => {
    try {
      return total + statSync(file).size;
    } catch {
      return total;
    }
  }, 0));

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

console.log('Context budget snapshot');
console.log(`- Dirty worktree entries: ${dirtyCount}`);
console.log(`- Tracked files: ${trackedCount}`);
console.log(`- Tracked bytes present locally: ${bytesToHuman(trackedBytes)}`);
console.log('- Largest local paths:');
for (const entry of hotspots.slice(0, 8)) {
  console.log(`  ${bytesToHuman(entry.size).padStart(8)}  ${entry.path}`);
}
console.log('');
console.log('Agent guidance: use path-scoped git diff/status and rg with explicit globs; avoid broad reads of the large paths above.');
