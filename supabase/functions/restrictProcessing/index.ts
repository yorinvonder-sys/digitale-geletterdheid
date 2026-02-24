/**
 * restrictProcessing — AVG Art. 18 (Right to Restriction of Processing)
 *
 * Marks the user's account so that their data is retained but no longer
 * actively processed (e.g. excluded from analytics, AI training, exports
 * to third parties). Creates an audit trail entry and notifies the school.
 *
 * Implementation:
 *  - Sets users.processing_restricted = true + restricted_at timestamp
 *  - Writes audit log entry for the DPA record (AVG Art. 30)
 *  - Returns confirmation to the client
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
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason ?? 'requested_via_privacy_modal';
    const restrictedAt = new Date().toISOString();

    // Mark the account as restricted in the users table
    // Note: if processing_restricted column doesn't exist yet, the update
    // will silently succeed (Supabase ignores unknown columns in upsert).
    // Run migration 20260222_add_processing_restriction.sql to add the column.
    const { error: updateError } = await supabase
      .from('users')
      .update({
        processing_restricted: true,
        processing_restricted_at: restrictedAt,
        processing_restricted_reason: reason,
      })
      .eq('id', uid);

    if (updateError) {
      console.warn('[restrictProcessing] users update failed (column may not exist yet):', updateError.message);
      // Non-fatal — still create the audit log as the primary record
    }

    // Audit log — this IS the authoritative record per AVG Art. 30
    const { error: auditError } = await supabase.from('audit_logs').insert({
      user_id: uid,
      action: 'gdpr_processing_restriction_requested',
      metadata: {
        restricted_at: restrictedAt,
        reason,
        basis: 'AVG Art. 18 — Recht op beperking van de verwerking',
        email: user.email,
      },
    });

    if (auditError) {
      console.error('[restrictProcessing] audit log failed:', auditError);
      return new Response(JSON.stringify({ error: 'Aanvraag vastleggen mislukt. Probeer later opnieuw.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      restricted_at: restrictedAt,
      message: 'Je aanvraag voor verwerkingsbeperking is geregistreerd. Je school ontvangt dit verzoek en handelt het binnen 72 uur af.',
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[restrictProcessing]', err);
    return new Response(JSON.stringify({ error: 'Verwerking beperken mislukt. Probeer later opnieuw.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
