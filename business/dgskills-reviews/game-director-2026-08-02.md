# Game Director - missieaudit 2026-08-02

- **missionId:** `game-director`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** GameDirectorMission (handcrafted)
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 2 | 0 |

## Design

- **HIGH - open:** Canvas, blokkenpaneel en mobiele tabs zijn nog niet in vier viewportflows bewezen. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1063)
- **HIGH - opgelost in batch:** Touch-drops worden naar het juiste geneste parentblok gerouteerd. (src/features/missions/game-director/CodeWorkspace.tsx:110)

## Didactiek

- **MEDIUM - open:** De inhoudelijke checks zijn grotendeels structureel; een leerling hoeft nauwelijks uit te leggen waarom een blokcombinatie werkt. (src/config/missionGoals.ts:115)

## Techniek

- **HIGH - opgelost in batch:** Blokstate wordt opgeslagen en completion wist die state pas na bevestiging. (src/features/missions/GameDirectorMission.tsx:759)
- **MEDIUM - open:** De werkruimte blijft complex stateful; reload van elke geneste blokvariant moet nog runtime worden bewezen. (src/features/missions/GameDirectorMission.tsx:11)

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
