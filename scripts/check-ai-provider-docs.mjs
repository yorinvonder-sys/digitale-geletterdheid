import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const roots = [
  'CLAUDE.md',
  'README.md',
  'business',
  'docs',
  'public',
  'src',
  'supabase/functions',
  'scripts',
];

const ignoredDirs = new Set([
  '.git',
  '.claude',
  '.playwright-mcp',
  'dist',
  'node_modules',
  'tmp',
]);

const allowedGoogleContexts = [
  /Google Workspace/i,
  /Google Drive/i,
  /gdrive-backup/i,
  /Google Analytics|GA4/i,
  /Search Console/i,
  /Google Meet/i,
  /Google Calendar/i,
  /lesvoorbeeld|lesson example|voorbeeldopdracht/i,
  /\.gemini\/antigravity/i,
];

const blockedTerms = [
  ['Google', 'Gemini'].join(' '),
  ['Google', 'Vertex'].join(' '),
  ['Vertex', 'AI'].join(' '),
  ['Nano', 'Banana'].join(' '),
  ['VITE', 'GEMINI', 'API', 'KEY'].join('_'),
  ['generativelanguage', 'googleapis', 'com'].join('.'),
  ['europe', 'west4'].join('-'),
  'Eemshaven',
];

const scannedExtensions = new Set([
  '.html', '.md', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json',
]);

const failures = [];

function shouldScan(filePath) {
  if (filePath === 'scripts/check-ai-provider-docs.mjs') return false;
  // Marketing-asset generators (favicon, hero-video, mascotte) mogen Google's
  // beeld-/videomodellen gebruiken — dat is géén product- of compliance-claim
  // over leerlingdata, dus buiten scope van deze check.
  if (/^scripts\/generate-(favicon|hero|pip)[\w-]*\.mjs$/.test(filePath)) return false;
  const ext = path.extname(filePath);
  return scannedExtensions.has(ext) || path.basename(filePath) === 'CLAUDE.md' || path.basename(filePath) === 'README.md';
}

function walk(entry) {
  const stat = statSync(entry);
  if (stat.isDirectory()) {
    if (ignoredDirs.has(path.basename(entry))) return;
    for (const child of readdirSync(entry)) walk(path.join(entry, child));
    return;
  }
  if (!shouldScan(entry)) return;

  const source = readFileSync(entry, 'utf8');
  const lines = source.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const isAllowedGoogleContext = allowedGoogleContexts.some((pattern) => pattern.test(line));
    for (const term of blockedTerms) {
      if (line.includes(term) && !isAllowedGoogleContext) {
        failures.push(`${entry}:${index + 1}: stale AI provider claim contains "${term}"`);
      }
    }
  }
}

for (const root of roots) {
  try {
    walk(root);
  } catch (error) {
    failures.push(`${root}: scan failed (${error.message})`);
  }
}

if (failures.length) {
  console.error(`AI provider docs check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('AI provider docs check passed');
