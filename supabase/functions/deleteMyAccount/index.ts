/**
 * deleteMyAccount — AVG Art. 17 (Right to Erasure)
 *
 * Permanently deletes the authenticated user's account and ALL associated
 * data via the CASCADE constraints in 20260222_cascade_delete_policies.sql.
 *
 * Flow:
 *  1. Verify JWT
 *  2. Write final audit log entry
 *  3. Delete from public.users (CASCADE handles all child tables)
 *  4. Delete from auth.users via Supabase Admin API
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

    // User-scoped client to verify identity
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

    // Admin client for privileged operations (service role key never exposed to client)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Write final audit entry before deletion
    await adminClient.from('audit_logs').insert({
      user_id: uid,
      action: 'gdpr_account_deletion_initiated',
      metadata: {
        deleted_at: new Date().toISOString(),
        basis: 'AVG Art. 17 — Recht op verwijdering',
        initiated_by: 'user_self_service',
      },
    });

    // Delete from public.users — CASCADE handles all 28 child tables automatically
    const { error: deleteError } = await adminClient
      .from('users')
      .delete()
      .eq('id', uid);

    if (deleteError) {
      console.error('[deleteMyAccount] public.users delete failed:', deleteError);
      return new Response(JSON.stringify({ error: 'Account verwijderen mislukt. Neem contact op met support.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete from auth.users (requires service role)
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(uid);
    if (authDeleteError) {
      console.error('[deleteMyAccount] auth.users delete failed:', authDeleteError);
      // public data is already gone — log and return partial success
      return new Response(JSON.stringify({
        success: true,
        warning: 'Profieldata verwijderd. Auth-account wordt binnen 24u verwijderd.',
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Je account en alle bijbehorende gegevens zijn permanent verwijderd.',
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[deleteMyAccount]', err);
    return new Response(JSON.stringify({ error: 'Account verwijderen mislukt. Probeer later opnieuw.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
