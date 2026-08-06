# Prompt Master — missieaudit 2026-08-06

- **missionId:** prompt-master
- **Curriculum:** Leerjaar 1, periode 2
- **Aanbeveling:** klaar
- **Bewijsstatus:** Lokaal geverifieerd via `/dev/mission-preview` op vier formaten, zonder ingelogde gebruiker. Afronding zonder AI bewezen; AI-beeldgeneratie, server-side voortgang, XP en dashboard-overzicht na afronding niet bewezen. Geen productietest.

## Severitytelling
| Blocker | Hoog | Middel | Laag |
|---|---|---|---|
| 0 | 0 | 1 | 1 |

Een eerder als HOOG gerapporteerde claim is weerlegd en niet meegeteld; zie Didactiek.

## Design
- **MIDDEL - open:** de "TERUG"-knop in de koptekst meet 72x20px op desktop, ruim onder de 44px-richtlijn voor aanraakdoelen.
- **LAAG - open:** onder 768px verschijnt de overlay "Draai je iPad!", ook op telefoons. Cosmetisch maar verwarrend. Raakt alle AiLab-missies.
- Vier formaten zonder overloop of afgesneden tekst.

## Didactiek
- **OK:** de missie is volledig afrondbaar zonder AI. De score komt uit een lokale tekstanalyse (`buildLocalPromptResult`, `src/features/missions/promptMasterLogic.ts`), niet uit de gegenereerde afbeelding.
- **Gecorrigeerde bevinding:** een browsersessie rapporteerde als HOOG dat de leerling vastloopt zodra de AI geen afbeelding teruggeeft. Dat is onjuist. De knop "Volgende uitdaging" hangt aan `disabled={!passed}`, en `passed` volgt uit `isChallengePassed(result.score, ...)` — de promptkwaliteit-drempel. Empirisch getoetst: met een prompt die ras, locatie, actie en sfeer bevat verschijnt "Missie Geslaagd!" en is de knop aanklikbaar, terwijl er geen AI-afbeelding is. Dat de knop bij een zwakke prompt uit blijft, is bedoeld didactisch gedrag.

## Techniek
- **OK:** afrondlogica loopt sinds deze ronde via de auth-bound handler en wacht op duurzame bevestiging voordat lokale voortgang gewist wordt (commit `87602b2`).
- **Niet bewezen:** AI-beeldgeneratie vereist een ingelogde gebruiker; lokaal niet toetsbaar.
- **Niet bewezen:** opslaan van voortgang, XP-toekenning en het dashboard-overzicht na afronding.

## Browserbewijs
| Viewport | Status | Wat gezien |
|---|---|---|
| Desktop 1280x800 | OK | Ronde 1 doorlopen, prompt verstuurd, "Missie Geslaagd!" en actieve doorgaan-knop zonder AI-afbeelding. TERUG-knop 72x20px. |
| iPad staand 820x1180 | OK | Geen overloop of afsnijding |
| iPad liggend 1180x820 | OK | Geen overloop of afsnijding |
| Mobiel 390x844 | OK | Geen overloop of afsnijding |

## Onzekerheden
- **Echte iPad-check nodig:** viewport-emulatie in Chromium is geen bewijs voor Safari op een fysieke iPad.
- AI-beeldgeneratie en het gedrag bij aanhoudende uitval van die dienst zijn niet getoetst.
- Alle waarnemingen komen uit een anonieme lokale previewsessie; er is niets op productie gecontroleerd.
