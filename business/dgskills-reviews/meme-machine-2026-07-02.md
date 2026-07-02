# Missie-review: meme-machine

**Datum:** 2026-07-02
**TemplateType:** builder-canvas
**Config:** `src/features/missions/templates/builder-canvas/configs/meme-machine.ts`
**Agent-rol:** `src/config/agents/year2.tsx:1626-1712`
**Curriculum:** leerjaar 2, `src/config/curriculum.ts:204`
**SLO-claim:** 21B (Media & Informatie), 23B (Digitaal welzijn) — regulier; 18B, 20B — VSO (`src/config/slo-kerndoelen-mapping.ts:128`)
**missionGoals:** `src/config/missionGoals.ts:580-588`

---

## 🎨 Design review

**Mission:** meme-machine (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** geen hex-literals of niet-doeldomein tokens in de config zelf. Badge-`color`-hex-waarden (`meme-machine.ts:85-89`) zijn identiek qua patroon aan de baseline builder-canvas-missie `digital-storyteller.ts:86-90` — platform-breed patroon, geen missie-specifieke afwijking.
- **Criterium 2 (Layout consistentie):** standaard `BuilderCanvasConfig`-shape (`BuilderCanvas.tsx:30-45`), geen custom layout-afwijkingen t.o.v. baseline.
- **Criterium 4 (Copy-lengte, leerjaar 2 → grens leerjaar 1-2):** intro 31 woorden (<80 ✓), alle 4 instructie-velden tussen 46-58 woorden (<60 ✓). Ruim binnen grenzen.
- **Criterium 6/7 (Framer Motion, a11y):** geen missie-specifieke afwijkingen — deze criteria worden bepaald door de gedeelde `BuilderCanvas.tsx`-engine (platform-breed), niet door de config.

### ⚠️ Aandachtspunten
_Geen missie-specifieke design-issues gevonden._

### ❌ Blocking issues
_Geen._

### Score
Design: **8.5/10** · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** meme-machine (builder-canvas)
**Curriculum-plek:** Leerjaar 2, periode zie `curriculum.ts:204` (week 3 volgens SLO-mapping)
**SLO-claim:** 21B, 23B (regulier) / 18B, 20B (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** 21B en 23B zijn beide geldige regulier-VO-codes; VSO-mapping 18B/20B aanwezig (`slo-kerndoelen-mapping.ts:128`).
- **Criterium 2 (SLO-fit):** sterk geraakt. 21B (media-ontwerp) via stap `eigen-meme` (concreet meme-concept ontwerpen, `meme-machine.ts:52-66`); 23B (media-invloed) via stap `viraliteit` + `verantwoord` (psychologie van delen + impact-reflectie, `meme-machine.ts:36-50` en `:67-81`).
- **Criterium 3 (Leerdoelen):** impliciete leerdoelen in `introDescription` + `takeaways` (`meme-machine.ts:91-97`) zijn concreet en actiewerkwoord-gedreven ("Je kunt een eigen meme-concept ontwerpen en onderbouwen").
- **Criterium 4 (Beknoptheid):** zie design-sectie — ruim binnen leerjaar 2-grenzen.
- **Criterium 5 (Leeftijds-passend):** tone-of-voice is direct en herkenbaar voor leerjaar 2 (Drake-meme, Distracted Boyfriend-referenties), geen onnodig jargon.
- **Criterium 7 (Bloom-balans):** sterke mix — analyseren (stap 1: meme-formats), begrijpen/toepassen (stap 2: viraliteitsfactoren rangschikken), creëren (stap 3: eigen meme ontwerpen + tegenvoorbeeld), evalueren (stap 4: perspectief van kwetsbare persoon, eigen richtlijn formuleren). Voor leerjaar 2 een ambitieuze maar goed gescaffolde opbouw.
- **Criterium 8 (AI-as-copilot):** `systemInstruction` (`year2.tsx:1663-1683`) volgt expliciet "laat leerling zelf ontdekken, niet voorzeggen" + scope guard tegen kwetsende content — geen antwoordenmachine-patroon.
- **Criterium 9 (Welzijn/inclusiviteit):** sterk. Stap `verantwoord` vraagt expliciet perspectief van een kwetsbare persoon + "geen memes die kwetsen/discrimineren" in zowel config (`:69-79`) als scope guard (`year2.tsx:1689-1691`).

### ⚠️ Aandachtspunten

- **Criterium 3/9 — Auteursrecht en portretrecht ontbreken**: `meme-machine.ts:52-66`, `year2.tsx:1663-1683`
  - **Wat:** de missie behandelt uitgebreid het ethische aspect van memes (kwetsen, discrimineren, inclusiviteit) maar noemt nergens dat bestaande memes/beeldmateriaal van derden vaak auteursrechtelijk beschermd zijn, en dat memes met foto's van echte/bekende personen portretrecht-vragen oproepen.
  - **Waarom:** leerlingen leren impliciet dat "is het aardig/inclusief genoeg" de enige toets is voor het (her)gebruiken van bestaand beeldmateriaal, terwijl juridische herkomst (mag ik deze foto gebruiken/bewerken) een aparte, relevante vraag is binnen mediageletterdheid — precies het domein van SLO 23B.
  - **Voorstel:** 1 zin toevoegen aan stap `eigen-meme` of `verantwoord`, bijvoorbeeld in `checklistItems` van `verantwoord` (`meme-machine.ts:75-78`):
    ```text
    ❌ Huidig — meme-machine.ts:75-78
    checklistItems: [
        { id: 'perspectief', label: 'Ik heb nagedacht vanuit het perspectief van iemand die geraakt wordt' },
        { id: 'inclusief', label: 'Ik heb uitgelegd hoe je humor maakt zonder groepen te targeten' },
        { id: 'richtlijn', label: 'Ik heb 1 persoonlijke richtlijn voor verantwoord posten geformuleerd' },
    ],

    ✅ Voorgesteld
    checklistItems: [
        { id: 'perspectief', label: 'Ik heb nagedacht vanuit het perspectief van iemand die geraakt wordt' },
        { id: 'inclusief', label: 'Ik heb uitgelegd hoe je humor maakt zonder groepen te targeten' },
        { id: 'bron', label: 'Ik heb benoemd of mijn meme een bestaande foto/afbeelding gebruikt en of dat mag' },
        { id: 'richtlijn', label: 'Ik heb 1 persoonlijke richtlijn voor verantwoord posten geformuleerd' },
    ],
    ```
    Optioneel ook 1 zin in `instruction` (`:73`) of de `tip` (`:74`) die auteursrecht/portretrecht benoemt.

- **Coach-plan-desync (platform-beslispunt) — deze missie hoort erbij**: `year2.tsx:1684-1687` vs `meme-machine.ts:19-82`
  - **Wat:** de agent-briefing gebruikt een ouder 3-stappenmodel (`STEP_COMPLETE:1/2/3` + eigen `steps`-array met 3 entries, `year2.tsx:1690-1710`), terwijl de builder-canvas config 4 canvas-stappen heeft (`meme-analyse`, `viraliteit`, `eigen-meme`, `verantwoord`). De chat belooft dus voltooiing na stap 3 ("eigen content maken"), terwijl de canvas nog een 4e stap ("verantwoord content maken") open heeft staan.
  - **Functionele impact:** geverifieerd via code-inspectie dat dit **niet canvas-blokkerend** is. `StudentAIChat` (`BuilderCanvas.tsx:280-299`) gebruikt intern `useStudentAssistant` (niet `useStepCompletion`); de `STEP_COMPLETE`-marker daar is uitsluitend een **instructie aan de AI in de systeemprompt** (`useStudentAssistant.ts:71`) zonder regex-parsing of state-tracking in dit pad — er is dus zelfs geen chat-eigen voortgangsbadge die fout zou tonen. De echte canvas-voortgang loopt uitsluitend via `handleChecklistToggle`/`handleNextStep` (`BuilderCanvas.tsx:111-155`) op basis van UI-acties, volledig los van chatberichten. Het risico is dus zuiver **conversationeel**: de AI kán in het gesprek zelf zeggen "je bent klaar" na stap 3 (omdat de briefing haar dat opdraagt), terwijl de leerling in de canvas nog een inhoudelijk belangrijke stap (verantwoord content maken, incl. het welzijnsaspect) open heeft staan.
  - **Voorstel:** dit is het bekende platform-brede beslispunt (briefings op ouder 3-stappenmodel) — geen missie-specifieke fix hier. Wel vermeldenswaardig: gezien stap 4 ("verantwoord") het welzijns-/ethiek-onderdeel bevat, is de impact van deze specifieke desync relatief hoger dan bij een missie waar stap 4 puur cosmetisch/optioneel zou zijn. Aanbeveling bij het platform-brede fix-moment: prioriteer `meme-machine` in de eerste batch vanwege de welzijnsrelevantie van de gemiste 4e stap.

### ❌ Blocking issues
_Geen._

### SLO-fit oordeel
- **21B (Media & Informatie):** sterk geraakt — stap `eigen-meme` vraagt concreet ontwerp + onderbouwing van een mediaproduct.
- **23B (Digitaal welzijn):** sterk geraakt — stap `verantwoord` + scope guard behandelen impact van content op anderen, direct SLO-doel.

### Score
Didactiek: **7.5/10** · Bloom-balans: **medium-hoog** (ambitieus voor leerjaar 2, goed gescaffold) · Aanbeveling: fix-eerst (kleine copy-toevoeging, geen herontwerp)

---

## 🔧 Tech review

**Mission:** meme-machine (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)

### Fase A — Static code-analyse

### ✅ Geslaagd
- **A1 (Knop-handlers):** geen missie-specifieke handlers in de config — alle interactie loopt via de gedeelde `BuilderCanvas.tsx`-engine (platform-breed, reeds geverifieerd op andere builder-canvas-missies).
- **A3 (TypeScript-discipline):** config is volledig getypeerd via `BuilderCanvasConfig`/`BuilderStep` (`BuilderCanvas.tsx:18-45`), geen `any`, geen `@ts-ignore`.
- **A5 (Edge function calls):** chat-koppeling verloopt via `StudentAIChat` (`BuilderCanvas.tsx:278-299`), dat context meegeeft (`currentStep`, `progress`, `textEntry`) maar geen directe fetch/edge-call vanuit de config zelf — geen missie-specifiek risico.
- **A6 (Restart-safe state):** `useMissionAutoSave` wordt op engine-niveau toegepast (`BuilderCanvas.tsx:7`), niet per-missie override — geconfirmeerd geen afwijking.
- **A7 (Security):** `systemInstruction` is server-side bepaald via `roleId`/`chatRoleId` (`meme-machine.ts:17`, `BuilderCanvas.tsx:281`), geen client-side prompt-definitie. Geen `dangerouslySetInnerHTML` in de config.

### Chat/canvas state-koppeling (missie-relevant verificatie)
Geverifieerd met directe code-inspectie: `StudentAIChat` op `BuilderCanvas.tsx:280-299` ontvangt uitsluitend een read-only `context`-prop (currentStep, progress, textEntry) — er is **geen** `onStepComplete`/`onProgressUpdate`-callback terug naar de canvas-state. `StudentAIChat` gebruikt intern `useStudentAssistant.ts` (niet `useStepCompletion.ts`); in dat pad is `---STEP_COMPLETE:N---` uitsluitend een instructie in de systeemprompt (`useStudentAssistant.ts:71`) zonder parsing-logica of state — `useStepCompletion.ts` (met regex-parsing + lokale `completedSteps`-state) bestaat wel elders in de codebase maar wordt gebruikt via `useAgentLogic.ts` (een ander missie-mechanisme), niet door `BuilderCanvas`. Conclusie: de 3-vs-4-stappen-desync (zie didactiek-sectie) is **geen technische bug** — het is een contentmismatch die uitsluitend in de conversationele laag van de AI-briefing zit, zonder enige state-koppeling naar en dus zonder functionele blokkade van de canvas-flow.

### ⚠️ Aandachtspunten
_Geen missie-specifieke tech-issues gevonden buiten de reeds gerapporteerde coach-plan-desync (didactiek-sectie, platform-beslispunt)._

### Fase B — Dynamic web-verificatie
Niet uitgevoerd — geen screenshots-map voor deze missie aangetroffen (`.ui-review/`, `public/screenshots/`), en geen actieve dev-server binnen deze reviewsessie. Statische analyse dekt bovenstaande criteria; dynamische viewport/console/network-verificatie ontbreekt. Ter context: `meme-machine` stond in de bredere UI/UX-sweep van 2026-06-30 (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:122`) al genoemd als een van de **best presterende missies (gem. ≥4.0)** — geen bekend visueel regressierisico, maar dat betreft een eerdere, niet-verse meting.

### ❌ Blocking issues
_Geen._

### Score
Tech: **8.5/10** · Aanbeveling: ship (Fase B dynamische verificatie is een aanvulling, geen blocker gezien eerdere positieve UI/UX-sweep-score)

---

## Samenvatting

| Axis | Score (0-10) | Belangrijkste bevinding |
|---|---|---|
| Design | 8.5 | Geen missie-specifieke issues |
| Didactiek | 7.5 | Auteursrecht/portretrecht ontbreekt; coach-plan-desync raakt hier het welzijnsdeel |
| Tech | 8.5 | Chat/canvas correct ontkoppeld — desync is cosmetisch, niet blokkerend |

**triageScore:** (10-8.5)×0.3 + (10-7.5)×0.4 + (10-8.5)×0.3 = **1.90**

**Verdict:** ok (met 1 kleine fix-eerst-aanbeveling voor auteursrecht/portretrecht-copy — niet blokkerend voor ship)
