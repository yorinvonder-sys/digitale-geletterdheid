# AI Tekengame - missieaudit 2026-08-02

- **missionId:** `ai-tekengame`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / DrawingGamePreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 2 | 0 |

## Design

- **HIGH - open:** De canvas- en conclusieflow mist nog vier-viewportbewijs. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1173)
- **HIGH - opgelost in batch:** De mobiele opbouw en naamgeving van canvascontrols zijn aangepast voor smallere schermen en assistive tech. (src/features/ai-lab/previews/DrawingGamePreview.tsx:807)

## Didactiek

- **MEDIUM - open:** De missie laat vergelijken en raden, maar de leerling reflecteert niet expliciet op welke promptdetails het beeld herkenbaar maakten. (src/config/missionGoals.ts:123)

## Techniek

- **HIGH - opgelost in batch:** Completion is dedicated, auth-bound en niet langer een vroege levelcallback. (src/features/ai-lab/AiLab.tsx:942)
- **MEDIUM - open:** De lokale fallback bevat willekeur, waardoor exacte herstel- en regressiestates niet altijd reproduceerbaar zijn. (src/features/ai-lab/previews/DrawingGamePreview.tsx:286)

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
