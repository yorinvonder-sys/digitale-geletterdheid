# Sub-verwerkerslijst DGSkills

**Bij:** Model Verwerkersovereenkomst 4.0 — DGSkills (Bijlage 4)
**Versie:** 1.0
**Datum:** 23 februari 2026
**Laatste wijziging:** 23 februari 2026

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

### 2.2 Mistral AI SAS (tekst, vision, OCR)

| Veld | Details |
|---|---|
| **Naam** | Mistral AI SAS |
| **Vestigingsland** | Frankrijk (Parijs) |
| **Type dienst** | AI-API: generatieve AI-model (Mistral AI) voor tekst, vision en OCR — interactieve leeropdrachten, feedback, en chatfunctionaliteit |
| **Categorieën gegevens** | Invoergegevens van AI-interacties: opdrachttekst, leerlinginvoer (chatberichten), systeemprompts. Geen directe identificatiegegevens tenzij door leerling zelf ingevoerd. |
| **Categorieën Betrokkenen** | Leerlingen (primair), docenten (bij gebruik van AI-functies) |
| **Locatie verwerking** | **EU — Mistral AI (Frankrijk)** als verwerkingslocatie (`api.mistral.ai`). Mistral AI SAS is in Frankrijk gevestigd; verwerking vindt plaats binnen de EU. |
| **Doorgifte buiten EER** | Nee. Mistral AI SAS is in Frankrijk gevestigd; AI-promptverwerking vindt plaats binnen de EU. |
| **Waarborgen** | Mistral AI DPA met EU SCC's (Besluit 2021/914) — ondertekende DPA te verifiëren. Dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk). Geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan). |
| **DPA-status** | Te verifiëren — ondertekende Mistral AI DPA |
| **Link naar DPA** | https://mistral.ai/terms |

**Aanvullende toelichting AI-verwerking:**
- DGSkills maakt gebruik van Mistral AI voor tekst, vision en OCR.
- Authenticatie verloopt via een **server-side API-key (Supabase secret)**, die nooit in de client bundle wordt blootgesteld.
- DGSkills stuurt uitsluitend de noodzakelijke context naar Mistral AI (opdrachttekst + leerlinginvoer).
- Persoonsgegevens zoals naam en e-mailadres worden niet meegestuurd in API-aanroepen.
- Dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk). Geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan).
- Server-side prompt-injectiefilter en safety settings zijn actief om ongepaste content te filteren.
- **LET OP:** Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow.

---

### 2.2b Black Forest Labs, Inc. (beeldgeneratie)

| Veld | Details |
|---|---|
| **Naam** | Black Forest Labs, Inc. |
| **Vestigingsland** | Verenigde Staten (verwerking via EU-endpoint) |
| **Type dienst** | AI-API: beeldgeneratie (FLUX) voor educatieve beeldopdrachten |
| **Categorieën gegevens** | Invoergegevens van AI-beeldopdrachten: prompttekst. Geen directe identificatiegegevens tenzij door leerling zelf ingevoerd. |
| **Categorieën Betrokkenen** | Leerlingen (primair), docenten (bij gebruik van AI-functies) |
| **Locatie verwerking** | **EU-endpoint `api.eu.bfl.ai`.** Black Forest Labs, Inc. is een VS-onderneming die haar EU-endpoint gebruikt voor verwerking. |
| **Doorgifte buiten EER** | Verwerking via EU-endpoint `api.eu.bfl.ai`; Black Forest Labs, Inc. is een VS-onderneming — ondertekende DPA en transfer-waarborgen te verifiëren. |
| **Waarborgen** | ISO 27001 / SOC 2 Type II — ondertekende DPA te verifiëren. |
| **DPA-status** | Te verifiëren — ondertekende DPA met Black Forest Labs |
| **Link naar DPA** | https://blackforestlabs.ai |

---

### 2.3 Vercel Inc.

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

### 2.4 Zoho Corporation Pvt. Ltd.

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
| Mistral AI SAS | Frankrijk | AI (tekst, vision, OCR) | Ja (Frankrijk) | Nee | Te verifiëren |
| Black Forest Labs, Inc. | VS (via EU-endpoint) | AI (beeldgeneratie, FLUX) | Ja (EU-endpoint `api.eu.bfl.ai`) | Via EU-endpoint | Te verifiëren |
| Vercel Inc. | VS | Hosting, CDN | Ja (Amsterdam) | Mogelijk | Ja |
| Zoho Corp. | India/NL | E-mail | Ja (Nederland) | Nee | Ja |

*Beperkte metadata kan via VS-infrastructuur lopen voor beheersdoeleinden.

---

## 4. Waarborgen bij doorgifte buiten de EER

Voor Sub-verwerkers waarbij doorgifte naar de Verenigde Staten mogelijk is, gelden de volgende waarborgen:

1. **EU-US Data Privacy Framework (DPF)**: Vercel is gecertificeerd onder het EU-US Data Privacy Framework, wat een adequaatheidsbesluit van de Europese Commissie betreft (Besluit C(2023) 4745 van 10 juli 2023). Mistral AI SAS verwerkt gegevens binnen de EU (Frankrijk); Black Forest Labs, Inc. verwerkt via haar EU-endpoint `api.eu.bfl.ai` — transfer-waarborgen voor Black Forest Labs te verifiëren.

2. **Standard Contractual Clauses (SCC's)**: Aanvullend zijn met alle Sub-verwerkers de door de Europese Commissie goedgekeurde Standard Contractual Clauses (Uitvoeringsbesluit EU 2021/914) overeengekomen als terugvaloptie. De Mistral AI DPA bevat EU SCC's (ondertekende DPA te verifiëren); voor Black Forest Labs zijn ISO 27001 / SOC 2 Type II van toepassing — ondertekende DPA te verifiëren.

3. **Transfer Impact Assessments (TIA's)**: DGSkills heeft beoordeeld dat de combinatie van DPF-certificering, SCC's, en de technische maatregelen van de Sub-verwerkers (versleuteling, toegangsbeheersing) een passend beschermingsniveau biedt.

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
| **Laatste update sub-verwerkerslijst** | 23 februari 2026 |

---

*Deze Sub-verwerkerslijst wordt ten minste jaarlijks geëvalueerd en bij elke wijziging in Sub-verwerkers geactualiseerd.*
