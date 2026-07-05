## Opdracht Live Check: deepfake-detector

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=deepfake-detector

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start: intro-scherm laadt correct met doel, bewijs-uitleg en duidelijke "Start de missie"-knop; getest op alle 4 viewports, overal goed leesbaar. Flow: speelde alle 9 challenges (3 niveaus: Beginner/Gevorderd/Expert), gebruikte hint op challenge 1, maakte bewust 1 fout op challenge 2 (nepnieuws-onderscheid) — feedback en "Denk verder"-vragen zijn inhoudelijk sterk. Feedback: tussenniveau-schermen ("Beginner Voltooid!", "Gevorderd Voltooid!") tonen score/streak-samenvatting + reflectievraag, consistent. Eind: "MISSIE VOLTOOID!" met 8/9 correct, 1050 punten, leerdoelen-lijst die aansluit bij de challenges. Duur: ~35 acties.

**Speedrunner** — Start: direct doorgeklikt zonder lezen. Flow: altijd eerste optie ("ECHT") geklikt op alle 9 challenges, geen hints gebruikt, geen enkele crash of skip-mogelijkheid gevonden — elke challenge moet individueel beantwoord worden. Feedback: correcte/foute feedback toont normaal. Eind: rondde de missie volledig af met slechts 3/9 correct (300 punten) en kreeg **hetzelfde** "MISSIE VOLTOOID!"-scherm met identieke felicitatietekst als de Modelleerling die 8/9 haalde — zie bevinding #2. Duur: ~20 acties.

**Chaoot** — Start: dubbelklik op "Start de missie" veroorzaakte geen dubbele navigatie. Flow: dubbelklikken op antwoord-/Volgende-knoppen, snelle conflicterende kliks op beide antwoordopties (tweede klik landde nooit — knoppen worden direct vervangen door feedback), `back`-navigatie ging naar `about:blank` maar hernavigeren naar de missie-URL herstelde de voortgang correct (localStorage-persistentie intact). **Kritieke ontdekking**: reload direct ná een correct antwoord (vóór "Volgende") reset de feedback-UI naar de onbeantwoorde vraag terwijl de challenge-index gelijk blijft — opnieuw antwoorden verhoogde de score/streak nogmaals voor dezelfde challenge (zie bevinding #3). Eind: rondde af met 9/9 "correct" en 1150 punten — hoger dan het eerlijke maximum (1050), wat de exploit bevestigt. Geen enkele console- of netwerkfout. Duur: ~40 acties.

**Vastloper** — Start: normaal. Flow: gaf bewust 2× hetzelfde foute antwoord op challenge 1 (elke challenge staat structureel maar 1 poging toe — reload was nodig om te herproberen), gebruikte daarna de hint die inhoudelijk correct naar het juiste antwoord leidde. Testte ook de "Vraag hulp"/AI-assistent-knop tijdens het vastzitten: **opende een AI Coach-chatvenster met volledig misplaatste content** (Week 1-onboarding over iPad-apps, "Game Challenge Hulp" met suggesties over "blocks slepen" — hoort bij een andere missie, niet bij deze deepfake-quiz; zie bevinding #4). De widget bleef bovendien hangen over meerdere challenges heen. Feedback: na de hint werd de challenge alsnog correct beantwoord en verder gespeeld. Eind: rondde eerlijk af met 8/9, 1050 punten — geen permanent vastlopen mogelijk. Duur: ~30 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
- Geen logo's of illustraties in deze missie; layout is een consistente witte kaart op een lichte achtergrond met duidelijke typografie.
- **Geen enkele challenge toont een echte afbeelding** — alle "Afbeelding"-gelabelde stappen (Foto Analyse, Kunstwerk, Straatfoto, Landschapsfoto — 4 van de 9 challenges) tonen alleen een camera-placeholder-icoon met een tekstuele beschrijving. Voor een missie die "deepfake-signalen in beeld" claimt te leren herkennen, is dit een fundamentele mismatch tussen belofte en uitvoering (bevinding #1).
- Responsief gedrag is sterk op alle 4 viewports (1440x900, 810x1080, 1080x810, 390x844): geen overlap, geen afgesneden tekst, knoppen blijven goed bereikbaar en leesbaar, ook op mobile (390x844).
- De AI Coach-widget (rechtsonder) overlapt gedeeltelijk met de content op desktop-breedte maar blokkeert de antwoordknoppen niet.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✅ modelleerling/desktop/start.png | ✅ modelleerling/desktop/flow.png | ✅ modelleerling/desktop/feedback.png | ✅ modelleerling/desktop/eind.png |
| tablet-portrait (810x1080) | ✅ modelleerling/tablet-portrait/start.png | ✅ modelleerling/tablet-portrait/flow.png | — (niet apart vastgelegd, geen viewport-issues waargenomen) | ✅ modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080x810) | ✅ modelleerling/tablet-landscape/start.png | ✅ modelleerling/tablet-landscape/flow.png | — | ✅ modelleerling/tablet-landscape/eind.png |
| mobile (390x844) | ✅ modelleerling/mobile/start.png | ✅ modelleerling/mobile/flow.png | — | ✅ modelleerling/mobile/eind.png |

Extra bewijs buiten de matrix: `vastloper/desktop/flow.png` (misplaatste AI-assistent-content), `vastloper/desktop/feedback.png`, `vastloper/desktop/eind.png`.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — Foto Analyse-achtige challenges (4 van 9) tonen geen echte afbeelding, alleen tekstbeschrijving + camera-placeholder-icoon. Kernvaardigheid "visuele deepfake-signalen herkennen" wordt hierdoor niet echt geoefend.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/deepfake-detector/modelleerling/desktop/flow.png`

2. **WARN** — Geen minimale score-drempel voor missie-voltooiing: Speedrunner haalde 3/9 (300 punten) en kreeg identiek "MISSIE VOLTOOID!"-scherm met dezelfde felicitatietekst als Modelleerling (8/9, 1050 punten).
   Bewijs: a11y-snapshot (geen screenshot gemaakt, tekstueel bevestigd)

3. **BLOCK** — Reload direct na een correct antwoord (vóór "Volgende") staat toe dat dezelfde challenge opnieuw beantwoord wordt, met score/streak-ophoging (bevestigd: 100→200 punten) zonder dat de voortgangsteller meetelt. Chaoot behaalde zo 1150 punten, boven het eerlijke maximum van 1050.
   Bewijs: a11y-snapshot-sequentie (geen screenshot; reproduceerbaar via reload-actie)

4. **BLOCK** — "Vraag hulp"/AI-assistent-knop opent een chatvenster met content die bij een andere missie hoort (iPad-onboarding, "Game Challenge Hulp" over blocks slepen) — volledig irrelevant en misleidend voor een leerling die bij déze quiz vastzit. Widget blijft bovendien hangen over meerdere challenges heen zonder zichtbare sluitknop-functionaliteit.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/deepfake-detector/vastloper/desktop/flow.png`

5. **INFO** — Modelleerling rondt eerlijk af met sterke, inhoudelijk correcte feedback en een goed aansluitende leerdoelen-samenvatting.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/deepfake-detector/modelleerling/desktop/eind.png`

6. **INFO** — Vastloper-scenario: elke challenge staat structureel maar 1 poging toe (geen ingebouwde "probeer opnieuw"-knop op fout antwoord), maar de hint-tekst is inhoudelijk sterk en leidt echt naar het juiste antwoord. Geen permanent vastlopen mogelijk.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/deepfake-detector/vastloper/desktop/eind.png`

### Nog onzeker
- Of de ontbrekende score-drempel (bevinding #2) een bewuste ontwerpkeuze is (elke poging = leermoment, ongeacht score) of een gemist requirement — didactisch is dit bespreekbaar, maar de identieke felicitatietekst bij 3/9 voelt inhoudelijk onwaar ("Je bent nu een echte Deepfake Detective!").
- Of de reload-score-exploit (bevinding #3) praktisch relevant is voor echte leerlingen die niet doelbewust chaos-testen, of vooral een edge-case is die alleen bij opzettelijk reload-misbruik optreedt.
- Of de misplaatste AI-assistent-content (bevinding #4) een globale coach-widget is die voor ALLE missies dezelfde onboarding-tekst toont (dus een platform-brede configuratiefout), of specifiek aan deze missie hangt — dit kon niet geverifieerd worden zonder broncode te lezen (verboden binnen dit draaiboek).
