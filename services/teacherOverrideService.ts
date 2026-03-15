// Tot de database types opnieuw gegenereerd zijn, gebruiken we `as any` casts
// voor teacher_step_overrides (tabel en RPC bestaan pas na migration).

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
    const { data, error } = await (supabase as any).rpc('override_student_step', {
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
    let query = (supabase as any)
        .from('teacher_step_overrides')
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
    let query = (supabase as any)
        .from('teacher_step_overrides')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (missionId) query = query.eq('mission_id', missionId);

    const { data, error } = await query;
    if (error) return [];
    return (data ?? []) as TeacherOverride[];
}
