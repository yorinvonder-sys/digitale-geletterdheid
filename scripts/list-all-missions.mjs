/**
 * list-all-missions.mjs
 * Enumerates all missions from three sources:
 *   A) templateRegistry.ts  — template-based missions
 *   B) AuthenticatedApp.tsx — dedicated missions
 *   C) curriculum.ts        — agent-role missions (missions[] + reviewMissions[])
 *
 * Dependency-free: reads source files as text, no tsx/ts-node needed.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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

    // === SOURCE C: curriculum.ts — missions[] + reviewMissions[] ===
    // Authoritative product list; catches agent-role missions not in A/B.
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
