#!/usr/bin/env node
/**
 * Sync the school compliance guide from its single canonical source to the
 * published copy and the internal dev-docs mirror, so the three never drift.
 *
 * Canonical source : business/nl-vo/compliance/school-compliance-guide.html
 * Published copy    : public/compliance/school-compliance-guide.html   (served at /compliance/..., linked from ComplianceHub + ICT/privacy)
 * Dev-docs mirror   : public/dev-docs/school-compliance-guide.html      (internal docs bundle, .vercelignore'd, not deployed)
 *
 * Run from the project root:
 *   node scripts/sync-compliance-guide.mjs           # write: copy the source verbatim into the two copies
 *   node scripts/sync-compliance-guide.mjs --check    # verify only: exit 1 if any copy has drifted
 *
 * The published copy is school-facing legal/privacy content. Only change the
 * WORDING of claims in the canonical source, following
 * docs/compliance/legal-claim-source-of-truth.md, then run this script to
 * propagate. This script never edits wording; it copies the source byte-for-byte.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SOURCE = 'business/nl-vo/compliance/school-compliance-guide.html';
const TARGETS = [
  'public/compliance/school-compliance-guide.html',
  'public/dev-docs/school-compliance-guide.html',
];

const checkOnly = process.argv.includes('--check');

let sourceContent;
try {
  sourceContent = readFileSync(resolve(root, SOURCE), 'utf8');
} catch {
  console.error(`[sync-compliance-guide] Canonieke bron ontbreekt: ${SOURCE}`);
  process.exit(2);
}

let drift = 0;
let written = 0;

for (const target of TARGETS) {
  let targetContent = null;
  try {
    targetContent = readFileSync(resolve(root, target), 'utf8');
  } catch {
    targetContent = null;
  }

  if (targetContent === sourceContent) {
    console.log(`[in-sync] ${target}`);
    continue;
  }

  if (checkOnly) {
    drift += 1;
    console.error(
      targetContent === null
        ? `[DRIFT] ${target} ontbreekt`
        : `[DRIFT] ${target} wijkt af van ${SOURCE}`,
    );
    continue;
  }

  writeFileSync(resolve(root, target), sourceContent);
  written += 1;
  console.log(`[synced] ${target} <- ${SOURCE}`);
}

if (checkOnly) {
  if (drift > 0) {
    console.error(
      `\n[sync-compliance-guide] ${drift} kopie(en) wijken af van de canonieke bron.\n` +
        'Los op met: npm run sync:compliance-guide',
    );
    process.exit(1);
  }
  console.log('[sync-compliance-guide] Alle kopieen zijn identiek aan de bron.');
  process.exit(0);
}

console.log(
  `\n[sync-compliance-guide] Klaar. ${written} kopie(en) bijgewerkt, ${TARGETS.length - written} al in sync.`,
);
