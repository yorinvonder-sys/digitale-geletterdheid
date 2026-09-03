# Rubric-review: deepfake-detector

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted component)
**Bestand:** `src/features/missions/DeepfakeDetectorMission.tsx`
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Mission:** deepfake-detector (dedicated/handcrafted)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** consistent `duck-*` gebruik (`duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`, `duck-error`), geen hex-literals of niet-doeldomein tokens — `src/features/missions/DeepfakeDetectorMission.tsx:221,367,628`.
- **Criterium 2 (Layout):** N.v.t. (handcrafted, geen template-baseline).
- **Criterium 3 (Knop-clarity):** alle knoppen hebben label + icon + `hover:*`-state; icon-only knoppen (`onBack`, chat-toggle) hebben `aria-label` — `:492-497`, `:528-535`.
- **Criterium 4 (Copy-lengte):** leerjaar 1-grens (intro <80 wrd, opdracht <60 wrd) wordt gehaald; challenge-content zit rond 25-45 woorden, IntroScreen-description rond 30 woorden — `:75,89,102,354-355`.
- **Criterium 5 (Responsive, statisch):** `max-w-2xl mx-auto`, `grid-cols-2`, `sm:inline` — geen vaste pixel-widths — `:578,603,534`.
- **Criterium 6 (Motion):** geen Framer Motion in gebruik (alleen `animate-in`/`animate-pulse` Tailwind-utilities); N.v.t.
- **Criterium 7 (Toegankelijkheid):** progressbar heeft volledige `role/aria-valuenow/aria-valuemax/aria-label` — `:540-546`; feedback dubbelt kleur met icoon (Check/X) + tekst, niet kleur-only — `:628-643`.
- **Visual Precision Gate:** static beoordeling toont geen aantoonbare overlap/afkap-risico's in de JSX-structuur; **geen dynamische Chrome-plugin verificatie uitgevoerd** (geen dev-server in scope van deze rubric-pass) — status: *unverified* voor multi-viewport gedrag.

### ⚠️ Aandachtspunten
- Geen materiële bevindingen op static niveau.

### ❌ Blocking issues
- Geen.

### Score
7/7 statisch toepasbare criteria geslaagd · Visual Precision Gate: **unverified** (geen dynamische browser-pass) · Aanbeveling: **ship** (met kanttekening dat multi-viewport nooit dynamisch is bevestigd)

---

## 📚 Didactiek review

**Mission:** deepfake-detector (dedicated)
**Curriculum-plek:** Leerjaar 1, Periode 3 ("Digitaal Burgerschap") — `src/config/curriculum.ts:110`
**SLO-claim:** `21B, 21D, 23A, 23C` (regulier) · `18B, 18C, 20A` (VSO) — `src/config/slo-kerndoelen-mapping.ts:70`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** alle codes bestaan en horen bij het juiste profiel (regulier vs. VSO) — `src/config/slo-kerndoelen-mapping.ts:70`.
- **Criterium 2 (SLO-fit):** `21B` (media-analyse) en `21D` (AI) worden substantieel geraakt door de kernactiviteit (herkennen van AI-content); `23A` (veiligheid) komt terug in de challenge-vragen over controleren/beschermen (bv. `DeepfakeDetectorMission.tsx:124-125`).
- **Criterium 3 (Leerdoelen):** `MISSION_GOAL.primaryGoal` is concreet en actiewerkwoord-gestuurd ("Ik herken... en maak een kort actieplan") — `:39-47`.
- **Criterium 4 (Beknoptheid):** challenge-content en -vragen blijven ruim binnen de leerjaar-1-grenzen (<60 wrd per opdracht).
- **Criterium 5 (Leeftijds-passend):** herkenbare, alledaagse voorbeelden (hond met 7 poten, nieuwsbericht, chatbot-vriendinnetje) — geen onuitgelegd jargon.
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in J1P3 "Digitaal Burgerschap", naast `data-detective`/`ai-spiegel`/`social-safeguard` — thematisch coherent.
- **Criterium 7 (Bloom-balans):** mix aanwezig — classificatie (herkennen/onthouden-toepassen) per challenge, gevolgd door een `challengeQuestion` op hoger Bloom-niveau (analyseren/evalueren, bv. "Hoe zou jij dit essay herschrijven..." — `:167`).
- **Criterium 8 (AI-as-copilot):** `StudentAIChat` krijgt alléén `roleId` + context mee; `systemInstruction` wordt server-side bepaald (bekende valkuil — geen bevinding) — `:554-575`.
- **Criterium 9 (Welzijn/VSO):** VSO-mapping aanwezig, VSO-varianten van challengeQuestion voor dagbesteding-profiel (`challengeQuestionVso`) worden consequent toegepast — `:64,678-681`.

### ⚠️ Aandachtspunten
- **Criterium 1 — te veel SLO-codes**: `sloEntry.sloKerndoelen` claimt 4 codes (`21B, 21D, 23A, 23C`) — `src/config/slo-kerndoelen-mapping.ts:70`.
  - **Wat:** rubric-drempel is >3 kerndoelen = warning, want één missie raakt zelden 4 kerndoelen serieus.
  - **Waarom:** risico op verwatering van de SLO-claim richting docentrapportage — als `23C` (Maatschappij) alleen impliciet wordt aangeraakt via de uitleg-teksten en niet via een eigen opdracht-onderdeel, is de claim zwakker dan de andere drie.
  - **Voorstel:** ofwel `23C` laten vervallen (de kern van de missie is media-analyse + AI-herkenning + veiligheid, niet primair "maatschappij"), ofwel één challenge expliciet aan het maatschappelijke aspect (bv. impact van desinformatie op de samenleving) koppelen zodat de claim aantoonbaar sterk is voor alle 4 codes. Comment in de mapping ("+23A: strafbaarheid + jezelf beschermen") suggereert dat dit al bewust is afgewogen — dit is dus eerder een documentatie- dan een inhoudsfout.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21B (Media & Informatie):** sterk geraakt — kernactiviteit is media-analyse.
- **21D (AI):** sterk geraakt — expliciete focus op AI-herkenning.
- **23A (Veiligheid & privacy):** sterk geraakt — challengeQuestions vragen controle-/beschermingsgedrag.
- **23C (Maatschappij):** oppervlakkig — komt terug in `explanation`-teksten maar heeft geen eigen opdracht-onderdeel.

### Score
8/9 criteria geslaagd (1 aandachtspunt, geen blocking) · Bloom-balans: medium (mix van toepassen + analyseren/evalueren) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** deepfake-detector (dedicated)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server in scope van deze rubric-pass (statische code-analyse only)

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** elke `<button>` heeft een functionele `onClick` (antwoord-knoppen, hint-knop, next-knop, level-knop, chat-toggle) — geen dode knoppen gevonden.
- **A3 (TypeScript-discipline):** geen `any`, `as any`, `@ts-ignore` of `@ts-expect-error` in het bestand; `Props` en `DeepfakeDetectorState` zijn expliciet getypeerd — `:18-37`.
- **A4 (Imports via alias):** alle cross-module imports lopen via `@/*` (`@/types`, `@/hooks/useMissionAutoSave`, `@/features/ai-chat/StudentAIChat`, `@/features/missions/templates/shared/IntroScreen`); de enige relatieve import is een sibling type-import binnen dezelfde map (`./templates/shared/types`), niet een `../../`-pad — `:10-16`.
- **A6 (Restart-safe state):** `useMissionAutoSave` direct aangeroepen, `scoredChallengeIds` voorkomt dubbele scoring na reload (expliciete idempotency-guard met code-comment) — `:258-271,296-300`.
- **A7 (Security):** geen `dangerouslySetInnerHTML`; alle content is statisch app-eigen (geen leerling-input naar DOM); `systemInstruction` wordt niet client-side gedefinieerd — alleen `roleId="deepfake-detector"` wordt doorgegeven aan `StudentAIChat`, resolutie gebeurt server-side — `:556`.

#### ⚠️ Aandachtspunten
- **A2 (Error states) — n.v.t. maar niet expliciet benoemd**: het component bevat zelf geen async operaties (geen directe `supabase.functions.invoke`) — AI-chat-gedrag zit in `StudentAIChat`, buiten deze missie-eigen scope.
  - **Wat:** geen loading/error-state nodig in dit bestand omdat er geen eigen async-call is.
  - **Risico:** geen — dit is een correcte afwezigheid, geen gat.
  - **Voorstel:** geen actie nodig; genoteerd ter volledigheid van de rubric.
- **Ongebruikte prop `stats`**: `Props.stats?: UserStats` wordt gedeclareerd maar nergens gedestructureerd of gebruikt in de component-body — `:34`.
  - **Wat:** de prop wordt door de caller mogelijk meegegeven maar heeft geen effect.
  - **Risico:** laag — geen functionele impact, wel dode interface-oppervlakte.
  - **Voorstel:** verwijderen als de prop echt nergens voor dient, of gebruiken als bedoeld was om bv. streak-historie te tonen. Niet blocking.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — deze rubric-pass had geen dev-server tot haar beschikking. Multi-viewport/console/network-bewijs ontbreekt; markeer als **unverified**, niet als "geslaagd".

### Score
Static: 5/6 toepasbare criteria geslaagd (1 klein aandachtspunt: ongebruikte prop) · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship**

---

## Voorstellen

### Voorstel 1 — SLO-claim `23C` verstevigen of laten vervallen (didactiek)

```ts
// ❌ Huidig — src/config/slo-kerndoelen-mapping.ts:70
{ id: 'deepfake-detector', title: 'Deepfake Detector', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] }, // +23A: strafbaarheid + jezelf beschermen

// ✅ Voorgesteld (optie A — claim laten vervallen als er geen eigen maatschappij-opdracht komt)
{ id: 'deepfake-detector', title: 'Deepfake Detector', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D', '23A'], sloVsoKerndoelen: ['18B', '18C', '20A'] }, // 23C optioneel: alleen claimen als een challenge het maatschappelijke aspect expliciet behandelt
```

*Optie B (claim behouden): voeg één `challengeQuestion` toe die expliciet de maatschappelijke impact van desinformatie bevraagt, bv. bij `e2` ("Wat gebeurt er met het vertrouwen in nieuws als niemand meer weet wat echt is?"). Dit is een keuze voor Yorin — geen mechanische auto-fix, want het raakt contentkeuze.*

### Voorstel 2 — ongebruikte `stats`-prop opruimen (tech, optioneel)

```tsx
// ❌ Huidig — src/features/missions/DeepfakeDetectorMission.tsx:31-37
interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
    userId?: string; // voor AI-copiloot
}

// ✅ Voorgesteld (als stats echt nergens voor dient in deze missie)
interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    vsoProfile?: VsoProfile;
    userId?: string; // voor AI-copiloot
}
```

*Niet automatisch toegepast in deze pass — vereist controle of de caller (`TemplateMissionRouter` / dashboard) deze prop nog ergens anders verwacht te zien geaccepteerd. Laag risico, geen functionele impact.*

---

## Samenvatting & verdict

De **deepfake-detector**-missie is een solide, goed opgebouwd handcrafted mission: consistente `duck-*` styling, geen dode knoppen, restart-safe state met een expliciete idempotency-guard tegen dubbele scoring, server-side AI-instructie, en een consequent toegepaste 3-stappenmethode (herkenning → uitleg → verdiepingsvraag) inclusief VSO-varianten. De enige twee aandachtspunten zijn licht: een mogelijk te ruime SLO-claim (4 codes, waarvan `23C` oppervlakkig geraakt wordt) en een ongebruikte `stats`-prop. Geen van beide is blocking. Multi-viewport/dynamische verificatie is in deze pass niet uitgevoerd en blijft *unverified*.

**Scores:** Design 8/10 · Didactiek 7,5/10 · Tech 8,5/10
**Verdict: ship** (met de kanttekening dat een dynamische Chrome-plugin-pass nog los bevestigd moet worden voor de Visual Precision Gate).

**AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).**
