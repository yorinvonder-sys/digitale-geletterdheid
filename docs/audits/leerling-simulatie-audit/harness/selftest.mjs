#!/usr/bin/env node
// selftest.mjs — sanity check for driver.mjs: daemon up, navigate, evaluate
// runs in-page (fix A), clean close + lock release. Exits 0 on success.

import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const HARNESS = path.dirname(new URL(import.meta.url).pathname);
const SLOT = process.env.SELFTEST_SLOT || '1';
const PORT = Number(process.env.SELFTEST_PORT || 9101);
const TARGET = process.env.SELFTEST_URL
  || 'http://localhost:3010/dev/mission-preview?mission=prompt-master';

function act(body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port: PORT, path: '/act', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 35000 },
      (res) => {
        let chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDaemon(maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try { await act({}); return true; } catch { await wait(300); }
  }
  return false;
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(JSON.stringify({ check: name, ok, detail }));
}

const daemon = spawn('node', [path.join(HARNESS, 'driver.mjs'), 'serve', '--slot', SLOT, '--port', String(PORT)], {
  stdio: ['ignore', 'ignore', 'pipe'],
});
let daemonErr = '';
daemon.stderr.on('data', (d) => { daemonErr += d.toString(); });

try {
  check('daemon-up', await waitForDaemon(), daemonErr.split('\n')[0] || '');

  const nav = await act({ action: 'navigate', url: TARGET });
  check('navigate', nav.ok === true, nav.url || nav.error);

  const evTitle = await act({ action: 'evaluate', js: 'document.title' });
  const titleOk = evTitle.ok === true && typeof evTitle.result === 'string' && evTitle.result.length > 2;
  check('evaluate-in-page (document.title)', titleOk, evTitle.result || evTitle.error);

  const evMath = await act({ action: 'evaluate', js: '1+1' });
  check('evaluate-literal (1+1)', evMath.ok === true && evMath.result === '2', evMath.result || evMath.error);

  const snap = await act({ action: 'snapshot' });
  check('snapshot', snap.ok === true && (snap.ariaSnapshot || '').length > 50, `len=${(snap.ariaSnapshot || '').length}`);

  const setLs = await act({ action: 'evaluate', js: "localStorage.setItem('selftest_x','1') || localStorage.getItem('selftest_x')" });
  check('localStorage-set', setLs.ok === true && setLs.result === '"1"', setLs.result || setLs.error);

  const fresh = await act({ action: 'freshprofile' });
  check('freshprofile', fresh.ok === true && fresh.freshProfile === true, fresh.error || '');

  const nav2 = await act({ action: 'navigate', url: TARGET });
  check('navigate-after-fresh', nav2.ok === true, nav2.url || nav2.error);

  const getLs = await act({ action: 'evaluate', js: "localStorage.getItem('selftest_x')" });
  check('localStorage-clean-after-fresh', getLs.ok === true && getLs.result === 'null', getLs.result || getLs.error);

  const probe = await act({ action: 'click', selector: '#bestaat-niet-12345', timeoutMs: 1500, noRetry: true });
  check('click-probe-fast-fail', probe.ok === false, (probe.error || '').slice(0, 60));

  const closed = await act({ action: 'close' });
  check('close', closed.ok === true && closed.closing === true, '');

  await wait(1500);
  const lockGone = !fs.existsSync(path.join(HARNESS, 'locks', `slot-${SLOT}.lock`));
  check('lock-released', lockGone, '');
} catch (e) {
  check('unexpected-error', false, e.message);
} finally {
  if (!daemon.killed) { try { daemon.kill('SIGTERM'); } catch {} }
}

const allOk = results.every((r) => r.ok);
console.log(JSON.stringify({ selftest: allOk ? 'PASS' : 'FAIL', failed: results.filter((r) => !r.ok).map((r) => r.name) }));
process.exit(allOk ? 0 : 1);
