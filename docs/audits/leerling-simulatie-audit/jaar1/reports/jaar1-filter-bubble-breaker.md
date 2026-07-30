## Opdracht Live Check: filter-bubble-breaker

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=filter-bubble-breaker

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start: heldere intro met doel, bewijs-criterium en twee profielvoorbeelden (Daan/Priya); Kees-mascotte geeft rust ("Geen stress"). Flow: feed-vergelijking met werkende toggle (Beide/Daan/Priya), analyse-tekstveld met placeholder-voorbeeld. Feedback: 5 quizvragen, elke vraag toont na antwoord een inhoudelijk correcte uitleg + het juiste antwoord gemarkeerd. Eind: badge "Bubble Breaker" 🫧, score 4/5 (80/100, met 1 bewuste fout), 3 concrete tips, reflectievraag verplicht vóór afronding — klik op "Missie Voltooid!" geeft daarna geen zichtbare reactie (zie BLOCK #1). Duur: ~9 min, ~35 acties.

**Speedrunner** — Sloeg de feed-vergelijking over zonder te kijken, klikte direct door naar de analyse-stap. Probeerde zinloze input ("."): correct geblokkeerd (knop disabled bij 1 teken). Langere zinloze input ("ja ja ja..." herhaald, 29 tekens) werd wél geaccepteerd (zie WARN #1). Koos op alle 5 vragen consistent optie A zonder te lezen → 0/5, badge veranderde naar milder "🌱 Bubbel Ontdekker" (0/100) — goed gedifferentieerd systeem. Probeerde de disabled "Missie Voltooid!"-knop te forceren: correct geblokkeerd. Zelfde eindsignaal-bug als Modelleerling. Duur: ~3 min, ~15 acties.

**Chaoot** — Dubbelklik op "Start de missie" gaf geen dubbele navigatie. Snelle conflicterende kliks op de feed-toggle-knoppen: eindstate correct (laatste klik wint), geen corruptie. Reload midden in de feed-stap: stap-voortgang bleef behouden (terug naar "Vergelijk de feeds", niet naar start) — positief. ~500 tekens onzin + emoji + `<script>`-payload in het analyseveld: veilig als platte tekst opgeslagen, geen XSS-uitvoering, geen JS-crash. **Reload direct na het beantwoorden van vraag 1 zette de vraag terug naar onbeantwoord terwijl de score bleef staan; hetzelfde antwoord opnieuw geven verhoogde de score nogmaals (20→40 pts voor dezelfde vraag) — score-exploit (zie BLOCK #2).** Eindscherm toonde daardoor een opgedreven "5/5 vragen goed, 100/100" i.p.v. het echte 4/5. Duur: ~7 min, ~30 acties.

**Vastloper** — Gaf op alle 5 vragen bewust een fout antwoord om te testen of je kunt vastlopen. Elke vraag staat maar 1 poging toe (geen retry-knop binnen de vraag zelf) maar toont daarna altijd een correcte, behulpzame uitleg met het juiste antwoord gemarkeerd — goed didactisch ontwerp. Geen extra hint/hulp-mechanisme verscheen bij herhaald falen (zie INFO #1). **Belangrijk positief resultaat: met 0/5 correct bleef het eindscherm gewoon bereikbaar** (milde badge "Bubbel Ontdekker", 0/100), reflectie kon ingevuld worden, geen permanente vastloop. Zelfde eindsignaal-bug als de andere 3 profielen. Duur: ~6 min, ~25 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Geen logo's of afbeeldingen in deze missie (tekst- en emoji-gebaseerd). Layout, badges, kaarten en knoppen renderden op alle 4 viewports consistent zonder afkapping, overlap of gebroken tekst. De two-column feed-vergelijking blijft op mobiel (390px) verrassend goed leesbaar — geen horizontale scroll, badges/tags niet afgekapt. Geen visuele blockers gevonden.

### Browserbewijs (tabel 4 viewports × 4 states)
Alleen voor Modelleerling verzameld (viewport-matrix-eis).

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✅ | ✅ | ✅ | ✅ (+ eind-2 na klik) |
| tablet-portrait (810x1080) | ✅ | ✅ | ✅ | ✅ |
| tablet-landscape (1080x810) | ✅ | ✅ | ✅ | ✅ |
| mobile (390x844) | ✅ | ✅ | ✅ | ✅ |

Alle 16 screenshots + snapshots renderden zonder structurele afwijkingen; geen viewport-specifieke bugs gevonden.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — Klik op "Missie Voltooid!" geeft geen enkele zichtbare reactie: geen navigatie, modal, toast of statusverandering. Reproduceerbaar in alle 4 profielen (4/4), inclusief bij herhaalde klik. Geen console- of network-errors — stille no-op. De leerling krijgt geen bevestiging dat de missie is afgerond.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/filter-bubble-breaker/modelleerling/desktop/eind-2.png`

2. **BLOCK** — Score-exploit via reload: reload direct na het beantwoorden van een quizvraag zet de vraag terug naar onbeantwoord (alle 4 opties weer klikbaar, geen feedback zichtbaar) maar de score-teller/"vragen goed"-teller blijft op de al-behaalde stand staan. Opnieuw hetzelfde antwoord geven verhoogt de score nogmaals voor dezelfde vraag (bewezen: 20→40 pts op vraag 1). Dit tastte het eindresultaat aan: Chaoot behaalde zo een vals "5/5, 100/100" terwijl er feitelijk 1 vraag fout beantwoord was.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/filter-bubble-breaker/chaoot/desktop/feedback.png`

3. **WARN** — Het analyse-tekstveld ("Zoek 1 onderwerp dat Daan zou missen...") valideert alleen op tekenlengte, niet op inhoud: 1 teken (".") wordt geblokkeerd, maar 29 tekens zinloze herhaling ("ja ja ja ja ja ja ja ja ja ja") wordt geaccepteerd en ontgrendelt "Start de vragen". De missie claimt een inhoudelijke analyse te vragen maar forceert die niet af.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/filter-bubble-breaker/speedrunner/desktop/flow.png`

4. **INFO** — Quizvragen staan maar 1 poging per vraag toe; bij herhaald fout antwoorden (5x achtereen getest) verschijnt geen extra hint- of hulpmechanisme, wel steeds een inhoudelijk correcte per-vraag-uitleg met het juiste antwoord gemarkeerd. Positief tegenwicht: 0/5 score leidt niet tot een permanente vastloop — het eindscherm en de afronding blijven altijd bereikbaar, met een passend mildere badge ("Bubbel Ontdekker" i.p.v. "Bubble Breaker").
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/filter-bubble-breaker/vastloper/desktop/eind.png`

### Nog onzeker
- Of "Missie Voltooid!" in de echte (niet-dev-preview) leerlingomgeving wél een navigatie/opslag-actie triggert die in dev-preview bewust is uitgeschakeld, of dat dit een algemene bug is die ook in productie optreedt — kon niet worden vastgesteld zonder broncode te lezen (verboden binnen deze audit-scope).
- Of de score-exploit (bevinding 2) ook zonder reload repliceerbaar is via andere routes (bijv. snel wisselen tussen tabbladen), en of de score ergens server-side wordt gevalideerd/opgeslagen los van de client-state.
