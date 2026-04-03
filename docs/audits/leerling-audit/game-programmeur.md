# Audit — Game Programmeur (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `game-programmeur` |
| **Titel** | Game Programmeur |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (chat + live code-preview) |
| **SLO-kerndoelen** | 22A (digitaal product maken), 22B (programmeren) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Game Programmeur" is direct en spreekt aan
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — retro game-preview met score-display maakt direct duidelijk wat je gaat bouwen
- [x] Emoji of visueel element past bij het thema — donker retro-thema met scoreweergave en code-hint is stijlvol en consistent
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Hard" is zichtbaar; ambitieuze leerlingen worden aangesproken

**Bronbestanden:** `config/agents/year1.tsx:1015-1081`

**Score:** 5 / 5

**Opmerkingen:**
> Uitzonderlijk sterke eerste indruk. De donkere retro-game-preview is visueel memorabel en communiceert direct de ambitie van de missie. De combinatie van score-display en code-hint in de preview is slim: het laat zien dat je zowel code als spel ziet. "Hard" als moeilijkheidsgraad filtert leerlingen die de uitdaging zoeken. Een van de aantrekkelijkste previews in de catalogus.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — split-screen code/preview werkt goed op breder scherm
- [x] Kleuren zijn consistent — donker retro-thema is coherent en consistent door de hele preview
- [x] Animaties zijn niet afleidend of overweldigend — retro-stijl animaties passen bij het thema
- [x] Responsive op minimaal 375 px breed (mobiel) — split-screen code-editor is inherent minder geschikt voor klein mobiel, maar de preview-definitie is visueel sterk

**Bronbestanden:** `config/agents/year1.tsx:1015-1081`

**Score:** 5 / 5

**Opmerkingen:**
> Visueel uitstekend. Het donkere retro-thema is consistent doorgevoerd en geeft de missie een sterke visuele identiteit. De preview toont zowel code als het spelresultaat, wat leerlingen goed voorbereidt op de split-screen werkwijze. Geen hardcoded hex-kleuren gevonden in de preview-definitie. De split-screen code-editor op kleine mobiele schermen is inherent beperkter, maar dit is een onvermijdelijk trade-off voor een programmeeromgeving.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — 5 stappen in duidelijke opbouw: kleur → physics → snelheid → geluid → uiterlijk
- [x] Elke stap bouwt aantoonbaar voort op de vorige — elke stap voegt een nieuwe mechanic toe aan het bestaande spel
- [x] Moeilijkheid past bij het leerjaar — "Hard" voor J1 is ambitieus; de initialCode (~200 regels HTML) geeft een werkend startpunt zodat leerlingen niet vanaf nul beginnen
- [ ] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — variabelenamen worden uitgelegd, maar "Hard" moeilijkheidsgraad in J1 kan voor sommige leerlingen te steil zijn; STEP_COMPLETE markers ontbreken

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw met 5 duidelijke stappen. Het sleutelontwerp hier is het `initialCode`: leerlingen krijgen een volledig werkend spel en hoeven alleen variabelen aan te passen — dit maakt de "Hard" moeilijkheid beheersbaar. Verbeterpunt: de moeilijkheidsgraad is ambitieus voor J1 en kan voor sommige leerlingen ontmoedigend zijn, en STEP_COMPLETE markers ontbreken in de systemInstruction.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — variabelenamen en hun effect op het spelgedrag worden correct beschreven
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — direct en technisch maar toegankelijk
- [ ] Geen Engelse termen waar goed Nederlands beschikbaar is — "Hard" moeilijkheidsgraad, HTML-variabelenamen zijn Engels; dit is technisch onvermijdelijk maar kan barrière zijn voor J1
- [x] Terminologie consistent door de hele missie — variabelenamen zijn consistent met de initialCode

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk correct. De koppeling tussen variabelenamen in de code en het zichtbare spelgedrag is goed uitgelegd. De systemInstruction (~1500 tekens) is beknopt maar helder. Aandachtspunt: de HTML-code en variabelenamen zijn Engels (onvermijdelijk voor programmeeronderwijs), maar dit kan een drempel zijn voor J1-leerlingen die nog weinig Engels hebben. Een verklarende woordenlijst zou helpen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1500 tekens, voldoende
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 1081, helder met uitleg over de werkwijze
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle stappen — **ONTBREEKT**: geen STAP-VOLTOOIING sectie
- [ ] Verificatievragen aanwezig — geen formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — professioneel en technisch, past bij "Game Programmeur" rol
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT legt helder de werkwijze uit. De eis dat de AI altijd volledige werkende code levert (geen gedeeltelijke code) is een goede design-beslissing die frustratie bij leerlingen voorkomt. Maar twee essentiële elementen ontbreken: (1) geen STEP_COMPLETE markers voor de 5 stappen, waardoor voortgang niet getrackt kan worden, en (2) geen formeel verificatieprotocol. De systemInstruction is te beknopt voor een "Hard" missie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — live code-editing met directe game-preview is de meest authentieke programmeerervaring
- [x] Voldoende variatie — 5 stappen met verschillende aspecten van het spel
- [x] Feedback op foute antwoorden is leerzaam — het spel reageert direct op code-wijzigingen
- [x] Het element werkt technisch zonder zichtbare bugs — live code-preview is een bewezen technologie

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`

**Score:** 5 / 5

**Opmerkingen:**
> Live code-editing met directe game-preview is de gouden standaard voor programmeeronderwijs. De onmiddellijke visuele feedback (wijzig een variabele → zie het spel veranderen) is pedagogisch uiterst waardevol en buitengewoon motiverend. De initialCode zorgt dat leerlingen direct een werkend product hebben, wat de motivatie hoog houdt. Dit is de meest engagerende interactievorm in de catalogus.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn aanwezig — `goalCriteria: { type: 'message-count', min: 3 }` aanwezig
- [ ] Badges hebben betekenisvolle namen — geen badges gedefinieerd
- [ ] Scoredrempels zijn realistisch — geen scoring-systeem buiten het message-count criterium
- [ ] `takeaways[]` vatten de kernlessen samen — geen takeaways gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`

**Score:** 3 / 5

**Opmerkingen:**
> Er is een `goalCriteria` aanwezig (message-count, min: 3), wat beter is dan niets. Maar `message-count` is een zwak completion-criterium voor een programmeeromgeving — het meet interacties, niet of de leerling daadwerkelijk iets geprogrammeerd heeft. Badges, scores en takeaways ontbreken. Voor een "Hard" missie zou een rijker afrondingsprotocol verwacht worden, bijv. "laat je eindgame zien" als completion-bewijs.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 22A (digitaal product) + 22B (programmeren) passen uitstekend: leerlingen maken een werkend spel via programmeren
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — 22A + 22B zijn consistent voor J1P2
- [ ] Het leerdoel is toetsbaar geformuleerd — geen formeel toetsbaar leerdoel; "programmeer een game" is een activiteit

**Bronbestanden:** `config/agents/year1.tsx:1015`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 22A (digitaal product maken) en 22B (programmeren) zijn beide aantoonbaar aanwezig: leerlingen maken een werkend digitaal spel via programmeeractiviteiten. De SLO-mapping is consistent. Verbeterpunt: het leerdoel is niet formeel toetsbaar geformuleerd. Een toetsbaar leerdoel zou zijn: "kan uitleggen hoe variabelen spelgedrag beïnvloeden en dit demonstreren met code".

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — technisch maar helder; "Hard" geeft aan dat dit niet voor alle J1-leerlingen is
- [ ] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen — code-editor en game-preview zijn visuele componenten zonder expliciete alt-teksten
- [ ] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord — code-typen vereist toetsenbord (goed), maar game-preview navigatie niet geverifieerd
- [ ] Kleurcontrast voldoet aan WCAG AA — donker retro-thema niet getest; code-highlighting kleuren kunnen contrast-issues hebben
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht — syntax-highlighting in code gebruikt kleur als primaire onderscheiding

**Bronbestanden:** `config/agents/year1.tsx:1015-1100`

**Score:** 3 / 5

**Opmerkingen:**
> Het leesniveau is passend voor leerlingen die voor "Hard" kiezen. Maar er zijn toegankelijkheidsproblemen: (1) syntax-highlighting in code gebruikt kleur als primaire onderscheiding, wat problematisch is voor kleurenblinde leerlingen, (2) de game-preview toont visuele informatie zonder tekstalternatieven, en (3) het leesniveau kan hoog zijn voor sommige J1-leerlingen gezien de technische terminologie. De "Hard" moeilijkheidsgraad signaleert dit impliciet maar een expliciete toegankelijkheidsalternatief ontbreekt.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Memorabele retro-game preview |
| 2. Visueel | 5 | ×1 = 5 | Sterk donker thema, geen hardcoded hex |
| 3. Didactische flow | 4 | ×2 = 8 | 5 stappen, goede progressie, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correct, Engelse variabelenamen zijn drempel |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT aanwezig, mist STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 5 | ×1 = 5 | Live code + game preview = beste in catalogus |
| 7. Afronding & feedback | 3 | ×1 = 3 | goalCriteria aanwezig maar zwak (message-count) |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 22A + 22B sterk, leerdoel niet toetsbaar |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Syntax-kleur, technisch leesniveau |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (5×1) + (4×2) + (4×2) + (3×1) + (5×1) + (3×1) + (4×1) + (3×1) = 44
Percentage = (44 / 55) × 100% = 80%
```

### Verdict

**✅ Klaar voor pilot** (80% — goede kwaliteit, borderline voor "Hard" J1-missie)

> Game Programmeur heeft een uitzonderlijk sterke interactievorm (live code + game) en een memorabele visuele presentatie. De missie is pilot-klaar maar borderline: de "Hard" moeilijkheidsgraad in J1 vereist goede begeleiding. Het zwakke goalCriteria (message-count) en ontbrekende STEP_COMPLETE markers moeten worden verbeterd voor productie-release. Aanbevolen voor begeleid pilot-gebruik met technisch georiënteerde leerlingen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

_Geen blokkerende issues aangetroffen._

#### Verbeterpunten (score 3 — oplossen vóór of tijdens pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen voor alle 5 stappen (kleur, physics, snelheid, geluid, uiterlijk). | Hoog |
| 2 | 7. Afronding & feedback | `goalCriteria` versterken: vervang `message-count` door een inhoudelijker criterium, bijv. `steps-complete` of een aantoonbaar werkend eindspel. | Hoog |
| 3 | 7. Afronding & feedback | `takeaways[]` toevoegen met kernlessen over programmeren en variabelen. | Medium |
| 4 | 9. Toegankelijkheid | Syntax-highlighting niet uitsluitend via kleur: voeg ook vetgedrukte tekst of symbolen toe als onderscheiding. Codeopmaak testen op kleurenblindheid. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 4. Inhoudelijke correctheid | Verklarende woordenlijst toevoegen voor Engelse variabelenamen (bijv. "speed = snelheid"). |
| 2 | 8. SLO-aansluiting | Leerdoel herformuleren als toetsbaar resultaat (bijv. "kan uitleggen hoe variabelen spelgedrag beïnvloeden"). |
| 3 | 5. AI-coach kwaliteit | SystemInstruction uitbreiden van ~1500 naar ~2500 tekens met hints-per-stap voor de "Hard" doelgroep. |
| 4 | 3. Didactische flow | Overwegen of "Hard" realistisch is voor alle J1-leerlingen; eventueel een "Makkelijkere modus" of instapvariant aanbieden. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
