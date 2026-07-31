# Overzicht: AI-doorspeeltests van de leerling-missies

**Peildatum:** 31 juli 2026
**Doel:** één plek waar staat welke missies door AI-nagespeelde leerlingen zijn
doorgespeeld, wat eruit kwam, en wat er met de uitkomsten is gebeurd.
**Bron:** drie losse testrondes (juli 2026), samengevoegd en nagelopen.

---

## In het kort

Tien fouten, verspreid over de missies van leerjaar 1, zijn opgelost en staan sinds
31 juli 2026 live. Ze lagen bijna vier weken klaar zonder doorgevoerd te zijn. Bij het
alsnog samenvoegen botste het werk met nieuwere code; die botsing is met de hand
opgelost, en daarbij is een fout in de oorspronkelijke reparatie gecorrigeerd — die
vergeleek de score met een totaal waar ook de punten van een bonusvraag in zitten,
waardoor de felicitatie bij zulke rondes nooit meer zou zijn verschenen. Na publicatie
is gecontroleerd dat de reparaties in de daadwerkelijk uitgeleverde programmacode van de
site zitten en dat de site bereikbaar is. In een echte browser is nagespeeld dat een
score van 15 van de 25 punten nu "Goed bezig! Bijna foutloos" toont, terwijl een foutloos
antwoord de felicitatie wél geeft. Ook de verbeteringen uit ronde B staan sinds diezelfde
dag live. Wat nog openstaat: 51 van de 99 missies zijn nooit doorgespeeld.

## Wat dit betekent

1. De reparaties zijn nu live, maar doordat het voorstel bijna vier weken bleef liggen,
   botste het met latere wijzigingen en moest het met de hand worden rechtgezet. Een
   voorstel dat blijft liggen wordt vanzelf duurder om alsnog door te voeren — en tot dat
   moment merken leerlingen niets van werk dat allang gedaan is.

2. Van de 99 missies zijn er 48 getest, waardoor vooral leerjaar 2 (24 van de 33 nog
   ongetest) en leerjaar 3 (20 van de 26 nog ongetest) grotendeels ongezien blijven,
   inclusief de eindprojecten van beide leerjaren. Gevorderde leerstof is nog nooit in
   een echte browsersessie doorgelopen en onbekende fouten liggen daardoor op de loer.

3. Sinds 31 juli staat al het bewijsmateriaal in het project zelf: 62 bestanden van
   ronde A en de vier batchrapporten van ronde B. Alleen de schermteksten en kliklogs
   van ronde A staan nog buiten het project. Dat maakt controleerbaar wat er getest is,
   in plaats van dat het in losse voorstellen en op een laptop blijft hangen.

4. De testsuite die bij ronde B hoort — inmiddels 100 tests — draait niet mee in de
   automatische controles. Daardoor bleef een kapotte test drie weken onopgemerkt
   (hersteld op 31 juli). De tests bestaan dus wel, maar bewaken nog niets vanzelf.

---

## Dekking

| Leerjaar | Missies | Doorgespeeld | Nog niet |
|---|---:|---:|---:|
| 1 | 40 | 33 | 7 |
| 2 | 33 | 9 | 24 |
| 3 | 26 | 6 | 20 |
| **Totaal** | **99** | **48** | **51** |

Geteld na ontdubbeling: vier missies zijn in meer dan één ronde gespeeld
(ai-spiegel, data-handelaar, review-week-2, layout-doctor).

### Nog niet gespeeld

**Leerjaar 1 (7)** — ai-beleid-brainstorm, ai-tekengame, ai-trainer, data-verzamelaar,
mission-blueprint, prompt-master, verhalen-ontwerper

**Leerjaar 2 (24)** — access-control-engineer, ai-bias-detective, ai-ethicus,
api-verkenner, app-prototyper, automation-engineer, brand-builder, dashboard-designer,
data-journalist, digital-rights-defender, digital-storyteller, eindproject-j2,
factchecker, future-forecaster, meme-machine, network-navigator, online-helden,
podcast-producer, spreadsheet-specialist, sustainability-scanner, tech-court,
ux-detective, video-editor, web-developer

**Leerjaar 3 (20)** — api-architect, data-pipeline, digital-divide-researcher,
digital-forensics, innovation-lab, meesterproef, ml-trainer, neural-navigator,
open-source-contributor, phishing-fighter, pitch-perfect, policy-maker,
portfolio-builder, prototype-developer, reflection-report, research-project,
startup-pitch, startup-simulator, tech-impact-analyst, welzijnsonderzoeker

---

## Ronde A — Leerling-simulatie (2 t/m 6 juli 2026)

32 missies van leerjaar 1, elk gespeeld door vier gedragsprofielen: modelleerling,
snelklikker, chaoot (dubbelklikken en verversen) en vastloper. 369 bevindingen,
waarvan 40 blokkerend.

**Oordeel per missie** (31 missies; chatbot-trainer kreeg geen oordeel omdat de test
niet voorbij de verplichte nulmeting op de live site kwam):

| Oordeel | Aantal | Missies |
|---|---:|---|
| Opnieuw ontwerpen | 2 | game-director, layout-doctor |
| Eerst fixen | 18 | cloud-cleaner, code-denker, data-handelaar, data-voor-data, datalekken-rampenplan, deepfake-detector, digitale-balans-coach, filter-bubble-breaker, game-programmeur, mission-launch, mission-vision, notificatie-ninja, pitch-police, review-week-2, review-week-3, schermtijd-coach, scroll-stopper, website-bouwer |
| Klaar voor leerlingen | 11 | ai-spiegel, cloud-commander, cookie-crusher, data-detective, data-speurder, magister-master, print-pro, slide-specialist, social-safeguard, veilig-internet, word-wizard |

Risicoverdeling over de 28 niet-chat missies: 4 rood (permanente vastloop of crash),
14 geel (fix nodig, spelen lukt wel), 10 groen.

### De reparaties — gemaakt, nagelopen, sinds 31 juli live

Direct na ronde A zijn tien reparaties gemaakt en stuk voor stuk in de browser
gecontroleerd. Ze stonden sinds 5 juli in voorstel 203 en zijn op **31 juli alsnog
samengevoegd** (merge-commit `9be8afe`). Tot dat moment merkten leerlingen er niets van.

| Wat er kapot was | Missie(s) | Gerepareerd |
|---|---|---|
| Dubbelklikken corrumpeert bewijs-vinkjes, permanente vastloop | mission-launch en alle missies met dezelfde stappenlijst | ja |
| Level 2 echt onwinbaar, sprong werkt niet | game-director | ja |
| Blijvende crash na verversen op verkeerd moment | data-voor-data | ja |
| Eindknop echt onklikbaar door venster eroverheen | cloud-cleaner | ja |
| Afbeelding niet te bedienen met toetsenbord of schermlezer | layout-doctor | ja |
| Missie afrondbaar met 0 punten, toont toch geslaagd | data-handelaar en 10 andere met hetzelfde eindscherm | ja |
| Score op te drijven door te verversen | filter-bubble-breaker, deepfake-detector | ja |
| Melding "Perfect" bij een niet-perfect antwoord | 12 missies met hetzelfde sjabloon | ja |
| Hulp-AI toont inhoud van een andere missie | deepfake-detector | ja |
| Badge-naam las als missietitel op eindscherm | notificatie-ninja | ja |

Het samenvoegen botste op één bestand
(`src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx`): main had
intussen een geschaalde puntentelling gekregen voor rondes die punten reserveren voor een
bonusvraag. De oorspronkelijke reparatie vergeleek met `round.maxScore` — inclusief die
bonuspunten — waardoor de felicitatie bij zulke rondes nooit meer zou verschijnen. In de
samenvoeging vergelijkt de code nu met de maximaal haalbare itemscore, dus met wat de
leerling daadwerkelijk als "Ronde score" ziet staan.

### De audit heeft zichzelf gecorrigeerd

Ronde A meldde eerst dat de eindknop "Missie Voltooid" op vijf missies dood was. Bij
nacontrole bleek dat vier keer een artefact van de testomgeving: de knop wérkt, maar in
de testweergave is het afrondsignaal een lege actie, dus er verandert zichtbaar niets.
Alleen cloud-cleaner had een echt probleem. Ook layout-doctor bleek met een echte muis
gewoon speelbaar; het gat zat in bediening via toetsenbord en schermlezer.

### Open, geen code-fout

- **deepfake-detector**: 4 van de 9 beeldopdrachten zijn bewust tekst in plaats van een
  echte afbeelding. Keuze: zo laten of afbeeldingen laten maken.
- **layout-doctor op mobiel**: op een smal scherm valt de afbeelding achter de vaste
  zijbalk. Aparte layoutkwestie.
- **Didactische signalen**: validatie die alleen op lengte kijkt, geen herkansing,
  statische hulp bij vastlopen. Bredere ontwerpkeuzes.

---

## Ronde B — AI-testklas (10 en 11 juli 2026)

18 missies, elk gespeeld door acht profielen op vier schermformaten. 180 doorlopen
in totaal, allemaal voltooid, nul overgebleven problemen.

| Familie | Missies | Doorlopen |
|---|---|---:|
| Puzzle Lab | encryption-expert, cyber-detective, wachtwoord-warrior, data-handelaar, security-auditor | 50 |
| Password Fortress | wachtwoord-fortress | 10 |
| Simulation Lab | privacy-by-design, bug-hunter, code-reviewer, ai-spiegel, algorithm-architect | 50 |
| Review Arena | review-week-2, data-review, code-review-2, media-review, security-review, advanced-code-review, impact-review | 70 |

Tijdens de ronde zijn verbeteringen doorgevoerd, vooral knoppen die te klein waren om
op een tablet aan te tikken en het bewaren van voortgang na verversen — samen 11
bestanden in de missie-sjablonen.

Deze vier voorstellen zijn op 31 juli live gegaan. #205 rechtstreeks (`d6b334d`); #206,
#207 en #208 waren daarop gestapeld en kregen na het squashen van #205 een verweesde
merge-base, waardoor ze schijn-conflicten toonden. Ze zijn samengevoegd via #254
(`869c813`) en daarna gesloten als vervangen. De testsuite groeide daarbij van 73 naar
100 tests.

---

## Ronde C — AI-testklas-skill (30 juli 2026)

Proef met 2 missies (mail-detective, layout-doctor) en 12 leerlingprofielen. Hieruit
zijn twee reparaties voortgekomen die **wel** zijn doorgevoerd: voortgang per casus
bewaren en de dialoog sluiten met Escape (layout-doctor), en twee sluiproutes rond het
kerndoel dichtzetten (mail-detective).

---

## Waar het bewijs ligt

| Wat | Waar |
|---|---|
| Deelrapport ronde A | In het project: [leerling-simulatie-audit/jaar1-deelrapport-niet-chat.md](leerling-simulatie-audit/jaar1-deelrapport-niet-chat.md) |
| Per-missie rapporten en bevindingen ronde A (62 bestanden) | In het project: `docs/audits/leerling-simulatie-audit/` (sinds 31 juli) |
| Schermteksten en kliklogs ronde A | Buiten het project: `~/dgskills-audit/evidence/` |
| Batchrapporten ronde B (4) | In het project: `docs/testing/ai-students-*-batch.md` (sinds 31 juli) |
| Schermteksten en traces ronde B | Niet bewaard: staan in de genegeerde map `test-results/ai-students/` |
| Testklas-skill ronde C | Voorstel 246, nog open |

---

## Beperkingen van de methode

- De profielen zijn nagespeelde leerlingen, geen echte. Ze vervangen geen klassentest.
- Sommige missies gebruiken in de testomgeving vooraf geschreven AI-antwoorden in plaats
  van de echte AI. Voor die missies bewijst de test niet dat de live AI werkt.
- Ronde A draaide op de testweergave zonder inloggen. Dat leverde het hierboven
  beschreven vals alarm op rond de eindknop.
- Ronde B draaide lokaal zonder inloggen en zonder database. Voortgang die op de server
  wordt bewaard, is niet meegetest.

---

## Verwante rapporten

- [Visuele controle van alle 109 missies (30 juni 2026)](student-missions-ui-ux-review-2026-06-30.md)
  — alle missies bekeken op vier schermformaten, maar niet gespeeld.
- [Nulmeting-instroom-audit (2 juli 2026)](nulmeting-instroom-audit-2026-07-02.md)
- [Leerling-audit laag 1 (18 maart 2026)](../leerling-audit-layer1.md) — handmatige
  rondgang.
