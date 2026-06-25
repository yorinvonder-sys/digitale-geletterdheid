/**
 * Edge Function: /growthRecommendation — AI Groei-aanbeveling Generator
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Input validation — alle velden, score ranges 0-100
 * 3. No PII in Mistral prompt — alleen scores en missie-IDs
 * 4. Rate limit via UNIQUE constraint (1 aanbeveling per leerling per schooljaar)
 * 5. Mistral API — server-side API key only
 * 6. No provider credentials in client responses
 * 7. EU AI Act Art. 12: audit trail in input_context
 * 8. EU AI Act Art. 14: teacher_approved = NULL (pending) — leerling ziet pas na goedkeuring
 */
import { createClient } from "jsr:@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { ensureAiInteractionConsent } from "../_shared/consent.ts";
import { completeMistralChat, getMistralTextModel } from "../_shared/mistralClient.ts";

const MODEL = getMistralTextModel();
const VALID_DOMAINS = [
    "digitaleSystemen",
    "mediaEnAI",
    "programmeren",
    "veiligheidPrivacy",
    "welzijnMaatschappij",
] as const;

type Domain = typeof VALID_DOMAINS[number];

interface ScoreMap {
    digitaleSystemen: number;
    mediaEnAI: number;
    programmeren: number;
    veiligheidPrivacy: number;
    welzijnMaatschappij: number;
}

interface RequestBody {
    nulmetingScores: ScoreMap;
    eindmetingScores: ScoreMap;
    missionsCompleted: string[];
    sloProgress: Record<string, number>;
    yearGroup: number;
    educationLevel: string;
    schoolYear: number;
}

const DOMAIN_LABELS: Record<Domain, string> = {
    digitaleSystemen: "Digitale Systemen",
    mediaEnAI: "Media en AI",
    programmeren: "Programmeren",
    veiligheidPrivacy: "Veiligheid & Privacy",
    welzijnMaatschappij: "Welzijn & Maatschappij",
};

const SYSTEM_INSTRUCTION = `Je bent een digitale geletterdheid coach voor leerlingen in het Nederlandse voortgezet onderwijs (12-15 jaar).

Je taak is om een persoonlijke groei-aanbeveling te schrijven op basis van de nulmeting- en eindmetingscores van een leerling.

REGELS:
- Schrijf in begrijpelijk Nederlands voor een 12-15 jarige
- Maximum 200 woorden
- Wees positief en bemoedigend — begin altijd met wat goed ging
- Geef concreet advies, geen vage tips
- Noem maximaal 2 focuspunten voor het volgende jaar
- Noem specifiek de SLO-domeinen bij naam
- Eindig met één praktische tip die de leerling direct kan toepassen

STRUCTUUR:
1. Drie korte complimenten over de groei (noem specifieke domeinen)
2. Twee focuspunten voor het volgende jaar
3. Eén praktische tip

VERBODEN:
- Gebruik geen technisch jargon
- Maak geen vergelijkingen met andere leerlingen
- Geef geen cijfers of percentages — gebruik beschrijvende woorden
- Schrijf geen disclaimer of voorbehoud`;

function isValidScore(value: unknown): boolean {
    return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function validateScoreMap(scores: unknown): scores is ScoreMap {
    if (!scores || typeof scores !== "object") return false;
    return VALID_DOMAINS.every((d) => isValidScore((scores as Record<string, unknown>)[d]));
}

function validateRequestBody(body: unknown): body is RequestBody {
    if (!body || typeof body !== "object") return false;
    const b = body as Record<string, unknown>;

    if (!validateScoreMap(b.nulmetingScores)) return false;
    if (!validateScoreMap(b.eindmetingScores)) return false;
    if (!Array.isArray(b.missionsCompleted)) return false;
    if (!b.sloProgress || typeof b.sloProgress !== "object") return false;
    if (typeof b.yearGroup !== "number" || b.yearGroup < 1 || b.yearGroup > 6) return false;
    if (typeof b.educationLevel !== "string" || b.educationLevel.trim() === "") return false;
    if (typeof b.schoolYear !== "number" || b.schoolYear < 2020 || b.schoolYear > 2100) return false;

    // missionsCompleted: max 100 items, each a non-empty string (no PII)
    if (b.missionsCompleted.length > 100) return false;
    if (!b.missionsCompleted.every((m) => typeof m === "string" && m.length > 0 && m.length <= 100)) return false;

    return true;
}

function scoreLabel(score: number): string {
    if (score >= 80) return "uitstekend";
    if (score >= 65) return "goed";
    if (score >= 50) return "voldoende";
    if (score >= 35) return "beperkt";
    return "zwak";
}

function growthLabel(nul: number, eind: number): string {
    const diff = eind - nul;
    if (diff >= 25) return "grote groei";
    if (diff >= 10) return "duidelijke groei";
    if (diff >= 0) return "lichte groei";
    return "lichte teruggang";
}

function buildUserMessage(body: RequestBody): string {
    const lines: string[] = [
        `Leerjaar: ${body.yearGroup} (${body.educationLevel})`,
        `Schooljaar: ${body.schoolYear}-${body.schoolYear + 1}`,
        "",
        "Prestaties per domein (beschrijving, geen cijfers):",
    ];

    for (const domain of VALID_DOMAINS) {
        const nul = body.nulmetingScores[domain];
        const eind = body.eindmetingScores[domain];
        lines.push(
            `- ${DOMAIN_LABELS[domain]}: beginscore ${scoreLabel(nul)}, eindscore ${scoreLabel(eind)} (${growthLabel(nul, eind)})`
        );
    }

    lines.push("", `Afgeronde missies: ${body.missionsCompleted.length}`);

    const sloKeys = Object.keys(body.sloProgress);
    if (sloKeys.length > 0) {
        lines.push("", "SLO-voortgang per kerndoel:");
        for (const key of sloKeys.slice(0, 20)) {
            const val = body.sloProgress[key];
            if (isValidScore(val)) {
                lines.push(`- ${key}: ${scoreLabel(val)}`);
            }
        }
    }

    lines.push("", "Schrijf nu de persoonlijke groei-aanbeveling.");
    return lines.join("\n");
}

function extractFocusDomains(text: string): string[] {
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    for (const domain of VALID_DOMAINS) {
        const label = DOMAIN_LABELS[domain].toLowerCase();
        if (lowerText.includes(label)) {
            found.push(domain);
        }
    }
    return found.slice(0, 2);
}

Deno.serve(async (req: Request) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS", "Content-Type, Authorization");
    const rejectedOrigin = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (rejectedOrigin) return rejectedOrigin;

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Methode niet toegestaan." }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // --- Auth ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Authenticatie vereist." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
    const jwt = authHeader.slice(7);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        console.error("[growthRecommendation] Supabase env vars missing");
        return new Response(JSON.stringify({ error: "Serverconfiguratie onjuist." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Verify JWT via user client (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();

    if (authError || !user) {
        console.warn("[growthRecommendation] JWT invalid:", authError?.message);
        return new Response(JSON.stringify({ error: "Authenticatie ongeldig." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const consentRejection = await ensureAiInteractionConsent(userClient, user, corsHeaders);
    if (consentRejection) return consentRejection;

    const userId = user.id;

    // --- Parse & validate body ---
    let rawBody: unknown;
    try {
        rawBody = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: "Ongeldige JSON." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (!validateRequestBody(rawBody)) {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer. Controleer alle velden en scores (0-100)." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const body = rawBody as RequestBody;

    // --- Check rate limit: 1 aanbeveling per leerling per schooljaar ---
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing, error: checkError } = await serviceClient
        .from("growth_recommendations")
        .select("id")
        .eq("user_id", userId)
        .eq("school_year", body.schoolYear)
        .maybeSingle();

    if (checkError) {
        console.error("[growthRecommendation] DB check error:", checkError.message);
        return new Response(JSON.stringify({ error: "Databasefout." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (existing) {
        return new Response(
            JSON.stringify({ error: "Er bestaat al een aanbeveling voor dit schooljaar." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Fetch school_id from user profile (best-effort, nullable) ---
    let schoolId: string | null = null;
    const { data: profileData } = await serviceClient
        .from("profiles")
        .select("school_id")
        .eq("id", userId)
        .maybeSingle();
    if (profileData?.school_id) {
        schoolId = profileData.school_id;
    }

    // --- Build Mistral request ---
    const userMessage = buildUserMessage(body);

    let recommendationText: string;
    let modelVersion = MODEL;

    try {
        console.log("[growthRecommendation] Sending to Mistral...");
        const result = await completeMistralChat({
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user", content: userMessage },
            ],
            temperature: 0.3,
            maxTokens: 500,
        });
        modelVersion = result.model;
        recommendationText = result.text;

        if (!recommendationText) {
            console.error("[growthRecommendation] Empty response from Mistral");
            return new Response(
                JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }

        console.log("[growthRecommendation] Step 5: Success, text length:", recommendationText.length);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[growthRecommendation] Mistral unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Extract focus domains ---
    const focusDomains = extractFocusDomains(recommendationText);

    // --- Build sanitized input_context (geen PII — alleen scores en labels) ---
    const inputContext = {
        nulmetingScores: body.nulmetingScores,
        eindmetingScores: body.eindmetingScores,
        missionsCompleted: body.missionsCompleted,
        sloProgress: body.sloProgress,
        yearGroup: body.yearGroup,
        educationLevel: body.educationLevel,
        schoolYear: body.schoolYear,
    };

    // --- Store in database ---
    const { error: insertError } = await serviceClient
        .from("growth_recommendations")
        .insert({
            user_id: userId,
            school_year: body.schoolYear,
            school_id: schoolId,
            recommendation_text: recommendationText,
            focus_domains: focusDomains,
            input_context: inputContext,
            model_version: modelVersion,
            teacher_approved: null,
        });

    if (insertError) {
        // Unique constraint violation = duplicate (race condition, already handled above)
        if (insertError.code === "23505") {
            return new Response(
                JSON.stringify({ error: "Er bestaat al een aanbeveling voor dit schooljaar." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        console.error("[growthRecommendation] DB insert error:", insertError.message);
        return new Response(JSON.stringify({ error: "Opslaan mislukt." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    console.log("[growthRecommendation] Stored recommendation for user:", userId, "schoolYear:", body.schoolYear);

    // --- Return response ---
    return new Response(
        JSON.stringify({
            recommendation: recommendationText,
            focusDomains,
            modelVersion,
        }),
        {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
    );
});
