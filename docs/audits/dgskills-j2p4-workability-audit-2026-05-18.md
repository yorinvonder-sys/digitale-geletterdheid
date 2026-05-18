# DGSkills J2 P4 Werkbaarheidsaudit - 2026-05-18

Status: review + fixbatch uitgevoerd voor J2 P4.

Scope: `ai-ethicus`, `digital-rights-defender`, `tech-court`, `future-forecaster`, `eindproject-j2`.

Werkbaarheidsdefinitie: een leerling kan de opdracht zelfstandig starten, begrijpen, doorlopen en afronden, en een docent kan zien welk leerbewijs is geleverd.

## Samenvatting

J2 P4 is gericht gereviewd en verbeterd op zichtbaar leerdoel, succescriteria, leerlingbewijs, docentbewijs, completion/eindstaat en CTA-zichtbaarheid. De vier DebateArena-missies tonen nu argumentkwaliteit en geven hun evidencecontract door aan het eindscherm. `eindproject-j2` heeft een hardere eindprojectvraag met minimale lengte, criteria op probleem/doelgroep/projectvorm/data en puntenwaarde, zodat de eindstaat inhoudelijker bewijs toont.

Chrome-verificatie is uitgevoerd met een lokale Google Chrome-sessie via CDP op poort `9225`, omdat er geen afzonderlijke callable `Chrome:` tool-namespace beschikbaar kwam na tool discovery. De Chrome-run gebruikte de echte lokale app op `http://127.0.0.1:5173/dev/mission-preview`. Screenshots en JSON-resultaten staan in `/private/tmp/dgskills-j2p4-workability-qa`.

## Wat Is Gecontroleerd

### Didactiek

- Alle vijf missies hebben een zichtbaar leerdoel, succescriteria en bewijszin op de intro.
- De SLO-fit blijft passend bij J2 P4: AI-ethiek, privacy/rechten, digitaal welzijn, maatschappelijke gevolgen, toekomstdenken en eindprojectvoorbereiding.
- DebateArena vraagt nu explicieter om argumentkwaliteit; leerlingen zien basis/goed/uitstekend bij claim en onderbouwing.
- `eindproject-j2` vraagt expliciet om probleem, doelgroep, projectvorm en databewijs/tip als eindprojectvoorbereiding.

### Design

- Chrome viewportmatrix controleerde intro/start, normale flow, foutfeedback, eind/CTA, horizontale overflow en clipping.
- Geen horizontale overflow of clipped text gevonden in de geslaagde run.
- CTA's waren bereikbaar op desktop, iPad portrait, iPad landscape en mobile.

### Techniek

- `MissionGoalBanner` toont nu ook `criteria.description`.
- `DebateArena` en `DataViewer` geven `missionGoal.evidence` door aan `CompletionScreen`.
- `DebateArena` geeft completion door als `true` alleen wanneer alle debatonderdelen zijn afgerond.
- `DataViewer` ondersteunt `minLength` voor `text-observation` en gebruikt bestaande evidencecriteria in score/completion.

## Browserbewijs

Route: `http://127.0.0.1:5173/dev/mission-preview?mission=<missionId>&reset=1`

| Missie | Desktop/laptop | iPad portrait 1024x1366 | iPad landscape 1366x1024 | Mobile 390x844 | Resultaat |
|---|---|---|---|---|---|
| `ai-ethicus` | start/flow/fout/eind-CTA ja | ja | ja | ja | Werkbaar |
| `digital-rights-defender` | start/flow/fout/eind-CTA ja | ja | ja | ja | Werkbaar |
| `tech-court` | start/flow/fout/eind-CTA ja | ja | ja | ja | Werkbaar |
| `future-forecaster` | start/flow/fout/eind-CTA ja | ja | ja | ja | Werkbaar |
| `eindproject-j2` | start/flow/fout/eind-CTA ja | ja | ja | ja | Werkbaar |
| `policy-maker` regressie DebateArena | start/flow/fout/eind-CTA ja | ja | ja | ja | Geen regressie gevonden |
| `ux-detective` regressie DataViewer | start/flow/fout/eind-CTA ja | ja | ja | ja | Geen regressie gevonden |

Console: geen app-runtime blockers in de geslaagde Chrome-run. Vite HMR WebSocket-noise uit `@vite/client` is gefilterd als devserverruis, niet als applicatiefout.

## Oordeel Per Missie

| Missie | Leerdoel | SLO/curriculum-fit | Leerlingbewijs | Docentbewijs | Completion/eindstaat | CTA-zichtbaarheid | Oordeel |
|---|---|---|---|---|---|---|---|
| `ai-ethicus` | Zichtbaar | Passend bij 21D/23C | Standpunt + argumenten + reflectie | Evidenceblok in eindscherm | Harder via debatonderdelen | Pass | `werkbaar` |
| `digital-rights-defender` | Zichtbaar | Passend bij 23A/23C | Recht/risico/regel in schoolpraktijk | Evidenceblok in eindscherm | Harder via debatonderdelen | Pass | `werkbaar` |
| `tech-court` | Zichtbaar | Passend bij 23B/23C | Oordeel + maatschappelijke gevolgen | Evidenceblok in eindscherm | Harder via debatonderdelen | Pass | `werkbaar` |
| `future-forecaster` | Zichtbaar | Passend bij 21D/23C | Kans/risico/betrokkenen | Evidenceblok in eindscherm | Harder via debatonderdelen | Pass | `werkbaar` |
| `eindproject-j2` | Zichtbaar | Passend bij 21C/22A/23C | Probleem, doelgroep, projectvorm en databewijs | Evidenceblok in eindscherm | Harder via score + tekstcriteria | Pass | `werkbaar` |

## Resterende Risico's

- De formele `@chrome` extensie was niet als aparte callable tool beschikbaar in deze sessie; bewijs is daarom Google Chrome via CDP, niet een aparte extension-toolcall.
- Echte iPad/Safari is niet uitgevoerd. Chrome viewport-emulatie dekt layout en interactie, maar geen Safari-specifieke bugs.
- De dev-preview route bewijst de templateflow lokaal; live/authenticated route moet na productiebuild en eventuele deploy apart gecontroleerd blijven.
