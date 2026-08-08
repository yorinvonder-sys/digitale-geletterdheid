# Review: code-review-2 (afsluitende review, leerjaar 2 periode 2)

Datum: 2026-08-07. Engine-bevindingen (ReviewArena.tsx, DragSort.tsx, Categorize.tsx) zijn elders vastgesteld en hier niet herhaald, behalve als anker voor een config-specifieke bevinding.

## 1. Periodedekking (blocking, didactiek)

Periode 2 bevat 11 missies: `algorithm-architect`, `web-developer`, `network-navigator`, `app-prototyper`, `bug-hunter`, `automation-engineer`, `code-reviewer`, `privacy-by-design`, `wachtwoord-warrior`, `wachtwoord-fortress`, `access-control-engineer` (src/config/curriculum.ts:186-201).

Getoetst door code-review-2: algoritmes (match-pairs), webdev HTML/CSS/JS (drag-sort + categorize), debuggen (match-pairs + rapid-fire vraag 7), automatisering (rapid-fire vraag 6), responsive design (match-pairs + rapid-fire followUp), API-begrip (drag-sort + rapid-fire vraag 3), UX-begrip (drag-sort + rapid-fire vraag 4).

Volledig ontbrekend: **netwerken** (network-navigator), **privacy-by-design**, en de hele beveiligingscluster **wachtwoord-warrior, wachtwoord-fortress, access-control-engineer** — 4 van de 11 missies (network-navigator, privacy-by-design, wachtwoord-warrior/-fortress, access-control-engineer = 5 missies) hebben geen enkele vraag, categorie-item of paar dat hun kernbegrip raakt. Geen enkel item verwijst naar wachtwoorden, netwerken, IP/DNS, toegangsrechten of privacy-by-design-principes.

Voor een missie die zich als afsluiting van de hele periode presenteert ("Je hebt algoritmes, webdevelopment, debugging en automatisering geleerd" — code-review-2.ts:9) is dit een feitelijk onjuiste dekkingsclaim: de intro noemt zelf al niet de securitycluster, en de config bevestigt dat die cluster (bijna de helft van de missies) buiten de eindtoets valt.

## 2. Sorteerronde — niet eenduidig (blocking, tech)

`code-review-2.ts:67-73`: volgorde HTML(0) → CSS(1) → JS(2) → API(3) → UX(4), met opdracht "van meest fundamentele laag (boven) naar meest visuele/interactieve laag (onder)".

HTML→CSS→JS is een gangbare, verdedigbare progressie (structuur → opmaak → gedrag). Maar API-koppelingen en UX-design zijn geen "lagen" in dezelfde technische stapeling — het zijn cross-cutting concerns. Een leerling kan evengoed verdedigen dat UX-design (het ontwerp van de gebruikerservaring) vóór de API-koppeling hoort, omdat je eerst bedenkt hoe iets moet aanvoelen en pas daarna de databron erbij haalt — of dat UX helemaal geen "meer visuele/interactieve laag" is dan CSS, aangezien UX evengoed over content en structuur (HTML) gaat. Er is hier geen technisch dwingende volgorde zoals bij HTML/CSS/JS; dit is dus geen eenduidig scorebare ronde en kan een leerling met een verdedigbaar antwoord onterecht punten kosten.

## 3. Categorize-ronde: 3 categorieën, onleesbare derde

`code-review-2.ts:122`: `categories: ['HTML', 'CSS', 'JavaScript']` — drie categorieën. Volgens de vaststaande enginebevinding krijgt de derde categorie (index 2) geel als tekstkleur met contrast 1.00:1 (Categorize.tsx:141). Dat is hier **"JavaScript"**. Alle 6 code-items die naar JavaScript moeten worden gesleept zijn dus onleesbaar tijdens het spelen van deze specifieke missie-config.

## 4. Inhoudscorrectheid

Alle overige antwoorden zijn nagerekend en kloppen:
- Categorize-items (code-review-2.ts:124-131): alle 8 fragmenten correct toegewezen aan HTML/CSS/JavaScript.
- Match-pairs (code-review-2.ts:82-102): alle 5 koppelingen correct en ondubbelzinnig (1-op-1, geen overlappende definities).
- Rapid-fire (code-review-2.ts:154-193): alle 8 waar/onwaar-antwoorden correct (while-loop, CSS vs HTML, API, UX, variabelen, automatisering, bug-zichtbaarheid, computational thinking).
- Beide followUp-vragen (categorize: JavaScript/event listener, rapid-fire: responsive design) hebben een correcte `correctIndex` en een kloppende uitleg.

Geen inhoudelijke fouten buiten het sorteerronde-ambiguïteitsprobleem (punt 2).

## 5. Taalniveau en tijdsdruk

Taalniveau past bij 13-14 jaar (klas 2); de drie vaktermen (API, UX, responsive design) worden in de intro uitgelegd vóór ze in rondes terugkomen. Rapid-fire: 8 vragen × 12s = 96s aan puur beslistijd, vergelijkbaar met andere review-arena's in dit project — haalbaar binnen de gebruikelijke tijdsclaim.

## Conclusie

Blocking voor een afsluitende periode-review: (a) securitycluster (netwerken, privacy, wachtwoorden, toegangscontrole — 5 van 11 missies) volledig afwezig, (b) sorteerronde niet eenduidig scorebaar, (c) categorize-categorie "JavaScript" onleesbaar (contrast, gedeeld met vaststaande enginebug). Verdict: **fix-eerst** — geen nieuwe architectuur nodig, wel: dekking uitbreiden of aanpassen, sorteeritems herzien naar een ondubbelzinnige volgorde (bv. alleen HTML/CSS/JS, of API/UX als aparte niet-sorteerbare categorie), en de categorize-kleur repareren (engine-fix, al elders vastgesteld).
