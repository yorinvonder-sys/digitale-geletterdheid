import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const helperPath = resolve('src/utils/projectWeekSchedule.ts');
assert.equal(existsSync(helperPath), true, 'projectWeekSchedule helper should exist');

const source = readFileSync(helperPath, 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
    },
});

const moduleExports = {};
const module = { exports: moduleExports };
const fn = new Function('exports', 'module', 'require', compiled.outputText);
fn(moduleExports, module, require);

const {
    getFallbackProjectWeekForDate,
    getProjectWeekForDate,
} = module.exports;

assert.equal(typeof getFallbackProjectWeekForDate, 'function');
assert.equal(typeof getProjectWeekForDate, 'function');

const cases = [
    ['2026-10-15T12:00:00+02:00', 1],
    ['2026-12-15T12:00:00+01:00', 2],
    ['2026-04-15T12:00:00+02:00', 3],
    ['2026-06-15T12:00:00+02:00', 4],
    ['2026-02-15T12:00:00+01:00', 2],
    ['2026-08-15T12:00:00+02:00', 4],
];

for (const [isoDate, expectedWeek] of cases) {
    assert.equal(
        getFallbackProjectWeekForDate(new Date(isoDate)),
        expectedWeek,
        `${isoDate} should map to projectweek ${expectedWeek}`
    );
}

const datedContainers = [
    { sortOrder: 0, startDate: '2026-09-01', endDate: '2026-11-30' },
    { sortOrder: 1, startDate: '2026-12-01', endDate: '2026-12-31' },
    { sortOrder: 2, startDate: '2027-04-01', endDate: '2027-05-31' },
    { sortOrder: 3, startDate: '2027-06-01', endDate: '2027-08-31' },
];

assert.equal(
    getProjectWeekForDate(new Date('2026-12-15T12:00:00+01:00'), datedContainers),
    2,
    'dated custom containers should use sortOrder + 1'
);

assert.equal(
    getProjectWeekForDate(new Date('2027-01-15T12:00:00+01:00'), datedContainers),
    2,
    'undated gaps should fall back to rough school blocks'
);

console.log('Projectweek schedule checks passed');
