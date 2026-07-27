#!/usr/bin/env node
/**
 * check-agent-docs — bewaakt dat de navigatiedocumenten naar bestaande paden wijzen.
 *
 * Waarom dit bestaat: de wegwijzers voor AI-agents verouderen stil. Een pad dat na
 * een herstructurering verdwijnt, blijft in de kaart staan en stuurt elke agent die
 * de kaart volgt naar een mislukte read, waarna die alsnog de hele repo doorzoekt.
 * Dat kost precies de tokens die de kaart moest besparen. Bij de invoering van deze
 * check wees 15 van de 17 rijen in .claude/skill-router.md naar niet-bestaande paden.
 *
 * Wat het doet: leest de documenten in DOCS, verzamelt elke backtick-span die op een
 * repo-relatief pad lijkt, en controleert of dat pad op schijf bestaat.
 *
 * Herkenningsregel — een backtick-span telt als pad wanneer die
 *   - een `/` bevat (een losse bestandsnaam is prozashorthand, geen navigeerbaar pad), en
 *   - niet begint met een commando (npm, npx, node, git, ...), en
 *   - geen glob-, placeholder- of wildcardteken bevat (* < > { } | $).
 * Daardoor blijven `npm run doctor`, `duck-*`, `use*` en `src/features/<domain>/`
 * buiten beschouwing zonder dat je ze los hoeft uit te zonderen.
 *
 * Overgeslagen worden paden die gitignored zijn, en paden die in .rgignore staan.
 * Beide categorieën komen voor in de "never broad-read"-lijsten van de kaarten:
 * `dist/`, `node_modules/`, `lighthouse-reports/`, `.playwright-mcp/`. Die horen juist
 * afwezig te kunnen zijn en zeggen niets over de bruikbaarheid van de kaart.
 * Voor de gitignore-check gebruikt dit script dezelfde techniek als
 * scripts/context-budget.mjs.
 *
 * Bewuste uitzonderingen: zet een pad op IGNORED_PATHS hieronder, met reden.
 *
 * Exit 0 = alle paden bestaan. Exit 1 = ten minste één dood pad, met vindplaats.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Documenten die agents gebruiken om de repo te navigeren. */
const DOCS = [
  'ARCHITECTURE.md',
  'AGENTS.md',
  'CLAUDE.md',
  '.claude/skill-router.md',
  '.claude/model-selection.md',
  'docs/README.md',
  'docs/architecture/agent-context-strategy.md',
];

/** Prefixen die een span als commando markeren in plaats van als pad. */
const COMMAND_PREFIXES = ['npm ', 'npx ', 'node ', 'git ', 'rg ', 'supabase ', 'deno ', 'tsc '];

/** Tekens die op een glob, placeholder of wildcard wijzen. */
const PLACEHOLDER_CHARS = /[*<>{}|$]/;

/**
 * Paden die bewust niet bestaan of niet te verifiëren zijn.
 * Voeg alleen toe met een reden — een lege lijst is het doel.
 */
const IGNORED_PATHS = new Set([
  // Voorbeeld: 'docs/toekomstig-plan.md', // nog niet geschreven, gepland in RFC-12
]);

function looksLikePath(span) {
  if (!span || span.length > 120) return false;
  if (PLACEHOLDER_CHARS.test(span)) return false;
  if (COMMAND_PREFIXES.some((prefix) => span.startsWith(prefix))) return false;
  if (span.startsWith('http://') || span.startsWith('https://')) return false;
  // Een span met spaties is een zin of commando, geen pad.
  if (/\s/.test(span)) return false;
  // Een losse bestandsnaam zonder map is prozashorthand ("zie `App.tsx`"), geen
  // navigeerbaar pad. Een kaart hoort volledige paden te geven; die hebben een `/`.
  return span.includes('/');
}

/**
 * Gitignorede paden in bulk bepalen. `git check-ignore --stdin` geeft exit 1 wanneer
 * niets matcht — dat is geen fout, dus de exitcode wordt bewust genegeerd.
 */
function selectGitIgnored(paths) {
  if (paths.length === 0) return new Set();
  const result = spawnSync('git', ['check-ignore', '--stdin'], {
    cwd: repoRoot,
    input: `${paths.join('\n')}\n`,
    encoding: 'utf8',
  });
  if (result.error) return new Set();
  return new Set((result.stdout ?? '').split('\n').filter(Boolean));
}

/**
 * Mapprefixen uit .rgignore. Dat bestand somt de paden op die de repo zelf als
 * AI-ruis markeert; precies de paden die de kaarten in hun "never broad-read"-lijst
 * noemen. Afwezigheid daarvan is correct, geen kaartfout.
 */
function readRgIgnorePrefixes() {
  const file = resolve(repoRoot, '.rgignore');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('*'))
    .map((line) => line.replace(/\/$/, ''));
}

function collectCandidates(content) {
  const found = new Map(); // pad -> eerste regelnummer
  content.split('\n').forEach((line, index) => {
    const spans = line.match(/`([^`]+)`/g) ?? [];
    for (const raw of spans) {
      const span = raw.slice(1, -1).trim().replace(/[.,;:]$/, '');
      if (!looksLikePath(span)) continue;
      if (IGNORED_PATHS.has(span)) continue;
      if (!found.has(span)) found.set(span, index + 1);
    }
  });
  return found;
}

const collected = []; // { doc, line, path, target }
let checkedDocs = 0;

for (const doc of DOCS) {
  const absolute = resolve(repoRoot, doc);
  if (!existsSync(absolute)) {
    collected.push({ doc: '(DOCS-lijst)', line: 0, path: doc, target: doc, missingDoc: true });
    continue;
  }
  checkedDocs += 1;
  const candidates = collectCandidates(readFileSync(absolute, 'utf8'));
  for (const [candidate, line] of candidates) {
    collected.push({ doc, line, path: candidate, target: candidate.replace(/\/$/, '') });
  }
}

const gitIgnored = selectGitIgnored([...new Set(collected.map((entry) => entry.target))]);
const rgPrefixes = readRgIgnorePrefixes();
const isNoise = (target) =>
  gitIgnored.has(target) ||
  rgPrefixes.some((prefix) => target === prefix || target.startsWith(`${prefix}/`));

const considered = collected.filter((entry) => !isNoise(entry.target));
const dead = considered.filter(
  (entry) => entry.missingDoc || !existsSync(resolve(repoRoot, entry.target)),
);

if (dead.length === 0) {
  const skipped = collected.length - considered.length;
  const suffix = skipped > 0 ? ` (${skipped} gitignored overgeslagen)` : '';
  console.log(
    `✅ check-agent-docs: ${considered.length} paden in ${checkedDocs} navigatiedocumenten, allemaal aanwezig${suffix}.`,
  );
  process.exit(0);
}

console.error(`❌ check-agent-docs: ${dead.length} dood pad/paden in de navigatiedocumenten.\n`);
for (const entry of dead) {
  const where = entry.line ? `${entry.doc}:${entry.line}` : entry.doc;
  const note = entry.note ? ` — ${entry.note}` : '';
  console.error(`   ${where}\n      ${entry.path}${note}`);
}
console.error(
  '\nEen dood pad stuurt elke agent die deze kaart volgt naar een mislukte read.\n' +
    'Corrigeer het pad, of zet het met reden op IGNORED_PATHS in dit script.',
);
process.exit(1);
