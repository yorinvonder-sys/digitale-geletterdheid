# Rubric-review: ai-tekengame

**Datum:** 2026-08-25
**templateType:** agent-role (pure chatmissie, geen eigen component/config)
**Curriculum-plek:** Leerjaar 1, Periode 2 (`config/curriculum.ts:87`)
**SLO-claim:** `21D` (AI) — `config/slo-kerndoelen-mapping.ts:50`
**Bronnen:** `src/config/agents/year1.tsx:3345-3428` (agent-rol-entry + `visualPreview`), `src/config/missionGoals.ts:123-130`, `src/features/ai-chat/StudentAIChat.tsx`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

### ✅ Geslaagd
- **Criterium 1 (tokens grotendeels geldig):** `lab-gold`, `lab-coral`, `lab-line` bestaan in `tailwind.shared.js:23,25,27` — `src/config/agents/year1.tsx:3352`.
- **Criterium 3 (knop-clarity):** `visualPreview` bevat geen interactieve elementen (puur decoratieve preview-tile) — geen dode knoppen te flaggen.
- **Criterium 7 (alt/kleur):** geen tekstuele informatie die uitsluitend via kleur wordt overgebracht.

### ⚠️ Aandachtspunten
- **Criterium 1 (token-mix)**: `visualPreview` mixt `lab-*` en `duck-*` binnen dezelfde component zonder duidelijke reden — `src/config/agents/year1.tsx:3369` (`bg-duck-ink/20` in een verder volledig `lab-*`-gestylede tile: `from-lab-gold`, `via-lab-coral`, `border-lab-line`).
  - **Wat:** de badge onderaan de preview gebruikt `duck-ink`, de rest van de tile gebruikt uitsluitend `lab-*`.
  - **Waarom:** inconsistente naamgeving maakt niet-doeldomein bedoeld of onbedoeld — onduidelijk of dit een bewuste DUCK-migratie-stap is of een kopieerfout.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/config/agents/year1.tsx:3369
    <div className="mt-4 bg-duck-ink/20 backdrop-blur px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">

    // ✅ Voorgesteld — consistent met de rest van de tile
    <div className="mt-4 bg-lab-ink/20 backdrop-blur px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">
    ```
- **Criterium 1 (redundante gradient-stop)**: `from-lab-gold via-lab-coral to-lab-coral` — `src/config/agents/year1.tsx:3350`.
  - **Wat:** `via-lab-coral` en `to-lab-coral` zijn dezelfde kleur; de `via`-stop heeft dan geen visueel effect.
  - **Waarom:** kleine onnodige regel, geen functioneel probleem — puur opschoning.
  - **Voorstel:** `from-lab-gold to-lab-coral` (verwijder de overbodige `via-lab-coral`).

### ❌ Blocking issues
- **Visual Precision Gate — niet bewezen én niet toepasbaar op de beloofde ervaring.** De `visualPreview`-mockup (`src/config/agents/year1.tsx:3350-3373`) toont een tekencanvas met een kattenschets en een AI-bubbel "Is dit een kat?" — een UI die in de daadwerkelijke levering (plain-text chat via `StudentAIChat`) **niet bestaat**. Er is geen dev-server/Chrome-plugin-bewijs beschikbaar in deze reviewronde (batch-sweep, geen live server); zelfs mét bewijs zou de canvas-flow niet renderen, want er is geen canvas-component gekoppeld aan deze missie. Zie tech-sectie voor de onderliggende oorzaak — dit is dus geen ontbrekend bewijs maar een aangetoonde mismatch tussen preview-belofte en werkelijke levering.

### Score
2/7 relevante criteria geslaagd (5 n.v.t. — geen interactieve UI aanwezig) · Aanbeveling: **fix-eerst** (de mismatch hieronder bij tech is de kern van het design-probleem)

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** `21D` (AI)

### ✅ Geslaagd
- **Criterium 1 (SLO-code geldig):** `21D` is een geldige code (AI) — `config/slo-kerndoelen-mapping.ts:50`.
- **Criterium 6 (curriculum-plek logisch):** past bij het AI & Creatie-blok in periode 2, tussen `ai-trainer` en `ai-beleid-brainstorm` — `config/curriculum.ts:80-87`.
- **Criterium 5 (leeftijds-passend taalgebruik):** de kat-analogie ("Stel je voor dat je aan 1 miljoen mensen vraagt om een kat te tekenen...") is concreet en herkenbaar voor leerjaar 1 — `src/config/agents/year1.tsx:3384-3392`.
- **Criterium 3 (impliciete leerdoelen aanwezig):** `missionGoals.ts:123-129` bevat `primaryGoal`, `criteria` en `evidence` met meetbare formulering ("Je kunt voorbeelden noemen van tekeningen die de AI goed en minder goed herkende").

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot / opdracht-integriteit)**: de `steps`-array belooft een tekenspel met tijdslimiet dat de missie niet kan leveren — `src/config/agents/year1.tsx:3411-3420`.
  - **Wat:** stap "Teken" zegt "Je krijgt een woord en hebt 45 seconden om te tekenen", stap "Raden" zegt "De AI analyseert je tekening en doet een gok."
  - **Waarom:** een leerling die deze stappen als opdracht krijgt voorgeschoteld, maar in een tekstchat terechtkomt zonder canvas, timer of AI die naar een tekening kijkt, ervaart een opdracht die het beloofde leerdoel ("Ik laat zien hoe AI een tekening kan herkennen") niet kan waarmaken — het leerdoel wordt didactisch niet gedekt door de daadwerkelijke interactie.
  - **Voorstel:** zie tech-sectie voor de kernoorzaak; didactisch is de kortste fix om de `steps`-copy te herschrijven naar wat de chat wél kan leveren (leerling beschrijft in woorden wat hij tekent/zou tekenen, AI beredeneert met de kat-analogie welke patronen herkenbaar zouden zijn) — of de missie krijgt alsnog een canvas-component zodat de belofte klopt.

### ❌ Blocking issues
- **Criterium 2 (SLO-fit — claim vs werkelijkheid):** SLO `21D` (AI) wordt geclaimd via een tekenherkenning-scenario, maar de daadwerkelijke levering is een tekst-chat over een tekenherkenning-scenario dat nooit plaatsvindt. De leerling oefent dus alleen "erover praten hoe AI-beeldherkenning werkt" (begrijpen-niveau), niet het beloofde "testen hoe goed de AI jouw tekeningen herkent" (toepassen/analyseren-niveau uit `missionObjective`, `src/config/agents/year1.tsx:3353`). Dit is een misalignment tussen geclaimd Bloom-niveau en werkelijk bereikbaar Bloom-niveau — zie tech-sectie.

### SLO-fit oordeel
- **21D (AI):** oppervlakkig geraakt zoals geleverd (praten over patroonherkenning), maar **mismatch** ten opzichte van de geclaimde en beloofde ervaring (leerling tekent zelf en test AI-herkenning). Bewijs: geen canvas/drawing-component gekoppeld, `steps`-array beschrijft een niet-bestaande interactie.

### Score
4/9 criteria geslaagd (5 n.v.t. of gedekt door de blocking-mismatch) · Bloom-balans: geclaimd hoog (toepassen/analyseren), werkelijk laag (onthouden/begrijpen) · Aanbeveling: **fix-eerst**

---

## 🛠️ Tech review

### Fase A — Static code-analyse

#### Kernbevinding: geen drawing-canvas gekoppeld aan een chat-only missie

`ai-tekengame` heeft geen `templateRegistry.ts`-entry en geen `missionPreviewConfig.ts`-entry (beide bevestigd leeg bij grep). De missie is dus een **pure agent-role/chatmissie**: leerlingen krijgen `src/features/ai-chat/StudentAIChat.tsx` te zien, met `roleId` gekoppeld aan de server-side `systemInstruction` uit `src/config/agents/year1.tsx:3383-3407`.

`StudentAIChat.tsx` (345 regels, volledig gelezen) bevat **geen** enkele referentie naar `canvas`, `image`, `attach`, `file` of `drawing` — het is een tekst-in/tekst-uit chatvenster. Er bestaat geen tekentool, timer of afbeeldingsupload gekoppeld aan `ai-tekengame` in de repo.

Tegelijk belooft de content van de missie zelf een QuickDraw-achtige ervaring:
- `visualPreview` (`year1.tsx:3350-3373`): toont een tekencanvas-mockup met een kattenschets en "AI: Is dit een kat?"
- `problemScenario` (`year1.tsx:3354`): "Test hoe goed de AI jouw tekeningen herkent."
- `missionObjective` (`year1.tsx:3353`): "Teken 10 korte objecten en ontdek welke patronen de AI herkent."
- `steps` (`year1.tsx:3411-3420`): "Je krijgt een woord en hebt 45 seconden om te tekenen" / "De AI analyseert je tekening en doet een gok."

Geen van deze beloftes is technisch inlosbaar binnen de huidige chat-only levering: er is geen mechanisme waarmee een tekening (canvas-output of foto) het systeem bereikt, laat staan bij een AI-model met beeldherkenning terechtkomt.

**Dit is geen bekende valkuil uit de briefing** ("échte AI-coach-prompts staan server-side", "dormant agent-rol zonder enableChat", "dev-preview stubt onBack/onComplete", "bonus-* blank in preview", "game-programmeur deterministisch") — dit is een aantoonbare mismatch tussen wat de missie-content belooft en wat de gekoppelde UI kan leveren.

#### Overige statische criteria (n.v.t. of geslaagd)

- **A1 (knop-handlers):** n.v.t. — geen missie-eigen JSX met knoppen buiten de decoratieve `visualPreview`.
- **A3 (TypeScript-discipline):** geen `any`/`@ts-ignore` in de missie-eigen entry.
- **A4 (import-aliassen):** n.v.t., geen imports in de entry zelf.
- **A5 (edge function calls):** n.v.t. voor de client-config — de daadwerkelijke Mistral-call loopt server-side via `roleId`, buiten scope van dit bestand.
- **A6 (restart-safe state):** n.v.t. — chatgeschiedenis-persistence is gedeeld gedrag van `StudentAIChat`/`useStudentAssistant`, niet missie-specifiek.
- **A7 (security):** `systemInstruction` wordt server-side via `roleId` bepaald (`StudentAIChat.tsx:34,60,146`) — voldoet aan het principe dat de prompt niet client-side hard staat te lezen zijn voor eindgebruikers (de string in `year1.tsx` is build-time config, geen client-runtime-exposed secret, consistent met hoe alle andere agent-rol-missies in dit bestand werken).

### Fase B — Dynamic web-verificatie

Niet uitgevoerd in deze batch-review-ronde: geen dev-server beschikbaar/aangevraagd binnen deze sub-agent-scope. Alle dynamische claims (of de chat daadwerkelijk normaal rendert) zijn **unverified**; de kernbevinding hierboven (geen canvas-koppeling) is echter statisch onomstotelijk aangetoond via het ontbreken van elke drawing/canvas/image-referentie in `StudentAIChat.tsx` en het ontbreken van een templateRegistry-entry.

### Score
6/7 relevante statische criteria geslaagd · Dynamische verificatie: niet uitgevoerd (geen dev-server) · Aanbeveling: **fix-eerst**

---

## Voorstellen (samengevat, voor autofix-scope)

1. **Token-consistentie in `visualPreview`** (`src/config/agents/year1.tsx:3369`): `bg-duck-ink/20` → `bg-lab-ink/20`.
2. **Redundante gradient-stop** (`src/config/agents/year1.tsx:3350`): `from-lab-gold via-lab-coral to-lab-coral` → `from-lab-gold to-lab-coral`.

Deze twee zijn mechanisch en vallen binnen de whitelist-scope voor autofix (agent-rol-entry in `year1.tsx`).

## Voorstel buiten autofix-scope (escalatie naar Yorin)

**De kernbevinding is niet mechanisch fixbaar binnen de whitelist.** Twee routes, geen van beide is een simpele regel-swap:

- **Route A — content aanpassen aan de werkelijke levering:** herschrijf `problemScenario`, `missionObjective`, `steps` en `visualPreview` zodat ze een chat-gesprek over tekenherkenning beschrijven (leerling beschrijft in woorden een tekening, AI redeneert mee met de kat-analogie) in plaats van een live tekenspel. Kleinste fix, maar verzwakt het leerdoel van "testen" naar "erover praten".
- **Route B — echte functionaliteit bouwen:** een canvas-component + AI-beeldherkenning-call toevoegen (nieuw templateType, buiten scope van een agent-role-entry en buiten de autofix-whitelist — raakt `templateRegistry.ts` als nieuwe template, mogelijk een edge function voor beeldanalyse).

Dit is een productbeslissing (welk leerdoel telt zwaarder: technische haalbaarheid vs. de oorspronkelijke "Quick Draw"-belofte) en hoort bij Yorin, niet bij een autofix.

---

## Samenvatting & verdict

`ai-tekengame` is een leerjaar-1-missie met een geldige SLO-claim (`21D`) op een logische curriculum-plek, met nette, leeftijdspassende copy in de agent-instructie zelf. Het kernprobleem zit niet in copy-kwaliteit of tokens, maar in een **structurele mismatch**: de missie is opgezet en gepresenteerd als een interactief tekenspel met AI-beeldherkenning (canvas, timer, "AI analyseert je tekening"), maar wordt technisch geleverd als een gewone tekstchat zonder enige tekentool of beeldverwerking. Leerlingen die de `steps`-instructies volgen ("je hebt 45 seconden om te tekenen") kunnen dat nergens in de UI doen.

De twee kleine token-issues zijn triviaal en autofixable. De kernbevinding vereist een productkeuze (copy afzwakken naar wat de chat kan, of een canvas-component bouwen) en is voor Yorin.

**Verdict: fix-eerst.**
