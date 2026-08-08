# Layout Doctor - missieaudit 2026-08-02

- **missionId:** `layout-doctor`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** WordSimulator
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** De vaste Word-layout met brede sidebar en documentcanvas is zonder mobiele runtimecheck releaseblokkerend. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1943)
- **MEDIUM - open:** Ribboncontrols en documentcanvas zijn nog niet op focus, overlap en horizontale overflow beoordeeld. (src/features/word-simulator/Ribbon.tsx:171)

## Didactiek

- **HIGH - opgelost in batch:** De inhoudsopgavecasus slaagt alleen bij de structurele marker van de echte TOC-action. (src/features/word-simulator/WordSimulator.tsx:22)
- **HIGH - opgelost in batch:** Dashboardmetadata toont nu zowel 21A als 22A. (src/features/student/ProjectZeroDashboard.tsx:135)
- **MEDIUM - open:** Foutfeedback blijft dun bij verkeerde Word-acties; de leerling krijgt vooral hints vooraf. (src/features/word-simulator/WordSimulator.tsx:1104)

## Techniek

- **BLOCKER - opgelost in batch:** TOC-labels worden via textContent opgebouwd en de geserialiseerde HTML wordt voor insertHTML gesanitized. (src/features/word-simulator/WordSimulator.tsx:467)
- **MEDIUM - open:** Autosave bewaart vooral het casusniveau; volledige documentinhoud en simulatorstate zijn niet aantoonbaar reloadpersistent. (src/features/word-simulator/WordSimulator.tsx:31)

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
