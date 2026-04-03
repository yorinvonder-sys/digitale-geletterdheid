/**
 * Cross-reference verification script for mission consistency.
 * Checks: templateRegistry ↔ config files ↔ agentRoleIds ↔ agent configs ↔ SLO mapping
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
let errors = [];
let warnings = [];

// 1. Get all config file mission IDs (from filesystem)
const TEMPLATE_DIRS = [
  'builder-canvas', 'data-viewer', 'debate-arena', 'puzzle-lab',
  'review-arena', 'scenario-engine', 'simulation-lab', 'tool-guide'
];

const configFileMissions = new Set();
for (const dir of TEMPLATE_DIRS) {
  const configDir = path.join(ROOT, 'components/missions/templates', dir, 'configs');
  if (fs.existsSync(configDir)) {
    for (const file of fs.readdirSync(configDir)) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        configFileMissions.add(file.replace(/\.(ts|tsx)$/, ''));
      }
    }
  }
}

// 2. Parse templateRegistry.ts for registered missions
const registryContent = fs.readFileSync(path.join(ROOT, 'config/templateRegistry.ts'), 'utf-8');
const registryMissions = new Map();
const registryRegex = /'([^']+)':\s*\{\s*missionId:\s*'([^']+)',\s*templateType:\s*'([^']+)'/g;
let match;
while ((match = registryRegex.exec(registryContent)) !== null) {
  registryMissions.set(match[1], { missionId: match[2], templateType: match[3] });
}

// 3. Parse agentRoleIds.ts
const roleIdsContent = fs.readFileSync(path.join(ROOT, 'config/agentRoleIds.ts'), 'utf-8');
const roleIds = new Set();
const roleIdRegex = /'([^']+)'/g;
while ((match = roleIdRegex.exec(roleIdsContent)) !== null) {
  roleIds.add(match[1]);
}

// 4. Parse SLO mapping (array format: { id: 'xxx', ... })
const sloContent = fs.readFileSync(path.join(ROOT, 'config/slo-kerndoelen-mapping.ts'), 'utf-8');
const sloMissions = new Set();
const sloRegex = /\{\s*id:\s*'([^']+)'/g;
while ((match = sloRegex.exec(sloContent)) !== null) {
  sloMissions.add(match[1]);
}

// 5. Parse agent configs (year1, year2, year3) - format: id: 'xxx'
const agentMissions = new Set();
for (const year of ['year1', 'year2', 'year3']) {
  const agentFile = path.join(ROOT, 'config/agents', `${year}.tsx`);
  if (fs.existsSync(agentFile)) {
    const content = fs.readFileSync(agentFile, 'utf-8');
    const agentRegex = /\bid:\s*'([^']+)'/g;
    while ((match = agentRegex.exec(content)) !== null) {
      agentMissions.add(match[1]);
    }
  }
}

console.log('=== MISSIE CROSS-REFERENTIE CONTROLE ===\n');
console.log(`Config-bestanden gevonden: ${configFileMissions.size}`);
console.log(`Registry entries: ${registryMissions.size}`);
console.log(`AgentRoleIds: ${roleIds.size}`);
console.log(`SLO-mapping entries: ${sloMissions.size}`);
console.log(`Agent configs (roleIds): ${agentMissions.size}`);
console.log('');

// CHECK 1: Config files without registry entry
console.log('--- CHECK 1: Config-bestanden zonder registry entry ---');
for (const id of configFileMissions) {
  if (!registryMissions.has(id)) {
    errors.push(`CONFIG ZONDER REGISTRY: ${id}`);
    console.log(`  ❌ ${id}`);
  }
}
if (![...configFileMissions].some(id => !registryMissions.has(id))) {
  console.log('  ✅ Alle config-bestanden zijn geregistreerd');
}

// CHECK 2: Registry entries without config file
console.log('\n--- CHECK 2: Registry entries zonder config-bestand ---');
for (const [id, entry] of registryMissions) {
  if (!configFileMissions.has(id)) {
    errors.push(`REGISTRY ZONDER CONFIG: ${id} (type: ${entry.templateType})`);
    console.log(`  ❌ ${id} (${entry.templateType})`);
  }
}
if (![...registryMissions.keys()].some(id => !configFileMissions.has(id))) {
  console.log('  ✅ Alle registry entries hebben een config-bestand');
}

// CHECK 3: Template missions without agentRoleId
console.log('\n--- CHECK 3: Template-missies zonder agentRoleId ---');
for (const id of registryMissions.keys()) {
  if (!roleIds.has(id)) {
    warnings.push(`GEEN AGENT_ROLE_ID: ${id}`);
    console.log(`  ⚠️  ${id}`);
  }
}
if (![...registryMissions.keys()].some(id => !roleIds.has(id))) {
  console.log('  ✅ Alle template-missies hebben een agentRoleId');
}

// CHECK 4: Template missions without SLO mapping
console.log('\n--- CHECK 4: Template-missies zonder SLO-mapping ---');
for (const id of registryMissions.keys()) {
  if (!sloMissions.has(id)) {
    warnings.push(`GEEN SLO-MAPPING: ${id}`);
    console.log(`  ⚠️  ${id}`);
  }
}
if (![...registryMissions.keys()].some(id => !sloMissions.has(id))) {
  console.log('  ✅ Alle template-missies hebben een SLO-mapping');
}

// CHECK 5: Template missions without agent config
console.log('\n--- CHECK 5: Template-missies zonder agent-config ---');
for (const id of registryMissions.keys()) {
  if (!agentMissions.has(id)) {
    warnings.push(`GEEN AGENT-CONFIG: ${id}`);
    console.log(`  ⚠️  ${id}`);
  }
}
if (![...registryMissions.keys()].some(id => !agentMissions.has(id))) {
  console.log('  ✅ Alle template-missies hebben een agent-config');
}

// CHECK 6: Registry templateType matches config directory
console.log('\n--- CHECK 6: templateType matcht config-directory ---');
for (const [id, entry] of registryMissions) {
  const expectedDir = path.join(ROOT, 'components/missions/templates', entry.templateType, 'configs', `${id}.ts`);
  if (!fs.existsSync(expectedDir)) {
    const altPath = expectedDir + 'x'; // .tsx
    if (!fs.existsSync(altPath)) {
      errors.push(`VERKEERDE DIRECTORY: ${id} verwacht in ${entry.templateType}/configs/ maar niet gevonden`);
      console.log(`  ❌ ${id} (verwacht: ${entry.templateType}/configs/${id}.ts)`);
    }
  }
}
if (!errors.some(e => e.startsWith('VERKEERDE DIRECTORY'))) {
  console.log('  ✅ Alle configs staan in de juiste template-directory');
}

// Summary
console.log('\n=== SAMENVATTING ===');
console.log(`Fouten: ${errors.length}`);
console.log(`Waarschuwingen: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n🔴 FOUTEN (moeten worden opgelost):');
  errors.forEach(e => console.log(`  - ${e}`));
}
if (warnings.length > 0) {
  console.log('\n🟡 WAARSCHUWINGEN (controleren):');
  warnings.forEach(w => console.log(`  - ${w}`));
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🟢 Alles consistent!');
}

process.exit(errors.length > 0 ? 1 : 0);
