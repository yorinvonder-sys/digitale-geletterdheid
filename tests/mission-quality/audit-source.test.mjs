import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const auditPath = new URL('../../business/dgskills-reviews/review-status.json', import.meta.url);
const evidencePath = new URL('../../business/dgskills-reviews/mission-quality-evidence.json', import.meta.url);

test('de levende auditbron behoudt unieke records en de geverifieerde snapshot', async () => {
    const records = JSON.parse(await readFile(auditPath, 'utf8'));
    const ids = records.map(record => record.missionId);
    const statusCount = Object.groupBy(records, record => record.reviewStatus);
    const openDecisionCount = records.reduce(
        (total, record) => total + (record.openEscalations?.length || 0),
        0,
    );

    assert.equal(records.length, 99);
    assert.equal(new Set(ids).size, 99);
    assert.equal(statusCount.blocked?.length, 55);
    assert.equal(statusCount.fixed?.length, 44);
    assert.equal(openDecisionCount, 88);

    for (const record of records) {
        assert.match(record.missionId, /^[a-z0-9-]+$/);
        assert.ok(['blocked', 'fixed'].includes(record.reviewStatus));
        assert.ok(Array.isArray(record.openEscalations));
        assert.ok(Number.isInteger(record.escalationCount));
        assert.ok(record.escalationCount >= 0);
    }
});

test('versiebeheerbewijs verwijst alleen naar bestaande auditrecords', async () => {
    const records = JSON.parse(await readFile(auditPath, 'utf8'));
    const evidence = JSON.parse(await readFile(evidencePath, 'utf8'));
    const auditIds = new Set(records.map(record => record.missionId));

    assert.equal(evidence.schemaVersion, 1);
    assert.ok(Array.isArray(evidence.items));

    for (const item of evidence.items) {
        assert.ok(auditIds.has(item.missionId), `Onbekende evidence-missie: ${item.missionId}`);
        assert.match(item.id, /^[a-z0-9-]+$/);
        assert.ok(['OBJECTIVE', 'SIMULATION', 'INFERENCE'].includes(item.evidenceType));
        assert.ok(item.beforeImage || item.afterImage);

        for (const finding of item.findings) {
            assert.ok(Array.isArray(finding.annotations));
            for (const annotation of finding.annotations) {
                for (const field of ['x', 'y', 'width', 'height']) {
                    assert.ok(annotation[field] >= 0 && annotation[field] <= 100);
                }
            }
        }
    }
});
