#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';

const ROUTE_RULES = {
  root: ['/assets/vendor-three-', '/assets/vendor-xlsx-', '/assets/jspdf', '/assets/vendor-html2canvas-'],
  scholen: ['/assets/vendor-three-', '/assets/vendor-xlsx-', '/assets/jspdf', '/assets/vendor-html2canvas-'],
  login: ['/assets/vendor-three-', '/assets/vendor-xlsx-', '/assets/jspdf', '/assets/vendor-html2canvas-'],
};

function getRequests(route) {
  const reportPath = join(process.cwd(), 'lighthouse-reports', `${route}.json`);
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  return report?.audits?.['network-requests']?.details?.items || [];
}

let failed = false;

for (const [route, blockedPatterns] of Object.entries(ROUTE_RULES)) {
  const requests = getRequests(route);
  const offenders = requests.filter((request) => {
    const url = request?.url || '';
    return blockedPatterns.some((pattern) => url.includes(pattern));
  });

  if (offenders.length > 0) {
    failed = true;
    console.error(`\n[Network Assert] ${route} loaded blocked assets:`);
    for (const offender of offenders) {
      const transfer = Math.round((offender.transferSize || 0) / 1024);
      console.error(` - ${transfer}KB ${offender.url}`);
    }
  } else {
    console.log(`[Network Assert] ${route}: OK`);
  }
}

if (failed) {
  console.error('\n[Network Assert] Critical route network assertions failed.');
  process.exit(1);
}

console.log('\n[Network Assert] All critical route network assertions passed.');
