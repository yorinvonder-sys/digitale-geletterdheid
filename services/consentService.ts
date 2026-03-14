// Consent management service (AVG Art. 8)
// Beheert toestemming voor data processing, AI interactie, analytics en peer feedback.
//
// NB: student_consents tabel wordt aangemaakt via migratie 20260314300000.
// Tot de database types opnieuw gegenereerd zijn, gebruiken we `as any` casts
// op supabase.from() calls. Dit is veilig zolang de migratie is gedraaid.

import { supabase } from './supabase';
import { logger } from '../utils/logger';

export type ConsentType = 'data_processing' | 'ai_interaction' | 'analytics' | 'peer_feedback';
export type GrantedBy = 'student' | 'parent' | 'school';

export interface StudentConsent {
  id: string;
  student_id: string;
  school_id: string;
  consent_type: ConsentType;
  granted: boolean;
  granted_by: GrantedBy;
  granted_at: string | null;
  revoked_at: string | null;
  parent_email: string | null;
  parent_name: string | null;
  ip_address: string | null;
  consent_version: string;
  created_at: string;
  updated_at: string;
}

export interface ConsentStatus {
  consentType: ConsentType;
  label: string;
  description: string;
  granted: boolean;
  required: boolean;
  grantedBy: GrantedBy | null;
  grantedAt: string | null;
  consentVersion: string;
  needsRenewal: boolean;
}

const CURRENT_CONSENT_VERSION = '1.0';

const CONSENT_META: Record<ConsentType, { label: string; description: string; required: boolean }> = {
  data_processing: {
    label: 'Verwerking van je leergegevens',
    description: 'We slaan je voortgang, scores en gemaakte opdrachten op zodat jij en je docent kunnen zien hoe het gaat.',
    required: true,
  },
  ai_interaction: {
    label: 'Interactie met AI Mentor',
    description: 'Je kunt chatten met een AI-mentor die je helpt bij opdrachten. De AI onthoudt geen persoonlijke gegevens na de sessie.',
    required: true,
  },
  analytics: {
    label: 'Anonieme gebruiksstatistieken',
    description: 'We verzamelen anonieme gegevens over hoe het platform wordt gebruikt, om het beter te maken. Hier staat geen persoonlijke informatie in.',
    required: false,
  },
  peer_feedback: {
    label: 'Feedback van klasgenoten',
    description: 'Klasgenoten kunnen feedback geven op jouw werk, en jij op dat van hen. Je naam is zichtbaar voor je klas.',
    required: false,
  },
};

// Supabase client cast — student_consents tabel nog niet in generated types
const consentTable = () => (supabase as any).from('student_consents');

/** Alle consents ophalen voor een leerling */
export async function getStudentConsents(studentId: string): Promise<StudentConsent[]> {
  const { data, error } = await consentTable()
    .select('*')
    .eq('student_id', studentId);

  if (error) {
    logger.error('[consentService] getStudentConsents error:', error);
    return [];
  }
  return (data as StudentConsent[]) ?? [];
}

/** Consent geven */
export async function grantConsent(
  consentType: ConsentType,
  grantedBy: GrantedBy,
  schoolId: string,
  parentEmail?: string,
  parentName?: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Niet ingelogd.' };

  const { error } = await consentTable()
    .upsert({
      student_id: user.id,
      school_id: schoolId,
      consent_type: consentType,
      granted: true,
      granted_by: grantedBy,
      granted_at: new Date().toISOString(),
      revoked_at: null,
      parent_email: parentEmail ?? null,
      parent_name: parentName ?? null,
      consent_version: CURRENT_CONSENT_VERSION,
    }, {
      onConflict: 'student_id,consent_type',
    });

  if (error) {
    logger.error('[consentService] grantConsent error:', error);
    return { success: false, error: 'Kon toestemming niet opslaan.' };
  }
  return { success: true };
}

/** Consent intrekken */
export async function revokeConsent(consentType: ConsentType): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Niet ingelogd.' };

  const { error } = await consentTable()
    .update({
      granted: false,
      revoked_at: new Date().toISOString(),
    })
    .eq('student_id', user.id)
    .eq('consent_type', consentType);

  if (error) {
    logger.error('[consentService] revokeConsent error:', error);
    return { success: false, error: 'Kon toestemming niet intrekken.' };
  }
  return { success: true };
}

/** Heeft de leerling consent voor een bepaald type? */
export async function hasConsent(studentId: string, consentType: ConsentType): Promise<boolean> {
  const { data, error } = await consentTable()
    .select('granted, consent_version')
    .eq('student_id', studentId)
    .eq('consent_type', consentType)
    .single();

  if (error || !data) return false;
  if ((data as any).consent_version !== CURRENT_CONSENT_VERSION) return false;
  return (data as any).granted === true;
}

/** Is ouderlijke toestemming nodig? (AVG Art. 8: <16 jaar in NL) */
export function needsParentalConsent(studentAge: number): boolean {
  return studentAge < 16;
}

/** Stuur ouderlijke toestemmingsmail via edge function */
export async function sendParentalConsentEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  schoolName: string,
  consentTypes: ConsentType[] = ['data_processing', 'ai_interaction'],
): Promise<{ success: boolean; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: 'Niet ingelogd.' };

  try {
    const { data, error } = await supabase.functions.invoke('sendConsentEmail', {
      body: { parentEmail, parentName, studentName, schoolName, consentTypes },
    });

    if (error) {
      logger.error('[consentService] sendParentalConsentEmail error:', error);
      return { success: false, error: 'Kon e-mail niet versturen.' };
    }

    return { success: (data as any)?.success === true };
  } catch (err) {
    logger.error('[consentService] sendParentalConsentEmail unexpected error:', err);
    return { success: false, error: 'Er ging iets mis bij het versturen van de e-mail.' };
  }
}

/** Overzicht van alle consent types met status */
export async function getConsentStatus(studentId: string): Promise<ConsentStatus[]> {
  const consents = await getStudentConsents(studentId);

  return (Object.keys(CONSENT_META) as ConsentType[]).map((type) => {
    const meta = CONSENT_META[type];
    const consent = consents.find((c) => c.consent_type === type);

    return {
      consentType: type,
      label: meta.label,
      description: meta.description,
      required: meta.required,
      granted: consent?.granted === true,
      grantedBy: (consent?.granted_by as GrantedBy) ?? null,
      grantedAt: consent?.granted_at ?? null,
      consentVersion: consent?.consent_version ?? CURRENT_CONSENT_VERSION,
      needsRenewal: consent ? consent.consent_version !== CURRENT_CONSENT_VERSION : false,
    };
  });
}

export { CONSENT_META, CURRENT_CONSENT_VERSION };
