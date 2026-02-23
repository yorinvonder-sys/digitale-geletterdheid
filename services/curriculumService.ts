import { supabase } from './supabase';
import { EducationLevel } from '../types';

export interface SchoolConfig {
    id: string;
    schoolId: string;
    periodNaming: string;
    periodsPerYear: number;
    maxYearMavo: number;
    maxYearHavo: number;
    maxYearVwo: number;
    customConfig: Record<string, any>;
}

export interface CurriculumMission {
    id: string;
    title: string;
    description: string | null;
    yearGroup: number;
    period: number;
    position: number;
    educationLevels: string[];
    sloKerndoelen: string[];
    sloVsoKerndoelen: string[] | null;
    difficulty: string;
    isReview: boolean;
    isBonus: boolean;
    isExternal: boolean;
    classRestriction: string | null;
    status: string;
}

// Get school configuration
export async function getSchoolConfig(schoolId: string): Promise<SchoolConfig | null> {
    const { data, error } = await supabase
        .from('school_configs')
        .select('*')
        .eq('school_id', schoolId)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        schoolId: data.school_id,
        periodNaming: data.period_naming || 'Periode',
        periodsPerYear: data.periods_per_year || 4,
        maxYearMavo: data.max_year_mavo || 2,
        maxYearHavo: data.max_year_havo || 3,
        maxYearVwo: data.max_year_vwo || 3,
        customConfig: data.custom_config || {}
    };
}

// Update school configuration
export async function updateSchoolConfig(schoolId: string, config: Partial<SchoolConfig>): Promise<boolean> {
    const { error } = await supabase
        .from('school_configs')
        .upsert({
            school_id: schoolId,
            period_naming: config.periodNaming,
            periods_per_year: config.periodsPerYear,
            max_year_mavo: config.maxYearMavo,
            max_year_havo: config.maxYearHavo,
            max_year_vwo: config.maxYearVwo,
            custom_config: config.customConfig || {},
            updated_at: new Date().toISOString()
        }, { onConflict: 'school_id' });

    return !error;
}

// Get missions for a specific year and period
export async function getMissionsForPeriod(
    yearGroup: number,
    period: number,
    educationLevel?: EducationLevel
): Promise<CurriculumMission[]> {
    let query = supabase
        .from('curriculum_missions')
        .select('*')
        .eq('year_group', yearGroup)
        .eq('period', period)
        .order('position');

    if (educationLevel) {
        query = query.contains('education_levels', [educationLevel]);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapMission);
}

// Get all missions for a year group
export async function getMissionsForYear(
    yearGroup: number,
    educationLevel?: EducationLevel
): Promise<CurriculumMission[]> {
    let query = supabase
        .from('curriculum_missions')
        .select('*')
        .eq('year_group', yearGroup)
        .order('period')
        .order('position');

    if (educationLevel) {
        query = query.contains('education_levels', [educationLevel]);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapMission);
}

// Get maximum year for education level
export function getMaxYearForLevel(level: EducationLevel): number {
    switch (level) {
        case 'mavo': return 2;
        case 'havo': return 3;
        case 'vwo': return 3;
        default: return 3;
    }
}

// Get period display name
export function getPeriodDisplayName(
    periodNaming: string,
    periodNumber: number
): string {
    return `${periodNaming} ${periodNumber}`;
}

// Helper to map DB row to CurriculumMission
function mapMission(row: any): CurriculumMission {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        yearGroup: row.year_group,
        period: row.period,
        position: row.position,
        educationLevels: row.education_levels || ['mavo', 'havo', 'vwo'],
        sloKerndoelen: row.slo_kerndoelen || [],
        sloVsoKerndoelen: row.slo_vso_kerndoelen,
        difficulty: row.difficulty || 'Medium',
        isReview: row.is_review || false,
        isBonus: row.is_bonus || false,
        isExternal: row.is_external || false,
        classRestriction: row.class_restriction,
        status: row.status || 'available'
    };
}
