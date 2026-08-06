# Schermtijd Coach - missieaudit 2026-08-02

- **missionId:** `schermtijd-coach`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** DebateArena
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 2 | 1 | 0 |

## Design

- **HIGH - open:** De lange argumentatie- en reflectieflow heeft nog geen vier-viewportbewijs. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:1613)

## Didactiek

- **HIGH - open:** Antwoordkwaliteit wordt vooral via lengte gemeten; inhoudelijk lege maar lange antwoorden kunnen completion halen. (src/features/missions/templates/debate-arena/DebateArena.tsx:114)
- **HIGH - opgelost in batch:** De derde reflectie vraagt nu een concreet eigen schermtijdakkoord en de SLO-claim is teruggebracht tot digitaal welzijn. (src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts:96)

## Techniek

- **HIGH - opgelost in batch:** Completion wacht op de auth-bound handler en wist autosave alleen na succes. (src/features/missions/templates/debate-arena/DebateArena.tsx:250)
- **MEDIUM - open:** De semantische kwaliteit van argumenten heeft geen lokale deterministische validator. (src/features/missions/templates/debate-arena/DebateArena.tsx:97)

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
