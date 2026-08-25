# Missiereview: innovation-lab

**Datum:** 2026-08-25
**templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

De missie is config-only (geen eigen JSX/styling) — alle Tailwind/layout/knop-criteria worden gedekt door de gedeelde builder-canvas-engine, al beoordeeld. Deze sectie behandelt alleen wat de config zelf raakt.

### ✅ Geslaagd
- Copy-lengte: intro 40 woorden, alle 4 instructies 62–74 woorden — ruim binnen de leerjaar-3-grenzen (intro <120, opdracht <80).
- Badges gebruiken duck-tokens (`#e1ff01`, `#202023`, `#ff3c21`) consistent met het DUCK-palet.

### ⚠️ Aandachtspunten
- **Contrast (via engine, missie-breed relevant)** — `sub/StepInstructionPanel.tsx:157` en `ChecklistItem.tsx:31` gebruiken `/70`-opacity op `text-duck-ink` voor zowel getypte leerlingtekst als placeholder, en voor afgevinkte/niet-afgevinkte labels. Dit raakt elke stap van innovation-lab (4 tekstvelden + 4×4 checklist-items), dus de impact is hier reëel ook al is de oorzaak gedeeld engine-gedrag.
  - **Voorstel:** geen missie-config-fix mogelijk — dit is engine-scope, al gerapporteerd; hier alleen genoteerd als impact-bevestiging.

### ❌ Blocking issues
Geen (blocking issue "dubbelklik onComplete" is engine-scope, al vastgesteld).

### Score
2/3 toepasbare criteria geslaagd (contrast is engine, niet missie-fixbaar) · Aanbeveling: ship

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **SLO-codes correct** (`src/config/slo-kerndoelen-mapping.ts:185`): `23C` (Maatschappij) en `22A` (Digitale producten) zijn geldige regulier-VO-codes, 2 stuks — geen overclaim.
- **SLO-fit**: stap 2 (technologische oplossing ontwerpen) raakt 22A substantieel; stap 4 (impact + risico's/bijeffecten) raakt 23C substantieel. Beide kerndoelen worden inhoudelijk geoefend, niet alleen aangeraakt.
- **Leerdoelen helder** (`configs/innovation-lab.ts:99-104`, `takeaways`): elk item begint met een meetbaar werkwoord ("Je kunt … identificeren", "ontwerpen", "beschrijven"), Bloom-niveaus lopen op van analyseren (probleem) naar creëren (oplossing/MVP) naar evalueren (impact/risico's).
- **Opdracht-beknoptheid**: alle velden binnen de leerjaar-3-grenzen (zie design-sectie).
- **Curriculum-plek** (`src/config/curriculum.ts:290-299`): leerjaar 3, periode 3 "Maatschappelijke Impact & Innovatie" naast `startup-simulator`, `policy-maker`, `tech-impact-analyst` — thematisch logisch, sluit aan bij voorgaande missies over technologie/maatschappij.
- **Bloom-balans**: de 4 stappen lopen expliciet op — analyseren (probleem) → ontwerpen/toepassen (oplossing) → creëren (MVP) → evalueren (impact + risico's). Geen pure recall-vragen.
- **Welzijn**: stap 4 vraagt expliciet naar risico's/bijeffecten ("wie wordt er benadeeld?") — bouwt kritisch denken over technologie in, geen doorverwijs-noodzaak want geen gevoelig persoonlijk onderwerp.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot)** — `enableChat: true`, `chatRoleId: 'innovation-lab'` (`configs/innovation-lab.ts:16-17`). De `systemInstruction` zelf staat server-side (buiten scope van deze review, conform bekende valkuil) en is dus niet hier te verifiëren; de client-config bevat geen aanwijzing van misbruik (geen hardcoded antwoorden, geen shortcuts).
- **Evidence-eis stap 1 alleen** (`configs/innovation-lab.ts:35-40`): stap 1 vraagt "twee anonieme observaties" als bewijs, stappen 2-4 hebben geen `evidence`-blok. Dat is een bewuste asymmetrie (probleemkeuze moet extern getoetst zijn, ontwerp/MVP/impact zijn redeneerwerk) — geen fout, wel vermeldenswaardig voor consistentie-check tegen vergelijkbare builder-canvas-missies.

### ❌ Blocking issues
Geen.

### Score
7/7 toepasbare criteria geslaagd · Aanbeveling: ship

---

## 🛠️ Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)

Enginebevindingen zijn al vastgesteld (gedeeld over alle builder-canvas-missies) en hier niet herhaald tenzij deze missie-config ze concreet raakt.

### ✅ Geslaagd
- **Registry-consistentie**: `innovation-lab` staat coherent in `templateRegistry.ts:62` (templateType builder-canvas, enableChat true, chatRoleId gelijk aan missionId), `slo-kerndoelen-mapping.ts:185`, `curriculum.ts:295` en `missionGoals.ts:663-671`. Geen mismatch tussen UI-zichtbaarheid en SLO-mapping.
- **Score-optelsom**: `maxScore: 100`, geen aparte per-stap scores in de config (die komen uit de gedeelde engine-logica) — niets in de config zelf breekt de bekende presence-based scoring-zwakte extra.
- **Agent-rol aanwezig**: `src/config/agents/year3.tsx:1270` heeft een `innovation-lab`-entry met briefing-image — consistent met `enableChat: true`.

### ⚠️ Aandachtspunten
- **Engine-brede bevindingen die deze missie concreet raken**: de dubbelklik-op-afronden-bug (`CompletionScreen.tsx:163`), de presence-based scoring (`BuilderCanvas.tsx:144`) en de `showMilestone`-persistentie-bug (`BuilderCanvas.tsx:229`) gelden voor alle 4 stappen van innovation-lab even sterk als voor elke andere builder-canvas-missie. Geen missie-specifieke escalatie nodig — al gedekt door de enginereview.
- **Bonuspunten-config**: `innovation-lab` heeft geen expliciete bonusScore-velden per stap zichtbaar in deze config (die zitten kennelijk in de gedeelde `checklistItems`-scoring), dus het door de engine genoemde risico "info: onRetry ontbreekt bij >60% bonuspunten" is hier niet van toepassing zolang de stapscores binnen `maxScore` blijven — geen actie nodig.

### ❌ Blocking issues
- **Dubbelklik-op-afronden** (gedeeld, `CompletionScreen.tsx:163` + `BuilderCanvas.tsx:264`): blocking op engineniveau, dus ook blocking voor innovation-lab totdat de engine-fix landt. Geen aparte fix per missie mogelijk (whitelist-scope van deze review dekt geen gedeelde engines).

### Score
3/3 missie-specifieke criteria geslaagd · engine-blocking issue overgeërfd · Aanbeveling: fix-eerst (engine-afhankelijk, niet missie-config-afhankelijk)

---

## Voorstellen

Geen mechanisch fixbare bevindingen binnen de whitelist-scope van deze missie (`configs/innovation-lab.ts`, registry/SLO/curriculum/agent-entries). De config zelf is qua copy-lengte, SLO-fit, Bloom-balans en registry-consistentie in orde. Alle gevonden issues zijn engine-scope (dubbelklik-afronden, presence-based scoring, showMilestone-persistentie, contrast-tokens) en vallen buiten wat via een config-, registry-, SLO-, curriculum- of agent-rol-entry op te lossen is.

## Samenvatting & verdict

De missie-config van `innovation-lab` is didactisch solide: heldere Bloom-opbouw (analyseren → ontwerpen → creëren → evalueren), correcte en goed onderbouwde SLO-koppeling (22A + 23C), leeftijds-passende copy-lengte voor leerjaar 3, en een expliciete risico-/bijeffecten-vraag die kritisch denken over technologie stimuleert. Registry, SLO-mapping, curriculumplaatsing en agent-rol zijn onderling consistent — geen gat tussen UI-zichtbaarheid en SLO-claim.

Het enige blocking issue (dubbelklik-op-afronden) en de belangrijkste warnings (presence-based scoring, showMilestone-bug, contrast) zijn allemaal engine-breed en al vastgesteld in de gedeelde enginereview — ze zijn hier bevestigd als concreet relevant voor deze missie, maar niet missie-specifiek fixbaar.

**Verdict: ship** (missie-config zelf) — met de kanttekening dat de engine-blocking-issue (dubbelklik-afronden) de daadwerkelijke ship-gate is voor de hele builder-canvas-familie, innovation-lab incluis.
