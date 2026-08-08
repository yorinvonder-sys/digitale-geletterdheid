# Chatbot Trainer - missieaudit 2026-08-02

- **missionId:** `chatbot-trainer`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / ChatbotTrainerPreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 1 | 0 |

## Design

- **HIGH - open:** De vier viewports en dashboardterugkeer zijn nog onbewezen. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:843)
- **HIGH - opgelost in batch:** De builder en testweergave stapelen op smalle schermen in plaats van naast elkaar te blijven staan. (src/features/ai-lab/previews/ChatbotTrainerPreview.tsx:908)

## Didactiek

- **MEDIUM - open:** De fout-herstelroute test gedrag, maar laat de leerling de gekozen regel niet expliciet onderbouwen. (src/config/agents/year1.tsx:3540)

## Techniek

- **HIGH - opgelost in batch:** Completion gebeurt pas in de conclusie en gebruikt de dedicated auth-bound handler. (src/features/ai-lab/AiLab.tsx:935)

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
