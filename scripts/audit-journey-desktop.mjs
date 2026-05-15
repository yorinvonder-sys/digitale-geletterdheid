import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';

const DEFAULT_URL = 'http://127.0.0.1:3001/';
const DEFAULT_OUT_DIR = 'reports/journey-desktop-audit';

const url = process.argv.find((arg) => arg.startsWith('--url='))?.slice('--url='.length) ?? DEFAULT_URL;
const outDir = resolve(process.argv.find((arg) => arg.startsWith('--out='))?.slice('--out='.length) ?? DEFAULT_OUT_DIR);
const viewports = [
    { name: 'desktop-1440x900', width: 1440, height: 900 },
    { name: 'wide-1920x1080', width: 1920, height: 1080 },
];

const chromeCandidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
].filter(Boolean);

function freePort() {
    return new Promise((resolvePort, reject) => {
        const server = net.createServer();
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            server.close(() => resolvePort(address.port));
        });
        server.on('error', reject);
    });
}

async function findChrome() {
    for (const candidate of chromeCandidates) {
        try {
            const { access } = await import('node:fs/promises');
            await access(candidate);
            return candidate;
        } catch {
            // Try the next common install path.
        }
    }
    throw new Error('Chrome not found. Set CHROME_BIN to a Chrome or Chromium executable.');
}

async function waitForJsonEndpoint(port, attempts = 40) {
    const endpoint = `http://127.0.0.1:${port}/json/version`;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) return response.json();
        } catch {
            // Chrome is still starting.
        }
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
    }
    throw new Error('Chrome DevTools endpoint did not become available.');
}

class CdpClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.nextId = 1;
        this.pending = new Map();
        this.events = new Map();
        this.ready = new Promise((resolveReady, rejectReady) => {
            this.ws.addEventListener('open', resolveReady, { once: true });
            this.ws.addEventListener('error', rejectReady, { once: true });
        });
        this.ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.id && this.pending.has(message.id)) {
                const { resolveCommand, rejectCommand } = this.pending.get(message.id);
                this.pending.delete(message.id);
                if (message.error) rejectCommand(new Error(message.error.message));
                else resolveCommand(message.result);
                return;
            }
            const listeners = this.events.get(message.method);
            if (!listeners) return;
            for (const listener of listeners) listener(message.params);
        });
    }

    async send(method, params = {}) {
        await this.ready;
        const id = this.nextId;
        this.nextId += 1;
        const result = new Promise((resolveCommand, rejectCommand) => {
            this.pending.set(id, { resolveCommand, rejectCommand });
        });
        this.ws.send(JSON.stringify({ id, method, params }));
        return result;
    }

    once(method, timeoutMs = 10000) {
        return new Promise((resolveEvent, rejectEvent) => {
            const timeout = setTimeout(() => {
                this.off(method, listener);
                rejectEvent(new Error(`Timed out waiting for ${method}`));
            }, timeoutMs);
            const listener = (params) => {
                clearTimeout(timeout);
                this.off(method, listener);
                resolveEvent(params);
            };
            this.on(method, listener);
        });
    }

    on(method, listener) {
        const listeners = this.events.get(method) ?? new Set();
        listeners.add(listener);
        this.events.set(method, listeners);
    }

    off(method, listener) {
        this.events.get(method)?.delete(listener);
    }

    close() {
        this.ws.close();
    }
}

async function createPage(port, targetUrl) {
    const browserClient = new CdpClient((await waitForJsonEndpoint(port)).webSocketDebuggerUrl);
    const { targetId } = await browserClient.send('Target.createTarget', { url: 'about:blank' });
    browserClient.close();

    const listResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await listResponse.json();
    const target = targets.find((item) => item.id === targetId);
    if (!target?.webSocketDebuggerUrl) throw new Error('Could not find created Chrome target.');

    const page = new CdpClient(target.webSocketDebuggerUrl);
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    const loaded = page.once('Page.loadEventFired');
    await page.send('Page.navigate', { url: targetUrl });
    await loaded;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
    return page;
}

async function evaluate(page, expression) {
    const result = await page.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
    });
    if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed.');
    }
    return result.result.value;
}

async function waitForSelector(page, selector, timeoutMs = 10000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const found = await evaluate(page, `Boolean(document.querySelector(${JSON.stringify(selector)}))`);
        if (found) return;
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
    }
    throw new Error(`Timed out waiting for ${selector}`);
}

async function captureViewport(page, viewport, stepIndex) {
    const state = await evaluate(page, `
        (() => {
            const section = document.querySelector('#journey');
            if (!section) return { error: 'Missing #journey section' };
            const maxStep = 4;
            const progress = ${stepIndex} / maxStep;
            const start = section.offsetTop;
            const travel = Math.max(0, section.offsetHeight - innerHeight);
            window.scrollTo(0, Math.round(start + travel * progress));
            return { start, travel, targetScrollY: Math.round(start + travel * progress) };
        })()
    `);
    if (state?.error) throw new Error(state.error);

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 700));

    const metrics = await evaluate(page, `
        (() => {
            const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent?.includes('Jouw skill journey'));
            const card = document.querySelector('#journey [aria-current="step"]');
            const tip = card?.querySelector('[data-inline-routecoach-tip="true"]');
            const header = document.querySelector('nav');
            const headingRect = heading?.getBoundingClientRect();
            const cardRect = card?.getBoundingClientRect();
            const tipRect = tip?.getBoundingClientRect();
            const headerRect = header?.getBoundingClientRect();
            return {
                activeText: card?.textContent?.replace(/\\s+/g, ' ').trim() ?? '',
                heading: headingRect ? { top: headingRect.top, bottom: headingRect.bottom, left: headingRect.left, right: headingRect.right } : null,
                card: cardRect ? { top: cardRect.top, bottom: cardRect.bottom, left: cardRect.left, right: cardRect.right } : null,
                tip: tipRect ? { top: tipRect.top, bottom: tipRect.bottom, left: tipRect.left, right: tipRect.right } : null,
                headerBottom: headerRect?.bottom ?? 0,
                viewport: { width: innerWidth, height: innerHeight, scrollY },
            };
        })()
    `);

    const screenshot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const fileName = `${viewport.name}-step-${String(stepIndex + 1).padStart(2, '0')}.png`;
    await writeFile(join(outDir, fileName), Buffer.from(screenshot.data, 'base64'));

    const headingVisible = metrics.heading && metrics.heading.top >= metrics.headerBottom + 8 && metrics.heading.bottom <= viewport.height;
    const cardVisible = metrics.card && metrics.card.top >= metrics.headerBottom && metrics.card.bottom <= viewport.height;
    const tipInsideCard = metrics.tip && metrics.card && metrics.tip.left >= metrics.card.left && metrics.tip.right <= metrics.card.right && metrics.tip.top >= metrics.card.top && metrics.tip.bottom <= metrics.card.bottom;

    return {
        type: 'journey',
        viewport: viewport.name,
        step: stepIndex + 1,
        file: fileName,
        activeText: metrics.activeText,
        headingVisible: Boolean(headingVisible),
        cardVisible: Boolean(cardVisible),
        tipInsideCard: Boolean(tipInsideCard),
        metrics,
    };
}

async function captureSkillsSection(page, viewport) {
    await waitForSelector(page, '#skills');
    const state = await evaluate(page, `
        (() => {
            const section = document.querySelector('#skills');
            if (!section) return { error: 'Missing #skills section' };
            window.scrollTo(0, Math.max(0, section.offsetTop - 112));
            const cards = section.querySelectorAll('.skill-card-motion article');
            const target = cards[2];
            target?.focus();
            target?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window }));
            return { cardCount: cards.length, targetTitle: target?.textContent?.replace(/\\s+/g, ' ').trim() ?? '' };
        })()
    `);
    if (state?.error) throw new Error(state.error);

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 350));

    const metrics = await evaluate(page, `
        (() => {
            const section = document.querySelector('#skills');
            const heading = [...section.querySelectorAll('h2')].find((node) => node.textContent?.includes('Ontdek jouw favoriete skills'));
            const coach = [...section.querySelectorAll('p')].find((node) => node.textContent?.includes('Perfect voor leerlingen'));
            const beaver = section.querySelector('img[src="/assets/storytelling/beaver-storyteller.webp"]');
            const header = document.querySelector('nav');
            const headingRect = heading?.getBoundingClientRect();
            const coachRect = coach?.getBoundingClientRect();
            const beaverRect = beaver?.getBoundingClientRect();
            const headerRect = header?.getBoundingClientRect();
            return {
                headingText: heading?.textContent ?? '',
                coachText: coach?.textContent ?? '',
                heading: headingRect ? { top: headingRect.top, bottom: headingRect.bottom, left: headingRect.left, right: headingRect.right } : null,
                coach: coachRect ? { top: coachRect.top, bottom: coachRect.bottom, left: coachRect.left, right: coachRect.right } : null,
                beaver: beaverRect ? { top: beaverRect.top, bottom: beaverRect.bottom, left: beaverRect.left, right: beaverRect.right } : null,
                headerBottom: headerRect?.bottom ?? 0,
                viewport: { width: innerWidth, height: innerHeight, scrollY },
            };
        })()
    `);

    const screenshot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const fileName = `${viewport.name}-skills-coach.png`;
    await writeFile(join(outDir, fileName), Buffer.from(screenshot.data, 'base64'));

    const headingVisible = metrics.heading && metrics.heading.top >= metrics.headerBottom + 8 && metrics.heading.bottom <= viewport.height;
    const coachVisible = metrics.coach && metrics.coach.top >= metrics.headerBottom && metrics.coach.bottom <= viewport.height;
    const beaverVisible = metrics.beaver && metrics.beaver.top >= metrics.headerBottom && metrics.beaver.bottom <= viewport.height;
    const coachUpdated = metrics.coachText.includes('Perfect voor leerlingen');

    return {
        type: 'skills',
        viewport: viewport.name,
        file: fileName,
        headingVisible: Boolean(headingVisible),
        coachVisible: Boolean(coachVisible),
        beaverVisible: Boolean(beaverVisible),
        coachUpdated: Boolean(coachUpdated),
        metrics,
    };
}

await mkdir(outDir, { recursive: true });

const chrome = await findChrome();
const port = await freePort();
const profileDir = await mkdtemp(join(tmpdir(), 'dgskills-journey-audit-'));
const chromeProcess = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const stderr = [];
chromeProcess.stderr.on('data', (chunk) => stderr.push(chunk.toString()));

const results = [];
let page;

try {
    page = await createPage(port, url);
    for (const viewport of viewports) {
        await page.send('Emulation.setDeviceMetricsOverride', {
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 1,
            mobile: false,
        });
        await page.send('Emulation.setVisibleSize', { width: viewport.width, height: viewport.height });
        await page.send('Page.reload', { ignoreCache: true });
        await page.once('Page.loadEventFired');
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));

        results.push(await captureSkillsSection(page, viewport));

        for (const stepIndex of [0, 1, 2, 3, 4]) {
            results.push(await captureViewport(page, viewport, stepIndex));
        }
    }
} finally {
    page?.close();
    chromeProcess.kill();
    if (chromeProcess.exitCode === null) {
        await once(chromeProcess, 'exit').catch(() => {});
    }
    await rm(profileDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 150 });
}

const failures = results.filter((result) => {
    if (result.type === 'skills') {
        return !result.headingVisible || !result.coachVisible || !result.beaverVisible || !result.coachUpdated;
    }
    return !result.headingVisible || !result.cardVisible || !result.tipInsideCard;
});
const report = {
    url,
    outDir,
    generatedAt: new Date().toISOString(),
    results,
    failures,
};

await writeFile(join(outDir, 'report.json'), JSON.stringify(report, null, 2));

if (failures.length) {
    console.error(`Journey desktop audit failed. See ${join(outDir, 'report.json')}`);
    console.error(JSON.stringify(failures.map(({ type, viewport, step, file, headingVisible, cardVisible, tipInsideCard, coachVisible, beaverVisible, coachUpdated }) => ({ type, viewport, step, file, headingVisible, cardVisible, tipInsideCard, coachVisible, beaverVisible, coachUpdated })), null, 2));
    process.exit(1);
}

console.log(`Journey and skills desktop audit passed. Screenshots written to ${outDir}`);
