import assert from 'node:assert/strict';
import test from 'node:test';

import {
    applyMissionQualityDecision,
    buildMissionCatalog,
    filterMissionQuality,
    getDecisionKey,
    getEvidenceLabel,
    getMissionDecisionProgress,
    reconcileMissionQuality,
    resolveSelectedMissionId,
    sortMissionQuality,
    summarizeMissionQuality,
    type AuditRecord,
    type MissionQualityDecisionMap,
} from '../../src/features/developer/mission-quality/missionQualityModel.ts';

const yearGroups = {
    1: {
        periods: {
            1: {
                title: 'Basis',
                missions: ['alpha', 'beta'],
                reviewMissions: ['alpha-review'],
            },
            2: {
                title: 'Verdieping',
                missions: ['gamma'],
            },
        },
    },
    2: {
        periods: {
            1: {
                title: 'Data',
                missions: ['delta'],
                reviewMissions: [],
            },
        },
    },
};

const auditRecords: AuditRecord[] = [
    {
        missionId: 'alpha',
        templateType: 'tool-guide',
        priorityBand: 'high',
        lastReviewed: '2026-07-01',
        reviewStatus: 'blocked',
        reportPath: 'business/alpha.md',
        openEscalations: ['Kies aanpak A of B', 'Keur het leerdoel goed'],
        escalationCount: 2,
        reviewScores: { uiux: 4, didactiek: 5, tech: 6 },
        triageScore: 5.1,
    },
    {
        missionId: 'beta',
        templateType: 'scenario-engine',
        priorityBand: 'low',
        lastReviewed: '2026-07-02',
        reviewStatus: 'fixed',
        reportPath: 'business/beta.md',
        openEscalations: [],
        escalationCount: 0,
        reviewScores: { uiux: 9, didactiek: 8, tech: 9 },
        triageScore: 1.2,
    },
    {
        missionId: 'legacy-extra',
        templateType: 'dedicated',
        priorityBand: 'medium',
        lastReviewed: '2026-07-03',
        reviewStatus: 'blocked',
        reportPath: 'business/legacy-extra.md',
        openEscalations: ['Bepaal of deze aanvullende missie blijft'],
        escalationCount: 1,
        reviewScores: { uiux: 7, didactiek: 7, tech: 8 },
        triageScore: 3,
    },
];

test('bouwt een unieke curriculumcatalogus met periode- en reviewmetadata', () => {
    const catalog = buildMissionCatalog(yearGroups, {
        alpha: 'Alpha Agent',
        'alpha-review': 'Alpha Terugblik',
    });

    assert.deepEqual(
        catalog.map(({ id, title, yearGroup, period, isReview, order }) => ({
            id,
            title,
            yearGroup,
            period,
            isReview,
            order,
        })),
        [
            { id: 'alpha', title: 'Alpha Agent', yearGroup: 1, period: 1, isReview: false, order: 0 },
            { id: 'beta', title: 'Beta', yearGroup: 1, period: 1, isReview: false, order: 1 },
            { id: 'alpha-review', title: 'Alpha Terugblik', yearGroup: 1, period: 1, isReview: true, order: 2 },
            { id: 'gamma', title: 'Gamma', yearGroup: 1, period: 2, isReview: false, order: 3 },
            { id: 'delta', title: 'Delta', yearGroup: 2, period: 1, isReview: false, order: 4 },
        ],
    );
});

test('weigert dubbele missie-ids in de curriculumcatalogus', () => {
    assert.throws(
        () => buildMissionCatalog({
            1: {
                periods: {
                    1: { title: 'Eén', missions: ['dubbel'] },
                    2: { title: 'Twee', missions: ['dubbel'] },
                },
            },
        }),
        /dubbele missie-id.*dubbel/i,
    );
});

test('reconcileert ontbrekende actuele missies en aanvullende auditrecords afzonderlijk', () => {
    const catalog = buildMissionCatalog(yearGroups);
    const result = reconcileMissionQuality({
        catalog,
        auditRecords,
        evidence: [{
            id: 'alpha-desktop-before',
            missionId: 'alpha',
            capturedAt: '2026-07-26T12:00:00.000Z',
            device: 'desktop',
            viewport: { width: 1440, height: 1000 },
            evidenceType: 'OBJECTIVE',
            beforeImage: '/screenshots/alpha.webp',
            afterImage: null,
            references: {
                mission: '/dev/mission-preview?mission=alpha',
                test: null,
                code: null,
                pullRequest: null,
            },
            findings: [],
        }],
    });

    assert.deepEqual(result.missingAuditMissionIds, ['alpha-review', 'gamma', 'delta']);
    assert.deepEqual(result.supplementalAuditRecords.map(record => record.missionId), ['legacy-extra']);
    assert.equal(result.missions.find(mission => mission.id === 'alpha')?.evidence.length, 1);
    assert.equal(result.missions.find(mission => mission.id === 'beta')?.auditStatus, 'fixed');
    assert.equal(result.missions.find(mission => mission.id === 'gamma')?.auditStatus, 'missing');
    assert.equal(result.sourceWarnings.length, 2);
});

test('leidt KPI’s af zonder statische audit en browserbewijs te verwarren', () => {
    const quality = reconcileMissionQuality({
        catalog: buildMissionCatalog(yearGroups),
        auditRecords,
        evidence: [{
            id: 'alpha-desktop-before',
            missionId: 'alpha',
            capturedAt: '2026-07-26T12:00:00.000Z',
            device: 'desktop',
            viewport: { width: 1440, height: 1000 },
            evidenceType: 'OBJECTIVE',
            beforeImage: '/screenshots/alpha.webp',
            afterImage: null,
            references: {
                mission: '/dev/mission-preview?mission=alpha',
                test: null,
                code: null,
                pullRequest: null,
            },
            findings: [],
        }],
    });
    const decisions: MissionQualityDecisionMap = {
        [getDecisionKey('alpha', 0)]: {
            status: 'approved',
            decidedAt: '2026-07-26T13:00:00.000Z',
        },
        [getDecisionKey('legacy-extra', 0)]: {
            status: 'changes_requested',
            decidedAt: '2026-07-26T13:05:00.000Z',
        },
    };

    assert.deepEqual(summarizeMissionQuality(quality, decisions), {
        curriculumTotal: 5,
        matchedAuditCount: 2,
        auditRecordTotal: 3,
        blockedAuditRecordCount: 2,
        fixedAuditRecordCount: 1,
        missingAuditCount: 3,
        supplementalAuditCount: 1,
        openDecisionCount: 3,
        currentOpenDecisionCount: 2,
        supplementalOpenDecisionCount: 1,
        reviewedDecisionCount: 2,
        approvedDecisionCount: 1,
        changesRequestedCount: 1,
        browserEvidenceMissionCount: 1,
    });
});

test('filtert gecombineerd op tekst, leerjaar, periode, status en prioriteit', () => {
    const missions = reconcileMissionQuality({
        catalog: buildMissionCatalog(yearGroups, { alpha: 'Alpha Agent' }),
        auditRecords,
        evidence: [],
    }).missions;

    assert.deepEqual(
        filterMissionQuality(missions, {
            query: 'agent',
            yearGroup: 1,
            period: 1,
            auditStatus: 'blocked',
            priorityBand: 'high',
        }).map(mission => mission.id),
        ['alpha'],
    );
    assert.deepEqual(
        filterMissionQuality(missions, {
            query: '',
            auditStatus: 'missing',
        }).map(mission => mission.id),
        ['alpha-review', 'gamma', 'delta'],
    );
});

test('sorteert geblokkeerde missies vóór fixed en ontbrekend op hoogste urgentie', () => {
    const missions = reconcileMissionQuality({
        catalog: buildMissionCatalog(yearGroups),
        auditRecords,
        evidence: [],
    }).missions;

    assert.deepEqual(
        sortMissionQuality(missions).map(mission => mission.id),
        ['alpha', 'beta', 'alpha-review', 'gamma', 'delta'],
    );
});

test('geeft een bewijslabel dat de verificatiemethode expliciet maakt', () => {
    const withBrowserEvidence = reconcileMissionQuality({
        catalog: buildMissionCatalog(yearGroups),
        auditRecords,
        evidence: [{
            id: 'alpha-desktop-before',
            missionId: 'alpha',
            capturedAt: '2026-07-26T12:00:00.000Z',
            device: 'desktop',
            viewport: { width: 1440, height: 1000 },
            evidenceType: 'OBJECTIVE',
            beforeImage: '/screenshots/alpha.webp',
            afterImage: null,
            references: {
                mission: '/dev/mission-preview?mission=alpha',
                test: null,
                code: null,
                pullRequest: null,
            },
            findings: [],
        }],
    }).missions;

    assert.equal(getEvidenceLabel(withBrowserEvidence.find(mission => mission.id === 'alpha')!), 'Browserbewijs');
    assert.equal(getEvidenceLabel(withBrowserEvidence.find(mission => mission.id === 'beta')!), 'Statisch beoordeeld');
    assert.equal(getEvidenceLabel(withBrowserEvidence.find(mission => mission.id === 'gamma')!), 'Niet beoordeeld');
});

test('maakt stabiele sleutels voor afzonderlijke menselijke beslissingen', () => {
    assert.equal(getDecisionKey('pitch-police', 0), 'pitch-police:escalation:0');
    assert.equal(getDecisionKey('pitch-police', 1), 'pitch-police:escalation:1');
});

test('houdt een zichtbare selectie vast en kiest anders het eerste resultaat', () => {
    const missions = reconcileMissionQuality({
        catalog: buildMissionCatalog(yearGroups),
        auditRecords,
        evidence: [],
    }).missions;

    assert.equal(resolveSelectedMissionId(missions, 'beta'), 'beta');
    assert.equal(resolveSelectedMissionId(missions, 'niet-zichtbaar'), 'alpha');
    assert.equal(resolveSelectedMissionId([], 'alpha'), null);
});

test('berekent besluitvoortgang alleen uit geldige beslispunten van de missie', () => {
    const decisions: MissionQualityDecisionMap = {
        [getDecisionKey('alpha', 0)]: {
            status: 'approved',
            decidedAt: '2026-07-26T13:00:00.000Z',
        },
        [getDecisionKey('andere-missie', 0)]: {
            status: 'changes_requested',
            decidedAt: '2026-07-26T13:05:00.000Z',
        },
    };

    assert.deepEqual(getMissionDecisionProgress(auditRecords[0], decisions), {
        total: 2,
        reviewed: 1,
        approved: 1,
        changesRequested: 0,
    });
});

test('past één beslissing immutabel toe of zet haar terug naar open', () => {
    const initial: MissionQualityDecisionMap = {
        'alpha:escalation:1': {
            status: 'changes_requested',
            decidedAt: '2026-07-26T12:00:00.000Z',
        },
    };
    const approved = applyMissionQualityDecision(
        initial,
        'alpha:escalation:0',
        'approved',
        '2026-07-26T13:00:00.000Z',
    );

    assert.notEqual(approved, initial);
    assert.equal(initial['alpha:escalation:0'], undefined);
    assert.deepEqual(approved['alpha:escalation:0'], {
        status: 'approved',
        decidedAt: '2026-07-26T13:00:00.000Z',
    });
    assert.deepEqual(
        applyMissionQualityDecision(approved, 'alpha:escalation:0', null),
        initial,
    );
});
