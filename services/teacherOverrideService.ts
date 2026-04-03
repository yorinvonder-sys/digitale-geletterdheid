// teacher_step_overrides table and RPC are not yet in generated types.
// Using `as never` for table names and RPC functions until types are regenerated.

import { supabase } from './supabase';

export interface TeacherOverride {
    id: string;
    teacher_id: string;
    student_id: string;
    mission_id: string;
    step_number: number;
    override_type: 'approve' | 'reject';
    reason: string | null;
    created_at: string;
}

export async function overrideStudentStep(
    studentId: string,
    missionId: string,
    stepNumber: number,
    overrideType: 'approve' | 'reject',
    reason?: string
): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.rpc('override_student_step' as never, {
        p_student_id: studentId,
        p_mission_id: missionId,
        p_step_number: stepNumber,
        p_override_type: overrideType,
        p_reason: reason ?? null,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function getOverridesForStudent(
    studentId: string,
    missionId?: string
): Promise<TeacherOverride[]> {
    let query = supabase.from('teacher_step_overrides' as never)
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    if (missionId) query = query.eq('mission_id', missionId);

    const { data, error } = await query;
    if (error) return [];
    return (data ?? []) as TeacherOverride[];
}

export async function getOverridesForClass(
    missionId?: string
): Promise<TeacherOverride[]> {
    // RLS zorgt automatisch voor school-scoping
    let query = supabase.from('teacher_step_overrides' as never)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (missionId) query = query.eq('mission_id', missionId);

    const { data, error } = await query;
    if (error) return [];
    return (data ?? []) as TeacherOverride[];
}
