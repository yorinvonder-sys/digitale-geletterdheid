# Review: verhalen-ontwerper (wave 18, verse review)

**Datum:** 2026-07-02
**Template:** `agent-role` (pure chat-missie, agent-rol IS de missie)
**Rol-definitie:** `src/config/agents/year1.tsx:870-1038`
**Server-instructie:** `supabase/functions/_shared/systemInstructions.ts:26`
**Preview-component:** `src/features/student/BookPreview.tsx` (dedicated, gerouteerd via `AiLab.tsx:1342-1353`)
**Curriculum:** Leerjaar 1, Periode (bevat o.a. prompt-master/game-programmeur/ai-trainer) — `src/config/curriculum.ts:85`
**SLO:** `21D`, `22A` (regulier); `18C`, `19A` (vso) — `src/config/slo-kerndoelen-mapping.ts:50`
**missionGoals:** `type: 'component-complete'` — `src/config/missionGoals.ts:106-113`
**agentRoleIds:** geregistreerd — `src/config/agentRoleIds.ts:15`

---

## 🎨 Design review

**Mission:** verhalen-ontwerper (agent-role + dedicated BookPreview)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 3 (knop-clarity)**: CTA "Start Mijn Boek" is functioneel, gelabeld, met icoon (`Sparkles`) — `BookPreview.tsx:875-881`.
- **Criterium 4 (copy-lengte)**: `problemScenario` (32 woorden) en `missionObjective` (4 woorden) ruim binnen leerjaar-1-normen — `year1.tsx:878-879`.
- **Reeds gefixt sinds vorige audit**: het UI/UX-auditrapport (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:72`) meldde een afwijkende rode "Start Mijn Boek"-knop (niet duck-acid). Geverifieerd in de huidige code: de knop gebruikt nu `bg-duck-acid text-duck-ink` (`BookPreview.tsx:877`) — gefixt via commit `7183d37` "fix(missions): off-brand 'Start'-CTA's naar brand-acid (review-week-1, verhalen-ontwerper) (#190)". **Geen nieuwe bevinding, niet opnieuw autoFixen.**

### ⚠️ Aandachtspunten
- **Hardcoded hex i.p.v. duck-tokens op een echte UI-component (niet dataprop)** — `BookPreview.tsx:34` (`backgroundColor: '#ff3c21'` op de `StorySetupForm`-header), en herhaald op regels 313, 423 (badge/knop-achtergronden), 861 (achtergrond-tint `#f2f1ec`), 869 (`borderColor: '#e3e2dc'`).
  - **Wat:** de setup-form-header en meerdere badges/knoppen in `BookPreview.tsx` gebruiken inline `style={{ backgroundColor: '#ff3c21' }}` i.p.v. een duck-token-className. `#ff3c21` komt exact overeen met `duck-error`, maar staat als losse hex.
  - **Waarom:** dit is — anders dan het `chartData`-precedent uit welzijnsonderzoeker — een classNames/styling-schending op een zichtbare UI-header, geen chart-libraryprop die per definitie een hex-string verwacht. Wel minor: de kleurwaarde klopt met het palet, dus visueel is er geen fout, alleen een onderhoudsrisico als het duck-palet verschuift.
  - **Voorstel:** niet autoFixable — `BookPreview.tsx` is een 1448-regel component met tientallen vergelijkbare inline-hex-instanties door het hele bestand (niet alleen deze 4 regels); een gerichte fix van 4 losse plekken zou het patroon inconsistent maken t.o.v. de rest van het bestand. Aanbeveling: apart, bestandsbreed opgepakt worden als losse token-migratie-taak voor `BookPreview.tsx`, niet als puntfix in deze review.
- **Agent-role `color: '#ff3c21'`** — `year1.tsx:876`. Consistent patroon (elke agent-role heeft een hex `color`-veld, gebruikt voor briefing-kaarten) — dit is het bekende, platform-brede patroon, geen missie-specifieke fout.

### ❌ Blocking issues
- Geen.

### Visual Precision Gate
Niet uitgevoerd — geen screenshots-map aanwezig (`.ui-review` bestaat niet in de worktree). `verhalen-ontwerper` staat wél in `docs/audits/student-missions-ui-ux-review-2026-06-30.md:72` met één specifieke bevinding (rode CTA), die geverifieerd en als **al gefixt** bevestigd is (zie boven). Voor de rest van de flow (chat-paneel, boek-editor-states, print/publish) is geen recent visueel bewijs. Status: **gedeeltelijk unverified** — 1 historische bevinding geverifieerd tegen code, overige UI niet dynamisch getest deze ronde.

### Score
2/4 statische criteria expliciet bevestigd (geen classNames-hardcode in de agent-role zelf; wel in het gekoppelde BookPreview-component — buiten strikte agent-role-scope maar wel onderdeel van de missie-ervaring) · Visual Precision Gate: gedeeltelijk (1 historische fix bevestigd) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** verhalen-ontwerper (agent-role, component-complete)
**Curriculum-plek:** Leerjaar 1
**SLO-claim:** 21D, 22A (regulier); 18C, 19A (vso)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21D`, `22A` zijn geldige VO-kerndoelcodes; vso-mapping `18C`/`19A` aanwezig — `slo-kerndoelen-mapping.ts:50`.
- **Criterium 2 (SLO-fit)**: sterk geraakt. 21D (creatief/verbeeldend gebruik van digitale media): leerlingen construeren een narratief + beeldprompts. 22A (samenwerken met AI/prompting): de hele missie is een prompt-iteratie-oefening (tekst schrijven, illustraties op aanvraag bijstellen — "Maak de lucht blauw op pagina 2"-flow).
- **Criterium 3 (leerdoelen)**: `missionGoals.ts:106-108` — `primaryGoal` = "Ik ontwerp een kort verhaal met AI-beeld en tekst die samen een logisch geheel vormen", `evidence` = "begin, vervolg, beeldkeuzes en een korte toelichting op je prompts" — concreet en meetbaar (Bloom: creëren).
- **Criterium 4 (opdracht-beknoptheid)**: `problemScenario` 32 woorden, `missionObjective` 4 woorden — ruim binnen leerjaar-1-grens.
- **Criterium 5 (leeftijds-passend)**: taal en scenario's (draak, konijn "Floppie", beer "Tim") passen bij leerjaar 1 (12-13 jaar), toon is speels zonder infantiliserend te zijn voor de bovengrens van de doelgroep.
- **Criterium 6 (curriculum-plek)**: logisch — leerjaar 1, samen met prompt-master/game-programmeur/ai-trainer/chatbot-trainer: allemaal "AI als hulpmiddel leren gebruiken"-missies vroeg in het curriculum.
- **Criterium 7 (Bloom-balans)**: creëren staat centraal (schrijven + prompten), met impliciete evaluatie-stap (leerling beoordeelt of de illustratie past en stuurt bij). Geen pure onthoud-vragen — past bij een ontwerp-missie.
- **Criterium 9 (welzijn & inclusiviteit)**: geen stigmatiserende content; het WELZIJNSPROTOCOL-blok (via `SYSTEM_INSTRUCTION_SUFFIX`, client-zijde) dekt zelfbeschadiging/misbruik/pesten-signalen. **Let op:** dit protocol zit alléén in de client-suffix, NIET in de losstaande server-instructie (zie Tech-sectie, drift-bevinding) — de server-versie heeft wél een eigen, oudere versie van hetzelfde WELZIJNSPROTOCOL-blok ingebakken (zelfde tekst, want de server-string was ooit een volledige kopie inclusief suffix). Functioneel dus gedekt, structureel gescheiden.

### ⚠️ Aandachtspunten
- **3-stappen-methode (erkenning/uitleg/challenge) is inhoudelijk niet toepasbaar op dit missietype** — hele systemInstruction.
  - **Wat:** de platform-brede `SYSTEM_INSTRUCTION_SUFFIX` (client) schrijft de 3-stappen-antwoordstructuur voor (Erkenning → Uitleg → Challenge, max 2-3 zinnen per onderdeel) plus een verplichte TIPS-sectie. De rol-specifieke instructie van verhalen-ontwerper werkt echter met een heel ander interactiepatroon: `[TITLE]`/`[PAGE]`-tags, scenario A/B-vertakking, "schrijf één pagina per beurt". Deze twee patronen zijn niet expliciet met elkaar verzoend in de tekst — de rol-instructie legt nergens uit hoe de 3-stappen-structuur zich verhoudt tot een pagina die vooral verhalende inhoud (het `[PAGE]`-blok zelf) bevat.
  - **Waarom:** minor/informational — dit is een **platform-breed patroon** (elke agent-role krijgt dezelfde suffix ongeacht rol-type), niet een verhalen-ontwerper-specifieke fout. Bij een creatief-schrijf-missie is "Erkenning/Uitleg/Challenge" per boodschap sowieso losser toepasbaar dan bij een technische coach-rol; het AI-model interpreteert dit in de praktijk waarschijnlijk soepel (bijv. "Erkenning" = korte enthousiaste reactie, "Uitleg" = het verhaalfragment, "Challenge" = de vervolgvraag "Wil je verder met pagina 2?"). Geen bewijs van disfunctioneren gevonden, wel een structurele onduidelijkheid.
  - **Voorstel:** niet autoFixable — raakt de platform-brede suffix-architectuur, niet de missie-specifieke instructie. Geen actie in deze review.
- **AI = copiloot, geen antwoordenmachine — grotendeels bewaakt, met één zwak punt.** De instructie dwingt goed af dat de leerling zelf de held/setting kiest (Scenario A/B) en dat illustraties pas op aanvraag komen (niet automatisch, voorkomt passief consumeren). Zwak punt: zodra de leerling een held heeft opgegeven, schrijft de AI zelf de volledige paginatekst (`[PAGE]De tekst voor deze pagina...[/PAGE]`) — de leerling levert het concept, de AI schrijft de uitvoering. Voor een "verhalen ONTWERPER"-missie (nadruk op ontwerpen) is dit een reëel afwegingspunt: leert de leerling schrijven, of leert de leerling prompten-en-laten-schrijven?
  - **Voorstel:** geen autoFixable wijziging — dit is een fundamentele scope-keuze van de missie-auteur (prompting-vaardigheid vs. schrijfvaardigheid), geen bug. Optioneel voor een latere iteratie: de instructie zou de leerling kunnen vragen zelf een schets/kernzin te geven die de AI dan uitwerkt, in plaats van puur op basis van held-naam+locatie+thema te schrijven. Niet blocking.
- **XP-farming-preventie**: aanwezig via de platform-brede suffix (detecteert korte/betekenisloze berichten), maar niet rol-specifiek aangescherpt. Voor een creatieve schrijfmissie is het generieke patroon ("ok", "ja", "asdf") waarschijnlijk voldoende dekkend — geen aanvullende actie nodig.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21D**: sterk geraakt — creatief/verbeeldend digitaal ontwerpen (tekst + AI-gegenereerd beeld tot samenhangend geheel).
- **22A**: sterk geraakt — iteratief prompten (illustratie-aanpassingen op basis van feedback, scenario-gestuurde flow).

### Score
7/9 criteria expliciet bevestigd, 2 informationele/structurele aandachtspunten (platform-breed suffix-patroon; scope-keuze schrijven-vs-prompten) · Bloom-balans: creëren-centraal, passend bij missietype · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** verhalen-ontwerper (agent-role, chat + dedicated BookPreview)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-ronde; geen `.ui-review`-screenshots aanwezig.

### Static analyse

#### ✅ Geslaagd
- **Registratie compleet en consistent** over alle 8 verwachte bronnen: `agentRoleIds.ts:15` (RoleId-union-bron), `types.ts:25` (RoleId literal), `curriculum.ts:85`, `slo-kerndoelen-mapping.ts:50`, `missionGoals.ts:106`, `missionThumbnails.ts:18`, `basisvaardigheden-mapping.ts:168`, agent-role zelf `year1.tsx:870`. Geen ontbrekende bron gevonden — dit dekt exact het bekende "dubbele-bron"-risico (RoleId-union + AGENT_ROLE_IDS-array) uit eerdere waves.
- **Levering bevestigd actief, niet dormant**: `AiLab.tsx:1283,1342-1353` bevat een dedicated render-tak (`selectedRole?.id === 'verhalen-ontwerper'`) die `BookPreview` mount in de preview-kolom, parallel aan de chat. Dit is dus geen pure-chat-only rol maar een hybride: chat (linkerkolom) + custom boek-editor/preview (rechterkolom). De rol is bereikbaar en actief — geen dormant-risico.
- **`goalCriteria` correct afwezig**: geen `steps-complete`-veld op de rol (`year1.tsx:870-1038`), consistent met `missionGoals.ts:106` (`type: 'component-complete'`). De 3 `steps` in de rol-definitie (Karakter/Verhaal/Afwerken) dienen als UI-gids, niet als voortgangsteller — intern consistent, geen mismatch.
- **STEP_COMPLETE-mechanisme correct bedraad**: `useAgentLogic.ts:12` importeert `useStepCompletion`; de generieke marker-syntax (`---STEP_COMPLETE:X---`) komt uit `SYSTEM_INSTRUCTION_SUFFIX` (`shared.tsx:64-77`), niet uit de rol-instructie zelf — verhalen-ontwerper hoeft geen eigen STEP_COMPLETE-logica te specificeren, dat is platform-generiek. Geen missie-specifieke STEP_COMPLETE-tekst gevonden in de rol-instructie (klopt: dit type missie leent zich niet voor expliciete stapnummers, en gebruikt inderdaad geen eigen stap-markers).
- **BookPreview `[IMG]`-flow sluit aan op systemInstruction**: de systemInstruction specificeert `[IMG target="cover"]`/`[IMG target="N"]`-tags "alleen op aanvraag of via knop/popup" (`year1.tsx:936-942`), en `BookPreview.tsx:688,692` construeert exact zulke prompts via popup-state (`popupState.pageNum`) die naar de AI worden gestuurd. Consistent — het "knop/popup"-mechanisme dat de instructie noemt bestaat daadwerkelijk.
- **`activeBookData`-parsing en cloud-sync aanwezig**: `useAgentLogic.ts:382` (state-init met fallback naar opgeslagen voortgang), `:460,483-484` (herstel bij missiewissel), `:503-509` (auto-save naar `saveMissionProgress` bij wijziging) — voortgang gaat niet verloren bij tussentijds afsluiten.

#### ⚠️ Aandachtspunten
- **BLOCKING-KANDIDAAT — Significante client/server systemInstruction-drift.** De server-instructie (`supabase/functions/_shared/systemInstructions.ts:26`, ~10.200 tekens) is een **oudere versie** dan de client-instructie (`year1.tsx:903-1002`). Concrete verschillen:
  - Server bevat nog de oude, VERPLICHTE auto-illustratie-flow: "START ALTIJD MET EEN KAFT-AFBEELDING! Zodra het verhaal begint... MOET je een [IMG target="cover"] genereren" en een `[IMG]`-tag-instructie die illustraties bij elke pagina automatisch aanbiedt. Client is herzien naar "illustraties op aanvraag" (`year1.tsx:936-942`: "Gebruik [IMG] tags ALLEEN als de leerling expliciet... vraagt of als een knop/popup daarom vraagt... Focus standaard eerst op het SCHRIJVEN van een goed verhaal; illustreer pas wanneer daarom gevraagd wordt").
  - Server mist de SCENARIO A (formulier-start)/SCENARIO B (vrije start)-vertakking die de client wél heeft (`year1.tsx:949-967`) — de server-versie kent alleen de oude vrije-start-flow zonder het `StorySetupForm`-startpad te herkennen.
  - Server mist de "MAXIMAAL 5 PAGINA'S"-grens zoals die in de client staat verwoord in combinatie met scenario-bewuste afronding; server heeft een oudere variant van dezelfde regel maar zonder de scenario-context.
  - **Waarom dit telt:** volgens platform-architectuur is de **server-instructie de daadwerkelijk uitgevoerde prompt** (client is fallback/documentatie — `systemInstructions.ts:1-9`: "Generated from config/agents.tsx... SECURITY: instructions stored server-side only... prevents students from manipulating AI instructions"). Dat betekent: leerlingen krijgen in productie **de oude flow** (verplichte auto-illustratie bij elke pagina, geen `StorySetupForm`-scenario-herkenning) — niet de nieuwere, bewust ontworpen "schrijven eerst, illustreren op aanvraag"-ervaring die in de client-config staat. Dit is functioneel relevant gedrag, geen cosmetische afwijking: het `StorySetupForm`-startpad (`BookPreview.tsx:864-867`, "Start mijn prentenboek!"-bericht) verwacht Scenario-A-herkenning die de server niet heeft, dus die flow degradeert mogelijk naar Scenario-B-gedrag zonder de bedoelde meteen-doorpakken-instructie.
  - **Voorstel:** **niet autoFixable** binnen deze review-scope — de opdracht specificeert expliciet "drift = bevinding, NIET autoFixable" en het genereren/synchroniseren van de server-instructies gebeurt via een apart extractie-script ("Generated from config/agents.tsx... re-run the extraction script", `systemInstructions.ts:8-9`) dat buiten deze review-scope valt. **Wel aanbevolen als eigen, aparte fix-taak**: re-run de extractiepipeline voor `verhalen-ontwerper` (en mogelijk andere recent-gewijzigde rollen) om server met client te synchroniseren.
- **Inline-hex in BookPreview (zie Design-sectie)** — geen tech-blocking, wel een onderhoudsrisico; niet apart herhaald hier.

#### ❌ Blocking issues
- Geen — de client/server-drift is functioneel significant maar volgens opdracht-instructie expliciet "bevinding, niet autoFixable"; het is geen technische fout die de missie laat crashen of de leerling blokkeert (beide versies zijn werkende, coherente instructies — de een is alleen beter ontworpen dan de ander).

### Dynamic verificatie
Niet uitgevoerd deze ronde — geen dev-server, geen `.ui-review`-screenshots. Eén historische bevinding (rode CTA) is via code-inspectie geverifieerd als reeds gefixt (zie Design-sectie).

### Score
5/6 statische criteria zonder issues, 1 significante niet-blokkerende bevinding (client/server-drift) · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (met expliciete aanbeveling om de server-instructie-sync als losse vervolgtaak op te pakken — geen blocker voor deze review-cyclus zelf)

---

## Samenvatting

| Aspect | Score | Verdict |
|---|---|---|
| Design | 8.0/10 | ship |
| Didactiek | 8.5/10 | ship |
| Tech | 7.5/10 | ship |

**triageScore** = (10-8.0)×0.3 + (10-8.5)×0.4 + (10-7.5)×0.3 = 0.60 + 0.60 + 0.75 = **1.95** (laag = goed)

**Eindverdict: ok** — geen blocking issues, geen autoFixable code-wijzigingen binnen deze review-scope. Missie is functioneel compleet, correct geregistreerd in alle 8 verwachte bronnen, en actief geleverd (geen dormant-risico — heeft een dedicated `BookPreview`-component naast de chat). De rode-CTA-bevinding uit de vorige platform-audit is bevestigd al gefixt (commit `7183d37`, #190).

**Belangrijkste bevinding deze ronde: client/server systemInstruction-drift.** De server-instructie (die daadwerkelijk aan leerlingen wordt getoond) is een oudere versie dan de client-config — mist de scenario A/B-vertakking (formulier-start vs. vrije start) en de "illustraties op aanvraag i.p.v. automatisch"-herziening. Dit is een reële UX-regressie in productie (leerlingen krijgen de oudere, minder doordachte flow), maar volgens expliciete opdracht-instructie wordt drift gerapporteerd als bevinding, niet als autoFixable wijziging binnen deze review.

**Geen autoFixable wijzigingen voorgesteld binnen deze review-scope.** Twee vervolgtaken worden aanbevolen buiten deze cyclus:
1. Server-instructie-extractiepipeline opnieuw draaien voor `verhalen-ontwerper` om client/server te synchroniseren (tech-bevinding).
2. Optionele, niet-urgente token-migratie van inline-hex naar duck-tokens in `BookPreview.tsx` (bestandsbreed, niet puntsgewijs — design-bevinding).
