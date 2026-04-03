# Audit — Mission Launch (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `mission-launch` |
| **Titel** | De Lancering |
| **Leerjaar & Periode** | Leerjaar 1, Periode 4 |
| **Template-engine** | ToolGuide (4 stappen, verificationQuestions) |
| **SLO-kerndoelen** | 22A, 21B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "De Lancering" is pakkend
- [x] `introDescription` beschrijft de missie concreet (flyer + presentatie voorbereiden)
- [x] `introFeatures` bevat 4 concrete leerdoelen
- [x] Moeilijkheidsgraad "Hard" is correct — flyer-ontwerp + presentatie is uitdagender dan plannen
- [x] Rocket-emoji en animate-bounce op de visuele preview zijn uitnodigend

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De combinatie van een pakkende kop ("De Lancering") en de raket-preview geeft een duidelijk signaal dat dit de finale is van het eindproject. De vier introFeatures beschrijven precies wat de leerling gaat leren.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Groene kleur (`#16A34A`) voor de agent past bij het thema "lancering" en succes
- [x] Visuele preview (raket, groene achtergrond, animate-bounce) is aantrekkelijk
- [ ] Hardcoded badge-kleuren (`#16A34A`, `#22C55E`, `#10B981`) — zou `lab-green` token moeten zijn
- [x] `toolIcon: '📢'` past bij het marketing-thema

**Bronbestanden:** `config/agents/year1.tsx:3213-3231`, `components/missions/templates/tool-guide/configs/mission-launch.ts:70-83`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent en thematisch sterk. De groene kleurstelling communiceert "go!" wat past bij een lanceringmissie. Dezelfde hardcoded hex-aanmerking als bij de andere J1P4-missies.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: Pakkende kop → Kernboodschap → Call to action → Flyer indelen
- [x] Elke stap bouwt aantoonbaar voort op de vorige (je hebt een kop nodig voor de kernboodschap, etc.)
- [x] Stap 1 bevat een verificationQuestion met meerkeuzevraag — direct toetsbaar leren
- [x] Stap 2 bevat een verificationQuestion over maximale tekst op een flyer
- [x] Stap 4 bevat een verificationQuestion over visuele hiërarchie
- [x] Tips per stap zijn concreet en gedragsgestuurd ("Test je kop: lees hem hardop in 2 seconden")
- [x] Voorbeelden van goede en slechte koppen zijn leerzaam

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts:17-112`

**Score:** 5 / 5

**Opmerkingen:**
> Uitmuntende didactische flow. De vier stappen volgen de logische volgorde van een flyer-ontwerp. De verificationQuestions in drie van de vier stappen maken het leren toetsbaar. De concrete voorbeelden ("Nooit meer huiswerkstress!" vs "Mijn informatica-project") zijn didactisch uitstekend: ze laten het verschil zien in plaats van het alleen te beschrijven.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies inhoudelijk?

**Checkpunten:**
- [x] Marketing-principes (kop, CTA, visuele hiërarchie) zijn correct beschreven
- [x] "Groot = belangrijk" als visueel hiërarchie-principe klopt
- [x] "Maximaal 2 lettertypen" is een gangbare best practice in grafisch ontwerp
- [x] CTA-voorbeelden zijn realistisch en herkenbaar voor de doelgroep
- [x] Presentatievoorbereiding (3 slides, probleem-oplossing-CTA) is een effectieve structuur
- [x] Taalgebruik op B1-niveau met jongerenreferenties (YouTube thumbnails, game-posters)

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en professioneel. De marketing-principes zijn correct en worden uitgelegd met herkenbare voorbeelden. De visuele hiërarchie-tips zijn direct toepasbaar in Word/PowerPoint/Canva. SLO-kerndoelen zijn expliciet vermeld in de systemInstruction.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig met motiverende opening (YouTube thumbnail anekdote)
- [ ] STEP_COMPLETE markers ontbreken in de systemInstruction
- [x] Scaffolding-tips voor vastgelopen leerlingen (kop bedenken, CTA versterken, kleuren kiezen)
- [x] De systemInstruction heeft een expliciete verwijzing naar De Visie missie voor kleurconti­nuïteit
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX
- [x] Toon is energiek en motiverend, past bij "Marketing Coach" rol

**Bronbestanden:** `config/agents/year1.tsx:3233-3322`

**Score:** 4 / 5

**Opmerkingen:**
> Goede systemInstruction. De link naar De Visie-missie ("Kijk naar je moodboard van De Visie. Gebruik dezelfde kleuren!") is uitstekend: het verankert deze missie in het bredere eindproject. De ToolGuide-template heeft ingebouwde verificationQuestions die de AI-coach aanvullen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] `verificationQuestion` in stap 1, 2 en 4 met meerkeuzevragen en uitgebreide uitleg
- [x] Checklistsysteem per stap geeft concrete done-criteria
- [x] Stap 3 (CTA) heeft geen verificationQuestion maar wel concrete checklistItems
- [x] De verificationQuestion-uitleg geeft direct feedback op foutieve keuzes
- [x] Combinatie van checklist + verificationQuestion + AI-chat is de rijkste interactievorm in dit project

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De ToolGuide-template met verificationQuestions is de meest didactisch rijke template in het systeem. De meerkeuzevragen zijn goed geconstrueerd (plausibele distractors, uitgebreide uitleg bij het correcte antwoord). Dit is de interactief sterkste missie van J1P4.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 60` — lager dan de BuilderCanvas-missies (100), maar transparant
- [x] 3 badges gedefinieerd: Marketing Expert (55+), Launcher (40+), Aan de slag (0+)
- [x] `takeaways[]` bevat 5 concrete leerpunten
- [x] Checklistsysteem en verificationQuestions geven duidelijke done-criteria

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts:66-91`

**Score:** 4 / 5

**Opmerkingen:**
> Goede afronding. Minder badges dan de BuilderCanvas-missies (3 vs 4), maar voldoende. De maxScore van 60 (in plaats van 100) kan verwarrend zijn als leerlingen de scores van J1P4-missies vergelijken — het is onduidelijk of dit intentioneel is. De takeaways zijn concreet en leerling-gericht.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 22A (Digitale producten) sluit aan — leerling ontwerpt een flyer
- [x] SLO 21B (Media en informatie) sluit aan — bewust gebruik van tekst, beeld en lay-out om te overtuigen
- [x] slo-kerndoelen-mapping.ts: `mission-launch` → `['22A', '21B']` — correct
- [x] Periode 4 context klopt: dit is de finalemissie van het eindproject (lanceren)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:86`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. Zowel 22A als 21B worden daadwerkelijk bediend: de leerling maakt een digitaal product (flyer) en leert bewust om te gaan met media-keuzes (visuele hiërarchie, CTA, kleur). De missie sluit de J1P4-reeks (Blueprint → Visie → Lancering) logisch af.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau op B1-niveau, begrijpelijk voor 12-13 jaar
- [x] Verificationquestions zijn meerkeuzevragen — laagdrempeliger dan open tekstinvoer
- [x] Checklistsysteem is toetsenbord-toegankelijk
- [ ] Visuele hiërarchie-concepten zijn tekstueel uitgelegd — leerlingen zonder visueel referentiekader kunnen dit abstract vinden
- [x] Geen informatie uitsluitend via kleur overgebracht

**Bronbestanden:** `components/missions/templates/tool-guide/configs/mission-launch.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De meerkeuzevragen zijn inclusiever dan open tekstinvoer. De visuele hiërarchie-concepten zijn abstract voor leerlingen die nog nooit een flyer hebben ontworpen — een visueel voorbeeld (goede vs slechte flyer) zou helpen, maar ontbreekt in de config.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Pakkend, duidelijk, thematisch sterk |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex badges |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekend met verificationQuestions |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Marketing-principes correct |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | Mist STEP_COMPLETE |
| 6. Interactiviteit | 5 | ×1 = 5 | Rijkste template, verificationQuestions |
| 7. Afronding & feedback | 4 | ×1 = 4 | Goede badges, maxScore inconsistent |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A + 21B correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, visuele voorbeelden zouden helpen |
| **TOTAAL** | | **47 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (5×1) + (4×1) + (5×1) + (4×1) = 47
Percentage = (47 / 55) × 100% = 85,5%
```

### Verdict

**✅ Klaar voor inzet** (85,5% — ruim boven de 80% drempel)

> De sterkste missie van J1P4. De ToolGuide-template met verificationQuestions maakt deze missie didactisch het rijkste van de vier. De logische aansluiting op De Blauwdruk en De Visie maakt dit een uitstekende afsluiter van het eindproject.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding | maxScore van 60 harmoniseren met de andere J1P4-missies (100) of afwijking documenteren | Laag |
| 2 | 9. Toegankelijkheid | Visueel voorbeeld toevoegen van goede vs slechte flyer in stap 4 | Laag |
| 3 | 5. AI-coach | STEP_COMPLETE markers toevoegen aan systemInstruction | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
