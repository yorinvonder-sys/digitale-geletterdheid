# Review: web-developer (2026-08-07)

## Config-analyse (aanvullend op vaststaande enginebevindingen)

### 1. Puntenverdeling per stap
Bron: `web-developer.ts:28-90` + `BuilderCanvas.tsx:88,116` (stepBudget = maxScore, geen bonusvragen in deze config → 100/4 = 25 punten per stap, alles-of-niets: `checklistComplete && textComplete`).

| Stap | id | textPrompt | minTextLength (config) | Punten |
|---|---|---|---|---|
| 1 | html-structuur | ja (web-developer.ts:42) | niet gezet → default 40 | 25 |
| 2 | css-layout | ja (web-developer.ts:58) | niet gezet → default 40 | 25 |
| 3 | javascript | ja (web-developer.ts:73) | niet gezet → default 40 | 25 |
| 4 | testen | ja (web-developer.ts:88) | niet gezet → default 40 | 25 |

Alle vier stappen hébben een `textPrompt`, dus geen enkele stap is 100% pure zelfrapportage zoals de vaststaande enginebevinding "stap zonder textPrompt" beschrijft. Maar omdat geen enkele stap `minTextLength` overschrijft, geldt overal de default van 40 tekens (BuilderCanvas.tsx:98). Gecombineerd met de vaststaande enginebug ("alleen tekenlengte, geen inhoud") betekent dit dat een leerling voor élke stap met 40 lukrake tekens ("aaaa...a") + alle checkboxen aanvinken de volle 25 punten haalt — voor code-inhoud (HTML/CSS/JS) is 40 tekens bovendien triviaal te halen zonder ook maar iets werkends te schrijven (bijv. `<div>` is al genoeg tekens met wat opvulling).

### 2. Punten zonder bewijs
Omdat de tekenlengte-check geen inhoud verifieert en de checklist zelf-afgevinkt is zonder enige koppeling aan de daadwerkelijke tekst, rust in de praktijk de volle **100 van de 100 punten** (100%) op zelfrapportage + een triviaal te omzeilen lengte-check. Dit is geen configfout op zich (de default zit in de motor), maar deze missie voegt geen enkele `minTextLength`-verhoging of alternatieve validatie toe om het te verzachten — voor een missie die specifiek "code schrijven" claimt (HTML/CSS/JS), is 40 tekens een bijzonder laag lat.

### 3. Inhoudelijke juistheid
Geen blocking technische fouten gevonden. Eén inconsistentie:
- `web-developer.ts:50` (instructie) vraagt expliciet om **media queries** voor de responsieve grid ("1 kolom op mobiel... gebruik media queries").
- `web-developer.ts:51` (tip) geeft echter `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` als hint — een techniek die juist GEEN media query nodig heeft. Dit is niet fout, maar tegenstrijdig: de instructie en de tip sturen op twee verschillende technieken voor hetzelfde probleem, wat verwarrend is voor een leerling van 13-14 jaar die net leert wat een media query is.

Overige technische claims (semantische HTML, Flexbox voor nav, `addEventListener` i.p.v. inline `onclick`, DOM-manipulatie via `display: block`) zijn correct.

### 4. Bewijsbaarheid
De opdracht vraagt in alle stappen om een tekstuele *beschrijving/uitwerking* van HTML/CSS/JS-code, niet om een daadwerkelijk werkend, controleerbaar product (geen live preview/render, `previewType: 'text-preview'`, web-developer.ts:27). Dit sluit aan bij de vaststaande enginebevinding dat er geen weg is om zelfgeschreven code echt te laten draaien of visueel te toetsen — de leerling typt code als tekst, niemand (mens noch systeem) controleert of die code werkt.

### 5. Leerdoelen 22A+22B
`slo-kerndoelen-mapping.ts:114` koppelt `web-developer` aan 22A+22B (leerjaar 2, week 2) en curriculum.ts:188 plaatst de missie correct in periode 2 "Programmeren & Computational Thinking" (sloFocus bevat 22A/22B). De vier stappen (structuur, CSS-layout, JS-interactiviteit, testen) dekken inhoudelijk breed wat je van een basale web-ontwikkelmissie zou verwachten en sluiten aan bij de gekoppelde kerndoelen.

### 6. Taalniveau, opbouw, haalbaarheid
Taalniveau past bij 13-14 jaar; jargon (DOM, Flexbox, Grid) wordt telkens kort uitgelegd tussen haakjes. Opbouw is logisch (structuur → layout → interactie → testen). Geen expliciete tijdsclaim in de config, dus geen haalbaarheidsissue te toetsen op dat punt.

## Model-inzet
Sonnet 5, geen thinking-escalatie nodig — config-analyse zonder architectuurkeuzes.
