/**
 * Pure afleidingen over de docent-klas-koppeling. Bewust zonder
 * databaseverbinding, zodat ze los te toetsen zijn.
 *
 * Zie supabase/migrations/20260826200000_teacher_class_scoping.sql en
 * docs/compliance/ontwerp-docent-klas-koppeling.md.
 */

export type TeacherScope = 'school' | 'class_soft' | 'class_strict';

export interface TeacherClassLink {
    id: string;
    teacherId: string;
    schoolId: string;
    studentClass: string;
    source: 'manual' | 'roster_import';
    createdAt: string;
}

export interface Person {
    id: string;
    name: string;
}

export interface ClassScopingOverview {
    /** Alle koppelingen binnen de school. */
    links: TeacherClassLink[];
    /** Docenten en beheerders van de school. */
    teachers: Person[];
    /** Klassen die binnen de school daadwerkelijk bij leerlingen staan. */
    classes: string[];
    /** Leerlingen zonder klas — een wachtrij om in te delen, geen statistiek. */
    studentsWithoutClass: Person[];
    /** Huidige stand; een ontbrekende rij in de database betekent 'school'. */
    scope: TeacherScope;
}

/**
 * Docenten zonder enige klastoewijzing.
 *
 * In `class_strict` zien zij niemand; in `class_soft` houden zij juist
 * schoolbrede toegang. Deze lijst is dus in beide standen een waarschuwing,
 * met tegengestelde betekenis.
 */
export function teachersWithoutClass(overview: ClassScopingOverview): Person[] {
    const assigned = new Set(overview.links.map(link => link.teacherId));
    return overview.teachers.filter(teacher => !assigned.has(teacher.id));
}

/**
 * Klassen waar geen enkele docent aan gekoppeld is. In een klasgebonden stand
 * kijkt bij die klassen niemand mee.
 */
export function classesWithoutTeacher(overview: ClassScopingOverview): string[] {
    const covered = new Set(overview.links.map(link => link.studentClass));
    return overview.classes.filter(klas => !covered.has(klas));
}

/**
 * Of de school klaar is om naar `class_strict` te gaan. De voorwaarden staan in
 * het ontwerp: elke leerling een klas, elke docent minstens één klas.
 *
 * Dit is een hulpmiddel voor het scherm, geen poort — het omzetten zelf wordt
 * door de database bewaakt.
 */
export function strictReadiness(overview: ClassScopingOverview): {
    ready: boolean;
    teachersWithoutClass: number;
    studentsWithoutClass: number;
} {
    const zonderKlas = teachersWithoutClass(overview).length;
    const leerlingenZonderKlas = overview.studentsWithoutClass.length;
    return {
        ready: zonderKlas === 0 && leerlingenZonderKlas === 0,
        teachersWithoutClass: zonderKlas,
        studentsWithoutClass: leerlingenZonderKlas,
    };
}
