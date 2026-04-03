# Audit — AI Trainer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-trainer` |
| **Titel** | AI Trainer |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (chat + custom train/predict tags) |
| **SLO-kerndoelen** | 21D (AI), 21C (data) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "AI Trainer" is helder en intrigerend
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — duidelijk dat je een AI gaat trainen
- [x] Emoji of visueel element past bij het thema — visuele preview met trainingskaarten en voortgangsbalken is aantrekkelijk
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Medium" past bij de 3-staps flow

**Bronbestanden:** `config/agents/year1.tsx:1473-1526`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk. De preview met trainingskaarten en voortgangsbalken maakt direct duidelijk wat de missie inhoudt — je bent letterlijk een AI aan het trainen. De beschrijving is concreet en uitnodigend. Niet een volle 5 omdat de overgang van preview naar daadwerkelijke interface niet verifieerbaar is zonder runtime.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — tekst is kort en overzichtelijk in de preview
- [x] Kleuren zijn consistent — indigo/purple gradient past goed bij het tech-AI-thema
- [x] Animaties zijn niet afleidend of overweldigend — voortgangsbalken zijn rustige visuele elementen
- [ ] Responsive op minimaal 375 px breed (mobiel) — trainingskaarten naast elkaar kunnen op smal scherm krap worden

**Bronbestanden:** `config/agents/year1.tsx:1473-1526`

**Score:** 4 / 5

**Opmerkingen:**
> Sterk visueel ontwerp. De indigo/purple kleurencombinatie past uitstekend bij het AI-thema en de trainingskaarten met voortgangsbalken geven direct een gevoel van voortgang en prestatie. Kleine bedenking: de lay-out met meerdere kaarten naast elkaar kan op smalle mobiele schermen krap worden — dit is niet verifieerbaar zonder runtime, maar verdient aandacht.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Label → Train → Test is een uitstekende pedagogische volgorde
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je kunt niet testen zonder eerst te trainen
- [x] Moeilijkheid past bij het leerjaar — J1, Medium, bewuste fout-oefening is goed gedoseerd
- [x] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — "Garbage In Garbage Out" is een perfect vereenvoudigd concept voor J1

**Bronbestanden:** `config/agents/year1.tsx:1473-1600`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw. De drie stappen (labelen → trainen → testen) zijn een directe nabootsing van hoe echte machine learning werkt, maar op het niveau van J1 begrijpelijk gemaakt. Het bewust insluiten van een fout-oefening ("Garbage In Garbage Out") is didactisch slim — leerlingen leren niet alleen wat werkt, maar ook waarom foute data problemen geeft. Minpunt: er ontbreken STEP_COMPLETE markers in de systemInstruction, waardoor de AI-coach niet formeel weet wanneer een stap is afgerond.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — ML-trainingsproces (label → train → predict) is juist weergegeven
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, aansprekend, geen overdreven jargon
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is — "trainen" en "voorspellen" zijn gangbaar Nederlands

**Bronbestanden:** `config/agents/year1.tsx:1473-1600`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De TRAIN_A/TRAIN_B/PREDICT-tags zijn een slimme manier om de machine learning workflow te structureren zonder het te technisch te maken. Het concept "Garbage In Garbage Out" is feitelijk correct en wordt op een begrijpelijke manier uitgelegd. De custom tags maken de interactie expliciet en voorspelbaar voor de leerling.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~900 tekens, voldoende maar niet uitgebreid
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 1526, duidelijk met stap-voor-stap instructies
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle stappen — **ONTBREEKT** — niet vermeld in systemInstruction
- [ ] Verificatievragen aanwezig — scenario omvat testen van de AI, maar geen formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — past bij het AI Trainer-concept
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:1526-1600`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is aanwezig en helder, met stap-voor-stap instructies die de leerling direct op weg helpen — dit is een positief punt ten opzichte van missies zonder EERSTE BERICHT. De systemInstruction is echter relatief kort (~900 tekens) en mist STEP_COMPLETE markers. De AI-coach kan hierdoor niet actief voortgang bijhouden. Geen formele verificatie van begrip na elke stap is een gemiste kans voor een missie die een complex concept (ML-training) behandelt.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — custom TRAIN/PREDICT tags maken het trainen van een AI tastbaar en hands-on
- [x] Voldoende variatie — TRAIN_A, TRAIN_B en PREDICT bieden verschillende interactiemomenten
- [x] Feedback op foute antwoorden is leerzaam — bewuste foute training toont direct het "Garbage In Garbage Out" effect
- [x] Het element werkt technisch — custom tags zijn een bewezen mechanisme in het platform

**Bronbestanden:** `config/agents/year1.tsx:1473-1600`

**Score:** 4 / 5

**Opmerkingen:**
> De custom TRAIN/PREDICT tags zijn een slimme interactieve aanpak die de abstracte werking van machine learning direct ervaarbaar maakt. Leerlingen labelen data, trainen een model, en testen vervolgens de voorspellingen — precies zoals het in de echte wereld werkt. De bewuste fout-oefening (verkeerde labels invoeren) maakt het leereffect concreet en memorabel. Een echte "aha-moment" missie.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — **geen `goalCriteria` gedefinieerd**
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd**
- [ ] Scoredrempels zijn realistisch — **geen scoring systeem**
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**

**Bronbestanden:** `config/agents/year1.tsx:1473-1600` (bonusChallenges niet vermeld)

**Score:** 1 / 5

**Opmerkingen:**
> Er is geen enkel afrondingselement aanwezig. Geen badges, geen scoring, geen takeaways, geen goalCriteria. Een leerling weet niet wanneer de missie "klaar" is en krijgt geen didactische sluiting of samenvatting van wat geleerd is. Dit is een blokkerende issue — de missie heeft sterke inhoud maar mist de afronding die het leereffect bekrachtigt. Bijzonder jammer voor een missie met zo'n concreet en memorabel kernpunt ("Garbage In Garbage Out").

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21D (AI) past: leerlingen leren hoe AI getraind wordt
- [x] 21C (data) is correct: het labelen en structureren van trainingsdata is een datageletterdheidsactiviteit
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — beide SLO's zijn aantoonbaar aanwezig in de missie
- [ ] Het leerdoel is toetsbaar geformuleerd — activiteit beschreven ("train een AI") maar geen meetbaar resultaat

**Bronbestanden:** `config/agents/year1.tsx:1473-1476`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De koppeling van 21D (AI) én 21C (data) is sterk gemotiveerd: het trainen van een AI vereist begrip van data (kwaliteit, labeling, bias) én van AI-mechanismen. Dit is één van de betere SLO-combinaties in de missie-catalogus. Minpunt: het leerdoel is geformuleerd als activiteit in plaats van als meetbaar resultaat. "Kan uitleggen waarom de kwaliteit van trainingsdata de AI-uitkomst beïnvloedt" zou een beter toetsbaar leerdoel zijn.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — informeel, begrijpelijk voor J1, geen onnodig jargon
- [x] Alt-teksten aanwezig op niet-decoratieve elementen — tekst-gebaseerde interface, geen kritieke afbeeldingen
- [x] Alle interactieve elementen bereikbaar met toetsenbord — chat-interface is toetsenbord-toegankelijk
- [ ] Kleurcontrast voldoet aan WCAG AA — niet verifieerbaar zonder runtime, indigo/purple op wit is doorgaans voldoende
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht — voortgangsbalken zijn afhankelijk van kleur, alternatief niet zichtbaar

**Bronbestanden:** `config/agents/year1.tsx:1473-1600`

**Score:** 4 / 5

**Opmerkingen:**
> Overwegend goed toegankelijk. De tekst-gebaseerde interface met chat is inherent toegankelijker dan canvas- of drag-and-drop-gebaseerde missies. Het leesniveau is passend voor J1. Klein punt: de voortgangsbalken in de preview zijn kleurafhankelijk — een percentage-getal naast de balk zou de toegankelijkheid verbeteren voor kleurenblinde leerlingen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Goede preview, trainingskaarten aantrekkelijk |
| 2. Visueel | 4 | ×1 = 4 | Indigo/purple past, mobiel niet geverifieerd |
| 3. Didactische flow | 4 | ×2 = 8 | Label→Train→Test is sterke opbouw, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | ML-concepten correct, GIGO perfect voor J1 |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT aanwezig, maar korte SI, geen STEP_COMPLETE |
| 6. Interactiviteit | 4 | ×1 = 4 | Custom TRAIN/PREDICT tags zijn hands-on en effectief |
| 7. Afronding & feedback | 1 | ×1 = 1 | Niets aanwezig — geen badges, scoring, takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21D+21C beide sterk gemotiveerd |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekst-gebaseerd, goed toegankelijk |
| **TOTAAL** | | **40 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (4×2) + (4×2) + (3×1) + (4×1) + (1×1) + (4×1) + (4×1) = 40
Percentage = (40 / 55) × 100% = 72,7%
```

### Verdict

**⚠️ Needs work** (72,7% — boven de 70% drempel, maar met blokkerende issue)

> Sterke missie met uitstekende didactische kern en hands-on interactiviteit. Het "Garbage In Garbage Out" concept is perfect voor J1 en de TRAIN/PREDICT tags maken machine learning tastbaar. De enige blokkerende issue is het volledig ontbreken van afrondingselementen — zonder badges, takeaways of goalCriteria voelt de missie onaf en mist het de didactische sluiting die het leereffect bekrachtigt.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, scoring, takeaways of goalCriteria aanwezig. Leerling weet niet wanneer klaar en krijgt geen samenvatting. Voeg minimaal 1 badge + 3 takeaways toe. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen voor de 3 stappen (labelen, trainen, testen). SystemInstruction uitbreiden van ~900 naar minimaal 1200 tekens met verificatievragen per stap. | Hoog |
| 2 | 9. Toegankelijkheid | Percentage-getal toevoegen naast voortgangsbalken voor kleurenblinde leerlingen. | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 4. Inhoudelijke correctheid | Leerdoel herformuleren als meetbaar resultaat: "Kan uitleggen waarom de kwaliteit van trainingsdata de AI-uitkomst beïnvloedt." |
| 2 | 3. Didactische flow | Extra voorbeeld toevoegen van real-world "Garbage In Garbage Out" (bijv. gezichtsherkenning met eenzijdige trainingsdata). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
