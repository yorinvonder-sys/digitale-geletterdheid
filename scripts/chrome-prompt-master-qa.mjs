import fs from 'node:fs/promises';
import http from 'node:http';

const PORT = Number(process.env.CHROME_CDP_PORT || 9225);
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const TARGET_URL = `${ORIGIN}/dev/mission-preview?mission=prompt-master`;
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || '/private/tmp/dgskills-prompt-master-qa';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'ipad-portrait', width: 1024, height: 1366, mobile: false },
  { name: 'ipad-landscape', width: 1366, height: 1024, mobile: false },
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
      const response = await fetch(TARGET_URL);
      if (response.ok) return;
    } catch {
      // keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Dev-server niet bereikbaar op ${TARGET_URL}. Start eerst: npm run dev`);
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
    this.consoleMessages = [];

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id && message.method) {
        if (message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') {
          this.consoleMessages.push(message);
          this.consoleMessages = this.consoleMessages.slice(-50);
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

  async waitForSelector(selector, timeoutMs = 12_000) {
    return this.waitForExpression(`Boolean(document.querySelector(${JSON.stringify(selector)}))`, `selector: ${selector}`, timeoutMs);
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

  async click(selector) {
    const clicked = await this.eval(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return false;
      element.scrollIntoView({ block: 'center', inline: 'center' });
      element.click();
      return true;
    })()`);
    if (!clicked) throw new Error(`Kon niet klikken op ${selector}`);
  }

  async setTextarea(selector, value) {
    const updated = await this.eval(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!(element instanceof HTMLTextAreaElement)) return false;
      element.scrollIntoView({ block: 'center', inline: 'center' });
      element.focus();
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
      setter.call(element, ${JSON.stringify(value)});
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    if (!updated) throw new Error(`Kon textarea niet vullen: ${selector}`);
  }

  async ensureUsable(selector) {
    const audit = await this.eval(`(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return { ok: false, reason: 'missing' };
      element.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const centerX = Math.min(window.innerWidth - 1, Math.max(1, rect.left + rect.width / 2));
      const centerY = Math.min(window.innerHeight - 1, Math.max(1, rect.top + rect.height / 2));
      const topElement = document.elementFromPoint(centerX, centerY);
      const covered = topElement && topElement !== element && !element.contains(topElement);
      return {
        ok: rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          rect.top <= window.innerHeight &&
          rect.left <= window.innerWidth &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          !element.disabled &&
          !covered,
        reason: covered ? 'covered' : element.disabled ? 'disabled' : '',
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        text: element.innerText || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '',
      };
    })()`);
    if (!audit.ok) {
      throw new Error(`${selector} is niet bruikbaar: ${JSON.stringify(audit)}`);
    }
    return audit;
  }

  async auditLayout(stateName) {
    const audit = await this.eval(`(() => {
      const horizontalOverflow = Math.ceil(Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth || 0
      )) > window.innerWidth + 2;
      const clippedButtons = Array.from(document.querySelectorAll('button')).filter((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        return element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2;
      }).slice(0, 5).map((element) => ({
        text: element.innerText,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
      }));
      return {
        stateName: ${JSON.stringify(stateName)},
        url: window.location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow,
        clippedButtons,
        bodyText: document.body.innerText.slice(0, 500),
      };
    })()`);

    if (audit.horizontalOverflow) {
      throw new Error(`${stateName}: horizontale overflow gedetecteerd (${audit.scrollWidth}px > ${audit.viewport.width}px).`);
    }
    if (audit.clippedButtons.length > 0) {
      throw new Error(`${stateName}: knoptekst lijkt afgekapt: ${JSON.stringify(audit.clippedButtons)}`);
    }
    return audit;
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

async function clearMissionStorage(client) {
  await client.eval(`(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('dgskills_mission_')) localStorage.removeItem(key);
    }
  })()`);
}

async function runViewport(client, viewport) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });
  const warmupRun = `${viewport.name}-warmup-${Date.now()}`;
  await client.send('Page.navigate', { url: `${TARGET_URL}&qaViewport=${viewport.name}&qaRun=${warmupRun}` });
  await client.waitForExpression(
    `window.location.href.includes(${JSON.stringify(`qaRun=${warmupRun}`)}) && document.querySelector('[data-qa="prompt-master-intro"]')`,
    `${viewport.name} warmup intro`
  );
  await clearMissionStorage(client);

  const freshRun = `${viewport.name}-fresh-${Date.now()}`;
  await client.send('Page.navigate', { url: `${TARGET_URL}&qaViewport=${viewport.name}&qaRun=${freshRun}` });
  await client.waitForExpression(
    `window.location.href.includes(${JSON.stringify(`qaRun=${freshRun}`)}) && document.querySelector('[data-qa="prompt-master-start"]')`,
    `${viewport.name} fresh intro`
  );

  const audits = [];
  audits.push(await client.auditLayout('intro'));
  await client.ensureUsable('[data-qa="prompt-master-start"]');
  await client.screenshot(`${SCREENSHOT_DIR}/${viewport.name}-intro.png`);

  await client.click('[data-qa="prompt-master-start"]');
  await client.waitForSelector('[data-qa="prompt-master-challenge"]');
  audits.push(await client.auditLayout('challenge'));
  await client.ensureUsable('[data-qa="prompt-master-input"]');
  await client.screenshot(`${SCREENSHOT_DIR}/${viewport.name}-challenge.png`);

  await client.setTextarea('[data-qa="prompt-master-input"]', 'Teken een golden retriever.');
  await client.ensureUsable('[data-qa="prompt-master-submit"]');
  await client.click('[data-qa="prompt-master-submit"]');
  await client.waitForSelector('[data-qa="prompt-master-improve-feedback"]');
  audits.push(await client.auditLayout('weak-feedback'));
  await client.ensureUsable('[data-qa="prompt-master-try-again"]');
  await client.screenshot(`${SCREENSHOT_DIR}/${viewport.name}-weak-feedback.png`);

  await client.click('[data-qa="prompt-master-try-again"]');
  await client.waitForSelector('[data-qa="prompt-master-input"]');
  await client.setTextarea(
    '[data-qa="prompt-master-input"]',
    'Teken een vrolijke golden retriever puppy die rent door een groen park met zonlicht op de achtergrond.'
  );
  await client.ensureUsable('[data-qa="prompt-master-submit"]');
  await client.click('[data-qa="prompt-master-submit"]');
  await client.waitForSelector('[data-qa="prompt-master-success-feedback"]');
  audits.push(await client.auditLayout('strong-feedback'));
  await client.ensureUsable('[data-qa="prompt-master-next"]');
  await client.screenshot(`${SCREENSHOT_DIR}/${viewport.name}-strong-feedback.png`);

  return { viewport, states: audits.map((audit) => audit.stateName) };
}

async function main() {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  await waitForDevServer();
  await waitForChrome();

  const encodedTarget = encodeURIComponent('about:blank');
  const page = await requestJson('PUT', `/json/new?${encodedTarget}`);
  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');

  const results = [];
  try {
    for (const viewport of VIEWPORTS) {
      results.push(await runViewport(client, viewport));
    }
  } finally {
    client.close();
  }

  console.log('Prompt Master visual QA passed');
  for (const result of results) {
    console.log(`- ${result.viewport.name}: ${result.viewport.width}x${result.viewport.height}, states: ${result.states.join(', ')}`);
  }
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
