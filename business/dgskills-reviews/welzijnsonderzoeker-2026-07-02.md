# Review: welzijnsonderzoeker (wave 17, verse review)

**Datum:** 2026-07-02
**Template:** `data-viewer`
**Config:** `src/features/missions/templates/data-viewer/configs/welzijnsonderzoeker.ts`
**Registry:** `src/config/templateRegistry.ts:69` — `{ missionId: 'welzijnsonderzoeker', templateType: 'data-viewer' }` (géén `enableChat`)
**Curriculum:** Leerjaar 3, Periode 3 (Maatschappelijke Impact & Innovatie) — `src/config/curriculum.ts:291`
**SLO:** `23B` (Digitaal welzijn), `21C` (Data & Dataverwerking), `23C` (Maatschappij) — `src/config/slo-kerndoelen-mapping.ts:182`
**missionGoals:** `src/config/missionGoals.ts:699-707`

---

## 🎨 Design review

**Mission:** welzijnsonderzoeker (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (tokens)**: geen hardcoded className-hex; alle UI komt uit de gedeelde `DataViewer.tsx`-engine (duck-tokens consistent). Config zelf bevat geen JSX/className.
- **Criterium 3 (knop-clarity)**: knoppen ("Bevestigen", "Volgende dataset") zijn engine-verantwoordelijkheid, functioneel en gelabeld — geen missie-specifieke afwijking.
- **Criterium 4 (copy-lengte)**: `introDescription` = 30 woorden (grens 120), langste vraag (q7) = 23 woorden (grens 80). Ruim binnen leerjaar-3-normen.
- **Criterium 7 (toegankelijkheid basis)**: geen kleur-only informatie; feedback combineert icon (CheckCircle/XCircle) + tekst (engine-niveau, niet missie-specifiek).

### ⚠️ Aandachtspunten
- **chartData hex-kleuren vs. tokens** — `welzijnsonderzoeker.ts:121-126`
  - **Wat:** `chartData` gebruikt letterlijke hex (`#ff3c21`, `#202023`, `#e1ff01`) i.p.v. een verwijzing naar duck-tokens. `#ff3c21`=duck-error, `#202023`=duck-ink, `#e1ff01`=duck-acid — de waarden kloppen met het palet, maar staan als losse hex-strings in data, niet als token-namen.
  - **Waarom:** minor — dit is een dataprop (`SimpleChart` verwacht een hex-string, geen Tailwind-class), dus het is geen classNames-schending van Criterium 1. Wel een onderhoudsrisico: als het duck-palet ooit verschuift, moet dit bestand los worden bijgewerkt.
  - **Voorstel:** niet autoFixable stellen — dit is een repo-breed patroon in alle data-viewer-configs (bar-chart/pie-chart `chartData` gebruikt overal hex), geen missie-specifieke fout. Alleen vermelden, geen fix voorstellen.

### ❌ Blocking issues
- Geen.

### Visual Precision Gate
Niet uitgevoerd — geen screenshots-map aanwezig (`.ui-review` bestaat niet in de worktree) en `welzijnsonderzoeker` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 treffers). Status: **unverified** — geen dynamisch bewijs beschikbaar voor deze review-ronde.

### Score
4/4 statische criteria geslaagd (1 minor aandachtspunt, geen blocking) · Visual Precision Gate: unverified (geen screenshots) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** welzijnsonderzoeker (data-viewer)
**Curriculum-plek:** Leerjaar 3, Periode 3
**SLO-claim:** 23B, 21C, 23C
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: alle drie codes (23B, 21C, 23C) zijn geldige reguliere VO-codes — `slo-kerndoelen-mapping.ts:182`.
- **Criterium 2 (SLO-fit)**: sterk geraakt op alle drie. 21C (Data & Dataverwerking): leerlingen sorteren/filteren/berekenen gemiddelden uit een echte tabel (q1, q2, q3). 23B (Digitaal welzijn): thema is exact schermtijd/welzijn, met genuanceerde behandeling. 23C (Maatschappij): nationale CBS/Trimbos-vergelijking (dataset 2) plaatst individuele data in maatschappelijke context.
- **Criterium 3 (leerdoelen)**: geen expliciete `learningObjectives`-array, maar `introDescription` + `missionGoals.ts:699-707` (`primaryGoal`, `evidence`) formuleren impliciet een meetbaar doel: "onderscheid correlatie van oorzakelijkheid" — concreet en Bloom-passend (analyseren/evalueren).
- **Criterium 4 (opdracht-beknoptheid)**: geverifieerd — intro 30 woorden (<120), langste vraag 23 woorden (<80). Ruim binnen leerjaar-3-grenzen.
- **Criterium 5 (leeftijds-passend)**: taal is direct en herkenbaar (platformnamen als TikTok/Instagram/Snapchat, "Leeg", "Onrustig" als gevoelsomschrijvingen) — geen academisch jargon zonder uitleg. Termen als "correlatie" en "causaliteit" worden wél gebruikt (q6, q7) maar altijd meteen uitgelegd in de `explanation`-tekst.
- **Criterium 6 (curriculum-plek)**: logisch — periode 3 "Maatschappelijke Impact & Innovatie" bevat ook `tech-impact-analyst`, `digital-divide-researcher`, `sustainability-scanner`: welzijnsonderzoeker past thematisch (technologie-impact op individu/maatschappij) en bouwt voort op eerdere data-analyse-vaardigheden.
- **Criterium 7 (Bloom-balans)**: sterke mix — q2 is toepassen (rekenen), q1/q4 zijn analyseren (patroon herkennen in gesorteerde data), q3/q5/q7 zijn evalueren (nuance, verklaring, kritische reflectie), q6 is expliciet een "wat kun je NIET concluderen"-vraag (hogere-orde kritisch denken). Geen pure onthoud-vragen.
- **Criterium 8 (AI-as-copilot)**: n.v.t. — `enableChat` staat niet op de registry-entry (`templateRegistry.ts:69`) en geen agent-rol in `year3.tsx`. Geen chat-integratie voor deze missie, dus geen risico op AI-als-antwoordenmachine of client/server systemInstruction-drift.
- **Criterium 9 (welzijn & inclusiviteit)**: thema schermtijd/welzijn wordt **niet-stigmatiserend** behandeld. Geen enkele vraag/uitleg framet "veel schermtijd = slecht persoon" — integendeel, q3's explanation benoemt expliciet de nuance ("Kai heeft wél een limiet maar zit toch op 4.0 uur — een limiet alleen garandeert dus geen tevredenheid"), en q6/q7 waarschuwen actief tegen te simplistische causale claims over eigen mediagebruik.

### ⚠️ Aandachtspunten
- **Geen thema-specifiek doorverwijsgedrag in de content** — hele bestand
  - **Wat:** de missie behandelt schermtijd/welzijn/slaapkwaliteit/tevredenheid maar bevat zelf geen enkele verwijzing naar hulp (bijv. "voel je dat je schermtijd je hindert? praat erover") — de enige vangnet is de generieke, platform-brede `useWellbeingMonitor`/`WellbeingAlert` in `DataViewer.tsx:15-16,489-493,642`, die op tekst-patronen scant ongeacht missie-onderwerp.
  - **Waarom:** dit is een puur data-analyse-missie (leerlingen analyseren fictieve data van anderen, schrijven geen eigen ervaringen) — het risico dat een leerling eigen kwetsbaarheid onthult is laag, wat het ontbreken van thema-specifiek doorverwijsgedrag minder urgent maakt dan bij een missie die om persoonlijke reflectie vraagt.
  - **Voorstel:** geen autoFixable wijziging (welzijnsgevoelige content-wijzigingen zijn expliciet uitgesloten van auto-fix per opdracht). Optioneel voor een latere iteratie: één zin in `takeaways` of de intro die naar het platform-brede vangnet verwijst ("Herken je dit bij jezelf en wil je erover praten? Dat kan altijd."). Niet blocking — dit is een verbetersuggestie, geen fout.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23B (Digitaal welzijn)**: sterk geraakt — thema is exact dit kerndoel, met genuanceerde, niet-moraliserende behandeling.
- **21C (Data & Dataverwerking)**: sterk geraakt — leerlingen sorteren, filteren, berekenen gemiddelden en interpreteren drie datasettypen (tabel, staafgrafiek, trendtabel).
- **23C (Maatschappij)**: sterk geraakt — dataset 2 plaatst individueel gedrag in nationale context (CBS/Trimbos-vergelijking).

### Score
9/9 criteria geslaagd (1 niet-blokkerend aandachtspunt) · Bloom-balans: hoog (analyseren t/m evalueren, geen pure recall) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** welzijnsonderzoeker (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-ronde; geen `.ui-review`-screenshots aanwezig.

### Static analyse

#### ✅ Geslaagd
- **Data-viewer engine-criteria** (knop-handlers, error/loading-states, TS-discipline, `@/*`-imports, edge-function try/catch, `useMissionAutoSave`, security-sanitization) — allemaal engine-verantwoordelijkheid in `DataViewer.tsx`, niet missie-specifiek, en al gedekt door bekende platform-baseline. Niet opnieuw gerapporteerd (engine-issue, geen missie-issue).
- **Puntensom klopt exact**: q1(20) + q2(20) + q3(10) + q4(15) + q5(15) + q6(10) + q7(10) = **100** = `maxScore: 100` (`welzijnsonderzoeker.ts:210`). Geverifieerd met directe optelling — geen afwijking.
- **Geen `points:0`-patroon**: alle drie `text-observation`-vragen (q3, q5, q7) hebben substantiële punten (10, 15, 10) en tellen — conform `scoreQuestion()` in `DataViewer.tsx:79` — altijd als volle participatiepunten mee zodra ingediend. Dit is het gewenste gedrag; het bekende "slot-reflectie met points:0"-patroon komt hier NIET voor.
- **Antwoordmodel-verificatie (nagerekend tegen dataset, incl. cascade-check):**
  - **q2 (number-input, tolerantie 5%)**: filter `heeft_limiet='Ja'` → Kai(4.0) + Isabelle(2.5) + Prem(3.0) + Nadia(1.5) + Sofie(2.0) = 13.0 / 5 = **2.6** — `correctAnswer: 2.6` (`welzijnsonderzoeker.ts:95`) klopt exact. `scoreQuestion()` gebruikt `Math.abs(correct)*0.05` tolerantie = ±0.13, dus antwoorden 2.47–2.73 worden ook goedgekeurd — redelijke marge voor afronding.
  - **q1 (multiple-choice)**: sorteer op schermtijd hoog→laag — top-3 (Yassin 6.5/slaap2, Joren 5.5/slaap2, Luna 5.0/slaap2) hebben allen slaapkwaliteit 2; laagste schermtijd (Nadia 1.5/slaap5, Isabelle 2.5/slaap4) hebben hoge slaapkwaliteit. Patroon ondersteunt `correctAnswer: 'Meer schermtijd hangt samen met lagere slaapkwaliteit'` — klopt, en de explanation benoemt correct dat dit correlatie is, geen causaliteit.
  - **q4 (multiple-choice)**: `chartData` — Social media (2.8) > Gaming (1.9) > Streaming (1.6) > School (1.2) > Communicatie (0.9) > Creatief (0.4). `correctAnswer: 'Social media'` klopt — hoogste waarde.
  - **q6 (multiple-choice, "wat kun je NIET concluderen")**: trendtabel toont schermtijd stijgend (4.2→5.8) en welzijnsscore dalend (6.8→5.5) van januari→juni, maar april breekt het patroon (schermtijd daalt, welzijn stijgt t.o.v. maart) — ondersteunt dat causaliteit ("VEROORZAAKT") niet te trekken is uit deze data. `correctAnswer` correct; de drie afleiders zijn stuk voor stuk directe, correcte afleidingen uit de tabel (geen dubbelzinnigheid).
  - **q3, q5, q7 (text-observation)**: geen vast antwoordmodel nodig (`correctAnswer: ''`), altijd volle punten bij indiening — conform ontwerp. `explanation`-teksten zijn inhoudelijk correct en sluiten aan bij de brontabellen.
- **Geen chat/systemInstruction-risico**: `enableChat` ontbreekt op de registry-entry (`templateRegistry.ts:69`) en de config zelf specificeert geen `enableChat`/`chatRoleId`. Dus geen client/server systemInstruction-drift mogelijk voor deze missie — er is simpelweg geen chat-pad.
- **followUp niet gebruikt**: geen van de drie datasets heeft een `followUp`-blok — geen bonus-scoring-complexiteit om te verifiëren.

#### ⚠️ Aandachtspunten
Geen missie-specifieke technische aandachtspunten gevonden.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd deze ronde — geen dev-server, geen `.ui-review`-screenshots, en `welzijnsonderzoeker` staat niet in de vorige platform-brede UI/UX-audit (`docs/audits/student-missions-ui-ux-review-2026-06-30.md`, 0 treffers). Alle visuele/dynamische claims blijven **unverified**.

### Score
Static: 6/6 criteria geslaagd (0 issues) · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (met kanttekening dat dynamische/visuele verificatie nog een openstaand punt is, zoals bij vrijwel alle missies zonder recente screenshot-run)

---

## Samenvatting

| Aspect | Score | Verdict |
|---|---|---|
| Design | 8.5/10 | ship |
| Didactiek | 9.0/10 | ship |
| Tech | 9.0/10 | ship |

**triageScore** = (10-8.5)×0.3 + (10-9.0)×0.4 + (10-9.0)×0.3 = 0.45 + 0.40 + 0.30 = **1.15** (laag = goed)

**Eindverdict: ok** — geen fixes nodig. Alle antwoordmodellen kloppen na herberekening, puntensom is exact 100/100, thema wordt niet-stigmatiserend behandeld, geen chat-drift-risico (geen chat aanwezig). Enige kanttekeningen zijn niet-blokkerend: (1) geen visuele/screenshot-verificatie deze ronde (platform-breed openstaand punt, niet missie-specifiek), (2) optionele suggestie voor een thema-specifieke doorverwijszin (niet urgent gezien het non-personal, data-analyse-karakter van de missie).

**Geen autoFixable wijzigingen voorgesteld** — er zijn geen concrete fouten om te fixen.
