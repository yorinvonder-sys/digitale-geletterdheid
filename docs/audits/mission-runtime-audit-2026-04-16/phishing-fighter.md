# Runtime-audit: phishing-fighter
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items in alle rondes hebben `correct`/`correctPosition` + `explanation`. Ronde 1 en 3 hebben ook `wrongFeedback` op enkele items (extra toelichting als leerling het fout heeft), wat didactisch waardevol is maar buiten het `ScenarioItem`-type valt (zie bevindingen).
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste ronde. Na ronde 4 `followUp` completion (of direct na submit als geen followUp getriggerd wordt) gaat de engine naar `'results'`.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — items zijn redelijk kort; geen extreem lange beschrijvingen.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Phishing Fighter | 23A | Leerdoel: goed — herkennen en voorkomen van phishing past direct bij 23A; voeg expliciet meld- en verificatieroutines toe. Bloom: goed — analyseren/creeren/evalueren past goed voor leerjaar 3. Activerend: goed — analyse plus eigen trainingsontwerp is zeer actief. Differentiatie: matig — geen zichtbare steunniveaus; bied voorbeeldberichten voor basis en spearphishing-cases voor verdieping."
- UI-koppeling: Ronde 1 (rode vlaggen herkennen) + ronde 3 (echt/nep binary-choice) zijn sterk activerend en dekken analyse/evaluatie (Bloom). `showConfidence: true` op ronde 1 en 3 voegt een metacognitieve laag toe die weinig andere missies hebben — goed didactisch onderscheid. Ronde 4 heeft een `followUp`-vraag met adviesopdracht, wat de "creëren"-dimensie aanstipt.

## Bevindingen (severity)
1. [MAJOR] `wrongFeedback` op meerdere items (ronde 1: items 4, 6, 8; ronde 3: items 1, 4) — dit veld bestaat **niet** in het `ScenarioItem` type (`types.ts`). TypeScript accepteert het stilzwijgend (extra property), maar de engine gebruikt dit veld nergens. De toelichting voor verkeerde antwoorden wordt nooit getoond. Fix: voeg `wrongFeedback?: string` toe aan `ScenarioItem` in `components/missions/templates/scenario-engine/types.ts` EN render het in de relevante round-componenten.
2. [MINOR] `followUp.bonusPoints: 0` in ronde 4 — de bonus is nul, waardoor de `followUp`-mechaniek wel UI toont maar de score niet beïnvloedt. Niet gebroken, maar de `adjustedScoreRound`-logica in `ScenarioEngine.tsx:28` voegt 0 toe. Overweeg ofwel bonusPoints > 0 te zetten OF de followUp te verwijderen als er geen scoreprikkel is.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/phishing-fighter.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
- Types: `components/missions/templates/scenario-engine/types.ts`
