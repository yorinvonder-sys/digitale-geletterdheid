# Review: data-journalist (wave 8)

**Datum:** 2026-07-01
**Template:** data-viewer
**Config:** `src/features/missions/templates/data-viewer/configs/data-journalist.ts`
**Agent-rol:** `src/config/agents/year2.tsx:8` (chatRoleId `data-journalist`, `enableChat: true`)
**Curriculum:** Leerjaar 2, Periode 1 (`config/curriculum.ts:164`)
**SLO-claim:** `21C, 22A` regulier · `18B, 19A` VSO (`config/slo-kerndoelen-mapping.ts:98`)

---

## 🎨 Design review

**Mission:** data-journalist (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Visual Precision Gate**: geen screenshots-map aanwezig, geen Chrome-plugin-bewijs beschikbaar deze pass — statisch beoordeeld, niet als blocking gezet (config bevat geen structurele layout-anomalieën t.o.v. andere data-viewer-missies).
- **Criterium 2 (Layout consistentie)**: config volgt het standaard data-viewer-patroon (`datasets[]` met `table` / `bar-chart` / `document-cards` types) — consistent met andere missies van dit templateType.
- **Criterium 3 (Knop-clarity)**: geen inline knoppen in de config; alle interactie loopt via de gedeelde `DataViewer.tsx`-engine (engine-verantwoordelijkheid, niet missie-specifiek).
- **Criterium 4 (Copy-lengte)**: `introDescription` = 29 woorden (limiet leerjaar 2: <80) — ruim binnen grens. Vraagteksten 11–22 woorden (limiet <60) — ruim binnen grens. Langste document-card (Schoolkrant 2B) = 30 woorden, past bij het didactische doel (bronvergelijking vereist volledige citaten).
- **Criterium 7 (Toegankelijkheid)**: engine-niveau a11y (labels, focus-states, aria-label op chat-toggle) is al aanwezig in `DataViewer.tsx:178,212,223,708-709` — bekend engine-breed a11y-plafond, niet missie-specifiek.

### ⚠️ Aandachtspunten
- **Criterium 1 (Tailwind token consistentie)**: `chartData` in dataset 2 gebruikt hardcoded hex-kleuren i.p.v. duck-tokens — `src/features/missions/templates/data-viewer/configs/data-journalist.ts:98-103`.
  - **Wat:** `color: '#ff3c21'` (regel 98), `color: '#e1ff01'` (regel 99), `color: '#202023'` (regels 100-103, 4×) zijn letterlijke hex-strings terwijl `duck-error`, `duck-acid` en `duck-ink` exact deze waarden als token hebben (bevestigd in design.md-referentietabel: duck-ink #202023, duck-acid #e1ff01, duck-error #ff3c21).
  - **Waarom:** geen visueel probleem (kleuren zijn identiek aan de tokens), maar een onderhoudsrisico — als het duck-palet ooit wijzigt, blijft deze missie achter. Dit is een bekend patroon over meerdere data-viewer-missies heen (chartData/badges gebruiken vaak hex i.p.v. token), dus mogelijk een engine-config-conventie eerder dan een individuele fout.
  - **Voorstel:** vervang de hex-strings door de token-namen als de `chartData`-config dat toestaat (`color` verwacht een CSS-kleurwaarde, dus `'var(--duck-error)'` of het duck-hexcode-token uit `tailwind.shared.js` zou moeten werken als het component CSS custom properties ondersteunt — vereist controle in `SimpleChart.tsx` of `color` een Tailwind-class of raw CSS-waarde verwacht voordat dit auto-fixable is).
- **Badges** gebruiken ook hardcoded hex — `src/features/missions/templates/data-viewer/configs/data-journalist.ts:213,219,225,231` (`#e1ff01`, `#202023` × 3). Zelfde patroon en zelfde onderbouwing als chartData hierboven.

### ❌ Blocking issues
Geen.

### Score
4/5 criteria volledig geslaagd, 1 aandachtspunt (hex i.p.v. token — cosmetisch/onderhoud, geen zichtbaar defect) · Aanbeveling: **ship** (fix optioneel, niet blocking)

---

## 📚 Didactiek review

**Mission:** data-journalist (data-viewer)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 21C (Data & Dataverwerking), 22A (Digitale producten) · VSO 18B, 19A
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21C` en `22A` zijn beide geldige regulier-VO-codes; `18B`/`19A` zijn geldige VSO-codes (`config/slo-kerndoelen-mapping.ts:98`).
- **Criterium 2 (SLO-fit)**: `21C` (data & dataverwerking) wordt sterk geraakt — leerlingen sorteren/filteren een tabel, berekenen een gemiddelde, lezen een staafgrafiek. `22A` (digitale producten) is zwakker geraakt — de missie eindigt niet in een gebouwd product, alleen in analyse-antwoorden; zie aandachtspunt hieronder.
- **Criterium 4 (Opdracht-beknoptheid)**: alle copy-velden ruim binnen leerjaar-2-grenzen (intro 29w van <80, vragen 11-22w van <60).
- **Criterium 5 (Leeftijdspassend vocabulary)**: begrippen als "meta-analyse" en "conflict of interest" worden expliciet uitgelegd tussen haakjes direct in de tekst (`data-journalist.ts:165,199`) — goede scaffolding voor onderbouw-jargon.
- **Criterium 6 (Curriculum-plek)**: past logisch in Leerjaar 2 Periode 1 "Data & Informatie" naast spreadsheet-specialist, factchecker, dashboard-designer — thematisch coherent blok.
- **Criterium 7 (Bloom-balans)**: goede mix — q1/q4 (onthouden/toepassen: aflezen), q2/q5 (toepassen: berekenen), q3/q6/q8 (analyseren: patroon + verklaring), q7 (evalueren: bronbetrouwbaarheid rangschikken). Geen pure quiz-recall.
- **Criterium 9 (Welzijn)**: VSO-mapping aanwezig; onderwerp (schermtijd/social media/welzijn) wordt neutraal en onderzoekend behandeld, geen alarmistische framing — dataset 3 laat expliciet zien dat bewijs voor schadelijkheid genuanceerd is (geen eenduidige "social media is slecht"-boodschap, juist het tegenovergestelde wordt als minst betrouwbaar bericht aangemerkt).

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — content-mismatch tussen chat-rol en missie**: `config/agents/year2.tsx:15,19,27` vs `data-journalist.ts:5-13`.
  - **Wat:** de AI-agent-rol (`problemScenario`, `examplePrompt`, `systemInstruction`) beschrijft een compleet ander scenario dan de daadwerkelijke missie-inhoud. De agent-rol zegt: "Een lokale krant heeft een dataset over **energieverbruik van scholen**... ontwerp een **infographic**" (`year2.tsx:15`) en het voorbeeld is "een tabel met cijfers over **waterverbruik per maand**" (`year2.tsx:19`). De `systemInstruction` (`year2.tsx:27-54`) coacht de leerling stap-voor-stap naar het **maken van een infographic** (staafdiagram/cirkeldiagram/lijndiagram ontwerpen). Maar de daadwerkelijke missie (`data-journalist.ts`) gaat over **social media-gebruik, schermtijd tussen landen, en bronbetrouwbaarheid van nieuwsberichten** — er wordt geen infographic gebouwd, alleen multiple-choice/number-input/text-observation-vragen beantwoord over drie vaste datasets.
  - **Waarom:** als een leerling de chat opent (`enableChat: true`, `chatRoleId: 'data-journalist'`) en de AI vraagt "welk onderwerp wil je onderzoeken?" of praat over een infographic-ontwerp, terwijl het scherm ernaast vaste vragen toont over TikTok-gebruik en nieuwsbronnen, ontstaat cognitieve dissonantie. Dit ondermijnt het AI-as-copilot-principe: de AI kan de leerling niet zinvol scaffolden voor een taak die niet bestaat in deze missie, en kan mogelijk verwarrende doorverwijzingen geven ("laten we je infographic bespreken") die niet bij het scherm passen.
  - **Voorstel:** `systemInstruction`, `problemScenario` en `examplePrompt` in `config/agents/year2.tsx:15,19,27-56` herschrijven naar het daadwerkelijke scenario (dataset-analyse van schermtijd/social media/nieuwsbronnen + bronbetrouwbaarheid-beoordeling), zodat de chat-coach aansluit bij wat de leerling op het scherm ziet. Dit is een missie-specifieke content-fix — geen engine-issue.

    **Voorstel-blok (before/after):**
    ```tsx
    // ❌ Huidig — config/agents/year2.tsx:15
    problemScenario: 'Een lokale krant heeft een enorme dataset gekregen over het energieverbruik van scholen in Nederland, maar niemand begrijpt de cijfers. Jij wordt ingehuurd als data-journalist om de belangrijkste patronen te ontdekken en er een heldere infographic van te maken.',

    // ✅ Voorgesteld
    problemScenario: 'Een lokale krant vraagt jou als data-journalist om cijfers over social media-gebruik en schermtijd te analyseren en nieuwsberichten over dit onderwerp kritisch te beoordelen op betrouwbaarheid.',
    ```
    ```tsx
    // ❌ Huidig — config/agents/year2.tsx:19
    examplePrompt: 'Ik heb een tabel met cijfers over waterverbruik per maand. Hoe vind ik trends?',

    // ✅ Voorgesteld
    examplePrompt: 'Ik zie in de tabel dat sommige leerlingen "Moe" invullen na social media-gebruik. Hoe weet ik of dat een echt patroon is?',
    ```
- **Criterium 2 (SLO-fit, `22A`) — oppervlakkig contact**: `config/slo-kerndoelen-mapping.ts:98` claimt `22A` (Digitale producten).
  - **Wat:** de missie bevat geen bouw- of ontwerpactiviteit die onder "digitale producten" valt — leerlingen beantwoorden analysevragen over bestaande datasets, ze maken zelf niets (geen infographic, geen dashboard, geen document).
  - **Waarom:** dit is oppervlakkig contact met `22A`, geen sterke SLO-fit. Mogelijk historisch verklaarbaar (de oorspronkelijke agent-briefing ín year2.tsx beloofde wél een infographic — zie bovenstaand punt — en de SLO-claim `22A` sluit daar wél bij aan). Als de systemInstruction-fix hierboven wordt doorgevoerd zónder de infographic-bouw-taak zelf toe te voegen aan de config, wordt de `22A`-claim nog zwakker onderbouwd.
  - **Voorstel:** twee routes — (a) `22A` uit de SLO-claim verwijderen als de missie bij pure data-analyse blijft, of (b) een korte "ontwerp je eigen infographic op papier"-afsluitende opdracht toevoegen aan de config (buiten scope van deze review — vereist productbeslissing, niet automatisch fixbaar).

### ❌ Blocking issues
Geen — de mismatch is verwarrend maar niet functioneel-blokkerend (de vaste vragen werken los van de chat-coach).

### SLO-fit oordeel
- **21C (Data & Dataverwerking)**: sterk geraakt — sorteren, filteren, gemiddelde berekenen, patroon herkennen over 3 datasets.
- **22A (Digitale producten)**: oppervlakkig — geen productbouw-activiteit in de huidige config; zie aandachtspunt.

### Score
7/9 criteria volledig geslaagd, 2 aandachtspunten (1 content-mismatch chat-rol, 1 SLO-oppervlakkigheid) · Bloom-balans: medium-hoog · Aanbeveling: **fix-eerst** (systemInstruction-mismatch is didactisch relevant genoeg om vóór brede uitrol te herstellen, maar geen herontwerp nodig)

---

## 🔧 Tech review

**Mission:** data-journalist (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen screenshots-map aanwezig, geen dev-server gestart deze pass (statische wave-review)

### Static analyse
#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`/`@ts-expect-error` in de config.
- **Criterium A4 (Imports via alias)**: `DataViewer.tsx:8` gebruikt `@/hooks/useMissionAutoSave` — alias-conventie gevolgd.
- **Criterium A6 (Restart-safe state)**: `useMissionAutoSave<DataViewerState>` wordt aangeroepen in de gedeelde engine (`DataViewer.tsx:482`) — engine-niveau, dekt deze missie automatisch.
- **Puntensom-verificatie**: alle vraagpunten opgeteld (q1=15 + q2=20 + q3=10 + q4=10 + q5=15 + q6=10 + q7=15 + q8=5 = **100**) komt exact overeen met `maxScore: 100` (`data-journalist.ts:206`). Geen rekenfout.
- **Antwoordmodel-verificatie tegen dataset**: alle drie berekende antwoorden herrekend en correct bevonden:
  - q1: TikTok komt 4× voor (Daan, Sara, Jayden, Tim) tegen Instagram/YouTube 3× en Snapchat 2× — `correctAnswer: 'TikTok'` klopt.
  - q2: som van de zeven 14-jarigen (4.0+2.0+1.5+1.0+3.0+3.5+2.5=17.5) / 7 = 2.5 — `correctAnswer: 2.5` klopt exact.
  - q5: NL (4.2) − Japan (2.9) = 1.3 — `correctAnswer: 1.3` klopt exact.
- **Badge-drempels**: monotoon aflopend en dekken het hele scorebereik zonder gaten (0, 40, 65, 85 van maxScore 100) — geen onbereikbare of overlappende badge.

#### ⚠️ Aandachtspunten
- **Hardcoded hex-kleuren** in `chartData` (regels 98-103) en `badges` (regels 213,219,225,231) — zie Design review Criterium 1 voor volledige onderbouwing. Vanuit tech-perspectief: mechanisch, laag risico, geen functionele impact.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd deze pass (geen screenshots-map, geen actieve dev-server) — geen dynamische claims gedaan.

### Score
Static: 4/5 criteria volledig geslaagd (1 cosmetisch aandachtspunt) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting & bekende context (niet herhaald als missie-issue)

De volgende platform-brede/engine-brede issues zijn al elders geëscaleerd en NIET opnieuw als missie-specifiek issue meegeteld in de score:
- data-viewer a11y-set (engine-niveau, al bekend)
- CompletionScreen/SimpleChart hex-kleurgebruik (engine-component, gedeeld over alle data-viewer-missies)
- badge `#202023`-patroon (herhaald platform-breed patroon, hier wel genoteerd als cosmetisch aandachtspunt omdat het per-missie mechanisch fixbaar is)
- learningObjectives-rendering (engine-verantwoordelijkheid)
- dormante chat-rol zonder `enableChat`: **niet van toepassing** — deze missie heeft `enableChat: true`, dus dit punt is hier niet relevant. In plaats daarvan is er een content-mismatch tússen de wél-actieve chat-rol en de missie-content (zie Didactiek review) — dit is missie-uniek en dus wél gerapporteerd.

**Kernbevinding van deze review:** de missie-content zelf (data-viewer config) is solide — correcte antwoordmodellen, kloppende puntensom, leeftijdspassende copy, goede Bloom-balans, genuanceerde behandeling van een gevoelig onderwerp (schermtijd/welzijn). Het belangrijkste verbeterpunt is de **systemInstruction/problemScenario-mismatch** in de agent-rol-config (`config/agents/year2.tsx`), die een ander scenario (energieverbruik/infographic) beschrijft dan de daadwerkelijke missie-inhoud (social media/schermtijd/bronbetrouwbaarheid). Dit is de enige score-drukkende bevinding.

**Verdict: fix-eerst** — triageScore net onder de ship-drempel door de didactiek-mismatch; overige assen zijn ship-klaar. De voorgestelde systemInstruction/problemScenario/examplePrompt-herschrijving in het Didactiek-blok hierboven lost het kernprobleem op.
