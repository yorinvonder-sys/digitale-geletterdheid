import type { ClassroomConfig } from '../types';
import type { Database } from '../types/database.types';

type ClassroomConfigRow = Pick<
  Database['public']['Tables']['classroom_configs']['Row'],
  'id' | 'data'
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: keyof ClassroomConfig
): string | undefined {
  const value = source[key];
  return typeof value === 'string' ? value : undefined;
}

function readStringArray(
  source: Record<string, unknown>,
  key: keyof ClassroomConfig
): string[] | undefined {
  const value = source[key];
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === 'string');
  return strings.length > 0 ? strings : undefined;
}

export function createDefaultClassroomConfig(id: string): ClassroomConfig {
  return {
    id,
    focusMode: false,
  };
}

export function deserializeClassroomConfig(
  record: ClassroomConfigRow | null | undefined
): ClassroomConfig | null {
  if (!record?.id) return null;

  const data = isRecord(record.data) ? record.data : {};
  const minimumXpLevelValue = data.minimumXpLevel;

  return {
    id: record.id,
    schoolId: readString(data, 'schoolId'),
    focusMode: data.focusMode === true,
    focusMissionId: readString(data, 'focusMissionId'),
    focusMissionTitle: readString(data, 'focusMissionTitle'),
    pinnedMissionId: readString(data, 'pinnedMissionId'),
    activeAnnouncement: readString(data, 'activeAnnouncement'),
    lockedMissions: readStringArray(data, 'lockedMissions'),
    minimumXpLevel:
      typeof minimumXpLevelValue === 'number' && Number.isFinite(minimumXpLevelValue)
        ? minimumXpLevelValue
        : undefined,
  };
}

export function serializeClassroomConfig(config: ClassroomConfig): Record<string, unknown> {
  const data: Record<string, unknown> = {
    focusMode: config.focusMode === true,
  };

  if (config.schoolId) data.schoolId = config.schoolId;
  if (config.focusMissionId) data.focusMissionId = config.focusMissionId;
  if (config.focusMissionTitle) data.focusMissionTitle = config.focusMissionTitle;
  if (config.pinnedMissionId) data.pinnedMissionId = config.pinnedMissionId;
  if (config.activeAnnouncement) data.activeAnnouncement = config.activeAnnouncement;
  if (config.lockedMissions && config.lockedMissions.length > 0) {
    data.lockedMissions = config.lockedMissions;
  }
  if (typeof config.minimumXpLevel === 'number' && Number.isFinite(config.minimumXpLevel)) {
    data.minimumXpLevel = config.minimumXpLevel;
  }

  return data;
}
