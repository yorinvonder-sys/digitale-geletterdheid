import type {
    AuditRecord,
    EvidenceAnnotation,
    EvidenceFinding,
    MissionEvidence,
} from './missionQualityModel';

type UnknownRecord = Record<string, unknown>;

const AUDIT_STATUSES = new Set(['blocked', 'fixed']);
const PRIORITY_BANDS = new Set(['high', 'medium', 'low']);
const EVIDENCE_TYPES = new Set(['OBJECTIVE', 'SIMULATION', 'INFERENCE']);
const FINDING_CATEGORIES = new Set(['TECHNICAL', 'USABILITY', 'LANGUAGE', 'DIDACTICS', 'RESILIENCE']);
const FINDING_SEVERITIES = new Set(['BLOCKER', 'HIGH', 'MEDIUM', 'LOW', 'OBSERVATION']);

function asObject(value: unknown, path: string): UnknownRecord {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${path} moet een object zijn.`);
    }
    return value as UnknownRecord;
}

function asString(value: unknown, path: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`${path} moet een niet-lege string zijn.`);
    }
    return value;
}

function asOptionalString(value: unknown, path: string): string | undefined {
    if (value === undefined || value === null) return undefined;
    return asString(value, path);
}

function asNullableString(value: unknown, path: string): string | null {
    if (value === null) return null;
    return asString(value, path);
}

function asStringArray(value: unknown, path: string): string[] {
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
        throw new Error(`${path} moet een lijst met strings zijn.`);
    }
    return value as string[];
}

function asFiniteNumber(value: unknown, path: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`${path} moet een eindig getal zijn.`);
    }
    return value;
}

function asBoolean(value: unknown, path: string): boolean {
    if (typeof value !== 'boolean') {
        throw new Error(`${path} moet true of false zijn.`);
    }
    return value;
}

function parseAnnotation(value: unknown, path: string): EvidenceAnnotation {
    const annotation = asObject(value, path);
    const x = asFiniteNumber(annotation.x, `${path}.x`);
    const y = asFiniteNumber(annotation.y, `${path}.y`);
    const width = asFiniteNumber(annotation.width, `${path}.width`);
    const height = asFiniteNumber(annotation.height, `${path}.height`);

    for (const [field, coordinate] of Object.entries({ x, y, width, height })) {
        if (coordinate < 0 || coordinate > 100) {
            throw new Error(`${path}.${field} moet tussen 0 en 100 liggen.`);
        }
    }
    if (x + width > 100 || y + height > 100) {
        throw new Error(`${path} valt buiten het beeldvlak.`);
    }

    const shape = annotation.shape === undefined ? undefined : asString(annotation.shape, `${path}.shape`);
    if (shape !== undefined && shape !== 'rectangle' && shape !== 'circle') {
        throw new Error(`${path}.shape moet rectangle of circle zijn.`);
    }

    return {
        id: asFiniteNumber(annotation.id, `${path}.id`),
        x,
        y,
        width,
        height,
        label: asString(annotation.label, `${path}.label`),
        shape,
    };
}

function parseFinding(value: unknown, path: string): EvidenceFinding {
    const finding = asObject(value, path);
    const category = asString(finding.category, `${path}.category`);
    const severity = asString(finding.severity, `${path}.severity`);
    if (!FINDING_CATEGORIES.has(category)) {
        throw new Error(`${path}.category is onbekend: ${category}.`);
    }
    if (!FINDING_SEVERITIES.has(severity)) {
        throw new Error(`${path}.severity is onbekend: ${severity}.`);
    }
    if (!Array.isArray(finding.annotations)) {
        throw new Error(`${path}.annotations moet een lijst zijn.`);
    }

    return {
        id: asString(finding.id, `${path}.id`),
        title: asString(finding.title, `${path}.title`),
        category: category as EvidenceFinding['category'],
        severity: severity as EvidenceFinding['severity'],
        description: asString(finding.description, `${path}.description`),
        learnerImpact: asString(finding.learnerImpact, `${path}.learnerImpact`),
        recommendedFix: asString(finding.recommendedFix, `${path}.recommendedFix`),
        personas: asStringArray(finding.personas, `${path}.personas`),
        requiresHumanValidation: asBoolean(
            finding.requiresHumanValidation,
            `${path}.requiresHumanValidation`,
        ),
        annotations: finding.annotations.map((annotation, index) => (
            parseAnnotation(annotation, `${path}.annotations[${index}]`)
        )),
    };
}

function parseEvidenceItem(value: unknown, path: string): MissionEvidence {
    const item = asObject(value, path);
    const viewport = asObject(item.viewport, `${path}.viewport`);
    const evidenceType = asString(item.evidenceType, `${path}.evidenceType`);
    if (!EVIDENCE_TYPES.has(evidenceType)) {
        throw new Error(`${path}.evidenceType is onbekend: ${evidenceType}.`);
    }
    if (!Array.isArray(item.findings)) {
        throw new Error(`${path}.findings moet een lijst zijn.`);
    }

    const beforeImage = asNullableString(item.beforeImage, `${path}.beforeImage`);
    const afterImage = asNullableString(item.afterImage, `${path}.afterImage`);
    if (!beforeImage && !afterImage) {
        throw new Error(`${path}.beforeImage en ${path}.afterImage mogen niet allebei leeg zijn.`);
    }

    const width = asFiniteNumber(viewport.width, `${path}.viewport.width`);
    const height = asFiniteNumber(viewport.height, `${path}.viewport.height`);
    if (width <= 0 || height <= 0) {
        throw new Error(`${path}.viewport moet positieve afmetingen hebben.`);
    }

    return {
        id: asString(item.id, `${path}.id`),
        missionId: asString(item.missionId, `${path}.missionId`),
        capturedAt: asString(item.capturedAt, `${path}.capturedAt`),
        device: asString(item.device, `${path}.device`),
        viewport: { width, height },
        evidenceType: evidenceType as MissionEvidence['evidenceType'],
        beforeImage,
        afterImage,
        findings: item.findings.map((finding, index) => (
            parseFinding(finding, `${path}.findings[${index}]`)
        )),
    };
}

export function parseAuditRecords(value: unknown): AuditRecord[] {
    if (!Array.isArray(value)) {
        throw new Error('Auditbron moet een lijst zijn.');
    }

    return value.map((item, index) => {
        const path = `audit[${index}]`;
        const record = asObject(item, path);
        const reviewStatus = asString(record.reviewStatus, `${path}.reviewStatus`);
        if (!AUDIT_STATUSES.has(reviewStatus)) {
            throw new Error(`${path}.reviewStatus is onbekend: ${reviewStatus}.`);
        }
        const priorityBand = asOptionalString(record.priorityBand, `${path}.priorityBand`);
        if (priorityBand !== undefined && !PRIORITY_BANDS.has(priorityBand)) {
            throw new Error(`${path}.priorityBand is onbekend: ${priorityBand}.`);
        }
        const escalationCount = asFiniteNumber(record.escalationCount, `${path}.escalationCount`);
        if (!Number.isInteger(escalationCount) || escalationCount < 0) {
            throw new Error(`${path}.escalationCount moet een positief geheel getal zijn.`);
        }

        return {
            ...record,
            missionId: asString(record.missionId, `${path}.missionId`),
            reviewStatus: reviewStatus as AuditRecord['reviewStatus'],
            priorityBand: priorityBand as AuditRecord['priorityBand'],
            openEscalations: asStringArray(record.openEscalations, `${path}.openEscalations`),
            escalationCount,
        } as AuditRecord;
    });
}

export function parseEvidenceSource(value: unknown): MissionEvidence[] {
    const source = asObject(value, 'evidence');
    if (source.schemaVersion !== 1) {
        throw new Error('evidence.schemaVersion moet 1 zijn.');
    }
    if (!Array.isArray(source.items)) {
        throw new Error('evidence.items moet een lijst zijn.');
    }
    return source.items.map((item, index) => parseEvidenceItem(item, `evidence.items[${index}]`));
}
