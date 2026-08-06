import { spawnSync } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  statSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const OPENCODE_VERSION = '1.18.11';
export const OPENCODE_PROJECT_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../..',
);

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
    join(OPENCODE_PROJECT_ROOT, 'node_modules/.bin/opencode'),
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

export async function assertRequiredDlpPlugin(
  projectRoot = OPENCODE_PROJECT_ROOT,
) {
  const root = realpathSync(resolve(projectRoot));
  const pluginPath = join(root, '.opencode/plugins/delegation-dlp.js');

  if (!existsSync(pluginPath) || lstatSync(pluginPath).isSymbolicLink()) {
    throw new Error('Required OpenCode DLP plugin is missing or unsafe');
  }

  const module = await import(
    `${pathToFileURL(pluginPath).href}?preflight=${process.pid}-${Date.now()}`
  );
  if (typeof module.DelegationDlp !== 'function') {
    throw new Error('Required OpenCode DLP plugin export is missing');
  }

  const hooks = await module.DelegationDlp();
  if (typeof hooks?.['chat.message'] !== 'function') {
    throw new Error('Required OpenCode DLP hook did not initialize');
  }

  const unsafePacket = [
    'TASK_ID=DGS-PREFLIGHT',
    'RISK=Groen',
    'DATA_CLASSIFICATION=internal-sanitized',
    'PERSONAL_DATA=none',
    'SECRETS=none',
    'RAW_PROMPTS=none',
    '',
    'leerling',
  ].join('\n');

  try {
    await hooks['chat.message'](
      {
        agent: 'deepseek-scout',
        model: {
          providerID: 'deepseek',
          modelID: 'deepseek-v4-flash',
        },
      },
      {
        message: {
          agent: 'deepseek-scout',
          model: {
            providerID: 'deepseek',
            modelID: 'deepseek-v4-flash',
          },
        },
        parts: [{ type: 'text', text: unsafePacket }],
      },
    );
  } catch (error) {
    if (/appears sensitive/.test(String(error?.message))) {
      return pluginPath;
    }
    throw new Error('Required OpenCode DLP hook failed its preflight');
  }

  throw new Error('Required OpenCode DLP hook accepted its unsafe preflight');
}

export function assertOpenCodePluginBootstrap(
  binary,
  environment,
  projectRoot = OPENCODE_PROJECT_ROOT,
  run = spawnSync,
) {
  const root = realpathSync(resolve(projectRoot));
  const pluginPath = join(root, '.opencode/plugins/delegation-dlp.js');
  const result = run(
    binary,
    ['--print-logs', '--log-level', 'DEBUG', 'debug', 'info'],
    {
      cwd: root,
      env: {
        ...environment,
        XDG_DATA_HOME: join(environment.XDG_CONFIG_HOME, 'preflight-data'),
      },
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
      timeout: 120000,
    },
  );
  const output = `${String(result.stdout ?? '')}\n${String(result.stderr ?? '')}`;

  if (
    result.status !== 0 ||
    !output.includes(pluginPath) ||
    /failed to load plugin|plugin config hook failed|Plugin export is not a function/i.test(
      output,
    )
  ) {
    throw new Error('Required OpenCode DLP plugin failed host bootstrap');
  }
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
    await assertRequiredDlpPlugin(OPENCODE_PROJECT_ROOT);
    assertOpenCodePluginBootstrap(
      binary,
      environment,
      OPENCODE_PROJECT_ROOT,
    );
    const result = spawnSync(binary, args, {
      cwd: OPENCODE_PROJECT_ROOT,
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
