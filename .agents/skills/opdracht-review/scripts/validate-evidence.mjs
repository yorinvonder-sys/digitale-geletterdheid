#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_VIEWPORTS = new Map([
  ['desktop', '1440x900'],
  ['ipad-portrait', '820x1180'],
  ['ipad-landscape', '1180x820'],
  ['mobile', '375x844'],
]);
const REQUIRED_CHECKPOINTS = ['start', 'flow', 'feedback', 'recovery', 'end'];
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const HASH_PATTERN = /^[a-f0-9]{64}$/i;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const GATE_NAMES = ['veto1', 'veto2', 'veto3', 'veto4', 'poort1', 'poort2', 'poort3'];
const VETO_NAMES = ['veto1', 'veto2', 'veto3', 'veto4'];
const PORT_GATE_STATUSES = new Set(['GESLAAGD', 'GEZAKT', 'NIET VASTGESTELD', 'n.v.t.']);
const VETO_STATUSES = new Set(['GESLAAGD', 'GEZAKT', 'NIET VASTGESTELD']);

function fail(errors, message) { errors.push(message); }
function nonEmptyString(value) { return typeof value === 'string' && value.trim().length > 0; }
function validRecordedAt(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  return nonEmptyString(value) && Number.isFinite(Date.parse(value));
}
function recordedAtMillis(value) { return typeof value === 'number' ? value : Date.parse(value); }
function viewportString(value) {
  if (typeof value === 'string') return value.toLowerCase().replace(/\s+/g, '');
  if (value && Number.isInteger(value.width) && Number.isInteger(value.height)) return `${value.width}x${value.height}`;
  return '';
}
function viewportMatches(name, actual) { return actual === REQUIRED_VIEWPORTS.get(name); }
function parsePngDimensions(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  if (bytes.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

async function validateEvidenceFile(entry, manifestDir, errors, label) {
  if (!entry || typeof entry.path !== 'string' || entry.path.length === 0) {
    fail(errors, `${label}: relatief evidencepad ontbreekt`); return;
  }
  if (path.isAbsolute(entry.path)) { fail(errors, `${label}: evidencepad moet relatief zijn`); return; }
  const resolved = path.resolve(manifestDir, entry.path);
  const relative = path.relative(manifestDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(errors, `${label}: evidencepad verlaat de manifestmap`); return;
  }
  let bytes;
  try {
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error('geen bestand');
    bytes = await readFile(resolved);
  } catch {
    fail(errors, `${label}: bestand ontbreekt (${entry.path})`); return;
  }
  const dimensions = parsePngDimensions(bytes);
  if (!dimensions) { fail(errors, `${label}: bestand is geen geldige PNG (${entry.path})`); return; }
  if (!HASH_PATTERN.test(entry.sha256 ?? '')) fail(errors, `${label}: geldige SHA-256 ontbreekt`);
  else if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256.toLowerCase()) fail(errors, `${label}: SHA-256 komt niet overeen`);
  if (entry.width !== dimensions.width || entry.height !== dimensions.height) {
    fail(errors, `${label}: afmetingen ${dimensions.width}x${dimensions.height} verschillen van manifest ${entry.width}x${entry.height}`);
  }
}

async function buildScreenshotIndex(manifest, manifestDir, errors) {
  const entries = manifest.environment === 'production'
    ? (Array.isArray(manifest.evidence) ? manifest.evidence : [])
    : (Array.isArray(manifest.viewports) ? manifest.viewports.flatMap((viewport) => Array.isArray(viewport?.evidence) ? viewport.evidence : []) : []);
  if (entries.length === 0) { fail(errors, 'evidence-PNG-index ontbreekt'); return new Map(); }
  const index = new Map();
  const paths = new Map();
  for (const [i, entry] of entries.entries()) {
    if (!Number.isInteger(entry?.screenshot) || entry.screenshot < 1) fail(errors, `evidence[${i}].screenshot moet positief zijn`);
    else if (index.has(entry.screenshot)) fail(errors, `screenshotnummer ${entry.screenshot} komt dubbel voor`);
    else if (paths.has(entry.path) && paths.get(entry.path) !== entry.screenshot) fail(errors, `hetzelfde PNG-pad heeft meerdere screenshotnummers: ${entry.path}`);
    else { index.set(entry.screenshot, entry); paths.set(entry.path, entry.screenshot); }
    await validateEvidenceFile(entry, manifestDir, errors, `evidence[${i}]`);
  }
  return index;
}

function requireScreenshot(index, value, label, errors) {
  if (!Number.isInteger(value) || value < 1 || !index.has(value)) fail(errors, `${label} verwijst niet naar een bestaande gehashte PNG`);
}

function validateCommon(manifest, errors) {
  if (manifest.schemaVersion !== 2) fail(errors, 'schemaVersion moet 2 zijn');
  if (!nonEmptyString(manifest.missionId)) fail(errors, 'missionId ontbreekt');
  if (!SHA_PATTERN.test(manifest.testedCommit ?? '')) fail(errors, 'testedCommit moet een volledige commit-SHA zijn');
  if (typeof manifest.route !== 'string' || !manifest.route.startsWith('/')) fail(errors, 'route moet een relatief browserpad zijn');
  if (!/(internal (codex|chatgpt) browser|playwright)/i.test(manifest.browser ?? '')) fail(errors, 'browser moet de interne browser zijn of Playwright bevatten');
  if (!['PASS', 'FAIL', 'BLOCKED'].includes(manifest.result)) fail(errors, 'result moet PASS, FAIL of BLOCKED zijn');
  if (!Array.isArray(manifest.limitations)) fail(errors, 'limitations moet een array zijn');
}

function validateGates(manifest, errors) {
  if (!manifest.gates || typeof manifest.gates !== 'object' || Array.isArray(manifest.gates)) { fail(errors, 'gates ontbreekt'); return; }
  for (const name of Object.keys(manifest.gates)) if (!GATE_NAMES.includes(name)) fail(errors, `onbekende gate: ${name}`);
  for (const name of GATE_NAMES) {
    const value = manifest.gates[name];
    const allowed = VETO_NAMES.includes(name) ? VETO_STATUSES : PORT_GATE_STATUSES;
    if (!allowed.has(value)) fail(errors, `gates.${name} heeft geen geldige status`);
  }
  const allVetoesGeslaagd = VETO_NAMES.every((name) => manifest.gates[name] === 'GESLAAGD');
  const hasFailed = GATE_NAMES.some((name) => manifest.gates[name] === 'GEZAKT');
  const hasUncertain = GATE_NAMES.some((name) => manifest.gates[name] === 'NIET VASTGESTELD');
  for (const name of ['poort1', 'poort2', 'poort3']) {
    if (!allVetoesGeslaagd && manifest.gates[name] !== 'n.v.t.') fail(errors, `gates.${name} moet n.v.t. zijn zolang niet alle veto's GESLAAGD zijn`);
    if (allVetoesGeslaagd && manifest.gates[name] === 'n.v.t.') fail(errors, `gates.${name} mag niet n.v.t. zijn na vier geslaagde veto's`);
  }
  const expectedResult = hasFailed ? 'FAIL' : hasUncertain ? 'BLOCKED' : allVetoesGeslaagd && ['poort1', 'poort2', 'poort3'].every((name) => manifest.gates[name] === 'GESLAAGD') ? 'PASS' : manifest.result;
  if (manifest.result !== expectedResult) fail(errors, `result past niet bij gates (verwacht ${expectedResult})`);
  if (manifest.veto2?.percentage > 0.5 && manifest.gates.veto2 === 'GESLAAGD') fail(errors, 'gates.veto2 mag niet GESLAAGD zijn boven 50% lezen/klikken');
}

function frameShape(frame, label, errors) {
  if (!frame || typeof frame !== 'object' || Array.isArray(frame)) { fail(errors, `${label} moet een frame-object zijn`); return false; }
  if (!Number.isFinite(frame.t)) fail(errors, `${label}.t moet een getal zijn`);
  for (const field of ['transform', 'opacity', 'backgroundColor', 'color', 'borderColor', 'boxShadow']) {
    if (!nonEmptyString(frame[field])) fail(errors, `${label}.${field} ontbreekt`);
  }
  const rect = frame.rect;
  if (!rect || !['x', 'y', 'width', 'height'].every((field) => Number.isFinite(rect[field]))) fail(errors, `${label}.rect moet x,y,width,height bevatten`);
  else if (rect.width <= 0 || rect.height <= 0) fail(errors, `${label}.rect moet positieve breedte en hoogte hebben`);
  return true;
}

function validateFrames(frames, label, minimum, errors) {
  if (!Array.isArray(frames) || frames.length < minimum) { fail(errors, `${label} moet minstens ${minimum} opeenvolgende frames bevatten`); return; }
  let previous = null;
  for (const [i, frame] of frames.entries()) {
    frameShape(frame, `${label}[${i}]`, errors);
    if (Number.isFinite(frame?.t) && previous !== null && frame.t <= previous) fail(errors, `${label}[${i}].t moet strikt oplopen`);
    if (Number.isFinite(frame?.t)) previous = frame.t;
  }
}

function framesIdentical(frames) {
  if (!Array.isArray(frames) || frames.length < 4 || frames.some((frame) => !frame || !frame.rect)) return false;
  const fields = ['transform', 'opacity', 'backgroundColor', 'color', 'borderColor', 'boxShadow'];
  const first = frames[0];
  return frames.every((frame) => fields.every((field) => frame[field] === first[field]) && ['x', 'y', 'width', 'height'].every((field) => frame.rect?.[field] === first.rect?.[field]));
}

async function validateOpdrachtReview(manifest, manifestDir, errors, screenshotIndex, options) {
  if (!/playwright/i.test(manifest.browser ?? '')) fail(errors, 'opdracht-review.browser moet Playwright bevatten');
  const expectation = manifest.expectation;
  if (!expectation || typeof expectation !== 'object' || Array.isArray(expectation)) fail(errors, 'expectation ontbreekt');
  else {
    for (const field of ['title', 'openingLine', 'expectedVerb']) if (!nonEmptyString(expectation[field])) fail(errors, `expectation.${field} ontbreekt`);
    if (!validRecordedAt(expectation.recordedAt)) fail(errors, 'expectation.recordedAt moet geldig zijn');
  }
  if (!Array.isArray(manifest.actionLog)) fail(errors, 'actionLog moet een array zijn');
  else {
    if (manifest.actionLog.length < 8) fail(errors, 'actionLog moet minstens 8 regels bevatten');
    let previous = null;
    const types = new Set();
    for (const [i, entry] of manifest.actionLog.entries()) {
      if (!entry || typeof entry !== 'object') { fail(errors, `actionLog[${i}] moet een object zijn`); continue; }
      if (!Number.isFinite(entry.t)) fail(errors, `actionLog[${i}].t moet een getal zijn`);
      if (Number.isFinite(entry.t) && previous !== null && entry.t <= previous) fail(errors, `actionLog[${i}].t moet strikt oplopen`);
      if (Number.isFinite(entry.t)) { previous = entry.t; if (entry.type) types.add(entry.type); }
      if (!nonEmptyString(entry.action)) fail(errors, `actionLog[${i}].action ontbreekt`);
      requireScreenshot(screenshotIndex, entry.screenshot, `actionLog[${i}].screenshot`, errors);
    }
    if (types.size < 3 && !(Array.isArray(manifest.limitations) && manifest.limitations.some((item) => /type|actie|log/i.test(String(item))))) fail(errors, 'actionLog moet minstens drie verschillende actietypen hebben of een reden in limitations');
    const first = manifest.actionLog.find((entry) => Number.isFinite(entry?.t))?.t;
    const recorded = recordedAtMillis(expectation?.recordedAt);
    if (Number.isFinite(first) && Number.isFinite(recorded) && first < recorded) fail(errors, 'de eerste actie mag niet vóór expectation.recordedAt liggen');
  }
  if (!Array.isArray(manifest.animationEvidence) || manifest.animationEvidence.length === 0) fail(errors, 'animationEvidence moet minstens één meting bevatten');
  else for (const [i, entry] of manifest.animationEvidence.entries()) {
    if (!nonEmptyString(entry?.element)) fail(errors, `animationEvidence[${i}].element ontbreekt`);
    if (!nonEmptyString(entry?.action)) fail(errors, `animationEvidence[${i}].action ontbreekt`);
    requireScreenshot(screenshotIndex, entry?.screenshot, `animationEvidence[${i}].screenshot`, errors);
    validateFrames(entry?.framesBefore, `animationEvidence[${i}].framesBefore`, 1, errors);
    validateFrames(entry?.framesAfter, `animationEvidence[${i}].framesAfter`, 3, errors);
    if (!Number.isFinite(entry?.actionTime)) fail(errors, `animationEvidence[${i}].actionTime ontbreekt`);
    const before = entry?.framesBefore || []; const after = entry?.framesAfter || [];
    if (before.length && after.length && Number.isFinite(before.at(-1)?.t) && Number.isFinite(after[0]?.t) && after[0].t <= before.at(-1).t) fail(errors, `animationEvidence[${i}] frametijden moeten samen strikt oplopen`);
    if (Number.isFinite(entry?.actionTime) && before.some((frame) => Number.isFinite(frame?.t) && frame.t >= entry.actionTime)) fail(errors, `animationEvidence[${i}] framesBefore moeten vóór de actietijd liggen`);
    if (Number.isFinite(entry?.actionTime) && after.some((frame) => Number.isFinite(frame?.t) && frame.t <= entry.actionTime)) fail(errors, `animationEvidence[${i}] framesAfter moeten na de actietijd liggen`);
    if (framesIdentical([...before, ...after]) && manifest.gates?.poort1 === 'GESLAAGD') fail(errors, `animationEvidence[${i}] heeft identieke before/after-beelden maar Poort 1 claimt GESLAAGD`);
    if (entry?.reducedMotionChecked !== true) fail(errors, `animationEvidence[${i}].reducedMotionChecked moet true zijn`);
  }
  if (!manifest.reducedMotion || manifest.reducedMotion.classPresent !== true) fail(errors, 'reducedMotion.classPresent moet true zijn');
  else requireScreenshot(screenshotIndex, manifest.reducedMotion.screenshot, 'reducedMotion.screenshot', errors);
  if (!Array.isArray(manifest.introSteps) || manifest.introSteps.length < 3) fail(errors, 'introSteps moet minstens 3 stappen bevatten');
  else for (const [i, step] of manifest.introSteps.entries()) {
    if (!nonEmptyString(step?.text) || step.text.trim().length < 40) fail(errors, `introSteps[${i}].text moet minstens 40 tekens bevatten`);
    requireScreenshot(screenshotIndex, step?.screenshot, `introSteps[${i}].screenshot`, errors);
  }
  if (!manifest.introSummary || !['maak', 'voorWie', 'goed'].every((field) => nonEmptyString(manifest.introSummary[field]))) fail(errors, 'introSummary moet maak, voorWie en goed bevatten');
  const veto2 = manifest.veto2;
  if (!veto2 || !Number.isFinite(veto2.readClickMinutes) || !Number.isFinite(veto2.totalMinutes) || veto2.totalMinutes <= 0 || veto2.readClickMinutes < 0 || veto2.readClickMinutes > veto2.totalMinutes || !Number.isFinite(veto2.percentage)) fail(errors, 'veto2 moet geldige minuten en percentage bevatten');
  else if (Math.abs(veto2.percentage - veto2.readClickMinutes / veto2.totalMinutes) > 1e-9) fail(errors, 'veto2.percentage moet readClickMinutes/totalMinutes zijn');
  const requiresComparedWith = options.requireComparedWith !== false;
  if (manifest.comparedWith === undefined && requiresComparedWith) fail(errors, 'comparedWith ontbreekt');
  if (manifest.comparedWith !== undefined) {
    if (manifest.comparedWith === null) { if (manifest.comparedWithReason !== 'eigen motor') fail(errors, 'comparedWithReason moet exact eigen motor zijn bij null'); }
    else if (!manifest.comparedWith || typeof manifest.comparedWith !== 'object') fail(errors, 'comparedWith moet een object of null zijn');
    else {
      const reference = manifest.comparedWith;
      if (!nonEmptyString(reference.missionId) || !nonEmptyString(reference.manifestPath)) fail(errors, 'comparedWith moet missionId en manifestPath bevatten');
      else if (path.isAbsolute(reference.manifestPath)) fail(errors, 'comparedWith.manifestPath moet relatief zijn');
      else {
        const resolved = path.resolve(manifestDir, reference.manifestPath);
        let other;
        try { other = JSON.parse(await readFile(resolved, 'utf8')); }
        catch { fail(errors, `vergeleken manifest ontbreekt of is ongeldig: ${reference.manifestPath}`); }
        if (other) {
          if (other.missionId !== reference.missionId) fail(errors, 'comparedWith.missionId verschilt van het tweede manifest');
          if (other.missionId === manifest.missionId) fail(errors, 'comparedWith moet een andere missionId hebben');
          const nested = await validateManifestInternal(resolved, { requireComparedWith: false, visited: options.visited });
          for (const nestedError of nested.errors) fail(errors, `vergeleken manifest: ${nestedError}`);
        }
      }
    }
  }
  validateGates(manifest, errors);
}

async function validatePreview(manifest, manifestDir, errors, screenshotIndex) {
  if (manifest.productionMutations !== 0) fail(errors, 'preview productionMutations moet 0 zijn');
  if (manifest.xpMutations !== 0) fail(errors, 'preview xpMutations moet 0 zijn');
  if (!Array.isArray(manifest.viewports)) { fail(errors, 'preview viewports ontbreekt'); return; }
  const byName = new Map();
  for (const viewport of manifest.viewports) {
    const name = viewport?.name;
    if (byName.has(name)) fail(errors, `viewport komt dubbel voor: ${name}`);
    else byName.set(name, viewport);
  }
  for (const name of byName.keys()) if (!REQUIRED_VIEWPORTS.has(name)) fail(errors, `onbekende viewport: ${name}`);
  const full = VETO_NAMES.every((name) => manifest.gates?.[name] === 'GESLAAGD');
  const names = full ? [...REQUIRED_VIEWPORTS.keys()] : ['desktop', 'mobile'];
  for (const name of names) {
    const viewport = byName.get(name); const expectedSize = REQUIRED_VIEWPORTS.get(name);
    if (!viewport) { fail(errors, `viewport ontbreekt: ${name}`); continue; }
    if (!viewportMatches(name, viewportString(viewport.cssViewport))) fail(errors, `${name}: verwacht CSS-viewport ${expectedSize}`);
    const checkpoints = full ? REQUIRED_CHECKPOINTS : ['start', 'end'];
    for (const checkpoint of checkpoints) if (viewport.checkpoints?.[checkpoint] !== true) fail(errors, `${name}: checkpoint ${checkpoint} is niet bewezen`);
    const minimum = full ? 4 : 2;
    if (!Array.isArray(viewport.evidence) || viewport.evidence.length < minimum) { fail(errors, `${name}: minimaal ${minimum} evidence-PNG's vereist`); continue; }
    const uniquePaths = new Set(viewport.evidence.map((entry) => entry?.path));
    if (uniquePaths.size !== viewport.evidence.length) fail(errors, `${name}: ieder evidencebestand moet uniek zijn`);
    for (const [i, entry] of viewport.evidence.entries()) requireScreenshot(screenshotIndex, entry?.screenshot, `${name}.evidence[${i}].screenshot`, errors);
  }
}

async function validateProduction(manifest, manifestDir, errors) {
  if (!nonEmptyString(manifest.deploymentId)) fail(errors, 'productie deploymentId ontbreekt');
  if (!SHA_PATTERN.test(manifest.deploymentCommit ?? '')) fail(errors, 'productie deploymentCommit moet volledig zijn');
  else if (manifest.deploymentCommit.toLowerCase() !== manifest.testedCommit?.toLowerCase()) fail(errors, 'productie deploymentCommit verschilt van testedCommit');
  if (!viewportString(manifest.cssViewport)) fail(errors, 'productie CSS-viewport ontbreekt');
  for (const checkpoint of REQUIRED_CHECKPOINTS) if (manifest.checkpoints?.[checkpoint] !== true) fail(errors, `productie checkpoint ${checkpoint} is niet bewezen`);
  if (manifest.productionCompletionClicks !== 1) fail(errors, 'productie vereist exact één completionklik');
  if (!manifest.before || !manifest.after) fail(errors, 'productie before/after ontbreekt');
  if (manifest.before?.missionCompleted !== false || manifest.after?.missionCompleted !== true) fail(errors, 'productie missionCompleted moet false → true zijn');
  if (manifest.after?.persistedAfterFullReload !== true) fail(errors, 'productiecompletion is niet na volledige reload bewezen');
  if (manifest.flow?.intentionalWrongAnswer !== true || manifest.flow?.sameQuestionRecoverySucceeded !== true) fail(errors, 'productie foutantwoord en recovery zijn niet bewezen');
  if (manifest.flow?.promisedXp !== manifest.flow?.awardedXp) fail(errors, 'beloofde en toegekende XP verschillen');
  if (manifest.after?.xp - manifest.before?.xp !== manifest.flow?.awardedXp) fail(errors, 'XP-verschil komt niet overeen');
  if (manifest.after?.missionCount - manifest.before?.missionCount !== 1) fail(errors, 'missionCount moet exact met één toenemen');
  if (manifest.after?.xpTransactionCount !== 1) fail(errors, 'productie vereist exact één XP-transactie');
  if (!Array.isArray(manifest.evidence) || manifest.evidence.length < 4) { fail(errors, 'productie vereist minimaal vier evidence-PNG\'s'); return; }
  for (const [i, entry] of manifest.evidence.entries()) await validateEvidenceFile(entry, manifestDir, errors, `evidence[${i}]`);
}

async function validateManifestInternal(manifestPath, options = {}) {
  const absolute = path.resolve(manifestPath);
  const visited = options.visited || new Set();
  if (visited.has(absolute)) return { manifest: null, errors: [] };
  visited.add(absolute);
  const errors = [];
  let manifest;
  try { manifest = JSON.parse(await readFile(absolute, 'utf8')); }
  catch (error) { return { manifest: null, errors: [`manifest kan niet worden gelezen: ${error instanceof Error ? error.message : String(error)}`] }; }
  const dir = path.dirname(absolute);
  validateCommon(manifest, errors);
  const screenshotIndex = await buildScreenshotIndex(manifest, dir, errors);
  if (manifest.mode !== 'opdracht-review') fail(errors, 'mode moet verplicht opdracht-review zijn');
  else await validateOpdrachtReview(manifest, dir, errors, screenshotIndex, { ...options, visited });
  if (manifest.environment === 'preview') await validatePreview(manifest, dir, errors, screenshotIndex);
  else if (manifest.environment === 'production') await validateProduction(manifest, dir, errors);
  else fail(errors, 'environment moet preview of production zijn');
  return { manifest, errors };
}

export async function validateManifest(manifestPath) { return validateManifestInternal(manifestPath); }

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) { console.error('Gebruik: validate-evidence.mjs <manifest.json>'); process.exitCode = 2; return; }
  try {
    const { manifest, errors } = await validateManifest(manifestPath);
    if (errors.length > 0) { console.error(`Evidence FAIL (${errors.length}):`); for (const error of errors) console.error(`- ${error}`); process.exitCode = 1; return; }
    console.log(`Evidence PASS: ${manifest.missionId} (${manifest.environment}, ${manifest.testedCommit.slice(0, 7)})`);
  } catch (error) {
    console.error(`Evidence FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
