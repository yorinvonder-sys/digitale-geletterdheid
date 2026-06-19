/**
 * seed-review-status.mjs
 * Builds business/dgskills-reviews/review-status.json by:
 *   1. Enumerating all missions via list-all-missions.mjs
 *   2. Parsing triage-all-missions-2026-06-15.md for scores + priority bands
 *   3. Merging and writing the JSON
 *
 * Dependency-free — no tsx/ts-node needed.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllMissions } from './list-all-missions.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TRIAGE_PATH = join(ROOT, 'business/dgskills-reviews/triage-all-missions-2026-06-15.md');
const OUTPUT_PATH = join(ROOT, 'business/dgskills-reviews/review-status.json');

/**
 * Map emoji color indicators to numeric score contribution.
 * Triage formula uses: red=2, orange=1, green=0 per axis.
 * But the doc states prio scores directly in the table — we parse those.
 */
function emojiToScore(emoji) {
    if (emoji.includes('🔴')) return 2;
    if (emoji.includes('🟠')) return 1;
    if (emoji.includes('🟢')) return 0;
    return null;
}

/**
 * Derive priority band from total prio score.
 * Doc bands: ≥6 = high, 3-5 = medium, 0-2 = low
 */
function deriveBand(prioScore) {
    if (prioScore === null || prioScore === undefined) return 'unknown';
    if (prioScore >= 6) return 'high';
    if (prioScore >= 3) return 'medium';
    return 'low';
}

/**
 * Parse the triage markdown table rows.
 * Table columns: | mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
 * Returns a Map: missionId -> { priorityBand, triageScores }
 */
function parseTriage(mdText) {
    const result = new Map();

    // Match table data rows (not header/separator rows)
    // A data row looks like: | some-id | ... | 🔴/🟠/🟢 | ... | 🔴/🟠/🟢 | ... | 5 | ...
    // We identify data rows by the presence of emoji color indicators and a numeric prio
    const lines = mdText.split('\n');

    for (const line of lines) {
        if (!line.startsWith('|')) continue;
        const cells = line.split('|').map(c => c.trim()).filter((_, i) => i > 0); // skip leading empty
        // Remove trailing empty cell
        if (cells[cells.length - 1] === '') cells.pop();

        // Data rows in the main triage table have 8 cells: id, title, type, uiux, slo, functies, inter, prio, (top-1 issue)
        // Actually 9 cells (the last being top-1 issue, but we may also have less in some tables)
        // We check: cell[0] looks like a mission-id (kebab-case), cell[3..6] contain emoji, cell[7] is numeric
        if (cells.length < 8) continue;

        const missionId = cells[0];
        // Mission IDs are kebab-case (letters, digits, hyphens) — skip header/separator rows
        if (!/^[a-z][a-z0-9-]*$/.test(missionId)) continue;

        const uiuxCell = cells[3];
        const sloCell = cells[4];
        const fnCell = cells[5];
        const interCell = cells[6];
        const prioCell = cells[7];

        // Extract numeric prio (may have * suffix)
        const prioMatch = prioCell.match(/^(\d+)/);
        if (!prioMatch) continue;
        const prioScore = parseInt(prioMatch[1], 10);

        const uiux = emojiToScore(uiuxCell);
        const slo = emojiToScore(sloCell);
        const functions = emojiToScore(fnCell);
        const interactivity = emojiToScore(interCell);

        result.set(missionId, {
            priorityBand: deriveBand(prioScore),
            triageScores: {
                uiux,
                slo,
                functions,
                interactivity,
                total: prioScore,
            },
        });
    }

    return result;
}

function main() {
    const missions = getAllMissions();
    const mdText = readFileSync(TRIAGE_PATH, 'utf8');
    const triageMap = parseTriage(mdText);

    // Build UNION: enumerated missions + any triage-only missions not yet enumerated.
    // This ensures nothing from either source is silently dropped.
    const enumMap = new Map(missions.map(m => [m.missionId, m]));
    for (const triageId of triageMap.keys()) {
        if (!enumMap.has(triageId)) {
            // Triage-only mission: use 'agent-role' as best guess (most likely cause),
            // or 'unknown' if we can't determine. Keep data, never lose it.
            enumMap.set(triageId, { missionId: triageId, templateType: 'agent-role' });
        }
    }
    const allMissions = Array.from(enumMap.values()).sort((a, b) =>
        a.missionId.localeCompare(b.missionId)
    );

    const records = allMissions.map(({ missionId, templateType }) => {
        const triage = triageMap.get(missionId);
        return {
            missionId,
            templateType,
            priorityBand: triage ? triage.priorityBand : 'unknown',
            triageScores: triage ? triage.triageScores : null,
            lastReviewed: null,
            reviewStatus: 'pending',
            reportPath: null,
            autoFixesApplied: 0,
            openEscalations: [],
            codexVerdict: null,
        };
    });

    writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2) + '\n', 'utf8');

    // Report to stderr
    const allMissionIds = new Set(allMissions.map(m => m.missionId));
    const triageIds = new Set(triageMap.keys());

    const inEnumButNotTriage = [...allMissionIds].filter(id => !triageIds.has(id));
    const inTriageButNotEnum = [...triageIds].filter(id => !allMissionIds.has(id));

    const bands = { high: 0, medium: 0, low: 0, unknown: 0 };
    for (const r of records) bands[r.priorityBand]++;

    console.error(`\n=== review-status.json seeded ===`);
    console.error(`Total missions: ${records.length}`);
    console.error(`Bands — high: ${bands.high}, medium: ${bands.medium}, low: ${bands.low}, unknown: ${bands.unknown}`);
    console.error(`\nIn enumeration but NOT in triage (${inEnumButNotTriage.length}):`);
    for (const id of inEnumButNotTriage.sort()) console.error(`  - ${id}`);
    console.error(`\nIn triage but NOT in enumeration (${inTriageButNotEnum.length}):`);
    for (const id of inTriageButNotEnum.sort()) console.error(`  - ${id}`);
    console.error(`\nWritten to: ${OUTPUT_PATH}`);
}

main();
