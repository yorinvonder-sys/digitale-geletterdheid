import evidenceSourceRaw from '../../../../business/dgskills-reviews/mission-quality-evidence.json?raw';
import auditSourceRaw from '../../../../business/dgskills-reviews/review-status.json?raw';

import { ROLES } from '@/config/agents';
import { CURRICULUM } from '@/config/curriculum';
import {
    buildMissionCatalog,
    reconcileMissionQuality,
    type MissionQualityReconciliation,
} from './missionQualityModel';
import {
    parseAuditRecords,
    parseEvidenceSource,
} from './missionQualitySources';

export type MissionQualityDataResult =
    | { data: MissionQualityReconciliation; error: null }
    | { data: null; error: string };

function loadMissionQualityData(): MissionQualityDataResult {
    try {
        const titleById = Object.fromEntries(
            ROLES.map(role => [role.id, role.title]),
        );
        const catalog = buildMissionCatalog(CURRICULUM.yearGroups, titleById);
        const auditRecords = parseAuditRecords(JSON.parse(auditSourceRaw));
        const evidence = parseEvidenceSource(JSON.parse(evidenceSourceRaw));

        return {
            data: reconcileMissionQuality({ catalog, auditRecords, evidence }),
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error
                ? error.message
                : 'De kwaliteitsbronnen konden niet worden gelezen.',
        };
    }
}

export const MISSION_QUALITY_DATA_RESULT = loadMissionQualityData();
