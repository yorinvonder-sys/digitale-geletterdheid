# AI-testklasje — Puzzle Lab-batch

Datum: 10 juli 2026  
Scope: vijf geregistreerde Puzzle Lab-missies, acht fictieve persona's en desktop-, mobile- en iPadprofielen.  
Omgeving: lokale Vite-preview met Chromium; geen login, Supabase-requests of productiegegevens.

## Resultaat

| Missie | Browserruns | Voltooid | Scorebereik | Gemiddelde score | Resterende problemen |
|---|---:|---:|---:|---:|---:|
| Encryption Expert | 10 | 10 | 0–50 | 13 | 0 |
| Cyber Detective | 10 | 10 | 0–50 | 28 | 0 na hertest |
| Wachtwoord Warrior | 10 | 10 | 0–50 | 25 | 0 |
| Data Handelaar | 10 | 10 | 0–50 | 23 | 0 |
| Security Auditor | 10 | 10 | 0–50 | 18 | 0 |

De volledige batch voltooide 50/50 browserruns. De gerichte Cyber Detective-hertest voltooide daarna 3/3 runs met Taalzwakke Tess en iPad-Iris. Alle telemetry bleef op nul voor consolefouten, page errors, mislukte requests, HTTP-fouten en kapotte media. Lokale voortgang bleef behouden na refresh.

## Gevonden en verbeterd

1. Puzzle Lab had nog geen AI-studentadapter. De nieuwe adapter leest uitsluitend zichtbare koppen, instructies, opties, invoervelden en herstelacties; configuratievelden met antwoorden of validators worden niet gebruikt.
2. Na maximale pogingen zag de adapter de knop `Volgende puzzel` ten onrechte als een onbekende status. Deze toestand wordt nu als herstelronde herkend.
3. Na een juist antwoord bestaat kort een controleloze overgangsstatus. De adapter wacht nu op de automatische overgang in plaats van die als vastloper te rapporteren.
4. Tekstinvoer, submit-, hint-, skip- en meerkeuzeknoppen waren deels lager dan 44 CSS-pixels. Alle bedieningen hebben nu een minimale touchhoogte van 44px.
5. Puzzlebeschrijvingen klapten zichtbare regeleinden dicht. Daardoor werden serverlogs en opsommingen als één tekstblok getoond en verkeerd als lange zin gemeten. `whitespace-pre-line` behoudt nu de bestaande indeling.
6. Refreshherstel wordt op een stabiele volgende puzzel gemeten, niet tijdens de tijdelijke succesanimatie.

## Grenzen

- De persona's zijn deterministische simulaties en vervangen geen onderzoek met echte leerlingen.
- Scoreverschillen bewijzen alleen dat persona's verschillende zichtbare routes namen; ze zijn geen psychometrische validatie.
- Authenticated staging, server-side voortgang en database-readback zijn niet uitgevoerd.
- Runtime-screenshots, traces en telemetry staan uitsluitend in de genegeerde map `test-results/ai-students/`.

## Verificatie

- `npm run test:ai-students:unit`: 50/50 geslaagd.
- `npm run typecheck:app`: geslaagd.
- `npm run doctor`: geslaagd.
- `npm run build:prod`: geslaagd.
- Browserbatch: 50/50 voltooid.
- Gerichte hertest: 3/3 voltooid, 0 bevindingen.
