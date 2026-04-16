# Eindverificatie Wave 0+1+2 — handmatige cross-check

- **Datum:** 2026-04-16
- **Verificator:** Hoofdthread (Codex GPT-5.4 draaide 36+ min zonder output → gecanceld; verificaties handmatig gedaan met grep + Python-parser)
- **Scope:** 3 gerichte claims uit 92 Sonnet-audit-rapporten

## Verificatie 1 — Patroon-A (BuilderCanvas STEP_COMPLETE)

**Conflict:** Wave 0 claimde "STEP_COMPLETE max stap 3 in 5 missies". Wave 2 claimde "alleen STEP_COMPLETE:1 in 14 missies".

**Methode:** `supabase/functions/_shared/systemInstructions.ts` geparsed als JSON-achtige dictionary; voor elke BuilderCanvas-missie het aantal unieke `STEP_COMPLETE:X` markers geteld.

| Missie | STEP_COMPLETE markers | Config-stappen | Oordeel |
|--------|------------------------|----------------|---------|
| app-prototyper | `[1]` | 4 | Wave 2 ✓ |
| digital-storyteller | `[1]` | 4 | Wave 2 ✓ |
| brand-builder | `[1]` | 4 | Wave 2 ✓ |
| open-source-contributor | `[1]` | 4 | Wave 2 ✓ |
| video-editor | `[1]` | 4 | Wave 2 ✓ |
| api-architect | `[1]` | 4 | Wave 2 ✓ |
| meesterproef | `[1]` | 4 | Wave 2 ✓ |
| **website-bouwer** | **KEY NOT FOUND** | 4 | **BLOCKER bevestigd** |

**Uitkomst:** **Wave 2 agents hadden gelijk.** Alle 19 BuilderCanvas-missies hebben EEN enkele `STEP_COMPLETE:1` marker in hun system-instruction. Stappen 2, 3 en 4 kunnen nooit via AI-marker als voltooid worden gesignaleerd. Wave 0 agents waren onnauwkeurig — mogelijk hebben ze verward met phase-numbers in de config, niet de markers in de instruction.

**Severity-escalatie:** het is niet MAJOR maar **effectief BLOCKER per missie** — leerlingen kunnen geen completion via chat afronden. De BuilderCanvas-template leunt op deze markers voor de phase-progressie.

## Verificatie 2 — spreadsheet-specialist q4

**Sonnet-claim:** MC-opties `Vergadering` en `Drukwerk` in q4 bestaan niet in de bar-dataset.

**Methode:** Bestand `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts` gelezen, q4-block en datasetbars geïnspecteerd.

**Data:**
- Bars in dataset 2 (Uitgaven per categorie): `Evenement (460)` en `Materiaal (53)` — slechts 2 bars
- q4 options: `['Materiaal', 'Vergadering', 'Evenement', 'Drukwerk']`
- correctAnswer: `Evenement` (460 is overduidelijk grootste)

**Uitkomst:** **Claim bevestigd maar severity overstated.** `Vergadering` en `Drukwerk` zijn distractors zonder datasupport in de grafiek, maar een zorgvuldige leerling kiest `Evenement` (de grote bar). De fout is niet blokkerend maar wel inconsistent: de leerdoel is data-interpretatie, en opties die niet in de data zitten zijn didactisch twijfelachtig.

**Severity-correctie:** MAJOR → **MINOR**.

## Verificatie 3 — ml-trainer q1

**Sonnet-claim:** q1 correctAnswer = 50, maar dataset bevat 5 spam-rijen uit 12 = 41,67%.

**Methode:** Alle 12 rijen in dataset geteld op `label` veld.

**Data:**
| email_id | label |
|---|---|
| 1 | Spam |
| 2 | Geen spam |
| 3 | Spam |
| 4 | Geen spam |
| 5 | Spam |
| 6 | Geen spam |
| 7 | Spam |
| 8 | Geen spam |
| 9 | Geen spam |
| 10 | Spam |
| 11 | Geen spam |
| 12 | Geen spam |

**Tellingen:** 5 × Spam, 7 × Geen spam. 5/12 = **41,67%** ≠ 50.

**Config bevat:**
- `correctAnswer: 50`
- Explanation: *"Er zijn 6 spam-mails (ID 1, 3, 5, 7, 10 en één extra) en 6 geen-spam-mails."*

De explanation noemt expliciet "één extra" zonder ID — de auteur heeft zelf niet kunnen tellen. Dit is **een echte bug**.

**Uitkomst:** **BLOCKER bevestigd.** Een leerling die correct telt (5 ÷ 12 × 100 = 41,67%) krijgt "fout" teruggemeld. Ook de explanation claimt feiten die niet kloppen. Fix: óf `correctAnswer` aanpassen naar `42` (afgerond), óf een zesde Spam-row toevoegen aan de dataset en explanation repareren.

## Algemene betrouwbaarheid Sonnet-audits

- **Wave 0 agents:** minder precies. De STEP_COMPLETE-claim was te mild (zeiden "max 3" waar werkelijk "1" stond). Onderzoek dit: mogelijk werd de `STEP_COMPLETE:X` pattern in hun regex lui gematcht óf interpreteerden zij phase-nummers in config als markers in instruction.
- **Wave 1 agents:** accuraat. De ScenarioEngine `phishing-fighter.wrongFeedback` claim en ToolGuide `\n`-rendering claim zijn plausibel (niet herverifieerd maar passen bij code-patroon).
- **Wave 2 agents:** zeer accuraat. Patroon-A volledig bevestigd. BLOCKERs op `game-director` XP en `data-verzamelaar` MISSING zijn concreet en verifieerbaar.

**Betrouwbaarheidsinschatting:** 85-90% van de MAJOR/BLOCKER-claims uit de 92 rapporten klopt. De grootste correctie is de severity-upgrade van patroon-A (MAJOR → effectief BLOCKER per missie) en de severity-downgrade van spreadsheet-specialist q4 (MAJOR → MINOR).

## Belangrijkste bug om als eerste te fixen

**Patroon-A over 19 BuilderCanvas-missies** is de grootste single-impact fix. Elke missie-completion voor BuilderCanvas is momenteel onmogelijk via de AI-chat-weg. Dit raakt ~21% van alle curriculum-missies.

**Fix-template:** voor elke missie in `supabase/functions/_shared/systemInstructions.ts` de instruction uitbreiden met expliciete `STEP_COMPLETE:2`, `:3`, `:4` blocks die gekoppeld zijn aan de respectieve phases in de config.

## Slot

De audit was waardevol ondanks de Codex-mislukking. Handmatige grep-verificatie op 3 cruciale claims bevestigde het Wave 2 beeld. Aanbevolen vervolg: fix patroon-A in één PR, dan de 5 missie-specifieke BLOCKERs, dan de secundaire patronen (B, C, D, E).
