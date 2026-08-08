# J2P1 hercontrole na reparatie — 2026-08-07

Getoetst door daadwerkelijk te spelen (klikken/typen), niet door code te lezen. Dev-server draaide vanuit de worktree-root op poort 3010 (poort 3000 bleek al bezet door een ongerelateerd Next.js-project van een andere sessie; niet aangeraakt). Metingen (contrast, knophoogtes, volgorde-randomisatie) via JavaScript in de browserconsole op de daadwerkelijk gerenderde pagina.

## A. `data-journalist` (data-viewer)

**A1 — GESLAAGD.** Open observatievraag "Wat valt je op als je kijkt naar het gevoel na gebruik...".
- Eerst "aaaaaaaaaa" ingevoerd (één woord, geen spaties): knop bleef uitgeschakeld ("nog minstens 7 woorden" i.p.v. te bevestigen) — de fix telt dus ook los aaneengeschreven tekst niet als losse woorden.
- Daarna 8x herhaald "aaaa" (acht identieke "woorden", voldoet aan de woordentelling): knop werd actief, na bevestigen kreeg ik **0 punten** met de melding "Dit telt nog niet mee. Schrijf in je eigen woorden minstens 8 woorden op wat jou opvalt in de data — noem bijvoorbeeld een getal, een groep of een verschil dat je ziet", gevolgd door een voorbeeldinzicht.
- In een verse sessie (reset) een echte, inhoudelijke observatie getypt ("Leerlingen die meer dan 3 uur per dag op TikTok zitten voelen zich vaak moe, terwijl leerlingen met minder schermtijd zich vaker blij of ontspannen voelen na gebruik.") → **10/10 punten**, "Goed opgeschreven!". De reparatie is dus niet doorgeschoten: onzin wordt geweerd, een echt antwoord scoort vol.

**A2 — GESLAAGD.** De zekerheidskeuze (Gok/Redelijk zeker/Heel zeker) staat gelabeld "(mag je overslaan)"; na het kiezen verscheen "Genoteerd — dit telt niet mee voor je punten" en de score bleef ongewijzigd. Na het echte antwoord verscheen een kalibratiezin: "Je was redelijk zeker, en het was goed. Je inschatting klopt."

**A3 — GESLAAGD.** Contrôle via de accessibility-tree (`read_page`), niet visueel. Elke staaf in de "Schermtijd per land"-grafiek is een `<button>` met een volledige toegankelijke naam die zowel land als waarde bevat, bv. `"VS: 7.7"`, `"Brazilië: 6.4"`, `"Japan: 2.9"` — zonder muis-hover zichtbaar voor een screenreader/toetsenbordgebruiker.

**A4 — GESLAAGD.** Tabelkoppen zijn `<button>`-elementen met `tabIndex 0` en `aria-label` als "Uren/dag— klik om oplopend te sorteren". Getest met een echte Tab-focus + Enter-toets (geen synthetische click): de tabel sorteerde en `aria-sort` ging van `"none"` naar `"ascending"`.

## B. `factchecker` (scenario-engine) — belangrijkste toets

**B1 — GESLAAGD.** Volledige missie (4 rondes) blind gespeeld met exact de voorgeschreven strategie: ronde 1 (selecteer-alles) alles aangevinkt inclusief de niet-rode-vlag-optie "Artikel linkt naar primaire bronnen" → **0/25**. Ronde 2 (rangschikken) domweg van boven naar beneden geklikt zonder te lezen → **10/25**. Ronde 3 (delen-of-niet) overal "Accepteren" geklikt → **0/25**. Ronde 4 (CRAAP selecteren) weer alles aangevinkt → **0/25**.
**Totaal: 10/100 (10%) — status "Nog niet gehaald".** Ruim onder de eerdere 43/100 die wél haalde, en ruim onder de 40%-grens.

**B2 — GESLAAGD (tegenproef).** Dezelfde missie in een verse sessie nu écht goed gespeeld (vragen gelezen, juiste antwoorden gekozen): ronde 1 **25/25**, ronde 2 **25/25**, ronde 3 **25/25**, ronde 4 **25/25** → **100/100 (100%) — "Master Factchecker", status "Gehaald"**. De volle score is dus nog steeds haalbaar; de fix is niet te streng.

**B3 — GESLAAGD.** Eerste poging: de rangschik-volgorde in twee "verse" reloads bleek identiek — maar dat kwam doordat mijn eerste opschoning alleen localStorage-sleutels met "factchecker" in de naam verwijderde, en de shuffle-seed kennelijk elders (een andere sleutel) werd bewaard. Met een **volledige** `localStorage.clear()` + `sessionStorage.clear()` en een verse pageload kreeg ik in drie opeenvolgende sessies drie verschillende volgordes:
1. TikTok, RIVM, Blog, NOS/NRC, Peer-reviewed
2. RIVM, TikTok, Blog, Peer-reviewed, NOS/NRC
3. Peer-reviewed, Blog, RIVM, NOS/NRC, TikTok

De volgorde randomiseert dus daadwerkelijk per sessie.

## C. `data-review` (review-arena) — tweede belangrijkste toets

De opdracht is inderdaad volledig herbouwd en gaat nu over de zes onderwerpen van de periode: bronnen wegen op bewijskracht (ronde 1, sorteren), spreadsheet-formules koppelen (ronde 2), grafieksoorten indelen (ronde 3, categoriseren), en API's/AI-bias als waar-onwaar (ronde 4). Bevestigd via zowel de missiebriefing-tekst als het daadwerkelijk spelen van alle vier de rondes.

**C1 — GESLAAGD (de herlaad-truc).** Ronde 1 bewust fout gespeeld (1 van de 6 posities correct) → 4/25 punten, vastgelegd. Pagina daarna herladen **zonder** op "Volgende ronde" te klikken (en zonder reset-parameter). Resultaat: de ronde toont direct de vastgelegde uitkomst met de tekst **"Je had deze ronde al ingediend. Je score staat vast op 4/25 punten."** en alleen een "Volgende ronde"-knop — geen mogelijkheid om de kaarten opnieuw te verslepen. De eerder gerapporteerde exploit (4/25 → 25/25 via herladen) is dus dichtgezet.

**C2 — GESLAAGD.** Alle vier de rondes bewust middelmatig/slecht gespeeld: ronde 1 4/25, ronde 2 4/25 (zie kanttekening hieronder), ronde 3 8/25 (categorieën expres door elkaar gehusseld), ronde 4 (waar/onwaar) 0/25. **Totaal 16/100 (16%) — "Goede poging", status "Nog niet gehaald".** Sluit dus niet af als gehaald bij een lage score.

**C3 — GESLAAGD.** Ronde 4 (waar/onwaar, 8 vragen, 12s per vraag) blind steeds dezelfde knop "WAAR" ingedrukt. Uitkomst: 4 van de 8 goed (toevallig rond de helft, zoals bij blind gokken te verwachten) → **0/25 punten**. Blind dezelfde knop indrukken levert dus geen punten op.

**C4 — GESLAAGD.** Alle zes onderwerpen kwamen terug: ronde 1 bronnen op bewijskracht sorteren (TikTok-video / RIVM-bericht / blog van een arts / krantenartikel / peer-reviewed onderzoek / onderzoek door het bedrijf zelf), ronde 2 spreadsheetformules koppelen (SOM, GEMIDDELDE, MAX, MIN, AANTAL, SOM.ALS), ronde 3 grafieksoorten indelen (staaf/lijn/cirkeldiagram voor 9 verschillende data-vragen), ronde 4 waar/onwaar-stellingen over JSON, API's en AI-bias.

### Kanttekening (geen bevestigde bug, wel vermeldenswaard)
Tijdens het testen van ronde 2 ("Welke formule hoort bij welke vraag?", klik-om-te-koppelen) kreeg ik bij twee losse pogingen geen enkele reactie op mijn klikken: het linker item kreeg wel een geselecteerde rand, maar het klikken op het bijpassende rechter item deed niets — geen foutmelding, geen voortgang, bleef op "0/6" staan, ook na meerdere nieuwe pogingen met verse `localStorage.clear()`. Bij een derde, volledig verse poging (nieuwe pageload, ronde 1 eerst afgerond) werkte het koppelen wél foutloos en behaalde ik zonder problemen 6/6 (25/25). Ik kan dit dus niet reproduceren als betrouwbare bug — het kan een eenmalige rendering-hik zijn geweest in mijn testomgeving — maar meld het voor de zekerheid, want als dit voor een leerling gebeurt levert de opdracht een niet-interactieve ronde op.

## D. Contrast en knopgrootte

**D1 — GESLAAGD.** Contrast gemeten met JavaScript (`getComputedStyle` + WCAG-relatieveluminantieformule, met correcte alpha-compositing over de daadwerkelijke achtergrondkleur — inclusief het herstel van een bug in mijn eigen eerste meetscript die abusievelijk tekst-op-tekst vergeleek). Op drie verschillende schermen was de laagste gemeten contrastverhouding voor lopende tekst:
- `data-journalist` (tabel + inleidende tekst): **6.66:1**
- `factchecker` (rode-vlaggen-kaarten): **6.00:1**
- `data-review` (sorteer-kaarten): **6.00:1**

Alle drie ruim boven de eis van 4.5:1 (vorige meting: 4.33 / 4.15 / 3.58, alle drie eronder).

**D2 — GESLAAGD.** Knophoogtes gemeten met `getBoundingClientRect()`:
- Zekerheidsknoppen (Gok / Redelijk zeker / Heel zeker): **62.5px** (was ~40px)
- Bevestigen-knop: **44.0px** (was ~34px)

Beide op of boven de minimale 44px.

## Nieuwe problemen

Geen nieuwe crashes, lege rondes of onjuiste scores aangetroffen, met als enige uitzondering de hierboven genoemde niet-reproduceerbare koppel-hapering in `data-review` ronde 2 — geen bevestigde regressie, wel het melden waard.

## Samenvatting

| Claim | Oordeel |
|---|---|
| A1 | GESLAAGD |
| A2 | GESLAAGD |
| A3 | GESLAAGD |
| A4 | GESLAAGD |
| B1 | GESLAAGD |
| B2 | GESLAAGD |
| B3 | GESLAAGD |
| C1 | GESLAAGD |
| C2 | GESLAAGD |
| C3 | GESLAAGD |
| C4 | GESLAAGD |
| D1 | GESLAAGD |
| D2 | GESLAAGD |

Alle dertien claims bevestigd. Eén niet-reproduceerbare, mogelijk omgevingsgebonden hapering gemeld ter informatie (data-review ronde 2, koppelen).
