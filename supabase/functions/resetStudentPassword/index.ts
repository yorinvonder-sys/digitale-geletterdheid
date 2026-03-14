import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PRIVILEGED_ROLES = new Set(['teacher', 'admin', 'developer']);
const COMMON_PASSWORDS = new Set([
  'welkom123456',
  'wachtwoord12',
  'wachtwoord123',
  'password1234',
  'password12345',
  'qwerty123456',
  'admin1234567',
  'letmein12345',
  'welkom01welkom',
  'school123456',
  'leerling12345',
  'docent123456',
  'test12345678',
  '123456789012',
  'abcdefghijkl',
]);

interface ResetStudentPasswordBody {
  studentUid?: string;
  customPassword?: string;
}

function decodeJwtClaims(authHeader: string | null): Record<string, unknown> | null {
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.slice('Bearer '.length).trim();
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function validatePassword(password: string | undefined): string | null {
  if (!password || typeof password !== 'string') {
    return 'Nieuw wachtwoord ontbreekt.';
  }

  if (password.length < 12) return 'Wachtwoord moet minimaal 12 tekens bevatten.';
  if (!/[a-z]/.test(password)) return 'Wachtwoord moet minimaal één kleine letter bevatten.';
  if (!/[A-Z]/.test(password)) return 'Wachtwoord moet minimaal één hoofdletter bevatten.';
  if (!/\d/.test(password)) return 'Wachtwoord moet minimaal één cijfer bevatten.';
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'Kies een minder voorspelbaar wachtwoord.';
  if (/(.)\1{3,}/.test(password)) return 'Gebruik niet meer dan 3 dezelfde tekens achter elkaar.';

  return null;
}

serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req, 'POST, OPTIONS');
  const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
  if (rejectedOrigin) return rejectedOrigin;

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authenticatie vereist.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claims = decodeJwtClaims(authHeader);
    if (claims?.aal !== 'aal2') {
      return new Response(JSON.stringify({ error: 'MFA-verificatie is vereist voor wachtwoordresets.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Ongeldige sessie.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerRole = user.app_metadata?.role;
    if (typeof callerRole !== 'string' || !PRIVILEGED_ROLES.has(callerRole)) {
      return new Response(JSON.stringify({ error: 'Geen toegang tot docentbeheer.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerSchoolId = typeof user.app_metadata?.schoolId === 'string'
      ? user.app_metadata.schoolId
      : null;
    if (!callerSchoolId) {
      return new Response(JSON.stringify({ error: 'Schoolkoppeling ontbreekt voor deze beheerder.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json() as ResetStudentPasswordBody;
    const studentUid = typeof body.studentUid === 'string' ? body.studentUid.trim() : '';
    const passwordError = validatePassword(body.customPassword);

    if (!studentUid) {
      return new Response(JSON.stringify({ error: 'Leerling-ID ontbreekt.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (passwordError) {
      return new Response(JSON.stringify({ error: passwordError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const [{ data: targetUserData, error: targetAuthError }, { data: profile, error: profileError }] = await Promise.all([
      adminClient.auth.admin.getUserById(studentUid),
      adminClient.from('users').select('id, school_id, display_name').eq('id', studentUid).single(),
    ]);

    if (targetAuthError || !targetUserData?.user || profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Leerling niet gevonden.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const targetRole = targetUserData.user.app_metadata?.role;
    if (targetRole && targetRole !== 'student') {
      return new Response(JSON.stringify({ error: 'Alleen leerlingaccounts mogen via dit scherm worden gereset.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (profile.school_id !== callerSchoolId) {
      return new Response(JSON.stringify({ error: 'Je mag alleen leerlingen uit je eigen school resetten.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(studentUid, {
      password: body.customPassword!,
    });

    if (updateAuthError) {
      console.error('[resetStudentPassword] auth update failed:', updateAuthError);
      return new Response(JSON.stringify({ error: 'Wachtwoord resetten mislukt.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date().toISOString();
    const [{ error: profileUpdateError }, { error: trustRevokeError }, { error: auditError }] = await Promise.all([
      adminClient
        .from('users')
        .update({ must_change_password: true, updated_at: now })
        .eq('id', studentUid),
      adminClient.rpc('revoke_all_mfa_trust', { p_user_id: studentUid }),
      adminClient.from('audit_logs').insert({
        user_id: studentUid,
        action: 'teacher_password_reset',
        metadata: {
          reset_at: now,
          initiated_by: user.id,
          initiated_by_role: callerRole,
          student_display_name: profile.display_name ?? null,
        },
      }),
    ]);

    if (profileUpdateError) {
      console.error('[resetStudentPassword] profile update failed:', profileUpdateError);
    }
    if (trustRevokeError) {
      console.error('[resetStudentPassword] MFA trust revoke failed:', trustRevokeError);
    }
    if (auditError) {
      console.error('[resetStudentPassword] audit log failed:', auditError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[resetStudentPassword] unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Wachtwoord resetten mislukt.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
