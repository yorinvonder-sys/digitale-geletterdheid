export type MistralRole = "system" | "user" | "assistant";

export type MistralContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: string };

export interface MistralMessage {
    role: MistralRole;
    content: string | MistralContentPart[];
}

export interface MistralCompletionOptions {
    messages: MistralMessage[];
    temperature?: number;
    maxTokens?: number;
    model?: string;
    responseFormat?: { type: "text" | "json_object" };
}

export interface MistralCompletionResult {
    text: string;
    model: string;
    usagePayload: unknown;
}

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_OCR_API_URL = "https://api.mistral.ai/v1/ocr";
const DEFAULT_MISTRAL_MODEL = "mistral-small-latest";
const DEFAULT_MISTRAL_OCR_MODEL = "mistral-ocr-2503-completion";

export function getMistralTextModel(): string {
    return (Deno.env.get("MISTRAL_TEXT_MODEL") || DEFAULT_MISTRAL_MODEL).trim();
}

export function getMistralVisionModel(): string {
    return (Deno.env.get("MISTRAL_VISION_MODEL") || getMistralTextModel()).trim();
}

export function getMistralOcrModel(): string {
    return (Deno.env.get("MISTRAL_OCR_MODEL") || DEFAULT_MISTRAL_OCR_MODEL).trim();
}

function getMistralApiKey(): string {
    return (Deno.env.get("MISTRAL_API_KEY") || "").trim();
}

function extractMistralText(payload: unknown): string {
    const message = (payload as any)?.choices?.[0]?.message?.content;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) {
        return message
            .map((part) => typeof part?.text === "string" ? part.text : "")
            .join("");
    }
    return "";
}

function buildRequestBody(options: MistralCompletionOptions, stream: boolean): Record<string, unknown> {
    return {
        model: options.model || getMistralTextModel(),
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 768,
        stream,
        safe_prompt: true,
        ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
    };
}

async function fetchMistral(body: Record<string, unknown>): Promise<Response> {
    const apiKey = getMistralApiKey();
    if (!apiKey) {
        throw new Error("MISTRAL_API_KEY ontbreekt.");
    }

    return fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });
}

async function fetchMistralOcr(body: Record<string, unknown>): Promise<Response> {
    const apiKey = getMistralApiKey();
    if (!apiKey) {
        throw new Error("MISTRAL_API_KEY ontbreekt.");
    }

    return fetch(MISTRAL_OCR_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });
}

export async function completeMistralChat(options: MistralCompletionOptions): Promise<MistralCompletionResult> {
    const model = options.model || getMistralTextModel();
    const response = await fetchMistral(buildRequestBody({ ...options, model }, false));
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = (payload as any)?.message || (payload as any)?.error?.message || `Mistral API error (${response.status})`;
        throw new Error(message);
    }

    return {
        text: extractMistralText(payload),
        model,
        usagePayload: payload,
    };
}

export async function completeMistralJson(options: Omit<MistralCompletionOptions, "responseFormat">): Promise<MistralCompletionResult> {
    return completeMistralChat({
        ...options,
        responseFormat: { type: "json_object" },
        temperature: options.temperature ?? 0.3,
    });
}

export async function completeMistralVisionJson(options: Omit<MistralCompletionOptions, "responseFormat" | "model">): Promise<MistralCompletionResult> {
    return completeMistralChat({
        ...options,
        model: getMistralVisionModel(),
        responseFormat: { type: "json_object" },
        temperature: options.temperature ?? 0.2,
    });
}

export interface MistralOcrOptions {
    dataUrl: string;
    prompt?: string;
    model?: string;
    mimeType?: string;
}

export interface MistralOcrResult {
    text: string;
    model: string;
    usagePayload: unknown;
}

export async function processMistralOcr(options: MistralOcrOptions): Promise<MistralOcrResult> {
    const model = options.model || getMistralOcrModel();
    const document =
        options.mimeType === "application/pdf"
            ? { type: "document_url", document_url: options.dataUrl }
            : { type: "image_url", image_url: options.dataUrl };
    const body: Record<string, unknown> = {
        model,
        document,
        include_image_base64: false,
        ...(options.prompt ? {
            document_annotation_prompt: options.prompt,
            document_annotation_format: { type: "json_object" },
        } : {}),
    };

    const response = await fetchMistralOcr(body);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = (payload as any)?.message || (payload as any)?.error?.message || (payload as any)?.detail || `Mistral OCR API error (${response.status})`;
        throw new Error(message);
    }

    const annotation = (payload as any)?.document_annotation;
    const pageText = Array.isArray((payload as any)?.pages)
        ? (payload as any).pages.map((page: any) => typeof page?.markdown === "string" ? page.markdown : "").join("\n\n")
        : "";

    return {
        text: typeof annotation === "string" && annotation.trim() ? annotation : pageText,
        model: typeof (payload as any)?.model === "string" ? (payload as any).model : model,
        usagePayload: payload,
    };
}

export async function streamMistralChat(options: MistralCompletionOptions): Promise<{ response: Response; model: string }> {
    const model = options.model || getMistralTextModel();
    const response = await fetchMistral(buildRequestBody({ ...options, model }, true));
    return { response, model };
}

export function buildMistralMessages(
    systemInstruction: string,
    contents: Array<{ role: string; parts?: Array<{ text?: string }> }>,
): MistralMessage[] {
    const messages: MistralMessage[] = [{ role: "system", content: systemInstruction }];

    for (const content of contents) {
        const text = (content.parts || [])
            .map((part) => typeof part.text === "string" ? part.text : "")
            .join("\n")
            .trim();
        if (!text) continue;
        messages.push({
            role: content.role === "model" || content.role === "assistant" ? "assistant" : "user",
            content: text,
        });
    }

    return messages;
}

export function extractJsonObject(rawText: string): Record<string, unknown> {
    const startIdx = rawText.indexOf("{");
    const endIdx = rawText.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error("Geen JSON gevonden");
    }
    return JSON.parse(rawText.slice(startIdx, endIdx + 1));
}
