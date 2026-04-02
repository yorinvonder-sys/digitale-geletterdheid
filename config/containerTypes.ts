// Typen en planningssjablonen voor het flexibele container-systeem
// Containers zijn de planningseenheden waarbinnen missies worden geordend
// (bijv. periodes, projectweken, weeklessen)

import type { SloKerndoelCode } from './sloKerndoelen';

export type ContainerType = 'period' | 'project_week' | 'weekly_lesson' | 'custom';
export type SchedulingModel = 'default' | 'custom';

export interface ContainerConfig {
    id: string;
    schoolId: string;
    yearGroup: number;
    sortOrder: number;
    label: string;
    subtitle?: string;
    containerType: ContainerType;
    sloFocus: SloKerndoelCode[];
    sloFocusVso?: SloKerndoelCode[];
    colorKey?: string;
    iconKey?: string;
    startDate?: string; // ISO datum (bijv. "2025-09-01")
    endDate?: string;
    isReviewGate: boolean;
    assessmentId?: string;
    metadata: Record<string, unknown>;
    missions: ContainerMissionConfig[];
}

export interface ContainerMissionConfig {
    missionId: string;
    sortOrder: number;
    isReview: boolean;
    isRequired: boolean;
}

export interface ContainerTheme {
    border: string;
    bg: string;
    text: string;
    iconKey: string;
    label: string;
}

export interface SchedulingTemplate {
    id: string;
    name: string;
    description: string;
    containerType: ContainerType;
    defaultContainerCount: number;
    labelPattern: string;
}

export const SCHEDULING_TEMPLATES: SchedulingTemplate[] = [
    {
        id: 'four-periods',
        name: '4 Periodes (standaard)',
        description: 'Het huidige model: 4 periodes van ~10 weken met thematische blokken.',
        containerType: 'period',
        defaultContainerCount: 4,
        labelPattern: 'Periode {n}',
    },
    {
        id: 'project-weeks',
        name: 'Projectweken',
        description: '4-6 intensieve projectweken van 1-2 weken verspreid over het jaar.',
        containerType: 'project_week',
        defaultContainerCount: 5,
        labelPattern: 'Projectweek {n}',
    },
    {
        id: 'weekly-lessons',
        name: 'Weeklessen',
        description: '1-2 uur per week gedurende het hele schooljaar (~40 weken).',
        containerType: 'weekly_lesson',
        defaultContainerCount: 40,
        labelPattern: 'Week {n}',
    },
    {
        id: 'custom',
        name: 'Aangepast',
        description: 'Maak je eigen structuur met een mix van periodes, weken en projecten.',
        containerType: 'custom',
        defaultContainerCount: 4,
        labelPattern: 'Blok {n}',
    },
];
