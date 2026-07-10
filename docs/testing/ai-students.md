# AI-testklasje

Het AI-testklasje doorloopt DGSkills-missies met configureerbare
leerlingpersona's. Browserbesturing, zichtbare missieobservatie,
persona-besluitvorming, technische telemetry en rapportage zijn afzonderlijke
modules onder `tests/ai-students/`.

## Fase-3-pilot

De eerste volledige previewpilot is op 10 juli 2026 uitgevoerd met
`mail-detective`:

| Persona | Apparaat | Status | Score |
|---|---|---|---:|
| Snelle Sam | Desktop | Voltooid | 75/100 |
| Taalzwakke Tess | Desktop | Voltooid | 78/100 |
| iPad-Iris | iPad portrait | Voltooid | 64/100 |
| iPad-Iris | iPad landscape | Voltooid | 65/100 |

Alle vier runs bereikten de eindpagina. De eerste ronde en zichtbare stap bleven
na refresh behouden. Er waren geen consolefouten, page errors, mislukte requests
of HTTP-foutresponses.

De pilot vond twee unieke aandachtspunten:

1. `MEDIUM`, objectief: de feedbackknoppen “Volgende ronde” en “Bekijk
   eindresultaat” zijn op iPad 40 CSS-pixels hoog in plaats van de beoogde 44.
2. `MEDIUM`, simulatie: Taalzwakke Tess kreeg in de eerste ronde een zichtbare
   zin van 29 woorden. De taalbelasting en een mogelijke tekstwijziging vereisen
   beoordeling met een taalexpert en echte leerlingen.

Er zijn geen leerdoelen, antwoordmodellen, scores of normeringen aangepast.

## Verbetercyclus

De twee pilotbevindingen zijn op 10 juli 2026 gericht verbeterd en met dezelfde
seed en browsermatrix opnieuw getest:

| Controle | Voor | Na |
|---|---:|---:|
| Voltooide browserruns | 4/4 | 4/4 |
| Unieke problemen | 2 | 0 |
| Snelle Sam desktop | 75 | 75 |
| Taalzwakke Tess desktop | 78 | 78 |
| iPad-Iris portrait | 64 | 64 |
| iPad-Iris landscape | 65 | 65 |

De feedbackactie is nu minimaal 44px hoog. De beschrijving van het eerste
afzendersignaal is opgesplitst van één zin van 29 woorden naar drie zinnen, met
een maximum van 12 woorden. De inhoudelijke betekenis, juiste keuze en scoring
zijn gelijk gebleven. De taalwijziging moet ondanks de groene simulatie nog met
echte leerlingen of een taalexpert worden gevalideerd.

## Uitvoeren

Installeer eerst de projectafhankelijkheden en Playwright-Chromium:

```bash
npm ci
npx playwright install chromium
```

Voer daarna de veilige localhostpilot uit:

```bash
npm run test:ai-students:pilot
```

De wrapper start Vite, gebruikt alleen de dev-preview en sluit de server na de
run. Een selectie zonder browser kan met:

```bash
AI_STUDENT_ENVIRONMENT=test \
QA_ORIGIN=http://127.0.0.1:4173 \
AI_STUDENT_ALLOWED_ORIGINS=http://127.0.0.1:4173 \
npm run test:ai-students -- \
  --mission=mail-detective \
  --persona=snelle-sam \
  --device=desktop \
  --dry-run
```

Zie `tests/ai-students/README.md` voor alle filters, persona-uitbreiding en de
rapportagestructuur.

## Artifacts

Iedere run schrijft naar:

```text
test-results/ai-students/<ISO-datum-tijd>/
  summary.json
  summary.md
  model-routing.md
  <persona>/
    report.json
    report.md
    trace-<device>.json
    telemetry-<device>.json
    screenshots/
```

Deze map blijft bewust buiten Git: traces en screenshots zijn runtimebewijs en
kunnen in latere authenticated runs gevoelige gegevens bevatten. De telemetry-
en modelrouteringsschrijvers redigeren e-mailadressen, tokens en secret-achtige
waarden.

## Veiligheidsgrens en open stagingwerk

De pilot gebruikt geen login, echte leerlinggegevens of databasewrites. De
localhostwrapper levert uitsluitend herkenbare dummy-Supabasewaarden om de
dev-route te laten initialiseren.

Authenticated tests en server-side voortgangsreadback blijven `NOT_RUN` totdat
de volgende zaken handmatig zijn bevestigd:

- een afzonderlijke disposable staging-origin;
- een afzonderlijke staging-Supabaseproject-ref;
- een QA-school met prefix `dgskills-qa-`;
- uitsluitend fictieve accounts op `@example.test`;
- secrets via een secret store of lokaal genegeerd bestand.

De runner blokkeert `dgskills.app` en alle subdomeinen daarvan. CI-integratie
volgt pas nadat de previewpilot herhaald stabiel is en staging aantoonbaar veilig
is ingericht.
