import type { MistralMessage } from "./mistralClient.ts";

export type ModerationStage = "input" | "output";

export type ModerationCategory =
    | "sexual"
    | "hate_and_discrimination"
    | "violence_and_threats"
    | "dangerous_and_criminal_content"
    | "selfharm"
    | "pii"
    | "health"
    | "financial"
    | "law"
    | "unknown"
    | "moderation_unavailable";

export interface ModerationResult {
    safe: boolean;
    category?: ModerationCategory;
    categories: ModerationCategory[];
    logOnlyCategories: ModerationCategory[];
    violated: boolean;
    failClosed?: boolean;
    fallback?: string;
    providerPayload?: unknown;
}

const MISTRAL_MODERATION_API_URL = "https://api.mistral.ai/v1/moderations";
const MISTRAL_CHAT_MODERATION_API_URL = "https://api.mistral.ai/v1/chat/moderations";
const DEFAULT_MISTRAL_MODERATION_MODEL = "mistral-moderation-latest";
export const MISTRAL_MODERATION_GUARDRAIL_ID = "moderation_llm_v2";

const BLOCK_CATEGORIES = new Set<ModerationCategory>([
    "sexual",
    "hate_and_discrimination",
    "violence_and_threats",
    "dangerous_and_criminal_content",
    "selfharm",
    "pii",
]);

const LOG_ONLY_CATEGORIES = new Set<ModerationCategory>([
    "health",
    "financial",
    "law",
]);

const GENERIC_FALLBACK = "Sorry, ik kan hier niet veilig mee helpen. Probeer je vraag anders te stellen, zonder schadelijke of persoonlijke details.";
const SELF_HARM_FALLBACK = "Ik merk dat dit over iets zwaars kan gaan. Ik ben een AI en kan je hier niet goed bij helpen, maar er zijn mensen die dat wel kunnen: praat met je mentor of vertrouwenspersoon op school, bel de Kindertelefoon via 0800-0432, of bel 113 Zelfmoordpreventie via 113 of 0800-0113.";
const PII_FALLBACK = "Deel liever geen persoonlijke gegevens zoals telefoonnummers, adressen, e-mailadressen of namen van anderen. Stel je vraag opnieuw zonder die details, dan help ik je veilig verder.";
const UNAVAILABLE_FALLBACK = "De veiligheidscontrole is tijdelijk niet beschikbaar. Daarom kan ik dit AI-antwoord nu niet veilig tonen.";

function getMistralApiKey(): string {
    return (Deno.env.get("MISTRAL_API_KEY") || "").trim();
}

export function getMistralModerationModel(): string {
    return (Deno.env.get("MISTRAL_MODERATION_MODEL") || DEFAULT_MISTRAL_MODERATION_MODEL).trim();
}

function getBlockThreshold(): number {
    const raw = Number(Deno.env.get("MISTRAL_MODERATION_BLOCK_THRESHOLD") || "0.5");
    if (!Number.isFinite(raw) || raw < 0 || raw > 1) return 0.5;
    return raw;
}

export function getModerationFallback(category?: ModerationCategory): string {
    if (category === "selfharm") return SELF_HARM_FALLBACK;
    if (category === "pii") return PII_FALLBACK;
    if (category === "moderation_unavailable") return UNAVAILABLE_FALLBACK;
    return GENERIC_FALLBACK;
}

function normalizeCategory(raw: string): ModerationCategory {
    const key = raw.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    if (key === "sexual" || key === "sexually_explicit") return "sexual";
    if (key === "hate" || key === "hate_speech" || key === "hate_and_discrimination") return "hate_and_discrimination";
    if (key === "violence" || key === "violent" || key === "violence_and_threats") return "violence_and_threats";
    if (key === "dangerous" || key === "dangerous_content" || key === "criminal" || key === "dangerous_and_criminal" || key === "dangerous_and_criminal_content") return "dangerous_and_criminal_content";
    if (key === "self_harm" || key === "selfharm" || key === "self_harm_instructions") return "selfharm";
    if (key === "pii" || key === "personal_data" || key === "personal_information") return "pii";
    if (key === "health" || key === "medical") return "health";
    if (key === "financial" || key === "finance") return "financial";
    if (key === "law" || key === "legal") return "law";
    return "unknown";
}

function extractResultEntries(payload: unknown): Record<string, unknown>[] {
    const root = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const candidates = [root.results, root.output, root.outputs, root.result];
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object");
        }
        if (candidate && typeof candidate === "object") {
            return [candidate as Record<string, unknown>];
        }
    }
    return root.categories || root.category_scores ? [root] : [];
}

function scoreFrom(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
    return null;
}

export function parseMistralModerationPayload(payload: unknown, threshold = getBlockThreshold()): ModerationResult {
    const categories = new Set<ModerationCategory>();
    const logOnlyCategories = new Set<ModerationCategory>();

    for (const entry of extractResultEntries(payload)) {
        const rawCategories = entry.categories && typeof entry.categories === "object"
            ? entry.categories as Record<string, unknown>
            : {};
        const rawScores = (entry.category_scores ?? entry.categoryScores) && typeof (entry.category_scores ?? entry.categoryScores) === "object"
            ? (entry.category_scores ?? entry.categoryScores) as Record<string, unknown>
            : {};

        const allKeys = new Set([...Object.keys(rawCategories), ...Object.keys(rawScores)]);
        for (const rawKey of allKeys) {
            const category = normalizeCategory(rawKey);
            const violated = rawCategories[rawKey] === true || (scoreFrom(rawScores[rawKey]) ?? 0) >= threshold;
            if (!violated) continue;
            if (LOG_ONLY_CATEGORIES.has(category)) {
                logOnlyCategories.add(category);
            } else {
                categories.add(category);
            }
        }
    }

    const blockedCategories = Array.from(categories);
    const logOnly = Array.from(logOnlyCategories);
    const category = blockedCategories.find((item) => BLOCK_CATEGORIES.has(item)) ?? blockedCategories[0];
    const violated = blockedCategories.length > 0;
    return {
        safe: !violated,
        category,
        categories: blockedCategories,
        logOnlyCategories: logOnly,
        violated,
        fallback: violated ? getModerationFallback(category) : undefined,
        providerPayload: payload,
    };
}

function buildUnavailableResult(): ModerationResult {
    return {
        safe: false,
        category: "moderation_unavailable",
        categories: ["moderation_unavailable"],
        logOnlyCategories: [],
        violated: true,
        failClosed: true,
        fallback: getModerationFallback("moderation_unavailable"),
    };
}

async function fetchMistralModeration(url: string, body: Record<string, unknown>): Promise<ModerationResult> {
    const apiKey = getMistralApiKey();
    if (!apiKey) return buildUnavailableResult();

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error(`[moderationClient] Mistral moderation failed (${response.status})`);
            return buildUnavailableResult();
        }
        return parseMistralModerationPayload(payload);
    } catch (error) {
        console.error("[moderationClient] Mistral moderation request failed:", error instanceof Error ? error.message : String(error));
        return buildUnavailableResult();
    }
}

export async function moderateMistralText(text: string): Promise<ModerationResult> {
    return fetchMistralModeration(MISTRAL_MODERATION_API_URL, {
        model: getMistralModerationModel(),
        input: text,
    });
}

export async function moderateMistralMessages(messages: MistralMessage[]): Promise<ModerationResult> {
    return fetchMistralModeration(MISTRAL_CHAT_MODERATION_API_URL, {
        model: getMistralModerationModel(),
        input: messages,
    });
}
