# Sub-verwerkerslijst DGSkills

**Bij:** Model Verwerkersovereenkomst 4.0 — DGSkills (Bijlage 4)
**Versie:** 2.0
**Datum:** 23 februari 2026
**Laatste wijziging:** 16 juni 2026

---

## 1. Inleiding

Conform artikel 11 van de Verwerkersovereenkomst en artikel 28 lid 2 AVG verstrekt DGSkills hierbij een overzicht van alle Sub-verwerkers die worden ingeschakeld bij de verwerking van Persoonsgegevens in het kader van de Dienst.

De Verwerkingsverantwoordelijke (school) wordt ten minste 30 dagen vooraf geïnformeerd over wijzigingen in deze lijst en heeft het recht om bezwaar te maken.

---

## 2. Overzicht Sub-verwerkers

### 2.1 Supabase Inc.

| Veld | Details |
|---|---|
| **Naam** | Supabase Inc. |
| **Vestigingsland** | Verenigde Staten (San Francisco, CA) |
| **Type dienst** | Backend-as-a-Service: PostgreSQL-database, authenticatie, autorisatie (Row Level Security), Edge Functions, opslag |
| **Categorieën gegevens** | Alle Persoonsgegevens: accountgegevens (naam, e-mail, rol, school_id), gebruiksgegevens (voortgang, XP-punten, activiteit), AI-chatberichten, authenticatiegegevens |
| **Categorieën Betrokkenen** | Leerlingen, docenten, schoolbeheerders |
| **Locatie verwerking** | **EU — AWS eu-central-1 (Frankfurt, Duitsland)** |
| **Doorgifte buiten EER** | Nee (EU-datacenter geselecteerd). Beperkte metadata kan via VS-gebaseerde infrastructuur lopen voor beheersdoeleinden. |
| **Waarborgen** | Supabase Data Processing Agreement (DPA), gebaseerd op SCC's. AWS eu-central-1 is SOC 2 Type II en ISO 27001 gecertificeerd. |
| **DPA-status** | Actief — Supabase DPA ondertekend |
| **Link naar DPA** | https://supabase.com/legal/dpa |

---

### 2.2 Mistral AI (La Plateforme)

| Veld | Details |
|---|---|
| **Naam** | Mistral AI SAS |
| **Vestigingsland** | Frankrijk (Parijs) — EU |
| **Type dienst** | AI-API: generatieve AI-modellen voor interactieve leeropdrachten, feedback, chatfunctionaliteit en boekhoudscanner (OCR/vision) |
| **Categorieën gegevens** | Invoergegevens van AI-interacties: opdrachttekst, leerlinginvoer (chatberichten, geredacteerde tekst), systeemprompts. PII wordt server-side geredacteerd vóór verzending. Geen directe identificatiegegevens (naam, e-mail, BSN) tenzij door leerling zelf ingevoerd en niet door de PII-redactor afgevangen. |
| **Categorieën Betrokkenen** | Leerlingen (primair), docenten en beheerders (bij boekhoudscanner) |
| **Locatie verwerking** | **EU — Mistral AI-infrastructuur in de EU (Frankrijk/Europa)** |
| **Doorgifte buiten EER** | Nee. Mistral AI is een EU-gevestigde aanbieder; verwerking vindt volledig binnen de EU plaats. |
| **Waarborgen** | Mistral AI Data Processing Agreement (DPA). ISO 27001 gecertificeerd. `safe_prompt: true` op alle API-aanroepen. Invoerdata wordt niet gebruikt voor modeltraining conform de DPA. Zero data retention voor inference-aanroepen. |
| **DPA-status** | Actief — Mistral AI DPA geaccepteerd |
| **Link naar DPA** | https://mistral.ai/terms/#data-processing-agreement |

**Aanvullende toelichting AI-verwerking:**
- DGSkills gebruikt Mistral AI via **La Plateforme** (enterprise API), niet via consumentenproducten.
- Authenticatie verloopt via een **API-key** opgeslagen als Supabase Edge Function secret. De key is nooit client-side zichtbaar.
- DGSkills stuurt uitsluitend de noodzakelijke context naar Mistral (opdrachttekst + leerlinginvoer). PII (e-mailadressen, postcodes, telefoonnummers) wordt server-side geredacteerd vóór verzending.
- `safe_prompt: true` is actief op alle Mistral-aanroepen om ongepaste content te filteren bij gebruik door minderjarigen.
- Mistral hanteert **zero data retention** op inference-aanroepen: invoer- en uitvoergegevens worden niet opgeslagen voor training. Dit is contractueel vastgelegd in de Mistral DPA.

---

### 2.3 Black Forest Labs GmbH (FLUX)

| Veld | Details |
|---|---|
| **Naam** | Black Forest Labs GmbH |
| **Vestigingsland** | Duitsland (Freiburg im Breisgau) — EU |
| **Type dienst** | AI-beeldgeneratie: FLUX-modellen voor het genereren van illustraties bij missies en leeropdrachten |
| **Categorieën gegevens** | Tekstprompts voor beeldgeneratie (beschrijvingen van gewenste afbeeldingen). Geen persoonsgegevens in prompts — prompts zijn uitsluitend beschrijvingen van te genereren illustraties. PII wordt server-side geredacteerd vóór verzending. |
| **Categorieën Betrokkenen** | Leerlingen (bij missie-illustraties) |
| **Locatie verwerking** | **EU — BFL EU-API endpoint (api.eu.bfl.ai, Duitsland/Europa)** |
| **Doorgifte buiten EER** | Nee. Black Forest Labs is een EU-gevestigde aanbieder; het EU API-endpoint (api.eu.bfl.ai) wordt gebruikt. |
| **Waarborgen** | Black Forest Labs Data Processing Agreement (DPA). EU-infrastructuur. Prompts worden niet gebruikt voor modeltraining conform de DPA. |
| **DPA-status** | Actief — BFL DPA geaccepteerd |
| **Link naar DPA** | https://blackforestlabs.ai/legal/ |

**Aanvullende toelichting beeldgeneratie:**
- DGSkills gebruikt uitsluitend het **EU-endpoint** `api.eu.bfl.ai` voor alle FLUX-aanroepen. Geen terugval naar niet-EU endpoints.
- Prompts bevatten nooit leerlingidentificerende informatie — het zijn beschrijvingen van te genereren illustraties.
- Beeldgeneratie is een **optionele** functie; leerlingen zijn niet verplicht dit te gebruiken.

---

### 2.4 Vercel Inc.

| Veld | Details |
|---|---|
| **Naam** | Vercel Inc. |
| **Vestigingsland** | Verenigde Staten (San Francisco, CA) |
| **Type dienst** | Frontend-hosting, CDN (Content Delivery Network), serverless functions, edge computing |
| **Categorieën gegevens** | Technische gegevens: IP-adressen (tijdelijk, in serverlogboeken), HTTP-verzoekgegevens. Geen directe opslag van Persoonsgegevens in Vercel; alle persistente data bevindt zich in Supabase. |
| **Categorieën Betrokkenen** | Alle platformgebruikers (leerlingen, docenten, schoolbeheerders) |
| **Locatie verwerking** | **EU — Edge-locatie Amsterdam (ams1)** als primaire locatie. Vercel maakt gebruik van een wereldwijd edge-netwerk; verzoeken worden gerouteerd naar de dichtstbijzijnde edge-node. |
| **Doorgifte buiten EER** | Mogelijk (VS). Vercel is opgenomen in het EU-US Data Privacy Framework. SCC's zijn van toepassing. |
| **Waarborgen** | Vercel Data Processing Addendum (DPA). SOC 2 Type II gecertificeerd. Logboeken worden maximaal 30 dagen bewaard. |
| **DPA-status** | Actief — Vercel DPA geaccepteerd |
| **Link naar DPA** | https://vercel.com/legal/dpa |

---

### 2.5 Zoho Corporation Pvt. Ltd.

| Veld | Details |
|---|---|
| **Naam** | Zoho Corporation Pvt. Ltd. |
| **Vestigingsland** | India (Chennai) / EU-entiteit: Zoho Europe (Nederland) |
| **Type dienst** | E-maildienst (Zoho Mail) voor platformcommunicatie: wachtwoordherstel, notificaties, supportcommunicatie |
| **Categorieën gegevens** | E-mailadressen van ontvangers, e-mailinhoud (wachtwoord-reset-links, notificaties, supportberichten) |
| **Categorieën Betrokkenen** | Docenten, schoolbeheerders (leerlingen ontvangen in principe geen directe e-mails van het platform) |
| **Locatie verwerking** | **EU — Zoho EU-datacenter (eu.zoho.com, Nederland)** |
| **Doorgifte buiten EER** | Nee (EU-datacenter geselecteerd via eu.zoho.com) |
| **Waarborgen** | Zoho Data Processing Addendum. ISO 27001 gecertificeerd. SOC 2 Type II. EU-dataresidentie gegarandeerd bij gebruik van eu.zoho.com. |
| **DPA-status** | Actief — Zoho DPA geaccepteerd |
| **Link naar DPA** | https://www.zoho.com/privacy/dpa.html |

---

## 3. Samenvatting

| Sub-verwerker | Land | Dienst | EU-verwerking? | Doorgifte VS? | DPA actief? |
|---|---|---|---|---|---|
| Supabase Inc. | VS | Database, Auth, API | Ja (Frankfurt) | Nee* | Ja |
| Mistral AI SAS | Frankrijk | AI-chat, feedback, OCR | Ja (EU) | Nee | Ja |
| Black Forest Labs GmbH | Duitsland | AI-beeldgeneratie | Ja (EU) | Nee | Ja |
| Vercel Inc. | VS | Hosting, CDN | Ja (Amsterdam) | Mogelijk | Ja |
| Zoho Corp. | India/NL | E-mail | Ja (Nederland) | Nee | Ja |

*Beperkte metadata kan via VS-infrastructuur lopen voor beheersdoeleinden.

**Niet meer actief (per 16 juni 2026):**
- ~~Google LLC (Gemini via Vertex AI)~~ — vervangen door Mistral AI (EU)
- ~~Anthropic PBC (Claude API)~~ — vervangen door Mistral AI (EU)

---

## 4. Waarborgen bij doorgifte buiten de EER

Voor Sub-verwerkers waarbij doorgifte naar de Verenigde Staten mogelijk is, gelden de volgende waarborgen:

1. **EU-US Data Privacy Framework (DPF)**: Vercel is gecertificeerd onder het EU-US Data Privacy Framework, wat een adequaatheidsbesluit van de Europese Commissie betreft (Besluit C(2023) 4745 van 10 juli 2023). Supabase verwerkt alle gegevens via AWS eu-central-1 (Frankfurt); doorgifte naar de VS is niet van toepassing voor persoonsgegevens. Mistral AI en Black Forest Labs zijn EU-gevestigde aanbieders; AVG art. 44 e.v. is niet van toepassing.

2. **Standard Contractual Clauses (SCC's)**: Aanvullend op het DPF zijn met alle Sub-verwerkers die buiten de EER kunnen verwerken de door de Europese Commissie goedgekeurde Standard Contractual Clauses (Uitvoeringsbesluit EU 2021/914) overeengekomen als terugvaloptie.

3. **Transfer Impact Assessments (TIA's)**: DGSkills heeft beoordeeld dat de combinatie van DPF-certificering, SCC's, en de technische maatregelen van de Sub-verwerkers (versleuteling, toegangsbeheersing) een passend beschermingsniveau biedt. Voor EU-gevestigde verwerkers (Mistral AI, Black Forest Labs) is geen TIA vereist.

---

## 5. Wijzigingsprocedure

1. Wijzigingen in de Sub-verwerkerslijst worden ten minste 30 dagen vooraf gecommuniceerd aan de Verwerkingsverantwoordelijke (school).
2. De meest actuele versie van deze lijst is op verzoek beschikbaar via privacy@dgskills.app.
3. Bij bezwaar van de school treden Partijen in overleg conform artikel 11 van de Verwerkersovereenkomst.

---

## 6. Contactgegevens

| Veld | |
|---|---|
| **Privacycontact DGSkills** | privacy@dgskills.app |
| **Beveiligingscontact DGSkills** | security@dgskills.app |
| **Laatste update sub-verwerkerslijst** | 16 juni 2026 |

---

## 7. Wijzigingslog

| Datum | Versie | Wijziging |
|---|---|---|
| 23 februari 2026 | 1.0 | Initiële versie. Sub-verwerkers: Supabase, Google LLC (Vertex AI), Vercel, Zoho. |
| 16 juni 2026 | 2.0 | Google LLC (Vertex AI) en Anthropic PBC verwijderd als actieve sub-verwerkers. Mistral AI SAS (Frankrijk, EU) en Black Forest Labs GmbH (Duitsland, EU) toegevoegd als vervangende AI-verwerkers. Alle AI-verwerking vindt nu volledig binnen de EU plaats. |

---

*Deze Sub-verwerkerslijst wordt ten minste jaarlijks geëvalueerd en bij elke wijziging in Sub-verwerkers geactualiseerd.*
