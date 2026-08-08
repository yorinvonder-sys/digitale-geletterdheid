# AI Beleid Brainstorm - missieaudit 2026-08-02

- **missionId:** `ai-beleid-brainstorm`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / AiBeleidBrainstormPreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 2 | 2 | 0 |

## Design

- **HIGH - open:** Stemmen, eigen ideeën en completion missen nog volledige viewport- en reloadcaptures. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1283)
- **MEDIUM - open:** Stemcontrols en lange beleidsideeën moeten nog op keyboard, tekstfit en focus worden beoordeeld. (src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:216)

## Didactiek

- **HIGH - open:** Completion telt nu alleen twee eigen regelideeën; reden en schoolcontext staan in de instructie maar worden niet gevalideerd. (src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:593)

## Techniek

- **HIGH - opgelost in batch:** Privacycopy zegt eerlijk dat bijdragen aan account en school zijn gekoppeld en completion gebruikt de auth-bound handler. (src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:274)
- **MEDIUM - open:** Vote/load/reload-samenloop is nog niet runtime gevalideerd. (src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:1)

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
