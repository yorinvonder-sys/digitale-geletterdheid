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

### 2.2 Google LLC (Gemini via Vertex AI)

| Veld | Details |
|---|---|
| **Naam** | Google LLC (Google Cloud — Vertex AI) |
| **Vestigingsland** | Verenigde Staten (Mountain View, CA) |
| **Type dienst** | AI-API: generatieve AI-model (Google Gemini via Vertex AI) voor interactieve leeropdrachten, feedback, en chatfunctionaliteit |
| **Categorieën gegevens** | Invoergegevens van AI-interacties: opdrachttekst, leerlinginvoer (chatberichten), systeemprompts. Geen directe identificatiegegevens tenzij door leerling zelf ingevoerd. |
| **Categorieën Betrokkenen** | Leerlingen (primair), docenten (bij gebruik van AI-functies) |
| **Locatie verwerking** | **EU — Google Cloud europe-west4 (Eemshaven, Nederland)** als vaste verwerkingslocatie. Door het gebruik van Vertex AI met een regionaal endpoint is dataresidentie gegarandeerd: data-at-rest en ML-verwerking vinden uitsluitend plaats binnen de EU. Geen terugval naar VS-datacenters. |
| **Doorgifte buiten EER** | Nee. Door de inzet van Vertex AI met het regionale endpoint europe-west4 blijven alle gegevens binnen de EU. |
| **Waarborgen** | Google Cloud Data Processing Addendum (CDPA) met Standard Contractual Clauses (SCC's). ISO 27001, SOC 2 Type II, ISO 27017, ISO 27018 gecertificeerd. Zero data retention: Google bewaart geen invoer- of uitvoergegevens. Invoergegevens worden niet gebruikt voor modeltraining. |
| **DPA-status** | Actief — Google Cloud CDPA geaccepteerd |
| **Link naar DPA** | https://cloud.google.com/terms/data-processing-addendum |

**Aanvullende toelichting AI-verwerking:**
- DGSkills maakt gebruik van Google Gemini via **Vertex AI** (enterprise-editie), niet via de Gemini Developer API.
- Authenticatie verloopt via een **service account** (geen API-key), wat enterprise-grade beveiliging en auditbaarheid biedt.
- DGSkills stuurt uitsluitend de noodzakelijke context naar Vertex AI (opdrachttekst + leerlinginvoer).
- Persoonsgegevens zoals naam en e-mailadres worden niet meegestuurd in API-aanroepen.
- Google hanteert **zero data retention** op Vertex AI: invoer- en uitvoergegevens worden niet opgeslagen en niet gebruikt voor modeltraining. Dit is contractueel vastgelegd in de Google Cloud DPA.
- Safety-filters van Google Gemini zijn actief om ongepaste content te filteren.
- Vertex AI kent geen Terms of Service-beperking voor gebruik door minderjarigen; de verantwoordelijkheid ligt bij de verwerkingsverantwoordelijke school.

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
| Google LLC | VS | AI (Gemini via Vertex AI) | Ja (Nederland) | Nee | Ja |
| Vercel Inc. | VS | Hosting, CDN | Ja (Amsterdam) | Mogelijk | Ja |
| Zoho Corp. | India/NL | E-mail | Ja (Nederland) | Nee | Ja |

*Beperkte metadata kan via VS-infrastructuur lopen voor beheersdoeleinden.

---

## 4. Waarborgen bij doorgifte buiten de EER

Voor Sub-verwerkers waarbij doorgifte naar de Verenigde Staten mogelijk is, gelden de volgende waarborgen:

1. **EU-US Data Privacy Framework (DPF)**: Vercel is gecertificeerd onder het EU-US Data Privacy Framework, wat een adequaatheidsbesluit van de Europese Commissie betreft (Besluit C(2023) 4745 van 10 juli 2023). Google Cloud (Vertex AI) verwerkt alle gegevens uitsluitend binnen de EU (europe-west4); doorgifte naar de VS is niet van toepassing.

2. **Standard Contractual Clauses (SCC's)**: Aanvullend op het DPF zijn met alle Sub-verwerkers de door de Europese Commissie goedgekeurde Standard Contractual Clauses (Uitvoeringsbesluit EU 2021/914) overeengekomen als terugvaloptie. De Google Cloud DPA bevat SCC's.

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
