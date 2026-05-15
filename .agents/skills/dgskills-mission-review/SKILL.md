---
name: dgskills-mission-review
description: Use this skill when reviewing, auditing, visually checking, or improving an existing DGSkills learner mission/opdracht for design, didactics, technical implementation, browser QA, or mission quality. Trigger phrases include "review opdracht", "review missie", "missie nakijken", "visuele check", "browsercheck", "review mission", or a specific mission ID/title such as mail-detective.
metadata:
  short-description: Review a DGSkills mission with browser, Chrome, and Computer Use QA
---

# DGSkills Mission Review - Codex Workspace Skill

Gebruik deze skill als project-lokale Codex-versie van de DGSkills mission-review agent. De hoofdagent blijft GPT-5.5 voor oordeel, integratie en eindvalidatie. Gebruik subagents alleen wanneer de gebruiker expliciet om subagents/parallel werk vraagt of wanneer een klein sidecar-onderzoek veilig parallel kan lopen.

## DGSkills Mission Factory v1

Gebruik `docs/agent/dgskills-mission-factory.md` als centrale procesafspraak voor missie-werk. Bij missieverbetering of review hoort de output aan te sluiten op:
- Missie Intake: doel, doelgroep, scope, risico en bewijs.
- Validation Contract: leerdoel, SLO-koppeling, succescriteria en wat niet mis mag gaan.
- Reviewrapport: wat is gecontroleerd, welke browserbewijzen bestaan, wat blijft onzeker.

De rollen blijven gescheiden: de hoofdagent is Regisseur, eventuele subagents zijn Maker of Controleur, en Yorin blijft menselijke eindbeslisser.

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

Los de missie op via `config/templateRegistry.ts`, `config/curriculum.ts`, template-configtitels en handcrafted componentnamen. Vraag alleen verduidelijking als meerdere matches even plausibel blijven.

## Review Workflow

### 1. MissionId valideren

Een missie bestaat als minimaal een van deze checks slaagt:
- Template-missie: `missionId` staat in `config/templateRegistry.ts`.
- Handcrafted missie: er is een passende component in `components/missions`, exclusief `components/missions/templates`.

Ontbrekende SLO- of curriculum-metadata is een reviewbevinding, geen reden om te stoppen.

### 2. Paths resolven

Template:
- `configPath = components/missions/templates/<templateType>/configs/<missionId>.ts`
- `enginePath = components/missions/templates/<templateType>/<TemplateType>.tsx`

Handcrafted:
- `configPath = null`
- `enginePath = <gevonden Mission component>`

### 3. Reviewperspectieven scheiden

Voer de drie perspectieven gescheiden uit:
- Design: layout, visuele hierarchy, states, responsive gedrag, contrast.
- Didactiek: niveau, cognitieve belasting, feedback, leerdoel, curriculum-fit.
- Tech: componentkwaliteit, types, scoring, routes, regressierisico, testbaarheid.

Gebruik de bestaande rubric-skills als bronmateriaal wanneer beschikbaar:
- `dgskills-design-reviewer`
- `dgskills-didactiek-reviewer`
- `dgskills-tech-reviewer`

### 4. Browser, Chrome en Computer Use opnemen in QA

De plugins uit deze workspace horen bij de review-toolkit:

- **Chrome**: verplichte eerste keuze voor DGSkills missie-reviews. Gebruik de Codex Chrome plugin/extension ("Chrome — Control Chrome with Codex") voor lokale webapp-checks, screenshots, klikken, viewport-tests, DOM-inspectie, console/network-observaties en bestaande Chrome-profiel/context.
- **Browser**: alleen fallback voor lokale webapp-checks als de gebruiker expliciet akkoord geeft dat de Chrome-plugin niet gebruikt kan worden.
- **Computer Use**: gebruik als fallback voor macOS-app-interactie of wanneer browserautomatisering niet genoeg is. Roep altijd eerst `get_app_state` aan in de beurt waarin je Computer Use gaat gebruiken, en verifieer na elke UI-actie dat de interface veranderde zoals verwacht.

Als de Chrome-tool niet actief zichtbaar is, gebruik eerst `tool_search` met de concrete pluginnaam, bv. `Chrome Control Chrome with Codex`. Als de Chrome-plugin niet werkt, probeer de pluginverbinding te herstellen volgens de Chrome-skill. Lukt dat niet, noteer de blocker en markeer de browserreview als unverified; ga niet stilletjes verder via een andere browser.

### 5. Visuele check verplicht bij UI-werk

Bij elke review of verbetering die zichtbare missie-UI raakt:
- Start of hergebruik een lokale dev-server.
- Check minimaal desktop/laptop, tablet/iPad staand, tablet/iPad liggend en mobiel.
- Controleer intro/start, een normale interactieronde, foutfeedback, eind-/doorgangsstaat en eventuele follow-up.
- Check bij gedeelde engines minimaal een tweede missie als regressieproef.
- Noteer expliciet wat dynamisch in de browser is gezien.
- Markeer `Echte iPad-check nodig` als browser-emulatie mogelijk niet genoeg bewijs geeft door Safari- of iPad-specifiek gedrag.

Minimale viewportset:
- Desktop/laptop: normale desktop- of laptopweergave.
- Tablet/iPad staand: ongeveer 1024 x 1366.
- Tablet/iPad liggend: ongeveer 1366 x 1024.
- Mobiel: smal telefoonscherm.

### 5.1 Visual Precision Gate

Elke missie-review moet een expliciete Visual Precision Gate bevatten. Dit is de harde UI-polish check die voorkomt dat functioneel werkende maar rommelig geplaatste interfaces door de review komen.

Controleer via de Chrome-plugin:
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
- visuele claims zonder Chrome-plugin bewijs.

Als de browsercheck niet lukt, ga niet stil verder. Noteer de blocker en geef aan welke delen static-only zijn beoordeeld.

### 6. Subagents binnen Codex

Als de gebruiker expliciet subagents of parallelisatie wil:
- Gebruik `gpt-5.3-codex-spark` voor lichte, begrensde sidecar-taken zoals bestandsinspectie, loglezing of een smalle QA-check.
- Houd GPT-5.5 op de kritieke route voor architectuur, multi-file wijzigingen, ambiguiteit, security, integratie en eindvalidatie.
- Geef subagents een klein, concreet doel en laat ze geen release- of architectuurbeslissingen nemen.

### 7. Rapport of verbeterplan

Voor een reviewrapport:
- Schrijf Nederlands.
- Geef topbevindingen met file:regel.
- Scheid design, didactiek en tech.
- Vermeld browser/Chrome/Computer Use evidence per formaat: desktop/laptop, tablet/iPad staand, tablet/iPad liggend en mobiel. Als iPad/Safari-specifiek gedrag niet echt op iPad is getest, markeer `Echte iPad-check nodig`.

Voor implementatie na review:
- Geef vooraf Plan / Risk / Likely files / Proof volgens `AGENTS.md`.
- Hou wijzigingen klein.
- Verifieer met `npm run doctor`, waar passend `npm run build`, browsercheck desktop/laptop + tablet/iPad staand + tablet/iPad liggend + mobiel, en regressie op een tweede gedeelde-template missie.

## Anti-patronen

- Geen visuele claims zonder browser/Chrome/Computer Use bewijs.
- Geen browsercheck overslaan nadat de gebruiker er expliciet naar vraagt.
- Geen subagent brede of risicovolle beslissingen laten nemen.
- Geen tijdelijke QA-routes of harnesses achterlaten.
- Geen orphan dev-server processen laten draaien.
