# Review: Podcast Producer — 2026-09-02

Skill: `opdracht-review` (letterlijk uitgevoerd, doel: de skill zelf verifiëren).
Getest tegen commit: `d2e441224277db29d0f3b55a8b96af30a25a1116`
Route: `/dev/mission-preview?mission=podcast-producer&reset=1`
Browser: Playwright (`mcp__playwright__*`)
Evidence: `business/dgskills-reviews/evidence/podcast-producer-2026-09-02/`
Beperkte matrix gebruikt (desktop + mobiel, start/eind) — toegestaan zodra veto's zakken.

## Gespeeld

Ja, van begin tot eind, twee keer volledig (desktop 1440×900 en mobiel
375×844). Vier stappen doorlopen: onderwerp kiezen, structuur plannen, intro
schrijven, interviewvragen bedenken. Elke stap: een checklist plus één
tekstvak; stap 3 had een meerkeuze-verdiepingsvraag.

## Handelingslijst (Veto 2)

| Stap | Wat de leerling doet |
|---|---|
| Start | leest introscherm, klikt "Start de missie" |
| Stap 1 | typt onderwerp+doelgroep in tekstvak, vinkt 2 checklist-items af |
| Stap 2 | typt podcast-structuur in tekstvak, vinkt 3 checklist-items af |
| Stap 3 | typt intro-tekst, vinkt 3 checklist-items af, beantwoordt 1 meerkeuzevraag |
| Stap 4 | typt 5 interviewvragen+follow-ups, vinkt 3 checklist-items af |
| Eind | bekijkt score 100/100, leest "je hebt een complete OPZET voor een echte podcast die je KUNT OPNEMEN" |

Het typen in elk tekstvak heeft geen enkel effect op de vervolgstap of het
spel-verloop — het ontgrendelt alleen de "Volgende stap"-knop samen met de
checkboxes. Dat is exact de val die Veto 2 beschrijft: "Als het antwoord
alleen wordt opgeslagen en niets verandert aan wat er daarna gebeurt, is het
een verkapt afvinkvakje."

## Afkeurformulier — vier veto's

```
Veto 1 Artefact       GEZAKT
  Wat blijft er over: vier stukken tekst (onderwerp, structuur, intro,
    interviewvragen) opgeslagen in localStorage — dit IS door de leerling
    zelf getypt (anders dan bij datalekken-rampenplan), maar het eindscherm
    zegt het zelf: "een complete OPZET voor een echte podcast die je KUNT
    opnemen". Er bestaat geen podcast, geen audio, geen product — alleen een
    plan ervoor.
  Wie kan het bekijken: niemand — geen docent-/klasgenootweergave getoond.
  Toets: het artefact is een script/opzet, niet het beloofde eindproduct.

Veto 2 Handelingen    GEZAKT
  Handelingslijst per minuut (bijgevoegd): ja, zie boven
  Aandeel lezen+klikken: 100% — elk tekstvak is een "verkapt afvinkvakje"
    (typen zonder gevolg voor het vervolg), en checkboxes zijn puur
    zelfrapportage zonder consequentie.

Veto 3 Onderscheid    NIET VASTGESTELD
  Motor: gedeeld sjabloon (templateType "builder-canvas" in
    src/config/templateRegistry.ts, regel 52) — GEEN maatwerk, dus de
    "eigen motor"-uitzondering geldt hier niet.
  Vergeleken met: geen tweede speelronde uitgevoerd (tijdslimiet van deze
    verificatietaak). Structureel patroon (stap → checklist → tekstvak →
    "Volgende") komt sterk overeen met wat de Regressieset voor
    app-prototyper beschrijft, maar dat is niet met een eigen speelronde
    bevestigd — dus NIET VASTGESTELD i.p.v. aangenomen.
  Nodig om vast te stellen: een volledige speelronde van app-prototyper (of
    een andere opdracht op dezelfde motor) binnen dezelfde sessie.

Veto 4 Belofte        GEZAKT
  Titel + verwachte handeling: "Maak je eigen podcast" / "ik verwacht dat ik
    ga produceren/maken van een echte podcast (audio opnemen)"
  Wat de leerling werkelijk doet: schrijft vier tekstvakken (onderwerp,
    structuur, intro, vragen). Geen seconde audio opgenomen. Het eindscherm
    bevestigt dit zelf letterlijk ("...die je KUNT opnemen" — dus nog niet
    opgenomen).

UITKOMST:  AFGEKEURD
```

**Bevestiging van de Regressieset.** `kwaliteitspoorten.md` voorspelt voor
`podcast-producer`: AFGEKEURD op Veto 1+2+3+4, met als reden "Er blijft geen
aantoonbaar werk over; de speler leest en typt vooral, doet dezelfde
handelingen als andere formulieropdrachten en de titel belooft
maken/opnemen." Mijn speelbevinding bevestigt dit woordelijk voor Veto 1, 2
en 4. Veto 3 is hier NIET VASTGESTELD in plaats van GEZAKT, omdat ik — anders
dan de Regressieset, die kennelijk wél een vergelijking maakte — geen tweede
speelronde heb gedraaid. Dat verandert de einduitkomst niet (één GEZAKT is al
genoeg voor AFGEKEURD), maar het is een precisie-verschil t.o.v. de
Regressieset die het rapport eerlijk moet melden.

## Validator

```
node .claude/skills/opdracht-review/scripts/validate-evidence.mjs \
  business/dgskills-reviews/evidence/podcast-producer-2026-09-02/manifest.json
```

```
Evidence FAIL (2):
- introSteps moet minstens 3 stappen bevatten
- comparedWithReason moet exact eigen motor zijn bij null
```

Beide FAILs zijn bewuste, uitgelegde consequenties van eerlijke rapportage,
geen fouten in de meting:
- **introSteps:** deze opdracht heeft, net als datalekken-rampenplan, maar 1
  stil openingsscherm. Zelfde structurele skill-tekortkoming als in dat
  rapport beschreven (de validator eist onvoorwaardelijk ≥3 stappen).
- **comparedWithReason:** ik heb bewust NIET "eigen motor" ingevuld, omdat
  dat feitelijk onjuist zou zijn — deze opdracht draait op een gedeeld
  sjabloon, geen maatwerk. De validator staat voor `comparedWith: null`
  uitsluitend de tekst "eigen motor" toe; een eerlijke NIET-VASTGESTELD-reden
  ("geen tweede speelronde binnen deze sessie, en 'eigen motor' is hier niet
  van toepassing") is schema-technisch geen geldige waarde. Dit is dezelfde
  soort validator-starheid als bij introSteps: de skill dwingt hier impliciet
  tot óf fabriceren óf een FAIL accepteren. Ik koos voor het laatste.

## Niet-uitvoerbare / onduidelijke stappen uit het Meetrecept

- **Stap 8 (Veto 3, tweede speelronde):** niet uitgevoerd binnen de
  tijdslimiet van deze taak; zie Veto 3 hierboven. Letterlijk citaat uit
  kwaliteitspoorten.md dat hier van toepassing is: "Zonder twee volledige
  speelrondes is het veto NIET VASTGESTELD."
- **Volledige viewportmatrix:** niet uitgevoerd — toegestaan per het
  Meetrecept omdat de veto's zakken ("beperkte matrix is toegestaan als de
  veto's zakken", conform de taakinstructie zelf).
- **Poorten 1-3:** niet beoordeeld (`n.v.t.` in gates).

## Tijd

Ongeveer 25 minuten (twee speelrondes, animatiemeting, reduced-motion-test,
manifest bouwen en valideren).
