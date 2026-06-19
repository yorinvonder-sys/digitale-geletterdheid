const CURRENT_CONSENT_VERSION = "1.0";

type SupabaseLikeClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => any;
    };
  };
  rpc: (fn: string, params?: Record<string, unknown>) => any;
};

// 13+ leeftijdspoort: Mistral (Commercial Terms §2.2(c)) en Black Forest Labs
// (ToS §1.2) staan <13 niet toe — ouderlijke toestemming heft dit niet op.
// Gefaseerde uitrol: alleen handhaven wanneer AI_AGE_GATE_ENFORCED=true (nadat
// de school geboortedata heeft ingevuld). Default uit = ongewijzigd gedrag.
export function ageGateEnforced(): boolean {
  return (globalThis.Deno?.env.get("AI_AGE_GATE_ENFORCED") ?? "").toLowerCase() === "true";
}

type SupabaseUserLike = {
  id: string;
  app_metadata?: Record<string, unknown>;
};

function getRole(user: SupabaseUserLike): string | null {
  const role = user.app_metadata?.role;
  if (role === "student" || role === "teacher" || role === "admin" || role === "developer") {
    return role;
  }
  if (user.app_metadata?.admin === true) {
    return "admin";
  }
  return null;
}

export async function ensureAiInteractionConsent(
  supabase: SupabaseLikeClient,
  user: SupabaseUserLike,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const role = getRole(user);

  if (role === "teacher" || role === "admin" || role === "developer") {
    return null;
  }

  // 13+ leeftijdspoort (fail-closed): leerlingen <13 of zonder bekende
  // geboortedatum krijgen geen AI-toegang. Alleen actief als de school de
  // geboortedata heeft ingevuld en AI_AGE_GATE_ENFORCED=true is gezet.
  if (ageGateEnforced()) {
    const { data: ageOk, error: ageError } = await supabase.rpc("student_ai_age_ok");
    if (ageError || ageOk !== true) {
      return new Response(
        JSON.stringify({
          error: "ai_age_restricted",
          reason: "AI-functies zijn alleen beschikbaar voor leerlingen van 13 jaar en ouder.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  const { data, error } = await supabase
    .from("student_consents")
    .select("granted, revoked_at, consent_version")
    .eq("student_id", user.id)
    .eq("consent_type", "ai_interaction")
    .maybeSingle();

  if (error || !data || data.granted !== true || data.revoked_at || data.consent_version !== CURRENT_CONSENT_VERSION) {
    return new Response(
      JSON.stringify({
        error: "ai_consent_required",
        reason: "AI-toestemming ontbreekt of is ingetrokken.",
      }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return null;
}
