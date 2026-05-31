import { supabase } from './supabase';
import type { Database } from '@/types/database.types';
import type { DatabaseWithPendingMigrations } from '@/types/database.pending-migrations';
import { GamificationEvent, StudentActivity, HighlightedWork, ClassroomConfig, HybridAssessmentRecord } from '@/types';
import { AVAILABLE_BADGES } from '@/config/badges';
import { AiBeleidIdee } from '@/types';
import {
    createDefaultClassroomConfig,
    deserializeClassroomConfig,
    serializeClassroomConfig,
} from '@/utils/classroomConfig';

export { AVAILABLE_BADGES };
export interface ClassSettings {
    class_id: string;
    enabled_missions: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    xp_multiplier: number;
    updated_at?: string;
}

export interface TeacherMessage {
    id?: string;
    school_id?: string;
    target_type: 'student' | 'class' | 'all';
    target_id: string;
    sender_name: string;
    sender_id?: string;
    text: string;
    content?: string;
    created_at?: string;
    timestamp?: string;
    read: boolean;
}

export interface TeacherNote {
    id?: string;
    teacher_uid: string;
    student_uid: string;
    school_id?: string;
    text: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
}

type TeacherNotesRow = Database['public']['Tables']['teacher_notes']['Row'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const mapTeacherNoteRow = (row: TeacherNotesRow & Partial<TeacherNote>): TeacherNote => {
    const noteData = isRecord(row.data) ? row.data : {};
    return {
        id: row.id,
        teacher_uid: row.teacher_uid ?? String(noteData.teacher_uid ?? ''),
        student_uid: row.student_uid ?? String(noteData.student_uid ?? ''),
        school_id: row.school_id ?? (String(noteData.school_id ?? '') || undefined),
        text: row.text ?? String(noteData.text ?? ''),
        category: row.category ?? (typeof noteData.category === 'string' ? noteData.category : undefined),
        created_at: row.created_at ?? undefined,
        updated_at: row.updated_at ?? undefined,
    };
};

const serializeTeacherNote = (note: Partial<TeacherNote>) => ({
    teacher_uid: note.teacher_uid,
    student_uid: note.student_uid,
    school_id: note.school_id,
    text: note.text,
    category: note.category,
});

export interface StudentGroup {
    id?: string;
    name: string;
    class_id?: string;
    school_id?: string;
    student_uids: string[];
    created_at?: string;
}

export interface AiBeleidSurveyData {
    uid: string;
    schoolId?: string;
    studentName: string;
    studentClass?: string;
    freqUse: string;
    purpose: string;
    useful: string;
    missing: string;
}

type AiBeleidFeedbackRow = Database['public']['Tables']['ai_beleid_feedback']['Row'];
type AiBeleidCategory = AiBeleidIdee['categorie'];
type TeacherMessageRow = DatabaseWithPendingMigrations['public']['Tables']['teacher_messages']['Row'];

const AI_BELEID_CATEGORIES: AiBeleidCategory[] = ['regels', 'mogelijkheden', 'zorgen', 'suggesties'];

function normalizeAiBeleidCategory(value: string): AiBeleidCategory {
    return AI_BELEID_CATEGORIES.includes(value as AiBeleidCategory)
        ? value as AiBeleidCategory
        : 'suggesties';
}

function mapAiBeleidRow(
    row: AiBeleidFeedbackRow,
    profile?: { display_name: string | null; student_class: string | null },
): AiBeleidIdee {
    return {
        id: row.id,
        uid: row.uid,
        schoolId: row.school_id ?? undefined,
        studentName: profile?.display_name || 'Leerling',
        studentClass: profile?.student_class ?? undefined,
        categorie: normalizeAiBeleidCategory(row.categorie),
        idee: row.idee,
        stemmen: row.stemmen ?? 0,
        gestemdeUids: row.gestemde_uids ?? [],
        timestamp: row.timestamp,
    };
}

// --- Class settings ---
export const getClassSettings = async (schoolOrClassId: string, maybeClassId?: string): Promise<ClassSettings | null> => {
    const classId = maybeClassId ?? schoolOrClassId;
    const schoolId = maybeClassId ? schoolOrClassId : undefined;
    try {
        let query = supabase
            .from('class_settings')
            .select('*')
            .eq('class_id', classId);

        if (schoolId) query = query.eq('school_id', schoolId);

        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        return data as unknown as ClassSettings | null;
    } catch (error) {
        console.error('Error getting class settings:', error);
        return null;
    }
};

export const updateClassSettings = async (
    schoolOrClassId: string,
    classOrSettings: string | (Partial<ClassSettings> & { schoolId?: string }),
    maybeSettings?: Partial<ClassSettings> & { schoolId?: string },
): Promise<boolean> => {
    const classId = typeof classOrSettings === 'string' ? classOrSettings : schoolOrClassId;
    const settings = typeof classOrSettings === 'string' ? maybeSettings ?? {} : classOrSettings;
    const schoolId = typeof classOrSettings === 'string' ? schoolOrClassId : settings.schoolId;
    try {
        const { error } = await supabase
            .from('class_settings')
            .upsert({
                id: classId,
                class_id: classId,
                ...settings,
                school_id: schoolId,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'class_id' });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating class settings:', error);
        return false;
    }
};

// --- Messages ---
function mapTeacherMessage(row: TeacherMessageRow, readMessageIds: Set<string>): TeacherMessage {
    return {
        id: row.id,
        school_id: row.school_id ?? undefined,
        target_type: row.target_type,
        target_id: row.target_id,
        sender_name: row.sender_name ?? 'Docent',
        sender_id: row.sender_id ?? undefined,
        text: row.text ?? row.content ?? '',
        content: row.content ?? undefined,
        created_at: row.created_at ?? undefined,
        timestamp: row.timestamp ?? row.created_at ?? undefined,
        read: readMessageIds.has(row.id),
    };
}

async function getReadTeacherMessageIds(userId: string, messageIds: string[]): Promise<Set<string>> {
    if (messageIds.length === 0) return new Set();

    const { data, error } = await supabase
        .from('teacher_message_reads')
        .select('message_id')
        .eq('user_id', userId)
        .in('message_id', messageIds);

    if (error) throw error;

    return new Set(
        (data || [])
            .map((row) => row.message_id)
            .filter((id): id is string => typeof id === 'string')
    );
}

export const sendMessage = async (message: Omit<TeacherMessage, 'id' | 'created_at' | 'read'>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('teacher_messages')
            .insert({
                school_id: message.school_id,
                target_type: message.target_type,
                target_id: message.target_id,
                sender_name: message.sender_name,
                text: message.text,
                read: false,
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    }
};

export const getMessagesForUser = async (userId: string, classId?: string): Promise<TeacherMessage[]> => {
    try {
        // Get messages for this specific student
        const { data: studentMessages, error: e1 } = await supabase
            .from('teacher_messages')
            .select('*')
            .eq('target_type', 'student')
            .eq('target_id', userId);
        if (e1) throw e1;

        // Get class messages
        let classMessages: TeacherMessageRow[] = [];
        if (classId) {
            const { data, error } = await supabase
                .from('teacher_messages')
                .select('*')
                .eq('target_type', 'class')
                .eq('target_id', classId);
            if (error) throw error;
            classMessages = data || [];
        }

        // Get broadcast messages
        const { data: broadcastMessages, error: e3 } = await supabase
            .from('teacher_messages')
            .select('*')
            .eq('target_type', 'all');
        if (e3) throw e3;

        const allMessages = [
            ...(studentMessages || []),
            ...classMessages,
            ...(broadcastMessages || []),
        ];

        const messageIds = allMessages.map((message) => message.id);
        const readMessageIds = await getReadTeacherMessageIds(userId, messageIds);

        // Sort by created_at descending
        return allMessages
            .map((message) => mapTeacherMessage(message, readMessageIds))
            .sort((a, b) =>
                new Date(b.timestamp || b.created_at || 0).getTime() -
                new Date(a.timestamp || a.created_at || 0).getTime()
            );
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
};

export const markMessageRead = async (messageId: string, userId: string): Promise<void> => {
    if (!messageId || !userId) return;

    try {
        const { error } = await supabase
            .from('teacher_message_reads')
            .upsert({
                message_id: messageId,
                user_id: userId,
                read_at: new Date().toISOString(),
            }, { onConflict: 'message_id,user_id' });
        if (error) throw error;
    } catch (error) {
        console.error('Error marking message read:', error);
    }
};

// --- Gamification events ---
export const createEvent = async (event: Omit<GamificationEvent, 'id'> & { schoolId?: string }): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('gamification_events')
            .insert({
                ...event,
                school_id: event.schoolId,
            });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error creating event:', error);
        return false;
    }
};

export const getActiveEvents = async (schoolId?: string): Promise<GamificationEvent[]> => {
    try {
        let q = supabase
            .from('gamification_events')
            .select('*')
            .eq('active', true);

        if (schoolId) {
            q = q.eq('school_id', schoolId);
        }

        const { data, error } = await q;
        if (error) throw error;
        return (data || []) as unknown as GamificationEvent[];
    } catch (error) {
        console.error('Error getting events:', error);
        return [];
    }
};

export const endEvent = async (eventId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('gamification_events')
            .update({ active: false })
            .eq('id', eventId);
        if (error) throw error;
    } catch (error) {
        console.error('Error ending event:', error);
    }
};

// --- Student management ---
export const resetStudentProgress = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await (supabase as any).rpc('reset_student_progress', {
            p_student_id: userId,
        });
        if (error) throw error;
        return data === true;
    } catch (error) {
        console.error('Error resetting student:', error);
        return false;
    }
};

export const deleteStudent = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await (supabase as any).rpc('delete_student', {
            p_student_id: userId,
        });
        if (error) throw error;
        return data === true;
    } catch (error) {
        console.error('Error deleting student:', error);
        return false;
    }
};

export const awardBadge = async (userId: string, badgeId: string): Promise<boolean> => {
    try {
        const { data, error } = await (supabase as any).rpc('teacher_award_badge', {
            p_student_id: userId,
            p_badge_id: badgeId,
            p_reason: 'teacher_award',
        });

        if (error) throw error;
        return data === true;
    } catch (error) {
        console.error('Error awarding badge:', error);
        return false;
    }
};
// --- Classroom config / XP ---

export const awardXP = async (studentId: string, amount: number, studentName?: string) => {
    try {
        const safeAmount = Math.max(1, Math.min(25, Math.trunc(amount)));
        const { data, error } = await (supabase as any).rpc('teacher_award_xp', {
            p_student_id: studentId,
            p_amount: safeAmount,
            p_reason: 'teacher_award',
        });

        if (error) throw error;

        await logActivity({
            uid: studentId,
            studentName: studentName || 'Leerling',
            type: 'xp_earned',
            data: `${safeAmount} bonus XP (nu level ${data?.newLevel ?? 'onbekend'})`,
        });

        return data?.awarded === true;
    } catch (error) {
        console.error('Error awarding XP:', error);
        return false;
    }
};

export const getClassroomConfig = async (schoolOrClassId: string, maybeClassId?: string): Promise<ClassroomConfig | null> => {
    const classId = maybeClassId ?? schoolOrClassId;
    try {
        const { data, error } = await supabase
            .from('classroom_configs')
            .select('*')
            .eq('id', classId)
            .maybeSingle();

        if (error) throw error;
        return deserializeClassroomConfig(data) ?? createDefaultClassroomConfig(classId);
    } catch (error) {
        console.error('Error getting classroom config:', error);
        return null;
    }
};

export const updateClassroomConfig = async (
    schoolOrClassId: string,
    classOrConfig: string | (Partial<ClassroomConfig> & { schoolId?: string }),
    maybeConfig?: Partial<ClassroomConfig> & { schoolId?: string },
): Promise<void> => {
    const classId = typeof classOrConfig === 'string' ? classOrConfig : schoolOrClassId;
    const config = typeof classOrConfig === 'string' ? maybeConfig ?? {} : classOrConfig;
    try {
        const currentConfig = (await getClassroomConfig(classId)) ?? createDefaultClassroomConfig(classId);
        const nextConfig: ClassroomConfig = {
            ...currentConfig,
            ...config,
            id: classId,
        };
        const { error } = await supabase
            .from('classroom_configs')
            .upsert({
                id: classId,
                data: serializeClassroomConfig(nextConfig) as unknown as import('@/types/database.types').Json,
            }, { onConflict: 'id' });
        if (error) throw error;
    } catch (error) {
        console.error('Error updating classroom config:', error);
    }
};

// --- Activity logging ---
export const logActivity = async (activity: Omit<StudentActivity, 'id' | 'timestamp'> & { missionId?: string }): Promise<void> => {
    try {
        const { error } = await supabase
            .from('student_activities')
            .insert({
                uid: activity.uid,
                school_id: (activity as any).schoolId,
                student_name: activity.studentName,
                type: activity.type,
                data: activity.data,
                mission_id: activity.missionId,
            });
        if (error) throw error;
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

// --- Hybrid assessment ---
export const saveHybridAssessmentRecord = async (record: Omit<HybridAssessmentRecord, 'id' | 'timestamp'>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('hybrid_assessments')
            .insert({
                uid: record.uid,
                school_id: record.schoolId,
                student_name: record.studentName,
                mission_id: record.missionId,
                auto_score: record.autoScore,
                teacher_score: record.teacherScore,
                final_score: record.finalScore,
            });

        if (error) throw error;

        await logActivity({
            uid: record.uid,
            schoolId: record.schoolId,
            studentName: record.studentName,
            type: 'test_taken',
            data: `Hybride beoordeling ${record.missionId}: ${record.finalScore}% (AI ${record.autoScore}% / Docent ${record.teacherScore}%)`,
            missionId: record.missionId,
        } as any);

        return true;
    } catch (error) {
        console.error('Error saving hybrid assessment record:', error);
        return false;
    }
};

// --- Highlighted work ---
export const highlightWork = async (work: Omit<HighlightedWork, 'id' | 'timestamp'>): Promise<void> => {
    try {
        const { error } = await supabase
            .from('highlighted_work')
            .insert(work);
        if (error) throw error;
    } catch (error) {
        console.error('Error highlighting work:', error);
    }
};

// --- AI beleid brainstorm ---
export const submitAiBeleidSurvey = async (data: AiBeleidSurveyData): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('ai_beleid_surveys')
            .insert({
                uid: data.uid,
                school_id: data.schoolId,
                data: {
                    studentClass: data.studentClass ?? null,
                    freqUse: data.freqUse,
                    purpose: data.purpose,
                    useful: data.useful,
                    missing: data.missing,
                },
            });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting survey:', error);
        return false;
    }
};

export const submitAiBeleidIdee = async (idee: Omit<AiBeleidIdee, 'id' | 'timestamp' | 'stemmen' | 'gestemdeUids'>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('ai_beleid_feedback')
            .insert({
                uid: idee.uid,
                school_id: idee.schoolId,
                categorie: idee.categorie,
                idee: idee.idee,
                stemmen: 0,
                gestemde_uids: [],
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting AI beleid idee:', error);
        return false;
    }
};

export const getAiBeleidIdeeen = async (filterClass?: string, schoolId?: string): Promise<AiBeleidIdee[]> => {
    try {
        let q = supabase
            .from('ai_beleid_feedback')
            .select('id, uid, school_id, categorie, idee, stemmen, gestemde_uids, timestamp')
            .order('timestamp', { ascending: false });

        if (schoolId) {
            q = q.eq('school_id', schoolId);
        }

        const { data, error } = await q;
        if (error) throw error;

        const rows = (data || []) as AiBeleidFeedbackRow[];
        const userIds = [...new Set(rows.map(row => row.uid).filter(Boolean))];
        const profiles = new Map<string, { display_name: string | null; student_class: string | null }>();

        if (userIds.length > 0) {
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('id, display_name, student_class')
                .in('id', userIds);

            if (profileError) {
                console.warn('Could not enrich AI beleid ideeen with user profiles:', profileError);
            } else {
                (profileData || []).forEach(profile => {
                    profiles.set(profile.id, {
                        display_name: profile.display_name,
                        student_class: profile.student_class,
                    });
                });
            }
        }

        let ideeen = rows.map(row => mapAiBeleidRow(row, profiles.get(row.uid)));

        if (filterClass) {
            ideeen = ideeen.filter(i => i.studentClass === filterClass);
        }

        return ideeen;
    } catch (error) {
        console.error('Error getting AI beleid ideeen:', error);
        return [];
    }
};

export const stemOpIdee = async (ideeId: string, _voterId: string): Promise<boolean> => {
    try {
        // Use the atomic vote_on_idea RPC with FOR UPDATE row locking
        // and built-in duplicate vote prevention.
        const { data, error } = await supabase.rpc('vote_on_idea', {
            p_idea_id: ideeId,
        });

        if (error) {
            console.error('Error voting on idee (RPC):', error);
            return false;
        }

        const result = data as Record<string, any> || {};
        return !!result.success;
    } catch (error) {
        console.error('Error voting on idee:', error);
        return false;
    }
};

export const getAiBeleidStats = async (filterClass?: string, schoolId?: string): Promise<{
    totaal: number;
    perCategorie: Record<string, number>;
    topIdeeen: AiBeleidIdee[];
}> => {
    const ideeen = await getAiBeleidIdeeen(filterClass, schoolId);

    const perCategorie: Record<string, number> = {
        regels: 0,
        mogelijkheden: 0,
        zorgen: 0,
        suggesties: 0,
    };

    ideeen.forEach(idee => {
        perCategorie[idee.categorie] = (perCategorie[idee.categorie] || 0) + 1;
    });

    const topIdeeen = [...ideeen]
        .sort((a, b) => (b.stemmen || 0) - (a.stemmen || 0))
        .slice(0, 5);

    return {
        totaal: ideeen.length,
        perCategorie,
        topIdeeen,
    };
};

export const resetStudentPassword = async (studentUid: string, customPassword?: string): Promise<boolean> => {
    try {
        const { callEdgeFunction } = await import('./supabase');
        await callEdgeFunction('resetStudentPassword', { studentUid, customPassword });
        return true;
    } catch (error) {
        console.error('Error resetting student password:', error);
        throw error;
    }
};

// ============ TEACHER NOTES ============
export const addTeacherNote = async (note: Omit<TeacherNote, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('teacher_notes')
            .insert({
                school_id: note.school_id,
                data: serializeTeacherNote(note) as unknown as Database['public']['Tables']['teacher_notes']['Insert']['data'],
            })
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error('Error adding teacher note:', error);
        return null;
    }
};

export const getTeacherNotes = async (studentUid: string): Promise<TeacherNote[]> => {
    try {
        const { data, error } = await supabase
            .from('teacher_notes')
            .select('id, school_id, data, created_at, updated_at')
            .contains('data', { student_uid: studentUid })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(row => mapTeacherNoteRow(row));
    } catch (error) {
        console.error('Error getting teacher notes:', error);
        return [];
    }
};

export const updateTeacherNote = async (noteId: string, updates: Partial<TeacherNote> & { schoolId?: string }): Promise<boolean> => {
    try {
        const { data: existing, error: fetchError } = await supabase
            .from('teacher_notes')
            .select('data')
            .eq('id', noteId)
            .maybeSingle();
        if (fetchError) throw fetchError;

        const currentData = isRecord(existing?.data) ? existing.data : {};
        const nextData = {
            ...currentData,
            ...serializeTeacherNote(updates),
        };

        const { error } = await supabase
            .from('teacher_notes')
            .update({
                school_id: updates.school_id ?? updates.schoolId,
                data: nextData as unknown as Database['public']['Tables']['teacher_notes']['Update']['data'],
                updated_at: new Date().toISOString(),
            })
            .eq('id', noteId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating teacher note:', error);
        return false;
    }
};

export const deleteTeacherNote = async (noteId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('teacher_notes')
            .delete()
            .eq('id', noteId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting teacher note:', error);
        return false;
    }
};

// ============ STUDENT GROUPS ============
export const createStudentGroup = async (group: Omit<StudentGroup, 'id' | 'created_at'>): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('student_groups')
            .insert(group)
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error('Error creating student group:', error);
        return null;
    }
};

export const getStudentGroups = async (classId?: string, schoolId?: string): Promise<StudentGroup[]> => {
    try {
        let q = supabase.from('student_groups').select('*');

        if (schoolId) q = q.eq('school_id', schoolId);
        if (classId) q = q.eq('class_id', classId);

        q = q.order('created_at', { ascending: false });

        const { data, error } = await q;
        if (error) throw error;
        return (data || []) as StudentGroup[];
    } catch (error) {
        console.error('Error getting student groups:', error);
        return [];
    }
};

export const updateStudentGroup = async (groupId: string, updates: Partial<StudentGroup>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('student_groups')
            .update(updates)
            .eq('id', groupId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating student group:', error);
        return false;
    }
};

// --- Mission scores for teacher dashboard ---
export interface StudentMissionScore {
    mission_id: string;
    status: string;
    score: number | null;
    updated_at: string;
}

export const getStudentMissionScores = async (userId: string): Promise<StudentMissionScore[]> => {
    try {
        const { data, error } = await supabase
            .from('mission_progress')
            .select('mission_id, status, score, updated_at')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return (data || []) as unknown as StudentMissionScore[];
    } catch (error) {
        console.error('Error getting student mission scores:', error);
        return [];
    }
};

// --- Classroom configs for focus mode monitoring ---
export const getClassroomConfigs = async (classIds: string[]): Promise<ClassroomConfig[]> => {
    if (classIds.length === 0) return [];
    try {
        const { data, error } = await supabase
            .from('classroom_configs')
            .select('*')
            .in('id', classIds);

        if (error) throw error;
        return (data || [])
            .map((row) => deserializeClassroomConfig(row))
            .filter((config): config is ClassroomConfig => config !== null);
    } catch (error) {
        console.error('Error getting classroom configs:', error);
        return [];
    }
};

export const deleteStudentGroup = async (groupId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('student_groups')
            .delete()
            .eq('id', groupId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting student group:', error);
        return false;
    }
};

export const addStudentToGroup = async (groupId: string, studentUid: string): Promise<boolean> => {
    try {
        const { data: group, error: fetchError } = await supabase
            .from('student_groups')
            .select('student_uids')
            .eq('id', groupId)
            .single();

        if (fetchError) throw fetchError;
        if (!group) return false;

        const current = (group.student_uids as string[]) || [];
        if (current.includes(studentUid)) return true;

        const { error } = await supabase
            .from('student_groups')
            .update({ student_uids: [...current, studentUid] })
            .eq('id', groupId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error adding student to group:', error);
        return false;
    }
};

export const removeStudentFromGroup = async (groupId: string, studentUid: string): Promise<boolean> => {
    try {
        const { data: group, error: fetchError } = await supabase
            .from('student_groups')
            .select('student_uids')
            .eq('id', groupId)
            .single();

        if (fetchError) throw fetchError;
        if (!group) return false;

        const current = (group.student_uids as string[]) || [];
        const { error } = await supabase
            .from('student_groups')
            .update({ student_uids: current.filter(uid => uid !== studentUid) })
            .eq('id', groupId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing student from group:', error);
        return false;
    }
};
