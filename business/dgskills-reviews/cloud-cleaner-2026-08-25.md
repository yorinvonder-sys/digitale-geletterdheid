# Missie-review: cloud-cleaner

**Datum:** 2026-08-25
**TemplateType:** dedicated (handcrafted-patroon: content + UI volledig inline in het component, geen aparte config/engine)
**Component:** `src/features/missions/review/CloudCleanerMission.tsx`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Mission:** cloud-cleaner (dedicated/handcrafted)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: uitsluitend geldige `duck-*` tokens (`duck-bg`, `duck-bgLight`, `duck-ink`, `duck-acid`, `duck-gray`, `duck-error`) — geen hex-literals, geen niet-doeldomein kleuren — `src/features/missions/review/CloudCleanerMission.tsx:352-873`.
- **Criterium 3 (Knop-clarity)**: alle interactieve elementen hebben functionele `onClick`/`onKeyDown`, duidelijke labels of iconen, en hover/focus-states — `CloudCleanerMission.tsx:401-585`, `648-719`.
- **Criterium 4 (Copy-lengte)**: alle copy ruim binnen de leerjaar 1-grens (intro <80, opdracht <60 woorden) — de langste tekst is de instructiezin op regel 449 (13 woorden).
- **Criterium 5 (Responsive)**: expliciete mobile-sidebar met `lg:hidden`/`translate-x` transitie, responsive grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`), geen vaste pixel-widths die mobiel breken — `CloudCleanerMission.tsx:441-447`, `645`.
- **Criterium 6 (Framer Motion)**: animaties zijn functioneel gekoppeld aan state (drag-over, shake bij foutieve drop, success-toast, modal-transities) — geen wrapper-spam.
- **Criterium 7 (Toegankelijkheid, basisdekking)**: dubbele codering bij `junk`-bestanden (kleur + `FileWarning`-icoon, niet alleen kleur) — `CloudCleanerMission.tsx:689-704`; folders en bestanden zijn `role="button"` + `tabIndex` + `onKeyDown` (Enter/Space) — toetsenbord-bruikbaar.

### ⚠️ Aandachtspunten
- **Criterium 3/7 (icoon-only knop zonder `aria-label`)**: de terug-knop gebruikt alleen `title`, geen `aria-label` — `CloudCleanerMission.tsx:401`.
  - **Wat:** `title`-attributen worden niet consistent door screenreaders voorgelezen; de mobiele sidebar-toggle ernaast gebruikt wél `aria-label` (regel 407), dus dit is een inconsistentie binnen hetzelfde component.
  - **Waarom:** een leerling met screenreader kan de functie van de terug-knop missen.
  - **Voorstel:** zie Voorstellen-sectie.
- **Criterium 7 (kleurcontrast)**: herhaald gebruik van `text-duck-ink/60` op `bg-duck-bgLight`/`bg-duck-bg` voor labels en bestandsnamen — `CloudCleanerMission.tsx:515`, `573`, `602-609`, `706-708`.
  - **Wat:** 60%-opacity ink-tekst op een lichte achtergrond is een bekend risicopatroon voor contrast onder de WCAG AA-drempel.
  - **Waarom:** kan moeilijk leesbaar zijn voor leerlingen met verminderd zicht.
  - **Voorstel:** contrastmeting (bv. via devtools) op de daadwerkelijke gerenderde kleuren vóór ship; indien onder 4.5:1, verhoog naar `text-duck-ink/70` of hoger voor primaire labels.

### ❌ Blocking issues
- Geen.
- **Visual Precision Gate**: niet dynamisch geverifieerd (geen Chrome-plugin sessie in deze review-pass) — status **unverified**, alleen statisch beoordeeld op basis van Tailwind-classes.

### Score
6/7 criteria geslaagd (1 warn, geen fail) · Aanbeveling: **ship** (met de twee aandachtspunten als lichte follow-up)

---

## 📚 Didactiek review

**Mission:** cloud-cleaner (dedicated/handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 2 (reviewMissions, week 2) — `src/config/curriculum.ts:94-98`
**SLO-claim:** `21A`, `23A` (regulier) · `18A`, `20A` (VSO) — `src/config/slo-kerndoelen-mapping.ts:39`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21A` (Digitale systemen) en `23A` (Veiligheid & privacy) zijn beide geldige regulier-VO-codes; `18A`/`20A` zijn geldige VSO-codes — `slo-kerndoelen-mapping.ts:39`.
- **Criterium 2 (SLO-fit 21A)**: sterk geraakt — de kernactiviteit is bestanden logisch in mappen indelen op basis van betekenis (vaksdocument, privé, troep), inclusief een "waarom"-reflectie per plaatsing — `CloudCleanerMission.tsx:17-66`, `219-223`.
- **Criterium 3 (Leerdoel helder)**: `missionGoals.ts` levert een concreet, actiewerkwoord-gedreven doel: "Ik ruim digitale schoolbestanden op door ze in logische mappen te plaatsen" met bijbehorend evidence-veld — `src/config/missionGoals.ts:49-55`.
- **Criterium 4 (Beknoptheid)**: ruim binnen de leerjaar 1-grens.
- **Criterium 5 (Leeftijds-passend)**: herkenbare, alledaagse bestandsnamen/mapnamen voor leerjaar 1 (Boekverslag, Vakantie-selfie, Huiswerk Wiskunde) — geen jargon.
- **Criterium 6 (Curriculum-plek)**: logisch geplaatst als periode 2-reviewmissie na de losse vak-opdrachten van periode 1 (print-pro, ipad-print-instructies) — bouwt voort op eerder aangeleerde bestandsbegrippen.
- **Criterium 7 (Bloom-balans)**: mix van toepassen (bestand correct sorteren) en beoordelen/redeneren (elke "waarom"-vraag + eindreflectie vraagt motivatie, niet alleen het juiste antwoord kiezen) — `CloudCleanerMission.tsx:747-786`, `834-863`.
- **Criterium 9 (Welzijn/VSO)**: VSO-mapping aanwezig (`18A`, `20A`); geen gender-specifieke aannames in copy.

### ⚠️ Aandachtspunten
- **Criterium 2 (SLO-fit 23A)**: oppervlakkig contact — `src/features/missions/review/CloudCleanerMission.tsx:105-107, 236-241`.
  - **Wat:** de veiligheidsclaim (23A) steunt op drie voor-de-hand-liggende junk-bestanden (`.exe`-hack, `Virus_Alert.html`, oude installer) die vooral op bestandsnaam te herkennen zijn, niet op een dieper veiligheidsprincipe.
  - **Waarom:** de missie oefent wel bewustzijn ("gooi verdachte bestanden weg"), maar leerlingen kunnen dit oplossen via naam-patroonherkenning zonder het onderliggende privacy/veiligheidsprincipe te doorzien.
  - **Voorstel:** geen code-fix nodig — didactisch is dit acceptabel voor leerjaar 1 (categorie "herkennen", passend Bloom-niveau); vermeld in toekomstige uitbreiding een junk-bestand waarvan de naam ongevaarlijk oogt, voor een dieper leereffect.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **21A**: sterk geraakt — bewijs: kernmechaniek van de hele missie.
- **23A**: oppervlakkig — bewijs: 3 junk-bestanden, naam-patroonherkenning.

### Score
8/9 criteria geslaagd (1 warn, geen fail) · Bloom-balans: medium · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** cloud-cleaner (dedicated/handcrafted)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen Chrome-plugin/dev-server sessie in deze review-pass (statische code-analyse only)

### Static analyse
#### ✅ Geslaagd
- **A1 (Knop-handlers)**: elk klikbaar element (`role="button"` divs, `<button>`s) heeft een functionele handler; geen dode `onClick={() => {}}` gevonden.
- **A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`; props/state volledig getypeerd via `interface CloudCleanerState`, `FileItem`, `FolderItem`, `CloudCleanerProps` — `CloudCleanerMission.tsx:9-14, 77-96`.
- **A5 (Edge function calls)**: n.v.t. — component doet geen `supabase.functions.invoke`/AI-calls (bevestigt de bekende valkuil: geen `enableChat`, dus een AI-agentrol is bewust niet actief hier).
- **A6 (Restart-safe state)**: gebruikt `useMissionAutoSave('cloud-cleaner', …)` rechtstreeks, geen tussenlaag; voortgang (resterende bestanden, score, mistakes, correctReflections) wordt persistent bewaard — `CloudCleanerMission.tsx:120-134`.
- **A7 (Security)**: geen `dangerouslySetInnerHTML`, geen leerling-vrije-tekstinvoer naar een AI-model (alle interactie is drag/click op vaste data) — er is geen sanitisatie-risico omdat er geen vrij tekstveld is.

#### ⚠️ Aandachtspunten
- **A4 (Import-alias)**: `MissionGoalBanner` wordt relatief geïmporteerd i.p.v. via `@/`-alias — `CloudCleanerMission.tsx:7`.
  - **Wat:** `import { MissionGoalBanner } from '../templates/shared/MissionGoalBanner';` i.p.v. `@/features/missions/templates/shared/MissionGoalBanner`.
  - **Risico:** laag — geen functioneel risico, wel inconsistent met projectconventie. Zelfde patroon komt ook voor in `PitchPoliceMission.tsx:6` (dus geen missie-specifieke fout, wel een repo-brede kleine drift).
  - **Voorstel:** zie Voorstellen-sectie.
- **A2 (Error-/dubbelklik-state rond completion)**: `onComplete` wordt zonder `try/catch` en zonder dubbelklik-guard aangeroepen — `CloudCleanerMission.tsx:864-875`.
  - **Wat:** de `Voltooien`-knop roept `await onComplete(true)` aan zonder `try/catch/finally` en zonder een `isCompleting`-lock; de knop blijft klikbaar tijdens de async-call.
  - **Risico:** bij een snelle dubbelklik kan `onComplete` twee keer worden aangeroepen (potentieel dubbele XP-toekenning of dubbele completion-call); als `onComplete` een fout gooit, ontstaat een onafgevangen promise-rejection zonder gebruikersfeedback. De zustermissie `PitchPoliceMission.tsx:325-331` lost dit al op met een `completionLockRef` + `try/finally`.
  - **Voorstel:** zie Voorstellen-sectie.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — "Dynamic verificatie: dev-server/Chrome-plugin niet gestart in deze review-pass." Alle claims over runtime-gedrag (drag/drop, touch-drag, animaties) zijn afgeleid uit statische code-analyse, niet uit browserobservatie.

### Score
Static: 5/7 (2 warn, geen fail) · Dynamic: n.v.t. · Aanbeveling: **ship** (de twee aandachtspunten zijn kleine, niet-blokkerende fixes)

---

## Voorstellen

### 1. Icoon-only terug-knop: `title` → ook `aria-label`

```tsx
// ❌ Huidig — CloudCleanerMission.tsx:401
<button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white" title="Terug naar opdrachten">
    <ArrowLeft size={20} />
</button>

// ✅ Voorgesteld
<button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white" title="Terug naar opdrachten" aria-label="Terug naar opdrachten">
    <ArrowLeft size={20} />
</button>
```

### 2. Relatieve import → `@/`-alias

```tsx
// ❌ Huidig — CloudCleanerMission.tsx:7
import { MissionGoalBanner } from '../templates/shared/MissionGoalBanner';

// ✅ Voorgesteld
import { MissionGoalBanner } from '@/features/missions/templates/shared/MissionGoalBanner';
```

### 3. Dubbelklik-guard + try/finally rond `onComplete`

```tsx
// ❌ Huidig — CloudCleanerMission.tsx:864-875
<button
    onClick={async () => {
        const completed = await onComplete(true);
        if (completed !== false) {
            clearSave();
        }
    }}
    disabled={correctReflections === 0}
    className="w-full py-4 bg-duck-acid hover:bg-duck-acid text-duck-ink rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-duck-acid/30 focus-visible:ring-2 focus-visible:ring-duck-acid disabled:cursor-not-allowed disabled:opacity-50"
>
    {correctReflections === 0 ? 'Beantwoord eerst de reflectie' : 'Voltooien'}
</button>

// ✅ Voorgesteld
<button
    onClick={async () => {
        if (isCompleting) return;
        setIsCompleting(true);
        try {
            const completed = await onComplete(true);
            if (completed !== false) {
                clearSave();
            }
        } finally {
            setIsCompleting(false);
        }
    }}
    disabled={correctReflections === 0 || isCompleting}
    className="w-full py-4 bg-duck-acid hover:bg-duck-acid text-duck-ink rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-duck-acid/30 focus-visible:ring-2 focus-visible:ring-duck-acid disabled:cursor-not-allowed disabled:opacity-50"
>
    {correctReflections === 0 ? 'Beantwoord eerst de reflectie' : 'Voltooien'}
</button>
```

*(Vereist een extra `const [isCompleting, setIsCompleting] = useState(false);` bij de overige `useState`-declaraties, regel 146.)*

---

## Samenvatting & verdict

`cloud-cleaner` is een compacte, goed afgebakende leerjaar 1-missie die 21A (bestandsbeheer) stevig raakt en 23A (veiligheid) oppervlakkig maar passend voor het niveau. Design en didactiek zijn solide: consistente `duck-*`-tokens, functionele animaties, leeftijds-passende copy, en een expliciete "waarom"-reflectie die XP-farming voorkomt (Voltooien-knop blijft disabled tot een juist antwoord). Technisch is de basis gezond (getypeerd, restart-safe via `useMissionAutoSave`, geen security-risico omdat er geen vrije tekstinvoer of AI-call is), met twee kleine, niet-blokkerende gaten: een ontbrekende dubbelklik-guard rond de completion-call en een relatieve import waar de projectconventie een `@/`-alias vraagt.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

**Eindverdict: ship** — geen blocking issues; de drie voorstellen hierboven zijn mechanische, lage-impact opschoningen die los van deze review kunnen worden doorgevoerd.
