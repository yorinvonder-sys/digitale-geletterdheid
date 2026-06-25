import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const keepTemp = process.env.RLS_THROWAWAY_KEEP === '1';
const startTimeoutMs = Number(process.env.RLS_THROWAWAY_START_TIMEOUT_MS ?? 240_000);
const migrateTimeoutMs = Number(process.env.RLS_THROWAWAY_MIGRATE_TIMEOUT_MS ?? 180_000);
const testTimeoutMs = Number(process.env.RLS_THROWAWAY_TEST_TIMEOUT_MS ?? 60_000);

const tempRoot = mkdtempSync('/private/tmp/dgskills-rls-');
const npmCache = join(tempRoot, '.npm-cache');
const projectId = `dgskills-rls-${process.pid}-${Date.now().toString(36)}`.toLowerCase();
const basePort = 55_000 + Math.floor(Math.random() * 500);
const dbContainer = `supabase_db_${projectId}`;
const dockerHost = process.env.DOCKER_HOST || detectDockerHost();

let initialized = false;

try {
  assertDockerReachable();

  run('npx', ['supabase', 'init', '--workdir', tempRoot], { timeout: 30_000 });
  initialized = true;

  cpSync(
    join(root, 'supabase', 'migrations'),
    join(tempRoot, 'supabase', 'migrations'),
    { recursive: true, force: true },
  );
  patchSupabaseConfig(join(tempRoot, 'supabase', 'config.toml'));

  run('npx', ['supabase', 'db', 'start', '--workdir', tempRoot], { timeout: startTimeoutMs });
  run('npx', ['supabase', 'migration', 'up', '--local', '--include-all', '--workdir', tempRoot], {
    timeout: migrateTimeoutMs,
  });
  run('node', ['scripts/check-rls-functions.mjs'], {
    env: { ...process.env, RLS_DB_CONTAINER: dbContainer },
    timeout: testTimeoutMs,
  });

  console.log('Throwaway RLS check passed.');
} finally {
  if (initialized) {
    const stop = spawnSync('npx', ['supabase', 'stop', '--workdir', tempRoot], {
      cwd: root,
      env: commandEnv(),
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 60_000,
    });
    if (stop.status !== 0) {
      process.stderr.write(stop.stderr || stop.stdout || `Failed to stop throwaway Supabase project ${projectId}\n`);
    }
  }

  if (!keepTemp) {
    rmSync(tempRoot, { recursive: true, force: true });
  } else {
    console.log(`Kept throwaway Supabase project at ${tempRoot}`);
  }
}

function assertDockerReachable() {
  const result = spawnSync('docker', ['ps'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 10_000,
  });

  if (result.status !== 0) {
    throw new Error(
      [
        'Docker is not reachable. Start Docker/Colima first, then rerun npm run check:rls:throwaway.',
        result.stderr.trim(),
      ].filter(Boolean).join('\n'),
    );
  }
}

function detectDockerHost() {
  const result = spawnSync('docker', ['context', 'inspect'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 10_000,
  });

  if (result.status !== 0) {
    return '';
  }

  try {
    const contexts = JSON.parse(result.stdout);
    return contexts?.[0]?.Endpoints?.docker?.Host ?? '';
  } catch {
    return '';
  }
}

function patchSupabaseConfig(configPath) {
  if (!existsSync(configPath)) {
    throw new Error(`Supabase config not found at ${configPath}`);
  }

  let config = readFileSync(configPath, 'utf8');
  config = config
    .replace(/^project_id = ".*"$/m, `project_id = "${projectId}"`)
    .replaceAll('port = 54321', `port = ${basePort}`)
    .replaceAll('port = 54322', `port = ${basePort + 1}`)
    .replaceAll('shadow_port = 54320', `shadow_port = ${basePort + 2}`)
    .replaceAll('port = 54329', `port = ${basePort + 3}`)
    .replaceAll('port = 54323', `port = ${basePort + 4}`)
    .replaceAll('port = 54324', `port = ${basePort + 5}`)
    .replaceAll('smtp_port = 54325', `smtp_port = ${basePort + 6}`)
    .replaceAll('pop3_port = 54326', `pop3_port = ${basePort + 7}`)
    .replace('sql_paths = ["./seed.sql"]', 'sql_paths = []');

  writeFileSync(configPath, config);
}

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: root,
    env: commandEnv(options.env),
    stdio: 'inherit',
    timeout: options.timeout,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
}

function commandEnv(overrides = {}) {
  return {
    ...process.env,
    HOME: tempRoot,
    DO_NOT_TRACK: '1',
    SUPABASE_TELEMETRY_DISABLED: '1',
    npm_config_cache: npmCache,
    npm_config_update_notifier: 'false',
    ...(dockerHost ? { DOCKER_HOST: dockerHost } : {}),
    ...overrides,
  };
}
