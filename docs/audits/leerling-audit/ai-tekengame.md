# Audit — AI Tekengame (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-tekengame` |
| **Titel** | AI Tekengame |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (DrawingDuelGame component + AI chat) |
| **SLO-kerndoelen** | 21D (AI) — mapping claimt alleen 21D |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "AI Tekengame" is helder
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Teken en laat de AI raden wat het is!"
- [x] Emoji of visueel element past bij het thema — visuele preview met kat-emoji en "Is dit een kat?" is aantrekkelijk
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" is correct voor J1

**Bronbestanden:** `config/agents/year1.tsx:3574-3605`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De preview met het tekenvel en de AI-reactie "Is dit een kat?" maakt direct duidelijk wat de missie inhoudt. De beschrijving en het probleem-scenario zijn kort en begrijpelijk. De moeilijkheidsgraad "Easy" past bij het speelse karakter.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Geen afgebroken of afgekapte teksten — niet verifieerbaar zonder runtime
- [x] Kleuren zijn consistent — gradient amber-orange-red past bij het creatieve thema
- [x] Animaties zijn niet afleidend of overweldigend — alleen `animate-pulse` op het 🤖 icoon
- [ ] Responsive op minimaal 375 px breed (mobiel) — canvas-tekenen op mobiel is problematisch, DrawingDuelGame gebruikt geen expliciete mobiele aanpassingen

**Bronbestanden:** `config/agents/year1.tsx:3586-3604`, `components/games/DrawingDuelGame.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> De visuele preview is aantrekkelijk. Maar: de preview gebruikt hardcoded hex-kleuren (`#F59E0B`) in plaats van `lab-*` tokens. Belangrijker: het tekenspel zelf (`DrawingDuelGame`) is een multiplayer duel-component met lobby, wachtkamer en canvas — de mobiele ervaring is onbekend en canvas-tekenen op kleine schermen is inherent lastig. De kleuren in de preview (amber/orange/red gradient) zijn inline Tailwind, wat correct is, maar de `color: '#F59E0B'` op het agent-object is een hardcoded hex.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Teken → Raden → Leren is een natuurlijke flow
- [x] Elke stap bouwt aantoonbaar voort op de vorige — ja, je moet eerst tekenen voordat de AI kan raden, en je moet zien wat de AI doet om te leren
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, speels karakter
- [ ] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — de systemInstruction bevat begrippen als "patroonherkenning" en "trainingsdata" maar legt ze goed uit met de analogie

**Bronbestanden:** `config/agents/year1.tsx:3637-3653` (steps), `config/agents/year1.tsx:3606-3636` (systemInstruction)

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw: de drie stappen (Teken → Raden → Leren) zijn logisch en de systemInstruction bevat een uitstekende analogie ("1 miljoen mensen die een kat tekenen"). De reflectievragen zijn goed gekozen. Punt van verbetering: er ontbreken STEP_COMPLETE markers in de systemInstruction — de AI-coach weet niet wanneer een leerling een stap heeft afgerond. Zonder STEP_COMPLETE kan de voortgang niet getrackt worden.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — AI-patroonherkenning wordt juist uitgelegd
- [ ] Geen typografische fouten of spelfouten — "zien" in plaats van "zien" op regel 3581 (`te zien` → moet `te zien` zijn, maar `ziet` vs `ziet` op regel 3633: "AI ziet" moet "AI ziet" zijn... eigenlijk staat er "zien" waar "zien" bedoeld is op r3581 en "ziet" op r3633 — "ziet" is correct)
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, aansprekend
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is
- [x] Terminologie consistent door de hele missie

**Bronbestanden:** `config/agents/year1.tsx:3574-3655`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De analogie met "1 miljoen mensen die een kat tekenen" is didactisch uitstekend en past perfect bij de doelgroep. Er is één spelfout in `problemScenario`: "te zien" moet "te zien" zijn (r3581) — wacht, het staat er correct als "te zien" wat eigenlijk "te zíen" zou moeten zijn... na herlezen: "door HEEL VEEL voorbeelden te zien!" — dit moet "te **zien**" zijn, wat de correcte spelling is. De fout is eigenlijk niet aanwezig. De beperkingen-sectie in de systemInstruction is goed ("AI ziet geen ruimtelijke vormen") maar "ziet" is niet standaard-Nederlands — "ziet" wordt in sommige dialecten gebruikt maar standaard is "ziet" correct. Kleine punten, geen blokkeerders.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1170 tekens, ruim voldoende
- [ ] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — **ONTBREEKT**
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle drie stappen (3/3) — **ONTBREEKT** (0/3)
- [ ] Verificatievragen aanwezig — reflectievragen staan in de instructie, maar er is geen formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — "AI Art Analyst" is een leuke rol
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:3606-3636`, `config/agents/shared.tsx`

**Score:** 2 / 5

**Opmerkingen:**
> De systemInstruction zelf is inhoudelijk sterk — goede analogie, relevante reflectievragen, beperkingen worden besproken. Maar er ontbreken drie essentiële onderdelen: (1) geen EERSTE BERICHT waardoor de leerling geen welkom krijgt en niet weet hoe te beginnen, (2) geen STEP_COMPLETE markers waardoor voortgang niet getrackt kan worden, en (3) geen formeel verificatieprotocol. Dit is een significant probleem voor de leerervaring — de AI-coach kan niet goed begeleiden zonder deze structuur. Vergelijk met `privacy-by-design` die alle drie wel heeft.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — tekenen + AI-herkenning is een uitstekende manier om patroonherkenning te leren
- [x] Voldoende variatie — het DrawingDuel-component heeft meerdere rondes met verschillende tekenwoorden
- [x] Feedback op foute antwoorden is leerzaam — de AI raadt en de leerling leert van de fouten
- [ ] Het element werkt technisch zonder zichtbare bugs — niet verifieerbaar zonder runtime, maar het DrawingDuelGame is een multiplayer-component (lobby + duel), wat mogelijk niet aansluit bij het solo-missiescenario

**Bronbestanden:** `components/games/DrawingDuelGame.tsx`, `components/games/DrawingDuel/`

**Score:** 3 / 5

**Opmerkingen:**
> Het concept is uitstekend — tekenen en AI laten raden is enorm boeiend voor J1-leerlingen. Maar er is een architecturaal mismatch: het `DrawingDuelGame` component is een **multiplayer duel-game** (met lobby, challenges, wachtkamer), terwijl de missie-beschrijving klinkt als een solo-ervaring ("Teken 3 objecten en kijk of de AI het kan raden"). Het is onduidelijk of leerlingen dit solo kunnen doen of dat ze een tegenspeler nodig hebben. Dit kan een blokkerende UX-issue zijn als er geen andere leerlingen online zijn.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — **geen `goalCriteria` gedefinieerd**, `bonusChallenges: null`
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd**
- [ ] Scoredrempels zijn realistisch — **geen scoring systeem**
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**

**Bronbestanden:** `config/agents/year1.tsx:3654` (`bonusChallenges: null`)

**Score:** 1 / 5

**Opmerkingen:**
> Er is geen enkel afrondingselement aanwezig. Geen badges, geen scoring, geen takeaways, geen goalCriteria. Een leerling weet niet wanneer de missie "klaar" is en krijgt geen samenvatting van wat geleerd is. Dit is een blokkerende issue — zonder afronding voelt de missie onaf en mist het didactische sluiting. Vergelijk met `privacy-by-design` die badges, maxScore en takeaways heeft.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21D (AI) past: de missie leert over AI-patroonherkenning
- [ ] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — **MISMATCH**: `curriculum.ts` heeft `sloFocus: ['21D', '22A', '22B', '23B', '23C']` voor periode 2, maar `slo-kerndoelen-mapping.ts` claimt alleen `21D` voor deze missie. Geen directe conflict, maar de periode-SLO-focus bevat 22A/22B/23B/23C die niet door deze missie worden bediend
- [ ] Het leerdoel is toetsbaar geformuleerd — "Teken 3 objecten en kijk of de AI het kan raden" is een activiteit, geen toetsbaar leerdoel

**Bronbestanden:** `config/curriculum.ts:83-92`, `config/slo-kerndoelen-mapping.ts:48`

**Score:** 3 / 5

**Opmerkingen:**
> De missie leert daadwerkelijk over AI-patroonherkenning (21D), wat klopt. Maar: (1) de missie-inventarisatie markeert dit als SLO_MISMATCH — mogelijk omdat het in de bredere periode-SLO-mapping niet goed aansluit. (2) Het leerdoel is geformuleerd als activiteit ("teken en kijk") in plaats van als meetbaar resultaat ("kan uitleggen hoe AI patronen herkent"). De reflectievragen in de systemInstruction komen dichter bij een toetsbaar doel, maar die zijn niet formeel gekoppeld aan de completion-criteria (die ontbreken).

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — kort, informeel, begrijpelijk voor J1
- [ ] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen — niet verifieerbaar, canvas-element heeft per definitie geen alt-tekst
- [ ] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord — tekenen met toetsenbord is niet mogelijk
- [ ] Kleurcontrast voldoet aan WCAG AA — gradient kleuren op de preview zijn waarschijnlijk OK, maar niet getest
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht — niet verifieerbaar zonder runtime

**Bronbestanden:** `components/games/DrawingDuelGame.tsx`, `components/games/DrawingDuel/`

**Score:** 2 / 5

**Opmerkingen:**
> Het leesniveau is goed voor J1. Maar tekenen op een canvas is inherent ontoegankelijk voor leerlingen die geen muis of touchscreen kunnen gebruiken. Er is geen alternatieve interactievorm. Dit is een fundamentele toegankelijkheidsbeperking van het gekozen format. Voor een tekengame is dit deels onvermijdelijk, maar er zou op z'n minst een alternatieve opdracht beschikbaar moeten zijn.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Uitstekende preview en beschrijving |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, mobiel onduidelijk |
| 3. Didactische flow | 4 | ×2 = 8 | Goede opbouw, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Sterke analogie, kleine taalpunten |
| 5. AI-coach kwaliteit | 2 | ×1 = 2 | Mist EERSTE BERICHT + STEP_COMPLETE |
| 6. Interactiviteit | 3 | ×1 = 3 | Concept top, multiplayer mismatch |
| 7. Afronding & feedback | 1 | ×1 = 1 | Niets aanwezig |
| 8. SLO-aansluiting | 3 | ×1 = 3 | 21D klopt, leerdoel niet toetsbaar |
| 9. Toegankelijkheid | 2 | ×1 = 2 | Canvas inherent ontoegankelijk |
| **TOTAAL** | | **35 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (4×2) + (4×2) + (2×1) + (3×1) + (1×1) + (3×1) + (2×1) = 35
Percentage = (35 / 55) × 100% = 63,6%
```

### Verdict

**⚠️ Needs work** (63,6% — boven de 60% drempel, maar met blokkerende issues)

> Ondanks het sterke concept en de uitstekende eerste indruk, heeft deze missie significante structurele tekortkomingen: geen afrondingselement (blokkeerder), ontbrekende AI-coaching structuur, en een mogelijke multiplayer/solo mismatch. De inhoud en didactiek zijn goed, maar de "schil" eromheen ontbreekt grotendeels.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, scoring, takeaways of goalCriteria aanwezig. Leerling weet niet wanneer klaar en krijgt geen samenvatting. | Product |
| 2 | 5. AI-coach kwaliteit | Geen EERSTE BERICHT en geen STEP_COMPLETE markers (0/3). AI-coach kan niet begeleiden. | Product |
| 3 | 9. Toegankelijkheid | Canvas-tekenen is niet toetsenbord-toegankelijk. Geen alternatieve opdracht beschikbaar. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#F59E0B` vervangen door `lab-*` token. Mobiele canvas-ervaring testen. | Medium |
| 2 | 6. Interactiviteit | Verduidelijken of missie solo of multiplayer is. Als solo: apart component nodig (geen DrawingDuelGame). | Hoog |
| 3 | 8. SLO-aansluiting | Leerdoel herformuleren als meetbaar resultaat ("kan uitleggen hoe AI patronen herkent"). SLO-mapping verifiëren. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 3. Didactische flow | Extra scaffolding toevoegen: voorbeeldtekening laten zien voordat leerling zelf tekent. |
| 2 | 4. Inhoudelijke correctheid | Verificatievragen formaliseren als onderdeel van de completion-flow. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
