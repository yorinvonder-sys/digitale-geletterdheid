# M2 Review — `meesterproef` (2026-07-01)

**TemplateType:** `builder-canvas`
**Config:** `src/features/missions/templates/builder-canvas/configs/meesterproef.ts`
**Engine:** `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx`
**Agent-rol:** `src/config/agents/year3.tsx:2205-2286`
**Curriculum:** Leerjaar 3, Periode 4 ("Meesterproef") — `src/config/curriculum.ts:299-312`
**SLO-claim:** `21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C` — `src/config/slo-kerndoelen-mapping.ts:194`
**Wave:** 9 (verse review)

---

## 🎨 Design review

**Mission:** meesterproef (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** Config zelf bevat geen `className`-strings (content-only file). De agent-rol-entry in `year3.tsx:2219-2229` (visualPreview) gebruikt consistent `lab-coral`/`lab-gold`/`lab-coral` — legacy maar intern consistent, geen hex-literals waar een token bestaat.
- **Criterium 2 (Layout consistentie):** Badge-structuur (5 badges, minScore 90/70/50/25/0, kleuren `#e1ff01`/`#202023`/`#ff3c21`) is **identiek** aan baseline `pitch-perfect.ts:89-95` (zelfde templateType, zelfde stap-aantal). Geen structurele afwijking.
- **Criterium 4 (Copy-lengte, leerjaar 3: intro <120, opdracht <80):** `introDescription` = 36 woorden. Alle 4 `instruction`-velden: 71 / 67 / 59 / 50 woorden — ruim binnen grens ondanks de complexiteit van een eindproject-missie.
- **Criterium 6 (Framer Motion):** N.v.t. — config bevat geen animatie-logica (engine-niveau, gedeeld met alle builder-canvas-missies).

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: geen screenshots-map en geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 treffers voor "meesterproef"). Dynamische verificatie (alignment/overlap/text-fit/responsive) is dus **niet uitgevoerd** voor deze missie. Markeer als `unverified`, niet als fail — de config-content zelf geeft geen aanleiding tot zorg (korte checklist-labels, korte titels).
  - **Wat:** geen Chrome-plugin-bewijs beschikbaar in deze reviewpass.
  - **Waarom:** kan pas ship-zeker worden bevestigd na een dynamic-verificatieronde (Fase B tech-reviewer).
  - **Voorstel:** geen code-fix — volgende wave met dev-server-toegang moet Fase B alsnog draaien voor `meesterproef`.

### ❌ Blocking issues
- Geen.

### Score
3/4 toepasbare criteria hard bevestigd, 1 unverified (visueel) · Aanbeveling: **ship** (visuele verificatie als follow-up, geen blocker — content zelf geeft geen reden tot zorg)

---

## 📚 Didactiek review

**Mission:** meesterproef (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 4
**SLO-claim:** 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 2 (SLO-fit):** Voor een integratie-eindmissie is brede dekking inhoudelijk verdedigbaar — de 4 steps (projectvoorstel/ontwikkelproces/eindproduct/verdediging) raken samen onderzoek (21C/21D), ontwerp/bouw (22A/22B), reflectie (23B) en presentatie (21B). Dit is expliciet de bedoeling: curriculum.ts:243 noemt de meesterproef als "ambitieus project waarin je... kritisch en creatief kunt omgaan" met technologie — een integratie-toets, geen enkelvoudige SLO-oefening.
- **Criterium 4 (Opdracht-beknoptheid):** Zie design-review — alle instruction-velden ruim onder de 80-woordengrens ondanks de complexiteit.
- **Criterium 5 (Leeftijds-passend):** Vocabulaire past bij 15-16-jarigen (havo/vwo eindfase leerjaar 3): "SMART-doelstelling", "beslissingenlog", "jury-verdediging" — geen onnodig jargon, wel professioneel niveau passend bij een afsluitend project. `system-instruction` (year3.tsx:2277-2286) is motiverend zonder betuttelend te zijn.
- **Criterium 6 (Curriculum-plek):** Logisch geplaatst als laatste missie in de laatste periode van leerjaar 3 (`curriculum.ts:299-312`), na `portfolio-builder`, `research-project`, `prototype-developer`, `pitch-perfect`, `reflection-report` — bouwt expliciet voort op eerdere onderzoek/bouw/pitch/reflectie-missies in dezelfde periode.
- **Criterium 7 (Bloom-balans):** Sterke mix: onthouden (technologie-keuzes benoemen) → toepassen (product bouwen) → analyseren (eigen werk evalueren, step 3) → evalueren (eerlijke zelfevaluatie, expliciet gevraagd in `instruction` step 3: "Wat werkt goed en wat niet?") → creëren (heel het project). Geen pure quiz-recall.
- **Criterium 9 (Welzijn):** Geen gevoelige onderwerpen in deze missie; toegankelijke, gender-neutrale taal.

### ⚠️ Aandachtspunten
- **Criterium 1 (SLO-codes, "te veel codes"-regel)**: 9 kerndoelen geclaimd (`21A` t/m `23C`, praktisch de complete lijst) — `slo-kerndoelen-mapping.ts:194`.
  - **Wat:** rubric flagt >3 kerndoelen standaard voor review, omdat een enkele missie zelden 4+ kerndoelen serieus raakt.
  - **Waarom:** voor een reguliere missie zou dit een misalignment-risico zijn. Voor déze missie (expliciet ontworpen als integratie-eindproject van 3 jaar informatica, periode-titel "Meesterproef — Jouw digitale meesterwerk") is de brede claim functioneel verdedigbaar — maar de checklistItems zelf toetsen vooral **procesvaardigheden** (SMART schrijven, logboek bijhouden, eerlijk evalueren, juryvragen beantwoorden) en raken de **inhoudelijke** kerndoelen (bv. 22B Programmeren, 21D AI) alleen indirect via het vrij te kiezen projectonderwerp — niet via een verplichte checklistItem die het kerndoel toont.
  - **Voorstel:** geen harde fix vereist (context-conform), maar noteer voor toekomstige eindmissie-ontwerpen: overweeg per SLO-code een expliciete koppeling in de checklist (bv. "Ik benoem welke programmeer- of AI-vaardigheid ik in mijn project heb toegepast") zodat de brede claim ook zichtbaar bewijs heeft in het leerling-artefact. Niet blocking voor deze review.

- **Criterium 8 (AI-as-copilot) — stap-mismatch tussen system-instruction en config:**
  - **Wat:** `year3.tsx:2265-2268` beschrijft een **3-fasen-model** (`STAP_COMPLETE:1/2/3` = projectvoorstel → uitvoering → verdediging), terwijl `meesterproef.ts` **4 UI-steps** definieert (`projectvoorstel`, `ontwikkelproces`, `eindproduct`, `verdediging`). De coach-instructie "STAP 2 - Project uitvoeren" dekt zowel de UI-stap "ontwikkelproces" als "eindproduct" tegelijk, zonder dat als zodanig te benoemen.
  - **Waarom:** functioneel **niet-brekend** — `BuilderCanvas.tsx` heeft geen `STEP_COMPLETE`-parsing; de checklist/tekstvelden in de UI drijven de voortgang aan, de chat is een los side-panel (`enableChat`). Maar didactisch is het een inconsistentie: de coach "denkt" in 3 fasen terwijl de leerling een 4-fasen-UI ziet. Bij vragen als "welke stap zit ik nu in?" kan de coach een ander fasenmodel noemen dan wat de leerling op het scherm ziet, wat verwarrend is voor een leerling die juist houvast zoekt in het eindproject.
  - **Voorstel (Voorstel-blok, autoFixable):**

    ```text
    ❌ Huidig — src/config/agents/year3.tsx:2265-2268
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling een volledig projectvoorstel heeft geschreven met probleemstelling, doelstelling, aanpak en planning
    - Stuur ---STEP_COMPLETE:2--- als de leerling voortgang heeft gerapporteerd over de uitvoering met documentatie van keuzes en obstakels
    - Stuur ---STEP_COMPLETE:3--- als de leerling het eindresultaat heeft gepresenteerd, juryvragen heeft beantwoord en een reflectie heeft geschreven

    ✅ Voorgesteld
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling een volledig projectvoorstel heeft geschreven met probleemstelling, doelstelling, aanpak en planning
    - Stuur ---STEP_COMPLETE:2--- als de leerling voortgang heeft gerapporteerd over de uitvoering met documentatie van keuzes en obstakels (ontwikkeldagboek + beslissingenlog)
    - Stuur ---STEP_COMPLETE:3--- als de leerling het eindproduct heeft beschreven en verantwoord (wat is opgeleverd, technologiekeuzes, testproces, eerlijke evaluatie)
    - Stuur ---STEP_COMPLETE:4--- als de leerling het eindresultaat heeft gepresenteerd, juryvragen heeft beantwoord en een reflectie heeft geschreven
    ```

    En pas `STAP 1/2/3`-beschrijving (`year3.tsx:2254-2256`) aan naar 4 stappen die 1-op-1 matchen met de UI-steps in `meesterproef.ts` (`projectvoorstel` / `ontwikkelproces` / `eindproduct` / `verdediging`), zodat de coach hetzelfde fasenmodel hanteert als wat de leerling ziet.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21A-23C (breed):** functioneel geraakt via het vrije projectonderwerp en het 4-stappenproces (onderzoek → bouw → verantwoording → presentatie), maar niet elk kerndoel heeft een dedicated, verplichte checklist-toets — sterk geraakt op procesniveau, oppervlakkig op individueel-kerndoel-niveau. Verdedigbaar gegeven de rol als integratie-eindmissie.

### Score
5/6 toepasbare criteria hard geslaagd, 2 aandachtspunten (1 verdedigbaar-in-context, 1 oplosbare stap-mismatch) · Bloom-balans: **hoog** (volledige piramide, incl. evalueren/creëren) · Aanbeveling: **fix-eerst** (kleine, niet-blokkerende system-instruction-tweak aanbevolen vóór volgende wave, maar geen ship-blocker)

---

## 🔧 Tech review

**Mission:** meesterproef (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewpass, geen screenshots-map aanwezig

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** Geen `any`-types, geen `@ts-ignore`/`@ts-expect-error` in `meesterproef.ts`. Config is volledig getypeerd via `BuilderCanvasConfig` (`BuilderCanvas.tsx:30-45`).
- **Criterium A4 (Imports via alias):** Config importeert `BuilderCanvasConfig` via relatief pad `'../BuilderCanvas'` (`meesterproef.ts:1`) — dit is het gevestigde patroon binnen dezelfde `configs/`-submap van alle builder-canvas-missies (zie ook `pitch-perfect.ts`), geen `@/*`-violatie te verwachten op dit niveau van de mappenstructuur.
- **Criterium A6 (Restart-safe state):** `BuilderCanvas.tsx:69-72` roept `useMissionAutoSave<BuilderCanvasState>(config.missionId, initialState)` direct aan — checklist, tekstvelden en voltooide stappen persisteren bij refresh.
- **Criterium A7 (Security):** `systemInstruction` wordt server-side bepaald via `roleId: 'meesterproef'` (`meesterproef.ts:17` → `chatRoleId`), niet client-side gedefinieerd. Chat-responses gaan door `DOMPurify.sanitize` (`src/hooks/useAgentLogic.ts:952`) — engine-brede laag, geen missie-specifieke bypass.
- **Score/maxScore-consistentie (nagerekend):** `pointsPerStep = Math.floor(100 / 4) = 25`. Bij 4/4 voltooide steps: `4 × 25 = 100 = maxScore`. Geen `reflectionQuestion` in de config (dus `bonusScore` altijd 0) → geen overshoot-risico. Badge-matching (`score >= minScore`, hoogste eerst — `CompletionScreen.tsx:40-41`) is correct: bij 100 punten matcht de leerling terecht de 90-badge "Meesterproef Geslaagd". Identiek rekenpatroon als `pitch-perfect.ts`, geen bug.

#### ⚠️ Aandachtspunten
- Geen missie-specifieke technische issues gevonden buiten de al-bekende engine-brede lijst (badge-kleur `#202023`, hex-tokenisatie, learningObjectives-rendering — niet herhaald conform instructie).

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd deze wave — geen dev-server/screenshots beschikbaar. Geen aanleiding tot zorg op basis van static analyse; aanbevolen als follow-up samen met de design-reviewer's Visual Precision Gate.

### Score
Static: 5/5 toepasbare criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship** (dynamic verificatie als follow-up, geen blocker)

---

## Samenvatting & verdict

|As | Score (0-10, hoger=beter) | Belangrijkste issue |
|---|---|---|
| Design | 8.5 | Geen dynamic/visuele verificatie deze wave (unverified, niet fail) |
| Didactiek | 7.5 | System-instruction (3 fasen) vs config (4 steps) mismatch; brede SLO-claim (9 codes) is contextueel verdedigbaar |
| Tech | 8.5 | Geen missie-specifieke bugs; score/badge-rekensom klopt exact |

**triageScore = (10-8.5)×0.3 + (10-7.5)×0.4 + (10-8.5)×0.3 = 0.45 + 1.00 + 0.45 = 1.90**

**Verdict: ok** — geen blocking issues op design/didactiek/tech. Eén klein, autoFixable didactisch verbeterpunt (system-instruction stap-alignment) aanbevolen maar niet ship-blokkerend. Dormante-chat-platformkwestie (enableChat) is hier N.V.T. — `enableChat: true` staat wél aan en heeft een actieve, uitgewerkte agent-rol.
