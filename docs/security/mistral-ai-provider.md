# Mistral AI — provider voor leerling-chat

DGSkills gebruikt **Mistral AI** (EU-provider, Frankrijk) als AI-model dat de
chatverzoeken van leerlingen behandelt: de edge functions `chat` en
`chatStream`. Beeldgeneratie (`generateImage`), bonnetjes scannen
(`scanReceipt`) en de overige functies blijven op Vertex AI draaien.

## Waarom Mistral

EU-gevestigde provider, zodat leerlinginteracties onder EU-privacyregels worden
verwerkt.

## Privacy-grens (ongewijzigd t.o.v. Vertex)

Er gaat **geen leerling-PII** naar Mistral. Het verzoek bevat uitsluitend:

- het geschoonde bericht van de leerling (`sanitizePrompt`);
- de geschoonde gespreksgeschiedenis (`buildSafeHistory`);
- een server-side rol-instructie (`getSystemInstruction`).

**Account-PII** (naam, e-mail, school, voortgang, profieldata) wordt nooit aan
de prompt toegevoegd. Daarnaast worden **high-confidence PII-patronen in de
vrije tekst** van de leerling server-side gemaskeerd vóór verzending
(`redactPii`): e-mailadressen, telefoon-/BSN-achtige nummers en postcodes.
Let op: **namen worden bewust níet geredigeerd** (betrouwbare naamdetectie is
niet haalbaar zonder het tutoren te schaden), dus een leerling die zelf zijn
naam inttypt kan die nog meesturen — leerlingen wordt gevraagd geen
persoonsgegevens te delen.

De bestaande lagen blijven volledig actief en zijn provider-onafhankelijk:
prompt-injectiefilter, rate limiting (15/min), ouderlijke toestemming,
output-filter voor minderjarigen, en audit-logging in `ai_usage_events`
(`provider = "mistral"`).

`safe_prompt: true` staat aan op elke Mistral-call als extra moderatielaag.

## Secret instellen (jouw API-key uploaden)

```bash
supabase secrets set MISTRAL_API_KEY='jouw-mistral-api-key'

# Optioneel — modellen overschrijven zonder code-wijziging:
supabase secrets set MISTRAL_DEFAULT_MODEL='mistral-small-latest'
supabase secrets set MISTRAL_CODE_MODEL='mistral-large-latest'
```

De key wordt alleen server-side gelezen via `Deno.env.get("MISTRAL_API_KEY")`,
nooit gehardcodeerd en nooit gelogd. Na het zetten van de secret de functies
herdeployen (`chat`, `chatStream`).

## Modelkeuze

| Rol | Constant | Default | Wanneer |
|-----|----------|---------|---------|
| Standaard | `DEFAULT_MODEL` | `mistral-small-latest` | Algemene leerlingbegeleiding |
| Code | `CODE_MODEL` | `mistral-large-latest` | game-programmeur met game-context |

Beide zijn te overschrijven via de secrets hierboven.

## ⚠️ Compliance — bevestigen VÓÓR productie

Vertex AI was destijds gekozen omdat de gewone Gemini-API gebruik door
<18-jarigen verbiedt. Voor Mistral moet vóór livegang bevestigd zijn:

- [ ] Getekende **Data Processing Agreement (DPA)** met Mistral.
- [ ] Voorwaarden die verwerking van data van **minderjarigen (12-18)** toestaan.
- [ ] **EU-dataresidentie** gegarandeerd.
- [ ] Klantdata wordt **niet gebruikt voor training** (opt-out bevestigd).
- [ ] Risicobeoordeling gedocumenteerd (EU AI Act Art. 9) en DPIA bijgewerkt.

Zolang deze punten niet zijn afgevinkt, is dit voorwerk: de code staat klaar,
maar de leerling-chat mag pas productie-breed live met Mistral nadat compliance
akkoord is.
