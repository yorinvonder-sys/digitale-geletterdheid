# Pitch Police - missieaudit 2026-08-02

- **missionId:** `pitch-police`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** PitchPoliceMission (handcrafted)
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 2 | 0 |

## Design

- **HIGH - open:** De slide-, inspectie- en mobiele drawerflow heeft nog geen vier-viewportbewijs. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:2053)
- **MEDIUM - open:** Externe Giphy/Unsplash-media hebben geen lokale visuele fallback wanneer laden faalt. (src/features/missions/review/PitchPoliceMission.tsx:141)

## Didactiek

- **HIGH - opgelost in batch:** Goal en evidence claimen nu alleen de acht keuzes en zichtbare verbeteringen die de leerling echt uitvoert. (src/config/missionGoals.ts:65)
- **HIGH - opgelost in batch:** SLO- en basisvaardighedenmetadata staan onder de J1P2-review en zijn feitelijk geformuleerd. (src/config/slo-kerndoelen-mapping.ts:58)
- **MEDIUM - open:** Een fout antwoord geeft weinig uitleg waarom de gekozen verbetering niet past. (src/features/missions/review/PitchPoliceMission.tsx:594)

## Techniek

- **HIGH - opgelost in batch:** De eind-CTA heeft een completionlock, await de auth-bound uitkomst en wist alleen bij expliciet succes. (src/features/missions/review/PitchPoliceMission.tsx:325)

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
