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

const MISSION_TEMPLATES = {
  'ux-detective': 'data-viewer',
  'podcast-producer': 'builder-canvas',
  'meme-machine': 'builder-canvas',
  'digital-storyteller': 'builder-canvas',
  'brand-builder': 'builder-canvas',
  'video-editor': 'builder-canvas',
  'online-helden': 'scenario-engine',
  'media-review': 'review-arena',
  'network-navigator': 'data-viewer',
  'web-developer': 'builder-canvas',
  'mail-detective': 'scenario-engine',
  'code-review-2': 'review-arena',
};

const REGRESSION_MISSIONS = [
  'network-navigator',
  'web-developer',
  'mail-detective',
  'code-review-2',
];

const COMPLETION_SMOKE_MISSIONS = [
  ...MISSIONS,
  ...REGRESSION_MISSIONS,
];

const BUILDER_STEP_IDS = {
  'podcast-producer': ['onderwerp', 'structuur', 'intro', 'vragen'],
  'meme-machine': ['meme-analyse', 'viraliteit', 'eigen-meme', 'verantwoord'],
  'digital-storyteller': ['verhaalidee', 'flowchart', 'scène-schrijven', 'digitale-presentatie'],
  'brand-builder': ['merkanalyse', 'kleurenpalet', 'logo-concept', 'huisstijl'],
  'video-editor': ['concept', 'storyboard', 'shotlist', 'montageplan'],
  'web-developer': ['html-structuur', 'css-layout', 'javascript', 'testen'],
};

const DATA_COMPLETION_STATES = {
  'ux-detective': {
    answers: {
      'q1-meest-voorkomend': 'Huiswerk niet vinden in menu',
      'q2-gemiddelde-ernst': 4.3,
      'q3-prioriteit-observatie': 'De data laat zien dat navigatie het grootste probleem is, met hoge ernst en veel impact voor leerlingen.',
      'q4-slechte-usability': 'Magister en Itslearning',
      'q5-verschil-google-itslearning': 23,
      'q6-sus-verklaring': 'De scoreverschillen tonen dat duidelijke navigatie en feedback de usability voor leerlingen verbeteren.',
      'q7-principe-herkennen': 'Feedback',
      'q8-verbetervoorstel': 'Mijn voorstel prioriteert een duidelijke bevestiging en betere menustructuur omdat dit uit de UX-data blijkt.',
    },
    submitted: [
      'q1-meest-voorkomend',
      'q2-gemiddelde-ernst',
      'q3-prioriteit-observatie',
      'q4-slechte-usability',
      'q5-verschil-google-itslearning',
      'q6-sus-verklaring',
      'q7-principe-herkennen',
      'q8-verbetervoorstel',
    ],
  },
  'network-navigator': {
    answers: {
      'q1-totaaltijd': 61,
      'q2-dns-functie': 'Vertaalt een domeinnaam (instagram.com) naar een IP-adres',
      'q3-router-observatie': 'De routerstappen laten zien waar vertraging ontstaat en welke netwerkstap de meeste impact heeft.',
      'q4-snelste-site': 'Google.nl',
      'q5-verschil-tiktok-google': 5.6,
      'q6-latency-verklaring': 'Latency verschilt per website door afstand, serverreactie en hoeveel netwerkstappen nodig zijn.',
      'q7-foutcode-herkennen': '404',
      'q8-foutcode-uitleg': 'De foutcode bewijst welk type probleem optreedt en welke vervolgstap logisch is voor debugging.',
    },
    submitted: [
      'q1-totaaltijd',
      'q2-dns-functie',
      'q3-router-observatie',
      'q4-snelste-site',
      'q5-verschil-tiktok-google',
      'q6-latency-verklaring',
      'q7-foutcode-herkennen',
      'q8-foutcode-uitleg',
    ],
  },
};

const SCENARIO_COMPLETION_STATES = {
  'online-helden': {
    'is-dit-cyberpesten': { selections: [1, 2, -3, 4, -5, 6, -7, 8], submitted: true },
    'wat-doe-jij': { selections: [1, 3, 5, 7], submitted: true },
    'rangschik-impact': { selections: [1, 2, 3, 4, 5, 6, 7, 8], submitted: true },
  },
  'mail-detective': {
    'signalen-herkennen': { selections: [1, 2, 3], submitted: true },
    'gevaarlijkste-mail': { selections: [1, 2, 3, 4, 5], submitted: true },
    'echt-of-vals': { selections: [1, -2, 3, -4, 5, -6], submitted: true },
    'slim-reageren': { selections: [1, 2, 3], submitted: true, followUpAnswered: true, followUpCorrect: true },
  },
};

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

async function setViewport(client, viewport) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });
}

function completionStateFor(templateType, missionId) {
  if (templateType === 'builder-canvas') {
    const completedSteps = BUILDER_STEP_IDS[missionId];
    if (!completedSteps) throw new Error(`${missionId}: geen BuilderCanvas completion seed`);
    return {
      phase: 'results',
      currentStep: Math.max(0, completedSteps.length - 1),
      checklist: {},
      textEntries: Object.fromEntries(
        completedSteps.map((stepId) => [stepId, 'QA seeded completion evidence for BuilderCanvas.'])
      ),
      completedSteps,
      reflectionAnswered: {},
      reflectionCorrect: {},
      showMilestone: false,
    };
  }

  if (templateType === 'data-viewer') {
    const seeded = DATA_COMPLETION_STATES[missionId];
    if (!seeded) throw new Error(`${missionId}: geen DataViewer completion seed`);
    const submitted = Object.fromEntries(seeded.submitted.map((id) => [id, true]));
    const textObservations = Object.fromEntries(
      Object.entries(seeded.answers).filter(([, value]) => typeof value === 'string')
    );

    return {
      phase: 'results',
      currentDataset: 0,
      answers: seeded.answers,
      submitted,
      textObservations,
      confidences: {},
      followUpAnswered: {},
      followUpCorrect: {},
    };
  }

  if (templateType === 'scenario-engine') {
    const roundStates = SCENARIO_COMPLETION_STATES[missionId];
    if (!roundStates) throw new Error(`${missionId}: geen ScenarioEngine completion seed`);
    return {
      phase: 'results',
      currentRound: 0,
      roundStates,
    };
  }

  if (templateType === 'review-arena') {
    return {
      phase: 'complete',
      currentRound: 0,
      roundScores: Array(10).fill(25),
      followUpResults: {},
      configMissionId: missionId,
    };
  }

  throw new Error(`Geen completion seed bekend voor template ${templateType}`);
}

async function seedCompletionState(client, missionId, state) {
  const stateJson = JSON.stringify(state);
  return client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    const state = ${stateJson};
    Object.keys(localStorage)
      .filter((key) => key === 'dgskills_mission_' + missionId || key.endsWith('_' + missionId))
      .forEach((key) => localStorage.removeItem(key));

    let userId = null;
    try {
      const sessionKey = Object.keys(localStorage).find((key) => /^sb-[a-z0-9_-]+-auth-token$/i.test(key));
      if (sessionKey) {
        const raw = localStorage.getItem(sessionKey);
        userId = raw ? JSON.parse(raw)?.user?.id ?? null : null;
      }
    } catch {
      userId = null;
    }

    const storageKey = userId
      ? 'dgskills_mission_' + userId + '_' + missionId
      : 'dgskills_mission_' + missionId;
    localStorage.setItem(storageKey, JSON.stringify(state));
    return storageKey;
  })()`);
}

async function assertNoConsoleErrors(client, label) {
  const errors = client.messages.filter((message) => {
    if (message.method === 'Runtime.consoleAPICalled') return message.params?.type === 'error';
    if (message.method === 'Log.entryAdded') return message.params?.entry?.level === 'error';
    return false;
  });
  if (errors.length > 0) throw new Error(`${label}: console errors: ${JSON.stringify(errors.slice(-3))}`);
}

async function runMission(client, missionId, viewport) {
  await setViewport(client, viewport);

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
    feedbackOrFlowVisible: /(controleer|bevestig|volgende|vraag|ronde|dataset|checklist|resultaten|punten)/i.test(document.body.innerText),
  }))()`);
  if (after.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow na start`);
  if (!after.feedbackOrFlowVisible) throw new Error(`${missionId} ${viewport.name}: geen normale flow of feedback-control zichtbaar na start`);

  await assertNoConsoleErrors(client, `${missionId} ${viewport.name}`);

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}.png`);
  return { missionId, viewport: viewport.name, buttons: before.buttons, afterButtons: after.buttonCount };
}

async function runCompletionSmoke(client, missionId, viewport) {
  const templateType = MISSION_TEMPLATES[missionId];
  if (!templateType) throw new Error(`${missionId}: onbekend templateType voor completion smoke`);

  await setViewport(client, viewport);
  client.messages = [];
  const runId = `${missionId}-${viewport.name}-completion-${Date.now()}`;

  await client.send('Page.navigate', { url: `${ORIGIN}/?qaSeed=${encodeURIComponent(runId)}` });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} ${viewport.name} origin render`);
  const storageKey = await seedCompletionState(client, missionId, completionStateFor(templateType, missionId));

  const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&qaMode=completion&qaRun=${runId}`;
  await client.send('Page.navigate', { url });
  await client.waitForExpression(
    `document.readyState === 'complete' && document.body && document.body.innerText.includes('Missie voltooid')`,
    `${missionId} ${viewport.name} completion CTA`,
    15_000
  );

  const evidence = await client.eval(`(() => {
    const bodyText = document.body.innerText;
    const completeButton = Array.from(document.querySelectorAll('button')).find((button) =>
      /Missie voltooid/i.test(button.innerText || button.getAttribute('aria-label') || '')
    );
    const rect = completeButton?.getBoundingClientRect();
    return {
      storageKey: ${JSON.stringify(storageKey)},
      completionCta: Boolean(completeButton),
      completionCtaVisible: Boolean(rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight),
      hasTakeaways: /wat je hebt geleerd/i.test(bodyText),
      hasEvidence: /leerlingbewijs\\s*\\/\\s*docentbewijs/i.test(bodyText),
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
    };
  })()`);

  if (!evidence.completionCta || !evidence.completionCtaVisible) {
    throw new Error(`${missionId} ${viewport.name}: completion CTA niet zichtbaar`);
  }
  if (!evidence.hasEvidence) throw new Error(`${missionId} ${viewport.name}: completion evidenceblok ontbreekt`);
  if (!evidence.hasTakeaways) throw new Error(`${missionId} ${viewport.name}: completion takeaways ontbreken`);
  if (evidence.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow in eindstaat`);

  await assertNoConsoleErrors(client, `${missionId} ${viewport.name} completion`);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-completion.png`);
  return { missionId, viewport: viewport.name, templateType, storageKey };
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
    for (const missionId of COMPLETION_SMOKE_MISSIONS) {
      for (const viewport of VIEWPORTS) {
        results.push(await runCompletionSmoke(client, missionId, viewport));
      }
    }
  } finally {
    client.close();
  }

  console.log('J2 P3 workability Chrome smoke passed');
  for (const result of results) {
    if ('buttons' in result) {
      console.log(`- ${result.missionId} ${result.viewport}: intro buttons ${result.buttons.join(' | ')}`);
    } else {
      console.log(`- ${result.missionId} ${result.viewport}: completion CTA visible (${result.templateType})`);
    }
  }
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
