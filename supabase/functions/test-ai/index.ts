// Temporary test function — delete after debugging
import { getAccessToken, getVertexStreamUrl, getVertexUrl } from "../_shared/vertexAuth.ts";

Deno.serve(async (_req: Request) => {
    const results: Record<string, unknown> = {};

    // Test 1: Service account key exists
    try {
        const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
        results.hasServiceAccountKey = !!raw;
        if (raw) {
            const parsed = JSON.parse(raw);
            results.projectId = parsed.project_id;
            results.clientEmail = parsed.client_email?.substring(0, 20) + "...";
        }
    } catch (e) {
        results.serviceAccountError = String(e);
    }

    // Test 2: Get access token
    try {
        const token = await getAccessToken();
        results.hasAccessToken = !!token;
        results.tokenPrefix = token?.substring(0, 10) + "...";
    } catch (e) {
        results.accessTokenError = String(e);
    }

    // Test 3: Call Vertex AI with gemini-2.5-flash
    try {
        const url = getVertexUrl("gemini-3-flash-preview");
        results.vertexUrl = url;
        const accessToken = await getAccessToken();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Zeg hallo" }] }],
                generationConfig: { maxOutputTokens: 50 },
            }),
        });

        results.vertexStatus = response.status;
        const body = await response.text();
        results.vertexResponse = body.substring(0, 500);
    } catch (e) {
        results.vertexError = String(e);
    }

    return new Response(JSON.stringify(results, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
});
