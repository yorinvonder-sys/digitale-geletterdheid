# Missiekwaliteitsdashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een developer-only dashboard dat de 99 actuele missies
reconcileert met de bestaande auditbron, bewijs zichtbaar maakt en
inhoudelijke beslissingen veilig vastlegt.

**Architecture:** Pure modelhelpers bouwen een actuele catalogus uit
`CURRICULUM`, voegen `review-status.json` en versieerbaar browserbewijs samen
en leiden alle KPI's af. Lazy-loaded React-componenten tonen portfolio, lijst,
detail en annotaties. Alleen de menselijke beslisstatus wordt via het bestaande
developer-settingsobject opgeslagen.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind utility classes,
Lucide, Node test runner, Playwright Chromium.

## Global Constraints

- Gebruik 99 actuele missies uit `CURRICULUM` als noemer.
- Toon statische audit, browserbewijs en menselijke validatie als verschillende
  bewijssoorten.
- Pas geen missie-inhoud, leerdoelen, antwoordmodellen of scores aan.
- Sla geen leerlinggegevens, tokens, traces of screenshots met echte accounts op.
- Een goedkeuring verandert geen auditstatus en voert geen codefix uit.
- Gebruik alleen bestaande DGSkills-designtokens en acties van minimaal 44px.
- Productierouting blijft developer-authenticated; de QA-route is alleen `DEV`.

---

### Task 1: Pure kwaliteitsmodel en broncontract

**Files:**
- Create: `src/features/developer/mission-quality/missionQualityModel.ts`
- Create: `src/features/developer/mission-quality/missionQualityData.ts`
- Create: `src/features/developer/mission-quality/missionQualityEvidence.ts`
- Create: `business/dgskills-reviews/mission-quality-evidence.json`
- Create: `tests/mission-quality/mission-quality-model.test.ts`
- Create: `tests/mission-quality/audit-source.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `buildMissionCatalog(yearGroups)`, `reconcileMissionQuality(...)`,
  `summarizeMissionQuality(...)`, `filterMissionQuality(...)`,
  `getDecisionKey(missionId, index)` en `MISSION_QUALITY_DATA`.

- [ ] **Step 1: Schrijf falende modeltests**

Test een kleine curriculumfixture op volgorde/metadata, een auditfixture met
één ontbrekende en één aanvullende missie, KPI-afleiding en gecombineerde
zoek/statusfilters.

- [ ] **Step 2: Bewijs de rode fase**

Run:

```bash
node --experimental-strip-types --test tests/mission-quality/mission-quality-model.test.ts
```

Expected: `ERR_MODULE_NOT_FOUND` voor `missionQualityModel.ts`.

- [ ] **Step 3: Implementeer het minimale pure model**

Gebruik expliciete unions voor status, prioriteit, beslisstatus en bewijstype.
Reconciliatie retourneert `missions`, `supplementalAuditRecords`,
`missingAuditMissionIds` en `sourceWarnings`.

- [ ] **Step 4: Voeg de echte broncontracttest toe**

De test leest `review-status.json` rechtstreeks, verifieert 99 unieke records,
55 blocked, 44 fixed, 88 open escalaties en valide waarden. Zij controleert ook
dat evidence alleen naar bestaande auditrecords verwijst.

- [ ] **Step 5: Run model- en broncontracttests groen**

Run:

```bash
node --experimental-strip-types --test tests/mission-quality/mission-quality-model.test.ts
node --test tests/mission-quality/audit-source.test.mjs
```

Expected: alle tests `pass`, nul failures.

### Task 2: Dashboardpresentatie en geannoteerd bewijs

**Files:**
- Create: `src/features/developer/mission-quality/MissionQualityDashboard.tsx`
- Create: `src/features/developer/mission-quality/MissionQualityKpis.tsx`
- Create: `src/features/developer/mission-quality/MissionQualityFilters.tsx`
- Create: `src/features/developer/mission-quality/MissionQualityList.tsx`
- Create: `src/features/developer/mission-quality/MissionQualityDetail.tsx`
- Create: `src/features/developer/mission-quality/AnnotatedEvidence.tsx`
- Test: `tests/mission-quality/mission-quality-model.test.ts`

**Interfaces:**
- Consumes: `MISSION_QUALITY_DATA` en pure selectors uit Task 1.
- Produces: `<MissionQualityDashboard user={user} />` en een
  `previewMode` zonder externe writes.

- [ ] **Step 1: Schrijf falende selectors voor lijst- en detailgedrag**

Voeg tests toe voor sortering op geblokkeerd/score, selectie na filterwijziging
en het onderscheid `Niet getest`, `Statisch beoordeeld` en `Browserbewijs`.

- [ ] **Step 2: Bewijs de rode fase**

Run de modeltest en bevestig dat de nieuwe selectorverwachtingen falen omdat de
functies ontbreken.

- [ ] **Step 3: Bouw KPI-, filter- en lijstcomponenten**

Gebruik semantische buttons/labels, een live resultaatteller en een
responsive master-detailindeling zonder horizontale paginascroll.

- [ ] **Step 4: Bouw detail en annotatielaag**

Render screenshot, percentagekaders, genummerde markers en bijbehorende
uitleg. Toon expliciete lege toestanden voor ontbrekend vóór- of ná-bewijs.

- [ ] **Step 5: Run tests en TypeScript-check**

Run:

```bash
npm run test:mission-quality
npm run doctor
```

Expected: nul failures en `Critical TypeScript Check OK`.

### Task 3: Besluitopslag en developerportal-integratie

**Files:**
- Modify: `src/services/developerService.ts`
- Modify: `src/features/developer/DeveloperDashboard.tsx`
- Modify: `src/features/developer/DeveloperReviewChecklist.tsx`
- Modify: `src/features/developer/mission-quality/MissionQualityDashboard.tsx`
- Create: `src/features/dev-tools/DevMissionQualityPreview.tsx`
- Modify: `src/app/AppRouter.tsx`

**Interfaces:**
- Extends: `DeveloperSettings.missionQualityDecisions`.
- Adds: lazy tab id `missionQuality`.
- Adds: development-only route `/dev/mission-quality`.

- [ ] **Step 1: Schrijf falende beslisstatustests**

Test dat `getDecisionKey('pitch-police', 0)` stabiel is en dat samenvatting
alleen expliciet opgeslagen `approved`/`changes_requested` als beoordeeld telt.

- [ ] **Step 2: Bewijs de rode fase**

Run de gerichte modeltest; verwacht een inhoudelijke assertion failure.

- [ ] **Step 3: Implementeer laden en opslaan**

Lees het bestaande settingsobject, merge alleen
`missionQualityDecisions`, en behoud alle onbekende settingsvelden. In
`previewMode` blijven beslissingen uitsluitend in componentstate.

- [ ] **Step 4: Integreer tab en DEV-preview**

Lazy-load het dashboard in `DeveloperDashboard` en routeer de niet-authenticated
preview alleen wanneer `import.meta.env.DEV` waar is.

- [ ] **Step 5: Verifieer appchecks**

Run:

```bash
npm run test:mission-quality
npm run doctor
npm run build:prod
```

Expected: alle commando's exit 0.

### Task 4: Echt screenshotbewijs en viewportmatrix

**Files:**
- Create: `public/screenshots/mission-quality/pitch-police-intro-before.webp`
- Modify: `business/dgskills-reviews/mission-quality-evidence.json`
- Create: `scripts/chrome-mission-quality-dashboard-qa.mjs`
- Modify: `package.json`

**Interfaces:**
- Evidence record gebruikt genormaliseerde `x`, `y`, `width`, `height` tussen
  0 en 100.
- QA-script start geen productieorigin en gebruikt geen accountgegevens.

- [ ] **Step 1: Leg het gedocumenteerde Pitch Politie-introprobleem lokaal vast**

Start Vite, open
`/dev/mission-preview?mission=pitch-police&reset=1`, maak een Chromium-screenshot
en koppel alleen de gedocumenteerde grijze intro-CTA aan annotatie `1`.

- [ ] **Step 2: Valideer de annotatie visueel**

Controleer het opgeslagen beeld en stel coördinaten af op het echte element.
Label het bewijs met opnamedatum, viewport en `OBJECTIVE`; wijzig de missie niet.

- [ ] **Step 3: Schrijf en run de dashboard-QA**

Controleer vier viewports:

```bash
npm run check:mission-quality:visual
```

Expected: per viewport zichtbare KPI `99`, filterresultaat,
missieselectie, geen horizontale overflow en acties van minstens 44px.

- [ ] **Step 4: Run de volledige relevante verificatie opnieuw**

```bash
npm run test:mission-quality
npm run test:ai-students:unit
npm run doctor
npm run build:prod
```

Expected: alle commando's exit 0.

### Task 5: Review en oplevering

**Files:**
- Review: alle in Task 1-4 gewijzigde bestanden.

**Interfaces:**
- Produces: een reviewbare featurebranch met feitelijke test- en browseroutput.

- [ ] **Step 1: Controleer scope en bronwaarheid**

Bevestig in de UI dat 99 curriculum, 98 gematchte audits, 55 geblokkeerde
auditrecords en 88 open beslispunten niet met elkaar worden verward.

- [ ] **Step 2: Doe React- en securityreview**

Controleer hooks, cleanup, semantische bediening, alt-tekst, lazy loading,
clientbundeldata, settingsmerge en afwezigheid van leerlinggegevens/secrets.

- [ ] **Step 3: Bekijk de uiteindelijke diff**

```bash
git status --short
git diff --check
git diff --stat
```

Expected: alleen dashboard-, bewijs-, test- en documentatiebestanden.

- [ ] **Step 4: Commit**

```bash
git add package.json docs/superpowers business/dgskills-reviews \
  public/screenshots/mission-quality scripts/chrome-mission-quality-dashboard-qa.mjs \
  src/app/AppRouter.tsx src/features/dev-tools/DevMissionQualityPreview.tsx \
  src/features/developer src/services/developerService.ts tests/mission-quality
git commit -m "feat(developer): add mission quality dashboard"
```
