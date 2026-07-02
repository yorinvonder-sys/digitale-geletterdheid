# Missie-review: filter-bubble-breaker (wave 19)

**Datum:** 2026-07-02
**Type:** Verse review (M2-pipeline)
**Levering:** Dedicated component
**Component:** `src/features/missions/FilterBubbleBreakerMission.tsx`
**Agent-rol:** `src/config/agents/year1.tsx` (regel 2713-2790, `enableChat` niet gezet → chat is dormant)

## Stap A — Registratie & inhoud

| Bron | Status |
|---|---|
| `src/config/curriculum.ts` (J1P3, week 3) | ✅ |
| `src/config/slo-kerndoelen-mapping.ts` (`21B`, `23C` / VSO `20A`, `20B`) | ✅ autoritair, correct |
| `src/config/missionGoals.ts` | ✅ heldere primaryGoal + evidence |
| `src/config/basisvaardigheden-mapping.ts` (MEDIAWIJSHEID, BEGRIJPEND_LEZEN) | ✅ |
| `src/config/agentRoleIds.ts` + `src/types.ts` (RoleId-union) | ✅ beide bronnen aanwezig |
| `src/config/missionThumbnails.ts` + asset op disk | ✅ bestand bestaat (438KB webp) |
| `src/features/student/ProjectZeroDashboard.tsx` | ✅ zichtbaar, nummer 08, sloKerndoelen matcht (met extra `23B`) |
| `src/utils/missionBuilder.tsx` (tooltip + naam + prompts) | ✅ |

Interne voortgang/scoring nagerekend: 5 vragen × 20 pt = 100 max; badge-thresholds (≥80 Bubble Breaker, ≥60 Bewuste Scroller, anders Bubbel Ontdekker) kloppen met de score-opbouw. Voltooiing vereist reflectie ≥10 tekens — correct gated.

**Inhoudelijke feitencheck (filterbubbels/algoritmes):** Klopt en is genuanceerd. Challenge 5 expliciet: "Is een filterbubbel ALTIJD slecht?" → nee, alleen een probleem als je niet wéét dat je erin zit. Geen doembeelden, geen overclaims over hoe algoritmes werken (geformuleerd als "analyseren leeftijd, locatie, klikgedrag en interesses" — accuraat op hoog niveau).

## Platform-inzicht — server vs. client drift

Server-side (`supabase/functions/_shared/systemInstructions.ts`) en client-side (`year1.tsx`) systemInstruction zijn **identiek** (geen server/client-drift binnen de agent-rol zelf). Wél bestaat er content-drift tussen **agent-rol** (chat-personages: Sam & Lina, TikTok-context) en het **dedicated component** (personages: Daan & Priya, generieke app-context, leeftijd/land als variabele i.p.v. alleen interesses). Omdat de chat dormant is (geen `enableChat` in de missie-config), ziet de leerling deze chat-tekst nooit — dit is een onderhoudsrisico, geen student-facing inconsistentie. Niet autoFixable (redactionele keuze welk personage leidend wordt).

## Stap B — UI/UX-audit dekking

- Geen `.ui-review/`-screenshotmap voor deze missie aangetroffen.
- `docs/audits/student-missions-ui-ux-review-2026-06-30.md`: geen treffer voor `filter-bubble-breaker` — niet in de live UI/UX-sweep van 30 juni meegenomen.

## Stap C — Rubrics

### Design (duck-tokens, layout, tone) — score 8.5/10
- Correct en consequent duck-tokens (`bg-duck-bg`, `text-duck-ink`, `bg-duck-acid`, `bg-duck-gray`, `bg-duck-error`) — geen legacy lab-tokens in het component zelf.
- 4 heldere fases (intro → compare → analyze → challenge → results) met voortgangsindicator en focus-visible rings.
- Minor: `renderFeedCard`'s `isB`-ternary geeft in beide takken exact dezelfde class (`bg-duck-ink/5 border-duck-ink/20`) — dode conditie, geen visueel effect maar wel verwarrende code.
- Agent-rol `visualPreview` (year1.tsx) gebruikt `bg-lab-coral`/`bg-lab-teal` — bekende platform-brede briefing-asset drift, niet meegewogen in missie-score.

### Didactiek — score 9/10
- Vergelijkend leren (twee feeds naast elkaar) is sterk voor het concrete maken van een abstract concept.
- Open analyse-opdracht (min. 10 tekens) vóór de MC-quiz bouwt eigen redeneren op, niet alleen herkennen.
- 5 vragen dekken kernbegrippen (oorzaak, gevaar, targeting, oplossing, nuance) met uitleg per antwoord.
- Verplichte reflectie vóór afronding sluit aan bij de 3-stappen-didactiek van het platform.
- Geen enkel punt van zorg over doembeelden of eenzijdigheid.

### Techniek — score 9/10
- `useMissionAutoSave` correct toegepast met stabiele missionId-key.
- State-updates consequent via functional `setState`-pattern, geen stale-closure risico's.
- `getMissionGoal('filter-bubble-breaker')!` — non-null assertion is veilig, entry bestaat aantoonbaar in missionGoals.ts.
- Disabled-states correct gated op input-lengte (analyse ≥10, reflectie ≥10).
- Klein punt: textareas hebben geen `<label htmlFor>`-koppeling (wel visuele `<label>`/`<p>` ernaast) — a11y-omissie, platform-breed patroon (a11y-plafond ~3.0 conform eerdere UI/UX-sweep), niet uniek aan deze missie.

**triageScore = (10-8.5)*0.3 + (10-9)*0.4 + (10-9)*0.3 = 0.45 + 0.4 + 0.3 = 1.15**

## Conclusie

**ALLOW.** Geen blokkerende issues. Twee kleine, niet-autoFixable bevindingen gedocumenteerd (dode ternary-conditie in `renderFeedCard`; chat-personage drift Sam/Lina vs Daan/Priya — beide laag risico, chat is dormant). Missie is didactisch sterk, technisch solide, en registratie is volledig coherent over alle 8 gecheckte bronnen.
