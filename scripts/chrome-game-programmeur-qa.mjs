import fs from 'node:fs/promises';
import http from 'node:http';
import WebSocket from 'ws';

const PORT = Number(process.env.CHROME_CDP_PORT || 9225);
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const PROJECT_ID = 'tdaylulsnbhhjuufmdzk';
const AUTH_KEY = `sb-${PROJECT_ID}-auth-token`;
let lastClient = null;

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
          reject(new Error(`Invalid JSON from ${path}: ${error.message}\n${body}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function b64url(value) {
  return Buffer.from(JSON.stringify(value))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function makeQaSession(role = 'developer') {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60;
  const uid = '00000000-0000-4000-8000-000000000001';
  const accessToken = `${b64url({ alg: 'none', typ: 'JWT' })}.${b64url({
    aud: 'authenticated',
    exp,
    sub: uid,
    email: 'qa-developer@example.test',
    role: 'authenticated',
  })}.qa`;

  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    refresh_token: 'qa-refresh-token',
    user: {
      id: uid,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'qa-developer@example.test',
      email_confirmed_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email'],
        role,
        schoolId: 'qa-school',
      },
      user_metadata: {
        display_name: 'QA Developer',
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}

class CdpClient {
  constructor(webSocketDebuggerUrl) {
    lastClient = this;
    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ws.on('message', (raw) => {
      const message = JSON.parse(String(raw));
      if (!message.id && message.method) {
        this.events.push(message);
        this.events = this.events.slice(-40);
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
    await new Promise((resolve, reject) => {
      this.ws.once('open', resolve);
      this.ws.once('error', reject);
    });
  }

  send(method, params = {}, timeoutMs = 20000) {
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
      throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
    }
    return result.result?.value;
  }

  async text() {
    return this.eval('document.body.innerText');
  }

  async clickButtonByText(patternSource) {
    return this.eval(`(() => {
      const pattern = new RegExp(${JSON.stringify(patternSource)}, 'i');
      const button = Array.from(document.querySelectorAll('button')).find((el) => pattern.test(el.innerText || el.getAttribute('aria-label') || ''));
      if (!button) return false;
      button.click();
      return true;
    })()`);
  }

  async waitForText(pattern, timeoutMs = 12000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const text = await this.text();
      if (pattern.test(text)) return text;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    throw new Error(`Timed out waiting for text: ${pattern}`);
  }

  close() {
    this.ws.close();
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function capture(client, filePath) {
  try {
    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    }, 3000);
    await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
    return true;
  } catch (error) {
    console.warn(`Screenshot skipped for ${filePath}: ${error.message}`);
    return false;
  }
}

async function main() {
  const savedScreenshots = [];
  const encodedTarget = encodeURIComponent(`${ORIGIN}/dashboard`);
  let pages = await requestJson('GET', '/json/list');
  let page = pages.find((candidate) => candidate.type === 'page' && candidate.url.startsWith(ORIGIN));
  if (!page) {
    page = await requestJson('PUT', `/json/new?${encodedTarget}`);
  }

  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const session = makeQaSession('developer');
  await client.eval(`(() => {
    localStorage.setItem(${JSON.stringify(AUTH_KEY)}, ${JSON.stringify(JSON.stringify(session))});
    localStorage.setItem('cookie-consent-status', JSON.stringify({ status: 'accepted', timestamp: new Date().toISOString(), version: '2.0' }));
  })()`);
  await client.send('Page.navigate', { url: `${ORIGIN}/dashboard` });

  await client.waitForText(/Bekijk als|Developer/i, 15000);
  assert(await client.clickButtonByText('Leerling Dashboard'), 'Could not switch to leerling dashboard');
  await client.waitForText(/Game Programmeur/i, 15000);

  const openedGame = await client.eval(`(() => {
    const button = document.querySelector('button[aria-label="Game Programmeur openen"]')
      || (() => {
        const cards = Array.from(document.querySelectorAll('article, [data-tutorial], div'))
          .filter((el) => /Game Programmeur/i.test(el.innerText || ''))
          .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        return cards[0]?.querySelector('button');
      })();
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert(openedGame, 'Could not open Game Programmeur from dashboard');

  await client.waitForText(/AI-mentor|Live Game Preview/i, 15000);
  const noticeText = await client.text();
  if (/AI-mentor/i.test(noticeText) && /Begrepen/i.test(noticeText)) {
    assert(await client.clickButtonByText('Begrepen'), 'Could not dismiss AI transparency notice');
  }

  let missionText = await client.waitForText(/Live Game Preview/i, 15000);
  await new Promise((resolve) => setTimeout(resolve, 1800));
  missionText = await client.text();

  assert(/Game Programmeur/i.test(missionText), 'Mission title missing');
  assert(/0\/5/.test(missionText), 'Game Programmeur should start at 0/5 steps');
  assert(/START DE GAME!/i.test(missionText), 'Start game button missing');
  assert(!/AI is bezig/i.test(missionText), 'Preview should not remain blocked by AI busy overlay');
  assert(!/Typ hieronder om de code te veranderen/i.test(missionText), 'Old onboarding tooltip still overlaps the chat');
  assert(await client.clickButtonByText('START DE GAME'), 'Could not start the preview game');
  await new Promise((resolve) => setTimeout(resolve, 700));

  const headerChecks = await client.eval(`(() => {
    const labels = Array.from(document.querySelectorAll('button')).map((button) => ({
      text: button.innerText || '',
      aria: button.getAttribute('aria-label') || '',
      className: button.className || '',
    }));
    return {
      hasGallery: labels.some((button) => /Galerij|Bekijk games van klasgenoten/i.test(button.text + button.aria)),
      hasPublish: labels.some((button) => /Publiceren|Zet in Galerij/i.test(button.text + button.aria)),
      hasSave: labels.some((button) => /Opslaan in Bibliotheek/i.test(button.aria)),
      hasUndo: labels.some((button) => /Vorige versie herstellen/i.test(button.aria)),
      hasReset: labels.some((button) => /Herstel originele game/i.test(button.aria)),
      hasRestart: labels.some((button) => /Herstart game-preview/i.test(button.aria)),
      focusVisibleButtons: labels.filter((button) => /focus-visible/.test(button.className)).length,
    };
  })()`);
  assert(headerChecks.hasGallery, 'Gallery button label missing');
  assert(headerChecks.hasPublish, 'Publish button label missing');
  assert(headerChecks.hasSave, 'Save button aria-label missing');
  // Undo is only rendered after an actual code history entry exists; the static
  // contract test checks its aria-label in source.
  assert(headerChecks.hasReset, 'Reset button aria-label missing');
  assert(headerChecks.hasRestart, 'Restart button aria-label missing');
  assert(headerChecks.focusVisibleButtons >= 4, 'Expected focus-visible styles on primary game controls');

  assert(await client.clickButtonByText('Publiceren|Zet in Galerij'), 'Could not open publish modal');
  await client.waitForText(/Zichtbaar in de klasgalerij/i, 8000);
  if (await capture(client, '/private/tmp/game-programmeur-publish-modal-desktop.png')) {
    savedScreenshots.push('/private/tmp/game-programmeur-publish-modal-desktop.png');
  }
  await client.eval(`document.querySelector('[aria-label="Sluit dialoog"]')?.click()`);
  await new Promise((resolve) => setTimeout(resolve, 400));

  assert(await client.clickButtonByText('Opslaan'), 'Could not open save modal');
  await client.waitForText(/Opslaan in Bibliotheek/i, 8000);
  if (await capture(client, '/private/tmp/game-programmeur-save-modal-desktop.png')) {
    savedScreenshots.push('/private/tmp/game-programmeur-save-modal-desktop.png');
  }
  await client.eval(`document.querySelector('[aria-label="Sluit dialoog"]')?.click()`);
  await new Promise((resolve) => setTimeout(resolve, 400));

  assert(await client.clickButtonByText('Galerij|Bekijk games'), 'Could not open gallery');
  await client.waitForText(/Galerij/i, 8000);
  const galleryFiltersVisible = await client.eval(`/Alle Missies|Game Programmeur|Chatbot Trainer/i.test(document.body.innerText)`);
  assert(galleryFiltersVisible, 'Gallery filters did not render');
  if (await capture(client, '/private/tmp/game-programmeur-gallery-desktop.png')) {
    savedScreenshots.push('/private/tmp/game-programmeur-gallery-desktop.png');
  }

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await client.send('Page.navigate', { url: `${ORIGIN}/dashboard` });
  await client.waitForText(/Bekijk als|Developer/i, 15000);
  await client.clickButtonByText('Leerling Dashboard');
  await client.waitForText(/Game Programmeur/i, 15000);
  const openedMobileGame = await client.eval(`(() => {
    const button = document.querySelector('button[aria-label="Game Programmeur openen"]')
      || (() => {
        const cards = Array.from(document.querySelectorAll('article, [data-tutorial], div'))
          .filter((el) => /Game Programmeur/i.test(el.innerText || ''))
          .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        return cards[0]?.querySelector('button');
      })();
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert(openedMobileGame, 'Could not open Game Programmeur in mobile viewport');
  const mobileNotice = await client.waitForText(/AI-mentor|Live Game Preview/i, 15000);
  if (/AI-mentor/i.test(mobileNotice) && /Begrepen/i.test(mobileNotice)) {
    await client.clickButtonByText('Begrepen');
  }
  await client.waitForText(/Live Game Preview/i, 15000);
  await new Promise((resolve) => setTimeout(resolve, 800));
  const mobileText = await client.text();
  assert(/Game Programmeur/i.test(mobileText), 'Mobile viewport lost mission content');
  assert(/0\/5/.test(mobileText), 'Mobile viewport lost 0/5 progress');
  assert(!/AI is bezig/i.test(mobileText), 'Mobile preview should not remain blocked');
  if (await capture(client, '/private/tmp/game-programmeur-mobile.png')) {
    savedScreenshots.push('/private/tmp/game-programmeur-mobile.png');
  }

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url: `${ORIGIN}/dashboard` });
  await client.waitForText(/Bekijk als|Developer/i, 15000);
  await client.clickButtonByText('Leerling Dashboard');
  await client.waitForText(/AI Trainer/i, 15000);
  const openedTrainer = await client.eval(`(() => {
    const button = document.querySelector('button[aria-label="AI Trainer openen"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert(openedTrainer, 'Could not open AI Trainer regression mission');
  const trainerText = await client.waitForText(/AI Trainer/i, 12000);
  assert(/0\/3|Stap\s*1\s*van\s*3|1\s*\/\s*3/i.test(trainerText), '3-step mission progress did not render as expected');

  client.close();
  console.log('Chrome Game Programmeur QA passed');
  if (savedScreenshots.length > 0) {
    console.log('Screenshots:');
    for (const screenshot of savedScreenshots) console.log(`- ${screenshot}`);
  } else {
    console.log('Screenshots skipped: Chrome CDP capture timed out, DOM checks passed.');
  }
}

main().catch(async (error) => {
  console.error(error.stack || error.message);
  if (lastClient) {
    try {
      console.error('Recent CDP events:');
      console.error(JSON.stringify(lastClient.events.slice(-20), null, 2));
      console.error('Current body text:');
      console.error((await lastClient.text()).slice(0, 4000));
      console.error('Current HTML snippet:');
      console.error((await lastClient.eval('document.documentElement.outerHTML')).slice(0, 4000));
      await capture(lastClient, '/private/tmp/game-programmeur-qa-failure.png');
      console.error('Failure screenshot: /private/tmp/game-programmeur-qa-failure.png');
    } catch (debugError) {
      console.error(`Could not collect failure diagnostics: ${debugError.message}`);
    }
  }
  process.exit(1);
});
