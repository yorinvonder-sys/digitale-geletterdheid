# Black Forest Labs (FLUX) — provider voor beeldgeneratie

DGSkills gebruikt **Black Forest Labs (FLUX)** als beeldgeneratie-provider voor
de edge function `generateImage`. BFL is een **EU-bedrijf** (Freiburg,
Duitsland) en draait via het **EU-endpoint** `api.eu.bfl.ai`, zodat
beeld-prompts en gegenereerde afbeeldingen binnen EU-infrastructuur blijven.

Dit vervangt de eerdere Vertex AI-beeldgeneratie. De **Gemini-Developer-API
fallback is volledig verwijderd** — die routeerde prompts naar een endpoint
waarvan de ToS gebruik door minderjarigen verbieden en data voor training kan
gebruiken.

## Privacy-grens

Er gaat alleen een **geschoonde, kindveilige tekst-prompt** naar BFL. Account-PII
wordt nooit toegevoegd, en high-confidence PII-patronen in de prompt
(e-mail, telefoon-/BSN-achtige nummers, postcode) worden server-side gemaskeerd
via `redactPii` vóór verzending (namen worden bewust niet geredigeerd). De
bestaande lagen blijven actief: JWT-auth, ouderlijke toestemming, rate limiting
(5/min), prompt-injectiefilter, kindveilige prefix, en audit-logging in
`ai_usage_events` (`provider = "blackforestlabs"`).

De gegenereerde afbeelding wordt **server-side gedownload** en als base64
teruggegeven; de kortlevende signed URL van BFL lekt nooit naar de client.
`safety_tolerance` staat strikt (default `1`) voor minderjarigen, en BFL's
eigen moderatie ("Content/Request Moderated") wordt als geblokkeerd behandeld.

## Hoe de API werkt (async)

1. `POST https://api.eu.bfl.ai/v1/<model>` met header `x-key: <BFL_API_KEY>`
   → respons `{ id, polling_url }`.
2. `polling_url` pollen tot `status: "Ready"` → `result.sample` = signed image
   URL (~10 min geldig).
3. Afbeelding downloaden → base64 → teruggeven als `{ imageBase64, mimeType }`.

## Secret instellen (jouw API-key uploaden)

```bash
supabase secrets set BFL_API_KEY='jouw-bfl-api-key'

# Optioneel:
supabase secrets set BFL_API_BASE='https://api.eu.bfl.ai'   # houd EU-endpoint
supabase secrets set BFL_IMAGE_MODEL='flux-pro-1.1'
supabase secrets set BFL_SAFETY_TOLERANCE='1'               # 0=strengst .. 6=laxst
supabase secrets set BFL_POLL_TIMEOUT_MS='60000'
```

De key wordt alleen server-side gelezen via `Deno.env.get("BFL_API_KEY")`,
nooit gehardcodeerd en nooit gelogd. Na het zetten van de secret de functie
herdeployen (`generateImage`).

## ⚠️ Compliance — bevestigen VÓÓR productie

- [ ] Getekende **Data Processing Agreement (DPA)** met Black Forest Labs.
- [ ] **EU-endpoint** (`api.eu.bfl.ai`) gebruikt, niet het globale.
- [ ] **Zero-retention-tier** bevestigd; geen training op klantdata.
- [ ] Voorwaarden die genereren van content voor **minderjarigen (12-18)** toestaan.
- [ ] Risicoregister (`business/nl-vo/compliance/risicoregister-ai-act.md`) en
      DPIA bijgewerkt met BFL als (sub)verwerker.

Zolang deze punten niet zijn afgevinkt: dit is voorwerk. De code staat klaar,
maar beeldgeneratie mag pas productie-breed live met BFL nadat compliance
akkoord is en de `BFL_API_KEY` is gezet.
