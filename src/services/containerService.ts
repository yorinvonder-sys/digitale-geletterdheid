import { supabase } from './supabase';
import type { ContainerConfig, ContainerMissionConfig, SchedulingTemplate } from '@/config/containerTypes';
import { CURRICULUM } from '@/config/curriculum';
import { toServiceError } from '@/utils/errorMessages';
import {
    DEFAULT_PERIOD_COLOR_KEYS,
    DEFAULT_PERIOD_ICON_KEYS,
} from '@/config/containerThemes';
import { getMissionsForYear } from '@/config/missions';

// De tabellen school_containers en school_container_missions zijn nog niet in de
// gegenereerde database.types.ts (migratie nog niet applied). Cast naar any tot
// de types geregenereerd zijn na `supabase gen types typescript`.
/* eslint-disable @typescript-eslint/no-explicit-any */
const fromContainers = (): any => supabase.from('school_containers' as any);
const fromContainerMissions = (): any => supabase.from('school_container_missions' as any);
/* eslint-enable @typescript-eslint/no-explicit-any */

// ============================================================================
// Public API
// ============================================================================

export interface SchoolContainersResult {
    model: 'default' | 'custom';
    containers: ContainerConfig[];
}

export async function getContainersForSchool(
    schoolId: string,
    yearGroup: number
): Promise<SchoolContainersResult> {
    const { data, error } = await supabase
        .from('school_configs')
        .select('*')
        .eq('school_id', schoolId)
        .single();

    const model = (data as any)?.scheduling_model;
    if (error || !data || !model || model === 'default') {
        return { model: 'default', containers: defaultCurriculumToContainers(schoolId, yearGroup) };
    }

    return { model: 'custom', containers: await fetchCustomContainers(schoolId, yearGroup) };
}

export async function createContainer(
    schoolId: string,
    yearGroup: number,
    data: Partial<ContainerConfig>
): Promise<ContainerConfig> {
    const { data: row, error } = await fromContainers()
        .insert({
            school_id: schoolId,
            year_group: yearGroup,
            sort_order: data.sortOrder ?? 0,
            label: data.label ?? '',
            subtitle: data.subtitle ?? null,
            container_type: data.containerType ?? 'period',
            slo_focus: data.sloFocus ?? [],
            slo_focus_vso: data.sloFocusVso ?? null,
            color_key: data.colorKey ?? null,
            icon_key: data.iconKey ?? null,
            start_date: data.startDate ?? null,
            end_date: data.endDate ?? null,
            is_review_gate: data.isReviewGate ?? false,
            assessment_id: data.assessmentId ?? null,
            metadata: data.metadata ?? {},
        })
        .select()
        .single();

    if (error || !row) throw toServiceError('Container aanmaken', error ?? new Error('createContainer failed'));

    return mapContainerRow(row, []);
}

export async function updateContainer(
    containerId: string,
    data: Partial<ContainerConfig>
): Promise<void> {
    const patch: Record<string, unknown> = {};
    if (data.label !== undefined) patch.label = data.label;
    if (data.subtitle !== undefined) patch.subtitle = data.subtitle;
    if (data.containerType !== undefined) patch.container_type = data.containerType;
    if (data.sloFocus !== undefined) patch.slo_focus = data.sloFocus;
    if (data.sloFocusVso !== undefined) patch.slo_focus_vso = data.sloFocusVso;
    if (data.colorKey !== undefined) patch.color_key = data.colorKey;
    if (data.iconKey !== undefined) patch.icon_key = data.iconKey;
    if (data.startDate !== undefined) patch.start_date = data.startDate;
    if (data.endDate !== undefined) patch.end_date = data.endDate;
    if (data.isReviewGate !== undefined) patch.is_review_gate = data.isReviewGate;
    if (data.assessmentId !== undefined) patch.assessment_id = data.assessmentId;
    if (data.metadata !== undefined) patch.metadata = data.metadata;
    if (data.sortOrder !== undefined) patch.sort_order = data.sortOrder;

    const { error } = await fromContainers()
        .update(patch)
        .eq('id', containerId);

    if (error) throw toServiceError('Container bijwerken', error);
}

export async function deleteContainer(containerId: string): Promise<void> {
    const { error } = await fromContainers()
        .delete()
        .eq('id', containerId);

    if (error) throw toServiceError('Container verwijderen', error);
}

export async function reorderContainers(
    schoolId: string,
    yearGroup: number,
    containerIds: string[]
): Promise<void> {
    const updates = containerIds.map((id, index) =>
        fromContainers()
            .update({ sort_order: index })
            .eq('id', id)
            .eq('school_id', schoolId)
            .eq('year_group', yearGroup)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);
    if (failed?.error) throw toServiceError('Containers herordenen', failed.error);
}

export async function assignMissionToContainer(
    containerId: string,
    missionId: string,
    sortOrder: number,
    isReview = false
): Promise<void> {
    const { error } = await fromContainerMissions()
        .upsert(
            { container_id: containerId, mission_id: missionId, sort_order: sortOrder, is_review: isReview },
            { onConflict: 'container_id,mission_id' }
        );

    if (error) throw toServiceError('Missie koppelen aan container', error);
}

export async function removeMissionFromContainer(
    containerId: string,
    missionId: string
): Promise<void> {
    const { error } = await fromContainerMissions()
        .delete()
        .eq('container_id', containerId)
        .eq('mission_id', missionId);

    if (error) throw toServiceError('Missie ontkoppelen van container', error);
}

export async function reorderContainerMissions(
    containerId: string,
    missionIds: string[]
): Promise<void> {
    const updates = missionIds.map((missionId, index) =>
        fromContainerMissions()
            .update({ sort_order: index })
            .eq('container_id', containerId)
            .eq('mission_id', missionId)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);
    if (failed?.error) throw toServiceError('Missies herordenen', failed.error);
}

export async function seedDefaultContainersForSchool(
    schoolId: string,
    yearGroup: number
): Promise<void> {
    const yearConfig = CURRICULUM.yearGroups[yearGroup];
    if (!yearConfig) return;

    for (const [periodStr, periodConfig] of Object.entries(yearConfig.periods)) {
        const period = Number(periodStr);

        const { data: containerRow, error: containerError } = await fromContainers()
            .insert({
                school_id: schoolId,
                year_group: yearGroup,
                sort_order: period - 1,
                label: periodConfig.title,
                subtitle: periodConfig.subtitle,
                container_type: 'period',
                slo_focus: periodConfig.sloFocus,
                slo_focus_vso: periodConfig.sloFocusVso ?? null,
                color_key: DEFAULT_PERIOD_COLOR_KEYS[period] ?? null,
                icon_key: DEFAULT_PERIOD_ICON_KEYS[period] ?? null,
                start_date: null,
                end_date: null,
                is_review_gate: false,
                assessment_id: periodConfig.assessmentId ?? null,
                metadata: {},
            })
            .select('id')
            .single();

        if (containerError || !containerRow) continue;

        const containerId = containerRow.id;
        const missionRows = [
            ...periodConfig.missions.map((missionId, index) => ({
                container_id: containerId,
                mission_id: missionId,
                sort_order: index,
                is_review: false,
            })),
            ...(periodConfig.reviewMissions ?? []).map((missionId, index) => ({
                container_id: containerId,
                mission_id: missionId,
                sort_order: periodConfig.missions.length + index,
                is_review: true,
            })),
        ];

        if (missionRows.length > 0) {
            await fromContainerMissions().insert(missionRows);
        }
    }

    await supabase
        .from('school_configs')
        .update({ scheduling_model: 'custom' } as any)
        .eq('school_id', schoolId);
}

export async function seedTemplateContainersForSchool(
    schoolId: string,
    yearGroup: number,
    template: SchedulingTemplate
): Promise<void> {
    if (template.id === 'four-periods') {
        await seedDefaultContainersForSchool(schoolId, yearGroup);
        return;
    }

    const missions = getMissionsForYear(yearGroup);
    const count = template.defaultContainerCount;
    const perContainer = Math.max(1, Math.ceil(missions.length / count));

    for (let i = 0; i < count; i++) {
        const label = template.labelPattern.replace('{n}', String(i + 1));

        const { data: containerRow, error: containerError } = await fromContainers()
            .insert({
                school_id: schoolId,
                year_group: yearGroup,
                sort_order: i,
                label,
                subtitle: null,
                container_type: template.containerType,
                slo_focus: [],
                slo_focus_vso: null,
                color_key: null,
                icon_key: null,
                start_date: null,
                end_date: null,
                is_review_gate: false,
                assessment_id: null,
                metadata: {},
            })
            .select('id')
            .single();

        if (containerError || !containerRow) continue;

        const containerId = containerRow.id;
        const missionRows = missions
            .map((m, j) => ({ mission: m, containerIndex: Math.min(count - 1, Math.floor(j / perContainer)), sortOrder: j % perContainer }))
            .filter(entry => entry.containerIndex === i)
            .map(entry => ({
                container_id: containerId,
                mission_id: entry.mission.id,
                sort_order: entry.sortOrder,
                is_review: false,
            }));

        if (missionRows.length > 0) {
            await fromContainerMissions().insert(missionRows);
        }
    }

    await supabase
        .from('school_configs')
        .update({ scheduling_model: 'custom' } as any)
        .eq('school_id', schoolId);
}

export async function resetToDefaultScheduling(schoolId: string): Promise<void> {
    const { error: deleteError } = await fromContainers()
        .delete()
        .eq('school_id', schoolId);

    if (deleteError) throw toServiceError('Containers verwijderen', deleteError);

    const { error: updateError } = await supabase
        .from('school_configs')
        .update({ scheduling_model: 'default' } as any)
        .eq('school_id', schoolId);

    if (updateError) throw toServiceError('Rooster resetten', updateError);
}

// ============================================================================
// Private helpers
// ============================================================================

function defaultCurriculumToContainers(
    schoolId: string,
    yearGroup: number
): ContainerConfig[] {
    const yearConfig = CURRICULUM.yearGroups[yearGroup];
    if (!yearConfig) return [];

    return Object.entries(yearConfig.periods).map(([periodStr, periodConfig]) => {
        const period = Number(periodStr);

        const missions: ContainerMissionConfig[] = [
            ...periodConfig.missions.map((missionId, index) => ({
                missionId,
                sortOrder: index,
                isReview: false,
                isRequired: true,
            })),
            ...(periodConfig.reviewMissions ?? []).map((missionId, index) => ({
                missionId,
                sortOrder: periodConfig.missions.length + index,
                isReview: true,
                isRequired: false,
            })),
        ];

        return {
            id: `default-${yearGroup}-${period}`,
            schoolId,
            yearGroup,
            sortOrder: period - 1,
            label: periodConfig.title,
            subtitle: periodConfig.subtitle,
            containerType: 'period' as const,
            sloFocus: periodConfig.sloFocus,
            sloFocusVso: periodConfig.sloFocusVso,
            colorKey: DEFAULT_PERIOD_COLOR_KEYS[period],
            iconKey: DEFAULT_PERIOD_ICON_KEYS[period],
            startDate: undefined,
            endDate: undefined,
            isReviewGate: false,
            assessmentId: periodConfig.assessmentId,
            metadata: {},
            missions,
        };
    });
}

async function fetchCustomContainers(
    schoolId: string,
    yearGroup: number
): Promise<ContainerConfig[]> {
    const { data: containers, error: containersError } = await fromContainers()
        .select('*')
        .eq('school_id', schoolId)
        .eq('year_group', yearGroup)
        .order('sort_order');

    if (containersError || !containers) return [];

    const containerIds = containers.map(c => c.id);
    if (containerIds.length === 0) return [];

    const { data: missionRows, error: missionsError } = await fromContainerMissions()
        .select('*')
        .in('container_id', containerIds)
        .order('sort_order');

    const missionsByContainer = new Map<string, ContainerMissionConfig[]>();
    if (!missionsError && missionRows) {
        for (const row of missionRows) {
            const list = missionsByContainer.get(row.container_id) ?? [];
            list.push({
                missionId: row.mission_id,
                sortOrder: row.sort_order,
                isReview: row.is_review ?? false,
                isRequired: row.is_required ?? true,
            });
            missionsByContainer.set(row.container_id, list);
        }
    }

    return containers.map(row =>
        mapContainerRow(row, missionsByContainer.get(row.id) ?? [])
    );
}

function mapContainerRow(row: any, missions: ContainerMissionConfig[]): ContainerConfig {
    return {
        id: row.id,
        schoolId: row.school_id,
        yearGroup: row.year_group,
        sortOrder: row.sort_order,
        label: row.label,
        subtitle: row.subtitle ?? undefined,
        containerType: row.container_type,
        sloFocus: row.slo_focus ?? [],
        sloFocusVso: row.slo_focus_vso ?? undefined,
        colorKey: row.color_key ?? undefined,
        iconKey: row.icon_key ?? undefined,
        startDate: row.start_date ?? undefined,
        endDate: row.end_date ?? undefined,
        isReviewGate: row.is_review_gate ?? false,
        assessmentId: row.assessment_id ?? undefined,
        metadata: row.metadata ?? {},
        missions,
    };
}
