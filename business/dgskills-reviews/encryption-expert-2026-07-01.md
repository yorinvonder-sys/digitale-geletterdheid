# Missie-review: encryption-expert

**Datum:** 2026-07-01 · **Wave:** 8 · **Template:** puzzle-lab
**Config:** `src/features/missions/templates/puzzle-lab/configs/encryption-expert.ts`
**Agent-rol:** `src/config/agents/year3.tsx:651-680`
**SLO:** `src/config/slo-kerndoelen-mapping.ts:166` · **Curriculum:** `src/config/curriculum.ts:271` (leerjaar 3) · **missionGoals:** `src/config/missionGoals.ts:412-420`

---

## 🎨 Design review

**Mission:** encryption-expert (puzzle-lab)
**Reviewer:** dgskills-design-reviewer (Sonnet)

Deze missie is een pure `PuzzleLabConfig`-datastructuur zonder eigen JSX/className's — alle rendering loopt via de gedeelde `PuzzleLab.tsx`-engine. Criteria 1 (Tailwind tokens), 2 (layout), 3 (knop-clarity), 5 (responsive), 6 (Framer Motion) en 7 (a11y) zijn engine-eigenschappen en worden hier NIET als missie-issue gescoord (staan vast voor alle 5 puzzle-lab-missies).

### ✅ Geslaagd
- **Criterium 4 (copy-lengte, leerjaar 3-grens: intro <120 woorden, opdracht <80 woorden)**: `introDescription` (encryption-expert.ts:8-9) = 42 woorden. Langste puzzel-`description` (public-key, regel 71) = 62 woorden. Alle 4 puzzel-omschrijvingen ruim binnen grens.
- **Badge-config**: 4 drempels (0/40/70/90) met oplopende titels en kleuren consistent met baseline (`data-handelaar.ts` gebruikt zelfde structuur).

### ⚠️ Aandachtspunten
- Geen. Config-niveau content is beknopt en consistent met de baseline (`data-handelaar.ts`).

### ❌ Blocking issues
- Geen.

**Visual Precision Gate:** unverified — geen screenshots-map aangetroffen voor deze missie, geen Chrome-plugin-bewijs beschikbaar in deze review-pass. Missie stond wél in `docs/audits/student-missions-ui-ux-review-2026-06-30.md:122` als één van de beste-scorende missies (gem. ≥4.0) uit de live UI/UX-sweep van 2026-06-30 — dat is ouder bewijs, geen vervanging voor verse dynamische verificatie.

### Score
2/2 beoordeelbare criteria geslaagd (5 N.v.t. — engine-gebonden) · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** encryption-expert (puzzle-lab)
**Curriculum-plek:** Leerjaar 3, Periode (zie curriculum.ts:271)
**SLO-claim:** `23A` (Veiligheid & privacy)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23A` is een geldig regulier VO-kerndoel (Veiligheid & privacy). 1 code geclaimd — geen te-veel/te-weinig issue.
- **Criterium 2 (SLO-fit)**: Sterk geraakt — alle 4 puzzels behandelen kernaspecten van digitale veiligheid: Caesar-cijfer (klassieke encryptie), Base64 (misvatting "codering = beveiliging" corrigeren), asymmetrische encryptie (HTTPS/Signal-principe), sterk wachtwoord (praktische toepassing). Geen oppervlakkig contact.
- **Criterium 3 (leerdoelen)**: Impliciet leerdoel in `missionGoals.ts:413` — "Ik los encryptie-puzzels op en leg uit hoe versleuteling gegevens beschermt" — is concreet en criteria-gekoppeld (`missionGoals.ts:414-419`, score-threshold 70 + expliciete evidence-omschrijving).
- **Criterium 4 (opdracht-beknoptheid)**: zie design-review — ruim binnen leerjaar-3-grenzen.
- **Criterium 5 (leeftijds-passend vocabulary)**: Taal past bij 13-14 jaar (curriculum-leerjaar 3); technische termen (asymmetrisch, publieke/privé sleutel) worden direct in de puzzel-tekst uitgelegd (encryption-expert.ts:71-75), geen onuitgelegd jargon.
- **Criterium 6 (curriculum-plek)**: Logisch — veiligheid/privacy hoort thuis in leerjaar 3 periode-plek naast `wachtwoord-warrior` en `cyber-detective` (zelfde SLO-cluster, curriculum.ts:271).
- **Criterium 7 (Bloom-balans)**: Goede mix — onthouden/toepassen (Caesar/Base64 decoderen), begrijpen (public-key MC-vraag met redenering), creëren/toepassen (zelf een wachtwoord bedenken dat aan eisen voldoet). Niet uitsluitend quiz-recall.
- **Criterium 9 (welzijn)**: Geen gevoelig onderwerp; geen VSO-mapping aanwezig maar ook niet vereist (geen `sloVsoKerndoelen`-verplichting voor elk kerndoel).

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot)** — n.v.t.: `templateRegistry.ts:24` heeft géén `enableChat: true` voor `encryption-expert`. Dit is de bekende platform-brede "dormant chat-rol"-situatie (agent-rol met volledige `systemInstruction` in `year3.tsx:673` bestaat, maar wordt door deze missie niet aangeroepen omdat puzzle-lab een pure puzzel-engine zonder chat is). Dit is een architectuurkeuze op templateType-niveau, geen missie-specifiek gebrek — kort genoemd, geen escalatie.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy)**: sterk geraakt — bewijs: alle 4 puzzels + takeaways (encryption-expert.ts:152-157) draaien direct om versleuteling/wachtwoordveiligheid, het kernonderwerp van dit kerndoel.

### Score
8/8 criteria geslaagd (1 n.v.t.) · Bloom-balans: medium (goede spreiding onthouden→toepassen) · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** encryption-expert (puzzle-lab)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-pass; geen screenshots-map aangetroffen voor deze missie.

### Static analyse

#### ✅ Geslaagd
- **Puzzel-antwoordmodel feitelijk correct (kritiek voor puzzle-lab)**:
  - Caesar-cijfer: `YHLOLJ` met schuif 3 terug → zelf gedecodeerd (Python, letter-voor-letter modulo-26) → `VEILIG`. Config-antwoord (`encryption-expert.ts:34`: `['veilig', 'VEILIG']`) is exact correct.
  - Base64: `d2FjaHR3b29yZA==` → zelf gedecodeerd (Python `base64.b64decode`) → `wachtwoord`. Config-antwoord (`encryption-expert.ts:58`: `['wachtwoord', 'WACHTWOORD']`) is exact correct.
  - Public-key MC: correcte antwoord-optie ("Alleen Liam, want hij heeft de privésleutel") is cryptografisch juist voor asymmetrische encryptie — geverifieerd tegen de vraagstelling.
  - Wachtwoord-validator (`encryption-expert.ts:108-117`): regex-checks (`length>=12`, hoofdletter, cijfer, speciaal teken, niet-puur-alfabetisch) zijn logisch correct en dekken exact de 5 in de opdracht genoemde eisen. Voorbeeldoplossingen in de clues (bv. "Rood#Fiets9Boom!") voldoen zelf aan de validator (12+ tekens, hoofdletter, cijfer, `#`/`!`, niet puur-alfabetisch) — geverifieerd handmatig.
- **Punten/maxScore**: 4 puzzels × 25 punten = 100, exact gelijk aan `maxScore: 100` (encryption-expert.ts:16). Geen scoring-mismatch.
- **A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in de config. `validator` heeft expliciet `(input: string) => boolean`-signatuur.
- **A4 (imports)**: relatief pad `'../puzzleLabTypes'` (encryption-expert.ts:1) — consistent met alle overige puzzle-lab-configs (zelfde patroon in `data-handelaar.ts:1`), geen `@/*`-afwijking t.o.v. baseline.
- **A6 (restart-safe state)**: engine (`PuzzleLab.tsx:86`) gebruikt `useMissionAutoSave<PuzzleLabState>` — geldt voor alle puzzle-lab-missies inclusief deze.
- **A7 (security)**: geen leerling-input naar een AI-model in deze missie (geen chat) — promptSanitizer niet van toepassing; wachtwoord-input blijft client-side in de validator, gaat nergens naar een backend of AI.

#### ⚠️ Aandachtspunten
- **Inconsistente `revealExtraAfterAttempts`-waarde bij de public-key-puzzel** — `encryption-expert.ts:83`
  - **Wat:** de multiple-choice-puzzel "Wie kan het bericht lezen?" heeft `revealExtraAfterAttempts: 999`, terwijl de drie tekst-input-puzzels 2-3 gebruiken en zelf geen `extraClues`-array hebben (dus het veld is voor deze puzzel feitelijk irrelevant/dood, want er is niets om te onthullen).
  - **Risico:** geen functioneel risico — puzzel heeft geen `extraClues` dus de waarde heeft geen effect. Puur een stijl-inconsistentie t.o.v. de andere 3 puzzels in dezelfde config, die wél een bewuste 2-3-waarde kiezen.
  - **Voorstel:** optioneel opschonen naar een lagere placeholder-waarde of een korte comment (`// geen extraClues voor MC-vraag`) voor leesbaarheid bij toekomstig onderhoud. Niet blocking — geen leerling-impact.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server gestart in deze pass, geen screenshots-map voor `encryption-expert` aangetroffen. Ouder bewijs: missie stond in de live UI/UX-sweep van 2026-06-30 (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:122`) bij de best-scorende missies (gem. ≥4.0) — geen vervanging voor verse Chrome-plugin-verificatie, wel een signaal dat er geen bekende historische UI-problemen zijn.

### Score
Static: 6/7 criteria volledig geslaagd (1 kleine niet-blocking inconsistentie) · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: ship

---

## Samenvatting

| Rubric | Score | Aanbeveling |
|---|---|---|
| Design | 2/2 (5 n.v.t., engine-gebonden) | ship |
| Didactiek | 8/8 (1 n.v.t.) | ship |
| Tech | 6/7 (1 non-blocking) | ship |

**triageScore** = (10−0)×0.3 + (10−0)×0.4 + (10−1)×0.3 = 3.0 + 4.0 + 2.7 = **9.7**

**Eindoordeel: ship.** Geen blocking issues in alle drie rubrics. Puzzel-antwoordmodellen zijn feitelijk 100% correct (Caesar en Base64 zelf gedecodeerd en geverifieerd). Enige aandachtspunt is een cosmetische config-waarde zonder leerling-impact.

**Bekende context (niet-uniek, geen escalatie):** dormante chat-rol is een platform-breed templateType-beslispunt (puzzle-lab heeft per ontwerp geen chat); badge-kleurpatroon (`#202023`) en hex-tokenisatie zijn bekende engine-eigenschappen van alle puzzle-lab-missies.
