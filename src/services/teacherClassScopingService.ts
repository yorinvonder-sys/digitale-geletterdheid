import { supabase } from './supabase';
import type {
    ClassScopingOverview,
    TeacherScope,
} from './teacherClassScopingContract';

export type {
    ClassScopingOverview,
    TeacherClassLink,
    TeacherScope,
} from './teacherClassScopingContract';
export {
    teachersWithoutClass,
    classesWithoutTeacher,
    strictReadiness,
} from './teacherClassScopingContract';

/**
 * Beheer van de docent-klas-koppeling (`public.teacher_classes`) en de
 * toegangsstand per school (`public.school_access_settings`).
 *
 * Schrijven kan alleen een beheerder mét tweefactor; dat wordt door RLS
 * afgedwongen (`public.is_class_scoping_admin()`), niet hier. Deze service
 * mag dus gerust een schrijfpoging doen: de database weigert wat niet mag.
 */

const displayName = (row: { display_name?: string | null; email?: string | null; id: string }): string =>
    row.display_name?.trim() || row.email?.trim() || row.id;

export async function getClassScopingOverview(schoolId: string): Promise<ClassScopingOverview> {
    const [linkRes, userRes, scopeRes] = await Promise.all([
        supabase
            .from('teacher_classes')
            .select('id, teacher_id, school_id, student_class, source, created_at')
            .eq('school_id', schoolId)
            .order('student_class', { ascending: true }),
        supabase
            .from('users')
            .select('id, display_name, email, role, student_class')
            .eq('school_id', schoolId),
        supabase
            .from('school_access_settings')
            .select('teacher_scope')
            .eq('school_id', schoolId)
            .maybeSingle(),
    ]);

    // Transportfouten van supabase-js komen als `error`, niet als exception.
    if (linkRes.error) throw linkRes.error;
    if (userRes.error) throw userRes.error;
    if (scopeRes.error) throw scopeRes.error;

    const users = (userRes.data || []) as {
        id: string;
        display_name: string | null;
        email: string | null;
        role: string | null;
        student_class: string | null;
    }[];

    const students = users.filter(u => u.role === 'student');

    return {
        links: (linkRes.data || []).map(row => ({
            id: row.id as string,
            teacherId: row.teacher_id as string,
            schoolId: row.school_id as string,
            studentClass: row.student_class as string,
            source: row.source as 'manual' | 'roster_import',
            createdAt: row.created_at as string,
        })),
        teachers: users
            .filter(u => u.role === 'teacher' || u.role === 'admin' || u.role === 'developer')
            .map(u => ({ id: u.id, name: displayName(u) }))
            .sort((a, b) => a.name.localeCompare(b.name, 'nl')),
        classes: Array.from(
            new Set(students.map(u => u.student_class?.trim()).filter((c): c is string => !!c))
        ).sort((a, b) => a.localeCompare(b, 'nl')),
        studentsWithoutClass: students
            .filter(u => !u.student_class?.trim())
            .map(u => ({ id: u.id, name: displayName(u) }))
            .sort((a, b) => a.name.localeCompare(b.name, 'nl')),
        scope: ((scopeRes.data?.teacher_scope as TeacherScope | undefined) ?? 'school'),
    };
}

/**
 * Koppel een docent aan een klas. `created_by` wordt server-side gestempeld
 * door een trigger; die waarde hier meesturen heeft geen zin.
 */
export async function assignClass(
    teacherId: string,
    schoolId: string,
    studentClass: string
): Promise<void> {
    const { error } = await supabase
        .from('teacher_classes')
        .insert({
            teacher_id: teacherId,
            school_id: schoolId,
            student_class: studentClass.trim(),
            source: 'manual',
        });
    if (error) throw error;
}

/**
 * Trek een koppeling in. Dit verruimt de toegang van niemand, maar beperkt
 * hem — het wordt wel geaudit, net als toekennen.
 */
export async function unassignClass(linkId: string): Promise<void> {
    const { error } = await supabase.from('teacher_classes').delete().eq('id', linkId);
    if (error) throw error;
}

/** Zet de toegangsstand van de school om. Alleen een beheerder met MFA mag dit. */
export async function setTeacherScope(schoolId: string, scope: TeacherScope): Promise<void> {
    const { error } = await supabase
        .from('school_access_settings')
        .upsert({ school_id: schoolId, teacher_scope: scope, updated_at: new Date().toISOString() },
            { onConflict: 'school_id' });
    if (error) throw error;
}
