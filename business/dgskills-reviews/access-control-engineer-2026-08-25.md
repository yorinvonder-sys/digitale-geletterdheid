# Rubric-review: Access Control Engineer

**Datum:** 2026-08-25
**templateType:** handcrafted (`src/features/missions/AccessControlEngineerMission.tsx`)
**Curriculum-plek:** Leerjaar 2, periode met o.a. `wachtwoord-fortress` (`src/config/curriculum.ts:190-198`)
**SLO-claim:** regulier `21A`, `23A` · VSO `18A`, `20A` (`src/config/slo-kerndoelen-mapping.ts:126`)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)
Geen template-baseline beschikbaar (handcrafted).

### ✅ Geslaagd
- **Criterium 1 (tokens):** consistent `duck-*`-gebruik door het hele component (`duck-bg`, `duck-ink`, `duck-acid`, `duck-error`), geen hex-literals of niet-doeldomein tokens gevonden.
- **Criterium 3 (knop-clarity):** elke `<button>` heeft een functionele `onClick`, icon+label combinaties, en `aria-pressed`/`aria-label` waar nodig (bv. `AccessControlEngineerMission.tsx:383`, `:453-455`, `:560`).
- **Criterium 4 (copy-lengte):** introtekst voor leerjaar 2 (<80 woorden) blijft ruim binnen de grens (±35 woorden, `:433`).
- **Criterium 5 (responsive):** `min-h-[44px]`/`min-w-[44px]` tap-targets, `flex-wrap`, `max-w-2xl`-container — geen vaste pixelbreedtes die mobiel breken.
- **Criterium 6 (motion):** geen `motion.div`/`AnimatePresence`; de enige animatie (`animate-in slide-in-from-bottom-4` op de coach-bubble, `:731`) heeft functionele waarde (aandacht trekken bij nieuwe hint) en overschrijdt de simultane-animatie-grens niet.

### ⚠️ Aandachtspunten
- **Criterium 1 / Toegankelijkheid — rolkleuren zonder onderscheid**: `ROLLEN_KLEUREN` (`AccessControlEngineerMission.tsx:251-256`) geeft `leerling`, `docent` én `admin` exact dezelfde stijl (`bg-duck-ink text-white`); alleen `gast` wijkt af.
  - **Wat:** in stap 2 (rechten instellen) en stap 3 (testresultaten) zijn de rolbadges voor leerling/docent/admin visueel identiek.
  - **Waarom:** de kern-leerdoel van deze missie is onderscheid maken tussen rollen en hun rechten. Als de UI zelf geen visueel onderscheid maakt tussen drie van de vier rollen, moet de leerling puur op de tekstlabel vertrouwen — dat verzwakt precies het concept dat de missie aanleert.
  - **Voorstel:** geef elke rol een eigen duck-token-kleur, bv.:
    ```tsx
    // ❌ Huidig — AccessControlEngineerMission.tsx:251-256
    const ROLLEN_KLEUREN: Record<string, string> = {
        leerling: 'bg-duck-ink text-white',
        docent: 'bg-duck-ink text-white',
        admin: 'bg-duck-ink text-white',
        gast: 'bg-duck-bg text-duck-ink/60',
    };

    // ✅ Voorgesteld
    const ROLLEN_KLEUREN: Record<string, string> = {
        leerling: 'bg-duck-ink text-white',
        docent: 'bg-duck-acid text-duck-ink',
        admin: 'bg-duck-error text-white',
        gast: 'bg-duck-bg text-duck-ink/60',
    };
    ```
- **Criterium 7 (toegankelijkheid) — focus-state alleen op terugknop**: alleen de "Terug"-knop in de header heeft een expliciete `focus-visible:ring-2` (`:383`); de rol-toggle-knoppen (stap 2), test-knoppen (stap 3) en stap-indicator-knoppen leunen op de browser-default focus-outline.
  - **Wat:** geen consistente `focus-visible:ring-*`-styling op interactieve elementen buiten de header.
  - **Waarom:** toetsenbord-navigatie is minder duidelijk zichtbaar op de belangrijkste interactieve elementen van de missie.
  - **Voorstel:** voeg `focus-visible:ring-2 focus-visible:ring-duck-acid` toe aan de knop-className-templates in stap 2 (`:561`) en stap 3 (`:637`, `:651`, `:664`).

### ❌ Blocking issues
- Geen.

### Visual Precision Gate
Statisch beoordeeld (geen Chrome-plugin dynamische verificatie in deze pass — dat is scope van de tech-reviewer's Fase B, hier niet uitgevoerd). Op basis van de JSX-structuur zijn geen overlap- of overflow-patronen zichtbaar; badges/knoppen gebruiken consistente `rounded-full`/`rounded-xl`-afmetingen. Markeer als **unverified** voor dynamische claims.

### Score
5/7 criteria hard geslaagd, 2 aandachtspunten (geen blocking) · Aanbeveling: **fix-eerst** (kleine, gerichte fix)

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 2 · SLO regulier `21A` (Digitale systemen), `23A` (Veiligheid & privacy) · VSO `18A`, `20A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** `21A` en `23A` zijn geldige regulier-codes, `18A`/`20A` geldige VSO-codes (`slo-kerndoelen-mapping.ts:126`). Niet te veel (2), niet te weinig.
- **Criterium 2 (SLO-fit):** `21A` (digitale systemen: hoe werkt toegang/rollen in een systeem) wordt substantieel geraakt in stap 2 (rechten instellen per resource) en stap 3 (testen). `23A` (veiligheid & privacy) wordt geraakt via de onveilige-regels-analyse in stap 1 (cijfers-privacy, authenticatie-gebrek). Beide kerndoelen worden niet oppervlakkig aangeraakt maar geoefend over meerdere stappen.
- **Criterium 3 (leerdoelen):** `MISSION_GOAL.primaryGoal` (`:60-68`) is concreet en actiewerkwoord-gedreven ("Ik beveilig... door te vinden, te verbeteren en te testen"); `criteria.description` benoemt de drie meetbare deelstappen.
- **Criterium 4 (copy-beknoptheid):** introtekst en stap-instructies blijven ruim onder de leerjaar-2-grens (intro <80, opdracht <60 woorden); geen enkel copy-veld overschrijdt.
- **Criterium 5 (leeftijds-passend):** herkenbare schoolcontext (cijfers, rooster, wachtwoord), directe motiverende toon, geen onnodig jargon — "authenticatie" wordt direct uitgelegd in `r2.uitleg` (":95: 'Zonder authenticatie (controleren wie je bent)...'").
- **Criterium 6 (curriculum-plek):** logisch geplaatst na `wachtwoord-warrior`/`wachtwoord-fortress` in dezelfde periode (`curriculum.ts:196-197`) — bouwt voort op wachtwoord/authenticatie-basiskennis richting een breder toegangsrechten-concept.
- **Criterium 7 (Bloom-balans):** goede spreiding — stap 1 is analyseren (regels beoordelen op veiligheid), stap 2 is toepassen/creëren (rechten configureren), stap 3 is evalueren (testresultaat tegen verwachting toetsen). Geen pure onthouden-quiz.
- **Criterium 9 (welzijn):** VSO-mapping aanwezig en met een aangepaste, kortere introtekst (`isVso`-tak, `:432`); geen gevoelige onderwerpen die welzijnsprotocol vereisen.

### ⚠️ Aandachtspunten
- **Criterium 3 (expliciete leerdoelen)**: geen apart `learningObjectives`-array, alleen `MISSION_GOAL.primaryGoal` + `criteria.description`.
  - **Wat:** het leerdoel is impliciet in één zin geformuleerd, niet uitgesplitst per deelvaardigheid.
  - **Waarom:** voor docentrapportage is minder granulair zichtbaar wélke deelvaardigheid (probleem herkennen vs. rechten toepassen vs. testen evalueren) een leerling wel/niet beheerst.
  - **Voorstel:**
    ```text
    ✅ Voor access-control-engineer (leerjaar 2, SLO 21A/23A):
    learningObjectives: [
      'De leerling herkent onveilige toegangsregels in een systeembeschrijving.',
      'De leerling stelt toegangsrechten in volgens het principe van minimale rechten.',
      'De leerling test of een rechtenconfiguratie het juiste toegangsresultaat oplevert.',
    ]
    ```
    (Puur ter verrijking van docentrapportage — niet blocking, want `MISSION_GOAL` dekt het leerdoel al functioneel af.)

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21A (Digitale systemen):** sterk geraakt — leerling configureert en test daadwerkelijk een rechtensysteem (stap 2+3).
- **23A (Veiligheid & privacy):** sterk geraakt — stap 1 laat expliciet privacygevoelige (cijfers) en authenticatie-gerelateerde risico's identificeren.

### Score
8/8 criteria geslaagd (1 niet-blokkerend aandachtspunt) · Bloom-balans: **medium-hoog** (analyseren → toepassen → evalueren) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin-sessie in deze rubric-pass; alleen statische code-analyse.

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** alle knoppen hebben functionele `onClick`, geen dode knoppen of `cursor-pointer`-divs zonder handler gevonden.
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`/`@ts-expect-error`; `Props`, `User`, `Regel`, `ToegangsRegel`, `TestScenario`, `MissionState` zijn expliciet getypeerd (`:11-58`).
- **A4 (imports via alias):** `@/hooks/useMissionAutoSave`, `@/features/missions/templates/shared/*` — geen relatieve `../../`-paden.
- **A6 (restart-safe state):** gebruikt `useMissionAutoSave('access-control-engineer', ...)` direct (`:267-276`), geen tussenlaag — voortgang overleeft een refresh.
- **A7 (security):** geen `dangerouslySetInnerHTML`, geen AI-calls dus geen `systemInstruction`-issue, geen edge-function-calls dus A5 n.v.t.

#### ⚠️ Aandachtspunten
- **Fragiele koppeling test-scenario ↔ resource via titel-string**: `voerTestUit` zoekt de resource op met `RESOURCES.find(r => r.resource === scenario.resource)` (`:346`) — matcht op de leesbare titel-string, niet op een stabiele `id`.
  - **Wat:** `TestScenario.resource` en `ToegangsRegel.resource` zijn beide vrije strings die letterlijk moeten overeenkomen.
  - **Risico:** een toekomstige copy-tweak aan `RESOURCES[n].resource` (bv. een spelfout corrigeren) breekt stilzwijgend de matching in `TEST_SCENARIOS` — geen TypeScript-error, de test faalt gewoon runtime zonder duidelijke oorzaak.
  - **Voorstel:** koppel via `resourceId` in plaats van titel-string:
    ```ts
    // ❌ Huidig — AccessControlEngineerMission.tsx:34-40, :167-210, :346
    interface TestScenario {
        id: string;
        gebruiker: User;
        resource: string; // vrije string, moet matchen met ToegangsRegel.resource
        verwachtResultaat: 'toegang' | 'geblokkeerd';
        uitleg: string;
    }
    // ...
    const resource = RESOURCES.find(r => r.resource === scenario.resource);

    // ✅ Voorgesteld
    interface TestScenario {
        id: string;
        gebruiker: User;
        resourceId: string; // verwijst naar ToegangsRegel.id
        verwachtResultaat: 'toegang' | 'geblokkeerd';
        uitleg: string;
    }
    // ...
    const resource = RESOURCES.find(r => r.id === scenario.resourceId);
    ```
    Niet blocking — huidige data is consistent en de koppeling werkt vandaag correct — maar een risico voor toekomstig onderhoud.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd in deze rubric-pass — geen dev-server/Chrome-plugin beschikbaar binnen deze reviewopdracht. Dynamische Visual Precision Gate-claims blijven **unverified**.

### Score
Static: 5/6 criteria geslaagd (A2 en A5 n.v.t. — geen async/edge-calls) · Dynamic: n.v.t. · Aanbeveling: **ship** (het ene aandachtspunt is een onderhoudsrisico, geen functionele bug)

---

## Voorstellen (samenvatting, direct toepasbaar)

1. **Rolkleuren onderscheiden** (`src/features/missions/AccessControlEngineerMission.tsx:251-256`) — geef `docent` en `admin` eigen duck-tokens i.p.v. dezelfde kleur als `leerling`. Zie Voorstel-blok in design-sectie.
2. **Focus-visible op stap 2/3-knoppen** (`:561`, `:637`, `:651`, `:664`) — voeg `focus-visible:ring-2 focus-visible:ring-duck-acid` toe.
3. *(Niet-blokkerend, optioneel)* Expliciete `learningObjectives` toevoegen voor rijkere docentrapportage.
4. *(Niet-blokkerend, optioneel)* `TestScenario.resource` → `resourceId` voor robuustere koppeling bij toekomstige copy-wijzigingen.

---

## Samenvatting & verdict

Access Control Engineer is een solide, zelfstandige handcrafted-missie: heldere SLO-fit (21A/23A, sterk geraakt in beide), goede Bloom-balans over drie stappen, type-veilige code zonder dode knoppen of security-gaten, en consistent duck-tokengebruik. De enige echte tekortkoming is dat het rolkleursysteem — het visuele hulpmiddel dat precies het kernconcept van de missie (rolverschillen) zou moeten ondersteunen — drie van de vier rollen identiek kleurt. Dat is een kleine, gerichte fix, geen herontwerp.

**Verdict: fix-eerst** (op basis van het design-aandachtspunt; didactiek en tech zijn ship-klaar).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
