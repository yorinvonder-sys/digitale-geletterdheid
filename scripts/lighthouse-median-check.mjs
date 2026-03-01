#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROUTES = ['root', 'login', 'scholen'];
const RUNS = Number(process.env.LIGHTHOUSE_RUNS || '3');
const PORT_BASE = Number(process.env.LH_PORT_BASE || '4173');
const SCORE_MIN = Number(process.env.LH_SCORE_MIN || '95');
const LCP_MAX_MS = {
  root: Number(process.env.LH_ROOT_LCP_MAX || '2600'),
  login: Number(process.env.LH_LOGIN_LCP_MAX || '3000'),
  scholen: Number(process.env.LH_SCHOLEN_LCP_MAX || '2600'),
};

function median(values) {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function readMetrics(route) {
  const reportPath = join(process.cwd(), 'lighthouse-reports', `${route}.json`);
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  return {
    score: Math.round((report?.categories?.performance?.score ?? 0) * 100),
    lcpMs: Math.round(report?.audits?.['largest-contentful-paint']?.numericValue ?? 0),
  };
}

const samples = Object.fromEntries(
  ROUTES.map((route) => [route, { scores: [], lcps: [] }])
);

for (let run = 1; run <= RUNS; run += 1) {
  const runPort = PORT_BASE + (run - 1);
  console.log(`\n[Lighthouse] Run ${run}/${RUNS}`);
  execSync('bash ./scripts/lighthouse-audit.sh', {
    stdio: 'inherit',
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(runPort),
    },
  });

  for (const route of ROUTES) {
    const { score, lcpMs } = readMetrics(route);
    samples[route].scores.push(score);
    samples[route].lcps.push(lcpMs);
  }
}

let failed = false;
console.log('\nRoute     Median score   Median LCP (ms)   Thresholds');
console.log('--------- ------------- ----------------- ------------------------------');
for (const route of ROUTES) {
  const medianScore = Math.round(median(samples[route].scores));
  const medianLcp = Math.round(median(samples[route].lcps));
  const scoreOk = medianScore >= SCORE_MIN;
  const lcpOk = medianLcp <= LCP_MAX_MS[route];
  if (!scoreOk || !lcpOk) failed = true;

  console.log(
    `${route.padEnd(9)} ${String(medianScore).padStart(13)} ${String(medianLcp).padStart(17)}   `
    + `score>=${SCORE_MIN}, lcp<=${LCP_MAX_MS[route]} ${scoreOk && lcpOk ? 'OK' : 'FAIL'}`
  );
}

if (failed) {
  console.error('\n[Lighthouse] Regression check failed.');
  process.exit(1);
}

console.log('\n[Lighthouse] Regression check passed.');
