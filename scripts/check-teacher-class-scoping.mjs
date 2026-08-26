#!/usr/bin/env node
/**
 * Contractcheck voor de docent-klas-koppeling.
 *
 * Draait de RLS-helpers uit 20260826200000_teacher_class_scoping.sql tegen een
 * wegwerp-Postgres in Docker, met de ECHTE definities van is_teacher(),
 * is_teacher_in_school(), get_caller_app_role() en get_caller_school_id() uit de
 * bestaande migraties — geen handgeschreven namaak.
 *
 * Getoetst worden de faalcondities die ertoe doen:
 *   - default-modus laat het huidige (schoolbrede) gedrag ONGEWIJZIGD;
 *   - klasgebonden modus sluit een klas die de docent NIET lesgeeft;
 *   - een docent zonder toewijzing raakt zijn werk niet kwijt in de uitrolstand;
 *   - de strikte stand sluit wél volledig;
 *   - een docent kan zichzelf geen klassen toekennen of de modus versoepelen.
 *
 * Gebruik:  node scripts/check-teacher-class-scoping.mjs
 * Vereist:  Docker. Zonder Docker eindigt de check met exitcode 2 (overgeslagen).
 */
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = join(ROOT, 'tests', 'rls', 'teacher-class-scoping');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const MIGRATION = '20260826200000_teacher_class_scoping.sql';
const CONTAINER = 'dgskills-teacher-class-scoping-check';
const IMAGE = 'postgres:16-alpine';

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: 'utf8', ...opts });
}

function fail(message) {
  console.error(`FAIL  ${message}`);
  process.exitCode = 1;
}

/** Haalt een functiedefinitie letterlijk uit een bestaande migratie. */
function extractFunction(file, name) {
  const sql = readFileSync(join(MIGRATIONS, file), 'utf8');
  const re = new RegExp(`CREATE OR REPLACE FUNCTION public\\.${name}\\(.*?\\n\\$\\$;`, 's');
  const match = sql.match(re);
  if (!match) throw new Error(`Kon public.${name}() niet vinden in ${file}.`);
  return match[0];
}

// --- Statische controle: deze migratie mag geen bestaande policy aanraken. ---
function assertNoExistingPolicyTouched() {
  const sql = readFileSync(join(MIGRATIONS, MIGRATION), 'utf8');
  const NEW_TABLES = new Set(['public.teacher_classes', 'public.school_access_settings']);
  const touched = new Set();
  for (const m of sql.matchAll(/(?:CREATE|DROP)\s+POLICY\s+(?:IF\s+EXISTS\s+)?"[^"]+"\s+ON\s+([a-zA-Z_.]+)/gi)) {
    touched.add(m[1]);
  }
  const foreign = [...touched].filter((t) => !NEW_TABLES.has(t));
  if (foreign.length > 0) {
    fail(`migratie raakt policies op bestaande tabellen aan: ${foreign.join(', ')}`);
  } else {
    console.log('PASS  migratie raakt uitsluitend policies op de twee nieuwe tabellen');
  }

  if (/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_teacher_in_school/i.test(sql)) {
    fail('migratie herdefinieert de bestaande schoolbrede helper is_teacher_in_school()');
  } else {
    console.log('PASS  migratie herdefinieert de bestaande schoolbrede helper niet');
  }

  if (/teacher_scope\s+text\s+NOT\s+NULL\s+DEFAULT\s+'school'/i.test(sql)) {
    console.log("PASS  standaardmodus is 'school' — bestaande scholen houden hun huidige toegang");
  } else {
    fail("standaardmodus is niet 'school'; dat zou bestaande scholen van gedrag laten veranderen");
  }
}

function dockerAvailable() {
  return run('docker', ['info']).status === 0;
}

function cleanup() {
  run('docker', ['rm', '-f', CONTAINER]);
}

function main() {
  assertNoExistingPolicyTouched();

  if (!dockerAvailable()) {
    console.log('SKIP  Docker niet beschikbaar — de databasetoetsen zijn overgeslagen.');
    if (process.exitCode) process.exit(process.exitCode);
    process.exit(2);
  }

  cleanup();
  const started = run('docker', [
    'run', '-d', '--name', CONTAINER,
    '-e', 'POSTGRES_PASSWORD=throwaway',
    '-e', 'POSTGRES_DB=tctest',
    IMAGE,
  ]);
  if (started.status !== 0) {
    console.error(started.stderr.trim());
    fail('kon de wegwerp-database niet starten');
    process.exit(1);
  }

  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (run('docker', ['exec', CONTAINER, 'pg_isready', '-U', 'postgres', '-d', 'tctest']).status === 0) {
        ready = true;
        break;
      }
      spawnSync('sleep', ['1']);
    }
    if (!ready) {
      fail('de wegwerp-database kwam niet omhoog');
      return;
    }

    // De echte auth-helpers, in de volgorde waarin productie ze toepast:
    // eerst de kernversie, daarna de MFA-vrijstelling die is_teacher() herschrijft.
    const helperFile = mkdtempSync(join(tmpdir(), 'tcscope-'));
    const helpers = [
      extractFunction('20260509165658_security_report_core_auth_rls.sql', 'is_mfa_aal2'),
      extractFunction('20260509165658_security_report_core_auth_rls.sql', 'get_caller_app_role'),
      extractFunction('20260509165658_security_report_core_auth_rls.sql', 'get_caller_school_id'),
      extractFunction('20260509165658_security_report_core_auth_rls.sql', 'is_teacher_in_school'),
      extractFunction('20260413100000_exempt_dev_admin_from_mfa.sql', 'is_teacher'),
    ].join('\n\n');
    const helperPath = join(helperFile, '01-helpers.sql');
    writeFileSync(helperPath, `${helpers}\n`, 'utf8');

    const steps = [
      join(FIXTURES, '00-auth-stubs.sql'),
      helperPath,
      join(MIGRATIONS, MIGRATION),
      join(FIXTURES, '02-fixtures.sql'),
      join(FIXTURES, '03-scope-matrix.sql'),
      join(FIXTURES, '04-rls-guards.sql'),
    ];

    for (const step of steps) {
      const name = step.split('/').pop();
      const copied = run('docker', ['cp', step, `${CONTAINER}:/tmp/${name}`]);
      if (copied.status !== 0) {
        fail(`kon ${name} niet kopiëren: ${copied.stderr.trim()}`);
        return;
      }
      const psql = run('docker', [
        'exec', CONTAINER, 'psql', '-U', 'postgres', '-d', 'tctest',
        '-v', 'ON_ERROR_STOP=1', '-q', '-f', `/tmp/${name}`,
      ]);
      const output = `${psql.stdout}`.split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('PASS') || line.startsWith('FAIL') || line.startsWith('---'));
      output.forEach((line) => console.log(line));
      if (psql.status !== 0) {
        console.error(psql.stderr.trim());
        fail(`${name} eindigde met een fout`);
        return;
      }
    }

    if (!process.exitCode) console.log('\nOK — docent-klas-koppeling voldoet aan het contract.');
  } finally {
    cleanup();
  }
}

const availableFixtures = readdirSync(FIXTURES);
if (availableFixtures.length === 0) {
  fail('geen testbestanden gevonden onder tests/rls/teacher-class-scoping/');
  process.exit(1);
}
main();
