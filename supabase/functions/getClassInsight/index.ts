/**
 * Edge Function: /getClassInsight — AI-gegenereerde samenvatting van klassituatie voor docenten
 *
 * Privacy-by-design:
 * - GEEN namen of user-ids worden naar Mistral gestuurd
 * - Alleen anonieme geaggregeerde tellingen (per missie) gaan naar de AI
 * - Leerlingdata wordt opgehaald via de docent-JWT (RLS scoped op school)
 *
 * Security lagen:
 * 1. CORS-check (alleen dgskills.app + lokale dev)
 * 2. JWT auth verificatie (Supabase)
 * 3. Teacher-rolcheck via app_metadata (PRIVILEGED_ROLES)
 * 4. Server-side rate limiting (5 req/uur per user)
 * 5. Input validatie (studentClass: max 50 chars, alfanumeriek)
 * 6. Mistral API server-side — API key nooit naar client
 * 7. Geen PII in logs
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { completeMistralJson, extractJsonObject, getMistralTextModel } from "../_shared/mistralClient.ts";
import { logAiUsageEvent, getUserSchoolId, resolveAiRequestId } from "../_shared/aiUsageLogger.ts";

const PRIVILEGED_ROLES = new Set(["teacher", "admin", "developer"]);

// Missie is "vastgelopen" als in_progress én langer dan 7 dagen niet bijgewerkt
const STUCK_THRESHOLD_DAYS = 7;
const STUCK_THRESHOLD_MS = STUCK_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

// k-anonimiteit (AVG Overweging 26 / Art. 5(1)(c) dataminimalisatie):
// stuur alleen geaggregeerde cijfers naar de AI als de groep groot genoeg is
// dat een individuele leerling niet herleidbaar is (singling-out). Onder deze
// drempel gaat er NIETS naar Mistral.
const MIN_COHORT_SIZE = 5;

const SYSTEM_INSTRUCTION = `Je bent een onderwijsassistent voor een Nederlandse middelbare school.
Je krijgt ANONIEME statistieken over een klas: per missie hoeveel leerlingen gestart zijn, klaar zijn, of vastlopen.
Je hebt GEEN namen of persoonsgegevens. Analyseer de patronen en geef maximaal 3 aandachtspunten.

Elk aandachtspunt heeft:
- title: korte titel (max 8 woorden)
- observation: wat je ziet in de data (max 2 zinnen, concreet en feitelijk)
- suggestion: een concrete, uitvoerbare actie voor de docent (max 2 zinnen)

Antwoord UITSLUITEND in dit JSON-formaat:
{ "points": [{ "title": string, "observation": string, "suggestion": string }] }

Schrijf in het Nederlands. Wees direct en praktisch. Maximaal 3 punten.`;

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");

    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // --- JWT auth ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[getClassInsight] Missing SUPABASE_URL or SUPABASE_ANON_KEY");
        return new Response(
            JSON.stringify({ error: "Service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // Docent-JWT client: RLS (is_teacher_in_school / schoolscoping) geldt automatisch
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Teacher-rolcheck ---
    const callerRole = user.app_metadata?.role;
    if (typeof callerRole !== "string" || !PRIVILEGED_ROLES.has(callerRole)) {
        return new Response(
            JSON.stringify({ error: "Geen toegang. Deze functie is alleen beschikbaar voor docenten." }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Rate limiting: 5 per uur (dure AI-call) ---
    const rateCheck = await checkDurableRateLimit(user.id, { maxRequests: 5, windowMs: 3_600_000 }, authHeader);
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // --- Body parsen ---
    let body: { studentClass?: string } = {};
    try {
        body = await req.json();
    } catch {
        // Lege body is ok, studentClass is optioneel
    }

    // --- Input validatie: studentClass optioneel, max 50 chars, alfanumeriek + spatie/streepje ---
    const rawClass = body.studentClass;
    let studentClass: string | undefined;
    if (rawClass !== undefined) {
        if (typeof rawClass !== "string" || rawClass.length > 50) {
            return new Response(
                JSON.stringify({ error: "Ongeldige klas-invoer." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        const trimmed = rawClass.trim();
        if (trimmed && !/^[a-zA-Z0-9 \-]+$/.test(trimmed)) {
            return new Response(
                JSON.stringify({ error: "Ongeldige klas-invoer." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        studentClass = trimmed || undefined;
    }

    // --- Data ophalen via docent-JWT (RLS scoped op school) ---
    // Leerlingen ophalen
    let studentsQuery = supabase
        .from("users")
        .select("id, student_class")
        .eq("role", "student");

    if (studentClass) {
        studentsQuery = studentsQuery.eq("student_class", studentClass);
    }

    const { data: students, error: studentsError } = await studentsQuery;

    if (studentsError) {
        // RLS-fout kan betekenen dat de docent geen MFA heeft (AAL1 i.p.v. AAL2)
        console.error("[getClassInsight] students query error:", studentsError.message);
        const isMfaHint = studentsError.code === "42501" || studentsError.message?.toLowerCase().includes("policy");
        return new Response(
            JSON.stringify({
                error: "Kon leerlingdata niet ophalen.",
                note: isMfaHint
                    ? "Zet MFA aan om klas-inzicht te zien. Ga naar je accountinstellingen."
                    : "Probeer het later opnieuw.",
            }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const classSize = (students ?? []).length;

    // Geen leerlingen gevonden → vroeg retourneren
    if (classSize === 0) {
        return new Response(
            JSON.stringify({
                points: [],
                generatedAt: new Date().toISOString(),
                classScope: studentClass ?? "hele school",
                classSize: 0,
                note: "Geen voldoende data beschikbaar voor een samenvatting. Zijn er al leerlingen actief?",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(rateCheck) } },
        );
    }

    const studentIds = (students ?? []).map((s: { id: string; student_class: string | null }) => s.id);

    // Missievoortgang ophalen
    const { data: progressRows, error: progressError } = await supabase
        .from("mission_progress")
        .select("mission_id, status, updated_at, score")
        .in("user_id", studentIds);

    if (progressError) {
        console.error("[getClassInsight] mission_progress query error:", progressError.message);
        return new Response(
            JSON.stringify({
                error: "Kon voortgangsdata niet ophalen.",
                note: "Probeer het later opnieuw.",
            }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const rows = progressRows ?? [];

    // Lege voortgangsdata → vroeg retourneren
    if (rows.length === 0) {
        return new Response(
            JSON.stringify({
                points: [],
                generatedAt: new Date().toISOString(),
                classScope: studentClass ?? "hele school",
                classSize,
                note: "Geen voldoende data beschikbaar voor een samenvatting. Zijn er al leerlingen begonnen met missies?",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(rateCheck) } },
        );
    }

    // --- Server-side aggregatie — ANONIEME totalen per missie ---
    // GEEN user-ids, GEEN namen, ALLEEN tellingen
    const now = Date.now();

    interface MissionStats {
        missionId: string;
        started: number;
        completed: number;
        stuck: number;
        inProgress: number;
        totalDaysInactive: number;
        inProgressCount: number;
    }

    const missionMap = new Map<string, MissionStats>();

    for (const row of rows as { mission_id: string; status: string; updated_at: string; score: number | null }[]) {
        const { mission_id, status, updated_at } = row;

        if (!missionMap.has(mission_id)) {
            missionMap.set(mission_id, {
                missionId: mission_id,
                started: 0,
                completed: 0,
                stuck: 0,
                inProgress: 0,
                totalDaysInactive: 0,
                inProgressCount: 0,
            });
        }

        const stats = missionMap.get(mission_id)!;

        if (status === "in_progress" || status === "completed") {
            stats.started++;
        }

        if (status === "completed") {
            stats.completed++;
        }

        if (status === "in_progress") {
            stats.inProgress++;
            const updatedMs = updated_at ? new Date(updated_at).getTime() : 0;
            const msInactive = updatedMs > 0 ? now - updatedMs : 0;

            if (msInactive > STUCK_THRESHOLD_MS) {
                stats.stuck++;
            }

            if (updatedMs > 0) {
                stats.totalDaysInactive += msInactive / (24 * 60 * 60 * 1000);
                stats.inProgressCount++;
            }
        }
    }

    // --- k-anonimiteit op klasniveau ---
    // Te kleine groep → individuele leerling herleidbaar. Geen AI-call.
    if (classSize < MIN_COHORT_SIZE) {
        return new Response(
            JSON.stringify({
                points: [],
                generatedAt: new Date().toISOString(),
                classScope: studentClass ?? "hele school",
                classSize,
                note: `Te weinig leerlingen in deze selectie (minimaal ${MIN_COHORT_SIZE} nodig) voor een anonieme samenvatting. Kies een grotere groep.`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(rateCheck) } },
        );
    }

    // --- k-anonimiteit op missieniveau ---
    // Alleen missies met een voldoende groot cohort tellen mee: één leerling op een
    // missie zou anders herleidbaar zijn, óók binnen een grote klas.
    const eligibleMissions = Array.from(missionMap.values())
        .filter((s) => s.started >= MIN_COHORT_SIZE)
        .map((s) => ({
            missionId: s.missionId,
            started: s.started,
            completed: s.completed,
            inProgress: s.inProgress,
            stuck: s.stuck,
            avgDaysInactive: s.inProgressCount > 0
                ? Math.round((s.totalDaysInactive / s.inProgressCount) * 10) / 10
                : 0,
            completionRate: s.started > 0 ? Math.round((s.completed / s.started) * 100) : 0,
            stuckRate: s.inProgress > 0 ? Math.round((s.stuck / s.inProgress) * 100) : 0,
        }));

    if (eligibleMissions.length === 0) {
        return new Response(
            JSON.stringify({
                points: [],
                generatedAt: new Date().toISOString(),
                classScope: studentClass ?? "hele school",
                classSize,
                note: `Nog te weinig leerlingen per missie (minimaal ${MIN_COHORT_SIZE}) voor een anonieme samenvatting.`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json", ...rateLimitHeaders(rateCheck) } },
        );
    }

    // Bouw anoniem statistieken-object voor Mistral.
    // GEEN user-ids, GEEN namen, GEEN echte klasnaam (die heeft de AI niet nodig).
    const aggregatedStats = {
        classSize,
        stuckThresholdDays: STUCK_THRESHOLD_DAYS,
        minCohortSize: MIN_COHORT_SIZE,
        missions: eligibleMissions,
    };

    // --- Mistral AI call ---
    const requestId = resolveAiRequestId(crypto.randomUUID());
    const schoolId = getUserSchoolId(user);
    const userContent = JSON.stringify(aggregatedStats);
    const model = getMistralTextModel();

    let result: { text: string; model: string; usagePayload: unknown };

    try {
        result = await completeMistralJson({
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user", content: userContent },
            ],
            temperature: 0.3,
            maxTokens: 1024,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[getClassInsight] Mistral error:", message);

        await logAiUsageEvent({
            requestId,
            endpoint: "getClassInsight",
            model,
            status: "error",
            provider: "mistral",
            userId: user.id,
            schoolId,
            inputChars: userContent.length,
            metadata: { classScope: studentClass ?? "hele school" },
        }).catch(() => {});

        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- JSON parsen en valideren ---
    let parsed: Record<string, unknown>;
    try {
        parsed = extractJsonObject(result.text);
    } catch {
        console.error("[getClassInsight] extractJsonObject failed, raw:", result.text.slice(0, 200));

        await logAiUsageEvent({
            requestId,
            endpoint: "getClassInsight",
            model,
            status: "error",
            provider: "mistral",
            userId: user.id,
            schoolId,
            inputChars: userContent.length,
            outputChars: result.text.length,
            usagePayload: result.usagePayload,
        }).catch(() => {});

        return new Response(
            JSON.stringify({ error: "AI-service gaf een onverwachte respons. Probeer opnieuw." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // Valideer en normaliseer points
    const rawPoints = Array.isArray(parsed.points) ? parsed.points : [];
    const points = rawPoints
        .filter((p: unknown): p is { title: string; observation: string; suggestion: string } =>
            typeof p === "object"
            && p !== null
            && typeof (p as Record<string, unknown>).title === "string"
            && typeof (p as Record<string, unknown>).observation === "string"
            && typeof (p as Record<string, unknown>).suggestion === "string"
        )
        .slice(0, 3)
        .map((p) => ({
            title: p.title.trim(),
            observation: p.observation.trim(),
            suggestion: p.suggestion.trim(),
        }));

    // --- AI usage loggen ---
    await logAiUsageEvent({
        requestId,
        endpoint: "getClassInsight",
        model,
        status: "ok",
        provider: "mistral",
        userId: user.id,
        schoolId,
        inputChars: userContent.length,
        outputChars: result.text.length,
        usagePayload: result.usagePayload,
        metadata: {
            classScope: studentClass ?? "hele school",
            classSize: classSize.toString(),
            pointsCount: points.length.toString(),
        },
    }).catch(() => {});

    return new Response(
        JSON.stringify({
            points,
            generatedAt: new Date().toISOString(),
            classScope: studentClass ?? "hele school",
            classSize,
        }),
        {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                ...rateLimitHeaders(rateCheck),
            },
        },
    );
});
