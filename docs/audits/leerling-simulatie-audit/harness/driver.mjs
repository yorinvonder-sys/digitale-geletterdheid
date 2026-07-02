#!/usr/bin/env node
// driver.mjs — browser audit harness for DGSkills learner-simulation audits.
//
// Two modes:
//   node driver.mjs serve --slot <1..6> --port <910N>   (daemon: owns one browser context)
//   node driver.mjs act   --port <910N> --json '<...>'  (one-shot client: POST an action)
//
// Scratch-only tool. Does not touch the repo or worktree.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const HARNESS_DIR = path.dirname(new URL(import.meta.url).pathname);
const PLAYWRIGHT_PKG = '/Users/yorinvonder/Downloads/ai-lab---future-architect/package.json';

function loadPlaywright() {
  const require = createRequire(PLAYWRIGHT_PKG);
  return require('playwright');
}

// ---------------------------------------------------------------------------
// small utils
// ---------------------------------------------------------------------------

function nowIso() {
  return new Date().toISOString();
}

function jsonOk(extra = {}) {
  return { ok: true, ...extra };
}

function jsonErr(message, extra = {}) {
  return { ok: false, error: String(message), ...extra };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function ringPush(arr, item, max) {
  arr.push(item);
  if (arr.length > max) arr.splice(0, arr.length - max);
}

function truncate(str, max) {
  if (typeof str !== 'string') return { value: str, truncated: false };
  if (str.length <= max) return { value: str, truncated: false };
  return { value: str.slice(0, max), truncated: true };
}

async function withRetry(fn, { timeoutMs = 10000 } = {}) {
  // Runs fn once; on failure, retries exactly once; then rethrows.
  try {
    return await fn();
  } catch (firstErr) {
    try {
      return await fn();
    } catch (secondErr) {
      const err = new Error(
        `Action failed after 1 retry (timeout ${timeoutMs}ms). First: ${firstErr.message}. Retry: ${secondErr.message}`
      );
      err.cause = secondErr;
      throw err;
    }
  }
}

// ---------------------------------------------------------------------------
// serve mode
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

async function serve(args) {
  const slot = args.slot;
  const port = Number(args.port);
  if (!slot || !port) {
    console.error(JSON.stringify(jsonErr('serve requires --slot <n> and --port <port>')));
    process.exit(1);
  }

  const locksDir = path.join(HARNESS_DIR, 'locks');
  const lockDir = path.join(locksDir, `slot-${slot}.lock`);
  const slotProfileDir = path.join(HARNESS_DIR, 'slots', `slot-${slot}`, 'profile');
  ensureDir(locksDir);
  ensureDir(path.dirname(slotProfileDir));

  // Claim the slot atomically via mkdir.
  try {
    fs.mkdirSync(lockDir);
  } catch (e) {
    if (e.code === 'EEXIST') {
      let existing = null;
      try {
        existing = JSON.parse(fs.readFileSync(path.join(lockDir, 'owner.json'), 'utf8'));
      } catch {
        // ignore, report generic
      }
      console.error(
        JSON.stringify(
          jsonErr(`slot ${slot} is already locked`, {
            lockDir,
            existingOwner: existing,
          })
        )
      );
      process.exit(1);
    }
    console.error(JSON.stringify(jsonErr(`failed to claim slot lock: ${e.message}`)));
    process.exit(1);
  }

  const ownerInfo = {
    pid: process.pid,
    slot: Number(slot),
    port,
    startedAt: nowIso(),
  };
  fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify(ownerInfo, null, 2));

  let releasing = false;
  function releaseLock() {
    if (releasing) return;
    releasing = true;
    try {
      fs.rmSync(lockDir, { recursive: true, force: true });
    } catch {
      // best effort
    }
  }

  const { chromium } = loadPlaywright();

  let context;
  let page;
  const consoleBuf = [];
  const networkBuf = [];
  const CONSOLE_MAX = 200;
  const NETWORK_MAX = 100;

  try {
    context = await chromium.launchPersistentContext(slotProfileDir, {
      headless: true,
      viewport: { width: 1440, height: 900 },
    });
  } catch (e) {
    releaseLock();
    console.error(JSON.stringify(jsonErr(`failed to launch browser: ${e.message}`)));
    process.exit(1);
  }

  page = context.pages()[0] || (await context.newPage());
  wirePage(page);

  function wirePage(p) {
    p.on('console', (msg) => {
      ringPush(
        consoleBuf,
        { type: msg.type(), text: msg.text(), ts: nowIso() },
        CONSOLE_MAX
      );
    });
    p.on('requestfailed', (req) => {
      ringPush(
        networkBuf,
        {
          kind: 'requestfailed',
          url: req.url(),
          method: req.method(),
          failure: req.failure()?.errorText || 'unknown',
          ts: nowIso(),
        },
        NETWORK_MAX
      );
    });
    p.on('response', (res) => {
      if (res.status() >= 400) {
        ringPush(
          networkBuf,
          {
            kind: 'response',
            url: res.url(),
            status: res.status(),
            ts: nowIso(),
          },
          NETWORK_MAX
        );
      }
    });
  }

  async function handleAction(body) {
    const { action } = body;
    if (!action) throw new Error('missing "action" field');

    switch (action) {
      case 'navigate': {
        if (!body.url) throw new Error('navigate requires "url"');
        return withRetry(async () => {
          await page.goto(body.url, { timeout: 10000, waitUntil: 'load' });
          return jsonOk({ url: page.url() });
        });
      }

      case 'reload': {
        return withRetry(async () => {
          await page.reload({ timeout: 10000, waitUntil: 'load' });
          return jsonOk({ url: page.url() });
        });
      }

      case 'back': {
        return withRetry(async () => {
          await page.goBack({ timeout: 10000, waitUntil: 'load' });
          return jsonOk({ url: page.url() });
        });
      }

      case 'snapshot': {
        return withRetry(async () => {
          let aria = await page.locator('body').ariaSnapshot({ timeout: 10000 });
          if ((aria || '').trim().length < 50) {
            // SPA can still be booting right after 'load'; give it one beat.
            await page.waitForTimeout(1200);
            aria = await page.locator('body').ariaSnapshot({ timeout: 10000 });
          }
          const t = truncate(aria, 15000);
          return jsonOk({
            url: page.url(),
            title: await page.title(),
            ariaSnapshot: t.value,
            truncated: t.truncated,
          });
        });
      }

      case 'click': {
        const clickTimeout = Number(body.timeoutMs) || 10000;
        const runClick = async () => {
          const locator = resolveLocator(page, body);
          if (body.dblclick) {
            await locator.dblclick({ timeout: clickTimeout });
          } else {
            await locator.click({ timeout: clickTimeout });
          }
          return jsonOk({ clicked: true, dblclick: !!body.dblclick });
        };
        // noRetry:true avoids the double-attempt cost when probing whether a
        // button exists, and avoids re-clicking after an ambiguous timeout.
        return body.noRetry ? runClick() : withRetry(runClick);
      }

      case 'hover': {
        if (!body.selector) throw new Error('hover requires "selector"');
        return withRetry(async () => {
          await page.locator(body.selector).hover({ timeout: 10000 });
          return jsonOk();
        });
      }

      case 'press': {
        if (!body.key) throw new Error('press requires "key"');
        return withRetry(async () => {
          if (body.selector) {
            await page.locator(body.selector).press(body.key, { timeout: 10000 });
          } else {
            await page.keyboard.press(body.key);
          }
          return jsonOk();
        });
      }

      case 'fill': {
        if (!body.selector) throw new Error('fill requires "selector"');
        if (body.secretFrom) {
          return withRetry(async () => {
            const value = readSecret(body.secretFrom);
            await page.locator(body.selector).fill(value, { timeout: 10000 });
            return jsonOk({ filledFrom: 'secret' });
          });
        }
        if (body.value === undefined) throw new Error('fill requires "value" or "secretFrom"');
        return withRetry(async () => {
          await page.locator(body.selector).fill(String(body.value), { timeout: 10000 });
          return jsonOk();
        });
      }

      case 'waitfor': {
        return withRetry(async () => {
          const timeoutMs = body.timeoutMs || 10000;
          if (body.selector) {
            await page.locator(body.selector).waitFor({ timeout: timeoutMs, state: 'visible' });
          } else if (body.text) {
            await page.getByText(body.text).first().waitFor({ timeout: timeoutMs, state: 'visible' });
          } else {
            throw new Error('waitfor requires "selector" or "text"');
          }
          return jsonOk();
        });
      }

      case 'resize': {
        if (!body.width || !body.height) throw new Error('resize requires "width" and "height"');
        return withRetry(async () => {
          await page.setViewportSize({ width: Number(body.width), height: Number(body.height) });
          return jsonOk({ width: Number(body.width), height: Number(body.height) });
        });
      }

      case 'screenshot': {
        if (!body.path) throw new Error('screenshot requires "path"');
        return withRetry(async () => {
          ensureDir(path.dirname(body.path));
          await page.screenshot({ path: body.path, timeout: 10000 });
          return jsonOk({ path: body.path });
        });
      }

      case 'console': {
        const items = consoleBuf.splice(0, consoleBuf.length);
        return jsonOk({ items });
      }

      case 'network': {
        const items = networkBuf.splice(0, networkBuf.length);
        return jsonOk({ items });
      }

      case 'evaluate': {
        if (!body.js) throw new Error('evaluate requires "js"');
        return withRetry(async () => {
          // String form: Playwright evaluates the expression inside the page.
          const result = await page.evaluate(body.js);
          const serialized = JSON.stringify(result);
          const t = truncate(serialized ?? 'null', 2000);
          return jsonOk({ result: t.value, truncated: t.truncated });
        });
      }

      case 'freshprofile': {
        // Guaranteed-clean student: close the context, wipe the profile dir
        // (cookies + localStorage) and relaunch. Use between profile runs —
        // the app-side ?reset=1 has a save/reset race and is not sufficient.
        try {
          await context.close();
        } catch {
          // best effort
        }
        fs.rmSync(slotProfileDir, { recursive: true, force: true });
        ensureDir(slotProfileDir);
        context = await chromium.launchPersistentContext(slotProfileDir, {
          headless: true,
          viewport: { width: 1440, height: 900 },
        });
        page = context.pages()[0] || (await context.newPage());
        wirePage(page);
        consoleBuf.length = 0;
        networkBuf.length = 0;
        return jsonOk({ freshProfile: true });
      }

      case 'close': {
        // Handled specially by caller (needs to stop server after responding).
        return jsonOk({ closing: true });
      }

      default:
        throw new Error(`unknown action "${action}"`);
    }
  }

  function resolveLocator(p, body) {
    let loc;
    if (body.role) {
      loc = p.getByRole(body.role, body.name ? { name: body.name } : undefined);
    } else if (body.selector) {
      loc = p.locator(body.selector);
    } else {
      throw new Error('click/locator action requires "selector" or "role"+"name"');
    }
    // nth disambiguates strict-mode multi-matches (e.g. six identical
    // "Accepteren" buttons): 0-based index over ALL matches on the page.
    if (body.nth !== undefined) loc = loc.nth(Number(body.nth));
    return loc;
  }

  function readSecret(secretFrom) {
    const { file, jaar, field } = secretFrom || {};
    if (!file || !field) throw new Error('secretFrom requires "file" and "field"');
    const raw = fs.readFileSync(file, 'utf8');
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error('secretFrom file must contain a JSON array');
    let entry = arr[0];
    if (jaar !== undefined) {
      entry = arr.find((e) => String(e.jaar) === String(jaar));
      if (!entry) throw new Error(`no entry with jaar=${jaar} found in secret file`);
    }
    if (!(field in entry)) throw new Error(`field "${field}" not present in secret entry`);
    return String(entry[field]);
  }

  let shuttingDown = false;
  async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    try {
      await context.close();
    } catch {
      // best effort
    }
    releaseLock();
    server.close(() => {
      process.exit(0);
    });
    // Force-exit if server.close hangs.
    setTimeout(() => process.exit(0), 2000).unref();
  }

  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/act') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jsonErr('not found; POST /act only')));
      return;
    }

    let chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonErr(`invalid JSON body: ${e.message}`)));
        return;
      }

      try {
        const result = await handleAction(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        if (body.action === 'close') {
          shutdown();
        }
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonErr(e.message)));
      }
    });
    req.on('error', (e) => {
      try {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonErr(`request stream error: ${e.message}`)));
      } catch {
        // response may already be closed
      }
    });
  });

  server.on('error', (e) => {
    releaseLock();
    console.error(JSON.stringify(jsonErr(`server error: ${e.message}`)));
    process.exit(1);
  });

  server.listen(port, '127.0.0.1', () => {
    console.error(
      JSON.stringify(
        jsonOk({
          message: `slot ${slot} daemon listening`,
          port,
          slot: Number(slot),
          pid: process.pid,
          profileDir: slotProfileDir,
        })
      )
    );
  });

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', releaseLock);
}

// ---------------------------------------------------------------------------
// act mode (one-shot client)
// ---------------------------------------------------------------------------

async function act(args) {
  const port = Number(args.port);
  const jsonArg = args.json;
  if (!port || !jsonArg) {
    console.error(JSON.stringify(jsonErr('act requires --port <port> and --json \'<...>\'')));
    process.exit(1);
  }

  let body;
  try {
    body = JSON.parse(jsonArg);
  } catch (e) {
    console.error(JSON.stringify(jsonErr(`--json is not valid JSON: ${e.message}`)));
    process.exit(1);
  }

  const payload = JSON.stringify(body);

  const result = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        path: '/act',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        // Must exceed worst-case server-side action time: 2 attempts x action
        // timeout (10-12s) plus overhead — otherwise slow mission loads read
        // as false "timed out" errors.
        timeout: 35000,
      },
      (res) => {
        let chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          } catch (e) {
            reject(new Error(`failed to parse daemon response: ${e.message}`));
          }
        });
      }
    );
    req.on('error', (e) => reject(new Error(`could not reach daemon on port ${port}: ${e.message}`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`request to daemon on port ${port} timed out`));
    });
    req.write(payload);
    req.end();
  }).catch((e) => jsonErr(e.message));

  console.log(JSON.stringify(result));
  process.exit(result.ok ? 0 : 1);
}

// ---------------------------------------------------------------------------
// entry
// ---------------------------------------------------------------------------

async function main() {
  const [, , mode, ...rest] = process.argv;
  const args = parseArgs(rest);

  if (mode === 'serve') {
    await serve(args);
  } else if (mode === 'act') {
    await act(args);
  } else {
    console.error(
      JSON.stringify(
        jsonErr('usage: driver.mjs serve --slot <1..6> --port <910N> | driver.mjs act --port <910N> --json \'{...}\'')
      )
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(JSON.stringify(jsonErr(`fatal: ${e.message}`)));
  process.exit(1);
});
