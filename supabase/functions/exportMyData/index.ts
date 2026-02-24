/**
 * exportMyData — AVG Art. 20 (Right to Data Portability)
 * Exports all personal data for the authenticated user as structured JSON.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = new Set([
  'https://dgskills.app',
  'https://www.dgskills.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://dgskills.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authenticatie vereist.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Ongeldige sessie.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uid = user.id;

    const [
      profileRes, missionRes, xpRes, sharedProjectsRes, sharedGamesRes,
      feedbackRes, activitiesRes, auditRes, surveysRes, surveyFeedbackRes,
      messagesRes, libraryRes, duelsRes, devTasksRes, devMilestonesRes,
      devPlansRes, devSettingsRes,
    ] = await Promise.all([
      supabase.from('users').select('*').eq('id', uid).single(),
      supabase.from('mission_progress').select('*').eq('user_id', uid),
      supabase.from('xp_transactions').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(500),
      supabase.from('shared_projects').select('*').eq('user_id', uid),
      supabase.from('shared_games').select('*').eq('user_id', uid),
      supabase.from('feedback').select('*').eq('user_id', uid),
      supabase.from('student_activities').select('*').eq('user_id', uid).order('timestamp', { ascending: false }).limit(1000),
      supabase.from('audit_logs').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(500),
      supabase.from('ai_beleid_surveys').select('*').eq('user_id', uid),
      supabase.from('ai_beleid_feedback').select('*').eq('user_id', uid),
      supabase.from('teacher_messages').select('*').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`),
      supabase.from('library_items').select('*').eq('user_id', uid),
      supabase.from('duel_challenges').select('*').or(`challenger_id.eq.${uid},challenged_id.eq.${uid}`),
      supabase.from('developer_tasks').select('*').eq('user_id', uid),
      supabase.from('developer_milestones').select('*').eq('user_id', uid),
      supabase.from('developer_plans').select('*').eq('user_id', uid),
      supabase.from('developer_settings').select('*').eq('user_id', uid).single(),
    ]);

    const exportDate = new Date().toISOString();
    const payload = {
      _meta: {
        export_date: exportDate,
        user_id: uid,
        email: user.email,
        schema_version: '2.0',
        gdpr_basis: 'AVG Art. 20 — Recht op gegevensoverdraagbaarheid',
        note: 'Dit bestand bevat alle persoonlijke gegevens die DGSkills over u heeft opgeslagen.',
      },
      profile: profileRes.data ?? null,
      mission_progress: missionRes.data ?? [],
      xp_transactions: xpRes.data ?? [],
      shared_projects: sharedProjectsRes.data ?? [],
      shared_games: sharedGamesRes.data ?? [],
      feedback: feedbackRes.data ?? [],
      student_activities: activitiesRes.data ?? [],
      audit_logs: auditRes.data ?? [],
      ai_beleid_surveys: surveysRes.data ?? [],
      ai_beleid_feedback: surveyFeedbackRes.data ?? [],
      teacher_messages: messagesRes.data ?? [],
      library_items: libraryRes.data ?? [],
      duel_history: duelsRes.data ?? [],
      developer_tasks: devTasksRes.data ?? [],
      developer_milestones: devMilestonesRes.data ?? [],
      developer_plans: devPlansRes.data ?? [],
      developer_settings: devSettingsRes.data ?? null,
    };

    await supabase.from('audit_logs').insert({
      user_id: uid,
      action: 'gdpr_data_export',
      metadata: { export_date: exportDate, schema_version: '2.0' },
    });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mijn-data-${exportDate.split('T')[0]}.json"`,
      },
    });
  } catch (err) {
    console.error('[exportMyData]', err);
    return new Response(JSON.stringify({ error: 'Data export mislukt. Probeer later opnieuw.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
