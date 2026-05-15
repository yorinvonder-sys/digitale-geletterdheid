const CURRENT_CONSENT_VERSION = "1.0";

type SupabaseLikeClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => any;
    };
  };
};

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
