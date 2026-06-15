import type { ContainerConfig } from '@/config/containerTypes';

export type ProjectWeekNumber = 1 | 2 | 3 | 4;

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

function normalizeSortOrderToProjectWeek(sortOrder: number, containers: Pick<ContainerConfig, 'sortOrder'>[]): ProjectWeekNumber | null {
    const usesZeroBasedSortOrder = containers.some(container => container.sortOrder === 0);
    const candidate = usesZeroBasedSortOrder ? sortOrder + 1 : sortOrder;

    if (candidate < 1 || candidate > 4 || !Number.isInteger(candidate)) return null;

    return candidate as ProjectWeekNumber;
}

export function getFallbackProjectWeekForDate(date: Date = new Date()): ProjectWeekNumber {
    return FALLBACK_PROJECT_WEEK_BY_MONTH[date.getMonth()] ?? 1;
}

export function getProjectWeekForDate(
    date: Date = new Date(),
    containers: Pick<ContainerConfig, 'sortOrder' | 'startDate' | 'endDate'>[] = []
): ProjectWeekNumber {
    const dateNumber = toLocalDateNumber(date);
    const datedContainer = containers.find(container => isDateInsideContainer(dateNumber, container));

    if (datedContainer) {
        const projectWeek = normalizeSortOrderToProjectWeek(datedContainer.sortOrder, containers);
        if (projectWeek) return projectWeek;
    }

    return getFallbackProjectWeekForDate(date);
}
