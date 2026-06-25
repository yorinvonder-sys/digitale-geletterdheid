import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const failures = [];

const read = (path) => readFileSync(join(root, path), 'utf8');
const fail = (message) => failures.push(message);
const check = (condition, message) => {
  if (!condition) fail(message);
};

function compareSemver(a, b) {
  const left = a.split('.').map((part) => Number.parseInt(part, 10));
  const right = b.split('.').map((part) => Number.parseInt(part, 10));
  for (let i = 0; i < 3; i += 1) {
    const l = Number.isFinite(left[i]) ? left[i] : 0;
    const r = Number.isFinite(right[i]) ? right[i] : 0;
    if (l > r) return 1;
    if (l < r) return -1;
  }
  return 0;
}

function walk(dir) {
  const absolute = join(root, dir);
  const entries = readdirSync(absolute);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(absolute, entry);
    const relPath = relative(root, fullPath);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...walk(relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

function trackedFiles(dir) {
  return execFileSync('git', ['ls-files', dir], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function extractLabels(source) {
  return [...source.matchAll(/label:\s*['"]([^'"]+)['"]/g)]
    .map((match) => match[1])
    .sort();
}

function extractNumberConst(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*([0-9_]+)`));
  return match ? Number(match[1].replaceAll('_', '')) : null;
}

const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const dompurifySpec = pkg.dependencies?.dompurify;
const dompurifyResolved = lock.packages?.['node_modules/dompurify']?.version;

check(Boolean(dompurifySpec), 'package.json must declare dompurify.');
check(Boolean(dompurifyResolved), 'package-lock.json must resolve node_modules/dompurify.');
check(
  dompurifyResolved && compareSemver(dompurifyResolved, '3.4.10') > 0,
  `DOMPurify must resolve above vulnerable range <=3.4.10; found ${dompurifyResolved || 'missing'}.`,
);

const vercel = JSON.parse(read('vercel.json'));
const globalHeaders = vercel.headers
  ?.find((entry) => entry.source === '/(.*)')
  ?.headers
  ?.reduce((acc, header) => {
    acc[header.key.toLowerCase()] = header.value;
    return acc;
  }, {}) ?? {};

const csp = globalHeaders['content-security-policy'] || '';
check(globalHeaders['strict-transport-security']?.includes('max-age=63072000'), 'HSTS must use a two-year max-age.');
check(globalHeaders['strict-transport-security']?.includes('includeSubDomains'), 'HSTS must include subdomains.');
check(globalHeaders['strict-transport-security']?.includes('preload'), 'HSTS must include preload.');
check(globalHeaders['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options must be nosniff.');
check(globalHeaders['x-frame-options'] === 'DENY', 'X-Frame-Options must be DENY.');
check(csp.includes("default-src 'self'"), 'CSP must set default-src self.');
check(csp.includes("script-src 'self'"), 'CSP must keep script-src self.');
check(csp.includes("frame-ancestors 'none'"), 'CSP must deny framing.');
check(csp.includes("object-src 'none'"), 'CSP must block plugins/objects.');
check(!csp.includes("'unsafe-eval'"), 'CSP must not allow unsafe-eval.');
check(csp.includes('report-uri https://dgskills.report-uri.com/r/d/csp/enforce'), 'CSP must report enforced violations.');
check(Boolean(globalHeaders['content-security-policy-report-only']), 'CSP report-only mirror must be present.');
check(Boolean(globalHeaders['report-to']), 'Report-To header must be present.');

const edgeFunctionFiles = trackedFiles('supabase/functions')
  .filter((file) => file.endsWith('/index.ts'))
  .filter((file) => read(file).includes('Deno.serve') || read(file).includes('serve(async'));

const publicEndpointRules = {
  'approveParentalConsent': [
    'rejectDisallowedBrowserRequest',
    'checkDurableRateLimit',
    'token_hash',
    'token.length < 32',
  ],
  'demo-chat': [
    'rejectDisallowedBrowserRequest',
    'checkDurableRateLimit',
    'sanitizePrompt',
    'DEMO_SYSTEM_INSTRUCTION',
  ],
  'gdrive-callback': [
    'google_drive_oauth_states',
    'state_hash',
    'consumed_at',
    'currentRole !== "developer" && currentRole !== "admin"',
  ],
  'submitPilotRequest': [
    'rejectDisallowedBrowserRequest',
    'consumeRateLimit',
    'exceedsPersistentRateLimit',
    'website',
  ],
};

for (const file of edgeFunctionFiles) {
  const source = read(file);
  const functionName = file.split('/').at(-2);
  if (functionName !== 'gdrive-callback') {
    check(source.includes('buildCorsHeaders'), `${file} must use shared CORS headers.`);
    check(source.includes('rejectDisallowedBrowserRequest'), `${file} must reject disallowed browser origins.`);
  }

  const hasAuth = source.includes('Authorization');
  if (!hasAuth) {
    const requiredTokens = publicEndpointRules[functionName];
    check(Boolean(requiredTokens), `${file} has no Authorization check and is not an approved public exception.`);
    for (const token of requiredTokens ?? []) {
      check(source.includes(token), `${file} public exception must retain protection marker: ${token}`);
    }
  }
}

const edgeCorsSources = edgeFunctionFiles.map((file) => read(file)).join('\n');
check(!/Access-Control-Allow-Origin['"]?\s*[:,]\s*['"]\*/.test(edgeCorsSources), 'Edge functions must not hardcode CORS wildcard.');

const clientSanitizer = read('src/utils/promptSanitizer.ts');
const serverSanitizer = read('supabase/functions/_shared/promptSanitizer.ts');
assert.deepEqual(
  extractLabels(clientSanitizer),
  extractLabels(serverSanitizer),
  'Client and server prompt sanitizer labels must stay in sync.',
);
check(
  extractNumberConst(clientSanitizer, 'MAX_PROMPT_LENGTH') === extractNumberConst(serverSanitizer, 'MAX_PROMPT_LENGTH'),
  'Client and server prompt max length must match.',
);
check(
  extractNumberConst(clientSanitizer, 'MAX_NEWLINES') === extractNumberConst(serverSanitizer, 'MAX_NEWLINES'),
  'Client and server prompt newline limit must match.',
);

const liveStudentModal = read('src/features/teacher/LiveStudentModal.tsx');
check(!liveStudentModal.includes(".select('*')"), 'LiveStudentModal must not fetch student activity with select(*).');

const selectStarMatches = trackedFiles('src')
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  .flatMap((file) => [...read(file).matchAll(/\.select\(['"]\*['"]\)/g)].map((match) => `${file}:${match.index}`));

if (failures.length) {
  console.error(`website security posture check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('website security posture check passed');
console.log(`- DOMPurify resolved: ${dompurifyResolved}`);
console.log(`- Edge functions checked: ${edgeFunctionFiles.length}`);
console.log(`- Public edge exceptions checked: ${Object.keys(publicEndpointRules).join(', ')}`);
console.log(`- Remaining select(*) occurrences in src (tracked as follow-up): ${selectStarMatches.length}`);
