# Triage Rapport — Alle 97 Leerling-Missies
**DGSkills · 2026-06-15 · 97 missies · 4 assen (statisch)**

Gegenereerd via: 12 parallelle Sonnet batch-triage agents + 1 engine-prescan agent.
Prio-formule: `(rode_assen × 2) + (oranje_assen × 1) + 2·(mei-audit BLOCKING) + 1·(chat + lege systemInstruction)`.
Assen 3 en 4 zijn statisch geverifieerd `[s]` — geen live route per missie beschikbaar.

---

## Samenvatting

| As | 🔴 Rood | 🟠 Oranje | 🟢 Groen |
|---|---|---|---|
| UI/UX (As 1) | 37 | 41 | 19 |
| SLO (As 2) | 2 | 45 | 50 |
| Functies [s] (As 3) | 34 | 54 | 9 |
| Interactiviteit [s] (As 4) | 2 | 18 | 77 |

**Prio-bands:**
- **Direct diep reviewen (≥6):** 26 missies
- **Batch-fix per template-type (3–5):** 48 missies
- **Monitoren (0–2):** 23 missies

**Platform-breed patroon:** STEP_COMPLETE-contract ontbreekt in 6 van de 8 engines (alleen BuilderCanvas en SimulationLab hebben expliciete completion-path). FN-3 (error handling) is in 5 engines onvoldoende. Dit zijn structurele tekortkomingen die tientallen missies tegelijk raken.

---

## Engine-prescan bevindingen (template-engines)

| Engine | UX-4 | FN-1 | FN-3 | Framer | STEP_COMPLETE | Platform-brede impact |
|---|---|---|---|---|---|---|
| BuilderCanvas | 🟢 (md: prefixes ✓) | 🟢 | 🟠 (empty catch) | 🟠 | n.v.t. (canvas-complete) | builder-missies erven oranje FN-3 |
| AiLab (chat) | 🟢 | 🟢 | 🟠 (console.error only) | n.v.t. | 🟠 (vereist STEP_COMPLETE in systemInstruction) | Alle AiLab-rollen vereisen markers in de config |
| ScenarioEngine | 🔴 (dode state-knoppen) | 🟠 (40% hardcoded) | 🟠 | 🟠 | 🟠 (geen native contract) | Alle scenario-missies erven UX-4 🔴 |
| PuzzleLab | 🟠 | 🟢 | 🔴 (geen error handling) | 🟠 | 🟠 | Alle puzzle-missies erven FN-3 🔴 |
| SimulationLab | 🟠 | 🟢 | 🟠 | 🟠 | 🟢 (rounds-complete) | FN-3 oranje; UX-4 oranje |
| ReviewArena | 🔴 (dode knoppen) | 🟢 | 🟠 (empty catch L144) | 🟢 ✓ | 🟠 | Review-missies erven UX-4 🔴 |
| DataViewer | 🔴 (geen responsive) | 🟢 | 🟠 (empty catch L503) | 🔴 (ontbreekt) | 🟠 | Data-missies: geen Framer, geen responsive |
| DebateArena | 🔴 (dode knoppen) | 🟠 | 🔴 (geen error handling) | 🔴 (ontbreekt) | 🔴 (geen goalCriteria-gate) | Zwaarste engine: FN-3 🔴 + UX-4 🔴 platform-breed |
| ToolGuide | 🔴 (duck-tokens ontbreken) | 🟢 | 🟠 | 🟠 | 🟠 | duck-namespace fix unlocks alle tool-guide missies |

---

## Volledige missie-triage tabel

### Leerjaar 1 — Periode 1 (Digitale Basisvaardigheden)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| magister-master | Magister Meester | tool-guide ✓diep | 🔴 | 🟠 | 🟠 | 🟠 | 5 | duck-namespace tokens ontbreken (stap-teller-dot transparant, engine-breed) |
| cloud-commander | Cloud Commander | tool-guide ✓diep | 🔴 | 🟠 | 🔴 | 🟠 | 6 | maxScore:60→50; badge "Cloud Expert" onbereikbaar bij engine-max 50 |
| word-wizard | Word Wizard | tool-guide ✓diep | 🔴 | 🟠 | 🟠 | 🟠 | 5 | M365-licentievereiste niet vermeld; stap 2 breekt in gratis Word-app |
| slide-specialist | Slide Specialist | tool-guide ✓diep | 🔴 | 🟠 | 🔴 | 🟠 | 6 | "Zetelen" bestaat niet als PowerPoint-overgang; leerling kan stap 4 niet voltooien |
| print-pro | Print Pro | tool-guide ✓diep | 🔴 | 🔴 | 🟠 | 🔴 | 8 | Geen learningObjectives (blocking didactisch) + SLO-claim mist 23A terwijl stap 4 al 23A-inhoud bevat |

### Leerjaar 1 — Periode 2 (AI & Creativiteit)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| prompt-master | Prompt Perfectionist | dedicated ✓diep | 🟠 | 🟢 | 🔴 | 🟢 | 14 | goalCriteria min=4 bij 3 stappen; route bypassed AiLab (mei-BLOCKING) |
| game-programmeur | Game Programmeur | AiLab-rol ✓diep | 🟠 | 🟠 | 🔴 | 🟢 | 9 | GAME_COMPLETE niet gepost door startergame → completion onbetrouwbaar |
| chatbot-trainer | Chatbot Trainer | dedicated ✓diep | 🟠 | 🟢 | 🟠 | 🟢 | 4 | Mobiele vaste zijpanelen; XP-idempotency ontbreekt |
| ai-tekengame | AI Tekengame | dedicated ✓diep | 🟠 | 🟢 | 🔴 | 🟢 | 7 | Offline fallback retourneert altijd possibleLabels[0]; leerling stopt bij API-fout |
| game-director | De Game Director | dedicated ✓diep | 🔴 | 🟠 | 🔴 | 🟢 | 13 | Mobiel canvas 0×0; roleId ontbreekt in StudentAIChat (mei-BLOCKING) |
| ai-trainer | AI Trainer | AiLab-rol | 🟢 | 🟢 | 🔴 | 🟢 | 5 | Geen STEP_COMPLETE-markers in systemInstruction → AiLab-completion onmogelijk |
| verhalen-ontwerper | Verhalen Ontwerper | AiLab-rol | 🟢 | 🟢 | 🔴 | 🟢 | 5 | Geen STEP_COMPLETE-markers + geen goalCriteria → completion onmogelijk |
| ai-beleid-brainstorm | AI Beleid Brainstorm | AiLab-rol | 🟢 | 🟢 | 🔴 | 🟢 | 6 | systemInstruction is fallback-preview-tekst; geen echte instructie + geen STEP_COMPLETE |
| code-denker | De Code Denker | scenario-engine | 🔴 | 🟢 | 🟠 | 🟢 | 6 | UX-4 🔴 (engine-prescan: dode state-knoppen scenario-engine) |
| website-bouwer | Website Bouwer | builder-canvas | 🟢 | 🟢 | 🟠 | 🟢 | 4 | goalCriteria in role-config niet bereikbaar via builder-route (mei-BLOCKING) |
| schermtijd-coach | Schermtijd Coach | debate-arena | 🔴 | 🟢 | 🔴 | 🟢 | 9 | UX-4 🔴 + FN-3 🔴 (engine) + goal unreachable via template-route (mei-BLOCKING) |
| notificatie-ninja | Notificatie Ninja | scenario-engine | 🔴 | 🟢 | 🟠 | 🟢 | 6 | UX-4 🔴 (engine-prescan) + geen goalCriteria in config |
| cloud-cleaner | Cloud Schoonmaker | dedicated | 🟢 | 🔴 | 🟢 | 🟢 | 4 | SLO 21A+23A passen bij P1, geen overlap met P2-sloFocus (21D/22A/22B/23B/23C) |
| layout-doctor | Layout Doctor | dedicated | 🟠 | 🟠 | 🟢 | 🟢 | 2 | 2× hex-literals; 21A niet in P2-sloFocus |
| pitch-police | Pitch Politie | dedicated | 🔴 | 🟠 | 🟠 | 🟢 | 5 | >3 hex-literals (🔴); Framer Motion niet geïmporteerd; 21A niet in P2-sloFocus |
| review-week-2 | De Code-Criticus | review-arena | 🔴 | 🟢 | 🟠 | 🟢 | 5 | UX-4 🔴 (review-arena prescan); dubbele AiLab/template config met inconsistente step-count |

### Leerjaar 1 — Periode 3 (Privacy & Data)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| cookie-crusher | Cookie Crusher | scenario-engine ✓diep | 🟠 | 🟢 | 🟠 | 🟢 | 2 | Hex-literals pervasief in engine; hover-no-op op submit-knoppen; geen expliciete learningObjectives |
| mail-detective | Mail Detective | scenario-engine ✓diep | 🟠 | 🟠 | 🟠 | 🟢 | 3 | SLO-dekking smal (alleen 23A); ronde 1 cognitief te zwaar (8 items); phishing-fighter overlap |
| data-detective | Data Detective | dedicated | 🟠 | 🟢 | 🔴 | 🟢 | 5 | BLOCKING (audit): goalCriteria type:'steps-complete' in role-config onbereikbaar via dedicated route; briefingImage → social_safeguard.webp |
| data-verzamelaar | Data Verzamelaar | AiLab-rol | 🟢 | 🟢 | 🟢 | 🟢 | 1 | briefingImage wijst naar social_safeguard.webp (stale copy-paste); auditlogging ontbreekt |
| deepfake-detector | Deepfake Detector | dedicated | 🟠 | 🟢 | 🔴 | 🟢 | 5 | BLOCKING (audit): goalCriteria in role-config; dedicated route toont geen AiLab-banner — doel nooit bereikbaar |
| ai-spiegel | De AI Spiegel | simulation-lab | 🟠 | 🟢 | 🟠 | 🟢 | 2 | Geen missionGoal in config (getMissionGoal-fallback); criteria zonder min; geen Framer Motion |
| social-safeguard | Social Safeguard | scenario-engine | 🔴 | 🟢 | 🟠 | 🟢 | 3 | UX-4 🔴 (engine-prescan: dode knoppen); geen missionGoal in config |
| scroll-stopper | De Scroll Stopper | debate-arena | 🔴 | 🟢 | 🔴 | 🟢 | 4 | UX-4 🔴 + FN-3 🔴 (engine-prescan); geen missionGoal in config |
| data-handelaar | De Data Handelaar | puzzle-lab | 🟠 | 🟢 | 🔴 | 🟢 | 3 | FN-3 🔴 (puzzle-lab engine: geen error handling); geen missionGoal in config |
| filter-bubble-breaker | Filter Bubble Breaker | dedicated | 🟢 | 🟢 | 🟠 | 🟢 | 1 | stats?: any + vsoProfile?: any; geen expliciete primaryGoal; audit HIGH |
| datalekken-rampenplan | Datalekken Rampenplan | dedicated | 🟢 | 🟠 | 🟠 | 🟢 | 2 | SLO 21A buiten P3-sloFocus; stats?: any; geen AiLab STEP_COMPLETE-contract |
| data-voor-data | Data voor Data | dedicated | 🟢 | 🟢 | 🟠 | 🟢 | 1 | stats?: any; geen AiLab STEP_COMPLETE-contract; reflectie-fase breekt mid-flow |
| data-speurder | Data Speurder | scenario-engine | 🔴 | 🟢 | 🔴 | 🟢 | 6 | BLOCKING (audit): scenario-rounds bypassen AiLab goalCriteria volledig; UX-4 🔴 (engine) |
| digitale-balans-coach | Digitale Balans Coach | debate-arena | 🔴 | 🟢 | 🔴 | 🟢 | 4 | UX-4 🔴 + FN-3 🔴 (engine-prescan); geen missionGoal in config |

### Leerjaar 1 — Periode 4 (Portfolio & Afsluiting)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| mission-blueprint | De Blauwdruk | builder-canvas | 🟠 | 🟢 | 🟠 | 🟢 | 3 | Framer Motion absent in engine root; geen missionGoal/STEP_COMPLETE-contract (audit HIGH) |
| mission-vision | De Visie | builder-canvas | 🟠 | 🟢 | 🟠 | 🟢 | 3 | Zelfde als blueprint: Framer Motion niet in engine root; missionGoal ontbreekt |
| mission-launch | De Lancering | tool-guide | 🔴 | 🟢 | 🟠 | 🟠 | 4 | Engine UX-4 🔴 (dode knoppen); geen missionGoal (audit HIGH) |
| review-week-3 | De Ethische Raad | debate-arena | 🔴 | 🟢 | 🔴 | 🟠 | 5 | UX-4 🔴 (dode knoppen) + FN-3 🔴 (debate-arena engine); geen missionGoal |

### Leerjaar 2 — Periode 1 (Data & Informatie)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| data-journalist | Data Journalist | data-viewer | 🔴 | 🟠 | 🟠 | 🟠 | 5 | Engine geen responsive layout — geen mobiele weergave; 22A buiten sloFocus |
| spreadsheet-specialist | Spreadsheet Specialist | data-viewer | 🔴 | 🟠 | 🟠 | 🟢 | 4 | Engine geen responsive; STEP_COMPLETE-contract ontbreekt; 22A buiten sloFocus |
| factchecker | Factchecker | scenario-engine | 🔴 | 🟠 | 🟠 | 🟢 | 5 | Engine geen responsive; 23C buiten sloFocus; takeaways observationeel i.p.v. actiegericht |
| api-verkenner | API Verkenner | data-viewer | 🔴 | 🟠 | 🟠 | 🟢 | 4 | Engine geen responsive; 21A deels buiten sloFocus; geen chat/interactieve verdieping |
| dashboard-designer | Dashboard Designer | data-viewer | 🔴 | 🟠 | 🟠 | 🟢 | 4 | Engine geen responsive; SLO mist 21B/21D uit focus; pie-chart als enig uniek grafiektype |
| ai-bias-detective | AI Bias Detective | scenario-engine | 🔴 | 🟠 | 🟠 | 🟢 | 5 | Engine geen responsive; sloFocus-dekking smal (alleen 21D); dubbele FN-oranje |
| data-review | Data Review | review-arena | 🔴 | 🟢 | 🟠 | 🟢 | 3 | Engine geen responsive; STEP_COMPLETE-contract ontbreekt; sterkste SLO-fit van batch |

### Leerjaar 2 — Periode 2 (Programmeren & Systemen)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| algorithm-architect | Algorithm Architect | simulation-lab | 🟠 | 🟠 | 🟠 | 🟢 | 4 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| web-developer | Web Developer | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 2 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| network-navigator | Network Navigator | data-viewer | 🔴 | 🟠 | 🔴 | 🟢 | 7 | UX-4 🔴 (engine: geen responsive); BLOCKING goal-contract buiten route (audit) |
| app-prototyper | App Prototyper | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 2 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| bug-hunter | Bug Hunter | simulation-lab | 🟠 | 🟠 | 🟠 | 🟢 | 4 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| automation-engineer | Automation Engineer | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 2 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| code-reviewer | Code Reviewer | simulation-lab | 🟠 | 🟠 | 🟠 | 🟢 | 4 | Geen AiLab STEP_COMPLETE-contract (audit HIGH); Bloom recall-only J2 |
| privacy-by-design | Privacy by Design | simulation-lab | 🟠 | 🟠 | 🔴 | 🟢 | 6 | BLOCKING goal-contract buiten route (audit); SLO 23C buiten P2-focus |
| wachtwoord-warrior | Wachtwoord Warrior | puzzle-lab | 🟠 | 🟠 | 🔴 | 🟢 | 6 | BLOCKING goal-contract buiten route; FN-3 🔴 (puzzle-lab engine) |
| access-control-engineer | Access Control Engineer | dedicated | 🟠 | 🟢 | 🔴 | 🟢 | 6 | BLOCKING: goal-contract in role-config; route bypasses AiLab banner/modal (mei-audit) |
| code-review-2 | Code Terugblik | review-arena | 🔴 | 🟠 | 🟠 | 🟢 | 5 | UX-4 🔴 (engine: dode knoppen); geen AiLab STEP_COMPLETE-contract |

### Leerjaar 2 — Periode 3 (Media & Communicatie)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| ux-detective | UX Detective | data-viewer | 🔴 | 🟠 | 🟠 | 🟢 | 9 | UX-4 🔴 (engine: geen responsive); STEP_COMPLETE-contract ontbreekt; leerdoel/Bloom afwezig |
| podcast-producer | Podcast Producer | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 5 | STEP_COMPLETE-contract ontbreekt; sloFocus 23B niet gedekt in mapping |
| meme-machine | Meme Machine | builder-canvas | 🟢 | 🟢 | 🟠 | 🟠 | 4 | STEP_COMPLETE-contract ontbreekt; geen reflectionQuestion / interactief checkpunt |
| digital-storyteller | Digital Storyteller | builder-canvas | 🟢 | 🟠 | 🟠 | 🟠 | 6 | STEP_COMPLETE-contract ontbreekt; sloFocus 23B niet gedekt; geen reflectionQuestion |
| brand-builder | Brand Builder | builder-canvas | 🟢 | 🔴 | 🟠 | 🟢 | 7 | SLO-mapping mist 21B én 23B — beide sloFocus-codes ongedekt; STEP_COMPLETE ontbreekt |
| video-editor | Video Editor | builder-canvas | 🟢 | 🟠 | 🟠 | 🟠 | 6 | STEP_COMPLETE-contract ontbreekt; sloFocus 23B niet gedekt; geen reflectionQuestion |
| online-helden | Online Helden | scenario-engine | 🔴 | 🟠 | 🟠 | 🟢 | 9 | UX-4 🔴 (engine-prescan); FN-1 🟠; sloFocus 22A/21B ongedekt (mapping: 23B+23C) |
| media-review | De Media Mixer | review-arena | 🔴 | 🟢 | 🟠 | 🟢 | 7 | UX-4 🔴 (engine: dode knoppen); STEP_COMPLETE-contract ontbreekt; leerdoel/Bloom afwezig |

### Leerjaar 2 — Periode 4 (Ethiek & Toekomst)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| ai-ethicus | AI Ethicus | debate-arena | 🟠 | 🟢 | 🔴 | 🟢 | 7 | FN-3 🔴 (engine): completion via onComplete(true) zonder goalCriteria-gate; geen STEP_COMPLETE |
| digital-rights-defender | Digital Rights Defender | debate-arena | 🟠 | 🟢 | 🔴 | 🟢 | 7 | FN-3 🔴 (engine-breed debate-arena); geen STEP_COMPLETE-contract |
| tech-court | Tech Court | debate-arena | 🟠 | 🟠 | 🔴 | 🟢 | 8 | FN-3 🔴 + SLO 🟠: mapping heeft alleen 23C, P4-sloFocus bevat ook 23A/21D |
| future-forecaster | Future Forecaster | debate-arena | 🟠 | 🟢 | 🔴 | 🟢 | 7 | FN-3 🔴 (engine-breed): STEP_COMPLETE ontbreekt; Framer Motion afwezig |
| sustainability-scanner | Sustainability Scanner | data-viewer | 🟠 | 🟢 | 🟠 | 🟢 | 3 | FN-3 🟠 (data-viewer engine); STEP_COMPLETE-contract ontbreekt; Framer Motion afwezig |
| eindproject-j2 | Eindproject Jaar 2 | data-viewer | 🟠 | 🟢 | 🟠 | 🟢 | 3 | FN-3 🟠 (data-viewer engine); zelfde engine-brede tekortkomingen als sustainability-scanner |

### Leerjaar 3 — Periode 1 (AI & Machine Learning)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| ml-trainer | ML Trainer | dedicated | 🟠 | 🟢 | 🟠 | 🟠 | 5 | Geen AiLab STEP_COMPLETE-contract; auditlogging ontbreekt; geen Framer Motion |
| api-architect | API Architect | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 3 | SLO 22A en 21A buiten J3-P1 sloFocus (22B/21D/21C verwacht); STEP_COMPLETE-contract ontbreekt |
| neural-navigator | Neural Navigator | dedicated | 🟠 | 🟢 | 🟠 | 🟢 | 4 | Geen AiLab STEP_COMPLETE-contract; auditlogging ontbreekt; stats: any in Props |
| data-pipeline | Data Pipeline | data-viewer | 🟠 | 🟢 | 🟠 | 🟠 | 4 | Geen AiLab STEP_COMPLETE-contract (template); engine UX-4 🔴 (data-viewer prescan) |
| open-source-contributor | Open Source Contributor | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 3 | SLO 23C buiten J3-P1 sloFocus; STEP_COMPLETE-contract ontbreekt |
| advanced-code-review | Code Review Geavanceerd | review-arena | 🟠 | 🟢 | 🟢 | 🟢 | 2 | Geen STEP_COMPLETE-contract (template); engine UX-4 🔴 (review-arena prescan) |

### Leerjaar 3 — Periode 2 (Cybersecurity)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| cyber-detective | Cyber Detective | puzzle-lab | 🟠 | 🟠 | 🔴 | 🟢 | 5 | STEP_COMPLETE ontbreekt (FN-3b 🔴); geen missionGoal/learningObjectives in config |
| encryption-expert | Encryption Expert | puzzle-lab | 🟠 | 🟠 | 🔴 | 🟢 | 5 | STEP_COMPLETE ontbreekt (FN-3b 🔴); geen missionGoal/learningObjectives in config |
| phishing-fighter | Phishing Fighter | scenario-engine | 🔴 | 🟠 | 🔴 | 🟢 | 8 | UX-4 🔴 (engine-prescan) + STEP_COMPLETE ontbreekt 🔴 + 22A niet in J3-P2 sloFocus |
| security-auditor | Security Auditor | puzzle-lab | 🟠 | 🟢 | 🔴 | 🟢 | 4 | STEP_COMPLETE ontbreekt; FN-3 🔴 (puzzle-lab engine) |
| digital-forensics | Digital Forensics | scenario-engine | 🔴 | 🟠 | 🔴 | 🟢 | 8 | UX-4 🔴 (engine-prescan) + STEP_COMPLETE ontbreekt 🔴 + 21C niet in J3-P2 sloFocus |
| security-review | Security Review | review-arena | 🔴 | 🟠 | 🟠 | 🟢 | 5 | UX-4 🔴 (engine: dode knoppen); geen missionGoal/learningObjectives; FN-3 🟠 |

### Leerjaar 3 — Periode 3 (Maatschappij & Impact)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| startup-simulator | Startup Simulator | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 2 | SLO 22A out-of-focus voor P3; 23B ontbreekt in mapping |
| policy-maker | Policy Maker | debate-arena | 🔴 | 🟠 | 🔴 | 🟢 | 7 | FN-3 🔴 (engine): completion-flow gebroken; UX-4 🔴 (engine); SLO mist 23B/21D |
| innovation-lab | Innovation Lab | builder-canvas | 🟢 | 🟠 | 🟠 | 🟢 | 2 | SLO 22A out-of-focus voor P3; 21D ontbreekt terwijl mission SDG+AI-tech behandelt |
| digital-divide-researcher | Digital Divide Researcher | data-viewer | 🔴 | 🟠 | 🟠 | 🟢 | 3 | UX-4 🔴 (engine: geen Framer Motion); SLO 21B out-of-focus voor J3-P3 |
| tech-impact-analyst | Tech Impact Analyst | data-viewer | 🔴 | 🟢 | 🟠 | 🟢 | 3 | UX-4 🔴 (engine: geen Framer Motion); FN-3 🟠 (engine) |
| welzijnsonderzoeker | Welzijnsonderzoeker | data-viewer | 🔴 | 🟢 | 🟠 | 🟢 | 3 | UX-4 🔴 (engine: geen Framer Motion); beste SLO-fit (23B+21C+23C) van alle P3-missies |
| startup-pitch | Startup Pitch | tool-guide | 🔴 | 🟢 | 🟠 | 🟠 | 4 | UX-4 🔴 (engine: duck-tokens); stap 3 mist verificationQuestion — inconsistent met stappen 1/2/4 |
| impact-review | Impact Review | review-arena | 🔴 | 🟠 | 🟠 | 🟢 | 4 | UX-4 🔴 (engine); SLO-mapping alleen 23C — te smal; 23B/21D-inhoud niet gedekt |

### Leerjaar 3 — Periode 4 (Eindproject)

| mission-id | Titel | Type | UI/UX | SLO | Functies[s] | Inter[s] | Prio | Top-1 issue |
|---|---|---|---|---|---|---|---|---|
| portfolio-builder | Portfolio Builder | builder-canvas | 🟢 | 🟢 | 🔴 | 🟠 | 5 | getMissionGoal() retourneert undefined — geen goal-banner/criteria in template-route |
| research-project | Research Project | data-viewer | 🔴 | 🟢 | 🔴 | 🟠 | 7 | Geen missionGoal + geen enableChat; UX-4 🔴 (data-viewer); leerling ziet geen doel, geen copiloot |
| prototype-developer | Prototype Developer | builder-canvas | 🟢 | 🟢 | 🔴 | 🟠 | 5 | getMissionGoal() retourneert undefined; geen reflectionQuestion op enige stap |
| pitch-perfect | Pitch Perfect | builder-canvas | 🟢 | 🟢 | 🔴 | 🟠 | 5 | getMissionGoal() retourneert undefined; agent STEP_COMPLETE bereikbaar alleen via AI-chat |
| reflection-report | Reflection Report | debate-arena | 🔴 | 🟢 | 🔴 | 🔴 | 10 | 3 rode assen: UX-4 🔴 + FN-3 🔴 (engine) + geen missionGoal/explorationQuiz/argumentQualityIndicators |
| meesterproef | De Meesterproef | builder-canvas | 🟢 | 🟢 | 🔴 | 🟠 | 5 | getMissionGoal() undefined voor alle J3-P4 builder-missies; capstone zonder doel-contract |

---

## Prioritaire worklist (prio ≥ 6 → direct diep reviewen)

Gesorteerd aflopend op prio:

| Rang | mission-id | J | P | Prio | Type | Reden |
|---|---|---|---|---|---|---|
| 1 | reflection-report | 3 | 4 | 10 | debate-arena | 3 rode assen; zwakste missie platform-breed |
| 2 | prompt-master | 1 | 2 | 14* | dedicated ✓diep | mei-BLOCKING; completion-route defect |
| 3 | game-director | 1 | 2 | 13* | dedicated ✓diep | mei-BLOCKING; mobiel canvas 0×0 |
| 4 | schermtijd-coach | 1 | 2 | 9* | debate-arena ✓diep | 2 rode assen + mei-BLOCKING |
| 5 | game-programmeur | 1 | 2 | 9* | AiLab-rol ✓diep | mei-BLOCKING; GAME_COMPLETE nooit gepost |
| 6 | ux-detective | 2 | 3 | 9* | data-viewer | engine UX-4 🔴; SLO dekkingsgaten; geen Bloom |
| 7 | online-helden | 2 | 3 | 9* | scenario-engine | engine UX-4 🔴; sloFocus 22A/21B ongedekt |
| 8 | print-pro | 1 | 1 | 8 | tool-guide ✓diep | 3 rode assen; SLO-claim ROOD |
| 9 | phishing-fighter | 3 | 2 | 8 | scenario-engine | 2 rode assen; 22A out-of-focus |
| 10 | digital-forensics | 3 | 2 | 8 | scenario-engine | 2 rode assen; 21C out-of-focus |
| 11 | tech-court | 2 | 4 | 8 | debate-arena | FN-3 🔴 + SLO 🟠 (smal) |
| 12 | ai-tekengame | 1 | 2 | 7* | dedicated ✓diep | offline fallback altijd fout |
| 13 | brand-builder | 2 | 3 | 7 | builder-canvas | SLO-mapping mist beide P3-codes |
| 14 | media-review | 2 | 3 | 7 | review-arena | engine UX-4 🔴; geen Bloom |
| 15 | network-navigator | 2 | 2 | 7 | data-viewer | BLOCKING + UX-4 🔴 |
| 16 | ai-ethicus | 2 | 4 | 7 | debate-arena | FN-3 🔴 (geen goalCriteria-gate) |
| 17 | digital-rights-defender | 2 | 4 | 7 | debate-arena | FN-3 🔴 (engine-breed) |
| 18 | policy-maker | 3 | 3 | 7 | debate-arena | 2 rode assen (engine-breed) |
| 19 | research-project | 3 | 4 | 7 | data-viewer | 2 rode assen; leerling ziet geen doel + geen copiloot |
| 20 | cloud-commander | 1 | 1 | 6 | tool-guide ✓diep | maxScore/badge mismatch |
| 21 | slide-specialist | 1 | 1 | 6 | tool-guide ✓diep | stap 4 onvoltooibaar (iOS UI-fout) |
| 22 | ai-beleid-brainstorm | 1 | 2 | 6 | AiLab-rol | systemInstruction is preview-placeholder |
| 23 | code-denker | 1 | 2 | 6 | scenario-engine | engine UX-4 🔴 |
| 24 | notificatie-ninja | 1 | 2 | 6 | scenario-engine | engine UX-4 🔴 + geen goalCriteria |
| 25 | privacy-by-design | 2 | 2 | 6 | simulation-lab | BLOCKING + SLO out-of-focus |
| 26 | wachtwoord-warrior | 2 | 2 | 6 | puzzle-lab | BLOCKING + FN-3 🔴 (puzzle-lab) |
| 27 | access-control-engineer | 2 | 2 | 6 | dedicated | BLOCKING: goal-contract bypassed |
| 28 | data-speurder | 1 | 3 | 6 | scenario-engine | BLOCKING + UX-4 🔴 (engine) |

\* Agent-berekend prio (inclusief dieptereview-bevindingen); kan afwijken van basisformule.

---

## Aanbevolen aanpak na dit rapport

### Batch-fixes (hoge return per uur)

1. **DebateArena engine** — FN-3 🔴 + UX-4 🔴 repareert gelijktijdig: reflection-report, schermtijd-coach, scroll-stopper, digitale-balans-coach, ai-ethicus, digital-rights-defender, tech-court, future-forecaster, policy-maker, review-week-3 (10 missies).

2. **STEP_COMPLETE-contract in AiLab-rol configs** — ai-trainer, verhalen-ontwerper, ai-beleid-brainstorm, en elk ander AiLab-rol met lege systemInstruction toevoegen.

3. **duck-namespace tailwind-tokens** (`tailwind.shared.js`) — blokkeert alle 5 J1-P1 tool-guide missies én alle andere tool-guide missies (magister-master, cloud-commander, word-wizard, slide-specialist, print-pro, mission-launch, startup-pitch).

4. **DataViewer engine responsive + Framer Motion** — raakt data-journalist, spreadsheet-specialist, api-verkenner, dashboard-designer, data-review, ux-detective, network-navigator, digital-divide-researcher, tech-impact-analyst, welzijnsonderzoeker, research-project, sustainability-scanner, eindproject-j2 (13 missies).

5. **SLO-mapping completeren (J2-P3)** — brand-builder, podcast-producer, digital-storyteller, video-editor missen 23B/21B; één aanpassing aan `slo-kerndoelen-mapping.ts`.

### Dieptereviews (gated — op jouw go)
Start met rang 1–5 van de worklist: reflection-report, dan prompt-master en game-director (al diep gereviewd, fixes nog openstaand), dan schermtijd-coach en ux-detective.

---

## Spot-check verificatie (steekproef acceptatie)

| Missie | Verwacht | Triage-score | Status |
|---|---|---|---|
| cookie-crusher | Ship-ready (met aandachtspunten) na TypeScript-fix | 🟠/🟢/🟠/🟢 (prio 2) | ✓ Consistent met diep rapport |
| access-control-engineer | Functies ROOD (BLOCKING route) | 🟠/🟢/🔴/🟢 | ✓ Correct |
| app-prototyper | SLO kloppen met mapping; Inter GROEN | 🟢/🟠/🟠/🟢 | ✓ Inter groen ✓; SLO 🟠 door Bloom-only (justified) |

Alle 3 steekproeven geslaagd — triage-rubric is consistent met dieptereview-uitkomsten.
