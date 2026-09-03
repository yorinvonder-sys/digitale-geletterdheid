# Review: Bug Hunter

**Datum:** 2026-08-25
**TemplateType:** simulation-lab

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10

- **info** — De drie sims volgen consistent hetzelfde patroon (parameters instellen → visual → 3 vragen), wat rust geeft, maar Sim 2 (bar-chart) mist een sublabel/duiding zoals Sim 1 (meter) die wel heeft — de leerling ziet vijf staven zonder toelichting welke score "gevaarlijk" is.
- **warning** — Badge-drempels (`minScore: 0/25/50/70/90`) zijn standaard-DGSkills-patroon en consistent met `maxScore: 100`; geen bevinding op zich, maar de bar-chart in Sim 2 heeft geen `maxScore`-referentielijn in de visual zelf, waardoor "5" (logica-fout) niet zichtbaar als ergste geval oogt tenzij je de vraag leest.
- **info** — Emoji-gebruik in comparison-items (🎲🔄❓⏱️ vs ✅❌⚠️) is consistent en ondersteunt scanbaarheid.
- Gedeelde engine-bevindingen die dit design raken (uit `engine-simulation-lab.json`): de "eerst experimenteren"-poort ontgrendelt na één klik, en antwoordopties zijn al klikbaar vóór die klik — dit ondermijnt het bedoelde ontwerp "eerst spelen met de simulatie, dan voorspellen" voor alle drie sims van deze missie.

## Didactiek — score 8/10

- Sterk doorlopende opbouw: fout*lezen* (herkennen) → fout*typeren* (categoriseren) → *strategie* (toepassen) — een heldere Bloom-opklim binnen één missie.
- Vragen testen begrip, niet giswerk: `sb1-q2` (off-by-one met concreet codevoorbeeld `i <= 5`) en `ds1-q2` (vier stappen systematisch debuggen) zijn allebei nauwkeurig en aansluitend bij de bijbehorende simulatie-parameter.
- **warning** — `fl1-q2` (syntax vs runtime error) en de bijbehorende `fouttype`-slider in Sim 1 gebruiken 3 categorieën (syntax/runtime/**logische** fout), maar de quizvraag test alleen syntax vs runtime — de derde categorie (logische fout) wordt pas in Sim 2 behandeld. Geen bevinding die blokkeert, maar de sim-parameter belooft meer dekking dan de vragen bieden.
- **info** — `takeaways` herhaalt bijna letterlijk de `explanation`-teksten van de vragen (bijv. "reproduceer → lokaliseer → diagnosticeer → fix"); dat is gewenst herhalingsdidactiek, geen ruis.
- SLO-koppeling (`22B`/VSO `19A`, week 2, jaar 2) is passend bij het onderwerp (probleemoplossend vermogen/foutanalyse) en consistent met vergelijkbare missies in dezelfde week (code-reviewer, automation-engineer).

## Tech — score 8/10

- `computeVisuals` is pure, deterministische switch/case zonder `eval`, conform het skill-patroon; fallback op onbekende `simId` retourneert een geldige `meter`-shape in plaats van te crashen.
- Score-berekening in Sim 1 (`fouttypeScore + diagnoseScore + consolelogScore`, max 25+40+30=95, sim.maxScore=30) — **let op:** de interne score-optelling in `computeVisuals` (tot 95) dient alleen de visuele meterweergave en is losgekoppeld van de quiz-puntentelling (sim.maxScore 30, som van de drie vraagpunten 10+10+10=30). Dat klopt dus, maar het spreidingsgetal 95 vs meterlabel-drempels (25/50/75) is intern consistent — geen bug, wel vermeldenswaardig omdat het twee aparte scoringsdomeinen zijn die toevallig dezelfde naam "score" dragen.
- Som van `sim.maxScore` (30+40+30=100) komt exact overeen met `config.maxScore: 100` — dit voorkomt de door de gedeelde engine gesignaleerde discrepantie tussen totaalscore en per-sim-uitsplitsing (engine-bevinding, regel 59 in `engine-simulation-lab.json`); voor déze missie is dat dus geen risico.
- Alle `params[...] as <type> ?? default` casts zijn defensief en dekken de fallback-state (nieuwe sessie zonder interactie) correct af.
- **info (engine, niet missie-specifiek)** — de blocking bevindingen uit de gedeelde engine (CompletionScreen zonder `onRetry`/terugweg bij score < 40%, ontbrekende idempotentie-guard op `handleComplete`) gelden ook voor Bug Hunter zodra een leerling onder de 40% scoort (mogelijk bij drie foute antwoorden in Sim 1+3, want Sim 2 heeft hogere puntenwaarden). Dit is een engine-fix, geen missie-config-fix — niet auto-fixable binnen deze missie's bestanden.

## Voorstellen

Geen mechanische fixes binnen de whitelist-scope van `bug-hunter.ts`/registry-entries nodig. De enige inhoudelijke observatie (Sim 1 dekt "logische fout" niet in de quizvragen) is een ontwerpkeuze-vraag, geen defect — geen voor/na-snippet voorgesteld omdat een derde quizvraag toevoegen de puntentelling (`sim.maxScore: 30` vs som van vraagpunten) zou verstoren en dus een bewuste contentbeslissing vereist, niet een mechanische fix.

## Samenvatting & verdict

Bug Hunter is een goed opgebouwde, in zichzelf consistente missie: heldere leerlijn (herkennen → categoriseren → toepassen), correcte en scherpe quizvragen met concrete codevoorbeelden, en een score-architectuur die intern klopt (som sim.maxScore = config.maxScore). De belangrijkste risico's — CompletionScreen-blokkade onder 40%, dubbele-klik op afronden, "eerst experimenteren"-poort met één klik te omzeilen — zitten allemaal in de gedeelde simulation-lab-engine en zijn al vastgelegd in de enginebeoordeling; ze zijn niet oplosbaar binnen de config van deze missie.

**Verdict: ok** (missie-eigen content en scoring zijn in orde; de openstaande risico's zijn engine-breed en horen bij de enginefix, niet bij een herontwerp van Bug Hunter).
