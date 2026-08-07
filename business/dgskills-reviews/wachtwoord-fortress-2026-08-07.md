# Review: wachtwoord-fortress (2026-08-07)

## Status-index
`wachtwoord-fortress` staat NIET in `business/dgskills-reviews/review-status.json` (alleen `wachtwoord-warrior` staat erin, regel 2782). Er bestaat wel een ouder rapport `wachtwoord-fortress-2026-07-02.md` op disk — de missie is dus eerder gereviewd maar nooit in de status-index opgenomen. Moet alsnog toegevoegd worden.

## Vaststaande enginebevindingen (niet herhaald, uit motorreview)
- Sterktemeter herkent geen herhaling (16× "a" → 100/100).
- Opdracht claimt zo'n wachtwoord expliciet veilig — feitelijk onjuist.
- `onComplete(true)` vuurt onvoorwaardelijk, ook bij 25/100.
- Eindronde niet overslaanbaar, geen uitweg bij vastlopen.
- Contrastfouten al gemeld elders.
- Privacy schoon: wachtwoord blijft lokaal.

## Hintkwaliteit (config-niveau)

1. **`wachtwoord-fortress.ts:43`** — "Probeer 11+ kleine letters, of 8+ tekens met hoofdletters en cijfers gemixt."
   Oordeel: **verouderd**. De tweede helft van de hint ("8+ tekens met hoofdletters en cijfers gemixt") is klassieke complexiteitseis-advies dat de missie's eigen kernles tegenspreekt (`clearedLesson` op regel 46: "Lengte wint!"). Huidige stand van zaken (NIST/NCSC) is lengte boven verplichte tekenklassen. Deze hint leert de leerling dat 8 tekens met complexiteit een gelijkwaardig alternatief is voor 11+ lengte, wat niet klopt tegen een aanval van 1 miljard pogingen/seconde (8 tekens met de genoemde tekenset haalt de 1-dag-drempel niet betrouwbaar).

2. **`wachtwoord-fortress.ts:88`** — 'Voorbeeldpatroon: "wolk-Gitaar-strand-9!"'
   Oordeel: **onjuist als hint-vorm** (inhoudelijk correct patroon, maar problematisch als hint). Dit is een letterlijk, kant-en-klaar werkend wachtwoord dat de 100-jaar-drempel haalt. Een leerling kan dit exact overtypen i.p.v. zelf een passphrase te bedenken — de opdracht test dan alleen kopiëren, niet toepassen. Herformuleer als patroon zonder een letterlijk bruikbaar voorbeeld (bv. "[willekeurig woord]-[willekeurig woord]-[willekeurig woord]-[cijfer][teken]" zonder concrete woorden die zelf al voldoen).

3. **`wachtwoord-fortress.ts:57-58`** (woordenboek-ronde hints) — klopt: "een heel woord telt voor ±3 tekens" en "méér woorden" is inhoudelijk correct en actueel.

4. **`wachtwoord-fortress.ts:72-73`** (leetspeak-ronde hints) — klopt: leetspeak wordt terecht afgekraakt, "willekeurige woorden die niets met elkaar te maken hebben" is correct advies.

5. **`wachtwoord-fortress.ts:90-91`** (credential-stuffing hints, exclusief het voorbeeldpatroon op 88) — regel 90 ("passphrase van 3-4 willekeurige woorden + cijfer/teken is vrijwel onkraakbaar én te onthouden") klopt.

6. **Takeaways (`wachtwoord-fortress.ts:120-126`)** — allemaal correct en actueel: lengte > complexiteit, woorden/jaartallen zwak, leetspeak nutteloos, uniek per site tegen credential stuffing, passphrase + wachtwoordmanager. Geen verouderd advies zoals "maandelijks wisselen" of "verplichte speciale tekens" — goed.

## Rondedoelen
Drempels (1 dag → 30 dagen → 1 jaar → 100 jaar) lopen logisch op en cumuleren aanvalstypen (brute-force → +dictionary → +leet → +breached). De eindronde (credential stuffing, 100 jaar) sluit thematisch goed af met de kernles "uniek per site". Oplopend en realistisch qua verhaallijn.

## Overlap met wachtwoord-warrior
`wachtwoord-warrior` (puzzle-lab, multiple-choice quiz) behandelt dezelfde concepten (kraaktijd, woordenboekaanvallen, leetspeak-mythe) maar **herkennend**: de leerling kiest het juiste antwoord uit opties. `wachtwoord-fortress` (password-fortress, simulatie) is **toepassend**: de leerling bouwt zelf een wachtwoord en ziet live kraaktijden. Curriculum-volgorde (`curriculum.ts:195-196`) zet warrior vóór fortress, en de introtekst van fortress verwijst expliciet terug ("In Wachtwoord Warrior leerde je hoe aanvallers denken — nu ga je dat zelf toepassen"). Oordeel: **aanvullend, geen dubbeling** — mits de leerling de warrior-quiz al heeft gedaan; qua inhoud is er wel herhaling van dezelfde drie lessen (lengte, woordenboek, leetspeak), maar de vaardigheid (herkennen vs. zelf bouwen) verschilt genoeg om het te rechtvaardigen.

## Verleidt de opdracht tot een echt wachtwoord?
Nee. `introDescription` (regel 12) waarschuwt expliciet: "Let op: gebruik nooit je échte wachtwoord — verzin er hier eentje. Alles blijft in je browser." Geen enkele rondetekst of hint vraagt om een bestaand wachtwoord.

## Taalniveau en tijdsindicatie
Taalniveau past bij 13-14 jaar: korte zinnen, concrete vergelijkingen (1 miljard pogingen/seconde, "kraakcomputer", "trucdoorzier"), geen jargon zonder uitleg. Vier rondes met korte verhaallijn en hints is qua omvang haalbaar binnen een lesuur, al hangt de daadwerkelijke duur af van de (elders gemelde) sterktemeter-bug die de eindronde soms onnodig laat aanslepen.

## Verdict
**fix-eerst** — niet vanwege de engine (apart beoordeeld) maar vanwege twee config-gebreken: de verouderde complexiteitshint (regel 43) en het letterlijk kopieerbare voorbeeldwachtwoord (regel 88). Beide zijn autoFixable tekstwijzigingen. Daarnaast: voeg de missie toe aan `review-status.json` — ontbreekt daar volledig ondanks een bestaand rapport uit juli.
