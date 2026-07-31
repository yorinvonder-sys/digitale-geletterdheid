# AI-testklasje — Password Fortress-batch

Datum: 11 juli 2026  
Scope: `wachtwoord-fortress`, acht fictieve persona's en desktop-, mobile- en iPadprofielen.

## Browseruitvoering

De interne ChatGPT-browser is eerst gebruikt op de drie bestaande Vercel-previewprojecten. Alle previews stopten vóór de missie door ontbrekende `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`. Productie, login en gedeelde Vercelconfiguratie zijn bewust niet aangepast.

De volledige beoordeling draaide daarom in een geïsoleerde localhost-preview met Chromium en herkenbare dummywaarden. Er vonden geen auth-, Supabase- of databaseacties plaats.

## Resultaat

- 10/10 browserruns voltooid.
- Acht persona's getest.
- Desktop, mobile, iPad portrait en iPad landscape getest.
- 10/10 refreshcontroles behielden zowel autosave-state als zichtbare ronde.
- 0 consolefouten, page errors, mislukte requests, HTTP-fouten en mediafouten.
- 0 resterende UX-, taal-, technische of toegankelijkheidsbevindingen.
- Eindscore: 100/100 in alle runs; routes verschilden door een eerste zwakke poging en hulpgebruik bij foutgevoeligere persona's.

## Gevonden en verbeterd

1. Password Fortress had nog geen AI-studentadapter. De adapter leest uitsluitend zichtbare interface-informatie en gebruikt geen aanvalsmotor, doelwaarden of antwoordoracle.
2. De getrapte aanvalsanalyse werd aanvankelijk als onbekende tussenstatus gezien. Deze controleloze fase wordt nu veilig afgewacht.
3. Invoer, toon/verberg-, test-, volgende-, hint- en skipbedieningen waren deels lager dan 44px. Alle touchbedieningen hebben nu een minimale hoogte van 44px.
4. De runner controleert refreshherstel op de eerstvolgende stabiele ronde.
5. Alleen vaste synthetische oefenwachtwoorden worden gebruikt. Beslissingen én zichtbare terugkoppeling worden vóór traceopslag geredigeerd.

## Privacybewijs

- De product-autosave bevat geen wachtwoord- of invoerveld.
- De eindscan vond geen van de gebruikte synthetische patronen in JSON- of Markdown-artifacts.
- Traces bevatten uitsluitend `[REDACTED_SYNTHETIC_PASSWORD]`.
- Runtime-artifacts blijven in de genegeerde map `test-results/ai-students/`.

## Verificatie

- `npm run test:ai-students:unit`: 58/58 geslaagd.
- `npm run typecheck:app`: geslaagd.
- `npm run doctor`: geslaagd.
- `npm run build:prod`: geslaagd.
- Definitieve browsermatrix: 10/10 voltooid, 0 bevindingen.

## Grenzen

- Persona's zijn deterministische simulaties en vervangen geen onderzoek met echte leerlingen.
- Authenticated staging, server-side voortgang en database-readback zijn niet uitgevoerd.
- De Vercel-previewconfiguratie blijft apart aandachtspunt; deze batch wijzigt geen gedeelde omgevingsvariabelen.
