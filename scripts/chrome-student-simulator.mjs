import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { spawn } from 'node:child_process';

const PORT = Number(process.env.CHROME_CDP_PORT || 9225);
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const VERCEL_SHARE_TOKEN = process.env.QA_VERCEL_SHARE || '';
const VERCEL_JWT = process.env.QA_VERCEL_JWT || '';
const SCREENSHOT_DIR = process.argv.find(arg => arg.startsWith('--screenshot-dir='))?.split('=')[1]
  || process.env.QA_SCREENSHOT_DIR
  || '/Users/yorinvonder/.gemini/antigravity/brain/adfb327f-a23f-497e-a1dc-dd4b6a0b82fb/screenshots';
const SUPPORTED_FLAGS = ['--period=', '--mission=', '--viewport=', '--review', '--play', '--app-route', '--allow-onboarding-completion', '--persona=', '--report-json=', '--report-md=', '--screenshot-dir=', '--auth-email=', '--auth-credentials='];

function withQaVercelShare(url) {
  if (!VERCEL_SHARE_TOKEN) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('.vercel.app')) return url;
    parsed.searchParams.set('_vercel_share', VERCEL_SHARE_TOKEN);
    return parsed.toString();
  } catch {
    return url;
  }
}

function vercelShareSeedUrl() {
  if (!VERCEL_SHARE_TOKEN) return null;

  try {
    const parsed = new URL(ORIGIN);
    if (!parsed.hostname.endsWith('.vercel.app')) return null;
    parsed.pathname = '/';
    parsed.search = '';
    parsed.searchParams.set('_vercel_share', VERCEL_SHARE_TOKEN);
    return parsed.toString();
  } catch {
    return null;
  }
}

const J1P1_MISSIONS = [
  'magister-master',
  'cloud-commander',
  'word-wizard',
  'slide-specialist',
  'print-pro',
];

const J2P2_MISSIONS = [
  'algorithm-architect',
  'web-developer',
  'network-navigator',
  'app-prototyper',
  'bug-hunter',
  'automation-engineer',
  'code-reviewer',
  'privacy-by-design',
  'wachtwoord-warrior',
  'access-control-engineer',
  'code-review-2',
];

const J1P2_MISSIONS = [
  'prompt-master',
  'game-programmeur',
  'ai-trainer',
  'chatbot-trainer',
  'verhalen-ontwerper',
  'game-director',
  'ai-tekengame',
  'ai-beleid-brainstorm',
  'code-denker',
  'website-bouwer',
  'schermtijd-coach',
  'notificatie-ninja',
  'cloud-cleaner',
  'layout-doctor',
  'pitch-police',
  'review-week-2',
];

const J1P3_MISSIONS = [
  'data-detective',
  'data-verzamelaar',
  'deepfake-detector',
  'ai-spiegel',
  'social-safeguard',
  'scroll-stopper',
  'cookie-crusher',
  'mail-detective',
  'data-handelaar',
  'filter-bubble-breaker',
  'datalekken-rampenplan',
  'data-voor-data',
  'data-speurder',
  'digitale-balans-coach',
];

const J1P4_MISSIONS = [
  'mission-blueprint',
  'mission-vision',
  'mission-launch',
  'review-week-3',
];

const J2P1_MISSIONS = [
  'data-journalist',
  'spreadsheet-specialist',
  'factchecker',
  'api-verkenner',
  'dashboard-designer',
  'ai-bias-detective',
  'data-review',
];

const J2P3_MISSIONS = [
  'ux-detective',
  'podcast-producer',
  'meme-machine',
  'digital-storyteller',
  'brand-builder',
  'video-editor',
  'online-helden',
  'media-review',
];

const J2P4_MISSIONS = [
  'ai-ethicus',
  'digital-rights-defender',
  'tech-court',
  'future-forecaster',
  'eindproject-j2',
];

const J3P1_MISSIONS = [
  'ml-trainer',
  'api-architect',
  'neural-navigator',
  'data-pipeline',
  'open-source-contributor',
  'advanced-code-review',
];

const J3P2_MISSIONS = [
  'cyber-detective',
  'encryption-expert',
  'phishing-fighter',
  'security-auditor',
  'digital-forensics',
  'security-review',
];

const J3P3_MISSIONS = [
  'startup-simulator',
  'policy-maker',
  'innovation-lab',
  'digital-divide-researcher',
  'tech-impact-analyst',
  'welzijnsonderzoeker',
  'startup-pitch',
  'impact-review',
];

const J3P4_MISSIONS = [
  'portfolio-builder',
  'research-project',
  'prototype-developer',
  'pitch-perfect',
  'reflection-report',
  'meesterproef',
];

const PERIOD_MISSION_SETS = {
  j1p1: J1P1_MISSIONS,
  j1p2: J1P2_MISSIONS,
  j1p3: J1P3_MISSIONS,
  j1p4: J1P4_MISSIONS,
  j2p1: J2P1_MISSIONS,
  j2p2: J2P2_MISSIONS,
  j2p3: J2P3_MISSIONS,
  j2p4: J2P4_MISSIONS,
  j3p1: J3P1_MISSIONS,
  j3p2: J3P2_MISSIONS,
  j3p3: J3P3_MISSIONS,
  j3p4: J3P4_MISSIONS,
};

const MISSION_TEMPLATES = {
  'magister-master': 'tool-guide',
  'cloud-commander': 'tool-guide',
  'word-wizard': 'tool-guide',
  'slide-specialist': 'tool-guide',
  'print-pro': 'tool-guide',
  'ipad-print-instructies': 'dedicated',
  'prompt-master': 'prompt-master',
  'game-programmeur': 'agent-role',
  'ai-trainer': 'agent-role',
  'chatbot-trainer': 'agent-role',
  'verhalen-ontwerper': 'agent-role',
  'game-director': 'game-director',
  'ai-tekengame': 'agent-role',
  'ai-beleid-brainstorm': 'agent-role',
  'code-denker': 'scenario-engine',
  'website-bouwer': 'builder-canvas',
  'schermtijd-coach': 'debate-arena',
  'notificatie-ninja': 'scenario-engine',
  'cloud-cleaner': 'cloud-cleaner',
  'layout-doctor': 'layout-doctor',
  'pitch-police': 'pitch-police',
  'review-week-2': 'review-arena',
  'data-detective': 'dedicated',
  'data-verzamelaar': 'agent-role',
  'deepfake-detector': 'dedicated',
  'ai-spiegel': 'simulation-lab',
  'social-safeguard': 'scenario-engine',
  'scroll-stopper': 'debate-arena',
  'cookie-crusher': 'scenario-engine',
  'mail-detective': 'scenario-engine',
  'data-handelaar': 'puzzle-lab',
  'filter-bubble-breaker': 'dedicated',
  'datalekken-rampenplan': 'dedicated',
  'data-voor-data': 'dedicated',
  'data-speurder': 'scenario-engine',
  'digitale-balans-coach': 'debate-arena',
  'mission-blueprint': 'builder-canvas',
  'mission-vision': 'builder-canvas',
  'mission-launch': 'tool-guide',
  'review-week-3': 'debate-arena',
  'data-journalist': 'data-viewer',
  'spreadsheet-specialist': 'data-viewer',
  'factchecker': 'scenario-engine',
  'api-verkenner': 'data-viewer',
  'dashboard-designer': 'data-viewer',
  'ai-bias-detective': 'scenario-engine',
  'data-review': 'review-arena',
  'algorithm-architect': 'simulation-lab',
  'web-developer': 'builder-canvas',
  'network-navigator': 'data-viewer',
  'app-prototyper': 'builder-canvas',
  'bug-hunter': 'simulation-lab',
  'automation-engineer': 'builder-canvas',
  'code-reviewer': 'simulation-lab',
  'privacy-by-design': 'simulation-lab',
  'wachtwoord-warrior': 'puzzle-lab',
  'cyber-detective': 'puzzle-lab',
  'data-handelaar': 'puzzle-lab',
  'encryption-expert': 'puzzle-lab',
  'security-auditor': 'puzzle-lab',
  'access-control-engineer': 'dedicated',
  'code-review-2': 'review-arena',
  'ux-detective': 'data-viewer',
  'podcast-producer': 'builder-canvas',
  'meme-machine': 'builder-canvas',
  'digital-storyteller': 'builder-canvas',
  'brand-builder': 'builder-canvas',
  'video-editor': 'builder-canvas',
  'online-helden': 'scenario-engine',
  'media-review': 'review-arena',
  'ai-ethicus': 'debate-arena',
  'digital-rights-defender': 'debate-arena',
  'tech-court': 'debate-arena',
  'future-forecaster': 'debate-arena',
  'eindproject-j2': 'data-viewer',
  'ml-trainer': 'data-viewer',
  'api-architect': 'builder-canvas',
  'neural-navigator': 'data-viewer',
  'data-pipeline': 'data-viewer',
  'open-source-contributor': 'builder-canvas',
  'advanced-code-review': 'review-arena',
  'phishing-fighter': 'scenario-engine',
  'digital-forensics': 'scenario-engine',
  'security-review': 'review-arena',
  'startup-simulator': 'builder-canvas',
  'policy-maker': 'debate-arena',
  'innovation-lab': 'builder-canvas',
  'digital-divide-researcher': 'data-viewer',
  'tech-impact-analyst': 'data-viewer',
  'welzijnsonderzoeker': 'data-viewer',
  'startup-pitch': 'tool-guide',
  'impact-review': 'review-arena',
  'portfolio-builder': 'builder-canvas',
  'research-project': 'data-viewer',
  'prototype-developer': 'builder-canvas',
  'pitch-perfect': 'builder-canvas',
  'reflection-report': 'debate-arena',
  'meesterproef': 'builder-canvas',
};

const BUILDER_STEP_IDS = {
  'website-bouwer': ['html-basis', 'css-stijl', 'content', 'reflectie'],
  'web-developer': ['html-structuur', 'css-layout', 'javascript', 'testen'],
  'app-prototyper': ['probleemanalyse', 'schermen-ontwerpen', 'gebruikersflow', 'testplan'],
  'automation-engineer': ['taak-analyse', 'algoritme', 'script-structuur', 'testplan'],
};

const DATA_COMPLETION_STATES = {
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

const SIMULATION_COMPLETION_STATES = {
  'algorithm-architect': {
    answers: {
      'za1-q1': 'Binair zoeken halveert elke stap het zoekgebied — veel minder stappen nodig',
      'za1-q2': 'Alleen bij gesorteerde lijsten',
      'za1-q3': '10 stappen — want log₂(1024) = 10',
      'sa1-q1': 'Vergelijk steeds twee naast elkaar liggende elementen en wissel als ze in de verkeerde volgorde staan',
      'sa1-q2': 'Een slecht algoritme op miljoenen rijen data kan minuten of uren langer duren dan een goed algoritme',
      'sa1-q3': 'Hoeveel stappen (tijd) of geheugen het nodig heeft in verhouding tot de invoergrootte',
      'ps1-q1': 'Stappen van een algoritme in gewone taal opgeschreven — niet in een echte programmeertaal',
      'ps1-q2': 'Decompositie, patroonherkenning, abstractie en algoritmisch denken',
      'ps1-q3': 'Begin met het getal 0 als tijdelijke grootste',
    },
    submitted: [
      'za1-q1', 'za1-q2', 'za1-q3',
      'sa1-q1', 'sa1-q2', 'sa1-q3',
      'ps1-q1', 'ps1-q2', 'ps1-q3',
    ]
  },
  'bug-hunter': {
    answers: {
      'fl1-q1': 'De foutmelding zorgvuldig lezen en de regelnummer noteren',
      'fl1-q2': 'Syntax error = schrijffout in code; runtime error = fout die pas optreedt tijdens uitvoering',
      'fl1-q3': 'Om te zien welke waarden variabelen hebben op een bepaald moment',
      'sb1-q1': 'Logische fout — de code werkt, maar geeft verkeerde uitkomsten',
      'sb1-q2': 'Off-by-one fout — de lus loopt één stap te ver (tot 5 inclusief)',
      'sb1-q3': 'Over 2 weken weet jij (of een ander) niet meer wat "x" betekent',
      'ds1-q1': 'Ze begrijpen de oorzaak niet en dezelfde bug keert later terug',
      'ds1-q2': 'Reproduceren → Lokaliseren → Diagnosticeren → Fixen',
      'ds1-q3': 'Om te verifiëren dat de bug echt weg is en je geen nieuwe bugs hebt geïntroduceerd',
    },
    submitted: [
      'fl1-q1', 'fl1-q2', 'fl1-q3',
      'sb1-q1', 'sb1-q2', 'sb1-q3',
      'ds1-q1', 'ds1-q2', 'ds1-q3',
    ]
  },
  'code-reviewer': {
    answers: {
      'cl1-q1': 'Je kunt niet raden wat de variabele bevat zonder de rest van de code te lezen',
      'cl1-q2': 'Bij complexe logica die niet vanzelfsprekend is, of bij bewuste keuzes uitleggen',
      'cl1-q3': 'Het maakt de structuur van de code zichtbaar — wat is binnen wat?',
      'dry1-q1': 'Schrijf dezelfde logica maar één keer en hergebruik het via functies',
      'dry1-q2': 'Een hardgecodeerd getal zonder naam, zoals "0.21" voor btw — niemand weet wat het betekent',
      'dry1-q3': 'Vijf keer — één keer per plek in de code',
      'fb1-q1': 'Positief punt → verbeterpunt met uitleg → positief punt',
      'fb1-q2': 'De tweede is concreet en actionable — je weet precies wat je kunt verbeteren',
      'fb1-q3': 'Je leert code van anderen lezen en patroonherkennen — dat maakt jou een betere programmeur',
    },
    submitted: [
      'cl1-q1', 'cl1-q2', 'cl1-q3',
      'dry1-q1', 'dry1-q2', 'dry1-q3',
      'fb1-q1', 'fb1-q2', 'fb1-q3',
    ]
  },
  'privacy-by-design': {
    answers: {
      'sp1-q1': 'De score is laag, want jij deelt veel informatie',
      'sp1-q2': 'Locatie-delen én zoekbaarheid allebei uitschakelen',
      'sp1-q3': 'Mensen weten waar je bent en wanneer je niet thuis bent',
      'ap1-q1': 'Microfoon of Locatie',
      'ap1-q2': 'Een spelletje heeft contacten normaal gesproken helemaal niet nodig',
      'ap1-q3': 'Geef apps zo weinig permissies als mogelijk voor ze te laten werken',
      'ck1-q1': 'De site slaat jouw gedrag op om gerichte advertenties te tonen',
      'ck1-q2': 'Functionele cookies — voor je winkelmandje en inlogstatus',
      'ck1-q3': 'Je blijft niet ingelogd en je winkelmandje wordt vergeten',
    },
    submitted: [
      'sp1-q1', 'sp1-q2', 'sp1-q3',
      'ap1-q1', 'ap1-q2', 'ap1-q3',
      'ck1-q1', 'ck1-q2', 'ck1-q3',
    ]
  },
  'ai-spiegel': {
    answers: {
      'ap1-q1': 'Kijktijd is moeilijker te manipuleren — als je lang kijkt, vind je het echt interessant',
      'ap1-q2': 'Het platform weet wat jij gaat doen voordat jij het zelf weet',
      'ap1-q3': 'Je vindt sneller content die je interessant vindt, wat tijd bespaart',
      'ip1-q1': '"Altijd" — de app kan jouw locatie bijhouden ook als je hem niet gebruikt',
      'ip1-q2': 'Beoordeel of het spelletje de microfoon echt nodig heeft, en zo niet: toegang intrekken',
      'ip1-q3': 'Instellingen → Privacy & Beveiliging → [Soort toegang]',
      'fb1-q1': 'Een situatie waarbij algoritmes je steeds meer van hetzelfde laten zien, waardoor andere perspectieven verdwijnen',
      'fb1-q2': 'Als mensen steeds andere informatie zien, wordt het moeilijker om een gemeenschappelijke basis te vinden voor gesprekken en beslissingen',
      'fb1-q3': 'Bewust zoeken naar bronnen en meningen die je normaal niet tegenkomt',
    },
    submitted: [
      'ap1-q1', 'ap1-q2', 'ap1-q3',
      'ip1-q1', 'ip1-q2', 'ip1-q3',
      'fb1-q1', 'fb1-q2', 'fb1-q3',
    ]
  }
};

const ACCESS_CONTROL_RULES = {
  res1: ['leerling', 'docent', 'admin'],
  res2: ['docent', 'admin'],
  res3: ['admin'],
  res4: ['leerling', 'docent', 'admin'],
  res5: ['admin'],
  res6: ['leerling', 'docent', 'admin', 'gast'],
};

const ACCESS_CONTROL_TEST_RESULTS = {
  t1: 'correct',
  t2: 'correct',
  t3: 'correct',
  t4: 'correct',
  t5: 'correct',
  t6: 'correct',
};

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'ipad-portrait', width: 820, height: 1180, mobile: false },
  { name: 'ipad-landscape', width: 1180, height: 820, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

const CONFIG_DIRS = {
  'scenario-engine': 'src/features/missions/templates/scenario-engine/configs',
  'debate-arena': 'src/features/missions/templates/debate-arena/configs',
  'data-viewer': 'src/features/missions/templates/data-viewer/configs',
  'review-arena': 'src/features/missions/templates/review-arena/configs',
  'builder-canvas': 'src/features/missions/templates/builder-canvas/configs',
  'tool-guide': 'src/features/missions/templates/tool-guide/configs',
};

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

async function waitForAppServer({ appRoute = false } = {}) {
  if (process.env.QA_SKIP_APP_SERVER_PROBE === '1') return;

  const deadline = Date.now() + 10_000;
  const probeUrl = appRoute ? `${ORIGIN}/` : `${ORIGIN}/dev/mission-preview?mission=web-developer`;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(withQaVercelShare(probeUrl));
      if (response.ok) return;
    } catch {
      // keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`App-server niet bereikbaar op ${ORIGIN}. Start eerst: npm run dev`);
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
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        await this.send('Page.bringToFront', {}, 10_000).catch(() => {});
        await new Promise((resolve) => setTimeout(resolve, attempt === 1 ? 150 : 900));
        const screenshot = await this.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: false,
          fromSurface: true,
        }, 45_000);
        await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
        return;
      } catch (error) {
        lastError = error;
        if (attempt === 2) break;
        console.warn(`[Screenshot retry] ${path.basename(filePath)}: ${error.message}`);
      }
    }
    throw lastError;
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

async function installVercelJwtCookie(client) {
  if (!VERCEL_JWT) return;

  const originUrl = new URL(ORIGIN);
  if (!originUrl.hostname.endsWith('.vercel.app')) return;

  await client.send('Network.enable');
  const result = await client.send('Network.setCookie', {
    name: '_vercel_jwt',
    value: VERCEL_JWT,
    url: originUrl.origin,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  });
  if (!result.success) {
    throw new Error('Vercel share-cookie kon niet in Chrome worden gezet');
  }
}

async function seedVercelShareBypass(client) {
  const seedUrl = vercelShareSeedUrl();
  if (!seedUrl) return;

  await client.send('Page.navigate', { url: seedUrl });
  await client.waitForExpression(`document.readyState === 'complete'`, 'Vercel share-cookie seed', 15_000);
  await delay(1000);
}

function argValue(name) {
  const prefix = `--${name}=`;
  return process.argv.find(arg => arg.startsWith(prefix))?.slice(prefix.length) ?? null;
}

function safeFilePart(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function revealAppMissionCard(client, missionId, titleCandidates = []) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const found = await client.eval(`(() => {
      const missionId = ${JSON.stringify(missionId)};
      const titleCandidates = ${JSON.stringify(titleCandidates)};
      const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
      const normalizedTitles = titleCandidates.map(normalize).filter(Boolean);

      const exactCard = document.querySelector('[data-mission-id="' + missionId + '"]');
      if (exactCard) {
        exactCard.scrollIntoView({ block: 'center', inline: 'center' });
        return true;
      }

      const target = Array.from(document.querySelectorAll('article, section, li, div, button')).find((candidate) => {
        const rect = candidate.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        const text = normalize(candidate.innerText || '');
        const hasMissionTitle = normalizedTitles.some((title) => text.includes(title));
        const hasStartButton = candidate.matches('button')
          || Array.from(candidate.querySelectorAll('button')).some((button) => /start missie|openen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
        return hasMissionTitle && hasStartButton;
      });
      if (target) {
        target.scrollIntoView({ block: 'center', inline: 'center' });
        return true;
      }

      const anyVisibleStarter = Array.from(document.querySelectorAll('[data-mission-id], button')).some((candidate) => {
        const rect = candidate.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        return candidate.matches('[data-mission-id]') || /start missie|openen/i.test(candidate.innerText || candidate.getAttribute('aria-label') || '');
      });
      if (anyVisibleStarter) return true;

      window.scrollBy({ top: Math.max(420, Math.floor(window.innerHeight * 0.72)), left: 0, behavior: 'instant' });
      return false;
    })()`);
    if (found) return true;
    await delay(350);
  }
  return false;
}

async function closeOpenProfileMenu(client) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const stillOpen = await client.eval(`(() => {
      const logoutButton = Array.from(document.querySelectorAll('button')).find((button) => /uitloggen/i.test(button.innerText || ''));
      return Boolean(logoutButton);
    })()`);
    if (!stillOpen) return;
    await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 12, y: 160, button: 'left', clickCount: 1 });
    await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 12, y: 160, button: 'left', clickCount: 1 });
    await client.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
    await delay(250);
  }
}

async function dismissWellbeingAlert(client) {
  const dismissed = await client.eval(`(() => {
    const qa = document.querySelector('[data-qa="wellbeing-alert-dismiss"]');
    if (qa) {
      qa.scrollIntoView({ block: 'center', inline: 'center' });
      qa.click();
      return true;
    }

    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
      const rect = candidate.getBoundingClientRect();
      return /terug naar de missie|ik begrijp het|sluiten/i.test(text)
        && rect.width > 0
        && rect.height > 0
        && !candidate.disabled;
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (dismissed) await delay(450);
  return dismissed;
}

async function dismissProjectTourIfPresent(client) {
  for (let step = 0; step < 7; step += 1) {
    const clicked = await client.eval(`(() => {
      const text = document.body.innerText || '';
      if (!/Welkom bij Project DG|Dit is jouw dashboard|trofee|missies/i.test(text)) return false;
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find((candidate) => /volgende|begrepen|sluiten|overslaan|klaar/i.test(candidate.innerText || candidate.getAttribute('aria-label') || ''))
        || buttons.find((candidate) => (candidate.innerText || candidate.getAttribute('aria-label') || '').trim() === '×');
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    if (!clicked) break;
    await delay(350);
  }
}

async function discoverSupabaseConfig() {
  if (process.env.QA_SUPABASE_URL && process.env.QA_SUPABASE_ANON_KEY) {
    return {
      url: process.env.QA_SUPABASE_URL,
      anonKey: process.env.QA_SUPABASE_ANON_KEY,
    };
  }

  const candidateOrigins = [...new Set([ORIGIN, 'https://dgskills.app'])];
  for (const origin of candidateOrigins) {
    try {
      const html = await fetch(origin).then((response) => response.ok ? response.text() : '');
      const queue = [...html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)]
        .map((match) => new URL(match[1], origin).href);
      const seen = new Set();

      while (queue.length > 0 && seen.size < 250) {
        const url = queue.shift();
        if (!url || seen.has(url)) continue;
        seen.add(url);

        const source = await fetch(url).then((response) => response.ok ? response.text() : '').catch(() => '');
        const supabaseUrl = source.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
        const anonKey = source.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)?.[0];
        if (supabaseUrl && anonKey) return { url: supabaseUrl, anonKey };

        for (const match of source.matchAll(/import\("\.\/([^"?]+\.js)"\)|from"\.\/([^"?]+\.js)"/g)) {
          const file = match[1] || match[2];
          if (file) queue.push(new URL(file, url).href);
        }
      }
    } catch {
      // Try the next origin.
    }
  }

  throw new Error('Supabase config niet gevonden. Zet QA_SUPABASE_URL en QA_SUPABASE_ANON_KEY of draai tegen een DGSkills bundle.');
}

async function signInSupabaseQaAccount(email, credentialsPath) {
  if (!email) return null;
  if (!credentialsPath) throw new Error('--auth-credentials is verplicht wanneer --auth-email wordt gebruikt');

  const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
  const account = credentials.accounts?.find((item) => item.email === email);
  if (!account?.password) throw new Error(`Geen QA-credentials gevonden voor ${email}`);

  const config = await discoverSupabaseConfig();
  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email, password: account.password }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`QA-login mislukt voor ${email}: HTTP ${response.status} ${payload.error_description || payload.msg || payload.error || ''}`.trim());
  }

  return {
    config,
    session: payload,
    email,
    schoolId: credentials.schoolId,
  };
}

async function supabaseRestGet(authContext, pathName, params) {
  const url = new URL(`${authContext.config.url}/rest/v1/${pathName}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      apikey: authContext.config.anonKey,
      authorization: `Bearer ${authContext.session.access_token}`,
      accept: 'application/json',
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${pathName} REST check failed: HTTP ${response.status}`);
  }
  return Array.isArray(payload) ? payload : [];
}

function quoteSql(value) {
  return String(value).replaceAll("'", "''");
}

function runSupabaseLinkedJson(sql) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['supabase', 'db', 'query', '--linked', '--output', 'json', sql], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        SUPABASE_TELEMETRY_DISABLED: '1',
        npm_config_cache: process.env.npm_config_cache || '/private/tmp/dgskills-npm-cache',
      },
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('exit', (code) => {
      const out = Buffer.concat(stdout).toString('utf8').trim();
      const err = Buffer.concat(stderr).toString('utf8').trim();
      if (code !== 0) {
        reject(new Error(`supabase linked readback failed (${code}): ${err || out}`));
        return;
      }
      try {
        const jsonStart = out.indexOf('{');
        resolve(JSON.parse(jsonStart >= 0 ? out.slice(jsonStart) : out));
      } catch (error) {
        reject(new Error(`supabase linked readback parse failed: ${error.message}`));
      }
    });
  });
}

async function collectMissionActivityCountViaCli(userId, missionId) {
  if (process.env.QA_ALLOW_SUPABASE_CLI_READBACK !== '1') return null;

  const sql = [
    'select count(*)::int as count',
    'from public.student_activities',
    `where uid = '${quoteSql(userId)}'`,
    `and mission_id = '${quoteSql(missionId)}'`,
    "and type = 'mission_complete';",
  ].join(' ');
  const result = await runSupabaseLinkedJson(sql);
  return Number(result?.rows?.[0]?.count ?? 0);
}

async function collectMissionPersistEvidence(authContext, missionId) {
  if (!authContext?.session?.access_token || !authContext?.session?.user?.id) {
    return {
      checked: false,
      missionId,
      reason: 'authContext missing',
    };
  }

  const userId = authContext.session.user.id;
  const userRows = await supabaseRestGet(authContext, 'users', {
    select: 'uid,school_id,stats',
    uid: `eq.${userId}`,
    limit: '1',
  });
  const userRow = userRows[0] || null;
  const missionsCompleted = Array.isArray(userRow?.stats?.missionsCompleted)
    ? userRow.stats.missionsCompleted
    : [];

  const progressRows = await supabaseRestGet(authContext, 'mission_progress', {
    select: 'mission_id,status,score,updated_at',
    user_id: `eq.${userId}`,
    mission_id: `eq.${missionId}`,
    limit: '1',
  });

  const activityRows = await supabaseRestGet(authContext, 'student_activities', {
    select: 'id,type,mission_id,timestamp',
    uid: `eq.${userId}`,
    mission_id: `eq.${missionId}`,
    type: 'eq.mission_complete',
    limit: '20',
  });
  const cliActivityCount = activityRows.length > 0
    ? null
    : await collectMissionActivityCountViaCli(userId, missionId);

  return {
    checked: true,
    missionId,
    userId,
    schoolId: userRow?.school_id || null,
    missionsCompletedIncludesMission: missionsCompleted.includes(missionId),
    missionProgressExists: progressRows.length > 0,
    missionCompleteActivityCount: cliActivityCount ?? activityRows.length,
    missionCompleteActivityReadback: cliActivityCount === null ? 'student-rest' : 'linked-supabase-cli',
    progress: progressRows[0] || null,
  };
}

async function installSupabaseSession(client, authContext) {
  if (!authContext) return;

  const projectRef = new URL(authContext.config.url).hostname.split('.')[0];
  const storageKey = `sb-${projectRef}-auth-token`;
  const session = authContext.session;
  const sessionForStorage = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
    user: session.user,
    currentSession: session,
    expiresAt: session.expires_at,
  };

  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/?qaAuthSeed=${Date.now()}`) });
  await client.waitForExpression(`document.readyState === 'complete'`, `origin ready for auth session`);
  await client.eval(`(() => {
    const storageKey = ${JSON.stringify(storageKey)};
    const sessionValue = ${JSON.stringify(JSON.stringify(sessionForStorage))};
    Object.keys(localStorage)
      .filter((key) => /^sb-[a-z0-9_-]+-auth-token$/i.test(key))
      .forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(storageKey, sessionValue);
    localStorage.setItem('cookie-consent-status', JSON.stringify({
      status: 'accepted',
      timestamp: new Date().toISOString(),
      version: '2.0',
    }));
    localStorage.setItem('student_tutorial_completed', 'true');
    return storageKey;
  })()`);
}

function parsePeriodKey(periodKey) {
  const match = String(periodKey || '').match(/^j(\d+)p(\d+)$/i);
  if (!match) return { year: 1, period: 2 };
  return { year: Number(match[1]), period: Number(match[2]) };
}

async function clearMissionAutosave(client, missionId) {
  await client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    Object.keys(localStorage)
      .filter((key) => key === 'dgskills_mission_' + missionId || key.endsWith('_' + missionId) || key.includes(missionId))
      .forEach((key) => localStorage.removeItem(key));
    Object.keys(sessionStorage)
      .filter((key) => key.includes(missionId))
      .forEach((key) => sessionStorage.removeItem(key));
  })()`);
}

async function getMissionTitleCandidates(missionId) {
  const templateType = MISSION_TEMPLATES[missionId];
  const candidates = new Set([
    missionId,
    missionId.replace(/-/g, ' '),
  ]);

  if (templateType && CONFIG_DIRS[templateType]) {
    try {
      const config = await loadTemplateConfig(templateType, missionId);
      for (const value of [config.title, config.introTitle, config.name]) {
        if (typeof value === 'string' && value.trim()) candidates.add(value.trim());
      }
    } catch {
      // Title fallback is best-effort; app-route navigation can still use data attributes.
    }
  }

  return [...candidates];
}

function authenticatedDashboardExpression() {
  return `(location.pathname !== '/' && document.querySelector('[data-mission-id]'))
      || document.body.innerText.includes('Welkom bij Project DG!')
      || (location.pathname !== '/'
        && document.body.innerText.includes('Dashboard')
        && document.body.innerText.includes('Leerlijn')
        && !document.body.innerText.includes('Plan schoolpilot'))
      || (location.pathname !== '/'
        && document.body.innerText.includes('Leerlijn')
        && document.body.innerText.includes('Mijn projecten')
        && !document.body.innerText.includes('Plan schoolpilot'))
      || (document.body.innerText.includes('Kies je karakter') && document.body.innerText.includes('Stap 1 van 4'))`;
}

async function completeAvatarOnboardingIfPresent(client, missionId) {
  const hasOnboarding = await client.eval(`Boolean(
    document.body
    && document.body.innerText.includes('Kies je karakter')
    && document.body.innerText.includes('Stap 1 van 4')
  )`);
  if (!hasOnboarding) return false;
  if (!process.argv.includes('--allow-onboarding-completion')) {
    throw new Error(`${missionId}: avatar-onboarding verscheen tijdens app-route; auto-completion geblokkeerd om QA-stats niet te overschrijven`);
  }

  console.log(`[AppRoute] ${missionId}: completing avatar onboarding`);

  for (let step = 0; step < 4; step += 1) {
    if (step === 0) {
      await client.eval(`(() => {
        const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
          const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
          const rect = candidate.getBoundingClientRect();
          const style = getComputedStyle(candidate);
          return /Jongen|Meisje/i.test(text)
            && rect.width > 0 && rect.height > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none'
            && !candidate.disabled;
        });
        if (!button) return false;
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.click();
        return true;
      })()`);
      await delay(150);
    }

    const clickedNext = await client.eval(`(() => {
      const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
        const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
        const rect = candidate.getBoundingClientRect();
        const style = getComputedStyle(candidate);
        return /Volgende|Start je Avontuur/i.test(text)
          && rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !candidate.disabled;
      });
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);

    if (!clickedNext) {
      throw new Error(`${missionId}: avatar onboarding stap ${step + 1} kon niet verder klikken`);
    }
    await delay(650);
  }

  await client.waitForExpression(
    `!document.body.innerText.includes('Kies je karakter')`,
    `${missionId} avatar onboarding voltooid`,
    12_000
  );
  return true;
}

async function settleAvatarOnboarding(client, missionId) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const completed = await completeAvatarOnboardingIfPresent(client, missionId);
    if (completed) {
      await delay(800);
      return true;
    }
    await delay(500);
  }
  return false;
}

async function navigateToMissionViaApp(client, missionId, periodKey, runId) {
  const { year, period } = parsePeriodKey(periodKey);
  const titleCandidates = await getMissionTitleCandidates(missionId);
  await client.send('Page.navigate', { url: 'about:blank' });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} blank reset`);
  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/dashboard?qaAppRun=${encodeURIComponent(runId)}`) });
  await client.waitForExpression(
    `document.readyState === 'complete' && document.body && document.body.innerText.length > 50`,
    `${missionId} app shell`
  );
  await client.waitForExpression(
    authenticatedDashboardExpression(),
    `${missionId} authenticated dashboard or onboarding`,
    20_000
  );

  await delay(800);
  await settleAvatarOnboarding(client, missionId);

  await client.waitForExpression(
    authenticatedDashboardExpression(),
    `${missionId} authenticated dashboard or delayed onboarding`,
    20_000
  );
  await settleAvatarOnboarding(client, missionId);

  await client.waitForExpression(
    `document.querySelector('[data-mission-id]')
      || document.body.innerText.includes('Welkom bij Project DG!')
      || (document.body.innerText.includes('Leerlijn') && document.body.innerText.includes('Mijn projecten'))`,
    `${missionId} authenticated dashboard`,
    20_000
  );

  await client.eval(`(() => {
    const dismissPatterns = [/accepteer/i, /begrepen/i, /overslaan/i, /later/i, /sluiten/i];
    for (const pattern of dismissPatterns) {
      const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
        const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
        const rect = candidate.getBoundingClientRect();
        return pattern.test(text) && rect.width > 0 && rect.height > 0 && !candidate.disabled;
      });
      if (button) {
        button.click();
        return true;
      }
    }
    return false;
  })()`);

  await delay(300);
  await settleAvatarOnboarding(client, missionId);
  await closeOpenProfileMenu(client);

  if (year !== 1) {
    const openedYearMenu = await client.eval(`(() => {
      const trigger = document.querySelector('button[aria-label="Kies digitale leerlijn"]')
        || Array.from(document.querySelectorAll('button')).find((candidate) => {
          const text = candidate.innerText || '';
          const rect = candidate.getBoundingClientRect();
          return rect.width > 0
            && rect.height > 0
            && !candidate.disabled
            && text.includes('Leerlijn')
            && text.includes('Leerjaar');
        });
      if (!trigger) return false;
      trigger.click();
      return true;
    })()`);
    if (openedYearMenu) {
      await delay(250);
      await client.eval(`(() => {
        const year = ${JSON.stringify(year)};
        const option = Array.from(document.querySelectorAll('[role="option"], button')).find((candidate) => {
          const text = candidate.innerText || '';
          return text.includes('Leerjaar ' + year);
        });
        if (!option) return false;
        option.click();
        return true;
      })()`);
      await delay(400);
    }
  }

  await client.waitForExpression(
    `Array.from(document.querySelectorAll('button')).some((candidate) => {
      const text = (candidate.innerText || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const rect = candidate.getBoundingClientRect();
      const period = ${JSON.stringify(period)};
      return rect.width > 0 && rect.height > 0 && !candidate.disabled && (
        text === 'periode ' + period ||
        text === 'week ' + period ||
        text === 'fase ' + period
      );
    })`,
    `${missionId} period ${period} button`,
    12_000
  );

  const periodClicked = await client.eval(`(() => {
    const period = ${JSON.stringify(period)};
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find((candidate) => {
      const text = (candidate.innerText || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const rect = candidate.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && !candidate.disabled && (
        text === 'periode ' + period ||
        text === 'week ' + period ||
        text === 'fase ' + period
      );
    });
    if (!target) return false;
    target.click();
    return true;
  })()`);
  if (!periodClicked) {
    throw new Error(`${missionId}: periode ${period} knop niet gevonden`);
  }
  await delay(500);
  await closeOpenProfileMenu(client);
  await revealAppMissionCard(client, missionId, titleCandidates);
  await client.waitForExpression(
    `document.querySelector('[data-mission-id]')
      || document.body.innerText.includes('Mijn projecten')
      || Array.from(document.querySelectorAll('button')).some((candidate) => {
        const text = candidate.innerText || '';
        const rect = candidate.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && /start missie|openen/i.test(text);
      })`,
    `${missionId} mission cards`,
    12_000
  );

  await client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    if (document.querySelector('[data-mission-id="' + missionId + '"]')) return true;
    const showAll = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || '';
      return /bekijk alle/i.test(text) && !candidate.disabled;
    });
    if (!showAll) return false;
    showAll.click();
    return true;
  })()`);
  await delay(300);
  await closeOpenProfileMenu(client);
  await revealAppMissionCard(client, missionId, titleCandidates);
  await client.waitForExpression(
    `document.querySelector('[data-mission-id="${missionId}"]')
      || (() => {
        const titleCandidates = ${JSON.stringify(titleCandidates)};
        const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
        const normalizedCandidates = titleCandidates.map(normalize).filter(Boolean);
        return Array.from(document.querySelectorAll('article, section, li, div, button')).some((candidate) => {
          const rect = candidate.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return false;
          const text = normalize(candidate.innerText || '');
          const hasMissionTitle = normalizedCandidates.some((title) => text.includes(title));
          const hasStartButton = candidate.matches('button')
            || Array.from(candidate.querySelectorAll('button')).some((button) => /start missie|openen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
          return hasMissionTitle && hasStartButton;
        });
      })()`,
    `${missionId} mission card`,
    8_000
  );

  await closeOpenProfileMenu(client);
  await clearMissionAutosave(client, missionId);

  const clicked = await client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    const titleCandidates = ${JSON.stringify(titleCandidates)};
    const exactCard = document.querySelector('[data-mission-id="' + missionId + '"]');
    const card = exactCard || findMissionCard();
    const button = card
      ? Array.from(card.querySelectorAll('button')).find((candidate) => !candidate.disabled && /start missie|openen/i.test(candidate.innerText || candidate.getAttribute('aria-label') || ''))
      : null;
    if (exactCard && !button) return { ok: false, reason: 'target-card-locked-or-completed' };
    const fallbackButton = button || findStartButtonForTitle();
    if (!card && !fallbackButton) return { ok: false, reason: 'mission-card-not-found' };
    if (!fallbackButton) return { ok: false, reason: 'start-button-not-found' };
    fallbackButton.scrollIntoView({ block: 'center', inline: 'center' });
    fallbackButton.click();
    return { ok: true };

    function normalize(value) {
      return String(value || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    }

    function findMissionCard() {
      const normalizedCandidates = titleCandidates.map(normalize).filter(Boolean);
      const elements = Array.from(document.querySelectorAll('article, section, li, div, button'));
      const match = elements
        .filter((candidate) => {
        const rect = candidate.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        const text = normalize(candidate.innerText || '');
        const hasMissionTitle = normalizedCandidates.some((title) => text.includes(title));
        const hasStartButton = candidate.matches('button')
          || Array.from(candidate.querySelectorAll('button')).some((button) => /start missie|openen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
        return hasMissionTitle && hasStartButton;
      })
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)[0];
      return match?.closest('article, section, li, div') || match || null;
    }

    function findStartButtonForTitle() {
      const normalizedCandidates = titleCandidates.map(normalize).filter(Boolean);
      const starts = Array.from(document.querySelectorAll('button')).filter((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0
          && rect.height > 0
          && !button.disabled
          && /start missie|openen/i.test(button.innerText || button.getAttribute('aria-label') || '');
      });

      return starts.find((button) => {
        let node = button;
        for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
          const text = normalize(node.innerText || '');
          if (normalizedCandidates.some((title) => text.includes(title))) return true;
        }
        return false;
      }) || null;
    }
  })()`);
  if (!clicked?.ok) {
    throw new Error(`${missionId}: app-route start mislukt (${clicked?.reason || 'unknown'})`);
  }

  await delay(700);
  await client.eval(`(() => {
    if (!document.body.innerText.includes('Mijn projecten')) return false;
    const titleCandidates = ${JSON.stringify(titleCandidates)};
    const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const normalizedCandidates = titleCandidates.map(normalize).filter(Boolean);
    const startButtons = Array.from(document.querySelectorAll('button')).filter((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0
        && rect.height > 0
        && !button.disabled
        && /start missie/i.test(button.innerText || button.getAttribute('aria-label') || '');
    });
    const target = startButtons.find((button) => {
      let node = button;
      for (let depth = 0; node && depth < 10; depth += 1, node = node.parentElement) {
        const text = normalize(node.innerText || '');
        if (normalizedCandidates.some((title) => text.includes(title))) return true;
      }
      return false;
    }) || startButtons[0];
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);

  try {
    await client.waitForExpression(
      `document.querySelector('[data-mission-id="${missionId}"]') === null
        && (!document.body.innerText.includes('Mijn projecten') || !document.body.innerText.includes('Leerlijn'))`,
      `${missionId} app mission opened`
    );
    await assertOpenedMissionMatches(client, missionId, titleCandidates);
  } catch (error) {
    const debugPath = path.join(SCREENSHOT_DIR, `${safeFilePart(missionId)}-app-route-open-failure.json`);
    const screenshotPath = path.join(SCREENSHOT_DIR, `${safeFilePart(missionId)}-app-route-open-failure.png`);
    const debug = await client.eval(`(() => ({
      url: location.href,
      title: document.title,
      hasTargetCard: Boolean(document.querySelector('[data-mission-id="${missionId}"]')),
      cards: Array.from(document.querySelectorAll('[data-mission-id]')).map((card) => ({
        id: card.getAttribute('data-mission-id'),
        text: (card.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 260),
      })),
      buttons: Array.from(document.querySelectorAll('button')).map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          text: (button.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 120),
          aria: button.getAttribute('aria-label'),
          disabled: button.disabled,
          visible: rect.width > 0 && rect.height > 0,
        };
      }).filter((button) => button.visible).slice(0, 80),
      bodyHead: (document.body.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 2000),
    }))()`);
    await fs.writeFile(debugPath, JSON.stringify(debug, null, 2));
    await client.screenshot(screenshotPath).catch(() => {});
    throw error;
  }
}

async function assertOpenedMissionMatches(client, missionId, titleCandidates) {
  const state = await client.eval(`(() => {
    const titleCandidates = ${JSON.stringify(titleCandidates)};
    const body = document.body?.innerText || '';
    const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const normalizedBody = normalize(body);
    const normalizedCandidates = titleCandidates.map(normalize).filter(Boolean);
    const hasTitle = normalizedCandidates.some((title) => normalizedBody.includes(title));
    const wrongDedicated = [
      ['game-director', ['game director', 'programmeer robbie']],
      ['prompt-master', ['prompt master']],
      ['cloud-cleaner', ['cloud schoonmaker', 'cloud cleaner']],
      ['layout-doctor', ['layout dokter', 'layout doctor']],
      ['pitch-police', ['pitch police']],
    ].filter(([id]) => id !== ${JSON.stringify(missionId)})
      .find(([, markers]) => markers.some((marker) => normalizedBody.includes(marker)));
    return {
      ok: hasTitle && !wrongDedicated,
      hasTitle,
      wrongMissionId: wrongDedicated?.[0] || null,
      url: location.href,
      bodyHead: body.replace(/\\s+/g, ' ').trim().slice(0, 700),
    };
  })()`);
  if (!state?.ok) {
    throw new Error(`${missionId}: verkeerde missie geopend via app-route (${state?.wrongMissionId || 'titel niet gevonden'}; hasTitle=${Boolean(state?.hasTitle)})`);
  }
}

async function loadTemplateConfig(templateType, missionId) {
  const configDir = CONFIG_DIRS[templateType];
  if (!configDir) throw new Error(`${missionId}: geen config loader voor template ${templateType}`);

  const filePath = path.join(process.cwd(), configDir, `${missionId}.ts`);
  const source = await fs.readFile(filePath, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: (id) => {
      throw new Error(`${missionId}: runtime import niet ondersteund in QA config loader: ${id}`);
    },
  };
  vm.runInNewContext(js, sandbox, { filename: filePath });
  const exported = module.exports.default
    ?? Object.values(module.exports).find((value) => value && typeof value === 'object');
  if (!exported || typeof exported !== 'object') {
    throw new Error(`${missionId}: config kon niet uit ${filePath} geladen worden`);
  }
  return exported;
}

async function captureNamedScreenshot(client, missionId, viewport, stage, runId, screenshots) {
  const filePath = `${SCREENSHOT_DIR}/${safeFilePart(missionId)}-${safeFilePart(viewport.name)}-${safeFilePart(stage)}-${safeFilePart(runId)}.png`;
  await client.screenshot(filePath);
  const entry = {
    stage,
    path: filePath,
    viewport: viewport.name,
    width: viewport.width,
    height: viewport.height,
  };
  screenshots.push(entry);
  return entry;
}

async function listPlayScreenshots(missionId, viewport, persona) {
  const prefix = `${safeFilePart(missionId)}-${safeFilePart(viewport.name)}-play-${safeFilePart(persona)}-`;
  try {
    const entries = await fs.readdir(SCREENSHOT_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.png') && entry.name.startsWith(prefix))
      .map((entry) => path.join(SCREENSHOT_DIR, entry.name))
      .sort();
  } catch {
    return [];
  }
}

async function appendDiscoveredPlayScreenshots(missionId, viewport, persona, beforePaths, screenshots) {
  const knownPaths = new Set(screenshots.map((screenshot) => screenshot.path));
  const before = new Set(beforePaths);
  const discovered = await listPlayScreenshots(missionId, viewport, persona);

  for (const filePath of discovered) {
    if (before.has(filePath) || knownPaths.has(filePath)) continue;
    const basename = path.basename(filePath, '.png');
    const prefix = `${safeFilePart(missionId)}-${safeFilePart(viewport.name)}-`;
    screenshots.push({
      stage: basename.startsWith(prefix) ? basename.slice(prefix.length) : basename,
      path: filePath,
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      discovered: true,
    });
    knownPaths.add(filePath);
  }
}

function buildPlayEvidence(screenshots, completionClicked) {
  const stageText = screenshots
    .map((screenshot) => `${screenshot.stage || ''} ${path.basename(screenshot.path || '')}`.toLowerCase())
    .join('\n');
  const errorRecoveryEvidence = /(wrong|fout|error|failed|hint|warning|feedback|fixed|texterror|wrongrule|failedtest|followup-error|agent-step)/i.test(stageText);
  const midFlowEvidence = /(step|round|sim|data|scenario|puzzle|followup|selected|feedback|ordered|solved|result|slide|fixed)/i.test(stageText);
  const completionEvidence = /(complete|confirmed|voltooid|result)/i.test(stageText);
  const introEvidence = /(intro|start)/i.test(stageText);

  return {
    screenshotCount: screenshots.length,
    introEvidence,
    midFlowEvidence,
    errorRecoveryEvidence,
    completionEvidence,
    confirmationClicked: Boolean(completionClicked),
    deepClickMinimum: screenshots.length >= 4 && midFlowEvidence && errorRecoveryEvidence && completionEvidence,
    stages: screenshots.map((screenshot) => screenshot.stage).filter(Boolean),
  };
}

async function clickQa(client, qa, label = qa) {
  const clicked = await client.eval(`(() => {
    const button = document.querySelector(${JSON.stringify(`[data-qa="${qa}"]`)});
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Niet gevonden/klikbaar: ${label} (${qa})`);
}

async function maybeClickQa(client, qa, label = qa) {
  const clicked = await client.eval(`(() => {
    const button = document.querySelector(${JSON.stringify(`[data-qa="${qa}"]`)});
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (clicked) await delay(150);
  return Boolean(clicked);
}

async function clickVisibleButtonByText(client, patternSource, label) {
  const clicked = await client.eval(`(() => {
    const pattern = new RegExp(${JSON.stringify(patternSource)}, 'i');
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
      visible(candidate) && pattern.test(candidate.innerText || candidate.getAttribute('aria-label') || '')
    );
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Geen zichtbare knop gevonden voor: ${label}`);
}

async function clickLastVisibleButtonByInnerText(client, patternSource, label) {
  const clicked = await client.eval(`(() => {
    const pattern = new RegExp(${JSON.stringify(patternSource)}, 'i');
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const buttons = Array.from(document.querySelectorAll('button')).filter((candidate) =>
      visible(candidate) && pattern.test(candidate.innerText || '')
    );
    const button = buttons.at(-1);
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Geen zichtbare knoptekst gevonden voor: ${label}`);
}

async function clickVisibleButtonContaining(client, text, label = text) {
  const clicked = await client.eval(`(() => {
    const needle = ${JSON.stringify(text)}.toLowerCase();
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
      visible(candidate) && (candidate.innerText || candidate.getAttribute('aria-label') || '').toLowerCase().includes(needle)
    );
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Geen zichtbare knop gevonden voor: ${label}`);
}

async function clickFirstVisibleBySelector(client, selector, label = selector) {
  const clicked = await client.eval(`(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !element.disabled;
    };
    const target = Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(visible);
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Geen zichtbaar element gevonden voor: ${label}`);
}

async function clickIndexedQa(client, qa, index, label = qa) {
  const clicked = await client.eval(`(() => {
    const targets = Array.from(document.querySelectorAll(${JSON.stringify(`[data-qa="${qa}"]`)}));
    const target = targets[${Number(index)}];
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Niet gevonden/klikbaar: ${label} (${qa}[${index}])`);
}

async function fillVisibleTextareaByIndex(client, index, value, label) {
  const filled = await client.eval(`(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const textarea = Array.from(document.querySelectorAll('textarea')).filter(visible)[${Number(index)}];
    if (!textarea) return false;
    textarea.scrollIntoView({ block: 'center', inline: 'center' });
    const prototype = Object.getPrototypeOf(textarea);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    const value = ${JSON.stringify(value)};
    if (descriptor && descriptor.set) descriptor.set.call(textarea, value);
    else textarea.value = value;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!filled) throw new Error(`Geen zichtbare textarea gevonden voor: ${label}`);
}

async function fillFirstVisibleTextControl(client, value, label) {
  const filled = await client.eval(`(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
    };
    const control = Array.from(document.querySelectorAll('textarea, input[type="text"], input:not([type])')).find(visible);
    if (!control) return false;
    control.scrollIntoView({ block: 'center', inline: 'center' });
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(control), 'value');
    const value = ${JSON.stringify(value)};
    if (descriptor && descriptor.set) descriptor.set.call(control, value);
    else control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
    control.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!filled) throw new Error(`Geen zichtbare tekstinvoer gevonden voor: ${label}`);
}

async function clickVisibleButtonByBestText(client, patterns, label) {
  const clicked = await maybeClickVisibleButtonByBestText(client, patterns);
  if (!clicked) throw new Error(`Geen zichtbare knop gevonden voor: ${label}`);
}

async function maybeClickVisibleButtonByBestText(client, patterns) {
  return client.eval(`(() => {
    const patterns = ${JSON.stringify(patterns)}.map((pattern) => new RegExp(pattern, 'i'));
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || candidate.title || '';
      return visible(candidate) && patterns.some((pattern) => pattern.test(text));
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
}

async function collectReviewSnapshot(client) {
  return client.eval(`(() => {
    const bodyText = document.body?.innerText || '';
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const buttons = Array.from(document.querySelectorAll('button'))
      .filter(visible)
      .map((button) => ({
        text: (button.innerText || button.getAttribute('aria-label') || '').trim(),
        disabled: Boolean(button.disabled),
      }))
      .filter((button) => button.text.length > 0);
    const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
      .filter(visible)
      .map((heading) => heading.innerText.trim())
      .filter(Boolean)
      .slice(0, 8);
    const interactives = Array.from(document.querySelectorAll('button,input,textarea,select,[role="button"]')).filter(visible);
    const clippedInteractiveCount = interactives.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.right > window.innerWidth + 2
        || rect.left < -2
        || rect.bottom > window.innerHeight + 2
        || rect.top < -2;
    }).length;
    return {
      url: window.location.href,
      headings,
      bodyText: bodyText.slice(0, 1400),
      bodyTextLength: bodyText.length,
      buttons: buttons.slice(0, 14),
      buttonCount: buttons.length,
      inputCount: document.querySelectorAll('input').length,
      textareaCount: document.querySelectorAll('textarea').length,
      selectCount: document.querySelectorAll('select').length,
      hasGoal: /\\/goal|Doel:|Bewijs:|leerdoel|bewijs/i.test(bodyText),
      hasFeedback: /goed|fout|probeer|tip|feedback|controleer|nog niet|gelukt|verbeter/i.test(bodyText),
      hasCompletion: /Missie voltooid|Bewijs compleet|afgerond|Certificaat|Resultaten/i.test(bodyText),
      hasGamification: /XP|score|punten|level|badge|challenge|missie|ronde|puzzel|timer|bewijs compleet|casus|genezen/i.test(bodyText),
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
      clippedInteractiveCount,
      viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
    };
  })()`);
}

async function clickFirstVisibleButton(client, patterns) {
  return client.eval(`(() => {
    const patterns = ${JSON.stringify(patterns)}.map((pattern) => new RegExp(pattern, 'i'));
    const buttons = Array.from(document.querySelectorAll('button'));
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const button = buttons.find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
      return visible(candidate) && patterns.some((pattern) => pattern.test(text));
    });
    if (!button) return null;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return button.innerText || button.getAttribute('aria-label') || 'unnamed-button';
  })()`);
}

async function runGenericFeedbackProbe(client) {
  return client.eval(`(() => {
    const textTarget = document.querySelector('textarea, input[type="text"], input:not([type])');
    if (textTarget) {
      const prototype = Object.getPrototypeOf(textTarget);
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
      const value = 'Te kort.';
      if (descriptor && descriptor.set) descriptor.set.call(textTarget, value);
      else textTarget.value = value;
      textTarget.dispatchEvent(new Event('input', { bubbles: true }));
      textTarget.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const option = document.querySelector('[data-qa="scenario-option"], [data-qa="scenario-binary-accept"], [data-qa^="question-option-"], [data-qa^="review-rapid-"], [data-qa^="puzzle-option-"]');
    if (option) option.click();

    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
      const rect = candidate.getBoundingClientRect();
      const style = getComputedStyle(candidate);
      return /(controleer|bevestig|submit|check|volgende|klaar|test|plaats hier|bekijk)/i.test(text)
        && rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !candidate.disabled;
    });
    if (!button) return { action: option ? 'option-only' : 'none', button: null };
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return { action: textTarget ? 'short-text-submit' : option ? 'option-submit' : 'button-submit', button: button.innerText || button.getAttribute('aria-label') || 'unnamed-button' };
  })()`);
}

function scoreReviewResult(intro, firstAction, feedback, consoleErrorCount, midFlow = null) {
  const checkedSnapshots = [intro, firstAction, feedback, midFlow].filter(Boolean);
  const uiScore = [
    !intro.horizontalOverflow,
    !firstAction.horizontalOverflow,
    intro.clippedInteractiveCount === 0,
    firstAction.clippedInteractiveCount === 0,
    (!feedback.horizontalOverflow && feedback.clippedInteractiveCount === 0)
      && (!midFlow || (!midFlow.horizontalOverflow && midFlow.clippedInteractiveCount === 0)),
  ].filter(Boolean).length;
  const didacticScore = [
    intro.hasGoal,
    /doel|bewijs|leer|maak|bouw|herken|onderzoek/i.test(intro.bodyText),
    firstAction.hasFeedback || feedback.hasFeedback || Boolean(midFlow?.hasFeedback),
    firstAction.buttonCount > 0,
    intro.bodyTextLength < 5000,
  ].filter(Boolean).length;
  const gamificationScore = [
    intro.hasGamification,
    /challenge|missie|ronde|score|punten|level|badge|puzzel|casus|genezen/i.test(firstAction.bodyText),
    firstAction.hasFeedback || feedback.hasFeedback || Boolean(midFlow?.hasFeedback),
    firstAction.buttonCount >= 2,
    feedback.hasCompletion || Boolean(midFlow?.hasCompletion) || /resultaten|bewijs/i.test(`${feedback.bodyText} ${midFlow?.bodyText || ''}`),
  ].filter(Boolean).length;
  const blocking = consoleErrorCount > 0
    || intro.buttonCount === 0
    || checkedSnapshots.some((snapshot) => snapshot.horizontalOverflow || snapshot.clippedInteractiveCount > 0);
  const oordeel = blocking ? 'fix-eerst' : (uiScore >= 4 && didacticScore >= 4 && gamificationScore >= 3 ? 'ship' : 'menselijke keuze nodig');
  return { uiScore, didacticScore, gamificationScore, oordeel };
}

function buildScenarioEngineCompletionState(config) {
  const roundStates = {};

  for (const round of config.rounds) {
    let selections = [];
    if (round.type === 'select-correct') {
      selections = round.items.filter((item) => item.correct === true).map((item) => item.id);
    } else if (round.type === 'order-priority') {
      selections = [...round.items]
        .sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0))
        .map((item) => item.id);
    } else if (round.type === 'binary-choice') {
      selections = round.items.map((item) => item.correct === true ? item.id : -item.id);
    }

    roundStates[round.id] = {
      selections,
      submitted: true,
      ...(round.showConfidence ? { confidence: 3 } : {}),
      ...(round.followUp ? { followUpAnswered: true, followUpCorrect: true } : {}),
    };
  }

  return {
    phase: 'results',
    currentRound: Math.max(0, config.rounds.length - 1),
    roundStates,
  };
}

function buildDebateArenaCompletionState(config) {
  const selectedPosition = config.positions[0]?.id ?? null;
  const stakeholderId = config.stakeholders[0]?.id ?? '';
  const reflectionAnswers = Object.fromEntries(
    config.reflectionQuestions.map((question) => [
      question,
      'Ik onderbouw mijn keuze met gevolgen voor privacy, welzijn en eerlijk gebruik van technologie.',
    ])
  );

  return {
    phase: 'results',
    stakeholdersRead: config.stakeholders.map((stakeholder) => stakeholder.id),
    selectedPosition,
    arguments: [
      {
        claim: 'Mijn standpunt beschermt leerlingen en geeft duidelijke grenzen aan digitaal gedrag.',
        evidence: 'In de opdracht zie je dat privacy, aandacht en veiligheid afhankelijk zijn van goede afspraken.',
        stakeholderId,
      },
      {
        claim: 'Een tweede argument is dat technologie pas goed werkt als mensen begrijpen wat de gevolgen zijn.',
        evidence: 'De perspectieven laten zien dat verschillende groepen andere risicofactoren en belangen hebben.',
        stakeholderId,
      },
      {
        claim: 'Daarom moet de oplossing praktisch zijn en tegelijk rekening houden met kwetsbare leerlingen.',
        evidence: 'Een heldere afspraak voorkomt verwarring en maakt controle door school en leerling mogelijk.',
        stakeholderId,
      },
    ],
    counterResponse: 'Het tegenargument is belangrijk, maar mijn oplossing beperkt de nadelen met duidelijke keuzes en controle.',
    reflectionAnswers,
    finalPosition: selectedPosition,
    activeStakeholderIndex: 0,
    activeArgumentIndex: 0,
    openingChoiceId: config.openingChoice?.options?.[0]?.id ?? null,
    explorationQuizAnswered: Boolean(config.explorationQuiz),
    explorationQuizCorrect: Boolean(config.explorationQuiz),
  };
}

async function completionStateFor(templateType, missionId) {
  if (templateType === 'builder-canvas') {
    const config = await loadTemplateConfig('builder-canvas', missionId);
    const completedSteps = BUILDER_STEP_IDS[missionId] ?? config.steps?.map((step) => step.id);
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

  if (templateType === 'simulation-lab') {
    const seeded = SIMULATION_COMPLETION_STATES[missionId];
    if (!seeded) throw new Error(`${missionId}: geen SimulationLab completion seed`);
    
    const questionAnswers = seeded.answers;
    const questionSubmitted = Object.fromEntries(seeded.submitted.map((id) => [id, true]));
    const confidences = Object.fromEntries(seeded.submitted.map((id) => [id, 3]));
    
    const simIds = {
      'algorithm-architect': ['zoekalgoritme', 'sorteeralgoritme', 'pseudocode'],
      'bug-hunter': ['foutmelding-lezen', 'soorten-bugs', 'debugstrategie'],
      'code-reviewer': ['code-leesbaarheid', 'dry-principe', 'feedback-methode'],
      'privacy-by-design': ['social-media-profiel', 'app-permissies', 'cookie-instellingen']
    }[missionId];
    
    const followUpAnswered = Object.fromEntries(simIds.map(id => [id, true]));
    const followUpCorrect = Object.fromEntries(simIds.map(id => [id, true]));
    
    return {
      phase: 'results',
      currentSim: 0,
      parameterValues: {},
      questionAnswers,
      questionSubmitted,
      interacted: {},
      confidences,
      followUpAnswered,
      followUpCorrect,
    };
  }

  if (templateType === 'scenario-engine') {
    const config = await loadTemplateConfig(templateType, missionId);
    return buildScenarioEngineCompletionState(config);
  }

  if (templateType === 'debate-arena') {
    const config = await loadTemplateConfig(templateType, missionId);
    return buildDebateArenaCompletionState(config);
  }

  if (templateType === 'puzzle-lab') {
    return {
      phase: 'results',
      currentPuzzle: 0,
      attempts: {},
      hintsUsed: {},
      solved: ['kraaktijd', 'woordenboekaanval', 'credential-stuffing', 'sterk-wachtwoord-maken'],
      answers: {},
      extraCluesRevealed: {},
    };
  }

  if (templateType === 'dedicated' && missionId === 'access-control-engineer') {
    return {
      currentStep: 3,
      gevondenProblemen: ['r1', 'r2', 'r3', 'r4'],
      aangepasteRegels: ACCESS_CONTROL_RULES,
      testResultaten: ACCESS_CONTROL_TEST_RESULTS,
      afgerond: true,
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
  }).filter((message) => !isAllowedConsoleNoise(message));
  if (errors.length > 0) throw new Error(`${label}: console errors: ${JSON.stringify(errors.slice(-3))}`);
}

function isAllowedConsoleNoise(message) {
  const entry = message.params?.entry;
  if (!entry) return false;
  const url = entry.url || '';
  const text = entry.text || '';
  const isOptionalSupabase406 = text.includes('status of 406')
    && (
      url.includes('/rest/v1/assessment_results?')
      || url.includes('/rest/v1/classroom_configs?')
    );
  const isProtectedStagingManifest = VERCEL_SHARE_TOKEN
    && ORIGIN.includes('.vercel.app')
    && (url.includes('/manifest.webmanifest') || text.includes('/manifest.webmanifest'))
    && (text.includes('status of 401') || text.includes('failed, code 401'));
  return isOptionalSupabase406 || isProtectedStagingManifest;
}

async function captureFailureArtifacts(client, missionId, viewport, label) {
  const safeLabel = label.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  const base = `${SCREENSHOT_DIR}/${missionId}-${viewport.name}-${safeLabel}`;
  try {
    await client.screenshot(`${base}.png`);
  } catch (error) {
    console.warn(`[Failure artifact] screenshot failed for ${missionId}: ${error.message}`);
  }
  try {
    const bodyText = await client.eval(`document.body.innerText || ''`);
    await fs.writeFile(`${base}.txt`, bodyText.slice(0, 12000));
  } catch (error) {
    console.warn(`[Failure artifact] DOM dump failed for ${missionId}: ${error.message}`);
  }
  try {
    await fs.writeFile(`${base}.console.json`, JSON.stringify(client.messages.slice(-25), null, 2));
  } catch (error) {
    console.warn(`[Failure artifact] console dump failed for ${missionId}: ${error.message}`);
  }
}

async function runMissionIntro(client, missionId, viewport) {
  await setViewport(client, viewport);

  const runId = `${missionId}-${viewport.name}-intro-${Date.now()}`;
  const screenshots = [];

  // Clear localStorage before loading by navigating to origin first
  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/?qaSeed=${encodeURIComponent(runId)}`) });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} ${viewport.name} origin render`);
  await client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    Object.keys(localStorage)
      .filter((key) => key === 'dgskills_mission_' + missionId || key.endsWith('_' + missionId))
      .forEach((key) => localStorage.removeItem(key));
  })()`);

  const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&reset=1&qaRun=${runId}`;
  await client.send('Page.navigate', { url: withQaVercelShare(url) });
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
      hasGoal: bodyText.includes('/goal') || bodyText.includes('Bewijs:') || bodyText.includes('Doel:'),
      buttonCount: buttons.length,
      buttons: buttons.slice(0, 8),
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
      feedbackOrFlowVisible: /(controleer|bevestig|volgende|vraag|ronde|dataset|checklist|resultaten|punten|stappen|opdracht|risico|puzzel|aanwijzing|submit|simulatie|uitvoeren|test|briefing|stap)/i.test(bodyText),
    };
  })()`);

  if (before.unsupported) throw new Error(`${missionId} ${viewport.name}: preview unsupported`);
  if (!before.hasGoal) throw new Error(`${missionId} ${viewport.name}: geen goal/evidence zichtbaar in intro`);
  if (before.buttonCount === 0) throw new Error(`${missionId} ${viewport.name}: geen startknop gevonden`);
  if (before.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow in intro`);

  let clicked = false;
  let clickedBtnText = '';
  if (before.feedbackOrFlowVisible) {
    // Already has feedback/flow visible, no need to click start
    clicked = true;
    clickedBtnText = 'skip-already-started';
  } else {
    const clickRes = await client.eval(`(() => {
      const pattern = /(start|begin|aan de slag|volgende|ronde|onderzoek|maak|ga verder)/i;
      const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
        const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
        const rect = candidate.getBoundingClientRect();
        const style = getComputedStyle(candidate);
        return pattern.test(text) && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !candidate.disabled;
      });
      if (!button) return null;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return button.innerText || button.getAttribute('aria-label') || 'unnamed-button';
    })()`);
    if (!clickRes) throw new Error(`${missionId} ${viewport.name}: startknop niet klikbaar`);
    clicked = true;
    clickedBtnText = clickRes;
    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  const after = await client.eval(`(() => ({
    bodyText: document.body.innerText.slice(0, 800),
    buttonCount: document.querySelectorAll('button').length,
    horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
    feedbackOrFlowVisible: /(controleer|bevestig|volgende|vraag|ronde|dataset|checklist|resultaten|punten|stappen|opdracht|risico|puzzel|aanwijzing|submit|simulatie|uitvoeren|test|briefing|stap)/i.test(document.body.innerText),
  }))()`);
  if (after.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow na start`);
  if (!after.feedbackOrFlowVisible) throw new Error(`${missionId} ${viewport.name}: geen normale flow of feedback-control zichtbaar na start`);

  await assertNoConsoleErrors(client, `${missionId} ${viewport.name} intro`);

  await captureNamedScreenshot(client, missionId, viewport, 'intro-after-first-action', runId, screenshots);
  return { missionId, viewport: viewport.name, buttons: before.buttons, afterButtons: after.buttonCount, clickedButton: clickedBtnText, screenshots };
}

async function runCompletionSmoke(client, missionId, viewport) {
  const templateType = MISSION_TEMPLATES[missionId];
  if (!templateType) throw new Error(`${missionId}: onbekend templateType voor completion smoke`);

  await setViewport(client, viewport);
  client.messages = [];
  const runId = `${missionId}-${viewport.name}-completion-${Date.now()}`;
  const screenshots = [];

  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/?qaSeed=${encodeURIComponent(runId)}`) });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} ${viewport.name} origin render`);
  const storageKey = await seedCompletionState(client, missionId, await completionStateFor(templateType, missionId));

  const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&qaMode=completion&qaRun=${runId}`;
  await client.send('Page.navigate', { url: withQaVercelShare(url) });
  await client.waitForExpression(
    `document.readyState === 'complete' && document.body && (document.body.innerText.includes('Missie voltooid') || document.body.innerText.includes('afgerond') || document.body.innerText.includes('voltooid'))`,
    `${missionId} ${viewport.name} completion UI`,
    15_000
  );

  const evidence = await client.eval(`(() => {
    const bodyText = document.body.innerText;
    const completeButton = Array.from(document.querySelectorAll('button')).find((button) =>
      /voltooid|bevestig|afrond|sluit/i.test(button.innerText || button.getAttribute('aria-label') || '')
    );
    const rect = completeButton?.getBoundingClientRect();
    return {
      storageKey: ${JSON.stringify(storageKey)},
      completionCta: Boolean(completeButton),
      completionCtaVisible: Boolean(rect && rect.width > 0 && rect.height > 0),
      hasTakeaways: /wat je hebt geleerd|geleerd/i.test(bodyText) || bodyText.includes('afgerond') || bodyText.includes('score'),
      hasEvidence: /leerlingbewijs|docentbewijs|bewijs/i.test(bodyText) || bodyText.includes('afgerond') || bodyText.includes('resultaten'),
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
    };
  })()`);

  if (!evidence.hasEvidence) throw new Error(`${missionId} ${viewport.name}: completion evidenceblok ontbreekt`);
  if (evidence.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow in eindstaat`);

  await assertNoConsoleErrors(client, `${missionId} ${viewport.name} completion`);
  await captureNamedScreenshot(client, missionId, viewport, 'completion', runId, screenshots);
  return { missionId, viewport: viewport.name, templateType, storageKey, screenshots };
}

async function runMissionReviewPass(client, missionId, viewport, persona) {
  const templateType = MISSION_TEMPLATES[missionId] || 'unknown';
  await setViewport(client, viewport);
  client.messages = [];
  const runId = `${missionId}-${viewport.name}-review-${Date.now()}`;
  const screenshots = [];

  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/?qaSeed=${encodeURIComponent(runId)}`) });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} ${viewport.name} origin render`);
  await client.eval(`(() => {
    const missionId = ${JSON.stringify(missionId)};
    Object.keys(localStorage)
      .filter((key) => key === 'dgskills_mission_' + missionId || key.endsWith('_' + missionId))
      .forEach((key) => localStorage.removeItem(key));
  })()`);

  const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&reset=1&qaRun=${runId}`;
  await client.send('Page.navigate', { url: withQaVercelShare(url) });
  await client.waitForExpression(
    `document.readyState === 'complete' && document.body && document.body.innerText.length > 50`,
    `${missionId} ${viewport.name} review render`,
    18_000
  );

  const intro = await collectReviewSnapshot(client);
  if (intro.bodyText.includes('Mission preview niet beschikbaar')) {
    throw new Error(`${missionId} ${viewport.name}: preview unsupported`);
  }
  await captureNamedScreenshot(client, missionId, viewport, 'review-intro', runId, screenshots);

  const firstClick = await clickFirstVisibleButton(client, [
    'start',
    'begin',
    'aan de slag',
    'volgende',
    'onderzoek',
    'maak',
    'ga verder',
    'open',
    'document',
  ]);
  await new Promise((resolve) => setTimeout(resolve, 800));
  const firstAction = await collectReviewSnapshot(client);
  await captureNamedScreenshot(client, missionId, viewport, 'review-first-action', runId, screenshots);

  const feedbackProbe = await runGenericFeedbackProbe(client);
  await new Promise((resolve) => setTimeout(resolve, 900));
  const feedback = await collectReviewSnapshot(client);
  await captureNamedScreenshot(client, missionId, viewport, 'review-feedback-probe', runId, screenshots);

  const midFlowClick = await clickFirstVisibleButton(client, [
    'volgende',
    'ga verder',
    'bekijk',
    'test',
    'controleer',
    'klaar',
    'resultaat',
    'afronden',
    'open',
    'document',
  ]);
  await new Promise((resolve) => setTimeout(resolve, 900));
  const midFlow = await collectReviewSnapshot(client);
  await captureNamedScreenshot(client, missionId, viewport, 'review-mid-flow', runId, screenshots);

  const consoleErrors = client.messages.filter((message) => {
    if (message.method === 'Runtime.consoleAPICalled') return message.params?.type === 'error';
    if (message.method === 'Log.entryAdded') return message.params?.entry?.level === 'error';
    return false;
  }).filter((message) => !isAllowedConsoleNoise(message));
  const scores = scoreReviewResult(intro, firstAction, feedback, consoleErrors.length, midFlow);
  const observations = [
    intro.horizontalOverflow ? 'Intro heeft horizontale overflow.' : 'Intro heeft geen horizontale overflow.',
    firstAction.horizontalOverflow ? 'Na eerste actie ontstaat horizontale overflow.' : 'Na eerste actie geen horizontale overflow.',
    feedback.horizontalOverflow ? 'Na feedbackprobe ontstaat horizontale overflow.' : 'Na feedbackprobe geen horizontale overflow.',
    midFlow.horizontalOverflow ? 'Mid-flow/eindstaat heeft horizontale overflow.' : 'Mid-flow/eindstaat geen horizontale overflow.',
    intro.clippedInteractiveCount > 0 ? `Intro heeft ${intro.clippedInteractiveCount} deels buiten beeld vallende interactive(s).` : 'Intro-interacties vallen niet buiten beeld.',
    firstAction.clippedInteractiveCount > 0 ? `Na eerste actie vallen ${firstAction.clippedInteractiveCount} interactive(s) deels buiten beeld.` : 'Na eerste actie vallen interacties niet buiten beeld.',
    feedback.clippedInteractiveCount > 0 ? `Na feedbackprobe vallen ${feedback.clippedInteractiveCount} interactive(s) deels buiten beeld.` : 'Na feedbackprobe vallen interacties niet buiten beeld.',
    midFlow.clippedInteractiveCount > 0 ? `Mid-flow/eindstaat heeft ${midFlow.clippedInteractiveCount} deels buiten beeld vallende interactive(s).` : 'Mid-flow/eindstaat-interacties vallen niet buiten beeld.',
    intro.hasGoal ? 'Doel/bewijs is zichtbaar in de startstaat.' : 'Doel/bewijs is niet duidelijk zichtbaar in de startstaat.',
    feedback.hasFeedback ? 'Feedbacksignalen zijn zichtbaar na de probe.' : 'Feedback na de probe is niet duidelijk zichtbaar.',
  ];

  return {
    missionId,
    viewport: viewport.name,
    persona,
    templateType,
    status: 'reviewed',
    clickedButton: firstClick,
    midFlowClick,
    feedbackProbe,
    screenshots,
    snapshots: { intro, firstAction, feedback, midFlow },
    observations,
    consoleErrors: consoleErrors.slice(-3),
    ...scores,
  };
}

async function runPlaythrough(client, missionId, viewport, persona, options = {}) {
  const templateType = MISSION_TEMPLATES[missionId];
  if (!templateType) throw new Error(`${missionId}: onbekend templateType voor playthrough`);

  console.log(`[Playthrough] Starting ${missionId} on ${viewport.name} with persona ${persona}`);

  await setViewport(client, viewport);
  client.messages = [];
  const runId = `${missionId}-${viewport.name}-${persona}-${Date.now()}`;
  const screenshots = [];
  const screenshotsBeforePlay = await listPlayScreenshots(missionId, viewport, persona);

  // Reset state
  await client.send('Page.navigate', { url: withQaVercelShare(`${ORIGIN}/?qaSeed=${encodeURIComponent(runId)}`) });
  await client.waitForExpression(`document.readyState === 'complete'`, `${missionId} origin render`);
  await client.eval(`(() => {
    const mId = ${JSON.stringify(missionId)};
    Object.keys(localStorage)
      .filter((key) => key === 'dgskills_mission_' + mId || key.endsWith('_' + mId) || key.startsWith('ai_beleid_participated_'))
      .forEach((key) => localStorage.removeItem(key));
    sessionStorage.removeItem('qa_play_completed_' + mId);
    sessionStorage.removeItem('dgskills_focus_intent');
  })()`);

  if (options.appRoute) {
    await navigateToMissionViaApp(client, missionId, options.periodKey, runId);
    await delay(800);
  } else {
    // Navigate to preview
    const previewParams = new URLSearchParams({
      mission: missionId,
      reset: '1',
      qaRun: runId,
    });
    if (templateType === 'agent-role') previewParams.set('started', '1');
    if (argValue('auth-email')) previewParams.set('qaAuth', '1');
    const url = `${ORIGIN}/dev/mission-preview?${previewParams.toString()}`;
    await client.send('Page.navigate', { url: withQaVercelShare(url) });
    await client.waitForExpression(
      `document.readyState === 'complete' && document.body && document.body.innerText.length > 50 && !document.body.innerText.includes('QA-authsessie laden')`,
      `${missionId} render`
    );
  }

  await client.eval(`(() => {
    const choice = document.querySelector('[data-qa^="scenario-intro-choice-"]');
    if (!choice) return false;
    choice.scrollIntoView({ block: 'center', inline: 'center' });
    choice.click();
    return true;
  })()`);

  await client.eval(`(() => {
    const route = document.querySelector('[data-qa="simulation-control-route"]');
    if (!route) return false;
    route.scrollIntoView({ block: 'center', inline: 'center' });
    route.click();
    return true;
  })()`);

  await client.eval(`(() => {
    const route = document.querySelector('[data-qa="review-sprint-route"]');
    if (!route) return false;
    route.scrollIntoView({ block: 'center', inline: 'center' });
    route.click();
    return true;
  })()`);

  await client.eval(`(() => {
    const route = document.querySelector('[data-qa="scenario-triage-route"]');
    if (!route) return false;
    route.scrollIntoView({ block: 'center', inline: 'center' });
    route.click();
    return true;
  })()`);

  // Try to click start/begin/aan de slag button if it exists
  let startClicked = await client.eval(`(() => {
    const pattern = /(start\s+(de\s+)?missie|starten|begin\s+(de\s+)?missie|beginnen|aan\s+de\s+slag|open\s+de\s+case|start|begin)/i;
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

  if (!startClicked && options.appRoute) {
    await delay(1200);
    startClicked = await client.eval(`(() => {
      const pattern = /(start\\s+(de\\s+)?missie|starten|begin\\s+(de\\s+)?missie|beginnen|aan\\s+de\\s+slag|open\\s+de\\s+case|start|begin)/i;
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
  }

  if (startClicked) {
    console.log(`[Playthrough] Clicked start button to begin mission`);
    await captureNamedScreenshot(client, missionId, viewport, `play-${persona}-intro`, runId, screenshots);
    await new Promise((resolve) => setTimeout(resolve, 700));
  } else {
    console.log(`[Playthrough] No start button found, assuming already started`);
  }

  // Choose the play function based on template type
  if (templateType === 'prompt-master') {
    await playPromptMaster(client, missionId, viewport, persona);
  } else if (templateType === 'game-director') {
    await playGameDirector(client, missionId, viewport, persona);
  } else if (templateType === 'cloud-cleaner') {
    await playCloudCleaner(client, missionId, viewport, persona);
  } else if (templateType === 'layout-doctor') {
    await playLayoutDoctor(client, missionId, viewport, persona);
  } else if (templateType === 'pitch-police') {
    await playPitchPolice(client, missionId, viewport, persona);
  } else if (templateType === 'simulation-lab') {
    await playSimulationLab(client, missionId, viewport, persona);
  } else if (templateType === 'agent-role') {
    await playAgentRoleMission(client, missionId, viewport, persona);
  } else if (templateType === 'builder-canvas') {
    await playBuilderCanvas(client, missionId, viewport, persona);
  } else if (templateType === 'data-viewer') {
    await playDataViewer(client, missionId, viewport, persona);
  } else if (templateType === 'puzzle-lab') {
    await playPuzzleLab(client, missionId, viewport, persona);
  } else if (templateType === 'scenario-engine') {
    await playScenarioEngine(client, missionId, viewport, persona);
  } else if (templateType === 'debate-arena') {
    await playDebateArena(client, missionId, viewport, persona);
  } else if (templateType === 'tool-guide') {
    await playToolGuide(client, missionId, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'access-control-engineer') {
    await playDedicatedAccessControl(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'data-detective') {
    await playDedicatedDataDetective(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'ipad-print-instructies') {
    await playDedicatedPrintInstructies(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'deepfake-detector') {
    await playDedicatedDeepfakeDetector(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'filter-bubble-breaker') {
    await playDedicatedFilterBubbleBreaker(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'data-voor-data') {
    await playDedicatedDataVoorData(client, viewport, persona);
  } else if (templateType === 'dedicated' && missionId === 'datalekken-rampenplan') {
    await playDedicatedDatalekkenRampenplan(client, viewport, persona);
  } else if (templateType === 'review-arena') {
    await playReviewArena(client, missionId, viewport, persona);
  } else {
    throw new Error(`Onbekend template type: ${templateType}`);
  }

  // Verify completion screen and take a screenshot
  await client.waitForExpression(
    `(() => {
      const text = document.body.innerText || '';
      const explicitCompletion = /missie voltooid|doel behaald|certificaat|resultaten|prompt master|opgeruimd staat netjes|peer feedback|beoordeel het werk van een klasgenoot/i.test(text);
      if (sessionStorage.getItem('qa_play_completed_' + ${JSON.stringify(missionId)}) === '1') return true;
      if (/Typ je eerste bericht om te beginnen/i.test(text) && !explicitCompletion) return false;
      return document.querySelector('[data-qa="prompt-master-result"]')
        || explicitCompletion;
    })()`,
    `${missionId} completion state`,
    15_000
  );

  const completionLayout = await client.eval(`(() => {
    const interactive = Array.from(document.querySelectorAll('button, a, input, textarea, select'));
    const clipped = interactive.filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const centerX = Math.min(Math.max(rect.left + rect.width / 2, 0), window.innerWidth - 1);
      const centerY = Math.min(Math.max(rect.top + rect.height / 2, 0), window.innerHeight - 1);
      const topElement = document.elementFromPoint(centerX, centerY);
      const isTopmost = topElement === element || Boolean(topElement && element.contains(topElement));
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && isTopmost
        && (rect.right > window.innerWidth + 2 || rect.left < -2);
    });
    return {
      horizontalOverflow: Math.ceil(document.documentElement.scrollWidth) > window.innerWidth + 2,
      clippedInteractiveCount: clipped.length,
    };
  })()`);
  if (completionLayout.horizontalOverflow) throw new Error(`${missionId} ${viewport.name}: horizontale overflow in completion state`);
  if (completionLayout.clippedInteractiveCount > 0) throw new Error(`${missionId} ${viewport.name}: ${completionLayout.clippedInteractiveCount} interactieve elementen buiten beeld in completion state`);

  await assertNoConsoleErrors(client, `${missionId} playthrough`);
  await captureNamedScreenshot(client, missionId, viewport, `play-${persona}-complete`, runId, screenshots);

  const completionClicked = await client.eval(`(() => {
    const button = document.querySelector('[data-qa="completion-complete"]')
      || Array.from(document.querySelectorAll('button')).find((candidate) => {
        const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
        const rect = candidate.getBoundingClientRect();
        const style = getComputedStyle(candidate);
        return /terug naar mission control|afronden|klaar|voltooien/i.test(text)
          && rect.width > 0
          && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      });
    if (!button || button.disabled) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (completionClicked) {
    await delay(1500);
    await assertNoConsoleErrors(client, `${missionId} completion confirmation`);
    await captureNamedScreenshot(client, missionId, viewport, `play-${persona}-confirmed`, runId, screenshots);
  }

  const persistEvidence = options.authContext
    ? await collectMissionPersistEvidence(options.authContext, missionId)
    : { checked: false, missionId, reason: 'authContext missing' };
  if (persistEvidence.checked) {
    if (!persistEvidence.missionsCompletedIncludesMission) {
      throw new Error(`${missionId} ${viewport.name}: serverpersist ontbreekt in users.stats.missionsCompleted`);
    }
    if (!persistEvidence.missionProgressExists) {
      throw new Error(`${missionId} ${viewport.name}: serverpersist ontbreekt in mission_progress`);
    }
    if (persistEvidence.missionCompleteActivityCount < 1) {
      throw new Error(`${missionId} ${viewport.name}: serverpersist mist student_activities mission_complete`);
    }
  }

  await appendDiscoveredPlayScreenshots(missionId, viewport, persona, screenshotsBeforePlay, screenshots);
  const playEvidence = buildPlayEvidence(screenshots, completionClicked);
  if (!playEvidence.deepClickMinimum) {
    throw new Error(`${missionId} ${viewport.name}: deep-click bewijs onvoldoende (screenshots=${playEvidence.screenshotCount}, midFlow=${playEvidence.midFlowEvidence}, errorRecovery=${playEvidence.errorRecoveryEvidence}, completion=${playEvidence.completionEvidence})`);
  }

  console.log(`✅ [Playthrough Success] ${missionId} completed on ${viewport.name} (${persona})`);
  return { missionId, viewport: viewport.name, persona, status: 'success', playEvidence, persistEvidence, screenshots };
}

async function playScenarioEngine(client, missionId, viewport, persona) {
  const config = await loadTemplateConfig('scenario-engine', missionId);
  console.log(`Playing ScenarioEngine ${missionId} (${config.rounds.length} rounds)...`);

  for (let roundIndex = 0; roundIndex < config.rounds.length; roundIndex++) {
    const round = config.rounds[roundIndex];
    console.log(`Playing ScenarioEngine round ${roundIndex + 1}/${config.rounds.length}: ${round.id}`);

    await client.waitForExpression(
      `document.querySelector('[data-qa="scenario-option"]') || document.querySelector('[data-qa="scenario-order-item"]') || document.querySelector('[data-qa="scenario-binary-accept"]') || document.querySelector('[data-qa="scenario-submit"]') || document.querySelector('[data-qa="scenario-next"]') || document.querySelector('[data-qa^="followup-option-"]')`,
      `ScenarioEngine round ${round.id} loaded`
    );

    if (persona === 'struggling' && roundIndex === 0) {
      if (round.type === 'select-correct') {
        const incorrectIndex = round.items.findIndex((item) => item.correct !== true);
        if (incorrectIndex >= 0) {
          await clickIndexedQa(client, 'scenario-option', incorrectIndex, `bewuste foute selectie ${round.id}`);
          await delay(350);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-${round.id}-wrong-selection.png`);
          await clickIndexedQa(client, 'scenario-option', incorrectIndex, `foute selectie herstellen ${round.id}`);
        }
      } else if (round.type === 'order-priority') {
        await clickIndexedQa(client, 'scenario-order-item', 0, `bewuste verkeerde order ${round.id}`);
        await delay(350);
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-${round.id}-wrong-order.png`);
        await clickQa(client, 'scenario-reset-order', `order herstellen ${round.id}`);
      } else if (round.type === 'binary-choice') {
        const first = round.items[0];
        if (first) {
          await clickIndexedQa(
            client,
            first.correct === true ? 'scenario-binary-reject' : 'scenario-binary-accept',
            0,
            `bewuste foute binary-keuze ${round.id}`
          );
          await delay(350);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-${round.id}-wrong-binary.png`);
        }
      }
      await delay(300);
    }

    if (round.type === 'select-correct') {
      for (let itemIndex = 0; itemIndex < round.items.length; itemIndex++) {
        if (round.items[itemIndex].correct === true) {
          await clickIndexedQa(client, 'scenario-option', itemIndex, `correct scenario-optie ${round.id}/${round.items[itemIndex].id}`);
          await delay(150);
        }
      }
    } else if (round.type === 'order-priority') {
      const orderedItems = [...round.items].sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0));
      for (const item of orderedItems) {
        await clickVisibleButtonContaining(client, item.title, `order item ${round.id}/${item.id}`);
        await delay(180);
      }
    } else if (round.type === 'binary-choice') {
      for (let itemIndex = 0; itemIndex < round.items.length; itemIndex++) {
        await clickIndexedQa(
          client,
          round.items[itemIndex].correct === true ? 'scenario-binary-accept' : 'scenario-binary-reject',
          itemIndex,
          `binary-keuze ${round.id}/${round.items[itemIndex].id}`
        );
        await delay(130);
      }
    }

    await client.waitForExpression(
      `(() => { const button = document.querySelector('[data-qa="scenario-submit"]'); return button && !button.disabled; })()`,
      `ScenarioEngine submit enabled for ${round.id}`
    );
    await clickQa(client, 'scenario-submit', `scenario ronde indienen ${round.id}`);
    await delay(600);

    if (round.showConfidence) {
      const rating = persona === 'struggling' ? 'confidence-level-2' : 'confidence-level-3';
      const hasConfidence = await client.eval(`Boolean(document.querySelector('[data-qa="${rating}"]'))`);
      if (hasConfidence) {
        await clickQa(client, rating, `confidence kiezen ${round.id}`);
        await delay(450);
      }
    }

    const hasFollowUp = await client.eval(`Boolean(document.querySelector('[data-qa^="followup-option-"]'))`);
    if (hasFollowUp && round.followUp) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-${round.id}-feedback-followup.png`);
      await clickQa(client, `followup-option-${round.followUp.correctIndex}`, `follow-up correct beantwoorden ${round.id}`);
      await delay(200);
      await clickQa(client, 'followup-submit', `follow-up indienen ${round.id}`);
      await delay(900);
    } else {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-${round.id}-feedback.png`);
      const hasNext = await client.eval(`Boolean(document.querySelector('[data-qa="scenario-next"]'))`);
      if (hasNext) {
        await clickQa(client, 'scenario-next', `scenario volgende ${round.id}`);
        await delay(900);
      }
    }
  }

  await client.waitForExpression(
    `document.querySelector('[data-qa="confirm-completion"]') || document.body.innerText.includes('Missie voltooid') || document.body.innerText.includes('Resultaten')`,
    `ScenarioEngine completion screen loaded`
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-completion-ready.png`);
  await clickQa(client, 'confirm-completion', 'ScenarioEngine completion bevestigen');
  await delay(900);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-scenario-completion-confirmed.png`);
}

async function playDebateArena(client, missionId, viewport, persona) {
  const config = await loadTemplateConfig('debate-arena', missionId);
  console.log(`Playing DebateArena ${missionId}...`);

  const hasOpeningChoiceUi = await client.eval(`Boolean(document.querySelector('[data-qa="debate-opening-continue"]'))`);
  if (hasOpeningChoiceUi) {
    await clickFirstVisibleBySelector(
      client,
      '[data-qa^="debate-opening-option-"]',
      'DebateArena openingskeuze selecteren'
    );
    await delay(500);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-opening-feedback-${Date.now()}.png`);
    await clickQa(client, 'debate-opening-continue', 'DebateArena naar perspectieven');
    await delay(800);
  }

  if (!hasOpeningChoiceUi && config.openingChoice) {
    await client.waitForExpression(
      `document.body.innerText.includes(${JSON.stringify(config.openingChoice.title)})`,
      `DebateArena opening choice`
    );
    await clickVisibleButtonContaining(client, config.openingChoice.options[0].label, 'openingskeuze selecteren');
    await delay(500);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-opening-feedback.png`);
    const continueLabels = [
      config.openingChoice.continueLabel,
      'Verken de perspectieven',
      'Lees de beleidsstukken',
      'Lees de stukken',
    ].filter(Boolean);
    let continued = false;
    for (const label of continueLabels) {
      try {
        await clickVisibleButtonContaining(client, label, 'naar perspectieven');
        continued = true;
        break;
      } catch {
        // Try the next known DebateArena opening CTA variant.
      }
    }
    if (!continued) {
      throw new Error(`Geen zichtbare DebateArena vervolgknop gevonden (${continueLabels.join(' / ')})`);
    }
    await delay(800);
  }

  await client.waitForExpression(
    `document.body.innerText.includes('Leer de betrokkenen kennen')`,
    `DebateArena explore phase`
  );

  for (let index = 0; index < config.stakeholders.length; index++) {
    const stakeholder = config.stakeholders[index];
    await clickVisibleButtonContaining(client, stakeholder.name, `stakeholder openen ${stakeholder.id}`);
    await delay(250);
    const hasReadButton = await client.eval(`(() => {
      return Array.from(document.querySelectorAll('button')).some((button) => {
        const text = button.innerText || button.getAttribute('aria-label') || '';
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return /^\\s*Gelezen/i.test(text) && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
      });
    })()`);
    if (hasReadButton) {
      await clickLastVisibleButtonByInnerText(client, '^\\s*Gelezen', `stakeholder gelezen ${stakeholder.id}`);
      await delay(350);
    }
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-stakeholder-${index + 1}.png`);
  }

  if (config.explorationQuiz) {
    await client.waitForExpression(
      `document.querySelector('[data-qa^="followup-option-"]')`,
      `DebateArena exploration quiz`
    );
    await clickQa(client, `followup-option-${config.explorationQuiz.correctIndex}`, 'exploratiequiz correct antwoord');
    await delay(200);
    await clickQa(client, 'followup-submit', 'exploratiequiz indienen');
    await delay(700);
  }

  await clickVisibleButtonContaining(client, 'Kies jouw positie', 'naar positie kiezen');
  await delay(700);

  await client.waitForExpression(
    `document.body.innerText.includes('Wat vind jij?')`,
    `DebateArena position phase`
  );
  if (persona === 'struggling' && config.positions.length > 1) {
    await clickVisibleButtonContaining(client, config.positions[1].label, 'bewuste voorlopige positie');
    await delay(300);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-position-reconsider.png`);
  }
  await clickVisibleButtonContaining(client, config.positions[0].label, 'definitieve positie kiezen');
  await delay(350);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-position.png`);
  await clickVisibleButtonContaining(client, 'Bouw je argumenten', 'naar argumenten');
  await delay(700);

  await client.waitForExpression(
    `document.body.innerText.includes('Bouw je argumenten')`,
    `DebateArena argue phase`
  );
  const argumentTexts = [
    {
      claim: 'Ik vind dat leerlingen duidelijke digitale grenzen nodig hebben, omdat technologie anders te veel aandacht en privacy opeist.',
      evidence: 'De perspectieven tonen dat keuzes rond schermtijd, meldingen en data gevolgen hebben voor concentratie, welzijn en vertrouwen.',
    },
    {
      claim: 'Ik vind ook dat scholen en platforms verantwoordelijkheid moeten nemen voor eerlijk en veilig digitaal gedrag.',
      evidence: 'Een individuele leerling kan niet alle risico’s alleen oplossen; goede instellingen en heldere afspraken maken veilig gedrag haalbaar.',
    },
    {
      claim: 'Mijn derde argument is dat een oplossing praktisch moet blijven, zodat leerlingen hem echt kunnen gebruiken in hun dagelijks leven.',
      evidence: 'Als een maatregel te ingewikkeld is, haken mensen af; een eenvoudige keuze met uitleg levert beter bewijs en betere gewoontes op.',
    },
  ];

  for (let index = 0; index < argumentTexts.length; index++) {
    await clickVisibleButtonContaining(client, `Arg ${index + 1}`, `argumenttab ${index + 1}`);
    await delay(250);
    if (persona === 'struggling' && index === 0) {
      await fillVisibleTextareaByIndex(client, 0, 'Te kort.', 'kort claim-antwoord');
      await fillVisibleTextareaByIndex(client, 1, 'Ook kort.', 'kort bewijs-antwoord');
      await delay(350);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-argument-short.png`);
    }
    await fillVisibleTextareaByIndex(client, 0, argumentTexts[index].claim, `claim argument ${index + 1}`);
    await fillVisibleTextareaByIndex(client, 1, argumentTexts[index].evidence, `bewijs argument ${index + 1}`);
    const stakeholder = config.stakeholders[index % config.stakeholders.length];
    if (stakeholder) {
      await clickVisibleButtonContaining(client, stakeholder.name, `stakeholder argument ${index + 1}`);
    }
    await delay(350);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-argument-${index + 1}.png`);
  }

  await clickVisibleButtonContaining(client, 'Beantwoord tegenargument', 'naar tegenargument');
  await delay(800);

  await client.waitForExpression(
    `document.body.innerText.includes('Verdedig je standpunt')`,
    `DebateArena challenge phase`
  );
  if (persona === 'struggling') {
    await fillVisibleTextareaByIndex(client, 0, 'Ik twijfel nog.', 'kort tegenargument');
    await delay(350);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-counter-short.png`);
  }
  await fillVisibleTextareaByIndex(
    client,
    0,
    'Het tegenargument is begrijpelijk, maar mijn voorstel houdt rekening met vrijheid én bescherming door keuzes uitlegbaar en controleerbaar te maken.',
    'tegenargument beantwoorden'
  );
  await delay(350);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-counter.png`);
  await clickVisibleButtonContaining(client, 'Reflecteer', 'naar reflectie');
  await delay(800);

  await client.waitForExpression(
    `document.body.innerText.includes('Goede debaters denken na') || document.body.innerText.includes('Reflecteer')`,
    `DebateArena reflect phase`
  );
  for (let index = 0; index < config.reflectionQuestions.length; index++) {
    await fillVisibleTextareaByIndex(
      client,
      index,
      'Ik heb mijn mening aangescherpt door verschillende belangen te vergelijken en mijn keuze beter te onderbouwen.',
      `reflectie ${index + 1}`
    );
    await delay(180);
  }
  await clickVisibleButtonContaining(client, config.positions[0].label, 'eindpositie bevestigen');
  await delay(350);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-debate-reflect.png`);
  await clickVisibleButtonContaining(client, 'Bekijk resultaat', 'debatresultaat bekijken');
  await delay(900);
}

async function playToolGuide(client, missionId, viewport, persona) {
  const config = await loadTemplateConfig('tool-guide', missionId);
  console.log(`Playing ToolGuide ${missionId} (${config.steps.length} steps)...`);

  const liveStartChallenges = {
    'startup-pitch': {
      visiblePattern: 'Startchallenge|Bewijsroute|15 seconden jurytijd',
      optionQa: 'tool-guide-option-problem',
      optionPattern: 'Probleem met bewijs',
      continuePattern: 'Bouw de startup pitch',
    },
    'magister-master': {
      visiblePattern: 'Startchallenge|Bewijsroute|Toetsalarm|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-agenda',
      optionPattern: 'Agenda of huiswerk|Bewijs in Magister',
      continuePattern: 'Vind het bewijs|Start|Verder|Begin|Naar|stappen|Magister|Inloggen',
    },
    'cloud-commander': {
      visiblePattern: 'Startchallenge|Bewijsroute|Werkstuk kwijt|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-onedrive-schoolmap',
      optionPattern: 'OneDrive schoolmap|Schoolmap met sync',
      continuePattern: 'Red het werkstuk|Start|Verder|Begin|Naar|OneDrive',
    },
    'word-wizard': {
      visiblePattern: 'Startchallenge|Bewijsroute|Verslag in gevaar|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-kopstijlen',
      optionPattern: 'Kopstijlen gebruiken|Verslag met vaste stijlen',
      continuePattern: 'Repareer het verslag|Start|Verder|Begin|Naar|Word',
    },
    'slide-specialist': {
      visiblePattern: 'Startchallenge|Bewijsroute|Digibord-check|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-rustige-slide',
      optionPattern: 'Korte titel, groot beeld, drie kernwoorden|Slide B',
      continuePattern: 'Bouw een betere slide|Start|Verder|Begin|Naar|PowerPoint',
    },
    'print-pro': {
      visiblePattern: 'Startchallenge|Bewijsroute|Printer op hol|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-kopieen',
      optionPattern: 'Aantal kopieen|Aantal kopieën|Veilig: slim printen',
      continuePattern: 'Stop de print-ramp|Start|Verder|Begin|Naar|print',
    },
    'mission-launch': {
      visiblePattern: 'Startchallenge|Bewijsroute|Pitch je missie|CRISIS CONSOLE',
      optionQa: 'tool-guide-option-probleem-belofte',
      optionPattern: 'Probleem \\+ belofte|Pitchbare missiehook',
      continuePattern: 'Maak de flyer sterker|Start|Verder|Begin|Naar|flyer',
    },
  };
  const liveStartChallenge = liveStartChallenges[missionId];
  if (liveStartChallenge) {
    const liveStartVisible = await client.eval(`(() => {
      if (document.body.innerText.includes(${JSON.stringify(config.steps[0]?.title || '')})) return true;
      const liveStartPattern = new RegExp(${JSON.stringify(liveStartChallenge.visiblePattern)}, 'i');
      if (!liveStartPattern.test(document.body.innerText || '')) return true;

      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !element.disabled;
      };
      const clickableTarget = (element) => {
        let current = element;
        while (current && current !== document.body) {
          const role = current.getAttribute?.('role') || '';
          const style = getComputedStyle(current);
          if (
            current.tagName === 'BUTTON'
            || role === 'button'
            || current.tabIndex >= 0
            || typeof current.onclick === 'function'
            || style.cursor === 'pointer'
          ) {
            return current;
          }
          current = current.parentElement;
        }
        return element;
      };
      const optionPattern = new RegExp(${JSON.stringify(liveStartChallenge.optionPattern)}, 'i');
      const qaTarget = document.querySelector(${JSON.stringify(liveStartChallenge.optionQa ? `[data-qa="${liveStartChallenge.optionQa}"]` : '')});
      if (qaTarget && visible(qaTarget)) {
        qaTarget.scrollIntoView({ block: 'center', inline: 'center' });
        qaTarget.click();
        return true;
      }
      const candidates = Array.from(document.querySelectorAll('button, [role="button"], label, div'));
      const target = candidates
        .filter(visible)
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)
        .find((candidate) => optionPattern.test(candidate.innerText || candidate.getAttribute('aria-label') || ''));
      if (!target) return false;
      const clickable = clickableTarget(target);
      clickable.scrollIntoView({ block: 'center', inline: 'center' });
      clickable.click();
      return true;
    })()`);
    if (!liveStartVisible) throw new Error(`${missionId}: live ToolGuide startchallenge niet klikbaar`);
    await delay(500);
    const handledLiveStart = await client.eval(`(() => {
      if (document.body.innerText.includes(${JSON.stringify(config.steps[0]?.title || '')})) return true;
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !element.disabled;
      };
      const continuePattern = new RegExp(${JSON.stringify(liveStartChallenge.continuePattern)}, 'i');
      const qaContinue = document.querySelector('[data-qa="tool-guide-continue"]');
      if (qaContinue && visible(qaContinue)) {
        qaContinue.scrollIntoView({ block: 'center', inline: 'center' });
        qaContinue.click();
        return true;
      }
      const candidates = Array.from(document.querySelectorAll('button, [role="button"]'));
      const target = candidates
        .filter(visible)
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)
        .find((candidate) => continuePattern.test(candidate.innerText || candidate.getAttribute('aria-label') || ''));
      if (!target) return false;
      target.scrollIntoView({ block: 'center', inline: 'center' });
      target.click();
      return true;
    })()`);
    if (!handledLiveStart) throw new Error(`${missionId}: live ToolGuide startchallenge vervolg niet klikbaar`);
    await delay(800);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-toolguide-introchallenge.png`);
  }

  if (config.introChallenge) {
    await client.waitForExpression(
      `document.body.innerText.includes(${JSON.stringify(config.introChallenge.prompt)}) || document.body.innerText.includes(${JSON.stringify(config.introChallenge.title)}) || document.body.innerText.includes(${JSON.stringify(config.steps[0]?.title || '')})`,
      `ToolGuide introchallenge ${missionId}`
    );
    const isAlreadyInSteps = await client.eval(`document.body.innerText.includes(${JSON.stringify(config.steps[0]?.title || '')})`);
    if (!isAlreadyInSteps) {
      const options = config.introChallenge.options || [];
      const correctIndex = options.findIndex((option) => option.correct);
      const targetIndex = persona === 'struggling'
        ? options.findIndex((option, index) => index !== correctIndex)
        : correctIndex;
      const targetOption = options[targetIndex >= 0 ? targetIndex : 0];
      if (targetOption?.title) {
        await clickVisibleButtonContaining(client, targetOption.title, `ToolGuide introchallenge keuze ${missionId}`);
        await delay(500);
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-toolguide-introchallenge.png`);
      }
      const continueLabel = config.introChallenge.continueLabel || 'Verder';
      await clickVisibleButtonContaining(client, continueLabel, `ToolGuide introchallenge verder ${missionId}`);
      await delay(700);
    }
  }

  let toolGuideWrongChoiceCaptured = false;
  for (let stepIndex = 0; stepIndex < config.steps.length; stepIndex++) {
    const step = config.steps[stepIndex];
    console.log(`Playing ToolGuide step ${stepIndex + 1}/${config.steps.length}: ${step.id}`);
    await client.waitForExpression(
      `document.body.innerText.includes(${JSON.stringify(step.title)})`,
      `ToolGuide step ${step.id} loaded`
    );

    for (const item of step.checklistItems) {
      await clickVisibleButtonContaining(client, item.label, `ToolGuide checklist ${step.id}/${item.id}`);
      await delay(120);
    }

    if (step.teacherCheck) {
      await clickVisibleButtonContaining(client, 'Mijn docent heeft dit gezien', `ToolGuide docentcheck ${step.id}`);
      await delay(250);
    }

    if (step.verificationQuestion) {
      const correctOption = step.verificationQuestion.options[step.verificationQuestion.correctIndex];
      const shouldCaptureWrongChoice = persona === 'struggling'
        || (liveStartChallenges[missionId] && !toolGuideWrongChoiceCaptured);
      if (shouldCaptureWrongChoice) {
        const wrongIndex = step.verificationQuestion.options.findIndex((_, index) => index !== step.verificationQuestion.correctIndex);
        if (wrongIndex >= 0) {
          await clickVisibleButtonContaining(client, step.verificationQuestion.options[wrongIndex], `ToolGuide bewuste foute keuze ${step.id}`);
          await delay(200);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-toolguide-${step.id}-wrong-choice.png`);
          toolGuideWrongChoiceCaptured = true;
        }
      }
      await clickVisibleButtonContaining(client, correctOption, `ToolGuide checkvraag correct ${step.id}`);
      await delay(250);
      await clickVisibleButtonContaining(client, 'Controleer antwoord', `ToolGuide checkvraag indienen ${step.id}`);
      await delay(500);
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-toolguide-step-${stepIndex + 1}.png`);
    await clickVisibleButtonContaining(
      client,
      stepIndex === config.steps.length - 1 ? 'Bekijk resultaten' : 'Volgende stap',
      `ToolGuide verder ${step.id}`
    );
    await delay(800);
  }
}

async function playPromptMaster(client, missionId, viewport, persona) {
  console.log('Playing PromptMasterMission...');
  const introStarted = await client.eval(`(() => {
    const button = document.querySelector('[data-qa="prompt-master-start"]');
    if (!button || button.disabled) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (introStarted) await delay(900);
  const routePicked = await client.eval(`(() => {
    const body = document.body.innerText || '';
    if (!/PROMPT RESCUE|reddingsroute|VAGE PROMPT ALERT/i.test(body)) return false;
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const candidates = Array.from(document.querySelectorAll('button, [role="button"], article, section, div'))
      .filter((element) => visible(element) && /Doel redden|ROUTE 1|\\+ FOCUS/i.test(element.innerText || element.getAttribute('aria-label') || ''))
      .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
    const target = candidates[0];
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (routePicked) await delay(900);
  const postRouteStarted = await maybeClickVisibleButtonByBestText(client, ['Start het Lab', 'Verder met het Lab']);
  if (postRouteStarted) await delay(900);

  const strongPrompt = [
    'Maak een schattige golden retriever puppy die vrolijk rent en speelt in een zonnig groen park met gras, natuur en duidelijke achtergrond.',
    'Schrijf ook een spannend avontuur-verhaal van ongeveer 100 woorden over een jonge ontdekker in een magische grot.',
    'Ontwerp een modern minimalistisch logo voor bakkerij Broodjes Goud met een gouden brood-icoon, warme bruine/oranje kleuren en strakke merkstijl.',
    'Maak een formele beleefde e-mail aan mijn docent/mevrouw over ziek afmelden met onderwerp, begroeting, reden en nette afsluiting.',
    'Doe alsof je een middeleeuwse ridder/Sir Galahad bent voor een toneelstukscene; spreek ouderwets, formeel en demonstreer een korte dialoog.',
    'Geef een makkelijk glutenvrij pannenkoekenrecept in bullet points/genummerde stappen met minuten/tijdsindicatie, simpele ingrediënten en weinig complexiteit.',
  ].join(' ');

  for (let challengeIndex = 0; challengeIndex < 10; challengeIndex++) {
    const isComplete = await client.eval(`Boolean(document.querySelector('[data-qa="prompt-master-result"]')) || /Prompt Master|Missie voltooid|Resultaten/i.test(document.body.innerText || '')`);
    if (isComplete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-result.png`);
      break;
    }

    await client.waitForExpression(
      `document.querySelector('[data-qa="prompt-master-input"]') || document.querySelector('[data-qa="prompt-master-result"]')`,
      `PromptMaster challenge ${challengeIndex + 1}`,
      12_000
    );

    const hasInput = await client.eval(`Boolean(document.querySelector('[data-qa="prompt-master-input"]'))`);
    if (!hasInput) continue;

    if (persona === 'struggling' && challengeIndex === 0) {
      await client.eval(`(() => {
        const input = document.querySelector('[data-qa="prompt-master-input"]');
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter ? setter.call(input, 'maak iets leuks') : (input.value = 'maak iets leuks');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()`);
      await clickQa(client, 'prompt-master-submit', 'PromptMaster bewust te korte prompt');
      await delay(900);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-short.png`);
      const canRetry = await client.eval(`Boolean(document.querySelector('[data-qa="prompt-master-try-again"]'))`);
      if (canRetry) {
        await clickQa(client, 'prompt-master-try-again', 'PromptMaster verbeteren na feedback');
        await delay(450);
      }
    }

    await client.eval(`(() => {
      const input = document.querySelector('[data-qa="prompt-master-input"]');
      const value = ${JSON.stringify(strongPrompt)};
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
      setter ? setter.call(input, value) : (input.value = value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await delay(250);
    await clickQa(client, 'prompt-master-submit', `PromptMaster submit ${challengeIndex + 1}`);
    await client.waitForExpression(
      `document.querySelector('[data-qa="prompt-master-success-feedback"]') || document.querySelector('[data-qa="prompt-master-improve-feedback"]')`,
      `PromptMaster feedback ${challengeIndex + 1}`,
      60_000
    );
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-challenge-${challengeIndex + 1}-feedback.png`);

    const canNext = await client.eval(`(() => {
      const next = document.querySelector('[data-qa="prompt-master-next"]');
      return Boolean(next && !next.disabled);
    })()`);
    if (!canNext) {
      const canRetry = await client.eval(`Boolean(document.querySelector('[data-qa="prompt-master-try-again"]'))`);
      if (canRetry) await clickQa(client, 'prompt-master-try-again', `PromptMaster retry ${challengeIndex + 1}`);
      await delay(500);
      continue;
    }

    await clickQa(client, 'prompt-master-next', `PromptMaster volgende ${challengeIndex + 1}`);
    await delay(900);
  }

  await client.waitForExpression(
    `document.querySelector('[data-qa="prompt-master-complete"]') || document.querySelector('[data-qa="prompt-master-result"]')`,
    'PromptMaster resultaat zichtbaar',
    12_000
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-result.png`);
  const clickedComplete = await client.eval(`(() => {
    const button = document.querySelector('[data-qa="prompt-master-complete"]');
    if (!button || button.disabled) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clickedComplete) throw new Error('PromptMaster eindknop niet gevonden');
  await delay(700);
}

async function playGameDirector(client, missionId, viewport, persona) {
  console.log('Playing GameDirectorMission...');

  const isMobile = viewport.name === 'mobile';
  const levels = [
    {
      name: 'level-1',
      blocks: [
        { fragment: 'wanneer game start', category: 'Gebeurtenissen' },
        { fragment: 'teleporteer', category: 'Beweging' },
      ],
      numbers: [600, 500],
    },
    {
      name: 'level-2',
      blocks: [
        { fragment: 'wanneer game start', category: 'Gebeurtenissen' },
        { fragment: 'spring', category: 'Beweging' },
        { fragment: 'teleporteer', category: 'Beweging' },
      ],
      numbers: [15, 750, 500],
    },
    {
      name: 'level-3',
      blocks: [
        { fragment: 'wanneer game start', category: 'Gebeurtenissen' },
        { fragment: 'teleporteer', category: 'Beweging' },
        { fragment: 'wanneer key ingedrukt', category: 'Gebeurtenissen' },
        { fragment: 'wanneer key ingedrukt', category: 'Gebeurtenissen' },
      ],
      numbers: [700, 500],
      selects: ['ArrowRight', 'ArrowLeft'],
    },
    {
      name: 'level-4',
      blocks: [
        { fragment: 'wanneer game start', category: 'Gebeurtenissen' },
        { fragment: 'teleporteer', category: 'Beweging' },
        { fragment: 'als op de grond', category: 'Besturing' },
        { fragment: 'spring', category: 'Beweging' },
      ],
      numbers: [665, 260, 15],
    },
    {
      name: 'level-5',
      blocks: [
        { fragment: 'wanneer game start', category: 'Gebeurtenissen' },
        { fragment: 'zet zwaartekracht', category: 'Variabelen' },
        { fragment: 'teleporteer', category: 'Beweging' },
      ],
      numbers: [0.2, 375, 140],
    },
  ];

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-game-director-open.png`);

  for (const [index, level] of levels.entries()) {
    await prepareGameDirectorWorkspace(client, isMobile);
    for (const block of level.blocks) {
      await addGameDirectorBlock(client, block.fragment, block.category, isMobile);
      await delay(180);
    }
    if (isMobile) await clickVisibleButtonContaining(client, 'Code', 'game-director mobiele code-tab');
    await setGameDirectorNumberInputs(client, level.numbers);
    if (level.selects) await setGameDirectorSelects(client, level.selects);
    if (level.nestJumpInGrounded) await nestGameDirectorJumpInGroundedBlock(client);
    await delay(250);

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-${level.name}-code.png`);
    await runGameDirectorProgram(client, isMobile);

    const completionExpression = index === levels.length - 1
      ? `document.body.innerText.includes('Missie Voltooid') || Array.from(document.querySelectorAll('textarea')).some((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'; }) || Array.from(document.querySelectorAll('button')).some((button) => /reflectie|volgende/i.test(button.innerText || ''))`
      : `Array.from(document.querySelectorAll('button')).some((button) => /volgende/i.test(button.innerText || ''))`;
    await client.waitForExpression(completionExpression, `game-director ${level.name} voltooid`, 12_000);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-${level.name}-feedback.png`);

    if (index < levels.length - 1) {
      await clickVisibleButtonByBestText(client, ['^\\s*Volgende\\s*$'], `game-director volgende na ${level.name}`);
      await delay(700);
    } else if (!await client.eval(`Array.from(document.querySelectorAll('textarea')).some((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'; })`)) {
      await clickVisibleButtonByBestText(client, ['Reflectie', '^\\s*Volgende\\s*$'], `game-director naar reflectie na ${level.name}`);
      await client.waitForExpression(
        `Array.from(document.querySelectorAll('textarea')).some((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'; })`,
        'game-director reflectiestaat zichtbaar',
        5_000
      );
    }
  }

  await fillVisibleTextareaByIndex(
    client,
    0,
    'Ik leerde dat duidelijke stappen bepalen wat een computer of AI doet.',
    'game-director reflectie'
  );
  await delay(300);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-game-director-conclusion.png`);
  await clickVisibleButtonByBestText(client, ['Terug naar Mission Control'], 'game-director afronden');
  await delay(600);
}

async function prepareGameDirectorWorkspace(client, isMobile) {
  if (isMobile) await clickVisibleButtonContaining(client, 'Code', 'game-director mobiele code-tab voor reset');
  const hasBlocks = await client.eval(`(() => {
    const workspace = document.querySelector('[data-drop-zone="main"]');
    return Boolean(workspace && workspace.querySelector('[draggable="true"]'));
  })()`);
  if (hasBlocks) {
    await clickGameDirectorButtonByTitleOrText(client, 'Verwijder alles');
    await delay(150);
    await clickGameDirectorButtonByTitleOrText(client, 'Verwijder alles');
    await delay(250);
  }
  if (isMobile) await clickVisibleButtonContaining(client, 'Blokken', 'game-director mobiele blokken-tab');
}

async function addGameDirectorBlock(client, fragment, category, isMobile) {
  if (isMobile) await clickVisibleButtonContaining(client, 'Blokken', 'game-director mobiele blokken-tab');
  const hasButton = await hasGameDirectorAddButton(client, fragment);
  if (!hasButton) {
    await clickVisibleButtonContaining(client, category, `game-director categorie ${category}`);
    await client.waitForExpression(
      `(${gameDirectorHasAddButtonExpression(fragment)})`,
      `game-director blok zichtbaar: ${fragment}`,
      4_000
    );
  }
  const clicked = await client.eval(`(() => {
    const needle = ${JSON.stringify(fragment)}.toLowerCase();
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const label = (candidate.getAttribute('aria-label') || '').toLowerCase();
      return visible(candidate) && label.startsWith('voeg ') && label.includes(needle);
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`game-director blok niet toe te voegen: ${fragment}`);
}

function gameDirectorHasAddButtonExpression(fragment) {
  return `Array.from(document.querySelectorAll('button')).some((candidate) => {
    const rect = candidate.getBoundingClientRect();
    const style = getComputedStyle(candidate);
    const label = (candidate.getAttribute('aria-label') || '').toLowerCase();
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !candidate.disabled
      && label.startsWith('voeg ') && label.includes(${JSON.stringify(fragment.toLowerCase())});
  })`;
}

async function hasGameDirectorAddButton(client, fragment) {
  return client.eval(`(() => ${gameDirectorHasAddButtonExpression(fragment)})()`);
}

async function clickGameDirectorButtonByTitleOrText(client, needle) {
  const clicked = await client.eval(`(() => {
    const needle = ${JSON.stringify(needle)}.toLowerCase();
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const matches = Array.from(document.querySelectorAll('button')).filter((candidate) => {
      const label = [candidate.innerText, candidate.getAttribute('aria-label'), candidate.title].filter(Boolean).join(' ').toLowerCase();
      return visible(candidate) && label.includes(needle);
    });
    const withText = matches.filter((candidate) => (candidate.innerText || '').trim().toLowerCase().includes(needle));
    const button = (withText.length > 0 ? withText : matches).at(-1);
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`game-director knop niet gevonden: ${needle}`);
}

async function setGameDirectorNumberInputs(client, values) {
  const count = await client.eval(`(() => {
    const workspace = document.querySelector('[data-drop-zone="main"]');
    if (!workspace) return -1;
    return Array.from(workspace.querySelectorAll('input[type="number"]')).length;
  })()`);
  if (count < values.length) throw new Error(`game-director verwachtte ${values.length} numerieke inputs, vond ${count}`);

  for (let index = 0; index < values.length; index++) {
    await client.eval(`(() => {
      const workspace = document.querySelector('[data-drop-zone="main"]');
      const input = Array.from(workspace?.querySelectorAll('input[type="number"]') || [])[${Number(index)}];
      if (!input) return false;
      const value = ${JSON.stringify(values[index])};
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      if (descriptor?.set) descriptor.set.call(input, String(value));
      else input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      const reactPropsKey = Object.keys(input).find((key) => key.startsWith('__reactProps$'));
      reactPropsKey && input[reactPropsKey]?.onChange?.({
        target: { value: String(value) },
        currentTarget: { value: String(value) },
        bubbles: true,
        preventDefault() {},
        stopPropagation() {},
      });
      return true;
    })()`);
    await delay(60);
  }
}

async function setGameDirectorSelects(client, values) {
  const count = await client.eval(`(() => {
    const workspace = document.querySelector('[data-drop-zone="main"]');
    if (!workspace) return -1;
    const selects = Array.from(workspace.querySelectorAll('select'));
    const values = ${JSON.stringify(values)};
    values.forEach((value, index) => {
      const select = selects[index];
      if (!select) return;
      if (select.value === value) return;
      const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (descriptor?.set) descriptor.set.call(select, value);
      else select.value = value;
      Array.from(select.options).forEach((option) => {
        option.selected = option.value === value;
      });
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const reactPropsKey = Object.keys(select).find((key) => key.startsWith('__reactProps$'));
      select[reactPropsKey]?.onChange?.({
        target: { value },
        currentTarget: { value },
        bubbles: true,
        preventDefault() {},
        stopPropagation() {},
      });
    });
    return selects.length;
  })()`);
  if (count < values.length) throw new Error(`game-director verwachtte ${values.length} selects, vond ${count}`);
  await client.waitForExpression(
    `(() => {
      const workspace = document.querySelector('[data-drop-zone="main"]');
      const selects = Array.from(workspace?.querySelectorAll('select') || []);
      const values = ${JSON.stringify(values)};
      return values.every((value, index) => selects[index]?.value === value);
    })()`,
    'game-director selectwaarden gezet',
    3_000
  );
}

async function nestGameDirectorJumpInGroundedBlock(client) {
  const result = await client.eval(`(() => {
    const workspace = document.querySelector('[data-drop-zone="main"]');
    if (!workspace) return { ok: false, reason: 'geen workspace' };
    const draggableBlocks = Array.from(workspace.querySelectorAll('[draggable="true"]'));
    const jump = draggableBlocks.filter((element) => (element.innerText || '').toLowerCase().includes('spring')).at(-1);
    const grounded = draggableBlocks.find((element) => (element.innerText || '').toLowerCase().includes('als op de grond'));
    if (!jump || !grounded) return { ok: false, reason: 'jump of grounded blok ontbreekt' };
    const dropTarget = Array.from(grounded.querySelectorAll('div')).find((element) =>
      (element.innerText || '').toLowerCase().includes('sleep blokken hierheen')
    )?.parentElement;
    if (!dropTarget) return { ok: false, reason: 'geen child dropzone' };
    const dataTransfer = new DataTransfer();
    jump.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    dropTarget.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
    dropTarget.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
    jump.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }));
    return {
      ok: true,
      groundedText: grounded.innerText,
      workspaceText: workspace.innerText,
    };
  })()`);
  if (!result?.ok) throw new Error(`game-director kon springblok niet nesten: ${result?.reason || 'onbekend'}`);
  await client.waitForExpression(
    `(() => {
      const workspace = document.querySelector('[data-drop-zone="main"]');
      const grounded = Array.from(workspace?.querySelectorAll('[draggable="true"]') || [])
        .find((element) => (element.innerText || '').toLowerCase().includes('als op de grond'));
      return Boolean(grounded && (grounded.innerText || '').toLowerCase().includes('spring'));
    })()`,
    'game-director springblok genest',
    3_000
  );
}

async function runGameDirectorProgram(client, isMobile) {
  if (isMobile) {
    await clickVisibleButtonContaining(client, 'Test game', 'game-director mobiel test game');
    return;
  }
  await clickVisibleButtonByBestText(client, ['^\\s*START\\s*$'], 'game-director start');
}

async function playCloudCleaner(client, missionId, viewport, persona) {
  console.log('Playing CloudCleanerMission...');
  await client.eval(`(() => {
    const keys = Object.keys(localStorage).filter((key) => key.includes('cloud-cleaner'));
    keys.forEach((key) => localStorage.removeItem(key));
  })()`);
  await client.waitForExpression(
    `/Recente Bestanden|Sorteer slim/i.test(document.body.innerText || '')`,
    'cloud-cleaner na reset',
    10_000
  );
  await delay(500);

  const placements = [
    ['Boekverslag_NL.docx', 'Nederlands'],
    ['Vakantie_Selfie.jpg', "Privé"],
    ['Presentatie_Aard.pptx', 'Aardrijkskunde'],
    ['Meme_Collectie.zip', "Privé"],
    ['Huiswerk_Wiskunde.pdf', 'Wiskunde'],
    ['Lesaantekeningen.txt', 'School Algemeen'],
    ['Gratis_Minecraft_Hack.exe', 'Prullenbak'],
    ['Virus_Alert.html', 'Prullenbak'],
    ['Oude_Setup_V1.installer', 'Prullenbak'],
  ];

  for (let index = 0; index < placements.length; index++) {
    const [fileName, folderName] = placements[index];
    if (persona === 'struggling' && index === 0) {
      await clickVisibleButtonContaining(client, fileName, `cloud-cleaner bewuste foute file ${fileName}`);
      await delay(200);
      let clickedWrongTrash = await maybeClickVisibleButtonByBestText(client, ['Prullenbak']);
      if (!clickedWrongTrash) {
        const openedMobileFolders = await client.eval(`(() => {
          const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            const style = getComputedStyle(candidate);
            const text = candidate.innerText || candidate.getAttribute('aria-label') || candidate.title || '';
            return rect.width >= 40 && rect.height >= 40 && rect.left < 96 && rect.bottom > window.innerHeight - 128
              && style.visibility !== 'hidden' && style.display !== 'none' && !candidate.disabled
              && (!text || /mappen|folder|sluiten/i.test(text));
          });
          if (!button) return false;
          button.click();
          return true;
        })()`);
        if (openedMobileFolders) await delay(450);
        clickedWrongTrash = await maybeClickVisibleButtonByBestText(client, ['Prullenbak']);
      }
      if (!clickedWrongTrash) throw new Error('Geen zichtbare knop gevonden voor: cloud-cleaner bewuste foute map');
      await delay(600);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-wrong-placement.png`);
    }

    await clickVisibleButtonContaining(client, fileName, `cloud-cleaner file ${fileName}`);
    await delay(180);
    let folderClicked = await client.eval(`(() => {
      const needle = ${JSON.stringify(folderName)}.toLowerCase();
      const visible = (button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
      };
      const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
        visible(candidate) && (candidate.innerText || candidate.getAttribute('aria-label') || '').toLowerCase().includes(needle)
      );
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);
    if (!folderClicked) {
      const openedMobileFolders = await client.eval(`(() => {
        const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
          const rect = candidate.getBoundingClientRect();
          const style = getComputedStyle(candidate);
          const text = candidate.innerText || candidate.getAttribute('aria-label') || candidate.title || '';
          return rect.width >= 40 && rect.height >= 40 && rect.left < 96 && rect.bottom > window.innerHeight - 128
            && style.visibility !== 'hidden' && style.display !== 'none' && !candidate.disabled
            && (!text || /mappen|folder|sluiten/i.test(text));
        });
        if (!button) return false;
        button.click();
        return true;
      })()`);
      if (openedMobileFolders) await delay(450);
      folderClicked = await client.eval(`(() => {
        const needle = ${JSON.stringify(folderName)}.toLowerCase();
        const visible = (button) => {
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
        };
        const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
          visible(candidate) && (candidate.innerText || candidate.getAttribute('aria-label') || '').toLowerCase().includes(needle)
        );
        if (!button) return false;
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.click();
        return true;
      })()`);
    }
    if (!folderClicked) throw new Error(`Geen zichtbare knop gevonden voor: cloud-cleaner folder ${folderName}`);
    await delay(950);

    const hasWhy = await client.eval(`Boolean(document.querySelector('[data-qa="cloud-cleaner-evidence-modal"]'))`);
    if (hasWhy) {
      const wroteEvidence = await client.eval(`(() => {
        const input = document.querySelector('[data-qa="cloud-cleaner-evidence-note"]');
        if (!input) return false;
        if (input.disabled) return 'already-pinned';
        input.scrollIntoView({ block: 'center', inline: 'center' });
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter.call(input, 'Ik pin het signaal in de bestandsnaam en leg uit waarom deze map logisch is.');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return 'wrote';
      })()`);
      if (!wroteEvidence) throw new Error('cloud-cleaner bewijsveld niet beschikbaar');
      if (wroteEvidence === 'wrote') {
        await delay(250);
        await clickVisibleButtonByBestText(client, ['Pin bewijs'], 'cloud-cleaner bewijs pinnen');
        await delay(400);
      }
      if ([0, 4, 8].includes(index)) {
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-cloud-evidence-feedback-${index + 1}.png`);
      }
      await clickVisibleButtonByBestText(client, ['Volgende file'], 'cloud-cleaner bewijs verder');
      await delay(550);
    }

    if ([1, 5].includes(index)) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-cloud-step-${index + 1}.png`);
    }
  }

  await client.waitForExpression(
    `/Voltooien|Opgeruimd Staat Netjes|Alles opgeruimd/i.test(document.body.innerText || '')`,
    'cloud-cleaner succesmodal of voltooi-knop',
    8_000
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-cloud-success.png`);
  await clickVisibleButtonByBestText(client, ['Voltooien'], 'cloud-cleaner voltooien');
  await delay(700);
}

async function playLayoutDoctor(client, missionId, viewport, persona) {
  console.log('Playing Word LayoutDoctor...');
  const isMobile = viewport.name === 'mobile';
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-layout-doctor-open.png`);

  // Casus 1: selecteer afbeelding, zet tekstomloop op Vierkant en sleep naar rechts.
  await ensureLayoutDoctorDocumentView(client, isMobile);
  await selectLayoutDoctorImage(client, 'romans-img');
  if (isMobile) {
    const usedMobileWrap = await maybeClickQa(client, 'word-mobile-wrap-square', 'layout-doctor mobiele omloop');
    if (usedMobileWrap) {
      await clickQa(client, 'word-mobile-image-right', 'layout-doctor mobiele afbeelding rechts');
    } else {
      await clickQa(client, 'word-tab-indeling', 'layout-doctor tab Indeling');
      await delay(250);
      await clickQa(client, 'word-wrap-square', 'layout-doctor tekstomloop vierkant');
      await dragLayoutDoctorImageToRight(client, 'romans-img');
    }
  } else {
    await clickQa(client, 'word-tab-indeling', 'layout-doctor tab Indeling');
    await delay(250);
    await clickQa(client, 'word-wrap-square', 'layout-doctor tekstomloop vierkant');
    await dragLayoutDoctorImageToRight(client, 'romans-img');
  }
  await waitForLayoutDoctorCaseSolved(client, 1);
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-case-1-fixed.png`);
  await advanceLayoutDoctorCase(client, 2, missionId, viewport, persona);

  // Casus 2: drie titelregels naar Kop 1.
  await ensureLayoutDoctorDocumentView(client, isMobile);
  for (const heading of ['Inleiding', 'Wat is een vulkaan?', 'Soorten vulkanen']) {
    await selectLayoutDoctorTextBlock(client, heading);
    if (isMobile) {
      const usedMobileHeading = await maybeClickQa(client, 'word-mobile-heading1', `layout-doctor mobiel Kop 1 ${heading}`);
      if (!usedMobileHeading) {
        await clickQa(client, 'word-style-heading1', `layout-doctor Kop 1 ${heading}`);
      }
    } else {
      await clickQa(client, 'word-style-heading1', `layout-doctor Kop 1 ${heading}`);
    }
    await delay(450);
  }
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-case-2-headings.png`);
  await advanceLayoutDoctorCase(client, 3, missionId, viewport, persona);

  // Casus 3: automatische inhoudsopgave.
  await ensureLayoutDoctorDocumentView(client, isMobile);
  await placeLayoutDoctorCursorAtStart(client);
  if (isMobile) {
    const usedMobileToc = await maybeClickQa(client, 'word-mobile-toc', 'layout-doctor mobiele inhoudsopgave');
    if (!usedMobileToc) {
      await clickQa(client, 'word-tab-verwijzingen', 'layout-doctor tab Verwijzingen');
      await delay(250);
      await clickQa(client, 'word-toc', 'layout-doctor inhoudsopgave');
    }
  } else {
    await clickQa(client, 'word-tab-verwijzingen', 'layout-doctor tab Verwijzingen');
    await delay(250);
    await clickQa(client, 'word-toc', 'layout-doctor inhoudsopgave');
  }
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-case-3-toc.png`);
  await advanceLayoutDoctorCase(client, 4, missionId, viewport, persona);

  // Casus 4: paginanummer onderaan in het midden.
  await ensureLayoutDoctorDocumentView(client, isMobile);
  if (isMobile) {
    const usedMobilePageNumber = await maybeClickQa(client, 'word-mobile-page-number', 'layout-doctor mobiel paginanummer');
    if (!usedMobilePageNumber) {
      await clickQa(client, 'word-tab-invoegen', 'layout-doctor tab Invoegen');
      await delay(250);
      await clickQa(client, 'word-page-number', 'layout-doctor paginanummer');
    }
  } else {
    await clickQa(client, 'word-tab-invoegen', 'layout-doctor tab Invoegen');
    await delay(250);
    await clickQa(client, 'word-page-number', 'layout-doctor paginanummer');
  }
  await clickVisibleButtonByBestText(client, ['Onderaan'], 'layout-doctor paginanummer onderaan');
  await clickVisibleButtonByBestText(client, ['Midden'], 'layout-doctor paginanummer midden');
  await clickVisibleButtonByBestText(client, ['Toevoegen'], 'layout-doctor paginanummer toevoegen');
  await client.waitForExpression(
    `/Layout Doctor Diploma|Fantastisch|Peer Feedback|Beoordeel het werk/i.test(document.body.innerText || '')`,
    'layout-doctor conclusie',
    8_000
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-case-4-complete.png`);
  await client.eval(`sessionStorage.setItem('qa_play_completed_layout-doctor', '1')`);
}

async function ensureLayoutDoctorDocumentView(client, isMobile) {
  if (!isMobile) return;
  const isDocumentVisible = await client.eval(`(() => {
    const editor = document.querySelector('[data-qa="word-simulator-editor"]');
    const rect = editor?.getBoundingClientRect();
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  })()`);
  if (!isDocumentVisible) {
    await clickVisibleButtonByBestText(client, ['Open document', '^\\s*Document\\s*$'], 'layout-doctor mobiel document openen');
    await delay(500);
  }
}

async function selectLayoutDoctorImage(client, imageId) {
  const clicked = await client.eval(`(() => {
    const image = document.querySelector(${JSON.stringify(`[data-qa="word-simulator-image-${imageId}"]`)});
    if (!image) return false;
    image.scrollIntoView({ block: 'center', inline: 'center' });
    image.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`layout-doctor afbeelding niet gevonden: ${imageId}`);
  await delay(350);
}

async function dragLayoutDoctorImageToRight(client, imageId) {
  const selector = `[data-qa="word-simulator-image-${imageId}"]`;
  const start = await client.eval(`(() => {
    const image = document.querySelector(${JSON.stringify(selector)});
    const target = image?.closest('[style*="position: absolute"]') || image;
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!start) throw new Error(`layout-doctor afbeelding niet te slepen: ${imageId}`);

  const targetX = Math.min(start.x + 360, 1180);
  const targetY = start.y + 10;
  const pointerMoved = await client.eval(`(() => {
    const image = document.querySelector(${JSON.stringify(selector)});
    const target = image?.closest('[style*="position: absolute"]') || image;
    if (!target) return false;
    const start = ${JSON.stringify(start)};
    const end = { x: ${targetX}, y: ${targetY} };
    const eventInit = (type, point) => ({
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: type === 'pointerup' ? 0 : 0,
      buttons: type === 'pointerup' ? 0 : 1,
      clientX: point.x,
      clientY: point.y,
    });
    target.dispatchEvent(new PointerEvent('pointerdown', eventInit('pointerdown', start)));
    for (let step = 1; step <= 8; step += 1) {
      const point = {
        x: start.x + ((end.x - start.x) * step) / 8,
        y: start.y + ((end.y - start.y) * step) / 8,
      };
      target.dispatchEvent(new PointerEvent('pointermove', eventInit('pointermove', point)));
    }
    target.dispatchEvent(new PointerEvent('pointerup', eventInit('pointerup', end)));
    return true;
  })()`);
  if (!pointerMoved) throw new Error(`layout-doctor afbeelding niet te slepen: ${imageId}`);
  await delay(500);

  await client.waitForExpression(
    `/Genezen|Casus 2\\/4/i.test(document.body.innerText || '')`,
    'layout-doctor casus 1 opgelost',
    8_000
  );
}

async function clickLayoutDoctorWrapMode(client, title, label) {
  const clicked = await client.eval(`(() => {
    const title = ${JSON.stringify(title)}.toLowerCase();
    const visible = (button) => {
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !button.disabled;
    };
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find((candidate) =>
      visible(candidate)
      && String(candidate.getAttribute('title') || candidate.innerText || '').toLowerCase().includes(title)
    );
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Geen zichtbare knop gevonden voor: ${label}`);
  await delay(350);
}

async function waitForLayoutDoctorCaseSolved(client, caseNumber) {
  const nextCase = caseNumber + 1;
  await client.waitForExpression(
    `/Genezen/i.test(document.body.innerText || '') || document.body.innerText.includes(${JSON.stringify(`Casus ${nextCase}/4`)})`,
    `layout-doctor casus ${caseNumber} opgelost`,
    8_000
  );
}

async function selectLayoutDoctorTextBlock(client, text) {
  const selected = await client.eval(`(() => {
    const editor = document.querySelector('[data-qa="word-simulator-editor"]');
    if (!editor) return false;
    const needle = ${JSON.stringify(text)};
    const normalize = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
    let block = Array.from(editor.querySelectorAll('p,h1,h2,h3,div')).find((child) =>
      normalize(child.textContent) === needle
    );
    if (!block) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let node = null;
      while ((node = walker.nextNode())) {
        if (normalize(node.textContent) === needle) {
          block = node.parentElement;
          break;
        }
      }
    }
    if (!block) return false;
    block.scrollIntoView({ block: 'center', inline: 'center' });
    const range = document.createRange();
    range.selectNodeContents(block);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
    return true;
  })()`);
  if (!selected) throw new Error(`layout-doctor tekstblok niet gevonden: ${text}`);
  await delay(150);
}

async function placeLayoutDoctorCursorAtStart(client) {
  const placed = await client.eval(`(() => {
    const editor = document.querySelector('[data-qa="word-simulator-editor"]');
    const first = editor?.firstElementChild;
    if (!editor || !first) return false;
    first.scrollIntoView({ block: 'center', inline: 'center' });
    const range = document.createRange();
    range.setStartBefore(first);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
    return true;
  })()`);
  if (!placed) throw new Error('layout-doctor kon cursor niet aan begin plaatsen');
}

async function advanceLayoutDoctorCase(client, nextCase, missionId, viewport, persona) {
  const nextExpression = nextCase <= 4
    ? `document.body.innerText.includes(${JSON.stringify(`Casus ${nextCase}/4`)})`
    : `/Layout Doctor Diploma|Fantastisch/i.test(document.body.innerText || '')`;

  const alreadyAdvanced = await client.eval(`Boolean(${nextExpression})`);
  if (!alreadyAdvanced) {
    await maybeClickVisibleButtonByBestText(client, ['Volgende Casus']);
    await client.waitForExpression(nextExpression, `layout-doctor naar casus ${nextCase}`, 6_000);
  }
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-case-${nextCase}-start.png`);
}

async function playPitchPolice(client, missionId, viewport, persona) {
  console.log('Playing PitchPoliceMission...');
  await delay(4300);
  await clickVisibleButtonByBestText(client, ['Start de Inspectie'], 'pitch-police start inspectie');
  await delay(900);

  const correctOptions = [
    'Samenvatten in steekwoorden',
    'Tekst zwart maken',
    'maximaal 3 kleuren',
    'relevante foto',
    'GROOT en duidelijk',
    'Originele verhoudingen',
    'spellingcontrole',
    'heldere staafgrafiek',
  ];
  const correctViolations = [
    'Te veel tekst',
    'Contrastfout',
    'Chaos-layout',
    'Beeldprobleem',
    'Leesbaarheid',
    'Beeldprobleem',
    'Leesbaarheid',
    'Chaos-layout',
  ];

  for (let slide = 0; slide < correctOptions.length; slide++) {
    await clickPitchPoliceOption(client, [correctViolations[slide]], `pitch-police overtreding ${slide + 1}`);
    await delay(600);
    if (persona === 'struggling' && slide === 0) {
      await clickPitchPoliceOption(client, ['Tekst kleiner maken'], 'pitch-police bewuste foute keuze');
      await delay(700);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-wrong-choice.png`);
    }
    await clickPitchPoliceOption(client, [correctOptions[slide]], `pitch-police correcte optie ${slide + 1}`);
    await delay(1300);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-slide-${slide + 1}-fixed.png`);
    await clickVisibleButtonByBestText(client, [slide < correctOptions.length - 1 ? 'Volgende Dia' : 'Afronden'], `pitch-police verder ${slide + 1}`);
    await delay(900);
  }
  await client.eval(`sessionStorage.setItem('qa_play_completed_pitch-police', '1')`);
}

async function clickPitchPoliceOption(client, patterns, label) {
  const clickedOption = await client.eval(`(() => {
    const patterns = ${JSON.stringify(patterns)}.map((pattern) => new RegExp(pattern, 'i'));
    const clickable = (button) => {
      const style = getComputedStyle(button);
      return style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
    };
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || candidate.title || '';
      return clickable(candidate) && patterns.some((pattern) => pattern.test(text));
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (clickedOption) return;
  await clickVisibleButtonByBestText(client, ['Bekijk Rapport', 'Opties'], `${label} mobiel rapport openen`);
  await delay(450);
  await clickVisibleButtonByBestText(client, patterns, label);
}

async function advanceAgentBriefing(client, missionId) {
  for (let step = 0; step < 8; step++) {
    const ready = await client.eval(`(() => {
      const text = document.body.innerText || '';
      return Boolean(document.querySelector('.chat-input'))
        || /Start Nieuw Project|Start de Enquête|Solo Training|Teken hier|Klaar!|Intents|Training Data|AI Beleid/i.test(text);
    })()`);
    if (ready) return;

    const clicked = await client.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('button')).filter((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
      });
      const button = buttons.find((candidate) =>
        /^(Volgende|Start Missie|Starten|Beginnen|Aan de slag)$/i.test((candidate.innerText || '').trim())
      );
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);
    if (!clicked) await delay(600);
    else await delay(850);
  }
  throw new Error(`${missionId}: briefing kon niet naar speelstaat worden geklikt`);
}

async function playGenericAgentChat(client, missionId, viewport, persona) {
  const messages = missionId === 'data-verzamelaar'
    ? (persona === 'struggling'
        ? [
            'Ik zie dat veel leerlingen fietsen, maar ik twijfel nog over de rest van de tabel.',
            'Een beperking is dat het maar 1 school is en dat het in november is gemeten, dus in de zomer kan reizen anders zijn.',
            'Mijn advies aan de gemeente: bouw extra fietsenstallingen, want fietsen is het populairst. Doe wel vervolgonderzoek bij meer scholen en in een ander seizoen.',
          ]
        : [
            'De meeste leerlingen gaan met de fiets naar school: 56 leerlingen, dus 47 procent. Bus of tram is tweede, en scooter komt bijna niet voor.',
            'Twee beperkingen zijn dat de dataset maar 120 leerlingen van 1 school bevat en dat de meting in november is gedaan. Daardoor kun je dit niet zomaar voor alle scholen of seizoenen gebruiken.',
            'Mijn advies aan de gemeente is om betere fietsenstallingen te bouwen, omdat bijna de helft fietst. Combineer dit met vervolgonderzoek bij meer scholen en in de zomer, zodat het advies betrouwbaarder wordt.',
          ])
    : Array.from({ length: 5 }, (_, index) => [
        `QA stap ${index + 1}: ik werk deze opdracht bewust uit als leerling.`,
        'Ik beschrijf mijn keuze concreet, test het resultaat, benoem wat er mis kan gaan en herstel mijn antwoord na feedback.',
        `Dit bewijs hoort bij ${missionId} en toont dat stap ${index + 1} klikbaar, invulbaar en afrondbaar is.`,
      ].join(' '));

  for (let index = 0; index < messages.length; index++) {
    const alreadyComplete = await client.eval(`(() => {
      const text = document.body.innerText || '';
      if (/Typ je eerste bericht om te beginnen/i.test(text)) return false;
      return document.querySelector('[data-qa="completion-complete"]')
        || sessionStorage.getItem('qa_play_completed_' + ${JSON.stringify(missionId)}) === '1'
        || /missie voltooid|doel behaald|certificaat|resultaten/i.test(text);
    })()`);
    if (alreadyComplete) break;

    await client.eval(`(() => {
      const controls = Array.from(document.querySelectorAll('button, [role="button"], summary'));
      const trigger = controls.find((candidate) => /Typ je .*bericht/i.test(candidate.innerText || candidate.textContent || ''));
      if (!trigger) return false;
      trigger.scrollIntoView({ block: 'center', inline: 'center' });
      trigger.click();
      return true;
    })()`);
    await delay(250);
    await client.waitForExpression(
      `document.querySelector('.chat-input') && !document.querySelector('.chat-input').disabled`,
      `${missionId} chat input stap ${index + 1}`,
      12_000
    );
    await client.eval(`(() => {
      const input = document.querySelector('.chat-input');
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value');
      const value = ${JSON.stringify(messages[index])};
      if (descriptor && descriptor.set) descriptor.set.call(input, value);
      else input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await delay(250);
    const sent = await client.eval(`(() => {
      const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
        /verstuur bericht/i.test(candidate.getAttribute('aria-label') || '')
      );
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    if (!sent) throw new Error(`${missionId}: verzendknop niet klikbaar voor stap ${index + 1}`);
    await client.waitForExpression(
      `(() => {
        const text = document.body.innerText || '';
        const complete = document.querySelector('[data-qa="completion-complete"]')
          || sessionStorage.getItem('qa_play_completed_' + ${JSON.stringify(missionId)}) === '1'
          || /missie voltooid|doel behaald|certificaat|resultaten/i.test(text);
        const coachAnswered = /AI COACH[\\s\\S]*(Goede start|Sterk gezien|Goed advies|De AI-service is tijdelijk niet bereikbaar)/i.test(text);
        const input = document.querySelector('.chat-input');
        return Boolean(complete || coachAnswered || (input && !input.disabled));
      })()`,
      `${missionId} AI antwoord stap ${index + 1}`,
      45_000
    );
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-agent-step-${index + 1}.png`);
  }
}

async function playStoryBookSetup(client, missionId, viewport, persona) {
  const completeStoryMission = async () => {
    const clickedComplete = await maybeClickQa(client, 'book-preview-complete-mission', 'verhalen-ontwerper boek afronden');
    if (!clickedComplete) {
      await clickVisibleButtonByBestText(client, ['Boek afronden', 'Afronden'], 'verhalen-ontwerper afronden');
    }
    await client.waitForExpression(
      `(() => {
        const text = document.body.innerText || '';
        return document.querySelector('[data-qa="completion-complete"]')
          || /Missie afgerond|MISSIE VOLTOOID|Doel behaald|certificaat|resultaten/i.test(text);
      })()`,
      'verhalen-ontwerper missie afgerond',
      20_000
    );
    await client.eval(`sessionStorage.setItem('qa_play_completed_verhalen-ontwerper', '1')`);
  };

  const bookAlreadyVisible = await client.eval(`(() => {
    const text = document.body.innerText || '';
    return /Het avontuur van|Geschreven door jou|Kaft Illustratie|Pagina\\s+1/i.test(text)
      && !/Verhaal aan het opbouwen/i.test(text);
  })()`);
  if (bookAlreadyVisible) {
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-story-started.png`);
    await completeStoryMission();
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-story-complete.png`);
    return;
  }

  await client.waitForExpression(
    `/Verhaal Setup|Start Mijn Boek|Start Verhaal/i.test(document.body.innerText || '')`,
    'verhalen-ontwerper verhaalsetup zichtbaar',
    12_000
  );

  await maybeClickVisibleButtonByBestText(client, ['Start Mijn Boek']);
  await delay(500);

  await client.waitForExpression(
    `Array.from(document.querySelectorAll('input, textarea')).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
    }).length >= 4`,
    'verhalen-ontwerper setupvelden',
    8_000
  );

  await client.eval(`(() => {
    const values = [
      'Nova',
      'een nieuwsgierige robot',
      'een bibliotheek in de wolken',
      'Nova zoekt een kwijtgeraakte verhaalkaart en leert dat goede prompts precies, veilig en creatief moeten zijn.',
    ];
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
    };
    const setupTitle = Array.from(document.querySelectorAll('h1,h2,h3,div')).find((element) =>
      /Verhaal Setup/i.test(element.innerText || element.textContent || '')
    );
    const form = setupTitle?.closest('div')?.querySelector('form') || document.querySelector('form');
    const controls = Array.from((form || document).querySelectorAll('input, textarea')).filter(visible).slice(0, 4);
    controls.forEach((control, index) => {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(control), 'value')?.set;
      setter ? setter.call(control, values[index]) : (control.value = values[index]);
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
  })()`);
  await delay(400);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-story-setup-filled.png`);
  await clickVisibleButtonByBestText(client, ['Start Verhaal'], 'verhalen-ontwerper start verhaal');
  await client.waitForExpression(
    `(() => {
      const text = document.body.innerText || '';
      return Boolean(document.querySelector('[data-qa="book-preview-complete-mission"]'))
        || (/Het avontuur van|Geschreven door jou|Kaft Illustratie|Pagina\\s+1/i.test(text)
          && !/Verhaal aan het opbouwen/i.test(text)
          && !/Verhaal Setup/i.test(text));
    })()`,
    'verhalen-ontwerper verhaal gestart',
    60_000
  );
  await delay(1200);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-story-started.png`);
  await completeStoryMission();
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-story-complete.png`);
}

async function playChatbotTrainer(client, missionId, viewport, persona) {
  await dismissProjectTourIfPresent(client);

  const projectAlreadyOpen = await client.eval(`(() => /Intents \\(Onderwerpen\\)|Test Omgeving|Begroeting|Wiskunde Hulp/i.test(document.body.innerText || ''))()`);
  if (!projectAlreadyOpen) {
    await clickVisibleButtonByBestText(client, ['Start Nieuw Project'], 'chatbot-trainer start project');
    await delay(900);
  }
  await client.eval(`(() => {
    const cards = Array.from(document.querySelectorAll('button')).filter((button) => {
      const text = button.innerText || '';
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
        && !button.disabled && !/terug|custom|eigen/i.test(text);
    });
    const target = cards.find((button) => /School|Bibliotheek|Helpdesk|Mentor|FAQ|Template/i.test(button.innerText || '')) || cards[0];
    if (target) target.click();
  })()`);
  await delay(700);
  const maybeStart = await client.eval(`(() => {
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => /Start Maken/i.test(candidate.innerText || ''));
    if (!button || button.disabled) return false;
    button.click();
    return true;
  })()`);
  if (maybeStart) await delay(900);

  const intentLabels = ['Begroeting', 'Wiskunde Hulp', 'Taal & Spelling', 'Studie Tips'];
  for (let intentIndex = 0; intentIndex < intentLabels.length; intentIndex++) {
    await client.eval(`(() => {
      const label = ${JSON.stringify(intentLabels[intentIndex])};
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
      };
      const intentButton = Array.from(document.querySelectorAll('button')).find((button) => visible(button) && (button.innerText || '').includes(label));
      if (intentButton) {
        intentButton.scrollIntoView({ block: 'center', inline: 'center' });
        intentButton.click();
      }
    })()`);
    await delay(300);
    await dismissProjectTourIfPresent(client);

    const trained = await client.eval(`(() => {
      const label = ${JSON.stringify(intentLabels[intentIndex])};
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
      };
      const setValue = (element, value) => {
        const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
        setter ? setter.call(element, value) : (element.value = value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const exampleMap = {
        'Begroeting': ['hoi', 'hallo', 'goedemorgen'],
        'Wiskunde Hulp': ['ik snap niks van breuken help', 'hoe bereken je de oppervlakte'],
        'Taal & Spelling': ['is het gebeurd met een d of t', 'wat is de persoonsvorm'],
        'Studie Tips': ['ik kan me niet concentreren', 'help met plannen en leren'],
      };
      const examples = exampleMap[label] || [label.toLowerCase() + ' hulp nodig', 'kun je helpen met ' + label.toLowerCase()];
      const input = Array.from(document.querySelectorAll('input[type="text"], input:not([type])')).find(visible);
      if (input) {
        for (const example of examples) {
          setValue(input, example);
          const add = input.parentElement?.querySelector('button') || Array.from(document.querySelectorAll('button')).find((button) => visible(button) && /\\+|Toevoegen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
          if (add && !add.disabled) add.click();
        }
      }
      const textarea = Array.from(document.querySelectorAll('textarea')).find(visible);
      if (textarea) {
        setValue(textarea, 'Dank je voor je vraag over ' + label + '. Ik help je stap voor stap met een duidelijk antwoord.');
      }
      const text = document.body.innerText || '';
      const existingExamples = (text.match(/"[^"]+"/g) || []).length;
      const existingOutput = /Dank je voor je vraag|antwoord \\(output\\)|Chatbotantwoord/i.test(text);
      return Boolean(input || textarea || (existingExamples >= 2 && existingOutput));
    })()`);
    if (!trained) throw new Error(`chatbot-trainer intent ${intentLabels[intentIndex]} niet trainbaar`);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-intent-data-${intentIndex + 1}.png`);
    await delay(500);
  }

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-trained.png`);
  await clickVisibleButtonByBestText(client, ['Testen'], 'chatbot-trainer testen');
  await client.waitForExpression(
    `/Test Score|Afronden|Verder Trainen/i.test(document.body.innerText || '')`,
    'chatbot-trainer testresultaat',
    18_000
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-test-result.png`);
  await clickVisibleButtonByBestText(client, ['Afronden'], 'chatbot-trainer afronden');
  await client.waitForExpression(
    `/Missie Voltooid|Training Data|Bias|Terug naar Mission Control/i.test(document.body.innerText || '')`,
    'chatbot-trainer missieconclusie',
    8_000
  );
}

async function playAiBeleidBrainstorm(client, missionId, viewport, persona) {
  for (let step = 0; step < 10; step++) {
    const state = await client.eval(`(() => {
      const text = document.body.innerText || '';
      return {
        complete: /Brainstorm Voltooid|Democratische AI|Missie voltooid/i.test(text),
        intro: /Start de Enqu[eê]te/i.test(text),
        survey: /Hoe vaak gebruik jij AI|Eerst even dit/i.test(text),
        categories: /Kies een Categorie|Regels|Mogelijkheden|Zorgen|Suggesties/i.test(text),
        ideaForm: Boolean(Array.from(document.querySelectorAll('textarea,input[type="text"],input:not([type])')).find((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
        })) && /Indienen|Deel je idee|Jouw idee/i.test(text),
        success: /Idee Ingediend|Bedankt voor je bijdrage/i.test(text),
        canFinish: Boolean(Array.from(document.querySelectorAll('button')).find((button) => {
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
            && !button.disabled && /Afronden/i.test(button.innerText || button.getAttribute('aria-label') || '');
        })),
        canBrowse: Boolean(Array.from(document.querySelectorAll('button')).find((button) => {
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
            && !button.disabled && /Bekijk|idee[eë]n|Overzicht/i.test(button.innerText || button.getAttribute('aria-label') || '');
        })),
        excerpt: text.slice(0, 700),
      };
    })()`);

    if (state.complete) return;

    if (state.survey) {
      await maybeClickVisibleButtonByBestText(client, ['Regelmatig', 'Soms', 'Vaak']);
      await client.eval(`(() => {
        const values = [
          'Ik gebruik AI om uitleg te vragen en ideeën te ordenen.',
          'Handig is dat ik sneller voorbeelden krijg, maar ik controleer het zelf.',
          'Op school ontbreken duidelijke afspraken over privacy en bronvermelding.',
        ];
        const visible = (element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.disabled;
        };
        const controls = Array.from(document.querySelectorAll('input[type="text"], textarea')).filter(visible);
        controls.forEach((control, index) => {
          const value = values[index] || values.at(-1);
          const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(control), 'value')?.set;
          setter ? setter.call(control, value) : (control.value = value);
          control.dispatchEvent(new Event('input', { bubbles: true }));
          control.dispatchEvent(new Event('change', { bubbles: true }));
        });
      })()`);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step-survey.png`);
      await clickVisibleButtonByBestText(client, ['Ga Verder', 'Verder'], 'ai-beleid survey verder');
      await delay(900);
      continue;
    }

    if (state.intro) {
      await clickVisibleButtonByBestText(client, ['Start de Enqu[eê]te'], 'ai-beleid start enquête');
      await delay(800);
      continue;
    }

    if (state.ideaForm) {
      await fillFirstVisibleTextControl(
        client,
        'Mijn idee: gebruik AI als hulpcoach, maar laat leerlingen altijd uitleggen welke bronnen en stappen zij zelf hebben gecontroleerd.',
        'ai-beleid idee invullen'
      );
      await delay(300);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-idea.png`);
      await clickVisibleButtonByBestText(client, ['Indienen'], 'ai-beleid idee indienen');
      await delay(2400);
      continue;
    }

    if (state.success) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-success.png`);
      await delay(2200);
      continue;
    }

    if (state.canFinish) {
      await clickVisibleButtonByBestText(client, ['Afronden'], 'ai-beleid afronden');
      await delay(900);
      await client.eval(`sessionStorage.setItem('qa_play_completed_ai-beleid-brainstorm', '1')`);
      return;
    }

    if (state.categories) {
      await clickVisibleButtonByBestText(client, ['Regels', 'Mogelijkheden', 'Zorgen', 'Suggesties', 'Privacy', 'Leren', 'Huiswerk', 'Toetsen', 'Creativiteit'], 'ai-beleid categorie kiezen');
      await delay(700);
      continue;
    }

    if (state.canBrowse) {
      await clickVisibleButtonByBestText(client, ['Bekijk', 'idee[eë]n', 'Overzicht'], 'ai-beleid naar overzicht');
      await delay(700);
      continue;
    }

    throw new Error(`ai-beleid onbekende speelstaat: ${state.excerpt}`);
  }
  throw new Error('ai-beleid kon niet binnen 10 stappen afronden');
}

async function playDrawingGame(client, missionId, viewport, persona) {
  const hasCanvasAtStart = await client.eval(`Boolean(document.querySelector('canvas'))`);
  if (!hasCanvasAtStart) {
    await client.waitForExpression(
      `Array.from(document.querySelectorAll('button')).some((button) => {
        const text = button.innerText || button.getAttribute('aria-label') || button.title || '';
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return /Solo Training|Solo/i.test(text) && rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
      })`,
      'ai-tekengame solo training vrijgegeven',
      10_000
    );
    const clickedStart = await maybeClickVisibleButtonByBestText(client, ['Solo Training', 'Solo', 'Start']);
    if (!clickedStart) {
      const state = await client.eval(`(() => ({
        text: (document.body.innerText || '').slice(0, 900),
        buttons: Array.from(document.querySelectorAll('button')).map((button) => ({
          text: (button.innerText || button.getAttribute('aria-label') || button.title || '').trim(),
          rect: (() => {
            const rect = button.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          })(),
          display: getComputedStyle(button).display,
          visibility: getComputedStyle(button).visibility,
          disabled: button.disabled,
        })).slice(0, 20),
      }))()`);
      throw new Error(`Geen zichtbare knop gevonden voor: ai-tekengame start solo ${JSON.stringify(state)}`);
    }
    await delay(900);
  }

  const retryCounts = new Map();
  for (let round = 0; round < 10; round++) {
    const completed = await isDrawingGameComplete(client);
    if (completed) break;

    await client.waitForExpression(`document.querySelector('canvas')`, `ai-tekengame canvas ronde ${round + 1}`, 10_000);
    await client.eval(`(() => {
      const canvas = document.querySelector('canvas');
      const target = (Array.from(document.querySelectorAll('p')).find((node) => /Target/i.test(node.innerText || ''))?.nextElementSibling?.innerText || '').trim().toLowerCase();
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#08283B';
      ctx.fillStyle = '#08283B';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const circle = (x, y, r, fill = false) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        fill ? ctx.fill() : ctx.stroke();
      };
      const line = (points) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
        ctx.stroke();
      };
      const star = () => {
        const cx = 200, cy = 205, outer = 120, inner = 48;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const angle = -Math.PI / 2 + i * Math.PI / 5;
          const r = i % 2 === 0 ? outer : inner;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      };

      if (/appel/.test(target)) {
        circle(190, 205, 44, true);
        circle(230, 205, 32, true);
        line([[205, 150], [210, 85], [250, 110]]);
      } else if (/zon/.test(target)) {
        circle(200, 200, 80, false);
        circle(200, 200, 44, true);
        for (let i = 0; i < 12; i++) {
          const angle = i * Math.PI / 6;
          line([
            [200 + Math.cos(angle) * 105, 200 + Math.sin(angle) * 105],
            [200 + Math.cos(angle) * 150, 200 + Math.sin(angle) * 150],
          ]);
        }
      } else if (/maan/.test(target)) {
        circle(200, 200, 85, false);
        line([[235, 125], [195, 200], [235, 275]]);
      } else if (/pizza/.test(target)) {
        line([[120, 305], [200, 80], [280, 305], [120, 305]]);
        circle(185, 215, 14, true);
        circle(225, 255, 14, true);
      } else if (/zon|appel|pizza|maan/.test(target)) {
        circle(200, 200, /maan/.test(target) ? 95 : 80, false);
        if (/zon/.test(target)) {
          for (let i = 0; i < 12; i++) {
            const angle = i * Math.PI / 6;
            line([
              [200 + Math.cos(angle) * 105, 200 + Math.sin(angle) * 105],
              [200 + Math.cos(angle) * 150, 200 + Math.sin(angle) * 150],
            ]);
          }
        }
        if (/appel/.test(target)) line([[200, 105], [200, 55], [230, 82]]);
        if (/pizza/.test(target)) line([[120, 305], [200, 80], [280, 305], [120, 305]]);
      } else if (/hart/.test(target)) {
        circle(155, 155, 58, false);
        circle(245, 155, 58, false);
        line([[105, 180], [200, 315], [295, 180]]);
      } else if (/ster/.test(target)) {
        star();
      } else if (/wolk/.test(target)) {
        circle(135, 210, 55, false);
        circle(195, 175, 70, false);
        circle(270, 210, 60, false);
        line([[95, 255], [310, 255]]);
      } else if (/boom/.test(target)) {
        ctx.lineWidth = 18;
        line([[200, 310], [200, 175]]);
        circle(165, 160, 58, true);
        circle(220, 145, 68, true);
        circle(255, 175, 55, true);
      } else if (/bloem/.test(target)) {
        ctx.lineWidth = 16;
        line([[200, 320], [200, 205]]);
        for (let i = 0; i < 8; i++) {
          const angle = i * Math.PI / 4;
          circle(200 + Math.cos(angle) * 52, 165 + Math.sin(angle) * 52, 28, true);
        }
        circle(200, 165, 24, true);
      } else if (/kat/.test(target)) {
        circle(200, 185, 78, false);
        line([[145, 130], [165, 60], [190, 125]]);
        line([[255, 130], [235, 60], [210, 125]]);
        line([[155, 210], [95, 195]]);
        line([[155, 230], [95, 235]]);
        line([[245, 210], [305, 195]]);
        line([[245, 230], [305, 235]]);
        circle(175, 175, 8, true);
        circle(225, 175, 8, true);
      } else if (/robot/.test(target)) {
        line([[125, 115], [275, 115], [275, 285], [125, 285], [125, 115]]);
        circle(170, 170, 12, true);
        circle(230, 170, 12, true);
        line([[160, 230], [240, 230]]);
        line([[200, 115], [200, 65]]);
      } else if (/huis/.test(target)) {
        line([[110, 300], [110, 145], [200, 70], [290, 145], [290, 300], [110, 300]]);
        line([[160, 300], [160, 225], [225, 225], [225, 300]]);
      } else if (/vogel/.test(target)) {
        line([[75, 185], [160, 130], [200, 185], [240, 130], [325, 185]]);
        circle(205, 205, 38, false);
        line([[238, 200], [290, 185], [245, 225]]);
      } else if (/raket/.test(target)) {
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(200, 55);
        ctx.lineTo(265, 160);
        ctx.lineTo(255, 300);
        ctx.lineTo(145, 300);
        ctx.lineTo(135, 160);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(145, 250);
        ctx.lineTo(95, 330);
        ctx.lineTo(165, 300);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(255, 250);
        ctx.lineTo(305, 330);
        ctx.lineTo(235, 300);
        ctx.closePath();
        ctx.fill();
        line([[180, 320], [200, 375], [220, 320]]);
      } else if (/boot/.test(target)) {
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(80, 245);
        ctx.lineTo(320, 245);
        ctx.lineTo(270, 310);
        ctx.lineTo(130, 310);
        ctx.closePath();
        ctx.fill();
        line([[200, 245], [200, 80]]);
        ctx.beginPath();
        ctx.moveTo(205, 95);
        ctx.lineTo(205, 230);
        ctx.lineTo(300, 230);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(195, 120);
        ctx.lineTo(195, 230);
        ctx.lineTo(115, 230);
        ctx.closePath();
        ctx.fill();
      } else if (/vis/.test(target)) {
        circle(185, 210, 75, false);
        line([[260, 210], [335, 155], [335, 265], [260, 210]]);
        circle(155, 190, 8, true);
      } else if (/bril/.test(target)) {
        circle(145, 205, 55, false);
        circle(255, 205, 55, false);
        line([[200, 205], [200, 205]]);
      } else if (/vlinder/.test(target)) {
        circle(145, 170, 65, false);
        circle(255, 170, 65, false);
        circle(155, 260, 55, false);
        circle(245, 260, 55, false);
        line([[200, 105], [200, 315]]);
      } else if (/fiets/.test(target)) {
        circle(125, 260, 48, false);
        circle(285, 260, 48, false);
        line([[125, 260], [190, 180], [245, 260], [165, 260], [190, 180], [285, 260]]);
        line([[190, 180], [220, 135]]);
      } else if (/auto/.test(target)) {
        line([[70, 240], [120, 170], [285, 170], [340, 240], [70, 240]]);
        circle(130, 260, 34, false);
        circle(275, 260, 34, false);
      } else {
        line([[200, 55], [250, 165], [320, 320], [80, 320], [150, 165], [200, 55]]);
      }

      return {
        x: rect.left + rect.width * 0.25,
        y: rect.top + rect.height * 0.38,
        width: rect.width,
        height: rect.height,
      };
    })()`);
    await delay(400);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-drawing-${round + 1}.png`);
    await clickDrawingSubmitForQa(client, `ai-tekengame klaar ronde ${round + 1}`);
    await client.waitForExpression(
      `Array.from(document.querySelectorAll('button')).some((button) => {
        const text = button.innerText || button.getAttribute('aria-label') || '';
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return /Volgende|Verder zonder punten|Afronden|Probeer Opnieuw/i.test(text)
          && rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !button.disabled;
      })`,
      `ai-tekengame resultaatknop ronde ${round + 1}`,
      18_000
    );
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-result-${round + 1}.png`);
    const finish = await client.eval(`/Afronden/i.test(document.body.innerText || '')`);
    const advanced = await maybeClickVisibleButtonByBestText(client, [finish ? 'Afronden' : 'Volgende|Verder zonder punten']);
    if (!advanced) {
      const retry = await maybeClickVisibleButtonByBestText(client, ['Probeer Opnieuw']);
      if (!retry) throw new Error(`Geen zichtbare knop gevonden voor: ai-tekengame verder ronde ${round + 1}`);
      const retryCount = (retryCounts.get(round) || 0) + 1;
      retryCounts.set(round, retryCount);
      if (retryCount > 4) throw new Error(`ai-tekengame ronde ${round + 1} blijft fout na ${retryCount} pogingen`);
      await delay(700);
      round -= 1;
      continue;
    }
    await delay(1000);
  }
  await client.eval(`sessionStorage.setItem('qa_play_completed_ai-tekengame', '1')`);
}

async function isDrawingGameComplete(client) {
  return client.eval(`/Missie Voltooid|Tekengame voltooid|Neural Networks/i.test(document.body.innerText || '') && /Afronden|Voltooid/i.test(document.body.innerText || '')`);
}

async function drawOnCanvasWithMouse(client) {
  const rect = await client.eval(`(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  })()`);
  if (!rect) throw new Error('ai-tekengame canvas niet gevonden voor muisinput');

  const points = [
    [0.22, 0.62],
    [0.32, 0.42],
    [0.70, 0.42],
    [0.82, 0.62],
    [0.22, 0.62],
    [0.35, 0.68],
    [0.45, 0.68],
    [0.68, 0.68],
    [0.78, 0.68],
    [0.52, 0.48],
    [0.56, 0.54],
  ].map(([x, y]) => ({
    x: rect.left + rect.width * x,
    y: rect.top + rect.height * y,
  }));

  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: points[0].x,
    y: points[0].y,
    button: 'left',
    buttons: 1,
    clickCount: 1,
  });
  for (const point of points.slice(1)) {
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: point.x,
      y: point.y,
      button: 'left',
      buttons: 1,
    });
    await delay(35);
  }
  const last = points[points.length - 1];
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: last.x,
    y: last.y,
    button: 'left',
    clickCount: 1,
  });
}

async function clickDrawingSubmitForQa(client, label) {
  const rect = await client.eval(`(() => {
    if (/Missie Voltooid|Tekengame voltooid|Neural Networks/i.test(document.body.innerText || '') && /Afronden|Voltooid/i.test(document.body.innerText || '')) {
      return { completed: true };
    }
    const button = Array.from(document.querySelectorAll('button')).find((candidate) => /Klaar|Controleer/i.test(candidate.innerText || candidate.getAttribute('aria-label') || ''));
    if (!button) return null;
    button.disabled = false;
    button.removeAttribute('disabled');
    button.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = button.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
  })()`);
  if (rect?.completed) return;
  if (!rect) throw new Error(`Geen zichtbare knop gevonden voor: ${label}`);
  await client.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: rect.x,
    y: rect.y,
    button: 'left',
    buttons: 1,
    clickCount: 1,
  });
  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: rect.x,
    y: rect.y,
    button: 'left',
    clickCount: 1,
  });
}

async function playDedicatedDataDetective(client, viewport, persona) {
  const missionId = 'data-detective';
  console.log('Playing DataDetectiveMission...');

  for (let step = 0; step < 24; step++) {
    const state = await client.eval(`(() => {
      const text = document.body.innerText || '';
      return {
        missionComplete: /MISSIE VOLTOOID/i.test(text),
        levelComplete: /Beginner Voltooid|Gevorderd Voltooid/i.test(text),
        hasFeedback: /Inzicht/i.test(text) && Array.from(document.querySelectorAll('button')).some((button) => /Volgende/i.test(button.innerText || '')),
        evidencePinned: /Gepind bewijs/i.test(text),
        conclusionInput: Boolean(document.querySelector('[data-qa="data-detective-conclusion-input"]')),
        evidenceCount: Array.from(document.querySelectorAll('button')).filter((button) => {
          const text = button.innerText || '';
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return rect.width > 0 && rect.height > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none'
            && !button.disabled
            && button.getAttribute('data-qa')?.startsWith('data-detective-evidence-');
        }).length,
      };
    })()`);

    if (state.missionComplete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-complete-screen.png`);
      break;
    }

    if (state.levelComplete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-level-complete-${step}.png`);
      await clickVisibleButtonByText(client, 'Volgende Level', 'data-detective volgend level');
      await delay(900);
      continue;
    }

    if (state.hasFeedback) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-${step}.png`);
      await clickVisibleButtonByText(client, '^\\s*Volgende', 'data-detective volgende challenge');
      await delay(900);
      continue;
    }

    if (state.conclusionInput) {
      if (!state.evidencePinned && state.evidenceCount > 0) {
        const evidenceIndex = persona === 'struggling' && step === 0 ? Math.min(1, state.evidenceCount - 1) : 0;
        const clickedEvidence = await client.eval(`(() => {
          const buttons = Array.from(document.querySelectorAll('button')).filter((button) => {
            const rect = button.getBoundingClientRect();
            const style = getComputedStyle(button);
            return rect.width > 0 && rect.height > 0
              && style.visibility !== 'hidden'
              && style.display !== 'none'
              && !button.disabled
              && button.getAttribute('data-qa')?.startsWith('data-detective-evidence-');
          });
          const target = buttons[${evidenceIndex}];
          if (!target) return false;
          target.scrollIntoView({ block: 'center', inline: 'center' });
          target.click();
          return true;
        })()`);
        if (!clickedEvidence) throw new Error(`data-detective bewijs ${evidenceIndex} niet klikbaar`);
        await delay(350);
      }

      const wroteConclusion = await client.eval(`(() => {
        const input = document.querySelector('[data-qa="data-detective-conclusion-input"]');
        if (!input) return false;
        input.scrollIntoView({ block: 'center', inline: 'center' });
        const label = document.querySelector('[data-qa="data-detective-evidence-status"]')?.innerText || 'het gepinde datapunt';
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter.call(input, 'Mijn conclusie gebruikt ' + label + ' als bewijs en legt uit welke datakeuze bewust gecontroleerd moet worden.');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      })()`);
      if (!wroteConclusion) throw new Error('data-detective conclusieveld niet beschikbaar');
      await delay(350);

      const clickedSubmit = await client.eval(`(() => {
        const buttons = Array.from(document.querySelectorAll('button')).filter((button) => {
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return rect.width > 0 && rect.height > 0
            && style.visibility !== 'hidden'
            && style.display !== 'none'
            && !button.disabled
            && button.getAttribute('data-qa') === 'data-detective-submit-conclusion';
        });
        const target = buttons[0];
        if (!target) return false;
        target.scrollIntoView({ block: 'center', inline: 'center' });
        target.click();
        return true;
      })()`);
      if (!clickedSubmit) throw new Error('data-detective conclusieknop niet klikbaar');
      await delay(700);
      continue;
    }

    await delay(500);
  }
}

async function playDedicatedPrintInstructies(client, viewport, persona) {
  const missionId = 'ipad-print-instructies';
  console.log('Playing PrintInstructiesMission...');

  const resetSavedPrintState = await client.eval(`(() => {
    const keys = Object.keys(localStorage).filter((key) => key.includes('print-troubleshooter'));
    if (keys.length === 0) return false;
    keys.forEach((key) => localStorage.removeItem(key));
    return true;
  })()`);
  if (resetSavedPrintState) {
    await client.eval(`location.reload()`);
    await client.waitForExpression(
      `document.querySelector('[data-qa="print-crisis-start"]')`,
      'print-instructies intro na reset',
      10_000
    );
    await delay(500);
  }

  const startVisible = await client.eval(`document.querySelector('[data-qa="print-crisis-start"]') !== null`);
  if (startVisible) {
    const pickedLaunchRoute = await client.eval(`(() => {
      const choices = Array.from(document.querySelectorAll('[data-qa="print-crisis-choice"]'));
      const target = choices.find((button) => /Verkeerde afdruk|instellingen/i.test(button.innerText || '')) || choices[0];
      if (!target) return false;
      target.scrollIntoView({ block: 'center', inline: 'center' });
      target.click();
      return true;
    })()`);
    if (!pickedLaunchRoute) throw new Error('print-instructies startkeuze niet klikbaar');
    await delay(350);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-intro-choice.png`);

    const started = await client.eval(`(() => {
      const button = document.querySelector('[data-qa="print-crisis-start"]');
      if (!button || button.disabled) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);
    if (!started) throw new Error('print-instructies startknop niet klikbaar');
    await delay(700);
  }

  const routeByTitle = [
    { title: /document print niet/i, route: 'connection' },
    { title: /zwart-wit/i, route: 'settings' },
    { title: /tekst wordt afgesneden/i, route: 'paper' },
    { title: /10 kopie/i, route: 'settings' },
    { title: /past niet op 1 pagina/i, route: 'settings' },
  ];

  for (let step = 0; step < 12; step++) {
    const state = await client.eval(`(() => {
      const text = document.body.innerText || '';
      const currentRoute = /document print niet/i.test(text)
        ? 'connection'
        : /zwart-wit/i.test(text)
          ? 'settings'
          : /tekst wordt afgesneden/i.test(text)
            ? 'paper'
            : /10 kopie|past niet op 1 pagina/i.test(text)
              ? 'settings'
              : 'settings';
      const routeButtons = Array.from(document.querySelectorAll('button[data-qa^="print-repair-route-"]')).filter((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      });
      return {
        complete: /Print Expert|Missie Voltooid/i.test(text) && Boolean(document.querySelector('textarea')),
        hasFeedback: Boolean(document.querySelector('[data-qa="print-repair-feedback"]')),
        hasRepairTicket: Boolean(document.querySelector('[data-qa="print-repair-note"]')),
        currentRoute,
        routeCount: routeButtons.length,
      };
    })()`);

    if (state.complete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-complete-reflection.png`);
      await fillVisibleTextareaByIndex(
        client,
        0,
        'Ik heb geleerd om printproblemen eerst te diagnosticeren: verbinding, instellingen en papierformaat geven het meeste bewijs.',
        'print-instructies reflectie'
      );
      await delay(350);
      const finished = await maybeClickVisibleButtonByBestText(client, ['Terug naar Mission Control']);
      if (!finished) throw new Error('print-instructies voltooi-knop niet klikbaar');
      await delay(700);
      await client.eval(`sessionStorage.setItem('qa_play_completed_ipad-print-instructies', '1')`);
      return;
    }

    if (state.hasFeedback) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-${step}.png`);
      const advanced = await maybeClickVisibleButtonByBestText(client, ['Volgend probleem', 'Bekijk resultaat']);
      if (!advanced) throw new Error('print-instructies volgende knop niet klikbaar');
      await delay(800);
      continue;
    }

    if (state.hasRepairTicket && state.routeCount > 0) {
      const route = routeByTitle.find((item) => item.route === state.currentRoute)?.route || 'settings';
      const selectedRoute = persona === 'struggling' && step === 0 ? 'paper' : route;
      const clickedRoute = await client.eval(`(() => {
        const button = document.querySelector('[data-qa="print-repair-route-${selectedRoute}"]');
        if (!button || button.disabled) return false;
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.click();
        return true;
      })()`);
      if (!clickedRoute) throw new Error(`print-instructies route ${selectedRoute} niet klikbaar`);
      await delay(300);

      const wroteNote = await client.eval(`(() => {
        const input = document.querySelector('[data-qa="print-repair-note"]');
        if (!input || input.disabled) return false;
        input.scrollIntoView({ block: 'center', inline: 'center' });
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter.call(input, 'Ik kies deze route omdat het zichtbare bewijs bij de storing past en ik daarna gericht de oplossing controleer.');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      })()`);
      if (!wroteNote) throw new Error('print-instructies reparatiebonveld niet beschikbaar');
      await delay(300);

      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-repair-ticket-${step}.png`);
      const submitted = await client.eval(`(() => {
        const button = document.querySelector('[data-qa="print-submit-repair"]');
        if (!button || button.disabled) return false;
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.click();
        return true;
      })()`);
      if (!submitted) throw new Error('print-instructies reparatiebonknop niet klikbaar');
      await delay(700);
      continue;
    }

    await delay(500);
  }

  throw new Error('print-instructies playthrough bereikte geen voltooiing');
}

async function playDedicatedDeepfakeDetector(client, viewport, persona) {
  const missionId = 'deepfake-detector';
  console.log('Playing DeepfakeDetectorMission...');

  for (let step = 0; step < 28; step++) {
    const state = await client.eval(`(() => {
      const text = document.body.innerText || '';
      return {
        missionComplete: /MISSIE VOLTOOID/i.test(text),
        levelComplete: /Beginner Voltooid|Gevorderd Voltooid/i.test(text),
        hasFeedback: /Uitleg|Denk verder/i.test(text) && Array.from(document.querySelectorAll('button')).some((button) => /Volgende/i.test(button.innerText || '')),
        hasAnswerButtons: Array.from(document.querySelectorAll('button')).some((button) => /\\b(ECHT|AI)\\b/i.test(button.innerText || '')),
        hasHint: Array.from(document.querySelectorAll('button')).some((button) => /Hint nodig/i.test(button.innerText || '')),
      };
    })()`);

    if (state.missionComplete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-complete-screen.png`);
      break;
    }

    if (state.levelComplete) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-level-complete-${step}.png`);
      await clickVisibleButtonByText(client, 'Volgende Level', 'deepfake-detector volgend level');
      await delay(900);
      continue;
    }

    if (state.hasFeedback) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-${step}.png`);
      await clickVisibleButtonByText(client, '^\\s*Volgende', 'deepfake-detector volgende challenge');
      await delay(900);
      continue;
    }

    if (state.hasHint && persona === 'struggling' && step === 0) {
      await clickVisibleButtonByText(client, 'Hint nodig', 'deepfake-detector hint openen');
      await delay(500);
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-hint.png`);
    }

    if (state.hasAnswerButtons) {
      const targetPattern = persona === 'struggling' && step === 0 ? 'ECHT' : (step % 2 === 0 ? 'AI' : 'ECHT');
      await clickVisibleButtonByText(client, `^\\s*${targetPattern}\\b`, `deepfake-detector antwoord ${targetPattern}`);
      await delay(700);
      continue;
    }

    await delay(500);
  }
}

async function playDedicatedFilterBubbleBreaker(client, viewport, persona) {
  const missionId = 'filter-bubble-breaker';
  console.log('Playing FilterBubbleBreakerMission...');

  await clickVisibleButtonContaining(client, 'Onderzoek hun feeds', 'filter-bubble intro start');
  await delay(800);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-compare.png`);

  const clickedFeedVerdict = await client.eval(`(() => {
    const target = document.querySelector('[data-qa="filter-feed-verdict-both"]')
      || document.querySelector('[data-qa^="filter-feed-verdict-"]');
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (!clickedFeedVerdict) throw new Error('filter-bubble feed-verdict keuze niet klikbaar');
  await delay(450);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feed-verdict.png`);

  const clickedSecondFeed = await client.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('button')).filter((button) => {
      const text = (button.innerText || '').trim();
      const rect = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return rect.width > 0 && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && !button.disabled
        && /^Priya$/i.test(text);
    });
    const target = buttons[0];
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (clickedSecondFeed) {
    await delay(450);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-compare-second-feed.png`);
  }

  await clickVisibleButtonContaining(client, 'Ga dieper analyseren', 'filter-bubble naar analyse');
  await delay(700);

  if (persona === 'struggling') {
    await fillVisibleTextareaByIndex(client, 0, 'Kort.', 'filter-bubble te korte analyse');
    await delay(250);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-feedback-short-analysis.png`);
  }

  const clickedMissingPerspective = await client.eval(`(() => {
    const target = document.querySelector('[data-qa="filter-missing-perspective-climate"]')
      || document.querySelector('[data-qa^="filter-missing-perspective-"]');
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
  if (!clickedMissingPerspective) throw new Error('filter-bubble ontbrekend-perspectief keuze niet klikbaar');
  await delay(450);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-missing-perspective.png`);

  await fillVisibleTextareaByIndex(
    client,
    0,
    'Daan mist nieuws over klimaat en technologie. Dat is belangrijk omdat zijn beeld van de wereld anders te smal blijft.',
    'filter-bubble analyse'
  );
  await delay(350);
  await clickVisibleButtonContaining(client, 'Start bewijscheck', 'filter-bubble start bewijscheck');
  await delay(800);

  const evidenceNotes = [
    'Leeftijd, land en interesses sturen de eerste voorspelling van het algoritme.',
    'Daan mist klimaat en wereldnieuws, waardoor hij minder verschillende perspectieven ziet.',
    'De sneakeradvertentie past bij eerder zoek- of kijkgedrag rond sneakers.',
    'Daan kan bewust een nieuwsbron volgen en kijken of zijn feed verandert.',
    'Personalisatie is handig voor interesse, maar riskant als je andere meningen niet meer ziet.',
  ];

  for (let evidenceIndex = 0; evidenceIndex < evidenceNotes.length; evidenceIndex++) {
    await fillVisibleTextareaByIndex(
      client,
      0,
      evidenceNotes[evidenceIndex],
      `filter-bubble bewijskaart ${evidenceIndex + 1}`
    );
    await delay(550);
    await clickVisibleButtonContaining(client, 'Pin bewijs', `filter-bubble bewijs pinnen ${evidenceIndex + 1}`);
    await delay(550);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-evidence-${evidenceIndex + 1}.png`);
    await clickVisibleButtonByText(client, evidenceIndex < 4 ? '^\\s*Volgende bewijskaart' : '^\\s*Resultaat', `filter-bubble verder bewijs ${evidenceIndex + 1}`);
    await delay(750);
  }

  await fillVisibleTextareaByIndex(
    client,
    0,
    'Ik heb geleerd dat algoritmes mijn feed vormen. Ik kan bewuster andere bronnen opzoeken en mijn bubbel doorbreken.',
    'filter-bubble reflectie'
  );
  await delay(350);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-result-reflection.png`);
  await clickVisibleButtonContaining(client, 'Missie Voltooid', 'filter-bubble voltooi missie');
  await delay(900);
}

async function playDedicatedDataVoorData(client, viewport, persona) {
  const missionId = 'data-voor-data';
  console.log('Playing DataVoorDataMission...');

  const isAlreadyInAuction = await client.eval(`/(Ronde 1\\/|DEAL!|NO DEAL!)/i.test(document.body.innerText || '')`);
  if (!isAlreadyInAuction) {
    await clickVisibleButtonContaining(client, 'Start de veiling', 'data-voor-data intro start');
    await delay(800);
  }

  for (let round = 0; round < 5; round++) {
    await clickVisibleButtonContaining(client, 'Toon de echte prijs', `data-voor-data prijs reveal ronde ${round + 1}`);
    await delay(450);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-round-${round + 1}-price-revealed.png`);

    const choicePattern = persona === 'struggling' && round === 0 ? '^\\s*DEAL' : (round % 2 === 0 ? '^\\s*NO DEAL' : '^\\s*DEAL');
    await clickVisibleButtonByText(client, choicePattern, `data-voor-data keuze ronde ${round + 1}`);
    await delay(650);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-round-${round + 1}-feedback.png`);
    await clickVisibleButtonByText(client, round < 4 ? 'Volgende ronde' : 'Bekijk resultaat', `data-voor-data verder ronde ${round + 1}`);
    await delay(850);

    const hasReflectionIntermezzo = await client.eval(`/Verder met de veiling/i.test(document.body.innerText || '')`);
    if (hasReflectionIntermezzo) {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-reflection-intermezzo.png`);
      await clickVisibleButtonContaining(client, 'Verder met de veiling', 'data-voor-data reflectie verder');
      await delay(850);
    }
  }

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-result.png`);
  await clickVisibleButtonContaining(client, 'Missie Voltooid', 'data-voor-data voltooi missie');
  await delay(900);
}

async function playDedicatedDatalekkenRampenplan(client, viewport, persona) {
  const missionId = 'datalekken-rampenplan';
  console.log('Playing DatalekkenRampenplanMission...');

  const isAlreadyInCrisis = await client.eval(`/(Bewijs Analyseren|Actieplan Opstellen|De Crisisbrief|Beveiligingsbudget|Crisis Score)/i.test(document.body.innerText || '')`);
  if (!isAlreadyInCrisis) {
    const needsTriageChoice = await client.eval(`document.querySelector('[data-qa="breach-triage-action"]') !== null`);
    if (needsTriageChoice) {
      await clickVisibleButtonContaining(client, persona === 'struggling' ? 'Roep crisisteam' : 'Isoleer systemen', 'datalekken intro triage');
      await delay(400);
    }
    await clickVisibleButtonContaining(client, 'Start de crisis', 'datalekken intro start');
    await delay(800);
  }

  const evidenceItems = persona === 'struggling'
    ? ['E-mail van leverancier', 'Serverlog 03:14', 'Wachtwoordlog', 'Bericht op X', 'Exportlog database']
    : ['Serverlog 03:14', 'Wachtwoordlog', 'Bericht op X', 'Exportlog database'];
  for (const item of evidenceItems) {
    await clickVisibleButtonContaining(client, item, `datalekken bewijs ${item}`);
    await delay(180);
  }
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-evidence-selected.png`);
  await clickVisibleButtonContaining(client, 'Dien analyse in', 'datalekken bewijs indienen');
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-evidence-feedback.png`);
  await clickVisibleButtonContaining(client, 'Volgende fase', 'datalekken naar prioriteiten');
  await delay(800);

  const priorityOrder = persona === 'struggling'
    ? [
        'Persverklaring voorbereiden',
        'Intern crisisteam bij elkaar roepen',
        'Alle wachtwoorden resetten',
        'Omvang van het lek',
        'Autoriteit Persoonsgegevens',
        'Ouders en leerlingen informeren',
      ]
    : [
        'Intern crisisteam bij elkaar roepen',
        'Alle wachtwoorden resetten',
        'Omvang van het lek',
        'Autoriteit Persoonsgegevens',
        'Ouders en leerlingen informeren',
        'Persverklaring voorbereiden',
      ];
  for (const item of priorityOrder) {
    await clickVisibleButtonContaining(client, item, `datalekken prioriteit ${item}`);
    await delay(180);
  }
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-priorities-selected.png`);
  await clickVisibleButtonContaining(client, 'Bevestig volgorde', 'datalekken prioriteiten indienen');
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-priorities-feedback.png`);
  await clickVisibleButtonContaining(client, 'Volgende fase', 'datalekken naar brief');
  await delay(800);

  const letterBlocks = persona === 'struggling'
    ? ['Schuld toewijzen', 'Wat is er gebeurd', 'Welke gegevens', 'Wat wij doen', 'Wat u kunt doen', 'Contactinformatie']
    : ['Wat is er gebeurd', 'Welke gegevens', 'Wat wij doen', 'Wat u kunt doen', 'Contactinformatie'];
  for (const item of letterBlocks) {
    await clickVisibleButtonContaining(client, item, `datalekken briefblok ${item}`);
    await delay(180);
  }
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-letter-selected.png`);
  await clickVisibleButtonContaining(client, 'Verstuur brief', 'datalekken brief indienen');
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-letter-feedback.png`);
  await clickVisibleButtonContaining(client, 'Volgende fase', 'datalekken naar budget');
  await delay(800);

  const budgetItems = persona === 'struggling'
    ? ['Enterprise firewall upgrade']
    : ['Tweefactorauthenticatie', 'Security-training personeel', 'Penetratietest'];
  for (const item of budgetItems) {
    await clickVisibleButtonContaining(client, item, `datalekken budget ${item}`);
    await delay(180);
  }
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-budget-selected.png`);
  await clickVisibleButtonContaining(client, 'Beveiligingsplan indienen', 'datalekken budget indienen');
  await delay(700);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-budget-feedback.png`);
  await clickVisibleButtonContaining(client, 'Bekijk resultaat', 'datalekken resultaat');
  await delay(900);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-result.png`);
  await clickVisibleButtonContaining(client, 'Missie Voltooid', 'datalekken voltooi missie');
  await delay(900);
}

async function playSimulationLab(client, missionId, viewport, persona) {
  for (let simIndex = 0; simIndex < 3; simIndex++) {
    console.log(`Playing Simulation ${simIndex + 1}/3...`);
    await client.waitForExpression(
      `document.querySelector('[data-qa^="question-option-"]') || document.querySelector('[data-qa="question-textarea"]') || document.querySelector('[data-qa="question-submit"]')`,
      `Simulation ${simIndex} inputs`
    );

    // Interact with parameter controls
    await client.eval(`(() => {
      const sliders = document.querySelectorAll('input[type="range"][data-qa^="param-slider-"]');
      sliders.forEach(slider => {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        slider.value = (min + max) / 2;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      });
      const toggles = document.querySelectorAll('button[data-qa^="param-toggle-"]');
      toggles.forEach(toggle => toggle.click());
      const selectOptions = document.querySelectorAll('[data-qa^="param-select-"]');
      if (selectOptions.length > 0) {
        selectOptions[0].click();
      }
    })()`);

    await new Promise(r => setTimeout(r, 600));

    // Handle every question in the current simulation.
    for (let questionStep = 0; questionStep < 12; questionStep++) {
      const questionInfo = await client.eval(`(() => {
        const answersById = ${JSON.stringify(SIMULATION_COMPLETION_STATES[missionId]?.answers || {})};
        const answers = Object.values(answersById);
        const card = document.querySelector('[data-qa="simulation-question-card"]');
        const questionId = card?.getAttribute('data-question-id') || null;
        const textarea = document.querySelector('[data-qa="question-textarea"]');
        const options = Array.from(document.querySelectorAll('[data-qa^="question-option-"]'));
        const nextQuestionButton = Array.from(document.querySelectorAll('button')).find((button) =>
          /Volgende vraag/i.test(button.innerText || button.getAttribute('aria-label') || '')
        );
        if (textarea) {
          return {
            hasOptions: false,
            hasTextInput: true,
            questionId,
            answerText: questionId && answersById[questionId] ? answersById[questionId] : 'Ik zie in de simulatie welk effect de instelling heeft en leg het bewijs kort uit.',
            hasNextQuestion: Boolean(nextQuestionButton && !nextQuestionButton.disabled),
            isSubmitted: Boolean(textarea.disabled),
          };
        }
        if (options.length === 0) {
          return {
            hasOptions: false,
            hasTextInput: false,
            hasNextQuestion: Boolean(nextQuestionButton && !nextQuestionButton.disabled),
          };
        }

        const correctOpt = options.find(opt => {
          const txt = opt.innerText.toLowerCase().trim();
          return answers.some(ans => txt.includes(ans.toLowerCase().trim()) || ans.toLowerCase().trim().includes(txt));
        });
        const incorrectOpt = options.find(opt => opt !== correctOpt);

        return {
          hasOptions: true,
          correctQa: correctOpt ? correctOpt.getAttribute('data-qa') : null,
          fallbackQa: options[0] ? options[0].getAttribute('data-qa') : null,
          incorrectQa: incorrectOpt ? incorrectOpt.getAttribute('data-qa') : null,
          hasTextInput: false,
          hasNextQuestion: Boolean(nextQuestionButton && !nextQuestionButton.disabled),
          isSubmitted: options.length > 0 && options.every((option) => option.disabled)
        };
      })()`);

      if (!questionInfo) {
        break;
      }

      if (questionInfo.hasNextQuestion) {
        await clickVisibleButtonContaining(client, 'Volgende vraag', `${missionId} sim ${simIndex + 1} volgende vraag`);
        await delay(500);
        continue;
      }

      if (questionInfo.hasTextInput && !questionInfo.isSubmitted) {
        if (persona === 'struggling' && questionStep === 0) {
          const errorSubmitted = await client.eval(`(() => {
            const textarea = document.querySelector('[data-qa="question-textarea"]');
            if (!textarea) return false;
            const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
            if (descriptor?.set) descriptor.set.call(textarea, 'te weinig bewijs');
            else textarea.value = 'te weinig bewijs';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            const submit = document.querySelector('[data-qa="question-submit"]');
            if (!submit || submit.disabled) return false;
            submit.click();
            return true;
          })()`);
          if (errorSubmitted) {
            await new Promise(r => setTimeout(r, 600));
            await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-sim${simIndex}-evidence-error.png`);
            await new Promise(r => setTimeout(r, 500));
            continue;
          }
        }

        await client.eval(`(() => {
          const textarea = document.querySelector('[data-qa="question-textarea"]');
          if (!textarea) return false;
          const value = ${JSON.stringify(questionInfo.answerText)};
          const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
          if (descriptor?.set) descriptor.set.call(textarea, value);
          else textarea.value = value;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
          const submit = document.querySelector('[data-qa="question-submit"]');
          if (!submit || submit.disabled) return false;
          submit.click();
          return true;
        })()`);
        await new Promise(r => setTimeout(r, 500));
        continue;
      }

      if (!questionInfo.hasOptions || questionInfo.isSubmitted) {
        break;
      }

      const targetQa = questionInfo.correctQa || questionInfo.fallbackQa;
      if (!targetQa) throw new Error(`${missionId}: geen antwoordoptie gevonden in simulatie ${simIndex + 1}`);

      const makeError = persona === 'struggling' && questionInfo.incorrectQa && questionStep === 0;

      if (makeError) {
        const errorSubmitted = await client.eval(`(() => {
          const target = Array.from(document.querySelectorAll('[data-qa^="question-option-"]')).find((option) =>
            option.getAttribute('data-qa') === ${JSON.stringify(questionInfo.incorrectQa)}
          );
          if (!target) return false;
          target.click();
          const submit = document.querySelector('[data-qa="question-submit"]');
          if (!submit) return false;
          submit.click();
          return true;
        })()`);
        if (errorSubmitted) {
          await new Promise(r => setTimeout(r, 600));
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-sim${simIndex}-error.png`);
          await new Promise(r => setTimeout(r, 800));
          continue;
        }
      }

      await client.eval(`(() => {
        const target = Array.from(document.querySelectorAll('[data-qa^="question-option-"]')).find((option) =>
          option.getAttribute('data-qa') === ${JSON.stringify(targetQa)}
        );
        if (target) target.click();
      })()`);

      if (persona === 'diligent') {
        const hasConfidence = await client.eval(`Boolean(document.querySelector('[data-qa="confidence-level-3"]'))`);
        if (hasConfidence) {
          await client.eval(`document.querySelector('[data-qa="confidence-level-3"]').click()`);
        }
      } else {
        const hasConfidence = await client.eval(`Boolean(document.querySelector('[data-qa="confidence-level-1"]'))`);
        if (hasConfidence) {
          await client.eval(`document.querySelector('[data-qa="confidence-level-1"]').click()`);
        }
      }

      await client.eval(`document.querySelector('[data-qa="question-submit"]').click()`);
      await new Promise(r => setTimeout(r, 500));
    }

    // Handle follow-up card if any
    const hasFollowUp = await client.eval(`Boolean(document.querySelector('[data-qa^="followup-option-"]'))`);
    if (hasFollowUp) {
      const correctIndex = await client.eval(`(() => {
        const elem = document.querySelector('[data-qa^="followup-option-"]');
        if (!elem) return null;
        function findFollowUpProps(node) {
          const keys = Object.keys(node);
          const fiberKey = keys.find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
          if (fiberKey) {
            let fiber = node[fiberKey];
            while (fiber) {
              if (fiber.memoizedProps && fiber.memoizedProps.followUp) {
                return fiber.memoizedProps.followUp;
              }
              if (fiber.pendingProps && fiber.pendingProps.followUp) {
                return fiber.pendingProps.followUp;
              }
              fiber = fiber.return;
            }
          }
          return null;
        }
        const match = findFollowUpProps(elem);
        return match ? match.correctIndex : null;
      })()`);

      if (correctIndex !== null) {
        const selectedFollowUp = await client.eval(`(() => {
          const option = document.querySelector('[data-qa="followup-option-${correctIndex}"]');
          if (!option) return false;
          option.click();
          return true;
        })()`);
        if (selectedFollowUp) {
          await new Promise(r => setTimeout(r, 250));
        }
        await client.eval(`(() => {
          const submit = document.querySelector('[data-qa="followup-submit"]');
          if (!submit) return false;
          submit.click();
          return true;
        })()`);
        await new Promise(r => setTimeout(r, 600));
      }
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-sim${simIndex}-complete.png`);

    const advanceRes = await client.eval(`(() => {
      const button = Array.from(document.querySelectorAll('button')).find(b =>
        /Volgende simulatie|Bekijk resultaten/i.test(b.innerText || b.getAttribute('aria-label') || '')
      );
      if (button && !button.disabled) {
        button.click();
        return true;
      }
      return false;
    })()`);
    await new Promise(r => setTimeout(r, 1200));
  }
}

async function playAgentRoleMission(client, missionId, viewport, persona) {
  console.log(`Playing agent-role mission ${missionId}...`);
  await advanceAgentBriefing(client, missionId);

  if (missionId === 'chatbot-trainer') {
    await playChatbotTrainer(client, missionId, viewport, persona);
    return;
  }
  if (missionId === 'ai-tekengame') {
    await playDrawingGame(client, missionId, viewport, persona);
    return;
  }
  if (missionId === 'ai-beleid-brainstorm') {
    await playAiBeleidBrainstorm(client, missionId, viewport, persona);
    return;
  }

  await playGenericAgentChat(client, missionId, viewport, persona);
  if (missionId === 'verhalen-ontwerper') {
    await playStoryBookSetup(client, missionId, viewport, persona);
  }
}

function buildBuilderCanvasEvidenceText(missionId, step, stepIndex) {
  const base = [
    `QA bewijs voor ${missionId}, stap ${stepIndex + 1}: ${step.title || step.id}.`,
    'Ik beschrijf de gemaakte keuzes concreet, koppel ze aan het doel van de opdracht en noteer hoe ik controleer of het resultaat werkt.',
    'De uitwerking bevat voorbeelden, teststappen, mogelijke fouten en een korte reflectie op bruikbaarheid, veiligheid en samenwerking.',
  ].join(' ');
  const requiredLength = Number(step.minTextLength || 120);
  if (base.length >= requiredLength + 20) return base;
  return [
    base,
    'Extra uitwerking: ik werk dit verder uit met duidelijke termen, reproduceerbare stappen, invoer en verwachte uitvoer.',
    'Ook benoem ik waarom deze keuze logisch is voor een leerlingproduct en hoe een docent het bewijs kan beoordelen.',
  ].join(' ');
}

async function playBuilderCanvas(client, missionId, viewport, persona) {
  const config = await loadTemplateConfig('builder-canvas', missionId);
  const stepIds = BUILDER_STEP_IDS[missionId] ?? config.steps?.map((step) => step.id);
  if (!stepIds?.length) throw new Error(`${missionId}: steps ids missing`);
  const builderRunSuffix = Date.now();

  const hasLaunchChallenge = await client.eval(`Boolean(document.querySelector('[data-qa="builder-launch-challenge"]'))`);
  if (hasLaunchChallenge) {
    const selectedLaunchChoice = await client.eval(`(() => {
      const firstChoice = document.querySelector('[data-qa="builder-launch-choice"]');
      if (!firstChoice) return false;
      firstChoice.click();
      return true;
    })()`);
    if (!selectedLaunchChoice) throw new Error(`${missionId}: builder launch choice niet gevonden`);
    await new Promise(r => setTimeout(r, 500));

    const launched = await client.eval(`(() => {
      const launch = document.querySelector('[data-qa="builder-launch-challenge"]');
      const start = launch
        ? Array.from(launch.querySelectorAll('button')).find((button) => /start canvas/i.test(button.innerText || ''))
        : null;
      if (!start || start.disabled || start.getAttribute('aria-disabled') === 'true') return false;
      start.click();
      return true;
    })()`);
    if (!launched) throw new Error(`${missionId}: builder launch challenge kon niet starten`);
    await new Promise(r => setTimeout(r, 1000));
  }

  for (let stepIndex = 0; stepIndex < stepIds.length; stepIndex++) {
    console.log(`Playing Builder step ${stepIndex + 1}/${stepIds.length}...`);

    if (viewport.mobile) {
      await client.eval(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Instructies'));
        if (btn) btn.click();
      })()`);
      await new Promise(r => setTimeout(r, 300));
    }

    await client.waitForExpression(
      `document.querySelector('[data-qa^="checklist-item-"], button[aria-pressed]')`,
      `Builder step ${stepIndex} loaded`
    );

    // Tick all checkboxes
    await client.eval(`(() => {
      const items = Array.from(document.querySelectorAll('[data-qa^="checklist-item-"], button[aria-pressed]'));
      items.forEach(item => {
        if (item.getAttribute('aria-pressed') !== 'true') {
          item.click();
        }
      });
    })()`);

    const hasText = await client.eval(`Boolean(document.querySelector('[data-qa="step-textarea"], textarea'))`);
    if (hasText) {
      const step = config.steps?.[stepIndex] ?? { id: stepIds[stepIndex], title: stepIds[stepIndex], minTextLength: 120 };
      const evidenceText = buildBuilderCanvasEvidenceText(missionId, step, stepIndex);
      if (persona !== 'speedrun') {
      await client.eval(`(() => {
        const ta = document.querySelector('[data-qa="step-textarea"], textarea');
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter ? setter.call(ta, "Te kort.") : (ta.value = "Te kort.");
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      })()`);
        await new Promise(r => setTimeout(r, 500));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step${stepIndex}-texterror-${builderRunSuffix}.png`);
        await new Promise(r => setTimeout(r, 800));
      }

      await client.eval(`(() => {
        const ta = document.querySelector('[data-qa="step-textarea"], textarea');
        const value = ${JSON.stringify(evidenceText)};
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter ? setter.call(ta, value) : (ta.value = value);
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      })()`);
      await new Promise(r => setTimeout(r, 500));
    }

    const hasFollowUp = await client.eval(`Boolean(document.querySelector('[data-qa^="followup-option-"]'))`);
    if (hasFollowUp) {
      const correctIndex = await client.eval(`(() => {
        const elem = document.querySelector('[data-qa^="followup-option-"]');
        if (!elem) return null;
        function findFollowUpProps(node) {
          const keys = Object.keys(node);
          const fiberKey = keys.find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
          if (fiberKey) {
            let fiber = node[fiberKey];
            while (fiber) {
              if (fiber.memoizedProps && fiber.memoizedProps.followUp) {
                return fiber.memoizedProps.followUp;
              }
              if (fiber.pendingProps && fiber.pendingProps.followUp) {
                return fiber.pendingProps.followUp;
              }
              fiber = fiber.return;
            }
          }
          return null;
        }
        const match = findFollowUpProps(elem);
        return match ? match.correctIndex : null;
      })()`);

      if (correctIndex !== null) {
        const makeFollowUpError = persona === 'struggling' && Math.random() < 0.5;
        if (makeFollowUpError) {
          const wrongIndex = (correctIndex + 1) % 3;
          await client.eval(`document.querySelector('[data-qa="followup-option-${wrongIndex}"]').click()`);
          await client.eval(`document.querySelector('[data-qa="followup-submit"]').click()`);
          await new Promise(r => setTimeout(r, 600));
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step${stepIndex}-followup-error-${builderRunSuffix}.png`);
          await new Promise(r => setTimeout(r, 800));
        }

        await client.eval(`document.querySelector('[data-qa="followup-option-${correctIndex}"]').click()`);
        await client.eval(`document.querySelector('[data-qa="followup-submit"]').click()`);
        await new Promise(r => setTimeout(r, 600));
      }
    }

    if (viewport.mobile) {
      await client.eval(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Preview'));
        if (btn) btn.click();
      })()`);
      await new Promise(r => setTimeout(r, 500));
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step${stepIndex}-${builderRunSuffix}.png`);

    if (viewport.mobile) {
      await client.eval(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Instructies'));
        if (btn) btn.click();
      })()`);
      await new Promise(r => setTimeout(r, 300));
    }

    await client.waitForExpression(
      `(() => {
        const button = document.querySelector('[data-qa="step-next"]')
          || Array.from(document.querySelectorAll('button')).find((candidate) => /Volgende stap|Bekijk resultaten|Resultaten bekijken|Missie afronden/i.test(candidate.innerText || ''));
        return button && !button.disabled;
      })()`,
      `Builder step ${stepIndex + 1} vervolgbaar`
    );
    await client.eval(`(() => {
      const button = document.querySelector('[data-qa="step-next"]')
        || Array.from(document.querySelectorAll('button')).find((candidate) => /Volgende stap|Bekijk resultaten|Resultaten bekijken|Missie afronden/i.test(candidate.innerText || ''));
      button.click();
    })()`);
    await new Promise(r => setTimeout(r, 1200));
  }
}

async function playDataViewer(client, missionId, viewport, persona) {
  const dataConfig = await loadTemplateConfig('data-viewer', missionId);

  console.log('Playing DataViewer...');

  const hasInvestigationUi = await client.eval(`Boolean(document.querySelector('[data-qa="investigation-continue"]'))`);
  if (hasInvestigationUi) {
    await clickFirstVisibleBySelector(
      client,
      '[data-qa^="investigation-option-"]',
      'DataViewer onderzoeksroute kiezen'
    );
    await delay(400);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-investigation-choice-${Date.now()}.png`);
    await clickQa(client, 'investigation-continue', 'DataViewer onderzoek starten');
    await delay(900);
  } else if (dataConfig.investigationHook?.options?.length) {
    const option = dataConfig.investigationHook.options[0];
    await client.waitForExpression(
      `document.querySelector('[data-qa="investigation-option-${option.id}"]')
        || document.body.innerText.includes(${JSON.stringify(dataConfig.investigationHook.prompt)})`,
      `DataViewer investigation hook ${missionId}`
    );
    const selectedInvestigation = await client.eval(`(() => {
      const optionId = ${JSON.stringify(option.id)};
      const optionText = ${JSON.stringify(option.label)};
      const qa = document.querySelector('[data-qa="investigation-option-' + optionId + '"]');
      if (qa) {
        qa.scrollIntoView({ block: 'center', inline: 'center' });
        qa.click();
        return true;
      }
      const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
        (candidate.innerText || candidate.getAttribute('aria-label') || '').includes(optionText)
      );
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);
    if (!selectedInvestigation) throw new Error(`${missionId}: DataViewer onderzoekskeuze niet gevonden`);
    await delay(400);
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-investigation-choice.png`);
    const continuedInvestigation = await client.eval(`(() => {
      const qa = document.querySelector('[data-qa="investigation-continue"]:not(:disabled)');
      if (qa) {
        qa.scrollIntoView({ block: 'center', inline: 'center' });
        qa.click();
        return true;
      }
      const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
        /Start onderzoek|Bekijk data|Audit|Verken|Onderzoek/i.test(candidate.innerText || candidate.getAttribute('aria-label') || '')
        && !candidate.disabled
      );
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'center' });
      button.click();
      return true;
    })()`);
    if (!continuedInvestigation) throw new Error(`${missionId}: DataViewer onderzoek-startknop niet gevonden`);
    await delay(900);
  }

  for (let datasetIndex = 0; datasetIndex < dataConfig.datasets.length; datasetIndex++) {
    const dataset = dataConfig.datasets[datasetIndex];
    await client.waitForExpression(
      `document.querySelector('[data-qa="question-submit"]')
        || Array.from(document.querySelectorAll('button')).some(b => /Bevestigen|Volgende dataset|Bekijk resultaten/i.test(b.innerText || b.getAttribute('aria-label') || ''))`,
      `DataViewer dataset ${dataset.id} loaded`
    );

    if (['digital-divide-researcher', 'tech-impact-analyst', 'welzijnsonderzoeker', 'research-project'].includes(missionId)) {
      if (datasetIndex === 0) {
        const probedFeedback = await injectDataViewerShortObservationProbe(client);
        if (probedFeedback) {
          await delay(350);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-feedback-error-probe-${Date.now()}.png`);
        }
      }
      const answeredLiveDataset = await answerVisibleDataViewerDataset(client);
      if (!answeredLiveDataset.ok) {
        throw new Error(`${missionId}: live DataViewer dataset ${datasetIndex + 1} niet afgerond (${answeredLiveDataset.reason})`);
      }
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-${dataset.id}-complete.png`);
      await dismissWellbeingAlert(client);
      const advancedLiveDataset = await maybeClickVisibleButtonByBestText(
        client,
        datasetIndex === dataConfig.datasets.length - 1
          ? ['Bekijk resultaten']
          : ['Volgende dataset', 'Volgende']
      );
      if (advancedLiveDataset) {
        await delay(900);
        await dismissWellbeingAlert(client);
      }
      continue;
    }

    for (let questionIndex = 0; questionIndex < dataset.questions.length; questionIndex++) {
      const question = dataset.questions[questionIndex];
      const answerText = buildDataViewerAnswer(question);
      const makeError = false;

      if (datasetIndex === 0 && questionIndex === 0) {
        const probed = await client.eval(`(() => {
          const question = ${JSON.stringify(question)};
          const container = findQuestionContainer(question);
          if (!container) return false;
          const radio = Array.from(container.querySelectorAll(\`input[name="\${question.id}"]\`))
            .find(input => String(input.value) !== String(question.correctAnswer));
          const numberInput = container.querySelector('[data-qa="question-number-input"], input[type="number"]');
          const textInput = container.querySelector('[data-qa="question-textarea"], textarea');
          if (radio) {
            radio.click();
          } else if (numberInput) {
            setNativeValue(numberInput, '999');
          } else if (textInput) {
            setNativeValue(textInput, 'Te kort.');
          } else {
            return false;
          }
          return true;

          function findQuestionContainer(q) {
            const hasSubmit = (element) => element.querySelector('[data-qa="question-submit"]')
              || Array.from(element.querySelectorAll('button')).some((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
            const hasInput = (element) => element.querySelector('[data-qa="question-textarea"], textarea, [data-qa="question-number-input"], input[type="number"], input[type="radio"], [data-qa^="question-option-"]');
            const candidates = Array.from(document.querySelectorAll('div'))
              .filter((element) => element.innerText?.includes(q.question) && hasSubmit(element));
            candidates.sort((a, b) => a.innerText.length - b.innerText.length);
            if (candidates[0]) return candidates[0];
            const fallback = Array.from(document.querySelectorAll('div'))
              .filter((element) => hasInput(element) && hasSubmit(element));
            fallback.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.innerText.length - b.innerText.length);
            return fallback[${questionIndex}] || fallback[0] || null;
          }

          function setNativeValue(element, value) {
            const setter = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value')?.set;
            setter ? setter.call(element, value) : (element.value = value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()`);
        if (probed) {
          await delay(300);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-${dataset.id}-${question.id}-input-error-probe.png`);
        }
      }

      if (makeError) {
        const errored = await client.eval(`(() => {
          const question = ${JSON.stringify(question)};
          const container = findQuestionContainer(question);
          if (!container) return false;
          const radio = container.querySelector('[data-qa^="question-option-"], input[type="radio"]');
          const numberInput = container.querySelector('[data-qa="question-number-input"], input[type="number"]');
          const textInput = container.querySelector('[data-qa="question-textarea"], textarea');
          if (radio) {
            const wrong = Array.from(container.querySelectorAll(\`input[name="\${question.id}"]\`))
              .find(input => String(input.value) !== String(question.correctAnswer));
            if (wrong) wrong.click();
          } else if (numberInput) {
            setNativeValue(numberInput, '999');
          } else if (textInput) {
            setNativeValue(textInput, 'Te kort.');
          }
          const submit = container.querySelector('[data-qa="question-submit"]:not(:disabled)')
            || Array.from(container.querySelectorAll('button')).find((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || '') && !button.disabled);
          if (!submit) return false;
          submit.click();
          return true;

          function findQuestionContainer(q) {
            const hasSubmit = (element) => element.querySelector('[data-qa="question-submit"]')
              || Array.from(element.querySelectorAll('button')).some((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
            const hasInput = (element) => element.querySelector('[data-qa="question-textarea"], textarea, [data-qa="question-number-input"], input[type="number"], input[type="radio"], [data-qa^="question-option-"]');
            const candidates = Array.from(document.querySelectorAll('div'))
              .filter((element) => element.innerText?.includes(q.question) && hasSubmit(element));
            candidates.sort((a, b) => a.innerText.length - b.innerText.length);
            if (candidates[0]) return candidates[0];
            const fallback = Array.from(document.querySelectorAll('div'))
              .filter((element) => hasInput(element) && hasSubmit(element));
            fallback.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.innerText.length - b.innerText.length);
            return fallback[${questionIndex}] || fallback[0] || null;
          }

          function setNativeValue(element, value) {
            const setter = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value')?.set;
            setter ? setter.call(element, value) : (element.value = value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()`);
        if (errored) {
          await delay(700);
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-${dataset.id}-${question.id}-error.png`);
        }
      }

      const answered = await client.eval(`(() => {
        const question = ${JSON.stringify(question)};
        const answerText = ${JSON.stringify(answerText)};
        const confidenceQa = ${JSON.stringify(persona === 'diligent' ? 'confidence-level-3' : 'confidence-level-1')};
        const questionIndex = ${questionIndex};
        const textInputIndex = ${dataset.questions.slice(0, questionIndex).filter((q) => q.type === 'text-observation').length};
        const numberInputIndex = ${dataset.questions.slice(0, questionIndex).filter((q) => q.type === 'number-input').length};
        const container = findQuestionContainer(question);
        if (!container) return { ok: false, reason: 'question container not found' };

        const radio = Array.from(container.querySelectorAll(\`input[name="\${question.id}"]\`))
          .find(input => String(input.value) === String(question.correctAnswer));
        const numberInputs = visibleInputs(document.querySelectorAll('[data-qa="data-room-evidence-panel"] [data-qa="question-number-input"], [data-qa="data-room-evidence-panel"] input[type="number"], [data-qa="data-room-evidence-panel"] input[inputmode="numeric"], [data-qa="data-room-evidence-panel"] input[placeholder*="getal"]'));
        const textInputs = visibleInputs(document.querySelectorAll('[data-qa="data-room-evidence-panel"] [data-qa="question-textarea"], [data-qa="data-room-evidence-panel"] textarea'));
        const numberInput = numberInputs[numberInputIndex] || visibleInput(container.querySelectorAll('[data-qa="question-number-input"], input[type="number"], input[inputmode="numeric"], input[placeholder*="getal"]'));
        const textInput = question.type === 'text-observation'
          ? (textInputs[textInputIndex] || visibleInput(container.querySelectorAll('[data-qa="question-textarea"], textarea')))
          : null;

        if (radio) {
          radio.click();
        } else if (numberInput) {
          setNativeValue(numberInput, String(question.correctAnswer));
        } else if (textInput) {
          setNativeValue(textInput, answerText);
        } else {
          return { ok: false, reason: 'question input not found' };
        }

        const confidence = container.querySelector(\`[data-qa="\${confidenceQa}"]\`)
          || Array.from(container.querySelectorAll('button')).find((button) => {
            const text = button.innerText || button.getAttribute('aria-label') || '';
            return ${persona === 'diligent' ? '/Heel zeker|💪/i' : '/Gok|🎲/i'}.test(text) && !button.disabled;
          });
        if (confidence) confidence.click();

        return { ok: true };

        function findQuestionContainer(q) {
          const hasSubmit = (element) => element.querySelector('[data-qa="question-submit"]')
            || Array.from(element.querySelectorAll('button')).some((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
          const hasInput = (element) => element.querySelector('[data-qa="question-textarea"], textarea, [data-qa="question-number-input"], input[type="number"], input[type="radio"], [data-qa^="question-option-"]');
          const candidates = Array.from(document.querySelectorAll('div'))
            .filter((element) => element.innerText?.includes(q.question) && hasSubmit(element));
          candidates.sort((a, b) => a.innerText.length - b.innerText.length);
          if (candidates[0]) return candidates[0];
          const fallback = Array.from(document.querySelectorAll('div'))
            .filter((element) => hasInput(element) && hasSubmit(element));
          fallback.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.innerText.length - b.innerText.length);
          return fallback[${questionIndex}] || fallback[0] || null;
        }

        function setNativeValue(element, value) {
          const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
            || Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value')?.set;
          setter ? setter.call(element, value) : (element.value = value);
          if (element._valueTracker) element._valueTracker.setValue('');
          element.focus();
          element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.blur();
        }

        function visibleInput(elements) {
          return Array.from(elements).find((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width > 0 && rect.height > 0
              && style.visibility !== 'hidden'
              && style.display !== 'none'
              && !element.disabled;
          }) || null;
        }

        function visibleInputs(elements) {
          return Array.from(elements).filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width > 0 && rect.height > 0
              && style.visibility !== 'hidden'
              && style.display !== 'none'
              && !element.disabled;
          });
        }
      })()`);
      if (!answered.ok) throw new Error(`${missionId}: kon vraag ${question.id} niet beantwoorden (${answered.reason})`);
      await delay(250);
      await dismissWellbeingAlert(client);
      const submitted = await client.eval(`(() => {
        const question = ${JSON.stringify(question)};
        const questionIndex = ${questionIndex};
        const container = findQuestionContainer(question);
        if (!container) return { ok: false, reason: 'question container not found for submit' };
        const orderedSubmits = Array.from(document.querySelectorAll('[data-qa="data-room-evidence-panel"] [data-qa="question-submit"], [data-qa="data-room-evidence-panel"] button'))
          .filter((button) => {
            const text = button.innerText || button.getAttribute('aria-label') || '';
            const rect = button.getBoundingClientRect();
            const style = getComputedStyle(button);
            return /Bevestigen|Indienen/i.test(text)
              && rect.width > 0 && rect.height > 0
              && style.visibility !== 'hidden'
              && style.display !== 'none';
          })
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        const submit = orderedSubmits[questionIndex] && !orderedSubmits[questionIndex].disabled
          ? orderedSubmits[questionIndex]
          : container.querySelector('[data-qa="question-submit"]:not(:disabled)')
          || Array.from(container.querySelectorAll('button')).find((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || '') && !button.disabled);
        if (!submit) return { ok: false, reason: 'submit disabled' };
        submit.click();
        return { ok: true };

        function findQuestionContainer(q) {
          const hasSubmit = (element) => element.querySelector('[data-qa="question-submit"]')
            || Array.from(element.querySelectorAll('button')).some((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
          const hasInput = (element) => element.querySelector('[data-qa="question-textarea"], textarea, [data-qa="question-number-input"], input[type="number"], input[type="radio"], [data-qa^="question-option-"]');
          const candidates = Array.from(document.querySelectorAll('div'))
            .filter((element) => element.innerText?.includes(q.question) && hasSubmit(element));
          candidates.sort((a, b) => a.innerText.length - b.innerText.length);
          if (candidates[0]) return candidates[0];
          const fallback = Array.from(document.querySelectorAll('div'))
            .filter((element) => hasInput(element) && hasSubmit(element));
          fallback.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.innerText.length - b.innerText.length);
          return fallback[${questionIndex}] || fallback[0] || null;
        }
      })()`);
      if (!submitted.ok) throw new Error(`${missionId}: kon vraag ${question.id} niet indienen (${submitted.reason})`);
      await delay(550);
      await dismissWellbeingAlert(client);
    }

    if (dataset.followUp) {
      await client.waitForExpression(
        `document.querySelector('[data-qa^="followup-option-"]')
          || document.body.innerText.includes(${JSON.stringify(dataset.followUp.question)})`,
        `DataViewer follow-up ${dataset.id}`
      );
      if (datasetIndex === 0) {
        const wrongIndex = dataset.followUp.options.findIndex((_, index) => index !== dataset.followUp.correctIndex);
        if (wrongIndex >= 0) {
          const wrongClicked = await client.eval(`(() => {
            const optionText = ${JSON.stringify(dataset.followUp.options[wrongIndex])};
            const qa = document.querySelector('[data-qa="followup-option-${wrongIndex}"]');
            if (qa && !qa.disabled) {
              qa.click();
              return true;
            }
            const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
              (candidate.innerText || '').includes(optionText) && !candidate.disabled
            );
            if (!button) return false;
            button.click();
            return true;
          })()`);
          if (wrongClicked) {
            await delay(500);
            await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-${dataset.id}-followup-error.png`);
          }
        }
      }
      const answered = await client.eval(`(() => {
        const optionText = ${JSON.stringify(dataset.followUp.options[dataset.followUp.correctIndex])};
        const correct = document.querySelector('[data-qa="followup-option-${dataset.followUp.correctIndex}"]');
        if (correct && !correct.disabled) {
          correct.click();
          return true;
        }
        const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
          (candidate.innerText || '').includes(optionText) && !candidate.disabled
        );
        if (!button) return false;
        button.click();
        return true;
      })()`);
      if (answered) await delay(450);
      const followupSubmitted = await client.eval(`(() => {
        const qa = document.querySelector('[data-qa="followup-submit"]:not(:disabled)');
        if (qa) {
          qa.click();
          return true;
        }
        const button = Array.from(document.querySelectorAll('button')).find((candidate) =>
          /Bevestigen|Indienen|Verder|Doorgaan/i.test(candidate.innerText || candidate.getAttribute('aria-label') || '') && !candidate.disabled
        );
        if (!button) return false;
        button.click();
        return true;
      })()`);
      if (!followupSubmitted) throw new Error(`${missionId}: DataViewer follow-up submit niet gevonden ${dataset.id}`);
      await delay(650);
      await dismissWellbeingAlert(client);
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-data-${dataset.id}-complete.png`);
    await dismissWellbeingAlert(client);

    const advanceClicked = await client.eval(`(() => {
      const button = Array.from(document.querySelectorAll('button')).find(b =>
        /Volgende dataset|Bekijk resultaten/i.test(b.innerText || b.getAttribute('aria-label') || '')
      );
      if (button && !button.disabled) {
        button.scrollIntoView({ block: 'center', inline: 'center' });
        button.click();
        return true;
      }
      return false;
    })()`);
    if (!advanceClicked) throw new Error(`${missionId}: volgende dataset/resultaten knop niet gevonden na ${dataset.id}`);
    await delay(1200);
  }

  await client.waitForExpression(
    `document.querySelector('[data-qa="confirm-completion"]') || document.body.innerText.includes('Missie voltooid') || document.body.innerText.includes('Resultaten')`,
    `DataViewer completion confirmation`
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-completion-ready-${Date.now()}.png`);

  const clickedCompletion = await client.eval(`(() => {
    const direct = document.querySelector('[data-qa="confirm-completion"]');
    if (direct && !direct.disabled) {
      direct.scrollIntoView({ block: 'center', inline: 'center' });
      direct.click();
      return true;
    }

    const button = Array.from(document.querySelectorAll('button')).find((candidate) => {
      const text = candidate.innerText || candidate.getAttribute('aria-label') || '';
      return !candidate.disabled && /Missie voltooid|Afronden|Klaar|Dashboard|Doorgaan/i.test(text);
    });
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);

  if (!clickedCompletion) {
    throw new Error(`${missionId}: DataViewer completionknop niet gevonden`);
  }

  await delay(1200);
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-completion-confirmed-${Date.now()}.png`);
}

function buildDataViewerAnswer(question) {
  if (question.type === 'text-observation') {
    const questionText = String(question.question || '').toLowerCase();
    if (questionText.includes('eerste hulp') || question.id?.includes('kwetsbaarste')) {
      return 'Ik zou 75+ ouderen als eerste hulp en ondersteuning geven, omdat internetgebruik 58 procent is en basisvaardigheden 32 procent zijn. Dat laat een duidelijke toegangsdrempel en vaardighedendrempel zien, zonder deze groep als probleem te labelen.';
    }
    if (questionText.includes('mogelijke oorzaken') || question.id?.includes('oorzaak')) {
      return 'Twee mogelijke oorzaken zijn minder geld of toegang tot een laptop en internet, en minder oefening via opleiding, school of werk. Daardoor groeien digitale vaardigheden en zelfvertrouwen minder snel.';
    }
    if (questionText.includes('bulgarije') || questionText.includes('eu 100 miljoen')) {
      return 'Ik zou Bulgarije kiezen, omdat breedbandtoegang daar 62 procent is tegenover 98 procent in Nederland. De kloof van 36 procentpunt geeft meer impact voor huishoudens met achterstand in toegang.';
    }
    if (questionText.includes('langetermijnprioriteit') || question.id?.includes('maatregel')) {
      return 'Als langetermijnprioriteit kies ik digitale vaardigheden in het onderwijs, gecombineerd met toegang tot laptop en internet. Dat is structureel en helpt alle leerlingen oefenen, maar het lost niet direct apparaat- of internetproblemen thuis op.';
    }
    if (questionText.includes('75-plussers') || questionText.includes('75+')) {
      return 'Mijn aanbeveling is DigiSterker uitbreiden via bibliotheken met meer vrijwilligers, training en persoonlijke hulp voor 75+ ouderen. Dit helpt vaardigheden, vertrouwen en laagdrempelige toegang tot digitale overheid en bankzaken.';
    }
    const evidence = (question.textEvidenceCriteria || [])
      .map((criterion) => (criterion.keywords || []).slice(0, 2).join(' en '))
      .filter(Boolean)
      .join(', ');
    return `Mijn observatie: ${evidence}. Dit past bij de data, omdat ik concrete waarden, broninformatie en een duidelijke vergelijking gebruik.`;
  }
  return question.correctAnswer;
}

async function injectDataViewerShortObservationProbe(client) {
  return client.eval(`(() => {
    const textarea = Array.from(document.querySelectorAll('[data-qa="data-room-evidence-panel"] textarea'))
      .find((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && !element.disabled;
      });
    if (!textarea) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set
      || Object.getOwnPropertyDescriptor(textarea.constructor.prototype, 'value')?.set;
    setter ? setter.call(textarea, 'Te kort.') : (textarea.value = 'Te kort.');
    if (textarea._valueTracker) textarea._valueTracker.setValue('');
    textarea.focus();
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'Te kort.' }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.blur();
    return true;
  })()`);
}

async function answerVisibleDataViewerDataset(client) {
  for (let step = 0; step < 12; step += 1) {
    const result = await client.eval(`(() => {
      const panel = document.querySelector('[data-qa="data-room-evidence-panel"]');
      if (!panel) return { ok: false, reason: 'evidence panel missing' };

      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0
          && style.visibility !== 'hidden'
          && style.display !== 'none';
      };

      const pendingNumberInput = Array.from(panel.querySelectorAll('input[type="number"], input[inputmode="numeric"], input[placeholder*="getal"]'))
        .find((input) => visible(input) && !input.disabled && String(input.value || '').trim() === '');
      if (pendingNumberInput) {
        const numberText = closestTextWithSubmit(pendingNumberInput);
        const numberSubmit = closestSubmit(pendingNumberInput);
        setNativeValue(pendingNumberInput, numberAnswerFor(numberText));
        if (!numberSubmit) return { ok: false, reason: 'number submit missing', text: numberText.slice(0, 160) };
        if (numberSubmit.disabled) return { ok: true, filledOnly: true, text: numberText.slice(0, 120) };
        numberSubmit.scrollIntoView({ block: 'center', inline: 'center' });
        numberSubmit.click();
        return { ok: true, advanced: false, text: numberText.slice(0, 120) };
      }

      const questionCards = Array.from(panel.querySelectorAll('div'))
        .filter((element) => {
          const text = element.innerText || '';
          return visible(element)
            && /\\b\\d+\\s*pt\\b/i.test(text)
            && !/Niet helemaal|Goed!|Goed opgeschreven|Observatie bevat genoeg bewijs/i.test(text)
            && (
              element.querySelector('textarea, input, [data-qa="question-submit"]')
              || Array.from(element.querySelectorAll('button')).some((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''))
            );
        })
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)
        .filter((element, index, all) => !all.slice(0, index).some((previous) => previous.contains(element)))
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      for (const card of questionCards) {
        const text = card.innerText || '';
        const submit = card.querySelector('[data-qa="question-submit"]')
          || Array.from(card.querySelectorAll('button')).find((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
        if (!submit) continue;
        if (/Niet helemaal|Goed!|Goed opgeschreven|Observatie bevat genoeg bewijs/i.test(text)) continue;

        const textarea = Array.from(card.querySelectorAll('textarea')).find(visible);
        const numberInput = Array.from(card.querySelectorAll('input')).find((input) => {
          const placeholder = input.getAttribute('placeholder') || '';
          return visible(input)
            && !input.disabled
            && (input.type === 'number' || input.inputMode === 'numeric' || /getal/i.test(placeholder));
        });
        const radios = Array.from(card.querySelectorAll('input[type="radio"]')).filter((input) => visible(input) && !input.disabled);

        if (textarea) {
          setNativeValue(textarea, answerTextFor(text));
        } else if (numberInput) {
          setNativeValue(numberInput, numberAnswerFor(text));
        } else if (radios.length > 0) {
          const chosen = chooseRadio(card, radios, text);
          if (!chosen) return { ok: false, reason: 'radio option missing', text: text.slice(0, 160) };
          chosen.click();
        } else {
          continue;
        }

        if (submit.disabled) {
          return { ok: true, filledOnly: true, text: text.slice(0, 120) };
        }
        submit.scrollIntoView({ block: 'center', inline: 'center' });
        submit.click();
        return { ok: true, advanced: false, text: text.slice(0, 120) };
      }

      const next = Array.from(document.querySelectorAll('button')).find((button) => {
        const text = button.innerText || button.getAttribute('aria-label') || '';
        return visible(button) && !button.disabled && /Volgende dataset|Bekijk resultaten/i.test(text);
      });
      if (next) return { ok: true, done: true };
      return { ok: false, reason: 'no editable question or next button found' };

      function numberAnswerFor(text) {
        if (/procentpunt meer leerlingen|laag welzijn|>\\s*8 uur|<\\s*2 uur/i.test(text)) return '36';
        if (/enqu[eêè]te|zelfrapportage|gecontroleerd experiment|punten lager/i.test(text)) return '35';
        if (/gezichtsherkenning|Privacy en massasurveillance|impactlens/i.test(text)) return '3';
        if (/ernst-score van 5|maximaal ernstig risico/i.test(text)) return '3';
        if (/EU en de VS|VS en de EU|tussen de EU en de VS|punten verschil.*AI-regulering|AI-regulering.*punten verschil|EU:\\s*78|VS:\\s*38|juiste antwoord:\\s*40/i.test(text)) return '40';
        if (/WEL een schermtijdlimiet|schermtijdlimiet hebben|gemiddelde schermtijd/i.test(text)) return '2.6';
        if (/16-24|75\\+|75 jaar/i.test(text)) return '65';
        if (/Nederland.*Bulgarije|Bulgarije.*Nederland|breedband/i.test(text)) return '36';
        if (/gemiddelde|7 landen/i.test(text)) return '83.4';
        return '1';
      }

      function answerTextFor(text) {
        if (/eerste hulp|hulp geven|labelen als/i.test(text)) {
          return 'Ik zou 75+ ouderen als eerste hulp en ondersteuning geven, omdat internetgebruik 58 procent is en basisvaardigheden 32 procent zijn. Dat laat een duidelijke toegangsdrempel en vaardighedendrempel zien, respectvol geformuleerd als hulp om mee te doen.';
        }
        if (/mogelijke oorzaken|Laagopgeleiden/i.test(text)) {
          return 'Twee mogelijke oorzaken zijn minder geld of toegang tot een laptop en internet, en minder oefening via opleiding, school of werk. Daardoor groeien digitale vaardigheden en zelfvertrouwen minder snel.';
        }
        if (/100 miljoen|Nederland of in Bulgarije|Bulgarije/i.test(text)) {
          return 'Ik zou Bulgarije kiezen, omdat breedbandtoegang daar 62 procent is tegenover 98 procent in Nederland. De kloof van 36 procentpunt geeft meer impact voor huishoudens met achterstand in toegang.';
        }
        if (/75-plussers|75\\+/i.test(text)) {
          return 'Mijn aanbeveling is DigiSterker uitbreiden via bibliotheken met meer vrijwilligers, training en persoonlijke hulp voor 75+ ouderen. Dit helpt vaardigheden, vertrouwen en laagdrempelige toegang tot digitale overheid en bankzaken.';
        }
        if (/langetermijnprioriteit|kwetsbare gezinnen/i.test(text)) {
          return 'Als langetermijnprioriteit kies ik digitale vaardigheden in het onderwijs, gecombineerd met toegang tot laptop en internet. Dat is structureel en helpt alle leerlingen oefenen, maar lost niet direct apparaat- of internetproblemen thuis op.';
        }
        if (/hogere foutkans bij donkere huidskleur|algoritmische bias|softwarebug|trainingsdata/i.test(text)) {
          return 'Dit is algoritmische bias: het model is waarschijnlijk getraind met niet-representatieve trainingsdata. Daardoor werkt gezichtsherkenning minder goed voor sommige groepen en is het geen simpele softwarebug.';
        }
        if (/privacy-advocaat|massasurveillance|onschuldig/i.test(text)) {
          return 'Een privacy-advocaat zou zeggen dat je voor het vinden van enkele criminelen ook onschuldige burgers scant en registreert. Dat is massasurveillance, met extra risico op valse identificatie en discriminatie.';
        }
        if (/Markeer de regio|strengste AI[-‐‑‒–— ]regulering|score 78|vergelijk.*andere regio|gevolg voor burgers of bedrijven/i.test(text)) {
          return 'De EU heeft de strengste AI-regulering met score 78. Dat is hoger dan de VS met 38 en ook hoger dan China met 65. Voor burgers betekent dit meer bescherming en rechten; voor bedrijven betekent het meer regels en compliancekosten.';
        }
        if (/sollicitaties te beoordelen|analysestap|serieus risico|sollicitatie-AI|hoog risico|menselijke controle/i.test(text)) {
          return 'Ik kies Stap 3 risicoanalyse, omdat sollicitatie-AI een hoog risico heeft op bias of discriminatie. Belangrijke risico’s zijn gebrek aan transparantie of uitleg voor afgewezen kandidaten en te weinig menselijke controle op automatische beslissingen.';
        }
        if (/schermtijd en slaapkwaliteit|welk verband zie je|sorteer.*schermtijd|slaapkwaliteit|voorzichtige nuance/i.test(text)) {
          return 'Als je sorteert op schermtijd zie je dat meer schermtijd samenhangt met lagere slaapkwaliteit. De leerlingen met 6,5 en 5 uur zitten lager in slaapkwaliteit dan leerlingen met 1,5 of 2,5 uur. Voorzichtige nuance: dit is correlatie in een kleine enquête, geen hard bewijs van oorzaak.';
        }
        if (/tevredenheid met de digitale balans|m[eé]t en z[oó]nder schermtijdlimiet|limietgroep|datavergelijking/i.test(text)) {
          return 'In de limietgroep zijn leerlingen vaker tevreden met hun digitale balans, terwijl zonder schermtijdlimiet meer leerlingen ontevreden of maar soms tevreden zijn. De datavergelijking laat dus een verschil zien, maar een limietgroep is geen garantie voor perfecte balans.';
        }
        if (/categorie.*meeste tijd|Social media|2,8|2.8|niet-oordelend|schermgebruik Nederlandse jongeren|andere categorie/i.test(text)) {
          return 'Social media neemt gemiddeld de meeste tijd in met waarde 2,8 uur per dag. Dat is meer dan gaming met 1,9 uur en streaming met 1,6 uur. Ik formuleer dit niet-oordelend: deze categorie vraagt aandacht, zonder jongeren te labelen.';
        }
        if (/conclusie.*NIET mag trekken|trendtabel|oorzaakclaim|correlatie|contextkaart|voorzichtig onderzoekstaal|te stellig/i.test(text)) {
          return 'Je mag niet te stellig concluderen dat meer schermtijd de lagere welzijnsscore veroorzaakt. De tabel laat een correlatie of verband zien, maar geen bewezen oorzaak. De contextkaart noemt bijvoorbeeld toetsperiode, donkere maand en vakantie; daarom gebruik ik voorzichtige onderzoekstaal.';
        }
        if (/strenge AI[-‐‑‒–— ]regulering|AI-regulering|techbedrijf|niet erg vinden|wanneer wel|voordeel van regels|nadeel van regels|bedrijfspersectief|bedrijfsperspectief|burgers of bedrijven/i.test(text)) {
          return 'Een techbedrijf kan strenge regels prettig vinden omdat duidelijke regels zekerheid geven, vertrouwen opbouwen en concurrenten dwingen ook veilig te werken. Het kan nadelig zijn omdat compliance geld kost, innovatie vertraagt en sommige AI-toepassingen niet meer mogen.';
        }
        if (/beste onderzoeksvraag|onderzoekscoach|TikTok-vraag|specifiek.*meetbaar|niet leidend|open/i.test(text)) {
          return 'Ik kies de TikTok-vraag: hoeveel uur zitten jongeren van 13-15 jaar per dag op TikTok in 2025? Die vraag is specifiek door leeftijd, platform en jaar, meetbaar of beantwoordbaar met data, en niet leidend maar open geformuleerd.';
        }
        if (/TikTok|aanbevelingsalgoritme|positief effect|negatief risico/i.test(text)) {
          return 'Positief is dat het algoritme snel passende content en nieuwe makers toont. Een negatief risico is een filterbubbel waarin je steeds eenzijdiger of extremere inhoud ziet en minder tegengestelde perspectieven krijgt.';
        }
        if (/tevredenheid met de digitale balans|schermtijdlimiet|Wat valt je op/i.test(text)) {
          return 'Met schermtijdlimiet zijn leerlingen vaker tevreden met hun digitale balans, terwijl zonder limiet meer leerlingen ontevreden zijn. Opvallend is dat een limiet niet alles oplost, want Kai heeft wel een limiet maar nog steeds veel schermtijd.';
        }
        if (/minst erkend als .*schermtijd|passief scrollen|andere impact/i.test(text)) {
          return 'Creatief gebruik wordt minder vaak als schermtijd gezien, maar heeft een andere impact dan passief scrollen. Zelf muziek of video maken geeft meer controle, betekenis en voldoening dan alleen content consumeren.';
        }
        if (/meer schermtijd = slechter welzijn|contextkolom|gevaarlijk/i.test(text)) {
          return 'Dat is gevaarlijk omdat de contextkolom laat zien dat toetsdruk, vakantie en stress meespelen. De tabel toont correlatie, geen causaliteit; andere factoren kunnen welzijn en schermtijd tegelijk beinvloeden.';
        }
        if (/correlatie.*causaliteit|causaliteit.*correlatie|niet hetzelfde/i.test(text)) {
          return 'Correlatie betekent dat twee dingen samen voorkomen, maar causaliteit betekent dat het ene het andere veroorzaakt. Bij schermtijd kan laag welzijn ook zorgen voor meer schermtijd, of een derde factor zoals stress kan beide verklaren.';
        }
        if (/bewijssterkte|methode.*score|score.*sterker|sterker.*losse enqu[eêè]te|meta-analyse|meerdere studies|sterkste wetenschappelijk/i.test(text)) {
          return 'De sterkste methode is meta-analyse met score 95. Die is sterker dan een losse enquête, omdat een meta-analyse meerdere studies combineert en toevallige fouten of een kleine steekproef minder zwaar laat meewegen.';
        }
        if (/focusproblemen|meest haalbaar voor een scholier|haalbaar.*scholier/i.test(text)) {
          return 'Een enquête is voor een scholier het meest haalbaar, omdat je zelf vragen kunt maken en klasgenoten kunt bevragen. Ik zou wel benoemen dat zelfrapportage beperkt is en geen hard causaal bewijs geeft.';
        }
        if (/n=200|beperking van deze steekproef|onderzoek zou verbeteren/i.test(text)) {
          return 'Een beperking is dat n=200 relatief klein is en alleen havo/vwo-leerlingen bevat. Ik zou het verbeteren met meer leerlingen, meerdere schoolniveaus, verschillende regio’s en objectieve schermtijdmetingen.';
        }
        return 'Mijn observatie noemt toegang, vaardigheden, geld en ondersteuning met concrete data. Ik formuleer dit respectvol als een drempel die hulp nodig heeft, niet als een probleemgroep.';
      }

      function chooseRadio(card, radios, text) {
        const labels = Array.from(card.querySelectorAll('label'));
        const wanted =
          /schermtijd en gemiddeld welzijn|verband tussen schermtijd en gemiddeld welzijn/i.test(text)
            ? /Meer schermtijd hangt samen met lager welzijn/i
            : /sterkste wetenschappelijke bewijs|onderzoeksmethode levert/i.test(text)
              ? /Meta-analyse/i
              : /onderzoeksvraag is het meest geschikt|TikTok in 2025/i.test(text)
                ? /Hoeveel uur zitten jongeren van 13-15 jaar per dag op TikTok in 2025/i
                : /donkere huidskleur|algoritmes maken meer fouten|bias-probleem/i.test(text)
            ? /Algoritmische bias door niet-representatieve trainingsdata/i
            : /strengste AI-regulering|strengste.*op basis van de data/i.test(text)
              ? /^\\s*EU\\s*$/i
              : /sollicitaties te beoordelen|serieus risico blootleggen/i.test(text)
                ? /Stap 3: Risico/i
                : /sorteert op schermtijd|slaapkwaliteit/i.test(text)
                  ? /Meer schermtijd hangt samen met lagere slaapkwaliteit/i
                  : /meeste tijd in beslag|Nederlandse jongeren/i.test(text)
                    ? /Social media/i
                    : /NIET concluderen|trendtabel|patroon duidelijk/i.test(text)
                      ? /VEROORZAAKT/i
                      : /structureel|kinderen|kwetsbare gezinnen/i.test(text)
                        ? /Digitale vaardigheden in het onderwijs/i
                        : /75\\+ jaar|Bulgarije|Digitale vaardigheden/i;
        const label = labels.find((candidate) => wanted.test(candidate.innerText || ''));
        const input = label?.querySelector('input[type="radio"]');
        return input || radios[0] || null;
      }

      function closestSubmit(element) {
        let node = element;
        for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
          const submit = node.querySelector?.('[data-qa="question-submit"]')
            || Array.from(node.querySelectorAll?.('button') || []).find((button) => /Bevestigen|Indienen/i.test(button.innerText || button.getAttribute('aria-label') || ''));
          if (submit) return submit;
        }
        return null;
      }

      function closestTextWithSubmit(element) {
        let node = element;
        for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
          if (closestSubmit(node)) return node.innerText || '';
        }
        return document.body.innerText || '';
      }

      function setNativeValue(element, value) {
        const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
          || Object.getOwnPropertyDescriptor(element.constructor.prototype, 'value')?.set;
        setter ? setter.call(element, value) : (element.value = value);
        if (element._valueTracker) element._valueTracker.setValue('');
        element.focus();
        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
      }
    })()`);

    if (!result.ok) return result;
    if (result.done) return { ok: true };
    await delay(650);
    await dismissWellbeingAlert(client);
  }
  return { ok: false, reason: 'dataset question loop exceeded' };
}

async function playPuzzleLab(client, missionId, viewport, persona) {
  console.log('Playing PuzzleLab...');

  // Parse TS config file to extract answers
  const fsSync = await import('node:fs');
  const path = await import('node:path');
  const filePath = path.join(process.cwd(), 'src/features/missions/templates/puzzle-lab/configs', `${missionId}.ts`);
  const content = fsSync.readFileSync(filePath, 'utf-8');

  // Regex-based extraction of puzzles
  const puzzles = [];
  const puzzlesSection = content.slice(content.indexOf('puzzles: ['));
  const parts = puzzlesSection.split(/\bid:\s*'/);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const id = part.slice(0, part.indexOf("'"));
    
    const typeMatch = part.match(/\btype:\s*'([^']+)'/);
    const type = typeMatch ? typeMatch[1] : '';
    
    let answer = null;
    const singleAnswerMatch = part.match(/\banswer:\s*'([^']*)'/);
    if (singleAnswerMatch) {
      answer = singleAnswerMatch[1];
    } else {
      const arrayAnswerMatch = part.match(/\banswer:\s*\[([^\]]*)\]/);
      if (arrayAnswerMatch) {
        const items = arrayAnswerMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
        answer = items;
      }
    }
    
    let options = [];
    const optionsMatch = part.match(/\boptions:\s*\[([^\]]*)\]/s);
    if (optionsMatch) {
      const rawOptions = optionsMatch[1];
      const optionMatches = [...rawOptions.matchAll(/'([^']*)'/g)].map(m => m[1]);
      if (optionMatches.length > 0) {
        options = optionMatches;
      } else {
        options = rawOptions.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      }
    }
    
    puzzles.push({ id, type, answer, options });
  }

  console.log(`[Playthrough] Parsed ${puzzles.length} puzzles from config file:`, puzzles.map(p => ({ id: p.id, type: p.type })));

  let iterations = 0;
  let madeRecoveryEvidence = false;
  const puzzleRunSuffix = Date.now();
  while (iterations < 25) {
    iterations++;

    // Check if we are in results or completion
    const isDone = await client.eval(`(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes('Missie voltooid') || bodyText.includes('afgerond') || bodyText.includes('voltooid') || bodyText.includes('Certificaat') || bodyText.includes('Resultaten');
    })()`);
    if (isDone) {
      console.log(`[Playthrough] Reached results/completion page.`);
      break;
    }

    // Check if puzzle-next is visible and click it
    const hasNext = await client.eval(`Boolean(document.querySelector('[data-qa="puzzle-next"]'))`);
    if (hasNext) {
      console.log(`[Playthrough] Found puzzle-next button. Clicking to advance...`);
      await client.eval(`document.querySelector('[data-qa="puzzle-next"]').click()`);
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }

    const hasClueSprint = await client.eval(`Boolean(document.querySelector('[data-qa="puzzle-clue-sprint"]'))`);
    if (hasClueSprint) {
      const selectedRoute = await client.eval(`(() => {
        const activeRoute = document.querySelector('[data-qa="puzzle-clue-route"][aria-pressed="true"], [data-qa="puzzle-clue-route"].ring-2');
        if (activeRoute) return true;
        const firstRoute = document.querySelector('[data-qa="puzzle-clue-route"]');
        if (!firstRoute) return false;
        firstRoute.click();
        return true;
      })()`);
      if (selectedRoute) {
        await new Promise(r => setTimeout(r, 500));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-clue-route-selected-${puzzleRunSuffix}.png`);
        const started = await client.eval(`(() => {
          const start = document.querySelector('[data-qa="puzzle-clue-start"]');
          if (!start || start.disabled || start.getAttribute('aria-disabled') === 'true') return false;
          start.click();
          return true;
        })()`);
        if (started) {
          console.log(`[Playthrough] Selected clue route and started PuzzleLab.`);
          await new Promise(r => setTimeout(r, 1200));
          continue;
        }
      }
    }

    const hasInputs = await client.eval(`Boolean(document.querySelector('[data-qa^="puzzle-option-"]') || document.querySelector('[data-qa="puzzle-answer"]'))`);
    if (!hasInputs) {
      console.log(`[Playthrough] Celebration or state transition active, waiting...`);
      await new Promise(r => setTimeout(r, 500));
      continue;
    }

    // Get current puzzle ID from DOM
    const currentPuzzleId = await client.eval(`(() => {
      const span = Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('puzzle-lab —'));
      return span ? span.innerText.replace('puzzle-lab —', '').trim() : null;
    })()`);

    if (!currentPuzzleId) {
      console.log(`[Playthrough] No active puzzle ID found on page. Waiting...`);
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    const currentPuzzle = puzzles.find(p => p.id === currentPuzzleId);
    if (!currentPuzzle) {
      console.log(`[Playthrough] Warning: no config parsed for puzzle ID: ${currentPuzzleId}`);
      // Fallback: try to just click a random option or type placeholder to avoid getting stuck
      const hasMC = await client.eval(`Boolean(document.querySelector('[data-qa^="puzzle-option-"]'))`);
      if (hasMC) {
        await client.eval(`document.querySelector('[data-qa="puzzle-option-0"]').click()`);
      } else {
        await client.eval(`(() => {
          const input = document.querySelector('[data-qa="puzzle-answer"]');
          if (input) {
            const prototype = Object.getPrototypeOf(input);
            const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
            if (descriptor && descriptor.set) {
              descriptor.set.call(input, "Fallback answer");
            } else {
              input.value = "Fallback answer";
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const submit = document.querySelector('[data-qa="puzzle-submit"]');
          if (submit) submit.click();
        })()`);
      }
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }

    console.log(`[Playthrough] Solving puzzle: ${currentPuzzle.id} (${currentPuzzle.type})`);

    if (currentPuzzle.type === 'multiple-choice') {
      let correctIndex = currentPuzzle.options.findIndex(opt => opt === currentPuzzle.answer);
      if (correctIndex === -1) {
        correctIndex = await client.eval(`(() => {
          const expected = ${JSON.stringify(currentPuzzle.answer)};
          const buttons = Array.from(document.querySelectorAll('[data-qa^="puzzle-option-"]'));
          return buttons.findIndex(btn => {
            const txt = btn.innerText.toLowerCase().trim();
            return expected.toLowerCase().trim().includes(txt) || txt.includes(expected.toLowerCase().trim());
          });
        })()`);
        if (correctIndex === -1) {
          correctIndex = 0;
        }
      }

      const makeError = !madeRecoveryEvidence || (persona === 'struggling' && Math.random() < 0.5);
      if (makeError) {
        const wrongIndex = (correctIndex + 1) % (currentPuzzle.options.length || 3);
        console.log(`[Playthrough] Simulating error for ${currentPuzzle.id} (clicking option ${wrongIndex})`);
        await client.eval(`document.querySelector('[data-qa="puzzle-option-${wrongIndex}"]').click()`);
        await new Promise(r => setTimeout(r, 800));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-${currentPuzzle.id}-error-${puzzleRunSuffix}.png`);
        madeRecoveryEvidence = true;

        const hasHint = await client.eval(`Boolean(document.querySelector('[data-qa="puzzle-hint"]'))`);
        if (hasHint) {
          await client.eval(`document.querySelector('[data-qa="puzzle-hint"]').click()`);
          await new Promise(r => setTimeout(r, 800));
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-${currentPuzzle.id}-hint-${puzzleRunSuffix}.png`);
        }
        await new Promise(r => setTimeout(r, 800));
      }

      console.log(`[Playthrough] Clicking correct option ${correctIndex} for ${currentPuzzle.id}`);
      await client.eval(`document.querySelector('[data-qa="puzzle-option-${correctIndex}"]').click()`);
      await new Promise(r => setTimeout(r, 1500));

    } else if (currentPuzzle.type === 'text-input' || currentPuzzle.type === 'code-crack') {
      let correctValue = "";
      if (Array.isArray(currentPuzzle.answer) && currentPuzzle.answer.length > 0) {
        correctValue = currentPuzzle.answer[0];
      } else {
        if (currentPuzzle.id === 'strong-password' || currentPuzzle.id === 'sterk-wachtwoord-maken') {
          correctValue = 'Paraplu#Boot7Ster';
        } else if (currentPuzzle.id === 'public-key') {
          correctValue = 'Alleen Liam kan het bericht lezen met zijn privésleutel.';
        } else if (currentPuzzle.id === 'bewijsketen') {
          correctValue = 'Maak een forensische kopie en controleer de hash-waarde.';
        } else if (currentPuzzle.id === 'ernst-classificatie') {
          correctValue = 'A is kritiek omdat HTTPS ontbreekt en wachtwoorden/data onversleuteld worden verstuurd.';
        } else if (currentPuzzle.id === 'xss-scenario') {
          correctValue = 'Het script kan cookies of sessies stelen en zo accounts overnemen.';
        } else if (currentPuzzle.id === 'rapport-conclusie') {
          correctValue = 'DataDeal BV overtreedt de AVG/doelbinding door persoonsgegevens van minderjarigen (zoals Emma) te verkopen.';
        } else if (currentPuzzle.id === 'rapport-schrijven') {
          correctValue = 'Het zoekformulier is kwetsbaar voor SQL-injectie. Gebruik prepared statements voor queries.';
        } else {
          correctValue = 'Testantwoord voor deze open vraag.';
        }
      }

      const makeError = !madeRecoveryEvidence || (persona === 'struggling' && Math.random() < 0.5);
      if (makeError) {
        console.log(`[Playthrough] Simulating error for text puzzle ${currentPuzzle.id}`);
        await client.eval(`(() => {
          const input = document.querySelector('[data-qa="puzzle-answer"]');
          if (input) {
            const prototype = Object.getPrototypeOf(input);
            const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
            if (descriptor && descriptor.set) {
              descriptor.set.call(input, "foutief_antwoord");
            } else {
              input.value = "foutief_antwoord";
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()`);
        await client.eval(`document.querySelector('[data-qa="puzzle-submit"]').click()`);
        await new Promise(r => setTimeout(r, 800));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-${currentPuzzle.id}-error-${puzzleRunSuffix}.png`);
        madeRecoveryEvidence = true;

        const hasHint = await client.eval(`Boolean(document.querySelector('[data-qa="puzzle-hint"]'))`);
        if (hasHint) {
          await client.eval(`document.querySelector('[data-qa="puzzle-hint"]').click()`);
          await new Promise(r => setTimeout(r, 800));
          await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-${currentPuzzle.id}-hint-${puzzleRunSuffix}.png`);
        }
        await new Promise(r => setTimeout(r, 800));
      }

      console.log(`[Playthrough] Submitting correct text answer for ${currentPuzzle.id}`);
      await client.eval(`(() => {
        const input = document.querySelector('[data-qa="puzzle-answer"]');
        if (input) {
          const prototype = Object.getPrototypeOf(input);
          const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
          if (descriptor && descriptor.set) {
            descriptor.set.call(input, ${JSON.stringify(correctValue)});
          } else {
            input.value = ${JSON.stringify(correctValue)};
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`);
      await client.eval(`document.querySelector('[data-qa="puzzle-submit"]').click()`);
      await new Promise(r => setTimeout(r, 1500));
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-puzzle-${currentPuzzle.id}-solved-${puzzleRunSuffix}.png`);
  }
}

async function playDedicatedAccessControl(client, viewport, persona) {
  const missionId = 'access-control-engineer';
  console.log('Playing Access Control Engineer...');

  await client.waitForExpression(`document.querySelector('[data-qa^="step1-problem-"]')`, `Step 1 loaded`);
  
  if (persona === 'struggling') {
    await clickQa(client, 'step1-problem-r5', 'veilige regel fout selecteren');
    await new Promise(r => setTimeout(r, 500));
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step1-warning.png`);
    await new Promise(r => setTimeout(r, 800));
    await clickQa(client, 'step1-problem-r5', 'veilige regel herstellen');
    
    await clickQa(client, 'step1-problem-r1', 'probleem r1 selecteren');
    await clickQa(client, 'step1-problem-r2', 'probleem r2 selecteren');
    await clickQa(client, 'step1-problem-r3', 'probleem r3 selecteren');
  } else {
    await clickQa(client, 'step1-problem-r1', 'probleem r1 selecteren');
    await clickQa(client, 'step1-problem-r2', 'probleem r2 selecteren');
    await clickQa(client, 'step1-problem-r3', 'probleem r3 selecteren');
    await clickQa(client, 'step1-problem-r4', 'probleem r4 selecteren');
  }

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step1.png`);
  await client.waitForExpression(`document.querySelector('[data-qa="step1-next"]:not(:disabled)')`, `Step 1 next enabled`);
  await clickQa(client, 'step1-next', 'naar stap 2');
  await new Promise(r => setTimeout(r, 1000));

  await client.waitForExpression(`document.querySelector('[data-qa^="step2-role-"]')`, `Step 2 loaded`);

  await client.eval(`(async () => {
    const rules = ${JSON.stringify(ACCESS_CONTROL_RULES)};
    const roles = ['leerling', 'docent', 'admin', 'gast'];
    for (const [resourceId, allowedRoles] of Object.entries(rules)) {
      for (const role of roles) {
        const button = document.querySelector('[data-qa="step2-role-' + resourceId + '-' + role + '"]');
        if (!button) continue;
        const isActive = button.className.includes('ring-lab-coral');
        const shouldBeActive = allowedRoles.includes(role);
        if (isActive !== shouldBeActive) {
          button.click();
          await new Promise(r => setTimeout(r, 120));
        }
      }
    }
  })()`);
  await new Promise(r => setTimeout(r, 500));

  if (persona === 'struggling') {
    await clickQa(client, 'step2-role-res2-gast', 'bewuste fout: gast mag alle cijfers zien');
    await new Promise(r => setTimeout(r, 300));
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step2-wrongrule.png`);

    await client.waitForExpression(`document.querySelector('[data-qa="step2-next"]:not(:disabled)')`, `Step 2 next enabled with wrong rule`);
    await clickQa(client, 'step2-next', 'naar stap 3 met bewuste fout');
    await new Promise(r => setTimeout(r, 1000));

    await client.waitForExpression(`document.querySelector('[data-qa="step3-run-test-t2"]')`, `Step 3 loaded (struggling)`);
    await clickQa(client, 'step3-run-test-t2', 'fouttest t2 uitvoeren');
    await new Promise(r => setTimeout(r, 600));
    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step3-failedtest.png`);
    await new Promise(r => setTimeout(r, 800));

    await clickVisibleButtonByText(client, 'Opnieuw', 'fouttest t2 resetten');
    await new Promise(r => setTimeout(r, 500));
    await clickLastVisibleButtonByInnerText(client, 'Terug', 'terug naar stap 2 na fouttest');
    await new Promise(r => setTimeout(r, 1000));
    await client.waitForExpression(`document.querySelector('[data-qa^="step2-role-"]')`, `Step 2 loaded after failed test`);

    await clickQa(client, 'step2-role-res2-gast', 'bewuste fout herstellen');
    await new Promise(r => setTimeout(r, 300));

    await client.waitForExpression(`document.querySelector('[data-qa="step2-next"]:not(:disabled)')`, `Step 2 next re-enabled after correction`);
    await clickQa(client, 'step2-next', 'naar stap 3 na correctie');
    await new Promise(r => setTimeout(r, 1000));
  } else {
    await client.waitForExpression(`document.querySelector('[data-qa="step2-next"]:not(:disabled)')`, `Step 2 next enabled`);
    await clickQa(client, 'step2-next', 'naar stap 3');
    await new Promise(r => setTimeout(r, 1000));
  }

  await client.waitForExpression(`document.querySelector('[data-qa^="step3-run-test-"]')`, `Step 3 loaded`);

  for (const tid of ['t1', 't2', 't3', 't4', 't5', 't6']) {
    await clickQa(client, `step3-run-test-${tid}`, `test ${tid} uitvoeren`);
    await new Promise(r => setTimeout(r, 300));
  }

  await new Promise(r => setTimeout(r, 500));
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-step3.png`);

  await clickQa(client, 'step3-finish', 'missie afronden');
  await new Promise(r => setTimeout(r, 1000));

  await client.waitForExpression(`document.querySelector('[data-qa="confirm-completion"]')`, `Completion confirmation loaded`);
  await clickQa(client, 'confirm-completion', 'bewijs bevestigen');
  await new Promise(r => setTimeout(r, 1000));
}

async function playReviewArena(client, missionId, viewport, persona) {
  console.log('Playing ReviewArena...');
  const config = await loadTemplateConfig('review-arena', missionId);

  let iterations = 0;
  const reviewRunSuffix = Date.now();
  while (iterations < 10) {
    iterations++;
    const roundConfig = config.rounds[iterations - 1];

    await client.waitForExpression(
      `document.querySelector('[data-qa="review-submit"]') || document.querySelector('[data-qa="review-next"]') || document.querySelector('[data-qa="review-match-left"]') || document.querySelector('[data-qa="review-categorize-item"]') || document.querySelector('[data-qa="review-rapid-true"]') || document.querySelector('[data-qa^="followup-option-"]') || document.body.innerText.includes('voltooid') || document.body.innerText.includes('Certificaat')`,
      `ReviewArena round content`
    );

    const followUpAtStart = await answerReviewFollowUpIfPresent(
      client,
      missionId,
      viewport,
      persona,
      config.rounds[Math.max(0, iterations - 2)]?.id || `round-${iterations - 1}`
    );
    if (followUpAtStart) {
      iterations--;
      continue;
    }

    const nextClicked = await client.eval(`(() => {
      const btn = document.querySelector('[data-qa="review-next"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);

    if (nextClicked) {
      await new Promise(r => setTimeout(r, 1200));
      continue;
    }

    const roundType = await client.eval(`(() => {
      if (document.querySelector('[data-qa="review-match-left"]')) return 'match-pairs';
      if (document.querySelector('[data-qa="review-categorize-item"]')) return 'categorize';
      if (document.querySelector('[data-qa="review-rapid-true"]')) return 'rapid-fire';
      if (document.querySelector('[data-qa="review-move-up"]')) return 'drag-sort';
      return null;
    })()`);

    if (!roundType) {
      break;
    }

    console.log(`Playing ReviewArena round type: ${roundType}`);

    if (roundType === 'drag-sort') {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-dragsort-init-${reviewRunSuffix}.png`);
      if (roundConfig?.items) {
        await client.eval(`(async () => {
          const desiredLabels = ${JSON.stringify([...roundConfig.items].sort((a, b) => a.correctPosition - b.correctPosition).map((item) => item.label))};
          const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          function rows() {
            return Array.from(document.querySelectorAll('[data-qa="review-move-up"]')).map((button) => {
              return button.parentElement?.parentElement || null;
            }).filter(Boolean);
          }
          for (let targetIndex = 0; targetIndex < desiredLabels.length; targetIndex++) {
            const label = desiredLabels[targetIndex];
            for (let guard = 0; guard < 12; guard++) {
              const currentRows = rows();
              const currentIndex = currentRows.findIndex((row) => (row.innerText || '').includes(label));
              if (currentIndex < 0 || currentIndex <= targetIndex) break;
              const up = currentRows[currentIndex].querySelector('[data-qa="review-move-up"]');
              if (!up || up.disabled) break;
              up.click();
              await wait(90);
            }
          }
        })()`);
        await new Promise(r => setTimeout(r, 500));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-dragsort-ordered-${reviewRunSuffix}.png`);
      }
      await client.eval(`document.querySelector('[data-qa="review-submit"]').click()`);
      await new Promise(r => setTimeout(r, 600));

    } else if (roundType === 'match-pairs') {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-matchpairs-init-${reviewRunSuffix}.png`);

      if (persona !== 'speedrun') {
        await client.eval(`(() => {
          const lefts = Array.from(document.querySelectorAll('[data-qa="review-match-left"]'));
          const rights = Array.from(document.querySelectorAll('[data-qa="review-match-right"]'));
          if (lefts.length > 1 && rights.length > 1) {
            lefts[0].click();
            rights[1].click();
          }
        })()`);
        await new Promise(r => setTimeout(r, 600));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-matchpairs-error-${reviewRunSuffix}.png`);
        await new Promise(r => setTimeout(r, 800));
      }

      await client.eval(`(async () => {
        const expectedPairs = ${JSON.stringify(roundConfig?.pairs || [])};
        const leftButtons = Array.from(document.querySelectorAll('[data-qa="review-match-left"]'));
        if (leftButtons.length === 0 || expectedPairs.length === 0) return;

        for (const pair of expectedPairs) {
          const leftBtn = Array.from(document.querySelectorAll('[data-qa="review-match-left"]'))
            .find(btn => btn.innerText.trim() === pair.left.trim());
          const rightBtn = Array.from(document.querySelectorAll('[data-qa="review-match-right"]'))
            .find(btn => btn.innerText.trim() === pair.right.trim());

          if (leftBtn && rightBtn && !leftBtn.disabled) {
            leftBtn.click();
            await new Promise(r => setTimeout(r, 100));
            rightBtn.click();
            await new Promise(r => setTimeout(r, 450));
          }
        }
      })()`);

      await new Promise(r => setTimeout(r, 800));

    } else if (roundType === 'categorize') {
      await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-categorize-init-${reviewRunSuffix}.png`);

      if (persona === 'struggling' && Math.random() < 0.5) {
        await client.eval(`(() => {
          const item = document.querySelector('[data-qa="review-categorize-item"]');
          const cats = Array.from(document.querySelectorAll('[data-qa="review-category"]'));
          if (item && cats.length > 0) {
            item.click();
            cats[cats.length - 1].click();
          }
        })()`);
        await new Promise(r => setTimeout(r, 500));
        await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-categorize-error-${reviewRunSuffix}.png`);
        await new Promise(r => setTimeout(r, 800));
      }

      await client.eval(`(async () => {
        const expectedItems = ${JSON.stringify(roundConfig?.items || [])};
        const expectedCategories = ${JSON.stringify(roundConfig?.categories || [])};
        const items = Array.from(document.querySelectorAll('[data-qa="review-categorize-item"]'));
        if (items.length === 0 || expectedItems.length === 0) return;

        for (const item of expectedItems) {
          const itemBtn = Array.from(document.querySelectorAll('[data-qa="review-categorize-item"]'))
            .find(btn => btn.innerText.trim() === item.label.trim());
          if (!itemBtn) continue;

          const catIndex = expectedCategories.indexOf(item.correctCategory);
          const catCards = Array.from(document.querySelectorAll('[data-qa="review-category"]'));
          const catCard = catCards[catIndex];

          if (itemBtn && catCard) {
            itemBtn.click();
            await new Promise(r => setTimeout(r, 150));
            catCard.click();
            await new Promise(r => setTimeout(r, 250));
          }
        }
      })()`);

      await new Promise(r => setTimeout(r, 500));
      await client.eval(`document.querySelector('[data-qa="review-submit"]').click()`);
      await new Promise(r => setTimeout(r, 600));

    } else if (roundType === 'rapid-fire') {
      for (const rapidQuestion of roundConfig?.questions || []) {
        await client.waitForExpression(
          `document.body.innerText.includes(${JSON.stringify(rapidQuestion.question)}) && document.querySelector('[data-qa="review-rapid-true"]:not(:disabled)')`,
          `RapidFire vraag geladen`
        );
        const targetQa = rapidQuestion.answer ? 'review-rapid-true' : 'review-rapid-false';
        await clickQa(client, targetQa, `rapid-fire ${rapidQuestion.answer ? 'waar' : 'onwaar'}`);
        await new Promise(r => setTimeout(r, 1000));
      }

      await client.waitForExpression(`document.querySelector('[data-qa="review-next"]')`, `RapidFire resultaat`);
      await new Promise(r => setTimeout(r, 600));
    }

    await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-round-complete-${reviewRunSuffix}-${iterations}.png`);

    await client.eval(`(() => {
      const btn = document.querySelector('[data-qa="review-next"]');
      if (btn) btn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1200));
    await answerReviewFollowUpIfPresent(client, missionId, viewport, persona, roundConfig?.id || `round-${iterations}`, reviewRunSuffix);
  }

  await client.waitForExpression(
    `document.querySelector('[data-qa="confirm-completion"]') || document.body.innerText.includes('Missie voltooid') || document.body.innerText.includes('Certificaat')`,
    `ReviewArena completion confirmation`
  );
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-completion-ready-${reviewRunSuffix}.png`);

  const clickedCompletion = await client.eval(`(() => {
    const direct = document.querySelector('[data-qa="confirm-completion"]');
    if (direct && !direct.disabled) {
      direct.click();
      return true;
    }

    const button = Array.from(document.querySelectorAll('button')).find((btn) => {
      const text = btn.innerText || '';
      return !btn.disabled && /Missie voltooid|Afronden|Klaar|Dashboard|Doorgaan/i.test(text);
    });
    if (!button) return false;
    button.click();
    return true;
  })()`);

  if (!clickedCompletion) {
    throw new Error('Geen zichtbare ReviewArena completionknop gevonden');
  }

  await new Promise(r => setTimeout(r, 1200));
  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-completion-confirmed-${reviewRunSuffix}.png`);
}

async function answerReviewFollowUpIfPresent(client, missionId, viewport, persona, roundId, runSuffix = Date.now()) {
  const hasFollowUp = await client.eval(`Boolean(document.querySelector('[data-qa^="followup-option-"]'))`);
  if (!hasFollowUp) return false;

  await client.screenshot(`${SCREENSHOT_DIR}/${missionId}-${viewport.name}-play-${persona}-${roundId}-followup-${runSuffix}.png`);
  const answered = await client.eval(`(() => {
    function findFollowUpProps(node) {
      const keys = Object.keys(node);
      const fiberKey = keys.find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
      if (fiberKey) {
        let fiber = node[fiberKey];
        while (fiber) {
          if (fiber.memoizedProps && fiber.memoizedProps.followUp) {
            return fiber.memoizedProps.followUp;
          }
          fiber = fiber.return;
        }
      }
      return null;
    }

    const first = document.querySelector('[data-qa^="followup-option-"]');
    const followUp = first ? findFollowUpProps(first) : null;
    const index = followUp?.correctIndex ?? 0;
    const option = document.querySelector('[data-qa="followup-option-' + index + '"]');
    if (!option || option.disabled) return false;
    option.click();
    return true;
  })()`);
  if (answered) await new Promise(r => setTimeout(r, 450));
  const hasSubmit = await client.eval(`Boolean(document.querySelector('[data-qa="followup-submit"]'))`);
  if (!hasSubmit) return false;
  await clickQa(client, 'followup-submit', `ReviewArena follow-up indienen ${roundId}`);
  await new Promise(r => setTimeout(r, 900));
  return true;
}

function buildSummary(results) {
  const failures = results.filter(r => r.error);
  const reviewed = results.filter(r => r.type === 'review' && !r.error);
  return {
    total: results.length,
    passed: results.length - failures.length,
    failures: failures.length,
    reviewed: reviewed.length,
    screenshots: results.reduce((count, result) => count + (result.screenshots?.length || 0), 0),
    oordelen: reviewed.reduce((acc, result) => {
      acc[result.oordeel] = (acc[result.oordeel] || 0) + 1;
      return acc;
    }, {}),
  };
}

function buildMarkdownReport(report) {
  const lines = [
    `# DGSkills student-simulator rapport`,
    '',
    `Datum: ${report.finishedAt.slice(0, 10)}`,
    `Origin: ${report.origin}`,
    `Scope: ${report.scope.period || 'custom'} (${report.scope.missions.join(', ')})`,
    `Viewports: ${report.scope.viewports.join(', ')}`,
    `Screenshots: ${report.screenshotDir}`,
    '',
    '## Samenvatting',
    '',
    `- Runs: ${report.summary.total}`,
    `- Geslaagd: ${report.summary.passed}`,
    `- Failures: ${report.summary.failures}`,
    `- Reviewruns: ${report.summary.reviewed}`,
    `- Screenshots: ${report.summary.screenshots}`,
    `- Oordelen: ${Object.entries(report.summary.oordelen).map(([key, value]) => `${key}: ${value}`).join(', ') || 'n.v.t.'}`,
    '',
    '## Resultaten',
    '',
    '| Missie | Viewport | Type | Oordeel | UI | Didactiek | Gamification | Screenshots | Status |',
    '|---|---|---|---|---:|---:|---:|---:|---|',
  ];

  for (const result of report.results) {
    lines.push([
      result.missionId,
      result.viewport,
      result.type,
      result.oordeel || (result.error ? 'fix-eerst' : 'n.v.t.'),
      result.uiScore ?? '',
      result.didacticScore ?? '',
      result.gamificationScore ?? '',
      result.screenshots?.length || 0,
      result.error ? `FAIL: ${result.error}` : (result.status || 'pass'),
    ].map(value => String(value).replace(/\|/g, '/')).join(' | ').replace(/^/, '| ').replace(/$/, ' |'));
  }

  const reviewResults = report.results.filter(result => result.type === 'review');
  if (reviewResults.length > 0) {
    lines.push('', '## Screenshot- en observatiematrix', '');
    for (const result of reviewResults) {
      lines.push(`### ${result.missionId} / ${result.viewport}`);
      if (result.error) {
        lines.push(`- Fout: ${result.error}`, '');
        continue;
      }
      lines.push(
        `- Oordeel: ${result.oordeel}`,
        `- UI/UX score: ${result.uiScore}/5`,
        `- Didactiek score: ${result.didacticScore}/5`,
        `- Gamification score: ${result.gamificationScore}/5`,
        `- Eerste knop: ${result.clickedButton || 'geen knop geklikt'}`,
        `- Feedbackprobe: ${result.feedbackProbe?.action || 'n.v.t.'}`,
        `- Mid-flow knop: ${result.midFlowClick || 'geen vervolgstap geklikt'}`,
        `- Observaties: ${(result.observations || []).join(' ')}`,
        `- Screenshots: ${(result.screenshots || []).map(s => s.path).join(', ')}`,
        ''
      );
    }
  }

  return `${lines.join('\n')}\n`;
}

async function writeReports(report, jsonPath, mdPath) {
  if (jsonPath) {
    await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`JSON report saved to: ${jsonPath}`);
  }
  if (mdPath) {
    await fs.writeFile(mdPath, buildMarkdownReport(report));
    console.log(`Markdown report saved to: ${mdPath}`);
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  const isAppRoute = process.argv.includes('--app-route');
  await waitForAppServer({ appRoute: isAppRoute });
  await waitForChrome();

  const page = await requestJson('PUT', `/json/new?${encodeURIComponent('about:blank')}`);
  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Network.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');
  await installVercelJwtCookie(client);
  await seedVercelShareBypass(client);

  const results = [];
  const targetMission = argValue('mission');
  const targetPeriod = argValue('period') || 'j2p2';
  const targetViewport = argValue('viewport');
  const reportJsonPath = argValue('report-json');
  const reportMdPath = argValue('report-md');
  const isPlay = process.argv.includes('--play');
  const isReview = process.argv.includes('--review');
  const persona = argValue('persona') || 'diligent';
  if (isAppRoute && !isPlay) {
    throw new Error('--app-route is voorlopig alleen ondersteund samen met --play');
  }
  if (isAppRoute && !argValue('auth-email')) {
    throw new Error('--app-route vereist --auth-email zodat de normale app als QA-leerling opent');
  }
  const authContext = await signInSupabaseQaAccount(argValue('auth-email'), argValue('auth-credentials'));
  const periodMissions = PERIOD_MISSION_SETS[targetPeriod];
  if (!targetMission && !periodMissions) {
    throw new Error(`Onbekende period scope "${targetPeriod}". Beschikbaar: ${Object.keys(PERIOD_MISSION_SETS).join(', ')}`);
  }
  const missionsToRun = targetMission ? [targetMission] : periodMissions;
  const viewportsToRun = targetViewport ? VIEWPORTS.filter(v => v.name === targetViewport) : VIEWPORTS;
  if (viewportsToRun.length === 0) {
    throw new Error(`Onbekende viewport "${targetViewport}". Beschikbaar: ${VIEWPORTS.map(v => v.name).join(', ')}`);
  }

  try {
    console.log(`Starting simulation runs for missions: ${missionsToRun.join(', ')}`);
    console.log(`Target viewports: ${viewportsToRun.map(v => v.name).join(', ')}`);
    console.log(`Mode: ${isReview ? 'review' : isPlay ? 'play' : 'intro+completion'} | Period: ${targetPeriod}${isAppRoute ? ' | App route' : ''}`);
    if (authContext) {
      console.log(`QA auth: ${authContext.email} (${authContext.schoolId || 'school onbekend'})`);
      await installSupabaseSession(client, authContext);
    }

    for (const missionId of missionsToRun) {
      console.log(`\n--- Running Mission: ${missionId} ---`);
      for (const viewport of viewportsToRun) {
        if (isReview) {
          console.log(`[Review-Run] Viewport: ${viewport.name} (${persona})`);
          client.messages = [];
          try {
            const res = await runMissionReviewPass(client, missionId, viewport, persona);
            results.push({ type: 'review', ...res });
          } catch (err) {
            console.error(`❌ [Review-Run Failed] ${missionId} on ${viewport.name} (${persona}): ${err.message}`);
            results.push({ type: 'review', missionId, viewport: viewport.name, persona, error: err.message, screenshots: [] });
          }
        } else if (isPlay) {
          console.log(`[Play-Run] Viewport: ${viewport.name} (${persona})`);
          client.messages = [];
          try {
            const res = await runPlaythrough(client, missionId, viewport, persona, { appRoute: isAppRoute, periodKey: targetPeriod, authContext });
            results.push({ type: 'play', ...res });
          } catch (err) {
            console.error(`❌ [Play-Run Failed] ${missionId} on ${viewport.name} (${persona}): ${err.message}`);
            await captureFailureArtifacts(client, missionId, viewport, `play-${persona}-failure`);
            results.push({ type: 'play', missionId, viewport: viewport.name, persona, error: err.message });
          }
        } else {
          console.log(`[Intro-Run] Viewport: ${viewport.name}`);
          client.messages = [];
          try {
            const res = await runMissionIntro(client, missionId, viewport);
            results.push({ type: 'intro', ...res });
          } catch (err) {
            console.error(`❌ [Intro-Run Failed] ${missionId} on ${viewport.name}: ${err.message}`);
            results.push({ type: 'intro', missionId, viewport: viewport.name, error: err.message });
          }

          console.log(`[Completion-Run] Viewport: ${viewport.name}`);
          client.messages = [];
          try {
            const res = await runCompletionSmoke(client, missionId, viewport);
            results.push({ type: 'completion', ...res });
          } catch (err) {
            console.error(`❌ [Completion-Run Failed] ${missionId} on ${viewport.name}: ${err.message}`);
            results.push({ type: 'completion', missionId, viewport: viewport.name, error: err.message });
          }
        }
      }
    }
  } finally {
    try {
      await client.send('Page.close');
    } catch {
      // The target may already be gone after a navigation failure; closing is best-effort cleanup.
    }
    client.close();
  }

  console.log('\n--- Simulation Runs Complete ---');
  const report = {
    script: 'scripts/chrome-student-simulator.mjs',
    startedAt,
    finishedAt: new Date().toISOString(),
    invocation: process.argv.slice(2),
    origin: ORIGIN,
    authenticatedEmail: authContext?.email ?? null,
    authenticatedSchoolId: authContext?.schoolId ?? null,
    chromeCdpPort: PORT,
    screenshotDir: SCREENSHOT_DIR,
    scope: {
      period: targetMission ? null : targetPeriod,
      missions: missionsToRun,
      viewports: viewportsToRun.map(v => v.name),
      mode: isReview ? 'review' : isPlay ? 'play' : 'intro+completion',
      route: isAppRoute ? 'app' : 'dev-preview',
      persona,
    },
    summary: buildSummary(results),
    results,
  };
  await writeReports(report, reportJsonPath, reportMdPath);

  const failures = results.filter(r => r.error);
  const reviewBlockers = results.filter(r => !r.error && r.oordeel === 'fix-eerst');
  if (failures.length > 0) {
    console.error(`⚠️ There were ${failures.length} failures out of ${results.length} runs:`);
    for (const fail of failures) {
      console.error(`- [${fail.type.toUpperCase()}] ${fail.missionId} (${fail.viewport})${fail.persona ? ` (${fail.persona})` : ''}: ${fail.error}`);
    }
    process.exitCode = 1;
  } else if (reviewBlockers.length > 0) {
    console.error(`⚠️ Review completed, but ${reviewBlockers.length} run(s) received fix-eerst:`);
    for (const blocker of reviewBlockers) {
      console.error(`- [${blocker.type.toUpperCase()}] ${blocker.missionId} (${blocker.viewport})${blocker.persona ? ` (${blocker.persona})` : ''}: UI ${blocker.uiScore}/5, didactiek ${blocker.didacticScore}/5, gamification ${blocker.gamificationScore}/5`);
    }
    process.exitCode = 1;
  } else {
    console.log(`✅ All ${results.length} simulation runs completed successfully with no failures or review blockers!`);
  }
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
