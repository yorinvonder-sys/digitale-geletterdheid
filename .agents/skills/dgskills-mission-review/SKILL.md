---
name: dgskills-mission-review
description: Review, audit, visually test, or improve an existing DGSkills learner mission/opdracht across design, didactics, technical implementation, internal-browser behavior, responsive layouts, evidence, and release readiness. Use for "review opdracht", "review missie", browserchecks, a mission ID/title, or one bounded leerjaar-periodebatch. Do not use for creating a new mission or platform-wide compliance.
---

# DGSkills Mission Review - Codex Workspace Skill

Gebruik deze skill als project-lokale orchestrator. Gebruik `gpt-5.6-sol` met `xhigh` voor oordeel, auth/privacy, integratie, release en eindvalidatie. Gebruik Luna alleen voor begrensd, controleerbaar uitvoeringswerk wanneer de gebruiker parallel werk of Luna expliciet toestaat.

## DGSkills Mission Factory v1

Gebruik `docs/agent/dgskills-mission-factory.md` als centrale procesafspraak voor missie-werk. Bij missieverbetering of review hoort de output aan te sluiten op:
- Missie Intake: doel, doelgroep, scope, risico en bewijs.
- Validation Contract: leerdoel, SLO-koppeling, succescriteria en wat niet mis mag gaan.
- Reviewrapport: wat is gecontroleerd, welke browserbewijzen bestaan, wat blijft onzeker.

De rollen blijven gescheiden: de hoofdagent is Regisseur, eventuele subagents zijn Maker of Controleur, en Yorin blijft menselijke eindbeslisser.

Gebruik de opdrachtchecks als uitvoeringslaag:
- `opdracht-live-check` voor de handmatige leerlingplaythrough en evidence.
- `opdracht-ontwerp-check` vóór een ontwerp of herschrijving.
- `opdracht-klaar-check` als brede eindgate.

## Triggerprincipes

Activeer bij reviewen, auditen, verbeteren of visueel controleren van een bestaande DGSkills missie/opdracht.

Niet activeren voor:
- Een nieuwe missie maken
- Platformbrede compliance
- Edge function-review

## Input normaliseren

Accepteer:
- Een `missionId` in kebab-case, bv. `mail-detective`, `cookie-crusher`.
- Een opdrachtverwijzing, bv. `leerjaar 1 periode 3 opdracht 1`.
- Een titel of fragment, bv. `Mail Detective`.

Los de missie op via `src/config/templateRegistry.ts`, `src/config/curriculum.ts`, template-configtitels en handcrafted componentnamen. Vraag alleen verduidelijking als meerdere matches even plausibel blijven.

## Review Workflow

### 1. MissionId valideren

Een missie bestaat als minimaal een van deze checks slaagt:
- Template-missie: `missionId` staat in `src/config/templateRegistry.ts`.
- Handcrafted missie: er is een passende component in `src/features/missions`, exclusief `src/features/missions/templates`.

Ontbrekende SLO- of curriculum-metadata is een reviewbevinding, geen reden om te stoppen.

### 2. Paths resolven

Template:
- `configPath = src/features/missions/templates/<templateType>/configs/<missionId>.ts`
- `enginePath = src/features/missions/templates/<templateType>/<TemplateType>.tsx`

Handcrafted:
- `configPath = null`
- `enginePath = <gevonden Mission component>`

### 3. Reviewperspectieven scheiden

Voer de drie perspectieven gescheiden uit:
- Design: layout, visuele hierarchy, states, responsive gedrag, contrast.
- Didactiek: niveau, cognitieve belasting, feedback, leerdoel, curriculum-fit.
- Tech: componentkwaliteit, types, scoring, routes, regressierisico, testbaarheid.

Gebruik de bestaande rubric-skills als bronmateriaal wanneer beschikbaar:
- `opdracht-live-check`
- `opdracht-klaar-check`
- `dgskills-design-reviewer`
- `dgskills-didactiek-reviewer`
- `dgskills-tech-reviewer`

### 4. Interne Codex-browser opnemen in QA

Gebruik voor deze audit uitsluitend de interne Codex-browser voor zichtbare kliks, screenshots, viewporttests, DOM-inspectie en console-/netwerkobservaties. Gebruik geen los Playwright-proces, Chrome-plugin of Computer Use als stille fallback. Als de interne browser niet werkt, stop en markeer de browserreview als onvolledig.

### 5. Visuele check verplicht bij UI-werk

Bij elke review of verbetering die zichtbare missie-UI raakt:
- Start of hergebruik een lokale dev-server.
- Check minimaal desktop/laptop, tablet/iPad staand, tablet/iPad liggend en mobiel.
- Controleer intro/start, een normale interactieronde, foutfeedback, eind-/doorgangsstaat en eventuele follow-up.
- Plan een tweede missie op een gedeelde engine alleen als regressie in een eigen verse hoofdtaak.
- Noteer expliciet wat dynamisch in de browser is gezien.
- Markeer `Echte iPad-check nodig` als browser-emulatie mogelijk niet genoeg bewijs geeft door Safari- of iPad-specifiek gedrag.

Minimale viewportset:
- Desktop/laptop: normale desktop- of laptopweergave.
- Tablet/iPad staand: 820 × 1180.
- Tablet/iPad liggend: 1180 × 820.
- Mobiel: 390 × 844.

### 5.1 Visual Precision Gate

Elke missie-review moet een expliciete Visual Precision Gate bevatten. Dit is de harde UI-polish check die voorkomt dat functioneel werkende maar rommelig geplaatste interfaces door de review komen.

Controleer via de interne Codex-browser:
- **Alignment:** panels, cards, knoppen, toolbar-items, counters en CTA’s liggen strak en consistent uitgelijnd.
- **Overlap:** tekst, iconen, badges, controls, modals, canvas/game-area en feedback overlappen elkaar nergens.
- **Text-fit:** alle knoplabels, cards, badges, feedbackteksten en instructies passen zonder clipping of overflow.
- **Spacing-rhythm:** padding/gaps voelen consistent en esthetisch; geen willekeurige lege gaten of te krappe UI.
- **Game/canvas-fit:** bij games of interactieve previews is het volledige game/canvas/previewvlak zichtbaar en blijven score, controls en actieknoppen bruikbaar.
- **Volledige flow:** intro/start, mid-flow, fout/feedbackstaat, eind-/klaarstaat en eventuele follow-up zijn bekeken op desktop/laptop, tablet/iPad staand, tablet/iPad liggend en mobiel. Eén screenshot of alleen de startstaat is onvoldoende.

Blocking:
- overlap of afgesneden tekst;
- game/canvas valt buiten beeld;
- CTA of voortgangsknop is niet zichtbaar/tappable;
- interactieve game/opdracht is niet als volledige flow gecontroleerd;
- visuele claims zonder intern-browserbewijs.

Als de browsercheck niet lukt, ga niet stil verder. Noteer de blocker en geef aan welke delen static-only zijn beoordeeld.

### 6. Subagents binnen Codex

Als de gebruiker expliciet subagents of parallelisatie wil:
- Behandel precies één missie in één hoofdtaak. Start de volgende pas in een verse taak nadat rapport, bewijs, fixes en status van de huidige missie zijn afgerond.
- Gebruik maximaal drie `gpt-5.6-luna`-workers: één muterende productieleerlingflow, één side-effectvrije desktop/iPad-portretflow en één side-effectvrije iPad-landschap/mobielflow plus afgebakende reviewtaken.
- Laat slechts één worker productievoortgang of XP muteren; laat de andere viewports `/dev/mission-preview` gebruiken op exact dezelfde schone commit.
- Serialiseer login/logout, authwissels, completion en screenshots. Stop bij onverwachte identiteit of voortgangsstaat.
- Laat Sol `xhigh` planning, auth/privacy, Supabase, integratie, release en eindvalidatie bezitten. Gebruik nooit Terra.

### 7. Rapport of verbeterplan

Voor een reviewrapport:
- Schrijf Nederlands.
- Geef topbevindingen met file:regel.
- Scheid design, didactiek en tech.
- Vermeld intern-browserbewijs per formaat: desktop/laptop, tablet/iPad staand, tablet/iPad liggend en mobiel. Als iPad/Safari-specifiek gedrag niet echt op iPad is getest, markeer `Echte iPad-check nodig`.

Voor implementatie na review:
- Geef vooraf Plan / Risk / Likely files / Proof volgens `AGENTS.md`.
- Hou wijzigingen klein.
- Verifieer met `npm run doctor`, waar passend `npm run build`, browsercheck desktop/laptop + tablet/iPad staand + tablet/iPad liggend + mobiel, en regressie op een tweede gedeelde-template missie.

## Anti-patronen

- Geen visuele claims zonder intern-browserbewijs.
- Geen browsercheck overslaan nadat de gebruiker er expliciet naar vraagt.
- Geen subagent brede of risicovolle beslissingen laten nemen.
- Geen twee workers tegelijk productievoortgang laten muteren.
- Geen unieke browser-ID als bewijs van een geïsoleerde cookiejar presenteren.
- Geen stil model-, browser- of accountfallback.
- Geen tijdelijke QA-routes of harnesses achterlaten.
- Geen orphan dev-server processen laten draaien.
