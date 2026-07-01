# Mission-fixer rapport — cyclus 1

**Mission ID:** reflection-report
**Rapport-bron:** `business/dgskills-reviews/reflection-report-2026-06-17.md` (fix-pass, 2 weken na origineel rapport — repo is doorontwikkeld sinds 17 juni)
**Whitelist:**
- `src/features/missions/templates/debate-arena/configs/reflection-report.ts`
- `src/config/templateRegistry.ts` (alleen reflection-report entry)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (alleen reflection-report agent-rol entry)
- `src/config/slo-kerndoelen-mapping.ts` (alleen reflection-report entry)
- `src/config/curriculum.ts` (alleen reflection-report entry)
- `src/config/missionGoals.ts` (alleen reflection-report entry)

---

## ✅ Toegepaste fixes (0)

_Geen. De ene aanvankelijk toegepaste fix is door de orchestrator-eindreview teruggedraaid (zie hieronder)._

---

## ⏭️ Geskipte voorstellen (8)

- `src/config/agents/year3.tsx:2127` (lab-coral → duck-coral token-swap) — **TERUGGEDRAAID door orchestrator-eindreview:** `duck-coral` bestáát niet als token. In `tailwind.shared.js` heeft het `duck`-palet alleen bg/bgLight/ink/acid/gray/error; `coral` (#D97848) bestaat uitsluitend onder het legacy `lab.`-palet, en `tailwind.config.js` voegt niets toe. De swap zou een stille no-op zijn (kaart verliest zijn kleur). NB: de `duck-coral`-usages elders (`src/features/developer/*`) zijn zelf latente no-op-bugs, geen bewijs van bestaan — die zijn als aparte taak geflagd. Token-swap vereist eerst een design-beslissing (coral-equivalent in het duck-palet).

- `src/features/missions/templates/debate-arena/DebateArena.tsx:176` (missionGoal-fallback) — **stale-rapport:** BLOKKER 2 uit het originele rapport ("ontbrekende missionGoal") is inmiddels opgelost. `src/config/missionGoals.ts:854-861` bevat al een volledige `'reflection-report'`-entry (`primaryGoal`, `criteria`, `evidence`). De component-fallback `config.missionGoal ?? getMissionGoal(config.missionId)` resolveert dus correct. Het voorgestelde `missionGoal`-veld toevoegen aan `reflection-report.ts` zelf is niet nodig — de meeste andere debate-arena-configs (`digital-rights-defender.ts`, `ai-ethicus.ts`, `policy-maker.ts`, `digitale-balans-coach.ts`) leunen ook op de `missionGoals.ts`-fallback en vullen het config-veld niet zelf in; alleen `schermtijd-coach.ts` is een uitzondering. Geen fix nodig.
- `src/features/missions/templates/debate-arena/configs/reflection-report.ts:96,102,108,114` (badge-kleuren hardcoded hex) — **geen concreet after-voorstel + platformbreed patroon:** het rapport geeft geen letterlijk before/after-codeblok met exacte vervangwaarden (alleen prosa: "zou duck-acid moeten zijn"). Bovendien is dit patroon niet missie-specifiek: álle debate-arena-configs (`schermtijd-coach.ts`, `digital-rights-defender.ts`, `ai-ethicus.ts`, `policy-maker.ts`, `digitale-balans-coach.ts`) gebruiken hardcoded hex in `badges[].color`, en de `BadgeConfig`-type verwacht een losse kleurstring, geen Tailwind-token. Missie-specifiek "fixen" zou reflection-report laten afwijken van elke andere debate-arena-missie — een cross-template-consistentiewijziging buiten single-mission-scope. Het rapport erkent dit patroon zelf al als "platformbreed consistent, technische schuld" bij het vergelijkbare punt over `agent.color`.
- `src/config/agents/year3.tsx` (agent.color hardcoded hex) — **n.v.t.-voorstel:** rapport constateert zelf expliciet "platformbreed consistent, geen blocker, wel technische schuld" — geen concreet fix-voorstel, alleen observatie.
- `reflection-report.ts:9` (intro-copy iets redundant) — **n.v.t.-voorstel:** alleen een suggestie ("vat samen in één scherpe zin") zonder letterlijke vervangtekst — geen machine-toepasbaar before/after-blok.
- `reflection-report.ts` (ontbrekende `explorationQuiz`/`argumentQualityIndicators`) — **n.v.t.-voorstel:** aanbeveling zonder concrete content voor de velden — geen before/after-blok om toe te passen.
- `DebateArena.tsx:114-116` (argument-drempel 20 tekens te laag) — **scope-violation:** raakt de gedeelde template-engine, niet in whitelist (whitelist bevat alleen `reflection-report.ts`). Opdracht markeert gedeelde debate-arena-engine-bestanden expliciet als escalatie.
- `DebateArena.tsx:191` (calcScore-duplicatie) — **scope-violation:** zelfde reden — gedeelde engine-bestand, niet missie-specifiek, buiten whitelist.

---

## ⚠️ Escalatie nodig (2)

- **BLOKKER 1 — Template/doel-mismatch (essay-flow vs. debat-template):** al door de orchestrator/Yorin als bekende, niet-auto-fixbare escalatie uit dit rapport aangemerkt (structureel herontwerp: agent beschrijft een reflectieverslag-schrijfopdracht, template implementeert een debat). Vereist een productkeuze (Optie A/B/C uit het rapport) — buiten fixer-scope, geen actie ondernomen.
- **Punt 9 — systemInstruction client-side inline in year3.tsx vs. server-side systemInstructions.ts:** al door de orchestrator/Yorin als bekende escalatie aangemerkt (mogelijk security-risico als de client-side instructie ook naar de AI-aanroep gaat). Vereist verificatie welk systeem daadwerkelijk de AI aanstuurt — buiten fixer-scope, geen actie ondernomen.

Geen scope-uitbreiding nodig (`needsScopeExpansion` leeg) en geen loop-preventie-gevallen (dit is attempt 1, geen `previousAttemptsLog`).

---

## Volgende stap

Geen fixes toegepast — alles geskipt of geëscaleerd. Escaleer naar Yorin: de twee bekende escalaties (template/doel-mismatch, systemInstruction client/server) plus de token-swap-designbeslissing los je niet op via een volgende fixer-cyclus; ze vereisen een productkeuze, een architectuur-verificatie respectievelijk een design-beslissing. Missie-status → blocked (wacht op Yorin).
