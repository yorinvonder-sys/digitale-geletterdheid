# Runtime-audit: encryption-expert
- Datum: 2026-04-16
- Template: puzzle-lab
- Auditor: agent-wave0-batchC
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introDescription, maxScore: 100, 4 puzzels (text-input × 3 + multiple-choice × 1), badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — PuzzleLab heeft intro → puzzle (currentPuzzle 0-3) → results; elke puzzel is bereikbaar via currentPuzzle index
- [N.V.T.] EERSTE_BERICHT — puzzle-lab heeft geen enableChat; PuzzleLabConfig bevat geen chatRoleId; N.V.T.
- [PASS] STEP_COMPLETE ≥ 3 — N.V.T. voor puzzle-lab; scoring via `solved[]` array + `points` per puzzel; 4 puzzels × 25 punten = 100
- [PASS] Verificatievragen — alle 4 puzzels hebben `answer` of `validator`; correctAnswer aanwezig voor gesloten puzzels; puzzel 4 gebruikt runtime-validator functie

## Visueel (code-level)
- [PASS] Responsive — PuzzleLab.tsx gebruikt `max-w-md` en `p-4`; terminal-stijl met `font-mono` is bewuste keuze en werkt op mobiel
- [WARN] Overflow — puzzel 2 (Base64) bevat een lange beschrijvingstekst met technische uitleg en `\n` linebreaks inline in de string. Bij smalle viewports kan de description-tekst overflow veroorzaken als niet correct gestyled — te verifiëren in PuzzleLab render van `description`
- [PASS] Design tokens — badges consistent (#F59E0B, #6B7280, #10B981, #3B82F6)

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Encryption Expert | 23A, 21A | Leerdoel: goed - encryptie en systeemveiligheid sluiten sterk aan; voeg expliciet het verschil tussen vertrouwelijkheid en authenticiteit toe. Opbouw: goed - van Caesar naar asymmetrisch is een didactisch sterke opbouw; laat de leerling de beperkingen van elke methode vergelijken. Differentiatie: matig - abstractie neemt snel toe; bied concrete hulpmiddelen voor basis en extra sleutelschema's voor verdieping."
- UI-koppeling: Opbouw Caesar → Base64 → asymmetrisch → wachtwoord is didactisch sterk en volgt audit-advies. Vertrouwelijkheid vs. authenticiteit is niet expliciet behandeld (puzzel 3 raakt vertrouwelijkheid maar authenticiteit/handtekeningen ontbreken). Differentiatie-aanbeveling (sleutelschema's voor verdieping) is niet geïmplementeerd; `revealExtraAfterAttempts` biedt enige scaffolding.

## Bevindingen (severity)
1. [MINOR] Caesar-puzzel: inconsistentie in extra clue — eerste extra aanwijzing (clue 3 in `clues[]`) geeft de decodering letter-voor-letter als `V → S, H → E, L → I, J → G, K → H, W → T, L → I, J → G` maar de tweede extra clue in `extraClues[]` stelt vervolgens dat `I-3=6=F` (niet E) en spreekt de eerste clue tegen (H→E vs. I→F). Dit kan leerlingen verwarren. Het antwoord `VEILIG` klopt, maar de decodering in clue 3 is fout voor de letter op positie 3 (`L` → `I` is correct, maar clue vermeldt ook `H→E` die bij YHLJKWLJ op positie 2 staat; Y→V is niet in de clue-lijst) — fix: `components/missions/templates/puzzle-lab/configs/encryption-expert.ts` (clues array van caesar-crack, corrigeer of verwijder de letter-voor-letter decodering uit de zichtbare hint)
2. [MINOR] Vertrouwelijkheid vs. authenticiteit niet behandeld — audit-aanbeveling niet verwerkt; mist kans voor SLO 23A-verdieping — fix: voeg toe aan puzzel 3 description of als vijfde puzzel
3. [MINOR] Mogelijke overflow in puzzel 2 description — inline `\n` in JavaScript string geeft geen visuele linebreak in HTML tenzij PuzzleLab `whitespace-pre-wrap` of `<br>` gebruikt; te controleren in PuzzleLab render — fix: `components/missions/templates/puzzle-lab/PuzzleLab.tsx` (voeg `whitespace-pre-wrap` class toe aan description-element)

## Bronnen
- Config: `components/missions/templates/puzzle-lab/configs/encryption-expert.ts`
- Component: `components/missions/templates/puzzle-lab/PuzzleLab.tsx`
- SLO-audit-row: "Encryption Expert | 23A, 21A | Leerdoel: goed [...] Opbouw: goed" (`docs/audits/didactische-audit-missies-2026-03-07.md:140`)
