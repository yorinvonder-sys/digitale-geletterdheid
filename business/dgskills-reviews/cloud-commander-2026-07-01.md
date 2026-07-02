# Mission-fixer rapport — cyclus 1

**Mission ID:** cloud-commander
**Rapport-bron:** business/dgskills-reviews/cloud-commander-2026-06-17.md (fix-pass, 2 weken later)
**Whitelist:** `src/features/missions/templates/tool-guide/configs/cloud-commander.ts`, `src/config/templateRegistry.ts` (entry), `src/config/agents/year1|2|3.tsx` (entry), `src/config/slo-kerndoelen-mapping.ts` (entry), `src/config/curriculum.ts` (entry), `src/config/missionGoals.ts` (entry)

Dit is een fix-pass op het rapport van 2026-06-17. De codebase is sindsdien 2 weken doorontwikkeld — veel van de gerapporteerde issues bleken bij Read-verificatie al opgelost. Elk voorstel is expliciet tegen de huidige source gecheckt vóór toepassing.

## ✅ Toegepaste fixes (2)

- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:34` — A2: +-icoon-instructie ondubbelzinnig gemaakt ("rechtsonder in de navigatiebalk... zie je het niet? Kijk dan rechtsboven") i.p.v. het dubbelzinnige "(rechtsboven of rechtsonder)" (sectie: design)
- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:68` — A3: long-press-instructie vervangen door "drie puntjes (•••) naast het bestand" — OneDrive iOS heeft geen betrouwbaar long-press-contextmenu (sectie: design)

## ⏭️ Geskipte voorstellen (5)

- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:86` — **al-opgelost:** BLOCKING-T1 (maxScore 60→50 + badge-drempels 55/40→45/30) staat al exact zo in de huidige source (`maxScore: 50`, badges op 45/30/0). Iemand anders heeft dit tussen 17 juni en nu al gefixt.
- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts` (stap 3) — **al-opgelost:** T1 (`teacherCheck` op stap-3-uploaden) staat al in de source ("Laat je docent zien welk soort foto..."). Geen actie nodig.
- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts` (na toolName) — **al-opgelost (afwijkende vorm):** P1 (`missionGoal.primaryGoal` + `learningObjectives`) — een `learningObjectives`-array staat al top-level in de config (4 items, inhoudelijk gelijk aan het voorstel, zelfs met een extra item over uploadverificatie). Geen `missionGoal`-wrapper-object aanwezig, maar het onderliggende didactische gat (geen leerdoelen) is al gedicht. Toepassen van het letterlijke voorstel zou een dubbele/tegenstrijdige structuur opleveren — geskipt.
- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts` (stap 2 badges) — **niet-toepasbaar:** A1 (badge-kleur hex → `'primary'`/`'secondary'`/`'muted'` enum) vereist een `BadgeConfig.color`-enum die niet bestaat. `src/features/missions/templates/shared/types.ts:49` definieert `color: string` (plain hex-string, comment "tailwind-compatible color like '#202023'"). Het voorstel zelf noemt deze voorwaarde ("zodra BadgeConfig.color als enum uitgebreid is") — die is niet vervuld, dus dit is buiten fixer-scope (raakt bovendien `shared/types.ts`, niet whitelisted voor deze missie).
- `src/features/missions/templates/tool-guide/configs/cloud-commander.ts` (stap 4) — **onvolledig voorstel:** P2 (Bloom-3-vraag) geeft een los `question`/`options`/`explanation`-fragment zonder concrete `before`-snippet uit de huidige source om te vervangen. Het `VerificationQuestion`-schema (ToolGuide.tsx:32) staat maar één vraag per stap toe ("singular", geen array) — het voorstel "vervang of voeg toe als derde" is daarmee schema-strijdig. Geen veilige machine-toepassing mogelijk zonder een didactische keuze te maken die niet in het voorstel als exacte before/after stond.

## ⚠️ Escalatie nodig (2)

- **Engine-brede token-status (geüpdatet, geen actie vereist):** BLOCKING-D1/D2 uit het bronrapport (`duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` ontbraken; `focus-visible:ring-duck-coral` was kapot) blijken **al opgelost** op engine-niveau. `ToolGuide.tsx` gebruikt nu uitsluitend `duck-acid` en `duck-ink` voor focus-rings (regels 246, 292, 354, 386, 419) — beide bestaan in `tailwind.shared.js:8-15`. Een repo-brede grep op de vier genoemde kapotte tokens binnen de tool-guide template gaf geen treffers. **Dit hoeft niet meer als blocking behandeld te worden**, maar Yorin/orchestrator moet dit bevestigen bij de volgende M2-hercheck, want de fixer heeft geen mandaat om "geen blokker meer" als eindoordeel te vellen — dat is aan de reviewer.
- **AVG-persoonsgegevens (P3, stap 3 foto-instructie):** rapport markeert stap-3-instructie ("Maak een foto...") als privacy-grijs-gebied (portretfoto's van 12-jarigen). Conform expliciete opdracht-instructie is dit **niet gefixt**, ook al bevat de huidige source al een gedeeltelijke aanscherping ("geen foto's van jezelf of klasgenoten", `teacherCheck` toegevoegd). Yorin beslist of dit voldoende is of dat de instructie volledig naar "schoolboek/schrift/oefenbestand" moet zoals het rapport voorstelde. Categorie: `avg-persoonsgegevens`.

## Volgende stap

2 fixes toegepast (beide binnen whitelist, design-categorie). Re-run M2 review (cyclus 2/3) om te bevestigen dat A2/A3 correct zijn verwerkt en dat de engine-token-status (D1/D2) definitief als opgelost kan worden afgevinkt. AVG-vraag (P3) blijft open voor Yorin — niet autonoom oplosbaar.
