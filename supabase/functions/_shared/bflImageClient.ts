export interface FluxImageOptions {
    prompt: string;
    aspectRatio: string;
    width?: number;
    height?: number;
}

export interface FluxImageResult {
    imageBase64: string;
    mimeType: string;
    model: string;
    usagePayload?: unknown;
}

const DEFAULT_BFL_BASE_URL = "https://api.eu.bfl.ai";
const DEFAULT_BFL_MODEL = "flux-2-klein-9b";
const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 500;

const ASPECT_RATIO_SIZES: Record<string, { width: number; height: number }> = {
    "1:1": { width: 1024, height: 1024 },
    "3:2": { width: 1216, height: 832 },
    "2:3": { width: 832, height: 1216 },
    "3:4": { width: 896, height: 1152 },
    "4:3": { width: 1152, height: 896 },
    "4:5": { width: 896, height: 1120 },
    "5:4": { width: 1120, height: 896 },
    "9:16": { width: 768, height: 1344 },
    "16:9": { width: 1344, height: 768 },
    "21:9": { width: 1536, height: 640 },
};

function getBflApiKey(): string {
    return (Deno.env.get("BFL_API_KEY") || "").trim();
}

function getBflBaseUrl(): string {
    return (Deno.env.get("BFL_API_BASE_URL") || DEFAULT_BFL_BASE_URL).replace(/\/+$/, "");
}

export function getBflImageModel(): string {
    return (Deno.env.get("BFL_IMAGE_MODEL") || DEFAULT_BFL_MODEL).trim();
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function inferMimeType(url: string, response: Response): string {
    const header = response.headers.get("Content-Type");
    if (header?.startsWith("image/")) return header.split(";")[0];
    if (/\.jpe?g(?:\?|$)/i.test(url)) return "image/jpeg";
    if (/\.webp(?:\?|$)/i.test(url)) return "image/webp";
    return "image/png";
}

async function downloadImageAsBase64(url: string): Promise<{ imageBase64: string; mimeType: string }> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`BFL image download failed (${response.status})`);
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return {
        imageBase64: btoa(binary),
        mimeType: inferMimeType(url, response),
    };
}

async function pollFluxResult(pollingUrl: string, apiKey: string): Promise<Record<string, unknown>> {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        const response = await fetch(pollingUrl, {
            headers: {
                "accept": "application/json",
                "x-key": apiKey,
            },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error((payload as any)?.detail || `BFL polling error (${response.status})`);
        }

        const status = String((payload as any)?.status || "").toLowerCase();
        if (status === "ready") return payload as Record<string, unknown>;
        if (status === "error" || status === "failed") {
            throw new Error("BFL image generation failed.");
        }
        await sleep(POLL_INTERVAL_MS);
    }

    throw new Error("BFL image generation timed out.");
}

export async function generateFluxImage(options: FluxImageOptions): Promise<FluxImageResult> {
    const apiKey = getBflApiKey();
    if (!apiKey) {
        throw new Error("BFL_API_KEY ontbreekt.");
    }

    const model = getBflImageModel();
    const size = ASPECT_RATIO_SIZES[options.aspectRatio] || ASPECT_RATIO_SIZES["1:1"];
    const createResponse = await fetch(`${getBflBaseUrl()}/v1/${encodeURIComponent(model)}`, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "x-key": apiKey,
        },
        body: JSON.stringify({
            prompt: options.prompt,
            width: options.width ?? size.width,
            height: options.height ?? size.height,
        }),
    });

    const createPayload = await createResponse.json().catch(() => ({}));
    if (!createResponse.ok) {
        throw new Error((createPayload as any)?.detail || `BFL API error (${createResponse.status})`);
    }

    const pollingUrl = (createPayload as any)?.polling_url;
    if (typeof pollingUrl !== "string" || !pollingUrl) {
        throw new Error("BFL response missing polling_url.");
    }

    const resultPayload = await pollFluxResult(pollingUrl, apiKey);
    const sampleUrl = (resultPayload as any)?.result?.sample;
    if (typeof sampleUrl !== "string" || !sampleUrl) {
        throw new Error("BFL response missing generated image URL.");
    }

    const image = await downloadImageAsBase64(sampleUrl);
    return {
        ...image,
        model,
        usagePayload: resultPayload,
    };
}
