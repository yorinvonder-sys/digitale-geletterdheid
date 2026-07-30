## Opdracht Live Check: digitale-balans-coach

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=digitale-balans-coach
**Familie:** debate-arena (template-engine) · **Jaar:** 1 · **Bijzonderheid:** debat-missie zonder AI-chat (chat bewust uit)

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start: intro toont doel, bewijs-eis en 5-stappenplan duidelijk; "Start de missie" direct zichtbaar. Flow: las alle 4 stakeholder-perspectieven (Noor, Sam, Mevrouw De Groot, Dr. Hoekstra), koos bewust "Samen afspraken maken", bouwde 2 doordachte argumenten. Feedback: maakte bewust een te kort antwoord (4 tekens) op het tegenargument — systeem blokkeerde terecht met tekens-teller, herstelde daarna met een volwaardig antwoord. Eind: CompletionScreen "Balansexpert", 93/100 punten (93%), score-uitsplitsing per onderdeel, "Wat je hebt geleerd"-lijst met 5 concrete inzichten. Duur: ~35 acties.

**Speedrunner** — Klikte direct door zonder perspectieven te lezen; systeem blokkeerde correct ("Kies jouw positie" pas bereikbaar na 4/4 gelezen). Vulde daarna alle tekstvelden met puur herhaalde letters ("aaaaaaaaaaaaaaaaaaaa") die precies de 20-tekens-grens haalden. Kwam volledig door de missie heen en behaalde exact dezelfde score en badge (93/100, "Balansexpert") als de Modelleerling met serieuze antwoorden. Duur: ~20 acties.

**Chaoot** — Dubbelklikte op knoppen, klikte snel wisselend tussen tabbladen, vulde 250+250 tekens onzin+emoji in de argumentvelden, reloadde drie keer midden in verschillende stappen (na alle-4-gelezen, tijdens argument-2-invullen, tijdens reflectie-gedeeltelijk-ingevuld), gebruikte de in-app terug/vooruit-knoppen. Geen crash, geen puntenverlies, geen dataverlies of dubbeltelling bij enige actie. Rondde af met 93/100. Duur: ~30 acties.

**Vastloper** — Vulde 3x hetzelfde te korte antwoord in op zowel het argumentveld als de tegenargument-reactie. Geen actieve hint of Kees-tip verscheen; enige feedback bleef de statische tekens-teller. Geen permanente dead-end: leerling kan zelfstandig herstellen zodra hij de teller begrijpt. Rondde af met 93/100. Duur: ~25 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Consistente DUCK-stijl (crème achtergrond, felgele accent-knoppen, zwarte tekst). Kees-mascotte (eend-avatar) verschijnt op het eindscherm met een korte felicitatie. Argumentkaarten met lange emoji-onzin-tekst renderen zonder layout-breuk of overflow buiten het kader. Radio-button-positiekeuze en perspectief-tag-selectie zijn visueel duidelijk (gele rand/vulling bij selectie), al is die selectie-status niet gelabeld in de accessibility-tree (zie bevinding #3). Geen kapotte afbeeldingen, geen placeholder-content aangetroffen.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✅ modelleerling/desktop/start.png | ✅ modelleerling/desktop/flow.png, flow-2.png, flow-3-perspectief.png | ✅ modelleerling/desktop/feedback.png | ✅ modelleerling/desktop/eind.png |
| tablet-portrait (810x1080) | ✅ modelleerling/tablet-portrait/start.png | — (content identiek bevestigd via snapshot) | ✅ modelleerling/tablet-portrait/feedback.png | ✅ modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080x810) | ✅ modelleerling/tablet-landscape/start.png | — (content identiek bevestigd via snapshot) | ✅ modelleerling/tablet-landscape/feedback.png | ✅ modelleerling/tablet-landscape/eind.png |
| mobile (390x844) | ✅ modelleerling/mobile/start.png | — (content identiek bevestigd via snapshot) | ✅ modelleerling/mobile/feedback.png | ✅ modelleerling/mobile/eind.png |

Alle 3 alternatieve viewports tonen identieke content-structuur t.o.v. desktop op elk van de 4 sleutelmomenten — geen viewport-specifieke breuk aangetroffen.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** (speedrunner/desktop) — Tekstvelden (argumenten, tegenargument-reactie, reflectie) valideren alleen op minimale tekenlengte (20 tekens), niet op inhoud. Pure herhaalde-letter-input wordt overal geaccepteerd.
   Bewijs: `speedrunner/desktop/flow.png`

2. **WARN** (speedrunner/desktop) — Speedrunner behaalt met volledig zinloze input dezelfde badge "Balansexpert" en score 93/100 (93%) als een leerling die serieus antwoordt — geen kwalitatieve differentiatie in de scoring.
   Bewijs: `speedrunner/desktop/eind.png`

3. **INFO** (modelleerling/desktop) — Geselecteerde perspectief-knop bij argumenten heeft geen aria-pressed/label-indicator in de a11y-snapshot; selectie is alleen visueel (gele rand) waarneembaar, niet aangekondigd voor screenreaders.
   Bewijs: `modelleerling/desktop/flow-3-perspectief.png`

4. **INFO** (modelleerling/desktop) — Reflectievraag 3 vraagt om slechts één concrete afspraak, terwijl het missiedoel-bewijs expliciet "minstens twee haalbare afspraken" vereist — lichte mismatch tussen doel-bewijs en de daadwerkelijke reflectie-vraagstelling.
   Bewijs: `modelleerling/desktop/feedback.png`

5. **WARN** (vastloper/desktop) — Bij 3x herhaald te kort antwoord verschijnt geen actieve hint/hulp (geen Kees-tip, geen voorbeeldzin); enige feedback is de statische tekens-teller. Geen permanente dead-end, maar ook geen inhoudelijke coaching bij herhaald vastlopen.
   Bewijs: `vastloper/desktop/flow-vastloop.png`

6. **INFO** (chaoot/desktop) — Positief: missie bleek zeer robuust tegen chaotisch gedrag — 500 tekens onzin+emoji, 3x reload midden in verschillende stappen, dubbelklikken en terug-en-vooruit navigatie veroorzaakten geen crash, corruptie, dubbeltelling of dataverlies.
   Bewijs: `chaoot/desktop/eind.png`

### Nog onzeker
- Of de score-formule voor "Argumenten gebouwd" (33/50 bij 2 van max. 3 argumenten) leerlingen duidelijk maakt dat een derde argument extra punten oplevert — niet expliciet getest of dit voor leerlingen zichtbaar/begrijpelijk is.
- Of docenten via een docentweergave zien welke argumenten zinloos waren (Speedrunner-scenario) — buiten scope van deze leerling-only audit.
