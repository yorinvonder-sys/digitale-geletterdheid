# Missiereview: Data Verzamelaar

**MissionId:** `data-verzamelaar` · **Type:** `agent-role` (pure chat + dedicated preview-component) · **Leerjaar:** 1, week 3 · **Config:** `src/config/agents/year1.tsx:2225-2349`
**Datum:** 2026-07-02 · **Wave:** 18 (verse review)

---

## Registratie-check (voorafgaand aan rubrics)

| Bron | Status |
|---|---|
| `agents/year1.tsx:2225-2349` | ✅ agent-rol geregistreerd, `RoleId` |
| `types.ts:27` (RoleId-union) | ✅ `'data-verzamelaar'` aanwezig |
| `agentRoleIds.ts:28` | ✅ `'data-verzamelaar'` in `AGENT_ROLE_IDS`-array |
| `slo-kerndoelen-mapping.ts:66` (autoritair) | ✅ `sloKerndoelen: ['21C','23C']`, `sloVsoKerndoelen: ['18B','20B']`, week 3, yearGroup 1 — comment bevestigt bewuste keuze ("-21B: data-analyse + gemeenteadvies, geen mediawijsheid") |
| `curriculum.ts:109` periode 3 leerjaar 1 | ✅ mission-id staat in "Digitaal Burgerschap" (`sloFocus` bevat 21C) |
| `missionGoals.ts:192-199` | ✅ `primaryGoal`/`criteria`/`evidence` aanwezig, dekt de missie-inhoud correct |
| `basisvaardigheden-mapping.ts:221-227` | ✅ STATISTIEK + PRIVACY_RECHTEN gekoppeld, inhoudelijk correct |
| `missionThumbnails.ts:26` | ✅ eigen thumbnail (`project_data_verzamelaar.webp`) |
| `AiLab.tsx:1355-1356` (leveringspad) | ✅ dedicated `DataVerzamelaarPreview`-component via directe `selectedRole?.id === 'data-verzamelaar'`-check, generieke chat er los naast — geen dormant-chat-risico |

Registratie compleet en consistent over alle acht bronnen. Geen gat.

---

## Platform-inzicht: server- vs. client-side prompt

**BEVINDING (niet autoFixable — drift-signalering, geen fix):** `data-verzamelaar` komt **niet voor** in `supabase/functions/_shared/systemInstructions.ts` (90 sleutels totaal in `SYSTEM_INSTRUCTIONS`, geen match op `data-verzamelaar`). Dat bestand bevat wél `data-journalist` en `ml-trainer` als vergelijkbare data-analyse-rollen.

Consequentie: voor deze missie bestaat geen "échte" server-side system-prompt om tegen te vergelijken — de client-side prompt in `agents/year1.tsx` is de facto de enige actieve bron die de AI aanstuurt. Er is dus geen prompt-drift te constateren (er is niets om mee te vergelijken), maar wel een asymmetrie in dekking: mocht het platform ooit standaard naar server-side prompts overschakelen, ontbreekt hier de bron. Dit is een architecturale/dekkingsobservatie, geen inhoudelijk gebrek in de huidige client-prompt zelf.

---

## 🎨 Design review

**Score: 7.5/10**

### ✅ Geslaagd
- `DataVerzamelaarPreview.tsx` is een bovengemiddeld sterk dedicated component: interactieve staafdiagram (hover-highlight, percentage-labels binnen/buiten de balk afhankelijk van breedte), context-kaarten (leerlingen/school/periode), een expliciete onderzoeksvraag-kaart, en een "Denk na"-toggle die de drie beperkingen pas op leerling-initiatief toont (voorkomt spoilen).
- Duck-tokens correct: uitsluitend `duck-acid/ink/bg`-varianten gebruikt in het preview-component (`bg-duck-acid`, `text-duck-ink`, `border-duck-acid`, `bg-duck-bg`) — geen legacy `lab-*` in dit bestand.
- Stappen-indicator in de preview is functioneel gekoppeld aan `currentStep` (voortgangsring, vinkje bij afgeronde stap) — visuele feedback sluit aan bij de daadwerkelijke voortgang.
- Kleurgebruik in de dataset zelf is bewust neutraal (geen rood/groen-codering die vervoermiddelen als "goed/fout" framet) — passend bij een missie die juist leert dat data neutraal is totdat je 'm interpreteert.

### ⚠️ Aandachtspunten
- **Verkeerde `briefingImage` (bekend, reeds gedocumenteerd — niet als nieuw gerapporteerd):** `agents/year1.tsx:2234` wijst naar `/assets/agents/social_safeguard.webp` — een anti-cyberbullying-schild (HATE/BULLY/MEAN-iconografie) op een missie over dataverzameling/schoolreizen. Dit is al vastgelegd in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (categorie D, KRITIEK/inhoudsbug) en in `business/dgskills-reviews/triage-all-missions-2026-06-15.md` als "stale copy-paste" (7 missies in `year1.tsx` delen ditzelfde pad). Bevestigd nog aanwezig in de huidige code — **niet autoFixable binnen deze review-scope** (asset-koppeling is een platform-brede copy-paste-fout over 7 missies, geen mission-specifieke regel om geïsoleerd te wijzigen zonder de andere 6 te raken).
- **Geen screenshots-map aanwezig** voor `data-verzamelaar` specifiek — dynamische viewport-verificatie (mobiel/tablet/desktop) kon niet worden uitgevoerd deze pass. De platform-brede shared-shell-issues uit de UI/UX-audit (KEES-mascotte-afsnijding op mobiel, lege ruimte onder stappen-kaart) gelden generiek voor alle AiLab-rol-missies inclusief deze, maar zijn geen mission-specifieke bevinding.

### ❌ Blocking issues
Geen.

---

## 📚 Didactiek review

**Score: 8.5/10**

### ✅ Geslaagd
- **Sterke 3-staps onderzoeksopbouw**, authentiek voor de SLO-focus (21C data-geletterdheid, 23C mediawijsheid-aangrenzend): (1) observaties uit een dataset benoemen, (2) kritisch de beperkingen van de dataset ontdekken, (3) een onderbouwd advies formuleren dat data + beperkingen combineert. Dit is een didactisch volwassen opbouw van beschrijven → evalueren → toepassen (Bloom: onthouden/begrijpen → analyseren → evalueren/creëren).
- **Copiloot-principe expliciet geborgd:** systemInstruction bevat letterlijk "Laat ze ZELF conclusies trekken — geef niet direct antwoorden" en in de REGELS-sectie "Geef NOOIT het antwoord direct — laat de leerling zelf redeneren" + "Als de leerling vastloopt, geef een HINT, niet het antwoord". Sterker geformuleerd dan bij veel andere missies.
- **STEP_COMPLETE-criteria zijn concreet en verifieerbaar**, niet vaag: stap 1 vereist expliciet "minimaal 2 observaties", stap 2 "minimaal 2 beperkingen [...] en uitlegt waarom die ertoe doen" (niet alleen benoemen, ook onderbouwen), stap 3 een advies dat data + beperkingen combineert. Dit maakt XP-farming door oppervlakkige antwoorden lastiger dan bij missies met vage voltooiingscriteria.
- **Kritisch denken over data is de kern, niet decoratie:** de drie modelvragen in stap 2 ("kun je dit generaliseren naar heel Nederland?", "zou de data in juni anders zijn?", "wie ontbreken er?") zijn methodologisch correcte, overdraagbare vragen (steekproefgrootte, seizoenseffect, non-respons/selectie-bias) — geen oppervlakkige "data kan liegen"-cliché maar concrete, toepasbare kritiek-categorieën.
- **Thema-check (dataverzameling/privacy) — geen risico:** het scenario is volledig fictief (een gemeente-enquête over vervoermiddelen, 120 anonieme leerlingen uit "een school"). Er wordt nergens gevraagd om échte persoonsgegevens van klasgenoten te verzamelen, te categoriseren of te delen. De dataset is voorgekookte, geanonimiseerde voorbeelddata — geen AVG- of welzijnsrisico. `basisvaardigheden-mapping.ts` koppelt terecht PRIVACY_RECHTEN aan "verantwoorde dataverzameling en toestemming" als reflectiethema, niet als opdracht om zelf data te verzamelen.
- Taalniveau conform B1-richtlijn (bevestigd in `docs/pedagogy/taalniveau-audit-2026-06.md:110`: 🟢, enige "koude term" is "dataset" zelf, wat inherent aan het onderwerp is).

### ⚠️ Aandachtspunten
- **Auditlogging ontbreekt (bekend, reeds gedocumenteerd — niet als nieuw gerapporteerd):** `STEP_COMPLETE`-markers komen uitsluitend via de AI-respons (client-side `parseAndUpdateSteps` in `useAgentLogic.ts`), zonder koppeling aan een server-side `logStepComplete`-auditlog. Dit is expliciet benoemd in `docs/audits/dgskills-all-missions-goal-review-audit-2026-05-10.md:151/183` als "static-only, auditlog niet gekoppeld" en als reden waarom deze — overigens als "beste AiLab-referentiemissie" bestempelde — missie toch op HIGH staat. Consequentie: het bewijs richting de docent dat een leerling de stappen echt heeft doorlopen, steunt volledig op de AI-marker en niet op een onafhankelijk gelogde gebeurtenis. Dit is een platform-brede architectuurkeuze (geldt voor alle `agent-role`-missies zonder losstaand template-component), geen mission-specifiek gebrek — **niet autoFixable binnen deze review-scope**.
- Geen enkele stap vraagt de leerling om een eigen, persoonlijke reflectie te formuleren buiten het scenario (bv. "welke data verzamelt een app die jij gebruikt, en zou je die vertrouwen?") — de missie blijft volledig binnen het gemeente-scenario. Voor leerjaar 1 acceptabel en zelfs wenselijk (focus houden), maar een optionele transfer-vraag zou de overdraagbaarheid naar de eigen leefwereld van de leerling kunnen versterken. Niet blocking, laaghangend fruit voor een latere iteratie.

### ❌ Blocking issues
Geen. Geen welzijnsgevoelige content, geen AVG-risico, SLO-codes correct en inhoudelijk gedekt.

---

## 🔧 Tech review

**Score: 8.0/10**
**Dynamic verificatie:** niet uitgevoerd (geen screenshots-map aanwezig voor `data-verzamelaar`; wel gedekt in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` als bekende bevinding — zie hieronder).

### ✅ Geslaagd
- **Registratie volledig en consistent** over acht onafhankelijke bronnen (RoleId-union, AGENT_ROLE_IDS-array, slo-mapping, curriculum, missionGoals, basisvaardigheden, thumbnails, leveringspad-switch) — geen enkel gat, in lijn met eerdere audits die deze missie als "referentiemissie" bestempelen voor correcte wiring.
- **Leveringspad correct en niet-dormant:** `AiLab.tsx:1355-1356` rendert `DataVerzamelaarPreview` via een expliciete `selectedRole?.id === 'data-verzamelaar'`-check, los van de generieke chatflow. De chat-rol is niet dormant — de rol IS de missie (chat + preview samen), zoals verwacht bij `agent-role`-type zonder `templateType`.
- **`goalCriteria` haalbaar en correct getypeerd:** `type: 'steps-complete', min: 3` komt exact overeen met de drie gedefinieerde `steps` in de config — geen mismatch tussen het aantal vereiste stappen en het aantal daadwerkelijk aangeboden stappen.
- **STEP_COMPLETE-nummering consistent:** de drie markers (`---STEP_COMPLETE:1/2/3---`) in de systemInstruction corresponderen 1-op-1 met de drie `steps`-entries en de drie `BEOORDELINGSCRITERIA`-punten — geen offset- of telfout.
- **Geen prompt-injection-oppervlak:** de dataset is hardcoded in zowel de systemInstruction als het React-preview-component (`DATASET`-constante) — geen leerling-input die naar een backend-query of dynamische databron gaat.
- **`DataVerzamelaarPreview`-component technisch schoon:** correcte TypeScript-typering (`DataVerzamelaarPreviewProps`), geen `any`, geen `dangerouslySetInnerHTML`, lazy-loaded via `React.lazy` (`AiLab.tsx:57`) — consistent met de lazy-load-conventie van de overige preview-componenten in dit bestand.

### ⚠️ Aandachtspunten
- **`briefingImage`-pad technisch fout** (zie Design-sectie) — dit is zowel een visuele als een technische bug: het `briefingImage`-veld verwijst naar een asset dat inhoudelijk niet bij deze missie hoort. Zelfde niet-autoFixable-status als hierboven.
- **Server-side systemInstructions-dekking ontbreekt** (zie Platform-inzicht hierboven) — geen bug in de huidige werking, wel een dekkingsgat mocht het platform ooit op server-side prompts overschakelen.
- Bevestigd in `docs/audits/dgskills-all-missions-goal-review-audit-2026-05-10.md:151`: "static-only en step auditlogging ontbreekt" — zie Didactiek-sectie, hier herhaald omdat het ook een technisch (geen alleen didactisch) gat is: er is geen technisch mechanisme dat de AI-marker onafhankelijk verifieert.

### ❌ Blocking issues
Geen.

---

## Samenvatting

- **Geslaagd:** design 4/6 substantiële criteria · didactiek 6/8 · tech 5/8 (twee bekende, niet-autoFixable platformgaten tellen dubbel mee in design+tech resp. didactiek+tech)
- **Blocking:** 0
- **Resterende issues:** 1 design (verkeerde `briefingImage`, platform-brede copy-paste-fout over 7 missies — niet autoFixable) · 1 didactiek (geen server-side gekoppelde auditlogging van STEP_COMPLETE — platform-architectuurkeuze, niet autoFixable) · 1 tech-dekkingsobservatie (geen server-side systemInstructions-entry, geen actief risico maar wel asymmetrie)
- **Sterkste punt:** de drie-staps onderzoeksopbouw (observeren → kritisch bevragen → onderbouwd adviseren) is didactisch scherp en methodologisch correct (steekproef/seizoen/non-respons als kritiek-categorieën), gecombineerd met een bovengemiddeld interactief preview-component en volledige registratie-consistentie over acht bronnen.
- **Grootste resterend risico:** geen inhoudelijk of welzijnsrisico — het grootste risico is perceptie-schade (verkeerd, thematisch tegenstrijdig hero-beeld bij een overigens sterke missie) en het ontbreken van onafhankelijk auditbewijs voor de docent, beide reeds bekend en platform-breed van aard.

**Triage-score:** (10-7.5)×0.3 + (10-8.5)×0.4 + (10-8.0)×0.3 = 0.75 + 0.60 + 0.60 = **1.95** (laag = gezond)

**Verdict: ALLOW** (geen blocking issues; de twee bekende, reeds gedocumenteerde platformgaten — briefingImage-copypaste en ontbrekende auditlogging — zijn expliciet niet-autoFixable binnen mission-scope en vereisen een platform-brede beslissing, geen missie-specifieke fix)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 18) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing indien de `briefingImage`-copypaste platform-breed wordt aangepakt (7 missies tegelijk raken vergroot het regressierisico).
