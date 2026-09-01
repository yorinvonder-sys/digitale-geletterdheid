# Review: Datalekken Rampenplan — 2026-09-02

Skill: `opdracht-review` (letterlijk uitgevoerd, doel: de skill zelf verifiëren).
Getest tegen commit: `d2e441224277db29d0f3b55a8b96af30a25a1116`
Kwaliteitspoorten/opdracht-standaard gelezen op dezelfde commit-hash.
Route: `/dev/mission-preview?mission=datalekken-rampenplan&reset=1`
Browser: Playwright (`mcp__playwright__*`)
Evidence: `business/dgskills-reviews/evidence/datalekken-rampenplan-2026-09-02/`

## Gespeeld

Ja, van begin tot eind, twee keer volledig (desktop 1440×900 en mobiel 375×844),
plus een aparte reduced-motion-ronde. Vier fasen doorlopen: bewijs analyseren,
prioriteiten stellen, crisisbrief samenstellen, budget verdelen. Eén onvolmaakt
antwoord zat er echt in (fase 2: twee prioriteiten verkeerd om, 21/25 i.p.v. 25).

## Handelingslijst (Veto 2, ruwe schatting — zie beperking hieronder)

| Fase | Wat de leerling doet |
|---|---|
| Start | leest introscherm, klikt "Start de missie" |
| Fase 1 | beoordeelt 6 bewijsstukken, kiest er 4 van de 6 (2 afleiders genegeerd) |
| Fase 2 | zet 6 prioriteiten in eigen volgorde, krijgt feedback op 2 verwisselde items |
| Fase 3 | selecteert 5 van 8 brief-onderdelen; live preview van de brief verandert per klik; feedback per onderdeel |
| Fase 4 | kiest binnen een harde budgetgrens van €10.000 tussen 5 beveiligingsmaatregelen |
| Eind | bekijkt score 94/100 met samenvatting per fase |

Elke fase bevat een keuze met een zichtbaar gevolg (score, feedbacktekst, live
brief-preview) — geen van de fasen is puur lezen-en-klikken.

## Afkeurformulier — vier veto's

```
Veto 1 Artefact       GEZAKT
  Wat blijft er over: een score (94/100) en een localStorage-record met
    alléén indexen/booleans (evidenceSelected, priorityOrder, letterSelected,
    budgetAllocations) — GEEN vrije tekst. De "crisisbrief" in Fase 3 is
    volledig samengesteld uit vaste, voorgeschreven alinea's die op/uit gaan
    per checkbox-selectie (bevestigd zowel door te spelen als door de
    broncode: 914 regels, geen enkele <textarea>/<input>/onChange).
  Wie kan het bekijken: niemand — er is geen docent-/klasgenootweergave en
    geen vrij geschreven tekst om te tonen.
  Toets uit de standaard: "of er iets in staat wat de bouwer niet van
    tevoren had kunnen typen" — hier is dat antwoord nee, voor alle 4 fasen.

Veto 2 Handelingen    GESLAAGD
  Handelingslijst per minuut (bijgevoegd): ja, zie boven
  Aandeel lezen+klikken: 0% (elke fase heeft een keuze met gevolg)
  Beperking: automatische Playwright-speelronde duurde ±2 minuten voor alle
    4 fasen — te snel voor een realistische minuutindeling. Percentage is
    een benadering op actietype (keuze-met-gevolg vs. kaal doorklikken), niet
    op werkelijke leestijd.

Veto 3 Onderscheid    GESLAAGD (notitie: eigen motor)
  Motor: maatwerk — DatalekkenRampenplanMission.tsx staat niet in
    templateRegistry.ts, geen gedeelde templateType.
  Vergeleken met: n.v.t. (maatwerkregel uit opdracht-standaard.md/
    kwaliteitspoorten.md)
  Wat doet de leerling daar anders: n.v.t.

Veto 4 Belofte        GESLAAGD
  Titel + verwachte handeling: "Datalekken Rampenplan" / "ik verwacht dat ik
    ga opstellen van een rampenplan bij een datalek"
  Wat de leerling werkelijk doet: doorloopt 4 fasen die samen een
    rampenplan vormen (bewijs → prioriteiten → communicatie → budget);
    de titel wordt waargemaakt, ook al is Veto 1 gezakt op HOE dat plan
    tot stand komt.

UITKOMST:  AFGEKEURD
```

**Belangrijke afwijking van de Regressieset in `kwaliteitspoorten.md`.** Die
verwacht voor deze opdracht: alle veto's GESLAAGD, Poort 2 GEZAKT, Poort 1
NIET VASTGESTELD. Mijn speelbevinding wijkt af op Veto 1: door te spelen (niet
door de config te lezen) is vastgesteld dat de "crisisbrief" in Fase 3 volledig
bestaat uit vooraf geschreven alinea's die aan/uit gaan per checkbox — er wordt
nergens vrije tekst getypt of bewaard. Dat is precies het criterium dat Veto 1
zelf als afkeurgrond noemt ("een keuze uit opties telt niet mee, ook geen
keuze met een toelichting eronder"). Omdat één GEZAKT genoeg is, wordt de
opdracht AFGEKEURD vóórdat de drie poorten worden beoordeeld — die zijn dus
`n.v.t.`, niet zoals de Regressieset voorspelt.

## Validator

```
node .claude/skills/opdracht-review/scripts/validate-evidence.mjs \
  business/dgskills-reviews/evidence/datalekken-rampenplan-2026-09-02/manifest.json
```

```
Evidence FAIL (1):
- introSteps moet minstens 3 stappen bevatten
```

**Dit is een structureel probleem in de skill, geen fout in het manifest.**
De validator eist onvoorwaardelijk minstens 3 `introSteps`, ongeacht of alle
veto's slagen. Deze opdracht heeft bij het spelen aantoonbaar maar 1 stil
openingsscherm vóór "Start de missie" — er zijn geen 2 andere opeenvolgende
stappen om vast te leggen. Dat is exact de tekortkoming die Poort 2 in de
Regressieset zelf voorspelt ("de introductie is niet de vereiste
opeenvolgende presentatie"). De validator maakt het dus onmogelijk om een
eerlijk, schemavalide manifest te schrijven voor een opdracht die deze
tekortkoming heeft: je kunt niet tegelijk (a) waarheidsgetrouw documenteren
dat er maar 1 stap is, én (b) een PASS/FAIL van de validator krijgen zonder
te fabriceren. Ik heb voor (a) gekozen en het manifest laten falen op dit
punt, met de reden expliciet in `limitations`.

## Niet-uitvoerbare / onduidelijke stappen uit het Meetrecept

- **Stap 9 (Veto 3 vergelijkingsmanifest):** niet van toepassing — de
  maatwerkregel geldt hier expliciet, dus `comparedWith: null` met
  `comparedWithReason: "eigen motor"`.
- **Volledige viewportmatrix (tablet):** niet uitgevoerd. Citaat uit het
  Meetrecept § 3: "Als alle vier veto's GESLAAGD zijn, speel je aanvullend
  tablet staand ... Zijn niet alle veto's GESLAAGD, dan is de beperkte matrix
  ... voldoende." Omdat Veto 1 bij het spelen GEZAKT bleek, is volgens de
  skill zélf de beperkte matrix (desktop + mobiel, start/eind) de correcte
  keuze — ook al vroeg de opdracht in deze taak om "de VOLLEDIGE meting". Ik
  heb de skill-regel laten prevaleren boven de taakverwachting van tevoren
  vier veto's GESLAAGD, en dat hier expliciet gemeld in plaats van tablets
  te fabriceren voor een uitkomst die al AFGEKEURD is.
- **Poorten 1-3:** niet beoordeeld (`n.v.t.` in gates), conform de regel dat
  poorten alleen na vier GESLAAGDE veto's worden beoordeeld.

## Tijd

Ongeveer 35 minuten (inclusief lezen van de documenten, twee volledige
speelrondes, animatiemeting, reduced-motion-test, manifest bouwen en
valideren).
