import { supabase } from './supabase';
import { GamificationEvent, StudentActivity, HighlightedWork, ClassroomConfig, HybridAssessmentRecord } from '../types';
import { AVAILABLE_BADGES } from '../config/badges';
import { AiBeleidIdee } from '../types';

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
    text: string;
    created_at?: string;
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
    school_id?: string;
    student_name: string;
    student_class?: string;
    freq_use: string;
    purpose: string;
    useful: string;
    missing: string;
}

// --- Class settings ---
export const getClassSettings = async (classId: string): Promise<ClassSettings | null> => {
    try {
        const { data, error } = await supabase
            .from('class_settings')
            .select('*')
            .eq('class_id', classId)
            .maybeSingle();

        if (error) throw error;
        return data as ClassSettings | null;
    } catch (error) {
        console.error('Error getting class settings:', error);
        return null;
    }
};

export const updateClassSettings = async (classId: string, settings: Partial<ClassSettings> & { schoolId?: string }): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('class_settings')
            .upsert({
                class_id: classId,
                ...settings,
                school_id: settings.schoolId,
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
        let classMessages: any[] = [];
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

        // Sort by created_at descending
        return allMessages.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) as TeacherMessage[];
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
};

export const markMessageRead = async (messageId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('teacher_messages')
            .update({ read: true })
            .eq('id', messageId);
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
        return (data || []) as GamificationEvent[];
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
        // Get current stats first
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('stats')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const currentStats = (user?.stats as any) || {};
        const { error } = await supabase
            .from('users')
            .update({
                stats: {
                    ...currentStats,
                    xp: 0,
                    level: 1,
                    missionsCompleted: [],
                },
            })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error resetting student:', error);
        return false;
    }
};

export const deleteStudent = async (userId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        return false;
    }
};

export const awardBadge = async (userId: string, badgeId: string): Promise<boolean> => {
    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('stats')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;
        const currentStats = (user?.stats as any) || {};
        const currentBadges = currentStats.badges || [];

        if (!currentBadges.includes(badgeId)) {
            const { error } = await supabase
                .from('users')
                .update({
                    stats: {
                        ...currentStats,
                        badges: [...currentBadges, badgeId],
                    },
                })
                .eq('id', userId);
            if (error) throw error;
        }
        return true;
    } catch (error) {
        console.error('Error awarding badge:', error);
        return false;
    }
};
// --- Classroom config / XP ---

const LEVEL_THRESHOLDS = [0, 50, 105, 165, 231, 304, 384, 472, 569, 676, 793, 922, 1064, 1220, 1392, 1581, 1789, 2018, 2270, 2547];

export const awardXP = async (studentId: string, amount: number, studentName?: string) => {
    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('stats')
            .eq('id', studentId)
            .single();

        if (fetchError || !user) {
            console.error('Student not found:', studentId);
            return false;
        }

        const currentStats = (user.stats as any) || { xp: 0, level: 1 };
        const newXP = Math.max(0, (currentStats.xp || 0) + amount);

        let newLevel = 1;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (newXP >= LEVEL_THRESHOLDS[i]) {
                newLevel = Math.min(i + 1, 50);
                break;
            }
        }

        const { error } = await supabase
            .from('users')
            .update({
                stats: { ...currentStats, xp: newXP, level: newLevel },
            })
            .eq('id', studentId);

        if (error) throw error;

        await logActivity({
            uid: studentId,
            studentName: studentName || 'Leerling',
            type: 'xp_earned',
            data: `${amount} bonus XP (nu level ${newLevel})`,
        });

        return true;
    } catch (error) {
        console.error('Error awarding XP:', error);
        return false;
    }
};

export const getClassroomConfig = async (classId: string): Promise<ClassroomConfig | null> => {
    try {
        const { data, error } = await supabase
            .from('classroom_configs')
            .select('*')
            .eq('id', classId)
            .maybeSingle();

        if (error) throw error;
        if (data) return data as ClassroomConfig;
        return { id: classId, focusMode: false } as ClassroomConfig;
    } catch (error) {
        console.error('Error getting classroom config:', error);
        return null;
    }
};

export const updateClassroomConfig = async (classId: string, config: Partial<ClassroomConfig> & { schoolId?: string }): Promise<void> => {
    try {
        const { error } = await supabase
            .from('classroom_configs')
            .upsert({
                id: classId,
                ...config,
                school_id: config.schoolId,
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
                school_id: data.school_id,
                student_name: data.student_name,
                student_class: data.student_class,
                freq_use: data.freq_use,
                purpose: data.purpose,
                useful: data.useful,
                missing: data.missing,
            });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting survey:', error);
        return false;
    }
};

export const submitAiBeleidIdee = async (idee: Omit<AiBeleidIdee, 'id' | 'timestamp' | 'stemmen' | 'gestemdeUids'>): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('ai_beleid_feedback')
            .insert({
                ...idee,
                stemmen: 0,
                gestemde_uids: [],
            })
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error('Error submitting AI beleid idee:', error);
        return null;
    }
};

export const getAiBeleidIdeeen = async (filterClass?: string, schoolId?: string): Promise<AiBeleidIdee[]> => {
    try {
        let q = supabase
            .from('ai_beleid_feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (schoolId) {
            q = q.eq('school_id', schoolId);
        }

        const { data, error } = await q;
        if (error) throw error;

        let ideeen = (data || []) as AiBeleidIdee[];

        if (filterClass) {
            ideeen = ideeen.filter(i => i.studentClass === filterClass);
        }

        return ideeen;
    } catch (error) {
        console.error('Error getting AI beleid ideeen:', error);
        return [];
    }
};

export const stemOpIdee = async (ideeId: string, oderId: string): Promise<boolean> => {
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

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
            .insert(note)
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
            .select('*')
            .eq('student_uid', studentUid)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as TeacherNote[];
    } catch (error) {
        console.error('Error getting teacher notes:', error);
        return [];
    }
};

export const updateTeacherNote = async (noteId: string, updates: Partial<TeacherNote> & { schoolId?: string }): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('teacher_notes')
            .update({
                ...updates,
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
