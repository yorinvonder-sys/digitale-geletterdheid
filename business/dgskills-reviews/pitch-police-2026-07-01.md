# Missie-review: pitch-police (Pitch Politie)

**Datum:** 2026-07-01
**Wave:** 9 (verse review)
**Type:** `dedicated` component — `src/features/missions/review/PitchPoliceMission.tsx`
**Curriculum:** leerjaar 1, periode 2, week 2 (review-missie)

## Scores

| Rubric | Score (0-10, 10=uitstekend) |
|---|---|
| Design | 3 |
| Didactiek | 4 |
| Tech | 2 |

**triageScore** = (10-3)×0.3 + (10-4)×0.4 + (10-2)×0.3 = 2.1 + 2.4 + 2.4 = **6.9**

## Samenvatting

`pitch-police` is een sterk opgezette, zelfstandige "spot the design flaw"-missie (8 slides met bewust ingebouwde presentatiefouten: tekst-overload, contrast, chaos, afleiding, te-kleine tekst, uitgerekte afbeelding, spelfouten, onduidelijke grafiek). Component is technisch schoon (geen `any`, geen `dangerouslySetInnerHTML`, correcte `useMissionAutoSave`-integratie, focus-rings op alle interactieve elementen). Twee concrete bevindingen vereisen actie: een SLO-mismatch tussen de autoritaire mapping en het leerling-dashboard (rapportage-risico), en een reeds via de platformbrede UI/UX-audit bekend gemaakte CTA-kleurfout.

## ✅ Geslaagd

- **Visual Precision Gate:** geen screenshots-map beschikbaar (`.ui-review/` bevat geen pitch-police-artefacten) → **unverified**, dynamische claims niet bevestigd.
- **Criterium 1 (Tailwind tokens):** 100% `duck-*`-tokens, geen hex-literals, geen `lab-*`-vermenging. Consistent binnen het component.
- **Criterium 2 (Layout):** N.v.t. — dedicated component, geen template-baseline.
- **A1 (Knop-handlers):** alle knoppen (start, back, prev/next, opties, mobile-inspector-toggle) hebben functionele `onClick`.
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`, props/state volledig getypeerd via interfaces.
- **A4 (Imports):** primair via `@/*`-alias; één relatieve import (zie ⚠️ hieronder).
- **A6 (Restart-safe state):** `useMissionAutoSave('pitch-police', {...})` correct toegepast; transient UI-state (`showFeedback`, `showMobileInspector`, `visibleIntroSteps`) terecht buiten persistence gehouden.
- **A7 (Security):** geen AI/chat-integratie in deze missie (`StudentAIChat`/roleId niet van toepassing — puur interactieve UI-missie), dus geen prompt-injection-oppervlak.
- **Didactiek criterium 3 (leerdoelen):** impliciete leerdoelen duidelijk uit `feedback`-strings per slide (bijv. "Veel te veel tekst! Mensen gaan dit lezen in plaats van naar jou luisteren") — concreet en herkenbaar per foutcategorie.
- **Didactiek criterium 4 (beknoptheid):** intro-copy 11 woorden, ruim binnen leerjaar 1-2-grens (<80 woorden); ronde-content per slide kort en to-the-point.
- **Didactiek criterium 5 (leeftijd):** herkenbare, alledaagse voorbeelden voor leerjaar 1 (gamen, vakantie, kermis, droomauto) — geen jargon, motiverende toon ("Wow, rustig aan!").
- **Didactiek criterium 6 (curriculum-plek):** past logisch als review-missie na `cloud-cleaner` en `layout-doctor` in periode 2 (`src/config/curriculum.ts:94-99`).

## ⚠️ Aandachtspunten

- **Externe afbeeldingsafhankelijkheid (tech, A2-aanpalend):** slides 4 en 6 laden hardcoded `giphy.com`/`images.unsplash.com`-URL's zonder `onError`-fallback (regels 131-133, 141, 190). Geen crash-risico (React toont gewoon een gebroken img), maar bij CDN-uitval/blocking op schoolnetwerken ontbreekt de kern van de leerervaring (afleidende GIFs vergelijken met relevante foto) zonder enige terugvalweergave.
- **Relatieve import:** `../templates/shared/MissionGoalBanner` (regel 6) wijkt af van het `@/*`-aliaspatroon dat elders in het bestand wordt gebruikt (A4-criterium verwacht consequent aliasgebruik).
- **Visual Precision Gate onverifieerd:** geen Chrome-plugin-bewijs beschikbaar deze wave; dynamische claims (overlap, text-fit, spacing) niet bevestigd noch weerlegd.
- **`briefingImage`-asset ontbreekt** (`/assets/agents/pitch-police.webp`, `src/config/agents/year1.tsx:51`) — **niet missie-specifiek**: `cloud-cleaner.webp`, `layout-doctor.webp` en `prompt-master.webp` ontbreken evenzeer. Platformbreed patroon, buiten scope van deze single-missie-fix.

## ❌ Blocking issues

### Voorstel 1 — SLO-mismatch tussen autoritaire mapping en leerling-dashboard

**Probleem:** `src/config/slo-kerndoelen-mapping.ts` (autoritatieve bron) claimt `sloKerndoelen: ['21A', '22A']` voor `pitch-police`. `src/features/student/ProjectZeroDashboard.tsx` toont in de leerling-UI `sloKerndoelen: ['21A', '22B']` — een ander tweede kerndoel (22B "Programmeren" i.p.v. 22A "Digitale producten"). Deze missie bevat geen programmeer-activiteit; het dashboard-label is feitelijk onjuist en zou docentrapportage over behaalde kerndoelen verkeerd informeren.

**Before** (`src/features/student/ProjectZeroDashboard.tsx:136`):
```tsx
{ id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover zodat het publiek niet in slaap valt.', icon: <Monitor size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('pitch-police'), isReview: true, sloKerndoelen: ['21A', '22B'] },
```

**After:**
```tsx
{ id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover zodat het publiek niet in slaap valt.', icon: <Monitor size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('pitch-police'), isReview: true, sloKerndoelen: ['21A', '22A'] },
```

**autoFixable:** ja — mechanisch, één-regel-wijziging, missie-specifiek, exact before/after.

### Voorstel 2 — Intro-CTA "Lees eerst de stappen" oogt disabled/off-brand (platformbreed bekend, hier lokaal toepasbaar)

**Probleem:** Reeds gedocumenteerd in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (§C, regel 71): tijdens de intro-timer toont de primaire CTA `bg-duck-gray text-duck-ink/60` — dit is functioneel correct (echt disabled tot `introReady`), maar visueel niet te onderscheiden van een kapotte/uitgeschakelde knop, wat leerlingen kan doen twijfelen of de missie werkt. De audit beveelt aan dit naar de acid-huisstijl te bewegen zodra het geactiveerd wordt (dat gebeurt al correct — zie regel 411 `bg-duck-acid text-duck-ink` in de `introReady`-tak); het aandachtspunt betreft alleen de tussentijdse grijze staat.

**Locatie:** `src/features/missions/review/PitchPoliceMission.tsx:404-418`

**Beoordeling:** dit is een gedeeld/systemisch intro-timer-patroon (vergelijkbaar met andere missies die eenzelfde "wacht tot je de stappen hebt gelezen"-gate gebruiken) en geen missie-specifieke fout — reeds op de platformbrede quick-wins-lijst (prioriteit #2) gezet. **Niet autoFixable binnen deze single-missie-review**: een lokale fix hier zou de intro-shell-inconsistentie met andere missies vergroten in plaats van verkleinen. Aanbevolen: oppakken via de gedeelde shell-fix, niet per-missie.

## Referentie UIUX-audit (2026-06-30)

Bevestigd overlappend punt: `pitch-police` (alle viewports) — primaire knop "Lees eerst de stappen" is grijs en lijkt uitgeschakeld. Fix voorgesteld: `bg-duck-acid` + `text-duck-ink`, maar zoals hierboven toegelicht is dit een bewuste disabled-state tijdens de intro-timer, niet een simpele kleurfout — een directe kleurwissel zou de disabled-semantiek verbergen. Aanbevolen als onderdeel van quick-win #3 (CTA-standaardisatie) op shell-niveau, niet als geïsoleerde missie-fix.
