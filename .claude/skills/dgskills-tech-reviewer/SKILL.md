---
name: dgskills-tech-reviewer
description: Rubric-reference voor DGSkills missie technische review. Wordt als instructie-set gelezen door een general-purpose sub-agent die door de dgskills-mission-review orchestrator gespawned is — niet bedoeld om zelfstandig via Skill-tool aan te roepen. Bevat static code-criteria (knop-handlers, error states, TypeScript-discipline, security) plus dynamic web-verificatie loop (Claude_in_Chrome screenshots + F12 console + network + backend logs via Vercel + Supabase MCP).
user-invocable: false
disable-model-invocation: true
---

# DGSkills Tech Reviewer — Static + Dynamic verificatie

Je bent de **tech-sub-reviewer** in de M2 review-pipeline. Je doet zowel **static code-analyse** als **dynamic web-verificatie** (echte browser, console, network, backend logs). Sonnet-niveau reasoning is vereist — bug-detectie + edge-case denken.

## Input (van orchestrator)

```
{
  missionId: string,
  templateType: string,
  configPath: string,
  enginePath: string,
  sloEntry: KerndoelMissionMeta,
  curriculumLocation: { yearGroup: number, period: number }
}
```

## Stappenplan — twee fases

### Fase A — Static code-analyse (altijd)

#### Stap A1 — Lees de relevante files

**Twee takken afhankelijk van `templateType`:**

**Template-missies (`templateType !== "handcrafted"`):**
1. `configPath` — content + handler-koppelingen
2. `enginePath` — engine-component (template-renderer)
3. Eventueel relevante hooks/services die de missie aanroept (zoek met Grep)

**Handcrafted missies (`templateType === "handcrafted"`):**
1. `configPath` is `null` — overslaan, géén poging om hem te lezen
2. `enginePath` is **het hele missie-component** (zelfstandig, geen template-renderer) — primaire bron voor static analyse van handlers, error states, TypeScript-discipline en security
3. Eventueel relevante hooks/services die het component importeert (Grep op `import` statements in `enginePath`)

#### Stap A2 — Static criteria

Voor elk: pass/fail/warn + file:regel.

#### Handcrafted-overrides (Fase A)

Voor `templateType === "handcrafted"` gelden onderstaande afwijkingen op de static criteria:

- **Bron van code:** alle handler-koppelingen, state, UI zit in het component (`enginePath`); geen separation tussen config en engine. Alle Fase A-criteria (A1-A7) draaien op deze ene file plus geïmporteerde hooks/services.
- **Criterium A5 (Edge function calls):** scan `enginePath` voor `supabase.functions.invoke` of equivalente client-side AI-calls; check try/catch + error-state.
- **Criterium A6 (Restart-safe state):** check of component direct `useMissionAutoSave` aanroept (geen template-laag tussen).
- **Criterium A7 (Security-checks):** sanitization-pattern moet inline of via geïmporteerde hook in component aanwezig zijn — niet via template-laag.

**Criterium A1: Knop-handlers gekoppeld**
- ✅ Elke `<button>` of klikbaar element heeft een functionele `onClick`
- ❌ **Dode knop** — `onClick={() => {}}` of leeg
- ❌ **Klikbaar element zonder handler** — div met `cursor-pointer` zonder `onClick`

**Criterium A2: Error states aanwezig**
- ✅ Loading-state zichtbaar tijdens async-operaties
- ✅ Error-state met user-friendly bericht (niet raw error message)
- ✅ Empty-state als data leeg is (bv. "nog geen rondes")
- ❌ Async zonder loading/error handling

**Criterium A3: TypeScript-discipline**
- ✅ Geen `any` types (zoek `: any`, `as any`)
- ✅ Geen `// @ts-ignore` of `// @ts-expect-error` zonder reden-comment
- ✅ Interfaces voor props in `types/` of inline expliciet
- ❌ Impliciete `any` op props/state

**Criterium A4: Imports via `@/*` alias**
- ✅ Imports via `@/components/...`, `@/services/...`
- ❌ Relatieve `../../components/...` paden

**Criterium A5: Edge function calls graceful**
- ✅ Try/catch rond `supabase.functions.invoke(...)` of equivalent
- ✅ Network errors leiden tot user-friendly state (niet raw fetch-error)
- ❌ Unhandled promise rejection
- ❌ Edge function output rauw aan DOM (XSS-risico)

**Criterium A6: Restart-safe state**
- ✅ Voortgang-opslag via `useMissionAutoSave` of vergelijkbaar pattern
- ⚠️ Lokale state zonder persistence — leerling verliest werk bij refresh

**Criterium A7: Security-checks (DGSkills-specifiek)**
- ✅ User input naar AI gaat door `promptSanitizer`
- ✅ Geen `dangerouslySetInnerHTML` met leerling-input
- ✅ `systemInstruction` server-side bepaald (via `roleId`)
- ❌ Client-side `systemInstruction` definitie

### Fase B — Dynamic web-verificatie (indien dev-server beschikbaar)

⚠️ Fase B is optioneel — alleen draaien als orchestrator een dev-server heeft opgestart, of expliciet kan starten. Bij twijfel: skip Fase B en noteer "dynamic verificatie niet uitgevoerd — geen dev-server".

#### Stap B1 — Dev-server URL valideren

Gebruik `devServerUrl` uit de input van de orchestrator (Stap 2.5 heeft de server gestart).

- Als `null`: skip Fase B volledig en noteer: "Dynamic verificatie: dev-server niet beschikbaar".
- Als string (bv. `http://127.0.0.1:3000`): verifieer met `curl -s -o /dev/null -w "%{http_code}" $devServerUrl` dat het 200 retourneert. Bij andere status: skip Fase B.

**Niet zelf `npm run dev` starten** — dat is verantwoordelijkheid van de orchestrator (port-conflicts + cleanup-discipline).

#### Stap B2 — Multi-viewport visuele verificatie

**Verplichte browser-tool:** voer deze stap uit via de **Codex Chrome plugin/extension**: **"Chrome — Control Chrome with Codex"**. Gebruik de echte Chrome-plugin voor navigeren, klikken, screenshots, viewport-resizes, console en network-observaties. Gebruik niet stilletjes de Codex in-app browser, headless Playwright of een generieke browser als vervanging. Als de Chrome-plugin niet beschikbaar is, probeer eerst de pluginverbinding te herstellen; lukt dat niet, noteer exact:

> "Chrome-plugin verificatie niet uitgevoerd — blocker: <concrete foutmelding>."

Markeer in dat geval alle visuele/dynamische claims als unverified.

Voor elke combinatie van **3 viewports × 3 missie-states** = 9 screenshots per missie:

| Viewport | Breedte × hoogte | Doelgroep |
|---|---|---|
| **Mobiel** | 375 × 667 | iPhone SE, Android phone (zeer relevant — leerlingen op telefoon) |
| **Tablet** | 768 × 1024 | iPad portrait, Chromebook landscape (zeer relevant — schoolapparaten) |
| **Desktop** | 1280 × 800 | laptop / monitor (docent-view, leerling met externe monitor) |

**Workflow per viewport:**

1. Open of claim een tab via de Codex Chrome plugin/extension (of hergebruik bestaande Chrome-plugin tab)
2. Resize de Chrome-plugin viewport/window met width + height van de viewport
3. **Belangrijke architectuur-realiteit:** DGSkills gebruikt **state-based routing** (geen URL per missie). `AuthenticatedApp.tsx` selecteert de actieve missie via een `activeModule` state-variable plus `TemplateMissionRouter` voor template-missies. Er bestaat **geen** `/missions/<id>` URL.

   Dat betekent: directe `navigate` naar een missie-URL werkt **niet** in deze repo. Stappenplan:

   a. **Check of er een dev-preview route bestaat** — grep op `/dev/mission` of `?missionId=` of vergelijkbare query-string-routes in `App.tsx`/`AppRouter.tsx`. Sommige projecten hebben een non-prod render-pad die zonder auth werkt.

   b. **Als geen dev-preview route bestaat:** Fase B is in deze repo **niet werkbaar** zonder dat Yorin eerst een dedicated dev-render route toevoegt. Skip Fase B met deze exacte note in output:

      > "Multi-viewport visuele verificatie niet uitgevoerd — DGSkills SPA is state-based (geen URL per missie). Voor automatische Fase B is een dev-preview route (bv. `/dev/mission/<id>` met auth-bypass in `import.meta.env.DEV`) een follow-up taak."

   c. **Als wel een dev-preview route bestaat:** gebruik die.

   d. **Auth via login simuleren is uitgesloten** — credentials in code/skills is een security-risico en niet in scope.

4. Indien werkbare URL gevonden: navigeer met de Chrome-plugin naar die route. Anders: skip Fase B per stap 3b.
4. **State 1 — Intro:** wacht 1s op render, neem screenshot — ID = `intro-mobiel` / `intro-tablet` / `intro-desktop`
5. **State 2 — Mid-flow:** gebruik de Chrome-plugin om interactieve elementen te vinden, klik ongeveer 50% van de rondes door. Screenshot — ID = `midflow-<viewport>` (overslaan als auth blokkeerde)
6. **State 3 — Eind:** klik resterende rondes door tot eind-scherm of completion-state. Screenshot — ID = `eind-<viewport>` (overslaan als auth blokkeerde)

Plus **per viewport** verzamelen:
- Chrome-plugin console-observaties met `onlyErrors: true`
- Chrome-plugin network-observaties met filter status >= 400

Output: dictionary met 9 screenshot-IDs + 3 sets console-logs + 3 sets network-failures.

#### Stap B3 — Multi-viewport criteria toepassen

Naast de standaard criteria (B1-B4 hieronder), specifiek voor multi-viewport:

**Criterium B0: Visual Precision Gate evidence**

De tech-reviewer moet harde Chrome-plugin evidence leveren voor de UI-polish die de design-reviewer en orchestrator later beoordelen. Dit is geen vrijblijvende screenshotronde.

Per viewport én per state controleer en rapporteer:
- **Alignment:** belangrijke edges/kolommen/knoppen/panels/counters liggen logisch uitgelijnd.
- **Overlap:** geen tekst-overlap, icon-overlap, badge-overlap, modal-overlap of canvas/control-overlap.
- **Text-fit:** labels, knoppen, cards, badges en feedbacktekst passen binnen hun containers.
- **Game/canvas-fit:** bij games, previews en interactieve simulaties past het volledige spel/canvas/previewvlak in beeld; score, controls en CTA blijven zichtbaar.
- **Volledige flow:** intro/start, mid-flow, fout/feedbackstaat, eindstaat en eventuele “klaar/volgende” toestand zijn doorgeklikt. Een enkele rendercheck is onvoldoende.

Maak een `Visual Precision Gate` resultaat in de tech review:
- `PASS`: alle viewports + states gecontroleerd via Chrome-plugin, geen overlap/alignment/text-fit/game/canvas-fit issues.
- `WARN`: één state of viewport ontbreekt, maar geen zichtbaar breukbewijs.
- `BLOCKING`: overlap, afgekapt tekstvlak, niet-tappable CTA, buiten beeld vallend game/canvas, of niet-geteste gameflow bij een game/opdracht met interactie.

**Criterium B5: Layout-integriteit per viewport**
- ✅ **Mobiel (375px):** geen horizontale scroll, knoppen tappable (>=44px hoogte), tekst leesbaar zonder zoom, geen overlapping elementen
- ✅ **Tablet (768px):** layout adaptief (geen wasted whitespace, geen mobile-only stacking), interactieve elementen passend
- ✅ **Desktop (1280px):** geen overstretched containers, content gecenteerd of natuurlijk uitgevuld, geen pixel-perfect issues
- ❌ **Layout breekt** op één of meerdere viewports — flag met screenshot-ID als bewijs

**Criterium B6: Cross-viewport consistentie**
- ✅ Inhoud is identiek op alle viewports (geen content gehidet op mobiel)
- ✅ Knop-clarity blijft op alle viewports
- ⚠️ Functioneel verschil tussen viewports (bv. carousel op mobiel vs grid op desktop) — flag als context, niet als fout

#### Stap B4 — Lees browser-console

Lees browser-console via de Codex Chrome plugin met:
- `onlyErrors: true` — vlag alle errors
- Daarna `onlyErrors: false` met pattern voor warnings — kies relevante

Bewaar alle errors/warnings als bewijs.

#### Stap B5 — Lees network requests

Lees network requests via de Codex Chrome plugin met:
- `urlPattern` voor de eigen API/Supabase calls
- Filter op status >= 400 → flag als failure

Bewaar de URL + status + request-body (als zichtbaar) als bewijs.

#### Stap B6 — Backend logs

Voor elke API-call in stap B5:
1. **Vercel runtime logs:** `mcp__claude_ai_Vercel__get_runtime_logs` of equivalent — zoek errors in de tijdvenster van de sessie
2. **Supabase logs:** `mcp__supabase__get_logs` met service="edge-function" — zoek errors voor de functie die werd aangeroepen

Match: een 500-status in browser-network correleert met een log-entry in Vercel/Supabase. Citeer beide.

#### Stap B7 — Dynamic criteria

**Criterium B1: Geen console errors**
- ✅ Console toont geen `[error]` of `[warn]` tijdens leerling-flow
- ❌ React errors (key warnings, hook violations)
- ❌ TypeError of ReferenceError tijdens interactie

**Criterium B2: Geen network failures**
- ✅ Alle requests status 200-299 of 304
- ❌ 4xx (client error in onze code)
- ❌ 5xx (backend error — koppel aan backend log)

**Criterium B3: Backend graceful**
- ✅ Edge function logs tonen geen unhandled errors
- ✅ Supabase RLS toestaat de leerling-actie
- ❌ Edge function crash of timeout
- ❌ RLS-block (leerling kan eigen data niet lezen)

**Criterium B4: Visuele integriteit**
- ✅ Screenshots tonen functionerende UI in elke state (intro/mid-flow/eind)
- ❌ Lege schermen, broken images, overlapping elements

### Stap C — Bouw output-sectie

Format:

```markdown
## 🔧 Tech review

**Mission:** {missionId} ({templateType})
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** {uitgevoerd / overgeslagen — reden}

### Static analyse
#### ✅ Geslaagd
- {criterium}: {reden + file:regel}

#### ⚠️ Aandachtspunten
- **{criterium}**: {wat is er mis} — `{file}:{regel}`
  - **Wat:** {observatie}
  - **Risico:** {wat kan er fout gaan voor de leerling}
  - **Voorstel:** {concrete fix}

#### ❌ Blocking issues
- (dode knoppen, security-gaten, RLS-bypass, etc.)

### Dynamic verificatie (indien uitgevoerd)
#### Console-output
- Errors: {aantal} — {samenvatting + screenshot-bewijs}
- Warnings: {aantal} — {samenvatting}

#### Network-failures
- Failed requests: {lijst met URL + status + tijdstip + request-body als zichtbaar}
- Backend-correlatie: {Vercel/Supabase log-snippet die match}

#### Visuele bewijslast
- Screenshot intro-state: {screenshot-id of pad}
- Screenshot mid-flow: {id}
- Screenshot eind-state: {id}

### Score
Static: {X}/{totaal} · Dynamic: {Y}/{totaal} of "n.v.t." · Aanbeveling: ship / fix-eerst / kritieke fix vereist
```

## Bewijslast-regels

- **File:regel anchor** voor elke static-bevinding
- **Screenshot-ID + console-snippet + log-snippet** voor dynamic
- **Concrete reproductie-stap** — "klik knop X → console toont error Y" niet "soms geeft de pagina errors"

## Aanpassings-voorstellen — proportioneel

**Default:** beknopt voorstel per bevinding (1 regel uitleg of korte code-snippet). De meeste bugs lossen zich op met minimale fixes; wees niet onnodig ingrijpend.

**Alleen wanneer noodzakelijk** — als een issue niet met een kleine fix oplosbaar is — escaleer naar daadkrachtige voorstellen:

- **Concrete `before`/`after` code-snippets** met exacte inhoud uit de gereviewde missie (Read tool gebruiken, geen verzonnen voorbeelden):
  ```ts
  // ❌ Huidig — <file:regel uit jouw analyse>
  <... daadwerkelijke code-zoals-aangetroffen ...>

  // ✅ Voorgesteld
  <... concrete vervanging ...>
  ```
- **Substantiële refactors** wanneer een patroon fundamenteel onjuist is — bv. `any` in shared types, missende error-state machine, of security-issue (XSS, prompt-injection). Geef het complete alternatief als code-blok, niet alleen een naam ("gebruik DOMPurify").
- **Volgorde + scope** bij multi-laag fixes: "minimum-fix (~N regels) + structureel (~M regels) + cross-impact (~K files)". Alleen voor refactors die meerdere files raken — niet voor enkelvoudige bugs.
- **Verwerping met alternatief** bij fundamentele fouten (bv. client-side `systemInstruction` is een hard-no — geef de server-side alternative als code).

Format-regel: bij **echt ingrijpende** bevindingen eindigt het voorstel met een **Voorstel-blok** (file:regel + before + after + scope-schatting) dat een fixer-agent direct kan toepassen. Voor kleine bugs is een korte tekst-regel voldoende.

## Anti-patronen (NOOIT)

- ❌ `npm run dev` starten zonder dat orchestrator dat heeft gevraagd
- ❌ Long-running processes vergeten te killen
- ❌ Screenshots maken zonder ze in het rapport te referentieren
- ❌ Backend-logs claimen zonder Vercel/Supabase MCP te hebben gebruikt
- ❌ Subjectief oordeel — "voelt traag" is geen tech-bevinding zonder timing-data
- ❌ Compliance-check overdoen — RLS-correctheid is voor `dgskills-compliance-check`; jij flagt RLS-blocks die leerling-flow breken
- ❌ Engelse output naar Yorin
- ❌ Console-warnings als blocking flagen — alleen errors zijn blocking; warnings zijn aandachtspunten

## Wanneer escaleren

- **Security-vulnerability gevonden** (XSS, injection, exposed secret) — flag als BLOCKING en alarmeer in samenvatting
- **RLS-bypass** mogelijk — flag voor `dgskills-compliance-check` follow-up
- **Edge function crash** — flag voor `dgskills-supabase-edge` follow-up
- **TypeScript build error** — moet door tech-reviewer zelf gefixt worden vóór ship

## Referenties

- Detail-plan: `~/.claude/plans/m2-mission-review-pipeline.md`
- Web-verificatie tools: Codex Chrome plugin/extension ("Chrome — Control Chrome with Codex")
- Backend MCP's: Vercel (`mcp__claude_ai_Vercel__*`), Supabase (`mcp__supabase__*`)
- Orchestrator: skill `dgskills-mission-review`
- Zusters: `dgskills-design-reviewer`, `dgskills-didactiek-reviewer`
- Edge function patterns: skill `dgskills-supabase-edge`
