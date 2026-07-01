# Fix-pass rapport — policy-maker (cyclus 1)

**Datum:** 2026-07-01
**Missie-id:** `policy-maker`
**Rapport-bron:** `business/dgskills-reviews/policy-maker-2026-06-17.md` (2 weken oud — repo is sindsdien doorontwikkeld, o.a. PR #186 shared IntroScreen)
**Whitelist:**
- `src/features/missions/templates/debate-arena/configs/policy-maker.ts`
- `src/config/templateRegistry.ts` (alleen policy-maker-entry)
- `src/config/agents/year1.tsx` / `year2.tsx` / `year3.tsx` (alleen policy-maker agent-rol-entry)
- `src/config/slo-kerndoelen-mapping.ts` (alleen policy-maker-entry)
- `src/config/curriculum.ts` (alleen policy-maker-entry)
- `src/config/missionGoals.ts` (alleen policy-maker-entry)

Dit is een **fix-pass**, geen nieuwe review: het rapport van 17 juni is opnieuw langsgelopen op de 5 als "auto-fixbaar" gemarkeerde voorstellen (#1, #2, #3, #5, #8). Elk voorstel is eerst geverifieerd tegen de huidige (2026-07-01) code voordat een Edit werd overwogen. Resultaat: **geen enkel voorstel kon veilig worden toegepast** — elk voorstel bleek stale, buiten whitelist, of technisch onjuist. Zie details hieronder.

---

## ✅ Toegepaste fixes (0)

Geen. Alle 5 als auto-fixbaar gemarkeerde voorstellen zijn geskipt (zie hieronder) of vielen al onder een bestaande escalatie.

## ⏭️ Geskipte voorstellen (5)

- `src/features/missions/templates/debate-arena/configs/policy-maker.ts:96,102,108,114` — **technisch-onjuist-voorstel:** rapport-voorstel #1 stelt `color: 'var(--color-duck-ink)'` voor ter vervanging van `color: '#202023'`. Geverifieerd dat (a) dit project géén `--color-duck-ink` CSS custom property definieert — de duck-tokens leven uitsluitend als Tailwind JS-config (`tailwind.shared.js:11`, `ink: '#202023'`), niet als CSS-variabelen; en (b) `CompletionScreen.tsx:51` gebruikt de badge-`color` in een hex-alpha-suffix-template (`` `linear-gradient(135deg, ${badge.color}15, ${badge.color}08)` ``) — een `var(...)`-string met een hex-suffix erachter plakken (`var(--color-duck-ink)15`) is ongeldige CSS en zou de badge-achtergrond stuk maken. Bovendien is dit géén policy-maker-specifieke afwijking: alle 4 debate-arena-configs (`ai-ethicus.ts`, `digital-rights-defender.ts`, `future-forecaster.ts`, `policy-maker.ts`) gebruiken identiek `color: '#202023'` op dezelfde 4 regels — dit is het uniforme template-patroon, geen missie-specifieke bug. Een echte fix vereist een architectuurkeuze (CSS-variabelen toevoegen aan het duck-tokensysteem, of `CompletionScreen.tsx` laten importeren uit `tailwind.shared.js`) die het `templates/shared/*`-domein raakt — buiten fixer-scope. Zie escalatie hieronder.
- `src/features/missions/templates/debate-arena/sub/ExplorePhase.tsx:6` — **scope-violation:** raakt `ExplorePhase.tsx`, niet in whitelist. Bestand staat bovendien niet meer op het pad uit het rapport (`phases/ExplorePhase.tsx` bestaat niet meer; de huidige locatie is `sub/ExplorePhase.tsx` — de mapstructuur is gewijzigd sinds 17 juni). `STAKEHOLDER_COLORS` is een template-breed gedeelde constante, gebruikt door alle debate-arena-missies, niet policy-maker-specifiek.
- `src/features/missions/templates/debate-arena/sub/ArguePhase.tsx:93,120` — **scope-violation:** raakt `ArguePhase.tsx`, niet in whitelist (ook hier: pad verschoven van `phases/` naar `sub/`). De kleur-dot-a11y-fix (`aria-hidden="true"`) zit in een template-breed gedeeld component, niet in de policy-maker-config.
- `src/config/missionGoals.ts:846-853` — **al-opgelost:** rapport-voorstel #5 stelt voor om `missionGoal` toe te voegen aan `policy-maker.ts` omdat `missionGoals.ts` geen entry zou hebben. Geverifieerd dat `missionGoals.ts` sinds 17 juni een complete `policy-maker`-entry heeft gekregen (regels 846-853), met een nieuwer/ander schema (`primaryGoal` + `criteria: { type, description }` + `evidence`) dan het rapport-voorstel gebruikte (`primaryGoal` + `objectives[]`). `DebateArena.tsx:176` (`goal={config.missionGoal ?? getMissionGoal(config.missionId)}`) valt hierdoor niet meer terug op een lege waarde — de IntroScreen (shared component uit PR #186) toont het doel-blok correct. Geen actie nodig.
- `src/features/missions/templates/debate-arena/sub/ArguePhase.tsx:84` (config-kant zou `policy-maker.ts` zijn) — **stale-rapport:** rapport-voorstel #8 citeert een `argumentPrompts`-veld met 3 waarden dat in `policy-maker.ts` zou staan. Geverifieerd met een volledige Read van `policy-maker.ts` (126 regels) én een repo-brede grep op `argumentPrompts` binnen de hele `debate-arena/`-map: het veld bestaat nergens meer — niet in de config, niet als type, niet als gebruik in enig sub-component. De `before`-snippet uit het rapport staat niet meer in de source. Zelfs als het veld nog bestond, zou de daadwerkelijke fix (placeholder-tekst lezen) in `ArguePhase.tsx` moeten gebeuren — buiten whitelist.

## ⚠️ Escalatie nodig (4)

- **Badge-color tokenisatie (rapport-punt #1):** hardcoded `#202023` in `policy-maker.ts` (en identiek in de 3 zusterconfigs) is een template-breed patroon. Een echte fix vereist óf een nieuwe CSS-variabele/token-brug in `templates/shared/*` of `tailwind.shared.js`, óf een bewuste keuze om de hex-waarde te laten staan omdat de hex-alpha-suffix-syntax (`${badge.color}15`) een CSS-variabele sowieso niet toelaat zonder `CompletionScreen.tsx` aan te passen (bijv. naar `color-mix()` of een losse opacity-prop). Orchestrator/Yorin moet beslissen of dit template-breed wordt opgepakt.
- **Doel-stap-mismatch (rapport-punt #6):** `missionObjective` in `year3.tsx` beschrijft "schrijf een beleidsvoorstel", maar het debate-arena-template biedt geen vrij schrijfveld voor een beleidsvoorstel — alleen argumenten voor een gekozen positie. Rapport geeft geen concreet, whitelist-conform before/after-tekstvoorstel (alleen een suggestie-in-lopende-tekst: "overweeg of..."), dus dit is niet auto-fixbaar volgens de fixer-regels. Blijft escalatie zoals in de opdracht al vastgesteld.
- **`systemInstruction` client-side (rapport-punt #9):** de volledige agent-instructie staat als string in `src/config/agents/year3.tsx`, dus zichtbaar in de client-bundle. Vereist verificatie of de edge function de instructie server-side ophaalt op basis van `roleId`, of dat de client 'm meestuurt (mogelijk prompt-injection-risico). Raakt AI-endpoint-architectuur — buiten fixer-scope, expliciet uitgesloten in de opdracht.
- **`promptSanitizer` niet verifieerbaar (rapport-punt #10):** vereist inspectie van de chat-component en/of edge function om te bevestigen dat leerling-input gesanitized wordt vóór `supabase.functions.invoke`. Buiten de scope van de debate-arena-template en de config-whitelist.

## Volgende stap

Geen fixes toegepast in deze cyclus — alle voorstellen bleken bij verificatie stale, buiten whitelist, of technisch onjuist. Een her-run van M2 review zou hetzelfde resultaat opleveren zolang de whitelist ongewijzigd blijft, omdat de resterende issues (#1, #6, #9, #10) allemaal template-breed of architectuur-niveau zijn, niet policy-maker-config-niveau. **Escaleer naar Yorin/orchestrator** voor een besluit over: (a) of de badge-color-tokenisatie template-breed wordt opgepakt (whitelist-uitbreiding naar `templates/shared/*` + de 4 debate-arena-configs), en (b) de 3 reeds-bekende escalaties (#6, #9, #10) die buiten fixer-scope blijven.
