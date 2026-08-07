# Review: app-prototyper (2026-08-07)

## Open punt: coach-briefing 3 vs 4 stappen — BEVESTIGD
Deze missie heeft **4 canvas-stappen**: 1) probleemanalyse, 2) schermen-ontwerpen, 3) gebruikersflow, 4) testplan
(`src/features/missions/templates/builder-canvas/configs/app-prototyper.ts:29-96`).

De gedeelde "STAP VOLTOOIING"-boilerplate in `supabase/functions/_shared/systemInstructions.ts:58` (ingebakken in het
app-prototyper systeem-prompt-blok) zegt nog statisch: *"Waarbij X het stapnummer is (1, 2, of 3)."* Dat is de oude,
niet-dynamische tekst; de clientkant (`src/config/agents/shared.tsx:71`) is al gefixt naar
*"Gebruik de stapnummers uit de missiecontext; bij een missie met 5 stappen mag je dus ook 4 of 5 gebruiken."*

Gevolg voor DEZE opdracht:
- **Stap 3 (gebruikersflow)** wordt door de coach-instructie ten onrechte behandeld als de laatste geldige stap.
- **Stap 4 (testplan)** valt volledig buiten het genoemde bereik (1-3) — de coach heeft geen briefing om
  `STEP_COMPLETE:4` correct te herkennen/uit te geven voor de testplan-stap.

## Puntenverdeling per stap (config-niveau)
Geen expliciete `points`-velden in de config; `maxScore: 100` gedeeld door 4 stappen (aanname o.b.v. missionGoal
`min: 4` steps-complete-criterium) ≈ 25 punten/stap, plus 5 bonuspunten op stap 2 (`reflectionQuestion.bonusPoints`,
regel 63) voor het correct beantwoorden van de meerkeuzevraag — dit is de enige punt die inhoudelijk (niet zelf-
gerapporteerd) geverifieerd wordt.

| Stap | Titel | textPrompt | requiredLength (default) |
|---|---|---|---|
| 1 | probleemanalyse | ja (regel 42) | 40 |
| 2 | schermen-ontwerpen | ja (regel 57) | 40 |
| 3 | gebruikersflow | ja (regel 79) | 40 |
| 4 | testplan | ja (regel 95) | 40 |

Geen enkele stap specificeert een eigen `requiredLength`, dus alle vier vallen terug op de motor-default van 40 tekens.

Alle 4 stappen hebben een `textPrompt`, dus volgens de strikte definitie ("stap zonder textPrompt = 100% zelf-
rapportage") rust 0 van de 100 basispunten puur op checklist-afvinken. Maar omdat de motor open antwoorden alleen op
TEKENLENGTE keurt (BuilderCanvas.tsx:99, buiten scope van dit reviewbestand maar bevestigd door de motorreviewer),
is dat onderscheid in de praktijk grotendeels theoretisch: veertig tekens onzin ("aaaa...") + alle checklist-items
aanvinken geeft nog steeds de volle 25 punten per stap. Alleen de 5 bonuspunten op de reflectievraag (stap 2) zijn
echt inhoudelijk geverifieerd.

## Inhoudelijke juistheid
De uitleg van gebruikersonderzoek (5 W's), wireframes, gebruikersflows (incl. fout-flow) en testmethodologie
("observeer stilletjes, zeg niet 'je klikt verkeerd'") is didactisch correct en sluit aan bij herkende UX-praktijk.
Geen feitelijke fouten gevonden in de config-tekst.

## Bewijsbaarheid
De leerling levert uitsluitend **tekstuele beschrijvingen** op (`previewType: 'text-preview'`) — geen daadwerkelijk
getekend of klikbaar prototype, ondanks dat `introDescription` (regel 9) expliciet belooft: "naar een klikbaar
prototype". Dat is een mismatch tussen belofte en opgeleverd bewijs: de opdracht heet "App Prototyper" en claimt een
klikbaar eindresultaat, maar de leerling schrijft alleen op wat de schermen zouden bevatten.

## Leerdoel / taalniveau / opbouw
- SLO 22A (digitale vaardigheden/ontwerp) is passend gekoppeld.
- Taalniveau is geschikt voor 13-14 jaar; instructies zijn concreet en stapsgewijs.
- Opbouw probleem → wireframes → flow → testplan volgt een logische UX-cyclus (correct volgens `takeaways`, regel 111).
- Haalbaarheid: 4 open-tekst-opdrachten van dit kaliber (5 W's + waardepropositie, 3 wireframes, 2 flows van
  minimaal 4 stappen, een 4-delig testplan) is een fors werkpakket voor een missie zonder tekentool — reëel risico op
  tijdsdruk of oppervlakkige invulling die door de lengte-only-check toch voluit scoort.
