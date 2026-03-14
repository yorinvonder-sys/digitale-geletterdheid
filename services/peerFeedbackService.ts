import { supabase } from './supabase';
import { sanitizeTextInput } from '../utils/inputSanitizer';

export interface PeerFeedbackCriteria {
  duidelijkheid: number; // 1-5
  creativiteit: number;  // 1-5
  volledigheid: number;  // 1-5
}

export interface PeerFeedbackInput {
  missionId: string;
  toStudentId: string;
  feedbackText: string;
  rating: number;
  criteria: PeerFeedbackCriteria;
  schoolId: string;
  classId: string;
}

export interface PeerFeedbackRecord {
  id: string;
  missionId: string;
  fromStudentId: string;
  toStudentId: string;
  schoolId: string;
  classId: string;
  feedbackText: string;
  rating: number;
  criteria: PeerFeedbackCriteria;
  helpfulVote: boolean | null;
  createdAt: string;
}

function mapRow(row: any): PeerFeedbackRecord {
  return {
    id: row.id,
    missionId: row.mission_id,
    fromStudentId: row.from_student_id,
    toStudentId: row.to_student_id,
    schoolId: row.school_id,
    classId: row.class_id,
    feedbackText: row.feedback_text,
    rating: row.rating,
    criteria: row.criteria || { duidelijkheid: 0, creativiteit: 0, volledigheid: 0 },
    helpfulVote: row.helpful_vote,
    createdAt: row.created_at,
  };
}

/**
 * Submit peer feedback for a classmate's mission work.
 * Validates minimum text length and sanitizes input.
 */
export async function submitPeerFeedback(input: PeerFeedbackInput): Promise<void> {
  const safeText = sanitizeTextInput(input.feedbackText, 1000);

  if (safeText.length < 20) {
    throw new Error('Feedback moet minimaal 20 tekens bevatten.');
  }

  if (input.rating < 1 || input.rating > 5) {
    throw new Error('Beoordeling moet tussen 1 en 5 zijn.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Niet ingelogd.');

  if (user.id === input.toStudentId) {
    throw new Error('Je kunt jezelf geen feedback geven.');
  }

  const { error } = await (supabase.from as any)('peer_feedback').insert({
    mission_id: input.missionId,
    from_student_id: user.id,
    to_student_id: input.toStudentId,
    school_id: input.schoolId,
    class_id: input.classId,
    feedback_text: safeText,
    rating: input.rating,
    criteria: input.criteria,
  });

  if (error) throw new Error('Feedback opslaan mislukt: ' + error.message);
}

/**
 * Get feedback received by a student, optionally filtered by mission.
 */
export async function getReceivedFeedback(
  studentId: string,
  missionId?: string
): Promise<PeerFeedbackRecord[]> {
  let query = (supabase.from as any)('peer_feedback')
    .select('*')
    .eq('to_student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (missionId) {
    query = query.eq('mission_id', missionId);
  }

  const { data, error } = await query;
  if (error) throw new Error('Feedback ophalen mislukt: ' + error.message);

  return (data ?? []).map(mapRow);
}

/**
 * Get feedback given by a student, optionally filtered by mission.
 */
export async function getGivenFeedback(
  studentId: string,
  missionId?: string
): Promise<PeerFeedbackRecord[]> {
  let query = (supabase.from as any)('peer_feedback')
    .select('*')
    .eq('from_student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (missionId) {
    query = query.eq('mission_id', missionId);
  }

  const { data, error } = await query;
  if (error) return [];

  return (data ?? []).map(mapRow);
}

/**
 * Get feedback stats for a class on a specific mission (for teachers).
 */
export async function getClassFeedbackStats(
  classId: string,
  missionId: string
): Promise<{ totalFeedback: number; avgRating: number; studentsWhoGave: number }> {
  const { data, error }: any = await (supabase.from as any)('peer_feedback')
    .select('rating, from_student_id')
    .eq('class_id', classId)
    .eq('mission_id', missionId);

  if (error || !data || data.length === 0) {
    return { totalFeedback: 0, avgRating: 0, studentsWhoGave: 0 };
  }

  const ratings = data.map((r: any) => r.rating).filter((r: any) => r != null);
  const uniqueGivers = new Set(data.map((r: any) => r.from_student_id));

  return {
    totalFeedback: data.length,
    avgRating: ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0,
    studentsWhoGave: uniqueGivers.size,
  };
}

/**
 * Get a random classmate who completed the same mission and hasn't been reviewed yet.
 * Returns null if no eligible peer is found.
 */
export async function getRandomPeerForReview(
  missionId: string,
  classId: string,
  excludeStudentId: string
): Promise<{ studentId: string; displayName: string } | null> {
  // Get classmates who completed this mission
  const { data: classmates, error: classError }: any = await (supabase.from as any)('mission_progress')
    .select('user_id')
    .eq('mission_id', missionId)
    .eq('status', 'completed')
    .neq('user_id', excludeStudentId);

  if (classError || !classmates || classmates.length === 0) return null;

  // Get peers this student already reviewed for this mission
  const { data: alreadyReviewed }: any = await (supabase.from as any)('peer_feedback')
    .select('to_student_id')
    .eq('from_student_id', excludeStudentId)
    .eq('mission_id', missionId);

  const reviewedIds = new Set((alreadyReviewed ?? []).map((r: any) => r.to_student_id));

  // Filter out already-reviewed classmates
  const eligible = classmates.filter((c: any) => !reviewedIds.has(c.user_id));

  if (eligible.length === 0) return null;

  // Pick random
  const picked = eligible[Math.floor(Math.random() * eligible.length)];

  return {
    studentId: picked.user_id,
    displayName: 'Klasgenoot', // Anoniem
  };
}

/**
 * Vote whether received feedback was helpful.
 */
export async function voteHelpful(feedbackId: string, helpful: boolean): Promise<void> {
  const { error } = await (supabase.from as any)('peer_feedback')
    .update({ helpful_vote: helpful, updated_at: new Date().toISOString() })
    .eq('id', feedbackId);

  if (error) throw new Error('Stem opslaan mislukt: ' + error.message);
}

/**
 * Count how many times a student has given feedback (for badge tracking).
 */
export async function getFeedbackGivenCount(studentId: string): Promise<number> {
  const { count, error } = await (supabase.from as any)('peer_feedback')
    .select('id', { count: 'exact', head: true })
    .eq('from_student_id', studentId);

  if (error) return 0;
  return count ?? 0;
}

// ============================================================
// Backward compatibility — used by components/PeerFeedbackPanel.tsx
// which writes to the older student_feedback table.
// ============================================================

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
 * @deprecated Use submitPeerFeedback instead. Kept for old PeerFeedbackPanel.
 */
export async function submitLegacyPeerFeedback(
  feedback: Omit<PeerFeedback, 'id' | 'createdAt'>
): Promise<void> {
  const safeMessage = sanitizeTextInput(feedback.message, 280);
  const safeName = sanitizeTextInput(feedback.fromName, 100);

  const { error } = await (supabase.from as any)('student_feedback').insert({
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
 * @deprecated Use getReceivedFeedback instead. Kept for old PeerFeedbackPanel.
 */
export async function getFeedbackForMission(
  targetUid: string,
  missionId: string
): Promise<PeerFeedback[]> {
  const { data, error }: any = await (supabase.from as any)('student_feedback')
    .select('*')
    .eq('target_uid', targetUid)
    .eq('target_mission_id', missionId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error('Feedback ophalen mislukt: ' + error.message);

  return (data ?? []).map((row: any) => ({
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
