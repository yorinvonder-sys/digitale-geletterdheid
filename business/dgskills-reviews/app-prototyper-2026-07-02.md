# Missie-review: App Prototyper

**Datum:** 2026-07-02
**Wave:** 17 (verse review)
**Missie-ID:** `app-prototyper`
**TemplateType:** `builder-canvas`
**Config:** `src/features/missions/templates/builder-canvas/configs/app-prototyper.ts`

## Samenvatting

App Prototyper is een sterke, in zichzelf coherente builder-canvas-missie: leerlingen doorlopen de complete UX-designcyclus (probleemanalyse → wireframes → gebruikersflow → testplan) met heldere scaffolding (5 W's, checklists, reflectievraag). Registratie (curriculum, SLO-mapping, agentRoleIds, templateRegistry, allowlist) is compleet en correct. De enige bevinding is het bekende platform-patroon: het coach-plan (client-side agent-role + server-side systemInstructions) telt 3 stappen, de canvas-config telt er 4 — en de indeling matcht ook inhoudelijk niet 1-op-1. Markers zijn functioneel inert, dus dit raakt alleen coachingtekst-kwaliteit, niet de voortgangslogica.

## Stap A — Registratie & Identiteit

| Bron | Waarde | Status |
|---|---|---|
| `templateRegistry.ts:54` | `missionId: 'app-prototyper', templateType: 'builder-canvas', enableChat: true, chatRoleId: 'app-prototyper'` | OK |
| `BuilderCanvas.tsx:335` (VALID_BUILDER_CANVAS_IDS) | aanwezig | OK |
| `agentRoleIds.ts:55` | `'app-prototyper'` | OK |
| `curriculum.ts:184` | Leerjaar 2, Periode 2 "Programmeren & Computational Thinking", sloFocus bevat 22A | OK |
| `slo-kerndoelen-mapping.ts:112` | `sloKerndoelen: ['22A']`, `sloVsoKerndoelen: ['19A']` (comment: "-22B: prototype ontwerpen zonder code") | OK — 22A = "Digitale producten", inhoudelijk correct voor prototype-ontwerp zonder code |
| `agents/year2.tsx:767-847` | agent-rol compleet: title, icon, color, problemScenario, missionObjective, briefingImage, difficulty, examplePrompt, systemInstruction, steps (client-fallback), bonusChallenges | OK |
| `systemInstructions.ts:58` | server-side prompt aanwezig (échte prompt tijdens gebruik) | OK |

Geen registratie-gaten. Missie is technisch volledig aangesloten.

## Stap B — Screenshots & bestaande UI-review

- Geen `screenshots/`-map voor deze missie gevonden.
- `docs/audits/student-missions-ui-ux-review-2026-06-30.md` bevat geen vermelding van `app-prototyper` (dat rapport dekt kennelijk niet elke missie of miste deze bij de sweep van 30 juni).
- Geen aanvullende visuele bevindingen mogelijk zonder live-rendering; niet blockerend voor deze tekst/config-gerichte review.

## Stap C — Drie rubrics

### Design (uiux)

- Config zelf is templateType `builder-canvas`, dus vormgeving/interactie wordt door het gedeelde canvas-component geleverd (geen missie-specifieke UI-code om te beoordelen).
- Instructie-teksten zijn goed gestructureerd (genummerde deelvragen, concrete voorbeelden zoals "Startscherm", "Zoekpagina").
- Badges hebben een logische progressie (0/25/50/70/90) met passende titels.
- Score: **8/10** — sterk voor de tekst-gedreven onderdelen; geen zichtbare designfouten in de config zelf.

### Didactiek

- 5 W's-methode voor probleemanalyse is een concreet, herbruikbaar denkkader — goede scaffolding voor leerjaar 2.
- Wireframe-stap bevat een relevante reflectievraag met correcte uitleg (structuur testen vóór bouwen = kern van UX).
- Testplan-stap leert een waardevolle, vaak vergeten vaardigheid: "observeer stilletjes, zeg niet 'je klikt op de verkeerde knop'" — dit is didactisch sterk, want het leert leerlingen dat gebruikersfeedback objectief verzameld moet worden.
- Checklist-items zijn concreet en telbaar (bijv. "3 schermen", "4 stappen per flow"), wat zelfregulatie ondersteunt.
- Coach-plan-desync (zie hieronder) is de enige aftrek.
- Score: **8/10**.

### Techniek

- Config-structuur volgt het bestaande `BuilderCanvasConfig`-schema correct (steps, checklistItems, textPrompt, reflectionQuestion, badges, takeaways).
- `previewType: 'text-preview'` past bij de aard van de missie (geen live-canvas-rendering nodig voor tekstuele wireframes/flows).
- Geen technische issues gevonden in de config zelf.
- Score: **9/10**.

**triageScore** = (10-8)\*0.3 + (10-8)\*0.4 + (10-9)\*0.3 = 0.6 + 0.8 + 0.3 = **1.7**

## Bevindingen

### 1. Coach-plan vs canvas-stappen desync (platform-patroon, deze missie hoort erbij)

**Locatie:**
- Canvas-config: `src/features/missions/templates/builder-canvas/configs/app-prototyper.ts` — 4 stappen: `probleemanalyse` → `schermen-ontwerpen` → `gebruikersflow` → `testplan`.
- Client-side agent-role fallback: `src/config/agents/year2.tsx:829-845` — 3 stappen: "Gebruikersonderzoek" → "Wireframes Maken" → "Prototype Presenteren".
- Server-side systemInstructions (échte prompt): `supabase/functions/_shared/systemInstructions.ts:58`, STAP-VOLTOOIING-sectie — 3 markers: `STEP_COMPLETE:1` (gebruikersonderzoek), `STEP_COMPLETE:2` (3 schermen + navigatie), `STEP_COMPLETE:3` (prototype presenteren incl. ontwerpkeuzes).

**Probleem:** Het coach-plan dekt canvas-stap 1 (probleemanalyse) en canvas-stap 2 (schermen-ontwerpen) redelijk, maar canvas-stap 3 (`gebruikersflow`) en canvas-stap 4 (`testplan`) worden in het coach-plan samengeperst onder één vage marker "prototype heeft gepresenteerd" — die inhoudelijk niet overeenkomt met "testplan schrijven" (canvas-stap 4 vraagt om testgebruikers, testtaken, feedbackmethode; het coach-plan vraagt om een presentatie van ontwerpkeuzes). Een leerling die in de chat coaching zoekt bij canvas-stap 4 (testplan) krijgt dus een AI-coach die nog op "prototype presenteren" is gericht, niet op testplanning.

**Impact:** Coachingtekst-kwaliteit, geen functionele blocker — de markers zijn functioneel inert voor canvas-voortgang (canvas-eigen checklist bepaalt afronding, niet de chat-marker). Leerling kan de missie volledig voltooien zonder ooit de chat te gebruiken.

**Voorstel (niet automatisch toegepast — coachingtekst, platform-brede beslissing over hoe coach-plannen worden gesynchroniseerd):**

Als dit los van het platform-brede patroon opgelost wordt, zou de server-side STAP-VOLTOOIING-sectie herschreven moeten worden naar 4 stappen die canvas 1:1 volgen:
```
STAP-VOLTOOIING:
- Stuur ---STEP_COMPLETE:1--- als de leerling het gebruikersprobleem heeft beschreven met de 5 W's en een waardepropositie.
- Stuur ---STEP_COMPLETE:2--- als de leerling minimaal 3 schermen heeft beschreven als wireframes, inclusief welk scherm de gebruiker als eerste ziet.
- Stuur ---STEP_COMPLETE:3--- als de leerling 2 gebruikersflows heeft uitgewerkt met minimaal 4 stappen en een fout-flow.
- Stuur ---STEP_COMPLETE:4--- als de leerling een testplan heeft geschreven met testgebruikers, 3 testtaken, feedbackmethode en een verbetering.
```
En de client-side `steps`-array in `year2.tsx:829-845` zou een vierde entry moeten krijgen ("Gebruikersflow Uitwerken", "Testplan Schrijven") in plaats van de huidige 3.

**Status:** ESCALATIE — hangt af van de platform-brede beslissing over coach-plan-sync (zie andere wave-reviews met hetzelfde patroon). Niet autoFixed.

## Voorstel-blokken

Geen autoFixable code-wijzigingen voor deze missie. De enige bevinding (coach-plan-desync) is expliciet uitgesloten van auto-fix per instructie (platform-beslispunt, coachingtekst niet client-systemInstruction).

## Conclusie

App Prototyper is een kwalitatief sterke, volledig geregistreerde missie zonder technische of registratie-gaten. De enige bevinding is de bekende coach-plan/canvas-desync die platform-breed speelt bij builder-canvas-missies — deze missie hoort bij de set die hetzelfde patroon vertoont en zou meegenomen moeten worden als het platform-brede besluit valt.
