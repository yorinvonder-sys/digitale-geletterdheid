# Missie-review: podcast-producer

**Datum:** 2026-07-01 · **Wave:** 9 (verse review) · **TemplateType:** builder-canvas
**Config:** `src/features/missions/templates/builder-canvas/configs/podcast-producer.ts`
**Agent-rol:** `src/config/agents/year2.tsx:1533-1625` (`id: 'podcast-producer'`)
**Curriculum:** Leerjaar 2, Periode 3 ("Digitale Media & Creatie") — `src/config/curriculum.ts:203`
**SLO-claim:** `22A`, `21B` (regulier) · `19A`, `18B` (VSO) — `src/config/slo-kerndoelen-mapping.ts:127`

---

## 🎨 Design review

**Mission:** podcast-producer (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (tokens in config):** `podcast-producer.ts` bevat zelf geen Tailwind-classes (pure content-config) — n.v.t., geen violaties.
- **Criterium 3 (knop-clarity):** engine-niveau (`BuilderCanvas.tsx`), niet missie-specifiek — geen afwijking gevonden in de config.
- **Criterium 4 (copy-lengte):** `introDescription` = 56 woorden, ruim onder de leerjaar 2-grens (<80). Ronde-instructies (`instruction`-velden) variëren 33–62 woorden, onder de <60-grens voor de langste (structuur-stap: 62 woorden) — licht over de grens maar marginaal.
- **Criterium 6 (Framer Motion):** geen `motion.*` in de config — engine-verantwoordelijkheid, n.v.t.

### ⚠️ Aandachtspunten
- **Criterium 1 (tokens, buiten config-scope maar wel missie-identiteit)**: `visualPreview` in `src/config/agents/year2.tsx:1547` gebruikt `from-lab-coral to-lab-sage` — legacy `lab-*` aliassen, geen hex-literals, dus technisch geen fout onder het rubric (aliassen zijn toegestaan). Genoteerd als context, niet als fail.
- **Criterium 4 (copy-lengte)**: `steps[1].instruction` (structuur-stap) — `src/features/missions/templates/builder-canvas/configs/podcast-producer.ts:40` — is 62 woorden, 2 woorden over de <60-richtlijn voor leerjaar 2. Marginaal, geen actie vereist.

### ❌ Blocking issues
- Geen.

**Visual Precision Gate:** niet uitgevoerd — geen dev-server/Chrome-plugin-sessie beschikbaar in deze review-run; geen screenshots-map aangetroffen onder `.ui-review/` voor deze missie. Markeer als **unverified** (statisch oordeel op config-inhoud alleen).

### Score
3/4 toepasselijke criteria geslaagd (2 n.v.t. op config-niveau) · Aanbeveling: **ship** (design-niveau, met unverified Visual Precision Gate genoteerd)

---

## 📚 Didactiek review

**Mission:** podcast-producer (builder-canvas)
**Curriculum-plek:** Leerjaar 2, Periode 3
**SLO-claim:** 22A, 21B (regulier) · 19A, 18B (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `22A` (digitale producten) en `21B` (media & informatie) zijn geldige regulier-VO-codes; `19A`/`18B` zijn geldige VSO-codes. `slo-kerndoelen-mapping.ts:127`.
- **Criterium 2 (SLO-fit)**: beide kerndoelen worden substantieel geraakt — de leerling ontwerpt een compleet mediaproduct (22A) en werkt met structuur/doelgroep-informatie voor een medium (21B). Sterk contact, geen oppervlakkigheid.
- **Criterium 4 (copy-beknoptheid)**: `introDescription` 56 woorden (<80 ✓), instructies 33–62 woorden (grotendeels <60 ✓, zie design-review voor de marginale overschrijding).
- **Criterium 5 (leeftijds-passend)**: taal is direct en motiverend ("Dat hoor je terug in je stem", "Verras je luisteraar!"), concrete voorbeelden (hook-voorbeelden), geen jargon zonder uitleg.
- **Criterium 6 (curriculum-plek)**: past logisch in "Digitale Media & Creatie" naast `meme-machine`, `digital-storyteller`, `brand-builder`, `video-editor` — vergelijkbare mediaproductie-missies in dezelfde periode.
- **Criterium 7 (Bloom-balans)**: mix van toepassen (structuur bouwen, intro schrijven) en analyseren (reflectievraag hook vs. intro, `podcast-producer.ts:63-69`) — geen pure recall.
- **Criterium 9 (welzijn/VSO)**: VSO-mapping aanwezig, geen gevoelige onderwerpen die doorverwijsgedrag vereisen.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — BLOCKING-kandidaat, zie hieronder**: de chat-briefing en de canvas-stappen beschrijven **twee verschillende opdrachten** die de leerling tegelijk voorgeschoteld krijgt.
  - **Wat:** de canvas (`podcast-producer.ts:19-86`) heeft 4 stappen — *Onderwerp kiezen* → *Structuur plannen* → *Intro schrijven* → *Interviewvragen bedenken* — met eigen checklists en tekstprompts, gericht op een **geschreven podcast-script met interviewvragen**. De agent-briefing (`year2.tsx:1564-1606`) beschrijft een **eigen 3-stappenplan** — *Onderwerp & Doelgroep* → *Script schrijven* → *Opnameplan* — met eigen `STAP-VOLTOOIING`-criteria die een "opnameplan" verwachten (apparatuur, locatie, interviewpartner) dat **nergens in de canvas-checklist voorkomt**. De agent stuurt bovendien `---STEP_COMPLETE:1/2/3---`-markers die corresponderen met zíjn eigen 3 stappen, niet met de 4 canvas-stappen.
  - **Waarom:** de leerling ziet in de canvas 4 concrete opdrachten (checklist-items, tekstprompt per stap) maar de chat-coach ernaast werkt naar een ander doel toe (opnameplan met apparatuur/locatie) dat in de canvas-flow geen thuis heeft. Dit is verwarrend: welke stap moet de leerling nu afronden — de canvas-checklist of wat de chat vraagt? Het risico is dat de leerling de chat volgt richting een "opnameplan" terwijl de canvas-voortgang (`checklistItems`) daar niet op reageert, of andersom de canvas afvinkt terwijl de chat geen `STEP_COMPLETE` stuurt omdat die op geheel andere criteria let.
  - **Voorstel:** lijn de agent-briefing's `STAP-VOLTOOIING`-criteria en `steps`-array uit `year2.tsx` uit op de 4 canvas-stappen (onderwerp/structuur/intro/interviewvragen), of schrap het "opnameplan"-onderdeel uit de briefing zodat de chat dezelfde 4 opdrachten coacht als de canvas toont. Dit is een missie-specifieke content-fix, geen engine-issue.

    ```text
    ❌ Huidig — src/config/agents/year2.tsx:1593-1596
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling een duidelijk concept heeft beschreven: onderwerp, doelgroep, format (interview/verhaalpodcast/discussie) en de unieke invalshoek.
    - Stuur ---STEP_COMPLETE:2--- als de leerling een volledig script heeft geschreven voor een aflevering van minimaal 3 minuten, inclusief intro, kern en outro.
    - Stuur ---STEP_COMPLETE:3--- als de leerling een opnameplan heeft gemaakt: wat heb je nodig, hoe ga je de opname structureren, en wat zijn de back-upplannen?

    ✅ Voorgesteld
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling een concreet onderwerp heeft gekozen en beschreven waarom dit past bij hun doelgroep.
    - Stuur ---STEP_COMPLETE:2--- als de leerling een structuur heeft geschreven met intro, 3 segmenten en een outro.
    - Stuur ---STEP_COMPLETE:3--- als de leerling een intro heeft geschreven met een pakkende hook, zelfvoorstelling en onderwerp-aankondiging.
    - Stuur ---STEP_COMPLETE:4--- als de leerling 5 interviewvragen heeft bedacht, waarvan minstens 3 open vragen, elk met een follow-up.
    ```
    En vervang de `steps`-array (`year2.tsx:1607-1623`, gebruikt in de briefing-preview vóór de chat start) met titels/omschrijvingen die 1-op-1 matchen met de canvas-stappen, i.p.v. de huidige 3 ("Onderwerp & Doelgroep" / "Script schrijven" / "Opnameplan").

### ❌ Blocking issues
- **AI-as-copilot / STEP_COMPLETE-mismatch** (criterium 8): de chat-agent stuurt voortgangsmarkers voor een ander stappenplan dan de canvas toont. Dit is geen esthetisch aandachtspunt maar een functionele inconsistentie die de leerling-flow kan breken (zie tech-review voor het mechanisme).

### SLO-fit oordeel
- **22A (digitale producten)**: sterk geraakt — de leerling ontwerpt een compleet podcast-script als digitaal mediaproduct.
- **21B (media & informatie)**: sterk geraakt — doelgroepbepaling en structuurkeuze zijn kernactiviteiten van dit kerndoel.

### Score
6/9 criteria geslaagd (1 blocking) · Bloom-balans: medium · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Mission:** podcast-producer (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-run, geen bestaande screenshots-map voor deze missie aangetroffen (`docs/audits/student-missions-ui-ux-review-2026-06-30.md` bevat geen `podcast-producer`-vermelding).

### Static analyse

#### ✅ Geslaagd
- **A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in `podcast-producer.ts`. Config is volledig getypeerd via `BuilderCanvasConfig`.
- **A4 (imports via alias)**: n.v.t. — config-file heeft één relatieve import (`'../BuilderCanvas'`), wat het gangbare patroon is binnen dezelfde template-directory (zie ook zustermissies zoals `meme-machine.ts`) — geen afwijking.
- **A6 (restart-safe state)**: gedelegeerd aan de engine (`BuilderCanvas.tsx:69`, `useMissionAutoSave`) — geen missie-specifieke afwijking; config bevat zelf geen aparte state-logica.
- **A7 (security)**: geen `dangerouslySetInnerHTML` of client-side `systemInstruction`-definitie in de config; `chatRoleId: 'podcast-producer'` verwijst naar de server-side agent-rol (`year2.tsx`) zoals gewenst.

#### ⚠️ Aandachtspunten
- **STEP_COMPLETE-marker mismatch (functioneel, cross-referentie met didactiek-review)**: de agent stuurt `---STEP_COMPLETE:1/2/3---` (3 markers, `year2.tsx:1594-1596`) terwijl de canvas 4 stappen heeft (`podcast-producer.ts:19-86`, `steps[0..3]`). Als `BuilderCanvas.tsx` de `STEP_COMPLETE:N`-marker gebruikt om de N-de canvas-stap als voltooid te markeren (vergelijkbaar patroon bij andere chat-gekoppelde templates), dan markeert marker `3` mogelijk de derde canvas-stap ("Intro schrijven") als klaar op basis van een agent-beoordeling die feitelijk over een heel ander criterium gaat (het opnameplan), en de vierde canvas-stap ("Interviewvragen bedenken") krijgt nooit een corresponderende marker (`STEP_COMPLETE:4` wordt nooit verstuurd). **Risico:** de leerling kan de laatste canvas-stap niet via de chat laten "afvinken" doordat de agent geen marker voor stap 4 kent, of de voortgangs-koppeling loopt structureel scheef.
  - **Voorstel:** zie het Voorstel-blok in de didactiek-review hierboven — synchroniseer de `STAP-VOLTOOIING`-sectie in `year2.tsx` met de 4 canvas-stappen. Dit is de root-cause-fix; de exacte marker→stap-koppeling in `BuilderCanvas.tsx` (engine-code) hoeft niet gewijzigd te worden, alleen de content-marker-count in de config.
  - **Note:** ik heb `BuilderCanvas.tsx`'s exacte marker-parsing niet volledig doorlopen (engine-code, buiten scope van missie-specifieke review conform de opdracht "engine-issues niet als missie-issue rapporteren"). Het missie-specifieke deel — dat de config 4 stappen heeft en de agent-content maar 3 markers beschrijft — staat vast ongeacht de exacte engine-implementatie, en is zelf al genoeg reden voor de fix.

#### ❌ Blocking issues
- Geen aparte tech-blocking naast de hierboven genoemde marker-mismatch (die is al opgenomen als blocking onder de didactiek-review, criterium 8, om dubbeltelling te voorkomen).

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd in deze review-run — zie boven.

### Score
Static: 4/4 toepasselijke criteria geslaagd (1 aandachtspunt, cross-referentie naar didactiek-blocking) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (content-fix in `year2.tsx`, geen engine-wijziging nodig)

---

## Samenvatting & scoring

| Rubric | Score (0-10, 10=uitstekend) | Weging | Bijdrage |
|---|---|---|---|
| Design | 8 | 0.3 | (10-8)×0.3 = 0.6 |
| Didactiek | 6 | 0.4 | (10-6)×0.4 = 1.6 |
| Tech | 8 | 0.3 | (10-8)×0.3 = 0.6 |

**triageScore = 2.8**

### Kernbevinding
De `podcast-producer`-missie heeft een **content-mismatch tussen de builder-canvas-stappen en de chat-agent-briefing**: de canvas toont 4 concrete opdrachten (onderwerp → structuur → intro → interviewvragen), maar de gekoppelde chat-coach (`chatRoleId: 'podcast-producer'` in `year2.tsx`) werkt naar een eigen 3-stappenplan toe met een "opnameplan"-onderdeel dat in de canvas niet bestaat, en stuurt slechts 3 `STEP_COMPLETE`-markers voor 4 canvas-stappen. Dit is **niet** het bekende platform-brede "dormante chat"-patroon (chat is hier wél actief) — het is een missie-specifieke inhoudelijke desynchronisatie tussen twee content-bronnen die beide voor deze ene missie zijn geschreven maar nooit op elkaar zijn afgestemd.

### Aanbeveling
**fix-eerst.** De fix is beperkt tot content in `src/config/agents/year2.tsx` (STAP-VOLTOOIING-sectie + `steps`-array, regels 1593-1623) — geen wijziging aan `podcast-producer.ts` of engine-code nodig. Geschatte scope: ~15-20 regels tekst-herformulering, geen structuurwijziging.

### AutoFixable
Ja — mechanisch + missie-specifiek (tekst-vervanging binnen één bestaand blok, geen nieuwe architectuur, geen engine-wijziging). Zie Voorstel-blok in de didactiek-sectie hierboven voor exacte before/after.
