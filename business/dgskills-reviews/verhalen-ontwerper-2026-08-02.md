# Verhalen Ontwerper - missieaudit 2026-08-02

- **missionId:** `verhalen-ontwerper`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / BookPreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** De boekflow is nog niet op alle vier viewports vastgelegd. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:953)
- **MEDIUM - open:** Illustratieknoppen blijven visueel onderdeel van de boekervaring terwijl beeldgeneratie beleidsmatig is uitgeschakeld. (src/features/student/BookPreview.tsx:618)

## Didactiek

- **MEDIUM - open:** Het bewijs voor AI-illustratieprompts is zwak zolang illustraties niet beschikbaar zijn; de schrijfdoelen blijven wel uitvoerbaar. (src/config/missionGoals.ts:107)
- **HIGH - opgelost in batch:** De vijfpagina-afspraak wordt nu ook technisch afgedwongen en niet alleen in de agentprompt genoemd. (src/hooks/useAgentLogic.ts:48)

## Techniek

- **HIGH - opgelost in batch:** Hersteldata, PAGE-tags, IMG-targets en de zichtbare nieuwe-paginaflow worden allemaal op vijf pagina's begrensd. (src/hooks/useAgentLogic.ts:56)
- **MEDIUM - open:** Een mislukte afbeelding toont nog een retry-achtige affordance terwijl de providerfunctie is uitgeschakeld. (src/features/student/BookPreview.tsx:623)

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
