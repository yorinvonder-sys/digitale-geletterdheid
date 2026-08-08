---
name: dgskills-mission-review
description: Review, audit, visually test, or improve an existing DGSkills learner mission/opdracht across design, didactics, technical implementation, internal-browser behavior, responsive layouts, evidence, and release readiness. Use for "review opdracht", "review missie", browserchecks, a mission ID/title, or one bounded leerjaar-periodebatch. Do not use for creating a new mission or platform-wide compliance.
---

# DGSkills Mission Review - Codex Workspace Skill

Gebruik deze skill als project-lokale orchestrator. Werk tokenzuinig: laat Luna standaard het begrensde, controleerbare uitvoeringswerk doen en reserveer Sol voor integratie, gevoelige beslissingen en het eindverdict. Sol blijft altijd verantwoordelijk voor de uiteindelijke releasebeslissing.

Pas vóór elke coherente slice de routinggate toe:
- **Luna medium:** standaard voor inventarisatie, config-/broninspectie, contextpakketten, rapportvoorbereiding en normale vier-viewport-previewchecks.
- **Luna high:** alleen voor een begrensde maar aantoonbaar lastige browserflow, omvangrijke statische inspectie of onverklaarde lokale fout met een goedkope verificatieroute.
- **Luna xhigh:** toegestaan voor veel maar omkeerbaar, side-effectvrij en zelfstandig verifieerbaar uitvoeringswerk, zoals lange lokale previewflows of evidencecollectie. Gebruik Luna xhigh nooit voor productiecompletion, auth/privacy, severity-integratie of release.
- **Sol medium:** integratie van Design → Didactiek → Techniek, severitycontrole, fixscope en missieverdict.
- **Sol xhigh:** uitsluitend voor Rood-gates zoals QA-account/auth, Supabase/privacy, productiecleanup en het definitieve releasebesluit.

Gebruik geen Terra. Verhoog Luna niet automatisch: kies eerst het model en daarna het laagste toereikende thinkingniveau. Escaleer naar Sol zodra ambiguïteit, koppeling, gevoelige data of release-impact de reden voor dieper denken is.

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
- Leg geen vaste numerieke bovengrens op aan `gpt-5.6-luna`-workers. Dispatch zoveel Luna-agents parallel als de runtime toelaat en als er zelfstandig verifieerbare slices beschikbaar zijn; brede Luna-parallelisatie is de voorkeursroute voor snelheid en lager Sol-verbruik.
- Deze regel vervangt oudere vaste caps zoals “maximaal drie workers” en “één missie per hoofdtaak”. In een periodebatch mag één worker per missie/slice parallel draaien; Sol houdt één batchbrede integratietaak.
- Verdeel een periodebatch bij voorkeur per missie, gedeelde engine, rubric of side-effectvrije viewportset. Geef iedere worker een klein contextpakket, expliciete outputlimiet en eigen bewijsdoel. Splits geen strak gekoppeld werk alleen om meer agents actief te houden.
- Laat de orchestrator een sliceregister bijhouden met unieke sleutels zoals `<mission>:<viewport>:<state>`. Wijs een actieve sleutel nooit dubbel toe en pas dynamische backpressure toe bij serververtraging, tool-rate-limits of evidenceconflicten; “geen vaste cap” heft veiligheidsstops niet op.
- Laat Luna-workers lokale previewviewports, broninspectie, configdelta's, testuitvoer en rapportvoorbereiding parallel uitvoeren. Hergebruik gedeelde engineanalyse tussen missies; missieworkers lezen daarna alleen hun config, metadata en afwijkingen.
- Wijs één `runtime-owner` aan die dev-server, poort, bron-SHA, healthcheck en cleanup in een `finally`/handoff bezit. Alle browserworkers hergebruiken diens URL met een unieke run-id; individuele workers starten geen eigen server.
- Wijs één `production-mutator` aan met een door de orchestrator beheerde exclusieve lease en geordende queue. Alleen deze worker mag productievoortgang of XP muteren. Bij workeruitval: geef de lease pas opnieuw uit nadat identiteit, in-flight mutation, sessies en databasestate fail-closed zijn gecontroleerd.
- Laat nooit twee auth-/productieworkers tegelijk draaien. Verifieer zichtbare identiteit en storage/progress-baseline vóór en na iedere queue-entry; een browser-ID is geen isolatiebewijs. Side-effectvrije checks gebruiken `/dev/mission-preview` op exact dezelfde schone commit.
- Geef iedere worker een uniek evidencepad `<runId>/<workerId>/<mission>/<viewport>/<state>` en schrijf manifest/hash pas na succesvolle capture. Eén consolidator bezit manifestmerge en cleanup; workers overschrijven geen gedeelde bestanden.
- Laat Luna maximaal vijf concrete bevindingen, screenshotpaden/hashes en relevante console-/netwerkfouten teruggeven; vermijd DOM-dumps en herhaalde bronlezingen.
- Laat vóór Sol één Luna-consolidator duplicaten samenvoegen en bewijslinks controleren. Lever maximaal vijf bevindingen per missie en twintig voor de hele periodebatch aan Sol; Blocker/High wordt nooit door de cap verwijderd.
- Laat Sol integratie, auth/privacy, Supabase, severity, release en eindvalidatie bezitten.

### 6.1 Begrensde Claude CLI-codecontrole

Voer na consolidatie van Blocker/High-kandidaten één aanvullende read-only codecontrole uit met de lokaal beschikbare Claude CLI. Dit is een sidecar, geen beslisser:
- Controleer eerst `command -v claude` en `claude --version`. Bij ontbrekende CLI of authfout: noteer de blocker; vervang Claude niet stil door een ander model.
- Laat de hoofdagent vooraf één gesaniteerd tekstpakket maken met alleen relevante diffhunks, bewezen Blocker/High-kandidaten en maximaal één vaste steekproef. Neem dit pakket rechtstreeks in de prompt op; geef Claude geen repo- of bestandspaden.
- Gebruik als baseline: `claude -p --safe-mode --model opus --effort low --max-turns 6 --max-budget-usd 0.75 --permission-mode dontAsk --no-session-persistence --tools "" --output-format text "<prompt + gesaniteerd pakket>"`. Beperk de parent-call tot circa 120 seconden en 6000 outputtokens. Zonder tools kan Claude geen andere repo-, config-, plugin- of MCP-bronnen lezen of wijzigen.
- Stuur nooit credentials, identifiers, leerlingdata, sessies, tokens, raw privébewijs of productieprompts naar Claude.
- Vraag om maximaal vijf bevindingen met severity, `file:regel`, reproductie en bewijsstatus. Sol verifieert iedere Blocker/High zelfstandig en behoudt het eindverdict.
- Sla de gesaniteerde Claude-uitkomst op als korte rapportsectie; claim geen Claude-review als de CLI-call niet aantoonbaar slaagde.

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
