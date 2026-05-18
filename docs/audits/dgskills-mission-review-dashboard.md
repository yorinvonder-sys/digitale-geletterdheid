# DGSkills Mission Review Dashboard

Datum: 2026-05-18  
Doel: een gedeeld overzicht voor Yorin en Codex om DGSkills-opdrachten structureel, per kleine batch, te reviewen en op te volgen.

## Huidige Stand

Dit dashboard gebruikt de actuele curriculumstructuur uit `src/config/curriculum.ts`: 96 curriculum-/reviewopdrachten over 12 periodes. Assessments staan in de curriculumconfig, maar tellen hier alleen als context tenzij een perioderapport ze expliciet meeneemt.

Belangrijk onderscheid:

- `werkbaarheidsreview` betekent een gerichte Codex-review per periode met design, didactiek, techniek, doel/evidence, browserbewijs en completionpoging.
- `browser smoke` betekent dat er dynamische Chrome/CDP-triage bestaat, maar nog geen volledige periode-review.
- `static-only` betekent dat de opdracht alleen statisch of in een brede audit is beoordeeld.

J2 P1 heeft nu een eerste gerichte werkbaarheidsreview met `fix nodig`; de formele `@Chrome` viewportmatrix blijft nog open. J2 P2 heeft een evidence/completion-hercheck met lokale Chrome-CDP matrixbewijs, maar de formele `@chrome` extensietool bleef niet-callable en blokkeert live release. J2 P3 heeft op 2026-05-18 een hercheck met `@chrome` extensiebewijs, Chrome-CDP viewportmatrix, completion-smoke en gedeelde-engine regressie. Alle andere periodes hebben wel brede auditsporen, maar moeten nog door de vaste reviewstraat.

## Statusmodel

| Status | Betekenis | Mag als klaar tellen? |
|---|---|---|
| `niet gestart` | Geen bruikbaar Codex-reviewbewijs gevonden. | Nee |
| `static-only` | Code/config/docs bekeken, geen browserbewijs voor volledige leerlingflow. | Nee |
| `browser smoke` | Route/start of beperkte interactie dynamisch gezien. | Nee |
| `werkbaarheidsreview` | Periode/opdracht gericht beoordeeld op design, didactiek, tech en browserflow. | Alleen met positief oordeel |
| `fix nodig` | Er is een concrete blocker of tekortkoming die eerst opgelost moet worden. | Nee |
| `hercheck nodig` | Er is al review/fixwerk, maar bewijs moet opnieuw worden vastgelegd. | Nee |
| `release-kandidaat` | Route, doel, interactie, responsive UI, completion/eindstaat en docentbewijs zijn voldoende bewezen. | Ja |

Bewijsniveaus:

- Static code/config
- Doel/evidencecontract
- Chrome desktop/laptop
- Chrome iPad portrait
- Chrome iPad landscape
- Chrome mobile
- Completionbewijs of duidelijke eindstaat
- Echte iPad/Safari nog nodig

Yorin-oordelen per opdracht:

- `ship`: inhoudelijk en technisch voldoende bewezen voor de besproken scope.
- `fix-eerst`: eerst concrete blokkade oplossen of bewijs aanvullen.
- `menselijke keuze nodig`: inhoudelijke, didactische of prioriteitskeuze nodig voordat Codex verder gaat.

## Periode Dashboard

| Prioriteit | Periode | Opdrachten | Huidige status | Bewijsbasis | Hoofdblokker | Eerstvolgende actie |
|---:|---|---:|---|---|---|---|
| 1 | J2 P1 Data & Informatie | 7 | `fix nodig` | `docs/audits/dgskills-j2p1-workability-audit-2026-05-17.md` + `@Chrome` fixed-viewport smoke | Ontbrekend doel/evidencecontract, zwakke completion en open viewportmatrix | Fixbatch kiezen: doel/evidence + engine-completion, daarna `@Chrome` matrix hercheck |
| 2 | J1 P2 AI & Creatie | 16 | `browser smoke` | Brede audits, zichtbare leerlingkritische routes | Veel custom/AiLab routes en completion onzeker | Gerichte review op AI-flow, custom routes en reviewmissies |
| 3 | J3 P2 Cybersecurity & Privacy | 6 | `browser smoke` | Brede audits | Inhoudelijk risicovol, PuzzleLab/no-button en security-evidence | Gerichte review met streng bewijs- en docentcheck |
| 4 | J1 P3 Digitaal Burgerschap | 14 | `browser smoke` | Brede audits | Privacy/data-bewijs en mixed template/custom routes | Review na J3 P2 of samen met privacycluster |
| 5 | J2 P4 Ethiek, Maatschappij & Eindproject | 5 | `werkbaarheidsreview` | `docs/audits/dgskills-j2p4-workability-audit-2026-05-18.md` + lokale Google Chrome/CDP viewportmatrix | Echte iPad/Safari en afzonderlijke `@chrome` toolnamespace nog niet bewezen | Alleen live deployen na prod-build en live smoke |
| 6 | J3 P1 Geavanceerd Programmeren & AI | 6 | `browser smoke` | Brede audits | DataViewer/BuilderCanvas bewijs en AI-route-noise | Perioderapport met advanced-code-review als gate |
| 7 | J3 P3 Maatschappelijke Impact & Innovatie | 8 | `release-blocked` | `docs/audits/dgskills-j3p3-workability-audit-2026-05-18.md` + `@Chrome` desktop leerlingflows | iPad/mobile Chrome-viewportmatrix niet bewezen | Geen live deploy tot Chrome viewportmatrix of echte iPad/Safari-check groen is |
| 8 | J3 P4 Meesterproef | 6 | `browser smoke` | Brede audits | Eindprojectkwaliteit en portfolio/research-bewijs | Perioderapport met product- en reflectiecriteria |
| 9 | J1 P1 Digitale Basisvaardigheden | 5 | `browser smoke` | Brede fun/completion audit sterk positief | ToolGuide is afrondbaar maar saai-risico | Later reviewen op fun/didactiek, niet urgent voor completion |
| 10 | J1 P4 Eindproject | 4 | `browser smoke` | Brede audits | BuilderCanvas eindprojectbewijs onvolledig | Later reviewen als afsluitende J1-batch |
| Gereviewed | J2 P2 Programmeren & Computational Thinking | 11 | `hercheck nodig` | `docs/audits/dgskills-j2p2-workability-audit-2026-05-15.md` + `docs/audits/dgskills-j2p2-hercheck-2026-05-18.md` + Chrome-CDP 48/48 | Formele `@chrome` extensietool niet callable; echte iPad/Safari open | `@chrome` releasegate of handmatige browserbevestiging kiezen voordat live deploy |
| Gereviewed | J2 P3 Digitale Media & Creatie | 8 | `release-kandidaat` | `docs/audits/dgskills-j2p3-workability-audit-2026-05-16.md`, `@chrome` extensiecheck, `npm run check:j2p3-workability:visual` | Echte iPad/Safari nog niet gedaan; `assessment-j2-p3` apart van ReviewArena-preview | Build/deploy-gates draaien en echte iPad/Safari later menselijk checken |

## Opdracht Tracker

Legenda voor deze tabel:

- `status` is het beste huidige reviewbewijs, niet automatisch productkwaliteit.
- `oordeel` is pas definitief na een werkbaarheidsreview. Bij nog niet volledig gereviewde periodes staat standaard `menselijke keuze nodig`.
- `volgende actie` is bewust kort, zodat Yorin per batch kan kiezen: fixen, parkeren of inhoudelijk herijken.

### J1 P1 - Digitale Basisvaardigheden

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `magister-master` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Later didactiek/fun-review |
| `cloud-commander` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Later didactiek/fun-review |
| `word-wizard` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Later didactiek/fun-review |
| `slide-specialist` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Later didactiek/fun-review |
| `print-pro` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Later didactiek/fun-review |

### J1 P2 - AI & Creatie

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `prompt-master` | `browser smoke` | `menselijke keuze nodig` | Eerder beperkt browserbewijs, geen perioderapport | Review in J1 P2 batch |
| `game-programmeur` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `ai-trainer` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `chatbot-trainer` | `browser smoke` | `menselijke keuze nodig` | Brede audit met AI/session-noise | Review in J1 P2 batch |
| `verhalen-ontwerper` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `game-director` | `browser smoke` | `menselijke keuze nodig` | Brede audit, route/completion risico | Review in J1 P2 batch |
| `ai-tekengame` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J1 P2 batch |
| `ai-beleid-brainstorm` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `code-denker` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P2 batch |
| `website-bouwer` | `browser smoke` | `menselijke keuze nodig` | Brede audit, builder completion onzeker | Review in J1 P2 batch |
| `schermtijd-coach` | `browser smoke` | `menselijke keuze nodig` | Brede audit, debate completion onzeker | Review in J1 P2 batch |
| `notificatie-ninja` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P2 batch |
| `cloud-cleaner` | `browser smoke` | `menselijke keuze nodig` | Brede audit, mogelijk no-button | Review in J1 P2 batch |
| `layout-doctor` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `pitch-police` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P2 batch |
| `review-week-2` | `browser smoke` | `menselijke keuze nodig` | Brede audit, ReviewArena completion onzeker | Review in J1 P2 batch |

### J1 P3 - Digitaal Burgerschap

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `data-detective` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J1 P3 batch |
| `data-verzamelaar` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P3 batch |
| `deepfake-detector` | `browser smoke` | `menselijke keuze nodig` | Brede audit, deels viewport-specifiek | Review in J1 P3 batch |
| `ai-spiegel` | `browser smoke` | `menselijke keuze nodig` | SimulationLab completion in brede audit | Review in J1 P3 batch |
| `social-safeguard` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P3 batch |
| `scroll-stopper` | `browser smoke` | `menselijke keuze nodig` | Brede audit, debate completion onzeker | Review in J1 P3 batch |
| `cookie-crusher` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P3 batch |
| `mail-detective` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P3 batch |
| `data-handelaar` | `browser smoke` | `menselijke keuze nodig` | Brede audit, PuzzleLab/no-button | Review in J1 P3 batch |
| `filter-bubble-breaker` | `browser smoke` | `menselijke keuze nodig` | Brede audit, mogelijk no-button | Review in J1 P3 batch |
| `datalekken-rampenplan` | `browser smoke` | `menselijke keuze nodig` | Brede audit, completion onzeker | Review in J1 P3 batch |
| `data-voor-data` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J1 P3 batch |
| `data-speurder` | `browser smoke` | `menselijke keuze nodig` | Brede audit, scenario completion onzeker | Review in J1 P3 batch |
| `digitale-balans-coach` | `browser smoke` | `menselijke keuze nodig` | Brede audit, debate completion onzeker | Review in J1 P3 batch |

### J1 P4 - Eindproject

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `mission-blueprint` | `browser smoke` | `menselijke keuze nodig` | Brede audit, builder completion onzeker | Review in J1 P4 batch |
| `mission-vision` | `browser smoke` | `menselijke keuze nodig` | Brede audit, builder completion onzeker | Review in J1 P4 batch |
| `mission-launch` | `browser smoke` | `menselijke keuze nodig` | ToolGuide completion in brede audit | Review in J1 P4 batch |
| `review-week-3` | `browser smoke` | `menselijke keuze nodig` | Brede audit, debate completion onzeker | Review in J1 P4 batch |

### J2 P1 - Data & Informatie

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `data-journalist` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; `@chrome` extensietool niet callable | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `spreadsheet-specialist` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; `@chrome` extensietool niet callable | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `factchecker` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; gevoelig bronkader toegevoegd | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `api-verkenner` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; API/privacy-evidence zichtbaar | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `dashboard-designer` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; eindproductcriteria zichtbaar | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `ai-bias-detective` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; kader + typofix gedaan | Live pas na formele `@chrome` extensiecheck of menselijke override |
| `data-review` | `hercheck groen` | `deploy-blocked` | 2026-05-18 contractcheck + Chrome-CDP matrix; ReviewArena completion/evidence gekoppeld | Live pas na formele `@chrome` extensiecheck of menselijke override |

### J2 P2 - Programmeren & Computational Thinking

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `algorithm-architect` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + SimulationLab doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `web-developer` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + BuilderCanvas doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `network-navigator` | `hercheck nodig` | `menselijke keuze nodig` | 2026-05-18 evidence-contract + DataViewer doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `app-prototyper` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + BuilderCanvas doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `bug-hunter` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + SimulationLab doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `automation-engineer` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + BuilderCanvas doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `code-reviewer` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + SimulationLab doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `privacy-by-design` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + SimulationLab doorvoer + Chrome-CDP matrix | Menselijke privacy/docentcheck + releasebevestiging |
| `wachtwoord-warrior` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + PuzzleLab doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `access-control-engineer` | `hercheck nodig` | `fix-eerst` | 2026-05-18 bewijsstaat voor security-evidence + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |
| `code-review-2` | `hercheck nodig` | `fix-eerst` | 2026-05-18 evidence-contract + ReviewArena doorvoer + Chrome-CDP matrix | Formele `@chrome` plugin of handmatige releasebevestiging |

### J2 P3 - Digitale Media & Creatie

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `ux-detective` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 `@chrome` extensiecheck + viewportmatrix + DataViewer completion-smoke | Echte iPad/Safari later menselijk checken |
| `podcast-producer` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + BuilderCanvas completion-smoke | Echte iPad/Safari later menselijk checken |
| `meme-machine` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + BuilderCanvas completion-smoke | Echte iPad/Safari later menselijk checken |
| `digital-storyteller` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + BuilderCanvas completion-smoke | Echte iPad/Safari later menselijk checken |
| `brand-builder` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + BuilderCanvas completion-smoke | Echte iPad/Safari later menselijk checken |
| `video-editor` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + BuilderCanvas completion-smoke | Echte iPad/Safari later menselijk checken |
| `online-helden` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + ScenarioEngine completion-smoke | Echte iPad/Safari en curriculumfit later menselijk checken |
| `media-review` | `release-kandidaat` | `ship na build/deploy-gates` | 2026-05-18 viewportmatrix + ReviewArena completion-smoke; assessmentlaag blijft apart | Echte iPad/Safari en `assessment-j2-p3` apart checken |

### J2 P4 - Ethiek, Maatschappij & Eindproject

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `ai-ethicus` | `werkbaarheidsreview` | `werkbaar` | J2 P4 audit + Chrome/CDP matrix; evidence/eindstaat zichtbaar | Echte iPad/Safari blijft open |
| `digital-rights-defender` | `werkbaarheidsreview` | `werkbaar` | J2 P4 audit + Chrome/CDP matrix; evidence/eindstaat zichtbaar | Echte iPad/Safari blijft open |
| `tech-court` | `werkbaarheidsreview` | `werkbaar` | J2 P4 audit + Chrome/CDP matrix; evidence/eindstaat zichtbaar | Echte iPad/Safari blijft open |
| `future-forecaster` | `werkbaarheidsreview` | `werkbaar` | J2 P4 audit + Chrome/CDP matrix; evidence/eindstaat zichtbaar | Echte iPad/Safari blijft open |
| `eindproject-j2` | `werkbaarheidsreview` | `werkbaar` | J2 P4 audit + Chrome/CDP matrix; DataViewer tekstbewijs/eindstaat zichtbaar | Echte iPad/Safari blijft open |

### J3 P1 - Geavanceerd Programmeren & AI

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `ml-trainer` | `browser smoke` | `menselijke keuze nodig` | Brede audit, DataViewer/no-button | Review in J3 P1 batch |
| `api-architect` | `browser smoke` | `menselijke keuze nodig` | Brede audit, builder completion onzeker | Review in J3 P1 batch |
| `neural-navigator` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J3 P1 batch |
| `data-pipeline` | `browser smoke` | `menselijke keuze nodig` | Brede audit, DataViewer/no-button | Review in J3 P1 batch |
| `open-source-contributor` | `browser smoke` | `menselijke keuze nodig` | Brede audit met AI/session-noise | Review in J3 P1 batch |
| `advanced-code-review` | `browser smoke` | `menselijke keuze nodig` | Brede audit met AI/session-noise | Review in J3 P1 batch |

### J3 P2 - Cybersecurity & Privacy

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `cyber-detective` | `@Chrome desktop pass` | `release-blocked op viewport` | Desktop leerlingflow uitgespeeld; completionbewijs zichtbaar; viewportmatrix niet betrouwbaar door vaste `1280x622` Chrome-plugin viewport | Chrome viewportmatrix en echte iPad/Safari-check |
| `encryption-expert` | `@Chrome desktop pass` | `release-blocked op viewport` | PuzzleLab uitgespeeld met bewuste fout; recovery en `Bewijs compleet` zichtbaar | Chrome viewportmatrix en echte iPad/Safari-check |
| `phishing-fighter` | `@Chrome desktop pass` | `release-blocked op viewport` | ScenarioEngine uitgespeeld; `Echt`/`Phishing` labels en completionbewijs zichtbaar | Chrome viewportmatrix en echte iPad/Safari-check |
| `security-auditor` | `@Chrome desktop pass` | `release-blocked op viewport` | PuzzleLab uitgespeeld met bewuste fout; recovery en `Bewijs compleet` zichtbaar | Chrome viewportmatrix en echte iPad/Safari-check |
| `digital-forensics` | `@Chrome desktop pass` | `release-blocked op viewport` | ScenarioEngine uitgespeeld; `Feit`/`Aanname` labels en completionbewijs zichtbaar | Chrome viewportmatrix en echte iPad/Safari-check |
| `security-review` | `@Chrome desktop pass` | `release-blocked op viewport` | ReviewArena uitgespeeld; categoriseren heeft expliciete `Plaats hier` actie; docentbewijs zichtbaar | Chrome viewportmatrix en echte iPad/Safari-check |

### J3 P3 - Maatschappelijke Impact & Innovatie

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `startup-simulator` | `@Chrome desktop pass` | `release-blocked op viewport` | BuilderCanvas uitgespeeld: `Canvasbewijs compleet`, 100/100, docentbewijs zichtbaar | iPad/mobile Chrome-matrix nog doen |
| `policy-maker` | `@Chrome desktop pass` | `release-blocked op viewport` | DebateArena uitgespeeld: stakeholders gelezen, positie/argumenten/reflectie, `Debatbewijs compleet` | iPad/mobile Chrome-matrix nog doen |
| `innovation-lab` | `@Chrome desktop pass` | `release-blocked op viewport` | BuilderCanvas uitgespeeld: `Canvasbewijs compleet`, 100/100, docentbewijs zichtbaar | iPad/mobile Chrome-matrix nog doen |
| `digital-divide-researcher` | `@Chrome desktop pass` | `release-blocked op viewport` | DataViewer uitgespeeld: `Bewijs compleet`, 100/100; te vage tekst geblokkeerd | iPad/mobile Chrome-matrix nog doen |
| `tech-impact-analyst` | `@Chrome desktop pass` | `release-blocked op viewport` | DataViewer uitgespeeld: `Bewijs compleet`, 100/100; scorecontract hersteld | iPad/mobile Chrome-matrix nog doen |
| `welzijnsonderzoeker` | `@Chrome desktop pass` | `release-blocked op viewport` | DataViewer uitgespeeld: `Bewijs compleet`, 100/100; correlatie/causaliteit-bewijs zichtbaar | iPad/mobile Chrome-matrix nog doen |
| `startup-pitch` | `@Chrome desktop pass` | `release-blocked op viewport` | ToolGuide uitgespeeld: bewuste fout gaf feedback, `Pitchbewijs compleet`, docentbewijs zichtbaar | iPad/mobile Chrome-matrix nog doen |
| `impact-review` | `@Chrome desktop pass` | `release-blocked op viewport` | ReviewArena uitgespeeld: alle rondes, `Bewijs compleet`, 100/100; niet-blokkerende Chrome async-message errors gezien | iPad/mobile Chrome-matrix nog doen |

### J3 P4 - Meesterproef

| Opdracht | Status | Oordeel | Bewijs | Volgende actie |
|---|---|---|---|---|
| `portfolio-builder` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J3 P4 batch |
| `research-project` | `browser smoke` | `menselijke keuze nodig` | Brede audit, DataViewer/no-button | Review in J3 P4 batch |
| `prototype-developer` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J3 P4 batch |
| `pitch-perfect` | `browser smoke` | `menselijke keuze nodig` | Brede audit met completionbewijs | Review in J3 P4 batch |
| `reflection-report` | `browser smoke` | `menselijke keuze nodig` | Brede audit, debate completion onzeker | Review in J3 P4 batch |
| `meesterproef` | `browser smoke` | `menselijke keuze nodig` | Brede audit, builder completion onzeker | Review in J3 P4 batch |

## Vaste Reviewstraat Voor Nieuwe Batches

Gebruik dit ritme voor elk nieuw perioderapport:

1. Intake: periode, missie-ID's, doelgroep, risico en bestaand bewijs uit dit dashboard.
2. Static inspectie: curriculum, template registry, missieconfig, SLO/goal/evidence en relevante engine.
3. Chrome-check: desktop/laptop, iPad portrait, iPad landscape en mobile.
4. Visual Precision Gate: alignment, overlap, text-fit, spacing, canvas/game-fit en volledige flowstatus.
5. Didactiek: leerdoel, cognitieve belasting, feedback, docentbewijs en curriculum-fit.
6. Tech: route, state, scoring, completion, console errors en regressierisico.
7. Conclusie per opdracht: `ship`, `fix-eerst` of `menselijke keuze nodig`.
8. Update dit dashboard met status, bewijsniveau, hoofdblokker en eerstvolgende actie.

## Rapporttemplate Per Periode

Gebruik voor nieuwe rapporten deze vaste bestandsnaam:

`docs/audits/dgskills-j<leerjaar>p<periode>-workability-audit-YYYY-MM-DD.md`

Minimale inhoud:

- Scope: alle curriculum- en reviewopdrachten in de periode, plus assessmentlaag als context.
- Bewijsbasis: commands, browsermethode, viewportmatrix en artifactlocaties.
- Verificatie per opdracht: route, doel zichtbaar, eerste interactie, responsive start, completion/eindstaat en oordeel.
- Design, didactiek en tech apart.
- Topbevindingen met file:regel waar productcode wordt aangehaald.
- Beperkingen: vooral echte iPad/Safari en eventuele Chrome-plugin fallback.
- Herstelplan: alleen concrete blockers, geen brede refactor zonder bewijs.

## Hercheckregels Na Fixes

Na productfixes draait Codex geen volledige 96-opdrachten audit tenzij daar expliciet om wordt gevraagd.

Minimale hercheck:

- De gefixte opdracht op desktop/laptop, iPad portrait, iPad landscape en mobile.
- Een tweede opdracht binnen dezelfde gedeelde template-engine als regressieproef.
- `npm run typecheck` als TypeScript of shared componenten zijn geraakt.
- Gerichte smoke of bestaand checkscript als de batch er een heeft.
- Dashboardregel bijwerken: status, bewijs, oordeel en resterend risico.

## Beslisregels Voor Yorin

Per batch hoeft Yorin alleen deze keuze te maken:

| Keuze | Wanneer gebruiken | Codex-actie |
|---|---|---|
| Fixes uitvoeren | Blockers zijn technisch en helder | Maak klein herstelplan en implementeer gericht |
| Opdracht parkeren | Opdracht is niet urgent of didactisch onzeker | Markeer `menselijke keuze nodig` en sla batch tijdelijk over |
| Didactisch herijken | Leerdoel, periodefit of docentbewijs is twijfelachtig | Maak inhoudelijke herijkingsnotitie, geen codefix |

## Bronnen

- `docs/audits/dgskills-all-missions-goal-review-audit-2026-05-10.md`
- `docs/audits/dgskills-j2p2-workability-audit-2026-05-15.md`
- `docs/audits/dgskills-j2p3-workability-audit-2026-05-16.md`
- `docs/audits/dgskills-all-years-fun-gamification-audit-2026-05-16.md`
- `docs/audits/dgskills-all-years-completion-fix-plan-2026-05-17.md`
- `src/config/curriculum.ts`
