#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_VIEWPORTS = new Map([
  ['desktop', '1440x900'],
  ['ipad-portrait', '820x1180'],
  ['ipad-landscape', '1180x820'],
  ['mobile', '390x844'],
]);

const REQUIRED_CHECKPOINTS = ['start', 'flow', 'feedback', 'recovery', 'end'];
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const HASH_PATTERN = /^[a-f0-9]{64}$/i;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(errors, message) {
  errors.push(message);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validRecordedAt(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (!nonEmptyString(value)) return false;
  return Number.isFinite(Date.parse(value));
}

function recordedAtMillis(value) {
  if (typeof value === 'number') return value;
  return Date.parse(value);
}

function validateAnimationFrames(frames, label, minimum, errors) {
  if (!Array.isArray(frames) || frames.length < minimum) {
    fail(errors, `${label} moet minstens ${minimum} opeenvolgende frames bevatten`);
    return;
  }
  let previousTime = null;
  for (const [index, frame] of frames.entries()) {
    if (!frame || typeof frame !== 'object' || Array.isArray(frame)) {
      fail(errors, `${label}[${index}] moet een frame-object zijn`);
      continue;
    }
    if (!Number.isFinite(frame.t)) fail(errors, `${label}[${index}].t moet een getal zijn`);
    if (previousTime !== null && Number.isFinite(frame.t) && frame.t <= previousTime) {
      fail(errors, `${label}[${index}].t moet strikt oplopen`);
    }
    if (Number.isFinite(frame.t)) previousTime = frame.t;
    if (!nonEmptyString(frame.transform)) fail(errors, `${label}[${index}].transform ontbreekt`);
    if (!nonEmptyString(frame.opacity)) fail(errors, `${label}[${index}].opacity ontbreekt`);
  }
}

function viewportString(value) {
  if (typeof value === 'string') return value.toLowerCase().replace(/\s+/g, '');
  if (value && Number.isInteger(value.width) && Number.isInteger(value.height)) {
    return `${value.width}x${value.height}`;
  }
  return '';
}

function parsePngDimensions(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  if (bytes.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

async function validateEvidenceFile(entry, manifestDir, errors, label) {
  if (!entry || typeof entry.path !== 'string' || entry.path.length === 0) {
    fail(errors, `${label}: relatief evidencepad ontbreekt`);
    return;
  }
  if (path.isAbsolute(entry.path)) {
    fail(errors, `${label}: evidencepad moet relatief zijn`);
    return;
  }

  const resolved = path.resolve(manifestDir, entry.path);
  const relative = path.relative(manifestDir, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(errors, `${label}: evidencepad verlaat de manifestmap`);
    return;
  }

  let bytes;
  try {
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error('geen bestand');
    bytes = await readFile(resolved);
  } catch (error) {
    fail(errors, `${label}: bestand ontbreekt (${entry.path})`);
    return;
  }

  const dimensions = parsePngDimensions(bytes);
  if (!dimensions) {
    fail(errors, `${label}: bestand is geen geldige PNG (${entry.path})`);
    return;
  }

  if (!HASH_PATTERN.test(entry.sha256 ?? '')) {
    fail(errors, `${label}: geldige SHA-256 ontbreekt`);
  } else {
    const actualHash = createHash('sha256').update(bytes).digest('hex');
    if (actualHash !== entry.sha256.toLowerCase()) {
      fail(errors, `${label}: SHA-256 komt niet overeen`);
    }
  }

  if (entry.width !== dimensions.width || entry.height !== dimensions.height) {
    fail(
      errors,
      `${label}: afmetingen ${dimensions.width}x${dimensions.height} verschillen van manifest ${entry.width}x${entry.height}`,
    );
  }
}

function validateCommon(manifest, errors) {
  if (manifest.schemaVersion !== 1) fail(errors, 'schemaVersion moet 1 zijn');
  if (typeof manifest.missionId !== 'string' || manifest.missionId.length === 0) {
    fail(errors, 'missionId ontbreekt');
  }
  if (!SHA_PATTERN.test(manifest.testedCommit ?? '')) {
    fail(errors, 'testedCommit moet een volledige commit-SHA zijn');
  }
  if (typeof manifest.route !== 'string' || !manifest.route.startsWith('/')) {
    fail(errors, 'route moet een relatief browserpad zijn');
  }
  if (!/(internal (codex|chatgpt) browser|playwright)/i.test(manifest.browser ?? '')) {
    fail(errors, 'browser moet de interne Codex/ChatGPT-browser zijn of Playwright bevatten');
  }
  if (!['PASS', 'FAIL', 'BLOCKED'].includes(manifest.result)) {
    fail(errors, 'result moet PASS, FAIL of BLOCKED zijn');
  }
  if (!Array.isArray(manifest.limitations)) fail(errors, 'limitations moet een array zijn');
}

function validateOpdrachtReview(manifest, errors) {
  if (!/playwright/i.test(manifest.browser ?? '')) {
    fail(errors, 'opdracht-review.browser moet de tekst "playwright" bevatten');
  }

  const expectation = manifest.expectation;
  if (!expectation || typeof expectation !== 'object' || Array.isArray(expectation)) {
    fail(errors, 'opdracht-review.expectation ontbreekt');
  } else {
    if (!nonEmptyString(expectation.title)) fail(errors, 'expectation.title ontbreekt');
    if (!nonEmptyString(expectation.openingLine)) fail(errors, 'expectation.openingLine ontbreekt');
    if (!nonEmptyString(expectation.expectedVerb)) fail(errors, 'expectation.expectedVerb ontbreekt');
    if (!validRecordedAt(expectation.recordedAt)) {
      fail(errors, 'expectation.recordedAt moet een geldige datum of tijdstempel zijn');
    }
  }

  if (!Array.isArray(manifest.actionLog)) {
    fail(errors, 'actionLog moet een array zijn');
  } else {
    if (manifest.actionLog.length < 8) fail(errors, 'actionLog moet minstens 8 regels bevatten');
    let previousTime = null;
    for (const [index, entry] of manifest.actionLog.entries()) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        fail(errors, `actionLog[${index}] moet een object zijn`);
        continue;
      }
      if (!Number.isFinite(entry.t)) fail(errors, `actionLog[${index}].t moet een getal zijn`);
      if (previousTime !== null && Number.isFinite(entry.t) && entry.t <= previousTime) {
        fail(errors, `actionLog[${index}].t moet strikt oplopen`);
      }
      if (Number.isFinite(entry.t)) previousTime = entry.t;
      if (!nonEmptyString(entry.action)) fail(errors, `actionLog[${index}].action ontbreekt`);
      if (!Number.isInteger(entry.screenshot) || entry.screenshot < 1) {
        fail(errors, `actionLog[${index}].screenshot moet een positief screenshotnummer zijn`);
      }
    }
  }
  if (expectation && Array.isArray(manifest.actionLog) && manifest.actionLog.length > 0) {
    const firstActionTime = manifest.actionLog.find((entry) => Number.isFinite(entry?.t))?.t;
    const recordedTime = recordedAtMillis(expectation.recordedAt);
    if (Number.isFinite(firstActionTime) && Number.isFinite(recordedTime) && recordedTime > firstActionTime) {
      fail(errors, 'expectation.recordedAt moet vóór de eerste actie liggen');
    }
  }

  if (!Array.isArray(manifest.animationEvidence)) {
    fail(errors, 'animationEvidence moet een array zijn');
  } else if (manifest.animationEvidence.length === 0) {
    fail(errors, 'animationEvidence moet minstens één actiegebonden meting bevatten');
  } else {
    for (const [index, entry] of manifest.animationEvidence.entries()) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        fail(errors, `animationEvidence[${index}] moet een object zijn`);
        continue;
      }
      if (!nonEmptyString(entry.element)) fail(errors, `animationEvidence[${index}].element ontbreekt`);
      if (!nonEmptyString(entry.action)) fail(errors, `animationEvidence[${index}].action ontbreekt`);
      validateAnimationFrames(entry.framesBefore, `animationEvidence[${index}].framesBefore`, 1, errors);
      validateAnimationFrames(entry.framesAfter, `animationEvidence[${index}].framesAfter`, 3, errors);
      if (typeof entry.reducedMotionChecked !== 'boolean') {
        fail(errors, `animationEvidence[${index}].reducedMotionChecked moet boolean zijn`);
      } else if (entry.reducedMotionChecked !== true) {
        fail(errors, `animationEvidence[${index}].reducedMotionChecked moet true zijn na de aparte test`);
      }
    }
  }

  if (typeof manifest.introText !== 'string') {
    fail(errors, 'introText moet een tekst zijn');
  } else {
    const introLines = manifest.introText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (introLines.length < 3) fail(errors, 'introText moet minstens 3 niet-lege regels bevatten, één per intro-stap');
  }

  if (manifest.comparedWith !== null && !nonEmptyString(manifest.comparedWith)) {
    fail(errors, 'comparedWith moet een missionId of null zijn');
  }
  if (manifest.comparedWith === null && !nonEmptyString(manifest.comparedWithReason)) {
    fail(errors, 'comparedWithReason is verplicht wanneer comparedWith null is');
  }
  if (nonEmptyString(manifest.comparedWith) && manifest.comparedWith === manifest.missionId) {
    fail(errors, 'comparedWith moet een tweede, andere missionId zijn');
  }
}

async function validatePreview(manifest, manifestDir, errors) {
  if (manifest.productionMutations !== 0) fail(errors, 'preview productionMutations moet 0 zijn');
  if (manifest.xpMutations !== 0) fail(errors, 'preview xpMutations moet 0 zijn');
  if (!Array.isArray(manifest.viewports)) {
    fail(errors, 'preview viewports ontbreekt');
    return;
  }

  const byName = new Map(manifest.viewports.map((viewport) => [viewport.name, viewport]));
  for (const [name, expectedSize] of REQUIRED_VIEWPORTS) {
    const viewport = byName.get(name);
    if (!viewport) {
      fail(errors, `viewport ontbreekt: ${name}`);
      continue;
    }
    if (viewportString(viewport.cssViewport) !== expectedSize) {
      fail(errors, `${name}: verwacht CSS-viewport ${expectedSize}`);
    }
    for (const checkpoint of REQUIRED_CHECKPOINTS) {
      if (viewport.checkpoints?.[checkpoint] !== true) {
        fail(errors, `${name}: checkpoint ${checkpoint} is niet bewezen`);
      }
    }
    if (!Array.isArray(viewport.evidence) || viewport.evidence.length < 4) {
      fail(errors, `${name}: minimaal vier evidence-PNG's vereist`);
      continue;
    }
    const uniquePaths = new Set(viewport.evidence.map((entry) => entry?.path));
    if (uniquePaths.size !== viewport.evidence.length) {
      fail(errors, `${name}: ieder evidencebestand moet een uniek pad hebben`);
    }
    for (const [index, entry] of viewport.evidence.entries()) {
      await validateEvidenceFile(entry, manifestDir, errors, `${name}.evidence[${index}]`);
    }
  }
}

async function validateProduction(manifest, manifestDir, errors) {
  if (typeof manifest.deploymentId !== 'string' || manifest.deploymentId.length === 0) {
    fail(errors, 'productie deploymentId ontbreekt');
  }
  if (!SHA_PATTERN.test(manifest.deploymentCommit ?? '')) {
    fail(errors, 'productie deploymentCommit moet een volledige commit-SHA zijn');
  } else if (manifest.deploymentCommit.toLowerCase() !== manifest.testedCommit?.toLowerCase()) {
    fail(errors, 'productie deploymentCommit verschilt van testedCommit');
  }
  if (!viewportString(manifest.cssViewport)) {
    fail(errors, 'productie CSS-viewport ontbreekt');
  }
  for (const checkpoint of REQUIRED_CHECKPOINTS) {
    if (manifest.checkpoints?.[checkpoint] !== true) {
      fail(errors, `productie checkpoint ${checkpoint} is niet bewezen`);
    }
  }
  if (manifest.productionCompletionClicks !== 1) {
    fail(errors, 'productie vereist exact één completionklik');
  }
  if (!manifest.before || !manifest.after) fail(errors, 'productie before/after ontbreekt');
  if (!Number.isFinite(manifest.before?.xp) || !Number.isFinite(manifest.after?.xp)) {
    fail(errors, 'productie before/after XP ontbreekt');
  }
  if (!Number.isInteger(manifest.before?.missionCount) || !Number.isInteger(manifest.after?.missionCount)) {
    fail(errors, 'productie before/after missionCount ontbreekt');
  }
  if (manifest.before?.missionCompleted !== false || manifest.after?.missionCompleted !== true) {
    fail(errors, 'productie before/after missionCompleted moet false → true zijn');
  }
  if (manifest.after?.persistedAfterFullReload !== true) {
    fail(errors, 'productiecompletion is niet na volledige reload bewezen');
  }
  if (manifest.flow?.intentionalWrongAnswer !== true || manifest.flow?.sameQuestionRecoverySucceeded !== true) {
    fail(errors, 'productie foutantwoord en recovery zijn niet bewezen');
  }
  if (manifest.flow?.promisedXp !== manifest.flow?.awardedXp) {
    fail(errors, 'beloofde en toegekende XP verschillen');
  }
  if (manifest.after?.xp - manifest.before?.xp !== manifest.flow?.awardedXp) {
    fail(errors, 'XP-verschil komt niet overeen met de toegekende XP');
  }
  if (manifest.after?.missionCount - manifest.before?.missionCount !== 1) {
    fail(errors, 'missionCount moet exact met één toenemen');
  }
  if (manifest.after?.xpTransactionCount !== 1) {
    fail(errors, 'productie vereist exact één XP-transactie voor deze missie');
  }
  if (!Array.isArray(manifest.evidence) || manifest.evidence.length < 4) {
    fail(errors, 'productie vereist minimaal vier evidence-PNG\'s');
    return;
  }
  const uniquePaths = new Set(manifest.evidence.map((entry) => entry?.path));
  if (uniquePaths.size !== manifest.evidence.length) {
    fail(errors, 'productie vereist unieke evidencepaden');
  }
  for (const [index, entry] of manifest.evidence.entries()) {
    await validateEvidenceFile(entry, manifestDir, errors, `evidence[${index}]`);
  }
}

export async function validateManifest(manifestPath) {
  const absoluteManifest = path.resolve(manifestPath);
  const manifestDir = path.dirname(absoluteManifest);
  const manifest = JSON.parse(await readFile(absoluteManifest, 'utf8'));
  const errors = [];

  validateCommon(manifest, errors);
  if (manifest.mode !== 'opdracht-review') {
    fail(errors, 'mode moet verplicht "opdracht-review" zijn');
  } else {
    validateOpdrachtReview(manifest, errors);
  }
  if (manifest.environment === 'preview') {
    await validatePreview(manifest, manifestDir, errors);
  } else if (manifest.environment === 'production') {
    await validateProduction(manifest, manifestDir, errors);
  } else {
    fail(errors, 'environment moet preview of production zijn');
  }

  return { manifest, errors };
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    console.error('Gebruik: validate-evidence.mjs <manifest.json>');
    process.exitCode = 2;
    return;
  }

  try {
    const { manifest, errors } = await validateManifest(manifestPath);
    if (errors.length > 0) {
      console.error(`Evidence FAIL (${errors.length}):`);
      for (const error of errors) console.error(`- ${error}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Evidence PASS: ${manifest.missionId} (${manifest.environment}, ${manifest.testedCommit.slice(0, 7)})`);
  } catch (error) {
    console.error(`Evidence FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
