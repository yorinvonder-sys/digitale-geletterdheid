# Opdracht-review: ml-trainer

Kwaliteitspoorten (`docs/pedagogy/kwaliteitspoorten.md`) commit: `f487541e3c98cb1544daebb6be154118f6c9103f`
Opdracht-standaard (`docs/pedagogy/opdracht-standaard.md`) commit: `f487541e3c98cb1544daebb6be154118f6c9103f`
Geteste commit (app): `f487541e3c98cb1544daebb6be154118f6c9103f`

Leerjaar 3, periode 1 ("Geavanceerd Programmeren & AI"), motor `data-viewer`.

## Gespeeld

Ja, van begin tot eind, met `mcp__playwright__*` op `/dev/mission-preview?mission=ml-trainer&reset=1`. Volledig gespeeld op vier viewports: desktop (1440×900), mobiel (375×844), tablet staand (820×1180) en tablet liggend (1180×820) — per formaat start, normale flow, een bewust fout antwoord, feedback, verdergaan na de fout en het eindscherm. Op desktop bovendien: intro-teksten per stap, een actiegebonden bewegingsmeting, de stand voor minder beweging, en een volledige herlaad zonder `reset=1` om te toetsen of het getypte werk bewaard blijft.

Voor Veto 3 is `neural-navigator` (dezelfde motor `data-viewer`) eveneens volledig gespeeld, met een eigen evidence-map en eigen manifest.

Evidence: `business/dgskills-reviews/evidence/ml-trainer-2026-09-03/` (28 screenshots + manifest) en `business/dgskills-reviews/evidence/neural-navigator-2026-09-03/` (28 screenshots + manifest). Beide `Evidence PASS`.

## Handelingslijst per minuut (desktop-hoofdronde)

| Minuut | Wat de leerling doet | Telling |
|---|---|---|
| 0-1 | leest de intro, klikt "Start de missie" | lezen/klikken |
| 1-2 | typt een getal, bevestigt, kiest een keuzerondje, bevestigt | actief |
| 2-3 | schrijft een eigen inhoudelijk antwoord, bevestigt | actief |
| 3-4 | wisselt van dataset, kiest, rekent, schrijft een observatie | actief |
| 4-5 | tweemaal terugbladeren — bewijsverzameling door de speler, geen leerlinggedrag | n.v.t. |
| 5-6 | terug, kiest, schrijft een observatie, opent de resultaten | actief |
| 6-7 | terug en sorteerknop — bewijsverzameling door de speler, geen leerlinggedrag | n.v.t. |

Aandeel lezen/klikken: **20%** over de gewone leerlingflow (1 van 5 minuten); **42,9%** over de ongecorrigeerde zevenminutenlog (3 van 7). Beide onder de afkeurgrens van 50%.

> Correctie op het manifest: `veto2` in het spelersmanifest telt 2 van de 7 minuten (28,6%). Dat is niet letterlijk consistent — minuut 0-1 bevat uitsluitend lezen en starten en telt volgens de norm óók als lezen/klikken. De juiste ruwe telling is 3 van 7. De uitkomst van het veto verandert er niet door.

## Fase B — Poort 0: vier veto's

```
Opdracht:       Word een ML Trainer (ml-trainer)
Gespeeld op:    2026-09-03  —  van begin tot eind: ja

Veto 1 Artefact       GEZAKT
  Wat blijft er over: 75/100 punten, de badge "Gehaald", drie deelscores per dataset
    en vijf door het systeem geschreven regels onder "Wat je hebt geleerd"
    (10-desktop-end.png). Geen enkel door de leerling getypt antwoord komt terug.
  Wie kan het bekijken: via de gespeelde interface niemand. Na een herlaad zonder
    reset blijft de getypte tekst technisch in localStorage staan onder
    dgskills_mission_ml-trainer, maar hij wordt nergens meer teruggerenderd — niet in
    het antwoordveld, niet in de feedback, niet op het eindscherm
    (28-desktop-persistence-reload.png). Op het eindscherm bestaan precies twee
    bedienbare elementen: "Terug naar de datasets" en "Missie voltooid! 🎉". Geen
    exporteren, opslaan, inleveren of delen. Zelfs de leerling zelf kan zijn eigen
    tekst na bevestigen niet meer teruglezen.
  Waarom gezakt: de drie eisen (zelf gemaakt, blijft bewaard, een ander kan het
    bekijken) moeten alle drie gelden. Zelf gemaakt: ja. Bewaard: technisch ja.
    Bekijkbaar: nee. Dit valt bovendien letterlijk onder de afkeurgrond "er was wel
    een tekstvak, maar je kunt na afloop nergens meer bij wat je erin typte", en onder
    "het enige wat overblijft is een score, een badge of een percentage".
  Niet vastgesteld: of er buiten de UI om (API, docentenscherm) alsnog een pad naar
    dat werk bestaat. Dat was in de lokale preview niet te bereiken. Dit raakt de
    uitkomst niet: ook als dat pad bestaat, is er in de gespeelde opdracht geen
    bekijkbaar artefact.

Veto 2 Handelingen    GESLAAGD
  Handelingslijst per minuut (bijgevoegd): ja
  Aandeel lezen+klikken: 20% in de leerlingflow, 42,9% ongecorrigeerd  (GEZAKT boven 50%)
  Waarom geslaagd: de open antwoorden tellen als actieve handeling. Twee gerichte
    controles met verse sessies wijzen uit dat de inhoud wél meeweegt: twaalf losse
    onzinwoorden leveren 0 punten en de afwijzing "Dit telt nog niet mee"; onzin mét
    getallen en het woord "verschil" erin levert eveneens 0 punten. De controle is dus
    strenger dan een woordentelling of een trefwoordtruc, en typen valt hier niet onder
    de valkuil "typen dat nergens invloed op heeft".

Veto 3 Onderscheid    GEZAKT
  Motor: data-viewer
  Vergeleken met: Word een Neural Navigator (neural-navigator), volledig gespeeld,
    eigen manifest
  Wat doet de leerling daar anders: niet wezenlijk. Beide opdrachten volgen dezelfde
    grammatica: een aangeboden tabel of uitleg bekijken, een getal of een optie
    beantwoorden, een korte uitleg typen, systeemfeedback krijgen, door naar de
    volgende dataset. De volgorde van de numerieke vraag en de keuzevraag wisselt soms
    en het onderwerp verschilt (spamfilter versus neuronen), maar de handelingslijsten
    zijn uitwisselbaar. Haal je de teksten weg, dan zijn de twee opdrachten niet uit
    elkaar te houden — precies de afkeurgrond uit de norm.

Veto 4 Belofte        GEZAKT
  Titel + verwachte handeling: "Word een ML Trainer" → ik verwacht dat ik ga trainen.
    De openingstekst versterkt dat: "van het kiezen van features tot het beoordelen van
    de accuracy van een model".
  Wat de leerling werkelijk doet: statische datasets bekijken, percentages uitrekenen,
    keuzevragen beantwoorden en een korte uitleg typen over modellen die al getraind
    zijn. De leerling traint geen model, kiest geen features om een model mee te bouwen,
    en ziet nergens een eigen handeling een model veranderen.
  Waarom gezakt: dit is hetzelfde patroon als het voorbeeld dashboard-designer uit de
    norm — de titel belooft een activiteit die nergens in de opdracht voorkomt.
    De uitweg gaat twee kanten op: de belofte waarmaken (de leerling laten trainen),
    of de opdracht eerlijk hernoemen naar wat hij werkelijk is.

UITKOMST:  AFGEKEURD
```

Eén gezakt veto is genoeg. De poorten 1-3 en de rubric zijn daarom niet uitgevoerd: er volgt geen score en geen puntentotaal.

## Bijkomende bevindingen (geen apart veto, wel relevant voor herstel)

1. **Geen tweede poging, en het antwoord staat er meteen.** Na één keer bevestigen verdwijnt het tekstvak en verschijnt het volledige modelantwoord — ook wanneer het antwoord is afgekeurd met 0 punten. De feedback vraagt de leerling dan iets te doen ("Schrijf in je eigen woorden minstens 8 woorden op wat jou opvalt in de data") wat de interface op dat moment niet meer toestaat, terwijl het juiste antwoord er al naast staat. Vastgesteld door directe DOM-meting (het `textarea`-element is na bevestigen afwezig) in twee verse sessies, niet door een screenshot. Hetzelfde geldt voor de numerieke vragen (`03-desktop-feedback.png`).

2. **De stand voor minder beweging onderdrukt de animatie niet.** Met de klasse `reduced-motion` actief op `<html>` loopt de drukanimatie van de knop vrijwel identiek door (transform `none → 0,9997 → 0,9985 → 0,9952`) aan dezelfde meting zonder die stand. Gemeten op `neural-navigator`, zelfde motor; zie `reducedMotionResult` in dat manifest en `28-desktop-reducedmotion-animation.png`.

3. **Beperking van het losse reviewer-beeld.** `reviewer-checks/reviewer-check-open-vraag-geen-tweede-poging.png` heeft de opgegeven hash, maar toont de open vraag zelf niet in beeld en draagt de claim uit punt 1 dus niet zelfstandig. Die claim rust op de DOM-meting. Het beeld staat bewust buiten de gevalideerde spelersmappen.

4. **Console-fout bij elke paginalaad:** "Missing Supabase environment variables". Kenmerk van de lokale preview (bewust zonder `.env` gedraaid), geen opdrachtfout.

## Validator

```
$ node .claude/skills/opdracht-review/scripts/validate-evidence.mjs business/dgskills-reviews/evidence/ml-trainer-2026-09-03/manifest.json
Evidence PASS: ml-trainer (preview, f487541)

$ node .claude/skills/opdracht-review/scripts/validate-evidence.mjs business/dgskills-reviews/evidence/neural-navigator-2026-09-03/manifest.json
Evidence PASS: neural-navigator (preview, f487541)
```

## Route

Spelen en meten: Sonnet-subagent met uitsluitend `mcp__playwright__*` en een shell.
Oordeel en poortbeslissing: Sol (xhigh), read-only, op basis van de manifesten en de screenshots.
Eindweging en steekproef: Opus. Twee screenshots (`10-desktop-end.png`, `09-desktop-flow3-feedback.png`) zijn los teruggelezen en naast het manifest gelegd; de gerichte controles op de open vraag zijn door de reviewer zelf uitgevoerd.
