/**
 * Black Forest Labs (FLUX) client for the /generateImage edge function.
 *
 * Why Black Forest Labs?
 * BFL (Freiburg, Germany) is an EU image-generation provider. Using its EU
 * endpoint keeps learner image prompts and generated images within EU
 * infrastructure, in line with the move towards EU data sovereignty.
 *
 * Privacy boundary:
 * Only a sanitized, child-safe text prompt is sent — never learner PII. The
 * generated image is downloaded server-side and returned as base64 so no
 * external signed URL leaks to the client.
 *
 * COMPLIANCE — must be confirmed before production use:
 * - signed DPA with Black Forest Labs + use of the EU endpoint (api.eu.bfl.ai);
 * - zero-retention tier confirmed;
 * - terms that allow processing for / generating content for minors (12-18).
 *
 * The API key is read from the BFL_API_KEY secret (never hardcoded, never logged).
 *
 * API shape (async): POST /v1/<model> -> { id, polling_url }; then GET the
 * polling_url until status === "Ready"; result.sample is a short-lived signed
 * image URL (~10 min).
 */

// ── Config (env-overridable) ─────────────────────────────────────────────────
// Default to the EU multi-cluster endpoint to keep data inside the EU.
const BFL_API_BASE = Deno.env.get("BFL_API_BASE") ?? "https://api.eu.bfl.ai";
const BFL_IMAGE_MODEL = Deno.env.get("BFL_IMAGE_MODEL") ?? "flux-pro-1.1";
// safety_tolerance: 0 (strictest) .. 6 (most permissive). Strict by default for minors.
const BFL_SAFETY_TOLERANCE = Number(Deno.env.get("BFL_SAFETY_TOLERANCE") ?? "1");
const BFL_POLL_TIMEOUT_MS = Number(Deno.env.get("BFL_POLL_TIMEOUT_MS") ?? "60000");
const BFL_POLL_INTERVAL_MS = 1500;

export const BFL_MODEL = BFL_IMAGE_MODEL;

/** Read the BFL API key from the environment. Never logs the key itself. */
export function getBflApiKey(): string {
    const key = Deno.env.get("BFL_API_KEY");
    if (!key) {
        throw new Error(
            "BFL_API_KEY is not set. Add it via: supabase secrets set BFL_API_KEY='...'",
        );
    }
    return key;
}

/**
 * Map an allowed aspect ratio to FLUX width/height (multiples of 32, <= 1440).
 */
export function aspectRatioToDimensions(aspectRatio: string): { width: number; height: number } {
    const map: Record<string, { width: number; height: number }> = {
        "1:1": { width: 1024, height: 1024 },
        "3:2": { width: 1248, height: 832 },
        "2:3": { width: 832, height: 1248 },
        "3:4": { width: 864, height: 1152 },
        "4:3": { width: 1152, height: 864 },
        "4:5": { width: 896, height: 1120 },
        "5:4": { width: 1120, height: 896 },
        "9:16": { width: 768, height: 1344 },
        "16:9": { width: 1344, height: 768 },
        "21:9": { width: 1440, height: 608 },
    };
    return map[aspectRatio] ?? map["1:1"];
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Chunked base64 encoder — avoids call-stack overflow on large image buffers. */
function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

/**
 * Flat result shape (not a discriminated union) — the edge tsconfig does not
 * enable strict mode, so union narrowing on `ok` would not work for callers.
 */
export interface BflResult {
    ok: boolean;
    imageBase64?: string;
    mimeType?: string;
    model?: string;
    /** Set when the request/result was refused on content-moderation grounds. */
    moderated?: boolean;
    /** Failure reason (only set when ok === false). */
    reason?: string;
}

/**
 * Submit a prompt, poll until ready, download the image and return base64.
 *
 * Returns ok:false with moderated:true when BFL refuses the prompt/result on
 * content-moderation grounds, so the caller can map it to a "blocked" response.
 */
export async function generateBflImage(params: {
    prompt: string;
    aspectRatio: string;
}): Promise<BflResult> {
    const apiKey = getBflApiKey();
    const { width, height } = aspectRatioToDimensions(params.aspectRatio);

    // 1. Submit the generation request.
    const submitRes = await fetch(`${BFL_API_BASE}/v1/${BFL_IMAGE_MODEL}`, {
        method: "POST",
        headers: {
            "x-key": apiKey,
            "accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: params.prompt,
            width,
            height,
            output_format: "png",
            safety_tolerance: BFL_SAFETY_TOLERANCE,
            prompt_upsampling: false,
        }),
    });

    if (!submitRes.ok) {
        const status = submitRes.status;
        if (status === 422) {
            // Validation / moderation rejection at submit time.
            return { ok: false, moderated: true, reason: "request_moderated" };
        }
        return { ok: false, moderated: false, reason: `submit_failed_${status}` };
    }

    const submitData = await submitRes.json().catch(() => ({}));
    const pollingUrl: string | undefined = submitData?.polling_url;
    if (!pollingUrl) {
        return { ok: false, moderated: false, reason: "no_polling_url" };
    }

    // 2. Poll the result. Always use the returned polling_url (correct EU cluster).
    const deadline = Date.now() + BFL_POLL_TIMEOUT_MS;
    let imageUrl: string | undefined;
    while (Date.now() < deadline) {
        await sleep(BFL_POLL_INTERVAL_MS);
        const pollRes = await fetch(pollingUrl, {
            method: "GET",
            headers: { "x-key": apiKey, "accept": "application/json" },
        });
        if (!pollRes.ok) continue; // transient — keep polling until deadline

        const pollData = await pollRes.json().catch(() => ({}));
        const status: string = pollData?.status ?? "";

        if (status === "Ready") {
            imageUrl = pollData?.result?.sample;
            break;
        }
        if (status === "Content Moderated" || status === "Request Moderated") {
            return { ok: false, moderated: true, reason: status.toLowerCase().replace(" ", "_") };
        }
        if (status === "Error" || status === "Task not found") {
            return { ok: false, moderated: false, reason: status.toLowerCase().replace(/ /g, "_") };
        }
        // "Pending" / "Queued" / "Processing" — keep polling.
    }

    if (!imageUrl) {
        return { ok: false, moderated: false, reason: "timeout" };
    }

    // 3. Download the (short-lived) signed image URL and return base64.
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
        return { ok: false, moderated: false, reason: `download_failed_${imgRes.status}` };
    }
    const mimeType = imgRes.headers.get("content-type")?.split(";")[0] || "image/png";
    const bytes = new Uint8Array(await imgRes.arrayBuffer());

    return {
        ok: true,
        imageBase64: bytesToBase64(bytes),
        mimeType,
        model: BFL_IMAGE_MODEL,
    };
}
