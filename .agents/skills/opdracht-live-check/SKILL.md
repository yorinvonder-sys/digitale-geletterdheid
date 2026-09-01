---
name: opdracht-live-check
description: Controleer een bestaande DGSkills-opdracht of missie handmatig als leerling in de interne Codex-browser. Gebruik voor "opdracht live check", "speel als leerling", browser-QA, een missie-ID of een leerjaar-periodeaudit wanneer zichtbare speelbaarheid, responsive UI, foutfeedback, evidence en productievoortgang moeten worden bewezen. Niet gebruiken voor het ontwerpen van een nieuwe opdracht.
---

# Opdracht Live Check

> Voor het eindoordeel over één opdracht: gebruik `opdracht-review` (speelt eerst, dan veto's en poorten); deze skill is alleen deelcontrole.

Speel precies één bestaande opdracht end-to-end zoals een leerling die ziet. Schrijf in het Nederlands, behoud het leerdoel en koppel iedere claim aan zichtbaar browserbewijs.

## Routing en scope

- Gebruik `gpt-5.6-sol` met `xhigh` als orchestrator, privacy-/authbeslisser en eindvalidator.
- Gebruik maximaal drie `gpt-5.6-luna`-workers met `high` of `xhigh` voor begrensde klikflows, screenshots en conceptrapportage.
- Behandel precies één opdracht per hoofdtaak. Start een volgende opdracht pas in een verse taak nadat de huidige formeel is afgesloten.
- Gebruik nooit Terra. Laat Luna geen auth-, Supabase-, privacy-, architectuur-, release- of Rood-besluit nemen.
- Gebruik uitsluitend de interne Codex-browser. Gebruik geen Chrome, Computer Use of los Playwright-proces als fallback.

## Bron en routes vastzetten

1. Verifieer actuele `origin/main`, productiecommit en deployment voordat browserbewijs start.
2. Maak een schone, detached auditworktree op exact die commit. Gebruik nooit de vuile gebruikersworktree als previewbron.
3. Gebruik voor side-effectvrije flows `/dev/mission-preview?mission=<id>&reset=1` op een gecontroleerde lokale dev-server.
4. Gebruik productie alleen met expliciete toestemming en een aangewezen synthetisch testaccount.
5. Zet missionId, commit-SHA, route, browser, viewport en mutatietellingen in ieder manifest.

Een lokale preview bewijst flow en responsiviteit, niet productie-login, XP, completion of persistentie. Houd preview- en productiebewijs altijd apart.

## Browserrollen

| Rol | Viewport | Productiemutaties |
|---|---:|---:|
| `DGSkills QA Desktop` | 1440 × 900 | 0 |
| `DGSkills QA iPad Portret` | 820 × 1180 | 0 |
| `DGSkills QA iPad Landschap` | 1180 × 820 | 0 |
| `DGSkills QA Mobiel` | 390 × 844 | Alleen wanneer aangewezen als muterende hoofdworker |

- Geef iedere worker een eigen browser-ID en evidencepad, maar beschouw dat nooit als bewijs van cookie-isolatie.
- Laat maximaal één worker productievoortgang muteren. Laat de andere workers uitsluitend lokale preview gebruiken.
- Serialiseer login/logout, authwissels, completion, screenshots en cleanup.
- Controleer vóór iedere productieactie de zichtbare synthetische identiteit, XP, voltooide missies en unlockstaat.
- Stop direct bij afwijkende identiteit, onboarding, cookie-, tab-, account-, commit- of evidencevermenging.

## Handmatige leerlingflow

Gebruik echte zichtbare kliks. De locator-API binnen de toegewezen interne browsertab mag helpen om een zichtbaar element betrouwbaar te bedienen; verborgen state- of databasewijzigingen mogen niet.

Leg per viewport minimaal vast:

1. Intro/start.
2. Normale interactie.
3. Eén bewuste fout of imperfect antwoord.
4. Begrijpelijke feedback die het juiste antwoord niet voortijdig weggeeft.
5. Herstel op dezelfde vraag of stap.
6. Mid-flow/voortgang.
7. Eindstaat, score en vervolg-CTA.
8. Bij productie: dashboard, XP/completion en volledige reload-persistentie.

Controleer daarnaast:

- logo's, afbeeldingen en iconen laden en zijn niet uitgerekt;
- alignment, spacing en visuele hiërarchie zijn consistent;
- tekst, knoppen, badges en feedback clippen of overlappen niet;
- tappable controls zijn bruikbaar en belangrijke doelen zijn minimaal 44 × 44 px;
- er is geen horizontale overflow en game/canvas/preview past in beeld;
- loading-, empty-, fout- en completionstates blijven bruikbaar;
- console- en netwerkproblemen blokkeren de leerlingflow niet.

DOM-, console- en netwerkbewijs ondersteunt screenshots maar vervangt ze niet. Markeer `Echte iPad-check nodig`: Chromium-viewports bewijzen geen fysieke iPad Safari. Een externe Word-, PowerPoint- of printerhandeling is eveneens niet bewezen door de DGSkills-preview.

Ontbreekt herstel op dezelfde vraag, registreer dat als blocker/high. Je mag de lokale preview daarna met `reset=1` herstarten om de rest van de flow te controleren, maar die reset telt nooit als recoverybewijs en maakt het oordeel niet groen.

## Productie- en privacystop

- Gebruik nooit een bestaande echte leerling.
- Gebruik uitsluitend synthetische profiel-, klas- en schooldata.
- Zet geen credentials, UUID's, service-role keys, sessies of leerlinggegevens in prompts, screenshots, rapporten, GitHub of Linear.
- Voer completion exact eenmaal uit. Controleer daarna beloofde versus toegekende XP, completiontelling, transactietelling en persistentie na volledige reload.
- Herhaal een al bewezen completion niet voor een nieuwere read-only commitcontrole.
- Stop wanneer de startstaat afwijkt; repareer de teststaat niet met een extra completion, directe SQL of adminshortcut.

Na de laatste opdracht van een batch: log browsers uit, trek refreshsessies in, verwijder het tijdelijke account via de ondersteunde adminroute, controleer dat voortgang/activiteiten weg zijn en verwijder lokale credentials. Een verwijderde gebruiker met nog geldige tokens is geen voltooide cleanup.

## Evidencecontract

Bewaar raw evidence duurzaam onder:

`screenshots/mission-audit/batches/<batch>/<missionId>/<sha>/<run>/`

Gebruik per run `manifest.json`, opeenvolgend genummerde PNG's en `review.md`. Gebruik `/tmp` nooit als enige opslag. Leg in het manifest vast:

- `schemaVersion`, `missionId`, `testedCommit`, route/environment en interne browser;
- bij productie ook `deploymentId`, een gelijke `deploymentCommit`, de gebruikte CSS-viewport en alle vijf checkpoints;
- previewmutaties (`productionMutations=0`, `xpMutations=0`) of exact één productiecompletion;
- CSS-viewport en checkpoints start/flow/feedback/recovery/end;
- evidencebestanden met relatief pad, SHA-256 en verwachte PNG-afmetingen;
- productie-before/after, XP, completion, transactie en reload-persistentie;
- beperkingen en eindresultaat.

Valideer ieder manifest vóór rapportage:

```bash
node .agents/skills/opdracht-live-check/scripts/validate-evidence.mjs <pad/naar/manifest.json>
```

Verwerp ontbrekende, stale, wrong-commit, verkeerd gedimensioneerde, verkeerd gehashte of gemengde evidence. Een screenshot-timeout is een evidencefout, geen visuele bevinding.

## Oordeel en vervolg

- `ship`: volledige zichtbare flow werkt, vier viewports zijn bewezen en geen leerlingblokker blijft open.
- `fix-eerst`: de opdracht is grotendeels bruikbaar, maar een blocker/high of zichtbare fout moet eerst worden hersteld.
- `herontwerp`: een normale leerling begrijpt of voltooit de kernflow niet betrouwbaar.

Reproduceer blocker/high voordat code wijzigt. Maak alleen een kleine fix, draai gerichte tests, `npm run doctor`, voor Rood-werk ook `npm run build:prod`, en herhaal de relevante volledige browserflow op de finale commit. Registreer medium/low zonder automatische scope-uitbreiding.

Gebruik dit rapportformaat:

```md
## Opdracht Live Check: <missionId>

**Advies:** ship / fix-eerst / herontwerp
**Risico:** Groen / Geel / Rood
**Commit/deployment:** <sha / id>
**Getest als:** preview / synthetische leerling / geblokkeerd

### Design
### Didactiek
### Techniek

### Browserbewijs
| Formaat | Start | Flow | Feedback | Recovery | Eind/CTA | Resultaat |
|---|---|---|---|---|---|---|

### Bevindingen
1. `<file:regel, screenshot of URL/state>` — BLOCKER/HIGH/MEDIUM/LOW — <bevinding>

### Productie en cleanup
### Nog onzeker
```

## Relatie tot andere skills

- Gebruik `dgskills-mission-review` als batchorchestrator en voor Design → Didactiek → Techniek, PR/release en Linear-status.
- Gebruik `opdracht-ontwerp-check` vóór een ontwerp of herschrijving.
- Gebruik `opdracht-klaar-check` als brede eindgate.
