# Audit — Deepfake Detector (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `deepfake-detector` |
| **Titel** | Deepfake Detector |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 21B (mediawijsheid), 21D (AI), 23A (privacy), 23C (maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Deepfake Detector" is direct duidelijk
- [x] `introDescription` geeft een concrete opdracht — "Analyseer 5 cases, bepaal wat echt en AI-gegenereerd is"
- [x] Visueel element past bij het thema — ECHT/NEP split-screen met vraagteken in het midden is visueel sterk
- [x] Moeilijkheidsgraad voelbaar — "Medium" klopt, cases gaan van makkelijk naar moeilijk

**Bronbestanden:** `config/agents/year1.tsx:2535-2571`

**Score:** 5 / 5

**Opmerkingen:**
> De visuele preview is bijzonder sterk: een split-screen met "ECHT?" (groen) en "NEP?" (rood) en een vraagtekenknop in het midden communiceert het spelprincipe direct. De problemScenario beschrijft AI-gegenereerde foto's, video's en stemmen — relevant en actueel voor J1.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — orange/amber gradient via Tailwind
- [x] Split-screen preview is duidelijk leesbaar
- [ ] Kleur via `lab-*` tokens — `color: '#F97316'` op het agent-object is hardcoded hex
- [ ] Responsive — split-screen layout met twee panelen kan op smalle schermen krap worden

**Bronbestanden:** `config/agents/year1.tsx:2540` (hardcoded hex)

**Score:** 3 / 5

**Opmerkingen:**
> De visual preview is didactisch sterk (ECHT/NEP visueel), maar de twee-panelen-layout kan op mobiel (375px) problematisch zijn. De teksten "ECHT?" en "NEP?" zijn groot genoeg, maar de extra labels eronder ("Is dit een..." tekst is niet aanwezig in deze missie, maar de ratio ruimte is smal). Verdient mobiele test.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — 5 cases van makkelijk naar moeilijk (Case 1: portret, Case 5: schoolfoto)
- [x] Scaffolding aanwezig — elke case geeft 2-3 concrete tips na het antwoord
- [x] Moeilijkheid past bij leerjaar — de progressie van makkelijk (AI-portret) naar gevoelig (schoolfoto) is goed gedoseerd
- [x] Elke stap bouwt voort — kennis van Case 1 (oren, te perfect) helpt bij Case 4 (lipsync)

**Bronbestanden:** `config/agents/year1.tsx:2583-2623`

**Score:** 5 / 5

**Opmerkingen:**
> De vijf cases zijn uitzonderlijk goed opgebouwd: van het herkennen van AI-portretten (visuele cues) naar nepnieuwssites (URL-check) naar voice cloning (verificatiestrategie) naar video deepfakes (lipsync) naar de gevoeligste case (schoolfoto van klasgenoot). De progressie in moeilijkheid én gevoeligheid is pedagogisch doordacht.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — deepfake-detectietips zijn actueel en praktisch toepasbaar
- [x] Wettelijk kader correct — Art. 139h Wetboek van Strafrecht correct aangehaald
- [x] Geen spelfouten gevonden
- [x] Taalgebruik past bij doelgroep — "Voice cloning", "lipsync" zijn gangbare Engelse termen die correct worden uitgelegd
- [x] Gevoelig onderwerp (Case 5) professioneel behandeld met expliciete strafbaarheid en slachtofferstandpunt

**Bronbestanden:** `config/agents/year1.tsx:2573-2633`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De deepfake-detectietips zijn praktisch en correct (oren bij AI-portretten, URL-check bij nepnieuws, terug bellen bij voice cloning, lipsync bij video deepfakes). De wettelijke informatie bij Case 5 (Art. 139h Sr, kinderpornografie bij minderjarigen) is correct en passend uitgebreid. De zin "het slachtoffer beslist of het schadelijk is, niet de maker" is een krachtige en correcte framing.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ruim voldoende (~2000 tekens)
- [x] EERSTE BERICHT is aanwezig en verwelkomt goed — "Welkom bij de Deepfake Detector! 🔍"
- [ ] STEP_COMPLETE markers aanwezig (3/3) — **ONTBREEKT** (0/3)
- [ ] Verificatiedrempel — cases worden doorlopen maar geen expliciete voltooiingssignalen
- [x] Toon past bij de rolnaam — "scherp maar vriendelijk, nieuwsgierig en empowerend"
- [x] Gevoeligheidsinstructie aanwezig voor Case 5 (⚠️ duidelijk)
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:2573-2634`

**Score:** 3 / 5

**Opmerkingen:**
> Sterke coach-instructie: de toon is goed, het EERSTE BERICHT is uitnodigend, en de gevoeligheidsinstructie bij Case 5 is exemplarisch. Maar er ontbreken STEP_COMPLETE markers. De `goalCriteria: { type: 'steps-complete', min: 3 }` is aanwezig in de config, maar de AI weet niet wanneer een stap klaar is. De drie stappen (Echt of Nep, Moeilijke Cases, Actieplan) zijn beschrijvend maar de coach heeft geen instructie om stap-voltooiing te signaleren.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — "Echt of nep?" is een direct, boeiend format voor het herkennen van deepfakes
- [x] Voldoende variatie — 5 verschillende types (portret, nieuwssite, stem, video, foto) voorkomen herhaling
- [x] Feedback na elk antwoord — de AI onthult de waarheid en geeft concrete tips
- [x] Eindigt positief — "Jij bent nu een Deepfake Detective! Kennis = kracht"

**Bronbestanden:** `config/agents/year1.tsx:2583-2624`

**Score:** 4 / 5

**Opmerkingen:**
> Het case-by-case format is uitstekend geschikt voor de doelgroep. De afwisseling van mediatypen (portret, nieuws, stem, video, foto) zorgt voor variatie en brede dekking van het onderwerp. De missie eindigt met een concreet 5-stappen actieplan (STOP-CHECK-PRAAT-MELD-WEET) — didactisch sluiting. Enig verbeterpunt: de cases zijn tekstbeschrijvingen zonder echte afbeeldingen, wat de authenticiteit vermindert.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria aanwezig — `goalCriteria: { type: 'steps-complete', min: 3 }`
- [ ] Badges — **geen badges gedefinieerd** in year1.tsx
- [ ] Scoring — **geen scoring**
- [ ] Takeaways — **geen takeaways gedefinieerd**
- [x] Afsluiting in systemInstruction aanwezig — actieplan en positieve afsluiting

**Bronbestanden:** `config/agents/year1.tsx:2548-2549` (goalCriteria), `2617-2624` (actieplan)

**Score:** 2 / 5

**Opmerkingen:**
> De systemInstruction heeft een goede afsluiting (5-stappen actieplan, "Jij bent nu een Deepfake Detective!"), maar er zijn geen formele badges of takeaways. De goalCriteria is aanwezig. Het ontbreken van badges is opvallend omdat de inhoud van de missie zich uitstekend leent voor een "Deepfake Detective"-badge.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht de geclaimde SLO-kerndoelen — 21B (mediawijsheid), 21D (AI), 23A (privacy), 23C (maatschappij) zijn alle aanwezig
- [x] Mapping is intern consistent
- [x] Leerdoel is toetsbaar — "Herken 5 deepfake cases en maak een actieplan" is meetbaar
- [x] Wettelijk kader en maatschappelijke context aanwezig (Art. 139h Sr, EU AI Act)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 21B + 21D + 23A + 23C)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende en brede SLO-aansluiting. De missie raakt vier kerndoelen tegelijk: AI-begrip (21D, wat zijn deepfakes?), mediawijsheid (21B, hoe herken ik ze?), privacy (23A, strafbaarheid), en maatschappij (23C, EU AI Act). Dit is de breedste SLO-dekking van alle J1P3-missies.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — begrijpelijk voor J1, concrete voorbeelden
- [x] Kleurgebruik in preview niet-informatief — ECHT/NEP-labels zijn tekstueel
- [x] Gevoelig onderwerp (Case 5) goed afgebakend met ⚠️ instructie
- [ ] Cases zijn tekstbeschrijvingen, geen visuele media — beperkt maar niet ontoegankelijk

**Bronbestanden:** `config/agents/year1.tsx:2573-2634`

**Score:** 4 / 5

**Opmerkingen:**
> De missie is goed toegankelijk: tekstgebaseerd, geen kleurafhankelijkheid, en de gevoeligheidsinstructie voor Case 5 is aanwezig. Het ontbreken van echte afbeeldingen is tegelijkertijd een toegankelijkheidsvoordeel (geen visuele verwarring) en een beperking (minder authentiek).

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | ECHT/NEP preview is visueel sterk |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, mobiele split-screen risico |
| 3. Didactische flow | 5 | ×2 = 10 | Progressie van makkelijk naar gevoelig |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, wettelijk kader klopt |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Goed EERSTE BERICHT, mist STEP_COMPLETE |
| 6. Interactiviteit | 4 | ×1 = 4 | Sterk case-formaat, geen echte media |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges, geen takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | Breedste dekking van alle missies |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekstgebaseerd, goed afgebakend |
| **TOTAAL** | | **42 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (4×1) + (2×1) + (5×1) + (4×1) = 42
Percentage = (42 / 55) × 100% = 76,4%
```

### Verdict

**⚠️ Needs work** (76,4% — net onder de 80% drempel)

> Deepfake Detector is inhoudelijk een van de sterkste missies: uitstekende cases, correcte wettelijke informatie, en een krachtige didactische progressie. Het zakt net onder de 80% door het structurele ontbreken van badges/takeaways en STEP_COMPLETE markers. Twee gerichte verbeteringen zouden de missie direct boven de drempel brengen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges of takeaways. "Deepfake Detective" badge ligt voor de hand gezien de inhoud. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen (3/3) voor stap-tracking. | Hoog |
| 2 | 2. Visueel | Mobiele layout split-screen testen op 375px. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Echte deepfake-voorbeeldafbeeldingen toevoegen (met permissie) voor meer authenticiteit. |
| 2 | 2. Visueel | Hardcoded hex kleur `#F97316` vervangen. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
