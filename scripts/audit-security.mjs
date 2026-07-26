import { spawnSync } from 'node:child_process';
import { validateAuditReport } from './audit-security-core.mjs';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCommand, ['audit', '--package-lock-only', '--json'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

if (result.error) {
  console.error(`Security-audit kon niet worden gestart: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error('Security-audit gaf geen geldige JSON terug.');
  if (result.stderr) console.error(result.stderr.trim());
  process.exit(1);
}

try {
  const validation = validateAuditReport(report);
  if (validation.allowedAdvisories === 0) {
    console.log('Security-audit geslaagd: geen kwetsbaarheden gevonden.');
  } else {
    console.warn(
      `Security-audit geslaagd met 1 tijdelijke ExcelJS-uitzondering; vervalt op ${validation.expiresOn}.`,
    );
  }
} catch (error) {
  console.error(`Security-audit geblokkeerd: ${error.message}`);
  process.exit(1);
}
