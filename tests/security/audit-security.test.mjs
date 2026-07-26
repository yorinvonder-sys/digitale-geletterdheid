import assert from 'node:assert/strict';
import test from 'node:test';

let validateAuditReport;
try {
  ({ validateAuditReport } = await import('../../scripts/audit-security-core.mjs'));
} catch {
  validateAuditReport = undefined;
}

const allowedAdvisory = {
  source: 1124334,
  name: 'brace-expansion',
  dependency: 'brace-expansion',
  title: 'brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash',
  url: 'https://github.com/advisories/GHSA-mh99-v99m-4gvg',
  severity: 'high',
  range: '<=5.0.7',
};

const knownExcelJsReport = {
  vulnerabilities: {
    'brace-expansion': {
      name: 'brace-expansion',
      severity: 'high',
      isDirect: false,
      via: [allowedAdvisory],
      effects: ['minimatch'],
      nodes: [
        'node_modules/archiver-utils/node_modules/brace-expansion',
        'node_modules/fstream/node_modules/brace-expansion',
        'node_modules/readdir-glob/node_modules/brace-expansion',
        'node_modules/zip-stream/node_modules/brace-expansion',
      ],
    },
    minimatch: {
      name: 'minimatch',
      severity: 'high',
      isDirect: false,
      via: ['brace-expansion'],
      effects: ['glob', 'readdir-glob'],
      nodes: [
        'node_modules/archiver-utils/node_modules/minimatch',
        'node_modules/fstream/node_modules/minimatch',
        'node_modules/readdir-glob/node_modules/minimatch',
        'node_modules/zip-stream/node_modules/minimatch',
      ],
    },
    glob: {
      name: 'glob',
      severity: 'high',
      isDirect: false,
      via: ['minimatch'],
      effects: ['archiver-utils', 'rimraf'],
      nodes: [
        'node_modules/archiver-utils/node_modules/glob',
        'node_modules/fstream/node_modules/glob',
        'node_modules/zip-stream/node_modules/glob',
      ],
    },
    'readdir-glob': {
      name: 'readdir-glob',
      severity: 'high',
      isDirect: false,
      via: ['minimatch'],
      effects: ['archiver'],
      nodes: ['node_modules/readdir-glob'],
    },
    'archiver-utils': {
      name: 'archiver-utils',
      severity: 'high',
      isDirect: false,
      via: ['glob'],
      effects: ['archiver', 'zip-stream'],
      nodes: [
        'node_modules/archiver-utils',
        'node_modules/zip-stream/node_modules/archiver-utils',
      ],
    },
    'zip-stream': {
      name: 'zip-stream',
      severity: 'high',
      isDirect: false,
      via: ['archiver-utils'],
      effects: [],
      nodes: ['node_modules/zip-stream'],
    },
    rimraf: {
      name: 'rimraf',
      severity: 'high',
      isDirect: false,
      via: ['glob'],
      effects: [],
      nodes: ['node_modules/fstream/node_modules/rimraf'],
    },
    archiver: {
      name: 'archiver',
      severity: 'high',
      isDirect: false,
      via: ['archiver-utils', 'readdir-glob', 'zip-stream'],
      effects: ['exceljs'],
      nodes: ['node_modules/archiver'],
    },
    exceljs: {
      name: 'exceljs',
      severity: 'high',
      isDirect: true,
      via: ['archiver', 'unzipper'],
      effects: [],
      nodes: ['node_modules/exceljs'],
    },
    fstream: {
      name: 'fstream',
      severity: 'high',
      isDirect: false,
      via: ['rimraf'],
      effects: ['unzipper'],
      nodes: ['node_modules/fstream'],
    },
    unzipper: {
      name: 'unzipper',
      severity: 'high',
      isDirect: false,
      via: ['fstream'],
      effects: ['exceljs'],
      nodes: ['node_modules/unzipper'],
    },
  },
};

test('accepteert uitsluitend de bekende brace-expansion advisory in de ExcelJS-boom', () => {
  assert.equal(typeof validateAuditReport, 'function');
  assert.doesNotThrow(() =>
    validateAuditReport(knownExcelJsReport, new Date('2026-07-26T00:00:00Z')),
  );
});

test('blokkeert een nieuwe advisory, ook binnen een reeds toegestane package', () => {
  assert.equal(typeof validateAuditReport, 'function');
  const report = structuredClone(knownExcelJsReport);
  report.vulnerabilities.glob.via.push({
    source: 9999999,
    name: 'glob',
    dependency: 'glob',
    title: 'Nieuwe glob-kwetsbaarheid',
    url: 'https://github.com/advisories/GHSA-new-advisory',
    severity: 'high',
    range: '*',
  });

  assert.throws(
    () => validateAuditReport(report, new Date('2026-07-26T00:00:00Z')),
    /niet toegestaan.*GHSA-new-advisory/i,
  );
});

test('blokkeert de bekende advisory buiten de vastgelegde ExcelJS-nodes', () => {
  assert.equal(typeof validateAuditReport, 'function');
  const report = structuredClone(knownExcelJsReport);
  report.vulnerabilities['brace-expansion'].nodes.push(
    'node_modules/unrelated/node_modules/brace-expansion',
  );

  assert.throws(
    () => validateAuditReport(report, new Date('2026-07-26T00:00:00Z')),
    /onverwachte dependency-node.*unrelated/i,
  );
});

test('blokkeert de uitzondering na de vervaldatum', () => {
  assert.equal(typeof validateAuditReport, 'function');
  assert.throws(
    () => validateAuditReport(knownExcelJsReport, new Date('2026-11-01T00:00:00Z')),
    /vervallen op 2026-10-31/i,
  );
});
