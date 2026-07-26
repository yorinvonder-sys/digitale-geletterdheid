export type AuditStatus = 'blocked' | 'fixed' | 'missing';
export type AuditRecordStatus = Exclude<AuditStatus, 'missing'>;
export type PriorityBand = 'high' | 'medium' | 'low';
export type EvidenceType = 'OBJECTIVE' | 'SIMULATION' | 'INFERENCE';
export type DecisionStatus = 'approved' | 'changes_requested';

export interface CurriculumPeriodLike {
    title: string;
    missions: string[];
    reviewMissions?: string[];
}

export interface CurriculumYearLike {
    periods: Record<number | string, CurriculumPeriodLike>;
}

export type CurriculumYearGroupsLike = Record<number | string, CurriculumYearLike>;

export interface MissionCatalogEntry {
    id: string;
    title: string;
    yearGroup: number;
    period: number;
    periodTitle: string;
    isReview: boolean;
    order: number;
}

export interface ReviewScores {
    uiux?: number;
    didactiek?: number;
    tech?: number;
}

export interface AuditRecord {
    missionId: string;
    templateType?: string;
    priorityBand?: PriorityBand;
    lastReviewed?: string;
    reviewStatus: AuditRecordStatus;
    reportPath?: string;
    openEscalations: string[];
    escalationCount: number;
    reviewScores?: ReviewScores;
    triageScore?: number;
    topIssues?: string[];
    statusNote?: string;
    codexVerdict?: string | null;
    autoFixesApplied?: number;
    proposedFixes?: number;
    [key: string]: unknown;
}

export interface EvidenceAnnotation {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    shape?: 'rectangle' | 'circle';
}

export interface EvidenceFinding {
    id: string;
    title: string;
    category: 'TECHNICAL' | 'USABILITY' | 'LANGUAGE' | 'DIDACTICS' | 'RESILIENCE';
    severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OBSERVATION';
    description: string;
    learnerImpact: string;
    recommendedFix: string;
    personas: string[];
    requiresHumanValidation: boolean;
    annotations: EvidenceAnnotation[];
}

export interface MissionEvidence {
    id: string;
    missionId: string;
    capturedAt: string;
    device: string;
    viewport: {
        width: number;
        height: number;
    };
    evidenceType: EvidenceType;
    beforeImage: string | null;
    afterImage: string | null;
    findings: EvidenceFinding[];
}

export interface MissionQualityDecision {
    status: DecisionStatus;
    decidedAt: string;
    note?: string;
}

export type MissionQualityDecisionMap = Record<string, MissionQualityDecision>;

export interface MissionQualityRecord extends MissionCatalogEntry {
    audit: AuditRecord | null;
    auditStatus: AuditStatus;
    priorityBand: PriorityBand | 'unknown';
    evidence: MissionEvidence[];
}

export interface MissionQualityReconciliation {
    missions: MissionQualityRecord[];
    auditRecords: AuditRecord[];
    supplementalAuditRecords: AuditRecord[];
    missingAuditMissionIds: string[];
    sourceWarnings: string[];
}

export interface MissionQualitySummary {
    curriculumTotal: number;
    matchedAuditCount: number;
    auditRecordTotal: number;
    blockedAuditRecordCount: number;
    fixedAuditRecordCount: number;
    missingAuditCount: number;
    supplementalAuditCount: number;
    openDecisionCount: number;
    reviewedDecisionCount: number;
    approvedDecisionCount: number;
    changesRequestedCount: number;
    browserEvidenceMissionCount: number;
}

export interface MissionQualityFilters {
    query?: string;
    yearGroup?: number | 'all';
    period?: number | 'all';
    auditStatus?: AuditStatus | 'all';
    priorityBand?: PriorityBand | 'unknown' | 'all';
}

function formatMissionTitle(missionId: string): string {
    return missionId
        .split('-')
        .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(' ');
}

function numericEntries<T>(record: Record<number | string, T>): Array<[number, T]> {
    return Object.entries(record)
        .map(([key, value]) => [Number(key), value] as [number, T])
        .filter(([key]) => Number.isFinite(key))
        .sort(([left], [right]) => left - right);
}

export function buildMissionCatalog(
    yearGroups: CurriculumYearGroupsLike,
    titleById: Record<string, string> = {},
): MissionCatalogEntry[] {
    const catalog: MissionCatalogEntry[] = [];
    const seen = new Set<string>();

    for (const [yearGroup, year] of numericEntries(yearGroups)) {
        for (const [period, periodConfig] of numericEntries(year.periods)) {
            const entries = [
                ...periodConfig.missions.map(id => ({ id, isReview: false })),
                ...(periodConfig.reviewMissions || []).map(id => ({ id, isReview: true })),
            ];

            for (const entry of entries) {
                if (seen.has(entry.id)) {
                    throw new Error(`Dubbele missie-id in curriculum: ${entry.id}`);
                }
                seen.add(entry.id);
                catalog.push({
                    id: entry.id,
                    title: titleById[entry.id] || formatMissionTitle(entry.id),
                    yearGroup,
                    period,
                    periodTitle: periodConfig.title,
                    isReview: entry.isReview,
                    order: catalog.length,
                });
            }
        }
    }

    return catalog;
}

export function reconcileMissionQuality({
    catalog,
    auditRecords,
    evidence,
}: {
    catalog: MissionCatalogEntry[];
    auditRecords: AuditRecord[];
    evidence: MissionEvidence[];
}): MissionQualityReconciliation {
    const auditByMission = new Map<string, AuditRecord>();
    for (const record of auditRecords) {
        if (auditByMission.has(record.missionId)) {
            throw new Error(`Dubbel auditrecord: ${record.missionId}`);
        }
        auditByMission.set(record.missionId, record);
    }

    const evidenceByMission = new Map<string, MissionEvidence[]>();
    for (const item of evidence) {
        const missionEvidence = evidenceByMission.get(item.missionId) || [];
        missionEvidence.push(item);
        evidenceByMission.set(item.missionId, missionEvidence);
    }

    const catalogIds = new Set(catalog.map(mission => mission.id));
    const missingAuditMissionIds = catalog
        .filter(mission => !auditByMission.has(mission.id))
        .map(mission => mission.id);
    const supplementalAuditRecords = auditRecords
        .filter(record => !catalogIds.has(record.missionId));
    const sourceWarnings: string[] = [];

    if (missingAuditMissionIds.length > 0) {
        sourceWarnings.push(
            `${missingAuditMissionIds.length} actuele missie(s) missen een auditrecord: ${missingAuditMissionIds.join(', ')}.`,
        );
    }
    if (supplementalAuditRecords.length > 0) {
        sourceWarnings.push(
            `${supplementalAuditRecords.length} auditrecord(s) staan buiten het actuele curriculum: ${supplementalAuditRecords.map(record => record.missionId).join(', ')}.`,
        );
    }

    for (const record of auditRecords) {
        if (record.escalationCount !== record.openEscalations.length) {
            sourceWarnings.push(
                `${record.missionId}: escalationCount ${record.escalationCount} wijkt af van ${record.openEscalations.length} open beslispunt(en).`,
            );
        }
    }

    const missions = catalog.map<MissionQualityRecord>(mission => {
        const audit = auditByMission.get(mission.id) || null;
        return {
            ...mission,
            audit,
            auditStatus: audit?.reviewStatus || 'missing',
            priorityBand: audit?.priorityBand || 'unknown',
            evidence: evidenceByMission.get(mission.id) || [],
        };
    });

    return {
        missions,
        auditRecords,
        supplementalAuditRecords,
        missingAuditMissionIds,
        sourceWarnings,
    };
}

export function filterMissionQuality(
    missions: MissionQualityRecord[],
    filters: MissionQualityFilters,
): MissionQualityRecord[] {
    const query = filters.query?.trim().toLocaleLowerCase('nl-NL') || '';

    return missions.filter(mission => {
        if (query) {
            const haystack = [
                mission.id,
                mission.title,
                mission.periodTitle,
                mission.audit?.templateType,
                ...(mission.audit?.topIssues || []),
            ]
                .filter(Boolean)
                .join(' ')
                .toLocaleLowerCase('nl-NL');
            if (!haystack.includes(query)) return false;
        }
        if (filters.yearGroup && filters.yearGroup !== 'all' && mission.yearGroup !== filters.yearGroup) {
            return false;
        }
        if (filters.period && filters.period !== 'all' && mission.period !== filters.period) {
            return false;
        }
        if (filters.auditStatus && filters.auditStatus !== 'all' && mission.auditStatus !== filters.auditStatus) {
            return false;
        }
        if (filters.priorityBand && filters.priorityBand !== 'all' && mission.priorityBand !== filters.priorityBand) {
            return false;
        }
        return true;
    });
}

const STATUS_ORDER: Record<AuditStatus, number> = {
    blocked: 0,
    fixed: 1,
    missing: 2,
};

const PRIORITY_ORDER: Record<MissionQualityRecord['priorityBand'], number> = {
    high: 0,
    medium: 1,
    low: 2,
    unknown: 3,
};

export function sortMissionQuality(missions: MissionQualityRecord[]): MissionQualityRecord[] {
    return [...missions].sort((left, right) => (
        STATUS_ORDER[left.auditStatus] - STATUS_ORDER[right.auditStatus]
        || PRIORITY_ORDER[left.priorityBand] - PRIORITY_ORDER[right.priorityBand]
        || (right.audit?.triageScore || 0) - (left.audit?.triageScore || 0)
        || left.order - right.order
    ));
}

export function getDecisionKey(missionId: string, escalationIndex: number): string {
    return `${missionId}:escalation:${escalationIndex}`;
}

export function summarizeMissionQuality(
    quality: MissionQualityReconciliation,
    decisions: MissionQualityDecisionMap = {},
): MissionQualitySummary {
    const validDecisionKeys = new Set(
        quality.auditRecords.flatMap(record => (
            record.openEscalations.map((_, index) => getDecisionKey(record.missionId, index))
        )),
    );
    const reviewedDecisions = Object.entries(decisions)
        .filter(([key, decision]) => validDecisionKeys.has(key) && Boolean(decision?.status));

    return {
        curriculumTotal: quality.missions.length,
        matchedAuditCount: quality.missions.filter(mission => mission.audit !== null).length,
        auditRecordTotal: quality.auditRecords.length,
        blockedAuditRecordCount: quality.auditRecords.filter(record => record.reviewStatus === 'blocked').length,
        fixedAuditRecordCount: quality.auditRecords.filter(record => record.reviewStatus === 'fixed').length,
        missingAuditCount: quality.missingAuditMissionIds.length,
        supplementalAuditCount: quality.supplementalAuditRecords.length,
        openDecisionCount: quality.auditRecords.reduce(
            (total, record) => total + record.openEscalations.length,
            0,
        ),
        reviewedDecisionCount: reviewedDecisions.length,
        approvedDecisionCount: reviewedDecisions.filter(([, decision]) => decision.status === 'approved').length,
        changesRequestedCount: reviewedDecisions.filter(([, decision]) => decision.status === 'changes_requested').length,
        browserEvidenceMissionCount: new Set(
            quality.missions
                .filter(mission => mission.evidence.length > 0)
                .map(mission => mission.id),
        ).size,
    };
}

export function getEvidenceLabel(mission: MissionQualityRecord): string {
    if (mission.evidence.length > 0) return 'Browserbewijs';
    if (mission.audit) return 'Statisch beoordeeld';
    return 'Niet beoordeeld';
}
