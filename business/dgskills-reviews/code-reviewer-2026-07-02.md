# Missie-review: Code Reviewer (`code-reviewer`)

**Datum:** 2026-07-02
**TemplateType:** `simulation-lab`
**Config:** `src/features/missions/templates/simulation-lab/configs/code-reviewer.ts`
**Wave:** 12 (verse review)

## Samenvatting

De missie "Code Reviewer" leert leerlingen (leerjaar 2, jaar 2 periode 2) code
beoordelen op leesbaarheid, het DRY-principe en constructieve feedback via
de sandwich-methode. Config, agent-rol, SLO-mapping en curriculum-plaatsing
zijn intern consistent. Scoring is exact correct (30+40+30=100). Alle
feitelijke code-review-concepten kloppen. Eén klein UI-consistentie-punt in
Sim 3 (comparison-icoon-mix).

## Stap A — Registratie & consistentie

| Onderdeel | Bestand | Status |
|---|---|---|
| Config | `src/features/missions/templates/simulation-lab/configs/code-reviewer.ts` | OK |
| Agent-rol | `src/config/agents/year2.tsx:1016` | OK, exact `'code-reviewer'` |
| SLO-mapping | `src/config/slo-kerndoelen-mapping.ts:115` | OK — `22A` (Digitale producten), `22B` (Programmeren), VSO `19A` |
| Curriculum | `src/config/curriculum.ts:187` | OK — jaar 2, periode 2 ("Programmeren & Computational Thinking") |
| missionGoals | `src/config/missionGoals.ts:468-476` | OK — `rounds-complete`, min 3 |
| Registry-wiring | `src/features/missions/templates/simulation-lab/SimulationLab.tsx:458` | OK |

Geen mismatch tussen UI-registratie en SLO-mapping. `missionId` stabiel
(`code-reviewer`), geen verwarring met de losstaande review-arena-missies
`code-review-2` / `advanced-code-review` (bevestigd: andere bestanden, andere
templateType).

### Sim-scoring nagerekend

| Simulatie | Vragen (punten) | Som | Declared `maxScore` |
|---|---|---|---|
| `code-leesbaarheid` | 10+10+10 | 30 | 30 ✓ |
| `dry-principe` | 15+15+10 | 40 | 40 ✓ |
| `feedback-methode` | 10+10+10 | 30 | 30 ✓ |
| **Totaal** | | **100** | config `maxScore: 100` ✓ |

Geen rekenfout. `computeVisuals` is een pure switch/case zonder `eval`,
correct per SimulationLab-contract.

### Feitelijke juistheid code-review-content

Alle drie de kernconcepten zijn software-engineering-correct:
- **Leesbaarheid**: naamgeving (`temp2` vs. `gebruikersLeeftijd`), commentaar
  bij complexe logica (niet overal), consistente inspringing voor
  structuurherkenning — standaard clean-code-principes, correct uitgelegd.
- **DRY-principe**: definitie klopt ("dezelfde logica maar één keer, hergebruik
  via functies"), magische getallen-voorbeeld (`0.21` → `BTW_TARIEF`) is een
  correct en herkenbaar Nederlands voorbeeld, vijf-plekken-vraag test het
  onderhoudsprobleem correct.
- **Feedbackmethode**: sandwich-methode correct gedefinieerd (positief →
  verbeterpunt met uitleg → positief), het contrast "Dit is slechte code" vs.
  "De functienaam geeft niet aan wat de functie doet" is een sterk,
  onderwijskundig voorbeeld van vaag vs. actionable feedback.

Geen feitelijke fouten gevonden in de reviewer-content.

## Stap B — UI/UX-auditrapport & screenshots

- `code-reviewer` komt **niet voor** in
  `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (geen treffer bij
  grep). Geen eerdere UI/UX-bevindingen om tegen te toetsen.
- Geen screenshots-map aanwezig voor deze missie (`.ui-review/` bevat geen
  `code-reviewer`-artefacten). Visuele verificatie kon niet worden herhaald
  vanuit bestaand beeldmateriaal binnen de token-discipline van deze review.

## Stap C — Rubric-scores (0-10 kwaliteit, 10 = uitstekend)

### Design: 8/10
- Intro, features en badges zijn helder en progressief opgebouwd (5 badge-
  niveaus van "Aan het leren" tot "Senior Reviewer").
- **Voorstel:** Sim 3 (`feedback-methode`, optie "Alleen positief") mengt een
  asset-icoon (`/assets/brand/ui-icons/dgskills-duck-happy.webp`) met emoji-
  iconen (`👍`, `🙈`) in dezelfde `leftItems`-lijst. De andere twee
  comparison-varianten (`Afkraken`, `Sandwich-methode`) gebruiken consistent
  alleen emoji. Dit is een klein visueel inconsistentie-punt, geen
  functionele bug.

  ```ts
  // src/features/missions/templates/simulation-lab/configs/code-reviewer.ts:128
  // VOOR
  leftItems: [
      { icon: '/assets/brand/ui-icons/dgskills-duck-happy.webp', label: '"Ziet er goed uit!"' },
      { icon: '👍', label: '"Prima gedaan!"' },
      { icon: '🙈', label: 'Problemen bewust niet noemen' },
  ],

  // NA (consistent emoji, zoals de andere twee methoden)
  leftItems: [
      { icon: '😊', label: '"Ziet er goed uit!"' },
      { icon: '👍', label: '"Prima gedaan!"' },
      { icon: '🙈', label: 'Problemen bewust niet noemen' },
  ],
  ```
- Briefing-afbeelding (`/assets/agents/code-reviewer.webp`) niet lokaal
  aanwezig in de worktree — **platform-breed bekend probleem, niet opnieuw
  gerapporteerd.**

### Didactiek: 9/10
- Sandwich-methode is coherent verweven tussen agent-`systemInstruction`
  (STAP-VOLTOOIING, WERKWIJZE) en Sim 3 — een sterk voorbeeld van
  cross-component didactische consistentie.
- Drie-staps-opbouw (lezen → feedback geven → implementeren) volgt het
  platform-brede 3-stappenpatroon (erkenning, korte uitleg, challenge).
- Vragen testen begrip, niet enkel herkenning (bijv. de "vijf keer aanpassen"-
  vraag test toepassing van DRY, niet enkel de definitie).
- Geen kritiekpunt van gewicht; kleine kanttekening dat sim 2 drie vragen
  heeft met puntenverdeling 15/15/10 terwijl sim 1 en 3 een gelijkmatige
  10/10/10 hanteren — inhoudelijk verdedigbaar (vraag 3 van sim 2 is enigszins
  eenvoudiger), geen actie nodig.

### Techniek: 9/10
- Scoring-integriteit volledig correct (zie Stap A).
- `computeVisuals` is zuiver, geen zij-effecten, correct per
  `simId`-discriminatie.
- Registry- en mapping-consistentie volledig kloppend.
- Enige punt is het icoon-mix-issue hierboven (technisch triviaal, telt hier
  mee als kleine implementatie-onzorgvuldigheid, niet als bug).

### triageScore

```
triageScore = (10-8)*0.3 + (10-9)*0.4 + (10-9)*0.3
            = 2*0.3 + 1*0.4 + 1*0.3
            = 0.6 + 0.4 + 0.3
            = 1.3
```

**triageScore: 1.3** (laag = weinig urgentie; missie is in goede staat).

## Conclusie

`code-reviewer` is een kwalitatief sterke missie: correcte content, kloppende
scoring, volledige registratie-consistentie. Eén cosmetisch Voorstel-punt
(icoon-consistentie in Sim 3). Geen blokkerende issues. Geen wijzigingen
doorgevoerd in deze reviewronde (review-only).
