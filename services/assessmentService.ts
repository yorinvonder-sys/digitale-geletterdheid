// Assessment service — nulmeting + eindmeting
// Generaliseert nulmetingService.ts voor beide meetmomenten.
//
// NB: assessment_results tabel wordt aangemaakt via migratie (zie supabase/migrations/).
// Tot de database types opnieuw gegenereerd zijn, gebruiken we `as any` casts
// op supabase.from() calls. Dit is veilig zolang de migratie is gedraaid.

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type { NulmetingResult, KamerScore } from '@/components/assessment/escaperoom/types';

// assessment_results is not yet in generated types — use `as never` to suppress the
// "table does not exist" error while preserving Supabase query-builder return types.
const assessmentTable = () => supabase.from('assessment_results' as never);

export type AssessmentType = 'nulmeting' | 'eindmeting';

/** Database rij-type voor assessment_results */
interface AssessmentRow {
  id: string;
  user_id: string;
  assessment_type: AssessmentType;
  school_year: number;
  school_id: string | null;
  overall_score: number;
  niveau: 'starter' | 'basis' | 'gevorderd';
  total_time_seconds: number;
  score_digitale_systemen: number;
  score_media_en_ai: number;
  score_programmeren: number;
  score_veiligheid_privacy: number;
  score_welzijn_maatschappij: number;
  time_digitale_systemen: number | null;
  time_media_en_ai: number | null;
  time_programmeren: number | null;
  time_veiligheid_privacy: number | null;
  time_welzijn_maatschappij: number | null;
  details_digitale_systemen: Record<string, any>;
  details_media_en_ai: Record<string, any>;
  details_programmeren: Record<string, any>;
  details_veiligheid_privacy: Record<string, any>;
  details_welzijn_maatschappij: Record<string, any>;
  reflectie_dilemma: string | null;
  completed_at: string;
  created_at: string;
}

/** Map een NulmetingResult object naar database kolommen */
function toRow(
  userId: string,
  result: NulmetingResult,
  type: AssessmentType,
  schoolYear: number,
  schoolId?: string,
): Omit<AssessmentRow, 'id' | 'created_at'> {
  return {
    user_id: userId,
    assessment_type: type,
    school_year: schoolYear,
    school_id: schoolId ?? null,
    overall_score: Math.round(result.overallScore),
    niveau: result.niveau,
    total_time_seconds: result.totalTimeSeconds,
    score_digitale_systemen: Math.round(result.kamers.digitaleSystemen.score),
    score_media_en_ai: Math.round(result.kamers.mediaEnAI.score),
    score_programmeren: Math.round(result.kamers.programmeren.score),
    score_veiligheid_privacy: Math.round(result.kamers.veiligheidPrivacy.score),
    score_welzijn_maatschappij: Math.round(result.kamers.welzijnMaatschappij.score),
    time_digitale_systemen: result.kamers.digitaleSystemen.timeSeconds,
    time_media_en_ai: result.kamers.mediaEnAI.timeSeconds,
    time_programmeren: result.kamers.programmeren.timeSeconds,
    time_veiligheid_privacy: result.kamers.veiligheidPrivacy.timeSeconds,
    time_welzijn_maatschappij: result.kamers.welzijnMaatschappij.timeSeconds,
    details_digitale_systemen: result.kamers.digitaleSystemen.details,
    details_media_en_ai: result.kamers.mediaEnAI.details,
    details_programmeren: result.kamers.programmeren.details,
    details_veiligheid_privacy: result.kamers.veiligheidPrivacy.details,
    details_welzijn_maatschappij: result.kamers.welzijnMaatschappij.details,
    reflectie_dilemma: result.kamers.welzijnMaatschappij.details?.reflectie ?? null,
    completed_at: result.completedAt,
  };
}

/** Map een database rij terug naar een NulmetingResult object */
function fromRow(row: AssessmentRow): NulmetingResult {
  const makeKamer = (
    score: number,
    time: number | null,
    details: Record<string, any>,
  ): KamerScore => ({
    score,
    timeSeconds: time ?? 0,
    details: details ?? {},
  });

  return {
    completedAt: row.completed_at,
    totalTimeSeconds: row.total_time_seconds,
    kamers: {
      digitaleSystemen: makeKamer(row.score_digitale_systemen, row.time_digitale_systemen, row.details_digitale_systemen),
      mediaEnAI: makeKamer(row.score_media_en_ai, row.time_media_en_ai, row.details_media_en_ai),
      programmeren: makeKamer(row.score_programmeren, row.time_programmeren, row.details_programmeren),
      veiligheidPrivacy: makeKamer(row.score_veiligheid_privacy, row.time_veiligheid_privacy, row.details_veiligheid_privacy),
      welzijnMaatschappij: makeKamer(row.score_welzijn_maatschappij, row.time_welzijn_maatschappij, row.details_welzijn_maatschappij),
    },
    overallScore: row.overall_score,
    niveau: row.niveau,
  };
}

/**
 * Geeft het huidige schooljaar terug.
 * Schooljaren starten in augustus. April 2026 → 2025 (schooljaar 2025-2026).
 */
export function getCurrentSchoolYear(): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  return month >= 8 ? year : year - 1;
}

/** Sla een assessment-resultaat op (upsert op user_id + school_year + assessment_type) */
export async function saveAssessmentResult(
  userId: string,
  result: NulmetingResult,
  type: AssessmentType,
  schoolYear: number,
  schoolId?: string,
): Promise<void> {
  const row = toRow(userId, result, type, schoolYear, schoolId);

  const { error } = await assessmentTable()
    .upsert(row, { onConflict: 'user_id,school_year,assessment_type' });

  if (error) {
    logger.error('[assessmentService] saveAssessmentResult error:', error);
    throw new Error('Kon assessment-resultaat niet opslaan.');
  }
}

/** Haal één assessment-resultaat op voor een leerling */
export async function getAssessmentResult(
  userId: string,
  type: AssessmentType,
  schoolYear: number,
): Promise<NulmetingResult | null> {
  const { data, error } = await assessmentTable()
    .select('*')
    .eq('user_id', userId)
    .eq('assessment_type', type)
    .eq('school_year', schoolYear)
    .single();

  if (error) {
    // Stil falen bij: geen rij gevonden, tabel bestaat niet (migratie nog niet gedraaid)
    if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('does not exist')) return null;
    logger.error('[assessmentService] getAssessmentResult error:', error);
    return null;
  }

  return fromRow(data as AssessmentRow);
}

/** Haal zowel nulmeting als eindmeting op voor één leerling in één schooljaar */
export async function getStudentAssessments(
  userId: string,
  schoolYear: number,
): Promise<{ nulmeting?: NulmetingResult; eindmeting?: NulmetingResult }> {
  const { data, error } = await assessmentTable()
    .select('*')
    .eq('user_id', userId)
    .eq('school_year', schoolYear);

  if (error) {
    if (error.message?.includes('does not exist')) return {};
    logger.error('[assessmentService] getStudentAssessments error:', error);
    return {};
  }

  const rows = (data as AssessmentRow[]) ?? [];
  const result: { nulmeting?: NulmetingResult; eindmeting?: NulmetingResult } = {};

  for (const row of rows) {
    if (row.assessment_type === 'nulmeting') result.nulmeting = fromRow(row);
    if (row.assessment_type === 'eindmeting') result.eindmeting = fromRow(row);
  }

  return result;
}

/** Haal assessment-resultaten op voor een hele klas (voor teacher dashboard) */
export async function getKlasAssessments(
  studentIds: string[],
  type: AssessmentType,
  schoolYear: number,
): Promise<Array<{ userId: string; result: NulmetingResult }>> {
  if (studentIds.length === 0) return [];

  const { data, error } = await assessmentTable()
    .select('*')
    .in('user_id', studentIds)
    .eq('assessment_type', type)
    .eq('school_year', schoolYear);

  if (error) {
    if (error.message?.includes('does not exist')) return [];
    logger.error('[assessmentService] getKlasAssessments error:', error);
    return [];
  }

  return ((data as AssessmentRow[]) ?? []).map((row) => ({
    userId: row.user_id,
    result: fromRow(row),
  }));
}

/** Haal nulmeting + eindmeting op voor alle leerlingen in een klas (voor groei-overzicht) */
export async function getKlasGroeiData(
  studentIds: string[],
  schoolYear: number,
): Promise<Array<{ userId: string; nulmeting?: NulmetingResult; eindmeting?: NulmetingResult }>> {
  if (studentIds.length === 0) return [];

  const { data, error } = await assessmentTable()
    .select('*')
    .in('user_id', studentIds)
    .eq('school_year', schoolYear);

  if (error) {
    if (error.message?.includes('does not exist')) return [];
    logger.error('[assessmentService] getKlasGroeiData error:', error);
    return [];
  }

  const byStudent = new Map<string, { nulmeting?: NulmetingResult; eindmeting?: NulmetingResult }>();

  for (const row of (data as AssessmentRow[]) ?? []) {
    if (!byStudent.has(row.user_id)) byStudent.set(row.user_id, {});
    const entry = byStudent.get(row.user_id)!;
    if (row.assessment_type === 'nulmeting') entry.nulmeting = fromRow(row);
    if (row.assessment_type === 'eindmeting') entry.eindmeting = fromRow(row);
  }

  return Array.from(byStudent.entries()).map(([userId, assessments]) => ({
    userId,
    ...assessments,
  }));
}

/** Snelle check: heeft de leerling een specifiek assessment al afgerond? */
export async function hasCompletedAssessment(
  userId: string,
  type: AssessmentType,
  schoolYear: number,
): Promise<boolean> {
  const { data, error } = await assessmentTable()
    .select('id')
    .eq('user_id', userId)
    .eq('assessment_type', type)
    .eq('school_year', schoolYear)
    .single();

  if (error) return false;
  return !!data;
}
