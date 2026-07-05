# Leerling-simulatie-audit — Leerjaar 1, deelrapport (niet-chat missies)

**Datum:** 2026-07-02 · **Methode:** opdracht-live-check met 4 naboots-leerlingprofielen
(Modelleerling, Speedrunner, Chaoot, Vastloper) per missie, live in de browser tegen de
#194-gefixte code (dev-preview + viewport-matrix). **Bereik van dit deel:** de 28
niet-chat missies van leerjaar 1. De 12 chat-missies (golf F) volgen in een addendum.

Bewijs: 605 screenshots + per-missie JSONL onder `~/dgskills-audit/`; de per-missie
rapporten + bevindingen staan in [`jaar1/reports/`](jaar1/reports) en
[`jaar1/findings/`](jaar1/findings). Pilots: [`pilot/`](pilot).

---

## Samenvatting in gewone taal

We hebben 28 opdrachten van leerjaar 1 (alles behalve de AI-chat-opdrachten) laten
"naspelen" door vier soorten leerlingen: een serieuze, een haastige, een chaotische en
eentje die vastloopt. Elke opdracht is dus vier keer echt doorgespeeld.

**De uitkomst in één oogopslag:**

| Advies | Aantal | Betekenis |
|---|---|---|
| ✅ **ship** | 10 | Werkt goed, klaar voor leerlingen |
| 🔧 **fix-eerst** | 16 | Werkt grotendeels, maar heeft een of meer echte fouten die eerst gefixt moeten |
| ⛔ **herontwerp** | 2 | Niet uit te spelen zoals nu — kern werkt niet |

Er is **goed nieuws**: de meeste opdrachten zijn inhoudelijk sterk, veilig (ingevoerde
"hacks" worden onschadelijk als gewone tekst getoond), en een haastige leerling die maar
wat aanklikt krijgt terecht een lage score in plaats van een gratis diploma.

Maar er zijn **vijf terugkerende problemen** die veel opdrachten tegelijk raken. Deze
zijn belangrijker dan de losse foutjes, want één fix helpt op veel plekken:

1. **Dubbelklikken breekt dingen.** Kinderen dubbelklikken van nature. Op dit platform
   levert dat overal problemen op: een vinkje dat niet meetelt, een overgeslagen ronde
   met een verzonnen cijfer, een fout antwoord dat per ongeluk wordt geregistreerd, en
   in het ergste geval (mission-launch) voortgang die **permanent kapot** gaat zodat de
   leerling niet verder kan. Dit is de belangrijkste fix van leerjaar 1.
2. **De "Klaar/Voltooien"-knop doet niets** in vijf van de losse opdrachten
   (pitch-police, filter-bubble-breaker, cloud-cleaner, data-voor-data,
   datalekken-rampenplan). De leerling heeft alles goed gedaan maar kan het eindscherm
   niet afsluiten.
3. **Vals "voltooid".** Sommige eindschermen tonen een volledig succes (badge, alle
   vinkjes groen) ook als de leerling 0% had of alles oversloeg.
4. **Tekst wordt niet op inhoud gecontroleerd** — alleen op lengte. Typ je "aaaaaaaa",
   dan is dat "goed genoeg" en krijg je dezelfde topscore als iemand die echt nadenkt.
5. **Bij vastlopen komt er geen hulp.** Wie herhaald fout antwoordt, krijgt steeds
   dezelfde feedback zonder een echte hint of "probeer opnieuw"-knop.

De twee opdrachten die **herontwerp** nodig hebben, zijn losse (maatwerk) opdrachten:
**game-director** (springen met de spatiebalk werkt nooit, dus je komt niet voorbij
level 2) en **layout-doctor** (de afbeelding is niet aan te klikken, dus de hoofdtaak
kan niet). Bij beide loopt élk profiel vast op de kerntaak.

**Belangrijk patroon:** de "maatwerk"-opdrachten (dedicated componenten) zijn duidelijk
het zwakst — alle 8 die we testten hebben minstens één blokkerende fout. De opdrachten
die op een gedeelde sjabloon draaien zijn over het algemeen steviger.

Er wordt in deze audit **niets aan de opdrachten veranderd** — dit is onderzoek met
bewijs. De fixes zijn aan jou.

---

## Fix-status (bijgewerkt na fix-ronde 2026-07-05)

Na dit deelrapport is een fix-ronde uitgevoerd (Opus-agents, per fix live in de browser
geverifieerd + `vite build` groen). Dat leverde óók een aantal **correcties op de audit
zelf** op — enkele "blokkerende" meldingen bleken preview-artefact of een contentkeuze,
geen code-bug.

### Echte bugs — gefixt en geverifieerd
- **Dubbelklik-corruptie** (tool-guide sjabloon) — bewijs-vinkjes zijn nu één-richting
  (aan-only), dubbelklik onschadelijk. Lost mission-launch' permanente vastloop op.
- **cloud-cleaner** dode eindknop — reflectie-modal ving de klik af; op het laatste
  bestand alleen het eindscherm tonen. (Dit wás een echte overlay-bug.)
- **filter-bubble-breaker** score-exploit via verversen — scoring nu idempotent.
- **data-voor-data** permanente crash-lockout — half-opgeslagen ronde crasht niet meer
  en herstelt zichzelf.
- **Valse "Perfect!"** (scenario-engine sjabloon, alle 12 missies) — "Perfect" alleen
  bij een echt maximale score, anders passende feedback.
- **deepfake-detector** — hulp-AI toonde content van een andere missie (nu juiste
  context) + reload-score-exploit dichtgezet.
- **data-handelaar valse voltooiing** (gedeeld eindscherm, alle 11 templates) — onder
  40% geen "geslaagd"-framing/alle-groen meer; geen vals "gehaald" naar de docent.
- **game-director** — was écht onwinbaar (Level 2 eiste doel-bereiken terwijl de eigen
  hint alleen springen voorschreef + sprong werkte niet tijdens beweging); nu speelbaar
  t/m minstens Level 3.
- **layout-doctor** — afbeelding kreeg een toegankelijk selecteer-handvat (muis +
  toetsenbord + screenreader).

### Meldingen die géén code-bug bleken (correctie op de audit)
- **Dode eindknop bij pitch-police, datalekken-rampenplan, filter-bubble-breaker,
  data-voor-data = 4× PREVIEW-ARTEFACT.** De knop vuurt functioneel (voortgang wordt
  gewist + afronding aangeroepen); in de dev-preview is het afrond-signaal een no-op,
  dus er verandert niets zichtbaar. De testleerlingen lazen "er gebeurt niks" als
  "kapot". Alleen cloud-cleaner had écht een blokkerende overlay. → **Het
  cross-cutting patroon "dode eindknop op 5 missies" was te breed: 1 echt, 4 artefact.**
- **notificatie-ninja "verkeerde eindtitel"** — was niet de missietitel maar de
  *badge*-naam ("Screen Bewust" hoort bij 40-59%). Geen bug; missienaam nu wél zichtbaar
  voor duidelijkheid.
- **layout-doctor "onspeelbaar"** — op desktop met een echte muis wérkte het; het
  test-tool kon de afbeelding niet raken door ontbrekend a11y-handvat. Reëel gat, gefixt.

### Open voor Yorin (geen code-fix in deze ronde)
- **deepfake-detector**: 4 van 9 beeld-opdrachten zijn bewust "beschrijf de afbeelding"
  (tekst, geen beeld). Keuze: zo laten óf echte afbeeldingen laten sourcen (content).
- **layout-doctor mobiel**: op smal scherm valt de afbeelding achter de vaste zijbalk —
  aparte responsive-layout-kwestie in de simulator.
- **Didactische WARNs** (inhoudloze validatie, geen herkansing, statische feedback bij
  vastlopen) — bredere ontwerpkeuzes, niet in deze fix-ronde meegenomen.

Fix-commits: `1908135`, `5d42031`, `18b79ef`, `85929b9`, `91f4fa9`, `8a7178e`,
`31d8500`, `4dd2c93`, `5603b5d`, `532a9d6`.

## Cijfers

- **28 niet-chat missies**, elk 4× gespeeld = 112 doorlopen.
- **369 bevindingen** (waarvan 40 BLOCK, 74 WARN, 255 INFO); veel INFO's zijn juist
  positieve observaties.
- Alle bevindingen zijn geregistreerd met bewijs; `knownIssueMatch` staat op `false`
  omdat #194 al gemerged was — dit zijn dus bevindingen **ná** de batch-review-fixes,
  niet ervoor.

### Risico-kleuren
- **Rood (4 missies):** mission-launch, game-director, layout-doctor, data-voor-data —
  permanente vastloop/crash of onspeelbaar.
- **Geel (14 missies):** fix nodig, maar normaal spelen lukt.
- **Groen (10 missies):** ship.

---

## Cross-cutting patronen (systeembreed)

| # | Patroon | Waar gezien | Ernst |
|---|---|---|---|
| 1 | **Dubbelklik niet afgevangen** | mission-launch (permanente corruptie), review-week-2 (ronde overgeslagen + verzonnen cijfer), data-detective (fout antwoord), slide-specialist/word-wizard (vinkje telt niet), + spookkliks op startknop bij scenario-engine (data-speurder, code-denker, veilig-internet, cookie-crusher) | BLOCK→WARN |
| 2 | **Dode eindknop** ("Voltooien/Afronden/Missie Voltooid") | pitch-police, filter-bubble-breaker, cloud-cleaner, data-voor-data, datalekken-rampenplan | BLOCK |
| 3 | **Valse voltooiing / skip-lek** | data-handelaar (0% → volledige "voltooid"-badge), filter-bubble-breaker (nep 5/5 via reload), mission-launch | BLOCK/WARN |
| 4 | **Inhoudloze validatie** (alleen lengte) | digitale-balans-coach, review-week-3, filter-bubble-breaker, data-speurder e.a. | WARN |
| 5 | **Geen hulp/herkansing bij vastlopen** | bijna universeel: checkpuntvragen = 1 poging, statische feedback | WARN/INFO |
| 6 | **Valse "Perfect!"-melding** bij niet-perfect antwoord | code-denker (BLOCK), social-safeguard (WARN) — scenario-engine sjabloon | BLOCK/WARN |
| 7 | **Reload-score-exploit** (verversen verdubbelt punten) | filter-bubble-breaker, deepfake-detector | BLOCK |
| 8 | **Verkeerde missie-content** | notificatie-ninja (eindscherm toont "Screen Bewust"), deepfake-detector ("Vraag hulp" toont andere missie) | BLOCK |
| 9 | **Ontbrekende afbeeldingen** | deepfake-detector (4/9 beeld-opdrachten zonder beeld) | BLOCK |
| 10 | **Permanente crash-lockout** | data-voor-data (reload tijdens feedback → localStorage-corruptie → crash, alleen te herstellen door browserdata te wissen) | BLOCK |

### Wat juist goed werkt (consistent)
- **Veiligheid:** XSS-/script-injecties worden als platte tekst getoond, geen uitvoering
  (review-week-3, filter-bubble-breaker).
- **Anti-speedrun:** de meeste missies straffen zinloos klikken correct af met lage
  scores en mildere badges.
- **Voortgang bij reload** blijft in de regel behouden (op de twee timing-bugs na).
- **Responsiviteit:** desktop/tablet/mobiel meestal netjes; uitzonderingen apart gemeld
  (pitch-police tablet-staand, layout-doctor mobiel).

---

## Per-missie index

| Missie | Familie | Advies | Risico | Kernbevinding |
|---|---|---|---|---|
| magister-master | tool-guide | ship | Groen | robuust; checkpunt geen herkansing |
| cloud-commander | tool-guide | ship | Groen | robuust; bewijsknoppen verifiëren niets |
| word-wizard | tool-guide | ship | Geel | dubbelklik-vinkje telt niet |
| slide-specialist | tool-guide | ship | Groen | dubbelklik toggelt checkbox uit |
| print-pro | tool-guide | ship | Groen | markdown-vet rendert niet in tipblok |
| mission-launch | tool-guide | fix-eerst | Rood | **dubbelklik corrumpeert voortgang permanent** |
| code-denker | scenario-engine | fix-eerst | Geel | valse "Perfect!" bij niet-perfect |
| notificatie-ninja | scenario-engine | fix-eerst | Geel | eindscherm toont verkeerde missienaam |
| social-safeguard | scenario-engine | ship | Groen | hardcoded "Perfect!" (WARN) |
| veilig-internet | scenario-engine | ship | Groen | "min. 4" vs scoring "5" inconsistent |
| cookie-crusher | scenario-engine | ship | Groen | geen fase-herkansing |
| data-speurder | scenario-engine | ship | Groen | spookklik dubbelklik-start |
| data-handelaar | puzzle-lab | fix-eerst | Geel | **skip-knop → 0% maar volledige "voltooid"** |
| ai-spiegel | simulation-lab | ship | Groen | single-attempt vragen |
| review-week-2 | review-arena | fix-eerst | Geel | **dubbelklik slaat ronde over + verzint cijfer** |
| review-week-3 | ethics-council | fix-eerst | Geel | geen visuele correcties/hints; XSS-veilig |
| digitale-balans-coach | debate-arena | fix-eerst | Geel | speedrunner haalt topbadge met onzin-tekst |
| game-director | dedicated | **herontwerp** | Rood | **spatiebalk-sprong werkt nooit → vast op level 2** |
| cloud-cleaner | dedicated | fix-eerst | Geel | dode "Voltooien"-knop (overlay-conflict) |
| layout-doctor | dedicated | **herontwerp** | Rood | **afbeelding niet selecteerbaar → kerntaak onmogelijk** |
| pitch-police | dedicated | fix-eerst | Geel | dode "Afronden"-knop; feedback weg op tablet |
| data-detective | dedicated | fix-eerst | Geel | dubbelklik → fout antwoord volgende vraag |
| deepfake-detector | dedicated | fix-eerst | Geel | 4/9 beelden ontbreken; hulp toont andere missie; reload-exploit |
| filter-bubble-breaker | dedicated | fix-eerst | Geel | dode eindknop + reload-score-exploit |
| datalekken-rampenplan | dedicated | fix-eerst | Geel | dode "Missie Voltooid!"-knop |
| data-voor-data | dedicated | fix-eerst | Rood | **reload tijdens feedback → permanente crash-lockout** |
| mail-detective (pilot) | scenario-engine | fix-eerst | Geel | statische feedback; "Bijna goed" bij slechtst mogelijke antwoord |
| prompt-master (pilot) | dedicated | fix-eerst | Geel | drempel-inconsistentie; ideaal-antwoord kopieerbaar |

---

## Aanbevolen fix-volgorde (grootste hefboom eerst)

1. **Dubbelklik-debounce centraal** in de gedeelde sjablonen + dedicated componenten —
   raakt patroon #1 (incl. de permanente corruptie in mission-launch) en #2 in één klap.
2. **Eindknop/afronding** repareren in de 5 dedicated missies met een dode knop
   (overlay-render-conflict) — patroon #2.
3. **data-voor-data crash-lockout** — hoogste individuele risico (onherstelbaar voor de
   leerling zonder browserdata te wissen).
4. **game-director** en **layout-doctor herontwerpen** — kern-interactie werkt niet.
5. **Valse voltooiing / reload-score-exploit** dichten (patroon #3, #7).
6. Didactische laag: echte inhoudsvalidatie (#4) + hints/herkansing (#5).

---

## Nog te doen in leerjaar 1

- **Golf F (12 chat-missies):** schermtijd-coach, scroll-stopper, website-bouwer,
  mission-blueprint, mission-vision, game-programmeur, ai-trainer, chatbot-trainer,
  verhalen-ontwerper, ai-tekengame, ai-beleid-brainstorm, data-verzamelaar. Deze vereisen
  een ingelogd testaccount voor de live-AI-delen; addendum volgt.
- **Kanttekening uit de accountverificatie:** een deel van de "chat"-missies gebruikt in
  de dev-preview vooraf-geschreven AI-content (ai-trainer, schermtijd-coach-debat maken
  géén live edge-function-call). Dit wordt in golf F per missie uitgezocht.
