# Missie-review: Mail Detective

**Mission ID:** `mail-detective`
**Template:** `scenario-engine`
**Curriculum-plek:** Leerjaar 1, Periode 3 — Digitaal Burgerschap
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review (M2), wave 15
**Vorige reviews:** `mail-detective-2026-05-06.md` (M2 self), `mail-detective-2026-05-08-codex-review.md` (Codex orchestrator) — status hieronder per punt herverifieerd tegen huidige code.

---

## Stale-detectie t.o.v. mei-reviews

| Mei-bevinding | Status nu |
|---|---|
| TypeScript-error `'score-threshold'` niet in union (`year1.tsx:4205`) | ✅ **Opgelost** — veld `goalCriteria` is volledig verwijderd uit de mail-detective agent-config; doelherkenning loopt nu via `missionGoals.ts:240-247` (`type: 'rounds-complete'`) |
| `briefingImage` copy-paste (`social_safeguard.webp`) | ✅ **Opgelost** — wijst nu naar `/assets/agents/mail_detective.webp`, asset bestaat (`public/assets/agents/mail_detective.webp`) |
| `learningObjectives` ontbrak | ✅ **Opgelost** — 4 meetbare leerdoelen aanwezig (`mail-detective.ts:16-21`) |
| `custom` goalCriteria niet afgehandeld door `AiLab` | ✅ **Opgelost** — probleem is structureel weg door migratie naar `missionGoals.ts`-mechanisme (geen `goalCriteria`-veld meer op deze missie) |
| Hover-states geen feedback (`hover:bg-[#D97848] hover:bg-[#D97848]`) | ✅ **Opgelost** — engine-breed gemigreerd naar duck-tokens met `hover:brightness-95 hover:shadow-md` (`SelectCorrectRound.tsx:116`, `BinaryChoiceRound.tsx:111`) |
| Contrast `text-lab-coral` op `bg-lab-coral` onleesbaar | ✅ **Opgelost** — `BinaryChoiceRound.tsx` gebruikt nu `text-duck-ink` op beide staten (regel 94-96), geen coral-op-coral meer |
| Mobiel: `gemist!`-badge valt rechts weg | ✅ **Opgelost** — `SelectCorrectRound.tsx:62-79` heeft nu `flex-wrap`, `min-w-0`, `shrink-0`, `break-words` |
| 8 keuzes per scherm (ronde 1 + 4) te zwaar voor leerjaar 1 | ❌ **Nog open** — ronde 1 en ronde 4 hebben nog steeds 8 items elk (`mail-detective.ts:70-113`, `291-332`) |
| Phishing-fighter-overlap op ronde 1 | ⚠️ **Deels open** — zie Didactiek hieronder |
| Geen reflectie/Bloom-hogere-orde-vraag | ❌ **Nog open** — 4 rondes blijven selectie/orden/binary-choice; geen afsluitende reflectievraag |

Conclusie stale-detectie: alle **technische** mei-issues zijn opgelost (op een structureel betere manier dan destijds voorgesteld). De **didactische** cognitieve-last- en overlap-issues staan nog open.

---

## 🎨 Design review

### ✅ Geslaagd
- Engine volledig gemigreerd naar duck-tokens (`duck-ink`, `duck-acid`, `duck-error`, `duck-gray`, `duck-bg`) — geen lab-* of hex-literals meer in `SelectCorrectRound.tsx`, `BinaryChoiceRound.tsx`, `OrderPriorityRound.tsx`.
- Tap-targets ≥44px (`min-h-[44px]`) op alle interactieve knoppen — `BinaryChoiceRound.tsx:69,80`, `OrderPriorityRound.tsx:38,101`.
- `focus-visible:ring-2` aanwezig op alle knoppen — toetsenbordtoegankelijkheid geborgd.
- Contrast- en hoverfeedback-issues uit beide mei-reviews zijn engine-breed opgelost (zie tabel hierboven).
- Mail-detective valt niet met naam in de `docs/audits/student-missions-ui-ux-review-2026-06-30.md` KRITIEK/HOOG-lijst — geen visuele blocker gevonden bij de 30-juni live-render-audit (109 missies, 4 viewports). Gedeelde `IntroScreen`-afsnij-issue uit dat rapport is voor déze missie al gedekt door PR #186 (mail-detective gebruikt `IntroScreen` via `ScenarioEngine.tsx:6,205`).
- `briefingImage`-asset bestaat en klopt inhoudelijk (`mail_detective.webp`).

### ⚠️ Aandachtspunten
Geen mission-specifieke design-issues gevonden. (Engine-breed bekend: FeedbackBanner/badge-styling is engine-lijst, niet mission-issue — conform instructie niet herhaald.)

### Score: **9/10**

---

## 📚 Didactiek review

### ✅ Geslaagd
- SLO-codes correct: `23A` regulier, `18B`+`20A` VSO — `slo-kerndoelen-mapping.ts:73`.
- Curriculum-plek logisch: leerjaar 1, periode 3 "Digitaal Burgerschap" — `curriculum.ts:104-124`.
- 4 expliciete, meetbare `learningObjectives` (actiewerkwoord + meetbaar resultaat) — `mail-detective.ts:16-21`.
- Feitelijke juistheid phishing-signalen geverifieerd, geen onjuistheden:
  - Afzenderadres-domein-check (`@magister-berichten.com` i.p.v. schooldomein) — correct signaal.
  - `.exe`-bijlage als gevaarsignaal — correct en consistent behandeld in ronde 1 én ronde 2 (rangschikking `correctPosition: 1`, op-één-na-gevaarlijkst na credential-phishing).
  - Link-tekst-vs-werkelijk-domein-mismatch (`magister-rooster-app.net` vs officieel `magister.net`) — correct opgebouwd voorbeeld.
  - Magister-berichtencentrum als vertrouwd kanaal — consistent door ronde 1, 3 (2×) en de uitleg-teksten; didactisch verdedigbaar (beveiligd platform ≠ open e-mail).
- Interne consistentie namen/tijden in scenario-content: geen tegenstrijdigheden gevonden tussen rondes.
- Bonus-follow-up-vraag na ronde 4 (`followUp` op regel 277-290) biedt al een lichte praktijksituatie-toets — dit ontbrak nog niet expliciet benoemd in mei-reviews maar bestaat al.

### ⚠️ Aandachtspunten

- **8 items in ronde 1 én ronde 4 — nog steeds te zwaar voor leerjaar 1.** Rubric-grens leerjaar 1-2 is max 3-4 keuzes per scherm; dit stond al in beide mei-rapporten en is niet aangepakt.
  - *Bewijs:* ronde 1 `signalen-herkennen` = 8 items (`mail-detective.ts:70-113`); ronde 4 `slim-reageren` = 8 items (`mail-detective.ts:291-332`, incl. 1 losse `followUp`).
  - *Voorstel:* splits ronde 1 in twee rondes van 4 items (bijv. "afzender + kanaal" / "link + bijlage"), of reduceer naar 4-5 kernitems per ronde. Dit vereist content-herontwerp — geen mechanische snippet-fix.

- **Phishing-fighter-overlap is verkleind maar niet weg.** Beide missies delen nog steeds hetzelfde signaal-type in ronde 1: afzenderadres-domein-truc (mail-detective item 1 "@magister-berichten.com" ↔ phishing-fighter item 1 "sch00l-portal.nl" typosquatting), link-domein-mismatch (mail-detective item 3 ↔ phishing-fighter item 3), en Magister-kanaal-als-negatief-controle-item (mail-detective item 4 ↔ phishing-fighter item 4, bijna identieke uitleg-formulering "Phishers kunnen normaal gesproken geen berichten sturen vanuit beveiligde schoolsystemen").
  - *Nuance t.o.v. mei-oordeel:* de overlap is niet 1-op-1 meer — phishing-fighter (leerjaar 3) heeft 4 items die mail-detective (leerjaar 1) niet heeft: BSN/wachtwoord-formulier, logo-kopieerbaarheid, taalfouten-vs-AI-generatie, tijdstip-irrelevantie. Dat is functioneel een progressie-opbouw (jaar 1 = basissignalen, jaar 3 = subtielere/nieuwere signalen), en de twee jaren liggen 2 leerjaren uit elkaar in het curriculum — een leerling ervaart ze niet in dezelfde week.
  - *Resterend risico:* het Magister-kanaal-item is in beide missies bijna letterlijk dezelfde uitleg-zin. Voor een leerling die na 2 jaar mail-detective (jaar 1) terugziet in phishing-fighter (jaar 3), voelt precies dát ene item als herhaling i.p.v. opbouw.
  - *Voorstel:* alleen het Magister-kanaal-item in mail-detective ronde 1 vervangen door een schoolspecifieker signaal (bijv. een Word-bijlage-signaal of een tweede afzender-domein-variant), zodat de twee missies geen enkel bijna-identiek item meer delen. Kleinere ingreep dan de mei-voorstellen (die de hele ronde wilden herschrijven).

- **Geen expliciete reflectie-/verantwoordingsvraag ("waarom") na de laatste ronde.** De bestaande `followUp` (regel 277-290) is een 4e multiple-choice-vraag met vaste `correctIndex`, geen open reflectie. Bloom-balans blijft laag-midden: herkennen/rangschikken/kiezen, geen verklaren-in-eigen-woorden.
  - *Voorstel:* dit is een content-toevoeging (nieuw veld/vraagtype), geen 1-regel-fix — noteren voor een volgende contentronde, niet blocking voor ship.

### Score: **7/10**

---

## 🔧 Tech review

### Cross-bestand consistentiecheck — ✅ Correct
| Bestand | Status |
|---|---|
| `config/agents/year1.tsx:4276` | ✅ `id: 'mail-detective'` |
| `config/templateRegistry.ts:10` | ✅ `templateType: 'scenario-engine'` |
| `config/slo-kerndoelen-mapping.ts:73` | ✅ SLO `23A` + VSO `18B`/`20A` |
| `config/curriculum.ts:117` | ✅ `yearGroups[1].periods[3].missions` |
| `types.ts:27` | ✅ in `RoleId`-union |
| `config/missionGoals.ts:240-247` | ✅ `rounds-complete`-doelmechanisme correct gekoppeld |
| `configs/mail-detective.ts` | ✅ `missionId: 'mail-detective'` consistent |

### ✅ Geslaagd
- Geen `goalCriteria`-type-mismatch meer (veld verwijderd, doelherkenning verloopt nu via het moderne `missionGoals.ts`-mechanisme met `type: 'rounds-complete'` — een structurele oplossing, geen patch).
- `briefingImage`-asset bestaat en is inhoudelijk passend.
- Geen XSS/`dangerouslySetInnerHTML`, geen client-side secrets — scenario-engine bevat geen AI-calls (n.v.t. voor deze missie).
- `useMissionAutoSave`-patroon aanwezig via de gedeelde `ScenarioEngine.tsx` (niet mission-specifiek herhaald).
- Lokale `tsc` gaf `TS5103: Invalid value for '--ignoreDeprecations'` — bekende repo-brede omgevingsbreuk (niet code-gerelateerd, zie `project_typecheck_ts6_env`), dus geen lokaal typecheck-signaal beschikbaar; CI-`tsc` is de enige betrouwbare gate voor deze missie.

### ⚠️ Aandachtspunten
- **`config/agentRoleIds.ts` mist `'mail-detective'` in de `AGENT_ROLE_IDS`-array** (staat wél in de `RoleId`-union in `types.ts:27`). Geverifieerd dat dit **geen runtime-impact** heeft: alle call-sites van `isAgentRoleId()` (`AuthenticatedApp.tsx:515`, `DevMissionPreview.tsx:143,169`) checken `isTemplateMission()` apart/eerder, en `mail-detective` routeert altijd via die template-tak (bevestigd in `templateRegistry.ts`). Dit is een engine-brede/platform-brede datastructuur-onvolledigheid (waarschijnlijk legacy voor chat-only missies), niet een mail-detective-specifieke bug — **niet meegeteld in de missie-score**, wel gemeld omdat het niet in eerdere reviews stond.

### ❌ Blocking issues
Geen.

### Score: **9/10**

---

## Samenvatting

- **Geslaagd:** alle 7 technische mei-issues structureel opgelost (vaak beter dan het mei-voorstel: `missionGoals.ts`-migratie i.p.v. losse type-patch); alle mei-design-issues (contrast, hover, mobiel-badge) engine-breed opgelost; feitelijke juistheid van phishing-content geverifieerd correct; geen blocking issues.
- **Nog open:** cognitieve last (8 items/ronde in ronde 1+4) en phishing-fighter-overlap (nu gedeeltelijk, niet volledig) staan sinds mei ongewijzigd. Beide zijn content-herontwerp-taken, geen mechanische fixes.
- **Nieuw gevonden (niet-blocking, engine-breed):** `agentRoleIds.ts` mist `mail-detective` in de runtime-array — geen impact voor deze missie, wel een datastructuur-inconsistentie die de moeite waard is om ooit engine-breed te sluiten.

### Top 3 issues (urgentie)

1. 🟡 **Ronde 1 + ronde 4 met 8 items zijn nog steeds te zwaar voor leerjaar 1** — sinds mei ongewijzigd, vereist content-herontwerp (splits of reduceer naar 4-5 items).
2. 🟡 **Phishing-fighter-overlap resteert op het Magister-kanaal-item** — kleinere, gerichte fix mogelijk (1 item vervangen i.p.v. hele ronde herschrijven).
3. 🟢 **Geen reflectievraag na de laatste ronde** — content-toevoeging voor een volgende ronde, niet ship-blokkerend.

### Aanbeveling: **ship-baar; didactische verdieping (items 1-2) kan in een aparte contentronde, niet blocking.**

Alle vorige ship-blockers (TypeScript-build-error, dode `custom`-goalCriteria, contrast/hover/mobiel-badge) zijn structureel verholpen. De resterende punten zijn kwaliteitsverbeteringen, geen risico's voor leerlingen of techniek.
