import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { escapeCsvCell, csvRow, buildCsv } = await import('../src/utils/csvExport.ts');

const dangerousStrings = [
  '=HYPERLINK("https://example.invalid","klik")',
  '+SUM(1,2)',
  '-cmd|/C calc!A0',
  '@SUM(1,2)',
  '\t=SUM(1,2)',
  '\n=SUM(1,2)',
  '\r=SUM(1,2)',
  '   =SUM(1,2)',
];

for (const value of dangerousStrings) {
  const escaped = escapeCsvCell(value);
  const unquoted = escaped.startsWith('"') ? escaped.slice(1, -1).replace(/""/g, '"') : escaped;
  assert.ok(
    unquoted.startsWith("'"),
    `dangerous CSV value should be prefixed with a single quote: ${JSON.stringify(value)} -> ${escaped}`,
  );
}

assert.equal(escapeCsvCell('Gewone leerling'), 'Gewone leerling');
assert.equal(escapeCsvCell(42), '42');
assert.equal(escapeCsvCell(-42), '-42');
assert.equal(escapeCsvCell('tekst, met komma'), '"tekst, met komma"');
assert.equal(escapeCsvCell('tekst; met puntkomma', ';'), '"tekst; met puntkomma"');
assert.equal(escapeCsvCell('tekst "quote"'), '"tekst ""quote"""');
assert.equal(escapeCsvCell('regel\n2'), '"\'regel\n2"');

assert.equal(csvRow(['Naam', 'Klas'], ';'), 'Naam;Klas');
assert.equal(csvRow(['=gevaar', 'A1'], ';'), "'=gevaar;A1");
assert.equal(buildCsv([['Naam', 'Klas'], ['=gevaar', 'A1']], { delimiter: ';' }), "Naam;Klas\n'=gevaar;A1");

const browserExportSources = [
  'src/features/teacher/StudentSloReport.tsx',
  'src/features/teacher/TeacherDashboard.tsx',
  'src/features/teacher/AiBeleidFeedbackPanel.tsx',
  'src/services/accountantExportService.ts',
];

for (const path of browserExportSources) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  assert.match(source, /downloadCsv/, `${path} should use the shared CSV downloader`);
  assert.doesNotMatch(source, /function\s+(csvEscape|escapeCsvField)|const\s+csvEscape\b/, `${path} should not keep local CSV escaping`);
}

const accountantBackup = await readFile(new URL('../src/services/accountantBackupService.ts', import.meta.url), 'utf8');
assert.match(accountantBackup, /buildCsv/, 'accountant backup CSV should use the shared CSV builder');
assert.doesNotMatch(accountantBackup, /function\s+escapeCSV/, 'accountant backup service should not keep local CSV escaping');

const gdriveBackup = await readFile(new URL('../supabase/functions/gdrive-backup/index.ts', import.meta.url), 'utf8');
assert.match(gdriveBackup, /\[=\+\\-@\]/, 'gdrive backup CSV helper should neutralize formula-leading values');

console.log('check-csv-export-safety passed');
