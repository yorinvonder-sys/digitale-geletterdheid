# Runtime-audit: data-handelaar
- Datum: 2026-04-16
- Template: puzzle-lab
- Auditor: agent-wave1-puzzlesim
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introDescription, introFeatures, maxScore=100, puzzles(4), badges(4), takeaways(5) aanwezig
- [PASS] Puzzel-feedback aanwezig — alle 4 puzzels hebben successMessage + clues + extraClues; puzzel 4 heeft revealExtraAfterAttempts:3 (hogere tolerantie, passend voor open schrijfvraag)
- [PASS] Terminal states bereikbaar — puzzel 4 (rapport-conclusie) is laatste; heeft `validator`-functie die `hasCompany && hasAvg && hasGroup && length >= 40` checkt; maxAttempts:8

## Visueel (code-level)
- [WARN] Responsive — PuzzleLab.tsx heeft geen breakpoint-classes; de e-mailweergave in puzzle descriptions (---blokken) is opgemaakte tekst zonder speciale container; geen direct overflow-risico maar layout is niet geoptimaliseerd voor kleine schermen
- [PASS] Overflow — geen codeblokken; e-mail-simulatie is platte tekst met **bold** markeringen; geen overflow-risico
- [PASS] Design tokens — consistent PuzzleLab palet

## Didactiek
- SLO-audit quote: *"De Data Handelaar: AVG-overtredingen vragen ook 23A; voeg veiligheid/privacy expliciet toe aan de koppeling en beoordelingskaart. Bloom: analyseren/evalueren is sterk, maar juridisch taalgebruik kan voor leerjaar 1 te zwaar zijn; werk met overtredingskaarten en voorbeeldredenen."* (audit 2026-03-07, J1-P3)
- UI-koppeling: Puzzels 1-3 zijn multiple-choice met juridische begrippen (doelbinding, bijzondere persoonsgegevens, AVG-rechten). Puzzle 4 vraagt een rapportagesin. De validator controleert op 'datadeal', een AVG-begrip en een doelgroep — dit sluit goed aan op de SLO-auditaanbeveling voor structurering. De opmerking over te zwaar juridisch taalgebruik voor J1 is reëel: "doelbindingsbeginsel (AVG art. 5)" in successMessage is gespecialiseerd; maar het is hier contextueel ingebed, niet als term uitgevraagd.

## Bevindingen (severity)
1. [MINOR] Validator puzzle 4 accepteert het woord "datadeal" maar niet "DataDeal BV" als losse zin — `s.includes('datadeal')` werkt case-insensitive dankzij `toLowerCase()`, maar de instruction zegt expliciet "bevat de naam DataDeal BV"; een leerling die "datadeal" schrijft zonder "BV" slaagt ook — acceptabel gedrag maar vraagt bewuste keuze — `configs/data-handelaar.ts:126`
2. [MINOR] SLO-audit raadt aan differentiatie toe te voegen (basisdossier vs. verdiepingsdossier) — config heeft geen `difficulty`-veld; dit is een didactisch verbeterpunt, geen runtime blocker

## Bronnen
- Config: `components/missions/templates/puzzle-lab/configs/data-handelaar.ts`
- Component: `components/missions/templates/puzzle-lab/PuzzleLab.tsx`
