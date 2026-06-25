const CURRENT_CONSENT_VERSION = "1.0";

type SupabaseLikeClient = {
  from: (table: string) => QueryBuilder;
};

type QueryResult = {
  data: Record<string, unknown> | null;
  error: { message?: string } | null;
};

type QueryBuilder = PromiseLike<QueryResult> & {
  select: (columns: string) => QueryBuilder;
  eq: (column: string, value: string) => QueryBuilder;
  maybeSingle: () => QueryBuilder;
};

type SupabaseUserLike = {
  id: string;
  app_metadata?: Record<string, unknown>;
};

const PROCESSING_RESTRICTED_REASON = "Verwerking is beperkt voor dit account.";

function jsonError(
  status: number,
  error: string,
  reason: string,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(
    JSON.stringify({ error, reason }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

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

export async function ensureProcessingNotRestricted(
  supabase: SupabaseLikeClient,
  user: SupabaseUserLike,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const { data, error } = await supabase
    .from("users")
    .select("processing_restricted, processing_restricted_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[consent] processing restriction check failed:", error.message ?? error);
    return jsonError(
      500,
      "processing_restriction_check_failed",
      "Verwerkingsstatus kon niet worden gecontroleerd.",
      corsHeaders,
    );
  }

  if (data?.processing_restricted === true) {
    return jsonError(
      403,
      "processing_restricted",
      PROCESSING_RESTRICTED_REASON,
      corsHeaders,
    );
  }

  return null;
}

export async function ensureAiInteractionConsent(
  supabase: SupabaseLikeClient,
  user: SupabaseUserLike,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const restrictionRejection = await ensureProcessingNotRestricted(supabase, user, corsHeaders);
  if (restrictionRejection) return restrictionRejection;

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
    return jsonError(
      403,
      "ai_consent_required",
      "AI-toestemming ontbreekt of is ingetrokken.",
      corsHeaders,
    );
  }

  return null;
}
