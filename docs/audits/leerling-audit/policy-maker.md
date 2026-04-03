# Audit — Policy Maker (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `policy-maker` |
| **Titel** | Policy Maker |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | DebateArena + AI-chat (chatRoleId: `policy-maker`) |
| **SLO-kerndoelen** | 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Policy Maker" is herkenbaar
- [x] `introDescription` geeft het dilemma concreet weer — gezichtsherkenning op schoolpleinen
- [x] `introFeatures` beschrijft vijf stappen helder
- [x] Het dilemma is direct maatschappelijk relevant voor de doelgroep
- [x] Vier posities zijn duidelijk geformuleerd met beschrijving

**Bronbestanden:** `components/missions/templates/debate-arena/configs/policy-maker.ts:1-16`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het dilemma (gezichtsherkenning op schoolpleinen) is bewust gekozen vanwege de directe relevantie voor leerlingen — ze zijn zelf de betrokkenen. De vier stakeholders zijn divers en realistisch (ouder, leerling, wethouder, onderzoeker). Het dilemma is complex genoeg om niet-triviaal te zijn, maar concreet genoeg om direct te begrijpen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — `#7C3AED` is hardcoded hex in agent-veld
- [x] DebateArena-template is consistent opgebouwd
- [x] Stakeholder-kaarten zijn visueel onderscheiden via emoji
- [x] Posities zijn duidelijk gelabeld
- [x] Responsive via template

**Bronbestanden:** `config/agents/year3.tsx:1243`, `components/missions/templates/debate-arena/configs/policy-maker.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De DebateArena-template biedt een duidelijke visuele structuur. Stakeholders worden gepresenteerd met emoji en naam, wat de oriëntatie helpt. De hardcoded hex `#7C3AED` is een minor code-kwaliteitsissue. Geen blokkerende visuele problemen.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Lees standpunten → Kies positie → Bouw argumenten → Reageer op tegenargument → Reflecteer
- [x] Elke stap bouwt voort op de vorige — je moet de standpunten lezen voordat je argumenteert
- [x] Moeilijkheid past bij leerjaar — J3 havo/vwo kan genuanceerde beleidsanalyse aan
- [x] Argumentprompts begeleiden de leerling bij het opbouwen van argumenten
- [x] Reflectievragen na het debat sluiten de leercyclus

**Bronbestanden:** `components/missions/templates/debate-arena/configs/policy-maker.ts:62-93`

**Score:** 5 / 5

**Opmerkingen:**
> De DebateArena-template biedt een bewezen debatstructuur. De vier stakeholders vertegenwoordigen echt verschillende perspectieven (emotioneel — rationeel — juridisch — wetenschappelijk). De posities zijn evenwichtig — geen is duidelijk "fout". Het tegenargument ("We accepteren al camera's in supermarkten...") is een sterk en realistisch argument dat leerlingen dwingt dieper na te denken.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] EU AI Act-referentie correct — "verbiedt real-time biometrische identificatie in openbare ruimtes" is feitelijk correct voor Annex VI-categorieën
- [x] Wetenschappelijk argument correct — camerasurveillance verplaatst pestgedrag is gedocumenteerd in literatuur
- [x] Takeaways zijn feitelijk correct en up-to-date
- [x] Geen spelfouten gevonden
- [x] Taalgebruik is toegankelijk voor J3

**Bronbestanden:** `components/missions/templates/debate-arena/configs/policy-maker.ts:122-127`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en actueel. De EU AI Act-referentie klopt (verbod op real-time biometrische identificatie in openbare ruimtes, Annex VI punt 1a). De claim dat pestgedrag verplaatst bij camera-aanwezigheid is consistent met sociaal-wetenschappelijk onderzoek. De vier takeaways zijn bondig en correct. Dit is een van de inhoudelijk sterkste missies in de catalogus.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ~1900 tekens
- [x] EERSTE BERICHT aanwezig en authentiek — "Beleidsadviseur, u wordt gevraagd voor een urgente kwestie"
- [x] STEP_COMPLETE markers aanwezig (3/3) — stakeholders, beleidsvoorstel, impactbeoordeling
- [x] Verificatievraag in EERSTE BERICHT — "Noem minstens 4 stakeholders"
- [x] Scope Guard aanwezig — "In beleid tellen meningen pas als ze onderbouwd zijn"
- [x] Toon: diplomatiek en analytisch, passend bij rol van beleidsadviseur

**Bronbestanden:** `config/agents/year3.tsx:1257-1309`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coaching structuur. Het formele "u" in het EERSTE BERICHT zet meteen de toon van een echte beleidsomgeving. De instructie om altijd het tegenargument te stimuleren is pedagogisch sterk. De STEP_COMPLETE markers zijn logisch: je kunt geen beleidsvoorstel schrijven zonder eerst de stakeholders te kennen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] DebateArena biedt vier keuze-posities — actieve keuze is betrokken
- [x] Argumentprompts verlagen de drempel tot schrijven
- [x] Reflectievragen sluiten de missie af
- [x] AI-chat biedt gepersonaliseerde begeleiding per gekozen positie
- [x] Tegenargument-ronde dwingt leerling tot kritisch denken

**Bronbestanden:** `components/missions/templates/debate-arena/configs/policy-maker.ts:62-93`

**Score:** 5 / 5

**Opmerkingen:**
> De DebateArena-template is uitstekend geschikt voor dit leerdoel. De combinatie van: (1) stakeholder-standpunten lezen, (2) positie kiezen, (3) argumenten opbouwen, en (4) reageren op een tegenargument, reproduceert een authentieke beleidsdebatvaardigheid. De vier posities zijn genuanceerd — geen is simpelweg "goed" of "fout".

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Debatmeester" (≥80%), "Scherp Denker" (≥60%), "Goed Bezig" (≥40%), "Aan de Start" (≥0%)
- [x] maxScore: 100
- [x] `takeaways[]` aanwezig — 4 concrete lessen over EU AI Act en beleidsdenken
- [x] Reflectievragen sluiten de leercyclus
- [x] Badgenamen zijn thematisch passend

**Bronbestanden:** `components/missions/templates/debate-arena/configs/policy-maker.ts:96-127`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De vier takeaways zijn concreet en leerbaar (EU AI Act, effectief beleid, afweging grondrechten, stakeholderanalyse). De reflectievragen nodigen tot echte nadenken uit. De badge "Debatmeester" is aspirationeel maar realistisch.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht 23C (Maatschappij) — beleidsvorming, ethische afweging, maatschappelijke impact van technologie
- [x] Mapping in `slo-kerndoelen-mapping.ts` is correct
- [x] Het leerdoel is toetsbaar — leerling produceert een beleidsadvies
- [x] Aansluiting bij J3P3-thema

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:175`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 23C (maatschappij en regelgeving) wordt volledig ingevuld via: beleidsvoorstel schrijven, stakeholderanalyse, ethische afweging, en EU AI Act-referentie. De missie leert precies wat ze claimt te leren.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 — professioneel maar begrijpelijk
- [x] Informatie niet alleen via kleur — stakeholders hebben emoji-labels en namen
- [x] Toetsenbord-toegankelijkheid via template
- [ ] Kleurcontrast formeel niet geverifieerd — paars palet niet getest
- [x] Positie-keuze is tekstueel beschreven

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele toegankelijkheidsproblemen. De stakeholder-representatie via emoji + naam is toegankelijk. Formele WCAG AA-test voor het paarse kleurpalet is aanbevolen maar niet blokkerend.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Relevant dilemma, directe betrokkenheid |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, minor issue |
| 3. Didactische flow | 5 | ×2 = 10 | Bewezen debatstructuur, logische opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | EU AI Act correct, wetenschappelijk onderbouwd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle structuurelementen aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | Actieve keuze, tegenargument, reflectie |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, reflectievragen |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C volledig ingevuld |
| 9. Toegankelijkheid | 4 | ×1 = 4 | WCAG-test aanbevolen |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar** (96,4% — ruim boven de 80% drempel)

> Een van de inhoudelijk sterkste missies in de J3-catalogus. Het dilemma is actueel, direct relevant voor de doelgroep, en de vier stakeholders vertegenwoordigen echte maatschappelijke perspectieven. De EU AI Act-integratie is feitelijk correct en up-to-date. Direct inzetbaar in de pilot.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded `#7C3AED` in agent-kleurveld vervangen door `lab-*` token | Laag |
| 2 | 9. Toegankelijkheid | Formele WCAG AA kleurcontrast-test uitvoeren op paars palet | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
