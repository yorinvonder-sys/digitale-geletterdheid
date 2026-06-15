# Audit Rapport: AI Edge Function Integraties

**Datum:** 3 april 2026
**Auditor:** Claude Code (geautomatiseerd)
**Scope:** Alle Supabase Edge Functions die Mistral/BFL aanroepen
**Classificatie:** HIGH RISK (EU AI Act Annex III, punt 3b)

---

## 1. Samenvatting

Dit rapport documenteert de audit van alle AI-integraties in de DGSkills edge functions. Vijf nieuwe edge functions zijn aangemaakt ter vervanging van directe client-side AI-aanroepen, en een onveilige debug-functie (`test-ai`) is verwijderd.

### Resultaten

| Status | Omschrijving |
|--------|-------------|
| **5 NIEUW** | Edge functions aangemaakt met volledige security stack |
| **1 VERWIJDERD** | `test-ai` debug functie (geen auth, CORS wildcard, lekt secrets) |
| **0 KRITIEK** | Geen openstaande kritieke bevindingen |

---

## 2. Ge-auditeerde Edge Functions

### 2.1 Bestaande functies (reeds conform)

| Functie | Model | Auth | Rate Limit | Prompt Sanitization | Output Filter |
|---------|-------|------|-----------|---------------------|---------------|
| `chat` | mistral-small-latest / mistral-small-latest | JWT + RLS | 15/min (durable) | Via chatCore.ts | filterAiOutput() |
| `chatStream` | mistral-small-latest / mistral-small-latest | JWT + RLS | 15/min (durable) | Via chatCore.ts | filterStreamChunk() |
| `scanReceipt` | mistral-small-latest | JWT + role check (developer/admin) | 5/min (durable) | N/A (image input) | N/A |
| `growthRecommendation` | mistral-small-latest | JWT + RLS | 1/schooljaar (DB constraint) | N/A (structured input) | N/A |

### 2.2 Nieuwe functies (deze audit)

| Functie | Model | Auth | Rate Limit | Prompt Sanitization | Doel |
|---------|-------|------|-----------|---------------------|------|
| `generateImage` | flux-2-klein-9b | JWT | 5/min (durable) | sanitizePrompt() + safety prefix | AI-afbeelding generatie |
| `analyzeDrawing` | mistral-small-latest | JWT | 10/min (durable) | Server-side prompt (client prompt genegeerd) | Tekeninganalyse voor educatief spel |
| `validateDeveloperTask` | mistral-small-latest | JWT | 10/min (durable) | sanitizePrompt() op alle velden | Taakkwaliteit validatie |
| `generateDeveloperPlan` | mistral-small-latest | JWT | 10/min (durable) | sanitizePrompt() op alle velden | Projectplan generatie |
| `getTaskSuggestions` | mistral-small-latest | JWT | 10/min (durable) | sanitizePrompt() op alle velden | Taaksuggesties |

### 2.3 Verwijderde functies

| Functie | Reden verwijdering |
|---------|-------------------|
| `test-ai` | Debug functie zonder auth, CORS `*` wildcard, lekt provider secret metadata (project_id, client_email prefix, token prefix). Nooit bedoeld voor productie. |

---

## 3. Security Controls per Nieuwe Functie

### 3.1 generateImage

- **CORS:** `buildCorsHeaders()` + `rejectDisallowedBrowserRequest()` - alleen whitelisted origins
- **Auth:** JWT via Supabase `getUser()` - geen anonieme toegang
- **Rate limit:** 5 req/min per user via `checkDurableRateLimit()` met namespaced key `generateImage:{userId}`
- **Input validatie:**
  - Prompt: max 2000 tekens, type check
  - Style: whitelist `['book', 'branding', 'general']`
  - AspectRatio: whitelist `['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']`
- **Prompt injection preventie:** `sanitizePrompt()` (40+ patronen NL+EN)
- **Kindveiligheid:** Server-side safety prefix: "VEILIG VOOR KINDEREN. Geen geweld, geen seksuele content, geen angstaanjagende beelden."
- **Error handling:** Generieke foutmeldingen, geen interne details naar client

### 3.2 analyzeDrawing

- **CORS:** `buildCorsHeaders()` + `rejectDisallowedBrowserRequest()`
- **Auth:** JWT via Supabase `getUser()` - alle geauthenticeerde gebruikers (inclusief leerlingen)
- **Rate limit:** 10 req/min per user via `checkDurableRateLimit()` met namespaced key `analyzeDrawing:{userId}`
- **Input validatie:**
  - imageBase64: verplicht, max 7M tekens (~5MB decoded)
  - Data URL prefix wordt veilig gestript met MIME type extractie
  - possibleLabels: optioneel, max 20 items, max 50 tekens per label, HTML/template chars gestript
- **Prompt injection preventie:** Client-verstuurd `prompt` veld wordt **volledig genegeerd**. Server-side prompt altijd bepalend.
- **Safety settings:** `BLOCK_LOW_AND_ABOVE` voor alle 4 harm categorien
- **Content moderatie:** Server-side prompt instrueert model om "ONGEPAST" te retourneren bij ongepaste tekeningen
- **Response validatie:** Strict schema check op guesses array en confidence scores

### 3.3 validateDeveloperTask / generateDeveloperPlan / getTaskSuggestions

Alle drie volgen hetzelfde patroon:
- **CORS:** `buildCorsHeaders()` + `rejectDisallowedBrowserRequest()`
- **Auth:** JWT via Supabase `getUser()`
- **Rate limit:** 10 req/min per user via `checkDurableRateLimit()`
- **Input validatie:** Title max 200 chars, description max 5000 chars, type checks
- **Prompt injection preventie:** `sanitizePrompt()` op elk tekstveld afzonderlijk
- **System instruction:** Server-side bepaald, niet door client
- **Response validatie:** JSON parsing + type/range validatie op alle output velden
- **Error handling:** Generieke Nederlandse foutmeldingen

---

## 4. Bevindingen en Aanbevelingen

### 4.1 Opgeloste Bevindingen

| # | Bevinding | Ernst | Status |
|---|-----------|-------|--------|
| 1 | `test-ai` debug functie in productie zonder auth | KRITIEK | VERWIJDERD |
| 2 | `test-ai` lekt provider secret metadata | HOOG | VERWIJDERD |
| 3 | `test-ai` gebruikt CORS wildcard `*` | HOOG | VERWIJDERD |
| 4 | Geen edge function proxy voor image generation | MIDDEL | OPGELOST (generateImage) |
| 5 | Geen edge function proxy voor drawing analysis | MIDDEL | OPGELOST (analyzeDrawing) |
| 6 | Geen edge function proxy voor developer AI tools | LAAG | OPGELOST (3 functies) |

### 4.2 Aanbevelingen voor Toekomstige Iteraties

1. **Audit logging (EU AI Act Art. 12):** Overweeg om AI-interacties via generateImage en analyzeDrawing te loggen in een audit tabel voor traceerbaarheid.
2. **Output filtering:** De `filterAiOutput()` filter uit chat wordt nog niet toegepast op de developer AI functies. Overweeg dit toe te voegen als deze functies leerling-facing worden.
3. **Content moderation voor gegenereerde afbeeldingen:** De huidige safety prefix is een instructie aan het model. Overweeg een aparte content moderation stap als extra vangnet.
4. **Monitoring:** Stel alerting in voor 429/502 responses om overmatig gebruik of Mistral/BFL-problemen vroeg te detecteren.

---

## 5. Compliance Status

| Vereiste | Status | Toelichting |
|----------|--------|-------------|
| OWASP LLM01 (Prompt Injection) | CONFORM | sanitizePrompt() + server-side system instructions |
| OWASP LLM02 (Insecure Output) | CONFORM | Response validatie + filterAiOutput (chat) |
| EU AI Act Art. 9 (Risk Management) | DEELS | Rate limiting + input validatie aanwezig; audit logging aanbevolen |
| EU AI Act Art. 12 (Logging) | DEELS | chat heeft logging; nieuwe functies nog niet |
| EU AI Act Art. 14 (Human Oversight) | N/A | Nieuwe functies genereren geen beoordelingen van leerresultaten |
| AVG Data Minimalisatie | CONFORM | Geen PII in prompts, server-side verwerking |
| Kindveiligheid | CONFORM | Safety prefixes, BLOCK_LOW_AND_ABOVE, output filtering |

---

## 6. Conclusie

Alle AI-integraties in DGSkills edge functions voldoen aan de security baseline. De kritieke `test-ai` debug functie is verwijderd. Vijf nieuwe edge functions zijn aangemaakt met consistente security controls: JWT auth, rate limiting, input sanitization, server-side system instructions, en generieke error handling.

**Volgende stappen:** Audit logging toevoegen aan de nieuwe functies conform EU AI Act Art. 12, en content moderation pipeline voor gegenereerde afbeeldingen evalueren.
