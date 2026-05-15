#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let functionName = '';
let dryRun = false;
let port = '9000';

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--dry-run') {
    dryRun = true;
  } else if (arg === '--port') {
    port = args[i + 1] || '';
    i += 1;
  } else if (arg.startsWith('--port=')) {
    port = arg.slice('--port='.length);
  } else if (arg.startsWith('--')) {
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  } else if (!functionName) {
    functionName = arg;
  } else {
    console.error(`Unexpected extra argument: ${arg}`);
    process.exit(1);
  }
}

if (!functionName) {
  console.error('Usage: node scripts/serve-edge-function.mjs <function-name> [--port 9000] [--dry-run]');
  process.exit(1);
}

if (!/^[A-Za-z0-9_-]+$/.test(functionName)) {
  console.error('Function name may only contain letters, numbers, dashes, and underscores.');
  process.exit(1);
}

if (!/^\d{2,5}$/.test(port)) {
  console.error('Port must be a numeric value.');
  process.exit(1);
}

const cwd = process.cwd();
const functionDir = path.join(cwd, 'supabase', 'functions', functionName);
const entrypoint = path.join(functionDir, 'index.ts');

if (!existsSync(entrypoint)) {
  console.error(`Missing Edge Function entrypoint: ${entrypoint}`);
  process.exit(1);
}

const image = process.env.EDGE_RUNTIME_IMAGE || 'public.ecr.aws/supabase/edge-runtime:v1.73.13';
const envFile = path.join(cwd, '.env.local');
const forwardedEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GDRIVE_CLIENT_ID',
  'GDRIVE_CLIENT_SECRET',
  'GDRIVE_TOKEN_ENCRYPTION_KEY',
];

const dockerArgs = [
  'run',
  '--rm',
  '-p',
  `${port}:9000`,
  '-v',
  `${cwd}:/workspace`,
  '-w',
  '/workspace',
];

if (existsSync(envFile)) {
  dockerArgs.push('--env-file', envFile);
}

for (const key of forwardedEnvVars) {
  if (process.env[key]) {
    dockerArgs.push('--env', key);
  }
}

dockerArgs.push(
  image,
  'start',
  '--main-service',
  `/workspace/supabase/functions/${functionName}`,
);

if (dryRun) {
  console.log(['docker', ...dockerArgs].join(' '));
  process.exit(0);
}

console.log(`Starting ${functionName} on http://127.0.0.1:${port}/${functionName}`);
const child = spawn('docker', dockerArgs, { stdio: 'inherit' });

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
