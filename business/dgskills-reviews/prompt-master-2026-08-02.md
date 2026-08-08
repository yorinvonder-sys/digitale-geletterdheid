# Prompt Master - missieaudit 2026-08-02

- **missionId:** `prompt-master`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** PromptMasterMission (handcrafted)
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** De vier-viewport Visual Precision Gate is nog niet compleet; iPad-portret heeft bovendien een native-capturedimensie die afwijkt van de ingestelde CSS-viewport. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:223)
- **MEDIUM - open:** De resultaatstaat toont bij uitgeschakelde beeldgeneratie veel uitleg tegelijk; tekstfit en primaire CTA moeten nog op mobiel worden bewezen. (src/features/missions/PromptMasterMission.tsx:455)

## Didactiek

- **HIGH - opgelost in batch:** De succesdrempel en doelweergave volgen nu het actieve niveau in plaats van een vaste grens. (src/features/missions/promptMasterLogic.ts:98)
- **MEDIUM - open:** De eindscore bewijst promptcriteria, maar nog niet dat leerlingen hun keuzes in eigen woorden kunnen verklaren. (src/config/missionGoals.ts:74)

## Techniek

- **HIGH - opgelost in batch:** Completion wacht op de auth-bound handler en wist autosave pas na duurzame bevestiging. (src/features/missions/PromptMasterMission.tsx:909)
- **MEDIUM - open:** De native iPad-portretcapture levert 820x885 bij een gemeten CSS-viewport van 820x1180; de browsercaptureketen moet worden gecorrigeerd of expliciet anders gemodelleerd. (scripts/mission-audit/build-evidence-manifest.mjs:8)

## Viewport- en checkpointmatrix

| Viewport | Status | Checkpoints | Geldige PNG | Vastgelegde afmetingen |
|---|---|---:|---:|---|
| desktop | partial | 10 | 0 | 1440x886 |
| ipad-portrait | partial | 6 | 0 | 820x885 |
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
