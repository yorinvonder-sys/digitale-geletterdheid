# AI-testklas — pilot (2026-07-30)

Eerste run van `dgskills-ai-classroom`. Doel: bewijzen dat het systeem werkt vóór het op alle 99 opdrachten wordt losgelaten.

## Beslistabel

| Opdracht | Oordeel | Reden | Wie liep vast |
|---|---|---|---|
| `mail-detective` | **fix-eerst** | Volle score haalbaar zonder iets van phishing te weten | niemand |
| `layout-doctor` | **herontwerp** | Dialoog in casus 4 niet te sluiten; geen voortgang bewaard | iPad-Iris, Gamer Gijs |

Details per opdracht staan in `mail-detective-2026-07-30.md` en `layout-doctor-2026-07-30.md`.

## Opzet

6 runs, 6 leerlingen, 2 opdrachten. Drie leerlingen per opdracht, gekozen met de vaste slotregel uit de skill (interactierisico · niveaufit · betrokkenheid). Elke leerling op een eigen dev-server (3011/3012/3013), parallel gedraaid.

De derde geplande opdracht (`data-verzamelaar`) is **niet gedraaid** — na 6 runs was het beeld duidelijk genoeg om eerst te laten toetsen of dit oplevert wat Yorin nodig heeft, vóór er meer budget in gaat.

## Toets aan de slaagcriteria

| # | Criterium | Uitkomst |
|---|---|---|
| 1 | Alle runs afgerond mét bewijs op schijf | **6/6** — snapshots, telemetrie en actielijsten staan er. Geen PNG's: de browsertools geven een screenshot alleen inline terug, er is geen pad naar schijf. Alle drie de agents meldden dat expliciet in plaats van het te verzwijgen. Protocol aangepast: meten met `getBoundingClientRect` in plaats van beoordelen op beeld — dat levert hardere getallen |
| 2 | Minstens één bekend probleem teruggevonden | **Gehaald.** iPad-Iris vond het bekende ribbon-probleem terug, markeerde het correct als niet-nieuw, en mat het exact: 24×24, 21×21 en 16×16 px tegen een drempel van 44×44 |
| 3 | Nul meldingen uit de drie bekende schijnfouten | **Gehaald.** Geen enkele "dode knop"-melding, geen blanco-scherm-melding, geen verwarring tussen eindscherm en geslaagd. Concrete Milan kwam een verdacht herstel-effect tegen en markeerde het uit zichzelf als mogelijk preview-artefact met verzoek om bevestiging |
| 4 | Bestaand testharnas onaangetast | **Gehaald.** 81/81 tests groen, `personas/` en `load-personas.mjs` ongewijzigd |
| 5 | Yorin is het eens met minstens 2 van de oordelen | **Open** — vraagt zijn oordeel |

## Wat het systeem vond dat een code-review niet vindt

De zwaarste bevinding is didactisch, niet technisch: in `mail-detective` staat de verklaring waarom een optie verdacht is al op de kaart vóórdat je kiest. Wie op signaalwoorden scant haalt 100% zonder de mail te lezen. Een code-review ziet correcte, werkende code; alleen iemand die de opdracht speelt met de bedoeling de kortste route te vinden, ziet dit.

Tweede voorbeeld: `layout-doctor` bewaart geen voortgang. Drie leerlingen vonden dat onafhankelijk van elkaar, en bij iPad-Iris werd het pas echt schadelijk in combinatie met de vastgelopen dialoog — ze ververste om verder te komen en verloor alles.

## Kalibratie die de orkestrator moest corrigeren

Twee leerlingen meldden dat slepen niet werkt in `layout-doctor`. Uit de audit van juli is bekend dat testautomatisering die afbeelding niet kan verslepen terwijl een echte muis dat wél kan. Gamer Gijs hield daar zelf rekening mee (simulatie, lage zekerheid, "verifieer met een echte muis"); iPad-Iris claimde het als gemeten feit met hoge zekerheid — een overclaim.

Dit is precies waarom de samenvoegstap bij de orkestrator ligt en niet bij de agents: bekende artefacten van de testomgeving moeten eruit vóór iets een bevinding wordt. Het staat als kanttekening in het rapport, niet als bug.

## Kosten

6 runs kostten samen ruwweg 1,8 miljoen tokens, ongeveer 300k per leerling per opdracht. Bij 3 leerlingen per opdracht komt een volledige ronde van 8 opdrachten daarmee op ongeveer 7 miljoen tokens. Dat is de belangrijkste reden om per curriculumperiode te werken en niet alles in één keer te draaien.

## Aanbevelingen

1. Laat Yorin de twee oordelen toetsen (criterium 5).
2. Bevestig het sleepprobleem handmatig op een echte iPad, staand én liggend.
3. Overweeg de bevindingen over "je haalt een volle score zonder te leren" als eigen categorie te behandelen — die komen niet uit een bug maar uit ontwerp, en de gewone fix-stroom vangt ze niet.

## Niet getest

Serveropslag, XP en dashboardvoortgang blijven `NOT_RUN`: de preview-route bewaart niets. Alle belevingsoordelen zijn simulaties en vragen menselijke bevestiging.
