/**
 * Mistral Moderation client — echte content-classifier voor kind-veiligheid.
 *
 * Mistral's `safe_prompt` is een zachte model-guardrail (prepend-prompt), GEEN
 * classifier. Deze module sluit Mistral's aparte Moderation-API aan
 * (`mistral-moderation-2603`, endpoint `/v1/moderations`) als extra laag
 * bovenop het goedkope regex-`outputFilter`, voor zowel leerling-input als
 * AI-output.
 *
 * EU AI Act Annex III.3 (onderwijs = hoog-risico): verhoogde zorgplicht bij
 * minderjarigen. Mistral garandeert geen kind-geschiktheid; de verwerker
 * (DGSkills) en de school dragen de output-veiligheid.
 *
 * Endpointbeleid bij uitval:
 * - ingelogde leerling-chat faalt dicht (blokkeert veilig);
 * - publieke demo-chat faalt open op de bestaande lagen (sanitizer,
 *   safe_prompt en regex-`outputFilter`).
 * Deze module rapporteert uitval via `errored`; endpoints kiezen het beleid.
 */

const MISTRAL_MODERATION_URL = "https://api.mistral.ai/v1/moderations";
const DEFAULT_MODERATION_MODEL = "mistral-moderation-2603";

// Maximaal aantal tekens dat we per call classificeren (latency/kosten-cap).
const MAX_MODERATION_CHARS = 8_000;

// Categorieën die voor minderjarigen worden geblokkeerd zodra Mistral ze als
// `true` classificeert (Mistral's eigen gekalibreerde booleans). `pii` wordt al
// door piiRedactor afgehandeld; `health`/`financial`/`law` zijn in een
// educatieve context geen kind-veiligheidsblokkade.
const BLOCK_CATEGORIES = [
  "sexual",
  "hate_and_discrimination",
  "violence_and_threats",
  "dangerous_and_criminal_content",
  "selfharm",
  "jailbreaking",
] as const;

export interface ModerationResult {
  /** true = kind-onveilige categorie getriggerd → blokkeren. */
  flagged: boolean;
  /** Welke BLOCK_CATEGORIES triggerden (voor anonieme logging). */
  categories: string[];
  /** true = classifier niet beschikbaar; endpoint bepaalt fail-open/fail-closed. */
  errored: boolean;
  /** Compacte server-side reden voor monitoring, nooit providerpayload. */
  errorReason?: "disabled" | "missing_api_key" | "api_error" | "invalid_payload" | "network_error";
}

const SAFE_RESULT: ModerationResult = { flagged: false, categories: [], errored: false };

function getApiKey(): string {
  return (Deno.env.get("MISTRAL_API_KEY") || "").trim();
}

function getModerationModel(): string {
  return (Deno.env.get("MISTRAL_MODERATION_MODEL") || DEFAULT_MODERATION_MODEL).trim();
}

/**
 * Moderatie staat standaard AAN. Expliciet uit te zetten met
 * `AI_MODERATION_ENABLED=false`. Authenticated endpoints behandelen dat als
 * unavailable en blokkeren veilig; demo-chat mag fail-open blijven.
 */
export function moderationEnabled(): boolean {
  return (Deno.env.get("AI_MODERATION_ENABLED") ?? "true").trim().toLowerCase() !== "false";
}

/**
 * Classificeer een stuk tekst (leerling-input of AI-output) met Mistral's
 * Moderation-API. Retourneert `flagged: true` als een kind-onveilige categorie
 * triggert.
 *
 * Lege tekst is veilig. Uitgeschakeld / geen sleutel / API-fout → `errored`,
 * zodat callers per endpoint fail-open of fail-closed kunnen afdwingen.
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  const trimmed = (text || "").trim();
  if (!trimmed) return SAFE_RESULT;

  if (!moderationEnabled()) {
    console.error("[moderationClient] Moderatie is uitgeschakeld via AI_MODERATION_ENABLED=false.");
    return { flagged: false, categories: [], errored: true, errorReason: "disabled" };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[moderationClient] MISTRAL_API_KEY ontbreekt; moderatie niet beschikbaar.");
    return { flagged: false, categories: [], errored: true, errorReason: "missing_api_key" };
  }

  try {
    const response = await fetch(MISTRAL_MODERATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModerationModel(),
        input: [trimmed.slice(0, MAX_MODERATION_CHARS)],
      }),
    });

    if (!response.ok) {
      console.error(`[moderationClient] Moderation API error (${response.status}); moderatie niet beschikbaar.`);
      return { flagged: false, categories: [], errored: true, errorReason: "api_error" };
    }

    const payload = (await response.json().catch(() => null)) as
      | { results?: Array<{ categories?: Record<string, boolean> }> }
      | null;

    const categoriesMap = payload?.results?.[0]?.categories;
    if (!categoriesMap || typeof categoriesMap !== "object") {
      console.error("[moderationClient] Moderation API payload mist categories; moderatie niet beschikbaar.");
      return { flagged: false, categories: [], errored: true, errorReason: "invalid_payload" };
    }

    const hits = BLOCK_CATEGORIES.filter((cat) => categoriesMap[cat] === true);

    return { flagged: hits.length > 0, categories: hits, errored: false };
  } catch (err) {
    console.error(
      "[moderationClient] Moderation call failed; moderatie niet beschikbaar:",
      err instanceof Error ? err.message : String(err),
    );
    return { flagged: false, categories: [], errored: true, errorReason: "network_error" };
  }
}
