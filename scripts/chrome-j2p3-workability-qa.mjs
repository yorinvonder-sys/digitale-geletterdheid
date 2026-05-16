import fs from 'node:fs/promises';
import http from 'node:http';

const PORT = Number(process.env.CHROME_CDP_PORT || 9225);
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || '/private/tmp/dgskills-j2p3-workability-qa';

const MISSIONS = [
  'ux-detective',
  'podcast-producer',
  'meme-machine',
  'digital-storyteller',
  'brand-builder',
  'video-editor',
  'online-helden',
  'media-review',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'ipad-portrait', width: 1024, height: 1366, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

function requestJson(method, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : null);
        } catch (error) {
          reject(new Error(`Invalid JSON from Chrome ${path}: ${error.message}\n${body}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitForDevServer() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${ORIGIN}/dev/mission-preview?mission=media-review`);
      if (response.ok) return;
    } catch {
      // keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Dev-server niet bereikbaar op ${ORIGIN}. Start eerst: npm run dev`);
}

async function waitForChrome() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      await requestJson('GET', '/json/version');
      return;
    } catch {
      // keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Chrome CDP niet bereikbaar op poort ${PORT}. Start Chrome met --remote-debugging-port=${PORT}.`);
}

class CdpClient {
  constructor(webSocketDebuggerUrl) {
    if (!globalThis.WebSocket) {
      throw new Error('Node WebSocket API ontbreekt. Gebruik Node 22+ voor deze QA-check.');
    }

    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.id = 0;
    this.pending = new Map();
    this.messages = [];

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id && message.method) {
        if (message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') {
          this.messages.push(message);
          this.messages = this.messages.slice(-100);
        }
        return;
      }
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject, timeoutId } = this.pending.get(message.id);
      clearTimeout(timeoutId);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
  }

  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }

  send(method, params = {}, timeoutMs = 20_000) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timeoutId });
    });
  }

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
      throw new Error(description || 'Runtime.evaluate failed');
    }
    return result.result?.value;
  }

  async waitForExpression(expression, label, timeoutMs = 12_000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const found = await this.eval(`Boolean(${expression})`);
      if (found) return;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error(`Timed out waiting for ${label}`);
  }

  async screenshot(filePath) {
    const screenshot = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    }, 8_000);
    await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
  }

  close() {
    this.ws.close();
  }
}

async function runMission(client, missionId, viewport) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });

  const runId = `${missionId}-${viewport.name}-${Date.now()}`;
  const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&reset=1&qaRun=${runId}`;
  await client.send('Page.navigate', { url });
  await client.waitForExpression(
    `document.readyState === 'complete' && document.body && document.body.innerText.length > 50`,
    `${missionId} ${viewport.name} render`
  );
  await client.waitForExpression(
    `window.location.href.includes(${JSON.stringify(`qaRun=${runId}`)})`,
    `${missionId} ${viewport.name} navigation`
  );

  const before = await client.eval(`(() => {
    const bodyText = document.body.innerText;
    const buttons = Array.from(document.querySelectorAll('button'))
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .map((button) => button.innerText || button.getAttribute('aria-label') || '')
      .filter(Boolean);
    return {
      bodyText: bodyText.slice(0, 800),
      unsupported: bodyText.includes('Mission preview niet beschikbaar'),
      hasGoal: bodyText.includes('/goal') || bodyText.includes('Bewijs:'),
      buttonCount: buttons.length,
      buttons: buttons.slice(0, 8),
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
    };
  })()`);

  if (before.unsupported) throw new Error(`${missionId} ${viewport.name}: preview unsupported`);
  if (!before.hasGoal) throw new Error(`${missionId} ${viewport.name}: geen goal/evidence zichtbaar in intro`);
  if (before.buttonCount === 0) throw new Error(`${missionId} ${viewport.name}: geen bruikbare startknop gevonden`);
  if (before.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow in intro`);

  const clicked = await client.eval(`(() => {
    const pattern = /(start|begin|aan de slag|volgende|ronde|onderzoek|maak|ga verder)/i;
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
      const rect = candidate.getBoundingClientRect();
      const style = getComputedStyle(candidate);
      return pattern.test(text) && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !candidate.disabled;
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`${missionId} ${viewport.name}: startknop niet klikbaar`);

  await new Promise((resolve) => setTimeout(resolve, 700));
  const after = await client.eval(`(() => ({
    bodyText: document.body.innerText.slice(0, 800),
    buttonCount: document.querySelectorAll('button').length,
    horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
  }))()`);
  if (after.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow na start`);

  const errors = client.messages.filter((message) => {
    if (message.method === 'Runtime.consoleAPICalled') return message.params?.type === 'error';
    if (message.method === 'Log.entryAdded') return message.params?.entry?.level === 'error';
    return false;
  });
  if (errors.length > 0) throw new Error(`${missionId} ${viewport.name}: console errors: ${JSON.stringify(errors.slice(-3))}`);

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}.png`);
  return { missionId, viewport: viewport.name, buttons: before.buttons, afterButtons: after.buttonCount };
}

async function main() {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  await waitForDevServer();
  await waitForChrome();

  const page = await requestJson('PUT', `/json/new?${encodeURIComponent('about:blank')}`);
  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');

  const results = [];
  try {
    for (const missionId of MISSIONS) {
      for (const viewport of VIEWPORTS) {
        client.messages = [];
        results.push(await runMission(client, missionId, viewport));
      }
    }
  } finally {
    client.close();
  }

  console.log('J2 P3 workability Chrome smoke passed');
  for (const result of results) {
    console.log(`- ${result.missionId} ${result.viewport}: intro buttons ${result.buttons.join(' | ')}`);
  }
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
