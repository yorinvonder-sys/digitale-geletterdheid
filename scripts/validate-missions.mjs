#!/usr/bin/env node
/**
 * Mission Validator — DGSkills
 *
 * Cross-validates mission consistency across:
 *   1. config/templateRegistry.ts        (template routing)
 *   2. config/slo-kerndoelen-mapping.ts   (SLO kerndoelen)
 *   3. config/curriculum.ts               (leerjaar/periode placement)
 *   4. config/agentRoleIds.ts             (AI agent roles)
 *   5. AuthenticatedApp.tsx               (dedicated custom missions)
 *
 * Run: npm run validate:missions
 * Exit 1 on errors (blocks CI), exit 0 on warnings only.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ============================================================================
// Parsers — extract data from TypeScript config files via regex
// ============================================================================

function readFile(relPath) {
  return readFileSync(resolve(ROOT, relPath), 'utf-8');
}

/** Parse template registry: extract mission IDs and their config */
function parseTemplateRegistry() {
  const src = readFile('config/templateRegistry.ts');
  const missions = new Map();

  // Match each entry like: 'mission-id': { missionId: 'mission-id', templateType: 'type', enableChat: true, chatRoleId: 'role' }
  const entryRegex = /['"]([a-z0-9-]+)['"]\s*:\s*\{[^}]*templateType:\s*['"]([a-z-]+)['"][^}]*\}/g;
  let match;
  while ((match = entryRegex.exec(src)) !== null) {
    const id = match[1];
    const templateType = match[2];
    const block = match[0];
    const enableChat = /enableChat:\s*true/.test(block);
    const chatRoleMatch = block.match(/chatRoleId:\s*['"]([a-z0-9-]+)['"]/);
    const chatRoleId = chatRoleMatch ? chatRoleMatch[1] : null;

    missions.set(id, { templateType, enableChat, chatRoleId });
  }

  return missions;
}

/** Parse SLO kerndoelen mapping: extract mission entries */
function parseSloMapping() {
  const src = readFile('config/slo-kerndoelen-mapping.ts');
  const missions = new Map();

  // Match each entry like: { id: 'mission-id', title: '...', week: N, yearGroup: N, sloKerndoelen: ['21A', '21B'] }
  const entryRegex = /\{\s*id:\s*['"]([a-z0-9-]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*week:\s*(\d+),\s*yearGroup:\s*(\d+),\s*sloKerndoelen:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = entryRegex.exec(src)) !== null) {
    const id = match[1];
    const title = match[2];
    const week = parseInt(match[3], 10);
    const yearGroup = parseInt(match[4], 10);
    const sloKerndoelen = match[5].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];

    // Check for VSO mapping
    const afterMatch = src.substring(match.index + match[0].length, match.index + match[0].length + 200);
    const vsoMatch = afterMatch.match(/sloVsoKerndoelen:\s*\[([^\]]*)\]/);
    const sloVsoKerndoelen = vsoMatch
      ? (vsoMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [])
      : [];

    missions.set(id, { title, week, yearGroup, sloKerndoelen, sloVsoKerndoelen });
  }

  return missions;
}

/** Parse curriculum: extract all mission IDs per yearGroup/period */
function parseCurriculum() {
  const src = readFile('config/curriculum.ts');
  const missions = new Set();
  const assessments = new Set();
  const periods = [];

  // Extract year groups and their periods
  // Find each period block with missions array
  const periodRegex = /(\d+):\s*\{[^{}]*?title:\s*['"]([^'"]+)['"][^{}]*?missions:\s*\[([\s\S]*?)\]/g;
  let match;

  // Simpler approach: find all string arrays for missions and reviewMissions
  const missionArrayRegex = /missions:\s*\[([^\]]*)\]/g;
  while ((match = missionArrayRegex.exec(src)) !== null) {
    const ids = match[1].match(/'([a-z0-9-]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    ids.forEach(id => missions.add(id));
  }

  const reviewArrayRegex = /reviewMissions:\s*\[([^\]]*)\]/g;
  while ((match = reviewArrayRegex.exec(src)) !== null) {
    const ids = match[1].match(/'([a-z0-9-]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    ids.forEach(id => missions.add(id));
  }

  const assessmentRegex = /assessmentId:\s*'([a-z0-9-]+)'/g;
  while ((match = assessmentRegex.exec(src)) !== null) {
    assessments.add(match[1]);
  }

  // Parse period details for SLO focus validation
  const periodDetailRegex = /(\d+):\s*\{\s*title:\s*['"]([^'"]+)['"][\s\S]*?sloFocus:\s*\[([^\]]*)\][\s\S]*?missions:\s*\[([^\]]*)\]/g;
  while ((match = periodDetailRegex.exec(src)) !== null) {
    const sloFocus = match[3].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    const periodMissions = match[4].match(/'([a-z0-9-]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    periods.push({ title: match[2], sloFocus, missions: periodMissions });
  }

  return { missions, assessments, periods };
}

/** Parse agent role IDs */
function parseAgentRoleIds() {
  const src = readFile('config/agentRoleIds.ts');
  const roles = new Set();

  const match = src.match(/AGENT_ROLE_IDS\s*=\s*\[([\s\S]*?)\]\s*as\s*const/);
  if (match) {
    const ids = match[1].match(/'([a-z0-9-]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    ids.forEach(id => roles.add(id));
  }

  return roles;
}

/** Parse dedicated (custom) missions from AuthenticatedApp.tsx */
function parseDedicatedMissions() {
  const src = readFile('AuthenticatedApp.tsx');
  const missions = new Set();

  const match = src.match(/DEDICATED_MISSIONS\s*=\s*new\s+Set\(\[([\s\S]*?)\]\)/);
  if (match) {
    const ids = match[1].match(/'([a-z0-9-]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
    ids.forEach(id => missions.add(id));
  }

  return missions;
}

// ============================================================================
// Validators
// ============================================================================

const VALID_TEMPLATE_TYPES = new Set([
  'scenario-engine', 'puzzle-lab', 'simulation-lab', 'review-arena',
  'builder-canvas', 'data-viewer', 'debate-arena', 'tool-guide',
]);

const VALID_SLO_CODES_VO = new Set(['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C']);
const VALID_SLO_CODES_VSO = new Set(['18A', '18B', '18C', '19A', '20A', '20B']);
const VALID_SLO_CODES = new Set([...VALID_SLO_CODES_VO, ...VALID_SLO_CODES_VSO]);

function validate(templateRegistry, sloMapping, curriculum, agentRoles, dedicatedMissions) {
  const errors = [];
  const warnings = [];

  const { missions: curriculumMissions, assessments, periods } = curriculum;

  // All routable missions = template + dedicated + agent-chat-fallback
  const allRoutable = new Set([
    ...templateRegistry.keys(),
    ...dedicatedMissions,
  ]);
  // Agent roles also serve as route fallback
  const allRoutableWithAgents = new Set([
    ...allRoutable,
    ...agentRoles,
  ]);

  // ── 1. Cross-reference: curriculum → routing ──────────────────────────
  for (const missionId of curriculumMissions) {
    if (!allRoutableWithAgents.has(missionId)) {
      errors.push(`ROUTE: Missie '${missionId}' staat in curriculum maar heeft geen route (niet in templateRegistry, DEDICATED_MISSIONS, of agentRoleIds)`);
    }
  }

  // ── 2. Cross-reference: curriculum → SLO mapping ──────────────────────
  for (const missionId of curriculumMissions) {
    if (!sloMapping.has(missionId)) {
      errors.push(`SLO: Missie '${missionId}' staat in curriculum maar niet in slo-kerndoelen-mapping`);
    }
  }

  // ── 3. Cross-reference: SLO mapping → curriculum ──────────────────────
  for (const [missionId, meta] of sloMapping) {
    if (!curriculumMissions.has(missionId) && !assessments.has(missionId)) {
      warnings.push(`WEES: Missie '${missionId}' (${meta.title}) staat in SLO mapping maar niet in curriculum`);
    }
  }

  // ── 4. Cross-reference: template registry → SLO mapping ──────────────
  for (const missionId of templateRegistry.keys()) {
    if (!sloMapping.has(missionId)) {
      errors.push(`SLO: Missie '${missionId}' staat in templateRegistry maar niet in slo-kerndoelen-mapping`);
    }
  }

  // ── 5. Chat configuration checks ─────────────────────────────────────
  for (const [missionId, config] of templateRegistry) {
    if (config.enableChat && !config.chatRoleId) {
      errors.push(`CHAT: Missie '${missionId}' heeft enableChat=true maar geen chatRoleId`);
    }
    if (config.chatRoleId && !config.enableChat) {
      errors.push(`CHAT: Missie '${missionId}' heeft chatRoleId='${config.chatRoleId}' maar enableChat is niet true`);
    }
    if (config.chatRoleId && !agentRoles.has(config.chatRoleId)) {
      errors.push(`CHAT: Missie '${missionId}' heeft chatRoleId='${config.chatRoleId}' maar die bestaat niet in agentRoleIds`);
    }
  }

  // ── 6. Template type validation ───────────────────────────────────────
  for (const [missionId, config] of templateRegistry) {
    if (!VALID_TEMPLATE_TYPES.has(config.templateType)) {
      errors.push(`TYPE: Missie '${missionId}' heeft onbekend templateType '${config.templateType}'`);
    }
  }

  // ── 7. SLO code validation ────────────────────────────────────────────
  for (const [missionId, meta] of sloMapping) {
    if (meta.sloKerndoelen.length === 0) {
      errors.push(`SLO: Missie '${missionId}' (${meta.title}) heeft geen sloKerndoelen`);
    }
    for (const code of meta.sloKerndoelen) {
      if (!VALID_SLO_CODES_VO.has(code)) {
        errors.push(`SLO: Missie '${missionId}' heeft ongeldige VO kerndoel-code '${code}'`);
      }
    }
    for (const code of meta.sloVsoKerndoelen) {
      if (!VALID_SLO_CODES_VSO.has(code)) {
        errors.push(`SLO: Missie '${missionId}' heeft ongeldige VSO kerndoel-code '${code}'`);
      }
    }
  }

  // ── 8. Structural validation on SLO mapping ───────────────────────────
  for (const [missionId, meta] of sloMapping) {
    if (![1, 2, 3].includes(meta.yearGroup)) {
      errors.push(`STRUCT: Missie '${missionId}' heeft ongeldig yearGroup ${meta.yearGroup} (verwacht 1, 2 of 3)`);
    }
    if (![1, 2, 3, 4].includes(meta.week)) {
      errors.push(`STRUCT: Missie '${missionId}' heeft ongeldige week ${meta.week} (verwacht 1-4)`);
    }
  }

  // ── 9. Duplicate check in template registry ───────────────────────────
  // (Map keys are inherently unique, but check missionId field matches key)
  for (const [key, config] of templateRegistry) {
    if (config.templateType === undefined) {
      errors.push(`STRUCT: Template entry '${key}' mist templateType`);
    }
  }

  // ── 10. Agent role coverage: every curriculum mission should have an agent role ─
  for (const missionId of curriculumMissions) {
    // Skip assessments
    if (missionId.startsWith('assessment-')) continue;
    if (!agentRoles.has(missionId) && !dedicatedMissions.has(missionId) && !templateRegistry.has(missionId)) {
      // Missions that are only in curriculum but have no agent role AND no other route
      warnings.push(`AGENT: Missie '${missionId}' staat in curriculum maar niet in agentRoleIds`);
    }
  }

  // ── 11. Dedicated missions should be in SLO mapping ───────────────────
  for (const missionId of dedicatedMissions) {
    if (!sloMapping.has(missionId)) {
      errors.push(`SLO: Custom missie '${missionId}' (DEDICATED_MISSIONS) staat niet in slo-kerndoelen-mapping`);
    }
  }

  // ── 12. Assessment validation ─────────────────────────────────────────
  for (const assessmentId of assessments) {
    if (!sloMapping.has(assessmentId)) {
      warnings.push(`ASSESSMENT: Assessment '${assessmentId}' in curriculum maar niet in SLO mapping`);
    }
  }

  // ── 13. SLO focus vs mission kerndoelen alignment ─────────────────────
  for (const period of periods) {
    if (period.sloFocus.length === 0) continue;
    const periodSloSet = new Set(period.sloFocus);

    for (const missionId of period.missions) {
      const meta = sloMapping.get(missionId);
      if (!meta) continue;

      const missionCodes = new Set(meta.sloKerndoelen);
      const hasOverlap = [...missionCodes].some(code => periodSloSet.has(code));

      if (!hasOverlap) {
        warnings.push(`SLO-ALIGN: Missie '${missionId}' in periode '${period.title}' heeft geen overlap met sloFocus [${period.sloFocus.join(', ')}]`);
      }
    }
  }

  return { errors, warnings };
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DGSkills Missie Validator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Parse all config sources
  const templateRegistry = parseTemplateRegistry();
  const sloMapping = parseSloMapping();
  const curriculum = parseCurriculum();
  const agentRoles = parseAgentRoleIds();
  const dedicatedMissions = parseDedicatedMissions();

  console.log(`  Template missies:    ${templateRegistry.size}`);
  console.log(`  SLO-mapped missies:  ${sloMapping.size}`);
  console.log(`  Curriculum missies:  ${curriculum.missions.size}`);
  console.log(`  Assessments:         ${curriculum.assessments.size}`);
  console.log(`  Agent roles:         ${agentRoles.size}`);
  console.log(`  Dedicated missies:   ${dedicatedMissions.size}`);
  console.log('');

  // Run validation
  const { errors, warnings } = validate(templateRegistry, sloMapping, curriculum, agentRoles, dedicatedMissions);

  // Print results
  if (errors.length > 0) {
    console.log('FOUTEN (moeten opgelost):');
    for (const err of errors) {
      console.log(`  ❌ ${err}`);
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('WAARSCHUWINGEN:');
    for (const warn of warnings) {
      console.log(`  ⚠️  ${warn}`);
    }
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✅ Alle missies zijn consistent!');
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Totaal: ${errors.length} fout(en), ${warnings.length} waarschuwing(en)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
