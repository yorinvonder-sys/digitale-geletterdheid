# DGSkills J2 P2 Werkzaamheidsaudit - 2026-05-15

Status: auditrapport, geen productfixes uitgevoerd.

Scope: `algorithm-architect`, `web-developer`, `network-navigator`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer`, `privacy-by-design`, `wachtwoord-warrior`, `access-control-engineer` en reviewmissie `code-review-2`.

Werkzaamheidsdefinitie: een leerling kan de missie zelfstandig starten, begrijpen, doorlopen en afronden, en een docent kan redelijk zien wat de leerling heeft bewezen.

Advies in een zin: `network-navigator` is als enige missie dicht genoeg bij `ship`; de overige 10 missies zijn `fix-eerst` door ontbrekend doelbewijs, onzekere completion, iPad-portrait startproblemen of een previewroute die de echte studentroute niet hard bewijst.

## Executive Summary

- Curriculum en template-routing bestaan voor alle 11 missies. De J2 P2-volgorde staat in `src/config/curriculum.ts:175-194`; de templatekoppeling staat in `src/config/templateRegistry.ts:25-72`.
- De periode is niet als geheel shippable. De grootste blokkade is dat 7 van de 11 J2 P2-configs geen expliciet `missionGoal` hebben terwijl de templates dat wel proberen te tonen via fallback (`src/features/missions/templates/simulation-lab/SimulationLab.tsx:233-241`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:172-180`). `ReviewArena` toont in de intro helemaal geen goal (`src/features/missions/templates/review-arena/ReviewArena.tsx:215-225`).
- Chrome-rendering is overwegend stabiel: alle 11 missies renderden in de lokale preview zonder app-console errors in de responsive batches. De startactie is echter zwak bewezen op iPad portrait: 9 van de 11 bleven in de harness op intro staan.
- Hard eindbewijs is beperkt. In de directe Chrome-flow bereikte `network-navigator` een duidelijke afrondingsstaat met completionknop. Meerdere andere missies bereikten wel late rondes of stappen, maar bleven visueel in een actieve opdrachtstaat.
- Voor `access-control-engineer` is de productroute en dev-previewroute niet gelijk. De echte app route naar de dedicated component staat in `src/app/AuthenticatedApp.tsx:741-746`, terwijl `/dev/mission-preview` agent roles via `AiLab` rendert (`src/features/dev-tools/DevMissionPreview.tsx:164-187`). Daardoor is het browserbewijs voor deze security-missie onvoldoende.

## Bewijsbasis

Uitgevoerde checks:

| Check | Resultaat |
| --- | --- |
| `npm run context:budget` | Geslaagd. Snapshot: dirty worktree aanwezig, grote paden blijven buiten brede inspectie. |
| `npm run check:mission-goals` | Geslaagd na herstelronde. Script meldt: `Mission goal contract check passed for 18 missions.` |
| `npm run check:j2p2-workability` | Geslaagd. Nieuwe contractsmoke bewaakt J2 P2-goals, ReviewArena goal-doorvoer, access-control previewroute, CTA-startbaarheid en completionpaden per engine. |
| `npm run typecheck` | Geslaagd. Geen TypeScript-fouten. |
| Chrome lokale preview | Uitgevoerd via dev server op `http://127.0.0.1:3000/` en lokale harness rond `/dev/mission-preview?mission=<id>&reset=1`. |

Chrome-artifacts staan lokaal in `/private/tmp/dgskills-j2p2-audit-2026-05-15/`:

- Responsive batches: `responsive-batch1.json`, `responsive-batch2.json`, `responsive-batch3.json`.
- Directe flowpogingen: `direct-batch1.json`, `direct-batch2.json`, `direct-batch3.json`.
- Screenshots per missie, viewport en staat: `*-intro.png`, `*-active.png`, `*-result.png`.

Aanvullende per-opdracht verificatie na gebruikersverzoek:

- Nieuwe artifact-map: `/private/tmp/dgskills-j2p2-verification-2026-05-15/`.
- Belangrijkste bestanden: `quick-direct-verification.json`, `verification-results.json`, `verification-summary.json`.
- Screenshotbewijs: per opdracht minimaal `*-quick-direct.png` plus responsive screenshots voor desktop, iPad portrait, iPad landscape en mobile.
- Deze verificatie is uitgevoerd tegen de huidige lokale werkboom. In die werkboom staat al een niet-door-deze-audit gemaakte wijziging die `access-control-engineer` in `DevMissionPreview` direct naar de dedicated component routeert.

Herstelronde uitgevoerd op 2026-05-15:

- `missionGoal` toegevoegd aan de 7 ontbrekende J2 P2-configs: `algorithm-architect`, `web-developer`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer` en `code-review-2`.
- `ReviewArena` ondersteunt nu `missionGoal` en geeft `goal={config.missionGoal ?? getMissionGoal(config.missionId)}` door aan `IntroScreen`.
- `/dev/mission-preview?mission=access-control-engineer&reset=1` routeert in de actuele werkboom naar de dedicated `AccessControlEngineerMission`.
- Nieuwe repo-smoke: `npm run check:j2p2-workability`.
- Nieuwe partial Chrome-artifacts na herstelronde: `/private/tmp/dgskills-j2p2-fix-verification-2026-05-15/`.

Beperkingen:

- Echte iPad-check nodig. De iPad-viewports zijn Chrome-emulatie/harnesschecks, geen Safari op echte iPad.
- De Chrome-plugin had een invoerbeperking voor tekstvelden door ontbrekende virtual clipboard support. Waar mogelijk zijn clicks en toetsen gebruikt; open tekstinvoer blijft handmatig te bevestigen.
- Directe Chrome-runs hadden incidentele Chrome-extension/Statsig meldingen. De responsive batches registreerden geen app-console errors; de extensiemeldingen zijn niet als app-fout geteld.
- De aanvullende korte directe verificatie bewijst start en eerste interactie. Zij bewijst geen volledige leerlingafronding, behalve waar al een apart completionbewijs bestaat. Voor eindvrijgave blijft een handmatige volledige leerlingdoorloop per opdracht nodig.
- De Chrome-plugin sloot tijdens de herstelronde opnieuw de native pipe. Daardoor is de na-herstel Chrome-check gedeeltelijk: `algorithm-architect`, `web-developer`, `network-navigator`, `app-prototyper`, `bug-hunter` en `automation-engineer` hebben volledige nieuwe screenshotsets; `code-reviewer` heeft direct/desktop bewijs; de resterende na-herstel Chrome-viewports blijven opnieuw te verifiëren. De statische checks en typecheck zijn wel volledig vers groen.

## Verificatie Per Opdracht

Legenda: `ja` = in Chrome gezien, `nee` = niet gezien, `deels` = route/render werkt maar de verwachte start/interactie was niet hard aantoonbaar. Responsive start is gebaseerd op de vier harness-viewports: desktop, iPad portrait, iPad landscape en mobiel.

| Missie | Goal zichtbaar | Directe start | Eerste interactie/feedback | Responsive start | Completion hard bewezen | Verificatieoordeel |
| --- | --- | --- | --- | --- | --- | --- |
| `algorithm-architect` | ja na herstel | ja | ja | 4/4 in partial hercheck | nee | Goalblokker opgelost; afrondingsbewijs blijft releasecheck. |
| `web-developer` | ja na herstel | ja | ja | 4/4 in partial hercheck | nee | Goalblokker opgelost; afrondingsbewijs blijft releasecheck. |
| `network-navigator` | ja | ja | deels | 4/4 | ja in eerdere full-flow; nee in korte smoke | Beste bewijspositie; korte smoke startte, maar volledige afronding blijft apart te herhalen voor release. |
| `app-prototyper` | ja na herstel | ja | ja | 4/4 in partial hercheck | nee | Goalblokker opgelost; afrondingsbewijs blijft releasecheck. |
| `bug-hunter` | ja na herstel | ja | ja | 4/4 in partial hercheck | nee | Goalblokker opgelost; afrondingsbewijs blijft releasecheck. |
| `automation-engineer` | ja na herstel | ja | ja | 4/4 in partial hercheck | nee | Goalblokker opgelost; afrondingsbewijs blijft releasecheck. |
| `code-reviewer` | ja na herstel | ja | ja | desktop partial hercheck; overige viewports opnieuw te verifiëren | nee | Goalblokker opgelost; Chrome viel weg voor volledige responsive hercheck. |
| `privacy-by-design` | ja | ja | ja | 4/4 | nee | Verifieert start en feedback; privacy-inhoud en afrondingsbewijs vragen handmatige docentcheck. |
| `wachtwoord-warrior` | ja | ja | ja | 2/4; iPad landscape en mobile bleven onduidelijk | nee | Verifieert directe start en puzzelinteractie; responsive touch/start moet terug naar fixlijst. |
| `access-control-engineer` | ja | deels; dedicated route opent al in opdrachtstate | nee | 3/4; mobile bleef onduidelijk | nee | Dedicated previewroute is hersteld; mobiele start/interactie en security-evidence blijven handmatig te bewijzen. |
| `code-review-2` | ja na herstel | ja | ja | 4/4 eerdere check; na-herstel Chrome viel weg | nee | ReviewArena-goalblokker opgelost; responsive hercheck opnieuw draaien zodra Chrome stabiel is. |

Samenvatting aanvullende verificatie:

- 11/11 opdrachten renderden in Chrome zonder app-console errors in de vastgelegde states.
- 10/11 opdrachten hadden directe start of start-equivalent hard zichtbaar; `access-control-engineer` opent in de dedicated component direct in de opdrachtstate.
- 9/11 opdrachten hadden eerste interactie of feedback hard zichtbaar; `network-navigator` toont dataset/interactiestate maar de korte smoke kon geen feedback forceren, `access-control-engineer` vraagt handmatige interactiecheck.
- 7/11 opdrachten startten in alle vier responsive harness-viewports; de afwijkingen zitten bij `app-prototyper`, `automation-engineer`, `code-reviewer`, `wachtwoord-warrior` en `access-control-engineer`.
- 0/11 kregen in de korte smoke nieuw hard completionbewijs. `network-navigator` had in de eerdere full-flow wel een completionknop; dat blijft de enige harde afrondingsclaim in dit rapport.

## Topbevindingen

### Blockers

1. Opgelost in herstelronde: ontbrekend expliciet doelbewijs in 7 J2 P2-missies.
   - Toegevoegd aan `algorithm-architect`, `web-developer`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer` en `code-review-2`.
   - `network-navigator`, `privacy-by-design` en `wachtwoord-warrior` hadden al template-level `missionGoal`; `access-control-engineer` heeft een dedicated `MISSION_GOAL` in `src/features/missions/AccessControlEngineerMission.tsx:60-68`.

2. Completion is niet hard bewezen voor 10 van de 11 missies.
   - `network-navigator` bereikte een afrondingsscherm met `Missie voltooid`.
   - `algorithm-architect`, `web-developer`, `automation-engineer` en `code-reviewer` bereikten late opdrachtstaten, maar de screenshot toont nog actieve interactie.
   - `app-prototyper`, `bug-hunter`, `privacy-by-design`, `wachtwoord-warrior`, `access-control-engineer` en `code-review-2` bereikten geen betrouwbare afrondingsstaat in de directe Chrome-run.

3. De `access-control-engineer` previewroute is hersteld, maar security-evidence blijft releasekritisch.
   - Productroute: dedicated component via `AuthenticatedApp` (`src/app/AuthenticatedApp.tsx:741-746`).
   - Dev-previewroute: dedicated component via `DevMissionPreview`.
   - Gevolg: route-equivalentie is verbeterd, maar mobiele start/interactie en security-evidence moeten nog handmatig of met stabiele Chrome opnieuw worden bewezen.

### Belangrijk

4. iPad portrait is de zwakste viewport.
   - Alle 11 missies renderden, maar slechts 2 van 11 startten aantoonbaar vanuit de responsive harness (`network-navigator`, `privacy-by-design`).
   - Niet gestart of niet aantoonbaar gestart: `algorithm-architect`, `web-developer`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer`, `wachtwoord-warrior`, `access-control-engineer`, `code-review-2`.
   - Echte iPad-check nodig.

5. Periodefit is didactisch gemengd.
   - De periode heet `Programmeren & Computational Thinking` (`src/config/curriculum.ts:175-178`), maar de SLO-mapping markeert `network-navigator` als netwerkbegrip zonder programmeren, `privacy-by-design` als AVG/privacy en `wachtwoord-warrior` als veiligheid (`src/config/slo-kerndoelen-mapping.ts:115-117`).
   - Dit is inhoudelijk verdedigbaar als bredere CT/security-lijn, maar leerlingen en docenten krijgen nu een programmeerframe voor missies die vooral netwerk/privacy/security zijn.

6. Eerdere audits zijn maar deels opgelost.
   - De audit van 2026-05-10 noemde J2 P2 als batch met vooral ontbrekende `primaryGoal`/`goalCriteria` en static-only browserbewijs (`docs/audits/dgskills-all-missions-goal-review-audit-2026-05-10.md:267`).
   - `network-navigator` en `privacy-by-design` zijn inmiddels inhoudelijk beter als template-goal, maar de meeste J2 P2-missies hebben nog geen expliciet doelcontract.
   - De didactische audit wees bij veel J2 P2-missies al op matige differentiatie (`docs/audits/didactische-audit-missies-2026-03-07.md:92-98`).

### Klein

7. Responsive visual QA liet geen grote tekstoverlap zien in de representatieve screenshots, maar CTA-bereik en startstate zijn nog niet genoeg bewezen op iPad portrait.
8. Docentbewijs is vaak impliciet: score, gemaakte keuzes of late stappen zijn zichtbaar, maar niet overal is duidelijk welke evidence de docent precies moet beoordelen.
9. De Chrome-harness is nuttig, maar de screenshots zijn tijdelijke artifacts buiten de repo. Voor herhaalbare releasechecks is een repo-script met stabiele assertions nodig.

## Missietabel

| Missie | Engine/route | Werkzaamheidsbeeld | Advies |
| --- | --- | --- | --- |
| `algorithm-architect` | `simulation-lab` | Routeert en start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow kwam tot simulatie 3, maar hard eindscherm bleef onzeker. | `fix-eerst` |
| `web-developer` | `builder-canvas` | Start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow kwam tot stap 4 met score-indicatie, maar geen hard completionbewijs. | `fix-eerst` |
| `network-navigator` | `data-viewer` | Start op alle viewports in de harness. Template-level missionGoal aanwezig. Directe flow bereikte completionknop. Periodenaam past minder goed dan de inhoud. | `ship` |
| `app-prototyper` | `builder-canvas` | Start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow bleef bij stap 2. | `fix-eerst` |
| `bug-hunter` | `simulation-lab` | Start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow bleef bij simulatie 2. | `fix-eerst` |
| `automation-engineer` | `builder-canvas` | Start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow kwam tot stap 4, maar hard eindscherm bleef onzeker. | `fix-eerst` |
| `code-reviewer` | `simulation-lab` | Start op desktop/landscape/mobile. Geen expliciet missionGoal. iPad portrait bleef op intro. Directe flow kwam tot simulatie 3, maar hard eindscherm bleef onzeker. | `fix-eerst` |
| `privacy-by-design` | `simulation-lab` | Start op alle responsive viewports. Template-level missionGoal aanwezig. Directe flow bleef in simulatie 1. Privacy-inhoud vraagt docentcheck op juistheid en nuance. | `fix-eerst` |
| `wachtwoord-warrior` | `puzzle-lab` | Template-level missionGoal aanwezig. Responsive startdetectie bleef onduidelijk op alle viewports; directe flow kwam wel in puzzel 1. Geen hard completionbewijs. | `fix-eerst` |
| `access-control-engineer` | dedicated component in product, agent/AiLab in dev preview | Dedicated goal bestaat in code, maar de gebruikte dev-previewroute bewijst de echte route niet hard. Directe flow eindigde in een onduidelijke stap-3/startstaat. Security-inhoud vraagt harde route- en docentcheck. | `fix-eerst` |
| `code-review-2` | `review-arena` | Start op desktop/landscape/mobile. Geen missionGoal in intro en `ReviewArena` geeft geen goal door. iPad portrait bleef op intro. Directe flow kwam tot ronde 3, geen hard completionbewijs. | `fix-eerst` |

## Chrome Evidence Per Viewport

| Viewport | Grootte | Resultaat | Conclusie |
| --- | --- | --- | --- |
| Desktop/laptop | harness desktop | 11/11 renderden; 9/11 startten aantoonbaar; `wachtwoord-warrior` en `access-control-engineer` bleven in responsive detectie onduidelijk. | Basisrendering OK, completion niet hard genoeg. |
| iPad portrait | 1024x1366 | 11/11 renderden; 2/11 startten aantoonbaar; 9/11 bleven op intro of onduidelijke startstate. | Echte iPad-check nodig; eerst CTA/startstate onderzoeken. |
| iPad landscape | 1366x1024 | 11/11 renderden; 9/11 startten aantoonbaar; `wachtwoord-warrior` en `access-control-engineer` onduidelijk. | Beter dan portrait, maar echte iPad-check nodig. |
| Mobiel smal | harness mobile | 11/11 renderden; 9/11 startten aantoonbaar; `wachtwoord-warrior` en `access-control-engineer` onduidelijk. | Bruikbaar als smoke, maar touch/scroll handmatig bevestigen. |

Alle viewports: Echte iPad-check nodig voor definitieve vrijgave.

## Design En Werkbaarheid

- Alignment en tekstfit zijn in de representatieve screenshots grotendeels bruikbaar; er is geen harde overlap gevonden die lezen direct blokkeert.
- iPad portrait is het grootste designrisico, vooral bij start CTA, scrollpositie en klikbaarheid. De leerling ziet soms wel de intro, maar de harness kon de start niet betrouwbaar activeren.
- BuilderCanvas-missies tonen op mobiel veel instructietekst en checklist tegelijk. Dat is inhoudelijk nuttig, maar cognitieve belasting is hoog; CTA, voortgang en "wat moet ik nu doen" moeten extreem duidelijk blijven.
- `access-control-engineer` heeft een rijke dedicated interface, maar de previewroute maakt visuele release-QA nu te onzeker.

## Didactiek

- Sterk: de periode heeft een logische kern van algoritmes, web, debugging, automatisering en review. De opdrachten zijn actief en beroepsachtig.
- Zwak: veel missies missen een zichtbaar leerlingdoel en expliciet bewijscriterium. Daardoor moet de leerling afleiden wat "goed genoeg" is.
- Differentiatie blijft matig. Eerdere didactische auditregels voor J2 P2 noemen vaker basis/verdieping of expertvarianten als ontbrekende steun (`docs/audits/didactische-audit-missies-2026-03-07.md:92-98`).
- SLO-fit is inhoudelijk niet fout, maar de periodebelofte is breder dan programmeren. `network-navigator`, `privacy-by-design` en `wachtwoord-warrior` moeten of expliciet als CT/security-context worden geframed, of de periodecopy moet worden verbreed.

## Tech

- Routeerbaarheid: curriculum en template registry zijn aanwezig voor alle scoped missies.
- Goal-contract: templates proberen doelen te tonen, maar configs of fallbacks ontbreken voor meerdere missies. `src/config/missionGoals.ts:3-140` bevat algemene mission goals, maar targeted search vond geen J2 P2-fallbacks voor de ontbrekende ids.
- Completion-contract: de engines geven score/voortgang, maar de audit heeft niet per missie een betrouwbare "doel behaald"-staat bewezen.
- Preview-ondersteuning: `/dev/mission-preview` is goed genoeg voor template-missies, maar niet hard genoeg voor `access-control-engineer`.
- Console: responsive Chrome-batches hadden 0 app-console errors in de captured states.

## Herstelplan

1. Klaar: expliciete `missionGoal` met `primaryGoal`, criteria en evidence toegevoegd aan de 7 ontbrekende J2 P2-configs; `ReviewArena` toont nu een goal.
2. Klaar: `/dev/mission-preview?mission=access-control-engineer&reset=1` routeert naar de dedicated component in de actuele werkboom.
3. Klaar als statische guard: `npm run check:j2p2-workability` bewaakt de zes engines en relevante J2 P2-contracten.
4. P1: onderzoek iPad portrait startactie en CTA-zichtbaarheid; fix pas na echte iPad/Safari-check.
5. P1: maak docentbewijs expliciet per missie: wat ziet de docent, welke score of keuze telt, en wanneer is bewijs voldoende.
6. P2: herformuleer periodecopy of mission-intro's zodat netwerk/privacy/security logisch passen binnen de CT-lijn.
7. P2: voeg basis/verdieping toe aan de open opdrachten, vooral bij debugging, automation, code review en builder-canvas-missies.

## Public APIs, Interfaces En Types

Geen wijzigingen uitgevoerd of aanbevolen als onderdeel van deze auditronde. Dit rapport wijzigt geen runtime-code, types, publieke API's of data-contracten.
