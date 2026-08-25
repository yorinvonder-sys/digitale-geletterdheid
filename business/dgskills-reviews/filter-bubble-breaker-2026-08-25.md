# Missie-review: Filter Bubble Breaker

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted component, geen config-laag)
**Bestand:** `src/features/missions/FilterBubbleBreakerMission.tsx`
**Curriculum-plek:** Leerjaar 1, Periode 3, week 3
**SLO-claim:** `21B` (Media & Informatie), `23C` (Maatschappij) · VSO: `20A`, `20B`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet) — geen template-baseline (dedicated/handcrafted)

### ✅ Geslaagd
- **Criterium 1 (tokens):** consistent `duck-*` gebruik door het hele component, geen hex-literals — `src/features/missions/FilterBubbleBreakerMission.tsx:113-310`
- **Criterium 2:** N.v.t. (dedicated, geen template-baseline)
- **Criterium 3 (knop-clarity):** elke knop heeft label + icon en een echte `onClick` — geen dode knoppen gevonden
- **Criterium 4 (copy-lengte):** intro ~17 woorden, analyse-opdracht ~24 woorden — ruim binnen leerjaar 1-grens (<80/<60)
- **Criterium 6 (Framer Motion):** niet gebruikt — geen wrapper-spam, geen issue

### ⚠️ Aandachtspunten
- **Criterium 1 (dode gradient)**: `getBadge()` geeft voor het laagste niveau een gradient van dezelfde kleur naar zichzelf — `src/features/missions/FilterBubbleBreakerMission.tsx:109`
  - **Wat:** `color: 'from-duck-ink to-duck-ink'` rendert geen gradient, enkel een vlakke kleur.
  - **Waarom:** kleine visuele inconsistentie tussen de 3 badge-tiers (2 van de 3 zijn feitelijk vlak, niet gradient).
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/missions/FilterBubbleBreakerMission.tsx:109
    return { emoji: '🌱', title: 'Bubbel Ontdekker', color: 'from-duck-ink to-duck-ink' };

    // ✅ Voorgesteld
    return { emoji: '🌱', title: 'Bubbel Ontdekker', color: 'from-duck-gray to-duck-ink' };
    ```

- **Criterium 5 (responsive)**: `compare`-scherm gebruikt `grid-cols-2` zonder mobile-breakpoint — `src/features/missions/FilterBubbleBreakerMission.tsx:159`
  - **Wat:** `` `grid ${activeFeed === 'both' ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'} gap-4` `` toont bij "Beide" altijd 2 kolommen, ook op 375px-schermen.
  - **Waarom:** feed-cards (titel + bron + badges) worden op mobiel smal en kunnen krap/afgekapt ogen; niet dynamisch geverifieerd in deze pass (geen Chrome-plugin sessie gedraaid).
  - **Voorstel:** `grid-cols-1 sm:grid-cols-2` zodat "Beide" pas vanaf tablet-breedte 2 kolommen toont.

- **Criterium 7 (toegankelijkheid — labels niet gekoppeld)**: beide textareas missen een programmatisch gekoppeld label — `src/features/missions/FilterBubbleBreakerMission.tsx:212-219` en `:296-308`
  - **Wat:** de `<label>` op regel 212 heeft geen `htmlFor`/`id`-koppeling met de textarea op regel 213-219; de "Reflectie"-kop op regel 299 is een `<p>`, geen `<label>`, voor de textarea op regel 302-308.
  - **Waarom:** screenreader-gebruikers krijgen het invoerveld niet aangekondigd met zijn doel.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/missions/FilterBubbleBreakerMission.tsx:212-213
    <label className="text-xs font-black text-duck-ink/60" ...>Jouw analyse:</label>
    <textarea
        value={analyzeResponse}

    // ✅ Voorgesteld
    <label htmlFor="fbb-analyze" className="text-xs font-black text-duck-ink/60" ...>Jouw analyse:</label>
    <textarea
        id="fbb-analyze"
        value={analyzeResponse}
    ```
    ```tsx
    // ❌ Huidig — src/features/missions/FilterBubbleBreakerMission.tsx:302-303
    <textarea
        value={saved.reflectie}

    // ✅ Voorgesteld
    <textarea
        aria-label="Reflectie: wat heb je geleerd en waar kom je dit nog meer tegen?"
        value={saved.reflectie}
    ```

### ❌ Blocking issues
- Geen.
- **Visual Precision Gate:** WARN — niet uitgevoerd via Codex Chrome plugin in deze rubric-only pass. Statisch oordeel gebaseerd op JSX; geen multi-viewport screenshotbewijs. Dynamische verificatie ontbreekt.

### Score
5/7 criteria zonder aandachtspunt · Aanbeveling: **fix-eerst** (kleine, niet-blokkerende fixes: labels + responsive grid)

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (Sonnet)
**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim:** `21B`, `23C` (regulier) · `20A`, `20B` (VSO)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** `21B` en `23C` bestaan in de reguliere lijst, `20A`/`20B` in VSO — `src/config/slo-kerndoelen-mapping.ts:78`
- **Criterium 2 (SLO-fit):** `21B` (Media & Informatie) wordt substantieel geraakt door de feed-vergelijking en analyse-opdracht; `23C` (Maatschappij) door de reflectie op maatschappelijke impact van bubbels — beide staven zich in de challenge-uitleg, bv. `:38` en `:40`
- **Criterium 4 (beknoptheid):** alle copy ruim binnen leerjaar 1-grenzen (zie designreview)
- **Criterium 5 (leeftijds-passend):** herkenbare NL-tienervoorbeelden (Ajax, Fortnite, Nike) naast een contrasterend volwassen profiel — goed didactisch contrast zonder onnodig jargon
- **Criterium 6 (curriculum-plek):** logisch geplaatst in periode 3 naast `mail-detective`, `data-handelaar`, `datalekken-rampenplan` — privacy/media-thema-lijn
- **Criterium 7 (Bloom-mix):** multiple-choice vragen op begrijpen/toepassen-niveau, gevolgd door een schrijfopdracht (analyseren) en reflectie (evalueren) — goede opbouw
- **Criterium 9 (VSO):** `sloVsoKerndoelen` aanwezig, geen gevoelige onderwerpen die doorverwijzing vereisen

### ⚠️ Aandachtspunten
- **Criterium 3/8-aanverwant (ondiepe voltooiingsgate)**: de vrije-tekstvelden worden alleen op tekenlengte gevalideerd, niet op inhoud — `src/features/missions/FilterBubbleBreakerMission.tsx:225` en `:310`
  - **Wat:** `disabled={analyzeResponse.trim().length < 10}` en `disabled={saved.reflectie.trim().length < 10}` accepteren elke 10-teken string, inclusief onzin ("asdfasdfas").
  - **Waarom:** dit is precies het XP-farming-patroon dat `src/features/missions/CLAUDE.md` uitsluit ("Do not reward shallow interaction") — een leerling kan de analyse- en reflectiestap doorklikken zonder inhoudelijk na te denken, terwijl deze twee velden de enige plek zijn waar kerndoel `23C` (maatschappelijke reflectie) echt getoetst wordt.
  - **Voorstel:** verhoog de drempel naar een woordgrens die dwingt tot een zin (bv. `split(/\s+/).filter(Boolean).length < 8`) in plaats van een karaktergrens; dit is een kleine, gerichte aanpassing, geen herontwerp.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21B**: sterk geraakt — vergelijkings- en analysefase vragen leerlingen expliciet feed-verschillen en gemiste content te benoemen.
- **23C**: sterk geraakt — challenge-uitleg en reflectievraag koppelen filterbubbels aan maatschappelijke gevolgen (polarisatie, eigen wereldbeeld).

### Score
7/8 criteria geslaagd (1 aandachtspunt) · Bloom-balans: medium · Aanbeveling: **fix-eerst** (voltooiingsgate verscherpen)

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze rubric-only pass (statische analyse only)

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** alle knoppen hebben functionele `onClick` — geen dode knoppen
- **A4 (imports via alias):** alle imports gebruiken `@/...` — `src/features/missions/FilterBubbleBreakerMission.tsx:3-5`
- **A5 (edge functions):** N.v.t. — component doet geen `supabase.functions.invoke` of andere netwerkcalls
- **A6 (restart-safe state):** gebruikt `useMissionAutoSave` direct, met expliciet becommentarieerde hersteldlogica voor al-beantwoorde vragen — `src/features/missions/FilterBubbleBreakerMission.tsx:54-88`
- **A7 (security):** geen `dangerouslySetInnerHTML`, geen client-side AI-call dus geen prompt-sanitisatie nodig — N.v.t.

#### ⚠️ Aandachtspunten
- **A3 (TypeScript-discipline — `any`-types)**: `Props` declareert twee ongebruikte velden als `any` — `src/features/missions/FilterBubbleBreakerMission.tsx:10-11`
  - **Wat:** `stats?: any; vsoProfile?: any;` worden nooit gedestructureerd of gebruikt in het component-body (alleen `onBack`/`onComplete` worden gebruikt, regel 53).
  - **Risico:** geen directe leerling-impact, maar het verzwakt typeveiligheid en misleidt toekomstige onderhouders over wat het component daadwerkelijk consumeert.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/missions/FilterBubbleBreakerMission.tsx:7-12
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
    (Callers geven deze props soms wel mee — dat is onschadelijk aangezien React extra props negeert, maar controleer bij toepassen kort `AuthenticatedApp.tsx`/`AiLab.tsx` op JSX-spread-gebruik van `stats`/`vsoProfile` naar dit component voordat je dit verwijdert.)

- **Dode conditionele branch (`renderFeedCard`)**: de `isB`-parameter beïnvloedt de output niet — `src/features/missions/FilterBubbleBreakerMission.tsx:113` en `:122`
  - **Wat:** `isB ? 'bg-duck-ink/5 border-duck-ink/20' : 'bg-duck-ink/5 border-duck-ink/20'` (r113) en `isB ? 'bg-duck-ink/10 text-duck-ink border-duck-ink/20' : 'bg-duck-ink/10 text-duck-ink border-duck-ink/20'` (r122) hebben identieke if/else-takken.
  - **Risico:** geen functioneel risico, maar het is dode code die suggereert dat Feed A/B visueel onderscheiden zouden moeten worden en dat gebeurt niet — mogelijk een gemist ontwerp-intentie (Daan vs. Priya visueel laten verschillen).
  - **Voorstel:** verwijder de dode ternaries (vervang door de constante waarde) óf implementeer een echt kleurverschil tussen de twee profielen — laatste is een designkeuze, niet een pure tech-fix.

#### ❌ Blocking issues
- Geen. Geen security-gaten, geen RLS-relevante code (geen backend-calls), geen dode knoppen.

### Dynamic verificatie
Niet uitgevoerd — dit is een rubric-only pass zonder dev-server/Chrome-plugin sessie. Statisch oordeel volledig, geen console-/network-/backend-bewijs verzameld.

### Score
Static: 4/6 toepasselijke criteria zonder aandachtspunt (2 warns) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (kleine typing- en dead-code opruiming)

---

## Voorstellen (samengevoegd)

1. **Design — labels koppelen** (`src/features/missions/FilterBubbleBreakerMission.tsx:212-219`, `:296-308`) — zie design-sectie voor before/after.
2. **Design — dode gradient** (`:109`) — zie design-sectie voor before/after.
3. **Design — responsive grid op compare-scherm** (`:159`) — `grid-cols-1 sm:grid-cols-2` i.p.v. altijd `grid-cols-2`.
4. **Didactiek — voltooiingsgate verscherpen** (`:225`, `:310`) — woordgrens i.p.v. karaktergrens om ondiepe interactie te voorkomen.
5. **Tech — `any`-types verwijderen** (`:10-11`) — ongebruikte props uit `Props`-interface.
6. **Tech — dode `isB`-ternaries** (`:113`, `:122`) — opruimen of echt visueel verschil implementeren.

---

## Samenvatting & verdict

Filter Bubble Breaker is een didactisch sterk ontworpen missie: de SLO-koppeling (`21B`/`23C`) is goed onderbouwd, de Bloom-opbouw (herkennen → analyseren → reflecteren) is passend voor leerjaar 1, en de technische basis (restart-safe state, geen `any`-lekken in kritieke paden, geen security-gaten) is solide. Er zijn geen blocking issues gevonden op design, didactiek of tech.

De gevonden punten zijn stuk voor stuk klein en niet-blokkerend: twee ontkoppelde formulierlabels, een te losse voltooiingsgate (karakter- i.p.v. woordgrens) die shallow-interaction toelaat, twee ongebruikte `any`-props, en wat dode conditionele styling. Geen van deze vereist een herontwerp.

**Verdict: fix-eerst** — kleine, gerichte aanpassingen vóór ship; geen architecturale of didactische herziening nodig.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
