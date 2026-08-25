# Rubric-review: slide-specialist

**Datum:** 2026-08-25
**TemplateType:** tool-guide
**Reviewer:** rubric-review-agent (wave 24, batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

De gedeelde `tool-guide`-engine is al apart beoordeeld (`engine-tool-guide.json`); alleen wat concreet in de config van `slide-specialist` zit wordt hieronder herhaald of aangevuld.

---

## 🎨 Design review

**Mission:** slide-specialist (tool-guide)

Deze config bevat alleen content (geen JSX/Tailwind) — Criteria 1, 2, 3, 5, 6, 7 uit de design-rubric zitten in de gedeelde engine en zijn al gedekt door de engine-review. Hier alleen de config-specifieke copy-toets.

### ✅ Geslaagd
- **Criterium 4 (copy-lengte)**: `introDescription` (35 woorden) en de meeste stap-instructies (48-53 woorden) blijven ruim onder de leerjaar 1-2-grens (intro <80, opdracht <60) — `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:9`.
- **Toon**: instructies zijn concreet en stap-voor-stap ("Open PowerPoint...", "Selecteer een titel..."), geen vaag jargon.

### ⚠️ Aandachtspunten
- **Criterium 4 (copy-lengte, randgeval)**: de instructie van stap 1 komt op ~59 woorden uit, net onder de grens van 60 voor leerjaar 1-2 — `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:24`.
  - **Wat:** de zin bevat drie samengevoegde deelinstructies (thema kiezen, kleurvariant, opslaan) in één instructieblok.
  - **Waarom:** voor leerjaar 1 is dit qua leesbaarheid nog behapbaar, maar het zit tegen het plafond; een volgende uitbreiding van deze stap duwt 'm er zo overheen.
  - **Voorstel:** desgewenst de opslaan-instructie ("Sla meteen op...") naar de tip verplaatsen; niet blocking.

### ❌ Blocking issues
_Geen._ Visual Precision Gate: niet dynamisch geverifieerd (geen dev-server / Chrome-plugin sessie in deze batch-run) — noteer als unverified, niet als fail.

### Score
2/2 geëvalueerde config-criteria geslaagd (rest via engine) · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** slide-specialist (tool-guide)
**Curriculum-plek:** Leerjaar 1, Periode 1 (`src/config/curriculum.ts:70`)
**SLO-claim:** `21A` (Digitale systemen), `22A` (Digitale producten) · VSO: `18A`, `19A` — `src/config/slo-kerndoelen-mapping.ts:34`

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21A` en `22A` zijn beide geldige regulier-codes, VSO-codes `18A`/`19A` zijn geldig en aannemelijk equivalent — `src/config/slo-kerndoelen-mapping.ts:34`.
- **Criterium 2 (SLO-fit)**: `21A` (digitale systemen/tools bedienen) wordt geraakt door de PowerPoint-bediening zelf; `22A` (digitale producten maken) door het opbouwen van een driedelig presentatiedeck met thema, beeld, animatie en overgang — beide kerndoelen worden substantieel geoefend, niet oppervlakkig.
- **Criterium 3 (leerdoelen helder)**: alle vier `learningObjectives` starten met een actiewerkwoord ("kiest", "bouwt", "voegt toe", "kiest") en zijn concreet meetbaar (bv. "maximaal vijf korte punten per inhoudsslide, één privacyveilige afbeelding en een bronnotitie") — `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:169-174`.
- **Criterium 4 (beknoptheid)**: zie design-sectie; alle copy-velden binnen leerjaar 1-2-grenzen.
- **Criterium 5 (leeftijds-passend)**: taal is direct en concreet ("Eén gedachte per slide is genoeg"), geen jargon zonder uitleg.
- **Criterium 6 (curriculum-plek)**: leerjaar 1 periode 1, samen met `print-pro` — logische plek naast andere basis-officetools, vóór de periode-1-review/assessment.
- **Criterium 9 (VSO-mapping)**: aanwezig en plausibel.

### ⚠️ Aandachtspunten
- **Criterium 7 (Bloom-balans)**: alle vier verificatievragen (2 stappen hebben er geen) zitten op "begrijpen" (waarom-vragen met multiple choice) — er is geen stap die leerling laat *evalueren* (bv. eigen slide beoordelen tegen een criterium) — `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:41-52, 96-107`.
  - **Wat:** de missie oefent vooral toepassen (bouwen) + begrijpen (waarom-vragen), geen expliciete evaluatie-stap.
  - **Waarom:** voor leerjaar 1 is dit passend niveau — geen scaffolding-gat, dus geen blocking issue, wel een gemiste kans op verdieping.
  - **Voorstel:** optioneel een korte zelfevaluatie-checklistitem toevoegen aan stap 4 ("Ik heb mijn eigen slide beoordeeld: is de tekst kort genoeg?").
- **Criterium 8 (AI-as-copilot)**: n.v.t. — `enableChat` niet aanwezig in de registry-entry (`src/config/templateRegistry.ts:103`), dus geen agent-rol; bewust slapende chat is een bekend patroon voor tool-guide-missies, geen bevinding.

### ❌ Blocking issues
_Geen._

### SLO-fit oordeel
- **21A**: sterk geraakt — leerling bedient PowerPoint zelf door alle stappen heen.
- **22A**: sterk geraakt — leerling bouwt een compleet digitaal product (3-slide deck met thema, beeld, animatie, overgang).

### Score
7/8 criteria zonder kanttekening (Bloom heeft een lichte kanttekening) · Bloom-balans: laag-medium (begrijpen + toepassen, geen evalueren) · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** slide-specialist (tool-guide)

### Fase A — Static analyse

Config bevat geen handlers, edge-function-calls of state-logica — dat zit volledig in de gedeelde `ToolGuide.tsx`-engine. De engine-review (`engine-tool-guide.json`) is leidend voor A1-A7; hieronder alleen wat déze config concreet toevoegt aan of verzwaart in die bevindingen.

### ✅ Geslaagd
- **Criterium A6 (restart-safe state)**: engine gebruikt `useMissionAutoSave`; deze config heeft geen eigen state buiten de standaard-flow.
- **Config-structuur**: `maxScore: 55` komt overeen met 4 stappen × 10 (checklist) + 2 × 5 (verificatievragen in stap 1 en 2) — wacht, telling klopt niet exact met stap 4 die ook een vraag heeft: 4×10 + 3×5 = 55. Klopt met de config (stappen 1, 2 en 4 hebben een `verificationQuestion`, stap 3 niet).

### ⚠️ Aandachtspunten
- **Engine-bevinding versterkt door deze config**: de blocking bevinding "scoring is niet gokbestendig" (engine, checklist = zelfrapportage) geldt hier volledig — alle 4 stappen se checklist-items zijn puur zelfrapportage-vinkjes zonder inhoudelijke controle (bv. "Ik heb een tweede slide aangemaakt" is niet verifieerbaar door de engine) — `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:53-58`. Met 3 vragen × 5 bonus + 4×10 checklist = 55/55 haalbaar door alleen te klikken, ruim boven de 40%-slaagdrempel (22/55). Geen config-specifieke fix mogelijk — dit is engine-scope, al gerapporteerd.
- **Config-specifiek**: stap 3 (animatie) heeft geen `verificationQuestion`, terwijl stap 1, 2 en 4 er wel een hebben — geen bevinding op zich (niet elke stap hoeft een vraag te hebben) maar wel een lichte asymmetrie in kennistoetsing tussen stappen.

### ❌ Blocking issues
- Zie engine-rapport `engine-tool-guide.json` (scoring gokbestendigheid, state-herstel zonder validate-callback) — dit zijn engine-brede issues, niet oplosbaar binnen de config-whitelist van deze missie.

### Fase B — Dynamic verificatie
Niet uitgevoerd — geen dev-server/Chrome-plugin-sessie in deze batch-sweep-run. Dynamische claims (rendering, viewport-gedrag) zijn unverified.

### Score
Config-scope: geen nieuwe blocking issues · Engine-scope: 2 blocking (gedeeld, elders getrackt) · Aanbeveling: fix-eerst (engine-niveau, niet missie-specifiek)

---

## Voorstellen

Geen mechanische config-fixes nodig binnen de whitelist voor deze missie — de blocking issues zitten in de gedeelde engine (`ToolGuide.tsx`), niet in `slide-specialist.ts`. De enige config-level suggestie is niet-blocking (zie Design-sectie, randgeval copy-lengte stap 1) en wordt niet als autoFixable voorgesteld omdat het een stijlkeuze is, geen fout.

---

## Samenvatting & verdict

`slide-specialist` is inhoudelijk een solide leerjaar-1-missie: heldere leerdoelen met actiewerkwoorden, goede SLO-fit op `21A`/`22A`, beknopte en leeftijdspassende copy, en een logische curriculum-plek. Er zijn geen missie-specifieke blocking issues in de config zelf.

De reële risico's zitten volledig in de gedeelde `tool-guide`-engine (niet-gokbestendige scoring, kwetsbaar state-herstel) en gelden dus voor alle tool-guide-missies gelijk, inclusief deze — dat is engine-scope en al vastgelegd in het sweep-rapport, niet iets wat via deze missie's config op te lossen is.

**Verdict: ok** (missie-config-niveau) — met de kanttekening dat het platform-brede `fix-eerst`-verdict op de tool-guide-engine ook op deze missie doorwerkt zodra die engine-fix wordt opgepakt.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
