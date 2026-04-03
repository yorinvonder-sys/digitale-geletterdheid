# Audit — Game Director (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `game-director` |
| **Titel** | Game Director |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (aangepast blok-editor component) |
| **SLO-kerndoelen** | 22B (programmeren) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Game Director" is prikkelend en heeft duidelijke associaties
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — codeblokken visualisatie maakt direct duidelijk wat je gaat doen
- [x] Emoji of visueel element past bij het thema — amber gradient met codeblokken past bij programmeeronderwijs
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Medium" is zichtbaar en passend

**Bronbestanden:** `config/agents/year1.tsx:163-212`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De visuele preview met codeblokken communiceert onmiddellijk dat je gaat programmeren. De amber gradient past goed bij het energetische spelthema. "Game Director" als titel spreekt J1-leerlingen aan die games kennen en willen begrijpen hoe ze werken. Uitnodigend zonder overweldigend te zijn.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — blok-editor interface is robuust
- [x] Kleuren zijn consistent — amber gradient is coherent met het thema
- [x] Animaties zijn niet afleidend of overweldigend — geen overmatige animaties in de preview
- [ ] Responsive op minimaal 375 px breed (mobiel) — hardcoded hex `#F59E0B` in agent-object; blok-editor op mobiel niet geverifieerd

**Bronbestanden:** `config/agents/year1.tsx:163-212`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel aantrekkelijk. De amber/geel gradient past bij het spelthema en de codeblokken in de preview geven een goede visuele indruk van het format. Verbeterpunt: de kleur `#F59E0B` op het agent-object is een hardcoded hex-waarde in plaats van een `lab-*` token. De blok-editor interface is niet expliciet getest op mobiele schermen van 375 px breed.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — 3 stappen bouwen aantoonbaar op: bewegen → springen → afwerken
- [x] Elke stap bouwt aantoonbaar voort op de vorige — karakter beweegt eerst, dan springt, dan wordt het spel afgewerkt
- [x] Moeilijkheid past bij het leerjaar — J1, Medium, visueel programmeren is een passende instap
- [ ] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — "werkgebied" is consequent gebruikt, maar STEP_COMPLETE markers ontbreken waardoor de AI-coach niet weet wanneer een stap klaar is

**Bronbestanden:** `config/agents/year1.tsx:163-260`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw met een logische drieslag (bewegen → springen → afwerken). De blok-editor is een bewezen didactisch format voor introductie-programmeren (vergelijkbaar met Scratch). Verbeterpunt: de systemInstruction bevat geen STEP_COMPLETE markers, waardoor de AI-coach niet kan signaleren wanneer een leerling klaar is met een stap. Dit beperkt de voortgangsregistratie.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — blokprogrammeren-concepten zijn correct beschreven
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, toegankelijk voor J1
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is — "werkgebied" consistent gebruikt in plaats van "workspace"
- [x] Terminologie consistent door de hele missie — blokbeschrijvingen zijn consistent en helder

**Bronbestanden:** `config/agents/year1.tsx:163-260`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk correct. De blokbeschrijvingen zijn helder en het gebruik van "werkgebied" als consequente Nederlandse term voor de programmeeromgeving is een bewuste en goede keuze. De coaching-vragen zijn relevant en helpen leerlingen nadenken over hun code. Kleine beperking: de systemInstruction (~1500 tekens) is bondig maar had dieper kunnen gaan op de relatie tussen blokken en het spelgedrag.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1500 tekens, voldoende
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 212
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle stappen — **ONTBREEKT**: geen STAP-VOLTOOIING sectie in de systemInstruction
- [ ] Verificatievragen aanwezig — coachingsvragen aanwezig maar geen formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — "Game Director" als rol past goed
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:163-260`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is aanwezig en de toon is goed afgestemd op het thema. Maar er ontbreken twee essentiële elementen: (1) geen STEP_COMPLETE markers waardoor de AI-coach niet weet wanneer een leerling een stap heeft afgerond en voortgang niet kan worden getrackt, en (2) geen formeel verificatieprotocol. De coaching-vragen zijn nuttig maar niet gestructureerd als verificatiemechanisme. Vergelijk met `prompt-master` die beide onderdelen volledig heeft.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — blokgebaseerd coderen is een bewezen methode voor introductie-programmeren
- [x] Voldoende variatie — drie stappen geven afwisseling in welke blokken je combineert
- [x] Feedback op foute antwoorden is leerzaam — het spel geeft direct visuele feedback op de code
- [ ] Het element werkt technisch zonder zichtbare bugs — niet verifieerbaar zonder runtime

**Bronbestanden:** `config/agents/year1.tsx:163-260`

**Score:** 4 / 5

**Opmerkingen:**
> Blokgebaseerd coderen is een uitstekende interactievorm voor introductie-programmeren bij J1. Het format is bewezen effectief (Scratch, Code.org), leeftijdsadequaat en veilig — leerlingen kunnen niet "foute" code schrijven. Direct visuele feedback van het spel op de code is pedagogisch waardevol. Technische werking niet geverifieerd zonder runtime.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — **geen `goalCriteria` gedefinieerd**
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd**
- [ ] Scoredrempels zijn realistisch — **geen scoring systeem**
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**

**Bronbestanden:** `config/agents/year1.tsx:163-260`

**Score:** 2 / 5

**Opmerkingen:**
> Significante tekortkoming: er zijn geen afrondingselementen aanwezig. Geen goalCriteria, geen badges, geen scoring, geen takeaways. Een leerling weet niet wanneer de missie "klaar" is en krijgt geen samenvatting van wat geleerd is. Zonder completion-criterium kan de missie eindeloos doorlopen of juist te vroeg afgesloten worden. Dit is een blokkerende issue voor productie-inzet maar niet voor een begeleid pilot-scenario.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 22B (programmeren) past: leerlingen programmeren visueel een game
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — 22B is consistent geclaimd voor J1P2
- [ ] Het leerdoel is toetsbaar geformuleerd — "maak een spelletje" is een activiteit, niet een toetsbaar leerdoel

**Bronbestanden:** `config/agents/year1.tsx:163`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De SLO-aansluiting is goed: visueel programmeren van een game sluit direct aan op 22B (programmeren). Het format is leeftijdsadequaat voor J1. Verbeterpunt: het leerdoel is geformuleerd als activiteit ("maak een game") in plaats van als meetbaar resultaat ("kan uitleggen welke blokken zorgen voor beweging en wat de volgorde van blokken doet"). Een toetsbaar leerdoel zou de didactische sluiting versterken.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — helder en begrijpelijk voor J1
- [ ] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen — niet verifieerbaar voor blok-editor component
- [ ] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord — blok-editor vereist vermoedelijk muis of touch; toetsenbordondersteuning niet geverifieerd
- [ ] Kleurcontrast voldoet aan WCAG AA — niet getest
- [x] Informatie wordt niet uitsluitend via kleur overgebracht — blokken hebben ook tekst/iconen

**Bronbestanden:** `config/agents/year1.tsx:163-260`

**Score:** 3 / 5

**Opmerkingen:**
> Het leesniveau is passend. Maar de blok-editor interface is waarschijnlijk niet volledig toetsenbord-toegankelijk — drag-and-drop interacties zijn inherent moeilijk zonder muis of touchscreen. Toetsenbordondersteuning voor het blok-editor component is niet geverifieerd. Kleurcontrast is niet getest. Voor een inclusief product zijn deze punten relevant, zeker gezien de doelgroep (minderjarigen met potentieel uiteenlopende toegankelijkheidsbehoeften).

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterke preview, duidelijke opzet |
| 2. Visueel | 4 | ×1 = 4 | Goed, hardcoded hex `#F59E0B` |
| 3. Didactische flow | 4 | ×2 = 8 | Goede drieslag, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correct en consistent, beknopt |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT aanwezig, mist STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 4 | ×1 = 4 | Blokprogrammeren is passend en boeiend |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen goalCriteria, badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 22B klopt, leerdoel niet toetsbaar |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Blok-editor keyboard-toegankelijkheid onbekend |
| **TOTAAL** | | **41 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (4×2) + (4×2) + (3×1) + (4×1) + (2×1) + (4×1) + (3×1) = 41
Percentage = (41 / 55) × 100% = 74,5%
```

### Verdict

**⚠️ Needs work** (74,5% — boven de 60% drempel, maar met blokkerende issues)

> Game Director heeft een sterk concept en een goede eerste indruk, maar mist essentiële structurele elementen. Het ontbreken van goalCriteria en afrondingselementen (score 2) is een significante tekortkoming. De AI-coach mist STEP_COMPLETE markers waardoor voortgang niet getrackt kan worden. Met gerichte verbeteringen (goalCriteria, STEP_COMPLETE, takeaways) is dit een sterke missie.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen goalCriteria, badges, scoring of takeaways. Leerling weet niet wanneer klaar. Toevoegen: `goalCriteria`, minimaal 1 badge, `takeaways[]`. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen aan systemInstruction voor alle 3 stappen (bewegen, springen, afwerken). | Hoog |
| 2 | 5. AI-coach kwaliteit | Formeel verificatieprotocol toevoegen: stel de leerling een controlerende vraag voordat een stap als voltooid wordt gemarkeerd. | Medium |
| 3 | 9. Toegankelijkheid | Toetsenbordtoegankelijkheid van het blok-editor component verifiëren. Alternatieve invoer aanbieden indien nodig. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#F59E0B` vervangen door `lab-*` token. |
| 2 | 8. SLO-aansluiting | Leerdoel herformuleren als meetbaar resultaat (bijv. "kan uitleggen wat blokken doen in een programma"). |
| 3 | 4. Inhoudelijke correctheid | SystemInstruction uitbreiden (~2000+ tekens) met meer voorbeelden van blokken en hun effect. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
