# UI/UX-review — álle leerling-missies (live, 4 viewports)

**Datum:** 30 juni 2026
**Scope:** alle 109 student-facing missies (de docent-/publieke-/login-schermen vallen buiten deze review)
**Methode:** elke missie live gerenderd via `/dev/mission-preview` en gescreenshot op **4 viewports** — desktop (1280), iPad-staand (810×1080), iPad-liggend (1080×810), mobiel (390) — daarna beoordeeld door een team van 20 review-agents op 4 dimensies, met een onafhankelijke verificatie-agent over elke zware bevinding.
**Bewijs/artefacten:** 504 screenshots in `reports/design-audit/student-missions-2026-06-30/screens/`; ruwe data in `findings-aggregate.json` + `all-findings.json` (zelfde map).

> **Update (30 jun 2026) — intro-bevindingen achterhaald door #186.** Deze review is gemaakt vóórdat **PR #186 "unify & elevate the mission intro screen"** op `main` stond. Die PR heeft de gedeelde `IntroScreen` herontworpen (nu top-aligned, nieuwe hero, KEES-bericht lager geplaatst). Daardoor zijn de bevindingen over de **gedeelde template-intro** — de afgesneden KEES-avatar (§3-A) en de "lege ruimte onder de stappen-kaart" — **afgedekt/achterhaald**. Alle overige bevindingen (chat-missie-beelden & knopkleuren, toegankelijkheid, per-missie-content, render-issues, bespoke missies) **blijven geldig**. De tip-chip-kleurfix uit deze ronde is opnieuw tegen current `main` gemaakt.

---

## 1. Samenvatting

De missies staan op een **solide, herkenbare basis**: een consistent intro-patroon (doel-kaart, "Zo werk je", moeilijkheidsniveaus, KEES-mascotte) en een sterke speelsheid — vooral de op-maat-gebouwde missies en de puzzel-/data-missies scoren hoog op engagement. Omdat ~80 missies dezelfde paar template-shells delen, geldt: **één shell-fix verbetert tientallen missies tegelijk.**

Maar er zijn drie systematische zwaktes:

1. **De gedeelde template-shell snijdt content af en laat ruimte leeg op mobiel/iPad.** De KEES-mascotte wordt bovenaan afgekapt (soms zelfs op desktop), en onder de stappen-kaart staat ~35–40% lege ruimte — terugkerend over 30+ missies. Dit zijn twee fixes met enorme hefboomwerking.
2. **De chat-missies zijn de zwakste groep:** verkeerde of ontbrekende afbeeldingen, knopkleuren die afwijken van de huisstijl (oranje/rood/coral i.p.v. acid-geel), en contrastproblemen.
3. **Toegankelijkheid zit overal tegen een plafond van ~3/5:** lage-contrast grijze tekst, te kleine tikdoelen, icon-knoppen zonder label, en technische labels als `/GOAL` die naar leerlingen lekken.

**In cijfers:** 109 missies beoordeeld · 504 screenshots · **495 bevindingen** (18 echte KRITIEK, 121 HOOG, 211 MIDDEL, 137 LAAG). De verificatie-laag bevestigde 106 zware bevindingen en **filterde 41 vals-alarmen eruit** (~28%). Bruikbaarheid (194) en toegankelijkheid (130) leveren de meeste bevindingen op.

> **Belangrijke nuance — 8 "lege" bonus-missies zijn géén productiebug.** De bonus-submissies (`bonus-business-model`, `-competitor-analysis`, `-extra-pagina`, `-investor-pitch`, `-level`, `-powerup`, `-sequel`, `-vijand`) renderden leeg in de **standalone preview**. Reden: hun config zit *genest in een ouder-missie* in `year1.tsx` en ze staan niet zelfstandig in het curriculum, dus de preview-route vindt geen losse rol → leeg scherm. Binnen hun ouder-missie (game-programmeur, verhalen-ontwerper, startup-pitch) renderen ze normaal. Ze vallen dus **buiten** deze screenshot-review en moeten in hun ouder-flow gecheckt worden — niet als 8 kapotte missies behandelen.

---

## 2. Methode & dekking (eerlijk over beperkingen)

- **Volledige dekking:** alle 109 missies, elk op 4 viewports; 101 missies standalone gerenderd + beoordeeld, 8 bonus-submissies niet standalone-rendeerbaar (zie nuance hierboven).
- **Live render, geen code-gok:** elke bevinding is gebaseerd op een echte screenshot.
- **Betrouwbaarheid ingebouwd:** 20 review-agents (per missie-familie) → onafhankelijke verificatie-agent per zware bevinding → 41 over-geclassificeerde bevindingen verwijderd.
- **Beperking 1 — geen live AI:** de lokale omgeving draait met een dummy-backend, dus in de chat-missies is de *schermindeling/uitstraling* beoordeeld, niet de AI-antwoorden zelf.
- **Beperking 2 — preview vs. echt apparaat:** de preview rendert de missie zonder de app-header; afsnij-effecten bovenaan zijn op een echt toestel met statusbalk/notch (safe-area) waarschijnlijk net zo erg of erger. Aanbevolen fixes zijn hoe dan ook correct, maar verifieer de afsnij-gevallen op een fysiek apparaat.

### Scores per missie-familie (gemiddelde 1–5)

| Familie | n | Visueel | Bruikbaar­heid | Toeganke­lijkheid | Engagement |
|---|---:|---:|---:|---:|---:|
| **chat-role** ⚠️ | 17 | 2.24 | 2.29 | 2.00 | 2.65 |
| bespoke | 12 | 3.42 | 3.33 | 2.92 | 4.08 |
| template: builder-canvas | 19 | 3.84 | 3.53 | 2.95 | 3.74 |
| template: data-viewer | 15 | 3.80 | 3.47 | 3.00 | 3.73 |
| template: debate-arena | 9 | 3.89 | 3.78 | 3.00 | 3.89 |
| template: scenario-engine | 12 | 3.83 | 3.83 | 3.00 | 3.83 |
| template: review-arena | 7 | 4.00 | 3.43 | 3.00 | 3.71 |
| template: tool-guide | 7 | 3.71 | 3.86 | 3.00 | 3.86 |
| template: simulation-lab | 5 | 4.00 | 4.00 | 3.00 | 3.60 |
| template: puzzle-lab | 5 | 4.00 | 3.40 | 3.00 | 4.40 |
| template: ethics-council | 1 | 4.00 | 3.00 | 3.00 | 4.00 |

> Het chat-role-gemiddelde wordt sterk gedrukt door de 8 bonus-submissies (score 1, zie nuance). De 9 échte chat-missies scoren rond 3–4, maar hebben eigen problemen (beelden, CTA-kleur, contrast). **Let op het patroon: toegankelijkheid is in élke familie ≤3.0** — een platform-breed plafond.

---

## 3. Bevindingen op prioriteit

### 🔴 KRITIEK (18 echte) — gegroepeerd per thema

**A. KEES-mascotte bovenaan afgesneden (mobiel/iPad, soms desktop)** — *shared-shell, hoogste hefboom*
Op mobiel (390px) is de eend-avatar/het tekstballonnetje bovenaan afgekapt; bij `prototype-developer` valt zelfs de bovenkant van de KEES-kaart buiten beeld, bij `innovation-lab` knipt het zelfs op desktop.
- Missies o.a.: `prototype-developer`, `podcast-producer`, `startup-pitch`, `word-wizard`, `innovation-lab` (+ shared-shell over builder-canvas / data-viewer / scenario-engine / tool-guide).
- **Fix (1×):** geef de bovenste container in de gedeelde intro-shell `pt-8` + `env(safe-area-inset-top)`. Verifieer op een echt iOS/Android-toestel. Dit raakt ~15–20 missies in één keer.

**B. Mobiele layout breekt in de op-maat-missies**
- `layout-doctor` (mobiel): het Word-canvas is volledig onzichtbaar — alleen het docent-paneel vult het scherm, dus de leerling ziet de taak niet. **Fix:** tab/drawer-patroon (canvas standaard, "Klacht lezen" als overlay), of verticaal stapelen.
- `layout-doctor` (mobiel): Word-toolbarknoppen zijn ~<24px (geen touch-formaat). **Fix:** verberg/vereenvoudig de toolbar onder 640px.
- `cloud-cleaner` (mobiel): de map-FAB overlapt de laatste bestandskaart, die daardoor amper aantikbaar is. **Fix:** `padding-bottom: 80px` onder het grid; verplaats de FAB naar rechtsonder.

**C. CTA's die niet kloppen** *(deels shared-shell)*
- `pitch-police` (alle viewports): de primaire knop "Lees eerst de stappen" is **grijs** en lijkt daardoor uitgeschakeld. **Fix:** `bg-duck-acid` + `text-duck-ink`.
- Chat-missies met afwijkende knopkleur t.o.v. de acid-huisstijl: `review-week-1` (oranje, niet `rounded-full`), `verhalen-ontwerper` (rood "Start Mijn Boek"), `social-media-psychologist` (coral tip-knoppen). **Fix:** standaardiseer CTA's naar duck-acid in de gedeelde shell; thema-afwijkingen alleen bewust + gedocumenteerd.

**D. Verkeerde / ontbrekende afbeeldingen** *(inhoudsbug)*
- `data-verzamelaar`: de hero toont een **"Anti-Cyberbullying"-schild (HATE/BULLY/MEAN)** op een missie over dataverzameling/schoolreizen — misleidend. **Fix:** koppel de juiste asset in de missie-config.
- `review-week-1`: geen hero-afbeelding, alleen een grijs vlak met reset-icoon. **Fix:** echte hero toevoegen / asset-koppeling herstellen.

**E. Onduidelijke instructie / contrast**
- `game-director` (mobiel): toont de instructie *"Op iPad: houd een blok ingedrukt…"* terwijl de leerling op een telefoon zit. **Fix:** apparaat-detectie; geen apparaatnamen in de tekst.
- `social-media-psychologist`: de "ANALYSE…"-knop (beige op donkergroen) haalt waarschijnlijk geen 3:1-contrast. **Fix:** wit of acid-geel op het groene paneel.
- `ai-beleid-brainstorm` (mobiel): de stap-header plakt zonder witruimte tegen de doel-kaart. **Fix:** `mt-4` boven de stap-header.
- `ai-tekengame`: het tekenveld toont maar 1 van de spelstappen en is visueel niet herkenbaar als tekengebied. **Fix:** alle stappen tonen (scrollbaar) + tekenveld duidelijk omlijnen.

### 🟠 HOOG (121) — dominante thema's

- **~35–40% lege ruimte onder de stappen-kaart** (shared-shell, ~30 missies, vooral iPad-staand): builder-canvas, review-arena, scenario-engine, data-viewer, debate-arena. **Fix:** centreer de kaart verticaal of begrens de inhoud met een `max-w`/`min-h`-verhouding in de shell.
- **Geen duidelijke "Volgende stap"-knop / passieve stepper** (o.a. `access-control-engineer`): voortgang is alleen een tellertje, geen actieve CTA. **Fix:** een (disabled→actief) "Volgende stap"-knop met visuele feedback bij het bereiken van het minimum.
- **Intro/briefing begint half-gescrold** (de pagina opent in het midden i.p.v. bovenaan), waardoor de context boven de opdracht wegvalt. **Fix:** scroll-to-top bij mount.
- **Drag-and-drop niet duidelijk** (o.a. `cloud-cleaner`): de instructie staat klein en grijs rechtsboven. **Fix:** prominente instructie/animatie bij eerste render.

### 🟡 MIDDEL (211) & ⚪ LAAG (137) — terugkerende patronen

- **Technisch label `/GOAL`** lekt zichtbaar naar leerlingen in de doel-kaart (data-viewer e.a.). **Fix:** label verbergen of vervangen door "Jouw doel".
- **Lage-contrast grijze tekst** ("Bewijs:", beschrijvingen) in debate-arena/review-arena. **Fix:** donkerder tekst-token.
- **Icon-only knoppen zonder `aria-label`** (oog-iconen, toggles) + onduidelijke klikbaarheid.
- **Inconsistente pill-kleuren zonder legenda** (acid vs. ink) — betekenis onduidelijk.
- **Lange namen wrappen lelijk** (bv. `Huiswerk_Wiskunde.pd / f` in cloud-cleaner landscape). **Fix:** `truncate`/ellipsis.

---

## 4. Quick Wins (1–3 dagen, hoge impact)

1. **Top-safe-area in de gedeelde intro-shell** (`pt-8` + `env(safe-area-inset-top)`) → lost de afgesneden KEES-mascotte op in ~15–20 missies tegelijk.
2. **Lege ruimte onder de stappen-kaart inperken** in de template-shell → ~30 missies netter, vooral op iPad.
3. **CTA's standaardiseren naar duck-acid** in de gedeelde shell + `pitch-police` grijs→acid → directe huisstijl-winst.
4. **`data-verzamelaar` en `review-week-1` hero-afbeeldingen** corrigeren (inhoudsbug).
5. **`/GOAL`-label** vervangen door "Jouw doel".
6. **scroll-to-top bij mount** zodat de intro altijd bovenaan begint.

## 5. Structurele verbeteringen (1–2 sprints)

1. **Toegankelijkheids-sweep om het ~3.0-plafond te doorbreken:** contrast-tokens voor secundaire tekst, alle tikdoelen ≥44px, `aria-label` op icon-knoppen, reduced-motion respecteren, `/GOAL` en andere code-labels opschonen.
2. **Chat-missie-familie opknappen** (laagste scores): consistente CTA-kleur, correcte/aanwezige beelden, contrast in de simulator-panelen, en de lege ruimte in de AiLab-werkbank.
3. **Mobiele patronen voor de bespoke "OS-simulatie"-missies** (`cloud-cleaner`, `layout-doctor`): drawer/tab-layouts, FAB-conventies, voldoende onder-padding.
4. **Verifieer de 8 bonus-submissies binnen hun ouder-flow** (coverage-gap, geen losse bug).

## 6. Wat al sterk is

- **Consistent, aantrekkelijk intro-patroon** (doel-kaart, "Zo werk je", niveaus, mascotte) — waar niets wordt afgesneden ziet het er strak en uitnodigend uit.
- **Hoge engagement** in de op-maat-missies (4.08) en puzzel-missies (4.40).
- **Template-architectuur = hefboom:** de meeste topbevindingen zijn één gedeelde fix die tientallen missies tegelijk verbetert.
- **Beste missies** (gem. ≥4.0): `datalekken-rampenplan` (4.25), `data-voor-data`, `ai-trainer`, `game-programmeur`, `digital-storyteller`, `meme-machine`, `data-journalist`, `eindproject-j2`, `encryption-expert`, `wachtwoord-warrior`.

---

## 7. Top-10 prioriteitenlijst

| # | Actie | Type | Hefboom |
|---|---|---|---|
| 1 | Template-shell: top-safe-area/padding → KEES-afsnijding | KRITIEK · shared-shell | ~15–20 missies |
| 2 | CTA-kleur standaardiseren naar duck-acid (+ pitch-police) | KRITIEK/HOOG · shared-shell | veel missies |
| 3 | Lege ruimte onder stappen-kaart inperken | HOOG · shared-shell | ~30 missies |
| 4 | `layout-doctor` + `cloud-cleaner` mobiele layout (verborgen canvas / FAB-overlap) | KRITIEK | 2 missies, hoog gebruik |
| 5 | `data-verzamelaar` + `review-week-1` verkeerde/missende hero | KRITIEK · inhoud | 2 missies |
| 6 | Toegankelijkheids-sweep (contrast, 44px, aria, `/GOAL`) | HOOG · systeembreed | alle missies |
| 7 | `game-director` apparaat-specifieke instructie | KRITIEK | 1 missie |
| 8 | `social-media-psychologist` contrast ANALYSE-knop | KRITIEK · a11y | 1 missie |
| 9 | "Volgende stap"-CTA i.p.v. passieve stepper | HOOG | meerdere |
| 10 | 8 bonus-submissies in ouder-flow verifiëren | coverage-gap | 8 submissies |

---

*Methode-artefacten: screenshots in `reports/design-audit/student-missions-2026-06-30/screens/` · volledige per-missie scorecards en alle 495 bevindingen in `findings-aggregate.json` + `all-findings.json`. Geen code is in deze ronde gewijzigd — dit zijn bevindingen + fix-voorstellen ter goedkeuring.*
