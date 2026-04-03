# Audit — Startup Simulator (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `startup-simulator` |
| **Titel** | Startup Simulator |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | BuilderCanvas + AI-chat (chatRoleId: `startup-simulator`) |
| **SLO-kerndoelen** | 23C (Maatschappij), 22A (Digitale producten) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Bouw een startup van nul tot pitch"
- [x] `introDescription` geeft concrete opdracht — concept helder uitgelegd
- [x] `introFeatures` geeft 4 concrete stappen op de intrpagina
- [x] Moeilijkheidsgraad zichtbaar — "Hard" past bij J3 havo/vwo
- [x] Emoji (🚀) en problemScenario in agent zijn aansprekend

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/startup-simulator.ts`, `config/agents/year3.tsx:1145-1236`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De "painkiller vs. vitamine"-tip in stap 1 is een sterke didactische kapstok die direct de toon zet. Het intro-scherm beschrijft de vier fasen helder. De agent-briefing (investeerder, 3 minuten) schept een authentiek scenario. De moeilijkheid "Hard" past goed bij leerjaar 3 havo/vwo.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — gradient pink-500→pink-700 is consistent met de roze merkkleur
- [ ] Kleuren via lab-* tokens — `#EC4899` is een hardcoded hex in `color` agent-veld
- [x] Animaties niet afleidend — geen onnodige animaties in BuilderCanvas
- [x] Responsive — BuilderCanvas-template is ontworpen voor mobiel/desktop
- [x] Tekst in steps is goed leesbaar — korte, duidelijke instructies

**Bronbestanden:** `config/agents/year3.tsx:1151`, `components/missions/templates/builder-canvas/`

**Score:** 4 / 5

**Opmerkingen:**
> De visuele lay-out is sterk via de BuilderCanvas-template. De hardcoded hex `#EC4899` is een minor issue — dat is de kleur van het agent-pictogram, niet van de UI zelf. De tips in elke stap zijn visueel onderscheiden en helpen de leesbaarheid. Geen blokkerende visuele issues.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Probleem → Businessmodel → Marktanalyse → Pitch is een bewezen startup-methodologie
- [x] Elke stap bouwt voort op de vorige — pitch in stap 4 is onmogelijk zonder stap 1-3
- [x] Moeilijkheid past bij leerjaar — J3 havo/vwo kan complexe businesslogica aan
- [x] Geen onverklaard vakjargon — termen als "freemium", "USP", "break-even" worden in de tips uitgelegd
- [x] Checklist-items per stap zijn concreet en verifieerbaar

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/startup-simulator.ts:19-83`

**Score:** 5 / 5

**Opmerkingen:**
> Didactisch zeer sterk. De vier stappen volgen de Lean Canvas-methodologie en bouwen aantoonbaar op elkaar voort. De checklist-items (bijv. "Ik heb het break-even punt berekend") zijn specifiek genoeg om te controleren. De tips bevatten realistische voorbeelden (Airbnb, WhatsApp, Spotify) die goed aansluiten bij 15-16 jarigen. STEP_COMPLETE-markers in de systemInstruction zijn aanwezig en logisch geplaatst (3/3).

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — businessmodel-concepten zijn juist uitgelegd
- [x] Geen typografische fouten of spelfouten
- [x] Taalgebruik past bij de leeftijdsgroep — direct, enthousiast, met concrete voorbeelden
- [x] Terminologie consistent door de hele missie
- [x] Engelse termen worden altijd uitgelegd (USP, MVP, freemium)

**Bronbestanden:** `config/agents/year3.tsx:1165-1217`, `components/missions/templates/builder-canvas/configs/startup-simulator.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De "painkiller vs. vitamine"-metafoor is didactisch uitstekend. De tip dat freemium minder dan 5% conversie oplevert is feitelijk correct. De instructie om break-even "globaal" te berekenen is realistisch voor het niveau. Geen fouten gevonden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ~1800 tekens, ruim voldoende
- [x] EERSTE BERICHT aanwezig en welkomend — "De pitch-klok tikt" met directe opdracht
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Verificatievragen aanwezig — 3 concrete vragen in EERSTE BERICHT
- [x] Toon past bij de rolnaam — Startup Coach is direct en enthousiast
- [x] Scope Guard aanwezig — "Dat komt later! Investeerders financieren eerst het idee"

**Bronbestanden:** `config/agents/year3.tsx:1165-1217`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coaching structuur. Het EERSTE BERICHT is authentiek en direct ("De pitch-klok tikt"). De SCOPE GUARD stuurt leerlingen terug naar de pitch als ze prematuur over code willen praten — pedagogisch correct. De STEP_COMPLETE markers zijn logisch en verifieerbaar. De instructie "Geef NOOIT een kant-en-klaar startup-idee" bewaakt de eigenheid van het leerproces.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — schrijven + AI-feedback past bij startup-pitching
- [x] Checklist-items per stap geven concrete doelen
- [x] AI-chat biedt gepersonaliseerde begeleiding
- [x] `previewType: 'text-preview'` — tekst-output is geschikt voor pitching
- [x] Vier stappen geven voldoende variatie (probleem, businessmodel, markt, pitch)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/startup-simulator.ts:16-18`

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas + AI-chat combinatie werkt goed voor deze missie. Het schrijfwerk is authentiek — een startup-pitch schrijven is exact wat je ook in de echte wereld doet. Licht punt: de interactie is puur tekstueel; een visueel canvas (bijv. Lean Canvas schema invullen) zou de leerervaring verder verrijken. Geen blokkerende issues.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig en betekenisvol — "Startup Founder" (≥90%), "Tech Entrepreneur" (≥70%), "Ideeënmachine" (≥50%), "Op weg" (≥0%)
- [x] maxScore aanwezig — 100 punten
- [x] `takeaways[]` aanwezig — 5 kernlessen die het leerproces samenvatten
- [x] Checklist-items per stap maken duidelijk wanneer de stap klaar is
- [x] Badgenamen zijn thematisch passend bij startup-ondernemerschap

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/startup-simulator.ts:85-99`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De vier badges hebben betekenisvolle namen die aansluiten bij het thema. De vijf takeaways vatten de kernlessen adequaat samen (probleem identificeren, businessmodel, marktanalyse, pitch, samenhang). De checklist-structuur per stap maakt duidelijk wanneer je klaar bent.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde SLO-kerndoelen — 23C (maatschappelijke impact van technologie) en 22A (digitale producten ontwerpen) zijn aantoonbaar aanwezig
- [x] Mapping in `slo-kerndoelen-mapping.ts` klopt — `startup-simulator: ['23C', '22A']`
- [x] Het leerdoel is praktisch toetsbaar — leerling produceert een pitch-document
- [x] Aansluiting bij J3P3-thema "Maatschappelijke Impact & Innovatie"

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:174`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 23C (maatschappij) wordt geborgd via de ethische overwegingen (privacy, inclusiviteit, duurzaamheid) in de systemInstruction. 22A (digitale producten) wordt geborgd via het businessmodel en de pitch. Het leerdoel is meetbaar via de geproduceerde documenten.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — helder en direct voor J3 havo/vwo
- [x] Informatie niet alleen via kleur overgebracht — checklist-items zijn tekstueel
- [x] Interactieve elementen bereikbaar via toetsenbord — BuilderCanvas gebruikt standaard HTML-formulieren
- [ ] Kleurcontrast formeel niet geverifieerd — roze gradient niet getest
- [x] Alt-tekst voor decoratieve elementen — Lucide-iconen hebben geen alt-tekst nodig als decoratief

**Bronbestanden:** `components/missions/templates/builder-canvas/`

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele toegankelijkheidsproblemen. De BuilderCanvas-template gebruikt standaard HTML-invoervelden die toetsenbord-toegankelijk zijn. Het kleurcontrast van de roze gradient is niet formeel getest maar lijkt voldoende gezien de witte tekst op donkere achtergrond. Kleine verbetermogelijkheid: formeel WCAG AA-test uitvoeren.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Uitstekend scenario, duidelijke intro |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, minor issue |
| 3. Didactische flow | 5 | ×2 = 10 | Lean Canvas structuur, uitstekende opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk correct, goede analogieën |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle structuurelementen aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | Tekstueel sterk, visueel canvas ontbreekt |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scoring aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C + 22A beide aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | WCAG-test niet uitgevoerd |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar** (94,5% — ruim boven de 80% drempel)

> Een van de sterkst uitgewerkte missies in de catalogus. De Lean Canvas-structuur, de sterke AI-coach met EERSTE BERICHT en STEP_COMPLETE (3/3), en de rijke takeaways maken dit een inzetbare, kwalitatief hoogstaande missie. Kleine verbetermogelijkheden: hardcoded hex vervangen, WCAG-test uitvoeren.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded `#EC4899` in agent-kleurveld vervangen door `lab-*` token | Laag |
| 2 | 9. Toegankelijkheid | Formele WCAG AA kleurcontrast-test uitvoeren op gradient | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Lean Canvas visueel schema toevoegen als invulhulp (optioneel) |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
