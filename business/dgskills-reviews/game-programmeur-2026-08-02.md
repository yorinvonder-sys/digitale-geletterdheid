# Game Programmeur - missieaudit 2026-08-02

- **missionId:** `game-programmeur`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** AI Lab / GamePreview
- **Bron-SHA:** `298c1bbf3051ffc3dde346fcaf8a4f14258666bf`
- **Aanbeveling:** **fix-eerst**
- **Bewijsstatus:** onvolledig; geen releaseclaim

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| 0 | 1 | 2 | 0 |

## Design

- **HIGH - open:** De volledige viewportmatrix en visuele eindstaat zijn nog niet vastgelegd. (/Users/yorinvonder/Downloads/ai-lab---future-architect/screenshots/mission-audit/batches/j1p2/manifest.json:623)
- **MEDIUM - open:** Compacte game-controls en icon targets moeten op 390px nog op tappability worden beoordeeld. (src/features/games/GamePreview.tsx:70)

## Didactiek

- **MEDIUM - open:** De flow stimuleert iteratief testen, maar vraagt weinig expliciete reflectie op oorzaak en effect van een codewijziging. (src/config/agents/year1.tsx:1040)

## Techniek

- **HIGH - opgelost in batch:** Ongeldige stepmarkers, cross-mission state en resetgedrag zijn genormaliseerd en met een contractcheck afgedekt. (src/hooks/useStepCompletion.ts:9)
- **HIGH - opgelost in batch:** De lokale preview heeft een missiespecifieke gamefallback wanneer geen echte AI-sessie actief is. (src/hooks/useAgentLogic.ts:66)

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
