## Opdracht Live Check: ai-spiegel

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=ai-spiegel

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (verse eerste indruk, serieus gespeeld, alle 9 vragen correct)
- Start: helder introscherm — titel "De AI Spiegel", doel, bewijs-criterium, 3 aangekondigde sims, mascotte Kees met geruststellende tekst. ~20 min / Makkelijk / +50 XP correct getoond.
- Flow: 3 simulaties na elkaar (advertentieprofiel met sliders, iPad-instellingen met sliders, filterbubbel met toggle-knoppen). Sliders reageren live: kijktijd 0→2 verhoogde profielnauwkeurigheid van 15% naar 45% met bijpassend label ("Heel weinig data" → "Gemiddeld profiel"). Elke sim heeft 3 meerkeuzevragen die allemaal beantwoord moeten worden voor "Volgende simulatie" actief wordt.
- Feedback: alle 9 vragen correct beantwoord; elke feedbacktekst legt inhoudelijk uit waaróm het antwoord goed is (geen generiek "Goed!").
- Eind: CompletionScreen met 100/100 punten (100%), badge "Privacy Expert", score correct opgeteld per sim (30/30 + 40/40 + 30/30), 5 concrete "Wat je hebt geleerd"-punten.
- Duur: ~9 minuten, ~45 acties.

**Speedrunner** (niet lezen, eerste optie, snel klikken)
- Klikte overal de eerste zichtbare optie zonder sliders aan te passen. Dit gaf een mix van toevallig-correcte en foute antwoorden (2/9 correct).
- Kernvraag beantwoord: **nee, de missie beloont geen zinloos snel-klikken.** Eindscore 20/100 (20%) met badge "Aan het leren" i.p.v. "Privacy Expert" — expliciet ander (bemoedigend, niet demotiverend) einde dan bij de Modelleerling.
- Duur: ~2 minuten, ~20 acties.

**Chaoot** (dubbelklikken, snelle conflicterende kliks, reload, back-en-vooruit)
- Dubbelklikken op Start/Controleer antwoord/Volgende simulatie: geen dubbele puntentoekenning, geen crash, geen dubbele stap-overslag.
- Reload midden in een beantwoorde vraag: volledige staat (sliderwaarden, disabled-knoppen, feedbacktekst) bleef behouden.
- Browser-back naar about:blank + hernavigatie: voortgang (Sim 2/3) correct hersteld.
- In-app "Vorige"-knop heen-en-weer: staat blijft consistent.
- Snel wisselende selecties vóór "Controleer antwoord": laatste klik werd correct geregistreerd, geen race condition zichtbaar.
- Eind: 15/100 (15%), nette afronding zonder corruptie.
- Duur: ~5 minuten, ~35 acties.

**Vastloper** (bewust alle 9 vragen fout, op zoek naar een "opnieuw proberen"-pad)
- Kernbevinding: **elke vraag is single-attempt.** Na de eerste klik op "Controleer antwoord" wordt de vraag direct disabled en toont het systeem meteen het juiste antwoord (vinkje) naast het foutief gekozen antwoord (kruisje). Een leerling kan dus nooit letterlijk 3× hetzelfde foute antwoord op dezelfde vraag proberen — er is domweg geen retry-knop per vraag.
- Kernvraag beantwoord: **de feedback helpt echt** — elke foutmelding legt inhoudelijk uit waarom het antwoord fout is en wat het juiste principe is (geen "Fout, probeer opnieuw" zonder uitleg).
- Kernvraag beantwoord: **geen permanent-vastloop-risico.** Met 0/9 correct (0%) rondt de missie gewoon af, met een bemoedigende badge "Aan het leren" en de tekst "Elke poging maakt je sterker. Probeer 'm gerust nog eens." — geen blokkade, geen "mislukt"-boodschap.
- Nevenobservatie: de "Wat je hebt geleerd"-lijst in het CompletionScreen is bij 0% en 100% identiek — niet adaptief aan gemaakte fouten (zie Nog onzeker).
- Duur: ~3 minuten, ~24 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Geen logo's/afbeeldingen buiten emoji-iconen (🔬, 🧪) en de Kees-mascotte-avatar. Layout is consistent en rustig: instellingenkaart links, live-resultaatkaart rechts, vragen daaronder. Voortgangsbalk bovenaan (Simulatie X/3) en puntenteller rechtsboven werken correct op alle geteste viewports.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | OK | OK | OK | OK — 100/100, badge Privacy Expert |
| tablet-portrait (810×1080) | OK, geen overlap | OK | OK | OK |
| tablet-landscape (1080×810) | OK | OK | OK | OK |
| mobile (390×844) | OK, goed leesbaar | OK, geen overlap | OK | OK, badge/score/leerpunten netjes gestapeld |

Alle 4 viewports getest door Modelleerling op de 4 sleutelmomenten; geen visuele blockers op enige breedte.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Elke vraag is single-attempt zonder retry-mogelijkheid: zodra je op "Controleer antwoord" klikt, wordt de vraag permanent disabled en verschijnt direct het juiste antwoord. Dit is een didactische ontwerpkeuze (geen technisch defect) maar wijkt af van een klassiek "probeer tot je het goed hebt"-patroon — vermeldenswaardig voor het ontwerpteam als bewuste keuze-bevestiging. Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/ai-spiegel/vastloper/desktop/flow-vraag1-fout.png`
2. **INFO** — De 5 "Wat je hebt geleerd"-punten in het CompletionScreen zijn statisch en identiek ongeacht score (geverifieerd bij 0%, 15%, 20%, 100%) — geen adaptieve feedback op basis van gemaakte fouten. Mogelijk bewuste keuze (de punten zijn de kernleerdoelen van de missie), maar een gemiste kans voor gerichte remediëring bij lage scores.
3. **INFO** — "Terug"-knop op elke sim-pagina (linksboven) doet niets bij een klik — geen navigatie, geen destructief effect. Onduidelijk wat de intentie van deze knop is (mogelijk bedoeld voor terug-naar-introscherm maar niet functioneel in dev-preview), maar veroorzaakt geen schade.
4. **INFO** — Zowel correcte als foute score-uitkomsten (0%, 15%, 20%, 100%) resulteren in een nette, bemoedigende afronding met passende badge-naam ("Privacy Expert" bij 100%, "Aan het leren" bij lagere scores) — sterk punt voor motivatie zonder valse positieve score-suggestie.
5. **INFO** — Persistentie is opvallend robuust: reload, browser-back+hernavigatie en in-app vorige/volgende behouden allemaal correct de sliderwaarden en beantwoorde-vraagstaat, ook na chaotische interactie.

Geen BLOCK-bevindingen. Console en network waren schoon (geen errors) bij alle 4 profielen — alleen dev-only web-vitals/analytics-logs, geen extra netwerkcalls.

### Nog onzeker
- Of de statische "Wat je hebt geleerd"-lijst een bewuste ontwerpkeuze is (missie-brede kernleerdoelen tonen ongeacht score) of een gemiste kans voor adaptieve feedback — dit vereist een productbeslissing, geen technische fix.
- De functie van de "Terug"-knop op sim-pagina's is niet duidelijk vanuit leerling-perspectief; mogelijk alleen relevant buiten de dev-preview-context (bijv. terug naar missie-overzicht in de echte leerling-omgeving).
