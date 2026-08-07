# Review: code-reviewer (2026-08-07)

## Blocking
- **Antwoordpositie voorspelbaar** (`code-reviewer.ts:214,229,245,277,293,309,343,359,375`): in 8 van de 9 vragen staat het juiste antwoord op index 1 (de tweede optie, "B"). Alleen `cl1-q2` (index 2) wijkt af. Een leerling die blind altijd de tweede optie kiest, scoort ~89% zonder de stof te kennen. Dit is een engine-bekende zwakte (opties worden nooit geschud) die hier door de config-auteur is versterkt door alle antwoorden op dezelfde plek te zetten. Fix: herverdeel de positie van `correctAnswer` binnen de `options`-array per vraag.

## Niet-blocking
- **Geen echte codefragmenten getoond** (hele bestand): de missie heet "Code Reviewer" en vraagt leerlingen codekwaliteit te beoordelen, maar er wordt nergens een daadwerkelijk codeblok getoond — alleen prozabeschrijvingen ("een variabele met de naam temp2", "0.21 voor btw"). Didactisch zwakker dan een missie die echte (foute) code laat zien om te herkennen.
- **Variabele-typo** (`code-reviewer.ts:40`): `magigeGetallen` i.p.v. `magischeGetallen` — ironisch in een missie die goede naamgeving preekt. Puur intern, geen leerling-impact.

## Codecorrectheid van de getoonde voorbeelden
Alle vakinhoudelijke claims kloppen: "temp2" als slecht naamvoorbeeld, DRY-uitleg, magisch getal "0.21"/BTW_TARIEF-voorbeeld, 5x dezelfde berekening aanpassen, sandwich-feedbackmethode. Geen technisch onjuiste uitleg gevonden.

## Engine-checklist (config-specifiek)
- prediction afleesbaar: n.v.t. — geen `prediction`-type vragen in deze config, alleen `multiple-choice`.
- vraag zonder options: geen — alle 9 vragen hebben een `options`-array.
- correctAnswer als getal: geen — telkens de volledige optietekst, geen index/getal.
- dubbele opties: geen duplicaten binnen een vraag gevonden.
- juiste antwoord vaste positie: BLOCKING — 8/9 op index 1.

## SLO/curriculum
`slo-kerndoelen-mapping.ts:118` en `curriculum.ts:193` bevatten `code-reviewer` consistent (22A+22B, leerjaar 2, week 2). Geen mismatch.

## Verdict
fix-eerst — de voorspelbare antwoordpositie is een testvaliditeitsprobleem dat eerst moet worden opgelost.
