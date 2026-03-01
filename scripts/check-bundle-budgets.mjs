#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const budgetsPath = join(process.cwd(), 'config', 'performance-budgets.json');
const budgets = JSON.parse(readFileSync(budgetsPath, 'utf8'));

function patternToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function kb(bytes) {
  return bytes / 1024;
}

function readReport(route) {
  const reportPath = join(process.cwd(), 'lighthouse-reports', `${route}.json`);
  return JSON.parse(readFileSync(reportPath, 'utf8'));
}

let failed = false;
const assetsDir = join(process.cwd(), 'dist', 'assets');
const assetFiles = readdirSync(assetsDir);

console.log('[Bundle Budgets] Asset budgets');
for (const budget of budgets.assets || []) {
  const matcher = patternToRegExp(budget.pattern);
  const matches = assetFiles.filter((file) => matcher.test(file));
  if (matches.length === 0) {
    failed = true;
    console.error(` - FAIL: no assets matched "${budget.pattern}"`);
    continue;
  }

  for (const file of matches) {
    const sizeKb = kb(statSync(join(assetsDir, file)).size);
    const ok = sizeKb <= budget.maxKb;
    if (!ok) failed = true;
    console.log(` - ${ok ? 'OK  ' : 'FAIL'} ${file} ${sizeKb.toFixed(1)}KB <= ${budget.maxKb}KB`);
  }
}

console.log('\n[Bundle Budgets] Network transfer budgets from Lighthouse');
for (const budget of budgets.network || []) {
  const report = readReport(budget.route);
  const requests = report?.audits?.['network-requests']?.details?.items || [];
  const jsKb = kb(
    requests
      .filter((r) => r.resourceType === 'Script')
      .reduce((sum, r) => sum + (r.transferSize || 0), 0)
  );
  const cssKb = kb(
    requests
      .filter((r) => r.resourceType === 'Stylesheet')
      .reduce((sum, r) => sum + (r.transferSize || 0), 0)
  );

  const jsOk = jsKb <= budget.maxJsKb;
  const cssOk = cssKb <= budget.maxCssKb;
  if (!jsOk || !cssOk) failed = true;

  console.log(
    ` - ${budget.route}: `
    + `JS ${jsKb.toFixed(1)}KB/${budget.maxJsKb}KB ${jsOk ? 'OK' : 'FAIL'}, `
    + `CSS ${cssKb.toFixed(1)}KB/${budget.maxCssKb}KB ${cssOk ? 'OK' : 'FAIL'}`
  );
}

if (failed) {
  console.error('\n[Bundle Budgets] Budget check failed.');
  process.exit(1);
}

console.log('\n[Bundle Budgets] All budgets passed.');
