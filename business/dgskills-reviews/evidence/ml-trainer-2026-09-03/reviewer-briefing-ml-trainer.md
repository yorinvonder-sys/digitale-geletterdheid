# Reviewopdracht — oordeel over één leerlingopdracht (poort 0: vier veto's)

Je bent de beoordelaar. Je oordeelt UITSLUITEND op verzameld speelbewijs, niet
op broncode of instellingenbestanden. Read-only: wijzig niets.

## Repo en werkmap

`/Users/yorinvonder/Downloads/ai-lab---future-architect/.claude/worktrees/opdracht-review-j3p1`
(branch `claude/opdracht-review-j3p1`, commit `f487541e3c98cb1544daebb6be154118f6c9103f`)

## Lees eerst, en volg letterlijk

- `docs/pedagogy/opdracht-standaard.md` — **Deel 1, de vier veto's**. Dat is de
  norm. Neem de definities en de afkeurgronden letterlijk over; verzin geen
  eigen soepelere lezing.
- `.claude/skills/opdracht-review/SKILL.md` — de werkwijze en het rapportformaat.

## Het bewijs

Twee volledig gespeelde opdrachten op dezelfde motor (`data-viewer`), beide
gespeeld met Playwright in de lokale preview `/dev/mission-preview`, beide
gevalideerd door `.claude/skills/opdracht-review/scripts/validate-evidence.mjs`
(beide `Evidence PASS`):

- **Te beoordelen opdracht:** `evidence/opdracht-review/2026-09-03/ml-trainer/manifest.json`
  plus de 28 PNG's in die map.
- **Vergelijkingsopdracht (voor veto 3):** `evidence/opdracht-review/2026-09-03/neural-navigator/manifest.json`
  plus de 28 PNG's in die map.

In het manifest vind je onder meer `expectation` (de verzegelde verwachting
vóór de eerste klik), `actionLog` (wat de leerling feitelijk deed, gekoppeld aan
screenshotnummers), `introSteps` (de letterlijke schermteksten),
`introSummary`, `veto2` (de minutentelling) en `limitations`.

**Kijk echt naar de screenshots.** Het manifest bewijst samenhang, geen
herkomst. Open in elk geval `10-desktop-end.png` (het eindscherm van
ml-trainer) en minstens twee andere beelden uit de flow, en toets of het
verhaal in het manifest klopt met wat je ziet.

## Wat je moet opleveren

Vul het **afkeurformulier** uit `docs/pedagogy/opdracht-standaard.md` volledig
in voor `ml-trainer`, met per veto GESLAAGD / GEZAKT / NIET VASTGESTELD en de
gevraagde onderbouwing eronder. Denk in het bijzonder na over:

- **Veto 1 (artefact).** Wat blijft er na afloop over, en kan een ander dat
  bekijken? Let op de drie eisen: zelf gemaakt (niet gekozen), blijft bewaard,
  en een ander kan het bekijken.
- **Veto 2 (handelingen).** De speler kwam op 2 van de 7 minuten lezen/klikken
  (28,6%). Toets die telling kritisch tegen `actionLog`. Let op de valkuil uit
  de norm: "antwoord typen" telt als klikken wanneer het getypte niets verandert
  aan wat daarna gebeurt.
- **Veto 3 (onderscheid).** Leg de `actionLog` van ml-trainer naast die van
  neural-navigator. Zijn het dezelfde werkwoorden in dezelfde volgorde?
- **Veto 4 (belofte).** Titel "Word een ML Trainer", verzegeld verwacht
  werkwoord "trainen". Wat doet de leerling werkelijk?

Sluit af met exact één van deze drie, letterlijk uitgeschreven:

```
UITKOMST:  DOOR NAAR RUBRIC
UITKOMST:  AFGEKEURD
UITKOMST:  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

Alleen wanneer alle vier de veto's GESLAAGD zijn ga je door naar de poorten
(`docs/pedagogy/kwaliteitspoorten.md`) en de rubric. Bij één GEZAKT stopt het
daar — geen score, geen puntentotaal.

## Grenzen

- Baseer geen enkel oordeel op `src/config/**` of op de missieconfiguratie. Die
  mag je hoogstens lezen om te wéten wat de opdracht claimt, nooit als bewijs
  dat er bij het spelen iets gebeurt.
- Is iets niet uit het bewijs vast te stellen, gebruik dan NIET VASTGESTELD en
  schrijf op wat er nodig zou zijn om het alsnog vast te stellen. Vul geen gat
  met een aanname.
- Schrijf in het Nederlands.

---

## Waarnemingen van de reviewer die je moet meewegen

Dit zijn eigen waarnemingen uit de screenshots en uit eigen gerichte metingen,
geen conclusies. Toets ze zelf aan het bewijs en trek je eigen oordeel.

1. **Het eindscherm bevat geen leerlingwerk.** `10-desktop-end.png` toont een
   mentorzin, "Model Trainer", "75/100 punten (75%)", de badge "Gehaald", een
   score per dataset, "Missie voltooid!" en een lijstje "Wat je hebt geleerd"
   van vijf door het systeem geschreven regels. Geen van de door de leerling
   getypte antwoorden komt erin terug.

2. **De open vraag wordt wél op inhoud beoordeeld, maar kent geen tweede
   poging.** `09-desktop-flow3-feedback.png` toont bij een goed beantwoorde open
   vraag de feedback "Goed opgeschreven! +10 punten voor je observatie." met
   daaronder een vooraf geschreven modelantwoord.

   Ik heb zelf getoetst of die punten van de inhoud afhangen, met twee verse
   sessies (`reset=1`) op de open vraag "Waarom heet dit \"supervised
   learning\"? Wat is de rol van de \"Label\"-kolom in dit leerproces?" (10 pt).
   Gemeten uitkomsten, letterlijk:
   - Antwoord van 12 losse onzinwoorden ("banaan olifant fiets ..."): score
     blijft **0 pts**, feedback "Dit telt nog niet mee. Schrijf in je eigen
     woorden minstens 8 woorden op wat jou opvalt in de data — noem bijvoorbeeld
     een getal, een groep of een verschil dat je ziet."
   - Antwoord met getallen én het woord "verschil", maar inhoudelijk onzin ("Er
     zijn 12 bananen en 5 olifanten in deze tabel en dat is een groot verschil
     tussen de twee groepen"): eveneens **0 pts** en dezelfde afwijzing.

   De inhoudelijke controle is dus strenger dan een woordentelling of een
   getal-/trefwoordtruc. Een eerder vermoeden dat de punten onvoorwaardelijk
   werden gegeven, is hiermee weerlegd — ga daar niet van uit.

   **Wat wél opvalt:** in beide gevallen verdween het tekstvak na één keer
   bevestigen en verscheen direct het volledige modelantwoord. De feedback
   vraagt de leerling iets te doen ("Schrijf ... minstens 8 woorden op wat jou
   opvalt") wat de interface daarna niet meer toestaat, en het juiste antwoord
   staat er dan al. Bewijs:
   `evidence/opdracht-review/2026-09-03/reviewer-checks/reviewer-check-open-vraag-geen-tweede-poging.png`
   (1440x900, sha256 `030f841dddccc035a003e78b596c0b2969f4c25cffed45e3067676608a7fd798`).
   Dit beeld staat bewust buiten de gevalideerde spelersmappen: het is een
   losse controle van de reviewer, geen onderdeel van het spelersmanifest.

   Weeg zelf of typen hier onder de valkuil van Veto 2 valt. Let daarbij op
   beide kanten: de score hangt aantoonbaar wel van de inhoud af, maar het
   vervolgscherm is voor iedereen hetzelfde.

3. **Fout antwoord kent geen tweede poging op dezelfde vraag.**
   `03-desktop-feedback.png`: na een fout getal verschijnt direct het juiste
   antwoord met uitleg; de leerling kan die vraag niet opnieuw proberen.

4. **Reduced motion onderdrukt de animatie niet.** In het manifest van
   neural-navigator staat een meting met `reducedMotionResult`: met de klasse
   `reduced-motion` actief op `<html>` loopt de drukanimatie van de knop
   vrijwel identiek door (transform `none → 0,9997 → 0,9985 → 0,9952`) aan de
   meting zonder reduced motion. Relevant voor de visuele poort, mocht je aan
   de poorten toekomen.

5. **Console-fout bij elke paginalaad:** "Missing Supabase environment
   variables". Dit is een omgevingskenmerk van de lokale preview (er is bewust
   geen `.env` gebruikt), geen opdrachtfout — context, geen verwijt.

6. **Persistentiemeting voor Veto 1 (screenshot 28,
   `28-desktop-persistence-reload.png`).** De speler typte bij een open vraag de
   herkenbare tekst `HERKENBARE-TEKST-VETO1 dit is mijn eigen antwoord over de
   Label kolom en supervised learning`, bevestigde die, en navigeerde daarna
   opnieuw naar dezelfde route **zonder** `reset=1`. Uitkomst, letterlijk
   gemeten:
   - De voortgang blijft: score en de "beantwoord"-status blijven staan; de
     opdracht begint niet opnieuw.
   - De getypte tekst zit ná de herlaad nog in `localStorage` onder de sleutel
     `dgskills_mission_ml-trainer` (gecontroleerd met een sleutel-scan die
     alleen ja/nee teruggaf, niet de inhoud).
   - De tekst is nergens meer op het scherm te vinden: niet in het antwoordveld
     (dat is vervangen door het systeem-feedbackblok), niet in de feedback, niet
     op het eindscherm. `document.body.innerText` bevat hem op geen enkel
     bereikbaar scherm.
   - Op het eindscherm zijn er precies twee bedienbare elementen: "Terug naar de
     datasets" en "Missie voltooid! 🎉". Geen exporteren, opslaan, inleveren of
     delen. De tweede knop doet zichtbaar niets behalve focus krijgen.
   - Niet vastgesteld: of er buiten de UI om (API, docentenscherm) alsnog een
     pad naar dat werk bestaat. Dat was in de lokale preview niet te bereiken.

7. **Handelingslijst per minuut (ml-trainer, desktop), afgeleid uit
   `actionLog` t.o.v. `expectation.recordedAt`.** Let op: minuut 4-5 en 6-7
   bevatten handelingen die de spelér deed om bewijs te verzamelen (terugbladeren
   om intro-tekst vast te leggen, en een sorteerknop klikken voor de
   bewegingsmeting), niet wat een gewone leerling zou doen. Weeg dat mee bij de
   telling.

   | Minuut | Handelingen |
   |---|---|
   | 0-1 | klikt "Start de missie" |
   | 1-2 | typt getal (bewust fout), bevestigt, kiest keuzerondje, bevestigt |
   | 2-3 | bevestigt open antwoord (na intypen observatie) |
   | 3-4 | volgende dataset, kiest keuzerondje, bevestigt, typt getal, bevestigt, typt observatie, bevestigt, volgende dataset |
   | 4-5 | tweemaal "Vorige dataset" (bewijsverzameling door de speler) |
   | 5-6 | tweemaal "Volgende dataset", kiest keuzerondje, bevestigt, typt observatie, bevestigt, "Bekijk resultaten" |
   | 6-7 | "Terug naar de datasets", klik op sorteerknop (bewegingsmeting door de speler) |
