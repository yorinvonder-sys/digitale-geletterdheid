# Cloud Cleaner - missieaudit 2026-08-02

- **missionId:** `cloud-cleaner`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** CloudCleanerMission (handcrafted)
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 2 | 1 | 0 |

## Design

- **HIGH - open:** Bestandsboom, prullenbak en eindstaat zijn nog niet over vier viewports bewezen. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1833)
- **HIGH - opgelost in batch:** De mobiele mapbediening staat niet langer als vaste overlay over de inhoud en interactieve items hebben keyboardrollen. (src/features/missions/review/CloudCleanerMission.tsx:464)

## Didactiek

- **HIGH - open:** De laatste bestandsplaatsing opent geen reflectievraag en de eind-CTA controleert niet of eerder een reflectie correct is beantwoord. (src/features/missions/review/CloudCleanerMission.tsx:206)
- **MEDIUM - open:** De leerling sorteert en verwijdert correct, maar transfer naar eigen cloudopruimregels wordt beperkt uitgevraagd. (src/config/missionGoals.ts:49)

## Techniek

- **HIGH - opgelost in batch:** Een lege resterende bestandsset herstelt na reload naar de succes-CTA en completion wacht op bevestiging. (src/features/missions/review/CloudCleanerMission.tsx:125)

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
