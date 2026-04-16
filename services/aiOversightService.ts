/**
 * aiOversightService — EU AI Act Art. 12 + 14
 *
 * Art. 12: Traceerbaarheid van AI-gegenereerde SLO-percentage-bepalingen.
 *          Gebruik `logAiAssessmentBatch()` aan het einde van de mission-
 *          completion flow (nog niet gekoppeld aan UI — zie JSDoc).
 *
 * Art. 14: Human oversight — docenten kunnen een AI-uitgerekend SLO-percentage
 *          overrulen via `SloOverrideModal`. De override + verplichte reden
 *          worden vastgelegd via `logOversightEvent({ eventType: 'teacher_override', ... })`.
 *
 * Security-notities:
 *  - `reasoning` wordt client-side gevalideerd (10–2000 tekens); de database
 *    bevat een CHECK constraint als laatste verdedigingslinie.
 *  - Geen PII buiten school-scope: student_uid en teacher_uid zijn uuid's;
 *    `reasoning` is vrije tekst en mag namen bevatten (docent-keuze, zie DPIA).
 *  - RLS op `ai_oversight_events` beperkt lezen + schrijven tot eigen school.
 *  - Foutmeldingen naar de gebruiker zijn generiek (geen stack traces).
 */

import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export type OversightEventType =
  | 'ai_assessment_generated'
  | 'teacher_override'
  | 'teacher_review_acknowledged';

export interface LogOversightEventInput {
  eventType: OversightEventType;
  schoolId: string | null;
  studentUid: string | null;
  sloCode?: string;
  /** De AI-berekende waarde, bijv. { percentage: 72, completed: 5, total: 7 } */
  aiValue?: unknown;
  /** De door de docent opgegeven correctiewaarde, bijv. { percentage: 85 } */
  overrideValue?: unknown;
  /** Verplichte reden bij teacher_override (min 10, max 2000 tekens). */
  reasoning?: string;
  missionId?: string;
}

export interface OversightEventRow {
  id: string;
  created_at: string;
  school_id: string | null;
  teacher_uid: string;
  student_uid: string | null;
  event_type: OversightEventType;
  slo_code: string | null;
  ai_value: unknown | null;
  override_value: unknown | null;
  reasoning: string | null;
  mission_id: string | null;
}

// ── Validatie ─────────────────────────────────────────────────────────────────

const REASONING_MIN = 10;
const REASONING_MAX = 2000;

function validateReasoning(reasoning: string | undefined, required: boolean): string | null {
  if (required && (!reasoning || reasoning.trim().length < REASONING_MIN)) {
    return `Reden is verplicht (minimaal ${REASONING_MIN} tekens).`;
  }
  if (reasoning && reasoning.length > REASONING_MAX) {
    return `Reden mag maximaal ${REASONING_MAX} tekens bevatten.`;
  }
  return null;
}

// ── Core: log één oversight event ────────────────────────────────────────────

/**
 * Logt een AI oversight event naar `ai_oversight_events`.
 *
 * Bij `teacher_override` is `reasoning` verplicht (min 10 tekens).
 *
 * @returns `{ ok: true, id }` bij succes, `{ ok: false, error }` bij fout.
 */
export async function logOversightEvent(
  input: LogOversightEventInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { eventType, schoolId, studentUid, sloCode, aiValue, overrideValue, reasoning, missionId } = input;

  // Valideer reasoning
  const reasoningError = validateReasoning(reasoning, eventType === 'teacher_override');
  if (reasoningError) {
    return { ok: false, error: reasoningError };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'Niet ingelogd. Log opnieuw in.' };
  }

  try {
    const { data, error } = await (supabase as any)
      .from('ai_oversight_events')
      .insert({
        school_id: schoolId ?? null,
        teacher_uid: user.id,
        student_uid: studentUid ?? null,
        event_type: eventType,
        slo_code: sloCode ?? null,
        ai_value: aiValue !== undefined ? aiValue : null,
        override_value: overrideValue !== undefined ? overrideValue : null,
        reasoning: reasoning ?? null,
        mission_id: missionId ?? null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[aiOversightService] Insert failed:', error);
      return { ok: false, error: 'Opslaan mislukt. Controleer je verbinding en probeer opnieuw.' };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('[aiOversightService] Unexpected error:', err);
    return { ok: false, error: 'Er is een onverwachte fout opgetreden. Probeer opnieuw.' };
  }
}

// ── Art. 12: batch-insert voor AI assessment generations ─────────────────────

/**
 * Logt een batch van AI-gegenereerde SLO-beoordelingen.
 *
 * **Koppeling:** Dit wordt later opgeroepen vanuit de mission-completion flow
 * (bijv. in `missionService.ts` of de edge function die `mission_complete`
 * registreert). Roep deze functie aan nadat `calculateStudentKerndoelStats`
 * de percentages heeft berekend op basis van de zojuist voltooide missie.
 *
 * Voorbeeld:
 * ```ts
 * await logAiAssessmentBatch([{
 *   eventType: 'ai_assessment_generated',
 *   schoolId: student.schoolId,
 *   studentUid: student.uid,
 *   sloCode: '21A',
 *   aiValue: { percentage: 72, completed: 5, total: 7 },
 *   missionId: 'prompt-master',
 * }]);
 * ```
 *
 * Stille fout (gooit niet): audit-logging mag de app-flow nooit blokkeren.
 */
export async function logAiAssessmentBatch(
  events: Array<Omit<LogOversightEventInput, 'eventType'> & { eventType: 'ai_assessment_generated' }>
): Promise<void> {
  if (events.length === 0) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn('[aiOversightService] logAiAssessmentBatch: no authenticated user, skipping.');
    return;
  }

  const rows = events.map(({ eventType, schoolId, studentUid, sloCode, aiValue, overrideValue, reasoning, missionId }) => ({
    school_id: schoolId ?? null,
    teacher_uid: user.id,
    student_uid: studentUid ?? null,
    event_type: eventType,
    slo_code: sloCode ?? null,
    ai_value: aiValue !== undefined ? aiValue : null,
    override_value: overrideValue !== undefined ? overrideValue : null,
    reasoning: reasoning ?? null,
    mission_id: missionId ?? null,
  }));

  try {
    const { error } = await (supabase as any)
      .from('ai_oversight_events')
      .insert(rows);

    if (error) {
      console.error('[aiOversightService] Batch insert failed:', error);
    }
  } catch (err) {
    console.error('[aiOversightService] Batch insert unexpected error:', err);
  }
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Haalt alle oversight events op voor een specifieke leerling.
 * RLS beperkt automatisch tot de eigen school van de ingelogde docent.
 */
export async function fetchOversightEventsForStudent(
  studentUid: string,
  schoolId?: string
): Promise<OversightEventRow[]> {
  try {
    let query = (supabase as any)
      .from('ai_oversight_events')
      .select('*')
      .eq('student_uid', studentUid)
      .order('created_at', { ascending: false });

    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[aiOversightService] fetchOversightEventsForStudent failed:', error);
      return [];
    }
    return (data ?? []) as OversightEventRow[];
  } catch (err) {
    console.error('[aiOversightService] Unexpected error in fetchOversightEventsForStudent:', err);
    return [];
  }
}

/**
 * Haalt de meest recente teacher_override events op voor een school.
 * Handig voor een overzichtspagina met recente correcties (Art. 14 audit trail).
 */
export async function fetchRecentOverrides(
  schoolId: string,
  limit = 50
): Promise<OversightEventRow[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('ai_oversight_events')
      .select('*')
      .eq('school_id', schoolId)
      .eq('event_type', 'teacher_override')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[aiOversightService] fetchRecentOverrides failed:', error);
      return [];
    }
    return (data ?? []) as OversightEventRow[];
  } catch (err) {
    console.error('[aiOversightService] Unexpected error in fetchRecentOverrides:', err);
    return [];
  }
}
