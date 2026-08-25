# Rubric-review: datalekken-rampenplan

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted, geen config/engine-scheiding)
**Bron:** `src/features/missions/DatalekkenRampenplanMission.tsx` (914 regels)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (rubric, static-only)
**Criterium 2 (layout consistentie):** N.v.t. — handcrafted, geen template-baseline.

### ✅ Geslaagd
- **Criterium 1 (tokens):** consistent `duck-*`-gebruik door de hele file (`duck-ink`, `duck-acid`, `duck-gray`, `duck-bg`, `duck-error`), geen `lab-*`-mix, geen niet-doeldomein Tailwind-kleuren (op één uitzondering na, zie hieronder).
- **Criterium 3 (knop-clarity):** alle actieknoppen hebben label + duidelijke context ("Dien analyse in", "Bevestig volgorde", "Verstuur brief", "Beveiligingsplan indienen"), geen generieke "Klik hier"/"OK".
- **Criterium 4 (copy-lengte):** intro ~24 woorden, fase-omschrijvingen ~30-40 woorden, bewijs-/brief-items <25 woorden — ruim binnen de leerjaar 1-2 grens (intro <80, opdracht <60).
- **Criterium 5 (responsive):** `max-w-lg`/`max-w-sm` + `w-full`, geen vaste pixel-breedtes; geen viewport-brekende constructies gevonden in de static scan.
- **Criterium 6 (Framer Motion):** niet gebruikt in dit component — n.v.t., geen wrapper-spam.

### ⚠️ Aandachtspunten
- **Criterium 1 — hardcoded hex i.p.v. token** — `DatalekkenRampenplanMission.tsx:783`
  - **Wat:** de "Missie Voltooid!"-knop gebruikt `focus-visible:ring-[#5F947D]`, terwijl elke andere actieknop in dezelfde file `focus-visible:ring-duck-acid` gebruikt (bv. regel 903).
  - **Waarom:** breekt de token-consistentie; als `duck-acid` ooit wijzigt in `design.md`, mist deze ene knop de update.
  - **Voorstel:** vervang door `focus-visible:ring-duck-acid` (of `duck-ink` als bewust contrast met de groene knopkleur bedoeld is — maar dat token bestaat niet, dus terug naar `duck-acid`).

- **Criterium 3/6 — hover-state is een no-op op 5 knoppen** — `DatalekkenRampenplanMission.tsx:304,399,507,618,783,903`
  - **Wat:** patronen als `bg-duck-acid hover:bg-duck-acid` en `bg-duck-ink hover:bg-duck-ink` — de hover-kleur is identiek aan de basiskleur, dus er is geen enkel visueel hover-feedback op desktop.
  - **Waarom:** leerlingen op laptop/desktop (docent-view, extern beeldscherm) krijgen geen hover-bevestiging dat een knop interactief is; niet blocking (de knop werkt functioneel), maar wel een gemiste microinteractie die in andere missies wél aanwezig is.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — regel 304
    className={`... ${
        selected.length > 0
            ? 'bg-duck-acid hover:bg-duck-acid text-duck-ink'
            : ...
    }`}

    // ✅ Voorgesteld
    className={`... ${
        selected.length > 0
            ? 'bg-duck-acid hover:bg-duck-acid/80 text-duck-ink'
            : ...
    }`}
    ```
    Zelfde patroon toepassen op regel 399, 507, 618, 783 (`hover:bg-duck-ink/80`), 903.

- **Criterium 7 — icon-only knop zonder `aria-label`** — `DatalekkenRampenplanMission.tsx:334-336`
  - **Wat:** de reset-knop in de prioriteiten-fase (`<RotateCcw size={14} />`) heeft geen zichtbaar label en geen `aria-label`.
  - **Waarom:** screenreader-gebruikers horen alleen "knop" zonder functie-omschrijving.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — regel 334
    <button onClick={onReset} className="text-duck-ink/60 hover:text-duck-ink transition-colors">
        <RotateCcw size={14} />
    </button>

    // ✅ Voorgesteld
    <button onClick={onReset} aria-label="Volgorde opnieuw instellen" className="text-duck-ink/60 hover:text-duck-ink transition-colors">
        <RotateCcw size={14} />
    </button>
    ```

- **Criterium 3 — terug-knop geeft geen visuele feedback dat hij inactief is** — `DatalekkenRampenplanMission.tsx:174-190, 651-654`
  - **Wat:** `PhaseHeader` rendert altijd dezelfde actieve terug-pijl (`ArrowLeft`), maar `goBackPhase` doet letterlijk niets zodra `currentPhaseIndex > 0` (zie tech review voor het functionele deel). Visueel oogt de knop in élke fase klikbaar.
  - **Waarom:** een leerling die op fase "brief" of "budget" op terug klikt, verwacht een reactie en krijgt niets — verwarrend, geen foutmelding.
  - **Voorstel:** toon de knop alleen (of in disabled-stijl) wanneer `currentPhaseIndex === 0`; zie tech-voorstel hieronder voor de exacte snippet.

### ❌ Blocking issues
- Geen. Visual Precision Gate: **WARN** — statisch geen overlap/afkapping aangetroffen, maar dynamische Chrome-plugin-verificatie (multi-viewport, alle states) is niet uitgevoerd in deze batch-review-pass; markeer als unverified totdat een dynamic-pass draait.

### Score
**Design: 6.5/10** · Aanbeveling: fix-eerst (mechanische fixes, geen herontwerp)

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 3 ("Digitaal Burgerschap")
**SLO-claim (canoniek, `slo-kerndoelen-mapping.ts:79`):** `23A`, `21A` · VSO: `20A`, `18A`

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** `23A` (Veiligheid & privacy) en `21A` (Digitale systemen) zijn beide geldige regulier-codes; `20A`/`18A` geldige VSO-codes. Twee codes — binnen de grens van max 3.
- **Criterium 2 (SLO-fit `23A`):** sterk geraakt — de hele missie (bewijs, prioriteiten, brief, budget) draait om een datalek-crisis, precies het domein van `23A`.
- **Criterium 5 (vocabulary):** vakjargon ("data-exfiltratie", "brute-force aanval", "penetratietest") wordt steeds direct uitgelegd met een `(= ...)`-parenthese, passend bij leerjaar 1 zonder te betuttelen — zie `DatalekkenRampenplanMission.tsx:49-54, 113-117`.
- **Criterium 6 (curriculum-plek):** logisch geplaatst ná een reeks data-/privacymissies (`data-detective`, `cookie-crusher`, `mail-detective`, `data-handelaar`, `filter-bubble-breaker`) in dezelfde periode — bouwt voort op eerder aangeboden voorkennis, geen sprong.
- **Criterium 7 (Bloom-balans):** sterke mix — bewijs selecteren = analyseren, prioriteiten ordenen = toepassen/analyseren, briefonderdelen kiezen = evalueren, budget verdelen = evalueren/toepassen. Geen pure onthoud-vragen, en de hogere Bloom-niveaus zijn scaffolded via multiple-choice-achtige selectie (niet vrije tekst), wat het passend houdt voor leerjaar 1.
- **Criterium 8 (AI-as-copilot):** n.v.t. — component gebruikt geen chat/AI-interactie (bewust deterministisch, vergelijkbaar met het `game-programmeur`-patroon).

### ⚠️ Aandachtspunten
- **Criterium 2 (SLO-fit `21A`) — oppervlakkig contact** — `DatalekkenRampenplanMission.tsx` (hele component) vs. `slo-kerndoelen-mapping.ts:79`
  - **Wat:** de mapping-comment motiveert `21A` (Digitale systemen) met "security incident = systeemdenken", maar de missie zelf bevat geen inhoud over hoe digitale systemen technisch in elkaar zitten — het is puur crisismanagement/communicatie/besluitvorming.
  - **Waarom:** leerlingen oefenen `21A` niet substantieel; de claim is verdedigbaar maar dun.
  - **Voorstel:** geen code-wijziging nodig — optioneel: in fase "Actieplan Opstellen" één regel toevoegen die expliciet het systeemperspectief benoemt (bv. "welk systeem is geraakt en waarom kon dit gebeuren"), maar dit is een verrijking, geen blocker.

- **Criterium 9 (welzijn) — datalek-scenario noemt BSN-nummers van leerlingen als gelekte data** — `DatalekkenRampenplanMission.tsx:90`
  - **Wat:** het letterblok "Welke gegevens" noemt expliciet "BSN-nummers van alle leerlingen" als gelekt.
  - **Waarom:** voor leerjaar 1 (12-13 jaar) is dit een realistisch maar stevig scenario; geen bekende leerling wordt genoemd (fictief), dus geen privacyrisico, maar het maakt het scenario emotioneel zwaarder dan een gemiddelde digi-burgerschap-opdracht.
  - **Voorstel:** context, geen fout — de `tone="crisis"` in de `IntroScreen`-call (regel 693) erkent dit al bewust. Geen wijziging vereist.

### ❌ Blocking issues
- **SLO-mismatch tussen leerling-dashboard en canonieke mapping** — `src/features/student/ProjectZeroDashboard.tsx:158` vs. `src/config/slo-kerndoelen-mapping.ts:79`
  - **Wat:** het dashboard toont `sloKerndoelen: ['23A', '23B', '23C']` en `sloVsoKerndoelen: ['20A', '20B']` voor deze missie, terwijl de canonieke mapping `['23A', '21A']` / `['20A', '18A']` claimt. De mapping-comment zegt zelfs expliciet "-23B,-23C,+21A" — het dashboard is nooit bijgewerkt na die correctie.
  - **Waarom:** schendt de missie-invariant in `src/features/missions/CLAUDE.md` ("coherente identiteit ... slo-kerndoelen-mapping.ts"). Leerlingen zien op het dashboard andere kerndoelen dan wat er daadwerkelijk geregistreerd wordt voor docentrapportage — een docent die op `23B`/`23C`-voortgang filtert, ziet deze missie ten onrechte meetellen, terwijl `21A` nergens in de leerling-facing UI zichtbaar is.
  - **Voorstel:** `ProjectZeroDashboard.tsx` bijwerken naar de canonieke codes. **Dit bestand valt buiten de auto-fix-whitelist van deze review-run** (alleen `DatalekkenRampenplanMission.tsx`, `templateRegistry.ts`, `agents/year*.tsx`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `missionGoals.ts` mogen automatisch gepatcht worden) — daarom hier als **escalation** gerapporteerd i.p.v. autoFixable.

### SLO-fit oordeel
- **23A**: sterk geraakt — bewijs: hele missie (alle 4 fases).
- **21A**: oppervlakkig — bewijs: geen systeemtechnische inhoud, alleen procesmatig.

### Score
**Didactiek: 7.5/10** · Bloom-balans: **hoog** (sterk voor leerjaar 1) · Aanbeveling: fix-eerst (SLO-dashboardsync buiten scope van deze missie-file)

---

## 🔧 Tech review

**Dynamic verificatie:** overgeslagen — deze batch-review-pass draait static-only, geen dev-server beschikbaar/opgestart voor deze wave.

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** elk `<button>` heeft een functionele `onClick`; geen dode handlers of `cursor-pointer`-divs zonder handler gevonden.
- **A2 (error states):** n.v.t. — component doet geen async/netwerkcalls, dus geen loading/error-state nodig.
- **A4 (imports via alias):** alle imports gaan via `@/hooks/...`, `@/config/...`, `@/features/...` — geen relatieve `../../`-paden.
- **A5 (edge function calls):** n.v.t. — geen `supabase.functions.invoke` of AI-call in dit component.
- **A6 (restart-safe state):** `useMissionAutoSave('datalekken-rampenplan', INITIAL_STATE)` direct aangeroepen (regel 631) — voortgang overleeft een refresh.
- **A7 (security):** n.v.t. — geen leerling-input naar AI, geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`.

#### ⚠️ Aandachtspunten
- **A3 — expliciete `any`-props, ongebruikt** — `DatalekkenRampenplanMission.tsx:10-11`
  - **Wat:** `stats?: any; vsoProfile?: any;` in de `Props`-interface. Beide props worden nergens in het component gebruikt (bevestigd met grep — geen enkele referentie naar `stats` of `vsoProfile` in de body).
  - **Risico:** direct geen runtime-risico (ze worden niet gebruikt), maar het is dead code + een TS-discipline-schending die andere developers kan misleiden ("dit component gebruikt vsoProfile" terwijl dat niet zo is).
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — regel 7-12
    interface Props {
        onBack: () => void;
        onComplete: (success: boolean) => void;
        stats?: any;
        vsoProfile?: any;
    }

    // ✅ Voorgesteld
    interface Props {
        onBack: () => void;
        onComplete: (success: boolean) => void;
    }
    ```
    (Alleen doen als geen enkele aanroeper deze props verplicht doorgeeft als vereist shape — bij twijfel: laat staan en typeer concreet i.p.v. verwijderen. Zie escalatie hieronder.)

- **A1 (functioneel) — terug-knop is een no-op na fase 1** — `DatalekkenRampenplanMission.tsx:651-654` + `PhaseHeader` op regel 823-828
  - **Wat:** `goBackPhase` bevat alleen `if (currentPhaseIndex === 0) setPhase('intro');` — voor `priorities`/`letter`/`budget` gebeurt er niets bij een klik, terwijl de knop er in elke fase identiek en actief uitziet.
  - **Risico:** geen dataverlies of crash, maar een leerling die verwacht terug te kunnen navigeren krijgt zonder feedback niets — verwarrend gedrag, telt als "onduidelijke functie" op A1.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — regel 823-828
    <PhaseHeader
        currentPhase={currentPhaseIndex}
        totalPhases={4}
        totalScore={currentRunningScore}
        onBack={goBackPhase}
    />

    // ✅ Voorgesteld — PhaseHeader alleen de knop tonen op fase 0
    <PhaseHeader
        currentPhase={currentPhaseIndex}
        totalPhases={4}
        totalScore={currentRunningScore}
        onBack={currentPhaseIndex === 0 ? goBackPhase : undefined}
    />
    ```
    En in `PhaseHeader` (regel 168-190) de knop conditioneel renderen als `onBack` ontbreekt (of `disabled`/lagere opacity tonen). Vereist een kleine aanpassing van de `PhaseHeader`-signatuur — grens tussen "mechanische fix" en "kleine refactor"; zie autoFixable-lijst.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd voor deze wave — geen dev-server-instantie beschikbaar binnen scope van deze rubric-pass. Multi-viewport/console/network-verificatie is een aanbevolen vervolgstap vóór een definitieve ship-beslissing (zie Visual Precision Gate: WARN in design-sectie).

### Score
Static: **7/10** · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: fix-eerst

---

## Voorstellen (samengevat)

Zie per sectie hierboven voor de volledige before/after-snippets. Mechanisch toepasbaar binnen `DatalekkenRampenplanMission.tsx`:
1. Regel 783: hardcoded hex → `focus-visible:ring-duck-acid`.
2. Regel 304, 399, 507, 618, 903: hover-no-op → `hover:bg-duck-acid/80` (resp. `hover:bg-duck-ink/80` op 783).
3. Regel 334-336: `aria-label="Volgorde opnieuw instellen"` toevoegen aan reset-knop.
4. Regel 10-11: overweeg verwijderen van ongebruikte `stats?: any; vsoProfile?: any;` (of vervang door een concreet type als toch bedoeld voor toekomstig gebruik — controleer eerst bij Yorin, want dit raakt een gedeeld `Props`-patroon dat mogelijk ook in andere missies voorkomt).
5. Regel 651-654 + 823-828: terug-knop deactiveren/verbergen ná fase 1.

**Niet auto-fixbaar binnen deze review (buiten whitelist):**
- `src/features/student/ProjectZeroDashboard.tsx:158` — SLO-codes bijwerken naar `['23A','21A']` / VSO `['20A','18A']` zodat ze overeenkomen met de canonieke `slo-kerndoelen-mapping.ts`.

---

## Samenvatting & verdict

De missie is inhoudelijk sterk: een goed opgebouwde 4-fasen crisissimulatie met heldere jargon-uitleg, een sterke Bloom-balans voor leerjaar 1, en technisch een schone, deterministische component zonder AI-/security-risico's (geen chat, geen edge-function-calls, dus die hele risicoklasse is hier gewoon niet van toepassing — geen tekortkoming). De gevonden problemen zijn stuk voor stuk klein en mechanisch: een hardcoded kleurwaarde, een paar no-op hover-states, één ontbrekend `aria-label`, twee ongebruikte `any`-props, en een terug-knop die op latere fases niets doet. Het enige structurele probleem is de SLO-mismatch tussen het leerling-dashboard en de canonieke mapping — dat is een data-integriteitsfout die de docentrapportage raakt, maar buiten de bestandsscope van deze missie-review valt.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

**Verdict: fix-eerst** — geen herontwerp nodig; de mechanische fixes in `DatalekkenRampenplanMission.tsx` kunnen in één kleine PR, en de dashboard-SLO-sync is een aparte, gerichte 1-regel-fix die een andere agent/reviewer met bredere scope moet oppakken.
