# Audit — Data Verzamelaar (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-verzamelaar` |
| **Titel** | Data Verzamelaar |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 21C (data), 23C (maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |
| **Opmerking** | Goud-standaard referentiemissie — verwacht score ≥80% |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Data Verzamelaar" is helder
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — gemeente-scenario maakt het direct relevant
- [x] Emoji of visueel element past bij het thema — barchart icoon met percentages (Fiets 47%, Bus 28%, Lopen 15%) is concreet en datageletterd
- [x] Moeilijkheidsgraad is voelbaar — "Medium" past bij de analytische taak

**Bronbestanden:** `config/agents/year1.tsx:2165-2196`

**Score:** 5 / 5

**Opmerkingen:**
> Het gemeente-scenario is excellent: "De gemeente vraagt jouw klas om advies" maakt de leerling meteen relevant en geeft een echte context voor de data-analyse. De visual preview toont direct percentages uit de dataset — zo weet de leerling al wat ze gaan doen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — indigo/violet gradient via Tailwind
- [x] Animaties zijn niet afleidend — geen afleidende animaties in de preview
- [ ] Kleur via `lab-*` tokens — `color: '#6366F1'` op het agent-object is hardcoded hex
- [x] Responsive vermoedelijk OK — de tabelweergave in de systemInstruction is tekstgebaseerd

**Bronbestanden:** `config/agents/year1.tsx:2170` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> Sterke visuele opzet. De dataset-preview in de visual (percentages in tags) sluit direct aan bij wat de leerling in de chat gaat doen. Enige punt: hardcoded hex kleur. De tabel in de systemInstruction is markdown-formatted — afhankelijk van hoe de chat-renderer dit toont, kan dit netjes of rommelig zijn.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Dataset verkennen → Beperkingen ontdekken → Advies geven
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je kunt pas een advies onderbouwen als je de data én de beperkingen kent
- [x] Moeilijkheid past bij het leerjaar — Medium, maar goed scaffolded voor J1
- [x] Geen vakjargon zonder uitleg — "betrouwbaar", "beperkingen", "generaliseren" worden contextgebonden gebruikt

**Bronbestanden:** `config/agents/year1.tsx:2209-2288`

**Score:** 5 / 5

**Opmerkingen:**
> De drietraps-opbouw is pedagogisch excellent. De systemInstruction bevat beoordelingscriteria per stap die precies zeggen wat "klaar" betekent: "minimaal 2 observaties", "minimaal 2 beperkingen", "advies dat data én beperkingen combineert". Dit is zeldzaam goed gespecificeerd voor J1.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — dataset is realistisch gebaseerd op CBS-patronen, beperkingen zijn correct (steekproef, seizoen, non-response)
- [x] Geen spelfouten gevonden
- [x] Taalgebruik past bij de leeftijdsgroep — B1-niveau, geschikt voor 12-15 jaar
- [x] Terminologie consistent — "dataset", "beperking", "steekproef" correct gebruikt
- [x] De onderzoeksvraag is realistisch en educatief relevant (fietsenstallingen)

**Bronbestanden:** `config/agents/year1.tsx:2197-2270`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk correct en didactisch evenwichtig. De dataset (120 leerlingen, 3 klassen, november 2025) heeft bewust ingebouwde beperkingen die leerlingen moeten ontdekken. De kritische vragen ("Slechts 120 leerlingen — kun je dit generaliseren naar heel Nederland?", "Was november representatief?") zijn methodologisch correct en op het juiste niveau.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ruim voldoende (~1800 tekens)
- [x] EERSTE BERICHT is aanwezig en verwelkomt de leerling goed — "Welkom, Data Verzamelaar! 📊"
- [x] STEP_COMPLETE markers aanwezig (3/3) — **ALLE DRIE aanwezig**: 1 (2 observaties), 2 (2 beperkingen), 3 (onderbouwd advies)
- [x] Verificatiecriteria aanwezig met expliciete drempel — "minimaal 2 observaties", "minimaal 2 beperkingen"
- [x] Toon past bij de rolnaam — vriendelijke onderzoeksbegeleider is authentiek
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:2252-2270`

**Score:** 5 / 5

**Opmerkingen:**
> Dit is de goud-standaard voor AI-coach implementatie. Alle drie STEP_COMPLETE markers zijn aanwezig met expliciete beoordelingscriteria. De instructie bevat ook de regel "Geef NOOIT het antwoord direct — laat de leerling zelf redeneren" en een hint-protocol. Het EERSTE BERICHT is kort, energiek en plaatst de leerling direct in de rol van adviseur. Uitstekend.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — analyse en redenering is de kern van datageletterdheid
- [x] Dataset is concreet en herkenbaar — schoolreizen, iets wat elke leerling zelf doet
- [x] Leerlingen moeten ZELF conclusies trekken — systemInstruction verhindert dat de AI antwoorden geeft
- [x] Handelingsperspectief aanwezig — advies aan de gemeente is een echte eindproduct

**Bronbestanden:** `config/agents/year1.tsx:2238-2245`

**Score:** 4 / 5

**Opmerkingen:**
> De interactievorm (chatgesprek over dataset) is geschikt maar mist een visuele weergave van de dataset in de chatinterface. Leerlingen werken met een mentale representatie van de tabel die in de systemInstruction staat. Als de chat de tabel netjes rendert is dit geen probleem, maar als het plain text is kan het verwarrend worden. Geen blokkeerder.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — `goalCriteria: { type: 'steps-complete', min: 3 }` aanwezig
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd** in year1.tsx
- [ ] Scoredrempels — **geen scoring**
- [ ] `takeaways[]` — **geen takeaways gedefinieerd**
- [x] `bonusChallenges: null` — expliciet aanwezig (bewust leeg gelaten)

**Bronbestanden:** `config/agents/year1.tsx:2178, 2288`

**Score:** 3 / 5

**Opmerkingen:**
> De goalCriteria is aanwezig en de STEP_COMPLETE markers zorgen dat voortgang getrackt wordt — dit is beter dan de meeste standalone missies. Maar er zijn nog steeds geen badges of takeaways. De missie eindigt als de leerling een advies heeft gegeven, maar er is geen formele samenvatting of beloning. Voor een goud-standaard missie is dit een gemiste kans.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel — 21C (data analyseren) en 23C (maatschappelijk gebruik van data) kloppen
- [x] Mapping is intern consistent
- [x] Het leerdoel is toetsbaar geformuleerd — advies aan gemeente is meetbaar eindproduct
- [x] De missie behandelt datageletterdheid op meerdere niveaus (verzamelen, begrenzen, adviseren)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 21C + 23C)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie behandelt 21C (data begrijpen en analyseren) volledig: dataset verkennen, beperkingen identificeren, en conclusies trekken. 23C (maatschappij) is aanwezig via het gemeenteadvies. De missie is een sterk voorbeeld van hoe data-geletterdheid in J1 onderwijs kan worden.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — B1-niveau, 12-15 jaar, expliciet vermeld
- [x] Dataset-informatie is tekstgebaseerd — geen kleurafhankelijkheid
- [x] Tabel in systemInstruction is toegankelijk als markdown correct rendeert
- [ ] Leerlingen zonder tablet/laptop kunnen niet actief meewerken — de missie vereist een chat-interface

**Bronbestanden:** `config/agents/year1.tsx:2197-2270`

**Score:** 4 / 5

**Opmerkingen:**
> De missie heeft geen specifieke toegankelijkheidsdrempels. De dataset is puur tekstgebaseerd, wat breed toegankelijk is. Enig punt: de missie gaat ervan uit dat leerlingen de dataset op het scherm kunnen zien terwijl ze chatten. In sommige setups kan dit een split-screen probleem zijn.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Gemeente-scenario, concrete dataset preview |
| 2. Visueel | 4 | ×1 = 4 | Sterk, één hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Pedagogisch uitstekend, criteriagebonden |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Methodologisch correct, goed niveau |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Goud-standaard: STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 4 | ×1 = 4 | Authentieke context, dataset-rendering onbekend |
| 7. Afronding & feedback | 3 | ×1 = 3 | goalCriteria + STEP_COMPLETE, mist badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C + 23C volledig aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekstgebaseerd, goed niveau |
| **TOTAAL** | | **47 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (3×1) + (5×1) + (4×1) = 47
Percentage = (47 / 55) × 100% = 85,5%
```

### Verdict

**✅ Klaar** (85,5% — boven de 80% drempel, goud-standaard bevestigd)

> Data Verzamelaar is terecht de goud-standaard: sterke didactische opbouw, uitstekende AI-coach implementatie met alle drie STEP_COMPLETE markers, feitelijk correcte inhoud en sterke SLO-aansluiting. De enige verbeterpunten zijn het ontbreken van badges/takeaways en de hardcoded kleur — beide zijn geen blokkeerders.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding & feedback | Badges en takeaways toevoegen voor formele sluiting. Als goud-standaard is dit extra relevant. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | `color: '#6366F1'` vervangen door `lab-*` token. |
| 2 | 6. Interactiviteit | Dataset expliciet tonen in de missie-interface (naast de chat) zodat leerlingen altijd kunnen refereren. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
