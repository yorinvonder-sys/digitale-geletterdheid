# AI Trainer - missieaudit 2026-08-02

- **missionId:** `ai-trainer`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / TrainerPreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** Geen complete vier-viewportflow of completionbeeld beschikbaar. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:733)
- **MEDIUM - open:** Dataset, voorspelling en conclusie delen veel informatie; mobiele informatiehiërarchie moet visueel worden getoetst. (src/features/ai-lab/previews/TrainerPreview.tsx:197)

## Didactiek

- **MEDIUM - open:** Recovery na een verkeerde voorspelling is instructiegestuurd; de leerling hoeft de verbeterstrategie niet zelf te formuleren. (src/config/agents/year1.tsx:1577)
- **MEDIUM - open:** Dubbele of bijna gelijke trainingsvoorbeelden worden niet didactisch onderscheiden. (src/features/ai-lab/previews/TrainerPreview.tsx:195)

## Techniek

- **HIGH - opgelost in batch:** Trainercompletion is losgemaakt van generieke stepcompletion en wacht op duurzame auth-bound completion. (src/features/ai-lab/previews/TrainerPreview.tsx:244)
- **HIGH - opgelost in batch:** Trainerdata herstelt uit lokale fallback en reset missiespecifiek. (src/hooks/useAgentLogic.ts:95)

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
