import type { ContainerConfig } from '@/config/containerTypes';

export type ProjectWeekNumber = number;

const FALLBACK_PROJECT_WEEK_BY_MONTH: Record<number, ProjectWeekNumber> = {
    0: 2,
    1: 2,
    2: 2,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 4,
    8: 1,
    9: 1,
    10: 1,
    11: 2,
};

function toLocalDateNumber(date: Date): number {
    return (date.getFullYear() * 10000) + ((date.getMonth() + 1) * 100) + date.getDate();
}

function parseIsoDateNumber(value?: string): number | null {
    if (!value) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    return (year * 10000) + (month * 100) + day;
}

function isDateInsideContainer(dateNumber: number, container: Pick<ContainerConfig, 'startDate' | 'endDate'>): boolean {
    const startDate = parseIsoDateNumber(container.startDate);
    const endDate = parseIsoDateNumber(container.endDate);

    if (startDate === null && endDate === null) return false;
    if (startDate !== null && dateNumber < startDate) return false;
    if (endDate !== null && dateNumber > endDate) return false;

    return true;
}

function sortContainersByOrder<T extends Pick<ContainerConfig, 'sortOrder'>>(containers: T[]): T[] {
    return [...containers].sort((a, b) => a.sortOrder - b.sortOrder);
}

function clampProjectWeekToContainers(projectWeek: ProjectWeekNumber, containers: Pick<ContainerConfig, 'sortOrder'>[]): ProjectWeekNumber {
    if (containers.length === 0) return projectWeek;
    return Math.min(Math.max(projectWeek, 1), containers.length);
}

export function getFallbackProjectWeekForDate(date: Date = new Date()): ProjectWeekNumber {
    return FALLBACK_PROJECT_WEEK_BY_MONTH[date.getMonth()] ?? 1;
}

export function getProjectWeekForDate(
    date: Date = new Date(),
    containers: Pick<ContainerConfig, 'sortOrder' | 'startDate' | 'endDate'>[] = []
): ProjectWeekNumber {
    const sortedContainers = sortContainersByOrder(containers);
    const dateNumber = toLocalDateNumber(date);
    const datedContainerIndex = sortedContainers.findIndex(container => isDateInsideContainer(dateNumber, container));

    if (datedContainerIndex >= 0) {
        return datedContainerIndex + 1;
    }

    return clampProjectWeekToContainers(getFallbackProjectWeekForDate(date), sortedContainers);
}
