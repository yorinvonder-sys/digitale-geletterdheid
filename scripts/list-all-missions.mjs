/**
 * list-all-missions.mjs
 * Enumerates all missions from four sources:
 *   A) templateRegistry.ts  — template-based missions
 *   B) AuthenticatedApp.tsx — dedicated missions
 *   C) components/missions/ — legacy *Mission.tsx components
 *   D) curriculum.ts        — agent-role missions (missions[] + reviewMissions[])
 *
 * Dependency-free: reads source files as text, no tsx/ts-node needed.
 *
 * EXCLUSIONS:
 *   - 'print-instructies' (phantom from legacy PrintInstructiesMission.tsx):
 *     the real mission id is 'ipad-print-instructies' (source B + agentRoleIds).
 *     The component is named PrintInstructiesMission but renders ipad-print-instructies.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Recursively find files matching a predicate under a directory.
 */
function findFiles(dir, predicate, results = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return results;
    }
    for (const entry of entries) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            findFiles(full, predicate, results);
        } else if (predicate(entry)) {
            results.push(full);
        }
    }
    return results;
}

/**
 * Convert PascalCase filename (without 'Mission.tsx') to kebab-case.
 * e.g. "FilterBubbleBreaker" -> "filter-bubble-breaker"
 * e.g. "PrintInstructies"    -> "print-instructies"
 */
function toKebabCase(pascal) {
    return pascal
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

export function getAllMissions() {
    const seen = new Map(); // missionId -> { missionId, templateType }

    // === SOURCE A: templateRegistry.ts ===
    const registryPath = join(ROOT, 'src/config/templateRegistry.ts');
    const registryText = readFileSync(registryPath, 'utf8');

    // Match string-literal keys with their templateType
    // Pattern: 'mission-id': { missionId: '...', templateType: 'xxx', ...}
    const templatePattern = /'([\w-]+)'\s*:\s*\{[^}]*templateType\s*:\s*'([\w-]+)'/g;
    let m;
    while ((m = templatePattern.exec(registryText)) !== null) {
        const [, missionId, templateType] = m;
        seen.set(missionId, { missionId, templateType });
    }

    // === SOURCE B: AuthenticatedApp.tsx ===
    const appPath = join(ROOT, 'src/app/AuthenticatedApp.tsx');
    const appText = readFileSync(appPath, 'utf8');

    // Extract members from DEDICATED_MISSIONS = new Set([...])
    const setMatch = appText.match(/const DEDICATED_MISSIONS\s*=\s*new Set\(\[([\s\S]*?)\]\)/);
    if (setMatch) {
        const inner = setMatch[1];
        const memberPattern = /'([\w-]+)'/g;
        while ((m = memberPattern.exec(inner)) !== null) {
            const missionId = m[1];
            if (!seen.has(missionId)) {
                seen.set(missionId, { missionId, templateType: 'dedicated' });
            }
        }
    }

    // === SOURCE C: components/missions/**/*Mission.tsx ===
    // EXCLUSION: 'print-instructies' is the phantom id derived from
    // PrintInstructiesMission.tsx. The component's real mission id is
    // 'ipad-print-instructies' (registered in DEDICATED_MISSIONS above).
    const LEGACY_PHANTOMS = new Set(['print-instructies']);

    const missionsDir = join(ROOT, 'components/missions');
    const legacyFiles = findFiles(
        missionsDir,
        (name) => name.endsWith('Mission.tsx')
    );

    for (const filePath of legacyFiles) {
        const fileName = basename(filePath, '.tsx'); // e.g. "FilterBubbleBreakerMission"
        const pascal = fileName.replace(/Mission$/, '');  // strip "Mission" suffix
        const missionId = toKebabCase(pascal);
        if (LEGACY_PHANTOMS.has(missionId)) continue; // skip phantom
        if (!seen.has(missionId)) {
            seen.set(missionId, { missionId, templateType: 'legacy' });
        }
    }

    // === SOURCE D: curriculum.ts — missions[] + reviewMissions[] ===
    // Authoritative product list; catches agent-role missions not in A/B/C.
    // Strategy: only parse string arrays that appear AFTER a 'missions:' or
    // 'reviewMissions:' key to avoid picking up assessmentId values or other
    // string properties.
    const curriculumPath = join(ROOT, 'src/config/curriculum.ts');
    const curriculumText = readFileSync(curriculumPath, 'utf8');

    // Match missions: [ ... ] and reviewMissions: [ ... ] blocks.
    // Each block ends at the first ']' not part of a nested array (periods are flat string arrays).
    const missionArrayPattern = /(?:review)?[Mm]issions\s*:\s*\[([\s\S]*?)\]/g;
    while ((m = missionArrayPattern.exec(curriculumText)) !== null) {
        const block = m[1];
        const idPattern = /'([a-z][a-z0-9-]+-[a-z0-9-]+)'/g; // must have at least one hyphen
        let idMatch;
        while ((idMatch = idPattern.exec(block)) !== null) {
            const missionId = idMatch[1];
            if (!seen.has(missionId)) {
                seen.set(missionId, { missionId, templateType: 'agent-role' });
            }
        }
    }

    // Sort by missionId and return
    return Array.from(seen.values()).sort((a, b) =>
        a.missionId.localeCompare(b.missionId)
    );
}

// Run directly: print count + JSON
if (import.meta.url === `file://${process.argv[1]}`) {
    const missions = getAllMissions();
    console.error(`Total missions enumerated: ${missions.length}`);
    console.log(JSON.stringify(missions, null, 2));
}
