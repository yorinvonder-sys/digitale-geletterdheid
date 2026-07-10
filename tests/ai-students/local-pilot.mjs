#!/usr/bin/env node
import { spawn } from 'node:child_process';

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4173';
const url = new URL(origin);
if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
  throw new Error('De lokale pilotwrapper accepteert uitsluitend localhost of 127.0.0.1.');
}

const env = {
  ...process.env,
  AI_STUDENT_ENVIRONMENT: process.env.AI_STUDENT_ENVIRONMENT || 'test',
  QA_ORIGIN: origin,
  AI_STUDENT_ALLOWED_ORIGINS: process.env.AI_STUDENT_ALLOWED_ORIGINS || origin,
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'local-preview-anon-key-not-a-secret',
};
const cliArgs = process.argv.slice(2);

function waitForExit(child) {
  if (child.exitCode != null) return Promise.resolve({ code: child.exitCode, signal: child.signalCode });
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });
}

async function waitForServer(server, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (server.exitCode != null) throw new Error(`Vite stopte voortijdig met exitcode ${server.exitCode}.`);
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Vite start nog.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Vite werd niet binnen ${timeoutMs} ms bereikbaar op ${origin}.`);
}

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', url.hostname, '--port', url.port || '4173'], {
  cwd: process.cwd(),
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (chunk) => { serverLog += chunk; });
server.stderr.on('data', (chunk) => { serverLog += chunk; });

try {
  await waitForServer(server);
  const runner = spawn(process.execPath, ['tests/ai-students/cli.mjs', ...cliArgs], {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
  });
  const outcome = await waitForExit(runner);
  if (outcome.code !== 0) process.exitCode = outcome.code || 1;
} catch (error) {
  process.stderr.write(`${error.message}\n${serverLog}\n`);
  process.exitCode = 1;
} finally {
  if (server.exitCode == null) server.kill('SIGTERM');
  await Promise.race([
    waitForExit(server),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]).catch(() => undefined);
}
