/**
 * screenshot-all-assignments.mjs
 *
 * Captures full-page WebP screenshots of every DGSkills assignment
 * across 3 viewports using Playwright Chromium.
 *
 * Usage:
 *   1. Start dev server:  npm run dev
 *   2. Run this script:   node scripts/screenshot-all-assignments.mjs
 *
 * Output: screenshots/assignments/<mission-id>/*.webp + index.json
 */

// ── Config ───────────────────────────────────────────────────────────────────
const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:5173';
const OUT_DIR = process.env.OUT_DIR || 'screenshots/assignments';
const WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 80);
const PER_MISSION_TIMEOUT_MS = Number(process.env.TIMEOUT || 30_000);

const VIEWPORTS = [
  { name: 'desktop-1440x900',  width: 1440, height: 900 },
  { name: 'tablet-1024x1366',  width: 1024, height: 1366 },
  { name: 'mobile-390x844',    width: 390,  height: 844 },
];

// ── Mission list ─────────────────────────────────────────────────────────────
// Source: src/app/AuthenticatedApp.tsx (DEDICATED_MISSIONS)
const DEDICATED = [
  'prompt-master',
  'game-director',
  'cloud-cleaner',
  'layout-doctor',
  'pitch-police',
  'data-detective',
  'deepfake-detector',
  'ipad-print-instructies',
  'filter-bubble-breaker',
  'datalekken-rampenplan',
  'data-voor-data',
  'access-control-engineer',
];

// Source: src/config/templateRegistry.ts
const TEMPLATE = [
  // scenario-engine (11)
  'mail-detective', 'cookie-crusher', 'notificatie-ninja', 'online-helden',
  'phishing-fighter', 'social-safeguard', 'factchecker', 'ai-bias-detective',
  'digital-forensics', 'code-denker', 'data-speurder',
  // puzzle-lab (5)
  'encryption-expert', 'cyber-detective', 'wachtwoord-warrior', 'data-handelaar',
  'security-auditor',
  // simulation-lab (5)
  'privacy-by-design', 'bug-hunter', 'code-reviewer', 'ai-spiegel',
  'algorithm-architect',
  // review-arena (7)
  'review-week-2', 'data-review', 'code-review-2', 'media-review',
  'security-review', 'advanced-code-review', 'impact-review',
  // builder-canvas (19)
  'website-bouwer', 'web-developer', 'podcast-producer', 'brand-builder',
  'video-editor', 'meme-machine', 'digital-storyteller', 'app-prototyper',
  'automation-engineer', 'api-architect', 'open-source-contributor',
  'startup-simulator', 'innovation-lab', 'portfolio-builder',
  'prototype-developer', 'pitch-perfect', 'meesterproef', 'mission-blueprint',
  'mission-vision',
  // data-viewer (15)
  'data-journalist', 'welzijnsonderzoeker', 'spreadsheet-specialist',
  'api-verkenner', 'dashboard-designer', 'network-navigator', 'data-pipeline',
  'ml-trainer', 'neural-navigator', 'ux-detective', 'digital-divide-researcher',
  'tech-impact-analyst', 'sustainability-scanner', 'research-project',
  'eindproject-j2',
  // debate-arena (10)
  'schermtijd-coach', 'digitale-balans-coach', 'scroll-stopper', 'ai-ethicus',
  'digital-rights-defender', 'tech-court', 'future-forecaster', 'policy-maker',
  'reflection-report', 'review-week-3',
  // tool-guide (7)
  'magister-master', 'cloud-commander', 'word-wizard', 'slide-specialist',
  'print-pro', 'mission-launch', 'startup-pitch',
];

// Agent-only roles (not in dedicated or template) — sample of unique ones
const AGENT_SAMPLE = [
  'social-media-psychologist', 'verhalen-ontwerper', 'bonus-extra-pagina',
  'ai-trainer', 'chatbot-trainer', 'ai-tekengame', 'ai-beleid-brainstorm',
];

const ALL_MISSIONS = [...DEDICATED, ...TEMPLATE, ...AGENT_SAMPLE];
const DEDICATED_SET = new Set(DEDICATED);

// ── Imports ──────────────────────────────────────────────────────────────────
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Try to click primary interactive buttons on a mission page */
async function captureInteractiveSteps(page, missionId, viewportName, outDir) {
  const steps = [{ label: 'intro', screenshot: async () => {} }];
  const results = [];

  // Step 0: intro already captured by caller
  results.push({ step: 0, label: 'intro' });

  let stepIndex = 1;
  const maxSteps = 5; // safety limit

  // Selectors that typically represent "start/next/submit" in missions
  const ctaSelectors = [
    'button[data-qa$="start"]',
    'button[data-qa$="next"]',
    'button[data-qa$="submit"]',
    'button[data-qa$="try-again"]',
    'button:has-text("Start")',
    'button:has-text("Volgende")',
    'button:has-text("Begin")',
    'button:has-text("Doorgaan")',
    'button:has-text("Checken")',
    'button:has-text("Verstuur")',
    'button:has-text("Probeer opnieuw")',
    '[data-qa]:has-text("Start")',
    '[data-qa]:has-text("Volgende")',
  ];

  for (const sel of ctaSelectors) {
    if (stepIndex >= maxSteps) break;
    try {
      const btn = await page.$(sel);
      if (!btn) continue;

      // Check if button is visible and enabled
      const visible = await btn.isVisible();
      const disabled = await btn.isDisabled();
      if (!visible || disabled) continue;

      await btn.click();
      // Wait for new content to render
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(600);

      const pngPath = path.join(outDir, `${viewportName}.step-${stepIndex}.png`);
      const webpPath = path.join(outDir, `${viewportName}.step-${stepIndex}.webp`);
      await page.screenshot({
        path: pngPath,
        fullPage: true,
        type: 'png',
      });
      // Convert to WebP via sharp for efficient storage
      await sharp(pngPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      await fs.unlink(pngPath); // remove PNG
      const size = (await fs.stat(webpPath)).size;
      results.push({ step: stepIndex, label: `click-${sel.replace(/[^a-z0-9-]/g, '-')}`, file: fileName, size });

      stepIndex++;
    } catch {
      // selector not found or not usable, skip
    }
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Ensure output directory exists
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Keep track of what we captured
  const index = {
    generatedAt: new Date().toISOString(),
    origin: ORIGIN,
    viewports: VIEWPORTS.map(v => `${v.name} (${v.width}x${v.height})`),
    totalMissions: ALL_MISSIONS.length,
    totalFiles: 0,
    missions: [],
  };

  console.log(`\n📸 Screenshotting ${ALL_MISSIONS.length} missions across ${VIEWPORTS.length} viewports...\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: VIEWPORTS[0], // temporary — we override per mission
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const missionId of ALL_MISSIONS) {
    const missionOutDir = path.join(OUT_DIR, missionId);
    await fs.mkdir(missionOutDir, { recursive: true });

    const isDedicated = DEDICATED_SET.has(missionId);
    const missionType = isDedicated ? 'dedicated' : TEMPLATE.includes(missionId) ? 'template' : 'agent';
    const missionInfo = { missionId, type: missionType, viewports: {} };

    console.log(`  ${missionId} (${missionType})`);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const vpName = vp.name;

      try {
        const url = `${ORIGIN}/dev/mission-preview?mission=${missionId}&reset=1&qaRun=${Date.now()}`;

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: PER_MISSION_TIMEOUT_MS,
        });

        // Wait for the React app to render actual content
        // Check for either a mission container or an error/unsupported message
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(1000);

        // Don't screenshot if the page shows "not available" for unsupported missions
        const unsupported = await page.$('[data-qa="mission-preview-unsupported"]');
        if (unsupported) {
          console.log(`    ⏭ ${vpName} — unsupported in dev preview`);
          missionInfo.viewports[vpName] = { status: 'unsupported', files: [] };
          continue;
        }

        // Wait for actual mission content — at least some text/elements beyond the loading state
        const hasContent = await page.waitForFunction(
          () => document.body.innerText.length > 200 && !document.body.innerText.includes('Missie laden'),
          { timeout: 15000, polling: 500 }
        ).then(() => true).catch(() => false);

        if (!hasContent) {
          console.log(`    ⏭ ${vpName} — no content rendered`);
          missionInfo.viewports[vpName] = { status: 'empty', files: [] };
          continue;
        }

        // ── Full-page screenshot (PNG → WebP via sharp) ──
        const pngPath = path.join(missionOutDir, `${vpName}.step-0-intro.png`);
        const webpPath = path.join(missionOutDir, `${vpName}.step-0-intro.webp`);
        await page.screenshot({
          path: pngPath,
          fullPage: true,
          type: 'png',
        });
        // Convert to WebP for efficient storage
        await sharp(pngPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
        await fs.unlink(pngPath);

        const introFileSize = (await fs.stat(webpPath)).size;
        const files = [{ step: 0, label: 'intro', file: path.basename(webpPath), size: introFileSize }];

        // ── Interactive steps (for dedicated missions only — too many templates) ──
        if (isDedicated) {
          const stepResults = await captureInteractiveSteps(page, missionId, vpName, missionOutDir);
          for (const r of stepResults) {
            if (r.file) files.push(r);
          }
        }

        missionInfo.viewports[vpName] = { status: 'ok', files };

        const kb = (introFileSize / 1024).toFixed(1);
        console.log(`    ✅ ${vpName}  (${kb} KB${files.length > 1 ? `, ${files.length} steps` : ''})`);

      } catch (err) {
        console.log(`    ❌ ${vpName} — ${err.message?.slice(0, 80) || err}`);
        missionInfo.viewports[vpName] = { status: 'error', error: err.message?.slice(0, 200) };
      }
    }

    index.missions.push(missionInfo);
    console.log(''); // blank line between missions
  }

  await browser.close();

  // Count total files
  let totalFiles = 0;
  for (const m of index.missions) {
    for (const vp of Object.values(m.viewports)) {
      if (vp.files) totalFiles += vp.files.length;
    }
  }
  index.totalFiles = totalFiles;

  // Write index.json
  await fs.writeFile(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  );

  // Summary
  const ok = index.missions.filter(m => Object.values(m.viewports).some(v => v.status === 'ok')).length;
  const errors = index.missions.filter(m => Object.values(m.viewports).some(v => v.status === 'error')).length;
  const skipped = index.missions.filter(m => Object.values(m.viewports).every(v => v.status === 'unsupported' || v.status === 'empty')).length;

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ✅ ${ok} missions captured`);
  console.log(`  ❌ ${errors} missions with errors`);
  console.log(`  ⏭ ${skipped} missions skipped (unsupported/empty)`);
  console.log(`  📄 ${totalFiles} total screenshots`);
  console.log(`  📁 ${OUT_DIR}/`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
