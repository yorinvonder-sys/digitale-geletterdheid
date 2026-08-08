# Review: data-journalist (data-viewer)

**Datum:** 2026-08-06 · **Reviewer:** M4 batch-review subagent (config-only, engine door aparte agent beoordeeld)
**Scope:** `src/features/missions/templates/data-viewer/configs/data-journalist.ts` + registraties in `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `missionGoals.ts`, en `config/agents/year2.tsx` (systemInstruction van de chat-rol, vereist door didactiek-criterium 8).

---

## 🎨 Design review

**Mission:** data-journalist (data-viewer) · **Reviewer:** dgskills-design-reviewer (Sonnet, config-only pass)

### ✅ Geslaagd
- **Copy-lengte** — `introDescription` (~30 woorden) en alle vraag-teksten (max ~20 woorden) ruim onder de leerjaar 1-2-grens van 80/60 woorden. `data-journalist.ts:8-9`
- **Kleurgebruik `chartData`** — hex-waarden `#ff3c21`, `#e1ff01`, `#202023` (`data-journalist.ts:98-103`) komen exact overeen met `duck-error`, `duck-acid`, `duck-ink`. Hardcoded omdat `chartData` een data-array is (geen className), dus geen echte tokenschending — wel technisch niet via een token-referentie, dus bij een toekomstige paletwijziging moet dit bestand ook worden bijgewerkt.
- **Knop-clarity / Framer Motion / a11y** — n.v.t. te beoordelen op configniveau; deze zitten in de gedeelde `DataViewer`-engine (aparte reviewer).

### ⚠️ Aandachtspunten
- **Visual Precision Gate: unverified** — deze config-only pass had geen toegang tot een draaiende dev-server/Chrome-plugin bewijs. Alignment, overlap, text-fit en responsive gedrag van de 3 datasettypes (tabel met 5 kolommen × 12 rijen, staafgrafiek met 6 balken, 4 document-cards) zijn niet dynamisch geverifieerd. **Vereist bevestiging door tech-reviewer / engine-data-viewer-reviewer voordat ship.**
- **Tabel-breedte** — dataset 1 heeft 5 sorteerbare kolommen × 12 rijen; op mobiel (375px) is een tabel met 5 kolommen een bekend risico voor horizontale scroll/afgeknotte tekst (bijv. "gevoel_na_gebruik"-waarden als "Ontspannen"). Kan alleen dynamisch bevestigd worden — flag voor tech-reviewer.

### ❌ Blocking issues
- Geen blocking issues op configniveau.

### Score
**7/10** — geen contentfouten, maar de verplichte Visual Precision Gate kon in deze pass niet bewezen worden. Aanbeveling: **fix-eerst** (dynamische verificatie vereist, geen contentwijziging nodig).

---

## 📚 Didactiek review

**Mission:** data-journalist (data-viewer) · **Curriculum-plek:** Leerjaar 2, Periode 1 "Data & Informatie" (eerste missie in de periode) · **SLO:** 21C, 22A (vso 18B, 19A)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig)** — `21C` (Data & Dataverwerking) en `22A` (Digitale producten) zijn geldige regulier-VO codes; VSO-mapping `18B`/`19A` aanwezig. `slo-kerndoelen-mapping.ts:101`
- **Criterium 2 (21C-fit)** — sterk onderbouwd: leerlingen sorteren/filteren een tabel, rekenen een gemiddelde uit, lezen een staafgrafiek en beoordelen brontypes. Dit is substantieel dataverwerking, niet oppervlakkig contact.
- **Criterium 4 (opdracht-beknoptheid)** — alle vraagteksten en dataset-beschrijvingen ruim binnen de leerjaar 1-2-grens.
- **Criterium 5 (taalniveau)** — toegankelijk Nederlands, concrete voorbeelden (schermtijd, TikTok/Instagram), geen onnodig jargon; "conflict of interest" en "meta-analyse" worden beide direct in de tekst uitgelegd (`data-journalist.ts:159`, `165`). Goed voor 13-14 jaar.
- **Criterium 7 (Bloom-balans)** — goede mix: onthouden/toepassen (q1, q4, q5), analyseren (q2, q3, q6), evalueren (q7, q8, followUp). Niet alleen recall.
- **Criterium 3 (leerdoelen)** — `missionGoals.ts:708-715` bevat een concreet, meetbaar `primaryGoal` + `score-threshold: 65` + expliciete `evidence`-omschrijving. Voldoet.
- **Criterium 9 (welzijn)** — geen gevoelige-onderwerp-risico's in de content zelf (fictieve schermtijddata, geen echte namen/scholen).

### ⚠️ Aandachtspunten
- **Criterium 2 — text-observation-vragen zonder rubric** — `q3-gevoel-observatie`, `q6-patroon-observatie`, `q8-instagram-probleem` (samen **25 van de 100 punten**) hebben `type: 'text-observation'` met `correctAnswer: ''` en geen keyword-lijst, minimum-woordenaantal of rubric in de config. `data-journalist.ts:74-79, 132-137, 196-201`
  - **Wat:** de config levert geen enkel toetsbaar criterium mee voor deze open vragen — alleen een `explanation`-tekst voor de leerling ná het antwoord.
  - **Waarom:** als de gedeelde `DataViewer`-engine deze vragen alleen op lengte beoordeelt (wat team-lead's kernvraag was), kan een leerling 25% van de score halen met inhoudsloze tekst van voldoende lengte, zonder de dataset te lezen.
  - **Voorstel:** dit is een engine-vraag, niet oplosbaar in deze config alleen — **escalatie naar de `engine-data-viewer`-reviewer** (zie `escalations` in de JSON-output) om te bevestigen hoe `text-observation` daadwerkelijk gegradeerd wordt. Zo niet keyword/semantisch: rubric-velden toevoegen aan het `DataViewerConfig`-type.
- **Criterium 6 (curriculum-plek)** — data-journalist is de eerste missie in "Data & Informatie" (Leerjaar 2, Periode 1). Geen voorkennis wordt verondersteld die niet al aanwezig is (sorteren/filteren/gemiddelde zijn basisvaardigheden) — logisch startpunt, geen sprong.

### ❌ Blocking issues
- **Criterium 2 — SLO 22A (Digitale producten) niet substantieel geraakt.** De mapping-comment bij deze missie zegt letterlijk: *"21B→22A: data-analyse + infographic maken = data + product"* (`slo-kerndoelen-mapping.ts:101`) — de claim veronderstelt dat leerlingen een infographic/digitaal product maken. De daadwerkelijke missie-config bevat **geen enkele product-maak-stap**: alle 8 vragen zijn multiple-choice, number-input of text-observation over bestaande datasets; er wordt niets ontworpen, opgeslagen of ingeleverd als product. `data-journalist.ts:47-202` bevat geen `type` die op productcreatie lijkt.
  - **Impact:** de missie claimt SLO `22A` maar toetst het niet. Dit is een misalignment tussen claim en werkelijkheid (criterium 2, expliciet "❌ Misalignment" in de rubric).
  - **Voorstel:** óf `22A` verwijderen uit `sloKerndoelen`/`sloVsoKerndoelen` (mission blijft dan puur `21C`), óf een echte product-stap toevoegen aan de missie (bijv. een `followUp`-achtige afsluitende opdracht "beschrijf welke visualisatie je zou kiezen en waarom" — nu is de `followUp` alleen een multiple-choice vraag over betrouwbaarheid, geen productontwerp).

- **Criterium 8 (AI-as-copilot) — chatcompanion beschrijft een andere missie dan wat er daadwerkelijk gespeeld wordt.** `chatRoleId: 'data-journalist'` (`data-journalist.ts:16`) koppelt aan `config/agents/year2.tsx:6-68`. De `systemInstruction` daar beschrijft een volledig ander missie-ontwerp:
  - "Je bent een ervaren Data Journalist die leerlingen coacht bij het analyseren van datasets **en het maken van infographics**" (regel 24)
  - Een `WERKWIJZE` met 4 open coach-stappen, incl. "Coach ze bij het ontwerpen van een infographic (op papier of digitaal)" (regel 47)
  - Een `STAP-VOLTOOIING`-mechanisme met `---STEP_COMPLETE:1/2/3---` markers (regels 58-61) — een patroon dat hoort bij scenario/chat-gedreven missies, niet bij het `data-viewer`-template (vaste datasets + vaste vragen, score-threshold-afronding via `missionGoals.ts`)
  - Het openingsbericht "We hebben een ruwe dataset liggen en jij moet er een verhaal van maken. [...] open de dataset" (regel 68-70) — de leerling heeft in deze missie geen "open te maken" losse dataset; de 3 datasets staan al vast in de UI.
  - **Impact:** een leerling die de chat gebruikt krijgt instructies (dataset zelf kiezen/openen, infographic bouwen, STEP_COMPLETE-voortgang) die niet overeenkomen met wat de `data-viewer`-template daadwerkelijk toont of scoort. Dit is verwarrend en misleidend, en het `STEP_COMPLETE`-mechanisme heeft vermoedelijk geen effect in een `data-viewer`-missie (geen stap-tracking in `missionGoals.ts`, dat werkt met `score-threshold`).
  - **Root cause (vermoeden, niet geverifieerd):** deze systemInstruction lijkt geschreven voor een oorspronkelijk chat-/scenario-gebaseerd ontwerp van "Data Journalist" en is niet bijgewerkt toen de missie als `data-viewer`-template werd geïmplementeerd.
  - **Voorstel:** herschrijf `systemInstruction` in `config/agents/year2.tsx` zodat de coach-rol aansluit bij de daadwerkelijke flow (leerling bekijkt 3 vaste datasets en beantwoordt vaste vragen) — coachen op *interpretatie* van de gegeven data i.p.v. op het "openen"/"kiezen" van een dataset en het bouwen van een infographic. Verwijder de `STEP_COMPLETE`-markers als het data-viewer-template die niet consumeert (verifiëren bij engine-reviewer).

### Score
**4/10** — 2 blocking issues (SLO-claim zonder dekking; chat-companion beschrijft een andere missie) + 1 belangrijk aandachtspunt (ongedekte text-observation-scoring). Aanbeveling: **fix-eerst**, geen volledig herontwerp — de kern-content (data, vragen, uitleg) is inhoudelijk sterk en feitelijk correct; het probleem zit in twee losse configuratiebronnen die niet zijn bijgewerkt.

---

## 🔧 Tech review (config-only, statisch)

**Mission:** data-journalist (data-viewer) · **Reviewer:** config-only pass — dynamische browserverificatie hoort bij de `engine-data-viewer`/tech-reviewer met dev-server-toegang.

### ✅ Geslaagd
- **Score-rekensom klopt exact.** Punten per vraag: q1=15, q2=20, q3=10 (dataset 1, subtotaal 45) + q4=10, q5=15, q6=10 (dataset 2, subtotaal 35) + q7=15, q8=5 (dataset 3, subtotaal 20) = **100**. `followUp.bonusPoints = 0` telt niet mee. Geconfigureerde `maxScore: 100` (`data-journalist.ts:206`) komt exact overeen — **geen rekenfout, geen onbereikbare punten.**
- **Badge-drempels bereikbaar.** Drempels 85/65/40/0 (`data-journalist.ts:208-233`) vallen allemaal binnen het bereik 0-100. Geen onbereikbare badge.
- **Feitelijke juistheid van de data zelf, nagerekend:**
  - q1 (meest gebruikte platform): TikTok komt 4× voor (Daan, Sara, Jayden, Tim) tegen Instagram/YouTube 3× en Snapchat 2× — `correctAnswer: 'TikTok'` klopt.
  - q2 (gemiddelde uren 14-jarigen): 14-jarigen zijn Daan(4.0), Liam(2.0), Noor(1.5), Fleur(1.0), Milan(3.0), Tim(3.5), Ravi(2.5) = 17,5 ÷ 7 = **2,5** — `correctAnswer: 2.5` klopt.
  - q5 (NL vs Japan verschil): 4,2 − 2,9 = **1,3** — `correctAnswer: 1.3` klopt.
  - followUp: `correctIndex: 1` wijst naar `'De bron en methode van dataverzameling'` — komt overeen met de `explanation`.
- **Unieke ids** — alle dataset- en question-ids (`enquete-social-media`, `schermtijd-landen`, `nieuwsberichten-social-media`, `q1`…`q8`) zijn uniek binnen deze config.

### ⚠️ Aandachtspunten
- **Geen dynamische verificatie mogelijk in deze pass** (geen dev-server-toegang toegewezen aan deze config-reviewer). Runtime-gedrag (rendering van 12-rijen-tabel op mobiel, sorteerbaarheid, chart-rendering, of `text-observation`-invoervelden daadwerkelijk vrije tekst accepteren) is niet bevestigd — zie `claimsVoorNaspelen`.
- **Type-conformiteit met `DataViewerConfig`** kon niet tegen de engine geverifieerd worden (buiten scope van deze review-opdracht). Geen zichtbare structurele afwijkingen in de config zelf.

### ❌ Blocking issues
- Geen blocking issues op configniveau.

### Score
**8/10** — data en rekensom zijn correct; het enige gat is dynamische verificatie die buiten de scope van deze config-only pass valt.

---

## Samenvatting & eindoordeel

| As | Score | Belangrijkste reden |
|---|---|---|
| Design | 7/10 | Geen contentfouten; Visual Precision Gate nog niet dynamisch bewezen |
| Didactiek | 4/10 | SLO 22A-claim ongedekt + chat-companion beschrijft een andere (infographic/STEP_COMPLETE) missie dan wat er echt gespeeld wordt |
| Tech | 8/10 | Score-rekensom en databronnen kloppen; dynamische verificatie ontbreekt |

**triageScore** = (10-7)×0,3 + (10-4)×0,4 + (10-8)×0,3 = 0,9 + 2,4 + 0,6 = **3,9**

**Eindoordeel: fix-eerst.** De datasets, vragen en uitleg zijn feitelijk correct, goed leeftijdspassend en didactisch sterk (Bloom-balans, brongebruik als kernthema). De blocking issues zitten niet in de kernmissie-content, maar in twee losse configuratiebronnen die niet zijn bijgewerkt toen de missie het `data-viewer`-template kreeg: de SLO-mapping-comment (22A/infographic) en de chat-companion-systemInstruction (STEP_COMPLETE/infographic-flow). Beide zijn gericht te herstellen zonder de missie-inhoud zelf te herschrijven.
