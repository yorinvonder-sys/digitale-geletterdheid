# Missie-review: Security Auditor

**Mission ID:** security-auditor
**Template:** puzzle-lab
**Curriculum-plek:** Leerjaar 3, Periode/week 2 (havo/vwo)
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 13, verse review)

---

## 🎨 Design review

**Score: 8.5/10**

### ✅ Geslaagd

- **Geen missie-specifieke tokenrisico's:** de config bevat geen eigen kleur-/token-definities — rendering loopt volledig via de gedeelde `PuzzleLab.tsx`-shell (engine-breed, geen per-missie afwijking). — `src/features/missions/templates/puzzle-lab/configs/security-auditor.ts`
- **Badge-progressie visueel coherent:** 4 badges (Stagiair Security → Junior Auditor → Ethisch Hacker → Senior Security Auditor) met oplopende `minScore` (0/40/70/90), geen gaten of overlap. — `security-auditor.ts:138-163`
- **Thematische consistentie:** emoji's (🛡️🔍🏆📋) en titels passen bij het security-auditor-thema, geen mismatch met de puzzle-inhoud.

### ⚠️ Aandachtspunten

- **Visual Precision Gate — unverified (bekend, engine-breed):** geen screenshots-map beschikbaar deze pass; `security-auditor` komt niet voor in de UI/UX-review van 2026-06-30 (`docs/audits/student-missions-ui-ux-review-2026-06-30.md`). Statische analyse toont geen missie-specifiek risico — dit is het systeem-brede punt (geen dev-server-run in scope), niet een missie-eigen bevinding.
- **Badge-kleuren tweemaal identiek:** `Junior Auditor` en `Ethisch Hacker` en `Stagiair Security` delen allemaal `color: '#202023'` (alleen topbadge heeft `#e1ff01`). — `security-auditor.ts:143,149,155,161`
  - **Voorstel:** laag-prioriteit, differentieer met een duck-acid-tint per tussenliggende badge; geen functioneel risico (emoji's zijn al onderscheidend).

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 8.0/10**
**SLO-claim:** 23A, 21A

### ✅ Geslaagd

- **SLO-codes correct en autoritair bevestigd:** `23A`, `21A` staan in `slo-kerndoelen-mapping.ts:168` en zijn consistent met `curriculum.ts:273` (yearGroup 3) en `year3.tsx:844-845` (yearGroup 3, havo/vwo). Geen mismatch tussen UI, curriculum en SLO-mapping.
- **`missionGoals.ts` coherent met puzzle-threshold:** `threshold: 70` valt exact samen met de "Ethisch Hacker"-badge-drempel (`minScore: 70`) — geen UX-gap tussen leerdoel-behaald en badge-behaald. — `missionGoals.ts:439-447`
- **Bloom-balans sterker dan gemiddeld:** puzzel 1-2 zijn Bloom 2 (herkennen/classificeren), puzzel 3 combineert herkenning met impact-redeneren, puzzel 4 is Bloom 3 (leerling formuleert zelf een technische aanbeveling in vrije tekst — geen multiple-choice). Dit is een sterker punt dan de meeste puzzle-lab-missies.
- **Ethisch kader consistent en expliciet:** `introDescription`, `systemInstruction` en `takeaways` herhalen allemaal "beschermen, niet breken" / "toestemming + verantwoordelijkheid" — didactisch coherent, geen dubbelzinnigheid richting leerlingen over wat wel/niet mag.
- **Leeftijdspassend niveau:** voorbeelden (webshop, zoekveld, reviewsectie) zijn herkenbaar voor leerjaar 3 havo/vwo; technische termen (prepared statements, CSP, sessiecookies) worden elke keer kort uitgelegd in de clues/successMessage, niet als kale jargon gedropt.

### ⚠️ Aandachtspunten

- **Ernst-classificatie in puzzel 2 is een verdedigbare maar niet-eenduidige simplificatie:**
  - **Wat:** De puzzel classificeert "geen HTTPS" als **Kritiek** boven "serverinfo-lek" (Hoog). In gangbare CVSS/OWASP-praktijk wordt ontbrekende HTTPS vaker als **Hoog** geclassificeerd (vereist een aanvaller met netwerktoegang/MITM-positie), terwijl "Kritiek" doorgaans gereserveerd is voor directe, voorwaardeloze compromise zoals de SQL-injectie uit puzzel 1 (die zonder enige voorwaarde de hele database teruggeeft). — `security-auditor.ts:53-76`
  - **Risico:** laag — de vraag zelf ("welke van deze 3 is het ernstigst?") en het antwoord (A boven B en C) blijven correct geordend; het is een classificatie-nuance, geen feitelijke fout. Op een webshop met betaalgegevens is "Kritiek" voor ontbrekende HTTPS ook verdedigbaar.
  - **Voorstel (optioneel, geen blocking):** wijzig de `successMessage` van "Geen HTTPS is kritiek op een webshop" naar "Geen HTTPS is minimaal Hoog, en op een webshop met betaalgegevens vaak Kritiek" — nuanceert zonder de puzzel-logica te wijzigen.
- **Stored XSS-uitleg gaat impliciet voorbij aan `HttpOnly`-cookies:**
  - **Wat:** Puzzel 3 stelt dat `document.cookie` via het geïnjecteerde script gestolen kan worden. Dat klopt alleen als de sessiecookie niet `HttpOnly` is ingesteld — een normale, moderne mitigatie die dit exacte diefstal-scenario blokkeert. — `security-auditor.ts:79-106`
  - **Risico:** zeer laag — dit is een gangbaar didactisch vereenvoudigingsniveau voor leerjaar 3 (de kernles "gebruikersinvoer nooit ongefilterd tonen" blijft correct en overdraagbaar), geen technisch onjuiste kernclaim.
  - **Voorstel (optioneel):** geen wijziging nodig voor dit niveau; bij een eventuele verdiepingsmissie zou `HttpOnly` als vervolgconcept kunnen worden geïntroduceerd.

### ❌ Blocking issues

Geen. SLO-codes kloppen, threshold/badge-drempel zijn coherent, en de enige inhoudelijke kanttekeningen zijn classificatie-nuances binnen het didactisch vereenvoudigingsniveau, geen feitelijke fouten die leerlingen verkeerd informeren.

---

## 🔧 Tech review

**Score: 8.5/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope; consistent met systeem-brede puzzle-lab-bevindingen — engine-lijst badge-patronen is bekend en niet missie-specifiek).

### Puzzel-antwoordmodellen — feitelijk zelf opgelost (encryption-expert-precedent)

| Puzzel | Zelf opgelost | Config-antwoord | Klopt? |
|---|---|---|---|
| `owasp-herkennen` | `' OR '1'='1` in zoekveld die volledige DB teruggeeft = klassiek SQL-injectie-voorbeeld (OWASP #1) | "SQL-injectie — invoer wordt als database-opdracht uitgevoerd" | ✅ |
| `ernst-classificatie` | Van de 3 (geen HTTPS / serverinfo-lek / typefout) is A het meest ernstig — B vereist al gedeeltelijke toegang, C is geen securityrisico | "A — geen HTTPS..." | ✅ (zie didactiek-nuance hierboven over Kritiek vs. Hoog) |
| `xss-scenario` | `<script>...document.cookie...evil.com</script>` opgeslagen + getoond aan alle bezoekers = Stored XSS, exfiltreert sessiecookie | "steelt de sessiecookies... accounts overnemen" | ✅ |
| `rapport-schrijven` | Vrije tekst; validator vereist `hasProblem` ∧ `hasSolution` ∧ lengte≥30 | custom `validator`-functie | ✅ — getest tegen het eigen voorbeeldantwoord uit `extraClues` ("Het zoekformulier is kwetsbaar voor SQL-injectie omdat invoer direct in queries wordt gebruikt. Gebruik prepared statements...") → bevat "sql"/"injectie"/"formulier"/"invoer" én "prepared"/"queries", lengte ruim >30 → **valideert correct** |

### Punten/maxScore — nagerekend

| Puzzel | Points |
|---|---|
| owasp-herkennen | 25 |
| ernst-classificatie | 25 |
| xss-scenario | 25 |
| rapport-schrijven | 25 |
| **Totaal** | **100** |

`maxScore: 100` (`security-auditor.ts:16`) — **klopt exact**, geen mismatch tussen som van `points` en `maxScore`.

### ✅ Geslaagd

- **Scoreplafond-consistentie:** som van `points` (4×25=100) = `maxScore` (100) = impliciet 100%-plafond voor topbadge (`minScore: 90`) — geen frustrerende UX-gap.
- **Badge-drempel ↔ missionGoal-threshold coherent:** `missionGoals.ts` threshold 70 = badge "Ethisch Hacker" drempel 70 — geen dubbele/conflicterende definitie van "geslaagd".
- **Validator-logica correct:** custom `validator` voor `rapport-schrijven` is functioneel getest tegen het eigen voorbeeldantwoord en accepteert het terecht; de OR-logica binnen `hasProblem`/`hasSolution` is breed genoeg om legitieme variatie toe te staan zonder de kern (probleem + oplossing benoemen) los te laten.
- **Geen onveilige content:** geen `dangerouslySetInnerHTML`, geen leerling-input die ongefilterd naar een AI-model gaat op configuratieniveau (chatlaag is engine-breed, niet missie-specifiek).
- **Geen verouderde/gevaarlijke security-adviezen:** prepared statements/parameterized queries voor SQLi, sanitization + CSP voor XSS, HTTPS-nadruk voor transport-security — alle drie zijn actuele, correcte, niet-verouderde best practices. `systemInstruction` bevat een expliciete scope guard tegen het uitvoeren van echte exploits ("Ethisch hacken = altijd binnen de afgesproken grenzen... geen tools nodig").
- **`revealExtraAfterAttempts`/`hintCost`/`maxAttempts` consistent:** alle 4 puzzels gebruiken de standaard engine-velden correct (geen `undefined`/ontbrekende velden), engine-gedreven rendering in `PuzzleLab.tsx` (bekend patroon, geen missie-issue).

### ⚠️ Aandachtspunten

- **Badge-patroon is engine-lijst (bekend, niet herhaald als missie-issue).**
- **Dormante chat-rol is platform-breed (bekend, niet herhaald als missie-issue).**
- **Briefing-afbeelding is platform-breed (bekend, niet herhaald als missie-issue).**

### ❌ Blocking issues

Geen.

---

## Samenvatting

- **Geslaagd:** design 3/4 substantiële criteria · didactiek 5/5 kerncriteria (SLO, threshold-coherentie, Bloom-balans, ethisch kader, leeftijdsniveau) · tech 5/5 (puzzel-feitelijkheid, puntentelling, validator, security-adviezen, badge-coherentie)
- **Blocking:** 0
- **Resterende issues:** 1 design (badge-kleuren driemaal identiek, cosmetisch) · 2 didactiek (Kritiek-vs-Hoog-classificatienuance in puzzel 2, `HttpOnly`-vereenvoudiging in puzzel 3 — beide optioneel, geen fout)
- **Sterkste punt:** alle 4 puzzel-antwoordmodellen zijn feitelijk correct geverifieerd (zelf opgelost), puntentelling klopt exact (100=100), en de missie combineert Bloom 2 (herkennen/classificeren) met een echte Bloom 3-vrije-tekstopdracht — sterker dan gemiddeld voor puzzle-lab
- **Grootste resterend risico:** geen functioneel risico; de enige kanttekeningen zijn vakinhoudelijke nuances (CVSS-classificatiegraad, cookie-mitigatie) die het didactische vereenvoudigingsniveau voor leerjaar 3 niet overschrijden

**Triage-score:** 1.70 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3)

**Verdict: gezond** (geen blocking, resterende punten zijn optionele verfijningen, geen showstoppers)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 13) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing als de optionele didactiek-nuances worden doorgevoerd.
