# Missiereview — cloud-cleaner (Cloud Schoonmaker)

**Datum:** 2026-07-02
**Type:** dedicated component (`src/features/missions/review/CloudCleanerMission.tsx`)
**Agent-rol:** `src/config/agents/year1.tsx` (regel 8, jaar 1, week 2)
**Reviewer:** M4 batch-review wave 12

---

## 1. Samenvatting

Cloud-cleaner is een OneDrive-simulatie waarin leerlingen bestanden via drag-and-drop (of tik-tik op mobiel) naar de juiste map slepen. Sterk punt: een unieke "waarom"-reflectievraag na elke correcte plaatsing, die redenering beloont in plaats van gokken. Zwak punt: het component heeft **geen enkel toegankelijkheidsattribuut** (geen `aria-label`, geen keyboard-alternatief voor drag-and-drop) en draagt een **bekende KRITIEKE mobiele bug** (FAB overlapt laatste bestandskaart) die al in de platform-brede UI/UX-review van 30 juni is gedocumenteerd maar nog niet gefixt is. Daarnaast is er een SLO-mismatch tussen de autoritaire mapping en de dashboard-weergave.

**Verdict: fix-eerst.**

---

## 2. Stap A — Structuur & identiteit

| Bron | Waarde |
|---|---|
| `slo-kerndoelen-mapping.ts:36` (AUTORITAIR) | `sloKerndoelen: ['21A', '23A']`, `sloVsoKerndoelen: ['18A', '20A']` |
| `curriculum.ts:95` | opgenomen in jaar 1 |
| `missionGoals.ts:49` | `primaryGoal` + `criteria` + `evidence` aanwezig, coherent met de opdracht |
| `ProjectZeroDashboard.tsx:134` | `sloKerndoelen: ['21A']` — **mist `23A`** |
| `agentRoleIds.ts:2` | `'cloud-cleaner'` geregistreerd |
| `briefingImage` (year1.tsx:17) | `/assets/agents/cloud-cleaner.webp` — **bestaat niet op disk** (platform-breed bekend, ~55/94 missies, niet apart escaleren) |

### Voorstel — SLO-mismatch (autoFixable)

De dashboard-kaart toont alleen `21A` (Digitale systemen) terwijl de autoritaire mapping ook `23A` (Veiligheid & privacy) toekent. Een leerling die dit reviewblok als privacy-oefening zou herkennen (bestanden scheiden in schoolmappen vs. Privé) mist die SLO-koppeling op het dashboard.

**Bestand:** `src/features/student/ProjectZeroDashboard.tsx:134`

Before:
```tsx
{ id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep de rondslingerende bestanden naar de juiste mappen.', icon: <Cloud size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('cloud-cleaner'), isReview: true, sloKerndoelen: ['21A'] },
```

After:
```tsx
{ id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep de rondslingerende bestanden naar de juiste mappen.', icon: <Cloud size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('cloud-cleaner'), isReview: true, sloKerndoelen: ['21A', '23A'] },
```

---

## 3. Stap B — Eerdere bevindingen (screenshot-review 30 juni)

Geen losse screenshots-map voor deze missie in deze review-run; onderstaande komt uit `docs/audits/student-missions-ui-ux-review-2026-06-30.md`:

- **KRITIEK (mobiel):** de map-FAB overlapt de laatste bestandskaart, die daardoor amper aantikbaar is. Fix: `padding-bottom: 80px` onder het grid; verplaats de FAB naar rechtsonder. — **nog aanwezig** (zie component regel 411-416, FAB is `fixed bottom-4 left-4`, grid heeft geen extra bottom-padding).
- **HOOG:** drag-and-drop-instructie staat klein en grijs rechtsboven (nu: alleen zichtbaar ín de sidebar tijdens actief slepen, regel 434-448) — leerling die nog niet sleept ziet geen prominente hint.
- **LAAG:** lange bestandsnamen wrappen lelijk (bv. `Huiswerk_Wiskunde.pd / f` in landscape) — component gebruikt `break-all line-clamp-2` (regel 661-663), geen `truncate`/ellipsis.
- Genoemd als één van de twee "bespoke OS-simulatie"-missies die eigen mobiele patronen nodig hebben (drawer/tab/FAB-conventies).

Geen van deze is sindsdien gefixt in dit bestand (geverifieerd via directe code-inspectie).

---

## 4. Stap C — Rubrics

### 4.1 Design — score 6.5/10

**Sterk:**
- Consistente duck-tokens (`bg`, `bgLight`, `ink`, `acid`, `gray`, `error`), geen off-brand kleuren.
- Prettige micro-interacties (shake bij fout, success-toast, folder-highlight bij drop).
- OneDrive-metafoor is herkenbaar en visueel logisch (header, sidebar, grid).

**Issues:**
1. **KRITIEK (bevestigd, niet gefixt):** mobiele FAB (`fixed bottom-4 left-4`, regel 411-416) overlapt de laatste bestandskaarten in het grid — geen `padding-bottom` compensatie op de `<main>`-scrollcontainer (regel 579-583).
2. **HOOG:** drag-instructie ("Sleep naar de juiste map!") verschijnt alleen tijdens actief slepen in de sidebar (regel 434-448) — een leerling die nog nooit gesleept heeft, krijgt geen voorafgaande hint dat drag-and-drop (of tik-tik) de bedoeling is, behalve de kleine grijze tekst rechtsboven in main (regel 596-600, verborgen op mobiel via `hidden sm:block`).
3. **LAAG:** bestandsnamen gebruiken `break-all` (regel 662) i.p.v. `truncate` — leidt tot lelijke midden-woord-afbrekingen bij lange namen zoals `Huiswerk_Wiskunde.pdf`.

### 4.2 Didactiek — score 7.5/10

**Sterk:**
- **"Waarom"-reflectievraag** (`WHY_QUESTIONS`, regel 16-65) na elke correcte plaatsing dwingt leerlingen hun keuze te beargumenteren i.p.v. blind te slepen — dit is een sterker didactisch patroon dan de meeste andere review-missies in jaar 1.
- Directe, specifieke foutfeedback die onderscheid maakt tussen drie scenario's (regel 217-223): belangrijk bestand naar prullenbak, junk-bestand naar verkeerde map, of gewoon verkeerde map — leert transfer i.p.v. trial-and-error.
- `MissionGoalBanner` toont het primaire doel bovenaan (regel 404), consistent met `missionGoals.ts`.
- State is herstelbaar via `useMissionAutoSave` (regel 110-117) — leerling kan tussentijds stoppen zonder voortgang te verliezen.
- Geen XP-farming mogelijk: score is aan specifieke, niet-herhaalbare bestand-ID's gekoppeld (`remainingFileIds` filtert bestanden na correcte plaatsing).

**Issues:**
1. **MIDDEL:** de "waarom"-vraag heeft een "Overslaan"-knop (regel 738-743) zonder enige consequentie — een leerling kan het reflectiemoment altijd negeren, wat het didactische doel van de vraag ondermijnt voor gehaaste leerlingen. Geen scope-aanbeveling hier (buiten opdracht om te wijzigen), maar wel het signaleren waard.
2. **LAAG:** de foutmeldingen bij drie junk-bestanden (`.exe`, `.html`, `.installer` als "virus") zijn correct maar leggen niet uit wélk kenmerk (bestandsextensie, herkomst) het verdacht maakt — een gemiste kans om digitale geletterdheid over malware-herkenning te versterken, past wel bij `23A` (Veiligheid & privacy).

### 4.3 Tech — score 5.5/10

**Sterk:**
- Correct gebruik van `useMissionAutoSave` patroon, state-shape is minimaal en restart-safe.
- Zowel muis-drag als touch-drag (regel 286-323) als klik-klik-fallback (regel 259-283) — drie input-modaliteiten voor pointer-gebruikers.
- Geen dynamische/user-generated content, dus geen XSS-oppervlak.
- Geen AI-chat in dit component (puur interactief), dus geen prompt-injection-oppervlak.

**Issues:**
1. **KRITIEK — geen toegankelijkheid voor toetsenbord/screenreader-gebruikers:** het hele component bevat **nul** `aria-label`, `aria-*`, `role=`, of `tabIndex`-attributen (grep-bevestigd). De drag-and-drop-interactie (mappen en bestanden zijn `<motion.div>` met `onClick`, geen `<button>`) is volledig onbereikbaar met een toetsenbord — een leerling die niet met een muis/touch kan werken, kan deze missie niet voltooien. Icon-only knoppen (terug-knop regel 383, mobiele sidebar-toggle regel 411) hebben wel `title=` maar geen `aria-label`, dus screenreaders lezen ze niet voor als betekenisvolle actie.
2. **HOOG (autoFixable, zie Stap A):** SLO-mismatch tussen `slo-kerndoelen-mapping.ts` (autoritair, `21A`+`23A`) en `ProjectZeroDashboard.tsx` (alleen `21A`).
3. **MIDDEL:** `briefingImage: '/assets/agents/cloud-cleaner.webp'` in `year1.tsx:17` verwijst naar een niet-bestaand asset — platform-breed bekend gat (~55/94 missies), niet apart escaleren, maar wel meegenomen in autoFixable-telling zou hier verkeerd zijn omdat er geen bronbestand is om naar te verwijzen (geen "before/after" mogelijk zonder een asset te genereren, wat buiten scope van deze review valt).

---

## 5. Berekening triageScore

```
triageScore = (10 - design) * 0.3 + (10 - didactiek) * 0.4 + (10 - tech) * 0.3
            = (10 - 6.5) * 0.3 + (10 - 7.5) * 0.4 + (10 - 5.5) * 0.3
            = 3.5 * 0.3 + 2.5 * 0.4 + 4.5 * 0.3
            = 1.05 + 1.00 + 1.35
            = 3.40
```

---

## 6. Escalaties

- **Toegankelijkheid (geen aria/keyboard-support) is systeembreed vermoed** (de platform-review noemde al een "~3.0-plafond" op toegankelijkheid over alle 109 missies), maar dit specifieke component heeft een concreet extra risico: drag-and-drop zonder klik-klik-toetsenbordpad zou een leerling die met een schakelaar/toetsenbord werkt volledig blokkeren. De bestaande klik-klik-fallback (select bestand → klik map) werkt wél met een muis/touch, maar is niet met Tab/Enter bereikbaar omdat de elementen geen `<button>` of `tabIndex="0"` + `onKeyDown` hebben. Aanbevolen voor een aparte toegankelijkheids-sweep-taak (buiten scope van deze review om zelf te fixen).
- De mobiele FAB-overlap (KRITIEK, al gedocumenteerd op 30 juni, nog steeds aanwezig) hoort bij Prioriteit 4 uit die review ("layout-doctor + cloud-cleaner mobiele layout") — nog open, geen actie ondernomen sindsdien.

---

## 7. Voorstel-blokken (samenvatting autoFixable)

| # | As | Bestand | Wijziging |
|---|---|---|---|
| 1 | tech | `src/features/student/ProjectZeroDashboard.tsx:134` | `sloKerndoelen: ['21A']` → `sloKerndoelen: ['21A', '23A']` |

---

**Verdict: fix-eerst** — de SLO-mismatch is triviaal te fixen; de mobiele FAB-bug en toegankelijkheidsgat zijn groter dan één-regel-fixes en horen bij een gerichte vervolgtaak (mobiele-layout-sweep resp. toegankelijkheids-sweep), niet bij herontwerp van de hele missie. De kernmechaniek (drag-and-drop + waarom-reflectie) is didactisch sterk en hoeft niet opnieuw ontworpen te worden.
