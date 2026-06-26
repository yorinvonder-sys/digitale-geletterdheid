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
| **Locatie verwerking** | EU-projectregio / EER, exact te verifiëren in Supabase projectsettings en DPA |
| **Doorgifte buiten EER** | Mogelijk voor beheer/toegang door VS-entiteit; beoordelen via DPA, SCC's en projectsettings. |
| **Waarborgen** | Supabase Data Processing Agreement (DPA), gebaseerd op SCC's. Projectregio en onderliggende AWS-regio moeten vóór schoolgebruik worden vastgelegd. |
| **DPA-status** | Actief — Supabase DPA ondertekend |
| **Link naar DPA** | https://supabase.com/legal/dpa |

---

### 2.2 Mistral AI

| Veld | Details |
|---|---|
| **Naam** | Mistral AI |
| **Vestigingsland** | Frankrijk |
| **Type dienst** | AI-API: tekst/chat/feedback, vision-analyse en OCR voor interactieve leeropdrachten |
| **Categorieën gegevens** | Invoergegevens van AI-interacties: opdrachttekst, leerlinginvoer (chatberichten), systeemprompts. Geen directe identificatiegegevens tenzij door leerling zelf ingevoerd. |
| **Categorieën Betrokkenen** | Leerlingen (primair), docenten (bij gebruik van AI-functies) |
| **Locatie verwerking** | Providerregio en subprocessorpad te verifiëren in Mistral DPA, console/configuratie en actuele providerdocumentatie |
| **Doorgifte buiten EER** | Te verifiëren. Indien verwerking/toegang buiten de EER mogelijk is, zijn SCC's en een TIA nodig. |
| **Waarborgen** | Mistral DPA en subprocessoroverzicht; technische maatregelen in DGSkills: server-side proxy, dataminimalisatie, geen providercredentials in browser, outputfiltering. Uitsluiting van provider-modeltraining geldt waar dit door providerafspraken en instellingen wordt gedekt. |
| **DPA-status** | Te bevestigen vóór schoolgebruik / FG-toets |
| **Link naar DPA** | https://mistral.ai/terms/#data-processing-agreement |

**Aanvullende toelichting AI-verwerking:**
- DGSkills gebruikt Mistral AI server-side via Supabase Edge Functions voor tekst/chat/feedback, vision en OCR.
- DGSkills stuurt uitsluitend noodzakelijke context (opdrachttekst + leerlinginvoer + relevante missiecontext).
- Persoonsgegevens zoals naam en e-mailadres worden niet meegestuurd in reguliere AI-aanroepen tenzij een feature dit expliciet vereist en juridisch is beoordeeld.
- Gebruik voor provider-modeltraining wordt uitgesloten waar dit door Mistral-afspraken en instellingen wordt gedekt; bewijs moet in het leveranciersdossier worden bewaard.
- Outputfiltering, prompt-sanitizing en welzijnsprotocol blijven DGSkills-eigen waarborgen bovenop providermaatregelen.

### 2.3 Black Forest Labs

| Veld | Details |
|---|---|
| **Naam** | Black Forest Labs GmbH |
| **Vestigingsland** | Duitsland |
| **Type dienst** | FLUX image generation voor specifieke ontwerp- en promptmissies |
| **Categorieën gegevens** | Beeldgeneratieprompts en gegenereerde afbeeldingen; geen directe identificatiegegevens tenzij door gebruiker zelf ingevoerd |
| **Categorieën Betrokkenen** | Leerlingen en docenten bij gebruik van beeldgeneratiefuncties |
| **Locatie verwerking** | Providerregio en subprocessorpad te verifiëren in contract/settings/providerdocumentatie |
| **Doorgifte buiten EER** | Te verifiëren. Indien verwerking/toegang buiten de EER mogelijk is, zijn SCC's en een TIA nodig. |
| **Waarborgen** | Server-side verwerking via Edge Functions; provider-URL's worden door de server opgehaald; DPA/subprocessorbewijs vereist vóór schoolgebruik |
| **DPA-status** | Te bevestigen vóór schoolgebruik / FG-toets |
| **Link naar DPA** | Providercontract of privacy/security-documentatie toevoegen aan leveranciersdossier |

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
| Supabase Inc. | VS | Database, Auth, API | EU-projectregio te verifiëren | Mogelijk* | Ja / te bevestigen per project |
| Mistral AI | Frankrijk | AI tekst/chat/vision/OCR | Te verifiëren | Te verifiëren | Te bevestigen |
| Black Forest Labs | Duitsland | AI image generation | Te verifiëren | Te verifiëren | Te bevestigen |
| Vercel Inc. | VS | Hosting, CDN | Ja (Amsterdam) | Mogelijk | Ja |
| Zoho Corp. | India/NL | E-mail | Ja (Nederland) | Nee | Ja |

*Beperkte metadata, beheerstoegang of supporttoegang kan buiten de EER plaatsvinden afhankelijk van providerafspraken.

---

## 4. Waarborgen bij doorgifte buiten de EER

Voor Sub-verwerkers waarbij doorgifte naar de Verenigde Staten mogelijk is, gelden de volgende waarborgen:

1. **EU-US Data Privacy Framework (DPF)**: Vercel is gecertificeerd onder het EU-US Data Privacy Framework, wat een adequaatheidsbesluit van de Europese Commissie betreft (Besluit C(2023) 4745 van 10 juli 2023). Voor AI-providers moet per provider worden vastgesteld of DPF, SCC's of andere waarborgen van toepassing zijn.

2. **Standard Contractual Clauses (SCC's)**: Aanvullend op het DPF moeten met Sub-verwerkers de door de Europese Commissie goedgekeurde Standard Contractual Clauses (Uitvoeringsbesluit EU 2021/914) zijn overeengekomen waar doorgifte buiten de EER mogelijk is.

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
