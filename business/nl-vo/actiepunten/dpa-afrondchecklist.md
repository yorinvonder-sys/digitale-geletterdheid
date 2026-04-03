# DPA-afrondchecklist — Verwerkersovereenkomst Ondertekeningsklaar

**Doel:** checklist om de Verwerkersovereenkomst (DPA) en alle bijlagen gereed te maken voor ondertekening door scholen.
**Status per:** April 2026
**Beheer:** Yorin Vonder, DGSkills.app

---

## Overzicht DPA-documenten

| Bestand | Status |
|---------|--------|
| `A-model-verwerkersovereenkomst-dgskills.md` | Concept gereed, geen DGSkills-placeholders |
| `B-beveiligingsbijlage-dgskills.md` | Gereed |
| `C-sub-verwerkerslijst-dgskills.md` | Gereed |
| `D-handleiding-verwerkersovereenkomst-scholen.md` | Controleer |
| `E-privacybijsluiter-dgskills.md` | Gereed |

---

## Sectie 1 — Placeholders en invulvelden

### Wat nog in te vullen is door DGSkills (voor verzending)

- [x] KvK-nummer 81819889 — ingevuld in VWO art. Partijen
- [x] Adres Zwolle — ingevuld in VWO art. Partijen
- [x] Naam vertegenwoordiger Yorin Vonder — ingevuld
- [x] E-mailadres privacy@dgskills.app — ingevuld
- [x] Sub-verwerkers lijst — volledig ingevuld (bijlage C)
- [x] Bewaartermijnen — ingevuld in Art. 12
- [x] Verwerkingsregister placeholders — gecorrigeerd (april 2026)

### Wat door de school wordt ingevuld bij ondertekening

- [ ] Naam instelling
- [ ] BRIN-nummer
- [ ] Adres school
- [ ] Vertegenwoordiger (naam + functie)
- [ ] E-mailadres contactpersoon
- [ ] Datum ondertekening

> Deze velden zijn terecht leeg — ze zijn bedoeld voor de school en mogen niet door DGSkills worden ingevuld.

---

## Sectie 2 — Consistentie met DPIA en verwerkingsregister

| Check | Status | Toelichting |
|-------|--------|-------------|
| Categorieën persoonsgegevens in VWO consistent met DPIA | Controleer | Vergelijk Art. 1 VWO (definities) met DPIA sectie gegevenscategorieën |
| Doeleinden in privacybijsluiter (E) consistent met verwerkingsregister | Grotendeels OK | Privacybijsluiter en verwerkingsregister noemen dezelfde categorieën |
| Bewaartermijnen VWO Art. 12 consistent met verwerkingsregister | OK | Beide: accountgegevens: looptijd + 3 maanden; chat: 90 dagen; logs: 12 maanden |
| Sub-verwerkers VWO Art. 11 consistent met bijlage C | OK | Vier sub-verwerkers: Supabase, Google/Vertex AI, Vercel, Zoho |
| Rechtsgrondslag verwerking consistent | Controleer | Verwerkingsregister: Art. 6(1)(b) en 6(1)(e) AVG — controleer of dit de juiste grondslag is voor leerlingverwerking in combinatie met de school als verwerkingsverantwoordelijke |
| Doorgifte buiten EER — Vercel | Gemarkeerd | Bijlage C en Art. 10 VWO: Vercel "mogelijk VS". DPF + SCC's als waarborg ingevuld. Correct. |

---

## Sectie 3 — Model Verwerkersovereenkomst 4.0 (Privacyconvenant Onderwijs)

### Is het model correct gevolgd?

| Eis | Status | Toelichting |
|-----|--------|-------------|
| Opgebouwd op basis van Model 4.0 structuur | OK | VWO volgt de artikelindeling van het SIVON-model |
| Afwijkingen gedocumenteerd in Bijlage 3 | OK | Drie afwijkingen gedocumenteerd: (1) geen formele convenant-deelnemer, (2) beperkte VS-doorgifte Vercel, (3) geen ISO 27001 |
| Formeel convenant-deelnemerschap DGSkills | Openstaand | DGSkills is nog geen formele deelnemer. Actie: aanvraag indienen bij Kennisnet/SIVON voor deelname als aanbieder. |
| SIVON Model VWO 5.0 (in ontwikkeling) | Monitor | Model 5.0 zal AI Act-bepalingen bevatten. Bij publicatie: update VWO conform model 5.0. Verwacht: 2026. |

---

## Sectie 4 — Sub-verwerkers actueel

| Sub-verwerker | DPA afgesloten? | EU-verwerking? | Actueel? |
|--------------|----------------|----------------|---------|
| Supabase Inc. | Ja (actief) | Ja (Frankfurt) | Controleer jaarlijks |
| Google LLC (Vertex AI) | Ja (actief) | Ja (Nederland, europe-west4) | Controleer jaarlijks |
| Vercel Inc. | Ja (actief) | Ja (Amsterdam) + mogelijk VS | Controleer jaarlijks |
| Zoho Corp. | Ja (actief) | Ja (Nederland) | Controleer jaarlijks |

**Actie:** Controleer bij elke jaarlijkse review of de DPA-links nog kloppen en of er geen wijzigingen zijn bij de sub-verwerkers.

---

## Sectie 5 — Technische en Organisatorische Maatregelen (TOMs)

De TOMs zijn beschreven in Bijlage B (Beveiligingsbijlage). Controleer voor ondertekening:

| Maatregel | Beschreven in Bijlage B? | Daadwerkelijk geïmplementeerd? |
|-----------|-------------------------|-------------------------------|
| TLS/HTTPS versleuteling | Ja | Ja |
| Encryptie at rest (AES-256 via Supabase) | Ja | Ja |
| Row Level Security (RLS) | Ja | Ja |
| MFA voor docenten/beheerders | Ja | Ja (AAL2 actief) |
| Input validatie + prompt injection preventie | Ja | Ja (40+ patronen) |
| Auditlogging | Ja | Ja (12 maanden bewaartermijn) |
| Incidentrespons procedure | Ja (Art. 5 bijlage B) | Ja (gedocumenteerd) |
| Back-up en herstel (RTO/RPO) | Ja | Ja (Supabase PITR) |
| Periodieke penetratietest | Ja (roadmap) | Nog niet — eerste test gepland 2026 |
| ISO 27001 / SOC 2 certificering | Roadmap 2027 | Nee — gedocumenteerde afwijking |
| Hersteltest back-ups | Ja | Gepland 2x/jaar — eerste test uitvoeren |

---

## Sectie 6 — Formele stappen voor ondertekening

### Checklist voor ingebruikname DPA

- [ ] **Jurist review AV** — de Verwerkersovereenkomst hangt samen met de AV. Review beide documenten samen (zie `av-jurist-briefing.md`).
- [ ] **Privacyconvenant Kennisnet** — Overweeg formele aanvraag als aanbieder-deelnemer. Verhoogt vertrouwen bij scholen aanzienlijk.
- [ ] **Ondertekeningsformaat vaststellen** — Digitaal (bijv. via DocuSign, HelloSign, of Zivver) of fysiek? Aanbeveling: digitale handtekening conform eIDAS (geavanceerde elektronische handtekening).
- [ ] **Begeleidende communicatie opstellen** — Korte begeleidende brief voor de school bij aanbieding VWO. Verwijs naar handleiding `D-handleiding-verwerkersovereenkomst-scholen.md`.
- [ ] **DPIA beschikbaar stellen op verzoek** — Scholen kunnen om de DPIA vragen bij aanschaf. Zorg dat je de DPIA snel kunt delen (vertrouwelijk, op verzoek).
- [ ] **KvK-deponering AV** — Art. 2 lid 5 AV verwijst naar deponering bij KvK. Voer dit uit voor eerste commercieel contract.
- [ ] **Verzekering afsluiten** — Vermeld verzekeringsgegevens in Art. 19 AV zodra verzekering is afgesloten (zie `verzekeringsgids.md`).

---

## Sectie 7 — Openstaande risico's en actiepunten

| Risico / Actie | Ernst | Deadline | Toelichting |
|----------------|-------|----------|-------------|
| Geen formele convenant-deelnemerschap | Midden | Voor eerste contract | Kennisnet-aanvraag indienen; alternatief: als medestander verklaren (al gedaan in Bijlage 3 VWO) |
| Geen ISO 27001 / SOC 2 | Midden | 2027 | Gedocumenteerd als roadmap; geen blokkade voor ondertekening |
| SIVON Model VWO 5.0 nog niet beschikbaar | Laag | Zodra gepubliceerd | Monitor en update VWO direct bij publicatie |
| Eerste penetratietest nog niet uitgevoerd | Midden | 2026 | Gepland; voer uit voor grootschalige uitrol |
| Hersteltest back-ups nog niet uitgevoerd | Midden | Voor eerste contract | Supabase PITR testen; documenteer resultaat |
| Jurist review VWO (samen met AV) | Hoog | Voor 1 mei 2026 | Bespreek met jurist bij AV-review (zie briefing) |

---

## Sectie 8 — Wat de school bij ondertekening ontvangt

Bij ondertekening van een contract stuurt DGSkills de school het volgende pakket:

1. Ondertekende Verwerkersovereenkomst (A-model)
2. Privacybijsluiter (Bijlage E) — leesbaar voor docenten en ouders
3. Beveiligingsbijlage (Bijlage B) — voor ICT-coördinators
4. Sub-verwerkerslijst (Bijlage C) — voor compliance-dossier school
5. Handleiding verwerkersovereenkomst (Bijlage D) — begeleiding bij implementatie
6. Bewijs van verzekering (na afsluiten BAV)
7. Op verzoek: DPIA en verwerkingsregister (vertrouwelijk)

---

## Status samenvatting

| Onderdeel | Status |
|-----------|--------|
| VWO Hoofddocument (A) | Concept gereed — review aanbevolen |
| Beveiligingsbijlage (B) | Gereed |
| Sub-verwerkerslijst (C) | Gereed |
| Handleiding scholen (D) | Controleer inhoud |
| Privacybijsluiter (E) | Gereed |
| Verwerkingsregister | Placeholders gevuld (april 2026) |
| DPIA | Gereed |
| Jurist review | **Nog niet uitgevoerd** |
| Ondertekeningsformaat | **Nog te bepalen** |
| KvK-deponering AV | **Nog niet uitgevoerd** |
| Privacyconvenant deelnemerschap | **Nog niet aangevraagd** |

---

*Opgesteld: april 2026 | Volgende review: voor eerste schoolcontract*
