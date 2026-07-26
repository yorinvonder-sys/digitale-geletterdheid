# Developer Code Academy Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Breid de developer-only Code Academie uit naar 24 rijke, visuele lessen met betrouwbare lokale voortgang en leerdata.

**Architecture:** Splits lesinhoud, visualisaties, voortgang en schermlogica op in kleine bestanden. De hoofdcomponent orkestreert alleen selectie en voortgang; alle cijfers worden afgeleid uit vaste lesmetadata en lokaal afgeronde lessen.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS, Lucide React, Node test runner.

## Global Constraints

- Alleen zichtbaar binnen het bestaande developerdashboard.
- Geen nieuwe database- of Supabase-opslag.
- Alle tekst is Nederlands.
- Geen fictieve gebruiksmetingen; alleen afgeleide les- en voortgangsdata.
- Bestaande v1-voortgang wordt gemigreerd.
- Minimaal 44 px hoge interactieve bedieningselementen.

---

### Task 1: Uitgebreide inhoudscontracttest

**Files:**
- Modify: `tests/developer/code-academy.test.mjs`

**Interfaces:**
- Consumes: bronbestanden in `src/features/developer/code-academy/`.
- Produces: contract voor 24 lessen, vier routes, rijke inhoud en lokale opslag.

- [ ] **Step 1: Schrijf de falende test**

Controleer exact 24 les-id's, vier route-id's, minimaal vijf visualisatietypen, rijke velden en lokale migratie.

- [ ] **Step 2: Controleer dat de test faalt**

Run: `node --test tests/developer/code-academy.test.mjs`
Expected: FAIL omdat de opgesplitste inhoud en 24 lessen nog ontbreken.

- [ ] **Step 3: Commit**

```bash
git add tests/developer/code-academy.test.mjs
git commit -m "test(developer): specificeer uitgebreide Code Academie"
```

### Task 2: Typen, routes en 24 lessen

**Files:**
- Create: `src/features/developer/code-academy/types.ts`
- Create: `src/features/developer/code-academy/content/fundament.ts`
- Create: `src/features/developer/code-academy/content/react.ts`
- Create: `src/features/developer/code-academy/content/data.ts`
- Create: `src/features/developer/code-academy/content/review.ts`
- Create: `src/features/developer/code-academy/academyContent.ts`

**Interfaces:**
- Produces: `ACADEMY_TRACKS`, `ACADEMY_LESSONS`, `AcademyLesson`, `AcademyTrack`.

- [ ] **Step 1: Definieer gedeelde types**
- [ ] **Step 2: Voeg zes fundamentlessen toe**
- [ ] **Step 3: Voeg zes React-lessen toe**
- [ ] **Step 4: Voeg zes data- en Supabase-lessen toe**
- [ ] **Step 5: Voeg zes DGskills- en reviewlessen toe**
- [ ] **Step 6: Exporteer routes en gecombineerde lessen**
- [ ] **Step 7: Commit**

```bash
git add src/features/developer/code-academy
git commit -m "feat(developer): voeg 24 rijke academielessen toe"
```

### Task 3: Lokale voortgang en migratie

**Files:**
- Create: `src/features/developer/code-academy/progress.ts`

**Interfaces:**
- Produces: `readAcademyProgress()`, `writeAcademyProgress(ids)`, `resetAcademyProgress()`.

- [ ] **Step 1: Lees v2-opslag veilig**
- [ ] **Step 2: Migreer geldige v1-les-id's wanneer v2 ontbreekt**
- [ ] **Step 3: Filter onbekende en dubbele id's**
- [ ] **Step 4: Commit**

```bash
git add src/features/developer/code-academy/progress.ts
git commit -m "feat(developer): maak academievoortgang migreerbaar"
```

### Task 4: Visuele componenten

**Files:**
- Create: `src/features/developer/code-academy/AcademyVisual.tsx`
- Create: `src/features/developer/code-academy/AcademyArchitectureMap.tsx`

**Interfaces:**
- Consumes: `AcademyVisualConfig`.
- Produces: `AcademyVisual`, `AcademyArchitectureMap`.

- [ ] **Step 1: Bouw flowvisualisatie**
- [ ] **Step 2: Bouw boom-, lagen-, datareis-, vergelijking- en cyclusvisualisaties**
- [ ] **Step 3: Bouw volledige DGskills-architectuurkaart**
- [ ] **Step 4: Voeg toegankelijke tekstlabels toe**
- [ ] **Step 5: Commit**

```bash
git add src/features/developer/code-academy/AcademyVisual.tsx src/features/developer/code-academy/AcademyArchitectureMap.tsx
git commit -m "feat(developer): voeg interactieve academievisualisaties toe"
```

### Task 5: Overzicht met leerdata

**Files:**
- Create: `src/features/developer/code-academy/AcademyOverview.tsx`

**Interfaces:**
- Consumes: lessen, routes, afgeronde id's en lesselectiecallback.
- Produces: routevoortgang, aanbevolen les, resterende tijd en lesgroepen.

- [ ] **Step 1: Bereken totale en routevoortgang**
- [ ] **Step 2: Bereken resterende tijd uit lesmetadata**
- [ ] **Step 3: Toon architectuurkaart en routekaarten**
- [ ] **Step 4: Toon lineair ontgrendelde lessen**
- [ ] **Step 5: Commit**

```bash
git add src/features/developer/code-academy/AcademyOverview.tsx
git commit -m "feat(developer): voeg leerdata en routeoverzicht toe"
```

### Task 6: Rijke lesweergave

**Files:**
- Create: `src/features/developer/code-academy/AcademyLessonView.tsx`

**Interfaces:**
- Consumes: één `AcademyLesson`, voltooiingsstatus en navigatiecallbacks.
- Produces: complete leservaring met visual, uitleg, code, datareis, risico's, praktijkopdracht, prompt en quiz.

- [ ] **Step 1: Bouw lesheader en visuele uitleg**
- [ ] **Step 2: Toon begrippen en uitlegsecties**
- [ ] **Step 3: Toon code en datareistabel**
- [ ] **Step 4: Toon risico's, praktijkopdracht en AI-prompt**
- [ ] **Step 5: Bouw quizfeedback en afronding**
- [ ] **Step 6: Commit**

```bash
git add src/features/developer/code-academy/AcademyLessonView.tsx
git commit -m "feat(developer): maak academielessen inhoudelijk rijker"
```

### Task 7: Hoofdcomponent vereenvoudigen en verifiëren

**Files:**
- Modify: `src/features/developer/DeveloperCodeAcademy.tsx`
- Test: `tests/developer/code-academy.test.mjs`

**Interfaces:**
- Consumes: inhoud, voortgang, overzicht en lesweergave.
- Produces: compacte academie-orchestrator.

- [ ] **Step 1: Vervang monolithische component door orchestrator**
- [ ] **Step 2: Behoud integratie in `DeveloperDocsViewer`**
- [ ] **Step 3: Run contracttest**

Run: `node --test tests/developer/code-academy.test.mjs`
Expected: PASS.

- [ ] **Step 4: Run typecheck en build**

Run: `npm run typecheck:app && npm run build:prod`
Expected: beide slagen zonder TypeScript- of buildfout.

- [ ] **Step 5: Commit**

```bash
git add src/features/developer/DeveloperCodeAcademy.tsx tests/developer/code-academy.test.mjs
git commit -m "refactor(developer): rond uitgebreide Code Academie af"
```
