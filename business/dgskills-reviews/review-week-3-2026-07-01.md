# Missie-review: review-week-3 ("De Ethische Raad")

**Datum:** 2026-07-01
**Wave:** 10 (verse review)
**Werkelijk templateType:** `ethics-council` — **niet** `debate-arena`. Losgekoppeld via PR #184 (2026-06-30) naar een eigen template (`src/features/missions/templates/ethics-council/`). Config staat op `src/features/missions/templates/ethics-council/configs/review-week-3.ts`.

## Bronnen gelezen

- Config: `src/features/missions/templates/ethics-council/configs/review-week-3.ts`
- Engine: `src/features/missions/templates/ethics-council/EthicsCouncil.tsx`
- Sub-componenten: `IntroDuck.tsx`, `LegaalDossier.tsx`, `EerlijkDossier.tsx`, `TransparantDossier.tsx`, `UitdagingBoss.tsx`, `VonnisClimax.tsx`, `RewardHud.tsx`, `SealRow.tsx`
- Agent-rol: `src/config/agents/year1.tsx:3004` (systemInstruction)
- SLO: `src/config/slo-kerndoelen-mapping.ts:85`
- Curriculum: `src/config/curriculum.ts:136` (Leerjaar 1, Periode 4, reviewMissions)
- MissionGoal: `src/config/missionGoals.ts:356`
- UI/UX-audit `docs/audits/student-missions-ui-ux-review-2026-06-30.md`: **geen match** — missie is post-audit ontkoppeld naar ethics-council, dus niet in die sweep meegenomen
- Screenshots-map: **niet aanwezig** (geen `.ui-review/`-entry voor review-week-3) — dynamische multi-viewport-verificatie is in deze pass niet uitgevoerd

## 🎨 Design review

**Mission:** review-week-3 (ethics-council)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** consistent `duck-bg`, `duck-ink`, `duck-acid`, `duck-gray` door alle 6 sub-componenten. Geen hex-literals aangetroffen (`sub/*.tsx`, alle bestanden).
- **Criterium 2 (Layout consistentie):** eerste missie van dit gloednieuwe templateType (post-#184 split) — geen zusterbaseline binnen `ethics-council` beschikbaar; niet als fout te tellen.
- **Criterium 3 (Knop-clarity):** alle knoppen hebben label + icon (`ChevronRight`), disabled-states met `disabled:opacity-40` — `LegaalDossier.tsx:177-185`, `TransparantDossier.tsx:146-154`, `UitdagingBoss.tsx:121-129`. Geen dode knoppen.
- **Criterium 4 (Copy-lengte, leerjaar 1):** ruim binnen grenzen — `introDescription` 44 woorden (<80), `problemScenario` 20 woorden, alle 3 dilemma's in systemInstruction 31-38 woorden (<60 per opdracht).
- **Criterium 6 (Framer Motion):** functioneel gebruik — progressive disclosure (`LegaalDossier.tsx:105-117` AnimatePresence voor toelichting), quality-meter-animatie (`TransparantDossier.tsx:115-119`), seal-reveal met stagger (`SealRow.tsx:21-25`). Geen wrapper-spam, max 2-4 gelijktijdige animaties per scherm.
- **Criterium 7 (Toegankelijkheid, basis):** focus-states aanwezig (`focus-visible:ring-2` op start-knop `IntroDuck.tsx:83`, `focus:border-duck-acid` op inputs); geen info uitsluitend via kleur (seal-status toont zowel tekst "Goedgekeurd"/"Aandacht nodig" als kleur, `VonnisClimax.tsx:133-141`).

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: unverified — geen Chrome-plugin-bewijs beschikbaar in deze pass (geen dev-server gestart, geen screenshots-map voor deze missie). Statisch oordeel op basis van code is positief (geen overlap-verdachte structuren, consistente `space-y-4`-rhythm), maar dynamische bevestiging ontbreekt.
  - **Voorstel:** meenemen in een volgende wave zodra een dev-preview-run voor `ethics-council`-missies draait.
- **Criterium 5 (Responsive)**: alleen statisch beoordeeld — `max-w-lg`/`max-w-md` + `w-full` overal, geen vaste pixel-widths aangetroffen. Dynamische multi-viewport-screenshots ontbreken (zelfde reden als Visual Precision Gate).

### ❌ Blocking issues
- Geen.

### Score
6/7 criteria hard geslaagd, 1 unverified (dynamisch) · Aanbeveling: **ship** (met aantekening: dynamische visuele verificatie is een openstaande follow-up, geen blocker)

---

## 📚 Didactiek review

**Mission:** review-week-3 (ethics-council)
**Curriculum-plek:** Leerjaar 1, Periode 4 (reviewMissions, naast mission-blueprint/vision/launch)
**SLO-claim:** `23C` (Maatschappij), `21D` (AI) · VSO: `20B`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `23C` en `21D` zijn beide geldige regulier-VO-codes; `20B` is geldige VSO-code — `slo-kerndoelen-mapping.ts:85`. 2 codes = binnen de "max 3"-richtlijn.
- **Criterium 2 (SLO-fit):** sterk geraakt. `23C` (Maatschappij): alle 3 dilemma's (gezichtsscan-privacy, bias in selectie-AI, plagiaat-integriteit) zijn maatschappelijke AI-vraagstukken die de leerling expliciet moet beargumenteren (`year1.tsx:3040-3080`). `21D` (AI): dossier 2 (Eerlijk/bias) + dilemma 2 (Job-Bot) raken AI-bias direct — leerling herkent en benoemt bias-mechanisme, niet alleen consumeert.
- **Criterium 3 (Leerdoelen)**: geen expliciete `learningObjectives`-array in de config, maar `introDescription` + `takeaways` (`review-week-3.ts:53-59`) formuleren impliciete, meetbare doelen met actiewerkwoorden: "je hebt... toegepast", "je kunt uitleggen", "je kunt een ethisch oordeel onderbouwen met een claim én een reden" — dit zijn functioneel leerdoelen, ook al staan ze niet in een apart veld.
- **Criterium 5 (Leeftijds-passend):** vocabulaire past bij leerjaar 1 (12-13 jaar) — concrete, herkenbare scenario's (Instagram-scraping, leerlingenraad-selectie, ChatGPT-verslag) i.p.v. abstracte juridische taal. AVG wordt uitgelegd ("de Europese privacywet") i.p.v. als kaal jargon gebruikt — `year1.tsx` LegaalDossier keyArgument.
- **Criterium 6 (Curriculum-plek):** logisch — dit is de review-missie van Periode 4 (Eindproject), volgt na mission-blueprint/vision/launch. Leerling beoordeelt het eigen zojuist-gebouwde project, wat aansluit bij de opbouw van het blok (`curriculum.ts:130-138`).
- **Criterium 7 (Bloom-balans):** goede mix — dossier 1 (Legaal) is toepassen+evalueren (eigen project beoordelen), dossier 2 (Eerlijk) is analyseren (categoriseren van ontwerpkeuzes), dossier 3 (Transparant) is creëren (eigen uitleg formuleren), miniboss is evalueren+verdedigen (tegenargument weerleggen). Geen pure quiz-recall.
- **Criterium 8 (AI-as-copilot):** de agent-rol (`systemInstruction`, `year1.tsx:3040+`) stelt vragen, checkt op sleutelwoorden ("Moet 'Privacy', 'Toestemming'... noemen") en geeft gerichte feedback — geen kant-en-klaar antwoord. Scoring in `LegaalDossier.tsx:42-49` beloont **onderbouwing**, niet het "juiste" antwoord: een eerlijke "nee" scoort evenveel als "ja" — expliciet in de code-comment gedocumenteerd als bewuste didactische keuze tegen shallow-compliance-farming.
- **Criterium 9 (Welzijn):** VSO-mapping aanwezig (`20B`); geen gender-specifieke aannames; dilemma's zijn maatschappelijk geladen maar niet persoonlijk-gevoelig (geen zelfbeeld/pesten-onderwerp nodig).

### ⚠️ Aandachtspunten
- **Criterium 3 (impliciete leerdoelen)**: geen dedicated `learningObjectives`-veld — werkt hier prima omdat `takeaways` die rol vervult, maar voor cross-missie-tooling (bv. automatische leerdoel-rapportage aan docenten) is een expliciet veld robuuster.
  - **Voorstel:** optioneel, niet urgent — `EthicsCouncilConfig` zou een `learningObjectives?: string[]` kunnen krijgen die de bestaande `takeaways` parallelleert, zodat toekomstige ethics-council-missies het makkelijker consistent kunnen invullen.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23C (Maatschappij)**: sterk geraakt — bewijs: 3 dilemma's + Legaal/Eerlijk/Transparant-dossiers vragen expliciet maatschappelijke afweging.
- **21D (AI)**: sterk geraakt — bewijs: dossier 2 (bias-categorisatie) + dilemma 2 (Job-Bot) behandelen AI-bias-mechanisme direct, niet oppervlakkig.

### Score
8/8 criteria geslaagd (1 klein optioneel aandachtspunt) · Bloom-balans: **medium-hoog** (analyseren t/m creëren, passend bij eindproject-context) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** review-week-3 (ethics-council)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze pass, geen bestaande screenshots-map voor deze missie

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** elk `<button>` heeft functionele `onClick` — geen dode knoppen in de 6 sub-componenten.
- **A2 (Error/empty states):** n.v.t. voor de meeste dossiers (geen async-fetch-afhankelijke UI); `disabled`-states op submit-knoppen functioneren als input-validation-guard (`canSubmit`/`canContinue`-patronen, consistent in `LegaalDossier.tsx:40`, `TransparantDossier.tsx:29`, `UitdagingBoss.tsx:28`).
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`/`@ts-expect-error` aangetroffen in de hele `ethics-council`-map. Alle props expliciet getypeerd via interfaces (`EthicsCouncilConfig`, `AvgAdvocaatInfo`, per-component props).
- **A6 (Restart-safe state):** `useMissionAutoSave` correct toegepast (`EthicsCouncil.tsx:128-131`), plus een **expliciete stale-save-guard** (`EthicsCouncil.tsx:136-144`) die een oude debate-arena-save detecteert via het `_template`-discriminatorveld en reset — dit is een sterk staaltje defensief ontwerp specifiek gebouwd voor de PR #184-migratie (leerlingen die halverwege de oude debate-arena-versie zaten, krijgen geen corrupte state).
- **A7 (Security):** geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`-definitie in de template zelf — de `systemInstruction` voor de chat-rol (indien gebruikt) leeft server-side in `year1.tsx`/agent-config-flow, niet in het template-component.

#### ⚠️ Aandachtspunten
- **A4 (Imports via `@/*` alias)**: sub-componenten gebruiken relatieve cross-template imports i.p.v. `@/*`:
  - `EerlijkDossier.tsx:2` → `from '../../review-arena/sub/Categorize'`
  - `RewardHud.tsx:2` → `from '../../builder-canvas/sub/MilestoneToast'`
  - `VonnisClimax.tsx:2,5` → `from '../../shared/CompletionScreen'`, `from '../../shared/types'`
  - `IntroDuck.tsx:5-6` → `from '../../shared/MissionGoalBanner'`, `from '../../shared/types'`
  - **Wat:** dit is deels het bestaande `shared/`-patroon (goed, verwacht binnen templates), maar `EerlijkDossier` en `RewardHud` importeren rechtstreeks uit **andere template-mappen** (`review-arena`, `builder-canvas`) i.p.v. uit `shared/`.
  - **Risico:** koppelt `ethics-council` aan de interne structuur van `review-arena` en `builder-canvas` — een toekomstige refactor/verwijdering van `Categorize` of `MilestoneToast` in die templates breekt `ethics-council` stil (geen expliciete afhankelijkheidsdeclaratie, alleen een relatief pad).
  - **Voorstel:** dit is een cross-template architectuurkeuze (component-hergebruik zonder promotie naar `shared/`) — geen missie-specifieke bug, dus niet autoFixable binnen deze missie-review. Vermeldenswaardig voor een platform-brede opruimronde (bv. `Categorize` en `MilestoneToast` promoveren naar `templates/shared/` als ze door meerdere templates gebruikt worden), maar buiten scope van dit rapport.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — "dynamic verificatie niet uitgevoerd — geen dev-server". Geen screenshots, console-logs of network-logs beschikbaar voor deze pass.

### Score
Static: 6/7 criteria geslaagd (1 aandachtspunt, geen blocker) · Dynamic: n.v.t. · Aanbeveling: **ship** (cross-template import-koppeling is een architectuur-observatie voor een aparte opruimtaak, geen missie-blocker)

---

## Samenvatting

| Rubric | Score (0-10, 10=uitstekend) |
|---|---|
| Design | 8.5 |
| Didactiek | 8.0 |
| Tech | 8.0 |

**triageScore** = (10-8.5)×0.3 + (10-8.0)×0.4 + (10-8.0)×0.3 = 0.45 + 0.80 + 0.60 = **1.85**

**Eindoordeel: ship.** De missie is sinds PR #184 losgekoppeld van debate-arena naar een eigen, goed doordacht `ethics-council`-template. Sterkste punten: de scoring beloont onderbouwing boven het "juiste" antwoord (didactisch integer), en de stale-save-guard beschermt leerlingen die mid-migratie zaten. Geen blocking issues in design, didactiek of static tech. Enige echte openstaande punten zijn buiten missie-scope: dynamische multi-viewport-verificatie (geen dev-server in deze pass) en een cross-template import-koppeling die op platformniveau opgeruimd kan worden.

## AutoFixable

Geen. Beide aandachtspunten (dynamische verificatie ontbreekt; cross-template imports) zijn niet mechanisch fixbaar binnen missie-scope — de eerste vereist een dev-server-run, de tweede is een architectuurkeuze die andere templates raakt.
