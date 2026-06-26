import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const npmCache = process.env.SUPABASE_REMOTE_NPM_CACHE || '/private/tmp/dgskills-npm-cache';
const localOnlyAllowlist = new Map([
  [
    '20260220000000',
    'local schema baseline for fresh developer databases; not a normal production migration',
  ],
]);
const shortVersionPairAllowlist = new Map([
  ['20260221', 'add_data_retention_policies'],
]);

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
  const localOnlyMismatches = mismatches
    .filter((row) => row.local && !row.remote)
    .map((row) => row.local);
  const remoteOnlyMismatches = mismatches
    .filter((row) => row.remote && !row.local)
    .map((row) => row.remote);
  const divergent = mismatches
    .filter((row) => row.local && row.remote && row.local !== row.remote)
    .map((row) => `${row.local} != ${row.remote}`);
  const allowedLocalOnly = [];
  const localOnly = [];

  for (const version of localOnlyMismatches) {
    const reason = localOnlyAllowlist.get(version);
    if (reason) {
      allowedLocalOnly.push(`${version} (${reason})`);
    } else {
      localOnly.push(version);
    }
  }

  const remoteOnly = [...remoteOnlyMismatches];
  const normalizedPairs = [];

  for (const [version, expectedName] of shortVersionPairAllowlist.entries()) {
    const localIndex = localOnly.indexOf(version);
    const remoteIndex = remoteOnly.indexOf(version);

    if (localIndex === -1 || remoteIndex === -1) {
      continue;
    }

    const localName = getLocalMigrationName(version);
    if (localName !== expectedName) {
      continue;
    }

    localOnly.splice(localIndex, 1);
    remoteOnly.splice(remoteIndex, 1);
    normalizedPairs.push(`${version}_${expectedName}`);
  }

  if (localOnly.length === 0 && remoteOnly.length === 0 && divergent.length === 0) {
    console.log(`Supabase remote migration history matches local migrations (${rows.length} migrations).`);
    printList('Allowed local-only migrations', allowedLocalOnly, console.log);
    printList('Normalized short-version local/remote pairs', normalizedPairs, console.log);
    process.exit(0);
  }

  console.error('Supabase remote migration history is not aligned with local migrations.');
  console.error('Do not run supabase db push until this history is reconciled.');
  printList('Allowed local-only migrations', allowedLocalOnly);
  printList('Normalized short-version local/remote pairs', normalizedPairs);
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

function getLocalMigrationName(version) {
  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
  const prefix = `${version}_`;
  const file = readdirSync(migrationsDir).find((entry) => entry.startsWith(prefix) && entry.endsWith('.sql'));

  if (!file) {
    return '';
  }

  return file.slice(prefix.length, -'.sql'.length);
}

function printList(label, values, write = console.error) {
  if (values.length === 0) {
    return;
  }

  write(`${label}:`);
  for (const value of values) {
    write(`- ${value}`);
  }
}
