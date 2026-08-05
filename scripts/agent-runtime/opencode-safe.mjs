import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  statSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const OPENCODE_VERSION = '1.18.11';

export function validateOpenCodeArgs(args) {
  if (args.length > 0) {
    throw new Error(
      'OpenCode launcher arguments are not allowed; use the project orchestrator',
    );
  }
}

export function cleanOpenCodeEnvironment(source = process.env, configHome) {
  if (!configHome) {
    throw new Error('OpenCode requires an isolated configuration home');
  }

  const home = homedir();
  const environment = {
    HOME: home,
    PATH: '/usr/bin:/bin:/usr/sbin:/sbin',
    TMPDIR: tmpdir(),
    XDG_CONFIG_HOME: configHome,
    XDG_DATA_HOME: join(home, '.local/share'),
  };

  for (const key of [
    'SHELL',
    'USER',
    'LOGNAME',
    'LANG',
    'LC_ALL',
    'LC_CTYPE',
    'TERM',
    'COLORTERM',
  ]) {
    if (source[key] !== undefined) {
      environment[key] = source[key];
    }
  }

  return environment;
}

export function resolveOpenCodeBinary(
  candidates = [
    join(homedir(), '.npm-global/bin/opencode'),
    join(homedir(), '.local/bin/opencode'),
    '/opt/homebrew/bin/opencode',
    '/usr/local/bin/opencode',
    '/usr/bin/opencode',
  ],
) {
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const binary = realpathSync(candidate);
    const stats = statSync(binary);
    if (stats.isFile() && (stats.mode & 0o111) !== 0 && (stats.mode & 0o022) === 0) {
      return binary;
    }
  }

  throw new Error('No trusted OpenCode executable is installed');
}

export function assertOpenCodeVersion(binary, environment, run = spawnSync) {
  const result = run(binary, ['--version'], {
    env: environment,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    timeout: 10000,
  });

  if (result.status !== 0 || String(result.stdout).trim() !== OPENCODE_VERSION) {
    throw new Error(`OpenCode ${OPENCODE_VERSION} is required`);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  let configHome;

  try {
    const args = process.argv.slice(2);
    validateOpenCodeArgs(args);
    configHome = mkdtempSync(join(tmpdir(), 'dgskills-opencode-config-'));
    const binary = resolveOpenCodeBinary();
    const environment = cleanOpenCodeEnvironment(process.env, configHome);
    assertOpenCodeVersion(binary, environment);
    const result = spawnSync(binary, args, {
      cwd: process.cwd(),
      env: environment,
      stdio: 'inherit',
    });
    process.exitCode = result.status ?? 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  } finally {
    if (configHome) {
      rmSync(configHome, { recursive: true, force: true });
    }
  }
}
