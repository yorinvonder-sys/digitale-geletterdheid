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
 * Herkenningsregel — een backtick-span telt als pad wanneer die geen commando is
 * (npm, npx, node, git, ...), geen glob- of placeholderteken bevat (* < > { } | $),
 * en vervolgens:
 *   - een `/` bevat, of
 *   - eindigt op een broncode-extensie én in een mapgebonden document staat.
 * Die tweede regel bestaat voor de feature-README's: daar is `Login.tsx` de normale
 * schrijfwijze voor een buurbestand, geen proza. In de repo-brede documenten telt een
 * losse bestandsnaam wél als prozashorthand — `App.tsx` in een zin over de
 * entrypointketen is geen navigatiedoel.
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

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Repo-brede documenten die agents gebruiken om te navigeren. */
const ROOT_DOCS = [
  'ARCHITECTURE.md',
  'AGENTS.md',
  'CLAUDE.md',
  '.claude/skill-router.md',
  '.claude/model-selection.md',
  'docs/README.md',
  'docs/architecture/agent-context-strategy.md',
];

/**
 * Per-feature ingangen. De intake schrijft voor dat je na de router de README van
 * de betreffende feature leest, dus die zijn navigatiedocumenten met hetzelfde
 * vervalrisico. Dynamisch verzameld zodat een nieuwe feature vanzelf meedoet.
 */
function featureDocs() {
  const featuresDir = resolve(repoRoot, 'src/features');
  if (!existsSync(featuresDir)) return [];
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      ['README.md', 'CLAUDE.md']
        .map((name) => `src/features/${entry.name}/${name}`)
        .filter((relative) => existsSync(resolve(repoRoot, relative))),
    );
}

const DOCS = [...ROOT_DOCS, ...featureDocs()];

/** Extensies die een losse bestandsnaam in een mapgebonden document als pad markeren. */
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.md', '.json', '.css'];

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

function looksLikePath(span, { folderScoped }) {
  if (!span || span.length > 120) return false;
  if (PLACEHOLDER_CHARS.test(span)) return false;
  if (COMMAND_PREFIXES.some((prefix) => span.startsWith(prefix))) return false;
  if (span.startsWith('http://') || span.startsWith('https://')) return false;
  // Een span met spaties is een zin of commando, geen pad.
  if (/\s/.test(span)) return false;
  if (span.includes('/')) return true;
  // In een mapgebonden document (feature-README, feature-CLAUDE.md) verwijst een losse
  // bestandsnaam naar een buurbestand en is dus wél navigeerbaar.
  return folderScoped && FILE_EXTENSIONS.some((ext) => span.endsWith(ext));
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

function collectCandidates(content, options) {
  const found = new Map(); // pad -> eerste regelnummer
  content.split('\n').forEach((line, index) => {
    const spans = line.match(/`([^`]+)`/g) ?? [];
    for (const raw of spans) {
      const span = raw.slice(1, -1).trim().replace(/[.,;:]$/, '');
      if (!looksLikePath(span, options)) continue;
      if (IGNORED_PATHS.has(span)) continue;
      if (!found.has(span)) found.set(span, index + 1);
    }
  });
  return found;
}

const collected = []; // { doc, line, path, target, docDir }
let checkedDocs = 0;

for (const doc of DOCS) {
  const absolute = resolve(repoRoot, doc);
  if (!existsSync(absolute)) {
    collected.push({ doc: '(DOCS-lijst)', line: 0, path: doc, target: doc, missingDoc: true });
    continue;
  }
  checkedDocs += 1;
  const docDir = dirname(doc);
  const folderScoped = docDir !== '.' && docDir.startsWith('src/features/');
  const candidates = collectCandidates(readFileSync(absolute, 'utf8'), { folderScoped });
  for (const [candidate, line] of candidates) {
    collected.push({ doc, line, path: candidate, target: candidate.replace(/\/$/, ''), docDir });
  }
}

/**
 * Een pad in een document mag repo-relatief zijn of relatief aan het document zelf.
 * Een feature-README die naar `avatar/AvatarViewer.tsx` verwijst bedoelt zijn eigen
 * buurmap, niet een map in de repo-root — beide vormen zijn legitiem en navigeerbaar.
 */
function pathResolves(entry) {
  if (existsSync(resolve(repoRoot, entry.target))) return true;
  if (entry.docDir && entry.docDir !== '.') {
    return existsSync(resolve(repoRoot, entry.docDir, entry.target));
  }
  return false;
}

const gitIgnored = selectGitIgnored([...new Set(collected.map((entry) => entry.target))]);
const rgPrefixes = readRgIgnorePrefixes();
const isNoise = (target) =>
  gitIgnored.has(target) ||
  rgPrefixes.some((prefix) => target === prefix || target.startsWith(`${prefix}/`));

const considered = collected.filter((entry) => !isNoise(entry.target));
const dead = considered.filter((entry) => entry.missingDoc || !pathResolves(entry));

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
