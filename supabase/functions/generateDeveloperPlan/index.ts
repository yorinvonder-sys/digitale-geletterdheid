/**
 * Edge Function: /generateDeveloperPlan — AI-based project plan generation
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side rate limiting (10 req/min per user)
 * 3. Input sanitization (prompt injection prevention)
 * 4. Vertex AI (europe-west4) — enterprise ToS
 * 5. Service account auth (no API key in URL)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken, getVertexUrl } from "../_shared/vertexAuth.ts";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";
import { checkDurableRateLimit, rateLimitResponse, rateLimitHeaders } from "../_shared/rateLimiter.ts";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";

const SYSTEM_INSTRUCTION = `Je bent een projectplanner voor een educatief software team. Genereer een gestructureerd plan op basis van de projectbeschrijving.

Antwoord ALLEEN in JSON:
{
  "title": "plannaam",
  "steps": [
    { "id": "step-1", "title": "staptitel", "description": "beschrijving", "priority": "high|medium|low" }
  ],
  "milestones": [
    { "title": "mijlpaal", "deadline": "optioneel" }
  ]
}

Maximaal 10 stappen en 5 mijlpalen. Alles in het Nederlands.`;

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
        console.error("[generateDeveloperPlan] Missing SUPABASE_URL or SUPABASE_ANON_KEY");
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

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

    // --- Rate limiting ---
    const rateCheck = await checkDurableRateLimit(user.id, { maxRequests: 10, windowMs: 60_000 }, authHeader);
    if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
    }

    // --- Parse body ---
    let body: { description: string; currentTasks?: string[] };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const { description, currentTasks } = body;

    if (!description || typeof description !== "string") {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Input length validation ---
    if (description.length > 5000) {
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // --- Input sanitization (prompt injection prevention) ---
    const descriptionSanitized = sanitizePrompt(description);
    if (descriptionSanitized.wasBlocked) {
        console.warn("[generateDeveloperPlan] Prompt injection blocked in description:", descriptionSanitized.detectionLabel, "user:", user.id);
        return new Response(
            JSON.stringify({ error: "Ongeldige invoer." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    // Validate and sanitize currentTasks if present
    let sanitizedCurrentTasks: string[] | undefined;
    if (currentTasks !== undefined) {
        if (!Array.isArray(currentTasks)) {
            return new Response(
                JSON.stringify({ error: "Ongeldige invoer." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }
        sanitizedCurrentTasks = [];
        for (const task of currentTasks) {
            if (typeof task !== "string") {
                return new Response(
                    JSON.stringify({ error: "Ongeldige invoer." }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                );
            }
            const taskSanitized = sanitizePrompt(task.slice(0, 200));
            if (taskSanitized.wasBlocked) {
                console.warn("[generateDeveloperPlan] Prompt injection blocked in currentTasks:", taskSanitized.detectionLabel, "user:", user.id);
                return new Response(
                    JSON.stringify({ error: "Ongeldige invoer." }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                );
            }
            sanitizedCurrentTasks.push(taskSanitized.sanitized);
        }
    }

    // --- Build user message ---
    let userMessage = `Projectbeschrijving: ${descriptionSanitized.sanitized}`;
    if (sanitizedCurrentTasks && sanitizedCurrentTasks.length > 0) {
        userMessage += `\n\nBestaande taken:\n${sanitizedCurrentTasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    }

    // --- Vertex AI call ---
    try {
        const geminiUrl = getVertexUrl("gemini-3-flash-preview");
        const accessToken = await getAccessToken();

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
            }),
        });

        if (!response.ok) {
            const status = response.status;
            const errBody = await response.text().catch(() => "");
            console.error(`[generateDeveloperPlan] Vertex AI error (${status}):`, errBody);
            if (status === 429) {
                return new Response(
                    JSON.stringify({ error: "Te veel verzoeken. Wacht even." }),
                    { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
                );
            }
            return new Response(
                JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
                { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
        }

        const geminiData = await response.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const startIdx = rawText.indexOf("{");
        const endIdx = rawText.lastIndexOf("}");
        if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
            throw new Error("Geen JSON gevonden");
        }
        const parsed = JSON.parse(rawText.slice(startIdx, endIdx + 1));

        // Validate and normalise the parsed plan structure
        const VALID_PRIORITIES = new Set(["low", "medium", "high"]);

        const steps = Array.isArray(parsed.steps)
            ? parsed.steps
                .slice(0, 10)
                .filter((s: unknown) => s && typeof s === "object")
                .map((s: Record<string, unknown>, idx: number) => ({
                    id: typeof s.id === "string" ? s.id : `step-${idx + 1}`,
                    title: typeof s.title === "string" ? s.title : "",
                    description: typeof s.description === "string" ? s.description : "",
                    priority: VALID_PRIORITIES.has(String(s.priority)) ? String(s.priority) as "low" | "medium" | "high" : "medium",
                }))
            : [];

        const milestones = Array.isArray(parsed.milestones)
            ? parsed.milestones
                .slice(0, 5)
                .filter((m: unknown) => m && typeof m === "object")
                .map((m: Record<string, unknown>) => {
                    const milestone: { title: string; deadline?: string } = {
                        title: typeof m.title === "string" ? m.title : "",
                    };
                    if (typeof m.deadline === "string" && m.deadline.trim()) {
                        milestone.deadline = m.deadline.trim();
                    }
                    return milestone;
                })
            : [];

        const result = {
            title: typeof parsed.title === "string" ? parsed.title : "",
            steps,
            milestones,
        };

        return new Response(JSON.stringify(result), {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                ...rateLimitHeaders(rateCheck),
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[generateDeveloperPlan] Unhandled error:", message);
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }
});
