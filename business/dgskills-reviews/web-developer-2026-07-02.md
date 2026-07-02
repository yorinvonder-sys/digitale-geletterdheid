# Missie-review: Web Developer

**Mission ID:** web-developer
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 2, Periode 2 (Programmeren & Computational Thinking)
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 20, verse review — laatste wave)

---

## Registratie-check (10-punts patroon)

| Bron | Status | Bewijs |
|---|---|---|
| Config | ✅ | `src/features/missions/templates/builder-canvas/configs/web-developer.ts` |
| Agent-rol (year2.tsx) | ✅ | `src/config/agents/year2.tsx:685` |
| `AGENT_ROLE_IDS` | ✅ | `src/config/agentRoleIds.ts:54` |
| `curriculum.ts` | ✅ | `src/config/curriculum.ts:182` — Leerjaar 2, Periode 2, sloFocus `21A/22A/22B/23A` bevat de geclaimde codes |
| `slo-kerndoelen-mapping.ts` (autoritair) | ✅ | `src/config/slo-kerndoelen-mapping.ts:111` — `22A`, `22B` (regulier), `19A` (VSO) |
| `missionGoals.ts` | ✅ | `src/config/missionGoals.ts:544-552` — primaryGoal/criteria/evidence consistent met config (`min: 4` = 4 stappen) |
| `basisvaardigheden-mapping.ts` | ✅ | `src/config/basisvaardigheden-mapping.ts:390-396` — SCHRIJFVAARDIGHEID + LOGISCH_REDENEREN, passend bij content-schrijven + HTML/CSS-structuur |
| `missionThumbnails.ts` | ✅ | `src/config/missionThumbnails.ts:52` |
| `templateRegistry.ts` | ✅ | `src/config/templateRegistry.ts:48` — `chatRoleId: 'web-developer'`, `enableChat: true` |
| `chatRoleId` ↔ config | ✅ | config regel 26: `chatRoleId: 'web-developer'` matcht registry |

Geen desyncs gevonden — alle registratiepunten kloppen.

**Platform-observatie (context, geen fout):** de instructie voor deze review noemt "nu 7 missies" op builder-canvas met de vraag of dit de 8e is. Feitelijk telt de configs-map 19 builder-canvas-missies (incl. `web-developer`). Dit is puur een verouderde aanname in de review-briefing, geen bevinding over de missie zelf.

---

## 🎨 Design review

**Score: 7/10**

### ✅ Geslaagd

- **Duck-tokens correct in de gedeelde engine:** `BuilderCanvas.tsx` en `sub/*.tsx` gebruiken uitsluitend `duck-ink`, `duck-acid`, `duck-gray` — binnen de toegestane 6-token-set. Config zelf bevat geen inline styling (correct — content-config hoort stijl-vrij te zijn).
- **Badges met oplopende, coherente drempels** (`0/25/50/70/90`) en titels die passen bij de webdev-context ("Code Knutselaar", "Full Stack Hero").
- **`text-preview`-type is een consistente, functionele keuze** voor een missie waar de output tekst (HTML/CSS/JS-code als geschreven antwoord) is, niet een visueel artefact.

### ⚠️ Aandachtspunten

- **Gemiste kans: geen live HTML/CSS-preview, terwijl deze missie er conceptueel het meest om vraagt** — `PreviewPanel.tsx:44` toont dat alleen `website-bouwer` een missie-specifieke iframe-preview (`config.missionId === 'website-bouwer'`) krijgt van de door de leerling geschreven HTML/CSS. `web-developer` — de missie die expliciet HTML + CSS + JavaScript combineert tot een "interactieve webpagina" — krijgt alleen `previewType: 'text-preview'`. Een leerling schrijft hier CSS Grid-code en een JavaScript `addEventListener`-functie zonder ooit visueel te zien of het werkt.
  - **Wat:** de leerervaring "ik bouw een website" mist het "en zie hem live" onderdeel dat `website-bouwer` (leerjaar 1, eenvoudiger scope) wél heeft.
  - **Waarom:** voor een leerjaar-2-missie die zichzelf presenteert als "een stap verder dan HTML en CSS" (regel 9) is het ontbreken van visuele feedback een gemiste didactische versterking — juist bij JavaScript-DOM-manipulatie is "zie het gebeuren" krachtiger dan "beschrijf wat er zou moeten gebeuren".
  - **Voorstel:** niet-blocking voor deze review (vereist wijziging aan gedeelde `PreviewPanel.tsx`, buiten de scope van een contentconfig-only fix). Voorstel voor een vervolgtaak: generaliseer de `website-bouwer`-specifieke check naar een config-flag (bv. `enableHtmlPreview: true`) en zet die ook aan voor `web-developer`, aangezien beide missies vergelijkbare vrije-tekst-HTML/CSS-instructies gebruiken.
- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass, en `web-developer` wordt niet genoemd in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 treffers). Statische analyse toont geen evident overlap-/afkap-risico in de gedeelde engine; een dynamische Chrome-plugin-pass ontbreekt voor deze specifieke missie.

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 8/10**
**SLO-claim:** 22A, 22B (regulier) · 19A (VSO)

### ✅ Geslaagd

- **Concreet, motiverend leerdoel met realistische probleemcontext:** "Een lokale dierenasiel heeft geen website en loopt daardoor adoptieaanvragen mis" (curriculum.ts:692) — geen kunstmatige oefening, herkenbare maatschappelijke aanleiding.
- **Sterke scaffolding, logische opbouw:** HTML-structuur → CSS-layout → JavaScript-interactie → testen. Elke stap bouwt voort op de vorige (dezelfde pagina wordt uitgebreid), consistent met hoe echte webontwikkeling werkt.
- **Technisch correcte, leeftijdspassende uitleg van complexe begrippen:** de systemInstruction gebruikt een doorlopende bouw-metafoor ("HTML = de muren, CSS = de verf, JavaScript = de elektriciteit") die abstracte programmeerconcepten tastbaar maakt voor 13-14-jarigen zonder de technische juistheid te verliezen.
- **Expliciete "coach, geen antwoordenmachine"-discipline:** systemInstruction (year2.tsx / systemInstructions.ts:57) instrueert "Geef COMPLETE werkende code die de leerling direct kan testen" én bouwt op via de 3-stappen-methode (Erkenning/Uitleg/Challenge) — AI ondersteunt, doet niet het denkwerk voor de leerling.
- **Testen als expliciete didactische stap (Bloom: evalueren):** stap 4 vraagt niet alleen "test je pagina" maar "3 testscenario's + 1 concrete verbetering + uitleg hoe je een niet-werkende JS-functie zou debuggen" (config regel 81) — een sterke afsluitende stap die verder gaat dan kale onthoud-/toepas-vragen; goede Bloom-balans over de hele missie (toepassen in stap 1-3, analyseren/evalueren in stap 4).
- **`addEventListener` boven inline `onclick` als expliciet leerdoel** (checklistItem `event-listener`, config regel 69) — leert een best-practice, niet alleen "iets dat werkt". Didactisch een net iets hoger niveau dan een missie die alleen "voeg interactiviteit toe" zou vragen.
- **Copy-lengte ruim binnen leerjaar-2-normen:** introDescription 38 woorden (norm <80), instructies 44-58 woorden per stap (norm <60) — geen cognitieve overload.
- **Coach-plan-congruentie:** systemInstruction beschrijft exact dezelfde 3-fasen-opbouw (HTML → CSS → JavaScript) als de 4 config-stappen (de 4e stap "testen" is een natuurlijke afronding zonder eigen coach-fase-vermelding, wat consistent is — geen desync gevonden).

### ⚠️ Aandachtspunten

- **SLO 22A-fit blijft grotendeels impliciet in het "digitale product"-aspect:** 22B (programmeren/JavaScript-logica) wordt zeer direct geraakt. 22A (doelgericht een digitaal product ontwerpen) is aanwezig via de probleemschets (asiel zonder website) maar de config-stappen zelf benoemen nergens expliciet "voor wie is deze pagina bedoeld en wat moet een bezoeker ermee kunnen" als reflectievraag — het productdoel blijft impliciet in de briefing, niet uitgewerkt in een stap.
  - **Voorstel (niet-blocking):** één zin toevoegen aan stap 1 (`html-structuur`) of de `instruction`: "Bedenk ook: wat wil een bezoeker van deze pagina kunnen doen — dieren bekijken, adopteren, contact opnemen?" Dit maakt het productdoel-denken (22A) expliciet zonder de stap te verzwaren.
- **Geen expliciete doorverwijzing/waarschuwing bij het testen-onderdeel over echte gebruikers-toegankelijkheid** — stap 4 vraagt testscenario's maar geen enkel scenario richt zich op toegankelijkheid (bv. "werkt de pagina met een screenreader?"), terwijl stap 1 semantische HTML wél als toegankelijkheidsargument noemt ("helpt screenreaders om je pagina te begrijpen", regel 36). Kleine gemiste kans om dat principe in stap 4 terug te laten komen.
  - **Voorstel (niet-blocking, optioneel):** voeg een vierde suggestie toe aan de tip van stap 4: "Test ook of je pagina met alleen het toetsenbord te bedienen is."

### ❌ Blocking issues

Geen.

---

## 🔧 Tech review

**Score: 8/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope; `web-developer` ontbreekt in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`).

### ✅ Geslaagd

- **Registratie 100% compleet** (zie tabel bovenaan) — alle 10 platform-bouwstenen aanwezig en consistent.
- **`maxScore: 100` consistent met `steps-complete, min: 4`** — 4 stappen, standaard builder-canvas-puntentelling, geen scoreplafond-mismatch.
- **4 unieke stap-ids, 4 checklistItems-blokken** — geen duplicaten, 1-op-1 match tussen stappen en checklists.
- **Server-side systemInstruction correct bepaald via `roleId`** (`supabase/functions/_shared/systemInstructions.ts:57`) — géén client-side prompt-definitie in de config zelf (config bevat alleen content, geen AI-instructies) — voldoet aan criterium A7.
- **Platform chat-prompt dekking compleet, inclusief education-level-variant:** naast de standaard `web-developer`-prompt bestaat ook `web-developer__mavo` (systemInstructions.ts:104) met vereenvoudigde huis-metafoor en kleinere stapjes ("Maximaal 3 nieuwe dingen per stap") — dit is bredere dekking dan bij veel andere missies; geen drift tussen varianten gevonden (beide volgen dezelfde 3-fasen-opbouw en 3-stappen-coachingmethode).
- **Geen `STEP_COMPLETE`-functionele afhankelijkheid in de engine** — bevestigd via `BuilderCanvas.tsx`: de marker-tekst in de systemInstruction is coaching-copy, geen functionele state-trigger (bekend platform-patroon, hier geen probleem).
- **`chatRoleId` correct gekoppeld** aan `enableChat: true` — chat is actief, niet dormant.

### ⚠️ Aandachtspunten

- **Geen automatische code-validatie van leerling-antwoorden** (bijv. of geschreven "HTML" daadwerkelijk `<nav>`/`<header>` bevat) — checklistItems zijn zelfrapportage, niet code-geparsed. Dit is een bekend, platform-breed builder-canvas-patroon (zelfde als bij `website-bouwer`), geen missie-specifiek gebrek.
- **Zie Design-sectie: ontbrekende live-preview is ook een gemiste tech-mogelijkheid** — de sandbox-infrastructuur voor veilige HTML/CSS-preview bestaat al in `PreviewPanel.tsx` (gebruikt door `website-bouwer`, incl. `sandbox=""` + CSP + tag-stripping) maar is niet gegeneraliseerd naar deze missie. Puur technisch is dit klaar voor hergebruik zodra de conditional naar een config-flag wordt omgezet — geen nieuwe beveiligingsinfrastructuur nodig.

### ❌ Blocking issues

Geen.

---

## Samenvatting

- **Geslaagd:** design 3/5 · didactiek 7/9 · tech 6/8 substantiële criteria
- **Blocking:** 0
- **Resterende issues:** 1 design (gemiste live HTML/CSS-preview, platform-breed generaliseerbaar patroon) · 2 didactiek (22A-productdoel impliciet, toegankelijkheid niet terugkerend in testfase) · 2 tech (zelfrapportage i.p.v. code-validatie — platform-breed; live-preview-infrastructuur bestaat al maar niet hergebruikt)
- **Sterkste punt:** de didactische opbouw (HTML → CSS → JavaScript → testen) met een expliciete debug-/evaluatie-afsluiting in stap 4 en een dekkende mavo-variant van de coach-prompt — solide, leeftijdspassend en technisch feitelijk correct.
- **Belangrijkste verbeterkans (niet-blocking):** de bestaande sandbox-preview-infrastructuur (nu exclusief voor `website-bouwer`) generaliseren naar een config-flag zodat `web-developer` — de meest voor-de-hand-liggende tweede kandidaat — leerlingen ook een live resultaat laat zien. Dit raakt de gedeelde `PreviewPanel.tsx`, dus buiten scope van een contentconfig-only autoFix.

**Triage-score:** (10-7)×0.3 + (10-8)×0.4 + (10-8)×0.3 = 0.9 + 0.8 + 0.6 = **2.3** (laag = gezond)

**Verdict: ship**

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 20) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Score en verdict zijn ruim boven de ship-drempel; Codex-gate niet noodzakelijk vóór release, wel aanbevolen als onderdeel van een periodieke platform-brede adversarial sweep — met name voor de cross-missie `PreviewPanel.tsx`-generalisatie-suggestie hierboven.
