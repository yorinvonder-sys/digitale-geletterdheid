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
    'dated custom containers should use their 1-based dashboard position'
);

assert.equal(
    getProjectWeekForDate(new Date('2027-01-15T12:00:00+01:00'), datedContainers),
    2,
    'undated gaps should fall back to rough school blocks'
);

const weeklyLessonContainers = Array.from({ length: 40 }, (_, index) => ({
    sortOrder: index,
    startDate: index === 17 ? '2027-01-15' : undefined,
    endDate: index === 17 ? '2027-01-21' : undefined,
}));

assert.equal(
    getProjectWeekForDate(new Date('2027-01-16T12:00:00+01:00'), weeklyLessonContainers),
    18,
    'weekly lesson containers should map dated rows to their 1-based dashboard position'
);

assert.equal(
    getProjectWeekForDate(new Date('2026-06-15T12:00:00+02:00'), datedContainers.slice(0, 2)),
    2,
    'fallback project week should clamp to the available custom container count'
);

console.log('Projectweek schedule checks passed');
