# Missie-review: De Blauwdruk

**Mission ID:** mission-blueprint
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 1, Periode 4 (Eindproject)
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 15, verse review)

---

## Registratie-check (10-punts patroon)

| Bron | Status | Bewijs |
|---|---|---|
| Config | ✅ | `src/features/missions/templates/builder-canvas/configs/mission-blueprint.ts` |
| Agent-rol (year1.tsx) | ✅ | `src/config/agents/year1.tsx:3080` |
| `RoleId`-union | ✅ | `src/types.ts:29` |
| `AGENT_ROLE_IDS` | ✅ | `src/config/agentRoleIds.ts:36` |
| `curriculum.ts` | ✅ | `src/config/curriculum.ts:131` — Leerjaar 1, Periode 4 (Eindproject) |
| `slo-kerndoelen-mapping.ts` (autoritair) | ✅ | `src/config/slo-kerndoelen-mapping.ts:86` — `22A` (regulier), `19A` (VSO) |
| `missionGoals.ts` | ✅ | `src/config/missionGoals.ts:329-336` — primaryGoal/criteria/evidence consistent met config |
| `chatRoleId` | ✅ | `chatRoleId: 'mission-blueprint'`, `enableChat: true` — koppeling correct |

Geen desyncs gevonden — alle registratiepunten kloppen.

---

## 🎨 Design review

**Score: 8/10**

### ✅ Geslaagd

- **Geen hardcoded hex-literals of legacy `lab-*` tokens in de config:** `mission-blueprint.ts` bevat geen enkele Tailwind-class — alle styling zit in de gedeelde `BuilderCanvas`-engine/sub-componenten (standaard patroon voor dit templateType, geen missie-specifieke afwijking).
- **Badge-kleuren consistent met duck-hex-waarden:** `badges` (`mission-blueprint.ts:137-143`) gebruikt `#e1ff01` (= `duck-acid`), `#202023` (= `duck-ink`), `#ff3c21` (= `duck-error`) — exact de toegestane 6-token-set, via hex i.p.v. class-referentie omdat de badge-config buiten JSX leeft (zelfde patroon als andere builder-canvas-missies).
- **Copy-lengte ruim binnen leerjaar 1-2-grens:** `introDescription` (39 woorden) < 80-woordengrens; per-stap `description`/`instruction` velden zijn kort en scanbaar.
- **Oplopende badge-drempels met coherente titels** (`0/25/50/70/90`) passend bij de 4-stappen-opbouw — zelfde patroon als andere builder-canvas-missies (bv. website-bouwer).
- **Generieke `text-preview` zonder engine-wratjes:** `previewType: 'text-preview'` (`mission-blueprint.ts:18`) — geverifieerd tegen `PreviewPanel.tsx:44` dat de missie-specifieke iframe-conditional (`config.missionId === 'website-bouwer'`) hier niet van toepassing is; deze missie krijgt de schone generieke tekstsamenvatting-preview.

### ⚠️ Aandachtspunten

- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass (geen dev-server-run in scope), en `mission-blueprint` wordt niet genoemd in de UI/UX-review van 2026-06-30 (`docs/audits/student-missions-ui-ux-review-2026-06-30.md` — geen treffer). Statische analyse toont geen evident overlap/afkap-risico; deze missie gebruikt uitsluitend de generieke builder-canvas-engine (geen missie-unieke UI-elementen zoals bij website-bouwer), wat het risico op een missie-specifieke visuele regressie beperkt — maar een echte visuele check ontbreekt.

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 8.5/10**
**SLO-claim:** 22A (regulier) · 19A (VSO)

### ✅ Geslaagd

- **SLO-fit sterk en terecht ingeperkt:** de mapping-comment (`slo-kerndoelen-mapping.ts:86`) legt expliciet uit waarom 21A (systeem-inzet) NIET wordt geclaimd: "projectplan maken = product, niet systeemkennis" — dit is precieze SLO-discipline. 22A (digitale producten/planmatig werken) wordt substantieel geraakt: alle 4 stappen draaien om het plánmatig opbouwen van een digitaal product (definitie van Done → taken → volgorde → cloudopslag), geen oppervlakkig contact.
- **Concreet, meetbaar leerdoel:** `missionGoals.ts:330` — "Ik maak een duidelijk plan voor mijn eindproject met taken, volgorde en opslagplek" — tastbaar, geen vage "begrijpt"-formulering. `criteria.min: 4` matcht exact de 4 config-stappen.
- **Sterke scaffolding, oplopende structuur:** project beschrijven (met expliciete "definitie van Done") → taken opschrijven (min. 8, elk met werkwoord + tijdsinschatting) → volgorde + afhankelijkheden (min. 3) → cloudopslag. Elke stap bouwt aantoonbaar voort op de vorige.
- **Reflectievragen boven kaal Bloom-1-niveau:** stap 1 vraagt leerlingen een correcte definitie van "Done" te herkennen (toepassen/analyseren, niet enkel onthouden); stap 3 vraagt het concept "afhankelijkheid" correct te classificeren. Consistente Bloom-mix over de 4 stappen.
- **Expliciete AI-as-copilot-discipline in de reflectievraag zelf:** stap 2's reflectievraag (`mission-blueprint.ts:64-75`) toetst letterlijk het AI-copiloot-principe ("AI schrijft mijn hele eindproduct" is fout-antwoord, "ik gebruik AI om te brainstormen... maar ik beslis zelf" is correct) — een didactisch slimme zelfversterkende koppeling tussen missie-inhoud en platform-principe.
- **`systemInstruction`-regels (`year1.tsx:3110-3114`) verbieden expliciet kant-en-klare planningen** en sturen naar Socratische vraagstelling ("Wat is stap 1?" i.p.v. "Denk na over de volgorde") — sterke copiloot-discipline, consistent met de rubric-eis.
- **Cloud-opslagstap herbruikt eerder geleerde stof (spaced repetition):** stap 4's reflectievraag verwijst expliciet terug naar "Cloud Commander" (een eerdere missie/periode) — bewuste curriculaire opbouw i.p.v. geïsoleerde herhaling.
- **Coach-plan-desync-check: geen desync.** `systemInstruction` beschrijft "WERKWIJZE — 4 STAPPEN" (`year1.tsx:3116-3147`: project helder maken → taken bedenken → volgorde en tijd → opslaan en checken), 1-op-1 congruent met de 4 config-stappen (`project-kiezen` → `stappen-lijst` → `volgorde` → `opslaan`). Zowel volgorde als inhoud matchen. (Bekend: markers zijn functioneel inert in builder-canvas, alleen coaching-tekstkwaliteit telt — hier is die kwaliteit sterk congruent.) **Deze missie hoort niet bij de 6 al-geraakte desync-missies.**

### ⚠️ Aandachtspunten

- **Chat quick-steps missen expliciete stap-1-vertegenwoordiging:** de agent-rol se chat-`steps`-array (`year1.tsx:3167-3170`, de 3 losse suggestie-chips "Lijst" / "Volgorde" / "Opslaan") dekt coach-werkwijzestappen 2, 3 en 4 maar niet stap 1 ("project helder maken"). Niet-blocking: deze chips zijn UI-suggesties voor de chat-input, niet de canvas-stappen zelf (die zijn wél compleet, zie boven), en de eerste-bericht-tekst (`year1.tsx:3159-3165`) opent zelf al met de stap-1-vraag ("Wat ga je maken voor je eindproject?"), dus de leerling wordt niet aan zijn lot overgelaten.
  - **Voorstel (laag risico):** een vierde quick-step-chip toevoegen zoals `{ title: "Idee", description: "Vertel wat je gaat maken.", example: "Typ: 'Ik maak een [project] voor [doelgroep].'" }` voor volledige symmetrie met de 4 werkwijzestappen — puur cosmetisch, geen didactisch gat.
- **21D (AI) wordt in de periode-brede `sloFocus` genoemd maar niet door deze specifieke missie geclaimd:** periode 4's `sloFocus: ['21A', '21B', '21D', '22A', '23C']` (`curriculum.ts:129`) is breder dan wat mission-blueprint individueel claimt (`22A` alleen) — dit is correct en verwacht (de periode-brede focus wordt gedekt door de 3 missies + review-week-3 samen, niet door elke missie los), geen actie nodig.

### ❌ Blocking issues

Geen.

### SLO-fit oordeel

- **22A (Digitale producten/planmatig werken):** sterk geraakt — alle 4 stappen zijn planmatig-werken-in-actie (project→taken→volgorde→opslag), niet oppervlakkig.
- **19A (VSO-equivalent):** consistent met 22A-mapping, zelfde onderbouwing van toepassing.

---

## 🔧 Tech review

**Score: 9/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope).

### Static analyse

#### ✅ Geslaagd

- **Registratie 100% compleet** (zie tabel bovenaan) — alle 8 gecontroleerde platform-bouwstenen aanwezig en onderling consistent (geen enkele bron wijkt af van de andere).
- **`maxScore: 100` consistent met `steps-complete, min: 4`:** `BuilderCanvas.tsx:78` berekent `pointsPerStep = Math.floor(maxScore / steps.length) = 25`; `missionGoals.ts:333` eist `min: 4` — 4 stappen × 25 punten = 100, geen scoreplafond-mismatch.
- **Coach-plan-desync-check (tech-perspectief):** geen `STEP_COMPLETE`-achtige functionele marker-afhankelijkheid gevonden in `BuilderCanvas.tsx` voor deze missie — bevestigt dat de "WERKWIJZE — 4 STAPPEN"-tekst in `systemInstruction` puur coaching-copy is, congruent met de config-stappen (zie didactiek-sectie). Geen desync, geen technisch risico.
- **Geen missie-specifieke conditionals in de gedeelde engine voor `mission-blueprint`:** in tegenstelling tot `website-bouwer` (`PreviewPanel.tsx:44`, hardcoded `missionId`-check voor de HTML-iframe-preview) heeft deze missie geen enkele `config.missionId === 'mission-blueprint'`-tak in de engine — schoner, geen architectuur-wratje voor deze missie specifiek.
- **`chatRoleId` correct gekoppeld** aan `enableChat: true` — chat-functionaliteit is actief (niet dormant) voor deze missie.
- **Geen `any`-types, geen `dangerouslySetInnerHTML`, geen relatieve `../../`-imports in de config-file** — config is puur data (geen JSX/handlers), dus TypeScript-discipline-criteria (A3/A4) zijn hier triviaal geslaagd; er is geen missie-specifieke code die deze criteria zou kunnen schenden.

#### ⚠️ Aandachtspunten

- **Zelfrapportage i.p.v. code-verificatie (checklistItems + textPrompt):** de "cloud opslaan"-stap (`mission-blueprint.ts:106-133`) vraagt de leerling een OneDrive-deellink te plakken (`minTextLength: 30`) maar valideert alleen de tekstlengte, niet of het daadwerkelijk een geldige/werkende link is. Dit is een bekend, platform-breed patroon in builder-canvas (zelfrapportage i.p.v. inhoudelijke validatie) en geen missie-specifiek gebrek — geen actie nodig hier.
- **Geen automatische validatie dat de takenlijst daadwerkelijk ≥8 taken bevat vóór de checklist als compleet telt:** checklistItem `acht-taken` (`mission-blueprint.ts:58`) is zelf-afgevinkt door de leerling, niet geparsed uit de `textPrompt`-inhoud. Zelfde platform-breed patroon als hierboven — geen missie-specifieke actie.

#### ❌ Blocking issues

Geen.

### Dynamic verificatie

Niet uitgevoerd deze pass — token-discipline batch-review (wave 15) beperkt scope tot statische drie-rubriek-analyse. Geen screenshots-map beschikbaar; `mission-blueprint` komt niet voor in de UI/UX-review van 2026-06-30.

---

## Samenvatting

- **Geslaagd:** design 5/6 · didactiek 8/9 · tech 6/7 substantiële criteria
- **Blocking:** 0
- **Resterende issues:** 1 design (Visual Precision Gate unverified, geen screenshots deze pass) · 1 didactiek (chat quick-steps missen stap-1-chip, cosmetisch — eerste-bericht dekt dit al inhoudelijk) · 2 tech (zelfrapportage-checklist, platform-breed patroon) — alle laag risico, geen showstoppers
- **Sterkste punt:** een van de schoonste coach-plan/canvas-congruenties in de hele batch — de 4 `systemInstruction`-werkwijzestappen en de 4 config-stappen matchen zowel qua volgorde als qua inhoud exact, en de reflectievraag in stap 2 toetst het AI-copiloot-principe direct binnen de missie-inhoud zelf (zelfversterkend didactisch ontwerp).
- **Coach-plan-desync-platformpunt:** deze missie hoort NIET bij de 6 al-geraakte desync-missies — systemInstruction en config-stappen zijn 1-op-1 congruent (4 stappen, geen mismatch, geen actie nodig).

**Triage-score:** (10-8)×0.3 + (10-8.5)×0.4 + (10-9)×0.3 = 0.6 + 0.6 + 0.3 = **1.5** (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3)

**Verdict: ship**

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 15) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Score en verdict zijn ruim boven de ship-drempel; Codex-gate niet noodzakelijk vóór release, wel aanbevolen als onderdeel van een periodieke platform-brede adversarial sweep.
