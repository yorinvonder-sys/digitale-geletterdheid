# Website Bouwer - missieaudit 2026-08-02

- **missionId:** `website-bouwer`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** BuilderCanvas
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 3 | 0 |

## Design

- **HIGH - open:** Builder, preview en conclusie zijn nog niet in alle viewports vastgelegd. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1503)
- **MEDIUM - open:** De samengestelde preview valideert nog niet visueel of alle gekozen blokken correct en toegankelijk renderen. (src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:275)

## Didactiek

- **HIGH - opgelost in batch:** De opdracht vraagt expliciet om fictieve of algemene gegevens en geen echte naam, school, adres, foto of contactinformatie. (src/features/missions/templates/builder-canvas/configs/website-bouwer.ts:9)
- **MEDIUM - open:** De leerling bouwt HTML/CSS, maar echte syntactische validatie en uitleg van fouten blijven beperkt. (src/features/missions/templates/builder-canvas/configs/website-bouwer.ts:43)

## Techniek

- **HIGH - opgelost in batch:** Ruwe website-inhoud wordt niet naar de coachcontext gestuurd en completion wist pas na bevestiging. (src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:166)
- **MEDIUM - open:** Previewassemblage en keyboardbediening van alle buildercontrols moeten nog runtime worden getest. (src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:375)

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
