import { supabase } from './supabase';
import { sanitizeTextInput } from '../utils/inputSanitizer';

export interface Feedback {
    id?: string;
    user_id: string;
    user_name: string;
    user_class: string;
    school_id?: string;
    message: string;
    status: string;
    created_at?: string;
}

export async function submitFeedback(
    userId: string,
    userName: string,
    userClass: string | undefined,
    message: string,
    schoolId?: string
): Promise<string> {
    const safeMessage = sanitizeTextInput(message, 2000);
    const safeName = sanitizeTextInput(userName, 100);

    const { data, error } = await supabase
        .from('feedback')
        .insert({
            user_id: userId,
            user_name: safeName,
            user_class: userClass || 'Onbekend',
            school_id: schoolId,
            message: safeMessage,
            status: 'new',
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

export async function getAllFeedback(schoolId?: string): Promise<Feedback[]> {
    let q = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

    if (schoolId) {
        q = q.eq('school_id', schoolId);
    }

    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Feedback[];
}

export async function deleteFeedback(feedbackId: string): Promise<void> {
    const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

    if (error) throw error;
}
