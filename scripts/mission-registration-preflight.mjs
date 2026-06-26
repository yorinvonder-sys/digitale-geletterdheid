import fs from 'node:fs';
import path from 'node:path';

// ── Helpers ────────────────────────────────────────────────────────────────

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const read = (relPath) => fs.readFileSync(path.join(ROOT, relPath), 'utf8');

/** Collect all single-quoted string tokens from text. */
const singleQuoted = (text) => {
  const ids = new Set();
  for (const m of text.matchAll(/'([^']+)'/g)) ids.add(m[1]);
  return ids;
};

// ── Source parsers ─────────────────────────────────────────────────────────

/** Source 1: RoleId union in src/types.ts → Set of string literals. */
function parseUnionIds() {
  const text = read('src/types.ts');
  const start = text.indexOf('export type RoleId =');
  if (start === -1) throw new Error('Could not find "export type RoleId =" in src/types.ts');
  const end = text.indexOf(';', start);
  const block = text.slice(start, end);
  // Strip line comments then collect single-quoted tokens
  const stripped = block.replace(/\/\/[^\n]*/g, '');
  return singleQuoted(stripped);
}

/** Source 2: AGENT_ROLE_IDS array in src/config/agentRoleIds.ts → Set. */
function parseArrayIds() {
  const text = read('src/config/agentRoleIds.ts');
  const start = text.indexOf('export const AGENT_ROLE_IDS = [');
  if (start === -1) throw new Error('Could not find AGENT_ROLE_IDS in src/config/agentRoleIds.ts');
  const end = text.indexOf('] as const;', start);
  const block = text.slice(start, end);
  return singleQuoted(block);
}

/** Source 3: TEMPLATE_MISSIONS in src/config/templateRegistry.ts → Map<id, templateType>. */
function parseTemplateMissions() {
  const text = read('src/config/templateRegistry.ts');
  const result = new Map(); // id → templateType
  // Each entry: 'some-id': { missionId: 'some-id', templateType: 'xxx' ... }
  for (const m of text.matchAll(/'([^']+)':\s*\{[^}]*templateType:\s*'([^']+)'/g)) {
    result.set(m[1], m[2]);
  }
  return result;
}

/** Source 4 definition: one template engine entry. */
const TEMPLATE_ENGINES = {
  'scenario-engine': {
    file: 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx',
    varName: 'VALID_SCENARIO_ENGINE_IDS',
    dir: 'scenario-engine',
  },
  'builder-canvas': {
    file: 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx',
    varName: 'VALID_BUILDER_CANVAS_IDS',
    dir: 'builder-canvas',
  },
  'debate-arena': {
    file: 'src/features/missions/templates/debate-arena/DebateArena.tsx',
    varName: 'VALID_DEBATE_ARENA_IDS',
    dir: 'debate-arena',
  },
  'review-arena': {
    file: 'src/features/missions/templates/review-arena/ReviewArena.tsx',
    varName: 'VALID_REVIEW_ARENA_IDS',
    dir: 'review-arena',
  },
  'data-viewer': {
    file: 'src/features/missions/templates/data-viewer/DataViewer.tsx',
    varName: 'VALID_DATA_VIEWER_IDS',
    dir: 'data-viewer',
  },
  'simulation-lab': {
    file: 'src/features/missions/templates/simulation-lab/SimulationLab.tsx',
    varName: 'VALID_SIMULATION_LAB_IDS',
    dir: 'simulation-lab',
  },
  'tool-guide': {
    file: 'src/features/missions/templates/tool-guide/ToolGuide.tsx',
    varName: 'VALID_TOOL_GUIDE_IDS',
    dir: 'tool-guide',
  },
  'puzzle-lab': {
    file: 'src/features/missions/templates/puzzle-lab/puzzleLabRegistry.ts',
    varName: 'PUZZLE_LAB_CONFIGS',
    dir: 'puzzle-lab',
  },
};

/**
 * Source 4: parse each engine's allowlist.
 * Returns Map<templateType, { dir, validIds: Set }>
 * Puzzle-lab uses an object (parse keys 'id':), all others use new Set([...]).
 */
function parseEngineAllowlists() {
  const result = new Map();
  for (const [templateType, eng] of Object.entries(TEMPLATE_ENGINES)) {
    const text = read(eng.file);
    let ids;
    if (templateType === 'puzzle-lab') {
      // PUZZLE_LAB_CONFIGS is an object — parse keys 'id':
      const start = text.indexOf('export const PUZZLE_LAB_CONFIGS');
      if (start === -1) throw new Error(`Could not find PUZZLE_LAB_CONFIGS in ${eng.file}`);
      const end = text.indexOf('};', start);
      const block = text.slice(start, end);
      ids = new Set();
      for (const m of block.matchAll(/'([^']+)':/g)) ids.add(m[1]);
    } else {
      const start = text.indexOf(`const ${eng.varName}`);
      if (start === -1) throw new Error(`Could not find ${eng.varName} in ${eng.file}`);
      const end = text.indexOf(']);', start);
      const block = text.slice(start, end);
      ids = singleQuoted(block);
    }
    result.set(templateType, { dir: eng.dir, validIds: ids });
  }
  return result;
}

/** Source 5: check existence of a per-mission config file. */
function configFileExists(dir, id) {
  const rel = `src/features/missions/templates/${dir}/configs/${id}.ts`;
  return fs.existsSync(path.join(ROOT, rel));
}

/** List all config files in a template's configs/ dir (returns Set of basenames without .ts). */
function configDirIds(dir) {
  const p = path.join(ROOT, `src/features/missions/templates/${dir}/configs`);
  if (!fs.existsSync(p)) return new Set();
  return new Set(
    fs.readdirSync(p)
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.slice(0, -3))
  );
}

// ── Soft sources ───────────────────────────────────────────────────────────

const SOFT_SOURCES = [
  { key: 'curriculum',       file: 'src/config/curriculum.ts',                needle: (id) => `'${id}'` },
  { key: 'slo',              file: 'src/config/slo-kerndoelen-mapping.ts',      needle: (id) => `id: '${id}'` },
  { key: 'basisvaardigheden', file: 'src/config/basisvaardigheden-mapping.ts', needle: (id) => `missionId: '${id}'` },
  { key: 'missionGoals',     file: 'src/config/missionGoals.ts',               needle: (id) => `'${id}':` },
];

const AGENT_FILES = ['year1', 'year2', 'year3'].map((y) => ({
  key: `agents/${y}`,
  file: `src/config/agents/${y}.tsx`,
  needle: (id) => `id: '${id}'`,
}));

function checkSoftSource(src, id) {
  try {
    const text = read(src.file);
    return text.includes(src.needle(id));
  } catch {
    return false;
  }
}

// ── Main logic ─────────────────────────────────────────────────────────────

const focusedId = process.argv[2] ?? null;

// Parse all sources upfront
const unionIds       = parseUnionIds();
const arrayIds       = parseArrayIds();
const templateMissions = parseTemplateMissions();
const engineAllowlists = parseEngineAllowlists();

const hardFailures = [];
const warnings = [];

// Helper to report
const hard = (msg) => hardFailures.push(msg);
const warn = (msg) => warnings.push(msg);

// ── Mode: FOCUSED (single mission) ────────────────────────────────────────

if (focusedId) {
  const id = focusedId;
  console.log(`\nMission registration preflight — focused check: '${id}'\n`);

  const templateType = templateMissions.get(id);

  const checks = [];
  const mark = (label, pass, isHard = true) => {
    checks.push({ label, pass, isHard });
    if (!pass && isHard) hard(`'${id}': ${label}`);
  };

  // RoleId union & AGENT_ROLE_IDS array — reported as warnings, not hard failures.
  // We cannot tell a chat agent-role from a template-only mission without tsc, and
  // template-only missions legitimately need NOT appear in the union (e.g. notificatie-ninja).
  // CI tsc remains the authoritative TS2322 gate; this surfaces the gap early.
  const inUnion = unionIds.has(id);
  checks.push({ label: 'RoleId union (src/types.ts)', pass: inUnion, isHard: false });
  if (!inUnion) warn(`'${id}': not in RoleId union (src/types.ts) — add it here if this mission has a chat agent-role, else CI tsc fails TS2322`);
  mark('AGENT_ROLE_IDS array (agentRoleIds.ts)', arrayIds.has(id), false); // warn only

  // Sanity gate: the id must be registered as a mission in at least one core source.
  // If it is in none, it is a typo or a completely unwired id → hard fail (focused mode only).
  if (!templateMissions.has(id) && !arrayIds.has(id) && !unionIds.has(id)) {
    hard(`'${id}': not found in templateRegistry, AGENT_ROLE_IDS, or the RoleId union — unknown mission id (typo, or not wired anywhere yet)`);
  }

  if (templateType) {
    mark(`templateRegistry (templateType: '${templateType}')`, true);

    const eng = engineAllowlists.get(templateType);
    if (!eng) {
      hard(`'${id}': unknown templateType '${templateType}' in templateRegistry — script needs updating`);
      checks.push({ label: `validIds set (${templateType})`, pass: false, isHard: true });
      checks.push({ label: `config file exists`, pass: false, isHard: true });
    } else {
      mark(`validIds set (${templateType})`, eng.validIds.has(id));
      mark(`config file (templates/${eng.dir}/configs/${id}.ts)`, configFileExists(eng.dir, id));
    }
  } else {
    checks.push({ label: 'templateRegistry', pass: false, isHard: false });
    warn(`'${id}': not in templateRegistry (may be a dedicated/chat mission)`);
  }

  // Soft sources — warnings only
  for (const src of [...SOFT_SOURCES, ...AGENT_FILES]) {
    const pass = checkSoftSource(src, id);
    checks.push({ label: `${src.key} (${src.file})`, pass, isHard: false });
    if (!pass) warn(`'${id}': missing from ${src.key} (${src.file})`);
  }

  // Print checklist
  for (const c of checks) {
    const marker = c.pass ? 'PASS' : (c.isHard ? 'MISSING' : 'WARN');
    const icon   = c.pass ? ' ✓' : (c.isHard ? ' ✗' : ' ~');
    console.log(`${icon} [${marker}] ${c.label}`);
  }

  console.log('');
  if (hardFailures.length > 0) {
    console.error(`Hard failures (${hardFailures.length}):`);
    for (const f of hardFailures) console.error(`- ${f}`);
    process.exit(1);
  }
  const warnCount = warnings.length;
  const passCount = checks.filter((c) => c.pass).length;
  console.log(`Preflight complete: ${passCount}/${checks.length} checks pass.${warnCount > 0 ? ` ${warnCount} warning(s) above.` : ''}`);
  process.exit(0);
}

// ── Mode: REPO-WIDE structural check ──────────────────────────────────────

console.log('\nMission registration preflight — repo-wide structural check\n');

// (a) templateRegistry ids not in the RoleId union — WARNING only. This is fine for
// template-only missions (no chat agent-role), which legitimately need not appear in the
// union. It only breaks CI tsc (TS2322) when the id is used as an AgentRole.id, which we
// cannot determine here without tsc. So we surface it, but never hard-fail on it.
for (const [id] of templateMissions) {
  if (!unionIds.has(id)) {
    warn(`'${id}': in templateRegistry but not in RoleId union — fine for template-only missions; add to the union only if it has a chat agent-role`);
  }
}

// (b) For each templateMissions id: must be in validIds[templateType] AND config must exist
for (const [id, templateType] of templateMissions) {
  const eng = engineAllowlists.get(templateType);
  if (!eng) {
    hard(`'${id}': unknown templateType '${templateType}' in templateRegistry — script needs updating`);
    continue;
  }
  if (!eng.validIds.has(id)) {
    hard(`'${id}': in templateRegistry as '${templateType}' but not in ${TEMPLATE_ENGINES[templateType].varName}`);
  }
  if (!configFileExists(eng.dir, id)) {
    hard(`'${id}': config file missing at templates/${eng.dir}/configs/${id}.ts`);
  }
}

// (c) Every id in each validIds set must have a config file
for (const [templateType, eng] of engineAllowlists) {
  const dirIds = configDirIds(eng.dir);
  for (const id of eng.validIds) {
    if (!configFileExists(eng.dir, id)) {
      hard(`'${id}': in ${TEMPLATE_ENGINES[templateType].varName} but config file missing at templates/${eng.dir}/configs/${id}.ts`);
    }
  }
  // Reverse: config files not in allowlist
  for (const id of dirIds) {
    if (!eng.validIds.has(id)) {
      warn(`'${id}': config file exists in ${eng.dir}/configs/ but not in ${TEMPLATE_ENGINES[templateType].varName}`);
    }
  }
}

// ── Non-fatal warnings ────────────────────────────────────────────────────

// templateMissions ids missing from arrayIds
for (const [id] of templateMissions) {
  if (!arrayIds.has(id)) {
    warn(`'${id}': in templateRegistry but missing from AGENT_ROLE_IDS array (agentRoleIds.ts)`);
  }
}

// Drift between unionIds and arrayIds
for (const id of unionIds) {
  if (!arrayIds.has(id)) warn(`'${id}': in RoleId union but not in AGENT_ROLE_IDS array`);
}
for (const id of arrayIds) {
  if (!unionIds.has(id)) warn(`'${id}': in AGENT_ROLE_IDS array but not in RoleId union`);
}

// Soft sources: templateMissions ids missing from curriculum / slo / basisvaardigheden / missionGoals
for (const [id] of templateMissions) {
  for (const src of SOFT_SOURCES) {
    if (!checkSoftSource(src, id)) {
      warn(`'${id}': missing from ${src.key} (${src.file})`);
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`- ${w}`);
  console.log('');
}

if (hardFailures.length > 0) {
  console.error(`Hard failures (${hardFailures.length}):`);
  for (const f of hardFailures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`Repo-wide structural check passed. ${templateMissions.size} template missions checked.${warnings.length > 0 ? ` (${warnings.length} warnings above)` : ''}`);
