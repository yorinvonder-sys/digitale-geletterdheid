# AI-testklasje — fase 2

Deze map bevat het uitbreidbare en fail-closed systeem voor gesimuleerde
leerlingen. De fase-3-pilot voert `mail-detective` via Playwright uit met
Snelle Sam, Taalzwakke Tess en iPad-Iris.

## Veiligheidsgrenzen

- Alleen `AI_STUDENT_ENVIRONMENT=test` of `staging` wordt geaccepteerd.
- `QA_ORIGIN` moet exact in `AI_STUDENT_ALLOWED_ORIGINS` staan.
- `dgskills.app`, `www.dgskills.app` en alle subdomeinen daarvan zijn
  geblokkeerd. Gebruik een afzonderlijke preview- of staging-origin.
- Previewmodus opent geen account en schrijft niet naar Supabase.
- Authenticated mode vereist een expliciete stagingproject-ref, een QA-school
  met prefix `dgskills-qa-` en fictieve accounts op `@example.test`.
- Credentials, `.env`-bestanden, screenshots en testrapporten horen niet in Git.
  `test-results/` en alle gangbare `.env`-bestanden zijn al genegeerd.

Gebruik geen productie-origin, productiedatabase of echte leerlinggegevens.

## Configuratie valideren

Een lokale dry-run controleert de veilige selectie zonder een browser te starten:

```bash
AI_STUDENT_ENVIRONMENT=test \
QA_ORIGIN=http://127.0.0.1:4173 \
AI_STUDENT_ALLOWED_ORIGINS=http://127.0.0.1:4173 \
npm run test:ai-students -- \
  --mission=mail-detective \
  --persona=snelle-sam,taalzwakke-tess,ipad-iris \
  --device=desktop,ipad-portrait \
  --dry-run
```

De pilotwrapper start en stopt Vite automatisch:

```bash
AI_STUDENT_ENVIRONMENT=test \
QA_ORIGIN=http://127.0.0.1:4173 \
AI_STUDENT_ALLOWED_ORIGINS=http://127.0.0.1:4173 \
npm run test:ai-students:pilot
```

Als echte Vite-Supabasevariabelen ontbreken, gebruikt deze localhostwrapper
herkenbare dummywaarden. De preview initialiseert daarmee alleen de client; de
pilot gebruikt geen login en doet geen databaseverzoeken.

Gebruik optioneel `-- --headed` om Chromium zichtbaar te openen. De pilot draait
Sam en Tess op desktop en Iris in portrait én landscape.

Beschikbare filters:

- `--mission=<id>[,<id>]`
- `--persona=<id>[,<id>]`
- `--device=desktop|ipad-portrait|ipad-landscape|mobile`
- `--seed=<waarde>` voor reproduceerbare beslissingen
- `--report-dir=<pad>` voor lokale uitvoer
- `--dry-run` voor validatie zonder browser
- `--headed` voor een zichtbare lokale browserrun

## Stagingvereisten

Authenticated runs blijven geblokkeerd totdat een afzonderlijke stagingstack
is bevestigd. De toekomstige runner verwacht deze waarden uitsluitend via de
omgeving of een lokaal, genegeerd credentialsbestand:

| Variabele | Doel |
|---|---|
| `AI_STUDENT_ENVIRONMENT=staging` | Expliciete omgevingsmarkering |
| `QA_ORIGIN` | Niet-productie web-origin |
| `AI_STUDENT_ALLOWED_ORIGINS` | Komma-gescheiden exacte originallowlist |
| `QA_SUPABASE_URL` | URL van het afzonderlijke stagingproject |
| `AI_STUDENT_EXPECTED_SUPABASE_PROJECT_REF` | Verwachte project-ref voor kruiscontrole |
| `AI_STUDENT_CREDENTIALS_PATH` | Lokaal pad naar fictieve accountmetadata |
| `AI_STUDENT_CHROMIUM_PATH` | Optioneel pad naar een lokaal Chromium-executable |

Het credentialsbestand bevat minimaal een `schoolId` met prefix
`dgskills-qa-` en één of meer accounts met `alias` en een fictief
`@example.test`-adres. Zet wachtwoorden of tokens alleen in een secret store of
lokale genegeerde configuratie, nooit in dit project.

## Persona's uitbreiden

Persona's staan in `personas/*.json` en worden dynamisch ontdekt. Een nieuwe
persona vereist dus geen codewijziging:

1. kopieer een bestaand configuratiebestand;
2. geef het een uniek `id` en vul alle velden uit `persona.schema.json` in;
3. houd alle `behaviorWeights` tussen `0` en `1`;
4. voer `npm run test:ai-students:unit` uit.

De loader valideert verplichte velden, apparaten, gedragspatronen en gewichten
voordat een run kan beginnen.

## Rapportage

`reporting/report.schema.json` is het machineleesbare contract. De writer maakt
per run deze structuur:

```text
test-results/ai-students/<datum-en-tijd>/
  summary.json
  summary.md
  <persona-id>/
    report.json
    report.md
    screenshots/
```

Gedeelde bevindingen worden op missie, stap, categorie en beschrijving
samengevoegd. Een probleem dat meerdere persona's raakt krijgt expliciet
`multiPersonaPriority: true`. Rapporten onderscheiden objectief technisch bewijs
van simulaties, menselijke validatie en mogelijke pedagogische gevolgen.

Modelkeuzes worden zonder interne redeneerstappen toegevoegd aan
`test-results/ai-students/model-routing.md`. De schrijver redigeert e-mailadressen,
tokens en secret-achtige waarden.

## Stabiele missiehooks

De gedeelde intro-, ronde-, feedback-, verdiepings- en voltooiingscomponenten
hebben semantische `data-qa`-hooks. Item-ID's zijn alleen technische scenario-ID's;
juist/fout-antwoorden worden niet als testmetadata in de DOM gezet. Browserflows
moeten daarnaast rollen en toegankelijke labels blijven verkiezen.

## Tests

```bash
npm run test:ai-students:unit
npm run doctor
```

De unit- en contracttests dekken safety guards, configuratie, dynamische
persona-loading, rapportage, modelrouteringsredactie, CLI-selectie en missiehooks.
