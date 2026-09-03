# Missie-review: Data voor Data

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted component)
**Bestand:** `src/features/missions/DataVoorDataMission.tsx`
**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim:** 23A (Veiligheid & privacy), 23C (Maatschappij) · VSO 20A, 20B

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet, batch-review)
**Criterium 2 (layoutconsistentie):** N.v.t. (handcrafted, geen template-baseline)

### ✅ Geslaagd
- **Criterium 1 (tokens, algemeen):** consistent gebruik van `duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`, `duck-error` door de hele component; geen legacy `lab-*` tokens.
- **Criterium 3 (knop-clarity):** elke knop heeft een functionele `onClick`, duidelijk label + icon (DEAL/NO DEAL, Trophy, ChevronRight); back-knop heeft `aria-label` — `DataVoorDataMission.tsx:162`.
- **Criterium 4 (copy-lengte):** intro-copy en rondetekst passen ruim binnen de leerjaar-1-grens (intro <80 woorden, opdracht <60 woorden) — `DataVoorDataMission.tsx:229`.
- **Criterium 5 (responsive):** geen vaste pixel-widths, `max-w-lg`/`max-w-sm` + `w-full`, `flex-wrap` op databadges — `DataVoorDataMission.tsx:157, 267-271`.
- **Criterium 6 (motion):** geen Framer Motion-wrapperspam; overgangen lopen via CSS `transition-all duration-300`, functioneel toegepast op state-wissels.
- **Criterium 7 (a11y, basis):** interactieve knoppen hebben `focus-visible:ring-*`; risico wordt dubbel gecodeerd (kleur + tekstlabel `RISK_LABELS`), niet uitsluitend via kleur — `DataVoorDataMission.tsx:273-274`.

### ⚠️ Aandachtspunten
- **Criterium 1 — hardcoded hex i.p.v. duck-token**: `focus-visible:ring-[#5F947D]` — `DataVoorDataMission.tsx:342, 418`.
  - **Wat:** twee knoppen (DEAL-knop, "Missie Voltooid") gebruiken een losse hex-kleur voor de focus-ring terwijl de rest van de knop al met `duck-ink` werkt.
  - **Waarom:** breekt de single-source-of-truth van het kleursysteem; een toekomstige palette-wijziging (zie `reference_duck_palette_and_teacher_migration.md`) mist deze twee plekken stilzwijgend.
  - **Voorstel:** vervang door `focus-visible:ring-duck-ink` (semantisch consistent met de al gebruikte `bg-duck-ink`/`border-duck-ink` op diezelfde knoppen).
- **Criterium 1 — no-op hover-state**: `bg-duck-acid hover:bg-duck-acid` (regel 291, 378) en `bg-duck-ink hover:bg-duck-ink` (regel 418).
  - **Wat:** de hover-class is identiek aan de basis-class, dus geeft geen enkele visuele hover-feedback (alleen `active:scale-95` reageert).
  - **Waarom:** op desktop (muis, geen touch) mist de leerling hover-feedback op de belangrijkste CTA-knoppen (volgende ronde, missie voltooien).
  - **Voorstel:** gebruik een iets donkerdere/lichtere variant, bv. `hover:bg-duck-ink/90` resp. `hover:bg-duck-acid/90`, consistent met hoe andere knoppen in het bestand wél `/10`-`/20`-varianten voor hover gebruiken (regel 342, 346).
- **Kleursemantiek `RISK_COLORS`**: `medium`-risico gebruikt `bg-duck-acid` (`DataVoorDataMission.tsx:62`) — dezelfde kleur die door de rest van de missie als primaire CTA-kleur ("volgende ronde", "DEAL of NO DEAL"-knop) wordt gebruikt.
  - **Wat:** `duck-acid` fungeert in dit bestand op twee tegenstrijdige manieren: "ga door / positieve actie" én "gemiddeld privacyrisico".
  - **Waarom:** een leerling kan de risico-indicator (geel/lime) associëren met "goed/ga door" i.p.v. "waarschuwing", terwijl `duck-error` pas bij hoog/extreem risico verschijnt.
  - **Voorstel:** dit is bewust-ontwerp-terrein (geen bestaand alternatief-token voor "gemiddeld risico" in het palet) — flag als context, geen blocking fix; overweeg bij een toekomstige paletuitbreiding een aparte `duck-warn`-achtige waarschuwingskleur.

### ❌ Blocking issues
- Geen.

### Score
5/7 criteria zonder aandachtspunt · Visual Precision Gate: **niet dynamisch geverifieerd** (geen dev-server/Chrome-plugin run in deze batch-pass; statische analyse toont geen evidente overlap/afkap-risico's op basis van flex-wrap + max-width patterns) · Aanbeveling: **ship** (na de twee kleine token-fixes)

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (Sonnet, batch-review)
**SLO-claim:** 23A, 23C (regulier) · 20A, 20B (VSO) — `src/config/slo-kerndoelen-mapping.ts:80`

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** 23A en 23C zijn beide geldige regulier-codes, VSO-mapping 20A/20B is aanwezig en past bij hetzelfde thema (privacy/maatschappij) — `slo-kerndoelen-mapping.ts:80`.
- **Criterium 2 (SLO-fit):** de kern-mechanic (data ruilen voor digitale voordelen, met expliciete privacyrisico-uitleg per ronde) raakt 23A substantieel; de "les"-tekst aan het eind expliciteert het maatschappelijke aspect (23C) — `DataVoorDataMission.tsx:415-416`.
- **Criterium 5 (leeftijds-passend):** taal is concreet en herkenbaar voor leerjaar 1 (gratis muziek, gaming, iPhone) i.p.v. abstracte privacyjargon — `DataVoorDataMission.tsx:36-59`.
- **Criterium 6 (curriculum-plek):** logisch geplaatst in leerjaar 1/periode 3 tussen `data-handelaar`, `filter-bubble-breaker` en `datalekken-rampenplan` — samen vormen ze een privacy/data-cluster — `curriculum.ts:117-122`.
- **Criterium 9 (VSO + inclusiviteit):** VSO-mapping aanwezig; taal is neutraal, geen genderaannames.

### ⚠️ Aandachtspunten
- **Criterium 2/3 — evidence-claim vs. daadwerkelijke interactie**: `missionGoals.ts:297` claimt: *"Je kunt minimaal twee datakeuzes onderbouwen met privacy en voordeel."*
  - **Wat:** de missie vraagt de leerling nergens om een keuze zelf te onderbouwen — het is een binaire DEAL/NO DEAL-klik, waarna de uitleg (`round.explanation`) passief getoond wordt. De reflectie-fase (`DataVoorDataMission.tsx:238-297`) toont alleen een terugblik met gemaakte keuzes plus de vraag "zou je een eerdere ronde nu anders beantwoorden?" — zonder invoerveld of vervolgvraag die een antwoord vastlegt.
  - **Waarom:** de "evidence"-belofte in `missionGoals.ts` (die normaal het bewijs vormt dat een leerdoel is geraakt) wordt in de praktijk niet afgedwongen; een leerling kan de missie voltooien zonder ooit expliciet te "onderbouwen" — enkel klikken + lezen.
  - **Voorstel:** ofwel de evidence-tekst afzwakken naar wat de missie werkelijk meet (bv. "Je kiest minimaal twee keer bewust DEAL of NO DEAL en leest de bijbehorende privacyrisico-uitleg"), ofwel — didactisch sterker — voeg in de reflectie-fase één korte open vraag toe ("Welke ronde zou je nu anders beantwoorden en waarom?") zodat de onderbouwing daadwerkelijk wordt uitgelokt. Dit raakt geen bestandsscope buiten `missionGoals.ts` (tekst) resp. het component (nieuwe reflectie-vraag) — geen edge function of migratie nodig.
- **Criterium 7 (Bloom-balans)**: de vijf rondes zijn qua vraagvorm identiek (DEAL/NO DEAL + lezen), zonder oplopende moeilijkheid in de gevraagde denkactiviteit — het "wegen" (evalueren) gebeurt impliciet in het hoofd van de leerling, niet in een zichtbare stap.
  - **Wat:** Bloom-niveau blijft steken op "toepassen" (een keuze maken); er is geen moment waarop de leerling expliciet moet "evalueren" (bv. twee ronde-uitkomsten vergelijken) of "analyseren".
  - **Waarom:** voor leerjaar 1 is dit passend (geen scaffolding voor hogere Bloom-niveaus nodig), maar het beperkt de missie tot herhaling van hetzelfde interactiepatroon 5x — dit is een ontwerpkeuze, geen fout.
  - **Voorstel:** optioneel voor een toekomstige iteratie: laat de reflectie-fase (regel 238-297) een vergelijkende vraag stellen tussen twee specifieke ronde-uitkomsten i.p.v. een algemene terugblik. Niet blocking.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy):** sterk geraakt — elke ronde koppelt een concrete data-vraag aan een privacyrisico-uitleg.
- **23C (Maatschappij):** oppervlakkig geraakt — alleen de afsluitende "les"-tekst expliciteert het maatschappelijke aspect (machtsverschil bedrijf-gebruiker); de 5 rondes zelf zijn individueel-gericht, niet maatschappij-gericht.

### Score
5/7 criteria zonder aandachtspunt · Bloom-balans: laag-medium (passend voor leerjaar 1) · Aanbeveling: **ship** (evidence-tekst mismatch is een kleine copy-fix, geen herontwerp)

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet, batch-review)
**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin beschikbaar in deze batch-review-pass; alleen statische analyse (Fase A) uitgevoerd.

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** alle knoppen hebben een functionele `onClick`; geen dode knoppen gevonden.
- **A2 (error states):** `saveWarning` toont een leerling-vriendelijk bericht als de anonieme opslag faalt, zonder de flow te blokkeren — `DataVoorDataMission.tsx:146-155, 311-315`; loading-state voor de anonieme statistieken via `hasLoadedStats` — `DataVoorDataMission.tsx:218, 372-374`.
- **A4 (imports via alias):** alle imports lopen via `@/...` — `DataVoorDataMission.tsx:3-10`.
- **A5 (RPC-calls graceful):** `saveDataVoorDataAnswers`/`getDataVoorDataRoundStats` zitten in try/catch met console-log + safe fallback (`false` resp. `{}`) — `src/services/dataVoorDataService.ts:26-44` (geïmporteerd bestand, niet in autofix-scope maar wel gelezen als directe dependency).
- **A6 (restart-safe state):** gebruikt `useMissionAutoSave` direct, plus een expliciete zelf-reparatie-`useEffect` die corrupte opgeslagen state (bv. `choices.length` > `ROUNDS.length` door een oude bug) bij mount clampt en terugschrijft — `DataVoorDataMission.tsx:67-127`. Sterk defensief patroon, goed gedocumenteerd in de comments.
- **A7 (security):** geen `dangerouslySetInnerHTML`, geen AI/chat-interactie in deze missie (dus geen prompt-injection-oppervlak), geen leerling-vrije-tekstinvoer die ongesaneerd ergens landt.

#### ⚠️ Aandachtspunten
- **A3 — impliciete `any` op ongebruikte props**: `stats?: any; vsoProfile?: any;` — `DataVoorDataMission.tsx:15-16`.
  - **Wat:** beide props zijn `any` getypeerd én worden nergens in het component gebruikt (destructuring is alleen `{ onBack, onComplete }` op regel 66).
  - **Risico:** laag voor deze missie zelf (geen runtime-effect), maar het is een stille TypeScript-discipline-schending die zich makkelijk verspreidt als andere handcrafted missies deze Props-interface kopiëren als startpunt.
  - **Voorstel:** vervang door een neutraal, expliciet type zodat er geen `any` meer in de interface staat (zie Voorstel-blok hieronder).

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — "Multi-viewport visuele verificatie niet uitgevoerd — geen dev-server/Chrome-plugin beschikbaar in deze batch-review-pass." Alle visuele/dynamische claims in dit rapport zijn dus **unverified** en gebaseerd op statische code-analyse.

### Score
Static: 6/7 criteria zonder aandachtspunt · Dynamic: n.v.t. · Aanbeveling: **ship** (kleine type-fix, geen kritieke fix vereist)

---

## Voorstellen

### 1. Design — hardcoded hex-ring vervangen door duck-token
```tsx
// ❌ Huidig — DataVoorDataMission.tsx:342
<button onClick={() => handleChoice('deal')} className="py-5 bg-duck-ink/10 hover:bg-duck-ink/20 border-2 border-duck-ink/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#5F947D]">

// ✅ Voorgesteld
<button onClick={() => handleChoice('deal')} className="py-5 bg-duck-ink/10 hover:bg-duck-ink/20 border-2 border-duck-ink/30 rounded-2xl font-black text-lg transition-all duration-300 active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-duck-ink">
```

```tsx
// ❌ Huidig — DataVoorDataMission.tsx:418
<button onClick={() => { clearSave(); onComplete(true); }} className="w-full py-4 bg-duck-ink hover:bg-duck-ink text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5F947D]"><Trophy size={20} /> Missie Voltooid!</button>

// ✅ Voorgesteld
<button onClick={() => { clearSave(); onComplete(true); }} className="w-full py-4 bg-duck-ink hover:bg-duck-ink text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-duck-ink"><Trophy size={20} /> Missie Voltooid!</button>
```

### 2. Tech — `any`-props vervangen
```tsx
// ❌ Huidig — DataVoorDataMission.tsx:12-17
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
    stats?: Record<string, unknown>;
    vsoProfile?: Record<string, unknown>;
}
```

### 3. Didactiek — evidence-tekst laten kloppen met de interactie
```ts
// ❌ Huidig — missionGoals.ts:291-298
'data-voor-data': {
    primaryGoal: 'Ik weeg af welke persoonlijke data ik wel of niet wil ruilen voor digitale voordelen.',
    criteria: {
        type: 'component-complete',
        description: 'Je maakt keuzes in de dataveiling en reflecteert op je grenzen.',
    },
    evidence: 'Je kunt minimaal twee datakeuzes onderbouwen met privacy en voordeel.',
},

// ✅ Voorgesteld
'data-voor-data': {
    primaryGoal: 'Ik weeg af welke persoonlijke data ik wel of niet wil ruilen voor digitale voordelen.',
    criteria: {
        type: 'component-complete',
        description: 'Je maakt keuzes in de dataveiling en reflecteert op je grenzen.',
    },
    evidence: 'Je kiest bij minimaal twee databeslissingen bewust DEAL of NO DEAL en leest de bijbehorende privacyrisico-uitleg.',
},
```

---

## Samenvatting & verdict

**Data voor Data** is een compacte, goed geïsoleerde handcrafted missie: solide autosave/state-repair-patroon, nette foutafhandeling bij het opslaan van anonieme antwoorden, en een heldere SLO-fit met 23A/23C. Er zijn geen blocking issues. De gevonden punten zijn stuk voor stuk kleine, geïsoleerde fixes: twee hardcoded hex-kleuren i.p.v. duck-tokens, twee `any`-getypeerde (en ongebruikte) props, en één missionGoals-evidence-tekst die net iets meer belooft dan de missie daadwerkelijk uitlokt. Geen van deze punten vereist een herontwerp of raakt gedeelde engines, edge functions of migraties.

**Verdict: ship** (met de drie kleine voorstellen hierboven als optionele opvolging).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
