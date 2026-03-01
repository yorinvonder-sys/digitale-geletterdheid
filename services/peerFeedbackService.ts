import { supabase } from './supabase';
import { sanitizeTextInput } from '../utils/inputSanitizer';

export interface PeerFeedback {
  id?: string;
  fromUid: string;
  fromName: string;
  targetUid: string;
  targetMissionId: string;
  feedbackType: 'positive' | 'suggestion' | 'question';
  message: string;
  schoolId?: string;
  createdAt?: string;
}

/**
 * Submit peer feedback for a classmate's mission work.
 * Sanitizes input before storing.
 */
export async function submitPeerFeedback(
  feedback: Omit<PeerFeedback, 'id' | 'createdAt'>
): Promise<void> {
  const safeMessage = sanitizeTextInput(feedback.message, 280);
  const safeName = sanitizeTextInput(feedback.fromName, 100);

  const { error } = await supabase.from('student_feedback').insert({
    from_uid: feedback.fromUid,
    from_name: safeName,
    target_uid: feedback.targetUid,
    target_mission_id: feedback.targetMissionId,
    feedback_type: feedback.feedbackType,
    message: safeMessage,
    school_id: feedback.schoolId ?? null,
    created_at: new Date().toISOString(),
  });

  if (error) throw new Error('Feedback opslaan mislukt: ' + error.message);
}

/**
 * Get feedback received by a student for a specific mission.
 * Returns max 20 items, newest first.
 */
export async function getFeedbackForMission(
  targetUid: string,
  missionId: string
): Promise<PeerFeedback[]> {
  const { data, error } = await supabase
    .from('student_feedback')
    .select('*')
    .eq('target_uid', targetUid)
    .eq('target_mission_id', missionId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error('Feedback ophalen mislukt: ' + error.message);

  return (data ?? []).map(row => ({
    id: row.id,
    fromUid: row.from_uid,
    fromName: row.from_name,
    targetUid: row.target_uid,
    targetMissionId: row.target_mission_id,
    feedbackType: row.feedback_type,
    message: row.message,
    schoolId: row.school_id,
    createdAt: row.created_at,
  }));
}

/**
 * Get all feedback given by a specific student.
 * Returns max 50 items, newest first.
 */
export async function getFeedbackGivenBy(
  fromUid: string
): Promise<PeerFeedback[]> {
  const { data, error } = await supabase
    .from('student_feedback')
    .select('*')
    .eq('from_uid', fromUid)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];

  return (data ?? []).map(row => ({
    id: row.id,
    fromUid: row.from_uid,
    fromName: row.from_name,
    targetUid: row.target_uid,
    targetMissionId: row.target_mission_id,
    feedbackType: row.feedback_type,
    message: row.message,
    schoolId: row.school_id,
    createdAt: row.created_at,
  }));
}
