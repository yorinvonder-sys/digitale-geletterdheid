# Missie-review: impact-review (wave 18)

**Datum:** 2026-07-02
**TemplateType:** `review-arena`
**Config:** `src/features/missions/templates/review-arena/configs/impact-review.ts`
**Engine:** `src/features/missions/templates/review-arena/ReviewArena.tsx`
**Curriculum:** Leerjaar 3, Periode 3 ("Maatschappelijke Impact & Innovatie"), reviewMissions-slot
**SLO-claim:** `23C` (Maatschappij)
**Agent-rol:** `src/config/agents/year3.tsx:1618` (id `impact-review`) — chat is **dormant**: `enableChat` niet gezet in config, dus `StudentAIChat`-overlay wordt nooit gerenderd (platform-breed patroon, niet opnieuw gerapporteerd)

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (tokens)**: badge-kleuren zijn exacte duck-hex-waarden (`#e1ff01` acid, `#202023` ink, `#ff3c21` error) — `impact-review.ts:16,22,28,34,40`. Geen hardcoded afwijkende kleuren.
- **Criterium 2 (layout consistentie)**: badge-kleurpatroon (acid→ink→ink→ink→error) is identiek aan baseline-missies `security-review.ts` en `data-review.ts` — bewust platform-patroon, geen missie-specifieke afwijking.
- **Criterium 4 (copy-lengte)**: `introDescription` ~24 woorden, ronde-descriptions 9-18 woorden — ruim onder de leerjaar-3-grens (intro <120, opdracht <80).
- **Criterium 6 (Framer Motion)**: engine-gedeeld (`AnimatePresence` in `ReviewArena.tsx`), geen wrapper-spam of overload zichtbaar in de config.

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: unverified — geen screenshots-map gevonden, geen dev-server in scope van deze review-run. Dynamische claims (alignment/overlap/text-fit) kunnen niet bevestigd worden.

### ❌ Blocking issues
- Geen.

### Score
Design: geen bevindingen die de content/tokens van de missie zelf raken (engine is gedeeld en al gevalideerd voor zusterconfigs) · Visual Precision Gate: unverified (geen screenshots) · Aanbeveling: ship

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 3, Periode 3
**SLO-claim:** `23C` (comment `slo-kerndoelen-mapping.ts:181`: "-23B: review = puur maatschappij" — bewuste, beargumenteerde keuze; periode-sloFocus is `23B, 23C, 21D`, review-missie dekt bewust alleen 23C)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23C` is een geldige code, 1 code geclaimd (geen "te veel"/"te weinig").
- **Criterium 2 (SLO-fit)**: sterk geraakt — alle 4 rondes toetsen maatschappelijke impact (digitale kloof, discriminatie, privacy, banenverlies, filterbubble, beleid, AI Act).
- **Criterium 3 (leerdoelen)**: geen `learningObjectives`-array in de config, maar `missionGoals.ts:533-541` levert een concreet, meetbaar impliciet leerdoel ("Ik beoordeel maatschappelijke effecten van technologie en onderscheid kansen van risico's...") met actiewerkwoord en Bloom-niveau evalueren.
- **Criterium 5 (leeftijds-passend)**: jargon wordt consequent uitgelegd tussen haakjes in de follow-up-explanations — "Biometrische data (= gegevens over je lichaam...)" (`impact-review.ts:112`), "de AVG (= de Europese privacywet)" (`:112`), "de EU AI Act (= de Europese AI-wet)" (`:142`), "polarisatie (= groepen tegenover elkaar komen te staan)" (`:160`). Goede praktijk voor leerjaar 3.
- **Criterium 6 (curriculum-plek)**: logische afsluitende reviewmissie van periode 3, na `startup-simulator`/`policy-maker`/`innovation-lab`/`digital-divide-researcher`/`tech-impact-analyst`/`welzijnsonderzoeker`/`startup-pitch` — voorkennis (digitale kloof, impact-analyse, beleid) is in eerdere missies van dezelfde periode aangeboden.
- **Criterium 7 (Bloom-balans)**: goede mix — ronde 1 toepassen (analyse-stappen ordenen), ronde 2 analyseren (technologie-effect koppelen), ronde 3 categoriseren + evalueren (follow-up ethische afweging), ronde 4 kennis + evalueren (follow-up bias-vraag). Niet louter recall.
- **Criterium 9 (welzijn)**: geen gevoelige onderwerpen die welzijnsprotocol vereisen, geen gender-specifieke aannames. VSO-mapping ontbreekt maar is hier niet kritiek (comment beargumenteert de smalle SLO-scope al).

### ⚠️ Aandachtspunten
- **Criterium 3/6 (leerdoel-copy vs. daadwerkelijke rondes)**: `missionObjective` — `src/config/agents/year3.tsx:1626` — luidt *"Bewijs je kennis door kernbegrippen te herhalen, cases te analyseren en alles samen te vatten."* Dit is player-facing tekst (getoond in de missie-briefing vóórdat de leerling de daadwerkelijke `IntroScreen`/rondes ziet) en beschrijft een 3-delig proces (kernbegrippen → cases → samenvatten) dat niet overeenkomt met de daadwerkelijke 4-rondestructuur in `impact-review.ts` (drag-sort sorteren, match-pairs koppelen, categorize kans/risico, rapid-fire waar/onwaar). Er is geen open "cases analyseren" of "in eigen woorden samenvatten" — dat is de (dormant) chat-flow uit `systemInstruction`, niet wat de leerling in de review-arena engine ervaart.
  - **Wat:** de rondetelling/aard in `missionObjective` klopt niet met `config.rounds.length` (4) en de daadwerkelijke rondetypes.
  - **Waarom:** wekt verkeerde verwachtingen bij de leerling over wat de missie inhoudt vóór hij start; de daadwerkelijke `IntroScreen` toont wél correct "In vier ronden toets je je kennis" (`impact-review.ts:9`), dus de mismatch zit specifiek in de briefing-copy in de agent-config, niet in de template zelf.
  - **Voorstel:** herformuleer `missionObjective` zodat het de 4 daadwerkelijke rondetypes dekt.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23C (Maatschappij)**: sterk geraakt — bewijs: alle 4 rondes + beide follow-ups toetsen maatschappelijke effecten, ethiek en beleid rond technologie.

### Score
Didactiek: sterk op SLO-fit, Bloom-balans en jargon-uitleg · 1 niet-blokkerend aandachtspunt (briefing-copy) · Bloom-balans: medium/hoog · Aanbeveling: ship (met kleine copy-fix)

#### Voorstel-blok
```text
❌ Huidig — src/config/agents/year3.tsx:1626
missionObjective: 'Bewijs je kennis door kernbegrippen te herhalen, cases te analyseren en alles samen te vatten.',

✅ Voorgesteld
missionObjective: 'Bewijs je kennis door impact-analyse-stappen te ordenen, technologieën aan effecten te koppelen, kansen van risico\'s te onderscheiden en snelle kennisvragen te beantwoorden.',
```

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen screenshots-map gevonden, geen dev-server in scope van deze review-run

### Static analyse
#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline)**: config is volledig getypeerd via `ReviewArenaConfig`, geen `any` of `@ts-ignore` in `impact-review.ts`.
- **Criterium A6 (restart-safe state)**: engine gebruikt `useMissionAutoSave` (`ReviewArena.tsx:118`) — van toepassing op deze missie, voortgang wordt bewaard.
- **Registratie-consistentie**: `templateRegistry.ts:44` → `review-arena`, `curriculum.ts:295` → reviewMissions-slot periode 3, `missionGoals.ts:533` → aanwezig, `slo-kerndoelen-mapping.ts:181` → aanwezig. Alle 4 registratiepunten kloppen (geen missie-in-UI-maar-niet-in-SLO of vice versa).
- **Client/server systemInstruction-drift**: client (`year3.tsx:1638-1712`) en server (`supabase/functions/_shared/systemInstructions.ts:93`) zijn woord-voor-woord identiek voor `impact-review` — geen drift gevonden. (Chat is toch dormant voor deze missie, dus dit is puur ter controle.)

#### ⚠️ Aandachtspunten
- Geen missie-specifieke tech-bevindingen — de config bevat geen handlers/UI-code (puur data), dus A1/A2/A4/A5/A7 zijn engine-verantwoordelijkheid en al gedekt door zusterconfigs.

#### ❌ Blocking issues
- Geen.

### Feitelijke + reken-verificatie (verplicht voor review-arena)
- **Ronde 1 (drag-sort, max 25)**: volgorde technologie → gebruikers → positief → negatief → ethiek → beleid is een coherente, standaard impact-analyse-methodiek. Feitelijk correct.
- **Ronde 2 (match-pairs, max 25)**: alle 5 paren (gezichtsherkenning→privacy, sollicitatie-algoritme→discriminatie, leerplatform→digitale kloof, automatisering→banenverlies, aanbevelingsalgoritme→filterbubble) zijn feitelijk correct en didactisch gangbaar.
- **Ronde 3 (categorize, max 25 + follow-up bonus 5)**: alle 8 items eenduidig gecategoriseerd als Kans/Risico, geen dubbelzinnige items. Follow-up (gezichtsherkenning op scholen, correctIndex 1 = biometrische data minderjarigen zonder toestemming) is feitelijk en juridisch correct (AVG bijzondere persoonsgegevens).
- **Ronde 4 (rapid-fire, max 25 + follow-up bonus 5)**: alle 8 waar/onwaar-antwoorden feitelijk correct geverifieerd. Follow-up (AI-sollicitatiesysteem, correctIndex 1 = historische bias-overname) feitelijk correct en actueel (EU AI Act-relevant).
- **Score-optelling**: 4 rondes × maxScore 25 = 100 = `config.maxScore`. Klopt.
- **Follow-up-bonus-cap**: engine capt `finalScore = Math.min(base + bonus, round.maxScore)` (`ReviewArena.tsx:195`) — generiek engine-gedrag (niet missie-specifiek), bonus kan de ronde-max nooit overschrijden. Geen overflow t.o.v. `config.maxScore=100` of badge-drempel 90.
- **Rondetelling in missionObjective vs. config.rounds.length**: **mismatch** — zie Didactiek-sectie hierboven (missionObjective beschrijft 3 fasen, engine heeft 4 rondes).
- **missionGoals-evidence vs. daadwerkelijke toetsing**: evidence ("impact-analyse opzetten... kans of risico") dekt ronde 1+3 expliciet; ronde 2 (technologie-effect koppeling) en ronde 4 (feitenkennis digitale kloof/AI Act/ethiek) worden niet letterlijk genoemd maar vallen onder de bredere `primaryGoal`-formulering. Geen harde fout, wel een lichte onvolledigheid — niet autoFixable-waardig (te subjectief voor een mechanische fix).

### Score
Static: sterk, geen blocking · Dynamic: n.v.t. (geen dev-server/screenshots in scope) · Aanbeveling: ship

## Samenvatting

Missie is inhoudelijk feitelijk correct (alle 4 rondes + 2 follow-ups geverifieerd), scoring/maxScore/bonus-cap kloppen, en alle registratiepunten (templateRegistry/curriculum/missionGoals/SLO-mapping) zijn consistent. Enige aandachtspunt: de player-facing `missionObjective` in de agent-config beschrijft een ander (3-delig, chat-achtig) proces dan de daadwerkelijke 4-rondestructuur van de review-arena — niet-blokkerend, eenvoudig te fixen met een tekst-tweak.

**Verdict: ok** (geen blocking issues, één niet-blokkerend autoFixable aandachtspunt).
