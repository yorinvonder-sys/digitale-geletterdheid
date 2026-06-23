/**
 * Mistral Moderation client — echte content-classifier voor kind-veiligheid.
 *
 * Mistral's `safe_prompt` is een zachte model-guardrail (prepend-prompt), GEEN
 * classifier. Deze module sluit Mistral's aparte Moderation-API aan
 * (`mistral-moderation-latest`, endpoint `/v1/moderations`) als extra laag
 * bovenop het goedkope regex-`outputFilter`, voor zowel leerling-input als
 * AI-output.
 *
 * EU AI Act Annex III.3 (onderwijs = hoog-risico): verhoogde zorgplicht bij
 * minderjarigen. Mistral garandeert geen kind-geschiktheid; de verwerker
 * (DGSkills) en de school dragen de output-veiligheid.
 *
 * FAIL-OPEN: bij een API-fout, ontbrekende sleutel of uitgeschakelde moderatie
 * blijft de chat werken op de bestaande lagen (safe_prompt + promptSanitizer +
 * regex-`outputFilter`). Een moderatie-uitval mag de dienst niet platleggen —
 * dit is een additionele laag, niet de enige. Elke uitval wordt server-side
 * gelogd (console.error) zodat het zichtbaar blijft.
 */

const MISTRAL_MODERATION_URL = "https://api.mistral.ai/v1/moderations";
const DEFAULT_MODERATION_MODEL = "mistral-moderation-latest";

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
] as const;

export interface ModerationResult {
  /** true = kind-onveilige categorie getriggerd → blokkeren. */
  flagged: boolean;
  /** Welke BLOCK_CATEGORIES triggerden (voor anonieme logging). */
  categories: string[];
  /** true = classifier niet bereikbaar/uitgeschakeld (fail-open: niet geblokkeerd). */
  errored: boolean;
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
 * `AI_MODERATION_ENABLED=false` (bv. als de Mistral-sleutel nog geen
 * moderation-toegang heeft, of bij latency/kosten-issues).
 */
export function moderationEnabled(): boolean {
  return (Deno.env.get("AI_MODERATION_ENABLED") ?? "true").trim().toLowerCase() !== "false";
}

/**
 * Classificeer een stuk tekst (leerling-input of AI-output) met Mistral's
 * Moderation-API. Retourneert `flagged: true` als een kind-onveilige categorie
 * triggert.
 *
 * FAIL-OPEN: uitgeschakeld / geen sleutel / lege tekst / API-fout → niet geflagd
 * (`errored` markeert de twee laatste gevallen voor logging).
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  if (!moderationEnabled()) return SAFE_RESULT;

  const trimmed = (text || "").trim();
  if (!trimmed) return SAFE_RESULT;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[moderationClient] MISTRAL_API_KEY ontbreekt; moderatie overgeslagen (fail-open).");
    return { flagged: false, categories: [], errored: true };
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
      console.error(`[moderationClient] Moderation API error (${response.status}); fail-open.`);
      return { flagged: false, categories: [], errored: true };
    }

    const payload = (await response.json().catch(() => null)) as
      | { results?: Array<{ categories?: Record<string, boolean> }> }
      | null;

    const categoriesMap = payload?.results?.[0]?.categories ?? {};
    const hits = BLOCK_CATEGORIES.filter((cat) => categoriesMap[cat] === true);

    return { flagged: hits.length > 0, categories: hits, errored: false };
  } catch (err) {
    console.error(
      "[moderationClient] Moderation call failed; fail-open:",
      err instanceof Error ? err.message : String(err),
    );
    return { flagged: false, categories: [], errored: true };
  }
}
