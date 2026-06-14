import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const PORT = Number(process.env.CHROME_CDP_PORT || 9225);
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:4173';
const DATE = process.env.QA_ARTIFACT_DATE || new Date().toISOString().slice(0, 10);
const ARTIFACT_ROOT = process.env.QA_TEACHER_VISIBILITY_ROOT || `/private/tmp/dgskills-full-review-${DATE}/teacher-visibility`;
const CREDENTIALS_PATH = process.env.QA_CREDENTIALS || '/private/tmp/dgskills-full-review-2026-06-11-0604-qa-accounts-credentials.json';
const TEACHER_EMAIL = process.env.QA_TEACHER_EMAIL || 'dgskills.qa.review0604.teacher@example.test';
const STUDENT_EMAIL = process.env.QA_STUDENT_EMAIL || 'dgskills.qa.review0604.j2@example.test';
const SCHOOL_ID = process.env.QA_SCHOOL_ID || 'dgskills-qa-review-2026-06-04';
const CLASS_FILTER = process.env.QA_CLASS_FILTER || 'MH2A';
const YEAR_GROUP = Number(process.env.QA_YEAR_GROUP || 2);

const J2P1_MISSIONS = [
  'data-review',
  'data-journalist',
  'spreadsheet-specialist',
  'factchecker',
  'api-verkenner',
  'dashboard-designer',
  'ai-bias-detective',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'ipad-portrait', width: 820, height: 1180, mobile: false },
  { name: 'ipad-landscape', width: 1180, height: 820, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function requestJson(method, requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path: requestPath, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : null);
        } catch (error) {
          reject(new Error(`CDP JSON parse failed: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitForHttp(url, label, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) return;
    } catch {
      // keep polling
    }
    await delay(300);
  }
  throw new Error(`${label} niet bereikbaar: ${url}`);
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
    await delay(300);
  }
  throw new Error(`Chrome CDP niet bereikbaar op poort ${PORT}.`);
}

class CdpClient {
  constructor(webSocketDebuggerUrl) {
    if (!globalThis.WebSocket) throw new Error('Node WebSocket API ontbreekt. Gebruik Node 22+.');
    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.id = 0;
    this.pending = new Map();
    this.messages = [];
  }

  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id && message.method) {
        if (message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') {
          this.messages.push(message);
          this.messages = this.messages.slice(-200);
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

  async eval(expression, timeoutMs = 20_000) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }, timeoutMs);
    if (result.exceptionDetails) {
      const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
      throw new Error(description || 'Runtime.evaluate failed');
    }
    return result.result?.value;
  }

  async waitForExpression(expression, label, timeoutMs = 15_000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const ok = await this.eval(`Boolean(${expression})`).catch(() => false);
      if (ok) return;
      await delay(250);
    }
    throw new Error(`Timed out waiting for ${label}`);
  }

  async screenshot(filePath) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await this.send('Page.bringToFront', {}, 10_000).catch(() => {});
    await delay(250);
    const screenshot = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      fromSurface: true,
    }, 45_000);
    await fs.writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
  }

  close() {
    this.ws.close();
  }
}

function decodeJwt(token) {
  if (!token || token.split('.').length !== 3) return null;
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = `${payload}${'='.repeat((4 - payload.length % 4) % 4)}`;
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

function base32Decode(input) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (const char of clean) {
    const value = alphabet.indexOf(char);
    if (value === -1) throw new Error(`Invalid base32 char: ${char}`);
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTotp(secret, step = Math.floor(Date.now() / 30_000)) {
  const key = base32Decode(secret);
  const counter = Buffer.alloc(8);
  counter.writeUInt32BE(Math.floor(step / 0x100000000), 0);
  counter.writeUInt32BE(step >>> 0, 4);
  const hmac = crypto.createHmac('sha1', key).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff)
  ) % 1_000_000;
  return String(code).padStart(6, '0');
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
      // Try next origin.
    }
  }

  throw new Error('Supabase config niet gevonden. Zet QA_SUPABASE_URL en QA_SUPABASE_ANON_KEY.');
}

async function signInSupabaseQaAccount(email, credentialsPath) {
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

  return { config, session: payload, email, schoolId: credentials.schoolId || SCHOOL_ID };
}

async function restGet(authContext, table, params) {
  const url = new URL(`${authContext.config.url}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: {
      apikey: authContext.config.anonKey,
      authorization: `Bearer ${authContext.session.access_token}`,
      accept: 'application/json',
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return { ok: false, status: response.status, payload };
  }
  return { ok: true, status: response.status, payload: Array.isArray(payload) ? payload : [] };
}

async function setViewport(client, viewport) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });
}

async function seedSession(client, authContext) {
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

  await client.send('Page.navigate', { url: `${ORIGIN}/?qaTeacherSeed=${Date.now()}` });
  await client.waitForExpression(`document.readyState === 'complete'`, 'origin ready');
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
    localStorage.setItem('teacher_tutorial_completed', 'true');
    sessionStorage.setItem('dgskills_teacher_classFilter', ${JSON.stringify(CLASS_FILTER)});
    sessionStorage.setItem('dgskills_teacher_yearGroup', ${JSON.stringify(String(YEAR_GROUP))});
    return storageKey;
  })()`);
  return storageKey;
}

async function storedSession(client) {
  const raw = await client.eval(`(() => {
    const key = Object.keys(localStorage).find((item) => /^sb-[a-z0-9_-]+-auth-token$/i.test(item));
    return key ? localStorage.getItem(key) : null;
  })()`);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return parsed.currentSession || parsed;
}

async function visiblePageState(client) {
  return client.eval(`(() => {
    const text = document.body?.innerText || '';
    const buttons = Array.from(document.querySelectorAll('button'))
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .map((button) => (button.innerText || button.getAttribute('aria-label') || '').trim())
      .filter(Boolean)
      .slice(0, 80);
    return {
      url: location.href,
      title: document.title,
      textSample: text.slice(0, 2500),
      buttons,
      secret: document.querySelector('code')?.textContent?.trim() || null,
    };
  })()`);
}

async function clickButtonMatching(client, patterns, label) {
  const sources = patterns.map((pattern) => pattern.source);
  const flags = patterns.map((pattern) => pattern.flags);
  const clicked = await client.eval(`(() => {
    const sources = ${JSON.stringify(sources)};
    const flags = ${JSON.stringify(flags)};
    const patterns = sources.map((source, index) => new RegExp(source, flags[index]));
    const isVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'))
      .filter((el) => !el.disabled && isVisible(el));
    const button = buttons.find((el) => patterns.some((pattern) => pattern.test((el.innerText || el.getAttribute('aria-label') || '').trim())));
    if (!button) return false;
    button.scrollIntoView({ block: 'center', inline: 'center' });
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Knop niet gevonden: ${label}`);
}

async function fillFirstInput(client, value, selector = 'input') {
  const filled = await client.eval(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    input.focus();
    input.value = ${JSON.stringify(value)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!filled) throw new Error(`Input niet gevonden: ${selector}`);
}

async function completeMfaIfNeeded(client) {
  await delay(800);
  let state = await visiblePageState(client);
  if (!/Verificatie vereist|MFA Activeren|Verifieer/i.test(state.textSample)) {
    return { status: 'not_required_or_already_clear' };
  }

  if (!state.secret) {
    return {
      status: 'blocked_existing_factor',
      reason: 'MFA verify-scherm heeft geen secret; QA-account heeft waarschijnlijk al een onbekende authenticator.',
      buttons: state.buttons,
    };
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const code = generateTotp(state.secret, Math.floor(Date.now() / 30_000) + attempt);
    await fillFirstInput(client, code, 'input[inputmode="numeric"], input');
    await clickButtonMatching(client, [/MFA Activeren/i, /Verifieer/i], 'MFA verifiëren');
    await delay(1800);
    state = await visiblePageState(client);
    if (!/Ongeldige verificatiecode|Verificatie mislukt/i.test(state.textSample)) {
      break;
    }
  }

  await client.waitForExpression(`!/(MFA Activeren|Verificatie mislukt|Ongeldige verificatiecode)/i.test(document.body.innerText || '')`, 'MFA verified', 20_000);
  return { status: 'enrolled_and_verified' };
}

async function completeTeacherOnboardingIfNeeded(client) {
  await delay(800);
  let state = await visiblePageState(client);
  if (!/Welkom bij DGSkills|Eerste keer|Hoe heet je voor je leerlingen|Klaar om te starten/i.test(state.textSample)) {
    return { status: 'not_required' };
  }

  if (/Welkom bij DGSkills|Eerste keer/i.test(state.textSample)) {
    await clickButtonMatching(client, [/Aan de slag/i], 'teacher onboarding start');
    await delay(400);
  }

  state = await visiblePageState(client);
  if (/Hoe heet je voor je leerlingen|Naam/i.test(state.textSample)) {
    await fillFirstInput(client, 'QA Docent DGSkills', '#teacher-display-name');
    await clickButtonMatching(client, [/Volgende/i], 'teacher onboarding volgende');
    await delay(400);
  }

  await clickButtonMatching(client, [/Naar dashboard/i], 'teacher onboarding afronden');
  await client.waitForExpression(`/Docentendashboard|DGSkills|Overzicht|Leerlingen/i.test(document.body.innerText || '')`, 'teacher dashboard after onboarding', 20_000);
  return { status: 'completed' };
}

async function navigateTeacherDashboard(client) {
  await client.eval(`(() => {
    sessionStorage.setItem('dgskills_teacher_classFilter', ${JSON.stringify(CLASS_FILTER)});
    sessionStorage.setItem('dgskills_teacher_yearGroup', ${JSON.stringify(String(YEAR_GROUP))});
    localStorage.setItem('teacher_tutorial_completed', 'true');
  })()`);
  await client.send('Page.navigate', { url: `${ORIGIN}/dashboard?qaTeacherVisibility=${Date.now()}` });
  await client.waitForExpression(`document.readyState === 'complete'`, 'dashboard document ready', 20_000);
  await delay(1000);
}

async function captureTeacherViews(client, viewport, outDir) {
  await setViewport(client, viewport);
  await navigateTeacherDashboard(client);
  const mfa = await completeMfaIfNeeded(client);
  if (mfa.status === 'blocked_existing_factor') {
    return { viewport: viewport.name, mfa, screenshots: {}, state: await visiblePageState(client) };
  }
  const onboarding = await completeTeacherOnboardingIfNeeded(client);
  await client.waitForExpression(`/Docentendashboard|Missiekaart|${CLASS_FILTER}/i.test(document.body.innerText || '')`, 'teacher dashboard loaded', 25_000);
  await delay(800);

  await clickButtonMatching(client, [/^Leerlingen$/i, /Samenwerken stimuleren/i], 'leerlingenoverzicht');
  await client.waitForExpression(`/Zoek leerling|Geen leerlingen gevonden|${CLASS_FILTER}|${STUDENT_EMAIL.split('@')[0]}/i.test(document.body.innerText || '')`, 'students tab loaded', 20_000);
  const studentsPath = path.join(outDir, `${viewport.name}-teacher-students.png`);
  await client.screenshot(studentsPath);
  const studentsState = await visiblePageState(client);

  await clickButtonMatching(client, [/^Rapporten$/i, /Bekijk rapport/i], 'rapporten');
  await client.waitForExpression(`/Missie Voortgang|Klasvoortgang/i.test(document.body.innerText || '')`, 'progress tab loaded', 20_000);
  const progressPath = path.join(outDir, `${viewport.name}-teacher-progress.png`);
  await client.screenshot(progressPath);
  const progressState = await visiblePageState(client);

  return {
    viewport: viewport.name,
    mfa,
    onboarding,
    screenshots: {
      students: studentsPath,
      progress: progressPath,
    },
    visualMarkers: {
      studentsHasClass: studentsState.textSample.includes(CLASS_FILTER),
      studentsHasQaStudentIdentifier: studentsState.textSample.includes(STUDENT_EMAIL.split('@')[0]),
      progressHasPanel: /Missie Voortgang|Klasvoortgang/.test(progressState.textSample),
      progressHasJ2Missions: J2P1_MISSIONS.filter((missionId) => progressState.textSample.toLowerCase().includes(missionId.replaceAll('-', ' '))).length,
      progressTextSample: progressState.textSample.slice(0, 1200),
    },
  };
}

async function teacherReadback(authContext, client) {
  const latestSession = await storedSession(client);
  if (latestSession?.access_token) {
    authContext.session = { ...authContext.session, ...latestSession };
  }

  const jwt = decodeJwt(authContext.session.access_token);
  const studentRows = await restGet(authContext, 'users', {
    select: 'uid,email,school_id,student_class,stats',
    email: `eq.${STUDENT_EMAIL}`,
    school_id: `eq.${SCHOOL_ID}`,
    limit: '1',
  });
  const crossSchoolRows = await restGet(authContext, 'users', {
    select: 'uid,email,school_id',
    role: 'eq.student',
    school_id: `neq.${SCHOOL_ID}`,
    limit: '20',
  });

  const student = studentRows.ok ? studentRows.payload[0] : null;
  const missionProgress = student?.uid ? await restGet(authContext, 'mission_progress', {
    select: 'mission_id,status,score,updated_at',
    user_id: `eq.${student.uid}`,
    mission_id: `in.(${J2P1_MISSIONS.join(',')})`,
  }) : { ok: false, status: 0, payload: 'student missing' };

  const studentActivities = student?.uid ? await restGet(authContext, 'student_activities', {
    select: 'id,type,mission_id,timestamp',
    uid: `eq.${student.uid}`,
    mission_id: `in.(${J2P1_MISSIONS.join(',')})`,
    type: 'eq.mission_complete',
    limit: '50',
  }) : { ok: false, status: 0, payload: 'student missing' };

  const completed = Array.isArray(student?.stats?.missionsCompleted) ? student.stats.missionsCompleted : [];

  return {
    jwt: {
      sub: jwt?.sub || null,
      aal: jwt?.aal || null,
      role: jwt?.app_metadata?.role || null,
      schoolId: jwt?.app_metadata?.schoolId || null,
    },
    studentVisible: Boolean(student),
    studentClass: student?.student_class || null,
    missionsCompletedVisible: J2P1_MISSIONS.filter((missionId) => completed.includes(missionId)),
    usersRead: {
      ok: studentRows.ok,
      status: studentRows.status,
      rows: studentRows.ok ? studentRows.payload.length : 0,
    },
    crossSchoolLeakCheck: {
      ok: crossSchoolRows.ok,
      status: crossSchoolRows.status,
      rowsVisible: crossSchoolRows.ok ? crossSchoolRows.payload.length : null,
    },
    missionProgressRead: {
      ok: missionProgress.ok,
      status: missionProgress.status,
      rows: missionProgress.ok ? missionProgress.payload.length : null,
      missionIds: missionProgress.ok ? missionProgress.payload.map((row) => row.mission_id).sort() : [],
    },
    studentActivitiesRead: {
      ok: studentActivities.ok,
      status: studentActivities.status,
      rows: studentActivities.ok ? studentActivities.payload.length : null,
      missionIds: studentActivities.ok ? studentActivities.payload.map((row) => row.mission_id).sort() : [],
    },
  };
}

function buildMarkdown(report) {
  const lines = [
    '# J2 P1 Teacher Visibility Smoke',
    '',
    `- Datum: ${report.startedAt}`,
    `- Target: ${ORIGIN}`,
    `- QA teacher: ${TEACHER_EMAIL}`,
    `- QA student: ${STUDENT_EMAIL}`,
    `- School/klas/leerjaar: ${SCHOOL_ID} / ${CLASS_FILTER} / ${YEAR_GROUP}`,
    '',
    '## Oordeel',
    '',
    `- Status: ${report.status}`,
    `- MFA: ${report.mfaStatus}`,
    `- Teacher-token AAL: ${report.readback?.jwt?.aal || 'onbekend'}`,
    `- Teacher ziet J2 QA-student: ${report.readback?.studentVisible ? 'ja' : 'nee'}`,
    `- Cross-school student rows zichtbaar: ${report.readback?.crossSchoolLeakCheck?.rowsVisible ?? 'onbekend'}`,
    `- Missies zichtbaar in user.stats: ${(report.readback?.missionsCompletedVisible || []).join(', ') || 'geen'}`,
    '',
    '## Screenshots',
    '',
  ];

  for (const item of report.visualRuns) {
    lines.push(`### ${item.viewport}`);
    if (item.screenshots?.students) lines.push(`- Leerlingen: ${item.screenshots.students}`);
    if (item.screenshots?.progress) lines.push(`- Rapporten: ${item.screenshots.progress}`);
    lines.push(`- Markers: ${JSON.stringify(item.visualMarkers || item.mfa || {})}`);
    lines.push('');
  }

  lines.push('## Readback');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(report.readback, null, 2));
  lines.push('```');
  lines.push('');

  if (report.findings.length) {
    lines.push('## Findings');
    lines.push('');
    for (const finding of report.findings) lines.push(`- ${finding}`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const startedAt = new Date().toISOString();
  const outDir = path.join(ARTIFACT_ROOT, `j2p1-teacher-visibility-${startedAt.replace(/[:.]/g, '-')}`);
  await fs.mkdir(outDir, { recursive: true });
  await waitForHttp(ORIGIN, 'DGSkills target');
  await waitForChrome();

  const authContext = await signInSupabaseQaAccount(TEACHER_EMAIL, CREDENTIALS_PATH);
  const page = await requestJson('PUT', `/json/new?${encodeURIComponent('about:blank')}`);
  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Network.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');

  const report = {
    startedAt,
    target: ORIGIN,
    teacherEmail: TEACHER_EMAIL,
    studentEmail: STUDENT_EMAIL,
    schoolId: SCHOOL_ID,
    classFilter: CLASS_FILTER,
    yearGroup: YEAR_GROUP,
    missions: J2P1_MISSIONS,
    visualRuns: [],
    readback: null,
    consoleErrors: [],
    findings: [],
    status: 'pending',
    mfaStatus: 'unknown',
  };

  try {
    await seedSession(client, authContext);
    for (const viewport of VIEWPORTS) {
      const result = await captureTeacherViews(client, viewport, outDir);
      report.visualRuns.push(result);
      if (result.mfa?.status === 'blocked_existing_factor') {
        report.mfaStatus = result.mfa.status;
        throw new Error(result.mfa.reason);
      }
      report.mfaStatus = result.mfa?.status || report.mfaStatus;
    }

    report.readback = await teacherReadback(authContext, client);
    report.consoleErrors = client.messages
      .map((message) => JSON.stringify(message))
      .filter((line) => /error|exception|failed|permission denied/i.test(line))
      .slice(-30);

    const allViewsHaveScreens = report.visualRuns.every((run) => run.screenshots?.students && run.screenshots?.progress);
    const hasAal2 = report.readback?.jwt?.aal === 'aal2';
    const seesStudent = report.readback?.studentVisible && report.readback?.studentClass === CLASS_FILTER;
    const noCrossSchoolRows = report.readback?.crossSchoolLeakCheck?.ok && report.readback.crossSchoolLeakCheck.rowsVisible === 0;
    const seesCompleted = report.readback?.missionsCompletedVisible?.length >= J2P1_MISSIONS.length;

    if (!hasAal2) report.findings.push('Teacher visibility readback heeft geen AAL2-token; privileged RLS-proof blijft onvoldoende.');
    if (!seesStudent) report.findings.push('Teacher kan de disposable J2 QA-student niet zichtbaar teruglezen binnen school/klas.');
    if (!noCrossSchoolRows) report.findings.push('Cross-school leak check is niet hard groen; controleer users RLS met teacher-token.');
    if (!seesCompleted) report.findings.push('Niet alle J2 P1 completions zijn zichtbaar via users.stats.missionsCompleted in teacher-readback.');
    if (!allViewsHaveScreens) report.findings.push('Niet alle viewports hebben zowel leerlingen- als rapportenscreenshot.');

    report.status = report.findings.length ? 'fix-eerst' : 'ship-slice';
  } catch (error) {
    report.status = 'blocked';
    report.findings.push(error.message);
    const blockerPath = path.join(outDir, 'blocked-state.png');
    await client.screenshot(blockerPath).catch(() => {});
    report.blockerScreenshot = blockerPath;
  } finally {
    client.close();
  }

  const jsonPath = path.join(outDir, 'report.json');
  const mdPath = path.join(outDir, 'report.md');
  await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(mdPath, buildMarkdown(report));

  console.log(`Teacher visibility status: ${report.status}`);
  console.log(`Report: ${mdPath}`);
  if (report.findings.length) {
    console.log('Findings:');
    for (const finding of report.findings) console.log(`- ${finding}`);
  }

  if (report.status === 'blocked') process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
