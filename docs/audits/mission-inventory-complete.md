# DGSkills Missie-inventarisatie — Fase 0

> Gegenereerd: 2026-04-01
> Bronnen: `config/agents.tsx`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`
> Doel: Master tracking document voor systematische missie-audit

---

## Samenvatting

| Metric | Waarde |
|--------|--------|
| **Totaal missies geïnventariseerd** | 94 (excl. bonus-items en assessments) |
| **Volledig compleet** | 3 (`data-verzamelaar`, `network-navigator`, `privacy-by-design`) |
| **Standalone (bewust geen SI)** | 3 (`cloud-cleaner`, `layout-doctor`, `pitch-police`) |
| **Te auditen** | 88 |
| **Missende STEP_COMPLETE (< 3)** | 87/94 |
| **Missende EERSTE BERICHT** | 51/94 |
| **SLO mapping conflicten** | 33 missies |
| **Lege systemInstruction (niet-standalone)** | 1 (`ipad-print-instructies`, 360 tekens — functioneel leeg) |
| **SI < 500 tekens** | 1 missie |
| **Missende verificatievragen** | 82/94 |

### Prioriteitsverdeling per leerjaar

| Leerjaar | Missies | Gemiddelde score | Hoogste score |
|----------|---------|-----------------|---------------|
| J1 | 37 | 14.5 | 26 |
| J2 | 37 | 20.2 | 25 |
| J3 | 20 | 18.4 | 24 |

---

## Referentiestandaard

De volgende 3 missies zijn volledig compleet en dienen als referentie bij alle audit-werkzaamheden:

| Missie | Jaar | EERSTE BERICHT | STEP_COMPLETE | Verificatie | goalCriteria |
|--------|------|---------------|---------------|-------------|--------------|
| `data-verzamelaar` | J1 P3 | ✅ | 3/3 ✅ | ❌ | ✅ |
| `network-navigator` | J2 P2 | ✅ | 3/3 ✅ | ❌ | ✅ |
| `privacy-by-design` | J2 P2 | ✅ | 3/3 ✅ | ✅ | ✅ |

> `privacy-by-design` is de goudstandaard: enige missie met alle vier onderdelen aanwezig.

---

## Priority Scoring Formule

Elke missie scoort punten op basis van ontbrekende kwaliteitselementen. Hogere score = urgenter.

| Criterium | Punten |
|-----------|--------|
| Lege / ontbrekende systemInstruction | +10 |
| SLO mapping conflict (tussen bronnen) | +8 |
| Geen EERSTE BERICHT | +6 |
| STEP_COMPLETE markers ontbreken (< 3) | +5 |
| systemInstruction < 500 tekens | +5 |
| Geen verificatievragen | +4 |
| Leerjaar 1 | +3 |
| Leerjaar 2 | +2 |
| Leerjaar 3 | +1 |

Standalone-missies en referentiemissies scoren altijd 0.

---

## Priority Ranking — Top 20

| # | Mission ID | Titel | Jaar | Score | Issues |
|---|-----------|-------|------|-------|--------|
| 1 | `ai-tekengame` | AI Tekengame | J1 P2 | **26** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 2 | `review-week-2` | De Code-Criticus | J1 P2 | **26** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 3 | `review-week-3` | De Ethische Raad | J1 P4 | **26** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 4 | `data-journalist` | Data Journalist | J2 P1 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 5 | `spreadsheet-specialist` | Spreadsheet Specialist | J2 P1 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 6 | `factchecker` | Factchecker | J2 P1 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 7 | `api-verkenner` | API Verkenner | J2 P1 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 8 | `data-review` | Data Review | J2 P1 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 9 | `app-prototyper` | App Prototyper | J2 P2 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 10 | `code-reviewer` | Code Reviewer | J2 P2 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 11 | `code-review-2` | Code Review 2 | J2 P2 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 12 | `digital-storyteller` | Digital Storyteller | J2 P3 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 13 | `video-editor` | Video Editor | J2 P3 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 14 | `media-review` | Media Review | J2 P3 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 15 | `digital-rights-defender` | Digital Rights Defender | J2 P4 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 16 | `future-forecaster` | Future Forecaster | J2 P4 | **25** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 17 | `api-architect` | API Architect | J3 P1 | **24** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 18 | `neural-navigator` | Neural Navigator | J3 P1 | **24** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 19 | `open-source-contributor` | Open Source Contributor | J3 P1 | **24** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |
| 20 | `encryption-expert` | Encryption Expert | J3 P2 | **24** | SLO_MISMATCH, NO_EERSTE_BERICHT, MISSING_STEP_COMPLETE, NO_VERIFICATION |

> **Observatie:** De top-3 zijn J1-missies met SLO-conflict. Hoog-risico want zichtbaar voor de meeste leerlingen én inhoudelijk incorrect getagd. Aanbeveling: begin de audit hier.

---

## Batch Planning

De 88 te-auditen missies zijn ingedeeld in 10 werkbatches. Elke batch dekt één logisch curriculair cluster.

### Batch 1 — J1-P1 Basisvaardigheden (Eerste indruk) — Prioriteit: HOOG
**Missies:** `magister-master`, `cloud-commander`, `word-wizard`, `slide-specialist`, `print-pro`
**Review:** `review-week-1`, `ipad-print-instructies`
**Issues:** MISSING_STEP_COMPLETE (7×), NO_EERSTE_BERICHT (2×), SI_SHORT (1×)
**Score range:** 8–23

### Batch 2 — J1-P2 AI-missies — Prioriteit: HOOGST (SLO-conflicten)
**Missies:** `ai-trainer`, `chatbot-trainer`, `ai-tekengame`, `verhalen-ontwerper`, `ai-beleid-brainstorm`
**Review:** `review-week-2`
**Issues:** MISSING_STEP_COMPLETE (6×), NO_EERSTE_BERICHT (3×), SLO_MISMATCH (3×)
**Score range:** 12–26

### Batch 3 — J1-P2 Code & Creativiteit — Prioriteit: MIDDEL
**Missies:** `game-programmeur`, `code-denker`, `website-bouwer`, `schermtijd-coach`, `prompt-master`, `game-director`
**Issues:** MISSING_STEP_COMPLETE (6×), NO_VERIFICATION (6×)
**Score range:** 12

### Batch 4 — J1-P3 Privacy & Data (basis) — Prioriteit: MIDDEL
**Referentie:** `data-verzamelaar` (reeds compleet — gebruik als voorbeeld)
**Missies:** `social-safeguard`, `scroll-stopper`, `cookie-crusher`, `data-detective`, `data-speurder`
**Issues:** MISSING_STEP_COMPLETE (5×), NO_VERIFICATION (5×)
**Score range:** 12

### Batch 5 — J1-P3 Data & Ethiek — Prioriteit: MIDDEL
**Missies:** `data-handelaar`, `deepfake-detector`, `filter-bubble-breaker`, `datalekken-rampenplan`, `data-voor-data`, `ai-spiegel`
**Issues:** MISSING_STEP_COMPLETE (6×), NO_VERIFICATION (6×)
**Score range:** 12

### Batch 6 — J1-P4 Eindproject & Reviews — Prioriteit: HOOG (SLO-conflict)
**Missies:** `mission-blueprint`, `mission-vision`, `mission-launch`, `startup-pitch`
**Review:** `review-week-3`
**Issues:** NO_EERSTE_BERICHT (2×), MISSING_STEP_COMPLETE (5×), SLO_MISMATCH (2×)
**Score range:** 12–26

### Batch 7 — J2-P1 Data & Informatie — Prioriteit: HOOGST (SLO-conflicten)
**Missies:** `data-journalist`, `spreadsheet-specialist`, `factchecker`, `api-verkenner`, `dashboard-designer`, `ai-bias-detective`
**Review:** `data-review`
**Issues:** NO_EERSTE_BERICHT (7×), MISSING_STEP_COMPLETE (7×), SLO_MISMATCH (5×)
**Score range:** 17–25

### Batch 8 — J2-P2 + P3 Programmeren & Media — Prioriteit: HOOG (SLO-conflicten)
**Missies:** `algorithm-architect`, `web-developer`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer`, `wachtwoord-warrior`, `access-control-engineer`
**Review:** `code-review-2`
**Missies P3:** `ux-detective`, `podcast-producer`, `meme-machine`, `digital-storyteller`, `brand-builder`, `video-editor`
**Review P3:** `media-review`
**Issues:** NO_EERSTE_BERICHT (16×), MISSING_STEP_COMPLETE (16×), SLO_MISMATCH (6×)
**Score range:** 11–25

### Batch 9 — J2-P4 + J3-P1 + P2 Ethiek & Security — Prioriteit: HOOG
**J2-P4:** `ai-ethicus`, `digital-rights-defender`, `tech-court`, `future-forecaster`, `sustainability-scanner`, `eindproject-j2`
**J3-P1:** `ml-trainer`, `api-architect`, `neural-navigator`, `data-pipeline`, `open-source-contributor`
**Review J3-P1:** `advanced-code-review`
**J3-P2:** `cyber-detective`, `encryption-expert`, `phishing-fighter`, `security-auditor`, `digital-forensics`
**Review J3-P2:** `security-review`
**Issues:** NO_EERSTE_BERICHT (18×), MISSING_STEP_COMPLETE (18×), SLO_MISMATCH (10×)
**Score range:** 16–25

### Batch 10 — J3-P3 + P4 Innovatie & Meesterproef — Prioriteit: MIDDEL
**J3-P3:** `startup-simulator`, `policy-maker`, `innovation-lab`, `digital-divide-researcher`, `tech-impact-analyst`
**Review J3-P3:** `impact-review`
**J3-P4:** `portfolio-builder`, `research-project`, `prototype-developer`, `pitch-perfect`, `reflection-report`, `meesterproef`
**Issues:** NO_EERSTE_BERICHT (12×), MISSING_STEP_COMPLETE (12×), SLO_MISMATCH (5×)
**Score range:** 16–24

---

## Volledige Missietabel

> Kolommen: SI = systemInstruction lengte in tekens | EB = EERSTE BERICHT | SC = STEP_COMPLETE | VER = Verificatievragen | SLO = SLO match status

| # | Mission ID | Titel | Jaar | Per. | SI | EB | SC | VER | SLO | Score | Status |
|---|-----------|-------|------|------|-----|----|----|-----|-----|-------|--------|
| 1 | `ai-tekengame` | AI Tekengame | J1 | P2 | 1179c | ❌ | ❌ | ❌ | ⚠️ Conflict | **26** | ⬜ Te auditen |
| 2 | `review-week-2` | De Code-Criticus | J1 | P2 | 2141c | ❌ | ❌ | ❌ | ⚠️ Conflict | **26** | ⬜ Te auditen |
| 3 | `review-week-3` | De Ethische Raad | J1 | P4 | 2257c | ❌ | ❌ | ❌ | ⚠️ Conflict | **26** | ⬜ Te auditen |
| 4 | `data-journalist` | Data Journalist | J2 | P1 | 1528c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 5 | `spreadsheet-specialist` | Spreadsheet Specialist | J2 | P1 | 1411c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 6 | `factchecker` | Factchecker | J2 | P1 | 1602c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 7 | `api-verkenner` | API Verkenner | J2 | P1 | 1693c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 8 | `data-review` | Data Review | J2 | P1 | 1570c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 9 | `app-prototyper` | App Prototyper | J2 | P2 | 1116c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 10 | `code-reviewer` | Code Reviewer | J2 | P2 | 1199c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 11 | `code-review-2` | Code Review 2 | J2 | P2 | 1570c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 12 | `digital-storyteller` | Digital Storyteller | J2 | P3 | 1188c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 13 | `video-editor` | Video Editor | J2 | P3 | 1655c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 14 | `media-review` | Media Review | J2 | P3 | 2661c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 15 | `digital-rights-defender` | Digital Rights Defender | J2 | P4 | 1121c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 16 | `future-forecaster` | Future Forecaster | J2 | P4 | 1093c | ❌ | ❌ | ❌ | ⚠️ Conflict | **25** | ⬜ Te auditen |
| 17 | `api-architect` | API Architect | J3 | P1 | 1370c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 18 | `neural-navigator` | Neural Navigator | J3 | P1 | 1307c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 19 | `open-source-contributor` | Open Source Contributor | J3 | P1 | 1395c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 20 | `encryption-expert` | Encryption Expert | J3 | P2 | 1753c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 21 | `phishing-fighter` | Phishing Fighter | J3 | P2 | 1747c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 22 | `digital-forensics` | Digital Forensics | J3 | P2 | 1779c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 23 | `startup-simulator` | Startup Simulator | J3 | P3 | 1600c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 24 | `innovation-lab` | Innovation Lab | J3 | P3 | 1659c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 25 | `impact-review` | Impact Review | J3 | P3 | 2408c | ❌ | ❌ | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 26 | `pitch-perfect` | Pitch Perfect | J3 | P4 | 1442c | ❌ | 1/3 | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 27 | `reflection-report` | Reflection Report | J3 | P4 | 1556c | ❌ | 1/3 | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 28 | `meesterproef` | Meesterproef | J3 | P4 | 1970c | ❌ | 1/3 | ❌ | ⚠️ Conflict | **24** | ⬜ Te auditen |
| 29 | `ipad-print-instructies` | iPad Print Instructies | J1 | P1 | 360c | ❌ | ❌ | ❌ | ✅ OK | **23** | ⬜ Te auditen |
| 30 | `automation-engineer` | Automation Engineer | J2 | P2 | 1242c | ❌ | ❌ | ✅ | ⚠️ Conflict | **21** | ⬜ Te auditen |
| 31 | `verhalen-ontwerper` | Verhalen Ontwerper | J1 | P2 | 5191c | ✅ | ❌ | ❌ | ⚠️ Conflict | **20** | ⬜ Te auditen |
| 32 | `mission-vision` | De Visie | J1 | P4 | 4078c | ✅ | ❌ | ❌ | ⚠️ Conflict | **20** | ⬜ Te auditen |
| 33 | `print-pro` | Print Pro | J1 | P1 | 2432c | ❌ | ❌ | ❌ | ✅ OK | **18** | ⬜ Te auditen |
| 34 | `ai-beleid-brainstorm` | AI Beleid Brainstorm | J1 | P2 | 934c | ❌ | ❌ | ❌ | ✅ OK | **18** | ⬜ Te auditen |
| 35 | `review-week-1` | Review Week 1 | J1 | P1 | 3863c | ❌ | ❌ | ❌ | ✅ OK | **18** | ⬜ Te auditen |
| 36 | `startup-pitch` | Startup Pitch | J1 | P4 | 2723c | ❌ | ❌ | ❌ | ✅ OK | **18** | ⬜ Te auditen |
| 37 | `dashboard-designer` | Dashboard Designer | J2 | P1 | 1670c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 38 | `ai-bias-detective` | AI Bias Detective | J2 | P1 | 1783c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 39 | `algorithm-architect` | Algorithm Architect | J2 | P2 | 1241c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 40 | `web-developer` | Web Developer | J2 | P2 | 1075c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 41 | `bug-hunter` | Bug Hunter | J2 | P2 | 1102c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 42 | `ux-detective` | UX Detective | J2 | P3 | 1110c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 43 | `podcast-producer` | Podcast Producer | J2 | P3 | 1647c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 44 | `meme-machine` | Meme Machine | J2 | P3 | 1184c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 45 | `brand-builder` | Brand Builder | J2 | P3 | 1199c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 46 | `ai-ethicus` | AI Ethicus | J2 | P4 | 1099c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 47 | `tech-court` | Tech Court | J2 | P4 | 1258c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 48 | `sustainability-scanner` | Sustainability Scanner | J2 | P4 | 1120c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 49 | `eindproject-j2` | Eindproject Jaar 2 | J2 | P4 | 1326c | ❌ | ❌ | ❌ | ✅ OK | **17** | ⬜ Te auditen |
| 50 | `ml-trainer` | ML Trainer | J3 | P1 | 1476c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 51 | `advanced-code-review` | Advanced Code Review | J3 | P1 | 2108c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 52 | `cyber-detective` | Cyber Detective | J3 | P2 | 1727c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 53 | `security-review` | Security Review | J3 | P2 | 1944c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 54 | `policy-maker` | Policy Maker | J3 | P3 | 1649c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 55 | `digital-divide-researcher` | Digital Divide Researcher | J3 | P3 | 1710c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 56 | `tech-impact-analyst` | Tech Impact Analyst | J3 | P3 | 1764c | ❌ | ❌ | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 57 | `portfolio-builder` | Portfolio Builder | J3 | P4 | 1562c | ❌ | 1/3 | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 58 | `research-project` | Research Project | J3 | P4 | 1682c | ❌ | 1/3 | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 59 | `prototype-developer` | Prototype Developer | J3 | P4 | 1473c | ❌ | 1/3 | ❌ | ✅ OK | **16** | ⬜ Te auditen |
| 60 | `prompt-master` | Prompt Perfectionist | J1 | P2 | 3540c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 61 | `game-programmeur` | Game Programmeur | J1 | P2 | 1179c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 62 | `ai-trainer` | AI Trainer | J1 | P2 | 1687c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 63 | `chatbot-trainer` | Chatbot Trainer | J1 | P2 | 1618c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 64 | `game-director` | De Game Director | J1 | P2 | 2025c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 65 | `code-denker` | Code Denker | J1 | P2 | 3875c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 66 | `website-bouwer` | Website Bouwer | J1 | P2 | 2657c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 67 | `schermtijd-coach` | Schermtijd Coach | J1 | P2 | 4579c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 68 | `data-detective` | Data Detective | J1 | P3 | 2451c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 69 | `deepfake-detector` | Deepfake Detector | J1 | P3 | 2944c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 70 | `ai-spiegel` | De AI Spiegel | J1 | P3 | 2907c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 71 | `social-safeguard` | Social Safeguard | J1 | P3 | 1878c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 72 | `scroll-stopper` | De Scroll Stopper | J1 | P3 | 5231c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 73 | `cookie-crusher` | Cookie Crusher | J1 | P3 | 1977c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 74 | `data-handelaar` | De Data Handelaar | J1 | P3 | 3439c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 75 | `filter-bubble-breaker` | Filter Bubble Breaker | J1 | P3 | 1598c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 76 | `datalekken-rampenplan` | Datalekken Rampenplan | J1 | P3 | 1317c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 77 | `data-voor-data` | Data voor Data | J1 | P3 | 1523c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 78 | `data-speurder` | Data Speurder | J1 | P3 | 3731c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 79 | `mission-blueprint` | De Blauwdruk | J1 | P4 | 3654c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 80 | `mission-launch` | De Lancering | J1 | P4 | 4629c | ✅ | ❌ | ❌ | ✅ OK | **12** | ⬜ Te auditen |
| 81 | `data-pipeline` | Data Pipeline | J3 | P1 | 1398c | ❌ | ❌ | ✅ | ✅ OK | **12** | ⬜ Te auditen |
| 82 | `security-auditor` | Security Auditor | J3 | P2 | 1765c | ❌ | ❌ | ✅ | ✅ OK | **12** | ⬜ Te auditen |
| 83 | `wachtwoord-warrior` | Wachtwoord Warrior | J2 | P2 | 4025c | ✅ | ❌ | ❌ | ✅ OK | **11** | ⬜ Te auditen |
| 84 | `access-control-engineer` | Access Control Engineer | J2 | P2 | 2691c | ✅ | ❌ | ❌ | ✅ OK | **11** | ⬜ Te auditen |
| 85 | `magister-master` | Magister Meester | J1 | P1 | 927c | ✅ | 1/3 | ✅ | ✅ OK | **8** | ⬜ Te auditen |
| 86 | `cloud-commander` | Cloud Commander | J1 | P1 | 946c | ✅ | 1/3 | ✅ | ✅ OK | **8** | ⬜ Te auditen |
| 87 | `word-wizard` | Word Wizard | J1 | P1 | 919c | ✅ | 1/3 | ✅ | ✅ OK | **8** | ⬜ Te auditen |
| 88 | `slide-specialist` | Slide Specialist | J1 | P1 | 954c | ✅ | 1/3 | ✅ | ✅ OK | **8** | ⬜ Te auditen |
| — | `cloud-cleaner` | Cloud Schoonmaker | J1 | P1 | leeg | — | — | — | — | **0** | 🔧 Standalone |
| — | `layout-doctor` | Layout Doctor | J1 | P1 | leeg | — | — | — | — | **0** | 🔧 Standalone |
| — | `pitch-police` | Pitch Politie | J1 | P1 | leeg | — | — | — | — | **0** | 🔧 Standalone |
| — | `data-verzamelaar` | Data Verzamelaar | J1 | P3 | 3200c | ✅ | 3/3 | ❌ | ✅ OK | **0** | ✅ Compleet |
| — | `network-navigator` | Network Navigator | J2 | P2 | 3259c | ✅ | 3/3 | ❌ | ✅ OK | **0** | ✅ Compleet |
| — | `privacy-by-design` | Privacy by Design | J2 | P2 | 4123c | ✅ | 3/3 | ✅ | ✅ OK | **0** | ✅ Compleet |

---

## SLO Dekkingsoverzicht

Actuele tellingen per kerndoel en leerjaar (bron: `config/slo-kerndoelen-mapping.ts`, geauditeerd 2026-03-28):

| Kerndoel | Omschrijving | J1 | J2 | J3 | Totaal |
|----------|-------------|-----|-----|-----|--------|
| **21A** | Digitale systemen | 11 | 3 | 6 | 20 |
| **21B** | Media & Informatie | 7 | 11 | 3 | 21 |
| **21C** | Data & Dataverwerking | 3 | 5 | 4 | 12 |
| **21D** | AI | 8 | 5 | 5 | 18 |
| **22A** | Digitale producten | 12 | 13 | 6 | 31 |
| **22B** | Programmeren | 3 | 10 | 8 | 21 |
| **23A** | Veiligheid & privacy | 5 | 3 | 7 | 15 |
| **23B** | Digitaal welzijn | 8 | 6 | 7 | 21 |
| **23C** | Maatschappij & ethiek | 11 | 7 | 8 | 26 |

### Aandachtspunten dekking

- **21C J1** (3): Dunst gedekte combinatie. Alleen `ai-trainer`, `data-verzamelaar`, `data-speurder`. Kwetsbaar als één missie wegvalt.
- **23A J2** (3): Klein. Alleen `wachtwoord-warrior`, `access-control-engineer`, `privacy-by-design`. Goed maar mager voor een vol jaar.
- **22B J1** (3): Verbeterd t.o.v. eerdere analyse. `website-bouwer` helpt, maar gamegericht programmeren domineert.
- **21A J2** (3): Netwerken en systemen ondervertegenwoordigd in J2 — één nieuwe missie zou hier al winst geven.

---

## Audit Trail

| Datum | Actie | Missies | Resultaat |
|-------|-------|---------|-----------|
| 2026-03-28 | SLO-mapping hervalidatie | 94 | Alle tags herbeoordeeld tegen systemInstruction-inhoud in `agents.tsx` |
| 2026-03-28 | Curriculum priority audit | 94 | Nieuwe prioritering op basis van actuele codebase — zie `curriculum-priority-audit-2026-03-28.md` |
| 2026-04-01 | Fase 0: Inventarisatie + prioritering | 94 | Dit rapport gegenereerd — prioriteitsscores berekend op basis van `agents.tsx` + `curriculum.ts` |

---

## Volgende Stap

Begin met **Batch 2 (J1-P2 AI-missies)**, want:
1. `ai-tekengame` en `review-week-2` staan beide op score 26 — hoogste prioriteit.
2. Beide zijn J1-missies: zichtbaar voor de meeste leerlingen.
3. Beide hebben een SLO-conflict dat gecorrigeerd moet worden in zowel `agents.tsx` als `slo-kerndoelen-mapping.ts`.

Na Batch 2: Batch 7 (J2-P1), want dat cluster heeft de meeste missies met gecombineerde SLO-conflicten én ontbrekende EERSTE BERICHT.
