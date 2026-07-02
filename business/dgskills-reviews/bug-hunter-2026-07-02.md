# Missie-review: Bug Hunter (`bug-hunter`)

**Datum:** 2026-07-02 · **Wave:** 11 (verse review) · **Template:** `simulation-lab`
**Curriculum:** Leerjaar 2, Periode 2 (Programmeren & Computational Thinking) · **SLO:** 22B (Programmeren) · VSO: 19A

**Config:** `src/features/missions/templates/simulation-lab/configs/bug-hunter.ts`
**Agent-rol (dormant):** `src/config/agents/year2.tsx:849-931`
**Visueel bewijs:** geen bestaande screenshots-map; geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — dynamische verificatie overgeslagen, statisch oordeel op basis van config + bekende engine-brede bevindingen.

---

## 🎨 Design review

**Mission:** bug-hunter (simulation-lab)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config zelf bevat geen hardcoded UI-hex — de enige hex-literals zijn `bar-chart`-datakleuren (`#ff3c21`/`#e3e2dc`) en badge-kleuren (`#202023`, `#ff3c21`), functioneel als data-encoding resp. het bekende badge-kleurpatroon — niet opnieuw als issue rapporteren (`configs/bug-hunter.ts:49-69,395-420`). De gedeelde `SimulationLab.tsx`-engine (regels 288-450) gebruikt consequent `duck-*`-tokens.
- **Criterium 2 (Layout consistentie):** gebruikt hetzelfde `SimulationLabConfig`-schema (simulations/parameters/questions/badges/takeaways/computeVisuals) als de baseline-missie `algorithm-architect.ts` — geen structurele afwijking; 3 simulaties, elk met parameters + 3 vragen, is het gevestigde patroon binnen dit templatetype.
- **Criterium 4 (Copy-lengte):** `introDescription` = 21 woorden (grens leerjaar 2: <80); simulatie-beschrijvingen 15-20 woorden (grens: <60) — ruim binnen de norm.
- **Criterium 6 (Framer Motion):** geen missie-specifieke animatie-code in de config — animaties zitten in de gedeelde engine, buiten scope van deze review.

### ⚠️ Aandachtspunten
- **Visual Precision Gate — unverified**: geen Chrome-plugin bewijs beschikbaar voor deze missie specifiek. Het UI/UX-auditrapport van 30 juni noemt `bug-hunter` niet met naam en geen screenshots-map bestaat. Bekend engine-breed risico dat óók hier kan spelen (shared-shell avatar-clipping, systeem-thema lege ruimte) is al elders geëscaleerd — niet opnieuw als missie-issue rapporteren.
  - **Wat:** deze missie is nooit los gescreenshot/geaudit.
  - **Waarom:** zonder dynamisch bewijs kan niet worden bevestigd of de parameter-panel + visual-panel-layout (`SimulationLab.tsx:335-368`, `flex-col md:flex-row`) prettig oogt op mobiel bij simulatie 2 (5 toggle-parameters — de meeste parameters van de drie sims).
  - **Voorstel:** meenemen in een volgende Fase B-sweep zodra een dev-server draait; geen actie nu.

### ❌ Blocking issues
_geen_

### Score
4/4 statisch-verifieerbare criteria geslaagd (Visual Precision Gate = unverified, niet fail) · Aanbeveling: **ship** (config zelf toont geen design-gebreken; ontbrekend visueel bewijs is een dekkingsgat, geen kwaliteitsprobleem)

---

## 📚 Didactiek review

**Mission:** bug-hunter (simulation-lab)
**Curriculum-plek:** Leerjaar 2, Periode 2
**SLO-claim:** 22B (Programmeren) · VSO 19A
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 22B is een geldige regulier-VO-code (Programmeren), VSO-mapping 19A aanwezig — `src/config/slo-kerndoelen-mapping.ts:113`. Enige geclaimde code, geen overclaim.
- **Criterium 2 (SLO-fit):** 22B wordt substantieel geraakt — alle drie simulaties draaien om kernactiviteiten van debuggen als programmeer-deelvaardigheid: foutmeldingen lezen (sim 1), bugtypen classificeren inclusief een concreet off-by-one-codevoorbeeld (sim 2), en debugstrategie kiezen/vergelijken (sim 3) — `configs/bug-hunter.ts:175-387`.
- **Criterium 3 (Leerdoelen helder):** expliciet `missionGoal` met meetbaar `primaryGoal` ("Ik spoor bugs systematisch op door foutmeldingen, bugtypen en debugstrategieen te analyseren") en concreet `evidence`-criterium — `configs/bug-hunter.ts:158-166`, consistent met `src/config/missionGoals.ts:459-467`.
- **Criterium 4 (Opdracht-beknoptheid):** ruim binnen leerjaar 2-grenzen (zie design-sectie) — geen wall-of-text, max 3 vragen per simulatie.
- **Criterium 5 (Leeftijds-passend vocabulary):** taal past bij 13-14-jarigen — technische termen (syntax error, runtime error, off-by-one) worden elk direct uitgelegd in de `explanation`-velden, geen onuitgelegd jargon. Toon is motiverend zonder betuttelend te zijn ("Gevonden! Goed speurwerk!" in de agent-briefing).
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in Periode 2 "Programmeren & Computational Thinking" ná `algorithm-architect`/`web-developer`/`network-navigator`/`app-prototyper` — debuggen bouwt voort op het programmeren dat leerlingen al hebben geoefend, vóór `automation-engineer`/`code-reviewer` — `src/config/curriculum.ts:180-191`.
- **Criterium 7 (Bloom-balans):** goede mix — sim 1 combineert herkennen (fouttype) met begrijpen (waarom console.log werkt), sim 2 vraagt analyseren (welke bug is gevaarlijkst, off-by-one-diagnose op echte code), sim 3 vraagt evalueren (aanpak vs. resultaat vergelijken, waarom systematisch beter is dan willekeurig). Geen pure onthoud-quiz.
- **Criterium 9 (Welzijn & inclusiviteit):** VSO-mapping aanwezig (19A); geen gevoelige onderwerpen in deze missie, geen gender-specifieke aannames.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — n.v.t., want dormant**: de agent-rol in `year2.tsx:868-912` bevat een volledig uitgewerkte 3-stappen-chat-flow (reproduceren → oorzaak vinden → fix implementeren, met `EERSTE BERICHT`, expliciete `SCOPE GUARD` en `STEP_COMPLETE`-markers per stap) die het "hints, geen directe antwoorden"-principe correct toepast ("Geef NOOIT direct de oplossing. Laat de leerling nadenken!" — regel 890). Deze rol wordt echter nooit getoond: de missie draait via `simulation-lab` (multiple-choice + parameter-simulaties), niet via chat.
  - **Wat:** ~45 regels doordachte didactische chat-content (detective-persona, scope-guard tegen "herschrijf alles", stapsgewijze scaffolding) wordt nooit aan een leerling getoond.
  - **Waarom:** geen SLO-gat — de simulation-lab-rondes dekken 22B al substantieel (zie SLO-fit hierboven) — maar wel een gemiste kans: de chat-flow zou leerlingen aan **echte, zelfgeschreven code** laten debuggen (open, begeleide reflectie), wat rijker is dan multiple-choice-classificatie van vooraf gegeven bugvoorbeelden.
  - **Voorstel:** buiten scope van deze missie-review om te fixen (activeren van een dormante rol is een missie-brede/platform-brede beslissing, geen mechanische config-fix) — bevestigd BEKEND (dormante-chat-rol = platform-breed beslispunt, zie context). Niet opgenomen in `autoFixable`.

### ❌ Blocking issues
_geen_

### SLO-fit oordeel
- **22B (Programmeren):** sterk geraakt — kernonderwerp van alle 3 simulaties, met feitelijk correcte code-voorbeelden (syntax vs. runtime error, off-by-one-lus `i <= 5` vs. `i < 5`, systematisch debuggen in 4 stappen: reproduceren → lokaliseren → diagnosticeren → fixen).

### Score
8/8 relevante criteria geslaagd (criterium 8 n.v.t. door dormant-status, geen fail) · Bloom-balans: **medium-hoog** (goede spreiding herkennen→analyseren→evalueren) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** bug-hunter (simulation-lab)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-run, geen bestaande screenshots, geen vermelding in het recente (30 juni) UI/UX-auditrapport.

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`/`@ts-expect-error`, config volledig getypeerd via `SimulationLabConfig`/`VisualData` — `configs/bug-hunter.ts:1,151`.
- **Criterium A4 (Imports via alias):** enige import is het gedeelde type via relatief pad `'../SimulationLab'`, het gevestigde patroon binnen de configs-submap van simulation-lab (consistent met `algorithm-architect.ts`) — geen afwijking.
- **Criterium A6 (Restart-safe state):** state/autosave wordt afgehandeld door de gedeelde `SimulationLab.tsx` via `useMissionAutoSave` (regel 135-138) — engine-verantwoordelijkheid, correct toegepast, buiten scope van missie-specifieke review.
- **Criterium A7 (Security):** geen user-input-verwerking in de config zelf (parameter-sliders/toggles/select en multiple-choice-vragen, geen vrije tekstinvoer naar een AI-model) — geen sanitization-risico op missie-niveau.
- **Feitelijke code-correctheid ("bugs" en "oplossingen") — geverifieerd correct:**
  - Syntax error vs. runtime error-onderscheid (`configs/bug-hunter.ts:227-239`): correct — syntax error = compile-time schrijffout, runtime error = fout tijdens uitvoering.
  - Off-by-one-voorbeeld (`configs/bug-hunter.ts:288-302`): `for (let i = 0; i <= 5; i++)` telt i = 0,1,2,3,4,5 = **6 iteraties**, niet 5. De config claimt correct dat dit "één stap te ver (tot 5 inclusief)" loopt en dat `i < 5` de bedoelde 5 elementen (0 t/m 4) geeft — reken nagerekend, klopt.
  - Vier-stappen-debugmethode "Reproduceren → Lokaliseren → Diagnosticeren → Fixen" (`configs/bug-hunter.ts:355-369`): standaard, correcte volgorde, consistent met de `STEP_COMPLETE`-stappen in de agent-briefing (`year2.tsx:900-902`).
  - "Logische fout is gevaarlijkst"-claim (`configs/bug-hunter.ts:272-286`): correct onderbouwd — logische fouten geven geen foutmelding (code draait door), in tegenstelling tot syntax errors die de editor direct toont.
  - `computeVisuals`-scoreformules (`configs/bug-hunter.ts:19-23`) zijn intern consistent met de per-vraag `points`-velden — geen losstaande/tegenstrijdige scoringslogica.
- **Scoring-consistentie geverifieerd (nagerekend):** som van `points` per simulatie = sim1 (10+10+10=30) = `maxScore: 30`; sim2 (15+10+15=40) = `maxScore: 40`; sim3 (10+10+10=30) = `maxScore: 30`; totaal 100 = config-`maxScore: 100`. Geen scoring-mismatch.

#### ⚠️ Aandachtspunten
- **Dormante agent-rol bevestigd (zie ook didactiek-sectie):** `src/config/agents/year2.tsx:849-931` bevat een complete `systemInstruction` + `steps` + `bonusChallenges: null` die nooit wordt uitgevoerd omdat de missie via `simulation-lab` (niet chat) rendert.
  - **Wat:** dode configuratie — geen bug, geen bereikbaarheidsprobleem voor de leerling, maar wel technische schuld (twee parallelle content-bronnen voor dezelfde missie, waarvan er één nooit rendert).
  - **Risico:** laag voor de huidige leerling-ervaring; risico is dat een toekomstige onderhouder de `year2.tsx`-content bijwerkt in de veronderstelling dat die live is.
  - **Voorstel:** geen fix binnen deze review — platform-breed beslispunt (BEKEND), buiten `autoFixable`-scope.
- **`briefingImage`-asset ontbreekt** (`year2.tsx:858`: `/assets/agents/bug-hunter.webp`) — geverifieerd: bestand bestaat niet in `public/assets/agents/`. Dit is echter **geen missie-specifiek probleem** — geverifieerd dat ~55 van de ~94 `briefingImage`-referenties over alle leerjaren hetzelfde ontbrekende-bestand-patroon vertonen (engine-brede/platform-brede lijst, BEKEND) — niet opnieuw als missie-issue rapporteren.

#### ❌ Blocking issues
_geen_

### Dynamic verificatie
Niet uitgevoerd — geen dev-server actief tijdens deze review, geen bestaande screenshots, en geen vermelding in het recente (30 juni) UI/UX-auditrapport. Aanbeveling: meenemen in een gerichte Fase B-sweep.

### Score
Static: 5/5 relevante criteria geslaagd (incl. feitelijke code-correctheid en scoring-consistentie) · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (statisch schoon, feitelijk correct, scoring klopt exact; dynamische dekking is een openstaand actiepunt, geen blocker)

---

## Samenvatting & triage

**triageScore-berekening:** design=10, didactiek=10, tech=10 (op 0-10-kwaliteitsschaal, waarbij ontbrekend dynamisch bewijs bij afwezigheid van blocking issues geen scoreverlaging rechtvaardigt — beide zusterreviews in deze wave-familie hanteren dezelfde conventie).

```
triageScore = (10-10)*0.3 + (10-10)*0.4 + (10-10)*0.3 = 0
```

Laagste triageScore = beste (geen actie nodig). Deze missie heeft geen blocking issues, geen didactische misalignment, geen scoring- of feitelijke-correctheidsfouten. De enige twee aandachtspunten (dormante agent-rol, ontbrekende briefingImage) zijn beide expliciet BEKEND/platform-breed en niet missie-specifiek autoFixable.

**Eindoordeel: ship.** Geen wijzigingen doorgevoerd (conform opdracht — "Wijzig NIETS").
