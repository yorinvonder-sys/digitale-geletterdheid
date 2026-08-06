import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  assertOpenCodeVersion,
  cleanOpenCodeEnvironment,
  OPENCODE_PROJECT_ROOT,
  resolveOpenCodeBinary,
} from './opencode-safe.mjs';

const tempDirectory = mkdtempSync(join(tmpdir(), 'dgskills-dlp-integration-'));
let requestCount = 0;
const server = http.createServer((request, response) => {
  requestCount += 1;
  request.resume();
  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(
    JSON.stringify({
      id: 'dgskills-loopback-canary',
      object: 'chat.completion',
      created: 0,
      model: 'deepseek-v4-flash',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: 'canary-ok' },
          finish_reason: 'stop',
        },
      ],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    }),
  );
});

function packet(body) {
  return [
    'TASK_ID=DGS-INTEGRATION',
    'RISK=Groen',
    'DATA_CLASSIFICATION=internal-sanitized',
    'PERSONAL_DATA=none',
    'SECRETS=none',
    'RAW_PROMPTS=none',
    '',
    body,
  ].join('\n');
}

async function runCanary(binary, environment, message) {
  const requestsBefore = requestCount;
  const child = spawn(
    binary,
    [
      'run',
      '--model',
      'deepseek/deepseek-v4-flash',
      '--format',
      'json',
      message,
    ],
    {
      cwd: OPENCODE_PROJECT_ROOT,
      env: environment,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  child.stdout.resume();
  child.stderr.resume();
  const timer = setTimeout(() => child.kill('SIGTERM'), 20000);
  const [status, signal] = await once(child, 'close');
  clearTimeout(timer);

  return { requests: requestCount - requestsBefore, signal, status };
}

try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  const binary = resolveOpenCodeBinary();
  const environment = cleanOpenCodeEnvironment(
    process.env,
    join(tempDirectory, 'config'),
  );
  environment.XDG_DATA_HOME = join(tempDirectory, 'data');
  environment.OPENCODE_DISABLE_AUTOUPDATE = '1';
  environment.OPENCODE_CONFIG_CONTENT = JSON.stringify({
    mcp: {
      linear: { enabled: false },
      supabase: { enabled: false },
      vercel: { enabled: false },
    },
    provider: {
      deepseek: {
        options: {
          apiKey: 'synthetic-loopback-canary',
          baseURL: `http://127.0.0.1:${port}/v1`,
        },
      },
    },
  });
  assertOpenCodeVersion(binary, environment);

  const blocked = await runCanary(binary, environment, packet('leerling'));
  assert.notEqual(blocked.status, 0);
  assert.equal(blocked.signal, null);
  assert.equal(blocked.requests, 0);

  const allowed = await runCanary(
    binary,
    environment,
    packet('analyze-synthetic-route'),
  );
  assert.equal(allowed.status, 0);
  assert.equal(allowed.signal, null);
  assert.ok(allowed.requests > 0);

  console.log('OpenCode DLP integration test passed');
} finally {
  server.closeAllConnections?.();
  await new Promise((resolveClose) => server.close(resolveClose));
  rmSync(tempDirectory, { recursive: true, force: true });
}
