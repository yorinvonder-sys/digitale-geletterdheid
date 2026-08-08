# Code Denker - missieaudit 2026-08-02

- **missionId:** `code-denker`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** ScenarioEngine
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** Wereldkaart, scenario en completion missen nog vier viewportflows. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1393)
- **MEDIUM - open:** De abstracte wereldkaart vraagt extra visuele vertaling voor leerlingen die de scenariovolgorde niet direct begrijpen. (src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:237)

## Didactiek

- **MEDIUM - open:** De leerling kiest oplossingen, maar het bewijs vraagt nog weinig eigen uitleg over de gekozen denkstap. (src/config/missionGoals.ts:143)

## Techniek

- **HIGH - opgelost in batch:** Rondecompletion wordt niet meer door een verborgen scoregrens geblokkeerd en wacht op duurzame completion. (src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:207)
- **MEDIUM - open:** Beschadigde of verouderde autosavevormen hebben geen expliciete migratie-/foutstate. (src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:2)

## Viewport- en checkpointmatrix

| Viewport | Status | Checkpoints | Geldige PNG | Vastgelegde afmetingen |
|---|---|---:|---:|---|
| desktop | missing | 0 | 0 | niet uitgevoerd |
| ipad-portrait | missing | 0 | 0 | niet uitgevoerd |
| ipad-landscape | missing | 0 | 0 | niet uitgevoerd |
| mobile | missing | 0 | 0 | niet uitgevoerd |

## Flowbewijs

- Intro, normale interactie, bewuste fout, herstel/hint, mid-flow, eindstaat en dashboardprogress tellen pas als bewezen wanneer ze in de viewportset en het batchmanifest staan.
- Mobiele productiecompletion, reload en dashboard-/portfolio-readback zijn nog niet uitgevoerd voor deze missie.
- De lokale preview is side-effectvrij en bewijst geen productie-auth, XP, Supabase-write of dashboardpersistentie.

## Onzekerheden

- **Echte iPad-check nodig:** Chromium-/interne-browserviewportbewijs is geen fysieke iPad- of Safari-test.
- De externe Opus 5/high-controle is nog geblokkeerd door ontbrekende Claude-authenticatie.
- Dit rapport gebruikt uitsluitend actuele broncode en evidence op bovengenoemde SHA; oudere rapporten zijn geen afrondingsbewijs.
