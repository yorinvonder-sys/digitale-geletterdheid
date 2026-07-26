import assert from 'node:assert/strict';
import test from 'node:test';

import {
    parseAuditRecords,
    parseEvidenceSource,
} from '../../src/features/developer/mission-quality/missionQualitySources.ts';

test('valideert en behoudt een minimaal auditrecord', () => {
    const records = parseAuditRecords([{
        missionId: 'voorbeeld-missie',
        reviewStatus: 'blocked',
        openEscalations: ['Maak een keuze'],
        escalationCount: 0,
    }]);

    assert.equal(records.length, 1);
    assert.equal(records[0].missionId, 'voorbeeld-missie');
    assert.equal(records[0].openEscalations.length, 1);
});

test('weigert een auditrecord met onbekende status of ongeldige beslispunten', () => {
    assert.throws(
        () => parseAuditRecords([{
            missionId: 'voorbeeld-missie',
            reviewStatus: 'pending',
            openEscalations: [],
            escalationCount: 0,
        }]),
        /reviewstatus/i,
    );
    assert.throws(
        () => parseAuditRecords([{
            missionId: 'voorbeeld-missie',
            reviewStatus: 'blocked',
            openEscalations: 'geen lijst',
            escalationCount: 0,
        }]),
        /openescalations/i,
    );
});

test('valideert versiebeheerbewijs en percentagecoördinaten', () => {
    const items = parseEvidenceSource({
        schemaVersion: 1,
        items: [{
            id: 'voorbeeld-desktop',
            missionId: 'voorbeeld-missie',
            capturedAt: '2026-07-26T12:00:00.000Z',
            device: 'desktop',
            viewport: { width: 1440, height: 1000 },
            evidenceType: 'OBJECTIVE',
            beforeImage: '/screenshots/voorbeeld.webp',
            afterImage: null,
            findings: [{
                id: 'voorbeeld-ux-1',
                title: 'Knop is onduidelijk',
                category: 'USABILITY',
                severity: 'MEDIUM',
                description: 'De actie valt niet op.',
                learnerImpact: 'De leerling twijfelt.',
                recommendedFix: 'Maak de status duidelijker.',
                personas: ['onzekere-noor'],
                requiresHumanValidation: false,
                annotations: [{
                    id: 1,
                    x: 10,
                    y: 20,
                    width: 30,
                    height: 15,
                    label: 'Primaire actie',
                    shape: 'rectangle',
                }],
            }],
        }],
    });

    assert.equal(items[0].findings[0].annotations[0].width, 30);
});

test('weigert bewijs zonder beeld en annotaties buiten het beeldvlak', () => {
    const base = {
        schemaVersion: 1,
        items: [{
            id: 'voorbeeld-desktop',
            missionId: 'voorbeeld-missie',
            capturedAt: '2026-07-26T12:00:00.000Z',
            device: 'desktop',
            viewport: { width: 1440, height: 1000 },
            evidenceType: 'OBJECTIVE',
            beforeImage: null,
            afterImage: null,
            findings: [],
        }],
    };

    assert.throws(() => parseEvidenceSource(base), /beforeimage.*afterimage/i);

    const withInvalidAnnotation = structuredClone(base);
    withInvalidAnnotation.items[0].beforeImage = '/screenshots/voorbeeld.webp';
    withInvalidAnnotation.items[0].findings = [{
        id: 'voorbeeld-ux-1',
        title: 'Knop is onduidelijk',
        category: 'USABILITY',
        severity: 'MEDIUM',
        description: 'De actie valt niet op.',
        learnerImpact: 'De leerling twijfelt.',
        recommendedFix: 'Maak de status duidelijker.',
        personas: ['onzekere-noor'],
        requiresHumanValidation: false,
        annotations: [{
            id: 1,
            x: 101,
            y: 20,
            width: 30,
            height: 15,
            label: 'Buiten beeld',
            shape: 'rectangle',
        }],
    }];

    assert.throws(() => parseEvidenceSource(withInvalidAnnotation), /annotations.*x/i);
});
