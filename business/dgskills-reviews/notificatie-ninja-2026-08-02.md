# Notificatie Ninja - missieaudit 2026-08-02

- **missionId:** `notificatie-ninja`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** ScenarioEngine
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 2 | 0 |

## Design

- **HIGH - open:** De scenarioflow mist nog volledige viewport- en completioncaptures. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1723)
- **MEDIUM - open:** Veel meldingen, badges en keuzes kunnen op mobiel cognitief dicht worden; tekstfit en scanbaarheid zijn onbewezen. (src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts:56)

## Didactiek

- **HIGH - opgelost in batch:** Doel en evidence beschrijven nu gemeten selectiegedrag in plaats van niet-gevraagde eigen uitleg. (src/config/missionGoals.ts:169)
- **MEDIUM - open:** Foutrecovery blijft vooral keuze-gestuurd en vraagt weinig transfer naar eigen notificatie-instellingen. (src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts:66)

## Techniek

- **HIGH - opgelost in batch:** De gedeelde scenario-engine completion is duurzaam en wist pas na succes. (src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:207)

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
