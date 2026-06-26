import { spawnSync } from 'node:child_process';

const npmCache = process.env.SUPABASE_REMOTE_NPM_CACHE || '/private/tmp/dgskills-npm-cache';

const result = spawnSync('npx', [
  '--yes',
  '--cache',
  npmCache,
  'supabase',
  'migration',
  'list',
  '--linked',
], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DO_NOT_TRACK: '1',
    SUPABASE_TELEMETRY_DISABLED: '1',
    NPM_CONFIG_CACHE: npmCache,
    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
    npm_config_cache: npmCache,
    npm_config_update_notifier: 'false',
  },
  encoding: 'utf8',
  timeout: Number(process.env.SUPABASE_REMOTE_MIGRATION_TIMEOUT_MS ?? 60_000),
});

if (result.error) {
  throw result.error;
}

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;

if (result.status !== 0) {
  process.stderr.write(output);
  process.exit(result.status ?? 1);
}

const rows = parseMigrationRows(output);

if (rows.length === 0) {
  console.error('Could not parse Supabase migration list output. Refusing to mark remote history safe.');
  process.exit(1);
}

const mismatches = rows.filter((row) => !row.local || !row.remote || row.local !== row.remote);

if (mismatches.length > 0) {
  const localOnly = mismatches
    .filter((row) => row.local && !row.remote)
    .map((row) => row.local);
  const remoteOnly = mismatches
    .filter((row) => row.remote && !row.local)
    .map((row) => row.remote);
  const divergent = mismatches
    .filter((row) => row.local && row.remote && row.local !== row.remote)
    .map((row) => `${row.local} != ${row.remote}`);

  console.error('Supabase remote migration history is not aligned with local migrations.');
  console.error('Do not run supabase db push until this history is reconciled.');
  printList('Local-only migrations', localOnly);
  printList('Remote-only migrations', remoteOnly);
  printList('Divergent rows', divergent);
  process.exit(1);
}

console.log(`Supabase remote migration history matches local migrations (${rows.length} migrations).`);

function parseMigrationRows(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('|'))
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 3)
    .filter(([local, remote]) => local !== 'Local' && remote !== 'Remote')
    .filter(([local, remote]) => isMigrationVersion(local) || isMigrationVersion(remote))
    .map(([local, remote, time]) => ({
      local: isMigrationVersion(local) ? local : '',
      remote: isMigrationVersion(remote) ? remote : '',
      time,
    }));
}

function isMigrationVersion(value) {
  return /^\d{8,14}$/.test(value);
}

function printList(label, values) {
  if (values.length === 0) {
    return;
  }

  console.error(`${label}:`);
  for (const value of values) {
    console.error(`- ${value}`);
  }
}
