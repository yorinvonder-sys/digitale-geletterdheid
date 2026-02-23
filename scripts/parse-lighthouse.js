#!/usr/bin/env node
/**
 * Parse Lighthouse JSON reports and output metrics table.
 * Run: npm run lighthouse:parse
 * Requires: lighthouse-reports/root.json, login.json, scholen.json
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '..', 'lighthouse-reports');

const ROUTES = [
  { file: 'root.json', route: '/' },
  { file: 'login.json', route: '/login' },
  { file: 'scholen.json', route: '/scholen' },
];

function getAudit(report, id) {
  const a = report?.audits?.[id];
  return a?.numericValue ?? a?.displayValue ?? '—';
}

function formatMs(val) {
  if (val === '—' || val == null) return '—';
  const n = Number(val);
  return isNaN(n) ? val : Math.round(n) + ' ms';
}

function formatScore(val) {
  if (val === '—' || val == null) return '—';
  const n = Number(val);
  return isNaN(n) ? val : (n * 100).toFixed(0);
}

function formatCls(val) {
  if (val === '—' || val == null) return '—';
  const n = Number(val);
  return isNaN(n) ? val : n.toFixed(3);
}

const rows = [];
for (const { file, route } of ROUTES) {
  const path = join(REPORTS_DIR, file);
  if (!existsSync(path)) {
    rows.push({ route, perf: '—', lcp: '—', inp: '—', cls: '—', fcp: '—', si: '—' });
    continue;
  }
  const raw = readFileSync(path, 'utf8');
  let report;
  try {
    report = JSON.parse(raw);
  } catch (e) {
    rows.push({ route, perf: 'parse error', lcp: '—', inp: '—', cls: '—', fcp: '—', si: '—' });
    continue;
  }
  const perf = report?.categories?.performance?.score;
  const lcp = getAudit(report, 'largest-contentful-paint');
  const inpCandidate = getAudit(report, 'interaction-to-next-paint');
  // Lighthouse lab runs often don't have INP; fall back to TBT.
  const inp = inpCandidate === '—' ? getAudit(report, 'total-blocking-time') : inpCandidate;
  const cls = getAudit(report, 'cumulative-layout-shift');
  const fcp = getAudit(report, 'first-contentful-paint');
  const si = getAudit(report, 'speed-index');
  rows.push({
    route,
    perf: formatScore(perf),
    lcp: formatMs(lcp),
    inp: formatMs(inp),
    cls: formatCls(cls),
    fcp: formatMs(fcp),
    si: formatMs(si),
  });
}

console.log('\n| Route    | Perf | LCP     | INP/TBT | CLS   | FCP     | SI      |');
console.log('|----------|------|--------|---------|-------|---------|---------|');
for (const r of rows) {
  console.log(`| ${r.route.padEnd(8)} | ${String(r.perf).padStart(4)} | ${String(r.lcp).padStart(6)} | ${String(r.inp).padStart(7)} | ${String(r.cls).padStart(5)} | ${String(r.fcp).padStart(7)} | ${String(r.si).padStart(7)} |`);
}
console.log('');
