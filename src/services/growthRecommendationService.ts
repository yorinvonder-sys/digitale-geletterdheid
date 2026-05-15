// Growth Recommendation service
// Beheert het opslaan en ophalen van AI-gegenereerde groei-aanbevelingen.
//
// NB: growth_recommendations tabel wordt aangemaakt via migratie (zie supabase/migrations/).
// Tot de database types opnieuw gegenereerd zijn, gebruiken we `as any` casts
// op supabase.from() calls. Dit is veilig zolang de migratie is gedraaid.

import { supabase } from './supabase';
import { logger } from '@/utils/logger';

// Supabase client cast — growth_recommendations tabel nog niet in generated types
const recommendationsTable = () => (supabase as any).from('growth_recommendations');

export interface GrowthRecommendation {
  id: string;
  userId: string;
  schoolYear: number;
  recommendationText: string;
  focusDomains: string[];
  modelVersion: string;
  teacherApproved: boolean | null;
  teacherApprovedAt: string | null;
  teacherApprovedBy: string | null;
  teacherNotes: string | null;
  createdAt: string;
}

interface GrowthRecommendationRow {
  id: string;
  user_id: string;
  school_year: number;
  school_id: string | null;
  recommendation_text: string;
  focus_domains: string[];
  input_context: Record<string, any>;
  model_version: string;
  teacher_approved: boolean | null;
  teacher_approved_at: string | null;
  teacher_approved_by: string | null;
  teacher_notes: string | null;
  created_at: string;
}

export interface RequestRecommendationInput {
  nulmetingScores: Record<string, number>;
  eindmetingScores: Record<string, number>;
  missionsCompleted: string[];
  sloProgress: Record<string, number>;
  yearGroup: number;
  educationLevel: string;
  schoolYear: number;
}

/** Map een database rij terug naar een GrowthRecommendation object */
function fromRow(row: GrowthRecommendationRow): GrowthRecommendation {
  return {
    id: row.id,
    userId: row.user_id,
    schoolYear: row.school_year,
    recommendationText: row.recommendation_text,
    focusDomains: row.focus_domains,
    modelVersion: row.model_version,
    teacherApproved: row.teacher_approved,
    teacherApprovedAt: row.teacher_approved_at,
    teacherApprovedBy: row.teacher_approved_by,
    teacherNotes: row.teacher_notes,
    createdAt: row.created_at,
  };
}

/**
 * Haal de groei-aanbeveling op voor een leerling in een schooljaar.
 * RLS geeft leerlingen alleen approved aanbevelingen terug; docenten zien alles.
 */
export async function getStudentRecommendation(
  userId: string,
  schoolYear: number,
): Promise<GrowthRecommendation | null> {
  const { data, error } = await recommendationsTable()
    .select('*')
    .eq('user_id', userId)
    .eq('school_year', schoolYear)
    .single();

  if (error) {
    // PGRST116 = no rows found, dat is geen fout
    if (error.code === 'PGRST116') return null;
    logger.error('[growthRecommendationService] getStudentRecommendation error:', error);
    return null;
  }

  return fromRow(data as GrowthRecommendationRow);
}

/**
 * Haal alle aanbevelingen op die nog goedkeuring van de docent vereisen.
 * Bedoeld voor het teacher dashboard.
 */
export async function getPendingRecommendations(
  studentIds: string[],
  schoolYear: number,
): Promise<GrowthRecommendation[]> {
  if (studentIds.length === 0) return [];

  const { data, error } = await recommendationsTable()
    .select('*')
    .in('user_id', studentIds)
    .eq('school_year', schoolYear)
    .is('teacher_approved', null);

  if (error) {
    logger.error('[growthRecommendationService] getPendingRecommendations error:', error);
    return [];
  }

  return ((data as GrowthRecommendationRow[]) ?? []).map(fromRow);
}

/**
 * Keur een aanbeveling goed of af.
 * Slaat teacher_approved, teacher_approved_at, teacher_approved_by en optioneel teacher_notes op.
 */
export async function approveRecommendation(
  recommendationId: string,
  approved: boolean,
  teacherId: string,
  notes?: string,
): Promise<void> {
  const update: Partial<GrowthRecommendationRow> = {
    teacher_approved: approved,
    teacher_approved_at: new Date().toISOString(),
    teacher_approved_by: teacherId,
  };

  if (notes !== undefined) {
    update.teacher_notes = notes;
  }

  const { error } = await recommendationsTable()
    .update(update)
    .eq('id', recommendationId);

  if (error) {
    logger.error('[growthRecommendationService] approveRecommendation error:', error);
    throw new Error('Kon aanbeveling niet bijwerken.');
  }
}

/**
 * Vraag een nieuwe AI-aanbeveling aan via de growthRecommendation edge function.
 */
export async function requestRecommendation(
  input: RequestRecommendationInput,
): Promise<GrowthRecommendation> {
  const { data, error } = await supabase.functions.invoke('growthRecommendation', {
    body: input,
  });

  if (error) {
    logger.error('[growthRecommendationService] requestRecommendation error:', error);
    throw new Error('Kon geen groei-aanbeveling genereren.');
  }

  return fromRow(data as GrowthRecommendationRow);
}

/**
 * Haal alle aanbevelingen op voor een klas (voor teacher overzicht).
 */
export async function getKlasRecommendations(
  studentIds: string[],
  schoolYear: number,
): Promise<GrowthRecommendation[]> {
  if (studentIds.length === 0) return [];

  const { data, error } = await recommendationsTable()
    .select('*')
    .in('user_id', studentIds)
    .eq('school_year', schoolYear);

  if (error) {
    logger.error('[growthRecommendationService] getKlasRecommendations error:', error);
    return [];
  }

  return ((data as GrowthRecommendationRow[]) ?? []).map(fromRow);
}
