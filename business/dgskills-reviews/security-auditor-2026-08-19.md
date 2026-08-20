## Opdracht Live Check: security-auditor — J3P2 (motor puzzle-lab)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie is een puzzelreeks over beveiliging, waarin een leerling vier puzzels moet oplossen. Een eerlijke leerling haalt overal de volle punten, maar een sjoemelaar kan zonder de vragen te lezen ook 100% scoren door te gokken. Een worstelaar die vastloopt komt onder de 40% terecht en zit dan muurvast op een eindscherm zonder uitweg. Dat doodlopende scherm is de belangrijkste reden dat deze missie nog niet klaar is voor gebruik. Daarnaast zijn er meerdere manieren waarop de score niets zegt over echte kennis.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 100/100 (100%) — Gehaald; gokvariant (eliminatie + trefwoord-stuffing) eveneens 100/100 |
| Sjoemelaar | 100/100 (100%) via eliminatie-gokken zonder de vragen te lezen; apart zak-scenario (4x overslaan) 0/100 (0%) — vastgelopen eindscherm |
| Worstelaar | eerlijk 100/100 (100%); gokvariant 'altijd de bovenste optie' 25/100 (25%) — Nog niet gehaald, vastgelopen eindscherm |
| iPad (Playwright) | niet gemeten — geen run-ipad-iris.json |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder de 40% score zit de leerling vast op een eindscherm met één uitgeschakelde knop en geen uitweg; herladen helpt niet omdat de opgeslagen voortgang blijft staan. _Bewijs: run-creatieve-cheater.json F1 (exact 1 button, disabled:true; reload zonder reset toontzelfde 0/100-scherm); PuzzleLab.tsx:270-283, CompletionScreen.tsx:163-171_
2. **MAJOR** · motor · bevestigd — Foute pogingen kosten geen punten; wie eerst fout gokt en daarna goed antwoordt, krijgt dezelfde volle punten als wie het meteen goed had. Blind gokken levert daardoor 100/100 op zonder één vraag te lezen. _Bewijs: run-creatieve-cheater.json F2 (score 0→25→50→75→100 ondanks foute pogingen); PuzzleLab.tsx:131-135_
3. **MAJOR** · motor · bevestigd — De hintprikkel staat omgekeerd: extra aanwijzingen verschijnen gratis na foute pogingen, terwijl de hintknop punten kost. Bewust fout antwoorden is dus goedkoper dan een hint kopen. _Bewijs: run-creatieve-cheater.json F3; configs/security-auditor.ts:46,76,106,135 (hintCost 4/4/4/3)_
4. **MAJOR** · missie · bevestigd — De gratis aanwijzing bij puzzel 1 verklapt letterlijk het antwoord van puzzel 4: de woorden 'prepared statements' en 'parameterized queries' staan er woordelijk in. _Bewijs: configs/security-auditor.ts:31 (extraClue puzzel 1) versus configs/security-auditor.ts:127 (hasSolution)_
5. **MAJOR** · missie · bevestigd — De open eindvraag wordt alleen op trefwoorden en minimale lengte gekeurd, niet op inhoud; een betekenisloze reeks haalde de volle 25 punten. _Bewijs: run-snelle-sam.json F3 ('sql injectie prepared queries xxxxxxxxxx' → 25/25); configs/security-auditor.ts:124-128_
6. **MAJOR** · motor · bevestigd — Al geprobeerde foute meerkeuze-opties worden niet gemarkeerd of uitgeschakeld; dezelfde foute optie kan meerdere keren worden aangeklikt en telt elke keer als nieuwe poging. _Bewijs: run-letterlijke-luca.json F1 (optie 'XSS' twee keer aangeklikt); PuzzleLab.tsx:401-416_
7. **MAJOR** · motor · bevestigd — Een afgekeurd open antwoord geeft geen blijvend zichtbare uitleg waarom het niet voldeed; de worstelaar kreeg alleen een pogingteller terug, de sjoemelaar zag zelfs helemaal geen foutmelding. _Bewijs: run-snelle-sam.json stap 7; run-creatieve-cheater.json F4_
8. **MAJOR** · motor · onbevestigd — Uit de engine-analyse blijkt dat een gewijzigde config opgeslagen voortgang buiten bereik kan brengen en een volledig leeg scherm kan opleveren zonder terug- of resetknop; dit is in geen enkele run nagespeeld. _Bewijs: _engines/puzzle-lab.json topIssues (PuzzleLab.tsx:87-90, 288; useMissionAutoSave.ts:136-145)_
9. **MINOR** · motor · bevestigd — Na het maximum aantal pogingen wordt noch het juiste antwoord noch een uitleg getoond; alleen een knop 'VOLGENDE PUZZEL →' verschijnt. _Bewijs: run-snelle-sam.json F4 (puzzel 1, 2 en 3 na 3/3 fout); PuzzleLab.tsx:482-495_
10. **MINOR** · motor · bevestigd — De overslaan-knop is vanaf de eerste seconde bruikbaar; vier klikken vanaf een schone start brengen een leerling met 0 punten rechtstreeks naar het doodlopende eindscherm. _Bewijs: run-creatieve-cheater.json F5 (4x overslaan → 0/100 → vastgelopen); PuzzleLab.tsx:466-475_
11. **MINOR** · missie · bevestigd — Bij puzzel 2 staan de antwoordknoppen in een andere volgorde dan de letters in de vraagtekst; een leerling die knopvolgorde en vraagletter 1-op-1 koppelt kiest de verkeerde optie. _Bewijs: configs/security-auditor.ts:65-68 (optievolgorde 'B — serverinfo...', 'A — geen HTTPS...', 'C — een typefout...')_
12. **MINOR** · missie · weerlegd — De sjoemelaar claimde dat 'prepared queries' wordt afgekeurd en alleen exact 'prepared statements' of 'parameterized queries' telt; dat klopt niet, de validator accepteert al 'prepared' óf 'queries' los. _Bewijs: configs/security-auditor.ts:127 (s.includes('prepared') || s.includes('parameterized') || ... || s.includes('queries')); run-snelle-sam.json F3_
13. **MINOR** · motor · onbevestigd — Op het intro-scherm kan de spreekbubbel van Kees de startknop overlappen en de klik opvangen, doordat de animatie halverwege bevriest in een verborgen tab. _Bewijs: run-letterlijke-luca.json F5 (elementFromPoint gaf de bubbel-div; visibilityState 'hidden')_
14. **MINOR** · motor · onbevestigd — Twee opeenvolgende kliks op de SUBMIT-knop van puzzel 4 hadden geen effect terwijl dezelfde knop via een schermcoördinaat wél meteen werkte; mogelijk een artefact van de browsertool. _Bewijs: run-creatieve-cheater.json F6 (eigen inschatting: laag vertrouwen)_

### Wat goed werkte
- De eerlijke doorloop werkt in alle drie de persona's van begin tot eind: 100/100, geen blocker, geen afgebroken scherm.
- Inhoudelijke feedback klopt: succesmeldingen sluiten precies aan bij de gekozen optie, de aanwijzingen horen bij de vraag, en het eindscherm toont 5 relevante leerpunten.
- De score-optelling is correct en transparant: TOTAAL SCORE liep in elke run exact 25 → 50 → 75 → 100 en het eindscherm brak dat correct uit per puzzel (4x 25/25).
- Voortgang herstellen werkt betrouwbaar: herladen midden in de missie bracht in alle drie de runs exact dezelfde puzzel én dezelfde score terug (resumed:true).
- Een schone herstart met &reset=1 werkte elke keer: PUZZEL 1/4, TOTAAL SCORE 0 (resetClean:true in alle runs).
- Geen consolefouten in enige run, en geen enkele netwerkafhankelijkheid: alleen lokale dev-assets, geen Supabase- of edge-functionaanroepen. De motor werkt volledig offline.
- Een dubbelklik op een antwoordoptie telde als één poging — geen dubbele bestraffing.
- De interface verklapt geen antwoorden vóór het kiezen: vaste optievolgorde, geen juist/fout-markering, geen 'x van y goed'-teller.
- De 'Missie voltooid! 🎉'-knop die zichtbaar niets doet, is de bekende no-op van onComplete in /dev/mission-preview — géén bug.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm een werkende uitweg bij een score onder de 40% | motor | klein | Nu is de enige knop uitgeschakeld en is er geen terug-, opnieuw- of sluitknop; de leerling zit muurvast (B1). |
| 2 | Wis of markeer opgeslagen voortgang bij een mislukte run | motor | klein | Het opruimen van de opslag gebeurt alleen in de afrond-handler, die onder de 40% onbereikbaar is. Daardoor start het volgende bezoek meteen weer op hetzelfde doodlopende eindscherm (B1). |
| 3 | Markeer of deactiveer al geprobeerde meerkeuze-opties | motor | klein | Leerlingen verspillen nu pogingen aan een optie die ze al hadden aangeklikt, zonder enige waarschuwing (B6). |
| 4 | Toon na de laatste poging het juiste antwoord met een korte uitleg | motor | klein | Wie vastloopt gaat nu door zonder te weten wat het antwoord was; er is geen leermoment (B8). |
| 5 | Laat een afgekeurd open antwoord zichtbaar en blijvend uitleggen wat er ontbreekt | motor | middel | De worstelaar kreeg geen bruikbare terugkoppeling op een te vaag antwoord — het meest waarschijnlijke afhaakpunt (B7). |
| 6 | Voeg een inhoudelijke kwaliteitspoort toe aan de open eindvraag in plaats van alleen trefwoord plus lengte | motor | middel | Een betekenisloze woordenreeks haalt nu de volle 25 punten; de missie meet daar geen begrip (B5). |
| 7 | Draai de hintprikkel om: maak de extra aanwijzingen niet gratis na fout gokken | motor | middel | Bewust fout antwoorden is nu goedkoper dan een hint kopen, en de hintknop verschijnt pas als die aanwijzingen al zichtbaar zijn (B3). |
| 8 | Haal de trefwoorden van puzzel 4 uit de extra aanwijzing van puzzel 1 | config | klein | De aanwijzing bij puzzel 1 geeft woordelijk de sleutel tot de laatste puzzel weg (B4). |
| 9 | Zet de opties van puzzel 2 in dezelfde letter-volgorde als de vraagtekst | config | klein | Knopvolgorde B-A-C tegenover vraagletters A-B-C is een onnodige valkuil voor letterlijke lezers (B10). |
| 10 | Bied de overslaan-knop pas aan na minimaal één poging | motor | klein | Vier klikken vanaf een schone start leiden nu rechtstreeks naar het doodlopende eindscherm met 0 punten (B9). |
| 11 | Laat een foute poging punten kosten of tel alleen de eerste poging vol | motor | middel | Zonder kostenprikkel is eliminatie-gokken risicovrij en levert het dezelfde volle score als kennis (B2). |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus). Er is geen run-ipad-iris.json; alle drie de runs draaiden op innerWidth 1280 met mobile.measured:false, dus iPad-bruikbaarheid is volledig ongetoetst.
- De sjoemelaar meldde dat de gratis extra aanwijzingen op puzzel 1 al na één foute poging verschenen; de config zet revealExtraAfterAttempts op 2 en de baseline-run zag ze pas na twee pogingen. Mogelijk een telfout door een dubbelklik — niet uitgezocht.
- B13 (SUBMIT-knop reageerde niet op referentie-kliks maar wel op een coördinaat-klik) is niet te scheiden van een artefact van de browsertool zonder Playwright-verificatie.
- B12 (Kees-bubbel blokkeert de startknop) trad op in een verborgen tab waarin animaties bevriezen; of een echte leerling in een zichtbaar tabblad hier last van heeft, is niet aangetoond.
- De letterlijk voorgeschreven gokvariant 'altijd de eerste optie, geen herstel, tekst = aaaa aaaa aaaa' is alleen door de worstelaar volledig gespeeld (25/100); de baseline gebruikte een eliminatie-variant, dus de spreiding van mogelijke gokscores is smal gemeten.
- Het hover-contrastprobleem op de hintknop en het ontbreken van zichtbare hover op de optieknoppen (engine-minor) is in geen enkele run visueel gecontroleerd.
- B14 (leeg scherm na config-drift door een ontbrekende bereikcontrole op herstelde opslag) komt uitsluitend uit de engine-analyse en is in geen enkele run nagespeeld.
- De hintknop is in geen enkele run daadwerkelijk aangeklikt; dat hij punten kost voor al zichtbare tekst is uit de config (hintCost 4/4/4/3) en de engine-analyse afgeleid, niet empirisch gemeten.
