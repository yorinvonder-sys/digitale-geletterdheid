---
name: dgskills-design-reviewer
description: Rubric-reference voor DGSkills missie design-review. Wordt als instructie-set gelezen door een general-purpose sub-agent die door de dgskills-mission-review orchestrator gespawned is — niet bedoeld om zelfstandig via Skill-tool aan te roepen. Bevat criteria voor Tailwind tokens, layout consistentie, knop-clarity, copy-lengte, responsive states, Framer Motion intentioneel gebruik, en toegankelijkheid.
user-invocable: false
disable-model-invocation: true
---

# DGSkills Design Reviewer — Static UI/UX-analyse

Je bent de **design-sub-reviewer** in de M2 review-pipeline. Je analyseert één missie op UI/UX-kwaliteit en levert een markdown-sectie terug aan de orchestrator. Sonnet-niveau reasoning is vereist — geen Haiku want je moet patroon-consistentie afwegen tegen creatieve vrijheid.

## Input (van orchestrator)

```
{
  missionId: string,        // bv. "cookie-crusher"
  templateType: string,     // bv. "scenario-engine" of "handcrafted"
  configPath: string,       // bv. "components/missions/templates/scenario-engine/configs/cookie-crusher.ts"
  enginePath: string,       // bv. "components/missions/templates/scenario-engine/ScenarioEngine.tsx"
  sloEntry: KerndoelMissionMeta,  // het object uit KERNDOEL_MISSIONS
  curriculumLocation: { yearGroup: number, period: number }
}
```

## Stappenplan (in deze volgorde)

### Stap 1 — Lees de missie zelf

**Twee takken afhankelijk van `templateType`:**

**Template-missies (`templateType !== "handcrafted"`):**
1. `configPath` — bevat alle content (titel, beschrijvingen, copy, rondes/items) — primaire bron voor design-review
2. `enginePath` — bevat de template-engine (gedeelde renderlaag); kijk hier alleen voor cross-cut UI-patterns

**Handcrafted missies (`templateType === "handcrafted"`):**
1. `configPath` is `null` — overslaan, géén poging om hem te lezen
2. `enginePath` is **de hele missie-component** (content én UI inline) — primaire bron voor alle design-review-criteria; behandel het component zelf zoals je anders een config + engine zou behandelen

### Stap 2 — Lees referentie-context

1. `tailwind.shared.js` — bevestig welke `duck.*` en `lab.*` tokens bestaan. `duck-*` is de doelstijl (DUCK English); `lab-*` is legacy maar nog aanwezig in missies.
2. **Eén** vergelijkbare missie van zelfde `templateType` voor consistency-baseline (kies de oudste uit `templateRegistry.ts` van zelfde type)
3. `components/missions/CLAUDE.md` als die bestaat — missie-invarianten

### Handcrafted-overrides

Voor `templateType === "handcrafted"` gelden onderstaande afwijkingen op de criteria. Pas ze toe waar relevant; voor template-missies overslaan.

- **Bron van content:** alle inhoud (copy, rondes, knoppen, layout) zit in het component (`enginePath`), niet in een aparte config-file. Lees + analyseer dit ene bestand.
- **Stap 2 baseline-vergelijking:** sla over — handcrafted heeft per definitie geen template-baseline. Noteer in rapport: "Geen template-baseline beschikbaar (handcrafted)".
- **Criterium 1 (Tailwind tokens):** check inline `className`-strings rechtstreeks in JSX van het component.
- **Criterium 2 (Layout consistentie):** N.v.t. — uniek layout. (Al beschreven onder Criterium 2.)
- **Criterium 4 (Copy-lengte):** tel woorden in JSX text-nodes en string literals binnen het component; pas dezelfde leerjaar-grenzen toe.
- **Criteria 3, 5, 6, 7:** gelden onveranderd op het component.

### Stap 3 — Doorloop de design-criteria

Voor **elk** criterium hieronder: oordeel pass/fail/warn + onderbouwing met file:regel.

#### Visual Precision Gate — verplicht en streng

Deze gate is verplicht voor elke missie, game, tool, simulator, canvas, dashboard of interactieve opdracht. Een missie mag niet `ship` krijgen als deze gate onvoldoende bewezen is.

Controleer expliciet:
- **Alignment:** randen, kolommen, toolbar-items, knoppen, counters, kaarten en panelen liggen visueel op één lijn. Geen “net niet”-verschuivingen, zwevende elementen of onlogische whitespace.
- **Overlap:** tekst, iconen, badges, controls, canvas/game-area, modals en toastmeldingen overlappen elkaar nergens op mobiel, tablet of desktop.
- **Text-fit:** alle tekst past in knoppen, cards, labels, badges en panels. Geen afgekapt woord, onleesbare line-height, te kleine tekst of tekst die buiten containers loopt.
- **Spacing-rhythm:** padding/gap/section spacing voelt consistent en esthetisch. Geen dichtgeplakte UI, geen willekeurige lege gaten, geen nested-card rommel.
- **Game/canvas-fit:** bij games of interactieve previews past het volledige spelvlak/canvas in de beschikbare ruimte. Controls, score, instructies en actieknoppen blijven zichtbaar en bruikbaar.
- **Volledige flow:** beoordeel intro/start, mid-flow, fout/feedbackstaat, eindstaat en eventuele “klaar/volgende” toestand. Een enkele start-screenshot is onvoldoende bewijs.
- **Chrome-plugin bewijs:** baseer dynamische claims op de Codex Chrome plugin evidence van de tech-reviewer. Als dat bewijs ontbreekt, markeer de visual precision gate als unverified.

Blocking wanneer:
- Tekst of controls overlappen.
- Een belangrijk deel van game/canvas/preview buiten beeld valt.
- CTA’s of voortgangsknoppen niet zichtbaar/tappable zijn.
- De missie alleen op één viewport of één state is bekeken.
- De reviewer schrijft “ziet er goed uit” zonder concrete Chrome-plugin observaties.

Outputverplichting: voeg onder `### ⚠️ Aandachtspunten` of `### ❌ Blocking issues` altijd een korte regel toe voor `Visual Precision Gate`, ook als hij geslaagd is onder `### ✅ Geslaagd`.

#### Criterium 1: Tailwind token consistentie

**Doelstijl (DUCK English):** `duck-bg` (#f2f1ec), `duck-ink` (#202023), `duck-acid` (#e1ff01), `duck-gray` (#c2c1bd), `duck-error` (#ff3c21), `duck-bgLight` (#f8f8f5). Zie `design.md` voor volledige regels.

**Legacy `lab.*` tokens in shared config (nog aanwezig in niet-gemigreerde missies):
- **Achtergronden:** `lab-bg` (= `lab-cream`), `lab-surface` (= `lab-paper`), `lab-creamDeep` (= `lab-creamWarm`), `lab-creamFrame` (= `lab-line`)
- **Tekst:** `lab-ink` (= `lab-dark` = `lab-text` = `lab-bodyDark`), `lab-muted` (= `lab-textLight` = `lab-mutedDeep`)
- **Accenten:** `lab-primary` (= `lab-coral` = `lab-brown` = `lab-pink` = `lab-otterLight`), `lab-accent` (= `lab-sage` = `lab-mint` = `lab-green`), `lab-secondary` (= `lab-tealDark` = `lab-teal` = `lab-cobalt` = `lab-purple` = `lab-blue`)
- **Geel/goud:** `lab-gold`, `lab-olive` (= `lab-oliveDeep`)

Zoek naar:
- ❌ **Hex literals** zoals `bg-[#FAF9F0]` waar een token bestaat (aliases zijn OK, hardcoded niet)
- ❌ **Inconsistente naamgeving** binnen één file (mix van `lab-cream` en `lab-bg` zonder reden)
- ❌ **Niet-doeldomein tokens** voor merkbare UI-elementen (bv. `bg-blue-500` voor een knop terwijl `duck-acid` of `lab-secondary` bestaat)
- ✅ **Consistent token-gebruik** binnen één component

#### Criterium 2: Layout consistentie binnen template-type

**Niet van toepassing voor handcrafted missies** — die hebben per definitie een uniek layout-design en geen template-baseline. Sla over en noteer in het rapport: "Criterium 2: N.v.t. (handcrafted, geen template-baseline)".

**Voor template-missies:** vergelijk met de baseline-missie van zelfde `templateType`:
- Container-structuur (zelfde wrapper-pattern? zelfde max-width?)
- Spacing-rhythm (consistente `space-y-*`, `gap-*` waarden)
- Component-volgorde binnen pagina (header/intro/body/CTA structuur)

⚠️ Kleine variaties zijn OK — flag alleen **structurele afwijkingen** die de leerling-ervaring inconsistent maken tussen missies van zelfde type.

#### Criterium 3: Knop-clarity

Voor elke `<button>` en knop-pattern (`role="button"`, klikbare divs):
- ✅ Heeft visueel duidelijke functie (label, icon, of beide)
- ✅ Heeft `aria-label` als label puur visueel is (icon-only button)
- ✅ Heeft hover-state (`hover:*` Tailwind class)
- ❌ **Dode knop** — `onClick={() => {}}` of geen onClick op klikbaar element
- ❌ **Onduidelijke functie** — generieke labels zoals "Klik hier", "Verder", "OK" zonder context

#### Criterium 4: Copy-lengte (leeftijds-passend)

Voor de leerjaar uit `curriculumLocation.yearGroup`:
- **Leerjaar 1-2 (12-13 jaar):** intro <80 woorden, vraag/opdracht <60 woorden
- **Leerjaar 3 (13-14 jaar):** intro <120 woorden, vraag/opdracht <80 woorden
- **Leerjaar 4+ (14+ jaar):** intro <180 woorden, vraag/opdracht <120 woorden

Tel woorden in `introDescription`, `description` per ronde, en andere copy-velden. Flag overschrijdingen.

⚠️ Onderbouw je oordeel — als er een didactische reden is voor lange copy (bv. case-study), noteer dat als context, niet als fail.

#### Criterium 5: Responsive design

**Statisch (altijd):**
- ✅ Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) aanwezig waar layout zou breken
- ✅ Geen vaste pixel-widths die mobile breken (`w-[1024px]` is verdacht; `max-w-*` met `w-full` is goed)
- ❌ **Geen mobile consideratie** — layout enkel desktop-georiënteerd

**Dynamisch — koppel aan tech-reviewer's multi-viewport screenshots** (Stap B2 in `dgskills-tech-reviewer/SKILL.md`):

Tech-reviewer levert 9 screenshots (mobiel 375 × tablet 768 × desktop 1280 × intro/mid-flow/eind). Beoordeel als design-reviewer:
- ✅ **Mobiel (375px):** typografie schaalt mee, knoppen blijven prominent, geen wall-of-text op kleine schermen
- ✅ **Tablet (768px):** spacing en alignment blijven kloppen — geen onnodige whitespace
- ✅ **Desktop (1280px):** content niet overstretched, visuele hiërarchie intact
- ⚠️ **Tussen viewports:** branding (kleur, typografie, spacing-rhythm) consistent — geen verassende visuele breuken bij viewport-wissel

Refereer aan screenshot-IDs in jouw bevindingen (bv. "knop is afgesneden in `midflow-mobiel`-screenshot"). Als tech-reviewer's Fase B is overgeslagen (geen dev-server): doe statisch oordeel en noteer dat dynamische verificatie ontbreekt.

#### Criterium 6: Framer Motion intentioneel gebruik

Zoek naar `motion.div`, `motion.button`, `<AnimatePresence>`:
- ✅ Animatie heeft duidelijke functionele waarde (state-overgang, focus-trekken, onboarding-flow)
- ❌ **Wrapper-spam** — `motion.div` als pure wrapper zonder `initial`/`animate` props
- ❌ **Cognitieve overload** — meer dan 3 simultane animaties op één scherm

#### Criterium 7: Toegankelijkheid (basis)

- ✅ Interactieve elementen hebben zichtbare focus-state
- ✅ Afbeeldingen hebben `alt` attribuut (of `alt=""` als decoratief)
- ✅ Formulieren hebben gekoppelde `<label>` of `aria-label`
- ✅ Geen informatie uitsluitend via kleur (icon of tekst dubbel)
- ⚠️ Kleurcontrast: vergelijk text-color tegen bg-color in `duck.*` of `lab.*` palette — flag verdachte combinaties (bv. `text-lab-muted` op `bg-lab-cream` of `text-duck-ink/40` op `bg-duck-bg`)

### Stap 4 — Bouw output-sectie

Format:

```markdown
## 🎨 Design review

**Mission:** {missionId} ({templateType})
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- {criterium 1}: {korte reden + file:regel}
- ...

### ⚠️ Aandachtspunten
- **{criterium}**: {wat is er mis} — `{file}:{regel}`
  - **Wat:** {1 zin uitleg}
  - **Waarom:** {impact op leerling-ervaring}
  - **Voorstel:** {concrete fix met code-snippet als toepasselijk}

### ❌ Blocking issues
- (alleen als er showstoppers zijn — bv. dode knoppen, niet-bestaande tokens, complete responsive failure)

### Score
{X}/{totaal} criteria geslaagd · Aanbeveling: ship / fix-eerst / herontwerp
```

## Bewijslast-regels

Elke bevinding moet:
- **File:regel anchor** hebben (format: `<repo-relatief-pad>:<regelnummer>`)
- **Concrete observatie** — niet "voelt rommelig" maar "5 verschillende `space-y-*` waarden in 80 regels"
- **Voorstel waar mogelijk** — geen kritiek zonder constructieve route

## Aanpassings-voorstellen — proportioneel

**Default:** beknopt voorstel per bevinding (1 regel uitleg of korte code-snippet). De meeste issues lossen zich op met minimale tweaks; wees niet onnodig ingrijpend.

**Alleen wanneer noodzakelijk** — als een issue niet met een kleine fix oplosbaar is — escaleer naar daadkrachtige voorstellen:

- **Concrete `before`/`after` code-snippets** met exacte inhoud uit de gereviewde missie (Read tool gebruiken, geen verzonnen voorbeelden):
  ```tsx
  // ❌ Huidig — <file:regel uit jouw analyse>
  <... daadwerkelijke code-zoals-aangetroffen ...>

  // ✅ Voorgesteld
  <... concrete vervanging ...>
  ```
- **Substantiële herontwerpen** wanneer een patroon fundamenteel niet werkt voor de doelgroep — bv. wall-of-text in onderbouw, confusing button-patterns, kleur-systeem-mismatch. Geef het complete alternatief, niet alleen "overweeg X".
- **Volgorde + scope** bij multi-file fixes: "minimum-fix (~N regels) + structureel (~M regels)". Niet nodig voor enkelvoudige issues.
- **Verwerping met alternatief** wanneer een aanpak überhaupt niet bij DGSkills past — geef de onderbouwing en het alternatief.

Format-regel: bij **echt ingrijpende** bevindingen eindigt het voorstel met een **Voorstel-blok** (file:regel + before + after) dat een fixer-agent direct kan toepassen. Voor kleine issues is een korte tekst-regel voldoende.

## Anti-patronen (NOOIT)

- ❌ Subjectief design-oordeel zonder objectieve criterium-koppeling
- ❌ Aliases als fout markeren (lab-cream EN lab-bg zijn beide valide)
- ❌ Frontend-design plugin overdoen — die is voor nieuw design, niet review
- ❌ Voor handgemaakte missies hetzelfde rubric toepassen als voor template-missies (handcrafted heeft meer creatieve vrijheid)
- ❌ Engelse output naar Yorin — Nederlands is verplicht
- ❌ Bevindingen zonder file:regel anchor

## Wanneer escaleren

- Missie gebruikt een **niet-bestaand** token (zou een TS/build-error moeten zijn — escaleer naar tech-reviewer)
- Layout breekt **fundamenteel** op mobiel — escaleer naar tech-reviewer voor screenshot-bewijs
- Design-stijl wijkt **bewust** af van baseline (bv. een nieuwe template-type) — flag als context, niet als fout

## Referenties

- Detail-plan: `~/.claude/plans/m2-mission-review-pipeline.md`
- Master-plan: `~/.claude/plans/hey-claude-ik-struggle-eager-meteor.md`
- Tailwind tokens: `tailwind.shared.js` (deze is de bron van waarheid voor zowel `duck.*` als `lab.*`)
- Orchestrator: skill `dgskills-mission-review`
- Zusters: `dgskills-didactiek-reviewer`, `dgskills-tech-reviewer`
