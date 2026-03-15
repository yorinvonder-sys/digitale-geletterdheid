// Nulmeting (Digitale Escaperoom) service
// Beheert het opslaan en ophalen van nulmeting-resultaten.
//
// NB: nulmeting_results tabel wordt aangemaakt via migratie 20260315400000.
// Tot de database types opnieuw gegenereerd zijn, gebruiken we `as any` casts
// op supabase.from() calls. Dit is veilig zolang de migratie is gedraaid.

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type { NulmetingResult, KamerScore } from '@/components/assessment/escaperoom/types';

// Supabase client cast — nulmeting_results tabel nog niet in generated types
const nulmetingTable = () => (supabase as any).from('nulmeting_results');

/** Database rij-type voor nulmeting_results */
interface NulmetingRow {
  id: string;
  user_id: string;
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
function toRow(userId: string, result: NulmetingResult): Omit<NulmetingRow, 'id' | 'created_at'> {
  return {
    user_id: userId,
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
function fromRow(row: NulmetingRow): NulmetingResult {
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

/** Sla een nulmeting-resultaat op (upsert: insert of update als er al een bestaat) */
export async function saveNulmetingResult(
  userId: string,
  result: NulmetingResult,
): Promise<void> {
  const row = toRow(userId, result);

  const { error } = await nulmetingTable()
    .upsert(row, { onConflict: 'user_id' });

  if (error) {
    logger.error('[nulmetingService] saveNulmetingResult error:', error);
    throw new Error('Kon nulmeting-resultaat niet opslaan.');
  }
}

/** Haal het nulmeting-resultaat op voor een leerling */
export async function getNulmetingResult(
  userId: string,
): Promise<NulmetingResult | null> {
  const { data, error } = await nulmetingTable()
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // PGRST116 = no rows found, dat is geen fout
    if (error.code === 'PGRST116') return null;
    logger.error('[nulmetingService] getNulmetingResult error:', error);
    return null;
  }

  return fromRow(data as NulmetingRow);
}

/** Haal nulmeting-resultaten op voor een hele klas (voor teacher dashboard) */
export async function getKlasNulmetingResults(
  studentIds: string[],
): Promise<Array<{ userId: string; result: NulmetingResult }>> {
  if (studentIds.length === 0) return [];

  const { data, error } = await nulmetingTable()
    .select('*')
    .in('user_id', studentIds);

  if (error) {
    logger.error('[nulmetingService] getKlasNulmetingResults error:', error);
    return [];
  }

  return ((data as NulmetingRow[]) ?? []).map((row) => ({
    userId: row.user_id,
    result: fromRow(row),
  }));
}

/** Snelle check: heeft de leerling de nulmeting al afgerond? */
export async function hasCompletedNulmeting(
  userId: string,
): Promise<boolean> {
  const { data, error } = await nulmetingTable()
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return !!data;
}
