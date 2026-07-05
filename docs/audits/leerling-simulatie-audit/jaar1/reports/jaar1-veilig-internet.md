## Opdracht Live Check: veilig-internet

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=veilig-internet

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (~35 acties, ~5 min): Verse start toont volledig introscherm (titel, uitleg, leerdoel, 4 stappen, startknop, attributie). Speelt serieus mee, maakt bewust 1 fout bij fase 2 (2FA-uitspraak). Alle 4 fases correct doorlopen met heldere per-item-feedback. Eindscore 91/100, badge "Internet Wachter", volledige "Wat je hebt geleerd"-lijst met 5 concrete leerpunten. Viewport-matrix op start én eind: alle content blijft volledig zichtbaar op 810×1080, 1080×810 en 390×844 — geen weggevallen elementen.

**Speedrunner** (~25 acties, ~3 min): Klikt zonder te lezen, kiest "eerste opties" zonder nadenken. Systeem beloont dit NIET met een gratis hoge score: eindscore 73/100 met aangepaste, lagere badge "Slimme Spotter" (t.o.v. 91/100 "Internet Wachter" bij serieus spelen). Missie accepteert geen zinloze input zonder consequentie — goed ontworpen tegen skip-gedrag.

**Chaoot** (~40 acties, ~8 min): Dubbelklikken, conflicterende kliks op dezelfde items, reload midden in fase 1 én fase 4, browser-back. Persistentie is robuust: reload behoudt fase, score én alle selecties exact; "Opnieuw beginnen" in fase 4 reset volledig naar startstaat. Geen dubbele scoretoevoeging bij dubbelklik op submit-knoppen. Browser-back navigeert naar `about:blank` (geen client-side routing-historie binnen de missie — geen bug, wel een observatie). Eindscore 91/100, identiek aan Modelleerling — geen corruptie ondanks alle stress-input.

**Vastloper** (~45 acties, ~10 min): Kiest bewust foute combinaties op alle 4 fases (score dalend van 11/25 tot 5/25). Geen hint-knop of vooraf-hulp tijdens het invullen; feedback komt uitsluitend ná "Controleer", en geen enkele fase biedt een retry-optie — bij een fout ga je verplicht door. Fase 4 geeft wel sterke after-the-fact-hints (toont juiste positie per stap + concrete tip). Bij een structureel lage eindscore (35/100) blokkeert de missie niet: badge wordt "Blijf Oefenen" met een expliciet aanmoedigende, niet-beschamende boodschap ("Elke poging maakt je sterker. Probeer 'm gerust nog eens.") — de herkans-mogelijkheid zit op missie-niveau, niet per fase.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Consistente kaart-gebaseerde layout met emoji-iconen per item, duidelijke voortgangsbalk (4 segmenten) en een puntenteller rechtsboven. Feedback gebruikt kleurcodering (rode rand + ✕ voor fout, neutrale rand + ✓ voor correct) — zichtbaar in screenshots maar niet in de a11y-snapshot (geen tekstlabel), wat bij eerste lezing tot een verkeerde interpretatie leidde totdat een screenshot dit verduidelijkte. Geen kapotte afbeeldingen, geen lege states. Kees-mascotte aanwezig op start- en eindscherm.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling | ✅ modelleerling/chaoot/vastloper | ✅ modelleerling/chaoot/vastloper | ✅ alle 4 profielen |
| tablet-portrait (810×1080) | ✅ modelleerling | — | — | ✅ modelleerling |
| tablet-landscape (1080×810) | ✅ modelleerling | — | — | ✅ modelleerling |
| mobile (390×844) | ✅ modelleerling | — | — | ✅ modelleerling |

Modelleerling deed de volledige viewport-matrix op start én eind (sleutelmomenten); overige profielen op desktop conform draaiboek.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** (playthrough, modelleerling) — Fase 1 zegt "minimaal 4 items" maar scoring verwacht kennelijk 5 (alle verdachte signalen zijn er 5, waaronder "gratis prijs zonder reden"); een leerling die precies 4 correcte items kiest krijgt een "gemist!"-label en 20/25 i.p.v. de volle score. Fase 3 heeft dit probleem niet (daar zijn precies 4 privé-items, tekst en scoring komen overeen). Inconsistentie tussen fase 1 en fase 3 in hoe "minimaal N" zich verhoudt tot het werkelijke aantal juiste antwoorden.
   Bewijs: `evidence/veilig-internet/modelleerling/desktop/flow.png`

2. **WARN** (technical, chaoot) — Na een dubbelklik op "Start de missie" staat bij aankomst op fase 1 al 1 item (vreemde fouten) geselecteerd zonder dat daarop geklikt is. Mogelijk een ghost-click waarbij het tweede klik-event van de dubbelklik doorlekt naar de net-gerenderde fase-1-pagina op dezelfde schermpositie. Geen crash of scoreverstoring, maar een leerling die snel dubbelklikt op de startknop kan met een onbedoelde voor-selectie beginnen.
   Bewijs: `evidence/veilig-internet/chaoot/desktop/flow.png`

3. **INFO** (playthrough, vastloper) — Geen hint-knop of vooraf-hulp tijdens het invullen van een fase; alle feedback komt pas ná "Controleer". Geen technisch probleem, wel een didactische constatering: een leerling die er niet uitkomt heeft geen ingebouwd hulpmiddel behalve doorlezen van de vraagtekst zelf.
   Bewijs: `evidence/veilig-internet/vastloper/desktop/flow-2.png`

4. **WARN** (playthrough, vastloper) — Geen enkele van de 4 fases biedt een "opnieuw proberen"-optie ná controle; na "Controleer" ga je verplicht door naar de volgende fase of het eindresultaat. Fase 4 geeft weliswaar sterke hints (juiste positie per stap + concrete tip), maar de leerling kan die kennis niet direct toepassen op dezelfde vraag. De herkans-mogelijkheid zit alleen op missie-niveau (hele missie opnieuw spelen), niet per fase.
   Bewijs: `evidence/veilig-internet/vastloper/desktop/feedback.png`

### Nog onzeker
- Of "minimaal 4" in fase 1 een bewuste ontwerpkeuze is (leerling hoeft niet alles te vinden om door te gaan, maar mist dan wel punten) of een tekst/scoring-mismatch die aangepast zou moeten worden. De auditor kan dit niet uit browsergedrag alleen afleiden — vereist een blik op de bedoelde didactische intentie.
- Of het ontbreken van per-fase-retry een bewuste ontwerpkeuze is (voortgang blijft altijd lineair, herkansen kan alleen via missie-herstart) of een gemiste kans om directe foutcorrectie te ondersteunen.
