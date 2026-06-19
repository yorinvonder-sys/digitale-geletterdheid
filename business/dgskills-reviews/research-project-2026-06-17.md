# Missie Review: research-project
**Datum:** 2026-06-17
**Template:** data-viewer
**Verdict:** Pedagogisch sterke missie met uitstekend datamateriaal — twee autofix-issues (hardcoded hex, ontbrekende missionGoal) en één kleine UX-bug; geen blokkers.

---

## 🎨 Design review

### ✅ Goed
- `duck-*` tokens worden consistent gebruikt in `DataViewer.tsx`: `duck-gray`, `duck-ink`, `duck-acid`, `duck-bg`.
- Knoppen hebben hover-states (`hover:brightness-95`, `hover:border-duck-acid/40`) en disabled-state met `opacity-40 cursor-not-allowed`.
- AI-chat FAB heeft `aria-label="Open AI-assistent"` (regel 708).
- Focus-ring op FAB via `focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2`.
- Responsive layout: `max-w-lg mx-auto px-4`, geen vaste px-breedte op secties.
- Geen Framer Motion — geen onnodige animaties in deze template.
- Visueel verificatie: geen screenshots aanwezig → **niet geverifieerd (geen screenshot)**.

### ⚠️ Aandachtspunten

**1. Hardcoded hex `accent-[#D97848]` op radio-inputs**
`DataViewer.tsx:192` — radio-accent gebruikt een hardcoded hex in plaats van een design-token.

```
// VOOR (DataViewer.tsx:192)
className="accent-[#D97848]"

// NA
className="accent-duck-accent"
// of als er geen accent-token bestaat: accent-duck-acid
```

**2. Hardcoded `color: '#202023'` en `color: '#e1ff01'` in config**
`research-project.ts:86-91` en `research-project.ts:198-216` — de `chartData[].color`-velden en `badges[].color`-velden zijn hardcoded hex. `SimpleChart.tsx` gebruikt ze direct via `style={{ backgroundColor: color }}`, wat buiten het token-systeem valt.

Beter: gebruik `duck-ink`-equivalent waarde of definieer constanten in de config.

```
// VOOR (research-project.ts:86-91, chartData)
{ label: 'Expertmening', value: 15, color: '#202023' },
{ label: 'Casestudy (1 persoon)', value: 25, color: '#e1ff01' },
...

// NA — gebruik CSS-variabelen of platform-kleurconstanten
// Als SimpleChart inline-styles vereist, definieer in een tokens-const:
// import { DUCK_INK, DUCK_ACID } from '@/design/tokens'
{ label: 'Expertmening', value: 15, color: DUCK_INK },
{ label: 'Casestudy (1 persoon)', value: 25, color: DUCK_ACID },
```

**3. Legacy `lab-teal` in `visualPreview` (year3.tsx:1846-1847)**
Het `visualPreview`-component in de agent-config gebruikt `bg-gradient-to-br from-lab-teal to-lab-teal` en `bg-lab-teal/20`. Dit is een legacy-token.

```
// VOOR (src/config/agents/year3.tsx:1846-1847)
className="w-full h-full bg-gradient-to-br from-lab-teal to-lab-teal ..."
className="absolute bottom-4 left-4 w-24 h-24 bg-lab-teal/20 rounded-full blur-xl"

// NA
className="w-full h-full bg-gradient-to-br from-duck-ink to-duck-ink ..."
className="absolute bottom-4 left-4 w-24 h-24 bg-duck-ink/20 rounded-full blur-xl"
```

**4. "Bevestigen"-knop heeft geen `aria-label` bij icon-only-context**
De knop (regel 234-242) heeft tekst ("Bevestigen"), dus geen blokker — maar de "Vorige dataset"-back-knop (regel 673-680) heeft geen `aria-label`; de tekst is er wel, maar de `ChevronLeft`-icon heeft geen `aria-hidden`.

```
// VOOR (DataViewer.tsx:674)
<ChevronLeft size={14} />

// NA
<ChevronLeft size={14} aria-hidden="true" />
```

### ❌ Blokkers
Geen.

---

## 📚 Didactiek review

### ✅ Goed
- **Doel aanwezig en concreet:** `missionObjective` in `year3.tsx:1841`: "Formuleer een onderzoeksvraag over een digitaal thema, verzamel data via betrouwbare bronnen en trek een onderbouwde conclusie." Sterk geformuleerd.
- **SLO-fit genuine:** 21B (informatievaardigheid), 21C (kritisch denken), 23C (maatschappelijke verantwoordelijkheid) passen alle drie inhoudelijk. De missie behandelt expliciet correlatie vs. causaliteit, betrouwbaarheid van bronnen, en de maatschappelijke relevantie van desinformatie.
- **Bloom-balans in orde:** dataset 1 = analyseren/toepassen (patroon herkennen, rekenen), dataset 2 = evalueren (methodes vergelijken, eigen keuze onderbouwen), dataset 3 = synthese (onderzoeksvraag beoordelen, eigen beperking benoemen). Goede opbouw van recall → evaluatie.
- **Leeftijdsgebonden vocabulaire:** termen als "correlatie", "causaliteit", "meta-analyse", "peer-reviewed" worden geïntroduceerd met uitleg in de feedback-teksten. Geschikt voor havo/vwo jaar 3 (15-16 jaar).
- **AI-as-copilot in agent:** het 3-staps agent-systeem (vraag formuleren → bronnen verzamelen → conclusie trekken) vergt actieve leerlingbijdrage voor elke stap; `---STEP_COMPLETE:X---`-markering pas na verificeerbaar bewijs.
- **Wellbeing:** `useWellbeingMonitor` + `WellbeingAlert` actief; tekst-observaties worden gescand voor welzijnsignalen.
- **Vragen zijn divers en doorlopend:** multiple-choice, getal-invoer, open reflectie — voorkomt XP-farming.
- **Takeaways scherp en kort** (5 punten, max 1 zin elk).

### ⚠️ Aandachtspunten

**5. `missionGoal` ontbreekt in config — valt terug op `getMissionGoal('research-project')`**
In `missionGoals.ts` staat geen entry voor `research-project` (grep levert geen resultaat). Het `IntroScreen` haalt doel op via `config.missionGoal ?? getMissionGoal(config.missionId)`. Als `getMissionGoal` ook niets retourneert, wordt het doel leeg getoond.

```
// VOOR (research-project.ts) — geen missionGoal veld aanwezig

// NA — voeg toe aan researchProjectConfig:
missionGoal: {
    primaryGoal: 'Ik formuleer een onderzoeksvraag, analyseer data uit betrouwbare bronnen en trek een onderbouwde conclusie.',
},
```

**6. Doelomschrijving in `introTitle` is te vaag voor de leerling**
`introTitle: 'Voer een onderzoek uit'` — dit is een instructie, geen doel-statement vanuit leerlingperspectief. Vergelijk met andere missies die `primaryGoal` in eerste-persoon formuleren ("Ik…").

```
// VOOR (research-project.ts:7)
introTitle: 'Voer een onderzoek uit',

// NA
introTitle: 'Jij bent de onderzoeker',
```

**7. q8 heeft 0 punten — didactisch merkwaardig**
Vraag `q8-eigen-beperking` (`research-project.ts:180`) is een open reflectievraag van het type `text-observation` maar heeft `points: 0`. Alle andere `text-observation`-vragen krijgen participatiepunten (10pt). Dit is de moeilijkste en didactisch meest waardevolle vraag (beperking benoemen + verbetering voorstellen) — het is inconsistent en demotiverend om dit als 0pt te behandelen.

```
// VOOR (research-project.ts:185)
points: 0,

// NA
points: 10,
// Pas ook maxScore aan: 100 → 110, of herverdeelt punten
```

**8. Geen koppelingen naar eigen bronnen/onderzoekstools**
Dataset 3 noemt Google Scholar, CBS en RIVM als startpunten (card 2), maar de missie bevat geen AI-chat (`enableChat` niet ingesteld). Hierdoor heeft de leerling geen geschikte copiloot beschikbaar als ze vastlopen op de "document-cards"-dataset. De agent-chat is beschikbaar voor de chattende missie, maar de data-viewer heeft `enableChat` uitgeschakeld.

ESCALATIE (niet auto-fixbaar): Overweeg `enableChat: true` met `chatRoleId: 'research-project'` om de Onderzoekscoach ook binnen het data-viewer-gedeelte bereikbaar te maken.

### ❌ Blokkers
Geen. Het doel is bereikbaar via de datasets: leerlingen analyseren een dataset, evalueren methoden en beoordelen onderzoeksvragen — dit dekt "formuleer, analyseer, concludeer" duidelijk.

---

## 🔧 Tech review

### ✅ Goed
- `useMissionAutoSave` wordt correct gebruikt (`research-project.ts` via `missionId`-prop) — restart-safe.
- `clearSave()` aangeroepen bij `handleComplete` — geen ghost-state.
- Loading/error/empty correct afgehandeld in `DataViewer` (public entry point): `LoadingScreen` bij laden, error-state bij `loadError`, fallback via `onBack`.
- Geen `dangerouslySetInnerHTML` in het component.
- `@/*`-imports voor hooks en features.
- Wellbeing-scan op `text-observation`-input voor submit (`scanWellbeingText` aangeroepen in `handleSubmitQuestion:549`).
- TS: geen `: any` of `@ts-ignore` gevonden in `DataViewer.tsx` of `SimpleChart.tsx`.
- `scoreQuestion` voor number-input gebruikt 5%-tolerantie — dit is een bewuste keuze die goed is voor afrondingsflexibiliteit.

### ⚠️ Aandachtspunten

**9. `localStorage`-access zonder `window`-guard**
`DataViewer.tsx:495-506` — de `userId`-IIFE gebruikt `localStorage` direct. Dit faalt in SSR-context (indien ooit gebruikt) en gooit in sommige browsers bij strikte cookie-instellingen.

```
// VOOR (DataViewer.tsx:495-506)
const userId = (() => {
    try {
        const key = Object.keys(localStorage).find(...)
        ...
    } catch {
        return null;
    }
})();

// NA — zelfde patroon, geen actie nodig: try/catch omhulst het al correct.
// Aanbeveling: verplaats naar een hook (useUserId) voor hergebruik + testbaarheid.
```

Dit is een mineure code-kwaliteitsnoot, geen blokker.

**10. `systemInstruction` client-side in `year3.tsx`**
`year3.tsx:1860` — `systemInstruction` staat als string in de client-bundle. Per security-rubric moet `systemInstruction` server-side via `roleId` worden doorgegeven. De agent-chat gebruikt `roleId: 'research-project'` (indirect via `chatRoleId`), maar de volledige instructietekst staat ook in de bundle.

ESCALATIE (niet auto-fixbaar): Controleer of de `systemInstruction` in `year3.tsx` daadwerkelijk naar de Edge Function wordt gestuurd of alleen als UI-referentie dient. Als het naar de AI-provider gaat via client: verplaats naar server-side roleId-lookup.

**11. Hardcoded `color`-waarden in config worden via `style={{ backgroundColor: color }}` gerendered**
`SimpleChart.tsx:57,205` — de `chartData[].color` velden uit de config (strings zoals `'#202023'`, `'#e1ff01'`) worden direct als inline-style toegepast. Geen XSS-risico (statische config, niet user-input), maar buiten het token-systeem en daarmee theme-incompatibel. Zie ook Aandachtspunt 2.

**12. Geen `aria-live` op score-updates**
De `PhaseHeader` toont de lopende score, maar updates hiervan worden niet aangekondigd voor screenreaders. Niet-blokkerend maar aandachtspunt voor WCAG-AA.

ESCALATIE (niet auto-fixbaar): voeg `aria-live="polite"` toe aan de score-container in `PhaseHeader.tsx`.

### ❌ Blokkers
Geen.

---

## Samenvatting fixes

| # | Soort | Bestand | Fix |
|---|---|---|---|
| 1 | Autofix | `DataViewer.tsx:192` | `accent-[#D97848]` → `accent-duck-acid` |
| 2 | Autofix | `research-project.ts:86-91,198-216` | Hardcoded hex in chartData/badges |
| 3 | Autofix | `year3.tsx:1846-1847` | `lab-teal` → `duck-ink` |
| 4 | Autofix | `DataViewer.tsx:674` | `aria-hidden="true"` op ChevronLeft |
| 5 | Autofix | `research-project.ts` | Voeg `missionGoal.primaryGoal` toe |
| 6 | Autofix | `research-project.ts:7` | `introTitle` leerling-perspectief |
| 7 | Autofix | `research-project.ts:185` | `points: 0` → `points: 10` (+ maxScore) |
| 8 | Escalatie | Config | `enableChat` overwegen voor data-viewer |
| 9 | Mineur | `DataViewer.tsx:495` | Verplaats naar `useUserId`-hook |
| 10 | Escalatie | `year3.tsx:1860` | `systemInstruction` client-side exposure |
| 11 | Autofix | `SimpleChart.tsx` + config | Inline color via tokens, niet hex |
| 12 | Escalatie | `PhaseHeader.tsx` | `aria-live="polite"` op score |

**Autofixable:** 7 (issues 1, 2, 3, 4, 5, 6, 7)
**Escalaties:** 3 (issues 8, 10, 12)
