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
