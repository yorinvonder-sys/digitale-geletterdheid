import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const date = process.env.QA_ARTIFACT_DATE || new Date().toISOString().slice(0, 10);
const root = process.env.QA_APP_ROUTE_ROOT || `/private/tmp/dgskills-full-review-${date}/app-route-smoke`;
const credentials = process.env.QA_CREDENTIALS || '/private/tmp/dgskills-full-review-2026-05-23/qa-accounts-credentials.json';
const email = process.env.QA_EMAIL || 'dgskills.qa.j2@example.test';
const schoolId = process.env.QA_SCHOOL_ID || 'dgskills-qa-full-review-2026-05-23';
const period = process.env.QA_PERIOD || 'j2p1';
const label = process.env.QA_LABEL || period.replace(/^j(\d+)p(\d+)$/, 'j$1-local');
const persona = process.env.QA_PERSONA || 'diligent';
const allowRemoteReset = process.env.QA_ALLOW_REMOTE_RESET === '1';
const allowOnboardingCompletion = process.env.QA_ALLOW_ONBOARDING_COMPLETION === '1';
const viewports = (process.env.QA_VIEWPORTS || 'desktop,ipad-portrait,ipad-landscape,mobile')
  .split(',')
  .map((viewport) => viewport.trim())
  .filter(Boolean);
const missions = process.argv.slice(2);

if (!missions.length) {
  console.error('Usage: node scripts/run-app-route-mission.mjs <mission...>');
  process.exit(2);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_cache: process.env.npm_config_cache || '/private/tmp/dgskills-npm-cache',
        SUPABASE_TELEMETRY_DISABLED: '1',
      },
      ...options,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`));
    });
    child.on('error', reject);
  });
}

function resetSql(mission) {
  const quotedMission = mission.replaceAll("'", "''");
  const quotedEmail = email.replaceAll("'", "''");
  const quotedSchoolId = schoolId.replaceAll("'", "''");

  return [
    'begin;',
    "select set_config('app.bypass_stats_protection','true', true);",
    `delete from public.mission_progress where mission_id = '${quotedMission}' and user_id in (select id from public.users where email = '${quotedEmail}' and school_id = '${quotedSchoolId}');`,
    'update public.users',
    "set stats = jsonb_set(stats::jsonb, '{missionsCompleted}',",
    `  coalesce((select jsonb_agg(value) from jsonb_array_elements(stats::jsonb->'missionsCompleted') as value where value <> to_jsonb('${quotedMission}'::text)), '[]'::jsonb),`,
    '  true)',
    `where email = '${quotedEmail}' and school_id = '${quotedSchoolId}';`,
    'commit;',
  ].join(' ');
}

const failures = [];

for (const mission of missions) {
  for (const viewport of viewports) {
    const outDir = path.join(root, `${mission}-${label}-${viewport}-fixproof`);
    await fs.mkdir(outDir, { recursive: true });

    if (allowRemoteReset) {
      console.log(`\n=== ${mission} / ${viewport}: reset disposable QA completion ===`);
      await run('npx', ['supabase', 'db', 'query', '--linked', '--output', 'json', resetSql(mission)]);
    } else {
      console.log(`\n=== ${mission} / ${viewport}: remote reset skipped (set QA_ALLOW_REMOTE_RESET=1 only with explicit approval) ===`);
    }

    console.log(`\n=== ${mission} / ${viewport}: app-route playthrough ===`);
    try {
      const simulatorArgs = [
        'scripts/chrome-student-simulator.mjs',
        `--period=${period}`,
        `--mission=${mission}`,
        `--viewport=${viewport}`,
        '--play',
        '--app-route',
        `--persona=${persona}`,
        `--auth-email=${email}`,
        `--auth-credentials=${credentials}`,
        `--screenshot-dir=${outDir}`,
        `--report-json=${path.join(outDir, 'report.json')}`,
        `--report-md=${path.join(outDir, 'report.md')}`,
      ];
      if (allowOnboardingCompletion) simulatorArgs.push('--allow-onboarding-completion');
      await run('node', simulatorArgs);
    } catch (error) {
      failures.push({ mission, viewport, error: error.message });
      console.error(`\n=== ${mission} / ${viewport}: FAILED, continuing ===`);
      console.error(error.message);
    }
  }
}

if (failures.length) {
  console.error('\nFailures:');
  for (const failure of failures) {
    console.error(`- ${failure.mission} / ${failure.viewport}: ${failure.error}`);
  }
  process.exit(1);
}
