# Overzicht: AI-doorspeeltests van de leerling-missies

**Peildatum:** 31 juli 2026
**Doel:** één plek waar staat welke missies door AI-nagespeelde leerlingen zijn
doorgespeeld, wat eruit kwam, en wat er met de uitkomsten is gebeurd.
**Bron:** drie losse testrondes (juli 2026), samengevoegd en nagelopen.

---

## In het kort

Leerlingen die de DGSkills-website gebruiken, stuiten nog steeds op fouten die in juli
2026 al zijn ontdekt en gerepareerd. De reparaties liggen klaar, maar zijn nooit op de
live-omgeving doorgevoerd. Voor de leerling betekent dit bijvoorbeeld dat mission-launch
vastloopt na dubbelklikken op de bewijs-vinkjes, data-voor-data crasht bij tussentijds
verversen en de eindknop van cloud-cleaner onklikbaar is door een venster eroverheen —
de enige echte eindknopfout; vier andere meldingen daarover bleken na controle een
testartefact. In totaal zijn 48 van de 99 missies uit het hele curriculum doorgespeeld
door AI-nagespeelde leerlingen, iets minder dan de helft. Ronde A (begin juli) testte 32
missies uit leerjaar 1; 11 werden direct goedgekeurd, 20 hadden problemen, en de tien
gemaakte reparaties staan in voorstel 203 dat nooit is samengevoegd. Ronde B testte
achttien missies met acht gedragsprofielen en vond geen resterende problemen, maar ook
die verbeteringen haalden de website niet. Alleen uit ronde C kwamen twee reparaties die
wél live zijn gegaan.

## Wat dit betekent

1. De reparaties uit ronde A en B liggen in losse voorstellen (waaronder 203) en zijn
   nooit samengevoegd met de hoofdversie. Doordat voorstel 203 inmiddels botst met
   nieuwere code, is automatisch samenvoegen onmogelijk en is handmatige integratie
   nodig. Leerlingen ervaren daardoor nog steeds fouten die sinds begin juli in de
   testomgeving al waren verholpen.

2. Van de 99 missies zijn er 48 getest, waardoor vooral leerjaar 2 (24 van de 33 nog
   ongetest) en leerjaar 3 (20 van de 26 nog ongetest) grotendeels ongezien blijven,
   inclusief de eindprojecten van beide leerjaren. Gevorderde leerstof is nog nooit in
   een echte browsersessie doorgelopen en onbekende fouten liggen daardoor op de loer.

3. De auditresultaten zijn verspreid over meerdere openstaande voorstellen (203 en 205
   tot en met 208) en een extern rapport, zonder één actueel totaalbeeld. Er ontbreekt
   een centrale plek waar precies te zien is wat getest is, wat gerepareerd is en wat
   nog een probleem vormt.

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

### De reparaties — gemaakt, nagelopen, niet doorgevoerd

Direct na ronde A zijn tien reparaties gemaakt en stuk voor stuk in de browser
gecontroleerd. Ze staan sinds 5 juli in voorstel 203 en zijn **niet samengevoegd**.
Geverifieerd op 31 juli: de code ontbreekt in de hoofdversie.

| Wat er kapot is | Missie(s) | Gerepareerd in 203 |
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

Voorstel 203 botst nu met de hoofdversie op één bestand
(`src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx`), dus
samenvoegen vraagt handwerk.

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
op een tablet aan te tikken en het bewaren van voortgang na verversen. Deze vier
voorstellen (205 tot en met 208) staan nog als concept open.

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
| Per-missie rapporten ronde A (32) | Buiten het project: `~/dgskills-audit/reports/` |
| Bevindingen ronde A (JSONL) | Buiten het project: `~/dgskills-audit/findings/` |
| Schermteksten en kliklogs ronde A | Buiten het project: `~/dgskills-audit/evidence/` |
| Deelrapport ronde A + kopie van bovenstaande | Alleen in voorstel 203, niet samengevoegd |
| Rapporten ronde B | Alleen in voorstellen 205 t/m 208, niet samengevoegd |
| Testklas-skill ronde C | Voorstel 246, nog open |

Alleen dit overzicht staat in het project zelf.

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
