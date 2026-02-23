/**
 * Edge Function: /chat — AI Chat Proxy
 *
 * Security layers:
 * 1. JWT auth verification (Supabase)
 * 2. Server-side prompt injection filtering (mirrors client-side)
 * 3. Rate limiting via Supabase auth (429 propagation)
 * 4. Gemini API key kept server-side only
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sanitizePrompt } from "../_shared/promptSanitizer.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(
            JSON.stringify({ error: "Authenticatie vereist." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: "Ongeldige sessie." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 2. Parse request
    let body: { message?: string; systemInstruction?: string; history?: unknown[] };
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Ongeldige JSON." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!body.message || typeof body.message !== "string") {
        return new Response(
            JSON.stringify({ error: "Bericht ontbreekt." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 3. Server-side prompt injection check (defense-in-depth)
    const validation = sanitizePrompt(body.message);
    if (validation.wasBlocked) {
        console.warn(
            `[INJECTION_BLOCKED] user=${user.id} label=${validation.detectionLabel}`
        );
        return new Response(
            JSON.stringify({
                error: "blocked",
                reason: "Je bericht bevat een patroon dat niet is toegestaan.",
            }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // 4. Forward sanitized message to Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const contents = [
        ...(Array.isArray(body.history) ? body.history : []),
        { role: "user", parts: [{ text: validation.sanitized }] },
    ];

    const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents,
            ...(body.systemInstruction
                ? { systemInstruction: { parts: [{ text: body.systemInstruction }] } }
                : {}),
        }),
    });

    if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        if (status === 429) {
            return new Response(
                JSON.stringify({ error: "rate_limit", reason: "Te veel verzoeken. Wacht even." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: "AI-service tijdelijk niet beschikbaar." }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const geminiData = await geminiResponse.json();
    return new Response(JSON.stringify(geminiData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
});
